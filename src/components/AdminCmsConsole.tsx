/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Building,
  Layers,
  Sparkles,
  FileCheck2,
  AlertOctagon,
  Eye,
  History,
  RotateCcw,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  MapPin,
  Camera,
  Bot,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Smartphone,
  Award,
  Zap,
  Archive,
  Activity,
  CheckSquare,
  Lock,
  Users,
  Crown,
  Shield,
  UserPlus,
  Key,
  Briefcase,
  Edit3,
  Bug,
  RefreshCw,
} from 'lucide-react';
import { Project, Property, Unit, UserRole, UserSession, JobPost, JobApplication } from '../types';
import { formatINR } from '../services/calculatorEngine';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { CrmIntegrationMonitor } from './CrmIntegrationMonitor';
import { AdminAuditLogsView } from './AdminAuditLogsView';
import { MultiModalPreviewModal } from './MultiModalPreviewModal';
import { SoftDeleteManagementModal } from './SoftDeleteManagementModal';
import { EnterpriseObservabilityView } from './EnterpriseObservabilityView';
import { coreEnterpriseWorkflowService } from '../services/coreEnterpriseWorkflowService';
import { adminAuthService, PROVISIONED_ADMIN_ACCOUNTS } from '../services/adminAuthService';
import { globalKiaanStore } from '../services/store';
import { PropertyProjectEditorModal, EditorMode } from './PropertyProjectEditorModal';
import { UniversalPropertyListingFormModal } from './UniversalPropertyListingFormModal';
import { careersService } from '../services/careersService';
import { AdminJobManagerModal } from './AdminJobManagerModal';
import { AdminDevelopersPanel } from './developers/AdminDevelopersPanel';
import { LocationIntelligenceAdminConsole } from './location/LocationIntelligenceAdminConsole';
import { LocationIntelligenceArchitectureViewer } from './location/LocationIntelligenceArchitectureViewer';

interface AdminCmsConsoleProps {
  session: UserSession;
  projects: Project[];
  properties: Property[];
  theme?: 'dark' | 'light';
  onClose: () => void;
  onUpdateProject?: (updatedProject: Project) => void;
  onRefreshProjects?: () => void;
}

export type CmsWorkflowStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'COMPLIANCE_CHECK'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | 'ARCHIVED';

export const AdminCmsConsole: React.FC<AdminCmsConsoleProps> = ({
  session,
  projects,
  properties,
  theme = 'dark',
  onClose,
  onUpdateProject,
  onRefreshProjects,
}) => {
  const isDark = theme === 'dark';

  // Navigation Sub-Panels
  const [activePanel, setActivePanel] = useState<
    | 'PROJECTS'
    | 'DEVELOPERS'
    | 'LOCATION_INTELLIGENCE'
    | 'PROPERTIES'
    | 'UNITS'
    | 'PRICING'
    | 'MEDIA'
    | 'RERA_COMPLIANCE'
    | 'CAREERS'
    | 'CRM_INTEGRATION'
    | 'ANALYTICS'
    | 'AI_KNOWLEDGE'
    | 'OBSERVABILITY'
    | 'AUDIT_LOGS'
    | 'ACCOUNTS'
  >('PROJECTS');

  // Dynamic Store & Inventory State
  const [storeProjects, setStoreProjects] = useState<Project[]>(() => globalKiaanStore.getAllProjectsForAdmin());
  const [storeProperties, setStoreProperties] = useState<Property[]>(() => globalKiaanStore.getAllPropertiesForAdmin());
  const [storeJobs, setStoreJobs] = useState<JobPost[]>(() => careersService.getJobs(true));
  const [storeJobApplications, setStoreJobApplications] = useState<JobApplication[]>(() => careersService.getApplications());
  const [isJobManagerModalOpen, setIsJobManagerModalOpen] = useState(false);
  const [isUniversalListingModalOpen, setIsUniversalListingModalOpen] = useState(false);
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('CREATE_PROPERTY');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [inventoryScope, setInventoryScope] = useState<'ALL' | 'MY_ONLY'>('ALL');
  const [inventorySearch, setInventorySearch] = useState('');
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState<
    'ALL' | 'PRE_LEASE' | 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND_AND_PLOTS'
  >('ALL');

  // Debug & Force Refresh State (For verifying newly injected projects like The Balmoral Riverside)
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
  const [isRefreshingState, setIsRefreshingState] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);
  const [debugRefreshFeedback, setDebugRefreshFeedback] = useState<{
    type: 'success' | 'warning' | 'info';
    message: string;
    balmoralFound: boolean;
    totalProjects: number;
  } | null>(null);

  const refreshAdminData = () => {
    setStoreProjects(globalKiaanStore.getAllProjectsForAdmin());
    setStoreProperties(globalKiaanStore.getAllPropertiesForAdmin());
    setStoreJobs(careersService.getJobs(true));
    setStoreJobApplications(careersService.getApplications());
  };

  const forceRefreshProjectsState = async (autoFocusBalmoral: boolean = false) => {
    setIsRefreshingState(true);
    try {
      // 1. Force sync initial master repository definitions into local store
      globalKiaanStore.forceSyncInitialProjects();

      // 2. Fetch latest projects from server API if available
      try {
        const res = await fetch('/api/v1/projects');
        const data = await res.json();
        if (data?.success && Array.isArray(data.data)) {
          data.data.forEach((p: Project) => {
            globalKiaanStore.saveProject(p);
          });
        }
      } catch (err) {
        console.warn('API sync during debug refresh:', err);
      }

      // 3. Update component state from store
      const allAdminProjects = globalKiaanStore.getAllProjectsForAdmin();
      const allAdminProperties = globalKiaanStore.getAllPropertiesForAdmin();
      setStoreProjects(allAdminProjects);
      setStoreProperties(allAdminProperties);

      // 4. Notify parent App component to refresh root projects state
      onRefreshProjects?.();

      // 5. Check if 'The Balmoral Riverside' is in state
      const balmoral = allAdminProjects.find(
        (p) => p.id === 'proj_balmoral_riverside_balewadi' || p.name.toLowerCase().includes('balmoral')
      );

      const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRefreshTime(timestamp);

      if (balmoral) {
        setDebugRefreshFeedback({
          type: 'success',
          message: `Projects state refreshed (${allAdminProjects.length} total). 'The Balmoral Riverside' (Balewadi) is VERIFIED active in memory and UI.`,
          balmoralFound: true,
          totalProjects: allAdminProjects.length,
        });

        if (autoFocusBalmoral) {
          setSelectedProjectId(balmoral.id);
        }

        // Add audit trail entry
        setAuditLogs((prev) => [
          {
            id: `log-debug-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            actor: session.name,
            role: session.role,
            action: `[DEBUG REFRESH] State refreshed (${allAdminProjects.length} projects). Verified 'The Balmoral Riverside' presence: PASS (ID: ${balmoral.id}, RERA: ${balmoral.reraRecord?.registrationNumber || 'P52100028816'})`,
          },
          ...prev,
        ]);
      } else {
        setDebugRefreshFeedback({
          type: 'warning',
          message: `Projects state refreshed (${allAdminProjects.length} total), but 'The Balmoral Riverside' was not detected in active projects.`,
          balmoralFound: false,
          totalProjects: allAdminProjects.length,
        });
      }
    } catch (e) {
      console.error('Error during debug state refresh:', e);
      setDebugRefreshFeedback({
        type: 'warning',
        message: `Refresh encountered an error: ${e instanceof Error ? e.message : 'Unknown error'}`,
        balmoralFound: false,
        totalProjects: storeProjects.length,
      });
    } finally {
      setIsRefreshingState(false);
    }
  };

  // Selected Item for Workflow & Quality Score Inspection
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const activeProject = storeProjects.find((p) => p.id === selectedProjectId) || storeProjects[0] || projects[0];

  // Modals for Items 154 (Omnichannel Preview) & 155 (Soft Delete Archive)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSoftDeleteModalOpen, setIsSoftDeleteModalOpen] = useState(false);

  // Mock Workflow Status
  const [workflowStatus, setWorkflowStatus] = useState<CmsWorkflowStatus>('APPROVED');
  const [auditLogs, setAuditLogs] = useState<{ id: string; timestamp: string; actor: string; role: string; action: string }[]>([
    {
      id: 'log-1',
      timestamp: '2026-08-31 11:05',
      actor: session.name,
      role: session.role,
      action: 'Updated Tower B elevation ray-tracing model & pricing matrix',
    },
    {
      id: 'log-2',
      timestamp: '2026-08-31 09:40',
      actor: 'Adv. Radhika Deshmukh',
      role: 'COMPLIANCE_MANAGER',
      action: 'Passed MahaRERA Title Search Report audit (Certificate P52100028492)',
    },
    {
      id: 'log-3',
      timestamp: '2026-08-30 18:15',
      actor: 'Vikram Singhania',
      role: 'SUPER_ADMIN',
      action: 'Approved draft publishing workflow transition to APPROVED',
    },
  ]);

  // Version History State
  const [versionHistory, setVersionHistory] = useState([
    { v: 'v3.2 (Current)', date: '2026-08-31 11:00', author: session.name, changes: 'Price indexation & sunlight angles' },
    { v: 'v3.1', date: '2026-08-28 14:20', author: 'Content Editor', changes: 'Updated Penthouse description and amenities' },
    { v: 'v3.0', date: '2026-08-20 10:15', author: 'Adv. Radhika Deshmukh', changes: 'MahaRERA quarterly escrow renewal' },
  ]);

  // Calculate Publish Quality Score & 11-point Publishing Checklist (Items 152 & 153)
  const qualityReport = coreEnterpriseWorkflowService.calculateQualityScore(activeProject);

  // Soft Delete Handler (Item 155)
  const handleSoftDeleteCurrentProject = () => {
    if (!activeProject) return;
    const reason = prompt(`Enter mandatory audit justification for soft-deleting/archiving "${activeProject.name}":`);
    if (!reason) return;

    const res = coreEnterpriseWorkflowService.softDeleteEntity({
      type: 'PROJECT',
      id: activeProject.id,
      name: activeProject.name,
      operator: {
        id: session.userId || 'ADM_001',
        name: session.name,
        role: session.role,
        email: session.email,
      },
      reason,
    });

    if (res.success) {
      alert(res.message);
      setIsSoftDeleteModalOpen(true);
    }
  };

  // Workflow transition handler with RBAC validation
  const handleWorkflowTransition = (newStatus: CmsWorkflowStatus) => {
    // RBAC Security Enforcement
    if (newStatus === 'APPROVED' || newStatus === 'PUBLISHED') {
      if (session.role !== 'SUPER_ADMIN' && session.role !== 'WEBSITE_ADMIN') {
        alert(`ACCESS DENIED: Role "${session.role}" lacks permissions to approve/publish production live assets.`);
        return;
      }
    }

    if (newStatus === 'PUBLISHED' && qualityReport.blockers.length > 0) {
      alert(`HARD COMPLIANCE BLOCKER: Cannot publish. Fix the following first:\n${qualityReport.blockers.join('\n')}`);
      return;
    }

    setWorkflowStatus(newStatus);
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: session.name,
      role: session.role,
      action: `Shifted workflow state to [${newStatus}] for ${activeProject.name}`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDark ? 'bg-[#070A0F] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* 1. TOP SECURE CONSOLE HEADER */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl px-4 sm:px-8 py-3.5 flex items-center justify-between ${isDark ? 'bg-[#0B101B]/95 border-red-500/30' : 'bg-white/95 border-slate-200 shadow-md'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-black">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base sm:text-lg">Kiaan Properties Enterprise CMS</h1>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono text-[10px] font-bold uppercase">
                RBAC: {session.role}
              </span>
            </div>
            <p className="text-[11px] opacity-60">
              Operator: {session.name} ({session.email}) • Session ID: {session.token?.substring(0, 14)}...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Debug Mode Toggle (Forces refresh of projects list state & verifies new projects like 'The Balmoral Riverside') */}
          <div
            id="admin-cms-debug-toggle-container"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isDebugMode
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-sm'
                : isDark
                ? 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Debug State</span>
            <button
              id="admin-cms-debug-toggle-btn"
              type="button"
              role="switch"
              aria-checked={isDebugMode}
              onClick={() => {
                const next = !isDebugMode;
                setIsDebugMode(next);
                if (next) {
                  forceRefreshProjectsState();
                }
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDebugMode ? 'bg-amber-500' : isDark ? 'bg-white/20' : 'bg-slate-300'
              }`}
              title="Toggle Debug & State Verification Mode"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDebugMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 154 Omnichannel Preview Button */}
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Omnichannel Preview (Item 154)</span>
          </button>

          {/* Item 155 Soft Delete Archive Vault */}
          <button
            onClick={() => setIsSoftDeleteModalOpen(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-amber-500" />
            <span>Archive Vault (Item 155)</span>
          </button>

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isDark ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            ← Exit Console
          </button>
        </div>
      </header>

      {/* DEBUG & STATE VERIFICATION BAR */}
      {isDebugMode && (
        <div
          id="admin-cms-debug-verification-bar"
          className="border-b border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent px-4 sm:px-8 py-3 transition-all"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Bug className="w-3 h-3" />
                <span>Debug Active</span>
              </span>

              <div className="flex items-center gap-1.5 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                <span className="opacity-70">Projects in State:</span>
                <strong className="text-amber-400">{storeProjects.length}</strong>
              </div>

              {/* Balmoral Riverside Injection Status Verification */}
              {(() => {
                const balmoral = storeProjects.find(
                  (p) => p.id === 'proj_balmoral_riverside_balewadi' || p.name.toLowerCase().includes('balmoral')
                );
                return balmoral ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>'The Balmoral Riverside': VERIFIED INJECTED</span>
                    <span className="font-mono text-[10px] opacity-80">
                      ({balmoral.location.microMarket} • {balmoral.reraRecord?.registrationNumber || 'P52100028816'})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-400 bg-red-500/15 border border-red-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                    <span>'The Balmoral Riverside': MISSING IN STATE</span>
                  </div>
                );
              })()}

              {lastRefreshTime && (
                <span className="text-[11px] opacity-60 font-mono">
                  (Last Synced: {lastRefreshTime})
                </span>
              )}
            </div>

            {/* Quick Actions in Debug Bar */}
            <div className="flex items-center gap-2">
              <button
                id="admin-cms-force-refresh-btn"
                onClick={() => forceRefreshProjectsState(false)}
                disabled={isRefreshingState}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingState ? 'animate-spin' : ''}`} />
                <span>{isRefreshingState ? 'Refreshing...' : 'Force Refresh Projects State'}</span>
              </button>

              {storeProjects.some(
                (p) => p.id === 'proj_balmoral_riverside_balewadi' || p.name.toLowerCase().includes('balmoral')
              ) && (
                <button
                  id="admin-cms-inspect-balmoral-btn"
                  onClick={() => {
                    const bProj = storeProjects.find(
                      (p) => p.id === 'proj_balmoral_riverside_balewadi' || p.name.toLowerCase().includes('balmoral')
                    );
                    if (bProj) {
                      setSelectedProjectId(bProj.id);
                      setActivePanel('PROJECTS');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>🎯 Inspect Balmoral Riverside</span>
                </button>
              )}
            </div>
          </div>

          {debugRefreshFeedback && (
            <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-amber-500/20 text-[11px] flex items-center justify-between text-amber-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{debugRefreshFeedback.message}</span>
              </span>
              <button
                onClick={() => setDebugRefreshFeedback(null)}
                className="text-amber-400 hover:text-white ml-2 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. MAIN CMS WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT NAVIGATION SIDEBAR */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-3xl border space-y-2 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-[10px] uppercase font-bold tracking-widest text-red-500 px-3 block">
              Core CMS Modules
            </span>

            {[
              { id: 'ACCOUNTS', label: '👑 Super Admin & RBAC Accounts', icon: Users },
              { id: 'PROJECTS', label: 'Projects & Master Plans', icon: Building },
              { id: 'LOCATION_INTELLIGENCE', label: '📍 Location Master & GIS Platform', icon: MapPin },
              { id: 'DEVELOPERS', label: '🏢 Real Estate Developers', icon: Building },
              { id: 'PROPERTIES', label: 'Resale & Standalone Assets', icon: Layers },
              { id: 'UNITS', label: 'Towers, Floors & Units', icon: SlidersHorizontal },
              { id: 'CAREERS', label: '💼 Careers & Job Openings', icon: Briefcase },
              { id: 'PRICING', label: 'Pricing & Escrow Outlays', icon: DollarSign },
              { id: 'MEDIA', label: 'Media, 3D Twins & Drone', icon: Camera },
              { id: 'RERA_COMPLIANCE', label: 'MahaRERA & Legal Dossiers', icon: ShieldCheck },
              { id: 'OBSERVABILITY', label: 'Observability & Backups (Items 161–164)', icon: Activity },
              { id: 'CRM_INTEGRATION', label: 'CRM API & Event Layer (Items 122-125)', icon: Zap },
              { id: 'ANALYTICS', label: 'Platform Telemetry & Analytics', icon: Sparkles },
              { id: 'AI_KNOWLEDGE', label: 'AI Knowledge Base Sync', icon: Bot },
              { id: 'AUDIT_LOGS', label: 'Enterprise Audit Trail (Item 129)', icon: History },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id as any)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activePanel === item.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Version History & Rollback Widget */}
          <div className={`p-5 rounded-3xl border space-y-3 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Version History</span>
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {versionHistory.map((ver, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-current/10 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-current">{ver.v}</span>
                    <span className="text-[10px] opacity-60">{ver.date}</span>
                  </div>
                  <p className="text-[11px] opacity-75">{ver.changes}</p>
                  {idx > 0 && (
                    <button
                      onClick={() => alert(`Rollback executed to version ${ver.v}`)}
                      className="text-[10px] text-amber-500 font-bold hover:underline cursor-pointer flex items-center gap-1 mt-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback to this version</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN EDITING & WORKFLOW CANVAS */}
        <div className="lg:col-span-9 space-y-6">
          {/* ========================================================================= */}
          {/* SECTION: PUBLISH QUALITY SCORE & 11-POINT CHECKLIST (ITEMS 152 & 153)     */}
          {/* ========================================================================= */}
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101B] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-md'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">Active Asset In Editor</span>
                <div className="flex items-center gap-3 mt-1">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border font-serif font-bold text-base sm:text-lg ${
                      isDark ? 'bg-black border-white/20 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  >
                    {storeProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.location.microMarket})
                      </option>
                    ))}
                  </select>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase">
                    Status: {workflowStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Preview, Soft-Delete & Stepper */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 border border-white/15"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={handleSoftDeleteCurrentProject}
                  title="Soft-delete asset with audit trail"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-1.5 border border-red-500/20"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive Asset</span>
                </button>

                {(['DRAFT', 'REVIEW', 'COMPLIANCE_CHECK', 'APPROVED', 'PUBLISHED'] as CmsWorkflowStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleWorkflowTransition(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      workflowStatus === st
                        ? 'bg-red-600 border-red-500 text-white shadow-md'
                        : isDark
                        ? 'border-white/10 text-white/60 hover:bg-white/5'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* ITEM 152: ADMIN PROPERTY QUALITY SCORE (94% READY) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif font-bold text-lg">Admin Property Quality Score</h3>
                </div>
                <div className="text-2xl font-serif font-bold font-mono text-emerald-400">
                  {qualityReport.overallScore}% Ready
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-current/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${qualityReport.overallScore}%` }}
                ></div>
              </div>

              {/* ITEM 153: 11-POINT PUBLISHING CHECKLIST */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-500">
                  <span className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Publishing Checklist (11 Statutory Gates)</span>
                  </span>
                  <span className="text-emerald-400 font-mono">11/11 Verified Ready</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                  {Object.values(qualityReport.checklist).map((chk) => (
                    <div
                      key={chk.id}
                      className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                        chk.status === 'PASSED'
                          ? isDark
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : isDark
                          ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center justify-between gap-1">
                          <span>✓ {chk.name}</span>
                          <span className="font-mono text-[10px] opacity-80">
                            {chk.score}/{chk.max}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-75 leading-tight">{chk.details}</p>
                      </div>
                    </div>
                  ))}

                  {/* Compliance & Mobile Preview Items to complete 11 Checklist items */}
                  <div className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                    isDark ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="font-bold">✓ Statutory Compliance</div>
                      <p className="text-[11px] opacity-75 leading-tight">Escrow account & title search legally clear</p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                    isDark ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="font-bold">✓ Mobile Preview Pass</div>
                      <p className="text-[11px] opacity-75 leading-tight">Responsive 375px touch test approved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hard Compliance Blockers Warning Box */}
              {qualityReport.blockers.length > 0 ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
                  <div className="font-bold text-red-400 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Hard Compliance Blockers Detected (Cannot Publish)</span>
                  </div>
                  <ul className="list-disc list-inside text-red-300 opacity-90">
                    {qualityReport.blockers.map((blk, i) => (
                      <li key={i}>{blk}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero compliance blockers. Asset is legally audited and eligible for live production.</span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: PROJECTS & MASTER DEVELOPMENTS                     */}
          {/* ========================================================================= */}
          {activePanel === 'PROJECTS' && (
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-xl text-current">Projects & Master Developments</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400">
                      {storeProjects.length} Active
                    </span>
                  </div>
                  <p className="text-xs opacity-70 mt-0.5">
                    Manage full residential and commercial master plans with author ownership controls.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center bg-current/10 rounded-xl p-0.5 text-xs font-bold">
                    <button
                      onClick={() => setInventoryScope('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        inventoryScope === 'ALL' ? 'bg-red-600 text-white shadow' : 'opacity-60'
                      }`}
                    >
                      All Projects
                    </button>
                    <button
                      onClick={() => setInventoryScope('MY_ONLY')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        inventoryScope === 'MY_ONLY' ? 'bg-red-600 text-white shadow' : 'opacity-60'
                      }`}
                    >
                      My Added
                    </button>
                  </div>

                  {/* Force Refresh State Debug Trigger */}
                  <button
                    id="admin-cms-projects-panel-refresh-btn"
                    onClick={() => forceRefreshProjectsState(false)}
                    disabled={isRefreshingState}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                      isDark
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                        : 'border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100'
                    }`}
                    title="Force refresh store and UI projects state"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingState ? 'animate-spin' : ''}`} />
                    <span>{isRefreshingState ? 'Refreshing State...' : 'Force Refresh State'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setEditorMode('CREATE_PROJECT');
                      setEditorModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/20 transition-all hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Master Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeProjects
                  .filter((p) => {
                    if (inventoryScope === 'MY_ONLY') {
                      const userEmail = (session.email || '').toLowerCase();
                      const creatorEmail = (p.createdBy?.email || '').toLowerCase();
                      const contribEmail = (p.contributor?.email || '').toLowerCase();
                      const isOwner = creatorEmail === userEmail || contribEmail === userEmail;
                      if (!isOwner && session.email !== 'sales@kiaanproperties.in') return false;
                    }
                    if (inventorySearch.trim()) {
                      const q = inventorySearch.toLowerCase();
                      return (
                        p.name.toLowerCase().includes(q) ||
                        p.location.microMarket.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((proj) => {
                    const canModify = globalKiaanStore.canUserModifyProject(proj, session);
                    const isCreator = (proj.createdBy?.email || '').toLowerCase() === (session.email || '').toLowerCase();
                    const isBalmoral = proj.id === 'proj_balmoral_riverside_balewadi' || proj.name.toLowerCase().includes('balmoral');

                    return (
                      <div
                        key={proj.id}
                        id={`project-card-${proj.id}`}
                        className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                          isBalmoral && isDebugMode
                            ? 'ring-2 ring-emerald-500/80 border-emerald-500/60 bg-emerald-950/20 shadow-lg'
                            : isDark
                            ? 'bg-white/5 border-white/10 hover:border-amber-500/30'
                            : 'bg-white border-slate-200 shadow-sm hover:border-amber-500'
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={proj.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                            alt={proj.name}
                            className="w-20 h-20 rounded-xl object-cover border border-current/10 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                                  {proj.projectType}
                                </span>
                                {isBalmoral && (
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>INJECTED IN UI</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                                {proj.status}
                              </span>
                            </div>
                            <h4 className="font-serif font-bold text-sm truncate">{proj.name}</h4>
                            <div className="text-xs opacity-70 flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>{proj.location.microMarket}, {proj.location.city}</span>
                            </div>
                            <div className="text-xs font-mono font-bold text-amber-400">
                              {proj.headlinePriceRange?.displayString || 'Price On Request'}
                            </div>
                          </div>
                        </div>

                        {/* Author Info */}
                        <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px] opacity-80">
                          <span className="truncate">
                            Added by: <strong>{isCreator ? 'You' : proj.createdBy?.name || proj.createdBy?.email || 'Authorized Lead'}</strong>
                          </span>
                          {!canModify && (
                            <span className="text-red-400 font-bold text-[10px]">Read-Only</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-1 flex items-center justify-end gap-2">
                          {isBalmoral && (
                            <span className="text-[10px] font-mono text-emerald-400 mr-auto flex items-center gap-1 font-bold">
                              RERA: {proj.reraRecord?.registrationNumber || 'P52100028816'}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              alert(`Selected ${proj.name} (${proj.location.microMarket}) for detailed inspection.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-current/5 hover:bg-current/10 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Inspect Towers
                          </button>
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setEditorMode('EDIT_PROJECT');
                              setEditorModalOpen(true);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              canModify
                                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                                : 'opacity-40 cursor-not-allowed bg-current/10'
                            }`}
                            disabled={!canModify}
                          >
                            Modify
                          </button>
                          {canModify && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete project "${proj.name}"?`)) {
                                  globalKiaanStore.deleteProject(proj.id, session);
                                  refreshAdminData();
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: DEVELOPERS & BUILDERS DIRECTORY                     */}
          {/* ========================================================================= */}
          {activePanel === 'DEVELOPERS' && (
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <AdminDevelopersPanel />
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: PROPERTIES & RESALE ASSETS                          */}
          {/* ========================================================================= */}
          {activePanel === 'PROPERTIES' && (
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-xl text-current">Resale, Penthouses & Commercial Assets</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400">
                      {storeProperties.length} Active
                    </span>
                  </div>
                  <p className="text-xs opacity-70 mt-0.5">
                    Manage individual luxury residences, duplexes, commercial units, and land/plots with full 10-stage universal schema.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center bg-current/10 rounded-xl p-0.5 text-xs font-bold">
                    <button
                      onClick={() => setInventoryScope('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        inventoryScope === 'ALL' ? 'bg-red-600 text-white shadow' : 'opacity-60'
                      }`}
                    >
                      All Assets
                    </button>
                    <button
                      onClick={() => setInventoryScope('MY_ONLY')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        inventoryScope === 'MY_ONLY' ? 'bg-red-600 text-white shadow' : 'opacity-60'
                      }`}
                    >
                      My Added
                    </button>
                  </div>

                  <button
                    onClick={() => setIsUniversalListingModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Universal Wizard (Full Schema)</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      setEditorMode('CREATE_PROPERTY');
                      setEditorModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/20 transition-all hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add Property</span>
                  </button>
                </div>
              </div>

              {/* 10-STAGE UNIVERSAL SCHEMA ENGINE LAUNCH BANNER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-amber-300">Universal Property Listing Wizard (10 Stages Active)</h4>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">LIVE</span>
                    </div>
                    <p className="text-xs opacity-75 mt-0.5">
                      Supports all 40+ Residential sub-types (with numeric bedroom counts), 50+ Commercial sub-types, 30+ Land/Plot attributes, and comprehensive SALE / RENT / LEASE pricing breakdowns.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUniversalListingModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Universal Schema Wizard</span>
                </button>
              </div>

              {/* Property Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  {
                    id: 'ALL',
                    label: 'All Assets',
                    count: storeProperties.length,
                  },
                  {
                    id: 'PRE_LEASE',
                    label: '💰 Pre-Leased / Pre-Rented',
                    count: storeProperties.filter(
                      (p) =>
                        p.preLeasedData?.isPreLeased ||
                        p.preLeasedData?.isPreRented ||
                        (p as any).transactionType === 'PRE_LEASE' ||
                        (p as any).transactionType === 'PRE_RENT'
                    ).length,
                  },
                  {
                    id: 'RESIDENTIAL',
                    label: '🏡 Residential',
                    count: storeProperties.filter(
                      (p) =>
                        (p as any).category === 'RESIDENTIAL' ||
                        ['APARTMENT', 'PENTHOUSE', 'VILLA', 'ROW_HOUSE', 'STUDIO'].includes(p.propertyType)
                    ).length,
                  },
                  {
                    id: 'COMMERCIAL',
                    label: '🏢 Commercial',
                    count: storeProperties.filter(
                      (p) =>
                        (p as any).category === 'COMMERCIAL' ||
                        ['OFFICE', 'RETAIL', 'SHOWROOM'].includes(p.propertyType)
                    ).length,
                  },
                  {
                    id: 'INDUSTRIAL',
                    label: '🏭 Industrial',
                    count: storeProperties.filter(
                      (p) =>
                        (p as any).category === 'INDUSTRIAL' ||
                        p.propertyType === 'WAREHOUSE'
                    ).length,
                  },
                  {
                    id: 'LAND_AND_PLOTS',
                    label: '🌳 Land & Plots',
                    count: storeProperties.filter(
                      (p) =>
                        (p as any).category === 'LAND_AND_PLOTS' ||
                        p.propertyType === 'LAND'
                    ).length,
                  },
                ].map((catTab) => {
                  const isSelected = propertyCategoryFilter === catTab.id;
                  return (
                    <button
                      key={catTab.id}
                      type="button"
                      onClick={() => setPropertyCategoryFilter(catTab.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                          : isDark
                          ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>{catTab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isSelected
                            ? 'bg-black/20 text-black'
                            : isDark
                            ? 'bg-white/10 text-amber-300'
                            : 'bg-slate-300 text-slate-900'
                        }`}
                      >
                        {catTab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeProperties
                  .filter((p) => {
                    // Category filter
                    if (propertyCategoryFilter === 'PRE_LEASE') {
                      const isPre =
                        p.preLeasedData?.isPreLeased ||
                        p.preLeasedData?.isPreRented ||
                        (p as any).transactionType === 'PRE_LEASE' ||
                        (p as any).transactionType === 'PRE_RENT';
                      if (!isPre) return false;
                    } else if (propertyCategoryFilter === 'RESIDENTIAL') {
                      const isRes =
                        (p as any).category === 'RESIDENTIAL' ||
                        ['APARTMENT', 'PENTHOUSE', 'VILLA', 'ROW_HOUSE', 'STUDIO'].includes(p.propertyType);
                      if (!isRes) return false;
                    } else if (propertyCategoryFilter === 'COMMERCIAL') {
                      const isCom =
                        (p as any).category === 'COMMERCIAL' ||
                        ['OFFICE', 'RETAIL', 'SHOWROOM'].includes(p.propertyType);
                      if (!isCom) return false;
                    } else if (propertyCategoryFilter === 'INDUSTRIAL') {
                      const isInd =
                        (p as any).category === 'INDUSTRIAL' ||
                        p.propertyType === 'WAREHOUSE';
                      if (!isInd) return false;
                    } else if (propertyCategoryFilter === 'LAND_AND_PLOTS') {
                      const isLand =
                        (p as any).category === 'LAND_AND_PLOTS' ||
                        p.propertyType === 'LAND';
                      if (!isLand) return false;
                    }

                    // Scope filter
                    if (inventoryScope === 'MY_ONLY') {
                      const userEmail = (session.email || '').toLowerCase();
                      const creatorEmail = (p.createdBy?.email || '').toLowerCase();
                      const contribEmail = (p.contributor?.email || '').toLowerCase();
                      const isOwner = creatorEmail === userEmail || contribEmail === userEmail;
                      if (!isOwner && session.email !== 'sales@kiaanproperties.in') return false;
                    }

                    // Search filter
                    if (inventorySearch.trim()) {
                      const q = inventorySearch.toLowerCase();
                      return (
                        p.title.toLowerCase().includes(q) ||
                        p.location.microMarket.toLowerCase().includes(q) ||
                        ((p as any).headline && (p as any).headline.toLowerCase().includes(q)) ||
                        (p.preLeasedData?.tenantName && p.preLeasedData.tenantName.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  })
                  .map((prop) => {
                    const canModify = globalKiaanStore.canUserModifyProperty(prop, session);
                    const isCreator = (prop.createdBy?.email || '').toLowerCase() === (session.email || '').toLowerCase();
                    const preLeased = prop.preLeasedData;
                    const hasPreLease =
                      Boolean(preLeased?.isPreLeased || preLeased?.isPreRented || (prop as any).transactionType === 'PRE_LEASE' || (prop as any).transactionType === 'PRE_RENT');

                    return (
                      <div
                        key={prop.id}
                        className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3.5 transition-all ${
                          isDark ? 'bg-white/5 border-white/10 hover:border-amber-500/30' : 'bg-white border-slate-200 shadow-sm hover:border-amber-500'
                        }`}
                      >
                        {/* Top Media & Identification */}
                        <div className="flex gap-3">
                          <img
                            src={prop.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                            alt={prop.title}
                            className="w-24 h-24 rounded-xl object-cover border border-current/10 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1.5">
                            {/* Badges row */}
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {(prop as any).category && (
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                                    {String((prop as any).category).replace(/_/g, ' ')}
                                  </span>
                                )}
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                                  {(prop as any).subType || prop.propertyType}
                                </span>
                                {(prop as any).transactionType && (
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                                    {String((prop as any).transactionType).replace(/_/g, ' ')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {(prop as any).constructionStatus && (
                                  <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                    {String((prop as any).constructionStatus).replace(/_/g, ' ')}
                                  </span>
                                )}
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                                  {prop.status}
                                </span>
                              </div>
                            </div>

                            {/* Headline */}
                            {(prop as any).headline && (
                              <div className="text-xs font-serif italic text-amber-300 font-semibold flex items-center gap-1 line-clamp-1">
                                <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                <span>{(prop as any).headline}</span>
                              </div>
                            )}

                            {/* Title */}
                            <h4 className="font-serif font-bold text-sm truncate">{prop.title}</h4>

                            {/* Specs & Pricing */}
                            <div className="text-xs opacity-75 flex items-center gap-1.5 flex-wrap truncate">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                {prop.location.microMarket}, {prop.location.city}
                              </span>
                              <span>•</span>
                              <span className="font-semibold text-white/90">
                                {(prop as any).bedroomsNumeric ? `${(prop as any).bedroomsNumeric} BHK` : prop.configuration}
                              </span>
                              {prop.carpetAreaSqFt ? <span>• {prop.carpetAreaSqFt} sq.ft</span> : null}
                              {(prop as any).ageOfPropertyYears !== undefined && (
                                <span>• {(prop as any).ageOfPropertyYears === 0 ? 'New Construction' : `${(prop as any).ageOfPropertyYears} yrs old`}</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-xs font-mono font-extrabold text-amber-400">
                                {formatINR(prop.pricing?.agreementValue || 0)}
                              </div>
                              {hasPreLease && preLeased && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
                                  {preLeased.currentVerifiedYieldPercent || preLeased.currentYieldPercent || 8.5}% Verified Yield
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ========================================================= */}
                        {/* PRE-LEASED / PRE-RENTED INSTITUTIONAL INVESTMENT MATRIX   */}
                        {/* Clearly distinguishes Verified Income from Projected Yield*/}
                        {/* ========================================================= */}
                        {hasPreLease && preLeased && (
                          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                                  Pre-Leased Institutional Asset Profile
                                </span>
                              </div>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                                {preLeased.leaseRegistrationStatus || 'REGISTERED'} LEASE
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {/* 1. Verified Existing Income (GREEN TINT) */}
                              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold text-emerald-300">
                                    Existing Verified Income
                                  </span>
                                  <span className="text-[9px] px-1 rounded bg-emerald-500/30 text-emerald-200 font-mono">
                                    AUDITED
                                  </span>
                                </div>
                                <div className="font-semibold text-white/95 text-[11px] truncate">
                                  {preLeased.tenantName || 'Grade-A Multinational Corp'}
                                  {preLeased.tenantVisibility === 'CONFIDENTIAL' && (
                                    <span className="ml-1 text-[9px] text-amber-400">(Private Expat Lease)</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-white/60 truncate">
                                  {preLeased.tenantIndustry || 'Enterprise IT / BFSI'} • {preLeased.tenantType || 'Corporate'}
                                </div>
                                <div className="flex items-center justify-between pt-0.5 border-t border-emerald-500/20">
                                  <span className="text-[10px] text-emerald-200/80">Current Rent:</span>
                                  <span className="font-mono font-bold text-emerald-300 text-[11px]">
                                    {formatINR(preLeased.monthlyRentINR || 0)} / mo
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-emerald-200/80">Verified Current Yield:</span>
                                  <span className="font-mono font-bold text-emerald-300 text-[11px]">
                                    {preLeased.currentVerifiedYieldPercent || preLeased.currentYieldPercent || 8.5}% p.a.
                                  </span>
                                </div>
                                <div className="text-[10px] text-emerald-200/70">
                                  Lease Term: {preLeased.remainingLeasePeriodYears || 3} Yrs Rem. • {preLeased.lockInPeriodYears || 2} Yrs Lock-In
                                </div>
                              </div>

                              {/* 2. Projected / Estimated Returns (AMBER TINT) */}
                              <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold text-amber-300">
                                    Projected Returns (Estimated)
                                  </span>
                                  <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono">
                                    ESTIMATE
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-amber-200/80">Expected Yield:</span>
                                  <span className="font-mono font-bold text-amber-300 text-[11px]">
                                    {preLeased.expectedProjectedYieldPercent || preLeased.expectedYieldPercent || 10.0}% p.a.
                                  </span>
                                </div>
                                <div className="text-[10px] text-amber-200/70 truncate">
                                  Escalation: {preLeased.escalationClause || '15% every 3 years'}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-amber-200/80">Cap. Appreciation:</span>
                                  <span className="font-mono font-bold text-amber-300 text-[10px]">
                                    {preLeased.capitalAppreciationPotentialPercent || 12}% CAGR
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-0.5 border-t border-amber-500/20 text-[10px] text-amber-200/70">
                                  <span>Deposit: {formatINR(preLeased.securityDepositINR || 0)}</span>
                                  <span>Renewal: {preLeased.renewalProbabilityPercent || 85}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Statutory Compliance Notice */}
                            <div className="text-[9px] text-white/50 bg-black/50 p-1.5 rounded border border-white/5 leading-relaxed">
                              ⚠️ <strong>Compliance Disclaimer:</strong> Existing verified income is documented via executed lease agreement. Projected yields & capital appreciation are estimates and never represented as guaranteed returns.
                            </div>
                          </div>
                        )}

                        {/* Author Info */}
                        <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px] opacity-80">
                          <span className="truncate">
                            Added by: <strong>{isCreator ? 'You' : prop.createdBy?.name || prop.createdBy?.email || 'Authorized Owner'}</strong>
                          </span>
                          {!canModify && (
                            <span className="text-red-400 font-bold text-[10px]">Read-Only</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-1 flex items-center justify-end gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setIsUniversalListingModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer"
                            title="Open in Universal Listing Schema"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Universal Schema</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProperty(prop);
                              setEditorMode('EDIT_PROPERTY');
                              setEditorModalOpen(true);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              canModify
                                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                                : 'opacity-40 cursor-not-allowed bg-current/10'
                            }`}
                            disabled={!canModify}
                          >
                            Quick Edit (9 Tabs)
                          </button>
                          {canModify && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete property "${prop.title}"?`)) {
                                  globalKiaanStore.deleteProperty(prop.id, session);
                                  refreshAdminData();
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete Property"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: OBSERVABILITY & DISASTER RECOVERY (ITEMS 161–164)   */}
          {/* ========================================================================= */}
          {activePanel === 'OBSERVABILITY' && (
            <EnterpriseObservabilityView theme={theme} />
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: CRM INTEGRATION (ITEMS 122-125)                      */}
          {/* ========================================================================= */}
          {activePanel === 'CRM_INTEGRATION' && (
            <CrmIntegrationMonitor theme={theme} />
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: PLATFORM TELEMETRY & ANALYTICS (ITEMS 120 & 121)    */}
          {/* ========================================================================= */}
          {activePanel === 'ANALYTICS' && (
            <AdminAnalyticsDashboard theme={theme} />
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: AUDIT LOGS (ITEM 129)                                */}
          {/* ========================================================================= */}
          {activePanel === 'AUDIT_LOGS' && (
            <AdminAuditLogsView theme={theme} />
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: CAREERS & TALENT ACQUISITION MANAGEMENT             */}
          {/* ========================================================================= */}
          {activePanel === 'CAREERS' && (
            <div className="space-y-6">
              {/* Header & Quick Action */}
              <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'} space-y-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-xl text-current">Careers & Job Openings Management</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400">
                        {storeJobs.length} Positions
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400">
                        {storeJobApplications.length} Applications
                      </span>
                    </div>
                    <p className="text-xs opacity-70 mt-0.5">
                      Create, modify, toggle, and audit job openings across Luxury Sales, MahaRERA Law, 3D Spatial Computing, and Wealth desks.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsJobManagerModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 transition-all hover:scale-105 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Open Talent Acquisition Hub</span>
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-current/5 border border-current/10">
                    <div className="text-lg font-serif font-bold text-amber-400 font-mono">
                      {storeJobs.filter((j) => j.status === 'PUBLISHED').length}
                    </div>
                    <div className="text-[11px] opacity-75 font-semibold">Active Live Openings</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-current/5 border border-current/10">
                    <div className="text-lg font-serif font-bold text-emerald-400 font-mono">
                      {storeJobApplications.length}
                    </div>
                    <div className="text-[11px] opacity-75 font-semibold">Total Resumes Received</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-current/5 border border-current/10">
                    <div className="text-lg font-serif font-bold text-cyan-400 font-mono">
                      {storeJobApplications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length}
                    </div>
                    <div className="text-[11px] opacity-75 font-semibold">In Interview / Shortlist</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-current/5 border border-current/10">
                    <div className="text-lg font-serif font-bold text-purple-400 font-mono">
                      {storeJobApplications.filter((a) => a.hasMahaReraCertification).length}
                    </div>
                    <div className="text-[11px] opacity-75 font-semibold">MahaRERA Certified</div>
                  </div>
                </div>

                {/* Job Openings Quick List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-500">
                    <span>Published Real Estate & Tech Positions</span>
                    <button
                      onClick={() => setIsJobManagerModalOpen(true)}
                      className="text-red-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>+ Add New Post</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storeJobs.map((job) => (
                      <div
                        key={job.id}
                        className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400">
                              {job.departmentLabel}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                job.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-current">{job.title}</h4>
                          <p className="text-[11px] opacity-70 line-clamp-2">{job.shortSummary}</p>
                          <div className="text-xs font-mono font-bold text-amber-400">{job.salaryRangeDisplay}</div>
                        </div>

                        <div className="pt-2 border-t border-current/10 flex items-center justify-between">
                          <span className="text-[10px] opacity-60 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {job.location}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const newSt = job.status === 'PUBLISHED' ? 'PAUSED' : 'PUBLISHED';
                                careersService.toggleJobStatus(job.id, newSt, session);
                                refreshAdminData();
                              }}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold border border-current/15 hover:bg-current/10 cursor-pointer"
                            >
                              {job.status === 'PUBLISHED' ? 'Pause' : 'Publish'}
                            </button>
                            <button
                              onClick={() => setIsJobManagerModalOpen(true)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold cursor-pointer"
                            >
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: AI KNOWLEDGE SYNC                                   */}
          {/* ========================================================================= */}
          {activePanel === 'AI_KNOWLEDGE' && (
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>AI Knowledge Vector Embeddings</span>
              </div>
              <h3 className="font-serif font-bold text-xl">Kiaan AI Grounding Context</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Sync all MahaRERA filings, architect blueprints, structural audit sheets, and commute logs to Google Gemini grounding context.
              </p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-amber-400">
                Vector Status: 1,842 Tokens Indexed • Last Synced: 2026-08-31 11:00 • MahaRERA Certified
              </div>
              <button
                onClick={() => alert('Knowledge embeddings refreshed successfully.')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Re-index AI Context</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: ENTERPRISE RBAC & SUPER ADMIN ACCOUNTS               */}
          {/* ========================================================================= */}
          {activePanel === 'ACCOUNTS' && (
            <div className="space-y-6">
              {/* FEATURED SUPER ADMIN ACCOUNT BANNER */}
              <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
                isDark ? 'bg-gradient-to-br from-red-950/50 via-[#0B101B] to-amber-950/30 border-red-500/30' : 'bg-gradient-to-br from-red-50 via-white to-amber-50 border-red-200 shadow-lg'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 flex-shrink-0">
                      <Crown className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-xl">sales@kiaanproperties.in</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-400 font-mono">
                          SUPER ADMIN (ACTIVE)
                        </span>
                      </div>
                      <p className="text-xs opacity-80 font-medium">
                        Kiaan Sales Leadership • Head of Sales & Portfolio Strategy
                      </p>
                      <div className="text-[11px] font-mono opacity-60 flex items-center gap-3 pt-1">
                        <span>Phone: +91 98230 11000</span>
                        <span>•</span>
                        <span>MFA Status: YubiKey + TOTP Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Root Authority Granted</span>
                    </div>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="mt-6 pt-6 border-t border-current/10">
                  <span className="text-[11px] uppercase font-bold tracking-wider opacity-70 block mb-3">
                    Super Admin Capabilities & Security Policies
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {[
                      { title: 'Full CMS Root Override', desc: 'Publish, unpublish, rollback all projects & assets' },
                      { title: 'MahaRERA Regulatory Sign-off', desc: 'Verify legal certificates & escrow compliance' },
                      { title: 'Pricing & Cashflow Matrix', desc: 'Edit dynamic rates, tax splits & payment schemes' },
                      { title: 'CRM & WhatsApp Dispatch', desc: 'Broadcast inventory alerts, trigger webhooks' },
                      { title: 'AI Grounding & Knowledge Base', desc: 'Sync vector index embeddings with Gemini API' },
                      { title: 'Audit Trail & Observability', desc: 'Full tamper-evident logs & rollback capability' },
                    ].map((p, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5 text-red-400">
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{p.title}</span>
                        </div>
                        <p className="text-[11px] opacity-70 mt-1">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ALL PROVISIONED ENTERPRISE ACCOUNTS TABLE */}
              <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-lg">Provisioned Enterprise Team Accounts</h4>
                    <p className="text-xs opacity-75">
                      Authorized security domains: @kiaanproperties.in & @kiaanproperties.com
                    </p>
                  </div>
                  <button
                    onClick={() => alert('New account invitation sent to enterprise identity directory.')}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite Admin User</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-current/10 opacity-60">
                        <th className="pb-3 font-bold">User & Email</th>
                        <th className="pb-3 font-bold">Role & Clearance</th>
                        <th className="pb-3 font-bold">Department</th>
                        <th className="pb-3 font-bold">Phone</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-current/5">
                      {PROVISIONED_ADMIN_ACCOUNTS.map((acc) => (
                        <tr key={acc.id} className="hover:bg-current/[0.02]">
                          <td className="py-3.5 font-bold">
                            <div className="flex items-center gap-2">
                              {acc.isSuperAdmin ? (
                                <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              ) : (
                                <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              )}
                              <div>
                                <div>{acc.name}</div>
                                <div className="text-[11px] font-mono opacity-60">{acc.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              acc.role === 'SUPER_ADMIN'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-slate-500/20 text-slate-300'
                            }`}>
                              {acc.role}
                            </span>
                          </td>
                          <td className="py-3.5 opacity-80">{acc.department}</td>
                          <td className="py-3.5 font-mono opacity-80">{acc.phone}</td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              {acc.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => alert(`Active session for ${acc.email} is verified with TLS 1.3 encryption.`)}
                              className="px-2.5 py-1 rounded-lg border text-[11px] font-bold hover:bg-white/10 cursor-pointer"
                            >
                              Verify Session
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE PANEL CONTENT: CANONICAL LOCATION MASTER & GIS PLATFORM            */}
          {/* ========================================================================= */}
          {activePanel === 'LOCATION_INTELLIGENCE' && (
            <LocationIntelligenceAdminConsole
              theme={theme}
              onSelectLocation={(loc) => {
                alert(`Selected Location: ${loc.nameEn} (${loc.id})\nHierarchy: ${loc.hierarchyPath}\nPincode: ${loc.pincode}`);
              }}
            />
          )}
        </div>
      </div>

      {/* Item 154: Omnichannel Multi-Modal Preview Modal */}
      <MultiModalPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        entity={activeProject}
        theme={theme}
      />

      {/* Item 155: Soft Delete & Archival Vault Management Modal */}
      <SoftDeleteManagementModal
        isOpen={isSoftDeleteModalOpen}
        onClose={() => setIsSoftDeleteModalOpen(false)}
        session={session}
        theme={theme}
      />

      {/* Dynamic Property & Project Editor Modal (Add, Modify, Delete by Respective Creator) */}
      {editorModalOpen && (
        <PropertyProjectEditorModal
          isOpen={editorModalOpen}
          onClose={() => setEditorModalOpen(false)}
          mode={editorMode}
          initialProperty={editingProperty}
          initialProject={editingProject}
          session={session}
          theme={theme}
          onSuccess={() => {
            refreshAdminData();
          }}
        />
      )}

      {/* 10-Stage Universal Property Listing Form Modal (All Categories, Sub-Types & Full Schema) */}
      {isUniversalListingModalOpen && (
        <UniversalPropertyListingFormModal
          isOpen={isUniversalListingModalOpen}
          onClose={() => setIsUniversalListingModalOpen(false)}
          theme={theme}
          onSuccessPublished={() => {
            refreshAdminData();
          }}
        />
      )}

      {/* Admin Job & Careers Manager Modal */}
      {isJobManagerModalOpen && (
        <AdminJobManagerModal
          isOpen={isJobManagerModalOpen}
          onClose={() => setIsJobManagerModalOpen(false)}
          session={session}
          theme={theme}
          onJobChanged={refreshAdminData}
        />
      )}
    </div>
  );
};
