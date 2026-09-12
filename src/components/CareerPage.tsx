/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  DollarSign,
  ChevronRight,
  ArrowRight,
  Plus,
  Lock,
  CheckCircle2,
  Flame,
  Award,
  BookOpen,
  Car,
  HeartHandshake,
  Laptop,
  Check,
  ExternalLink,
  X,
} from 'lucide-react';
import { JobPost, UserSession } from '../types';
import { careersService } from '../services/careersService';
import { JobApplicationModal } from './JobApplicationModal';
import { AdminJobManagerModal } from './AdminJobManagerModal';

interface CareerPageProps {
  theme?: 'dark' | 'light';
  userSession?: UserSession | null;
  onNavigateHome?: () => void;
  onOpenAdminCms?: () => void;
}

export const CareerPage: React.FC<CareerPageProps> = ({
  theme = 'dark',
  userSession,
  onNavigateHome,
  onOpenAdminCms,
}) => {
  const isDark = theme === 'dark';
  const isAdmin = careersService.canUserManageJobs(userSession);

  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobPost | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobPost | null>(null);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedExp, setSelectedExp] = useState<string>('ALL');

  const refreshJobs = () => {
    setJobs(careersService.getJobs(false));
  };

  useEffect(() => {
    refreshJobs();
    const unsub = careersService.subscribe(() => {
      refreshJobs();
    });
    return unsub;
  }, []);

  const departmentsList = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'LUXURY_ADVISORY_SALES', label: 'Luxury Advisory & Sales' },
    { value: 'LEGAL_MAHARERA_REGULATORY', label: 'Legal & MahaRERA Regulatory' },
    { value: 'SPATIAL_ARCHITECTURE_3D_BIM', label: '3D Spatial Architecture & BIM' },
    { value: 'ENGINEERING_TECH_AI', label: 'Engineering, Tech & AI' },
    { value: 'MARKETING_BRAND_COMMUNICATIONS', label: 'Marketing & Brand' },
    { value: 'WEALTH_CLIENT_RELATIONSHIP', label: 'Private Wealth & NRI' },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (selectedDepartment !== 'ALL' && job.department !== selectedDepartment) return false;
    if (selectedLocation !== 'ALL' && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (selectedExp !== 'ALL' && job.experienceLevel !== selectedExp) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchSummary = job.shortSummary.toLowerCase().includes(q);
      const matchLoc = job.location.toLowerCase().includes(q);
      const matchDept = (job.departmentLabel || '').toLowerCase().includes(q);
      return matchTitle || matchSummary || matchLoc || matchDept;
    }
    return true;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#060911] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* 1. Admin Quick Management Bar (Rendered if Admin / Super Admin logged in) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-amber-950 border-b border-red-500/30 text-white px-4 sm:px-8 py-3 sticky top-16 z-30 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-amber-400">
                ADMIN TALENT CONSOLE
              </span>
              <span className="text-xs opacity-80 hidden md:inline">
                • Logged in as: <strong>{userSession?.name}</strong> ({userSession?.role})
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsAdminManagerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/30 transition-all hover:scale-105"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create / Manage Job Posts</span>
              </button>

              {onOpenAdminCms && (
                <button
                  onClick={onOpenAdminCms}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Admin CMS
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-current/10">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-red-500/5 to-transparent pointer-events-none blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase bg-amber-500/10 border-amber-500/30 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>We Are Hiring • Join Kiaan Properties</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15]">
              Shape the Future of <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-red-400 bg-clip-text text-transparent">
                Luxury Real Estate & Spatial Tech
              </span>
            </h1>

            <p className="text-sm sm:text-base opacity-80 leading-relaxed max-w-2xl">
              We are reimagining India’s luxury property ecosystem through radical transparency, millimeter 3D digital twins,
              rigorous MahaRERA statutory audits, and private Mercedes-Maybach client advisory. Build your career with the leaders
              in bespoke real estate.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            {[
              { label: 'Platform Transactions', val: '₹1,200+ Cr', desc: 'Curated luxury asset volume' },
              { label: 'Client Advisory Bias', val: '0% Brokerage', desc: 'Direct developer transparency' },
              { label: 'Regulatory Audit', val: '100% MahaRERA', desc: 'Title verified & escrow safe' },
              { label: 'Open Opportunities', val: `${jobs.length} Roles`, desc: 'Across Sales, Tech & Legal' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isDark ? 'bg-white/[0.03] border-white/10 hover:border-amber-500/30' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="font-serif font-bold text-xl sm:text-2xl text-amber-400">{stat.val}</div>
                <div className="text-xs font-bold text-current mt-0.5">{stat.label}</div>
                <div className="text-[11px] opacity-60 mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Build With Us (Pillars & Culture) */}
      <section className="py-16 sm:py-20 border-b border-current/10 bg-current/[0.015]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              The Kiaan Advantage
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-current">
              Why Elite Professionals Choose Kiaan
            </h2>
            <p className="text-xs sm:text-sm opacity-75">
              We combine institutional wealth stewardship with cutting-edge spatial engineering, offering a career platform of unmatched prestige.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg">Mercedes-Maybach Private Client Fleet</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Our luxury advisors never conduct ordinary visits. Represent clients with chauffeured Mercedes-Maybach fleet itineraries, private airport transfers, and bespoke presentation hospitality.
              </p>
            </div>

            <div
              className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg">100% MahaRERA Law & Escrow Rigor</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Work alongside Maharashtra's finest conveyancing advocates. Every property is backed by 30-year title searches, Section 4 escrow audits, and zero legal ambiguity.
              </p>
            </div>

            <div
              className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg">Spatial 3D Digital Twins & WebGL</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Our engineering team develops real-time solar ray tracing, BIM tower elevation stackers, and AI natural language intelligence powered by Google Gemini.
              </p>
            </div>
          </div>

          {/* Perks Row */}
          <div className="p-6 sm:p-8 rounded-3xl border bg-gradient-to-r from-amber-500/10 via-transparent to-red-500/10 border-amber-500/20">
            <h4 className="font-serif font-bold text-base sm:text-lg mb-4 text-center sm:text-left">
              Executive Benefits & Holistic Wellbeing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              {[
                'Top-Tier Fixed CTC + Transparent Quarterly Incentive Pools',
                '₹15 Lakh Family Health & Accidental Insurance Cover',
                'MacBook Pro / Apple Silicon & High-End RTX Hardware',
                'Baner HQ Rooftop Lounge & Specialty Espresso Bar',
                'Annual Luxury Leadership Conclave in Dubai / Singapore',
                'Continuous Legal, MahaRERA & Tech Upskilling Stipends',
                'Direct Mentorship from Developer Founders & HNI Partners',
                'Flexible Hybrid Work Model with Premium Commute Support',
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-2 font-medium opacity-90">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Open Job Positions & Application Hub */}
      <section id="openings" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                Career Openings
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-4xl text-current">
                Explore Available Roles ({filteredJobs.length})
              </h2>
              <p className="text-xs sm:text-sm opacity-75 max-w-xl">
                Find your calling across our Luxury Sales, Legal Due Diligence, 3D Architecture, Technology, and Marketing divisions.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAdminManagerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 transition-all hover:scale-105 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Position</span>
              </button>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0B101D] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Search Box */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, department, or keyword (e.g. Sales, MahaRERA, 3D)..."
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                    isDark
                      ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                      : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                  }`}
                />
              </div>

              {/* Department Dropdown */}
              <div>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none cursor-pointer ${
                    isDark
                      ? 'bg-[#0B101D] border-white/15 focus:border-amber-400 text-white'
                      : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                  }`}
                >
                  {departmentsList.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Dropdown */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none cursor-pointer ${
                    isDark
                      ? 'bg-[#0B101D] border-white/15 focus:border-amber-400 text-white'
                      : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                  }`}
                >
                  <option value="ALL">All Locations</option>
                  <option value="Pune">Pune (Baner HQ / Wakad)</option>
                  <option value="Mumbai">Mumbai (BKC Desk)</option>
                  <option value="Hybrid">Hybrid / Remote</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings Grid */}
          {filteredJobs.length === 0 ? (
            <div
              className={`p-12 text-center rounded-3xl border space-y-3 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <Briefcase className="w-10 h-10 mx-auto text-amber-500 opacity-60" />
              <h3 className="font-serif font-bold text-lg">No Matching Openings Found</h3>
              <p className="text-xs opacity-75 max-w-sm mx-auto">
                Try adjusting your search keywords or department filters. You can also submit an open portfolio candidacy below.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('ALL');
                  setSelectedLocation('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer shadow mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-5 transition-all duration-300 group ${
                    isDark
                      ? 'bg-[#0B101D] border-white/10 hover:border-amber-500/50 hover:bg-[#0E1526]'
                      : 'bg-white border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {job.departmentLabel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-current/5 text-current/80">
                        {job.jobTypeLabel}
                      </span>
                      {job.isUrgent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>URGENT</span>
                        </span>
                      )}
                      {job.requiresMahaReraKnowledge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>MahaRERA Audited</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-current group-hover:text-amber-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs opacity-75 mt-1.5 line-clamp-2 leading-relaxed">
                        {job.shortSummary}
                      </p>
                    </div>

                    {/* Metadata pills */}
                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      <span className="flex items-center gap-1 opacity-80">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {job.location}
                      </span>
                      <span className="opacity-40">•</span>
                      <span className="font-mono font-bold text-amber-400">
                        {job.salaryRangeDisplay}
                      </span>
                      <span className="opacity-40">•</span>
                      <span className="opacity-80">
                        Exp: {job.experienceYearsText}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-current/10 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedJobForDetails(job)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-current/10 transition-colors cursor-pointer opacity-80 hover:opacity-100 flex items-center gap-1"
                    >
                      <span>Role Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedJobForApply(job)}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. General Talent Pool Application Callout */}
      <section className="py-16 border-t border-current/10 bg-gradient-to-b from-transparent to-amber-500/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-14 h-14 rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Users className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-bold text-2xl sm:text-3xl">Don't See Your Specific Role?</h3>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl mx-auto leading-relaxed">
              We are perpetually scouting exceptional talent across luxury real estate conveyancing, algorithmic spatial modeling,
              and private banking relationships. Submit your dossier for our executive talent pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:careers@kiaanproperties.in?subject=Confidential%20Executive%20Candidacy%20-%20Kiaan%20Properties"
              className="px-6 py-3 rounded-2xl bg-current/10 hover:bg-current/15 text-current font-bold text-xs flex items-center gap-2 cursor-pointer transition-all border border-current/15"
            >
              <span>Email: careers@kiaanproperties.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                if (jobs.length > 0) {
                  setSelectedJobForApply(jobs[0]);
                }
              }}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <span>Submit General Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* MODAL 1: Role Details Drawer / Modal */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 my-auto max-h-[85vh] flex flex-col ${
              isDark ? 'bg-[#0B101D] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-current/10 flex items-start justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-transparent to-red-500/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400">
                    {selectedJobForDetails.departmentLabel}
                  </span>
                  <span className="text-xs opacity-70 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {selectedJobForDetails.location}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl">{selectedJobForDetails.title}</h3>
                <div className="text-xs opacity-75 font-mono text-amber-400">
                  {selectedJobForDetails.salaryRangeDisplay} • Exp: {selectedJobForDetails.experienceYearsText}
                </div>
              </div>

              <button
                onClick={() => setSelectedJobForDetails(null)}
                className="p-2 rounded-full hover:bg-current/10 opacity-70 hover:opacity-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-amber-400">Role Context & Mission</h4>
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                  {selectedJobForDetails.overviewStory}
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-serif font-bold text-base text-amber-400">Key Responsibilities</h4>
                <ul className="space-y-2 text-xs opacity-85 list-disc list-inside leading-relaxed">
                  {selectedJobForDetails.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-serif font-bold text-base text-amber-400">Qualifications & Requirements</h4>
                <ul className="space-y-2 text-xs opacity-85 list-disc list-inside leading-relaxed">
                  {selectedJobForDetails.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {selectedJobForDetails.benefitsAndPerks && selectedJobForDetails.benefitsAndPerks.length > 0 && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-current/5 border border-current/10">
                  <h4 className="font-serif font-bold text-sm text-emerald-400">Perks & Compensation Advantages</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs opacity-85 list-disc list-inside">
                    {selectedJobForDetails.benefitsAndPerks.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-current/10 flex items-center justify-between gap-3 bg-current/[0.02]">
              <span className="text-[11px] opacity-60">
                Deadline: {selectedJobForDetails.deadlineDate || 'Rolling applications'}
              </span>
              <button
                onClick={() => {
                  const job = selectedJobForDetails;
                  setSelectedJobForDetails(null);
                  setSelectedJobForApply(job);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <span>Apply for this Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Candidate Application Modal */}
      {selectedJobForApply && (
        <JobApplicationModal
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          job={selectedJobForApply}
          theme={theme}
          onSuccess={() => {
            // refresh
          }}
        />
      )}

      {/* MODAL 3: Admin Job Manager Modal (Create/Edit Job Posts & ATS) */}
      {isAdminManagerOpen && (
        <AdminJobManagerModal
          isOpen={isAdminManagerOpen}
          onClose={() => setIsAdminManagerOpen(false)}
          session={userSession}
          theme={theme}
          onJobChanged={refreshJobs}
        />
      )}
    </div>
  );
};
