'use client';

import { Environment, Float } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense } from 'react';

import { ASSETS_3D } from '@/lib/assets3d';
import type { QualitySettings } from '@/hooks/useQualityTier';

import CameraRig from './CameraRig';
import HeroCore from './HeroCore';
import ParticleField from './ParticleField';

interface SceneRootProps {
  quality: QualitySettings;
  reducedMotion: boolean;
}

/**
 * Everything that lives inside the persistent canvas. Kept separate from
 * `SceneCanvas` so the canvas element itself never re-mounts when the scene
 * contents change.
 */
export default function SceneRoot({
  quality,
  reducedMotion,
}: SceneRootProps) {
  return (
    <>
      <color attach="background" args={['#0f0f1a']} />
      <fog attach="fog" args={['#0f0f1a', 8, 22]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#6c63ff" />
      <directionalLight
        position={[-5, -2, -4]}
        intensity={0.8}
        color="#00d4ff"
      />

      <CameraRig reducedMotion={reducedMotion} />
      <ParticleField
        count={quality.particleCount}
        reducedMotion={reducedMotion}
      />

      <Suspense fallback={null}>
        <Environment files={ASSETS_3D.environment} />
        <Float
          enabled={!reducedMotion}
          speed={1.1}
          rotationIntensity={0.25}
          floatIntensity={0.4}
        >
          <HeroCore reducedMotion={reducedMotion} />
        </Float>
      </Suspense>

      {quality.effects ? (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      ) : (
        <></>
      )}
    </>
  );
}
