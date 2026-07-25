'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useQualityTier } from '@/hooks/useQualityTier';

import VideoBackdrop from '../VideoBackdrop';
import SceneRoot from './SceneRoot';
import ScrollBridge from './ScrollBridge';

/**
 * Persistent full viewport WebGL layer.
 *
 * It is mounted once at the layout level and sits behind all page content, so
 * scrolling between sections never tears down the GL context. The canvas is
 * purely decorative: it is hidden from assistive technology and never receives
 * pointer events, which keeps every interactive element in the DOM reachable.
 *
 * The ambient video backdrop renders regardless of quality tier — it costs no
 * GL context — so low powered devices that skip the 3D scene entirely still get
 * a considered background rather than a flat fill.
 */
export default function SceneCanvas() {
  const quality = useQualityTier();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <>
      <VideoBackdrop />

      {quality.tier === 'none' ? null : (
        <>
          <ScrollBridge />
          <div
            className="pointer-events-none fixed inset-0 -z-10"
            aria-hidden="true"
          >
            <Canvas
              dpr={quality.dpr}
              gl={{
                antialias: quality.antialias,
                // Alpha is required: the ambient video sits behind the canvas
                // and an opaque buffer would occlude it.
                alpha: true,
                powerPreference: 'high-performance',
              }}
              camera={{ position: [0, 0, 6], fov: 35 }}
            >
              <Suspense fallback={null}>
                <SceneRoot quality={quality} reducedMotion={reducedMotion} />
              </Suspense>
            </Canvas>
          </div>
        </>
      )}
    </>
  );
}
