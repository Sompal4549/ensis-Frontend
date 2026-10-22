"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Plus,
  Trash2,
  Check,
  Camera,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { serif, greenButton, goldOutlineButton, Eyebrow } from "@/components/career-v2/ui";
import { FlowHero } from "@/components/career-v2/flow/FlowHero";
import { Container } from "@/components/ui/Container";
import { Stepper, APPLICATION_FLOW_STEPS } from "@/components/career-v2/flow/Stepper";
import { MatchRing } from "@/components/career-v2/flow/MatchRing";
import { SectionCard, CheckList, NumberedList } from "@/components/career-v2/flow/Cards";
import {
  uploadFile,
  type PublicJob,
  type Screening,
  type CandidateProfile,
  type EducationItem,
  type ExperienceItem,
  type SkillItem,
} from "@/lib/careerApi";
import {
  loadFlowState,
  saveFlowState,
  type FlowDetailsState,
  type FlowDocumentItem,
} from "@/lib/careerFlowV2";
import defaultAvatar from "@/assets/career/flow/default-avatar.webp";
import { jobLocation, jobType } from "@/lib/careers";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  // Editable sections toggle states
  const [editProfile, setEditProfile] = useState(false);
  const [editPosition, setEditPosition] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [editExperience, setEditExperience] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [editCerts, setEditCerts] = useState(false);

  // Position & details fields
  const [details, setDetails] = useState<FlowDetailsState>({
    preferredLocations: [],
    noticePeriod: "30 Days",
    expectedCtc: "As per company norms",
    joiningPreference: "Within 1 Month",
    howDidYouHear: "Careers Portal",
    willingToRelocate: true,
    employmentType: "Full Time",
  });

  // Additional documents
  const [documents, setDocuments] = useState<FlowDocumentItem[]>([
    { fileId: "doc_cv", label: "Resume / CV", fileName: "Resume.pdf", size: 2400000 },
    { fileId: "doc_portfolio", label: "Portfolio", fileName: "Portfolio.pdf", size: 5800000 },
    { fileId: "doc_edu", label: "Educational Certificates", fileName: "Educational_Certificates.pdf", size: 3100000 },
    { fileId: "doc_exp", label: "Experience Letter", fileName: "Experience_Letter.pdf", size: 1800000 },
  ]);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newCertName, setNewCertName] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slug) return;
    const state = loadFlowState(slug);
    if (!state || !state.screening?.result) {
      router.replace(`/career/${encodeURIComponent(slug)}`);
      return;
    }

    setJob(state.job);
    setScreening(state.screening);
    setProfile(state.profile || state.screening.result.profile);

    if (state.details) {
      setDetails((prev) => ({ ...prev, ...state.details }));
    }
    if (state.documents && state.documents.length > 0) {
      setDocuments(state.documents);
    }
  }, [slug, router]);

  if (!job || !screening?.result || !profile) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-[#fbf8f2]">
        <div className="size-10 rounded-full border-3 border-[#a8792c] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Guard: not_eligible candidates cannot proceed to application
  if (screening.result.level === "not_eligible") {
    return (
      <div className="min-h-screen bg-[#fbf8f2] flex items-center justify-center p-6">
        <div className="max-w-md bg-[#fffdf8] border border-[#eadfcd] rounded-2xl p-6 text-center space-y-4">
          <span className="grid size-12 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626] mx-auto">
            <AlertCircle size={24} />
          </span>
          <h2 style={serif} className="text-xl font-bold text-[#163a2b]">Application Restricted</h2>
          <p className="text-xs text-[#5f5647]">
            Based on the screening result, your profile does not meet the minimum eligibility threshold for {job.title}.
          </p>
          <Link href="/career" className={`${greenButton} w-full py-2.5 text-xs`}>
            Explore Other Roles
          </Link>
        </div>
      </div>
    );
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader for persistent Base64 so photo stays visible across sessions/pages
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfile((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, photoUrl: dataUrl };
        saveFlowState({ profile: updated });
        return updated;
      });
    };
    reader.readAsDataURL(file);

    try {
      await uploadFile(file, "photo");
    } catch (err) {
      console.warn("Avatar upload to backend:", err);
    }
  };

  const handleAddDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFile(file, "document");
    setDocuments((prev) => [
      ...prev,
      {
        fileId: uploaded?.fileId || `doc_${Date.now()}`,
        label: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        fileName: file.name,
        size: file.size,
      },
    ]);
  };

  const handleRemoveDocument = (fileId: string) => {
    setDocuments((prev) => prev.filter((d) => d.fileId !== fileId));
  };

  const handleAddEducation = () => {
    if (!profile) return;
    const newItem: EducationItem = {
      qualification: "Degree / Diploma",
      institute: "University / Institute",
      year: new Date().getFullYear().toString(),
      score: "First Class",
      specialization: "Relevant Discipline",
    };
    setProfile({ ...profile, education: [...profile.education, newItem] });
  };

  const handleRemoveEducation = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    });
  };

  const handleAddExperience = () => {
    if (!profile) return;
    const newItem: ExperienceItem = {
      organization: "Company Name",
      designation: "Role Title",
      from: "2022",
      to: "Present",
      responsibilities: "Key responsibilities and accomplishments in role",
    };
    setProfile({ ...profile, experience: [...profile.experience, newItem] });
  };

  const handleRemoveExperience = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index),
    });
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !profile) return;
    setProfile({
      ...profile,
      skills: [...profile.skills, { name: newSkillName.trim(), level: 80 }],
    });
    setNewSkillName("");
  };

  const handleRemoveSkill = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index),
    });
  };

  const handleAddCert = () => {
    if (!newCertName.trim() || !profile) return;
    setProfile({
      ...profile,
      certifications: [...profile.certifications, newCertName.trim()],
    });
    setNewCertName("");
  };

  const handleRemoveCert = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      certifications: profile.certifications.filter((_, i) => i !== index),
    });
  };

  const handleProceedToApply = () => {
    setValidationError(null);

    // Basic Validations
    if (!profile.fullName || profile.fullName.trim().length < 2) {
      setValidationError("Please enter a valid full name.");
      setEditProfile(true);
      return;
    }

    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setValidationError("Please provide a valid email address.");
      setEditProfile(true);
      return;
    }

    if (!profile.phone || profile.phone.replace(/\D/g, "").length < 10) {
      setValidationError("Please provide a valid 10-digit contact mobile number.");
      setEditProfile(true);
      return;
    }

    if (!profile.currentLocation) {
      setValidationError("Please enter your current location.");
      setEditProfile(true);
      return;
    }

    // Save state and proceed
    saveFlowState({
      job,
      profile,
      details,
      documents,
      updatedAt: new Date().toISOString(),
    });

    router.push(`/career/${encodeURIComponent(slug)}/apply`);
  };

  const result = screening.result;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33]">
      <FlowHero
        backHref={`/career/${encodeURIComponent(slug)}/result`}
        backLabel="← Back to AI Result"
        eyebrow="CAREERS AT ENSIS"
        title="Review Your Details"
        subtitle="Please review and verify your prefilled information below before submitting your application."
      />

      <Stepper currentStep={3} steps={APPLICATION_FLOW_STEPS} />

      <Container className="py-5 sm:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Main Left Content: 7 Detailed Sections */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {validationError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-3 text-xs sm:text-sm text-[#991b1b]">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#dc2626]" />
                <span className="font-semibold">{validationError}</span>
              </div>
            )}

            {/* 1. Candidate Profile */}
            <SectionCard
              icon={User}
              title="Candidate Profile"
              onEdit={() => setEditProfile(!editProfile)}
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Photo & Upload Photo button */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="group relative size-20 sm:size-24 cursor-pointer overflow-hidden rounded-full border-2 border-[#d9bf86] shadow-sm hover:border-[#163a2b] transition-all"
                    title="Click to upload profile photo"
                  >
                    {profile.photoUrl ? (
                      <Image
                        src={profile.photoUrl}
                        alt={profile.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full flex flex-col items-center justify-center bg-[#f4ebd9] text-[#163a2b] select-none">
                        {profile?.fullName ? (
                          <span className="font-bold text-xl sm:text-2xl tracking-wider text-[#163a2b]">
                            {profile.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .filter(Boolean)
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </span>
                        ) : (
                          <User size={32} className="text-[#8d6a3a]" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1">
                      <Camera size={16} />
                      <span>Upload</span>
                    </div>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8d6a3a] hover:text-[#163a2b] bg-[#f4ebd9]/80 hover:bg-[#eadfcd] px-3 py-1.5 rounded-lg border border-[#d9bf86]/50 transition-colors shadow-2xs"
                  >
                    <Camera size={13} />
                    <span>{profile.photoUrl ? "Change Photo" : "Upload Photo"}</span>
                  </button>
                  {!profile.photoUrl && (
                    <span className="text-[10px] text-[#a8792c] font-medium text-center max-w-[110px] leading-tight">
                      No photo in CV
                    </span>
                  )}
                </div>

                {/* Profile Fields */}
                <div className="flex-1 w-full">
                  {editProfile ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-[#163a2b]">Full Name *</label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#163a2b]">Email Address *</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#163a2b]">Mobile Number *</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#163a2b]">Date of Birth</label>
                        <input
                          type="text"
                          placeholder="e.g. 14 Nov 1995"
                          value={profile.dateOfBirth || ""}
                          onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                          className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#163a2b]">Gender</label>
                        <select
                          value={profile.gender || "Male"}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                          className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-[#163a2b]">Current Location *</label>
                        <input
                          type="text"
                          value={profile.currentLocation || ""}
                          onChange={(e) => setProfile({ ...profile, currentLocation: e.target.value })}
                          className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-semibold text-[#163a2b]">Permanent Address</label>
                        <input
                          type="text"
                          value={profile.permanentAddress || ""}
                          onChange={(e) => setProfile({ ...profile, permanentAddress: e.target.value })}
                          className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm">
                      <div>
                        <span className="text-[#8d6a3a] block text-[11px] font-semibold">Full Name</span>
                        <span className="font-bold text-[#163a2b]">{profile.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[#8d6a3a] block text-[11px] font-semibold">Email Address</span>
                        <span className="text-[#163a2b]">{profile.email}</span>
                      </div>
                      <div>
                        <span className="text-[#8d6a3a] block text-[11px] font-semibold">Mobile Number</span>
                        <span className="text-[#163a2b]">{profile.phone}</span>
                      </div>
                      <div>
                        <span className="text-[#8d6a3a] block text-[11px] font-semibold">Date of Birth & Gender</span>
                        <span className="text-[#163a2b]">{[profile.dateOfBirth, profile.gender].filter(Boolean).join(" • ") || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#8d6a3a] block text-[11px] font-semibold">Current Location</span>
                        <span className="text-[#163a2b]">{profile.currentLocation || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#8d6a3a] block text-[11px] font-semibold">Permanent Address</span>
                        <span className="text-[#163a2b] truncate block">{profile.permanentAddress || "—"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* 2. Position Details */}
            <SectionCard
              icon={Briefcase}
              title="Position Details"
              onEdit={() => setEditPosition(!editPosition)}
            >
              {editPosition ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#163a2b]">Position Applied For</label>
                    <input
                      type="text"
                      disabled
                      value={job.title}
                      className="mt-1 w-full rounded-md border border-[#eadfcd] bg-stone-100 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#163a2b]">Preferred Location</label>
                    <input
                      type="text"
                      value={details.preferredLocations.join(", ")}
                      onChange={(e) =>
                        setDetails({
                          ...details,
                          preferredLocations: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                      className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#163a2b]">Employment Type</label>
                    <input
                      type="text"
                      disabled
                      value={jobType(job)}
                      className="mt-1 w-full rounded-md border border-[#eadfcd] bg-stone-100 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#163a2b]">Expected Joining</label>
                    <select
                      value={details.joiningPreference}
                      onChange={(e) => setDetails({ ...details, joiningPreference: e.target.value })}
                      className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                    >
                      <option value="Immediately">Immediately</option>
                      <option value="Within 15 Days">Within 15 Days</option>
                      <option value="Within 1 Month">Within 1 Month</option>
                      <option value="More than 1 Month">More than 1 Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#163a2b]">Expected Salary (CTC)</label>
                    <input
                      type="text"
                      value={details.expectedCtc}
                      onChange={(e) => setDetails({ ...details, expectedCtc: e.target.value })}
                      className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#163a2b]">Notice Period</label>
                    <select
                      value={details.noticePeriod}
                      onChange={(e) => setDetails({ ...details, noticePeriod: e.target.value })}
                      className="mt-1 w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs focus:border-[#163a2b] focus:outline-none"
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#8d6a3a] block text-[11px] font-semibold">Position Applied For</span>
                    <span className="font-bold text-[#163a2b]">{job.title}</span>
                  </div>
                  <div>
                    <span className="text-[#8d6a3a] block text-[11px] font-semibold">Preferred Location(s)</span>
                    <span className="text-[#163a2b]">{details.preferredLocations.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-[#8d6a3a] block text-[11px] font-semibold">Employment Type</span>
                    <span className="text-[#163a2b]">{jobType(job)}</span>
                  </div>
                  <div>
                    <span className="text-[#8d6a3a] block text-[11px] font-semibold">Expected Joining</span>
                    <span className="text-[#163a2b]">{details.joiningPreference}</span>
                  </div>
                  <div>
                    <span className="text-[#8d6a3a] block text-[11px] font-semibold">Expected Salary (CTC)</span>
                    <span className="text-[#163a2b]">{details.expectedCtc}</span>
                  </div>
                  <div>
                    <span className="text-[#8d6a3a] block text-[11px] font-semibold">Notice Period</span>
                    <span className="text-[#163a2b]">{details.noticePeriod}</span>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* 3. Education Details */}
            <SectionCard
              icon={GraduationCap}
              title="Education Details"
              onEdit={() => setEditEducation(!editEducation)}
              actionButton={
                editEducation && (
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#163a2b] bg-[#e8efe9] px-2.5 py-1 rounded-md"
                  >
                    <Plus size={13} /> Add Row
                  </button>
                )
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#eadfcd] text-[11px] font-bold text-[#8d6a3a] uppercase tracking-wider">
                      <th className="pb-2.5">Qualification</th>
                      <th className="pb-2.5">Institute / University</th>
                      <th className="pb-2.5">Year</th>
                      <th className="pb-2.5">Score / CGPA</th>
                      <th className="pb-2.5">Specialization</th>
                      {editEducation && <th className="pb-2.5 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eadfcd]/60">
                    {profile.education.map((edu, idx) => (
                      <tr key={idx} className="hover:bg-[#fbf6ec]/40">
                        <td className="py-2.5 font-bold text-[#163a2b]">
                          {editEducation ? (
                            <input
                              type="text"
                              value={edu.qualification}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].qualification = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              className="rounded border border-[#eadfcd] p-1 text-xs w-28"
                            />
                          ) : (
                            edu.qualification
                          )}
                        </td>
                        <td className="py-2.5 text-[#5f5647]">
                          {editEducation ? (
                            <input
                              type="text"
                              value={edu.institute}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].institute = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              className="rounded border border-[#eadfcd] p-1 text-xs w-36"
                            />
                          ) : (
                            edu.institute
                          )}
                        </td>
                        <td className="py-2.5 text-[#5f5647]">
                          {editEducation ? (
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].year = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              className="rounded border border-[#eadfcd] p-1 text-xs w-16"
                            />
                          ) : (
                            edu.year
                          )}
                        </td>
                        <td className="py-2.5 text-[#5f5647]">
                          {editEducation ? (
                            <input
                              type="text"
                              value={edu.score}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].score = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              className="rounded border border-[#eadfcd] p-1 text-xs w-20"
                            />
                          ) : (
                            edu.score
                          )}
                        </td>
                        <td className="py-2.5 text-[#5f5647]">
                          {editEducation ? (
                            <input
                              type="text"
                              value={edu.specialization}
                              onChange={(e) => {
                                const copy = [...profile.education];
                                copy[idx].specialization = e.target.value;
                                setProfile({ ...profile, education: copy });
                              }}
                              className="rounded border border-[#eadfcd] p-1 text-xs w-32"
                            />
                          ) : (
                            edu.specialization
                          )}
                        </td>
                        {editEducation && (
                          <td className="py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveEducation(idx)}
                              className="text-[#dc2626] hover:bg-[#fee2e2] p-1 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* 4. Work Experience */}
            <SectionCard
              icon={Briefcase}
              title="Work Experience"
              onEdit={() => setEditExperience(!editExperience)}
              actionButton={
                editExperience && (
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#163a2b] bg-[#e8efe9] px-2.5 py-1 rounded-md"
                  >
                    <Plus size={13} /> Add Row
                  </button>
                )
              }
            >
              <div className="space-y-4">
                {profile.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#eadfcd]/70 bg-[#fbf6ec]/30 p-4 space-y-2 text-xs sm:text-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        {editExperience ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              placeholder="Designation"
                              value={exp.designation}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].designation = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              className="font-bold text-[#163a2b] rounded border border-[#eadfcd] p-1 text-xs w-48 block"
                            />
                            <input
                              type="text"
                              placeholder="Organization"
                              value={exp.organization}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].organization = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              className="text-[#5f5647] rounded border border-[#eadfcd] p-1 text-xs w-48 block"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="font-bold text-[#163a2b]">{exp.designation}</p>
                            <p className="text-[#8d6a3a] text-xs font-semibold">{exp.organization}</p>
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        {editExperience ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="From"
                              value={exp.from}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].from = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              className="rounded border border-[#eadfcd] p-1 text-xs w-16"
                            />
                            <span>–</span>
                            <input
                              type="text"
                              placeholder="To"
                              value={exp.to}
                              onChange={(e) => {
                                const copy = [...profile.experience];
                                copy[idx].to = e.target.value;
                                setProfile({ ...profile, experience: copy });
                              }}
                              className="rounded border border-[#eadfcd] p-1 text-xs w-20"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(idx)}
                              className="text-[#dc2626] hover:bg-[#fee2e2] p-1 rounded ml-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-[#6b6255]">
                            {exp.from} – {exp.to}
                          </span>
                        )}
                      </div>
                    </div>
                    {editExperience ? (
                      <textarea
                        rows={2}
                        value={exp.responsibilities}
                        onChange={(e) => {
                          const copy = [...profile.experience];
                          copy[idx].responsibilities = e.target.value;
                          setProfile({ ...profile, experience: copy });
                        }}
                        className="w-full rounded border border-[#eadfcd] p-2 text-xs"
                      />
                    ) : (
                      <p className="text-xs text-[#5f5647] leading-relaxed pt-1">
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 5. Skills with Bars */}
            <SectionCard
              icon={Sparkles}
              title="Skills"
              onEdit={() => setEditSkills(!editSkills)}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#163a2b]">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#8d6a3a]">{skill.level}%</span>
                          {editSkills && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(idx)}
                              className="text-[#dc2626]"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#eadfcd]/60">
                        <div
                          className="h-full rounded-full bg-[#163a2b]"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      {editSkills && (
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={skill.level}
                          onChange={(e) => {
                            const copy = [...profile.skills];
                            copy[idx].level = Number(e.target.value);
                            setProfile({ ...profile, skills: copy });
                          }}
                          className="w-full accent-[#163a2b] mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {editSkills && (
                  <div className="flex items-center gap-2 pt-3 border-t border-[#eadfcd]">
                    <input
                      type="text"
                      placeholder="Add new skill..."
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="rounded-md border border-[#eadfcd] p-1.5 text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="rounded-md bg-[#163a2b] text-white px-3 py-1.5 text-xs font-semibold"
                    >
                      Add Skill
                    </button>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* 6. Certifications & Licenses */}
            <SectionCard
              icon={Award}
              title="Certifications & Licenses"
              onEdit={() => setEditCerts(!editCerts)}
            >
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#d9bf86]/60 bg-[#fffaf0] px-3 py-1 text-xs font-semibold text-[#8d6a3a]"
                  >
                    <Award size={13} className="text-[#a8792c]" />
                    {cert}
                    {editCerts && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(idx)}
                        className="text-[#dc2626] ml-1"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {editCerts && (
                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#eadfcd]">
                  <input
                    type="text"
                    placeholder="Add certification..."
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    className="rounded-md border border-[#eadfcd] p-1.5 text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="rounded-md bg-[#163a2b] text-white px-3 py-1.5 text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              )}
            </SectionCard>

            {/* 7. Additional Documents */}
            <SectionCard
              icon={FileText}
              title="Additional Documents"
              actionButton={
                <div>
                  <input
                    ref={docInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleAddDocument}
                  />
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#163a2b] bg-[#e8efe9] px-3 py-1 rounded-md"
                  >
                    <Plus size={13} /> Upload Document
                  </button>
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.fileId}
                    className="flex items-center justify-between rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid size-9 place-items-center rounded-lg bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] shrink-0">
                        <FileText size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#163a2b] truncate">{doc.label}</p>
                        <p className="text-[10px] text-[#8d6a3a] truncate">
                          {doc.fileName || "Document.pdf"}{" "}
                          {doc.size ? `(${(doc.size / (1024 * 1024)).toFixed(1)} MB)` : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.fileId)}
                      className="text-[#991b1b] hover:bg-[#fee2e2] p-1 rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-3.5 sm:space-y-4">
            {/* Application Summary Card */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 shadow-xs space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8d6a3a]">
                Application Summary
              </span>
              <div className="flex items-center gap-3 pt-0.5">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-[#d9bf86] bg-[#f4ebd9]">
                  {profile.photoUrl ? (
                    <Image
                      src={profile.photoUrl}
                      alt={profile.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-[#f4ebd9] text-[#163a2b] select-none font-bold text-xs tracking-wider">
                      {profile?.fullName
                        ? profile.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : <User size={16} className="text-[#8d6a3a]" />}
                    </div>
                  )}
                </div>
                <div>
                  <h4 style={serif} className="text-sm sm:text-base font-bold text-[#163a2b]">
                    {job.title}
                  </h4>
                  <p className="text-xs text-[#6b6255]">
                    {jobLocation(job)} • {jobType(job)}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Match Donut Card */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8d6a3a] block mb-2">
                Profile Match
              </span>
              <MatchRing
                score={result.score}
                level={result.level}
                size="md"
                showLabel={true}
              />
            </div>

            {/* Key Strengths Identified Card */}
            {result.strengths && result.strengths.length > 0 && (
              <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 shadow-xs space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#163a2b] block">
                  Key Strengths Identified
                </span>
                <CheckList items={result.strengths.slice(0, 5)} />
              </div>
            )}

            {/* Areas for Improvement (Optional) Card */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 shadow-xs space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] block">
                  Areas for Improvement (Optional)
                </span>
                <NumberedList items={result.suggestions.slice(0, 4)} variant="amber" />
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleProceedToApply}
                className={`w-full ${greenButton} justify-center py-2.5 text-xs sm:text-sm font-bold shadow-md cursor-pointer`}
              >
                Submit Application <ArrowRight size={15} />
              </button>

              <Link
                href={`/career/${encodeURIComponent(slug)}/analysis`}
                className={`w-full ${goldOutlineButton} justify-center py-2 text-xs font-semibold`}
              >
                <ArrowLeft size={13} /> Back to AI Analysis
              </Link>
            </div>

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8d6a3a]">
              <ShieldCheck size={13} className="text-[#a8792c]" />
              <span>Your data is secure and will only be used for recruitment purposes.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
