import React from "react";
import { Leaf } from "lucide-react";
import { Container } from "../ui/Container";

const features = [
  {
    title: "Authentic Ayurveda",
    subtitle: "Rooted in ancient wisdom",
  },
  {
    title: "Holistic Well-being",
    subtitle: "For mind, body & soul",
  },
  {
    title: "Timeless Care",
    subtitle: "Lasting transformation",
  },
];

export default function FullWidthFeatures() {
  return (
    <section className="w-full bg-[#0d2a17] border border-[#3d5c39]">
      <Container>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
            {features.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 min-w-0"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 shrink-0">
                  <Leaf
                    size={22}
                    className="text-[#d4a85c]"
                    strokeWidth={1.7}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h3 className="text-[#f5e7c8] text-sm md:text-base font-medium leading-tight font-serif">
                    {item.title}
                  </h3>
                  <p className="text-[#d2c3a1] text-sm mt-1 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
               <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <button className="group flex items-center gap-3 border border-[#c89b4f] text-[#f5e7c8] px-7 py-2 rounded-xl hover:bg-[#16361f] transition-all duration-300">
              <span className="text-sm md:text-base tracking-wide font-medium uppercase">
                Get In Touch
              </span>

              <div className="flex items-center justify-center w-7 h-7">
                <Leaf
                  size={14}
                  className="text-[#d4a85c]"
                  strokeWidth={2}
                />
              </div>
            </button>
          </div>
          </div>

          {/* CTA Button */}
       
      </Container>
    </section>
  );
}