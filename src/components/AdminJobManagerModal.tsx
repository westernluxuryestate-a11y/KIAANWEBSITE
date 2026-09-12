/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Briefcase,
  Users,
  CheckCircle2,
  Trash2,
  Edit3,
  Search,
  Filter,
  Eye,
  Lock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import {
  JobPost,
  JobApplication,
  JobDepartment,
  JobType,
  JobExperienceLevel,
  JobStatus,
  CandidateApplicationStatus,
  UserSession,
} from '../types';
import { careersService } from '../services/careersService';

interface AdminJobManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: UserSession | null;
  theme?: 'dark' | 'light';
  onJobChanged?: () => void;
}

const DEPARTMENTS: { value: JobDepartment; label: string }[] = [
  { value: 'LUXURY_ADVISORY_SALES', label: 'Luxury Advisory & Sales' },
  { value: 'LEGAL_MAHARERA_REGULATORY', label: 'Legal & MahaRERA Regulatory' },
  { value: 'SPATIAL_ARCHITECTURE_3D_BIM', label: '3D Spatial Architecture & BIM' },
  { value: 'ENGINEERING_TECH_AI', label: 'Engineering, Tech & AI' },
  { value: 'MARKETING_BRAND_COMMUNICATIONS', label: 'Marketing & Brand Communications' },
  { value: 'WEALTH_CLIENT_RELATIONSHIP', label: 'Private Wealth & NRI Advisory' },
  { value: 'FINANCE_ACCOUNTS_ESCROW', label: 'Finance, Accounts & Escrow' },
  { value: 'OPERATIONS_CONCIERGE', label: 'Operations & Luxury Concierge' },
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full-Time' },
  { value: 'CONTRACT', label: 'Contract / Retainership' },
  { value: 'EXECUTIVE_LEADERSHIP', label: 'Executive Leadership' },
  { value: 'PART_TIME', label: 'Part-Time' },
  { value: 'INTERNSHIP', label: 'Fellowship / Internship' },
];

const EXPERIENCE_LEVELS: { value: JobExperienceLevel; label: string }[] = [
  { value: 'ENTRY', label: 'Entry Level (0 - 2 Yrs)' },
  { value: 'MID', label: 'Mid Level (3 - 5 Yrs)' },
  { value: 'SENIOR', label: 'Senior Level (5 - 8 Yrs)' },
  { value: 'LEAD', label: 'Lead / Principal (8 - 12 Yrs)' },
  { value: 'EXECUTIVE', label: 'Executive (12+ Yrs)' },
];

export const AdminJobManagerModal: React.FC<AdminJobManagerModalProps> = ({
  isOpen,
  onClose,
  session,
  theme = 'dark',
  onJobChanged,
}) => {
  const isDark = theme === 'dark';
  const hasRights = careersService.canUserManageJobs(session);

  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE' | 'APPLICATIONS'>('LIST');
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<JobPost | null>(null);
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterAppStatus, setFilterAppStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Create/Edit Job Post
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<JobDepartment>('LUXURY_ADVISORY_SALES');
  const [location, setLocation] = useState('Pune (Baner HQ)');
  const [jobType, setJobType] = useState<JobType>('FULL_TIME');
  const [experienceLevel, setExperienceLevel] = useState<JobExperienceLevel>('SENIOR');
  const [experienceYearsText, setExperienceYearsText] = useState('4 - 8 Years');
  const [salaryRangeDisplay, setSalaryRangeDisplay] = useState('₹24 - 36 LPA');
  const [openingsCount, setOpeningsCount] = useState<number>(2);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);
  const [requiresMahaReraKnowledge, setRequiresMahaReraKnowledge] = useState(true);
  const [shortSummary, setShortSummary] = useState('');
  const [overviewStory, setOverviewStory] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('2026-11-30');
  const [status, setStatus] = useState<JobStatus>('PUBLISHED');

  const [successToast, setSuccessToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshData = () => {
    setJobs(careersService.getJobs(true));
    setApplications(careersService.getApplications());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const loadJobIntoForm = (job: JobPost) => {
    setSelectedJobForEdit(job);
    setTitle(job.title);
    setDepartment((job.department as JobDepartment) || 'LUXURY_ADVISORY_SALES');
    setLocation(job.location);
    setJobType(job.jobType);
    setExperienceLevel(job.experienceLevel);
    setExperienceYearsText(job.experienceYearsText);
    setSalaryRangeDisplay(job.salaryRangeDisplay);
    setOpeningsCount(job.openingsCount);
    setIsUrgent(!!job.isUrgent);
    setIsFeatured(!!job.isFeatured);
    setRequiresMahaReraKnowledge(!!job.requiresMahaReraKnowledge);
    setShortSummary(job.shortSummary);
    setOverviewStory(job.overviewStory);
    setResponsibilitiesText(job.responsibilities.join('\n'));
    setRequirementsText(job.requirements.join('\n'));
    setBenefitsText(job.benefitsAndPerks.join('\n'));
    setDeadlineDate(job.deadlineDate || '2026-11-30');
    setStatus(job.status);
    setActiveTab('CREATE');
  };

  const handleResetForm = () => {
    setSelectedJobForEdit(null);
    setTitle('');
    setDepartment('LUXURY_ADVISORY_SALES');
    setLocation('Pune (Baner HQ)');
    setJobType('FULL_TIME');
    setExperienceLevel('SENIOR');
    setExperienceYearsText('4 - 8 Years');
    setSalaryRangeDisplay('₹24 - 36 LPA');
    setOpeningsCount(2);
    setIsUrgent(false);
    setIsFeatured(true);
    setRequiresMahaReraKnowledge(true);
    setShortSummary('');
    setOverviewStory('');
    setResponsibilitiesText('');
    setRequirementsText('');
    setBenefitsText('');
    setDeadlineDate('2026-11-30');
    setStatus('PUBLISHED');
    setErrorMsg('');
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !shortSummary.trim() || !overviewStory.trim()) {
      setErrorMsg('Please enter job title, short summary, and overview story.');
      return;
    }

    const deptObj = DEPARTMENTS.find((d) => d.value === department);
    const typeObj = JOB_TYPES.find((t) => t.value === jobType);

    const responsibilities = responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const requirements = requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const benefitsAndPerks = benefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (selectedJobForEdit) {
      const res = careersService.updateJob(
        selectedJobForEdit.id,
        {
          title: title.trim(),
          department,
          departmentLabel: deptObj?.label || department,
          location: location.trim(),
          jobType,
          jobTypeLabel: typeObj?.label || jobType,
          experienceLevel,
          experienceYearsText: experienceYearsText.trim(),
          salaryRangeDisplay: salaryRangeDisplay.trim(),
          openingsCount: Number(openingsCount) || 1,
          isUrgent,
          isFeatured,
          requiresMahaReraKnowledge,
          shortSummary: shortSummary.trim(),
          overviewStory: overviewStory.trim(),
          responsibilities: responsibilities.length ? responsibilities : ['Fulfill core leadership responsibilities.'],
          requirements: requirements.length ? requirements : ['Demonstrated excellence in respective domain.'],
          benefitsAndPerks: benefitsAndPerks.length ? benefitsAndPerks : ['Competitive compensation package.'],
          deadlineDate,
          status,
        },
        session
      );

      if (res.success) {
        setSuccessToast(`Job opening "${title}" updated successfully!`);
        setTimeout(() => setSuccessToast(''), 4000);
        refreshData();
        handleResetForm();
        setActiveTab('LIST');
        if (onJobChanged) onJobChanged();
      } else {
        setErrorMsg(res.error || 'Failed to update job.');
      }
    } else {
      const res = careersService.createJob(
        {
          title: title.trim(),
          department,
          departmentLabel: deptObj?.label || department,
          location: location.trim(),
          jobType,
          jobTypeLabel: typeObj?.label || jobType,
          experienceLevel,
          experienceYearsText: experienceYearsText.trim(),
          salaryRangeDisplay: salaryRangeDisplay.trim(),
          openingsCount: Number(openingsCount) || 1,
          isUrgent,
          isFeatured,
          requiresMahaReraKnowledge,
          shortSummary: shortSummary.trim(),
          overviewStory: overviewStory.trim(),
          responsibilities: responsibilities.length ? responsibilities : ['Fulfill core leadership responsibilities.'],
          requirements: requirements.length ? requirements : ['Demonstrated excellence in respective domain.'],
          benefitsAndPerks: benefitsAndPerks.length ? benefitsAndPerks : ['Competitive compensation package.'],
          deadlineDate,
          status,
        },
        session
      );

      if (res.success) {
        setSuccessToast(`Job opening "${title}" published successfully!`);
        setTimeout(() => setSuccessToast(''), 4000);
        refreshData();
        handleResetForm();
        setActiveTab('LIST');
        if (onJobChanged) onJobChanged();
      } else {
        setErrorMsg(res.error || 'Failed to create job.');
      }
    }
  };

  const handleDeleteJob = (job: JobPost) => {
    if (window.confirm(`Are you sure you want to permanently delete the job post "${job.title}"?`)) {
      const res = careersService.deleteJob(job.id, session);
      if (res.success) {
        setSuccessToast(`Deleted job opening "${job.title}".`);
        setTimeout(() => setSuccessToast(''), 3000);
        refreshData();
        if (onJobChanged) onJobChanged();
      } else {
        alert(res.error || 'Failed to delete job.');
      }
    }
  };

  const handleUpdateAppStatus = (appId: string, newStatus: CandidateApplicationStatus) => {
    const ok = careersService.updateApplicationStatus(appId, newStatus, undefined, session);
    if (ok) {
      refreshData();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 my-auto flex flex-col max-h-[90vh] ${
          isDark ? 'bg-[#0B101C] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-current/10 flex items-center justify-between gap-4 bg-gradient-to-r from-red-500/15 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl">Careers & Job Openings Management</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  ADMIN AUTHORIZED
                </span>
              </div>
              <p className="text-xs opacity-75">
                Logged in as: <strong>{session?.name || 'Administrator'}</strong> ({session?.email || 'sales@kiaanproperties.in'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-current/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="px-6 py-3 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Security Clearance Alert if Not Authorized */}
        {!hasRights && (
          <div className="p-6 m-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs space-y-2">
            <div className="font-bold flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4" />
              <span>Restricted Administration Privilege</span>
            </div>
            <p className="opacity-80">
              Your current session ({session?.role || 'GUEST'}) does not have granted rights to post or modify job openings.
              Please sign in with a Super Admin or Enterprise Team account.
            </p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 py-3 border-b border-current/10 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('LIST');
                handleResetForm();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'LIST'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'hover:bg-current/10 opacity-70 hover:opacity-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>All Openings ({jobs.length})</span>
            </button>

            <button
              onClick={() => {
                handleResetForm();
                setActiveTab('CREATE');
              }}
              disabled={!hasRights}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'CREATE'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'hover:bg-current/10 opacity-70 hover:opacity-100'
              } ${!hasRights ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{selectedJobForEdit ? 'Edit Job Opening' : '+ Create New Job Post'}</span>
            </button>

            <button
              onClick={() => setActiveTab('APPLICATIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'APPLICATIONS'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'hover:bg-current/10 opacity-70 hover:opacity-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Candidate Applications ({applications.length})</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: ALL OPENINGS LIST */}
          {activeTab === 'LIST' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by job title or location..."
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs border transition-colors outline-none cursor-pointer ${
                      isDark ? 'bg-[#0B101C] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      handleResetForm();
                      setActiveTab('CREATE');
                    }}
                    disabled={!hasRights}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Job</span>
                  </button>
                </div>
              </div>

              {/* Jobs Table */}
              <div className="space-y-3">
                {jobs
                  .filter((j) => {
                    if (filterDept !== 'ALL' && j.department !== filterDept) return false;
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      return j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
                    }
                    return true;
                  })
                  .map((job) => {
                    const appsForThisJob = applications.filter((a) => a.jobId === job.id);
                    return (
                      <div
                        key={job.id}
                        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isDark ? 'bg-white/5 border-white/10 hover:border-amber-500/40' : 'bg-slate-50 border-slate-200 hover:border-amber-500 shadow-sm'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400">
                              {job.departmentLabel}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                job.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : job.status === 'DRAFT'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {job.status}
                            </span>
                            {job.isUrgent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 animate-pulse">
                                URGENT
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif font-bold text-base text-current truncate">{job.title}</h4>

                          <div className="flex flex-wrap items-center gap-3 text-xs opacity-75">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-amber-400">{job.salaryRangeDisplay}</span>
                            <span>•</span>
                            <span>{job.experienceYearsText}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-400">{appsForThisJob.length} Applicants</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              const newStatus: JobStatus = job.status === 'PUBLISHED' ? 'PAUSED' : 'PUBLISHED';
                              careersService.toggleJobStatus(job.id, newStatus, session);
                              refreshData();
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              job.status === 'PUBLISHED'
                                ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                                : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            {job.status === 'PUBLISHED' ? 'Pause' : 'Publish'}
                          </button>

                          <button
                            onClick={() => loadJobIntoForm(job)}
                            className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-black transition-all cursor-pointer"
                            title="Edit Job"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteJob(job)}
                            className="p-2 rounded-xl bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white transition-all cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE / EDIT FORM */}
          {activeTab === 'CREATE' && (
            <form onSubmit={handleSaveJob} className="space-y-6 max-w-4xl mx-auto">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <h4 className="font-serif font-bold text-lg">
                  {selectedJobForEdit ? `Edit Job Opening: ${selectedJobForEdit.title}` : 'Create Brand New Job Opening'}
                </h4>
                <div className="flex items-center gap-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JobStatus)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors outline-none cursor-pointer ${
                      isDark ? 'bg-[#0B101C] border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="PUBLISHED">🟢 Published (Live)</option>
                    <option value="DRAFT">🟡 Draft (Hidden)</option>
                    <option value="PAUSED">🟠 Paused</option>
                    <option value="CLOSED">🔴 Closed</option>
                  </select>
                </div>
              </div>

              {/* Row 1: Title and Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Luxury Portfolio Advisor"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as JobDepartment)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-[#0B101C] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Location, Job Type, Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune (Baner HQ) / Mumbai"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Employment Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as JobType)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-[#0B101C] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Experience Range Text</label>
                  <input
                    type="text"
                    value={experienceYearsText}
                    onChange={(e) => setExperienceYearsText(e.target.value)}
                    placeholder="e.g. 4 - 8 Years"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: Compensation, Openings, Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">CTC Range Display *</label>
                  <input
                    type="text"
                    value={salaryRangeDisplay}
                    onChange={(e) => setSalaryRangeDisplay(e.target.value)}
                    placeholder="e.g. ₹24 - 36 LPA + Incentive Pool"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Openings Count</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={openingsCount}
                    onChange={(e) => setOpeningsCount(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Application Deadline</label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-[#0B101C] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-current/5 border border-current/10">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <span>Urgent Hiring Flag</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <span>Featured Position</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresMahaReraKnowledge}
                    onChange={(e) => setRequiresMahaReraKnowledge(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span>MahaRERA Credential / Knowledge Required</span>
                </label>
              </div>

              {/* Short Summary & Story */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Short Tagline Summary (1 - 2 sentences) *</label>
                  <input
                    type="text"
                    required
                    value={shortSummary}
                    onChange={(e) => setShortSummary(e.target.value)}
                    placeholder="e.g. Lead advisory mandates for HNI & NRI clients acquiring ₹2 Cr to ₹25 Cr curated residences."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Full Role Overview Story *</label>
                  <textarea
                    rows={4}
                    required
                    value={overviewStory}
                    onChange={(e) => setOverviewStory(e.target.value)}
                    placeholder="Provide the comprehensive context of this role, our ethos, client segments, and growth mandate..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none resize-none ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Dynamic Lists: Responsibilities, Requirements, Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Key Responsibilities (1 per line)</label>
                  <textarea
                    rows={6}
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    placeholder="Structure luxury client viewings&#10;Audit 70% escrow filings&#10;Present 3D digital twins"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none font-mono ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Requirements (1 per line)</label>
                  <textarea
                    rows={6}
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    placeholder="4+ years in luxury real estate&#10;Valid MahaRERA certificate&#10;Executive negotiation skills"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none font-mono ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Perks & Benefits (1 per line)</label>
                  <textarea
                    rows={6}
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    placeholder="Mercedes-Maybach site fleet access&#10;Quarterly incentive pools&#10;Family health cover"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none font-mono ${
                      isDark ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-current/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('LIST');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-current/15 text-xs font-bold hover:bg-current/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedJobForEdit ? 'Update Job Opening' : 'Publish Job Opening'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CANDIDATE APPLICATIONS (ATS REVIEW BOARD) */}
          {activeTab === 'APPLICATIONS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-lg">Candidate Applications ({applications.length})</h4>
                  <p className="text-xs opacity-75">Review received CVs, portfolio dossiers, and update ATS interview stages.</p>
                </div>

                <select
                  value={filterAppStatus}
                  onChange={(e) => setFilterAppStatus(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border transition-colors outline-none cursor-pointer ${
                    isDark ? 'bg-[#0B101C] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="ALL">All Application Stages</option>
                  <option value="NEW">🟢 New (Unreviewed)</option>
                  <option value="SHORTLISTED">⭐ Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">📅 Interview Scheduled</option>
                  <option value="OFFERED">💼 Offered</option>
                  <option value="REJECTED">❌ Rejected / Archived</option>
                </select>
              </div>

              {applications.length === 0 ? (
                <div className="p-12 text-center opacity-60 text-xs">
                  No candidate applications received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications
                    .filter((app) => (filterAppStatus === 'ALL' ? true : app.status === filterAppStatus))
                    .map((app) => (
                      <div
                        key={app.id}
                        className={`p-5 rounded-2xl border space-y-3 ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-base">{app.candidateName}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400">
                                {app.applicationRef}
                              </span>
                              {app.hasMahaReraCertification && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>MahaRERA Certified</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-amber-400 font-semibold">
                              Applied for: <strong>{app.jobTitle}</strong> ({app.jobDepartment})
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs opacity-75">
                              <span>📧 {app.candidateEmail}</span>
                              <span>•</span>
                              <span>📱 {app.candidatePhone}</span>
                              <span>•</span>
                              <span>📍 {app.currentLocation}</span>
                              <span>•</span>
                              <span>Exp: {app.totalExperienceYears} Years</span>
                              <span>•</span>
                              <span>Expected CTC: {app.expectedCtcLPA}</span>
                            </div>
                          </div>

                          {/* Stage Selector */}
                          <div className="flex items-center gap-2 shrink-0">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleUpdateAppStatus(app.id, e.target.value as CandidateApplicationStatus)
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors outline-none cursor-pointer ${
                                app.status === 'SHORTLISTED'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                  : app.status === 'INTERVIEW_SCHEDULED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : isDark
                                  ? 'bg-[#0B101C] border-white/15 text-white'
                                  : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            >
                              <option value="NEW">🟢 New</option>
                              <option value="REVIEWED">👀 Reviewed</option>
                              <option value="SHORTLISTED">⭐ Shortlisted</option>
                              <option value="INTERVIEW_SCHEDULED">📅 Interview</option>
                              <option value="OFFERED">💼 Offer Sent</option>
                              <option value="REJECTED">❌ Rejected</option>
                            </select>
                          </div>
                        </div>

                        {/* Current Company & Notes */}
                        {(app.currentCompany || app.coverNote) && (
                          <div className="p-3 rounded-xl bg-current/5 text-xs space-y-1.5">
                            {app.currentCompany && (
                              <div className="opacity-80">
                                Current Role: <strong>{app.currentDesignation || 'Associate'}</strong> at{' '}
                                <strong>{app.currentCompany}</strong> • Notice: <strong>{app.noticePeriodDays}</strong>
                              </div>
                            )}
                            {app.coverNote && (
                              <p className="text-[11px] opacity-75 italic">"{app.coverNote}"</p>
                            )}
                          </div>
                        )}

                        {/* Resume & Links */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-current/10 text-xs">
                          <div className="flex items-center gap-3">
                            {app.resumeFileName && (
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{app.resumeFileName}</span>
                              </div>
                            )}
                            {app.linkedInUrl && (
                              <a
                                href={app.linkedInUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <span>LinkedIn Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {app.portfolioUrl && (
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:underline flex items-center gap-1"
                              >
                                <span>Portfolio</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <div className="text-[10px] opacity-50 font-mono">
                            Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
