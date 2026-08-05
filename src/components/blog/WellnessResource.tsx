import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../ui/Container";

interface MediaCard {
  id?: string;
  title: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  image?: string;
}

interface WellnessResourceData {
  blogsMedia?: MediaCard[];
  reportResource?: MediaCard;
}

const Card = ({ title, description, linkText, buttonHref, image }: MediaCard & { linkText?: string }) => {
  const link = buttonHref || "#";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e4d5c2] bg-gradient-to-br from-[#f7efe5] to-[#f2e5d5] p-5 min-h-[150px] flex justify-between items-start group">
      {/* Content */}
      <div className="relative z-10 max-w-[55%]">
        <h3 className="text-[#2f2318] text-[20px] leading-tight font-semibold">
          {title}
        </h3>

        {description && (
          <div
            className="text-[#4f4337] text-sm mt-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <Link
          href={link}
          className="mt-2 inline-flex items-center gap-4 text-[#9c6427] text-sm font-medium hover:gap-4 transition-all"
        >
          {linkText}
          <span>→</span>
        </Link>
      </div>

      {/* Image / Icon */}
      <div className="absolute right-0 bottom-0 h-full w-[48%] flex items-end justify-end">
        {image ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#f7efe5]/30 to-[#f7efe5]" />
            <div className="relative h-full w-full">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-20 h-20 border-2 border-[#b97b3f] rounded-xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#b97b3f]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 3h7l5 5v13H7V3z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 3v6h6" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 13h6M9 17h4" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WellnessResources = ({ sectionContent }: { sectionContent: any }) => {
  const data: WellnessResourceData = sectionContent?.data || sectionContent || {};
  const mediaCards = data.blogsMedia || [];
  const report = data.reportResource;

  const cards: MediaCard[] = [
    ...mediaCards.map((c) => ({
      title: c.title,
      description: c.description,
      buttonLabel: c.buttonLabel,
      buttonHref: c.buttonHref,
      image: c.image,
    })),
    ...(report
      ? [{
          title: report.title,
          description: report.description,
          buttonLabel: report.buttonLabel,
          buttonHref: report.buttonHref,
          image: report.image,
        }]
      : []),
  ];

  if (cards.length === 0) return null;

  return (
    <section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <Card
              key={card.title + index}
              title={card.title}
              description={card.description}
              linkText={card.buttonLabel}
              buttonHref={card.buttonHref}
              image={card.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
export default WellnessResources;