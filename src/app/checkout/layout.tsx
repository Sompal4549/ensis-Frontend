import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Secure Checkout | Ensis Wellness",
  description:
    "Complete your order for premium Ayurvedic, Spa & Panchkarma equipment. SSL-secured payment with multiple payment options — Credit/Debit, UPI, Net Banking & Wallets.",
  keywords: [
    "ensis checkout",
    "secure payment",
    "wellness equipment order",
    "ayurvedic equipment buy online",
    "panchkarma equipment checkout",
    "spa equipment purchase",
    "SSL secure checkout",
    "Razorpay payment",
  ],
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/checkout` },
  openGraph: {
    title: "Secure Checkout | Ensis Wellness",
    description:
      "Complete your order for premium Ayurvedic, Spa & Panchkarma equipment. SSL-secured payment with multiple payment options.",
    url: `${SITE_URL}/checkout`,
    siteName: "ENSIS",
    type: "website",
    locale: "en_IN",
    images: [{ url: `${SITE_URL}/og-image.webp` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure Checkout | Ensis Wellness",
    description:
      "Complete your order for premium Ayurvedic, Spa & Panchkarma equipment. SSL-secured payment with multiple payment options.",
    images: [`${SITE_URL}/og-image.webp`],
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
