'use client';

import { useState } from 'react';
import { Plus, Info, ClipboardList, Wrench, ShieldCheck, HelpCircle, type LucideIcon } from 'lucide-react';

export type HomeFaq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
};

const categoryIcons: Record<string, LucideIcon> = {
  General: Info,
  'Request Process': ClipboardList,
  Services: Wrench,
  Support: ShieldCheck,
};

export default function FaqAccordion({ faqs }: { faqs: HomeFaq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="flex flex-col gap-2.5">
      {faqs.map((faq) => {
        const isOpen = openId === faq._id;
        const Icon = categoryIcons[faq.category || ''] || HelpCircle;
        const panelId = `faq-panel-${faq._id}`;

        return (
          <li
            key={faq._id}
            className={`rounded-lg border bg-white transition-shadow duration-300 ${
              isOpen ? 'border-[#c9a86a] shadow-sm' : 'border-[#e1d7c9] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-sm'
            }`}
          >
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : faq._id)}
                className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left md:gap-3.5 md:px-3.5 md:py-2"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-[#c9a86a] bg-[radial-gradient(circle_at_30%_30%,#1a3d28,#0f2518)] text-[#e4c88f] md:size-9">
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                <span className="h-5 w-px shrink-0 bg-[#e1d7c9]" aria-hidden />
                <span className="flex-1 text-[14px] font-semibold leading-snug text-[#1f261b] md:text-[15px]">
                  {faq.question}
                </span>
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border border-[#8d6a3a] text-[#8d6a3a] transition-all duration-300 ${
                    isOpen ? 'rotate-45 bg-[#8d6a3a] text-white' : ''
                  }`}
                  aria-hidden
                >
                  <Plus size={14} />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line border-t border-[#efe8dc] px-3.5 py-2.5 text-sm leading-relaxed text-[#4a4a3f] md:pl-[64px]">
                  {faq.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
