'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, BufferAttribute, Color, Points } from 'three';

import { getScrollState } from '@/lib/scrollState';

interface ParticleFieldProps {
  count: number;
  reducedMotion: boolean;
}

const FIELD_RADIUS = 14;
const ACCENT = new Color('#6c63ff');
const ACCENT_SECONDARY = new Color('#00d4ff');

/**
 * Ambient depth field sitting behind the page. Positions are generated once
 * and the whole cloud is transformed as a single object, so the cost stays
 * flat regardless of particle count.
 */
export default function ParticleField({
  count,
  reducedMotion,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);

  const { positions, colors } = useMemo(() => {
    const positionArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const mixed = new Color();

    for (let index = 0; index < count; index += 1) {
      const radius = FIELD_RADIUS * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positionArray[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positionArray[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positionArray[index * 3 + 2] = radius * Math.cos(phi);

      mixed.copy(ACCENT).lerp(ACCENT_SECONDARY, Math.random());
      colorArray[index * 3] = mixed.r;
      colorArray[index * 3 + 1] = mixed.g;
      colorArray[index * 3 + 2] = mixed.b;
    }

    return { positions: positionArray, colors: colorArray };
  }, [count]);

  useFrame((frameState, delta) => {
    const points = pointsRef.current;
    if (!points || reducedMotion) {
      return;
    }

    const scroll = getScrollState();

    points.rotation.y += delta * 0.02;
    points.rotation.x = scroll.progress * 0.6;
    points.position.y = scroll.progress * 4;
    points.position.z = Math.sin(frameState.clock.elapsedTime * 0.1) * 0.5;
  });

  if (count === 0) {
    return null;
  }

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
