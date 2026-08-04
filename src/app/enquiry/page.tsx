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
      <SchemaScript page="enquiry" />
      <EnquiryClient />
    </>
  );
}
export default EnquaryPage