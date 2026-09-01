/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  RotateCcw,
  Bell,
  Sliders,
  ShieldCheck,
  Smartphone,
  Mail,
  MessageSquare,
  X,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import {
  AbandonedJourneyState,
  ConsentSettings,
  JourneyPassportStep,
  SmartNotification,
} from '../types';
import { globalCustomerJourneyStore } from '../services/customerJourneyStore';

interface CustomerJourneyPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  theme?: 'dark' | 'light';
}

export const CustomerJourneyPassportModal: React.FC<CustomerJourneyPassportModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  theme = 'dark',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'PASSPORT' | 'RESUME' | 'NOTIFICATIONS' | 'CONSENT'>('PASSPORT');
  const [steps, setSteps] = useState<JourneyPassportStep[]>([]);
  const [abandonedState, setAbandonedState] = useState<AbandonedJourneyState | null>(null);
  const [consent, setConsent] = useState<ConsentSettings>(globalCustomerJourneyStore.getConsentSettings());
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSteps(globalCustomerJourneyStore.getPassportSteps());
      setAbandonedState(globalCustomerJourneyStore.getAbandonedState());
      setConsent(globalCustomerJourneyStore.getConsentSettings());
      setNotifications(globalCustomerJourneyStore.getNotifications());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleUpdateConsent = (updates: Partial<ConsentSettings>) => {
    globalCustomerJourneyStore.updateConsentSettings(updates);
    setConsent(globalCustomerJourneyStore.getConsentSettings());
    setSaveToast('Notification & privacy preferences updated.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleResumeAbandoned = () => {
    if (abandonedState && onNavigateTab) {
      if (abandonedState.flowType === 'COMPARISON') {
        onNavigateTab('compare');
      } else if (abandonedState.flowType === 'SITE_VISIT') {
        onNavigateTab('explore');
      } else if (abandonedState.flowType === 'OFFER') {
        onNavigateTab('vip');
      } else {
        onNavigateTab('explore');
      }
      onClose();
    }
  };

  const handleStepAction = (step: JourneyPassportStep) => {
    if (step.actionTab && onNavigateTab) {
      onNavigateTab(step.actionTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#080D1A] border-amber-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold tracking-wide">My Property Journey Passport™</h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  Item 101 - 105
                </span>
              </div>
              <p className="text-xs opacity-60">
                Track your VIP journey milestones from initial discovery to statutory escrow booking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-current/10 opacity-60 hover:opacity-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOAST */}
        {saveToast && (
          <div className="bg-emerald-500 text-black text-xs font-bold py-1.5 px-4 text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* SUB-TABS */}
        <div className="flex border-b border-current/10 p-2 gap-1 bg-current/[0.02] flex-shrink-0 overflow-x-auto no-scrollbar">
          {[
            { key: 'PASSPORT', label: '10-Step Journey Passport', icon: Compass },
            { key: 'RESUME', label: 'Continue Where You Left Off', icon: RotateCcw, badge: abandonedState ? '1 Active' : null },
            { key: 'NOTIFICATIONS', label: 'Smart Alerts Hub', icon: Bell, badge: notifications.filter((n) => !n.isRead).length || null },
            { key: 'CONSENT', label: 'Consent & Channel Preferences', icon: Sliders },
          ].map((tab) => {
            const isSelected = activeSubTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md'
                    : isDark
                    ? 'hover:bg-white/5 text-white/70'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-extrabold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 10-STEP JOURNEY PASSPORT */}
          {activeSubTab === 'PASSPORT' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                    VIP Customer Journey Progress
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    Your acquisition passport tracks milestones, consensus, site visits, and term sheet executions.
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-serif text-xl font-bold text-amber-400">
                    {steps.filter((s) => s.status === 'COMPLETED').length} / {steps.length}
                  </span>
                  <span className="text-[10px] opacity-60 block uppercase">Milestones Completed</span>
                </div>
              </div>

              {/* TIMELINE LIST */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-current/10">
                {steps.map((step) => {
                  const isCompleted = step.status === 'COMPLETED';
                  const isInProgress = step.status === 'IN_PROGRESS';
                  const isLocked = step.status === 'LOCKED';

                  return (
                    <div
                      key={step.id}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        isCompleted
                          ? isDark
                            ? 'bg-emerald-500/5 border-emerald-500/30 text-white'
                            : 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                          : isInProgress
                          ? isDark
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                            : 'bg-amber-50 border-amber-400 text-slate-900 shadow-md'
                          : isDark
                          ? 'bg-white/[0.02] border-white/5 opacity-50'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      {/* NODE ICON ON TIMELINE */}
                      <div
                        className={`absolute -left-6 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-500 text-black shadow-md'
                            : isInProgress
                            ? 'bg-amber-500 text-black animate-pulse shadow-md'
                            : 'bg-current/20 text-current'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : isLocked ? <Lock className="w-3 h-3" /> : step.stepNumber}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm">{step.title}</h4>
                            <span
                              className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : isInProgress
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-current/10 opacity-60'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                          <p className="text-xs opacity-70 mt-1">{step.description}</p>
                        </div>

                        {step.actionLabel && (
                          <button
                            onClick={() => handleStepAction(step)}
                            disabled={isLocked}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                                : isInProgress
                                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                                : 'bg-current/5 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <span>{step.actionLabel}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CONTINUE WHERE YOU LEFT OFF (Item 104) */}
          {activeSubTab === 'RESUME' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {abandonedState ? (
                <div
                  className={`p-6 rounded-3xl border ${
                    isDark ? 'bg-amber-500/10 border-amber-500/40 text-white' : 'bg-amber-50 border-amber-400 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Active Session Recovery</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold">{abandonedState.targetTitle}</h3>
                  <p className="text-xs opacity-75 mt-1 leading-relaxed">{abandonedState.resumePromptText}</p>

                  <div className="flex items-center gap-3 text-xs opacity-60 mt-4 pt-4 border-t border-current/10">
                    <span>Flow: <strong>{abandonedState.flowType}</strong></span>
                    <span>•</span>
                    <span>Last active: {abandonedState.lastActivityTimestamp}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={handleResumeAbandoned}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{abandonedState.resumeActionLabel}</span>
                    </button>
                    <button
                      onClick={() => {
                        globalCustomerJourneyStore.clearAbandonedState();
                        setAbandonedState(null);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-bold transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 opacity-60">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                  <h4 className="font-bold text-sm">All Active Sessions Up to Date</h4>
                  <p className="text-xs max-w-sm mx-auto">
                    You have no pending incomplete comparisons or booking drafts.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SMART NOTIFICATIONS (Item 105) */}
          {activeSubTab === 'NOTIFICATIONS' && (
            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-current/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Smart Transaction & Inventory Alerts
                </h3>
                <span className="text-[11px] opacity-60">
                  Real-time updates on price revisions, new penthouse releases & slab completions
                </span>
              </div>

              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => globalCustomerJourneyStore.markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all cursor-pointer ${
                    !notif.isRead
                      ? isDark
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-amber-50 border-amber-400 text-slate-900'
                      : isDark
                      ? 'bg-white/[0.02] border-white/5 opacity-70'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs">{notif.title}</h4>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-current/10">
                          {notif.channel}
                        </span>
                      </div>
                      <p className="text-xs opacity-75 mt-1 leading-relaxed">{notif.body}</p>
                      <span className="text-[10px] opacity-50 block mt-2">{notif.timestamp}</span>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CONSENT & CHANNEL PREFERENCES (Item 103) */}
          {activeSubTab === 'CONSENT' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                    Consent & Communication Channels
                  </h4>
                  <p className="text-xs opacity-70 mt-0.5">
                    Configure your direct update channels. We never spam and maintain strict privacy.
                  </p>
                </div>
                <button
                  onClick={() => handleUpdateConsent({ consentGiven: !consent.consentGiven })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    consent.consentGiven
                      ? 'bg-emerald-500 text-black'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {consent.consentGiven ? 'Consented ✓' : 'Opted Out'}
                </button>
              </div>

              {/* CHANNELS */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                  Active Delivery Channels
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'pushEnabled', label: 'Push Notifications', icon: Smartphone, desc: 'Instant price and inventory alerts in browser' },
                    { key: 'emailEnabled', label: 'Email Briefs', icon: Mail, desc: 'Weekly curated market reports & cost sheets' },
                    { key: 'whatsappEnabled', label: 'WhatsApp Concierge', icon: MessageSquare, desc: 'Direct updates from dedicated relationship manager' },
                    { key: 'smsEnabled', label: 'Statutory SMS', icon: Bell, desc: 'MahaRERA milestone demand alerts & receipts' },
                  ].map((ch) => {
                    const isEnabled = (consent as any)[ch.key];
                    const Icon = ch.icon;
                    return (
                      <div
                        key={ch.key}
                        onClick={() => handleUpdateConsent({ [ch.key]: !isEnabled })}
                        className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all cursor-pointer ${
                          isEnabled
                            ? isDark
                              ? 'bg-amber-500/10 border-amber-500 text-white'
                              : 'bg-amber-50 border-amber-400 text-slate-900'
                            : isDark
                            ? 'bg-white/[0.02] border-white/5 opacity-50'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isEnabled ? 'bg-amber-500 text-black' : 'bg-current/10'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-xs">{ch.label}</h4>
                          <p className="text-[11px] opacity-60 mt-0.5">{ch.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FREQUENCY */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                  Notification Frequency
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['INSTANT', 'DAILY_DIGEST', 'WEEKLY_BRIEF', 'NEVER'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => handleUpdateConsent({ frequency: freq })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        consent.frequency === freq
                          ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {freq.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
