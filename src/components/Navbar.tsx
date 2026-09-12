/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Building,
  ShieldCheck,
  Calculator,
  Bot,
  Sparkles,
  Layers,
  Search,
  Bookmark,
  UserCheck,
  ChevronDown,
  FileCheck,
  Compass,
  Home,
  PlusCircle,
  TrendingUp,
  Key,
  Users,
  Globe,
  FileText,
  FileCode,
  Building2,
  BookOpen,
  Menu,
  X,
  Lock,
  DollarSign,
  Calendar,
  CreditCard,
  SlidersHorizontal,
  MessageSquare,
  UserPlus,
  LogOut,
  Briefcase,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCY_REGISTRY } from '../services/currencyEngine';
import { KiaanPropertiesLogo } from './KiaanBrandLogo';

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
  onOpenMyListings?: () => void;
  onOpenComparisonTray?: () => void;
  onOpenWhatsAppOnboarding?: (mode?: 'PROPERTY' | 'PROJECT') => void;
  onOpenProjectSchemaSuite?: () => void;
  onOpenResidentialWizard?: () => void;
  onOpenUniversalListingModal?: () => void;
  userSession?: any;
  onLogout?: () => void;
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
  onOpenMyListings,
  onOpenComparisonTray,
  onOpenWhatsAppOnboarding,
  onOpenProjectSchemaSuite,
  onOpenResidentialWizard,
  onOpenUniversalListingModal,
  userSession,
  onLogout,
  savedCount = 0,
}) => {
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const secondaryMenuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Dynamic scroll detection for transparent to blurred glassmorphic header transition
  // Ensures a completely transparent, Apple-inspired aesthetic through the hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero-discovery-section');
      if (heroEl) {
        // Measure the distance of hero section bottom relative to viewport
        const rect = heroEl.getBoundingClientRect();
        // Toggle glassmorphism when hero bottom passes the navbar height threshold (<= 70px)
        setIsScrolled(rect.bottom <= 70);
      } else {
        // Fallback threshold for subviews or other dashboards without hero-discovery-section
        setIsScrolled(window.scrollY > 100);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeTab]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  const handleModeSelect = (newMode: 'BUY' | 'RENT_LEASE' | 'INVEST') => {
    setMode(newMode);
    setActiveTab('explore');
    setIsMobileMenuOpen(false);
    setShowSecondaryMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectsSelect = () => {
    setMode('BUY');
    setActiveTab('explore');
    setIsMobileMenuOpen(false);
    setShowSecondaryMenu(false);
    setTimeout(() => {
      const el = document.getElementById('explore-projects-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSellSelect = () => {
    setIsMobileMenuOpen(false);
    setShowSecondaryMenu(false);
    if (onOpenSellModal) {
      onOpenSellModal();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (secondaryMenuRef.current && !secondaryMenuRef.current.contains(e.target as Node)) {
        setShowSecondaryMenu(false);
      }
    };
    if (showSecondaryMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showSecondaryMenu]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? isDark
              ? 'backdrop-blur-2xl bg-[#070B12]/80 border-b border-white/[0.08] text-white shadow-xl shadow-black/25'
              : 'backdrop-blur-2xl bg-white/80 border-b border-slate-200/80 text-slate-900 shadow-sm shadow-slate-900/5'
            : isDark
            ? 'bg-transparent backdrop-blur-none border-b border-transparent text-white shadow-none'
            : 'bg-transparent backdrop-blur-none border-b border-transparent text-slate-900 shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* 1. Official Kiaan Properties Brand Logo */}
            <div
              id="brand-logo"
              onClick={() => {
                setMode('BUY');
                setActiveTab('explore');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center cursor-pointer group select-none shrink-0"
              title="Kiaan Properties"
            >
              <KiaanPropertiesLogo theme={theme} size="md" animated />
            </div>

            {/* 2. Desktop Primary Navigation: ONLY 'Buy', 'Rent', 'Projects', and 'Sell' */}
            <nav
              className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-500 ${
                isScrolled
                  ? isDark
                    ? 'bg-white/[0.05] border-white/[0.08] backdrop-blur-md'
                    : 'bg-black/[0.04] border-black/[0.08] backdrop-blur-md'
                  : isDark
                  ? 'bg-white/[0.07] border-white/10 backdrop-blur-sm'
                  : 'bg-black/[0.04] border-black/10 backdrop-blur-sm'
              }`}
            >
              {/* Item 1: Buy */}
              <button
                id="nav-buy"
                onClick={() => handleModeSelect('BUY')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'explore' && mode === 'BUY'
                    ? isDark
                      ? 'text-white bg-white/15 font-semibold shadow-sm'
                      : 'text-slate-950 bg-white font-semibold shadow-sm'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-black/5'
                }`}
              >
                Buy
              </button>

              {/* Item 2: Rent */}
              <button
                id="nav-rent"
                onClick={() => handleModeSelect('RENT_LEASE')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'explore' && mode === 'RENT_LEASE'
                    ? isDark
                      ? 'text-white bg-white/15 font-semibold shadow-sm'
                      : 'text-slate-950 bg-white font-semibold shadow-sm'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-black/5'
                }`}
              >
                Rent
              </button>

              {/* Item 3: Projects */}
              <button
                id="nav-projects"
                onClick={handleProjectsSelect}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'explore' && mode === 'BUY'
                    ? isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-black/5'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-black/5'
                }`}
              >
                Projects
              </button>

              {/* Item 3.5: Developers */}
              <button
                id="nav-developers"
                onClick={() => {
                  setActiveTab('developers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'developers' || activeTab === 'developer-profile'
                    ? isDark
                      ? 'text-white bg-white/15 font-semibold shadow-sm'
                      : 'text-slate-950 bg-white font-semibold shadow-sm'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-black/5'
                }`}
              >
                Developers
              </button>

              {/* Item 3.8: Localities */}
              <button
                id="nav-localities"
                onClick={() => {
                  setActiveTab('localities');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'localities' || activeTab === 'locality-page'
                    ? isDark
                      ? 'text-white bg-white/15 font-semibold shadow-sm'
                      : 'text-slate-950 bg-white font-semibold shadow-sm'
                    : isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-black/5'
                }`}
              >
                Localities
              </button>

              {/* Item 4: Sell */}
              <button
                id="nav-sell"
                onClick={handleSellSelect}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-black/5'
                }`}
              >
                Sell
              </button>
            </nav>

            {/* 3. Mobile Header Right Actions: Strictly Limited to Search + Hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <button
                id="mobile-header-search-btn"
                onClick={() => {
                  setActiveTab('search');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === 'search'
                    ? 'text-amber-400 bg-amber-500/15'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="Search Residences"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                id="mobile-header-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isMobileMenuOpen
                    ? 'text-amber-400 bg-amber-500/20'
                    : isDark
                    ? 'text-white/85 hover:text-white hover:bg-white/10'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="Navigation Menu"
                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* 4. Desktop Right-Hand Utility Section: Search, Saved, Login/Account, Menu */}
            <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
              {/* Utility 1: Search */}
              <button
                id="nav-search-btn"
                onClick={() => {
                  setActiveTab('search');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  activeTab === 'search'
                    ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                    : isDark
                    ? 'text-white/75 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="Search Residences & Projects"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline text-xs">Search</span>
              </button>

              {/* Utility 2: Saved Shortlist */}
              <button
                id="nav-saved-btn"
                onClick={() => {
                  setActiveTab('vip');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 relative transition-all duration-200 cursor-pointer ${
                  activeTab === 'vip' && !userSession
                    ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                    : isDark
                    ? 'text-white/75 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="Saved Residences & Shortlist"
                aria-label="Saved"
              >
                <Bookmark className="w-4 h-4" />
                {savedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-bold flex items-center justify-center -ml-0.5">
                    {savedCount}
                  </span>
                )}
              </button>

              {/* Utility 3.5: Master Project Schema & Wizard */}
              <button
                id="nav-project-schema-btn"
                onClick={() => {
                  if (onOpenProjectSchemaSuite) onOpenProjectSchemaSuite();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                }`}
                title="Master 29-Section Schema Suite (LQS Audit, Cost Engine, Field Definitions)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline">Project Schema Suite</span>
                <span className="xl:hidden">Schema</span>
              </button>

              {/* Utility 4: Manage Listings & Portfolio */}
              <button
                id="nav-manage-listings-btn"
                onClick={() => {
                  if (onOpenMyListings) onOpenMyListings();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                }`}
                title="Add, Modify, and Delete Properties & Projects"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">My Listings</span>
              </button>

              {/* Utility 5: Admin CMS Direct Link */}
              {userSession && userSession.role !== 'CUSTOMER' && (
                <button
                  id="nav-admin-cms-direct-btn"
                  onClick={() => {
                    if (onOpenAdminCms) onOpenAdminCms();
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-900/30 transition-all hover:scale-105"
                  title="Open Enterprise Super Admin CMS Console"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin CMS</span>
                </button>
              )}

              <button
                id="account-btn"
                onClick={() => {
                  if (onOpenLoginModal) {
                    onOpenLoginModal();
                  } else {
                    setActiveTab('vip');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                  userSession
                    ? userSession.role !== 'CUSTOMER' && userSession.role !== 'VISITOR'
                      ? 'bg-red-500/20 border border-red-500 text-red-300'
                      : userSession.role === 'VISITOR'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-emerald-500/20 border border-emerald-500 text-emerald-300'
                    : isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
                title={userSession ? `Signed in as ${userSession.name} (${userSession.email || userSession.phone})` : 'Visitor Sign In / Create Account'}
              >
                {userSession ? (
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="hidden xs:inline">
                  {userSession
                    ? userSession.email === 'sales@kiaanproperties.in'
                      ? '👑 Sales Admin'
                      : userSession.role === 'VISITOR'
                      ? `✨ ${userSession.name.split(' ')[0]}`
                      : `🌟 ${userSession.name.split(' ')[0]}`
                    : 'Sign In / Register'}
                </span>
              </button>

              {/* Progressive Disclosure: Secondary Menu Dropdown */}
              <div className="relative" ref={secondaryMenuRef}>
                <button
                  id="nav-secondary-menu-btn"
                  onClick={() => setShowSecondaryMenu(!showSecondaryMenu)}
                  className={`p-2 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    showSecondaryMenu
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : isDark
                      ? 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                      : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                  }`}
                  title="More Services & Capabilities"
                  aria-label="More Services Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>

                {/* Secondary Menu Dropdown Drawer */}
                {showSecondaryMenu && (
                  <div
                    className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border p-4 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in space-y-4 max-h-[85vh] overflow-y-auto ${
                      isDark
                        ? 'bg-[#080D18]/98 border-amber-500/30 text-white shadow-black/80'
                        : 'bg-white/98 border-slate-200 text-slate-900 shadow-2xl'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-current/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-500">
                          Kiaan Client Services
                        </span>
                      </div>
                      <button
                        onClick={() => setShowSecondaryMenu(false)}
                        className="p-1 rounded-lg hover:bg-current/10 cursor-pointer opacity-60 hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Section A: Buyer & Decision Tools */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 px-2.5 pb-1">
                        Buyer & Decision Tools
                      </p>

                      <button
                        onClick={() => {
                          setActiveTab('finance');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calculator className="w-4 h-4 text-amber-500" />
                          <div>
                            <span className="font-semibold block">Calculators & Tax Shield</span>
                            <span className="text-[10px] opacity-60">EMI, Stamp Duty & Wealth Projections</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenComparisonTray) onOpenComparisonTray();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Layers className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">Compare Residences</span>
                            <span className="text-[10px] opacity-60">Side-by-side unit & floor plan matrix</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('family');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-purple-400" />
                          <div>
                            <span className="font-semibold block">Family Decision Room™</span>
                            <span className="text-[10px] opacity-60">Collaborative voting & private discussion</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenProjectSchemaSuite) onOpenProjectSchemaSuite();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between bg-gradient-to-r from-amber-500/15 to-transparent hover:bg-amber-500/25 text-amber-300 transition-colors cursor-pointer border border-amber-500/30"
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block flex items-center gap-1.5">
                              <span>Project Schema Suite & Wizard</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-black font-mono font-bold">29 SECTIONS</span>
                            </span>
                            <span className="text-[10px] opacity-75">LQS audit, unbundled cost sheet, commute matrix</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenMyListings) onOpenMyListings();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors cursor-pointer border border-amber-500/20"
                      >
                        <div className="flex items-center gap-2.5">
                          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">Manage Portfolio & Added Listings</span>
                            <span className="text-[10px] opacity-75">Add, edit, or delete your properties & projects</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenUniversalListingModal) onOpenUniversalListingModal();
                          else if (onOpenSellModal) onOpenSellModal();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-transparent hover:from-amber-500/30 text-amber-300 transition-colors cursor-pointer border border-amber-500/30"
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block flex items-center gap-1.5">
                              <span>Universal Listing Suite</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-black font-mono font-bold">ALL TYPES</span>
                            </span>
                            <span className="text-[10px] opacity-75">Residential, Commercial, Land, Pre-Lease & Industrial</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenSellModal) onOpenSellModal();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <PlusCircle className="w-4 h-4 text-emerald-400" />
                          <div>
                            <span className="font-semibold block">Sell / List Property</span>
                            <span className="text-[10px] opacity-60">Private client property onboarding</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenWhatsAppOnboarding) onOpenWhatsAppOnboarding('PROPERTY');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer border border-emerald-500/20"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <div>
                            <span className="font-semibold block">+ Add via WhatsApp</span>
                            <span className="text-[10px] opacity-75">Property & Project conversational onboarding</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('contracts');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileCheck className="w-4 h-4 text-amber-500" />
                          <div>
                            <span className="font-semibold block">Offers, Booking & Contracts</span>
                            <span className="text-[10px] opacity-60">Digital escrow & tokenized agreements</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>
                    </div>

                    {/* Section B: Spatial Discovery & Regulatory Suite */}
                    <div className="space-y-1 pt-2 border-t border-current/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 px-2.5 pb-1">
                        Advisory & Regulatory Suite
                      </p>

                      <button
                        onClick={() => {
                          setActiveTab('developers');
                          setShowSecondaryMenu(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">Real Estate Developers</span>
                            <span className="text-[10px] opacity-60">Directory, track records & verified RERA</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        id="dropdown-localities"
                        onClick={() => {
                          setActiveTab('localities');
                          setShowSecondaryMenu(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Compass className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">Localities & Micro-Markets</span>
                            <span className="text-[10px] opacity-60">Intelligence, price trends & opportunities</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('map');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Compass className="w-4 h-4 text-cyan-400" />
                          <div>
                            <span className="font-semibold block">Locations & GIS Map</span>
                            <span className="text-[10px] opacity-60">Micro-market spatial intelligence</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('rera');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <div>
                            <span className="font-semibold block">MahaRERA Compliance Suite</span>
                            <span className="text-[10px] opacity-60">Reg. No: <strong className="text-amber-400">A031262603640</strong> • Escrow verification</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenDocCenter) onOpenDocCenter();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-amber-500" />
                          <div>
                            <span className="font-semibold block">Legal Doc Center</span>
                            <span className="text-[10px] opacity-60">Title deeds, sanctions & AI explainer</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          setMode('COMMERCIAL');
                          setActiveTab('commercial');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">Commercial & Office Assets</span>
                            <span className="text-[10px] opacity-60">Grade-A IT parks & high-street retail</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenNriModal) onOpenNriModal();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">NRI Global Desk & Currency</span>
                            <span className="text-[10px] opacity-60">{currency} ({CURRENCY_REGISTRY[currency]?.symbol || '₹'}) • FEMA repatriation</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenPassportModal) onOpenPassportModal();
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Compass className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">Client Journey Passport</span>
                            <span className="text-[10px] opacity-60">10-step progress & flow recovery</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('blog');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer bg-amber-500/5 border border-amber-500/20 text-amber-400"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block">Kiaan Journal & Blog</span>
                            <span className="text-[10px] opacity-75">Market intelligence, FEMA & tax guides</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('careers');
                          setShowSecondaryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-current/10 transition-colors cursor-pointer bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-amber-500/20 text-current"
                      >
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-semibold block flex items-center gap-1.5">
                              <span>Careers & Talent Hub</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-600 text-white font-mono font-bold">WE'RE HIRING</span>
                            </span>
                            <span className="text-[10px] opacity-75">Sales, Legal, 3D Architecture & Tech Openings</span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                      </button>
                    </div>

                    {/* Section C: Preferences & Administration */}
                    <div className="space-y-2 pt-2 border-t border-current/10">
                      <div className="flex items-center justify-between px-2 text-xs">
                        <span className="opacity-75 text-[11px]">Display Theme</span>
                        <button
                          onClick={toggleTheme}
                          className="px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 hover:bg-current/10 cursor-pointer"
                        >
                          <span>{isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            if (onOpenPrivacyCenter) onOpenPrivacyCenter();
                            setShowSecondaryMenu(false);
                          }}
                          className="px-2 py-1.5 rounded-lg border border-current/10 text-[10px] font-semibold text-center hover:bg-current/10 cursor-pointer"
                        >
                          DPDPA Privacy
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenPaymentSecurity) onOpenPaymentSecurity();
                            setShowSecondaryMenu(false);
                          }}
                          className="px-2 py-1.5 rounded-lg border border-current/10 text-[10px] font-semibold text-center hover:bg-current/10 cursor-pointer"
                        >
                          Payment Security
                        </button>
                      </div>

                      {/* Visitor & VIP Account Management Card in Secondary Menu */}
                      <div className="p-2.5 rounded-xl border border-current/10 bg-current/5 space-y-2">
                        {userSession ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                                  {userSession.name?.charAt(0) || 'U'}
                                </div>
                                <div className="truncate">
                                  <div className="text-xs font-bold truncate">{userSession.name}</div>
                                  <div className="text-[10px] opacity-60 truncate font-mono">{userSession.email || userSession.phone}</div>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                userSession.role !== 'CUSTOMER' && userSession.role !== 'VISITOR'
                                  ? 'bg-red-500/20 text-red-400'
                                  : userSession.role === 'VISITOR'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {userSession.role === 'VISITOR' ? 'VISITOR' : userSession.role === 'CUSTOMER' ? 'VIP CLIENT' : 'ADMIN'}
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  if (onOpenLoginModal) onOpenLoginModal();
                                  setShowSecondaryMenu(false);
                                }}
                                className="flex-1 py-1 rounded-lg border border-current/10 text-[10px] font-bold text-center hover:bg-current/10 cursor-pointer"
                              >
                                Switch Account
                              </button>
                              {onLogout && (
                                <button
                                  onClick={() => {
                                    onLogout();
                                    setShowSecondaryMenu(false);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <LogOut className="w-3 h-3" />
                                  <span>Sign Out</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Visitor & Client Portal</span>
                            </div>
                            <p className="text-[10px] opacity-70 leading-relaxed">
                              Create a visitor login for 1-click shortlist sync, AI recommendations & priority visits.
                            </p>
                            <button
                              onClick={() => {
                                if (onOpenLoginModal) onOpenLoginModal();
                                setShowSecondaryMenu(false);
                              }}
                              className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Visitor Sign In / Register</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Admin Quick Launch if logged in */}
                      {userSession && userSession.role !== 'CUSTOMER' && userSession.role !== 'VISITOR' && (
                        <button
                          id="secondary-admin-btn"
                          onClick={() => {
                            if (onOpenAdminCms) onOpenAdminCms();
                            setShowSecondaryMenu(false);
                          }}
                          className="w-full mt-2 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Enterprise CMS Console</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 5. Mobile Fullscreen / High-Contrast Navigation Overlay Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className={`md:hidden fixed inset-0 z-50 overflow-y-auto backdrop-blur-2xl transition-all duration-300 ${
            isDark
              ? 'bg-[#060A13]/98 text-white'
              : 'bg-white/98 text-slate-900'
          }`}
        >
          {/* Mobile Drawer Top Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] dark:border-white/[0.08] border-slate-200">
            <div
              onClick={() => {
                setMode('BUY');
                setActiveTab('explore');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              <KiaanPropertiesLogo theme={theme} size="sm" />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-full bg-white/10 dark:bg-white/10 bg-slate-100 hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-7 max-w-lg mx-auto">
            {/* Signature Kiaan AI Featured Interaction */}
            <div
              id="mobile-signature-kiaan-ai"
              onClick={() => {
                setActiveTab('ai');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative rounded-3xl p-[1px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-600 shadow-xl shadow-amber-500/10 cursor-pointer group"
            >
              <div
                className={`rounded-[23px] p-4.5 flex items-center justify-between ${
                  isDark ? 'bg-[#0B101E]' : 'bg-amber-50/90'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm tracking-wide text-amber-400 dark:text-amber-400 text-amber-900">
                        Kiaan AI Concierge
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Signature
                      </span>
                    </div>
                    <p className="text-[11px] opacity-75 mt-0.5">
                      Private AI consultation, valuations & bespoke matching
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-amber-400 shrink-0 ml-2" />
              </div>
            </div>

            {/* Core Navigation Links: Buy, Rent, Projects, Sell */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/80 px-1">
                Residences & Portfolios
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* Buy */}
                <button
                  id="mobile-drawer-buy"
                  onClick={() => handleModeSelect('BUY')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeTab === 'explore' && mode === 'BUY'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold shadow-sm'
                      : isDark
                      ? 'bg-white/[0.03] border-white/10 text-white/90 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-serif text-lg font-bold block">Buy</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">Ultra-luxury estates & penthouses</span>
                </button>

                {/* Rent */}
                <button
                  id="mobile-drawer-rent"
                  onClick={() => handleModeSelect('RENT_LEASE')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeTab === 'explore' && mode === 'RENT_LEASE'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold shadow-sm'
                      : isDark
                      ? 'bg-white/[0.03] border-white/10 text-white/90 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-serif text-lg font-bold block">Rent</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">Prime furnished residences</span>
                </button>

                {/* Projects */}
                <button
                  id="mobile-drawer-projects"
                  onClick={handleProjectsSelect}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/[0.03] border-white/10 text-white/90 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-serif text-lg font-bold block">Projects</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">Signature master developments</span>
                </button>

                {/* Developers */}
                <button
                  id="mobile-drawer-developers"
                  onClick={() => {
                    setActiveTab('developers');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeTab === 'developers' || activeTab === 'developer-profile'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold shadow-sm'
                      : isDark
                      ? 'bg-white/[0.03] border-white/10 text-white/90 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-serif text-lg font-bold block">Developers</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">Builder directory & track records</span>
                </button>

                {/* Localities */}
                <button
                  id="mobile-drawer-localities"
                  onClick={() => {
                    setActiveTab('localities');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeTab === 'localities' || activeTab === 'locality-page'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold shadow-sm'
                      : isDark
                      ? 'bg-white/[0.03] border-white/10 text-white/90 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-serif text-lg font-bold block">Localities</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">Micro-market intelligence & discovery</span>
                </button>

                {/* Sell */}
                <button
                  id="mobile-drawer-sell"
                  onClick={handleSellSelect}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/[0.03] border-white/10 text-white/90 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-serif text-lg font-bold block">Sell</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">Private client asset onboarding</span>
                </button>
              </div>
            </div>

            {/* Client Utility & Advisory Suite */}
            <div className="space-y-2 border-t border-white/[0.08] dark:border-white/[0.08] border-slate-200 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/80 px-1">
                Client Tools & Advisory
              </p>

              <div className="space-y-1">
                {/* Saved Residences */}
                <button
                  onClick={() => {
                    setActiveTab('vip');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium">Saved Residences & Shortlist</span>
                  </div>
                  {savedCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-bold">
                      {savedCount} Saved
                    </span>
                  ) : (
                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                  )}
                </button>

                {/* Visitor & VIP Sign In / Account */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onOpenLoginModal) {
                        onOpenLoginModal();
                      } else {
                        setActiveTab('vip');
                      }
                    }}
                    className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {userSession ? (
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <UserPlus className="w-4 h-4 text-amber-400" />
                      )}
                      <div>
                        <span className="text-sm font-medium block">
                          {userSession
                            ? `${userSession.name} (${userSession.role === 'VISITOR' ? 'Visitor' : userSession.role === 'CUSTOMER' ? 'VIP Client' : 'Admin'})`
                            : 'Visitor Sign In / Create Account'}
                        </span>
                        <span className="text-[10px] opacity-60">
                          {userSession ? 'Tap to switch profile or re-authenticate' : 'Instant visitor registration, OTP login & 3D access'}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                  </button>
                  {userSession && onLogout && (
                    <div className="px-3.5 pb-2 flex justify-end">
                      <button
                        onClick={() => {
                          onLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-[11px] font-bold text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out of {userSession.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Calculators */}
                <button
                  onClick={() => {
                    setActiveTab('finance');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-sm font-medium block">Calculators & Tax Shield</span>
                      <span className="text-[10px] opacity-60">EMI, Stamp Duty & Wealth Projections</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>

                {/* Compare */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenComparisonTray) onOpenComparisonTray();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-sm font-medium block">Compare Residences</span>
                      <span className="text-[10px] opacity-60">Side-by-side unit & floor plan matrix</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>

                {/* Family Room */}
                <button
                  onClick={() => {
                    setActiveTab('family');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-sm font-medium block">Family Decision Room™</span>
                      <span className="text-[10px] opacity-60">Collaborative voting & private discussion</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>

                {/* MahaRERA Compliance */}
                <button
                  onClick={() => {
                    setActiveTab('rera');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-sm font-medium block">MahaRERA Compliance Suite</span>
                      <span className="text-[10px] opacity-60">Reg. No: <strong className="text-amber-400">A031262603640</strong> • Escrow & Title Audits</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>

                {/* Project Schema Suite & Wizard */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenProjectSchemaSuite) onOpenProjectSchemaSuite();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 text-amber-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-sm font-semibold flex items-center gap-1.5">
                        <span>Project Schema Suite & Wizard</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-black font-mono font-bold">29 SECTIONS</span>
                      </span>
                      <span className="text-[10px] opacity-75">Listing Quality Score, Cost Engine & Custom Fields</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                </button>

                {/* WhatsApp Onboarding */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenWhatsAppOnboarding) {
                      onOpenWhatsAppOnboarding('PROPERTY');
                    } else {
                      window.open('https://wa.me/917796655556?text=Hi%20Kiaan%2C%20I%20want%20to%20add%20a%20property%20or%20project.', '_blank');
                    }
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer border border-emerald-500/20"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-sm font-medium block">+ Add via WhatsApp</span>
                      <span className="text-[10px] opacity-80">Property & Project assisted onboarding</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-40" />
                </button>

                {/* Legal Doc Center */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenDocCenter) onOpenDocCenter();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-sm font-medium block">Legal Document Center</span>
                      <span className="text-[10px] opacity-60">Title deeds, sanctions & AI explainer</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>

                {/* Kiaan Journal & Blog */}
                <button
                  onClick={() => {
                    setActiveTab('blog');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer bg-amber-500/10 border border-amber-500/20 text-amber-400"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-sm font-medium block">Kiaan Journal & Market Blog</span>
                      <span className="text-[10px] opacity-75">Research reports, FEMA guides & tax insights</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>

                {/* Careers & Talent Hub */}
                <button
                  onClick={() => {
                    setActiveTab('careers');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between bg-gradient-to-r from-red-500/15 via-amber-500/10 to-transparent border border-amber-500/25 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-sm font-semibold flex items-center gap-1.5">
                        <span>Careers & Talent Hub</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-600 text-white font-mono font-bold">WE'RE HIRING</span>
                      </span>
                      <span className="text-[10px] opacity-75">Luxury Real Estate & Spatial Tech Openings</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>

                {/* NRI Global Desk & Currency */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenNriModal) onOpenNriModal();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-sm font-medium block">NRI Global Desk & Currency</span>
                      <span className="text-[10px] opacity-60">
                        {currency} ({CURRENCY_REGISTRY[currency]?.symbol || '₹'}) • FEMA repatriation
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                </button>
              </div>
            </div>

            {/* Mobile Footer & Theme Switcher */}
            <div className="pt-4 border-t border-white/[0.08] dark:border-white/[0.08] border-slate-200 flex items-center justify-between pb-8">
              <span className="text-xs opacity-60">Display Appearance</span>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl border border-white/10 dark:border-white/10 border-slate-200 text-xs font-bold flex items-center gap-2 hover:bg-white/10 cursor-pointer"
              >
                <span>{isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

