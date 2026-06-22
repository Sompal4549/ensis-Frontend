"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Download,
  FlaskConical,
  Beaker,
  Leaf,
  Droplet,
  Droplets,
} from "lucide-react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { Container } from "../ui/Container";
import bgImage from "@/assets/career/blog_detail_image.webp"
import userimage from "@/assets/home/testimonial1.webp";
import img1 from "@/assets/home/img-1.webp"
import img2 from "@/assets/home/img-2.webp"
import img3 from "@/assets/home/img-3.webp"
import img4 from "@/assets/home/img-4.webp"

/* ---------------------------------- Types ---------------------------------- */

export interface TherapyItem {
  id: "vamana" | "virechana" | "basti" | "nasya" | "raktamokshana";
  title: string;
  description: string;
}

export interface BenefitItem {
  id: string;
  text: string;
}

export interface TocItem {
  id: string;
  label: string;
  href: string;
}

export interface RelatedArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string|StaticImageData;
  href: string;
}

export interface AuthorContent {
  name: string;
  role: string;
  bio: string;
  avatar: string|StaticImageData;
  socials: { platform: "linkedin" | "instagram" | "facebook"; href: string }[];
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface BlogArticleContent {
  heroImage: string|StaticImageData;
  heroAlt: string;
  introBefore: string;
  introHighlight: string;
  introAfter: string;
  whatIsPanchakarma: ArticleSection;
  therapies: TherapyItem[];
  benefitsHeading: string;
  benefits: BenefitItem[];
  modernLife: ArticleSection;
  rightSpace: ArticleSection;
  ensisApproach: ArticleSection;
  conclusion: ArticleSection;
  tags: string[];
  author: AuthorContent;
  toc: TocItem[];
  guide: { heading: string; description: string; buttonLabel: string; href: string };
  relatedArticles: RelatedArticle[];
}

/* ------------------------- Fallback content (reference UI) ------------------------- */

export const fallbackBlogArticle: BlogArticleContent = {
  heroImage: bgImage,
  heroAlt: "Ayurvedic massage tools, herbs and brass bowls",
  introBefore:
    "In a world that rarely slows down, our bodies and minds often carry the weight of stress, toxins, and imbalance. ",
  introHighlight: "Panchakarma",
  introAfter:
    ", the ancient Ayurvedic detoxification therapy, offers a powerful reset—cleansing not just the body, but also restoring harmony at every level of your being.",
  whatIsPanchakarma: {
    heading: "What is Panchakarma?",
    body: "Panchakarma is a holistic healing process that involves five therapeutic actions designed to remove toxins (ama) from the body, balance the doshas, and rejuvenate the system. Rooted in Ayurveda for thousands of years, it is considered the ultimate detox for total well-being.",
  },
  therapies: [
    { id: "vamana", title: "Vamana", description: "Therapeutic emesis" },
    { id: "virechana", title: "Virechana", description: "Purgation therapy" },
    { id: "basti", title: "Basti", description: "Medicated enema" },
    { id: "nasya", title: "Nasya", description: "Nasal detoxification" },
    { id: "raktamokshana", title: "Raktamokshana", description: "Blood letting" },
  ],
  benefitsHeading: "Benefits of Panchakarma",
  benefits: [
    { id: "b1", text: "Detoxifies body and eliminates toxins" },
    { id: "b2", text: "Improves digestion and metabolism" },
    { id: "b3", text: "Promotes mental clarity and emotional balance" },
    { id: "b4", text: "Enhances sleep and reduces stress" },
  ],
  modernLife: {
    heading: "Panchakarma in Modern Life",
    body: "Modern lifestyles expose us to pollutants, processed foods, and constant digital stimulation. These factors create deep imbalances. Panchakarma helps in hitting the reset button—naturally and effectively.",
  },
  rightSpace: {
    heading: "Creating the Right Space for Healing",
    body: "The environment plays a vital role in the success of the healing experience. At ENSIS, we design and manufacture authentic Ayurvedic therapy rooms that align with traditional principles and modern comfort.",
  },
  ensisApproach: {
    heading: "The ENSIS Approach",
    body: "Every ENSIS product is crafted with precision and purpose. From Panchakarma tables to Shirodhara stands and steam cabinets, we combine ancient wisdom with modern craftsmanship to support therapists and elevate wellness experiences.",
  },
  conclusion: {
    heading: "Conclusion",
    body: "Panchakarma is not just a therapy—it's a way of returning to balance. In today's world, it offers the perfect blend of ancient wisdom and modern relevance.",
  },
  tags: ["Panchakarma", "Ayurveda", "Detox", "Wellness", "Healing"],
  author: {
    name: "Neha Sharma",
    role: "Wellness Consultant at ENSIS",
    bio: "Neha is an Ayurvedic wellness expert with over 8 years of experience in holistic healing and spa consultancy. She is passionate about blending ancient wisdom with modern wellness solutions.",
    avatar: userimage,
    socials: [
      { platform: "linkedin", href: "#" },
      { platform: "instagram", href: "#" },
      { platform: "facebook", href: "#" },
    ],
  },
  toc: [
    { id: "what-is-panchakarma", label: "What is Panchakarma?", href: "#what-is-panchakarma" },
    { id: "benefits", label: "Benefits of Panchakarma", href: "#benefits" },
    { id: "modern-life", label: "Panchakarma in Modern Life", href: "#modern-life" },
    { id: "right-space", label: "Creating the Right Space", href: "#right-space" },
    { id: "ensis-approach", label: "The ENSIS Approach", href: "#ensis-approach" },
    { id: "conclusion", label: "Conclusion", href: "#conclusion" },
  ],
  guide: {
    heading: "Download our Panchakarma Guide",
    description: "A complete guide to Panchakarma therapies and their benefits.",
    buttonLabel: "DOWNLOAD NOW",
    href: "#",
  },
  relatedArticles: [
    {
      id: "r1",
      title: "Designing Ayurvedic Spaces: Blending Tradition with Modernity",
      date: "May 15, 2024",
      readTime: "5 Min Read",
      image: img1,
      href: "#",
    },
    {
      id: "r2",
      title: "Shirodhara Therapy: Benefits, Process & What to Expect",
      date: "May 10, 2024",
      readTime: "4 Min Read",
      image: img2,
      href: "#",
    },
    {
      id: "r3",
      title: "Why Wellness Retreats Are the Future of Hospitality",
      date: "May 05, 2024",
      readTime: "6 Min Read",
      image: img3,
      href: "#",
    },
  ],
};

/* ------------------- Fixed icon maps (not CMS-driven, stable sets) ------------------- */

const therapyIconMap: Record<TherapyItem["id"], React.ElementType> = {
  vamana: FlaskConical,
  virechana: Beaker,
  basti: Leaf,
  nasya: Droplet,
  raktamokshana: Droplets,
};

const socialIconMap = {
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  facebook: FaFacebookF,
};

/* ---------------------------------- Component ---------------------------------- */

interface BlogArticleLayoutProps {
  sectionContent?: BlogArticleContent;
}

const BlogArticleLayout: React.FC<BlogArticleLayoutProps> = ({
  sectionContent = fallbackBlogArticle,
}) => {
  const {
    heroImage,
    heroAlt,
    introBefore,
    introHighlight,
    introAfter,
    whatIsPanchakarma,
    therapies,
    benefitsHeading,
    benefits,
    modernLife,
    rightSpace,
    ensisApproach,
    conclusion,
    tags,
    author,
    toc,
    guide,
    relatedArticles,
  } = sectionContent;

  return (
    <div className="bg-[#faf6ef]">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ---------- Main article ---------- */}
          <article className="lg:col-span-2">
            <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72 md:h-80">
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>

            <p className="mt-6 text-xs leading-relaxed sm:text-sm">
              {introBefore}
              <span className="font-medium text-[#C9972A]">{introHighlight}</span>
              {introAfter}
            </p>

            <section id="what-is-panchakarma" className="mt-8 scroll-mt-24">
              <h2 className="font-serif text-sm font-semibold text-[#1f2c25]">
                {whatIsPanchakarma.heading}
              </h2>
              <p className="mt-3 text-xs leading-relaxed sm:text-sm">
                {whatIsPanchakarma.body}
              </p>

              <div className="mt-6 grid grid-cols-2 divide-x divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white sm:grid-cols-5 sm:divide-y-0">
                {therapies.map((therapy) => {
                  const Icon = therapyIconMap[therapy.id];
                  return (
                    <div
                      key={therapy.id}
                      className="flex flex-col items-center gap-2 px-3 py-5 text-center"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e8d9bb] bg-[#f8f2e8]">
                        <Icon size={20} className="text-[#C9972A]" strokeWidth={1.5} />
                      </span>
                      <span className="text-[11px] font-bold text-[#1f2c25] sm:text-xs">
                        {therapy.title}
                      </span>
                      <span className="text-[10px] leading-tight  sm:text-[11px]">
                        {therapy.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="benefits" className="mt-2 scroll-mt-24">
              <h2 className="text-sm text-[#1f2c25] font-semibold">{benefitsHeading}</h2>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit.id} className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#5c8a6b]" />
                    <span className="text-xs sm:text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="modern-life" className="mt-2">
              <h2 className="text-sm text-[#1f2c25] font-semibold">{modernLife.heading}</h2>
              <p className="mt-3 text-xs leading-relaxed sm:text-sm">{modernLife.body}</p>
            </section>

            <section id="right-space" className="mt-2">
              <h2 className="text-sm text-[#1f2c25] font-semibold">{rightSpace.heading}</h2>
              <p className="mt-3 text-xs leading-relaxed sm:text-sm">{rightSpace.body}</p>
            </section>

            <section id="ensis-approach" className="mt-2">
              <h2 className="text-sm text-[#1f2c25] font-semibold">{ensisApproach.heading}</h2>
              <p className="mt-3 text-xs leading-relaxed sm:text-sm">{ensisApproach.body}</p>
            </section>

            <section id="conclusion" className="mt-2">
              <h2 className="text-sm text-[#1f2c25] font-semibold">{conclusion.heading}</h2>
              <p className="mt-3 text-xs leading-relaxed sm:text-sm">{conclusion.body}</p>
            </section>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
              <span className="text-xs font-bold text-[#1f2c25]">Tags :</span>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-[#1f2c25]">Share :</span>
              {[FaFacebookF, FaXTwitter, FaLinkedinIn, FaWhatsapp].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[#C9972A] hover:text-[#C9972A]"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </article>

          {/* ---------- Sidebar ---------- */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* About the author */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h3 className="font-serif text-base text-[#1f2c25]">About the Author</h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image src={author.avatar} alt={author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1f2c25]">{author.name}</p>
                    <p className="text-[11px]">{author.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed">{author.bio}</p>
                <div className="mt-4 flex items-center gap-2">
                  {author.socials.map((social) => {
                    const Icon = socialIconMap[social.platform];
                    return (
                      <a
                        key={social.platform}
                        href={social.href}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 transition-colors hover:border-[#C9972A] hover:text-[#C9972A]"
                      >
                        <Icon size={14} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* On this page */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h3 className="font-serif text-base text-[#1f2c25]">On This Page</h3>
                <ul className="mt-3 space-y-2.5">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-[11px] text-slate-600 transition-colors hover:text-[#C9972A]"
                      >
                        <Circle size={6} className="fill-[#C9972A] text-[#C9972A]" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download guide */}
              <div className="rounded-2xl bg-[#0f2e22] p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f3d2e]">
                  <Download size={18} className="text-[#e8c766]" />
                </span>
                <h3 className="mt-4 font-serif text-base leading-snug text-white">{guide.heading}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-white/70">{guide.description}</p>
                <a
                  href={guide.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#e8c766] px-4 py-2.5 text-[11px] font-bold tracking-wide text-[#0f2e22] transition-colors hover:bg-[#dcb851]"
                >
                  {guide.buttonLabel}
                  <Download size={14} />
                </a>
              </div>

              {/* Related articles */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h3 className="font-serif text-base text-[#1f2c25]">You May Also Like</h3>
                <div className="mt-4 space-y-4">
                  {relatedArticles.map((item) => (
                    <Link key={item.id} href={item.href} className="group flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold leading-snug text-[#1f2c25] group-hover:text-[#C9972A]">
                          {item.title}
                        </p>
                        <p className="mt-1.5 text-[10px] text-slate-500">
                          {item.date} • {item.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default BlogArticleLayout;