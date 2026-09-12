/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Shield,
  Building,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Sparkles,
  UserCheck,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  UniversalListingFormData,
  ListingFreshnessAudit,
  computeFreshnessAudit,
  formatVerificationInterval,
} from '../../services/universalListingSchemaService';

interface StageAvailabilityProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
}

export const StageAvailability: React.FC<StageAvailabilityProps> = ({
  formData,
  setFormData,
}) => {
  const avail = (formData as any).availabilityAndTenancy || (formData as any).availability || {
    isAvailableNow: true,
    availableFromDate: '',
    possessionDate: '2026-12',
    expectedPossessionQuarter: 'Q4 2026',
    bookingStatus: 'AVAILABLE',
    totalUnitsCount: 1,
    availableUnitsCount: 1,
    soldUnitsCount: 0,
    rentedUnitsCount: 0,
    leasedUnitsCount: 0,
    allowedOccupants: ['FAMILY', 'WORKING_PROFESSIONALS', 'CORPORATE_TENANTS'],
    petFriendly: true,
    vegetarianOnly: false,
    smokingAllowed: false,
    alcoholAllowed: true,
    visitorPolicy: 'Allowed until 10 PM',
    isInvestmentOpportunity: true,
    estimatedMonthlyRentalIncomeINR: 85000,
    estimatedAnnualRentalIncomeINR: 1020000,
    grossRentalYieldPct: 5.1,
    currentOccupancyRatePct: 95,
    historicalCapitalAppreciationPct: 9.8,
    tenantQualityGrade: 'AAA_MNC',
    remainingLeaseMonths: 36,
    expectedIrrPct: 14.5,
    expectedRoiPct: 11.2,
    exitPotential: 'HIGH_LIQUIDITY',
    resaleLiquidityScore: 88,
    recommendedInvestmentHorizonYears: 5,
  };

  const freshness: ListingFreshnessAudit = computeFreshnessAudit(formData);

  const updateAvail = (updates: Partial<typeof avail>) => {
    setFormData((prev: any) => ({
      ...prev,
      availabilityAndTenancy: {
        ...(prev.availabilityAndTenancy || avail),
        ...updates,
      },
    }));
  };

  const updateFreshnessField = (field: keyof ListingFreshnessAudit, val: any) => {
    const updatedAudit: ListingFreshnessAudit = {
      ...freshness,
      [field]: val,
      updatedDate: new Date().toISOString(),
    };
    setFormData((prev) => ({
      ...prev,
      freshnessAudit: updatedAudit,
      freshnessTimestamp: updatedAudit.updatedDate,
    }));
  };

  const reconfirmTimestamp = (field: 'lastPriceVerification' | 'lastAvailabilityVerification' | 'lastOwnerConfirmation' | 'lastAgentConfirmation' | 'lastDocumentVerification') => {
    const nowIso = new Date().toISOString();
    updateFreshnessField(field, nowIso);
  };

  const toggleOccupant = (occ: string) => {
    const list = avail.allowedOccupants || [];
    const exists = list.includes(occ as any);
    const updated = exists ? list.filter((x) => x !== occ) : [...list, occ as any];
    updateAvail({ allowedOccupants: updated });
  };

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            25, 26 & 27. Availability, Inventory, Tenant Preferences & Investment Metrics
          </h3>
          <p className="text-xs opacity-70">
            Configure possession dates, unit inventory, tenant eligibility rules, and institutional investor yields.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
          Inventory & Yield Data
        </span>
      </div>

      {/* Availability & Booking Status */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400" />
          Availability, Booking Status & Timeline
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-white/80 block">
              Booking Status <span className="text-rose-400">*</span>
            </label>
            <select
              value={avail.bookingStatus || 'AVAILABLE'}
              onChange={(e) => updateAvail({ bookingStatus: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="AVAILABLE">Available for Booking</option>
              <option value="RESERVED">Reserved (Token Paid)</option>
              <option value="UNDER_OFFER">Under Formal Offer</option>
              <option value="TEMPORARILY_UNAVAILABLE">Temporarily Unavailable</option>
              <option value="SOLD_OUT">Sold Out</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Possession Status</label>
            <select
              value={formData.propertyStatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyStatus: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="READY_TO_MOVE">Immediate Ready to Move (OC Received)</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
              <option value="NEW_LAUNCH">New Launch</option>
              <option value="PRE_LAUNCH">Pre-Launch / EOI</option>
              <option value="RESALE">Resale / Ready Secondary</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Target Possession Date</label>
            <input
              type="month"
              value={avail.possessionDate || '2026-12'}
              onChange={(e) => updateAvail({ possessionDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/80 block">Expected Possession Quarter</label>
            <input
              type="text"
              placeholder="e.g. Q4 2026 / Immediate"
              value={avail.expectedPossessionQuarter || ''}
              onChange={(e) => updateAvail({ expectedPossessionQuarter: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Immediate availability toggle */}
        <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-white/90">
            <input
              type="checkbox"
              checked={avail.isAvailableNow ?? true}
              onChange={(e) => updateAvail({ isAvailableNow: e.target.checked })}
              className="rounded text-amber-500"
            />
            <span className="font-semibold text-emerald-400">
              Available Immediately for Inspection / Registration
            </span>
          </label>

          {!avail.isAvailableNow && (
            <div className="flex items-center gap-2">
              <span className="text-white/60">Available From:</span>
              <input
                type="date"
                value={avail.availableFromDate || ''}
                onChange={(e) => updateAvail({ availableFromDate: e.target.value })}
                className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-white font-mono text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Unit Counts & Inventory Matrix */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <Building className="w-4 h-4 text-blue-400" />
          Unit Inventory & Distribution
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-white/60 block mb-1">Total Units</span>
            <input
              type="number"
              value={avail.totalUnitsCount ?? 1}
              onChange={(e) => updateAvail({ totalUnitsCount: parseInt(e.target.value) || 1 })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <span className="text-emerald-400 block mb-1">Available Units</span>
            <input
              type="number"
              value={avail.availableUnitsCount ?? 1}
              onChange={(e) => updateAvail({ availableUnitsCount: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-emerald-500/30 text-white font-mono"
            />
          </div>
          <div>
            <span className="text-rose-400 block mb-1">Sold Units</span>
            <input
              type="number"
              value={avail.soldUnitsCount ?? 0}
              onChange={(e) => updateAvail({ soldUnitsCount: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <span className="text-amber-400 block mb-1">Rented Units</span>
            <input
              type="number"
              value={avail.rentedUnitsCount ?? 0}
              onChange={(e) => updateAvail({ rentedUnitsCount: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <span className="text-cyan-400 block mb-1">Leased Units</span>
            <input
              type="number"
              value={avail.leasedUnitsCount ?? 0}
              onChange={(e) => updateAvail({ leasedUnitsCount: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Buyer & Tenant Preferences */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <Users className="w-4 h-4 text-purple-400" />
          Buyer & Tenant Preferences / Rules
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {[
            { key: 'FAMILY', label: 'Family Allowed' },
            { key: 'BACHELOR', label: 'Bachelors Allowed' },
            { key: 'FEMALE_ONLY', label: 'Female Only' },
            { key: 'MALE_ONLY', label: 'Male Only' },
            { key: 'COMPANY_LEASE', label: 'Company Lease' },
            { key: 'CORPORATE_TENANTS', label: 'Corporate Tenants' },
            { key: 'STUDENTS', label: 'Students Allowed' },
            { key: 'WORKING_PROFESSIONALS', label: 'Working Professionals' },
            { key: 'SENIOR_CITIZENS', label: 'Senior Citizens Friendly' },
          ].map((occ) => {
            const isChecked = (avail.allowedOccupants || []).includes(occ.key as any);
            return (
              <label
                key={occ.key}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleOccupant(occ.key)}
                  className="rounded text-purple-500"
                />
                <span className="font-medium text-[11px] text-white/90">{occ.label}</span>
              </label>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={avail.petFriendly ?? true}
              onChange={(e) => updateAvail({ petFriendly: e.target.checked })}
              className="rounded text-amber-500"
            />
            <span className="text-white/90">Pet Friendly</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={avail.vegetarianOnly ?? false}
              onChange={(e) => updateAvail({ vegetarianOnly: e.target.checked })}
              className="rounded text-amber-500"
            />
            <span className="text-white/90">Vegetarian Only</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={avail.smokingAllowed ?? false}
              onChange={(e) => updateAvail({ smokingAllowed: e.target.checked })}
              className="rounded text-amber-500"
            />
            <span className="text-white/90">Smoking Allowed</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={avail.alcoholAllowed ?? true}
              onChange={(e) => updateAvail({ alcoholAllowed: e.target.checked })}
              className="rounded text-amber-500"
            />
            <span className="text-white/90">Alcohol Permitted</span>
          </label>
        </div>

        <div className="pt-1">
          <label className="text-[11px] text-white/60 block mb-1">Visitor / Guest Policy</label>
          <input
            type="text"
            placeholder="e.g. Guests allowed until 10 PM, overnight visitors with prior security notice"
            value={avail.visitorPolicy || ''}
            onChange={(e) => updateAvail({ visitorPolicy: e.target.value })}
            className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
          />
        </div>
      </div>

      {/* Investment Data & Capital Yield Matrix */}
      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            27. Institutional Investment Metrics & ROI Projections
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Projections Clearly Marked as Estimates
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-white/70 block mb-1">Monthly Rental Income (INR)</span>
            <input
              type="number"
              value={avail.estimatedMonthlyRentalIncomeINR ?? 85000}
              onChange={(e) => {
                const m = parseFloat(e.target.value) || 0;
                updateAvail({
                  estimatedMonthlyRentalIncomeINR: m,
                  estimatedAnnualRentalIncomeINR: m * 12,
                });
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>

          <div>
            <span className="text-white/70 block mb-1">Annual Rental Income (INR)</span>
            <input
              type="number"
              value={avail.estimatedAnnualRentalIncomeINR ?? 1020000}
              onChange={(e) =>
                updateAvail({ estimatedAnnualRentalIncomeINR: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>

          <div>
            <span className="text-white/70 block mb-1">Gross Rental Yield (%)</span>
            <input
              type="number"
              step="0.1"
              value={avail.grossRentalYieldPct ?? 5.1}
              onChange={(e) =>
                updateAvail({ grossRentalYieldPct: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-emerald-400 font-mono font-bold"
            />
          </div>

          <div>
            <span className="text-white/70 block mb-1">Current Occupancy Rate (%)</span>
            <input
              type="number"
              value={avail.currentOccupancyRatePct ?? 95}
              onChange={(e) =>
                updateAvail({ currentOccupancyRatePct: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-white/70 block mb-1">Capital Apprec. (% p.a. Verified)</span>
            <input
              type="number"
              step="0.1"
              value={avail.historicalCapitalAppreciationPct ?? 9.8}
              onChange={(e) =>
                updateAvail({ historicalCapitalAppreciationPct: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>

          <div>
            <span className="text-white/70 block mb-1">Tenant Quality / Credit</span>
            <select
              value={avail.tenantQualityGrade || 'AAA_MNC'}
              onChange={(e) => updateAvail({ tenantQualityGrade: e.target.value as any })}
              className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="AAA_MNC">AAA Fortune 500 / Bluechip MNC</option>
              <option value="AA_LISTED">Publicly Listed Indian Corporate</option>
              <option value="BANK_NBFC">Scheduled Commercial Bank / NBFC</option>
              <option value="REPUTED_PVT">Reputed Private Enterprise</option>
              <option value="INDIVIDUAL">HNI Individual Tenant</option>
            </select>
          </div>

          <div>
            <span className="text-white/70 block mb-1">Expected IRR (%) [Estimate]</span>
            <input
              type="number"
              step="0.1"
              value={avail.expectedIrrPct ?? 14.5}
              onChange={(e) => updateAvail({ expectedIrrPct: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-emerald-500/30 text-emerald-300 font-mono font-bold"
            />
          </div>

          <div>
            <span className="text-white/70 block mb-1">Resale Liquidity Score (/100)</span>
            <input
              type="number"
              value={avail.resaleLiquidityScore ?? 88}
              onChange={(e) =>
                updateAvail({ resaleLiquidityScore: parseInt(e.target.value) || 0 })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <span className="text-white/70 block mb-1">Exit Liquidity Potential</span>
            <select
              value={avail.exitPotential || 'HIGH_LIQUIDITY'}
              onChange={(e) => updateAvail({ exitPotential: e.target.value as any })}
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="HIGH_LIQUIDITY">High Liquidity (Prime Location & Heavy Demand)</option>
              <option value="MODERATE_LIQUIDITY">Moderate Liquidity (Steady Secondary Market)</option>
              <option value="LONG_TERM_ONLY">Long-Term Only (Niche Ultra-Luxury)</option>
            </select>
          </div>

          <div>
            <span className="text-white/70 block mb-1">Recommended Holding Horizon</span>
            <select
              value={avail.recommendedInvestmentHorizonYears ?? 5}
              onChange={(e) =>
                updateAvail({ recommendedInvestmentHorizonYears: parseInt(e.target.value) || 5 })
              }
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value={3}>3 Years (Medium Term Flip)</option>
              <option value={5}>5 Years (Optimal Compounding)</option>
              <option value={7}>7 Years (High Appreciation Horizon)</option>
              <option value={10}>10+ Years (Generational Yield Asset)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= 36. FRESHNESS / AVAILABILITY VERIFICATION SYSTEM ================= */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-black/40 to-cyan-500/10 border border-amber-500/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                36. Freshness & Availability Verification Audit System
              </h3>
              <p className="text-xs text-white/70">
                Automated staleness detection, multi-stakeholder confirmation logs, and periodic reconfirmation triggers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {freshness.isStale ? (
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Stale Listing Alert
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Verified Fresh
              </span>
            )}
          </div>
        </div>

        {/* Live Staleness Banner & Example Text Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Availability Status</span>
              <span className="font-mono text-[10px] text-amber-400">
                {freshness.daysSinceLastAvailabilityCheck}d ago
              </span>
            </div>
            <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{freshness.availabilityVerifiedText}</span>
            </div>
            <button
              type="button"
              onClick={() => reconfirmTimestamp('lastAvailabilityVerification')}
              className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reconfirm Availability Now
            </button>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Price Freshness</span>
              <span className="font-mono text-[10px] text-amber-400">
                {freshness.daysSinceLastPriceCheck}d ago
              </span>
            </div>
            <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{freshness.priceVerifiedText}</span>
            </div>
            <button
              type="button"
              onClick={() => reconfirmTimestamp('lastPriceVerification')}
              className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reconfirm Price Now
            </button>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Stakeholder Confirmation</span>
              <span className="font-mono text-[10px] text-cyan-400">Verified</span>
            </div>
            <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{formatVerificationInterval(freshness.lastOwnerConfirmation)}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <button
                type="button"
                onClick={() => reconfirmTimestamp('lastOwnerConfirmation')}
                className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer text-center"
              >
                Owner Confirm
              </button>
              <button
                type="button"
                onClick={() => reconfirmTimestamp('lastAgentConfirmation')}
                className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-medium transition-colors cursor-pointer text-center"
              >
                Agent Confirm
              </button>
            </div>
          </div>
        </div>

        {/* Stale Listing Alert Notice if Flagged */}
        {freshness.isStale && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-rose-300 text-sm">
                Attention Required: Listing Flagged as Stale
              </div>
              <p className="text-rose-200/90 leading-relaxed">
                {freshness.staleReason || 'This listing has not had its price or availability confirmed within the standard window.'}
                To prevent dropped search rankings or customer disputes, please request agent or owner reconfirmation immediately.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const nowIso = new Date().toISOString();
                    updateFreshnessField('lastAvailabilityVerification', nowIso);
                    updateFreshnessField('lastPriceVerification', nowIso);
                    updateFreshnessField('lastOwnerConfirmation', nowIso);
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-400 transition-colors cursor-pointer"
                >
                  Clear Stale Status & Mark All Verified Today
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Granular Audit Timestamp Fields */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white/90">
            Stored Timestamp Logs (Section 36 Required Records)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-white/70 block">Created Date</label>
              <input
                type="date"
                value={freshness.createdDate ? freshness.createdDate.split('T')[0] : ''}
                onChange={(e) => updateFreshnessField('createdDate', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 block">Updated Date</label>
              <input
                type="date"
                value={freshness.updatedDate ? freshness.updatedDate.split('T')[0] : ''}
                onChange={(e) => updateFreshnessField('updatedDate', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 block">Last Price Verification</label>
              <input
                type="date"
                value={freshness.lastPriceVerification ? freshness.lastPriceVerification.split('T')[0] : ''}
                onChange={(e) => updateFreshnessField('lastPriceVerification', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 block">Last Availability Verification</label>
              <input
                type="date"
                value={freshness.lastAvailabilityVerification ? freshness.lastAvailabilityVerification.split('T')[0] : ''}
                onChange={(e) => updateFreshnessField('lastAvailabilityVerification', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 block">Last Owner Confirmation</label>
              <input
                type="date"
                value={freshness.lastOwnerConfirmation ? freshness.lastOwnerConfirmation.split('T')[0] : ''}
                onChange={(e) => updateFreshnessField('lastOwnerConfirmation', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 block">Last Document Verification</label>
              <input
                type="date"
                value={freshness.lastDocumentVerification ? freshness.lastDocumentVerification.split('T')[0] : ''}
                onChange={(e) => updateFreshnessField('lastDocumentVerification', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

