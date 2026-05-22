// components/blog/cards/BlogListItem.tsx

import Image, { StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  date: string;
  category: string;
  image: StaticImageData;
}

export default function BlogListItem({
  title,
  date,
  category,
  image,
}: Props) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#e7d9cb] pb-3 sm:flex-row">
      <div className="relative h-37.5 w-full overflow-hidden rounded-2xl sm:w-[300px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#9d7f62]">
          <span>{date}</span>
          <span>•</span>
          <span>{category}</span>
        </div>

        <h3 className="max-w-[700px] font-serif text-xl leading-snug text-[#2b241f] font-semibold">
          {title}
        </h3>

        <button className="mt-3 flex items-center gap-2 text-sm font-medium text-[#b36c2c] transition hover:gap-3">
          Read More
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}