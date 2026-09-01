/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoomLayoutPolygon, SunlightStudyResult, Unit, UnitComparisonDiff, Project } from '../types';

/**
 * Solar Orientation & Sunlight Simulation Engine
 * Calibrated for Pune / Mumbai latitude (approx 18.59° N, 73.76° E)
 */
export function calculateSunlightOrientation(params: {
  timeOfDayHour: number; // e.g. 6.0 (6am) to 18.0 (6pm)
  facing: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | 'NORTH_EAST' | 'SOUTH_EAST' | 'NORTH_WEST' | 'SOUTH_WEST' | string;
  rooms?: RoomLayoutPolygon[];
}): SunlightStudyResult {
  const { timeOfDayHour, facing, rooms = [] } = params;

  // Clamp time between 6.0 and 18.0
  const clampedTime = Math.max(6, Math.min(18, timeOfDayHour));

  // Time formatting (e.g. 8.5 -> "08:30 AM", 16.25 -> "04:15 PM")
  const hours = Math.floor(clampedTime);
  const minutes = Math.round((clampedTime - hours) * 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const timeFormatted = `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;

  // Solar Azimuth (Degrees from True North, 0° = North, 90° = East, 180° = South, 270° = West)
  // At 6am: ~85° (East-North-East), at 12pm: ~178° (South), at 6pm: ~275° (West-North-West)
  const normalizedDayFraction = (clampedTime - 6) / 12; // 0 to 1
  const sunAzimuthDegrees = Math.round(85 + normalizedDayFraction * 190);

  // Solar Altitude (Degrees above horizon, 0° at sunrise/sunset, max ~78° at solar noon)
  // Modeled with a smooth sine arc
  const sunAltitudeDegrees = Math.max(0, Math.round(Math.sin(normalizedDayFraction * Math.PI) * 78));

  // Shadow physics
  const shadowAngleDegrees = (sunAzimuthDegrees + 180) % 360;
  const radAltitude = (Math.max(5, sunAltitudeDegrees) * Math.PI) / 180;
  const shadowLengthMultiplier = Number((1 / Math.tan(radAltitude)).toFixed(2));

  // Cardinal facing angles (Normal vector to facade)
  const facingAzimuthMap: Record<string, number> = {
    NORTH: 0,
    NORTH_EAST: 45,
    EAST: 90,
    SOUTH_EAST: 135,
    SOUTH: 180,
    SOUTH_WEST: 225,
    WEST: 270,
    NORTH_WEST: 315,
  };

  const facadeAzimuth = facingAzimuthMap[facing.toUpperCase()] ?? 90;

  // Angle of incidence between sun azimuth and facade normal
  let angleDiff = Math.abs(sunAzimuthDegrees - facadeAzimuth);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;

  // Facade receives direct sunlight if angleDiff < 85 degrees and altitude > 0
  const isDirectSunlight = angleDiff < 85 && sunAltitudeDegrees > 2;
  const facingIlluminationPercent = isDirectSunlight
    ? Math.round(Math.cos((angleDiff * Math.PI) / 180) * 100)
    : Math.max(10, Math.round(25 - (angleDiff / 180) * 15)); // Ambient diffused light

  // Heat Index & Thermal Score
  let solarHeatIndex: SunlightStudyResult['solarHeatIndex'] = 'LOW';
  let thermalComfortScorePercent = 95;

  if (clampedTime >= 12 && clampedTime <= 15.5) {
    if (facing.includes('WEST') || facing.includes('SOUTH')) {
      solarHeatIndex = 'INTENSE';
      thermalComfortScorePercent = 74;
    } else {
      solarHeatIndex = 'WARM';
      thermalComfortScorePercent = 86;
    }
  } else if (clampedTime >= 8 && clampedTime <= 11.5) {
    solarHeatIndex = 'OPTIMAL';
    thermalComfortScorePercent = 98; // Pleasant morning sun
  } else if (clampedTime > 15.5) {
    solarHeatIndex = facing.includes('WEST') ? 'WARM' : 'LOW';
    thermalComfortScorePercent = 92;
  }

  // Room level illumination
  const directSunlightRooms: string[] = [];
  const ambientLightRooms: string[] = [];

  const defaultRoomNames = ['Living & Dining Salon', 'Master Bedroom Suite', 'Wrap-around Balcony Deck', 'Kitchen & Utility', 'Guest Bedroom / Den'];
  const roomList = rooms.length > 0 ? rooms.map((r) => r.roomName) : defaultRoomNames;

  roomList.forEach((roomName) => {
    const isBalcony = roomName.toLowerCase().includes('balcony') || roomName.toLowerCase().includes('deck');
    const isMaster = roomName.toLowerCase().includes('master');
    const isLiving = roomName.toLowerCase().includes('living') || roomName.toLowerCase().includes('salon');

    if (isDirectSunlight) {
      if (isBalcony || isLiving) {
        directSunlightRooms.push(roomName);
      } else if (isMaster && facingIlluminationPercent > 50) {
        directSunlightRooms.push(roomName);
      } else {
        ambientLightRooms.push(roomName);
      }
    } else {
      ambientLightRooms.push(roomName);
    }
  });

  // Natural Light Summary
  let naturalLightSummary = '';
  if (facing.includes('EAST') && clampedTime <= 11.5) {
    naturalLightSummary = `Optimal morning light flooding master balcony and living room with gentle ${sunAltitudeDegrees}° sun rays. Zero harsh western heat.`;
  } else if (facing.includes('WEST') && clampedTime >= 14.5) {
    naturalLightSummary = `Golden hour sunset rays across living terrace. High thermal insulation glass active.`;
  } else if (facing.includes('NORTH')) {
    naturalLightSummary = `Soft, glare-free indirect north light throughout the day. Ideal for art and home office workspaces.`;
  } else {
    naturalLightSummary = `Balanced ambient illumination with ${facingIlluminationPercent}% direct exposure at ${timeFormatted}.`;
  }

  return {
    timeOfDayHour: clampedTime,
    timeFormatted,
    sunAzimuthDegrees,
    sunAltitudeDegrees,
    shadowAngleDegrees,
    shadowLengthMultiplier,
    solarHeatIndex,
    thermalComfortScorePercent,
    directSunlightRooms,
    ambientLightRooms,
    facingIlluminationPercent,
    naturalLightSummary,
  };
}

/**
 * Side-by-Side Unit & Project Comparison Analytics
 */
export function diffUnitsForComparison(units: Unit[]): UnitComparisonDiff {
  if (!units || units.length === 0) {
    return {
      units: [],
      priceDiffINR: 0,
      carpetAreaDiffSqFt: 0,
      pricePerSqFtDiff: 0,
      taxDifferenceINR: 0,
      commonAmenities: [],
      exclusiveAmenitiesPerUnit: {},
      facingSummary: {},
      propertyScoreDeltas: {},
    };
  }

  const u1 = units[0];
  const u2 = units[1] || u1;

  const priceDiffINR = Math.abs(u1.pricing.basePrice - u2.pricing.basePrice);
  const carpetAreaDiffSqFt = Math.abs(u1.carpetAreaSqFt - u2.carpetAreaSqFt);
  const pricePerSqFtDiff = Math.abs(u1.pricing.pricePerSqFt - u2.pricing.pricePerSqFt);
  const taxDifferenceINR = Math.abs(
    u1.pricing.totalEstimatedAcquisitionCost - u1.pricing.basePrice -
    (u2.pricing.totalEstimatedAcquisitionCost - u2.pricing.basePrice)
  );

  const facingSummary: Record<string, string> = {};
  units.forEach((u) => {
    facingSummary[u.id] = `${u.facing} Facing — ${u.orientationView}`;
  });

  return {
    units,
    priceDiffINR,
    carpetAreaDiffSqFt,
    pricePerSqFtDiff,
    taxDifferenceINR,
    commonAmenities: ['Infinity Edge Pool', 'Clubhouse', 'EV Charging', 'Biometric Security'],
    exclusiveAmenitiesPerUnit: {},
    facingSummary,
    propertyScoreDeltas: {},
  };
}

/**
 * Floor Rise Elevation & Vista Quality Index
 */
export function calculateElevationMetrics(floorNumber: number, totalFloors = 32) {
  const normalizedHeight = Math.min(1, Math.max(0, floorNumber / totalFloors));

  let viewCategory: 'GROUND_GARDEN' | 'PODIUM_GREEN' | 'MID_CITY' | 'HIGH_SKYLINE' | 'PENTHOUSE_HORIZON' = 'GROUND_GARDEN';
  let viewScorePercent = 70;
  let acousticIsolationPercent = 75;
  let naturalBreezeScore = 65;

  if (floorNumber <= 4) {
    viewCategory = 'PODIUM_GREEN';
    viewScorePercent = 78;
    acousticIsolationPercent = 72;
    naturalBreezeScore = 68;
  } else if (floorNumber <= 14) {
    viewCategory = 'MID_CITY';
    viewScorePercent = 88;
    acousticIsolationPercent = 85;
    naturalBreezeScore = 82;
  } else if (floorNumber <= 26) {
    viewCategory = 'HIGH_SKYLINE';
    viewScorePercent = 96;
    acousticIsolationPercent = 94;
    naturalBreezeScore = 95;
  } else {
    viewCategory = 'PENTHOUSE_HORIZON';
    viewScorePercent = 99;
    acousticIsolationPercent = 98;
    naturalBreezeScore = 99;
  }

  const elevationMeters = Math.round(floorNumber * 3.35); // 3.35m per floor
  const floorRiseChargeTotal = floorNumber * 25000;

  return {
    floorNumber,
    elevationMeters,
    viewCategory,
    viewScorePercent,
    acousticIsolationPercent,
    naturalBreezeScore,
    floorRiseChargeTotal,
  };
}

/**
 * Default Interactive SVG Room Polygons for 3 BHK Grande and 3.5 BHK Suites
 */
export function getStandardRoomPolygons(config: string): RoomLayoutPolygon[] {
  if (config.includes('3.5') || config.includes('Suite')) {
    return [
      {
        roomId: 'room_living',
        roomName: 'Grand Living Salon & Dining',
        category: 'LIVING',
        polygonPoints: '40,40 380,40 380,240 40,240',
        centerPoint: { x: 210, y: 140 },
        widthFt: 18.0,
        lengthFt: 29.0,
        carpetSqFt: 522,
        windowFacing: 'EAST',
        ceilingHeightFt: 11.0,
        features: ['Italian Statuario Marble', 'Panoramic Low-E Glazing', 'Motorized Drapes'],
      },
      {
        roomId: 'room_balcony',
        roomName: 'Teakwood Sunset Deck',
        category: 'BALCONY',
        polygonPoints: '380,40 500,40 500,240 380,240',
        centerPoint: { x: 440, y: 140 },
        widthFt: 7.5,
        lengthFt: 29.0,
        carpetSqFt: 217,
        windowFacing: 'EAST',
        ceilingHeightFt: 11.0,
        features: ['Weatherproof Burma Teak', 'Frameless Glass Balustrade', 'Planter Box'],
      },
      {
        roomId: 'room_master',
        roomName: 'Presidential Master Suite',
        category: 'MASTER_BED',
        polygonPoints: '40,260 260,260 260,480 40,480',
        centerPoint: { x: 150, y: 370 },
        widthFt: 14.5,
        lengthFt: 19.0,
        carpetSqFt: 275,
        windowFacing: 'NORTH_EAST',
        ceilingHeightFt: 11.0,
        features: ['Herringbone Oak Flooring', 'Walk-in Dresser Gallery', 'Private Coffee Balcony'],
      },
      {
        roomId: 'room_bed2',
        roomName: 'Junior Suite / Bed 2',
        category: 'BEDROOM',
        polygonPoints: '280,260 440,260 440,480 280,480',
        centerPoint: { x: 360, y: 370 },
        widthFt: 13.0,
        lengthFt: 16.0,
        carpetSqFt: 208,
        windowFacing: 'NORTH',
        ceilingHeightFt: 11.0,
        features: ['En-suite Bath', 'Acoustic Wall Paneling'],
      },
      {
        roomId: 'room_kitchen',
        roomName: 'Gourmet Chef Kitchen',
        category: 'KITCHEN',
        polygonPoints: '460,260 580,260 580,480 460,480',
        centerPoint: { x: 520, y: 370 },
        widthFt: 10.5,
        lengthFt: 14.0,
        carpetSqFt: 147,
        windowFacing: 'WEST',
        ceilingHeightFt: 11.0,
        features: ['Poggenpohl Cabinetry', 'Miele Island Hob', 'Separate Wet Utility'],
      },
    ];
  }

  // Standard 3 BHK Grande
  return [
    {
      roomId: 'room_living_3bhk',
      roomName: 'Living & Dining Hall',
      category: 'LIVING',
      polygonPoints: '40,40 340,40 340,220 40,220',
      centerPoint: { x: 190, y: 130 },
      widthFt: 15.5,
      lengthFt: 26.0,
      carpetSqFt: 403,
      windowFacing: 'EAST',
      ceilingHeightFt: 11.0,
      features: ['Imported Marble', 'Double-height feeling', 'KNX Automation'],
    },
    {
      roomId: 'room_balcony_3bhk',
      roomName: 'Wrap-around Sky Balcony',
      category: 'BALCONY',
      polygonPoints: '340,40 460,40 460,220 340,220',
      centerPoint: { x: 400, y: 130 },
      widthFt: 6.5,
      lengthFt: 22.0,
      carpetSqFt: 143,
      windowFacing: 'EAST',
      ceilingHeightFt: 11.0,
      features: ['Unobstructed Skyline View', 'All-weather power socket'],
    },
    {
      roomId: 'room_master_3bhk',
      roomName: 'Master Bedroom',
      category: 'MASTER_BED',
      polygonPoints: '40,240 240,240 240,440 40,440',
      centerPoint: { x: 140, y: 340 },
      widthFt: 13.0,
      lengthFt: 17.5,
      carpetSqFt: 227,
      windowFacing: 'EAST',
      ceilingHeightFt: 11.0,
      features: ['Hardwood finish', 'Lutron dimmer switches'],
    },
    {
      roomId: 'room_bed2_3bhk',
      roomName: 'Children / Guest Suite',
      category: 'BEDROOM',
      polygonPoints: '260,240 420,240 420,440 260,440',
      centerPoint: { x: 340, y: 340 },
      widthFt: 12.0,
      lengthFt: 14.5,
      carpetSqFt: 174,
      windowFacing: 'NORTH',
      ceilingHeightFt: 11.0,
      features: ['Wide corner window', 'Study alcove'],
    },
    {
      roomId: 'room_kitchen_3bhk',
      roomName: 'Modular Kitchen & Utility',
      category: 'KITCHEN',
      polygonPoints: '440,240 560,240 560,440 440,440',
      centerPoint: { x: 500, y: 340 },
      widthFt: 9.5,
      lengthFt: 13.0,
      carpetSqFt: 123,
      windowFacing: 'WEST',
      ceilingHeightFt: 11.0,
      features: ['Granite countertop', 'Exhaust ducting', 'Utility dry balcony'],
    },
  ];
}
