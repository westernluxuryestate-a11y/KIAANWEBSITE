/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Building,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Phone,
  Mail,
  Share2,
  Bookmark,
  BookmarkCheck,
  Download,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Globe,
  Clock,
  Send,
  MessageCircle,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { Developer, Project, CurrencyCode } from '../../types';
import { globalKiaanStore } from '../../services/store';
import { DeveloperEnquiryModal } from './DeveloperEnquiryModal';
import { formatINR } from '../../services/calculatorEngine';

const formatCurrencyINR = formatINR;

interface DeveloperProfilePageProps {
  developerSlug?: string;
  developerSlugOrId?: string;
  onBackToDirectory?: () => void;
  onBack?: () => void;
  onSelectProject: (project: Project) => void;
  onSelectDeveloper?: (dev: Developer) => void;
  currency?: CurrencyCode;
  theme?: 'dark' | 'light';
}

export const DeveloperProfilePage: React.FC<DeveloperProfilePageProps> = ({
  developerSlug,
  developerSlugOrId,
  onBackToDirectory,
  onBack,
  onSelectProject,
  onSelectDeveloper,
  currency = 'INR',
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const effectiveSlug = developerSlug || developerSlugOrId || '';
  const handleBack = onBackToDirectory || onBack || (() => {});

  // State
  const [developer, setDeveloper] = useState<Developer | undefined>(() =>
    globalKiaanStore.getDeveloperBySlug(effectiveSlug) || globalKiaanStore.getDeveloperById(effectiveSlug)
  );
  const [activeProjectTab, setActiveProjectTab] = useState<'ONGOING' | 'COMPLETED' | 'UPCOMING' | 'ALL'>('ONGOING');
  const [modalMode, setModalMode] = useState<'ENQUIRY' | 'CALLBACK' | 'BROCHURE' | 'UPDATES' | null>(null);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Subscribe to store updates
  useEffect(() => {
    const unsub = globalKiaanStore.subscribe(() => {
      setDeveloper(
        globalKiaanStore.getDeveloperBySlug(effectiveSlug) || globalKiaanStore.getDeveloperById(effectiveSlug)
      );
    });
    return unsub;
  }, [effectiveSlug]);

  // Load shortlist status from localStorage
  useEffect(() => {
    if (developer) {
      const saved = localStorage.getItem(`kiaan_shortlist_dev_${developer.id}`);
      setIsShortlisted(saved === 'true');
    }
  }, [developer]);

  // Track page view and configure SEO metadata
  useEffect(() => {
    if (!developer) return;

    // Track profile view in store
    globalKiaanStore.trackDeveloperEngagement(developer.id, 'profileViews');

    // Dynamically update document title & meta tags for SEO
    const prevTitle = document.title;
    const pageTitle = `${developer.name} — Real Estate Developer Projects, Reviews & Contact | Kiaan Properties`;
    document.title = pageTitle;

    // Schema Markup (JSON-LD) for Organization / RealEstateAgent
    const scriptId = 'developer-jsonld-schema';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: developer.name,
      legalName: developer.legalName,
      description: developer.shortDescription,
      url: developer.website,
      telephone: developer.phone,
      email: developer.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: developer.headquarters,
        addressCountry: 'IN',
      },
      award: developer.awards?.map((a) => `${a.year}: ${a.title} by ${a.issuer}`),
    };
    scriptEl.textContent = JSON.stringify(schemaData);

    return () => {
      document.title = prevTitle;
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [developer]);

  // Dynamic projects query directly from store
  const projectBreakdown = useMemo(() => {
    if (!developer) return { completed: [], ongoing: [], upcoming: [], allProjects: [] };
    return globalKiaanStore.getProjectsForDeveloper(developer.id);
  }, [developer]);

  if (!developer) {
    return (
      <div className={`min-h-screen py-16 px-4 flex flex-col items-center justify-center text-center ${
        isDark ? 'bg-[#080C14] text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <Building className="w-16 h-16 text-amber-400 mb-4 opacity-60" />
        <h2 className="text-2xl font-bold font-serif mb-2">Developer Record Not Found</h2>
        <p className="text-sm opacity-60 mb-6 max-w-md">
          The requested developer profile &ldquo;{developerSlug}&rdquo; could not be retrieved from the active register.
        </p>
        <button
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Developers Directory</span>
        </button>
      </div>
    );
  }

  // Toggle Shortlist
  const handleToggleShortlist = () => {
    const next = !isShortlisted;
    setIsShortlisted(next);
    localStorage.setItem(`kiaan_shortlist_dev_${developer.id}`, String(next));
    if (next) {
      globalKiaanStore.trackDeveloperEngagement(developer.id, 'shortlistCount');
    }
  };

  // Share profile
  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${developer.name} Projects & Portfolio`,
        text: developer.shortDescription,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    globalKiaanStore.trackDeveloperEngagement(developer.id, 'whatsappClicks');
    const msg = encodeURIComponent(
      `Hello, I am inquiring through Kiaan Properties regarding ${developer.name} projects in Pune.`
    );
    window.open(`https://wa.me/919922000000?text=${msg}`, '_blank');
  };

  // Phone click handler
  const handlePhoneClick = () => {
    globalKiaanStore.trackDeveloperEngagement(developer.id, 'phoneClicks');
    window.location.href = `tel:${developer.phone}`;
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${
      isDark ? 'bg-[#080C14] text-white' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* ============================================================ */}
      {/* BREADCRUMB NAVIGATION */}
      {/* ============================================================ */}
      <div className={`border-b px-4 sm:px-6 lg:px-12 py-3 text-xs ${
        isDark ? 'border-white/10 bg-[#0A0F1A]' : 'border-slate-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={handleBack}
              className="opacity-60 hover:opacity-100 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Developers Directory</span>
            </button>
            <span className="opacity-40">/</span>
            <span className="font-semibold text-amber-400 truncate">{developer.name}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleShortlist}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : isDark
                  ? 'border-white/15 text-white/70 hover:text-white'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
              title="Shortlist Developer"
            >
              {isShortlisted ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
            </button>

            <button
              onClick={handleShare}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark ? 'border-white/15 text-white/70 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
              title="Share Developer Profile"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Developer profile link copied to clipboard!</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* COVER IMAGE & BRAND BANNER */}
      {/* ============================================================ */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={developer.coverImage}
          alt={developer.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-24 sm:-mt-28 relative z-10 space-y-8">
        {/* ============================================================ */}
        {/* DEVELOPER HEADER CARD */}
        {/* ============================================================ */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-[#0E1526]/95 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-white/10 shrink-0 shadow-xl p-1">
                <img
                  src={developer.logo}
                  alt={developer.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">{developer.name}</h1>
                  {developer.verifiedBadge && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>MahaRERA Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs opacity-70 font-medium">
                  {developer.legalName} • <span className="text-amber-400 font-semibold">{developer.developerType.replace('_', ' ')}</span>
                </p>

                <div className="flex items-center gap-4 text-xs opacity-80 pt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{developer.headquarters}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{developer.yearsOfExperience} Years Experience (Est. {developer.establishedYear})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setModalMode('CALLBACK')}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Request Callback</span>
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </button>

              <button
                onClick={() => setModalMode('BROCHURE')}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark ? 'border-white/15 text-white/80 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                title="Download Corporate Brochure"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Brochure</span>
              </button>

              {developer.website && (
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border transition-all ${
                    isDark ? 'border-white/15 text-white/80 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Official Website"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                </a>
              )}
            </div>
          </div>

          {/* Social and verification mini badges */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="opacity-60 text-[11px] uppercase tracking-wider font-bold">Statutory ID:</span>
              <span className="font-mono font-semibold text-amber-400">
                {developer.reraInfo?.registrationNumber || 'A031262603640'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 opacity-80">
                {developer.reraInfo?.authorityName || 'MahaRERA Registered'}
              </span>
            </div>

            {developer.socialLinks && (
              <div className="flex items-center gap-2 opacity-70 text-xs">
                <span>Official Channels:</span>
                {developer.socialLinks.linkedin && (
                  <a href={developer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 underline">
                    LinkedIn
                  </a>
                )}
                {developer.socialLinks.instagram && (
                  <a href={developer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 underline">
                    Instagram
                  </a>
                )}
                {developer.socialLinks.twitter && (
                  <a href={developer.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 underline">
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DEVELOPER OVERVIEW & STATS GRID */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Narrative Overview */}
          <div
            className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#0E1526]/80 border-white/10' : 'bg-white border-slate-200'
            } space-y-5`}
          >
            <div>
              <h2 className="text-xl font-bold font-serif mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>About {developer.name}</span>
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                {developer.fullDescription}
              </p>
            </div>

            {/* Operational Cities & Segments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Operational Geographies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {developer.citiesServed.map((city) => (
                    <span
                      key={city}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Specialized Asset Segments
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {developer.propertySegments.map((seg, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium"
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Awards section if present */}
            {developer.awards && developer.awards.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Key Recognitions & Industry Accreditations</span>
                </span>
                <div className="space-y-2">
                  {developer.awards.map((award) => (
                    <div
                      key={award.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-semibold">{award.title}</span>
                      </div>
                      <span className="opacity-60 text-[11px] shrink-0">
                        {award.issuer} • {award.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Metrics & Relationship Officer Card */}
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div
              className={`p-6 rounded-3xl border ${
                isDark ? 'bg-[#0E1526]/80 border-white/10' : 'bg-white border-slate-200'
              } space-y-4`}
            >
              <h3 className="text-base font-bold font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Track Record & Delivery Volume</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-extrabold font-serif text-amber-400">
                    {Math.max(developer.totalProjectsCount || 0, projectBreakdown.allProjects.length)}
                  </div>
                  <div className="text-[10px] uppercase font-bold opacity-60">Total Projects</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-extrabold font-serif text-blue-400">
                    {projectBreakdown.ongoing.length}
                  </div>
                  <div className="text-[10px] uppercase font-bold opacity-60">Ongoing Build</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-extrabold font-serif text-emerald-400">
                    {projectBreakdown.completed.length}
                  </div>
                  <div className="text-[10px] uppercase font-bold opacity-60">Delivered</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-extrabold font-serif text-purple-400">
                    {projectBreakdown.upcoming.length}
                  </div>
                  <div className="text-[10px] uppercase font-bold opacity-60">Upcoming Pipeline</div>
                </div>
              </div>

              <div className="text-[11px] opacity-70 space-y-1 pt-2">
                <p>• Verified directly against official MahaRERA project filings.</p>
                <p>• All construction escrow accounts subject to quarterly Form 4 audit.</p>
              </div>
            </div>

            {/* Direct Enquiry Box */}
            <div
              className={`p-6 rounded-3xl border ${
                isDark ? 'bg-gradient-to-br from-amber-500/10 via-[#0E1526] to-[#0E1526] border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-white border-amber-200'
              } space-y-3.5`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  VIP Direct Channel
                </span>
                <h3 className="font-serif font-bold text-base">Direct Developer Consultation</h3>
                <p className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  Connect with the designated senior relationship officer for {developer.name}.
                </p>
              </div>

              <button
                onClick={() => setModalMode('ENQUIRY')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enquire About All Projects</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DEVELOPER PROJECTS SECTION */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                <Building className="w-6 h-6 text-amber-400" />
                <span>Projects Portfolio ({projectBreakdown.allProjects.length})</span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                Active, delivered, and upcoming architectural developments by {developer.name}.
              </p>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setActiveProjectTab('ONGOING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeProjectTab === 'ONGOING'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Ongoing ({projectBreakdown.ongoing.length})
              </button>
              <button
                onClick={() => setActiveProjectTab('COMPLETED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeProjectTab === 'COMPLETED'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Completed ({projectBreakdown.completed.length})
              </button>
              <button
                onClick={() => setActiveProjectTab('UPCOMING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeProjectTab === 'UPCOMING'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Upcoming ({projectBreakdown.upcoming.length})
              </button>
              <button
                onClick={() => setActiveProjectTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeProjectTab === 'ALL'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                All ({projectBreakdown.allProjects.length})
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          {(() => {
            let displayedProjects: Project[] = [];
            if (activeProjectTab === 'ONGOING') displayedProjects = projectBreakdown.ongoing;
            else if (activeProjectTab === 'COMPLETED') displayedProjects = projectBreakdown.completed;
            else if (activeProjectTab === 'UPCOMING') displayedProjects = projectBreakdown.upcoming;
            else displayedProjects = projectBreakdown.allProjects;

            if (displayedProjects.length === 0) {
              return (
                <div
                  className={`p-12 text-center rounded-3xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <Building className="w-10 h-10 mx-auto text-amber-400/40 mb-3" />
                  <h3 className="text-base font-bold font-serif mb-1">
                    No {activeProjectTab.toLowerCase()} projects listed at this moment
                  </h3>
                  <p className="text-xs opacity-60 max-w-sm mx-auto mb-4">
                    New project registrations and inventory releases are synced directly from MahaRERA filings.
                  </p>
                  <button
                    onClick={() => setModalMode('UPDATES')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get First Look on Upcoming Launches</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ${
                      isDark
                        ? 'bg-[#0E1526] border-white/10 hover:border-amber-500/40'
                        : 'bg-white border-slate-200 hover:border-amber-500/40'
                    }`}
                  >
                    {/* Project Image Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-black/40">
                      <img
                        src={project.bannerImageUrl || project.media?.[0]?.url || developer.coverImage}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-amber-400/30">
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Price Pill */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-semibold drop-shadow">
                          {project.configurations?.slice(0, 2).join(' • ') || 'Luxury Units'}
                        </span>
                        <span className="font-serif font-bold text-sm text-amber-400 drop-shadow">
                          {project.headlinePriceRange?.displayString ||
                            formatCurrencyINR(project.headlinePriceRange?.min || 15000000)}
                        </span>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs opacity-70">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{project.location?.microMarket || project.location?.city}</span>
                        </div>

                        <h3 className="text-lg font-bold font-serif group-hover:text-amber-400 transition-colors">
                          {project.name}
                        </h3>

                        <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                          {project.tagline || project.overviewStory}
                        </p>

                        <div className="pt-2 text-[11px] opacity-70 flex items-center justify-between">
                          <span>Possession:</span>
                          <span className="font-semibold text-white/90">
                            {project.possessionDate || 'Immediate / On Request'}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                        <button
                          onClick={() => onSelectProject(project)}
                          className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                        >
                          <span>View Project</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setModalMode('ENQUIRY')}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isDark
                              ? 'border-white/15 text-white/80 hover:bg-white/10'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                          title="Enquire about this project"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Modal dialogs */}
      {modalMode && (
        <DeveloperEnquiryModal
          developer={developer}
          mode={modalMode}
          onClose={() => setModalMode(null)}
          theme={theme}
        />
      )}
    </div>
  );
};
