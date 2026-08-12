import Image from "next/image";

import { Container } from "../ui/Container";
import BookButton from "../ui/BookButton";
import decorationLeft from "@/assets/icons/decoration_left.png"
import decorationRight from "@/assets/icons/decoration_right.png"

export interface FeaturedProjectsContent {
  title: string;
  subtitle: string;
  cards: Array<{
    id?: string; // Added id for unique key prop
    title: string;
    location: string;
    image: {
      imageUrl: string;
      alt: string;
    };
  }>;
  buttonText: string;
  buttonPath: string;
}

export default function FeaturedProjects({sectionContent}: { sectionContent: FeaturedProjectsContent }) {
  return (
    <section className="w-full bg-[#f7f3eb]">
      <Container>
        {/* Heading */}
        <div className="mb-2 flex items-center justify-center gap-4">
         <Image src={decorationLeft} width={30} height={30} alt="decoration" className="h-full object-contain" />
          <h2 className="text-base font-semibold uppercase">
            {sectionContent.title}
          </h2>
          <Image src={decorationRight} width={30} height={30} alt="decoration" className="h-full object-contain" />
        </div>
<p className="mb-6 text-center text-base font-semibold">
  {sectionContent.subtitle}
</p>
        {/* Cards */}
 <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
  {sectionContent.cards.map((project:any, index:number) => (
    <div
      key={project.id || index}
      className="overflow-hidden rounded-md border border-[#d8d2c6] bg-white"
    >
      {/* Image with fixed height container */}
      <div className="relative h-[160px] w-full">
        <Image
          src={project.image.imageUrl}
          alt={project.image.alt }
          fill
          className="object-cover scale-110"
        />
      </div>

      {/* Content */}
      <div className="px-2 py-2 mt-2">
        <h3 className="text-base font-semibold leading-[1.2]">
          {project.title}
        </h3>
        <p className="mt-1 text-base leading-none">
          {project.location}
        </p>
      </div>
    </div>
  ))}
</div>

        {/* Button */}
        <div className="mt-2 flex justify-center">
        <BookButton text="View All Projects" />
       
        </div>
      </Container>
    </section>
  );
}