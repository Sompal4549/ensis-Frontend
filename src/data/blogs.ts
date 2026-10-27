import card1 from "@/assets/blog/card_1.png";
import card2 from "@/assets/blog/card_2.png";
import card3 from "@/assets/blog/card_3.png";
import card4 from "@/assets/blog/card_4.png";
import card5 from "@/assets/blog/card_5.png";
import card6 from "@/assets/blog/card_6.png";

const mk = (
  n: number,
  slug: string,
  title: string,
  category: string,
  date: string,
  image: string,
  description: string,
  flags: { isFeatured?: boolean; isPopular?: boolean; isVoiceOfExperts?: boolean } = {}
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
    readingTime: "5 min read",
    category,
  },
  ...flags,
});

export const staticBlogs = [
  mk(
    1,
    "the-healing-power-of-panchkarma-therapy",
    "The Healing Power of Panchkarma Therapy",
    "Ayurveda Knowledge",
    "15 Oct 2026",
    card1.src,
    "Discover how Panchkarma, the ancient Ayurvedic detoxification therapy, helps restore balance, remove toxins and rejuvenate the body naturally.",
    { isFeatured: true, isPopular: true, isVoiceOfExperts: true }
  ),
  mk(
    2,
    "how-ayurvedic-spa-therapies-improve-mental-wellbeing",
    "How Ayurvedic Spa Therapies Improve Mental Wellbeing",
    "Wellness & Lifestyle",
    "10 Oct 2026",
    card2.src,
    "Learn how traditional Ayurvedic therapies like Abhyanga, Shirodhara and Shirovasti help reduce stress, improve sleep and enhance overall mental health.",
    { isFeatured: true, isPopular: true }
  ),
  mk(
    3,
    "designing-the-perfect-ayurvedic-wellness-space",
    "Designing the Perfect Ayurvedic Wellness Space",
    "Clinic & Spa Design",
    "05 Oct 2026",
    card3.src,
    "Explore key elements, space planning tips and product recommendations for creating a functional and aesthetically pleasing Ayurvedic clinic or spa.",
    { isFeatured: true, isPopular: true }
  ),
  mk(
    4,
    "essential-panchkarma-equipment-for-modern-wellness-centers",
    "Essential Panchkarma Equipment for Modern Wellness Centers",
    "Panchkarma Equipment",
    "28 Sep 2026",
    card4.src,
    "A guide to the must-have Panchkarma tables, steam generators, dhara systems and accessories for safe and effective Ayurvedic treatments.",
    { isPopular: true }
  ),
  mk(
    5,
    "benefits-of-herbal-pinda-sweda-in-pain-management",
    "Benefits of Herbal Pinda Sweda in Pain Management",
    "Ayurveda Knowledge",
    "20 Sep 2026",
    card5.src,
    "Understand how herbal bolus therapy helps in relieving muscle stiffness, joint pain and improves circulation naturally.",
    { isVoiceOfExperts: true }
  ),
  mk(
    6,
    "ayurveda-wellness-tourism-a-growing-opportunity-in-india",
    "Ayurveda & Wellness Tourism: A Growing Opportunity in India",
    "Industry Trends",
    "12 Sep 2026",
    card6.src,
    "Learn how Ayurveda is becoming a global wellness trend and how modern wellness centers can leverage this growing market.",
    { isFeatured: true, isPopular: true }
  ),
];

export const getStaticBlog = (slug: string) => staticBlogs.find((b) => b.slug === slug);
