/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Database,
  ArrowRight,
  Filter,
  Eye,
  Lock,
} from 'lucide-react';
import { CrmEventPayload, CrmIntegrationHealth } from '../types';
import { crmEngine } from '../services/crmIntegrationEngine';

interface CrmIntegrationMonitorProps {
  theme?: 'dark' | 'light';
}

export const CrmIntegrationMonitor: React.FC<CrmIntegrationMonitorProps> = ({
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [events, setEvents] = useState<CrmEventPayload[]>([]);
  const [health, setHealth] = useState<CrmIntegrationHealth>(crmEngine.getHealth());
  const [selectedEvent, setSelectedEvent] = useState<CrmEventPayload | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    const unsubscribe = crmEngine.subscribe(() => {
      const all = crmEngine.getAllEvents();
      setEvents([...all.queue, ...all.dlq]);
      setHealth(crmEngine.getHealth());
    });
    return unsubscribe;
  }, []);

  const handleToggleCrmHealth = () => {
    crmEngine.setCrmEndpointHealth(!health.isAvailable);
    setHealth(crmEngine.getHealth());
  };

  const handleTriggerSampleEvent = (type: any) => {
    crmEngine.dispatchToCrm(type, {
      customerId: 'CUST_DEMO_' + Math.floor(1000 + Math.random() * 9000),
      consentGranted: true,
      contactInfo: {
        name: 'Demo HNI Client',
        phone: '+91 98200 99112',
        email: 'client@demo.com',
        preferredChannel: 'WHATSAPP',
      },
      entity: {
        entityType: 'PROJECT',
        entityId: 'proj-1',
        entityTitle: 'The One Horizon — Sky Villa',
        reraRegistrationNumber: 'P52100028492',
        microMarket: 'Kharadi',
        priceINR: 35000000,
      },
      intentCategory: 'VIP_SITE_VISIT',
      minimalMetadata: { simulated: true, channel: 'WEB_DESKTOP' },
    });
  };

  const filteredEvents = events.filter((e) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'DEAD_LETTER') return e.deliveryStatus === 'DEAD_LETTER';
    if (filterType === 'DELIVERED') return e.deliveryStatus === 'DELIVERED';
    return e.eventType === filterType;
  });

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border space-y-8 animate-fade-in ${
      isDark ? 'bg-[#070A11] text-white border-white/10' : 'bg-slate-50 text-slate-900 border-slate-200'
    }`}>
      {/* 1. HEADER & ARCHITECTURAL RULE NOTICE (ITEM 122) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-current/10">
        <div className="space-y-1 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono">
            <Server className="w-3.5 h-3.5" />
            <span>DECOUPLED API + EVENT INTEGRATION LAYER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">CRM Integration & Outbox Telemetry</h2>
          <p className="text-xs opacity-75 leading-relaxed">
            <strong>Strict Architectural Boundary (Item 122):</strong> The customer-facing website remains strictly separated from internal CRM sales/lead pipelines. Only authorized, data-minimized intent events are dispatched asynchronously via idempotent webhooks.
          </p>
        </div>

        {/* Remote Endpoint Status Switcher */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${health.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-mono font-bold">
              CRM Endpoint: {health.isAvailable ? 'ONLINE (200 OK)' : 'SIMULATED OFFLINE (503)'}
            </span>
          </div>
          <button
            onClick={handleToggleCrmHealth}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
              health.isAvailable
                ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {health.isAvailable ? 'Simulate CRM Outage (Test Queue)' : 'Restore CRM Endpoint'}
          </button>
        </div>
      </div>

      {/* 2. THREE HEALTH METRIC PILLARS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101C] border-blue-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between opacity-60 text-[10px] uppercase">
            <span>Delivered to CRM</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-serif mt-1 text-emerald-400">{health.deliveredCount}</div>
          <div className="text-[10px] opacity-50 mt-1">Idempotency verified</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101C] border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between opacity-60 text-[10px] uppercase">
            <span>Active Outbox Queue</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-serif mt-1 text-amber-400">{health.activeQueueCount}</div>
          <div className="text-[10px] opacity-50 mt-1">Auto-retry with backoff</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101C] border-red-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between opacity-60 text-[10px] uppercase">
            <span>Dead Letter Queue (DLQ)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-serif mt-1 text-red-400">{health.deadLetterCount}</div>
          <button
            onClick={() => crmEngine.retryDeadLetterQueue()}
            disabled={health.deadLetterCount === 0}
            className="text-[10px] text-amber-400 underline font-bold mt-1 cursor-pointer disabled:opacity-30 block"
          >
            Re-drive DLQ Events
          </button>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B101C] border-purple-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between opacity-60 text-[10px] uppercase">
            <span>Data Minimization (Item 124)</span>
            <Lock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-serif mt-1 text-purple-400">100%</div>
          <div className="text-[10px] opacity-50 mt-1">Raw analytics excluded</div>
        </div>
      </div>

      {/* 3. SIMULATE DISPATCH CONTROLS */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-mono opacity-60 mr-2">Trigger Test Event:</span>
        <button
          onClick={() => handleTriggerSampleEvent('LEAD_CREATED')}
          className="px-3 py-1.5 rounded-xl border border-current/15 text-xs font-mono font-bold hover:bg-current/10 cursor-pointer"
        >
          + LEAD_CREATED
        </button>
        <button
          onClick={() => handleTriggerSampleEvent('VISIT_REQUESTED')}
          className="px-3 py-1.5 rounded-xl border border-current/15 text-xs font-mono font-bold hover:bg-current/10 cursor-pointer"
        >
          + VISIT_REQUESTED
        </button>
        <button
          onClick={() => handleTriggerSampleEvent('OFFER_CREATED')}
          className="px-3 py-1.5 rounded-xl border border-current/15 text-xs font-mono font-bold hover:bg-current/10 cursor-pointer"
        >
          + OFFER_CREATED
        </button>
        <button
          onClick={() => handleTriggerSampleEvent('BOOKING_COMPLETED')}
          className="px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs font-mono font-bold hover:bg-emerald-500/20 cursor-pointer"
        >
          + BOOKING_COMPLETED
        </button>
      </div>

      {/* 4. EVENT STREAM & PAYLOAD INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm">CRM Event Outbox & Log Trail</span>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {['ALL', 'DELIVERED', 'DEAD_LETTER'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                    filterType === f ? 'bg-amber-500 text-black font-bold' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-current/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-current/5 border-b border-current/10 text-[10px] uppercase opacity-70">
                <tr>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Delivery Status</th>
                  <th className="p-3">Retries</th>
                  <th className="p-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/10">
                {filteredEvents.map((evt) => (
                  <tr
                    key={evt.eventId}
                    onClick={() => setSelectedEvent(evt)}
                    className={`cursor-pointer transition-colors ${
                      selectedEvent?.eventId === evt.eventId
                        ? 'bg-amber-500/15'
                        : 'hover:bg-current/5'
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-bold text-amber-500 block">{evt.eventType}</span>
                      <span className="text-[10px] opacity-50 block">{evt.idempotencyKey.substring(0, 18)}...</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold block truncate max-w-[160px]">{evt.entityContext.entityTitle}</span>
                      <span className="text-[10px] opacity-50 block">{evt.intentCategory}</span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.deliveryStatus === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : evt.deliveryStatus === 'DEAD_LETTER'
                          ? 'bg-red-500/20 text-red-400'
                          : evt.deliveryStatus === 'RETRYING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {evt.deliveryStatus}
                      </span>
                    </td>

                    <td className="p-3 whitespace-nowrap opacity-75 text-[11px]">
                      {evt.retryCount} / {evt.maxRetries}
                    </td>

                    <td className="p-3 text-right">
                      <Eye className="w-4 h-4 opacity-50 inline hover:opacity-100" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Data Minimization Inspector (Item 124) */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center gap-2 border-b pb-3 border-current/10">
            <Lock className="w-4 h-4 text-purple-400" />
            <h4 className="font-serif font-bold text-sm">Data Minimization Inspector</h4>
          </div>

          {selectedEvent ? (
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-[10px] opacity-50 block uppercase">Event ID & Idempotency Key</span>
                <span className="font-bold text-amber-400 block">{selectedEvent.eventId}</span>
                <span className="text-[10px] opacity-70 block truncate">{selectedEvent.idempotencyKey}</span>
              </div>

              <div>
                <span className="text-[10px] opacity-50 block uppercase">Consent & Contact</span>
                <div className="p-2 rounded bg-current/5 text-[11px]">
                  <div>Consent: {selectedEvent.consentGranted ? 'GRANTED' : 'DECLINED'}</div>
                  {selectedEvent.contactInfo ? (
                    <>
                      <div>Name: {selectedEvent.contactInfo.name}</div>
                      <div>Phone: {selectedEvent.contactInfo.phone}</div>
                      <div>Channel: {selectedEvent.contactInfo.preferredChannel}</div>
                    </>
                  ) : (
                    <div className="text-amber-400 italic">No contact data sent (Data Minimization applied)</div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] opacity-50 block uppercase">Entity Context</span>
                <div className="p-2 rounded bg-current/5 text-[11px]">
                  <div>Title: {selectedEvent.entityContext.entityTitle}</div>
                  <div>RERA: {selectedEvent.entityContext.reraRegistrationNumber || 'N/A'}</div>
                  <div>Intent: {selectedEvent.intentCategory}</div>
                </div>
              </div>

              {selectedEvent.errorMessage && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                  <span className="font-bold block">Delivery Error:</span>
                  {selectedEvent.errorMessage}
                </div>
              )}

              {selectedEvent.crmAcknowledgmentId && (
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
                  <span className="font-bold block">CRM Ack ID:</span>
                  {selectedEvent.crmAcknowledgmentId}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-xs opacity-50 font-mono">
              Select an outbox event from the table to inspect its payload and verified data minimization compliance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
