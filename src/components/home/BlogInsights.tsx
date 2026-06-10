import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../ui/Container';
import img7 from '@/assets/home/img-7.webp';

import panchkarma_2 from '@/assets/home/panchkarma_2.webp';
import img10 from '@/assets/home/img-10.webp';
import img16 from '@/assets/home/img-16.webp';
import img6 from '@/assets/home/img-6.webp';
import SubHeading from './SubHeading';
import GreenButton from '../ui/GreenButton';
import { getComponentContent, getImageUrl } from '@/app/lib/api';

const blogFallbackImages = [panchkarma_2, img6, img16, img10];
type BlogContent = {
  id?: string;
  subtitle: string;
  heading: string;
  buttonText: string;
  buttonPath: string;
  blogs: { id: string; title: string; date: string; description: string; link: string; image: string, ctaText: string}[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonPath: string;
  ctaBgImage: string;
}
const defaultContent = {
  subtitle: "FROM THE BLOG",
  heading: "Insights & Wellness Knowledge",
  buttonText: "VIEW ALL BLOGS",
  buttonPath: "/blog",
  blogs: [
    { id: "1", title: "Panchkarma Room Design Guide: Everything You Need to Know", image: "", date: "", description: "", link: "", ctaText:"" },
    { id: "2", title: "How to Choose the Right Spa Equipment for Your Business", image: "", date: "", description: "", link: "", ctaText:"" },
    { id: "3", title: "Steam Chamber Benefits for Detox & Relaxation Therapy", image: "", date: "", description: "", link: "", ctaText:"" },
    { id: "4", title: "Top 7 Ayurveda Wellness Trends in 2024", image: "", date: "", description: "", link: "", ctaText:"" },
  ],
  ctaHeading: "Ready to Build Your Dream Wellness Space?",
  ctaDescription: "Connect with our experts for personalized consultation and premium solutions.",
  ctaButtonText: "CONTACT US TODAY",
  ctaButtonPath: "/contact",
  ctaBgImage: "",
};

export const BlogInsights = async () => {
  const content = await getComponentContent<BlogContent>("home.blogInsights", defaultContent);
  const blogData: any = await getComponentContent("blog.allBlogs", defaultContent.blogs);

  // Extract the actual blog array from the API response object
  // Based on your console.log, it resides in 'blogData.blogs'
  const displayBlogs = blogData?.blogs || (Array.isArray(blogData) ? blogData : defaultContent.blogs);

  return (
    <section className="bg-[#fbf8f2]">
      <Container>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <div className="grid gap-6 md:items-start">
            <div>
              <SubHeading className=' text-black' text={content.subtitle} />
              <h2 className="mt-2 font-serif text-xl leading-tight text-[#1f261b] md:text-2xl font-semibold">{content.heading}</h2>
              <Link href={content.buttonPath} className="mt-6 inline-flex items-center gap-4 border-2 border-[#d7cbbd] bg-white px-3 py-2 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:bg-[#f3eee6] rounded-md">
                {content.buttonText} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {displayBlogs.slice(0, 4).map((blog: any, index: number) => {
            const blogImage = blog.image ? getImageUrl(blog.image) : blogFallbackImages[index] || panchkarma_2;
            // Ensure the link is valid; if link is just "/" or empty, use the ID
            const blogHref = blog.link && blog.link.length > 1 ? `/blog/${blog.link}` : `/blog/${blog.id}`;

            return (
              <Link href={blogHref} key={blog.id || index} className="group overflow-hidden border border-[#ded3c4] bg-white transition-transform hover:-translate-y-1 rounded-lg">
                <div className="relative aspect-[2.3/1] overflow-hidden bg-[#e5dccf]">
                  <Image src={blogImage} alt={blog.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" crossOrigin="anonymous" />
                </div>
                <div className="p-4 flex flex-col justify-between h-32">
                  <h3 className="text-lg font-bold text-[#1f261b] leading-[120%] line-clamp-2 font-serif">{blog.title}</h3>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#7c6a53]">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      <div className="relative overflow-hidden bg-[#1f261b] py-4 text-white">
        <Image src={content.ctaBgImage ? getImageUrl(content.ctaBgImage) : img7} alt="" fill style={{ objectFit: 'cover' }} className="opacity-25" />
        <Container className="relative z-10 flex flex-col justify-center gap-20 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl leading-tight font-semibold">{content.ctaHeading}</h2>
            <p className="mt-2 text-sm text-[#e5dccf]">{content.ctaDescription}</p>
          </div>
          <GreenButton path={content.ctaButtonPath} text={content.ctaButtonText} />
        </Container>
      </div>
    </section>
  );
};
