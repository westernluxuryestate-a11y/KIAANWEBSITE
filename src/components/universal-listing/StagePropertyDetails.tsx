/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlidersHorizontal, Info, Wrench, CheckCircle2, Home, ShieldCheck, Compass, Layers, FileText } from 'lucide-react';
import { UniversalListingFormData, MASTER_FURNISHING_ITEMS } from '../../services/universalListingSchemaService';

interface StagePropertyDetailsProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
}

export const StagePropertyDetails: React.FC<StagePropertyDetailsProps> = ({
  formData,
  setFormData,
}) => {
  const category = formData.propertyCategory;

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            5. Property Details & Adaptive Specifications
          </h3>
          <p className="text-xs opacity-70">
            Strictly conditional: Showing specifications for{' '}
            <span className="font-bold text-emerald-400">{category.replace(/_/g, ' ')}</span>.
            Irrelevant category fields are strictly excluded.
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
          Strict Scope Enforced
        </span>
      </div>

      {/* ================= IF RESIDENTIAL ================= */}
      {category === 'RESIDENTIAL' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Bedrooms (Numeric Count) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={formData.residential?.bedroomsNumeric ?? 3}
                onChange={(e) => {
                  const num = parseFloat(e.target.value) || 0;
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      bedroomsNumeric: num,
                      bhkLabel: `${num} BHK`,
                    },
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[10px] text-white/50">Numeric bedroom count (e.g. 1, 2, 2.5, 3, 3.5, 4, 5, 8+)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Configuration / BHK Label
              </label>
              <input
                type="text"
                placeholder="e.g. 3 BHK, Penthouse, Studio"
                value={formData.residential?.bhkLabel || `${formData.residential?.bedroomsNumeric || 3} BHK`}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      bhkLabel: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[10px] text-white/50">Custom label or auto-computed</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Bathrooms <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.residential?.bathrooms ?? 3}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      bathrooms: parseInt(e.target.value) || 1,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Balconies Count
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.residential?.balconiesCount ?? 2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      balconiesCount: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Carpet Area (Sq.Ft) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="50"
                value={formData.residential?.carpetAreaSqFt ?? 1450}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      carpetAreaSqFt: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Floor Number</label>
              <input
                type="number"
                value={formData.residential?.floorNumber ?? 7}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      floorNumber: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Total Floors</label>
              <input
                type="number"
                value={formData.residential?.totalFloors ?? 22}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      totalFloors: parseInt(e.target.value) || 1,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Facing / Orientation</label>
              <select
                value={formData.residential?.propertyFacing ?? 'EAST'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      propertyFacing: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="EAST">East Facing</option>
                <option value="NORTH">North Facing</option>
                <option value="NORTH_EAST">North-East Facing</option>
                <option value="WEST">West Facing</option>
                <option value="SOUTH">South Facing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Furnishing Status</label>
              <select
                value={formData.residential?.furnishingStatus ?? 'SEMI_FURNISHED'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    residential: {
                      ...prev.residential!,
                      furnishingStatus: e.target.value as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
                <option value="FULLY_FURNISHED_PREMIUM">Fully Furnished Premium</option>
              </select>
            </div>
          </div>

          {/* Furnishing Items Checklist (Section 18 / 19 Requisite - 18 Exact Items) */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <span>Included Furnishing & Appliance Items</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono">
                  {formData.residential?.furnishingItems?.length || 0} / {MASTER_FURNISHING_ITEMS.length} Selected
                </span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      residential: {
                        ...prev.residential!,
                        furnishingItems: [...MASTER_FURNISHING_ITEMS],
                      },
                    }))
                  }
                  className="text-amber-400 hover:text-amber-300 transition-colors underline"
                >
                  Select All
                </button>
                <span className="text-white/30">|</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      residential: {
                        ...prev.residential!,
                        furnishingItems: [],
                      },
                    }))
                  }
                  className="text-white/60 hover:text-white transition-colors underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
              {MASTER_FURNISHING_ITEMS.map((item) => {
                const isIncluded = formData.residential?.furnishingItems?.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                      isIncluded
                        ? 'bg-amber-400/10 border-amber-400/30 text-amber-200'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!isIncluded}
                      onChange={(e) => {
                        const current = formData.residential?.furnishingItems || [];
                        const updated = e.target.checked
                          ? [...current, item]
                          : current.filter((x) => x !== item);
                        setFormData((prev) => ({
                          ...prev,
                          residential: { ...prev.residential!, furnishingItems: updated },
                        }));
                      }}
                      className="rounded border-white/20 text-amber-500 focus:ring-0"
                    />
                    <span className="truncate">{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= RESALE & STANDALONE ASSETS SPECIFICATIONS ================= */}
      {(formData.propertyStatus === 'RESALE' ||
        formData.transactionType === 'RESALE' ||
        ['Villa', 'Bungalow', 'Row House', 'Independent House', 'Farmhouse', 'Duplex'].includes(formData.propertySubType) ||
        formData.resaleAndStandaloneDetails?.isStandaloneOrResale) && (
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 via-black/40 to-emerald-500/10 border border-amber-500/30 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  Resale & Standalone Assets Specification
                </h4>
                <p className="text-[11px] text-white/60">
                  Tailored parameters for Resale Flats, Independent Villas, Bungalows & Row Houses
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Resale & Standalone Module Active
            </span>
          </div>

          {/* Asset Classification & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Asset Structure Classification
              </label>
              <select
                value={formData.resaleAndStandaloneDetails?.assetType || (formData.propertySubType === 'Apartment' ? 'RESALE_APARTMENT' : 'INDEPENDENT_VILLA')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    resaleAndStandaloneDetails: {
                      ...prev.resaleAndStandaloneDetails,
                      isStandaloneOrResale: true,
                      assetType: e.target.value as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="RESALE_APARTMENT">Resale Apartment / Flat</option>
                <option value="INDEPENDENT_VILLA">Independent Villa / Kothi</option>
                <option value="BUNGALOW">Standalone Bungalow</option>
                <option value="ROW_HOUSE">Row House / Townhouse</option>
                <option value="PENTHOUSE_RESALE">Resale Luxury Penthouse</option>
                <option value="FARMHOUSE">Farmhouse / Estate Home</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Age of Structure (Years) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.resaleAndStandaloneDetails?.ageOfStructureYears ?? 3}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setFormData((prev) => ({
                    ...prev,
                    resaleAndStandaloneDetails: {
                      ...prev.resaleAndStandaloneDetails,
                      ageOfStructureYears: val,
                    },
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[10px] text-white/50">Years since initial occupancy certificate / construction</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Keys in Hand & Inspection Readiness
              </label>
              <select
                value={formData.resaleAndStandaloneDetails?.keysInHandImmediateInspection ? 'YES' : 'NO'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    resaleAndStandaloneDetails: {
                      ...prev.resaleAndStandaloneDetails,
                      keysInHandImmediateInspection: e.target.value === 'YES',
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="YES">Keys in Hand (Instant Physical Inspection)</option>
                <option value="NO">Notice Period Required for Site Visit</option>
              </select>
            </div>
          </div>

          {/* Resale Due Diligence & Society Compliance */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Resale Society Compliance & Chain of Title
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Society Reg. Number</label>
                <input
                  type="text"
                  placeholder="e.g. MAH/PUN/PNA/2021/450"
                  value={formData.resaleAndStandaloneDetails?.societyRegistrationNumber || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        societyRegistrationNumber: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Society NOC Status</label>
                <select
                  value={formData.resaleAndStandaloneDetails?.societyNocStatus || 'OBTAINED'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        societyNocStatus: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="OBTAINED">Obtained & Ready</option>
                  <option value="APPLIED">Applied / In Process</option>
                  <option value="PENDING_DUES_CLEARANCE">Pending Dues Clearance</option>
                  <option value="NOT_APPLICABLE">Not Applicable (Independent Freehold)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Transfer Charges (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={formData.resaleAndStandaloneDetails?.transferChargesAmountINR ?? 25000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        transferChargesAmountINR: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.priorChainOfTitleAvailable}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        priorChainOfTitleAvailable: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>30-Yr Chain of Title</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.hasEncumbranceCertificate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        hasEncumbranceCertificate: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Nil Encumbrance Cert</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.shareCertificateAvailable}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        shareCertificateAvailable: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Original Share Cert</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.maintenanceNoDuesCertificateAvailable}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        maintenanceNoDuesCertificateAvailable: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Maintenance No-Dues</span>
              </label>
            </div>
          </div>

          {/* Standalone Asset Ground & Rooftop Specifications */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Layers className="w-4 h-4 text-amber-400" />
              Standalone Land, Terrace & Structure Rights (Villas & Bungalows)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Plot Area (Sq.Ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 3600"
                  value={formData.resaleAndStandaloneDetails?.plotAreaSqFt ?? 3200}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        plotAreaSqFt: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Plot Frontage (Ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.resaleAndStandaloneDetails?.plotDimensionsFrontageFt ?? 40}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        plotDimensionsFrontageFt: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Number of Levels / Floors</label>
                <select
                  value={formData.resaleAndStandaloneDetails?.numberOfLevelsFloors || 'G_PLUS_2'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        numberOfLevelsFloors: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="GROUND_ONLY">Ground Floor Only (Independent)</option>
                  <option value="G_PLUS_1">Ground + 1 Floor (G+1)</option>
                  <option value="G_PLUS_2">Ground + 2 Floors (G+2)</option>
                  <option value="G_PLUS_3">Ground + 3 Floors (G+3)</option>
                  <option value="BASEMENT_PLUS_G_PLUS_2">Basement + Ground + 2 Floors</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Terrace / Rooftop Rights</label>
                <select
                  value={formData.resaleAndStandaloneDetails?.privateTerraceRooftopRights || 'FULL_EXCLUSIVE'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        privateTerraceRooftopRights: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="FULL_EXCLUSIVE">100% Exclusive Ownership & Access</option>
                  <option value="RESTRICTED">Restricted / Shared Rooftop Access</option>
                  <option value="NON_BUILDABLE">Exclusive Open Non-Buildable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Water Source</label>
                <select
                  value={formData.resaleAndStandaloneDetails?.independentWaterSource || 'BOTH_BOREWELL_AND_MUNICIPAL'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        independentWaterSource: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="BOTH_BOREWELL_AND_MUNICIPAL">Borewell + Municipal Connection</option>
                  <option value="MUNICIPAL_CONNECTION">Dedicated Municipal Meter</option>
                  <option value="BOREWELL">Private Deep Borewell</option>
                  <option value="TANKER_SUPPLY">Private Water Tanker Storage</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Private Driveway Slots</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.resaleAndStandaloneDetails?.privateDrivewayParkingSlots ?? 3}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        privateDrivewayParkingSlots: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Front Road Width (Ft)</label>
                <input
                  type="number"
                  value={formData.resaleAndStandaloneDetails?.frontRoadWidthFt ?? 40}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        frontRoadWidthFt: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/80 block">Private Garden (Sq.Ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 650"
                  value={formData.resaleAndStandaloneDetails?.privateGardenAreaSqFt ?? 600}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        hasPrivateGardenLawn: (parseInt(e.target.value) || 0) > 0,
                        privateGardenAreaSqFt: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.boundaryCompoundWall}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        boundaryCompoundWall: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Boundary Compound Wall</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.privateSwimmingPool}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        privateSwimmingPool: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Private Swimming Pool</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.isCornerPlot}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        isCornerPlot: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Corner Plot (Dual Road)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.resaleAndStandaloneDetails?.dedicatedElectricityMeter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resaleAndStandaloneDetails: {
                        ...prev.resaleAndStandaloneDetails,
                        dedicatedElectricityMeter: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Dedicated 3-Phase Meter</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= IF COMMERCIAL ================= */}
      {category === 'COMMERCIAL' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Carpet Area (Sq.Ft) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.commercial?.carpetAreaSqFt ?? 5000}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: {
                      ...prev.commercial!,
                      carpetAreaSqFt: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Building Grade</label>
              <select
                value={formData.commercial?.buildingGrade ?? 'GRADE_A_PLUS'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, buildingGrade: e.target.value as any },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="GRADE_A_PLUS">Grade A+ (Institutional)</option>
                <option value="GRADE_A">Grade A</option>
                <option value="GRADE_B">Grade B</option>
                <option value="GRADE_C">Grade C</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Fit-Out Status</label>
              <select
                value={formData.commercial?.fitOutStatus ?? 'FULLY_FITTED_FURNISHED'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, fitOutStatus: e.target.value as any },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="FULLY_FITTED_FURNISHED">Fully Fitted & Furnished</option>
                <option value="WARM_SHELL">Warm Shell</option>
                <option value="BARE_SHELL">Bare Shell</option>
                <option value="SEMI_FITTED">Semi-Fitted</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Workstations Count</label>
              <input
                type="number"
                value={formData.commercial?.workstationsCount ?? 50}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: {
                      ...prev.commercial!,
                      workstationsCount: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Private Cabins</label>
              <input
                type="number"
                value={formData.commercial?.cabinsCount ?? 4}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, cabinsCount: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Conference Rooms</label>
              <input
                type="number"
                value={formData.commercial?.conferenceRoomsCount ?? 2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, conferenceRoomsCount: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Floor Number</label>
              <input
                type="number"
                value={formData.commercial?.floorNumber ?? 4}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, floorNumber: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Ceiling Height (ft)</label>
              <input
                type="number"
                value={formData.commercial?.ceilingHeightFt ?? 12}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, ceilingHeightFt: parseInt(e.target.value) || 10 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.commercial?.hasDgBackup}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, hasDgBackup: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>100% DG Backup</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.commercial?.hasHvacCentral}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, hasHvacCentral: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Central HVAC</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.commercial?.hasSignageRights}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, hasSignageRights: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Signage Rights</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.commercial?.washroomsSeparateMaleFemale}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commercial: { ...prev.commercial!, washroomsSeparateMaleFemale: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Separate M/F Washrooms</span>
            </label>
          </div>
        </div>
      )}

      {/* ================= IF LAND & PLOTS ================= */}
      {category === 'LAND_AND_PLOTS' && (
        <div className="space-y-6">
          {/* Section 1: Plot Metrics & Cadastral Identifiers */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Cadastral Identifiers &amp; Area Dimensions</span>
              <span className="text-[10px] text-white/50">Survey, Gat, CTS &amp; Plot Records</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">
                  Plot Area <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.land?.plotArea ?? 10000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, plotArea: parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Area Unit</label>
                <select
                  value={formData.land?.plotAreaUnit ?? 'SQ_FT'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, plotAreaUnit: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="SQ_FT">Sq.Ft</option>
                  <option value="GUNTHA">Guntha (1,089 Sq.Ft)</option>
                  <option value="ACRE">Acre (43,560 Sq.Ft)</option>
                  <option value="HECTARE">Hectare (2.47 Acres)</option>
                  <option value="SQ_M">Sq.Meters</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Plot Number</label>
                <input
                  type="text"
                  placeholder="e.g. Plot #42"
                  value={formData.land?.plotNumber ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, plotNumber: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Survey Number</label>
                <input
                  type="text"
                  placeholder="e.g. Survey 84/3"
                  value={formData.land?.surveyNumber ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, surveyNumber: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Gat Number</label>
                <input
                  type="text"
                  placeholder="e.g. Gat 215"
                  value={formData.land?.gatNumber ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, gatNumber: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">CTS / Khata Number</label>
                <input
                  type="text"
                  placeholder="CTS / Khata No."
                  value={formData.land?.ctsNumber || formData.land?.khataNumber || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, ctsNumber: e.target.value, khataNumber: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Physical Dimensions, Road Frontage & Geometry */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Physical Dimensions &amp; Geometry</span>
              <span className="text-[10px] text-white/50">Road Access, Frontage, Depth &amp; Boundaries</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Road Width (ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 60 ft"
                  value={formData.land?.roadWidthFt ?? 40}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, roadWidthFt: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Frontage (ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 80 ft"
                  value={formData.land?.frontageFt ?? 80}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, frontageFt: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Depth (ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 120 ft"
                  value={formData.land?.depthFt ?? 120}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, depthFt: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Shape</label>
                <select
                  value={formData.land?.shape ?? 'REGULAR_RECTANGULAR'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, shape: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="REGULAR_RECTANGULAR">Regular Rectangular</option>
                  <option value="SQUARE">Square</option>
                  <option value="CORNER_L_SHAPED">Corner / L-Shaped</option>
                  <option value="IRREGULAR">Irregular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.land?.isCornerPlot}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, isCornerPlot: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Corner Plot (Multi-Side Road)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.land?.hasBoundaryWall}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, hasBoundaryWall: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Boundary Wall Built</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.land?.hasFencing}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, hasFencing: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Fencing / Barbed Wire</span>
              </label>
            </div>
          </div>

          {/* Section 3: Legal, NA Status, Zoning & Permissions */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Zoning, NA Status &amp; Construction Permissions</span>
              <span className="text-[10px] text-white/50">FSI / FAR, Land Use &amp; Regulatory Sanctions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">NA / Conversion Status</label>
                <select
                  value={formData.land?.naStatus ?? 'RESIDENTIAL_NA'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, naStatus: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="RESIDENTIAL_NA">Residential NA (Sanctioned)</option>
                  <option value="COMMERCIAL_NA">Commercial NA</option>
                  <option value="INDUSTRIAL_NA">Industrial NA</option>
                  <option value="CONVERTED">Converted Land</option>
                  <option value="NON_AGRICULTURAL">Non-Agricultural Land</option>
                  <option value="IN_PROCESS">NA in Process</option>
                  <option value="AGRICULTURAL">Agricultural Land</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Zoning</label>
                <input
                  type="text"
                  placeholder="e.g. R2 Zone / Commercial Ribbon"
                  value={formData.land?.zoning ?? 'Residential R2'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, zoning: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Permitted Land Use</label>
                <input
                  type="text"
                  placeholder="e.g. High-Rise Residential / Villa / Commercial"
                  value={formData.land?.permittedLandUse ?? 'Residential Multi-Storey'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, permittedLandUse: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">FSI / FAR Potential</label>
                <input
                  type="number"
                  step="0.05"
                  placeholder="e.g. 1.8"
                  value={formData.land?.fsiFarValue ?? 1.5}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, fsiFarValue: parseFloat(e.target.value) || 1.0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Development Potential Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Suitable for G+14 residential tower, 1.2 Lakh Sq.Ft buildable"
                  value={formData.land?.developmentPotentialNotes ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, developmentPotentialNotes: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={!!formData.land?.hasConstructionPermission}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        land: { ...prev.land!, hasConstructionPermission: e.target.checked },
                      }))
                    }
                    className="rounded text-amber-500"
                  />
                  <span className="text-xs font-semibold">Construction Permission Approved</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Water, Utilities, Irrigation & Access Road */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Water, Power, Irrigation &amp; Connectivity</span>
              <span className="text-[10px] text-white/50">Electricity, Borewell, Well &amp; Highway Distance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Water Source</label>
                <select
                  value={formData.land?.waterSource ?? 'MUNICIPAL'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, waterSource: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="MUNICIPAL">Municipal / Corporation Water</option>
                  <option value="BOREWELL">Borewell</option>
                  <option value="OPEN_WELL">Open Well</option>
                  <option value="CANAL_RIVER">Canal / River</option>
                  <option value="NONE">None / Tanker</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Electricity Connection</label>
                <select
                  value={formData.land?.electricityConnection ?? 'THREE_PHASE'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, electricityConnection: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="THREE_PHASE">Three Phase (Commercial/Industrial)</option>
                  <option value="SINGLE_PHASE">Single Phase (Residential/Domestic)</option>
                  <option value="INDUSTRIAL_HIGH_TENSION">Industrial High Tension (HT)</option>
                  <option value="NONE">No Direct Connection</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Access Road Type</label>
                <select
                  value={formData.land?.accessRoadType ?? 'TAR_ASPHALT_ROAD'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, accessRoadType: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="TAR_ASPHALT_ROAD">Tar / Asphalt Road</option>
                  <option value="CONCRETE_ROAD">Concrete Road</option>
                  <option value="MURRUM_ROAD">Murrum Road</option>
                  <option value="KACHA_ROAD">Kacha Road</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Distance to Highway (Km)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 1.2 Km"
                  value={formData.land?.distanceFromHighwayKm ?? 1.5}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, distanceFromHighwayKm: parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.land?.hasBorewell}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, hasBorewell: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Active Borewell</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.land?.hasWell}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, hasWell: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Open Dug Well</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.land?.irrigationFacility}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, irrigationFacility: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Drip / Canal Irrigation</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.land?.agriculturalStatus === 'AGRICULTURAL'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: {
                        ...prev.land!,
                        agriculturalStatus: e.target.checked ? 'AGRICULTURAL' : 'NON_AGRICULTURAL',
                      },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span>Agricultural Cultivation</span>
              </label>
            </div>
          </div>

          {/* Section 5: Soil Type & Topography */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Soil Classification &amp; Topography</span>
              <span className="text-[10px] text-white/50">Geotechnical &amp; Terrain Profiling</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Soil Type</label>
                <select
                  value={formData.land?.soilType ?? 'Red Soil'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, soilType: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clay Soil">Clay Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Laterite Soil">Laterite / Murrum</option>
                  <option value="Rocky / Gravel">Rocky / Hard Strata</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Topography</label>
                <select
                  value={formData.land?.topography ?? 'FLAT'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      land: { ...prev.land!, topography: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="FLAT">Flat / Level Ground</option>
                  <option value="GENTLE_SLOPE">Gentle Slope</option>
                  <option value="TERRACED">Terraced / Stepped</option>
                  <option value="HILLSIDE">Hillside / Valley View</option>
                  <option value="UNDULATING">Undulating Terrain</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= IF INDUSTRIAL ================= */}
      {category === 'INDUSTRIAL' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Industrial Type</label>
              <select
                value={formData.industrial?.industrialType ?? 'Factory / Manufacturing'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: { ...prev.industrial!, industrialType: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="Manufacturing Facility">Manufacturing Facility</option>
                <option value="Industrial Shed">Industrial Shed (PEB)</option>
                <option value="Logistics Warehouse">Logistics Warehouse</option>
                <option value="Cold Storage Facility">Cold Storage Facility</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Shed Area (Sq.Ft)</label>
              <input
                type="number"
                value={formData.industrial?.shedAreaSqFt ?? 25000}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: { ...prev.industrial!, shedAreaSqFt: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Clear Height (ft)</label>
              <input
                type="number"
                value={formData.industrial?.clearHeightFt ?? 32}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: { ...prev.industrial!, clearHeightFt: parseInt(e.target.value) || 20 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Power Sanction (KVA)</label>
              <input
                type="number"
                value={formData.industrial?.powerLoadKVA ?? 500}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: { ...prev.industrial!, powerLoadKVA: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.industrial?.hasCrane}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: { ...prev.industrial!, hasCrane: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Overhead Crane (10T+)</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.industrial?.truckContainerAccess === 'UP_TO_40_FT_CONTAINER'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: {
                      ...prev.industrial!,
                      truckContainerAccess: e.target.checked ? 'UP_TO_40_FT_CONTAINER' : 'UP_TO_20_FT',
                    },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>40-Ft Container Turning Radius</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.industrial?.hasPollutionClearance}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: { ...prev.industrial!, hasPollutionClearance: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Pollution Clearance (MPCB)</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.industrial?.hasFactoryLicense}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industrial: { ...prev.industrial!, hasFactoryLicense: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Factory License Valid</span>
            </label>
          </div>
        </div>
      )}

      {/* ================= IF HOSPITALITY ================= */}
      {category === 'HOSPITALITY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Total Keys / Rooms</label>
              <input
                type="number"
                value={formData.hospitality?.totalKeysRooms ?? 65}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, totalKeysRooms: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Star Category</label>
              <select
                value={formData.hospitality?.starCategory ?? '4_STAR'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, starCategory: e.target.value as any },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="BOUTIQUE_LUXURY">Boutique Luxury</option>
                <option value="5_STAR">5 Star Luxury</option>
                <option value="4_STAR">4 Star Business</option>
                <option value="3_STAR">3 Star</option>
                <option value="HERITAGE">Heritage Resort</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Banquet Capacity (Persons)</label>
              <input
                type="number"
                value={formData.hospitality?.banquetCapacityPersons ?? 300}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, banquetCapacityPersons: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Occupancy Rate (%)</label>
              <input
                type="number"
                value={formData.hospitality?.occupancyRatePercent ?? 74}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, occupancyRatePercent: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.hospitality?.hasRestaurant}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, hasRestaurant: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Multi-Cuisine Restaurant</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.hospitality?.hasSwimmingPool}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, hasSwimmingPool: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Infinity / Resort Pool</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.hospitality?.hasCommercialKitchen}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, hasCommercialKitchen: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Commercial FSSAI Kitchen</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.hospitality?.hasSpa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospitality: { ...prev.hospitality!, hasSpa: e.target.checked },
                  }))
                }
                className="rounded text-amber-500"
              />
              <span>Wellness Spa / Sauna</span>
            </label>
          </div>
        </div>
      )}

      {/* ================= IF AGRICULTURAL / OTHER ================= */}
      {((category as string) === 'AGRICULTURAL' || (category as string) === 'MIXED_USE' || (category as string) === 'INSTITUTIONAL') && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Info className="w-4 h-4 text-amber-400" />
            Special Category Specifics: {category.replace(/_/g, ' ')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-white/80 block mb-1">Total Plot / Campus Area</label>
              <input
                type="text"
                placeholder="e.g. 5 Acres / 50,000 Sq.Ft"
                defaultValue="5.5 Acres"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/80 block mb-1">Sanctioned Built-Up Area</label>
              <input
                type="text"
                placeholder="e.g. 80,000 Sq.Ft"
                defaultValue="45,000 Sq.Ft"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/80 block mb-1">Key Operational Approval</label>
              <input
                type="text"
                placeholder="e.g. CBSE Affiliated / Health Dept NOC"
                defaultValue="Statutory Clearances Approved"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 22: PROPERTY CONDITION & MAINTENANCE ================= */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Property Condition & Physical Audit (Section 22)
            </h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/70 font-mono">
            Resale & Standalone Asset Requisites
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-white/80 block">Overall Condition</label>
            <select
              value={formData.condition?.propertyCondition || 'EXCELLENT'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    propertyCondition: e.target.value as any,
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="NEW">New</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="AVERAGE">Average</option>
              <option value="NEEDS_RENOVATION">Needs Renovation</option>
              <option value="UNDER_RENOVATION">Under Renovation</option>
              <option value="FULLY_RENOVATED">Fully Renovated</option>
              <option value="PARTIALLY_RENOVATED">Partially Renovated</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Property Age (Years)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={formData.condition?.ageOfPropertyYears ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    ageOfPropertyYears: Number(e.target.value),
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              placeholder="0 for brand new"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Last Renovation Year</label>
            <input
              type="number"
              min={1990}
              max={2030}
              value={formData.condition?.lastRenovatedYear ?? 2024}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    lastRenovatedYear: Number(e.target.value),
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Structural Condition</label>
            <select
              value={formData.condition?.structuralCondition || 'EXCELLENT'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    structuralCondition: e.target.value as any,
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="EXCELLENT">Excellent (Certified)</option>
              <option value="GOOD">Good (Sound)</option>
              <option value="AVERAGE">Average</option>
              <option value="NEEDS_REPAIR">Needs Structural Attention</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Paint Condition</label>
            <select
              value={formData.condition?.paintCondition || 'FRESH'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    paintCondition: e.target.value as any,
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="FRESH">Fresh / Pristine</option>
              <option value="NEW">Brand New</option>
              <option value="GOOD">Good Condition</option>
              <option value="NEEDS_TOUCHUP">Needs Touch-up</option>
              <option value="AVERAGE">Average / Repaint Advised</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Flooring Condition</label>
            <select
              value={formData.condition?.flooringCondition || 'EXCELLENT'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    flooringCondition: e.target.value as any,
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="EXCELLENT">Excellent (No Scratches / Chips)</option>
              <option value="GOOD">Good</option>
              <option value="AVERAGE">Average</option>
              <option value="NEEDS_POLISHING">Needs Buffing / Polishing</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Plumbing Condition</label>
            <select
              value={formData.condition?.plumbingCondition || 'PERFECT'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    plumbingCondition: e.target.value as any,
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="PERFECT">Perfect (Zero Leakages / Modern Fixtures)</option>
              <option value="GOOD">Good Working Condition</option>
              <option value="NEEDS_ATTENTION">Minor Fixture Service Needed</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Electrical Condition</label>
            <select
              value={formData.condition?.electricalCondition || 'MODERN_PERFECT'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: {
                    ...prev.condition,
                    electricalCondition: e.target.value as any,
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="MODERN_PERFECT">Modern Modular with MCB / ELCB</option>
              <option value="GOOD">Good Working Wiring</option>
              <option value="NEEDS_UPGRADE">Upgrade Recommended</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
