/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KIAAN REALTY ENTERPRISE GIS LOCATION INTELLIGENCE CONSOLE
 * Authoritative Master Management, Alias Normalization, Approval Queue & Spatial Governance
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
  Compass,
  Check,
  X,
  Building2,
  Trash2,
  Eye,
  SlidersHorizontal,
  FileCode,
  ShieldCheck,
  Sparkles,
  Train,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import {
  locationIntelligencePlatform,
  LocationMasterRecord,
  LocationAliasRecord,
  VerificationStatus,
} from '../../services/locationIntelligencePlatform';
import { LocationCreationModal } from './LocationCreationModal';
import { LocationIntelligenceArchitectureViewer } from './LocationIntelligenceArchitectureViewer';

interface LocationIntelligenceAdminConsoleProps {
  userRole?: string;
  onClose?: () => void;
}

export const LocationIntelligenceAdminConsole: React.FC<LocationIntelligenceAdminConsoleProps> = ({
  userRole = 'ADMIN',
  onClose,
}) => {
  const [locations, setLocations] = useState<LocationMasterRecord[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationMasterRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCorp, setFilterCorp] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showArchViewer, setShowArchViewer] = useState(false);

  // Alias creation state for selected location
  const [newAliasName, setNewAliasName] = useState('');
  const [newAliasLang, setNewAliasLang] = useState<'en' | 'mr' | 'hi' | 'phonetic'>('en');
  const [newAliasType, setNewAliasType] = useState<LocationAliasRecord['aliasType']>('SEARCH_SYNONYM');

  // Interactive Duplicate Tester sandbox
  const [testInputName, setTestInputName] = useState('Baner Road');
  const [testResult, setTestResult] = useState<any>(null);

  // Load locations from platform
  const refreshData = () => {
    setLocations(locationIntelligencePlatform.getAllLocations(true));
  };

  useEffect(() => {
    refreshData();
    const unsub = locationIntelligencePlatform.subscribe(refreshData);
    return unsub;
  }, []);

  // Set initial selected location
  useEffect(() => {
    if (!selectedLocation && locations.length > 0) {
      setSelectedLocation(locations[0]);
    }
  }, [locations, selectedLocation]);

  // Run duplicate test
  useEffect(() => {
    if (testInputName.trim()) {
      const dup = locationIntelligencePlatform.detectDuplicateLocation({ nameEn: testInputName });
      const resolved = locationIntelligencePlatform.resolveToCanonicalLocation(testInputName);
      setTestResult({ dup, resolved });
    } else {
      setTestResult(null);
    }
  }, [testInputName]);

  // Filter locations
  const filteredLocations = locations.filter((loc) => {
    if (filterCorp !== 'ALL' && !loc.municipalCorporation.includes(filterCorp)) return false;
    if (filterStatus !== 'ALL' && loc.verificationStatus !== filterStatus) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      loc.nameEn.toLowerCase().includes(q) ||
      (loc.nameMr && loc.nameMr.includes(q)) ||
      loc.pincode.includes(q) ||
      loc.id.toLowerCase().includes(q) ||
      loc.alternateNames.some((alt) => alt.toLowerCase().includes(q))
    );
  });

  const handleStatusChange = (locId: string, status: VerificationStatus) => {
    locationIntelligencePlatform.updateVerificationStatus(locId, status);
    if (selectedLocation?.id === locId) {
      setSelectedLocation((prev) => (prev ? { ...prev, verificationStatus: status } : null));
    }
  };

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || !newAliasName.trim()) return;

    locationIntelligencePlatform.addAlias({
      locationId: selectedLocation.id,
      aliasName: newAliasName.trim(),
      language: newAliasLang,
      aliasType: newAliasType,
      confidenceScore: 0.96,
      isPrimaryRedirect: true,
    });

    setNewAliasName('');
  };

  const handleDeleteAlias = (aliasId: string) => {
    locationIntelligencePlatform.deleteAlias(aliasId);
  };

  const aliasesForSelected = selectedLocation
    ? locationIntelligencePlatform.getAliasesForLocation(selectedLocation.id)
    : [];

  return (
    <div className="space-y-6 text-white animate-in fade-in duration-150">
      {/* Top Banner & Action Controls */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-white/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Location Intelligence Platform (LIP) Master Console
          </h2>
          <p className="text-xs text-white/60">
            Enforce Single Source of Truth: Canonical IDs, Hierarchy Tree, Multilingual Aliases, &amp; PostGIS Coordinates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowArchViewer(!showArchViewer)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>{showArchViewer ? 'Hide GIS DDL & Specs' : 'View PostGIS DDL & Specs'}</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Canonical Location</span>
          </button>
        </div>
      </div>

      {/* Embedded Architecture Viewer if toggled */}
      {showArchViewer && <LocationIntelligenceArchitectureViewer />}

      {/* Duplicate Resolution Interactive Sandbox */}
      <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Instant Alias &amp; Duplicate Resolution Simulator
          </span>
          <span className="text-[10px] text-white/40">Zero Free-Text Locality Testing Sandbox</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={testInputName}
            onChange={(e) => setTestInputName(e.target.value)}
            placeholder="Type any raw string: Baner Road, बाणेर, Baner Gaon, 411045..."
            className="flex-1 min-w-[240px] px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 font-medium"
          />
          <div className="flex items-center gap-2">
            {['Baner Road', 'बाणेर गाव', 'Wakad Chowk', 'EON Free Zone', '411045'].map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setTestInputName(pill)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/70 border border-white/5"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {testResult?.resolved ? (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Resolves raw input <strong>"{testInputName}"</strong> to Canonical Master ID:{' '}
                <strong className="text-emerald-300 font-mono">{testResult.resolved.id}</strong> ({testResult.resolved.nameEn})
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
              {testResult.resolved.hierarchyPath}
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>No canonical match found. The system triggers "Location Not Found" and enforces new creation.</span>
          </div>
        )}
      </div>

      {/* Main Grid: Location Master Table + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Location Master Directory */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search canonical name, Marathi, PIN, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterCorp}
                onChange={(e) => setFilterCorp(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="ALL" className="bg-neutral-900">All Corporations</option>
                <option value="PMC" className="bg-neutral-900">PMC Only</option>
                <option value="PCMC" className="bg-neutral-900">PCMC Only</option>
                <option value="PMRDA" className="bg-neutral-900">PMRDA Only</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="ALL" className="bg-neutral-900">All Statuses</option>
                <option value="APPROVED" className="bg-neutral-900">Approved Only</option>
                <option value="PENDING_REVIEW" className="bg-neutral-900">Pending Review</option>
                <option value="DRAFT" className="bg-neutral-900">Drafts</option>
              </select>
            </div>
          </div>

          {/* Directory Cards */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const isApproved = loc.verificationStatus === 'APPROVED';

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-neutral-900/80 border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wide">
                          {loc.nameEn}
                        </span>
                        {loc.nameMr && (
                          <span className="text-xs font-semibold text-amber-300 font-serif">
                            ({loc.nameMr})
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/70">
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

                      <div className="text-[11px] text-white/50 flex flex-wrap items-center gap-x-2">
                        <span>{loc.municipalCorporation}</span>
                        <span>•</span>
                        <span>PIN: {loc.pincode}</span>
                        <span>•</span>
                        <span>{loc.ward}</span>
                        <span>•</span>
                        <span className="text-amber-400">RERA Projects: {loc.reraRegisteredProjectCount || 0}</span>
                      </div>

                      <div className="text-[10px] text-white/40 font-mono truncate">
                        {loc.hierarchyPath}
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-white/40 mt-1 transition-transform ${isSelected ? 'rotate-90 text-amber-400' : ''}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Location Inspector & Alias Governance */}
        <div className="lg:col-span-5 space-y-4">
          {selectedLocation ? (
            <div className="p-5 rounded-2xl bg-neutral-900 border border-white/20 space-y-5">
              {/* Header Details */}
              <div className="border-b border-white/10 pb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {selectedLocation.nameEn}
                    </h3>
                    {selectedLocation.nameMr && (
                      <span className="text-sm font-semibold text-amber-300 font-serif">
                        {selectedLocation.nameMr}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 font-mono">
                    ID: {selectedLocation.id} • Level: {selectedLocation.locationLevel} (LOCALITY)
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedLocation.verificationStatus !== 'APPROVED' ? (
                    <button
                      onClick={() => handleStatusChange(selectedLocation.id, 'APPROVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedLocation.id, 'PENDING_REVIEW')}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px]"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>

              {/* Spatial Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/40 block">Postal Pincode</span>
                  <span className="font-bold text-amber-300">{selectedLocation.pincode}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/40 block">Corporation</span>
                  <span className="font-semibold text-white">{selectedLocation.municipalCorporation}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/40 block">Coordinates (EPSG:4326)</span>
                  <span className="font-mono text-[10px] text-white/90">
                    {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/40 block">Geohash / H3</span>
                  <span className="font-mono text-[10px] text-emerald-400">
                    {selectedLocation.geohash}
                  </span>
                </div>
              </div>

              {/* Canonical Hierarchy Path */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-white/40 uppercase tracking-wider block font-semibold">
                  Canonical Path (Parent-Child Tree)
                </span>
                <span className="text-xs font-mono text-emerald-300 break-all block">
                  {selectedLocation.hierarchyPath}
                </span>
              </div>

              {/* Nearest Transit Hub & POIs */}
              {selectedLocation.nearestMetroStation && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-2">
                  <Train className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    Nearest Metro: <strong>{selectedLocation.nearestMetroStation}</strong>
                  </span>
                </div>
              )}

              {/* Alias Master Table for Selected Locality */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Registered Aliases ({aliasesForSelected.length})
                  </span>
                  <span className="text-[10px] text-white/40">301 Redirect Target</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {aliasesForSelected.map((als) => (
                    <div
                      key={als.id}
                      className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-medium text-white">{als.aliasName}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-white/60 uppercase">
                          {als.language}
                        </span>
                        <span className="text-[9px] text-amber-400/80 font-mono">
                          {als.aliasType}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteAlias(als.id)}
                        className="text-white/40 hover:text-rose-400 p-1"
                        title="Delete alias"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Alias Form */}
                <form onSubmit={handleAddAlias} className="space-y-2 pt-2">
                  <span className="text-[11px] text-white/60 block">Add New Alias to this Canonical Locality:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Baner Village, Baner West..."
                      value={newAliasName}
                      onChange={(e) => setNewAliasName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <select
                      value={newAliasLang}
                      onChange={(e) => setNewAliasLang(e.target.value as any)}
                      className="px-2 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white"
                    >
                      <option value="en">EN</option>
                      <option value="mr">MR (मराठी)</option>
                      <option value="hi">HI (हिंदी)</option>
                    </select>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-neutral-900 border border-white/10 text-center text-xs text-white/50">
              Select a location from the directory to inspect its canonical hierarchy and aliases.
            </div>
          )}
        </div>
      </div>

      {/* Dedicated Location Creation Modal */}
      {isCreateModalOpen && (
        <LocationCreationModal
          isOpen={isCreateModalOpen}
          userRole={userRole}
          onClose={() => setIsCreateModalOpen(false)}
          onLocationCreated={(newLoc) => {
            setSelectedLocation(newLoc);
            refreshData();
          }}
        />
      )}
    </div>
  );
};
