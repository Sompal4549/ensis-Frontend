// BenefitsSection.tsx
import Image, { StaticImageData } from "next/image";
import { Container } from "../ui/Container";
import competitive from "@/assets/career/competitive.webp"
import health from "@/assets/career/health.webp"
import learning from "@/assets/career/learning.webp"
import workLife from "@/assets/career/work_life_balance.webp"
import celebration from "@/assets/career/celebration.webp"
import growth from "@/assets/career/growth.webp"

interface Benefit {
  title: string;
  icon: string | StaticImageData;
  description:string;
}

const benefits: Benefit[] = [
  {
    title: "Competitive ",
    icon: competitive,
    description:"Compensation"
  },
  {
    title: "Health & Wellness ",
    icon: health,
    description:"Programs"
  },
  {
    title: "Learning & ",
    icon: learning,
    description:"Development"
  },
  {
    title: "Work-Life ",
    icon: workLife,
    description:"Balance"
  },
  {
    title: "Celebrations & ",
    icon: celebration,
    description:"Team Events"
  },
  {
    title: "Growth & Career ",
    icon: growth,
    description:"Advancement"
  },
];
export interface CareerBenefitsProps {
  title: string;
  benefits: Benefit[]
}
const CareerBenefits = ({ sectionContent }: { sectionContent: CareerBenefitsProps }) => {
  return (
    <section className="relative overflow-hidden">

      {/* Light Overlay */}
      <div className="absolute inset-0 -z-10 bg-[#FAF8F5]/90" />

      <Container>
        {/* Heading */}
        <div className="mb-10 flex items-center gap-5">
          <h2 className="shrink-0 font-serif text-lg font-semibold uppercase tracking-wide text-[#2A2A2A]">
            {sectionContent.title || `Benefits of Being an Ensisian`}
          </h2>

          <div className="hidden h-px flex-1 bg-[#D9D2C9] md:block" />

          <div className="hidden text-[#C89A5A] md:block">✦</div>

          <div className="hidden h-px flex-1 bg-[#D9D2C9] md:block" />
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-3 lg:grid-cols-6 lg:gap-0">
          {sectionContent.benefits.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-start gap-3 px-4 lg:px-6 ${index !== benefits.length - 1
                  ? "lg:border-r lg:border-[#E3DDD5]"
                  : ""
                }`}
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={48}
                height={48}
                className="h-10 w-10 shrink-0 object-contain"
              />
              <div>

                <h3 className="text-left text-xs font-semibold leading-6 text-[#222]">
                  {item.title}
                </h3>
                <h3 className="text-left text-xs font-semibold leading-6 text-[#222]" dangerouslySetInnerHTML={{__html:item.description}}>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CareerBenefits;