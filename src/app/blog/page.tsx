import { generateSeo } from "@/lib/api/seo";
import PageBuilder from '@/components/PageBuilder';
import { headers } from "next/headers";
import { API_URL, getImageUrl } from "@/lib/api/api";

export async function generateMetadata() {
  return generateSeo("blog");
}

async function getAllBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

const Blog = async () => {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "ensis.in";
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

  const blogs = await getAllBlogs();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ENSIS Blog | Panchkarma & Spa Insights",
    description: "Insights on Panchkarma, spa equipment and wellness from ENSIS.",
    url: `${baseUrl}/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((blog: any, index: number) => {
        const bgImage = blog.blogImage?.image || blog.banner?.backgroundImage;
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "BlogPosting",
            headline: blog.title || blog.banner?.title || "ENSIS Blog",
            url: `${baseUrl}/blog/${blog.slug}`,
            ...(bgImage ? { image: getImageUrl(bgImage) } : {}),
            ...(blog.createdAt ? { datePublished: blog.createdAt } : {}),
            author: {
              "@type": "Person",
              name: blog.author || "ENSIS",
            },
            publisher: {
              "@type": "Organization",
              name: "ENSIS",
            },
          },
        };
      }),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <PageBuilder slug="blog" />
    </div>
  )
}

export default Blog