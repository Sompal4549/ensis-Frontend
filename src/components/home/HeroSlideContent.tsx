"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { Container } from "../ui/Container";
import { getImageUrl } from "@/lib/api/api";
import GreenButton from "../ui/GreenButton";
import BookButton from "../ui/BookButton";
import arrow from "@/assets/icons/arrow.png";
import ayurvedic_wisdom from "@/assets/icons/ayurvedic_wisdom.webp";

export type HeroSlide = {
  id?: any;
  image: any;
  title: React.ReactNode;
  highlight?: string;
  description?: string;
  primaryBtn?: string;
  secondaryBtn?: string;
  showLutus?: boolean;
  listdesc?: string[];
  listItems?: string[];
  isCenter?: boolean;
  buttons?: React.ReactNode[];
  icons?: React.ReactNode[];
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  features?: { imgUrl?: string; title?: string }[];
};

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

// Content container: image load hone ke baad hi children aate hain
const contentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 1.15 },
  },
};

// Heading: modern blur-fade + spring pop
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 55, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 110, damping: 18 },
  },
};

// Text items: smooth blur fade-up
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

// Buttons: subtle spring pop
const popVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 18 },
  },
};

export default function HeroSlideContent({
  slide,
  slideIndex,
  isActive,
}: {
  slide: HeroSlide;
  slideIndex: number;
  isActive: boolean;
}) {
  const visibleFeatures = (slide.features || []).filter(
    (feat) => feat?.title || feat?.imgUrl
  );

  return (
    <>
      {/* Background Image - pehle load hota hai */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: isActive ? 1 : 1.08 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src={typeof slide.image === "string" ? getImageUrl(slide.image) : slide.image}
          alt=""
          fill
          priority={slideIndex === 0}
          className="object-cover object-center xl:object-center xl:object-fill"
          crossOrigin="anonymous"
          sizes="100vw"
        />
      </motion.div>

      {/* Mobile overlay - top se bottom tak taaki text readable rahe */}
      <motion.div
        className="absolute inset-0 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background:
            "linear-gradient(to bottom, rgba(247,242,234,0.82), rgba(247,242,234,0.35) 45%, rgba(247,242,234,0.78))",
        }}
      />

      {/* Content - image ke baad staggered */}
      <motion.div
        className="relative z-10 h-full"
        variants={contentVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <Container className="flex h-full items-center">
          <div
            className={`max-w-[620px] w-full ${
              slide.isCenter && "flex flex-col items-center text-center"
            }`}
          >
            {/* Main Heading */}
            <motion.h1
              variants={headingVariants}
              className="mb-4 text-[#0e3d21]"
            >
              {typeof slide.title === "string" ? (
                <>
                  {slide.title}
                  {slide.highlight && (
                    <>
                      <br />
                      <span className="text-[#a9742a]">
                        {slide.highlight}
                      </span>
                    </>
                  )}
                </>
              ) : (
                slide.title
              )}
            </motion.h1>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className={`flex w-full py-2 ${
                slide.isCenter && "flex flex-col items-center justify-center"
              }`}
            >
              <Image
                src={arrow}
                alt="arrow"
                width={350}
                height={10}
                className="max-w-[220px] sm:max-w-[300px] md:max-w-[350px]"
                crossOrigin="anonymous"
              />
            </motion.div>

            {/* Description */}
            {slide.description && (
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base font-semibold text-[#313628]"
                dangerouslySetInnerHTML={{ __html: slide.description }}
              />
            )}

            {/* List desc */}
            {((slide.listItems || slide.listdesc) as string[])?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center text-base font-semibold text-[#313628]"
              >
                {((slide.listItems || slide.listdesc) as string[])?.map(
                  (item, i, arr) => (
                    <React.Fragment key={item}>
                      <span className="nav-item">{item}</span>
                      {i < arr.length - 1 && (
                        <span className="nav-divider mx-2">|</span>
                      )}
                    </React.Fragment>
                  )
                )}
              </motion.div>
            )}

            {/* Icons / Features */}
            {visibleFeatures.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mt-4 md:mt-6 grid grid-cols-2 gap-x-2 gap-y-4 md:flex md:flex-wrap md:gap-5"
              >
                <div className="flex items-center self-stretch">
                  {visibleFeatures.map((feat, fi) => (
                    <React.Fragment key={fi}>
                      <div className="flex flex-col items-center gap-1 md:gap-4 px-1 md:px-6 first:md:pl-0 first:md:pr-6">
                        <div
                          className="w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                          style={{ border: "2px solid #b89060" }}
                        >
                          {feat.imgUrl ? (
                            <Image
                              src={getImageUrl(feat.imgUrl)}
                              alt={feat.title || ""}
                              width={18}
                              height={18}
                              className="object-contain md:w-[28px] md:h-[28px]"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <Image
                              src={ayurvedic_wisdom}
                              alt={feat.title || ""}
                              width={18}
                              height={18}
                              className="object-contain md:w-[28px] md:h-[28px]"
                              crossOrigin="anonymous"
                            />
                          )}
                        </div>
                        <div className="flex flex-col items-center">
                          {(() => {
                            const words = (feat.title || "").split(" ");
                            const lines = words.length === 3 ? [words.slice(0, 2).join(" "), words[2]] : words;
                            return lines.map((line, wi) => (
                              <span
                                key={wi}
                                className="text-[11px] sm:text-sm md:text-base font-bold tracking-tight uppercase text-center leading-tight"
                                style={{
                                  color: "#4a3a28",
                                  fontFamily: "var(--font-montserrat), sans-serif",
                                }}
                              >
                                {line}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                      {fi < visibleFeatures.length - 1 && (
                        <div
                          className="hidden md:block w-px h-full flex-shrink-0 opacity-40"
                          style={{ background: "#c8a97a" }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Buttons */}
            <motion.div
              variants={popVariants}
              className="mt-4 md:mt-6 flex flex-col gap-4 sm:flex-row"
            >
              {slide.buttons && slide.buttons.length > 0 ? (
                slide.buttons.map((button, index) => <div key={index}>{button}</div>)
              ) : (
                <>
                  {(slide.primaryButtonText || slide.primaryBtn) && (
                    <BookButton
                      text={slide.primaryButtonText || slide.primaryBtn}
                      path={slide.primaryButtonHref || "/contact"}
                    />
                  )}
                  {(slide.secondaryButtonText || slide.secondaryBtn) && (
                    <GreenButton
                      text={slide.secondaryButtonText || slide.secondaryBtn}
                      path={slide.secondaryButtonHref || "/contact"}
                    />
                  )}
                </>
              )}
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </>
  );
}
