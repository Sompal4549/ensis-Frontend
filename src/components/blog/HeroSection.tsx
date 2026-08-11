import Image from "next/image";
import blogHero from "@/assets/blog/blog.webp"; // replace with your image
import { Container } from "../ui/Container";
import blog_decoration from "@/assets/icons/blog_decoration_1.webp"
import StatsStrip from "./BlogStatsStrip";


export default function BlogHeroSection({ sectionContent }: { sectionContent: any }) {
  return (
    <section className="w-full bg-[#f8f1e7] overflow-visible relative mb-0 md:mb-20">
      <div className="relative">
      {/* Background Image — clipped in its own layer so the outer
          section can stay overflow-visible for StatsStrip overlap */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <Image
          src={blogHero}
          alt="Spa wellness"
          fill
          priority
          className="object-fill object-center"
        />
      </div>

      <Container className="grid pt-24 md:pt-0 md:min-h-[calc(100vh-146px)] min-h-[550px] grid-cols-1 lg:grid-cols-2 relative z-20 items-center">
        {/* Left Content */}
        <div className="sm:py-8 lg:py-14">
          <div className="max-w-[480px] flex flex-col items-center justify-center">

            {/* Heading */}
            <h1 className="text-[#1f3b1f] text-center">
              {sectionContent.heading}
            </h1>

            {/* Small Ornament */}
            <div className="mt-5 flex items-center gap-4">
              <div className="flex gap-[3px]">
                <Image alt="blog decoration" src={blog_decoration} height={25} width={320} />
              </div>
            </div>

            {/* Subtitle */}
            <h2 className="mt-4  text-[24px] italic leading-relaxed text-[#a7652a] sm:text-[30px]">
              {sectionContent.title}
            </h2>

            {/* Description */}
            <p className="mt-4 max-w-[420px] text-base leading-6 text-[#2d2d2d]">
              Curated perspectives on spa, wellness,
              <br className="hidden sm:block" />
              and timeless healing traditions.
            </p>
          </div>
        </div>
      </Container>
      </div>

      <StatsStrip />
    </section>
  );
}