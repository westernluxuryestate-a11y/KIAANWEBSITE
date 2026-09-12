/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  User,
  Building2,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  KeyRound,
  Eye,
  Crown,
  FileText,
  Car,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { UserRole, UserSession } from '../../types';
import { PROVISIONED_ADMIN_ACCOUNTS } from '../../services/adminAuthService';

interface AuthPortalViewProps {
  theme?: 'dark' | 'light';
  currentSession: UserSession | null;
  onLoginSuccess: (session: UserSession) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onOpenVipLounge: () => void;
  onOpenAdminCms: () => void;
}

export const AuthPortalView: React.FC<AuthPortalViewProps> = ({
  theme = 'dark',
  currentSession,
  onLoginSuccess,
  onLogout,
  onNavigateHome,
  onOpenVipLounge,
  onOpenAdminCms,
}) => {
  const isDark = theme === 'dark';
  const [activePortalTab, setActivePortalTab] = useState<'VIP_BUYER' | 'VISITOR_PASS' | 'ENTERPRISE'>('VIP_BUYER');

  // VIP Buyer Phone / OTP State
  const [buyerPhone, setBuyerPhone] = useState('+91 98230 45678');
  const [buyerName, setBuyerName] = useState('Rajesh Malhotra');
  const [buyerEmail, setBuyerEmail] = useState('rajesh.malhotra@investor.in');
  const [buyerOtp, setBuyerOtp] = useState('');
  const [isOtpDispatched, setIsOtpDispatched] = useState(false);
  const [otpTimer, setOtpTimer] = useState(45);

  // Fast Visitor State
  const [visitorName, setVisitorName] = useState('Aarav Mehta');
  const [visitorCity, setVisitorCity] = useState('Pune (Baner / Wakad)');
  const [visitorBudget, setVisitorBudget] = useState('3_TO_7_CR');

  // Enterprise State
  const [adminEmail, setAdminEmail] = useState('westernluxuryestate@gmail.com');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [adminRole, setAdminRole] = useState<UserRole>('SUPER_ADMIN');

  // Handle VIP Investor Sign In
  const handleBuyerLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const session: UserSession = {
      userId: `vip-${Date.now().toString(36)}`,
      name: buyerName.trim() || 'Rajesh Malhotra',
      email: buyerEmail.trim() || 'rajesh.malhotra@investor.in',
      phone: buyerPhone.trim() || '+91 98230 45678',
      role: 'CUSTOMER',
      token: `jwt_vip_${Date.now()}`,
      savedPropertyIds: ['prop-res-01', 'prop-res-02', 'prop-res-03'],
      savedUnitIds: ['unit-1402', 'unit-1801'],
      propertyDNA: {
        budgetMin: 35000000,
        budgetMax: 75000000,
        preferredLocations: ['Wakad', 'Baner', 'Kharadi'],
        configurations: ['3.5 BHK', '4 BHK'],
        purpose: 'BUY_FAMILY',
        timeline: 'IMMEDIATE',
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
  };

  // Preset One-Click Personas
  const handleSelectPreset = (type: 'RAJESH_VIP' | 'PRIYA_NRI' | 'WESTERN_ADMIN' | 'GUEST_VISITOR') => {
    if (type === 'RAJESH_VIP') {
      const session: UserSession = {
        userId: 'usr_rajesh_malhotra_01',
        name: 'Rajesh Malhotra',
        email: 'rajesh.malhotra@investor.in',
        phone: '+91 98230 45678',
        role: 'CUSTOMER',
        token: `jwt_vip_malhotra_${Date.now()}`,
        savedPropertyIds: ['prop-res-01', 'prop-res-02'],
        savedUnitIds: ['unit-1402'],
        propertyDNA: {
          budgetMin: 40000000,
          budgetMax: 90000000,
          preferredLocations: ['Wakad', 'Balewadi', 'Koregaon Park'],
          configurations: ['3.5 BHK', '4 BHK Sky Residence'],
          purpose: 'INVESTMENT_GROWTH',
          timeline: 'IMMEDIATE',
          priorities: {
            commute: 4,
            lifestyleAmenities: 5,
            spaciousLayout: 5,
            appreciationPotential: 5,
            schoolProximity: 3,
          },
        },
      };
      onLoginSuccess(session);
    } else if (type === 'PRIYA_NRI') {
      const session: UserSession = {
        userId: 'usr_priya_sharma_02',
        name: 'Priya Sharma (NRI Tech VP)',
        email: 'priya.sharma@siliconvalley.io',
        phone: '+1 415 555 0199',
        role: 'CUSTOMER',
        token: `jwt_vip_sharma_${Date.now()}`,
        savedPropertyIds: ['prop-res-03', 'prop-res-04'],
        savedUnitIds: ['unit-2201'],
        propertyDNA: {
          budgetMin: 50000000,
          budgetMax: 120000000,
          preferredLocations: ['Kharadi', 'Viman Nagar'],
          configurations: ['4 BHK Luxury Penthouse'],
          purpose: 'BUY_FAMILY',
          timeline: 'IMMEDIATE',
          priorities: {
            commute: 3,
            lifestyleAmenities: 5,
            spaciousLayout: 5,
            appreciationPotential: 5,
            schoolProximity: 4,
          },
        },
      };
      onLoginSuccess(session);
    } else if (type === 'WESTERN_ADMIN') {
      const adminAcc = PROVISIONED_ADMIN_ACCOUNTS.find((a) => a.email === 'westernluxuryestate@gmail.com') || PROVISIONED_ADMIN_ACCOUNTS[0];
      const session: UserSession = {
        userId: adminAcc.id,
        name: adminAcc.name,
        email: adminAcc.email,
        phone: adminAcc.phone,
        role: adminAcc.role,
        token: `jwt_admin_master_${Date.now()}`,
        savedPropertyIds: [],
      };
      onLoginSuccess(session);
    } else if (type === 'GUEST_VISITOR') {
      const session: UserSession = {
        userId: `vis-${Date.now().toString(36)}`,
        name: 'Aarav Mehta',
        email: 'aarav.mehta@visitor.kiaan.in',
        phone: '+91 98230 99887',
        role: 'VISITOR',
        token: `jwt_vis_${Date.now()}`,
        savedPropertyIds: ['prop-res-01'],
        propertyDNA: {
          budgetMin: 20000000,
          budgetMax: 45000000,
          preferredLocations: ['Wakad', 'Baner'],
          configurations: ['3 BHK'],
          purpose: 'BUY_FAMILY',
          timeline: 'UNDER_6_MONTHS',
          priorities: {
            commute: 4,
            lifestyleAmenities: 4,
            spaciousLayout: 4,
            appreciationPotential: 4,
            schoolProximity: 4,
          },
        },
      };
      onLoginSuccess(session);
    }
  };

  // Handle Fast Visitor Register
  const handleVisitorEnter = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      userId: `vis-${Date.now().toString(36)}`,
      name: visitorName.trim() || 'Verified Guest',
      email: `visitor.${Date.now().toString(36)}@kiaanproperties.in`,
      phone: '+91 98230 00111',
      role: 'VISITOR',
      token: `jwt_vis_fast_${Date.now()}`,
      savedPropertyIds: ['prop-res-01'],
      propertyDNA: {
        budgetMin: visitorBudget === '1_TO_3_CR' ? 15000000 : 35000000,
        budgetMax: visitorBudget === '1_TO_3_CR' ? 30000000 : 70000000,
        preferredLocations: [visitorCity.split(' ')[0]],
        configurations: ['3 BHK'],
        purpose: 'BUY_FAMILY',
        timeline: 'UNDER_6_MONTHS',
        priorities: {
          commute: 4,
          lifestyleAmenities: 4,
          spaciousLayout: 4,
          appreciationPotential: 4,
          schoolProximity: 4,
        },
      },
    };
    onLoginSuccess(session);
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = PROVISIONED_ADMIN_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === adminEmail.trim().toLowerCase()
    ) || PROVISIONED_ADMIN_ACCOUNTS[0];

    const session: UserSession = {
      userId: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
      role: adminRole || matched.role,
      token: `jwt_admin_${Date.now()}`,
      savedPropertyIds: [],
    };
    onLoginSuccess(session);
  };

  return (
    <div className={`w-full min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* 1. Header Banner & Status Context */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Crown className="w-4 h-4" />
            <span>Kiaan Private Client & Member Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
            {currentSession ? 'Active Session & Authentication Hub' : 'Elevated Real Estate Access'}
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            {currentSession
              ? `You are currently authenticated as ${currentSession.name}. Switch profiles below or continue to your private investor lounge.`
              : 'Sign in to unlock confidential builder pricing, reserve 15-minute escrow locks, and access verified MahaRERA Form 4 construction milestone audits.'}
          </p>
        </div>

        {/* 2. If already logged in, show Current Session Banner with Actions */}
        {currentSession && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl font-serif font-bold text-amber-300">
                  {currentSession.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-white">{currentSession.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {currentSession.role === 'SUPER_ADMIN'
                        ? '🛡️ Enterprise Super Admin'
                        : currentSession.role === 'ADMIN'
                        ? '👔 Partner Admin'
                        : currentSession.role === 'CUSTOMER'
                        ? '👑 Diamond VIP Investor'
                        : '✨ Verified Visitor'}
                    </span>
                  </div>
                  <div className="text-xs text-white/60 font-mono mt-1">
                    {currentSession.email} • {currentSession.phone}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/75 mt-2.5">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Pricing Active
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Lock className="w-3.5 h-3.5" /> Escrow Reservation Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {currentSession.role === 'CUSTOMER' && (
                  <button
                    onClick={onOpenVipLounge}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Open VIP Lounge</span>
                  </button>
                )}
                {(currentSession.role === 'SUPER_ADMIN' || currentSession.role === 'ADMIN') && (
                  <button
                    onClick={onOpenAdminCms}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Launch Admin CMS</span>
                  </button>
                )}
                <button
                  onClick={onNavigateHome}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Return to Discovery
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-medium text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Fast One-Click Demo Personas Strip (Immediate Access) */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick One-Click Demo Personas (Instant Status Testing)
            </h3>
            <span className="text-xs text-white/50 hidden sm:inline">Tap any profile to test different auth tiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Persona 1: VIP Diamond Investor */}
            <button
              onClick={() => handleSelectPreset('RAJESH_VIP')}
              className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400">👑 VIP Investor</span>
                <span className="text-[10px] font-mono text-amber-300/80 bg-amber-500/20 px-2 py-0.5 rounded-full">Diamond Tier</span>
              </div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Rajesh Malhotra</div>
              <div className="text-xs text-white/60 mt-1">₹4Cr - ₹9Cr Portfolio • Wakad / Balewadi</div>
            </button>

            {/* Persona 2: NRI Tech Buyer */}
            <button
              onClick={() => handleSelectPreset('PRIYA_NRI')}
              className="p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-400">✈️ NRI Executive</span>
                <span className="text-[10px] font-mono text-purple-300/80 bg-purple-500/20 px-2 py-0.5 rounded-full">Silicon Valley</span>
              </div>
              <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Priya Sharma</div>
              <div className="text-xs text-white/60 mt-1">₹5Cr - ₹12Cr Penthouse • Kharadi</div>
            </button>

            {/* Persona 3: Enterprise Super Admin */}
            <button
              onClick={() => handleSelectPreset('WESTERN_ADMIN')}
              className="p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-400">🛡️ Super Admin</span>
                <span className="text-[10px] font-mono text-red-300/80 bg-red-500/20 px-2 py-0.5 rounded-full">Full Clearance</span>
              </div>
              <div className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">Western Luxury Admin</div>
              <div className="text-xs text-white/60 mt-1">CMS, RERA Audits, Team Management</div>
            </button>

            {/* Persona 4: Fast Guest Visitor */}
            <button
              onClick={() => handleSelectPreset('GUEST_VISITOR')}
              className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">✨ Fast Pass</span>
                <span className="text-[10px] font-mono text-emerald-300/80 bg-emerald-500/20 px-2 py-0.5 rounded-full">No Password</span>
              </div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Aarav Mehta (Guest)</div>
              <div className="text-xs text-white/60 mt-1">Instant Shortlists & DNA Matching</div>
            </button>
          </div>
        </div>

        {/* 4. Main Authentication Matrix: Tabbed Pathways */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Dedicated Login Portal */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6">
            
            {/* Tabs */}
            <div className="flex p-1 rounded-2xl bg-black/40 border border-white/10">
              <button
                onClick={() => setActivePortalTab('VIP_BUYER')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePortalTab === 'VIP_BUYER'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>VIP Buyer / Investor</span>
              </button>

              <button
                onClick={() => setActivePortalTab('VISITOR_PASS')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePortalTab === 'VISITOR_PASS'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Quick Visitor Pass</span>
              </button>

              <button
                onClick={() => setActivePortalTab('ENTERPRISE')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePortalTab === 'ENTERPRISE'
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/40 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Enterprise Admin</span>
              </button>
            </div>

            {/* Tab 1: VIP Buyer / Investor Login Form */}
            {activePortalTab === 'VIP_BUYER' && (
              <form onSubmit={handleBuyerLogin} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">VIP Private Client Sign-In</h3>
                  <p className="text-xs text-white/60">
                    Sign in with your verified mobile number or email to access confidential inventory
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Your Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="e.g. Rajesh Malhotra"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Mobile Number (WhatsApp Enabled)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="+91 98230 45678"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="rajesh.malhotra@investor.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {isOtpDispatched ? (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-amber-300 font-medium">OTP sent to {buyerPhone}</span>
                        <span className="font-mono text-amber-400">{otpTimer}s</span>
                      </div>
                      <input
                        type="text"
                        value={buyerOtp}
                        onChange={(e) => setBuyerOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (e.g. 482910)"
                        maxLength={6}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-amber-500/40 text-white font-mono tracking-widest text-center text-base focus:outline-none"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {!isOtpDispatched ? (
                    <button
                      type="button"
                      onClick={() => setIsOtpDispatched(true)}
                      className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <span>Request 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <span>Verify & Enter VIP Lounge</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSelectPreset('RAJESH_VIP')}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium text-xs sm:text-sm border border-white/10 transition-all cursor-pointer"
                  >
                    Bypass with Demo
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Fast Visitor Pass Form */}
            {activePortalTab === 'VISITOR_PASS' && (
              <form onSubmit={handleVisitorEnter} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Instant Visitor Fast Pass</h3>
                  <p className="text-xs text-white/60">
                    No password or verification code needed. Browse, save shortlists, and test match algorithms immediately.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="e.g. Aarav Mehta"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Target Locality Preference</label>
                    <select
                      value={visitorCity}
                      onChange={(e) => setVisitorCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    >
                      <option value="Wakad, Pune">Wakad & Hinjewadi IT Corridor</option>
                      <option value="Baner, Pune">Baner & Balewadi High Street</option>
                      <option value="Kharadi, Pune">Kharadi & Viman Nagar World Trade Center</option>
                      <option value="Koregaon Park, Pune">Koregaon Park & Bund Garden (Luxury Villas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Budget Spectrum</label>
                    <select
                      value={visitorBudget}
                      onChange={(e) => setVisitorBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    >
                      <option value="1_TO_3_CR">₹1.2 Cr – ₹3.0 Cr (Premium Apartments)</option>
                      <option value="3_TO_7_CR">₹3.5 Cr – ₹7.0 Cr (Luxury High-Rise / Penthouses)</option>
                      <option value="7_TO_15_CR">₹7.0 Cr – ₹15.0 Cr (Ultra-Luxury Sky Mansions)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Instant Visitor Session</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Enterprise Admin Form */}
            {activePortalTab === 'ENTERPRISE' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Enterprise Admin & Partner Console</h3>
                  <p className="text-xs text-white/60">
                    Restricted to authorized investment officers, RERA compliance attorneys, and sales admins
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Admin Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="westernluxuryestate@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Administrative Role</label>
                    <select
                      value={adminRole}
                      onChange={(e) => setAdminRole(e.target.value as UserRole)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="SUPER_ADMIN">Super Admin (Full Root CMS & Audits)</option>
                      <option value="ADMIN">Sales & Portfolio Admin</option>
                      <option value="PORTFOLIO_MANAGER">Portfolio & Listings Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Master Access Key</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Launch CMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('WESTERN_ADMIN')}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium text-xs sm:text-sm border border-white/10 transition-all cursor-pointer"
                  >
                    Quick Superadmin
                  </button>
                </div>
              </form>
            )}

            {/* Back to Discovery Link */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-white/50 hover:text-amber-400 transition-colors cursor-pointer"
              >
                ← Continue browsing public inventory without signing in
              </button>
            </div>
          </div>

          {/* Right Side: What You Unlock (Visitor vs Member Comparison) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Privilege Breakdown
                </span>
                <h3 className="text-lg font-bold text-white">Public Visitor vs VIP Member</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white/60">Pricing Disclosure</span>
                    <span className="text-amber-400">Institutional Spread</span>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    Visitors see baseline launch pricing. VIP members unlock confidential developer margins (-8% to -14% net savings).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white/60">Unit Locking</span>
                    <span className="text-emerald-400">15-Min ICICI Escrow</span>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    Lock high-demand sky residences exclusively for 15 minutes while legal review takes place.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white/60">Construction Audits</span>
                    <span className="text-blue-400">MahaRERA Form 4 Sync</span>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    Direct live synchronization with MahaRERA quarterly engineer certificates and encumbrance logs.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white/60">Site Inspection</span>
                    <span className="text-purple-400">Chauffeur Mercedes</span>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    Private Mercedes-Benz E-Class pickup & rooftop solar orientation review with Senior Architect.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                <span>RERA Reg: P52100078942</span>
                <span className="text-emerald-400 font-semibold">100% Verified Clean Titles</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
