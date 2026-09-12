/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KIAAN REALTY DEDICATED LOCATION CREATION & APPROVAL MODAL
 * Canonical Location Intelligence Enterprise Form with Live Duplicate Detection
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  X,
  AlertTriangle,
  CheckCircle2,
  Building,
  Sparkles,
  Layers,
  Search,
  Check,
  ShieldCheck,
  Compass,
  FileCheck2,
  Info,
} from 'lucide-react';
import {
  locationIntelligencePlatform,
  LocationCreationPayload,
  LocationMasterRecord,
  CANONICAL_PARENT_NODES,
  DuplicateDetectionResult,
} from '../../services/locationIntelligencePlatform';

interface LocationCreationModalProps {
  isOpen: boolean;
  initialName?: string;
  onClose: () => void;
  onLocationCreated: (location: LocationMasterRecord) => void;
  userRole?: string;
}

export const LocationCreationModal: React.FC<LocationCreationModalProps> = ({
  isOpen,
  initialName = '',
  onClose,
  onLocationCreated,
  userRole = 'USER',
}) => {
  const isAdmin = userRole === 'ADMIN' || userRole === 'ENTERPRISE_ADMIN';

  const [formData, setFormData] = useState<LocationCreationPayload>({
    nameEn: initialName,
    nameMr: '',
    nameHi: '',
    parentId: 'WARD-PMC-09',
    locationType: 'LOCALITY',
    pincode: '411045',
    latitude: 18.5596,
    longitude: 73.7799,
    googlePlaceId: '',
    municipalCorporation: 'PMC',
    zone: 'West Pune Zone',
    ward: 'Ward No. 09 (Baner - Balewadi)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    popularName: '',
    alternateNames: [],
    source: 'MANUAL_CURATION',
    areaSqKm: 5.5,
  });

  const [altNameInput, setAltNameInput] = useState('');
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateDetectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [bypassWarning, setBypassWarning] = useState(false);

  // Sync initial name
  useEffect(() => {
    if (initialName) {
      setFormData((prev) => ({ ...prev, nameEn: initialName }));
    }
  }, [initialName]);

  // Live duplicate detection as user types
  useEffect(() => {
    if (formData.nameEn.trim().length >= 3) {
      const result = locationIntelligencePlatform.detectDuplicateLocation({
        nameEn: formData.nameEn,
        googlePlaceId: formData.googlePlaceId,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pincode: formData.pincode,
      });
      setDuplicateCheck(result);
      if (!result.isDuplicate) {
        setBypassWarning(false);
      }
    } else {
      setDuplicateCheck(null);
    }
  }, [formData.nameEn, formData.googlePlaceId, formData.latitude, formData.longitude, formData.pincode]);

  if (!isOpen) return null;

  const handleAddAlternateName = () => {
    if (!altNameInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      alternateNames: [...(prev.alternateNames || []), altNameInput.trim()],
    }));
    setAltNameInput('');
  };

  const handleRemoveAlternateName = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      alternateNames: (prev.alternateNames || []).filter((_, i) => i !== index),
    }));
  };

  const handleSelectExistingDuplicate = (loc: LocationMasterRecord) => {
    onLocationCreated(loc);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // If duplicate detected with high confidence and not bypassed
    if (duplicateCheck?.isDuplicate && duplicateCheck.confidence >= 80 && !bypassWarning) {
      setErrorMsg(
        `High similarity with existing location "${duplicateCheck.matchedLocation?.nameEn}". Please select the existing location or check "Confirm Distinct Location" if you are certain.`
      );
      return;
    }

    const res = locationIntelligencePlatform.createLocation(formData, {
      requestedByAdmin: isAdmin,
      autoApprove: isAdmin,
    });

    if (res.success && res.location) {
      setSuccessMsg(
        isAdmin
          ? `Canonical Location "${res.location.nameEn}" (${res.location.id}) successfully created and approved in Location Master!`
          : `Location "${res.location.nameEn}" (${res.location.id}) submitted to GIS review queue. It is now selectable in draft state.`
      );
      setTimeout(() => {
        onLocationCreated(res.location!);
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Failed to create location.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-black/50 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Create New Canonical Location
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  LIP Master Schema v2.4
                </span>
              </h3>
              <p className="text-[11px] text-white/50">
                All real estate assets, builders, and transactions strictly link to this Canonical ID.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* DUPLICATE WARNING CALLOUT */}
          {duplicateCheck?.isDuplicate && (
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    This location already exists or is very similar
                  </h4>
                  <p className="text-xs text-white/80">{duplicateCheck.reason}</p>
                </div>
              </div>

              {/* Possible Matches List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-white/70 block">
                  Possible Canonical Matches in Master:
                </span>
                <div className="space-y-1.5">
                  {duplicateCheck.candidates.slice(0, 3).map((cand) => (
                    <div
                      key={cand.location.id}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {cand.location.nameEn}
                          </span>
                          {cand.location.nameMr && (
                            <span className="text-[11px] text-amber-300 font-serif">
                              ({cand.location.nameMr})
                            </span>
                          )}
                          <span className="text-[10px] text-white/50 font-mono">
                            {cand.location.id}
                          </span>
                        </div>
                        <div className="text-[10px] text-white/50">
                          {cand.location.municipalCorporation} • {cand.location.ward} • PIN: {cand.location.pincode}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectExistingDuplicate(cand.location)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Select Existing Location
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
                <input
                  type="checkbox"
                  id="bypassCheck"
                  checked={bypassWarning}
                  onChange={(e) => setBypassWarning(e.target.checked)}
                  className="rounded border-amber-500/50 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="bypassCheck" className="text-[11px] text-white/80 cursor-pointer">
                  I confirm this is a distinct geographical entity from the matches above.
                </label>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. PARENT HIERARCHY SELECTION (NO ORPHANS) */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                1. Canonical Parent Assignment (Mandatory - No Orphans)
              </label>
              <span className="text-[10px] text-white/40">Hierarchical Path Integrity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Parent Ward / Zone *</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const node = CANONICAL_PARENT_NODES[pid];
                    setFormData((prev) => ({
                      ...prev,
                      parentId: pid,
                      ward: node ? node.name : prev.ward,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {Object.values(CANONICAL_PARENT_NODES).map((node) => (
                    <option key={node.id} value={node.id} className="bg-neutral-900 text-white">
                      [{node.type}] {node.name} ({node.path})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Municipal Authority *</label>
                <select
                  value={formData.municipalCorporation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, municipalCorporation: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="PMC" className="bg-neutral-900">Pune Municipal Corporation (PMC)</option>
                  <option value="PCMC" className="bg-neutral-900">Pimpri-Chinchwad Municipal Corporation (PCMC)</option>
                  <option value="PMRDA" className="bg-neutral-900">Pune Metropolitan Region (PMRDA)</option>
                  <option value="MCGM" className="bg-neutral-900">Mumbai Municipal Corporation (MCGM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. MULTILINGUAL NOMENCLATURE */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              2. Multilingual Nomenclature &amp; Canonical Names
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">English Canonical Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baner"
                  value={formData.nameEn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Marathi Name (Devanagari)</label>
                <input
                  type="text"
                  placeholder="उदा. बाणेर"
                  value={formData.nameMr || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameMr: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-amber-200 font-serif focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Hindi Name (Devanagari)</label>
                <input
                  type="text"
                  placeholder="उदा. बानेर"
                  value={formData.nameHi || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameHi: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white/90 font-serif focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Popular Commercial Name</label>
                <input
                  type="text"
                  placeholder="e.g. Baner High Street Corridor"
                  value={formData.popularName || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, popularName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Postal Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 411045"
                  value={formData.pincode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pincode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Alternate Aliases Management */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-[11px] text-white/70 block">
                Search Aliases &amp; Spelling Variations (Normalizes to this Location ID)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Baner Road, Baner Gaon, Baner West..."
                  value={altNameInput}
                  onChange={(e) => setAltNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAlternateName();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddAlternateName}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Add Alias
                </button>
              </div>

              {formData.alternateNames && formData.alternateNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.alternateNames.map((alt, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs"
                    >
                      <span>{alt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAlternateName(i)}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. GIS COORDINATES & POSTGIS BOUNDS */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              3. GIS Coordinates &amp; PostGIS Spatial Bounds
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Latitude (WGS84 EPSG:4326) *</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData((prev) => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Longitude (WGS84 EPSG:4326) *</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData((prev) => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Area (sq. km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.areaSqKm || 5.0}
                  onChange={(e) => setFormData((prev) => ({ ...prev, areaSqKm: parseFloat(e.target.value) || 1.0 }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Google Place ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ChIJq_j3X6jBwjsR2T_8qZfTj0M"
                  value={formData.googlePlaceId || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, googlePlaceId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white/80 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/70 block">Authoritative Data Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="PMC_GIS" className="bg-neutral-900">PMC Development Plan GIS</option>
                  <option value="PCMC_GIS" className="bg-neutral-900">PCMC DP Master</option>
                  <option value="MAHARERA" className="bg-neutral-900">MahaRERA Project Master</option>
                  <option value="IGR_MAHARASHTRA" className="bg-neutral-900">IGR Maharashtra Registration Deed</option>
                  <option value="GOOGLE_PLACES" className="bg-neutral-900">Google Places API</option>
                  <option value="OPENSTREETMAP" className="bg-neutral-900">OpenStreetMap (OSM) Overpass</option>
                  <option value="MANUAL_CURATION" className="bg-neutral-900">Manual GIS Curation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isAdmin ? 'Save & Approve Canonical Location' : 'Save Location & Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
