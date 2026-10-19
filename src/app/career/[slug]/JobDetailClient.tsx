"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Lock,
  Check,
  ArrowRight,
  Home,
  BarChart3,
} from "lucide-react";
import { serif } from "@/components/career-v2/ui";
import { CareerDetailBanner } from "@/components/career-v2/flow/CareerDetailBanner";
import { Container } from "@/components/ui/Container";
import type { PublicJob } from "@/lib/careerApi";
import { jobExperience, jobLocation, jobType } from "@/lib/careers";
import { setCvFile, saveFlowState } from "@/lib/careerFlowV2";
import { getImageUrl } from "@/lib/api/api";
import jobDesignerFallback from "@/assets/career/new/Designing a Modern Lounge Chair.webp";
import aiRobot from "@/assets/career/new/ai_robot.png";
import iconLeaf from "@/assets/career/first-step/Glossy Golden Leaf Emblem.png";
import iconTeam from "@/assets/career/first-step/Golden Group Icon in Circle.png";
import iconGrowth from "@/assets/career/first-step/Golden Growth Chart Icon.png";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const DEFAULT_RESPONSIBILITIES = [
  "Design innovative wellness furniture and treatment solutions for spas and wellness spaces.",
  "Create product concepts, 3D models and detailed technical drawings.",
  "Collaborate with manufacturing, sourcing and project teams to ensure design feasibility.",
  "Ensure the right balance of functionality, comfort, ergonomics and aesthetics.",
];

const DEFAULT_REQUIREMENTS = [
  "Bachelor's or Master's degree in Product Design, Industrial Design or Interior Design.",
  "Proficiency in design tools such as AutoCAD, SolidWorks, SketchUp, Rhino or similar.",
  "Strong portfolio showcasing furniture or product design work.",
  "Good communication and collaboration skills.",
  "Passion for wellness design and creating meaningful spaces.",
];

const DEFAULT_AI_CHECKS = [
  "Relevant product design experience",
  "Experience in furniture / industrial / interior design",
  "Proficiency in CAD / 3D design tools",
  "Portfolio and design quality",
  "Communication & teamwork skills",
  "Overall profile match",
];

export function JobDetailClient({ job, slug }: { job: PublicJob; slug: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (file: File | null) => {
    setErrorMessage(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const name = file.name.toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
    if (!isValidExt) {
      setErrorMessage("Please upload a PDF, DOC, or DOCX document.");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_BYTES) {
      setErrorMessage("File exceeds 5 MB. Please upload a smaller file.");
      setSelectedFile(null);
      return;
    }

    if (file.size === 0) {
      setErrorMessage("The uploaded file is empty.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setIsSubmitting(true);
    setCvFile(selectedFile);
    saveFlowState({
      job,
      updatedAt: new Date().toISOString(),
    });

    router.push(`/career/${encodeURIComponent(slug)}/analysis`);
  };

  const responsibilities =
    job.responsibilities && job.responsibilities.length > 0
      ? job.responsibilities
      : DEFAULT_RESPONSIBILITIES;

  const requirements =
    job.requirements && job.requirements.length > 0
      ? job.requirements
      : DEFAULT_REQUIREMENTS;

  const aiCheckList =
    job.aiCheckPoints && job.aiCheckPoints.length > 0
      ? job.aiCheckPoints
      : DEFAULT_AI_CHECKS;

  const jobPhoto = job.coverImage ? getImageUrl(job.coverImage) : jobDesignerFallback;

  return (
    <div className="relative min-h-screen bg-[#fbf4e2] text-[#3f3a33] overflow-hidden">
      {/* 1. Top Panoramic Hero matching mockup */}
      <CareerDetailBanner />

      {/* Botanical leaves along left and right edges: left starts from right, right starts from left */}
      <div className="pointer-events-none absolute left-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden">
        <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
      </div>
      <div className="pointer-events-none absolute right-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden">
        <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
      </div>

      {/* 2. Main 2-Column Section matching mockup: tight top margin with no large gap */}
      <Container className="pt-2 sm:pt-3 pb-10 sm:pb-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* ── Left Column: Job Details Card (~68% on large screens) ── */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-5 sm:p-7 shadow-[0_4px_24px_rgba(70,50,20,0.06)]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#8d6a3a] mb-2 font-medium">
              <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center">
                <Home size={13} className="text-[#a8792c]" />
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <Link href="/career" className="hover:text-[#163a2b] transition-colors">
                Careers
              </Link>
              <span className="text-[#c9a86a]">&gt;</span>
              <span className="text-[#163a2b] font-semibold">Apply for Position</span>
            </div>

            {/* Pill: FULL TIME */}
            <span className="inline-block rounded-full bg-[#f4e9d5] text-[#8f6826] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              {jobType(job).toUpperCase() || "FULL TIME"}
            </span>

            {/* Job Title */}
            <h1
              style={serif}
              className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#163a2b] leading-[1.12]"
            >
              {job.title}
            </h1>

            {/* Meta row with 4 icon indicators */}
            <div className="mt-2.5 mb-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-[12.5px] font-medium text-[#4a4237]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-[#c9972a] shrink-0" />
                <span>{jobLocation(job)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#c9972a] shrink-0" />
                <span>{jobType(job)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 size={14} className="text-[#c9972a] shrink-0" />
                <span>{jobExperience(job) || "2 - 5 Years"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={15} className="text-[#c9972a] shrink-0" />
                <span className="whitespace-pre-line leading-tight">
                  {job.educationRequirements || "B.Des / M.Des\n(Product or Industrial Design)"}
                </span>
              </span>
            </div>

            {/* Role Introduction */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#554e42] border-b border-[#ebdcc7]/80 pb-4 mb-4">
              {job.shortDescription ||
                `Join ENSIS as a ${job.title} and be part of our mission to create innovative wellness furniture and treatment solutions that enhance people's well-being and transform spaces worldwide.`}
            </p>

            {/* Inner 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Sub-column: Responsibilities & Qualifications (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                {/* Key Responsibilities */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="grid size-6 place-items-center rounded-full bg-[#163a2b] text-white shrink-0">
                      <FileText size={13} />
                    </span>
                    <h3 style={serif} className="text-base sm:text-[17px] font-bold text-[#163a2b]">
                      Key Responsibilities
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-[12px] text-[#4b4336] leading-relaxed">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#c9972a] text-white">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Qualifications & Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="grid size-6 place-items-center rounded-full bg-[#163a2b] text-white shrink-0">
                      <GraduationCap size={13} />
                    </span>
                    <h3 style={serif} className="text-base sm:text-[17px] font-bold text-[#163a2b]">
                      Qualifications & Experience
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-[12px] text-[#4b4336] leading-relaxed">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#c9972a] text-white">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedFile) {
                        handleStartAnalysis();
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#163a2b] hover:bg-[#0f2a1f] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-[0_4px_14px_rgba(22,58,43,0.25)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Apply for this Position</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Right Sub-column: Job Photo & 3 Pillars (5 cols) */}
              <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
                {/* Job Photo */}
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-[#ebdcc7] bg-[#efe6d6] shadow-xs">
                  <Image
                    src={jobPhoto}
                    alt={job.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* 3 Circular Icons with labels: People / Ideas / Growth - no extra outer circle */}
                <div className="pt-1 flex flex-col items-center">
                  <div className="flex items-center justify-center gap-5 sm:gap-6">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="relative size-11 sm:size-12 flex items-center justify-center">
                        <Image src={iconLeaf} alt="People" width={42} height={42} className="object-contain drop-shadow-xs" />
                      </div>
                      <span className="text-[11.5px] font-semibold text-[#163a2b]">People</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="relative size-11 sm:size-12 flex items-center justify-center">
                        <Image src={iconTeam} alt="Ideas" width={42} height={42} className="object-contain drop-shadow-xs" />
                      </div>
                      <span className="text-[11.5px] font-semibold text-[#163a2b]">Ideas</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="relative size-11 sm:size-12 flex items-center justify-center">
                        <Image src={iconGrowth} alt="Growth" width={42} height={42} className="object-contain drop-shadow-xs" />
                      </div>
                      <span className="text-[11.5px] font-semibold text-[#163a2b]">Growth</span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[10px] tracking-[0.24em] font-bold text-[#8f6826] uppercase text-center">
                    FOR A HEALTHIER TOMORROW
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: AI Eligibility Card (~32% on large screens) ── */}
          <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 shadow-[0_4px_24px_rgba(70,50,20,0.06)] relative overflow-hidden">
            {/* Header with AI Robot sitting directly on top of the Upload box */}
            <div className="relative flex items-end justify-between gap-2 px-0.5">
              <div className="max-w-[65%] pb-1">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#9a7334]">
                  <span>LET AI HELP YOU</span>
                  <Sparkles size={12} className="text-[#c9972a]" />
                </div>
                <h3 style={serif} className="mt-1 text-xl sm:text-[22px] font-bold text-[#163a2b] leading-tight">
                  Check Your Eligibility with AI
                </h3>
                <p className="mt-1 text-[11.5px] sm:text-xs text-[#5f5647] leading-relaxed">
                  Upload your CV and get an instant analysis of how well your profile matches this position.
                </p>
              </div>

              {/* Cute AI Robot Mascot: touching the upload box directly at bottom */}
              <div className="relative w-24 h-26 sm:w-28 sm:h-30 shrink-0 pointer-events-none -mb-[1px] z-10">
                <Image
                  src={aiRobot}
                  alt="Ensis AI Mascot"
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Upload CV Drop Box - directly attached under the robot */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative z-0 cursor-pointer rounded-xl border border-[#dfcca7] bg-[#fbf5eb] p-4 text-center transition-all hover:bg-[#f6ebd7] ${
                dragOver ? "border-[#163a2b] bg-[#eef4f0]" : ""
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <span className="text-[#a8792c] mb-1">
                  <UploadCloud size={26} strokeWidth={1.8} />
                </span>
                <p className="text-xs sm:text-[13px] font-bold text-[#163a2b]">
                  {selectedFile ? selectedFile.name : "Upload Your CV"}
                </p>
                <p className="text-[11px] text-[#6b6255] mt-0.5">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Drag & drop your file here or click to browse"}
                </p>
                <p className="text-[10px] text-[#8d6a3a] mt-0.5">PDF, DOC or DOCX (Max 5 MB)</p>

                {selectedFile ? (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartAnalysis();
                      }}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#163a2b] hover:bg-[#0f2a1f] px-5 py-1.5 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                    >
                      <span>{isSubmitting ? "Analyzing..." : "Analyze Match"}</span>
                      <ArrowRight size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-1 rounded text-[#dc2626] hover:bg-red-50 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#163a2b] hover:bg-[#0f2a1f] px-5 py-1.5 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                  >
                    <span>Choose File</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-[#fef2f2] p-2 text-xs text-[#dc2626] border border-[#fecaca]">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* AI Check List */}
            <div className="mt-3.5 space-y-1">
              <p className="text-[11.5px] font-bold text-[#163a2b]">AI will check:</p>
              <ul className="space-y-1">
                {aiCheckList.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11.5px] text-[#554e42] leading-snug">
                    <span className="mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full bg-[#c9972a] text-white">
                      <Check size={9} strokeWidth={3} />
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Match Score Preview Box with 85% Donut */}
            <div className="mt-3.5 rounded-xl border border-[#ebdcc7] bg-white p-3 flex items-center gap-3.5 shadow-2xs">
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

            {/* Footer with Lock icon */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-[#8d6a3a]">
              <Lock size={12} className="text-[#2b2723] shrink-0" />
              <span>Your data is secure and will only be used for recruitment purposes.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
