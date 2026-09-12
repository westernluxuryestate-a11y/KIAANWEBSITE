/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from 'react';
import { Project } from '../../types';
import { formatINR } from '../../services/calculatorEngine';
import {
  MapPin,
  Building,
  Navigation,
  Compass,
  Maximize2,
  Calendar,
  ShieldCheck,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
  Crosshair,
  TrendingUp,
  Car,
  X,
  SlidersHorizontal,
} from 'lucide-react';

interface SearchProjectMapViewProps {
  projects: Project[];
  selectedProject?: Project | null;
  onSelectProject?: (project: Project) => void;
  onOpenDigitalTwin: (project: Project, unitId?: string) => void;
  onScheduleVisit: (project: Project) => void;
  onResetFilters?: () => void;
  activeMicroMarket?: string;
  onSelectMicroMarket?: (market: string) => void;
}

// Fallback coordinate mappings for known Pune micro-markets
const MICRO_MARKET_COORDS: Record<string, { lat: number; lng: number }> = {
  Wakad: { lat: 18.5987, lng: 73.7689 },
  Baner: { lat: 18.559, lng: 73.7868 },
  Hinjewadi: { lat: 18.5913, lng: 73.7389 },
  Balewadi: { lat: 18.5794, lng: 73.7745 },
  Kharadi: { lat: 18.552, lng: 73.942 },
  'Koregaon Park': { lat: 18.5362, lng: 73.894 },
  Kalyani: { lat: 18.548, lng: 73.903 },
  Chakan: { lat: 18.7583, lng: 73.8592 },
  Ravet: { lat: 18.648, lng: 73.739 },
  Tathawade: { lat: 18.618, lng: 73.754 },
  Punawale: { lat: 18.632, lng: 73.745 },
  Bavdhan: { lat: 18.514, lng: 73.772 },
  Aundh: { lat: 18.558, lng: 73.807 },
  Kothrud: { lat: 18.507, lng: 73.807 },
  Viman: { lat: 18.567, lng: 73.914 },
  Magarpatta: { lat: 18.514, lng: 73.929 },
};

export const SearchProjectMapView: React.FC<SearchProjectMapViewProps> = ({
  projects,
  selectedProject: externalSelectedProject,
  onSelectProject,
  onOpenDigitalTwin,
  onScheduleVisit,
  onResetFilters,
  activeMicroMarket = 'ALL',
  onSelectMicroMarket,
}) => {
  const [internalSelectedProject, setInternalSelectedProject] = useState<Project | null>(
    projects.length > 0 ? projects[0] : null
  );
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<'STANDARD' | 'PRICE_HEATMAP' | 'TRANSIT'>('STANDARD');
  const [showBottomStrip, setShowBottomStrip] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeProject = externalSelectedProject || internalSelectedProject || (projects.length > 0 ? projects[0] : null);

  const handleSelect = (project: Project) => {
    setInternalSelectedProject(project);
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  // Calculate dynamic spatial bounds for accurate coordinates normalization
  const bounds = useMemo(() => {
    let minLat = 18.48;
    let maxLat = 18.68;
    let minLng = 73.68;
    let maxLng = 73.96;

    projects.forEach((p) => {
      const coords = p.location?.coordinates || (p.location?.microMarket ? MICRO_MARKET_COORDS[p.location.microMarket] : null);
      if (coords?.lat && coords?.lng) {
        if (coords.lat < minLat) minLat = coords.lat - 0.02;
        if (coords.lat > maxLat) maxLat = coords.lat + 0.02;
        if (coords.lng < minLng) minLng = coords.lng - 0.02;
        if (coords.lng > maxLng) maxLng = coords.lng + 0.02;
      }
    });

    return { minLat, maxLat, minLng, maxLng };
  }, [projects]);

  // Convert GPS Coordinates to Percentage on Canvas
  const getCoordinatesPercent = (project: Project): { x: number; y: number } => {
    const coords =
      project.location?.coordinates ||
      (project.location?.microMarket ? MICRO_MARKET_COORDS[project.location.microMarket] : null) || {
        lat: 18.59,
        lng: 73.78,
      };

    const { minLat, maxLat, minLng, maxLng } = bounds;

    // Normalization with padding
    const rawX = ((coords.lng - minLng) / (maxLng - minLng || 0.01)) * 100;
    // Invert Y because latitude increases northward
    const rawY = ((maxLat - coords.lat) / (maxLat - minLat || 0.01)) * 100;

    // Clamp coordinates safely within canvas
    const x = Math.min(94, Math.max(6, rawX));
    const y = Math.min(90, Math.max(10, rawY));

    return { x, y };
  };

  // Mouse pan event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-pin, .map-control-btn, .project-card-overlay')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(2.5, prev + 0.3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(0.8, prev - 0.3));

  // Extract unique micro-markets from current projects
  const availableMarkets = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.location?.microMarket) set.add(p.location.microMarket);
    });
    return Array.from(set);
  }, [projects]);

  return (
    <div
      id="search-project-map-view"
      className="relative w-full rounded-3xl bg-[#070B14] border border-white/10 shadow-2xl overflow-hidden select-none"
    >
      {/* 1. Map Controls Top Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Interactive Project Locations</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} Mapped
              </span>
            </div>
            <p className="text-[11px] text-white/50">Pune Western & Eastern Development Corridors</p>
          </div>
        </div>

        {/* Micro-market quick filters directly on map */}
        {onSelectMicroMarket && availableMarkets.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
            <button
              type="button"
              onClick={() => onSelectMicroMarket('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeMicroMarket === 'ALL'
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              All ({projects.length})
            </button>
            {availableMarkets.map((m) => {
              const count = projects.filter((p) => p.location?.microMarket === m).length;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => onSelectMicroMarket(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeMicroMarket === m
                      ? 'bg-amber-500 text-black font-bold shadow-md'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {m} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Layer & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveLayer('STANDARD')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                activeLayer === 'STANDARD' ? 'bg-amber-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('PRICE_HEATMAP')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                activeLayer === 'PRICE_HEATMAP' ? 'bg-amber-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Price Bands
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('TRANSIT')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                activeLayer === 'TRANSIT' ? 'bg-amber-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Metro & Highway
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={zoomIn}
              title="Zoom In"
              className="map-control-btn p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={zoomOut}
              title="Zoom Out"
              className="map-control-btn p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetView}
              title="Reset View"
              className="map-control-btn p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Map Stage Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[580px] bg-[#060A13] overflow-hidden cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {/* Architectural GIS Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>

        {/* Scalable and Pannable Map Container */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '50% 50%',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Arterial Waterways and Transit Contours */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
            {/* Mula-Mutha River Ribbon */}
            <path
              d="M 20 220 Q 220 280 440 260 T 800 320 T 1200 350"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Pavana River Ribbon */}
            <path
              d="M 60 120 Q 200 160 380 180 T 680 200"
              fill="none"
              stroke="#0284c7"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Mumbai-Pune Expressway Spine (Golden Arterial) */}
            <path
              d="M 50 60 Q 220 180 450 260 T 850 400"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="8 6"
            />

            {/* Pune Metro Line 3 Spine (Hinjewadi - Shivaji Nagar) */}
            {activeLayer === 'TRANSIT' && (
              <path
                d="M 120 160 L 320 220 L 520 260 L 740 310"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* Micro-Market Ambient Text Markers */}
          <div className="absolute top-[18%] left-[22%] text-white/20 font-serif font-bold text-xs uppercase tracking-widest pointer-events-none">
            Hinjewadi Tech Corridor
          </div>
          <div className="absolute top-[32%] left-[42%] text-white/20 font-serif font-bold text-xs uppercase tracking-widest pointer-events-none">
            Wakad Luxury Belt
          </div>
          <div className="absolute top-[48%] left-[54%] text-white/20 font-serif font-bold text-xs uppercase tracking-widest pointer-events-none">
            Baner & Balewadi Boulevard
          </div>
          <div className="absolute top-[45%] left-[82%] text-white/20 font-serif font-bold text-xs uppercase tracking-widest pointer-events-none">
            East Pune / Kharadi
          </div>

          {/* Price Heatmap Overlay Halos */}
          {activeLayer === 'PRICE_HEATMAP' && (
            <>
              {/* Baner High Street Premium Zone */}
              <div className="absolute top-[45%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
              {/* Wakad Growth Zone */}
              <div className="absolute top-[30%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>
              {/* Hinjewadi Phase Zone */}
              <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
            </>
          )}

          {/* Transit Metro Station Nodes */}
          {activeLayer === 'TRANSIT' && (
            <>
              {[
                { name: 'Metro Phase 1 Infosys Station', x: 20, y: 19 },
                { name: 'Metro Wakad Chowk Station', x: 42, y: 32 },
                { name: 'Metro Balewadi Stadium Station', x: 55, y: 46 },
                { name: 'Baner High Street Metro Station', x: 62, y: 52 },
              ].map((stn, idx) => (
                <div
                  key={idx}
                  style={{ left: `${stn.x}%`, top: `${stn.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md text-[9px] text-emerald-300 font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{stn.name}</span>
                </div>
              ))}
            </>
          )}

          {/* ZERO RESULTS FALLBACK */}
          {projects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              <div className="p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 text-center max-w-md pointer-events-auto space-y-3">
                <MapPin className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
                <h3 className="text-base font-bold text-white">No Project Locations Match Current Filters</h3>
                <p className="text-xs text-white/60">
                  Try broadening your price range, clearing configuration filters, or selecting "All" micro-markets.
                </p>
                {onResetFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. PROJECT PINS ON MAP */}
          {projects.map((project) => {
            const pos = getCoordinatesPercent(project);
            const isSelected = activeProject?.id === project.id;
            const isHovered = hoveredProject?.id === project.id;

            const minPrice = project.headlinePriceRange?.min || 0;
            const priceLabel = formatINR(minPrice);
            const microMarket = project.location?.microMarket || 'Pune';

            return (
              <div
                key={project.id}
                id={`project-map-pin-${project.id}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(project);
                }}
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`interactive-pin absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group ${
                  isSelected ? 'z-40 scale-110' : isHovered ? 'z-30 scale-105' : 'z-20'
                }`}
              >
                {/* Active / Hover Pulse Rings */}
                {isSelected && (
                  <span className="absolute -inset-3 rounded-full bg-amber-400/30 animate-ping pointer-events-none"></span>
                )}

                {/* Pin Header Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xl transition-all border ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-300 font-extrabold shadow-amber-500/50'
                      : isHovered
                      ? 'bg-white text-black border-white shadow-xl'
                      : 'bg-[#0B1220]/95 text-white border-amber-500/50 hover:border-amber-400'
                  }`}
                >
                  <MapPin
                    className={`w-3.5 h-3.5 ${
                      isSelected || isHovered ? 'text-black fill-black' : 'text-amber-400'
                    }`}
                  />
                  <span className="text-xs font-bold whitespace-nowrap">{priceLabel}</span>
                </div>

                {/* Subtitle Label under Pin */}
                <div className="mt-1 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap backdrop-blur-md shadow-sm transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-black/75 text-white/90 border border-white/10'
                    }`}
                  >
                    {project.name}
                  </span>
                </div>

                {/* Hover Preview Card (when not selected) */}
                {isHovered && !isSelected && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 min-w-[220px] p-3 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2 pointer-events-none z-50 animate-fade-in">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold text-amber-400">{microMarket}</span>
                      <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        MahaRERA
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{project.name}</div>
                    <div className="text-[11px] text-amber-300 font-semibold">{project.headlinePriceRange.displayString}</div>
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-white/10">
                      {(project.configurations || []).slice(0, 3).map((cfg) => (
                        <span key={cfg} className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/80">
                          {cfg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. SELECTED PROJECT FLYOUT / DRAWER CARD */}
        {activeProject && (
          <div
            id="active-project-map-card"
            className="project-card-overlay absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[380px] p-4 rounded-3xl bg-[#090F1C]/95 backdrop-blur-2xl border border-amber-500/40 shadow-2xl z-30 space-y-3 animate-fade-in"
          >
            {/* Card Header with Image and Dismiss */}
            <div className="relative h-32 rounded-2xl overflow-hidden group">
              <img
                src={
                  activeProject.media?.[0]?.url ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                }
                alt={activeProject.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090F1C] via-black/20 to-transparent"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setInternalSelectedProject(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black transition-colors cursor-pointer"
                title="Dismiss Card"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Badges on Image */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-amber-400 text-[10px] font-bold uppercase">
                  {activeProject.location?.microMarket || 'Pune'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-black text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  MahaRERA
                </span>
              </div>

              {/* Title & Tagline on Bottom of Image */}
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-base font-bold text-white leading-tight drop-shadow-md">{activeProject.name}</h3>
                <p className="text-[11px] text-white/70 truncate">{activeProject.tagline}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-white/40 uppercase block">Starting Price</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {formatINR(activeProject.headlinePriceRange?.min || 0)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-white/40 uppercase block">Configurations</span>
                <div className="flex flex-wrap gap-1">
                  {(activeProject.configurations || []).slice(0, 2).map((cfg) => (
                    <span key={cfg} className="text-xs font-semibold text-white">
                      {cfg}
                    </span>
                  ))}
                  {(activeProject.configurations || []).length > 2 && (
                    <span className="text-[10px] text-white/50">+{activeProject.configurations.length - 2}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Landmarks / Connectivity Snippet */}
            {activeProject.location?.address && (
              <div className="flex items-start gap-1.5 text-[11px] text-white/60">
                <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{activeProject.location.address}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => onScheduleVisit(activeProject)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Schedule Visit
              </button>
              <button
                type="button"
                onClick={() => onOpenDigitalTwin(activeProject)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Explore Twin</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Toggle for Bottom Project Strip */}
        <button
          type="button"
          onClick={() => setShowBottomStrip((prev) => !prev)}
          className="map-control-btn absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer z-30"
        >
          <Building className="w-3.5 h-3.5 text-amber-400" />
          <span>{showBottomStrip ? 'Hide Gallery Strip' : 'Show Mapped Projects'}</span>
        </button>
      </div>

      {/* 5. BOTTOM PROJECT CAROUSEL / STRIP */}
      {showBottomStrip && projects.length > 0 && (
        <div className="p-3 bg-black/80 backdrop-blur-md border-t border-white/10 overflow-x-auto">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider whitespace-nowrap pl-2">
              Mapped Assets:
            </span>
            {projects.map((proj) => {
              const isSelected = activeProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleSelect(proj)}
                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <img
                    src={
                      proj.media?.[0]?.url ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={proj.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight truncate max-w-[120px]">{proj.name}</div>
                    <div className="text-[10px] text-amber-400 font-mono">{formatINR(proj.headlinePriceRange?.min || 0)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
