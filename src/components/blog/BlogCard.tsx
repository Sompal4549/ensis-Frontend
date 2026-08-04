// components/blog/cards/BlogCard.tsx
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/api/api";
import Link from "next/link";

interface Props {
  title: string;
  image: any;
  link?: string;
}

export default function BlogCard({ title, image, link }: Props) {
  const href = link ? `/blog/${link}` : "#";
  const imageUrl = typeof image === 'string' || !image?.src ? getImageUrl(image) : image;

  return (
    <Link 
      href={href}
      className="block group overflow-hidden rounded-2xl border border-[#e7d7c7] bg-[#f8f3ed] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-[150px] overflow-hidden">
        <Image
          src={imageUrl || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070"}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-2">
        <h3 className="font-serif text-sm font-semibold leading-snug text-[#2d241d] line-clamp-2">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-4 text-xs font-medium text-[#b36c2c] transition group-hover:gap-4">
          Read More
          <ArrowRight size={15} />
        </div>
      </div>
    </Link>
  );
}