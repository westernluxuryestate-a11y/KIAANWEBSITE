/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  X,
  Briefcase,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Linkedin,
  Globe,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { JobPost, JobApplication } from '../types';
import { careersService } from '../services/careersService';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPost | null;
  theme?: 'dark' | 'light';
  onSuccess?: (app: JobApplication) => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  job,
  theme = 'dark',
  onSuccess,
}) => {
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Pune');
  const [totalExperienceYears, setTotalExperienceYears] = useState<number>(4);
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [expectedCtcLPA, setExpectedCtcLPA] = useState('');
  const [noticePeriodDays, setNoticePeriodDays] = useState('30 Days');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [hasMahaReraCertification, setHasMahaReraCertification] = useState(false);

  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeFileSize, setResumeFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  if (!isOpen || !job) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const name = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => name.endsWith(ext));

    if (!isValid) {
      setErrorMsg('Please upload a valid document in PDF or DOCX format.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10MB limit.');
      return;
    }

    setErrorMsg('');
    setResumeFileName(file.name);
    setResumeFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!candidateName.trim() || !candidateEmail.trim() || !candidatePhone.trim()) {
      setErrorMsg('Please provide your full legal name, email address, and active mobile number.');
      return;
    }

    if (!resumeFileName && !linkedInUrl.trim()) {
      setErrorMsg('Please either upload a resume document or provide your LinkedIn profile URL.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = careersService.submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        jobDepartment: job.departmentLabel || (job.department as string),
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        candidatePhone: candidatePhone.trim(),
        currentLocation: currentLocation.trim(),
        totalExperienceYears: Number(totalExperienceYears) || 0,
        currentCompany: currentCompany.trim(),
        currentDesignation: currentDesignation.trim(),
        expectedCtcLPA: expectedCtcLPA.trim() || 'Commensurate with Role',
        noticePeriodDays: noticePeriodDays.trim(),
        linkedInUrl: linkedInUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        resumeFileName: resumeFileName || undefined,
        resumeFileUrl: resumeFileName ? `local_blob_${Date.now()}` : undefined,
        coverNote: coverNote.trim(),
        hasMahaReraCertification,
      });

      setIsSubmitting(false);

      if (res.success && res.application) {
        setSubmittedApp(res.application);
        if (onSuccess) onSuccess(res.application);
      } else {
        setErrorMsg(res.error || 'Unable to submit application. Please try again.');
      }
    }, 600);
  };

  const resetForm = () => {
    setSubmittedApp(null);
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePhone('');
    setCurrentLocation('Pune');
    setTotalExperienceYears(4);
    setCurrentCompany('');
    setCurrentDesignation('');
    setExpectedCtcLPA('');
    setNoticePeriodDays('30 Days');
    setLinkedInUrl('');
    setPortfolioUrl('');
    setCoverNote('');
    setResumeFileName('');
    setResumeFileSize('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 my-auto ${
          isDark ? 'bg-[#0A0F1D] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-current/10 flex items-start justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-transparent to-red-500/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {job.departmentLabel}
              </span>
              <span className="text-xs opacity-70 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {job.location}
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-current leading-tight">
              {submittedApp ? 'Application Submitted' : `Apply: ${job.title}`}
            </h3>
            {!submittedApp && (
              <p className="text-xs opacity-70">
                CTC Range: <strong className="text-amber-400">{job.salaryRangeDisplay}</strong> • Experience:{' '}
                <strong>{job.experienceYearsText}</strong>
              </p>
            )}
          </div>

          <button
            onClick={resetForm}
            className="p-2 rounded-full hover:bg-current/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedApp ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="p-6 sm:p-10 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Application Tracking ID: {submittedApp.applicationRef}
              </span>
              <h4 className="font-serif font-bold text-2xl">Application Received</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Thank you, <strong className="text-current">{submittedApp.candidateName}</strong>. Your application for{' '}
                <strong className="text-amber-400">{job.title}</strong> has been directly dispatched to our Talent & Executive
                Board.
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border max-w-md mx-auto text-left space-y-3 ${
                isDark ? 'bg-white/5 border-white/10 text-xs' : 'bg-slate-50 border-slate-200 text-xs'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Next Steps in Selection</span>
              </div>
              <ul className="space-y-2 opacity-80 list-disc list-inside text-[11px] leading-relaxed">
                <li>Initial dossier review within 48 business hours by the Talent Acquisition team.</li>
                <li>Shortlisted candidates will receive a WhatsApp / Email invitation for the first-round conversation.</li>
                <li>Confidentiality and discretion are maintained across all applicant disclosures.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <span>Done & Return to Openings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* APPLICATION FORM */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Candidate Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <User className="w-4 h-4" />
                <span>Personal & Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80 flex items-center gap-1">
                    Full Legal Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Rahul Patil"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                        isDark
                          ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                          : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80 flex items-center gap-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="e.g. rahul.patil@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                        isDark
                          ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                          : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80 flex items-center gap-1">
                    Mobile Phone (+91 / WhatsApp) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      placeholder="e.g. +91 98220 12345"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                        isDark
                          ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                          : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80 flex items-center gap-1">
                    Current Location / City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Experience & Work Details */}
            <div className="space-y-4 pt-4 border-t border-current/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Briefcase className="w-4 h-4" />
                <span>Professional Experience & CTC</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Total Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={totalExperienceYears}
                    onChange={(e) => setTotalExperienceYears(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Current / Last Company</label>
                  <input
                    type="text"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    placeholder="e.g. Prestige / Lodha / Self"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Current Designation</label>
                  <input
                    type="text"
                    value={currentDesignation}
                    onChange={(e) => setCurrentDesignation(e.target.value)}
                    placeholder="e.g. Senior Portfolio Associate"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Expected CTC (LPA / Negotiable)</label>
                  <input
                    type="text"
                    value={expectedCtcLPA}
                    onChange={(e) => setExpectedCtcLPA(e.target.value)}
                    placeholder="e.g. ₹28 - 32 LPA"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80">Notice Period</label>
                  <select
                    value={noticePeriodDays}
                    onChange={(e) => setNoticePeriodDays(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-[#0A0F1D] border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  >
                    <option value="Immediate (0 - 7 Days)">Immediate (0 - 7 Days)</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>
              </div>

              {job.requiresMahaReraKnowledge && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-current">MahaRERA Agent / Legal Credential</div>
                      <div className="text-[11px] opacity-75">Do you hold active MahaRERA training or certification?</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasMahaReraCertification}
                    onChange={(e) => setHasMahaReraCertification(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Section 3: Links & Resume Upload */}
            <div className="space-y-4 pt-4 border-t border-current/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Upload className="w-4 h-4" />
                <span>Resume & Profiles</span>
              </div>

              {/* Drag and Drop Resume Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : resumeFileName
                    ? isDark
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-emerald-500 bg-emerald-50'
                    : isDark
                    ? 'border-white/20 hover:border-amber-400/50 bg-white/5'
                    : 'border-slate-300 hover:border-amber-500 bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                {resumeFileName ? (
                  <div className="flex items-center justify-center gap-3 text-emerald-400">
                    <FileText className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs font-bold truncate max-w-xs">{resumeFileName}</div>
                      <div className="text-[10px] opacity-75">{resumeFileSize} • Click to replace file</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold">
                      Drag & Drop your Resume here, or <span className="text-amber-400 underline">Browse</span>
                    </div>
                    <div className="text-[11px] opacity-60">Supports PDF, DOC, DOCX up to 10MB</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    <span>LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-80 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Portfolio / GitHub / Case Study URL</span>
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                        : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold opacity-80">
                  Brief Cover Note / Why Kiaan Properties? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Share a short summary of your luxury real estate or spatial engineering achievements..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors outline-none resize-none ${
                    isDark
                      ? 'bg-white/5 border-white/15 focus:border-amber-400 text-white'
                      : 'bg-white border-slate-300 focus:border-amber-500 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] opacity-60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted transmission & strict candidate privacy guaranteed.</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-current/15 text-xs font-bold hover:bg-current/5 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all ${
                    isSubmitting ? 'opacity-50 cursor-wait' : 'hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Candidacy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
