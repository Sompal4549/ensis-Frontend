// components/blog/BlogSidebar.tsx

import ExpertsSection from "@/components/blog/ExpertsSection";
import PopularPosts from "@/components/blog/PopularPosts";
import NewsletterCard from "@/components/blog/NewsletterCard";

export default function BlogSidebar({ sectionContent,  voiceBlogs, popularBlog }: { sectionContent: any; voiceBlogs:any; popularBlog:any }) {
  return (
    <div className="space-y-3">
      <ExpertsSection blogs={voiceBlogs} />
      <PopularPosts blogs={popularBlog} />
    </div>
  );
}