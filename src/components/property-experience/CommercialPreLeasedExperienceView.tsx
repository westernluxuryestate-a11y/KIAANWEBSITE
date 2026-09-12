/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, UserSession } from '../../types';
import {
  TrendingUp,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  DollarSign,
  Calendar,
  Sparkles,
  Share2,
  Edit3,
  Trash2,
  UserCheck,
  Building,
  Briefcase,
  Layers,
  Award,
  FileSpreadsheet,
  Download,
  Clock,
  Zap,
  Truck,
  Eye,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '../../services/calculatorEngine';
import { SeoImage } from '../SeoImage';
import { MakeOfferModal } from '../MakeOfferModal';
import { ShareAssetModal } from '../ShareAssetModal';
import { SiteVisitModal } from '../SiteVisitModal';
import { PropertyProjectEditorModal } from '../PropertyProjectEditorModal';
import { globalKiaanStore } from '../../services/store';

interface CommercialPreLeasedExperienceViewProps {
  property: Property;
  session?: UserSession | null;
  theme?: 'dark' | 'light';
  onBackToDiscovery: () => void;
  onOpenComparison?: () => void;
  onPropertyUpdated?: (prop: Property) => void;
}

export const CommercialPreLeasedExperienceView: React.FC<CommercialPreLeasedExperienceViewProps> = ({
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
  const [activeTab, setActiveTab] = useState<'FINANCIAL_TERMINAL' | 'TENANT_COVENANT' | 'FACILITY_SPECS' | 'CASHFLOW_MODEL'>('FINANCIAL_TERMINAL');

  const canModify = globalKiaanStore.canUserModifyProperty(property, session);
  const isCreator = property.createdBy?.email?.toLowerCase() === (session?.email || '').toLowerCase();

  const handleDeleteProperty = () => {
    if (!canModify) {
      alert('Access Denied: Only the creator or Super Admin can delete this commercial asset.');
      return;
    }
    const confirmDel = window.confirm(`Are you sure you want to delete commercial asset "${property.title}"?`);
    if (!confirmDel) return;

    const res = globalKiaanStore.deleteProperty(property.id, session || undefined);
    if (res.success) {
      alert(`Commercial asset "${property.title}" has been deleted.`);
      onBackToDiscovery();
    } else {
      alert(res.message);
    }
  };

  const pData = property.preLeasedData;
  const propertyPrice = property.pricing?.totalEstimatedAcquisitionCost || property.pricing?.basePrice || 48000000;
  const monthlyRent = pData?.monthlyRentINR || Math.round(propertyPrice * 0.085 / 12);
  const annualRent = pData?.annualRentINR || (monthlyRent * 12);
  const verifiedYield = pData?.currentVerifiedYieldPercent || Number(((annualRent / propertyPrice) * 100).toFixed(2));
  const paybackYears = (propertyPrice / annualRent).toFixed(1);

  const tenantName = pData?.tenantName || 'AAA Blue-Chip Multinational Tenant';
  const tenantIndustry = pData?.tenantIndustry || 'Global Corporate Operations';
  const remainingYears = pData?.remainingLeasePeriodYears || 7.5;
  const lockInYears = pData?.lockInPeriodYears || 5;
  const escalationClause = pData?.escalationClause || '15% fixed escalation every 3 years';
  const securityDeposit = pData?.securityDepositINR || monthlyRent * 6;

  const canonicalUrl = `https://kiaanproperties.com/commercial/${property.slug || property.id}`;

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-[#05080E] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* 1. INSTITUTIONAL FINANCIAL TICKER BAR */}
      <div className={`border-b py-3 px-4 sm:px-8 ${
        isDark ? 'bg-[#090F1C] border-emerald-500/20 text-white' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-emerald-500 text-black font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>PRE-LEASED INSTITUTIONAL</span>
            </span>
            <span className="text-emerald-400 font-bold text-sm">{verifiedYield}% GROSS YIELD</span>
            <span className="text-white/60 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">{formatINR(monthlyRent)} / MONTH INFLOW</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-white/60">PAYBACK HORIZON: <strong className="text-emerald-400">{paybackYears} YRS</strong></span>
            <span className="text-white/60 hidden md:inline">LOCK-IN: <strong className="text-amber-400">{lockInYears} YRS REMAINING</strong></span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(canonicalUrl);
                alert('Commercial Terminal URL copied!');
              }}
              className="text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Copy Terminal URL
            </button>
          </div>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header
        className={`sticky top-20 z-40 backdrop-blur-2xl border-b transition-all ${
          isDark ? 'bg-[#05080E]/90 border-emerald-500/20 shadow-2xl' : 'bg-white/95 border-slate-200 shadow-sm'
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
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  {property.subType || property.propertyType}
                </span>
              </div>
              <p className={`text-[11px] truncate ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {tenantName} • {property.location.microMarket} • {property.carpetAreaSqFt} sq.ft • {formatINR(propertyPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canModify && (
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
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
              onClick={() => alert('Financial Due Diligence Docket (Tenancy Agreement, Rent Slips & Title Search) requested.')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Docket</span>
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
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* AUTHOR & CREATOR BANNER */}
      {property.createdBy && (
        <div className={`px-4 sm:px-8 py-2 border-b text-xs flex items-center justify-between ${
          isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Commercial Desk Listing: <strong>{isCreator ? 'You (Verified Landlord / Asset Manager)' : property.createdBy.name || property.createdBy.email}</strong>
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            Registered Lease on Record
          </span>
        </div>
      )}

      {/* 3. MAIN EXPERIENCE BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* HERO & FINANCIAL OVERVIEW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/25 aspect-[16/9] bg-black group shadow-2xl">
              <SeoImage
                src={property.media?.[0]?.url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=85'}
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
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{verifiedYield}% Annual Yield</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 font-mono text-xs border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Occupied & Yielding</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 font-mono text-xs border border-white/20">
                  {remainingYears} Yrs Lease Left
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-emerald-400">
                  <Briefcase className="w-4 h-4" />
                  <span>Anchor Tenant: {tenantName}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">{property.title}</h1>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
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
                    alt={m.title || `${property.title} Commercial Photo ${idx + 1}`}
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
                    {idx === 0 ? 'Road Elevation' : idx === 1 ? 'Showroom Interior' : 'Loading Bay / Parking'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Commercial Executive Ticker Card */}
          <div className={`lg:col-span-4 rounded-3xl border p-6 sm:p-8 space-y-6 ${
            isDark ? 'bg-[#080D1A] border-emerald-500/25 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-emerald-500 tracking-wider font-mono">Acquisition Capital Value</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-current font-mono">
                {formatINR(propertyPrice)}
              </div>
              <p className="text-xs opacity-60">
                ₹{Math.round(propertyPrice / property.carpetAreaSqFt).toLocaleString()} / sq.ft carpet • 0% GST (Ready Commercial Asset)
              </p>
            </div>

            {/* Institutional Cashflow Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Monthly Inflow</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block font-mono">{formatINR(monthlyRent)}</span>
                <span className="text-[10px] opacity-60">Escrow Transfer</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Annual Income</span>
                <span className="text-sm font-bold text-current mt-0.5 block font-mono">{formatINR(annualRent)}</span>
                <span className="text-[10px] opacity-60">{verifiedYield}% Gross Yield</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Escalation Formula</span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 block">15% / 3 Yrs</span>
                <span className="text-[10px] opacity-60">Registered in deed</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Security Deposit</span>
                <span className="text-sm font-bold text-cyan-400 mt-0.5 block font-mono">{formatINR(securityDeposit)}</span>
                <span className="text-[10px] opacity-60">Transferred to Buyer</span>
              </div>
            </div>

            {/* Tenant Covenant Box */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-500 uppercase text-[10px]">Covenant Quality</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">TIER-1 MULTINATIONAL</span>
              </div>
              <div className="text-base font-bold text-current mt-1">{tenantName}</div>
              <p className="text-[10px] opacity-75 mt-1">{tenantIndustry} • AAA Balance Sheet Covenant.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowMakeOffer(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition-transform"
              >
                <DollarSign className="w-4 h-4" />
                <span>Issue Letter of Intent (LOI)</span>
              </button>
              <button
                onClick={() => setShowVisitModal(true)}
                className={`w-full py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Schedule Institutional Site Inspection</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. COMMERCIAL NAVIGATION TABS */}
        <div className="border-b border-current/10">
          <div className="flex space-x-6 overflow-x-auto pb-3">
            {[
              { id: 'FINANCIAL_TERMINAL', label: 'Financial & Rent Roll Terminal', icon: TrendingUp },
              { id: 'TENANT_COVENANT', label: 'Tenant Covenant & Lease Governance', icon: ShieldCheck },
              { id: 'FACILITY_SPECS', label: 'Commercial Engineering & Frontage', icon: Building },
              { id: 'CASHFLOW_MODEL', label: '10-Year Compounding Cashflow', icon: FileSpreadsheet },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 text-xs font-bold py-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 text-emerald-400'
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

        {/* TAB 1: FINANCIAL TERMINAL */}
        {activeTab === 'FINANCIAL_TERMINAL' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#080D1A] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>COMMERCIAL INVESTMENT ANALYSIS</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-current">Rent Roll & Yield Dynamics</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-4xl">
                {property.overviewDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Gross Entry Yield</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block font-mono">{verifiedYield}% p.a.</span>
                  <span className="text-[10px] opacity-70">Day-1 immediate recurring cashflow</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Common Area Maintenance (CAM)</span>
                  <span className="text-xl font-bold text-blue-400 mt-1 block">100% Tenant Paid</span>
                  <span className="text-[10px] opacity-70">Zero operational drag on landlord cashflow</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Payback Timeline</span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block font-mono">{paybackYears} Years</span>
                  <span className="text-[10px] opacity-70">Before factoring 15% periodic escalation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TENANT COVENANT & LEASE GOVERNANCE */}
        {activeTab === 'TENANT_COVENANT' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#080D1A] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Lease Contract Governance</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Tenant Profile & Tripartite Registered Deed</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Contract Terms Summary</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Tenant Identity</span>
                    <span className="font-bold">{tenantName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Total Registered Lease Term</span>
                    <span className="font-mono font-bold">9 Years Total</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Remaining Non-Cancelable Lock-In</span>
                    <span className="font-mono font-bold text-emerald-400">{lockInYears} Years</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Periodic Escalation</span>
                    <span className="font-mono font-bold text-amber-400">{escalationClause}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Interest-Free Refundable Deposit</span>
                    <span className="font-mono font-bold">{formatINR(securityDeposit)}</span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                  <Briefcase className="w-4 h-4" />
                  <span>Tenant Credit & Sovereign Rating</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Industry Domain</span>
                    <span className="font-bold">{tenantIndustry}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Credit Rating Benchmark</span>
                    <span className="font-bold text-emerald-400">CRISIL AAA / Fitch A+ Equivalent</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Rent Payment Track Record</span>
                    <span className="font-bold text-emerald-400">100% On-Time via Automated RTGS</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Fitout Investment By Tenant</span>
                    <span className="font-bold">₹1.85 Cr invested in bespoke fitouts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FACILITY SPECS */}
        {activeTab === 'FACILITY_SPECS' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#080D1A] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Engineering & Infrastructure</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Commercial Physical Specifications & Load Capacity</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
                  <Layers className="w-4 h-4" />
                  <span>Glazed Road Frontage</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">72 ft Wide</div>
                <p className="opacity-75">Continuous unobstructed floor-to-ceiling glass facade offering maximum street visibility on main boulevard.</p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                  <Zap className="w-4 h-4" />
                  <span>Power & HVAC Automation</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">100% DG Backup</div>
                <p className="opacity-75">Dedicated 125 kVA transformer with automatic changeover and central water-cooled chiller HVAC.</p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[11px]">
                  <Truck className="w-4 h-4" />
                  <span>Logistics & Parking Provision</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">{property.parkingCount || 8} Bays</div>
                <p className="opacity-75">Dedicated surface visitor parking bays plus dedicated rear loading dock for cargo delivery.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CASHFLOW MODEL */}
        {activeTab === 'CASHFLOW_MODEL' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#080D1A] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Actuarial Projections</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">10-Year Compounding Cashflow with Escalation</h3>
              <p className="text-xs opacity-75">
                Model incorporates 15% contractual rent escalation every 3 years.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10 bg-white/5 text-white/70' : 'border-slate-200 bg-slate-100 text-slate-700'}`}>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Monthly Rent</th>
                    <th className="py-3 px-4">Annual Inflow</th>
                    <th className="py-3 px-4">Gross Yield on Cost</th>
                    <th className="py-3 px-4">Cumulative Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-current/10">
                  {[
                    { year: 'Year 1 - 3 (Current)', mult: 1.0 },
                    { year: 'Year 4 - 6 (+15% Escalation)', mult: 1.15 },
                    { year: 'Year 7 - 9 (+15% Escalation)', mult: 1.3225 },
                    { year: 'Year 10 (+15% Renewal)', mult: 1.5208 },
                  ].map((row, idx) => {
                    const rowMonthly = Math.round(monthlyRent * row.mult);
                    const rowAnnual = rowMonthly * 12;
                    const rowYield = ((rowAnnual / propertyPrice) * 100).toFixed(2);
                    return (
                      <tr key={idx} className={isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}>
                        <td className="py-3 px-4 font-bold text-current">{row.year}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">{formatINR(rowMonthly)} / mo</td>
                        <td className="py-3 px-4 text-current">{formatINR(rowAnnual)} / yr</td>
                        <td className="py-3 px-4 text-amber-400 font-bold">{rowYield}%</td>
                        <td className="py-3 px-4 text-blue-400 font-bold">
                          {formatINR(Math.round(annualRent * (idx === 0 ? 3 : idx === 1 ? 6.45 : idx === 2 ? 10.42 : 11.94)))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div className={`max-w-4xl mx-auto rounded-3xl border p-3 sm:p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-4 ${
          isDark ? 'bg-[#080D1A]/95 border-emerald-500/30 text-white' : 'bg-white/95 border-slate-300 text-slate-900'
        }`}>
          <div className="truncate">
            <h4 className="font-serif font-bold text-sm truncate">{property.title}</h4>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs text-emerald-400 font-bold">{verifiedYield}% Gross Yield</span>
              <span className="text-[10px] opacity-60">• {formatINR(monthlyRent)}/mo Inflow</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowVisitModal(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-300 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Site Inspection</span>
            </button>
            <button
              onClick={() => setShowMakeOffer(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform"
            >
              Issue LOI / Offer
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
