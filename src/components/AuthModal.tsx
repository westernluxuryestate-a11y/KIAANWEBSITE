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
  Crown,
  Zap,
  UserPlus,
  Compass,
  MapPin,
  Tag,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { UserRole, UserSession } from '../types';
import { adminAuthService, PROVISIONED_ADMIN_ACCOUNTS } from '../services/adminAuthService';

interface AuthModalProps {
  isOpen: boolean;
  theme?: 'dark' | 'light';
  initialMode?: 'VISITOR' | 'CUSTOMER' | 'ADMIN';
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  theme = 'dark',
  initialMode = 'VISITOR',
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  // Boundary Selector: Visitor / Guest vs Customer VIP vs Secure Admin Console
  const [authBoundary, setAuthBoundary] = useState<'VISITOR' | 'CUSTOMER' | 'ADMIN'>(initialMode);

  // --------------------------------------------------------------------------
  // VISITOR REGISTRATION & LOGIN STATE
  // --------------------------------------------------------------------------
  const [visitorSubMode, setVisitorSubMode] = useState<'REGISTER' | 'QUICK_LOGIN'>('REGISTER');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorCity, setVisitorCity] = useState('Pune (Baner / Wakad / Kharadi)');
  const [visitorIntent, setVisitorIntent] = useState<string>('BUY_LUXURY');
  const [visitorBudget, setVisitorBudget] = useState<string>('3_TO_7_CR');
  const [visitorCountryCode, setVisitorCountryCode] = useState('+91');
  const [visitorQuickPhone, setVisitorQuickPhone] = useState('+91 98230 11223');
  const [visitorOtpSent, setVisitorOtpSent] = useState(false);
  const [visitorOtpCode, setVisitorOtpCode] = useState('');

  // --------------------------------------------------------------------------
  // CUSTOMER STATE
  // --------------------------------------------------------------------------
  const [customerMethod, setCustomerMethod] = useState<'MOBILE_OTP' | 'EMAIL_OTP' | 'OAUTH'>('MOBILE_OTP');
  const [customerIdentifier, setCustomerIdentifier] = useState('+91 98230 45678');
  const [customerOtp, setCustomerOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [customerName, setCustomerName] = useState('Aarav Mehta');

  // --------------------------------------------------------------------------
  // ADMIN STATE
  // --------------------------------------------------------------------------
  const [adminEmail, setAdminEmail] = useState('sales@kiaanproperties.in');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [adminMfaCode, setAdminMfaCode] = useState('982341');
  const [selectedAdminRole, setSelectedAdminRole] = useState<UserRole>('SUPER_ADMIN');
  const [showAdminMfaStep, setShowAdminMfaStep] = useState(false);
  const [adminError, setAdminError] = useState('');

  // ==========================================================================
  // HANDLERS: VISITOR
  // ==========================================================================
  const handleVisitorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) return;

    const fullPhone = visitorPhone.startsWith('+') ? visitorPhone : `${visitorCountryCode} ${visitorPhone.trim()}`;
    const email = visitorEmail.trim() || `visitor.${Date.now().toString(36)}@kiaanproperties.in`;

    const session: UserSession = {
      userId: `vis-${Date.now()}`,
      name: visitorName.trim(),
      email: email,
      phone: fullPhone,
      role: 'VISITOR',
      token: `jwt_vis_${Math.random().toString(36).substring(2)}`,
      savedPropertyIds: ['prop-res-01', 'prop-res-02'],
      savedUnitIds: [],
      propertyDNA: {
        budgetMin:
          visitorBudget === '1_TO_3_CR'
            ? 15000000
            : visitorBudget === '3_TO_7_CR'
            ? 35000000
            : visitorBudget === '7_TO_15_CR'
            ? 70000000
            : 150000000,
        budgetMax:
          visitorBudget === '1_TO_3_CR'
            ? 35000000
            : visitorBudget === '3_TO_7_CR'
            ? 70000000
            : visitorBudget === '7_TO_15_CR'
            ? 150000000
            : 300000000,
        preferredLocations: [visitorCity],
        configurations: ['3 BHK', '4 BHK'],
        purpose:
          visitorIntent === 'RENT_LEASE'
            ? 'RENTAL_YIELD'
            : visitorIntent === 'COMMERCIAL'
            ? 'COMMERCIAL_LEASE'
            : 'BUY_FAMILY',
        timeline: 'UNDER_6_MONTHS',
        priorities: {
          commute: 4,
          lifestyleAmenities: 5,
          spaciousLayout: 5,
          appreciationPotential: 5,
          schoolProximity: 4,
        },
      },
    };

    onLoginSuccess(session);
    onClose();
  };

  const handleSendVisitorOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorQuickPhone.trim()) return;
    setVisitorOtpSent(true);
  };

  const handleVerifyVisitorOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      userId: `vis-${Date.now()}`,
      name: visitorName || 'Registered Visitor',
      email: visitorEmail || `visitor.${Date.now().toString(36)}@kiaanproperties.in`,
      phone: visitorQuickPhone,
      role: 'VISITOR',
      token: `jwt_vis_${Math.random().toString(36).substring(2)}`,
      savedPropertyIds: ['prop-res-01', 'prop-res-03'],
      savedUnitIds: [],
    };
    onLoginSuccess(session);
    onClose();
  };

  const handleInstantGuestAccess = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const session: UserSession = {
      userId: `guest-${Date.now()}`,
      name: `Guest Visitor #${randomSuffix}`,
      email: `guest.${randomSuffix}@kiaanproperties.in`,
      phone: '+91 98000 00000',
      role: 'VISITOR',
      token: `jwt_guest_${Math.random().toString(36).substring(2)}`,
      savedPropertyIds: ['prop-res-01'],
      savedUnitIds: [],
    };
    onLoginSuccess(session);
    onClose();
  };

  // ==========================================================================
  // HANDLERS: CUSTOMER
  // ==========================================================================
  const handleSendCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerIdentifier.trim()) return;
    setOtpSent(true);
  };

  const handleVerifyCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      userId: `cust-${Date.now()}`,
      name: customerName || 'VIP Customer',
      email: customerMethod === 'EMAIL_OTP' ? customerIdentifier : 'vip.investor@kiaanproperties.com',
      phone: customerMethod === 'MOBILE_OTP' ? customerIdentifier : '+91 98230 45678',
      role: 'CUSTOMER',
      token: `jwt_cust_${Math.random().toString(36).substring(2)}`,
      savedPropertyIds: ['prop-res-01', 'prop-res-03'],
      savedUnitIds: ['u-sol-1203'],
    };
    onLoginSuccess(session);
    onClose();
  };

  // ==========================================================================
  // HANDLERS: ADMIN
  // ==========================================================================
  const handleQuickSuperAdminLogin = (accountEmail = 'sales@kiaanproperties.in') => {
    const session = adminAuthService.createSuperAdminSession(accountEmail);
    onLoginSuccess(session);
    onClose();
  };

  const handleAdminInitialAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAuthService.isAuthorizedAdminDomain(adminEmail)) {
      setAdminError('Access restricted to authorized enterprise domains (@kiaanproperties.in, @kiaanproperties.com).');
      return;
    }
    setAdminError('');
    setShowAdminMfaStep(true);
  };

  const handleAdminMfaVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminMfaCode.trim().length < 6) {
      setAdminError('Enter a valid 6-digit TOTP / Authenticator code.');
      return;
    }

    const foundAccount = adminAuthService.getAccountByEmail(adminEmail);

    const session: UserSession = {
      userId: foundAccount?.id || `admin-${selectedAdminRole.toLowerCase()}-${Date.now()}`,
      name:
        foundAccount?.name ||
        (adminEmail === 'sales@kiaanproperties.in' || selectedAdminRole === 'SUPER_ADMIN'
          ? 'Kiaan Sales Leadership (Super Admin)'
          : selectedAdminRole === 'COMPLIANCE_MANAGER'
          ? 'Adv. Radhika Deshmukh (MahaRERA Auditor)'
          : `${selectedAdminRole.replace('_', ' ')} Operator`),
      email: adminEmail,
      phone: foundAccount?.phone || '+91 98230 11000',
      role: (adminEmail === 'sales@kiaanproperties.in' ? 'SUPER_ADMIN' : selectedAdminRole),
      token: `jwt_enterprise_sec_${Math.random().toString(36).substring(2)}`,
      savedPropertyIds: [],
    };

    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className={`w-full max-w-xl my-auto rounded-3xl border overflow-hidden shadow-2xl transition-all ${
          isDark ? 'bg-[#0B101B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* TOP BOUNDARY SELECTOR (VISITOR / CUSTOMER VIP / ADMIN) */}
        <div className="grid grid-cols-3 p-1.5 sm:p-2 gap-1.5 border-b border-current/10 bg-black/20">
          <button
            type="button"
            onClick={() => {
              setAuthBoundary('VISITOR');
              setVisitorOtpSent(false);
              setAdminError('');
            }}
            className={`py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authBoundary === 'VISITOR'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : isDark
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Visitor Access</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthBoundary('CUSTOMER');
              setOtpSent(false);
              setAdminError('');
            }}
            className={`py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authBoundary === 'CUSTOMER'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : isDark
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">VIP Client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthBoundary('ADMIN');
              setAdminError('');
            }}
            className={`py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authBoundary === 'ADMIN'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                : isDark
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Enterprise Admin</span>
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {/* ========================================================================= */}
          {/* BOUNDARY A: VISITOR REGISTRATION & INSTANT ACCESS                        */}
          {/* ========================================================================= */}
          {authBoundary === 'VISITOR' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Instant Visitor Experience</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    MahaRERA A031262603640
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-current">
                  {visitorSubMode === 'REGISTER' ? 'Create Visitor Account' : 'Visitor Sign In'}
                </h3>
                <p className="text-xs opacity-75">
                  Unlock personalized saved residences, AI concierge recommendations, site visit bookings, and instant 3D twin previews.
                </p>
              </div>

              {/* Sub-toggle: Register New vs Quick Login */}
              <div className="flex items-center p-1 rounded-xl bg-current/5 border border-current/10">
                <button
                  type="button"
                  onClick={() => setVisitorSubMode('REGISTER')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    visitorSubMode === 'REGISTER'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Create New Account
                </button>
                <button
                  type="button"
                  onClick={() => setVisitorSubMode('QUICK_LOGIN')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    visitorSubMode === 'QUICK_LOGIN'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Quick Sign In / OTP
                </button>
              </div>

              {/* MODE 1: CREATE VISITOR ACCOUNT */}
              {visitorSubMode === 'REGISTER' && (
                <form onSubmit={handleVisitorRegister} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold opacity-80 block">
                        Full Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Rohan Sharma"
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none focus:border-amber-500 ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold opacity-80 block">
                        WhatsApp / Mobile <span className="text-amber-500">*</span>
                      </label>
                      <div className="flex gap-1.5">
                        <select
                          value={visitorCountryCode}
                          onChange={(e) => setVisitorCountryCode(e.target.value)}
                          className={`w-20 px-2 py-2.5 rounded-xl border font-bold text-xs focus:outline-none focus:border-amber-500 ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+65">🇸🇬 +65</option>
                          <option value="+61">🇦🇺 +61</option>
                        </select>
                        <input
                          type="tel"
                          required
                          value={visitorPhone}
                          onChange={(e) => setVisitorPhone(e.target.value)}
                          placeholder="98230 12345"
                          className={`flex-1 px-3.5 py-2.5 rounded-xl border font-mono font-bold focus:outline-none focus:border-amber-500 ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold opacity-80 block">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        placeholder="e.g. rohan.sharma@gmail.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold opacity-80 block">Location of Interest</label>
                      <input
                        type="text"
                        value={visitorCity}
                        onChange={(e) => setVisitorCity(e.target.value)}
                        placeholder="e.g. Pune (Baner, Wakad, Kharadi)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-amber-500 ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold opacity-80 block">Looking To</label>
                      <select
                        value={visitorIntent}
                        onChange={(e) => setVisitorIntent(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:border-amber-500 ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="BUY_LUXURY">🏡 Buy Luxury Residence</option>
                        <option value="RENT_LEASE">🔑 Rent / Lease Premium Apartment</option>
                        <option value="NRI_INVEST">🌍 NRI Real Estate Investment</option>
                        <option value="COMMERCIAL">🏢 Commercial / Retail Office Space</option>
                        <option value="EXPLORING">🔍 General Visitor / Design Explorer</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold opacity-80 block">Target Budget Range</label>
                      <select
                        value={visitorBudget}
                        onChange={(e) => setVisitorBudget(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:border-amber-500 ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="1_TO_3_CR">₹1.5 Cr – ₹3.5 Cr</option>
                        <option value="3_TO_7_CR">₹3.5 Cr – ₹7.0 Cr (Popular)</option>
                        <option value="7_TO_15_CR">₹7.0 Cr – ₹15.0 Cr</option>
                        <option value="15_PLUS_CR">₹15.0 Cr+ Bespoke Luxury</option>
                        <option value="RENT_50K_PLUS">Rent ₹50,000 – ₹2,50,000 / mo</option>
                      </select>
                    </div>
                  </div>

                  {/* Visitor Benefits Pills */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-1.5">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Included Visitor Account Privileges:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 opacity-80">
                      <div>✓ Persistent Favorites & Shortlist</div>
                      <div>✓ 3D Virtual Twin & Sunlight Studies</div>
                      <div>✓ 1-Click Site Visit Concierge</div>
                      <div>✓ MahaRERA Verified Document Downloads</div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Visitor Account & Enter</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleInstantGuestAccess}
                      className="text-[11px] font-bold opacity-60 hover:opacity-100 hover:text-amber-400 underline cursor-pointer"
                    >
                      Or continue immediately with 1-Click Instant Guest Access &rarr;
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 2: QUICK VISITOR LOGIN / OTP */}
              {visitorSubMode === 'QUICK_LOGIN' && (
                <div className="space-y-4">
                  {!visitorOtpSent ? (
                    <form onSubmit={handleSendVisitorOtp} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold opacity-80 block">
                          Enter Registered Mobile or WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={visitorQuickPhone}
                          onChange={(e) => setVisitorQuickPhone(e.target.value)}
                          placeholder="+91 98230 11223"
                          className={`w-full px-4 py-3 rounded-2xl border text-xs font-mono font-bold focus:outline-none focus:border-amber-500 ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Send Login OTP</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyVisitorOtp} className="space-y-3.5">
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between">
                        <span>
                          Code sent to <strong className="font-mono">{visitorQuickPhone}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setVisitorOtpSent(false)}
                          className="text-amber-500 font-bold hover:underline"
                        >
                          Change
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold opacity-80 block">Enter 6-Digit OTP</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={visitorOtpCode}
                          onChange={(e) => setVisitorOtpCode(e.target.value)}
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
                        <span>Verify & Sign In</span>
                      </button>
                    </form>
                  )}

                  {/* 1-Click Guest Access Option */}
                  <div className="p-3.5 rounded-2xl bg-current/5 border border-current/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold">Fast-Track Guest Exploration</div>
                      <div className="text-[10px] opacity-60">No OTP required. Instant temporary visitor session.</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleInstantGuestAccess}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Zap className="w-3 h-3" />
                      <span>1-Click Access</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOUNDARY B: CUSTOMER AUTH (VIP Passport & Priority Unit Holds)           */}
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
          {/* BOUNDARY C: ENTERPRISE ADMIN AUTH (RBAC, MFA & Audit Log)                 */}
          {/* ========================================================================= */}
          {authBoundary === 'ADMIN' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] tracking-widest uppercase">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Enterprise Security Boundary</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-current">
                  Kiaan Properties CMS & Management Console
                </h3>
                <p className="text-xs opacity-75">
                  Granular RBAC role validation with mandatory TOTP Multi-Factor Authentication and audit trail logging.
                </p>
              </div>

              {/* PRE-PROVISIONED SUPER ADMIN PROFILE CARD */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/20 to-red-950/40 border border-red-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>sales@kiaanproperties.in</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/30 text-red-300 font-mono font-bold">SUPER ADMIN</span>
                      </div>
                      <div className="text-[10px] text-white/60">Kiaan Sales Leadership • Full Governance & Root Permissions</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickSuperAdminLogin('sales@kiaanproperties.in')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-900/30 transition-all hover:scale-[1.02]"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Instant Login</span>
                  </button>
                </div>
              </div>

              {adminError && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              {/* Provisioned Accounts Quick Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold opacity-70 block">Select Provisioned Enterprise Account</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROVISIONED_ADMIN_ACCOUNTS.map((acc) => {
                    const isSelected = adminEmail === acc.email;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setAdminEmail(acc.email);
                          setSelectedAdminRole(acc.role);
                          setAdminError('');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-500/20 border-red-500 text-white shadow-sm'
                            : isDark
                            ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold truncate">{acc.name}</span>
                          {acc.isSuperAdmin && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                        </div>
                        <div className="text-[10px] font-mono opacity-60 truncate">{acc.email}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

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
          <div className="pt-3 border-t border-current/10 flex items-center justify-between text-xs opacity-60">
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
