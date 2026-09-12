/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Download,
  Share2,
  FileText,
  Check,
  Bookmark,
  ChevronRight,
  Tag,
  Filter,
  User,
  SlidersHorizontal,
  ExternalLink,
  Building,
  HelpCircle,
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../types';
import { BLOG_CATEGORIES, INITIAL_BLOG_POSTS } from '../data/blogData';
import { BlogArticleModal } from './BlogArticleModal';
import { SeoEncyclopediaExplorer } from './SeoEncyclopediaExplorer';
import { SeoImage } from './SeoImage';
import { seoEngine } from '../services/seoAndMetadataEngine';
import { pdfEngine } from '../services/pdfWhitepaperEngine';

interface BlogIntelligenceViewProps {
  theme?: 'dark' | 'light';
  onNavigateToTab?: (tab: string) => void;
  onOpenProjectBySlug?: (slug: string) => void;
  onAskKiaanAI?: (prompt: string) => void;
}

export const BlogIntelligenceView: React.FC<BlogIntelligenceViewProps> = ({
  theme = 'dark',
  onNavigateToTab,
  onOpenProjectBySlug,
  onAskKiaanAI,
}) => {
  const [viewMode, setViewMode] = useState<'EDITORIAL' | 'ENCYCLOPEDIA_1000'>('EDITORIAL');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(16);
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const [emailSub, setEmailSub] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isDark = theme === 'dark';

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    INITIAL_BLOG_POSTS.forEach((post) => {
      post.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, []);

  // Filtered posts based on category, search query, and tag
  const filteredPosts = useMemo(() => {
    return INITIAL_BLOG_POSTS.filter((post) => {
      const matchCat = selectedCategory === 'ALL' || post.category === selectedCategory;
      const matchTag = !selectedTag || post.tags.includes(selectedTag);
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchTag && matchSearch;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const remainingPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);
  const displayedRemainingPosts = remainingPosts.slice(0, visibleCount);

  const handleDownloadReport = (title: string) => {
    setDownloadingPdf(title);
    try {
      // Find matching article if exists, otherwise generate library whitepaper
      const matched = INITIAL_BLOG_POSTS.find(
        (p) => p.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(p.title.toLowerCase())
      );
      if (matched) {
        pdfEngine.generateBlogWhitepaperPdf(matched);
      } else {
        pdfEngine.generateNamedLibraryWhitepaper(title);
      }
    } catch (err) {
      console.error('Failed to generate whitepaper PDF:', err);
    } finally {
      setTimeout(() => {
        setDownloadingPdf(null);
      }, 3000);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmailSub('');
      }, 5000);
    }
  };

  return (
    <div id="blog-intelligence-view" className="space-y-10 animate-fade-in">
      {/* Top View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-3xl border bg-white/5 backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('EDITORIAL')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'EDITORIAL'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                : isDark
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curated Whitepapers & Research</span>
          </button>

          <button
            onClick={() => setViewMode('ENCYCLOPEDIA_1000')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'ENCYCLOPEDIA_1000'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                : isDark
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-current" />
            <span>1,000+ Real Estate & Tax Encyclopedia</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">
              1,138 Guides
            </span>
          </button>
        </div>

        <div className="text-xs font-medium opacity-60 hidden md:block px-4">
          Google & AI Search Index Optimized • Schema JSON-LD Ready
        </div>
      </div>

      {viewMode === 'ENCYCLOPEDIA_1000' ? (
        <SeoEncyclopediaExplorer
          theme={theme}
          onAskKiaanAI={onAskKiaanAI}
          onOpenProjectBySlug={onOpenProjectBySlug}
        />
      ) : (
        <>
          {/* Header Banner */}
          <div
            className={`rounded-3xl border p-6 sm:p-10 relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-[#090F1E] via-[#0C152B] to-[#121E3D] border-amber-500/25 shadow-2xl shadow-black/80'
                : 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/60 border-slate-200 shadow-xl'
            }`}
          >
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-amber-500">
              Kiaan Intelligence & Editorial Desk
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-current leading-tight">
            Luxury Real Estate Market Intelligence & Research
          </h1>

          <p className="text-sm sm:text-base opacity-80 leading-relaxed font-sans">
            Authoritative whitepapers, micro-market yield analyses, MahaRERA statutory advisories, FEMA repatriation frameworks, and architectural monographs for discerning homeowners and investors.
          </p>

          {/* Quick Search & Tag Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, corridor (e.g. Wakad, Baner), MahaRERA, FEMA, Tax..."
                className={`w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm border outline-none transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-white placeholder-white/40 focus:border-amber-400 focus:bg-white/10'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 shadow-sm'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100"
                >
                  Clear
                </button>
              )}
            </div>

            {onAskKiaanAI && (
              <button
                onClick={() =>
                  onAskKiaanAI(
                    'What are the key market drivers and investment opportunities in Western Pune luxury real estate currently?'
                  )
                }
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Research Assistant</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills & Tag Filter Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {BLOG_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'ALL'
                ? INITIAL_BLOG_POSTS.length
                : INITIAL_BLOG_POSTS.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as BlogCategory);
                    setSelectedTag(null);
                    setVisibleCount(16);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                      : isDark
                      ? 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                      : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-black/10 text-current opacity-70'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs opacity-60 hidden sm:inline whitespace-nowrap">
            Showing <strong>{filteredPosts.length.toLocaleString()}</strong> guides & reports
          </span>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-xs font-bold opacity-60 flex items-center gap-1 mr-1">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            Trending Topics:
          </span>
          {allTags.slice(0, 8).map((tag, idx) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={idx}
                onClick={() => setSelectedTag(isTagActive ? null : tag)}
                className={`px-3 py-1 rounded-full text-[11px] border transition-all cursor-pointer ${
                  isTagActive
                    ? 'bg-amber-400 text-black border-amber-400 font-bold'
                    : isDark
                    ? 'bg-white/[0.03] border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[11px] text-amber-500 underline ml-2 cursor-pointer"
            >
              Reset Tag Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Articles + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Main Articles Feed */}
        <div className="lg:col-span-8 space-y-8">
          {/* Featured Hero Article */}
          {featuredPost && (
            <div
              onClick={() => setActiveArticle(featuredPost)}
              className={`rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer group shadow-xl ${
                isDark
                  ? 'bg-[#0B101E] border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-white border-slate-200 hover:border-amber-400 shadow-md'
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <SeoImage
                  src={featuredPost.coverImage}
                  alt={seoEngine.generateMediaAltText({
                    entityType: 'BLOG',
                    entityTitle: featuredPost.title,
                    locality: 'Pune',
                    mediaCategory: 'COVER',
                  })}
                  context={{
                    entityType: 'BLOG',
                    entityTitle: featuredPost.title,
                    locality: 'Pune',
                    mediaCategory: 'COVER',
                  }}
                  priority={true}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none"></div>

                <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow-lg">
                    ⭐ Cover Story & Whitepaper
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {featuredPost.categoryLabel}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-2 pointer-events-none">
                  <div className="flex items-center gap-3 text-xs text-amber-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(featuredPost.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTimeMinutes} min read
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-serif font-bold leading-tight">
                    {featuredPost.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-sm sm:text-base opacity-80 leading-relaxed font-sans">
                  {featuredPost.excerpt}
                </p>

                {/* Key Takeaways snippet */}
                {featuredPost.content?.keyTakeaways && (
                  <div
                    className={`p-4 rounded-2xl border space-y-2 text-xs sm:text-sm ${
                      isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Core Intelligence Highlights
                    </span>
                    {featuredPost.content.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="opacity-90">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-current/10">
                  <div className="flex items-center gap-3">
                    <SeoImage
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      context={{
                        entityType: 'BLOG',
                        mediaCategory: 'AVATAR',
                        authorName: featuredPost.author.name,
                        authorRole: featuredPost.author.role,
                      }}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-current">{featuredPost.author.name}</div>
                      <div className="text-[11px] text-amber-500">{featuredPost.author.role}</div>
                    </div>
                  </div>

                  <button className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all">
                    <span>Read Full Dossier</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secondary 2-Column Article Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedRemainingPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActiveArticle(post)}
                className={`rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#0B101E] border-white/10 hover:border-amber-500/40 hover:shadow-xl shadow-black/40'
                    : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-lg shadow-sm'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SeoImage
                      src={post.coverImage}
                      alt={seoEngine.generateMediaAltText({
                        entityType: 'BLOG',
                        entityTitle: post.title,
                        locality: 'Pune',
                        mediaCategory: 'COVER',
                      })}
                      context={{
                        entityType: 'BLOG',
                        entityTitle: post.title,
                        locality: 'Pune',
                        mediaCategory: 'COVER',
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-400 border border-white/20">
                        {post.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] opacity-60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {post.readTimeMinutes} min
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-current group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-current/10 mt-3 pt-3">
                  <div className="flex items-center gap-2">
                    <SeoImage
                      src={post.author.avatar}
                      alt={post.author.name}
                      context={{
                        entityType: 'BLOG',
                        mediaCategory: 'AVATAR',
                        authorName: post.author.name,
                        authorRole: post.author.role,
                      }}
                      className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                    />
                    <span className="text-[11px] font-medium opacity-80">{post.author.name}</span>
                  </div>

                  <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {remainingPosts.length > visibleCount && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 16)}
                className="px-8 py-3.5 rounded-2xl bg-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/25 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Load More Guides (Showing {displayedRemainingPosts.length + (featuredPost ? 1 : 0)} of {filteredPosts.length.toLocaleString()})</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setVisibleCount(remainingPosts.length)}
                className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all cursor-pointer border border-white/10"
              >
                <span>Show All {filteredPosts.length.toLocaleString()} at Once</span>
              </button>
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="p-12 rounded-3xl border text-center space-y-4 border-dashed border-current/20">
              <BookOpen className="w-10 h-10 text-amber-400 mx-auto opacity-50" />
              <h3 className="font-serif font-bold text-lg text-current">No research articles found</h3>
              <p className="text-xs opacity-60 max-w-sm mx-auto">
                Try searching for a different keyword like "MahaRERA", "Wakad", "NRI", or reset your category filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Editorial Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Complimentary Whitepaper Downloads Library */}
          <div
            className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0B101E] border-amber-500/30' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif font-bold text-base text-current">
                Research Whitepapers Library
              </h3>
            </div>
            <p className="text-xs opacity-75 leading-relaxed">
              Download instant, peer-audited research dossiers published by Kiaan Private Client Advisory:
            </p>

            <div className="space-y-3 pt-1">
              {[
                {
                  title: 'Pune Luxury Macro Outlook 2026-27',
                  size: '4.8 MB',
                  file: 'Kiaan_Macro_Outlook_2026.pdf',
                },
                {
                  title: 'NRI FEMA & Repatriation Manual',
                  size: '3.4 MB',
                  file: 'Kiaan_NRI_FEMA_Guide.pdf',
                },
                {
                  title: 'MahaRERA Statutory Audit Checklist',
                  size: '2.1 MB',
                  file: 'MahaRERA_Audit_Checklist.pdf',
                },
                {
                  title: 'Capital Gains Tax Shield (Sec 54/54EC)',
                  size: '1.9 MB',
                  file: 'Capital_Gains_Tax_Shield.pdf',
                },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-current">{doc.title}</div>
                      <div className="text-[10px] opacity-60">PDF • {doc.size}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadReport(doc.title)}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 cursor-pointer transition-all hover:scale-105 shrink-0"
                    title={`Download ${doc.title}`}
                  >
                    {downloadingPdf === doc.title ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Decision Calculator Links */}
          {onNavigateToTab && (
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isDark ? 'bg-[#090F1E] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-current">
                  Financial & Tax Decision Engines
                </h3>
              </div>
              <p className="text-xs opacity-75">
                Model transaction taxes, loan EMIs, and wealth projections referenced across our editorial reports:
              </p>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onNavigateToTab('finance')}
                  className="w-full text-left p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center justify-between cursor-pointer transition-all"
                >
                  <span>Statutory Tax Shield & EMI Calculator</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigateToTab('rera')}
                  className="w-full text-left p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center justify-between cursor-pointer transition-all"
                >
                  <span>MahaRERA Escrow Verification Cell</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Ask AI Prompt Starters */}
          {onAskKiaanAI && (
            <div
              className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-gradient-to-br from-amber-500/15 via-[#0C152B] to-[#0A1020] border-amber-500/30' : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-current">
                  Ask Kiaan AI Intelligence
                </h3>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                Interact with our fine-tuned real estate AI model trained on MahaRERA case laws, master plans, and transaction benchmarks:
              </p>

              <div className="space-y-2">
                {[
                  'What is the price per sq ft trend in Wakad vs Baner over the last 3 years?',
                  'Explain the tax implications of Section 54 for my property sale.',
                  'How does the Hinjewadi Metro Line 3 impact luxury rental yields?',
                  'Can an NRI in Dubai buy a Pune penthouse using an NRE account?',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskKiaanAI(prompt)}
                    className={`w-full text-left p-3 rounded-2xl text-xs border transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-between gap-2 ${
                      isDark ? 'bg-white/5 border-white/10 hover:border-amber-400 text-white/90' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    <span className="line-clamp-2">"{prompt}"</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </>
      )}

      {/* Internal Reading Modal */}
      {activeArticle && (
        <BlogArticleModal
          article={activeArticle}
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          theme={theme}
          onAskKiaanAI={onAskKiaanAI}
          onOpenProjectBySlug={onOpenProjectBySlug}
        />
      )}
    </div>
  );
};
