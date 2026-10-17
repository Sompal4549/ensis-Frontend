import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upload CV | Ensis AI Careers",
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/career/uploade_cv` },
};

export default function UploadCvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
