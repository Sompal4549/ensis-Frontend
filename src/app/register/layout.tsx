import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/register` },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
