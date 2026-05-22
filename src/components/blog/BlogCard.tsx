// components/blog/cards/BlogCard.tsx

import Image, { StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  image: StaticImageData;
}

export default function BlogCard({ title, image }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7d7c7] bg-[#f8f3ed] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-[150px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 hover:scale-105"
        />
      </div>

      <div className="p-2">
        <h3 className="font-serif text-sm font-semibold leading-snug text-[#2d241d]">
          {title}
        </h3>

        <button className="mt-2 flex items-center gap-2 text-xs font-medium text-[#b36c2c] transition hover:gap-3">
          Read More
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}