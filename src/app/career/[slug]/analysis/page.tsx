"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  UploadCloud,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Lightbulb,
  Check,
  Briefcase,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { serif, greenButton, goldButton, Eyebrow } from "@/components/career-v2/ui";
import { FlowHero } from "@/components/career-v2/flow/FlowHero";
import { Container } from "@/components/ui/Container";
import { Stepper, APPLICATION_FLOW_STEPS } from "@/components/career-v2/flow/Stepper";
import { MatchRing } from "@/components/career-v2/flow/MatchRing";
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
import spaBannerImg from "@/assets/career/flow/spa-banner.webp";

type StepMeta = {
  key: StepKey;
  title: string;
  desc: string;
};

const LEFT_STEPS: StepMeta[] = [
  { key: "read_cv", title: "Reading Your CV", desc: "Extracting key information from your profile..." },
  { key: "match_skills", title: "Matching Skills", desc: "Comparing your skills with job requirements..." },
  { key: "check_experience", title: "Checking Experience", desc: "Analyzing relevant work experience..." },
];

const RIGHT_STEPS: StepMeta[] = [
  { key: "verify_education", title: "Verifying Education", desc: "Checking qualifications and certifications..." },
  { key: "analyze_competencies", title: "Analyzing Competencies", desc: "Assessing role-specific skills and expertise..." },
  { key: "calculate_score", title: "Calculating Match Score", desc: "Generating eligibility score..." },
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
    if (!cvFile) {
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
          }, 800);
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
    setNeedsReupload(false);
    startedRef.current = false;
  };

  const getStepState = (key: StepKey): StepState => {
    const found = screening?.steps?.find((s) => s.key === key);
    return found?.state || "pending";
  };

  const progress = screening?.progress || 18;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33]">
      <FlowHero
        breadcrumbs={[
          { label: "Careers", href: "/career" },
          { label: job?.title || "Apply for Position", href: `/career/${encodeURIComponent(slug)}` },
          { label: "Application in Progress" },
        ]}
        backHref={`/career/${encodeURIComponent(slug)}`}
        backLabel="← Back to Job Details"
        eyebrow="CAREERS AT ENSIS"
        title="Application in Progress"
        subtitle="We're excited to have you on board! Your application is under review. Here's an update on your progress so far."
      />

      <Stepper currentStep={2} steps={APPLICATION_FLOW_STEPS} />

      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Left Area */}
          <div className="lg:col-span-8 space-y-6">
            {needsReupload ? (
              <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 sm:p-8 text-center shadow-md space-y-4">
                <span className="grid size-14 place-items-center rounded-full bg-[#f4ebd9] text-[#a8792c] mx-auto">
                  <UploadCloud size={28} />
                </span>
                <h2 style={serif} className="text-2xl font-semibold text-[#163a2b]">
                  Please Select Your CV Again
                </h2>
                <p className="text-sm text-[#5f5647] max-w-md mx-auto">
                  To protect candidate privacy, CV files remain in-memory and are cleared on page reload. Re-select your CV to evaluate.
                </p>
                <div className="pt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFileToReupload(e.target.files?.[0] || null)}
                  />
                  {fileToReupload ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[#163a2b]">
                        Selected: {fileToReupload.name}
                      </p>
                      <button
                        type="button"
                        onClick={handleReuploadSubmit}
                        className={`${greenButton} py-2.5 px-6`}
                      >
                        Start Analysis Now <ArrowRight size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`${goldButton} py-2.5 px-6`}
                    >
                      Choose CV File
                    </button>
                  )}
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-6 sm:p-8 text-center shadow-md space-y-4">
                <span className="grid size-14 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626] mx-auto">
                  <AlertCircle size={30} />
                </span>
                <h2 style={serif} className="text-2xl font-semibold text-[#991b1b]">
                  Evaluation Interrupted
                </h2>
                <p className="text-sm text-[#7f1d1d] max-w-md mx-auto">{error}</p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      startedRef.current = false;
                      setError(null);
                    }}
                    className={`${greenButton} py-2.5 px-6`}
                  >
                    <RotateCw size={15} /> Try Again
                  </button>
                  <Link
                    href={`/career/${encodeURIComponent(slug)}`}
                    className="inline-flex items-center justify-center rounded-md border border-[#eadfcd] bg-white px-5 py-2.5 text-sm font-semibold text-[#5f5647] hover:bg-[#fbf6ec]"
                  >
                    Upload a Different CV
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* CV File Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-lg bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
                      <FileText size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#163a2b] truncate max-w-[260px] sm:max-w-md">
                        {screening?.cv?.fileName || "Uploaded_CV.pdf"}
                      </p>
                      <p className="text-xs text-[#8d6a3a]">
                        Uploaded successfully | {screening?.cv?.fileName?.endsWith(".docx") ? "DOCX" : "PDF"} |{" "}
                        {screening?.cv ? (screening.cv.size / (1024 * 1024)).toFixed(1) : "2.4"} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="grid size-6 place-items-center rounded-full bg-[#163a2b] text-white">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[#163a2b]">CV Received</p>
                      <p className="text-[10px] text-[#8d6a3a]">Our AI is now analysing your profile.</p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis in Progress Card */}
                <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-5 sm:p-7 shadow-[0_4px_24px_rgba(154,115,52,0.08)] space-y-6">
                  {/* Card Header with estimated time */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#eadfcd]/70">
                    <div>
                      <h3 style={serif} className="text-xl sm:text-2xl font-semibold text-[#163a2b]">
                        AI Analysis in Progress
                      </h3>
                      <p className="text-xs text-[#6b6255] mt-0.5">
                        Please wait while we analyze your profile against the job requirements.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8d6a3a] shrink-0">
                      <Clock size={15} className="text-[#a8792c]" />
                      <span>This usually takes 10 – 20 seconds.</span>
                    </div>
                  </div>

                  {/* 3-Column Interactive Progress Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left Column Steps */}
                    <div className="md:col-span-4 space-y-3">
                      {LEFT_STEPS.map((step) => {
                        const state = getStepState(step.key);
                        const isDone = state === "done";
                        const isActive = state === "active";

                        return (
                          <div
                            key={step.key}
                            className={`flex items-start justify-between gap-2 rounded-xl border p-3 transition-all ${
                              isDone
                                ? "border-[#c2d7c5] bg-[#f2f7f3]"
                                : isActive
                                ? "border-[#d9bf86] bg-[#fffaf0] shadow-xs"
                                : "border-[#eadfcd]/60 bg-[#fffdf8] opacity-70"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold ${isDone ? "text-[#163a2b]" : isActive ? "text-[#a8792c]" : "text-[#5f5647]"}`}>
                                {step.title}
                              </p>
                              <p className="text-[10px] text-[#8d6a3a] leading-tight mt-0.5">{step.desc}</p>
                            </div>
                            <span className="shrink-0 mt-0.5">
                              {isDone ? (
                                <span className="grid size-5 place-items-center rounded-full bg-[#163a2b] text-white">
                                  <Check size={12} strokeWidth={2.5} />
                                </span>
                              ) : isActive ? (
                                <span className="size-4 rounded-full border-2 border-[#a8792c] border-t-transparent animate-spin inline-block" />
                              ) : (
                                <span className="size-4 rounded-full border-2 border-[#eadfcd] inline-block" />
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Center Animated Donut */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-2">
                      <div className="relative size-36 flex items-center justify-center">
                        <svg width={144} height={144} className="-rotate-90">
                          <circle
                            cx={72}
                            cy={72}
                            r={58}
                            fill="transparent"
                            stroke="#f4ebd9"
                            strokeWidth={10}
                          />
                          <circle
                            cx={72}
                            cy={72}
                            r={58}
                            fill="transparent"
                            stroke="#a8792c"
                            strokeWidth={10}
                            strokeDasharray={2 * Math.PI * 58}
                            strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                          <span className="text-3xl font-semibold text-[#163a2b] tracking-tight">{progress}%</span>
                          <span className="text-xs font-semibold text-[#a8792c]">Analyzing...</span>
                          <span className="text-[9px] text-[#6b6255] max-w-[100px] leading-none mt-1">
                            Extracting skills, experience and qualifications
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column Steps */}
                    <div className="md:col-span-4 space-y-3">
                      {RIGHT_STEPS.map((step) => {
                        const state = getStepState(step.key);
                        const isDone = state === "done";
                        const isActive = state === "active";

                        return (
                          <div
                            key={step.key}
                            className={`flex items-start justify-between gap-2 rounded-xl border p-3 transition-all ${
                              isDone
                                ? "border-[#c2d7c5] bg-[#f2f7f3]"
                                : isActive
                                ? "border-[#d9bf86] bg-[#fffaf0] shadow-xs"
                                : "border-[#eadfcd]/60 bg-[#fffdf8] opacity-70"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold ${isDone ? "text-[#163a2b]" : isActive ? "text-[#a8792c]" : "text-[#5f5647]"}`}>
                                {step.title}
                              </p>
                              <p className="text-[10px] text-[#8d6a3a] leading-tight mt-0.5">{step.desc}</p>
                            </div>
                            <span className="shrink-0 mt-0.5">
                              {isDone ? (
                                <span className="grid size-5 place-items-center rounded-full bg-[#163a2b] text-white">
                                  <Check size={12} strokeWidth={2.5} />
                                </span>
                              ) : isActive ? (
                                <span className="size-4 rounded-full border-2 border-[#a8792c] border-t-transparent animate-spin inline-block" />
                              ) : (
                                <span className="size-4 rounded-full border-2 border-[#eadfcd] inline-block" />
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Please Keep This Page Open Yellow Callout */}
                  <div className="flex items-start gap-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] p-4 text-xs text-[#92400e]">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#fef3c7] text-[#b45309]">
                      <Lightbulb size={14} />
                    </span>
                    <div>
                      <span className="font-semibold">Please keep this page open: </span>
                      <span>
                        Do not refresh or close this page while the analysis is in progress. You will be automatically redirected to the next step once the analysis is complete.
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Visual Card with tagline */}
            <div className="relative h-28 overflow-hidden rounded-xl border border-[#eadfcd] shadow-xs">
              <Image
                src={spaBannerImg}
                alt="Ensis Wellness"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#163a2b]/85 to-[#163a2b]/40 flex items-center p-5">
                <p style={serif} className="text-white text-base font-semibold italic leading-snug">
                  Together for a Healthier Tomorrow
                </p>
              </div>
            </div>

            {/* Position Applied For Card */}
            {job && (
              <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6a3a]">
                  Position Applied For
                </span>
                <h3 style={serif} className="text-lg font-semibold text-[#163a2b]">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b6255] pt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} className="text-[#a8792c]" /> {jobLocation(job)}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase size={12} className="text-[#a8792c]" /> {jobType(job)}
                  </span>
                </div>
                {job.educationRequirements && (
                  <p className="text-[11px] text-[#8d6a3a] pt-1">
                    <span className="font-semibold text-[#5f5647]">Education: </span>
                    {job.educationRequirements}
                  </p>
                )}
              </div>
            )}

            {/* What Happens Next? Card */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs space-y-4">
              <h4 style={serif} className="text-lg font-semibold text-[#163a2b]">
                What Happens Next?
              </h4>
              <div className="space-y-4 text-xs text-[#5f5647]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#163a2b] text-white font-semibold text-[11px]">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-[#163a2b]">AI Profile Analysis</p>
                    <p className="mt-0.5 text-[#6b6255]">
                      We analyze your CV for relevant skills, qualifications and experience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#f4ebd9] text-[#8d6a3a] font-semibold text-[11px]">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-[#163a2b]">Review Your Details</p>
                    <p className="mt-0.5 text-[#6b6255]">
                      You may be asked to verify or add additional information if required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#f4ebd9] text-[#8d6a3a] font-semibold text-[11px]">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-[#163a2b]">Application Submission</p>
                    <p className="mt-0.5 text-[#6b6255]">
                      Once confirmed, your application will be submitted to our team.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#f4ebd9] text-[#8d6a3a] font-semibold text-[11px]">
                    4
                  </span>
                  <div>
                    <p className="font-semibold text-[#163a2b]">Confirmation</p>
                    <p className="mt-0.5 text-[#6b6255]">
                      You will receive a confirmation email with your application details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Match Preview Card */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs flex items-center gap-3.5">
              <MatchRing score={85} level="eligible" size="sm" showLabel={false} />
              <div>
                <p className="text-xs font-semibold text-[#163a2b]">Your Profile Match</p>
                <p className="text-[11px] text-[#6b6255] mt-0.5">
                  Based on your experience, skills and qualification, you are a strong match for this position.
                </p>
              </div>
            </div>

            {/* Privacy footnote */}
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
