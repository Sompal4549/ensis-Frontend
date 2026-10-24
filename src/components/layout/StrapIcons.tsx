import type { SVGProps } from "react";

/**
 * Line icons for the footer features strip, drawn to match the approved design
 * (single-weight gold outlines; the truck is solid). 48x48 viewBox, sized by the parent.
 */
const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const LeafIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M12 35C8 22 17 11 41 7C42 30 31 42 12 35Z" />
    <path d="M12 35L5 44" />
    <path d="M15 32L29 17M21 26V19" />
  </svg>
);

export const SproutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M9 42H41" />
    <path d="M25 42V25" />
    <path d="M25 30C16 32 10 26 14 22C18 19 24 23 25 30Z" />
    <path d="M25 22C24 11 31 5 37 7C41 12 34 22 25 22Z" />
    <path d="M25 27C23 21 27 16 31 18" />
  </svg>
);

export const GearIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M19.8 10.1 L20.5 4.3 L27.5 4.3 L28.2 10.1 L30.8 11.2 L35.5 7.6 L40.4 12.5 L36.8 17.2 L37.9 19.8 L43.7 20.5 L43.7 27.5 L37.9 28.2 L36.8 30.8 L40.4 35.5 L35.5 40.4 L30.8 36.8 L28.2 37.9 L27.5 43.7 L20.5 43.7 L19.8 37.9 L17.2 36.8 L12.5 40.4 L7.6 35.5 L11.2 30.8 L10.1 28.2 L4.3 27.5 L4.3 20.5 L10.1 19.8 L11.2 17.2 L7.6 12.5 L12.5 7.6 L17.2 11.2 Z" />
    <circle cx="24" cy="24" r="5" />
  </svg>
);

export const DiamondIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} strokeWidth={3} {...props}>
    <path d="M13 8H35L44 19L24 43L4 19Z" />
    <path d="M4 19H44" />
    <path d="M13 8L19 19L24 43L29 19L35 8" />
    <path d="M19 19L24 8L29 19" />
  </svg>
);

export const TruckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} strokeWidth={0} fill="currentColor" {...props}>
    <path d="M5 11H31V33H5Z" />
    <path d="M9 15H27V29H9Z" fill="#fdf0df" />
    <path d="M33 17H38C40 17 41 18 42 20L45 26C46 27 46 28 46 29V35H33Z" />
    <path d="M37 21H40L42 26H37Z" fill="#fdf0df" />
    <path d="M2 19H5V21H2Z" />
    <circle cx="15" cy="36" r="5.5" />
    <circle cx="37" cy="36" r="5.5" />
    <circle cx="15" cy="36" r="2" fill="#fdf0df" />
    <circle cx="37" cy="36" r="2" fill="#fdf0df" />
  </svg>
);
