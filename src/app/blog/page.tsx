import dynamic from 'next/dynamic'
const BlogSection = dynamic(() => import('@/components/blog/BlogSection').then((mod) => mod.default));
const BlogHeroSection = dynamic(() => import('@/components/blog/HeroSection').then((mod) => mod.default));
const SupportSection = dynamic(() => import('@/components/blog/SupportSection').then((mod) => mod.default));
const WellnessResources = dynamic(() => import('@/components/blog/WellnessResource').then((mod) => mod.default));
import React from 'react'

const Blog = () => {
  return (
    <div>
        <BlogHeroSection/>
        <BlogSection/>
        <WellnessResources/>
        <SupportSection/>
    </div>
  )
}

export default Blog