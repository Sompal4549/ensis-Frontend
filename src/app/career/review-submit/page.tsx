"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Edit3,
  FileText,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { applicationApi } from "@/lib/api/api";
import {
  BREAKDOWN_LABELS,
  GENERAL_JOB,
  MATCH_THEME,
  clearCareerFlow,
  fileExtension,
  formatPhone,
  getCvFile,
  matchLevel,
  otpPhone,
  resolveCvFile,
  useCareerFlow,
} from "@/lib/careerFlow";
import {
  GhostButton,
  PipelineShell,
  PrimaryButton,
  ScoreBar,
  ScoreRing,
  SectionTitle,
  SideCard,
} from "@/components/career/pipeline/ui";
import ApplicationSuccessModal from "@/components/career/ApplicationSuccessModal";
import { AmanApplicationModal } from "@/components/career/AmanApplicationModal";

type SubmittedApplication = {
  id: string;
  candidateName: string;
  position: string;
  submittedOn: string;
  aiMatchScore: number;
};

type ApiErrorLike = { response?: { data?: { message?: unknown } }; message?: unknown };

function toErrorMessage(err: unknown): string {
  const e = err as ApiErrorLike | null;
  const apiMessage = e?.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
  if (typeof e?.message === "string" && e.message.trim()) return e.message;
  return "Something went wrong while submitting your application. Please try again.";
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "C";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function ReviewCard({
  icon: Icon,
  title,
  onEdit,
  onSecondary,
  secondaryLabel,
  children,
}: {
  icon: React.ElementType;
  title: string;
  onEdit?: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
          <h3 className="truncate text-[14px] font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {onSecondary && secondaryLabel ? (
            <button
              type="button"
              onClick={onSecondary}
              className="text-[12px] font-semibold text-slate-500 transition hover:text-blue-600"
            >
              {secondaryLabel}
            </button>
          ) : null}
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          ) : null}
        </div>
      </div>
      <div className="px-4 py-3.5">{children}</div>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0">
      <span className="shrink-0 text-[12.5px] text-slate-500">{label}</span>
      <span className="text-right text-[13px] font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function ReviewSubmitPage() {
  const router = useRouter();
  const flow = useCareerFlow();
  const analysis = flow.analysis;
  const form = flow.form;
  const job = flow.job ?? GENERAL_JOB;
  const verifiedPhone = flow.verifiedPhone;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [needsReupload, setNeedsReupload] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedApplication | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAman, setShowAman] = useState(false);

  useEffect(() => {
    if (!flow.analysis || !flow.form) {
      router.replace("/career/uploade_cv");
    }
  }, [flow.analysis, flow.form, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "aman") setShowAman(true);
  }, []);

  const handleSubmit = async () => {
    if (!analysis || !form || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    setNeedsReupload(false);

    try {
      const file = getCvFile() ?? (await resolveCvFile());
      if (!file) {
        setNeedsReupload(true);
        setSubmitError("We couldn't attach your CV for this session — please re-upload it.");
        return;
      }

      const isPdf = file.type === "application/pdf" || fileExtension(file.name) === "pdf";
      if (!isPdf) {
        setNeedsReupload(true);
        setSubmitError(
          "Your CV must be a PDF file (the backend accepts PDF only) — please re-upload it as a PDF."
        );
        return;
      }

      const fd = new FormData();
      fd.set("fullName", (form.fullName || analysis.candidateName || "").trim());
      fd.set("email", (form.email || analysis.email || "").trim());
      fd.set("phone", (form.phone || analysis.phone || "").trim());
      fd.set("currentLocation", form.currentLocation || "India");
      fd.set("department", form.department || job.department || "General");
      fd.set("experience", form.totalExperience || job.experience || "Any");
      fd.set("coverLetter", form.whyInterested || analysis.summary || "");
      fd.set("resume", file, file.name);

      type CreatedApplication = { _id?: string; data?: { _id?: string } } | null;
      const created = (await applicationApi.create(fd)) as CreatedApplication;
      const ref = created?._id || created?.data?._id;
      if (!ref) {
        setSubmitError("Something went wrong while submitting your application. Please try again.");
        return;
      }

      setSubmitted({
        id: String(ref),
        candidateName: form.fullName || analysis.candidateName || "Candidate",
        position: job.title,
        submittedOn: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        aiMatchScore: analysis.score,
      });
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!analysis || !form) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50">
        <div className="flex items-center gap-3 text-[14px] font-medium text-slate-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          Redirecting to the start of the pipeline…
        </div>
      </div>
    );
  }

  const goForm = () => router.push("/career/application-form");
  const goUpload = () => router.push("/career/uploade_cv");

  const name = form.fullName || analysis.candidateName || "";
  const email = form.email || analysis.email || "";
  const phone = form.phone || analysis.phone || "";
  const linkedin = analysis.linkedin || "";
  const phoneVerified = Boolean(
    verifiedPhone && phone && otpPhone(verifiedPhone) === otpPhone(phone)
  );
  const hasProfile = Boolean(name || email || phone || linkedin);

  const experienceRows = [
    { label: "Total Experience", value: form.totalExperience || job.experience },
    { label: "Department", value: form.department || job.department },
    { label: "Employment Status", value: form.employmentStatus },
    { label: "Notice Period", value: form.noticePeriod },
    { label: "Expected CTC", value: form.expectedCTC },
    { label: "Willing to Relocate", value: form.relocate },
  ].filter((row) => row.value);

  const addressRows = [
    { label: "Current Location", value: form.currentLocation },
    { label: "Willing to Relocate", value: form.relocate },
  ].filter((row) => row.value);

  const whyText = form.whyInterested || analysis.summary || "";
  const theme = MATCH_THEME[matchLevel(analysis.score)];

  const sidebar = (
    <>
      <SideCard accent="emerald" title="Your AI Match Score">
        <ScoreRing score={analysis.score} size={128} />
        <p className="mt-3 text-center text-[13px] font-semibold text-slate-700">
          {theme.label} — {theme.hint}
        </p>
        {analysis.breakdown ? (
          <div className="mt-4 space-y-2.5 border-t border-emerald-200/70 pt-3.5">
            {BREAKDOWN_LABELS.map(({ key, label }) => (
              <ScoreBar key={key} label={label} value={analysis.breakdown?.[key] ?? 0} />
            ))}
          </div>
        ) : null}
      </SideCard>

      <SideCard title="Job Summary">
        <p className="mb-3 text-[14px] font-semibold text-slate-900">{job.title}</p>
        <ul className="space-y-2">
          {[
            { label: job.department, icon: Building2 },
            { label: job.location, icon: MapPin },
            { label: job.experience, icon: BriefcaseBusiness },
            { label: job.type, icon: TrendingUp },
          ]
            .filter((row) => row.label)
            .map(({ label, icon: Icon }, index) => (
              <li key={index} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {label}
              </li>
            ))}
        </ul>
      </SideCard>

      <SideCard accent="blue" title="Ready to apply?">
        <p className="mb-3 text-[12.5px] text-slate-600">
          Submit your application — our team will review it shortly.
        </p>

        {submitError ? (
          <div
            role="alert"
            className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12.5px] font-medium leading-relaxed text-red-700"
          >
            {submitError}
            {needsReupload ? (
              <button
                type="button"
                onClick={goUpload}
                className="mt-1 block font-semibold text-red-800 underline underline-offset-2 hover:text-red-900"
              >
                Re-upload your CV →
              </button>
            ) : null}
          </div>
        ) : null}

        <PrimaryButton
          type="button"
          onClick={handleSubmit}
          loading={submitting}
          className="w-full"
        >
          {submitting ? "Submitting…" : "Submit Application"}
        </PrimaryButton>

        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          Your data is secure and encrypted.
        </p>
      </SideCard>
    </>
  );

  return (
    <>
      <PipelineShell current={5} badge={job.title} sidebar={sidebar}>
        <SectionTitle
          eyebrow="Step 5 · Review"
          title="Review your application"
          description="Check everything before you submit — you can go back any time."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {hasProfile ? (
            <ReviewCard
              icon={User}
              title="Candidate Profile"
              onEdit={goForm}
              onSecondary={goUpload}
              secondaryLabel="Re-upload CV"
            >
              <div className="flex items-start gap-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-[15px] font-bold text-white">
                  {initialsOf(name)}
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  {name ? (
                    <p className="truncate text-[15px] font-semibold text-slate-900">{name}</p>
                  ) : null}
                  {email ? (
                    <p className="flex items-center gap-2 break-all text-[13px] text-slate-600">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {email}
                    </p>
                  ) : null}
                  {phone ? (
                    <p className="flex flex-wrap items-center gap-2 text-[13px] text-slate-600">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {formatPhone(phone)}
                      {phoneVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                  {linkedin ? (
                    <p className="flex items-center gap-2 break-all text-[13px] text-slate-600">
                      <LinkIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {linkedin}
                    </p>
                  ) : null}
                </div>
              </div>
            </ReviewCard>
          ) : null}

          {experienceRows.length > 0 ? (
            <ReviewCard icon={BriefcaseBusiness} title="Professional Experience" onEdit={goForm}>
              {experienceRows.map((row) => (
                <ReviewRow key={row.label} label={row.label} value={row.value} />
              ))}
            </ReviewCard>
          ) : null}

          {addressRows.length > 0 ? (
            <ReviewCard icon={MapPin} title="Address & Availability" onEdit={goForm}>
              {addressRows.map((row) => (
                <ReviewRow key={row.label} label={row.label} value={row.value} />
              ))}
            </ReviewCard>
          ) : null}

          <ReviewCard
            icon={TrendingUp}
            title="AI Screening"
            onEdit={goForm}
            onSecondary={goUpload}
            secondaryLabel="Re-run analysis"
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ScoreRing score={analysis.score} size={112} />
              <div className="min-w-0 flex-1">
                <span
                  className={`inline-block rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] ${theme.chip}`}
                >
                  {theme.label}
                </span>
                {analysis.summary ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                    {analysis.summary}
                  </p>
                ) : null}
              </div>
            </div>
            {analysis.requirementsMet && analysis.requirementsMet.length > 0 ? (
              <ul className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3">
                {analysis.requirementsMet.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </ReviewCard>

          {whyText ? (
            <ReviewCard icon={FileText} title="Additional Information" onEdit={goForm}>
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
                {whyText}
              </p>
            </ReviewCard>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <GhostButton type="button" onClick={goForm}>
            Back
          </GhostButton>
          <p className="hidden text-[12px] text-slate-400 sm:block">
            Applying for <span className="font-semibold text-slate-600">{job.title}</span>
          </p>
        </div>
      </PipelineShell>

      <ApplicationSuccessModal
        isOpen={showSuccess}
        applicationData={submitted ?? undefined}
        onClose={() => {
          setShowSuccess(false);
          clearCareerFlow();
          router.push("/career");
        }}
      />

      <AmanApplicationModal
        isOpen={showAman}
        onClose={() => {
          setShowAman(false);
        }}
      />
    </>
  );
}
