// components/blog/cards/BlogListItem.tsx
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/api/api";

interface Props {
  title: string;
  date: string;
  category: string;
  image: any;
  link?: string;
}

export default function BlogListItem({
  title,
  date,
  category,
  image,
  link,
}: Props) {
  const href = link ? `/blog/${link}` : "#";
  const imageUrl = typeof image === 'string' || !image?.src ? getImageUrl(image) : image;

  return (
    <Link href={href} className="group flex flex-col gap-5 border-b border-[#e7d9cb] pb-3 sm:flex-row">
      <div className="relative h-37.5 w-full overflow-hidden rounded-2xl sm:w-[300px]">
        <Image
          src={imageUrl || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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

        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#b36c2c] transition group-hover:gap-3">
          Read More
          <ArrowRight size={15} />
        </div>
      </div>
    </Link>
  );
}