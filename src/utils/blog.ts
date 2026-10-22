/** 1234 → "1.2K views", 1 → "1 view" */
export function formatViews(n?: number): string {
  const v = typeof n === "number" && n > 0 ? n : 0;
  const short = v >= 100000 ? `${(v / 100000).toFixed(1).replace(/\.0$/, "")}L` : v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(v);
  return `${short} ${v === 1 ? "view" : "views"}`;
}

export function normalizeBlog(blog: any) {
  if (!blog) return blog;

  const image = blog.blogImage?.image || blog.banner?.backgroundImage || "";
  // PREVIOUS: const rawDate = blog.createdAt || blog.banner?.date || blog.date;
  // Admin-controlled date gets priority over auto createdAt so edits reflect.
  const rawDate = blog.banner?.date || blog.date || blog.createdAt;

  return {
    ...blog,
    title: blog.title || blog.banner?.title || "ENSIS Blog",
    image,
    date: rawDate
      ? new Date(rawDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "",
    category: blog.category || blog.banner?.category || "",
    views: blog.viewCount ?? 0,
    readingTime: blog.banner?.readingTime || "",
    link: blog.slug || blog.id || blog._id || "",
  };
}

export function normalizeBlogs(blogs: any[] = []): any[] {
  return blogs.map(normalizeBlog);
}