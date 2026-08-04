import React from "react";
import Image from "next/image";
import { Container } from "../ui/Container";
interface CardProps {
  title: string;
  description: string;
  linkText: string;
  image?: string;
  icon?: React.ReactNode;
}
const Card = ({ title, description, linkText, image, icon }: CardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e4d5c2] bg-gradient-to-br from-[#f7efe5] to-[#f2e5d5] p-5 min-h-[150px] flex justify-between items-start group">
      {/* Content */}
      <div className="relative z-10 max-w-[55%]">
        <h3 className="text-[#2f2318] text-[20px] leading-tight font-semibold">
          {title}
        </h3>

        <p className="text-[#4f4337] text-sm mt-2">
          {description}
        </p>

        <button className="mt-2 text-[#9c6427] text-sm font-medium flex items-center gap-4 hover:gap-4 transition-all">
          {linkText}
          <span>→</span>
        </button>
      </div>

      {/* Image / Icon */}
      <div className="absolute right-0 bottom-0 h-full w-[48%] flex items-end justify-end">
        {image && (
          <>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#f7efe5]/30 to-[#f7efe5]" />
            <div className="relative h-full w-full">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          </>
        )}

        {icon && (
          <div className="flex items-center justify-center w-full h-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const WellnessResources = ({ sectionContent }: { sectionContent: any }) => {
  return(
    <section>

    <Container>
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          title="Latest from Ensis"
          description="Discover new collections, projects, and innovations."
          linkText="Explore Now"
          image="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop" icon={undefined}        />

        <Card
          title="Video Insights"
          description="Watch expert talks and wellness wisdom in action."
          linkText="Watch Now"
          image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop" icon={undefined}        />

        <Card
          title="Report Resource"
          description="Download research, trend reports, and industry insights."
          linkText="Access Now"
          icon={<div className="w-20 h-20 border-2 border-[#b97b3f] rounded-xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#b97b3f]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 3h7l5 5v13H7V3z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 3v6h6" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6M9 17h4" />
            </svg>
          </div>} image={undefined}        />
      </div>
    </Container>
    </section>

  );
};
export default WellnessResources;
