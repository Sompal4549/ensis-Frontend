// components/blog/BlogSidebar.tsx

import ExpertsSection from "@/components/blog/ExpertsSection";
import PopularPosts from "@/components/blog/PopularPosts";
import NewsletterCard from "@/components/blog/NewsletterCard";

export default function BlogSidebar({ sectionContent }: { sectionContent: any }) {
  return (
    <div className="space-y-3">
      <ExpertsSection />
      <PopularPosts />
    </div>
  );
}