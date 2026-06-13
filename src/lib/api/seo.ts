import { Metadata } from "next";
import { API_URL, getImageUrl } from "@/lib/api/api";

interface PageSeoData {
  pageName: string;
  slug: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string;
    h1: string;
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  robots?: string;
}

export async function generateSeo(
  page: string
): Promise<Metadata> {
  try {
    const slugName = page === "home" ? "home" : page;
    const response = await fetch(
      `${API_URL}/pages/${slugName}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    const payload = await response.json();
    if (!response.ok || !payload.success || !payload.data) {
      throw new Error("Page not found");
    }

    const pageData: PageSeoData = payload.data;
    const { seo, robots } = pageData;

    const keywordsArray = seo.metaKeywords
      ? seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const ogImageSrc = seo.ogImage ? getImageUrl(seo.ogImage) : "";

    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: keywordsArray,
      alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
      robots: robots || "index, follow",
      openGraph: {
        title: seo.ogTitle || seo.metaTitle,
        description: seo.ogDescription || seo.metaDescription,
        images: ogImageSrc ? [ogImageSrc] : [],
      },
    };
  } catch {
    return {
      title: "Ensis - Premium Panchkarma & Wellness Spaces",
      description: "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions.",
    };
  }
}