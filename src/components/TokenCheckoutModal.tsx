/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Building2,
  Layers,
  ArrowRight,
  Download,
  FileCheck,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { Unit, Project, Property } from '../types';
import { formatINR } from '../services/calculatorEngine';
import { globalKiaanStore } from '../services/store';

interface TokenCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: Unit | null;
  project?: Project | null;
  property?: Property | null;
  onPaymentSuccess?: (receipt: {
    transactionId: string;
    unitNumber: string;
    tokenAmount: number;
    lockExpiresAt: string;
  }) => void;
  theme?: 'dark' | 'light';
}

export const TokenCheckoutModal: React.FC<TokenCheckoutModalProps> = ({
  isOpen,
  onClose,
  unit,
  project,
  property,
  onPaymentSuccess,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // 15-Minute Countdown Timer (900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING' | 'CARD'>('UPI');
  const [upiId, setUpiId] = useState('buyer@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    id: string;
    timestamp: string;
    amount: number;
    expiresAt: string;
  } | null>(null);

  // Buyer inputs
  const [buyerName, setBuyerName] = useState('Rajesh Sharma');
  const [buyerPhone, setBuyerPhone] = useState('+91 98230 11000');
  const [buyerEmail, setBuyerEmail] = useState('rajesh.sharma@example.com');
  const [ackRera, setAckRera] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(900);
    setIsProcessing(false);
    setIsSuccess(false);
    setTransactionDetails(null);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const tokenAmount = 50000;
  const unitNumber = unit?.unitNumber || property?.title || 'Sky Suite 1802';
  const projectName = project?.name || property?.projectName || 'The Balmoral Riverside';
  const towerName = unit?.towerName || 'Tower A';
  const carpetArea = unit?.carpetAreaSqFt || property?.carpetAreaSqFt || 1850;
  const ceilingHeight = unit?.ceilingHeightFt || project?.ceilingHeightFt || 11.5;
  const floorNumber = unit?.floorNumber || property?.floorNumber || 18;
  const totalFloors = unit?.totalFloors || project?.totalFloors || property?.totalFloors || 32;
  const reraNumber = project?.reraRecord?.registrationNumber || property?.reraRecord?.registrationNumber || 'P52100028816';
  const totalPrice = unit?.pricing?.totalEstimatedAcquisitionCost || property?.pricing?.agreementValue || 34500000;

  const handleExecutePayment = async () => {
    if (!ackRera) {
      alert('Please acknowledge statutory MahaRERA terms before proceeding.');
      return;
    }

    setIsProcessing(true);

    try {
      // Direct store integration to lock the unit
      const lockRes = globalKiaanStore.holdUnit({
        unitId: unit?.id || `unit_${Date.now()}`,
        userId: 'vip_buyer_escrow',
        userName: buyerName,
        tokenAmountPaid: tokenAmount,
        durationMinutes: 15,
      });

      // Artificial realistic gateway confirmation
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const txId = `TXN_ESCRW_${Math.floor(100000 + Math.random() * 900000)}`;
      const expireTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const details = {
        id: txId,
        timestamp: new Date().toLocaleTimeString(),
        amount: tokenAmount,
        expiresAt: expireTime,
      };

      setTransactionDetails(details);
      setIsSuccess(true);

      if (onPaymentSuccess) {
        onPaymentSuccess({
          transactionId: txId,
          unitNumber,
          tokenAmount,
          lockExpiresAt: expireTime,
        });
      }
    } catch (e: any) {
      alert(e.message || 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-2xl max-h-[94vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden my-auto ${
          isDark ? 'bg-[#0B101C] text-white border-white/15' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header with Live 15:00 Countdown */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between ${
          isDark ? 'bg-[#080D17] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-current">
                  15-Minute Priority Exclusivity Lock
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  ATOMIC CONCURRENCY
                </span>
              </div>
              <p className="text-xs opacity-70">
                Official Ring-Fenced Escrow Checkout • MahaRERA Reg: {reraNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>{formattedTime}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-current/15 hover:bg-current/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {isSuccess && transactionDetails ? (
            /* SUCCESS CONFIRMATION RECEIPT */
            <div className="space-y-6 animate-fade-in text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-emerald-400">
                  Unit Exclusively Locked!
                </h3>
                <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto">
                  ₹50,000 token escrow deposit confirmed. Unit <strong>{unitNumber}</strong> is locked exclusively for you until <strong>{transactionDetails.expiresAt}</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className={`p-5 rounded-2xl border text-left space-y-3 max-w-lg mx-auto ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs border-b border-current/10 pb-2">
                  <span className="opacity-60">Escrow Transaction ID:</span>
                  <span className="font-mono font-bold text-amber-500">{transactionDetails.id}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-current/10 pb-2">
                  <span className="opacity-60">Reserved Asset:</span>
                  <span className="font-bold">{projectName} • {unitNumber} ({towerName})</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-current/10 pb-2">
                  <span className="opacity-60">Carpet Area & Ceiling:</span>
                  <span className="font-mono">{carpetArea} sq.ft • {ceilingHeight} Ft Clear Height</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-current/10 pb-2">
                  <span className="opacity-60">Floor Level:</span>
                  <span className="font-mono font-bold">Floor {floorNumber} of {totalFloors} Total Floors</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="opacity-60">Refundable Token Paid:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{formatINR(transactionDetails.amount)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    alert(`Statutory Allotment Lock Certificate for ${unitNumber} downloaded!`);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Escrow Allotment Slip</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-bold cursor-pointer"
                >
                  Return to Project Experience
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT STEP FORM */
            <>
              {/* Unit Specifications Summary Box */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDark ? 'bg-[#080E1A] border-amber-500/20' : 'bg-amber-50/50 border-amber-200 shadow-sm'
              }`}>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                    Selected Luxury Residence
                  </span>
                  <h3 className="text-base font-serif font-bold text-current">
                    {projectName} — {unitNumber}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs opacity-75 font-mono">
                    <span>{towerName}</span>
                    <span>•</span>
                    <span>Carpet: <strong>{carpetArea} sq.ft</strong></span>
                    <span>•</span>
                    <span>Ceiling: <strong>{ceilingHeight} Ft</strong></span>
                    <span>•</span>
                    <span>Floor <strong>{floorNumber} of {totalFloors} Floors</strong></span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold opacity-60 block">Agreement Value</span>
                  <div className="text-lg font-serif font-bold text-amber-500 font-mono">
                    {formatINR(totalPrice)}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold block">
                    Priority Lock Fee: ₹50,000
                  </span>
                </div>
              </div>

              {/* Buyer Contact Information */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                  1. Buyer Verification Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] opacity-60 block mb-1">Full Legal Name</span>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-300'
                      }`}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] opacity-60 block mb-1">WhatsApp / Phone</span>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-300'
                      }`}
                      placeholder="+91 98000 00000"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] opacity-60 block mb-1">Email Address</span>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-300'
                      }`}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                  2. Select Escrow Payment Method (₹50,000 Token)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : isDark
                        ? 'border-white/10 hover:bg-white/5'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : isDark
                        ? 'border-white/10 hover:bg-white/5'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : isDark
                        ? 'border-white/10 hover:bg-white/5'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card / Amex</span>
                  </button>
                </div>

                {/* Sub-inputs based on payment method */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="opacity-70">Enter VPA / UPI ID:</span>
                        <span className="text-[10px] text-emerald-400 font-mono">GPay / PhonePe / BHIM</span>
                      </div>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                          isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                        placeholder="yourname@okhdfcbank"
                      />
                    </div>
                  )}

                  {paymentMethod === 'NETBANKING' && (
                    <div className="space-y-2">
                      <span className="text-xs opacity-70 block">Select Escrow Authorized Bank:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {['HDFC Bank', 'ICICI Bank', 'SBI', 'Kotak Mahindra'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBank(b)}
                            className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] cursor-pointer ${
                              selectedBank === b
                                ? 'bg-amber-500 text-black border-amber-500'
                                : isDark
                                ? 'border-white/10 bg-black/40'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="space-y-2">
                      <span className="text-xs opacity-70 block">Card Details (Tokenized Escrow):</span>
                      <input
                        type="text"
                        defaultValue="4111 •••• •••• 8492"
                        className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                          isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Statutory Notice & Refund policy */}
              <div className="space-y-2.5">
                <label className="flex items-start gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ackRera}
                    onChange={(e) => setAckRera(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="opacity-80">
                    I acknowledge that this ₹50,000 deposit locks <strong>Unit {unitNumber}</strong> exclusively for 15 minutes in MahaRERA Project <strong>{reraNumber}</strong>, protected under ICICI Escrow norms.
                  </span>
                </label>

                <p className="text-[11px] opacity-60 leading-relaxed">
                  *Statutory Escrow Policy: If unconfirmed within 15 minutes, the concurrency hold expires automatically without penalty.
                </p>
              </div>

              {/* Payment CTA Button */}
              <button
                onClick={handleExecutePayment}
                disabled={isProcessing || timeLeft <= 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Authorizing Escrow Lock ({formattedTime})...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹50,000 & Confirm 15-Min Priority Lock</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
