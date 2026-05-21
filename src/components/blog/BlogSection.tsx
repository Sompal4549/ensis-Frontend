import FeaturedArticles from "@/components/blog/FeaturedArticles";
import AllBlogs from "@/components/blog/AllBlogs";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { Container } from "../ui/Container";

export default function BlogSection() {
  return (
    <section className="">
      <Container>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_320px]">
          <div>
            <FeaturedArticles />
            <AllBlogs />
          </div>

          <BlogSidebar />
        </div>
      </Container>
    </section>
  );
}