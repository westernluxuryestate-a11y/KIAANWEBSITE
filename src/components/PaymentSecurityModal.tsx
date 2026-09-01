/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Lock,
  DollarSign,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { TokenizedPaymentRecord } from '../types';
import { securityAndPrivacyEngine } from '../services/securityAndPrivacyEngine';

interface PaymentSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const PaymentSecurityModal: React.FC<PaymentSecurityModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const payments = securityAndPrivacyEngine.getTokenizedPayments();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#0B101C] text-white border-white/15' : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold">Payment Security & Tokenized Escrow Ledger</h2>
              <p className="text-xs opacity-70">
                Item 128 Mandate: Zero Raw Card/CVV Storage • RBI Compliant Escrow Trust Nodes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-current/15 hover:bg-current/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Principles Banner */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#070A11] border-emerald-500/20' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Raw Cards</span>
              </div>
              <p className="opacity-70 text-[11px] leading-relaxed">
                Card numbers, CVVs, and netbanking credentials are never transmitted to or stored on Kiaan servers.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#070A11] border-blue-500/20' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 font-bold text-blue-400 mb-1">
                <Building className="w-4 h-4" />
                <span>RERA Escrow Nodes</span>
              </div>
              <p className="opacity-70 text-[11px] leading-relaxed">
                Tokens flow directly into designated RERA-compliant separate bank accounts with dual-signatory release.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#070A11] border-purple-500/20' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 font-bold text-purple-400 mb-1">
                <FileText className="w-4 h-4" />
                <span>Cryptographic Invoices</span>
              </div>
              <p className="opacity-70 text-[11px] leading-relaxed">
                Every reservation receipt carries an immutable SHA-256 hash verifying statutory tax compliance.
              </p>
            </div>
          </div>

          {/* Tokenized Records Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-current/10">
              <span className="font-serif font-bold text-sm">Audited Tokenized Transactions</span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">● Live Escrow Trust</span>
            </div>

            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.transactionId}
                  className={`p-4 rounded-2xl border space-y-3 font-mono ${
                    isDark ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-amber-500 block text-xs">{p.transactionId}</span>
                      <span className="text-[10px] opacity-60 block">{p.assetTitle}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-400 text-sm block">
                        ₹{(p.amountINR / 100000).toFixed(2)} Lakhs
                      </span>
                      <span className="text-[10px] opacity-60 block">{p.status}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-current/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] opacity-75">
                    <div>
                      <span className="opacity-50 block uppercase">Payment Method:</span>
                      <span className="font-bold text-current">{p.maskedPaymentMethod}</span>
                    </div>
                    <div>
                      <span className="opacity-50 block uppercase">Escrow Account:</span>
                      <span className="font-bold text-current">{p.escrowTrustAccountRef}</span>
                    </div>
                    <div>
                      <span className="opacity-50 block uppercase">Gateway Provider:</span>
                      <span className="font-bold text-current">{p.gatewayProvider}</span>
                    </div>
                    <div>
                      <span className="opacity-50 block uppercase">Tax Invoice Hash:</span>
                      <span className="font-bold text-current truncate block">{p.taxInvoiceHash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-current/10 bg-current/5 flex items-center justify-between text-xs font-mono">
          <span className="opacity-70">Security Protocol: TLS 1.3 • AES-256 GCM</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
