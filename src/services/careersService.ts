/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JobPost, JobApplication, CandidateApplicationStatus, UserSession, AssetAuthorInfo } from '../types';

export const INITIAL_JOB_POSTS: JobPost[] = [
  {
    id: 'job_advisor_sales_01',
    slug: 'senior-luxury-portfolio-advisor',
    title: 'Senior Luxury Portfolio Advisor (Private Client Desk)',
    department: 'LUXURY_ADVISORY_SALES',
    departmentLabel: 'Luxury Advisory & Sales',
    location: 'Pune (Baner HQ & Wakad Corridor)',
    jobType: 'FULL_TIME',
    jobTypeLabel: 'Full-Time',
    experienceLevel: 'SENIOR',
    experienceYearsText: '4 - 8 Years',
    salaryRangeDisplay: '₹24 - 38 LPA + Maybach Client Commission Pool',
    openingsCount: 3,
    isUrgent: true,
    isFeatured: true,
    requiresMahaReraKnowledge: true,
    shortSummary: 'Lead advisory mandates for HNI & NRI clients acquiring ₹2 Cr to ₹25 Cr curated residences with zero brokerage bias.',
    overviewStory: 'Kiaan Properties is seeking an experienced Senior Luxury Portfolio Advisor to join our Private Client Advisory desk. In this role, you will represent discerning Ultra-High-Net-Worth Individuals, corporate executives, and NRI investors in navigating master developments in West Pune and Mumbai. You will guide clients through 3D digital twins, facilitate Mercedes-Maybach private site viewings, and close developer-direct transactions backed by statutory MahaRERA transparency.',
    responsibilities: [
      'Manage end-to-end luxury acquisition journeys for pre-qualified HNI and NRI buyers with property portfolios exceeding ₹2.5 Cr.',
      'Conduct private viewing itineraries utilizing our dedicated Mercedes-Maybach fleet across Baner, Balewadi, Wakad, and Kharadi.',
      'Demonstrate deep structural and financial knowledge using millimeter 3D digital twins, solar ray tracing, and tax optimization matrices.',
      'Structure transparent, zero-commission transactions directly between verified developers and buyers.',
      'Collaborate with the in-house legal counsel to present 30-year title deeds and 70% MahaRERA escrow audit dossiers to clients.',
      'Maintain continuous post-booking engagement, assisting with allotment letters, milestone tracking, and private handover keys.',
    ],
    requirements: [
      '4 to 8 years of proven track record in luxury residential sales, private banking, wealth management, or high-ticket real estate consulting.',
      'Valid MahaRERA Real Estate Agent Certification (or eligibility to obtain certification immediately).',
      'Flawless executive communication, presentation, and negotiation etiquette in English and Hindi (Marathi is an asset).',
      'Strong understanding of Pune & Mumbai luxury micro-markets, RERA Section 4 escrow rules, and home loan tax shield provisions.',
      'Impeccable integrity, discretion, and a client-first advisory ethos.',
    ],
    preferredQualifications: [
      'Experience handling NRI transactions across GCC (Dubai, Abu Dhabi), North America, or Singapore corridors.',
      'Familiarity with digital CAD floor plan reading, CRM workflows, and WhatsApp Business API platforms.',
    ],
    benefitsAndPerks: [
      'Industry-leading fixed CTC plus transparent quarterly transaction incentive pools.',
      'Chauffeured Mercedes-Maybach fleet access for client appointments and site visits.',
      'Comprehensive family medical and accidental insurance (₹15 Lakh coverage).',
      'Continuous leadership mentoring from senior real estate developers and corporate partners.',
      'Modern workspace at Kiaan Baner HQ with rooftop lounge and high-tech spatial demo studio.',
      'Annual luxury performance retreat and technology gadget allowance.',
    ],
    deadlineDate: '2026-10-31',
    status: 'PUBLISHED',
    createdBy: {
      name: 'Kiaan Sales Leadership',
      email: 'sales@kiaanproperties.in',
      role: 'SUPER_ADMIN',
    },
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-09-01T14:30:00Z',
  },
  {
    id: 'job_legal_maharera_02',
    slug: 'lead-maharera-regulatory-due-diligence-counsel',
    title: 'Lead MahaRERA Regulatory & Due Diligence Counsel',
    department: 'LEGAL_MAHARERA_REGULATORY',
    departmentLabel: 'Legal & MahaRERA Regulatory',
    location: 'Pune / Mumbai (Hybrid)',
    jobType: 'FULL_TIME',
    jobTypeLabel: 'Full-Time',
    experienceLevel: 'LEAD',
    experienceYearsText: '6 - 10 Years',
    salaryRangeDisplay: '₹28 - 42 LPA',
    openingsCount: 2,
    isUrgent: true,
    isFeatured: true,
    requiresMahaReraKnowledge: true,
    shortSummary: 'Lead 30-year title chain searches, Sub-Registrar Index-II audits, and 70% statutory escrow compliance validations.',
    overviewStory: 'Kiaan Properties operates on an unwavering foundation of legal truth. As our Lead MahaRERA Regulatory & Due Diligence Counsel, you will lead the statutory vetting process for every project and resale residence published on our platform. You will audit developer escrow records, verify Sub-Registrar Index-II title deeds, review draft Agreements for Sale, and safeguard our buyers from litigation, encumbrances, and regulatory deviations.',
    responsibilities: [
      'Conduct rigorous 30-year unbroken title chain searches across Revenue 7/12 records, CTS mutation entries, and Sub-Registrar archives.',
      'Audit developer MahaRERA quarterly filings (Forms 1, 2, and 3) to ensure 70% customer escrow compliance under Section 4(2)(l)(D).',
      'Draft and review canonical Agreements for Sale, Allotment Letters, and Non-Encumbrance Certificates (NEC).',
      'Oversee statutory disclosure reports published in the Kiaan Legal Document Center & AI Explainer.',
      'Coordinate with developer legal heads, revenue department officers, and financial institution panel advocates.',
      'Author authoritative regulatory briefings and legal updates for the Kiaan Journal thought leadership column.',
    ],
    requirements: [
      'LL.B or LL.M degree from a recognized law faculty; active enrollment with the Bar Council of Maharashtra & Goa.',
      '6+ years of dedicated practice in real estate law, MahaRERA regulatory litigation, or corporate conveyancing in Maharashtra.',
      'Exhaustive mastery of the Real Estate (Regulation and Development) Act 2016, MOFA, Maharashtra Land Revenue Code, and Transfer of Property Act.',
      'Strong analytical drafting skills with the ability to articulate complex legal risks into clear buyer advisories.',
    ],
    preferredQualifications: [
      'Prior experience serving as an in-house counsel for Tier-1 real estate developers or top-tier conveyancing law firms.',
      'Expertise in NRI FEMA regulations, Section 195 TDS on foreign property sale, and DPDPA 2023 compliance.',
    ],
    benefitsAndPerks: [
      'Competitive compensation package with annual performance retainership bonus.',
      'Flexible hybrid working model between Pune Baner HQ and Mumbai liaison offices.',
      'Comprehensive corporate health insurance, annual health checks, and term cover.',
      'Sponsored participation in National RERA summits and legal bar conclaves.',
      'High-autonomy leadership role with direct reporting to Executive Board.',
    ],
    deadlineDate: '2026-10-15',
    status: 'PUBLISHED',
    createdBy: {
      name: 'Adv. Radhika Deshmukh',
      email: 'compliance@kiaanproperties.in',
      role: 'COMPLIANCE_MANAGER',
    },
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-09-02T10:15:00Z',
  },
  {
    id: 'job_spatial_3d_03',
    slug: '3d-spatial-bim-solar-simulation-architect',
    title: '3D Spatial BIM & Solar Ray-Tracing Engine Architect',
    department: 'SPATIAL_ARCHITECTURE_3D_BIM',
    departmentLabel: '3D Spatial Architecture & BIM',
    location: 'Pune HQ (Baner)',
    jobType: 'FULL_TIME',
    jobTypeLabel: 'Full-Time',
    experienceLevel: 'MID',
    experienceYearsText: '3 - 6 Years',
    salaryRangeDisplay: '₹20 - 32 LPA + Tech Equity Grants',
    openingsCount: 2,
    isUrgent: false,
    isFeatured: true,
    requiresMahaReraKnowledge: false,
    shortSummary: 'Create millimeter-precision 3D digital twins, dawn-to-dusk solar penetration models, and elevation stackers.',
    overviewStory: 'We are pioneering a new paradigm where every luxury residence is explored as an interactive digital product. We are looking for a gifted 3D Spatial BIM Architect to transform structural CAD/Revit blueprints into high-fidelity WebGL/Three.js digital twins, realistic solar ray-tracing models, and spatial floor plan simulators.',
    responsibilities: [
      'Ingest architectural CAD, Revit, and Rhino BIM models to construct lightweight, millimeter-accurate 3D digital twins for web browsers.',
      'Calibrate true cardinal solar azimuth and altitude angles to simulate accurate dawn, noon, and dusk sunlight penetration in every room.',
      'Design interactive 32-floor tower elevation stackers displaying live unit availability, floor heights, and view corridors.',
      'Optimize 3D polygon meshes, textures, and lighting shaders for ultra-fast 60fps rendering on mobile and desktop devices.',
      'Collaborate with frontend engineers to integrate digital twins with unit holding tokens and live booking locks.',
    ],
    requirements: [
      'Bachelor’s in Architecture (B.Arch) or 3D Spatial Computing with 3+ years in architectural visualization or real-time 3D simulation.',
      'Mastery of Blender, Autodesk Revit, 3ds Max, Rhino, and GLTF/GLB optimization pipelines.',
      'Understanding of WebGL, Three.js, shaders, and real-time lighting constraints.',
      'Strong aesthetic eye for luxury architectural textures, monolithic concrete, warm timber, and ambient skybox lighting.',
    ],
    preferredQualifications: [
      'Experience in virtual reality (WebXR), ray-tracing physics, or interactive architectural gaming engines (Unreal/Unity).',
      'Familiarity with GIS spatial mapping, drone photogrammetry point clouds, and LiDAR scans.',
    ],
    benefitsAndPerks: [
      'Attractive compensation with high-performance tech equity options.',
      'Top-of-the-line Apple Silicon / Nvidia RTX studio workstation provided.',
      'Opportunity to build category-defining real estate spatial tech viewed by tens of thousands of buyers monthly.',
      'Generous learning stipend for international 3D/BIM conferences and software tools.',
      'Catered meals, specialty espresso bar, and flexible hours at Baner HQ.',
    ],
    deadlineDate: '2026-11-15',
    status: 'PUBLISHED',
    createdBy: {
      name: 'Vikram Singhania',
      email: 'superadmin@kiaanproperties.com',
      role: 'SUPER_ADMIN',
    },
    createdAt: '2026-08-22T14:00:00Z',
    updatedAt: '2026-09-01T16:20:00Z',
  },
  {
    id: 'job_marketing_brand_04',
    slug: 'institutional-real-estate-brand-content-lead',
    title: 'Institutional Real Estate & Content Marketing Lead',
    department: 'MARKETING_BRAND_COMMUNICATIONS',
    departmentLabel: 'Marketing & Brand Communications',
    location: 'Pune (Baner HQ)',
    jobType: 'FULL_TIME',
    jobTypeLabel: 'Full-Time',
    experienceLevel: 'MID',
    experienceYearsText: '3 - 7 Years',
    salaryRangeDisplay: '₹18 - 26 LPA',
    openingsCount: 1,
    isUrgent: false,
    isFeatured: false,
    requiresMahaReraKnowledge: true,
    shortSummary: 'Architect the Kiaan Journal, market intelligence whitepapers, luxury visual storytelling, and digital organic growth.',
    overviewStory: 'Kiaan Properties publishes institutional-grade real estate intelligence rather than generic marketing claims. We are looking for a strategic Content & Brand Marketing Lead to oversee the Kiaan Journal, manage educational whitepaper releases, orchestrate high-production video showcases, and build an authoritative organic brand for luxury home buyers.',
    responsibilities: [
      'Direct the editorial calendar of the Kiaan Journal, authoring deep-dive micro-market analyses, tax strategies, and MahaRERA buyer guides.',
      'Oversee high-production architectural video shoots, drone showcases, and developer executive interviews.',
      'Drive high-intent organic SEO and Schema.org semantic discovery across luxury residential keywords in Pune and Mumbai.',
      'Produce downloadable research whitepapers and institutional client dossiers.',
      'Manage WhatsApp broadcast newsletters and personalized investor market pulses.',
    ],
    requirements: [
      '3 to 7 years of content marketing or brand leadership experience in luxury real estate, fintech, or premium lifestyle brands.',
      'Exceptional writing, editorial structuring, and research skills; ability to distill complex financial and legal concepts into compelling narratives.',
      'Working knowledge of SEO metadata structures, JSON-LD schemas, and content performance analytics.',
      'Strong visual aesthetic and familiarity with Figma, Canva, and modern content publishing platforms.',
    ],
    preferredQualifications: [
      'Background in business journalism (e.g., Mint, Economic Times, Bloomberg) or premium creative agency.',
    ],
    benefitsAndPerks: [
      'Competitive salary with biannual performance rewards.',
      'Access to state-of-the-art podcast and video production studio at Baner HQ.',
      'Comprehensive health coverage and wellness allowances.',
      'Creative autonomy to shape India’s most trusted real estate brand.',
    ],
    deadlineDate: '2026-10-31',
    status: 'PUBLISHED',
    createdBy: {
      name: 'Kiaan Sales Leadership',
      email: 'sales@kiaanproperties.in',
      role: 'SUPER_ADMIN',
    },
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'job_wealth_nri_05',
    slug: 'director-wealth-advisory-nri-solutions',
    title: 'Director of Wealth Advisory & NRI Real Estate Solutions',
    department: 'WEALTH_CLIENT_RELATIONSHIP',
    departmentLabel: 'Private Wealth & NRI Advisory',
    location: 'Mumbai (BKC Desk) / Dubai Liaison',
    jobType: 'EXECUTIVE_LEADERSHIP',
    jobTypeLabel: 'Executive Leadership',
    experienceLevel: 'EXECUTIVE',
    experienceYearsText: '10+ Years',
    salaryRangeDisplay: '₹45 - 65 LPA + Partnership Allocation',
    openingsCount: 1,
    isUrgent: true,
    isFeatured: true,
    requiresMahaReraKnowledge: true,
    shortSummary: 'Lead cross-border real estate capital structuring, FEMA compliance, and family office portfolio allocations.',
    overviewStory: 'We are expanding our institutional private wealth desk to serve non-resident Indians, family offices, and tech founders allocating capital into premium Indian real estate. As Director of Wealth Advisory & NRI Solutions, you will lead high-value cross-border transactions, tax-optimized reinvestments (Section 54/54EC), and bespoke estate allocations.',
    responsibilities: [
      'Manage high-level relationships with Family Offices, private wealth bankers, chartered accountants, and NRI diaspora leaders in Dubai, Singapore, and the US.',
      'Structure cross-border real estate acquisitions adhering to RBI FEMA guidelines, NRE/NRO banking channels, and Section 195 withholding tax mechanisms.',
      'Lead institutional bulk acquisitions and early-stage capital commitments across Tier-1 residential developments.',
      'Coordinate with our Maybach Concierge for seamless airport-to-residence private site tours for visiting overseas clients.',
      'Represent Kiaan Properties at international real estate exhibitions and private investor roundtables.',
    ],
    requirements: [
      '10+ years of distinguished experience in private wealth management, family office advisory, or ultra-luxury real estate consulting.',
      'Deep, established network among high-net-worth NRIs in the Middle East, North America, or Southeast Asia.',
      'Mastery of Indian direct tax provisions (Section 54, 54EC, capital gains indexation) and cross-border repatriation procedures.',
      'Exceptional leadership, boardroom gravitas, and strategic deal-making capabilities.',
    ],
    preferredQualifications: [
      'Chartered Wealth Manager (CWM), CFA, CA, or MBA from a premier institution.',
    ],
    benefitsAndPerks: [
      'Executive compensation package with generous equity/partnership profit sharing.',
      'First-class international travel allowance and luxury corporate hospitality budget.',
      'Premium health, disability, and executive term insurance coverage.',
      'Direct influence on company expansion and institutional board strategy.',
    ],
    deadlineDate: '2026-11-30',
    status: 'PUBLISHED',
    createdBy: {
      name: 'Vikram Singhania',
      email: 'superadmin@kiaanproperties.com',
      role: 'SUPER_ADMIN',
    },
    createdAt: '2026-08-28T16:00:00Z',
    updatedAt: '2026-09-03T12:00:00Z',
  },
];

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_seed_01',
    applicationRef: 'KP-JOB-2026-A109',
    jobId: 'job_advisor_sales_01',
    jobTitle: 'Senior Luxury Portfolio Advisor (Private Client Desk)',
    jobDepartment: 'LUXURY_ADVISORY_SALES',
    candidateName: 'Aditya Kulkarni',
    candidateEmail: 'aditya.kulkarni.realestate@gmail.com',
    candidatePhone: '+91 98221 44550',
    currentLocation: 'Pune (Kothrud)',
    totalExperienceYears: 6,
    currentCompany: 'Sotheby’s International Realty (Associate Lead)',
    currentDesignation: 'Senior Portfolio Consultant',
    expectedCtcLPA: '₹32 LPA',
    noticePeriodDays: '30 Days',
    linkedInUrl: 'https://linkedin.com/in/aditya-kulkarni-realestate',
    portfolioUrl: 'https://adityakulkarni.profile',
    resumeFileName: 'Aditya_Kulkarni_Resume_2026.pdf',
    coverNote: 'I have spent the last 6 years managing transactions exceeding ₹140 Cr across Baner and Koregaon Park. I am passionate about Kiaan’s zero-brokerage model and transparent 3D twin product approach.',
    hasMahaReraCertification: true,
    status: 'SHORTLISTED',
    adminNotes: 'Strong track record in Pune West corridor. Valid MahaRERA agent certificate confirmed. Scheduled for initial partner interview.',
    submittedAt: '2026-08-29T10:15:00Z',
    reviewedBy: 'sales@kiaanproperties.in',
  },
  {
    id: 'app_seed_02',
    applicationRef: 'KP-JOB-2026-L842',
    jobId: 'job_legal_maharera_02',
    jobTitle: 'Lead MahaRERA Regulatory & Due Diligence Counsel',
    jobDepartment: 'LEGAL_MAHARERA_REGULATORY',
    candidateName: 'Adv. Manisha Patwardhan',
    candidateEmail: 'manisha.patwardhan.legal@outlook.com',
    candidatePhone: '+91 98902 33119',
    currentLocation: 'Mumbai (Dadar)',
    totalExperienceYears: 8,
    currentCompany: 'Khaitan & Co (Real Estate Practice)',
    currentDesignation: 'Senior Legal Associate',
    expectedCtcLPA: '₹38 LPA',
    noticePeriodDays: '45 Days',
    linkedInUrl: 'https://linkedin.com/in/adv-manisha-patwardhan',
    resumeFileName: 'Adv_Manisha_Patwardhan_CV.pdf',
    coverNote: 'Having audited over 80 MahaRERA registered projects and revenue mutation registers across MMR and Pune, I am eager to contribute to Kiaan’s institutional compliance framework.',
    hasMahaReraCertification: true,
    status: 'INTERVIEW_SCHEDULED',
    adminNotes: 'Excellent experience with Section 4 escrow verification and 30-year title opinions. Interview set for Thursday 3 PM.',
    submittedAt: '2026-08-30T14:45:00Z',
    reviewedBy: 'compliance@kiaanproperties.in',
  },
  {
    id: 'app_seed_03',
    applicationRef: 'KP-JOB-2026-T921',
    jobId: 'job_spatial_3d_03',
    jobTitle: '3D Spatial BIM & Solar Ray-Tracing Engine Architect',
    jobDepartment: 'SPATIAL_ARCHITECTURE_3D_BIM',
    candidateName: 'Tanmay Shirke',
    candidateEmail: 'tanmay.shirke.3d@gmail.com',
    candidatePhone: '+91 97650 99881',
    currentLocation: 'Pune (Viman Nagar)',
    totalExperienceYears: 4,
    currentCompany: 'SpatialTech Interactive Studio',
    currentDesignation: 'Lead WebGL / 3D Graphics Engineer',
    expectedCtcLPA: '₹26 LPA',
    noticePeriodDays: '15 Days (Immediate)',
    linkedInUrl: 'https://linkedin.com/in/tanmay-shirke-3d',
    portfolioUrl: 'https://tanmayshirke.artstation.com',
    resumeFileName: 'Tanmay_Shirke_Portfolio_Resume.pdf',
    coverNote: 'I specialize in real-time WebGL shaders, sunlight simulation, and GLTF pipeline automation. I love the smooth ray-tracing simulations on Kiaan One Vertica.',
    hasMahaReraCertification: false,
    status: 'NEW',
    adminNotes: 'Portfolio looks outstanding. Ray tracing demos show 60fps mobile optimization.',
    submittedAt: '2026-09-02T09:20:00Z',
    reviewedBy: 'superadmin@kiaanproperties.com',
  },
];

class CareersService {
  private jobs: Map<string, JobPost> = new Map();
  private applications: Map<string, JobApplication> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.seed();
    this.loadFromStorage();
  }

  private seed() {
    INITIAL_JOB_POSTS.forEach((j) => this.jobs.set(j.id, { ...j }));
    INITIAL_JOB_APPLICATIONS.forEach((a) => this.applications.set(a.id, { ...a }));
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.warn('CareersService subscriber error', e);
      }
    });
  }

  private saveToStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const jobsArr = Array.from(this.jobs.values());
      const appsArr = Array.from(this.applications.values());
      localStorage.setItem('kiaan_job_posts_v2', JSON.stringify(jobsArr));
      localStorage.setItem('kiaan_job_applications_v2', JSON.stringify(appsArr));
    } catch (e) {
      console.warn('Failed to save CareersService data to localStorage:', e);
    }
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;

      const jobsRaw = localStorage.getItem('kiaan_job_posts_v2');
      if (jobsRaw) {
        const parsed = JSON.parse(jobsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.jobs.clear();
          parsed.forEach((j: JobPost) => this.jobs.set(j.id, j));
        }
      }

      const appsRaw = localStorage.getItem('kiaan_job_applications_v2');
      if (appsRaw) {
        const parsedApps = JSON.parse(appsRaw);
        if (Array.isArray(parsedApps) && parsedApps.length > 0) {
          this.applications.clear();
          parsedApps.forEach((a: JobApplication) => this.applications.set(a.id, a));
        }
      }
    } catch (e) {
      console.warn('Failed to load CareersService data from localStorage:', e);
    }
  }

  /**
   * RBAC Security: Check if user session has rights to create and manage job postings
   */
  public canUserManageJobs(session?: UserSession | null): boolean {
    if (!session) return false;
    const adminRoles = [
      'SUPER_ADMIN',
      'WEBSITE_ADMIN',
      'PROPERTY_MANAGER',
      'CONTENT_EDITOR',
      'COMPLIANCE_MANAGER',
      'FINANCE_MANAGER',
      'BOOKING_MANAGER',
      'ANALYST',
    ];
    if (adminRoles.includes(session.role)) return true;
    if (session.email?.toLowerCase().endsWith('@kiaanproperties.in') || session.email?.toLowerCase().endsWith('@kiaanproperties.com')) {
      return true;
    }
    return false;
  }

  /**
   * Get all jobs (optionally filtered by public published status or admin view)
   */
  public getJobs(includeUnpublished = false): JobPost[] {
    const all = Array.from(this.jobs.values());
    if (includeUnpublished) {
      return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return all
      .filter((j) => j.status === 'PUBLISHED')
      .sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  public getJobById(id: string): JobPost | undefined {
    return this.jobs.get(id);
  }

  public getJobBySlug(slug: string): JobPost | undefined {
    return Array.from(this.jobs.values()).find((j) => j.slug === slug || j.id === slug);
  }

  /**
   * Admin Right: Create a new Job Posting
   */
  public createJob(
    jobData: Omit<JobPost, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string },
    session?: UserSession | null
  ): { success: boolean; job?: JobPost; error?: string } {
    if (!this.canUserManageJobs(session)) {
      return { success: false, error: 'Unauthorized: Admin privileges required to post jobs.' };
    }

    const timestamp = new Date().toISOString();
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const baseSlug = (jobData.slug || jobData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newJob: JobPost = {
      ...jobData,
      id,
      slug,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: session
        ? {
            name: session.name,
            email: session.email,
            role: session.role,
          }
        : {
            name: 'Kiaan Talent Acquisition Desk',
            email: 'sales@kiaanproperties.in',
            role: 'SUPER_ADMIN',
          },
    };

    this.jobs.set(id, newJob);
    this.notify();
    return { success: true, job: newJob };
  }

  /**
   * Admin Right: Update an existing Job Posting
   */
  public updateJob(
    id: string,
    updates: Partial<JobPost>,
    session?: UserSession | null
  ): { success: boolean; job?: JobPost; error?: string } {
    if (!this.canUserManageJobs(session)) {
      return { success: false, error: 'Unauthorized: Admin privileges required to update jobs.' };
    }

    const existing = this.jobs.get(id);
    if (!existing) {
      return { success: false, error: 'Job opening not found.' };
    }

    const updatedJob: JobPost = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.jobs.set(id, updatedJob);
    this.notify();
    return { success: true, job: updatedJob };
  }

  /**
   * Admin Right: Delete a Job Posting
   */
  public deleteJob(id: string, session?: UserSession | null): { success: boolean; error?: string } {
    if (!this.canUserManageJobs(session)) {
      return { success: false, error: 'Unauthorized: Admin privileges required to delete jobs.' };
    }

    if (!this.jobs.has(id)) {
      return { success: false, error: 'Job opening not found.' };
    }

    this.jobs.delete(id);
    this.notify();
    return { success: true };
  }

  /**
   * Admin Right: Quick toggle job status (PUBLISHED, DRAFT, PAUSED, CLOSED)
   */
  public toggleJobStatus(id: string, status: JobPost['status'], session?: UserSession | null): boolean {
    if (!this.canUserManageJobs(session)) return false;
    const existing = this.jobs.get(id);
    if (!existing) return false;
    existing.status = status;
    existing.updatedAt = new Date().toISOString();
    this.jobs.set(id, existing);
    this.notify();
    return true;
  }

  /**
   * Public / Candidate Submission: Submit Job Application
   */
  public submitApplication(
    appData: Omit<JobApplication, 'id' | 'applicationRef' | 'status' | 'submittedAt'>
  ): { success: boolean; application?: JobApplication; error?: string } {
    try {
      if (!appData.candidateName?.trim() || !appData.candidateEmail?.trim() || !appData.candidatePhone?.trim()) {
        return { success: false, error: 'Please provide full name, email, and contact phone number.' };
      }

      const timestamp = new Date().toISOString();
      const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const applicationRef = `KP-JOB-${new Date().getFullYear()}-${randomCode}`;

      const newApp: JobApplication = {
        ...appData,
        id,
        applicationRef,
        status: 'NEW',
        submittedAt: timestamp,
      };

      this.applications.set(id, newApp);
      this.notify();
      return { success: true, application: newApp };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit application.' };
    }
  }

  /**
   * Admin Right: View All Candidate Applications
   */
  public getApplications(jobId?: string): JobApplication[] {
    const all = Array.from(this.applications.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    if (jobId) {
      return all.filter((a) => a.jobId === jobId);
    }
    return all;
  }

  /**
   * Admin Right: Update Candidate Application Status & Notes
   */
  public updateApplicationStatus(
    applicationId: string,
    status: CandidateApplicationStatus,
    adminNotes?: string,
    session?: UserSession | null
  ): boolean {
    if (!this.canUserManageJobs(session)) return false;
    const app = this.applications.get(applicationId);
    if (!app) return false;

    app.status = status;
    if (adminNotes !== undefined) {
      app.adminNotes = adminNotes;
    }
    if (session) {
      app.reviewedBy = session.email || session.name;
    }

    this.applications.set(applicationId, app);
    this.notify();
    return true;
  }
}

export const careersService = new CareersService();
