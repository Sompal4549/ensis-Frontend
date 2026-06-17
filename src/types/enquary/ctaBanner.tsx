import { StaticImageData } from "next/image";

export interface CtaBannerImage {
  src: StaticImageData|string;
  alt: string;
}

export interface CtaBannerData {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  leftImage: CtaBannerImage;
  rightImage: CtaBannerImage;

}

export interface CtaBannerProps {
  data?: CtaBannerData;
}