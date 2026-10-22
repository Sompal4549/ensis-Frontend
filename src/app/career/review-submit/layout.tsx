import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Review & Submit | Ensis AI Careers",
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/career/review-submit` },
};

export default function ReviewSubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
