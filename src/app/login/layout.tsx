import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Login | Ensis",
  description: "Login to your Ensis account to track orders, manage your profile, and shop premium wellness furniture.",
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/login` },
  openGraph: {
    title: "Login | Ensis",
    description: "Login to your Ensis account to track orders, manage your profile, and shop premium wellness furniture.",
    url: `${SITE_URL}/login`,
    siteName: "Ensis",
    type: "website",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
