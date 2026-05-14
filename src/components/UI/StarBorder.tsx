import React, { ElementType, ComponentPropsWithoutRef } from 'react';
import './StarBorder.css';

interface StarBorderProps<T extends ElementType> {
  as?: T;
  className?: string;
  innerClassName?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children: React.ReactNode;
}

export default function StarBorder<T extends ElementType = 'button'>({
  as,
  className = '',
  innerClassName = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || 'button';

  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px`,
        ...((rest as any).style || {}),
      }}
      {...(rest as any)}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className={`inner-content ${innerClassName}`}>{children}</div>
    </Component>
  );
}
