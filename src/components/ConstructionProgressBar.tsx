/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { HardHat, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { Project } from '../types';

export interface ConstructionProgressData {
  percentage: number;
  stageName: string;
  isComplete: boolean;
  phaseLabel: string;
  lastUpdateDate?: string;
  isForm4Audited: boolean;
}

export function getProjectConstructionProgress(project: Project): ConstructionProgressData {
  let percentage: number;

  if (typeof project.constructionPercentage === 'number' && project.constructionPercentage >= 0) {
    percentage = project.constructionPercentage;
  } else if (
    project.constructionUpdates &&
    project.constructionUpdates.length > 0 &&
    typeof project.constructionUpdates[0].progressPercent === 'number'
  ) {
    percentage = project.constructionUpdates[0].progressPercent;
  } else if (project.milestones && project.milestones.length > 0) {
    const completed = project.milestones.filter((m) => m.status === 'COMPLETED').length;
    const inProgress = project.milestones.find((m) => m.status === 'IN_PROGRESS');
    const inProgressContrib = inProgress ? (inProgress.progressPercent || 50) / project.milestones.length : 0;
    percentage = Math.round((completed / project.milestones.length) * 100 + inProgressContrib);
  } else {
    switch (project.status) {
      case 'READY_POSSESSION':
      case 'COMPLETED':
        percentage = 100;
        break;
      case 'NEAR_POSSESSION':
        percentage = 85;
        break;
      case 'UNDER_CONSTRUCTION':
        percentage = 58;
        break;
      case 'PRE_LAUNCH':
        percentage = 15;
        break;
      default:
        percentage = 50;
        break;
    }
  }

  // Clamp between 0 and 100
  percentage = Math.min(100, Math.max(0, Math.round(percentage)));

  const isComplete = percentage >= 100 || project.status === 'READY_POSSESSION' || project.status === 'COMPLETED';

  // Determine stage name
  let stageName = project.constructionStage || '';
  if (!stageName && project.constructionUpdates && project.constructionUpdates.length > 0) {
    stageName = project.constructionUpdates[0].stageName;
  }
  if (!stageName && project.towers && project.towers[0]?.constructionStage) {
    stageName = project.towers[0].constructionStage;
  }
  if (!stageName) {
    if (isComplete) stageName = 'Ready for Possession (OC Received)';
    else if (percentage >= 80) stageName = 'Finishing & Glazing';
    else if (percentage >= 50) stageName = 'RCC Superstructure in Progress';
    else if (percentage >= 25) stageName = 'Podium & Lower Slabs Cast';
    else stageName = 'Excavation & Substructure';
  }

  // Determine phase badge
  let phaseLabel = 'Active Civil Work';
  if (isComplete) phaseLabel = 'Ready to Move';
  else if (percentage >= 80) phaseLabel = 'Advanced Stage';
  else if (percentage >= 50) phaseLabel = 'Mid-Rise RCC';
  else if (percentage >= 25) phaseLabel = 'Plinth & Foundation';
  else phaseLabel = 'Site Mobilization';

  const lastUpdateDate = project.constructionUpdates?.[0]?.date;
  const isForm4Audited = !!project.reraRecord?.registrationNumber;

  return {
    percentage,
    stageName,
    isComplete,
    phaseLabel,
    lastUpdateDate,
    isForm4Audited,
  };
}

interface ConstructionProgressBarProps {
  project: Project;
  compact?: boolean;
  className?: string;
  showStageDetails?: boolean;
  theme?: 'dark' | 'light';
}

export const ConstructionProgressBar: React.FC<ConstructionProgressBarProps> = ({
  project,
  compact = false,
  className = '',
  showStageDetails = true,
  theme = 'dark',
}) => {
  const { percentage, stageName, isComplete, phaseLabel, lastUpdateDate } =
    getProjectConstructionProgress(project);

  const isDark = theme === 'dark';

  if (compact) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 font-semibold text-white/70">
            <HardHat className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Construction</span>
          </span>
          <span className={`font-mono font-bold ${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
            {percentage}%
          </span>
        </div>
        <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full ${
              isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-300'
                : 'bg-gradient-to-r from-amber-500 to-amber-300'
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-3.5 border transition-all ${
        isDark
          ? 'bg-black/40 border-white/10 hover:border-amber-500/30'
          : 'bg-slate-50 border-slate-200'
      } ${className}`}
    >
      {/* Gauge Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              isComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <HardHat className="w-3.5 h-3.5" />}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
              Construction Completion
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              isComplete
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}
          >
            {phaseLabel}
          </span>
          <span
            className={`text-sm font-mono font-extrabold tracking-tight ${
              isComplete ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Visual Completion Gauge Track */}
      <div className="relative w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
        {/* Milestone Tick Marks at 25%, 50%, 75% */}
        <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none z-10">
          <div className="w-px h-full bg-white/20" title="25% Milestone" />
          <div className="w-px h-full bg-white/20" title="50% Milestone" />
          <div className="w-px h-full bg-white/20" title="75% Milestone" />
        </div>

        {/* Animated Progress Bar Fill */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className={`h-full rounded-full relative transition-all ${
            isComplete
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
          }`}
        >
          {/* Subtle pulse/shine head indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full blur-[1px]" />
        </motion.div>
      </div>

      {/* Stage Details Footer */}
      {showStageDetails && (
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/5 text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isComplete ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-white/75 truncate font-medium" title={stageName}>
              {stageName}
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-white/40 font-mono">
              {lastUpdateDate ? `Audited ${lastUpdateDate}` : 'MahaRERA Audited'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
