import img1 from "@/assets/home/img-1.webp";
import img2 from "@/assets/home/img-2.webp";
import img3 from "@/assets/home/img-3.webp";
import img4 from "@/assets/home/img-4.webp";
import img10 from "@/assets/home/img-10.webp";
import img11 from "@/assets/home/img-11.webp";
import blogImg from "@/assets/blog/blog.webp";

const mk = (
  n: number,
  slug: string,
  title: string,
  category: string,
  date: string,
  image: string,
  description: string,
  flags: { isFeatured?: boolean; isPopular?: boolean; isVoiceOfExperts?: boolean },
  expertName?: string,
  expertRole?: string,
  expertQuote?: string
) => ({
  _id: `static-blog-${n}`,
  id: `static-blog-${n}`,
  slug,
  title,
  category,
  date,
  createdAt: date,
  description,
  author: "ENSIS Team",
  tags: ["Ayurveda", "Wellness", "Panchakarma"],
  blogImage: { image },
  banner: {
    backgroundImage: image,
    backgroundImageAlt: title,
    title,
    highlight: "",
    date,
    readingTime: "6 min read",
    category,
  },
  expert: expertName
    ? { name: expertName, role: expertRole || "Wellness Expert", quote: expertQuote || "", image: img10.src }
    : undefined,
  ...flags,
});

export const staticBlogs = [
  mk(1, "panchakarma-a-complete-guide", "Panchakarma: A Complete Guide to Ayurvedic Detox", "Ayurveda",
    "2025-06-12", img1.src,
    "Panchakarma is Ayurveda's five-step purification system. Learn how Vamana, Virechana, Basti, Nasya and Raktamokshana restore balance and renew the body.",
    { isFeatured: true, isPopular: true, isVoiceOfExperts: true },
    "Dr. Ananya Menon", "Chief Ayurvedic Consultant",
    "Panchakarma is not a luxury — it is a reset for the body's deepest tissues."),
  mk(2, "designing-a-wellness-space", "Designing a Wellness Space That Heals", "Design",
    "2025-05-28", img2.src,
    "From lighting to layout, every detail of a wellness room shapes the therapy experience. Here's how ENSIS approaches turnkey wellness interiors.",
    { isFeatured: true, isPopular: true },
    "Rahul Verma", "Head of Design",
    "Great wellness design is invisible — the guest feels it before they see it."),
  mk(3, "benefits-of-herbal-steam-therapy", "Benefits of Herbal Steam Therapy", "Therapies",
    "2025-05-10", img3.src,
    "Herbal steam therapy aids detoxification, relieves muscle tension and supports respiratory health. Discover how to set up a clinical steam room.",
    { isPopular: true }),
  mk(4, "ayurvedic-herbs-for-daily-routine", "Ayurvedic Herbs for a Daily Wellness Routine", "Herbs",
    "2025-04-22", img4.src,
    "Ashwagandha, Brahmi, Triphala and more — a practical guide to incorporating ayurvedic herbs into everyday life.",
    { isVoiceOfExperts: true },
    "Dr. Meera Nair", "Research Lead",
    "Herbs work best when they match your prakriti, not the trend of the season."),
  mk(5, "spa-furniture-that-lasts", "Choosing Spa Furniture That Lasts", "Manufacturing",
    "2025-04-02", img11.src,
    "Teak, mahogany or stainless steel? A materials guide for spa and panchakarma furniture built for heavy daily use.",
    { isPopular: true }),
  mk(6, "turnkey-wellness-projects-for-hotels", "Turnkey Wellness Projects for Hotels & Resorts", "Turnkey",
    "2025-03-15", blogImg.src,
    "Hotels are adding wellness floors to stay competitive. Here's how a turnkey partner de-risks design, procurement and installation.",
    { isFeatured: true, isVoiceOfExperts: true },
    "Sanjay Pillai", "Projects Director",
    "A wellness floor only works when design, MEP and therapy workflow are planned together."),
];

export const getStaticBlog = (slug: string) => staticBlogs.find((b) => b.slug === slug);
