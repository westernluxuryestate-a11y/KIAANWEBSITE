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
  Globe,
  Landmark,
  Copy,
  Check,
  ThumbsUp,
  ExternalLink,
  PhoneCall,
  X,
} from 'lucide-react';
import { FaqCategory, GroundedFaqItem } from '../types';
import { SEED_GROUNDED_FAQS } from '../data/experienceData';
import { analyticsEngine } from '../services/analyticsStore';

interface GroundedFaqEngineProps {
  theme?: 'dark' | 'light';
  projectOrPropertyName?: string;
  onNavigateToTab?: (tab: string) => void;
  onOpenWhatsAppOnboarding?: () => void;
}

export const GroundedFaqEngine: React.FC<GroundedFaqEngineProps> = ({
  theme = 'dark',
  projectOrPropertyName = 'Kiaan Verified Master Portfolio',
  onNavigateToTab,
  onOpenWhatsAppOnboarding,
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(SEED_GROUNDED_FAQS[0]?.id || null);

  // Upvoted FAQ tracking
  const [upvotedFaqIds, setUpvotedFaqIds] = useState<Record<string, boolean>>({});
  const [copiedFaqId, setCopiedFaqId] = useState<string | null>(null);

  // AI Interactive Grounded Query Assistant State
  const [aiQuestionInput, setAiQuestionInput] = useState('');
  const [aiGroundedAnswer, setAiGroundedAnswer] = useState<string | null>(null);
  const [aiCitation, setAiCitation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const categories: { category: FaqCategory | 'ALL'; label: string; icon: any }[] = [
    { category: 'ALL', label: 'All FAQs', icon: Sparkles },
    { category: 'PRICE', label: 'Price & Costs', icon: DollarSign },
    { category: 'POSSESSION', label: 'Possession & RERA', icon: Calendar },
    { category: 'DOCUMENTS', label: 'Legal Deeds', icon: FileText },
    { category: 'NRI_LEGAL', label: 'NRI & FEMA', icon: Globe },
    { category: 'FINANCE_ESCROW', label: 'APF & Escrow', icon: Landmark },
    { category: 'CONFIGURATION', label: 'Carpet & Vaastu', icon: Compass },
    { category: 'PARKING', label: 'Parking & EV', icon: Car },
    { category: 'MAINTENANCE', label: 'CAM Charges', icon: Wrench },
    { category: 'AMENITIES', label: 'Club Amenities', icon: Building },
    { category: 'NEGOTIATION', label: 'Offers & LOI', icon: HeartHandshake },
    { category: 'AVAILABILITY', label: 'Live Inventory', icon: Clock },
  ];

  // Quick Prompts to spark instant luxury discovery
  const QUICK_PROMPT_PILLS = [
    { label: '💰 Tax & All-Inclusive Costs', query: 'What are the all-inclusive stamp duty and GST taxes?' },
    { label: '⚖️ RERA Delay Penalties', query: 'What is the developer delay interest penalty under RERA?' },
    { label: '🌍 NRI Overseas Purchase', query: 'How can NRIs purchase through NRE/NRO accounts under FEMA?' },
    { label: '🔒 Token Refund Policy', query: 'Is the reservation booking token 100% refundable?' },
    { label: '⚡ EV Charging & Parking', query: 'Are dedicated EV wallbox chargers and parking bays included?' },
    { label: '🏦 Bank APF Approvals', query: 'Which banks have approved the projects and how does escrow work?' },
  ];

  const filteredFaqs = SEED_GROUNDED_FAQS.filter((faq) => {
    if (selectedCategory !== 'ALL' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.groundedAnswer.toLowerCase().includes(q) ||
        faq.verifiedSourceReference.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAskAi = (questionToAsk?: string) => {
    const qText = questionToAsk || aiQuestionInput;
    if (!qText.trim()) return;

    setIsAiLoading(true);
    setAiQuestionInput(qText);
    analyticsEngine.trackEvent('ai_query', undefined, { query: qText });

    setTimeout(() => {
      const qLower = qText.toLowerCase();
      let answer = `According to the official MahaRERA sanction dossier and promoter charter for ${projectOrPropertyName}: `;
      let citation = 'MahaRERA Project Sanction Order & Approved Title Certificate';

      if (qLower.includes('stamp') || qLower.includes('tax') || qLower.includes('gst') || qLower.includes('cost') || qLower.includes('hidden')) {
        answer += 'All acquisition pricing is statutory all-inclusive. Buyer costs comprise: Agreement Value, 6% Maharashtra Stamp Duty, ₹30,000 Registration fee, 5% GST (or 0% for ready OC residences), and 1-year advance society maintenance corpus. There are zero broker commissions, zero legal drafting charges, and no hidden floor-rise surcharges.';
        citation = 'Statutory Tax Schedule & MahaRERA Cost Disclosure Annexure';
      } else if (qLower.includes('possession') || qLower.includes('date') || qLower.includes('delay') || qLower.includes('penalty')) {
        answer += 'Committed MahaRERA possession timeline is December 2027 (Registration P52100028492). In accordance with Section 18 of the RERA Act, 2016, any developer delay beyond statutory grace periods mandates monthly developer-paid interest to the allottee at State Bank of India MCLR + 2% per annum until possession handover.';
        citation = 'RERA Act 2016 Section 18 & Promoter Statutory Registration Dossier';
      } else if (qLower.includes('nri') || qLower.includes('fema') || qLower.includes('overseas') || qLower.includes('remittance') || qLower.includes('poa')) {
        answer += 'Non-Resident Indians (NRIs) and OCIs can purchase freely under RBI FEMA regulations using inward remittances from NRE/NRO accounts. Remote acquisition is supported through digital e-registration or consular-attested Special Power of Attorney (PoA) without requiring travel to India.';
        citation = 'RBI FEMA Master Direction & High Court PoA Standard Operating Protocol';
      } else if (qLower.includes('token') || qLower.includes('refund') || qLower.includes('deposit') || qLower.includes('cancel')) {
        answer += 'The reservation token (₹1,00,000 for standard residences / ₹5,00,000 for penthouses) is protected by Kiaan’s 7-Day Due Diligence Guarantee. If any encumbrance or legal title defect is detected, 100% of the token is refunded directly to source account within 48 business hours with zero deductions.';
        citation = 'Kiaan Fair Escrow & Token Refund Charter (Clause 3.1)';
      } else if (qLower.includes('bank') || qLower.includes('apf') || qLower.includes('loan') || qLower.includes('escrow')) {
        answer += 'All Kiaan residences hold pre-approved project finance (APF) tie-ups with HDFC Bank, SBI, ICICI Bank, and Kotak Mahindra Bank. Exactly 70% of all customer receivables are safeguarded in statutory MahaRERA escrow accounts, withdrawable only against architect-certified milestone progress.';
        citation = 'MahaRERA Section 4(2)(l)(D) Escrow Certification & Banking APF Letters';
      } else if (qLower.includes('carpet') || qLower.includes('size') || qLower.includes('sqft') || qLower.includes('vaastu')) {
        answer += 'All carpet areas are measured strictly per RERA Section 2(k) as net usable internal floor space (excluding external walls and service ducts). All layouts feature East or North facing main entrances with kitchen placement in the South-East (Agni) zone for optimal Vaastu and cross-ventilation.';
        citation = 'Architect Carpet Area Certificate & MahaRERA Form 1';
      } else if (qLower.includes('parking') || qLower.includes('ev') || qLower.includes('charger') || qLower.includes('car')) {
        answer += 'Each residence includes 2 covered basement parking slots (3 to 4 slots for penthouses) with demarcated RFID entry tags. All bays feature dedicated conduits connected directly to the apartment electrical meter for seamless Level-2 EV wallbox charging.';
        citation = 'Municipal Sanctioned Parking Layout Plan & Electrical Grid Conduits';
      } else if (qLower.includes('maintenance') || qLower.includes('cam') || qLower.includes('charges')) {
        answer += 'Common Area Maintenance (CAM) is fixed at ₹3.50 per sq.ft of RERA carpet area per month. It includes 24/7 security, Otis elevator maintenance contracts, 100% DG power backup, infinity pool sanitization, and automated rainwater harvesting. Corpus is held in a dedicated society escrow.';
        citation = 'Draft Society Bye-Laws & Section 11(4)(g) MahaRERA Handover Charter';
      } else {
        answer += `All project information regarding "${qText}" has been authenticated against the official MahaRERA sanction orders, 30-year advocate title search, and developer master charter. Our verified luxury concierge can provide specific technical blueprints upon request.`;
        citation = 'Kiaan Verified Master Compliance Dossier';
      }

      setAiGroundedAnswer(answer);
      setAiCitation(citation);
      setIsAiLoading(false);
    }, 600);
  };

  const handleCopyAnswer = (faq: GroundedFaqItem) => {
    const textToCopy = `Q: ${faq.question}\n\nA: ${faq.groundedAnswer}\n\n[Audited Source: ${faq.verifiedSourceReference}] - Kiaan Verified Portfolio`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedFaqId(faq.id);
    setTimeout(() => setCopiedFaqId(null), 2500);
  };

  const handleToggleUpvote = (faqId: string) => {
    setUpvotedFaqIds((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  return (
    <div
      className={`p-6 sm:p-10 rounded-3xl border space-y-8 animate-fade-in transition-all ${
        isDark ? 'bg-[#0B101C] border-white/10 shadow-2xl text-white' : 'bg-white border-slate-200 shadow-xl text-slate-900'
      }`}
    >
      {/* 1. SECTION HEADER & GROUNDED AI QUERY ENGINE */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-current/10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono">
              <Bot className="w-3.5 h-3.5" />
              <span>GROUNDED FAQ & STATUTORY AI COMPLIANCE ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Frequently Asked Questions & Legal Intelligence
            </h2>
            <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
              Audited, legally grounded answers across 11 key luxury real estate domains—verified against statutory MahaRERA filings, High Court title opinions, and architect certifications.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="p-3 rounded-2xl bg-current/5 border border-current/10 text-center min-w-[100px]">
              <div className="text-lg font-bold font-mono text-amber-500">{SEED_GROUNDED_FAQS.length}+</div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Audited FAQs</div>
            </div>
            <div className="p-3 rounded-2xl bg-current/5 border border-current/10 text-center min-w-[100px]">
              <div className="text-lg font-bold font-mono text-emerald-400">100%</div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">RERA Verified</div>
            </div>
          </div>
        </div>

        {/* AI Grounded Natural Language Search Bar */}
        <div className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAi();
            }}
            className="relative"
          >
            <input
              type="text"
              value={aiQuestionInput}
              onChange={(e) => setAiQuestionInput(e.target.value)}
              placeholder="Ask anything about taxes, delay penalties, NRI remittances, EV charging, or title deeds..."
              className={`w-full py-4 pl-12 pr-32 rounded-2xl border text-xs sm:text-sm transition-all outline-none shadow-sm ${
                isDark
                  ? 'bg-[#070A11] border-white/15 focus:border-amber-500 text-white placeholder:text-white/40'
                  : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400'
              }`}
            />
            <Sparkles className="w-5 h-5 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              disabled={isAiLoading || !aiQuestionInput.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isAiLoading ? (
                <>
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 flex-shrink-0">
              Popular Queries:
            </span>
            {QUICK_PROMPT_PILLS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskAi(chip.query)}
                className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:border-amber-500/50 hover:bg-white/10 text-white/80'
                    : 'bg-slate-100 border-slate-200 hover:border-amber-500/50 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Grounded Explanatory Summary Box */}
        {aiGroundedAnswer && (
          <div
            className={`p-5 sm:p-6 rounded-2xl border space-y-3 animate-fade-in ${
              isDark ? 'bg-[#0F172A] border-blue-500/30 text-white shadow-xl' : 'bg-blue-50/80 border-blue-200 text-slate-900 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Bot className="w-4 h-4" />
                <span>AI Grounded Explanatory Dossier</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAiGroundedAnswer(null);
                  setAiCitation(null);
                }}
                className="opacity-60 hover:opacity-100 text-[11px] cursor-pointer"
              >
                Dismiss ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed font-sans font-medium">{aiGroundedAnswer}</p>

            {aiCitation && (
              <div className="pt-3 border-t border-current/10 text-[11px] font-mono opacity-80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Audited Statutory Source: {aiCitation}</span>
                </div>
                <span className="text-[10px] opacity-60">Cross-Referenced with MahaRERA P52100028492</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. DYNAMIC CATEGORY FILTER PILLS & KEYWORD SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-bold uppercase tracking-wider opacity-70">
            Browse by Verification Domain ({filteredFaqs.length} {filteredFaqs.length === 1 ? 'Question' : 'Questions'})
          </div>

          {/* Inline Keyword Filter */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in questions..."
              className={`w-full py-2 pl-8 pr-8 rounded-xl border text-xs outline-none ${
                isDark ? 'bg-white/5 border-white/10 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-amber-500 text-slate-900'
              }`}
            />
            <Search className="w-3.5 h-3.5 opacity-50 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.category;
            const count =
              cat.category === 'ALL'
                ? SEED_GROUNDED_FAQS.length
                : SEED_GROUNDED_FAQS.filter((f) => f.category === cat.category).length;

            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-400 shadow-md scale-105'
                    : isDark
                    ? 'bg-[#070A11] border-white/10 opacity-75 hover:opacity-100 hover:border-white/25'
                    : 'bg-slate-100 border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-black/20 text-black' : isDark ? 'bg-white/10 text-white/70' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC ACCORDION FAQ LIST */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-current/20 space-y-2 opacity-70">
            <HelpCircle className="w-8 h-8 mx-auto text-amber-500 opacity-60" />
            <div className="text-sm font-bold">No grounded questions matched "{searchQuery}"</div>
            <p className="text-xs">Try asking the AI Grounded query engine above, or clear your search query.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="mt-2 px-4 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            const isUpvoted = !!upvotedFaqIds[faq.id];
            const currentVotes = faq.helpfulVotes + (isUpvoted ? 1 : 0);

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
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/20 flex-shrink-0">
                      {faq.category.replace('_', ' ')}
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
                  <div className="px-4 sm:px-6 pb-5 pt-0 space-y-4 text-xs leading-relaxed border-t border-current/10 animate-fade-in">
                    <p className={`pt-4 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/85' : 'text-slate-700'}`}>
                      {faq.groundedAnswer}
                    </p>

                    {/* Audited Source Citation & Actions */}
                    <div className="pt-3 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono opacity-80">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                        <span>Audited Source: {faq.verifiedSourceReference}</span>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {/* Copy Answer Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyAnswer(faq);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            copiedFaqId === faq.id
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : isDark
                              ? 'bg-white/5 border-white/10 hover:bg-white/10'
                              : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {copiedFaqId === faq.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 opacity-70" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>

                        {/* Helpful Upvote Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleUpvote(faq.id);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            isUpvoted
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : isDark
                              ? 'bg-white/5 border-white/10 hover:bg-white/10'
                              : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${isUpvoted ? 'fill-amber-400 text-amber-400' : 'opacity-70'}`} />
                          <span>Helpful ({currentVotes})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. FOOTER CONCIERGE & LEGAL DISCLOSURE ACTION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-current/5 border border-current/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="font-bold flex items-center justify-center sm:justify-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Need Custom Legal Title Opinions or Specific Unit Disclosures?</span>
          </div>
          <div className="text-[11px] opacity-70">
            Our Senior MahaRERA legal auditors and Maybach concierge are available for bespoke walkthroughs.
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenWhatsAppOnboarding && (
            <button
              type="button"
              onClick={onOpenWhatsAppOnboarding}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge</span>
            </button>
          )}

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('vip')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <span>VIP Document Chamber</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
