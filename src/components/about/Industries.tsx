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

export default function IndustriesWeServe() {
  return (
    <section className="w-full bg-[#f8f5f1] px-4 md:px-8">
      <Container>
        {/* Heading */}
        {/* <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-[#e5ddd2]" />

          <div className="flex flex-col items-center">
            <h2 className="text-[18px] md:text-[24px] font-semibold tracking-wide text-[#2e2a26] uppercase">
              Industries We Serve
            </h2>

            <div className="mt-2 h-[2px] w-10 rounded-full bg-[#c8a16a]" />
          </div>

          <div className="h-px flex-1 bg-[#e5ddd2]" />
        </div> */}
<AboutTitle title="Industries We Serve" />
        {/* Cards */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 mt-2 divide-x divide-[#e7dfd5]">
  {industries.map((industry, index) => (
    <div
      key={index}
      className="group flex flex-col items-center justify-center px-3 py-4 text-center transition-all duration-300 hover:bg-[#fbf8f4]"
    >
      {/* Icon */}
      <div className="mb-2 flex items-center justify-center text-[#b78a56] transition-all duration-300 group-hover:scale-105">
        <Image src={industry.image} alt={industry.title} className="object-contain" width={60} height={60} style={{ height: "auto" }} />
      </div>

      {/* Title */}
      <p className="text-[11px] font-medium leading-4 tracking-wide">
        {industry.title}
      </p>
    </div>
  ))}
</div>
      </Container>
    </section>
  );
}