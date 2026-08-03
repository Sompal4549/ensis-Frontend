import { Metadata } from "next";
import { cache } from "react";
import { API_URL, getImageUrl } from "@/lib/api/api";

interface PageSeoData {
  pageName: string;
  slug: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string;
    canonical?: string;
    ogJson?: string;
    schema?: string;
  };
  robots?: string;
}

export interface SeoResult extends Metadata {
  schema: string | null;
}

// Single source of truth — fetched once per request (React cache dedupes
// identical calls within the same render pass), and revalidated on an
// interval instead of hitting the API on every single request.
const getPageData = cache(async (page: string): Promise<PageSeoData | null> => {
  try {
    const response = await fetch(`${API_URL}/pages/${page}`, {
      next: { revalidate: 300 }, // 5 min — tune as needed
    });

    const payload = await response.json();
    if (!response.ok || !payload.success || !payload.data) {
      return null;
    }

    return payload.data as PageSeoData;
  } catch {
    return null;
  }
});

export async function generateSeo(page: string): Promise<SeoResult> {
  const pageData = await getPageData(page);

  if (!pageData) {
    return {
      title: "Ensis - Premium Panchkarma & Wellness Spaces",
      description: "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions.",
      schema: null,
    };
  }

  const { seo, robots } = pageData;

  const keywordsArray = seo.metaKeywords
    ? seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  let ogExtra: Record<string, string> = {};
  if (seo.ogJson) {
    try { ogExtra = JSON.parse(seo.ogJson); } catch { }
  }

  const ogImage = ogExtra["og:image"] || "";

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: keywordsArray,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    robots: robots || "index, follow",
    openGraph: {
      title: ogExtra["og:title"] || seo.metaTitle,
      description: ogExtra["og:description"] || seo.metaDescription,
      url: ogExtra["og:url"] || undefined,
      siteName: ogExtra["og:site_name"] || undefined,
      type: (ogExtra["og:type"] as "website" | "article") || "website",
      images: ogImage ? [{ url: getImageUrl(ogImage) }] : [],
    },
    schema: seo.schema || null,
  };
}

export async function generateSchema(page: string): Promise<string | null> {
  const pageData = await getPageData(page);
  return pageData?.seo?.schema || null;
}