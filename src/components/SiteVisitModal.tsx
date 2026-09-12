/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Project, Property, Unit } from '../types';
import {
  X,
  Calendar,
  Video,
  MapPin,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Clock,
  Car,
  Sparkles,
  ShieldCheck,
  Compass,
  Building,
  Layers,
  Share2,
  Download,
  Sun,
  Moon,
  Eye,
  Maximize2,
  Check,
  Globe,
  Coffee,
  MessageCircle,
} from 'lucide-react';
import { crmEngine } from '../services/crmIntegrationEngine';
import { globalVipPortalStore } from '../services/vipPortalStore';
import { analyticsEngine } from '../services/analyticsStore';

export interface ViewingAssetData {
  id: string;
  title: string;
  name?: string;
  type: 'PROJECT' | 'PROPERTY' | 'UNIT' | 'COMMERCIAL' | 'LEASE';
  location: {
    address: string;
    microMarket?: string;
    city?: string;
  };
  priceDisplay?: string;
  configuration?: string;
  carpetAreaSqFt?: number | string;
  imageUrl?: string;
  reraNumber?: string;
  possessionDate?: string;
  rawObject?: any;
}

interface SiteVisitModalProps {
  project?: Project | any;
  property?: Property | any;
  unit?: Unit | any;
  asset?: any;
  userSession?: any;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  project,
  property,
  unit,
  asset,
  userSession,
  onClose,
  onNavigateToTab,
}) => {
  // Multi-Mode Viewing Selector
  // 1. PHYSICAL_SITE_VISIT: Maybach / Chauffeur or Self-drive VIP visit with private host
  // 2. LIVE_VIDEO_TOUR: Live 4K remote walkthrough & CAD blueprint consultation
  // 3. INSTANT_3D_VIEW: Direct interactive 360° daylight & spatial walkthrough right in the modal
  const [activeMode, setActiveMode] = useState<'PHYSICAL_SITE_VISIT' | 'LIVE_VIDEO_TOUR' | 'INSTANT_3D_VIEW'>('PHYSICAL_SITE_VISIT');

  // Form State
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredSlot, setPreferredSlot] = useState('11:00 AM - 01:00 PM (Morning Luxury Tour)');
  const [transitOption, setTransitOption] = useState<'MAYBACH_CHAUFFEUR' | 'BMW_7_SERIES' | 'SELF_DRIVE'>('MAYBACH_CHAUFFEUR');
  const [pickupAddress, setPickupAddress] = useState('JW Marriott Pune, Senapati Bapat Road');
  const [attendeesCount, setAttendeesCount] = useState<number>(2);
  const [refreshmentPreference, setRefreshmentPreference] = useState<'NESPRESSO_COFFEE' | 'CHAMPAGNE_CAVIAR' | 'ARTISAN_TEA' | 'VEGAN_ORGANIC'>('NESPRESSO_COFFEE');
  const [includeArchitect, setIncludeArchitect] = useState<boolean>(true);
  const [timezone, setTimezone] = useState<'IST' | 'GST' | 'GMT' | 'EST' | 'SGT'>('IST');

  // Contact Info (pre-filled from userSession if available)
  const [userName, setUserName] = useState(userSession?.name || 'Aarav Singhania');
  const [userPhone, setUserPhone] = useState(userSession?.phone || '+91 98201 44552');
  const [userEmail, setUserEmail] = useState(userSession?.email || 'singhania.aarav@investor.in');
  const [specialNotes, setSpecialNotes] = useState(`Requesting high-floor corner residence walkthrough with Vaastu compliance inspection.`);

  // Interactive 3D Digital Twin Viewer state (for INSTANT_3D_VIEW)
  const [sunHour, setSunHour] = useState<number>(16); // 4 PM golden hour
  const [activeFloorLevel, setActiveFloorLevel] = useState<number>(24);
  const [copiedPass, setCopiedPass] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Normalize incoming asset data
  const targetAsset: ViewingAssetData = useMemo(() => {
    const raw = asset || project || property || unit;
    if (!raw) {
      return {
        id: 'kiaan-vertica-01',
        title: 'Kiaan One Vertica — Signature Sky Residences',
        name: 'Kiaan One Vertica',
        type: 'PROJECT',
        location: {
          address: 'Main Balewadi High Street Corridor, Pune 411045',
          microMarket: 'Balewadi High Street',
          city: 'Pune',
        },
        priceDisplay: '₹3.40 Cr - ₹8.50 Cr',
        configuration: '3, 4 & 5 BHK Sky Duplexes',
        carpetAreaSqFt: '2,150 - 4,800',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        reraNumber: 'P52100028492',
        possessionDate: 'Dec 2027',
        rawObject: raw,
      };
    }

    // Is it a Project?
    if ('headlinePriceRange' in raw) {
      const p = raw as Project;
      return {
        id: p.id,
        title: p.name,
        name: p.name,
        type: 'PROJECT',
        location: {
          address: p.location?.address || `${p.location?.microMarket}, ${p.location?.city}`,
          microMarket: p.location?.microMarket,
          city: p.location?.city,
        },
        priceDisplay: p.headlinePriceRange?.displayString || 'On Request',
        configuration: (p.configurations || []).join(', '),
        carpetAreaSqFt: `${p.carpetAreaRangeSqFt?.min} - ${p.carpetAreaRangeSqFt?.max}`,
        imageUrl: p.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        reraNumber: p.reraRecord?.registrationNumber,
        possessionDate: p.possessionDate,
        rawObject: p,
      };
    }

    // Is it an Individual Property?
    if ('carpetAreaSqFt' in raw && 'pricing' in raw) {
      const prop = raw as Property;
      return {
        id: prop.id,
        title: prop.title,
        name: prop.title,
        type: 'PROPERTY',
        location: {
          address: prop.location?.address || 'Pune Prime Corridor',
          microMarket: prop.location?.microMarket || 'Koregaon Park / Kalyani Nagar',
          city: prop.location?.city || 'Pune',
        },
        priceDisplay: `₹${((prop.pricing?.basePrice || 0) / 10000000).toFixed(2)} Cr`,
        configuration: prop.configuration,
        carpetAreaSqFt: prop.carpetAreaSqFt,
        imageUrl: prop.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        possessionDate: prop.possessionDate,
        rawObject: prop,
      };
    }

    // Generic Custom Asset (Lease, Commercial Suite, Unit)
    return {
      id: raw.id || `asset_${Date.now()}`,
      title: raw.title || raw.name || raw.assetTitle || 'Luxury Kiaan Portfolio Asset',
      name: raw.name || raw.title || raw.assetTitle || 'Luxury Asset',
      type: (raw.type || (raw.assetTitle ? 'LEASE' : 'PROPERTY')) as any,
      location: {
        address: raw.location?.address || raw.address || 'Pune Premium Sector',
        microMarket: raw.location?.microMarket || raw.microMarket || 'Pune Central',
        city: raw.location?.city || raw.city || 'Pune',
      },
      priceDisplay: raw.priceDisplay || raw.pricing || (raw.pricePerMonth ? `₹${raw.pricePerMonth.toLocaleString()} / mo` : '₹2.50 Cr+'),
      configuration: raw.configuration || raw.specs || 'Bespoke Executive Spec',
      carpetAreaSqFt: raw.carpetAreaSqFt || raw.areaSqFt || '2,400',
      imageUrl: raw.imageUrl || raw.media?.[0]?.url || raw.mediaUrl || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      reraNumber: raw.reraNumber || raw.reraRegNumber || 'P52100028492',
      possessionDate: raw.possessionDate || 'Immediate Move-In',
      rawObject: raw,
    };
  }, [asset, project, property, unit]);

  useEffect(() => {
    if (userSession) {
      if (userSession.name) setUserName(userSession.name);
      if (userSession.email) setUserEmail(userSession.email);
      if (userSession.phone) setUserPhone(userSession.phone);
    }
  }, [userSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Dispatch to server-side API (with fallback)
      try {
        await fetch('/api/v1/visits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assetType: targetAsset.type,
            assetId: targetAsset.id,
            assetTitle: targetAsset.title,
            visitType: activeMode,
            preferredDate,
            preferredSlot,
            userName,
            userPhone,
            userEmail,
            notes: `${specialNotes} | Vehicle: ${transitOption} | Attendees: ${attendeesCount} | Refreshment: ${refreshmentPreference} | Architect: ${includeArchitect}`,
          }),
        });
      } catch (e) {
        // Safe mock fallback
      }

      // 2. Dispatch to VIP Portal Store (so it appears in VIP passport immediately!)
      const vipBooking = globalVipPortalStore.bookSiteVisit({
        projectId: targetAsset.id,
        projectName: targetAsset.title,
        preferredDate,
        timeSlot: preferredSlot,
        pickupAddress: transitOption === 'SELF_DRIVE' ? 'Self-Drive (Reserved VIP Bay)' : pickupAddress,
        luxuryVehicleChoice:
          transitOption === 'MAYBACH_CHAUFFEUR'
            ? 'MERCEDES_E_CLASS'
            : transitOption === 'BMW_7_SERIES'
            ? 'BMW_5_SERIES'
            : 'SELF_DRIVE',
        hospitalityChoice:
          refreshmentPreference === 'CHAMPAGNE_CAVIAR'
            ? 'HIGH_TEA_SKY_CLUB'
            : 'EXECUTIVE_LUNCH',
        specialRequirements: `${specialNotes} (Attendees: ${attendeesCount})`,
      });

      // 3. Dispatch to CRM Outbox Engine
      const entityTypeMapped: 'PROJECT' | 'PROPERTY' | 'UNIT' =
        targetAsset.type === 'PROJECT' ? 'PROJECT' : targetAsset.type === 'UNIT' ? 'UNIT' : 'PROPERTY';

      crmEngine.dispatchToCrm('VISIT_REQUESTED', {
        consentGranted: true,
        contactInfo: {
          name: userName,
          phone: userPhone,
          email: userEmail,
          preferredChannel: 'WHATSAPP',
        },
        entity: {
          entityType: entityTypeMapped,
          entityId: targetAsset.id,
          entityTitle: targetAsset.title,
          reraRegistrationNumber: targetAsset.reraNumber,
          microMarket: targetAsset.location.microMarket,
        },
        intentCategory: 'VIP_SITE_VISIT',
        minimalMetadata: {
          visitType: activeMode,
          preferredDate,
          preferredSlot,
          transitOption,
          pickupAddress,
          attendeesCount,
        },
      });

      // 4. Record in client analytics
      analyticsEngine.trackEvent(
        'property_viewed',
        {
          type: entityTypeMapped,
          id: targetAsset.id,
          name: targetAsset.title,
        },
        {
          visitType: activeMode,
          date: preferredDate,
        }
      );

      const passCode = `KV-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedBooking({
        passCode,
        booking: vipBooking,
        date: preferredDate,
        slot: preferredSlot,
        mode: activeMode,
        transit: transitOption,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCalendarIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kiaan Luxury Properties//VIP Viewing Itinerary//EN
BEGIN:VEVENT
SUMMARY:Private VIP Viewing: ${targetAsset.title}
DESCRIPTION:Exclusive private viewing and architectural walkthrough at ${targetAsset.location.address}. Dedicated Host: Aishwarya Kulkarni (+91 99201 88471).
LOCATION:${targetAsset.location.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kiaan_VIP_Viewing_${targetAsset.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenWhatsAppItinerary = () => {
    const text = encodeURIComponent(
      `Hello Kiaan Private Client Advisory, I have scheduled a private viewing for "${targetAsset.title}" on ${preferredDate} (${preferredSlot}). Please confirm the VIP chauffeur and private host allocation.`
    );
    window.open(`https://wa.me/919920188471?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090D16] border border-white/15 p-5 sm:p-8 space-y-6 shadow-2xl text-white my-auto max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* ============================================================ */
          /* CONFIRMATION & VIP BOARDING PASS VIEW                        */
          /* ============================================================ */
          <div className="space-y-6 text-center animate-fade-in py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wider">
                CONFIRMED VIP ITINERARY
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">Private Viewing Reserved</h3>
              <p className="text-xs text-white/70 max-w-md mx-auto">
                Your bespoke viewing pass for <span className="text-amber-400 font-semibold">{targetAsset.title}</span> has been confirmed.
              </p>
            </div>

            {/* VIP Boarding Pass Card */}
            <div className="p-5 rounded-2xl bg-[#0D1525] border border-amber-500/30 text-left space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 block">Pass Reference</span>
                  <span className="text-sm font-mono font-bold text-amber-400">{confirmedBooking.passCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-white/50 block">Experience Mode</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {confirmedBooking.mode === 'PHYSICAL_SITE_VISIT'
                      ? '🚗 Mercedes-Maybach VIP Escort'
                      : confirmedBooking.mode === 'LIVE_VIDEO_TOUR'
                      ? '📹 4K Virtual Walkthrough'
                      : '🌐 3D Digital Twin'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block">Viewing Schedule</span>
                  <span className="font-semibold text-white mt-0.5 block">{confirmedBooking.date}</span>
                  <span className="text-[11px] text-amber-300 block">{confirmedBooking.slot}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block">Asset Location</span>
                  <span className="font-semibold text-white mt-0.5 block truncate">{targetAsset.location.address}</span>
                  <span className="text-[11px] text-white/60 block">{targetAsset.location.microMarket}</span>
                </div>
              </div>

              {/* Dedicated Senior Advisor */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                    alt="Aishwarya Kulkarni"
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Aishwarya Kulkarni</div>
                    <div className="text-[10px] text-amber-400">Senior VP — Private Client Advisory</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Host Assigned
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadCalendarIcs}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={handleOpenWhatsAppItinerary}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send to WhatsApp</span>
              </button>

              {onNavigateToTab && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab('vip');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>View in VIP Passport</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs text-white/50 hover:text-white underline cursor-pointer mt-2 block mx-auto"
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          /* ============================================================ */
          /* BOOKING & VIEWING CONFIGURATOR FORM                         */
          /* ============================================================ */
          <div className="space-y-5">
            {/* Asset Header Summary Banner */}
            <div className="p-4 rounded-2xl bg-[#0D1525] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={targetAsset.imageUrl}
                  alt={targetAsset.title}
                  className="w-16 h-16 rounded-xl object-cover border border-white/15 flex-shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {targetAsset.type}
                    </span>
                    {targetAsset.reraNumber && (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>MahaRERA Verified</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-serif font-bold text-white truncate">{targetAsset.title}</h3>
                  <p className="text-xs text-white/60 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span>{targetAsset.location.address}</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10 flex-shrink-0">
                <span className="text-[10px] uppercase text-white/50 block">Pricing</span>
                <span className="text-base font-mono font-bold text-amber-400">{targetAsset.priceDisplay}</span>
              </div>
            </div>

            {/* Viewing Mode Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveMode('PHYSICAL_SITE_VISIT')}
                className={`py-2.5 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  activeMode === 'PHYSICAL_SITE_VISIT'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Maybach Private Tour</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('LIVE_VIDEO_TOUR')}
                className={`py-2.5 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  activeMode === 'LIVE_VIDEO_TOUR'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Live 4K Virtual Walk</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('INSTANT_3D_VIEW')}
                className={`py-2.5 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  activeMode === 'INSTANT_3D_VIEW'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant 3D Preview</span>
              </button>
            </div>

            {/* TAB 1: PHYSICAL SITE VISIT & CHAUFFEUR TOUR */}
            {activeMode === 'PHYSICAL_SITE_VISIT' && (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs animate-fade-in">
                {/* Date and Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-white/80 block mb-1 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Preferred Tour Date:</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 block mb-1 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Experience Time Slot:</span>
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="11:00 AM - 01:00 PM (Morning Luxury Tour)">11:00 AM - 01:00 PM (Morning Daylight Tour)</option>
                      <option value="02:30 PM - 04:30 PM (Sunlight & Wind Study)">02:30 PM - 04:30 PM (Sunlight & Wind Study)</option>
                      <option value="05:30 PM - 07:00 PM (Sunset Sky Club Experience)">05:30 PM - 07:00 PM (Sunset Golden Hour)</option>
                      <option value="07:30 PM - 09:00 PM (Evening Skyline Lighting)">07:30 PM - 09:00 PM (Evening Skyline Lighting)</option>
                    </select>
                  </div>
                </div>

                {/* Chauffeur Fleet & Pickup Option */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <label className="text-white/80 block font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      <span>VIP Chauffeur & Transit Logistics:</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">Complimentary Kiaan Fleet</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    {[
                      { id: 'MAYBACH_CHAUFFEUR', label: 'Mercedes-Maybach', sub: 'Chauffeur Pickup' },
                      { id: 'BMW_7_SERIES', label: 'BMW 7 Series', sub: 'Chauffeur Pickup' },
                      { id: 'SELF_DRIVE', label: 'Self-Drive VIP', sub: 'Reserved Valet Bay' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTransitOption(opt.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          transitOption === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="font-bold">{opt.label}</div>
                        <div className="text-[9px] opacity-60">{opt.sub}</div>
                      </button>
                    ))}
                  </div>

                  {transitOption !== 'SELF_DRIVE' && (
                    <div className="pt-2">
                      <label className="text-white/60 block mb-1 text-[11px]">Chauffeur Pickup Address:</label>
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="Enter your residence, hotel or private airport hangar..."
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* Hospitality & Special Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-white/80 block mb-1 font-medium flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sky Club Refreshment:</span>
                    </label>
                    <select
                      value={refreshmentPreference}
                      onChange={(e) => setRefreshmentPreference(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="NESPRESSO_COFFEE">Artisan Nespresso & High Pastries</option>
                      <option value="CHAMPAGNE_CAVIAR">Champagne & Beluga Caviar Tasting</option>
                      <option value="ARTISAN_TEA">Darjeeling Single Estate Tea</option>
                      <option value="VEGAN_ORGANIC">Organic Cold-Pressed Juices</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/80 block mb-1 font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>Party / Family Size:</span>
                    </label>
                    <select
                      value={attendeesCount}
                      onChange={(e) => setAttendeesCount(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value={1}>1 Guest (Private Executive Inspection)</option>
                      <option value={2}>2 Guests (Couple / Co-Investor)</option>
                      <option value={4}>Up to 4 Family Members</option>
                      <option value={6}>Private Family Entourage (6+)</option>
                    </select>
                  </div>
                </div>

                {/* Visitor Credentials */}
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Contact Information for Itinerary Dispatch</span>
                    {userSession && <span className="text-emerald-400 font-normal">Auto-filled from Active Session</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="WhatsApp Number"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Car className="w-4 h-4" />
                  <span>{isSubmitting ? 'Securing VIP Itinerary...' : 'Confirm Private VIP Viewing & Chauffeur'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: LIVE 4K VIRTUAL WALKTHROUGH (NRI & REMOTE BUYERS) */}
            {activeMode === 'LIVE_VIDEO_TOUR' && (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs animate-fade-in">
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <Globe className="w-4 h-4" />
                    <span>Global Investor & NRI Remote Tele-Viewing</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">
                    Connect with our Senior Portfolio Director via encrypted 4K Live Stream. Includes real-time site drone camera pan, 3D CAD blueprint walkthrough, and live Q&A with our legal title advocate.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-white/80 block mb-1 font-medium">Timezone Preference:</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="IST">India (IST — UTC+5:30)</option>
                      <option value="GST">Dubai / UAE (GST — UTC+4:00)</option>
                      <option value="GMT">London / UK (GMT — UTC+0:00)</option>
                      <option value="EST">New York (EST — UTC-5:00)</option>
                      <option value="SGT">Singapore (SGT — UTC+8:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/80 block mb-1 font-medium">Virtual Date:</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 block mb-1 font-medium">Video Platform:</label>
                    <select className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500">
                      <option>Google Meet (4K High Def)</option>
                      <option>Zoom VIP Room</option>
                      <option>WhatsApp Video Call</option>
                    </select>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/80 block mb-1">Your Name:</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 block mb-1">Email for Calendar Invite:</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Video className="w-4 h-4" />
                  <span>{isSubmitting ? 'Scheduling Live Stream...' : 'Book 4K Live Virtual Walkthrough'}</span>
                </button>
              </form>
            )}

            {/* TAB 3: INSTANT 3D SPATIAL PREVIEW (Direct interactive viewing inside the modal!) */}
            {activeMode === 'INSTANT_3D_VIEW' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black h-64 sm:h-72 group">
                  <img
                    src={targetAsset.imageUrl}
                    alt={targetAsset.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                  {/* Top Simulator Controls */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-amber-400 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Interactive 3D Preview Active</span>
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-[10px]">
                      Floor Level: <strong className="text-amber-400">{activeFloorLevel}F</strong> (Elevation: {activeFloorLevel * 3.5}m)
                    </span>
                  </div>

                  {/* Simulation Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-bold">{targetAsset.title}</div>
                      <div className="text-[10px] text-white/70">
                        {sunHour >= 6 && sunHour <= 11
                          ? '🌅 Morning Golden Sun (East Facing)'
                          : sunHour >= 12 && sunHour <= 15
                          ? '☀️ High Noon Natural Ambient Light'
                          : sunHour >= 16 && sunHour <= 18
                          ? '🌇 Sunset Golden Hour (West Horizon)'
                          : '🌌 Nocturnal Skyline Ambient Lighting'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveMode('PHYSICAL_SITE_VISIT')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] shadow cursor-pointer"
                    >
                      Book Real Visit
                    </button>
                  </div>
                </div>

                {/* Interactive Controls */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sunlight & Daylight Simulator</span>
                    </span>
                    <span className="font-mono text-amber-400 text-xs font-bold">{sunHour}:00 hrs</span>
                  </div>

                  <input
                    type="range"
                    min={6}
                    max={21}
                    value={sunHour}
                    onChange={(e) => setSunHour(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/50 font-mono">
                    <span>06:00 (Dawn)</span>
                    <span>12:00 (Noon)</span>
                    <span>17:00 (Sunset)</span>
                    <span>21:00 (Night)</span>
                  </div>
                </div>

                {/* Floor Level Selector */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Select Viewing Elevation Tier:</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { level: 8, label: 'Podium Garden', floor: '8th Floor' },
                      { level: 16, label: 'Mid Horizon', floor: '16th Floor' },
                      { level: 24, label: 'Sky Suites', floor: '24th Floor' },
                      { level: 32, label: 'Crown Penthouse', floor: '32nd Floor' },
                    ].map((tier) => (
                      <button
                        key={tier.level}
                        type="button"
                        onClick={() => setActiveFloorLevel(tier.level)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          activeFloorLevel === tier.level
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-[11px]">{tier.floor}</div>
                        <div className="text-[9px] opacity-60">{tier.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMode('PHYSICAL_SITE_VISIT')}
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    Proceed to Schedule Physical Maybach Tour
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
