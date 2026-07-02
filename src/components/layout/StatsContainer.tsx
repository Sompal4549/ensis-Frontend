import { ReactNode } from "react";

interface StatsContainerProps {
  children: ReactNode;
  className?: string;
  height?: "sm" | "md" | "lg";
}

const heights = {
  sm: "h-[72px] md:h-[80px]",
  md: "h-[88px] md:h-[96px]",
  lg: "h-[104px] md:h-[112px]",
};

export default function StatsContainer({
  children,
  className = "",
  height = "md",
}: StatsContainerProps) {
  return (
    <section
      className={`w-full flex items-center ${heights[height]} ${className}`}
    >
      {children}
    </section>
  );
}