import React from 'react'
import PageBuilder from '@/components/PageBuilder'
import { generateSeo } from '@/lib/api/seo'

export async function generateMetadata() {
  return generateSeo("career");
}

const CareerPage = () => {
  return (
    <div>
         <PageBuilder slug="career" />
    </div>
  )
}

export default CareerPage
