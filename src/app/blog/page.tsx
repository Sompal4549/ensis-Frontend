import dynamic from 'next/dynamic'
const BlogSection = dynamic(() => import('@/components/blog/BlogSection').then((mod) => mod.default));
const BlogHeroSection = dynamic(() => import('@/components/blog/HeroSection').then((mod) => mod.default));
const SupportSection = dynamic(() => import('@/components/blog/SupportSection').then((mod) => mod.default));
const WellnessResources = dynamic(() => import('@/components/blog/WellnessResource').then((mod) => mod.default));
import NewsletterCard from '@/components/blog/NewsletterCard';
import React from 'react'
import { generateSeo } from "@/lib/api/seo";

export async function generateMetadata() {
  return generateSeo("home");
}
const Blog = () => {
  return (
    <div>
        <BlogHeroSection/>
        <BlogSection/>
        <WellnessResources/>
      <NewsletterCard />

        <SupportSection/>
    </div>
  )
}

export default Blog