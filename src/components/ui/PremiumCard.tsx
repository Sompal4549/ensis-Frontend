import { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
};

export const PremiumCard = ({
  children,
  className = "",
}: PremiumCardProps) => {
  return (
   <div className="rounded-2xl bg-gradient-to-br from-[#fff4c7] via-[#d4af37] to-[#b8860b] p-[1.5px]
shadow-[0_18px_45px_rgba(95,68,22,0.20),0_8px_20px_rgba(0,0,0,0.10),0_0_24px_rgba(212,175,55,0.12)]">
      <div
        className={`
          relative overflow-hidden rounded-[15px]
          bg-gradient-to-b from-[#faf7f2] via-[#f5efe6] to-[#efe5d5]
          before:absolute before:inset-x-0 before:top-0 before:h-px
          before:bg-gradient-to-r before:from-transparent before:via-[#fff6d5] before:to-transparent
          after:absolute after:-top-16 after:-right-16 after:h-40 after:w-40
          after:rounded-full after:bg-[#d4af3720] after:blur-3xl
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};