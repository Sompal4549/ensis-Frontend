import { Container } from "../ui/Container";
import ayurveda from "@/assets/icons/ayurvedic_hospitals.webp";
import wellness from "@/assets/icons/luxury_spas.webp"
import luxury from "@/assets/icons/luxury.webp"
import panchkarma from "@/assets/icons/panchkarma2.webp"
import yoga from "@/assets/icons/authentic_focus.webp"
import wellness_clinic from "@/assets/home/wellness_clicnics.png"
import hotels from "@/assets/icons/hotels_and_retreats.webp"
import naturopathy from "@/assets/icons/naturopathy.webp"
import Image from "next/image";
import AboutTitle from "./AboutTitle";

type IndustryItem = {
  title: string;
  icon: string;
  image?: any;
};

const industries: IndustryItem[] = [
  {
    title: "Ayurveda Hospitals",
    icon: "✚",
    image:ayurveda,
  },
  {
    title: "Wellness Resorts",
    icon: "♨",
    image:wellness,
  },
  {
    title: "Luxury Spas",
    icon: "❀",
    image:luxury,
  },
  {
    title: "Panchkarma Centers",
    icon: "☸",
    image:panchkarma,
  },
  {
    title: "Yoga Retreats",
    icon: "🧘",
    image:yoga,
  },
  {
    title: "Wellness Clinics",
    icon: "⌂",
    image:wellness_clinic,
  },
  {
    title: "Hotels & Retreats",
    icon: "🏛",
    image:hotels,
  },
  {
    title: "Naturopathy Centers",
    icon: "✿",
    image:naturopathy,
  },
];

interface IndustryItemContent {
  title: string;
  imageurl: {imageUrl:string, alt:string}; // Assuming this is an image URL or path
}

export interface IndustriesWeServeContent {
  title: string;
  industries: IndustryItemContent[];
}

const fallbackIndustries: IndustryItemContent[] = [
  { title: "Ayurveda Hospitals", imageurl: { imageUrl: ayurveda.src, alt: "Ayurveda Hospitals" } },
  { title: "Wellness Resorts", imageurl: { imageUrl: wellness.src, alt: "Wellness Resorts" } },
  { title: "Luxury Spas", imageurl: { imageUrl: luxury.src, alt: "Luxury Spas" } },
  { title: "Panchkarma Centers", imageurl: { imageUrl: panchkarma.src, alt: "Panchkarma Centers" } },
  { title: "Yoga Retreats", imageurl: { imageUrl: yoga.src, alt: "Yoga Retreats" } },
  { title: "Wellness Clinics", imageurl: { imageUrl: wellness_clinic.src, alt: "Wellness Clinics" } },
  { title: "Hotels & Retreats", imageurl: { imageUrl: hotels.src, alt: "Hotels & Retreats" } },
  { title: "Naturopathy Centers", imageurl: { imageUrl: naturopathy.src, alt: "Naturopathy Centers" } },
];

const fallbackContent: IndustriesWeServeContent = {
  title: "Industries We Serve",
  industries: fallbackIndustries,
};

export default function IndustriesWeServe({ sectionContent = {} as IndustriesWeServeContent }: { sectionContent?: IndustriesWeServeContent }) {
  const resolved = { ...fallbackContent, ...sectionContent };
  if (!resolved.industries || resolved.industries.length === 0) {
    resolved.industries = fallbackIndustries;
  }
  return (
    <section className="w-full bg-[#f8f5f1] px-4 md:px-8">
      <Container>
        <AboutTitle title="Industries We Serve" />
        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 mt-2 divide-x divide-y sm:divide-y-0 divide-[#e7dfd5]">
  {resolved.industries.map((industry, index) => (
    <div
      key={index}
      className="group flex flex-col items-center justify-center px-3 py-4 text-center transition-all duration-300 hover:bg-[#fbf8f4]"
    >
      {/* Icon */}
      <div className="mb-2 flex items-center justify-center text-[#b78a56] transition-all duration-300 group-hover:scale-105">
        <Image src={industry.imageurl.imageUrl} alt={industry.imageurl.alt || industry.title} className="object-contain" width={60} height={60} style={{ height: "auto" }} />
      </div>

      {/* Title */}
      <p className="text-base font-medium leading-5 tracking-wide">
        {industry.title}
      </p>
    </div>
  ))}
</div>
      </Container>
    </section>
  );
}