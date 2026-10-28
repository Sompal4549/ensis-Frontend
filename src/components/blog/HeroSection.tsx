import Image from "next/image";
import blogHero from "@/assets/blog.png";
import { Container } from "../ui/Container";

const DEFAULT_DESCRIPTION =
  "Explore expert articles, wellness tips, Ayurvedic knowledge and industry insights to create better healing spaces.";

function stripHtml(value?: string): string {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function BlogHeroSection({ sectionContent }: { sectionContent: any }) {
  const data = sectionContent || {};

  const eyebrow = "OUR BLOG";
  const heading =
    data.heading && !data.heading.includes("Wisdom")
      ? data.heading.replace(/[\s,]+$/, "")
      : "Insights for a";
  const highlight = data.highlight || "Healthier Tomorrow";
  const rawDesc = stripHtml(data.description);
  const description =
    rawDesc && !rawDesc.includes("timeless")
      ? rawDesc
      : DEFAULT_DESCRIPTION;
  const backgroundImage = blogHero;

  return (
    <section className="relative overflow-hidden bg-[#fbf7f1]">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#fbf7f1] via-[#fbf7f1]/90 to-transparent lg:via-[#fbf7f1]/75" /> */}
      </div>

      {/* CONTENT */}
      <Container className="relative z-10 py-9 sm:py-12 md:py-14">
        <div className="max-w-[560px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#c9972a]" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c9972a]">
              {eyebrow}
            </p>
          </div>

          <h1 className="mt-2  text-[clamp(2.1rem,3.2vw+0.75rem,2.85rem)] font-bold text-[#063120]">
            {heading}
            <span className="block text-[#c9972a]">{highlight}</span>
          </h1>

          <p className="mt-0 max-w-[400px] text-sm font-medium text-[#5f564c]">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
