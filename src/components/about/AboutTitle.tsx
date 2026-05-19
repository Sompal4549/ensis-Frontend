import React from "react";
import Image from "next/image";
import lotus from "@/assets/about/lotus.webp";
type SectionHeadingProps = {
  title: string;
  className?: string;
};

const AboutTitle: React.FC<SectionHeadingProps> = ({
  title,
  className
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#f7f2ea] ">
      {/* Top Line + Title + Top Line */}
      <div className="flex items-center gap-4">
        <div className="w-15 h-[1px] bg-[#d8cec0]" />

        <h2
            className={`
              text-[#4a4036]
              text-[24px]
              font-semibold
              tracking-[2px]
              uppercase
              font-serif
             ${className || ''}`}
        >
          {title}
        </h2>

        <div className="w-15 h-[1px] bg-[#d8cec0]" />
      </div>

      {/* Decorative Image */}
      <Image width={50} height={25}
        src={lotus}
        alt="decoration"
        className="object-contain opacity-90"
      />
    </div>
  );
};

export default AboutTitle;