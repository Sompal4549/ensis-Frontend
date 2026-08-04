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
import { getComponentContent, getImageUrl, blogApi } from '@/lib/api/api';

const blogFallbackImages = [panchkarma_2, img6, img16, img10];

const defaultContent = {
  subtitle: "FROM THE BLOG",
  heading: "Insights & Wellness Knowledge",
  buttonText: "VIEW ALL BLOGS",
  buttonPath: "/blog",
  ctaHeading: "Ready to Build Your Dream Wellness Space?",
  ctaDescription: "Connect with our experts for personalized consultation and premium solutions.",
  ctaButtonText: "CONTACT US TODAY",
  ctaButtonPath: "/contact",
  ctaBgImage: "",
};

export const BlogInsights = async ({ subtitle, heading, buttonText, buttonPath }: { subtitle: string; heading: string; buttonText: string; buttonPath: string }) => {
  const allBlogs = await blogApi.list();
  const contactData = await getComponentContent("home.readyToBuild", { ctaHeading: defaultContent.ctaHeading, ctaDescription: defaultContent.ctaDescription, ctaButtonText: defaultContent.ctaButtonText, ctaButtonPath: defaultContent.ctaButtonPath, ctaBgImage: defaultContent.ctaBgImage });

  const displayBlogs = Array.isArray(allBlogs) ? allBlogs : [];

  return (
    <section className="bg-[#fbf8f2]">
      <Container className="pb-4">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <div className="grid gap-6 md:items-start">
            <div>
              <SubHeading className=' text-black' text={subtitle} />
              <h2 className="mt-2 font-serif text-xl leading-tight text-[#1f261b] md:text-2xl font-semibold">{heading}</h2>
            <Link href={buttonPath} className="mt-2 inline-flex items-center gap-4 border-2 border-[#d7cbbd] bg-white px-3 py-2 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:bg-[#f3eee6] rounded-md">
                {buttonText} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {displayBlogs.slice(0, 4).map((blog: any, index: number) => {
            const blogImage = blog.bannerImage
              ? getImageUrl(blog.bannerImage)
              : blog.image
              ? getImageUrl(blog.image)
              : blogFallbackImages[index] || panchkarma_2;

            const blogHref = blog.slug ? `/blog/${blog.slug}` : `/blog/${blog._id || blog.id}`;

            return (
              <Link href={blogHref} key={blog._id || blog.id || index} className="group overflow-hidden border border-[#ded3c4] bg-white transition-transform hover:-translate-y-1 rounded-lg">
                <div className="relative aspect-[2.3/1] overflow-hidden bg-[#e5dccf]">
                  <Image src={blogImage} alt={blog.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" crossOrigin="anonymous" />
                </div>
                <div className="p-4 flex flex-col justify-between h-32">
                  <h3 className="text-lg font-bold text-[#1f261b] leading-[120%] line-clamp-2 font-serif">{blog.title}</h3>
                  <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-[#7c6a53]">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      <div className="relative overflow-hidden bg-[#1f261b] py-2 text-white">
        <Image src={contactData.ctaBgImage ? getImageUrl(contactData.ctaBgImage) : img7} alt="" fill style={{ objectFit: 'cover' }} className="opacity-25" />
        <Container className="relative z-10 flex flex-col justify-center gap-40 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl leading-tight font-semibold">{contactData.ctaHeading}</h2>
            <p className="mt-2 text-sm text-[#e5dccf]">{contactData.ctaDescription}</p>
          </div>
          <GreenButton path={contactData.ctaButtonPath} text={contactData.ctaButtonText} />
        </Container>
      </div>
    </section>
  );
};