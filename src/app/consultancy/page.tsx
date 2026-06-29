import ConsultancyCTA from '@/components/consultancy/ConsultancyCTA'
import ConsultancyHero from '@/components/consultancy/Hero'
import HowWeWork from '@/components/consultancy/HowWeWork'
import ConsultancyServices from '@/components/consultancy/Services'
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