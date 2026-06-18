"use client";

import React from "react";
import EnquiryBannerAndForm from "./EnquaryBannerAndForm";
import CtaBanner from "./CtaBanner";
import GetInTouchBanner from "./GetInTouch";

interface RenderEnquirySectionsProps {
  section: {
    key: string;
    data: any;
    _id: string;
  };
}

const RenderEnquirySections: React.FC<RenderEnquirySectionsProps> = ({ section }) => {
  const { key, data, _id } = section;

  switch (key) {
    case "enquiry.page":
      // The data for EnquiryBannerAndForm is directly the content prop
      return <EnquiryBannerAndForm key={_id} content={data} />;

    case "enquiry.ctaBanner":
      return (
        <CtaBanner
          key={_id}
          data={{
            heading: data.heading,
            description: data.description,
            ctaLabel: data.ctaLabel,
            ctaHref: data.ctaHref,
            leftImage: { src: data.leftImage.imageUrl, alt: data.leftImage.alt },
            rightImage: { src: data.rightImage.imageUrl, alt: data.rightImage.alt },
          }}
        />
      );

    case "enquiry.getInTouch":
      return (
        <GetInTouchBanner key={_id} data={{ heading: data.heading, items: data.items }} />
      );

    default:
      return null;
  }
};

export default RenderEnquirySections;