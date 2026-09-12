/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  Image as ImageIcon,
  FileText,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Building2,
  Home,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Phone,
  Video,
  Play,
  RotateCcw,
  Check,
  Eye,
  Clock,
  Sparkle,
  Upload,
  Copy,
  QrCode,
  UserCheck,
  Search,
  Database,
  RefreshCw,
  SlidersHorizontal,
  Info,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import {
  WhatsAppChatMessage,
  WhatsAppPropertyDraft,
  WhatsAppProjectDraft,
  WhatsAppIntent,
  ReraGateStatus,
  WhatsAppMediaItem,
  WhatsAppVoiceItem,
  UnitDraftItem,
  BulkInventorySummary,
  DuplicateDetectionMatch,
  ContributorVerificationRecord,
  CrmOutboundEvent,
} from '../types/whatsappOnboarding';
import {
  parseNaturalLanguagePropertyText,
  normalizeIndianPrice,
  classifyWhatsAppIntent,
  parseWhatsAppUnitListing,
  parseBulkInventoryCsv,
  findPotentialDuplicates,
  generateMinimalMissingQuestions,
  generateSecureOnboardingToken,
  dispatchCrmEvent,
  getCrmOutboundEvents,
  getOrCreateContributor,
  sendContributorOtp,
  verifyContributorOtp,
  analyzeImageMedia,
  transcribeWhatsAppVoiceNote,
  evaluateReraGate,
  globalWhatsAppEngine,
  PUNE_MICRO_MARKETS,
} from '../services/whatsappOnboardingEngine';
import { globalKiaanStore } from '../services/store';
import { Project, Property } from '../types';

interface WhatsAppOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'PROPERTY' | 'PROJECT' | 'COMMERCIAL';
  theme?: 'dark' | 'light';
  onPropertyPublished?: (property: Property) => void;
  onProjectPublished?: (project: Project) => void;
}

export const WhatsAppOnboardingModal: React.FC<WhatsAppOnboardingModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'PROPERTY',
  theme = 'dark',
  onPropertyPublished,
  onProjectPublished,
}) => {
  const isDark = theme === 'dark';
  const [activeFlow, setActiveFlow] = useState<'PROPERTY' | 'PROJECT'>(
    initialMode === 'PROJECT' ? 'PROJECT' : 'PROPERTY'
  );
  const [activeViewTab, setActiveViewTab] = useState<
    'CHAT' | 'DRAFT_CONFIRMATION' | 'DUPLICATES_AUDIT' | 'BULK_INVENTORY' | 'ADMIN_REVIEW' | 'RERA_GATE' | 'CRM_EVENTS'
  >('CHAT');

  // Active Drafts
  const [propertyDraft, setPropertyDraft] = useState<WhatsAppPropertyDraft>(() => {
    const existing = globalWhatsAppEngine.getPropertyDrafts();
    return (
      existing[0] || {
        id: `wa-prop-${Date.now()}`,
        sourceChannel: 'WHATSAPP',
        onboardingType: 'PROPERTY',
        status: 'DRAFT',
        reviewStatus: 'PENDING_REVIEW',
        marketingStatus: 'RESALE',
        transactionStatus: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contributor: {
          id: 'contrib-demo',
          name: 'Rajesh Vikram Malhotra',
          mobile: '+91 98230 45678',
          whatsappId: 'wa-919823045678',
          trustLevel: 'TRUSTED_PARTNER',
          isMobileVerified: true,
          isEmailVerified: true,
          verificationMethod: 'WHATSAPP_OTP',
        },
        contactNumber: '+91 98230 45678',
        ownerOrAgentName: 'Rajesh Vikram Malhotra',
        propertyType: 'APARTMENT',
        listingIntent: 'RESALE',
        title: 'New Luxury 3 BHK Residence in Wakad',
        configuration: '3 BHK',
        carpetAreaSqFt: 1250,
        askingPriceINR: 14500000,
        askingPriceFormatted: '₹1.45 Cr',
        priceAudit: {
          rawInput: '1.45 Cr',
          canonicalINR: 14500000,
          formattedDisplay: '₹1.45 Cr',
          pricePerSqFt: 11600,
          normalizationConfidence: 98,
          originalCurrency: 'INR',
          isNegotiable: false,
        },
        floorNumber: 12,
        totalFloors: 24,
        facing: 'East',
        parkingSpaces: 2,
        ownershipType: 'FREEHOLD',
        availabilityStatus: 'IMMEDIATE',
        location: {
          id: 'loc-wakad',
          address: 'Datta Mandir Road, Wakad, Pune',
          microMarket: 'Wakad',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411057',
          coordinates: { lat: 18.5987, lng: 73.7684 },
          googleMapsUrl: 'https://maps.google.com/?q=18.5987,73.7684',
          landmarks: PUNE_MICRO_MARKETS.Wakad.landmarks,
        },
        buildingOrSocietyName: 'Palazzo Crest Wakad',
        hasReraCertificate: true,
        reraNumber: 'P52100030124',
        reraStatus: 'RERA_VERIFIED',
        media: [],
        missingMandatoryFields: [],
        completenessPercent: 100,
        duplicateMatches: [],
        secureToken: generateSecureOnboardingToken('wa-prop-demo', 'PROPERTY'),
        adminReviewNotes: '',
      }
    );
  });

  const [projectDraft, setProjectDraft] = useState<WhatsAppProjectDraft>(() => {
    const existing = globalWhatsAppEngine.getProjectDrafts();
    return (
      existing[0] || {
        id: `wa-proj-${Date.now()}`,
        sourceChannel: 'WHATSAPP',
        onboardingType: 'PROJECT',
        status: 'UNDER_REVIEW',
        reviewStatus: 'PENDING_REVIEW',
        marketingStatus: 'NEW',
        transactionStatus: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contributor: {
          id: 'contrib-vanguard',
          name: 'Vanguard Realty Developers',
          mobile: '+91 99220 12345',
          whatsappId: 'wa-919922012345',
          trustLevel: 'TRUSTED_PARTNER',
          isMobileVerified: true,
          isEmailVerified: true,
          verificationMethod: 'PARTNER_TOKEN',
        },
        developerOrPromoterName: 'Vanguard Realty Partners',
        projectName: 'Kiaan Solis Skyline',
        tagline: 'Ultra-Luxury 3 & 4 BHK Sky Residences in Baner',
        projectType: 'LUXURY_ESTATE',
        jurisdiction: 'MAHARERA',
        reraNumber: 'P52100028492',
        reraGateStatus: 'RERA_VERIFIED',
        reraGateDetails: {
          hasValidRegistrationFormat: true,
          hasOfficialQrCode: true,
          hasTitleSearchCertificate: true,
          hasDedicatedEscrow: true,
          officialAuthority: 'Maharashtra Real Estate Regulatory Authority (MahaRERA)',
          verifiedOnMahaReraPortal: true,
        },
        location: {
          id: 'loc-baner-1',
          address: 'Pan Card Club Road, Baner Hills, Pune',
          microMarket: 'Baner',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411045',
          coordinates: { lat: 18.559, lng: 73.7868 },
          landmarks: PUNE_MICRO_MARKETS.Baner.landmarks,
        },
        configurations: ['3 BHK Sky Home', '4 BHK Grand Villa'],
        priceRangeDisplay: '₹1.85 Cr - ₹4.20 Cr',
        priceMinINR: 18500000,
        priceMaxINR: 42000000,
        carpetAreaMinSqFt: 1450,
        carpetAreaMaxSqFt: 3100,
        totalLandAcres: 4.5,
        totalTowersCount: 3,
        totalUnitsCount: 180,
        units: [],
        possessionDate: 'December 2027',
        projectStatus: 'UNDER_CONSTRUCTION',
        amenities: ['Heated Infinity Sky Pool', 'Private Clubhouse', 'EV Stations'],
        media: [],
        missingMandatoryFields: [],
        completenessPercent: 100,
        canPublish: true,
        secureToken: generateSecureOnboardingToken('wa-proj-demo', 'PROJECT'),
      }
    );
  });

  // Chat message state
  const [messages, setMessages] = useState<WhatsAppChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voicePlayingId, setVoicePlayingId] = useState<string | null>(null);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpStatusMsg, setOtpStatusMsg] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Bulk Inventory state
  const [bulkCsvText, setBulkCsvText] = useState(
    `Tower,Unit,Floor,Config,CarpetSqFt,Price,Facing,Status\nTower A,1201,12,3 BHK,1250,1.45 Cr,East,AVAILABLE\nTower A,1202,12,3 BHK,1280,1.50 Cr,North-East,AVAILABLE\nTower A,1401,14,4 BHK,2100,2.65 Cr,East,AVAILABLE\nTower B,801,8,2 BHK,850,95 Lakhs,West,AVAILABLE\nTower B,802,8,2 BHK,870,98 Lakhs,East,AVAILABLE`
  );
  const [bulkSummary, setBulkSummary] = useState<BulkInventorySummary | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      const welcome: WhatsAppChatMessage = {
        id: 'msg-welcome',
        sender: 'KIAAN_BOT',
        timestamp: 'Just now',
        type: 'TEXT',
        text: `Welcome to Kiaan Properties Assisted WhatsApp Onboarding. 🏛️\n\nI will help you add a Property, Project, Units, Rental, or Commercial asset directly without filling lengthy forms.\n\nYou can send natural text, voice notes (Hindi/Hinglish/English), photos, floor plans, RERA PDFs, or Excel unit inventory sheets.`,
        buttons: [
          { id: 'btn-1', label: '1. Add Resale / Rental Property', intent: 'ADD_PROPERTY' },
          { id: 'btn-2', label: '2. Add Master Project (Developer)', intent: 'ADD_PROJECT' },
          { id: 'btn-3', label: '3. Bulk Unit Inventory (Tower A 1201, 1202...)', intent: 'ADD_MULTIPLE_UNITS' },
          { id: 'btn-4', label: '4. Commercial Office / Pre-Lease', intent: 'ADD_COMMERCIAL' },
        ],
      };
      setMessages([welcome]);
    }
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // Real WhatsApp Deep Link Generator
  const getWhatsAppDeepLink = (textMsg: string) => {
    const encoded = encodeURIComponent(textMsg);
    return `https://wa.me/917796655556?text=${encoded}`;
  };

  // Bot response simulator
  const handleUserSendMessage = (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    // Item 31: Classify user intent & detect customer vs contributor
    const classification = classifyWhatsAppIntent(textToSend);

    const userMsg: WhatsAppChatMessage = {
      id: `msg-u-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'TEXT',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      processInboundMessage(textToSend, classification);
      setIsTyping(false);
    }, 900);
  };

  // Natural language message processor
  const processInboundMessage = (text: string, classification: ReturnType<typeof classifyWhatsAppIntent>) => {
    // Check if user is sending unit listing (Item 17)
    if (text.toLowerCase().includes('tower') || text.match(/\b\d{3,4}\b.*(?:bhk|carpet)/i)) {
      const parsedUnits = parseWhatsAppUnitListing(text);
      if (parsedUnits.length > 0) {
        setProjectDraft((prev) => ({
          ...prev,
          units: [...(prev.units || []), ...parsedUnits],
          totalUnitsCount: (prev.units?.length || 0) + parsedUnits.length,
        }));

        const botResponse: WhatsAppChatMessage = {
          id: `msg-b-units-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'KIAAN_BOT',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'TEXT',
          text: `🏢 **Multi-Unit Inventory Parsed (${parsedUnits.length} Units Structured):**\n\n${parsedUnits
            .map(
              (u) =>
                `• **Unit ${u.unitNumber} (${u.tower}):** ${u.configuration} • ${u.carpetAreaSqFt} sq.ft carpet • ₹${(
                  u.askingPriceINR / 10000000
                ).toFixed(2)} Cr (${u.facing} facing)`
            )
            .join('\n')}\n\nAll unit drafts have been populated into the Master Project Draft.`,
        };
        setMessages((prev) => [...prev, botResponse]);
        return;
      }
    }

    if (activeFlow === 'PROPERTY') {
      const parsed = parseNaturalLanguagePropertyText(text);

      const priceAudit = normalizeIndianPrice(text, parsed.carpetAreaSqFt || propertyDraft.carpetAreaSqFt);

      const updatedDraft: WhatsAppPropertyDraft = {
        ...propertyDraft,
        configuration: parsed.configuration || propertyDraft.configuration || '3 BHK',
        carpetAreaSqFt: parsed.carpetAreaSqFt || propertyDraft.carpetAreaSqFt || 1250,
        askingPriceINR: priceAudit.canonicalINR > 0 ? priceAudit.canonicalINR : propertyDraft.askingPriceINR || 14500000,
        askingPriceFormatted: priceAudit.formattedDisplay || propertyDraft.askingPriceFormatted || '₹1.45 Cr',
        priceAudit,
        floorNumber: parsed.floorNumber || propertyDraft.floorNumber || 12,
        facing: parsed.facing || propertyDraft.facing || 'East',
        availabilityStatus: parsed.availability || propertyDraft.availabilityStatus || 'IMMEDIATE',
        title: `${parsed.configuration || propertyDraft.configuration || '3 BHK'} in ${
          parsed.location || propertyDraft.location.microMarket || 'Wakad'
        }, Pune`,
      };

      if (parsed.location && PUNE_MICRO_MARKETS[parsed.location]) {
        const market = PUNE_MICRO_MARKETS[parsed.location];
        updatedDraft.location = {
          id: `loc-${parsed.location.toLowerCase()}`,
          address: `${parsed.location}, Pune`,
          microMarket: parsed.location,
          city: market.city,
          state: market.state,
          pincode: market.pincode,
          coordinates: { lat: market.lat, lng: market.lng },
          googleMapsUrl: `https://maps.google.com/?q=${market.lat},${market.lng}`,
          landmarks: market.landmarks,
        };
      }

      const saved = globalWhatsAppEngine.savePropertyDraft(updatedDraft);
      setPropertyDraft(saved);

      // Duplicate Check (Item 21)
      const duplicateAlert =
        saved.duplicateMatches && saved.duplicateMatches.length > 0
          ? `\n\n⚠️ **Duplicate Detection Notice:** Found similar asset "${saved.duplicateMatches[0].matchTitle}" (${saved.duplicateMatches[0].confidenceScore}% match score). Our compliance desk will cross-audit during review.`
          : '';

      // Bot structured response with Confirmation Card (Item 18)
      const botResponse: WhatsAppChatMessage = {
        id: `msg-b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'KIAAN_BOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'TEXT',
        text: `✨ **KIAAN PROPERTY DRAFT (Item 18 Confirmation Preview):**\n\n🏢 **${saved.title}**\n📍 ${saved.location.microMarket}, Pune\n\n• **Price (Normalized):** ${saved.askingPriceFormatted} (Raw input: "${priceAudit.rawInput}")\n• **Carpet Area:** ${saved.carpetAreaSqFt} sq.ft carpet\n• **Rate:** ₹${priceAudit.pricePerSqFt.toLocaleString('en-IN')}/sq.ft\n• **Floor:** ${saved.floorNumber}th Floor (${saved.facing} Facing)\n• **Photos Attached:** ${saved.media.length}\n• **Status:** ${saved.marketingStatus} (${saved.transactionStatus})\n• **Contributor:** ${saved.contributor?.name} [${saved.contributor?.trustLevel}]${duplicateAlert}\n\n*Never silently published: This draft will undergo administrative title review prior to public broadcast.*`,
        buttons: [
          { id: 'btn-confirm', label: '✅ Submit Draft for Review', intent: 'ADD_PROPERTY' },
          { id: 'btn-view-inspector', label: '🔍 Open Draft Inspector', intent: 'UPDATE_LISTING' },
          { id: 'btn-add-photos', label: '📸 Upload Photos / Floor Plan', intent: 'ADD_PROPERTY' },
        ],
      };
      setMessages((prev) => [...prev, botResponse]);
    } else {
      // PROJECT FLOW
      const reraMatch = text.match(/\b(P[0-9]{11}|P5[0-9]{10})\b/i);
      let reraNum = projectDraft.reraNumber;
      if (reraMatch) reraNum = reraMatch[1].toUpperCase();

      const updatedProject: WhatsAppProjectDraft = {
        ...projectDraft,
        projectName: projectDraft.projectName || 'Kiaan Solis Skyline',
        developerOrPromoterName: projectDraft.developerOrPromoterName || 'Vanguard Realty Partners',
        reraNumber: reraNum || 'P52100028492',
        priceRangeDisplay: '₹1.85 Cr - ₹4.20 Cr',
        priceMinINR: 18500000,
        priceMaxINR: 42000000,
        configurations: ['3 BHK Sky Home', '4 BHK Grand Villa'],
      };

      const savedProj = globalWhatsAppEngine.saveProjectDraft(updatedProject);
      setProjectDraft(savedProj);

      const botResponse: WhatsAppChatMessage = {
        id: `msg-b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'KIAAN_BOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'TEXT',
        text: `🏛️ **Master Development Project Identified:**\n\n• **Project Name:** ${savedProj.projectName}\n• **Developer:** ${savedProj.developerOrPromoterName}\n• **MahaRERA Reg No:** ${savedProj.reraNumber}\n• **RERA Gate Status:** ${
          savedProj.reraGateStatus === 'RERA_VERIFIED' ? '✅ RERA VERIFIED' : '⚠️ RERA PENDING AUDIT'
        }\n• **Pricing Range:** ${savedProj.priceRangeDisplay}\n• **Units Onboarded:** ${savedProj.units?.length || 0} Units\n\nYou can upload Master Plan PDF, architectural renders, or unit inventory CSV.`,
      };
      setMessages((prev) => [...prev, botResponse]);
    }
  };

  // Voice note simulator
  const handleSimulateVoiceNote = (type: 'hinglish_resale' | 'hindi_project' | 'english_lease') => {
    const voiceItem = transcribeWhatsAppVoiceNote(type);

    const userMsg: WhatsAppChatMessage = {
      id: `msg-v-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'VOICE',
      voice: voiceItem,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      // Auto parse structured fields from voice
      if (voiceItem.structuredConfirmation.configuration) {
        setPropertyDraft((prev) => ({
          ...prev,
          configuration: voiceItem.structuredConfirmation.configuration || prev.configuration,
          carpetAreaSqFt: voiceItem.structuredConfirmation.carpetAreaSqFt || prev.carpetAreaSqFt,
          askingPriceINR: voiceItem.structuredConfirmation.priceINR || prev.askingPriceINR,
          askingPriceFormatted: voiceItem.structuredConfirmation.priceFormatted || prev.askingPriceFormatted,
          facing: voiceItem.structuredConfirmation.facing || prev.facing,
          floorNumber: voiceItem.structuredConfirmation.floor || prev.floorNumber,
        }));
      }

      const botConfirm: WhatsAppChatMessage = {
        id: `msg-b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'KIAAN_BOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'TEXT',
        text: `🎙️ **Voice Speech Transcribed (${voiceItem.detectedLanguage} • ${voiceItem.confidencePercent}% confidence):**\n\n"${voiceItem.rawTranscript}"\n\n**I understood this as:**\n• **Configuration:** ${voiceItem.structuredConfirmation.configuration || '3 BHK'}\n• **Location:** ${voiceItem.structuredConfirmation.location || 'Wakad, Pune'}\n• **Carpet Area:** ${voiceItem.structuredConfirmation.carpetAreaSqFt?.toLocaleString('en-IN')} sq.ft carpet\n• **Price:** ${voiceItem.structuredConfirmation.priceFormatted}\n• **Floor & Facing:** Floor ${voiceItem.structuredConfirmation.floor}, ${voiceItem.structuredConfirmation.facing} Facing\n\nIs this information accurate?`,
        buttons: [
          { id: 'v-yes', label: '✅ Yes, Details are Correct', intent: 'ADD_PROPERTY' },
          { id: 'v-edit', label: '✏️ Correct Information', intent: 'UPDATE_LISTING' },
        ],
      };
      setMessages((prev) => [...prev, botConfirm]);
      setIsTyping(false);
    }, 1100);
  };

  // Photo upload & AI classification simulator
  const handleSimulatePhotoUpload = (sampleRoom: 'LIVING' | 'BEDROOM' | 'BALCONY' | 'EXTERIOR') => {
    const urls: Record<string, { name: string; url: string }> = {
      LIVING: {
        name: 'Living_Room_East_Balcony_4K.jpg',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      },
      BEDROOM: {
        name: 'Master_Bedroom_Suite.jpg',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      },
      BALCONY: {
        name: 'Skyline_Deck_Sunset_View.jpg',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      },
      EXTERIOR: {
        name: 'Building_Elevation_Facade.jpg',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      },
    };

    const target = urls[sampleRoom];
    const quality = analyzeImageMedia(target);

    const mediaItem: WhatsAppMediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'IMAGE',
      url: target.url,
      originalFileName: target.name,
      fileSizeMb: 4.8,
      uploadedAt: new Date().toISOString(),
      qualityAnalysis: quality,
    };

    const userMsg: WhatsAppChatMessage = {
      id: `msg-m-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'IMAGE',
      media: mediaItem,
      text: `Sent photo: ${target.name}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Add to draft media
    setPropertyDraft((prev) => ({
      ...prev,
      media: [...prev.media, mediaItem],
    }));

    setTimeout(() => {
      const botMsg: WhatsAppChatMessage = {
        id: `msg-b-vision-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'KIAAN_BOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'TEXT',
        text: `📸 **AI Computer Vision Tagging Complete:**\n\n• **Detected Room:** ${quality.suggestedCategory.replace('_', ' ')} (${quality.confidenceScore}% confidence)\n• **Clarity Score:** ${quality.clarityScore}/100 • ${quality.resolutionText}\n• **Lighting Quality:** ${quality.lightingScore}/100 (Optimal Natural Daylight)\n• **Duplicate Check:** Pass (Unique High-Res Original)\n• **Suitability:** ${quality.isHighQuality ? '✅ Approved for Luxury Portfolio Dossier' : '⚠️ Quality Warning'}\n\n*Transparency note: AI classification is verified by statutory guidelines before final publishing.*`,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  // PDF Document Simulator
  const handleSimulateDocumentUpload = () => {
    const mediaItem: WhatsAppMediaItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'DOCUMENT',
      url: 'https://example.com/maharera-sanction-certificate.pdf',
      originalFileName: 'MahaRERA_Registration_Certificate_P52100028492.pdf',
      fileSizeMb: 2.4,
      uploadedAt: new Date().toISOString(),
      documentExtractionStatus: 'PARSED_UNVERIFIED',
      extractedInfo: {
        reraNumber: 'P52100028492',
        promoter: 'Vanguard Realty Partners',
        completionDate: '31/12/2027',
        escrowBank: 'HDFC Bank Ltd, Baner Branch (A/C: 50200049182390)',
      },
    };

    const userMsg: WhatsAppChatMessage = {
      id: `msg-doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'DOCUMENT',
      media: mediaItem,
      text: 'Attached official MahaRERA project sanction certificate PDF.',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setProjectDraft((prev) => ({
        ...prev,
        reraNumber: 'P52100028492',
        reraGateStatus: 'RERA_VERIFIED',
      }));

      const botMsg: WhatsAppChatMessage = {
        id: `msg-b-doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'KIAAN_BOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'TEXT',
        text: `📑 **Document Parsed by AI Extractor:**\n\n• **Document Type:** Official MahaRERA Project Registration Certificate\n• **Registration Number:** **P52100028492**\n• **Official Promoter:** Vanguard Realty Partners\n• **Escrow Account:** HDFC Bank Dedicated Project Escrow\n• **Status:** ✅ **RERA VERIFIED** (Validated against Maharashtra Regulatory Database)\n\n*Extracted document parameters are cross-audited against statutory records.*`,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1100);
  };

  // OTP Verification Simulator (Item 19)
  const handleSendOtp = () => {
    const res = sendContributorOtp(propertyDraft.contactNumber);
    setOtpStatusMsg(res.message);
  };

  const handleVerifyOtp = () => {
    const res = verifyContributorOtp(propertyDraft.contactNumber, otpInput);
    if (res.success && res.contributor) {
      setPropertyDraft((prev) => ({
        ...prev,
        contributor: res.contributor,
      }));
      setOtpStatusMsg('✅ Contributor mobile verified successfully! Trust Level elevated to VERIFIED.');
      setTimeout(() => setIsOtpModalOpen(false), 1200);
    } else {
      setOtpStatusMsg(`❌ ${res.error || 'Invalid OTP'}`);
    }
  };

  // Bulk Inventory Parser Trigger (Item 34)
  const handleParseBulkCsv = () => {
    const summary = parseBulkInventoryCsv(bulkCsvText);
    setBulkSummary(summary);
  };

  const handleMergeBulkInventory = () => {
    if (!bulkSummary) return;
    const res = globalWhatsAppEngine.attachBulkInventoryToProject(projectDraft.id, bulkSummary);
    if (res.success) {
      setProjectDraft((prev) => ({
        ...prev,
        units: [...(prev.units || []), ...bulkSummary.unitDrafts.filter((u) => u.isValid)],
        totalUnitsCount: (prev.units?.length || 0) + res.addedCount,
        bulkInventorySummary: bulkSummary,
      }));
      setPublishSuccessMessage(`Merged ${res.addedCount} verified units into ${projectDraft.projectName}!`);
    }
  };

  // Admin Review Action Handler (Item 22)
  const handleAdminAction = (action: 'APPROVE' | 'REQUEST_INFORMATION' | 'REJECT' | 'PUBLISH') => {
    if (activeFlow === 'PROPERTY') {
      const res = globalWhatsAppEngine.performAdminReviewAction(
        propertyDraft.id,
        'PROPERTY',
        action,
        adminNoteInput || `Admin action ${action} executed.`,
        'Kiaan Statutory Compliance Desk'
      );
      if (res.success) {
        const updated = globalWhatsAppEngine.getPropertyDraft(propertyDraft.id);
        if (updated) setPropertyDraft({ ...updated });
        setPublishSuccessMessage(res.message);
        if (action === 'PUBLISH' && onPropertyPublished) {
          const pub = globalKiaanStore.getPropertyById(propertyDraft.publishedAssetId || '');
          if (pub) onPropertyPublished(pub);
        }
      }
    } else {
      const res = globalWhatsAppEngine.performAdminReviewAction(
        projectDraft.id,
        'PROJECT',
        action,
        adminNoteInput || `Admin action ${action} executed.`,
        'Kiaan Statutory Compliance Desk'
      );
      if (res.success) {
        const updated = globalWhatsAppEngine.getProjectDraft(projectDraft.id);
        if (updated) setProjectDraft({ ...updated });
        setPublishSuccessMessage(res.message);
        if (action === 'PUBLISH' && onProjectPublished) {
          const pubProj = globalKiaanStore.getProjectById(projectDraft.publishedProjectId || '');
          if (pubProj) onProjectPublished(pubProj);
        }
      }
    }
  };

  // Missing Info Request via WhatsApp (Item 23)
  const handleRequestMissingInfo = (fieldKey: string, question: string) => {
    const res = globalWhatsAppEngine.requestMissingInfoViaWhatsApp(
      activeFlow === 'PROPERTY' ? propertyDraft.id : projectDraft.id,
      activeFlow,
      fieldKey,
      question
    );
    if (res.success) {
      const botMsg: WhatsAppChatMessage = {
        id: `msg-req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'KIAAN_BOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'TEXT',
        text: res.outboundMessage,
      };
      setMessages((prev) => [...prev, botMsg]);
      setActiveViewTab('CHAT');
    }
  };

  const missingQuestions = generateMinimalMissingQuestions(activeFlow === 'PROPERTY' ? propertyDraft : projectDraft);
  const crmEvents = getCrmOutboundEvents();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-6xl h-[92vh] max-h-[920px] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all ${
          isDark
            ? 'bg-[#090E18] border-amber-500/30 text-white shadow-black/80'
            : 'bg-slate-50 border-slate-300 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-current/10 bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
              <Phone className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-serif font-bold tracking-tight">
                  Kiaan WhatsApp Assisted Onboarding Desk
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Enterprise Inbound Pipeline
                </span>
              </div>
              <p className="text-[11px] opacity-70">
                Natural Language • Voice Notes • MahaRERA Validation • Duplicate Guard • Enterprise CRM Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real WhatsApp Direct Trigger */}
            <a
              href={getWhatsAppDeepLink(
                activeFlow === 'PROPERTY'
                  ? 'Hi Kiaan, I want to list my property for resale/rent.'
                  : 'Hi Kiaan, I want to onboard our developer master project.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              title="Open Live WhatsApp Chat (+91 77966 55556)"
            >
              <span>WhatsApp +91 77966 55556</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-current/10 opacity-70 hover:opacity-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 border-b border-current/10 bg-black/10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold opacity-60 uppercase tracking-wider">Asset Scope:</span>
            <button
              onClick={() => setActiveFlow('PROPERTY')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFlow === 'PROPERTY'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-white/80'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              Residential Property / Resale / Rent
            </button>
            <button
              onClick={() => setActiveFlow('PROJECT')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFlow === 'PROJECT'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-white/80'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              Master Project / Developer Onboarding
            </button>
          </div>

          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveViewTab('CHAT')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'CHAT' ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Live WhatsApp
            </button>
            <button
              onClick={() => setActiveViewTab('DRAFT_CONFIRMATION')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'DRAFT_CONFIRMATION'
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Draft Confirmation
            </button>
            <button
              onClick={() => setActiveViewTab('DUPLICATES_AUDIT')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeViewTab === 'DUPLICATES_AUDIT'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span>Duplicate Guard</span>
              {(propertyDraft.duplicateMatches?.length || 0) > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveViewTab('BULK_INVENTORY')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'BULK_INVENTORY'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Bulk Units (Excel/CSV)
            </button>
            <button
              onClick={() => setActiveViewTab('ADMIN_REVIEW')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'ADMIN_REVIEW'
                  ? 'bg-amber-600 text-black font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Admin Review Desk
            </button>
            <button
              onClick={() => setActiveViewTab('RERA_GATE')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'RERA_GATE'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              RERA Gate
            </button>
            <button
              onClick={() => setActiveViewTab('CRM_EVENTS')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewTab === 'CRM_EVENTS'
                  ? 'bg-slate-700 text-white font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              CRM Bus
            </button>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: WhatsApp Chat Stream (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-r border-current/10 bg-[#060A10]/50">
            {/* Quick Simulation Action Bar */}
            <div className="p-2.5 border-b border-current/10 bg-black/20 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Simulate:</span>
                <button
                  onClick={() =>
                    handleUserSendMessage('3 BHK in Wakad, 1250 carpet, 1.45 crore, 12th floor, east facing. Available immediately.')
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium border border-white/10 shrink-0 cursor-pointer"
                >
                  💬 Resale Text
                </button>
                <button
                  onClick={() =>
                    handleUserSendMessage(
                      'Tower A has 1201, 1202, 1203 available. 1201 is 2 BHK 850 carpet, 1202 is 2 BHK 870 carpet at 95 Lakhs.'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-medium border border-blue-500/30 shrink-0 cursor-pointer"
                >
                  🏢 Multi-Unit
                </button>
                <button
                  onClick={() => handleSimulateVoiceNote('hinglish_resale')}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-medium border border-purple-500/30 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Mic className="w-3 h-3" />
                  <span>Voice Note</span>
                </button>
                <button
                  onClick={() => handleSimulatePhotoUpload('LIVING')}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-medium border border-blue-500/30 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>4K Photo</span>
                </button>
                <button
                  onClick={handleSimulateDocumentUpload}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>RERA PDF</span>
                </button>
              </div>

              {/* Contributor Verification Quick Badge */}
              <button
                onClick={() => setIsOtpModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <UserCheck className="w-3 h-3" />
                <span>{propertyDraft.contributor?.trustLevel || 'UNVERIFIED'}</span>
              </button>
            </div>

            {/* Chat Conversation Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              {messages.map((msg) => {
                const isBot = msg.sender === 'KIAAN_BOT';
                return (
                  <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-md ${
                        isBot
                          ? isDark
                            ? 'bg-[#151F32] border border-white/10 text-white rounded-tl-sm'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                          : 'bg-emerald-600 text-white rounded-tr-sm'
                      }`}
                    >
                      {/* Media Display */}
                      {msg.media && msg.media.type === 'IMAGE' && (
                        <div className="mb-2 space-y-2">
                          <img
                            src={msg.media.url}
                            alt="Uploaded asset"
                            className="w-full h-44 object-cover rounded-xl border border-white/15"
                          />
                          {msg.media.qualityAnalysis && (
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                                {msg.media.qualityAnalysis.suggestedCategory.replace('_', ' ')}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300">
                                Clarity: {msg.media.qualityAnalysis.clarityScore}%
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-white/10">
                                {msg.media.qualityAnalysis.resolutionText}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Voice Note Audio Waveform */}
                      {msg.voice && (
                        <div className="mb-2 p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setVoicePlayingId(voicePlayingId === msg.voice?.id ? null : msg.voice?.id || null)
                              }
                              className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </button>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between text-[10px] opacity-75">
                                <span>Voice Message ({msg.voice.durationSeconds}s)</span>
                                <span>{msg.voice.detectedLanguage}</span>
                              </div>
                              <div className="flex items-center gap-1 h-3.5">
                                {[40, 70, 90, 60, 30, 80, 95, 75, 45, 60, 85, 90, 40, 20].map((h, i) => (
                                  <span
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className={`w-1 rounded-full ${
                                      voicePlayingId === msg.voice?.id ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'
                                    }`}
                                  ></span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Document Display */}
                      {msg.media && msg.media.type === 'DOCUMENT' && (
                        <div className="mb-2 p-2.5 rounded-xl bg-black/20 border border-white/10 flex items-center gap-3">
                          <FileText className="w-7 h-7 text-red-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold block truncate">{msg.media.originalFileName}</span>
                            <span className="text-[10px] opacity-60">{msg.media.fileSizeMb} MB • Official PDF</span>
                          </div>
                        </div>
                      )}

                      {/* Text Content */}
                      <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>

                      {/* Interactive Option Buttons */}
                      {msg.buttons && (
                        <div className="mt-3 space-y-1.5 border-t border-current/10 pt-2">
                          {msg.buttons.map((btn) => (
                            <button
                              key={btn.id}
                              onClick={() => {
                                if (btn.id === 'btn-view-inspector') {
                                  setActiveViewTab('DRAFT_CONFIRMATION');
                                } else if (btn.intent === 'ADD_PROJECT') {
                                  setActiveFlow('PROJECT');
                                  handleUserSendMessage(btn.label);
                                } else {
                                  handleUserSendMessage(btn.label);
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                            >
                              <span>{btn.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] opacity-50 block mt-1.5 text-right">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#151F32] border border-white/10 max-w-[120px] text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[10px] opacity-60 ml-1">AI Thinking</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSendMessage();
              }}
              className="p-3 border-t border-current/10 bg-black/40 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type details naturally (e.g. 3 BHK in Wakad, 1250 carpet, 1.45 Cr...)"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-current placeholder:opacity-40 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() => handleSimulateVoiceNote('hinglish_resale')}
                className="p-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
                title="Send Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSimulatePhotoUpload('LIVING')}
                className="p-2.5 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 transition-all cursor-pointer"
                title="Attach Media Photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="p-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Dynamic Inspector & Operational Tabs (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#080D18]">
            {/* Toast Notification */}
            {publishSuccessMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2.5 animate-slide-up">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{publishSuccessMessage}</span>
                </div>
                <button onClick={() => setPublishSuccessMessage(null)} className="opacity-60 hover:opacity-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 1: DRAFT CONFIRMATION (ITEM 18) */}
            {(activeViewTab === 'CHAT' || activeViewTab === 'DRAFT_CONFIRMATION') && (
              <div className="space-y-4">
                {/* Item 18: Confirmation Before Submission Card */}
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-black/40 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                        Draft Confirmation (Item 18)
                      </span>
                      <h3 className="text-sm font-serif font-bold text-white">
                        KIAAN PROPERTY DRAFT
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      {activeFlow === 'PROPERTY'
                        ? `${propertyDraft.completenessPercent}% Complete`
                        : `${projectDraft.completenessPercent}% Complete`}
                    </span>
                  </div>

                  {activeFlow === 'PROPERTY' ? (
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <strong className="text-sm text-white block">{propertyDraft.title}</strong>
                        <span className="text-[11px] text-amber-300/80">
                          {propertyDraft.location.microMarket}, Pune
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">Price (Canonical INR)</span>
                          <strong className="text-emerald-400 text-sm font-bold">
                            {propertyDraft.askingPriceFormatted}
                          </strong>
                          <span className="text-[9px] opacity-50 block">
                            Raw: "{propertyDraft.priceAudit?.rawInput || '1.45 Cr'}"
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">Carpet Area</span>
                          <strong className="text-white text-sm font-bold">
                            {propertyDraft.carpetAreaSqFt} sq.ft
                          </strong>
                          <span className="text-[9px] opacity-50 block">
                            Rate: ₹{propertyDraft.priceAudit?.pricePerSqFt?.toLocaleString('en-IN') || '11,600'}/sqft
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">Floor & Facing</span>
                          <span className="text-white font-semibold">
                            {propertyDraft.floorNumber}th Floor • {propertyDraft.facing}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">Parking & Ownership</span>
                          <span className="text-white font-semibold">
                            {propertyDraft.parkingSpaces || 2} Covered • {propertyDraft.ownershipType || 'FREEHOLD'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] px-1 py-1 border-t border-white/10">
                        <span className="opacity-70">Photos: {propertyDraft.media.length}</span>
                        <span className="opacity-70">Documents: 1 (RERA Verified)</span>
                        <span className="text-emerald-400 font-bold">Status: {propertyDraft.marketingStatus}</span>
                      </div>

                      {/* Missing fields list (Item 23 & 24) */}
                      {missingQuestions.mandatoryMissing.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-1">
                          <span className="font-bold text-amber-300 block flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            Missing Information:
                          </span>
                          <ul className="list-disc pl-4 opacity-80 text-[10px] space-y-0.5">
                            {missingQuestions.mandatoryMissing.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => handleAdminAction('APPROVE')}
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Submit Draft</span>
                        </button>
                        <button
                          onClick={() => setActiveViewTab('ADMIN_REVIEW')}
                          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Edit & Review</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <strong className="text-sm text-white block">{projectDraft.projectName}</strong>
                        <span className="text-[11px] text-amber-300/80">
                          {projectDraft.developerOrPromoterName} • {projectDraft.location.microMarket}, Pune
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">Price Range</span>
                          <strong className="text-emerald-400 font-bold">{projectDraft.priceRangeDisplay}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">MahaRERA Reg</span>
                          <strong className="text-amber-400 font-mono">{projectDraft.reraNumber}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">Units Onboarded</span>
                          <strong className="text-white font-bold">{projectDraft.units?.length || 0} Units</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                          <span className="text-[10px] opacity-60 block">Possession</span>
                          <span className="text-white font-semibold">{projectDraft.possessionDate}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => handleAdminAction('APPROVE')}
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Submit Project</span>
                        </button>
                        <button
                          onClick={() => setActiveViewTab('BULK_INVENTORY')}
                          className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Add Units CSV</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Website Continuation via QR / Deep Link (Items 26 & 27) */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Continue on Website (Item 26)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Token Active (7 Days)
                    </span>
                  </div>
                  <p className="text-[11px] opacity-70 leading-relaxed">
                    User can start on WhatsApp and seamlessly continue editing on the Kiaan website using this secure deep-link token without logging in again.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={propertyDraft.secureToken?.deepLinkUrl || 'https://kiaan.luxury/onboard/web?token=...'}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-amber-300"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(propertyDraft.secureToken?.deepLinkUrl || '');
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DUPLICATES AUDIT (ITEM 21) */}
            {activeViewTab === 'DUPLICATES_AUDIT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-blue-400">
                      Duplicate Detection Matcher (Item 21)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                    {propertyDraft.duplicateMatches?.length || 0} Matches Found
                  </span>
                </div>

                <p className="text-xs opacity-75 leading-relaxed">
                  The system automatically compares micro-market, building name, floor area, and pricing against the live inventory database to prevent duplicate listings.
                </p>

                {(propertyDraft.duplicateMatches || []).length > 0 ? (
                  propertyDraft.duplicateMatches?.map((match, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-white">{match.matchTitle}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold">
                          {match.confidenceScore}% Similarity
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[10px] opacity-60 block">Existing Listed Price</span>
                          <span className="font-bold text-emerald-400">
                            ₹{((match.existingPriceINR || 0) / 10000000).toFixed(2)} Cr
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[10px] opacity-60 block">Existing Carpet Area</span>
                          <span className="font-bold text-white">{match.existingCarpetArea} sq.ft</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] opacity-80 pt-1 border-t border-white/10">
                        {match.reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-400">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            setPropertyDraft((p) => ({ ...p, duplicateDecision: 'IGNORE_PROCEED' }));
                            setPublishSuccessMessage('Decision recorded: Ignore and Proceed as unique resale unit.');
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Ignore & Proceed
                        </button>
                        <button
                          onClick={() => {
                            setPropertyDraft((p) => ({ ...p, duplicateDecision: 'ATTACH_TO_EXISTING' }));
                            setPublishSuccessMessage('Decision recorded: Linked to master existing inventory record.');
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Attach to Existing
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h5 className="text-xs font-bold text-white">No Duplicate Conflicts Detected</h5>
                    <p className="text-[11px] opacity-60">
                      This listing appears to be an authentic, distinct unit within {propertyDraft.location.microMarket}.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BULK INVENTORY CSV / EXCEL (ITEM 17 & 34) */}
            {activeViewTab === 'BULK_INVENTORY' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-purple-400">
                      Bulk Unit Inventory Processor (Item 34)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                    Excel / CSV Support
                  </span>
                </div>

                <p className="text-xs opacity-75 leading-relaxed">
                  Paste or upload inventory spreadsheets. The engine normalizes prices, runs duplicate checks across towers, and validates carpet areas.
                </p>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold opacity-60 block">CSV Content Stream</span>
                  <textarea
                    rows={5}
                    value={bulkCsvText}
                    onChange={(e) => setBulkCsvText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-emerald-300 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={handleParseBulkCsv}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Parse & Validate Units</span>
                    </button>
                    {bulkSummary && (
                      <button
                        onClick={handleMergeBulkInventory}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Merge {bulkSummary.validUnitsCount} Units into Project</span>
                      </button>
                    )}
                  </div>
                </div>

                {bulkSummary && (
                  <div className="p-3.5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-2.5 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-black/30">
                        <span className="text-[10px] opacity-60 block">Total Detected</span>
                        <strong className="text-white text-sm">{bulkSummary.totalUnitsDetected}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-black/30">
                        <span className="text-[10px] opacity-60 block">Valid Units</span>
                        <strong className="text-emerald-400 text-sm">{bulkSummary.validUnitsCount}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-black/30">
                        <span className="text-[10px] opacity-60 block">Duplicate Units</span>
                        <strong className="text-amber-400 text-sm">{bulkSummary.duplicateUnitsCount}</strong>
                      </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1.5 pt-2 border-t border-white/10">
                      {bulkSummary.unitDrafts.map((u, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-black/20 text-[11px]"
                        >
                          <span className="font-bold">
                            {u.tower} • Unit {u.unitNumber} ({u.configuration})
                          </span>
                          <span className="text-emerald-400 font-semibold">
                            ₹{(u.askingPriceINR / 10000000).toFixed(2)} Cr
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ADMIN REVIEW DESK (ITEM 22) */}
            {activeViewTab === 'ADMIN_REVIEW' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-400">
                      Admin Review & Statutory Action Desk (Item 22)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    Review Status: {propertyDraft.reviewStatus || 'PENDING_REVIEW'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3 text-xs">
                  <span className="text-[10px] uppercase font-bold opacity-60 block">Admin Internal Note</span>
                  <textarea
                    rows={2}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Enter compliance evaluation notes (e.g. Title deed verified, NOC checked)..."
                    className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAdminAction('APPROVE')}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Draft</span>
                    </button>
                    <button
                      onClick={() =>
                        handleRequestMissingInfo('parkingSpaces', 'Please clarify the number of covered parking spaces.')
                      }
                      className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Request Info via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleAdminAction('REJECT')}
                      className="py-2.5 px-3 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-red-500/30 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject Draft</span>
                    </button>
                    <button
                      onClick={() => handleAdminAction('PUBLISH')}
                      className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                      <Sparkle className="w-3.5 h-3.5 fill-current" />
                      <span>Publish Live to Kiaan</span>
                    </button>
                  </div>
                </div>

                {/* Audit History Log */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-black/30 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold opacity-60 block">Review Audit Trail</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between opacity-80">
                      <span>Initiated via WhatsApp Inbound</span>
                      <span className="font-mono text-[10px]">Just now</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>RERA Gate Status: {propertyDraft.reraStatus}</span>
                      <span className="font-mono text-[10px]">Automated</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: RERA GATE (ITEM 28-30) */}
            {activeViewTab === 'RERA_GATE' && (
              <div className="p-4 rounded-2xl border border-emerald-500/25 bg-emerald-950/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-emerald-400">
                      Statutory MahaRERA Gate
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {activeFlow === 'PROPERTY' ? propertyDraft.reraStatus : projectDraft.reraGateStatus}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>MahaRERA Registration Format Check (P521000...)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Section 4(2)(l)(D) Dedicated Escrow Account Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Environmental Sanction & Title Certificate Match</span>
                  </div>
                </div>

                <p className="text-[10px] opacity-70 leading-relaxed pt-1 border-t border-emerald-500/20">
                  Projects lacking authentic MahaRERA verification are strictly barred from public inventory broadcast.
                </p>
              </div>
            )}

            {/* TAB 6: CRM EVENT BUS (ITEM 36) */}
            {activeViewTab === 'CRM_EVENTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-blue-400">
                      Outbound CRM Event Stream (Item 36)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                    {crmEvents.length} Events Dispatched
                  </span>
                </div>

                <p className="text-xs opacity-75 leading-relaxed">
                  WhatsApp onboarding serves as an intake channel. CRM remains a distinct system that listens asynchronously to outbound domain events.
                </p>

                <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
                  {crmEvents.map((evt) => (
                    <div key={evt.id} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400 text-[11px] font-mono">{evt.eventType}</span>
                        <span className="text-[9px] opacity-60">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <pre className="text-[10px] font-mono text-emerald-300 overflow-x-auto bg-black/30 p-2 rounded-lg">
                        {JSON.stringify(evt.payload, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OTP Verification Modal Dialog (Item 19) */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-[#0F172A] border border-emerald-500/40 p-6 space-y-4 shadow-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-serif font-bold">Contributor Verification (Item 19)</h4>
                </div>
                <button onClick={() => setIsOtpModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs opacity-75 leading-relaxed">
                Verify mobile number <strong className="text-emerald-400">{propertyDraft.contactNumber}</strong> via WhatsApp OTP to establish trust and grant instant publishing privileges.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleSendOtp}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Send OTP via WhatsApp (Simulate PIN 8492)
                </button>

                <input
                  type="text"
                  placeholder="Enter 4 or 6-digit OTP (e.g. 8492)"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-center font-mono text-base tracking-widest text-emerald-300 focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer"
                >
                  Confirm & Verify Identity
                </button>

                {otpStatusMsg && (
                  <p className="text-[11px] text-center text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    {otpStatusMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
