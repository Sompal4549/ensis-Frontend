"use client";

import { useState, type KeyboardEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import ProductFeatures from "./ProductFeature";

type GalleryImage = string | StaticImageData;

export default function ProductGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div className="grid grid-cols-[180px_1.2fr_120px] gap-6 w-full bg-[#f5f0e8] items-start relative pt-20 px-5 rounded-md">
      {/* PREVIOUS: grid-cols-[180px_1.2fr_130px] — thumb column 10px smaller */}
      <div className="absolute top-0 left-0 w-full h-auto pl-5 pt-5">
         <h2 className="text-xl uppercase font-semibold"
        >
        Wooden Utility Trolley
      </h2>
      <p className="mt-1 leading-tight text-lg font-semibold text-[#6b7c45]"
       >
        For Panchkarma Room
      </p>
      </div>
      {/* LEFT column: description + features */}
      <div className="flex flex-col">
        <ProductFeatures />
      </div>

      {/* CENTER column: main large image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#f4f0eb] ">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="65vw"
          className="object-cover"
        />
      </div>

      {/* RIGHT column: Multiple Views */}
      <div className="flex flex-col gap-4 -mt-15">
        <p className="text-base font-bold uppercase tracking-[0.15em]">
          Multiple Views
        </p>

        <div className="flex flex-col gap-1.5">
          {images.map((image, index) => (
            <button
              key={`${title}-thumb-${index}`}
              type="button"
              aria-label={`Show ${title} image ${index + 1}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`group relative flex flex-col overflow-hidden rounded transition-all duration-200`}
            >
              <div className="relative w-full aspect-[3/3] overflow-hidden">
                <Image
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div
                className={`text-center transition-colors duration-200`}
              >
                <span
                  className={`text-base font-bold uppercase tracking-[0.1em]`}
                >
                  {index === 0 ? "Front View" : index === 1 ? "Side View" : "Rear View"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}