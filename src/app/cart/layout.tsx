import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your Cart | Ensis Wellness",
  description:
    "Review the Ayurvedic, Spa & Panchkarma equipment in your cart. Secure checkout and worldwide shipping from Ensis Wellness.",
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/cart` },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
