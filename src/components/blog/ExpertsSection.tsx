// components/blog/sidebar/ExpertsSection.tsx

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "./SectionTitle";

import expert1 from "@/assets/home/testimonial1.webp";
import expert2 from "@/assets/home/testimonial1.webp";
import expert3 from "@/assets/home/testimonial1.webp";
import Link from "next/link";

const experts = [
  {
    name: "Dr. Aaroli Sharma",
    role: "Ayurvedic Practitioner",
    image: expert1,
    quote:
      "True wellness is the harmony of body, mind and environment.",
      slug:"/"
  },
  {
    name: "Ar. Rohan Mehta",
    role: "Wellness Space Designer",
    image: expert2,
    quote:
      "Design is not just how it looks, it's how it heals.",
      slug:"/"
  },
  {
    name: "Vaidya Priya Nair",
    role: "Ayurvedic Consultant",
    image: expert3,
    quote:
      "Ayurveda offers timeless solutions for modern lifestyles.",
      slug:"/"
  },
];

export default function ExpertsSection({blogs}:any) {
  console.log(blogs,"blogs")
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionTitle title="Voice of Experts" />

        <div className="gap-4 flex items-center">
          <button className="inline-flex items-center gap-4 px-1 py-1 text-sm text-[#8a6b47] transition-colors hover:text-[#6b5134]">
            View All <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {blogs?.map((blog:any, index:number|string) => (
          <Link key={index} className="flex gap-4" href={`/blog/${blog?.slug||""}`}>
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
              <Image
                src={blog?.expert?.image}
                alt={blog?.expert?.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs text-[#3d3129]">
                "{blog?.expert?.quote}"
              </p>

              <div className="mt-1">
                <h4 className="font-medium text-[#2b241f]">
                  {blog?.expert?.name}
                </h4>

                <p className="text-xs text-[#8f735d]">
                  {blog?.expert?.role}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}