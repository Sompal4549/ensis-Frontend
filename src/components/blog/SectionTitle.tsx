// components/blog/SectionTitle.tsx

import Image from "next/image";
import blog_decoration from "@/assets/icons/blog_decoration_2.webp"


interface Props {
  title: string;
}

export default function SectionTitle({ title }: Props) {
  return (
    <div className="mb-3">
      <h2 className="font-serif text-2xl text-[#2b241f] font-semibold">{title}</h2>

      <div className="mt-3 flex items-center gap-4">

        <div className="flex gap-1">
        <Image alt="blog decoration"src={blog_decoration} height={25} width={200} />
        </div>

      </div>
    </div>
  );
}