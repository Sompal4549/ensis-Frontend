import { generateSeo } from "@/lib/api/seo";

// SEO comes from Pages & CMS (title, description, canonical, robots, Open Graph), like the other pages
export async function generateMetadata() {
  return generateSeo("privacy-policy");
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
