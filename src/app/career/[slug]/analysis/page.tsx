"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Clock,
  AlertCircle,
  UploadCloud,
  ArrowRight,
  Lock,
  RotateCw,
  Lightbulb,
  Check,
  Briefcase,
  Calendar,
  MapPin,
  GraduationCap,
  Home,
  Search,
  Settings,
  BarChart3,
  UserCheck,
} from "lucide-react";
import { serif, Eyebrow } from "@/components/career-v2/ui";
import { Container } from "@/components/ui/Container";
import {
  getJob,
  startScreening,
  type PublicJob,
  type Screening,
  type StepKey,
  type StepState,
} from "@/lib/careerApi";
import {
  getCvFile,
  setCvFile,
  loadFlowState,
  saveFlowState,
} from "@/lib/careerFlowV2";
import { jobLocation, jobType } from "@/lib/careers";
import aiAnalysisHero from "@/assets/career/first-step/ai-analysis-hero.png";
import positionAppliedImg from "@/assets/career/new/position_applied.png";
import analysisCheckImg from "@/assets/career/flow/analysis_check.png";
import sectionLeft from "@/assets/career/section_left.png";
import exploreBg from "@/assets/career/first-step/explore.png";
import sectionRight from "@/assets/career/section_right.png";
import pageOpenImg from "@/assets/career/flow/page_open.png";
import yourProfileImg from "@/assets/career/flow/your_profile.png";

type StepMeta = {
  key: StepKey;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
};

const LEFT_STEPS: StepMeta[] = [
  {
    key: "read_cv",
    title: "Reading Your CV",
    desc: "Extracting key information from your profile...",
    icon: FileText,
  },
  {
    key: "match_skills",
    title: "Matching Skills",
    desc: "Comparing your skills with job requirements...",
    icon: Search,
  },
  {
    key: "check_experience",
    title: "Checking Experience",
    desc: "Analyzing relevant work experience...",
    icon: Briefcase,
  },
];

const RIGHT_STEPS: StepMeta[] = [
  {
    key: "verify_education",
    title: "Verifying Education",
    desc: "Checking qualifications and certifications...",
    icon: GraduationCap,
  },
  {
    key: "analyze_competencies",
    title: "Analyzing Competencies",
    desc: "Assessing role-specific skills and expertise...",
    icon: Settings,
  },
  {
    key: "calculate_score",
    title: "Calculating Match Score",
    desc: "Generating eligibility score...",
    icon: BarChart3,
  },
];

function AnalysisContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "";

  // Test / Preview mode: keeps screen active indefinitely with simulated progress
  const isPreview =
    searchParams?.get("preview") === "true" ||
    searchParams?.get("test") === "true" ||
    searchParams?.get("hold") === "true";

  const [previewProgress, setPreviewProgress] = useState<number>(
    Number(searchParams?.get("progress")) || 68
  );

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsReupload, setNeedsReupload] = useState(false);
  const [fileToReupload, setFileToReupload] = useState<File | null>(null);
  const [uploadedCvName, setUploadedCvName] = useState<string>("");
  const [uploadedCvSize, setUploadedCvSize] = useState<string>("31 KB");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);

  // Computed education display
  const rawEdu =
    job?.educationRequirements ||
    "Any graduate; web development certification is a plus";
  const educationMain = rawEdu.includes(";")
    ? rawEdu.split(";")[0]?.trim()
    : rawEdu.includes("(")
      ? rawEdu.split("(")[0]?.trim()
      : rawEdu;
  const educationSub = rawEdu.includes(";")
    ? `(${rawEdu.split(";").slice(1).join(", ").trim()})`
    : rawEdu.match(/\((.*?)\)/)
      ? `(${rawEdu.match(/\((.*?)\)/)?.[1]})`
      : "";

  useEffect(() => {
    if (!slug) return;
    getJob(slug).then((j) => {
      if (j) {
        setJob(j);
      } else if (isPreview) {
        setJob({
          _id: "preview-job-1",
          slug,
          title: "Software Engineer – Full Stack (React / Next.js)",
          department: "Technology & Product",
          location: "New Delhi / Ghaziabad (Hybrid)",
          jobType: "Full Time",
          experienceRequired: "3 – 7 Years",
          educationRequirements: "Any graduate; web development certification is a plus",
          summary: "Design and build web applications for wellness spaces.",
          responsibilities: [],
          requirements: [],
          skillsRequired: ["React", "Next.js", "Node.js", "TypeScript"],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as PublicJob);
      } else {
        router.replace("/career");
      }
    });
  }, [slug, router, isPreview]);

  useEffect(() => {
    // In Preview Mode, do NOT run real screening or auto-redirect
    if (isPreview) {
      setUploadedCvName("Sample_Candidate_CV.pdf");
      setUploadedCvSize("31 KB");
      setNeedsReupload(false);
      return;
    }

    if (!job || startedRef.current) return;

    const cvFile = getCvFile();
    if (cvFile) {
      setUploadedCvName(cvFile.name);
      setUploadedCvSize(`${(cvFile.size / (1024 * 1024)).toFixed(1)} MB`);
    } else {
      const state = loadFlowState(slug);
      if (state?.screening?.status === "done") {
        router.replace(`/career/${encodeURIComponent(slug)}/result`);
        return;
      }
      setNeedsReupload(true);
      return;
    }

    startedRef.current = true;
    setError(null);

    startScreening(job._id, cvFile, job, (updated) => {
      setScreening(updated);
    })
      .then((finalScreening) => {
        if (finalScreening.status === "done" && finalScreening.result) {
          saveFlowState({
            job,
            screeningId: finalScreening.screeningId,
            screening: finalScreening,
            profile: finalScreening.result.profile,
            updatedAt: new Date().toISOString(),
          });

          setTimeout(() => {
            router.replace(`/career/${encodeURIComponent(slug)}/result`);
          }, 1200);
        } else if (finalScreening.status === "failed") {
          setError(finalScreening.error || "CV evaluation failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Screening start error:", err);
        setError("Unable to complete AI screening. Please check your network and try again.");
      });
  }, [job, slug, router, isPreview]);

  const handleReuploadSubmit = () => {
    if (!fileToReupload || !job) return;
    setCvFile(fileToReupload);
    setUploadedCvName(fileToReupload.name);
    setUploadedCvSize(`${(fileToReupload.size / (1024 * 1024)).toFixed(1)} MB`);
    setNeedsReupload(false);
    startedRef.current = false;
  };

  const getStepState = (key: StepKey): StepState => {
    if (isPreview) {
      switch (key) {
        case "read_cv":
          return previewProgress >= 20 ? "done" : "active";
        case "match_skills":
          return previewProgress >= 40 ? "done" : previewProgress >= 20 ? "active" : "pending";
        case "check_experience":
          return previewProgress >= 60 ? "done" : previewProgress >= 40 ? "active" : "pending";
        case "verify_education":
          return previewProgress >= 75 ? "done" : previewProgress >= 60 ? "active" : "pending";
        case "analyze_competencies":
          return previewProgress >= 90 ? "done" : previewProgress >= 75 ? "active" : "pending";
        case "calculate_score":
          return previewProgress >= 100 ? "done" : previewProgress >= 90 ? "active" : "pending";
        default:
          return "pending";
      }
    }
    const found = screening?.steps?.find((s) => s.key === key);
    return found?.state || "pending";
  };
  const hasResult = Boolean(screening?.result);
  const calculatedScore = screening?.result?.score;
  const isEligible = screening?.result?.level === "eligible";
  const isPartial = screening?.result?.level === "partial";
  const isAnalyzing = isPreview || Boolean(screening && screening.status !== "done" && screening.status !== "failed");
  const progress = isPreview ? previewProgress : (screening?.progress || (hasResult ? 100 : 0));

  return (
    <div className="relative min-h-screen bg-[#fbf4e2] text-[#3f3a33] overflow-hidden">
      {/* ── 1. Top Panoramic Hero Banner (Application in Progress) ── */}
      <section className="relative isolate w-full overflow-hidden">
        <Image
          src={aiAnalysisHero}
          alt="Careers at Ensis"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right sm:object-center"
        />

        {/* Botanical leaves on left and right borders */}
        <div className="hidden sm:block pointer-events-none absolute left-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
          <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
        </div>
        <div className="hidden sm:block pointer-events-none absolute right-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
          <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
        </div>

        {/* Readability overlay */}
        <div className="absolute inset-0 bg-[#fbf4e2]/90 lg:hidden" />
        <div className="absolute inset-0 hidden w-[58%] bg-gradient-to-r from-[#fbf4e2]/95 via-[#fbf4e2]/80 to-transparent lg:block" />

        <Container className="relative py-0!">
          <div className="max-w-[600px] pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-10 lg:pb-7">
            <p className="flex items-center gap-2.5 text-[16px] font-bold uppercase tracking-[0.16em] text-[#b47422]">Careers at Ensis</p>

            <h1
              style={{ ...serif, fontWeight: 800 }}
              className="text-[2.1rem] sm:text-[2.5rem] lg:text-[2.95rem] font-extrabold tracking-tight text-[#163a2b]"
            >
              Application in Progress
            </h1>

            <p className="mt-1.5 text-[16px] leading-snug tracking-tight text-[#4a4237]">
              We&apos;re excited to have you on board! Your application is under review. <br />
              Here&apos;s an update on your progress so far.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Main 2-Column Section Matching Mockup ── */}
      <section
        className="relative bg-[#fbf4e2] bg-no-repeat"
        style={{ backgroundImage: `url(${exploreBg.src})`, backgroundSize: "100% 100%" }}
      >
      <Container className="pt-2 sm:pt-2.5 pb-6 sm:pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4.5 items-start">
          {/* ════════ Left Column: Application Status & Steps Card (~68%) ════════ */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3.5 sm:p-4.5 shadow-[0_4px_24px_rgba(70,50,20,0.06)] space-y-3 sm:space-y-3.5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#8d6a3a] font-medium tracking-tight">
              <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center">
                <Home size={12} className="text-[#a8792c]" />
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <Link href="/career" className="hover:text-[#163a2b] transition-colors">
                Careers
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <span className="text-[#163a2b] font-semibold">Application in Progress</span>
            </div>

            {/* 4-Step Horizontal Stepper Bar */}
            <div className="py-1 px-1 sm:px-2">
              <div className="relative flex items-center justify-between">
                {/* Connecting Lines Behind */}
                <div className="absolute left-[10%] right-[10%] top-3.5 sm:top-3.75 h-[2px] -translate-y-1/2 bg-[#e2d5c0]">
                  {/* Step 1 to Step 2 completed line */}
                  <div className="h-full w-1/3 bg-[#163a2b]" />
                </div>

                {/* Step 1: Upload CV (Completed) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-7.5 place-items-center rounded-full bg-[#163a2b] text-white shadow-xs">
                    <Check size={14} strokeWidth={2.8} />
                  </div>
                  <span className="mt-1.5 text-[11px] sm:text-xs font-bold text-[#163a2b] tracking-tight">Upload CV</span>
                  <span className="text-[9.5px] sm:text-[10px] font-medium text-[#198754] tracking-tight">Completed</span>
                </div>

                {/* Step 2: AI Analysis (In Progress) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-7.5 place-items-center rounded-full bg-[#c9972a] text-white font-bold text-[11px] sm:text-xs shadow-xs ring-3 ring-[#faedd4]">
                    2
                  </div>
                  <span className="mt-1.5 text-[11px] sm:text-xs font-bold text-[#163a2b] tracking-tight">AI Analysis</span>
                  <span className="text-[9.5px] sm:text-[10px] font-medium text-[#c9972a] tracking-tight">In Progress</span>
                </div>

                {/* Step 3: Review Details (Pending) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-7.5 place-items-center rounded-full border-[1.5px] border-[#d6c7b0] bg-[#fffdf9] font-bold text-[11px] sm:text-xs text-[#8c7e6c]">
                    3
                  </div>
                  <span className="mt-1.5 text-[11px] sm:text-xs font-medium text-[#736a5c] tracking-tight">Review Details</span>
                  <span className="text-[9.5px] sm:text-[10px] text-[#9e9587] tracking-tight">Pending</span>
                </div>

                {/* Step 4: Submit Application (Pending) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-7 sm:size-7.5 place-items-center rounded-full border-[1.5px] border-[#d6c7b0] bg-[#fffdf9] font-bold text-[11px] sm:text-xs text-[#8c7e6c]">
                    4
                  </div>
                  <span className="mt-1.5 text-[11px] sm:text-xs font-medium text-[#736a5c] tracking-tight">Submit Application</span>
                  <span className="text-[9.5px] sm:text-[10px] text-[#9e9587] tracking-tight">Pending</span>
                </div>
              </div>
            </div>

            {/* Re-upload Fallback if Memory Cleared */}
            {needsReupload ? (
              <div className="rounded-xl border border-[#ebdcc7] bg-[#fbf5eb] p-5 text-center space-y-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#f4ebd9] text-[#a8792c] mx-auto">
                  <UploadCloud size={22} />
                </span>
                <h3 style={serif} className="text-lg font-bold text-[#163a2b]">
                  Please Select Your CV Again
                </h3>
                <p className="text-xs text-[#5f5647] max-w-md mx-auto">
                  For privacy, your CV is processed in-memory and cleared on browser refresh. Please re-select your file.
                </p>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFileToReupload(e.target.files?.[0] || null)}
                  />
                  {fileToReupload ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#163a2b]">{fileToReupload.name}</p>
                      <button
                        type="button"
                        onClick={handleReuploadSubmit}
                        className="inline-flex items-center gap-1.5 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] px-5 py-2 text-xs font-semibold text-white shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>Start Analysis</span> <ArrowRight size={13} className="text-[#e5b85a]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] px-5 py-2 text-xs font-semibold text-white shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Choose CV File</span>
                    </button>
                  )}
                </div>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-5 text-center space-y-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626] mx-auto">
                  <AlertCircle size={24} />
                </span>
                <h3 style={serif} className="text-lg font-bold text-[#991b1b]">
                  Evaluation Interrupted
                </h3>
                <p className="text-xs text-[#7f1d1d] max-w-md mx-auto">{error}</p>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      startedRef.current = false;
                      setError(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] px-4 py-2 text-xs font-semibold text-white shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <RotateCw size={13} className="text-[#e5b85a]" /> Try Again
                  </button>
                  <Link
                    href={`/career/${encodeURIComponent(slug)}`}
                    className="inline-flex items-center rounded-xl border-[1.5px] border-[#cbb38b] bg-[#fffdf9] hover:bg-[#fbf5eb] hover:border-[#b89b6c] px-4 py-2 text-xs font-semibold text-[#163a2b] shadow-[0_1px_3px_rgba(70,50,20,0.06)] transition-all hover:-translate-y-0.5"
                  >
                    Back to Upload
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* CV File Uploaded Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-[#e8decb] bg-[#f4f7ee] p-2.5 sm:p-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 sm:size-8.5 place-items-center rounded-lg bg-[#d93829] text-white font-extrabold text-[10px] tracking-tight shrink-0 shadow-2xs">
                      PDF
                    </span>
                    <div>
                      <p className="text-xs sm:text-[12.5px] font-bold text-[#163a2b] tracking-tight truncate max-w-[240px] sm:max-w-md leading-tight">
                        {screening?.cv?.fileName || uploadedCvName}
                      </p>
                      <p className="text-[10px] text-[#786c5c] mt-0.5 tracking-tight leading-tight">
                        Uploaded successfully &nbsp;|&nbsp; PDF &nbsp;|&nbsp; {uploadedCvSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto border-t sm:border-t-0 pt-1.5 sm:pt-0 border-[#f0e6d6]">
                    <span className="grid size-5 sm:size-5.5 place-items-center rounded-full bg-[#198754] text-white shrink-0 shadow-2xs">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <div className="text-left">
                      <p className="text-[11.5px] font-bold text-[#163a2b] leading-tight tracking-tight">CV Received</p>
                      <p className="text-[9.5px] sm:text-[10px] text-[#6b6255] leading-tight mt-0.5 tracking-tight">
                        Our AI is now analysing your profile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis in Progress Section */}
                <div className="pt-0.5 space-y-2.5 sm:space-y-3">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1.5 border-b border-[#ebdcc7]/70">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 grid size-5 place-items-center text-[#c9972a]">
                        <Settings size={18} className="animate-spin-slow" />
                      </span>
                      <div>
                        <h3 style={serif} className="text-base sm:text-[17px] font-bold text-[#163a2b] tracking-tight leading-tight">
                          AI Analysis in Progress
                        </h3>
                        <p className="text-[10.5px] sm:text-[11px] text-[#6b6255] mt-0.5 tracking-tight">
                          Please wait while we analyze your profile against the job requirements.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] text-[#554e42] shrink-0 self-start sm:self-center font-medium tracking-tight">
                      <Clock size={24} className="text-[#163a2b]" />
                      <span>This usually takes <br />10 – 20 seconds.</span>
                    </div>
                  </div>

                  {/* 3-Column Interactive Grid: 3 steps on left, Donut with wreath in center, 3 steps on right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center pt-0.5">
                    {/* Left Column (3 steps) */}
                    <div className="md:col-span-4 space-y-2">
                      {LEFT_STEPS.map((step) => {
                        const state = getStepState(step.key);
                        const isDone = state === "done";
                        const isActive = state === "active";
                        const Icon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className={`flex items-center justify-between gap-2.5 rounded-2xl border p-2.5 sm:p-3 transition-all ${isDone
                              ? "border-[#cce5d6] bg-[#fbfdfb]"
                              : isActive
                                ? "border-[#ebdcc7] bg-[#fffdf9] shadow-2xs ring-1 ring-[#c9972a]/30"
                                : "border-[#ebdcc7]/80 bg-[#fffdf9]"
                              }`}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                              <span className="grid size-9 sm:size-10 place-items-center rounded-full bg-[#eaf5ed] border border-[#d2ead9] text-[#0e6037] shrink-0 shadow-2xs">
                                <Icon size={18} strokeWidth={2.2} />
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-[13px] font-bold text-[#0c3363] truncate tracking-tight leading-tight">{step.title}</p>
                                <p className="text-[9.5px] sm:text-[10px] text-[#64748b] leading-tight mt-0.5 line-clamp-1 tracking-tight">
                                  {step.desc}
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 flex items-center justify-center">
                              {isDone ? (
                                <span className="grid size-5 place-items-center rounded-full bg-[#0e6037] text-white shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : isActive ? (
                                <span className="size-4.5 rounded-full border-[2.5px] border-[#e2d7c5] border-t-[#d97706] border-r-[#d97706] animate-spin inline-block" />
                              ) : (
                                <span className="size-4.5 rounded-full border-[2.5px] border-[#e2d7c5] border-t-[#d97706] inline-block" />
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Center Column: Animated Donut Ring with analysis_check botanical wreath */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-1 px-3 sm:px-5 relative">
                      <div className="relative size-40 sm:size-44 lg:size-46 shrink-0 flex items-center justify-center select-none">
                        {/* Botanical leaf wreath backdrop image */}
                        <Image
                          src={analysisCheckImg}
                          alt=""
                          fill
                          priority
                          className="object-contain pointer-events-none select-none z-0"
                        />

                        {/* Circular Progress SVG matching the wreath's ring channel */}
                        <svg
                          className="absolute inset-0 size-full -rotate-90 z-10 pointer-events-none"
                          viewBox="0 0 200 200"
                        >
                          <defs>
                            <linearGradient
                              id="analysisProgressGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#d97706" />
                              <stop offset="40%" stopColor="#ca8a04" />
                              <stop offset="70%" stopColor="#15803d" />
                              <stop offset="100%" stopColor="#165c3b" />
                            </linearGradient>
                          </defs>

                          {/* Dynamic Progress Arc on top of cream ring */}
                          <circle
                            cx={100}
                            cy={100}
                            r={68.5}
                            fill="transparent"
                            stroke="url(#analysisProgressGradient)"
                            strokeWidth={11}
                            strokeDasharray={2 * Math.PI * 68.5}
                            strokeDashoffset={2 * Math.PI * 68.5 * (1 - progress / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>

                        {/* Center Metric with generous side padding so it never touches the ring */}
                        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-[115px] sm:max-w-[130px]">
                          <span className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#0c2340] tracking-tight leading-none">
                            {progress}%
                          </span>
                          <span
                            style={serif}
                            className="text-xs sm:text-[13px] font-bold text-[#0c2340] mt-0.5 leading-tight tracking-tight"
                          >
                            Analyzing...
                          </span>
                          <p className="mt-0.5 text-[8.5px] sm:text-[9px] text-[#475569] font-medium leading-tight tracking-tight">
                            <span className="block">Extracting skills, experience</span>
                            <span className="block mt-0.5">and qualifications</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (3 steps) */}
                    <div className="md:col-span-4 space-y-2">
                      {RIGHT_STEPS.map((step) => {
                        const state = getStepState(step.key);
                        const isDone = state === "done";
                        const isActive = state === "active";
                        const Icon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className={`flex items-center justify-between gap-2.5 rounded-2xl border p-2.5 sm:p-3 transition-all ${isDone
                              ? "border-[#cce5d6] bg-[#fbfdfb]"
                              : isActive
                                ? "border-[#ebdcc7] bg-[#fffdf9] shadow-2xs ring-1 ring-[#c9972a]/30"
                                : "border-[#ebdcc7]/80 bg-[#fffdf9]"
                              }`}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                              <span className="grid size-9 sm:size-10 place-items-center rounded-full bg-[#eaf5ed] border border-[#d2ead9] text-[#0e6037] shrink-0 shadow-2xs">
                                <Icon size={18} strokeWidth={2.2} />
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-[13px] font-bold text-[#0c3363] truncate tracking-tight leading-tight">{step.title}</p>
                                <p className="text-[9.5px] sm:text-[10px] text-[#64748b] leading-tight mt-0.5 line-clamp-1 tracking-tight">
                                  {step.desc}
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 flex items-center justify-center">
                              {isDone ? (
                                <span className="grid size-5 place-items-center rounded-full bg-[#0e6037] text-white shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : isActive ? (
                                <span className="size-4.5 rounded-full border-[2.5px] border-[#e2d7c5] border-t-[#d97706] border-r-[#d97706] animate-spin inline-block" />
                              ) : (
                                <span className="size-4.5 rounded-full border-[2.5px] border-[#e2d7c5] border-t-[#d97706] inline-block" />
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Please Keep This Page Open Callout with page_open.png image */}
                  <div className="relative overflow-hidden rounded-xl bg-[#fbf4e2] border border-[#ebdcc7] p-2.5 sm:p-3 flex items-start gap-2.5">
                    <span className="grid size-6.5 shrink-0 place-items-center rounded-full bg-[#f4e4bf] text-[#8f6826] mt-0.5 z-10">
                      <Lightbulb size={14} />
                    </span>
                    <div className="pr-20 sm:pr-24 text-[10.5px] sm:text-[11px] text-[#554e42] leading-normal tracking-tight relative z-10">
                      <p className="font-bold text-[#163a2b] text-xs sm:text-[12.5px] tracking-tight">
                        Please keep this page open
                      </p>
                      <p className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#6b6255] leading-normal tracking-tight">
                        Do not refresh or close this page while the analysis is in progress. You will be
                        automatically redirected to the next step once the analysis is complete.
                      </p>
                    </div>

                    {/* page_open.png image on the right */}
                    <div className="pointer-events-none absolute -right-2 -bottom-2 w-20 sm:w-24 h-16 sm:h-20 select-none z-0">
                      <Image
                        src={pageOpenImg}
                        alt=""
                        fill
                        className="object-contain object-bottom-right"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ════════ Right Column: Position Applied & What Happens Next (~32%) ════════ */}
          <div className="lg:col-span-5 xl:col-span-4">
            {/* Unified Card matching exact reference design */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fdfbf7] shadow-[0_4px_28px_rgba(70,50,20,0.06)] overflow-hidden">
              {/* 1. Header Banner Image: Together for a Healthier Tomorrow */}
              <div className="relative aspect-[16/5.2] w-full overflow-hidden bg-[#163a2b]">
                <Image
                  src={positionAppliedImg}
                  alt="Together for a Healthier Tomorrow"
                  fill
                  priority
                  className="object-fill"
                />
              </div>

              {/* 2. Inner Card Content */}
              <div className="p-3 sm:p-3.5 space-y-2.5 sm:space-y-3">
                {/* Position Applied For */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                  {/* Bare Doctor Icon matching exact user mockup - NO container, NO border, NO background */}
                  <svg
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-10 sm:size-11 shrink-0 select-none text-[#0b5f36] mt-0.5"
                  >
                    {/* Cap outline */}
                    <path
                      d="M17 15C17 10 21 6.5 26 6.5C31 6.5 35 10 35 15H17Z"
                      stroke="#0b5f36"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 15H38"
                      stroke="#0b5f36"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Face / Mask - solid green oval */}
                    <circle cx="26" cy="20.5" r="7.5" fill="#0b5f36" />
                    {/* Shoulders */}
                    <path
                      d="M11 44C11 36 17 31.5 26 31.5C35 31.5 41 36 41 44"
                      stroke="#0b5f36"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Stethoscope Earpieces & Tube */}
                    <circle cx="19" cy="26" r="1.5" fill="#0b5f36" />
                    <circle cx="33" cy="26" r="1.5" fill="#0b5f36" />
                    <path
                      d="M19 26.5V30C19 33.8 22.2 37 26 37C29.8 37 33 33.8 33 30V26.5"
                      stroke="#0b5f36"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    {/* Stethoscope stem and chestpiece bell */}
                    <path d="M26 37V41" stroke="#0b5f36" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="26" cy="42" r="2.2" stroke="#0b5f36" strokeWidth="2" fill="white" />
                  </svg>

                  {/* Job Details */}
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-medium text-[#375466] block tracking-tight">
                      Position Applied For
                    </span>
                    <h3 style={serif} className="mt-0.5 text-base sm:text-[17px] font-bold text-[#0c3363] leading-snug tracking-tight">
                      {job?.title || "Software Engineer – Full Stack (React / Next.js)"}
                    </h3>

                    {/* Metadata Row: Location | Type | Education - in a single clean row */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] sm:text-[11px] text-[#475467] font-medium tracking-tight">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <MapPin size={13} className="fill-[#e88b22] text-[#e88b22] shrink-0" />
                        <span>{job ? jobLocation(job) : "New Delhi / Ghaziabad (Hybrid)"}</span>
                      </span>

                      <span className="text-[#cbd5e1]">|</span>

                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Calendar size={13} className="text-[#e88b22] shrink-0" strokeWidth={2.2} />
                        <span>{job ? jobType(job) : "Full Time"}</span>
                      </span>

                      <span className="text-[#cbd5e1]">|</span>

                      <div className="inline-flex items-center gap-1">
                        <GraduationCap size={14} className="fill-[#e88b22] text-[#e88b22] shrink-0" />
                        <div className="leading-tight">
                          <span className="whitespace-nowrap">{educationMain}</span>
                          {educationSub && (
                            <span className="block text-[9.5px] text-[#6b7280] font-normal leading-tight">
                              {educationSub}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thin Divider Line */}
                <hr className="border-t border-[#ebdcc7]/80 my-0.5" />

                {/* What Happens Next? Stepper with compact tight spacing */}
                <div>
                  <h4 style={serif} className="text-base sm:text-[17px] font-bold text-[#0c3363] tracking-tight">
                    What Happens Next?
                  </h4>

                  <div className="mt-2 space-y-1.5 sm:space-y-2">
                    {/* Step 1 */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="relative z-10 grid size-5 shrink-0 place-items-center rounded-full bg-[#185a38] text-white font-bold text-[10px] shadow-xs">
                        1
                      </div>
                      {/* Dashed connector line */}
                      <div className="absolute left-[9px] top-5 bottom-[-9px] w-[2px] border-l-2 border-dashed border-[#185a38]" />
                      <div className="pt-0.5">
                        <p className="font-bold text-[#185a38] text-[11.5px] sm:text-xs leading-tight tracking-tight">AI Profile Analysis</p>
                        <p className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#556987] leading-tight tracking-tight">
                          We analyze your CV for relevant skills, qualifications and experience.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="relative z-10 grid size-5 shrink-0 place-items-center rounded-full bg-[#94a3b8] text-white font-bold text-[10px]">
                        2
                      </div>
                      {/* Dashed connector line */}
                      <div className="absolute left-[9px] top-5 bottom-[-9px] w-[2px] border-l-2 border-dashed border-[#cbd5e1]" />
                      <div className="pt-0.5">
                        <p className="font-bold text-[#0c3363] text-[11.5px] sm:text-xs leading-tight tracking-tight">Review Your Details</p>
                        <p className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#556987] leading-tight tracking-tight">
                          You may be asked to verify or add additional information if required.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="relative z-10 grid size-5 shrink-0 place-items-center rounded-full bg-[#94a3b8] text-white font-bold text-[10px]">
                        3
                      </div>
                      {/* Dashed connector line */}
                      <div className="absolute left-[9px] top-5 bottom-[-9px] w-[2px] border-l-2 border-dashed border-[#cbd5e1]" />
                      <div className="pt-0.5">
                        <p className="font-bold text-[#0c3363] text-[11.5px] sm:text-xs leading-tight tracking-tight">Application Submission</p>
                        <p className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#556987] leading-tight tracking-tight">
                          Once confirmed, your application will be submitted to our team.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="relative z-10 grid size-5 shrink-0 place-items-center rounded-full bg-[#94a3b8] text-white font-bold text-[10px]">
                        4
                      </div>
                      <div className="pt-0.5">
                        <p className="font-bold text-[#0c3363] text-[11.5px] sm:text-xs leading-tight tracking-tight">Confirmation</p>
                        <p className="mt-0.5 text-[9.5px] sm:text-[10px] text-[#556987] leading-tight tracking-tight">
                          You will receive a confirmation email with your application details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Your Profile Match Box with your_profile.png image on the right */}
                <div className="mt-2.5 rounded-xl border border-[#ebdcc7] bg-[#fbf4e2]/75 p-3 sm:p-3.5 flex items-center gap-3.5 sm:gap-4 relative overflow-hidden shadow-2xs">
                  {/* Circular Donut Gauge - dynamic */}
                  <div className="relative size-18 sm:size-20 shrink-0 flex items-center justify-center z-10">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#eedfc9"
                        strokeWidth="11"
                        fill="white"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="url(#matchGradientAnalysis)"
                        strokeWidth="11"
                        strokeDasharray={
                          hasResult && calculatedScore !== undefined
                            ? `${(calculatedScore / 100) * 238.76} 238.76`
                            : "0 238.76"
                        }
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                      <defs>
                        <linearGradient id="matchGradientAnalysis" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#84cc16" />
                          <stop offset="45%" stopColor="#16a34a" />
                          <stop offset="100%" stopColor="#14532d" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      {hasResult && calculatedScore !== undefined ? (
                        <span className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
                          {calculatedScore}%
                        </span>
                      ) : (
                        <span className="text-sm sm:text-base font-bold text-[#8d6a3a] tracking-tight">
                          --%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="relative z-10 min-w-0 flex-1 pr-14 sm:pr-18">
                    <h5 style={serif} className="text-sm sm:text-[15px] font-bold text-[#163a2b] leading-tight tracking-tight flex items-center gap-1.5 flex-wrap">
                      <span>Your Profile Match</span>
                      {hasResult ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${
                            isEligible
                              ? "bg-[#dcfce7] text-[#166534] border-[#bbf7d0]"
                              : isPartial
                              ? "bg-[#fef3c7] text-[#92400e] border-[#fde68a]"
                              : "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]"
                          }`}
                        >
                          {isEligible ? "Strong Match" : isPartial ? "Moderate Match" : "Not Eligible"}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold border bg-[#fef3c7] text-[#92400e] border-[#fde68a]">
                          {isAnalyzing ? "Calculating..." : "Pending"}
                        </span>
                      )}
                    </h5>
                    <p className="mt-1 text-[11px] sm:text-xs text-[#4b5563] leading-snug tracking-tight">
                      {hasResult
                        ? isEligible
                          ? "Based on your experience, skills and qualification, you are a strong match for this position."
                          : isPartial
                          ? "Based on your skills and experience, you have a moderate match for this position."
                          : "Your profile does not meet the critical qualifications for this role."
                        : isAnalyzing
                        ? "Calculating match score... Analyzing your skills, experience and qualifications against the role."
                        : "Upload your CV to calculate your profile match score against this position."}
                    </p>
                  </div>

                  {/* your_profile.png image on the right */}
                  <div className="pointer-events-none absolute -right-2 -bottom-2 w-18 sm:w-22 h-18 sm:h-22 select-none z-0">
                    <Image
                      src={yourProfileImg}
                      alt=""
                      fill
                      className="object-contain object-bottom-right"
                    />
                  </div>
                </div>

                {/* 5. Security Notice Footer */}
                <div className="pt-0.5 flex items-center justify-center gap-1.5 text-[10px] sm:text-[10.5px] text-[#556987] tracking-tight">
                  <Lock size={13} className="text-[#0c3363] shrink-0 fill-[#0c3363]" />
                  <span>Your data is secure and will only be used for recruitment purposes.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      </section>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf4e2]" />}>
      <AnalysisContent />
    </Suspense>
  );
}
