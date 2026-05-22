// components/blog/sidebar/NewsletterCard.tsx

import { Container } from "../ui/Container";

export default function NewsletterCard() {
  return (
    <Container>
    <div className="rounded-xl border border-[#dcc9b5] bg-[#efe4d7] p-4">
      {/* Horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        
        {/* Text */}
        <div className="lg:shrink-0  flex-1">
          <h3 className="font-serif text-2xl text-[#2b241f] font-semibold lg:text-left text-center">
            Stay Inspired
          </h3>
          <p className="text-[15px] text-[#6e5b4d] lg:text-left text-center">
            Subscribe for wellness insights, updates, and exclusive offers.
          </p>
        </div>

        {/* Input + Button */}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row justify-end align-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="rounded-lg border border-[#d9c5b1] bg-white text-sm outline-none w-[50%] px-3 py-2"
          />
          <button className="shrink-0 rounded-lg bg-[#274217] px-3 py-2 text-sm font-medium text-white sm:w-auto w-[50%]">
            Subscribe
          </button>
        </div>

      </div>
    </div>
    </Container>
  );
}