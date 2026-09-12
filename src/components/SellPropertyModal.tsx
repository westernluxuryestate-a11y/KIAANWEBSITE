/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  User,
  MapPin,
  Camera,
  Trash2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { analyzePhotoQuality, PhotoQualityAnalysisResult } from '../services/calculatorEngine';
import { Amenity } from '../types';
import { MASTER_AMENITIES } from '../data/seedData';
import { AmenitySelector } from './AmenitySelector';

interface SellPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onOpenWhatsAppOnboarding?: (mode?: 'PROPERTY' | 'PROJECT') => void;
  onOpenUniversalListingForm?: () => void;
}

interface UploadedPhoto {
  id: string;
  name: string;
  url: string;
}

export const SellPropertyModal: React.FC<SellPropertyModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  onOpenWhatsAppOnboarding,
  onOpenUniversalListingForm,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    propertyType: 'PENTHOUSE',
    microMarket: 'Baner',
    exactAddress: '',
    buildingName: 'The Imperial Crest',
    unitNumber: 'Tower B, 1802',
    bhk: '3 BHK',
    carpetAreaSqFt: '1650',
    floorNumber: '18',
    totalFloors: '28',
    ageYears: '0-2 Yrs (Brand New)',
    condition: 'Immaculate Designer Furnished',
    expectedPriceCr: '2.85',
    possessionStatus: 'READY_OC',
    hasRera: 'YES',
    wants3DScan: true,
  });

  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(
    MASTER_AMENITIES.slice(0, 4)
  );

  const [photos, setPhotos] = useState<UploadedPhoto[]>([
    {
      id: 'p1',
      name: 'Living_Room_Daylight.jpg',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'p2',
      name: 'Master_Balcony_Skyline.jpg',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  const photoAnalysis: PhotoQualityAnalysisResult = analyzePhotoQuality(
    photos.map((p) => ({ name: p.name, url: p.url }))
  );

  if (!isOpen) return null;

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPhoto: UploadedPhoto = {
        id: `p-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
      };
      setPhotos([...photos, newPhoto]);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-[#0B101B] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Banner */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-current/10 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>79. Sell My Property Concierge Engine</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-current">List Your Prime Asset Directly</h2>
            <p className="text-xs opacity-70">
              Direct access to 14,000+ verified HNI & NRI purchasers. Free 3D LiDAR Twin creation and automated AI photo grading.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl opacity-60 hover:opacity-100 hover:bg-current/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Universal Listing Form CTA for Non-Residential / Advanced Schemas */}
        {onOpenUniversalListingForm && !submitted && (
          <div className="px-6 py-2 bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-transparent border-b border-amber-500/30 flex items-center justify-between text-xs">
            <span className="text-amber-300 font-medium">
              🏢 Need to list <strong>Commercial, Pre-Leased Offices, Land & Plots, or Industrial</strong>?
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUniversalListingForm();
              }}
              className="px-3 py-1 rounded-lg bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Universal Listing Suite</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Step Progression Bar */}
        {!submitted && (
          <div className="px-6 py-2.5 bg-black/20 border-b border-white/5 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeStep === 1 ? 'text-amber-400' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>Asset & Location Details</span>
            </button>
            <span className="opacity-20">→</span>
            <button
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeStep === 2 ? 'text-amber-400' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>Photos & AI Quality Analysis</span>
            </button>
            <span className="opacity-20">→</span>
            <button
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeStep === 3 ? 'text-amber-400' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
              <span>Owner & Verification Dossier</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">Private Listing Application Received</h3>
              <p className="text-xs opacity-70 max-w-lg mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-amber-400">{formData.ownerName || 'Property Owner'}</span>. Your luxury asset listing in <span className="font-bold text-white">{formData.microMarket}</span> with {photos.length} AI-graded photos has been submitted to the Kiaan HNI Private Portfolio Desk.
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Next Verification Milestones:</span>
                </div>
                <div className="opacity-80">1. Sub-Registrar / MahaRERA title encumbrance check within 2 business hours.</div>
                <div className="opacity-80">2. Dispatch of 3D Matterport LiDAR scanning team for interactive twin creation.</div>
                <div className="opacity-80">3. Private showcase to matched pre-qualified high-net-worth investors.</div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* WhatsApp Fast-Track Onboarding Alternative */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-emerald-400 block text-xs flex items-center gap-1.5">
                      <span>Fast-Track: Onboard via WhatsApp Assistant (+91 77966 55556)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </span>
                    <span className="text-[11px] opacity-75 block">
                      Send photos, voice note, or text to +91 77966 55556. AI auto-formats pricing, area, and MahaRERA audit.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenWhatsAppOnboarding) {
                        onOpenWhatsAppOnboarding('PROPERTY');
                      } else {
                        window.open('https://wa.me/917796655556?text=Hi%20Kiaan%2C%20I%20want%20to%20list%20my%20property.', '_blank');
                      }
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>List on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenWhatsAppOnboarding) {
                        onOpenWhatsAppOnboarding('PROJECT');
                      } else {
                        window.open('https://wa.me/917796655556?text=Hi%20Kiaan%2C%20I%20want%20to%20onboard%20a%20developer%20project.', '_blank');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-current text-xs font-semibold transition-all cursor-pointer"
                    title="Developer master project"
                  >
                    Master Project
                  </button>
                </div>
              </div>

              {/* STEP 1: ASSET & LOCATION */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80">Building / Society Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Marvel Imperial"
                        value={formData.buildingName}
                        onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80">Unit / Floor Identifier</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Tower B, Flat 1802"
                        value={formData.unitNumber}
                        onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80">Micro-Market</label>
                      <select
                        value={formData.microMarket}
                        onChange={(e) => setFormData({ ...formData, microMarket: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="Baner" className="text-black">Baner, Pune</option>
                        <option value="Wakad" className="text-black">Wakad, Pune</option>
                        <option value="Balewadi" className="text-black">Balewadi High Street</option>
                        <option value="Hinjewadi" className="text-black">Hinjewadi IT Corridor</option>
                        <option value="Koregaon Park" className="text-black">Koregaon Park</option>
                        <option value="Kharadi" className="text-black">Kharadi Riverside</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80">Configuration</label>
                      <select
                        value={formData.bhk}
                        onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="2 BHK" className="text-black">2 BHK Luxury</option>
                        <option value="3 BHK" className="text-black">3 BHK Premium</option>
                        <option value="4 BHK" className="text-black">4 BHK Grand</option>
                        <option value="5+ BHK" className="text-black">5+ BHK Penthouse</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80">Carpet Area (Sq.Ft) *</label>
                      <input
                        required
                        type="number"
                        placeholder="e.g. 1650"
                        value={formData.carpetAreaSqFt}
                        onChange={(e) => setFormData({ ...formData, carpetAreaSqFt: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold opacity-80 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Full Street Address & Landmark</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Survey No. 45/2, Pancard Club Road, Baner, Pune 411045"
                      value={formData.exactAddress}
                      onChange={(e) => setFormData({ ...formData, exactAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80">Target Valuation (₹ Crores) *</label>
                      <input
                        required
                        type="number"
                        step="0.05"
                        placeholder="e.g. 2.85"
                        value={formData.expectedPriceCr}
                        onChange={(e) => setFormData({ ...formData, expectedPriceCr: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80">Possession & Title Certificate</label>
                      <select
                        value={formData.possessionStatus}
                        onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="READY_OC" className="text-black">Ready Possession (Occupancy Cert Received)</option>
                        <option value="UNDER_CONSTRUCTION" className="text-black">Under Construction (MahaRERA Registered)</option>
                        <option value="RESALE" className="text-black">Clear Freehold Resale Asset</option>
                      </select>
                    </div>
                  </div>

                  {/* Amenities Selection (By Tick or Manual) */}
                  <AmenitySelector
                    title="Included Amenities & Luxury Specifications"
                    selectedAmenities={selectedAmenities}
                    onChange={setSelectedAmenities}
                    theme={theme}
                  />

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs tracking-wider cursor-pointer"
                    >
                      Next: Upload Photos & AI Analysis →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PHOTOS & 80. AI PHOTO QUALITY ANALYSIS */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>80. AI Photo Quality Inspection Engine</span>
                      </h4>
                      <p className="text-white/60 text-xs">
                        Overall Portfolio Grade: <span className="text-emerald-400 font-bold">{photoAnalysis.grade}</span> ({photoAnalysis.overallScore}/100)
                      </p>
                    </div>

                    <label className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUploadSim}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Photo Gallery with AI Diagnostics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {photos.map((photo, idx) => {
                      const diag = photoAnalysis.diagnostics[idx] || {
                        fileName: photo.name,
                        score: 90,
                        roomIdentified: 'Living',
                        isBlurry: false,
                        isDark: false,
                        issues: [],
                      };
                      return (
                        <div
                          key={photo.id}
                          className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 relative group overflow-hidden"
                        >
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>AI Score: {diag.score}/100</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => removePhoto(photo.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-white truncate max-w-[180px]">{photo.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                {diag.roomIdentified}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] text-white/60">
                              <div>Blurry: <span className={diag.isBlurry ? 'text-rose-400' : 'text-emerald-400'}>{diag.isBlurry ? 'Detected' : 'Clear'}</span></div>
                              <div>Luminance: <span className={diag.isDark ? 'text-rose-400' : 'text-emerald-400'}>{diag.isDark ? 'Low' : 'Optimal'}</span></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Recommendations */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1 text-white/70">
                    <span className="font-bold text-amber-400 block">AI Photographic Suggestions:</span>
                    {photoAnalysis.recommendations.map((rec, i) => (
                      <div key={i} className="text-white/60">💡 {rec}</div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2 rounded-xl border border-current/20 opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs tracking-wider cursor-pointer"
                    >
                      Next: Owner Dossier →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: OWNER & SUBMISSION */}
              {activeStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-500" />
                        <span>Owner / Representative Name *</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Vikramaditya Singhania"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold opacity-80 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        <span>Direct Mobile / WhatsApp *</span>
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+91 98230 XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-current/15 bg-current/5 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-amber-500">Seller Concierge Guarantees</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] opacity-80">
                      <div>✓ 0% Seller Commission</div>
                      <div>✓ Free 4K Matterport 3D Twin</div>
                      <div>✓ NDA Discretion for HNIs</div>
                      <div>✓ Legal Dossier Prepared by Experts</div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2 rounded-xl border border-current/20 opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs tracking-wider shadow-lg shadow-amber-500/25 cursor-pointer hover:brightness-105"
                    >
                      Publish Verified Luxury Asset Listing
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
