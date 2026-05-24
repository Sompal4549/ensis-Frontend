"use client";

import { useState, type KeyboardEvent } from "react";
import Image, { type StaticImageData } from "next/image";

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
    <div>
      <div className="relative flex aspect-[1.2/1] items-center justify-center overflow-hidden rounded-[8px] border border-[#dedede] bg-white">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 46vw"
          className="object-fill"
        />
      </div>

      <div className="mt-3 grid max-w-[390px] grid-cols-4 gap-2.5">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={`${title}-thumb-${index}`}
            type="button"
            aria-label={`Show ${title} image ${index + 1}`}
            aria-pressed={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`relative aspect-square overflow-hidden border bg-white transition-colors ${
              activeIndex === index
                ? "border-[#001b10] ring-1 ring-[#001b10]"
                : "border-[#dedede] hover:border-[#8d6a3a]"
            }`}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              sizes="112px"
              className="object-fill p-1.5"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
