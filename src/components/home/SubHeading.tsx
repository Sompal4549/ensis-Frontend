import React from 'react'

const SubHeading = ({ text, className }: { text: string, className?: string }) => {
  return (
    <span className={`text-base font-semibold tracking-widest ${className}`}>
      {text}
    </span>
  )
}

export default SubHeading