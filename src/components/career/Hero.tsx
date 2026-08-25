// components/CareersBanner.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import bgImage from "@/assets/career/career_banner.png"
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
import HtmlRenderer from "../layout/HtmlRender";
export interface CareersBannerProps {
  bgImage:{imageUrl:string; imageAlt:string};
  heading:string;
  titlePart1:string;
  titlePart2:string;
  titlePart3: string;
  description:string;
  buttonText: string;
  buttonPath:string
}

const CareersBanner = ({sectionContent }: {sectionContent:CareersBannerProps}) => {
  return (
    <section className="relative">
      {/* Background */}
      <Image
        src={sectionContent.bgImage.imageUrl||bgImage}
        alt={sectionContent.bgImage.imageAlt||"Careers at ENSIS"}
        fill
        priority
        className="object-left xl:object-center object-cover"
      />
      <div className="relative z-10 flex min-h-[550px] md:h-[calc(100vh-146px)] max-h-[650px] xl:max-h-none items-center px-6 py-12 sm:px-10 lg:px-14">
        <Container>
          {/* Eyebrow */}
          <p className="mb-4 text-base font-semibold uppercase tracking-[0.2em] text-[#c07d19]">
            {sectionContent.heading||"Careers at ENSIS"}
          </p>

          {/* Heading */}
          <h1 className="text-[#0e3d21]">
            {sectionContent.titlePart1||"Build Spaces"}
            <br />
            {sectionContent.titlePart2||"That Heal."}
            <br />
            {sectionContent.titlePart3||"Build a Better You."}
          </h1>

          {/* Description */}
          <HtmlRenderer className="mt-6 max-w-md text-base font-semibold text-[#313628]"
          content={sectionContent.description||`At ENSIS, we blend ancient wisdom with modern innovation to create
            authentic wellness experiences. Join our passionate team and build a
            career that makes a difference.`}>
        
          </HtmlRenderer>
          <div className="w-[310px] mt-4">

<GreenButton text={sectionContent.buttonText||"Explore Opportunities"} path={sectionContent.buttonPath||"/contact"}/>
          </div>
        
      </Container>
        </div>
    </section>
  );
};

export default CareersBanner;