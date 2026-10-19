"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Check,
  Download,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  UploadCloud,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { serif, greenButton, goldOutlineButton, Eyebrow } from "@/components/career-v2/ui";
import { FlowHero } from "@/components/career-v2/flow/FlowHero";
import { Stepper } from "@/components/career-v2/flow/Stepper";
import { MatchRing } from "@/components/career-v2/flow/MatchRing";
import { BreakdownBars } from "@/components/career-v2/flow/BreakdownBars";
import { ProfileCard, JobSummaryCard, NumberedList } from "@/components/career-v2/flow/Cards";
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
  saveFlowState,
} from "@/lib/careerFlowV2";
import resultEligibleImg from "@/assets/career/flow/result-eligible.webp";
import resultPartialImg from "@/assets/career/flow/result-partial.webp";
import resultIneligibleImg from "@/assets/career/flow/result-ineligible.webp";

const ELIGIBILITY_STEPS = [
  { id: 1, label: "Upload CV", sublabel: "Completed" },
  { id: 2, label: "AI Analysis", sublabel: "Completed" },
  { id: 3, label: "Eligibility Result", sublabel: "Current Step" },
  { id: 4, label: "Apply for Job", sublabel: "Next" },
];

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setSaved(isJobSaved(slug));

    const state = loadFlowState(slug);
    if (!state || !state.screening?.result) {
      // Direct access without screening result: redirect to job detail
      router.replace(`/career/${encodeURIComponent(slug)}`);
      return;
    }

    setJob(state.job);
    setScreening(state.screening);
    setIsLoaded(true);
  }, [slug, router]);

  if (!isLoaded || !job || !screening?.result) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-[#fbf8f2]">
        <div className="size-10 rounded-full border-3 border-[#a8792c] border-t-transparent animate-spin" />
      </div>
    );
  }

  const result: ScreeningResult = screening.result;
  const level = result.level || "eligible";
  const isEligible = level === "eligible";
  const isPartial = level === "partial";
  const isIneligible = level === "not_eligible";

  const firstName = result.profile?.fullName?.split(" ")[0] || "Candidate";
  const showScore = job.showMatchScoreToCandidate !== false;
  const showBreakdown = job.showMatchBreakdown !== false;

  const handleToggleSave = () => {
    const newState = toggleSavedJobSlug(slug);
    setSaved(newState);
  };

  const handleDownloadPdf = () => {
    const pdfUrl = getReportPdfUrl(screening.screeningId);
    window.open(pdfUrl, "_blank");
  };

  const heroImage = isEligible
    ? resultEligibleImg
    : isPartial
    ? resultPartialImg
    : resultIneligibleImg;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33]">
      <FlowHero
        breadcrumbs={[
          { label: "Careers", href: "/career" },
          { label: job.title, href: `/career/${encodeURIComponent(slug)}` },
          { label: "AI Screening Result" },
        ]}
        backHref={`/career/${encodeURIComponent(slug)}`}
        backLabel="← Back to Job Details"
        eyebrow="CAREERS AT ENSIS"
        title="AI Screening"
        highlight="Result"
        subtitle="Here is your profile match and objective analysis for the applied position."
      />

      <Stepper currentStep={3} steps={ELIGIBILITY_STEPS} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Left Content */}
          <div className="lg:col-span-8 space-y-7">
            {/* 1. Hero Result Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#eadfcd] bg-[#fffdf8] shadow-[0_6px_30px_rgba(154,115,52,0.08)]">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                {/* Left Photo */}
                <div className="relative h-64 sm:h-full sm:min-h-[280px] sm:col-span-5 bg-[#f4ebd9]/40 overflow-hidden">
                  <Image
                    src={heroImage}
                    alt={result.profile.fullName}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Right Text & CTA */}
                <div className="p-6 sm:p-8 sm:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold italic text-[#a8792c]">
                      Together for a Healthier Tomorrow
                    </span>
                  </div>

                  {isEligible ? (
                    <>
                      <h2 style={serif} className="text-2xl sm:text-3xl font-semibold text-[#163a2b] leading-tight">
                        Great News, <span className="text-[#a8792c]">{firstName}!</span>
                      </h2>
                      <p className="text-sm font-semibold text-[#163a2b]">
                        You are eligible to apply for this position.
                      </p>
                      <p className="text-xs text-[#5f5647] leading-relaxed">
                        Your profile meets the key requirements for {job.title} at ENSIS. We encourage you to complete your application and join our mission of creating wellness spaces for a healthier tomorrow.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <Link
                          href={`/career/${encodeURIComponent(slug)}/review`}
                          className={`${greenButton} py-2.5 px-6 text-sm`}
                        >
                          Continue & Apply for This Job <ArrowRight size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          className={`${goldOutlineButton} py-2.5 px-4 text-sm`}
                        >
                          <Download size={15} /> Download Result (PDF)
                        </button>
                      </div>
                    </>
                  ) : isPartial ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-full bg-[#fef3c7] text-[#b45309]">
                          <AlertCircle size={15} />
                        </span>
                        <h2 style={serif} className="text-2xl font-semibold text-[#92400e]">
                          You&apos;re a Partial Match, {firstName}!
                        </h2>
                      </div>
                      <p className="text-sm font-semibold text-[#163a2b]">
                        You are close to the requirements for this position.
                      </p>
                      <p className="text-xs text-[#5f5647] leading-relaxed">
                        Your profile shows good potential, but a few key areas need improvement. You can still apply after reviewing the suggestions below and updating your profile or CV to strengthen your application.
                      </p>
                      <div className="rounded-lg bg-[#fffaf0] border border-[#f4ebd9] p-3 text-xs italic text-[#8d6a3a]">
                        &ldquo;We encourage you to apply if you are confident about your relevant experience and skills.&rdquo;
                        <span className="block mt-1 font-semibold text-[#163a2b] not-italic">— Talent Acquisition Team, ENSIS</span>
                      </div>
                      <div className="pt-1 flex flex-wrap gap-3">
                        <Link
                          href={`/career/${encodeURIComponent(slug)}/review`}
                          className={`${greenButton} py-2.5 px-6 text-sm`}
                        >
                          Update CV & Apply Now <ArrowRight size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          className={`${goldOutlineButton} py-2.5 px-4 text-sm`}
                        >
                          <Download size={15} /> Download Result (PDF)
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 style={serif} className="text-2xl font-semibold text-[#991b1b]">
                        Thank You for Your Interest, {firstName}
                      </h2>
                      <p className="text-sm font-semibold text-[#163a2b]">
                        Your profile does not meet the key requirements for this position at this time.
                      </p>
                      <p className="text-xs text-[#5f5647] leading-relaxed">
                        While your background does not match the current criteria for {job.title}, we frequently open new roles across different departments. We invite you to explore other openings or submit a general application.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <Link
                          href="/career"
                          className={`${greenButton} py-2.5 px-6 text-sm`}
                        >
                          Explore Other Jobs <ArrowRight size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          className={`${goldOutlineButton} py-2.5 px-4 text-sm`}
                        >
                          <Download size={15} /> Download Result (PDF)
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Score Donut & Key Highlights Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Box: Match Ring & Legend */}
              <div className="md:col-span-5 rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 shadow-xs space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6a3a]">
                  Your Profile Match
                </span>

                <div className="flex flex-col items-center text-center py-2">
                  <MatchRing
                    score={showScore ? result.score : undefined}
                    level={level}
                    size="lg"
                    showLabel={false}
                  />
                  <div className="mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        isEligible
                          ? "bg-[#e8efe9] text-[#163a2b]"
                          : isPartial
                          ? "bg-[#fffbeb] text-[#92400e]"
                          : "bg-[#fef2f2] text-[#991b1b]"
                      }`}
                    >
                      {isEligible ? "Strong Match" : isPartial ? "Moderate Match" : "Not Eligible"}
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 pt-3 border-t border-[#eadfcd]/70 text-xs text-[#6b6255]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#163a2b]" />
                      70 – 100%
                    </span>
                    <span className="font-semibold text-[#163a2b]">Strong Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#d97706]" />
                      50 – 69%
                    </span>
                    <span className="font-semibold text-[#92400e]">Moderate Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#dc2626]" />
                      Below 50%
                    </span>
                    <span className="font-semibold text-[#991b1b]">Not Eligible</span>
                  </div>
                </div>
              </div>

              {/* Right Box: Strengths / Suggestions / Gaps */}
              <div className="md:col-span-7 rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 shadow-xs space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6a3a]">
                  {isEligible
                    ? "You Meet the Key Requirements"
                    : isPartial
                    ? "Key Suggestions to Improve Your Match"
                    : "Key Gaps in Your Profile"}
                </span>

                {isEligible ? (
                  <ul className="space-y-2.5">
                    {result.strengths.map((st, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4b4336] leading-relaxed">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#163a2b] text-white">
                          <Check size={11} strokeWidth={2.5} />
                        </span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                ) : isPartial ? (
                  <NumberedList items={result.suggestions} variant="amber" />
                ) : (
                  <NumberedList items={result.gaps} variant="red" />
                )}
              </div>
            </div>

            {/* 3. Detailed Match Breakdown (7 bars) */}
            {showBreakdown && (
              <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#eadfcd]/70">
                  <div>
                    <h3 style={serif} className="text-xl font-semibold text-[#163a2b]">
                      Match Breakdown
                    </h3>
                    <p className="text-xs text-[#6b6255] mt-0.5">
                      Here&apos;s how your profile aligns with each requirement dimension:
                    </p>
                  </div>
                </div>

                <BreakdownBars
                  items={result.breakdown}
                  thresholds={result.thresholds}
                />
              </div>
            )}

            {/* Tip Banner */}
            {isPartial && (
              <div className="flex items-start gap-3 rounded-xl bg-[#fffaf0] border border-[#f4ebd9] p-4 text-xs text-[#8d6a3a]">
                <Lightbulb size={16} className="text-[#a8792c] shrink-0 mt-0.5" />
                <span>
                  <strong>Tip: </strong>Update your CV with more relevant experience and skills in the next step to increase your match score and improve your chances.
                </span>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileCard
              profile={result.profile}
              onEdit={() => router.push(`/career/${encodeURIComponent(slug)}/review`)}
            />

            {/* Your CV Card with View File / Upload Different */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#eadfcd]/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6a3a]">Your CV</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#163a2b] bg-[#e8efe9] px-2 py-0.5 rounded-full">
                  <Check size={11} strokeWidth={2.5} /> Evaluated
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
                  <FileText size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs text-[#163a2b] truncate">
                    {screening.cv?.fileName || "Candidate_CV.pdf"}
                  </p>
                  <p className="text-[11px] text-[#8d6a3a]">
                    {(screening.cv?.size ? (screening.cv.size / (1024 * 1024)).toFixed(1) : "2.4")} MB • PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#eadfcd]/60 text-xs">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1 text-[#5f5647] hover:text-[#163a2b]"
                >
                  <Eye size={13} /> View Report
                </button>
                <Link
                  href={`/career/${encodeURIComponent(slug)}`}
                  className="inline-flex items-center gap-1 text-[#8d6a3a] hover:text-[#163a2b]"
                >
                  <UploadCloud size={13} /> Upload Different CV
                </Link>
              </div>
            </div>

            <JobSummaryCard
              job={job}
              onEdit={() => router.push(`/career/${encodeURIComponent(slug)}`)}
            />

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              {!isIneligible ? (
                <Link
                  href={`/career/${encodeURIComponent(slug)}/review`}
                  className={`w-full ${greenButton} justify-center py-3 text-sm font-semibold shadow-md`}
                >
                  {isEligible ? "Continue & Apply for This Job" : "Update CV & Apply Now"}
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  href="/career"
                  className={`w-full ${greenButton} justify-center py-3 text-sm font-semibold shadow-md`}
                >
                  Explore Other Opportunities
                  <ArrowRight size={16} />
                </Link>
              )}

              <button
                type="button"
                onClick={handleToggleSave}
                className={`w-full ${goldOutlineButton} justify-center py-2.5 text-xs font-semibold`}
              >
                {saved ? (
                  <>
                    <BookmarkCheck size={14} className="text-[#163a2b]" /> Saved in Your Bookmarks
                  </>
                ) : (
                  <>
                    <Bookmark size={14} /> Save for Later
                  </>
                )}
              </button>
            </div>

            {/* Privacy footnote */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8d6a3a]">
              <ShieldCheck size={13} className="text-[#a8792c]" />
              <span>Your data is secure and will only be used for recruitment purposes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
