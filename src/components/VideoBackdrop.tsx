'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ASSETS_3D } from '@/lib/assets3d';

/**
 * Ambient looping video rendered behind the WebGL layer.
 *
 * It sits at `-z-20`, one level below the canvas, so the 3D scene composites
 * on top of it. Purely decorative: hidden from assistive technology, muted,
 * and never interactive.
 *
 * Under `prefers-reduced-motion` the video is paused on its first frame rather
 * than removed, which keeps the visual depth without any movement.
 */
export default function VideoBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      return;
    }

    // Autoplay can still be refused (low power mode, for example). The scene
    // simply falls back to a static frame, so the rejection is not an error.
    void video.play().catch(() => undefined);
  }, [reducedMotion]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[var(--color-background)]"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover opacity-45"
        src={ASSETS_3D.backdropVideo}
        muted
        loop
        playsInline
        preload="metadata"
        autoPlay={!reducedMotion}
        tabIndex={-1}
      />
      {/* Tints the footage back towards the palette and stops it competing
          with foreground copy. */}
      <div className="absolute inset-0 bg-[var(--color-background)]/55" />
    </div>
  );
}
