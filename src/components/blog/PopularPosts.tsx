// components/blog/sidebar/PopularPosts.tsx
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { API_URL, getImageUrl } from "@/lib/api/api";
import Link from "next/link";

async function getPopularPosts() {
  try {
    const res = await fetch(`${API_URL}/blogs/popular`, { next: { revalidate: 3600 } });
    const json = await res.json();
    
    if (json.status !== "success") return [];
    
    const data = json.data;
    return data?.blogs || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to fetch popular posts:", error);
    return [];
  }
}

export default async function PopularPosts({blogs}:any) {
console.log(blogs, "popular")
  return (
    <div>
      <SectionTitle title="Popular Posts" />
      <div className="space-y-2">
        {(blogs || []).slice(0, 5).map((blog: any, index: number) => (
          <Link 
            href={`/blog/${blog?.slug || blog?.id || ""}`} 
            key={blog?.id || blog?._id || index} 
            className="flex gap-4 group"
          >
            <div className="relative h-24 w-28 overflow-hidden rounded-xl">
              <Image
                src={blog.image ? getImageUrl(blog.image) : "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070"}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex-1">
              <h4 className="line-clamp-2  text-lg leading-7 text-[#2b241f] group-hover:text-[#a7652a] transition-colors">
                {blog.title}
              </h4>
              <p className="mt-2 text-sm text-[#8d725f]">
                {blog.banner?.date || blog.date || blog.createdAt
                  ? new Date(blog.banner?.date || blog.date || blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : blog.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}