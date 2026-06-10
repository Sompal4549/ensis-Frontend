import FacilitiesWeBuild from '@/components/turnkey/FacilitiesWeBuild'
import FeaturedProjects from '@/components/turnkey/FeaturedTrunkeyProjects'
import TurnkeyHero from '@/components/turnkey/HeroBanner'
import TrunkeyMeaning from '@/components/turnkey/TurnkeyMeaning'
import TurnkeySolutionsSection from '@/components/turnkey/TurnkeySolutions'
import WellnessCtaBanner from '@/components/turnkey/WellnessCtaBanner'
import WhyChoose from '@/components/turnkey/WhyChoose'

import React from 'react'
import { generateSeo } from "@/lib/api/seo";
import PageBuilder from '@/components/PageBuilder'

export async function generateMetadata() {
  return generateSeo("home");
}
const TurnkeySolutions = () => {
  return (
    <>
      <PageBuilder slug="turnkey"/>
    </>
  )
}

export default TurnkeySolutions