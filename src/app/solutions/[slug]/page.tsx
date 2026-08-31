import { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutions, solutionsMap } from "@/data/solutions";
import { SITE_URL } from "@/lib/site";
import SolutionClient from "./SolutionClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/v1";

interface SolutionPageProps {
  params: Promise<{ slug: string }>;
}

async function getSolutionFromApi(slug: string) {
  try {
    const res = await fetch(`${API_URL}/solutions/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {}
  return null;
}

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;

  const apiSolution = await getSolutionFromApi(slug);
  const staticSolution = solutionsMap[slug];
  const solution = apiSolution || staticSolution;

  if (!solution) return { title: "Solution Not Found" };

  const canonical = `${SITE_URL}/solutions/${slug}`;
  const title = `${solution.hero.eyebrow} | ENSIS Wellness`;
  const description = solution.hero.description;

  return {
    title,
    description,
    keywords: [
      solution.hero.eyebrow,
      "ENSIS",
      "wellness setup",
      "ayurveda",
      "spa design",
      "interior design",
      "equipment integration",
    ],
    alternates: { canonical },
    robots: "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ENSIS",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: `${SITE_URL}/og-image.webp`,
          width: 1200,
          height: 630,
          alt: solution.hero.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.webp`],
    },
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;

  const apiSolution = await getSolutionFromApi(slug);
  const staticSolution = solutionsMap[slug];
  const solution = apiSolution || staticSolution;

  if (!solution) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution.hero.eyebrow,
    description: solution.hero.description,
    provider: {
      "@type": "Organization",
      name: "ENSIS",
      url: SITE_URL,
    },
    url: `${SITE_URL}/solutions/${slug}`,
    areaServed: "IN",
    serviceType: solution.hero.eyebrow,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolutionClient slug={slug} />
    </>
  );
}
