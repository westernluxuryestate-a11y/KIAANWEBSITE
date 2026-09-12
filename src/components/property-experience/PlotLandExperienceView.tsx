/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, UserSession } from '../../types';
import {
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
  FileText,
  Clock,
  Ruler,
  Layers,
  Award,
  Download,
  Eye,
  Sliders,
  Car,
  Droplets,
  Zap,
} from 'lucide-react';
import { formatINR } from '../../services/calculatorEngine';
import { SeoImage } from '../SeoImage';
import { MakeOfferModal } from '../MakeOfferModal';
import { ShareAssetModal } from '../ShareAssetModal';
import { SiteVisitModal } from '../SiteVisitModal';
import { PropertyProjectEditorModal } from '../PropertyProjectEditorModal';
import { globalKiaanStore } from '../../services/store';

interface PlotLandExperienceViewProps {
  property: Property;
  session?: UserSession | null;
  theme?: 'dark' | 'light';
  onBackToDiscovery: () => void;
  onOpenComparison?: () => void;
  onPropertyUpdated?: (prop: Property) => void;
}

export const PlotLandExperienceView: React.FC<PlotLandExperienceViewProps> = ({
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
  const [activeTab, setActiveTab] = useState<'PLOT_GEOMETRY' | 'FSI_ZONING' | 'REVENUE_712' | 'INFRASTRUCTURE'>('PLOT_GEOMETRY');

  const canModify = globalKiaanStore.canUserModifyProperty(property, session);
  const isCreator = property.createdBy?.email?.toLowerCase() === (session?.email || '').toLowerCase();

  const handleDeleteProperty = () => {
    if (!canModify) {
      alert('Access Denied: Only the creator or Super Admin can delete this plot.');
      return;
    }
    const confirmDel = window.confirm(`Are you sure you want to delete plot "${property.title}"?`);
    if (!confirmDel) return;

    const res = globalKiaanStore.deleteProperty(property.id, session || undefined);
    if (res.success) {
      alert(`Plot "${property.title}" has been deleted.`);
      onBackToDiscovery();
    } else {
      alert(res.message);
    }
  };

  const propertyPrice = property.pricing?.totalEstimatedAcquisitionCost || property.pricing?.basePrice || 18500000;
  const plotArea = property.plotSpecs?.areaSqFt || property.carpetAreaSqFt || 4250;
  const gunthas = (plotArea / 1089).toFixed(2);
  const dimensions = property.plotSpecs?.dimensions || '50 ft × 85 ft';
  const roadWidth = property.plotSpecs?.roadWidthFt || 40;
  const fsi = property.plotSpecs?.fsi || 1.5;
  const potentialBuiltUpSqFt = Math.round(plotArea * fsi);
  const pricePerSqFt = Math.round(propertyPrice / plotArea);

  const canonicalUrl = `https://kiaanproperties.com/plots/${property.slug || property.id}`;

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-[#050907] text-white' : 'bg-[#F7FAF8] text-slate-900'}`}>
      {/* 1. TOP CADASTRAL STATUS BAR */}
      <div className={`border-b text-xs py-2.5 px-4 sm:px-8 flex items-center justify-between ${
        isDark ? 'bg-[#08120B] border-emerald-500/15 text-white/60' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      }`}>
        <div className="flex items-center gap-2 font-mono truncate">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
            COLLECTOR NA GATED PLOT
          </span>
          <span className="truncate hidden sm:inline">{plotArea} sq.ft ({gunthas} Gunthas) • Sanctioned Layout</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>7/12 & 8A Extract Clean • Demarcation Ready</span>
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(canonicalUrl);
              alert('Plot URL copied to clipboard!');
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
          isDark ? 'bg-[#050907]/90 border-emerald-500/20 shadow-2xl' : 'bg-white/95 border-emerald-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDiscovery}
              className={`p-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              <span>←</span>
              <span className="hidden sm:inline">Back to Discovery</span>
            </button>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg truncate">{property.title}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  FSI {fsi}
                </span>
              </div>
              <p className={`text-[11px] truncate ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {property.location.microMarket}, {property.location.city} • {plotArea} sq.ft ({gunthas} Gunthas) • {formatINR(propertyPrice)}
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
                  <span>Modify Plot</span>
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
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Demarcation Visit</span>
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
              Direct Landowner Listing: <strong>{isCreator ? 'You (Verified Sole Titleholder)' : property.createdBy.name || property.createdBy.email}</strong>
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            Mojni Demarcated
          </span>
        </div>
      )}

      {/* 3. MAIN EXPERIENCE BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* HERO & PLOT OVERVIEW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/25 aspect-[16/9] bg-black group shadow-2xl">
              <SeoImage
                src={property.media?.[0]?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=85'}
                alt={property.title}
                context={{
                  entityType: 'PROPERTY',
                  entityTitle: property.title,
                  locality: property.location.microMarket || 'Pune',
                  city: property.location.city || 'Pune',
                  configuration: `${plotArea} sq.ft Plot`,
                  carpetAreaSqFt: plotArea,
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
                  <Trees className="w-3.5 h-3.5" />
                  <span>Freehold Land Parcel</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 font-mono text-xs border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Collector NA Approved</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 font-mono text-xs border border-white/20">
                  {plotArea} sq.ft ({gunthas} Guntha)
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-emerald-400">
                  <Ruler className="w-4 h-4" />
                  <span>{dimensions} • {roadWidth} ft Wide Asphalted Road</span>
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
                    alt={m.title || `${property.title} Land Photo ${idx + 1}`}
                    context={{
                      entityType: 'PROPERTY',
                      entityTitle: property.title,
                      locality: property.location.microMarket || 'Pune',
                      city: property.location.city || 'Pune',
                      configuration: `${plotArea} sq.ft Plot`,
                      mediaCategory: 'EXTERIOR',
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                    {idx === 0 ? 'Demarcation View' : idx === 1 ? 'Access Road' : 'Layout Aerial'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Land Metrics Card */}
          <div className={`lg:col-span-4 rounded-3xl border p-6 sm:p-8 space-y-6 ${
            isDark ? 'bg-[#08120B] border-emerald-500/25 shadow-2xl' : 'bg-white border-emerald-200 shadow-xl'
          }`}>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-emerald-500 tracking-wider font-mono">Freehold Land Valuation</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-current font-mono">
                {formatINR(propertyPrice)}
              </div>
              <p className="text-xs opacity-60 font-mono">
                ₹{pricePerSqFt.toLocaleString()} / sq.ft • ₹{(pricePerSqFt * 1089 / 100000).toFixed(2)} Lakhs / Guntha
              </p>
            </div>

            {/* Land Specs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Total Area</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block font-mono">{plotArea} sq.ft</span>
                <span className="text-[10px] opacity-60">{gunthas} Gunthas</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Dimensions</span>
                <span className="text-sm font-bold text-current mt-0.5 block font-mono">{dimensions}</span>
                <span className="text-[10px] opacity-60">Frontage × Depth</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Permissible FSI</span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 block font-mono">{fsi} FSI</span>
                <span className="text-[10px] opacity-60">~{potentialBuiltUpSqFt} sq.ft Built-Up</span>
              </div>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className="text-[10px] uppercase opacity-60 block">Approach Road</span>
                <span className="text-sm font-bold text-cyan-400 mt-0.5 block font-mono">{roadWidth} ft Wide</span>
                <span className="text-[10px] opacity-60">Asphalt with Storm Line</span>
              </div>
            </div>

            {/* Land Status Box */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-500 uppercase text-[10px]">Sanction Status</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">COLLECTOR SANCTIONED</span>
              </div>
              <div className="text-base font-bold text-current mt-1">Class-1 Non-Agricultural (NA)</div>
              <p className="text-[10px] opacity-75 mt-1">Direct construction ready. Building plans can be approved immediately.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowMakeOffer(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition-transform"
              >
                <DollarSign className="w-4 h-4" />
                <span>Submit Plot Purchase Offer</span>
              </button>
              <button
                onClick={() => setShowVisitModal(true)}
                className={`w-full py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-emerald-200 hover:bg-emerald-50 text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Book Peg-Marking Demarcation Visit</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. NAVIGATION TABS */}
        <div className="border-b border-current/10">
          <div className="flex space-x-6 overflow-x-auto pb-3">
            {[
              { id: 'PLOT_GEOMETRY', label: 'Cadastral Geometry & Demarcation', icon: Ruler },
              { id: 'FSI_ZONING', label: 'Development Potential & FSI', icon: Layers },
              { id: 'REVENUE_712', label: '7/12 & Collector NA Sanction', icon: ShieldCheck },
              { id: 'INFRASTRUCTURE', label: 'Gated Layout Utilities', icon: Zap },
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

        {/* TAB 1: PLOT GEOMETRY */}
        {activeTab === 'PLOT_GEOMETRY' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#08120B] border-white/10' : 'bg-white border-emerald-200 shadow-md'}`}>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Ruler className="w-4 h-4" />
                <span>CADASTRAL SURVEY DEMARCATION</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-current">Boundary Geometry & Contour Profile</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-4xl">
                {property.overviewDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Road Frontage</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block font-mono">50 Feet Frontage</span>
                  <span className="text-[10px] opacity-70">Wide entrance enabling grand architectural facade</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Contour Profile</span>
                  <span className="text-xl font-bold text-blue-400 mt-1 block">Level Table Land</span>
                  <span className="text-[10px] opacity-70">Zero excavation / filling cost required</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                  <span className="opacity-60 block text-[10px] uppercase">Soil Bearing Capacity</span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block font-mono">Hard Basalt Rock</span>
                  <span className="text-[10px] opacity-70">Ideal load-bearing strata for independent villa</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FSI & ZONING */}
        {activeTab === 'FSI_ZONING' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#08120B] border-white/10' : 'bg-white border-emerald-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Construction & Expansion Envelope</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Permissible Floor Space Index (FSI) & Typology</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <Layers className="w-4 h-4" />
                  <span>Sanctioned Development Metrics</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Base FSI Sanctioned</span>
                    <span className="font-mono font-bold">{fsi}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Max Potential Built-up Area</span>
                    <span className="font-mono font-bold text-emerald-400">{potentialBuiltUpSqFt} sq.ft</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Permissible Floor Rise</span>
                    <span className="font-bold">Ground + 2 Floors + Rooftop Terrace</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Zoning Classification</span>
                    <span className="font-bold text-emerald-400">Pure Residential (R-1 Zone)</span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                  <Award className="w-4 h-4" />
                  <span>Villa Architecture Guidelines</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Front Lawn Setback</span>
                    <span className="font-bold">15 Feet Minimum</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Side Yard Clearances</span>
                    <span className="font-bold">8 Feet Both Sides</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-current/10">
                    <span className="opacity-70">Private Swimming Pool Permitted</span>
                    <span className="font-bold text-emerald-400">Sanctioned in rear courtyard</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="opacity-70">Compound Wall Permissible</span>
                    <span className="font-bold">Up to 8 Feet Height</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVENUE 7/12 */}
        {activeTab === 'REVENUE_712' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#08120B] border-white/10' : 'bg-white border-emerald-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Revenue Authority Records</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">7/12 Extract, NA Sanction & Encumbrance Clearance</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">7/12 Satbara Extract Clean</span>
                <p className="text-[11px] opacity-75">No 'Bhoomi Hina' or tenant claims, zero bank hypothecation or court stays.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Collector NA Order</span>
                <p className="text-[11px] opacity-75">Permanent residential Non-Agricultural sanction issued under Maharashtra Land Revenue Code.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">Cadastral Mojni Map</span>
                <p className="text-[11px] opacity-75">Certified boundary map stamped by Land Records Inspector with fixed corner coordinates.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold block text-sm">30-Year Search Certificate</span>
                <p className="text-[11px] opacity-75">Issued by senior revenue advocate with zero-encumbrance certificate.</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-xs block">Certified Revenue Docket (7/12 + NA Order + Mojni Map)</span>
                  <span className="text-[11px] opacity-60">Complete government revenue document package</span>
                </div>
              </div>
              <button
                onClick={() => alert('Revenue Docket requested. Dispatching download link.')}
                className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Revenue Docket</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: INFRASTRUCTURE */}
        {activeTab === 'INFRASTRUCTURE' && (
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#08120B] border-white/10' : 'bg-white border-emerald-200 shadow-md'}`}>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Gated Community Development</span>
              <h3 className="text-xl font-serif font-bold text-current mt-1">Plug-and-Play Infrastructure Ready at Boundary</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
                  <Droplets className="w-4 h-4" />
                  <span>Potable Water Line</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">At Plot Edge</div>
                <p className="opacity-75">Dedicated underground water pipeline connection with pressure meter chamber installed.</p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
                  <Zap className="w-4 h-4" />
                  <span>Underground Power</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">MSEDCL Ready</div>
                <p className="opacity-75">Underground high-tension feeder cable with distribution pillar box right next to plot curb.</p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                  <Compass className="w-4 h-4" />
                  <span>Internal Roads & Lighting</span>
                </div>
                <div className="text-2xl font-bold font-mono text-current">40 ft Wide</div>
                <p className="opacity-75">Tree-lined asphalt boulevard with storm water drainage conduits and solar LED streetlights.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div className={`max-w-4xl mx-auto rounded-3xl border p-3 sm:p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-4 ${
          isDark ? 'bg-[#08120B]/95 border-emerald-500/30 text-white' : 'bg-white/95 border-emerald-200 text-slate-900'
        }`}>
          <div className="truncate">
            <h4 className="font-serif font-bold text-sm truncate">{property.title}</h4>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs text-emerald-400 font-bold">{formatINR(propertyPrice)}</span>
              <span className="text-[10px] opacity-60">• {plotArea} sq.ft ({gunthas} Gunthas) • FSI {fsi}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowVisitModal(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Peg Marking Visit</span>
            </button>
            <button
              onClick={() => setShowMakeOffer(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform"
            >
              Make Plot Offer
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
