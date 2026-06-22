import React from "react";
import { generateSeo } from "@/lib/api/seo";
import ProjectsClient from "@/components/projects-and-clients/ProjectsClient";
import PageBuilder from "@/components/PageBuilder";

export async function generateMetadata() {
  return generateSeo("projects-and-clients");
}

export default function ProjectsPage() {
    return (
     <>
  <PageBuilder slug="projects" />
     </>
    );
}