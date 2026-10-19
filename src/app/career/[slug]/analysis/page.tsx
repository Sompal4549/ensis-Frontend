"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
import detailBg from "@/assets/career/new/career-detail-bg.png";
import positionAppliedImg from "@/assets/career/new/position_applied.png";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";

type StepMeta = {
  key: StepKey;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsReupload, setNeedsReupload] = useState(false);
  const [fileToReupload, setFileToReupload] = useState<File | null>(null);
  const [uploadedCvName, setUploadedCvName] = useState<string>("Vijay_Sharma_CV.pdf");
  const [uploadedCvSize, setUploadedCvSize] = useState<string>("2.4 MB");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!slug) return;
    getJob(slug).then((j) => {
      if (j) setJob(j);
      else router.replace("/career");
    });
  }, [slug, router]);

  useEffect(() => {
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
  }, [job, slug, router]);

  const handleReuploadSubmit = () => {
    if (!fileToReupload || !job) return;
    setCvFile(fileToReupload);
    setUploadedCvName(fileToReupload.name);
    setUploadedCvSize(`${(fileToReupload.size / (1024 * 1024)).toFixed(1)} MB`);
    setNeedsReupload(false);
    startedRef.current = false;
  };

  const getStepState = (key: StepKey): StepState => {
    const found = screening?.steps?.find((s) => s.key === key);
    return found?.state || "pending";
  };

  const progress = screening?.progress || 68;

  return (
    <div className="relative min-h-screen bg-[#fbf4e2] text-[#3f3a33] overflow-hidden">
      {/* ── 1. Top Panoramic Hero Banner (Application in Progress) ── */}
      <section className="relative isolate w-full overflow-hidden">
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
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-transparent to-[#fbf4e2]" />

        <Container className="relative py-0!">
          <div className="max-w-[620px] pt-6 pb-6 sm:pt-8 sm:pb-8 lg:pt-9 lg:pb-9">
            <Eyebrow>Careers at Ensis</Eyebrow>

            <h1
              style={serif}
              className="mt-2 text-[2.2rem] sm:text-[2.6rem] lg:text-[2.95rem] font-bold leading-[1.04] tracking-[-0.015em] text-[#163a2b]"
            >
              Application in Progress
            </h1>

            <p className="mt-2.5 text-xs sm:text-[13px] leading-[1.5] text-[#4a4237]">
              We&apos;re excited to have you on board! Your application is under review.
              Here&apos;s an update on your progress so far.
            </p>
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

      {/* ── 2. Main 2-Column Section Matching Mockup ── */}
      <Container className="pt-2 sm:pt-3 pb-12 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* ════════ Left Column: Application Status & Steps Card (~68%) ════════ */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-5 sm:p-7 shadow-[0_4px_24px_rgba(70,50,20,0.06)] space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#8d6a3a] font-medium">
              <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center">
                <Home size={13} className="text-[#a8792c]" />
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <Link href="/career" className="hover:text-[#163a2b] transition-colors">
                Careers
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <span className="text-[#163a2b] font-semibold">Application in Progress</span>
            </div>

            {/* 4-Step Horizontal Stepper Bar */}
            <div className="py-2 px-1 sm:px-4">
              <div className="relative flex items-center justify-between">
                {/* Connecting Lines Behind */}
                <div className="absolute left-[10%] right-[10%] top-4 h-[2px] -translate-y-1/2 bg-[#e2d5c0]">
                  {/* Step 1 to Step 2 completed line */}
                  <div className="h-full w-1/3 bg-[#163a2b]" />
                </div>

                {/* Step 1: Upload CV (Completed) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-8 sm:size-9 place-items-center rounded-full bg-[#163a2b] text-white shadow-xs">
                    <Check size={16} strokeWidth={2.8} />
                  </div>
                  <span className="mt-2 text-xs sm:text-[12.5px] font-bold text-[#163a2b]">Upload CV</span>
                  <span className="text-[10.5px] font-medium text-[#198754]">Completed</span>
                </div>

                {/* Step 2: AI Analysis (In Progress) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-8 sm:size-9 place-items-center rounded-full bg-[#c9972a] text-white font-bold text-xs sm:text-sm shadow-xs ring-4 ring-[#faedd4]">
                    2
                  </div>
                  <span className="mt-2 text-xs sm:text-[12.5px] font-bold text-[#163a2b]">AI Analysis</span>
                  <span className="text-[10.5px] font-medium text-[#c9972a]">In Progress</span>
                </div>

                {/* Step 3: Review Details (Pending) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-8 sm:size-9 place-items-center rounded-full border-2 border-[#d6c7b0] bg-[#fffdf9] font-bold text-xs sm:text-sm text-[#8c7e6c]">
                    3
                  </div>
                  <span className="mt-2 text-xs sm:text-[12.5px] font-medium text-[#736a5c]">Review Details</span>
                  <span className="text-[10.5px] text-[#9e9587]">Pending</span>
                </div>

                {/* Step 4: Submit Application (Pending) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid size-8 sm:size-9 place-items-center rounded-full border-2 border-[#d6c7b0] bg-[#fffdf9] font-bold text-xs sm:text-sm text-[#8c7e6c]">
                    4
                  </div>
                  <span className="mt-2 text-xs sm:text-[12.5px] font-medium text-[#736a5c]">Submit Application</span>
                  <span className="text-[10.5px] text-[#9e9587]">Pending</span>
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#163a2b] px-5 py-2 text-xs font-semibold text-white shadow-xs"
                      >
                        <span>Start Analysis</span> <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#163a2b] px-5 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#163a2b] px-4 py-2 text-xs font-semibold text-white"
                  >
                    <RotateCw size={13} /> Try Again
                  </button>
                  <Link
                    href={`/career/${encodeURIComponent(slug)}`}
                    className="inline-flex items-center rounded-lg border border-[#ebdcc7] bg-white px-4 py-2 text-xs font-semibold text-[#554e42]"
                  >
                    Back to Upload
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* CV File Uploaded Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#e8decb] bg-[#fdfbf7] p-3 sm:p-3.5 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-[#d93829] text-white font-extrabold text-[11px] tracking-wider shrink-0 shadow-2xs">
                      PDF
                    </span>
                    <div>
                      <p className="text-xs sm:text-[13px] font-bold text-[#163a2b] truncate max-w-[240px] sm:max-w-md">
                        {screening?.cv?.fileName || uploadedCvName}
                      </p>
                      <p className="text-[11px] text-[#786c5c] mt-0.5">
                        Uploaded successfully &nbsp;|&nbsp; PDF &nbsp;|&nbsp; {uploadedCvSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-[#f0e6d6]">
                    <span className="grid size-6 place-items-center rounded-full bg-[#198754] text-white shrink-0 shadow-2xs">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#163a2b] leading-tight">CV Received</p>
                      <p className="text-[10.5px] text-[#6b6255] leading-tight mt-0.5">
                        Our AI is now analysing your profile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis in Progress Section */}
                <div className="pt-1 space-y-4">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#ebdcc7]/70">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid size-6 place-items-center text-[#c9972a]">
                        <Settings size={20} className="animate-spin-slow" />
                      </span>
                      <div>
                        <h3 style={serif} className="text-lg sm:text-xl font-bold text-[#163a2b]">
                          AI Analysis in Progress
                        </h3>
                        <p className="text-xs text-[#6b6255] mt-0.5">
                          Please wait while we analyze your profile against the job requirements.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#554e42] shrink-0 self-start sm:self-center font-medium">
                      <Clock size={15} className="text-[#163a2b]" />
                      <span>This usually takes 10 – 20 seconds.</span>
                    </div>
                  </div>

                  {/* 3-Column Interactive Grid: 3 steps on left, Donut with wreath in center, 3 steps on right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center pt-1">
                    {/* Left Column (3 steps) */}
                    <div className="md:col-span-4 space-y-2.5">
                      {LEFT_STEPS.map((step) => {
                        const state = getStepState(step.key);
                        const isDone = state === "done";
                        const isActive = state === "active";
                        const Icon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className={`flex items-start justify-between gap-2.5 rounded-xl border p-2.5 sm:p-3 transition-all ${
                              isDone
                                ? "border-[#c4dbcb] bg-[#f5faf6]"
                                : isActive
                                ? "border-[#dfcca7] bg-[#fffaf0] shadow-2xs ring-2 ring-[#faedd4]"
                                : "border-[#ebdcc7]/70 bg-[#fffdf9]"
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span className="grid size-7 place-items-center rounded-lg bg-[#163a2b] text-white shrink-0 mt-0.5">
                                <Icon size={14} />
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#163a2b] truncate">{step.title}</p>
                                <p className="text-[10px] text-[#6b6255] leading-tight mt-0.5 line-clamp-2">
                                  {step.desc}
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 mt-1">
                              {isDone ? (
                                <span className="grid size-4.5 place-items-center rounded-full bg-[#198754] text-white">
                                  <Check size={11} strokeWidth={3} />
                                </span>
                              ) : isActive ? (
                                <span className="size-4 rounded-full border-2 border-[#c9972a] border-t-transparent animate-spin inline-block" />
                              ) : (
                                <span className="size-4 rounded-full border-2 border-[#dfcca7] inline-block" />
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Center Column: Animated Donut Ring with Botanical Leaf Accents */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-2 relative">
                      {/* Botanical leafy background accents */}
                      <div className="relative size-40 sm:size-44 flex items-center justify-center">
                        {/* Decorative leaf SVGs around ring */}
                        <svg className="absolute inset-0 size-full pointer-events-none text-[#163a2b]/25" viewBox="0 0 160 160">
                          <g fill="currentColor">
                            <path d="M 20 60 C 10 50, 5 70, 18 75 C 24 77, 26 70, 20 60 Z" />
                            <path d="M 140 60 C 150 50, 155 70, 142 75 C 136 77, 134 70, 140 60 Z" />
                            <path d="M 28 110 C 20 120, 35 130, 42 120 C 45 115, 38 108, 28 110 Z" />
                            <path d="M 132 110 C 140 120, 125 130, 118 120 C 115 115, 122 108, 132 110 Z" />
                          </g>
                        </svg>

                        {/* Circular Progress SVG */}
                        <svg className="size-32 sm:size-36 -rotate-90">
                          <circle
                            cx={68}
                            cy={68}
                            r={54}
                            fill="transparent"
                            stroke="#f3e9d7"
                            strokeWidth={9}
                          />
                          <circle
                            cx={68}
                            cy={68}
                            r={54}
                            fill="transparent"
                            stroke="#163a2b"
                            strokeWidth={9}
                            strokeDasharray={2 * Math.PI * 54}
                            strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>

                        {/* Center Metric */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                          <span className="text-3xl sm:text-4xl font-extrabold text-[#163a2b] tracking-tight">
                            {progress}%
                          </span>
                          <span className="text-xs sm:text-[13px] font-bold text-[#163a2b] mt-0.5">
                            Analyzing...
                          </span>
                          <span className="text-[9.5px] text-[#736a5c] max-w-[110px] leading-tight mt-1">
                            Extracting skills, experience and qualifications
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (3 steps) */}
                    <div className="md:col-span-4 space-y-2.5">
                      {RIGHT_STEPS.map((step) => {
                        const state = getStepState(step.key);
                        const isDone = state === "done";
                        const isActive = state === "active";
                        const Icon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className={`flex items-start justify-between gap-2.5 rounded-xl border p-2.5 sm:p-3 transition-all ${
                              isDone
                                ? "border-[#c4dbcb] bg-[#f5faf6]"
                                : isActive
                                ? "border-[#dfcca7] bg-[#fffaf0] shadow-2xs ring-2 ring-[#faedd4]"
                                : "border-[#ebdcc7]/70 bg-[#fffdf9]"
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span className="grid size-7 place-items-center rounded-lg bg-[#163a2b] text-white shrink-0 mt-0.5">
                                <Icon size={14} />
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#163a2b] truncate">{step.title}</p>
                                <p className="text-[10px] text-[#6b6255] leading-tight mt-0.5 line-clamp-2">
                                  {step.desc}
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 mt-1">
                              {isDone ? (
                                <span className="grid size-4.5 place-items-center rounded-full bg-[#198754] text-white">
                                  <Check size={11} strokeWidth={3} />
                                </span>
                              ) : isActive ? (
                                <span className="size-4 rounded-full border-2 border-[#c9972a] border-t-transparent animate-spin inline-block" />
                              ) : (
                                <span className="size-4 rounded-full border-2 border-[#dfcca7] inline-block" />
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Please Keep This Page Open Callout with Leaf Sprig */}
                  <div className="relative overflow-hidden rounded-xl bg-[#fbf4e2] border border-[#ebdcc7] p-3 sm:p-3.5 flex items-start gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f4e4bf] text-[#8f6826] mt-0.5">
                      <Lightbulb size={16} />
                    </span>
                    <div className="pr-12 text-xs text-[#554e42] leading-relaxed">
                      <p className="font-bold text-[#163a2b] text-xs sm:text-[13px]">
                        Please keep this page open
                      </p>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-[#6b6255]">
                        Do not refresh or close this page while the analysis is in progress. You will be
                        automatically redirected to the next step once the analysis is complete.
                      </p>
                    </div>

                    {/* Subtle leaf watermark in bottom right corner */}
                    <div className="pointer-events-none absolute right-1 bottom-0 opacity-25">
                      <svg width="60" height="40" viewBox="0 0 60 40" fill="#163a2b">
                        <path d="M 10 35 C 20 20, 45 10, 55 5 C 50 20, 35 32, 10 35 Z" />
                        <path d="M 25 35 C 32 25, 48 18, 55 15 C 50 25, 40 33, 25 35 Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ════════ Right Column: Position Applied & What Happens Next (~32%) ════════ */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* 1. Together for a Healthier Tomorrow Visual Card (using position_applied.png) */}
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-[#ebdcc7] shadow-xs bg-[#163a2b]">
              <Image
                src={positionAppliedImg}
                alt="Together for a Healthier Tomorrow"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* 2. Position Applied For Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <div className="flex items-start gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-[#eef5f0] text-[#163a2b] shrink-0 border border-[#c4dbcb]">
                  <UserCheck size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9a7334]">
                    Position Applied For
                  </span>
                  <h3 style={serif} className="mt-0.5 text-lg sm:text-xl font-bold text-[#163a2b] truncate">
                    {job?.title || "Product Designer"}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-[#554e42] font-medium">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} className="text-[#c9972a] shrink-0" />
                      <span>{job ? jobLocation(job) : "Delhi NCR"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={13} className="text-[#c9972a] shrink-0" />
                      <span>{job ? jobType(job) : "Full Time"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap size={13} className="text-[#c9972a] shrink-0" />
                      <span className="truncate max-w-[150px]">
                        {job?.educationRequirements || "B.Des / M.Des"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. What Happens Next? Timeline Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
              <h4 style={serif} className="text-lg font-bold text-[#163a2b]">
                What Happens Next?
              </h4>

              <div className="mt-3.5 space-y-3.5 text-xs">
                {/* Step 1 */}
                <div className="relative flex items-start gap-3">
                  <div className="relative z-10 grid size-5.5 shrink-0 place-items-center rounded-full bg-[#163a2b] text-white font-bold text-[11px]">
                    1
                  </div>
                  {/* Dashed connector line */}
                  <div className="absolute left-2.5 top-6 bottom-[-14px] w-[1px] border-l border-dashed border-[#8d948a]" />
                  <div>
                    <p className="font-bold text-[#163a2b] leading-tight">AI Profile Analysis</p>
                    <p className="mt-0.5 text-[11px] text-[#6b6255] leading-relaxed">
                      We analyze your CV for relevant skills, qualifications and experience.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-3">
                  <div className="relative z-10 grid size-5.5 shrink-0 place-items-center rounded-full bg-[#9e978e] text-white font-bold text-[11px]">
                    2
                  </div>
                  {/* Dashed connector line */}
                  <div className="absolute left-2.5 top-6 bottom-[-14px] w-[1px] border-l border-dashed border-[#8d948a]" />
                  <div>
                    <p className="font-bold text-[#163a2b] leading-tight">Review Your Details</p>
                    <p className="mt-0.5 text-[11px] text-[#6b6255] leading-relaxed">
                      You may be asked to verify or add additional information if required.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-3">
                  <div className="relative z-10 grid size-5.5 shrink-0 place-items-center rounded-full bg-[#9e978e] text-white font-bold text-[11px]">
                    3
                  </div>
                  {/* Dashed connector line */}
                  <div className="absolute left-2.5 top-6 bottom-[-14px] w-[1px] border-l border-dashed border-[#8d948a]" />
                  <div>
                    <p className="font-bold text-[#163a2b] leading-tight">Application Submission</p>
                    <p className="mt-0.5 text-[11px] text-[#6b6255] leading-relaxed">
                      Once confirmed, your application will be submitted to our team.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-3">
                  <div className="relative z-10 grid size-5.5 shrink-0 place-items-center rounded-full bg-[#9e978e] text-white font-bold text-[11px]">
                    4
                  </div>
                  <div>
                    <p className="font-bold text-[#163a2b] leading-tight">Confirmation</p>
                    <p className="mt-0.5 text-[11px] text-[#6b6255] leading-relaxed">
                      You will receive a confirmation email with your application details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Match Score Preview Box with 85% Donut */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3.5 flex items-center gap-3.5 shadow-2xs">
              <div className="relative size-14 shrink-0 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#eedfc2]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#163a2b]"
                    strokeDasharray="85, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-[#163a2b]">85%</span>
              </div>

              <div>
                <p className="text-xs font-bold text-[#163a2b] leading-tight">Your Profile Match</p>
                <p className="mt-0.5 text-[10.5px] leading-tight text-[#6b6255]">
                  Based on your experience, skills and qualification, you are a strong match for this position.
                </p>
              </div>
            </div>

            {/* 5. Footer with Lock Icon */}
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
