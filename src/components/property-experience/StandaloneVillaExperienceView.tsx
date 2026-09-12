/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, UserSession } from '../../types';
import {
  Home,
  Trees,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  DollarSign,
  Calendar,
  Compass,
  Sparkles,
  Share2,
  Edit3,
  Trash2,
  UserCheck,
  Key,
  FileText,
  ArrowRight,
  Sun,
  Droplets,
  Zap,
  Ruler,
  Shield,
  Layers,
  Award,
  Clock,
  Download,
  Check,
  Eye,
  Sliders,
  Maximize2,
  Car,
} from 'lucide-react';
import { formatINR, calculateHomeLoanEMI, calculateStatutoryTaxShield } from '../../services/calculatorEngine';
import { SeoImage } from '../SeoImage';
import { ReraBadge } from '../ReraBadge';
import { MakeOfferModal } from '../MakeOfferModal';
import { ShareAssetModal } from '../ShareAssetModal';
import { SiteVisitModal } from '../SiteVisitModal';
import { PropertyProjectEditorModal } from '../PropertyProjectEditorModal';
import { globalKiaanStore } from '../../services/store';

interface StandaloneVillaExperienceViewProps {
  property: Property;
  session?: UserSession | null;
  theme?: 'dark' | 'light';
  onBackToDiscovery: () => void;
  onOpenComparison?: () => void;
  onPropertyUpdated?: (prop: Property) => void;
}

export const StandaloneVillaExperienceView: React.FC<StandaloneVillaExperienceViewProps> = ({
  property: initialProperty,
  session,
  theme = 'dark',
  onBackToDiscovery,
  onOpenComparison,
  onPropertyUpdated,
}) => {
  const isDark = theme === 'dark';
  const [property, setProperty] = useState<Property>(initialProperty);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'ESTATE_OVERVIEW' | 'GROUNDS_SPECS' | 'LEGAL_TITLE' | 'UTILITIES'>('ESTATE_OVERVIEW');

  const canModify = globalKiaanStore.canUserModifyProperty(property, session);
  const isCreator = property.createdBy?.email?.toLowerCase() === (session?.email || '').toLowerCase();

  const handleDeleteProperty = () => {
    if (!canModify) {
      alert('Access Denied: Only the creator or Super Admin can delete this property.');
      return;
    }
    const confirmDel = window.confirm(`Are you sure you want to delete villa "${property.title}"?`);
    if (!confirmDel) return;

    const res = globalKiaanStore.deleteProperty(property.id, session || undefined);
    if (res.success) {
      alert(`Property "${property.title}" has been deleted.`);
      onBackToDiscovery();
    } else {
      alert(res.message);
    }
  };

  // Financial calculations
  const propertyPrice = property.pricing?.totalEstimatedAcquisitionCost || property.pricing?.basePrice || 45000000;
  const loanPrincipal = propertyPrice * 0.75;
  const emiObj = calculateHomeLoanEMI(loanPrincipal, 8.5, 20);
  const monthlyEmi = emiObj.monthlyEMI;
  const taxShield = calculateStatutoryTaxShield({
    loanPrincipal,
    annualInterestRatePercent: 8.5,
    tenureYears: 20,
    taxBracketPercent: 30,
  });
  const netMonthlyEmi = monthlyEmi - taxShield.monthlyTaxShieldINR;

  const plotArea = property.plotSpecs?.areaSqFt || Math.round(property.carpetAreaSqFt * 1.35) || 4500;
  const plotDimensions = property.plotSpecs?.dimensions || '50 ft × 90 ft';
  const roadWidth = property.plotSpecs?.roadWidthFt || 40;
  const ageYears = property.ageOfPropertyYears || 2;

  const canonicalUrl = `https://kiaanproperties.com/villas/${property.slug || property.id}`;

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-[#06080D] text-white' : 'bg-[#FBFBFA] text-slate-900'}`}>
      {/* 1. TOP STATUTORY & CANONICAL BAR */}
      <div className={`border-b text-xs py-2.5 px-4 sm:px-8 flex items-center justify-between ${
        isDark ? 'bg-[#090D15] border-amber-500/15 text-white/60' : 'bg-stone-100 border-stone-200 text-stone-600'
      }`}>
        <div className="flex items-center gap-2 font-mono truncate">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold uppercase text-[10px] tracking-wider">
            STANDALONE FREEHOLD VILLA
          </span>
          <span className="truncate hidden sm:inline">/villas/{property.slug || property.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>30-Year Title Search Clear</span>
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(canonicalUrl);
              alert('Bespoke Villa URL copied to clipboard!');
            }}
            className="text-amber-500 font-bold hover:underline cursor-pointer text-xs"
          >
            Copy URL
          </button>
        </div>
      </div>

      {/* 2. STICKY VILLA HEADER */}
      <header
        className={`sticky top-20 z-40 backdrop-blur-2xl border-b transition-all ${
          isDark ? 'bg-[#06080D]/90 border-amber-500/20 shadow-2xl' : 'bg-white/95 border-stone-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDiscovery}
              className={`p-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  : 'border-stone-200 bg-stone-100 text-stone-700 hover:text-stone-950 hover:bg-stone-200'
              }`}
            >
              <span>←</span>
              <span className="hidden sm:inline">Back to Discovery</span>
            </button>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg truncate">{property.title}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  Private Estate
                </span>
              </div>
              <p className={`text-[11px] truncate ${isDark ? 'text-white/50' : 'text-stone-500'}`}>
                {property.location.microMarket}, {property.location.city} • {plotArea} sq.ft Plot • {property.configuration} • {formatINR(propertyPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canModify && (
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modify Villa</span>
                </button>
                <button
                  onClick={handleDeleteProperty}
                  className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setShowVisitModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Private Walkthrough</span>
            </button>

            <button
              onClick={() => setSaved(!saved)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                saved
                  ? 'bg-red-500/20 border-red-500/30 text-red-400 font-bold'
                  : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-stone-200 bg-white hover:bg-stone-100'
              }`}
            >
              <span>{saved ? '❤️ Saved' : '🤍 Save'}</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-stone-200 bg-white hover:bg-stone-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* AUTHOR & CREATOR OWNERSHIP BANNER */}
      {property.createdBy && (
        <div className={`px-4 sm:px-8 py-2 border-b text-xs flex items-center justify-between ${
          isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Direct Listing: <strong>{isCreator ? 'You (Verified Owner / Sole Representative)' : property.createdBy.name || property.createdBy.email}</strong>
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            Direct Key Handover Ready
          </span>
        </div>
      )}

      {/* 3. MAIN EXPERIENCE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* HERO & VILLA IDENTITY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 aspect-[16/9] bg-black group shadow-2xl">
              <SeoImage
                src={property.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85'}
                alt={property.title}
                context={{
                  entityType: 'PROPERTY',
                  entityTitle: property.title,
                  locality: property.location.microMarket || 'Pune',
                  city: property.location.city || 'Pune',
                  configuration: property.configuration,
                  carpetAreaSqFt: property.carpetAreaSqFt,
                  mediaCategory: 'EXTERIOR',
                }}
                priority={true}
                showSeoBadge={true}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

              {/* Badges Overlay */}
              <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  <span>Freehold Villa</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 font-mono text-xs border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Independent Land Title</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 font-mono text-xs border border-white/20">
                  Built {ageYears} Yrs Ago
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-amber-400">
                  <Trees className="w-4 h-4" />
                  <span>Standalone Residential Estate • Zero Society Restrictions</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">{property.title}</h1>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{property.location.address}</span>
                </p>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 gap-3">
              {property.media?.slice(0, 3).map((m, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-current/10">
                  <SeoImage
                    src={m.url}
                    alt={m.title || `${property.title} Image ${idx + 1}`}
                    context={{
                      entityType: 'PROPERTY',
                      entityTitle: property.title,
                      locality: property.location.microMarket || 'Pune',
                      city: property.location.city || 'Pune',
                      configuration: property.configuration,
                      mediaCategory: m.category || 'EXTERIOR',
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                    {idx === 0 ? 'Private Lawns' : idx === 1 ? 'Interior Salon' : 'Rooftop Deck'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Standalone Grounds Metrics Card */}
          <div className={`lg:col-span-4 rounded-3xl border p-6 sm:p-8 space-y-6 ${
            isDark ? 'bg-[#0A0E18] border-amber-500/25 shadow-2xl' : 'bg-white border-stone-200 shadow-xl'
          }`}>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-amber-500 tracking-wider">Direct Freehold Valuation</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-current font-mono">
                {formatINR(propertyPrice)}
              </div>
              <p className="text-xs opacity-60">Inclusive of 100% Freehold Land + Superstructure</p>
            </div>

            {/* Standalone Villa Core Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Plot Envelope</span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 block font-mono">{plotArea} sq.ft</span>
                <span className="text-[10px] opacity-60">{plotDimensions}</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Built-Up Living</span>
                <span className="text-sm font-bold text-current mt-0.5 block font-mono">{property.carpetAreaSqFt} sq.ft</span>
                <span className="text-[10px] opacity-60">{property.configuration}</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Private Parking</span>
                <span className="text-sm font-bold text-current mt-0.5 block">{property.parkingCount || 3} Cars Gated</span>
                <span className="text-[10px] opacity-60">Covered Car Porch</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Access Road</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block font-mono">{roadWidth} ft Wide</span>
                <span className="text-[10px] opacity-60">Direct Municipal Frontage</span>
              </div>
            </div>

            {/* Key Handover & Possession Status */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-amber-500/10 border-amber-500/25' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase text-[10px]">Possession Status</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">READY TO OCCUPY</span>
              </div>
              <div className="text-sm font-bold text-current mt-1">Immediate Key Handover</div>
              <p className="text-[10px] opacity-75 mt-1">Existing owner vacating upon token execution. Zero renovation downtime.</p>
            </div>

            {/* Tax Shielded Monthly EMI */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Net Effective EMI</span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">Sec 80C + 24(b)</span>
              </div>
              <div className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatINR(netMonthlyEmi)} / mo
              </div>
              <p className="text-[10px] opacity-75 mt-1">Saves {formatINR(taxShield.monthlyTaxShieldINR)}/mo through statutory deductions.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowMakeOffer(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-transform"
              >
                <DollarSign className="w-4 h-4" />
                <span>Submit Verified Villa Offer</span>
              </button>
              <button
                onClick={() => setShowVisitModal(true)}
                className={`w-full py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-stone-300 hover:bg-stone-100 text-stone-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Schedule Private Physical Walkthrough</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. VILLA SPECIALIZED NAVIGATION TABS */}
        <div className="border-b border-current/10">
          <div className="flex space-x-6 overflow-x-auto pb-3">
            {[
              { id: 'ESTATE_OVERVIEW', label: 'Estate Overview & Architecture', icon: Sparkles },
              { id: 'GROUNDS_SPECS', label: 'Private Grounds & Specifications', icon: Trees },
              { id: 'LEGAL_TITLE', label: '30-Year Title & Legal Dossier', icon: ShieldCheck },
              { id: 'UTILITIES', label: 'Independent Utilities & Energy', icon: Sun },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 text-xs font-bold py-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT 1: ESTATE OVERVIEW & ARCHITECTURE */}
        {activeTab === 'ESTATE_OVERVIEW' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0A0E18] border-white/10' : 'bg-white border-stone-200 shadow-md'}`}>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>ARCHITECTURAL ESTATE DOSSIER</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-current">Estate Overview & Living Experience</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-4xl">
                {property.overviewDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Master Bedroom Orientation</span>
                  <span className="text-base font-bold text-amber-500 mt-1 block">East / North-East Vastu Compliant</span>
                  <span className="text-[10px] opacity-70">Overlooking private rear landscaped gardens</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Ceiling Height</span>
                  <span className="text-base font-bold text-emerald-500 mt-1 block">12.5 ft Double-Height Volume</span>
                  <span className="text-[10px] opacity-70">Expansive natural ventilation and illumination</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Servant Accommodations</span>
                  <span className="text-base font-bold text-current mt-1 block">Independent 1 Room + Bath</span>
                  <span className="text-[10px] opacity-70">Dedicated external security service entrance</span>
                </div>
              </div>
            </div>

            {/* Custom Luxury Fixture Inventory */}
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0A0E18] border-white/10' : 'bg-white border-stone-200 shadow-md'}`}>
              <h4 className="font-serif font-bold text-lg text-current">Interior Fixtures & Turnkey Inclusions</h4>
              <p className="text-xs opacity-70">Actual verified physical fittings included in the acquisition:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
                {[
                  'Imported Italian Statuario Marble in living and dining halls',
                  'German Hacker designer modular kitchen with quartz island',
                  'Built-in Miele ovens, induction hob & dishwashers',
                  'Daikin VRV/VRF central heat pump climate control',
                  'Private elevator serving ground, first, and rooftop terrace',
                  'Private swimming pool with automated glass-media filtration',
                  'Teakwood doors and Burma teak window frames throughout',
                  'Bespoke walk-in wardrobe cabinetry in all suites',
                  'Kohler Artist Editions / Toto Neorest smart toilets',
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: PRIVATE GROUNDS & ENVELOPE */}
        {activeTab === 'GROUNDS_SPECS' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0A0E18] border-white/10' : 'bg-white border-stone-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Grounds & Boundaries</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Plot Envelope & Demarcation Architecture</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <Ruler className="w-4 h-4" />
                  <span>Cadastral Dimensions & Setbacks</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Total Freehold Plot Area</span>
                    <span className="font-mono font-bold">{plotArea} sq.ft</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Plot Dimensions</span>
                    <span className="font-mono font-bold">{plotDimensions}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Front Setback (Private Driveway)</span>
                    <span className="font-mono font-bold">20 ft with landscaped porch</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Rear Setback (Private Courtyard)</span>
                    <span className="font-mono font-bold">25 ft private lawn & plunge pool</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Side Clearances</span>
                    <span className="font-mono font-bold">10 ft left / 10 ft right</span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <Shield className="w-4 h-4" />
                  <span>Compound Wall & Perimeter Security</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Compound Wall Construction</span>
                    <span className="font-bold">8 ft Reinforced Masonry with Stone Coping</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Access Gate</span>
                    <span className="font-bold">Motorized Remote-Controlled Sliding Gate</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Electronic Surveillance</span>
                    <span className="font-bold">8-Channel 4K CCTV with IP Night Vision</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Perimeter Intrusion Alarm</span>
                    <span className="font-bold">Infrared Beam Sensors Installed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: LEGAL TITLE & 30-YEAR AUDIT */}
        {activeTab === 'LEGAL_TITLE' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0A0E18] border-white/10' : 'bg-white border-stone-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Statutory Title Verification</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">30-Year Chain of Title & Encumbrance Clearance</h3>
              <p className="text-xs opacity-75">
                Every document in the chain of ownership has been physically audited by senior property advocates with certified search reports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Clear 30-Year Search</span>
                <p className="text-[11px] opacity-75">Non-encumbrance certificate (NEC) issued with zero pending litigation or charges.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Collector NA Sanction</span>
                <p className="text-[11px] opacity-75">Class-1 Non-Agricultural residential order fully stamped and registered.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Tax Receipts Zero-Dues</span>
                <p className="text-[11px] opacity-75">Municipal corporation / local authority property taxes paid up to current financial quarter.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Sanctioned Building Plan</span>
                <p className="text-[11px] opacity-75">Commencement certificate and completion certificate on record with zero deviations.</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-xs block">Certified 30-Year Advocate Title Certificate</span>
                  <span className="text-[11px] opacity-60">Complete 28-page legal dossier with indexed deed history</span>
                </div>
              </div>
              <button
                onClick={() => alert('Advocate Title Search Report is available for download after identity verification.')}
                className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Request Legal Dossier</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: UTILITIES & ENERGY INDEPENDENCE */}
        {activeTab === 'UTILITIES' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0A0E18] border-white/10' : 'bg-white border-stone-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Self-Sufficient Infrastructure</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Independent Water, Energy, and Power Redundancy</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
                  <Sun className="w-4 h-4" />
                  <span>Solar Rooftop Generation</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">8.0 kWp</div>
                <p className="opacity-75">
                  On-grid solar plant with net metering contract. Generates ~1,050 units/month, rendering net electricity expense near zero.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
                  <Droplets className="w-4 h-4" />
                  <span>Dual Water Reliability</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">24,000 L</div>
                <p className="opacity-75">
                  Municipal water line + 280-ft deep private borewell with dual underground RCC sump & automated pressure-booster pumps.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                  <Zap className="w-4 h-4" />
                  <span>Power Backup System</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">15 kVA</div>
                <p className="opacity-75">
                  Soundproof acoustic-enclosure diesel generator with automatic mains failure (AMF) panel. 100% load coverage within 8 seconds.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div className={`max-w-4xl mx-auto rounded-3xl border p-3 sm:p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-4 ${
          isDark ? 'bg-[#0A0E18]/95 border-amber-500/30 text-white' : 'bg-white/95 border-stone-300 text-stone-900'
        }`}>
          <div className="truncate">
            <h4 className="font-serif font-bold text-sm truncate">{property.title}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-500 font-mono font-bold">{formatINR(propertyPrice)}</span>
              <span className="text-[10px] opacity-60">• Freehold {plotArea} sq.ft Plot</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowVisitModal(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Book Walkthrough</span>
            </button>
            <button
              onClick={() => setShowMakeOffer(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/25 hover:scale-105 transition-transform"
            >
              Make Direct Offer
            </button>
          </div>
        </div>
      </div>

      {showMakeOffer && (
        <MakeOfferModal
          assetId={property.id}
          assetTitle={property.title}
          askingPrice={propertyPrice}
          theme={theme}
          onClose={() => setShowMakeOffer(false)}
        />
      )}

      {showVisitModal && (
        <SiteVisitModal
          project={{
            id: property.id,
            name: property.title,
            location: property.location,
          } as any}
          theme={theme}
          onClose={() => setShowVisitModal(false)}
        />
      )}

      {showShareModal && (
        <ShareAssetModal
          assetId={property.id}
          assetTitle={property.title}
          location={`${property.location.microMarket}, ${property.location.city}`}
          priceDisplay={formatINR(propertyPrice)}
          theme={theme}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showEditor && (
        <PropertyProjectEditorModal
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          mode="EDIT_PROPERTY"
          initialProperty={property}
          session={session}
          theme={theme}
          onSuccess={(updatedProp) => {
            if (updatedProp) {
              setProperty(updatedProp);
              if (onPropertyUpdated) onPropertyUpdated(updatedProp);
            }
          }}
        />
      )}
    </div>
  );
};
