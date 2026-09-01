/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  Calendar,
  AlertTriangle,
  UserCheck,
  Lock,
  Layers,
  Eye,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AdminAuditActionType, AdminAuditLogEntry } from '../types';
import { adminAuditStore } from '../services/adminAuditStore';

interface AdminAuditLogsViewProps {
  theme?: 'dark' | 'light';
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [logs, setLogs] = useState<AdminAuditLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<AdminAuditLogEntry | null>(null);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = adminAuditStore.subscribe((updated) => {
      setLogs(updated);
      if (!selectedLog && updated.length > 0) {
        setSelectedLog(updated[0]);
      }
    });
    return unsubscribe;
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.name.toLowerCase().includes(q) ||
        log.entity.name.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.reason?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border space-y-8 animate-fade-in ${
      isDark ? 'bg-[#070A11] text-white border-white/10' : 'bg-slate-50 text-slate-900 border-slate-200'
    }`}>
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-current/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
            <History className="w-3.5 h-3.5" />
            <span>IMMUTABLE ENTERPRISE AUDIT TRAIL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Admin Governance & Audit Log</h2>
          <p className="text-xs opacity-70">
            Item 129 Compliance: Cryptographic logging of Price Changes, RERA Modifications, Inventory Locks, Offer Decisions, and Privileged Sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono opacity-60">Total Audited Events:</span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
            {logs.length}
          </span>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'ALL', label: 'All Audits' },
            { id: 'PRICE_CHANGE', label: 'Price Changes' },
            { id: 'RERA_CHANGE', label: 'RERA Changes' },
            { id: 'INVENTORY_CHANGE', label: 'Inventory Locks' },
            { id: 'LOGIN', label: 'Admin Logins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterAction(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
                filterAction === tab.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-current/5 hover:bg-current/10 opacity-70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actor, entity, or reason..."
            className={`w-full py-2 px-3 rounded-xl border text-xs outline-none ${
              isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* 3. LOG LIST & DETAIL DIFF INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table */}
        <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-current/10">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-current/5 border-b border-current/10 text-[10px] uppercase opacity-70">
              <tr>
                <th className="p-3">Timestamp & ID</th>
                <th className="p-3">Action</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/10">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`cursor-pointer transition-colors ${
                    selectedLog?.id === log.id ? 'bg-amber-500/15' : 'hover:bg-current/5'
                  }`}
                >
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-bold text-amber-500 block">{log.id}</span>
                    <span className="text-[10px] opacity-50 block">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'PRICE_CHANGE'
                        ? 'bg-amber-500/20 text-amber-400'
                        : log.action === 'RERA_CHANGE'
                        ? 'bg-blue-500/20 text-blue-400'
                        : log.action === 'INVENTORY_CHANGE'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="font-bold block truncate max-w-[140px]">{log.actor.name}</span>
                    <span className="text-[10px] opacity-50 block">{log.actor.role}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-bold block truncate max-w-[160px]">{log.entity.name}</span>
                    <span className="text-[10px] opacity-50 block">{log.entity.type}</span>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-current/10 opacity-70'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right 1 Col: Before/After State Diff & Mandatory Reason */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#0B101C] border-white/10' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center gap-2 border-b pb-3 border-current/10">
            <History className="w-4 h-4 text-amber-500" />
            <h4 className="font-serif font-bold text-sm">Audit Diff & Rationale</h4>
          </div>

          {selectedLog ? (
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-[10px] opacity-50 block uppercase">Audit Event ID</span>
                <span className="font-bold text-amber-400 block">{selectedLog.id}</span>
                <span className="text-[10px] opacity-60 block">{new Date(selectedLog.timestamp).toLocaleString()}</span>
              </div>

              <div>
                <span className="text-[10px] opacity-50 block uppercase">Mandatory Reason / Rationale</span>
                <p className="p-2.5 rounded-xl bg-current/5 border border-current/10 text-[11px] font-sans leading-relaxed">
                  {selectedLog.reason || 'Standard system event recorded.'}
                </p>
              </div>

              {/* Before vs After Diff */}
              {selectedLog.beforeState && (
                <div>
                  <span className="text-[10px] text-red-400 font-bold block uppercase">State Before:</span>
                  <pre className="p-2 rounded bg-black/40 border border-white/10 text-[10px] text-red-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.beforeState, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.afterState && (
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">State After:</span>
                  <pre className="p-2 rounded bg-black/40 border border-white/10 text-[10px] text-emerald-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.afterState, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-2 border-t border-current/10 text-[10px] opacity-60">
                <span>Cryptographic IP Hash: </span>
                <span className="font-bold">{selectedLog.ipHash}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs opacity-50 font-mono">
              Select an audit entry from the table to view the verified before/after diff and rationale.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
