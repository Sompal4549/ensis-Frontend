// components/blog/sidebar/NewsletterCard.tsx

export default function NewsletterCard() {
  return (
    <div className="rounded-3xl border border-[#dcc9b5] bg-[#efe4d7] p-4">
      <h3 className="text-center font-serif text-2xl text-[#2b241f]">
        Stay Inspired
      </h3>

      <p className="mx-auto mt-2 max-w-[260px] text-center text-[15px]  text-[#6e5b4d]">
        Subscribe for wellness insights, updates, and exclusive offers.
      </p>

      <div className="mt-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="h-12 w-full rounded-lg border border-[#d9c5b1] bg-white px-4 text-sm outline-none"
        />

        <button className="mt-2 h-12 w-full rounded-lg bg-[#274217] text-sm font-medium text-white">
          Subscribe
        </button>
      </div>
    </div>
  );
}