/**
 * Client-side session and local store for the Ensis Career Redesign Flow.
 * Holds state across /analysis, /result, /review, /apply, and /submitted.
 */

import type {
  PublicJob,
  Screening,
  CandidateProfile,
  ApplicationSubmitResponse,
} from "./careerApi";

export type FlowDetailsState = {
  preferredLocations: string[];
  noticePeriod: string;
  expectedCtc: string;
  joiningPreference: string;
  howDidYouHear?: string;
  willingToRelocate?: boolean;
  employmentType?: string;
};

export type FlowAdditionalState = {
  whyJoin: string;
  extraSkills?: string;
  workedWith: string[];
};

export type FlowReferenceItem = {
  name: string;
  designation: string;
  organization: string;
  phone: string;
  email: string;
};

export type FlowConsentsState = {
  accurate: boolean;
  verify: boolean;
  futureContact: boolean;
  privacy: boolean;
};

export type FlowDocumentItem = {
  fileId: string;
  label: string;
  fileName?: string;
  size?: number;
};

export type CareerFlowState = {
  job: PublicJob;
  screeningId: string;
  screening: Screening;
  profile: CandidateProfile;
  details: FlowDetailsState;
  additional: FlowAdditionalState;
  references: FlowReferenceItem[];
  documents: FlowDocumentItem[];
  consents: FlowConsentsState;
  submission: ApplicationSubmitResponse | null;
  updatedAt: string;
};

const STORAGE_KEY = "ensis_career_flow_v2";
const SAVED_JOBS_KEY = "ensis_saved_jobs_v2";

// In-memory CV file store (keeps raw file in memory without saving to public directory)
let inMemoryCvFile: File | null = null;

export function setCvFile(file: File | null): void {
  inMemoryCvFile = file;
}

export function getCvFile(): File | null {
  return inMemoryCvFile;
}

export function saveFlowState(patch: Partial<CareerFlowState>): CareerFlowState | null {
  if (typeof window === "undefined") return null;

  try {
    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    const existing = existingRaw ? (JSON.parse(existingRaw) as CareerFlowState) : ({} as CareerFlowState);

    const merged: CareerFlowState = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error("Failed to save flow state to sessionStorage:", err);
    return null;
  }
}

export function loadFlowState(expectedSlug?: string): CareerFlowState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: CareerFlowState = JSON.parse(raw);
    if (!parsed || !parsed.screeningId || !parsed.job) return null;

    if (expectedSlug) {
      const jobSlug = (parsed.job.slug || parsed.job._id || "").toLowerCase();
      const targetSlug = decodeURIComponent(expectedSlug).toLowerCase();
      if (jobSlug !== targetSlug && targetSlug !== "general") {
        return null;
      }
    }

    return parsed;
  } catch (err) {
    console.error("Failed to load flow state from sessionStorage:", err);
    return null;
  }
}

export function clearFlowState(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear flow state:", err);
  }
  inMemoryCvFile = null;
}

// -----------------------------------------------------------------------------
// "Save for Later" LocalStorage Bookmark helper
// -----------------------------------------------------------------------------

export function getSavedJobSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isJobSaved(slug: string): boolean {
  if (!slug) return false;
  const list = getSavedJobSlugs();
  return list.includes(slug.toLowerCase());
}

export function toggleSavedJobSlug(slug: string): boolean {
  if (typeof window === "undefined" || !slug) return false;
  try {
    const key = slug.toLowerCase();
    const list = getSavedJobSlugs();
    const exists = list.includes(key);
    const updated = exists ? list.filter((s) => s !== key) : [...list, key];
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}
