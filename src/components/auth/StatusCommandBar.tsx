/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Crown,
  Sparkles,
  Lock,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  LogOut,
  FolderLock,
  Bookmark,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { UserSession } from '../../types';

interface StatusCommandBarProps {
  theme?: 'dark' | 'light';
  session: UserSession | null;
  savedCount?: number;
  onOpenLogin: () => void;
  onOpenVipLounge: () => void;
  onOpenAdminCms: () => void;
  onQuickDemoLogin: () => void;
  onLogout: () => void;
}

export const StatusCommandBar: React.FC<StatusCommandBarProps> = ({
  theme = 'dark',
  session,
  savedCount = 0,
  onOpenLogin,
  onOpenVipLounge,
  onOpenAdminCms,
  onQuickDemoLogin,
  onLogout,
}) => {
  const isDark = theme === 'dark';

  // 1. Logged Out: Visitor State Banner
  if (!session) {
    return (
      <aside aria-label="Portal visitor status" className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-amber-500/20 text-white py-2.5 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Left: Mode tag */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 font-mono text-[11px] font-semibold border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Public Discovery Mode
            </span>
            <span className="text-white/60 hidden sm:inline">•</span>
            <span className="text-white/70">
              Browsing public luxury portfolio (18 Projects • 42 Resale Properties)
            </span>
          </div>

          {/* Right: VIP Teaser & CTA */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <div className="hidden lg:flex items-center gap-1.5 text-amber-300/90 text-[11px] font-medium mr-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign in to unlock institutional pricing & 15-min escrow holds</span>
            </div>

            <button
              onClick={onQuickDemoLogin}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white font-medium text-[11px] transition-all cursor-pointer border border-white/15"
              title="Quickly test the authenticated VIP view"
            >
              ⚡ 1-Click VIP Demo
            </button>

            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>VIP Member Sign In</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // 2. Logged In: Authenticated Member State Banner
  const isSuperAdmin = session.role === 'SUPER_ADMIN' || session.role === 'ADMIN';
  const isVipCustomer = session.role === 'CUSTOMER';

  return (
    <aside aria-label="Portal member status" className={`w-full py-2.5 px-4 sm:px-6 lg:px-8 border-y shadow-sm transition-all ${
      isSuperAdmin
        ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-red-950/40 border-red-500/30 text-white'
        : 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 border-amber-500/30 text-white'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: User Identity & Role Badge */}
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
              isSuperAdmin ? 'bg-red-500 text-white' : 'bg-amber-400 text-black'
            }`}>
              {session.name.charAt(0)}
            </div>
            <span className="font-bold text-white tracking-wide">{session.name}</span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
            isSuperAdmin
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : isVipCustomer
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}>
            {isSuperAdmin ? (
              <>
                <ShieldCheck className="w-3 h-3" />
                <span>Enterprise Admin</span>
              </>
            ) : isVipCustomer ? (
              <>
                <Crown className="w-3 h-3" />
                <span>Diamond VIP Member</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Verified Visitor</span>
              </>
            )}
          </span>

          {/* Unlocked Perks Pill */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/70">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Pricing Active
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <Lock className="w-3.5 h-3.5" /> Escrow Locks Enabled
            </span>
          </div>
        </div>

        {/* Right: Quick Command Actions */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {savedCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-mono text-[11px] flex items-center gap-1 border border-white/10">
              <Bookmark className="w-3 h-3 text-amber-400" />
              <span>{savedCount} Shortlisted</span>
            </span>
          )}

          {isVipCustomer && (
            <button
              onClick={onOpenVipLounge}
              className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>VIP Lounge</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={onOpenAdminCms}
              className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Open CMS</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 font-medium text-[11px] flex items-center gap-1 transition-all border border-white/10 hover:border-red-500/30 cursor-pointer"
            title="Sign out of current account"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
