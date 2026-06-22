import { getComponentContent, getImageUrl, getPageComponent, API_URL } from "@/lib/api/api";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlogSidebar from "@/components/blog/BlogSidebar";
import NewsletterCard from "@/components/blog/NewsletterCard";
import BlogDetailBanner from "@/components/blog/BlogDetailBanner";
import BlogDetailArticleLayout from "@/components/blog/BlogDetailArticleLayout";
import BlogDetailNewsletter from "@/components/blog/BlogDetailNewsLetter";
import { Metadata } from "next";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

const decodeHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
};

async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    return json.status === "success" ? json.data : null;
  } catch (error) {
    console.error("Error fetching blog detail:", error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog?.seo) return { title: "Blog Detail" };

  return {
    title: blog.seo.metaTitle || blog.title,
    description: blog.seo.metaDescription,
    keywords: blog.seo.metaKeywords,
    openGraph: {
      title: blog.seo.ogTitle || blog.title,
      description: blog.seo.ogDescription,
      images: [blog.seo.ogImage || blog.featureImage || blog.image],
    },
    alternates: {
      canonical: blog.seo.canonical,
    },
    robots: blog.robots || "index, follow",
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const blogData: any = await getComponentContent("blog.allBlogs", { blogs: [] });
  const newsletterData: any = await getComponentContent("blog.stayInspired", {});

  const hasBanner = !!blog.banner?.bgImage;
  const hasArticle = !!blog.article?.heroImage;
  const hasNewsletter = !!blog.newsletter?.title;

  return (
    <main className="bg-[#fdfaf5]">

      {/* ── BANNER ── */}
      {hasBanner ? (
        <BlogDetailBanner sectionContent={blog.banner} />
      ) : (
        // fallback — simple header agar banner data nahi hai
        <div className="py-12 md:py-20 bg-[#fdfaf5]">
          <Container>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-wider text-[#9d7f62] mb-3">
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#dcc9b5]" />
              <span>By {blog.author || "Admin"}</span>
              {(blog.category || blog.tags?.[0]) && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#dcc9b5]" />
                  <span>{blog.category || blog.tags[0]}</span>
                </>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-[#2b241f] leading-[1.1]">
              {blog.title}
            </h1>
          </Container>
        </div>
      )}

      {/* ── ARTICLE LAYOUT ── */}
      {hasArticle ? (
        <BlogDetailArticleLayout sectionContent={blog.article} />
      ) : (
        // fallback — plain prose content agar article data nahi hai
        <div className="py-12 md:py-20">
          <Container>
            <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_320px]">
              <article className="max-w-4xl">
                <div className="relative aspect-[21/10] w-full overflow-hidden rounded-[2.5rem] mb-12 shadow-sm">
                  <Image
                    src={
                      blog.featureImage
                        ? getImageUrl(blog.featureImage)
                        : blog.image
                        ? getImageUrl(blog.image)
                        : "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070"
                    }
                    alt={blog.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div
                  className="prose prose-stone prose-lg max-w-none text-[#4a4036]
                  prose-headings:font-serif prose-headings:text-[#2b241f]
                  prose-p:leading-relaxed prose-strong:text-[#2b241f]"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(blog.content || blog.description || "") }}
                />

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-[#dcc9b5]">
                    <h4 className="text-sm font-bold text-[#2b241f] uppercase tracking-widest mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag: string) => (
                        <span key={tag} className="px-4 py-1.5 bg-[#efe4d7] text-[#6e5b4d] rounded-full text-xs font-medium border border-[#dcc9b5]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              <aside className="hidden xl:block">
                <BlogSidebar sectionContent={blogData} />
              </aside>
            </div>
          </Container>
        </div>
      )}

      {/* ── NEWSLETTER ── */}
      {hasNewsletter ? (
        <BlogDetailNewsletter sectionContent={blog.newsletter} />
      ) : (
        <div className="mt-16 md:mt-28">
          <NewsletterCard sectionContent={newsletterData} />
        </div>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  const blogData: any = await getComponentContent("blog.allBlogs", { blogs: [] });
  const blogs = blogData?.blogs || (Array.isArray(blogData) ? blogData : []);

  return blogs
    .map((blog: any) => ({ slug: blog.link || blog.id || "" }))
    .filter((item: any) => item.slug !== "");
}