import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  contentVersioningService,
  ContentVersionRecord,
} from '../services/contentVersioningService';
import { adminAuditStore } from '../services/adminAuditStore';

interface ContentVersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityTitle: string;
  entityType: 'PROJECT' | 'PROPERTY';
  theme?: 'dark' | 'light';
  onRollbackComplete?: (rolledBackData: any) => void;
}

export const ContentVersionHistoryModal: React.FC<ContentVersionHistoryModalProps> = ({
  isOpen,
  onClose,
  entityId,
  entityTitle,
  entityType,
  theme = 'dark',
  onRollbackComplete,
}) => {
  const [history, setHistory] = useState<ContentVersionRecord[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersionRecord | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackSuccess, setRollbackSuccess] = useState<string | null>(null);
  const [rollbackReason, setRollbackReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (isOpen && entityId) {
      const records = contentVersioningService.getVersionHistory(entityId);
      setHistory(records);
      if (records.length > 0) {
        setSelectedVersion(records[0]);
      }
    }
  }, [isOpen, entityId]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleExecuteRollback = () => {
    if (!selectedVersion || !rollbackReason.trim()) return;
    setIsRollingBack(true);

    const operator = {
      name: 'Pooja Iyer',
      role: 'COMPLIANCE_MANAGER',
    };

    const res = contentVersioningService.rollbackToVersion(selectedVersion.versionId, operator);

    // Also record into Admin Audit Store
    adminAuditStore.recordAudit({
      actor: {
        id: 'ADM_002',
        name: operator.name,
        role: operator.role as any,
        email: 'pooja.i@kiaanproperties.com',
      },
      entity: {
        type: entityType === 'PROJECT' ? 'PROJECT_SPEC' : 'PRICE_SCHEDULE',
        id: entityId,
        title: entityTitle,
      },
      actionType: 'STATUS_CHANGE',
      reasonCategory: 'CONTENT_ROLLBACK',
      justification: `Rollback to ${selectedVersion.versionNumber}: ${rollbackReason}`,
      changes: {
        rolledBackToVersion: selectedVersion.versionNumber,
        originalChangeSummary: selectedVersion.changeSummary,
      },
    });

    setIsRollingBack(false);
    setShowConfirmModal(false);

    if (res.success) {
      setRollbackSuccess(res.message);
      // Refresh history list
      setHistory(contentVersioningService.getVersionHistory(entityId));
      if (onRollbackComplete && res.rolledBackData) {
        onRollbackComplete(res.rolledBackData);
      }
      setTimeout(() => setRollbackSuccess(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-[#0B101B] border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg">Content Versioning & Rollback</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  Item 150 Compliant
                </span>
              </div>
              <p className="text-xs opacity-60">
                Immutable audit trail for {entityType === 'PROJECT' ? 'Project' : 'Property'}: {entityTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-current/10 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {rollbackSuccess && (
          <div className="p-4 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{rollbackSuccess}</span>
          </div>
        )}

        {/* Main Content Split: Left Timeline / Right Snapshot Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Version Timeline */}
          <div className="md:col-span-5 p-6 border-r border-current/10 overflow-y-auto space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
              Revision History ({history.length} Revisions)
            </span>

            <div className="space-y-2.5 pt-1">
              {history.map((ver, idx) => {
                const isSelected = selectedVersion?.versionId === ver.versionId;
                const isCurrent = idx === 0;
                return (
                  <div
                    key={ver.versionId}
                    onClick={() => setSelectedVersion(ver)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-amber-50 border-amber-500 text-slate-900'
                        : isDark
                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-amber-400">{ver.versionNumber}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">
                            Active
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            ver.status === 'PUBLISHED'
                              ? 'bg-blue-500/20 text-blue-400'
                              : ver.status === 'ARCHIVED'
                              ? 'bg-zinc-500/20 text-zinc-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {ver.status}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-60 font-mono">
                        {new Date(ver.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs mt-1.5 line-clamp-2 opacity-90 leading-snug">{ver.changeSummary}</p>
                    <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[10px] opacity-60">
                      <span>By {ver.authorName}</span>
                      <span>{ver.authorRole}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Version Details & Rollback Trigger */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            {selectedVersion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Selected Snapshot</span>
                    <h4 className="font-serif font-bold text-lg">
                      {selectedVersion.versionNumber} – {selectedVersion.status}
                    </h4>
                  </div>
                  <span className="text-xs font-mono opacity-60">{selectedVersion.createdAt}</span>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2 text-xs`}>
                  <div className="font-semibold text-current">Change Summary:</div>
                  <p className="opacity-90 leading-relaxed">{selectedVersion.changeSummary}</p>
                  <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px] opacity-70">
                    <span>Author: {selectedVersion.authorName} ({selectedVersion.authorRole})</span>
                    <span>ID: {selectedVersion.versionId}</span>
                  </div>
                </div>

                {/* Rollback Trigger Section */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-amber-950/30 border-amber-500/30' : 'bg-amber-50 border-amber-200'} space-y-3`}>
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase">
                    <RotateCcw className="w-4 h-4" />
                    <span>Rollback Control</span>
                  </div>
                  <p className="text-xs opacity-80 leading-snug">
                    Restoring this snapshot will reinstate its specifications and statutory attributes while creating a new, traceable audit entry.
                  </p>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rollback to {selectedVersion.versionNumber}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 opacity-60 text-xs">
                Select a version from the left panel to inspect.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Confirm Rollback Dialog with Mandatory Justification (Item 129 + 150) */}
        {showConfirmModal && selectedVersion && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${isDark ? 'bg-[#101726] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span>Confirm Version Rollback</span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                You are rolling back <span className="font-bold">{entityTitle}</span> to <span className="font-mono font-bold text-amber-400">{selectedVersion.versionNumber}</span>. Please provide an administrative reason for the audit trail:
              </p>
              <textarea
                value={rollbackReason}
                onChange={(e) => setRollbackReason(e.target.value)}
                placeholder="e.g., Statutory revisions updated with approved MahaRERA architectural plan v2."
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                  isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                rows={3}
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-current/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteRollback}
                  disabled={!rollbackReason.trim() || isRollingBack}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-2"
                >
                  {isRollingBack ? 'Restoring...' : 'Confirm & Revert'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
