/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KIAAN REALTY CANONICAL LOCATION SELECTOR
 * Mandatory Step 1 Geographic Dropdown & Resolution Engine
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  Building2,
  ChevronDown,
  X,
  Compass,
  Train,
  Sparkles,
} from 'lucide-react';
import {
  locationIntelligencePlatform,
  LocationMasterRecord,
} from '../../services/locationIntelligencePlatform';

interface CanonicalLocationSelectorProps {
  selectedLocationId?: string;
  onSelectLocation: (location: LocationMasterRecord) => void;
  onOpenCreateLocationModal?: (initialName?: string) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  showDetailsCard?: boolean;
}

export const CanonicalLocationSelector: React.FC<CanonicalLocationSelectorProps> = ({
  selectedLocationId,
  onSelectLocation,
  onOpenCreateLocationModal,
  disabled = false,
  required = true,
  label = 'Canonical Location Master (Mandatory Step 1)',
  placeholder = 'Search by locality, alias (e.g. Baner Road), Marathi name, or pincode...',
  helperText = 'Projects and properties must reference an approved Canonical Location ID. Free-text names are strictly prevented.',
  className = '',
  showDetailsCard = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingLocations, setMatchingLocations] = useState<LocationMasterRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<LocationMasterRecord | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync selected record from prop
  useEffect(() => {
    if (selectedLocationId) {
      const loc = locationIntelligencePlatform.getLocationById(selectedLocationId);
      if (loc) {
        setSelectedRecord(loc);
      } else {
        // Try resolve if slug or name was passed
        const resolved = locationIntelligencePlatform.resolveToCanonicalLocation(selectedLocationId);
        if (resolved) {
          setSelectedRecord(resolved);
        }
      }
    } else {
      setSelectedRecord(null);
    }
  }, [selectedLocationId]);

  // Subscribe to changes in the platform
  useEffect(() => {
    const unsub = locationIntelligencePlatform.subscribe(() => {
      if (selectedLocationId) {
        const loc = locationIntelligencePlatform.getLocationById(selectedLocationId);
        if (loc) setSelectedRecord(loc);
      }
      setMatchingLocations(locationIntelligencePlatform.searchLocations(searchQuery, { onlyApproved: false }));
    });
    return unsub;
  }, [selectedLocationId, searchQuery]);

  // Handle Search Input
  useEffect(() => {
    const results = locationIntelligencePlatform.searchLocations(searchQuery, {
      maxResults: 12,
      onlyApproved: false,
    });
    setMatchingLocations(results);
  }, [searchQuery]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelect = (loc: LocationMasterRecord) => {
    setSelectedRecord(loc);
    onSelectLocation(loc);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRecord(null);
    setSearchQuery('');
  };

  return (
    <div className={`relative space-y-2 ${className}`} ref={dropdownRef}>
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{label}</span>
          {required && <span className="text-rose-400 text-sm">*</span>}
        </label>
        {selectedRecord ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Verified ID: {selectedRecord.id}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Selection Required
          </span>
        )}
      </div>

      {/* Main Select Button / Input Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          disabled
            ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
            : selectedRecord
            ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500 shadow-sm'
            : isOpen
            ? 'bg-black/60 border-amber-500 shadow-lg ring-1 ring-amber-500/20'
            : 'bg-black/40 border-white/20 hover:border-white/40'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <div className="p-1.5 rounded-lg bg-white/10 text-amber-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>

          {selectedRecord ? (
            <div className="truncate text-left flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  {selectedRecord.nameEn}
                </span>
                {selectedRecord.nameMr && (
                  <span className="text-[11px] font-medium text-amber-300/90 font-serif">
                    ({selectedRecord.nameMr})
                  </span>
                )}
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                  {selectedRecord.municipalCorporation}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  PIN: {selectedRecord.pincode}
                </span>
              </div>
              <div className="text-[11px] text-white/50 truncate flex items-center gap-2">
                <span>{selectedRecord.hierarchyPath}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-white/40 font-medium">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedRecord && !disabled && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
          />
        </div>
      </div>

      {helperText && <p className="text-[11px] text-white/50">{helperText}</p>}

      {/* DROPDOWN FLYOUT */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Box Header */}
          <div className="p-3 border-b border-white/10 bg-black/40">
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Baner, Wakad, बाणेर, 411045, Baner Road, EON..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/40 mt-2 px-1">
              <span>Supports Marathi Devanagari, English, Aliases &amp; Pincode</span>
              <span>Canonical Master v2.4</span>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5 p-1">
            {matchingLocations.length > 0 ? (
              matchingLocations.map((loc) => {
                const isSelected = selectedRecord?.id === loc.id;
                const isApproved = loc.verificationStatus === 'APPROVED';

                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/20 text-white'
                        : 'hover:bg-white/10 text-white/90'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {loc.nameEn}
                        </span>
                        {loc.nameMr && (
                          <span className="text-xs font-semibold text-amber-300 font-serif">
                            ({loc.nameMr})
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                          {loc.id}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            isApproved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {loc.verificationStatus}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/50">
                        <span>{loc.municipalCorporation}</span>
                        <span>•</span>
                        <span>Zone: {loc.zone}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-mono">PIN: {loc.pincode}</span>
                        {loc.nearestMetroStation && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-blue-300">
                              <Train className="w-2.5 h-2.5" />
                              {loc.nearestMetroStation}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Display alternate alias matches if applicable */}
                      {loc.alternateNames && loc.alternateNames.length > 0 && (
                        <div className="text-[10px] text-white/40 truncate">
                          Aliases: {loc.alternateNames.slice(0, 4).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[11px] text-amber-400 opacity-0 group-hover:opacity-100 font-semibold">
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* "Location not found" Mandatory Workflow */
              <div className="p-5 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Location not found.</h4>
                  <p className="text-[11px] text-white/60 max-w-xs mx-auto">
                    No verified locality in the Master matched "{searchQuery}". Arbitrary text names are not permitted.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenCreateLocationModal?.(searchQuery);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create New Location
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      alert(
                        `Location request for "${searchQuery}" has been submitted to the Kiaan GIS Enterprise Approval queue.`
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
                  >
                    Request Approval
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-transparent text-white/60 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Structured Geo Intelligence Card when Selected */}
      {showDetailsCard && selectedRecord && (
        <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3" />
              Canonical Geo Metadata
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              Geohash: {selectedRecord.geohash}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 block">Pincode</span>
              <span className="font-bold text-amber-300">{selectedRecord.pincode}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 block">Corporation</span>
              <span className="font-bold text-white">{selectedRecord.municipalCorporation}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 block">Ward / Zone</span>
              <span className="font-medium text-white/80 truncate block">{selectedRecord.ward}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 block">Coordinates</span>
              <span className="font-mono text-white/80 text-[10px]">
                {selectedRecord.latitude.toFixed(4)}, {selectedRecord.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] pt-1 text-white/60 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">Canonical Path:</span>
              <span className="font-mono text-emerald-300">{selectedRecord.hierarchyPath}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">Canonical SEO:</span>
              <span className="text-blue-300">{selectedRecord.seoPath}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
