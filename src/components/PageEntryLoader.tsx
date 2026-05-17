'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import DotField from './UI/DotField';

interface PageEntryLoaderProps {
  children: React.ReactNode;
  minDurationMs?: number;
}

export default function PageEntryLoader({
  children,
  minDurationMs = 1800,
}: PageEntryLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine when the document is actually fully loaded
    let documentLoaded = document.readyState === 'complete';

    const handleLoad = () => {
      documentLoaded = true;
    };

    if (!documentLoaded) {
      window.addEventListener('load', handleLoad, { once: true });
    }

    // Prepare GSAP timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setIsLoading(false);
        setTimeout(() => setShowOverlay(false), 50);
      },
    });

    // 1. Progress from 0 to 100
    const counter = { value: 0 };
    tl.to(
      counter,
      {
        value: 100,
        duration: minDurationMs / 1000,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counter.value)}%`;
          }
        },
      },
      0
    );

    tl.to(
      progressRef.current,
      {
        width: '100%',
        duration: minDurationMs / 1000,
        ease: 'power3.inOut',
      },
      0
    );

    // Fade in the initialization text briefly
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0.2
    );

    // 2. Hide counter and progress bar
    tl.to(
      [counterRef.current, progressRef.current?.parentElement, textRef.current],
      {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.1,
      },
      '+=0.2'
    );

    // 3. Reveal Brand
    tl.fromTo(
      brandRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
    );

    // We can add a dynamic wait here to ensure document is loaded before lifting curtain.
    tl.add(() => {
      if (!documentLoaded) {
        tl.pause();
        const checkInterval = setInterval(() => {
          if (documentLoaded) {
            clearInterval(checkInterval);
            tl.play();
          }
        }, 100);
      }
    });

    // 4. Slide curtain up
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.4,
    });

    tl.play();

    return () => {
      window.removeEventListener('load', handleLoad);
      tl.kill();
    };
  }, [minDurationMs]);

  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showOverlay]);

  return (
    <>
      <div
        className={`transition-opacity duration-700 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>

      {showOverlay && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-background)]"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Interactive Dot Background */}
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <DotField
              dotRadius={1.5}
              dotSpacing={14}
              bulgeStrength={67}
              glowRadius={160}
              sparkle={true}
              waveAmplitude={0}
            />
          </div>

          <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center px-6">
            {/* The Brand Reveal (Hidden initially) */}
            <div
              ref={brandRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
            >
              <h1
                className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] bg-clip-text text-4xl font-bold tracking-tighter text-transparent md:text-5xl"
                style={{ textShadow: '0 0 30px var(--color-accent-muted)' }}
              >
                ABID.DEV
              </h1>
            </div>

            {/* Percentage Counter */}
            <div
              ref={counterRef}
              className="text-7xl font-black tracking-tighter text-[var(--color-foreground)] md:text-8xl"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              0%
            </div>

            {/* Progress Bar Container */}
            <div className="relative mt-8 h-[2px] w-full overflow-hidden rounded-full bg-[var(--color-border)]">
              <div
                ref={progressRef}
                className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)]"
                style={{ boxShadow: '0 0 15px var(--color-accent)' }}
              />
            </div>

            {/* Loading text */}
            <div
              ref={textRef}
              className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-foreground-muted)] opacity-0"
            >
              Initializing Experience
            </div>
          </div>
        </div>
      )}
    </>
  );
}
