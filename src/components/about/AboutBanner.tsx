import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import banner_image from "@/assets/about_new/about_banner.webp"
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
import lotus from "@/assets/about_new/about_lotus.png";
import { Container } from "../ui/Container";
import { getImageUrl } from "@/app/lib/api";

interface AboutBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  highlight?: string;
  image?: {imageUrl:string; alt:string;};
  primaryBtnText?: string;
  primaryBtnPath?: string;
  secondaryBtnText?: string;
  secondaryBtnPath?: string;
}

export default async function AboutHero({
  title = "Crafting Wellness Spaces",
  subtitle = "About Ensis",
  description = "India's trusted manufacturer of Panchkarma equipment, wellness furniture and turnkey spa interiors since 2003. We design, build and install complete wellness centres that blend Ayurvedic wisdom with modern comfort.",
  highlight = "That Heal & Inspire",
  primaryBtnText = "Our Journey",
  primaryBtnPath = "/about",
  secondaryBtnText = "Explore Products",
  secondaryBtnPath = "/products",
  image
}: AboutBannerProps) {
  const bannerData =  {
    title,
    subtitle,
    description,
    highlight,
    image,
    primaryBtnText,
    primaryBtnPath,
    secondaryBtnText,
    secondaryBtnPath,
  };

  // Merge API data over prop defaults
  const resolvedTitle = bannerData?.title ?? title;
  const resolvedSubtitle = bannerData?.subtitle ?? subtitle;
  const resolvedDescription = bannerData?.description ?? description;
  const resolvedHighlight = bannerData?.highlight ?? highlight;
  const resolvedPrimaryBtnText = bannerData?.primaryBtnText ?? primaryBtnText;
  const resolvedPrimaryBtnPath = bannerData?.primaryBtnPath ?? primaryBtnPath;
  const resolvedSecondaryBtnText = bannerData?.secondaryBtnText ?? secondaryBtnText;
  const resolvedSecondaryBtnPath = bannerData?.secondaryBtnPath ?? secondaryBtnPath;
  const resolvedImage = bannerData?.image ?? image;

  const imageUrl = resolvedImage?.imageUrl;

  return (
    <section className="relative overflow-hidden">
      <Image 
        priority 
        alt={resolvedImage?.alt ?? "about banner"}
        src={imageUrl ? getImageUrl(imageUrl) : banner_image} 
        fill 
        className="object-cover object-right absolute inset-0" 
        crossOrigin="anonymous" 
        sizes="100vw" 
      />
      <Container className="bg-black md:bg-transparent">
        <div className="relative min-h-[470px] w-full">
          <div className="absolute inset-0" />
          <div className="relative z-10 mx-auto flex min-h-[450px] max-w-[1500px] items-center">
            <div className="max-w-[620px] pt-10 pb-12 md:pt-16 md:pb-16">
              <div className="mb-5 flex items-center gap-3">
                <Image alt="lotus" src={lotus} width={20} height={20} className="h-full object-contain" crossOrigin="anonymous" />
                <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#d6a85f]">
                  {resolvedSubtitle}
                </span>
                <div className="h-[1px] w-14 bg-[#d6a85f]" />
              </div>

              <h1 className="text-[38px] font-medium leading-[1.08] text-white sm:text-[48px] md:text-5xl">
                {resolvedTitle}
                <span className="mt-1 block text-[#d6a85f]">
                  {resolvedHighlight}
                </span>
              </h1>

              <p className="mt-5 max-w-[360px] text-xs tracking-wide leading-6 text-white">
                {resolvedDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <div className="w-35">
                  <BookButton text={resolvedPrimaryBtnText} path={resolvedPrimaryBtnPath} />
                </div>
                <div className="w-50">
                  <GreenButton text={resolvedSecondaryBtnText} path={resolvedSecondaryBtnPath} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}