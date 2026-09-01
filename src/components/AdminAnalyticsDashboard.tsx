/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Search,
  Eye,
  Bookmark,
  Share2,
  FileText,
  Calendar,
  DollarSign,
  Lock,
  CheckCircle2,
  Bot,
  Activity,
  Layers,
  RefreshCw,
  Sliders,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { StructuredAnalyticsEvent, WebsiteAnalyticsDashboardMetrics } from '../types';
import { analyticsEngine } from '../services/analyticsStore';

interface AdminAnalyticsDashboardProps {
  theme?: 'dark' | 'light';
  onClose?: () => void;
}

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({
  theme = 'dark',
  onClose,
}) => {
  const isDark = theme === 'dark';
  const [metrics, setMetrics] = useState<WebsiteAnalyticsDashboardMetrics>(analyticsEngine.getMetrics());
  const [events, setEvents] = useState<StructuredAnalyticsEvent[]>(analyticsEngine.getEvents());
  const [filterEventName, setFilterEventName] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = analyticsEngine.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
      setMetrics(analyticsEngine.getMetrics());
    });
    return unsubscribe;
  }, []);

  const filteredEvents = events.filter((evt) => {
    if (filterEventName !== 'ALL' && evt.eventName !== filterEventName) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.eventName.toLowerCase().includes(q) ||
        evt.entity?.name.toLowerCase().includes(q) ||
        evt.user_session.userName?.toLowerCase().includes(q) ||
        evt.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border space-y-10 animate-fade-in ${
      isDark ? 'bg-[#070A0F] text-white border-white/10' : 'bg-slate-50 text-slate-900 border-slate-200'
    }`}>
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-current/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME FIRST-PARTY TELEMETRY & EVENT MODEL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold">Admin Platform Analytics</h2>
          <p className="text-xs opacity-70">
            Comprehensive telemetry across Discovery, User Engagement, Transaction Intent, and Real-Time Concurrency Holds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              analyticsEngine.trackEvent('page_view', undefined, { page: 'ADMIN_ANALYTICS_MANUAL_PING' });
            }}
            className="px-4 py-2.5 rounded-xl border border-current/15 text-xs font-mono font-bold flex items-center gap-2 hover:bg-current/5 cursor-pointer transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Telemetry Event</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR CORE TELEMETRY PILLARS (ITEM 120) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pillar 1: DISCOVERY */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0B101C] border-blue-500/20' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-blue-400">1. Discovery</span>
            <Search className="w-4 h-4 text-blue-400" />
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-serif font-bold font-mono">
              {metrics.discovery.totalSearchesCount.toLocaleString()}
            </span>
            <span className="text-[11px] opacity-60 block">Total Search Queries</span>
          </div>

          <div className="pt-3 border-t border-current/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="opacity-70">AI Natural Language:</span>
              <span className="font-bold text-amber-400">{metrics.discovery.aiNaturalLanguageSearchesCount.toLocaleString()}</span>
            </div>
            <div className="space-y-1 pt-1">
              <span className="text-[10px] opacity-50 block uppercase">Top Location:</span>
              <span className="text-xs font-bold text-emerald-400 block truncate">
                {metrics.discovery.topLocationsExplored[0]?.location} (+{metrics.discovery.topLocationsExplored[0]?.growthPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 2: ENGAGEMENT */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0B101C] border-emerald-500/20' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-emerald-400">2. Engagement</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-serif font-bold font-mono">
              {metrics.engagement.totalPageViews.toLocaleString()}
            </span>
            <span className="text-[11px] opacity-60 block">Total Page Impressions</span>
          </div>

          <div className="pt-3 border-t border-current/10 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] opacity-50 block">Saved:</span>
              <span className="font-bold text-emerald-400">{metrics.engagement.propertiesSavedCount}</span>
            </div>
            <div>
              <span className="text-[10px] opacity-50 block">Compare:</span>
              <span className="font-bold text-blue-400">{metrics.engagement.comparisonsCreatedCount}</span>
            </div>
            <div>
              <span className="text-[10px] opacity-50 block">AI Chats:</span>
              <span className="font-bold text-purple-400">{metrics.engagement.aiConversationsCount}</span>
            </div>
            <div>
              <span className="text-[10px] opacity-50 block">PDFs:</span>
              <span className="font-bold text-amber-400">{metrics.engagement.pdfDossiersDownloadedCount}</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: INTENT */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0B101C] border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-amber-500">3. Purchase Intent</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-serif font-bold font-mono text-amber-500">
              {metrics.intent.vipSiteVisitsRequestedCount}
            </span>
            <span className="text-[11px] opacity-60 block">Maybach VIP Site Visits</span>
          </div>

          <div className="pt-3 border-t border-current/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="opacity-70">Formal Digital Offers:</span>
              <span className="font-bold text-amber-400">{metrics.intent.formalOffersSubmittedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">Active 15-Min Holds:</span>
              <span className="font-bold text-emerald-400">{metrics.intent.activeHoldsCount} Active</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: TRANSACTION */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0B101C] border-purple-500/20' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-purple-400">4. Transactions</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-serif font-bold font-mono text-emerald-400">
              ₹{(metrics.transaction.totalBookingValueINR / 10000000).toFixed(2)} Cr
            </span>
            <span className="text-[11px] opacity-60 block">Total Completed Booking Value</span>
          </div>

          <div className="pt-3 border-t border-current/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="opacity-70">Completed Bookings:</span>
              <span className="font-bold text-emerald-400">{metrics.transaction.bookingsCompletedCount} Units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">Escrow Audited Payouts:</span>
              <span className="font-bold text-purple-400">₹{(metrics.transaction.tokenDisbursementsAuditedINR / 100000).toFixed(0)}L</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STRUCTURED ANALYTICS EVENT STREAM (ITEM 121) */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
        isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-lg'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-current/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif font-bold text-lg">Live Structured Event Stream (Schema v1.2)</h3>
            </div>
            <p className="text-xs opacity-70">
              Deterministic event payload log capturing session identifiers, user role contexts, statutory consent state, and entity metadata.
            </p>
          </div>

          {/* Event Search / Filter */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event ID, user, or entity..."
              className={`py-1.5 px-3 rounded-xl border text-xs outline-none ${
                isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Event List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-current/10 opacity-60 text-[10px] uppercase">
                <th className="pb-3">Event ID & Timestamp</th>
                <th className="pb-3">Event Name</th>
                <th className="pb-3">User & Session Context</th>
                <th className="pb-3">Target Entity</th>
                <th className="pb-3">Payload Metadata</th>
                <th className="pb-3">Consent & Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/10">
              {filteredEvents.map((evt) => (
                <tr key={evt.event_id} className="hover:bg-current/5 transition-colors">
                  <td className="py-3 whitespace-nowrap">
                    <span className="font-bold text-amber-500 block">{evt.event_id}</span>
                    <span className="text-[10px] opacity-50 block">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </td>

                  <td className="py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      evt.eventName.includes('booking')
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : evt.eventName.includes('offer')
                        ? 'bg-amber-500/20 text-amber-400'
                        : evt.eventName.includes('held')
                        ? 'bg-purple-500/20 text-purple-400'
                        : evt.eventName.includes('visit')
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-current/10 opacity-80'
                    }`}>
                      {evt.eventName}
                    </span>
                  </td>

                  <td className="py-3">
                    <span className="font-bold block truncate max-w-[140px]">
                      {evt.user_session.userName || 'Anonymous User'}
                    </span>
                    <span className="text-[10px] opacity-50 block">{evt.user_session.sessionId}</span>
                  </td>

                  <td className="py-3">
                    {evt.entity ? (
                      <div>
                        <span className="font-bold block truncate max-w-[160px]">{evt.entity.name}</span>
                        {evt.entity.valueINR && (
                          <span className="text-[10px] text-amber-400 block font-bold">
                            ₹{(evt.entity.valueINR / 100000).toFixed(0)}L
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="opacity-40">-</span>
                    )}
                  </td>

                  <td className="py-3">
                    <pre className="text-[10px] opacity-75 max-w-[200px] truncate">
                      {JSON.stringify(evt.metadata)}
                    </pre>
                  </td>

                  <td className="py-3 whitespace-nowrap">
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      {evt.user_session.consentState}
                    </span>
                    <span className="text-[9px] opacity-50 block">{evt.source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
