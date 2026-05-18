import React from 'react'

const SubHeading = ({text, className}: {text: string, className?: string}) => {
  return (
    <span className={`text-[14px] font-bold tracking-widest ${className}`}>
      {text}
    </span>
  )
}

export default SubHeading