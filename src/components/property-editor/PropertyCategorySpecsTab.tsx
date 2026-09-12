import React, { useState } from 'react';
import {
  Sliders,
  Building,
  Warehouse,
  Factory,
  Hotel,
  Trees,
  CheckCircle2,
  Maximize2,
  Compass,
  Layers,
  Sparkles,
  Ruler,
} from 'lucide-react';
import { PropertyCategory } from '../../services/universalListingSchemaService';
import {
  ResidentialSpecsState,
  CommercialSpecsState,
  IndustrialSpecsState,
  HospitalitySpecsState,
  AgriculturalSpecsState,
} from './propertyEditorTypes';

interface PropertyCategorySpecsTabProps {
  canModify: boolean;
  category: PropertyCategory;
  subType: string;
  residentialSpecs: ResidentialSpecsState;
  setResidentialSpecs: React.Dispatch<React.SetStateAction<ResidentialSpecsState>>;
  commercialSpecs: CommercialSpecsState;
  setCommercialSpecs: React.Dispatch<React.SetStateAction<CommercialSpecsState>>;
  industrialSpecs: IndustrialSpecsState;
  setIndustrialSpecs: React.Dispatch<React.SetStateAction<IndustrialSpecsState>>;
  hospitalitySpecs: HospitalitySpecsState;
  setHospitalitySpecs: React.Dispatch<React.SetStateAction<HospitalitySpecsState>>;
  agriculturalSpecs: AgriculturalSpecsState;
  setAgriculturalSpecs: React.Dispatch<React.SetStateAction<AgriculturalSpecsState>>;
}

export const PropertyCategorySpecsTab: React.FC<PropertyCategorySpecsTabProps> = ({
  canModify,
  category,
  subType,
  residentialSpecs,
  setResidentialSpecs,
  commercialSpecs,
  setCommercialSpecs,
  industrialSpecs,
  setIndustrialSpecs,
  hospitalitySpecs,
  setHospitalitySpecs,
  agriculturalSpecs,
  setAgriculturalSpecs,
}) => {
  // Agricultural unit converter helper (Acre, Hectare, Guntha, Sq.Ft, Sq.M)
  // 1 Acre = 40 Guntha = 0.404686 Hectare = 43,560 Sq.Ft = 4,046.86 Sq.M
  const handleAgriUnitChange = (unit: 'ACRE' | 'GUNTHA' | 'HECTARE' | 'SQFT' | 'SQM', val: number) => {
    let acreVal = 0;
    if (unit === 'ACRE') acreVal = val;
    else if (unit === 'GUNTHA') acreVal = val / 40;
    else if (unit === 'HECTARE') acreVal = val / 0.404686;
    else if (unit === 'SQFT') acreVal = val / 43560;
    else if (unit === 'SQM') acreVal = val / 4046.86;

    setAgriculturalSpecs((prev) => ({
      ...prev,
      acre: parseFloat(acreVal.toFixed(4)),
      guntha: parseFloat((acreVal * 40).toFixed(2)),
      hectare: parseFloat((acreVal * 0.404686).toFixed(4)),
      sqFt: Math.round(acreVal * 43560),
      sqM: parseFloat((acreVal * 4046.86).toFixed(2)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. RESIDENTIAL SPECIFICATIONS                                             */}
      {/* ========================================================================= */}
      {category === 'RESIDENTIAL' && (
        <div className="space-y-5">
          {/* Numeric Bedrooms & BHK Display */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Bedroom Configuration (Numeric &amp; Unrestricted)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Dynamic Numeric Bedroom Count
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold opacity-80">
                  Exact Bedroom Count (Numeric) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    disabled={!canModify}
                    value={residentialSpecs.bedroomsNumeric}
                    onChange={(e) => {
                      const v = e.target.value;
                      setResidentialSpecs((prev) => ({
                        ...prev,
                        bedroomsNumeric: v,
                        bhkLabel: v ? `${v} BHK ${subType}` : prev.bhkLabel,
                      }));
                    }}
                    placeholder="e.g. 1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7"
                    className="w-full px-3 py-2 rounded-xl border bg-black/50 border-white/10 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute right-3 top-2 text-[11px] opacity-60 font-mono">Beds</span>
                </div>
                <span className="text-[10px] opacity-60">Allows any decimal/numeric count (e.g. 2.5, 3.5, 4.5, 5+)</span>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold opacity-80">BHK / Unit Display Label</label>
                <input
                  type="text"
                  disabled={!canModify}
                  value={residentialSpecs.bhkLabel}
                  onChange={(e) =>
                    setResidentialSpecs((prev) => ({ ...prev, bhkLabel: e.target.value }))
                  }
                  placeholder="e.g. 3.5 BHK Sky Penthouse"
                  className="w-full px-3 py-2 rounded-xl border bg-black/50 border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Bathrooms, Toilets, Powder Room & Balconies */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Bathrooms</label>
              <input
                type="number"
                disabled={!canModify}
                value={residentialSpecs.bathrooms}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    bathrooms: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Toilets</label>
              <input
                type="number"
                disabled={!canModify}
                value={residentialSpecs.toilets}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    toilets: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Powder Room</label>
              <input
                type="number"
                disabled={!canModify}
                value={residentialSpecs.powderRoom}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    powderRoom: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Balconies</label>
              <input
                type="number"
                disabled={!canModify}
                value={residentialSpecs.balconies}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    balconies: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Carpet Areas: RERA Carpet, Min, Max, Super Built-Up, Built-Up */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white/80 block uppercase tracking-wide">
              Carpet &amp; Super Built-Up Area Metrics (Sq.Ft)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-amber-300 block">RERA Carpet *</label>
                <input
                  type="number"
                  disabled={!canModify}
                  value={residentialSpecs.carpetAreaSqFt}
                  onChange={(e) => {
                    const c = parseFloat(e.target.value) || 0;
                    setResidentialSpecs((prev) => ({
                      ...prev,
                      carpetAreaSqFt: c,
                      minCarpetAreaSqFt: Math.round(c * 0.95),
                      maxCarpetAreaSqFt: Math.round(c * 1.05),
                    }));
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-xs text-amber-300 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Min Carpet</label>
                <input
                  type="number"
                  disabled={!canModify}
                  value={residentialSpecs.minCarpetAreaSqFt}
                  onChange={(e) =>
                    setResidentialSpecs((prev) => ({
                      ...prev,
                      minCarpetAreaSqFt: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Max Carpet</label>
                <input
                  type="number"
                  disabled={!canModify}
                  value={residentialSpecs.maxCarpetAreaSqFt}
                  onChange={(e) =>
                    setResidentialSpecs((prev) => ({
                      ...prev,
                      maxCarpetAreaSqFt: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Super Built-Up</label>
                <input
                  type="number"
                  disabled={!canModify}
                  value={residentialSpecs.superBuiltUpAreaSqFt}
                  onChange={(e) =>
                    setResidentialSpecs((prev) => ({
                      ...prev,
                      superBuiltUpAreaSqFt: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Built-Up Area</label>
                <input
                  type="number"
                  disabled={!canModify}
                  value={residentialSpecs.builtUpAreaSqFt}
                  onChange={(e) =>
                    setResidentialSpecs((prev) => ({
                      ...prev,
                      builtUpAreaSqFt: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Tower, Floor, Wing, Facing & Views */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Tower / Wing</label>
              <input
                type="text"
                disabled={!canModify}
                value={residentialSpecs.towerWing}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({ ...prev, towerWing: e.target.value }))
                }
                placeholder="e.g. Tower A / Sky Wing"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Floor Number</label>
              <input
                type="number"
                disabled={!canModify}
                value={residentialSpecs.floorNumber}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    floorNumber: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Total Floors</label>
              <input
                type="number"
                disabled={!canModify}
                value={residentialSpecs.totalFloors}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    totalFloors: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Vastu Facing</label>
              <input
                type="text"
                disabled={!canModify}
                value={residentialSpecs.facingDirection}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({ ...prev, facingDirection: e.target.value }))
                }
                placeholder="e.g. East-Facing / North-East"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          {/* Overlooking & Views */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-white/80 block">Overlooking &amp; Views</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'corner' as const, label: 'Corner Unit' },
                { id: 'garden' as const, label: 'Lush Garden View' },
                { id: 'pool' as const, label: 'Swimming Pool View' },
                { id: 'river' as const, label: 'River / Waterfront View' },
                { id: 'hill' as const, label: 'Hill / Nature View' },
                { id: 'citySkyline' as const, label: 'City Skyline View' },
                { id: 'road' as const, label: 'Main Boulevard View' },
                { id: 'golfCourse' as const, label: 'Golf Course View' },
              ].map((view) => (
                <label
                  key={view.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5 hover:bg-white/5 cursor-pointer text-white/80"
                >
                  <input
                    type="checkbox"
                    disabled={!canModify}
                    checked={residentialSpecs.views[view.id]}
                    onChange={(e) =>
                      setResidentialSpecs((prev) => ({
                        ...prev,
                        views: { ...prev.views, [view.id]: e.target.checked },
                      }))
                    }
                    className="rounded border-amber-500 text-amber-500 focus:ring-0"
                  />
                  <span>{view.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Furnishing Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/80 block">Furnishing Status</label>
              <select
                disabled={!canModify}
                value={residentialSpecs.furnishingStatus}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    furnishingStatus: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="UNFURNISHED" className="bg-slate-900 text-white">Unfurnished (Raw Shell)</option>
                <option value="SEMI_FURNISHED" className="bg-slate-900 text-white">Semi-Furnished (Kitchen + Wardrobes)</option>
                <option value="FULLY_FURNISHED" className="bg-slate-900 text-white">Fully Furnished Designer Turnkey</option>
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-white/80 block">Furnishing Details / Inclusions</label>
              <input
                type="text"
                disabled={!canModify}
                value={residentialSpecs.furnishingItems.join(', ')}
                onChange={(e) =>
                  setResidentialSpecs((prev) => ({
                    ...prev,
                    furnishingItems: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  }))
                }
                placeholder="e.g. Modular Italian Kitchen, VRV ACs, Built-in Wardrobes, Smart Automation"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COMMERCIAL SPECIFICATIONS                                              */}
      {/* ========================================================================= */}
      {category === 'COMMERCIAL' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                Commercial Office &amp; Retail Technical Dossier
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              Grade-A Commercial Parameters
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Usable Carpet (Sq.Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.usableCarpetAreaSqFt}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    usableCarpetAreaSqFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Super Built-Up (Sq.Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.superBuiltUpAreaSqFt}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    superBuiltUpAreaSqFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Clear Ceiling Height (Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.clearCeilingHeightFt}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    clearCeilingHeightFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Frontage / Entrance (Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.frontageFt}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    frontageFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Power Load (KVA)</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.powerLoadKva}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    powerLoadKva: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Passenger Lifts</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.passengerLiftsCount}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    passengerLiftsCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Service Lifts / Loading Bay</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.serviceLiftsCount}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    serviceLiftsCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Building Grade</label>
              <select
                disabled={!canModify}
                value={commercialSpecs.buildingGrade}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    buildingGrade: e.target.value as any,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="GRADE_A_PLUS" className="bg-slate-900 text-white">Grade A+ (LEED Platinum)</option>
                <option value="GRADE_A" className="bg-slate-900 text-white">Grade A Corporate</option>
                <option value="GRADE_B" className="bg-slate-900 text-white">Grade B Standard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Fit-Out Status</label>
              <select
                disabled={!canModify}
                value={commercialSpecs.fitOutStatus}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    fitOutStatus: e.target.value as any,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="WARM_SHELL" className="bg-slate-900 text-white">Warm Shell (Ready for Fitout)</option>
                <option value="FULLY_FURNISHED" className="bg-slate-900 text-white">Plug &amp; Play Fully Furnished</option>
                <option value="BARE_SHELL" className="bg-slate-900 text-white">Bare Shell (Raw)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Workstations</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.workstationsCount}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    workstationsCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Cabins &amp; Meeting Rooms</label>
              <input
                type="number"
                disabled={!canModify}
                value={commercialSpecs.cabinsCount}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    cabinsCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Operating Hours</label>
              <select
                disabled={!canModify}
                value={commercialSpecs.operatingHours}
                onChange={(e) =>
                  setCommercialSpecs((prev) => ({
                    ...prev,
                    operatingHours: e.target.value as any,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="24_7_ALLOWED" className="bg-slate-900 text-white">24/7 Operations Allowed</option>
                <option value="BUSINESS_HOURS_ONLY" className="bg-slate-900 text-white">Standard Business Hours</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INDUSTRIAL SPECIFICATIONS                                              */}
      {/* ========================================================================= */}
      {category === 'INDUSTRIAL' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-orange-400" />
              <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wide">
                Industrial Shed, Logistics &amp; Warehouse Parameters
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold">
              Industrial Heavy Duty
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Shed Area (Sq.Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.shedAreaSqFt}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    shedAreaSqFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Land Area (Sq.Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.landAreaSqFt}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    landAreaSqFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Clear Center Height (Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.clearHeightCenterFt}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    clearHeightCenterFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Floor Load (Tons/Sq.M)</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.floorLoadCapacityTons}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    floorLoadCapacityTons: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">EOT Crane Capacity (Tons)</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.craneCapacityTons}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    craneCapacityTons: parseFloat(e.target.value) || 0,
                    overheadCraneAvailable: (parseFloat(e.target.value) || 0) > 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Dock Levelers</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.dockLevelersCount}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    dockLevelersCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Power Load (KVA)</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.powerLoadKva}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    powerLoadKva: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Truck Access (Road Width Ft)</label>
              <input
                type="number"
                disabled={!canModify}
                value={industrialSpecs.roadWidthFrontageFt}
                onChange={(e) =>
                  setIndustrialSpecs((prev) => ({
                    ...prev,
                    roadWidthFrontageFt: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. HOSPITALITY / HOTEL SPECIFICATIONS                                     */}
      {/* ========================================================================= */}
      {category === 'HOSPITALITY' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-purple-400" />
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                Hotel, Resort &amp; Hospitality Operational Parameters
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              Hospitality Revenue Asset
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Total Keys / Rooms</label>
              <input
                type="number"
                disabled={!canModify}
                value={hospitalitySpecs.totalKeys}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    totalKeys: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Average Occupancy (%)</label>
              <input
                type="number"
                disabled={!canModify}
                value={hospitalitySpecs.averageOccupancyPercent}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    averageOccupancyPercent: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Average Room Rate (ARR INR)</label>
              <input
                type="number"
                disabled={!canModify}
                value={hospitalitySpecs.averageRoomRateINR}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    averageRoomRateINR: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">RevPAR (INR)</label>
              <input
                type="number"
                disabled={!canModify}
                value={hospitalitySpecs.revParINR}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    revParINR: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Banquet Capacity (Persons)</label>
              <input
                type="number"
                disabled={!canModify}
                value={hospitalitySpecs.banquetCapacityPersons}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    banquetCapacityPersons: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Star Category</label>
              <select
                disabled={!canModify}
                value={hospitalitySpecs.starCategory}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    starCategory: e.target.value as any,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="FIVE_STAR_DELUXE" className="bg-slate-900 text-white">5-Star Deluxe</option>
                <option value="FIVE_STAR" className="bg-slate-900 text-white">5-Star Standard</option>
                <option value="FOUR_STAR" className="bg-slate-900 text-white">4-Star Premium</option>
                <option value="THREE_STAR" className="bg-slate-900 text-white">3-Star Business</option>
                <option value="BOUTIQUE" className="bg-slate-900 text-white">Boutique Resort</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Annual Revenue (INR)</label>
              <input
                type="number"
                disabled={!canModify}
                value={hospitalitySpecs.annualGrossRevenueINR}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    annualGrossRevenueINR: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Operating EBITDA (INR)</label>
              <input
                type="number"
                disabled={!canModify}
                value={hospitalitySpecs.ebitdaAnnualINR}
                onChange={(e) =>
                  setHospitalitySpecs((prev) => ({
                    ...prev,
                    ebitdaAnnualINR: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AGRICULTURAL / FARM LAND (LIVE MULTI-UNIT CONVERTER)                   */}
      {/* ========================================================================= */}
      {(category === 'LAND_AND_PLOTS' || subType.toLowerCase().includes('farm') || subType.toLowerCase().includes('agri')) && (
        <div className="space-y-5">
          {/* LIVE MULTI-UNIT AREA CONVERTER */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trees className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Live Multi-Unit Agricultural Land Area Converter
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Two-Way Live Sync
              </span>
            </div>
            <p className="text-xs text-white/70">
              Update any unit below; all other units synchronize automatically (1 Acre = 40 Guntha = 0.4047 Hectare = 43,560 Sq.Ft = 4,047 Sq.M).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-emerald-300 block">Acres</label>
                <input
                  type="number"
                  step="0.01"
                  disabled={!canModify}
                  value={agriculturalSpecs.acre}
                  onChange={(e) => handleAgriUnitChange('ACRE', parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-emerald-500/30 text-xs text-emerald-300 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Gunthas</label>
                <input
                  type="number"
                  step="0.5"
                  disabled={!canModify}
                  value={agriculturalSpecs.guntha}
                  onChange={(e) => handleAgriUnitChange('GUNTHA', parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Hectares</label>
                <input
                  type="number"
                  step="0.01"
                  disabled={!canModify}
                  value={agriculturalSpecs.hectare}
                  onChange={(e) => handleAgriUnitChange('HECTARE', parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Square Feet</label>
                <input
                  type="number"
                  disabled={!canModify}
                  value={agriculturalSpecs.sqFt}
                  onChange={(e) => handleAgriUnitChange('SQFT', parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block">Square Meters</label>
                <input
                  type="number"
                  disabled={!canModify}
                  value={agriculturalSpecs.sqM}
                  onChange={(e) => handleAgriUnitChange('SQM', parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Soil, Water, Irrigation, Title & Clearances */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Soil Classification</label>
              <select
                disabled={!canModify}
                value={agriculturalSpecs.soilType}
                onChange={(e) =>
                  setAgriculturalSpecs((prev) => ({ ...prev, soilType: e.target.value }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="Black Cotton Soil" className="bg-slate-900 text-white">Black Cotton Soil (Deep Kali)</option>
                <option value="Red Loam Soil" className="bg-slate-900 text-white">Red Loam Soil</option>
                <option value="Alluvial Soil" className="bg-slate-900 text-white">Fertile Alluvial</option>
                <option value="Laterite Tableland" className="bg-slate-900 text-white">Laterite Mountain Soil</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Water Source</label>
              <input
                type="text"
                disabled={!canModify}
                value={agriculturalSpecs.waterSource}
                onChange={(e) =>
                  setAgriculturalSpecs((prev) => ({ ...prev, waterSource: e.target.value }))
                }
                placeholder="e.g. Perennial River + 2 Borewells"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">NA / Legal Status</label>
              <select
                disabled={!canModify}
                value={agriculturalSpecs.naStatus}
                onChange={(e) =>
                  setAgriculturalSpecs((prev) => ({ ...prev, naStatus: e.target.value }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="Clear Title Freehold NA" className="bg-slate-900 text-white">Clear Title Freehold NA</option>
                <option value="7/12 Extract Clear Agricultural" className="bg-slate-900 text-white">Clear 7/12 Agricultural</option>
                <option value="Gunthewari Sanctioned" className="bg-slate-900 text-white">Gunthewari Sanctioned</option>
                <option value="Residential NA Sanctioned" className="bg-slate-900 text-white">Residential NA Sanctioned</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Road Approach</label>
              <input
                type="text"
                disabled={!canModify}
                value={agriculturalSpecs.roadAccessType}
                onChange={(e) =>
                  setAgriculturalSpecs((prev) => ({ ...prev, roadAccessType: e.target.value }))
                }
                placeholder="e.g. Tar Road Touch / 30 Ft Concrete"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
