import { Metadata } from "next";
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

interface SeoResult {
  metadata: Metadata;
  schema: string | null;
}

export async function generateSeo(page: string): Promise<SeoResult> {
  try {
    const response = await fetch(`${API_URL}/pages/${page}`, {
      next: { revalidate: 3600 },
    });

    const payload = await response.json();
    if (!response.ok || !payload.success || !payload.data) {
      throw new Error("Page not found");
    }

    const pageData: PageSeoData = payload.data;
    const { seo, robots } = pageData;

    const keywordsArray = seo.metaKeywords
      ? seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    let ogExtra: Record<string, string> = {};
    if (seo.ogJson) {
      try { ogExtra = JSON.parse(seo.ogJson); } catch { /* invalid json */ }
    }

    const ogImage = ogExtra["og:image"] || "";

    return {
      metadata: {
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
      },
      schema: seo.schema || null,
    };
  } catch {
    return {
      metadata: {
        title: "Ensis - Premium Panchkarma & Wellness Spaces",
        description: "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions.",
      },
      schema: null,
    };
  }
}