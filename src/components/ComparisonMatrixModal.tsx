/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Layers,
  ShieldCheck,
  Compass,
  Lock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check,
  Minus,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';

interface ComparisonMatrixModalProps {
  units: Unit[];
  onClose: () => void;
  onRemoveUnit: (unitId: string) => void;
  onHoldUnit: (unit: Unit) => void;
}

export const ComparisonMatrixModal: React.FC<ComparisonMatrixModalProps> = ({
  units,
  onClose,
  onRemoveUnit,
  onHoldUnit,
}) => {
  if (units.length === 0) {
    return null;
  }

  const baseUnit = units[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#090D14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Side-by-Side Asset & Unit Matrix</h2>
              <p className="text-xs text-white/50">Mathematical comparison of pricing, MahaRERA compliance, and spatial orientation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-4 w-48 text-white/40 font-mono uppercase tracking-wider border-b border-white/10 bg-black/40 sticky left-0 z-10">
                    Attributes
                  </th>
                  {units.map((unit, idx) => (
                    <th
                      key={unit.id}
                      className="p-4 min-w-[260px] border-b border-white/10 bg-white/[0.02] space-y-2 align-top"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                            Unit {idx + 1}
                          </span>
                          <h4 className="text-base font-serif font-bold text-white mt-1">{unit.unitNumber}</h4>
                          <p className="text-[11px] text-white/60">{unit.projectName}</p>
                        </div>
                        {units.length > 1 && (
                          <button
                            onClick={() => onRemoveUnit(unit.id)}
                            className="text-white/40 hover:text-rose-400 p-1 cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => onHoldUnit(unit)}
                          className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Hold Unit (15-Min)</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {/* 1. Configuration & Floor */}
                <tr>
                  <td className="p-4 font-semibold text-white/60 bg-black/40 sticky left-0">Configuration & Level</td>
                  {units.map((u) => (
                    <td key={u.id} className="p-4 text-white">
                      <div className="font-bold text-sm">{u.configuration}</div>
                      <div className="text-white/50 text-[11px]">Floor Level {u.floorNumber} • {u.towerName}</div>
                    </td>
                  ))}
                </tr>

                {/* 2. Carpet Area & Balcony */}
                <tr>
                  <td className="p-4 font-semibold text-white/60 bg-black/40 sticky left-0">Carpet & Deck Area</td>
                  {units.map((u, i) => {
                    const diffSqFt = i > 0 ? u.carpetAreaSqFt - baseUnit.carpetAreaSqFt : 0;
                    return (
                      <td key={u.id} className="p-4 text-white font-mono">
                        <div className="text-sm font-bold">{u.carpetAreaSqFt} Sq.Ft</div>
                        <div className="text-white/50 text-[11px]">{u.balconiesCount} Private Balconies</div>
                        {diffSqFt !== 0 && (
                          <span
                            className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              diffSqFt > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {diffSqFt > 0 ? `+${diffSqFt}` : diffSqFt} Sq.Ft vs Base
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 3. Base Price */}
                <tr>
                  <td className="p-4 font-semibold text-white/60 bg-black/40 sticky left-0">Base Agreement Price</td>
                  {units.map((u, i) => {
                    const priceDelta = i > 0 ? u.pricing.basePrice - baseUnit.pricing.basePrice : 0;
                    return (
                      <td key={u.id} className="p-4 text-white">
                        <div className="text-base font-serif font-bold text-amber-400">{formatINR(u.pricing.basePrice)}</div>
                        <div className="text-white/50 text-[11px]">₹{u.pricing.pricePerSqFt.toLocaleString('en-IN')}/sq.ft</div>
                        {priceDelta !== 0 && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/70">
                            {priceDelta > 0 ? `+${formatINR(priceDelta)}` : formatINR(priceDelta)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 4. Total All-In Cost (Statutory Taxes) */}
                <tr>
                  <td className="p-4 font-semibold text-white/60 bg-black/40 sticky left-0">All-In Acquisition Cost</td>
                  {units.map((u) => (
                    <td key={u.id} className="p-4 text-white">
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {formatINR(u.pricing.totalEstimatedAcquisitionCost)}
                      </div>
                      <div className="text-[10px] text-white/50 space-y-0.5 mt-1">
                        <div>• 6% Stamp Duty: {formatINR(Math.round(u.pricing.basePrice * 0.06))}</div>
                        <div>• 5% GST: {formatINR(Math.round(u.pricing.basePrice * 0.05))}</div>
                        <div>• Registration: ₹30,000</div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. Orientation & Sunlight */}
                <tr>
                  <td className="p-4 font-semibold text-white/60 bg-black/40 sticky left-0">Sunlight & Orientation</td>
                  {units.map((u) => (
                    <td key={u.id} className="p-4 text-white">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                        <Compass className="w-3.5 h-3.5" />
                        <span>{u.facing} Facing</span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-1 leading-relaxed">{u.orientationView}</p>
                    </td>
                  ))}
                </tr>

                {/* 6. Parking & Elevators */}
                <tr>
                  <td className="p-4 font-semibold text-white/60 bg-black/40 sticky left-0">Private Parking Bays</td>
                  {units.map((u) => (
                    <td key={u.id} className="p-4 text-white font-mono">
                      <span className="font-bold">{u.parkingSlots} Covered Bays</span> (EV-Ready)
                    </td>
                  ))}
                </tr>

                {/* 7. Status */}
                <tr>
                  <td className="p-4 font-semibold text-white/60 bg-black/40 sticky left-0">Live Inventory Status</td>
                  {units.map((u) => (
                    <td key={u.id} className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                        {u.status}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
