
import React from 'react'
import { generateSeo } from "@/lib/api/seo";
import PageBuilder from '@/components/PageBuilder'

export async function generateMetadata() {
  return generateSeo("turnkey");
}
const TurnkeySolutions = () => {
  return (
    <>
      <PageBuilder slug="turnkey"/>
    </>
  )
}

export default TurnkeySolutions