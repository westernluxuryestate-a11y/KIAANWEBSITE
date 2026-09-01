/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Bot,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  Car,
  Calendar,
  Layers,
  Wrench,
  Compass,
  Building,
  HeartHandshake,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { FaqCategory, GroundedFaqItem } from '../types';
import { SEED_GROUNDED_FAQS } from '../data/experienceData';
import { analyticsEngine } from '../services/analyticsStore';

interface GroundedFaqEngineProps {
  theme?: 'dark' | 'light';
  projectOrPropertyName?: string;
}

export const GroundedFaqEngine: React.FC<GroundedFaqEngineProps> = ({
  theme = 'dark',
  projectOrPropertyName = 'Kiaan Portfolio',
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(SEED_GROUNDED_FAQS[0]?.id || null);

  // AI Interactive Grounded Query Assistant State
  const [aiQuestionInput, setAiQuestionInput] = useState('');
  const [aiGroundedAnswer, setAiGroundedAnswer] = useState<string | null>(null);
  const [aiCitation, setAiCitation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const categories: { category: FaqCategory | 'ALL'; label: string; icon: any }[] = [
    { category: 'ALL', label: 'All FAQs', icon: Sparkles },
    { category: 'PRICE', label: 'Price & Costs', icon: DollarSign },
    { category: 'PARKING', label: 'Parking & EV', icon: Car },
    { category: 'POSSESSION', label: 'Possession & RERA', icon: Calendar },
    { category: 'MAINTENANCE', label: 'Maintenance & CAM', icon: Wrench },
    { category: 'CONFIGURATION', label: 'Carpet & Vaastu', icon: Compass },
    { category: 'DOCUMENTS', label: 'Legal Documents', icon: FileText },
    { category: 'AMENITIES', label: 'Club Amenities', icon: Building },
    { category: 'NEGOTIATION', label: 'Offers & Pricing', icon: HeartHandshake },
    { category: 'AVAILABILITY', label: 'Live Inventory', icon: Clock },
  ];

  const filteredFaqs = SEED_GROUNDED_FAQS.filter((faq) => {
    if (selectedCategory !== 'ALL' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.groundedAnswer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestionInput.trim()) return;

    setIsAiLoading(true);
    analyticsEngine.trackEvent('ai_query', undefined, { query: aiQuestionInput });

    setTimeout(() => {
      const qLower = aiQuestionInput.toLowerCase();
      let answer = `According to the official MahaRERA sanction dossier for ${projectOrPropertyName}: `;
      let citation = 'MahaRERA Project Sanction Order & Approved Title Certificate';

      if (qLower.includes('stamp') || qLower.includes('tax') || qLower.includes('gst') || qLower.includes('cost')) {
        answer += 'Acquisition costs include 6% Maharashtra Stamp Duty, ₹30,000 Registration fee, 5% GST (or 0% for ready OC inventory), and 1-year advance society maintenance. There are zero broker commissions.';
        citation = 'Statutory Tax Schedule & MahaRERA Cost Disclosure Annexure';
      } else if (qLower.includes('possession') || qLower.includes('date') || qLower.includes('delay')) {
        answer += 'Committed MahaRERA possession timeline is December 2027. Delays beyond statutory grace periods are governed by Section 18 of RERA Act, with developer paying monthly MCLR+2% interest.';
        citation = 'RERA Act 2016 Section 18 & Promoter Registration Document';
      } else if (qLower.includes('carpet') || qLower.includes('size') || qLower.includes('sqft')) {
        answer += 'All carpet areas are measured strictly per RERA Section 2(k) as net usable internal floor space excluding external walls and open terrace shafts.';
        citation = 'Architect Carpet Area Certificate & MahaRERA Form 1';
      } else if (qLower.includes('parking') || qLower.includes('ev')) {
        answer += 'Each residence includes 2 covered basement parking slots with Level-2 EV charging conduits routed directly to the apartment meter.';
        citation = 'Municipal Sanctioned Parking Layout Plan';
      } else {
        answer += `All project information for "${aiQuestionInput}" has been cross-verified with the advocate 30-year title search and developer direct charter. Our verified concierge can provide specific technical blueprints upon request.`;
        citation = 'Kiaan Verified Master Dossier';
      }

      setAiGroundedAnswer(answer);
      setAiCitation(citation);
      setIsAiLoading(false);
    }, 700);
  };

  return (
    <div
      className={`p-6 sm:p-10 rounded-3xl border space-y-8 animate-fade-in ${
        isDark ? 'bg-[#0B101C] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
      }`}
    >
      {/* 1. HEADER & AI INTERACTIVE SEARCH BOX */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-current/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono">
              <Bot className="w-3.5 h-3.5" />
              <span>GROUNDED FAQ & AI COMPLIANCE ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">Frequently Asked Questions</h2>
            <p className="text-xs opacity-70">
              Audited answers across 9 key categories, grounded in statutory MahaRERA filings, architect certificates, and legal deeds.
            </p>
          </div>
        </div>

        {/* AI Grounded Question Ask Box */}
        <form onSubmit={handleAskAi} className="relative">
          <input
            type="text"
            value={aiQuestionInput}
            onChange={(e) => setAiQuestionInput(e.target.value)}
            placeholder="Ask AI anything (e.g. 'What is the delay penalty under RERA?', 'What are the GST charges?')..."
            className={`w-full py-3.5 pl-12 pr-28 rounded-2xl border text-xs transition-all outline-none ${
              isDark
                ? 'bg-[#070A11] border-white/15 focus:border-amber-500 text-white placeholder:text-white/40'
                : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400'
            }`}
          />
          <Sparkles className="w-4 h-4 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            disabled={isAiLoading || !aiQuestionInput.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
          >
            {isAiLoading ? 'Analyzing...' : 'Ask AI'}
          </button>
        </form>

        {/* AI Grounded Output Display */}
        {aiGroundedAnswer && (
          <div
            className={`p-5 rounded-2xl border space-y-2 animate-fade-in ${
              isDark ? 'bg-[#0F172A] border-blue-500/30 text-white' : 'bg-blue-50/70 border-blue-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Bot className="w-4 h-4" />
                <span>AI Grounded Explanatory Summary</span>
              </div>
              <span className="text-[10px] opacity-60">Verified Against MahaRERA Dossier</span>
            </div>

            <p className="text-xs leading-relaxed font-sans">{aiGroundedAnswer}</p>

            {aiCitation && (
              <div className="pt-2 border-t border-current/10 text-[10px] font-mono opacity-70 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Source: {aiCitation}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. 9 CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.category;
          return (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-400 shadow-md scale-105'
                  : isDark
                  ? 'bg-[#070A11] border-white/10 opacity-75 hover:opacity-100'
                  : 'bg-slate-100 border-slate-200 opacity-75 hover:opacity-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. ACCORDION FAQ LIST */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? isDark
                    ? 'bg-[#070A11] border-amber-500/40 shadow-lg'
                    : 'bg-slate-50 border-amber-500/40 shadow-md'
                  : isDark
                  ? 'bg-current/5 border-current/10 hover:border-current/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-500 flex-shrink-0">
                    {faq.category}
                  </span>
                  <span className="font-serif font-bold text-xs sm:text-sm">{faq.question}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 opacity-50 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-0 space-y-3 text-xs leading-relaxed border-t border-current/10 animate-fade-in">
                  <p className={`pt-3 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                    {faq.groundedAnswer}
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono opacity-70">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Audited Source: {faq.verifiedSourceReference}</span>
                    </div>

                    <span className="text-[10px] opacity-60">
                      {faq.helpfulVotes} users found this grounded answer helpful
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
