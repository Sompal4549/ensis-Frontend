import { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildSolutionMetadata, loadSolution, SolutionView } from "../solutionPage";

interface SolutionCityPageProps {
  params: Promise<{ slug: string; city: string }>;
}

// City pages are added from the admin, so they are rendered on demand (cached for 60s by the fetch)
export const dynamicParams = true;

export async function generateMetadata({ params }: SolutionCityPageProps): Promise<Metadata> {
  const { slug, city } = await params;
  return buildSolutionMetadata(await loadSolution(slug, city));
}

export default async function SolutionCityPage({ params }: SolutionCityPageProps) {
  const { slug, city } = await params;
  const solution = await loadSolution(slug, city);
  if (!solution) notFound();
  return <SolutionView solution={solution} />;
}
