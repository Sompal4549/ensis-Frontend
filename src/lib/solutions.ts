import type { StaticImageData } from "next/image";
import {
  solutionsMap,
  services as defaultServices,
  process as defaultProcess,
  allSolutionCards,
  type SolutionData,
  type SolutionService,
  type SolutionProcess,
  type SolutionSolution,
  type SolutionStat,
} from "@/data/solutions";
import { API_URL, getImageUrl } from "@/lib/api/api";
import { metaDescription } from "@/lib/seo-text";

/** A city landing page as stored on a solution or product (see backend city-page.schema). */
export interface CityPage {
  _id?: string;
  city: string;
  slug: string;
  isActive: boolean;
  heading?: string;
  description?: string;
  intro?: string;
  metaTitle?: string;
  metaDescription?: string;
}

/** Solution document from GET /solutions and /solutions/:slug */
export interface ApiSolution {
  _id?: string;
  title?: string;
  slug: string;
  orderBy?: number;
  hero?: {
    eyebrow?: string;
    heading?: string[];
    description?: string;
    primaryCta?: { text?: string; url?: string };
    secondaryCta?: { text?: string; url?: string };
    image?: string;
    imageAlt?: string;
  };
  stats?: SolutionStat[];
  approach?: { eyebrow?: string; heading?: string; description?: string; image?: string; imageAlt?: string };
  spaces?: { eyebrow?: string; heading?: string; description?: string; items?: { title: string; text: string; icon: string }[] };
  services?: SolutionService[];
  process?: SolutionProcess[];
  cta?: { eyebrow?: string; heading?: string[]; description?: string; buttonText?: string; image?: string; imageAlt?: string };
  seo?: { metaTitle?: string; metaDescription?: string; metaKeywords?: string; canonical?: string };
  cities?: CityPage[];
}

type Img = StaticImageData | string;

/** Everything SolutionClient renders, already merged and city-adjusted. */
export interface ResolvedSolution {
  slug: string;
  title: string;
  hero: Omit<SolutionData["hero"], "heading" | "image"> & { heading: string[]; image: Img; primaryCtaUrl: string; secondaryCtaUrl: string };
  stats: SolutionStat[];
  approach: { eyebrow: string; heading: string[]; paragraphs: string[]; image: Img; imageAlt: string };
  spaces: SolutionData["spaces"];
  services: SolutionService[];
  process: SolutionProcess[];
  cta: Omit<SolutionData["cta"], "heading" | "image"> & { heading: string[]; image: Img };
  seo: { metaTitle: string; metaDescription: string; metaKeywords: string };
  cities: CityPage[];
  /** Set on a city page */
  city?: CityPage;
}

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;
const list = <T,>(value: T[] | undefined, fallback: T[]): T[] => (Array.isArray(value) && value.length ? value : fallback);
const lines = (value: string): string[] => value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const image = (value: unknown, fallback: Img | undefined): Img => (text(value) ? getImageUrl(text(value)) : fallback || "");
const titleCase = (value: string) => value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

export const fetchSolution = (slug: string) => getJson<ApiSolution>(`/solutions/${encodeURIComponent(slug)}`);
export const fetchSolutions = async () => (await getJson<ApiSolution[]>("/solutions")) || [];

/** Admin content from the API laid over the bundled defaults; null when neither knows the slug. */
export function resolveSolution(slug: string, api: ApiSolution | null): ResolvedSolution | null {
  const base = solutionsMap[slug];
  if (!base && !api) return null;
  const a = api || ({ slug } as ApiSolution);

  const eyebrow = text(a.hero?.eyebrow, base?.hero.eyebrow || titleCase(text(a.title, slug.replace(/-/g, " "))));
  const approachParagraphs = text(a.approach?.description)
    ? a.approach!.description!.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean)
    : base?.approach.paragraphs || [];

  return {
    slug,
    title: text(a.title, titleCase(eyebrow)),
    hero: {
      eyebrow,
      heading: list(a.hero?.heading?.filter(Boolean), base?.hero.heading || [eyebrow]),
      description: text(a.hero?.description, base?.hero.description),
      primaryCta: text(a.hero?.primaryCta?.text, base?.hero.primaryCta || "DISCUSS YOUR PROJECT"),
      primaryCtaUrl: text(a.hero?.primaryCta?.url, "/contact"),
      secondaryCta: text(a.hero?.secondaryCta?.text, base?.hero.secondaryCta || "EXPLORE OUR APPROACH"),
      secondaryCtaUrl: text(a.hero?.secondaryCta?.url, "#approach"),
      image: image(a.hero?.image, base?.hero.image),
      imageAlt: text(a.hero?.imageAlt, base?.hero.imageAlt || eyebrow),
    },
    stats: list(a.stats, base?.stats || []),
    approach: {
      eyebrow: text(a.approach?.eyebrow, base?.approach.eyebrow || "THE ENSIS APPROACH"),
      heading: text(a.approach?.heading) ? lines(a.approach!.heading!) : base?.approach.heading || [],
      paragraphs: approachParagraphs,
      image: image(a.approach?.image, base?.approach.image),
      imageAlt: text(a.approach?.imageAlt, base?.approach.imageAlt || eyebrow),
    },
    spaces: {
      eyebrow: text(a.spaces?.eyebrow, base?.spaces.eyebrow),
      heading: text(a.spaces?.heading, base?.spaces.heading),
      description: text(a.spaces?.description, base?.spaces.description),
      items: list(a.spaces?.items, base?.spaces.items || []),
    },
    services: list(a.services, defaultServices),
    process: list(a.process, defaultProcess),
    cta: {
      eyebrow: text(a.cta?.eyebrow, base?.cta.eyebrow),
      heading: list(a.cta?.heading?.filter(Boolean), base?.cta.heading || []),
      description: text(a.cta?.description, base?.cta.description),
      buttonText: text(a.cta?.buttonText, base?.cta.buttonText || "DISCUSS YOUR PROJECT"),
      image: image(a.cta?.image, base?.cta.image),
      imageAlt: text(a.cta?.imageAlt, base?.cta.imageAlt || eyebrow),
    },
    seo: {
      metaTitle: text(a.seo?.metaTitle),
      metaDescription: text(a.seo?.metaDescription),
      metaKeywords: text(a.seo?.metaKeywords),
    },
    cities: (a.cities || []).filter((c) => c.isActive !== false && c.slug),
  };
}

/** The solution re-worded for one city; null when that city page is missing or switched off. */
export function applyCity(solution: ResolvedSolution, citySlug: string): ResolvedSolution | null {
  const city = solution.cities.find((c) => c.slug === citySlug.toLowerCase());
  if (!city) return null;
  const heading = text(city.heading) ? lines(city.heading!) : [titleCase(solution.hero.eyebrow), `in ${city.city}.`];
  return {
    ...solution,
    city,
    hero: {
      ...solution.hero,
      eyebrow: `${solution.hero.eyebrow} · ${city.city.toUpperCase()}`,
      heading,
      description: text(
        city.description,
        `${solution.hero.description} ENSIS plans, equips and delivers ${solution.title.toLowerCase()} projects in ${city.city} and nearby areas.`
      ),
    },
  };
}

export function solutionMeta(solution: ResolvedSolution) {
  const city = solution.city;
  const title = city
    ? text(city.metaTitle, `${solution.title} in ${city.city} | ENSIS Wellness`)
    : text(solution.seo.metaTitle, `${solution.hero.eyebrow} | ENSIS Wellness`);
  // A city page leads with the city, so it never repeats the main page's description
  const description = metaDescription(
    city
      ? city.metaDescription && city.metaDescription.trim() !== solution.hero.description.trim() && city.metaDescription.trim() !== (solution.seo.metaDescription || "").trim()
        ? city.metaDescription
        : `${solution.title} in ${city.city} by ENSIS: ${solution.hero.description}`
      : text(solution.seo.metaDescription, solution.hero.description)
  );
  const path = `/solutions/${solution.slug}${city ? `/${city.slug}` : ""}`;
  return { title, description, path };
}

/** Cards for the other solutions, in admin order, from the API list (bundled cards as fallback). */
export function solutionCards(all: ApiSolution[], excludeSlug?: string): SolutionSolution[] {
  const fromApi = [...all]
    .sort((x, y) => (x.orderBy ?? 0) - (y.orderBy ?? 0))
    .map((s) => {
      const bundled = allSolutionCards.find((c) => c.href === `/solutions/${s.slug}`);
      return {
        image: text(s.hero?.image) ? getImageUrl(s.hero!.image!) : bundled?.image,
        title: text(s.hero?.eyebrow, bundled?.title || text(s.title, s.slug)),
        category: bundled?.category || text(s.title),
        href: `/solutions/${s.slug}`,
      };
    });
  const cards = fromApi.length ? fromApi : allSolutionCards;
  return cards.filter((c) => c.href !== `/solutions/${excludeSlug}`);
}
