"use client";

import { useSyncExternalStore } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Career pipeline state
   Shared across /career/uploade_cv → /career/application-form → /career/review-submit
   Persisted in sessionStorage so refresh / back-navigation keeps the flow alive.
   ──────────────────────────────────────────────────────────────────────────── */

export type CareerJob = {
  _id: string;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  experience?: string;
  status?: string;
};

export type CareerBreakdown = {
  relevantExperience: number;
  educationalQualification: number;
  keySkills: number;
  roleFit: number;
  industryExperience: number;
  locationPreference: number;
};

export type CareerAnalysis = {
  candidateName: string;
  firstName?: string;
  email?: string | null;
  phone?: string | null;
  phones?: string[];
  linkedin?: string | null;
  cvUrl?: string | null;
  cvName: string;
  cvSize: string;
  score: number;
  summary?: string;
  requirementsMet?: string[];
  breakdown?: CareerBreakdown;
};

export type CareerForm = {
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  totalExperience: string;
  department: string;
  relocate: string;
  employmentStatus: string;
  noticePeriod: string;
  expectedCTC: string;
  whyInterested: string;
};

export type CareerFlowState = {
  job: CareerJob | null;
  analysis: CareerAnalysis | null;
  form: CareerForm | null;
  verifiedPhone: string | null;
  updatedAt: number;
};

export const STORAGE_KEY = "ensis_career_flow";

const EMPTY_STATE: CareerFlowState = Object.freeze({
  job: null,
  analysis: null,
  form: null,
  verifiedPhone: null,
  updatedAt: 0,
});

let state: CareerFlowState = EMPTY_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((fn) => fn());

const readStorage = (): CareerFlowState => {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<CareerFlowState>;
    return {
      job: parsed.job ?? null,
      analysis: parsed.analysis ?? null,
      form: parsed.form ?? null,
      verifiedPhone: parsed.verifiedPhone ?? null,
      updatedAt: parsed.updatedAt ?? 0,
    };
  } catch {
    return EMPTY_STATE;
  }
};

const hydrate = () => {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = readStorage();
};

export function getCareerFlow(): CareerFlowState {
  hydrate();
  return state;
}

const persist = () => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — flow still works in memory */
  }
};

export function setCareerFlow(patch: Partial<CareerFlowState>): CareerFlowState {
  hydrate();
  state = { ...state, ...patch, updatedAt: Date.now() };
  persist();
  notify();
  return state;
}

export function updateCareerForm(patch: Partial<CareerForm>): CareerFlowState {
  hydrate();
  state = {
    ...state,
    form: { ...(state.form ?? defaultFormFromAnalysis(state.analysis)), ...patch },
    updatedAt: Date.now(),
  };
  persist();
  notify();
  return state;
}

export function clearCareerFlow(): void {
  hydrated = true;
  state = EMPTY_STATE;
  pendingCvFile = null;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }
  notify();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Live view of the pipeline state (client). */
export function useCareerFlow(): CareerFlowState {
  return useSyncExternalStore(subscribe, getCareerFlow, () => EMPTY_STATE);
}

/* ── CV File (File objects cannot be serialised — kept in memory only) ────── */

let pendingCvFile: File | null = null;

export function setCvFile(file: File | null): void {
  pendingCvFile = file;
}

export function getCvFile(): File | null {
  return pendingCvFile;
}

/**
 * Returns the CV as a File for submission.
 * If the session was refreshed (File lost), re-hydrates it from the URL the
 * analyze route saved the document to.
 */
export async function resolveCvFile(): Promise<File | null> {
  if (pendingCvFile) return pendingCvFile;
  const url = state.analysis?.cvUrl;
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const name = state.analysis?.cvName || "CV.pdf";
    pendingCvFile = new File([blob], name, { type: blob.type || "application/pdf" });
    return pendingCvFile;
  } catch {
    return null;
  }
}

/* ── Defaults & helpers ───────────────────────────────────────────────────── */

export const DEFAULT_CV_NAME = "Your_CV.pdf";

export function defaultFormFromAnalysis(analysis?: CareerAnalysis | null): CareerForm {
  return {
    fullName: analysis?.candidateName || "",
    email: analysis?.email || "",
    phone: analysis?.phone || "",
    currentLocation: "",
    totalExperience: "",
    department: "",
    relocate: "No",
    employmentStatus: "Currently Employed",
    noticePeriod: "30 Days",
    expectedCTC: "As per industry standards",
    whyInterested: "",
  };
}

export const PIPELINE_STEPS = [
  "Upload CV",
  "AI Analysis",
  "Eligibility",
  "Application",
  "Review",
] as const;

export const ALLOWED_CV_EXTENSIONS = ["pdf"] as const;
export const MAX_CV_BYTES = 5 * 1024 * 1024;

export function fileExtension(name: string): string {
  return (name.split(".").pop() || "").toLowerCase();
}

export function isAllowedCvFile(file: File): boolean {
  return (ALLOWED_CV_EXTENSIONS as readonly string[]).includes(fileExtension(file.name));
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test((value || "").trim());
}

export function digitsOnly(value: string): string {
  return (value || "").replace(/\D/g, "");
}

/** 10-digit Indian mobile (optionally prefixed with +91 / 0). */
export function isValidPhone(value: string): boolean {
  const digits = digitsOnly(value);
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local);
}

/** "+91 98765 43210" */
export function formatPhone(value: string): string {
  let digits = digitsOnly(value);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length !== 10) return value || "";
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Plain 10-digit number for OTP endpoints. */
export function otpPhone(value: string): string {
  let digits = digitsOnly(value);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export type MatchLevel = "high" | "moderate" | "low";

export function matchLevel(score: number): MatchLevel {
  if (score >= 70) return "high";
  if (score >= 50) return "moderate";
  return "low";
}

/** Ensis pipeline palette — Emerald / Blue / Slate */
export const MATCH_THEME: Record<
  MatchLevel,
  {
    label: string;
    hint: string;
    hex: string;
    chip: string;
    bar: string;
    ringTrack: string;
    panel: string;
    border: string;
  }
> = {
  high: {
    label: "Strong Match",
    hint: "Your profile aligns well with this role.",
    hex: "#059669",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    ringTrack: "#d1fae5",
    panel: "from-emerald-50 via-white to-white",
    border: "border-emerald-200",
  },
  moderate: {
    label: "Moderate Match",
    hint: "You meet part of the criteria — worth applying.",
    hex: "#2563eb",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    bar: "bg-blue-500",
    ringTrack: "#dbeafe",
    panel: "from-blue-50 via-white to-white",
    border: "border-blue-200",
  },
  low: {
    label: "Needs Review",
    hint: "Review the gaps below before applying.",
    hex: "#475569",
    chip: "bg-slate-100 text-slate-700 border-slate-300",
    bar: "bg-slate-500",
    ringTrack: "#e2e8f0",
    panel: "from-slate-50 via-white to-white",
    border: "border-slate-300",
  },
};

export const BREAKDOWN_LABELS: { key: keyof CareerBreakdown; label: string }[] = [
  { key: "relevantExperience", label: "Relevant Experience" },
  { key: "educationalQualification", label: "Education" },
  { key: "keySkills", label: "Key Skills" },
  { key: "roleFit", label: "Role Fit" },
  { key: "industryExperience", label: "Industry Experience" },
  { key: "locationPreference", label: "Location Preference" },
];

export const LOCATION_OPTIONS = [
  "Delhi NCR",
  "Noida",
  "Gurugram",
  "Ghaziabad",
  "Faridabad",
  "Other",
];

export const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "15 Days",
  "30 Days",
  "45 Days",
  "60 Days",
  "90 Days",
];

export const EXPECTED_CTC_OPTIONS = [
  "As per industry standards",
  "₹ 3 - 5 LPA",
  "₹ 5 - 8 LPA",
  "₹ 8 - 12 LPA",
  "₹ 12 - 18 LPA",
  "₹ 18 LPA+",
];

export const RELOCATE_OPTIONS = ["Yes", "No", "Yes, Pan India"];

export const EMPLOYMENT_OPTIONS = [
  "Currently Employed",
  "Not Currently Employed",
  "Fresher",
];

/** Job-free default so the flow always has something to submit against. */
export const GENERAL_JOB: CareerJob = {
  _id: "general-application",
  title: "General Application",
  department: "General",
  location: "India",
  type: "Full Time",
  experience: "Any",
};
