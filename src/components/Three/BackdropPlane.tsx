'use client';

import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import { RepeatWrapping } from 'three';

import { ASSETS_3D } from '@/lib/assets3d';
import { getScrollState } from '@/lib/scrollState';

interface BackdropPlaneProps {
  reducedMotion: boolean;
}

/**
 * Large tiled surface behind the hero mesh, using the generated PBR base
 * colour. It gives the scene a sense of material and scale that particles
 * alone cannot, and the texture offset drifts with scroll so the depth reads
 * as parallax rather than a flat backdrop.
 *
 * Kept partly transparent so the ambient video behind the canvas shows through.
 */
export default function BackdropPlane({ reducedMotion }: BackdropPlaneProps) {
  const texture = useTexture(ASSETS_3D.surfaceTexture);

  useMemo(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(6, 4);
    texture.anisotropy = 4;
  }, [texture]);

  useFrame((_state, delta) => {
    const { progress } = getScrollState();

    // Scroll drives the vertical offset; time adds a slow horizontal drift so
    // the surface still breathes when the page is idle.
    texture.offset.y = progress * 0.6;

    if (!reducedMotion) {
      texture.offset.x += delta * 0.012;
    }
  });

  return (
    <mesh position={[0, 0, -8]}>
      <planeGeometry args={[40, 24]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.28}
        metalness={0.85}
        roughness={0.55}
      />
    </mesh>
  );
}

useTexture.preload(ASSETS_3D.surfaceTexture);
