/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Project } from '../types';
import { ReraBadge } from './ReraBadge';
import {
  MapPin,
  Building,
  Maximize2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  onOpenUnits: (project: Project) => void;
  onScheduleVisit: (project: Project) => void;
  onOpenDigitalTwin?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onOpenUnits,
  onScheduleVisit,
  onOpenDigitalTwin,
}) => {
  const coverImage = project.media.find((m) => m.isCover)?.url || project.media[0]?.url;

  return (
    <div
      id={`project-card-${project.id}`}
      className="group rounded-3xl bg-[#0F141F] border border-white/10 hover:border-amber-500/40 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col justify-between"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={coverImage}
          alt={project.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141F] via-transparent to-black/40"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project.isKiaanPick && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Kiaan Pick</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider">
              {project.status.replace('_', ' ')}
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MahaRERA Verified</span>
          </div>
        </div>

        {/* Bottom image overlay stats */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.location.microMarket}, {project.location.city}</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white tracking-wide mt-0.5">{project.name}</h3>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Price Range</div>
            <div className="text-xl font-serif font-bold text-white">{project.headlinePriceRange.displayString}</div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
        {/* Configurations & Specs */}
        <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-black/40 border border-white/5 text-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">Configurations</span>
            <span className="text-xs font-bold text-white mt-0.5 block truncate">
              {project.configurations[0]}
            </span>
          </div>
          <div className="border-x border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">Carpet Area</span>
            <span className="text-xs font-bold text-white mt-0.5 block">
              {project.carpetAreaRangeSqFt.min} - {project.carpetAreaRangeSqFt.max} sq.ft
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">Possession</span>
            <span className="text-xs font-bold text-amber-300 mt-0.5 block">{project.possessionDate}</span>
          </div>
        </div>

        {/* MahaRERA Badge */}
        <ReraBadge reraRecord={project.reraRecord} compact />

        {/* Highlights */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Signature Highlights</span>
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
            {project.architecturalHighlights?.[0] || 'Curated luxury architectural design with spacious layouts.'}
          </p>
        </div>

        {/* Commute */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60">
          {(project.location?.landmarks || []).slice(0, 2).map((lm, i) => (
            <span key={i} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>{lm.name} ({lm.commuteMinutes}m)</span>
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-2 pt-2">
          {onOpenDigitalTwin && (
            <button
              id={`digital-twin-btn-${project.id}`}
              onClick={() => onOpenDigitalTwin(project)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 hover:from-amber-500/30 hover:via-blue-500/30 hover:to-purple-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch 3D Digital Twin & Sunlight Simulator</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              id={`select-unit-btn-${project.id}`}
              onClick={() => onOpenUnits(project)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Select Unit</span>
            </button>

            <button
              id={`schedule-visit-btn-${project.id}`}
              onClick={() => onScheduleVisit(project)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Site Visit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
