/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  TrendingDown,
  Clock,
  Building,
  Key,
  ShieldCheck,
  Flame,
  ArrowRight,
  Filter,
  DollarSign,
  Layers,
  ChevronRight,
  Eye,
  Lock,
} from 'lucide-react';
import { OpportunityFilterTag, OpportunityItem } from '../types';
import { SEED_OPPORTUNITY_WALL } from '../data/experienceData';
import { analyticsEngine } from '../services/analyticsStore';

interface OpportunityWallViewProps {
  theme?: 'dark' | 'light';
  onSelectOpportunity?: (item: OpportunityItem) => void;
  onOpenDocCenter?: () => void;
  onOpenMakeOffer?: (item: OpportunityItem) => void;
}

export const OpportunityWallView: React.FC<OpportunityWallViewProps> = ({
  theme = 'dark',
  onSelectOpportunity,
  onOpenDocCenter,
  onOpenMakeOffer,
}) => {
  const isDark = theme === 'dark';
  const [selectedTag, setSelectedTag] = useState<OpportunityFilterTag>('ALL');

  const filterTabs: { tag: OpportunityFilterTag; label: string; icon: any }[] = [
    { tag: 'ALL', label: 'All Opportunities', icon: Sparkles },
    { tag: 'PRICE_DROP', label: 'Price Drops', icon: TrendingDown },
    { tag: 'NEWLY_RELEASED', label: 'Newly Released', icon: Flame },
    { tag: 'PRE_LAUNCH', label: 'Pre-launch VIP', icon: Clock },
    { tag: 'READY_POSSESSION', label: 'Ready Possession (0% GST)', icon: Key },
    { tag: 'INVESTMENT_PICK', label: 'Investment Yield', icon: DollarSign },
    { tag: 'COMMERCIAL_OPPORTUNITY', label: 'High Street Commercial', icon: Building },
    { tag: 'LIMITED_INVENTORY', label: 'Limited Inventory', icon: ShieldCheck },
  ];

  const filteredItems = SEED_OPPORTUNITY_WALL.filter((item) => {
    if (selectedTag === 'ALL') return true;
    return item.tag === selectedTag;
  });

  return (
    <div className={`space-y-8 animate-fade-in ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-current/10">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold font-mono">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>DYNAMIC OPPORTUNITY BOARD</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold">Kiaan Opportunity Wall™</h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            Real-time live board of developer price drops, newly unlocked tower tiers, pre-launch institutional tranches, and ready-possession assets with zero GST liability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono opacity-70">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Synchronized Ledger</span>
        </div>
      </div>

      {/* 2. FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTag === tab.tag;
          return (
            <button
              key={tab.tag}
              onClick={() => {
                setSelectedTag(tab.tag);
                analyticsEngine.trackEvent('search_started', undefined, { filterTag: tab.tag });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                  : isDark
                  ? 'bg-[#0B101C] border-white/10 hover:border-amber-500/30 opacity-80 hover:opacity-100'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm opacity-80 hover:opacity-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. OPPORTUNITY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isPriceDrop = item.tag === 'PRICE_DROP';
          return (
            <div
              key={item.id}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative ${
                isDark ? 'bg-[#0B101C] border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 hover:border-slate-300 shadow-md'
              }`}
            >
              <div>
                {/* Hero Image & Badge */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider backdrop-blur-md shadow-md ${
                        item.badgeColor === 'red'
                          ? 'bg-red-500/90 text-white'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-500/90 text-white'
                          : item.badgeColor === 'purple'
                          ? 'bg-purple-600/90 text-white'
                          : item.badgeColor === 'blue'
                          ? 'bg-blue-600/90 text-white'
                          : 'bg-amber-500/90 text-black'
                      }`}
                    >
                      {item.tagLabel}
                    </span>

                    {item.unitsRemainingCount && (
                      <span className="px-2.5 py-1 rounded-full bg-black/75 text-amber-400 text-[10px] font-mono font-bold backdrop-blur-md border border-white/10">
                        {item.unitsRemainingCount} {item.unitsRemainingCount === 1 ? 'Unit Left' : 'Units Left'}
                      </span>
                    )}
                  </div>

                  {isPriceDrop && item.priceDropSavingsINR && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-600 text-white font-mono font-bold text-[10px] shadow-lg animate-pulse">
                      Save ₹{(item.priceDropSavingsINR / 100000).toFixed(0)} Lakhs
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] text-white/80 font-mono block">{item.location}</span>
                    <h3 className="text-base font-serif font-bold text-white leading-snug line-clamp-1">{item.title}</h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    {item.subtitle}
                  </p>

                  <div className="p-3 rounded-2xl bg-current/5 border border-current/10 space-y-1">
                    <span className="text-[10px] opacity-60 uppercase font-mono block">Opportunity Pricing</span>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-lg font-bold text-amber-500">{item.priceDisplay}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-amber-400/90 font-mono">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{item.urgencyText}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => {
                    if (onSelectOpportunity) onSelectOpportunity(item);
                    analyticsEngine.trackEvent('property_viewed', {
                      type: item.targetType,
                      id: item.targetId,
                      name: item.title,
                      valueINR: item.priceCurrentINR,
                    });
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-current/20 text-xs font-bold hover:bg-current/5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Asset</span>
                </button>

                <button
                  onClick={() => onOpenMakeOffer && onOpenMakeOffer(item)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Offer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
