'use client';

/**
 * HeroPortrait3D Component
 *
 * Interactive WebGL portrait that blends between two photos driven by cursor
 * proximity and organic value-noise. Inspired by photogrammetry-driven hero
 * scenes (e.g. landonorris.com) but built around 2D textures and a custom
 * GLSL displacement shader for an attainable bundle/perf footprint.
 *
 * Accessibility:
 * - Falls back to a static <img> for touch devices and reduced-motion users
 * - Animation pauses when the component scrolls off-screen or the tab is hidden
 *
 * @component
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from './heroPortrait3D.shaders';

interface HeroPortrait3DProps {
  /** Default / "professional" portrait (State A) */
  textureA: string;
  /** Hover / "developer hoodie" portrait (State B) */
  textureB: string;
  /** Accent color used for the rim glow (hex string). */
  accent?: string;
}

export default function HeroPortrait3D({
  textureA,
  textureB,
  accent = '#6c63ff',
}: HeroPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  /** Detect touch device / reduced-motion preference up-front */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    setReducedMotion(isTouch || prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    // Match the native <img> output so the canvas isn't slightly darker/flatter
    // than the surrounding page when uHover == 0.
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 180ms ease;';

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const accentColor = new THREE.Color(accent);

    const loader = new THREE.TextureLoader();
    const texA = loader.load(textureA);
    const texB = loader.load(textureB);
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    [texA, texB].forEach((t) => {
      // Trilinear + anisotropic so the heavy downscale (~5x) stays sharp
      // instead of looking blurred/"filtered" compared to the native <img>.
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.anisotropy = maxAniso;
      t.colorSpace = THREE.SRGBColorSpace;
    });

    const uniforms: Record<string, THREE.IUniform> = {
      uTextureA: { value: texA },
      uTextureB: { value: texB },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uAccent: {
        value: new THREE.Vector3(accentColor.r, accentColor.g, accentColor.b),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // State refs (closure-local, no re-render churn)
    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    let hoverTarget = 0;
    let visible = true;
    let raf = 0;
    const startedAt = performance.now();

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseTarget.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
    };
    const onEnter = () => {
      hoverTarget = 1;
      renderer.domElement.style.opacity = '1';
    };
    const onLeave = () => {
      hoverTarget = 0;
      renderer.domElement.style.opacity = '0';
    };

    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(container);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener('visibilitychange', onVis);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      uniforms.uTime.value = (performance.now() - startedAt) * 0.001;
      uniforms.uMouse.value.lerp(mouseTarget, 0.12);
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.08;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointerleave', onLeave);
      mesh.geometry.dispose();
      material.dispose();
      texA.dispose();
      texB.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [textureA, textureB, accent, reducedMotion]);

  if (reducedMotion) return null;

  return <div ref={containerRef} className="absolute inset-0 z-10" />;
}
