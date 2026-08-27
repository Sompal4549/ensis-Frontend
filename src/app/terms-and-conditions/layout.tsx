import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | ENSIS - Panchkarma & Wellness Solutions",
  description:
    "Review the terms and conditions governing your use of the ENSIS website, products, services and business interactions. Policy updated May 2025.",
  keywords: [
    "ENSIS terms and conditions",
    "terms of service",
    "Ayurveda equipment terms",
    "wellness solutions terms",
    "Panchkarma equipment terms",
  ],
  openGraph: {
    title: "Terms & Conditions | ENSIS",
    description:
      "Review the terms and conditions governing your use of the ENSIS website, products and services.",
    url: "https://ensis.in/terms-and-conditions",
    siteName: "ENSIS",
    type: "website",
  },
  alternates: {
    canonical: "https://ensis.in/terms-and-conditions",
  },
};

export default function TermsConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
