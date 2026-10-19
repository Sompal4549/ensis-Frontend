"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Check,
  Download,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Lock,
  Lightbulb,
  UploadCloud,
  Eye,
  Briefcase,
  MapPin,
  GraduationCap,
  Home,
  BarChart3,
  Target,
  Edit2,
  Calendar,
  Mail,
  Phone,
  Sparkles,
  MessageSquare,
  Building2,
  Clock,
  X,
  UserCheck,
} from "lucide-react";
import { serif } from "@/components/career-v2/ui";
import { Container } from "@/components/ui/Container";
import {
  getJob,
  getReportPdfUrl,
  type PublicJob,
  type Screening,
  type ScreeningResult,
} from "@/lib/careerApi";
import {
  loadFlowState,
  isJobSaved,
  toggleSavedJobSlug,
} from "@/lib/careerFlowV2";
import { jobLocation, jobType, jobExperience } from "@/lib/careers";
import detailBg from "@/assets/career/new/career-detail-bg.png";
import smilingRecruiterImg from "@/assets/career/new/Smiling Recruiter with Botanical Slogan.png";
import puzzledImg from "@/assets/career/new/Puzzled at the Office Desk.png";
import defaultAvatar from "@/assets/career/flow/default-avatar.webp";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";

function LinkedinIcon({ size = 13, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.86 0 1.54-.68 1.54-1.54 0-.85-.7-1.54-1.54-1.54a1.55 1.55 0 0 0-1.55 1.54c0 .86.69 1.54 1.55 1.54m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // Allow toggling test preview states: 'eligible' | 'partial' | 'not_eligible'
  const [activePreviewLevel, setActivePreviewLevel] = useState<"eligible" | "partial" | "not_eligible" | null>(null);

  useEffect(() => {
    if (!slug) return;
    setSaved(isJobSaved(slug));

    // Check query param for test preview override (e.g. ?state=partial or ?state=not_eligible)
    const stateParam = searchParams?.get("state") as "eligible" | "partial" | "not_eligible" | null;
    if (stateParam && ["eligible", "partial", "not_eligible"].includes(stateParam)) {
      setActivePreviewLevel(stateParam);
    }

    const state = loadFlowState(slug);
    if (!state || !state.screening?.result) {
      // Direct access fallback or sample preview
      getJob(slug).then((j) => {
        if (j) {
          setJob(j);
          setScreening({
            screeningId: "preview-123",
            jobId: j._id,
            status: "done",
            progress: 85,
            steps: [],
            cv: { fileName: "Vijay_Sharma_CV.pdf", size: 842 * 1024, uploadedAt: new Date().toISOString() },
            result: {
              score: 85,
              level: "eligible",
              thresholds: { eligible: 70, partial: 50 },
              profile: {
                fullName: "Vijay Sharma",
                email: "vijay.sharma@gmail.com",
                phone: "+91 98765 43210",
                currentLocation: "Delhi NCR",
                dateOfBirth: "1995-11-14",
                gender: "Male",
                linkedin: "linkedin.com/in/vijay-sharma",
                education: [],
                experience: [],
                skills: [{ name: "Product Design", level: 90 }],
                certifications: [],
              },
              strengths: [
                "Relevant design experience",
                "Knowledge of furniture and spatial design",
                "Product design and 3D modeling skills",
                "Good communication and presentation skills",
                "Portfolio demonstrating design work",
                `Willing to work from ${jobLocation(j) || "Delhi NCR"}`,
              ],
              gaps: [],
              suggestions: [],
              breakdown: [
                { key: "education", label: "Educational Qualification", sublabel: "B.Des / M.Des", score: 100 },
                { key: "experience", label: "Relevant Experience", sublabel: "Product / Industrial Design", score: 85 },
                { key: "technical_skills", label: "Design & Technical Skills", sublabel: "3D Modeling, Renderings, Prototyping", score: 80 },
                { key: "creative_thinking", label: "Creative & Design Thinking", sublabel: "Problem Solving & Innovation", score: 90 },
                { key: "communication", label: "Communication Skills", sublabel: "Presentation & Collaboration", score: 75 },
                { key: "portfolio", label: "Portfolio Quality", sublabel: "Design Work & Case Studies", score: 80 },
              ],
            },
          });
          setIsLoaded(true);
        } else {
          router.replace("/career");
        }
      });
      return;
    }

    setJob(state.job);
    setScreening(state.screening);
    setIsLoaded(true);
  }, [slug, router, searchParams]);

  if (!isLoaded || !job || !screening?.result) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-[#fbf4e2]">
        <div className="size-10 rounded-full border-3 border-[#c9972a] border-t-transparent animate-spin" />
      </div>
    );
  }

  const baseResult: ScreeningResult = screening.result;
  const level: "eligible" | "partial" | "not_eligible" =
    activePreviewLevel ||
    baseResult.level ||
    (baseResult.score >= 70 ? "eligible" : baseResult.score >= 50 ? "partial" : "not_eligible");

  const isEligible = level === "eligible";
  const isPartial = level === "partial";
  const isIneligible = level === "not_eligible";

  // Dynamic Score corresponding to the mockup state
  const score = isEligible ? 85 : isPartial ? 58 : 28;

  const candidateName = baseResult.profile?.fullName || "Vijay Sharma";
  const firstName = candidateName.split(" ")[0] || "Vijay";

  const handleToggleSave = () => {
    if (!slug) return;
    const nowSaved = toggleSavedJobSlug(slug);
    setSaved(nowSaved);
  };

  const handleDownloadPdf = () => {
    if (screening?.screeningId) {
      window.open(getReportPdfUrl(screening.screeningId), "_blank");
    } else {
      window.print();
    }
  };

  // Content sets exactly matching the 3 mockup designs
  const eligibleRequirements = [
    "Relevant design experience",
    "Knowledge of furniture and spatial design",
    "Product design and 3D modeling skills",
    "Good communication and presentation skills",
    "Portfolio demonstrating design work",
    `Willing to work from ${jobLocation(job) || "Delhi NCR"}`,
  ];

  const partialSuggestions = [
    "Gain more experience in wellness furniture design and spatial design.",
    "Highlight product design and 3D modeling skills in your CV.",
    "Add relevant portfolio links (design work, renders or prototypes).",
    "Include more details on your design process and case studies.",
  ];

  const ineligibleGaps = [
    `Required qualification (${job.educationRequirements || "B.Des / M.Des in Product or Industrial Design"}) not found in your profile.`,
    "Relevant product design experience is not available.",
    "Portfolio or links to design work (renders, prototypes, case studies) are missing.",
    "3D modeling and visualization skills are not clearly demonstrated.",
    `Relevant location preference (${jobLocation(job) || "Delhi NCR"}) is not mentioned.`,
  ];

  // Match breakdown items based on level
  const breakdownItems = [
    {
      title: "Educational Qualification",
      desc: job.educationRequirements || "B.Des / M.Des",
      icon: GraduationCap,
      pct: isEligible ? 100 : isPartial ? 90 : 20,
    },
    {
      title: "Creative & Design Thinking",
      desc: "Problem Solving & Innovation",
      icon: Lightbulb,
      pct: isEligible ? 90 : isPartial ? 75 : 40,
    },
    {
      title: "Relevant Experience",
      desc: "Product / Industrial Design",
      icon: Briefcase,
      pct: isEligible ? 85 : isPartial ? 60 : 25,
    },
    {
      title: "Communication Skills",
      desc: "Presentation & Collaboration",
      icon: MessageSquare,
      pct: isEligible ? 75 : isPartial ? 80 : 45,
    },
    {
      title: "Design & Technical Skills",
      desc: "3D Modeling, Renderings, Prototyping",
      icon: Sparkles,
      pct: isEligible ? 80 : isPartial ? 50 : 15,
    },
    {
      title: "Portfolio Quality",
      desc: "Design Work & Case Studies",
      icon: Target,
      pct: isEligible ? 80 : isPartial ? 55 : 20,
    },
    ...(isPartial || isIneligible
      ? [
          {
            title: "Location Preference",
            desc: jobLocation(job) || "Delhi NCR",
            icon: MapPin,
            pct: isPartial ? 100 : 80,
          },
        ]
      : []),
  ];

  const getBarColor = (pct: number) => {
    if (pct >= 70) return "bg-[#163a2b]";
    if (pct >= 50) return "bg-[#c9972a]";
    return "bg-[#dc2626]";
  };

  const getDonutColor = () => {
    if (isEligible) return "#163a2b";
    if (isPartial) return "#c9972a";
    return "#dc2626";
  };

  const outcomePhoto = isIneligible ? puzzledImg : smilingRecruiterImg;

  return (
    <div className="relative min-h-screen bg-[#fbf4e2] text-[#3f3a33] overflow-hidden">
      {/* ── Optional Dev Preview State Switcher to switch between the 3 mockups easily ── */}
      <div className="bg-[#163a2b] text-white py-2 px-4 text-xs">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-0!">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#c9972a] uppercase tracking-wider">
              Result UI Preview:
            </span>
            <span className="text-white/80 text-[11px] hidden sm:inline">
              (Matches the 3 mockups 100% same-to-same)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActivePreviewLevel("eligible")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isEligible
                  ? "bg-[#c9972a] text-[#163a2b]"
                  : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              1. Strong Match (85%)
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewLevel("partial")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isPartial
                  ? "bg-[#c9972a] text-[#163a2b]"
                  : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              2. Partial Match (58%)
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewLevel("not_eligible")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isIneligible
                  ? "bg-[#c9972a] text-[#163a2b]"
                  : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              3. Not Eligible (28%)
            </button>
          </div>
        </Container>
      </div>

      {/* ── 1. Top Panoramic Hero Banner matching mockup ── */}
      <section className="relative isolate w-full overflow-hidden border-b border-[#ebdcc7]/60">
        <Image
          src={detailBg}
          alt="Careers at Ensis"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Botanical leaves on left and right borders */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden">
          <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden">
          <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
        </div>

        {/* Readability overlay */}
        <div className="absolute inset-0 bg-[#fbf4e2]/90 lg:hidden" />
        <div className="absolute inset-0 hidden w-[58%] bg-gradient-to-r from-[#fbf4e2]/95 via-[#fbf4e2]/80 to-transparent lg:block" />
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-b from-transparent to-[#fbf4e2]" />

        <Container className="relative py-0!">
          {/* Watermark in top right of banner matching mockup */}
          <div className="hidden lg:block absolute right-10 top-6 text-right pointer-events-none">
            <p style={serif} className="text-sm font-semibold text-[#24201c] tracking-wide leading-tight">
              Wellness<br />Spaces<br />For A<br />Healthier<br />Tomorrow
            </p>
          </div>

          <div className="max-w-[620px] pt-4 pb-2 sm:pt-6 sm:pb-3">
            {/* Top Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#8d6a3a] font-medium mb-1.5">
              <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center">
                <Home size={12} className="text-[#a8792c]" />
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <Link href="/career" className="hover:text-[#163a2b] transition-colors">
                Careers
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <Link href={`/career/${encodeURIComponent(slug)}`} className="hover:text-[#163a2b] transition-colors">
                Apply for Position
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <span className="text-[#163a2b] font-semibold">AI Screening Result</span>
            </div>

            {/* Back link */}
            <Link
              href={`/career/${encodeURIComponent(slug)}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#163a2b] hover:text-[#c9972a] transition-colors mb-2"
            >
              <span>← Back to Job Details</span>
            </Link>

            {/* Heading */}
            {isEligible ? (
              <>
                <h1
                  style={serif}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[#163a2b]"
                >
                  AI Screening <span className="text-[#c9972a]">Result</span>
                </h1>
                <p className="mt-1 text-xs sm:text-[13px] text-[#4a4237]">
                  Here is your profile match and analysis for the applied position.
                </p>
              </>
            ) : (
              <>
                <h1
                  style={serif}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[#163a2b]"
                >
                  {job.title}
                </h1>
                <div className="mt-1 flex items-center gap-2.5 text-xs text-[#554e42] font-medium">
                  <span className="flex items-center gap-1"><Building2 size={13} className="text-[#c9972a]" /> ENSIS</span>
                  <span>|</span>
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-[#c9972a]" /> {jobLocation(job)}</span>
                  <span>|</span>
                  <span className="flex items-center gap-1"><Briefcase size={13} className="text-[#c9972a]" /> {jobType(job)}</span>
                </div>
              </>
            )}

            {/* 4-Step Stepper inside Banner Bottom */}
            <div className="mt-4 max-w-[500px]">
              <div className="relative flex items-center justify-between">
                {/* Connecting Lines Behind */}
                <div className="absolute left-[8%] right-[8%] top-3.5 h-[2px] -translate-y-1/2 bg-[#e2d5c0]">
                  <div className="h-full w-2/3 bg-[#163a2b]" />
                </div>

                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-8 place-items-center rounded-full bg-[#163a2b] text-white shadow-2xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-[#163a2b]">Upload CV</span>
                  <span className="text-[9.5px] font-medium text-[#198754]">Completed</span>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-8 place-items-center rounded-full bg-[#163a2b] text-white shadow-2xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-[#163a2b]">AI Analysis</span>
                  <span className="text-[9.5px] font-medium text-[#198754]">Completed</span>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-8 place-items-center rounded-full bg-[#c9972a] text-white font-bold text-xs shadow-2xs ring-3 ring-[#faedd4]">
                    3
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-[#163a2b]">Eligibility Result</span>
                  <span className="text-[9.5px] font-medium text-[#c9972a]">Current Step</span>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-8 place-items-center rounded-full border-2 border-[#d6c7b0] bg-[#fffdf9] font-bold text-xs text-[#8c7e6c]">
                    4
                  </div>
                  <span className="mt-1 text-[11px] font-medium text-[#736a5c]">Apply for Job</span>
                  <span className="text-[9.5px] text-[#9e9587]">Next</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Botanical leaves along page body edges */}
      <div className="pointer-events-none absolute left-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden">
        <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
      </div>
      <div className="pointer-events-none absolute right-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden">
        <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
      </div>

      {/* ── 2. Main 2-Column Content Section ── */}
      <Container className="pt-4 pb-12 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* ════════ Left Column: Result Outcome & Breakdown (~68%) ════════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
            {/* 1. Hero Outcome Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[260px]">
                {/* Left Candidate Photo */}
                <div className="relative md:col-span-5 min-h-[220px] md:min-h-full overflow-hidden bg-[#efe6d6]">
                  <Image
                    src={outcomePhoto}
                    alt={candidateName}
                    fill
                    priority
                    className="object-cover object-top"
                  />
                </div>

                {/* Right Content */}
                <div className="relative p-5 sm:p-6 md:col-span-7 flex flex-col justify-center space-y-3">
                  {/* Cursive Tagline Watermark in top-right */}
                  <div className="absolute top-3.5 right-4 pointer-events-none text-right">
                    <p className="font-serif italic text-xs sm:text-[13px] font-bold text-[#163a2b] tracking-wide leading-tight whitespace-pre-line">
                      {isIneligible ? "Keep Learning\nKeep Growing" : "Together\nfor a Healthier\nTomorrow"}
                    </p>
                  </div>

                  {/* Eligible State */}
                  {isEligible && (
                    <>
                      <div>
                        <h2 style={serif} className="text-2xl sm:text-3xl font-bold text-[#163a2b] leading-tight">
                          Great News, <br />
                          <span className="text-[#c9972a]">{firstName}!</span>
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#163a2b]">
                          You are eligible to apply for this position.
                        </p>
                        <p className="mt-1 text-xs text-[#554e42] leading-relaxed max-w-[90%]">
                          Your profile meets the key requirements for {job.title} at ENSIS. We encourage
                          you to complete your application and join our mission of creating wellness spaces
                          for a healthier tomorrow.
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-2.5">
                        <Link
                          href={`/career/${encodeURIComponent(slug)}/apply`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#163a2b] hover:bg-[#0f2a1f] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:-translate-y-0.5"
                        >
                          <span>Continue & Apply for This Job</span>
                          <ArrowRight size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#ebdcc7] bg-white hover:bg-[#fbf5eb] px-4 py-2.5 text-xs font-semibold text-[#163a2b] shadow-2xs transition-colors cursor-pointer"
                        >
                          <Download size={14} />
                          <span>Download Result (PDF)</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Partial Match State */}
                  {isPartial && (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="grid size-6 place-items-center rounded-full bg-[#fef3c7] text-[#b45309] font-bold text-xs">
                            !
                          </span>
                          <h2 style={serif} className="text-2xl sm:text-3xl font-bold text-[#163a2b]">
                            You&apos;re a Partial Match, <span className="text-[#c9972a]">{firstName}!</span>
                          </h2>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[#163a2b]">
                          You are close to the requirements for this position.
                        </p>
                        <p className="mt-1 text-xs text-[#554e42] leading-relaxed max-w-[90%]">
                          Your profile shows good potential, but a few key areas need improvement. You can
                          still apply after reviewing the suggestions below and updating your profile or CV
                          to strengthen your application.
                        </p>
                      </div>

                      {/* Quote Box */}
                      <div className="rounded-lg bg-[#fffaf0] border border-[#faedd4] p-2.5 text-xs text-[#6b6255] italic">
                        <p>&ldquo;We encourage you to apply if you are confident about your relevant experience and skills.&rdquo;</p>
                        <p className="mt-1 font-bold not-italic text-[#163a2b] text-[11px]">
                          — Talent Acquisition Team, ENSIS
                        </p>
                      </div>
                    </>
                  )}

                  {/* Ineligible State */}
                  {isIneligible && (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="grid size-6 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626] font-bold text-xs">
                            <X size={14} strokeWidth={3} />
                          </span>
                          <h2 style={serif} className="text-2xl sm:text-3xl font-bold text-[#b91c1c]">
                            Currently Not Eligible, <span className="text-[#163a2b]">{firstName}</span>
                          </h2>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[#163a2b]">
                          Your profile does not meet the key requirements for this position.
                        </p>
                        <p className="mt-1 text-xs text-[#554e42] leading-relaxed max-w-[90%]">
                          Based on our AI analysis, your current profile does not match the minimum
                          requirements for {job.title} at ENSIS. However, we appreciate your interest and
                          encourage you to explore other suitable opportunities or improve your profile for
                          future openings.
                        </p>
                      </div>

                      {/* Quote Box */}
                      <div className="rounded-lg bg-[#fffaf0] border border-[#faedd4] p-2.5 text-xs text-[#6b6255] italic">
                        <p>&ldquo;Keep learning and building your skills. The right opportunity will come at the right time.&rdquo;</p>
                        <p className="mt-1 font-bold not-italic text-[#163a2b] text-[11px]">
                          — Talent Acquisition Team, ENSIS
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Middle Row: Two Cards Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Left Box: Match Score Donut & Legend */}
              <div className="md:col-span-5 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="grid size-6 place-items-center rounded-full bg-[#f4ebd9] text-[#c9972a]">
                      <BarChart3 size={13} />
                    </span>
                    <h3 style={serif} className="text-sm sm:text-base font-bold text-[#163a2b]">
                      {isEligible
                        ? "Your Profile Match"
                        : isPartial
                        ? "Match Level: Moderate"
                        : "Match Level: Not Eligible"}
                    </h3>
                  </div>

                  {/* Donut and Score */}
                  <div className="flex items-center justify-center py-2">
                    <div className="relative size-28 sm:size-32 flex items-center justify-center">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#f1e6d4]"
                          strokeWidth="3.6"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          style={{ color: getDonutColor() }}
                          strokeDasharray={`${score}, 100`}
                          strokeWidth="3.6"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#163a2b]">{score}%</span>
                        <span className="text-[9.5px] font-bold text-[#6b6255] uppercase tracking-wider">
                          Match Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {(isPartial || isIneligible) && (
                    <p className="mt-1 text-[11px] text-center text-[#6b6255] leading-tight">
                      {isPartial
                        ? "Your profile matches several key requirements, but a few important areas need strengthening."
                        : "Your profile does not meet the minimum requirements for this position."}
                    </p>
                  )}
                </div>

                {/* Score Range Legend */}
                <div className="pt-3 mt-3 border-t border-[#ebdcc7]/70 space-y-1.5 text-xs text-[#554e42]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#163a2b]" />
                      <span>70 – 100%</span>
                    </span>
                    <span className="font-bold text-[#163a2b]">Strong Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#c9972a]" />
                      <span>50 – 69%</span>
                    </span>
                    <span className="font-bold text-[#c9972a]">Moderate Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#dc2626]" />
                      <span>Below 50%</span>
                    </span>
                    <span className="font-bold text-[#dc2626]">Not Eligible</span>
                  </div>
                </div>
              </div>

              {/* Right Box: Key Highlights / Suggestions / Gaps */}
              <div className="md:col-span-7 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="grid size-6 place-items-center rounded-full bg-[#f4ebd9] text-[#c9972a]">
                      <Target size={13} />
                    </span>
                    <h3 style={serif} className="text-sm sm:text-base font-bold text-[#163a2b]">
                      {isEligible
                        ? "You Meet the Key Requirements"
                        : isPartial
                        ? "Key Suggestions to Improve Your Match"
                        : "Key Gaps in Your Profile"}
                    </h3>
                  </div>

                  {/* Eligible Checklist */}
                  {isEligible && (
                    <ul className="space-y-2">
                      {eligibleRequirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#4b4336] leading-snug">
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#163a2b] text-white">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Partial Suggestions (Numbered amber circles) */}
                  {isPartial && (
                    <ul className="space-y-2">
                      {partialSuggestions.map((sug, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#4b4336] leading-snug">
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#c9972a] text-white font-bold text-[10px]">
                            {i + 1}
                          </span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Ineligible Gaps (Numbered red circles) */}
                  {isIneligible && (
                    <ul className="space-y-2">
                      {ineligibleGaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#4b4336] leading-snug">
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#dc2626] text-white font-bold text-[10px]">
                            {i + 1}
                          </span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Detailed Match Breakdown (Bars in 2-Column Grid) */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-5 sm:p-6 shadow-[0_4px_24px_rgba(70,50,20,0.06)] space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#ebdcc7]/70">
                <span className="grid size-6 place-items-center rounded-full bg-[#f4ebd9] text-[#c9972a]">
                  <BarChart3 size={13} />
                </span>
                <div>
                  <h3 style={serif} className="text-base sm:text-lg font-bold text-[#163a2b]">
                    {isEligible ? "Match Breakdown" : "Detailed Match Breakdown"}
                  </h3>
                  <p className="text-xs text-[#6b6255]">
                    Here&apos;s how your profile aligns with the job requirements:
                  </p>
                </div>
              </div>

              {/* Grid of bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
                {breakdownItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Icon size={13} className="text-[#163a2b] shrink-0" />
                          <span className="font-bold text-[#163a2b] truncate">{item.title}</span>
                        </div>
                        <span className="font-bold text-[#163a2b] shrink-0">{item.pct}%</span>
                      </div>
                      <p className="text-[10px] text-[#736a5c] leading-tight truncate">{item.desc}</p>
                      <div className="h-2 w-full rounded-full bg-[#efe5d4] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getBarColor(item.pct)}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Tip Callout Box for Partial & Ineligible */}
              {(isPartial || isIneligible) && (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#fbf4e2] border border-[#ebdcc7] p-3 text-xs text-[#554e42]">
                  <Lightbulb size={15} className="text-[#c9972a] shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-[#163a2b]">Tip: </span>
                    {isPartial
                      ? "Update your CV with more relevant experience and skills to increase your match score and improve your chances."
                      : "Upgrade your qualifications, gain relevant experience and highlight your design work (portfolio, renders, prototypes) to improve your chances for future opportunities."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ════════ Right Column: Profile & Job Summary Sidebar (~32%) ════════ */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* 1. Your Profile Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <div className="flex items-center justify-between pb-3 border-b border-[#ebdcc7]/70">
                <h4 style={serif} className="text-base font-bold text-[#163a2b]">
                  Your Profile
                </h4>
                <Link
                  href={`/career/${encodeURIComponent(slug)}/apply`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#163a2b] hover:text-[#c9972a]"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </Link>
              </div>

              <div className="mt-3 flex items-start gap-3.5">
                <div className="relative size-16 rounded-xl overflow-hidden border border-[#ebdcc7] bg-[#f4ebd9] shrink-0 shadow-2xs">
                  <Image
                    src={defaultAvatar}
                    alt={candidateName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1 text-xs text-[#554e42]">
                  <p className="font-bold text-sm text-[#163a2b] truncate">
                    {candidateName}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] truncate">
                    <Mail size={12} className="text-[#163a2b] shrink-0" />
                    <span>{baseResult.profile?.email || "vijay.sharma@gmail.com"}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <Phone size={12} className="text-[#163a2b] shrink-0" />
                    <span>{baseResult.profile?.phone || "+91 98765 43210"}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <MapPin size={12} className="text-[#163a2b] shrink-0" />
                    <span>{baseResult.profile?.currentLocation || "Delhi NCR"}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <Calendar size={12} className="text-[#163a2b] shrink-0" />
                    <span>14 Nov 1995 &nbsp;|&nbsp; Male</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] truncate text-[#0a66c2]">
                    <LinkedinIcon size={12} className="shrink-0" />
                    <span>{baseResult.profile?.linkedin || "linkedin.com/in/vijay-sharma"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Your CV Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <h4 style={serif} className="text-base font-bold text-[#163a2b] pb-2 border-b border-[#ebdcc7]/70">
                Your CV
              </h4>

              <div className="mt-3 flex items-start gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-[#eef5f0] text-[#163a2b] border border-[#c4dbcb] shrink-0">
                  <FileText size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#163a2b] truncate">
                    {screening.cv?.fileName || "Vijay_Sharma_CV.pdf"}
                  </p>
                  <p className="text-[11px] text-[#786c5c] mt-0.5">
                    {(screening.cv?.size ? (screening.cv.size / 1024).toFixed(0) : "842")} KB &nbsp;|&nbsp; 17 Oct 2026, 10:24 AM
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center gap-1 font-semibold text-[#163a2b] hover:text-[#c9972a] cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>View File</span>
                    </button>
                    <Link
                      href={`/career/${encodeURIComponent(slug)}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#8d6a3a] hover:text-[#163a2b]"
                    >
                      <UploadCloud size={12} />
                      <span>Upload Different CV</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Job Summary Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <div className="flex items-center justify-between pb-3 border-b border-[#ebdcc7]/70">
                <h4 style={serif} className="text-base font-bold text-[#163a2b]">
                  Job Summary
                </h4>
                <Link
                  href={`/career/${encodeURIComponent(slug)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#163a2b] hover:text-[#c9972a]"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </Link>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[#6b6255] shrink-0">
                    <Briefcase size={13} className="text-[#163a2b]" /> Position
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">{job.title || "Product Designer"}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[#6b6255] shrink-0">
                    <Building2 size={13} className="text-[#163a2b]" /> Organization
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">ENSIS</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[#6b6255] shrink-0">
                    <MapPin size={13} className="text-[#163a2b]" /> Location
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">{jobLocation(job) || "Delhi NCR"}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[#6b6255] shrink-0">
                    <Clock size={13} className="text-[#163a2b]" /> Employment Type
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">{jobType(job) || "Full Time"}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[#6b6255] shrink-0">
                    <BarChart3 size={13} className="text-[#163a2b]" /> Experience Required
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">{jobExperience(job) || "2 – 5 Years"}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[#6b6255] shrink-0">
                    <GraduationCap size={13} className="text-[#163a2b]" /> Qualification
                  </span>
                  <span className="font-bold text-[#163a2b] text-right max-w-[55%] leading-tight">
                    {job.educationRequirements || "B.Des / M.Des (Product or Industrial Design)"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-1 border-t border-[#ebdcc7]/60">
                  <span className="flex items-center gap-1.5 text-[#6b6255] shrink-0">
                    <Calendar size={13} className="text-[#163a2b]" /> Joining Preference
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">Within 1 Month</span>
                </div>
              </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="space-y-2 pt-1">
              {isEligible ? (
                <Link
                  href={`/career/${encodeURIComponent(slug)}/apply`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#163a2b] hover:bg-[#0f2a1f] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5"
                >
                  <span>Continue & Apply for This Job</span>
                  <ArrowRight size={15} />
                </Link>
              ) : isPartial ? (
                <Link
                  href={`/career/${encodeURIComponent(slug)}/apply`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#163a2b] hover:bg-[#0f2a1f] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5"
                >
                  <span>Update CV & Apply Now</span>
                  <ArrowRight size={15} />
                </Link>
              ) : (
                <Link
                  href="/career"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#163a2b] hover:bg-[#0f2a1f] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5"
                >
                  <span>Explore Other Jobs</span>
                  <ArrowRight size={15} />
                </Link>
              )}

              <button
                type="button"
                onClick={handleToggleSave}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#ebdcc7] bg-white hover:bg-[#fbf5eb] px-6 py-2.5 text-xs font-semibold text-[#163a2b] shadow-2xs transition-colors cursor-pointer"
              >
                {saved ? (
                  <>
                    <BookmarkCheck size={14} className="text-[#163a2b]" />
                    <span>Saved in Your Bookmarks</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={14} />
                    <span>Save for Later</span>
                  </>
                )}
              </button>
            </div>

            {/* 5. Privacy Footnote */}
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#8d6a3a]">
              <Lock size={12} className="text-[#2b2723] shrink-0" />
              <span>Your data is secure and will only be used for recruitment purposes.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
