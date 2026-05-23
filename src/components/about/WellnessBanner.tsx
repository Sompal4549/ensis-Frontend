import Image from "next/image";
import wellness from "@/assets/about/wellness.webp"
import { Container } from "../ui/Container";
import { CalendarCheck, Download, Files, Phone } from "lucide-react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrCatalogOption } from "react-icons/gr";
import GreenButton from "../ui/GreenButton";
import BookButton from "../ui/BookButton";
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
        <div className="relative z-10 grid min-h-[180px] grid-cols-1 items-center gap-8 px-6 md:grid-cols-2 md:px-0 lg:px-0">
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

<GreenButton leftIcon={<Phone className="text-[#050A1A]" size={16} />} text="BOOK A CONSULTATION" path="/contact" rightIcon={<FaArrowRightLong />} />
  <BookButton leftIcon={<GrCatalogOption className="text-white" size={16} />} text="EXPLORE PRODUCTS" rightIcon={<Download size={16} className="text-white" />}  path="https://ensis.in/pdf/e-broucher.pdf" />
</div>
          </div>
        </div>
      </Container>
    </section>
  );
}