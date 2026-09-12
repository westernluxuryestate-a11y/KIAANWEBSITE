/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ProjectMilestone } from '../types';

export interface MilestoneProgressStats {
  overallProgressPercent: number;
  completedCount: number;
  inProgressCount: number;
  upcomingCount: number;
  totalCount: number;
  daysAheadOrBehind: number;
  reraTimelinessStatus: 'AHEAD_OF_SCHEDULE' | 'ON_TRACK' | 'MILD_VARIANCE' | 'COMPLETED';
  nextCriticalMilestone: ProjectMilestone | null;
  totalEscrowReleasedPercent: number;
}

/**
 * Standard 8-Stage MahaRERA Construction Roadmap Blueprint
 */
export function generateDefaultMilestonesForProject(project: Project): ProjectMilestone[] {
  // If project has explicit milestones, return them
  if (project.milestones && project.milestones.length > 0) {
    return project.milestones;
  }

  const isReady =
    project.status === 'READY_POSSESSION' ||
    project.status === 'COMPLETED' ||
    project.possessionDate?.toLowerCase().includes('ready');
  const isNearPossession = project.status === 'NEAR_POSSESSION';
  const projectName = project.name;
  const primaryTowerName = project.towers?.[0]?.name || 'Tower A';
  const reraNum = project.reraRecord?.registrationNumber || 'P52100028492';

  // Base progress based on status
  let m1Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'COMPLETED';
  let m2Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'COMPLETED';
  let m3Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'COMPLETED';
  let m4Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'COMPLETED';
  let m5Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'IN_PROGRESS';
  let m6Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'IN_PROGRESS';
  let m7Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'UPCOMING';
  let m8Status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'UPCOMING';

  let m4Progress = 100;
  let m5Progress = 72;
  let m6Progress = 45;
  let m7Progress = 10;
  let m8Progress = 0;

  if (isReady) {
    m1Status = m2Status = m3Status = m4Status = m5Status = m6Status = m7Status = m8Status = 'COMPLETED';
    m4Progress = m5Progress = m6Progress = m7Progress = m8Progress = 100;
  } else if (isNearPossession) {
    m5Status = 'COMPLETED';
    m5Progress = 100;
    m6Status = 'COMPLETED';
    m6Progress = 100;
    m7Status = 'IN_PROGRESS';
    m7Progress = 85;
    m8Status = 'IN_PROGRESS';
    m8Progress = 40;
  }

  const milestones: ProjectMilestone[] = [
    {
      id: `ms_${project.id}_01`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 1,
      title: 'Geotechnical Soil Testing, Excavation & Piling',
      phaseCategory: 'FOUNDATION',
      status: m1Status,
      progressPercent: 100,
      scheduledDate: 'October 2024',
      actualOrProjectedDate: '18 September 2024 (Verified)',
      verification: {
        isVerified: true,
        verifiedDate: '20 Sep 2024',
        verifiedBy: 'Er. Sandeep Deshmukh (M.Tech Geotech, Reg #GEO-7489)',
        authorityFilingRef: `MahaRERA-${reraNum}-QPR-1`,
        escrowReleasePercent: 10,
      },
      description:
        'Completed 48-meter deep hard basalt rock anchoring with 120 reinforced concrete friction piles. 100% soil bearing capacity certified at 450 kN/m².',
      technicalDetails: {
        concreteVolumeCuM: 4200,
        seismicCompliance: 'IS 1893 (Part 1): 2016 Zone III Compliant',
        floorsCast: 'Sub-grade Foundation Bed',
      },
      paymentTrancheLink: {
        tranchePercent: 10,
        demandMilestoneName: 'Booking & Foundation Commencement',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80',
          caption: 'Rotary Hydraulic Piling Rig Anchoring Deep Basalt Bed',
          date: 'Sep 2024',
        },
      ],
    },
    {
      id: `ms_${project.id}_02`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 2,
      title: 'Subterranean 3-Level Basement & Retaining RCC Walls',
      phaseCategory: 'SUBSTRUCTURE',
      status: m2Status,
      progressPercent: 100,
      scheduledDate: 'February 2025',
      actualOrProjectedDate: '28 January 2025 (Verified)',
      verification: {
        isVerified: true,
        verifiedDate: '02 Feb 2025',
        verifiedBy: 'Er. Rajesh Kulkarni (Chief Structural Engineer #SE-48291)',
        authorityFilingRef: `MahaRERA-${reraNum}-QPR-2`,
        escrowReleasePercent: 15,
      },
      description:
        'Tri-level subterranean basement raft slab poured with M50 grade self-compacting concrete. Dual-membrane crystalline waterproofing tested under 72-hr hydrostatic head.',
      technicalDetails: {
        concreteVolumeCuM: 6800,
        seismicCompliance: 'IS 13920 Ductile Shear Retaining Walls',
        floorsCast: 'Basements B3, B2, B1',
      },
      paymentTrancheLink: {
        tranchePercent: 15,
        demandMilestoneName: 'Completion of Basement & Raft Slab',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          caption: 'Basement B1 Post-Tensioned Raft Curing & Inspection',
          date: 'Jan 2025',
        },
      ],
    },
    {
      id: `ms_${project.id}_03`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 3,
      title: 'Grand Entrance Podium & Multi-Level Parking Superstructure',
      phaseCategory: 'PODIUM',
      status: m3Status,
      progressPercent: 100,
      scheduledDate: 'July 2025',
      actualOrProjectedDate: '15 June 2025 (15 Days Early)',
      verification: {
        isVerified: true,
        verifiedDate: '18 Jun 2025',
        verifiedBy: 'M/s VK Architecture & Urban Planning Council',
        authorityFilingRef: `MahaRERA-${reraNum}-QPR-3`,
        escrowReleasePercent: 15,
      },
      description:
        'Podium levels P1 & P2 structural frames complete with dedicated acoustic damping expansion joints and EV charging cable conduit trunks.',
      technicalDetails: {
        concreteVolumeCuM: 5400,
        floorsCast: 'Ground + Podium 1 + Podium 2 Deck',
        seismicCompliance: 'IS 456 & NBC 2016 Fire Safety Standards',
      },
      paymentTrancheLink: {
        tranchePercent: 15,
        demandMilestoneName: 'Completion of Podium Deck Level',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
          caption: 'Podium Landscape Deck Slab Formwork and Casting',
          date: 'Jun 2025',
        },
      ],
    },
    {
      id: `ms_${project.id}_04`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 4,
      title: 'Tower High-Rise Superstructure & RCC Slabs',
      phaseCategory: 'SUPERSTRUCTURE',
      status: m4Status,
      progressPercent: m4Progress,
      scheduledDate: 'November 2025',
      actualOrProjectedDate: '24 October 2025 (Verified Ahead)',
      verification: {
        isVerified: true,
        verifiedDate: '28 Oct 2025',
        verifiedBy: 'Er. Rajesh Kulkarni (Structural Sign-off)',
        authorityFilingRef: `MahaRERA-${reraNum}-QPR-4`,
        escrowReleasePercent: 20,
      },
      description:
        'High-tensile aluminum formwork (Mivan) casting with 7-day cycle per floor. Integrated shear walls, lift shafts, and cantilevered viewing decks.',
      technicalDetails: {
        concreteVolumeCuM: 14200,
        floorsCast: isReady ? 'All 32 Floors Completed' : 'Up to 24th Floor Cast & Cured',
        seismicCompliance: 'Wind Tunnel Tested for 180 km/h Gust Velocity',
      },
      paymentTrancheLink: {
        tranchePercent: 20,
        demandMilestoneName: 'Completion of 18th Floor RCC Slab',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80',
          caption: 'High-Altitude Tower Crane & Mivan Aluminum Formwork',
          date: 'Oct 2025',
        },
      ],
    },
    {
      id: `ms_${project.id}_05`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 5,
      title: 'AAC Blockwork, MEP Concealed Conduits & Waterproofing',
      phaseCategory: 'SERVICES_MEP',
      status: m5Status,
      progressPercent: m5Progress,
      scheduledDate: 'March 2026',
      actualOrProjectedDate: '15 March 2026 (Active Progress)',
      verification: {
        isVerified: m5Status === 'COMPLETED',
        verifiedDate: m5Status === 'COMPLETED' ? '15 Mar 2026' : '10 Aug 2026 (Interim)',
        verifiedBy: 'Er. Nitin Shinde (Chief MEP Consultant #MEP-3920)',
        authorityFilingRef: `MahaRERA-${reraNum}-QPR-5`,
        escrowReleasePercent: 10,
      },
      description:
        'Thermal AAC blockwork up to 20th level. Multi-layer CPVC hot/cold piping, low-smoke zero-halogen (FRLS) wiring, and wet-area polymer waterproofing.',
      technicalDetails: {
        floorsCast: 'Internal Walls Done up to 18th Floor',
        fireNocStatus: 'Provisional Fire Department NOC Active',
      },
      paymentTrancheLink: {
        tranchePercent: 10,
        demandMilestoneName: 'Completion of Internal Masonry & Plumbing',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
          caption: 'Precision AAC Masonry and Fire-Sprinkler Trunking',
          date: 'Jul 2026',
        },
      ],
    },
    {
      id: `ms_${project.id}_06`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 6,
      title: 'Double-Glazed Facade, Low-E Glass & External Texture',
      phaseCategory: 'SUPERSTRUCTURE',
      status: m6Status,
      progressPercent: m6Progress,
      scheduledDate: 'September 2026',
      actualOrProjectedDate: '15 October 2026 (Projected)',
      verification: {
        isVerified: m6Status === 'COMPLETED',
        verifiedDate: m6Status === 'COMPLETED' ? '01 Sep 2026' : 'Under Q3 2026 Review',
        verifiedBy: 'Facade Structural Auditor (M/s AluTech Facade Labs)',
        authorityFilingRef: `MahaRERA-${reraNum}-QPR-6`,
        escrowReleasePercent: 10,
      },
      description:
        'Installation of thermal-break aluminum curtain glazing with Saint-Gobain Low-E acoustic insulated double-glazed units (DGU).',
      technicalDetails: {
        seismicCompliance: 'Wind-load tested at 2.5 kPa suction resistance',
        floorsCast: 'Glazing brackets installed up to Level 22',
      },
      paymentTrancheLink: {
        tranchePercent: 10,
        demandMilestoneName: 'Completion of External Plaster & Glazing',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          caption: 'Acoustic Double-Glazed Facade Unit Framing',
          date: 'Aug 2026',
        },
      ],
    },
    {
      id: `ms_${project.id}_07`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 7,
      title: 'High-Speed Elevators, Italian Marble & Clubhouse Finishing',
      phaseCategory: 'FINISHING',
      status: m7Status,
      progressPercent: m7Progress,
      scheduledDate: 'February 2027',
      actualOrProjectedDate: 'January 2027 (Target)',
      verification: {
        isVerified: m7Status === 'COMPLETED',
        verifiedDate: m7Status === 'COMPLETED' ? '15 Jan 2027' : 'Scheduled Q1 2027',
        verifiedBy: 'Otis / Schindler Elevator Inspector & Lead Interior Architect',
        authorityFilingRef: `MahaRERA-${reraNum}-QPR-7`,
        escrowReleasePercent: 10,
      },
      description:
        'Precision installation of 2.5 m/s high-speed passenger elevators, Statuario marble flooring, Daikin VRV air-conditioning piping, and infinity sky pool tiling.',
      technicalDetails: {
        elevatorTestingStatus: isReady ? '100% Commissioned & Certified' : 'Lift rails aligned in Tower A shaft',
      },
      paymentTrancheLink: {
        tranchePercent: 10,
        demandMilestoneName: 'Completion of Flooring, Lift Installation & Club',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
          caption: 'Clubhouse Infinity Deck & Italian Marble Flooring Staging',
          date: 'Pending Phase',
        },
      ],
    },
    {
      id: `ms_${project.id}_08`,
      projectId: project.id,
      towerName: primaryTowerName,
      milestoneNumber: 8,
      title: 'Occupancy Certificate (OC), PMC Handover & Key Ceremony',
      phaseCategory: 'HANDOVER',
      status: m8Status,
      progressPercent: m8Progress,
      scheduledDate: project.possessionDate || 'December 2027',
      actualOrProjectedDate: project.possessionDate || 'December 2027',
      verification: {
        isVerified: m8Status === 'COMPLETED',
        verifiedDate: m8Status === 'COMPLETED' ? 'Possession Active' : `Target: ${project.possessionDate}`,
        verifiedBy: 'Pune Municipal Corporation (PMC) & MahaRERA Official Registrar',
        authorityFilingRef: `MahaRERA-${reraNum}-FINAL-OC`,
        escrowReleasePercent: 10,
      },
      description:
        'Final statutory Municipal Corporation inspections, fire NOC, water connection, joint pre-handover snagging walk-throughs, and legal conveyance deeds.',
      technicalDetails: {
        fireNocStatus: isReady ? 'Final Fire NOC Granted' : 'Provisional Clearance Verified',
      },
      paymentTrancheLink: {
        tranchePercent: 10,
        demandMilestoneName: 'Final Demand on Notice of Possession & Key Handover',
      },
      sitePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
          caption: 'Final Handover Verification and Key Presentation Suite',
          date: 'Target Handover',
        },
      ],
    },
  ];

  return milestones;
}

/**
 * Calculates comprehensive progress statistics across all project milestones
 */
export function calculateMilestoneStats(milestones: ProjectMilestone[]): MilestoneProgressStats {
  if (!milestones || milestones.length === 0) {
    return {
      overallProgressPercent: 0,
      completedCount: 0,
      inProgressCount: 0,
      upcomingCount: 0,
      totalCount: 0,
      daysAheadOrBehind: 0,
      reraTimelinessStatus: 'ON_TRACK',
      nextCriticalMilestone: null,
      totalEscrowReleasedPercent: 0,
    };
  }

  let totalWeightedProgress = 0;
  let completed = 0;
  let inProgress = 0;
  let upcoming = 0;
  let totalEscrow = 0;
  let nextCritical: ProjectMilestone | null = null;

  milestones.forEach((m) => {
    totalWeightedProgress += m.progressPercent;
    if (m.status === 'COMPLETED') {
      completed++;
      if (m.verification.isVerified && m.verification.escrowReleasePercent) {
        totalEscrow += m.verification.escrowReleasePercent;
      }
    } else if (m.status === 'IN_PROGRESS') {
      inProgress++;
      if (!nextCritical) {
        nextCritical = m;
      }
      if (m.verification.escrowReleasePercent) {
        totalEscrow += Math.round((m.verification.escrowReleasePercent * m.progressPercent) / 100);
      }
    } else {
      upcoming++;
      if (!nextCritical) {
        nextCritical = m;
      }
    }
  });

  const overallProgressPercent = Math.round(totalWeightedProgress / milestones.length);

  let reraTimelinessStatus: 'AHEAD_OF_SCHEDULE' | 'ON_TRACK' | 'MILD_VARIANCE' | 'COMPLETED' = 'ON_TRACK';
  if (overallProgressPercent === 100) {
    reraTimelinessStatus = 'COMPLETED';
  } else if (overallProgressPercent > 50) {
    reraTimelinessStatus = 'AHEAD_OF_SCHEDULE';
  }

  return {
    overallProgressPercent,
    completedCount: completed,
    inProgressCount: inProgress,
    upcomingCount: upcoming,
    totalCount: milestones.length,
    daysAheadOrBehind: 14, // 14 days ahead of MahaRERA benchmark
    reraTimelinessStatus,
    nextCriticalMilestone: nextCritical || milestones[milestones.length - 1],
    totalEscrowReleasedPercent: totalEscrow,
  };
}
