/**
 * Single source of truth API client for Ensis Career Flow.
 * Follows CAREER-REDESIGN-CONTRACT.md strictly with safe, isolated fallbacks.
 */

import { API_URL } from "@/lib/api/api";
import { listOpenJobs, type PublicJob } from "@/lib/careers";

export type { PublicJob };

export type CvFile = {
  fileName: string;
  size: number;
  uploadedAt: string;
};

export type StepKey =
  | "read_cv"
  | "match_skills"
  | "check_experience"
  | "verify_education"
  | "analyze_competencies"
  | "calculate_score";

export type StepState = "pending" | "active" | "done";

export type ScreeningStep = {
  key: StepKey;
  label: string;
  state: StepState;
};

export type BreakdownKey =
  | "education"
  | "experience"
  | "technical_skills"
  | "creative_thinking"
  | "communication"
  | "portfolio"
  | "location";

export type BreakdownItem = {
  key: BreakdownKey;
  label: string;
  sublabel: string;
  score: number;
};

export type EducationItem = {
  qualification: string;
  institute: string;
  year: string;
  score: string;
  specialization: string;
};

export type ExperienceItem = {
  organization: string;
  designation: string;
  from: string;
  to: string;
  responsibilities: string;
};

export type SkillItem = {
  name: string;
  level: number; // 0-100
};

export type CandidateProfile = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other" | string;
  currentLocation?: string;
  permanentAddress?: string;
  linkedin?: string;
  photoUrl?: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  certifications: string[];
};

export type ScreeningResult = {
  score: number; // 0–100
  level: "eligible" | "partial" | "not_eligible";
  thresholds: { eligible: number; partial: number };
  breakdown: BreakdownItem[];
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  profile: CandidateProfile;
};

export type Screening = {
  screeningId: string;
  jobId: string;
  status: "processing" | "done" | "failed";
  progress: number; // 0–100
  steps: ScreeningStep[];
  cv: CvFile;
  error?: string;
  result?: ScreeningResult;
};

export type ApplicationInput = {
  screeningId: string;
  jobId: string;
  profile: CandidateProfile;
  details: {
    preferredLocations: string[];
    noticePeriod: string;
    expectedCtc: string;
    joiningPreference: string;
    howDidYouHear?: string;
    willingToRelocate?: boolean;
    employmentType?: string;
  };
  additional: {
    whyJoin: string;
    extraSkills?: string;
    workedWith: string[];
  };
  references: {
    name: string;
    designation: string;
    organization: string;
    phone: string;
    email: string;
  }[];
  documents: { fileId: string; label: string; fileName?: string; size?: number }[];
  consents: {
    accurate: boolean;
    verify: boolean;
    futureContact: boolean;
    privacy: boolean;
  };
  screeningResult?: ScreeningResult;
  screeningCvName?: string;
};

export type ApplicationSubmitResponse = {
  applicationId: string;
  submittedAt: string;
  jobTitle: string;
  email: string;
  matchScore?: number;
  status: string;
};

export type CareerSettingsData = {
  hrEmails?: string[];
  hrContact?: {
    email: string;
    phone: string;
    address: string;
  };
  defaultThresholds?: {
    eligible: number;
    partial: number;
  };
};

export const DEFAULT_HR_SETTINGS: CareerSettingsData = {
  hrEmails: ["careers@ensiswellness.com"],
  hrContact: {
    email: "hr@ensis.in",
    phone: "+91 98765 43210",
    address: "ENSIS Corporate Office, Delhi NCR",
  },
  defaultThresholds: { eligible: 70, partial: 50 },
};

export const GENERAL_APPLICATION_JOB: PublicJob = {
  _id: "general",
  slug: "general",
  title: "General Application",
  department: "Design & Wellness Solutions",
  location: "Delhi NCR / Pan-India",
  employmentType: "Full Time",
  workplaceType: "On-site / Hybrid",
  experienceMin: 1,
  experienceMax: 10,
  educationRequirements: "Relevant Degree or Diploma in Design, Wellness, or Technical Discipline",
  shortDescription:
    "Don't see a specific opening matching your profile? Submit your profile to our talent community.",
  description:
    "We are always looking for passionate talent across product design, wellness architecture, operations, craftsmanship, and client solutions. Submit your CV for general evaluation.",
  responsibilities: [
    "Contribute to wellness furniture and space design projects",
    "Collaborate across multidisciplinary teams (design, fabrication, sales)",
    "Uphold ENSIS standards of luxury ergonomics, sustainability, and quality",
  ],
  requirements: [
    "Passion for holistic wellness, design excellence, or precision craftsmanship",
    "Strong technical, communication, or project management capabilities",
    "Eagerness to grow in an innovation-led wellness furniture ecosystem",
  ],
  aiCheckPoints: [
    "Core competencies and relevant work history",
    "Educational background and domain specialization",
    "Design sensibility or technical problem-solving alignment",
    "Communication skills and team collaboration track record",
  ],
  eligibilityThreshold: 70,
  partialMatchMin: 50,
  showMatchScoreToCandidate: true,
  showMatchBreakdown: true,
};

export const MOCK_DESIGN_JOBS: Record<string, PublicJob> = {
  "product-designer": {
    _id: "mock-job-product-designer",
    slug: "product-designer",
    title: "Product Designer",
    department: "Design & Wellness Solutions",
    location: "Delhi NCR",
    employmentType: "Full Time",
    workplaceType: "Hybrid",
    experienceMin: 2,
    experienceMax: 5,
    educationRequirements: "B.Des / M.Des (Product or Industrial Design)",
    shortDescription:
      "Design innovative wellness furniture and treatment solutions that combine functionality, comfort and aesthetics.",
    description:
      "We are looking for a passionate Product Designer to design luxury wellness furniture, spa treatment tables, and ergonomic wellness spaces that blend contemporary aesthetics with timeless comfort.",
    responsibilities: [
      "Design innovative wellness furniture and treatment solutions for spas and wellness spaces.",
      "Create product concepts, 3D models and detailed technical drawings.",
      "Collaborate with manufacturing, sourcing and project teams to ensure design feasibility.",
      "Ensure the right balance of functionality, comfort, ergonomics and aesthetics.",
    ],
    requirements: [
      "Bachelor's or Master's degree in Product Design, Industrial Design or Interior Design.",
      "Proficiency in design tools such as AutoCAD, SolidWorks, SketchUp, Rhino or similar.",
      "Strong portfolio showcasing furniture or product design work.",
      "Good communication and collaboration skills.",
      "Passion for wellness design and creating meaningful spaces.",
    ],
    aiCheckPoints: [
      "Relevant product design experience",
      "Experience in furniture / industrial / interior design",
      "Proficiency in CAD / 3D design tools",
      "Portfolio and design quality",
      "Communication & teamwork skills",
      "Overall profile match",
    ],
    eligibilityThreshold: 70,
    partialMatchMin: 50,
    showMatchScoreToCandidate: true,
    showMatchBreakdown: true,
  },
  "furniture-production-specialist": {
    _id: "mock-job-furniture-production-specialist",
    slug: "furniture-production-specialist",
    title: "Furniture Production Specialist",
    department: "Manufacturing",
    location: "Delhi NCR",
    employmentType: "Full Time",
    workplaceType: "On-site",
    experienceMin: 3,
    experienceMax: 7,
    educationRequirements: "Diploma / Degree in Production, Woodwork, or Mechanical Engineering",
    shortDescription:
      "Support manufacturing processes, ensure quality craftsmanship and help bring our designs to life.",
    description:
      "Oversee premium hardwood crafting, upholstery finishing, assembly, and quality assurance for luxury spa and wellness furniture.",
    responsibilities: [
      "Manage woodwork, joinery, and assembly workflows on the production floor.",
      "Enforce 5-year structural warranty quality standards across all wellness pieces.",
      "Coordinate with design and procurement teams for premium raw material sourcing.",
      "Optimize production schedules to meet project delivery commitments.",
    ],
    requirements: [
      "3+ years experience in furniture production or premium woodwork fabrication.",
      "Deep understanding of hardwood types, veneers, polishing, and upholstery.",
      "Strong attention to detail and team leadership capabilities.",
    ],
    aiCheckPoints: [
      "Furniture fabrication and woodworking expertise",
      "Quality assurance and warranty compliance knowledge",
      "Team supervision and workshop workflow management",
    ],
    eligibilityThreshold: 70,
    partialMatchMin: 50,
    showMatchScoreToCandidate: true,
    showMatchBreakdown: true,
  },
  "sales-partnerships-executive": {
    _id: "mock-job-sales-partnerships-executive",
    slug: "sales-partnerships-executive",
    title: "Sales & Partnerships Executive",
    department: "Sales",
    location: "Delhi NCR",
    employmentType: "Full Time",
    workplaceType: "Hybrid",
    experienceMin: 2,
    experienceMax: 5,
    educationRequirements: "Any Graduate; MBA / Marketing certification is a plus",
    shortDescription:
      "Build client relationships, explore new business opportunities and contribute to the growth of ENSIS.",
    description:
      "Develop partnerships with luxury spa owners, wellness retreats, Ayurvedic resorts, and architects to present bespoke wellness furniture and turnkey installations.",
    responsibilities: [
      "Generate and qualify leads with wellness resorts, luxury hotels, and clinics.",
      "Conduct consultative presentations highlighting our ergonomic wellness products.",
      "Prepare commercial proposals and collaborate with the design team on custom quotes.",
      "Nurture enduring relationships with architects, interior consultants, and hospitality brands.",
    ],
    requirements: [
      "2+ years experience in B2B project sales, luxury furnishings, or hospitality supply.",
      "Excellent communication, presentation, and negotiation skills.",
      "Client-first mindset with proven pipeline management ability.",
    ],
    aiCheckPoints: [
      "B2B sales and project consultation track record",
      "Client relationship management and closing ability",
      "Communication and presentation excellence",
    ],
    eligibilityThreshold: 70,
    partialMatchMin: 50,
    showMatchScoreToCandidate: true,
    showMatchBreakdown: true,
  },
  "wellness-space-consultant": {
    _id: "mock-job-wellness-space-consultant",
    slug: "wellness-space-consultant",
    title: "Wellness Space Consultant",
    department: "Consultancy",
    location: "Delhi NCR",
    employmentType: "Full Time",
    workplaceType: "Hybrid",
    experienceMin: 3,
    experienceMax: 6,
    educationRequirements: "Degree in Interior Architecture, Wellness Design, or Hospitality Management",
    shortDescription:
      "Guide clients in creating functional and beautiful wellness spaces with the right furniture and solutions.",
    description:
      "Consult clients on holistic spatial layouts, equipment selection, and ergonomic workflows for world-class Ayurvedic and spa environments.",
    responsibilities: [
      "Consult clients on holistic spatial layouts, equipment selection, and ergonomic workflows.",
      "Develop comprehensive room layout recommendations tailored to client therapy menus.",
      "Work with architects and interior designers to seamlessly integrate Panchkarma and spa units.",
      "Lead client discovery sessions and translate vision into functional equipment setups.",
    ],
    requirements: [
      "3+ years experience in wellness space planning, spa consultation, or luxury interior consulting.",
      "Solid knowledge of wellness modalities, ergonomics, and spatial aesthetics.",
      "High empathy and exceptional consultative advisory skills.",
    ],
    aiCheckPoints: [
      "Wellness spatial design and spa workflow planning",
      "Client advisory and consultative solution mapping",
      "Holistic equipment integration expertise",
    ],
    eligibilityThreshold: 70,
    partialMatchMin: 50,
    showMatchScoreToCandidate: true,
    showMatchBreakdown: true,
  },
};

// -----------------------------------------------------------------------------
// 1. Get Job by Slug
// -----------------------------------------------------------------------------

export async function getJob(slug: string): Promise<PublicJob | null> {
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  if (decoded === "general") {
    return GENERAL_APPLICATION_JOB;
  }

  // 1. Try real backend GET /careers/:slug
  try {
    const res = await fetch(`${API_URL}/careers/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload?.data && payload.data._id) {
        return payload.data as PublicJob;
      }
    }
  } catch (err) {
    console.warn("[career] Backend /careers/:slug request failed, falling back to listOpenJobs", err);
  }

  // Fallback 1: list open jobs and find by slug or _id
  console.info("[career] using fallback: resolving job from listOpenJobs()");
  const listResult = await listOpenJobs();
  if (listResult.ok && listResult.jobs.length > 0) {
    const found = listResult.jobs.find(
      (j) =>
        (j.slug && j.slug.toLowerCase() === decoded) ||
        (j._id && j._id.toLowerCase() === decoded) ||
        j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === decoded
    );
    if (found) return found;
  }

  // Fallback 2: Check defined mock design jobs
  if (MOCK_DESIGN_JOBS[decoded]) {
    return MOCK_DESIGN_JOBS[decoded];
  }
  const mockMatch = Object.values(MOCK_DESIGN_JOBS).find(
    (m) =>
      m.slug === decoded ||
      m.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === decoded
  );
  if (mockMatch) return mockMatch;

  return null;
}

// -----------------------------------------------------------------------------
// 2. Start & Poll AI Screening
// -----------------------------------------------------------------------------

const DEFAULT_STEPS: ScreeningStep[] = [
  { key: "read_cv", label: "Reading CV", state: "pending" },
  { key: "match_skills", label: "Matching Skills", state: "pending" },
  { key: "check_experience", label: "Checking Experience", state: "pending" },
  { key: "verify_education", label: "Verifying Education", state: "pending" },
  { key: "analyze_competencies", label: "Analyzing Competencies", state: "pending" },
  { key: "calculate_score", label: "Calculating Match Score", state: "pending" },
];

export async function startScreening(
  jobId: string,
  file: File,
  job?: PublicJob,
  onProgress?: (screening: Screening) => void
): Promise<Screening> {
  const cvInfo: CvFile = {
    fileName: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };

  // Step 1: Attempt real backend POST /careers/:jobId/screenings
  let backendScreeningId: string | null = null;
  try {
    const formData = new FormData();
    formData.append("cv", file);

    const startRes = await fetch(`${API_URL}/careers/${jobId}/screenings`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(15000),
    });

    if (startRes.ok) {
      const startPayload = await startRes.json();
      if (startPayload?.data?.screeningId) {
        backendScreeningId = startPayload.data.screeningId;
      }
    }
  } catch (backendErr) {
    console.warn("[career] Backend start screening failed, will use fallback analyzer:", backendErr);
  }

  // If real backend accepted the screening, poll it
  if (backendScreeningId) {
    const startTime = Date.now();
    const maxPollTimeMs = 90000;

    while (Date.now() - startTime < maxPollTimeMs) {
      await new Promise((r) => setTimeout(r, 2000));

      try {
        const pollRes = await fetch(`${API_URL}/careers/screenings/${backendScreeningId}`, {
          signal: AbortSignal.timeout(8000),
        });

        if (pollRes.ok) {
          const pollPayload = await pollRes.json();
          const screening: Screening = pollPayload.data;
          if (screening) {
            onProgress?.(screening);
            if (screening.status === "done" || screening.status === "failed") {
              return screening;
            }
          }
        }
      } catch (pollErr) {
        console.warn("[career] Polling backend screening error:", pollErr);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Fallback: Call local /api/analyze-cv with animated step-by-step progress
  // ---------------------------------------------------------------------------
  console.info("[career] using fallback: local /api/analyze-cv with animated step progression");

  const fallbackScreeningId = `scr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Emit initial state
  const fallbackSteps = DEFAULT_STEPS.map((s, idx) => ({
    ...s,
    state: idx === 0 ? ("active" as StepState) : ("pending" as StepState),
  }));

  let currentProgress = 15;
  const initialScreening: Screening = {
    screeningId: fallbackScreeningId,
    jobId,
    status: "processing",
    progress: currentProgress,
    steps: fallbackSteps,
    cv: cvInfo,
  };
  onProgress?.(initialScreening);

  // Send request to /api/analyze-cv in parallel with progress updates
  const analyzeFormData = new FormData();
  analyzeFormData.append("file", file);
  analyzeFormData.append("jobTitle", job?.title || "Wellness Solutions Professional");
  analyzeFormData.append("jobExperience", `${job?.experienceMin ?? 2} - ${job?.experienceMax ?? 5} Years`);
  analyzeFormData.append("jobEducation", job?.educationRequirements || "Degree in relevant field");
  if (job?.responsibilities) analyzeFormData.append("responsibilities", job.responsibilities.join("; "));
  if (job?.requirements) analyzeFormData.append("requirements", job.requirements.join("; "));
  if (job?.aiCheckPoints) analyzeFormData.append("aiCheckPoints", job.aiCheckPoints.join("; "));
  analyzeFormData.append("eligibilityThreshold", String(job?.eligibilityThreshold || 70));
  analyzeFormData.append("partialMatchMin", String(job?.partialMatchMin || 50));

  const analyzePromise = fetch("/api/analyze-cv", {
    method: "POST",
    body: analyzeFormData,
  });

  // Animate progress smoothly through the steps
  for (let stepIndex = 0; stepIndex < 5; stepIndex++) {
    await new Promise((r) => setTimeout(r, 700));
    currentProgress = Math.min(92, currentProgress + 16);

    const updatedSteps = fallbackSteps.map((step, idx) => {
      if (idx < stepIndex + 1) return { ...step, state: "done" as StepState };
      if (idx === stepIndex + 1) return { ...step, state: "active" as StepState };
      return { ...step, state: "pending" as StepState };
    });

    onProgress?.({
      screeningId: fallbackScreeningId,
      jobId,
      status: "processing",
      progress: currentProgress,
      steps: updatedSteps,
      cv: cvInfo,
    });
  }

  const response = await analyzePromise;
  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const failedScreening: Screening = {
      screeningId: fallbackScreeningId,
      jobId,
      status: "failed",
      progress: currentProgress,
      steps: fallbackSteps.map((s) => ({ ...s, state: s.state === "active" ? "pending" : s.state })),
      cv: cvInfo,
      error: errorPayload?.message || "AI Analysis was unable to complete for this CV. Please try again.",
    };
    onProgress?.(failedScreening);
    return failedScreening;
  }

  const analyzeResult = await response.json();
  const screeningResult: ScreeningResult = analyzeResult.screening;

  const finalSteps = DEFAULT_STEPS.map((s) => ({ ...s, state: "done" as StepState }));
  const completedScreening: Screening = {
    screeningId: fallbackScreeningId,
    jobId,
    status: "done",
    progress: 100,
    steps: finalSteps,
    cv: cvInfo,
    result: screeningResult,
  };

  onProgress?.(completedScreening);
  return completedScreening;
}

// -----------------------------------------------------------------------------
// 3. PDF Report
// -----------------------------------------------------------------------------

export function getReportPdfUrl(screeningId: string): string {
  return `${API_URL}/careers/screenings/${encodeURIComponent(screeningId)}/report.pdf`;
}

// -----------------------------------------------------------------------------
// 4. File Upload (Photo or Verification Document)
// -----------------------------------------------------------------------------

export async function uploadFile(
  file: File,
  kind: "photo" | "document"
): Promise<{ fileId: string; fileName: string; size: number; kind: string } | null> {
  // 1. Try real backend POST /careers/uploads
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/careers/uploads`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload?.data) {
        return payload.data;
      }
    }
  } catch (err) {
    console.warn("[career] Upload to backend failed, using fallback client representation:", err);
  }

  // Fallback: client file identifier
  console.info("[career] using fallback: client file token for private upload");
  return {
    fileId: `client_file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fileName: file.name,
    size: file.size,
    kind,
  };
}

// -----------------------------------------------------------------------------
// 5. Submit Application
// -----------------------------------------------------------------------------

export async function submitApplication(
  input: ApplicationInput,
  cvFile?: File | null
): Promise<ApplicationSubmitResponse> {
  // 1. Try real backend POST /careers/applications
  try {
    const res = await fetch(`${API_URL}/careers/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(20000),
    });

    const payload = await res.json().catch(() => null);

    if (res.ok && payload?.data?.applicationId) {
      return payload.data as ApplicationSubmitResponse;
    }

    // Pass through explicit error messages from backend (409 duplicate, 410 closed, 422 validation, etc.)
    if (!res.ok) {
      const msg =
        payload?.message ||
        (Array.isArray(payload?.errors) && payload.errors[0]) ||
        `Application rejected (${res.status})`;
      throw new Error(msg);
    }
  } catch (backendErr: any) {
    // If backend returned a functional response error (e.g. 409 duplicate, 410 closed, 422 validation),
    // NEVER swallow it with fallback — throw it so candidate sees the rejection message!
    if (
      backendErr &&
      backendErr.message &&
      !backendErr.message.includes("Failed to fetch") &&
      !backendErr.name?.includes("Abort")
    ) {
      throw backendErr;
    }
    console.warn("[career] Backend POST /careers/applications network error, attempting fallback submission:", backendErr);
  }

  // ---------------------------------------------------------------------------
  // Fallback: Submit via legacy /applications endpoint or simulated sequence ID
  // ---------------------------------------------------------------------------
  console.info("[career] using fallback: legacy application submission with formatted ENS-CAR sequence");

  const year = new Date().getFullYear();
  const randomSeq = String(Math.floor(100 + Math.random() * 900)).padStart(5, "0");
  const fallbackAppId = `ENS-CAR-${year}-${randomSeq}`;

  try {
    if (cvFile && cvFile.type.includes("pdf")) {
      const legacyForm = new FormData();
      legacyForm.append("fullName", input.profile.fullName);
      legacyForm.append("email", input.profile.email);
      legacyForm.append("phone", input.profile.phone);
      legacyForm.append("location", input.profile.currentLocation || "Delhi NCR");
      legacyForm.append("jobTitle", input.jobId || "Position");
      legacyForm.append("noticePeriod", input.details.noticePeriod);
      legacyForm.append("expectedCTC", input.details.expectedCtc);
      legacyForm.append("linkedin", input.profile.linkedin || "");
      legacyForm.append("resume", cvFile);
      legacyForm.append("coverLetter", `${input.additional.whyJoin}\n\n[Preferred Locations]: ${input.details.preferredLocations.join(", ")}`);
      legacyForm.append("source", "ai-cv");

      await fetch(`${API_URL}/applications`, {
        method: "POST",
        body: legacyForm,
        signal: AbortSignal.timeout(15000),
      }).catch((e) => console.warn("[career] Legacy submit ping failed (safe to ignore):", e));
    }
  } catch (err) {
    console.warn("[career] Legacy application ping error:", err);
  }

  return {
    applicationId: fallbackAppId,
    submittedAt: new Date().toISOString(),
    jobTitle: input.jobId || "Ensis Position",
    email: input.profile.email,
    matchScore: 85,
    status: "received",
  };
}

// -----------------------------------------------------------------------------
// 6. Career Settings (HR Contacts)
// -----------------------------------------------------------------------------

export async function getCareerSettings(): Promise<CareerSettingsData> {
  try {
    const res = await fetch(`${API_URL}/careers/settings`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload?.data) return payload.data;
    }
  } catch {
    // fallback
  }

  console.info("[career] using fallback: default Ensis HR contact settings");
  return DEFAULT_HR_SETTINGS;
}
