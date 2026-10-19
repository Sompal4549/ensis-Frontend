/**
 * Career redesign data layer — shapes follow CAREER-REDESIGN-CONTRACT.md at the repo root.
 * Job lists never fall back to bundled data: when the API fails the page shows its empty state.
 */
import { API_URL, getComponentContent } from "@/lib/api/api";

export type PublicJob = {
  _id: string;
  slug?: string;
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  type?: string; // older records
  workplaceType?: string;
  experienceMin?: number;
  experienceMax?: number;
  experience?: string; // older records
  educationRequirements?: string;
  shortDescription?: string;
  coverImage?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  aiCheckPoints?: string[];
  eligibilityThreshold?: number;
  partialMatchMin?: number;
  showMatchScoreToCandidate?: boolean;
  showMatchBreakdown?: boolean;
  featuredJob?: boolean;
  createdAt?: string;
  applicationClosingDate?: string;
};

export type CareerIconName = "leaf" | "users" | "growth" | "heart" | "bulb" | "briefcase";

export type CareerContent = {
  banner: {
    eyebrow: string;
    headingLines: string[];
    highlight: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    /** Full-width hero background (design banner by default) */
    backgroundImage: string;
    highlights: { icon: CareerIconName; label: string }[];
  };
  openings: { eyebrow: string; heading: string; highlight: string; description: string; viewAllText: string };
  emptyState: { title: string; text: string; quote: string };
  whyWork: { eyebrow: string; heading: string; description: string; items: { icon: CareerIconName; title: string; text: string }[] };
  life: { eyebrow: string; heading: string; description: string; images: { image: string; alt: string }[]; tileText: string };
  talent: { heading: string; text: string; buttonText: string };
};

export const CAREER_DEFAULTS: CareerContent = {
  banner: {
    eyebrow: "Careers at Ensis",
    headingLines: ["Design Spaces", "for a Healthier"],
    highlight: "Tomorrow",
    description:
      "Be a part of a passionate team that designs and delivers wellness furniture and solutions for spas, wellness centers and healthcare spaces across the world.",
    ctaText: "Explore Opportunities",
    ctaHref: "#openings",
    backgroundImage: "",
    highlights: [
      { icon: "leaf", label: "Meaningful Work" },
      { icon: "users", label: "Collaborative Team" },
      { icon: "growth", label: "Growth Opportunities" },
      { icon: "heart", label: "Real Impact on Lives" },
    ],
  },
  openings: {
    eyebrow: "Current Openings",
    heading: "Explore",
    highlight: "Opportunities",
    description:
      "Join our team and contribute to creating inspiring wellness spaces through innovative furniture, design and customer-focused solutions.",
    viewAllText: "View all roles",
  },
  emptyState: {
    title: "No Open Positions at the Moment",
    text: "We appreciate your interest in being a part of ENSIS. Please check back soon for new opportunities.",
    quote: "Together, we create wellness spaces for a healthier tomorrow.",
  },
  whyWork: {
    eyebrow: "Why Work with Ensis",
    heading: "A Career with Purpose",
    description:
      "At ENSIS, you will be part of a passionate and collaborative environment where design, innovation and wellbeing come together to create spaces that make a real difference.",
    items: [
      { icon: "leaf", title: "Purpose-Driven Work", text: "Contribute to wellness spaces that enhance people's lives." },
      { icon: "users", title: "Supportive Team Environment", text: "Collaborate with talented and driven colleagues across design, manufacturing, sales and operations." },
      { icon: "growth", title: "Learning & Growth", text: "Enhance your skills with continuous learning and exposure to global markets." },
      { icon: "heart", title: "Better Spaces, Better Lives", text: "Be part of a mission that improves how people live, work and heal." },
    ],
  },
  life: {
    eyebrow: "Life at Ensis",
    heading: "People. Ideas. Better Spaces.",
    description: "",
    images: [],
    tileText: "Healing People Enriching Lives",
  },
  talent: {
    heading: "Don't See the Right Role?",
    text: "We are always open to connecting with passionate and talented professionals. Share your profile with us and we will get in touch when a suitable opportunity arises.",
    buttonText: "Share Your Profile",
  },
};

const merge = <T extends object>(defaults: T, saved: Partial<T> | null | undefined): T => {
  const out = { ...defaults } as Record<string, unknown>;
  for (const [key, value] of Object.entries(saved || {})) {
    // Empty strings / empty lists from a half-filled CMS keep the design default
    if (value === "" || value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as T;
};

/** Career page texts from Pages & CMS (contract §2), falling back to the design defaults per field */
export async function getCareerContent(): Promise<CareerContent> {
  const [banner, openings, emptyState, whyWork, life, talent] = await Promise.all([
    getComponentContent<Partial<CareerContent["banner"]>>("career.banner", {}),
    // career.section held a different section in the old design, so openings use their own key
    getComponentContent<Partial<CareerContent["openings"]>>("career.openings", {}),
    getComponentContent<Partial<CareerContent["emptyState"]>>("career.emptyState", {}),
    getComponentContent<Partial<CareerContent["whyWork"]>>("career.whyWork", {}),
    getComponentContent<Partial<CareerContent["life"]>>("career.lifeAtEnsis", {}),
    getComponentContent<Partial<CareerContent["talent"]>>("career.talentCommunity", {}),
  ]);
  return {
    banner: merge(CAREER_DEFAULTS.banner, banner),
    openings: merge(CAREER_DEFAULTS.openings, openings),
    emptyState: merge(CAREER_DEFAULTS.emptyState, emptyState),
    whyWork: merge(CAREER_DEFAULTS.whyWork, whyWork),
    life: merge(CAREER_DEFAULTS.life, life),
    talent: merge(CAREER_DEFAULTS.talent, talent),
  };
}

/** Open jobs. `ok:false` means the API could not be reached — never replaced with bundled jobs. */
export async function listOpenJobs(): Promise<{ ok: boolean; jobs: PublicJob[] }> {
  try {
    const res = await fetch(`${API_URL}/careers`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, jobs: [] };
    const payload = await res.json();
    const jobs: PublicJob[] = Array.isArray(payload?.data) ? payload.data : [];
    return { ok: true, jobs: jobs.filter((job) => job && job.title) };
  } catch {
    return { ok: false, jobs: [] };
  }
}

export const jobHref = (job: PublicJob) => `/career/${encodeURIComponent(job.slug || job._id)}`;
export const jobType = (job: PublicJob) => job.employmentType || job.type || "Full Time";
export const jobLocation = (job: PublicJob) => job.location || "Delhi NCR";
export const jobExperience = (job: PublicJob) =>
  job.experienceMin !== undefined && job.experienceMax !== undefined
    ? `${job.experienceMin} – ${job.experienceMax} Years`
    : job.experience || "";

export const plain = (html?: string) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const jobSummary = (job: PublicJob, max = 150) => {
  const text = plain(job.shortDescription || job.description);
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
};
