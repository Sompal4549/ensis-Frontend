"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import SubHeading from "./SubHeading";
type RoomCard = {
  title: string;
  image: string;
};

const roomData: RoomCard[] = [
  {
    title: "Panchkarma Suite Setup",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Shirodhara Room Setup",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Steam Therapy Room Setup",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Consultation Room Setup",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
];

const WellnessRoomSetups: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#e3dbd0]">
      <Container className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">

        {/* Left Content */}
        <div className="flex flex-col justify-center h-full">
          <SubHeading text="Complete Wellness Solutions" className="uppercase tracking-[4px] text-[#8f8777] text-xs font-semibold mb-2">

          </SubHeading>

          <h2 className="text-[#1f1b16] text-4xl md:text-3xl leading-tight font-serif mb-3">
            Complete Room
            <br />
            Setups
          </h2>

          <p className="text-[#6e665d] text-[15px] leading-7 max-w-[300px] mb-3">
            Thoughtfully designed, perfectly crafted wellness rooms that
            reflect the essence of Ayurveda and modern luxury.
          </p>

          <button
            className="group relative overflow-hidden bg-[#5f5b45] hover:bg-[#3f3c2d] transition-all duration-300 text-white px-6 py-4 rounded-md w-fit flex items-center gap-3"
          >
            <span className="relative z-10 text-sm tracking-wide font-medium">
              EXPLORE ROOM SETUPS
            </span>
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {roomData.map((room, index) => (
            <div
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="relative overflow-hidden rounded-2xl h-[300px] cursor-pointer group"
            >
              {/* Image */}
              <img
                src={room.image}
                alt={room.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${hovered === index ? "scale-105" : "scale-100"
                  }`}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5 flex items-end justify-between">
                <h3 className="text-white text-xl leading-snug font-medium max-w-[180px]">
                  {room.title}
                </h3>

                <button
                  className={`min-w-[46px] h-[46px] rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md transition-all duration-300 ${hovered === index
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                    }`}
                >
                  <ArrowRight
                    size={18}
                  // className={`transition-transform duration-300 ${
                  //   hovered === index ? "translate-x-1" : ""
                  // }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WellnessRoomSetups;