// components/blog/FeaturedArticles.tsx

import BlogCard from "./BlogCard";
import SectionTitle from "./SectionTitle";

import feature1 from "@/assets/home/img-10.webp";
import feature2 from "@/assets/home/img-8.webp";
import feature3 from "@/assets/home/img-11.webp";
import feature4 from "@/assets/home/img-12.webp";

const featuredArticles = [
  {
    title: "The Essence of Panchakarma",
    image: feature1,
  },
  {
    title: "Designing Spa Spaces That Inspire",
    image: feature2,
  },
  {
    title: "Ayurvedic Ingredients That Heal",
    image: feature3,
  },
  {
    title: "The Future of Wellness",
    image: feature4,
  },
];

export default function FeaturedArticles() {
  return (
    <div className="mb-3">
      <SectionTitle title="Featured Articles" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featuredArticles.map((article, index) => (
          <BlogCard key={index} {...article} />
        ))}
      </div>
    </div>
  );
}