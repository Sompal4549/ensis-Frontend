import heroAyurveda from "@/assets/solutions/ayurveda-hospital-solution/hero_image.png";
import approachAyurveda from "@/assets/solutions/ayurveda-hospital-solution/a_hospital_designed.png";
import ctaAyurveda from "@/assets/solutions/ayurveda-hospital-solution/inspired_spaces.png";
import cardAyurveda from "@/assets/solutions/ayurveda-hospital-solution/card.png";

import heroPanchkarma from "@/assets/solutions/panchkarma-clinic-setup/hero.png";
import cardPanchkarma from "@/assets/solutions/panchkarma-clinic-setup/card_image.png";
import ctaPanchkarma from "@/assets/solutions/panchkarma-clinic-setup/inspired_spaces.png";
import approachPanchkarma from "@/assets/solutions/panchkarma-clinic-setup/a_hospital_designed.png";
import heroResort from "@/assets/solutions/resort-and-spa/hero.png";
import cardResort from "@/assets/solutions/resort-and-spa/card.png";
import ctaResort from "@/assets/solutions/resort-and-spa/inspired_spaces.png";
import approachResort from "@/assets/solutions/resort-and-spa/a_hospital_designed.png";
import heroWellness from "@/assets/solutions/wellness-retreat-design/hero.png";
import cardWellness from "@/assets/solutions/wellness-retreat-design/card.png";
import ctaWellness from "@/assets/solutions/wellness-retreat-design/inspired_spaces.png";
import approachWellness from "@/assets/solutions/wellness-retreat-design/a_hospital_designed.png";
import heroInterior from "@/assets/solutions/interior-equipment-integration/hero.png";
import cardInterior from "@/assets/solutions/interior-equipment-integration/card.png";
import ctaInterior from "@/assets/solutions/interior-equipment-integration/inspired_spaces.png";
import approachInterior from "@/assets/solutions/interior-equipment-integration/a_hospital_designed.png";

export interface SolutionStat {
  icon: string;
  top: string;
  text: string;
}

export interface SolutionSpace {
  title: string;
  text: string;
  icon: string;
}

export interface SolutionService {
  title: string;
  text: string;
  icon: string;
}

export interface SolutionProcess {
  number: string;
  title: string;
  text: string;
}

export interface SolutionSolution {
  image: any;
  title: string;
  category: string;
  href: string;
}

export interface SolutionData {
  slug: string;
  hero: {
    eyebrow: string;
    heading: [string, string] | [string, string, string];
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: any;
    imageAlt: string;
  };
  stats: SolutionStat[];
  approach: {
    eyebrow: string;
    heading: [string, string];
    paragraphs: [string, string];
    image: any;
    imageAlt: string;
  };
  spaces: {
    eyebrow: string;
    heading: string;
    description: string;
    items: SolutionSpace[];
  };
  cta: {
    eyebrow: string;
    heading: [string, string];
    description: string;
    buttonText: string;
    image: any;
    imageAlt: string;
  };
}

export const services: SolutionService[] = [
  {
    title: "CONSULTANCY & FEASIBILITY",
    text: "Market study, concept development and strategic planning.",
    icon: "ClipboardCheck",
  },
  {
    title: "ARCHITECTURE & SPACE PLANNING",
    text: "Functional layouts that align with Ayurveda principles.",
    icon: "LayoutGrid",
  },
  {
    title: "INTERIOR DESIGN",
    text: "Natural materials, soothing aesthetics and patient-centric design.",
    icon: "Sparkles",
  },
  {
    title: "EQUIPMENT & FURNITURE",
    text: "Ayurveda specific equipment and custom furniture.",
    icon: "BedDouble",
  },
  {
    title: "OPERATIONAL PLANNING",
    text: "SOPs, workflow, staff planning and process design.",
    icon: "Settings",
  },
  {
    title: "PROJECT EXECUTION",
    text: "Turnkey execution with quality, timeline and cost control.",
    icon: "HardHat",
  },
  {
    title: "TRAINING & SUPPORT",
    text: "Training, hand-holding and post-launch support.",
    icon: "HandHeart",
  },
];

export const process: SolutionProcess[] = [
  {
    number: "01",
    title: "DISCOVER",
    text: "Understanding your vision, goals and requirements.",
  },
  {
    number: "02",
    title: "PLAN",
    text: "Space planning, concept development and feasibility.",
  },
  {
    number: "03",
    title: "DESIGN",
    text: "Architectural and interior design with details.",
  },
  {
    number: "04",
    title: "EQUIP",
    text: "Selection and supply of equipment and furniture.",
  },
  {
    number: "05",
    title: "EXECUTE",
    text: "Project execution with precision and transparency.",
  },
  {
    number: "06",
    title: "LAUNCH & SUPPORT",
    text: "Operational readiness and continuous support.",
  },
];

const solutionCardImages: Record<string, any> = {
  "panchkarma-clinic-setup": cardPanchkarma,
  "resort-spa-setup": cardResort,
  "wellness-retreat-design": cardWellness,
  "ayurveda-hospital-setup": cardAyurveda,
  "interior-equipment-integration": cardInterior,
};

export const solutions: SolutionData[] = [
  {
    slug: "ayurveda-hospital-setup",
    hero: {
      eyebrow: "AYURVEDA HOSPITAL SETUP",
      heading: ["Where Ayurveda Meets", "The Art Of Healing."],
      description:
        "From concept and space planning to interiors, equipment and operational readiness, ENSIS creates thoughtfully planned Ayurveda hospitals that bring traditional healing practices into contemporary healthcare environments.",
      primaryCta: "DISCUSS YOUR HOSPITAL PROJECT",
      secondaryCta: "EXPLORE OUR APPROACH",
      image: heroAyurveda,
      imageAlt: "ENSIS Ayurveda Hospital",
    },
    stats: [
      { icon: "Leaf", top: "20+", text: "YEARS EXPERIENCE" },
      { icon: "Flower2", top: "COMPLETE", text: "SETUP SOLUTIONS" },
      { icon: "LayoutGrid", top: "DESIGN +", text: "CONSULTANCY" },
      { icon: "HandHeart", top: "EQUIPMENT +", text: "SUPPORT" },
    ],
    approach: {
      eyebrow: "THE ENSIS APPROACH",
      heading: ["A Hospital Designed", "Around Healing."],
      paragraphs: [
        "An Ayurveda hospital requires more than rooms and equipment. Every space must support the patient journey, therapeutic practices, clinical functionality, staff movement and the philosophy of Ayurveda.",
        "ENSIS brings together spatial planning, interior design, Ayurveda-specific equipment, operational understanding and project support to create complete environments built around healing.",
      ],
      image: approachAyurveda,
      imageAlt: "Ayurveda hospital interior",
    },
    spaces: {
      eyebrow: "COMPLETE HOSPITAL INTEGRATION",
      heading: "EVERY ELEMENT. PERFECTLY ALIGNED.",
      description:
        "We integrate design, equipment and wellness solutions to create seamless Ayurveda hospital environments.",
      items: [
        {
          title: "SPA & THERAPY EQUIPMENT",
          text: "Premium Ayurvedic and international equipment for every therapy.",
          icon: "BedDouble",
        },
        {
          title: "INTERIORS & FURNITURE",
          text: "Bespoke furniture and interiors that reflect nature and luxury.",
          icon: "Frame",
        },
        {
          title: "LIGHTING DESIGN",
          text: "Ambient lighting that enhances mood, comfort and healing.",
          icon: "Lamp",
        },
        {
          title: "MATERIALS & FINISHES",
          text: "Natural, sustainable materials that create warmth and harmony.",
          icon: "Flower2",
        },
        {
          title: "WET AREA SOLUTIONS",
          text: "Steam, sauna, Jacuzzi and hydrotherapy spaces designed to perfection.",
          icon: "Droplets",
        },
        {
          title: "UTILITY & BACK END",
          text: "Smart utility planning for smooth operations and guest comfort.",
          icon: "Settings",
        },
      ],
    },
    cta: {
      eyebrow: "LET'S BUILD A HEALING SPACE TOGETHER",
      heading: ["Inspired Spaces.", "Lasting Impact."],
      description:
        "Partner with ENSIS to create an Ayurveda hospital that heals, inspires and stands the test of time.",
      buttonText: "DISCUSS YOUR HOSPITAL PROJECT",
      image: ctaAyurveda,
      imageAlt: "Ayurveda healing space",
    },
  },
  {
    slug: "panchkarma-clinic-setup",
    hero: {
      eyebrow: "PANCHKARMA CLINIC SETUP",
      heading: ["Where Traditional Healing", "Meets Modern Clinic Design."],
      description:
        "From therapy room planning to equipment selection and interior design, ENSIS creates authentic Panchkarma clinics that deliver transformative healing experiences.",
      primaryCta: "DISCUSS YOUR CLINIC PROJECT",
      secondaryCta: "EXPLORE OUR APPROACH",
      image: heroPanchkarma,
      imageAlt: "ENSIS Panchkarma Clinic",
    },
    stats: [
      { icon: "Leaf", top: "20+", text: "YEARS EXPERIENCE" },
      { icon: "Flower2", top: "PANCHKARMA", text: "EXPERTISE" },
      { icon: "LayoutGrid", top: "CLINIC", text: "DESIGN" },
      { icon: "HandHeart", top: "EQUIPMENT +", text: "SUPPORT" },
    ],
    approach: {
      eyebrow: "THE ENSIS APPROACH",
      heading: ["A Clinic Designed", "For Authentic Healing."],
      paragraphs: [
        "A Panchkarma clinic requires precise spatial planning, specialized equipment, and an environment that supports detoxification and rejuvenation therapies.",
        "ENSIS brings together spatial planning, interior design, Panchkarma-specific equipment, operational understanding and project support to create complete environments built around authentic healing.",
      ],
      image: approachPanchkarma,
      imageAlt: "Panchkarma clinic interior",
    },
    spaces: {
      eyebrow: "COMPLETE PANCHKARMA CLINIC INTEGRATION",
      heading: "EVERY ELEMENT. PERFECTLY ALIGNED.",
      description:
        "We integrate design, equipment and wellness solutions to create seamless Panchkarma clinic environments.",
      items: [
        {
          title: "THERAPY ROOMS",
          text: "Purpose-built rooms for authentic Panchkarma therapies.",
          icon: "BedDouble",
        },
        {
          title: "PRE-PROCEDURE AREA",
          text: "Dedicated preparation spaces for pre-therapy procedures.",
          icon: "ClipboardCheck",
        },
        {
          title: "POST-PROCEDURE RECOVERY",
          text: "Restful recovery zones designed for optimal healing.",
          icon: "Flower2",
        },
        {
          title: "HERB PREPARATION AREA",
          text: "Specialized spaces for herbal medicine preparation.",
          icon: "Leaf",
        },
        {
          title: "CONSULTATION ROOMS",
          text: "Private, calming consultation spaces for patient assessment.",
          icon: "Sparkles",
        },
        {
          title: "RECEPTION & WAITING",
          text: "Welcoming front-of-house areas that set the tone for healing.",
          icon: "LayoutGrid",
        },
      ],
    },
    cta: {
      eyebrow: "LET'S BUILD A HEALING SPACE TOGETHER",
      heading: ["Your Vision. Our Expertise.", "Better Panchkarma Experiences."],
      description:
        "Partner with ENSIS to create a Panchkarma clinic that heals, inspires and stands the test of time.",
      buttonText: "DISCUSS YOUR CLINIC PROJECT",
      image: ctaPanchkarma,
      imageAlt: "Panchkarma healing space",
    },
  },
  {
    slug: "resort-spa-setup",
    hero: {
      eyebrow: "RESORT & SPA SETUP",
      heading: ["Where Luxury Meets", "Wellness And Transformation."],
      description:
        "From hydrotherapy pool design to treatment suite planning, ENSIS creates resort spas that blend luxury hospitality with holistic wellness experiences.",
      primaryCta: "DISCUSS YOUR RESORT PROJECT",
      secondaryCta: "EXPLORE OUR APPROACH",
      image: heroResort,
      imageAlt: "ENSIS Resort & Spa",
    },
    stats: [
      { icon: "Leaf", top: "20+", text: "YEARS EXPERIENCE" },
      { icon: "Droplets", top: "HYDROTHERAPY", text: "EXPERTISE" },
      { icon: "LayoutGrid", top: "LUXURY", text: "DESIGN" },
      { icon: "HandHeart", top: "FULL SERVICE", text: "WELLNESS" },
    ],
    approach: {
      eyebrow: "THE ENSIS APPROACH",
      heading: ["A Resort Designed", "Around Wellness."],
      paragraphs: [
        "A resort spa requires seamless integration of luxury amenities, therapeutic spaces, and operational efficiency to deliver world-class wellness experiences.",
        "ENSIS brings together spatial planning, interior design, hydrotherapy systems, equipment sourcing and project support to create complete resort environments that heal, rejuvenate and inspire.",
      ],
      image: approachResort,
      imageAlt: "Resort spa interior",
    },
    spaces: {
      eyebrow: "COMPLETE RESORT & SPA INTEGRATION",
      heading: "EVERY ELEMENT. PERFECTLY ALIGNED.",
      description:
        "We integrate design, equipment and wellness solutions to create seamless resort and spa environments.",
      items: [
        {
          title: "HYDROTHERAPY POOLS",
          text: "Custom pool design for therapeutic and recreational wellness.",
          icon: "Droplets",
        },
        {
          title: "MASSAGE SUITES",
          text: "Luxurious treatment rooms for massage and body therapies.",
          icon: "BedDouble",
        },
        {
          title: "RELAXATION LOUNGE",
          text: "Tranquil spaces for post-treatment rest and rejuvenation.",
          icon: "Lamp",
        },
        {
          title: "STEAM & SAUNA",
          text: "Premium wet areas for detoxification and thermal therapy.",
          icon: "Flower2",
        },
        {
          title: "YOGA & MEDITATION",
          text: "Serene spaces designed for mindful movement and stillness.",
          icon: "Frame",
        },
        {
          title: "RETAIL & RECEPTION",
          text: "Elegant front-of-house areas that set the tone for luxury.",
          icon: "Sparkles",
        },
      ],
    },
    cta: {
      eyebrow: "LET'S BUILD A WELLNESS DESTINATION TOGETHER",
      heading: ["Luxury Spaces.", "Wellness Redefined."],
      description:
        "Partner with ENSIS to create a resort spa that delivers unforgettable wellness experiences.",
      buttonText: "DISCUSS YOUR RESORT PROJECT",
      image: ctaResort,
      imageAlt: "Resort spa wellness space",
    },
  },
  {
    slug: "wellness-retreat-design",
    hero: {
      eyebrow: "WELLNESS RETREAT DESIGN",
      heading: ["Where Nature Meets", "Mindful Healing."],
      description:
        "From meditation hall design to holistic space planning, ENSIS creates wellness retreats that connect people with nature, stillness and inner balance.",
      primaryCta: "DISCUSS YOUR RETREAT PROJECT",
      secondaryCta: "EXPLORE OUR APPROACH",
      image: heroWellness,
      imageAlt: "ENSIS Wellness Retreat",
    },
    stats: [
      { icon: "Leaf", top: "20+", text: "YEARS EXPERIENCE" },
      { icon: "Flower2", top: "NATURE", text: "INTEGRATION" },
      { icon: "LayoutGrid", top: "RETREAT", text: "DESIGN" },
      { icon: "HandHeart", top: "HOLISTIC", text: "WELLNESS" },
    ],
    approach: {
      eyebrow: "THE ENSIS APPROACH",
      heading: ["A Retreat Designed", "Around Nature."],
      paragraphs: [
        "A wellness retreat demands spaces that harmonize with the natural landscape while supporting meditation, yoga, detox therapies and restorative practices.",
        "ENSIS brings together sustainable design, natural materials, holistic space planning and equipment integration to create retreat environments that nurture body, mind and spirit.",
      ],
      image: approachWellness,
      imageAlt: "Wellness retreat surrounded by nature",
    },
    spaces: {
      eyebrow: "COMPLETE RETREAT INTEGRATION",
      heading: "EVERY ELEMENT. PERFECTLY ALIGNED.",
      description:
        "We integrate design, nature and wellness solutions to create seamless retreat environments.",
      items: [
        {
          title: "MEDITATION HALLS",
          text: "Serene spaces crafted for mindfulness and inner stillness.",
          icon: "Frame",
        },
        {
          title: "YOGA STUDIOS",
          text: "Light-filled studios designed for movement and breathwork.",
          icon: "LayoutGrid",
        },
        {
          title: "DETOX THERAPY ROOMS",
          text: "Purpose-built rooms for Ayurvedic and holistic therapies.",
          icon: "BedDouble",
        },
        {
          title: "HERBAL GARDENS",
          text: "Integrated garden spaces for fresh medicinal herbs.",
          icon: "Leaf",
        },
        {
          title: "EATING & NUTRITION",
          text: "Communal dining spaces that celebrate wholesome, sattvic cuisine.",
          icon: "Flower2",
        },
        {
          title: "POOL & HYDROTHERAPY",
          text: "Natural water features for relaxation and therapeutic benefit.",
          icon: "Droplets",
        },
      ],
    },
    cta: {
      eyebrow: "LET'S CREATE A RETREAT TOGETHER",
      heading: ["Nature-Inspired.", "Soul-Restoring."],
      description:
        "Partner with ENSIS to create a wellness retreat that heals, inspires and reconnects with nature.",
      buttonText: "DISCUSS YOUR RETREAT PROJECT",
      image: ctaWellness,
      imageAlt: "Wellness retreat healing space",
    },
  },
  {
    slug: "interior-equipment-integration",
    hero: {
      eyebrow: "INTERIOR & EQUIPMENT INTEGRATION",
      heading: ["Where Design Meets", "Functional Excellence."],
      description:
        "From custom furniture to Ayurveda-specific equipment sourcing, ENSIS integrates interiors and equipment to create wellness spaces that are beautiful, functional and operationally efficient.",
      primaryCta: "DISCUSS YOUR PROJECT",
      secondaryCta: "EXPLORE OUR APPROACH",
      image: heroInterior,
      imageAlt: "ENSIS Interior & Equipment Integration",
    },
    stats: [
      { icon: "Leaf", top: "20+", text: "YEARS EXPERIENCE" },
      { icon: "Frame", top: "CUSTOM", text: "INTERIORS" },
      { icon: "Settings", top: "EQUIPMENT", text: "SOURCING" },
      { icon: "HandHeart", top: "SEAMLESS", text: "INTEGRATION" },
    ],
    approach: {
      eyebrow: "THE ENSIS APPROACH",
      heading: ["Interiors and Equipment", "Seamlessly Integrated."],
      paragraphs: [
        "Wellness spaces require interiors that are not only aesthetically refined but also engineered to house specialized equipment, support therapy workflows and meet clinical standards.",
        "ENSIS combines interior design expertise with deep knowledge of Ayurveda and wellness equipment to deliver spaces where every element works in harmony for healing and efficiency.",
      ],
      image: approachInterior,
      imageAlt: "Interior design and equipment integration",
    },
    spaces: {
      eyebrow: "COMPLETE INTEGRATION SOLUTIONS",
      heading: "EVERY ELEMENT. PERFECTLY ALIGNED.",
      description:
        "We integrate custom interiors, premium equipment and functional design to create cohesive wellness environments.",
      items: [
        {
          title: "THERAPY ROOM INTERIORS",
          text: "Custom-designed rooms that house equipment and inspire calm.",
          icon: "BedDouble",
        },
        {
          title: "RECEPTION & LOBBY",
          text: "Welcoming spaces that reflect brand identity and warmth.",
          icon: "Sparkles",
        },
        {
          title: "WET AREA DESIGN",
          text: "Steam, sauna and hydrotherapy zones built to specification.",
          icon: "Droplets",
        },
        {
          title: "FURNITURE & JOINERY",
          text: "Bespoke furniture crafted for comfort, durability and aesthetics.",
          icon: "Frame",
        },
        {
          title: "LIGHTING & AMBIANCE",
          text: "Layered lighting systems that enhance mood and functionality.",
          icon: "Lamp",
        },
        {
          title: "UTILITY SYSTEMS",
          text: "Back-end infrastructure for seamless daily operations.",
          icon: "Settings",
        },
      ],
    },
    cta: {
      eyebrow: "LET'S INTEGRATE YOUR WELLNESS SPACE",
      heading: ["Designed to Function.", "Built to Inspire."],
      description:
        "Partner with ENSIS to integrate interiors and equipment that create cohesive, high-performing wellness spaces.",
      buttonText: "DISCUSS YOUR PROJECT",
      image: ctaInterior,
      imageAlt: "Interior and equipment integration space",
    },
  },
];

export const solutionsMap: Record<string, SolutionData> = Object.fromEntries(
  solutions.map((s) => [s.slug, s])
);

export const allSolutionCards: SolutionSolution[] = solutions.map((s) => ({
  image: solutionCardImages[s.slug],
  title: s.hero.eyebrow,
  category:
    s.slug === "ayurveda-hospital-setup"
      ? "Complete Hospital Solutions"
      : s.slug === "panchkarma-clinic-setup"
        ? "Complete Clinic Solutions"
        : s.slug === "resort-spa-setup"
          ? "Wellness Environment Design"
          : s.slug === "wellness-retreat-design"
            ? "Retreat Planning & Design"
            : "Design & Equipment",
  href: `/solutions/${s.slug}`,
}));

export function getSolutionCardsExcluding(slug: string): SolutionSolution[] {
  return allSolutionCards.filter((c) => c.href !== `/solutions/${slug}`);
}
