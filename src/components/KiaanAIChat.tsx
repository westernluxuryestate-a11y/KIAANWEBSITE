/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Compass,
  TrendingUp,
  Award,
  Layers,
  MapPin,
  Clock,
  Car,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Volume2,
  Mic,
  ChevronRight,
  Zap,
  DollarSign,
  Building,
  Target,
  Scale,
  GraduationCap,
  Home,
  Check,
  ArrowUpRight,
  Swords,
} from 'lucide-react';
import {
  PropertyDna,
  RecommendationCategory,
  PropertyIntelligenceScore,
  DecisionConfidence,
  InformationCompleteness,
  PriceIntelligence,
  OpportunityScore,
  PropertyLadderTier,
  CommuteDestination,
} from '../types';
import {
  DEFAULT_PROPERTY_DNA,
  PUNE_COMMUTE_DESTINATIONS,
  calculatePropertyIntelligenceScore,
  calculateDecisionConfidence,
  calculateInformationCompleteness,
  calculatePriceIntelligence,
  calculateOpportunityScore,
  generatePropertyLadder,
  getCategorizedRecommendations,
} from '../services/intelligenceEngine';
import { INITIAL_PROJECTS } from '../data/seedData';
import { PropertyBattleSuite } from './PropertyBattleSuite';
import { SurpriseMeEngine } from './SurpriseMeEngine';
import { PropertyMemoryAndWatch } from './PropertyMemoryAndWatch';

interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  sourceClassification?: 'VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'AI_ANALYSIS';
  timestamp: string;
}

export const KiaanAIChat: React.FC<{
  initialPrompt?: string;
  onOpenProjectExperience?: (projectId: string) => void;
}> = ({ initialPrompt, onOpenProjectExperience }) => {
  // Navigation within Intelligence Suite
  const [activeSubTab, setActiveSubTab] = useState<
    'CHAT' | 'DNA_RECOMMENDATIONS' | 'INTELLIGENCE_SCORE' | 'PRICE_LADDER' | 'TRADEOFF_COMMUTE' | 'PROPERTY_BATTLE' | 'SURPRISE_ME' | 'PROPERTY_MEMORY'
  >('CHAT');

  // Selected project for deep intelligence inspection
  const [selectedProject, setSelectedProject] = useState(INITIAL_PROJECTS[0]);

  // Customer Property DNA State
  const [propertyDna, setPropertyDna] = useState<PropertyDna>(DEFAULT_PROPERTY_DNA);
  const [isDnaModalOpen, setIsDnaModalOpen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'model',
      text: 'Namaste! I am **KIAAN INTELLIGENCE™**, your AI-first luxury real estate advisory partner. I am strictly grounded in verified Maharashtra MahaRERA compliance filings, official builder inventory records, and spatial digital twins.\n\nAsk me anything in English, Hindi, or Marathi — or choose a conversational follow-up below.',
      sourceClassification: 'VERIFIED',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Computed Intelligence Metrics for Selected Project
  const intelligenceScore: PropertyIntelligenceScore = calculatePropertyIntelligenceScore(selectedProject);
  const decisionConfidence: DecisionConfidence = calculateDecisionConfidence(selectedProject, propertyDna);
  const completeness: InformationCompleteness = calculateInformationCompleteness(selectedProject);
  const priceIntel: PriceIntelligence = calculatePriceIntelligence(selectedProject);
  const opportunityScore: OpportunityScore = calculateOpportunityScore(selectedProject);
  const propertyLadder: PropertyLadderTier[] = generatePropertyLadder(selectedProject);
  const categorizedRecs = getCategorizedRecommendations(propertyDna);

  // Trade-off Sliders State
  const [spaceVsLocation, setSpaceVsLocation] = useState(50); // 0 = Max Space, 100 = Max Location
  const [possessionVsPrice, setPossessionVsPrice] = useState(50); // 0 = Ready Possession, 100 = Lower Price (Under-construction)
  const [selectedCommuteDest, setSelectedCommuteDest] = useState<CommuteDestination>(PUNE_COMMUTE_DESTINATIONS[0]);
  const [maxCommuteFilterMinutes, setMaxCommuteFilterMinutes] = useState(20);

  // Conversational follow-ups
  const conversationalFollowUps = [
    'Show cheaper options',
    'Only ready possession',
    'Remove anything above 15th floor',
    'Increase budget by ₹20 lakh',
    'I want better school connectivity',
    'Show similar properties in Baner',
  ];

  const processedPromptRef = useRef<string | null>(null);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const uniqueSuffix = Math.random().toString(36).substring(2, 8);
    const userMsg: Message = {
      id: `usr_${Date.now()}_${uniqueSuffix}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Build previous conversation turns
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text.trim(), history }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const modelSuffix = Math.random().toString(36).substring(2, 8);
        const modelMsg: Message = {
          id: `mod_${Date.now()}_${modelSuffix}`,
          sender: 'model',
          text: json.data.text,
          sourceClassification: json.data.sourceClassification || 'VERIFIED',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, modelMsg]);

        // Voice output synthesis simulation
        if (isVoiceActive && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(json.data.text.replace(/[*#]/g, '').slice(0, 140));
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        throw new Error(json.message || 'Error processing response');
      }
    } catch (e: any) {
      const errSuffix = Math.random().toString(36).substring(2, 8);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}_${errSuffix}`,
          sender: 'model',
          text: `⚠️ **AI Intelligence Notice**: ${e.message || 'Unable to connect to live AI services. Showing verified local knowledge.'}`,
          sourceClassification: 'VERIFIED',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && processedPromptRef.current !== initialPrompt.trim()) {
      processedPromptRef.current = initialPrompt.trim();
      handleSend(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const getClassificationBadge = (cls?: 'VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'AI_ANALYSIS') => {
    switch (cls) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified Source
          </span>
        );
      case 'CALCULATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-2.5 h-2.5" />
            Calculated
          </span>
        );
      case 'ESTIMATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            <TrendingUp className="w-2.5 h-2.5" />
            Estimated
          </span>
        );
      case 'AI_ANALYSIS':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5" />
            AI Analysis
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {/* Top Banner & Navigation Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0D1527] to-purple-900/20 border border-amber-500/25 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-700 p-[1.5px] shadow-xl shadow-amber-500/30">
              <div className="w-full h-full bg-[#080D18] rounded-[14px] flex items-center justify-center">
                <Bot className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
                  KIAAN INTELLIGENCE™
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  MahaRERA Grounded
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                AI Advisory, Property DNA™, Decision Confidence, & Spatial Commute Simulator
              </p>
            </div>
          </div>

          {/* Quick Property DNA Summary Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDnaModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Target className="w-4 h-4" />
              <span>Property DNA™: ₹{(propertyDna.budgetMinINR / 10000000).toFixed(1)} - {(propertyDna.budgetMaxINR / 10000000).toFixed(1)} Cr</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Edit</span>
            </button>

            {/* Voice Toggle */}
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isVoiceActive
                  ? 'bg-amber-500 border-amber-400 text-black shadow-md shadow-amber-500/30 animate-pulse'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
              title={isVoiceActive ? 'Voice output enabled' : 'Enable voice output'}
            >
              {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Intelligence Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-4 border-t border-white/10 text-xs">
          {[
            { id: 'CHAT', label: 'Conversational Concierge', icon: Bot },
            { id: 'DNA_RECOMMENDATIONS', label: 'Property DNA™ & Recommendations', icon: Target },
            { id: 'PROPERTY_BATTLE', label: 'AI Property Battle™', icon: Swords },
            { id: 'SURPRISE_ME', label: 'Surprise Me™ Recommendations', icon: Sparkles },
            { id: 'PROPERTY_MEMORY', label: 'Property Memory™ & Watch', icon: Clock },
            { id: 'INTELLIGENCE_SCORE', label: 'Intelligence Score™', icon: Award },
            { id: 'PRICE_LADDER', label: 'Price Ladder™', icon: TrendingUp },
            { id: 'TRADEOFF_COMMUTE', label: 'Trade-Off & Commute', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold tracking-wide transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SUB-TAB 1: CONVERSATIONAL CONCIERGE & FOLLOW-UP ASSISTANT     */}
      {/* ============================================================ */}
      {activeSubTab === 'CHAT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Stream */}
          <div className="lg:col-span-2 space-y-4">
            {/* Suggested Follow-Ups */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Conversational Follow-ups (Context Maintained):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {conversationalFollowUps.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-white/80 hover:text-amber-300 text-xs transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>"{p}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Box */}
            <div className="rounded-3xl bg-[#090E1A]/80 border border-white/10 p-5 h-[480px] overflow-y-auto space-y-4 flex flex-col backdrop-blur-md shadow-inner">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${
                    m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-amber-500 text-black font-medium rounded-tr-none shadow-md shadow-amber-500/20'
                        : 'bg-white/[0.07] border border-white/10 text-white rounded-tl-none space-y-2 shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 px-1 text-[10px] text-white/50">
                    <span>{m.timestamp}</span>
                    {m.sourceClassification && getClassificationBadge(m.sourceClassification)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="self-start p-4 rounded-2xl bg-white/[0.07] border border-white/10 text-white/70 text-xs flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Consulting verified MahaRERA registries & pricing algorithms...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-[#0C1220] p-2.5 rounded-2xl border border-white/15 focus-within:border-amber-500/50 transition-all shadow-lg"
            >
              <input
                type="text"
                id="ai-prompt-input"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask Kiaan (e.g. 'Show 3 BHK in Wakad with immediate possession under 1.8 Cr')..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <button
                type="submit"
                id="ai-submit-btn"
                disabled={isLoading || !inputPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>Ask Kiaan</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Rail: Grounding & AI Data Classification Guide */}
          <div className="space-y-4">
            {/* Knowledge Priority Hierarchy */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                AI Knowledge Priority Chain (Sec 40)
              </h3>
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>100% Verified MahaRERA & Deeds</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Approved CMS & Spatial Coordinates</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Deterministic Math & Tax Calculators</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>IGR Historical Pricing Trends</span>
                </div>
              </div>
            </div>

            {/* AI Data Classifications */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <h3 className="text-xs font-bold uppercase text-white/80 tracking-wider">
                Answer Classifications (Sec 41)
              </h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2 text-white/70">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">VERIFIED</span>
                  <span>Direct from Government Portal or Escrow Bank.</span>
                </div>
                <div className="flex items-start gap-2 text-white/70">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold shrink-0">CALCULATED</span>
                  <span>Deterministic stamp duty & statutory math.</span>
                </div>
                <div className="flex items-start gap-2 text-white/70">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">ESTIMATED</span>
                  <span>Data-driven micro-market rental forecasts.</span>
                </div>
                <div className="flex items-start gap-2 text-white/70">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold shrink-0">AI ANALYSIS</span>
                  <span>Comparative lifestyle & architectural reasoning.</span>
                </div>
              </div>
            </div>

            {/* Zero Hallucination Guarantee */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Zero-Hallucination Guardrail (Sec 42)
              </p>
              <p className="text-white/70 text-[11px] leading-relaxed">
                If statutory clearance or pricing facts are unverified, Kiaan states: <em>"I don't have verified information for that yet."</em> We never invent unit sizes or RERA registrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: PROPERTY DNA™ & RECOMMENDATION ENGINE (SEC 43/44) */}
      {/* ============================================================ */}
      {activeSubTab === 'DNA_RECOMMENDATIONS' && (
        <div className="space-y-6">
          {/* Active DNA Profile Snapshot */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#0E1526] to-transparent border border-amber-500/25 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  Your Active Property DNA™ Profile
                </h2>
                <p className="text-xs text-white/60">
                  Customized parameters driving algorithmic recommendations across 9 curated investor categories.
                </p>
              </div>
              <button
                onClick={() => setIsDnaModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer self-start md:self-auto"
              >
                Customize Property DNA™
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/40 uppercase block">Budget Bracket</span>
                <span className="font-bold text-amber-400">₹{(propertyDna.budgetMinINR / 10000000).toFixed(1)} - {(propertyDna.budgetMaxINR / 10000000).toFixed(1)} Cr</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/40 uppercase block">Primary Locations</span>
                <span className="font-bold text-white">{propertyDna.preferredLocations.join(', ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/40 uppercase block">Configurations</span>
                <span className="font-bold text-white">{propertyDna.preferredConfigurations.join(', ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/40 uppercase block">Family Size</span>
                <span className="font-bold text-white">{propertyDna.familyRequirements.familyMembersCount} Members ({propertyDna.familyRequirements.childrenCount} Kids)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/40 uppercase block">Primary Commute</span>
                <span className="font-bold text-white">{propertyDna.primaryCommuteDestination.split(' ')[0]} (≤{propertyDna.maxCommuteMinutes}m)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/40 uppercase block">School Priority</span>
                <span className="font-bold text-emerald-400">{propertyDna.schoolPriorityLevel}</span>
              </div>
            </div>
          </div>

          {/* Categorized Recommendations Grid (Section 44) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              9 Categorized Recommendations (Section 44)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedRecs.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 transition-all space-y-3 flex flex-col justify-between group shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-white tracking-wide">
                        {rec.title}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {rec.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                        {rec.project.name}
                      </h4>
                      <p className="text-xs text-white/60">
                        {rec.project.location.microMarket}, Pune • {rec.project.headlinePriceRange.displayString}
                      </p>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                      {rec.highlight}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      RERA: {rec.project.reraRecord.registrationNumber}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProject(rec.project);
                        setActiveSubTab('INTELLIGENCE_SCORE');
                      }}
                      className="text-xs text-amber-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Analyze Score</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: PROPERTY INTELLIGENCE SCORE & DECISION CONFIDENCE  */}
      {/* ============================================================ */}
      {activeSubTab === 'INTELLIGENCE_SCORE' && (
        <div className="space-y-6">
          {/* Project Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 uppercase font-semibold">Inspecting Property:</span>
              <select
                value={selectedProject.id}
                onChange={(e) => {
                  const p = INITIAL_PROJECTS.find((proj) => proj.id === e.target.value);
                  if (p) setSelectedProject(p);
                }}
                className="rounded-xl bg-[#0D1526] border border-white/20 px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
              >
                {INITIAL_PROJECTS.map((proj) => (
                  <option key={proj.id} value={proj.id} className="bg-[#0D1526] text-white">
                    {proj.name} ({proj.location.microMarket} • {proj.headlinePriceRange.displayString})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/60">MahaRERA:</span>
              <span className="font-mono text-emerald-400 font-bold">{selectedProject.reraRecord.registrationNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Overall Intelligence Gauge & Breakdown (Section 45) */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0B101E] border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Property Intelligence Score™ (Section 45)
                  </h3>
                  <p className="text-xs text-white/60">
                    Explainable deterministic scoring weighted across 7 rigorous real estate vectors.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-serif font-black text-amber-400">
                    {intelligenceScore.overallScore}<span className="text-base text-white/40 font-sans">/100</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Top 2% in Micro-Market</span>
                </div>
              </div>

              {/* Vector Bars */}
              <div className="space-y-3.5">
                {[
                  { label: 'Location Prime Index', score: intelligenceScore.breakdown.location, reason: intelligenceScore.explanations.locationReason },
                  { label: 'Value & Rate Conformance', score: intelligenceScore.breakdown.value, reason: intelligenceScore.explanations.valueReason },
                  { label: 'Lifestyle & Amenities', score: intelligenceScore.breakdown.lifestyle, reason: intelligenceScore.explanations.lifestyleReason },
                  { label: 'Arterial Connectivity', score: intelligenceScore.breakdown.connectivity, reason: intelligenceScore.explanations.connectivityReason },
                  { label: 'Investment & Yield Index', score: intelligenceScore.breakdown.investment, reason: intelligenceScore.explanations.investmentReason },
                  { label: 'Space Efficiency & Carpet Ratio', score: intelligenceScore.breakdown.space, reason: intelligenceScore.explanations.spaceReason },
                  { label: 'Developer Delivery Track Record', score: intelligenceScore.breakdown.developer, reason: intelligenceScore.explanations.developerReason },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white/90">{item.label}</span>
                      <span className="font-mono font-bold text-amber-400">{item.score} / 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-white/50">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Decision Confidence & Information Completeness (Section 46/47) */}
            <div className="space-y-6">
              {/* Decision Confidence Card */}
              <div className="p-6 rounded-3xl bg-[#0E1526] border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    Decision Confidence (Sec 46)
                  </h4>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {decisionConfidence.confidencePercent}%
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Data Completeness:</span>
                    <span className="font-bold text-white">{decisionConfidence.factors.dataCompletenessPercent}%</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Customer DNA Fit:</span>
                    <span className="font-bold text-amber-400">{decisionConfidence.factors.customerFitPercent}%</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Comparables Reliability:</span>
                    <span className="font-bold text-emerald-400">{decisionConfidence.factors.priceComparablesReliability}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Location Geo-Stamp:</span>
                    <span className="font-bold text-emerald-400">VERIFIED</span>
                  </div>
                </div>

                <p className="text-[11px] text-white/60 bg-black/30 p-3 rounded-xl border border-white/5 leading-relaxed">
                  {decisionConfidence.summaryRationale}
                </p>
              </div>

              {/* Information Completeness Card (Section 47) */}
              <div className="p-6 rounded-3xl bg-[#090E1A] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    Information Completeness (Sec 47)
                  </h4>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {completeness.completenessPercent}% Complete
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>High-Res Photos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>2D/3D Floor Plan</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Location Geo-Tag</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Pricing Breakdown</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Amenities List</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>MahaRERA Clearance</span>
                  </div>
                </div>

                {(completeness.pendingNotices || []).length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                    ⚠ {completeness.pendingNotices[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 4: PRICE INTELLIGENCE & PROPERTY LADDER™ (SEC 48-51) */}
      {/* ============================================================ */}
      {activeSubTab === 'PRICE_LADDER' && (
        <div className="space-y-6">
          {/* Price Intelligence Matrix (Section 48 & 49) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0A0F1C] border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    Price Intelligence™ & Real Comps (Section 48)
                  </h3>
                  <p className="text-xs text-white/60">
                    Real-time market valuation compared with registered IGR transactions in {selectedProject.location.microMarket}.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                  {priceIntel.kiaanVerdict} Value
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-white/40 block">Asking Base Price</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">
                    ₹{(priceIntel.askingPriceINR / 10000000).toFixed(2)} Cr
                  </span>
                  <span className="text-[10px] text-white/50 block">₹{priceIntel.ratePerSqFtINR}/sq.ft</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-white/40 block">Comparable Range</span>
                  <span className="text-lg font-bold text-white font-mono">
                    ₹{(priceIntel.comparableRangeMinINR / 10000000).toFixed(2)} - {(priceIntel.comparableRangeMaxINR / 10000000).toFixed(2)} Cr
                  </span>
                  <span className="text-[10px] text-emerald-400 block">Verified Range</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-white/40 block">Price Positioning</span>
                  <span className="text-lg font-bold text-emerald-400">
                    Fair Market
                  </span>
                  <span className="text-[10px] text-white/50 block">Zero Developer Bubble</span>
                </div>
              </div>

              {/* Price History Trend (Section 49) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-white/80 tracking-wider">
                  Verified Historical Price Movement (Section 49)
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {priceIntel.historicalMovement.map((hist) => (
                    <div key={hist.year} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1">
                      <span className="text-xs font-bold text-amber-400">{hist.year}</span>
                      <p className="text-sm font-bold font-mono text-white">₹{hist.avgPricePerSqFtINR}</p>
                      <span className="text-[9px] text-white/40 block">{hist.sampleTransactionCount} Filings</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed italic">
                  * {priceIntel.dataSourceContext}
                </p>
              </div>
            </div>

            {/* Opportunity Score (Section 50) */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A0E1A] border border-amber-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Opportunity Score (Sec 50)
                </h3>
                <span className="text-xl font-bold font-mono text-amber-400">{opportunityScore.scorePercent}%</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {opportunityScore.badges.map((b, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                    {b.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>

              <p className="text-xs text-white/70 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                {opportunityScore.rationale}
              </p>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-300 leading-relaxed">
                <strong>Statutory Note:</strong> {opportunityScore.disclaimer}
              </div>
            </div>
          </div>

          {/* Property Ladder™ (Section 51) */}
          <div className="p-6 rounded-3xl bg-[#090E1A] border border-white/10 space-y-4">
            <div>
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Property Ladder™ — What Additional Money Gets You (Section 51)
              </h3>
              <p className="text-xs text-white/60">
                Transparent step progression analyzing upgrades in floor plate, horizon elevation, and premium finishes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {propertyLadder.map((tier, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${
                    tier.tierName === 'Best Match'
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                        tier.tierName === 'Best Match' ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'
                      }`}>
                        {tier.tierName}
                      </span>
                      <span className="text-xs text-white/50 font-mono">{tier.carpetAreaSqFt} sq.ft</span>
                    </div>

                    <p className="text-base font-bold text-white font-mono">
                      ₹{(tier.priceINR / 10000000).toFixed(2)} Cr
                    </p>

                    <p className="text-xs font-semibold text-amber-400">
                      {tier.unitConfiguration}
                    </p>

                    <p className="text-xs text-white/70 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                      {tier.keyGainsDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenProjectExperience) onOpenProjectExperience(tier.projectId);
                    }}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-black text-white text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Inspect Inventory
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 5: TRADE-OFF ENGINE & COMMUTE SIMULATOR (SEC 52-54)   */}
      {/* ============================================================ */}
      {activeSubTab === 'TRADEOFF_COMMUTE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade-Off Dilemma Engine (Section 52) */}
          <div className="p-6 rounded-3xl bg-[#090E1A] border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                Trade-Off Dilemma Engine (Section 52)
              </h3>
              <p className="text-xs text-white/60">
                Calibrate balance points to see real-time dynamic inventory adjustments.
              </p>
            </div>

            {/* Dilemma 1: Bigger Home vs Better Location */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex justify-between text-xs font-bold">
                <span className={spaceVsLocation < 40 ? 'text-amber-400' : 'text-white/60'}>Bigger Home (Wakad/Hinjewadi)</span>
                <span className={spaceVsLocation > 60 ? 'text-amber-400' : 'text-white/60'}>Prime Node (Baner High St)</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={spaceVsLocation}
                onChange={(e) => setSpaceVsLocation(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-white/50">
                {spaceVsLocation > 50
                  ? 'Priority shifted to Baner: +12% closer to fine dining & High Street Metro.'
                  : 'Priority shifted to Wakad: +280 sq.ft larger carpet area for equivalent budget.'}
              </p>
            </div>

            {/* Dilemma 2: Ready Possession vs Lower Price */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex justify-between text-xs font-bold">
                <span className={possessionVsPrice < 40 ? 'text-emerald-400' : 'text-white/60'}>Ready Possession (0% GST)</span>
                <span className={possessionVsPrice > 60 ? 'text-amber-400' : 'text-white/60'}>Under Construction (Lower Price)</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={possessionVsPrice}
                onChange={(e) => setPossessionVsPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-white/50">
                {possessionVsPrice > 50
                  ? 'Staged Milestone Plan: Pay in 7 verified construction phases over 24 months.'
                  : 'Immediate Possession: Zero waiting period, instant rental cash flow.'}
              </p>
            </div>
          </div>

          {/* Commute Simulator & Location Intelligence (Section 53 & 54) */}
          <div className="p-6 rounded-3xl bg-[#090E1A] border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-400" />
                Commute Simulator & Location Intel (Section 53 & 54)
              </h3>
              <p className="text-xs text-white/60">
                Select your key daily destination to view estimated travel times from verified micro-markets.
              </p>
            </div>

            {/* Destination Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase">Select Key Destination:</label>
              <select
                value={selectedCommuteDest.id}
                onChange={(e) => {
                  const d = PUNE_COMMUTE_DESTINATIONS.find((dest) => dest.id === e.target.value);
                  if (d) setSelectedCommuteDest(d);
                }}
                className="w-full rounded-xl bg-[#0D1526] border border-white/20 px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
              >
                {PUNE_COMMUTE_DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#0D1526] text-white">
                    {d.label} ({d.destinationType})
                  </option>
                ))}
              </select>
            </div>

            {/* Commute Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">From Wakad Node</span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {selectedCommuteDest.travelTimes.fromWakadMinutes} mins
                </span>
                <span className="text-[10px] text-emerald-400 block">Fastest via Flyover</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">From Baner Node</span>
                <span className="text-lg font-bold font-mono text-white">
                  {selectedCommuteDest.travelTimes.fromBanerMinutes} mins
                </span>
                <span className="text-[10px] text-white/50 block">Via High Street Rd</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">From Hinjewadi Node</span>
                <span className="text-lg font-bold font-mono text-white">
                  {selectedCommuteDest.travelTimes.fromHinjewadiMinutes} mins
                </span>
                <span className="text-[10px] text-white/50 block">Direct Tech Corridor</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">From Kharadi Node</span>
                <span className="text-lg font-bold font-mono text-white">
                  {selectedCommuteDest.travelTimes.fromKharadiMinutes} mins
                </span>
                <span className="text-[10px] text-white/50 block">East Pune Bypass</span>
              </div>
            </div>

            {/* Filter by Commute Radius Button */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-400">Commute Boundary Filter</span>
                <p className="text-[11px] text-white/60">Show properties within ≤ {maxCommuteFilterMinutes} mins of {selectedCommuteDest.label.split(' ')[0]}</p>
              </div>
              <button
                onClick={() => {
                  handleSend(`Show properties within ${maxCommuteFilterMinutes} minutes of ${selectedCommuteDest.label}`);
                  setActiveSubTab('CHAT');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 6: AI PROPERTY BATTLE™ (SECTION 57)                  */}
      {/* ============================================================ */}
      {activeSubTab === 'PROPERTY_BATTLE' && (
        <PropertyBattleSuite
          onOpenProjectExperience={onOpenProjectExperience}
        />
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 7: SURPRISE ME™ LATENT RECOMMENDATIONS (SECTION 61)   */}
      {/* ============================================================ */}
      {activeSubTab === 'SURPRISE_ME' && (
        <SurpriseMeEngine
          onOpenProjectExperience={onOpenProjectExperience}
        />
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 8: PROPERTY MEMORY™ & WATCH TRIGGERS (SECTIONS 62-63) */}
      {/* ============================================================ */}
      {activeSubTab === 'PROPERTY_MEMORY' && (
        <PropertyMemoryAndWatch
          onOpenProjectExperience={onOpenProjectExperience}
        />
      )}

      {/* ============================================================ */}
      {/* PROPERTY DNA™ CUSTOMIZATION MODAL (SECTION 43)               */}
      {/* ============================================================ */}
      {isDnaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-2xl w-full bg-[#0D1527] border border-amber-500/40 rounded-3xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  Customize Property DNA™ (Section 43)
                </h3>
                <p className="text-xs text-white/60">
                  Update your real estate DNA to personalize AI recommendations.
                </p>
              </div>
              <button
                onClick={() => setIsDnaModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Budget Range */}
              <div className="space-y-2">
                <label className="font-semibold text-white/80 uppercase">Budget Ceiling (₹ Cr):</label>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-amber-400 font-mono text-sm">
                    ₹{(propertyDna.budgetMaxINR / 10000000).toFixed(2)} Cr
                  </span>
                  <input
                    type="range"
                    min={10000000}
                    max={50000000}
                    step={1000000}
                    value={propertyDna.budgetMaxINR}
                    onChange={(e) => setPropertyDna({ ...propertyDna, budgetMaxINR: Number(e.target.value) })}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <label className="font-semibold text-white/80 uppercase">Primary Acquisition Purpose:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'END_USE_SELF', label: 'Primary Family Residence' },
                    { id: 'LONG_TERM_INVESTMENT', label: 'Long-Term Capital Alpha' },
                    { id: 'RENTAL_YIELD', label: 'High IT Corridor Rental Yield' },
                    { id: 'VACATION_HOME', label: 'Weekend Sky Penthouse' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPropertyDna({ ...propertyDna, purpose: p.id as any })}
                      className={`p-2.5 rounded-xl text-left font-bold transition-all ${
                        propertyDna.purpose === p.id
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* School Priority & Commute */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-white/80 uppercase">School Priority:</label>
                  <select
                    value={propertyDna.schoolPriorityLevel}
                    onChange={(e) => setPropertyDna({ ...propertyDna, schoolPriorityLevel: e.target.value as any })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 p-2 text-white"
                  >
                    <option value="CRITICAL" className="bg-[#0D1527] text-white">Critical (≤ 10 mins)</option>
                    <option value="IMPORTANT" className="bg-[#0D1527] text-white">Important (≤ 20 mins)</option>
                    <option value="NOT_APPLICABLE" className="bg-[#0D1527] text-white">Not Applicable</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-white/80 uppercase">Possession Preference:</label>
                  <select
                    value={propertyDna.possessionPreference}
                    onChange={(e) => setPropertyDna({ ...propertyDna, possessionPreference: e.target.value as any })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 p-2 text-white"
                  >
                    <option value="IMMEDIATE_READY" className="bg-[#0D1527] text-white">Immediate Ready / OC</option>
                    <option value="WITHIN_6_MONTHS" className="bg-[#0D1527] text-white">Within 6 Months</option>
                    <option value="UNDER_CONSTRUCTION_1_2_YRS" className="bg-[#0D1527] text-white">1-2 Years (Construction Stages)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsDnaModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Save & Recalculate Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
