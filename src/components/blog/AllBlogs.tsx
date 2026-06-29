"use client";
import { useState } from "react";
import BlogListItem from "./BlogListItem";
import CategoryFilters from "./CategoryFilters";
import SectionTitle from "./SectionTitle";
import { useEffect } from "react";
import { API_URL } from "@/lib/api/api";

export default function AllBlogs({ sectionContent }: { sectionContent: any }) {
  const [selected, setSelected] = useState("All");
  const [blogs, setBlogs] = useState<any[]>(sectionContent?.blogs || []);
  // Fetch blogs if not provided in props (for dynamic blogs page)
  useEffect(() => {
    if (!blogs || blogs.length === 0) {
      const fetchBlogs = async () => {
        try {
          const res = await fetch(`${API_URL}/blogs`);
          const json = await res.json();
          if (json.status === "success") {
            const data = json.data;
            setBlogs(Array.isArray(data) ? data : (data?.blogs || []));
          }
        } catch (e) {
          console.error("Error fetching all blogs:", e);
        }
      };
      fetchBlogs();
    }
  }, []);

  const filtered = selected === "All"
    ? blogs
    : blogs.filter((post: any) => 
        post.category?.toLowerCase() === selected.toLowerCase() || 
        post.tags?.includes(selected)
      );

  return (
    <div>
      <SectionTitle title="All Blogs" />
      <CategoryFilters selected={selected} onSelect={setSelected} />
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((post: any, index: number) => (
            <BlogListItem 
              key={post.id || index} 
              title={post.title} 
              date={post.date} 
              category={post.category} 
              image={post.image} 
              link={post.link || post.id}
            />
          ))
        ) : (
          <p className="text-[#5b4a3f]">No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}