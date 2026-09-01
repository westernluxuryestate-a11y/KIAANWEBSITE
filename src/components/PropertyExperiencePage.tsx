/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, Unit } from '../types';
import {
  Building,
  MapPin,
  Maximize2,
  Calendar,
  Compass,
  Award,
  ShieldCheck,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Share2,
  ChevronRight,
  Eye,
  Lock,
  ArrowRight,
  Car,
  CheckCircle2,
  Sliders,
  Sun,
  Video,
  Download,
  BookOpen,
  PieChart,
  Layers,
  Check,
} from 'lucide-react';
import { formatINR, calculateHomeLoanEMI, calculateStatutoryTaxShield } from '../services/calculatorEngine';
import { ReraBadge } from './ReraBadge';
import { MakeOfferModal } from './MakeOfferModal';
import { ShareAssetModal } from './ShareAssetModal';

interface PropertyExperiencePageProps {
  property: Property;
  theme?: 'dark' | 'light';
  onBackToDiscovery: () => void;
  onOpenComparison?: () => void;
}

export const PropertyExperiencePage: React.FC<PropertyExperiencePageProps> = ({
  property,
  theme = 'dark',
  onBackToDiscovery,
  onOpenComparison,
}) => {
  const isDark = theme === 'dark';

  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saved, setSaved] = useState(false);

  // Financial calculations
  const propertyPrice = property.pricing?.totalEstimatedAcquisitionCost || property.pricing?.basePrice || 18500000;
  const loanPrincipal = propertyPrice * 0.8;
  const emiObj = calculateHomeLoanEMI(loanPrincipal, 8.5, 20);
  const monthlyEmi = emiObj.monthlyEMI;
  const taxShield = calculateStatutoryTaxShield({
    loanPrincipal,
    annualInterestRatePercent: 8.5,
    tenureYears: 20,
    taxBracketPercent: 30,
  });
  const netMonthlyEmi = monthlyEmi - taxShield.monthlyTaxShieldINR;

  const canonicalUrl = `https://kiaanproperties.com/properties/${property.slug || property.id}`;

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-[#070A0F] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* 1. TOP PERMANENT URL & SEO BAR */}
      <div className={`border-b text-xs py-2 px-4 sm:px-8 flex items-center justify-between ${isDark ? 'bg-[#05070B] border-white/10 text-white/50' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
        <div className="flex items-center gap-2 font-mono truncate">
          <span className="text-amber-500 font-bold">CANONICAL:</span>
          <span className="truncate">/properties/{property.slug || `${property.title.toLowerCase().replace(/\s+/g, '-')}-${property.location.microMarket.toLowerCase()}`}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold uppercase">{property.status}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(canonicalUrl);
              alert('Canonical Property URL copied to clipboard!');
            }}
            className="text-amber-500 font-bold hover:underline cursor-pointer"
          >
            Copy URL
          </button>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header
        className={`sticky top-20 z-40 backdrop-blur-2xl border-b transition-all ${
          isDark ? 'bg-[#070A0F]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDiscovery}
              className={`p-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              <span>←</span>
              <span className="hidden sm:inline">Discovery</span>
            </button>
            <div className="truncate">
              <h1 className="font-serif font-bold text-base sm:text-lg truncate">{property.title}</h1>
              <p className={`text-[11px] truncate ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {property.location.microMarket}, {property.location.city} • {property.configuration} • {formatINR(propertyPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                saved
                  ? 'bg-red-500/20 border-red-500/30 text-red-400 font-bold'
                  : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-100'
              }`}
            >
              <span>{saved ? '❤️ Saved' : '🤍 Save'}</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN EXPERIENCE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* HERO & IDENTITY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-current/10 aspect-[16/9] bg-black group shadow-2xl">
              <img
                src={property.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85'}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg">
                  {property.propertyType}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-xs border border-white/20">
                  {property.possessionStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  Verified Resale & Direct Residence
                </span>
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
                  <img src={m.url} alt={m.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Key Metrics Card */}
          <div className={`lg:col-span-4 rounded-3xl border p-6 sm:p-8 space-y-6 ${isDark ? 'bg-[#0B101B] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-amber-500">Transparent Valuation</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-current font-mono">
                {formatINR(propertyPrice)}
              </div>
              <p className="text-xs opacity-60">Complete All-Inclusive Outlay</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Configuration</span>
                <span className="text-sm font-bold text-current mt-0.5 block">{property.configuration}</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Carpet Area</span>
                <span className="text-sm font-mono font-bold text-current mt-0.5 block">{property.carpetAreaSqFt} sq.ft</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Floor Rise</span>
                <span className="text-sm font-bold text-current mt-0.5 block">Level {property.floorNumber || 8} of {property.totalFloors || 24}</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Orientation</span>
                <span className="text-sm font-bold text-amber-500 mt-0.5 block">{property.facing}</span>
              </div>
            </div>

            {/* Tax Shielded Monthly EMI */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Net Effective EMI</span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">Sec 80C + 24(b)</span>
              </div>
              <div className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatINR(netMonthlyEmi)} / mo
              </div>
              <p className="text-[10px] opacity-75 mt-1">Saves {formatINR(taxShield.monthlyTaxShieldINR)}/mo in income tax.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowMakeOffer(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
              >
                <DollarSign className="w-4 h-4" />
                <span>Submit Verified Offer</span>
              </button>
            </div>
          </div>
        </section>

        {/* OVERVIEW & AI ANALYSIS */}
        <section className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>KIAAN AI PROPERTY ANALYSIS & VALUATION MATRIX</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-current">Property Overview & Structural Intelligence</h3>
          <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-4xl">
            {property.overviewDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className="opacity-60 block">Spatial Efficiency</span>
              <span className="text-base font-bold text-amber-500 mt-1 block">94% Zero-Corridor Layout</span>
            </div>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className="opacity-60 block">Natural Daylight</span>
              <span className="text-base font-bold text-emerald-500 mt-1 block">8.2 Hours Direct Light</span>
            </div>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className="opacity-60 block">MahaRERA Status</span>
              <span className="text-base font-bold text-current mt-1 block">{property.reraRecord?.registrationNumber || 'Direct Title Clear'}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div className={`max-w-4xl mx-auto rounded-3xl border p-3 sm:p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-4 ${isDark ? 'bg-[#0B101B]/95 border-amber-500/30 text-white' : 'bg-white/95 border-slate-300 text-slate-900'}`}>
          <div className="truncate">
            <h4 className="font-serif font-bold text-sm truncate">{property.title}</h4>
            <span className="text-xs text-amber-500 font-mono font-bold">{formatINR(propertyPrice)}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowMakeOffer(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/25"
            >
              Make Offer
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
    </div>
  );
};
