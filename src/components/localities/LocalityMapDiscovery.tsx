/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  MapPin,
  Building,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Maximize2,
  Navigation,
  Compass,
  Crosshair,
} from 'lucide-react';
import { Locality, Project, Property } from '../../types';
import { localityIntelligenceService } from '../../services/localityIntelligenceService';
import { PuneLocationHierarchyView } from './PuneLocationHierarchyView';
import { PUNE_ZONES } from '../../data/puneLocationHierarchy';

interface LocalityMapDiscoveryProps {
  localities: Locality[];
  allProjects: Project[];
  allProperties: Property[];
  onSelectLocality: (locality: Locality) => void;
  theme?: 'dark' | 'light';
}

export const LocalityMapDiscovery: React.FC<LocalityMapDiscoveryProps> = ({
  localities,
  allProjects,
  allProperties,
  onSelectLocality,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(localities[0] || null);
  const [activeZoneFilter, setActiveZoneFilter] = useState<string>('ALL');
  const [focusedPin, setFocusedPin] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const mapStageRef = useRef<HTMLDivElement>(null);

  // Dynamic normalization bounds for Pune Metro region
  const getPositionPercent = (lat: number, lng: number) => {
    // Normalization bounds for Pune Metropolitan region
    const minLat = 18.44;
    const maxLat = 18.67;
    const minLng = 73.70;
    const maxLng = 73.99;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert y because latitude increases upwards
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.min(92, Math.max(8, x)),
      y: Math.min(88, Math.max(12, y)),
    };
  };

  const filteredLocalities = localities.filter((loc) => {
    if (activeZoneFilter !== 'ALL' && loc.zoneId !== activeZoneFilter) {
      return false;
    }
    return true;
  });

  const handleFocusCoordinates = (coords: { lat: number; lng: number; name: string }) => {
    setFocusedPin(coords);
    // Find matching locality if any
    const match = localities.find(
      (l) =>
        Math.abs(l.coordinates.lat - coords.lat) < 0.015 &&
        Math.abs(l.coordinates.lng - coords.lng) < 0.015
    );
    if (match) {
      setSelectedLocality(match);
    }
    // Scroll map smoothly into view
    mapStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="space-y-6">
      <div
        ref={mapStageRef}
        className={`relative w-full rounded-2xl border overflow-hidden transition-all ${
          isDark
            ? 'bg-[#090D16] border-white/10 shadow-2xl text-white'
            : 'bg-slate-50 border-slate-200 shadow-xl text-slate-900'
        }`}
      >
        {/* Map Control Toolbar */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b ${
            isDark ? 'bg-slate-950/80 border-white/10' : 'bg-white/90 border-slate-200'
          } backdrop-blur-md z-10 relative gap-3`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Geographic Micro-Market Navigator</h3>
              <p className="text-[11px] opacity-60">Interactive Pune Metro Corridor Map with Coordinates</p>
            </div>
          </div>

          {/* Quick Zone Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveZoneFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeZoneFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : isDark
                  ? 'bg-white/5 text-white/70 hover:bg-white/10'
                  : 'bg-black/5 text-slate-700 hover:bg-black/10'
              }`}
            >
              All Zones
            </button>
            {Object.values(PUNE_ZONES).map((z) => (
              <button
                key={z.id}
                onClick={() => setActiveZoneFilter(z.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeZoneFilter === z.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : isDark
                    ? 'bg-white/5 text-white/70 hover:bg-white/10'
                    : 'bg-black/5 text-slate-700 hover:bg-black/10'
                }`}
              >
                {z.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Map Stage Container */}
        <div className="relative w-full h-[520px] bg-gradient-to-br from-[#0c1222] via-[#080d19] to-[#040810] overflow-hidden select-none">
          {/* Subtle Architectural Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* River Waterways / Arterial Highways Representation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
            {/* Mula River Line */}
            <path
              d="M 50 180 Q 250 220 450 250 T 850 280 T 1200 320"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Mumbai-Pune Expressway Spine */}
            <path
              d="M 80 80 Q 280 200 520 280 T 950 420"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Focused Micro Pin (Targeted from Hierarchy) */}
          {focusedPin && (
            (() => {
              const pos = getPositionPercent(focusedPin.lat, focusedPin.lng);
              return (
                <div
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer pointer-events-none"
                >
                  <span className="absolute -inset-3 rounded-full bg-red-400/40 animate-ping" />
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white font-bold text-xs shadow-xl border border-white/40">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>{focusedPin.name}</span>
                  </div>
                </div>
              );
            })()
          )}

          {/* Locality Pins */}
          {filteredLocalities.map((loc) => {
            const pos = getPositionPercent(loc.coordinates.lat, loc.coordinates.lng);
            const isSelected = selectedLocality?.id === loc.id;

            return (
              <div
                key={loc.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                onClick={() => {
                  setSelectedLocality(loc);
                  setFocusedPin(null);
                }}
              >
                {/* Radar pulse for selected pin */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping" />
                )}

                {/* Pin Bubble */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold scale-110 shadow-amber-500/30 z-30'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-white/20 text-white hover:scale-105 hover:border-amber-400/60'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="text-xs font-semibold tracking-tight">{loc.name}</span>
                  {loc.priceIntelligence?.averagePricePerSqFt && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-black/20 text-slate-950 font-bold' : 'bg-white/10 text-amber-300'
                      }`}
                    >
                      ₹{(loc.priceIntelligence.averagePricePerSqFt / 1000).toFixed(1)}k
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Floating Selected Locality Quick Drawer */}
          {selectedLocality && (
            <div
              className={`absolute bottom-5 left-5 right-5 sm:left-auto sm:right-6 sm:w-96 rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 z-30 shadow-2xl ${
                isDark
                  ? 'bg-slate-900/95 border-white/15 text-white'
                  : 'bg-white/95 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedLocality.coverImage}
                    alt={selectedLocality.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold tracking-tight">{selectedLocality.name}</h4>
                      {selectedLocality.zoneName && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                          {selectedLocality.zoneName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-60">
                      {selectedLocality.city}, Maharashtra • PIN {selectedLocality.pincode}
                    </p>
                    <p className="text-[10px] font-mono text-amber-400/90 mt-0.5">
                      {selectedLocality.coordinates.lat.toFixed(4)}° N, {selectedLocality.coordinates.lng.toFixed(4)}° E
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs opacity-75 line-clamp-2 mt-3">
                {selectedLocality.shortDescription}
              </p>

              {/* Sub-localities preview */}
              {selectedLocality.subLocalities && selectedLocality.subLocalities.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <span className="text-white/50 text-[10px] font-semibold">Sub-areas:</span>
                  {selectedLocality.subLocalities.slice(0, 3).map((sub) => (
                    <span
                      key={sub.id}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-white/80 border border-white/10 whitespace-nowrap text-[10px]"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Micro Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
                <div className="p-2 rounded-xl bg-white/[0.04]">
                  <div className="text-[10px] opacity-60 uppercase font-semibold">Avg ₹/Sq.Ft</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                    ₹{selectedLocality.priceIntelligence?.averagePricePerSqFt.toLocaleString('en-IN') || 'N/A'}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.04]">
                  <div className="text-[10px] opacity-60 uppercase font-semibold">Appreciation</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                    +{selectedLocality.priceIntelligence?.yoyGrowthPercent || 8}%
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.04]">
                  <div className="text-[10px] opacity-60 uppercase font-semibold">Rental Yield</div>
                  <div className="text-xs font-mono font-bold text-purple-400 mt-0.5">
                    {selectedLocality.priceIntelligence?.rentalYieldPercent || 4}%
                  </div>
                </div>
              </div>

              {/* Direct Link Button */}
              <button
                onClick={() => onSelectLocality(selectedLocality)}
                className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                Open Full {selectedLocality.name} Locality Page
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-white/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Locality Hub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-[#38bdf8] inline-block" />
              <span>Mula Riverfront</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-amber-500 inline-block border-t border-dashed" />
              <span>Expressway Corridor</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pune Location Hierarchy Section - Positioned Directly Below the Map */}
      <PuneLocationHierarchyView
        localities={localities}
        onSelectLocality={onSelectLocality}
        onFocusCoordinates={handleFocusCoordinates}
        theme={theme}
      />
    </div>
  );
};

