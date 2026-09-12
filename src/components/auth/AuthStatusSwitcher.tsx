/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  ChevronUp,
  ChevronDown,
  Crown,
  ShieldCheck,
  Sparkles,
  LogOut,
  KeyRound,
  Check,
  Eye,
} from 'lucide-react';
import { UserSession } from '../../types';
import { PROVISIONED_ADMIN_ACCOUNTS } from '../../services/adminAuthService';

interface AuthStatusSwitcherProps {
  currentSession: UserSession | null;
  onSelectSession: (session: UserSession | null) => void;
  onOpenLoginModal: () => void;
}

export const AuthStatusSwitcher: React.FC<AuthStatusSwitcherProps> = ({
  currentSession,
  onSelectSession,
  onOpenLoginModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Quick switch presets
  const handleSwitchToVisitor = () => {
    onSelectSession(null);
    setIsExpanded(false);
  };

  const handleSwitchToRajeshVip = () => {
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
    onSelectSession(session);
    setIsExpanded(false);
  };

  const handleSwitchToPriyaNri = () => {
    const session: UserSession = {
      userId: 'usr_priya_sharma_02',
      name: 'Priya Sharma (NRI)',
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
    onSelectSession(session);
    setIsExpanded(false);
  };

  const handleSwitchToAdmin = () => {
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
    onSelectSession(session);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 font-sans">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-2 p-3 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/20 shadow-2xl w-72 text-white space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Auth Status Sandbox
            </span>
            <span className="text-[10px] text-white/50">Test UI States</span>
          </div>

          <div className="space-y-1">
            {/* Option 1: Logged Out (Public Visitor) */}
            <button
              onClick={handleSwitchToVisitor}
              className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                !currentSession
                  ? 'bg-white/15 text-white font-bold border border-white/20'
                  : 'hover:bg-white/5 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <div>
                  <div className="font-semibold">Public Visitor</div>
                  <div className="text-[10px] text-white/50">Logged Out / Discovery Only</div>
                </div>
              </div>
              {!currentSession && <Check className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Option 2: Rajesh VIP */}
            <button
              onClick={handleSwitchToRajeshVip}
              className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                currentSession?.role === 'CUSTOMER' && currentSession.name.includes('Rajesh')
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'hover:bg-white/5 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <div className="font-semibold text-white">Rajesh Malhotra</div>
                  <div className="text-[10px] text-amber-300/70">Diamond VIP Investor</div>
                </div>
              </div>
              {currentSession?.role === 'CUSTOMER' && currentSession.name.includes('Rajesh') && (
                <Check className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Option 3: Priya NRI */}
            <button
              onClick={handleSwitchToPriyaNri}
              className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                currentSession?.role === 'CUSTOMER' && currentSession.name.includes('Priya')
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'hover:bg-white/5 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <div>
                  <div className="font-semibold text-white">Priya Sharma</div>
                  <div className="text-[10px] text-purple-300/70">NRI Tech Executive</div>
                </div>
              </div>
              {currentSession?.role === 'CUSTOMER' && currentSession.name.includes('Priya') && (
                <Check className="w-4 h-4 text-purple-400" />
              )}
            </button>

            {/* Option 4: Super Admin */}
            <button
              onClick={handleSwitchToAdmin}
              className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                currentSession?.role === 'SUPER_ADMIN' || currentSession?.role === 'ADMIN'
                  ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                  : 'hover:bg-white/5 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <div>
                  <div className="font-semibold text-white">Western Luxury Admin</div>
                  <div className="text-[10px] text-red-300/70">Super Admin / Full Clearance</div>
                </div>
              </div>
              {(currentSession?.role === 'SUPER_ADMIN' || currentSession?.role === 'ADMIN') && (
                <Check className="w-4 h-4 text-red-400" />
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenLoginModal();
              }}
              className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Full Login UI</span>
            </button>
            {currentSession && (
              <button
                onClick={handleSwitchToVisitor}
                className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300 text-[11px] flex items-center justify-center transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-3 py-2 rounded-full shadow-2xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
          currentSession
            ? currentSession.role === 'SUPER_ADMIN' || currentSession.role === 'ADMIN'
              ? 'bg-red-950/80 hover:bg-red-900/90 text-red-200 border-red-500/40 shadow-red-950/50'
              : 'bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border-amber-500/40 shadow-amber-950/50'
            : 'bg-slate-900/85 hover:bg-slate-850 text-white border-white/20 shadow-black/50'
        }`}
        title="Toggle Auth Persona & Status Switcher"
      >
        <div className="flex items-center gap-1.5">
          {currentSession ? (
            currentSession.role === 'SUPER_ADMIN' || currentSession.role === 'ADMIN' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            )
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-400" />
          )}

          <span className="font-mono text-[11px]">
            {currentSession
              ? `Status: ${currentSession.name.split(' ')[0]} (${currentSession.role === 'CUSTOMER' ? 'VIP' : 'Admin'})`
              : 'Status: Public Visitor'}
          </span>
        </div>

        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronUp className="w-3.5 h-3.5 opacity-60" />}
      </button>
    </div>
  );
};
