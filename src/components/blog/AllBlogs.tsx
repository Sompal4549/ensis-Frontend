"use client";

import { useState } from "react";
import BlogListItem from "./BlogListItem";
import CategoryFilters from "./CategoryFilters";
import SectionTitle from "./SectionTitle";

import feature1 from "@/assets/home/img-4.webp";
import feature2 from "@/assets/home/img-5.webp";
import feature3 from "@/assets/home/img-6.webp";
import feature4 from "@/assets/home/img-7.webp";

const blogPosts = [
  { title: "Designing Tranquility: The Essence of a Perfect Spa Space", date: "May 20, 2024", category: "Spa Design", image: feature1 },
  { title: "The Timeless Power of Panchakarma in Modern Wellness", date: "May 15, 2024", category: "Panchakarma", image: feature2 },
  { title: "Must-Have Spa Equipment for Exceptional Guest Experiences", date: "May 10, 2024", category: "Equipment", image: feature3 },
  { title: "Ayurvedic Ingredients that Nourish and Heal", date: "May 05, 2024", category: "Ingredients", image: feature4 },
];

export default function AllBlogs() {
  const [selected, setSelected] = useState("All");

  const filtered = selected === "All"
    ? blogPosts
    : blogPosts.filter((post) => post.category === selected);

  return (
    <div>
      <SectionTitle title="All Blogs" />
      <CategoryFilters selected={selected} onSelect={setSelected} />
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((post, index) => <BlogListItem key={index} {...post} />)
        ) : (
          <p className="text-[#5b4a3f]">No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}