/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KiaanPropertiesLogoProps {
  className?: string;
  variant?: 'full' | 'monogram' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  animated?: boolean;
}

export const KiaanPropertiesLogo: React.FC<KiaanPropertiesLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  theme = 'dark',
  animated = false,
}) => {
  const isDark = theme === 'dark';

  // Sizing definitions
  const sizeClasses = {
    sm: variant === 'monogram' ? 'h-7 w-7' : 'h-7',
    md: variant === 'monogram' ? 'h-9 w-9' : 'h-9 sm:h-10',
    lg: variant === 'monogram' ? 'h-12 w-12' : 'h-12 sm:h-14',
    xl: variant === 'monogram' ? 'h-16 w-16' : 'h-16 sm:h-20',
  };

  // Monogram / Icon only
  if (variant === 'monogram') {
    return (
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} ${className} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
        aria-label="Kiaan Properties Monogram"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="kgold1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="35%" stopColor="#F5B731" />
            <stop offset="70%" stopColor="#C98A16" />
            <stop offset="100%" stopColor="#8A5807" />
          </linearGradient>

          <linearGradient id="kgold2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="40%" stopColor="#E6A825" />
            <stop offset="80%" stopColor="#A06709" />
            <stop offset="100%" stopColor="#5F3A02" />
          </linearGradient>

          <linearGradient id="kgoldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FBD36D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B3740A" stopOpacity="0.1" />
          </linearGradient>

          {/* Luxury Deep Navy Gradients */}
          <linearGradient id="knavy1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A3A" />
            <stop offset="50%" stopColor="#061026" />
            <stop offset="100%" stopColor="#020611" />
          </linearGradient>

          <linearGradient id="knavy2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="kshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#kshadow)">
          {/* Outer Gold Crescent Swoosh */}
          <path
            d="M 28 85 C 28 42 62 14 98 12 C 78 22 52 46 50 85 C 48 118 72 138 90 146 C 54 142 28 120 28 85 Z"
            fill="url(#kgold1)"
          />

          {/* Left Tower Background Navy Facet */}
          <polygon
            points="38,142 38,72 58,54 58,142"
            fill="url(#knavy1)"
          />
          {/* Left Tower Golden Bevel */}
          <polygon
            points="58,54 68,45 68,142 58,142"
            fill="url(#kgold2)"
          />
          {/* Windows / Vertical Lines in Tower */}
          <line x1="45" y1="80" x2="45" y2="135" stroke="url(#kgold1)" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="51" y1="72" x2="51" y2="135" stroke="url(#kgold1)" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Center Tall Gold Skyscraper (Spire) */}
          <polygon
            points="68,142 68,36 84,6 84,142"
            fill="url(#kgold1)"
          />
          {/* Tall Skyscraper Right Shadow Facet */}
          <polygon
            points="84,6 94,22 94,142 84,142"
            fill="url(#kgold2)"
          />
          {/* Spire Highlight Edge */}
          <line x1="84" y1="6" x2="84" y2="142" stroke="#FFF7C2" strokeWidth="1.5" />

          {/* Deep Navy Tower Inside */}
          <polygon
            points="94,62 108,76 108,142 94,142"
            fill="url(#knavy2)"
          />

          {/* Stylized 'K' Upper Gold Arm */}
          <polygon
            points="84,78 136,26 150,38 94,92"
            fill="url(#kgold1)"
          />
          <polygon
            points="136,26 150,38 142,42 128,30"
            fill="url(#kgoldHighlight)"
          />

          {/* Stylized 'K' Lower Gold Arm */}
          <polygon
            points="88,86 142,142 124,142 78,96"
            fill="url(#kgold2)"
          />
          <polygon
            points="88,86 104,80 148,132 136,142"
            fill="url(#kgold1)"
          />

          {/* Base Tiered Pedestal */}
          <polygon
            points="22,142 152,142 144,148 30,148"
            fill="url(#kgold2)"
          />
          <polygon
            points="18,148 156,148 148,153 26,153"
            fill="url(#kgold1)"
          />
        </g>
      </svg>
    );
  }

  // Full Horizontal Brand Lockup (Monogram + KIAAN + PROPERTIES)
  return (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${sizeClasses[size]} ${className} ${
        animated ? 'group cursor-pointer' : ''
      }`}
    >
      {/* 3D Gold & Navy Architectural Monogram Emblem */}
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square shrink-0 group-hover:scale-105 transition-transform duration-300"
        aria-label="Kiaan Monogram"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="kgold_h1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="35%" stopColor="#F5B731" />
            <stop offset="70%" stopColor="#C98A16" />
            <stop offset="100%" stopColor="#8A5807" />
          </linearGradient>

          <linearGradient id="kgold_h2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="40%" stopColor="#E6A825" />
            <stop offset="80%" stopColor="#A06709" />
            <stop offset="100%" stopColor="#5F3A02" />
          </linearGradient>

          <linearGradient id="kgold_h_high" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FBD36D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B3740A" stopOpacity="0.1" />
          </linearGradient>

          {/* Luxury Deep Navy Gradients */}
          <linearGradient id="knavy_h1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A3A" />
            <stop offset="50%" stopColor="#061026" />
            <stop offset="100%" stopColor="#020611" />
          </linearGradient>

          <linearGradient id="knavy_h2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Drop Shadow */}
          <filter id="kshadow_h" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        <g filter="url(#kshadow_h)">
          {/* Outer Gold Crescent Swoosh */}
          <path
            d="M 28 85 C 28 42 62 14 98 12 C 78 22 52 46 50 85 C 48 118 72 138 90 146 C 54 142 28 120 28 85 Z"
            fill="url(#kgold_h1)"
          />

          {/* Left Tower Background Navy Facet */}
          <polygon
            points="38,142 38,72 58,54 58,142"
            fill="url(#knavy_h1)"
          />
          {/* Left Tower Golden Bevel */}
          <polygon
            points="58,54 68,45 68,142 58,142"
            fill="url(#kgold_h2)"
          />
          {/* Windows / Vertical Lines in Tower */}
          <line x1="45" y1="80" x2="45" y2="135" stroke="url(#kgold_h1)" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="51" y1="72" x2="51" y2="135" stroke="url(#kgold_h1)" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Center Tall Gold Skyscraper (Spire) */}
          <polygon
            points="68,142 68,36 84,6 84,142"
            fill="url(#kgold_h1)"
          />
          {/* Tall Skyscraper Right Shadow Facet */}
          <polygon
            points="84,6 94,22 94,142 84,142"
            fill="url(#kgold_h2)"
          />
          {/* Spire Highlight Edge */}
          <line x1="84" y1="6" x2="84" y2="142" stroke="#FFF7C2" strokeWidth="1.5" />

          {/* Deep Navy Tower Inside */}
          <polygon
            points="94,62 108,76 108,142 94,142"
            fill="url(#knavy_h2)"
          />

          {/* Stylized 'K' Upper Gold Arm */}
          <polygon
            points="84,78 136,26 150,38 94,92"
            fill="url(#kgold_h1)"
          />
          <polygon
            points="136,26 150,38 142,42 128,30"
            fill="url(#kgold_h_high)"
          />

          {/* Stylized 'K' Lower Gold Arm */}
          <polygon
            points="88,86 142,142 124,142 78,96"
            fill="url(#kgold_h2)"
          />
          <polygon
            points="88,86 104,80 148,132 136,142"
            fill="url(#kgold_h1)"
          />

          {/* Base Tiered Pedestal */}
          <polygon
            points="22,142 152,142 144,148 30,148"
            fill="url(#kgold_h2)"
          />
          <polygon
            points="18,148 156,148 148,153 26,153"
            fill="url(#kgold_h1)"
          />
        </g>
      </svg>

      {/* Typographic Wordmark: KIAAN PROPERTIES */}
      <div className="flex flex-col justify-center min-w-0">
        {/* KIAAN with Signature Bevel and Navy / Deep Dark Tone */}
        <div className="flex items-center">
          <span
            className={`font-serif text-[19px] sm:text-[23px] lg:text-[25px] font-extrabold tracking-[0.14em] leading-none transition-colors ${
              isDark
                ? 'text-white'
                : 'text-[#06152F]'
            }`}
            style={{
              textShadow: isDark
                ? '0 2px 10px rgba(0,0,0,0.6), 0 0 1px rgba(245, 183, 49, 0.4)'
                : '0 1px 2px rgba(6, 21, 47, 0.15)',
            }}
          >
            KIAAN
          </span>
        </div>

        {/* — PROPERTIES — in burnished gold with horizontal wing dividers */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
          <div className="h-[1px] w-3 sm:w-5 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 opacity-80" />
          <span
            className="text-[8px] sm:text-[9.5px] lg:text-[10px] font-serif uppercase font-bold tracking-[0.28em] sm:tracking-[0.32em] bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent shrink-0"
          >
            PROPERTIES
          </span>
          <div className="h-[1px] w-3 sm:w-5 bg-gradient-to-l from-transparent via-amber-400 to-amber-500 opacity-80" />
        </div>
      </div>
    </div>
  );
};
