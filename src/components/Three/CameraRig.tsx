'use client';

import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

import { getScrollState } from '@/lib/scrollState';

interface CameraRigProps {
  reducedMotion: boolean;
}

/**
 * Drifts the camera along the scroll axis and adds a small parallax offset
 * from the pointer. Damped so that flicking the mouse never snaps the frame.
 */
export default function CameraRig({ reducedMotion }: CameraRigProps) {
  useFrame((frameState, delta) => {
    if (reducedMotion) {
      return;
    }

    const scroll = getScrollState();
    const { camera } = frameState;

    const targetX = scroll.pointerX * 0.45;
    const targetY = scroll.pointerY * 0.3 - scroll.progress * 1.2;
    const targetZ = 6 - scroll.progress * 1.5;

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 3, delta);
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 3, delta);

    camera.lookAt(0, -scroll.progress * 0.8, 0);
  });

  return null;
}
