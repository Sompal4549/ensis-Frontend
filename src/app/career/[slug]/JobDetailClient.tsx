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
      <div className="pointer-events-none absolute left-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden opacity-40">
        <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
      </div>
      <div className="pointer-events-none absolute right-0 top-[260px] bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-0 overflow-hidden opacity-40">
        <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
      </div>

      {/* 2. Main 2-Column Section matching mockup: compact styling fitting within single screen height */}
      <Container className="pt-1.5 sm:pt-2.5 pb-4 sm:pb-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 items-start">
          {/* ── Left Column: Job Details Card (66.7% on desktop) ── */}
          <div className="lg:col-span-8 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3.5 sm:p-5 shadow-[0_2px_16px_rgba(70,50,20,0.04)]">
            <div className="flex flex-col md:flex-row gap-4 lg:gap-5 items-stretch">
              {/* Left Sub-column: 65% width (All details, lists & button) */}
              <div className="w-full md:w-[65%] flex flex-col justify-between">
                <div>
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6f5e49] mb-1 font-medium">
                    <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center">
                      <Home size={11} className="text-[#163a2b]" />
                    </Link>
                    <span className="text-[#bba383] text-[9px]">&gt;</span>
                    <Link href="/career" className="hover:text-[#163a2b] transition-colors">
                      Careers
                    </Link>
                    <span className="text-[#bba383] text-[9px]">&gt;</span>
                    <span className="text-[#163a2b] font-semibold">Apply for Position</span>
                  </div>

                  {/* Pill: FULL TIME */}
                  <span className="inline-block rounded-full bg-[#f4ebd9] text-[#9a702c] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {jobType(job).toUpperCase() || "FULL TIME"}
                  </span>

                  {/* Job Title: prominent size */}
                  <h1
                    style={{ ...serif, fontSize: "36px", lineHeight: "1.15", fontWeight: 800 }}
                    className="font-extrabold text-[#163a2b] mb-2 tracking-tight"
                  >
                    {job.title}
                  </h1>

                  {/* Meta row: all 4 items strictly in ONE single row */}
                  <div className="mb-2 flex items-center flex-nowrap gap-x-2 sm:gap-x-2.5 text-[10.5px] xl:text-[11px] font-medium text-[#3e382f] whitespace-nowrap overflow-x-auto no-scrollbar">
                    {/* 1. Location */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <MapPin size={12} className="text-[#c9972a] shrink-0" />
                      <span>{jobLocation(job)}</span>
                    </span>

                    <span className="h-3 w-px bg-[#dccbb4] shrink-0" />

                    {/* 2. Type */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <Briefcase size={12} className="text-[#c9972a] shrink-0" />
                      <span>{jobType(job)}</span>
                    </span>

                    <span className="h-3 w-px bg-[#dccbb4] shrink-0" />

                    {/* 3. Experience */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <BarChart3 size={12} className="text-[#c9972a] shrink-0" />
                      <span>{jobExperience(job) || "3 – 7 Years"}</span>
                    </span>

                    <span className="h-3 w-px bg-[#dccbb4] shrink-0" />

                    {/* 4. Education */}
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <GraduationCap size={13} className="text-[#c9972a] shrink-0" />
                      <span className="flex flex-col leading-tight">
                        <span className="text-[10px] font-semibold text-[#2f2b24]">
                          {job.educationRequirements
                            ? job.educationRequirements.includes(";")
                              ? job.educationRequirements.split(";")[0]?.trim()
                              : job.educationRequirements.includes("(")
                                ? job.educationRequirements.split("(")[0]?.trim()
                                : job.educationRequirements
                            : "Any graduate"}
                        </span>
                        <span className="text-[8.5px] text-[#6b6255]">
                          {job.educationRequirements
                            ? job.educationRequirements.includes(";")
                              ? job.educationRequirements.split(";")[1]?.trim()
                              : job.educationRequirements.includes("(")
                                ? `(${job.educationRequirements.split("(")[1]?.replace(")", "").trim()})`
                                : ""
                            : "web development certification is a plus"}
                        </span>
                      </span>
                    </span>
                  </div>

                  {/* Role Introduction: 14px font */}
                  <p className="text-[14px] leading-relaxed text-[#4e473b] mb-2.5">
                    {job.shortDescription ||
                      `Join ENSIS as a ${job.title} and be part of our mission to create innovative wellness furniture and treatment solutions that enhance people's well-being and transform spaces worldwide.`}
                  </p>

                  {/* Key Responsibilities */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="grid size-7 sm:size-7.5 place-items-center rounded-full bg-[#163a2b] text-white shrink-0 shadow-xs">
                        <FileText size={14} />
                      </span>
                      <h3 style={serif} className="text-[15px] sm:text-[16px] font-bold text-[#163a2b]">
                        Key Responsibilities
                      </h3>
                    </div>
                    <ul className="space-y-0.5">
                      {responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 text-[14px] text-[#3e382f] leading-snug">
                          <span className="mt-[3px] grid size-4 shrink-0 place-items-center rounded-full bg-[#c9972a] text-white">
                            <Check size={9} strokeWidth={3.5} />
                          </span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="grid size-7 sm:size-7.5 place-items-center rounded-full bg-[#163a2b] text-white shrink-0 shadow-xs">
                        <GraduationCap size={14} />
                      </span>
                      <h3 style={serif} className="text-[15px] sm:text-[16px] font-bold text-[#163a2b]">
                        Qualifications & Experience
                      </h3>
                    </div>
                    <ul className="space-y-0.5">
                      {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-[14px] text-[#3e382f] leading-snug">
                          <span className="mt-[3px] grid size-4 shrink-0 place-items-center rounded-full bg-[#c9972a] text-white">
                            <Check size={9} strokeWidth={3.5} />
                          </span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                    className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] text-white px-5 py-2.5 text-[13.5px] sm:text-[14px] font-semibold shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Apply for this Position</span>
                    <ArrowRight size={14} className="text-[#e5b85a]" />
                  </button>
                </div>
              </div>

              {/* Right Sub-column: 35% width, image restored to previous height, pillars at bottom */}
              <div className="w-full md:w-[35%] flex flex-col self-stretch">
                {/* Job Photo with restored previous height */}
                <div className="relative w-full h-[68%] sm:h-[70%] min-h-[220px] overflow-hidden rounded-xl border border-[#ebdcc7] bg-[#efe6d6] shadow-xs">
                  <Image
                    src={jobPhoto}
                    alt={job.title}
                    fill
                    className="object-cover object-left"
                  />
                </div>

                {/* 3 Circular Pillars right below the image */}
                <div className="pt-2 flex flex-col items-center w-full">
                  <div className="flex items-center justify-around w-full px-1">
                    <div className="flex flex-col items-center gap-0.5 text-center">
                      <div className="relative size-9 sm:size-10 flex items-center justify-center">
                        <Image src={iconLeaf} alt="People" width={40} height={40} className="object-contain drop-shadow-xs" />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-semibold text-[#163a2b]">People</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-center">
                      <div className="relative size-9 sm:size-10 flex items-center justify-center">
                        <Image src={iconTeam} alt="Ideas" width={40} height={40} className="object-contain drop-shadow-xs" />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-semibold text-[#163a2b]">Ideas</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-center">
                      <div className="relative size-9 sm:size-10 flex items-center justify-center">
                        <Image src={iconGrowth} alt="Growth" width={40} height={40} className="object-contain drop-shadow-xs" />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-semibold text-[#163a2b]">Growth</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[8.5px] sm:text-[9px] tracking-[0.24em] font-bold text-[#8f6826] uppercase text-center">
                    FOR A HEALTHIER TOMORROW
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: AI Eligibility Card (33.3% on desktop) ── */}
          <div className="lg:col-span-4 rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3.5 sm:p-4.5 shadow-[0_2px_16px_rgba(70,50,20,0.04)] relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header with AI Robot sitting directly on top of the Upload box */}
              <div className="relative flex items-end justify-between gap-1.5 px-0.5">
                <div className="max-w-[70%] pb-0.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#9a7334]">
                    <span>LET AI HELP YOU</span>
                    <Sparkles size={11} className="text-[#c9972a]" />
                  </div>
                  <h3 style={serif} className="mt-0.5 text-[17px] sm:text-[18px] font-bold text-[#163a2b] leading-[1.15]">
                    Check Your Eligibility<br className="hidden sm:inline" /> with AI
                  </h3>
                  <p className="mt-1 text-[13px] sm:text-[14px] text-[#554e42] leading-[1.32]">
                    Upload your CV and get an instant analysis of how well your profile matches this position.
                  </p>
                </div>

                {/* Cute AI Robot Mascot: touching the upload box directly at bottom */}
                <div className="relative w-20 h-22 sm:w-22 sm:h-24 shrink-0 pointer-events-none -mb-1 z-10">
                  <Image
                    src={aiRobot}
                    alt="Ensis AI Mascot"
                    fill
                    sizes="90px"
                    className="object-contain object-bottom-right"
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
                className={`relative z-0 cursor-pointer rounded-xl border border-[#decab0] bg-[#fbf5eb] p-2 sm:p-2.5 text-center transition-all hover:bg-[#f6ebd7] ${dragOver ? "border-[#163a2b] bg-[#eef4f0]" : ""
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
                  <span className="text-[#a8792c] mb-0.5">
                    <UploadCloud size={22} strokeWidth={1.75} />
                  </span>
                  <p className="text-[13px] sm:text-[13.5px] font-bold text-[#163a2b] leading-tight">
                    {selectedFile ? selectedFile.name : "Upload Your CV"}
                  </p>
                  <p className="text-[11px] sm:text-[11.5px] text-[#6b6255] leading-tight mt-0.5">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Drag & drop your file here or click to browse"}
                  </p>
                  <p className="text-[10px] text-[#8d6a3a] leading-none mt-0.5">PDF, DOC or DOCX (Max 5 MB)</p>

                  {selectedFile ? (
                    <div className="mt-1 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartAnalysis();
                        }}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] px-3.5 py-1 text-[11.5px] font-semibold text-white transition-all shadow-[0_2px_4px_rgba(10,25,18,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] cursor-pointer"
                      >
                        <span>{isSubmitting ? "Analyzing..." : "Analyze Match"}</span>
                        <ArrowRight size={11} className="text-[#e5b85a]" />
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
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-[#cbb38b] bg-[#fffdf9] hover:bg-[#fbf5eb] hover:border-[#b89b6c] px-4 py-1 text-[11.5px] font-semibold text-[#163a2b] transition-all shadow-[0_1px_3px_rgba(70,50,20,0.06)] cursor-pointer"
                    >
                      <span>Choose File</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-1.5 flex items-start gap-1 rounded-lg bg-[#fef2f2] p-1.5 text-[12px] text-[#dc2626] border border-[#fecaca]">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* AI Check List - 14px text */}
              <div className="mt-2 space-y-1">
                <p className="text-[14px] font-bold text-[#163a2b]">AI will check:</p>
                <ul className="space-y-1">
                  {aiCheckList.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13.5px] sm:text-[14px] text-[#3e382f] leading-snug">
                      <span className="mt-[3px] grid size-4 shrink-0 place-items-center rounded-full bg-[#c9972a] text-white">
                        <Check size={9} strokeWidth={3.5} />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              {/* Match Score Preview Box with 85% Donut */}
              <div className="mt-2 rounded-xl border border-[#ebdcc7] bg-[#fbf6ec] p-2 sm:p-2.5 flex items-center gap-2.5 shadow-2xs">
                <div className="relative size-11 shrink-0 flex items-center justify-center">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#dec9a1]"
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
                  <span className="absolute text-[11px] font-bold text-[#163a2b]">85%</span>
                </div>

                <div>
                  <p className="text-[13px] sm:text-[14px] font-bold text-[#163a2b] leading-tight">Your Profile Match</p>
                  <p className="mt-0.5 text-[11px] sm:text-[12px] leading-snug text-[#635b4e]">
                    Based on your experience, skills and qualification, you are a strong match for this position.
                  </p>
                </div>
              </div>

              {/* Footer with Lock icon */}
              <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-[#7a6a57]">
                <Lock size={11} className="text-[#2b2723] shrink-0" />
                <span>Your data is secure and will only be used for recruitment purposes.</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
