"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { Container } from "../ui/Container";
import { getImageUrl } from "@/lib/api/api";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";

export type ProductHeroSlideData = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
  slug?: string;
  productLayout?: boolean;
  primaryButton?: { label?: string; url?: string } | null;
  secondaryButton?: { label?: string; url?: string } | null;
};

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const contentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 1.15 },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 55, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 110, damping: 18 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

const popVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 18 },
  },
};

export default function ProductHeroSlideContent({
  slide,
  slideIndex,
}: {
  slide: ProductHeroSlideData;
  slideIndex: number;
}) {
  const productLayout = !!slide.productLayout;
  const imageClass = productLayout
    ? "absolute inset-0 md:left-[42%]"
    : "absolute inset-0";

  return (
    <div className="relative h-full min-h-[470px] overflow-hidden bg-[#0b0b0b]">
      {/* Image */}
      {slide.image && (
        <motion.div
          className={imageClass}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src={getImageUrl(slide.image)}
            alt={slide.title}
            fill
            priority={slideIndex === 0}
            className={
              productLayout
                ? "object-cover object-center md:object-right scale-105"
                : "object-cover object-center scale-105"
            }
            crossOrigin="anonymous"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-20 h-full"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <Container className="flex h-full items-center pt-10 md:pt-0">
          <div className="max-w-full md:max-w-[620px]">
            <motion.h1 variants={headingVariants} className="mb-5 text-[#0e3d21]">
              {slide.title}
            </motion.h1>

            {slide.description && (
              <motion.div
                variants={itemVariants}
                className={
                  productLayout
                    ? "mb-8 max-w-[520px] text-sm leading-7 text-white/80 line-clamp-3 sm:text-base font-semibold text-[#313628]"
                    : "mb-8 max-w-[520px] text-sm sm:text-base font-medium text-[#313628] line-clamp-6"
                }
                dangerouslySetInnerHTML={{ __html: slide.description }}
              />
            )}

            {typeof slide.price === "number" && slide.price > 0 && (
              <motion.div variants={itemVariants} className="mb-8">
                <span
                  className={`text-2xl font-bold sm:text-3xl md:text-4xl ${
                    productLayout ? "text-white" : "text-[#c07d19]"
                  }`}
                >
                  ₹{slide.price.toLocaleString("en-IN")}
                </span>
              </motion.div>
            )}

            <motion.div
              variants={popVariants}
              className="flex flex-col gap-4 sm:flex-row"
            >
              {slide.primaryButton?.label && (
                <BookButton
                  text={slide.primaryButton.label}
                  path={slide.primaryButton.url || "/contact"}
                />
              )}
              {slide.secondaryButton?.label && (
                <GreenButton
                  text={slide.secondaryButton.label}
                  path={slide.secondaryButton.url || "/contact"}
                />
              )}
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </div>
  );
}
