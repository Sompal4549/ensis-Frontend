import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import banner_image from "@/assets/about_new/about_banner.webp"
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
import lotus from "@/assets/about_new/about_lotus.png";
import { Container } from "../ui/Container";
import {  getImageUrl } from "@/lib/api/api";
import StatsStrip from "@/components/about/StatsStrip";
export interface AboutBannerContent { // Renamed to AboutBannerContent
  title?: string;
  heading?: string;
  description?: string;
  highlight?: string;
  image?: {imageUrl:string; alt:string;};
  primaryBtnText?: string;
  primaryBtnPath?: string;
  secondaryBtnText?: string;
  secondaryBtnPath?: string;
}

interface AboutBannerProps { // Renamed to AboutBannerProps for the component
  sectionContent?: AboutBannerContent; // Use the new interface
}

export default async function AboutHero({
sectionContent = {}
}: AboutBannerProps) {


  // Merge API data over prop defaults
  const resolvedTitle = sectionContent?.title;
  const resolvedSubtitle = sectionContent?.heading;
  const resolvedDescription = sectionContent?.description;
  const resolvedHighlight = sectionContent?.highlight;
  const resolvedPrimaryBtnText = sectionContent?.primaryBtnText;
  const resolvedPrimaryBtnPath = sectionContent?.primaryBtnPath;
  const resolvedSecondaryBtnText = sectionContent?.secondaryBtnText;
  const resolvedSecondaryBtnPath = sectionContent?.secondaryBtnPath;
  const resolvedImage = sectionContent?.image;

  const imageUrl = resolvedImage?.imageUrl;

  return (
    <section className="relative overflow-visible mb-40 md:mb-20">
      {/* Background image kept in its own overflow-hidden layer so it still
          stays clipped to the hero, while the section itself stays
          overflow-visible so StatsStrip's absolute+translate overlap below
          isn't cut off on desktop. */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          priority
          alt={resolvedImage?.alt ?? "about banner"}
          src={imageUrl ? getImageUrl(imageUrl) : banner_image}
          fill
          className="object-cover md:object-right"
          crossOrigin="anonymous"
          sizes="100vw"
        />
      </div>
      <Container className="bg-black md:bg-transparent">
        <div className="relative min-h-[470px] md:h-[calc(100vh-146px)] w-full">
          <div className="relative z-10 mx-auto flex min-h-[450px] max-w-[1500px] items-center h-full">
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

              <p className="mt-5 max-w-[360px] text-xs tracking-wide leading-6 text-white" dangerouslySetInnerHTML={{__html:resolvedDescription||""}}>
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
      <StatsStrip/>
    </section>
  );
}