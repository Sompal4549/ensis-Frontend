import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Register | Ensis",
  description: "Create your Ensis account to shop premium wellness furniture, track orders, and access exclusive offers.",
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/register` },
  openGraph: {
    title: "Register | Ensis",
    description: "Create your Ensis account to shop premium wellness furniture, track orders, and access exclusive offers.",
    url: `${SITE_URL}/register`,
    siteName: "Ensis",
    type: "website",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
