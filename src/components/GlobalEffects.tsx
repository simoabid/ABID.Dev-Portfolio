'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TargetCursor = dynamic(() => import('@/components/UI/TargetCursor'), {
  ssr: false,
});
const SplashCursor = dynamic(() => import('@/components/UI/SplashCursor'), {
  ssr: false,
});

interface DeviceProfile {
  lowEnd: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
}

const defaultProfile: DeviceProfile = {
  lowEnd: false,
  reducedMotion: false,
  coarsePointer: false,
};

function detectDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') {
    return defaultProfile;
  }

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const deviceMemory = (
    navigator as Navigator & { deviceMemory?: number }
  ).deviceMemory;
  const lowEnd =
    navigator.hardwareConcurrency <= 4 ||
    (typeof deviceMemory === 'number' && deviceMemory <= 4);

  return { lowEnd, reducedMotion, coarsePointer };
}

export default function GlobalEffects() {
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<DeviceProfile>(defaultProfile);

  useEffect(() => {
    const detectedProfile = detectDeviceProfile();
    setProfile(detectedProfile);

    if (detectedProfile.reducedMotion || detectedProfile.coarsePointer) {
      return;
    }

    const triggerReady = () => setIsReady(true);
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(
        () => {
          triggerReady();
        },
        { timeout: 1200 }
      );
    } else {
      timeoutId = setTimeout(triggerReady, 450);
    }

    window.addEventListener('mousemove', triggerReady, {
      once: true,
      passive: true,
    });
    window.addEventListener('keydown', triggerReady, { once: true });
    window.addEventListener('touchstart', triggerReady, {
      once: true,
      passive: true,
    });

    return () => {
      if (idleId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('mousemove', triggerReady);
      window.removeEventListener('keydown', triggerReady);
      window.removeEventListener('touchstart', triggerReady);
    };
  }, []);

  if (profile.reducedMotion || profile.coarsePointer || !isReady) {
    return null;
  }

  return (
    <>
      <TargetCursor spinDuration={profile.lowEnd ? 2.6 : 2} />
      <SplashCursor
        SIM_RESOLUTION={profile.lowEnd ? 96 : 112}
        DYE_RESOLUTION={profile.lowEnd ? 768 : 1024}
        PRESSURE_ITERATIONS={profile.lowEnd ? 10 : 14}
        SPLAT_FORCE={profile.lowEnd ? 4200 : 5000}
        COLOR_UPDATE_SPEED={profile.lowEnd ? 7 : 9}
      />
    </>
  );
}
