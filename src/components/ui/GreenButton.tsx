import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type BookStallButtonProps = {
  path?: string;
  variant?: 'golden' | 'green';
  text?: string | React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const Sparkle = ({ style, color }: { style: React.CSSProperties; color: string }) => (
  <span
    className="absolute w-[5px] h-[5px] rounded-full opacity-80 animate-ping pointer-events-none"
    style={{ ...style, backgroundColor: color }}
  />
);

export default function GreenButton({ path = '/book-a-stand', variant = 'golden', text, leftIcon, rightIcon, onClick }: BookStallButtonProps) {
  const isGolden = variant === 'golden';

  return (
    <div className="relative group/btn flex align-center justify-center">
      <Sparkle style={{ top: '-10px', left: '10%', animationDelay: '0s' }} color={isGolden ? '#f0c040' : '#2a6644'} />
      <Sparkle style={{ top: '-12px', left: '40%', animationDelay: '0.4s' }} color={isGolden ? '#f0c040' : '#2a6644'} />
      <Sparkle style={{ top: '-8px', right: '15%', animationDelay: '0.8s' }} color={isGolden ? '#f0c040' : '#2a6644'} />
      <Sparkle style={{ bottom: '-10px', left: '25%', animationDelay: '0.2s' }} color={isGolden ? '#f0c040' : '#2a6644'} />
      <Sparkle style={{ bottom: '-12px', right: '30%', animationDelay: '0.6s' }} color={isGolden ? '#f0c040' : '#2a6644'} />

      <Link
        href={path}
        target="_blank"
        onClick={onClick}
        className={`flex items-center gap-1.5 px-4 h-8 rounded-lg relative z-10 hover:scale-[1.02] transition-transform
          ${isGolden
            ? 'bg-gradient-to-r from-[#f0c040] via-[#c8922a] to-[#f0c040] shadow-[0_2px_12px_rgba(200,146,42,0.35)]'
            : 'bg-[#0f2518] hover:bg-[#1a3d28] shadow-[0_2px_12px_rgba(15,37,24,0.35)]'
          }`}
      >
        <span className={`w-[14px] h-[14px] shrink-0 ${'text-white'}`}>{leftIcon}</span>
        <span className={`font-bold text-[10px] tracking-widest ${isGolden ? 'text-[#050A1A]' : 'text-white'}`}>
          {text || 'BOOK A STALL'}
        </span>
        {rightIcon || <ArrowRight className={`w-3 h-3 group-hover/btn:translate-x-1 transition-transform ${isGolden ? 'text-[#050A1A]' : 'text-white'}`} />}
      </Link>
    </div>
  );
}