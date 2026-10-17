import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import {
  applyCity,
  fetchSolution,
  fetchSolutions,
  resolveSolution,
  solutionCards,
  solutionMeta,
  type ResolvedSolution,
} from "@/lib/solutions";
import SolutionClient from "./SolutionClient";

/** The solution (city-adjusted when citySlug is given), or null for a 404. */
export async function loadSolution(slug: string, citySlug?: string): Promise<ResolvedSolution | null> {
  const api = await fetchSolution(slug);
  // Once solutions are managed in the admin, one missing from the active list is switched off;
  // the bundled defaults only stand in while the database has no solutions at all.
  if (!api && (await fetchSolutions()).length > 0) return null;
  const solution = resolveSolution(slug, api);
  if (!solution) return null;
  return citySlug ? applyCity(solution, citySlug) : solution;
}

export function buildSolutionMetadata(solution: ResolvedSolution | null): Metadata {
  if (!solution) return { title: "Solution Not Found", robots: "noindex, follow" };
  const { title, description, path } = solutionMeta(solution);
  const canonical = `${SITE_URL}${path}`;
  const keywords = solution.seo.metaKeywords
    ? solution.seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [solution.hero.eyebrow, "ENSIS", "wellness setup", "ayurveda", "spa design", "interior design", "equipment integration"];
  if (solution.city) keywords.unshift(`${solution.title} in ${solution.city.city}`);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ENSIS",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-image.webp`, width: 1200, height: 630, alt: solution.hero.imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.webp`] },
  };
}

export async function SolutionView({ solution }: { solution: ResolvedSolution }) {
  const { path } = solutionMeta(solution);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution.city ? `${solution.title} in ${solution.city.city}` : solution.hero.eyebrow,
    description: solution.hero.description,
    provider: { "@type": "Organization", name: "ENSIS", url: SITE_URL },
    url: `${SITE_URL}${path}`,
    areaServed: solution.city ? { "@type": "City", name: solution.city.city } : "IN",
    serviceType: solution.title,
  };
  const cards = solutionCards(await fetchSolutions(), solution.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SolutionClient solution={solution} cards={cards} />
    </>
  );
}
