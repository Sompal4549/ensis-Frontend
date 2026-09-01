import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "My Orders | Ensis Wellness",
  description:
    "Track and manage your Ensis Wellness orders. View order status, payment details, and shipping information for your Ayurvedic, Spa & Panchkarma equipment.",
  keywords: [
    "ensis orders",
    "my orders",
    "order history",
    "wellness equipment orders",
    "panchkarma equipment order status",
  ],
  openGraph: {
    title: "My Orders | Ensis Wellness",
    description:
      "Track and manage your Ensis Wellness orders. View order status, payment details, and shipping information.",
    url: `${SITE_URL}/orders`,
    siteName: "Ensis Wellness",
    type: "website",
  },
  alternates: { canonical: `${SITE_URL}/orders` },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
