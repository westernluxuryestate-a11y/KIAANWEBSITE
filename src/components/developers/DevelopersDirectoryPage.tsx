/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Building,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Flame,
  Globe,
} from 'lucide-react';
import { Developer, DeveloperType } from '../../types';
import { globalKiaanStore } from '../../services/store';

interface DevelopersDirectoryPageProps {
  onSelectDeveloper: (developerSlug: string) => void;
  theme?: 'dark' | 'light';
}

const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export const DevelopersDirectoryPage: React.FC<DevelopersDirectoryPageProps> = ({
  onSelectDeveloper,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // Store data
  const [developers, setDevelopers] = useState<Developer[]>(() => globalKiaanStore.getDevelopers());

  useEffect(() => {
    const unsub = globalKiaanStore.subscribe(() => {
      setDevelopers(globalKiaanStore.getDevelopers());
    });
    return unsub;
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<
    'ALL' | 'ONGOING' | 'UPCOMING' | 'COMPLETED'
  >('ALL');
  const [sortBy, setSortBy] = useState<'MOST_PROJECTS' | 'MOST_RECENT' | 'A_TO_Z' | 'MOST_POPULAR'>(
    'MOST_POPULAR'
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Derive unique cities
  const availableCities = useMemo(() => {
    const citiesSet = new Set<string>();
    developers.forEach((d) => {
      d.citiesServed?.forEach((c) => citiesSet.add(c));
    });
    return Array.from(citiesSet).sort();
  }, [developers]);

  // Compute stats for each developer dynamically from connected projects
  const developerStatsMap = useMemo(() => {
    const map: Record<
      string,
      { total: number; ongoing: number; completed: number; upcoming: number }
    > = {};

    developers.forEach((dev) => {
      const breakdown = globalKiaanStore.getProjectsForDeveloper(dev.id);
      map[dev.id] = {
        total: Math.max(dev.totalProjectsCount || 0, breakdown.allProjects.length),
        ongoing: breakdown.ongoing.length,
        completed: breakdown.completed.length,
        upcoming: breakdown.upcoming.length,
      };
    });

    return map;
  }, [developers]);

  // Filtered & Sorted Developers
  const filteredDevelopers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return developers
      .filter((dev) => {
        // Name / brand / location / project search
        if (q) {
          const matchName = dev.name.toLowerCase().includes(q);
          const matchBrand = dev.brandName?.toLowerCase().includes(q);
          const matchLegal = dev.legalName?.toLowerCase().includes(q);
          const matchLocation = dev.headquarters.toLowerCase().includes(q);
          const matchDesc = dev.shortDescription.toLowerCase().includes(q);
          const matchCity = dev.citiesServed.some((c) => c.toLowerCase().includes(q));

          // Check if any associated project name matches
          const breakdown = globalKiaanStore.getProjectsForDeveloper(dev.id);
          const matchProject = breakdown.allProjects.some((p) => p.name.toLowerCase().includes(q));

          if (!matchName && !matchBrand && !matchLegal && !matchLocation && !matchDesc && !matchCity && !matchProject) {
            return false;
          }
        }

        // Alphabet filter
        if (selectedLetter !== 'ALL') {
          const firstChar = dev.name.trim().charAt(0).toUpperCase();
          if (firstChar !== selectedLetter) return false;
        }

        // City filter
        if (selectedCity !== 'ALL') {
          if (!dev.citiesServed.includes(selectedCity) && !dev.headquarters.includes(selectedCity)) {
            return false;
          }
        }

        // Developer Type filter
        if (selectedType !== 'ALL') {
          if (dev.developerType !== selectedType) return false;
        }

        // Project Status filter
        if (selectedProjectStatus !== 'ALL') {
          const stats = developerStatsMap[dev.id];
          if (selectedProjectStatus === 'ONGOING' && (!stats || stats.ongoing === 0)) return false;
          if (selectedProjectStatus === 'UPCOMING' && (!stats || stats.upcoming === 0)) return false;
          if (selectedProjectStatus === 'COMPLETED' && (!stats || stats.completed === 0)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const statsA = developerStatsMap[a.id] || { total: 0, ongoing: 0, completed: 0, upcoming: 0 };
        const statsB = developerStatsMap[b.id] || { total: 0, ongoing: 0, completed: 0, upcoming: 0 };

        if (sortBy === 'MOST_PROJECTS') {
          return statsB.total - statsA.total;
        }
        if (sortBy === 'MOST_RECENT') {
          return b.establishedYear - a.establishedYear;
        }
        if (sortBy === 'A_TO_Z') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'MOST_POPULAR') {
          const viewsA = a.metrics?.profileViews || 0;
          const viewsB = b.metrics?.profileViews || 0;
          return viewsB - viewsA;
        }
        return 0;
      });
  }, [
    developers,
    searchQuery,
    selectedLetter,
    selectedCity,
    selectedType,
    selectedProjectStatus,
    sortBy,
    developerStatsMap,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDevelopers.length / itemsPerPage);
  const paginatedDevelopers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDevelopers.slice(start, start + itemsPerPage);
  }, [filteredDevelopers, currentPage, itemsPerPage]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLetter, selectedCity, selectedType, selectedProjectStatus, sortBy]);

  // Check if exactly one developer matched the search query
  const singleMatch = useMemo(() => {
    if (searchQuery.trim().length >= 3 && filteredDevelopers.length === 1) {
      return filteredDevelopers[0];
    }
    return null;
  }, [searchQuery, filteredDevelopers]);

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-12 transition-colors ${
      isDark ? 'bg-[#080C14] text-white' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ============================================================ */}
        {/* HERO SECTION: HEADING & INTRO */}
        {/* ============================================================ */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Building className="w-3.5 h-3.5" />
            <span>Developer Ecosystem & Authority Index</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight">
            Real Estate Developers
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            Explore India’s most reputable luxury builders, listed conglomerates, and visionary architectural houses.
            Verified MahaRERA accreditations, track records, and direct project portfolios in one centralized directory.
          </p>
        </div>

        {/* ============================================================ */}
        {/* SEARCH BAR & QUICK FILTERS */}
        {/* ============================================================ */}
        <div
          className={`p-4 sm:p-6 rounded-2xl border shadow-xl ${
            isDark ? 'bg-[#0E1526]/80 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}
        >
          {/* Main search input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="text"
              placeholder="Search developer by name, brand, city or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-black/30 border-white/15 text-white focus:border-amber-400 placeholder:text-white/40'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 placeholder:text-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Single Match Direct Jump Banner */}
          {singleMatch && (
            <div
              onClick={() => onSelectDeveloper(singleMatch.slug)}
              className="mb-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={singleMatch.logo}
                  alt={singleMatch.name}
                  className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Direct Match Found
                  </span>
                  <div className="font-serif font-bold text-base flex items-center gap-2">
                    {singleMatch.name}
                    {singleMatch.verifiedBadge && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>View Full Profile</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Dropdown Filters & Sorters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* City Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-70">
                Location / City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#141C30] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="ALL">All Cities ({availableCities.length})</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Developer Type Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-70">
                Category / Tier
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#141C30] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="ALL">All Developer Types</option>
                <option value="LUXURY">Ultra-Luxury Specialists</option>
                <option value="TIER_1">Tier-1 Listed Builders</option>
                <option value="CONGLOMERATE">Diversified Conglomerates</option>
                <option value="BOUTIQUE">Boutique & Heritage</option>
                <option value="COMMERCIAL_SPECIALIST">Commercial & IT Parks</option>
              </select>
            </div>

            {/* Project Status Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-70">
                Project Status
              </label>
              <select
                value={selectedProjectStatus}
                onChange={(e) => setSelectedProjectStatus(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#141C30] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="ALL">All Project Portfolios</option>
                <option value="ONGOING">With Ongoing Projects</option>
                <option value="UPCOMING">With Upcoming Projects</option>
                <option value="COMPLETED">With Completed Projects</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-70">
                Sort Options
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#141C30] border-white/15 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="MOST_POPULAR">Most Popular (Views & Enquiries)</option>
                <option value="MOST_PROJECTS">Most Projects</option>
                <option value="MOST_RECENT">Newest Established</option>
                <option value="A_TO_Z">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Alphabetical Filter Bar (A-Z) */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 mr-2 shrink-0">
              Browse A–Z:
            </span>
            {ALPHABET.map((letter) => {
              const isActive = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                      : isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DIRECTORY RESULTS SUMMARY BAR */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs opacity-75">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400">
              {filteredDevelopers.length} Real Estate Developer{filteredDevelopers.length === 1 ? '' : 's'}
            </span>
            <span>found in Maharashtra & National markets</span>
          </div>

          {(searchQuery || selectedLetter !== 'ALL' || selectedCity !== 'ALL' || selectedType !== 'ALL' || selectedProjectStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLetter('ALL');
                setSelectedCity('ALL');
                setSelectedType('ALL');
                setSelectedProjectStatus('ALL');
              }}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* DEVELOPERS GRID: CLEAN DEVELOPER CARDS */}
        {/* ============================================================ */}
        {filteredDevelopers.length === 0 ? (
          <div
            className={`p-12 text-center rounded-3xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <Building className="w-12 h-12 mx-auto text-amber-400/50 mb-3" />
            <h3 className="text-lg font-bold font-serif mb-1">No Developers Matched Your Search</h3>
            <p className="text-xs opacity-60 max-w-md mx-auto mb-4">
              Try adjusting your spelling, clearing the alphabetical or category filters, or searching for a specific city.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLetter('ALL');
                setSelectedCity('ALL');
                setSelectedType('ALL');
                setSelectedProjectStatus('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer"
            >
              Show All Developers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDevelopers.map((dev) => {
              const stats = developerStatsMap[dev.id] || {
                total: dev.totalProjectsCount || 0,
                ongoing: 0,
                completed: 0,
                upcoming: 0,
              };

              return (
                <div
                  key={dev.id}
                  className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    isDark
                      ? 'bg-[#0E1526] border-white/10 hover:border-amber-500/40 hover:shadow-amber-500/5'
                      : 'bg-white border-slate-200 hover:border-amber-500/50 hover:shadow-slate-300'
                  }`}
                >
                  <div>
                    {/* Card Top: Logo, Name, Verified Badge, Developer Type */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/15 bg-white/5 flex items-center justify-center p-1">
                        <img
                          src={dev.logo}
                          alt={dev.name}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="font-serif font-bold text-lg leading-snug truncate group-hover:text-amber-400 transition-colors">
                            {dev.name}
                          </h2>
                          {dev.verifiedBadge && (
                            <span
                              title="MahaRERA Verified Developer"
                              className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold text-amber-400/90 block truncate">
                          {dev.brandName && dev.brandName !== dev.name
                            ? `${dev.brandName} • `
                            : ''}
                          {dev.developerType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      {dev.shortDescription}
                    </p>

                    {/* Meta info row: Location & Experience */}
                    <div className="space-y-1.5 mb-4 text-xs opacity-80">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{dev.headquarters}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {dev.yearsOfExperience} Years Experience (Est. {dev.establishedYear})
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Project Breakdown Counts */}
                    <div
                      className={`grid grid-cols-4 gap-1.5 p-3 rounded-xl mb-5 text-center ${
                        isDark ? 'bg-black/40 border border-white/5' : 'bg-slate-50 border border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="text-base font-bold font-serif text-amber-400">
                          {stats.total}
                        </div>
                        <div className="text-[9px] uppercase font-bold opacity-60">Total</div>
                      </div>
                      <div>
                        <div className="text-base font-bold font-serif text-blue-400">
                          {stats.ongoing}
                        </div>
                        <div className="text-[9px] uppercase font-bold opacity-60">Ongoing</div>
                      </div>
                      <div>
                        <div className="text-base font-bold font-serif text-emerald-400">
                          {stats.completed}
                        </div>
                        <div className="text-[9px] uppercase font-bold opacity-60">Completed</div>
                      </div>
                      <div>
                        <div className="text-base font-bold font-serif text-purple-400">
                          {stats.upcoming}
                        </div>
                        <div className="text-[9px] uppercase font-bold opacity-60">Upcoming</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button: View Developer */}
                  <div>
                    <button
                      onClick={() => {
                        globalKiaanStore.trackDeveloperEngagement(dev.id, 'profileViews');
                        onSelectDeveloper(dev.slug);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10 cursor-pointer group/btn"
                    >
                      <span>View Developer Profile</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGINATION CONTROLS */}
        {/* ============================================================ */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-40 cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : isDark
                      ? 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-40 cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
