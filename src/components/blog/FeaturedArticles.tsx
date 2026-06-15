// components/blog/FeaturedArticles.tsx
import BlogCard from "./BlogCard";
import SectionTitle from "./SectionTitle";
import { API_URL } from "@/app/lib/api";

export default async function FeaturedArticles({ sectionContent }: { sectionContent: any }) {
  let blogs = sectionContent?.blogs || [];

  // If no blogs passed, fetch them directly
  if (!blogs || blogs.length === 0) {
    try {
      const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        // Extract blogs array based on API response structure
        blogs = Array.isArray(data) ? data : (data?.blogs || []);
      }
    } catch (error) {
      console.error("Failed to fetch blogs for featured section:", error);
    }
  }

  // Logic: filter isFeatured true
  let featured = blogs.filter((b: any) => b.isFeatured);

  // If less than 4, fill with random blogs
  if (featured.length < 4 && blogs.length > 0) {
    const remainingCount = 4 - featured.length;
    const nonFeatured = blogs.filter((b: any) => !b.isFeatured);
    
    // Simple shuffle
    const randoms = [...nonFeatured]
      .sort(() => 0.5 - Math.random())
      .slice(0, remainingCount);
      
    featured = [...featured, ...randoms];
  }

  const displayArticles = featured.slice(0, 4);

  return (
    <div className="mb-3">
      <SectionTitle title="Featured Articles" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {displayArticles.map((article: any, index: number) => (
          <BlogCard 
            key={article.id || index} 
            title={article.title} 
            image={article.image} 
            link={article.link || article.id}
          />
        ))}
      </div>
    </div>
  );
}