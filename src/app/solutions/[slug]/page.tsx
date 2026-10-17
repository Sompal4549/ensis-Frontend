import { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutions } from "@/data/solutions";
import { buildSolutionMetadata, loadSolution, SolutionView } from "./solutionPage";

interface SolutionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildSolutionMetadata(await loadSolution(slug));
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = await loadSolution(slug);
  if (!solution) notFound();
  return <SolutionView solution={solution} />;
}
