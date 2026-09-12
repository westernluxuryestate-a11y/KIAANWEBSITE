/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ReraBadge } from './ReraBadge';
import { SeoImage } from './SeoImage';
import { seoEngine } from '../services/seoAndMetadataEngine';
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
  HardHat,
} from 'lucide-react';
import { ConstructionProgressBar, getProjectConstructionProgress } from './ConstructionProgressBar';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  onOpenUnits: (project: Project) => void;
  onScheduleVisit: (project: Project) => void;
  onOpenDigitalTwin?: (project: Project) => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onOpenUnits,
  onScheduleVisit,
  onOpenDigitalTwin,
  index = 0,
}) => {
  const coverImage = project.media.find((m) => m.isCover)?.url || project.media[0]?.url;
  const progressInfo = getProjectConstructionProgress(project);

  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="group rounded-3xl bg-[#0F141F] border border-white/10 hover:border-amber-500/40 transition-colors duration-500 overflow-hidden shadow-2xl flex flex-col justify-between"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-72 overflow-hidden">
        <SeoImage
          src={coverImage}
          alt={seoEngine.generateMediaAltText({
            entityType: 'PROJECT',
            entityTitle: project.name,
            locality: project.location.microMarket || 'Pune',
            city: project.location.city || 'Pune',
            mediaCategory: 'EXTERIOR',
            reraNumber: project.reraRecord?.registrationNumber,
          })}
          context={{
            entityType: 'PROJECT',
            entityTitle: project.name,
            locality: project.location.microMarket || 'Pune',
            city: project.location.city || 'Pune',
            mediaCategory: 'EXTERIOR',
            reraNumber: project.reraRecord?.registrationNumber,
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141F] via-transparent to-black/40 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2">
            {project.isKiaanPick && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Kiaan Pick</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider">
              {project.status.replace('_', ' ')}
            </span>
            {/* Small 'Micro-market' indicator badge */}
            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/50 text-amber-300 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-md">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Micro-market: <strong className="text-white font-extrabold">{project.location.microMarket}</strong></span>
            </span>

            {/* Construction Progress Indicator Badge */}
            <span
              className={`px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold tracking-wide flex items-center gap-1.5 shadow-md ${
                progressInfo.isComplete
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-black/75 border-amber-500/40 text-amber-300'
              }`}
            >
              <HardHat className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Completion: <strong className="text-white font-mono font-bold">{progressInfo.percentage}%</strong></span>
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MahaRERA Verified</span>
          </div>
        </div>

        {/* Bottom image overlay stats */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-bold tracking-wide shadow-sm">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Micro-market: <strong className="text-white">{project.location.microMarket}</strong></span>
              <span className="text-white/60 font-normal">· {project.location.city}</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white tracking-wide">{project.name}</h3>
          </div>

          <div className="text-right shrink-0">
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

        {/* Visual Completion Gauge Indicator */}
        <ConstructionProgressBar project={project} />

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
    </motion.div>
  );
};
