import { type ReactNode, type ElementType } from 'react';

/**
 * Container size variants with corresponding max-widths
 */
type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * Props for the Container component
 */
interface ContainerProps {
  /** Container size variant - controls max-width */
  size?: ContainerSize;
  /** HTML element to render as */
  as?: ElementType;
  /** Additional CSS classes */
  className?: string;
  /** Container content */
  children: ReactNode;
  /** Center content horizontally */
  center?: boolean;
}

/**
 * Map of size variants to CSS max-width values
 */
const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1200px]',
  '2xl': 'max-w-[1400px]',
  full: 'max-w-full',
};

/**
 * Responsive container component that centers content with consistent gutters.
 *
 * @example
 * ```tsx
 * <Container size="xl">
 *   <h1>Centered Content</h1>
 * </Container>
 *
 * <Container as="section" size="lg" className="py-12">
 *   <article>...</article>
 * </Container>
 * ```
 */
export default function Container({
  size = 'xl',
  as: Component = 'div',
  className = '',
  children,
  center = true,
}: ContainerProps) {
  return (
    <Component
      className={`
        w-full
        ${sizeClasses[size]}
        ${center ? 'mx-auto' : ''}
        px-4 md:px-6 lg:px-8
        ${className}
      `.trim()}
    >
      {children}
    </Component>
  );
}
