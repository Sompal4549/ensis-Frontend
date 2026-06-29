import { generateSeo } from "@/lib/api/seo";
import PageBuilder from "@/components/PageBuilder";

export async function generateMetadata() {
  return generateSeo("home");
}

export default function HomePage() {
  return <PageBuilder slug="home" />;
}