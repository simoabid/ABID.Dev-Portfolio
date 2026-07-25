'use client';

import { PerspectiveCamera, View } from '@react-three/drei';
import type { ReactNode } from 'react';

import { useQualityTier } from '@/hooks/useQualityTier';

interface SectionViewProps {
  /** Geometry to render inside this viewport. */
  children: ReactNode;
  /** Classes for the tracked DOM element that defines the viewport bounds. */
  className?: string;
  /** Distance of the dedicated camera from this viewport's origin. */
  cameraDistance?: number;
  /** Field of view for the dedicated camera. */
  fov?: number;
  /**
   * Render order. Views take over the render loop and draw in index order.
   * Defaults to 2 so viewports always compose on top of the root pass, which
   * runs at 1. Overlapping viewports need distinct values.
   */
  index?: number;
  /** Set false to stop drawing without unmounting the geometry. */
  visible?: boolean;
  /** Set false to supply lighting from the children instead. */
  lit?: boolean;
}

/**
 * A rectangle of real 3D embedded in the page layout.
 *
 * Renders a plain DOM element, then portals its children into the shared
 * canvas, scissored to that element's on-screen bounds. The upshot is that
 * geometry can be positioned with flexbox and grid like any other element,
 * while still being drawn by the single canvas mounted in the layout.
 *
 * Three properties of drei's View shape everything here.
 *
 * The first is that the viewport gets its own camera. drei resizes the active
 * camera to the viewport's aspect ratio and rebuilds its projection matrix on
 * every frame it draws. Without a dedicated camera that would be the canvas
 * camera, which CameraRig is flying along the section spline, and the two
 * would corrupt each other. A camera declared inside the portal registers
 * against the portal's own store, so it stays local to this viewport.
 *
 * The second is that children render into a separate scene. Lights, fog and
 * environment maps from SceneRoot do not cross that boundary, so this carries
 * its own small rig. Anything strongly metallic needs an environment map of
 * its own; the shared HDRI will not reach it.
 *
 * The third is that mounting any View stops react-three-fiber from rendering
 * the root scene automatically, because it subscribes to the frame loop above
 * priority 0. SceneRoot compensates, either through EffectComposer or through
 * its manual render. Do not lower the index below that pass.
 *
 * Always decorative. Callers must provide the real content as DOM alongside
 * it, because this renders nothing at all on the lowest quality tier — where
 * a fallback is not optional, it is the only thing the user will see.
 */
export default function SectionView({
  children,
  className,
  cameraDistance = 4,
  fov = 40,
  index = 2,
  visible = true,
  lit = true,
}: SectionViewProps) {
  const quality = useQualityTier();

  if (quality.tier === 'none') {
    return null;
  }

  return (
    <View
      className={className}
      index={index}
      visible={visible}
      aria-hidden="true"
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 0, cameraDistance]}
        fov={fov}
      />

      {lit ? (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[3, 4, 5]}
            intensity={1.2}
            color="#6c63ff"
          />
          <directionalLight
            position={[-4, -2, -3]}
            intensity={0.7}
            color="#00d4ff"
          />
        </>
      ) : null}

      {children}
    </View>
  );
}
