import FeaturedArticles from "@/components/blog/FeaturedArticles";
import AllBlogs from "@/components/blog/AllBlogs";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { Container } from "../ui/Container";

import { API_URL } from "@/lib/api/api";

async function getAllBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}
export default async function BlogSection({ sectionContent }: { sectionContent: any }) {
  const allBlogs = await getAllBlogs();

  const featuredBlogs = allBlogs.filter((b: any) => b.isFeatured);
  const popularBlogs = allBlogs.filter((b: any) => b.isPopular);
  const voiceOfExpertsBlogs = allBlogs.filter((b: any) => b.isVoiceOfExperts);
  return (
    <section className="">
      <Container>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_320px]">
          <div>
            <FeaturedArticles  sectionContent={sectionContent} />
            <AllBlogs sectionContent={sectionContent} />
          </div>

          <BlogSidebar sectionContent={sectionContent} />
        </div>
      </Container>
    </section>
  );
}