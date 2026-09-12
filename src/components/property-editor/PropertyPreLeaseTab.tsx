import React from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  TrendingUp,
  FileText,
  Calendar,
  Lock,
  DollarSign,
} from 'lucide-react';
import { PreLeasedState } from './propertyEditorTypes';
import { formatINR } from '../../services/calculatorEngine';

interface PropertyPreLeaseTabProps {
  canModify: boolean;
  data: PreLeasedState;
  onChange: (updated: PreLeasedState) => void;
}

export const PropertyPreLeaseTab: React.FC<PropertyPreLeaseTabProps> = ({
  canModify,
  data,
  onChange,
}) => {
  const updateField = <K extends keyof PreLeasedState>(field: K, val: PreLeasedState[K]) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & MANDATORY REGULATORY NOTICE */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-black/60 to-slate-900/60 border border-emerald-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">
                Pre-Leased &amp; Pre-Rented Institutional Investment Parameters
              </h3>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Structured institutional acquisition dossier for income-generating assets with existing verified yield.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
            High-Yield Capital Engine
          </span>
        </div>

        {/* CRITICAL STATUTORY DISCLAIMER: NEVER REPRESENT PROJECTED RETURNS AS GUARANTEED */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="font-bold text-amber-300">Regulatory Mandate &amp; Transparency Rule:</strong> Projected returns, estimated yields, and future appreciation are purely illustrative projections and <strong className="underline text-amber-100">must NEVER be represented as guaranteed</strong>. Existing verified income is documented strictly on executed sub-registrar registered leases and audited bank payout statements.
          </div>
        </div>

        {/* Core Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white/90 p-1">
            <input
              type="checkbox"
              disabled={!canModify}
              checked={data.isPreLeased}
              onChange={(e) => updateField('isPreLeased', e.target.checked)}
              className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-0"
            />
            <span>Pre-Leased (Commercial Asset)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white/90 p-1">
            <input
              type="checkbox"
              disabled={!canModify}
              checked={data.isPreRented}
              onChange={(e) => updateField('isPreRented', e.target.checked)}
              className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-0"
            />
            <span>Pre-Rented (Residential / Co-Living)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white/90 p-1">
            <input
              type="checkbox"
              disabled={!canModify}
              checked={data.hasExistingTenant}
              onChange={(e) => updateField('hasExistingTenant', e.target.checked)}
              className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-0"
            />
            <span>Existing Tenant In Place</span>
          </label>
        </div>
      </div>

      {/* 2. TENANT PROFILE & VISIBILITY CONTROLS */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <span className="text-xs font-bold text-white/80 block uppercase tracking-wide">
          Tenant Profile &amp; Confidentiality Settings
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/90 block">
                Tenant Name / Brand <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                disabled={!canModify}
                onClick={() => updateField('isTenantNamePublic', !data.isTenantNamePublic)}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
              >
                {data.isTenantNamePublic ? (
                  <>
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Public Visibility</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-300">Private / Confidential Masking</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              disabled={!canModify}
              value={data.tenantName}
              onChange={(e) => updateField('tenantName', e.target.value)}
              placeholder="e.g. MNC Bank / IT Fortune 500 / Retail Anchor"
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 font-medium"
            />
            <p className="text-[10px] text-white/50">
              {data.isTenantNamePublic
                ? 'Tenant name is visible publicly on pitch decks & investor cards.'
                : 'Tenant name is masked on public listing (shown as "Confidential Blue-Chip MNC").'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90 block">Tenant Type</label>
            <select
              disabled={!canModify}
              value={data.tenantType}
              onChange={(e) => updateField('tenantType', e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="BANK" className="bg-slate-900 text-white">Nationalized / Private Bank</option>
              <option value="MNC" className="bg-slate-900 text-white">Fortune 500 MNC</option>
              <option value="DOMESTIC_CORPORATE" className="bg-slate-900 text-white">Blue-Chip Corporate</option>
              <option value="HIGH_STREET_RETAIL" className="bg-slate-900 text-white">Anchor Retail Brand</option>
              <option value="GOVERNMENT" className="bg-slate-900 text-white">PSU / Government Entity</option>
              <option value="INDIVIDUAL" className="bg-slate-900 text-white">High Net Worth Individual</option>
              <option value="SME" className="bg-slate-900 text-white">Established SME</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90 block">Tenant Industry</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.tenantIndustry}
              onChange={(e) => updateField('tenantIndustry', e.target.value)}
              placeholder="e.g. BFSI / SaaS / Healthcare / FMCG"
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* 3. TWO CLEARLY DISTINGUISHED COLUMNS: VERIFIED INCOME vs PROJECTED / ESTIMATED INCOME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* COLUMN 1: EXISTING VERIFIED INCOME (Audited & In-Place) */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                1. Existing Verified Income
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Audited Payouts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Monthly Rent (INR) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                disabled={!canModify}
                value={data.monthlyRentINR}
                onChange={(e) => {
                  const m = parseFloat(e.target.value) || 0;
                  onChange({
                    ...data,
                    monthlyRentINR: m,
                    annualRentINR: m * 12,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono font-bold"
              />
              <span className="text-[10px] text-emerald-400/90 font-mono">
                ₹{(data.monthlyRentINR / 100000).toFixed(2)} Lakhs/month
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Annual Rent (INR)
              </label>
              <input
                type="number"
                disabled
                value={data.monthlyRentINR * 12}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white font-mono font-bold opacity-80"
              />
              <span className="text-[10px] text-emerald-400/90 font-mono">
                {formatINR(data.monthlyRentINR * 12)} / year
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Current Verified Yield (% ROI)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  disabled={!canModify}
                  value={data.currentYieldPercent}
                  onChange={(e) => updateField('currentYieldPercent', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-emerald-300 font-mono font-bold"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-emerald-400">% p.a.</span>
              </div>
              <span className="text-[10px] text-white/50">Computed on actual in-place agreement</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Rent Payment History
              </label>
              <select
                disabled={!canModify}
                value={data.rentPaymentHistory}
                onChange={(e) => updateField('rentPaymentHistory', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="FLAWLESS_ON_TIME" className="bg-slate-900 text-white">Flawless (On-Time Every Month)</option>
                <option value="OCCASIONAL_DELAY" className="bg-slate-900 text-white">Occasional Grace Period</option>
                <option value="NEW_TENANT" className="bg-slate-900 text-white">New Lease (&lt; 6 Months)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Escalation Clause
              </label>
              <input
                type="text"
                disabled={!canModify}
                value={data.escalationClause}
                onChange={(e) => updateField('escalationClause', e.target.value)}
                placeholder="e.g. 15% every 3 years / 5% annual"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Occupancy Status
              </label>
              <select
                disabled={!canModify}
                value={data.occupancyStatus}
                onChange={(e) => updateField('occupancyStatus', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="FULLY_OCCUPIED" className="bg-slate-900 text-white">100% Fully Occupied</option>
                <option value="PARTIALLY_OCCUPIED" className="bg-slate-900 text-white">Partially Occupied</option>
                <option value="VACANT" className="bg-slate-900 text-white">Vacant / Fit-Out Stage</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90 block">
              Lease Registration Status
            </label>
            <select
              disabled={!canModify}
              value={data.leaseRegistrationStatus}
              onChange={(e) => updateField('leaseRegistrationStatus', e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="REGISTERED" className="bg-slate-900 text-white">Registered with Sub-Registrar</option>
              <option value="IN_PROCESS" className="bg-slate-900 text-white">Registration In Process</option>
              <option value="UNREGISTERED" className="bg-slate-900 text-white">Notarized / Unregistered</option>
            </select>
          </div>
        </div>

        {/* COLUMN 2: PROJECTED / ESTIMATED INCOME (Illustrative - Non-Guaranteed) */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                2. Projected / Estimated Returns
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Estimated • NOT Guaranteed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Expected Yield (% ROI - Projected)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  disabled={!canModify}
                  value={data.expectedYieldPercent}
                  onChange={(e) => updateField('expectedYieldPercent', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-xs text-amber-300 font-mono font-bold"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-amber-400">% p.a.</span>
              </div>
              <span className="text-[10px] text-amber-400/80">Projected upon rent escalation / reversion</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Capital Appreciation Potential
              </label>
              <select
                disabled={!canModify}
                value={data.capitalAppreciationPotential}
                onChange={(e) => updateField('capitalAppreciationPotential', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="HIGH" className="bg-slate-900 text-white">High (Expanding Micro-Market)</option>
                <option value="MODERATE" className="bg-slate-900 text-white">Moderate / Steady Growth</option>
                <option value="STABLE" className="bg-slate-900 text-white">Stable / Mature Yield Core</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Tenant Credit Profile
              </label>
              <select
                disabled={!canModify}
                value={data.tenantCreditProfile}
                onChange={(e) => updateField('tenantCreditProfile', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="AAA_INVESTMENT_GRADE" className="bg-slate-900 text-white">AAA - Sovereign / Top Tier MNC</option>
                <option value="AA_BLUE_CHIP" className="bg-slate-900 text-white">AA - Blue-Chip Public Corporate</option>
                <option value="A_ESTABLISHED" className="bg-slate-900 text-white">A - Established National Entity</option>
                <option value="SME_UNRATED" className="bg-slate-900 text-white">SME / Private Entity (Unrated)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/90 block">
                Renewal Probability
              </label>
              <select
                disabled={!canModify}
                value={data.renewalProbability}
                onChange={(e) => updateField('renewalProbability', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="HIGH" className="bg-slate-900 text-white">High (High Capex Fit-Out Invested)</option>
                <option value="MEDIUM" className="bg-slate-900 text-white">Medium (Standard Commercial Term)</option>
                <option value="LOW" className="bg-slate-900 text-white">Low (Relocation Planned / In Reversion)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90 block">
              Total Asset Investment Value (INR)
            </label>
            <input
              type="number"
              disabled={!canModify}
              value={data.investmentValueINR}
              onChange={(e) => updateField('investmentValueINR', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono font-bold"
            />
            <span className="text-[10px] text-amber-400/90 font-mono">
              {formatINR(data.investmentValueINR)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. LEASE DATES, REMAINING PERIOD, DEPOSIT & LOCK-IN */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-white/70 block">Lease Start Date</label>
          <input
            type="date"
            disabled={!canModify}
            value={data.leaseStartDate}
            onChange={(e) => updateField('leaseStartDate', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-white/70 block">Lease Expiry Date</label>
          <input
            type="date"
            disabled={!canModify}
            value={data.leaseExpiryDate}
            onChange={(e) => updateField('leaseExpiryDate', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-white/70 block">Remaining Lease</label>
          <div className="relative">
            <input
              type="number"
              disabled={!canModify}
              value={data.remainingLeaseMonths}
              onChange={(e) => updateField('remainingLeaseMonths', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
            <span className="absolute right-2 top-1.5 text-[10px] opacity-60">Months</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-white/70 block">Security Deposit (INR)</label>
          <input
            type="number"
            disabled={!canModify}
            value={data.securityDepositINR}
            onChange={(e) => updateField('securityDepositINR', parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
          />
          <span className="text-[10px] text-white/50">
            ₹{(data.securityDepositINR / 100000).toFixed(1)} Lakhs
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-white/70 block">Lock-in Period</label>
          <div className="relative">
            <input
              type="number"
              disabled={!canModify}
              value={data.lockInMonths}
              onChange={(e) => updateField('lockInMonths', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-amber-400 font-mono font-bold"
            />
            <span className="absolute right-2 top-1.5 text-[10px] opacity-60">Months</span>
          </div>
        </div>
      </div>

      {/* 5. VERIFIED LEASE DOCUMENTS CHECKLIST */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Verified Lease Documents Available for Investor Due Diligence</span>
          </label>
          <span className="text-[10px] text-white/60">Audited Investor Data Room</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {[
            { id: 'agreement' as const, label: 'Registered Lease Agreement' },
            { id: 'cam' as const, label: 'CAM Maintenance Agreement' },
            { id: 'receipts' as const, label: 'Last 12-Month Rent Receipts' },
            { id: 'bankStatements' as const, label: 'Bank Rent Credit Statements' },
          ].map((doc) => (
            <label
              key={doc.id}
              className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5 hover:bg-white/5 cursor-pointer text-white/80"
            >
              <input
                type="checkbox"
                disabled={!canModify}
                checked={data.leaseDocsAvailable[doc.id]}
                onChange={(e) =>
                  onChange({
                    ...data,
                    leaseDocsAvailable: {
                      ...data.leaseDocsAvailable,
                      [doc.id]: e.target.checked,
                    },
                  })
                }
                className="rounded border-emerald-500 text-emerald-500 focus:ring-0"
              />
              <span className="truncate">{doc.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
