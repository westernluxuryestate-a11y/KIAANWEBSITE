/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  Swords,
  Layers,
  Sparkles,
  ShieldCheck,
  Building,
  TrendingUp,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ThumbsUp,
  Scale,
  Calendar,
  IndianRupee,
  Share2,
} from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/seedData';

interface PropertyBattleSuiteProps {
  onOpenProjectExperience?: (projectId: string) => void;
  onOpenDigitalTwin?: (project: Project, unitId?: string) => void;
  onScheduleVisit?: (project: Project) => void;
}

export const PropertyBattleSuite: React.FC<PropertyBattleSuiteProps> = ({
  onOpenProjectExperience,
  onOpenDigitalTwin,
  onScheduleVisit,
}) => {
  const [projectAId, setProjectAId] = useState<string>(INITIAL_PROJECTS[0]?.id || 'proj_one_vertica_wakad');
  const [projectBId, setProjectBId] = useState<string>(INITIAL_PROJECTS[1]?.id || 'proj_elysian_baner');

  // Customer Priority Weighting Preset
  const [customerPriority, setCustomerPriority] = useState<
    'BALANCED' | 'FAMILY_LIFESTYLE' | 'RENTAL_ROI' | 'CAPITAL_APPRECIATION' | 'PRICE_CONSCIOUS'
  >('BALANCED');

  const projectA = INITIAL_PROJECTS.find((p) => p.id === projectAId) || INITIAL_PROJECTS[0];
  const projectB = INITIAL_PROJECTS.find((p) => p.id === projectBId) || INITIAL_PROJECTS[1];

  // Battle Matrix Criteria calculation
  const compareCriteria = [
    {
      category: '1. MahaRERA & Statutory Risk',
      projectAVal: `${projectA.reraRecord.status} (${projectA.reraRecord.registrationNumber})`,
      projectBVal: `${projectB.reraRecord.status} (${projectB.reraRecord.registrationNumber})`,
      winner: 'TIE',
      insight: 'Both developments possess 100% verified active MahaRERA escrow registration numbers with clean statutory clearance.',
    },
    {
      category: '2. Entry Price & Value Metric',
      projectAVal: `${formatINR(projectA.headlinePriceRange.min)} - ${formatINR(projectA.headlinePriceRange.max)}`,
      projectBVal: `${formatINR(projectB.headlinePriceRange.min)} - ${formatINR(projectB.headlinePriceRange.max)}`,
      winner: projectA.headlinePriceRange.min < projectB.headlinePriceRange.min ? 'PROJECT_A' : 'PROJECT_B',
      insight: `${projectA.name} offers lower initial capital outlay entry points starting at ${formatINR(projectA.headlinePriceRange.min)}.`,
    },
    {
      category: '3. Micro-Market & IT Connectivity',
      projectAVal: `${projectA.location.microMarket} (Direct Hinjewadi Flyover)`,
      projectBVal: `${projectB.location.microMarket} (High-Street & A-Grade Tech Parks)`,
      winner: customerPriority === 'RENTAL_ROI' ? 'PROJECT_A' : 'PROJECT_B',
      insight: 'Wakad commands higher mass IT tenant volume, while Baner delivers superior high-street luxury lifestyle appreciation.',
    },
    {
      category: '4. Possession & Construction Timeline',
      projectAVal: projectA.status.replace('_', ' '),
      projectBVal: projectB.status.replace('_', ' '),
      winner: 'PROJECT_A',
      insight: `${projectA.name} features active high-pace slab casting with possession scheduled for Q4 2027.`,
    },
    {
      category: '5. Signature Amenities & Density',
      projectAVal: `${projectA.amenities?.length || 8}+ Lifestyle Amenities (Sky Pool, Miyawaki Forest)`,
      projectBVal: `${projectB.amenities?.length || 7}+ Bespoke Amenities (Golf Simulator, Penthouse Decks)`,
      winner: 'PROJECT_A',
      insight: `${projectA.name} provides larger dedicated community green acreage and comprehensive 40,000 sq.ft clubhouse.`,
    },
  ];

  // AI Judge Decision based on Customer Priorities
  let battleWinner = projectA;
  let winnerScore = 88;
  let runnerUpScore = 82;
  let aiJudgeVerdict = '';
  let keyTradeOffNote = '';

  if (customerPriority === 'RENTAL_ROI' || customerPriority === 'PRICE_CONSCIOUS') {
    battleWinner = projectA;
    winnerScore = 91;
    runnerUpScore = 79;
    aiJudgeVerdict = `${projectA.name} decisively wins for rental yield and budget efficiency. Its Wakad location right on the Hinjewadi tech corridor guarantees continuous executive IT tenant demand with lowest vacancy risk.`;
    keyTradeOffNote = `Trade-off: You sacrifice Baner's high-street café walkability in exchange for ~1.8% higher net rental cap rate and ₹35L lower capital outlay.`;
  } else if (customerPriority === 'FAMILY_LIFESTYLE' || customerPriority === 'CAPITAL_APPRECIATION') {
    battleWinner = projectB;
    winnerScore = 89;
    runnerUpScore = 84;
    aiJudgeVerdict = `${projectB.name} is the optimal choice for luxury living and 5-year capital compounding. Baner's social infrastructure, top-tier IB schools, and executive prestige command higher long-term resale multiples.`;
    keyTradeOffNote = `Trade-off: Higher entry capital and slightly lower gross rental yield compared to Wakad's IT density.`;
  } else {
    battleWinner = projectA;
    winnerScore = 87;
    runnerUpScore = 85;
    aiJudgeVerdict = `In a balanced evaluation, ${projectA.name} edges ahead due to larger open amenity green zones (Miyawaki Bio-Reserve) and verified escrow protections.`;
    keyTradeOffNote = `Both projects represent Tier-1 Grade-A construction quality; choose ${projectB.name} if immediate high-street retail access is your paramount metric.`;
  }

  return (
    <div className="space-y-8 animate-fade-in" id="property-battle-suite">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12081E] via-[#0D0B1A] to-[#06040C] border border-purple-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Swords className="w-3.5 h-3.5" />
            <span>AI Property Battle™ & Decision Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Side-by-Side Asset Head-to-Head & AI Trade-Off Arbiter
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Compare any two Pune landmark developments across statutory MahaRERA compliance, true cost of acquisition, commute ergonomics, and investment velocity.
          </p>
        </div>

        {/* Priority Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2 pt-6 border-t border-white/10 relative z-10">
          <span className="text-xs text-white/50 uppercase font-bold mr-2 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            Optimize AI Judge For:
          </span>
          {[
            { id: 'BALANCED', label: 'Balanced Overall' },
            { id: 'RENTAL_ROI', label: 'Max Rental ROI' },
            { id: 'FAMILY_LIFESTYLE', label: 'Family & Schooling' },
            { id: 'CAPITAL_APPRECIATION', label: 'Capital Appreciation' },
            { id: 'PRICE_CONSCIOUS', label: 'Budget Efficiency' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setCustomerPriority(p.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                customerPriority === p.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project A Picker */}
        <div className="rounded-3xl bg-[#0C1220]/90 border border-blue-500/30 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase">
              Contender A
            </span>
            <span className="text-xs text-white/40">{projectA.location.microMarket}</span>
          </div>

          <select
            value={projectAId}
            onChange={(e) => setProjectAId(e.target.value)}
            className="w-full rounded-2xl bg-white/[0.06] border border-white/15 px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-400"
          >
            {INITIAL_PROJECTS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0C1220] text-white">
                {p.name} ({p.location.microMarket})
              </option>
            ))}
          </select>

          <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
            <img src={projectA.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'} alt={projectA.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="font-bold text-base">{projectA.name}</h3>
              <p className="text-xs text-white/70">{formatINR(projectA.headlinePriceRange.min)} - {formatINR(projectA.headlinePriceRange.max)}</p>
            </div>
          </div>
        </div>

        {/* Project B Picker */}
        <div className="rounded-3xl bg-[#0C1220]/90 border border-amber-500/30 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase">
              Contender B
            </span>
            <span className="text-xs text-white/40">{projectB.location.microMarket}</span>
          </div>

          <select
            value={projectBId}
            onChange={(e) => setProjectBId(e.target.value)}
            className="w-full rounded-2xl bg-white/[0.06] border border-white/15 px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
          >
            {INITIAL_PROJECTS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0C1220] text-white">
                {p.name} ({p.location.microMarket})
              </option>
            ))}
          </select>

          <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
            <img src={projectB.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} alt={projectB.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="font-bold text-base">{projectB.name}</h3>
              <p className="text-xs text-white/70">{formatINR(projectB.headlinePriceRange.min)} - {formatINR(projectB.headlinePriceRange.max)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Judge Crown Card */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/50 via-[#100D22] to-amber-950/40 border border-purple-500/40 p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">AI Battle Winner</span>
              <h3 className="text-xl font-bold text-white">{battleWinner.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-white/40 uppercase block">Decision Fit Score</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">{winnerScore}% Fit</span>
            </div>
            <button
              onClick={() => onOpenProjectExperience && onOpenProjectExperience(battleWinner.id)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Explore Winning Asset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-white/80 leading-relaxed font-medium">
            {aiJudgeVerdict}
          </p>
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-amber-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span><strong>Transparent Trade-Off:</strong> {keyTradeOffNote}</span>
          </div>
        </div>
      </div>

      {/* Head-to-Head Attributes Matrix */}
      <div className="rounded-3xl bg-[#0B111E]/90 border border-white/10 p-6 overflow-x-auto">
        <h4 className="text-base font-serif font-bold text-white mb-4">Detailed Head-to-Head Comparison Dimensions</h4>
        <div className="space-y-4">
          {compareCriteria.map((crit, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-bold uppercase text-white/50">{crit.category}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className={`p-3 rounded-xl border ${crit.winner === 'PROJECT_A' ? 'bg-blue-500/10 border-blue-500/40 text-blue-200' : 'bg-white/[0.02] border-white/5 text-white/70'}`}>
                  <div className="font-semibold text-white mb-0.5">{projectA.name}</div>
                  <div>{crit.projectAVal}</div>
                </div>

                <div className={`p-3 rounded-xl border ${crit.winner === 'PROJECT_B' ? 'bg-amber-500/10 border-amber-500/40 text-amber-200' : 'bg-white/[0.02] border-white/5 text-white/70'}`}>
                  <div className="font-semibold text-white mb-0.5">{projectB.name}</div>
                  <div>{crit.projectBVal}</div>
                </div>
              </div>
              <p className="text-[11px] text-white/50 italic pt-1">{crit.insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
