import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    robots: "noindex, nofollow",
    alternates: { canonical: `${SITE_URL}/orders/${id}` },
  };
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
