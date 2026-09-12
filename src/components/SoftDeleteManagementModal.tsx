/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Archive,
  RotateCcw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Building,
  Layers,
  ShieldAlert,
  Clock,
  User,
} from 'lucide-react';
import { UserSession } from '../types';
import { coreEnterpriseWorkflowService } from '../services/coreEnterpriseWorkflowService';

interface SoftDeleteManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
  theme?: 'dark' | 'light';
  onRestorationComplete?: () => void;
}

export const SoftDeleteManagementModal: React.FC<SoftDeleteManagementModalProps> = ({
  isOpen,
  onClose,
  session,
  theme = 'dark',
  onRestorationComplete,
}) => {
  const [deletedData, setDeletedData] = useState(() => coreEnterpriseWorkflowService.getSoftDeletedEntities());
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleRestore = (type: 'PROJECT' | 'PROPERTY', id: string) => {
    const res = coreEnterpriseWorkflowService.restoreEntity({
      type,
      id,
      operator: {
        id: session.userId || 'ADM_001',
        name: session.name,
        role: session.role,
        email: session.email,
      },
    });

    if (res.success) {
      setActionSuccess(res.message);
      setDeletedData(coreEnterpriseWorkflowService.getSoftDeletedEntities());
      if (onRestorationComplete) onRestorationComplete();
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const totalArchived = deletedData.projects.length + deletedData.properties.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          isDark ? 'bg-[#0B101B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg">Soft-Deleted & Archived Inventory Archive</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase">
                  Item 155 Safe Delete Policy
                </span>
              </div>
              <p className="text-xs opacity-60">
                Non-destructive archival vault. Assets retain full audit trails and can be safely restored.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-current/10 opacity-70 hover:opacity-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {totalArchived === 0 ? (
            <div className="py-12 text-center opacity-60 space-y-2">
              <Archive className="w-12 h-12 mx-auto text-amber-500/40" />
              <p className="text-sm font-semibold">No archived or soft-deleted assets in database.</p>
              <p className="text-xs">All active projects and properties are live.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
                Archived Items ({totalArchived})
              </span>

              {/* Projects */}
              {deletedData.projects.map((item) => (
                <div
                  key={item.project.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm">{item.project.name}</h4>
                        <span className="px-1.5 py-0.5 rounded-full bg-zinc-500/20 text-zinc-400 text-[9px] font-mono font-bold uppercase">
                          Project
                        </span>
                      </div>
                      <p className="text-xs opacity-75">{item.reason}</p>
                      <div className="flex items-center gap-3 text-[10px] opacity-60 font-mono">
                        <span>Archived: {new Date(item.deletedAt).toLocaleString('en-IN')}</span>
                        <span>By: {item.deletedBy}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestore('PROJECT', item.project.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-md active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Asset</span>
                  </button>
                </div>
              ))}

              {/* Properties */}
              {deletedData.properties.map((item) => (
                <div
                  key={item.property.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm">{item.property.title}</h4>
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-mono font-bold uppercase">
                          Property
                        </span>
                      </div>
                      <p className="text-xs opacity-75">{item.reason}</p>
                      <div className="flex items-center gap-3 text-[10px] opacity-60 font-mono">
                        <span>Archived: {new Date(item.deletedAt).toLocaleString('en-IN')}</span>
                        <span>By: {item.deletedBy}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestore('PROPERTY', item.property.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-md active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Asset</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
