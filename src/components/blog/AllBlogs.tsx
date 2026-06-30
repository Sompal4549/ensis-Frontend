"use client";
import { useState } from "react";
import BlogListItem from "./BlogListItem";
import CategoryFilters from "./CategoryFilters";
import SectionTitle from "./SectionTitle";
import { API_URL } from "@/lib/api/api";

export default function AllBlogs({ sectionContent, blogs }: { sectionContent: any, blogs: any }) {
  const [selected, setSelected] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set<string>(blogs.map((b: any) => b.category).filter(Boolean))),
  ];

  const filtered = selected === "All"
    ? blogs
    : blogs.filter((b: any) => b.category === selected);

  return (
    <div>
      <SectionTitle title="All Blogs" />
      <CategoryFilters selected={selected} onSelect={setSelected} categories={categories} />
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