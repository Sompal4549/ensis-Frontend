import dynamic from "next/dynamic";
import { generateSeo } from "@/lib/api/seo";
import PageBuilder from "@/components/PageBuilder";

export async function generateMetadata() {
  return generateSeo("about");
}

export default function About() {
  return <PageBuilder slug="about" />;
}