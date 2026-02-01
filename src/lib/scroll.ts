/**
 * Scroll Utility Module
 *
 * Integrates Lenis for smooth inertial scrolling with GSAP ScrollTrigger.
 * Provides SSR-safe initialization and proper cleanup.
 *
 * @module lib/scroll
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Singleton instance
let lenisInstance: Lenis | null = null;

/**
 * Configuration options for Lenis smooth scroll
 */
export interface SmoothScrollOptions {
  /** Lerp (linear interpolation) value for smoothness. Default: 0.1 */
  lerp?: number;
  /** Duration of scroll animation. Default: 1.2 */
  duration?: number;
  /** Easing function. Default: easeOutExpo */
  easing?: (t: number) => number;
  /** Direction of scroll. Default: 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Gesture direction. Default: 'vertical' */
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  /** Infinite scrolling. Default: false */
  infinite?: boolean;
}

/**
 * Default easing function - easeOutExpo for smooth deceleration
 */
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/**
 * Default Lenis configuration
 */
const defaultOptions: SmoothScrollOptions = {
  lerp: 0.1,
  duration: 1.2,
  easing: easeOutExpo,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  infinite: false,
};

/**
 * Initialize Lenis smooth scrolling and sync with GSAP ScrollTrigger
 *
 * @param options - Configuration options for Lenis
 * @returns Lenis instance or null if SSR
 */
export function initSmoothScroll(
  options: SmoothScrollOptions = {}
): Lenis | null {
  // SSR guard
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing instance if already initialized
  if (lenisInstance) {
    return lenisInstance;
  }

  // Merge options with defaults
  const config = { ...defaultOptions, ...options };

  // Create Lenis instance with valid options only
  lenisInstance = new Lenis({
    lerp: config.lerp,
    duration: config.duration,
    easing: config.easing,
    orientation: config.orientation,
    gestureOrientation: config.gestureOrientation,
    infinite: config.infinite,
  });

  // Sync Lenis scroll with ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Add Lenis RAF to GSAP ticker for synchronized updates
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  // Disable GSAP lag smoothing for smoother animations
  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger on resize
  const handleResize = () => {
    ScrollTrigger.refresh();
  };

  window.addEventListener('resize', handleResize);

  return lenisInstance;
}

/**
 * Get the current Lenis instance
 *
 * @returns Current Lenis instance or null
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Destroy Lenis instance and cleanup
 */
export function destroySmoothScroll(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/**
 * Scroll to a target element or position
 *
 * @param target - Element, selector, or scroll position
 * @param options - Scroll options
 */
export function scrollTo(
  target: HTMLElement | string | number,
  options?: {
    offset?: number;
    lerp?: number;
    duration?: number;
    immediate?: boolean;
    lock?: boolean;
    onComplete?: () => void;
  }
): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  }
}

/**
 * Stop smooth scrolling temporarily
 */
export function stopScroll(): void {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

/**
 * Resume smooth scrolling
 */
export function startScroll(): void {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

// Re-export GSAP and ScrollTrigger for convenience
export { gsap, ScrollTrigger };
