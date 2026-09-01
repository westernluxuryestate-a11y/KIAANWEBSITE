/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Info, CheckCircle2, ChevronRight, X, ShieldAlert, Award } from 'lucide-react';
import { PropertyPersonalityType } from '../types';
import { PROPERTY_PERSONALITY_EXPLANATIONS } from '../data/experienceData';

interface PropertyPersonalityBadgeProps {
  personality: PropertyPersonalityType;
  theme?: 'dark' | 'light';
  showInteractiveModal?: boolean;
}

export const PropertyPersonalityBadge: React.FC<PropertyPersonalityBadgeProps> = ({
  personality,
  theme = 'dark',
  showInteractiveModal = true,
}) => {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  const personalityData = PROPERTY_PERSONALITY_EXPLANATIONS[personality] || PROPERTY_PERSONALITY_EXPLANATIONS['Family Favourite'];

  const colorStyles =
    personalityData.color === 'emerald'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : personalityData.color === 'amber'
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      : personalityData.color === 'blue'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/30';

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (showInteractiveModal) setIsOpen(true);
        }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-sm ${colorStyles}`}
      >
        <span>{personalityData.badge}</span>
        <Info className="w-3 h-3 opacity-70" />
      </button>

      {/* EXPLAINABLE PERSONALITY MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`w-full max-w-xl p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 relative ${
              isDark ? 'bg-[#0B101C] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-current/10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 block">
                    Explainable Property Personality
                  </span>
                  <h3 className="text-xl font-serif font-bold">{personalityData.badge}</h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-current/10 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Headline Reason */}
            <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">
                Why this asset earned this badge
              </span>
              <p className="text-sm font-semibold">{personalityData.headlineReason}</p>
            </div>

            {/* 4 Objective Metrics Grid */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase opacity-60 block">Ground Truth Audited Factors</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personalityData.explainableFactors.map((factor, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-current/5 border border-current/10 space-y-1">
                    <span className="text-[11px] opacity-60 block truncate">{factor.label}</span>
                    <span className="text-sm font-bold text-amber-500 font-mono block">{factor.metricValue}</span>
                    <p className="text-[11px] opacity-75 leading-tight">{factor.subtext}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suitability */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1 font-mono uppercase">Suitability Profile</span>
              <p className="opacity-90">{personalityData.suitabilityProfile}</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-md cursor-pointer hover:scale-[1.02] transition-all"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
