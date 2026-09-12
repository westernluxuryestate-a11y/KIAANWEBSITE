/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IndianRupee, Calculator, ShieldCheck, CheckCircle2, TrendingUp, AlertCircle, Eye, EyeOff, FileText, Check } from 'lucide-react';
import {
  UniversalListingFormData,
  formatINRDisplay,
  FinancialCalculationResult,
} from '../../services/universalListingSchemaService';

interface StagePricingProps {
  formData: UniversalListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<UniversalListingFormData>>;
  financials: FinancialCalculationResult;
}

export const StagePricing: React.FC<StagePricingProps> = ({
  formData,
  setFormData,
  financials,
}) => {
  const tx = formData.transactionType;

  // Determine transaction archetype - inclusive of standard SALE, RENT, LEASE identifiers
  const isSaleModel = [
    'SALE',
    'FOR_SALE',
    'RESALE',
    'NEW_LAUNCH',
    'READY_TO_MOVE',
    'UNDER_CONSTRUCTION',
    'PRE_LAUNCH',
    'INVESTMENT',
    'LAND_PLOT_SALE',
  ].includes(tx);

  const isRentalModel = ['RENT', 'FOR_RENT', 'RENT_PLUS_LEASE', 'COMMERCIAL_RENT'].includes(tx);

  const isLeaseModel = [
    'LEASE',
    'FOR_LEASE',
    'COMMERCIAL_LEASE',
    'LAND_LEASE',
    'LONG_TERM_LEASE',
    'SHORT_TERM_LEASE',
  ].includes(tx);

  const isPreLeasedModel =
    tx === 'PRE_LEASE' ||
    Boolean(formData.preLeasedData?.isPreLeased) ||
    Boolean(formData.preLeasedData?.isPreRented) ||
    (formData.listingPurpose as any) === 'HIGH_YIELD_INVESTMENT' ||
    formData.listingPurpose === 'INVESTMENT';
  const isAuctionModel = tx === 'AUCTION' || tx === 'DISTRESS_SALE';
  const isJvModel = tx === 'JOINT_VENTURE' || tx === 'DEVELOPMENT_OPPORTUNITY';
  const isCoworkingModel = tx === 'COWORKING_MANAGED';
  const isPgHostelModel = tx === 'PG_PAYING_GUEST' || tx === 'HOSTEL';

  // Area for per sq ft calculation
  const referenceAreaSqFt =
    formData.residential?.carpetAreaSqFt ||
    formData.commercial?.carpetAreaSqFt ||
    formData.land?.plotArea ||
    1000;

  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-6">
      <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-400" />
            6. Pricing, Valuation & Commercial Structure
          </h3>
          <p className="text-xs opacity-70">
            Active Transaction Mode:{' '}
            <span className="font-bold text-amber-400">{tx.replace(/_/g, ' ')}</span>
            . Fill in complete transaction, statutory and operational pricing fields below.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
          Verified Comprehensive Schema
        </span>
      </div>

      {/* ================= SALE / RESALE SPECIFIC FIELDS ================= */}
      {isSaleModel && (
        <div className="space-y-6">
          {/* 1. Core Sale Pricing & Ranges */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Core Consideration &amp; Price Range</span>
              <span className="text-[10px] text-white/50">Asking, Range, Unit Rate &amp; Consideration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Asking Price (INR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-white/50">₹</span>
                  <input
                    type="number"
                    value={formData.salePricing?.askingPriceINR ?? 23500000}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const calculatedRate = Math.round(price / (referenceAreaSqFt || 1));
                      setFormData((prev) => ({
                        ...prev,
                        salePricing: {
                          ...prev.salePricing!,
                          askingPriceINR: price,
                          expectedPriceINR: price,
                          totalConsiderationINR: price,
                          pricePerSqFt: calculatedRate,
                        },
                      }));
                    }}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>
                <div className="text-[11px] text-amber-400 font-mono">
                  {formatINRDisplay(formData.salePricing?.askingPriceINR ?? 0)}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Price per Sq.Ft (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-white/50">₹</span>
                  <input
                    type="number"
                    value={formData.salePricing?.pricePerSqFt ?? Math.round((formData.salePricing?.askingPriceINR ?? 23500000) / referenceAreaSqFt)}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        salePricing: {
                          ...prev.salePricing!,
                          pricePerSqFt: rate,
                        },
                      }));
                    }}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div className="text-[10px] text-white/50">
                  Based on ~{referenceAreaSqFt} Sq.Ft base area
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Price Range Min (INR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2,20,00,000"
                  value={formData.salePricing?.priceRangeMinINR ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        priceRangeMinINR: parseFloat(e.target.value) || undefined,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
                <div className="text-[10px] text-white/50 font-mono">
                  {formData.salePricing?.priceRangeMinINR ? formatINRDisplay(formData.salePricing.priceRangeMinINR) : 'Optional bracket min'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Price Range Max (INR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2,50,00,000"
                  value={formData.salePricing?.priceRangeMaxINR ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        priceRangeMaxINR: parseFloat(e.target.value) || undefined,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
                <div className="text-[10px] text-white/50 font-mono">
                  {formData.salePricing?.priceRangeMaxINR ? formatINRDisplay(formData.salePricing.priceRangeMaxINR) : 'Optional bracket max'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Total Consideration (INR)</label>
                <input
                  type="number"
                  value={formData.salePricing?.totalConsiderationINR ?? formData.salePricing?.askingPriceINR ?? 23500000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        totalConsiderationINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Expected Price (INR)</label>
                <input
                  type="number"
                  value={formData.salePricing?.expectedPriceINR ?? formData.salePricing?.askingPriceINR ?? 23500000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        expectedPriceINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Price Negotiation</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        salePricing: { ...prev.salePricing!, isNegotiable: true },
                      }))
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                      formData.salePricing?.isNegotiable
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                        : 'bg-white/5 text-white/60 border-white/10'
                    }`}
                  >
                    Negotiable
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        salePricing: { ...prev.salePricing!, isNegotiable: false },
                      }))
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                      !formData.salePricing?.isNegotiable
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                        : 'bg-white/5 text-white/60 border-white/10'
                    }`}
                  >
                    Fixed Price
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Token, Down Payment & Confidential Admin Reserve Price */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Token, Down Payment &amp; Confidential Reserve</span>
              <span className="text-[10px] text-white/50">Deal Commitments &amp; Internal Reserve</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Booking Amount (INR)</label>
                <input
                  type="number"
                  value={formData.salePricing?.bookingTokenAmountINR ?? 200000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        bookingTokenAmountINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Token Amount (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 50,000"
                  value={formData.salePricing?.tokenAmountINR ?? 50000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        tokenAmountINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Down Payment (INR &amp; %)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={formData.salePricing?.downPaymentINR ?? Math.round((formData.salePricing?.askingPriceINR ?? 23500000) * 0.2)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salePricing: {
                          ...prev.salePricing!,
                          downPaymentINR: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                  />
                  <input
                    type="number"
                    placeholder="%"
                    value={formData.salePricing?.downPaymentPercent ?? 20}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salePricing: {
                          ...prev.salePricing!,
                          downPaymentPercent: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-16 px-2 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="space-y-1.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <label className="text-xs font-semibold text-rose-300 flex items-center justify-between">
                  <span>Min Acceptable Price</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-rose-500/30 text-rose-200 rounded font-bold">Admin Only</span>
                </label>
                <input
                  type="number"
                  placeholder="Confidential floor price"
                  value={formData.salePricing?.minimumAcceptablePriceINR ?? 22000000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        minimumAcceptablePriceINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-black/70 border border-rose-500/30 text-xs text-rose-200 font-mono"
                />
                <div className="text-[10px] text-rose-300/70 font-mono">
                  Hidden from public listings
                </div>
              </div>
            </div>
          </div>

          {/* 3. Loan & Banking Eligibility */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Home Loan &amp; Bank Approvals</span>
              <span className="text-[10px] text-white/50">Mortgage Eligibility &amp; Approved Lenders</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={formData.salePricing?.loanAvailable ?? true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salePricing: { ...prev.salePricing!, loanAvailable: e.target.checked },
                      }))
                    }
                    className="rounded text-amber-500"
                  />
                  <span className="text-xs font-semibold text-white">Bank Home Loan Available</span>
                </label>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Loan Approved Banks (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra"
                  value={
                    formData.salePricing?.loanApprovedBanks?.join(', ') ||
                    'SBI, HDFC Bank, ICICI Bank, Axis Bank'
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        loanApprovedBanks: e.target.value.split(',').map((b) => b.trim()).filter(Boolean),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Statutory Charges, Brokerage & Live Statutory Breakdown */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Statutory Taxes, Duties &amp; Ancillary Charges</span>
              <span className="text-[10px] text-white/50">Stamp Duty, Registration, GST &amp; Brokerage</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Registration (INR)</label>
                <input
                  type="number"
                  value={formData.salePricing?.registrationChargesINR ?? (financials.registrationChargesINR || (financials as any).registrationINR || 30000)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        registrationChargesINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Stamp Duty (INR)</label>
                <input
                  type="number"
                  value={formData.salePricing?.stampDutyAmountINR ?? (financials.stampDutyAmountINR || (financials as any).stampDutyINR || 0)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        stampDutyAmountINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">GST (INR)</label>
                <input
                  type="number"
                  value={formData.salePricing?.gstAmountINR ?? (financials.gstAmountINR || (financials as any).gstINR || 0)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        gstAmountINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Brokerage (INR)</label>
                <input
                  type="number"
                  value={formData.salePricing?.brokerageAmountINR ?? Math.round((formData.salePricing?.askingPriceINR ?? 23500000) * 0.01)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        brokerageAmountINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Other Charges (INR)</label>
                <input
                  type="number"
                  placeholder="Society transfer, legal"
                  value={formData.salePricing?.otherChargesINR ?? 150000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePricing: {
                        ...prev.salePricing!,
                        otherChargesINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Total Acquisition Calculation Display */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" /> Estimated Total Acquisition Cost Breakdown
                </span>
                <span>All-Inclusive Buyer Cost</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <div className="opacity-70 text-[10px]">Asking Price</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {formatINRDisplay(formData.salePricing?.askingPriceINR ?? 0)}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <div className="opacity-70 text-[10px]">Stamp Duty + Reg</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {formatINRDisplay((formData.salePricing?.stampDutyAmountINR || financials.stampDutyAmountINR || (financials as any).stampDutyINR || 0) + (formData.salePricing?.registrationChargesINR || financials.registrationChargesINR || (financials as any).registrationINR || 0))}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <div className="opacity-70 text-[10px]">Estimated GST</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {formatINRDisplay(formData.salePricing?.gstAmountINR ?? financials.gstAmountINR ?? (financials as any).gstINR ?? 0)}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <div className="opacity-70 text-[10px]">Brokerage &amp; Other</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {formatINRDisplay((formData.salePricing?.brokerageAmountINR || 0) + (formData.salePricing?.otherChargesINR || 0))}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/30">
                  <div className="text-amber-400 text-[10px] font-bold">Total Acquisition</div>
                  <div className="font-mono font-bold text-amber-300 mt-0.5">
                    {formatINRDisplay(
                      (formData.salePricing?.askingPriceINR || 0) +
                      (formData.salePricing?.stampDutyAmountINR || financials.stampDutyAmountINR || (financials as any).stampDutyINR || 0) +
                      (formData.salePricing?.registrationChargesINR || financials.registrationChargesINR || (financials as any).registrationINR || 0) +
                      (formData.salePricing?.gstAmountINR || financials.gstAmountINR || (financials as any).gstINR || 0) +
                      (formData.salePricing?.brokerageAmountINR || 0) +
                      (formData.salePricing?.otherChargesINR || 0)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= RENTAL SPECIFIC FIELDS ================= */}
      {isRentalModel && (
        <div className="space-y-6">
          {/* 1. Rent, Deposit & Maintenance */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Rent, Deposit &amp; Periodic Maintenance</span>
              <span className="text-[10px] text-white/50">Monthly Rent, Deposit &amp; Utility Inclusions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Monthly Rent (INR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-white/50">₹</span>
                  <input
                    type="number"
                    value={formData.rentPricing?.monthlyRentINR ?? 65000}
                    onChange={(e) => {
                      const rent = parseFloat(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        rentPricing: {
                          ...prev.rentPricing!,
                          monthlyRentINR: rent,
                          securityDepositINR: rent * (prev.rentPricing?.depositMonthsEquivalent ?? 3),
                        },
                      }));
                    }}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="text-[11px] text-amber-400 font-mono">
                  {formatINRDisplay(formData.rentPricing?.monthlyRentINR ?? 0)} / Month
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Security Deposit (INR) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.rentPricing?.securityDepositINR ?? 200000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: {
                        ...prev.rentPricing!,
                        securityDepositINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
                <div className="text-[10px] text-white/50 font-mono">
                  {formatINRDisplay(formData.rentPricing?.securityDepositINR ?? 0)}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Deposit in Months
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.rentPricing?.depositMonthsEquivalent ?? 3}
                  onChange={(e) => {
                    const months = parseInt(e.target.value) || 1;
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: {
                        ...prev.rentPricing!,
                        depositMonthsEquivalent: months,
                        securityDepositINR: (prev.rentPricing?.monthlyRentINR ?? 65000) * months,
                      },
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Maintenance (INR / Month)
                </label>
                <input
                  type="number"
                  value={formData.rentPricing?.maintenanceChargesMonthlyINR ?? 4500}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: {
                        ...prev.rentPricing!,
                        maintenanceChargesMonthlyINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Utility inclusions & Recurring Charges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.rentPricing?.isMaintenanceIncluded}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, isMaintenanceIncluded: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="text-xs font-semibold text-white">Maintenance Included in Rent</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.rentPricing?.isElectricityIncluded}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, isElectricityIncluded: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="text-xs font-semibold text-white">Electricity Included</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.rentPricing?.isWaterIncluded}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, isWaterIncluded: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="text-xs font-semibold text-white">Water Charges Included</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rentPricing?.brokerageApplicable ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, brokerageApplicable: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="text-xs font-semibold text-white">Brokerage Applicable</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Water Charges (INR/mo)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={formData.rentPricing?.waterChargesMonthlyINR ?? 500}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, waterChargesMonthlyINR: parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Parking Charges (INR/mo)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={formData.rentPricing?.parkingChargesMonthlyINR ?? 2000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, parkingChargesMonthlyINR: parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Other Monthly Charges</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={formData.rentPricing?.otherMonthlyChargesINR ?? 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, otherMonthlyChargesINR: parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Brokerage Amount (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 65,000 (1 Mo)"
                  value={formData.rentPricing?.brokerageAmountINR ?? formData.rentPricing?.monthlyRentINR ?? 65000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, brokerageAmountINR: parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Tenure, Lock-in, Escalation & Availability */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Tenure, Lock-in, Escalation &amp; Furnished State</span>
              <span className="text-[10px] text-white/50">Lease Terms, Timelines &amp; Move-in Date</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Min Tenure (Months)</label>
                <input
                  type="number"
                  value={formData.rentPricing?.minimumTenureMonths ?? 11}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, minimumTenureMonths: parseInt(e.target.value) || 1 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Lock-in Period (Months)</label>
                <input
                  type="number"
                  value={formData.rentPricing?.lockInPeriodMonths ?? 6}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, lockInPeriodMonths: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Notice Period (Days)</label>
                <input
                  type="number"
                  value={formData.rentPricing?.noticePeriodDays ?? 30}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, noticePeriodDays: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Rent Escalation (%/Yr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.rentPricing?.annualRentEscalationPercent ?? 5}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, annualRentEscalationPercent: parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Available From</label>
                <input
                  type="date"
                  value={formData.rentPricing?.availableFromDate ?? new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, availableFromDate: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Furnished Status</label>
                <select
                  value={formData.rentPricing?.furnishedStatus ?? 'SEMI_FURNISHED'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, furnishedStatus: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi-Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Food Preference</label>
                <select
                  value={formData.rentPricing?.foodPreference ?? 'NO_RESTRICTION'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, foodPreference: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="NO_RESTRICTION">No Food Restrictions</option>
                  <option value="VEGETARIAN_ONLY">Vegetarian Only</option>
                  <option value="JAIN_ONLY">Strict Jain Vegetarian</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/90 block">Visitor Policy</label>
                <input
                  type="text"
                  placeholder="e.g. Guests allowed / Family only"
                  value={formData.rentPricing?.visitorPolicy ?? 'Visitors allowed, overnight guests with prior notice'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, visitorPolicy: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Tenant Preference & Lifestyle Compatibility */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Tenant Compatibility &amp; House Rules</span>
              <span className="text-[10px] text-white/50">Family, Bachelor, Pets &amp; Corporate Lease</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rentPricing?.familyAllowed ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, familyAllowed: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Family Allowed</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.rentPricing?.bachelorsAllowed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, bachelorsAllowed: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Bachelors Allowed</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.rentPricing?.companyLeasePreferred}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, companyLeasePreferred: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Corporate Lease</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.rentPricing?.petsAllowed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, petsAllowed: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Pets Allowed</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.rentPricing?.smokingAllowed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rentPricing: { ...prev.rentPricing!, smokingAllowed: e.target.checked },
                    }))
                  }
                  className="rounded text-amber-500"
                />
                <span className="font-semibold">Smoking Permitted</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= LEASE SPECIFIC FIELDS ================= */}
      {isLeaseModel && (
        <div className="space-y-6">
          {/* 1. Consideration, Monthly Equivalent & Deposit */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Commercial Lease Financial Structure</span>
              <span className="text-[10px] text-white/50">Monthly Equivalent, Consideration &amp; Security Deposit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Monthly Lease Equivalent (INR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-white/50">₹</span>
                  <input
                    type="number"
                    value={formData.leasePricing?.monthlyLeaseEquivalentINR ?? 350000}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        leasePricing: {
                          ...prev.leasePricing!,
                          monthlyLeaseEquivalentINR: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="text-[11px] text-amber-400 font-mono">
                  {formatINRDisplay(formData.leasePricing?.monthlyLeaseEquivalentINR ?? 0)} / Month
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Total Lease Amount (INR)
                </label>
                <input
                  type="number"
                  placeholder="Total period consideration"
                  value={formData.leasePricing?.leaseAmountINR ?? (formData.leasePricing?.monthlyLeaseEquivalentINR ?? 350000) * 12 * (formData.leasePricing?.leaseDurationYears ?? 5)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        leaseAmountINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
                <div className="text-[10px] text-white/50 font-mono">
                  {formatINRDisplay(formData.leasePricing?.leaseAmountINR ?? 0)} Total
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Security Deposit (INR) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.securityDepositINR ?? 2100000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        securityDepositINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
                <div className="text-[10px] text-white/50 font-mono">
                  {formatINRDisplay(formData.leasePricing?.securityDepositINR ?? 0)} (~6 months equivalent)
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Registration &amp; Stamp Duty (INR)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.registrationChargesINR ?? 85000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        registrationChargesINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Duration, Lock-in, Escalation & Renewal Terms */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Duration, Lock-in, Escalation &amp; Renewals</span>
              <span className="text-[10px] text-white/50">Contractual Horizons &amp; Escalation Schedule</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Lease Duration (Years)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.leaseDurationYears ?? 5}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        leaseDurationYears: parseInt(e.target.value) || 1,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Minimum Lease Period (Months)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.minimumLeasePeriodMonths ?? 36}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        minimumLeasePeriodMonths: parseInt(e.target.value) || 12,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Lock-in Period (Months)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.lockInPeriodMonths ?? 36}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        lockInPeriodMonths: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Annual Rent Escalation (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={(formData.leasePricing as any)?.annualRentEscalationPercent ?? formData.leasePricing?.rentEscalationPercent ?? 5}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        annualRentEscalationPercent: parseFloat(e.target.value) || 0,
                        rentEscalationPercent: parseFloat(e.target.value) || 0,
                      } as any,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Notice Period (Days)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.noticePeriodDays ?? 90}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        noticePeriodDays: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Renewal Terms &amp; Conditions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5-year renewal option with 15% escalation every 3 years"
                  value={formData.leasePricing?.renewalTerms ?? 'Option to renew for 5 years at prevailing market rate with 15% escalation'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        renewalTerms: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. CAM, Fit-Out & Maintenance */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>CAM, Fit-Out &amp; Operational Charges</span>
              <span className="text-[10px] text-white/50">Common Area Maintenance &amp; Fit-Out Period</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  CAM Charges (₹ / Sq.Ft / Month)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.camChargesPerSqFtMonthlyINR ?? 12}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        camChargesPerSqFtMonthlyINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Fit-Out Period / Rent-Free (Months)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.fitOutPeriodMonths ?? formData.leasePricing?.rentFreePeriodMonths ?? 3}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        fitOutPeriodMonths: parseInt(e.target.value) || 0,
                        rentFreePeriodMonths: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Maintenance (INR / Month)
                </label>
                <input
                  type="number"
                  value={formData.leasePricing?.maintenanceMonthlyINR ?? 25000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        maintenanceMonthlyINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Covenant & Tax Allocation Responsibilities */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Tax, Utility &amp; Covenants Allocation</span>
              <span className="text-[10px] text-white/50">Landlord vs Tenant Responsibilities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Property Tax Responsibility</label>
                <select
                  value={formData.leasePricing?.propertyTaxResponsibility ?? 'LANDLORD'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        propertyTaxResponsibility: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="LANDLORD">Landlord Pays Property Tax</option>
                  <option value="TENANT">Tenant Pays Property Tax (Triple Net / NNN)</option>
                  <option value="SHARED">Shared 50-50</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Utilities Responsibility</label>
                <select
                  value={formData.leasePricing?.utilitiesResponsibility ?? 'TENANT'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        utilitiesResponsibility: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                >
                  <option value="TENANT">Tenant Pays Utilities Directly (Power, Water, Gas)</option>
                  <option value="LANDLORD">Landlord Incurred</option>
                  <option value="SHARED">Shared Pro-Rata</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Tenant Responsibilities</label>
                <input
                  type="text"
                  placeholder="e.g. Internal fit-out upkeep, trade licenses, internal insurance"
                  value={formData.leasePricing?.tenantResponsibility ?? 'Internal premise maintenance, interiors, trade licenses, electricity bills'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        tenantResponsibility: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">Landlord Responsibilities</label>
                <input
                  type="text"
                  placeholder="e.g. Structural repairs, external building facade, property tax"
                  value={formData.leasePricing?.landlordResponsibility ?? 'Structural integrity, main building insurance, municipal tax compliance'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leasePricing: {
                        ...prev.leasePricing!,
                        landlordResponsibility: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRE-LEASE / PRE-RENT (INVESTMENT ASSET) SPECIFIC FIELDS ================= */}
      {isPreLeasedModel && (
        <div className="space-y-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-black/60 to-slate-900/60 border border-emerald-500/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">
                  Pre-Leased &amp; Pre-Rented Institutional Asset Specifications
                </h4>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                For income-generating commercial and residential assets. Capture verified historical revenue and estimated projections.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                High-Yield Investment Mode
              </span>
            </div>
          </div>

          {/* CRITICAL COMPLIANCE NOTICE: NEVER REPRESENT PROJECTED RETURNS AS GUARANTEED */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="font-bold text-amber-300">Statutory Regulatory Mandate:</strong> Projected returns, forecast yields, and future appreciation are purely illustrative estimates and <strong className="underline text-amber-100">must NEVER be represented or marketed as guaranteed</strong>. Existing income must be based strictly on verified executed lease agreements and audited rent credit receipts.
            </div>
          </div>

          {/* Asset Classification & Type Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white/90 p-1">
              <input
                type="checkbox"
                checked={formData.preLeasedData?.isPreLeased ?? true}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: {
                      ...prev.preLeasedData!,
                      isPreLeased: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-0"
              />
              <span>Pre-Leased Asset (Commercial / Corporate)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white/90 p-1">
              <input
                type="checkbox"
                checked={formData.preLeasedData?.isPreRented ?? false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: {
                      ...prev.preLeasedData!,
                      isPreRented: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-0"
              />
              <span>Pre-Rented Asset (Residential / Co-living)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white/90 p-1">
              <input
                type="checkbox"
                checked={formData.preLeasedData?.hasExistingTenant ?? true}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: {
                      ...prev.preLeasedData!,
                      hasExistingTenant: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-0"
              />
              <span>Existing Tenant Currently in Place</span>
            </label>
          </div>

          {/* Tenant Profile & Visibility Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/90 block">
                  Tenant Name / Brand <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      preLeasedData: {
                        ...prev.preLeasedData!,
                        isTenantNamePublic: !prev.preLeasedData?.isTenantNamePublic,
                      },
                    }))
                  }
                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                >
                  {formData.preLeasedData?.isTenantNamePublic ? (
                    <>
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Public Visibility</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-300">Private / Confidential</span>
                    </>
                  )}
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. MNC Bank / IT Fortune 500 / Retail Anchor"
                value={formData.preLeasedData?.tenantName ?? 'Global Investment Bank'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: { ...prev.preLeasedData!, tenantName: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 font-medium"
              />
              <p className="text-[10px] text-white/50">
                {formData.preLeasedData?.isTenantNamePublic
                  ? 'Tenant name is shown publicly on listing brochures & pitch cards.'
                  : 'Tenant name is masked on public listing (shown as "Confidential Blue-Chip MNC").'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Tenant Type</label>
              <select
                value={formData.preLeasedData?.tenantType ?? 'BANK'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: { ...prev.preLeasedData!, tenantType: e.target.value as any },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="BANK">Nationalized / Private Bank</option>
                <option value="MNC">Fortune 500 MNC</option>
                <option value="DOMESTIC_CORPORATE">Blue-Chip Corporate</option>
                <option value="HIGH_STREET_RETAIL">Anchor Retail Brand</option>
                <option value="GOVERNMENT">PSU / Government Entity</option>
                <option value="INDIVIDUAL">High Net Worth Individual</option>
                <option value="SME">Established SME</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Tenant Industry</label>
              <input
                type="text"
                placeholder="e.g. BFSI / SaaS / Healthcare / FMCG"
                value={formData.preLeasedData?.tenantIndustry ?? 'Banking & Financial Services (BFSI)'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: { ...prev.preLeasedData!, tenantIndustry: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* TWO CLEAR COLUMNS: EXISTING VERIFIED INCOME vs PROJECTED / ESTIMATED INCOME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* COLUMN 1: EXISTING VERIFIED INCOME (Audited / Executed) */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Existing Verified Income
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Documented Payouts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Monthly Rent (INR) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.preLeasedData?.monthlyRentINR ?? 850000}
                    onChange={(e) => {
                      const rent = parseFloat(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        preLeasedData: {
                          ...prev.preLeasedData!,
                          monthlyRentINR: rent,
                          annualRentINR: rent * 12,
                        },
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono font-bold"
                  />
                  <span className="text-[10px] text-emerald-400/90 font-mono">
                    ₹{((formData.preLeasedData?.monthlyRentINR ?? 850000) / 100000).toFixed(2)} Lakhs/mo
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Annual Rent (INR)
                  </label>
                  <input
                    type="number"
                    value={(formData.preLeasedData?.monthlyRentINR ?? 850000) * 12}
                    disabled
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white font-mono font-bold opacity-80"
                  />
                  <span className="text-[10px] text-emerald-400/90 font-mono">
                    {formatINRDisplay((formData.preLeasedData?.monthlyRentINR ?? 850000) * 12)} / year
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Current Verified Yield (% ROI)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.preLeasedData?.currentGrossYieldPercent ?? 7.8}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preLeasedData: {
                            ...prev.preLeasedData!,
                            currentGrossYieldPercent: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-emerald-300 font-mono font-bold"
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono text-emerald-400">% p.a.</span>
                  </div>
                  <span className="text-[10px] text-white/50">Computed on actual in-place agreement</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Rent Payment History
                  </label>
                  <select
                    value={formData.preLeasedData?.rentPaymentHistoryTrackRecord ?? 'FLAWLESS_ON_TIME'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preLeasedData: {
                          ...prev.preLeasedData!,
                          rentPaymentHistoryTrackRecord: e.target.value as any,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="FLAWLESS_ON_TIME">Flawless (On-Time Every Month)</option>
                    <option value="OCCASIONAL_DELAY">Occasional Delay (Grace Period)</option>
                    <option value="NEW_TENANT">New Tenant (Under 6 Months)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Escalation Clause
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15% every 3 years / 5% annually"
                    value={formData.preLeasedData?.escalationClauseText ?? '15% escalation every 3 years'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preLeasedData: {
                          ...prev.preLeasedData!,
                          escalationClauseText: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Occupancy Status
                  </label>
                  <select
                    value={formData.preLeasedData?.occupancyStatus ?? 'FULLY_OCCUPIED'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preLeasedData: {
                          ...prev.preLeasedData!,
                          occupancyStatus: e.target.value as any,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="FULLY_OCCUPIED">100% Fully Occupied</option>
                    <option value="PARTIALLY_OCCUPIED">Partially Occupied</option>
                    <option value="VACANT">Vacant / Fit-Out Stage</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Lease Registration Status
                </label>
                <select
                  value={formData.preLeasedData?.leaseRegistrationStatus ?? 'REGISTERED'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preLeasedData: {
                        ...prev.preLeasedData!,
                        leaseRegistrationStatus: e.target.value as any,
                        leaseRegistered: e.target.value === 'REGISTERED',
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="REGISTERED">Registered with Sub-Registrar</option>
                  <option value="IN_PROCESS">Registration In Process</option>
                  <option value="UNREGISTERED">Notarized / Unregistered</option>
                </select>
              </div>
            </div>

            {/* COLUMN 2: PROJECTED / ESTIMATED INCOME (Illustrative Estimates - NOT Guaranteed) */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Projected / Estimated Returns
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  Estimated • NOT Guaranteed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Expected Yield (% ROI - Estimated)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.preLeasedData?.expectedYieldPercent ?? 8.5}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preLeasedData: {
                            ...prev.preLeasedData!,
                            expectedYieldPercent: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-xs text-amber-300 font-mono font-bold"
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono text-amber-400">% p.a.</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">Projected yield upon escalation / reversion</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Capital Appreciation Potential
                  </label>
                  <select
                    value={formData.preLeasedData?.capitalAppreciationPotential ?? 'HIGH'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preLeasedData: {
                          ...prev.preLeasedData!,
                          capitalAppreciationPotential: e.target.value as any,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="HIGH">High (Expanding Micro-Market)</option>
                    <option value="MODERATE">Moderate / Steady Growth</option>
                    <option value="STABLE">Stable / Mature Yield Core</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Tenant Credit Profile
                  </label>
                  <select
                    value={formData.preLeasedData?.tenantCreditProfile ?? 'AAA_INVESTMENT_GRADE'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preLeasedData: {
                          ...prev.preLeasedData!,
                          tenantCreditProfile: e.target.value as any,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="AAA_INVESTMENT_GRADE">AAA - Sovereign / Top Tier MNC</option>
                    <option value="AA_BLUE_CHIP">AA - Blue-Chip Public Corporate</option>
                    <option value="A_ESTABLISHED">A - Established National Entity</option>
                    <option value="SME_UNRATED">SME / Private Entity (Unrated)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90 block">
                    Lease Renewal Probability
                  </label>
                  <select
                    value={formData.preLeasedData?.renewalProbability ?? 'HIGH'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preLeasedData: {
                          ...prev.preLeasedData!,
                          renewalProbability: e.target.value as any,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="HIGH">High (High Capex Fit-Out Invested)</option>
                    <option value="MEDIUM">Medium (Standard Commercial Term)</option>
                    <option value="LOW">Low (Relocation Planned / In Reversion)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block">
                  Total Asset Investment Value (INR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 130000000"
                  value={formData.preLeasedData?.investmentValueINR ?? 130000000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preLeasedData: {
                        ...prev.preLeasedData!,
                        investmentValueINR: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono font-bold"
                />
                <span className="text-[10px] text-amber-400/90 font-mono">
                  {formatINRDisplay(formData.preLeasedData?.investmentValueINR ?? 130000000)}
                </span>
              </div>
            </div>
          </div>

          {/* Lease Terms: Start, Expiry, Remaining Months, Deposit, Lock-in */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Lease Start Date</label>
              <input
                type="date"
                value={formData.preLeasedData?.leaseStartDate ?? '2023-01-01'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: { ...prev.preLeasedData!, leaseStartDate: e.target.value },
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Lease Expiry Date</label>
              <input
                type="date"
                value={formData.preLeasedData?.leaseExpiryDate ?? '2032-12-31'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: { ...prev.preLeasedData!, leaseExpiryDate: e.target.value },
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Remaining Lease Period</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.preLeasedData?.remainingLeasePeriodMonths ?? 72}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preLeasedData: {
                        ...prev.preLeasedData!,
                        remainingLeasePeriodMonths: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                />
                <span className="absolute right-2 top-1.5 text-[10px] opacity-60">Months</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Security Deposit (INR)</label>
              <input
                type="number"
                value={formData.preLeasedData?.securityDepositINR ?? 5100000}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preLeasedData: {
                      ...prev.preLeasedData!,
                      securityDepositINR: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-white/50">
                ₹{((formData.preLeasedData?.securityDepositINR ?? 5100000) / 100000).toFixed(1)}L
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 block">Lock-in Period</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.preLeasedData?.lockInPeriodMonths ?? 36}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preLeasedData: {
                        ...prev.preLeasedData!,
                        lockInPeriodMonths: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-amber-400 font-mono font-bold"
                />
                <span className="absolute right-2 top-1.5 text-[10px] opacity-60">Months</span>
              </div>
            </div>
          </div>

          {/* Lease Documents Available Checklist */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Verified Lease Documents Available for Investor Due Diligence</span>
              </label>
              <span className="text-[10px] text-white/60">Investor Data Room Verification</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'agreement', label: 'Registered Lease Agreement' },
                { id: 'camBill', label: 'CAM Maintenance Agreement' },
                { id: 'rentReceipts', label: 'Last 12-Month Rent Receipts' },
                { id: 'bankStatement', label: 'Bank Rent Credit Statements' },
              ].map((doc) => {
                const currentDocs = formData.preLeasedData?.availableDocuments || {
                  agreement: true,
                  camBill: true,
                  rentReceipts: true,
                  bankStatement: true,
                };
                const isChecked = (currentDocs as any)[doc.id] ?? true;
                return (
                  <label
                    key={doc.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = {
                          ...currentDocs,
                          [doc.id]: e.target.checked,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          preLeasedData: {
                            ...prev.preLeasedData!,
                            availableDocuments: updated,
                            leaseDocumentsAvailable: Object.values(updated).some(Boolean),
                          },
                        }));
                      }}
                      className="rounded border-emerald-500 text-emerald-500 focus:ring-0"
                    />
                    <span className="truncate">{doc.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= AUCTION / DISTRESS SALE SPECIFIC FIELDS ================= */}
      {isAuctionModel && (
        <div className="space-y-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span>Bank Auction / Distress Sale Mandatory Disclosure</span>
            <span>SARFAESI Act Compliant</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Reserve Price (INR)</label>
              <input
                type="number"
                placeholder="e.g. 1,80,00,000"
                defaultValue={formData.auctionData?.reservePriceINR ?? 18000000}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Earnest Money Deposit (EMD)</label>
              <input
                type="number"
                placeholder="e.g. 18,00,000"
                defaultValue={formData.auctionData?.earnestMoneyDepositINR ?? 1800000}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Authorized Bank / ARC</label>
              <input
                type="text"
                placeholder="e.g. State Bank of India / Asset Reconstruction Co."
                defaultValue={formData.auctionData?.authorizedBankName ?? 'State Bank of India (SAMB)'}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= JOINT VENTURE / DEVELOPMENT SPECIFIC FIELDS ================= */}
      {isJvModel && (
        <div className="space-y-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Joint Venture / Development Opportunity Parameters</span>
            <span>Developer Qualification Required</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Land Parcel Size</label>
              <input
                type="text"
                placeholder="e.g. 4.5 Acres"
                defaultValue="4.5 Acres"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Proposed Revenue / Area Share %</label>
              <input
                type="text"
                placeholder="e.g. 55% Owner : 45% Developer"
                defaultValue="55% : 45%"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">Expected Gross Development Value (GDV)</label>
              <input
                type="text"
                placeholder="e.g. ₹ 250 Crores"
                defaultValue="₹ 180 Crores"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= COWORKING OR PG / HOSTEL SPECIFIC FIELDS ================= */}
      {(isCoworkingModel || isPgHostelModel) && (
        <div className="space-y-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span>Managed Living / Flexible Work Terms</span>
            <span>All-Inclusive Operational Model</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-white/80 block mb-1">Per Seat / Bed Monthly (INR)</label>
              <input
                type="number"
                placeholder="e.g. 9500"
                defaultValue="11500"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-white/80 block mb-1">Security Deposit</label>
              <input
                type="number"
                placeholder="e.g. 20000"
                defaultValue="25000"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-white/80 block mb-1">Included Amenities</label>
              <input
                type="text"
                placeholder="e.g. Wi-Fi, Food, Housekeeping, Power"
                defaultValue="High-Speed Wi-Fi, Housekeeping, AC, Meals"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
