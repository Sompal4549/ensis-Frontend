import { Metadata } from "next";

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export async function generateSeo(
  page: string
): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/seo/${page}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    const { data }: { data: SeoData } =
      await response.json();

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      openGraph: {
        title: data.ogTitle || data.title,
        description:
          data.ogDescription ||
          data.description,
        images: data.ogImage
          ? [data.ogImage]
          : [],
      },
    };
  } catch {
    return {
      title: "Default Title",
      description:
        "Default Description",
    };
  }
}