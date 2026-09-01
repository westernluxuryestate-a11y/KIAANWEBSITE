/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building,
  ShieldCheck,
  Calculator,
  Bot,
  Sparkles,
  Layers,
  Search,
  SlidersHorizontal,
  Bookmark,
  UserCheck,
  ChevronDown,
  FileCheck,
  Compass,
  Car,
  Home,
  PlusCircle,
  LogIn,
  Heart,
  TrendingUp,
  Key,
  Users,
  Globe,
  FileText,
  Building2,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCY_REGISTRY } from '../services/currencyEngine';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: 'BUY' | 'RENT_LEASE' | 'INVEST' | 'COMMERCIAL';
  setMode: (mode: 'BUY' | 'RENT_LEASE' | 'INVEST' | 'COMMERCIAL') => void;
  currency?: CurrencyCode;
  onOpenNriModal?: () => void;
  onOpenPassportModal?: () => void;
  onOpenDocCenter?: () => void;
  onOpenPrivacyCenter?: () => void;
  onOpenPaymentSecurity?: () => void;
  onOpenSeoInspector?: () => void;
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
  onOpenSellModal?: () => void;
  onOpenLoginModal?: () => void;
  onOpenAdminCms?: () => void;
  userSession?: any;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  currency = 'INR',
  onOpenNriModal,
  onOpenPassportModal,
  onOpenDocCenter,
  onOpenPrivacyCenter,
  onOpenPaymentSecurity,
  onOpenSeoInspector,
  theme = 'dark',
  setTheme,
  onOpenSellModal,
  onOpenLoginModal,
  onOpenAdminCms,
  userSession,
  savedCount = 2,
}) => {
  const [showAuditMenu, setShowAuditMenu] = useState(false);
  const isDark = theme === 'dark';

  const isAuditActive = ['phase01', 'phase02', 'phase03', 'phase04', 'rera'].includes(activeTab);

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  const handleModeSelect = (newMode: 'BUY' | 'RENT_LEASE' | 'INVEST' | 'COMMERCIAL') => {
    setMode(newMode);
    setActiveTab(newMode === 'COMMERCIAL' ? 'commercial' : 'explore');
  };


  return (
    <>
      <header
        className={`sticky top-0 z-50 backdrop-blur-2xl border-b shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#070B12]/90 border-amber-500/15 text-white'
            : 'bg-white/90 border-slate-200 text-slate-900 shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand Identity */}
            <div
              id="brand-logo"
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-900 p-[1.5px] shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/50 transition-all duration-500">
                <div
                  className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                    isDark ? 'bg-[#080D17]' : 'bg-slate-900'
                  }`}
                >
                  <span className="font-serif font-extrabold text-xl bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    K
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-serif text-xl sm:text-2xl font-bold tracking-widest ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    KIAAN
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    ESTATES
                  </span>
                </div>
                <p
                  className={`text-[8.5px] sm:text-[9.5px] tracking-widest uppercase font-medium ${
                    isDark ? 'text-white/50' : 'text-slate-500'
                  }`}
                >
                  Discovery & Digital Twins
                </p>
              </div>
            </div>

            {/* Desktop Primary Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                id="nav-home"
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'explore' && mode === 'BUY'
                    ? 'text-black bg-gradient-to-r from-amber-400 to-amber-500 font-bold shadow-md shadow-amber-500/20'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                Home
              </button>

              <button
                id="nav-properties"
                onClick={() => {
                  setActiveTab('search');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'search'
                    ? 'text-black bg-gradient-to-r from-amber-400 to-amber-500 font-bold shadow-md shadow-amber-500/20'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                Properties
              </button>

              <button
                id="nav-projects"
                onClick={() => {
                  setActiveTab('explore');
                  const el = document.getElementById('explore-projects-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                Projects
              </button>

              {/* Modes: Buy | Rent / Lease | Invest */}
              <button
                id="nav-buy"
                onClick={() => handleModeSelect('BUY')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  mode === 'BUY' && activeTab === 'explore'
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30 font-bold'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Buy
              </button>

              <button
                id="nav-rent"
                onClick={() => handleModeSelect('RENT_LEASE')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  mode === 'RENT_LEASE'
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30 font-bold'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Rent / Lease
              </button>

              <button
                id="nav-invest"
                onClick={() => handleModeSelect('INVEST')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  mode === 'INVEST'
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30 font-bold'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Invest
              </button>

              <button
                id="nav-commercial"
                onClick={() => handleModeSelect('COMMERCIAL')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'COMMERCIAL' || activeTab === 'commercial'
                    ? 'text-amber-500 bg-amber-500/15 border border-amber-500/30 font-bold'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Commercial</span>
              </button>

              <button
                id="nav-docs"
                onClick={() => onOpenDocCenter && onOpenDocCenter()}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="MahaRERA Sanctions & AI Explainer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Doc Center</span>
              </button>

              <button
                id="nav-passport"
                onClick={() => onOpenPassportModal && onOpenPassportModal()}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="10-Step Journey Passport & Active Flow Recovery"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Journey</span>
              </button>

              <button
                id="nav-map"
                onClick={() => setActiveTab('map')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 font-bold'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Map Explorer</span>
              </button>

              <button
                id="nav-family"
                onClick={() => setActiveTab('family')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'family'
                    ? 'text-purple-400 bg-purple-500/15 border border-purple-500/30 font-bold'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Family Room</span>
              </button>

              <button
                id="nav-ai"
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ai'
                    ? 'text-amber-500 bg-amber-500/15 border border-amber-500/30 font-bold'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-amber-500" />
                <span>Kiaan AI</span>
              </button>

              <button
                id="nav-calculators"
                onClick={() => setActiveTab('finance')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'finance'
                    ? 'text-black bg-gradient-to-r from-amber-400 to-amber-500 font-bold shadow-md shadow-amber-500/25'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculators</span>
              </button>

              {/* RERA & Compliance Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAuditMenu(!showAuditMenu)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-1 transition-all cursor-pointer border ${
                    isAuditActive
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                      : isDark
                      ? 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white hover:bg-white/5'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                  title="MahaRERA Regulatory & Verification Suite"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>MahaRERA</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {showAuditMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-60 rounded-2xl border p-2 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in space-y-1 ${
                      isDark
                        ? 'bg-[#0C121E]/95 border-amber-500/30 text-white'
                        : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
                    }`}
                    onMouseLeave={() => setShowAuditMenu(false)}
                  >
                    <button
                      onClick={() => {
                        setActiveTab('rera');
                        setShowAuditMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10"
                    >
                      <span>MahaRERA Compliance Center</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('contracts');
                        setShowAuditMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10"
                    >
                      <span>Escrow & Digital Contracts</span>
                      <FileCheck className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenPrivacyCenter) onOpenPrivacyCenter();
                        setShowAuditMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 text-amber-400"
                    >
                      <span>DPDPA Privacy & Consent</span>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenPaymentSecurity) onOpenPaymentSecurity();
                        setShowAuditMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 text-emerald-400"
                    >
                      <span>Payment Security Ledger</span>
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenSeoInspector) onOpenSeoInspector();
                        setShowAuditMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 text-cyan-400"
                    >
                      <span>SEO & Schema.org Inspector</span>
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                    <div className="border-t border-current/10 pt-1 text-[10px] text-amber-500 font-bold px-3">
                      Verification Audits
                    </div>
                    {(['phase04', 'phase03', 'phase02', 'phase01'] as const).map((ph) => (
                      <button
                        key={ph}
                        onClick={() => {
                          setActiveTab(ph);
                          setShowAuditMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between opacity-80 hover:opacity-100 hover:bg-current/5"
                      >
                        <span className="capitalize">{ph.replace('phase', 'Phase ')} Audit</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-mono">PASS</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Actions: Sell/List Property + Currency + Theme + VIP Login */}
            <div className="flex items-center gap-2">
              {/* NRI & Multi-Currency Engine Selector (Item 106 & 107) */}
              <button
                id="nav-currency-nri"
                onClick={() => onOpenNriModal && onOpenNriModal()}
                className={`px-2.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currency !== 'INR'
                    ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/25'
                    : isDark
                    ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                    : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
                title="NRI Mode & Multi-Currency Engine"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{currency} ({CURRENCY_REGISTRY[currency]?.symbol || '₹'})</span>
              </button>

              {/* Sell / List Property Button */}
              <button
                id="nav-sell-property"
                onClick={() => onOpenSellModal && onOpenSellModal()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Sell / List</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:px-2.5 sm:py-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-amber-400 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span className="text-xs font-bold flex items-center gap-1">
                  <span>{isDark ? '☀️' : '🌙'}</span>
                  <span className="hidden xl:inline text-[11px]">{isDark ? 'Light' : 'Dark'}</span>
                </span>
              </button>

              {/* Admin Console Quick Launch (if admin session active) */}
              {userSession && userSession.role !== 'CUSTOMER' && (
                <button
                  id="admin-cms-btn"
                  onClick={() => onOpenAdminCms && onOpenAdminCms()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/25 transition-all cursor-pointer animate-pulse"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CMS Console</span>
                </button>
              )}

              {/* Login / VIP Passport / Admin Switcher Button */}
              <button
                id="account-btn"
                onClick={() => {
                  if (onOpenLoginModal) {
                    onOpenLoginModal();
                  } else {
                    setActiveTab('vip');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                  userSession
                    ? userSession.role !== 'CUSTOMER'
                      ? 'bg-red-500/20 border border-red-500 text-red-400'
                      : 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-amber-500/20 hover:brightness-105'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{userSession ? userSession.name.split(' ')[0] : 'Login / Auth'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Home, Search, Saved, AI, Account) */}
      <nav
        aria-label="Mobile Navigation"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-2xl px-4 py-2 flex items-center justify-around shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#080D18]/95 border-amber-500/20 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-lg'
        }`}
      >
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'explore' ? 'text-amber-500 font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          id="mobile-nav-search"
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'search' ? 'text-amber-500 font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        <button
          id="mobile-nav-saved"
          onClick={() => setActiveTab('vip')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl relative transition-all ${
            activeTab === 'vip' ? 'text-amber-500 font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        <button
          id="mobile-nav-ai"
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'ai' ? 'text-amber-500 font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/40">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-amber-500 tracking-tight">AI</span>
        </button>

        <button
          id="mobile-nav-account"
          onClick={() => {
            if (onOpenLoginModal) onOpenLoginModal();
            else setActiveTab('vip');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'vip' ? 'text-amber-500 font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Account</span>
        </button>
      </nav>
    </>
  );
};
