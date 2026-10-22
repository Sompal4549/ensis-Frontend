import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Application Form | Ensis AI Careers",
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/career/application-form` },
};

export default function ApplicationFormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
