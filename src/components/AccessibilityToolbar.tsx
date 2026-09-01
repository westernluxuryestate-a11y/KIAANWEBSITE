/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Eye,
  Type,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Volume2,
  Check,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { DeviceAccessibilityPreferences } from '../types';

interface AccessibilityToolbarProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<DeviceAccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    screenReaderOptimized: false,
    fontSizeScale: 'NORMAL',
    keyboardNavigationActive: true,
  });

  useEffect(() => {
    // Check system prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefs((p) => ({ ...p, reducedMotion: true }));
    }
  }, []);

  const handleToggleReducedMotion = () => {
    const next = !prefs.reducedMotion;
    setPrefs({ ...prefs, reducedMotion: next });
    if (next) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const handleToggleHighContrast = () => {
    const next = !prefs.highContrast;
    setPrefs({ ...prefs, highContrast: next });
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const handleFontSizeChange = (scale: 'NORMAL' | 'LARGE' | 'EXTRA_LARGE') => {
    setPrefs({ ...prefs, fontSizeScale: scale });
    document.documentElement.classList.remove('text-scale-large', 'text-scale-xl');
    if (scale === 'LARGE') document.documentElement.classList.add('text-scale-large');
    if (scale === 'EXTRA_LARGE') document.documentElement.classList.add('text-scale-xl');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Accessibility & Display Settings (WCAG AA)"
        className={`p-3 rounded-full border shadow-xl flex items-center justify-center transition-all cursor-pointer ${
          isOpen
            ? 'bg-amber-500 text-black border-amber-400 scale-110'
            : theme === 'dark'
            ? 'bg-[#0B101C] text-white border-white/20 hover:border-amber-500'
            : 'bg-white text-slate-800 border-slate-300 hover:border-amber-500'
        }`}
        title="Accessibility Settings (WCAG AA)"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          className={`absolute bottom-16 left-0 w-80 p-5 rounded-3xl border shadow-2xl space-y-4 animate-fade-in text-xs ${
            theme === 'dark'
              ? 'bg-[#0B101C] text-white border-white/20'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-current/10">
            <div className="flex items-center gap-2 font-serif font-bold text-sm">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Accessibility Suite (Item 135)</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              WCAG AA
            </span>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <span className="opacity-80">High Contrast Mode</span>
            <button
              onClick={handleToggleHighContrast}
              className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold cursor-pointer ${
                prefs.highContrast
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-current/10 border-current/15'
              }`}
            >
              {prefs.highContrast ? 'Active ✓' : 'Off'}
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <span className="opacity-80">Reduced Motion</span>
            <button
              onClick={handleToggleReducedMotion}
              className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold cursor-pointer ${
                prefs.reducedMotion
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-current/10 border-current/15'
              }`}
            >
              {prefs.reducedMotion ? 'Active ✓' : 'Off'}
            </button>
          </div>

          {/* Text Size Scaling */}
          <div className="space-y-1.5">
            <span className="opacity-80 block">Typography Scaling</span>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
              {(['NORMAL', 'LARGE', 'EXTRA_LARGE'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleFontSizeChange(s)}
                  className={`py-1 rounded-lg border cursor-pointer ${
                    prefs.fontSizeScale === s
                      ? 'bg-amber-500 text-black font-bold border-amber-400'
                      : 'bg-current/5 border-current/10 opacity-70'
                  }`}
                >
                  {s === 'NORMAL' ? '100%' : s === 'LARGE' ? '120%' : '140%'}
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme Toggle */}
          {onToggleTheme && (
            <div className="pt-3 border-t border-current/10 flex items-center justify-between">
              <span className="opacity-80">Color Scheme</span>
              <button
                onClick={onToggleTheme}
                className="px-3 py-1 rounded-xl border border-current/15 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Dark Luxury' : 'Light Classic'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
