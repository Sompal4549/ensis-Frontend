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

const defaultProjects: ProjectCard[] = [
  {
    title: "Ananda in the Himalayas",
    location: "Rishikesh, Uttarakhand",
    image: { imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", alt: "Ananda in the Himalayas" }
  },
  {
    title: "Somatheeram Village",
    location: "Kovalam, Kerala",
    image: { imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80", alt: "Somatheeram Ayurveda Village" }
  },
  {
    title: "Kairali Healing Village",
    location: "Palakkad, Kerala",
    image: { imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80", alt: "Kairali Ayurvedic Healing Village" }
  },
  {
    title: "Vana Wellness Retreat",
    location: "Dehradun, Uttarakhand",
    image: { imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80", alt: "Vana Wellness Retreat" }
  },
  {
    title: "Soukya Holistic Centre",
    location: "Bengaluru, Karnataka",
    image: { imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", alt: "Soukya International Holistic Centre" }
  }
];

export default function OurProjects({ sectionContent }: { sectionContent?: OurProjectsContent }) {
  const title = sectionContent?.title || "Our Prestigious Projects";
  const subtitle = sectionContent?.subtitle || "Selected turnkey installations across luxury resorts, hospitals and wellness centres.";
  const cards = (sectionContent?.cards && Array.isArray(sectionContent.cards) && sectionContent.cards.length > 0)
    ? sectionContent.cards
    : defaultProjects;

  return (
    <section className="w-full bg-[#f7f3eb] py-10 sm:py-12">
      <Container>
        {/* Heading */}
        <div className="mb-1 flex items-center justify-center gap-4">
          <Image
            src={decorationLeft}
            width={24}
            height={24}
            alt="decoration"
            className="h-4 w-auto object-contain"
          />
          <h2 className=" text-2xl sm:text-3xl text-[#1f2c25]">
            {title}
          </h2>
          <Image
            src={decorationRight}
            width={24}
            height={24}
            alt="decoration"
            className="h-4 w-auto object-contain"
          />
        </div>
        <p className="mb-6 text-center text-base text-[#5a5248]">
          {subtitle}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((project: ProjectCard, index: number) => {
            const imgUrl = project?.image?.imageUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80";
            const imgAlt = project?.image?.alt || project?.title || "Project";
            return (
            <div
              key={index}
              className="overflow-hidden rounded-md border border-[#d8d2c6] bg-white"
            >
              {/* Image */}
              <div className="relative h-[110px] w-full sm:h-[130px]">
                <Image
                  src={imgUrl}
                  alt={imgAlt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-2.5 py-2 text-center">
                <h3 className="text-base font-semibold leading-tight text-[#1f2c25]">
                  {project.title}
                </h3>
                <p className="mt-1 flex items-center justify-center gap-1 text-base leading-none text-[#5a5248]">
                  <MapPin className="h-3 w-3 text-[#b1793d]" />
                  {project.location}
                </p>
              </div>
            </div>
            );
          })}
        </div>

        {/* Button */}
        <div className="mt-6 flex justify-center">
          <BookButton text="View All Projects" />
        </div>
      </Container>
    </section>
  );
}