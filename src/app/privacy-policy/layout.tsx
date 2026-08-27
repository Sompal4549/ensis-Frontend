import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ENSIS - Panchkarma & Wellness Solutions",
  description:
    "Learn how ENSIS collects, uses and protects your personal information. Our privacy policy outlines data practices for visitors and partners.",
  keywords: [
    "ENSIS privacy policy",
    "data protection",
    "personal information",
    "privacy policy Ayurveda",
    "wellness company privacy",
  ],
  openGraph: {
    title: "Privacy Policy | ENSIS",
    description:
      "Learn how ENSIS collects, uses and protects your personal information.",
    url: "https://ensis.in/privacy-policy",
    siteName: "ENSIS",
    type: "website",
  },
  alternates: {
    canonical: "https://ensis.in/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
