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
  User,
  UserCheck,
  Leaf,
  Users,
  RotateCw,
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
import outcomeEligibleBg from "@/assets/career/new/smiling-recruiter.png";
import outcomeIneligibleBg from "@/assets/career/new/Keep Learning, Keep Growing.png";
import passAndPartialImg from "@/assets/career/new/pass_and_partial.png";
import failImg from "@/assets/career/new/fail.png";
import defaultAvatar from "@/assets/career/flow/default-avatar.webp";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";
import profileMatchLeftImg from "@/assets/career/flow/profile_match_left.png";
import requirementRightImg from "@/assets/career/flow/requirement_right.png";

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

    // Check query param for test preview override (e.g. ?state=partial or ?state=not_eligible or ?state=fail or ?level=fail)
    const rawState = (searchParams?.get("state") || searchParams?.get("level"))?.toLowerCase();
    if (rawState) {
      if (["not_eligible", "fail", "failed", "ineligible"].includes(rawState)) {
        setActivePreviewLevel("not_eligible");
      } else if (["partial", "moderate"].includes(rawState)) {
        setActivePreviewLevel("partial");
      } else if (["eligible", "pass", "passed", "strong"].includes(rawState)) {
        setActivePreviewLevel("eligible");
      }
    }

    const state = loadFlowState(slug);
    if (!state || !state.screening?.result) {
      // Direct access fallback or sample preview
      getJob(slug).then((j) => {
        if (j) {
          setJob(j);
          const initialLevel = activePreviewLevel || "eligible";
          const initialScore = initialLevel === "not_eligible" ? 28 : initialLevel === "partial" ? 58 : 85;
          setScreening({
            screeningId: "preview-123",
            jobId: j._id,
            status: "done",
            progress: initialScore,
            steps: [],
            cv: { fileName: "Sompal_Kumar_Frontend_Engineer_CV.pdf", size: 31 * 1024, uploadedAt: new Date().toISOString() },
            result: {
              score: initialScore,
              level: initialLevel,
              thresholds: { eligible: 70, partial: 50 },
              profile: {
                fullName: "Sompal Kumar",
                email: "somfrontenddeveloper@gmail.com",
                phone: "+91 7678221037",
                currentLocation: "Tagore Garden, New Delhi",
                dateOfBirth: "1995-11-14",
                gender: "Male",
                linkedin: "https://linkedin.com/in/sompal-kumar-b62b5022b",
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
  }, [slug, router, searchParams, activePreviewLevel]);

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
    (baseResult.score <= 33
      ? "not_eligible"
      : baseResult.score <= 66
      ? "partial"
      : baseResult.level || "eligible");

  const isEligible = level === "eligible";
  const isPartial = level === "partial";
  const isIneligible = level === "not_eligible";

  // Dynamic Score: 0-33% is Red, 33-66% is Yellow, >66% is Green
  const score = activePreviewLevel
    ? activePreviewLevel === "eligible"
      ? 85
      : activePreviewLevel === "partial"
      ? 58
      : 28
    : (baseResult.score || (isEligible ? 85 : isPartial ? 58 : 28));

  const candidateName = baseResult.profile?.fullName || "Sompal Kumar";
  const firstName = candidateName.split(" ")[0] || "Sompal";
  const candidatePhoto =
    baseResult.profile?.photoUrl ||
    (baseResult.profile as any)?.photo ||
    (baseResult.profile as any)?.avatarUrl ||
    (baseResult.profile as any)?.image ||
    null;

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

  // Match breakdown items exactly matching screenshot columns & Lucide icons
  const breakdownLeftItems = [
    {
      title: "Educational Qualification",
      desc: job.educationRequirements || "B.Des / M.Des",
      icon: GraduationCap,
      pct: isEligible ? 100 : isPartial ? 90 : 20,
    },
    {
      title: "Relevant Experience",
      desc: "Product / Industrial Design",
      icon: Briefcase,
      pct: isEligible ? 85 : isPartial ? 60 : 25,
    },
    {
      title: "Design & Technical Skills",
      desc: "3D Modeling, Renderings, Prototyping",
      icon: Leaf,
      pct: isEligible ? 80 : isPartial ? 50 : 15,
    },
  ];

  const breakdownRightItems = [
    {
      title: "Creative & Design Thinking",
      desc: "Problem Solving & Innovation",
      icon: Users,
      pct: isEligible ? 90 : isPartial ? 75 : 40,
    },
    {
      title: "Communication Skills",
      desc: "Presentation & Collaboration",
      icon: FileText,
      pct: isEligible ? 75 : isPartial ? 80 : 45,
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
    if (pct <= 33) return "bg-[#dc2626]";
    if (pct <= 66) return "bg-[#f59e0b]";
    return "bg-[#0e6037]";
  };

  const getDonutColor = (val: number) => {
    if (val <= 33) return "#dc2626";
    if (val <= 66) return "#f59e0b";
    return "#0e6037";
  };

  const getScoreTextColor = (val: number) => {
    if (val <= 33) return "text-[#dc2626]";
    if (val <= 66) return "text-[#d97706]";
    return "text-[#0c3363]";
  };

  const outcomePhoto = isIneligible ? failImg : passAndPartialImg;

  return (
    <div className="relative bg-[#fbf4e2] text-[#3f3a33] overflow-hidden">
      {/* ── 1. Top Panoramic Hero Banner matching mockup ── */}
      <section className="relative isolate w-full overflow-hidden border-b border-[#ebdcc7]/60">
        <Image
          src={detailBg}
          alt="Careers at Ensis"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />

        {/* Botanical leaves on left and right borders */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
          <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
          <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
        </div>

        {/* Readability overlay */}
        <div className="absolute inset-0 bg-[#fbf4e2]/90 lg:hidden" />
        <div className="absolute inset-0 hidden w-[58%] bg-gradient-to-r from-[#fbf4e2]/95 via-[#fbf4e2]/80 to-transparent lg:block" />
        <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-b from-transparent to-[#fbf4e2]" />

        <Container className="relative py-0!">
          <div className="max-w-[620px] pt-7 pb-4 sm:pt-9 sm:pb-5 lg:pt-11 lg:pb-7">
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

            {/* 4-Step Stepper inside Banner Bottom */}
            <div className="mt-2 max-w-[500px]">
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
      <div className="pointer-events-none absolute left-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden opacity-40">
        <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
      </div>
      <div className="pointer-events-none absolute right-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden opacity-40">
        <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
      </div>

      {/* ── 2. Main 2-Column Content Section ── */}
      <Container className="pt-1.5 pb-2 sm:pb-3 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:gap-3 items-start">
          {/* ════════ Left Column: Result Outcome & Breakdown (~68%) ════════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-2">
            {/* 1. Hero Outcome Card with Panoramic Background + Left Foreground Photo - Auto Compact Height */}
            <div className="relative overflow-hidden rounded-2xl border border-[#ebdcc7] shadow-[0_4px_24px_rgba(70,50,20,0.06)] h-auto flex flex-col sm:flex-row items-stretch bg-[#fdfaf3]">
              {/* Panoramic Card Background Banner (leaves and slogan pinned to the right) */}
              <Image
                src={isIneligible ? outcomeIneligibleBg : outcomeEligibleBg}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 860px"
                className="object-cover object-right pointer-events-none select-none"
              />

              {/* Left Foreground Photo (fail.png for ineligible, pass_and_partial.png for eligible/partial) */}
              <div className="relative z-10 w-full sm:w-[150px] md:w-[170px] lg:w-[185px] xl:w-[200px] h-32 sm:h-auto shrink-0 overflow-hidden">
                <Image
                  src={outcomePhoto}
                  alt={isIneligible ? "Review Result" : "Application Result"}
                  fill
                  priority
                  className="object-cover object-top sm:object-center"
                  sizes="(max-width: 640px) 100vw, 220px"
                />
                {/* Soft right edge fade on desktop to blend smoothly into parchment */}
                <div className="absolute inset-y-0 right-0 hidden sm:block w-8 sm:w-10 bg-gradient-to-r from-transparent to-[#fdfaf3]/50 pointer-events-none" />
                {/* Soft bottom edge fade on mobile */}
                <div className="absolute inset-x-0 bottom-0 sm:hidden h-6 bg-gradient-to-t from-[#fdfaf3] to-transparent pointer-events-none" />
              </div>

              {/* Content Layer (positioned next to left photo, shifted right to preserve right-side banner artwork) */}
              <div className="relative z-10 py-1.5 sm:py-2 px-3 sm:px-4 md:pl-3.5 lg:pl-4 sm:pr-20 md:pr-24 lg:pr-28 xl:pr-32 flex-1 min-w-0 flex flex-col justify-center">
                {/* Eligible State */}
                {isEligible && (
                  <div className="space-y-0.5 sm:space-y-1">
                    <div>
                      <h2 style={serif} className="text-base sm:text-lg md:text-[21px] font-bold text-[#163a2b] leading-tight tracking-tight">
                        Great News, <br className="hidden sm:inline" />
                        <span className="text-[#c9972a]">{firstName}!</span>
                      </h2>
                      <p className="mt-0.5 text-[10.5px] sm:text-[11px] font-bold text-[#163a2b]">
                        You are eligible to apply for this position.
                      </p>
                      <p className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#554e42] leading-snug max-w-[95%]">
                        Your profile meets the key requirements for {job.title} at ENSIS. We encourage
                        you to complete your application and join our mission of creating wellness spaces
                        for a healthier tomorrow.
                      </p>
                    </div>

                    <div className="pt-0.5 flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <Link
                        href={`/career/${encodeURIComponent(slug)}/apply`}
                        className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] px-3 sm:px-3.5 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-white shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5 whitespace-nowrap"
                      >
                        <span>Continue & Apply for This Job</span>
                        <ArrowRight size={12} className="text-[#e5b85a]" />
                      </Link>
                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-[#cbb38b] bg-[#fffdf9] hover:bg-[#fbf5eb] hover:border-[#b89b6c] px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-[#163a2b] shadow-[0_1px_3px_rgba(70,50,20,0.06)] transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                      >
                        <Download size={11} className="text-[#8d6a3a]" />
                        <span>Download Result (PDF)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Partial Match State */}
                {isPartial && (
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="grid size-6 sm:size-7 shrink-0 place-items-center rounded-full bg-[#f59e0b] text-white shadow-md font-bold text-sm sm:text-base">
                        !
                      </span>
                      <div>
                        <h2 style={serif} className="text-xs sm:text-sm lg:text-[17px] font-bold text-[#b45309] leading-tight tracking-tight whitespace-nowrap">
                          You&apos;re a Partial Match, {firstName}!
                        </h2>
                        <p className="mt-0.5 text-[9.5px] sm:text-[10.5px] font-bold text-[#0c3363] leading-snug whitespace-nowrap">
                          You are close to the requirements for this position.
                        </p>
                      </div>
                    </div>
                    <p className="mt-0.5 text-[9px] sm:text-[9.5px] lg:text-[10px] text-[#334155] leading-snug max-w-[95%]">
                      Your profile shows good potential, but a few key areas need improvement. You can
                      still apply after reviewing the suggestions below and updating your profile or CV
                      to strengthen your application.
                    </p>

                    <div className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#1e40af] italic font-medium leading-tight">
                      <p>
                        Keep learning and building your skills.<br />
                        The right opportunity will come at the right time.
                      </p>
                    </div>

                    <div className="mt-0.5 text-[9px] sm:text-[9.5px] font-bold text-[#163a2b] leading-tight">
                      <p className="flex items-center gap-1.5">
                        <span className="text-xs leading-none select-none">—</span>
                        <span>Talent Acquisition Team</span>
                      </p>
                      <p className="pl-3 text-[#163a2b]">ENSIS</p>
                    </div>
                  </div>
                )}

                {/* Ineligible State - EXACT match to user screenshot */}
                {isIneligible && (
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="grid size-6 sm:size-7 shrink-0 place-items-center rounded-full bg-[#dc2626] text-white shadow-md">
                        <X size={14} strokeWidth={3.5} />
                      </span>
                      <div>
                        <h2 style={serif} className="text-xs sm:text-sm lg:text-[17px] font-bold text-[#c5221f] leading-tight tracking-tight whitespace-nowrap">
                          Currently Not Eligible, {firstName}
                        </h2>
                        <p className="mt-0.5 text-[9.5px] sm:text-[10.5px] font-bold text-[#0c3363] leading-snug whitespace-nowrap">
                          Your profile does not meet the key requirements for this position.
                        </p>
                      </div>
                    </div>
                    <p className="mt-0.5 text-[9px] sm:text-[9.5px] lg:text-[10px] text-[#334155] leading-snug max-w-[95%]">
                      Based on our AI analysis, your current profile does not match the minimum
                      requirements for {job.title || "Product Designer"} at ENSIS. However, we appreciate your interest and
                      encourage you to explore other suitable opportunities or improve your profile for
                      future openings.
                    </p>

                    <div className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#1e40af] italic font-medium leading-tight">
                      <p>
                        Keep learning and building your skills.<br />
                        The right opportunity will come at the right time.
                      </p>
                    </div>

                    <div className="mt-0.5 text-[9px] sm:text-[9.5px] font-bold text-[#163a2b] leading-tight">
                      <p className="flex items-center gap-1.5">
                        <span className="text-xs leading-none select-none">—</span>
                        <span>Talent Acquisition Team</span>
                      </p>
                      <p className="pl-3 text-[#163a2b]">ENSIS</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Middle Row: Two Cards Side-by-Side (50% / 50% SAME WIDTH) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 items-stretch w-full">
              {/* Left Box: Match Score Donut & Legend (50% Width) */}
              <div className="w-full min-w-0 rounded-2xl border border-[#ebdcc7] bg-[#fffcf4] p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(70,50,20,0.04)] flex flex-col justify-between relative overflow-hidden">
                {/* Botanical leaves in bottom-right */}
                <div className="pointer-events-none absolute -bottom-1 -right-1 w-20 sm:w-24 h-20 sm:h-24 select-none z-0">
                  <Image
                    src={profileMatchLeftImg}
                    alt=""
                    fill
                    className="object-contain object-bottom-right"
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`grid size-6 place-items-center rounded-full ${
                        isIneligible ? "bg-[#dc2626]" : isPartial ? "bg-[#f59e0b]" : "bg-[#0e6037]"
                      } text-white shrink-0 shadow-2xs`}
                    >
                      <BarChart3 size={13.5} strokeWidth={2.4} />
                    </span>
                    <h3 style={serif} className="text-sm sm:text-[15px] font-bold text-[#0c3363]">
                      Match Level:{" "}
                      <span
                        className={
                          isIneligible
                            ? "text-[#dc2626]"
                            : isPartial
                            ? "text-[#d97706]"
                            : "text-[#0e6037]"
                        }
                      >
                        {isIneligible ? "Not Eligible" : isPartial ? "Moderate Match" : "Strong Match"}
                      </span>
                    </h3>
                  </div>

                  {/* Donut and Legend: compactly grouped */}
                  <div className="flex items-center gap-4 sm:gap-5 py-1 pl-1">
                    {/* Donut chart on left */}
                    <div className="relative size-20 sm:size-22 shrink-0 flex items-center justify-center">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#e8ded0]"
                          strokeWidth="3.6"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          style={{ color: getDonutColor(score) }}
                          strokeDasharray={`${score}, 100`}
                          strokeWidth="3.6"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xl sm:text-[22px] font-black leading-none ${getScoreTextColor(score)}`}>
                          {score}%
                        </span>
                        <span className="mt-1 text-[9.5px] font-semibold text-[#64748b] tracking-tight">
                          Match Score
                        </span>
                      </div>
                    </div>

                    {/* Legend: 2 structured columns matching user screenshot */}
                    <div className="grid grid-cols-[auto_auto] items-center gap-x-4 sm:gap-x-5 gap-y-2 text-xs">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="size-2.5 rounded-full bg-[#0e6037] shrink-0" />
                        <span className="text-[#334155] font-semibold text-[11px] sm:text-xs">70 – 100%</span>
                      </div>
                      <span className="font-bold text-[#0c3363] text-[11px] sm:text-xs whitespace-nowrap">Strong Match</span>

                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="size-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                        <span className="text-[#334155] font-semibold text-[11px] sm:text-xs">50 – 69%</span>
                      </div>
                      <span className="font-bold text-[#0c3363] text-[11px] sm:text-xs whitespace-nowrap">Moderate Match</span>

                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="size-2.5 rounded-full bg-[#dc2626] shrink-0" />
                        <span className="text-[#334155] font-semibold text-[11px] sm:text-xs">Below 50%</span>
                      </div>
                      <span className="font-bold text-[#0c3363] text-[11px] sm:text-xs whitespace-nowrap">Not Eligible</span>
                    </div>
                  </div>

                  {(isPartial || isIneligible) && (
                    <p className="mt-1 text-[10.5px] text-[#6b6255] leading-tight">
                      {isPartial
                        ? "Your profile matches several key requirements, but a few important areas need strengthening."
                        : "Your profile does not meet the minimum requirements for this position."}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Box: Key Highlights (50% Width) */}
              <div className="w-full min-w-0 rounded-2xl border border-[#ebdcc7] bg-[#fffcf4] p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(70,50,20,0.04)] flex flex-col justify-between relative overflow-hidden">
                {/* Botanical leaves on the right */}
                <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-0.5 h-[88%] w-14 sm:w-16 select-none z-0">
                  <Image
                    src={requirementRightImg}
                    alt=""
                    fill
                    className="object-contain object-right"
                  />
                </div>

                <div className="relative z-10 pr-12 sm:pr-14">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`grid size-6 place-items-center rounded-full ${
                        isIneligible ? "bg-[#dc2626]" : isPartial ? "bg-[#f59e0b]" : "bg-[#0e6037]"
                      } text-white shrink-0 shadow-2xs`}
                    >
                      <Target size={13.5} strokeWidth={2.4} />
                    </span>
                    <h3 style={serif} className="text-sm sm:text-[15px] font-bold text-[#0c3363]">
                      {isIneligible
                        ? "Key Gaps in Your Profile"
                        : isPartial
                        ? "Areas to Improve"
                        : "You Meet the Key Requirements"}
                    </h3>
                  </div>

                  {/* Eligible: Checklist with green checkmarks */}
                  {isEligible && (
                    <ul className="space-y-1.5 pl-1">
                      {eligibleRequirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-[#2d4356] leading-tight">
                          <span className="mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full bg-[#0e6037] text-white">
                            <Check size={8.5} strokeWidth={3.5} />
                          </span>
                          <span className="font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Partial: Suggestions with amber numbers */}
                  {isPartial && (
                    <ul className="space-y-1.5 pl-1">
                      {partialSuggestions.map((sug, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-[#2d4356] leading-tight">
                          <span className="mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full bg-[#f59e0b] text-white font-bold text-[8.5px]">
                            {i + 1}
                          </span>
                          <span className="font-medium">{sug}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Ineligible: ONLY GAPS with red numbered circles */}
                  {isIneligible && (
                    <ul className="space-y-1.5 pl-1">
                      {ineligibleGaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-[#2d4356] leading-tight">
                          <span className="mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full bg-[#dc2626] text-white font-bold text-[8.5px]">
                            {i + 1}
                          </span>
                          <span className="font-medium">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Detailed Match Breakdown (2 Columns with exact matching icons & bars) */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-2 sm:p-2.5 shadow-[0_4px_24px_rgba(70,50,20,0.06)] space-y-1.5">
              <div className="flex items-center gap-2 pb-1 border-b border-[#ebdcc7]/70">
                <span className="grid size-5.5 sm:size-6 place-items-center rounded-full bg-[#b8731b] text-white shrink-0 shadow-2xs">
                  <BarChart3 size={13} strokeWidth={2.2} />
                </span>
                <div>
                  <h3 style={serif} className="text-[13px] sm:text-sm font-bold text-[#163a2b]">
                    {isEligible ? "Match Breakdown" : "Detailed Match Breakdown"}
                  </h3>
                  <p className="text-[10px] text-[#6b6255]">
                    Here&apos;s how your profile aligns with the job requirements:
                  </p>
                </div>
              </div>

              {/* 2 Columns exactly matching the mockup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1.5 pt-0.5">
                {/* Left Column */}
                <div className="space-y-1.5">
                  {breakdownLeftItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="shrink-0 text-[#165c3b]">
                            <Icon size={17} strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[11.5px] font-bold text-[#0c3363] leading-snug truncate">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-[#475569] leading-tight truncate">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 w-[100px] sm:w-[115px]">
                          <div className="h-1.5 w-full rounded-full bg-[#e2e8f0] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getBarColor(item.pct)} transition-all duration-700`}
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#0c3363] text-[11px] w-7 text-right shrink-0">
                            {item.pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-1.5">
                  {breakdownRightItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="shrink-0 text-[#165c3b]">
                            <Icon size={17} strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[11.5px] font-bold text-[#0c3363] leading-snug truncate">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-[#475569] leading-tight truncate">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 w-[100px] sm:w-[115px]">
                          <div className="h-1.5 w-full rounded-full bg-[#e2e8f0] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getBarColor(item.pct)} transition-all duration-700`}
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#0c3363] text-[11px] w-7 text-right shrink-0">
                            {item.pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Tip Callout Box for Partial & Ineligible */}
              {(isPartial || isIneligible) && (
                <div className="mt-1.5 flex items-start gap-1.5 rounded-xl bg-[#fbf4e2] border border-[#ebdcc7] p-2 text-xs text-[#554e42]">
                  <Lightbulb size={13} className="text-[#c9972a] shrink-0 mt-0.5" />
                  <p className="text-[10.5px] leading-snug">
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
          <div className="lg:col-span-5 xl:col-span-4 space-y-2 lg:-mt-[50px] relative z-20">
            {/* 1. Your Profile Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-2.5 sm:p-3 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#ebdcc7]/70">
                <h4 style={serif} className="text-[13px] sm:text-sm font-bold text-[#163a2b]">
                  Your Profile
                </h4>
                <Link
                  href={`/career/${encodeURIComponent(slug)}/apply`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#163a2b] hover:text-[#c9972a]"
                >
                  <Edit2 size={11} />
                  <span>Edit</span>
                </Link>
              </div>

              <div className="mt-2 flex items-stretch gap-2.5">
                <div className="relative w-18 sm:w-20 shrink-0 self-stretch min-h-[96px] rounded-xl overflow-hidden border border-[#ebdcc7] bg-[#f4ebd9] shadow-2xs">
                  <Image
                    src={candidatePhoto || defaultAvatar}
                    alt={candidateName}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="min-w-0 flex-1 flex flex-col gap-1.5 py-0.5 text-[10.5px] text-[#554e42]">
                  <p className="font-bold text-xs sm:text-[13px] text-[#163a2b] truncate">
                    {candidateName}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <Mail size={11} className="text-[#163a2b] shrink-0" />
                    <span className="truncate block" title={baseResult.profile?.email || "somfrontenddeveloper@gmail.com"}>
                      {baseResult.profile?.email || "somfrontenddeveloper@gmail.com"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <Phone size={11} className="text-[#163a2b] shrink-0" />
                    <span className="truncate block">{baseResult.profile?.phone || "+91 7678221037"}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <MapPin size={11} className="text-[#163a2b] shrink-0" />
                    <span className="truncate block">{baseResult.profile?.currentLocation || "Tagore Garden, New Delhi"}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <Calendar size={11} className="text-[#163a2b] shrink-0" />
                    <span className="truncate block">14 Nov 1995 &nbsp;|&nbsp; Male</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] text-[#0a66c2] min-w-0">
                    <LinkedinIcon size={11} className="shrink-0 text-[#0a66c2]" />
                    <span
                      className="truncate block cursor-pointer hover:underline"
                      title={baseResult.profile?.linkedin || "https://linkedin.com/in/sompal-kumar-b62b5022b"}
                    >
                      {baseResult.profile?.linkedin || "https://linkedin.com/in/sompal-kumar-b62b5022b"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Your CV Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-2.5 sm:p-3 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <h4 style={serif} className="text-[13px] sm:text-sm font-bold text-[#163a2b] mb-1.5">
                Your CV
              </h4>

              {/* Inner card matching reference screenshot */}
              <div className="rounded-xl border border-[#ebdcc7] bg-[#fffcf7] p-2 sm:p-2.5 flex items-center gap-3 shadow-2xs">
                {/* Standalone Document Icon with Checkmark Badge */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <svg
                    width="34"
                    height="42"
                    viewBox="0 0 42 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    {/* Document outline */}
                    <path
                      d="M7 4C5.34315 4 4 5.34315 4 7V43C4 44.6569 5.34315 46 7 46H29C30.6569 46 32 44.6569 32 43V16L20 4H7Z"
                      fill="none"
                      stroke="#0e4f3a"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Folded corner */}
                    <path
                      d="M20 4V16H32"
                      fill="none"
                      stroke="#0e4f3a"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Center dash line */}
                    <path
                      d="M11 26H19"
                      stroke="#0e4f3a"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Green checkmark badge at bottom right */}
                  <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-[#165c3b] ring-2 ring-[#fffcf7] text-white shadow-2xs">
                    <Check size={9} strokeWidth={3.5} />
                  </span>
                </div>

                {/* File details & actions */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-[13px] font-bold text-[#0c3363] truncate leading-tight">
                    {screening.cv?.fileName || "Sompal_Kumar_Frontend_Engineer_CV.pdf"}
                  </p>
                  <p className="text-[10px] text-[#556987] mt-0.5">
                    {(screening.cv?.size ? (screening.cv.size / 1024).toFixed(0) : "31")} KB &nbsp;|&nbsp; 17 Oct 2026, 10:24 AM
                  </p>

                  <div className="mt-1.5 flex items-center gap-4 sm:gap-6 text-[10.5px]">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center gap-1 font-semibold text-[#0c3363] hover:text-[#163a2b] cursor-pointer"
                    >
                      <Eye size={12} className="text-[#0c3363]" />
                      <span>View File</span>
                    </button>
                    <Link
                      href={`/career/${encodeURIComponent(slug)}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#0c3363] hover:text-[#163a2b]"
                    >
                      <RotateCw size={11} className="text-[#0c3363]" />
                      <span>Upload Different CV</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Job Summary Card with Integrated Actions */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-2.5 sm:p-3 shadow-[0_4px_24px_rgba(70,50,20,0.06)] space-y-1.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#ebdcc7]/70">
                <h4 style={serif} className="text-[13px] sm:text-sm font-bold text-[#163a2b]">
                  Job Summary
                </h4>
                <Link
                  href={`/career/${encodeURIComponent(slug)}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#163a2b] hover:text-[#c9972a]"
                >
                  <Edit2 size={11} />
                  <span>Edit</span>
                </Link>
              </div>

              <div className="space-y-0 text-[11px]">
                {/* 1. Position */}
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#ebdcc7]/70">
                  <span className="flex items-center gap-2.5 text-[#554e42] shrink-0">
                    <Briefcase size={13} className="text-[#163a2b] shrink-0" />
                    <span>Position</span>
                  </span>
                  <span className="font-bold text-[#163a2b] text-right truncate max-w-[60%]">
                    {job.title || "Product Designer"}
                  </span>
                </div>

                {/* 2. Organization */}
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#ebdcc7]/70">
                  <span className="flex items-center gap-2.5 text-[#554e42] shrink-0">
                    <Building2 size={13} className="text-[#163a2b] shrink-0" />
                    <span>Organization</span>
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">ENSIS</span>
                </div>

                {/* 3. Location */}
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#ebdcc7]/70">
                  <span className="flex items-center gap-2.5 text-[#554e42] shrink-0">
                    <MapPin size={13} className="text-[#163a2b] shrink-0" />
                    <span>Location</span>
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">{jobLocation(job) || "Delhi NCR"}</span>
                </div>

                {/* 4. Employment Type */}
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#ebdcc7]/70">
                  <span className="flex items-center gap-2.5 text-[#554e42] shrink-0">
                    <Clock size={13} className="text-[#163a2b] shrink-0" />
                    <span>Employment Type</span>
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">{jobType(job) || "Full Time"}</span>
                </div>

                {/* 5. Experience Required */}
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#ebdcc7]/70">
                  <span className="flex items-center gap-2.5 text-[#554e42] shrink-0">
                    <BarChart3 size={13} className="text-[#163a2b] shrink-0" />
                    <span>Experience Required</span>
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">{jobExperience(job) || "2 – 5 Years"}</span>
                </div>

                {/* 6. Qualification */}
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#ebdcc7]/70">
                  <span className="flex items-center gap-2.5 text-[#554e42] shrink-0">
                    <GraduationCap size={13} className="text-[#163a2b] shrink-0" />
                    <span>Qualification</span>
                  </span>
                  <span className="font-bold text-[#163a2b] text-right max-w-[55%] leading-tight">
                    {job.educationRequirements || "B.Des / M.Des (Product or Industrial Design)"}
                  </span>
                </div>

                {/* 7. Joining Preference */}
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#ebdcc7]/70">
                  <span className="flex items-center gap-2.5 text-[#554e42] shrink-0">
                    <Calendar size={13} className="text-[#163a2b] shrink-0" />
                    <span>Joining Preference</span>
                  </span>
                  <span className="font-bold text-[#163a2b] text-right">Within 1 Month</span>
                </div>
              </div>

              {/* Action Buttons & Privacy Notice Integrated Inside Card */}
              <div className="pt-2 space-y-1.5">
                {isEligible ? (
                  <Link
                    href={`/career/${encodeURIComponent(slug)}/apply`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5"
                  >
                    <span>Continue & Apply for This Job</span>
                    <ArrowRight size={14} className="text-[#e5b85a]" />
                  </Link>
                ) : isPartial ? (
                  <Link
                    href={`/career/${encodeURIComponent(slug)}/apply`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5"
                  >
                    <span>Update CV & Apply Now</span>
                    <ArrowRight size={14} className="text-[#e5b85a]" />
                  </Link>
                ) : (
                  <Link
                    href="/career"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#0e4f3a] bg-[#0e4f3a] hover:bg-[#143423] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    <span>Explore Other Jobs</span>
                    <ArrowRight size={14} className="text-white" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleToggleSave}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#cbb38b] bg-[#fffdf9] hover:bg-[#fbf5eb] hover:border-[#b89b6c] px-4 py-2 text-xs font-semibold text-[#163a2b] shadow-[0_1px_3px_rgba(70,50,20,0.06)] transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  {saved ? (
                    <>
                      <BookmarkCheck size={14} className="text-[#163a2b]" />
                      <span>Saved in Your Bookmarks</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={14} className="text-[#8d6a3a]" />
                      <span>Save for Later</span>
                    </>
                  )}
                </button>

                <div className="pt-0.5 flex items-center justify-center gap-1.5 text-[10px] text-[#8d6a3a]">
                  <Lock size={11} className="text-[#a8792c] shrink-0" />
                  <span>Your data is secure and will only be used for recruitment purposes.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
