"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";

interface CtaBannerData {
  title: string;
  lotusImage: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bannerImage?: string;
}

interface CtaBannerProps {
  sectionContent: CtaBannerData;
}

const BlogDetailCtaBanner: React.FC<CtaBannerProps> = ({ sectionContent }) => {
  if (!sectionContent) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0f2e22]">
      {/* Full-width background image */}
      {sectionContent.bannerImage && (
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src={sectionContent.bannerImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Green fade — readable on the left, photo visible on the right */}

      <Container className="relative z-20">
        <div className="flex flex-col items-center justify-between gap-6 py-6 md:flex-row md:gap-8 md:py-7">
          {/* Left — lotus + copy */}
          <div className="flex items-center gap-4">
            {sectionContent.lotusImage && (
              <Image
                src={sectionContent.lotusImage}
                alt=""
                width={40}
                height={40}
                className="h-9 w-9 shrink-0 object-contain md:h-10 md:w-10"
              />
            )}

            <div>
              <h2 className=" text-lg leading-tight text-white sm:text-xl md:text-2xl">
                {sectionContent.title}
              </h2>
              {sectionContent.description && (
                <p className="mt-1 max-w-md text-base leading-snug text-white/70 sm:text-sm">
                  {sectionContent.description}
                </p>
              )}
            </div>
          </div>

          {/* Right — CTA button */}
          {sectionContent.buttonText && (
            <Link
              href={sectionContent.buttonLink || "#"}
              className="group inline-flex shrink-0 items-center gap-4 rounded-sm bg-[#C9972A] px-6 py-3 text-base font-bold uppercase tracking-wider text-[#0f2e22] transition-colors hover:bg-[#e8c766]"
            >
              {sectionContent.buttonText}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
};

export default BlogDetailCtaBanner;