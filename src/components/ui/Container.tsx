import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`container mx-auto px-6 md:px-10 max-w-[1400px] py-4 md:py-6 ${className}`}>
      {children}
    </div>
  );
};
