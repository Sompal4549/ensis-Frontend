"use client";
import twenty from "@/assets/about_new/years_experience.webp"
import projects from "@/assets/about_new/project.webp"
import twohundred from "@/assets/about_new/happy_clients.webp"
import states from "@/assets/about_new/states_served.webp";
import in_house from "@/assets/about_new/in_house.webp"
import pan_india from "@/assets/about_new/pan_india.webp"
import Image from "next/image";
import { Container } from "../ui/Container";
const stats = [
  {
    image: twenty,
    number: "20+",
    label: "Years Experience",
  },
  {
    number: "1000+",
    label: "Projects Completed",
    image: projects
  },
  {
    number: "200+",
    label: "Happy Clients",
    image: twohundred
  },
  {
    number: "28",
    label: "States Served",
    image: states
  },
  {
    number: "In-house",
    label: "Manufacturing",
    image: in_house
  },
  {
    number: "Pan India",
    label: "Installation & Support",
    image: pan_india
  },
];

export default function StatsStrip() {
  return (
    <section className="bg-[#f2ede6]">
      <Container className="">
        <div className="mx-auto flex w-full max-w-[1500px] items-center overflow-x-auto py-2 ">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex  flex-1 items-center gap-3 border-r border-black/10 px-4 last:border-r-0 md:min-w-0"
            >
              {/* White Icon Placeholder */}
              <div className="h-9 w-9">
                <Image src={item.image} alt={item.label} height={36} width={36} className="object-contain" />
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-none text-black">
                  {item.number}
                </span>

                <span className="mt-1 text-[10px] font-medium leading-[1.3] text-black/70">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}