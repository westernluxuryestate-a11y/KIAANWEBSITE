/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Bot,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Eye,
  ChevronRight,
  Sun,
  Compass,
  Maximize2,
  HeartHandshake,
} from 'lucide-react';
import { KiaanPickCategory, KiaanPickData } from '../types';
import { SEED_KIAAN_PICKS } from '../data/experienceData';
import { analyticsEngine } from '../services/analyticsStore';

interface KiaanPicksSectionProps {
  theme?: 'dark' | 'light';
  onSelectPick?: (pick: KiaanPickData) => void;
}

export const KiaanPicksSection: React.FC<KiaanPicksSectionProps> = ({
  theme = 'dark',
  onSelectPick,
}) => {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<KiaanPickCategory>('BEST_FAMILY_HOME');

  const activePick = SEED_KIAAN_PICKS.find((p) => p.category === activeCategory) || SEED_KIAAN_PICKS[0];

  return (
    <div className={`space-y-8 animate-fade-in ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* 1. SECTION TITLE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-current/10">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-bold font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>HUMAN CURATION + AI SPATIAL INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold">Kiaan Picks™</h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            Six definitive benchmark assets hand-curated by our Senior Real Estate Partners and validated by 14-parameter AI spatial, sunlight, and valuation models.
          </p>
        </div>
      </div>

      {/* 2. CATEGORY SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {SEED_KIAAN_PICKS.map((pick) => {
          const isActive = pick.category === activeCategory;
          return (
            <button
              key={pick.category}
              onClick={() => {
                setActiveCategory(pick.category);
                analyticsEngine.trackEvent('property_viewed', {
                  type: pick.targetType,
                  id: pick.targetId,
                  name: pick.title,
                });
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                  : isDark
                  ? 'bg-[#0B101C] border-white/10 hover:border-amber-500/30 opacity-80 hover:opacity-100'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm opacity-80 hover:opacity-100'
              }`}
            >
              {pick.categoryTitle}
            </button>
          );
        })}
      </div>

      {/* 3. DUAL-PILLAR FEATURED PICK CARD */}
      <div
        className={`p-6 sm:p-10 rounded-3xl border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
          isDark ? 'bg-[#0B101C] border-amber-500/20 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
        }`}
      >
        {/* Left: Image & Title */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <img
              src={activePick.heroImage}
              alt={activePick.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-black font-bold font-mono text-[10px] shadow-md">
              {activePick.categoryTitle}
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] opacity-80 font-mono block">{activePick.locationName}</span>
              <h3 className="font-serif font-bold text-lg leading-tight">{activePick.title}</h3>
              <span className="text-amber-400 font-mono font-bold text-sm block mt-1">{activePick.priceFormatted}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectPick && onSelectPick(activePick)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Explore Full {activePick.categoryTitle} Dossier</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Dual Intelligence (Human Curator Note + AI Intelligence) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pillar 1: Human Real Estate Expert Commentary */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-xs uppercase font-mono tracking-wider text-amber-500">
                  Lead Partner Advisory Audit
                </span>
              </div>
              <span className="text-[10px] opacity-50 font-mono">{activePick.humanCuratorNote.curatedDate}</span>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed italic ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              "{activePick.humanCuratorNote.commentary}"
            </p>

            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-xs">
              <span className="font-bold">{activePick.humanCuratorNote.curatorName}</span>
              <span className="opacity-60 text-[11px]">{activePick.humanCuratorNote.curatorRole}</span>
            </div>
          </div>

          {/* Pillar 2: AI Intelligence & Spatial Metrics */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-xs uppercase font-mono tracking-wider text-blue-400">
                AI Spatial & Valuation Intelligence
              </span>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-current/5 border border-current/10 space-y-0.5">
                <span className="text-[10px] opacity-60 block uppercase">Match Score</span>
                <span className="text-base font-bold text-emerald-400">
                  {activePick.aiIntelligenceMetrics.aiMatchScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-current/5 border border-current/10 space-y-0.5">
                <span className="text-[10px] opacity-60 block uppercase">Efficiency</span>
                <span className="text-base font-bold text-blue-400">
                  {activePick.aiIntelligenceMetrics.spatialEfficiencyScore}/100
                </span>
              </div>
              <div className="p-3 rounded-xl bg-current/5 border border-current/10 space-y-0.5">
                <span className="text-[10px] opacity-60 block uppercase">Daylight Index</span>
                <span className="text-base font-bold text-amber-500">
                  {activePick.aiIntelligenceMetrics.daylightComfortScore}/100
                </span>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              <span className="font-bold text-blue-400">AI Grounded Verdict: </span>
              {activePick.aiIntelligenceMetrics.aiSummaryReason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
