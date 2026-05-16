import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../ui/Container';
import img7 from '@/assets/home/img-7.webp';

import img3 from '@/assets/home/img-3.webp';
import img4 from '@/assets/home/img-4.webp';
import img5 from '@/assets/home/img-5.webp';
import img6 from '@/assets/home/img-6.webp';

export const BlogInsights = () => {
  const blogs = [
    {
      title: "Panchkarma Room Design Guide: Everything You Need to Know",
      image: img3
    },
    {
      title: "How to Choose the Right Spa Equipment for Your Business",
      image: img4
    },
    {
      title: "Steam Chamber Benefits for Detox & Relaxation Therapy",
      image: img5
    },
    {
      title: "Top 7 Ayurveda Wellness Trends in 2024",
      image: img6
    }
  ];

  return (
    <section className="bg-[#fbf8f2]">
      <Container>
    

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              <div className="grid gap-6 md:grid-cols-[0.45fr_1fr] md:items-start">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#8d6a3a]">FROM THE BLOG</span>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-[#1f261b] md:text-4xl">Insights & Wellness Knowledge</h2>
            <Link href="/blog" className="mt-6 inline-flex items-center gap-2 border border-[#d7cbbd] bg-white px-6 py-3 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:bg-[#f3eee6]">
              VIEW ALL BLOGS <ArrowRight size={16} />
            </Link>
          </div>
        </div>
          {blogs.map((blog, index) => (
            <Link href={`/blog/${index}`} key={index} className="group overflow-hidden border border-[#ded3c4] bg-white transition-transform hover:-translate-y-1">
              <div className="relative aspect-[1.55/1] overflow-hidden bg-[#e5dccf]">
                <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
              </div>
              <div className="p-5">
                <h3 className="min-h-[54px] text-base font-bold leading-6 text-[#1f261b]">{blog.title}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#7c6a53]">Read More <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
      
      <div className="relative overflow-hidden bg-[#1f261b] py-4 text-white">
        <Image src={img7} alt="" fill style={{ objectFit: 'cover' }} className="opacity-25" />
        <Container className="relative z-10 flex flex-col justify-center gap-20 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-3xl leading-tight">Ready to Build Your Dream Wellness Space?</h2>
            <p className="mt-2 text-sm text-[#e5dccf]">Connect with our experts for personalized consultation and premium solutions.</p>
          </div>
          <button className="w-fit bg-[#d0a965] px-7 py-3 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:bg-[#ead0a0]">CONTACT US TODAY</button>
        </Container>
      </div>
    </section>
  );
};
