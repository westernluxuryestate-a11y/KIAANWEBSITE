/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, UserSession } from '../../types';
import {
  Building2,
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
  Clock,
  Layers,
  Award,
  Eye,
  Download,
  Car,
  Wind,
  Sun,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { formatINR, calculateHomeLoanEMI, calculateStatutoryTaxShield } from '../../services/calculatorEngine';
import { SeoImage } from '../SeoImage';
import { MakeOfferModal } from '../MakeOfferModal';
import { ShareAssetModal } from '../ShareAssetModal';
import { SiteVisitModal } from '../SiteVisitModal';
import { PropertyProjectEditorModal } from '../PropertyProjectEditorModal';
import { globalKiaanStore } from '../../services/store';

interface ResaleApartmentExperienceViewProps {
  property: Property;
  session?: UserSession | null;
  theme?: 'dark' | 'light';
  onBackToDiscovery: () => void;
  onOpenComparison?: () => void;
  onPropertyUpdated?: (prop: Property) => void;
}

export const ResaleApartmentExperienceView: React.FC<ResaleApartmentExperienceViewProps> = ({
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
  const [activeTab, setActiveTab] = useState<'UNIT_PROFILE' | 'SOCIETY_HEALTH' | 'RESALE_LEGAL' | 'INTERIORS'>('UNIT_PROFILE');

  const canModify = globalKiaanStore.canUserModifyProperty(property, session);
  const isCreator = property.createdBy?.email?.toLowerCase() === (session?.email || '').toLowerCase();

  const handleDeleteProperty = () => {
    if (!canModify) {
      alert('Access Denied: Only the creator or Super Admin can delete this property.');
      return;
    }
    const confirmDel = window.confirm(`Are you sure you want to delete apartment "${property.title}"?`);
    if (!confirmDel) return;

    const res = globalKiaanStore.deleteProperty(property.id, session || undefined);
    if (res.success) {
      alert(`Apartment "${property.title}" has been deleted.`);
      onBackToDiscovery();
    } else {
      alert(res.message);
    }
  };

  const propertyPrice = property.pricing?.totalEstimatedAcquisitionCost || property.pricing?.basePrice || 32500000;
  const loanPrincipal = propertyPrice * 0.8;
  const emiObj = calculateHomeLoanEMI(loanPrincipal, 8.45, 20);
  const monthlyEmi = emiObj.monthlyEMI;
  const taxShield = calculateStatutoryTaxShield({
    loanPrincipal,
    annualInterestRatePercent: 8.45,
    tenureYears: 20,
    taxBracketPercent: 30,
  });
  const netMonthlyEmi = monthlyEmi - taxShield.monthlyTaxShieldINR;

  const floorNumber = property.floorNumber || 18;
  const totalFloors = property.totalFloors || 30;
  const parkingCount = property.parkingCount || 2;
  const canonicalUrl = `https://kiaanproperties.com/resale/${property.slug || property.id}`;

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-[#070A12] text-white' : 'bg-[#F9FAFB] text-slate-900'}`}>
      {/* 1. TOP STATUTORY & RESALE BADGE */}
      <div className={`border-b text-xs py-2.5 px-4 sm:px-8 flex items-center justify-between ${
        isDark ? 'bg-[#0C101C] border-blue-500/15 text-white/60' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-2 font-mono truncate">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold uppercase text-[10px] tracking-wider">
            RESALE RESIDENCE • READY WITH OC
          </span>
          <span className="truncate hidden sm:inline">Tower Level {floorNumber} of {totalFloors}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Society NOC Ready • Zero Bank Encumbrance</span>
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(canonicalUrl);
              alert('Apartment URL copied to clipboard!');
            }}
            className="text-amber-500 font-bold hover:underline cursor-pointer text-xs"
          >
            Copy URL
          </button>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header
        className={`sticky top-20 z-40 backdrop-blur-2xl border-b transition-all ${
          isDark ? 'bg-[#070A12]/90 border-blue-500/20 shadow-2xl' : 'bg-white/95 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
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
              <span className="hidden sm:inline">Back to Discovery</span>
            </button>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg truncate">{property.title}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  Floor {floorNumber}/{totalFloors}
                </span>
              </div>
              <p className={`text-[11px] truncate ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {property.projectName || 'Gated Society'} • {property.location.microMarket} • {property.carpetAreaSqFt} sq.ft • {formatINR(propertyPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canModify && (
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modify Listing</span>
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
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-400 text-xs font-bold hover:bg-blue-500/25 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Owner Inspection</span>
            </button>

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
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* AUTHOR & CREATOR BANNER */}
      {property.createdBy && (
        <div className={`px-4 sm:px-8 py-2 border-b text-xs flex items-center justify-between ${
          isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>
              Direct Resale: <strong>{isCreator ? 'You (Verified Resident Owner)' : property.createdBy.name || property.createdBy.email}</strong>
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            Share Certificate Ready
          </span>
        </div>
      )}

      {/* 3. MAIN EXPERIENCE BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* HERO & UNIT ELEVATION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-blue-500/20 aspect-[16/9] bg-black group shadow-2xl">
              <SeoImage
                src={property.media?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85'}
                alt={property.title}
                context={{
                  entityType: 'PROPERTY',
                  entityTitle: property.title,
                  locality: property.location.microMarket || 'Pune',
                  city: property.location.city || 'Pune',
                  configuration: property.configuration,
                  carpetAreaSqFt: property.carpetAreaSqFt,
                  mediaCategory: 'INTERIOR',
                }}
                priority={true}
                showSeoBadge={true}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

              {/* Badges Overlay */}
              <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Resale Condo</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 font-mono text-xs border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready with OC</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 font-mono text-xs border border-white/20">
                  Floor {floorNumber} of {totalFloors}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-blue-400">
                  <Compass className="w-4 h-4" />
                  <span>{property.facing?.replace('_', ' ') || 'North-East Facing'} • Unobstructed Skyline Deck</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">{property.title}</h1>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
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
                      mediaCategory: m.category || 'INTERIOR',
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                    {idx === 0 ? 'Panoramic Living Deck' : idx === 1 ? 'Master Bedroom' : 'Clubhouse Amenities'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Unit Elevation Card */}
          <div className={`lg:col-span-4 rounded-3xl border p-6 sm:p-8 space-y-6 ${
            isDark ? 'bg-[#0B101D] border-blue-500/25 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-blue-500 tracking-wider">Direct Resale Asking Price</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-current font-mono">
                {formatINR(propertyPrice)}
              </div>
              <p className="text-xs opacity-60">
                ₹{Math.round(propertyPrice / property.carpetAreaSqFt).toLocaleString()} / sq.ft carpet • 0% GST (Ready OC)
              </p>
            </div>

            {/* Unit Position Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Tower & Floor</span>
                <span className="text-sm font-bold text-blue-400 mt-0.5 block font-mono">Level {floorNumber} of {totalFloors}</span>
                <span className="text-[10px] opacity-60">High-Rise Skyline View</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Carpet Usable Area</span>
                <span className="text-sm font-bold text-current mt-0.5 block font-mono">{property.carpetAreaSqFt} sq.ft</span>
                <span className="text-[10px] opacity-60">MahaRERA Audited</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Balcony Orientation</span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 block">{property.facing?.replace('_', ' ') || 'East'}</span>
                <span className="text-[10px] opacity-60">Direct Sunrise Facing</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Reserved Parking</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block font-mono">{parkingCount} Covered</span>
                <span className="text-[10px] opacity-60">Basement-1 Slots</span>
              </div>
            </div>

            {/* Society Maintenance Bar */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-blue-500/10 border-blue-500/25' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-500 uppercase text-[10px]">Society Maintenance</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">PAID UP TO DATE</span>
              </div>
              <div className="text-base font-bold text-current mt-1">₹6,500 / month (~₹2.85/sq.ft)</div>
              <p className="text-[10px] opacity-75 mt-1">Includes 24/7 security, clubhouse, pool, high-speed lift AMC, and sinking fund.</p>
            </div>

            {/* Net Effective EMI */}
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-transform"
              >
                <DollarSign className="w-4 h-4" />
                <span>Submit Verified Resale Offer</span>
              </button>
              <button
                onClick={() => setShowVisitModal(true)}
                className={`w-full py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Schedule Resident Owner Inspection</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. APARTMENT TABS */}
        <div className="border-b border-current/10">
          <div className="flex space-x-6 overflow-x-auto pb-3">
            {[
              { id: 'UNIT_PROFILE', label: 'Unit Layout & Tower Elevation', icon: Building2 },
              { id: 'SOCIETY_HEALTH', label: 'Society Governance & Amenities', icon: ShieldCheck },
              { id: 'RESALE_LEGAL', label: 'Clearances & Share Certificate', icon: FileText },
              { id: 'INTERIORS', label: 'Furnishing & Vastu Alignment', icon: Compass },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 text-xs font-bold py-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-blue-500 text-blue-400'
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

        {/* TAB CONTENT 1: UNIT PROFILE & ELEVATION */}
        {activeTab === 'UNIT_PROFILE' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <Building2 className="w-4 h-4" />
                <span>SPECIFIC RESIDENTIAL UNIT PROFILE</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-current">Unit Orientation & Elevation Highlights</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-4xl">
                {property.overviewDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Floor Rise Advantage</span>
                  <span className="text-base font-bold text-blue-400 mt-1 block">Level {floorNumber} / {totalFloors}</span>
                  <span className="text-[10px] opacity-70">Above street dust & city noise canopy</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Elevator-to-Flat Ratio</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">3 Lifts for 2 Flats / Floor</span>
                  <span className="text-[10px] opacity-70">Near-zero waiting time with private service lift</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Corner Unit Configuration</span>
                  <span className="text-base font-bold text-amber-400 mt-1 block">3-Side Open Ventilation</span>
                  <span className="text-[10px] opacity-70">No shared walls with adjacent living rooms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: SOCIETY GOVERNANCE */}
        {activeTab === 'SOCIETY_HEALTH' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Co-operative Housing Society (CHS) Health</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Society Reserve Fund & Community Governance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Financial Health & Reserves</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Monthly Maintenance Per Flat</span>
                    <span className="font-mono font-bold">₹6,500 / month</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Society Sinking Fund Reserve</span>
                    <span className="font-mono font-bold text-emerald-400">₹3.40 Crores (Audited)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Deemed Conveyance Status</span>
                    <span className="font-mono font-bold text-emerald-400">100% Conveyed to Society</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Piped Natural Gas (PNG)</span>
                    <span className="font-bold">MNGL Active Pipeline Connection</span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Society By-Laws & Policies</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Pet Friendly Community</span>
                    <span className="font-bold text-emerald-400">Yes (Designated pet walk & park)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Tenant Transfer Charges</span>
                    <span className="font-bold">Compliant with MCS Act Cap</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">EV Charging Infrastructure</span>
                    <span className="font-bold">Sanctioned for personal parking slot</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Security Protocol</span>
                    <span className="font-bold">MyGate biometric visitor authentication</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: LEGAL TITLE & SHARE CERTIFICATE */}
        {activeTab === 'RESALE_LEGAL' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Resale Clearances & Chain</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Society NOC & Registered Title Dossier</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Original Share Certificate</span>
                <p className="text-[11px] opacity-75">Issued by registered CHS with zero outstanding liens or duplicate duplicate claims.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Society NOC Guaranteed</span>
                <p className="text-[11px] opacity-75">Managing committee written clearance for immediate buyer membership transfer.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Bank Loan Closure NOC</span>
                <p className="text-[11px] opacity-75">Existing owner mortgage cleared with bank release deed stamped on title.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Occupancy Certificate (OC)</span>
                <p className="text-[11px] opacity-75">Full building OC certified by municipal corporation with zero GST liability.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: INTERIORS & VASTU */}
        {activeTab === 'INTERIORS' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Turnkey Condition & Energy Flow</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Interior Fitments & Vastu Compliance Audit</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <Compass className="w-4 h-4" />
                  <span>Vastu Directional Alignment (96% Compliant)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Main Apartment Entrance</span>
                    <span className="font-bold text-emerald-400">North-East (Ishanya Pad)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Kitchen & Cooking Platform</span>
                    <span className="font-bold text-emerald-400">South-East (Agni Corner)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Master Bedroom Suite</span>
                    <span className="font-bold text-emerald-400">South-West (Nairutya Zone)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Balcony / Open Sky Area</span>
                    <span className="font-bold text-emerald-400">East Facing Sunrise View</span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Existing Furnishing Inclusions</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Kitchen</span>
                    <span className="font-bold">Full Italian modular with soft-close tandem drawers</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Wardrobes</span>
                    <span className="font-bold">Floor-to-ceiling lacquered glass wardrobes</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Air Conditioners</span>
                    <span className="font-bold">Inverter split ACs in living room and all bedrooms</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Lighting & Automation</span>
                    <span className="font-bold">Philips Hue automated magnetic track lights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div className={`max-w-4xl mx-auto rounded-3xl border p-3 sm:p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-4 ${
          isDark ? 'bg-[#0B101D]/95 border-blue-500/30 text-white' : 'bg-white/95 border-slate-300 text-slate-900'
        }`}>
          <div className="truncate">
            <h4 className="font-serif font-bold text-sm truncate">{property.title}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-400 font-mono font-bold">{formatINR(propertyPrice)}</span>
              <span className="text-[10px] opacity-60">• Floor {floorNumber}/{totalFloors} • Ready OC</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowVisitModal(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-300 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Owner Inspection</span>
            </button>
            <button
              onClick={() => setShowMakeOffer(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-500/25 hover:scale-105 transition-transform"
            >
              Make Resale Offer
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
