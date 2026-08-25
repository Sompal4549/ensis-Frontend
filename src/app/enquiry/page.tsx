import React from 'react'
import { generateSeo } from '@/lib/api/seo'
import EnquiryClient from "@/components/enquary/EnquiryClient";
import SchemaScript from "@/components/SchemaScript";

export async function generateMetadata() {
  return generateSeo("enquiry");
}

const EnquaryPage = () => {
  return (
    <>
      <h1 className="sr-only">Enquiry</h1>
      <SchemaScript page="enquiry" />
      <EnquiryClient />
    </>
  );
}
export default EnquaryPage