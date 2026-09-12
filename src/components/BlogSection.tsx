/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
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
  Search,
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../types';
import { BLOG_CATEGORIES, INITIAL_BLOG_POSTS } from '../data/blogData';
import { BlogArticleModal } from './BlogArticleModal';
import { SeoImage } from './SeoImage';
import { seoEngine } from '../services/seoAndMetadataEngine';

interface BlogSectionProps {
  theme?: 'dark' | 'light';
  onNavigateToTab?: (tab: string) => void;
  onOpenArticleModal?: (article: BlogPost) => void;
  onAskKiaanAI?: (prompt: string) => void;
  onOpenProjectBySlug?: (slug: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  theme = 'dark',
  onNavigateToTab,
  onOpenArticleModal,
  onAskKiaanAI,
  onOpenProjectBySlug,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [emailSub, setEmailSub] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isDark = theme === 'dark';

  const filteredPosts = useMemo(() => {
    return INITIAL_BLOG_POSTS.filter((post) => {
      const matchCat = selectedCategory === 'ALL' || post.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const secondaryPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);
  const displayedSecondaryPosts = secondaryPosts.slice(0, visibleCount);

  const handleReadArticle = (article: BlogPost) => {
    if (onOpenArticleModal) {
      onOpenArticleModal(article);
    } else {
      setActiveArticle(article);
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
    <section id="kiaan-blog-section" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-current/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
              Kiaan Journal & Editorial Intelligence
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {INITIAL_BLOG_POSTS.length.toLocaleString()}+ Published Guides
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-current">
            Market Intelligence & Real Estate Insights
          </h2>
          <p className="text-sm opacity-75 leading-relaxed">
            Proprietary micro-market research, MahaRERA legal analyses, FEMA guides for NRIs, GST/TDS tax models, and luxury architecture briefings curated by our senior advisory board.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('blog')}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 self-start md:self-auto shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All {INITIAL_BLOG_POSTS.length.toLocaleString()}+ Guides</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search across ${INITIAL_BLOG_POSTS.length.toLocaleString()}+ topics (e.g., GST, Sec 54, MahaRERA, Wakad, Mivan)...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(6);
            }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none transition-all ${
              isDark
                ? 'bg-[#0B1426] border-white/10 text-white placeholder-white/40 focus:border-amber-500/50'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-xs opacity-60 text-right">
          Showing {Math.min(filteredPosts.length, displayedSecondaryPosts.length + (featuredPost ? 1 : 0))} of {filteredPosts.length.toLocaleString()} matching guides
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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
                setVisibleCount(6);
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

      {/* Featured Lead Article Hero Card */}
      {featuredPost && (
        <div
          onClick={() => handleReadArticle(featuredPost)}
          className={`rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer group shadow-xl ${
            isDark
              ? 'bg-[#0B101E] border-amber-500/30 hover:border-amber-500/60 shadow-black/60'
              : 'bg-white border-slate-200 hover:border-amber-400 shadow-md'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Cover Image */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[280px] lg:min-h-[420px] overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden pointer-events-none"></div>
              
              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow-lg">
                  ⭐ Featured Report
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                  {featuredPost.categoryLabel}
                </span>
              </div>
            </div>

            {/* Right Editorial Info */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs opacity-60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {new Date(featuredPost.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {featuredPost.readTimeMinutes} min read
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-current group-hover:text-amber-400 transition-colors leading-tight">
                  {featuredPost.title}
                </h3>

                <p className="text-xs sm:text-sm opacity-75 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                {/* Key Takeaway Teaser */}
                {featuredPost.content?.keyTakeaways?.[0] && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                      isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{featuredPost.content.keyTakeaways[0]}</span>
                  </div>
                )}
              </div>

              {/* Author & Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-current/10">
                <div className="flex items-center gap-2.5">
                  <SeoImage
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    context={{
                      entityType: 'BLOG',
                      mediaCategory: 'AVATAR',
                      authorName: featuredPost.author.name,
                      authorRole: featuredPost.author.role,
                    }}
                    className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="text-xs font-bold text-current">{featuredPost.author.name}</div>
                    <div className="text-[10px] text-amber-500">{featuredPost.author.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Report</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Secondary Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSecondaryPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => handleReadArticle(post)}
            className={`rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
              isDark
                ? 'bg-[#0B101E] border-white/10 hover:border-amber-500/40 hover:shadow-xl shadow-black/40'
                : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-lg shadow-sm'
            }`}
          >
            <div>
              {/* Image & Category */}
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

              {/* Body */}
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

                <h3 className="font-serif font-bold text-base sm:text-lg text-current group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Card Footer */}
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

      {/* Load More Button or Browse All Link */}
      {secondaryPosts.length > visibleCount && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-6 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer hover:scale-105 flex items-center gap-2"
          >
            <span>Load More Guides (Showing {displayedSecondaryPosts.length} of {secondaryPosts.length.toLocaleString()})</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('blog')}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-white/10"
            >
              <span>Explore All {INITIAL_BLOG_POSTS.length.toLocaleString()}+ in Hub</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      )}

      {/* Complimentary VIP Research Desk Subscription Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border ${
          isDark
            ? 'bg-gradient-to-r from-[#0C152A] via-[#090F1E] to-[#121B33] border-amber-500/30'
            : 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/80 border-amber-200 shadow-md'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                1,000+ Indian Real Estate & Tax Encyclopedia
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-current">
              Instant Legal, GST, TDS, MahaRERA & Society Bye-law Guides
            </h3>
            <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
              Explore 1,138+ humanized, search-engine-indexed topics with concrete calculations and JSON-LD schema across Pune corridors.
            </p>
          </div>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('blog')}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all hover:scale-105 cursor-pointer shadow-lg shadow-amber-500/20 whitespace-nowrap flex items-center gap-2"
            >
              <span>Explore 1,000+ Topic Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

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
    </section>
  );
};
