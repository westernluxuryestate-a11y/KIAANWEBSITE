/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AbandonedJourneyState,
  ConsentSettings,
  CustomerJourneyEvent,
  JourneyMilestone,
  JourneyPassportStep,
  SmartNotification,
} from '../types';

const JOURNEY_EVENTS_KEY = 'kiaan_journey_events';
const ABANDONED_STATE_KEY = 'kiaan_abandoned_journey';
const CONSENT_SETTINGS_KEY = 'kiaan_consent_settings';
const NOTIFICATIONS_KEY = 'kiaan_smart_notifications';

export const DEFAULT_PASSPORT_STEPS: JourneyPassportStep[] = [
  {
    stepNumber: 1,
    id: 'step_req',
    title: '1. Defining Requirements',
    description: 'Set your preferred micro-market, budget range, and BHK configuration.',
    milestoneKey: 'DISCOVERED',
    status: 'COMPLETED',
    completedAt: 'Just now',
    actionLabel: 'Refine Preferences',
    actionTab: 'search',
  },
  {
    stepNumber: 2,
    id: 'step_ai_match',
    title: '2. AI Compatibility Scoring',
    description: 'Kiaan Intelligence™ evaluated daylight, commute times, and layout efficiency.',
    milestoneKey: 'VIEWED',
    status: 'COMPLETED',
    completedAt: 'Today',
    actionLabel: 'View AI Match Rationale',
    actionTab: 'explore',
  },
  {
    stepNumber: 3,
    id: 'step_shortlist',
    title: '3. Curated Shortlist',
    description: 'Saved units and towers in your private VIP portfolio.',
    milestoneKey: 'SAVED',
    status: 'COMPLETED',
    completedAt: 'Active',
    actionLabel: 'Explore Saved (2)',
    actionTab: 'vip',
  },
  {
    stepNumber: 4,
    id: 'step_family',
    title: '4. Family Discussion & Consensus',
    description: 'Gather votes and feedback from family members in the private Family Room™.',
    milestoneKey: 'SHARED',
    status: 'IN_PROGRESS',
    actionLabel: 'Open Family Room',
    actionTab: 'family',
  },
  {
    stepNumber: 5,
    id: 'step_visit',
    title: '5. Private Chauffeur Site Visit',
    description: 'Experience the 320-ft elevation, luxury clubhouse, and actual views in person.',
    milestoneKey: 'VISIT_REQUESTED',
    status: 'IN_PROGRESS',
    actionLabel: 'Schedule VIP Visit',
    actionTab: 'explore',
  },
  {
    stepNumber: 6,
    id: 'step_finance',
    title: '6. Financial Check & FOIR Verification',
    description: 'Calculate Total Acquisition Cost (GST + Stamp Duty) and bank loan pre-qualification.',
    milestoneKey: 'ENGAGED',
    status: 'COMPLETED',
    completedAt: 'Verified',
    actionLabel: 'Review Cost Breakdown',
    actionTab: 'finance',
  },
  {
    stepNumber: 7,
    id: 'step_offer',
    title: '7. Letter of Intent / Make an Offer',
    description: 'Submit an algorithmic or customized price term sheet directly to developer sales desk.',
    milestoneKey: 'OFFERED',
    status: 'IN_PROGRESS',
    actionLabel: 'Submit Custom Offer',
    actionTab: 'vip',
  },
  {
    stepNumber: 8,
    id: 'step_negotiation',
    title: '8. Term Sheet & Escrow Clearance',
    description: 'Direct developer term sheet review with guaranteed price protection.',
    milestoneKey: 'OFFERED',
    status: 'LOCKED',
    actionLabel: 'Awaiting Offer Submission',
  },
  {
    stepNumber: 9,
    id: 'step_unit_lock',
    title: '9. Floorplate Unit Lock',
    description: 'Lock specific unit inventory (e.g. Unit A-1601) with double-booking prevention.',
    milestoneKey: 'SELECTED',
    status: 'LOCKED',
    actionLabel: 'Select Unit to Lock',
  },
  {
    stepNumber: 10,
    id: 'step_booking',
    title: '10. Digital Agreement & Escrow Booking',
    description: 'MahaRERA compliant token deposit credited to statutory 70% ring-fenced escrow.',
    milestoneKey: 'BOOKED',
    status: 'LOCKED',
    actionLabel: 'Execute Booking',
  },
];

export const INITIAL_SMART_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'notif_01',
    type: 'NEW_UNIT_RELEASED',
    title: 'New 4 BHK Penthouse Released on 32nd Floor',
    body: 'Tower A crown sky penthouse A-3201 at Kiaan One Vertica is now unlocked for private viewing.',
    timestamp: '10 mins ago',
    isRead: false,
    channel: 'PUSH',
    priority: 'HIGH',
    actionUrl: 'unit/unit_a3201',
  },
  {
    id: 'notif_02',
    type: 'CONSTRUCTION_UPDATE',
    title: 'MahaRERA Construction Progress: 18th Floor Slab Cast',
    body: 'Kiaan One Vertica has completed Tower A 18th floor RCC casting 14 days ahead of schedule.',
    timestamp: '2 hours ago',
    isRead: false,
    channel: 'WHATSAPP',
    priority: 'NORMAL',
    actionUrl: 'project/kiaan-one-vertica-wakad',
  },
  {
    id: 'notif_03',
    type: 'PRICE_CHANGE',
    title: 'Upcoming Floor-Rise Revision Notice',
    body: 'Prices in Baner micro-market are scheduled for a quarterly +3.5% revision on September 15.',
    timestamp: '1 day ago',
    isRead: true,
    channel: 'EMAIL',
    priority: 'NORMAL',
  },
];

class CustomerJourneyStore {
  private events: CustomerJourneyEvent[] = [];
  private abandonedState: AbandonedJourneyState | null = null;
  private consent: ConsentSettings = {
    consentGiven: true,
    pushEnabled: true,
    emailEnabled: true,
    whatsappEnabled: true,
    smsEnabled: false,
    frequency: 'INSTANT',
    consentedAt: new Date().toISOString(),
  };
  private notifications: SmartNotification[] = INITIAL_SMART_NOTIFICATIONS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const storedEvents = localStorage.getItem(JOURNEY_EVENTS_KEY);
      if (storedEvents) this.events = JSON.parse(storedEvents);

      const storedAbandoned = localStorage.getItem(ABANDONED_STATE_KEY);
      if (storedAbandoned) this.abandonedState = JSON.parse(storedAbandoned);

      const storedConsent = localStorage.getItem(CONSENT_SETTINGS_KEY);
      if (storedConsent) this.consent = JSON.parse(storedConsent);

      const storedNotifs = localStorage.getItem(NOTIFICATIONS_KEY);
      if (storedNotifs) this.notifications = JSON.parse(storedNotifs);
    } catch (e) {
      console.warn('Could not load journey storage:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(JOURNEY_EVENTS_KEY, JSON.stringify(this.events.slice(-50)));
      if (this.abandonedState) {
        localStorage.setItem(ABANDONED_STATE_KEY, JSON.stringify(this.abandonedState));
      } else {
        localStorage.removeItem(ABANDONED_STATE_KEY);
      }
      localStorage.setItem(CONSENT_SETTINGS_KEY, JSON.stringify(this.consent));
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Could not save journey storage:', e);
    }
  }

  // --- JOURNEY TRACKING (Item 101) ---
  public trackEvent(event: Omit<CustomerJourneyEvent, 'id' | 'timestamp'>) {
    const newEvent: CustomerJourneyEvent = {
      ...event,
      id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    this.events.push(newEvent);
    this.saveToStorage();

    // Fire non-intrusive background sync to backend endpoint
    try {
      fetch('/api/v1/journey/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      }).catch(() => {});
    } catch (e) {}

    return newEvent;
  }

  public getEvents(): CustomerJourneyEvent[] {
    return [...this.events];
  }

  // --- PASSPORT STEPS (Item 102) ---
  public getPassportSteps(): JourneyPassportStep[] {
    // Dynamically update steps based on tracked events
    const steps = JSON.parse(JSON.stringify(DEFAULT_PASSPORT_STEPS)) as JourneyPassportStep[];
    const hasVisit = this.events.some((e) => e.eventType === 'VISIT_REQUESTED');
    const hasOffer = this.events.some((e) => e.eventType === 'OFFERED');
    const hasBooked = this.events.some((e) => e.eventType === 'BOOKED');

    if (hasVisit) {
      const step = steps.find((s) => s.id === 'step_visit');
      if (step) {
        step.status = 'COMPLETED';
        step.completedAt = 'Confirmed';
      }
    }

    if (hasOffer) {
      const step = steps.find((s) => s.id === 'step_offer');
      if (step) {
        step.status = 'COMPLETED';
        step.completedAt = 'Under Review';
      }
      const negStep = steps.find((s) => s.id === 'step_negotiation');
      if (negStep) {
        negStep.status = 'IN_PROGRESS';
        negStep.actionLabel = 'Review Term Sheet';
      }
    }

    if (hasBooked) {
      const bStep = steps.find((s) => s.id === 'step_booking');
      if (bStep) {
        bStep.status = 'COMPLETED';
        bStep.completedAt = 'Token Executed';
      }
    }

    return steps;
  }

  // --- ABANDONED JOURNEY RECOVERY (Item 103 & 104) ---
  public setAbandonedState(state: AbandonedJourneyState | null) {
    this.abandonedState = state;
    this.saveToStorage();
  }

  public getAbandonedState(): AbandonedJourneyState | null {
    // If no explicit state, generate contextual resume card if user has engaged
    if (!this.abandonedState) {
      return {
        flowType: 'COMPARISON',
        lastActivityTimestamp: '15 mins ago',
        targetId: 'proj_one_vertica_wakad',
        targetTitle: 'Kiaan One Vertica (Units A-1201 vs A-1202)',
        statePayload: { unitIds: ['unit_a1201', 'unit_a1202'] },
        resumePromptText: 'You were comparing two 3.5 BHK units in Tower A. Would you like to resume your side-by-side analysis?',
        resumeActionLabel: 'Resume Unit Comparison Matrix',
        isInventoryValid: true,
      };
    }
    return this.abandonedState;
  }

  public clearAbandonedState() {
    this.abandonedState = null;
    this.saveToStorage();
  }

  // --- CONSENT & NOTIFICATION SETTINGS (Item 105) ---
  public getConsentSettings(): ConsentSettings {
    return { ...this.consent };
  }

  public updateConsentSettings(settings: Partial<ConsentSettings>) {
    this.consent = { ...this.consent, ...settings, consentedAt: new Date().toISOString() };
    this.saveToStorage();
  }

  public getNotifications(): SmartNotification[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveToStorage();
  }

  public addNotification(notification: Omit<SmartNotification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotif: SmartNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    this.notifications = [newNotif, ...this.notifications];
    this.saveToStorage();
    return newNotif;
  }
}

export const globalCustomerJourneyStore = new CustomerJourneyStore();
