import Image from "next/image";

import { Container } from "../ui/Container";
import BookButton from "../ui/BookButton";
import decorationLeft from "@/assets/icons/decoration_left.png";
import decorationRight from "@/assets/icons/decoration_right.png";
import { MapPin } from "lucide-react";

interface ProjectCardImage {
  imageUrl: string;
  alt: string;
}

interface ProjectCard {
  title: string;
  location: string;
  image: ProjectCardImage;
}
interface OurProjectsContent {
  title: string;
  subtitle: string;
  cards: ProjectCard[];
}

interface OurProjectsProps {
  sectionContent: OurProjectsContent;
}

export default function OurProjects({ sectionContent }: OurProjectsProps) {
  return (
    <section className="w-full bg-[#f7f3eb] py-10 sm:py-12">
      <Container>
        {/* Heading */}
        <div className="mb-1 flex items-center justify-center gap-3">
          <Image
            src={decorationLeft}
            width={24}
            height={24}
            alt="decoration"
            className="h-4 w-auto object-contain"
          />
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1f2c25]">
            {sectionContent.title}
          </h2>
          <Image
            src={decorationRight}
            width={24}
            height={24}
            alt="decoration"
            className="h-4 w-auto object-contain"
          />
        </div>
        <p className="mb-6 text-center text-xs sm:text-sm text-[#5a5248]">
          {sectionContent.subtitle}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sectionContent.cards.map((project: ProjectCard, index: number) => (
            <div
              key={index}
              className="overflow-hidden rounded-md border border-[#d8d2c6] bg-white"
            >
              {/* Image */}
              <div className="relative h-[110px] w-full sm:h-[130px]">
                <Image
                  src={project.image.imageUrl}
                  alt={project.image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-2.5 py-2 text-center">
                <h3 className="text-[13px] font-semibold leading-tight text-[#1f2c25]">
                  {project.title}
                </h3>
                <p className="mt-1 flex items-center justify-center gap-1 text-[11px] leading-none text-[#5a5248]">
                  <MapPin className="h-3 w-3 text-[#b1793d]" />
                  {project.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-6 flex justify-center">
          <BookButton text="View All Projects" />
        </div>
      </Container>
    </section>
  );
}