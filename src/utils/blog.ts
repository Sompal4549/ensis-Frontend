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
    link: blog.slug || blog.id || blog._id || "",
  };
}

export function normalizeBlogs(blogs: any[] = []): any[] {
  return blogs.map(normalizeBlog);
}