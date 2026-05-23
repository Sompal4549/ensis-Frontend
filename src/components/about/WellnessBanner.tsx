import Image from "next/image";
import wellness from "@/assets/about/wellness.webp"
import { Container } from "../ui/Container";
import { CalendarCheck, Download, Files, Phone } from "lucide-react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrCatalogOption } from "react-icons/gr";
export default function WellnessBanner() {
  return (
    <section className="w-full relative">
          <div className="absolute inset-0">
          <Image
            src={wellness}
            alt="Luxury Wellness Interior"
            className="h-full w-full object-cover"
            fill
          />
        </div>
      <Container className="relative mx-auto overflow-hidden rounded-md py-4!">
        {/* Background Image */}
      

        {/* Content */}
        <div className="relative z-10 grid min-h-[220px] grid-cols-1 items-center gap-8 px-6 md:grid-cols-2 md:px-0 lg:px-0">
          {/* Left Side */}
          <div className="max-w-xl">
            <h2 className="    text-[28px]
            font-semibold
            tracking-[2px] leading-[120%]
            uppercase
            font-serif text-[#f5efe6]">
              LET’S BUILD YOUR
              <br />
              WELLNESS SPACE
            </h2>

            <p className="mt-3 text-sm text-[#ddd1c1] md:text-[15px] ">
              Whether you are planning a wellness center, spa, resort or<br/>
              Ayurveda hospital, our experts are here to bring your vision to
              life.
            </p>

            {/* Buttons */}
            <div className="mt-3 flex flex-wrap gap-4">
  <button className="rounded-md border border-[#c7a36d] bg-[#ecb460] px-3 py-2 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#d7b37d] flex items-center gap-2">
    <Phone className="text-white" size={16} /> BOOK A CONSULTATION <FaArrowRightLong />
  </button>

  <button className="rounded-md border border-[#9d8a6b] bg-transparent px-3 py-2 text-sm font-semibold tracking-wide text-[#f2e8da] transition-all duration-300 hover:bg-white/10 flex items-center gap-2">
   <GrCatalogOption size={16} className="text-[#ca8e42]" /> DOWNLOAD CATALOGUE <Download size={16} />
  </button>
</div>
          </div>
        </div>
      </Container>
    </section>
  );
}