/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, Unit } from '../types';
import {
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  Building,
  Maximize2,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatINR } from '../services/calculatorEngine';
import { ReraBadge } from './ReraBadge';

interface UnitSelectionModalProps {
  project: Project;
  onClose: () => void;
  onOpenDigitalTwin?: (project: Project, unitId?: string) => void;
  onAddToComparison?: (unit: Unit) => void;
}

export const UnitSelectionModal: React.FC<UnitSelectionModalProps> = ({
  project,
  onClose,
  onOpenDigitalTwin,
  onAddToComparison,
}) => {
  const allUnits = project.towers.flatMap((t) => t.floors.flatMap((f) => f.units));
  const [selectedUnit, setSelectedUnit] = useState<Unit>(allUnits[0] || ({} as Unit));
  const [isHolding, setIsHolding] = useState(false);
  const [holdSuccessMessage, setHoldSuccessMessage] = useState<string | null>(null);
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Booking Form State
  const [customerName, setCustomerName] = useState('Rajesh Sharma');
  const [customerEmail, setCustomerEmail] = useState('rajesh.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98230 45678');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [agreedRera, setAgreedRera] = useState(true);

  const handleHoldUnit = async () => {
    if (!selectedUnit) return;
    setIsHolding(true);
    setErrorMessage(null);
    setHoldSuccessMessage(null);

    try {
      const res = await fetch(`/api/v1/units/${selectedUnit.id}/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'cust_rajesh_sharma',
          userName: customerName,
          tokenAmountPaid: 50000,
          durationMinutes: 15,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.message || 'Failed to acquire hold lock.');
      } else {
        setHoldSuccessMessage(`Unit ${selectedUnit.unitNumber} locked successfully! 15-minute exclusivity active.`);
        setSelectedUnit((prev) => ({ ...prev, status: 'HOLD' }));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsHolding(false);
    }
  };

  const handleBookUnit = async () => {
    if (!selectedUnit) return;
    if (!agreedTerms || !agreedRera) {
      setErrorMessage('Please acknowledge MahaRERA regulatory disclosures and terms.');
      return;
    }

    setErrorMessage(null);
    setBookingSuccessMessage(null);

    try {
      const res = await fetch(`/api/v1/units/${selectedUnit.id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'cust_rajesh_sharma',
          customerDetails: {
            fullName: customerName,
            email: customerEmail,
            phone: customerPhone,
            panNumber: 'ABCDE1234F',
            address: 'Baner-Pashan Link Road, Pune',
          },
          bookingAmountPaid: 500000,
          paymentTransactionId: `TXN_HDFC_${Date.now()}`,
          agreedToTerms: agreedTerms,
          reraVerifiedAcknowledged: agreedRera,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.message || 'Acquisition failed.');
      } else {
        setBookingSuccessMessage(`Acquisition Confirmed! Booking Ref: ${json.booking.bookingRef}. Official Allotment Letter generated.`);
        setSelectedUnit((prev) => ({ ...prev, status: 'BOOKED' }));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B0F17] border border-white/15 p-6 md:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              {project.name}
            </span>
            <span className="text-xs text-white/50">Micro-Market: {project.location.microMarket}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Live Inventory & Unit Selection Engine</h2>
        </div>

        {/* Unit Selector Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white/40 block">Select Floor & Unit:</span>
          <div className="flex flex-wrap items-center gap-2">
            {allUnits.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setSelectedUnit(u);
                  setErrorMessage(null);
                  setHoldSuccessMessage(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedUnit?.id === u.id
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : u.status === 'BOOKED'
                    ? 'bg-rose-950/30 border border-rose-500/30 text-rose-400 cursor-not-allowed'
                    : u.status === 'HOLD'
                    ? 'bg-amber-950/30 border border-amber-500/30 text-amber-300'
                    : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <span>{u.unitNumber}</span>
                <span className="text-[10px] font-sans opacity-70">({u.configuration})</span>
                {u.status === 'HOLD' && <Lock className="w-3 h-3 text-amber-400" />}
                {u.status === 'BOOKED' && <span className="text-[9px] uppercase font-bold text-rose-400">SOLD</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Unit Details */}
        {selectedUnit && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/10">
            {/* Left: Floor plan & layout */}
            <div className="lg:col-span-6 space-y-4 rounded-2xl bg-black/40 border border-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-serif font-bold text-white">{selectedUnit.unitNumber} — {selectedUnit.configuration}</h4>
                  <p className="text-xs text-white/60">Carpet Area: {selectedUnit.carpetAreaSqFt} sq.ft | Facing: {selectedUnit.facing}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedUnit.status}
                </span>
              </div>

              {selectedUnit.floorPlan && (
                <div className="rounded-xl overflow-hidden border border-white/10 relative h-64 bg-neutral-900">
                  <img
                    src={selectedUnit.floorPlan.layoutImageUrl}
                    alt={selectedUnit.floorPlan.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-white">
                    {selectedUnit.floorPlan.title}
                  </div>
                </div>
              )}

              {/* Digital Twin & Comparison Quick Actions */}
              <div className="flex gap-2">
                {onOpenDigitalTwin && (
                  <button
                    onClick={() => {
                      onOpenDigitalTwin(project, selectedUnit.id);
                      onClose();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>3D Twin & Sunlight</span>
                  </button>
                )}
                {onAddToComparison && (
                  <button
                    onClick={() => {
                      onAddToComparison(selectedUnit);
                    }}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Compare Unit</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40 block text-[10px]">Orientation / View</span>
                  <span className="text-white font-medium">{selectedUnit.orientationView}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40 block text-[10px]">Parking Bays Allocated</span>
                  <span className="text-white font-medium">{selectedUnit.parkingSlots} Covered Bays</span>
                </div>
              </div>
            </div>

            {/* Right: Pricing Breakdown & Transaction Action */}
            <div className="lg:col-span-6 space-y-5 rounded-2xl bg-gradient-to-br from-black/80 to-amber-950/20 border border-amber-500/20 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Base Agreement Value:</span>
                  <span className="text-2xl font-serif font-bold text-white">{formatINR(selectedUnit.pricing.basePrice)}</span>
                </div>

                <div className="space-y-1 text-xs border-y border-white/10 py-3">
                  <div className="flex justify-between text-white/70">
                    <span>Floor Rise Charges (Floor {selectedUnit.floorNumber}):</span>
                    <span className="font-mono text-white">{formatINR((selectedUnit.pricing.floorRisePerFloor || 0) * selectedUnit.floorNumber)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Car Parking (2 Covered Slots):</span>
                    <span className="font-mono text-white">{formatINR(selectedUnit.pricing.carParkingCharges)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Maharashtra Stamp Duty (6%):</span>
                    <span className="font-mono text-white">{formatINR((selectedUnit.pricing.basePrice * 6) / 100)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>GST (5% Under Construction):</span>
                    <span className="font-mono text-white">{formatINR((selectedUnit.pricing.basePrice * 5) / 100)}</span>
                  </div>
                  <div className="flex justify-between text-amber-300 font-bold pt-1">
                    <span>Estimated Total Acquisition:</span>
                    <span className="font-mono">{formatINR(selectedUnit.pricing.totalEstimatedAcquisitionCost)}</span>
                  </div>
                </div>

                {/* Statutory Checkboxes */}
                <div className="space-y-2 text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-white/80">
                    <input
                      type="checkbox"
                      checked={agreedRera}
                      onChange={(e) => setAgreedRera(e.target.checked)}
                      className="rounded bg-black border-white/20 text-emerald-500"
                    />
                    <span>I have reviewed MahaRERA No. {project.reraRecord.registrationNumber}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-white/80">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="rounded bg-black border-white/20 text-amber-500"
                    />
                    <span>I accept standard statutory terms of booking & allotment.</span>
                  </label>
                </div>
              </div>

              {/* Status & Feedback Messages */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {holdSuccessMessage && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>{holdSuccessMessage}</span>
                </div>
              )}

              {bookingSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bookingSuccessMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleHoldUnit}
                  disabled={isHolding || selectedUnit.status === 'BOOKED'}
                  className="px-4 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isHolding ? 'Locking...' : 'Place 15-Min Hold'}</span>
                </button>

                <button
                  onClick={handleBookUnit}
                  disabled={selectedUnit.status === 'BOOKED'}
                  className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Book Unit Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
