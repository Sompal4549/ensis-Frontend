"use client"

import React, { useState, useEffect } from 'react'
import RenderEnquirySections from "@/components/enquary/RenderEnquirySections";
import { API_URL } from '@/lib/api/api';
import { staticEnquirySections } from '@/data/enquiryPage';

const EnquiryClient = () => {
  const [sections, setSections] = useState<any[]>(staticEnquirySections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/component-content/page/enquiry`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (Boolean(json.success || json.status === "success") && Array.isArray(json.data) && json.data.length > 0) {
          const sortedData = json.data.sort((a: any, b: any) => (a.index || 0) - (b.index || 0));
          setSections(sortedData);
        }
      } catch (err: any) {
        console.error("Error fetching enquiry page data, using static data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading enquiry page...</div>;

  return (
    <div className="bg-[#f7f1e3]">
      {sections.map((section) => (
        <RenderEnquirySections key={section._id} section={section} />
      ))}
    </div>
  )
}

export default EnquiryClient;