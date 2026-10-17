"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { API_URL } from "@/lib/api/api";
import { formatViews } from "@/utils/blog";

/**
 * View count on the blog page. Counts this reader once per browser session
 * (refreshes do not add views) and shows the updated number.
 */
export default function BlogViews({ slug, initial = 0, className = "" }: { slug: string; initial?: number; className?: string }) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    if (!slug) return;
    const key = `ensis_blog_viewed_${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage blocked: still count the view once for this page load
    }
    fetch(`${API_URL}/blogs/${encodeURIComponent(slug)}/view`, { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (typeof json?.data?.views === "number") setViews(json.data.views);
      })
      .catch(() => {});
  }, [slug]);

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Eye size={15} className="text-[#C9972A]" />
      {formatViews(views)}
    </span>
  );
}
