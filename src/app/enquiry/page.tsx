import React from 'react'
import { generateSeo } from '@/lib/api/seo'
import EnquiryClient from "@/components/enquary/EnquiryClient";

export async function generateMetadata() {
  return generateSeo("enquiry");
}

const EnquaryPage = () => {
  return <EnquiryClient />;
}
export default EnquaryPage