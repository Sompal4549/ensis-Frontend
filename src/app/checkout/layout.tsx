import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  alternates: { canonical: `${SITE_URL}/checkout` },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
