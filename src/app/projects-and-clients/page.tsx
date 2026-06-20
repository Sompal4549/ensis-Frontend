import React from "react";
import { generateSeo } from "@/lib/api/seo";
import ProjectsClient from "@/components/projects-and-clients/ProjectsClient";

export async function generateMetadata() {
  return generateSeo("projects-and-clients");
}

export default function ProjectsPage() {
  return <ProjectsClient />;
}