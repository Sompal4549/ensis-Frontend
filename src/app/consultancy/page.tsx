import ConsultancyCTA from '@/components/consultancy/ConsultancyCTA'
import ConsultancyHero from '@/components/consultancy/Hero'
import HowWeWork from '@/components/consultancy/HowWeWork'
import ConsultancyServices from '@/components/consultancy/Services'
import React from 'react'

const ConsultancyPage = () => {
  return (
    <>
    <ConsultancyHero />
    <ConsultancyServices />
    <HowWeWork />
    <ConsultancyCTA />
    </>
  )
}

export default ConsultancyPage