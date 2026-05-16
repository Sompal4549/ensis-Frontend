import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`w-full max-w-[1400px] mx-auto px-4 md:px-6  py-6 md:py-8 ${className}`} {...props}>
      {children}
    </div>
  );
};
