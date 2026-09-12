/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Sparkles,
  ChevronRight,
  Calculator,
  ShieldCheck,
  Scale,
  Building2,
  Users,
  HardHat,
  Receipt,
  FileSpreadsheet,
  Landmark,
  Globe,
  TrendingUp,
  Tag,
  Code,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { KnowledgeTopic, BlogCategory } from '../types';
import {
  ALL_INDEXED_KNOWLEDGE_TOPICS,
  SEO_KNOWLEDGE_CATEGORIES,
} from '../data/seoKnowledgeBase';
import { SeoTopicReaderModal } from './SeoTopicReaderModal';

interface SeoEncyclopediaExplorerProps {
  theme?: 'dark' | 'light';
  onAskKiaanAI?: (prompt: string) => void;
  onOpenProjectBySlug?: (slug: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const SeoEncyclopediaExplorer: React.FC<SeoEncyclopediaExplorerProps> = ({
  theme = 'dark',
  onAskKiaanAI,
  onOpenProjectBySlug,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('ALL');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<KnowledgeTopic | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  const isDark = theme === 'dark';

  const CORRIDOR_OPTIONS = [
    'ALL',
    'Wakad',
    'Baner',
    'Balewadi',
    'Hinjawadi',
    'Kharadi',
    'Koregaon Park',
    'Bavdhan',
    'Ravet & Punawale',
    'Mahalunge',
    'Kothrud',
    'Viman Nagar',
    'Hadapsar & Magarpatta',
  ];

  // Filter topics
  const filteredTopics = useMemo(() => {
    return ALL_INDEXED_KNOWLEDGE_TOPICS.filter((topic) => {
      const matchCat = selectedCategory === 'ALL' || topic.category === selectedCategory;
      const matchCorridor =
        selectedCorridor === 'ALL' ||
        topic.title.toLowerCase().includes(selectedCorridor.toLowerCase()) ||
        topic.searchIntentKeywords.some((k) => k.toLowerCase().includes(selectedCorridor.toLowerCase()));
      const matchLetter = !selectedLetter || topic.title.toUpperCase().startsWith(selectedLetter);
      const matchSearch =
        !searchQuery ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.simpleEnglishSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.searchIntentKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (topic.statutoryRuleOrSection && topic.statutoryRuleOrSection.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchCorridor && matchLetter && matchSearch;
    });
  }, [selectedCategory, selectedCorridor, selectedLetter, searchQuery]);

  const displayedTopics = useMemo(() => {
    return filteredTopics.slice(0, visibleCount);
  }, [filteredTopics, visibleCount]);

  return (
    <div id="seo-encyclopedia-explorer" className="space-y-8 font-sans">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-10 rounded-3xl border relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-[#090F1E] via-[#0C152B] to-[#121E3D] border-amber-500/25 shadow-2xl'
            : 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/60 border-slate-200 shadow-lg'
        }`}
      >
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-amber-500">
              Kiaan Real Estate & Statutory Knowledge Hub
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-current leading-tight">
            1,000+ Indian Real Estate, Tax, GST, TDS & MahaRERA Master Guides
          </h2>

          <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
            Instant, humanized explanations with concrete calculation examples, statutory citations, and Google-ready rich snippet schemas for homeowners, buyers, and investors across Western Pune.
          </p>

          {/* Quick Search Input */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(24);
                }}
                placeholder="Search by topic, Section 54, GST rate, TDS Form 26QB, Mivan, Society bye-laws..."
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
                    'Explain Section 54 capital gains exemption and TDS under Section 194-IA with concrete calculation examples.'
                  )
                }
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Advisor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SEO_KNOWLEDGE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as BlogCategory);
                  setSelectedLetter(null);
                  setVisibleCount(24);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : isDark
                    ? 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Micro-Market Corridor Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold opacity-60 flex items-center gap-1 shrink-0 mr-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            Corridor:
          </span>
          {CORRIDOR_OPTIONS.map((corridor) => {
            const isCorridorActive = selectedCorridor === corridor;
            return (
              <button
                key={corridor}
                onClick={() => {
                  setSelectedCorridor(corridor);
                  setVisibleCount(24);
                }}
                className={`px-3 py-1 rounded-full text-[11px] border whitespace-nowrap transition-all cursor-pointer ${
                  isCorridorActive
                    ? 'bg-amber-400 text-black border-amber-400 font-bold'
                    : isDark
                    ? 'bg-white/[0.03] border-white/10 text-white/70 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {corridor === 'ALL' ? 'All Corridors' : corridor}
              </button>
            );
          })}
        </div>

        {/* Alphabetical A-Z Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
          <span className="font-bold opacity-50 shrink-0 mr-1">A-Z:</span>
          <button
            onClick={() => {
              setSelectedLetter(null);
              setVisibleCount(24);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              !selectedLetter ? 'bg-amber-500 text-black' : 'opacity-60 hover:opacity-100'
            }`}
          >
            ALL
          </button>
          {ALPHABET.map((char) => (
            <button
              key={char}
              onClick={() => {
                setSelectedLetter(selectedLetter === char ? null : char);
                setVisibleCount(24);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                selectedLetter === char
                  ? 'bg-amber-400 text-black font-bold'
                  : 'opacity-60 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Topic Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs opacity-75">
          <span>
            Showing <strong>{displayedTopics.length}</strong> of <strong>{filteredTopics.length}</strong> indexed knowledge guides
          </span>
          {selectedLetter && (
            <span className="text-amber-400">Filtered by starting letter: "{selectedLetter}"</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-xl ${
                isDark
                  ? 'bg-[#0B101E] border-white/10 hover:border-amber-500/50 hover:bg-[#0E162A]'
                  : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    {topic.categoryLabel}
                  </span>
                  <span className="text-[10px] font-semibold opacity-60">
                    SEO: {topic.seoMeta.seoScore}/100
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-current group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                  {topic.title}
                </h3>

                <p className="text-xs opacity-75 line-clamp-3 leading-relaxed">
                  {topic.simpleEnglishSummary}
                </p>

                {topic.statutoryRuleOrSection && (
                  <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1.5 pt-1">
                    <Scale className="w-3 h-3 shrink-0" />
                    <span className="truncate">{topic.statutoryRuleOrSection}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-current/10 flex items-center justify-between">
                <span className="text-[11px] opacity-60 font-mono">
                  {topic.seoMeta.searchVolumeMonthlyEst}
                </span>

                <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read & Schema
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayedTopics.length < filteredTopics.length && (
          <div className="pt-6 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="px-8 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer hover:scale-105"
            >
              Load More Topics ({filteredTopics.length - displayedTopics.length} remaining)
            </button>
          </div>
        )}

        {filteredTopics.length === 0 && (
          <div className="p-12 rounded-3xl border text-center space-y-4 border-dashed border-current/20">
            <BookOpen className="w-10 h-10 text-amber-400 mx-auto opacity-50" />
            <h3 className="font-serif font-bold text-lg text-current">No matching topics found</h3>
            <p className="text-xs opacity-60 max-w-sm mx-auto">
              Try searching for terms like "Section 54", "MahaRERA", "Mivan", "GST 5%", or reset your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedCorridor('ALL');
                setSelectedLetter(null);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Topic Detail Modal */}
      {activeTopic && (
        <SeoTopicReaderModal
          topic={activeTopic}
          isOpen={!!activeTopic}
          onClose={() => setActiveTopic(null)}
          theme={theme}
          onAskKiaanAI={onAskKiaanAI}
          onOpenProjectBySlug={onOpenProjectBySlug}
        />
      )}
    </div>
  );
};
