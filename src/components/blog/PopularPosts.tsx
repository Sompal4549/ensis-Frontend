// components/blog/sidebar/PopularPosts.tsx

import Image from "next/image";
import SectionTitle from "./SectionTitle";

import feature1 from "@/assets/home/img-4.webp";
import feature2 from "@/assets/home/img-5.webp";
import feature3 from "@/assets/home/img-6.webp";
import feature4 from "@/assets/home/img-7.webp";

const popularPosts = [
  {
    title: "The Benefits of Abhyanga (Ayurvedic Massage)",
    date: "May 18, 2024",
    image: feature1,
  },
  {
    title: "Creating a Signature Spa Experience",
    date: "May 12, 2024",
    image: feature2,
  },
  {
    title: "Herbal Steam Therapies and Their Benefits",
    date: "May 09, 2024",
    image: feature3,
  },
  {
    title: "Aromatherapy in Spa Treatments",
    date: "May 03, 2024",
    image: feature4,
  },
  {
    title: "Why Panchakarma is More Relevant Today Than Ever",
    date: "April 27, 2024",
    image: feature1,
  },
];

export default function PopularPosts() {
  return (
    <div>
      <SectionTitle title="Popular Posts" />

      <div className="space-y-2">
        {popularPosts.map((post, index) => (
          <div key={index} className="flex gap-4">
            <div className="relative h-24 w-28 overflow-hidden rounded-xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h4 className="line-clamp-2 font-serif text-lg leading-7 text-[#2b241f]">
                {post.title}
              </h4>

              <p className="mt-2 text-sm text-[#8d725f]">
                {post.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}