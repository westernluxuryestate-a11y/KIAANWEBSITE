/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  FileSignature,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatINR } from '../services/calculatorEngine';
import { crmEngine } from '../services/crmIntegrationEngine';

interface MakeOfferModalProps {
  assetId: string;
  assetTitle: string;
  askingPrice: number;
  unitNumber?: string;
  theme?: 'dark' | 'light';
  onClose: () => void;
  onOfferSubmitted?: (offerData: any) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  assetId,
  assetTitle,
  askingPrice,
  unitNumber,
  theme = 'dark',
  onClose,
  onOfferSubmitted,
}) => {
  const isDark = theme === 'dark';

  const [offeredAmount, setOfferedAmount] = useState(Math.round(askingPrice * 0.95)); // default 5% negotiation anchor
  const [downpaymentTimeline, setDownpaymentTimeline] = useState('14_DAYS');
  const [fundingSource, setFundingSource] = useState<'SELF_FUNDED' | 'HOME_LOAN_PRE_APPROVED' | 'HOME_LOAN_PENDING'>('HOME_LOAN_PRE_APPROVED');
  const [customConditions, setCustomConditions] = useState([
    'Subject to clear 30-Year Title Search Verification',
    'Standard 10% Down Payment within 14 calendar days',
    'Inclusive of 2 Covered Podium Car Parking Slots',
  ]);
  const [newConditionInput, setNewConditionInput] = useState('');
  const [customerName, setCustomerName] = useState('Rajesh Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98230 45678');
  const [customerEmail, setCustomerEmail] = useState('rajesh.sharma@example.com');
  const [notes, setNotes] = useState('Ready for immediate token payment upon offer acceptance.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const priceDelta = offeredAmount - askingPrice;
  const deltaPercent = ((priceDelta / askingPrice) * 100).toFixed(1);

  const handleAddCondition = () => {
    if (newConditionInput.trim()) {
      setCustomConditions([...customConditions, newConditionInput.trim()]);
      setNewConditionInput('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setCustomConditions(customConditions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'cust_rajesh_sharma',
          userName: customerName,
          userPhone: customerPhone,
          assetId,
          assetTitle,
          unitId: unitNumber ? `${assetId}-${unitNumber}` : assetId,
          askingPrice,
          offeredAmount,
          conditions: [
            ...customConditions,
            `Funding Mode: ${fundingSource}`,
            `Downpayment Timeline: ${downpaymentTimeline}`,
            notes ? `Buyer Note: ${notes}` : '',
          ].filter(Boolean),
          expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || 'Failed to submit offer.');
      } else {
        // Dispatch to CRM Event Layer (Items 123-125)
        crmEngine.dispatchToCrm('OFFER_CREATED', {
          consentGranted: true,
          contactInfo: {
            name: 'Verified Kiaan Client',
            preferredChannel: 'EMAIL',
          },
          entity: {
            entityType: 'PROPERTY',
            entityId: assetId,
            entityTitle: assetTitle,
            priceINR: offeredAmount,
          },
          intentCategory: 'PRICE_OFFER',
          minimalMetadata: {
            askingPrice,
            offeredAmount,
            unitNumber: unitNumber || 'N/A',
            downpaymentTimeline,
          },
        });

        setSubmittedSuccess(true);
        if (onOfferSubmitted) onOfferSubmitted(json.data);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 transition-all my-8 ${
          isDark ? 'bg-[#0B101B] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-current/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <FileSignature className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
                Digital Offer & Direct Negotiation Desk
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Submit Purchase Proposal: {assetTitle} {unitNumber ? `(${unitNumber})` : ''}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-current/10 transition-colors text-current/70 hover:text-current cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="space-y-6 text-center py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-serif font-bold">Offer Successfully Registered!</h4>
              <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                Your formal purchase proposal of <strong className="text-amber-500">{formatINR(offeredAmount)}</strong> has been encrypted, assigned a statutory audit hash, and delivered directly to the Developer & Relationship Partner.
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border max-w-md mx-auto text-left text-xs space-y-2 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between">
                <span className="opacity-60">Status:</span>
                <span className="font-bold text-amber-500">Under Review (48h Exclusivity)</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Assigned Asset:</span>
                <span className="font-medium">{assetTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Offer Validity:</span>
                <span className="font-mono">48 Hours</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer"
            >
              Back to Digital Experience
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Asking Price vs Your Proposal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                  Listed Base Price
                </span>
                <span className="text-xl font-serif font-bold text-current mt-1 block">
                  {formatINR(askingPrice)}
                </span>
                <span className="text-[11px] opacity-60">Official RERA transparent schedule</span>
              </div>

              <div
                className={`p-4 rounded-2xl border border-amber-500/40 ${
                  isDark ? 'bg-amber-500/10' : 'bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
                    Your Proposed Value
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      priceDelta < 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-600'
                    }`}
                  >
                    {priceDelta === 0 ? 'Listed Rate' : `${deltaPercent}% Variance`}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-serif font-bold text-amber-500">₹</span>
                  <input
                    type="number"
                    value={offeredAmount}
                    onChange={(e) => setOfferedAmount(Number(e.target.value))}
                    step={50000}
                    className="w-full bg-transparent text-xl font-serif font-bold text-amber-500 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-amber-600 dark:text-amber-300 block mt-1">
                  {formatINR(offeredAmount)}
                </span>
              </div>
            </div>

            {/* Quick Adjustment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold opacity-70">
                <span>Negotiation Adjustment</span>
                <span>{formatINR(offeredAmount)}</span>
              </div>
              <input
                type="range"
                min={Math.round(askingPrice * 0.85)}
                max={Math.round(askingPrice * 1.05)}
                step={50000}
                value={offeredAmount}
                onChange={(e) => setOfferedAmount(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] opacity-40 font-mono">
                <span>-15% (Aggressive)</span>
                <span>List Price</span>
                <span>+5% (Premium Priority)</span>
              </div>
            </div>

            {/* Terms & Conditions Customizer */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider opacity-70 block">
                Contingency Terms & Payment Preferences
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] opacity-60 block mb-1">Down Payment Execution Timeline</label>
                  <select
                    value={downpaymentTimeline}
                    onChange={(e) => setDownpaymentTimeline(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="7_DAYS">Fast Track (7 Calendar Days)</option>
                    <option value="14_DAYS">Standard (14 Calendar Days)</option>
                    <option value="30_DAYS">Extended (30 Calendar Days)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] opacity-60 block mb-1">Funding Profile</label>
                  <select
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="HOME_LOAN_PRE_APPROVED">Home Loan (Sanction Letter in Hand)</option>
                    <option value="SELF_FUNDED">100% Self Funded / Liquidity Ready</option>
                    <option value="HOME_LOAN_PENDING">Home Loan (Pre-Approval in Progress)</option>
                  </select>
                </div>
              </div>

              {/* Conditions list */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] opacity-60 block">Offer Inclusions:</span>
                <div className="space-y-1.5">
                  {customConditions.map((cond, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{cond}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(idx)}
                        className="text-xs opacity-40 hover:opacity-100 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newConditionInput}
                    onChange={(e) => setNewConditionInput(e.target.value)}
                    placeholder="Add custom condition (e.g. 'Possession by Diwali 2026')..."
                    className={`flex-1 px-3 py-2 rounded-xl text-xs border ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4 border-current/10">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-current/10 flex items-center justify-between gap-4">
              <div className="text-[11px] opacity-60 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Statutory non-binding proposal with 48h locked consideration</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border ${
                    isDark ? 'border-white/10 text-white/70 hover:text-white' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registering Offer...' : `Submit Offer for ${formatINR(offeredAmount)}`}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
