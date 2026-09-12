/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Scale,
  Calculator,
  Download,
  Share2,
  Copy,
  Check,
  Code,
  Search,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileText,
  Eye,
  Globe,
} from 'lucide-react';
import { KnowledgeTopic } from '../types';
import { generateTopicJsonLdSchema } from '../data/seoKnowledgeBase';
import { seoEngine } from '../services/seoAndMetadataEngine';
import { pdfEngine } from '../services/pdfWhitepaperEngine';

interface SeoTopicReaderModalProps {
  topic: KnowledgeTopic | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onAskKiaanAI?: (prompt: string) => void;
  onOpenProjectBySlug?: (slug: string) => void;
}

export const SeoTopicReaderModal: React.FC<SeoTopicReaderModalProps> = ({
  topic,
  isOpen,
  onClose,
  theme = 'dark',
  onAskKiaanAI,
  onOpenProjectBySlug,
}) => {
  const [activeTab, setActiveTab] = useState<'ARTICLE' | 'SEO_INSPECTOR' | 'SCHEMA_JSON'>('ARTICLE');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen && topic) {
      const seoPayload = seoEngine.getSeoTopicSeo(topic);
      seoEngine.applyToDocument(seoPayload);
      seoEngine.injectMediaSeoMetadata({
        images: [
          {
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
            title: topic.title,
            caption: topic.simpleEnglishSummary,
            category: 'INFOGRAPHIC',
            isCover: true,
          },
        ],
        context: {
          entityType: 'TOPIC',
          entityTitle: topic.title,
          locality: 'Pune',
        },
      });
    }
  }, [isOpen, topic]);

  if (!isOpen || !topic) return null;

  const isDark = theme === 'dark';
  const jsonLdSchema = generateTopicJsonLdSchema(topic);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(jsonLdSchema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleCopyLink = () => {
    const url = `https://westernluxuryestates.com/journal/${topic.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadPdf = () => {
    if (!topic) return;
    setIsDownloading(true);
    try {
      const success = pdfEngine.generateTopicWhitepaperPdf(topic);
      if (success) {
        setTimeout(() => {
          setIsDownloading(false);
        }, 2000);
      } else {
        setIsDownloading(false);
      }
    } catch (err) {
      console.error('Failed to download topic PDF:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div
      id="seo-topic-reader-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all ${
          isDark
            ? 'bg-[#090F1E] border-amber-500/30 text-white shadow-black/90'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`p-4 sm:p-6 border-b flex items-center justify-between gap-4 ${
            isDark ? 'border-white/10 bg-[#0B1426]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow-md">
              {topic.categoryLabel}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                isDark ? 'border-white/20 text-white/70' : 'border-slate-300 text-slate-600'
              }`}
            >
              SEO Score: {topic.seoMeta.seoScore}/100 • {topic.seoMeta.searchVolumeMonthlyEst}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark ? 'border-white/10 hover:bg-white/10 text-white/80' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Copy Canonical URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Article vs SEO SERP Inspector vs JSON-LD Schema) */}
        <div
          className={`px-6 pt-3 flex items-center gap-2 border-b text-xs font-semibold overflow-x-auto ${
            isDark ? 'border-white/10 bg-[#0A1020]' : 'border-slate-200 bg-slate-100'
          }`}
        >
          <button
            onClick={() => setActiveTab('ARTICLE')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'ARTICLE'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Humanized Article & Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('SEO_INSPECTOR')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'SEO_INSPECTOR'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Google & AI SERP Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('SCHEMA_JSON')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'SCHEMA_JSON'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>JSON-LD Schema Markup</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 font-sans">
          {activeTab === 'ARTICLE' && (
            <div className="space-y-8">
              {/* Title & Statutory Tag */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-current leading-tight">
                  {topic.title}
                </h1>
                {topic.statutoryRuleOrSection && (
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <Scale className="w-4 h-4 shrink-0" />
                    <span>Statutory Authority: {topic.statutoryRuleOrSection}</span>
                  </div>
                )}
              </div>

              {/* Simple English Summary Callout */}
              <div
                className={`p-5 rounded-2xl border space-y-2 leading-relaxed ${
                  isDark
                    ? 'bg-gradient-to-br from-amber-500/10 via-[#0C152B] to-[#0A1020] border-amber-500/30'
                    : 'bg-amber-50/80 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
                  <Sparkles className="w-4 h-4" />
                  <span>Simple English Executive Summary</span>
                </div>
                <p className="text-sm sm:text-base font-medium opacity-90">
                  {topic.simpleEnglishSummary}
                </p>
              </div>

              {/* Humanized Detailed Explanation */}
              <div className="space-y-3">
                <h3 className="text-lg font-serif font-bold text-current">
                  Detailed Explanation & Context
                </h3>
                <p className="text-sm sm:text-base opacity-80 leading-relaxed">
                  {topic.humanizedExplanation}
                </p>
              </div>

              {/* Practical Calculation / Real-World Example */}
              {topic.practicalExample && (
                <div
                  className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                    isDark ? 'bg-[#0E172E] border-emerald-500/30' : 'bg-emerald-50/60 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Calculator className="w-4 h-4" />
                    <span>Real-World Scenario & Calculation</span>
                  </div>

                  <h4 className="text-base font-bold text-current">
                    {topic.practicalExample.scenarioTitle}
                  </h4>

                  <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                    {topic.practicalExample.scenarioText}
                  </p>

                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm font-mono leading-relaxed ${
                      isDark ? 'bg-black/50 border-emerald-500/30 text-emerald-300' : 'bg-white border-emerald-300 text-emerald-900'
                    }`}
                  >
                    <strong>Financial Outcome:</strong> {topic.practicalExample.calculationOrOutcome}
                  </div>
                </div>
              )}

              {/* Common Pitfalls & Action Checklist in 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pitfalls */}
                <div
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Common Pitfalls to Avoid</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm opacity-85">
                    {topic.commonPitfalls.map((pitfall, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Action Checklist */}
                <div
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Action Checklist</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm opacity-85">
                    {topic.keyActionChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQs Accordion */}
              {topic.faqs && topic.faqs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>Frequently Asked Questions</span>
                  </div>

                  <div className="space-y-3">
                    {topic.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border space-y-2 ${
                          isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <h5 className="text-xs sm:text-sm font-bold text-current">
                          {faq.question}
                        </h5>
                        <p className="text-xs opacity-80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'SEO_INSPECTOR' && (
            <div className="space-y-6">
              {/* Google SERP Live Simulation Card */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  Google & Bing Search Result Card Preview
                </span>
                <div
                  className={`p-5 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-[#121929] border-white/15' : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-blue-400">https://westernluxuryestates.com</span>
                    <span>› journal › {topic.slug}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-blue-400 hover:underline cursor-pointer">
                    {topic.seoMeta.metaTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <span>★★★★★</span>
                    <span className="opacity-80">Rating: 4.9 • 1,280 votes • Real Estate Tax & Legal</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 opacity-90 leading-relaxed">
                    {topic.seoMeta.metaDescription}
                  </p>
                </div>
              </div>

              {/* SEO Score Breakdown Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-2xl border text-center space-y-1 ${
                    isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-2xl font-bold text-emerald-400">{topic.seoMeta.seoScore}/100</div>
                  <div className="text-[11px] opacity-70">Overall SEO Score</div>
                </div>

                <div
                  className={`p-4 rounded-2xl border text-center space-y-1 ${
                    isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-2xl font-bold text-amber-400">{topic.seoMeta.readabilityScore}/100</div>
                  <div className="text-[11px] opacity-70">Flesch Readability</div>
                </div>

                <div
                  className={`p-4 rounded-2xl border text-center space-y-1 ${
                    isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-2xl font-bold text-blue-400">{topic.seoMeta.searchVolumeMonthlyEst}</div>
                  <div className="text-[11px] opacity-70">Estimated Search Volume</div>
                </div>

                <div
                  className={`p-4 rounded-2xl border text-center space-y-1 ${
                    isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-2xl font-bold text-purple-400">{topic.seoMeta.structuredDataSchemaType}</div>
                  <div className="text-[11px] opacity-70">Schema Org Type</div>
                </div>
              </div>

              {/* Focus Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  Target Intent Keywords (High CPC & Volume)
                </span>
                <div className="flex flex-wrap gap-2">
                  {topic.searchIntentKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl text-xs border ${
                        isDark ? 'bg-white/5 border-white/10 text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SCHEMA_JSON' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                    Google Rich Snippets JSON-LD Code
                  </span>
                </div>

                <button
                  onClick={handleCopySchema}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied to Clipboard' : 'Copy JSON-LD'}</span>
                </button>
              </div>

              <pre
                className={`p-4 rounded-2xl text-xs font-mono overflow-x-auto border max-h-96 ${
                  isDark ? 'bg-black/80 border-white/10 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
                }`}
              >
                {jsonLdSchema}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div
          className={`p-4 sm:p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'border-white/10 bg-[#0B1426]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          {onAskKiaanAI && (
            <button
              onClick={() => {
                onAskKiaanAI(
                  `Can you give me a personalized explanation and real-world calculation for: "${topic.title}"?`
                );
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI About This Topic</span>
            </button>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadPdf}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isDark ? 'border-white/15 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'
              }`}
            >
              {isDownloading ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              <span>{isDownloading ? 'Generating Brief...' : 'Download PDF Brief'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
