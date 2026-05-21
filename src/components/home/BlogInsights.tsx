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

export const BlogInsights = () => {
  const blogs = [
    {
      title: "Panchkarma Room Design Guide: Everything You Need to Know",
      image: panchkarma_2
    },
    {
      title: "How to Choose the Right Spa Equipment for Your Business",
      image: img6
    },
    {
      title: "Steam Chamber Benefits for Detox & Relaxation Therapy",
      image: img16
    },
    {
      title: "Top 7 Ayurveda Wellness Trends in 2024",
      image: img10
    }
  ];

  return (
    <section className="bg-[#fbf8f2]">
      <Container>


        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <div className="grid gap-6  md:items-start">
            <div>
              <SubHeading className=' text-[#8d6a3a]' text='FROM THE BLOG' />
              <h2 className="mt-2 font-serif text-xl leading-tight text-[#1f261b] md:text-2xl">Insights & Wellness Knowledge</h2>
              <Link href="/blog" className="mt-6 inline-flex items-center gap-2 border border-[#d7cbbd] bg-white px-6 py-3 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:bg-[#f3eee6]">
                VIEW ALL BLOGS <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {blogs.map((blog, index) => (
            <Link href={`/blog/${index}`} key={index} className="group overflow-hidden border border-[#ded3c4] bg-white transition-transform hover:-translate-y-1 rounded-lg">
              <div className="relative aspect-[1.55/1] overflow-hidden bg-[#e5dccf]">
                <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
              </div>
              <div className="p-5">
                <h3 className="min-h-[54px] text-base font-bold leading-6 text-[#1f261b]">{blog.title}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#7c6a53]">Read More <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      <div className="relative overflow-hidden bg-[#1f261b] py-4 text-white">
        <Image src={img7} alt="" fill style={{ objectFit: 'cover' }} className="opacity-25" />
        <Container className="relative z-10 flex flex-col justify-center gap-20 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl leading-tight">Ready to Build Your Dream Wellness Space?</h2>
            <p className="mt-2 text-sm text-[#e5dccf]">Connect with our experts for personalized consultation and premium solutions.</p>
          </div>
          <button className="w-fit bg-[#d0a965] px-7 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#ead0a0] rounded-md">CONTACT US TODAY</button>
        </Container>
      </div>
    </section>
  );
};
