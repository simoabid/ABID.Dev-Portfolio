import React from 'react';

interface HoverRollTextProps {
  text?: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function HoverRollText({
  text,
  children,
  className = '',
  icon,
}: HoverRollTextProps) {
  const content = children || (
    <>
      {text}
      {icon}
    </>
  );

  return (
    <span
      className={`relative overflow-hidden inline-flex items-center justify-center ${className}`}
    >
      <span className="inline-flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[150%]">
        {content}
      </span>
      <span
        className="absolute left-0 top-0 inline-flex h-full w-full items-center justify-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-[150%] group-hover:translate-y-0"
        aria-hidden="true"
      >
        {content}
      </span>
    </span>
  );
}
