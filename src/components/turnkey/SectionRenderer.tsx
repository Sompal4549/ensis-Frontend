"use client";

import React from "react";
import TurnkeyHero from "../turnkey/HeroBanner";
import CtaBanner from "../enquary/CtaBanner";
import GetInTouchBanner from "../enquary/GetInTouch";
import FeaturedProjects from "./FeaturedTrunkeyProjects";
import WhyChoose from "./WhyChoose";

interface SectionRendererProps {
  section: {
    key: string;
    data: any;
    _id: string;
  };
}

const RenderSections: React.FC<SectionRendererProps> = ({ section }) => {
  const { key, data, _id } = section;

  switch (key) {
    case "projects.banner":
      return (
        <TurnkeyHero
          key={_id}
          sectionContent={{
            backgroundImage: { imageUrl: data.heroImage, alt: data.bgImageAlt },
            subheading: data.subtitle,
            title: data.title.line1,
            highlight: data.title.line2,
            description: data.description,
            features: [], // Banner in JSON doesn't have features
            primaryButton: { label: "Explore", url: "#" },
            secondaryButton: { label: "Contact Us", url: "/enquiry" },
          }}
        />
      );

    case "projects.ourProjects":
      return (
        <FeaturedProjects
          key={_id}
          sectionContent={{
            title: data.title,
            subtitle: data.subtitle,
            cards: data.cards,
            buttonText: data.buttonText,
            buttonPath: data.buttonPath,
          }}
        />
      );

    case "projects.whyPartner":
      return (
        <WhyChoose
          key={_id}
          sectionContent={{
            title: data.heading,
            backgroundImage: { imageUrl: data.decorativeImageSrc, alt: data.decorativeImageAlt },
            statsTitle: "Why Partner With Us",
            stats: [], // Mapping features instead
            features: data.features.map((f: any) => ({
              id: f.id,
              title: f.title,
              image: { imageUrl: f.iconSrc, alt: f.iconAlt },
            })),
          }}
        />
      );

    case "projects.ourClients":
      return (
        <WhyChoose
          key={_id}
          sectionContent={{
            title: data.heading,
            backgroundImage: { imageUrl: "", alt: "" },
            statsTitle: data.subheading,
            stats: data.stats.map((s: any) => ({ ...s, title: s.value, description: s.label })),
            features: data.clients.map((c: any) => ({
              id: c.id,
              title: c.name,
              image: { imageUrl: c.imageSrc, alt: c.imageAlt },
            })),
          }}
        />
      );

    case "projects.contactSection":
      return (
        <React.Fragment key={_id}>
          <CtaBanner
            data={{
              heading: data.ctaTitle,
              description: data.ctaDescription,
              ctaLabel: data.ctaButtonText,
              ctaHref: data.ctaButtonPath,
              leftImage: { src: data.leftImage, alt: "Contact Left" },
              rightImage: { src: data.rightImage, alt: "Contact Right" },
            }}
          />
          <GetInTouchBanner 
             data={{
               heading: "Get In Touch",
               items: [
                 { id: "corporate-office", label: "Office", lines: [data.contact.officeName, data.contact.address] },
                 { id: "phone", label: "Phone", lines: [data.contact.phone] },
                 { id: "email", label: "Email", lines: [data.contact.email] },
               ]
             }}
          />
        </React.Fragment>
      );

    default:
      return null;
  }
};

export default RenderSections;