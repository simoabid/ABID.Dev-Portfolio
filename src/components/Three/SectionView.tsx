'use client';

import { View } from '@react-three/drei';
import type { ReactNode } from 'react';

import { useQualityTier } from '@/hooks/useQualityTier';

interface SectionViewProps {
  /** Geometry to render inside this viewport. */
  children: ReactNode;
  /** Classes for the tracked DOM element that defines the viewport bounds. */
  className?: string;
}

/**
 * A rectangle of real 3D embedded in the page layout.
 *
 * Renders a plain DOM element, then portals its children into the shared
 * canvas, scissored to that element's on-screen bounds. The upshot is that
 * geometry can be positioned with flexbox and grid like any other element,
 * while still being drawn by the single canvas mounted in the layout.
 *
 * Always decorative. Callers must provide the real content as DOM alongside
 * it, because this renders nothing at all on the lowest quality tier — where
 * a fallback is not optional, it is the only thing the user will see.
 */
export default function SectionView({ children, className }: SectionViewProps) {
  const quality = useQualityTier();

  if (quality.tier === 'none') {
    return null;
  }

  return (
    <View className={className} aria-hidden="true">
      {children}
    </View>
  );
}
