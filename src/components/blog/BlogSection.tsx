import FeaturedArticles from "@/components/blog/FeaturedArticles";
import AllBlogs from "@/components/blog/AllBlogs";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { Container } from "../ui/Container";

import { blogApi } from "@/lib/api/api";
import { normalizeBlogs } from "@/utils/blog";

export default async function BlogSection({ sectionContent }: { sectionContent: any }) {
  const rawBlogs = await blogApi.list();
  const allBlogs = normalizeBlogs(rawBlogs);
  const featuredBlogs = allBlogs.filter((b: any) => b.isFeatured);
  const popularBlogs = allBlogs.filter((b: any) => b.isPopular);
  const voiceOfExpertsBlogs = allBlogs.filter((b: any) => b.isVoiceOfExperts);
  return (
    <section className="">
      <Container>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_320px]">
          <div>
            <FeaturedArticles sectionContent={sectionContent} blogs={featuredBlogs} />
            <AllBlogs sectionContent={sectionContent} blogs={popularBlogs} />
          </div>

          <BlogSidebar sectionContent={sectionContent} voiceBlogs={voiceOfExpertsBlogs} popularBlog={popularBlogs} />
        </div>
      </Container>
    </section>
  );
}