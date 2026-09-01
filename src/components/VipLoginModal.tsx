/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, KeyRound, Smartphone, CheckCircle2, Lock, UserCheck, ArrowRight } from 'lucide-react';

interface VipLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onLoginSuccess?: (user: { name: string; phone: string; tier: string }) => void;
}

export const VipLoginModal: React.FC<VipLoginModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'OTP' | 'PASSKEY'>('OTP');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAuthenticated(true);
      if (onLoginSuccess) {
        onLoginSuccess({
          name: 'VIP Client',
          phone: phone || '+91 98230 44890',
          tier: 'BLACK_PASSPORT',
        });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-[#0B101B] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Banner */}
        <div className="p-6 bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-transparent border-b border-current/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-current">VIP Client Passport</h2>
              <p className="text-[11px] opacity-70">Access Private Holds, Maybach Chauffeur & Escrow Contracts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl opacity-60 hover:opacity-100 hover:bg-current/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {authenticated ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold">Welcome to Kiaan Black Tier</h3>
                <p className="text-xs opacity-70 mt-1">Authenticated via encrypted 256-bit MahaRERA token.</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium">
                ✓ Active 15-Minute Exclusive Unit Holding Enabled
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Continue to Portfolio
              </button>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold opacity-80 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Enter WhatsApp or Mobile Number</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold opacity-60">+91</span>
                  <input
                    required
                    type="tel"
                    placeholder="98230 44890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none font-mono text-sm"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-current/5 border border-current/10 space-y-1 text-[11px] opacity-75">
                <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>Privacy Guaranteed</span>
                </div>
                <p>No spam. No telemarketing. Only verified digital passkey authentication for luxury properties.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 transition-all hover:brightness-105"
              >
                <span>Request Secure OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhone('98220 11980');
                    setOtpSent(true);
                  }}
                  className="text-[11px] text-amber-500 underline opacity-80 hover:opacity-100 cursor-pointer"
                >
                  Quick Demo: Sign in as Verified HNI Buyer
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold opacity-80">Enter 4-Digit Verification Code</label>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[10px] text-amber-500 hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="• • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-current/20 bg-current/5 text-center font-mono text-xl tracking-[0.5em] focus:border-amber-500 focus:outline-none"
                />
                <p className="text-[10px] text-emerald-500 text-center">OTP auto-sent to +91 {phone || '98220 11980'}. (Enter any 4 digits to proceed)</p>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 transition-all hover:brightness-105"
              >
                {isVerifying ? (
                  <span>Verifying MahaRERA Token...</span>
                ) : (
                  <>
                    <span>Unlock VIP Passport</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
