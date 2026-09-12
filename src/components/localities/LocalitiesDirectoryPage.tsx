/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Building,
  TrendingUp,
  Sparkles,
  Compass,
  ArrowRight,
  Filter,
  Grid,
  Map as MapIcon,
  ShieldCheck,
  ChevronRight,
  X,
  Layers,
  Percent,
  Clock,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { Locality, LocalityCategory, Project, Property } from '../../types';
import { localityIntelligenceService } from '../../services/localityIntelligenceService';
import { globalKiaanStore } from '../../services/store';
import { LocalityMapDiscovery } from './LocalityMapDiscovery';
import { PUNE_ZONES } from '../../data/puneLocationHierarchy';

interface LocalitiesDirectoryPageProps {
  localities: Locality[];
  allProjects: Project[];
  allProperties: Property[];
  onSelectLocality: (locality: Locality) => void;
  onOpenMatchmaker?: () => void;
  onOpenAdminPanel?: () => void;
  canAccessAdmin?: boolean;
  theme?: 'dark' | 'light';
}

export const LocalitiesDirectoryPage: React.FC<LocalitiesDirectoryPageProps> = ({
  localities,
  allProjects,
  allProperties,
  onSelectLocality,
  onOpenMatchmaker,
  onOpenAdminPanel,
  canAccessAdmin = false,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [browseTab, setBrowseTab] = useState<'ALL' | 'POPULAR' | 'RECENT'>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedSort, setSelectedSort] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC' | 'NAME'>('POPULAR');
  const [isPhase1MvpMode, setIsPhase1MvpMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Unique cities list
  const cities = useMemo(() => {
    const set = new Set<string>();
    (localities || []).forEach((l) => {
      if (l?.city) set.add(l.city);
    });
    return Array.from(set);
  }, [localities]);

  // Autocomplete suggestions (as user types, e.g. "Wak..." -> "Wakad, Pune", or "Ashoka" -> "Kharadi")
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return (localities || [])
      .map((loc) => {
        if (!loc) return null;
        const nameMatch = loc.name?.toLowerCase().includes(q);
        const cityMatch = loc.city?.toLowerCase().includes(q);
        const pinMatch = loc.pincode && loc.pincode.includes(q);
        const slugMatch = loc.slug?.toLowerCase().includes(q);
        const zoneMatch = loc.zoneName && loc.zoneName.toLowerCase().includes(q);

        // Child sub-locality or micro-location match
        const matchedSub = (loc.subLocalities || []).find((sub) =>
          sub?.name?.toLowerCase().includes(q)
        );
        const matchedMicro = (loc.microLocations || []).find((m) =>
          m?.name?.toLowerCase().includes(q)
        );

        const isMatched = nameMatch || cityMatch || pinMatch || slugMatch || zoneMatch || !!matchedSub || !!matchedMicro;

        if (!isMatched) return null;

        const propsCount = (allProperties || []).filter((p) => {
          if (p?.localityId && p.localityId === loc.id) return true;
          if (p?.location?.microMarket && p.location.microMarket.toLowerCase() === loc.name.toLowerCase()) return true;
          return false;
        }).length;
        const projectsCount = (allProjects || []).filter((proj) => {
          if (proj?.localityId && proj.localityId === loc.id) return true;
          if (proj?.location?.microMarket && proj.location.microMarket.toLowerCase() === loc.name.toLowerCase()) return true;
          return false;
        }).length;

        return {
          locality: loc,
          propsCount,
          projectsCount,
          matchedDetail: matchedSub ? `Sub-area: ${matchedSub.name}` : matchedMicro ? `Road: ${matchedMicro.name}` : undefined,
        };
      })
      .filter(Boolean)
      .slice(0, 8) as {
        locality: Locality;
        propsCount: number;
        projectsCount: number;
        matchedDetail?: string;
      }[];
  }, [searchQuery, localities, allProjects, allProperties]);

  // Handle selecting a suggestion
  const handleSelectSuggestion = (loc: Locality) => {
    setIsSearchFocused(false);
    globalKiaanStore.trackLocalityEvent({
      type: 'locality_search_select',
      localityId: loc.id,
      localityName: loc.name,
      meta: { query: searchQuery },
    });
    onSelectLocality(loc);
  };

  // Filtered and Sorted Localities
  const filteredLocalities = useMemo(() => {
    let result = localities.filter((l) => l.status !== 'HIDDEN');

    // Zone filter
    if (selectedZone !== 'ALL') {
      result = result.filter((l) => l.zoneId === selectedZone);
    }

    // City filter
    if (selectedCity !== 'ALL') {
      result = result.filter((l) => l.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Browse Tab filter (MVP 29.1)
    if (browseTab === 'POPULAR') {
      result = result.filter((l) => l.isFeatured || l.categories?.includes('POPULAR'));
    } else if (browseTab === 'RECENT') {
      // Sort by creation or update timestamp
      result = [...result].sort((a, b) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime());
    }

    // Search filter (Locality, City, PIN code, Sub-Localities, Micro-Locations)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((l) => {
        const matchName = l.name.toLowerCase().includes(q);
        const matchCity = l.city.toLowerCase().includes(q);
        const matchPin = l.pincode && l.pincode.includes(q);
        const matchSlug = l.slug.toLowerCase().includes(q);
        const matchNear = l.nearbyAreas?.some((na) => na.toLowerCase().includes(q));
        const matchZone = l.zoneName && l.zoneName.toLowerCase().includes(q);
        const matchSub = (l.subLocalities || []).some((s) => s.name.toLowerCase().includes(q));
        const matchMicro = (l.microLocations || []).some((m) => m.name.toLowerCase().includes(q));
        return matchName || matchCity || matchPin || matchSlug || matchNear || matchZone || matchSub || matchMicro;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (selectedSort === 'NAME') {
        return a.name.localeCompare(b.name);
      }
      if (selectedSort === 'PRICE_ASC') {
        return (a.priceIntelligence?.averagePricePerSqFt || 0) - (b.priceIntelligence?.averagePricePerSqFt || 0);
      }
      if (selectedSort === 'PRICE_DESC') {
        return (b.priceIntelligence?.averagePricePerSqFt || 0) - (a.priceIntelligence?.averagePricePerSqFt || 0);
      }
      // POPULAR default
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.lifestyleRating?.overallScore || 0) - (a.lifestyleRating?.overallScore || 0);
    });

    return result;
  }, [localities, selectedZone, selectedCity, browseTab, searchQuery, selectedSort]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#06090F] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Header / Hero Section (Phase 1 MVP) */}
      <section className="relative pt-10 pb-12 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0c1220] via-slate-950 to-[#06090F]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <Compass className="w-3.5 h-3.5" />
                Phase 1 MVP • Localities Directory
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Explore Localities
              </h1>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                Discover properties, projects, amenities, connectivity and real-estate opportunities across localities.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {canAccessAdmin && onOpenAdminPanel && (
                <button
                  onClick={onOpenAdminPanel}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  + Manage Localities (Admin)
                </button>
              )}
            </div>
          </div>

          {/* 2. Prominent Search Box with Autocomplete (MVP 29.1 B) */}
          <div ref={searchContainerRef} className="relative max-w-2xl">
            <div className="relative flex items-center rounded-2xl border border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
              <Search className="w-5 h-5 text-white/40 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (e.target.value.trim().length > 1) {
                    globalKiaanStore.trackLocalityEvent({
                      type: 'locality_search',
                      meta: { query: e.target.value },
                    });
                  }
                }}
                placeholder="Search locality, city, or PIN code (e.g., Wakad, Pune, 411057)..."
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-white/40 hover:text-white mr-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden backdrop-blur-xl divide-y divide-white/5">
                <div className="p-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider px-3 bg-white/[0.02]">
                  Suggested Localities & Micro-Markets
                </div>
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map(({ locality, propsCount, projectsCount, matchedDetail }) => (
                    <div
                      key={locality.id}
                      onClick={() => handleSelectSuggestion(locality)}
                      className="px-4 py-3 hover:bg-amber-500/10 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-400/50">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2 flex-wrap">
                            <span>{locality.name}, {locality.city}</span>
                            {locality.zoneName && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold">
                                {locality.zoneName}
                              </span>
                            )}
                            {locality.pincode && (
                              <span className="text-xs font-mono text-white/50 font-normal">
                                • PIN {locality.pincode}
                              </span>
                            )}
                          </div>
                          {matchedDetail && (
                            <div className="text-xs font-medium text-emerald-400 mt-0.5">
                              Matches {matchedDetail}
                            </div>
                          )}
                          <div className="text-xs text-white/50">
                            {propsCount} {propsCount === 1 ? 'Listing' : 'Listings'} • {projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}
                            {locality.priceIntelligence?.averagePricePerSqFt && (
                              <span> • ₹{locality.priceIntelligence.averagePricePerSqFt.toLocaleString('en-IN')}/sq.ft</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-white/50">
                    No localities match &quot;{searchQuery}&quot;. Try searching for Pune, Kharadi, Hinjewadi, or 411057.
                  </div>
                )}
              </div>
            )}

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-2 mt-2.5 text-xs text-white/50 overflow-x-auto">
              <span className="font-semibold text-white/70">Popular:</span>
              {['Wakad', 'Baner', 'Hinjewadi', 'Balewadi', '411057'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setIsSearchFocused(true);
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse Localities & Filter Bar (MVP 29.1 A) */}
      <section className="sticky top-0 z-20 border-b border-white/10 bg-[#06090F]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Browse Tabs (MVP 29.1 A) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <button
                onClick={() => setBrowseTab('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  browseTab === 'ALL'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Browse All
              </button>
              <button
                onClick={() => setBrowseTab('POPULAR')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  browseTab === 'POPULAR'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Popular Localities
              </button>
              <button
                onClick={() => setBrowseTab('RECENT')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  browseTab === 'RECENT'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Recently Added
              </button>
            </div>

            {/* City, Sort & View Mode Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* City Filter */}
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <span>City:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-slate-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium cursor-pointer"
                >
                  <option value="ALL">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="bg-slate-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium cursor-pointer"
              >
                <option value="POPULAR">Sort: Popular</option>
                <option value="NAME">Sort: A - Z</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
              </select>

              {/* View Mode (Grid vs Map & Hierarchy) */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'GRID' ? 'bg-amber-500 text-slate-950' : 'text-white/60 hover:text-white'
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('MAP')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'MAP' ? 'bg-amber-500 text-slate-950' : 'text-white/60 hover:text-white'
                  }`}
                  aria-label="Map & Hierarchy View"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Map &amp; Hierarchy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pune Zone Sub-Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-white/5">
            <span className="text-[11px] font-semibold text-white/50 whitespace-nowrap mr-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              Zone:
            </span>
            <button
              onClick={() => setSelectedZone('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedZone === 'ALL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              All Pune ({localities.length})
            </button>
            {Object.values(PUNE_ZONES).map((z) => {
              const count = localities.filter((l) => l.zoneId === z.id).length;
              const isActive = selectedZone === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {z.name} {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Main Directory Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between text-xs text-white/60">
          <div>
            Showing <span className="font-bold text-white">{filteredLocalities.length}</span> localities
            {selectedZone !== 'ALL' && (
              <span> in {PUNE_ZONES[selectedZone as keyof typeof PUNE_ZONES]?.name || selectedZone}</span>
            )}
            {selectedCity !== 'ALL' && <span> ({selectedCity})</span>}
          </div>
          <div className="flex items-center gap-3">
            {viewMode === 'GRID' && (
              <button
                onClick={() => setViewMode('MAP')}
                className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <Compass className="w-3.5 h-3.5" />
                View on Map &amp; Hierarchy
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Clear Search Query
              </button>
            )}
          </div>
        </div>

        {/* View Mode: Map & Pune Hierarchy vs Grid Cards */}
        {viewMode === 'MAP' ? (
          <LocalityMapDiscovery
            localities={filteredLocalities}
            allProjects={allProjects}
            allProperties={allProperties}
            onSelectLocality={onSelectLocality}
            theme={theme}
          />
        ) : (
          /* Fast Card / Grid Layout (29.1 A) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocalities.map((locality) => {
              // Dynamic counting matching locality
              const propCount = allProperties.filter((p) => {
                if (p.localityId && p.localityId === locality.id) return true;
                if (p.location?.microMarket && p.location.microMarket.toLowerCase() === locality.name.toLowerCase()) return true;
                return false;
              }).length;

              const projCount = allProjects.filter((proj) => {
                if (proj.localityId && proj.localityId === locality.id) return true;
                if (proj.location?.microMarket && proj.location.microMarket.toLowerCase() === locality.name.toLowerCase()) return true;
                return false;
              }).length;

              const startingPrice = locality.priceIntelligence?.priceRangeMin
                ? `₹${(locality.priceIntelligence.priceRangeMin / 10000000).toFixed(2)} Cr`
                : locality.priceIntelligence?.startingPriceFormatted || '₹65 L';

              return (
                <div
                  key={locality.id}
                  onClick={() => {
                    globalKiaanStore.trackLocalityEvent({
                      type: 'locality_card_clicked',
                      localityId: locality.id,
                      localityName: locality.name,
                    });
                    onSelectLocality(locality);
                  }}
                  className="group rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200 shadow-md cursor-pointer flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={locality.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                      alt={locality.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      {locality.zoneName && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                          {locality.zoneName}
                        </span>
                      )}
                      {locality.status === 'DRAFT' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                          Draft
                        </span>
                      )}
                      {locality.isVerified && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        PIN {locality.pincode || '411057'}
                      </span>
                      {locality.coordinates && (
                        <span className="text-[10px] font-mono text-amber-400 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          {locality.coordinates.lat.toFixed(2)}° N, {locality.coordinates.lng.toFixed(2)}° E
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content (29.1 A Specification) */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
                          {locality.city}, {locality.state || 'Maharashtra'}
                        </span>
                        {locality.priceIntelligence?.averagePricePerSqFt && (
                          <span className="text-xs font-mono font-bold text-amber-400">
                            ₹{locality.priceIntelligence.averagePricePerSqFt.toLocaleString('en-IN')}/sq.ft
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {locality.name}
                      </h3>
                      <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                        {locality.shortDescription || `Explore residential properties, verified resale inventory, and new developments in ${locality.name}.`}
                      </p>
                    </div>

                    {/* Sub-localities preview chips */}
                    {locality.subLocalities && locality.subLocalities.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-semibold text-white/40 uppercase">Sub-localities / Micro-areas</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {locality.subLocalities.slice(0, 3).map((sub) => (
                            <span
                              key={sub.id}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/80"
                            >
                              {sub.name}
                            </span>
                          ))}
                          {locality.subLocalities.length > 3 && (
                            <span className="text-[10px] text-white/40 font-mono">
                              +{locality.subLocalities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                      <div className="p-2 rounded-xl bg-white/[0.03]">
                        <div className="text-[10px] text-white/50 uppercase font-semibold">Listings</div>
                        <div className="font-mono font-bold text-white text-xs mt-0.5">
                          {propCount}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.03]">
                        <div className="text-[10px] text-white/50 uppercase font-semibold">Projects</div>
                        <div className="font-mono font-bold text-amber-400 text-xs mt-0.5">
                          {projCount}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.03]">
                        <div className="text-[10px] text-white/50 uppercase font-semibold">Starting From</div>
                        <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5 truncate">
                          {startingPrice}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-white/50 text-[11px]">
                        {locality.status === 'PUBLISHED' ? 'Active Market' : 'Preview'}
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Locality
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredLocalities.length === 0 && (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">No localities found</h4>
              <p className="text-xs text-white/60">
                We couldn&apos;t find any localities matching &quot;{searchQuery}&quot;. Try adjusting your search query or city filter.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('ALL');
                setBrowseTab('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LocalitiesDirectoryPage;
