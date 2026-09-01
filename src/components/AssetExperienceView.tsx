/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Project,
  Unit,
  Amenity,
  PricingBreakdown,
  PropertyScore,
  RERARecord,
} from '../types';
import {
  Building,
  ShieldCheck,
  MapPin,
  Maximize2,
  Calendar,
  Layers,
  Sparkles,
  Share2,
  Lock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Sun,
  Compass,
  FileText,
  Clock,
  Car,
  Award,
  ChevronRight,
  ChevronDown,
  Users,
  FileSignature,
  CreditCard,
  PhoneCall,
  Download,
  Check,
  Eye,
  ArrowRight,
  Sliders,
  Percent,
} from 'lucide-react';
import { formatINR, calculateHomeLoanEMI, calculateStatutoryTaxShield } from '../services/calculatorEngine';
import { ReraBadge } from './ReraBadge';
import { FamilyDiscussionRoom } from './FamilyDiscussionRoom';
import { MakeOfferModal } from './MakeOfferModal';
import { ShareAssetModal } from './ShareAssetModal';
import { SiteVisitModal } from './SiteVisitModal';
import { DigitalTwinViewer } from './DigitalTwinViewer';

interface AssetExperienceViewProps {
  project: Project;
  initialUnitId?: string;
  theme?: 'dark' | 'light';
  onBackToDiscovery?: () => void;
  onOpenComparison?: (unit: Unit) => void;
}

export const AssetExperienceView: React.FC<AssetExperienceViewProps> = ({
  project,
  initialUnitId,
  theme = 'dark',
  onBackToDiscovery,
  onOpenComparison,
}) => {
  const isDark = theme === 'dark';

  // Flatten all units from all towers
  const allUnits: Unit[] = project.towers.flatMap((t) => t.floors.flatMap((f) => f.units));
  
  // Selected Unit State
  const [selectedUnit, setSelectedUnit] = useState<Unit>(
    allUnits.find((u) => u.id === initialUnitId) || allUnits[0] || ({} as Unit)
  );

  // Active Inquiry Section / Tab
  const [activeSection, setActiveSection] = useState<
    'OVERVIEW' | 'SPECIFICATIONS' | 'LOCATION' | 'PRICING' | 'SOLAR_TWIN' | 'COMPLIANCE' | 'FINANCE' | 'FAMILY' | 'UNITS'
  >('OVERVIEW');

  // Interactive Solar Ray Simulation
  const [simulatedHour, setSimulatedHour] = useState<number>(9); // 9 AM default
  const [selectedRoomHighlight, setSelectedRoomHighlight] = useState<string | null>(null);

  // Financial Loan & Tax Customizer
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  // Modals & Action Sheets
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
  const [showDigitalTwinModal, setShowDigitalTwinModal] = useState(false);

  // 15-Minute Concurrency Hold & Booking State
  const [isHolding, setIsHolding] = useState(false);
  const [holdSuccessMsg, setHoldSuccessMsg] = useState<string | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync with initialUnitId prop changes
  useEffect(() => {
    if (initialUnitId) {
      const found = allUnits.find((u) => u.id === initialUnitId);
      if (found) setSelectedUnit(found);
    }
  }, [initialUnitId, allUnits]);

  // Current Unit Calculations
  const unitPrice = selectedUnit.pricing?.totalEstimatedAcquisitionCost || project.headlinePriceRange.min;
  const basePrice = selectedUnit.pricing?.basePrice || project.headlinePriceRange.min * 0.88;
  const loanPrincipal = unitPrice * (1 - downPaymentPercent / 100);
  const loanDownpaymentINR = unitPrice * (downPaymentPercent / 100);
  const emiObj = calculateHomeLoanEMI(loanPrincipal, interestRate, loanTenureYears);
  const monthlyEmiINR = emiObj.monthlyEMI;
  const taxShield = calculateStatutoryTaxShield({
    loanPrincipal,
    annualInterestRatePercent: interestRate,
    tenureYears: loanTenureYears,
    taxBracketPercent: 30,
  });
  const netEffectiveMonthlyEmi = monthlyEmiINR - taxShield.monthlyTaxShieldINR;

  // Solar simulation calculations
  const sunAngleDegrees = (simulatedHour - 6) * 15; // 6 AM = 0 deg, 12 PM = 90 deg, 6 PM = 180 deg
  const isMorningSun = simulatedHour >= 6 && simulatedHour <= 11;
  const isAfternoonSun = simulatedHour >= 12 && simulatedHour <= 15;
  const isGoldenHour = simulatedHour >= 16 && simulatedHour <= 18;

  // Handle 15-Minute Priority Concurrency Hold
  const handleHoldUnit = async () => {
    if (!selectedUnit?.id) return;
    setIsHolding(true);
    setErrorMessage(null);
    setHoldSuccessMsg(null);

    try {
      const res = await fetch(`/api/v1/units/${selectedUnit.id}/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'cust_rajesh_sharma',
          userName: 'Rajesh Sharma',
          tokenAmountPaid: 50000,
          durationMinutes: 15,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || 'Failed to lock unit.');
      } else {
        setHoldSuccessMsg(`Unit ${selectedUnit.unitNumber} is locked exclusively for you for 15 minutes! Token payment verified.`);
        setSelectedUnit((prev) => ({ ...prev, status: 'HOLD' }));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsHolding(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 pb-32 ${
        isDark ? 'bg-[#070A0F] text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Permanent URL Bar & Canonical SEO Header */}
      <div className={`border-b text-xs py-2 px-4 sm:px-8 flex items-center justify-between ${isDark ? 'bg-[#05070B] border-white/10 text-white/50' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
        <div className="flex items-center gap-2 font-mono truncate">
          <span className="text-amber-500 font-bold">CANONICAL:</span>
          <span className="truncate">/projects/{project.slug || project.name.toLowerCase().replace(/\s+/g, '-')}/{selectedUnit.towerName ? selectedUnit.towerName.toLowerCase().replace(/\s+/g, '-') : 'tower-a'}/unit-{selectedUnit.unitNumber?.toLowerCase() || 'a1203'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold uppercase">{selectedUnit.status || 'AVAILABLE'}</span>
          <button
            onClick={() => {
              const url = `https://kiaanproperties.com/projects/${project.slug || project.name.toLowerCase().replace(/\s+/g, '-')}/unit-${selectedUnit.unitNumber?.toLowerCase() || 'a1203'}`;
              navigator.clipboard?.writeText(url);
              alert('Canonical Unit URL copied to clipboard!');
            }}
            className="text-amber-500 font-bold hover:underline cursor-pointer"
          >
            Copy Unit URL
          </button>
        </div>
      </div>

      {/* Top Experience Header & Breadcrumbs */}
      <div
        className={`sticky top-20 z-40 backdrop-blur-2xl border-b transition-all ${
          isDark
            ? 'bg-[#070A0F]/90 border-white/10'
            : 'bg-white/90 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToDiscovery && (
              <button
                onClick={onBackToDiscovery}
                className={`p-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                <span>←</span>
                <span>Discovery</span>
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
                  Digital Asset
                </span>
                <span className="text-xs opacity-40">•</span>
                <span className="font-serif font-bold text-base sm:text-lg">{project.name}</span>
                {selectedUnit?.unitNumber && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold">
                    Unit {selectedUnit.unitNumber}
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {project.location.microMarket}, {project.location.city} • {selectedUnit.configuration || project.configurations.join(', ')} • {project.reraRecord?.registrationNumber}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowShareModal(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Share Dossier & QR</span>
            </button>

            {selectedUnit && onOpenComparison && (
              <button
                onClick={() => onOpenComparison(selectedUnit)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
                    : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Compare Unit</span>
              </button>
            )}

            <button
              onClick={() => setShowDigitalTwinModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>3D Spatial Twin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Experience Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Error / Hold Alert Banners */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-xs font-bold px-2">✕</button>
          </div>
        )}

        {holdSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{holdSuccessMsg}</span>
            </div>
            <button onClick={() => setHoldSuccessMsg(null)} className="text-xs font-bold px-2">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: WHAT IS IT? — ARCHITECTURAL IDENTITY & CINEMATIC MEDIA HERO */}
        {/* ========================================================================= */}
        <section id="what-is-it" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cinematic Media Stage */}
            <div className="lg:col-span-8 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-current/10 shadow-2xl aspect-[16/9] group bg-black">
                <img
                  src={selectedUnit.images?.[0] || project.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85'}
                  alt={project.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

                <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Trophy Sky Penthouse</span>
                  </span>
                  <ReraBadge reraRecord={project.reraRecord} />
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                      Architectural Masterpiece
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                      {project.name}
                    </h1>
                    <p className="text-xs text-white/80 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{project.location.address} • 320 Ft Elevation</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setShowDigitalTwinModal(true)}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Launch 3D Walkthrough</span>
                  </button>
                </div>
              </div>

              {/* Media Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {(project.media || []).slice(0, 4).map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="relative rounded-2xl overflow-hidden border border-current/10 aspect-[16/10] cursor-pointer hover:border-amber-500/50 transition-all group"
                  >
                    <img
                      src={m.url}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                      {m.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Acquisition & Trust Summary Card */}
            <div
              className={`lg:col-span-4 rounded-3xl border p-6 sm:p-8 space-y-6 ${
                isDark ? 'bg-[#0B101B]/90 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-amber-500">
                  Transparent Acquisition Architecture
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-current">
                  {formatINR(unitPrice)}
                </div>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  All-Inclusive RERA Transparent Price (Base + GST + Stamp Duty)
                </p>
              </div>

              {/* Key Architectural Dimensions Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">RERA Carpet Area</span>
                  <span className="text-base font-mono font-bold text-current mt-0.5 block">
                    {selectedUnit.carpetAreaSqFt || project.carpetAreaRangeSqFt.min} sq.ft
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Orientation Facing</span>
                  <span className="text-base font-bold text-amber-500 mt-0.5 block">
                    {selectedUnit.facing || 'East Facing'}
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Ceiling Height</span>
                  <span className="text-base font-bold text-current mt-0.5 block">11.5 Ft Clear</span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Floor Rise Level</span>
                  <span className="text-base font-bold text-current mt-0.5 block">
                    Level {selectedUnit.floorNumber || 12} / 32
                  </span>
                </div>
              </div>

              {/* Net Monthly Tax-Shielded EMI */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    Net Effective Monthly EMI
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold font-mono">
                    Sec 80C + 24(b) Shielded
                  </span>
                </div>
                <div className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatINR(netEffectiveMonthlyEmi)} / mo
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300/80 mt-1">
                  Save {formatINR(taxShield.monthlyTaxShieldINR)}/mo in statutory income tax deductions.
                </p>
              </div>

              {/* Primary Call to Action Stack */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleHoldUnit}
                  disabled={isHolding || selectedUnit.status === 'HOLD' || selectedUnit.status === 'SOLD'}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {selectedUnit.status === 'HOLD'
                      ? 'Unit Currently on Active 15-Min Hold'
                      : isHolding
                      ? 'Locking Concurrency Hold...'
                      : 'Lock 15-Minute Exclusivity (₹50,000 Token)'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowMakeOffer(true)}
                    className={`py-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isDark
                        ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
                    }`}
                  >
                    <FileSignature className="w-3.5 h-3.5 text-amber-500" />
                    <span>Make Offer</span>
                  </button>

                  <button
                    onClick={() => setShowSiteVisitModal(true)}
                    className={`py-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isDark
                        ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 text-amber-500" />
                    <span>VIP Site Visit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: CAN I SEE IT? — SPATIAL DIGITAL TWIN & SOLAR RAY SIMULATOR */}
        {/* ========================================================================= */}
        <section id="can-i-see-it" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
                Spatial Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">
                Dawn-to-Dusk Sunlight & Interactive Floor Plan
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Sun className="w-4 h-4" />
                <span>Solar Ray Tracing: {simulatedHour}:00 {simulatedHour >= 12 ? 'PM' : 'AM'}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Solar Canvas */}
            <div
              className={`lg:col-span-8 rounded-3xl border p-6 sm:p-8 space-y-6 ${
                isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-white border-slate-200 shadow-lg'
              }`}
            >
              {/* Sunlight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="opacity-60">Time of Day (Sun Elevation)</span>
                  <span className="font-mono text-amber-500">
                    {simulatedHour}:00 {simulatedHour >= 12 ? 'PM' : 'AM'} ({isMorningSun ? 'Morning Sun' : isAfternoonSun ? 'Direct Overhead' : 'Golden Hour Dusk'})
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={18}
                  step={1}
                  value={simulatedHour}
                  onChange={(e) => setSimulatedHour(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] opacity-40 font-mono">
                  <span>6:00 AM (Sunrise East)</span>
                  <span>12:00 PM (Zenith)</span>
                  <span>6:00 PM (Sunset West)</span>
                </div>
              </div>

              {/* 2D Interactive Blueprint SVG */}
              <div className="relative rounded-2xl overflow-hidden border border-current/10 p-6 bg-slate-950 flex items-center justify-center min-h-[320px]">
                {/* Sunlight Direction Glow Effect */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-40"
                  style={{
                    background: `radial-gradient(circle at ${50 + Math.cos((sunAngleDegrees * Math.PI) / 180) * 40}% ${
                      50 - Math.sin((sunAngleDegrees * Math.PI) / 180) * 40
                    }%, rgba(245, 158, 11, 0.45) 0%, transparent 60%)`,
                  }}
                ></div>

                <svg viewBox="0 0 500 320" className="w-full max-w-lg h-auto relative z-10">
                  {/* Living Room */}
                  <rect
                    x="40"
                    y="40"
                    width="240"
                    height="140"
                    className={`stroke-amber-400 stroke-[1.5] transition-all cursor-pointer ${
                      selectedRoomHighlight === 'LIVING' || isMorningSun ? 'fill-amber-500/25' : 'fill-slate-900/80'
                    }`}
                    onClick={() => setSelectedRoomHighlight('LIVING')}
                  />
                  <text x="60" y="80" fill="#F3F4F6" fontSize="12" fontWeight="bold">Living & Dining</text>
                  <text x="60" y="100" fill="#FBBF24" fontSize="10">24' x 16' • East Balcony Deck</text>

                  {/* Master Bedroom */}
                  <rect
                    x="290"
                    y="40"
                    width="170"
                    height="140"
                    className={`stroke-amber-400 stroke-[1.5] transition-all cursor-pointer ${
                      selectedRoomHighlight === 'MASTER' || isMorningSun ? 'fill-amber-500/30' : 'fill-slate-900/80'
                    }`}
                    onClick={() => setSelectedRoomHighlight('MASTER')}
                  />
                  <text x="305" y="80" fill="#F3F4F6" fontSize="12" fontWeight="bold">Master Suite</text>
                  <text x="305" y="100" fill="#FBBF24" fontSize="10">18' x 14' • North-East</text>

                  {/* Kitchen */}
                  <rect
                    x="40"
                    y="190"
                    width="140"
                    height="90"
                    className="stroke-amber-400 stroke-[1.5] fill-slate-900/80 cursor-pointer"
                    onClick={() => setSelectedRoomHighlight('KITCHEN')}
                  />
                  <text x="55" y="230" fill="#F3F4F6" fontSize="12" fontWeight="bold">Kitchen & Utility</text>
                  <text x="55" y="250" fill="#FBBF24" fontSize="10">12' x 10'</text>

                  {/* Guest Bedroom */}
                  <rect
                    x="190"
                    y="190"
                    width="140"
                    height="90"
                    className="stroke-amber-400 stroke-[1.5] fill-slate-900/80 cursor-pointer"
                    onClick={() => setSelectedRoomHighlight('GUEST')}
                  />
                  <text x="205" y="230" fill="#F3F4F6" fontSize="12" fontWeight="bold">Guest Bedroom</text>
                  <text x="205" y="250" fill="#FBBF24" fontSize="10">14' x 12'</text>

                  {/* Private Sky Deck */}
                  <rect
                    x="340"
                    y="190"
                    width="120"
                    height="90"
                    className="stroke-emerald-400 stroke-[1.5] fill-emerald-500/20 cursor-pointer"
                    onClick={() => setSelectedRoomHighlight('DECK')}
                  />
                  <text x="350" y="230" fill="#34D399" fontSize="12" fontWeight="bold">Sky Pool Deck</text>
                  <text x="350" y="250" fill="#A7F3D0" fontSize="10">Cantilevered 320'</text>
                </svg>
              </div>

              {/* Solar Insights Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block">Daylight Exposure</span>
                  <span className="font-bold text-amber-500 mt-0.5 block">8.5 Hours Direct Daily</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block">Vaastu Compliance</span>
                  <span className="font-bold text-emerald-500 mt-0.5 block">100% Certified NE Master</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="opacity-60 block">Thermal Index</span>
                  <span className="font-bold text-current mt-0.5 block">Optimal Double-Glazed</span>
                </div>
              </div>
            </div>

            {/* Tower Floor Stacker / Unit Selector */}
            <div
              className={`lg:col-span-4 rounded-3xl border p-6 sm:p-8 space-y-4 ${
                isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-white border-slate-200 shadow-lg'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-500">
                  Elevation Stacker
                </span>
                <h3 className="text-lg font-serif font-bold text-current">Tower Inventory & Floor Levels</h3>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  Switch units or floors dynamically to observe view height and solar angle changes.
                </p>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {allUnits.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUnit(u)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedUnit.id === u.id
                        ? 'border-amber-500 bg-amber-500/15 shadow-md'
                        : isDark
                        ? 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-current font-mono">Unit {u.unitNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-current/10 font-bold">
                          Lvl {u.floorNumber}
                        </span>
                      </div>
                      <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        {u.configuration} • {u.carpetAreaSqFt} sq.ft • {u.facing}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-amber-500 block">
                        {formatINR(u.pricing?.totalEstimatedAcquisitionCost || 0)}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          u.status === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : u.status === 'HOLD'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: WHERE IS IT? — LOCATION, MICRO-MARKET & COMMUTE MATRIX */}
        {/* ========================================================================= */}
        <section id="where-is-it" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
              Micro-Market & Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">
              Prime Location: {project.location.microMarket}, {project.location.city}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.location.landmarks?.map((lm, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl border space-y-2 ${
                  isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                    {lm.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-500">
                    {lm.commuteMinutes} Mins Drive
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-current">{lm.name}</h4>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  Distance: {lm.distanceKm} km from entrance gate
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: CAN I TRUST IT? — MAHARERA & STATUTORY ESCROW VERIFICATION */}
        {/* ========================================================================= */}
        <section id="can-i-trust-it" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-500">
              Legal Integrity & RERA Audits
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">
              Statutory Transparency & Escrow Ring-Fencing
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-current">MahaRERA Registration</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                Officially certified under MahaRERA No. <strong className="text-amber-500">{project.reraRecord?.registrationNumber}</strong>. Valid through {project.possessionDate}.
              </p>
              <a
                href={project.reraRecord?.officialAuthorityUrl || 'https://maharera.mahaonline.gov.in'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:underline pt-2"
              >
                <span>Verify on MahaRERA Government Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-current">30-Year Clear Title Opinion</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                100% freehold land ownership with unencumbered title search certified by Senior High Court Advocate. Zero legal disputes.
              </p>
              <span className="text-xs font-mono text-blue-400 block pt-2">Dossier Ref: KP-TITLE-2026-04</span>
            </div>

            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isDark ? 'bg-[#0B101B]/90 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-current">70% Escrow Ring-Fencing</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                Every buyer rupee is statutorily deposited into the dedicated ICICI Bank MahaRERA Escrow Account, released strictly against Architect Form 4 slab certifications.
              </p>
              <span className="text-xs font-mono text-purple-400 block pt-2">Escrow A/C: 000405018291</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: CAN MY FAMILY DISCUSS IT? — FAMILY COLLABORATION ROOM */}
        {/* ========================================================================= */}
        <section id="family-room">
          <FamilyDiscussionRoom
            assetId={selectedUnit.id || project.id}
            assetTitle={`${project.name} ${selectedUnit.unitNumber ? `(Unit ${selectedUnit.unitNumber})` : ''}`}
            theme={theme}
          />
        </section>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CONTEXTUAL FUNNEL DOCK (APPLE-INSPIRED GLASS BAR) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div
          className={`max-w-4xl mx-auto rounded-3xl border p-3 sm:p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
            isDark
              ? 'bg-[#0B101B]/95 border-amber-500/30 text-white'
              : 'bg-white/95 border-slate-300 text-slate-900 shadow-2xl'
          }`}
        >
          {/* Active Asset Snapshot */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-current">{project.name}</span>
                <span className="text-xs text-amber-500 font-mono font-bold">
                  {formatINR(unitPrice)}
                </span>
              </div>
              <span className={`text-[10px] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Unit {selectedUnit.unitNumber || 'A-1204'} • {selectedUnit.configuration} • {selectedUnit.facing}
              </span>
            </div>
          </div>

          {/* Quick Action Funnel Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowMakeOffer(true)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              Make Offer
            </button>

            <button
              onClick={() => setShowSiteVisitModal(true)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              VIP Visit
            </button>

            <button
              onClick={handleHoldUnit}
              disabled={isHolding || selectedUnit.status === 'HOLD' || selectedUnit.status === 'SOLD'}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{selectedUnit.status === 'HOLD' ? 'On 15m Hold' : 'Lock Exclusivity'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals & Action Sheets */}
      {showMakeOffer && (
        <MakeOfferModal
          assetId={project.id}
          assetTitle={project.name}
          askingPrice={unitPrice}
          unitNumber={selectedUnit.unitNumber}
          theme={theme}
          onClose={() => setShowMakeOffer(false)}
        />
      )}

      {showShareModal && (
        <ShareAssetModal
          assetId={selectedUnit.id || project.id}
          assetTitle={`${project.name} (Unit ${selectedUnit.unitNumber || '1204'})`}
          location={`${project.location.microMarket}, ${project.location.city}`}
          priceDisplay={formatINR(unitPrice)}
          theme={theme}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showSiteVisitModal && (
        <SiteVisitModal
          project={project}
          onClose={() => setShowSiteVisitModal(false)}
        />
      )}

      {showDigitalTwinModal && (
        <DigitalTwinViewer
          project={project}
          initialUnitId={selectedUnit.id}
          onClose={() => setShowDigitalTwinModal(false)}
        />
      )}
    </div>
  );
};
