'use client'
import CtaBanner from '@/components/enquary/CtaBanner'
import EnquiryBannerAndForm from '@/components/enquary/EnquaryBannerAndForm'
import GetInTouchBanner from '@/components/enquary/GetInTouch'
import { fallbackEnquiryContent } from '@/data/enquaryBannerAndForm'
import { ctaBannerFallbackData } from '@/data/enquaryCtaBanner'
import React from 'react'
import { API_URL } from '../lib/api'

const EnquaryPage = () => {
  

  return (
    <div>
        <EnquiryBannerAndForm content={fallbackEnquiryContent}/>
        <GetInTouchBanner/>
        <CtaBanner data={ctaBannerFallbackData} />
    </div>
  )
}

export default EnquaryPage