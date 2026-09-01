/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Sun,
  Moon,
  Compass,
  Layers,
  Sparkles,
  Maximize2,
  Building,
  Eye,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Flame,
  Thermometer,
  Zap,
  Waves,
  Trees,
  Maximize,
  Check,
  Building2,
  Armchair,
} from 'lucide-react';
import { Project, Unit, RoomLayoutPolygon, MasterPlanHotspot } from '../types';
import {
  calculateSunlightOrientation,
  calculateElevationMetrics,
  getStandardRoomPolygons,
} from '../services/digitalTwinEngine';
import { formatINR } from '../services/calculatorEngine';
import { ReraBadge } from './ReraBadge';

interface DigitalTwinViewerProps {
  project: Project;
  initialUnit?: Unit | null;
  onClose: () => void;
  onSelectUnitToHold?: (unit: Unit) => void;
  onAddToCompare?: (unit: Unit) => void;
}

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({
  project,
  initialUnit,
  onClose,
  onSelectUnitToHold,
  onAddToCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'tower' | 'masterplan'>('blueprint');

  // Blueprint / Unit selection state
  const allProjectUnits = useMemo(() => {
    const list: Unit[] = [];
    (project.towers || []).forEach((t) => {
      (t.floors || []).forEach((fl) => {
        (fl.units || []).forEach((u) => list.push(u));
      });
    });
    return list;
  }, [project]);

  const [selectedUnit, setSelectedUnit] = useState<Unit>(
    initialUnit || allProjectUnits[0] || {
      id: 'default_u1',
      projectId: project.id,
      projectName: project.name,
      towerId: 'tow_vertica_a',
      towerName: 'Tower A — The Solitaire',
      floorNumber: 12,
      unitNumber: 'A-1201',
      configuration: '3 BHK Grande',
      carpetAreaSqFt: 1245,
      facing: 'EAST',
      orientationView: 'Morning Sunlight & Hinjewadi Skyline',
      balconiesCount: 2,
      parkingSlots: 2,
      pricing: {
        basePrice: 14800000,
        pricePerSqFt: 11887,
        carParkingCharges: 350000,
        clubhouseMaintenanceCharges: 250000,
        estimatedGstPercent: 5,
        estimatedStampDutyPercent: 6,
        registrationCharges: 30000,
        maintenanceDeposit1Yr: 59760,
        totalEstimatedAcquisitionCost: 16738000,
        comparableMarketRange: { min: 14200000, max: 15500000, positioning: 'FAIR' },
      },
      status: 'AVAILABLE',
      floorPlan: {
        id: 'fp_default',
        title: '3 BHK Grande Sky Residence',
        configuration: '3 BHK',
        carpetAreaSqFt: 1245,
        balconySqFt: 180,
        layoutImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        dimensions: [],
      },
      images: [],
      lastUpdated: new Date().toISOString(),
    }
  );

  // Sunlight study state
  const [timeOfDayHour, setTimeOfDayHour] = useState<number>(8.5); // 08:30 AM
  const [isSimulatingSunlight, setIsSimulatingSunlight] = useState<boolean>(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room_living');
  const [furnitureStaging, setFurnitureStaging] = useState<'MINIMALIST' | 'LUXURY_CLASSIC' | 'BARE_SHELL'>('MINIMALIST');
  const [showSightlines, setShowSightlines] = useState<boolean>(true);

  // Tower elevation state
  const [selectedFloor, setSelectedFloor] = useState<number>(selectedUnit.floorNumber || 12);

  // Master plan hotspot state
  const [selectedHotspot, setSelectedHotspot] = useState<MasterPlanHotspot | null>(
    project.masterPlanHotspots?.[0] || null
  );

  // Room polygons
  const roomPolygons = useMemo(() => {
    return getStandardRoomPolygons(selectedUnit.configuration);
  }, [selectedUnit.configuration]);

  const activeRoom = roomPolygons.find((r) => r.roomId === selectedRoomId) || roomPolygons[0];

  // Sunlight Calculation for current unit and time
  const sunlightResult = useMemo(() => {
    return calculateSunlightOrientation({
      timeOfDayHour,
      facing: selectedUnit.facing,
      rooms: roomPolygons,
    });
  }, [timeOfDayHour, selectedUnit.facing, roomPolygons]);

  // Elevation Metrics for selected floor
  const elevationMetrics = useMemo(() => {
    return calculateElevationMetrics(selectedFloor, 32);
  }, [selectedFloor]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-[#0B0F19] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold">
              3D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">{project.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-bold text-blue-400">
                  Digital Twin 2.0
                </span>
              </div>
              <p className="text-xs text-white/50">{project.location.microMarket}, {project.location.city} • MahaRERA {project.reraRecord.registrationNumber}</p>
            </div>
          </div>

          {/* Navigation Modes Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-black/50 border border-white/10 rounded-2xl">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'blueprint'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Floor Plan & Sunlight</span>
            </button>
            <button
              onClick={() => setActiveTab('tower')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'tower'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Tower Stack & Horizon Vista</span>
            </button>
            <button
              onClick={() => setActiveTab('masterplan')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'masterplan'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Master Plan & Amenities</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: INTERACTIVE FLOOR PLAN & SUNLIGHT SIMULATOR */}
          {/* ========================================================================= */}
          {activeTab === 'blueprint' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive SVG Blueprint + Live Sunlight Overlay (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Unit Switcher & Orientation Indicator */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50 uppercase font-bold tracking-wider">Select Unit:</span>
                    <select
                      value={selectedUnit.id}
                      onChange={(e) => {
                        const found = allProjectUnits.find((u) => u.id === e.target.value);
                        if (found) setSelectedUnit(found);
                      }}
                      className="bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {allProjectUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.unitNumber} ({u.configuration} • {u.carpetAreaSqFt} sq.ft • {u.facing} Facing • Floor {u.floorNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-mono flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedUnit.facing} FACING</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      {selectedUnit.status}
                    </span>
                  </div>
                </div>

                {/* SVG Blueprint Canvas */}
                <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1422] to-[#070a10] border border-white/15 p-6 shadow-inner overflow-hidden min-h-[440px] flex flex-col justify-between">
                  {/* Cardinal Compass Overlay */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col items-center bg-black/60 border border-white/10 backdrop-blur-md px-3 py-2 rounded-2xl text-[11px] font-mono text-white/70">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Sun className="w-3.5 h-3.5" />
                      <span>Azimuth: {sunlightResult.sunAzimuthDegrees}°</span>
                    </div>
                    <div className="text-[10px] text-white/50">Altitude: {sunlightResult.sunAltitudeDegrees}°</div>
                  </div>

                  {/* Staging & Sightlines toggles */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/70 border border-white/10 backdrop-blur-md p-1 rounded-xl text-[11px]">
                      <button
                        onClick={() => setFurnitureStaging('MINIMALIST')}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          furnitureStaging === 'MINIMALIST' ? 'bg-amber-500 text-black font-bold' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Modern Staged
                      </button>
                      <button
                        onClick={() => setFurnitureStaging('BARE_SHELL')}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          furnitureStaging === 'BARE_SHELL' ? 'bg-amber-500 text-black font-bold' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Bare Shell
                      </button>
                    </div>

                    <button
                      onClick={() => setShowSightlines(!showSightlines)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        showSightlines
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                          : 'bg-black/60 border-white/10 text-white/50'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Sightlines</span>
                    </button>
                  </div>

                  {/* Interactive SVG Blueprint */}
                  <div className="w-full flex items-center justify-center py-4 my-auto">
                    <svg viewBox="0 0 620 520" className="w-full max-h-[360px] drop-shadow-2xl select-none">
                      {/* Grid background */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        </pattern>
                        {/* Sun Ray Gradient */}
                        <linearGradient id="sunbeam" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={sunlightResult.facingIlluminationPercent / 100} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <rect width="620" height="520" fill="url(#grid)" />

                      {/* Dynamic Sunlight Beams overlay */}
                      {isSimulatingSunlight && sunlightResult.sunAltitudeDegrees > 2 && (
                        <g className="transition-all duration-500 pointer-events-none">
                          <polygon
                            points={`380,40 500,40 ${500 + Math.cos((sunlightResult.sunAzimuthDegrees * Math.PI) / 180) * 120},${
                              240 + Math.sin((sunlightResult.sunAzimuthDegrees * Math.PI) / 180) * 100
                            } ${380 + Math.cos((sunlightResult.sunAzimuthDegrees * Math.PI) / 180) * 120},${
                              240 + Math.sin((sunlightResult.sunAzimuthDegrees * Math.PI) / 180) * 100
                            }`}
                            fill="url(#sunbeam)"
                          />
                        </g>
                      )}

                      {/* Outer Wall Boundary */}
                      <rect
                        x="30"
                        y="30"
                        width="560"
                        height="460"
                        rx="12"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeOpacity="0.4"
                      />

                      {/* Interactive Rooms */}
                      {roomPolygons.map((room) => {
                        const isSelected = room.roomId === selectedRoomId;
                        const isDirectSun = sunlightResult.directSunlightRooms.includes(room.roomName);

                        return (
                          <g
                            key={room.roomId}
                            onClick={() => setSelectedRoomId(room.roomId)}
                            className="cursor-pointer transition-all group"
                          >
                            <polygon
                              points={room.polygonPoints}
                              className={`transition-all duration-300 ${
                                isSelected
                                  ? 'fill-amber-500/25 stroke-amber-400 stroke-2'
                                  : isDirectSun
                                  ? 'fill-amber-500/10 stroke-white/30 stroke-1 hover:fill-amber-500/20'
                                  : 'fill-white/[0.04] stroke-white/20 stroke-1 hover:fill-white/[0.08]'
                              }`}
                            />
                            {/* Room Label */}
                            <text
                              x={room.centerPoint.x}
                              y={room.centerPoint.y - 10}
                              textAnchor="middle"
                              className={`text-[12px] font-sans font-bold transition-all ${
                                isSelected ? 'fill-amber-300' : 'fill-white/80'
                              }`}
                            >
                              {room.roomName}
                            </text>
                            <text
                              x={room.centerPoint.x}
                              y={room.centerPoint.y + 10}
                              textAnchor="middle"
                              className="text-[10px] font-mono fill-white/50"
                            >
                              {room.widthFt}' × {room.lengthFt}' ({room.carpetSqFt} sq.ft)
                            </text>

                            {/* Staging Icons */}
                            {furnitureStaging === 'MINIMALIST' && (
                              <circle
                                cx={room.centerPoint.x}
                                cy={room.centerPoint.y + 26}
                                r="4"
                                className="fill-amber-400/40"
                              />
                            )}
                          </g>
                        );
                      })}

                      {/* Sightlines Cones */}
                      {showSightlines && (
                        <g className="pointer-events-none opacity-60">
                          <line x1="440" y1="140" x2="600" y2="90" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" />
                          <line x1="440" y1="140" x2="600" y2="190" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" />
                          <text x="540" y="130" className="text-[9px] fill-blue-300 font-mono">180° Vista</text>
                        </g>
                      )}
                    </svg>
                  </div>

                  {/* Room Quick Pill Selector */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 z-10">
                    <span className="text-[11px] text-white/50 uppercase font-bold mr-1">Inspect Room:</span>
                    {roomPolygons.map((r) => (
                      <button
                        key={r.roomId}
                        onClick={() => setSelectedRoomId(r.roomId)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                          selectedRoomId === r.roomId
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-white/5 text-white/70 hover:text-white'
                        }`}
                      >
                        {r.roomName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sunlight Physics Scrubber Bar */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-serif font-bold text-white">Sunlight & Shadow Solar Simulation</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      {sunlightResult.timeFormatted} (Solar Noon: 12:30 PM)
                    </span>
                  </div>

                  {/* Interactive Slider */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="6"
                      max="18"
                      step="0.25"
                      value={timeOfDayHour}
                      onChange={(e) => setTimeOfDayHour(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 font-mono">
                      <span>06:00 AM (Sunrise)</span>
                      <span>09:00 AM (Morning Rays)</span>
                      <span>12:00 PM (Direct Overhead)</span>
                      <span>03:00 PM (Afternoon)</span>
                      <span>06:00 PM (Golden Sunset)</span>
                    </div>
                  </div>

                  {/* Solar Summary Banner */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80 flex items-start gap-3">
                    <Thermometer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Lighting Analysis: </span>
                      {sunlightResult.naturalLightSummary}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Room Inspector & Acquisition Intel (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Active Room Specifications Card */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        {activeRoom.category} MODULE
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white mt-0.5">{activeRoom.roomName}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white">
                      {activeRoom.carpetSqFt} Sq.Ft
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-white/50 text-[11px]">Dimensions</div>
                      <div className="font-mono font-bold text-white">{activeRoom.widthFt} ft × {activeRoom.lengthFt} ft</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-white/50 text-[11px]">Clear Ceiling Height</div>
                      <div className="font-mono font-bold text-white">{activeRoom.ceilingHeightFt} Feet</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-white/50 text-[11px]">Window Facing</div>
                      <div className="font-mono font-bold text-emerald-400">{activeRoom.windowFacing}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-white/50 text-[11px]">Thermal Comfort</div>
                      <div className="font-mono font-bold text-amber-400">{sunlightResult.thermalComfortScorePercent}% Score</div>
                    </div>
                  </div>

                  {/* Architectural Finishes */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-white/70">Signature Finishes & Fixtures:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activeRoom.features.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/80"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Unit Pricing & Action Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/20 via-black to-blue-950/20 border border-amber-500/30 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-amber-400 uppercase font-bold tracking-wider">Unit {selectedUnit.unitNumber} Pricing</div>
                      <div className="text-2xl font-serif font-bold text-white mt-1">
                        {formatINR(selectedUnit.pricing.basePrice)}
                      </div>
                      <div className="text-xs text-white/50">
                        ₹{selectedUnit.pricing.pricePerSqFt.toLocaleString('en-IN')} / sq.ft carpet
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-white/50">All-In Acquisition</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {formatINR(selectedUnit.pricing.totalEstimatedAcquisitionCost)}
                      </div>
                      <div className="text-[10px] text-white/40">Includes 6% Stamp + 5% GST</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => onSelectUnitToHold && onSelectUnitToHold(selectedUnit)}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Lock Unit {selectedUnit.unitNumber} (15-Min Hold)</span>
                    </button>

                    {onAddToCompare && (
                      <button
                        onClick={() => onAddToCompare(selectedUnit)}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add Unit to Side-by-Side Compare</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: 32-FLOOR TOWER STACK & ELEVATION SIMULATOR */}
          {/* ========================================================================= */}
          {activeTab === 'tower' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Tower Elevation Stacking Canvas (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B101D] to-black border border-white/15 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white">Tower A — 32 Floor Elevation Stack</h3>
                      <p className="text-xs text-white/50">Select any floor level to simulate panoramic altitude vista</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono font-bold text-blue-400">
                      Floor {selectedFloor} of 32
                    </span>
                  </div>

                  {/* Interactive Floor Rise Slider */}
                  <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Elevation Height: <strong className="text-white">{elevationMetrics.elevationMeters} Meters</strong> above ground</span>
                      <span>Category: <strong className="text-amber-400">{elevationMetrics.viewCategory}</strong></span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="32"
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 font-mono">
                      <span>Level 1 (Podium Garden)</span>
                      <span>Level 12 (Mid Skyline)</span>
                      <span>Level 24 (High Rise)</span>
                      <span>Level 32 (Crown Penthouse)</span>
                    </div>
                  </div>

                  {/* Simulated Horizon Camera View Canvas */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 h-64 group">
                    <img
                      src={
                        selectedFloor >= 24
                          ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
                          : selectedFloor >= 12
                          ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
                          : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt="Simulated Skyline Vista"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white">
                          Elevation: {elevationMetrics.elevationMeters}m ({elevationMetrics.elevationMeters * 3.28}ft)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/80 text-black font-bold text-[11px]">
                          {elevationMetrics.viewScorePercent}% Vista Quality
                        </span>
                      </div>
                      <div className="text-xs text-white/90">
                        {selectedFloor >= 24
                          ? '360° Unobstructed horizon across Hinjewadi tech skyline and Western Ghats hills.'
                          : selectedFloor >= 12
                          ? 'Sweeping urban city lights and evening sunset vistas.'
                          : 'Lush green views over podium gardens and cascading water features.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Floor Stack Analytics & Units on this level (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                  <h3 className="text-lg font-serif font-bold text-white">Floor {selectedFloor} Environmental Metrics</h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-white/70 mb-1">
                        <span>Acoustic Isolation Index</span>
                        <span className="font-mono font-bold text-white">{elevationMetrics.acousticIsolationPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${elevationMetrics.acousticIsolationPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-white/70 mb-1">
                        <span>Cross-Ventilation Breeze Score</span>
                        <span className="font-mono font-bold text-white">{elevationMetrics.naturalBreezeScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${elevationMetrics.naturalBreezeScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                      <span className="text-white/60">Floor Rise Adjustment:</span>
                      <span className="font-mono font-bold text-amber-400">
                        +{formatINR(elevationMetrics.floorRiseChargeTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Available Units on Selected Floor */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h4 className="text-sm font-serif font-bold text-white">Units on Level {selectedFloor}:</h4>

                  {(allProjectUnits || []).filter((u) => u.floorNumber === selectedFloor).length > 0 ? (
                    (allProjectUnits || [])
                      .filter((u) => u.floorNumber === selectedFloor)
                      .map((u) => (
                        <div
                          key={u.id}
                          className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-white text-xs">{u.unitNumber} • {u.configuration}</div>
                            <div className="text-[11px] text-white/50">{u.carpetAreaSqFt} sq.ft • {u.facing} Facing</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-400 text-xs">{formatINR(u.pricing.basePrice)}</div>
                            <button
                              onClick={() => {
                                setSelectedUnit(u);
                                setActiveTab('blueprint');
                              }}
                              className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                            >
                              Inspect Blueprint →
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-white/50 italic">
                      Standard floorplate active. Units on floor {selectedFloor} follow standard 3 BHK Grande / 3.5 BHK layout.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MASTER PLAN & AMENITIES DIGITAL TWIN */}
          {/* ========================================================================= */}
          {activeTab === 'masterplan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Aerial Master Plan with Clickable Hotspots (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black min-h-[460px] shadow-2xl">
                  <img
                    src={project.masterPlanUrl || 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80'}
                    alt="Project Master Plan"
                    className="w-full h-full object-cover opacity-75"
                  />

                  {/* Glowing Hotspot Markers */}
                  {(project.masterPlanHotspots || []).map((hs) => {
                    const isSelected = selectedHotspot?.id === hs.id;
                    return (
                      <button
                        key={hs.id}
                        onClick={() => setSelectedHotspot(hs)}
                        style={{ top: `${hs.yPercent}%`, left: `${hs.xPercent}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-black ring-4 ring-amber-400/40 scale-125'
                              : 'bg-black/80 text-amber-400 border border-amber-500/50 hover:scale-110 hover:bg-amber-500 hover:text-black'
                          }`}
                        >
                          {hs.category === 'AMENITY' && <Sparkles className="w-4 h-4" />}
                          {hs.category === 'TOWER' && <Building className="w-4 h-4" />}
                          {hs.category === 'LANDSCAPE' && <Trees className="w-4 h-4" />}
                        </div>

                        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          {hs.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Hotspot Flythrough Details (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                {selectedHotspot ? (
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
                    <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10">
                      <img
                        src={selectedHotspot.previewImageUrl}
                        alt={selectedHotspot.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10">
                        {selectedHotspot.badge || selectedHotspot.category}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-serif font-bold text-white">{selectedHotspot.title}</h3>
                      <p className="text-xs text-white/70 mt-2 leading-relaxed">{selectedHotspot.description}</p>
                    </div>

                    {selectedHotspot.details && (
                      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/10">
                        {selectedHotspot.details.operatingHours && (
                          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                            <div className="text-white/50 text-[11px]">Timings</div>
                            <div className="font-semibold text-white">{selectedHotspot.details.operatingHours}</div>
                          </div>
                        )}
                        {selectedHotspot.details.level && (
                          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                            <div className="text-white/50 text-[11px]">Location / Level</div>
                            <div className="font-semibold text-white">{selectedHotspot.details.level}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center text-xs text-white/50">
                    Click any amenity or tower beacon on the master plan to inspect.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
