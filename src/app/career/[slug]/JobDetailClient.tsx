"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Sparkles,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  ShieldCheck,
  Check,
  ArrowRight,
} from "lucide-react";
import { serif, greenButton, Eyebrow, CareerIcon } from "@/components/career-v2/ui";
import { FlowHero } from "@/components/career-v2/flow/FlowHero";
import type { PublicJob } from "@/lib/careerApi";
import { jobExperience, jobLocation, jobType } from "@/lib/careers";
import { setCvFile, saveFlowState } from "@/lib/careerFlowV2";
import bannerFallback from "@/assets/career/flow/spa-banner.webp";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

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
      setErrorMessage("Please select or drop your CV to proceed.");
      return;
    }

    setIsSubmitting(true);
    // 1. Store CV file in memory
    setCvFile(selectedFile);

    // 2. Save current job in flow state
    saveFlowState({
      job,
      updatedAt: new Date().toISOString(),
    });

    // 3. Navigate to analysis screen
    router.push(`/career/${encodeURIComponent(slug)}/analysis`);
  };

  // Derive "AI will check" list
  const aiCheckList =
    job.aiCheckPoints && job.aiCheckPoints.length > 0
      ? job.aiCheckPoints
      : job.requirements && job.requirements.length > 0
      ? job.requirements.slice(0, 4)
      : [
          "Relevant experience in design or manufacturing",
          "Technical skill proficiency and domain tools",
          "Educational qualifications aligned with the role",
          "Team collaboration and communication aptitude",
        ];

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33]">
      <FlowHero
        breadcrumbs={[
          { label: "Careers", href: "/career" },
          { label: "Apply for Position" },
        ]}
        backHref="/career"
        backLabel="← Back to All Roles"
        eyebrow="Careers at Ensis"
        title={job.title}
        subtitle={job.shortDescription || "Join our team and design wellness spaces for a healthier tomorrow."}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Job Description & Details */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Meta tags bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#163a2b] text-white px-3.5 py-1 font-semibold">
                <Briefcase size={13} />
                {jobType(job)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfcd] bg-[#fffdf8] px-3.5 py-1 text-[#6b6255] font-medium shadow-xs">
                <MapPin size={13} className="text-[#a8792c]" />
                {jobLocation(job)}
              </span>
              {jobExperience(job) && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfcd] bg-[#fffdf8] px-3.5 py-1 text-[#6b6255] font-medium shadow-xs">
                  <Clock size={13} className="text-[#a8792c]" />
                  {jobExperience(job)}
                </span>
              )}
              {job.educationRequirements && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfcd] bg-[#fffdf8] px-3.5 py-1 text-[#6b6255] font-medium shadow-xs">
                  <GraduationCap size={13} className="text-[#a8792c]" />
                  {job.educationRequirements}
                </span>
              )}
            </div>

            {/* Intro Description */}
            <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 sm:p-8 shadow-[0_4px_20px_rgba(154,115,52,0.06)] space-y-4">
              <h2 style={serif} className="text-2xl sm:text-3xl font-semibold text-[#163a2b]">
                About the Role
              </h2>
              <div className="text-sm sm:text-base leading-relaxed text-[#5f5647] space-y-3">
                {job.description ? (
                  <div
                    className="prose prose-stone max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                ) : (
                  <p>
                    {job.shortDescription ||
                      "At ENSIS, we craft restorative spa and wellness spaces. In this role, you will collaborate with cross-functional teams to design, engineer, and deliver world-class wellness environments."}
                  </p>
                )}
              </div>
            </div>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 sm:p-8 shadow-[0_4px_20px_rgba(154,115,52,0.06)] space-y-4">
                <h3 style={serif} className="text-xl sm:text-2xl font-semibold text-[#163a2b]">
                  Key Responsibilities
                </h3>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#4b4336] leading-relaxed">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#163a2b] text-white">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications & Experience */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 sm:p-8 shadow-[0_4px_20px_rgba(154,115,52,0.06)] space-y-4">
                <h3 style={serif} className="text-xl sm:text-2xl font-semibold text-[#163a2b]">
                  Qualifications & Experience
                </h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#4b4336] leading-relaxed">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#a8792c] text-white">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job Photo Banner */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-[#eadfcd] shadow-[0_4px_20px_rgba(154,115,52,0.08)]">
              <Image
                src={job.coverImage || bannerFallback}
                alt={job.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <p style={serif} className="text-white text-lg sm:text-xl font-semibold">
                  People. Ideas. Better Spaces.
                </p>
              </div>
            </div>

            {/* 4 Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[
                { icon: "leaf" as const, label: "Meaningful Work" },
                { icon: "users" as const, label: "Collaborative Team" },
                { icon: "growth" as const, label: "Learning & Growth" },
                { icon: "heart" as const, label: "Real Impact" },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 text-center flex flex-col items-center gap-2 shadow-xs"
                >
                  <CareerIcon name={p.icon} size="sm" />
                  <span className="text-xs font-semibold text-[#163a2b]">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: AI Eligibility Card (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
            <div className="rounded-2xl border-2 border-[#c9a86a]/60 bg-[#fffdf8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(154,115,52,0.12)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9a7334]">
                <Sparkles size={14} className="text-[#a8792c]" />
                <span>Let AI Help You</span>
              </div>

              <h3 style={serif} className="mt-1 text-2xl font-semibold tracking-tight text-[#163a2b]">
                Check Your Eligibility with AI
              </h3>
              <p className="mt-2 text-xs text-[#5f5647] leading-relaxed">
                Upload your CV and get immediate, objective feedback on how well your qualifications match this opening.
              </p>

              {/* Upload Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-5 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  dragOver
                    ? "border-[#163a2b] bg-[#e8efe9]/60"
                    : selectedFile
                    ? "border-[#163a2b] bg-[#e8efe9]/30"
                    : "border-[#d9bf86] bg-[#fbf6ec]/60 hover:bg-[#fbf6ec]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-[#163a2b] text-white">
                      <FileText size={22} />
                    </span>
                    <p className="mt-2 text-sm font-semibold text-[#163a2b] truncate max-w-[220px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[#8d6a3a]">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[#dc2626] hover:underline"
                    >
                      <X size={13} />
                      <span>Remove & choose another</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-[#f4ebd9] text-[#a8792c]">
                      <UploadCloud size={24} />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-[#163a2b]">
                      Drop your CV here, or <span className="text-[#a8792c] underline">browse</span>
                    </p>
                    <p className="mt-1 text-xs text-[#8d6a3a]">
                      Supports PDF, DOC, DOCX (Max 5 MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Error Callout */}
              {errorMessage && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#fef2f2] p-2.5 text-xs text-[#dc2626] border border-[#fecaca]">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* AI Check Points */}
              <div className="mt-5 space-y-2.5 pt-4 border-t border-[#eadfcd]">
                <p className="text-xs font-semibold text-[#163a2b] uppercase tracking-wider">
                  AI will evaluate:
                </p>
                <ul className="space-y-2">
                  {aiCheckList.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#5f5647]">
                      <Check size={13} className="text-[#a8792c] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isSubmitting}
                  className={`w-full ${greenButton} justify-center py-3 text-sm font-semibold shadow-md cursor-pointer`}
                >
                  {isSubmitting ? "Starting Analysis..." : "Check Eligibility with AI"}
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Privacy Footnote */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#8d6a3a]">
                <ShieldCheck size={13} className="text-[#a8792c]" />
                <span>Private & confidential. Never shared publicly.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
