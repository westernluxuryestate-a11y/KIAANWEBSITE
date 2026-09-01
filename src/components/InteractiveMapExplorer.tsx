/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  MapPin,
  Layers,
  Navigation,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Building,
  Car,
  Compass,
  DollarSign,
  Maximize2,
  Filter,
  Eye,
  ArrowRight,
  School,
  Briefcase,
  Zap,
} from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/seedData';

interface InteractiveMapExplorerProps {
  onOpenProjectExperience?: (projectId: string) => void;
  onOpenDigitalTwin?: (project: Project, unitId?: string) => void;
  onSelectProject?: (project: Project) => void;
}

export type MapViewMode =
  | 'STANDARD'
  | 'PRICE_HEATMAP'
  | 'RENTAL_YIELD'
  | 'DEMAND_GROWTH'
  | 'PROPERTY_DENSITY'
  | 'PROJECTS_LAYER'
  | 'AMENITIES_POI'
  | 'COMMUTE_ISOCHRONE';

export const InteractiveMapExplorer: React.FC<InteractiveMapExplorerProps> = ({
  onOpenProjectExperience,
  onOpenDigitalTwin,
  onSelectProject,
}) => {
  const [mapMode, setMapMode] = useState<MapViewMode>('PROJECTS_LAYER');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [commuteOrigin, setCommuteOrigin] = useState<'HINJEWADI_PHASE1' | 'BANER_HIGH_STREET' | 'PUNE_AIRPORT'>('HINJEWADI_PHASE1');

  // Pune Micro-Market Spatial Nodes
  const spatialNodes = [
    {
      id: 'node-wakad',
      name: 'Wakad Micro-Market',
      tag: 'Tier-1 IT Corridor Hub',
      coords: { x: 32, y: 38 },
      avgPricePerSqFt: '₹8,450 / sq.ft',
      grossRentalYield: '4.4%',
      fiveYearAppreciationCAGR: '+8.2%',
      demandIndex: 94,
      densityCount: 14,
      projects: [INITIAL_PROJECTS[0]],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'node-baner',
      name: 'Baner & Balewadi High Street',
      tag: 'Executive Lifestyle & Commercial',
      coords: { x: 48, y: 52 },
      avgPricePerSqFt: '₹10,200 / sq.ft',
      grossRentalYield: '3.9%',
      fiveYearAppreciationCAGR: '+8.8%',
      demandIndex: 96,
      densityCount: 19,
      projects: [INITIAL_PROJECTS[1] || INITIAL_PROJECTS[0]],
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'node-hinjewadi',
      name: 'Hinjewadi Tech Corridor',
      tag: 'SEZ & Software Parks (Phase 1-3)',
      coords: { x: 22, y: 30 },
      avgPricePerSqFt: '₹7,100 / sq.ft',
      grossRentalYield: '4.8%',
      fiveYearAppreciationCAGR: '+7.6%',
      demandIndex: 89,
      densityCount: 22,
      projects: [],
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'node-kharadi',
      name: 'Kharadi World Trade Center',
      tag: 'East Pune Tech Core',
      coords: { x: 78, y: 44 },
      avgPricePerSqFt: '₹9,800 / sq.ft',
      grossRentalYield: '4.2%',
      fiveYearAppreciationCAGR: '+8.5%',
      demandIndex: 92,
      densityCount: 16,
      projects: [],
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  const mapModesConfig: { id: MapViewMode; label: string; icon: any; description: string }[] = [
    { id: 'STANDARD', label: 'Standard Map', icon: Navigation, description: 'Satellite & vector street geography with MahaRERA parcels' },
    { id: 'PRICE_HEATMAP', label: 'Price (₹/sq.ft)', icon: DollarSign, description: 'Spatial price distribution from ₹7,100 to ₹14,500/sq.ft' },
    { id: 'RENTAL_YIELD', label: 'Rental Cap Rate', icon: TrendingUp, description: 'Gross rental yields calibrated with actual tenant leases' },
    { id: 'DEMAND_GROWTH', label: 'Demand Velocity', icon: Sparkles, description: 'Quarterly sales absorption & buyer search velocity' },
    { id: 'PROPERTY_DENSITY', label: 'Density & Inventory', icon: Layers, description: 'Tower height, FSI utilization & green density' },
    { id: 'PROJECTS_LAYER', label: 'Kiaan Landmark Assets', icon: Building, description: 'Curated luxury residential & commercial landmarks' },
    { id: 'AMENITIES_POI', label: 'Civic POIs & Schools', icon: School, description: 'IB schools, multispecialty hospitals & Metro corridors' },
    { id: 'COMMUTE_ISOCHRONE', label: 'Drive-Time Isochrones', icon: Car, description: '10, 20 & 30-minute peak-hour transit bubbles' },
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="interactive-map-explorer">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1424] via-[#070D18] to-[#03060C] border border-cyan-500/25 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Spatial Intelligence & GIS Heatmaps</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Pune Micro-Market Spatial Digital Twin & Heatmaps
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Multi-layered GIS visualization: toggle price per square foot, rental yields, transit isochrones, and MahaRERA registered development density across West & East Pune.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 pt-6 border-t border-white/10 relative z-10">
          {mapModesConfig.map((mode) => {
            const Icon = mode.icon;
            const isActive = mapMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setMapMode(mode.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Viewport & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Canvas (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-[#080D18] border border-cyan-500/30 p-4 sm:p-6 shadow-2xl relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Spatial Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

          {/* Isochrone Cones overlay when COMMUTE_ISOCHRONE active */}
          {mapMode === 'COMMUTE_ISOCHRONE' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[360px] h-[360px] rounded-full border border-cyan-400/30 bg-cyan-500/5 animate-pulse flex items-center justify-center">
                <div className="w-[240px] h-[240px] rounded-full border border-emerald-400/40 bg-emerald-500/5 flex items-center justify-center">
                  <div className="w-[120px] h-[120px] rounded-full border border-amber-400/50 bg-amber-500/10"></div>
                </div>
              </div>
            </div>
          )}

          {/* Top Controls Overlay */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 font-bold uppercase">Active View:</span>
              <span className="text-xs font-bold text-cyan-400 font-mono">{mapMode}</span>
            </div>

            {mapMode === 'COMMUTE_ISOCHRONE' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/50">Origin:</span>
                <select
                  value={commuteOrigin}
                  onChange={(e) => setCommuteOrigin(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-xl px-2.5 py-1 text-white text-xs font-bold focus:outline-none"
                >
                  <option value="HINJEWADI_PHASE1" className="bg-[#080D18]">Hinjewadi Tech Phase 1</option>
                  <option value="BANER_HIGH_STREET" className="bg-[#080D18]">Baner High Street</option>
                  <option value="PUNE_AIRPORT" className="bg-[#080D18]">Pune Int'l Airport</option>
                </select>
              </div>
            )}
          </div>

          {/* Spatial Nodes on Canvas */}
          <div className="relative z-10 w-full h-[360px] my-4 relative">
            {spatialNodes.map((node) => {
              const isSelected = selectedCluster === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedCluster(node.id);
                    if (node.projects.length > 0) setSelectedProject(node.projects[0]);
                  }}
                  style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-20"
                >
                  {/* Pin Dot & Ripple */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] shadow-lg shadow-cyan-500/40 group-hover:scale-125 transition-all">
                      <div className="w-full h-full bg-[#080D18] rounded-full flex items-center justify-center text-cyan-300 text-xs font-bold">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full border-2 border-cyan-400 animate-ping pointer-events-none"></span>
                    )}
                  </div>

                  {/* Pin Tooltip Card */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 min-w-[180px] p-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl space-y-1 opacity-90 group-hover:opacity-100 transition-all pointer-events-auto">
                    <div className="text-xs font-bold text-white whitespace-nowrap">{node.name}</div>
                    <div className="text-[10px] text-cyan-300 font-semibold">{node.tag}</div>

                    {mapMode === 'PRICE_HEATMAP' && (
                      <div className="text-xs font-bold text-amber-400 font-mono">{node.avgPricePerSqFt}</div>
                    )}
                    {mapMode === 'RENTAL_YIELD' && (
                      <div className="text-xs font-bold text-emerald-400 font-mono">Gross Yield: {node.grossRentalYield}</div>
                    )}
                    {mapMode === 'DEMAND_GROWTH' && (
                      <div className="text-xs font-bold text-purple-400 font-mono">5-Yr CAGR: {node.fiveYearAppreciationCAGR}</div>
                    )}
                    {mapMode === 'PROPERTY_DENSITY' && (
                      <div className="text-xs font-bold text-blue-400 font-mono">{node.densityCount} Active Towers</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend Footer */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs text-white/70">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &lt;10 Min Transit</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> 10-20 Min Transit</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 20-30 Min Transit</span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">MahaRERA Spatial Baseline • Updated 2026</span>
          </div>
        </div>

        {/* Micro-Market & Selected Asset Details Sidebar */}
        <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase">
                Spatial Node Inspection
              </span>
              <span className="text-xs text-white/40">Pune West</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-white">{selectedProject.name}</h3>
              <p className="text-xs text-white/60">{selectedProject.location.address}</p>
            </div>

            <div className="relative h-36 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={selectedProject.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400">
                {selectedProject.location.microMarket}
              </div>
            </div>

            {/* Micro-Market Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">Starting Guidance</span>
                <span className="text-sm font-bold text-white">{formatINR(selectedProject.headlinePriceRange.min)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">Rental Yield</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">4.4% p.a.</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">Metro Distance</span>
                <span className="text-sm font-bold text-cyan-400">800 Meters</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">MahaRERA Status</span>
                <span className="text-sm font-bold text-amber-400">Registered</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <button
              onClick={() => onOpenDigitalTwin && onOpenDigitalTwin(selectedProject)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Launch 3D Digital Twin Viewer
            </button>
            <button
              onClick={() => onOpenProjectExperience && onOpenProjectExperience(selectedProject.id)}
              className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>Explore Landmark Experience</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
