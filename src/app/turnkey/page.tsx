import FacilitiesWeBuild from '@/components/turnkey/FacilitiesWeBuild'
import FeaturedProjects from '@/components/turnkey/FeaturedTrunkeyProjects'
import TurnkeyHero from '@/components/turnkey/HeroBanner'
import TrunkeyMeaning from '@/components/turnkey/TurnkeyMeaning'
import TurnkeySolutionsSection from '@/components/turnkey/TurnkeySolutions'
import WellnessCtaBanner from '@/components/turnkey/WellnessCtaBanner'
import WhyChoose from '@/components/turnkey/WhyChoose'

import React from 'react'

const TurnkeySolutions = () => {
  return (
    <>
   <TurnkeyHero/>
   <TrunkeyMeaning/>
   <TurnkeySolutionsSection/>
   <FacilitiesWeBuild/>
   <WhyChoose />
   <FeaturedProjects/>
   <WellnessCtaBanner/>
    </>
  )
}

export default TurnkeySolutions