/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building,
  Briefcase,
  Users,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Flame,
} from 'lucide-react';
import { Locality, Project } from '../../types';
import {
  localityIntelligenceService,
  LocalityMatchmakerProfile,
  LocalityMatchResult,
} from '../../services/localityIntelligenceService';

interface LocalityMatchmakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  localities: Locality[];
  projects: Project[];
  onSelectLocality: (locality: Locality) => void;
  onSelectProject?: (project: Project) => void;
}

export const LocalityMatchmakerModal: React.FC<LocalityMatchmakerModalProps> = ({
  isOpen,
  onClose,
  localities,
  projects,
  onSelectLocality,
  onSelectProject,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [profile, setProfile] = useState<LocalityMatchmakerProfile>({
    budget: 12500000, // 1.25 Cr default
    mode: 'BUY',
    familySize: 3,
    hasChildren: true,
    workplace: 'Hinjewadi',
    lifestylePreference: 'COMMUTE_FOCUSED',
  });

  const [results, setResults] = useState<LocalityMatchResult[]>([]);

  if (!isOpen) return null;

  const handleRunMatchmaker = () => {
    const matched = localityIntelligenceService.matchUserToLocalities(profile, localities, projects);
    setResults(matched);
    setStep(2);
  };

  const workplaceOptions = [
    { label: 'Hinjewadi Tech Park (Phases 1-3)', value: 'Hinjewadi' },
    { label: 'Baner / Balewadi High Street', value: 'Baner' },
    { label: 'Kharadi / EON Free Zone / WTC', value: 'Kharadi' },
    { label: 'Shivajinagar / Central Pune', value: 'Shivajinagar' },
    { label: 'Chakan / Talegaon Industrial MIDC', value: 'Chakan' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">AI Locality Matchmaker</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Kiaan Intelligence
                </span>
              </div>
              <p className="text-xs text-white/60">
                Discover the micro-market that precisely fits your budget, commute, family & lifestyle priorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Intent & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                    Property Objective
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, mode: 'BUY' })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        profile.mode === 'BUY'
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Buy / Self-Use & Investment
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, mode: 'RENT' })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        profile.mode === 'RENT'
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Rent / Relocation
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Target Budget
                    </label>
                    <span className="text-sm font-mono font-bold text-amber-400">
                      {localityIntelligenceService.formatCurrency(profile.budget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000000"
                    max="40000000"
                    step="500000"
                    value={profile.budget}
                    onChange={(e) => setProfile({ ...profile, budget: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-white/50 font-mono">
                    <span>₹50 Lakh</span>
                    <span>₹1.5 Cr</span>
                    <span>₹4 Cr+</span>
                  </div>
                </div>
              </div>

              {/* Workplace / Primary Commute */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  Primary Office / Workplace Anchor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {workplaceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setProfile({ ...profile, workplace: opt.value })}
                      className={`p-3 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        profile.workplace === opt.value
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Family & Children */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Family Structure
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setProfile({ ...profile, familySize: size })}
                        className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          profile.familySize === size
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {size === 5 ? '5+' : size} {size === 1 ? 'Person' : 'People'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    Schooling & Pediatric Care Priority
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, hasChildren: true })}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        profile.hasChildren
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Yes, Have School-Age Kids
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, hasChildren: false })}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        !profile.hasChildren
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      No / Adult Household
                    </button>
                  </div>
                </div>
              </div>

              {/* Lifestyle Vibe */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Dominant Priority & Lifestyle Vibe
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      key: 'COMMUTE_FOCUSED',
                      title: 'Zero Commute & Connectivity',
                      desc: 'Shortest drive to tech hubs, expressway slipways & upcoming metro stations.',
                    },
                    {
                      key: 'LUXURY_LIFESTYLE',
                      title: 'High-Street & Cosmopolitan',
                      desc: 'Boutique cafes, fine dining boulevards, upscale shopping, and social prestige.',
                    },
                    {
                      key: 'FAMILY_EDUCATION',
                      title: 'Family, Parks & Top Schools',
                      desc: 'Spacious gated communities, clean air, pediatric hospitals, and ICSE/IB schools.',
                    },
                    {
                      key: 'VALUE_INVESTMENT',
                      title: 'Capital Growth & High Rental Yield',
                      desc: 'Maximum appreciation rate per annum with robust corporate tenant demand.',
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          lifestylePreference: item.key as any,
                        })
                      }
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        profile.lifestylePreference === item.key
                          ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-sm ring-1 ring-amber-500/30'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-300">{item.title}</div>
                      <div className="text-[11px] text-white/60 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Recommendations */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Top Recommended Localities For Your Profile
                  </h3>
                  <p className="text-xs text-white/60">
                    Calculated using live platform inventory, ₹/sq.ft metrics, and verified connectivity indices
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/80 font-medium transition-colors cursor-pointer"
                >
                  Edit Preferences
                </button>
              </div>

              <div className="space-y-4">
                {results.slice(0, 3).map((res, idx) => {
                  const loc = res.locality;
                  const isTopMatch = idx === 0;

                  return (
                    <div
                      key={loc.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isTopMatch
                          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <img
                            src={loc.coverImage}
                            alt={loc.name}
                            className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-lg font-bold text-white tracking-tight">{loc.name}</h4>
                              <span className="text-xs text-white/50">{loc.city}</span>
                              {isTopMatch && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  #1 Best Fit
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/70 line-clamp-2 mt-1">
                              {loc.shortDescription}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                              <span className="text-amber-400 font-semibold">
                                ₹{loc.priceIntelligence.averagePricePerSqFt.toLocaleString('en-IN')}/sq.ft
                              </span>
                              <span className="text-white/40">•</span>
                              <span className="text-emerald-400">
                                +{loc.priceIntelligence.yoyGrowthPercent}% YoY
                              </span>
                              <span className="text-white/40">•</span>
                              <span className="text-white/60">
                                Gross Yield: {loc.priceIntelligence.rentalYieldPercent}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black font-mono text-amber-400">
                            {res.matchScore}%
                          </div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                            Suitability Match
                          </div>
                        </div>
                      </div>

                      {/* AI Matching Reasons & Trade-offs */}
                      <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Why It Fits You
                          </span>
                          <ul className="space-y-1">
                            {res.topReasons.map((r, i) => (
                              <li key={i} className="text-xs text-white/80 flex items-start gap-1.5">
                                <span className="text-emerald-400 text-xs leading-none mt-1">✓</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Realistic Trade-offs
                          </span>
                          <ul className="space-y-1">
                            {res.tradeOffs.map((t, i) => (
                              <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                                <span className="text-amber-400 text-xs leading-none mt-1">•</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Building className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {res.recommendedProjects.length} Verified Master Developments Available
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectLocality(loc);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          Explore {loc.name} Intelligence
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {step === 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/60 shrink-0">
            <div className="text-xs text-white/50 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Grounded in verified Pune micro-market analytics</span>
            </div>
            <button
              type="button"
              onClick={handleRunMatchmaker}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs tracking-wide flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Calculate Best Localities
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalityMatchmakerModal;
