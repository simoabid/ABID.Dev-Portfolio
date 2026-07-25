'use client';

import { Float } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense } from 'react';

import type { QualitySettings } from '@/hooks/useQualityTier';

import BackdropPlane from './BackdropPlane';
import CameraRig from './CameraRig';
import GeneratedEnvironment from './GeneratedEnvironment';
import HeroCore from './HeroCore';
import ParticleField from './ParticleField';
import SkillsConstellation from './scenes/SkillsConstellation';

interface SceneRootProps {
  quality: QualitySettings;
  reducedMotion: boolean;
}

/**
 * Everything that lives inside the persistent canvas. Kept separate from
 * `SceneCanvas` so the canvas element itself never re-mounts when the scene
 * contents change.
 *
 * Note there is deliberately no `<color attach="background">` here. The canvas
 * renders with an alpha buffer so the ambient video behind it stays visible;
 * painting a solid background colour would hide it completely. Fog is still
 * applied for depth falloff.
 *
 * A caution learned the hard way: anything placed here sits at a fixed world
 * position while the camera travels between waypoints, so it can drift into
 * neighbouring sections. Section scenes must stay small, sit well back, and
 * cull themselves when their section is off screen.
 */
export default function SceneRoot({ quality, reducedMotion }: SceneRootProps) {
  return (
    <>
      <fog attach="fog" args={['#0f0f1a', 8, 26]} />

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

      {/* No assets to load, so it stays outside the Suspense boundary. */}
      <SkillsConstellation reducedMotion={reducedMotion} />

      <Suspense fallback={null}>
        <GeneratedEnvironment />
        <BackdropPlane reducedMotion={reducedMotion} />
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
