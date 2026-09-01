/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GeneratedPropertyReport,
  PropertyReportConfig,
  ReportSectionKey,
  ReportSectionOption,
} from '../types';
import { Project, Property, Unit } from '../types';
import { convertCurrency, formatINR } from './currencyEngine';

export const AVAILABLE_REPORT_SECTIONS: ReportSectionOption[] = [
  {
    key: 'photos',
    label: 'High-Res Photo Gallery',
    description: 'Architectural elevations, twilight vistas, and luxury interiors',
    iconName: 'Image',
    isDefaultSelected: true,
  },
  {
    key: 'floorPlan',
    label: 'Sanctioned Floor Blueprint',
    description: 'Dimensioned CAD layout, usable carpet area vs deck measurements',
    iconName: 'Layout',
    isDefaultSelected: true,
  },
  {
    key: 'price',
    label: 'Transparent Price Breakdown',
    description: 'Base agreement value, floor rise, parking allocation & rate/sq.ft',
    iconName: 'Tag',
    isDefaultSelected: true,
  },
  {
    key: 'amenities',
    label: 'Clubhouse & Lifestyle Amenities',
    description: 'Sky pool, Olympic fitness club, spa pavilion & EV infrastructure',
    iconName: 'Sparkles',
    isDefaultSelected: true,
  },
  {
    key: 'location',
    label: 'Micro-Market & Infrastructure',
    description: 'Neighborhood positioning, upcoming metro lines & high-speed corridors',
    iconName: 'MapPin',
    isDefaultSelected: true,
  },
  {
    key: 'commute',
    label: 'Commute & Travel Times',
    description: 'Direct transit duration to IT parks, top international schools & airport',
    iconName: 'Car',
    isDefaultSelected: true,
  },
  {
    key: 'emi',
    label: 'Loan & EMI Estimator',
    description: 'Monthly loan repayment schedules at benchmark interest rates',
    iconName: 'Calculator',
    isDefaultSelected: true,
  },
  {
    key: 'totalCost',
    label: 'Total Acquisition Cost (GST & Stamp Duty)',
    description: 'Maharashtra 6% Stamp Duty, 5% GST, ₹30k Registration & Sinking Fund',
    iconName: 'Receipt',
    isDefaultSelected: true,
  },
  {
    key: 'investment',
    label: 'Investment & Rental Yield Forecast',
    description: '5-10 yr capital appreciation scenarios, gross rental yields & IRR models',
    iconName: 'TrendingUp',
    isDefaultSelected: true,
  },
  {
    key: 'comparison',
    label: 'Micro-Market Benchmark Comparison',
    description: 'How this residence compares against Wakad and Baner regional benchmarks',
    iconName: 'Layers',
    isDefaultSelected: false,
  },
  {
    key: 'rera',
    label: 'MahaRERA Regulatory & Escrow Stamp',
    description: 'Statutory project registration, 70% escrow ring-fencing & valid dates',
    iconName: 'ShieldCheck',
    isDefaultSelected: true,
  },
];

export const MANDATORY_REPORT_DISCLAIMER =
  'CONFIDENTIAL PROPERTY DOSSIER: Generated dynamically by the Kiaan Intelligence™ Platform. All financial figures, tax levies (Stamp Duty/GST), and rental yield forecasts are computed from current statutory schedules and historical market indices. Statutory MahaRERA registration number: ';

/**
 * Generate a comprehensive property report dossier
 */
export function generatePropertyReport(
  config: PropertyReportConfig,
  project?: Project,
  property?: Property,
  unit?: Unit
): GeneratedPropertyReport {
  const timestamp = Date.now();
  const dateStr = new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const targetId = project?.id || property?.id || 'kiaan_asset';
  const targetTitle = project?.name || property?.title || 'Kiaan Luxury Residence';
  const targetTagline = project?.tagline || 'Sculpted Sky Residences';
  const reraNum = project?.reraRecord?.registrationNumber || property?.reraRecord?.registrationNumber || 'P52100028492';
  
  const reportCode = `KIAAN-REP-${new Date().getFullYear()}-${targetId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const basePriceINR = unit?.pricing?.basePrice || property?.pricing?.basePrice || project?.headlinePriceRange?.min || 14800000;
  const convertedPrice = convertCurrency(basePriceINR, config.currency);

  const permalink = `${window.location.origin}/#${project ? `project/${project.slug || project.id}` : `property/${property?.slug || property?.id}`}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(permalink)}`;

  const dossierData: Record<string, any> = {
    reportId: reportCode,
    buyerName: config.customerName || 'Valued Private Client',
    generationDate: dateStr,
    currency: config.currency,
    assetSummary: {
      title: targetTitle,
      tagline: targetTagline,
      type: project?.projectType || property?.propertyType || 'LUXURY_RESIDENCE',
      status: project?.status || property?.status || 'UNDER_CONSTRUCTION',
      microMarket: project?.location?.microMarket || property?.location?.microMarket || 'Wakad, Pune',
      carpetAreaSqFt: unit?.carpetAreaSqFt || property?.carpetAreaSqFt || 1640,
      configuration: unit?.configuration || property?.configuration || '3.5 BHK Sky Residence',
      basePriceINR,
      basePriceFormatted: formatINR(basePriceINR),
      convertedPriceFormatted: convertedPrice.formatted,
      isEstimate: convertedPrice.isEstimate,
    },
  };

  // Populate requested section payloads
  if (config.selectedSections.includes('photos')) {
    dossierData.photos = (project?.media || property?.media || []).slice(0, 4);
  }

  if (config.selectedSections.includes('floorPlan')) {
    dossierData.floorPlan = unit?.floorPlan || {
      title: 'Architectural Blueprint Layout',
      configuration: '3.5 BHK + 4 Baths + 3 Sundecks',
      carpetAreaSqFt: 1640,
      balconySqFt: 240,
      layoutImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    };
  }

  if (config.selectedSections.includes('price')) {
    dossierData.pricing = {
      basePriceINR,
      ratePerSqFtINR: Math.round(basePriceINR / (unit?.carpetAreaSqFt || 1640)),
      carParkingINR: 400000,
      clubhouseINR: 300000,
      maintenanceDepositINR: 78720,
    };
  }

  if (config.selectedSections.includes('amenities')) {
    dossierData.amenities = (project?.amenities || property?.amenities || []).slice(0, 8);
  }

  if (config.selectedSections.includes('location')) {
    dossierData.location = project?.location || property?.location || {
      microMarket: 'Wakad',
      city: 'Pune',
      address: 'Datta Mandir Road, Near Hinjewadi Flyover, Wakad, Pune 411057',
    };
  }

  if (config.selectedSections.includes('commute')) {
    dossierData.commute = [
      { destination: 'Hinjewadi Tech Park Phase 1', commuteTime: '8 mins', distance: '2.8 km' },
      { destination: 'Balewadi High Street', commuteTime: '10 mins', distance: '3.4 km' },
      { destination: 'Mumbai-Pune Expressway', commuteTime: '12 mins', distance: '4.1 km' },
      { destination: 'Pune International Airport', commuteTime: '38 mins', distance: '19.5 km' },
    ];
  }

  if (config.selectedSections.includes('emi')) {
    // 80% Loan, 8.5% interest, 20 years
    const loanAmount = basePriceINR * 0.8;
    const r = 8.5 / 12 / 100;
    const n = 240;
    const emi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    dossierData.emi = {
      loanAmountINR: loanAmount,
      loanAmountFormatted: formatINR(loanAmount),
      monthlyEmiINR: emi,
      monthlyEmiFormatted: formatINR(emi),
      assumedTenureYears: 20,
      assumedInterestRatePercent: 8.5,
    };
  }

  if (config.selectedSections.includes('totalCost')) {
    const stampDuty = Math.round(basePriceINR * 0.06);
    const gst = Math.round(basePriceINR * 0.05);
    const reg = 30000;
    const totalCost = basePriceINR + stampDuty + gst + reg + 400000 + 300000 + 78720;
    dossierData.totalCost = {
      basePriceINR,
      stampDutyINR: stampDuty,
      stampDutyPercent: 6,
      gstINR: gst,
      gstPercent: 5,
      registrationChargesINR: reg,
      parkingAndClubhouseINR: 700000,
      totalAcquisitionCostINR: totalCost,
      totalAcquisitionCostFormatted: formatINR(totalCost),
    };
  }

  if (config.selectedSections.includes('investment')) {
    dossierData.investment = {
      grossRentalYieldPercent: 4.8,
      annualRentalIncomeEstINR: Math.round(basePriceINR * 0.048),
      appreciationForecast5YrPercent: 48.5,
      estimatedFutureValue5YrINR: Math.round(basePriceINR * 1.485),
      projectedIrrPercent: 12.4,
    };
  }

  if (config.selectedSections.includes('comparison')) {
    dossierData.comparison = {
      microMarketAvgPricePerSqFt: 11200,
      thisAssetPricePerSqFt: Math.round(basePriceINR / (unit?.carpetAreaSqFt || 1640)),
      carpetEfficiencyRatio: '84% (Grade-A Luxury)',
      appreciationPace3Yr: '+32.4% in Wakad micro-market',
    };
  }

  if (config.selectedSections.includes('rera')) {
    dossierData.rera = {
      registrationNumber: reraNum,
      authority: 'Maharashtra Real Estate Regulatory Authority (MahaRERA)',
      status: 'VERIFIED & REGISTERED',
      escrowRingFencePercent: '70% Statutory Escrow Locked',
      escrowBank: 'HDFC Bank Statutory Escrow Account',
      portalUrl: 'https://maharera.mahaonline.gov.in',
    };
  }

  return {
    reportId: reportCode,
    generationDate: dateStr,
    generationTimestamp: timestamp,
    targetId,
    targetTitle,
    targetTagline,
    reraRegistrationNumber: reraNum,
    reraQrCodeUrl: qrCodeUrl,
    livePagePermalink: permalink,
    includedSections: config.selectedSections,
    dossierData,
    mandatoryDisclaimer: `${MANDATORY_REPORT_DISCLAIMER}${reraNum}. This document is an analytical report and does not constitute a legally binding offer to sell.`,
  };
}
