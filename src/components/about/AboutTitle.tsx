import React from "react";
import Image from "next/image";
import lotus from "@/assets/about/lotus.png";
type SectionHeadingProps = {
  title: string;
  className?: string;
};

const AboutTitle: React.FC<SectionHeadingProps> = ({
  title,
  className
}) => {
  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Top Line + Title + Top Line */}
      <div className="flex items-center gap-4">
        <div className="w-15 h-[1px] bg-[#d8cec0]" />

        <h2
            className={`
              text-[#4a4036]
text-sm
              md:text-[24px]
              font-semibold
              tracking-[2px]
              uppercase
              font-serif
              text-center
             ${className || ''}`}
        >
          {title}
        </h2>

        <div className="w-15 h-[1px] bg-[#d8cec0]" />
      </div>

      {/* Decorative Image */}
      <Image width={35} height={20}
        src={lotus}
        alt="decoration"
        crossOrigin="anonymous"
        className="object-contain opacity-90"
        style={{ height: "auto" }}
      />
    </div>
  );
};

export default AboutTitle;