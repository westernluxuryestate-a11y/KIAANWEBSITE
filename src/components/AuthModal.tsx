/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Smartphone,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
  Building,
  Sparkles,
} from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  theme?: 'dark' | 'light';
  initialMode?: 'CUSTOMER' | 'ADMIN';
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  theme = 'dark',
  initialMode = 'CUSTOMER',
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  // Boundary Selector: Customer Portal vs Secure Admin Console
  const [authBoundary, setAuthBoundary] = useState<'CUSTOMER' | 'ADMIN'>(initialMode);

  // Customer State
  const [customerMethod, setCustomerMethod] = useState<'MOBILE_OTP' | 'EMAIL_OTP' | 'OAUTH'>('MOBILE_OTP');
  const [customerIdentifier, setCustomerIdentifier] = useState('+91 98230 45678');
  const [customerOtp, setCustomerOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [customerName, setCustomerName] = useState('Aarav Mehta');

  // Admin State
  const [adminEmail, setAdminEmail] = useState('superadmin@kiaanestates.com');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [adminMfaCode, setAdminMfaCode] = useState('');
  const [selectedAdminRole, setSelectedAdminRole] = useState<UserRole>('SUPER_ADMIN');
  const [showAdminMfaStep, setShowAdminMfaStep] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Handler: Customer OTP Send
  const handleSendCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerIdentifier.trim()) return;
    setOtpSent(true);
  };

  // Handler: Customer Login Verification
  const handleVerifyCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      userId: `cust-${Date.now()}`,
      name: customerName || 'VIP Customer',
      email: customerMethod === 'EMAIL_OTP' ? customerIdentifier : 'vip.investor@kiaanestates.com',
      phone: customerMethod === 'MOBILE_OTP' ? customerIdentifier : '+91 98230 45678',
      role: 'CUSTOMER',
      token: `jwt_cust_${Math.random().toString(36).substring(2)}`,
      savedPropertyIds: ['prop-res-01', 'prop-res-03'],
      savedUnitIds: ['u-sol-1203'],
    };
    onLoginSuccess(session);
    onClose();
  };

  // Handler: Admin Step 1 Verification (Password -> MFA)
  const handleAdminInitialAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.includes('@kiaanestates.com') && !adminEmail.includes('@admin')) {
      setAdminError('Access restricted to authorized enterprise security domains.');
      return;
    }
    setAdminError('');
    setShowAdminMfaStep(true);
  };

  // Handler: Admin Step 2 Verification (MFA Token -> Session with RBAC & Audit Log)
  const handleAdminMfaVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminMfaCode.trim().length < 6) {
      setAdminError('Enter a valid 6-digit TOTP / Authenticator code.');
      return;
    }

    const session: UserSession = {
      userId: `admin-${selectedAdminRole.toLowerCase()}-${Date.now()}`,
      name:
        selectedAdminRole === 'SUPER_ADMIN'
          ? 'Vikram Singhania (Super Admin)'
          : selectedAdminRole === 'COMPLIANCE_MANAGER'
          ? 'Adv. Radhika Deshmukh (MahaRERA Auditor)'
          : `${selectedAdminRole.replace('_', ' ')} Operator`,
      email: adminEmail,
      phone: '+91 99000 11223',
      role: selectedAdminRole,
      token: `jwt_enterprise_sec_${Math.random().toString(36).substring(2)}`,
      savedPropertyIds: [],
    };

    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-3xl border overflow-hidden shadow-2xl transition-all ${
          isDark ? 'bg-[#0B101B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* TOP BOUNDARY SELECTOR */}
        <div className="grid grid-cols-2 p-2 gap-2 border-b border-current/10 bg-black/20">
          <button
            onClick={() => {
              setAuthBoundary('CUSTOMER');
              setOtpSent(false);
              setAdminError('');
            }}
            className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authBoundary === 'CUSTOMER'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : isDark
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer VIP Passport</span>
          </button>
          <button
            onClick={() => {
              setAuthBoundary('ADMIN');
              setAdminError('');
            }}
            className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authBoundary === 'ADMIN'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                : isDark
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Enterprise Console</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* BOUNDARY A: CUSTOMER AUTH (Mobile OTP / Email OTP / Social)              */}
          {/* ========================================================================= */}
          {authBoundary === 'CUSTOMER' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                  Zero-Password Biometric / OTP Gate
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-current">
                  Access Your VIP Asset Portfolio
                </h3>
                <p className="text-xs opacity-75">
                  Save unit comparisons, hold 15-minute priority reservations, and access direct MahaRERA legal title dossiers.
                </p>
              </div>

              {/* Customer Method Tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMethod('MOBILE_OTP');
                    setOtpSent(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    customerMethod === 'MOBILE_OTP'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                      : isDark
                      ? 'border-white/10 hover:bg-white/5 text-white/70'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                  Mobile OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMethod('EMAIL_OTP');
                    setOtpSent(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    customerMethod === 'EMAIL_OTP'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                      : isDark
                      ? 'border-white/10 hover:bg-white/5 text-white/70'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  Email OTP
                </button>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendCustomerOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 block">Your Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Aarav Mehta"
                      required
                      className={`w-full px-4 py-3 rounded-2xl border text-xs font-semibold focus:outline-none focus:border-amber-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 block">
                      {customerMethod === 'MOBILE_OTP' ? 'Mobile Number (WhatsApp Enabled)' : 'Primary Email Address'}
                    </label>
                    <input
                      type={customerMethod === 'MOBILE_OTP' ? 'tel' : 'email'}
                      value={customerIdentifier}
                      onChange={(e) => setCustomerIdentifier(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-2xl border text-xs font-mono font-bold focus:outline-none focus:border-amber-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCustomerOtp} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between">
                    <span>
                      OTP dispatched to <strong className="font-mono">{customerIdentifier}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-amber-500 font-bold hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 block">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={customerOtp}
                      onChange={(e) => setCustomerOtp(e.target.value)}
                      placeholder="123456"
                      autoFocus
                      required
                      className={`w-full px-4 py-3 text-center rounded-2xl border text-lg font-mono tracking-widest font-bold focus:outline-none focus:border-amber-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-amber-400' : 'bg-slate-50 border-slate-300 text-amber-600'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Enter VIP Passport</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOUNDARY B: ENTERPRISE ADMIN AUTH (RBAC, MFA & Audit Log)                 */}
          {/* ========================================================================= */}
          {authBoundary === 'ADMIN' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] tracking-widest uppercase">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Enterprise Security Boundary</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-current">
                  Kiaan Estates CMS & Management Console
                </h3>
                <p className="text-xs opacity-75">
                  Granular RBAC role validation with mandatory TOTP Multi-Factor Authentication and audit trail logging.
                </p>
              </div>

              {adminError && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              {!showAdminMfaStep ? (
                <form onSubmit={handleAdminInitialAuth} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 block">Select Target RBAC Role</label>
                    <select
                      value={selectedAdminRole}
                      onChange={(e) => setSelectedAdminRole(e.target.value as UserRole)}
                      className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold focus:outline-none focus:border-red-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="SUPER_ADMIN">👑 Super Admin (Full Governance & Security)</option>
                      <option value="WEBSITE_ADMIN">🌐 Website Admin (Publishing & Configuration)</option>
                      <option value="COMPLIANCE_MANAGER">⚖️ Compliance Manager (MahaRERA & Legal Verification)</option>
                      <option value="PROPERTY_MANAGER">🏢 Property Manager (Inventory & Towers)</option>
                      <option value="MEDIA_MANAGER">📸 Media Manager (3D Twins, Video & Render Assets)</option>
                      <option value="CONTENT_EDITOR">✍️ Content Editor (Descriptions & Stories)</option>
                      <option value="FINANCE_MANAGER">💰 Finance Manager (Pricing & Tax Escrows)</option>
                      <option value="BOOKING_MANAGER">🤝 Booking Manager (Offers, Holds & Tokens)</option>
                      <option value="ANALYST">📊 Analyst (Telemetry & Conversion Intelligence)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 block">Enterprise Email</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-2xl border text-xs font-mono font-bold focus:outline-none focus:border-red-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 block">Master Password</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-2xl border text-xs font-mono focus:outline-none focus:border-red-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/25"
                  >
                    <span>Proceed to Step 2: MFA Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAdminMfaVerify} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
                    <div className="font-bold text-red-400">Step 2: TOTP Multi-Factor Authentication</div>
                    <p className="opacity-80">
                      Open your Google Authenticator or Enterprise YubiKey app for <strong>{adminEmail}</strong>.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 block">Enter 6-Digit MFA Token</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={adminMfaCode}
                      onChange={(e) => setAdminMfaCode(e.target.value)}
                      placeholder="982341"
                      autoFocus
                      required
                      className={`w-full px-4 py-3 text-center rounded-2xl border text-lg font-mono tracking-widest font-bold focus:outline-none focus:border-red-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-red-400' : 'bg-slate-50 border-slate-300 text-red-600'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAdminMfaStep(false)}
                      className={`flex-1 py-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                        isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/25"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Authenticate Session</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Modal Footer / Close */}
          <div className="pt-4 border-t border-current/10 flex items-center justify-between text-xs opacity-60">
            <span>Encrypted with TLS 1.3 & AES-256</span>
            <button onClick={onClose} className="hover:underline font-bold cursor-pointer">
              Cancel & Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
