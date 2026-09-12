/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ChevronRight, X, Compass, ShieldCheck, Sun, DollarSign, Layers } from 'lucide-react';

export interface FloatingKiaanAIContext {
  type: 'homepage' | 'project' | 'property' | 'search';
  title?: string;
  subtitle?: string;
  microMarket?: string;
  price?: string;
  reraId?: string;
}

interface FloatingKiaanAIButtonProps {
  context: FloatingKiaanAIContext;
  theme?: 'dark' | 'light';
  onOpenAI: (initialPrompt?: string) => void;
}

export const FloatingKiaanAIButton: React.FC<FloatingKiaanAIButtonProps> = ({
  context,
  theme = 'dark',
  onOpenAI,
}) => {
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasDismissedCallout, setHasDismissedCallout] = useState(false);
  const [activePromptIdx, setActivePromptIdx] = useState(0);

  // Dynamic Contextual Prompts
  const getContextualPrompts = () => {
    switch (context.type) {
      case 'project':
        return [
          {
            icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
            label: 'Sunlight & Ray Analysis',
            prompt: `What is the solar ray and morning light orientation for ${context.title || 'this project'}?`,
          },
          {
            icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
            label: 'MahaRERA Escrow Status',
            prompt: `Verify the MahaRERA registration (${context.reraId || 'statutory'}) and construction timeline for ${context.title || 'this project'}.`,
          },
          {
            icon: <DollarSign className="w-3.5 h-3.5 text-amber-300" />,
            label: 'Rental Yield & ROI',
            prompt: `What is the estimated capital growth and rental yield for ${context.title || 'this project'} in ${context.microMarket || 'Pune'}?`,
          },
        ];
      case 'search':
        return [
          {
            icon: <Compass className="w-3.5 h-3.5 text-amber-400" />,
            label: 'Filter by Vastu & East Facing',
            prompt: 'Show me East-facing 3 BHK and 4 BHK residences with unobstructed green views in Baner and Wakad.',
          },
          {
            icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
            label: 'Compare Pre-Leased Yields',
            prompt: 'Compare commercial pre-leased IT spaces in Hinjewadi yielding over 8.2% annual rent.',
          },
          {
            icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
            label: 'Budget Matching Under ₹2.5 Cr',
            prompt: 'Find verified luxury homes in Pune ready for possession under ₹2.5 Crore with full tax shield benefits.',
          },
        ];
      case 'homepage':
      default:
        return [
          {
            icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
            label: 'Ask Kiaan AI Concierge',
            prompt: 'What are the top luxury penthouse projects launching this quarter in Pune?',
          },
          {
            icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
            label: 'MahaRERA Verified Estates',
            prompt: 'Explain how Kiaan verifies title deeds, building sanctions, and 70% statutory escrow accounts.',
          },
          {
            icon: <DollarSign className="w-3.5 h-3.5 text-amber-300" />,
            label: 'NRI & Tax Advisory',
            prompt: 'How does FEMA repatriation and Section 54 capital gains exemption work for luxury property purchases in India?',
          },
        ];
    }
  };

  const prompts = getContextualPrompts() || [];

  // Rotate through prompts gently
  useEffect(() => {
    if (!prompts || prompts.length === 0) return;
    const interval = setInterval(() => {
      setActivePromptIdx((prev) => (prev + 1) % (prompts.length || 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [prompts?.length]);

  return (
    <div
      id="floating-signature-kiaan-ai"
      className="fixed bottom-6 right-5 sm:right-8 z-40 flex flex-col items-end gap-2.5 select-none pointer-events-auto"
    >
      {/* Expanded Quick Action Popover */}
      {isExpanded && (
        <div
          className={`w-80 sm:w-96 rounded-3xl p-4.5 border shadow-2xl backdrop-blur-2xl mb-1 transition-all duration-300 transform scale-100 opacity-100 ${
            isDark
              ? 'bg-[#0B101D]/95 border-amber-500/30 text-white shadow-black/50'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] dark:border-white/[0.08] border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-md shadow-amber-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide">Kiaan AI Concierge</h4>
                <p className="text-[10px] opacity-60">
                  {context.type === 'project'
                    ? `Contextual Advisor for ${context.title || 'Project'}`
                    : context.type === 'search'
                    ? 'Spatial Search & Match Copilot'
                    : 'Bespoke Private Real Estate Intelligence'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Close AI menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Summary Tag if in Project / Search */}
          {context.title && (
            <div className="mt-3 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-[11px]">
              <span className="text-amber-400 font-medium truncate">{context.title}</span>
              {context.microMarket && (
                <span className="text-[10px] opacity-70 ml-2 shrink-0">{context.microMarket}</span>
              )}
            </div>
          )}

          {/* Quick Contextual Prompts */}
          <div className="mt-3 space-y-1.5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 px-1">
              Suggested Inquiries
            </p>
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsExpanded(false);
                  onOpenAI(p.prompt);
                }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                  isDark
                    ? 'bg-white/[0.03] border-white/5 hover:border-amber-500/40 hover:bg-amber-500/10 text-white/90'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/70 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="shrink-0">{p.icon}</span>
                  <span className="text-[11.5px] font-medium truncate group-hover:text-amber-400">
                    {p.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-400 shrink-0" />
              </button>
            ))}
          </div>

          {/* Launch Full Interface Button */}
          <button
            onClick={() => {
              setIsExpanded(false);
              onOpenAI();
            }}
            className="mt-3.5 w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-[0.98]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Private AI Chat Suite</span>
          </button>
        </div>
      )}

      {/* Contextual Teaser Pill (When Not Expanded) */}
      {!isExpanded && !hasDismissedCallout && (
        <div
          className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border shadow-lg backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? 'bg-[#0B101D]/90 border-amber-500/30 text-white shadow-black/40'
              : 'bg-white/95 border-slate-200 text-slate-800 shadow-md'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></div>
          <span
            onClick={() => onOpenAI(prompts[activePromptIdx]?.prompt)}
            className="text-[11.5px] font-medium cursor-pointer hover:text-amber-400 transition-colors max-w-[240px] truncate"
            title={prompts[activePromptIdx]?.prompt}
          >
            "{prompts[activePromptIdx]?.label}"
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHasDismissedCallout(true);
            }}
            className="p-0.5 rounded opacity-40 hover:opacity-100 transition-opacity ml-1 cursor-pointer"
            aria-label="Dismiss prompt suggestion"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group transition-transform duration-200 hover:scale-105 active:scale-95">
        {/* Ambient Subtle Glow */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-40 group-hover:opacity-75 blur-md transition-opacity duration-500"></div>

        <button
          id="floating-kiaan-ai-btn"
          onClick={() => {
            if (isExpanded) {
              setIsExpanded(false);
            } else {
              setIsExpanded(true);
            }
          }}
          className={`relative flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full border backdrop-blur-2xl shadow-2xl transition-all duration-300 cursor-pointer ${
            isDark
              ? 'bg-[#070B14]/95 border-amber-500/40 text-white hover:border-amber-400'
              : 'bg-white/95 border-amber-400/60 text-slate-950 hover:border-amber-500 shadow-xl'
          }`}
          title="Kiaan AI Luxury Concierge"
          aria-label="Open Kiaan AI Concierge"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-black shadow-md shadow-amber-500/30 group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Kiaan AI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider font-semibold opacity-60 -mt-0.5">
              {context.type === 'project' ? 'Project Advisor' : 'Luxury Concierge'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
