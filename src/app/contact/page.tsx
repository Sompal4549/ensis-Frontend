import ContactHero from '@/components/contact/ContactHero'
import ContactSection from '@/components/contact/ContactSection'
import SupportHighlights from '@/components/contact/SupportHightlights'
import React from 'react'

const Page = () => {
  return (
    <div>
        <ContactHero />
        <ContactSection />
        <SupportHighlights />
    </div>
  )
}

export default Page