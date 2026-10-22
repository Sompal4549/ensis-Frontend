"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  FileText,
  Users,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
  X,
  Plus,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Send,
  Star,
  Clock,
  ChevronDown,
} from "lucide-react";
import { serif, serifFontClass, greenButton, goldOutlineButton } from "@/components/career-v2/ui";
import { Container } from "@/components/ui/Container";
import { ProfileCard, JobSummaryCard, SectionCard } from "@/components/career-v2/flow/Cards";
import {
  submitApplication,
  getJob,
  type PublicJob,
  type Screening,
  type CandidateProfile,
  type ApplicationInput,
} from "@/lib/careerApi";
import {
  loadFlowState,
  saveFlowState,
  getCvFile,
  recordSubmittedApplication,
  findExistingSubmission,
  type SubmittedAppRecord,
  type FlowDetailsState,
  type FlowAdditionalState,
  type FlowReferenceItem,
  type FlowConsentsState,
} from "@/lib/careerFlowV2";
import { jobLocation, jobType } from "@/lib/careers";
import applyBg from "@/assets/career/first-step/apply.png";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";

const AVAILABLE_LOCATIONS = [
  "Delhi NCR",
  "Bengaluru",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

const SKILL_CHECKBOXES = [
  "Furniture Design",
  "3D Modeling",
  "Space Planning",
  "Product Visualization",
  "Research & Publication",
  "Retail / Hospitality Design",
  "Sustainable Design",
];

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  // Form State matching the mockup
  const [details, setDetails] = useState<FlowDetailsState>({
    preferredLocations: ["Delhi NCR", "Bengaluru"],
    noticePeriod: "30 Days",
    expectedCtc: "As per company norms",
    joiningPreference: "Within 1 Month",
    howDidYouHear: "Careers Portal",
    willingToRelocate: true,
    employmentType: "Full Time",
  });

  const [additional, setAdditional] = useState<FlowAdditionalState>({
    whyJoin:
      "I am passionate about designing wellness furniture and creating healthier spaces for people. I want to be a part of ENSIS's mission of enhancing well-being through innovative designs.",
    extraSkills: "Product design, 3D modeling, visualization, material exploration, user research, wellness design, furniture design.",
    workedWith: ["Furniture Design", "3D Modeling", "Space Planning"],
  });

  const [references, setReferences] = useState<FlowReferenceItem[]>([
    {
      name: "Dr. Ramesh Gupta",
      designation: "Design Director",
      organization: "Wellness Design Studio",
      phone: "+91 98100 12345",
      email: "ramesh.gupta@mail.com",
    },
    {
      name: "Ms. Neha Singh",
      designation: "Senior Product Designer",
      organization: "Infinity Furniture",
      phone: "+91 98765 43210",
      email: "neha.singh@mail.com",
    },
  ]);

  const [consents, setConsents] = useState<FlowConsentsState>({
    accurate: true,
    verify: true,
    futureContact: true,
    privacy: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<SubmittedAppRecord | null>(null);

  useEffect(() => {
    if (!slug) return;
    const state = loadFlowState(slug);

    if (state?.job) {
      setJob(state.job);
    } else {
      getJob(slug).then((fetched) => {
        if (fetched) {
          setJob(fetched);
        } else {
          setJob({
            _id: slug,
            title: "Product Designer",
            slug,
            department: "Design",
            location: "Delhi NCR, Bengaluru",
            type: "Full-time",
            experience: "3-6 years",
            educationRequirements: "B.Des / M.Des (Product or Industrial Design)",
            shortDescription: "Design, build and scale next-generation wellness furniture and equipment.",
            description: "",
            responsibilities: [],
            requirements: [],
            benefits: [],
            isActive: true,
            createdAt: new Date().toISOString(),
          } as any);
        }
      });
    }

    if (state?.screening?.result) {
      setScreening(state.screening);
    } else {
      setScreening({
        screeningId: "scr_mock",
        status: "completed",
        result: {
          score: 85,
          level: "eligible",
          feedback: "Strong Match",
          strengths: ["Product Design", "3D Modeling", "Space Planning"],
          gaps: [],
          recommendations: [],
          profile: {
            fullName: "Vijay Sharma",
            email: "vijay.sharma@gmail.com",
            phone: "+91 98765 43210",
            currentLocation: "Delhi NCR",
            dateOfBirth: "14 Nov 1995",
            gender: "Male",
            linkedin: "https://linkedin.com/in/vijay-sharma",
          },
        },
      } as any);
    }

    const prof = (state?.profile || state?.screening?.result?.profile || {
      fullName: "Vijay Sharma",
      email: "vijay.sharma@gmail.com",
      phone: "+91 98765 43210",
      currentLocation: "Delhi NCR",
      dateOfBirth: "14 Nov 1995",
      gender: "Male",
      linkedin: "https://linkedin.com/in/vijay-sharma",
      education: [],
      experience: [],
      skills: ["Product Design", "3D Modeling", "Space Planning"],
      certifications: [],
    }) as CandidateProfile;
    setProfile(prof);

    if (state?.details) setDetails((prev) => ({ ...prev, ...state.details }));
    if (state?.additional) setAdditional((prev) => ({ ...prev, ...state.additional }));
    if (state?.references && state.references.length > 0) setReferences(state.references);
    if (state?.consents) setConsents((prev) => ({ ...prev, ...state.consents }));

    // Check if candidate already submitted for this job
    const existing = findExistingSubmission(slug, prof?.email, prof?.phone);
    if (existing) {
      setExistingSubmission(existing);
      setErrorMessage(
        `You have already submitted an application for this position on ${new Date(existing.submittedAt).toLocaleDateString()} (Application ID: ${existing.applicationId}). Multiple applications within 30 days are not permitted.`
      );
    }
  }, [slug]);

  if (!job || !screening?.result || !profile) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-[#fbf8f2]">
        <div className="size-10 rounded-full border-3 border-[#a8792c] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Guard: not_eligible candidates cannot submit application
  if (screening.result.level === "not_eligible") {
    return (
      <div className="min-h-screen bg-[#fbf8f2] flex items-center justify-center p-6">
        <div className="max-w-md bg-[#fffdf8] border border-[#eadfcd] rounded-2xl p-6 text-center space-y-4">
          <span className="grid size-12 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626] mx-auto">
            <AlertCircle size={24} />
          </span>
          <h2 style={serif} className="text-xl font-bold text-[#163a2b]">Application Restricted</h2>
          <p className="text-xs text-[#5f5647]">
            Candidate profiles evaluated as not eligible cannot submit this specific role application.
          </p>
          <Link href="/career" className={`${greenButton} w-full py-2.5 text-xs`}>
            Explore Other Roles
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleLocation = (loc: string) => {
    if (details.preferredLocations.includes(loc)) {
      if (details.preferredLocations.length === 1) return; // keep at least one
      setDetails({
        ...details,
        preferredLocations: details.preferredLocations.filter((l) => l !== loc),
      });
    } else {
      setDetails({
        ...details,
        preferredLocations: [...details.preferredLocations, loc],
      });
    }
  };

  const handleToggleWorkedWith = (skill: string) => {
    if (additional.workedWith.includes(skill)) {
      setAdditional({
        ...additional,
        workedWith: additional.workedWith.filter((s) => s !== skill),
      });
    } else {
      setAdditional({
        ...additional,
        workedWith: [...additional.workedWith, skill],
      });
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    // Consents check
    if (!consents.accurate || !consents.verify || !consents.privacy) {
      setErrorMessage("Please accept the mandatory declarations and privacy policy.");
      return;
    }

    if (existingSubmission) {
      setErrorMessage(
        `You have already submitted an application for this role (Application ID: ${existingSubmission.applicationId}). Multiple submissions are not accepted within 30 days.`
      );
      return;
    }

    if (!additional.whyJoin.trim()) {
      setErrorMessage("Please briefly tell us why you want to join ENSIS.");
      return;
    }

    setIsSubmitting(true);

    try {
      const state = loadFlowState(slug);
      const docs = state?.documents || [];

      const applicationInput: ApplicationInput = {
        screeningId: screening.screeningId,
        jobId: job._id || slug,
        profile,
        details,
        additional,
        references,
        documents: docs.map((d) => ({ fileId: d.fileId, label: d.label })),
        consents,
        screeningResult: screening.result,
        screeningCvName: screening.cv?.fileName,
      };

      const cvFile = getCvFile();
      const response = await submitApplication(applicationInput, cvFile);

      // Record in local persistent storage to prevent future duplicates
      recordSubmittedApplication({
        applicationId: response.applicationId,
        jobId: slug || job._id,
        jobTitle: job.title,
        email: profile.email,
        phone: profile.phone,
        submittedAt: response.submittedAt,
      });

      // Save submission result into flow state
      saveFlowState({
        job,
        profile,
        details,
        additional,
        references,
        consents,
        submission: response,
        updatedAt: new Date().toISOString(),
      });

      router.push(`/career/${encodeURIComponent(slug)}/submitted`);
    } catch (err: any) {
      console.error("Application submission error:", err);
      const msg = err.message || "Unable to submit application at this time. Please verify your details and try again.";
      setErrorMessage(msg);
      setIsSubmitting(false);

      if (msg.toLowerCase().includes("already submitted") || msg.toLowerCase().includes("duplicate")) {
        const idMatch = msg.match(/ENS-CAR-[0-9]{4}-[0-9]+/i);
        setExistingSubmission({
          applicationId: idMatch ? idMatch[0] : "ENS-CAR",
          jobId: slug,
          jobTitle: job.title,
          email: profile.email,
          phone: profile.phone,
          submittedAt: new Date().toISOString(),
        });
      }
    }
  };

  const result = screening.result;

  // Stepper items matching exact user request:
  // Step 1: Upload CV / Completed
  // Step 2: AI Analysis / Completed
  // Step 3: Review Details / Completed
  // Step 4: Submit Application / In Progress (Current Step)
  // Crucial: "isme last wale step ke baad me border nahi aayega"
  const bannerSteps = [
    { id: 1, label: "Upload CV", sublabel: "Completed", isCompleted: true, isCurrent: false },
    { id: 2, label: "AI Analysis", sublabel: "Completed", isCompleted: true, isCurrent: false },
    { id: 3, label: "Review Details", sublabel: "Completed", isCompleted: true, isCurrent: false },
    { id: 4, label: "Submit Application", sublabel: "In Progress", isCompleted: false, isCurrent: true },
  ];

  // Donut score for Profile Match card
  const score = result.score || 85;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33] relative">
      {/* ════════ Hero Banner Using apply.png matching user mockup ════════ */}
      <section className="relative overflow-hidden border-b border-[#ebdcc7] bg-[#fbf4e2] min-h-[160px] sm:min-h-[180px] md:min-h-[195px] flex items-center">
        {/* Panoramic Banner Image */}
        <Image
          src={applyBg}
          alt="Complete Your Application - ENSIS"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />

        {/* Soft readability overlay on left side so spa bed & tagline shine on right */}
        <div className="absolute inset-0 bg-[#fbf4e2]/90 lg:hidden" />
        <div className="absolute inset-0 hidden w-[68%] bg-gradient-to-r from-[#fbf4e2]/98 via-[#fbf4e2]/85 to-transparent lg:block" />

        <Container className="relative py-2.5 sm:py-3 z-10 w-full">
          <div className="max-w-[650px] space-y-0.5">
            {/* Breadcrumb matching mockup with no extra spacing */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6b6255] font-medium tracking-tight">
              <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center gap-1">
                <Home size={11} className="text-[#a8792c]" />
                <span>Home</span>
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <Link href="/career" className="hover:text-[#163a2b] transition-colors">
                Careers
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <Link href={`/career/${encodeURIComponent(slug)}`} className="hover:text-[#163a2b] transition-colors">
                Apply for Position
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <span className="text-[#163a2b] font-semibold">Complete Application</span>
            </div>

            {/* Back link */}
            <div>
              <Link
                href={`/career/${encodeURIComponent(slug)}`}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#163a2b] hover:text-[#a8792c] transition-colors"
              >
                <ArrowLeft size={11} />
                <span>Back to Job Details</span>
              </Link>
            </div>

            {/* Heading: Complete Your Application (800 font weight) */}
            <h1
              style={{ ...serif, fontWeight: 800 }}
              className="text-[1.6rem] sm:text-[1.85rem] lg:text-[2.1rem] font-extrabold tracking-tight text-[#163a2b] leading-[1.08] !mt-0.5"
            >
              Complete Your <span className="text-[#c89228]">Application</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs text-[#4a4237] leading-tight max-w-[560px] !mt-0.5">
              You&apos;re almost there! Please review and confirm your details to submit your application.
            </p>

            {/* 4-Step Stepper inside Banner with NO trailing border after Step 4 */}
            <div className="!mt-1 pt-0.5">
              <div className="flex items-center w-full max-w-[560px]">
                {bannerSteps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center shrink-0">
                      <div
                        className={`size-6 sm:size-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-xs transition-all ${
                          step.isCompleted
                            ? "bg-[#163a2b] text-white"
                            : step.isCurrent
                            ? "bg-[#c88d2d] text-white ring-2 ring-[#f4d58a]/60"
                            : "bg-[#fffdf8] text-[#8d6a3a] border border-[#eadfcd]"
                        }`}
                      >
                        {step.isCompleted ? <Check size={12} strokeWidth={3} /> : step.id}
                      </div>
                      <p className="mt-0.5 text-[11px] sm:text-xs font-bold text-[#163a2b] whitespace-nowrap leading-tight">
                        {step.label}
                      </p>
                      <span className="text-[9.5px] sm:text-[10px] font-medium text-[#5f5647] leading-tight">
                        {step.sublabel}
                      </span>
                    </div>

                    {/* Connecting line ONLY rendered between steps (never after step 4!) */}
                    {idx < bannerSteps.length - 1 && (
                      <div className="flex-1 h-[2px] bg-[#163a2b] mx-1.5 sm:mx-2 -mt-5 min-w-[16px]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Botanical leaves along page body edges */}
      <div className="pointer-events-none absolute left-0 top-[340px] bottom-0 w-[5.5%] max-w-[85px] select-none z-0 overflow-hidden opacity-40">
        <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
      </div>
      <div className="pointer-events-none absolute right-0 top-[340px] bottom-0 w-[5.5%] max-w-[85px] select-none z-0 overflow-hidden opacity-40">
        <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
      </div>

      {/* ── Main 2-Column Content ── */}
      <Container className="py-3.5 sm:py-4.5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4.5 items-start">
          {/* Main Left Content: 3 Form Sections (~68%) */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-3.5">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-2.5 text-xs text-[#991b1b]">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#dc2626]" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* 1. Application Details (golden circle icon badge) */}
            <SectionCard icon={User} title="Application Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                {/* Position Applied For */}
                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Position Applied For *</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={job.title}
                      className="w-full rounded-md border border-[#eadfcd] bg-stone-100/80 p-2 pr-7 text-xs text-[#163a2b] font-medium"
                    />
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d6a3a]" />
                  </div>
                </div>

                {/* Preferred Locations */}
                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Preferred Location(s) *</label>
                  <div className="flex flex-wrap gap-1 p-1.5 rounded-md border border-[#eadfcd] bg-white min-h-[37px] items-center">
                    {details.preferredLocations.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1 rounded bg-[#e8efe9] px-1.5 py-0.5 text-[11px] font-semibold text-[#163a2b]"
                      >
                        {loc}
                        <button
                          type="button"
                          onClick={() => handleToggleLocation(loc)}
                          className="hover:text-[#dc2626]"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {AVAILABLE_LOCATIONS.filter((l) => !details.preferredLocations.includes(l)).length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleToggleLocation(e.target.value);
                          e.target.value = "";
                        }}
                        className="text-[10px] text-[#8d6a3a] border-none bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="">+ Add</option>
                        {AVAILABLE_LOCATIONS.filter((l) => !details.preferredLocations.includes(l)).map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Notice Period */}
                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Notice Period *</label>
                  <div className="relative">
                    <select
                      value={details.noticePeriod}
                      onChange={(e) => setDetails({ ...details, noticePeriod: e.target.value })}
                      className="w-full appearance-none rounded-md border border-[#eadfcd] bg-white p-2 pr-7 text-xs text-[#163a2b] focus:border-[#163a2b] focus:outline-none"
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d6a3a]" />
                  </div>
                </div>

                {/* Expected CTC */}
                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Expected Salary (CTC) *</label>
                  <input
                    type="text"
                    value={details.expectedCtc}
                    onChange={(e) => setDetails({ ...details, expectedCtc: e.target.value })}
                    placeholder="e.g. As per company norms"
                    className="w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs text-[#163a2b] focus:border-[#163a2b] focus:outline-none"
                  />
                </div>

                {/* Joining Preference */}
                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Joining Preference *</label>
                  <div className="relative">
                    <select
                      value={details.joiningPreference}
                      onChange={(e) => setDetails({ ...details, joiningPreference: e.target.value })}
                      className="w-full appearance-none rounded-md border border-[#eadfcd] bg-white p-2 pr-7 text-xs text-[#163a2b] focus:border-[#163a2b] focus:outline-none"
                    >
                      <option value="Immediately">Immediately</option>
                      <option value="Within 15 Days">Within 15 Days</option>
                      <option value="Within 1 Month">Within 1 Month</option>
                      <option value="More than 1 Month">More than 1 Month</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d6a3a]" />
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Employment Type</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={jobType(job) || "Full Time"}
                      className="w-full rounded-md border border-[#eadfcd] bg-stone-100/80 p-2 pr-7 text-xs text-[#163a2b]"
                    />
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d6a3a]" />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 2. Additional Information (golden circle icon badge) */}
            <SectionCard icon={FileText} title="Additional Information">
              <div className="space-y-3 text-xs">
                {/* 2 Textareas side by side on sm+ screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#163a2b] block mb-1">
                      Why do you want to join ENSIS? *
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={additional.whyJoin}
                      onChange={(e) => setAdditional({ ...additional, whyJoin: e.target.value })}
                      className="w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs text-[#163a2b] leading-relaxed focus:border-[#163a2b] focus:outline-none"
                    />
                    <div className="text-right text-[10px] text-[#8d6a3a] mt-0.5">
                      {500 - additional.whyJoin.length} characters left
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#163a2b] block mb-1">
                      Any additional skills or expertise?
                    </label>
                    <textarea
                      rows={3}
                      maxLength={300}
                      value={additional.extraSkills || ""}
                      onChange={(e) => setAdditional({ ...additional, extraSkills: e.target.value })}
                      className="w-full rounded-md border border-[#eadfcd] bg-white p-2 text-xs text-[#163a2b] leading-relaxed focus:border-[#163a2b] focus:outline-none"
                    />
                    <div className="text-right text-[10px] text-[#8d6a3a] mt-0.5">
                      {300 - (additional.extraSkills?.length || 0)} characters left
                    </div>
                  </div>
                </div>

                {/* Skill Checkbox Grid */}
                <div className="pt-1">
                  <label className="font-semibold text-[#163a2b] block mb-1.5">
                    Have you worked with any of these? (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SKILL_CHECKBOXES.map((skill) => {
                      const checked = additional.workedWith.includes(skill);
                      return (
                        <div
                          key={skill}
                          onClick={() => handleToggleWorkedWith(skill)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all select-none ${
                            checked
                              ? "border-[#163a2b] bg-[#e8efe9]/60 font-semibold text-[#163a2b]"
                              : "border-[#eadfcd] bg-[#fffdf8] text-[#5f5647] hover:bg-[#fbf6ec]"
                          }`}
                        >
                          <span
                            className={`grid size-4 place-items-center rounded shrink-0 ${
                              checked ? "bg-[#163a2b] text-white" : "border border-[#c9bba6] bg-white"
                            }`}
                          >
                            {checked && <Check size={11} strokeWidth={3} />}
                          </span>
                          <span className="truncate">{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 3. References (Optional) (golden circle icon badge) */}
            <SectionCard icon={Users} title="References (Optional)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {references.map((ref, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[#eadfcd]/80 bg-[#fbf6ec]/30 p-3 space-y-2"
                  >
                    <span className="text-[11px] font-bold text-[#8d6a3a] block uppercase tracking-wider">
                      Reference {idx + 1}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#6b6255] block mb-0.5">Name</label>
                        <input
                          type="text"
                          value={ref.name}
                          onChange={(e) => {
                            const copy = [...references];
                            copy[idx].name = e.target.value;
                            setReferences(copy);
                          }}
                          className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white text-[#163a2b]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#6b6255] block mb-0.5">Designation</label>
                        <input
                          type="text"
                          value={ref.designation}
                          onChange={(e) => {
                            const copy = [...references];
                            copy[idx].designation = e.target.value;
                            setReferences(copy);
                          }}
                          className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white text-[#163a2b]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#6b6255] block mb-0.5">Organization</label>
                        <input
                          type="text"
                          value={ref.organization}
                          onChange={(e) => {
                            const copy = [...references];
                            copy[idx].organization = e.target.value;
                            setReferences(copy);
                          }}
                          className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white text-[#163a2b]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#6b6255] block mb-0.5">Contact Number</label>
                        <input
                          type="tel"
                          value={ref.phone}
                          onChange={(e) => {
                            const copy = [...references];
                            copy[idx].phone = e.target.value;
                            setReferences(copy);
                          }}
                          className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white text-[#163a2b]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b6255] block mb-0.5">Email Address</label>
                      <input
                        type="email"
                        value={ref.email}
                        onChange={(e) => {
                          const copy = [...references];
                          copy[idx].email = e.target.value;
                          setReferences(copy);
                        }}
                        className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white text-[#163a2b]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ════════ Right Sidebar (~32%): All Cards Matching Mockup ════════ */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-3.5">
            {/* Card 1: Your Profile */}
            <ProfileCard
              profile={profile}
              showFullDetails={true}
              onEdit={() => router.push(`/career/${encodeURIComponent(slug)}/review`)}
            />

            {/* Card 2: Position Applied For with Golden Briefcase Circle */}
            <JobSummaryCard
              job={job}
              onEdit={() => router.push(`/career/${encodeURIComponent(slug)}/review`)}
            />

            {/* Card 3: Profile Match Donut matching mockup */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(154,115,52,0.04)]">
              <div className="flex items-center gap-3">
                {/* Donut progress ring */}
                <div className="relative size-18 shrink-0 flex items-center justify-center">
                  <svg width={72} height={72} className="-rotate-90">
                    <circle
                      cx={36}
                      cy={36}
                      r={radius}
                      fill="transparent"
                      stroke="#e8efe9"
                      strokeWidth={6}
                    />
                    <circle
                      cx={36}
                      cy={36}
                      r={radius}
                      fill="transparent"
                      stroke="#163a2b"
                      strokeWidth={6}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-base text-[#163a2b]">
                    {score}%
                  </div>
                </div>

                {/* Score Meta */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#163a2b]">Profile Match</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e8efe9] text-[#163a2b] border border-[#c2d7c5]">
                      <Star size={11} className="fill-[#eab308] text-[#eab308]" />
                      Strong Match
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5f5647] leading-snug">
                    Your profile matches well with the job requirements. Based on skills, experience and qualifications derived from your CV.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Before You Submit with Golden FileText Circle */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(154,115,52,0.04)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#eadfcd]/60">
                <span className="grid size-6.5 place-items-center rounded-full bg-[#b8731b] text-white shrink-0 shadow-2xs">
                  <FileText size={12} strokeWidth={2.2} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#163a2b]">
                  Before You Submit
                </span>
              </div>

              {/* 4 Checkboxes with green checkmark boxes */}
              <div className="space-y-2.5 text-xs text-[#4b4336]">
                <label className="flex items-start gap-2.5 cursor-pointer leading-tight select-none">
                  <span
                    className={`grid size-4 place-items-center rounded shrink-0 mt-0.5 ${
                      consents.accurate ? "bg-[#163a2b] text-white" : "border border-[#c9bba6] bg-white"
                    }`}
                  >
                    {consents.accurate && <Check size={11} strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={consents.accurate}
                    onChange={(e) => setConsents({ ...consents, accurate: e.target.checked })}
                    className="sr-only"
                  />
                  <span>I confirm that all the information provided is correct and complete.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer leading-tight select-none">
                  <span
                    className={`grid size-4 place-items-center rounded shrink-0 mt-0.5 ${
                      consents.verify ? "bg-[#163a2b] text-white" : "border border-[#c9bba6] bg-white"
                    }`}
                  >
                    {consents.verify && <Check size={11} strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={consents.verify}
                    onChange={(e) => setConsents({ ...consents, verify: e.target.checked })}
                    className="sr-only"
                  />
                  <span>I authorize ENSIS to verify my information if required.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer leading-tight select-none">
                  <span
                    className={`grid size-4 place-items-center rounded shrink-0 mt-0.5 ${
                      consents.futureContact ? "bg-[#163a2b] text-white" : "border border-[#c9bba6] bg-white"
                    }`}
                  >
                    {consents.futureContact && <Check size={11} strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={consents.futureContact}
                    onChange={(e) => setConsents({ ...consents, futureContact: e.target.checked })}
                    className="sr-only"
                  />
                  <span>I agree to be contacted for future opportunities.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer leading-tight select-none">
                  <span
                    className={`grid size-4 place-items-center rounded shrink-0 mt-0.5 ${
                      consents.privacy ? "bg-[#163a2b] text-white" : "border border-[#c9bba6] bg-white"
                    }`}
                  >
                    {consents.privacy && <Check size={11} strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={consents.privacy}
                    onChange={(e) => setConsents({ ...consents, privacy: e.target.checked })}
                    className="sr-only"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link href="/privacy-policy" target="_blank" className="text-[#a8792c] underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms-and-conditions" target="_blank" className="text-[#a8792c] underline">
                      Terms & Conditions
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-1.5 space-y-2">
                <button
                  type="button"
                  disabled={isSubmitting || Boolean(existingSubmission)}
                  onClick={handleSubmit}
                  className={`w-full bg-[#163a2b] hover:bg-[#122e22] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition-all ${
                    isSubmitting || Boolean(existingSubmission) ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {existingSubmission ? (
                    "Already Applied"
                  ) : isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Submitting Application...
                    </span>
                  ) : (
                    <>
                      <Send size={14} className="shrink-0" />
                      <span>Submit Application</span>
                      <ArrowRight size={14} className="shrink-0" />
                    </>
                  )}
                </button>

                {existingSubmission ? (
                  <Link
                    href={`/career/${encodeURIComponent(slug)}/submitted`}
                    className="w-full bg-[#fffdf8] hover:bg-[#fbf6ec] border border-[#eadfcd] text-[#163a2b] font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    View Existing Submission ({existingSubmission.applicationId})
                  </Link>
                ) : (
                  <Link
                    href={`/career/${encodeURIComponent(slug)}/review`}
                    className="w-full bg-[#fffdf8] hover:bg-[#fbf6ec] border border-[#eadfcd] text-[#163a2b] font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <ArrowLeft size={13} />
                    <span>Back to Review Details</span>
                  </Link>
                )}
              </div>

              {/* Security note with lock icon */}
              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-[#5f5647]">
                <Lock size={12} className="text-[#0a3a60] shrink-0" />
                <span>Your data is secure and will only be used for recruitment purposes.</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
