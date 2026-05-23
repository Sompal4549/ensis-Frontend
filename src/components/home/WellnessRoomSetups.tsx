"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import SubHeading from "./SubHeading";
import panchkarma from "@/assets/home/panchkarma.webp"
import shirodha from "@/assets/home/steam.webp"
import steam from "@/assets/home/panchkarma.webp"
import consultaion from "@/assets/home/consultation.webp"
import Image from "next/image";
import BookButton from "../ui/BookButton";

type RoomCard = {
  title: string;
  image: any;
};

const roomData: RoomCard[] = [
  {
    title: "Panchkarma Suite Setup",
    image: panchkarma,
  },
  {
    title: "Shirodhara Room Setup",
    image: shirodha,
  },
  {
    title: "Steam Therapy Room Setup",
    image:
      steam,
  },
  {
    title: "Consultation Room Setup",
    image: consultaion,
  },
];

const WellnessRoomSetups: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="w-full">
      <Container className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">

        {/* Left Content */}
        <div className="flex flex-col justify-center h-full">
          <SubHeading text="Complete Wellness Solutions" className="uppercase tracking-[4px] text-[#8f8777] text-xs font-semibold mb-2">

          </SubHeading>

          <h2 className="text-[#0f2518] text-4xl md:text-3xl font-semibold mb-3">
            Complete Room
            <br />
            Setups
          </h2>
            <p className="text-[#0f2518] text-xs  mb-3">
              Thoughtfully designed, perfectly crafted wellness rooms that
              reflect the essence of Ayurveda and modern luxury.
            </p>
          <div className="max-w-[220px]">
            <BookButton text="EXPLORE ROOM SETUPS" path="/products" />
          </div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {roomData.map((room, index) => (
            <div
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="relative overflow-hidden rounded-2xl h-[100%] cursor-pointer group"
            >
              {/* Image */}
              <Image width={250} height={500}
                src={room.image}
                alt={room.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${hovered === index ? "scale-105" : "scale-100"
                  }`}
              />


              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5 flex items-end justify-between">
                <h3 className="text-white text-md font-semibold max-w-45 leading-5">
                  {room.title}
                </h3>

                <button
                  className={`min-w-[36px] h-[36px] rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md transition-all duration-300 ${hovered === index
                    ? "bg-white text-black"
                    : "text-white"
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