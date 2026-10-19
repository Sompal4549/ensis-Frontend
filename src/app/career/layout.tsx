import React from "react";
import { generateSeo } from "@/lib/api/seo";

export async function generateMetadata() {
  return generateSeo("career");
}

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
