/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Building,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  UserCheck,
  Lock,
} from 'lucide-react';
import { Project, Property, UserSession } from '../types';
import { globalKiaanStore } from '../services/store';
import { formatINR } from '../services/calculatorEngine';
import { PropertyProjectEditorModal, EditorMode } from './PropertyProjectEditorModal';

interface MyManagedListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession | null;
  onSelectProperty?: (property: Property) => void;
  onSelectProject?: (project: Project) => void;
  theme?: 'dark' | 'light';
}

export const MyManagedListingsModal: React.FC<MyManagedListingsModalProps> = ({
  isOpen,
  onClose,
  session,
  onSelectProperty,
  onSelectProject,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const isSuperAdmin = globalKiaanStore.isSuperAdminOrStaff(session);

  const [activeTab, setActiveTab] = useState<'PROPERTIES' | 'PROJECTS'>('PROPERTIES');
  const [filterMode, setFilterMode] = useState<'MY_ONLY' | 'ALL'>('MY_ONLY');
  const [searchQuery, setSearchQuery] = useState('');

  // Store data state with reactive updates
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  // Sub-editor modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('CREATE_PROPERTY');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const refreshListings = () => {
    setAllProjects(globalKiaanStore.getAllProjectsForAdmin());
    setAllProperties(globalKiaanStore.getAllPropertiesForAdmin());
  };

  useEffect(() => {
    if (!isOpen) return;
    refreshListings();
    const unsubscribe = globalKiaanStore.subscribe(() => {
      refreshListings();
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter properties
  const displayedProperties = allProperties.filter((prop) => {
    // Permission filter
    if (filterMode === 'MY_ONLY') {
      const userEmail = (session?.email || '').trim().toLowerCase();
      const userId = session?.userId || '';
      const creatorEmail = (prop.createdBy?.email || '').trim().toLowerCase();
      const contribEmail = (prop.contributor?.email || '').trim().toLowerCase();
      const creatorId = prop.createdBy?.userId || '';

      const isOwner =
        (userEmail && (creatorEmail === userEmail || contribEmail === userEmail)) ||
        (userId && creatorId === userId);

      // If no session or not owner, only super admin can see if they choose ALL
      if (!isOwner && !isSuperAdmin) return false;
      if (!isOwner && isSuperAdmin && filterMode === 'MY_ONLY') {
        // Show ones matching sales@ or created by admin
        if (creatorEmail !== 'sales@kiaanproperties.in' && creatorEmail !== userEmail) return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchLocation = (prop.location?.microMarket || '').toLowerCase().includes(q);
      const matchConfig = (prop.configuration || '').toLowerCase().includes(q);
      const matchType = (prop.propertyType || '').toLowerCase().includes(q);
      return matchTitle || matchLocation || matchConfig || matchType;
    }

    return true;
  });

  // Filter projects
  const displayedProjects = allProjects.filter((proj) => {
    if (filterMode === 'MY_ONLY') {
      const userEmail = (session?.email || '').trim().toLowerCase();
      const userId = session?.userId || '';
      const creatorEmail = (proj.createdBy?.email || '').trim().toLowerCase();
      const contribEmail = (proj.contributor?.email || '').trim().toLowerCase();
      const creatorId = proj.createdBy?.userId || '';

      const isOwner =
        (userEmail && (creatorEmail === userEmail || contribEmail === userEmail)) ||
        (userId && creatorId === userId);

      if (!isOwner && !isSuperAdmin) return false;
      if (!isOwner && isSuperAdmin && filterMode === 'MY_ONLY') {
        if (creatorEmail !== 'sales@kiaanproperties.in' && creatorEmail !== userEmail) return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = proj.name.toLowerCase().includes(q);
      const matchLocation = (proj.location?.microMarket || '').toLowerCase().includes(q);
      const matchDev = (proj.developerName || '').toLowerCase().includes(q);
      return matchName || matchLocation || matchDev;
    }

    return true;
  });

  // Action handlers
  const handleOpenCreateProperty = () => {
    setSelectedProperty(null);
    setEditorMode('CREATE_PROPERTY');
    setEditorOpen(true);
  };

  const handleOpenCreateProject = () => {
    setSelectedProject(null);
    setEditorMode('CREATE_PROJECT');
    setEditorOpen(true);
  };

  const handleEditProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setEditorMode('EDIT_PROPERTY');
    setEditorOpen(true);
  };

  const handleEditProject = (proj: Project) => {
    setSelectedProject(proj);
    setEditorMode('EDIT_PROJECT');
    setEditorOpen(true);
  };

  const handleDeleteProperty = (prop: Property) => {
    const canMod = globalKiaanStore.canUserModifyProperty(prop, session);
    if (!canMod) {
      alert(`Access Denied: You cannot delete "${prop.title}". Only the creator (${prop.createdBy?.name || prop.createdBy?.email}) or a Super Admin can delete this listing.`);
      return;
    }

    const confirmDel = window.confirm(`Are you sure you want to delete property "${prop.title}"?`);
    if (!confirmDel) return;

    const res = globalKiaanStore.deleteProperty(prop.id, session || undefined);
    if (res.success) {
      refreshListings();
    } else {
      alert(res.message);
    }
  };

  const handleDeleteProject = (proj: Project) => {
    const canMod = globalKiaanStore.canUserModifyProject(proj, session);
    if (!canMod) {
      alert(`Access Denied: You cannot delete "${proj.name}". Only the creator (${proj.createdBy?.name || proj.createdBy?.email}) or a Super Admin can delete this project.`);
      return;
    }

    const confirmDel = window.confirm(`Are you sure you want to delete project "${proj.name}" and all associated units?`);
    if (!confirmDel) return;

    const res = globalKiaanStore.deleteProject(proj.id, session || undefined);
    if (res.success) {
      refreshListings();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-[#0B101B] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-current/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shadow-md">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold">Manage Properties & Projects</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 font-mono">
                  {session ? session.name : 'Guest Contributor'}
                </span>
              </div>
              <p className="text-xs opacity-70">
                Add, modify, and delete all types of properties and projects by the respective creator.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreateProperty}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
            <button
              onClick={handleOpenCreateProject}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl opacity-60 hover:opacity-100 hover:bg-current/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: TABS & SEARCH & SCOPE */}
        <div className="px-6 py-3 bg-black/20 border-b border-current/10 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('PROPERTIES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'PROPERTIES'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-current/5 opacity-60 hover:opacity-100 hover:bg-current/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Properties ({displayedProperties.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('PROJECTS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'PROJECTS'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-current/5 opacity-60 hover:opacity-100 hover:bg-current/10'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Master Projects ({displayedProjects.length})</span>
            </button>
          </div>

          {/* Search & Filter Scope */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, location, BHK..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {isSuperAdmin && (
              <div className="flex items-center bg-current/10 rounded-xl p-0.5 text-xs font-bold">
                <button
                  onClick={() => setFilterMode('MY_ONLY')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'MY_ONLY' ? 'bg-amber-500 text-black' : 'opacity-60'
                  }`}
                >
                  My Added
                </button>
                <button
                  onClick={() => setFilterMode('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'ALL' ? 'bg-amber-500 text-black' : 'opacity-60'
                  }`}
                >
                  All Inventory
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LISTINGS CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'PROPERTIES' ? (
            /* PROPERTIES LIST */
            displayedProperties.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">No Properties Found</h3>
                  <p className="text-xs opacity-60 max-w-md mx-auto">
                    {filterMode === 'MY_ONLY'
                      ? 'You have not added any properties under this account yet. Click "Add Property" to list a penthouse, villa, apartment, or commercial floor.'
                      : 'No properties match your current search criteria.'}
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateProperty}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Your First Property</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedProperties.map((prop) => {
                  const canModify = globalKiaanStore.canUserModifyProperty(prop, session);
                  const isCreator =
                    prop.createdBy?.email?.toLowerCase() === (session?.email || '').toLowerCase();
                  const coverImage = prop.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

                  return (
                    <div
                      key={prop.id}
                      className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                        isDark ? 'bg-white/5 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-amber-500'
                      }`}
                    >
                      <div className="flex gap-3.5">
                        <img
                          src={coverImage}
                          alt={prop.title}
                          className="w-24 h-24 rounded-xl object-cover flex-shrink-0 border border-current/10"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400 font-mono">
                              {prop.propertyType}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                prop.status === 'AVAILABLE'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {prop.status}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm truncate" title={prop.title}>
                            {prop.title}
                          </h4>
                          <div className="text-xs opacity-70 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span>{prop.location?.microMarket}, {prop.location?.city}</span>
                            <span>•</span>
                            <span>{prop.configuration}</span>
                          </div>
                          <div className="text-xs font-mono font-bold text-amber-400">
                            {formatINR(prop.pricing?.agreementValue || 0)}
                          </div>
                        </div>
                      </div>

                      {/* Creator Attribution Badge */}
                      <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 opacity-80">
                          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate">
                            Added by: <strong>{isCreator ? 'You' : prop.createdBy?.name || 'Authorized Owner'}</strong>
                          </span>
                        </div>

                        {!canModify && (
                          <span className="text-[10px] text-red-400 flex items-center gap-1 font-bold">
                            <Lock className="w-3 h-3" /> Read Only
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        {onSelectProperty && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectProperty(prop);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-current/5 hover:bg-current/10 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleEditProperty(prop)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              canModify
                                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-sm'
                                : 'bg-current/5 opacity-50 cursor-not-allowed'
                            }`}
                            title={canModify ? 'Modify Property' : 'Only the creator can edit this property'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {canModify && (
                            <button
                              type="button"
                              onClick={() => handleDeleteProperty(prop)}
                              className="p-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete Property"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* PROJECTS LIST */
            displayedProjects.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Building className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">No Projects Found</h3>
                  <p className="text-xs opacity-60 max-w-md mx-auto">
                    {filterMode === 'MY_ONLY'
                      ? 'You have not added any master projects under this account yet. Click "Add Project" to onboard a residential or commercial master development.'
                      : 'No master projects match your search.'}
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateProject}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Project</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedProjects.map((proj) => {
                  const canModify = globalKiaanStore.canUserModifyProject(proj, session);
                  const isCreator =
                    proj.createdBy?.email?.toLowerCase() === (session?.email || '').toLowerCase();
                  const coverImage = proj.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

                  return (
                    <div
                      key={proj.id}
                      className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                        isDark ? 'bg-white/5 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-amber-500'
                      }`}
                    >
                      <div className="flex gap-3.5">
                        <img
                          src={coverImage}
                          alt={proj.name}
                          className="w-24 h-24 rounded-xl object-cover flex-shrink-0 border border-current/10"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400 font-mono">
                              {proj.projectType}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                              {proj.status}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm truncate" title={proj.name}>
                            {proj.name}
                          </h4>
                          <div className="text-xs opacity-70 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span>{proj.location?.microMarket}, {proj.location?.city}</span>
                            <span>•</span>
                            <span>{proj.totalTowersCount} Towers</span>
                          </div>
                          <div className="text-xs font-mono font-bold text-amber-400">
                            {proj.headlinePriceRange?.displayString || 'Price On Request'}
                          </div>
                        </div>
                      </div>

                      {/* Creator Attribution */}
                      <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 opacity-80">
                          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate">
                            Added by: <strong>{isCreator ? 'You' : proj.createdBy?.name || 'Authorized Developer'}</strong>
                          </span>
                        </div>

                        {!canModify && (
                          <span className="text-[10px] text-red-400 flex items-center gap-1 font-bold">
                            <Lock className="w-3 h-3" /> Read Only
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        {onSelectProject && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectProject(proj);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-current/5 hover:bg-current/10 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleEditProject(proj)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              canModify
                                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-sm'
                                : 'bg-current/5 opacity-50 cursor-not-allowed'
                            }`}
                            title={canModify ? 'Modify Project' : 'Only the creator can edit this project'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {canModify && (
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(proj)}
                              className="p-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* SUB-MODAL FOR EDITING / CREATING PROPERTY OR PROJECT */}
        {editorOpen && (
          <PropertyProjectEditorModal
            isOpen={editorOpen}
            onClose={() => setEditorOpen(false)}
            mode={editorMode}
            initialProperty={selectedProperty}
            initialProject={selectedProject}
            session={session}
            theme={theme}
            onSuccess={() => {
              refreshListings();
            }}
          />
        )}
      </div>
    </div>
  );
};
