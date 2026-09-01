/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VipHoldRecord, VipSiteVisitBooking, LegalDossierDocument, Project, Unit } from '../types';
import { formatINR } from '../services/calculatorEngine';
import {
  Crown,
  Clock,
  Car,
  FileCheck,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Maximize2,
  Layers,
  Trash2,
  AlertCircle,
  PlusCircle,
  Coffee,
  KeyRound,
} from 'lucide-react';

interface VipClientPortalProps {
  onOpenDigitalTwin: (project: Project, unitId?: string) => void;
  onAddToComparison: (unit: Unit) => void;
}

export function VipClientPortal({ onOpenDigitalTwin, onAddToComparison }: VipClientPortalProps) {
  const [activeSection, setActiveSection] = useState<'HOLDS' | 'SITE_VISITS' | 'DOSSIERS' | 'SHORTLIST'>('HOLDS');

  // Holds state
  const [holds, setHolds] = useState<VipHoldRecord[]>([]);
  const [siteVisits, setSiteVisits] = useState<VipSiteVisitBooking[]>([]);
  const [dossiers, setDossiers] = useState<LegalDossierDocument[]>([]);
  const [savedUnits, setSavedUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'SUCCESS' | 'ERROR' } | null>(null);

  // New Visit Booking Form State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [visitForm, setVisitForm] = useState({
    projectName: 'Kiaan One Vertica',
    preferredDate: '2026-09-02',
    timeSlot: '11:00 AM - 01:00 PM',
    pickupAddress: 'Koregaon Park, Pune',
    luxuryVehicleChoice: 'MERCEDES_E_CLASS' as const,
    hospitalityChoice: 'HIGH_TEA_SKY_CLUB' as const,
    specialRequirements: 'Solar study inspection for Master Bedroom & Sky Deck balcony briefing.',
  });

  const fetchPortalData = async () => {
    try {
      const [hRes, vRes, dRes, uRes, pRes] = await Promise.all([
        fetch('/api/v1/vip/holds').then((r) => r.json()),
        fetch('/api/v1/vip/site-visits').then((r) => r.json()),
        fetch('/api/v1/vip/legal-dossiers').then((r) => r.json()),
        fetch('/api/v1/vip/saved-units').then((r) => r.json()),
        fetch('/api/v1/projects').then((r) => r.json()),
      ]);

      if (hRes?.success && Array.isArray(hRes?.data)) setHolds(hRes.data);
      if (vRes?.success && Array.isArray(vRes?.data)) setSiteVisits(vRes.data);
      if (dRes?.success && Array.isArray(dRes?.data)) setDossiers(dRes.data);
      if (uRes?.success && Array.isArray(uRes?.data?.units)) setSavedUnits(uRes.data.units);
      if (pRes?.success && Array.isArray(pRes?.data)) setProjects(pRes.data);
    } catch (e) {
      console.error('Failed to load VIP portal data', e);
    }
  };

  useEffect(() => {
    fetchPortalData();
    const interval = setInterval(() => {
      // Countdown active holds
      setHolds((prevHolds) =>
        (prevHolds || []).map((h) => {
          if (h.status === 'ACTIVE' || h.status === 'EXTENDED') {
            const exp = new Date(h.expiresAt).getTime();
            const rem = Math.max(0, Math.floor((exp - Date.now()) / 1000));
            return {
              ...h,
              remainingSeconds: rem,
              status: rem === 0 ? 'EXPIRED' : h.status,
            };
          }
          return h;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExtendHold = async (holdId: string) => {
    try {
      const res = await fetch(`/api/v1/vip/holds/${holdId}/extend`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: data.message, type: 'SUCCESS' });
        fetchPortalData();
      } else {
        setActionMessage({ text: data.message, type: 'ERROR' });
      }
    } catch (e) {
      setActionMessage({ text: 'Failed to extend hold reservation.', type: 'ERROR' });
    }
  };

  const handleTokenPayment = async (holdId: string) => {
    try {
      const res = await fetch(`/api/v1/vip/holds/${holdId}/token-pay`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMessage({
          text: `Token Payment Confirmed! Transaction Reference: ${data.transactionId}. Dedicated relationship manager is drafting your formal allotment letter.`,
          type: 'SUCCESS',
        });
        fetchPortalData();
      }
    } catch (e) {
      setActionMessage({ text: 'Payment gateway timeout. Please retry.', type: 'ERROR' });
    }
  };

  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/vip/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitForm),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: 'VIP Chauffeur Visit confirmed. Welcome itinerary dispatched.', type: 'SUCCESS' });
        setIsBookingModalOpen(false);
        fetchPortalData();
      }
    } catch (e) {
      setActionMessage({ text: 'Failed to schedule visit', type: 'ERROR' });
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in" id="vip-client-portal">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121B2F] via-[#0B101C] to-[#040609] border border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Kiaan VIP Private Client Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Institutional Reservations, Chauffeur Site Visits & Due Diligence Dossiers
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Your private client command center: manage 15-minute concurrency unit locks, track certified MahaRERA legal title reports, and schedule bespoke site visits with luxury vehicle escort.
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 relative z-10 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Active Unit Holds</span>
            <span className="text-xl font-bold text-amber-400 block">{(holds || []).filter((h) => h.status !== 'EXPIRED').length}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Scheduled VIP Visits</span>
            <span className="text-xl font-bold text-white block">{(siteVisits || []).length}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Verified Legal Dossiers</span>
            <span className="text-xl font-bold text-emerald-400 block">{(dossiers || []).length} Records</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-white/40 uppercase font-bold text-[10px]">Shortlisted Digital Twins</span>
            <span className="text-xl font-bold text-white block">{(savedUnits || []).length} Units</span>
          </div>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium ${
            actionMessage.type === 'SUCCESS'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-white/60 hover:text-white ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'HOLDS', label: 'Active 15-Min Unit Holds', icon: Clock, badge: (holds || []).filter((h) => h.status !== 'EXPIRED').length },
          { id: 'SITE_VISITS', label: 'VIP Chauffeur & Site Visits', icon: Car, badge: (siteVisits || []).length },
          { id: 'DOSSIERS', label: 'MahaRERA Legal Dossiers & Title Search', icon: FileCheck, badge: (dossiers || []).length },
          { id: 'SHORTLIST', label: 'Shortlisted Digital Twins', icon: Layers, badge: (savedUnits || []).length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-black text-amber-400 font-bold' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: ACTIVE 15-MINUTE UNIT HOLDS */}
      {activeSection === 'HOLDS' && (
        <div className="space-y-6 animate-fade-in">
          {(holds || []).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
              <Clock className="w-10 h-10 text-white/20 mx-auto" />
              <h3 className="text-base font-semibold text-white">No Active Unit Locks</h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Explore project floor plans and place a 15-minute priority lock to reserve any luxury apartment with zero double-booking risk.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {holds.map((hold) => {
                const isExpired = hold.status === 'EXPIRED';
                const isConverted = hold.status === 'CONVERTED_TO_TOKEN';

                return (
                  <div
                    key={hold.holdId}
                    className={`rounded-3xl border p-6 space-y-5 transition-all relative overflow-hidden ${
                      isConverted
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : isExpired
                        ? 'bg-white/[0.02] border-white/10 opacity-70'
                        : 'bg-[#0E1627]/90 border-amber-500/50 shadow-2xl shadow-amber-500/10'
                    }`}
                  >
                    {/* Top Pill & Unit Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                          {hold.projectName}
                        </span>
                        <h3 className="text-lg font-bold text-white">{hold.unitNumber}</h3>
                        <p className="text-xs text-white/50">Client: {hold.customerName}</p>
                      </div>

                      {/* Timer Pill */}
                      {!isConverted && !isExpired && (
                        <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                          <span className="text-xs font-mono font-bold text-amber-300">
                            {formatTimer(hold.remainingSeconds)}
                          </span>
                        </div>
                      )}

                      {isConverted && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Token Paid</span>
                        </span>
                      )}

                      {isExpired && (
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                          Expired
                        </span>
                      )}
                    </div>

                    {/* Expiry Timestamp Details */}
                    <div className="rounded-2xl bg-white/[0.03] p-3.5 space-y-1.5 text-xs">
                      <div className="flex justify-between text-white/60">
                        <span>Reservation ID:</span>
                        <span className="font-mono text-white font-semibold">{hold.holdId}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Hold Expiry Deadline:</span>
                        <span className="text-white">{new Date(hold.expiresAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Extensions Used:</span>
                        <span className="text-amber-400 font-bold">{hold.extensionCount} of 2 max</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {!isConverted && !isExpired && (
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleExtendHold(hold.holdId)}
                          disabled={hold.extensionCount >= 2}
                          className="flex-1 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/15 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          +15 Min Extension
                        </button>
                        <button
                          onClick={() => handleTokenPayment(hold.holdId)}
                          className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Lock Token (₹50k)</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: VIP CHAUFFEUR & SITE VISITS */}
      {activeSection === 'SITE_VISITS' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Curated Luxury Property Itineraries</h3>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Book VIP Chauffeur Visit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteVisits.map((visit) => (
              <div
                key={visit.visitId}
                className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-5 hover:border-amber-500/40 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      Confirmed Itinerary
                    </span>
                    <h3 className="text-base font-bold text-white">{visit.projectName}</h3>
                    <p className="text-xs text-white/50">
                      {visit.preferredDate} • {visit.timeSlot}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
                    {visit.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Chauffeur Escort Box */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Car className="w-4 h-4" />
                    <span>Luxury Chauffeur Fleet Details</span>
                  </div>
                  <div className="text-white/70 space-y-1">
                    <div>Pickup: <span className="text-white font-medium">{visit.pickupAddress}</span></div>
                    <div>Vehicle: <span className="text-white font-medium">{visit.luxuryVehicleChoice.replace('_', ' ')}</span></div>
                    {visit.chauffeurDetails && (
                      <div>Driver: <span className="text-white font-medium">{visit.chauffeurDetails.driverName} ({visit.chauffeurDetails.vehicleRegNumber})</span></div>
                    )}
                  </div>
                </div>

                {/* Relationship Manager Card */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <img
                    src={visit.relationshipManager.photoUrl}
                    alt={visit.relationshipManager.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-white block">{visit.relationshipManager.name}</span>
                    <span className="text-[10px] text-white/50">{visit.relationshipManager.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${visit.relationshipManager.phone}`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
                      title="Call RM"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`mailto:${visit.relationshipManager.email}`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
                      title="Email RM"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: STATUTORY LEGAL DOSSIERS */}
      {activeSection === 'DOSSIERS' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              All statutory documents are verified by High Court legal counsel with dedicated 70% escrow compliance records under MahaRERA Section 4(2)(l)(D).
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossiers.map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-4 hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                      VERIFIED CLEAR
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">{(doc.fileSizeBytes / 1000000).toFixed(1)} MB PDF</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight">{doc.documentTitle}</h4>
                  <p className="text-xs text-white/50">Issued By: {doc.issuingAuthority}</p>
                  <p className="text-xs text-white/70 leading-relaxed italic bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    "{doc.legalSummary}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[10px] text-white/40">Dated: {doc.issuedDate}</span>
                  <button
                    onClick={() => alert(`Downloading verified legal dossier: ${doc.downloadFilename}`)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-emerald-500 hover:text-black text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Certified PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: SHORTLISTED DIGITAL TWINS */}
      {activeSection === 'SHORTLIST' && (
        <div className="space-y-6 animate-fade-in">
          {(savedUnits || []).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
              <Layers className="w-10 h-10 text-white/20 mx-auto" />
              <h3 className="text-base font-semibold text-white">No Shortlisted Units Yet</h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Bookmark individual residences from the Explore catalog to track price adjustments and launch instant digital twins.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedUnits.map((unit) => {
                const parentProj = projects.find((p) => p.id === unit.projectId);
                return (
                  <div
                    key={unit.id}
                    className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400">{unit.projectName}</span>
                          <h4 className="text-base font-bold text-white">Unit {unit.unitNumber}</h4>
                          <p className="text-xs text-white/50">{unit.configuration} • Level {unit.floorNumber}</p>
                        </div>
                        <span className="text-base font-bold text-white">{formatINR(unit.pricing.basePrice)}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-white/[0.03]">
                          <span className="block text-[10px] text-white/40 uppercase">Carpet</span>
                          <span className="font-bold text-white">{unit.carpetAreaSqFt} sq.ft</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03]">
                          <span className="block text-[10px] text-white/40 uppercase">Facing</span>
                          <span className="font-bold text-amber-400">{unit.facing}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03]">
                          <span className="block text-[10px] text-white/40 uppercase">Status</span>
                          <span className="font-bold text-emerald-400">{unit.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => onAddToComparison(unit)}
                        className="flex-1 py-2 rounded-xl bg-white/[0.06] hover:bg-white/12 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Compare</span>
                      </button>
                      <button
                        onClick={() => parentProj && onOpenDigitalTwin(parentProj, unit.id)}
                        className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Launch Twin</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Schedule VIP Chauffeur Visit */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1527] border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Schedule VIP Chauffeur Site Visit</h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-white/70 font-semibold uppercase">Target Development</label>
                <select
                  value={visitForm.projectName}
                  onChange={(e) => setVisitForm({ ...visitForm, projectName: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                >
                  <option value="Kiaan One Vertica" className="bg-[#0D1527]">Kiaan One Vertica (Wakad)</option>
                  <option value="Kiaan Aurum Residences" className="bg-[#0D1527]">Kiaan Aurum Residences (Baner)</option>
                  <option value="Kiaan Techscape Horizon" className="bg-[#0D1527]">Kiaan Techscape Horizon (Hinjewadi)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 font-semibold uppercase">Preferred Date</label>
                  <input
                    type="date"
                    value={visitForm.preferredDate}
                    onChange={(e) => setVisitForm({ ...visitForm, preferredDate: e.target.value })}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/70 font-semibold uppercase">Time Slot</label>
                  <select
                    value={visitForm.timeSlot}
                    onChange={(e) => setVisitForm({ ...visitForm, timeSlot: e.target.value })}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                  >
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                    <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                    <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Sunset Tour)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70 font-semibold uppercase">Doorstep Pickup Address</label>
                <input
                  type="text"
                  value={visitForm.pickupAddress}
                  onChange={(e) => setVisitForm({ ...visitForm, pickupAddress: e.target.value })}
                  placeholder="Enter your residence or office address for chauffeur dispatch..."
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 font-semibold uppercase">Luxury Vehicle</label>
                  <select
                    value={visitForm.luxuryVehicleChoice}
                    onChange={(e) => setVisitForm({ ...visitForm, luxuryVehicleChoice: e.target.value as any })}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                  >
                    <option value="MERCEDES_E_CLASS">Mercedes-Benz E-Class</option>
                    <option value="BMW_5_SERIES">BMW 5 Series</option>
                    <option value="AUDI_A6">Audi A6 Executive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/70 font-semibold uppercase">Curated Hospitality</label>
                  <select
                    value={visitForm.hospitalityChoice}
                    onChange={(e) => setVisitForm({ ...visitForm, hospitalityChoice: e.target.value as any })}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                  >
                    <option value="HIGH_TEA_SKY_CLUB">High Tea at Sky Club</option>
                    <option value="EXECUTIVE_LUNCH">Executive Lunch</option>
                    <option value="EXPRESS_TOUR">Express Briefing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Confirm VIP Escort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
