"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";

interface RelatedBlog {
  _id?: string;
  slug?: string;
  title: string;
  category?: string;
  banner: {
    backgroundImage: string;
    backgroundImageAlt?: string;
    readingTime?: string;
  };
}

interface RelatedBlogsProps {
  allBlogs: RelatedBlog[];
}

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({ allBlogs }) => {
  return (
    <section className="bg-[#faf6ef] py-12 md:py-16">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1f2c25] md:text-3xl">
            You May Also Like
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-[#8d6a3a] transition-colors hover:text-[#C9972A]"
          >
            View All Articles
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allBlogs.map((blog) => (
            <Link
              key={blog._id || blog.slug}
              href={`/blog/${blog.slug}`}
              className="group block overflow-hidden rounded-md border border-[#e8e0d3] bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 w-full overflow-hidden md:h-48">
                <Image
                  src={blog?.banner?.backgroundImage}
                  alt={blog?.banner?.backgroundImageAlt || blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#C9972A]">
                  {blog.category}
                  {blog.banner.readingTime && (
                    <>
                      <span className="mx-1.5 text-[#1f2c25]/40">&bull;</span>
                      <span className="text-[#1f2c25]/70">
                        {blog.banner.readingTime}
                      </span>
                    </>
                  )}
                </p>

                <h3 className="mt-2 font-serif text-base leading-snug text-[#1f2c25] transition-colors group-hover:text-[#8d6a3a] md:text-lg">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default RelatedBlogs;