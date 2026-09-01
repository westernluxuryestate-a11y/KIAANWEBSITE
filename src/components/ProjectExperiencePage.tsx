/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import {
  Building2,
  Layers,
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
  HardHat,
  BadgeCheck,
  Check,
} from 'lucide-react';
import { formatINR, calculateHomeLoanEMI, calculateStatutoryTaxShield } from '../services/calculatorEngine';
import { ReraBadge } from './ReraBadge';
import { SiteVisitModal } from './SiteVisitModal';
import { MakeOfferModal } from './MakeOfferModal';
import { ShareAssetModal } from './ShareAssetModal';
import { BeforeYouBookModal } from './BeforeYouBookModal';
import { TrustCenterSection } from './TrustCenterSection';
import { CustomerReviewsSection } from './CustomerReviewsSection';
import { GroundedFaqEngine } from './GroundedFaqEngine';

interface ProjectExperiencePageProps {
  project: Project;
  theme?: 'dark' | 'light';
  onBackToDiscovery: () => void;
  onSelectUnitForExperience: (unit: Unit) => void;
  onOpenDigitalTwin: (project: Project, unitId?: string) => void;
  onAddToComparison: (unit: Unit) => void;
}

export const ProjectExperiencePage: React.FC<ProjectExperiencePageProps> = ({
  project,
  theme = 'dark',
  onBackToDiscovery,
  onSelectUnitForExperience,
  onOpenDigitalTwin,
  onAddToComparison,
}) => {
  const isDark = theme === 'dark';

  // Sticky Navigation Section State
  const [activeNav, setActiveNav] = useState<
    'overview' | 'gallery' | 'towers' | 'plans' | 'inventory' | 'amenities' | 'location' | 'price' | 'rera'
  >('overview');

  // Filter for Live Inventory Explorer
  const [selectedTowerId, setSelectedTowerId] = useState<string>(project.towers?.[0]?.id || 'all');
  const [selectedConfigFilter, setSelectedConfigFilter] = useState<string>('ALL');

  // Modals State
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBeforeYouBookModal, setShowBeforeYouBookModal] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState(false);

  // Flatten units
  const allUnits: Unit[] = project.towers?.flatMap((t) => t.floors?.flatMap((f) => f.units)) || [];

  // Filtered units
  const filteredUnits = allUnits.filter((u) => {
    if (selectedTowerId !== 'all' && u.towerId !== selectedTowerId) return false;
    if (selectedConfigFilter !== 'ALL' && !u.configuration.includes(selectedConfigFilter)) return false;
    return true;
  });

  const scrollToSection = (id: string, navKey: any) => {
    setActiveNav(navKey);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Canonical & Share metadata
  const canonicalUrl = `https://kiaanproperties.com/projects/${project.slug || project.id}`;

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-[#070A0F] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* ========================================================================= */}
      {/* 1. TOP PERMANENT URL BAR & CANONICAL SEO HEADER                            */}
      {/* ========================================================================= */}
      <div className={`border-b text-xs py-2 px-4 sm:px-8 flex items-center justify-between ${isDark ? 'bg-[#05070B] border-white/10 text-white/50' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
        <div className="flex items-center gap-2 font-mono truncate">
          <span className="text-amber-500 font-bold">CANONICAL:</span>
          <span className="truncate">/projects/{project.slug || `${project.name.toLowerCase().replace(/\s+/g, '-')}-${project.location.microMarket.toLowerCase()}`}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">MahaRERA: {project.reraRecord?.registrationNumber}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(canonicalUrl);
              alert('Canonical Project URL copied to clipboard!');
            }}
            className="text-amber-500 font-bold hover:underline cursor-pointer"
          >
            Copy URL
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STICKY PROJECT NAVIGATION                                              */}
      {/* ========================================================================= */}
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
              <h1 className="font-serif font-bold text-base sm:text-lg truncate">{project.name}</h1>
              <p className={`text-[11px] truncate ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {project.location.microMarket}, {project.location.city} • {project.headlinePriceRange.displayString}
              </p>
            </div>
          </div>

          {/* Sticky Nav Buttons */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {[
              { id: 'sec-overview', label: 'Overview', key: 'overview' },
              { id: 'sec-gallery', label: 'Gallery', key: 'gallery' },
              { id: 'sec-towers', label: 'Towers', key: 'towers' },
              { id: 'sec-plans', label: 'Plans', key: 'plans' },
              { id: 'sec-inventory', label: 'Inventory', key: 'inventory' },
              { id: 'sec-amenities', label: 'Amenities', key: 'amenities' },
              { id: 'sec-location', label: 'Location', key: 'location' },
              { id: 'sec-price', label: 'Price', key: 'price' },
              { id: 'sec-rera', label: 'RERA', key: 'rera' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => scrollToSection(tab.id, tab.key)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeNav === tab.key
                    ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => onOpenDigitalTwin(project)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer flex-shrink-0"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>3D Twin</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN PROJECT BODY CONTAINER                                            */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        {/* ========================================================================= */}
        {/* SECTION: HERO & PROJECT IDENTITY                                          */}
        {/* ========================================================================= */}
        <section id="sec-overview" className="space-y-6">
          <div className="relative rounded-3xl overflow-hidden border border-current/10 aspect-[16/9] lg:aspect-[21/9] bg-black group shadow-2xl">
            <img
              src={project.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85'}
              alt={project.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{project.projectType.replace('_', ' ')}</span>
              </span>
              <ReraBadge reraRecord={project.reraRecord} />
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-xs border border-white/20">
                Possession: {project.possessionDate}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  By {project.developerName}
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                  {project.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2">
                  {project.overviewStory}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/70">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.location.address}</span>
                  </span>
                  <span>•</span>
                  <span>{project.totalLandAcres} Acres</span>
                  <span>•</span>
                  <span>{project.totalTowersCount} Towers</span>
                </div>
              </div>

              <div className="bg-black/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/20 text-white space-y-1 flex-shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">Pricing Range</span>
                <div className="text-2xl font-serif font-bold text-amber-400 font-mono">
                  {project.headlinePriceRange.displayString}
                </div>
                <span className="text-[10px] opacity-70 block">Configurations: {project.configurations.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Snapshot Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-[10px] uppercase tracking-wider opacity-60 block">RERA Status</span>
              <span className="text-sm sm:text-base font-bold text-emerald-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Active</span>
              </span>
            </div>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-[10px] uppercase tracking-wider opacity-60 block">Carpet Area Range</span>
              <span className="text-sm sm:text-base font-mono font-bold text-current mt-1 block">
                {project.carpetAreaRangeSqFt.min} - {project.carpetAreaRangeSqFt.max} sq.ft
              </span>
            </div>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-[10px] uppercase tracking-wider opacity-60 block">Spatial Quality Score</span>
              <span className="text-sm sm:text-base font-bold text-amber-500 mt-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>{project.propertyScore.overallScore} / 100</span>
              </span>
            </div>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-[10px] uppercase tracking-wider opacity-60 block">Live Available Units</span>
              <span className="text-sm sm:text-base font-bold text-current mt-1 block">
                {project.availableUnitsCount} of {project.totalUnitsCount} Units
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: AI PROJECT GUIDE                                                 */}
        {/* ========================================================================= */}
        <section className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-gradient-to-r from-amber-500/10 via-[#0B101B] to-[#080C14] border-amber-500/30' : 'bg-gradient-to-r from-amber-50 to-white border-amber-200 shadow-md'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>KIAAN AI PROJECT GUIDE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-current">
                Ask anything about {project.name}
              </h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Kiaan AI has absorbed all MahaRERA filings, architect blueprints, structural reports, and micro-market commute logs for this development.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => alert(`AI Project Guide for ${project.name}: "This project has 100% MahaRERA escrow ring-fenced funds with 80% open landscape and Italian marble finishes."`)}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Audio / Text AI Guide</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: GALLERY & CINEMATIC VIDEO                                        */}
        {/* ========================================================================= */}
        <section id="sec-gallery" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Visual Dossier</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Cinematic Gallery & Drone Elevation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.media?.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`rounded-3xl border overflow-hidden group cursor-pointer relative ${
                  isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={m.url}
                    alt={m.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10">
                    {m.category}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-bold text-xs">{m.title}</p>
                    <p className="text-[10px] opacity-75">{m.caption || 'Verified Architectural Render'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: MASTER PLAN & TOWERS                                             */}
        {/* ========================================================================= */}
        <section id="sec-towers" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Architectural Layout</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Master Plan & Tower Stacks</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 rounded-3xl border overflow-hidden relative group bg-black aspect-[16/10] flex items-center justify-center">
              <img
                src={project.masterPlanUrl || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'}
                alt="Master Plan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-bold">Interactive Master Site Layout ({project.totalLandAcres} Acres)</span>
                <button
                  onClick={() => onOpenDigitalTwin(project)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Explore 3D Master Plan
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-serif font-bold text-lg text-current">Towers in this Development</h3>
              <div className="space-y-3">
                {project.towers?.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-current">{t.name}</h4>
                      <span className="text-xs font-mono text-amber-500 font-bold">
                        {t.availableUnits} / {t.totalUnits} Units Free
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs opacity-70">
                      <span>{t.totalFloors} Floor Levels</span>
                      <span>•</span>
                      <span>Stage: {t.constructionStage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: LIVE INVENTORY & UNIT EXPLORER                                   */}
        {/* ========================================================================= */}
        <section id="sec-inventory" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-current/10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Real-Time Stacking</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Live Inventory & Unit Explorer</h2>
            </div>

            {/* Tower & Config Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedTowerId}
                onChange={(e) => setSelectedTowerId(e.target.value)}
                className={`px-3 py-2 rounded-xl border font-bold ${isDark ? 'bg-[#0B101B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              >
                <option value="all">All Towers</option>
                {project.towers?.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                value={selectedConfigFilter}
                onChange={(e) => setSelectedConfigFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl border font-bold ${isDark ? 'bg-[#0B101B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              >
                <option value="ALL">All Configurations</option>
                {project.configurations.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((u) => (
              <div
                key={u.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all duration-300 ${
                  isDark ? 'bg-[#0B101B] border-white/10 hover:border-amber-500/50' : 'bg-white border-slate-200 shadow-md hover:shadow-xl'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-amber-500">Unit {u.unitNumber}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
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

                  <h3 className="font-serif font-bold text-lg text-current">{u.configuration}</h3>
                  <div className="text-xs opacity-75 space-y-1 font-mono">
                    <div>Carpet: {u.carpetAreaSqFt} sq.ft • Level {u.floorNumber}</div>
                    <div className="text-amber-500 font-bold">{u.facing} Facing • {u.orientationView}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-current/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-60">All-Inclusive Price</span>
                    <span className="font-mono text-base font-bold text-amber-500">
                      {formatINR(u.pricing?.totalEstimatedAcquisitionCost || 0)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectUnitForExperience(u)}
                      className="py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer text-center"
                    >
                      Unit Experience
                    </button>
                    <button
                      onClick={() => onAddToComparison(u)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                        isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      + Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: FLOOR PLANS & SPECIFICATIONS                                     */}
        {/* ========================================================================= */}
        <section id="sec-plans" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Engineered Dimensions</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Floor Plans & Architectural Specifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <h3 className="font-serif font-bold text-lg text-current">Key Finishes & Materials</h3>
              <div className="space-y-3 text-xs">
                {project.specifications?.map((spec, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="font-bold text-amber-500 uppercase text-[10px] tracking-wider">{spec.category}</span>
                    <ul className="list-disc list-inside opacity-75 space-y-0.5">
                      {spec.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <h3 className="font-serif font-bold text-lg text-current">Floor Plan Blueprints</h3>
              <div className="space-y-3">
                {allUnits.slice(0, 3).map((u) => (
                  <div key={u.id} className="p-3.5 rounded-2xl border border-current/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs">{u.configuration} (Carpet: {u.carpetAreaSqFt} sq.ft)</h4>
                      <p className="text-[11px] opacity-60">Deck: 120 sq.ft • 11.5 Ft Ceiling</p>
                    </div>
                    <button
                      onClick={() => onSelectUnitForExperience(u)}
                      className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                    >
                      Inspect Blueprint
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: AMENITIES & LIFESTYLE                                            */}
        {/* ========================================================================= */}
        <section id="sec-amenities" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Clubhouse & Wellness</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Curated Amenities & Lifestyle</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.amenities?.map((amenity) => (
              <div
                key={amenity.id}
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-current">{amenity.name}</h4>
                <p className="text-[11px] opacity-60">{amenity.description || amenity.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: LOCATION & COMMUTE INTELLIGENCE                                  */}
        {/* ========================================================================= */}
        <section id="sec-location" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">Connectivity Hub</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Location & Commute Matrix</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.location?.landmarks?.map((lm, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl border space-y-2 ${
                  isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                    {lm.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-500">
                    {lm.commuteMinutes} Mins
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-current">{lm.name}</h4>
                <p className="text-xs opacity-60">{lm.distanceKm} km from entrance gate</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: PRICE INTELLIGENCE & STATUTORY ESCROW                            */}
        {/* ========================================================================= */}
        <section id="sec-price" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-500">Financial X-Ray</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">Price Intelligence & Tax Shield Analysis</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <span className="text-xs uppercase font-bold text-amber-500">Transparent Pricing Matrix</span>
              <div className="text-3xl font-serif font-bold text-current font-mono">
                {project.headlinePriceRange.displayString}
              </div>
              <p className="text-xs opacity-75">
                Standard baseline pricing includes base rate, covered car park allocation, and club lifetime membership.
              </p>
            </div>

            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <span className="text-xs uppercase font-bold text-emerald-500">Sections 80C & 24(b) Tax Shield</span>
              <p className="text-xs opacity-75 leading-relaxed">
                Eligible for maximum annual tax deduction of ₹1.5 Lakh under Sec 80C (principal) and ₹2.0 Lakh under Sec 24(b) (interest).
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 font-bold">
                Potential Savings: Up to ₹1.05 Lakh / year
              </div>
            </div>

            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <span className="text-xs uppercase font-bold text-blue-400">Capital Growth Forecast</span>
              <p className="text-xs opacity-75 leading-relaxed">
                Projected CAGR of 12.4% over 5 years driven by upcoming metro connectivity and Hinjewadi IT corridor expansion.
              </p>
              <div className="pt-2 text-xs font-mono text-blue-400 font-bold">
                5-Yr Target Value: ~₹2.85 Cr
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: RERA & STATUTORY COMPLIANCE AUDIT                                */}
        {/* ========================================================================= */}
        <section id="sec-rera" className="space-y-6">
          <div className="border-b pb-4 border-current/10">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-500">Legal Transparency</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-current mt-1">MahaRERA Registration & Escrow Dossier</h2>
          </div>

          <div className={`p-6 sm:p-8 rounded-3xl border grid grid-cols-1 lg:grid-cols-3 gap-6 ${isDark ? 'bg-[#0A0E18] border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200 shadow-md'}`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>MahaRERA REGISTRATION NUMBER</span>
              </div>
              <div className="text-xl font-mono font-bold text-current">
                {project.reraRecord?.registrationNumber || 'P52100028492'}
              </div>
              <p className="text-xs opacity-70">Regulatory Authority: {project.reraRecord?.regulatoryAuthority}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold opacity-60 uppercase">Statutory Escrow Ring-Fencing</span>
              <p className="text-xs opacity-80 leading-relaxed">
                70% of buyer collections are statutorily deposited in ICICI Bank Escrow A/C, released solely against architect-certified milestone stages.
              </p>
            </div>

            <div className="flex flex-col justify-between space-y-3">
              <a
                href={project.reraRecord?.officialAuthorityUrl || 'https://maharera.mahaonline.gov.in'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <span>Verify on MahaRERA Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: TRUST CENTER & AUDIT LOGS (Items 116 & 117)                      */}
        {/* ========================================================================= */}
        <section id="sec-trust-center">
          <TrustCenterSection
            theme={theme}
            projectOrPropertyName={project.name}
            onViewReraDossier={() => scrollToSection('sec-rera', 'rera')}
            onRequestAdvocateReport={() => setShowVisitModal(true)}
          />
        </section>

        {/* ========================================================================= */}
        {/* SECTION: AUDITED REVIEWS (Item 118)                                       */}
        {/* ========================================================================= */}
        <section id="sec-reviews">
          <CustomerReviewsSection theme={theme} assetId={project.id} />
        </section>

        {/* ========================================================================= */}
        {/* SECTION: GROUNDED FAQ ENGINE (Item 119)                                   */}
        {/* ========================================================================= */}
        <section id="sec-faq">
          <GroundedFaqEngine
            theme={theme}
            projectOrPropertyName={project.name}
            projectId={project.id}
          />
        </section>
      </main>

      {/* Floating Action Dock */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div className={`max-w-4xl mx-auto rounded-3xl border p-3 sm:p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-4 ${isDark ? 'bg-[#0B101B]/95 border-amber-500/30 text-white' : 'bg-white/95 border-slate-300 text-slate-900'}`}>
          <div className="truncate">
            <h4 className="font-serif font-bold text-sm truncate">{project.name}</h4>
            <span className="text-xs text-amber-500 font-mono font-bold">{project.headlinePriceRange.displayString}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowBeforeYouBookModal(true)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${isDark ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'}`}
              title="Statutory Checklist & Pre-Reservation Audit"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Before You Book</span>
            </button>
            <button
              onClick={() => setShowVisitModal(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
            >
              Book Visit
            </button>
            <button
              onClick={() => setShowOfferModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/25"
            >
              Submit Offer
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showVisitModal && <SiteVisitModal project={project} onClose={() => setShowVisitModal(false)} />}
      {showOfferModal && <MakeOfferModal assetId={project.id} assetTitle={project.name} askingPrice={project.headlinePriceRange.min} theme={theme} onClose={() => setShowOfferModal(false)} />}
      {showShareModal && <ShareAssetModal assetId={project.id} assetTitle={project.name} location={`${project.location.microMarket}, ${project.location.city}`} priceDisplay={project.headlinePriceRange.displayString} theme={theme} onClose={() => setShowShareModal(false)} />}
      {showBeforeYouBookModal && (
        <BeforeYouBookModal
          isOpen={showBeforeYouBookModal}
          onClose={() => setShowBeforeYouBookModal(false)}
          onProceedToReservation={() => {
            setShowBeforeYouBookModal(false);
            setShowOfferModal(true);
          }}
          project={project}
          theme={theme}
        />
      )}
    </div>
  );
};
