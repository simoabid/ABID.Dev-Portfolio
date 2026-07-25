'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils } from 'three';

import { ASSETS_3D } from '@/lib/assets3d';
import { getScrollState } from '@/lib/scrollState';

interface HeroCoreProps {
  reducedMotion: boolean;
}

/**
 * The signature object anchoring the hero. It keeps a slow idle spin, adds a
 * full revolution across the length of the page, and recedes as the visitor
 * scrolls so later sections read clearly on top of it.
 */
export default function HeroCore({ reducedMotion }: HeroCoreProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(ASSETS_3D.heroCore);

  useFrame((frameState, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const scroll = getScrollState();
    const elapsed = frameState.clock.elapsedTime;

    const spin = reducedMotion
      ? scroll.progress * Math.PI
      : elapsed * 0.18 + scroll.progress * Math.PI * 2;

    group.rotation.y = spin;
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      scroll.pointerY * 0.15,
      3,
      delta
    );

    const float = reducedMotion ? 0 : Math.sin(elapsed * 0.6) * 0.08;
    group.position.y = MathUtils.damp(
      group.position.y,
      float - scroll.progress * 2.2,
      3,
      delta
    );

    const scale = 1 - scroll.progress * 0.35;
    group.scale.setScalar(MathUtils.damp(group.scale.x, scale, 3, delta));
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(ASSETS_3D.heroCore);
