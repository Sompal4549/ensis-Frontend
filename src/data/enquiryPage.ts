import { fallbackEnquiryContent } from "./enquaryBannerAndForm";
import { ctaBannerFallbackData } from "./enquaryCtaBanner";
import { staticGetInTouch } from "./getInTouchData";

export interface StaticEnquirySection {
  _id: string;
  key: string;
  data: any;
  index: number;
}

export const staticEnquirySections: StaticEnquirySection[] = [
  {
    _id: "static-enquiry-page",
    key: "enquiry.page",
    data: fallbackEnquiryContent,
    index: 1,
  },
  {
    _id: "static-enquiry-cta",
    key: "enquiry.ctaBanner",
    data: {
      heading: ctaBannerFallbackData.heading,
      description: ctaBannerFallbackData.description,
      ctaLabel: ctaBannerFallbackData.ctaLabel,
      ctaHref: ctaBannerFallbackData.ctaHref,
      leftImage: {
        imageUrl: ctaBannerFallbackData.leftImage.src,
        alt: ctaBannerFallbackData.leftImage.alt,
      },
      rightImage: {
        imageUrl: ctaBannerFallbackData.rightImage.src,
        alt: ctaBannerFallbackData.rightImage.alt,
      },
    },
    index: 2,
  },
  {
    _id: "static-enquiry-get-in-touch",
    key: "enquiry.getInTouch",
    data: staticGetInTouch,
    index: 3,
  },
];
