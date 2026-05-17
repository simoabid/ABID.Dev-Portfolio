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
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const lowEnd =
    navigator.hardwareConcurrency <= 4 ||
    (typeof deviceMemory === 'number' && deviceMemory <= 4);

  return { lowEnd, reducedMotion, coarsePointer };
}

export default function GlobalEffects() {
  const [splashReady, setSplashReady] = useState(false);
  const [cursorReady, setCursorReady] = useState(false);
  const [profile, setProfile] = useState<DeviceProfile>(defaultProfile);

  useEffect(() => {
    const detectedProfile = detectDeviceProfile();
    setProfile(detectedProfile);

    if (detectedProfile.reducedMotion || detectedProfile.coarsePointer) {
      return;
    }

    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const enableSplash = () => setSplashReady(true);
    const enableCursor = () => setCursorReady(true);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enableSplash, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(enableSplash, 450);
    }

    window.addEventListener('mousemove', enableCursor, {
      once: true,
      passive: true,
    });
    window.addEventListener('keydown', enableSplash, { once: true });
    window.addEventListener('touchstart', enableSplash, {
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
      window.removeEventListener('mousemove', enableCursor);
      window.removeEventListener('keydown', enableSplash);
      window.removeEventListener('touchstart', enableSplash);
    };
  }, []);

  if (profile.reducedMotion || profile.coarsePointer) {
    return null;
  }

  return (
    <>
      {cursorReady ? (
        <TargetCursor spinDuration={profile.lowEnd ? 2.6 : 2} />
      ) : null}
      {splashReady ? (
        <SplashCursor
          SIM_RESOLUTION={profile.lowEnd ? 96 : 112}
          DYE_RESOLUTION={profile.lowEnd ? 768 : 1024}
          PRESSURE_ITERATIONS={profile.lowEnd ? 10 : 14}
          SPLAT_FORCE={profile.lowEnd ? 4200 : 5000}
          COLOR_UPDATE_SPEED={profile.lowEnd ? 7 : 9}
        />
      ) : null}
    </>
  );
}
