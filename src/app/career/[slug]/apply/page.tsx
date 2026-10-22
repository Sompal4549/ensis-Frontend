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
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Pencil,
  ShieldAlert,
} from "lucide-react";
import { serif, serifFontClass, greenButton, goldOutlineButton } from "@/components/career-v2/ui";
import { Container } from "@/components/ui/Container";
import { ProfileCard, JobSummaryCard, SectionCard } from "@/components/career-v2/flow/Cards";
import {
  submitApplication,
  getJob,
  verifyCandidatePhotoApi,
  type PublicJob,
  type Screening,
  type CandidateProfile,
  type ApplicationInput,
  type PhotoVerifyResponse,
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
import exploreBg from "@/assets/career/first-step/explore-bg.webp";

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
    preferredLocations: [],
    noticePeriod: "30 Days",
    expectedCtc: "As per company norms",
    joiningPreference: "Within 1 Month",
    howDidYouHear: "Careers Portal",
    willingToRelocate: true,
    employmentType: "Full Time",
  });

  const [additional, setAdditional] = useState<FlowAdditionalState>({
    whyJoin: "",
    extraSkills: "",
    workedWith: [],
  });

  // Two blank (optional) reference slots; empty ones are dropped on submit
  const [references, setReferences] = useState<FlowReferenceItem[]>([
    { name: "", designation: "", organization: "", phone: "", email: "" },
    { name: "", designation: "", organization: "", phone: "", email: "" },
  ]);
  const filledReferences = references.filter((r) => [r.name, r.phone, r.email].some((v) => v?.trim()));

  const [consents, setConsents] = useState<FlowConsentsState>({
    accurate: true,
    verify: true,
    futureContact: true,
    privacy: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<SubmittedAppRecord | null>(null);

  // Photo verification modal & state
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  const [photoVerificationResult, setPhotoVerificationResult] = useState<PhotoVerifyResponse | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  const handleOpenPhotoPicker = () => {
    setPhotoError(null);
    setPhotoSuccess(null);
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file (JPG, PNG, or WebP).");
      setIsPhotoModalOpen(true);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Image size exceeds 10 MB. Please choose a smaller photo.");
      setIsPhotoModalOpen(true);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setPhotoError(null);
    setPhotoSuccess(null);
    setPhotoVerificationResult(null);
    setIsPhotoModalOpen(true);
    setIsVerifyingPhoto(true);

    try {
      // Calculate age from profile.dateOfBirth or profile
      let calculatedAge: number | undefined = undefined;
      if (profile?.dateOfBirth) {
        const match = profile.dateOfBirth.match(/\b(19\d{2}|20\d{2})\b/);
        if (match) {
          calculatedAge = new Date().getFullYear() - parseInt(match[1], 10);
        }
      }

      const res = await verifyCandidatePhotoApi(file, {
        gender: profile?.gender || undefined,
        age: calculatedAge || undefined,
        dateOfBirth: profile?.dateOfBirth || undefined,
        name: profile?.fullName || undefined,
      });

      setPhotoVerificationResult(res);

      if (res.approved && res.photoUrl) {
        // Update profile in state
        const updatedProfile = { ...profile, photoUrl: res.photoUrl } as CandidateProfile;
        setProfile(updatedProfile);
        setPhotoSuccess(res.feedback || "Photo verified by AI and approved successfully!");

        // Persist to flow state
        const currentFlow = loadFlowState(slug) || {};
        saveFlowState({
          ...currentFlow,
          profile: updatedProfile,
          updatedAt: new Date().toISOString(),
        });

        // Also update ensis_last_submission if it exists
        try {
          const lastSub = localStorage.getItem("ensis_last_submission");
          if (lastSub) {
            const parsed = JSON.parse(lastSub);
            parsed.profile = updatedProfile;
            localStorage.setItem("ensis_last_submission", JSON.stringify(parsed));
          }
        } catch {}
      } else {
        const errorMsg =
          res.rejection_reasons?.[0] ||
          res.reason ||
          res.feedback ||
          "Photo could not be verified according to profile guidelines.";
        setPhotoError(errorMsg);
      }
    } catch (err: any) {
      console.error("Photo verification failed:", err);
      setPhotoError("Verification service temporarily unavailable. Please try again.");
    } finally {
      setIsVerifyingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!slug) return;
    const state = loadFlowState(slug);

    // The apply step needs a real AI screening from this browser's flow; without one, start the flow over
    if (!state?.screening?.result) {
      router.replace(`/career/${encodeURIComponent(slug)}`);
      return;
    }

    if (state.job) {
      setJob(state.job);
    } else {
      getJob(slug).then((fetched) => {
        if (fetched) setJob(fetched);
        else router.replace("/career");
      });
    }

    setScreening(state.screening);

    const prof = (state.profile || state.screening.result.profile) as CandidateProfile;
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
        references: filledReferences,
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
        candidateName: profile.fullName || "",
        email: profile.email,
        phone: profile.phone,
        profile,
        score: screening.result?.score,
        level: screening.result?.level,
        submittedAt: response.submittedAt,
      });

      // Save submission result into flow state
      saveFlowState({
        job,
        screeningId: screening.screeningId,
        screening,
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
          applicationId: idMatch ? idMatch[0] : "—",
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
    { id: 4, label: "Submit Application", sublabel: "Current Step", isCompleted: false, isCurrent: true },
  ];

  // Donut score for Profile Match card
  const score = Math.round(result.score ?? 0);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33] relative">
      {/* ════════ Hero Banner Using apply.png matching user mockup ════════ */}
      <section className="relative overflow-hidden bg-[#fbf4e2] min-h-[160px] sm:min-h-[180px] md:min-h-[195px] flex items-center">
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
        <div className="absolute inset-0 bg-[#fbf4e2]/92 lg:hidden" />
        <div className="absolute inset-0 hidden w-[68%] bg-gradient-to-r from-[#fbf4e2]/98 via-[#fbf4e2]/85 to-transparent lg:block" />

        <Container className="relative pt-8 sm:pt-9 md:pt-10 pb-3 sm:pb-3.5 z-10 w-full">
          <div className="max-w-[650px] space-y-1">
            {/* Breadcrumb matching mockup with clean responsive wrapping */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[#6b6255] font-medium leading-normal">
              <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center gap-1 whitespace-nowrap">
                <Home size={11} className="text-[#a8792c]" />
                <span>Home</span>
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <Link href="/career" className="hover:text-[#163a2b] transition-colors whitespace-nowrap">
                Careers
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <Link href={`/career/${encodeURIComponent(slug)}`} className="hover:text-[#163a2b] transition-colors whitespace-nowrap">
                Apply for Position
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <span className="text-[#163a2b] font-semibold whitespace-nowrap">Complete Application</span>
            </div>

            {/* Back link */}
            <div className="pt-0.5">
              <Link
                href={`/career/${encodeURIComponent(slug)}`}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#163a2b] hover:text-[#a8792c] transition-colors"
              >
                <ArrowLeft size={11} />
                <span>Back to Job Details</span>
              </Link>
            </div>

            {/* Heading: Complete Your Application */}
            <h1
              style={{ ...serif, fontWeight: 800 }}
              className="text-[1.35rem] sm:text-[1.85rem] lg:text-[2.1rem] font-extrabold tracking-tight text-[#163a2b] leading-[1.12] !mt-1"
            >
              Complete Your <span className="text-[#c89228]">Application</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs text-[#4a4237] leading-relaxed max-w-[560px] !mt-0.5">
              You&apos;re almost there! Please review and confirm your details to submit your application.
            </p>

            {/* 4-Step Stepper inside Banner with NO trailing border after Step 4 */}
            <div className="!mt-2.5 pt-1 w-full max-w-[640px]">
              <div className="relative grid grid-cols-4 w-full">
                {/* Connecting line from first to last circle centre (never past step 4) */}
                <div className="absolute top-[14px] sm:top-[16px] left-[12.5%] right-[12.5%] h-[1.5px] bg-[#1f4d34]" />
                {bannerSteps.map((step) => (
                  <React.Fragment key={step.id}>
                    <div className="relative flex flex-col items-center text-center">
                      <div
                        className={`size-7 sm:size-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm ring-2 ring-[#fbf4e2] transition-all ${
                          step.isCompleted
                            ? "bg-[#1f5a36] text-white"
                            : step.isCurrent
                            ? "bg-[#c8922a] text-white"
                            : "bg-[#fffdf8] text-[#8d6a3a] border border-[#eadfcd]"
                        }`}
                      >
                        {step.isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                      </div>
                      <p
                        className={`mt-1 text-[10px] sm:text-[13px] font-semibold leading-tight ${
                          step.isCurrent ? "text-[#a8792c]" : "text-[#163a2b]"
                        }`}
                      >
                        {step.id === 3 ? (
                          <>
                            Review<span className="hidden sm:inline"> Details</span>
                          </>
                        ) : step.id === 4 ? (
                          <>
                            Submit<span className="hidden sm:inline"> Application</span>
                          </>
                        ) : (
                          step.label
                        )}
                      </p>
                      <span
                        className={`mt-0.5 text-[9px] sm:text-[11px] font-medium leading-tight ${
                          step.isCurrent ? "text-[#a8792c]" : "text-[#3f5a4a]"
                        }`}
                      >
                        {step.sublabel}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Main 2-Column Content (explore-bg behind this section only) ── */}
      <section
        className="relative bg-[#fbf4e2] bg-no-repeat"
        style={{ backgroundImage: `url(${exploreBg.src})`, backgroundSize: "100% 100%" }}
      >
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
              onEditPhoto={handleOpenPhotoPicker}
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
      </section>

      {/* Hidden File Input for Profile Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handlePhotoSelected}
      />

      {/* AI Profile Photo Verification Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl border border-[#eadfcd] bg-[#fffdf9] p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#eadfcd]/70">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-[#f4ebd9] text-[#163a2b]">
                  <Sparkles size={14} className="text-[#c08a2e]" />
                </span>
                <div>
                  <h3 style={serif} className="font-bold text-base text-[#163a2b] leading-tight">
                    AI Profile Photo Verification
                  </h3>
                  <p className="text-[10px] text-[#554e42]">
                    Compliance check: real face, gender, age & safety standards
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="grid size-7 place-items-center rounded-full text-[#554e42] hover:bg-[#f4ebd9] hover:text-[#163a2b] transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Candidate Matching Context Badges */}
            <div className="flex items-center gap-2 flex-wrap text-[10.5px]">
              <span className="px-2 py-0.5 rounded-md bg-[#f4ebd9] text-[#163a2b] font-semibold border border-[#d9bf86]/50">
                Candidate: {profile?.fullName || "—"}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#e8f5ec] text-[#0c5931] font-semibold border border-[#d2ead9]">
                Gender: {profile?.gender || "—"}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#fff7ed] text-[#ea580c] font-semibold border border-[#ffedd5]">
                DOB: {profile?.dateOfBirth || "—"}
              </span>
            </div>

            {/* Photo Preview & Scanning Animation */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#faf6ee] border border-[#eadfcd]/80">
              <div className="relative size-28 rounded-xl overflow-hidden border-2 border-[#d9bf86] shadow-sm bg-white">
                {photoPreview ? (
                  <Image src={photoPreview} alt="Selected photo" fill className="object-cover" />
                ) : profile?.photoUrl ? (
                  <Image src={profile.photoUrl} alt="Current photo" fill className="object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center text-[#8d6a3a]">
                    <User size={40} />
                  </div>
                )}

                {/* Scanning Radar Overlay when verifying */}
                {isVerifyingPhoto && (
                  <div className="absolute inset-0 bg-emerald-900/30 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-2 text-center animate-pulse">
                    <Loader2 size={24} className="animate-spin text-white mb-1" />
                    <span className="text-[10px] font-bold tracking-wider">AI INSPECTING</span>
                  </div>
                )}

                {/* Approved Badge Overlay */}
                {photoSuccess && !isVerifyingPhoto && (
                  <div className="absolute bottom-1 right-1 grid size-6 place-items-center rounded-full bg-emerald-600 text-white shadow-xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Status / Feedback message */}
              {isVerifyingPhoto && (
                <div className="mt-3 text-center space-y-1">
                  <p className="text-xs font-bold text-[#163a2b] flex items-center justify-center gap-1.5">
                    <Loader2 size={13} className="animate-spin text-[#c08a2e]" />
                    <span>Analyzing face, gender, age & safety checks...</span>
                  </p>
                  <p className="text-[10.5px] text-[#554e42] max-w-xs">
                    AI is verifying: real human headshot, gender match{profile?.gender ? ` (${profile.gender})` : ""}, age appropriateness, zero nudity/violence/harassment.
                  </p>
                </div>
              )}

              {/* Success Alert */}
              {photoSuccess && !isVerifyingPhoto && (
                <div className="mt-3 w-full rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Photo Verified & Approved!</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-700 leading-snug">
                    {photoSuccess}
                  </p>
                  <div className="pt-1 flex items-center gap-2 flex-wrap text-[9.5px] text-emerald-800 font-semibold">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-300">✓ Real Face</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-300">✓ Gender Match</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-300">✓ Age Consistent</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-300">✓ Policy Passed</span>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {photoError && !isVerifyingPhoto && (
                <div className="mt-3 w-full rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-left space-y-1.5">
                  <div className="flex items-start gap-1.5 text-xs font-bold text-rose-800">
                    <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>Verification Failed</span>
                  </div>
                  <div className="text-[10.5px] text-rose-700 leading-snug space-y-1">
                    {photoVerificationResult?.rejection_reasons && photoVerificationResult.rejection_reasons.length > 0 ? (
                      photoVerificationResult.rejection_reasons.map((reason, idx) => (
                        <p key={idx} className="flex items-start gap-1">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{reason}</span>
                        </p>
                      ))
                    ) : (
                      <p>{photoError}</p>
                    )}
                  </div>
                  <div className="pt-1 text-[9.5px] text-rose-800 font-medium">
                    Please ensure the photo is a genuine solo portrait of yourself matching your stated gender and age without inappropriate content.
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-[#eadfcd]/60">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#554e42] hover:text-[#163a2b] cursor-pointer"
              >
                {photoSuccess ? "Close" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleOpenPhotoPicker}
                disabled={isVerifyingPhoto}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#163a2b] hover:bg-[#0c3363] disabled:opacity-50 text-white px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <Camera size={13} />
                <span>{photoSuccess ? "Change Again" : photoError ? "Choose Another Photo" : "Select Photo"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
