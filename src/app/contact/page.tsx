import PageBuilder from '@/components/PageBuilder';
import dynamic from 'next/dynamic'
const ContactHero = dynamic(() => import('@/components/contact/ContactHero').then((mod) => mod.default));
const ContactSection = dynamic(() => import('@/components/contact/ContactSection').then((mod) => mod.default));
const SupportHighlights = dynamic(() => import('@/components/contact/SupportHightlights').then((mod) => mod.default));
import React from 'react'

const Page = () => {
  return (
    <div>
      <PageBuilder slug="contact"/>
    </div>
  )
}

export default Page