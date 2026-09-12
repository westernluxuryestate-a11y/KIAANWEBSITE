/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Building,
  Layers,
  Save,
  Trash2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Plus,
  Image,
  MapPin,
  FileCheck,
  IndianRupee,
  Check,
  Lock,
  Eye,
  Sliders,
  Maximize2,
  Upload,
  QrCode,
  Ruler,
  ExternalLink,
  FileText,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import {
  Project,
  Property,
  ProjectType,
  PropertyType,
  PropertyStatus,
  ProjectStatus,
  UserSession,
  AssetAuthorInfo,
  Amenity,
} from '../types';
import { globalKiaanStore } from '../services/store';
import { formatINR } from '../services/calculatorEngine';
import { MASTER_AMENITIES } from '../data/seedData';
import { AmenitySelector } from './AmenitySelector';
import { getCleanMahaReraUrl, getScannableQrUrl } from './ReraBadge';
import { ResidentialProjectSchemaWizard } from './ResidentialProjectSchemaWizard';
import { ComprehensiveProjectData } from '../services/projectSchemaService';
import { PROPERTY_CATEGORIES, PropertyCategory } from '../services/universalListingSchemaService';
import { UniversalPropertyListingFormModal } from './UniversalPropertyListingFormModal';
import { PropertyPreLeaseTab } from './property-editor/PropertyPreLeaseTab';
import { PreLeasedState } from './property-editor/propertyEditorTypes';

export type EditorMode =
  | 'CREATE_PROPERTY'
  | 'EDIT_PROPERTY'
  | 'CREATE_PROJECT'
  | 'EDIT_PROJECT';

interface PropertyProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: EditorMode;
  initialProperty?: Property | null;
  initialProject?: Project | null;
  session?: UserSession | null;
  onSuccess?: (entity: Property | Project, action: 'CREATED' | 'UPDATED' | 'DELETED') => void;
  theme?: 'dark' | 'light';
}

const PROPERTY_TYPES: { id: PropertyType; label: string; category: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND' }[] = [
  { id: 'APARTMENT', label: 'Luxury Apartment / Sky Residence', category: 'RESIDENTIAL' },
  { id: 'PENTHOUSE', label: 'Duplex / Triplex Sky Penthouse', category: 'RESIDENTIAL' },
  { id: 'VILLA', label: 'Signature Villa / Independent Mansion', category: 'RESIDENTIAL' },
  { id: 'ROW_HOUSE', label: 'Gated Row House / Townhome', category: 'RESIDENTIAL' },
  { id: 'STUDIO', label: 'Executive Studio / Pied-à-terre', category: 'RESIDENTIAL' },
  { id: 'OFFICE', label: 'Grade-A Commercial Office Floor', category: 'COMMERCIAL' },
  { id: 'RETAIL', label: 'High-Street Retail / Anchor Showroom', category: 'COMMERCIAL' },
  { id: 'SHOWROOM', label: 'Automotive / Luxury Flagship Showroom', category: 'COMMERCIAL' },
  { id: 'WAREHOUSE', label: 'Logistics Hub & Industrial Warehouse', category: 'COMMERCIAL' },
  { id: 'LAND', label: 'Prime Plotted Land / Estate Parcel', category: 'LAND' },
];

const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
  { id: 'RESIDENTIAL', label: 'Ultra-Luxury Residential Tower / Enclave' },
  { id: 'COMMERCIAL', label: 'Institutional Grade-A IT / Commercial Park' },
  { id: 'MIXED_USE', label: 'Integrated Mixed-Use Sky Hub (Retail + Resi + Office)' },
  { id: 'PLOTTED_DEVELOPMENT', label: 'Gated Villa Plots & Plotted Sanctuaries' },
  { id: 'LUXURY_ESTATE', label: 'Bespoke Private Estate & Hilltop Mansions' },
];

export const PropertyProjectEditorModal: React.FC<PropertyProjectEditorModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialProperty,
  initialProject,
  session,
  onSuccess,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const isProperty = mode === 'CREATE_PROPERTY' || mode === 'EDIT_PROPERTY';
  const isEdit = mode === 'EDIT_PROPERTY' || mode === 'EDIT_PROJECT';

  const [activeTab, setActiveTab] = useState<
    'DETAILS' | 'LOCATION_RERA' | 'PRICING' | 'MEDIA_AMENITIES' | 'PRE_LEASE' | 'CREATOR'
  >('DETAILS');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --------------------------------------------------------------------------
  // PROPERTY STATE FORM
  // --------------------------------------------------------------------------
  const [propTitle, setPropTitle] = useState('');
  const [propHeadline, setPropHeadline] = useState('');
  const [propCategory, setPropCategory] = useState<PropertyCategory>('RESIDENTIAL');
  const [propSubType, setPropSubType] = useState<string>('Apartment');
  const [propBedroomsNumeric, setPropBedroomsNumeric] = useState<number | string>(3);
  const [propType, setPropType] = useState<PropertyType>('APARTMENT');
  const [propStatus, setPropStatus] = useState<PropertyStatus>('AVAILABLE');
  const [propConstructionStatus, setPropConstructionStatus] = useState<
    'READY_TO_MOVE' | 'UNDER_CONSTRUCTION' | 'NEW_LAUNCH'
  >('READY_TO_MOVE');
  const [propAgeOfProperty, setPropAgeOfProperty] = useState('0');
  const [propConfig, setPropConfig] = useState('3 BHK');
  const [showUniversalWizard, setShowUniversalWizard] = useState(false);

  // Pre-Leased & Investment State
  const [preLeasedState, setPreLeasedState] = useState<PreLeasedState>({
    isPreLeased: false,
    isPreRented: false,
    hasExistingTenant: false,
    tenantName: '',
    isTenantNamePublic: true,
    tenantType: 'MNC',
    tenantIndustry: '',
    leaseStartDate: '',
    leaseExpiryDate: '',
    remainingLeaseMonths: 36,
    monthlyRentINR: 0,
    annualRentINR: 0,
    escalationClause: '15% every 3 years',
    currentYieldPercent: 8.5,
    expectedYieldPercent: 10.0,
    securityDepositINR: 0,
    lockInMonths: 24,
    renewalProbability: 'HIGH',
    leaseRegistrationStatus: 'REGISTERED',
    rentPaymentHistory: 'FLAWLESS_ON_TIME',
    occupancyStatus: 'FULLY_OCCUPIED',
    investmentValueINR: 0,
    capitalAppreciationPotential: 'HIGH',
    tenantCreditProfile: 'AAA_INVESTMENT_GRADE',
    leaseDocsAvailable: {
      agreement: true,
      cam: true,
      receipts: true,
      bankStatements: true,
    },
  });

  // Land / Plot specific attributes
  const [plotAreaSqFt, setPlotAreaSqFt] = useState<string>('3000');
  const [plotDimensions, setPlotDimensions] = useState<string>('50 x 60 ft');
  const [plotBoundaryWall, setPlotBoundaryWall] = useState<'YES' | 'NO'>('YES');
  const [plotCornerPlot, setPlotCornerPlot] = useState<'YES' | 'NO'>('NO');
  const [plotGatedLayout, setPlotGatedLayout] = useState<'YES' | 'NO'>('YES');
  const [plotRoadWidthFt, setPlotRoadWidthFt] = useState<string>('40');
  const [plotTitleType, setPlotTitleType] = useState<string>('Clear Title / Freehold NA');
  const [propCarpet, setPropCarpet] = useState('2450');
  const [propFloor, setPropFloor] = useState('24');
  const [propTotalFloors, setPropTotalFloors] = useState('32');
  const [propFacing, setPropFacing] = useState('North-East (Vastu Compliant)');
  const [propParking, setPropParking] = useState('3 Reserved Bays');
  const [propCity, setPropCity] = useState('Pune');
  const [propMicroMarket, setPropMicroMarket] = useState('Baner');
  const [propAddress, setPropAddress] = useState('Balewadi High Street Extension, Baner, Pune 411045');
  const [propBasePrice, setPropBasePrice] = useState('32500000'); // ₹3.25 Cr
  const [propPossessionStatus, setPropPossessionStatus] = useState<'READY_POSSESSION' | 'UNDER_CONSTRUCTION' | 'PRE_LAUNCH'>('READY_POSSESSION');
  const [propPossessionDate, setPropPossessionDate] = useState('Immediate / Ready OC');
  const [propReraNumber, setPropReraNumber] = useState('P52100039281');
  const [propDescription, setPropDescription] = useState('Opulent panoramic sky penthouse with private double-height foyer, Italian statuario flooring, and wrap-around viewing decks with unrestricted 360-degree skyline views.');
  const [propImages, setPropImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [propSelectedAmenities, setPropSelectedAmenities] = useState<Amenity[]>(
    MASTER_AMENITIES.slice(0, 4)
  );

  // --------------------------------------------------------------------------
  // PROJECT STATE FORM
  // --------------------------------------------------------------------------
  const [projName, setProjName] = useState('');
  const [projTagline, setProjTagline] = useState('Sculpted Sky Residences Above The Clouds');
  const [projDevName, setProjDevName] = useState('Kiaan Luxury Developments');
  const [projType, setProjType] = useState<ProjectType>('RESIDENTIAL');
  const [projStatus, setProjStatus] = useState<ProjectStatus>('UNDER_CONSTRUCTION');
  const [projCity, setProjCity] = useState('Pune');
  const [projMicroMarket, setProjMicroMarket] = useState('Wakad');
  const [projAddress, setProjAddress] = useState('Survey 48/2, Datta Mandir Road, Wakad, Pune 411057');
  const [projMinPrice, setProjMinPrice] = useState('18500000');
  const [projMaxPrice, setProjMaxPrice] = useState('42000000');
  const [projConfigs, setProjConfigs] = useState('3 BHK Grande, 3.5 BHK Sky Suite, 4 BHK Penthouse');
  const [projMinCarpet, setProjMinCarpet] = useState('1450');
  const [projMaxCarpet, setProjMaxCarpet] = useState('3200');
  const [projLandAcres, setProjLandAcres] = useState('6.2');
  const [projTowers, setProjTowers] = useState('4');
  const [projTotalUnits, setProjTotalUnits] = useState('280');
  const [projAvailableUnits, setProjAvailableUnits] = useState('64');
  const [projPossessionDate, setProjPossessionDate] = useState('December 2027');
  const [projReraNumber, setProjReraNumber] = useState('P52100028492');
  const [projOverview, setProjOverview] = useState('Landmark architectural master township setting new paradigms in luxury residential architecture, featuring biometric sky lounges, 40,000 sq.ft signature clubhouse, and 3-acre bio-reserve.');
  const [projImages, setProjImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [projSelectedAmenities, setProjSelectedAmenities] = useState<Amenity[]>(
    MASTER_AMENITIES.slice(0, 7)
  );

  // Additional Property Specs (Min/Max Carpet, Ceiling Height, Floor Rise, Plan, QR)
  const [propMinCarpet, setPropMinCarpet] = useState('2200');
  const [propMaxCarpet, setPropMaxCarpet] = useState('2700');
  const [propCeilingHeight, setPropCeilingHeight] = useState('11.5');
  const [propFloorRisePerFloor, setPropFloorRisePerFloor] = useState('50');
  const [propFloorPlanUrl, setPropFloorPlanUrl] = useState('');
  const [propQrCodeUrl, setPropQrCodeUrl] = useState('');
  const [propAuthorityUrl, setPropAuthorityUrl] = useState('https://maharera.maharashtra.gov.in/projects-search-result');

  // Additional Project Specs (Banner, Master Plan, Floor Plan, Min/Max Carpet, Ceiling Height, Floor Rise, QR)
  const [projBannerUrl, setProjBannerUrl] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85');
  const [projMasterPlanUrl, setProjMasterPlanUrl] = useState('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
  const [projFloorPlanUrl, setProjFloorPlanUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
  const [projCeilingHeight, setProjCeilingHeight] = useState('11.5');
  const [projTotalFloors, setProjTotalFloors] = useState('32');
  const [projFloorRisePerFloor, setProjFloorRisePerFloor] = useState('50');
  const [projQrCodeUrl, setProjQrCodeUrl] = useState('');
  const [projAuthorityUrl, setProjAuthorityUrl] = useState('https://maharera.maharashtra.gov.in/projects-search-result');
  const [isSyncingBackendQr, setIsSyncingBackendQr] = useState(false);
  const [backendQrStatusMsg, setBackendQrStatusMsg] = useState<string | null>(null);

  // Creator Attribution State
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorPhone, setAuthorPhone] = useState('+91 98230 11000');
  const [newImageUrl, setNewImageUrl] = useState('');

  // 29-Section Master Project Custom Fields Schema State
  const [showMasterSchemaWizard, setShowMasterSchemaWizard] = useState(false);
  const [customSchemaData, setCustomSchemaData] = useState<Partial<ComprehensiveProjectData> | null>(
    (initialProject as any)?.customSchemaData || null
  );

  const handleMasterWizardSave = (comprehensiveData: ComprehensiveProjectData) => {
    setCustomSchemaData(comprehensiveData);
    setProjName(comprehensiveData.projectName);
    setProjDevName(comprehensiveData.developerName);
    setProjStatus(
      comprehensiveData.projectStatus === 'Ready to Move'
        ? 'READY_TO_MOVE'
        : comprehensiveData.projectStatus === 'Completed'
        ? 'COMPLETED'
        : 'UNDER_CONSTRUCTION'
    );
    setProjAddress(comprehensiveData.completeAddress);
    setProjMicroMarket(comprehensiveData.locality);
    setProjCity(comprehensiveData.city);
    setProjReraNumber(comprehensiveData.reraNumber);
    setProjPossessionDate(comprehensiveData.possessionDate);
    setProjTotalUnits(String(comprehensiveData.totalUnits));
    setProjAvailableUnits(String(comprehensiveData.availableUnits));
    setProjLandAcres(String(comprehensiveData.totalLandAreaAcres));
    setProjTowers(String(comprehensiveData.totalTowers));
    setProjTotalFloors(String(comprehensiveData.totalFloors));
    if (comprehensiveData.unitConfigurations.length > 0) {
      setProjConfigs(
        comprehensiveData.unitConfigurations
          .map((c) => `${c.bhkType} (${c.carpetAreaSqFt} sq.ft)`)
          .join(', ')
      );
      setProjMinPrice(
        String(
          comprehensiveData.costSheet?.startingPrice ||
            comprehensiveData.unitConfigurations[0].startingPrice
        )
      );
      setProjMinCarpet(String(comprehensiveData.unitConfigurations[0].carpetAreaSqFt));
    }
    setProjOverview(comprehensiveData.shortSummary);
    if (comprehensiveData.coverImageUrl) setProjBannerUrl(comprehensiveData.coverImageUrl);
    if (comprehensiveData.masterPlanUrl) setProjMasterPlanUrl(comprehensiveData.masterPlanUrl);
    setShowMasterSchemaWizard(false);
    setSuccessMsg('29-Section Master Custom Fields schema synchronized successfully!');
  };

  // Permission Checks
  const [canModify, setCanModify] = useState(true);
  const [creatorBadge, setCreatorBadge] = useState<AssetAuthorInfo | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg('');
    setSuccessMsg('');

    // Prepopulate author details from active session or fallback
    const currentUserName = session?.name || 'Kiaan Sales Leadership';
    const currentUserEmail = session?.email || 'sales@kiaanproperties.in';
    const currentUserPhone = session?.phone || '+91 98230 11000';

    if (isProperty) {
      if (initialProperty && isEdit) {
        setPropTitle(initialProperty.title || '');
        setPropHeadline(initialProperty.headline || '');
        setPropConstructionStatus(
          (initialProperty.constructionStatus as any) ||
          (initialProperty.possessionStatus === 'READY_POSSESSION' ? 'READY_TO_MOVE' : 'UNDER_CONSTRUCTION')
        );
        setPropAgeOfProperty(
          initialProperty.ageOfPropertyYears !== undefined ? String(initialProperty.ageOfPropertyYears) : '0'
        );

        if (initialProperty.preLeasedData) {
          const pld = initialProperty.preLeasedData;
          setPreLeasedState({
            isPreLeased: pld.isPreLeased || (initialProperty as any).transactionType === 'PRE_LEASE' || false,
            isPreRented: pld.isPreRented || (initialProperty as any).transactionType === 'PRE_RENT' || false,
            hasExistingTenant: pld.hasExistingTenant || Boolean(pld.tenantName),
            tenantName: pld.tenantName || '',
            isTenantNamePublic: pld.tenantVisibility !== 'CONFIDENTIAL',
            tenantType: (pld.tenantType as any) || 'MNC',
            tenantIndustry: pld.tenantIndustry || '',
            leaseStartDate: pld.leaseStartDate || '',
            leaseExpiryDate: pld.leaseExpiryDate || '',
            remainingLeaseMonths: (pld.remainingLeasePeriodYears ? pld.remainingLeasePeriodYears * 12 : 36),
            monthlyRentINR: pld.monthlyRentINR || 0,
            annualRentINR: pld.annualRentINR || (pld.monthlyRentINR ? pld.monthlyRentINR * 12 : 0),
            escalationClause: pld.escalationClause || '15% every 3 years',
            currentYieldPercent: pld.currentVerifiedYieldPercent || pld.currentYieldPercent || 8.5,
            expectedYieldPercent: pld.expectedProjectedYieldPercent || pld.expectedYieldPercent || 10.0,
            securityDepositINR: pld.securityDepositINR || 0,
            lockInMonths: (pld.lockInPeriodYears ? pld.lockInPeriodYears * 12 : 24),
            renewalProbability: (pld.renewalProbability as any) || 'HIGH',
            leaseRegistrationStatus: (pld.leaseRegistrationStatus as any) || 'REGISTERED',
            rentPaymentHistory: (pld.rentPaymentHistory as any) || 'FLAWLESS_ON_TIME',
            occupancyStatus: (pld.occupancyStatus as any) || 'FULLY_OCCUPIED',
            investmentValueINR: pld.investmentValueINR || initialProperty.pricing?.agreementValue || 0,
            capitalAppreciationPotential: (pld.capitalAppreciationPotential as any) || 'HIGH',
            tenantCreditProfile: (pld.tenantCreditProfile as any) || 'AAA_INVESTMENT_GRADE',
            leaseDocsAvailable: pld.leaseDocsAvailable || {
              agreement: true,
              cam: true,
              receipts: true,
              bankStatements: true,
            },
          });
        } else {
          setPreLeasedState({
            isPreLeased: false,
            isPreRented: false,
            hasExistingTenant: false,
            tenantName: '',
            isTenantNamePublic: true,
            tenantType: 'MNC',
            tenantIndustry: '',
            leaseStartDate: '',
            leaseExpiryDate: '',
            remainingLeaseMonths: 36,
            monthlyRentINR: 0,
            annualRentINR: 0,
            escalationClause: '15% every 3 years',
            currentYieldPercent: 8.5,
            expectedYieldPercent: 10.0,
            securityDepositINR: 0,
            lockInMonths: 24,
            renewalProbability: 'HIGH',
            leaseRegistrationStatus: 'REGISTERED',
            rentPaymentHistory: 'FLAWLESS_ON_TIME',
            occupancyStatus: 'FULLY_OCCUPIED',
            investmentValueINR: 0,
            capitalAppreciationPotential: 'HIGH',
            tenantCreditProfile: 'AAA_INVESTMENT_GRADE',
            leaseDocsAvailable: {
              agreement: true,
              cam: true,
              receipts: true,
              bankStatements: true,
            },
          });
        }

        const existingCat = (initialProperty as any).category || (
          initialProperty.propertyType === 'LAND' ? 'LAND_AND_PLOTS' :
          ['OFFICE', 'RETAIL', 'SHOWROOM', 'WAREHOUSE'].includes(initialProperty.propertyType) ? 'COMMERCIAL' : 'RESIDENTIAL'
        );
        setPropCategory(existingCat);
        setPropSubType((initialProperty as any).subType || (
          initialProperty.propertyType === 'APARTMENT' ? 'Apartment' :
          initialProperty.propertyType === 'PENTHOUSE' ? 'Penthouse' :
          initialProperty.propertyType === 'VILLA' ? 'Villa' :
          initialProperty.propertyType === 'ROW_HOUSE' ? 'Row House' :
          initialProperty.propertyType === 'STUDIO' ? 'Studio Apartment' :
          initialProperty.propertyType === 'OFFICE' ? 'Office' :
          initialProperty.propertyType === 'RETAIL' ? 'Retail Shop' :
          initialProperty.propertyType === 'SHOWROOM' ? 'Showroom' :
          initialProperty.propertyType === 'WAREHOUSE' ? 'Warehouse' :
          initialProperty.propertyType === 'LAND' ? 'Residential Plot' : 'Apartment'
        ));
        const numBed = (initialProperty as any).bedroomsNumeric || parseFloat(initialProperty.configuration || '3') || 3;
        setPropBedroomsNumeric(numBed);
        setPropType(initialProperty.propertyType || 'APARTMENT');
        setPropStatus(initialProperty.status || 'AVAILABLE');
        setPropConfig(initialProperty.configuration || `${numBed} BHK`);

        if ((initialProperty as any).plotSpecs) {
          const ps = (initialProperty as any).plotSpecs;
          setPlotAreaSqFt(String(ps.areaSqFt || '3000'));
          setPlotDimensions(ps.dimensions || '50 x 60 ft');
          setPlotBoundaryWall(ps.boundaryWall || 'YES');
          setPlotCornerPlot(ps.cornerPlot || 'NO');
          setPlotGatedLayout(ps.gatedLayout || 'YES');
          setPlotRoadWidthFt(String(ps.roadWidthFt || '40'));
          setPlotTitleType(ps.titleType || 'Clear Title / Freehold NA');
        }

        setPropCarpet(String(initialProperty.carpetAreaSqFt || '1650'));
        setPropFloor(String(initialProperty.floorNumber || '12'));
        setPropTotalFloors(String(initialProperty.totalFloors || '24'));
        setPropFacing(initialProperty.facing || 'East');
        setPropParking(String(initialProperty.parkingCount || 2) + ' Bays');
        setPropCity(initialProperty.location?.city || 'Pune');
        setPropMicroMarket(initialProperty.location?.microMarket || 'Baner');
        setPropAddress(initialProperty.location?.address || '');
        setPropBasePrice(String(initialProperty.pricing?.agreementValue || 25000000));
        setPropPossessionStatus(initialProperty.possessionStatus || 'READY_POSSESSION');
        setPropPossessionDate(initialProperty.possessionDate || 'Immediate');
        setPropReraNumber(initialProperty.reraRecord?.registrationNumber || 'P52100028492');
        setPropDescription(initialProperty.overviewDescription || '');
        setPropImages(initialProperty.media?.map((m) => m.url) || []);
        setPropSelectedAmenities(
          initialProperty.amenities && initialProperty.amenities.length > 0
            ? initialProperty.amenities
            : MASTER_AMENITIES.slice(0, 4)
        );

        setPropMinCarpet(String(initialProperty.carpetAreaSqFt ? Math.round(initialProperty.carpetAreaSqFt * 0.95) : 2200));
        setPropMaxCarpet(String(initialProperty.carpetAreaSqFt ? Math.round(initialProperty.carpetAreaSqFt * 1.05) : 2700));
        setPropCeilingHeight(String((initialProperty as any).ceilingHeightFt || '11.5'));
        setPropFloorRisePerFloor(String((initialProperty as any).floorRisePerFloor || '50'));
        setPropFloorPlanUrl((initialProperty as any).floorPlanUrl || '');
        setPropQrCodeUrl(initialProperty.reraRecord?.qrCodeUrl || '');
        setPropAuthorityUrl(initialProperty.reraRecord?.officialAuthorityUrl || getCleanMahaReraUrl(initialProperty.reraRecord?.registrationNumber));

        const creator = initialProperty.createdBy || initialProperty.contributor || null;
        setCreatorBadge(creator);
        setAuthorName(creator?.name || currentUserName);
        setAuthorEmail(creator?.email || currentUserEmail);
        setAuthorPhone(creator?.phone || currentUserPhone);

        const permitted = globalKiaanStore.canUserModifyProperty(initialProperty, session);
        setCanModify(permitted);
      } else {
        // Create mode
        setPropTitle('');
        setPropHeadline('');
        setPropCategory('RESIDENTIAL');
        setPropSubType('Apartment');
        setPropBedroomsNumeric(3);
        setPropType('APARTMENT');
        setPropConstructionStatus('READY_TO_MOVE');
        setPropAgeOfProperty('0');
        setPreLeasedState({
          isPreLeased: false,
          isPreRented: false,
          hasExistingTenant: false,
          tenantName: '',
          isTenantNamePublic: true,
          tenantType: 'MNC',
          tenantIndustry: '',
          leaseStartDate: '',
          leaseExpiryDate: '',
          remainingLeaseMonths: 36,
          monthlyRentINR: 0,
          annualRentINR: 0,
          escalationClause: '15% every 3 years',
          currentYieldPercent: 8.5,
          expectedYieldPercent: 10.0,
          securityDepositINR: 0,
          lockInMonths: 24,
          renewalProbability: 'HIGH',
          leaseRegistrationStatus: 'REGISTERED',
          rentPaymentHistory: 'FLAWLESS_ON_TIME',
          occupancyStatus: 'FULLY_OCCUPIED',
          investmentValueINR: 0,
          capitalAppreciationPotential: 'HIGH',
          tenantCreditProfile: 'AAA_INVESTMENT_GRADE',
          leaseDocsAvailable: {
            agreement: true,
            cam: true,
            receipts: true,
            bankStatements: true,
          },
        });
        setPropConfig('3 BHK');
        setPropSelectedAmenities(MASTER_AMENITIES.slice(0, 4));
        setPropMinCarpet('2200');
        setPropMaxCarpet('2700');
        setPropCeilingHeight('11.5');
        setPropFloorRisePerFloor('50');
        setPropFloorPlanUrl('');
        setPropQrCodeUrl('');
        setPropAuthorityUrl('https://maharera.maharashtra.gov.in/projects-search-result');
        setAuthorName(currentUserName);
        setAuthorEmail(currentUserEmail);
        setAuthorPhone(currentUserPhone);
        setCreatorBadge(null);
        setCanModify(true);
      }
    } else {
      // Project Mode
      if (initialProject && isEdit) {
        setProjName(initialProject.name || '');
        setProjTagline(initialProject.tagline || '');
        setProjDevName(initialProject.developerName || 'Kiaan Luxury Developments');
        setProjType(initialProject.projectType || 'RESIDENTIAL');
        setProjStatus(initialProject.status || 'UNDER_CONSTRUCTION');
        setProjCity(initialProject.location?.city || 'Pune');
        setProjMicroMarket(initialProject.location?.microMarket || 'Wakad');
        setProjAddress(initialProject.location?.address || '');
        setProjMinPrice(String(initialProject.headlinePriceRange?.min || 15000000));
        setProjMaxPrice(String(initialProject.headlinePriceRange?.max || 35000000));
        setProjConfigs(initialProject.configurations?.join(', ') || '3 BHK, 4 BHK');
        setProjMinCarpet(String(initialProject.carpetAreaRangeSqFt?.min || 1200));
        setProjMaxCarpet(String(initialProject.carpetAreaRangeSqFt?.max || 2800));
        setProjLandAcres(String(initialProject.totalLandAcres || 5));
        setProjTowers(String(initialProject.totalTowersCount || 3));
        setProjTotalUnits(String(initialProject.totalUnitsCount || 200));
        setProjAvailableUnits(String(initialProject.availableUnitsCount || 40));
        setProjPossessionDate(initialProject.possessionDate || 'December 2027');
        setProjReraNumber(initialProject.reraRecord?.registrationNumber || 'P52100028492');
        setProjOverview(initialProject.overviewStory || '');
        setProjImages(initialProject.media?.map((m) => m.url) || []);
        setProjSelectedAmenities(
          initialProject.amenities && initialProject.amenities.length > 0
            ? initialProject.amenities
            : MASTER_AMENITIES.slice(0, 7)
        );

        setProjBannerUrl((initialProject as any).bannerImageUrl || initialProject.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85');
        setProjMasterPlanUrl((initialProject as any).masterPlanUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
        setProjFloorPlanUrl((initialProject as any).floorPlanUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
        setProjCeilingHeight(String((initialProject as any).ceilingHeightFt || '11.5'));
        setProjTotalFloors(String((initialProject as any).totalFloorsCount || 32));
        setProjFloorRisePerFloor(String((initialProject as any).floorRisePerFloor || 50));
        setProjQrCodeUrl(initialProject.reraRecord?.qrCodeUrl || '');
        setProjAuthorityUrl(initialProject.reraRecord?.officialAuthorityUrl || getCleanMahaReraUrl(initialProject.reraRecord?.registrationNumber));

        const creator = initialProject.createdBy || initialProject.contributor || null;
        setCreatorBadge(creator);
        setAuthorName(creator?.name || currentUserName);
        setAuthorEmail(creator?.email || currentUserEmail);
        setAuthorPhone(creator?.phone || currentUserPhone);

        const permitted = globalKiaanStore.canUserModifyProject(initialProject, session);
        setCanModify(permitted);
      } else {
        // Create mode
        setProjName('');
        setProjSelectedAmenities(MASTER_AMENITIES.slice(0, 7));
        setProjMinCarpet('1200');
        setProjMaxCarpet('2800');
        setProjCeilingHeight('11.5');
        setProjTotalFloors('32');
        setProjFloorRisePerFloor('50');
        setProjBannerUrl('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85');
        setProjMasterPlanUrl('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
        setProjFloorPlanUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
        setProjQrCodeUrl('');
        setProjAuthorityUrl('https://maharera.maharashtra.gov.in/projects-search-result');
        setAuthorName(currentUserName);
        setAuthorEmail(currentUserEmail);
        setAuthorPhone(currentUserPhone);
        setCreatorBadge(null);
        setCanModify(true);
      }
    }
  }, [isOpen, mode, initialProperty, initialProject, session]);

  if (!isOpen) return null;

  // Add Image Handler
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (isProperty) {
      setPropImages([...propImages, newImageUrl.trim()]);
    } else {
      setProjImages([...projImages, newImageUrl.trim()]);
    }
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (isProperty) {
      setPropImages(propImages.filter((_, i) => i !== index));
    } else {
      setProjImages(projImages.filter((_, i) => i !== index));
    }
  };

  // Backend Authoritative RERA QR Provisioning & Sync
  const handleSyncBackendQr = async (forProp: boolean) => {
    const regNo = (forProp ? propReraNumber : projReraNumber).trim().toUpperCase();
    if (!regNo) {
      setBackendQrStatusMsg('Please enter a valid MahaRERA registration number first.');
      return;
    }

    setIsSyncingBackendQr(true);
    setBackendQrStatusMsg('Contacting backend regulatory engine to provision certified QR...');
    try {
      const res = await fetch('/api/v1/rera/qr/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: forProp ? 'PROPERTY' : 'PROJECT',
          entityId: forProp ? initialProperty?.id : initialProject?.id,
          registrationNumber: regNo,
          officialAuthorityUrl: forProp ? propAuthorityUrl : projAuthorityUrl,
          verifiedBy: session?.name || 'Kiaan Statutory Compliance Desk',
          complianceNotes: 'Statutory QR provisioned and verified through backend regulatory gateway',
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.qrCodeUrl) {
        if (forProp) {
          setPropQrCodeUrl(data.data.qrCodeUrl);
          if (data.data.officialAuthorityUrl) setPropAuthorityUrl(data.data.officialAuthorityUrl);
        } else {
          setProjQrCodeUrl(data.data.qrCodeUrl);
          if (data.data.officialAuthorityUrl) setProjAuthorityUrl(data.data.officialAuthorityUrl);
        }
        setBackendQrStatusMsg(`Verified by Backend Engine: ${data.data.auditStamp}`);
      } else {
        setBackendQrStatusMsg(data.message || 'Failed to sync QR from backend.');
      }
    } catch (err) {
      console.error('Failed to sync backend QR:', err);
      setBackendQrStatusMsg('Backend connection error while provisioning statutory QR.');
    } finally {
      setIsSyncingBackendQr(false);
    }
  };

  const handleUploadQrFileToBackend = async (e: React.ChangeEvent<HTMLInputElement>, forProp: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const regNo = (forProp ? propReraNumber : projReraNumber).trim().toUpperCase();
    if (!regNo) {
      setBackendQrStatusMsg('Please enter a valid MahaRERA registration number first.');
      return;
    }

    setIsSyncingBackendQr(true);
    setBackendQrStatusMsg(`Uploading certificate (${file.name}) to backend regulatory gateway...`);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const res = await fetch('/api/v1/rera/qr/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityType: forProp ? 'PROPERTY' : 'PROJECT',
            entityId: forProp ? initialProperty?.id : initialProject?.id,
            registrationNumber: regNo,
            qrCodeDataUrl: base64Data,
            officialAuthorityUrl: forProp ? propAuthorityUrl : projAuthorityUrl,
            verifiedBy: session?.name || 'Kiaan Statutory Compliance Desk',
            complianceNotes: `Authoritative certificate file uploaded to backend (${file.name}, ${(file.size / 1024).toFixed(1)} KB)`,
          }),
        });

        const data = await res.json();
        if (data.success && data.data?.qrCodeUrl) {
          if (forProp) {
            setPropQrCodeUrl(data.data.qrCodeUrl);
            if (data.data.officialAuthorityUrl) setPropAuthorityUrl(data.data.officialAuthorityUrl);
          } else {
            setProjQrCodeUrl(data.data.qrCodeUrl);
            if (data.data.officialAuthorityUrl) setProjAuthorityUrl(data.data.officialAuthorityUrl);
          }
          setBackendQrStatusMsg(`Uploaded & Verified by Backend Vault: ${data.data.auditStamp}`);
        } else {
          setBackendQrStatusMsg(data.message || 'Failed to process QR in backend.');
        }
      } catch (err) {
        console.error('Failed backend upload:', err);
        setBackendQrStatusMsg('Backend connection error while uploading statutory QR.');
      } finally {
        setIsSyncingBackendQr(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadFloorPlanFile = (e: React.ChangeEvent<HTMLInputElement>, forProp: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (forProp) {
        setPropFloorPlanUrl(dataUrl);
      } else {
        setProjFloorPlanUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadMasterPlanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProjMasterPlanUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProjBannerUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // SUBMIT / SAVE HANDLER
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!canModify) {
      setErrorMsg('Unauthorized: You can only modify assets that you created (or log in as a Super Admin).');
      return;
    }

    const currentAuthor: AssetAuthorInfo = {
      userId: session?.userId || `usr-${Date.now()}`,
      name: authorName.trim() || session?.name || 'Verified Property Contributor',
      email: authorEmail.trim() || session?.email || 'sales@kiaanproperties.in',
      phone: authorPhone.trim() || session?.phone || '+91 98230 11000',
      role: session?.role || 'VERIFIED_SELLER',
      trustLevel: session?.role === 'SUPER_ADMIN' ? 'ADMIN' : 'VERIFIED_OWNER',
    };

    if (isProperty) {
      if (!propTitle.trim()) {
        setErrorMsg('Please enter a descriptive Property Title.');
        return;
      }

      const baseVal = parseFloat(propBasePrice) || 20000000;
      const carpetVal = parseFloat(propCarpet) || 1500;

      let effectiveType: PropertyType = propType;
      if (propCategory === 'LAND_AND_PLOTS' || propSubType.toLowerCase().includes('plot') || propSubType.toLowerCase().includes('land')) {
        effectiveType = 'LAND';
      } else if (propCategory === 'COMMERCIAL') {
        if (propSubType.toLowerCase().includes('warehouse') || propSubType.toLowerCase().includes('godown') || propSubType.toLowerCase().includes('logistics') || propSubType.toLowerCase().includes('shed')) {
          effectiveType = 'WAREHOUSE';
        } else if (propSubType.toLowerCase().includes('retail') || propSubType.toLowerCase().includes('shop') || propSubType.toLowerCase().includes('mall')) {
          effectiveType = 'RETAIL';
        } else if (propSubType.toLowerCase().includes('showroom')) {
          effectiveType = 'SHOWROOM';
        } else {
          effectiveType = 'OFFICE';
        }
      } else if (propCategory === 'INDUSTRIAL') {
        effectiveType = 'WAREHOUSE';
      } else {
        if (propSubType.toLowerCase().includes('penthouse')) effectiveType = 'PENTHOUSE';
        else if (propSubType.toLowerCase().includes('villa') || propSubType.toLowerCase().includes('bungalow') || propSubType.toLowerCase().includes('mansion')) effectiveType = 'VILLA';
        else if (propSubType.toLowerCase().includes('row house') || propSubType.toLowerCase().includes('townhouse')) effectiveType = 'ROW_HOUSE';
        else if (propSubType.toLowerCase().includes('studio') || propSubType.toLowerCase().includes('1 rk') || propSubType.toLowerCase().includes('room') || propSubType.toLowerCase().includes('pg')) effectiveType = 'STUDIO';
        else if (propSubType.toLowerCase().includes('plot')) effectiveType = 'LAND';
        else effectiveType = 'APARTMENT';
      }

      const updatedProperty: any = {
        id: initialProperty?.id || `prop_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        slug:
          initialProperty?.slug ||
          `kiaan-${propTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${propMicroMarket.toLowerCase()}`,
        title: propTitle.trim(),
        headline: propHeadline.trim() || undefined,
        constructionStatus: propConstructionStatus,
        ageOfPropertyYears: parseFloat(propAgeOfProperty) || 0,
        transactionType: preLeasedState.isPreLeased ? 'PRE_LEASE' : preLeasedState.isPreRented ? 'PRE_RENT' : 'OUTRIGHT_SALE',
        preLeasedData: (preLeasedState.isPreLeased || preLeasedState.isPreRented || preLeasedState.hasExistingTenant) ? {
          isPreLeased: preLeasedState.isPreLeased,
          isPreRented: preLeasedState.isPreRented,
          hasExistingTenant: preLeasedState.hasExistingTenant,
          tenantName: preLeasedState.tenantName,
          tenantType: preLeasedState.tenantType,
          tenantIndustry: preLeasedState.tenantIndustry,
          monthlyRentINR: preLeasedState.monthlyRentINR,
          annualRentINR: preLeasedState.annualRentINR || preLeasedState.monthlyRentINR * 12,
          escalationClause: preLeasedState.escalationClause,
          currentVerifiedYieldPercent: preLeasedState.currentYieldPercent,
          currentYieldPercent: preLeasedState.currentYieldPercent,
          expectedProjectedYieldPercent: preLeasedState.expectedYieldPercent,
          expectedYieldPercent: preLeasedState.expectedYieldPercent,
          securityDepositINR: preLeasedState.securityDepositINR,
          lockInPeriodYears: Math.round(preLeasedState.lockInMonths / 12) || 2,
          remainingLeasePeriodYears: Math.round(preLeasedState.remainingLeaseMonths / 12) || 3,
          leaseRegistrationStatus: preLeasedState.leaseRegistrationStatus,
          tenantVisibility: preLeasedState.isTenantNamePublic ? 'PUBLIC' : 'CONFIDENTIAL',
          capitalAppreciationPotentialPercent: preLeasedState.capitalAppreciationPotential === 'HIGH' ? 12 : preLeasedState.capitalAppreciationPotential === 'MODERATE' ? 8 : 5,
          renewalProbabilityPercent: preLeasedState.renewalProbability === 'HIGH' ? 90 : preLeasedState.renewalProbability === 'MEDIUM' ? 75 : 50,
          roiPaybackYears: preLeasedState.currentYieldPercent > 0 ? parseFloat((100 / preLeasedState.currentYieldPercent).toFixed(1)) : 11.5,
          leaseStartDate: preLeasedState.leaseStartDate,
          leaseExpiryDate: preLeasedState.leaseExpiryDate,
          leaseDocsAvailable: preLeasedState.leaseDocsAvailable,
        } : undefined,
        propertyType: effectiveType,
        category: propCategory,
        subType: propSubType,
        bedroomsNumeric: typeof propBedroomsNumeric === 'number' ? propBedroomsNumeric : parseFloat(String(propBedroomsNumeric)) || undefined,
        plotSpecs: (propCategory === 'LAND_AND_PLOTS' || effectiveType === 'LAND') ? {
          areaSqFt: parseFloat(plotAreaSqFt) || carpetVal,
          dimensions: plotDimensions,
          boundaryWall: plotBoundaryWall,
          cornerPlot: plotCornerPlot,
          gatedLayout: plotGatedLayout,
          roadWidthFt: parseFloat(plotRoadWidthFt) || 40,
          titleType: plotTitleType,
        } : undefined,
        status: propStatus,
        configuration: propConfig.trim() || `${propBedroomsNumeric} BHK`,
        carpetAreaSqFt: carpetVal,
        floorNumber: parseInt(propFloor) || 1,
        totalFloors: parseInt(propTotalFloors) || 20,
        facing: propFacing,
        parkingCount: parseInt(propParking) || 2,
        possessionStatus: propPossessionStatus,
        possessionDate: propPossessionDate,
        overviewDescription: propDescription.trim(),
        isPublished: true,
        isKiaanPick: initialProperty?.isKiaanPick || false,
        isFirstLook: initialProperty?.isFirstLook || true,
        createdAt: initialProperty?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: initialProperty?.createdBy || currentAuthor,
        updatedBy: isEdit ? currentAuthor : undefined,
        location: {
          id: initialProperty?.location?.id || `loc_${Date.now()}`,
          microMarket: propMicroMarket.trim(),
          city: propCity.trim(),
          state: 'Maharashtra',
          pincode: '411045',
          address: propAddress.trim() || `${propMicroMarket}, ${propCity}`,
          coordinates: initialProperty?.location?.coordinates || { lat: 18.55, lng: 73.8 },
          landmarks: initialProperty?.location?.landmarks || [
            { name: 'Metro Gateway & Express Hub', type: 'METRO', distanceKm: 1.8, commuteMinutes: 6 },
            { name: 'Balewadi High Street Retail', type: 'MALL', distanceKm: 2.2, commuteMinutes: 7 },
          ],
        },
        pricing: {
          basePrice: baseVal,
          pricePerSqFt: Math.round(baseVal / carpetVal),
          carParkingCharges: 500000,
          clubhouseMaintenanceCharges: 250000,
          estimatedGstPercent: propPossessionStatus === 'READY_POSSESSION' ? 0 : 5,
          estimatedStampDutyPercent: 7,
          registrationCharges: 30000,
          maintenanceDeposit1Yr: 150000,
          totalEstimatedAcquisitionCost: Math.round(baseVal * 1.07 + (propPossessionStatus === 'READY_POSSESSION' ? 0 : baseVal * 0.05) + 430000),
          comparableMarketRange: {
            min: Math.round(baseVal * 0.95),
            max: Math.round(baseVal * 1.15),
            positioning: 'PREMIUM',
          },
        },
        reraRecord: {
          id: `rera_${Date.now()}`,
          jurisdiction: 'MAHARERA',
          regulatoryAuthority: 'Maharashtra Real Estate Regulatory Authority (MahaRERA)',
          registrationNumber: propReraNumber.trim() || 'P52100028492',
          officialAuthorityUrl: propAuthorityUrl.trim() || getCleanMahaReraUrl(propReraNumber.trim()),
          qrCodeUrl: propQrCodeUrl.trim() || getScannableQrUrl(propReraNumber.trim()),
          status: 'REGISTERED',
          verificationStatus: 'VERIFIED',
          lastVerifiedAt: new Date().toISOString(),
          verifiedBy: currentAuthor.name,
          auditHistory: [],
        },
        floorPlanUrl: propFloorPlanUrl,
        ceilingHeightFt: parseFloat(propCeilingHeight) || 11.5,
        floorRisePerFloor: parseFloat(propFloorRisePerFloor) || 50,
        minCarpetAreaSqFt: parseFloat(propMinCarpet) || Math.round(carpetVal * 0.95),
        maxCarpetAreaSqFt: parseFloat(propMaxCarpet) || Math.round(carpetVal * 1.05),
        amenities: propSelectedAmenities,
        media: propImages.map((url, index) => ({
          id: `med_prop_${index}_${Date.now()}`,
          type: 'IMAGE',
          url,
          title: `${propTitle} View ${index + 1}`,
          category: index === 0 ? 'EXTERIOR' : 'INTERIOR',
          isCoverImage: index === 0,
        })),
        propertyScore: initialProperty?.propertyScore || {
          overallScore: 9.4,
          lifestyleScore: 9.6,
          investmentScore: 9.2,
          connectivityScore: 9.5,
          reraComplianceScore: 10.0,
          breakdown: {
            legalAndRera: 10,
            locationAndGrowth: 9.5,
            constructionQuality: 9.4,
            amenitiesAndLifestyle: 9.6,
            priceFairness: 9.1,
            developerReputation: 9.3,
          },
          decisionConfidencePercent: 96,
          informationCompletenessPercent: 100,
          personalityBadge: 'Luxury Statement',
        },
      };

      globalKiaanStore.saveProperty(updatedProperty, currentAuthor);
      setSuccessMsg(`Property "${updatedProperty.title}" successfully saved!`);
      if (onSuccess) onSuccess(updatedProperty, isEdit ? 'UPDATED' : 'CREATED');

      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      // SAVE PROJECT
      if (!projName.trim()) {
        setErrorMsg('Please enter a Project Name.');
        return;
      }

      const minVal = parseFloat(projMinPrice) || 15000000;
      const maxVal = parseFloat(projMaxPrice) || 35000000;
      const minCarpetVal = parseFloat(projMinCarpet) || 1200;
      const maxCarpetVal = parseFloat(projMaxCarpet) || 2800;

      const updatedProject: Project = {
        id: initialProject?.id || `proj_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        slug:
          initialProject?.slug ||
          `kiaan-${projName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${projMicroMarket.toLowerCase()}`,
        name: projName.trim(),
        tagline: projTagline.trim(),
        developerName: projDevName.trim() || 'Kiaan Luxury Developments',
        projectType: projType,
        status: projStatus,
        possessionDate: projPossessionDate,
        totalLandAcres: parseFloat(projLandAcres) || 5.0,
        totalTowersCount: parseInt(projTowers) || 3,
        totalUnitsCount: parseInt(projTotalUnits) || 240,
        availableUnitsCount: parseInt(projAvailableUnits) || 40,
        overviewStory: projOverview.trim(),
        isPublished: true,
        isKiaanPick: initialProject?.isKiaanPick || true,
        isFirstLook: initialProject?.isFirstLook || false,
        createdAt: initialProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: initialProject?.createdBy || currentAuthor,
        updatedBy: isEdit ? currentAuthor : undefined,
        configurations: projConfigs.split(',').map((c) => c.trim()).filter(Boolean),
        carpetAreaRangeSqFt: { min: minCarpetVal, max: maxCarpetVal },
        headlinePriceRange: {
          min: minVal,
          max: maxVal,
          displayString: `${formatINR(minVal)} - ${formatINR(maxVal)}`,
        },
        location: {
          id: initialProject?.location?.id || `loc_proj_${Date.now()}`,
          microMarket: projMicroMarket.trim(),
          city: projCity.trim(),
          state: 'Maharashtra',
          pincode: '411057',
          address: projAddress.trim() || `${projMicroMarket}, ${projCity}`,
          coordinates: initialProject?.location?.coordinates || { lat: 18.59, lng: 73.76 },
          landmarks: initialProject?.location?.landmarks || [
            { name: 'Hinjewadi IT Phase 1 Hub', type: 'IT_PARK', distanceKm: 2.5, commuteMinutes: 8 },
            { name: 'Expressway Flyover Junction', type: 'HIGHWAY', distanceKm: 3.2, commuteMinutes: 9 },
          ],
        },
        reraRecord: {
          id: `rera_proj_${Date.now()}`,
          jurisdiction: 'MAHARERA',
          regulatoryAuthority: 'Maharashtra Real Estate Regulatory Authority (MahaRERA)',
          registrationNumber: projReraNumber.trim() || 'P52100028492',
          officialAuthorityUrl: projAuthorityUrl.trim() || getCleanMahaReraUrl(projReraNumber.trim()),
          qrCodeUrl: projQrCodeUrl.trim() || getScannableQrUrl(projReraNumber.trim()),
          status: 'REGISTERED',
          verificationStatus: 'VERIFIED',
          lastVerifiedAt: new Date().toISOString(),
          verifiedBy: currentAuthor.name,
          auditHistory: [],
        },
        architecturalHighlights: initialProject?.architecturalHighlights || [
          'Iconic Cantilevered Sky Lounge with Heated Infinity Pool',
          'Acoustic Double-Glazed Facade for Whisper-Quiet Living',
          '3-Acre Miyawaki Urban Forest with Zen Walking Trails',
        ],
        specifications: initialProject?.specifications || [
          { category: 'Flooring', items: ['Italian Statuario marble in living, dining & master suites'] },
          { category: 'Sanitary & Fittings', items: ['Villeroy & Boch with Gessi brushed gold mixers'] },
        ],
        masterPlanUrl: projMasterPlanUrl.trim() || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        floorPlanUrl: projFloorPlanUrl.trim() || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        bannerImageUrl: projBannerUrl.trim() || projImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
        ceilingHeightFt: parseFloat(projCeilingHeight) || 11.5,
        totalFloorsCount: parseInt(projTotalFloors) || 32,
        floorRisePerFloor: parseFloat(projFloorRisePerFloor) || 50,
        towers: initialProject?.towers || [],
        constructionUpdates: initialProject?.constructionUpdates || [],
        aiKnowledgeContext: initialProject?.aiKnowledgeContext || `${projName} developed by ${projDevName} in ${projMicroMarket}, ${projCity}.`,
        amenities: projSelectedAmenities,
        media: [
          ...(projBannerUrl.trim()
            ? [
                {
                  id: `med_proj_banner_${Date.now()}`,
                  type: 'IMAGE' as const,
                  url: projBannerUrl.trim(),
                  title: `${projName} Official Project Elevation Banner`,
                  category: 'EXTERIOR' as const,
                  isCoverImage: true,
                },
              ]
            : []),
          ...projImages
            .filter((url) => url !== projBannerUrl.trim())
            .map((url, index) => ({
              id: `med_proj_${index}_${Date.now()}`,
              type: 'IMAGE' as const,
              url,
              title: `${projName} View ${index + 1}`,
              category: index === 0 ? ('EXTERIOR' as const) : ('INTERIOR' as const),
              isCoverImage: !projBannerUrl && index === 0,
            })),
        ],
        propertyScore: initialProject?.propertyScore || {
          overallScore: 9.6,
          lifestyleScore: 9.8,
          investmentScore: 9.5,
          connectivityScore: 9.4,
          reraComplianceScore: 10.0,
          breakdown: {
            legalAndRera: 10,
            locationAndGrowth: 9.6,
            constructionQuality: 9.7,
            amenitiesAndLifestyle: 9.8,
            priceFairness: 9.3,
            developerReputation: 9.6,
          },
          decisionConfidencePercent: 98,
          informationCompletenessPercent: 100,
          personalityBadge: "Investor's Pick",
        },
        customSchemaData: customSchemaData || undefined,
      };

      globalKiaanStore.saveProject(updatedProject, currentAuthor);
      setSuccessMsg(`Project "${updatedProject.name}" successfully saved!`);
      if (onSuccess) onSuccess(updatedProject, isEdit ? 'UPDATED' : 'CREATED');

      setTimeout(() => {
        onClose();
      }, 900);
    }
  };

  // DELETE HANDLER
  const handleDelete = () => {
    if (!isEdit) return;

    if (!canModify) {
      alert('Access Denied: You are not authorized to delete this asset. Only the creator or a Super Admin can perform deletions.');
      return;
    }

    const title = isProperty ? initialProperty?.title : initialProject?.name;
    const confirmDelete = window.confirm(
      `⚠️ PERMANENT AUDIT ACTION:\nAre you sure you want to delete "${title}"?\n\nThis will remove the listing from active search and public digital twins.`
    );
    if (!confirmDelete) return;

    const op: AssetAuthorInfo = {
      name: session?.name || authorName || 'Authorized Creator',
      email: session?.email || authorEmail || 'sales@kiaanproperties.in',
      role: session?.role || 'SUPER_ADMIN',
    };

    if (isProperty && initialProperty) {
      const res = globalKiaanStore.deleteProperty(initialProperty.id, op);
      if (res.success) {
        alert(res.message);
        if (onSuccess) onSuccess(initialProperty, 'DELETED');
        onClose();
      } else {
        alert(res.message);
      }
    } else if (initialProject) {
      const res = globalKiaanStore.deleteProject(initialProject.id, op);
      if (res.success) {
        alert(res.message);
        if (onSuccess) onSuccess(initialProject, 'DELETED');
        onClose();
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-[#0B101B] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-current/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              {isProperty ? <Layers className="w-5 h-5" /> : <Building className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold">
                  {isEdit
                    ? `Modify ${isProperty ? 'Property' : 'Project'}`
                    : `Add New ${isProperty ? 'Property' : 'Project'}`}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 font-mono">
                  {isProperty ? propType : projType}
                </span>
              </div>
              <p className="text-xs opacity-70">
                {isEdit
                  ? `Authorized creator management with real-time portfolio synchronization.`
                  : `Direct asset onboarding with instant RERA validation and digital twin indexing.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEdit && canModify && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="Delete Listing"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl opacity-60 hover:opacity-100 hover:bg-current/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PERMISSION LOCK WARNING IF NOT AUTHORIZED */}
        {!canModify && (
          <div className="px-6 py-3 bg-red-500/15 border-b border-red-500/30 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>
                <strong>Read-Only Access:</strong> This {isProperty ? 'property' : 'project'} was added by{' '}
                <strong>{creatorBadge?.name || creatorBadge?.email || 'another authorized owner'}</strong>. Only the original creator or a Super Admin can modify or delete it.
              </span>
            </div>
          </div>
        )}

        {/* 29-SECTION MASTER SCHEMA LAUNCH BANNER FOR RESIDENTIAL PROJECTS */}
        {!isProperty && (
          <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-300">29-Section Master Project Custom Fields Schema Available</span>
                <span className="opacity-70 ml-2 hidden sm:inline">• Live LQS audit, unbundled cost sheet, travel matrix & FAQs</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowMasterSchemaWizard(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch 7-Step Master Schema Wizard</span>
            </button>
          </div>
        )}

        {/* 10-STAGE UNIVERSAL SCHEMA LAUNCH BANNER FOR RESALE & STANDALONE PROPERTIES */}
        {isProperty && (
          <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-300">10-Stage Universal Property Listing Schema Available</span>
                <span className="opacity-70 ml-2 hidden sm:inline">• 40+ Residential sub-types (numeric BHK), 50+ Commercial sub-types, 30+ Land/Plot attributes & Sale/Rent/Lease pricing</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowUniversalWizard(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch 10-Stage Universal Schema Wizard</span>
            </button>
          </div>
        )}

        {/* TAB NAVIGATION */}
        <div className="px-6 py-2.5 bg-black/20 border-b border-current/10 flex items-center gap-2 overflow-x-auto text-xs flex-shrink-0">
          {(isProperty
            ? [
                { id: 'DETAILS', label: '1. Asset Specs & Details', icon: Sliders },
                { id: 'LOCATION_RERA', label: '2. Location & MahaRERA', icon: MapPin },
                { id: 'PRICING', label: '3. Pricing & Commercials', icon: IndianRupee },
                { id: 'MEDIA_AMENITIES', label: '4. Photos & Amenities', icon: Image },
                {
                  id: 'PRE_LEASE',
                  label: '5. Pre-Leased & Investment',
                  icon: DollarSign,
                  badge: (preLeasedState.isPreLeased || preLeasedState.isPreRented) ? 'ACTIVE' : undefined,
                },
                { id: 'CREATOR', label: '6. Creator Attribution & RBAC', icon: ShieldCheck },
              ]
            : [
                { id: 'DETAILS', label: '1. Project Specs & Details', icon: Sliders },
                { id: 'LOCATION_RERA', label: '2. Location & MahaRERA', icon: MapPin },
                { id: 'PRICING', label: '3. Pricing & Commercials', icon: IndianRupee },
                { id: 'MEDIA_AMENITIES', label: '4. Photos & Amenities', icon: Image },
                { id: 'CREATOR', label: '5. Creator Attribution & RBAC', icon: ShieldCheck },
              ]
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'opacity-60 hover:opacity-100 hover:bg-current/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {(tab as any).badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-emerald-400 text-slate-950">
                    {(tab as any).badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* FORM CONTENT CONTAINER */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 1: ASSET SPECS & CORE DETAILS                                 */}
          {/* ================================================================= */}
          {activeTab === 'DETAILS' && (
            <div className="space-y-4">
              {isProperty ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">Property Title *</label>
                    <input
                      type="text"
                      disabled={!canModify}
                      value={propTitle}
                      onChange={(e) => setPropTitle(e.target.value)}
                      placeholder="e.g. 4 BHK Imperial Sky Penthouse with Infinity Terrace"
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80 flex items-center justify-between">
                      <span>Marketing Headline / Institutional Hook</span>
                      <span className="text-[10px] opacity-60">Shown prominently on Cards & Investment Summaries</span>
                    </label>
                    <input
                      type="text"
                      disabled={!canModify}
                      value={propHeadline}
                      onChange={(e) => setPropHeadline(e.target.value)}
                      placeholder="e.g. Pre-Leased to Global Fortune 500 MNC with 9-Yr Unbroken Lock-In & 8.8% Yield"
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-current/5 border border-current/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Construction Stage</label>
                      <select
                        disabled={!canModify}
                        value={propConstructionStatus}
                        onChange={(e) => setPropConstructionStatus(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50 font-bold"
                      >
                        <option value="READY_TO_MOVE" className="bg-slate-900 text-white">READY TO MOVE (OC Received)</option>
                        <option value="UNDER_CONSTRUCTION" className="bg-slate-900 text-white">UNDER CONSTRUCTION (Active Work)</option>
                        <option value="NEW_LAUNCH" className="bg-slate-900 text-white">NEW LAUNCH (Booking Open)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Age of Property (Years)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        disabled={!canModify}
                        value={propAgeOfProperty}
                        onChange={(e) => setPropAgeOfProperty(e.target.value)}
                        placeholder="0 for brand new / under construction"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Property Category *</label>
                      <select
                        disabled={!canModify}
                        value={propCategory}
                        onChange={(e) => {
                          const newCat = e.target.value as PropertyCategory;
                          setPropCategory(newCat);
                          const available = PROPERTY_CATEGORIES.find((c) => c.id === newCat)?.subTypes || [];
                          if (available.length > 0) {
                            setPropSubType(available[0]);
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      >
                        {PROPERTY_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                            {cat.name} ({cat.subTypes.length} sub-types)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80 flex items-center justify-between">
                        <span>Property Sub-Type *</span>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {(PROPERTY_CATEGORIES.find((c) => c.id === propCategory)?.subTypes || []).length} Options
                        </span>
                      </label>
                      <select
                        disabled={!canModify}
                        value={propSubType}
                        onChange={(e) => {
                          const sub = e.target.value;
                          setPropSubType(sub);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      >
                        {(PROPERTY_CATEGORIES.find((c) => c.id === propCategory)?.subTypes || []).map((sub) => (
                          <option key={sub} value={sub} className="bg-slate-900 text-white">
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Listing Status</label>
                      <select
                        disabled={!canModify}
                        value={propStatus}
                        onChange={(e) => setPropStatus(e.target.value as PropertyStatus)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      >
                        <option value="AVAILABLE" className="bg-slate-900 text-white">AVAILABLE for Acquisition</option>
                        <option value="HOLD" className="bg-slate-900 text-white">HOLD (Token Paid Lock)</option>
                        <option value="RESERVED" className="bg-slate-900 text-white">RESERVED (Under Agreement)</option>
                        <option value="SOLD" className="bg-slate-900 text-white">SOLD / Fully Executed</option>
                        <option value="ARCHIVED" className="bg-slate-900 text-white">ARCHIVED / Off-Market</option>
                      </select>
                    </div>
                  </div>

                  {/* RESIDENTIAL NUMERIC BEDROOM CONFIGURATION */}
                  {propCategory === 'RESIDENTIAL' && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Residential Bedroom Configuration (Numeric & Unrestricted)</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Numeric Bedroom Count
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Exact Bedroom Count (Numeric) *</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              disabled={!canModify}
                              value={propBedroomsNumeric}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPropBedroomsNumeric(val);
                                if (val) {
                                  setPropConfig(`${val} BHK ${propSubType}`);
                                }
                              }}
                              placeholder="e.g. 1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7"
                              className="w-full px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-sm font-mono font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                            />
                            <span className="absolute right-3 top-2 text-xs opacity-50 font-mono">Beds / BHK</span>
                          </div>
                          <span className="text-[10px] opacity-60">Allows any numeric value (e.g. 2.5, 3.5, 4.5, 5, 6, 7+) without fixed preset limits</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">BHK / Unit Display Label</label>
                          <input
                            type="text"
                            disabled={!canModify}
                            value={propConfig}
                            onChange={(e) => setPropConfig(e.target.value)}
                            placeholder="e.g. 3.5 BHK Sky Penthouse"
                            className="w-full px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                          />
                          <span className="text-[10px] opacity-60">Custom display text generated from numeric count or overridden</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LAND & PLOTS COMPREHENSIVE ATTRIBUTES */}
                  {propCategory === 'LAND_AND_PLOTS' && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Land & Plot Comprehensive Specifications</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          30+ Land Attributes
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Plot Area (Sq.Ft) *</label>
                          <input
                            type="number"
                            disabled={!canModify}
                            value={plotAreaSqFt}
                            onChange={(e) => {
                              setPlotAreaSqFt(e.target.value);
                              setPropCarpet(e.target.value);
                            }}
                            placeholder="e.g. 3000"
                            className="w-full px-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Plot Dimensions</label>
                          <input
                            type="text"
                            disabled={!canModify}
                            value={plotDimensions}
                            onChange={(e) => setPlotDimensions(e.target.value)}
                            placeholder="e.g. 50 x 60 ft"
                            className="w-full px-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Road Width / Frontage (Ft)</label>
                          <input
                            type="number"
                            disabled={!canModify}
                            value={plotRoadWidthFt}
                            onChange={(e) => setPlotRoadWidthFt(e.target.value)}
                            placeholder="e.g. 40"
                            className="w-full px-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Boundary Wall</label>
                          <select
                            disabled={!canModify}
                            value={plotBoundaryWall}
                            onChange={(e) => setPlotBoundaryWall(e.target.value as any)}
                            className="w-full px-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          >
                            <option value="YES" className="bg-slate-900 text-white">Yes - Gated / Fenced</option>
                            <option value="NO" className="bg-slate-900 text-white">No Boundary Wall</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Corner Plot</label>
                          <select
                            disabled={!canModify}
                            value={plotCornerPlot}
                            onChange={(e) => setPlotCornerPlot(e.target.value as any)}
                            className="w-full px-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          >
                            <option value="YES" className="bg-slate-900 text-white">Yes - 2 Side Road</option>
                            <option value="NO" className="bg-slate-900 text-white">Standard Plot</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Gated Layout</label>
                          <select
                            disabled={!canModify}
                            value={plotGatedLayout}
                            onChange={(e) => setPlotGatedLayout(e.target.value as any)}
                            className="w-full px-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          >
                            <option value="YES" className="bg-slate-900 text-white">Yes - Gated Township</option>
                            <option value="NO" className="bg-slate-900 text-white">Standalone / Open Land</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold opacity-80">Title / Ownership</label>
                          <select
                            disabled={!canModify}
                            value={plotTitleType}
                            onChange={(e) => setPlotTitleType(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          >
                            <option value="Clear Title / Freehold NA" className="bg-slate-900 text-white">Clear Title Freehold NA</option>
                            <option value="7/12 Extract Clear" className="bg-slate-900 text-white">7/12 Extract Clear</option>
                            <option value="Gunthewari Regularized" className="bg-slate-900 text-white">Gunthewari Regularized</option>
                            <option value="Agricultural Title" className="bg-slate-900 text-white">Agricultural Title</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COMMERCIAL OR INDUSTRIAL CONFIGURATION */}
                  {propCategory !== 'RESIDENTIAL' && propCategory !== 'LAND_AND_PLOTS' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold opacity-80">Commercial Configuration / Spec</label>
                        <input
                          type="text"
                          disabled={!canModify}
                          value={propConfig}
                          onChange={(e) => setPropConfig(e.target.value)}
                          placeholder="e.g. Warm Shell Grade-A / 100 Workstations"
                          className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold opacity-80">Standard Usable / Carpet Area (Sq.Ft) *</label>
                        <input
                          type="number"
                          disabled={!canModify}
                          value={propCarpet}
                          onChange={(e) => setPropCarpet(e.target.value)}
                          placeholder="e.g. 5000"
                          className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  )}

                  {propCategory === 'RESIDENTIAL' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">RERA Approved Standard Carpet Area (Sq.Ft) *</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={propCarpet}
                        onChange={(e) => setPropCarpet(e.target.value)}
                        placeholder="e.g. 2450"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                  )}

                  {/* Min & Max Carpet Area (Required: Minimum and maximum both) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-current/5 border border-current/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80 flex items-center justify-between">
                        <span>Minimum Usable Carpet Area (Sq.Ft)</span>
                        <span className="text-[10px] text-amber-400 font-mono">Min Range</span>
                      </label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={propMinCarpet}
                        onChange={(e) => setPropMinCarpet(e.target.value)}
                        placeholder="e.g. 2200"
                        className="w-full px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80 flex items-center justify-between">
                        <span>Maximum Usable Carpet Area (Sq.Ft)</span>
                        <span className="text-[10px] text-amber-400 font-mono">Max Range</span>
                      </label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={propMaxCarpet}
                        onChange={(e) => setPropMaxCarpet(e.target.value)}
                        placeholder="e.g. 2700"
                        className="w-full px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Ceiling Height & Floor Rise Levels */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                        <span>Ceiling Height (Feet - Manual Feed) *</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        disabled={!canModify}
                        value={propCeilingHeight}
                        onChange={(e) => setPropCeilingHeight(e.target.value)}
                        placeholder="e.g. 11.5"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-mono font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <span className="text-[10px] opacity-60">Floor-to-ceiling clear architectural slab height</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Unit Floor & Total Floors</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          disabled={!canModify}
                          value={propFloor}
                          onChange={(e) => setPropFloor(e.target.value)}
                          placeholder="Unit Floor"
                          className="w-1/2 px-3 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                          title="Current Unit Floor"
                        />
                        <input
                          type="number"
                          disabled={!canModify}
                          value={propTotalFloors}
                          onChange={(e) => setPropTotalFloors(e.target.value)}
                          placeholder="Total Floors"
                          className="w-1/2 px-3 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                          title="Total Building Floors"
                        />
                      </div>
                      <span className="text-[10px] opacity-60">Total levels in tower: {propTotalFloors || '20'} floors</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Floor Rise Rate (₹/Sq.Ft/Floor)</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={propFloorRisePerFloor}
                        onChange={(e) => setPropFloorRisePerFloor(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <span className="text-[10px] opacity-60">Calculated per floor rise premium</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Orientation & Vastu Facing</label>
                      <input
                        type="text"
                        disabled={!canModify}
                        value={propFacing}
                        onChange={(e) => setPropFacing(e.target.value)}
                        placeholder="e.g. North-East Vastu Compliant"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Dedicated Covered Parking</label>
                      <input
                        type="text"
                        disabled={!canModify}
                        value={propParking}
                        onChange={(e) => setPropParking(e.target.value)}
                        placeholder="e.g. 3 Basement Car Bays + 1 EV Point"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">Architectural Narrative & Asset Story</label>
                    <textarea
                      rows={3}
                      disabled={!canModify}
                      value={propDescription}
                      onChange={(e) => setPropDescription(e.target.value)}
                      placeholder="Highlight luxury interior specifications, deck dimensions, designer fittings..."
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </>
              ) : (
                /* PROJECT DETAILS */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Project Master Name *</label>
                      <input
                        type="text"
                        disabled={!canModify}
                        value={projName}
                        onChange={(e) => setProjName(e.target.value)}
                        placeholder="e.g. Kiaan One Vertica"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Developer / Promoter Entity</label>
                      <input
                        type="text"
                        disabled={!canModify}
                        value={projDevName}
                        onChange={(e) => setProjDevName(e.target.value)}
                        placeholder="e.g. Kiaan Luxury Developments"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">Curated Tagline / Vision</label>
                    <input
                      type="text"
                      disabled={!canModify}
                      value={projTagline}
                      onChange={(e) => setProjTagline(e.target.value)}
                      placeholder="e.g. Sculpted Sky Residences Above The Clouds"
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Project Type</label>
                      <select
                        disabled={!canModify}
                        value={projType}
                        onChange={(e) => setProjType(e.target.value as ProjectType)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      >
                        {PROJECT_TYPES.map((t) => (
                          <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Construction Stage</label>
                      <select
                        disabled={!canModify}
                        value={projStatus}
                        onChange={(e) => setProjStatus(e.target.value as ProjectStatus)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      >
                        <option value="PRE_LAUNCH" className="bg-slate-900 text-white">PRE-LAUNCH (VIP Allocation)</option>
                        <option value="UNDER_CONSTRUCTION" className="bg-slate-900 text-white">UNDER CONSTRUCTION (Active RCC)</option>
                        <option value="NEAR_POSSESSION" className="bg-slate-900 text-white">NEAR POSSESSION (Finishing Stage)</option>
                        <option value="READY_POSSESSION" className="bg-slate-900 text-white">READY POSSESSION (OC Received)</option>
                        <option value="COMPLETED" className="bg-slate-900 text-white">COMPLETED (100% Handover)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Land Parcel (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        disabled={!canModify}
                        value={projLandAcres}
                        onChange={(e) => setProjLandAcres(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Towers Count</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projTowers}
                        onChange={(e) => setProjTowers(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Total Inventory</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projTotalUnits}
                        onChange={(e) => setProjTotalUnits(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Available Units</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projAvailableUnits}
                        onChange={(e) => setProjAvailableUnits(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">Configurations Offered (Comma-separated)</label>
                    <input
                      type="text"
                      disabled={!canModify}
                      value={projConfigs}
                      onChange={(e) => setProjConfigs(e.target.value)}
                      placeholder="e.g. 3 BHK Grande, 3.5 BHK Sky Suite, 4 BHK Penthouse"
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>

                  {/* Project Carpet Area: Minimum and Maximum Both */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-current/5 border border-current/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80 flex items-center justify-between">
                        <span>Minimum Carpet Area (Sq.Ft) *</span>
                        <span className="text-[10px] text-amber-400 font-mono">Min Range</span>
                      </label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projMinCarpet}
                        onChange={(e) => setProjMinCarpet(e.target.value)}
                        placeholder="e.g. 1200"
                        className="w-full px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80 flex items-center justify-between">
                        <span>Maximum Carpet Area (Sq.Ft) *</span>
                        <span className="text-[10px] text-amber-400 font-mono">Max Range</span>
                      </label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projMaxCarpet}
                        onChange={(e) => setProjMaxCarpet(e.target.value)}
                        placeholder="e.g. 2800"
                        className="w-full px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  {/* Ceiling Height & Floor Rise Level / Total Floors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                        <span>Ceiling Height (Feet - Manual Feed) *</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        disabled={!canModify}
                        value={projCeilingHeight}
                        onChange={(e) => setProjCeilingHeight(e.target.value)}
                        placeholder="e.g. 11.5"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-mono font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <span className="text-[10px] opacity-60">Floor-to-ceiling clear architectural slab height</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Total Floors (Floor Rise Levels) *</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projTotalFloors}
                        onChange={(e) => setProjTotalFloors(e.target.value)}
                        placeholder="e.g. 32"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <span className="text-[10px] opacity-60">Total structural floors per residential tower</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Floor Rise Rate (₹/Sq.Ft/Floor)</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projFloorRisePerFloor}
                        onChange={(e) => setProjFloorRisePerFloor(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <span className="text-[10px] opacity-60">Incremental floor rise premium</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">Master Story & Architectural Overview</label>
                    <textarea
                      rows={3}
                      disabled={!canModify}
                      value={projOverview}
                      onChange={(e) => setProjOverview(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: LOCATION & MAHARERA VERIFICATION                           */}
          {/* ================================================================= */}
          {activeTab === 'LOCATION_RERA' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold opacity-80">Micro-Market Prime Zone *</label>
                  <input
                    type="text"
                    disabled={!canModify}
                    value={isProperty ? propMicroMarket : projMicroMarket}
                    onChange={(e) =>
                      isProperty ? setPropMicroMarket(e.target.value) : setProjMicroMarket(e.target.value)
                    }
                    placeholder="e.g. Baner, Wakad, Kharadi, Koregaon Park"
                    className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold opacity-80">City</label>
                  <input
                    type="text"
                    disabled={!canModify}
                    value={isProperty ? propCity : projCity}
                    onChange={(e) => (isProperty ? setPropCity(e.target.value) : setProjCity(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold opacity-80">Full Verified Postal Address</label>
                <input
                  type="text"
                  disabled={!canModify}
                  value={isProperty ? propAddress : projAddress}
                  onChange={(e) =>
                    isProperty ? setPropAddress(e.target.value) : setProjAddress(e.target.value)
                  }
                  placeholder="Street, Landmark, Near Metro Station, Pincode"
                  className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>MahaRERA Statutory Compliance & Authority Binding</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    Official Regulatory Verification
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">MahaRERA Registration Number *</label>
                    <input
                      type="text"
                      disabled={!canModify}
                      value={isProperty ? propReraNumber : projReraNumber}
                      onChange={(e) =>
                        isProperty ? setPropReraNumber(e.target.value) : setProjReraNumber(e.target.value)
                      }
                      placeholder="e.g. P52100028492"
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-mono uppercase font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">Target Possession Date</label>
                    <input
                      type="text"
                      disabled={!canModify}
                      value={isProperty ? propPossessionDate : projPossessionDate}
                      onChange={(e) =>
                        isProperty ? setPropPossessionDate(e.target.value) : setProjPossessionDate(e.target.value)
                      }
                      placeholder="e.g. December 2027 or Ready Possession"
                      className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Authority Portal Link (Fixed & Verified Working) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold opacity-80 flex items-center justify-between">
                    <span>MahaRERA Official Authority Portal Link *</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Government Verified URL</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      disabled={!canModify}
                      value={isProperty ? propAuthorityUrl : projAuthorityUrl}
                      onChange={(e) =>
                        isProperty ? setPropAuthorityUrl(e.target.value) : setProjAuthorityUrl(e.target.value)
                      }
                      placeholder="https://maharera.maharashtra.gov.in/projects-search-result"
                      className="flex-1 px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-xs font-mono focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                    <a
                      href={isProperty ? propAuthorityUrl : projAuthorityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
                      title="Test Official Authority Portal Link in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Portal</span>
                    </a>
                  </div>
                  <p className="text-[10px] opacity-60">
                    Direct government link to the project certificate on the official MahaRERA portal.
                  </p>
                </div>

                {/* Project-Specific QR Code Backend Provisioning & Scannable Preview */}
                <div className="p-3.5 rounded-xl bg-black/20 border border-current/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold">Statutory MahaRERA QR Code (Backend Governed)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">Backend Verified & Certified</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Live Scannable Preview Box */}
                    <div className="relative p-2.5 bg-white rounded-xl border-2 border-emerald-400/40 shadow-sm flex flex-col items-center flex-shrink-0">
                      <img
                        src={
                          (isProperty ? propQrCodeUrl : projQrCodeUrl) ||
                          getScannableQrUrl(isProperty ? propReraNumber : projReraNumber)
                        }
                        alt="MahaRERA Project QR Code"
                        className="w-24 h-24 object-contain"
                      />
                      <span className="mt-1 text-[9px] font-bold text-emerald-800 tracking-wider uppercase">
                        Scan-Ready
                      </span>
                    </div>

                    {/* Backend Provisioning Controls & Regulatory Status */}
                    <div className="flex-1 space-y-2.5 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={!canModify || isSyncingBackendQr}
                          onClick={() => handleSyncBackendQr(isProperty)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>
                            {isSyncingBackendQr
                              ? 'Provisioning from Backend...'
                              : 'Auto-Generate QR via Backend Engine'}
                          </span>
                        </button>

                        <label
                          className={`px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all ${
                            !canModify || isSyncingBackendQr ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Official QR File to Backend</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={!canModify || isSyncingBackendQr}
                            onChange={(e) => handleUploadQrFileToBackend(e, isProperty)}
                            className="hidden"
                          />
                        </label>

                        {(isProperty ? propQrCodeUrl : projQrCodeUrl) && (
                          <span className="text-[10px] px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Backend Synced
                          </span>
                        )}
                      </div>

                      {backendQrStatusMsg && (
                        <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/20">
                          {backendQrStatusMsg}
                        </div>
                      )}

                      <div className="text-[10px] opacity-70 leading-relaxed bg-black/30 p-2 rounded-lg border border-white/5">
                        <strong className="text-emerald-400">Statutory Compliance Note:</strong> Direct browser client-side QR uploading is disabled to prevent counterfeit certificates. The QR code is generated, verified, and bound directly through the backend regulatory engine.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: PRICING & FINANCIAL MATRIX                                 */}
          {/* ================================================================= */}
          {activeTab === 'PRICING' && (
            <div className="space-y-4">
              {isProperty ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold opacity-80">Base Agreement Value in INR (₹) *</label>
                    <input
                      type="number"
                      disabled={!canModify}
                      value={propBasePrice}
                      onChange={(e) => setPropBasePrice(e.target.value)}
                      placeholder="e.g. 32500000"
                      className="w-full px-4 py-3 rounded-xl border bg-current/5 border-current/15 text-lg font-mono font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      required
                    />
                    <div className="text-xs text-amber-400 font-bold flex items-center justify-between pt-1">
                      <span>Formatted Valuation: {formatINR(parseFloat(propBasePrice) || 0)}</span>
                      <span>
                        Rate/Sq.Ft: ~₹
                        {Math.round(
                          (parseFloat(propBasePrice) || 0) / (parseFloat(propCarpet) || 1)
                        ).toLocaleString('en-IN')}{' '}
                        / sq.ft
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="opacity-70 block">Estimated Stamp Duty (7%):</span>
                      <span className="font-mono font-bold">
                        {formatINR(Math.round((parseFloat(propBasePrice) || 0) * 0.07))}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-70 block">Statutory GST (0-5%):</span>
                      <span className="font-mono font-bold">
                        {propPossessionStatus === 'READY_POSSESSION'
                          ? '₹0 (OC Exempt)'
                          : formatINR(Math.round((parseFloat(propBasePrice) || 0) * 0.05))}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-70 block">Est. All-Inclusive Total:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {formatINR(
                          Math.round(
                            (parseFloat(propBasePrice) || 0) * 1.07 +
                              (propPossessionStatus === 'READY_POSSESSION'
                                ? 0
                                : (parseFloat(propBasePrice) || 0) * 0.05) +
                              430000
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* PROJECT PRICING */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Minimum Entry Price (₹)</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projMinPrice}
                        onChange={(e) => setProjMinPrice(e.target.value)}
                        placeholder="15000000"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-mono font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <div className="text-[11px] text-amber-400 font-mono">
                        {formatINR(parseFloat(projMinPrice) || 0)}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Maximum Penthouse Price (₹)</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projMaxPrice}
                        onChange={(e) => setProjMaxPrice(e.target.value)}
                        placeholder="45000000"
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-mono font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <div className="text-[11px] text-amber-400 font-mono">
                        {formatINR(parseFloat(projMaxPrice) || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Minimum Carpet Area (Sq.Ft)</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projMinCarpet}
                        onChange={(e) => setProjMinCarpet(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold opacity-80">Maximum Carpet Area (Sq.Ft)</label>
                      <input
                        type="number"
                        disabled={!canModify}
                        value={projMaxCarpet}
                        onChange={(e) => setProjMaxCarpet(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: MEDIA, IMAGES & AMENITIES                                 */}
          {/* ================================================================= */}
          {activeTab === 'MEDIA_AMENITIES' && (
            <div className="space-y-6">
              {/* 1. ACTUAL PROJECT BANNER / HERO PHOTO (Requirement: Project banner should be actual project photo) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold">
                      {isProperty ? 'Hero Cover Photo (Actual Property Photo)' : 'Official Project Banner (Actual Project Photo)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    Primary Display Banner
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative w-full sm:w-56 aspect-video rounded-xl overflow-hidden border border-amber-500/30 bg-black/40 flex-shrink-0">
                    <img
                      src={isProperty ? (propImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80') : (projBannerUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')}
                      alt="Project Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[9px] text-amber-300 font-mono font-bold">
                        Actual Project Elevation
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Actual Project Banner Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={!canModify}
                          onChange={(e) => {
                            if (isProperty) {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const r = new FileReader();
                              r.onload = (ev) => {
                                const url = ev.target?.result as string;
                                setPropImages([url, ...propImages.filter((_, idx) => idx !== 0)]);
                              };
                              r.readAsDataURL(file);
                            } else {
                              handleUploadBannerFile(e);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] opacity-70 block">Or Direct Banner Photo URL:</label>
                      <input
                        type="url"
                        disabled={!canModify}
                        value={isProperty ? (propImages[0] || '') : projBannerUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (isProperty) {
                            setPropImages([val, ...propImages.slice(1)]);
                          } else {
                            setProjBannerUrl(val);
                          }
                        }}
                        placeholder="Paste high-res actual project photography URL..."
                        className="w-full px-3 py-1.5 rounded-lg border bg-current/5 border-current/15 text-xs font-mono focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                    </div>
                    <p className="text-[10px] opacity-60">
                      Real project photography captured on-site or high-fidelity architectural rendering.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. ARCHITECTURAL FLOOR PLAN & PROJECT PLAN UPLOADS (Requirement: option to upload floor plan and project plan) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Floor Plan Upload Card */}
                <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold">Architectural Floor Plan</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Unit Blueprint</span>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden border border-current/15 bg-black/40 flex items-center justify-center">
                    {(isProperty ? propFloorPlanUrl : projFloorPlanUrl) ? (
                      <img
                        src={isProperty ? propFloorPlanUrl : projFloorPlanUrl}
                        alt="Floor Plan Blueprint"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-3 opacity-50">
                        <FileText className="w-8 h-8 mx-auto mb-1 opacity-40" />
                        <span className="text-[11px] block">No Floor Plan Uploaded Yet</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="w-full px-4 py-2 rounded-xl bg-current/10 hover:bg-current/15 text-current text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-current/10 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload Floor Plan (Image / Layout)</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!canModify}
                        onChange={(e) => handleUploadFloorPlanFile(e, isProperty)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      disabled={!canModify}
                      value={isProperty ? propFloorPlanUrl : projFloorPlanUrl}
                      onChange={(e) =>
                        isProperty ? setPropFloorPlanUrl(e.target.value) : setProjFloorPlanUrl(e.target.value)
                      }
                      placeholder="Or paste Floor Plan blueprint image URL..."
                      className="w-full px-3 py-1.5 rounded-lg border bg-current/5 border-current/15 text-xs font-mono focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Project Master Plan Upload Card */}
                <div className="p-4 rounded-2xl bg-current/5 border border-current/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold">Project Master Township Plan</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">Site Layout</span>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden border border-current/15 bg-black/40 flex items-center justify-center">
                    {projMasterPlanUrl ? (
                      <img
                        src={projMasterPlanUrl}
                        alt="Project Master Layout"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-3 opacity-50">
                        <MapPin className="w-8 h-8 mx-auto mb-1 opacity-40" />
                        <span className="text-[11px] block">No Project Plan Uploaded Yet</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="w-full px-4 py-2 rounded-xl bg-current/10 hover:bg-current/15 text-current text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-current/10 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload Project Plan (Master Site Layout)</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!canModify}
                        onChange={handleUploadMasterPlanFile}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      disabled={!canModify}
                      value={projMasterPlanUrl}
                      onChange={(e) => setProjMasterPlanUrl(e.target.value)}
                      placeholder="Or paste Project Master Plan image URL..."
                      className="w-full px-3 py-1.5 rounded-lg border bg-current/5 border-current/15 text-xs font-mono focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* 3. ADDITIONAL MEDIA GALLERY */}
              <div className="space-y-3">
                <label className="text-xs font-bold opacity-80 block">Additional Gallery & Architecture Photography</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    disabled={!canModify}
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste high-res image URL (Unsplash or CDN link)..."
                    className="flex-1 px-4 py-2 rounded-xl border bg-current/5 border-current/15 text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    disabled={!canModify || !newImageUrl.trim()}
                    onClick={handleAddImage}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(isProperty ? propImages : projImages).map((url, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-current/10 aspect-video bg-black/40">
                      <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      {canModify && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] bg-black/70 text-white font-mono">
                        {i === 0 ? 'Cover Hero' : `Shot ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities & Lifestyle Features Selector (Manual or By Tick) */}
              <AmenitySelector
                title="Amenities & Lifestyle Features"
                selectedAmenities={isProperty ? propSelectedAmenities : projSelectedAmenities}
                onChange={(newAmenities) => {
                  if (isProperty) {
                    setPropSelectedAmenities(newAmenities);
                  } else {
                    setProjSelectedAmenities(newAmenities);
                  }
                }}
                disabled={!canModify}
                theme={theme}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: PRE-LEASED & INSTITUTIONAL INVESTMENT DATA                */}
          {/* ================================================================= */}
          {activeTab === 'PRE_LEASE' && isProperty && (
            <PropertyPreLeaseTab
              canModify={canModify}
              data={preLeasedState}
              onChange={(updated) => setPreLeasedState(updated)}
            />
          )}

          {/* ================================================================= */}
          {/* TAB 6: CREATOR ATTRIBUTION & RBAC OWNERSHIP                       */}
          {/* ================================================================= */}
          {activeTab === 'CREATOR' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold">Ownership & Respective Creator Binding</h4>
                    <p className="text-[11px] opacity-70">
                      Modifications and deletions are strictly permission-gated to the author who added this listing or the Super Admin.
                    </p>
                  </div>
                </div>

                {creatorBadge && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Original Creator On Record</span>
                    <div className="font-bold">{creatorBadge.name} ({creatorBadge.email})</div>
                    <div className="text-[11px] opacity-70 font-mono">Role: {creatorBadge.role || 'VERIFIED_OWNER'} • Phone: {creatorBadge.phone || 'N/A'}</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold opacity-80">Author / Contributor Full Name</label>
                  <input
                    type="text"
                    disabled={!canModify}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Kiaan Sales Leadership or Owner Name"
                    className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold opacity-80">Author Email Address (Permission Key) *</label>
                  <input
                    type="email"
                    disabled={!canModify}
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="e.g. sales@kiaanproperties.in"
                    className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold opacity-80">Contact Phone Number</label>
                <input
                  type="tel"
                  disabled={!canModify}
                  value={authorPhone}
                  onChange={(e) => setAuthorPhone(e.target.value)}
                  placeholder="+91 98230 11000"
                  className="w-full px-4 py-2.5 rounded-xl border bg-current/5 border-current/15 text-sm font-mono focus:outline-none focus:border-amber-500 disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-current/10 flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-current/20 hover:bg-current/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              {isEdit && canModify && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-400 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </button>
              )}

              {canModify && (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Save Changes' : `Publish ${isProperty ? 'Property' : 'Project'}`}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* 29-SECTION MASTER SCHEMA PROGRESSIVE DISCLOSURE WIZARD */}
      {showMasterSchemaWizard && (
        <ResidentialProjectSchemaWizard
          initialProject={initialProject}
          initialData={customSchemaData || undefined}
          theme={theme}
          onSave={handleMasterWizardSave}
          onCancel={() => setShowMasterSchemaWizard(false)}
        />
      )}

      {/* 10-STAGE UNIVERSAL PROPERTY LISTING SCHEMA WIZARD */}
      {showUniversalWizard && (
        <UniversalPropertyListingFormModal
          isOpen={showUniversalWizard}
          onClose={() => setShowUniversalWizard(false)}
          theme={theme}
          onSuccessPublished={() => {
            setShowUniversalWizard(false);
            if (onSuccess) onSuccess(initialProperty || ({} as any), 'CREATED');
            onClose();
          }}
        />
      )}
    </div>
  );
};
