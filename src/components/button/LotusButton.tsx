import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import lotus from "@/assets/about/lotus.png"

interface LotusButtonProps {
  href: string;
  text: string;
}

const LotusButton = ({ href, text }: LotusButtonProps) => {
  return (
          <Link
                      href={href}
                      className="inline-flex items-center justify-center gap-3 border-3 border-[#c8a45d] bg-[#0f2518] px-4 text-[12px] font-normal text-white transition-all duration-300 hover:bg-[#1f2d14] rounded-md"
                    >
                      <span className="text-white">
                        {text}
                      </span>

                      <Image
                        src={lotus}
                        alt="arrow"
                        width={20}
                        height={15}
                      />
                    </Link>
  )
}

export default LotusButton