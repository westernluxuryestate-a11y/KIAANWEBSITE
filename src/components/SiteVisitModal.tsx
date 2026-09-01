/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../types';
import { X, Calendar, Video, MapPin, CheckCircle2, User, Phone, Mail, Clock } from 'lucide-react';
import { crmEngine } from '../services/crmIntegrationEngine';

interface SiteVisitModalProps {
  project: Project;
  onClose: () => void;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({ project, onClose }) => {
  const [visitType, setVisitType] = useState<'PHYSICAL_SITE_VISIT' | 'LIVE_VIDEO_TOUR'>('PHYSICAL_SITE_VISIT');
  const [preferredDate, setPreferredDate] = useState('2026-09-02');
  const [preferredSlot, setPreferredSlot] = useState('11:00 AM - 01:00 PM (Morning Luxury Tour)');
  const [userName, setUserName] = useState('Ananya Deshmukh');
  const [userPhone, setUserPhone] = useState('+91 99220 11223');
  const [userEmail, setUserEmail] = useState('ananya.deshmukh@example.com');
  const [notes, setNotes] = useState('Interested in 3 BHK high-floor corner residence overlooking Hinjewadi corridor.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetType: 'PROJECT',
          assetId: project.id,
          assetTitle: project.name,
          visitType,
          preferredDate,
          preferredSlot,
          userName,
          userPhone,
          userEmail,
          notes,
        }),
      });
      const data = await res.json();

      // Dispatch to CRM Outbox Queue with Data Minimization (Items 123 - 125)
      crmEngine.dispatchToCrm('VISIT_REQUESTED', {
        consentGranted: true,
        contactInfo: {
          name: userName,
          phone: userPhone,
          email: userEmail,
          preferredChannel: 'WHATSAPP',
        },
        entity: {
          entityType: 'PROJECT',
          entityId: project.id,
          entityTitle: project.name,
          reraRegistrationNumber: project.reraRecord?.registrationNumber,
          microMarket: project.location.microMarket,
        },
        intentCategory: 'VIP_SITE_VISIT',
        minimalMetadata: {
          visitType,
          preferredDate,
          preferredSlot,
        },
      });

      if (data.success) {
        setIsConfirmed(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0B0F17] border border-white/15 p-6 md:p-8 space-y-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isConfirmed ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">Private Tour Confirmed!</h3>
            <p className="text-sm text-white/70 max-w-md mx-auto">
              Your appointment for <span className="text-amber-400 font-semibold">{project.name}</span> on{' '}
              <span className="text-white font-semibold">{preferredDate}</span> ({preferredSlot}) has been scheduled.
              A Kiaan Private Portfolio Executive has been assigned to your itinerary.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Exclusive Experience</span>
              <h3 className="text-2xl font-serif font-bold text-white">Schedule Private Tour</h3>
              <p className="text-xs text-white/60 mt-1">{project.name} — {project.location.address}</p>
            </div>

            {/* Visit Type Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-black/40 border border-white/10">
              <button
                type="button"
                onClick={() => setVisitType('PHYSICAL_SITE_VISIT')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  visitType === 'PHYSICAL_SITE_VISIT'
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Physical Site Visit</span>
              </button>

              <button
                type="button"
                onClick={() => setVisitType('LIVE_VIDEO_TOUR')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  visitType === 'LIVE_VIDEO_TOUR'
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Live 4K Video Tour</span>
              </button>
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preferred Date:</span>
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Time Window:</span>
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="11:00 AM - 01:00 PM (Morning Luxury Tour)">11:00 AM - 01:00 PM (Morning)</option>
                  <option value="03:00 PM - 05:00 PM (Afternoon Sun Study)">03:00 PM - 05:00 PM (Afternoon)</option>
                  <option value="05:30 PM - 07:00 PM (Sunset Sky Experience)">05:30 PM - 07:00 PM (Sunset)</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Name:</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Phone:</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-white/70 block mb-1 font-medium flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email:</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Securing Slot...' : 'Confirm Private Site Itinerary'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
