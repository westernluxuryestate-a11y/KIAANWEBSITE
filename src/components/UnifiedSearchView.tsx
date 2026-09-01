/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project, Unit, UnifiedSearchFilter } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
  Building,
  ShieldCheck,
  RotateCcw,
  Maximize2,
  Calendar,
  Lock,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface UnifiedSearchViewProps {
  onOpenDigitalTwin: (project: Project, unitId?: string) => void;
  onAddToComparison: (unit: Unit) => void;
  onScheduleVisit: (project: Project) => void;
}

export function UnifiedSearchView({
  onOpenDigitalTwin,
  onAddToComparison,
  onScheduleVisit,
}: UnifiedSearchViewProps) {
  const [filter, setFilter] = useState<UnifiedSearchFilter>({
    query: '',
    microMarket: 'ALL',
    minPrice: 0,
    maxPrice: 50000000,
    configurations: [],
    facing: 'ALL',
    amenities: [],
    reraVerifiedOnly: true,
    sortOrder: 'FEATURED',
  });

  const [searchResults, setSearchResults] = useState<{
    filteredProjects: Project[];
    filteredUnits: Unit[];
    facets: any;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'PROJECTS' | 'UNITS'>('UNITS');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const microMarkets = ['ALL', 'Wakad', 'Baner', 'Hinjewadi', 'Balewadi', 'Kharadi', 'Koregaon Park'];
  const configOptions = ['2 BHK', '3 BHK', '3.5 BHK', '4 BHK', 'Penthouse'];
  const facingOptions = ['ALL', 'EAST', 'NORTH_EAST', 'WEST', 'NORTH', 'SOUTH'];
  const amenityOptions = ['Infinity Pool', 'Sky Lounge', 'EV Charging', 'Miyawaki Forest', 'Concierge Desk', 'Clubhouse'];

  const executeSearch = async (currentFilter: UnifiedSearchFilter) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/search/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFilter),
      });
      const json = await res.json();
      if (json.success) {
        setSearchResults(json.data);
      }
    } catch (e) {
      console.error('Failed to execute search', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(filter);
  }, [filter]);

  const toggleConfig = (cfg: string) => {
    setFilter((prev) => {
      const exists = prev.configurations.includes(cfg);
      const updated = exists ? prev.configurations.filter((c) => c !== cfg) : [...prev.configurations, cfg];
      return { ...prev, configurations: updated };
    });
  };

  const toggleAmenity = (am: string) => {
    setFilter((prev) => {
      const exists = prev.amenities.includes(am);
      const updated = exists ? prev.amenities.filter((a) => a !== am) : [...prev.amenities, am];
      return { ...prev, amenities: updated };
    });
  };

  const handleResetFilters = () => {
    setFilter({
      query: '',
      microMarket: 'ALL',
      minPrice: 0,
      maxPrice: 50000000,
      configurations: [],
      facing: 'ALL',
      amenities: [],
      reraVerifiedOnly: false,
      sortOrder: 'FEATURED',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in" id="unified-search-container">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0D1527] via-[#090E17] to-[#05070B] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Search & Spatial Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Discover Verified Real Estate by Parameters, Facets & Solar Orientation
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Multi-dimensional discovery indexing Pune micro-markets, individual floor elevations, Vaastu solar facings, and statutory MahaRERA compliance status.
          </p>

          {/* Search Bar Input */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center rounded-2xl bg-white/[0.06] border border-white/15 p-2 shadow-inner focus-within:border-amber-500/60 focus-within:bg-white/[0.09] transition-all">
              <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
              <input
                type="text"
                id="unified-search-input"
                value={filter.query || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilter((prev) => ({ ...prev, query: val }));
                  // Real-time Natural Language Parser
                  const lower = val.toLowerCase();
                  if (lower.includes('3 bhk') || lower.includes('3bhk')) {
                    if (!filter.configurations.includes('3 BHK')) {
                      setFilter((prev) => ({ ...prev, configurations: ['3 BHK'] }));
                    }
                  }
                  if (lower.includes('hinjewadi')) {
                    setFilter((prev) => ({ ...prev, microMarket: 'Hinjewadi' }));
                  } else if (lower.includes('wakad')) {
                    setFilter((prev) => ({ ...prev, microMarket: 'Wakad' }));
                  } else if (lower.includes('baner')) {
                    setFilter((prev) => ({ ...prev, microMarket: 'Baner' }));
                  }
                  if (lower.includes('1.5') || lower.includes('1.5 cr') || lower.includes('1.5 crore')) {
                    setFilter((prev) => ({ ...prev, maxPrice: 15000000 }));
                  }
                }}
                placeholder="Type in plain English: '3 BHK under 1.5 crore near Hinjewadi' or 'East facing penthouse Baner'..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              {filter.query && (
                <button
                  onClick={() => setFilter({ ...filter, query: '' })}
                  className="px-2 py-1 text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Natural Language Prompts */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-400 opacity-80 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Prompts:
              </span>
              {[
                '3 BHK under 1.5 crore near Hinjewadi',
                'East facing luxury 3 BHK in Wakad',
                'Penthouse with Sky Lounge in Baner',
              ].map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  onClick={() => {
                    const lower = promptText.toLowerCase();
                    let market = 'ALL';
                    let configs: string[] = [];
                    let maxP = 50000000;
                    let facing = 'ALL';

                    if (lower.includes('hinjewadi')) market = 'Hinjewadi';
                    if (lower.includes('wakad')) market = 'Wakad';
                    if (lower.includes('baner')) market = 'Baner';
                    if (lower.includes('3 bhk')) configs = ['3 BHK'];
                    if (lower.includes('penthouse')) configs = ['Penthouse'];
                    if (lower.includes('1.5')) maxP = 15000000;
                    if (lower.includes('east')) facing = 'EAST';

                    setFilter((prev) => ({
                      ...prev,
                      query: promptText,
                      microMarket: market,
                      configurations: configs,
                      maxPrice: maxP,
                      facing,
                    }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-white/70 hover:text-amber-400 border border-white/10 text-[11px] transition-all cursor-pointer"
                >
                  "{promptText}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-[#0B111E]/90 border border-white/10 p-5 space-y-6 backdrop-blur-md sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>Multi-Facet Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Micro-Market */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Micro-Market</label>
              <select
                id="search-micromarket-select"
                value={filter.microMarket}
                onChange={(e) => setFilter({ ...filter, microMarket: e.target.value })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                {microMarkets.map((m) => (
                  <option key={m} value={m} className="bg-[#0D1527] text-white">
                    {m === 'ALL' ? 'All Micro-Markets' : m}
                    {searchResults?.facets?.microMarkets?.[m] ? ` (${searchResults.facets.microMarkets[m]})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white/70 uppercase tracking-wider">Budget Ceiling</span>
                <span className="font-bold text-amber-400">{formatINR(filter.maxPrice)}</span>
              </div>
              <input
                type="range"
                min={10000000}
                max={60000000}
                step={2500000}
                value={filter.maxPrice}
                onChange={(e) => setFilter({ ...filter, maxPrice: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40">
                <span>₹1.0 Cr</span>
                <span>₹3.0 Cr</span>
                <span>₹6.0 Cr</span>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Configuration</label>
              <div className="flex flex-wrap gap-1.5">
                {configOptions.map((cfg) => {
                  const isSelected = filter.configurations.includes(cfg);
                  const count = searchResults?.facets?.configurations?.[cfg] || 0;
                  return (
                    <button
                      key={cfg}
                      onClick={() => toggleConfig(cfg)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black font-bold shadow-md'
                          : 'bg-white/[0.04] text-white/70 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {cfg}
                      {count > 0 && <span className="ml-1 opacity-60 text-[10px]">({count})</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transaction Mode (Buy, Rent, Lease, Invest) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Transaction Mode</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['BUY', 'RENT', 'LEASE', 'INVEST'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilter({ ...filter, transactionMode: mode })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      (filter.transactionMode || 'BUY') === mode
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Property Type</label>
              <select
                value={(filter.propertyTypes && filter.propertyTypes[0]) || 'ALL'}
                onChange={(e) => setFilter({ ...filter, propertyTypes: e.target.value === 'ALL' ? [] : [e.target.value] })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="ALL" className="bg-[#0D1527] text-white">All Types</option>
                <option value="Apartment" className="bg-[#0D1527] text-white">Luxury Apartment</option>
                <option value="Penthouse" className="bg-[#0D1527] text-white">Sky Penthouse</option>
                <option value="Villa" className="bg-[#0D1527] text-white">Independent Villa</option>
                <option value="Commercial" className="bg-[#0D1527] text-white">Commercial Office / IT</option>
                <option value="Retail" className="bg-[#0D1527] text-white">Retail Showroom</option>
                <option value="Plot" className="bg-[#0D1527] text-white">Gated Estate Plot</option>
              </select>
            </div>

            {/* Floor Rise Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Floor Rise</label>
              <select
                value={filter.floorRise || 'ALL'}
                onChange={(e) => setFilter({ ...filter, floorRise: e.target.value as any })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="ALL" className="bg-[#0D1527] text-white">Any Floor (Ground to Sky)</option>
                <option value="LOW" className="bg-[#0D1527] text-white">Low Rise (Floors 1 - 5)</option>
                <option value="MID" className="bg-[#0D1527] text-white">Mid Rise (Floors 6 - 15)</option>
                <option value="HIGH" className="bg-[#0D1527] text-white">High Sky Deck (Floors 16+)</option>
              </select>
            </div>

            {/* Furnishing & Parking */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/70 uppercase">Furnishing</label>
                <select
                  value={filter.furnishing || 'ALL'}
                  onChange={(e) => setFilter({ ...filter, furnishing: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-2 py-1.5 text-xs text-white"
                >
                  <option value="ALL" className="bg-[#0D1527] text-white">Any</option>
                  <option value="BARE_SHELL" className="bg-[#0D1527] text-white">Bare Shell</option>
                  <option value="SEMI_FURNISHED" className="bg-[#0D1527] text-white">Semi-Furnished</option>
                  <option value="DESIGNER_FURNISHED" className="bg-[#0D1527] text-white">Designer Furnished</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/70 uppercase">Covered Parking</label>
                <select
                  value={filter.parking || 'ALL'}
                  onChange={(e) => setFilter({ ...filter, parking: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-2 py-1.5 text-xs text-white"
                >
                  <option value="ALL" className="bg-[#0D1527] text-white">Any</option>
                  <option value="1_COVERED" className="bg-[#0D1527] text-white">1 Covered</option>
                  <option value="2_COVERED" className="bg-[#0D1527] text-white">2 Covered</option>
                  <option value="3_PLUS" className="bg-[#0D1527] text-white">3+ Covered</option>
                </select>
              </div>
            </div>

            {/* Target Yield Slider (When Rent/Lease/Invest selected) */}
            {(filter.transactionMode === 'INVEST' || filter.transactionMode === 'RENT' || filter.transactionMode === 'LEASE') && (
              <div className="space-y-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-amber-400 uppercase">Target Rental Yield</span>
                  <span className="font-bold text-amber-400 font-mono">≥ {filter.minYieldPercent || 4.5}%</span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={9.0}
                  step={0.5}
                  value={filter.minYieldPercent || 4.5}
                  onChange={(e) => setFilter({ ...filter, minYieldPercent: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}

            {/* Solar Facing / Orientation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-semibold text-white/70 uppercase tracking-wider">
                <Compass className="w-3 h-3 text-amber-400" />
                <span>Vaastu / Solar Facing</span>
              </div>
              <select
                id="search-facing-select"
                value={filter.facing || 'ALL'}
                onChange={(e) => setFilter({ ...filter, facing: e.target.value })}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                {facingOptions.map((f) => (
                  <option key={f} value={f} className="bg-[#0D1527] text-white">
                    {f === 'ALL' ? 'Any Orientation' : f.replace('_', ' ')}
                    {searchResults?.facets?.facings?.[f] ? ` (${searchResults.facets.facings[f]})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* MahaRERA Verified Only */}
            <div className="pt-2 border-t border-white/10">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.reraVerifiedOnly}
                  onChange={(e) => setFilter({ ...filter, reraVerifiedOnly: e.target.checked })}
                  className="rounded border-white/20 text-amber-500 focus:ring-amber-500/50 accent-amber-500 w-4 h-4"
                />
                <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MahaRERA Verified Only</span>
                </div>
              </label>
            </div>

            {/* Amenities Filters */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Key Amenities</label>
              <div className="space-y-1.5">
                {amenityOptions.map((am) => {
                  const isChecked = filter.amenities.includes(am);
                  return (
                    <label key={am} className="flex items-center gap-2 text-xs text-white/70 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(am)}
                        className="rounded border-white/20 text-amber-500 accent-amber-500 w-3.5 h-3.5"
                      />
                      <span>{am}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveViewMode('UNITS')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeViewMode === 'UNITS'
                    ? 'bg-amber-500 text-black shadow-lg'
                    : 'bg-white/[0.05] text-white/70 hover:bg-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Unit Digital Twins ({searchResults?.filteredUnits?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveViewMode('PROJECTS')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeViewMode === 'PROJECTS'
                    ? 'bg-amber-500 text-black shadow-lg'
                    : 'bg-white/[0.05] text-white/70 hover:bg-white/10'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Projects ({searchResults?.filteredProjects?.length || 0})</span>
              </button>
            </div>

            {/* Sort Order Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/50">Sort by:</span>
              <select
                id="search-sort-select"
                value={filter.sortOrder}
                onChange={(e) => setFilter({ ...filter, sortOrder: e.target.value as any })}
                className="rounded-xl bg-white/[0.05] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="FEATURED" className="bg-[#0D1527]">Featured First</option>
                <option value="PRICE_LOW_HIGH" className="bg-[#0D1527]">Price: Low to High</option>
                <option value="PRICE_HIGH_LOW" className="bg-[#0D1527]">Price: High to Low</option>
                <option value="CARPET_AREA_HIGH_LOW" className="bg-[#0D1527]">Carpet Area: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-white/50">Scanning spatial index and live inventory database...</p>
            </div>
          )}

          {/* VIEW MODE 1: INDIVIDUAL UNIT DIGITAL TWINS */}
          {!loading && activeViewMode === 'UNITS' && (
            <div className="space-y-4">
              {searchResults?.filteredUnits?.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
                  <Layers className="w-10 h-10 text-white/20 mx-auto" />
                  <h3 className="text-base font-semibold text-white">No Matching Unit Twins Found</h3>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Try broadening your budget threshold, selecting alternate facing orientations, or clearing specific configuration filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(searchResults?.filteredUnits || []).map((unit) => {
                    const parentProject = searchResults?.filteredProjects?.find((p) => p.id === unit.projectId);
                    return (
                      <div
                        key={unit.id}
                        className="rounded-2xl bg-[#0C1220]/90 border border-white/10 p-5 space-y-4 hover:border-amber-500/40 hover:shadow-xl transition-all group"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                              {unit.projectName}
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                              Unit {unit.unitNumber}
                            </h3>
                            <p className="text-xs text-white/50">{unit.configuration} • Level {unit.floorNumber}</p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              unit.status === 'AVAILABLE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {unit.status}
                          </span>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-center text-xs">
                          <div className="p-2 rounded-xl bg-white/[0.03]">
                            <span className="block text-[10px] text-white/40 uppercase">Carpet Area</span>
                            <span className="font-bold text-white">{unit.carpetAreaSqFt} sq.ft</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white/[0.03]">
                            <span className="block text-[10px] text-white/40 uppercase">Facing</span>
                            <span className="font-bold text-amber-400">{unit.facing?.replace('_', ' ') || 'EAST'}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white/[0.03]">
                            <span className="block text-[10px] text-white/40 uppercase">Balcony</span>
                            <span className="font-bold text-white">{unit.balconyAreaSqFt} sq.ft</span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-white/40 block">All-in Indicative Price</span>
                            <span className="text-lg font-bold text-white">{formatINR(unit.pricing?.basePrice || 15000000)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onAddToComparison(unit)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
                              title="Add to Side-by-Side Comparison"
                            >
                              <Layers className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => parentProject && onOpenDigitalTwin(parentProject, unit.id)}
                              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Digital Twin</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: PROJECTS VIEW */}
          {!loading && activeViewMode === 'PROJECTS' && (
            <div className="space-y-4">
              {searchResults?.filteredProjects?.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
                  <Building className="w-10 h-10 text-white/20 mx-auto" />
                  <h3 className="text-base font-semibold text-white">No Projects Match Your Filter</h3>
                  <p className="text-xs text-white/50">Try switching your micro-market or relaxing budget criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(searchResults?.filteredProjects || []).map((project) => (
                    <div
                      key={project.id}
                      className="rounded-3xl bg-[#0D1525]/90 border border-white/10 overflow-hidden hover:border-amber-500/40 hover:shadow-2xl transition-all group flex flex-col justify-between"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                          alt={project.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1525] via-transparent to-black/40"></div>
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase">
                            {project.location?.microMarket}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-black text-[10px] font-bold uppercase flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>MahaRERA</span>
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-lg font-serif font-bold text-white leading-snug">{project.name}</h3>
                          <p className="text-xs text-white/70">{project.tagline}</p>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(project.configurations || []).map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-md bg-white/[0.06] text-white/70 text-[10px]">
                              {c}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div>
                            <span className="text-[10px] text-white/40 uppercase block">Starting Price</span>
                            <span className="text-base font-bold text-amber-400">
                              {formatINR(project.headlinePriceRange.min)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onScheduleVisit(project)}
                              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
                            >
                              Schedule Visit
                            </button>
                            <button
                              onClick={() => onOpenDigitalTwin(project)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Explore Twin</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
