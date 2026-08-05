export function normalizeBlog(blog: any) {
  if (!blog) return blog;

  const image = blog.blogImage?.image || blog.banner?.backgroundImage || "";
  const rawDate = blog.createdAt || blog.banner?.date || blog.date;

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