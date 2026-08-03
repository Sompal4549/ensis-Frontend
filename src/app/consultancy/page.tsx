import PageBuilder from '@/components/PageBuilder'
import { generateSeo } from '@/lib/api/seo'
import React from 'react'
export async function generateMetadata() {
  return generateSeo("consultancy");
}
const ConsultancyPage = () => {
  return (
   <PageBuilder slug="consultancy" />
  )
}

export default ConsultancyPage
