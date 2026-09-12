/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  CheckCircle,
  FileText,
  Download,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  Building,
  Quote,
  TrendingUp,
  Tag,
  Check,
  Copy,
} from 'lucide-react';
import { BlogPost } from '../types';
import { seoEngine } from '../services/seoAndMetadataEngine';
import { pdfEngine } from '../services/pdfWhitepaperEngine';
import { SeoImage } from './SeoImage';

interface BlogArticleModalProps {
  article: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onOpenProjectBySlug?: (slug: string) => void;
  onAskKiaanAI?: (prompt: string) => void;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  theme = 'dark',
  onOpenProjectBySlug,
  onAskKiaanAI,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const isDark = theme === 'dark';

  // Automated SEO & Schema.org ImageObject Injection
  useEffect(() => {
    if (isOpen && article) {
      const seoPayload = seoEngine.getBlogArticleSeo(article);
      seoEngine.applyToDocument(seoPayload);
      seoEngine.injectMediaSeoMetadata({
        images: [
          {
            url: article.coverImage,
            title: article.title,
            caption: article.subtitle,
            category: 'COVER',
            isCover: true,
          },
          ...(article.author?.avatar
            ? [
                {
                  url: article.author.avatar,
                  title: article.author.name,
                  category: 'AVATAR',
                },
              ]
            : []),
        ],
        context: {
          entityType: 'BLOG',
          entityTitle: article.title,
          authorName: article.author?.name,
          authorRole: article.author?.role,
          locality: 'Pune',
        },
      });
    }
  }, [isOpen, article]);

  if (!isOpen || !article) return null;

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} — Read on Kiaan Properties Journal: ${url}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleDownloadReport = () => {
    if (!article) return;
    setIsGeneratingPdf(true);
    try {
      const success = pdfEngine.generateBlogWhitepaperPdf(article);
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 4000);
      }
    } catch (err) {
      console.error('PDF Whitepaper generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      id="blog-article-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="blog-article-modal-container"
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isDark
            ? 'bg-[#080D1A] border-amber-500/20 text-white shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isDark ? 'bg-[#0B1222]/90 border-white/10' : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {article.categoryLabel}
            </span>
            <span className="text-xs opacity-50 hidden sm:inline">• {article.readTimeMinutes} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download Whitepaper PDF"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className={`w-3.5 h-3.5 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500 text-black border-amber-500 font-bold'
                  : isDark
                  ? 'border-white/10 hover:bg-white/10 text-white/80'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title={isBookmarked ? 'Saved to reading list' : 'Bookmark article'}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                  : isDark
                  ? 'border-white/10 hover:bg-white/10 text-white/80'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Share article"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/10 hover:bg-white/10 text-white/80'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Close article"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
          {/* Article Header & Title */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-current leading-tight">
              {article.title}
            </h1>
            <p className="text-base sm:text-lg opacity-80 leading-relaxed font-sans">
              {article.subtitle}
            </p>

            {/* Author Bar & Metadata */}
            <div
              className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <SeoImage
                  src={article.author.avatar}
                  alt={seoEngine.generateMediaAltText({
                    entityType: 'BLOG',
                    mediaCategory: 'AVATAR',
                    authorName: article.author.name,
                    authorRole: article.author.role,
                  })}
                  context={{
                    entityType: 'BLOG',
                    mediaCategory: 'AVATAR',
                    authorName: article.author.name,
                    authorRole: article.author.role,
                  }}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
                />
                <div>
                  <div className="font-bold text-sm text-current">{article.author.name}</div>
                  <div className="text-xs text-amber-500 font-medium">{article.author.role}</div>
                  {article.author.credentials && (
                    <div className="text-[10px] opacity-60">{article.author.credentials}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs opacity-70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{article.readTimeMinutes} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-96 w-full border border-white/10 shadow-lg">
            <SeoImage
              src={article.coverImage}
              alt={seoEngine.generateMediaAltText({
                entityType: 'BLOG',
                entityTitle: article.title,
                locality: 'Pune',
              })}
              context={{
                entityType: 'BLOG',
                entityTitle: article.title,
                locality: 'Pune',
              }}
              priority={true}
              showSeoBadge={true}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Kiaan Properties Research Desk • Verified Editorial
              </span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {article.viewCount?.toLocaleString() || '12,500'} readers
              </span>
            </div>
          </div>

          {/* AI Audio Summary Player Simulator */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center font-bold shadow-md cursor-pointer transition-transform hover:scale-105"
                title={isPlayingAudio ? 'Pause AI voice narration' : 'Play AI voice narration'}
              >
                {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to 2-Min Executive Audio Briefing</span>
                </div>
                <div className="text-[11px] opacity-75">
                  {isPlayingAudio ? 'Playing AI Studio Voice Synthesizer • 0:48 / 2:15' : 'Synthesized by Kiaan Neural Audio Engine'}
                </div>
              </div>
            </div>

            {onAskKiaanAI && (
              <button
                onClick={() => {
                  onAskKiaanAI(`Can you explain the key points of the article: "${article.title}" and how it applies to my property purchase in Pune?`);
                  onClose();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold border border-amber-500/40 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Kiaan AI</span>
              </button>
            )}
          </div>

          {/* Executive Overview & Key Takeaways Card */}
          <div
            className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0C1427] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Executive Summary & Key Takeaways</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed opacity-90 font-medium">
              {article.content.overview}
            </p>

            <div className="space-y-2 pt-2 border-t border-current/10">
              {article.content.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="opacity-90">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* In-Depth Article Sections */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed opacity-90">
            {article.content.sections.map((sec, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-current border-b pb-2 border-current/10">
                  {sec.heading}
                </h2>
                {sec.body.map((para, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {para}
                  </p>
                ))}

                {/* Stat Metric Callout if present */}
                {sec.statCallout && (
                  <div
                    className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                      isDark ? 'bg-white/[0.04] border-amber-500/30' : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block">
                        Verified Metric
                      </span>
                      <span className="text-xs sm:text-sm opacity-80">{sec.statCallout.label}</span>
                      <span className="text-[10px] opacity-50 block mt-1">Source: {sec.statCallout.source}</span>
                    </div>
                    <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 shrink-0">
                      {sec.statCallout.metric}
                    </div>
                  </div>
                )}

                {/* Quote Callout if present */}
                {sec.quote && (
                  <div
                    className={`p-6 rounded-2xl border-l-4 border-amber-500 my-4 ${
                      isDark ? 'bg-white/[0.02]' : 'bg-slate-50'
                    }`}
                  >
                    <Quote className="w-6 h-6 text-amber-500 mb-2 opacity-60" />
                    <p className="font-serif italic text-base sm:text-lg mb-2 text-current">
                      "{sec.quote.text}"
                    </p>
                    <div className="text-xs font-bold text-amber-400">
                      — {sec.quote.author}, <span className="opacity-75 font-normal">{sec.quote.title}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Downloadable PDF Whitepaper Banner */}
          <div
            className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-amber-500/30' : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Complimentary Research Whitepaper & Dossier
                </span>
                <h4 className="font-serif font-bold text-sm sm:text-base text-current">
                  {article.content.downloadableReportPdf?.title || `${article.title} (Official Research Whitepaper)`}
                </h4>
                <p className="text-xs opacity-60">
                  Formatted Print-Ready PDF • Complete Statutory Tables • MahaRERA & Tax Act Verified
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105 shrink-0"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Whitepaper Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Whitepaper PDF'}</span>
                </>
              )}
            </button>
          </div>

          {/* Statutory Disclaimer */}
          {article.content.statutoryDisclaimer && (
            <div
              className={`p-4 rounded-2xl border text-[11px] leading-relaxed opacity-70 ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Editorial & MahaRERA Advisory Disclaimer</span>
              </div>
              <p>{article.content.statutoryDisclaimer}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-current/10">
            <span className="text-xs font-bold opacity-60 mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Tags:
            </span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs border ${
                  isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Projects Callout */}
          {article.content.relatedProjectSlugs && article.content.relatedProjectSlugs.length > 0 && onOpenProjectBySlug && (
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isDark ? 'bg-[#090F1E] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-base text-current">Featured Developments In This Report</h4>
              </div>
              <p className="text-xs opacity-75">
                Explore verified 3D digital twins and live inventory for developments referenced in this analysis:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {article.content.relatedProjectSlugs.map((slug, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onOpenProjectBySlug(slug);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                  >
                    <span>View {slug.replace(/-/g, ' ').replace('kiaan', 'Kiaan').toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
