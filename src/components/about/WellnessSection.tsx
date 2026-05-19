import React from "react";
import {
  Bed,
  FlaskConical,
  Bath,
  Flower2,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import flower from "@/assets/about/lotus.webp"
import { Container } from "../ui/Container";
import welcome from "@/assets/about/welcome_to_ensis.webp"
const services = [
  {
    icon: Bed,
    title: "PANCHAKARMA TABLES",
    description:
      "Experience authentic therapies with comfort and precision.",
  },
  {
    icon: FlaskConical,
    title: "SHIRODHARA EQUIPMENTS",
    description:
      "Precision-crafted for deep relaxation and mental clarity.",
  },
  {
    icon: Bath,
    title: "STEAM & SAUNA",
    description:
      "Detoxify. Rejuvenate. Restore balance naturally.",
  },
  {
    icon: Flower2,
    title: "WELLNESS ACCESSORIES",
    description:
      "Thoughtful additions for a complete wellness journey.",
  },
];

const WellnessSection: React.FC = () => {
  return (
    <section>
      <Container className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.8fr] gap-8 items-center">
        
        {/* Left Content */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 items-center">
          
          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-md h-[320px]">
            <Image 
            height={400} width={500}
              src={welcome}
              alt="Ayurveda"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <div className="flex gap-1 mb-2 flex-col">
              <span className="uppercase tracking-[2px] text-[#b78942] text-sm font-semibold">
                Welcome To Ensis
              </span>
<div className="flex gap-2 items-center">
              <div className="w-16 h-[1px] bg-[#c9a870]" />
              <Image src={flower} height={35} width={35} alt="flower"  />
              <div className="w-16 h-[1px] bg-[#c9a870]" />


</div>
            </div>

            <h2 className="text-[#283b30] text-[20px] leading-[1.2] font-serif max-w-[420px] font-semibold">
              Where Tradition Meets Transformative Wellness.
            </h2>

            <p className="text-[#555] mt-3 text-[15px] max-w-[480px]">
              At Ensis, we blend ancient Ayurvedic wisdom with exceptional
              craftsmanship to create timeless wellness solutions for modern
              lives.
            </p>

            <button className="group mt-3 flex items-center gap-2 text-[#b78942] uppercase tracking-[1px] text-xs font-semibold">
              Know More
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Right Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="bg-[#f8f2ea] border border-[#e6d8c5] rounded-2xl px-4 py-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 flex-col justify-between items-stretch flex"
              >
                {/* Icon Circle */}
                <div className="w-20 h-20 mx-auto rounded-full border border-2 border-[#c9a870] flex items-center justify-center mb-6">
                  <Icon size={34} className="text-[#b78942]" strokeWidth={1.5} />
                </div>

                <h3 className="text-[#203027] text-[14px] font-medium tracking-wide">
                  {service.title}
                </h3>

                <p className="text-[#5c5c5c] text-[12px] mt-3 min-h-[90px]">
                  {service.description}
                </p>
<div>

                <div className="w-20 h-[1px] bg-[#d5bc94] mx-auto mb-3" />

                <button className="group flex items-center justify-center gap-1 mx-auto text-[#1f2b24] text-xs uppercase tracking-wide font-semibold">
                  View Products
                  <ChevronRight
                    size={16}
                    className="text-[#b78942] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default WellnessSection;