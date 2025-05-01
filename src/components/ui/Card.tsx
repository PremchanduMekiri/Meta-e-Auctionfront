import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md'
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const hoverStyles = hoverEffect 
    ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg' 
    : '';
  
  return (
    <div className={`
      bg-white rounded-lg shadow-md overflow-hidden 
      ${hoverStyles} 
      ${paddingStyles[padding]} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;