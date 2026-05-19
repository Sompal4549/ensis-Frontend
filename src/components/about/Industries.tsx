import { Container } from "../ui/Container";
import ayurveda from "@/assets/icons/ayurvedic_hospitals.webp";
import wellness from "@/assets/icons/luxury_spas.webp"
import luxury from "@/assets/about/luxury.webp"
import panchkarma from "@/assets/about/panchkarma.webp"
import yoga from "@/assets/icons/authentic_focus.webp"
import wellness_clinic from "@/assets/home/wellness_clicnics.png"
import hotels from "@/assets/icons/hotels_and_retreats.webp"
import naturopathy from "@/assets/about/naturopathy.webp"
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center rounded-md border border-[#e7dfd5] bg-white px-3 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Icon */}
              <div className="mb-3 flex h-14 w-14 items-center justify-center bg-[#fbf8f4] text-[24px] text-[#b78a56] transition-all duration-300 group-hover:scale-105">
                <Image src={industry.image} alt={industry.title} className="h-20 w-20 object-contain" width={80} height={80} />
              </div>

              {/* Title */}
              <p className="text-[11px] md:text-[12px] font-semibold leading-5 tracking-wide text-[#403831]">
                {industry.title}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}