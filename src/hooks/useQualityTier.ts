'use client';

import { useEffect, useState } from 'react';

/**
 * Rendering budget for the WebGL layer. `none` means the device cannot or
 * should not run the 3D scene at all and callers must fall back to the static
 * presentation.
 */
export type QualityTier = 'none' | 'low' | 'medium' | 'high';

export interface QualitySettings {
  tier: QualityTier;
  /** Device pixel ratio clamp passed to the renderer. */
  dpr: [number, number];
  antialias: boolean;
  /** Whether the postprocessing stack should run. */
  effects: boolean;
  particleCount: number;
}

const SETTINGS: Record<QualityTier, QualitySettings> = {
  none: {
    tier: 'none',
    dpr: [1, 1],
    antialias: false,
    effects: false,
    particleCount: 0,
  },
  low: {
    tier: 'low',
    dpr: [1, 1.25],
    antialias: false,
    effects: false,
    particleCount: 900,
  },
  medium: {
    tier: 'medium',
    dpr: [1, 1.75],
    antialias: true,
    effects: true,
    particleCount: 2200,
  },
  high: {
    tier: 'high',
    dpr: [1, 2],
    antialias: true,
    effects: true,
    particleCount: 4200,
  },
};

function detectTier(): QualityTier {
  const probe = document.createElement('canvas');
  const context =
    probe.getContext('webgl2') ?? probe.getContext('webgl');

  if (!context) {
    return 'none';
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 768;

  if (isNarrow || isCoarsePointer) {
    return 'low';
  }

  return cores >= 8 ? 'high' : 'medium';
}

/**
 * Picks a rendering budget from the device capabilities. Starts at `none` so
 * the server render and the first client paint agree, then upgrades after
 * hydration.
 */
export function useQualityTier(): QualitySettings {
  const [tier, setTier] = useState<QualityTier>('none');

  useEffect(() => {
    setTier(detectTier());
  }, []);

  return SETTINGS[tier];
}
