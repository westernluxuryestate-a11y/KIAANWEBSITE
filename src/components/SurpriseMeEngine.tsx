/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  Sparkles,
  MapPin,
  Compass,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  Building,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/seedData';

interface SurpriseMeEngineProps {
  onOpenProjectExperience?: (projectId: string) => void;
  onScheduleVisit?: (project: Project) => void;
}

interface SerendipityRecommendation {
  project: Project;
  tagline: string;
  divergenceType: 'MICRO_MARKET_EXPANSION' | 'CONFIGURATION_UPGRADE' | 'VALUATION_ARBITRAGE' | 'DEVELOPER_PEDIGREE';
  headlineReason: string;
  detailedExplanation: string;
  advantageMetrics: {
    label: string;
    value: string;
    badgeColor?: string;
  }[];
}

export const SurpriseMeEngine: React.FC<SurpriseMeEngineProps> = ({
  onOpenProjectExperience,
  onScheduleVisit,
}) => {
  const [activeDivergence, setActiveDivergence] = useState<'ALL' | 'MICRO_MARKET' | 'VALUE_ARBITRAGE' | 'CONFIG_UPGRADE'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const serendipityRecommendations: SerendipityRecommendation[] = [
    {
      project: INITIAL_PROJECTS[1] || INITIAL_PROJECTS[0],
      tagline: 'You normally search Wakad. This Baner property may be worth considering.',
      divergenceType: 'MICRO_MARKET_EXPANSION',
      headlineReason: '4.2 km east with +18% higher historic 5-year capital appreciation compounding',
      detailedExplanation:
        'While your current search is concentrated on Wakad, Elysian Grand in Baner offers direct walkable access to high-street fine dining and A-grade tech parks. For an incremental capital stretch of ~₹25 Lakhs, you gain 140 sq.ft larger deck dimensions and top-tier IB school connectivity (Vibgyor / The Orchid School within 10 mins).',
      advantageMetrics: [
        { label: 'Commute Difference', value: '+4 mins to Hinjewadi Phase 1', badgeColor: 'bg-blue-500/15 text-blue-400' },
        { label: 'Carpet Area Advantage', value: '+140 sq.ft deck lounge', badgeColor: 'bg-emerald-500/15 text-emerald-400' },
        { label: 'Capital CAGR (5-Yr)', value: '8.8% vs 8.2% baseline', badgeColor: 'bg-amber-500/15 text-amber-400' },
      ],
    },
    {
      project: INITIAL_PROJECTS[0],
      tagline: 'Consider a 3.5 BHK Sky Deck rather than a standard 3 BHK.',
      divergenceType: 'CONFIGURATION_UPGRADE',
      headlineReason: 'Integrated dedicated acoustic WFH studio for ₹12.5L less than separate commercial lease',
      detailedExplanation:
        'Opting for Unit 1804 at Kiaan One Vertica provides a dedicated 120 sq.ft private acoustic executive study. Rather than paying external co-working subscriptions, the statutory tax shield on home loan interest offsets 65% of the incremental EMI.',
      advantageMetrics: [
        { label: 'Net Monthly EMI Delta', value: '+₹7,200/mo after Tax Shield', badgeColor: 'bg-emerald-500/15 text-emerald-400' },
        { label: 'Dedicated WFH Office', value: '100% soundproof acoustic glass', badgeColor: 'bg-purple-500/15 text-purple-400' },
        { label: 'Elevation', value: 'Level 18 Sunrise Deck', badgeColor: 'bg-amber-500/15 text-amber-400' },
      ],
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="surprise-me-engine">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F1626] via-[#09101E] to-[#040810] border border-amber-500/25 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Serendipity & Latent Opportunity Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            "Surprise Me" — High-Conviction Lateral Recommendations
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Intelligent recommendations purposefully outside your strict filter criteria with explainable mathematical trade-offs, value arbitrage, and micro-market growth catalysts.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 uppercase font-bold">Divergence Filter:</span>
            {(['ALL', 'MICRO_MARKET', 'VALUE_ARBITRAGE', 'CONFIG_UPGRADE'] as const).map((filterMode) => (
              <button
                key={filterMode}
                onClick={() => setActiveDivergence(filterMode)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDivergence === filterMode
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {filterMode.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Re-compute Lateral Matches</span>
          </button>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        {(serendipityRecommendations || []).map((rec, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 sm:p-8 space-y-6 hover:border-amber-500/40 transition-all shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Asset Hero & Info */}
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-full sm:w-48 h-36 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative">
                  <img src={rec.project.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'} alt={rec.project.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 uppercase">
                    {rec.project.location?.microMarket}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>{rec.tagline}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white">{rec.project.name}</h3>
                  <p className="text-sm font-semibold text-amber-400 leading-snug">
                    {rec.headlineReason}
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed max-w-2xl">
                    {rec.detailedExplanation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-2">
                <div className="text-right">
                  <span className="text-[10px] text-white/40 uppercase block">Guidance Valuation</span>
                  <span className="text-lg font-bold text-white">
                    {formatINR(rec.project.headlinePriceRange?.min || 15000000)}
                  </span>
                </div>

                <button
                  onClick={() => onOpenProjectExperience && onOpenProjectExperience(rec.project.id)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Explore Lateral Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Explainable Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
              {(rec.advantageMetrics || []).map((met, mIdx) => (
                <div key={mIdx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-white/60">{met.label}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${met.badgeColor || 'bg-white/10 text-white'}`}>
                    {met.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
