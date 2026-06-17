import { CtaBannerData } from "@/types/enquary/ctaBanner";
import ctaBanner from "@/assets/enquiry/getIntouch.webp"
import touch_left from "@/assets/enquiry/touch_left.webp"
import touch_right from "@/assets/enquiry/touch_right.webp"
export const ctaBannerFallbackData: CtaBannerData = {
  heading: "Ready to Create a Landmark in Wellness?",
  description:
    "From concept to completion, ENSIS partners with you to build inspiring wellness spaces that heal, rejuvenate, and endure.",
  ctaLabel: "Let's Connect",
  ctaHref: "/contact",
  leftImage: {
    src: touch_right.src,
    alt: "Ayurvedic spa setup with brass diyas, rolled towels, frangipani flower, and candlelight",
  },
    rightImage: {
    src: touch_left.src,
    alt: "Ayurvedic spa setup with brass diyas, rolled towels, frangipani flower, and candlelight",
  },
};