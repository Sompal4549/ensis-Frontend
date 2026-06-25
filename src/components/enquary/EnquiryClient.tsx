"use client"

import React, { useState, useEffect } from 'react'
import RenderEnquirySections from "@/components/enquary/RenderEnquirySections";
import { API_URL } from '@/lib/api/api';

const EnquiryClient = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/component-content/page/enquiry`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (json.status === "success" && Array.isArray(json.data)) {
          // Sort sections by index if available, otherwise maintain original order
          const sortedData = json.data.sort((a: any, b: any) => (a.index || 0) - (b.index || 0));
          setSections(sortedData);
        } else {
          setError("Invalid data format from API.");
        }
      } catch (err: any) {
        console.error("Error fetching enquiry page data:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading enquiry page...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-[#f7f1e3]">
      {sections.map((section) => (
        <RenderEnquirySections key={section._id} section={section} />
      ))}
    </div>
  )
}

export default EnquiryClient;