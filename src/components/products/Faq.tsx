"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Container } from "../ui/Container";
import { Product } from "@/constants";

const faqs = [
  {
    question: "What type of wood is used?",
    description:
      "We use premium seasoned teak wood sourced from certified suppliers. The wood is kiln-dried to prevent warping and treated for long-term durability in humid therapy environments.",
  },
  {
    question: "Is customization available?",
    description:
      "Yes, we offer full customization including dimensions, wood finish, upholstery color, and brass fitting styles. Contact our experts to discuss your requirements.",
  },
  {
    question: "What is the delivery time?",
    description:
      "Standard products are delivered within 7–14 working days. Custom orders typically take 3–4 weeks depending on specifications and your location.",
  },
  {
    question: "Do you provide installation?",
    description:
      "Yes, installation support is available in most major cities. For other locations, we provide detailed assembly instructions and video guides.",
  },
  {
    question: "Is the product suitable for all therapies?",
    description:
      "Our tables are designed for Abhyanga, Shirodhara, Panchkarma, Pizhichil, and other traditional Ayurvedic therapies. Custom configurations are available for specific treatment needs.",
  },
  {
    question: "Is the product suitable for all therapies?",
    description:
      "Our tables are designed for Abhyanga, Shirodhara, Panchkarma, Pizhichil, and other traditional Ayurvedic therapies. Custom configurations are available for specific treatment needs.",
  },
];

export default function FaqSection({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(null);
  const overview = product?.overview
  return (
    <Container className="py-12">
      <p className="text-sm font-bold uppercase  text-[#8d6a3a] mb-6 ">
        Frequently Asked Questions
      </p>

      <div className="flex flex-col gap-2">
        {/* Question pills row — layout never shifts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {overview?.faqs?.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpen(open === i ? null : i)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-md border bg-[#f5f0ea] text-left transition-colors font-semibold ${open === i ? "border-[#8d6a3a]" : "border-[#d4c4a8]"
                }`}
            >
              <span className="text-xs font-semibold leading-snug">
                {faq.question}
              </span>

              {open === i ? (
                <Minus size={13} className="shrink-0 text-[#8d6a3a]" />
              ) : (
                <Plus size={13} className="shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Answer panel — appears below the row */}
        {open !== null && (
          <div className="border border-[#d4c4a8] rounded-md bg-white px-4 py-3">
            <p className="text-[11px] leading-relaxed">{faqs[open].description}</p>
          </div>
        )}
      </div>
    </Container>
  );
}