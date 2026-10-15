"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  FileUp,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
  ScanLine,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { careerApi } from "@/lib/api/api";
import PhoneVerifyModal from "@/components/career/PhoneVerifyModal";
import {
  Field,
  GhostButton,
  PipelineShell,
  PrimaryButton,
  ScoreBar,
  ScoreRing,
  SectionTitle,
  SideCard,
} from "@/components/career/pipeline/ui";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import {
  BREAKDOWN_LABELS,
  GENERAL_JOB,
  MATCH_THEME,
  MAX_CV_BYTES,
  formatFileSize,
  formatPhone,
  getCareerFlow,
  isAllowedCvFile,
  isValidEmail,
  isValidPhone,
  matchLevel,
  otpPhone,
  setCareerFlow,
  setCvFile,
  type CareerAnalysis,
  type CareerJob,
} from "@/lib/careerFlow";

type View = "upload" | "analyzing" | "result";

type AnalyzeResponse = {
  success?: boolean;
  message?: string;
  candidateName?: string;
  firstName?: string;
  email?: string | null;
  phone?: string | null;
  phones?: string[];
  linkedin?: string | null;
  cvUrl?: string | null;
  score?: number;
  summary?: string;
  requirementsMet?: string[];
  breakdown?: CareerAnalysis["breakdown"];
};

const ANALYSIS_STATUS = [
  "Uploading CV",
  "Extracting text",
  "Reading experience & skills",
  "Scoring against the role",
  "Preparing your match report",
];
const STATUS_INTERVAL_MS = 850;
const MIN_ANALYSIS_WAIT_MS = 3450;

const HOW_IT_WORKS = [
  { title: "Upload CV", text: "Drop in your PDF — the AI does the reading." },
  { title: "AI screening", text: "An instant match score against this exact role." },
  { title: "Apply", text: "Verify your number and finish the application." },
];

function JobMetaRow({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <li className="flex items-start gap-2 text-[13px] text-slate-600">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <span className="min-w-0 font-medium">{text}</span>
    </li>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </dt>
        <dd
          className={`truncate text-sm font-semibold ${value ? "text-slate-900" : "text-red-600"}`}
        >
          {value || "Missing — edit to add"}
        </dd>
      </div>
    </div>
  );
}

export default function UploadCvPage() {
  const router = useRouter();
  const [view, setView] = useState<View>(() => (getCareerFlow().analysis ? "result" : "upload"));
  const [job, setJob] = useState<CareerJob | null>(() => getCareerFlow().job);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(
    () => getCareerFlow().analysis
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [runId, setRunId] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", phone: "" });
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const finishTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const flow = getCareerFlow();
    const jobId = new URLSearchParams(window.location.search).get("job");
    if (flow.job && !jobId) return;

    let cancelled = false;
    careerApi
      .list()
      .then((list) => {
        if (cancelled) return;
        const active = (list ?? []).filter((item) => item.status !== "closed");
        const picked = jobId ? active.find((item) => item._id === jobId) : active[0];
        const next = picked ?? GENERAL_JOB;
        setCareerFlow({ job: next });
        setJob(next);
      })
      .catch(() => {
        if (cancelled) return;
        setCareerFlow({ job: GENERAL_JOB });
        setJob(GENERAL_JOB);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (view !== "analyzing" || analysisError) return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setStatusIndex(
        Math.min(ANALYSIS_STATUS.length - 1, Math.floor(elapsed / STATUS_INTERVAL_MS))
      );
      setProgress(Math.min(97, Math.round((elapsed / MIN_ANALYSIS_WAIT_MS) * 100)));
    }, 120);
    return () => window.clearInterval(timer);
  }, [view, analysisError, runId]);

  useEffect(() => {
    return () => {
      if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!phoneModalOpen) return;
    lockScroll();
    return () => unlockScroll();
  }, [phoneModalOpen]);

  const activeJob = job ?? GENERAL_JOB;

  const acceptFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!isAllowedCvFile(file)) {
      setFileError("That file type is not allowed. Upload your CV as a PDF.");
      setSelectedFile(null);
      return;
    }
    if (file.size === 0) {
      setFileError("That file is empty. Please choose another CV.");
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setFileError(
        `That file is ${formatFileSize(file.size)}. Maximum allowed size is 5 MB.`
      );
      setSelectedFile(null);
      return;
    }
    setFileError(null);
    setSelectedFile(file);
  };

  const startAnalysis = async () => {
    const file = selectedFile;
    if (!file) return;

    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    setAnalysisError(null);
    setStatusIndex(0);
    setProgress(0);
    setRunId((id) => id + 1);
    setView("analyzing");

    const startedAt = Date.now();
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("jobTitle", activeJob.title);
      body.append("jobExperience", activeJob.experience ?? "");

      const response = await fetch("/api/analyze-cv", { method: "POST", body });
      const payload = (await response.json().catch(() => null)) as AnalyzeResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.message || "We couldn't analyze this CV right now. Please try again."
        );
      }
      if (typeof payload.score !== "number") {
        throw new Error(
          payload.message || "The analysis came back incomplete. Please try again."
        );
      }

      const nextAnalysis: CareerAnalysis = {
        candidateName:
          payload.candidateName || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        firstName: payload.firstName,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        phones: Array.isArray(payload.phones) ? payload.phones : [],
        linkedin: payload.linkedin ?? null,
        cvUrl: payload.cvUrl ?? null,
        cvName: file.name,
        cvSize: formatFileSize(file.size),
        score: payload.score,
        summary: payload.summary,
        requirementsMet: Array.isArray(payload.requirementsMet)
          ? payload.requirementsMet
          : undefined,
        breakdown: payload.breakdown ?? undefined,
      };

      const remaining = Math.max(0, MIN_ANALYSIS_WAIT_MS - (Date.now() - startedAt));
      finishTimerRef.current = window.setTimeout(() => {
        finishTimerRef.current = null;
        setCvFile(file);
        setCareerFlow({ analysis: nextAnalysis });
        setAnalysis(nextAnalysis);
        setProgress(100);
        setView("result");
      }, remaining);
    } catch (error) {
      setProgress(0);
      setAnalysisError(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong while analyzing your CV. Please try again."
      );
    }
  };

  const replaceCv = () => {
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    setCvFile(null);
    setCareerFlow({ analysis: null });
    setAnalysis(null);
    setSelectedFile(null);
    setFileError(null);
    setAnalysisError(null);
    setIsEditing(false);
    setPhoneModalOpen(false);
    setView("upload");
  };

  const currentName = analysis ? (isEditing ? draft.name.trim() : analysis.candidateName) : "";
  const currentEmail = analysis ? (isEditing ? draft.email.trim() : analysis.email ?? "") : "";
  const currentPhone = analysis ? (isEditing ? draft.phone.trim() : analysis.phone ?? "") : "";

  const nameValid = currentName.length > 0;
  const emailValid = isValidEmail(currentEmail);
  const phoneValid = isValidPhone(currentPhone);
  const canContinue = Boolean(analysis) && nameValid && emailValid && phoneValid;

  const openEdit = () => {
    if (!analysis) return;
    setDraft({
      name: analysis.candidateName ?? "",
      email: analysis.email ?? "",
      phone: analysis.phone ?? "",
    });
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!analysis || !nameValid || !emailValid || !phoneValid) return;
    setAnalysis({
      ...analysis,
      candidateName: currentName,
      email: currentEmail,
      phone: currentPhone,
    });
    setIsEditing(false);
  };

  const handleContinue = () => {
    if (!analysis || !canContinue) return;
    const updated: CareerAnalysis = {
      ...analysis,
      candidateName: currentName,
      email: currentEmail,
      phone: currentPhone,
    };
    setCareerFlow({ analysis: updated });
    setAnalysis(updated);

    const verified = getCareerFlow().verifiedPhone;
    if (verified && otpPhone(verified) === otpPhone(currentPhone)) {
      router.push("/career/application-form");
      return;
    }
    setPhoneModalOpen(true);
  };

  const handlePhoneVerified = (verifiedPhone: string) => {
    if (analysis) {
      const withPhone: CareerAnalysis = {
        ...analysis,
        candidateName: currentName,
        email: currentEmail,
        phone: verifiedPhone,
      };
      setCareerFlow({ verifiedPhone, analysis: withPhone });
      setAnalysis(withPhone);
    } else {
      setCareerFlow({ verifiedPhone });
    }
    setPhoneModalOpen(false);
    router.push("/career/application-form");
  };

  const phoneOptions: string[] = (() => {
    if (!analysis) return [];
    const seen = new Set<string>();
    const options: string[] = [];
    for (const raw of [currentPhone, ...(analysis.phones ?? [])]) {
      const digits = otpPhone(raw);
      if (!/^[6-9]\d{9}$/.test(digits) || seen.has(digits)) continue;
      seen.add(digits);
      options.push(raw.trim());
    }
    return options;
  })();

  const missing: string[] = [];
  if (analysis && !nameValid) missing.push("full name");
  if (analysis && !emailValid) missing.push("email");
  if (analysis && !phoneValid) missing.push("mobile number");
  const blockedHint = missing.length ? `Fix the ${missing.join(", ")} to continue.` : "";

  const level = analysis ? matchLevel(analysis.score) : "moderate";
  const theme = MATCH_THEME[level];

  const jobMetaRows: { icon: React.ElementType; text: string }[] = [
    { icon: BriefcaseBusiness, text: activeJob.title },
    ...(activeJob.department ? [{ icon: Building2, text: activeJob.department }] : []),
    ...(activeJob.location ? [{ icon: MapPin, text: activeJob.location }] : []),
    ...(activeJob.experience ? [{ icon: BarChart3, text: activeJob.experience }] : []),
    ...(activeJob.type ? [{ icon: Clock3, text: activeJob.type }] : []),
  ];

  const jobSummaryCard = (
    <SideCard title="Job summary">
      <ul className="space-y-2">
        {jobMetaRows.map((row) => (
          <JobMetaRow key={row.text} icon={row.icon} text={row.text} />
        ))}
      </ul>
    </SideCard>
  );

  const roleCard = (
    <SideCard title="This role" accent="blue">
      <p className="text-sm font-semibold leading-snug text-slate-900">{activeJob.title}</p>
      <ul className="mt-3 space-y-2">
        {jobMetaRows.slice(1).map((row) => (
          <JobMetaRow key={row.text} icon={row.icon} text={row.text} />
        ))}
      </ul>
    </SideCard>
  );

  const howItWorksCard = (
    <SideCard title="How it works">
      <ol className="space-y-3">
        {HOW_IT_WORKS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${
                index === 0 ? "bg-emerald-600" : "bg-blue-600"
              }`}
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900">{step.title}</p>
              <p className="text-[12.5px] leading-snug text-slate-500">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </SideCard>
  );

  const thresholdCard = (
    <SideCard accent="emerald">
      <p className="text-[12.5px] leading-relaxed text-slate-600">
        <span className="font-semibold text-slate-900">
          50%+ keeps you in the shortlist band.
        </span>{" "}
        70%+ reads as a strong match, 50–69% as a moderate match worth applying for. Below
        50% your profile is still reviewed, but sits outside the shortlist.
      </p>
    </SideCard>
  );

  const uploadSidebar = (
    <>
      {roleCard}
      {howItWorksCard}
      {thresholdCard}
    </>
  );

  const resultSidebar = analysis ? (
    <>
      <SideCard title="Your CV">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-10 shrink-0 place-items-center rounded-lg border-2 border-emerald-600 text-emerald-600">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{analysis.cvName}</p>
            <p className="text-xs text-slate-500">{analysis.cvSize}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={replaceCv}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Replace CV
        </button>
      </SideCard>

      <SideCard title="AI match" accent="emerald">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-slate-600">Overall score</span>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${theme.chip}`}
          >
            {analysis.score}% · {theme.label}
          </span>
        </div>
      </SideCard>

      {jobSummaryCard}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <PrimaryButton
          type="button"
          className="w-full"
          onClick={handleContinue}
          disabled={!canContinue}
          title={blockedHint || undefined}
        >
          Continue &amp; Apply
          <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
        {blockedHint ? (
          <p role="alert" className="mt-2 text-xs font-medium text-red-600">
            {blockedHint}
          </p>
        ) : (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            We verify your mobile by OTP before the application form.
          </p>
        )}
      </div>
    </>
  ) : (
    uploadSidebar
  );

  const uploadView = (
    <div>
      <SectionTitle
        eyebrow="Step 1 · Upload CV"
        title="Scan your CV with AI"
        description="Upload your PDF and our AI scores your profile against this role in seconds."
      />

      <div className="space-y-4">
        {fileError ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {fileError}
          </p>
        ) : null}

        <div
          role="button"
          tabIndex={0}
          aria-label="Upload your CV. Drag and drop a PDF here, or press Enter to browse."
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsDragging(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            acceptFiles(event.dataTransfer.files);
          }}
          className={[
            "grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition",
            isDragging
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-300 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/40",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(event) => {
              acceptFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200">
            <FileUp className="h-7 w-7" />
          </span>
          <p className="mt-4 text-lg font-semibold text-slate-900">
            Drag &amp; drop your CV here
          </p>
          <p className="mt-1 text-sm text-slate-500">or click to browse your files</p>
        </div>

        {selectedFile ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-200">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)} · Ready to scan</p>
            </div>
            <button
              type="button"
              aria-label="Remove selected CV"
              onClick={() => {
                setSelectedFile(null);
                setFileError(null);
              }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <PrimaryButton
            type="button"
            onClick={() => void startAnalysis()}
            disabled={!selectedFile}
          >
            <ScanLine className="h-4 w-4" />
            Scan CV with AI
          </PrimaryButton>
          <p className="text-xs text-slate-500">PDF only · max 5 MB · parsed securely</p>
        </div>
      </div>
    </div>
  );

  const analyzingView = (
    <div>
      {analysisError ? (
        <div
          role="alert"
          className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-red-600 ring-1 ring-red-200">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            The analysis couldn&apos;t finish
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-red-600">
            {analysisError}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton type="button" onClick={() => void startAnalysis()}>
              <RefreshCw className="h-4 w-4" />
              Try again
            </PrimaryButton>
            <GhostButton
              type="button"
              onClick={() => {
                setAnalysisError(null);
                setView("upload");
              }}
            >
              Choose a different CV
            </GhostButton>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white px-6 py-12 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
            <ScanLine className="h-7 w-7 animate-pulse" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Analyzing your CV</h2>
          <p
            key={statusIndex}
            aria-live="polite"
            className="mt-1.5 text-sm font-medium text-slate-500"
          >
            {ANALYSIS_STATUS[statusIndex]}
          </p>

          <div
            role="progressbar"
            aria-label="Analysis progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="mx-auto mt-7 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold tabular-nums text-slate-500">{progress}%</p>

          <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden>
            {ANALYSIS_STATUS.map((label, index) => (
              <span
                key={label}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  index === statusIndex
                    ? "w-6 bg-blue-600"
                    : index < statusIndex
                      ? "w-3 bg-emerald-500"
                      : "w-3 bg-slate-200",
                ].join(" ")}
              />
            ))}
          </div>

          <p className="mx-auto mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <LockKeyhole className="h-3.5 w-3.5 text-emerald-600" />
            This takes a few seconds — please keep this window open.
          </p>
        </div>
      )}
    </div>
  );

  const resultView = analysis ? (
    <div className="space-y-5">
      <div
        className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${theme.panel} p-5 md:p-7`}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            <ScoreRing score={analysis.score} />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <SectionTitle
                eyebrow="AI eligibility report"
                title={theme.label}
                description={theme.hint}
              />
              {analysis.summary ? (
                <blockquote className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] italic leading-relaxed text-slate-600">
                  &ldquo;{analysis.summary}&rdquo;
                </blockquote>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Score breakdown
            </p>
            {analysis.breakdown ? (
              <div className="space-y-3.5">
                {BREAKDOWN_LABELS.map(({ key, label }) => (
                  <ScoreBar key={key} label={label} value={analysis.breakdown?.[key] ?? 0} level={level} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No per-criterion breakdown was returned for this CV.
              </p>
            )}
          </div>
        </div>
      </div>

      {analysis.requirementsMet && analysis.requirementsMet.length > 0 ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
            What the AI found
          </h3>
          <ul className="mt-3 space-y-2">
            {analysis.requirementsMet.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Your profile from the CV
          </h3>
          {!isEditing ? (
            <button
              type="button"
              onClick={openEdit}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                label="Full name"
                required
                autoComplete="name"
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                error={draft.name.trim().length === 0 ? "Full name is required" : null}
              />
            </div>
            <Field
              label="Email"
              required
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, email: event.target.value }))
              }
              error={
                draft.email.trim().length === 0 || !isValidEmail(draft.email)
                  ? "Enter a valid email address"
                  : null
              }
            />
            <Field
              label="Mobile number"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={draft.phone}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, phone: event.target.value }))
              }
              hint="10-digit mobile number"
              error={
                draft.phone.trim().length === 0 || !isValidPhone(draft.phone)
                  ? "Enter a valid 10-digit mobile number"
                  : null
              }
            />
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <PrimaryButton
                type="button"
                onClick={saveEdit}
                disabled={!nameValid || !emailValid || !phoneValid}
              >
                Save
              </PrimaryButton>
              <GhostButton type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </GhostButton>
            </div>
          </div>
        ) : (
          <dl className="divide-y divide-slate-100">
            <ProfileRow icon={User} label="Full name" value={currentName} />
            <ProfileRow icon={Mail} label="Email" value={currentEmail} />
            <ProfileRow
              icon={Phone}
              label="Mobile number"
              value={
                currentPhone
                  ? isValidPhone(currentPhone)
                    ? formatPhone(currentPhone)
                    : currentPhone
                  : ""
              }
            />
          </dl>
        )}
      </div>
    </div>
  ) : null;

  const stepCurrent = view === "upload" ? 1 : view === "analyzing" ? 2 : 3;

  return (
    <>
      <PipelineShell
        current={stepCurrent}
        badge={activeJob.title}
        sidebar={view === "result" ? resultSidebar : uploadSidebar}
      >
        {view === "upload" ? uploadView : view === "analyzing" ? analyzingView : resultView}
      </PipelineShell>

      {analysis ? (
        <PhoneVerifyModal
          isOpen={phoneModalOpen}
          phoneOptions={phoneOptions}
          candidateName={analysis.candidateName}
          onVerified={handlePhoneVerified}
          onDismiss={() => setPhoneModalOpen(false)}
          onCloseAll={() => {
            setPhoneModalOpen(false);
            router.push("/career");
          }}
        />
      ) : null}
    </>
  );
}
