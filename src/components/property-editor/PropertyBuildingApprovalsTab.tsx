import React from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Landmark,
} from 'lucide-react';
import { BuildingApprovalsState } from './propertyEditorTypes';

interface PropertyBuildingApprovalsTabProps {
  canModify: boolean;
  data: BuildingApprovalsState;
  onChange: (updated: BuildingApprovalsState) => void;
}

const COMMON_BANKS = ['State Bank of India (SBI)', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Bank of Baroda', 'Punjab National Bank'];

export const PropertyBuildingApprovalsTab: React.FC<PropertyBuildingApprovalsTabProps> = ({
  canModify,
  data,
  onChange,
}) => {
  const updateField = <K extends keyof BuildingApprovalsState>(field: K, val: BuildingApprovalsState[K]) => {
    onChange({ ...data, [field]: val });
  };

  const toggleBank = (bankName: string) => {
    const exists = data.approvedBanks.includes(bankName);
    const updated = exists
      ? data.approvedBanks.filter((b) => b !== bankName)
      : [...data.approvedBanks, bankName];
    updateField('approvedBanks', updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. PROJECT & TOWER SPECIFICATIONS */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
          <Building className="w-3.5 h-3.5" />
          <span>Building &amp; Project Master Parameters</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Project / Development Name</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.projectName}
              onChange={(e) => updateField('projectName', e.target.value)}
              placeholder="e.g. The Balmoral Riverside"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Developer / Builder Entity</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.developerName}
              onChange={(e) => updateField('developerName', e.target.value)}
              placeholder="e.g. Kasturi Housing"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Principal Architect / Consultant</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.architectName}
              onChange={(e) => updateField('architectName', e.target.value)}
              placeholder="e.g. Hafeez Contractor / RSP Singapore"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Total Towers in Campus</label>
            <input
              type="number"
              disabled={!canModify}
              value={data.totalTowers}
              onChange={(e) => updateField('totalTowers', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Total Floors in Wing</label>
            <input
              type="number"
              disabled={!canModify}
              value={data.totalFloors}
              onChange={(e) => updateField('totalFloors', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Total Units in Project</label>
            <input
              type="number"
              disabled={!canModify}
              value={data.totalUnitsInProject}
              onChange={(e) => updateField('totalUnitsInProject', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Units Per Floor</label>
            <input
              type="number"
              disabled={!canModify}
              value={data.unitsPerFloor}
              onChange={(e) => updateField('unitsPerFloor', parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-white/70">
              <span>Construction Stage</span>
              <span className="text-amber-400 font-mono font-bold">{data.constructionProgressPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              disabled={!canModify}
              value={data.constructionProgressPercent}
              onChange={(e) => updateField('constructionProgressPercent', parseInt(e.target.value) || 0)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Launch Date</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.launchDate}
              onChange={(e) => updateField('launchDate', e.target.value)}
              placeholder="e.g. Jan 2022"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Possession Date</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.possessionDate}
              onChange={(e) => updateField('possessionDate', e.target.value)}
              placeholder="e.g. Dec 2025 / Ready OC"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* 2. STATUTORY CLEARANCES: RERA, OC, CC, FIRE NOC */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statutory Clearances &amp; MahaRERA Compliance</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">MahaRERA Registration Number</label>
            <input
              type="text"
              disabled={!canModify}
              value={data.reraNumber}
              onChange={(e) => updateField('reraNumber', e.target.value)}
              placeholder="e.g. P52100028816"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono font-bold text-amber-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">RERA Authority Verification URL</label>
            <input
              type="url"
              disabled={!canModify}
              value={data.reraAuthorityUrl}
              onChange={(e) => updateField('reraAuthorityUrl', e.target.value)}
              placeholder="https://maharera.mahaonline.gov.in"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Occupancy Certificate (OC)</label>
            <select
              disabled={!canModify}
              value={data.occupancyCertificateStatus}
              onChange={(e) => updateField('occupancyCertificateStatus', e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-bold"
            >
              <option value="RECEIVED" className="bg-slate-900 text-white">Full OC Received</option>
              <option value="IN_PROCESS" className="bg-slate-900 text-white">OC Applied / In Process</option>
              <option value="AWAITED" className="bg-slate-900 text-white">Awaited on Completion</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Commencement (CC)</label>
            <select
              disabled={!canModify}
              value={data.commencementCertificateStatus}
              onChange={(e) => updateField('commencementCertificateStatus', e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-bold"
            >
              <option value="RECEIVED" className="bg-slate-900 text-white">Full CC Received (Plinth to Top)</option>
              <option value="IN_PROCESS" className="bg-slate-900 text-white">CC Received up to Slab</option>
              <option value="AWAITED" className="bg-slate-900 text-white">Awaited</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Fire Dept NOC</label>
            <select
              disabled={!canModify}
              value={data.fireNocReceived ? 'YES' : 'NO'}
              onChange={(e) => updateField('fireNocReceived', e.target.value === 'YES')}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="YES" className="bg-slate-900 text-white">Yes - Fire NOC Approved</option>
              <option value="NO" className="bg-slate-900 text-white">No / In Process</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-white/70 block">Environmental Clearance</label>
            <select
              disabled={!canModify}
              value={data.environmentalClearance ? 'YES' : 'NO'}
              onChange={(e) => updateField('environmentalClearance', e.target.value === 'YES')}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
            >
              <option value="YES" className="bg-slate-900 text-white">Yes - MoEF EC Approved</option>
              <option value="NO" className="bg-slate-900 text-white">Not Applicable / In Process</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. APPROVED PROJECT FINANCE BANKS */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/80 flex items-center gap-1.5 uppercase tracking-wide">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Approved Project Finance &amp; Home Loan Partner Banks</span>
          </span>
          <span className="text-[10px] text-white/50">{data.approvedBanks.length} Selected</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {COMMON_BANKS.map((bank) => {
            const checked = data.approvedBanks.includes(bank);
            return (
              <label
                key={bank}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer ${
                  checked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-black/30 border-white/5 text-white/70 hover:bg-white/5'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={!canModify}
                  checked={checked}
                  onChange={() => toggleBank(bank)}
                  className="rounded border-emerald-500 text-emerald-500 focus:ring-0"
                />
                <span className="truncate">{bank}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
