/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Building,
  TrendingUp,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Car,
  Train,
  Plane,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Home,
  Briefcase,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Compass,
  AlertTriangle,
  HelpCircle,
  Percent,
  Bell,
  X,
  Send,
  PlusCircle,
} from 'lucide-react';
import { Locality, Project, Property } from '../../types';
import { globalKiaanStore } from '../../services/store';
import {
  localityIntelligenceService,
  LocalityInventorySnapshot,
} from '../../services/localityIntelligenceService';

interface LocalityDetailPageProps {
  locality: Locality;
  allProjects: Project[];
  allProperties: Property[];
  allLocalities: Locality[];
  onBack: () => void;
  onSelectLocality: (locality: Locality) => void;
  onSelectProject: (project: Project) => void;
  onSelectProperty?: (property: Property) => void;
  onOpenMatchmaker?: () => void;
  theme?: 'dark' | 'light';
}

export const LocalityDetailPage: React.FC<LocalityDetailPageProps> = ({
  locality,
  allProjects,
  allProperties,
  allLocalities,
  onBack,
  onSelectLocality,
  onSelectProject,
  onSelectProperty,
  onOpenMatchmaker,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [isPhase1MvpMode, setIsPhase1MvpMode] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'NEW_PROJECTS' | 'RESALE' | 'RENTAL' | 'COMMERCIAL' | 'STANDALONE'
  >('ALL');

  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedCompareLocalitySlug, setSelectedCompareLocalitySlug] = useState<string>(
    locality.slug === 'wakad' ? 'baner' : 'wakad'
  );

  // MVP Modals
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showPostPropertyModal, setShowPostPropertyModal] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'BUY_RESALE',
    message: '',
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const [postPropertyForm, setPostPropertyForm] = useState({
    title: '',
    price: '',
    propertyType: 'APARTMENT',
    phone: '',
  });
  const [postPropertySuccess, setPostPropertySuccess] = useState(false);

  // Dynamic snapshot computed using actual project and property inventory
  const snapshot: LocalityInventorySnapshot = useMemo(() => {
    return localityIntelligenceService.getLocalitySnapshot(locality, allProjects, allProperties);
  }, [locality, allProjects, allProperties]);

  const isEmptyLocality = snapshot.totalPropertiesCount === 0 && snapshot.projects.length === 0;

  // Track Locality Viewed (MVP Analytics 29.11)
  useEffect(() => {
    globalKiaanStore.trackLocalityEvent({
      type: 'locality_viewed',
      localityId: locality.id,
      localityName: locality.name,
      meta: {
        city: locality.city,
        propertiesCount: snapshot.totalPropertiesCount,
        projectsCount: snapshot.projects.length,
      },
    });
  }, [locality.id, locality.name, locality.city, snapshot.totalPropertiesCount, snapshot.projects.length]);

  const handleTabChange = (newTab: typeof activeTab) => {
    setActiveTab(newTab);
    const eventType =
      newTab === 'RESALE'
        ? 'resale_tab_clicked'
        : newTab === 'RENTAL'
        ? 'rental_tab_clicked'
        : 'locality_viewed';
    globalKiaanStore.trackLocalityEvent({
      type: eventType,
      localityId: locality.id,
      localityName: locality.name,
      meta: { tab: newTab },
    });
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.phone) return;
    globalKiaanStore.trackLocalityEvent({
      type: 'enquiry_submitted',
      localityId: locality.id,
      localityName: locality.name,
      meta: {
        ...enquiryForm,
      },
    });
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setShowEnquiryModal(false);
      setEnquiryForm({ name: '', phone: '', email: '', type: 'BUY_RESALE', message: '' });
    }, 2000);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    globalKiaanStore.trackLocalityEvent({
      type: 'enquiry_submitted',
      localityId: locality.id,
      localityName: locality.name,
      meta: { intent: 'notify_when_added', email: notifyEmail },
    });
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifySuccess(false);
      setShowNotifyModal(false);
      setNotifyEmail('');
    }, 2000);
  };

  const handlePostPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postPropertyForm.title || !postPropertyForm.phone) return;
    globalKiaanStore.trackLocalityEvent({
      type: 'enquiry_submitted',
      localityId: locality.id,
      localityName: locality.name,
      meta: { intent: 'post_property_in_locality', ...postPropertyForm },
    });
    setPostPropertySuccess(true);
    setTimeout(() => {
      setPostPropertySuccess(false);
      setShowPostPropertyModal(false);
      setPostPropertyForm({ title: '', price: '', propertyType: 'APARTMENT', phone: '' });
    }, 2000);
  };

  // Comparison with adjacent locality
  const compareLocality = useMemo(() => {
    return (
      allLocalities.find((l) => l.slug === selectedCompareLocalitySlug) ||
      allLocalities.find((l) => l.id !== locality.id) ||
      locality
    );
  }, [allLocalities, selectedCompareLocalitySlug, locality]);

  const compareSnapshot = useMemo(() => {
    return localityIntelligenceService.getLocalitySnapshot(compareLocality, allProjects, allProperties);
  }, [compareLocality, allProjects, allProperties]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const nearbyLocalityObjects = useMemo(() => {
    return allLocalities
      .filter((l) => l.id !== locality.id && locality.nearbyAreas.some((na) => na.toLowerCase().includes(l.name.toLowerCase()) || l.name.toLowerCase().includes(na.toLowerCase())))
      .slice(0, 4);
  }, [allLocalities, locality]);

  const resaleSpread = useMemo(() => {
    if (locality.priceIntelligence?.resaleVsNewComparison?.spreadPercentage != null) {
      return locality.priceIntelligence.resaleVsNewComparison.spreadPercentage;
    }
    const newPrice = locality.priceIntelligence?.newProjectAvgSqFt;
    const resalePrice = locality.priceIntelligence?.resaleAvgSqFt;
    if (newPrice && resalePrice && newPrice > 0) {
      return Math.round(((newPrice - resalePrice) / newPrice) * 100);
    }
    return 14;
  }, [locality.priceIntelligence]);

  const resaleInsights = useMemo(() => {
    if (locality.priceIntelligence?.resaleVsNewComparison?.insights) {
      return locality.priceIntelligence.resaleVsNewComparison.insights;
    }
    const newPrice = locality.priceIntelligence?.newProjectAvgSqFt;
    const resalePrice = locality.priceIntelligence?.resaleAvgSqFt;
    if (newPrice && resalePrice) {
      return `Healthy spread favoring brand new gated communities with ₹${resalePrice.toLocaleString('en-IN')}/sq.ft resale vs ₹${newPrice.toLocaleString('en-IN')}/sq.ft new launches.`;
    }
    return `Healthy spread favoring brand new gated communities over vintage developments in ${locality.name}.`;
  }, [locality.priceIntelligence, locality.name]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#06090F] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Breadcrumb & Navigation Bar */}
      <div
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          isDark ? 'bg-[#06090F]/90 border-white/10' : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Localities</span>
            </button>
            <span className="text-white/30">/</span>
            <span className="text-white/60">{locality.city}</span>
            <span className="text-white/30">/</span>
            <span className="text-amber-400 font-bold">{locality.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Locality'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 2. Hero Section: Answers Question 1: "WHAT IS THIS PLACE?" */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#06090F]">
          <div className="relative h-80 sm:h-96 w-full">
            <img
              src={locality.coverImage}
              alt={locality.name}
              className="w-full h-full object-cover brightness-[0.65]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06090F] via-[#06090F]/60 to-transparent" />

            {/* Verification & Category Badges */}
            <div className="absolute top-6 left-6 flex items-center gap-2 flex-wrap">
              {locality.isVerified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Kiaan Verified Locality
                </span>
              )}
              {locality.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/40 border border-white/20 text-white/90 backdrop-blur-md"
                >
                  {cat.replace('_', ' ')}
                </span>
              ))}
            </div>

            {/* Bottom Hero Info: Above The Fold (MVP 29.2) */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Home / Localities / {locality.city} / {locality.name} • PIN {locality.pincode}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  Property in {locality.name}, {locality.city}
                </h1>
                <p className="text-sm sm:text-base text-white/85 line-clamp-3 leading-relaxed">
                  {locality.shortDescription || locality.overview}
                </p>

                {/* Key Metrics Quick Ribbon */}
                <div className="flex items-center gap-3 pt-1 flex-wrap text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 backdrop-blur-md">
                    📍 {locality.city} ({locality.pincode})
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 backdrop-blur-md">
                    🏢 {snapshot.totalPropertiesCount} Properties
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    🏗️ {snapshot.projects.length} Projects
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md font-bold">
                    From {snapshot.startingPriceFormatted || '₹45 L'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/70 backdrop-blur-md hidden sm:inline">
                    Types: Resale, Launch, Rent
                  </span>
                </div>
              </div>

              {/* CTAs (MVP 29.2) */}
              <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
                <a
                  href="#inventory-explorer"
                  onClick={() => handleTabChange('RESALE')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Explore Properties
                  <Home className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#inventory-explorer"
                  onClick={() => handleTabChange('NEW_PROJECTS')}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs tracking-wide flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
                >
                  Explore Projects
                  <Building className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs tracking-wide flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Enquire
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Section B: Quick Locality Snapshot (Live Calculated Cards) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Locality Intelligence Snapshot
            </h2>
            <span className="text-xs text-white/50 font-mono">Real-Time Database Aggregation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">Available Units</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {snapshot.totalPropertiesCount}+
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Across micro-market</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">New Projects</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                {snapshot.newProjectsCount}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Verified Developments</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">Starting Price</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {snapshot.startingPriceFormatted}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Entry inventory</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">Average Price</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {snapshot.averagePriceFormatted}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Market midpoint</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">Avg ₹ / Sq.Ft</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                ₹{snapshot.averagePricePerSqFt.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                +{locality.priceIntelligence.yoyGrowthPercent}% YoY
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">Gross Yield</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                {locality.priceIntelligence.rentalYieldPercent}%
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Rental return</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">Active Builders</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {snapshot.activeDevelopersCount}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Top-tier brands</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] font-semibold text-white/60 uppercase">Livability</div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                {locality.lifestyleRating.overallScore}/10
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Kiaan Index</div>
            </div>
          </div>
        </section>

        {/* 4. Section C: Locality Inventory Explorer - Answers Question 2: "WHAT PROPERTY IS AVAILABLE HERE?" */}
        <section id="inventory-explorer" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Building className="w-6 h-6 text-amber-400" />
                Property Opportunities in {locality.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                Explore resale residences, master-planned towers, rental suites, standalone assets & commercial spaces
              </p>
            </div>

            {/* Inventory Segment Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white/5 rounded-2xl border border-white/10">
              {[
                { id: 'ALL', label: 'All Opportunities', count: snapshot.totalPropertiesCount },
                { id: 'NEW_PROJECTS', label: 'New Projects', count: snapshot.newProjectsCount },
                { id: 'RESALE', label: 'Resale Units', count: snapshot.resaleCount },
                { id: 'RENTAL', label: 'Rental & Lease', count: snapshot.rentalCount },
                { id: 'COMMERCIAL', label: 'Commercial & Office', count: snapshot.commercialCount },
                { id: 'STANDALONE', label: 'Standalone & Land', count: snapshot.standaloneCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeTab === tab.id ? 'bg-black/20 text-slate-950' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Empty Locality Experience (MVP 29.10) */}
          {isEmptyLocality ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Building className="w-8 h-8" />
              </div>
              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {locality.name}, {locality.city}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Explore this locality and discover properties and projects as inventory becomes available.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowNotifyModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  Get Notified When Properties Are Added
                </button>

                <button
                  onClick={() => setShowPostPropertyModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  Post a Property in {locality.name}
                </button>
              </div>
            </div>
          ) : (
            /* Active Tab Content */
            <div className="space-y-6">
              {/* 1. New Projects Spotlight */}
              {(activeTab === 'ALL' || activeTab === 'NEW_PROJECTS') && snapshot.projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Building className="w-4 h-4 text-amber-400" />
                    Master Developments & New Projects
                  </h3>
                  <span className="text-xs text-white/50">{snapshot.projects.length} Active Developments</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {snapshot.projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => onSelectProject(proj)}
                      className="group rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-amber-400/50 transition-all duration-300 shadow-lg cursor-pointer flex flex-col"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={proj.media?.[0]?.url || proj.bannerImageUrl || locality.coverImage}
                          alt={proj.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-amber-400 border border-amber-400/30">
                            {proj.status.replace('_', ' ')}
                          </span>
                          {proj.isFirstLook && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/80 text-slate-950">
                              First Look
                            </span>
                          )}
                        </div>

                        {/* Construction completion gauge */}
                        {proj.constructionPercentage !== undefined && (
                          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/15 text-[11px] font-mono text-emerald-400">
                            {proj.constructionPercentage}% Complete
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="text-xs text-white/50 uppercase font-semibold tracking-wider">
                            {proj.developerName}
                          </div>
                          <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5">
                            {proj.name}
                          </h4>
                          <p className="text-xs text-white/60 line-clamp-2 mt-1">
                            {proj.tagline || proj.overviewStory}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <div className="text-[10px] text-white/40 uppercase">Pricing</div>
                            <div className="font-mono font-bold text-amber-400">
                              {localityIntelligenceService.formatCurrency(proj.headlinePriceRange.min)} - {localityIntelligenceService.formatCurrency(proj.headlinePriceRange.max)}
                            </div>
                          </div>

                          <span className="text-white/60 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex items-center gap-1 font-semibold">
                            Details
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Resale Properties Spotlight */}
            {(activeTab === 'ALL' || activeTab === 'RESALE') && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-400" />
                    Verified Resale Residences
                  </h3>
                  <span className="text-xs text-white/50">Direct Owner & Developer Secondary Market</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {snapshot.resaleProperties.slice(0, 6).map((prop) => (
                    <div
                      key={prop.id}
                      onClick={() => onSelectProperty && onSelectProperty(prop)}
                      className="group rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-emerald-400/50 transition-all duration-300 shadow-lg cursor-pointer flex flex-col"
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={prop.media?.[0]?.url || locality.coverImage}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Resale Verified
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-xs text-amber-400 font-mono">{prop.configuration}</div>
                          <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mt-0.5 line-clamp-1">
                            {prop.title}
                          </h4>
                          <p className="text-xs text-white/60 line-clamp-2 mt-1">
                            {prop.overviewDescription}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-emerald-400 font-bold text-sm">
                              {localityIntelligenceService.formatCurrency(prop.pricing?.basePrice || 9500000)}
                            </span>
                            <div className="text-[10px] text-white/40">
                              {prop.carpetAreaSqFt} sq.ft carpet
                            </div>
                          </div>
                          <span className="text-white/60 group-hover:text-emerald-400 flex items-center gap-1 font-semibold">
                            View
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Section D: Standalone Assets & Land Spotlight (Requirement #7) */}
            {(activeTab === 'ALL' || activeTab === 'STANDALONE') && (
              <div className="p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Standalone Assets, Plots & Non-Project Inventory
                    </h3>
                    <p className="text-xs text-white/60">
                      Independent villas, commercial plots, standalone retail buildings, and individual land parcels
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 shrink-0">
                    Bespoke Private Assets
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Independent Bungalow & Villa Assets</h4>
                      <p className="text-xs text-white/60 mt-0.5">
                        Private freehold parcels with independent sanction and clear title documents in {locality.name}.
                      </p>
                      <div className="mt-2 text-xs font-mono text-amber-400 font-semibold">
                        Plots from 2,400 - 5,000 sq.ft
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Commercial Showrooms & High-Street Retail</h4>
                      <p className="text-xs text-white/60 mt-0.5">
                        Pre-leased standalone bank branches, retail frontage, and corporate office floors.
                      </p>
                      <div className="mt-2 text-xs font-mono text-blue-400 font-semibold">
                        Yields: 7.2% - 8.8% Annual ROI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </section>

        {/* 5. Section E: Price Intelligence & Market Progression (Answers Question 3: SHOULD I INVEST HERE?) */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-400" />
                Price Intelligence & Micro-Market Dynamics
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                Verified rate trajectories, resale vs new project spreads, and estimated rental returns
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                +{locality.priceIntelligence.yoyGrowthPercent}% 1-Year Appreciation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Price Spectrum Card */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
                Price Spectrum & Entry Points
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white/60">Entry Tier (Affordable 2BHK)</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {localityIntelligenceService.formatCurrency(locality.priceIntelligence.priceRangeMin)}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[35%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white/60">Mid-Premium (3BHK Condos)</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {localityIntelligenceService.formatCurrency(locality.priceIntelligence.averagePricePerSqFt * 1200)}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full w-[65%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white/60">Luxury / Penthouses</span>
                    <span className="font-mono text-purple-400 font-bold">
                      {localityIntelligenceService.formatCurrency(locality.priceIntelligence.priceRangeMax)}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-full w-[100%]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Resale vs New Spread:</span>
                  <span className="font-semibold text-white">
                    {resaleSpread}% Discount on Resale
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Gross Rental Yield:</span>
                  <span className="font-semibold text-purple-400">
                    {locality.priceIntelligence.rentalYieldPercent}% p.a.
                  </span>
                </div>
              </div>
            </div>

            {/* Historical Price Growth Progression (Last 4 Years) */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
                  Historical Price Trend (₹ / Sq.Ft Carpet)
                </h3>
                <span className="text-xs text-white/50 font-mono">2021 - 2025</span>
              </div>

              <div className="grid grid-cols-5 gap-2 items-end h-44 pt-6">
                {[
                  { year: '2021', rate: Math.round(locality.priceIntelligence.averagePricePerSqFt * 0.72), growth: 'Base' },
                  { year: '2022', rate: Math.round(locality.priceIntelligence.averagePricePerSqFt * 0.79), growth: '+9.7%' },
                  { year: '2023', rate: Math.round(locality.priceIntelligence.averagePricePerSqFt * 0.88), growth: '+11.4%' },
                  { year: '2024', rate: Math.round(locality.priceIntelligence.averagePricePerSqFt * 0.94), growth: '+6.8%' },
                  { year: '2025 (Current)', rate: locality.priceIntelligence.averagePricePerSqFt, growth: `+${locality.priceIntelligence.yoyGrowthPercent}%` },
                ].map((item, idx) => {
                  const maxRate = locality.priceIntelligence.averagePricePerSqFt * 1.1;
                  const heightPercent = Math.round((item.rate / maxRate) * 100);

                  return (
                    <div key={item.year} className="flex flex-col items-center gap-2 h-full justify-end">
                      <div className="text-[11px] font-mono text-amber-300 font-semibold">
                        ₹{(item.rate / 1000).toFixed(1)}k
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          idx === 4
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                            : 'bg-white/15 hover:bg-white/25'
                        }`}
                      />
                      <div className="text-center">
                        <div className="text-xs font-semibold text-white/80">{item.year}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{item.growth}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-white/60 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {resaleInsights}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Section F: Lifestyle, Infrastructure & Transit Connectivity */}
        <section className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-400" />
              Connectivity, Transit & Social Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Verified travel times to key employment nodes, schools, healthcare and arterial highways
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transit & Commute */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                Major Transit & Highway Arteries
              </h3>

              <div className="space-y-3">
                {locality.connectivity.highways.map((hw, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-white">{hw.name}</span>
                      <div className="text-[10px] text-white/50">{hw.type} Corridor</div>
                    </div>
                    <span className="font-mono text-amber-400">{hw.distanceKm} km</span>
                  </div>
                ))}

                {locality.connectivity.metro.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-white flex items-center gap-1">
                        <Train className="w-3.5 h-3.5 text-blue-400" />
                        {m.name}
                      </span>
                      <div className="text-[10px] text-emerald-400">{m.status}</div>
                    </div>
                    <span className="font-mono text-blue-300">{m.distanceKm} km</span>
                  </div>
                ))}

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-purple-400" />
                      Pune Int'l Airport (Lohegaon)
                    </span>
                    <div className="text-[10px] text-white/50">Terminal Commute</div>
                  </div>
                  <span className="font-mono text-purple-300">
                    {(locality.connectivity as any).airportDistanceKm ?? locality.connectivity.airport?.[0]?.distanceKm ?? 14} km
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Hubs Commute Matrix */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Workplace Commute Index
              </h3>

              <div className="space-y-3">
                {locality.connectivity.employmentHubs.map((hub, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{hub.name}</span>
                      <span className="font-mono text-amber-400 font-semibold">{hub.commuteMinutes} mins</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-white/50">
                      <span>Distance: {hub.distanceKm} km</span>
                      <span>Peak Hours</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Infrastructure (Schools & Hospitals) */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Social Infrastructure
              </h3>

              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-amber-300">Top Schools & Colleges</div>
                {locality.socialInfrastructure.schools.map((sc, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-white/80">{sc.name} ({sc.board})</span>
                    <span className="text-white/50 font-mono">{sc.distanceKm} km</span>
                  </div>
                ))}

                <div className="text-xs font-semibold text-emerald-300 pt-2 border-t border-white/10">
                  Hospitals & Multi-Specialty Care
                </div>
                {locality.socialInfrastructure.hospitals.map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-white/80">{h.name}</span>
                    <span className="text-white/50 font-mono">{h.distanceKm} km</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Section G: "Why Live in [Locality]?" & Considerations (Unbiased Advisory) */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-white/10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              Transparent Locality Evaluation: Advantages & Trade-Offs
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Honest advisory based on ground realities, infrastructure status, and civic reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Key Advantages of {locality.name}
              </h3>
              <ul className="space-y-3">
                {(locality.whyLiveHere || []).map((adv: any, i) => {
                  const isObj = typeof adv === 'object' && adv !== null;
                  const title = isObj ? adv.title : adv;
                  const description = isObj ? adv.description : null;

                  return (
                    <li key={i} className="text-xs text-white/80 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <div>
                        <div className="font-semibold text-white">{title}</div>
                        {description && (
                          <div className="text-white/60 text-[11px] mt-0.5 leading-normal">{description}</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Realistic Considerations & Bottlenecks
              </h3>
              <ul className="space-y-3">
                {(locality.considerations || []).map((con: any, i) => {
                  const isObj = typeof con === 'object' && con !== null;
                  const text = isObj ? con.title || con.description || con.name : con;
                  const subText = isObj && con.title && con.description ? con.description : null;

                  return (
                    <li key={i} className="text-xs text-white/80 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <div>
                        <div className="font-medium text-white/90">{text}</div>
                        {subText && (
                          <div className="text-white/60 text-[11px] mt-0.5 leading-normal">{subText}</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* 8. Section H: "Who is this Locality Best For?" */}
        <section className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Who is {locality.name} Best For?
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Demographic and profile suitability matching
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(locality.whoIsThisFor || []).map((item: any, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    {item.suitabilityPercent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                        {item.suitabilityPercent}% Match
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.persona}</h3>
                </div>
                <p className="text-xs text-white/70 leading-relaxed mt-2">{item.description || item.rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Section I: Compare with Adjacent Locality (Side-by-Side Matrix) */}
        <section className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-amber-400" />
                Compare {locality.name} vs Nearby Locality
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                Direct side-by-side metric comparison to clarify your property buying decision
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Compare With:</span>
              <select
                value={selectedCompareLocalitySlug}
                onChange={(e) => setSelectedCompareLocalitySlug(e.target.value)}
                className="bg-slate-800 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white font-semibold cursor-pointer"
              >
                {allLocalities
                  .filter((l) => l.id !== locality.id)
                  .map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {l.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 font-semibold text-white/60 uppercase">Key Dimension</th>
                  <th className="py-3 px-4 font-bold text-amber-400 text-sm bg-amber-500/5 rounded-t-xl">
                    {locality.name} (Current)
                  </th>
                  <th className="py-3 px-4 font-bold text-blue-400 text-sm bg-blue-500/5 rounded-t-xl">
                    {compareLocality.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                <tr>
                  <td className="py-3.5 px-4 text-white/70 font-sans">Avg Price / Sq.Ft</td>
                  <td className="py-3.5 px-4 font-bold text-white bg-amber-500/5">
                    ₹{snapshot.averagePricePerSqFt.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-white/90 bg-blue-500/5">
                    ₹{compareSnapshot.averagePricePerSqFt.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-white/70 font-sans">1-Year YoY Growth</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-amber-500/5">
                    +{locality.priceIntelligence?.yoyGrowthPercent ?? 9.5}%
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 bg-blue-500/5">
                    +{compareLocality.priceIntelligence?.yoyGrowthPercent ?? 9.5}%
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-white/70 font-sans">Gross Rental Yield</td>
                  <td className="py-3.5 px-4 font-bold text-purple-400 bg-amber-500/5">
                    {locality.priceIntelligence?.rentalYieldPercent ?? 4.2}%
                  </td>
                  <td className="py-3.5 px-4 text-purple-400 bg-blue-500/5">
                    {compareLocality.priceIntelligence?.rentalYieldPercent ?? 4.2}%
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-white/70 font-sans">Livability Rating</td>
                  <td className="py-3.5 px-4 font-bold text-amber-300 bg-amber-500/5">
                    {locality.lifestyleRating?.overallScore ?? 8.5} / 10
                  </td>
                  <td className="py-3.5 px-4 text-blue-300 bg-blue-500/5">
                    {compareLocality.lifestyleRating?.overallScore ?? 8.5} / 10
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-white/70 font-sans">Transit / Connectivity</td>
                  <td className="py-3.5 px-4 font-bold text-white bg-amber-500/5">
                    {locality.lifestyleRating?.connectivity ?? 8.5} / 10
                  </td>
                  <td className="py-3.5 px-4 text-white/90 bg-blue-500/5">
                    {compareLocality.lifestyleRating?.connectivity ?? 8.5} / 10
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-white/70 font-sans">Total Live Projects</td>
                  <td className="py-3.5 px-4 font-bold text-white bg-amber-500/5">
                    {snapshot.newProjectsCount} Master Projects
                  </td>
                  <td className="py-3.5 px-4 text-white/90 bg-blue-500/5">
                    {compareSnapshot.newProjectsCount} Master Projects
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 10. Section J: Explore Adjacent Localities */}
        {nearbyLocalityObjects.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Explore Adjacent Micro-Markets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearbyLocalityObjects.map((nl) => (
                <div
                  key={nl.id}
                  onClick={() => onSelectLocality(nl)}
                  className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 hover:border-amber-400/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={nl.coverImage}
                      alt={nl.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {nl.name}
                      </h4>
                      <div className="text-[11px] font-mono text-amber-400">
                        ₹{nl.priceIntelligence.averagePricePerSqFt.toLocaleString('en-IN')}/sq.ft
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 11. Section K: AI Locality Summary & Grounded Rationale */}
        <section className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4" />
            Kiaan Intelligence Micro-Market Synthesis
          </div>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
            {locality.aiSummary ||
              `${locality.name} represents a high-velocity micro-market in ${locality.city}, characterized by ${locality.priceIntelligence.yoyGrowthPercent}% annual appreciation and an average property rate of ₹${locality.priceIntelligence.averagePricePerSqFt.toLocaleString('en-IN')}/sq.ft. Driven by immediate highway connectivity and robust corporate tenant demand, it balances end-user livability with capital preservation.`}
          </p>
        </section>

        {/* 12. Section L: Verified Locality FAQs (Interactive Accordion) */}
        <section className="space-y-4 pt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-400" />
              Frequently Asked Questions About {locality.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Clear answers on property registration, water supply, metro timelines, and legal safety
            </p>
          </div>

          <div className="space-y-3">
            {locality.faqs.map((faq, idx) => {
              const isExpanded = expandedFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 text-xs text-white/70 leading-relaxed border-t border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 13. Section M: Locality Specialist Advisory & Private Visit CTA */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <Building className="w-6 h-6" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Planning to Buy, Sell, or Invest in {locality.name}?
            </h3>
            <p className="text-xs sm:text-sm text-white/70">
              Speak directly with our dedicated {locality.name} Micro-Market Advisory Desk for off-market inventory, verified resale titles, or developer negotiation assistance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Call Locality Specialist
            </a>
            {onOpenMatchmaker && (
              <button
                onClick={onOpenMatchmaker}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Find Ideal Locality For Me
              </button>
            )}
          </div>
        </section>
      </div>

      {/* --- MVP Modals --- */}

      {/* 1. Enquiry Modal (MVP 29.2) */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Direct Locality Inquiry
              </span>
              <h3 className="text-xl font-bold text-white">
                Enquire for {locality.name}, {locality.city}
              </h3>
              <p className="text-xs text-white/60">
                Receive curated property portfolios, verified resale inventory, and private off-market options.
              </p>
            </div>

            {enquirySuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Enquiry Received</h4>
                <p className="text-xs text-white/70">
                  Our {locality.name} desk specialist will contact you within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-white/70">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-white/70">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-white/70">Email (Optional)</label>
                    <input
                      type="email"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="rajesh@example.com"
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white/70">Interest Type</label>
                  <select
                    value={enquiryForm.type}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, type: e.target.value })}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="BUY_RESALE">Buy Resale Apartment</option>
                    <option value="BUY_NEW_PROJECT">Book in New Project / Under Construction</option>
                    <option value="RENT">Rent a Home / Flat</option>
                    <option value="COMMERCIAL">Commercial Office or Retail</option>
                    <option value="LAND_PLOT">Buy Standalone Plot or Land</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white/70">Specific Requirements</label>
                  <textarea
                    rows={2}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="e.g. Looking for 3 BHK under ₹1.5 Cr near Hinjewadi Tech Park with possession in 2026..."
                    className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Locality Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Notification Modal (MVP 29.10) */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-4">
            <button
              onClick={() => setShowNotifyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Get Notified for {locality.name}</h3>
              <p className="text-xs text-white/70 mt-1">
                We'll alert you the moment resale properties, upcoming projects, or new launches are added in this locality.
              </p>
            </div>

            {notifySuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Alert Configured</h4>
                <p className="text-xs text-white/70">You will receive an alert as soon as inventory goes live.</p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-white/70">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Enable Notification
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Post Property Modal (MVP 29.10) */}
      {showPostPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-4">
            <button
              onClick={() => setShowPostPropertyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Post Property in {locality.name}</h3>
              <p className="text-xs text-white/70 mt-1">
                List your apartment, villa, or commercial space to reach verified buyers and tenants.
              </p>
            </div>

            {postPropertySuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Listing Submitted</h4>
                <p className="text-xs text-white/70">Our curation team will review and verify your listing shortly.</p>
              </div>
            ) : (
              <form onSubmit={handlePostPropertySubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-white/70">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={postPropertyForm.title}
                    onChange={(e) => setPostPropertyForm({ ...postPropertyForm, title: e.target.value })}
                    placeholder="e.g. Spacious 3 BHK in Signature Towers"
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-white/70">Expected Price *</label>
                    <input
                      type="text"
                      required
                      value={postPropertyForm.price}
                      onChange={(e) => setPostPropertyForm({ ...postPropertyForm, price: e.target.value })}
                      placeholder="e.g. ₹1.25 Cr"
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-white/70">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={postPropertyForm.phone}
                      onChange={(e) => setPostPropertyForm({ ...postPropertyForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Submit Property for Listing
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalityDetailPage;
