"use client";

import React, { useEffect, useState } from "react";
import RenderSections from "@/components/turnkey/RenderSections";
import { API_URL } from "@/lib/api/api";

const ProjectsPage = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/content/projects`);
        const json = await response.json();
        if (json.status === "success") {
          // Sorting by the index provided in your JSON
          const sortedData = json.data.sort((a: any, b: any) => a.index - b.index);
          setSections(sortedData);
        }
      } catch (error) {
        console.error("Error fetching projects data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="bg-[#f7f1e3]">
      {sections.map((section: any) => (
        <RenderSections key={section._id} section={section} />
      ))}
    </main>
  );
};

export default ProjectsPage;