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
      cache: "force-cache",
      next: { revalidate: 300 }, // 5 min — tune as needed
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!payload.success || !payload.data) {
      return null;
    }

    return payload.data as PageSeoData;
  } catch {
    return null;
  }
});

export async function generateSeo(page: string): Promise<SeoResult> {
  const pageData = await getPageData(page);

  const fallbackTitle = "Ensis - Premium Panchkarma & Wellness Spaces";
  const fallbackDescription =
    "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions.";

  if (!pageData) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      robots: "index, follow",
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        type: "website",
      },
      schema: null,
    };
  }

  const { seo, robots } = pageData;

  const keywordsArray = seo.metaKeywords
    ? seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  let ogExtra: Record<string, string> = {};
  if (seo.ogJson) {
    try {
      const parsed: unknown = JSON.parse(seo.ogJson);
      if (parsed && typeof parsed === "object") {
        ogExtra = parsed as Record<string, string>;
      }
    } catch { }
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
      images: ogImage ? [{ url: getImageUrl(ogImage) }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogExtra["twitter:title"] || seo.metaTitle,
      description: ogExtra["twitter:description"] || seo.metaDescription,
      images: ogImage ? [getImageUrl(ogImage)] : undefined,
    },
    schema: seo.schema || null,
  };
}

export async function generateSchema(page: string): Promise<string | null> {
  const pageData = await getPageData(page);
  return pageData?.seo?.schema || null;
}

export interface AdvancedSeoData {
  sitemap?: {
    url?: string;
    autoGenerate?: boolean;
    excludePaths?: string;
  };
  robotsTxt?: {
    content?: string;
  };
  searchConsole?: {
    googleVerification?: string;
    bingVerification?: string;
  };
  analytics?: {
    gaId?: string;
    gtmId?: string;
    fbPixelId?: string;
    clarityId?: string;
  };
}

export const getAdvancedSeo = cache(
  async (): Promise<AdvancedSeoData | null> => {
    try {
      const response = await fetch(`${API_URL}/seo/advanced`, {
        cache: "force-cache",
        next: { revalidate: 3600 }, // 1 hour cache
      });

      if (!response.ok) {
        return null;
      }

      const json = await response.json();
      return json.success ? (json.data as AdvancedSeoData) : null;
    } catch {
      return null;
    }
  }
);