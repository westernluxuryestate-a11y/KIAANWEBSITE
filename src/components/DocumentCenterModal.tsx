/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Lock,
  Download,
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Layers,
  Calendar,
  Building,
  HelpCircle,
  Eye,
  Key,
} from 'lucide-react';
import { DocumentCategory, DocumentItem, UserSession } from '../types';
import {
  SAMPLE_PROJECT_DOCUMENTS,
  explainDocumentQuery,
  MANDATORY_AI_DOCUMENT_DISCLAIMER,
} from '../services/documentCenterService';

interface DocumentCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  userSession?: UserSession | null;
  onOpenLoginModal?: () => void;
  theme?: 'dark' | 'light';
}

const CATEGORY_TABS: { key: DocumentCategory | 'ALL'; label: string; icon: any }[] = [
  { key: 'ALL', label: 'All Documents', icon: Layers },
  { key: 'BROCHURE', label: 'Brochure', icon: FileText },
  { key: 'PRICE_SHEET', label: 'Price Sheet', icon: FileText },
  { key: 'PAYMENT_PLAN', label: 'Payment Plan', icon: Calendar },
  { key: 'FLOOR_PLANS', label: 'Floor Plans', icon: Building },
  { key: 'PROJECT_DOCUMENTS', label: 'Project Approvals', icon: ShieldCheck },
  { key: 'RERA_INFORMATION', label: 'MahaRERA Certs', icon: ShieldCheck },
  { key: 'BOOKING_DOCUMENTS', label: 'Booking Agreement', icon: Lock },
  { key: 'RECEIPTS', label: 'Escrow Receipts', icon: Lock },
];

export const DocumentCenterModal: React.FC<DocumentCenterModalProps> = ({
  isOpen,
  onClose,
  projectId = 'proj_one_vertica_wakad',
  projectName = 'Kiaan One Vertica',
  userSession,
  onOpenLoginModal,
  theme = 'dark',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [activeDoc, setActiveDoc] = useState<DocumentItem>(SAMPLE_PROJECT_DOCUMENTS[0]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<{
    answer: string;
    keyClauses: string[];
    disclaimer: string;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isAuthenticated = Boolean(userSession);

  const filteredDocs = SAMPLE_PROJECT_DOCUMENTS.filter((doc) => {
    if (selectedCategory === 'ALL') return true;
    return doc.category === selectedCategory;
  });

  const handleAskAi = (promptText: string) => {
    if (!promptText.trim()) return;
    setIsAiLoading(true);
    setTimeout(() => {
      const result = explainDocumentQuery(activeDoc, promptText);
      setAiAnswer({
        answer: result.answer,
        keyClauses: result.keyClausesExtracted,
        disclaimer: result.disclaimer,
      });
      setIsAiLoading(false);
    }, 300);
  };

  const handleDownload = (doc: DocumentItem) => {
    if (doc.isCustomerSpecific && !isAuthenticated) {
      if (onOpenLoginModal) onOpenLoginModal();
      return;
    }
    setDownloadToast(`Preparing ${doc.fileName}...`);
    setTimeout(() => {
      setDownloadToast(`Downloaded ${doc.fileName}`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-6xl h-[92vh] max-h-[850px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#080D1A] border-amber-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between flex-shrink-0 bg-current/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold tracking-wide">Document Center & Regulatory Repository</h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  MahaRERA Verified
                </span>
              </div>
              <p className="text-xs opacity-60">
                Official statutory disclosures, sanctioned CAD blueprints, price sheets, and AI legal explainer for {projectName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authenticated VIP Client</span>
              </div>
            ) : (
              <button
                onClick={() => onOpenLoginModal && onOpenLoginModal()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Unlock Private Documents</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-current/10 opacity-60 hover:opacity-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {downloadToast && (
          <div className="bg-amber-500 text-black text-xs font-bold py-1.5 px-4 text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* MODAL BODY (TWO COLUMNS: DOC BROWSER & AI EXPLAINER) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT COLUMN: DOCUMENT DIRECTORY (7 COLS) */}
          <div className="lg:col-span-7 border-r border-current/10 flex flex-col overflow-hidden">
            {/* CATEGORY FILTER TABS */}
            <div className="p-4 border-b border-current/10 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0 bg-current/[0.02]">
              {CATEGORY_TABS.map((tab) => {
                const isSelected = selectedCategory === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedCategory(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                        : isDark
                        ? 'bg-white/5 hover:bg-white/10 text-white/70'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* DOCUMENT LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredDocs.map((doc) => {
                const isSelected = activeDoc.id === doc.id;
                const isLocked = doc.isCustomerSpecific && !isAuthenticated;

                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setActiveDoc(doc);
                      setAiAnswer(null);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-amber-500/10 border-amber-500 shadow-lg'
                          : 'bg-amber-50 border-amber-500 shadow-md'
                        : isDark
                        ? 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isLocked
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                          }`}
                        >
                          {isLocked ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-current/10">
                              {doc.category.replace('_', ' ')}
                            </span>
                            {doc.verificationBadge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                {doc.verificationBadge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm mt-1 truncate">{doc.title}</h4>
                          <p className="text-xs opacity-60 line-clamp-2 mt-1 leading-relaxed">{doc.summary}</p>
                          <div className="flex items-center gap-4 text-[11px] opacity-50 mt-2">
                            <span>{(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                            <span>•</span>
                            <span>{doc.fileFormat}</span>
                            <span>•</span>
                            <span>{doc.issuanceDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc);
                          }}
                          className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isLocked
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                              : 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border border-amber-500/30'
                          }`}
                          title={isLocked ? 'Login required to download' : 'Download Document'}
                        >
                          {isLocked ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                          <span className="hidden sm:inline">{isLocked ? 'Unlock' : 'Download'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: AI DOCUMENT EXPLAINER SUITE (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col overflow-hidden bg-current/[0.02]">
            {/* AI EXPLAINER HEADER */}
            <div className="p-4 border-b border-current/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">AI Document Explainer™</h3>
                  <p className="text-[11px] opacity-60">Active: {activeDoc.title.slice(0, 32)}...</p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                MahaRERA Trained
              </span>
            </div>

            {/* PRE-SET QUICK PROMPTS */}
            <div className="p-4 border-b border-current/10 space-y-2 flex-shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Quick Queries</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Explain this document simply.',
                  'What is the payment schedule?',
                  'What possession date is mentioned?',
                  'What are default/cancellation clauses?',
                  'What is the 5-year defect warranty?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setAiQuery(prompt);
                      handleAskAi(prompt);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium border text-left transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white/5 border-white/10 hover:bg-amber-500/15 hover:border-amber-500/40 text-white/80 hover:text-white'
                        : 'bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-400 text-slate-700'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* AI CONVERSATION / RESPONSE AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                  <span className="text-xs font-bold text-amber-500">Parsing statutory clauses & escrow data...</span>
                </div>
              ) : aiAnswer ? (
                <div className="space-y-4 animate-fade-in">
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-amber-500/5 border-amber-500/30' : 'bg-amber-50/50 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Executive Legal Summary</span>
                    </div>
                    <div className="text-xs leading-relaxed whitespace-pre-line space-y-2 opacity-90">
                      {aiAnswer.answer}
                    </div>

                    {aiAnswer.keyClauses && aiAnswer.keyClauses.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-current/10 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                          Extracted Key Clauses:
                        </span>
                        {aiAnswer.keyClauses.map((clause, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] opacity-80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{clause}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* MANDATORY LEGAL DISCLAIMER CALLOUT AS REQUIRED */}
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 text-[11px] leading-relaxed ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-700 text-slate-300'
                        : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-500">Statutory Notice: </span>
                      {aiAnswer.disclaimer}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-3 opacity-60">
                  <Bot className="w-10 h-10 mx-auto text-amber-500 opacity-60" />
                  <p className="text-xs max-w-xs mx-auto">
                    Select a document on the left and ask a question above, or type a custom prompt below to parse clauses simply.
                  </p>
                </div>
              )}
            </div>

            {/* AI CHAT INPUT BOX */}
            <div className="p-4 border-t border-current/10 flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi(aiQuery)}
                placeholder={`Ask anything about ${activeDoc.title.slice(0, 20)}...`}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 focus:border-amber-500 text-white placeholder-white/40'
                    : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                onClick={() => handleAskAi(aiQuery)}
                disabled={!aiQuery.trim() || isAiLoading}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black transition-all cursor-pointer"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
