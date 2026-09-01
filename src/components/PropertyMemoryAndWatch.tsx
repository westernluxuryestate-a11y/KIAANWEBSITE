/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  Clock,
  Eye,
  Bell,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Layers,
  Zap,
  Sliders,
  Mail,
  Smartphone,
  Check,
} from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/seedData';

interface PropertyMemoryAndWatchProps {
  onOpenProjectExperience?: (projectId: string) => void;
  onOpenDigitalTwin?: (project: Project, unitId?: string) => void;
}

interface WatchedProperty {
  id: string;
  project: Project;
  watchDate: string;
  alertTriggers: {
    priceDrop: boolean;
    inventoryChange: boolean;
    constructionMilestone: boolean;
    exclusiveOffers: boolean;
  };
  recentUpdate?: {
    type: 'PRICE_UPDATE' | 'INVENTORY_RELEASE' | 'CONSTRUCTION_MILESTONE';
    description: string;
    date: string;
  };
}

export const PropertyMemoryAndWatch: React.FC<PropertyMemoryAndWatchProps> = ({
  onOpenProjectExperience,
  onOpenDigitalTwin,
}) => {
  const [activeTab, setActiveTab] = useState<'MEMORY' | 'WATCH_ALERTS'>('MEMORY');

  // Welcome back / Recent History State
  const recentViews = [
    {
      project: INITIAL_PROJECTS[0],
      viewedAt: 'Today, 10:45 AM',
      interactionType: 'Digital Twin 3D Inspection & Sunlight Analysis',
      priceChangeNote: 'Base price unchanged since last visit (₹1.48 Cr)',
      newUnitsCount: 2,
    },
    {
      project: INITIAL_PROJECTS[1] || INITIAL_PROJECTS[0],
      viewedAt: 'Yesterday, 4:20 PM',
      interactionType: 'Statutory MahaRERA Escrow Verification',
      priceChangeNote: '1 New Sky Deck Unit Released in Tower B',
      newUnitsCount: 1,
    },
  ];

  // Property Watch Notifications State
  const [watchedList, setWatchedList] = useState<WatchedProperty[]>([
    {
      id: 'watch-1',
      project: INITIAL_PROJECTS[0],
      watchDate: 'Aug 24, 2026',
      alertTriggers: {
        priceDrop: true,
        inventoryChange: true,
        constructionMilestone: true,
        exclusiveOffers: true,
      },
      recentUpdate: {
        type: 'CONSTRUCTION_MILESTONE',
        description: 'Level 24 slab casting completed 12 days ahead of schedule.',
        date: '2 days ago',
      },
    },
    {
      id: 'watch-2',
      project: INITIAL_PROJECTS[1] || INITIAL_PROJECTS[0],
      watchDate: 'Aug 18, 2026',
      alertTriggers: {
        priceDrop: true,
        inventoryChange: true,
        constructionMilestone: false,
        exclusiveOffers: true,
      },
      recentUpdate: {
        type: 'INVENTORY_RELEASE',
        description: '3.5 BHK East Facing Penthouse released on 31st floor.',
        date: 'Yesterday',
      },
    },
  ]);

  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [whatsappAlertsEnabled, setWhatsappAlertsEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleTrigger = (watchId: string, triggerKey: keyof WatchedProperty['alertTriggers']) => {
    setWatchedList((prev) =>
      prev.map((item) =>
        item.id === watchId
          ? {
              ...item,
              alertTriggers: {
                ...item.alertTriggers,
                [triggerKey]: !item.alertTriggers[triggerKey],
              },
            }
          : item
      )
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="property-memory-watch">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0A1222] via-[#070D18] to-[#03060C] border border-blue-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Property Memory™ & Real-Time Watch Alerts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Welcome Back! Continuous Journey Tracking & Price Telemetry
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Pick up precisely where you left off. Review digital twins previously explored, newly released floor elevations, construction progress updates, and statutory notifications.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-2 pt-6 border-t border-white/10 relative z-10">
          <button
            onClick={() => setActiveTab('MEMORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'MEMORY'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Recently Viewed & Price Changes ({(recentViews || []).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('WATCH_ALERTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'WATCH_ALERTS'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Property Watch Triggers ({(watchedList || []).length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROPERTY MEMORY (Welcome back, previously viewed, price delta) */}
      {activeTab === 'MEMORY' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(recentViews || []).map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-5 hover:border-blue-500/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                        <img src={item.project.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'} alt={item.project.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                          {item.project.location.microMarket}
                        </span>
                        <h3 className="text-base font-bold text-white leading-tight">{item.project.name}</h3>
                        <span className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          Viewed {item.viewedAt}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      +{item.newUnitsCount} New Units
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-xs">
                    <div className="text-white/80 font-medium">{item.interactionType}</div>
                    <div className="text-amber-300 font-semibold">{item.priceChangeNote}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-base font-bold text-white">
                    {formatINR(item.project.headlinePriceRange.min)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDigitalTwin && onOpenDigitalTwin(item.project)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      Digital Twin
                    </button>
                    <button
                      onClick={() => onOpenProjectExperience && onOpenProjectExperience(item.project.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Resume</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTY WATCH NOTIFICATIONS */}
      {activeTab === 'WATCH_ALERTS' && (
        <div className="space-y-6 animate-fade-in">
          {/* Global Channel Settings */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Direct Intelligence Dispatch Channels</h4>
              <p className="text-xs text-white/50">Instant alerts for price reductions, unit cancellations, and RERA updates</p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-white/80">
                <input
                  type="checkbox"
                  checked={emailAlertsEnabled}
                  onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                  className="rounded text-amber-500 accent-amber-500"
                />
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Digest</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-white/80">
                <input
                  type="checkbox"
                  checked={whatsappAlertsEnabled}
                  onChange={(e) => setWhatsappAlertsEnabled(e.target.checked)}
                  className="rounded text-emerald-500 accent-emerald-500"
                />
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp VIP Desk</span>
              </label>
            </div>
          </div>

          {/* Watched Cards List */}
          <div className="space-y-4">
            {(watchedList || []).map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-4 hover:border-amber-500/30 transition-all shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={item.project.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                        alt={item.project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{item.project.name}</h3>
                      <p className="text-xs text-white/50">Watching since {item.watchDate} • {item.project.location.microMarket}</p>
                    </div>
                  </div>

                  {item.recentUpdate && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.recentUpdate.description} ({item.recentUpdate.date})</span>
                    </div>
                  )}
                </div>

                {/* Granular Trigger Toggles */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-white/40 uppercase font-bold text-[10px]">Active Triggers:</span>
                  {[
                    { key: 'priceDrop', label: 'Price Reductions' },
                    { key: 'inventoryChange', label: 'New Inventory & Deck Releases' },
                    { key: 'constructionMilestone', label: 'MahaRERA Construction Milestones' },
                    { key: 'exclusiveOffers', label: 'Pre-Launch Builder Offers' },
                  ].map((trig) => {
                    const isActive = item.alertTriggers[trig.key as keyof WatchedProperty['alertTriggers']];
                    return (
                      <button
                        key={trig.key}
                        onClick={() => toggleTrigger(item.id, trig.key as any)}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                            : 'bg-white/[0.02] border border-white/5 text-white/40 hover:text-white'
                        }`}
                      >
                        {isActive ? <Check className="w-3 h-3 text-amber-400" /> : <Sliders className="w-3 h-3 opacity-40" />}
                        <span>{trig.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
