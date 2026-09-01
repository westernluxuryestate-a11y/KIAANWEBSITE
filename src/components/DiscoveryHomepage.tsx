/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Mic,
  MicOff,
  Building,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Compass,
  CheckCircle2,
  Maximize2,
  MapPin,
  Flame,
  Zap,
  Key,
  Briefcase,
  Home,
  Clock,
  ChevronRight,
  Calculator,
  BookOpen,
  FileCheck,
  BadgePercent,
  Coins,
  DollarSign,
  Heart,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Project, Property, Unit } from '../types';
import { ProjectCard } from './ProjectCard';
import { calculateEMI, calculateStatutoryTaxShield } from '../services/calculatorEngine';
import { KiaanPicksSection } from './KiaanPicksSection';
import { OpportunityWallView } from './OpportunityWallView';
import { PreLeaseExperienceView } from './PreLeaseExperienceView';
import { PropertyPersonalityBadge } from './PropertyPersonalityBadge';
import { TrustCenterSection } from './TrustCenterSection';
import { CustomerReviewsSection } from './CustomerReviewsSection';
import { GroundedFaqEngine } from './GroundedFaqEngine';
import { analyticsEngine } from '../services/analyticsStore';

interface DiscoveryHomepageProps {
  projects: Project[];
  properties: Property[];
  customerMode: 'BUY' | 'RENT_LEASE' | 'INVEST';
  setCustomerMode: (mode: 'BUY' | 'RENT_LEASE' | 'INVEST') => void;
  theme?: 'dark' | 'light';
  onOpenAssetExperience: (project: Project, unitId?: string) => void;
  onOpenPropertyExperience?: (property: Property) => void;
  onOpenScheduleVisit: (project: Project) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenSellModal: () => void;
  onOpenLoginModal: () => void;
  onExecuteSearchQuery: (query: string, parsedFilters?: any) => void;
}

export const DiscoveryHomepage: React.FC<DiscoveryHomepageProps> = ({
  projects,
  properties,
  customerMode,
  setCustomerMode,
  theme = 'dark',
  onOpenAssetExperience,
  onOpenPropertyExperience,
  onOpenScheduleVisit,
  onNavigateToTab,
  onOpenSellModal,
  onOpenLoginModal,
  onExecuteSearchQuery,
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedSubIntent, setSelectedSubIntent] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Quick Calculator State
  const [calcBudgetCr, setCalcBudgetCr] = useState<number>(2.0);
  const [calcTenureYrs, setCalcTenureYrs] = useState<number>(20);
  const [calcInterestRate, setCalcInterestRate] = useState<number>(8.5);

  // Voice Search Recognition (Web Speech API)
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = 'hi-IN'; // Supports Hindi, Marathi, English & Hinglish naturally

      recog.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSearchQuery(transcript);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is available in Chrome, Edge, and Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    // Automatic Natural Language parser
    const q = searchQuery.toLowerCase();
    let mode: 'BUY' | 'RENT_LEASE' | 'INVEST' = customerMode;
    let microMarket = '';
    let config = '';
    let maxBudget: number | undefined;

    if (q.includes('rent') || q.includes('lease') || q.includes('bhaade')) mode = 'RENT_LEASE';
    if (q.includes('invest') || q.includes('yield') || q.includes('commercial') || q.includes('roi')) mode = 'INVEST';
    if (q.includes('buy') || q.includes('purchase') || q.includes('kharidna')) mode = 'BUY';

    if (q.includes('wakad')) microMarket = 'Wakad';
    else if (q.includes('baner')) microMarket = 'Baner';
    else if (q.includes('hinjewadi')) microMarket = 'Hinjewadi';
    else if (q.includes('koregaon')) microMarket = 'Koregaon Park';
    else if (q.includes('kharadi')) microMarket = 'Kharadi';

    if (q.includes('3 bhk') || q.includes('3bhk')) config = '3 BHK';
    else if (q.includes('4 bhk') || q.includes('4bhk') || q.includes('penthouse')) config = '4 BHK';

    if (q.includes('1.5') || q.includes('dedh')) maxBudget = 15000000;
    else if (q.includes('2') || q.includes('do crore')) maxBudget = 20000000;
    else if (q.includes('3') || q.includes('teen crore')) maxBudget = 30000000;

    setCustomerMode(mode);
    onExecuteSearchQuery(searchQuery, { microMarket, configuration: config, budgetMax: maxBudget });
  };

  // Multilingual query suggestions
  const samplePrompts = [
    {
      label: 'Hinglish / Hindi',
      text: 'Wakad mein 3 BHK chahiye, 1.5 crore ke andar, Hinjewadi office ke paas.',
    },
    {
      label: 'Marathi',
      text: 'Baner madhe 4 BHK penthouse pahije, balcony view asava.',
    },
    {
      label: 'English Luxury',
      text: 'East-facing duplex penthouse with private pool in Koregaon Park.',
    },
    {
      label: 'Commercial Invest',
      text: 'Pre-leased Grade A IT office in Hinjewadi with 8.4%+ rental yield.',
    },
  ];

  // Sub-intent filters adapted per mode
  const modeSubIntents: Record<'BUY' | 'RENT_LEASE' | 'INVEST', { id: string; label: string; desc: string }[]> = {
    BUY: [
      { id: 'ALL', label: 'All Buyers', desc: 'Complete portfolio of verified residences' },
      { id: 'FIRST_TIME', label: 'First-time Buyers', desc: 'MahaRERA escrow protected with stamp duty waivers' },
      { id: 'FAMILIES', label: 'Family Residences', desc: 'Near top IB schools, parks & multi-tier clubhouse' },
      { id: 'UPGRADE', label: 'Upgrade Buyers', desc: 'Expansive 3.5 & 4 BHK sky suites with 11ft ceilings' },
      { id: 'LUXURY', label: 'Luxury & Penthouses', desc: 'Duplex sky mansions, private pools & panoramic decks' },
      { id: 'RESALE', label: 'Ready Resale Assets', desc: 'Immediate OC possession with zero construction risk' },
    ],
    RENT_LEASE: [
      { id: 'ALL', label: 'All Leases', desc: 'Curated executive & diplomatic leasing' },
      { id: 'RESIDENTIAL_RENT', label: 'Residential Rent', desc: 'Fully furnished sky residences in tech corridors' },
      { id: 'RESIDENTIAL_LEASE', label: 'Residential Long Lease', desc: 'Multi-year locked leases for senior leadership' },
      { id: 'COMMERCIAL_RENT', label: 'Commercial Rent', desc: 'Plug-and-play executive suites & business lounges' },
      { id: 'COMMERCIAL_LEASE', label: 'Commercial Master Lease', desc: 'Whole floor corporate IT park leases' },
      { id: 'PRE_LEASE', label: 'Pre-Lease Assets', desc: 'Locked tenancy with blue-chip corporate tenants' },
    ],
    INVEST: [
      { id: 'ALL', label: 'All Investment', desc: 'Institutional & high-net-worth real estate assets' },
      { id: 'RENTAL_YIELD', label: 'High Rental Yield (8%+)', desc: 'Pre-leased commercial & co-working spaces' },
      { id: 'APPRECIATION', label: 'High Capital Growth', desc: 'Metro corridor pre-launches in high-demand hubs' },
      { id: 'COMMERCIAL_INVEST', label: 'Commercial Office Floors', desc: 'Fortune 500 tenanted spaces with 9-yr lock-in' },
      { id: 'FRACTIONAL_LUXURY', label: 'Trophy Villa Portfolios', desc: 'Bespoke holiday homes in Lonavala & Alibaug' },
    ],
  };

  // Locations Data for Pune / Maharashtra Luxury Corridors
  const luxuryLocations = [
    {
      id: 'wakad',
      name: 'Wakad',
      tagline: 'High-Altitude Tech Gateway',
      avgSqFtPrice: '₹9,800/sq.ft',
      yoyGrowth: '+14.2%',
      highlights: '8 mins to Hinjewadi Phase 1 • Cantilevered Sky Suites',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      activeListings: 42,
    },
    {
      id: 'baner',
      name: 'Baner & Baner Hill',
      tagline: 'Forest-Front Modernism & Dining',
      avgSqFtPrice: '₹12,400/sq.ft',
      yoyGrowth: '+16.8%',
      highlights: '6 mins to Balewadi High Street • Biodiversity Reserve views',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      activeListings: 28,
    },
    {
      id: 'hinjewadi',
      name: 'Hinjewadi Phase 1',
      tagline: 'Silicon Corridor & Pre-Leased Assets',
      avgSqFtPrice: '₹8,200/sq.ft',
      yoyGrowth: '+11.5%',
      highlights: 'Next to Infosys & Wipro • 8.4% Commercial Rental Yield',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      activeListings: 35,
    },
    {
      id: 'koregaon-park',
      name: 'Koregaon Park',
      tagline: 'Old-Money Heritage & Sky Penthouses',
      avgSqFtPrice: '₹18,500/sq.ft',
      yoyGrowth: '+18.4%',
      highlights: 'Leafy Lane 5 • Ritz-Carlton & Airport connectivity',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      activeListings: 14,
    },
  ];

  // Calculate quick EMI
  const loanPrincipal = calcBudgetCr * 10000000 * 0.8; // 80% loan
  const quickEmiResult = calculateEMI(loanPrincipal, calcInterestRate, calcTenureYrs);
  const quickTaxShield = calculateStatutoryTaxShield({
    loanPrincipal,
    annualInterestRatePercent: calcInterestRate,
    tenureYears: calcTenureYrs,
    taxBracketPercent: 30,
  });
  const netEffectiveEmi = Math.max(0, quickEmiResult.monthlyEMI - quickTaxShield.monthlyTaxShieldINR);

  // Filtered lists
  const kiaanPicks = projects.filter((p) => p.isKiaanPick || p.propertyScore.overallScore >= 95);
  const todaysOpportunities = projects.slice(0, 2);
  const firstLookProjects = projects.filter((p) => p.isFirstLook || p.status === 'UNDER_CONSTRUCTION');
  const investmentOpportunities = projects.filter((p) => p.projectType === 'COMMERCIAL' || p.propertyScore.breakdown.investmentYield >= 90);

  return (
    <div className="space-y-20 animate-fade-in">
      {/* ============================================================ */}
      {/* 1. DISCOVERY HERO: FIND A PLACE THAT FEELS LIKE YOURS        */}
      {/* ============================================================ */}
      <section
        id="hero-discovery-section"
        className={`relative rounded-3xl overflow-hidden border p-6 sm:p-12 lg:p-16 shadow-2xl transition-all duration-300 ${
          isDark
            ? 'border-amber-500/20 bg-gradient-to-b from-[#0F172A] via-[#090D17] to-[#070A0F]'
            : 'border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-xl'
        }`}
      >
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kiaan Spatial Real Estate Intelligence</span>
          </div>

          <h1
            className={`text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            FIND A PLACE THAT <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              FEELS LIKE YOURS.
            </span>
          </h1>

          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}
          >
            Ask in any language — text or voice. Kiaan AI converts natural human desires into verified MahaRERA architectural matches and millimeter-precise 3D twins.
          </p>

          {/* Primary AI Natural Language & Voice Search Bar */}
          <div className="pt-3 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all ${
                isListening
                  ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/10'
                  : isDark
                  ? 'bg-[#0B101B]/95 border-amber-500/30 focus-within:border-amber-400'
                  : 'bg-white border-slate-300 focus-within:border-amber-500 shadow-md'
              }`}
            >
              <Search className="w-5 h-5 text-amber-500 ml-3 flex-shrink-0" />
              <input
                type="text"
                id="search-main-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tell Kiaan what you're looking for..."
                className={`flex-1 bg-transparent px-2.5 py-2 text-sm focus:outline-none ${
                  isDark ? 'text-white placeholder-white/40' : 'text-slate-900 placeholder-slate-400'
                }`}
              />

              {/* Voice Input Mic Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-400'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                title={isListening ? 'Listening (Click to Stop)...' : 'Speak in Hindi, Marathi, English or Hinglish'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Search / AI Match Button */}
              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/25 cursor-pointer flex-shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {isListening && (
              <div className="mt-2 text-xs text-amber-400 animate-pulse font-medium">
                🎙️ Listening... Speak naturally in English, Hindi, Marathi or Hinglish...
              </div>
            )}

            {/* Multilingual Clickable Prompt Chips */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[11px] font-semibold opacity-60 mr-1">Try saying:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(p.text);
                    handleSearchSubmit();
                  }}
                  className={`px-3 py-1.5 rounded-full border text-[11px] transition-all cursor-pointer text-left ${
                    isDark
                      ? 'bg-white/[0.03] border-white/10 text-white/75 hover:border-amber-500/40 hover:text-amber-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-600 shadow-sm'
                  }`}
                >
                  <span className="font-semibold text-amber-500 mr-1">[{p.label}]:</span>
                  <span>"{p.text}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Modes Switcher (BUY | RENT / LEASE | INVEST) */}
          <div className="pt-6">
            <div
              className={`inline-flex p-1.5 rounded-2xl border backdrop-blur-xl shadow-lg ${
                isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {(['BUY', 'RENT_LEASE', 'INVEST'] as const).map((m) => (
                <button
                  key={m}
                  id={`mode-hero-btn-${m}`}
                  onClick={() => {
                    setCustomerMode(m);
                    setSelectedSubIntent('ALL');
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    customerMode === m
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25'
                      : isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {m === 'BUY' ? 'Buy Luxury' : m === 'RENT_LEASE' ? 'Rent / Lease' : 'Institutional Invest'}
                </button>
              ))}
            </div>

            {/* Mode-specific Sub-Intent Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              {modeSubIntents[customerMode].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubIntent(sub.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedSubIntent === sub.id
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 font-bold'
                      : isDark
                      ? 'bg-white/[0.03] border border-white/5 text-white/60 hover:text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. KIAAN PICKS (Human Curator + AI Spatial Intelligence)     */}
      {/* ============================================================ */}
      <section id="kiaan-picks-section">
        <KiaanPicksSection
          theme={theme}
          onSelectPick={(pick) => {
            const matchedProj = projects.find((p) => p.id === pick.targetId);
            if (matchedProj) {
              onOpenAssetExperience(matchedProj);
            } else {
              const matchedProp = properties.find((p) => p.id === pick.targetId);
              if (matchedProp && onOpenPropertyExperience) {
                onOpenPropertyExperience(matchedProp);
              }
            }
          }}
        />
      </section>

      {/* ============================================================ */}
      {/* 3. KIAAN FIRST LOOK™ (Early-Access VIP Tranches)             */}
      {/* ============================================================ */}
      <section id="kiaan-first-look-section" className="space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#0E1626] via-[#090D17] to-[#070A0F] text-white shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PREMIUM EARLY-ACCESS SUITE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold">Kiaan First Look™</h2>
              <p className="text-xs text-white/70">
                Off-market early-access inventory: Pre-launch developer tranches, newly released sky towers, private luxury resales, and high-street commercial spaces before public marketing.
              </p>
            </div>
            <div className="text-right text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping mr-2" />
              <span>VIP Priority Allocation Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
                      {proj.status === 'UNDER_CONSTRUCTION' ? 'PRE-LAUNCH' : 'FIRST LOOK'}
                    </span>
                    <span className="text-[11px] font-mono text-white/60">MahaRERA Verified</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-white">{proj.name}</h3>
                  <p className="text-xs text-white/70 line-clamp-2">{proj.overviewStory}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-amber-400 font-mono font-bold text-xs">
                    {proj.headlinePriceRange.displayString}
                  </span>
                  <button
                    onClick={() => onOpenAssetExperience(proj)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-[11px] hover:scale-105 transition-all cursor-pointer"
                  >
                    View Early Tranche
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. KIAAN OPPORTUNITY WALL™ (Dynamic Live Board)              */}
      {/* ============================================================ */}
      <section id="opportunity-wall-section">
        <OpportunityWallView
          theme={theme}
          onSelectOpportunity={(item) => {
            const matchedProj = projects.find((p) => p.id === item.targetId);
            if (matchedProj) {
              onOpenAssetExperience(matchedProj);
            } else {
              const matchedProp = properties.find((p) => p.id === item.targetId);
              if (matchedProp && onOpenPropertyExperience) {
                onOpenPropertyExperience(matchedProp);
              }
            }
          }}
        />
      </section>

      {/* ============================================================ */}
      {/* 4. EXPLORE PROJECTS (Architectural Developments)             */}
      {/* ============================================================ */}
      <section id="explore-projects-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Master Developments</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Explore Projects</h2>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Gated sky tower enclaves, master plans, construction milestone audits, and elevation stacks.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('search')}
            className="px-4 py-2 rounded-xl border border-current/15 text-xs font-semibold hover:bg-current/5 transition-all cursor-pointer"
          >
            Filter by Micro-Market
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelectProject={(p) => onOpenAssetExperience(p)}
              onOpenUnits={(p) => onOpenAssetExperience(p)}
              onScheduleVisit={(p) => onOpenScheduleVisit(p)}
              onOpenDigitalTwin={(p) => onOpenAssetExperience(p)}
            />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. EXPLORE PROPERTIES (Ready Resale / Trophy Penthouses)     */}
      {/* ============================================================ */}
      <section id="explore-properties-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Individual Trophy Assets</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Explore Properties</h2>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Verified standalone penthouses, bespoke triplex residences, and freehold luxury villas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
                isDark ? 'bg-[#0B101C] border-amber-500/20 hover:border-amber-500/50' : 'bg-white border-slate-200 shadow-lg'
              }`}
            >
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={prop.media[0]?.url || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=85'}
                  alt={prop.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-400 font-bold text-xs border border-amber-500/30">
                    {prop.configuration}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-black font-bold text-xs">
                    {prop.possessionDate}
                  </span>
                  {prop.propertyPersonality && (
                    <PropertyPersonalityBadge personality={prop.propertyPersonality} size="sm" showTooltip={true} />
                  )}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-white font-serif font-bold text-lg">
                  ₹{(prop.pricing.basePrice / 10000000).toFixed(2)} Cr
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-current">{prop.title}</h3>
                  <p className="text-xs opacity-70 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{prop.location.address}</span>
                  </p>
                </div>

                <p className="text-xs opacity-75 leading-relaxed">{prop.overviewDescription}</p>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-current/10 text-center text-xs font-mono">
                  <div>
                    <span className="opacity-50 block text-[10px] uppercase">Carpet</span>
                    <span className="font-bold text-current">{prop.carpetAreaSqFt} sq.ft</span>
                  </div>
                  <div>
                    <span className="opacity-50 block text-[10px] uppercase">Facing</span>
                    <span className="font-bold text-amber-500">{prop.facing.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block text-[10px] uppercase">Parking</span>
                    <span className="font-bold text-current">{prop.parkingCount} Covered</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onOpenPropertyExperience) {
                        onOpenPropertyExperience(prop);
                      } else {
                        const matched = projects.find((p) => p.id === prop.projectId);
                        if (matched) onOpenAssetExperience(matched);
                      }
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs tracking-wider cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    View Digital Experience
                  </button>
                  <button
                    onClick={() => onNavigateToTab('finance')}
                    className="px-4 py-3 rounded-xl border border-current/15 text-xs font-semibold hover:bg-current/5 cursor-pointer"
                  >
                    Calculate EMI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. EXPLORE LOCATIONS (Interactive Micro-Market Corridors)    */}
      {/* ============================================================ */}
      <section id="explore-locations-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Prime Micro-Markets</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Explore Locations</h2>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              High-growth tech corridors, prestigious tree-lined residential avenues, and connectivity metrics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {luxuryLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => onExecuteSearchQuery(loc.name, { microMarket: loc.name })}
              className={`rounded-3xl border overflow-hidden group cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-[#0B101C] border-white/10 hover:border-amber-500/60' : 'bg-white border-slate-200 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={loc.image}
                  alt={loc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-emerald-400 font-mono text-[10px] font-bold">
                  {loc.yoyGrowth} YoY
                </div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-lg font-serif font-bold text-white">{loc.name}</h3>
                  <span className="text-[11px] text-amber-400 font-mono">{loc.avgSqFtPrice}</span>
                </div>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <p className="opacity-75 line-clamp-2">{loc.highlights}</p>
                <div className="pt-2 flex items-center justify-between text-amber-500 font-semibold text-[11px]">
                  <span>{loc.activeListings} Active Residences</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. INVESTMENT OPPORTUNITIES (Pre-Leased & 8.4%+ Rental Yield) */}
      {/* ============================================================ */}
      <section id="investment-opportunities-section" className="space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#0E1626] via-[#090D17] to-[#070A0F] text-white shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>INSTITUTIONAL GRADE REAL ESTATE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">High-Yield Investment Assets</h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Grade A pre-leased IT parks, corporate tech headquarters, and premium rental residences yielding 8.4% - 10.2% gross returns with 9-year corporate lock-ins.
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('vip')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs tracking-wider cursor-pointer shadow-lg shadow-amber-500/25 flex-shrink-0"
            >
              Request Institutional Teaser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-mono text-amber-400">Pre-Leased Commercial</span>
              <h4 className="text-base font-serif font-bold text-white">TechPark Prime — Hinjewadi</h4>
              <p className="text-xs text-white/70">Tenanted by Fortune 500 Software Exporters. 9-year lease.</p>
              <div className="pt-2 flex items-center justify-between font-mono text-xs">
                <span className="text-emerald-400 font-bold">8.4% Net Yield</span>
                <span className="text-white/60">₹2.85 Cr</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-mono text-amber-400">Sky Penthouse Lease</span>
              <h4 className="text-base font-serif font-bold text-white">One Vertica Sky Suites</h4>
              <p className="text-xs text-white/70">Executive expatriate relocation demand. Fully managed.</p>
              <div className="pt-2 flex items-center justify-between font-mono text-xs">
                <span className="text-emerald-400 font-bold">₹1.25L / month</span>
                <span className="text-white/60">Ready 2027</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-mono text-amber-400">Section 54 Tax Shield</span>
              <h4 className="text-base font-serif font-bold text-white">Capital Gains Optimization</h4>
              <p className="text-xs text-white/70">Reinvest capital gains to legally shield up to ₹10 Cr tax liability.</p>
              <div className="pt-2 flex items-center justify-between font-mono text-xs">
                <span className="text-amber-400 font-bold">100% Statutory</span>
                <span className="text-white/60">CA Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. RENT / LEASE (Executive & Long-Term Leases)                */}
      {/* ============================================================ */}
      <section id="rent-lease-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Executive Relocation</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Rent & Lease Collection</h2>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Fully designer-furnished penthouses, diplomatic long leases, and commercial workspaces.
            </p>
          </div>
          <button
            onClick={() => {
              setCustomerMode('RENT_LEASE');
              onNavigateToTab('search');
            }}
            className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Lease Inventory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold">
                RESIDENTIAL LUXURY LEASE
              </span>
              <span className="font-mono text-xs font-bold text-emerald-500">Immediate Move-In</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-current">Koregaon Park 4 BHK Garden Duplex</h3>
            <p className="text-xs opacity-75">
              3,400 sq.ft Italian-marble furnished duplex with private plunge pool, 2 covered car parks, and 24/7 concierge.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-current/10">
              <div className="font-mono text-lg font-bold text-amber-500">₹1,85,000 <span className="text-xs opacity-70 font-normal">/ month</span></div>
              <button
                onClick={() => onNavigateToTab('vip')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer"
              >
                Schedule Viewing
              </button>
            </div>
          </div>

          <div
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                COMMERCIAL TECH SUITE
              </span>
              <span className="font-mono text-xs font-bold text-emerald-500">Plug & Play Ready</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-current">Kiaan TechPark Level 6 Office</h3>
            <p className="text-xs opacity-75">
              120-workstation turnkey office with 4 executive cabins, 2 boardrooms, high-speed fiber ring, and 100% DG backup.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-current/10">
              <div className="font-mono text-lg font-bold text-amber-500">₹3,40,000 <span className="text-xs opacity-70 font-normal">/ month</span></div>
              <button
                onClick={() => onNavigateToTab('vip')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer"
              >
                Schedule Viewing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FIRST LOOK (Pre-Launch & Confidential Off-Market)        */}
      {/* ============================================================ */}
      <section id="first-look-section" className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4 border-current/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>Confidential Preview Vault</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current">First Look</h2>
          </div>
          <button
            onClick={() => onNavigateToTab('vip')}
            className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            Unlock All Off-Market Vaults
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {firstLookProjects.map((proj) => (
            <div
              key={proj.id}
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between space-y-4 ${
                isDark ? 'bg-[#0B101C] border-amber-500/20' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-500 font-mono tracking-wider">
                  PRE-LAUNCH ALLOCATION
                </span>
                <span className="text-xs opacity-60">MahaRERA: {proj.reraRecord?.registrationNumber}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-current">{proj.name}</h3>
              <p className="text-xs opacity-75">{proj.overviewStory}</p>
              <div className="flex items-center justify-between pt-2 border-t border-current/10">
                <div className="text-xs">
                  <span className="opacity-60 block">Indicative Pricing</span>
                  <span className="font-bold text-amber-500 font-mono">{proj.headlinePriceRange.displayString}</span>
                </div>
                <button
                  onClick={() => onOpenAssetExperience(proj)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer"
                >
                  Inspect Digital Twin
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. QUICK CALCULATORS (Embedded Statutory Intelligence)       */}
      {/* ============================================================ */}
      <section id="calculators-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Financial Suite</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Instant EMI & Tax Shield Calculator</h2>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Calculate real monthly outflow accounting for Sections 80C and 24(b) statutory tax shields.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('finance')}
            className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 cursor-pointer"
          >
            Launch Full Financial Suite
          </button>
        </div>

        <div
          className={`p-6 sm:p-10 rounded-3xl border grid grid-cols-1 lg:grid-cols-12 gap-8 ${
            isDark ? 'bg-[#0A0E1A] border-amber-500/25 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Property Target Value</span>
                <span className="font-bold text-amber-500 font-mono">₹{calcBudgetCr.toFixed(2)} Crores</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="8.0"
                step="0.1"
                value={calcBudgetCr}
                onChange={(e) => setCalcBudgetCr(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Loan Tenure</span>
                <span className="font-bold text-amber-500 font-mono">{calcTenureYrs} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={calcTenureYrs}
                onChange={(e) => setCalcTenureYrs(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Bank Benchmark Interest Rate</span>
                <span className="font-bold text-amber-500 font-mono">{calcInterestRate.toFixed(2)}% p.a.</span>
              </div>
              <input
                type="range"
                min="7.5"
                max="11.0"
                step="0.05"
                value={calcInterestRate}
                onChange={(e) => setCalcInterestRate(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-current/5 border border-current/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-70">Gross Monthly EMI (80% LTV)</span>
                <span className="font-mono font-bold text-current">₹{quickEmiResult.monthlyEMI.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-500">
                <span>Statutory Monthly Tax Shield (Sec 80C + 24b)</span>
                <span className="font-mono font-bold">- ₹{quickTaxShield.monthlyTaxShieldINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-current/15"></div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-500 block">Net Effective Monthly Outflow</span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-current font-mono">
                    ₹{netEffectiveEmi.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right text-[11px] opacity-70">
                  <div>Annual Tax Saved</div>
                  <div className="text-emerald-500 font-bold font-mono">₹{quickTaxShield.totalAnnualTaxSavedINR.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('finance')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs tracking-wider cursor-pointer shadow-md shadow-amber-500/20"
            >
              Analyze Complete Tax & Downpayment Matrix
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. REAL ESTATE INSIGHTS / EDUCATION                         */}
      {/* ============================================================ */}
      <section id="insights-education-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Regulatory Advisory</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Real Estate Insights & Buyer Safeguards</h2>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Learn how statutory escrow accounts, title search certificates, and solar simulations protect your capital.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-current">MahaRERA 70% Escrow Rule</h3>
            <p className="text-xs opacity-75 leading-relaxed">
              Every customer rupee is deposited into a dedicated bank escrow under Section 4(2)(l)(D). Funds can only be withdrawn proportionally to certified construction progress.
            </p>
          </div>

          <div
            className={`p-6 rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-current">30-Year Title Search Verification</h3>
            <p className="text-xs opacity-75 leading-relaxed">
              Every listed project includes independent advocate title opinions confirming 100% clear freehold ownership without litigation or revenue encumbrances.
            </p>
          </div>

          <div
            className={`p-6 rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Maximize2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-current">Millimeter Spatial Ray Tracing</h3>
            <p className="text-xs opacity-75 leading-relaxed">
              Simulate actual morning and evening sunlight penetration in every room before booking. Verify true Vaastu cardinal alignment without visiting in person.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. TRUST CENTER & AUDIT LOGS (Items 116 & 117)             */}
      {/* ============================================================ */}
      <section id="trust-center-section">
        <TrustCenterSection
          theme={theme}
          projectOrPropertyName="Kiaan Master Portfolio"
          onViewReraDossier={() => onNavigateToTab('search')}
          onRequestAdvocateReport={() => onNavigateToTab('vip')}
        />
      </section>

      {/* ============================================================ */}
      {/* 12. AUDITED CUSTOMER REVIEWS (Item 118)                     */}
      {/* ============================================================ */}
      <section id="customer-reviews-section">
        <CustomerReviewsSection theme={theme} />
      </section>

      {/* ============================================================ */}
      {/* 13. GROUNDED FAQ & AI COMPLIANCE ENGINE (Item 119)          */}
      {/* ============================================================ */}
      <section id="grounded-faq-section">
        <GroundedFaqEngine
          theme={theme}
          projectOrPropertyName="Kiaan Verified Developments"
        />
      </section>

      {/* ============================================================ */}
      {/* 14. WHY KIAAN (The 4 Pillars of Absolute Trust)              */}
      {/* ============================================================ */}
      <section id="why-kiaan-section" className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Why Discerning Buyers Choose Us</span>
          <h2 className="text-3xl font-serif font-bold text-current">The Kiaan Standard of Trust</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={`p-6 rounded-3xl border space-y-3 transition-all ${
              isDark ? 'bg-[#0B101B]/90 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-current">100% MahaRERA Audited</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Every residence is verified against official government records with statutory title search opinions.
            </p>
          </div>

          <div
            className={`p-6 rounded-3xl border space-y-3 transition-all ${
              isDark ? 'bg-[#0B101B]/90 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <BadgePercent className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-current">Zero Brokerage</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Transparent, direct-to-developer or owner pricing with no hidden advisory charges or commissions.
            </p>
          </div>

          <div
            className={`p-6 rounded-3xl border space-y-3 transition-all ${
              isDark ? 'bg-[#0B101B]/90 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-current">True 3D Twins</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Millimeter-precision floor plans, dawn-to-dusk solar ray tracing, and 32-floor elevation stackers.
            </p>
          </div>

          <div
            className={`p-6 rounded-3xl border space-y-3 transition-all ${
              isDark ? 'bg-[#0B101B]/90 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-current">Maybach VIP Concierge</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Chauffeured Mercedes-Maybach private site visits, 15-minute concurrency holding tokens, and bespoke contracts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
