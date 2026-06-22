import React from 'react'
import BlogDetailBanner from '@/components/blog/BlogDetailBanner'
import NewsletterCard from '@/components/blog/NewsletterCard'
import BlogDetailNewsletter from '@/components/blog/BlogDetailNewsLetter'
import BlogDetailArticleLayout from '@/components/blog/BlogDetailArticleLayout'

const BlogDetail = () => {
  return (
    <>
    <BlogDetailBanner/>
    <BlogDetailArticleLayout/>
    <BlogDetailNewsletter/>
    </>
  )
}

export default BlogDetail