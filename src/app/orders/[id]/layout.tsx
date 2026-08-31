import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const title = "Order Confirmed | Ensis Wellness";
  const description =
    "Thank you for your order! Your premium Ayurvedic, Spa & Panchkarma equipment order has been confirmed. Track your order status, download invoice, and view delivery details.";
  const url = `${SITE_URL}/orders/${id}`;

  return {
    title,
    description,
    keywords: [
      "ensis order confirmed",
      "order status",
      "wellness equipment order",
      "ayurvedic equipment order tracking",
      "panchkarma equipment delivery",
      "spa equipment order",
      "download invoice",
      "ENSIS order details",
    ],
    robots: "noindex, nofollow",
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "ENSIS",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-image.webp` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.webp`],
    },
  };
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
