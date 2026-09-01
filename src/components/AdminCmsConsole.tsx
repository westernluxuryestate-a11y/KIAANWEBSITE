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
} from 'lucide-react';
import { Project, Property, Unit, UserRole, UserSession } from '../types';
import { formatINR } from '../services/calculatorEngine';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { CrmIntegrationMonitor } from './CrmIntegrationMonitor';
import { AdminAuditLogsView } from './AdminAuditLogsView';

interface AdminCmsConsoleProps {
  session: UserSession;
  projects: Project[];
  properties: Property[];
  theme?: 'dark' | 'light';
  onClose: () => void;
  onUpdateProject?: (updatedProject: Project) => void;
}

export type CmsWorkflowStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'COMPLIANCE_CHECK'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | 'ARCHIVED';

export interface PublishQualityScore {
  overallScore: number;
  basicData: number; // /10
  media: number; // /15
  price: number; // /15
  location: number; // /10
  seo: number; // /10
  documents: number; // /10
  rera: number; // /15
  complianceBlockers: string[];
  ctaMobileReady: boolean;
}

export const AdminCmsConsole: React.FC<AdminCmsConsoleProps> = ({
  session,
  projects,
  properties,
  theme = 'dark',
  onClose,
  onUpdateProject,
}) => {
  const isDark = theme === 'dark';

  // Navigation Sub-Panels
  const [activePanel, setActivePanel] = useState<
    | 'PROJECTS'
    | 'PROPERTIES'
    | 'UNITS'
    | 'PRICING'
    | 'MEDIA'
    | 'RERA_COMPLIANCE'
    | 'CRM_INTEGRATION'
    | 'ANALYTICS'
    | 'AI_KNOWLEDGE'
    | 'SEO_SETTINGS'
    | 'AUDIT_LOGS'
  >('PROJECTS');

  // Selected Item for Workflow & Quality Score Inspection
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

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

  // Calculate Publish Quality Score
  const calculateQuality = (proj: Project): PublishQualityScore => {
    let basicData = proj.name && proj.overviewStory ? 10 : 6;
    let media = proj.media && proj.media.length >= 3 ? 15 : 8;
    let price = proj.headlinePriceRange.min > 0 ? 15 : 5;
    let location = proj.location?.landmarks?.length ? 10 : 5;
    let seo = proj.slug ? 10 : 4;
    let documents = proj.specifications?.length ? 10 : 4;
    let rera = proj.reraRecord?.status === 'REGISTERED' ? 15 : 0;

    const complianceBlockers: string[] = [];
    if (!proj.reraRecord || proj.reraRecord.status !== 'REGISTERED') {
      complianceBlockers.push('CRITICAL: MahaRERA Registration Certificate unverified or expired.');
    }
    if (!proj.headlinePriceRange || proj.headlinePriceRange.min <= 0) {
      complianceBlockers.push('CRITICAL: Transparent acquisition pricing matrix not defined.');
    }

    const total = basicData + media + price + location + seo + documents + rera + 9; // +9 for mobile preview pass
    return {
      overallScore: Math.min(100, total),
      basicData,
      media,
      price,
      location,
      seo,
      documents,
      rera,
      complianceBlockers,
      ctaMobileReady: true,
    };
  };

  const qualityScore = calculateQuality(activeProject);

  // Workflow transition handler with RBAC validation
  const handleWorkflowTransition = (newStatus: CmsWorkflowStatus) => {
    // RBAC Security Enforcement
    if (newStatus === 'APPROVED' || newStatus === 'PUBLISHED') {
      if (session.role !== 'SUPER_ADMIN' && session.role !== 'WEBSITE_ADMIN') {
        alert(`ACCESS DENIED: Role "${session.role}" lacks permissions to approve/publish production live assets.`);
        return;
      }
    }

    if (newStatus === 'PUBLISHED' && qualityScore.complianceBlockers.length > 0) {
      alert(`HARD COMPLIANCE BLOCKER: Cannot publish. Fix the following first:\n${qualityScore.complianceBlockers.join('\n')}`);
      return;
    }

    setWorkflowStatus(newStatus);
    const newLog = {
      id: `log-${Date.now()}`,
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
              <h1 className="font-serif font-bold text-base sm:text-lg">Kiaan Estates Enterprise CMS</h1>
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

      {/* 2. MAIN CMS WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT NAVIGATION SIDEBAR */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-3xl border space-y-2 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-[10px] uppercase font-bold tracking-widest text-red-500 px-3 block">
              Core CMS Modules
            </span>

            {[
              { id: 'PROJECTS', label: 'Projects & Master Plans', icon: Building },
              { id: 'PROPERTIES', label: 'Resale & Standalone Assets', icon: Layers },
              { id: 'UNITS', label: 'Towers, Floors & Units', icon: SlidersHorizontal },
              { id: 'PRICING', label: 'Pricing & Escrow Outlays', icon: DollarSign },
              { id: 'MEDIA', label: 'Media, 3D Twins & Drone', icon: Camera },
              { id: 'RERA_COMPLIANCE', label: 'MahaRERA & Legal Dossiers', icon: ShieldCheck },
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
                      <RotateCcw className="w-3 h-3" />
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
          {/* SECTION: PUBLISH QUALITY SCORE & WORKFLOW ACTION BAR                      */}
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
                    {projects.map((p) => (
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

              {/* Workflow Stepper Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
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

            {/* PUBLISH QUALITY SCORE MATRIX */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif font-bold text-lg">Publish Quality Score</h3>
                </div>
                <div className="text-2xl font-serif font-bold font-mono text-emerald-400">
                  {qualityScore.overallScore}% READY
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-current/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${qualityScore.overallScore}%` }}
                ></div>
              </div>

              {/* Sub-Score Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-current/10 text-center">
                  <span className="opacity-60 block text-[10px]">Basic Data</span>
                  <span className="font-bold text-amber-500 font-mono">{qualityScore.basicData}/10</span>
                </div>
                <div className="p-2.5 rounded-xl border border-current/10 text-center">
                  <span className="opacity-60 block text-[10px]">Media Assets</span>
                  <span className="font-bold text-amber-500 font-mono">{qualityScore.media}/15</span>
                </div>
                <div className="p-2.5 rounded-xl border border-current/10 text-center">
                  <span className="opacity-60 block text-[10px]">Pricing Outlay</span>
                  <span className="font-bold text-amber-500 font-mono">{qualityScore.price}/15</span>
                </div>
                <div className="p-2.5 rounded-xl border border-current/10 text-center">
                  <span className="opacity-60 block text-[10px]">Location Commute</span>
                  <span className="font-bold text-amber-500 font-mono">{qualityScore.location}/10</span>
                </div>
                <div className="p-2.5 rounded-xl border border-current/10 text-center">
                  <span className="opacity-60 block text-[10px]">SEO Metadata</span>
                  <span className="font-bold text-amber-500 font-mono">{qualityScore.seo}/10</span>
                </div>
                <div className="p-2.5 rounded-xl border border-current/10 text-center">
                  <span className="opacity-60 block text-[10px]">Specifications</span>
                  <span className="font-bold text-amber-500 font-mono">{qualityScore.documents}/10</span>
                </div>
                <div className="p-2.5 rounded-xl border border-current/10 text-center">
                  <span className="opacity-60 block text-[10px]">MahaRERA Audit</span>
                  <span className="font-bold text-emerald-400 font-mono">{qualityScore.rera}/15</span>
                </div>
              </div>

              {/* Hard Compliance Blockers Warning Box */}
              {qualityScore.complianceBlockers.length > 0 ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
                  <div className="font-bold text-red-400 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Hard Compliance Blockers Detected (Independent of % Score)</span>
                  </div>
                  <ul className="list-disc list-inside text-red-300 opacity-90">
                    {qualityScore.complianceBlockers.map((blk, i) => (
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
          {/* ACTIVE PANEL CONTENT: PROJECTS / TOWERS / INVENTORY                       */}
          {/* ========================================================================= */}
          {activePanel === 'PROJECTS' && (
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#0B101B] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-current">Towers & Floor Stacks Management</h3>
                <button
                  onClick={() => alert('New Tower creation wizard opened.')}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tower</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeProject.towers?.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl border border-current/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">{t.name}</h4>
                      <span className="text-xs font-mono text-amber-500 font-bold">{t.availableUnits} Available</span>
                    </div>
                    <p className="text-xs opacity-75">{t.totalFloors} Floors • Stage: {t.constructionStage}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => alert(`Editing Tower ${t.name}`)}
                        className="px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer hover:bg-white/10"
                      >
                        Edit Stacks
                      </button>
                      <button
                        onClick={() => alert(`Regenerated 3D ray-tracing coordinates for ${t.name}`)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold cursor-pointer"
                      >
                        Sync 3D Coordinates
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};
