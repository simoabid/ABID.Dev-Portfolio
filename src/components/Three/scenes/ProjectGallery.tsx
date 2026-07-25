'use client';

/**
 * Project cover gallery.
 *
 * The generated covers, floating as panels in a shallow arc at the projects
 * waypoint. The DOM cards remain the real content — they own the links,
 * headings and technology lists, and all of the keyboard and screen reader
 * behaviour. This layer is purely atmospheric and is marked as such.
 *
 * Like the skills constellation, this renders in world space rather than
 * through a <View>, so it does not contend with CameraRig for the camera.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { SRGBColorSpace } from 'three';
import type { Group } from 'three';
import { getSecondaryProjects } from '@/data/projects';
import { getSectionState } from '@/lib/scrollState';

/**
 * Sourced from the project data rather than hardcoded, so the gallery cannot
 * drift out of sync with the projects section.
 *
 * This deliberately excludes the featured CINEFLIX project: its cover art is
 * multiple megabytes and is not fit to be a GPU texture until the Phase 4
 * perf pass downsizes it.
 */
const GALLERY_PROJECTS = getSecondaryProjects();
const COVER_PATHS = GALLERY_PROJECTS.map((project) => project.image);

/** Covers are 16:9. */
const PANEL_WIDTH = 2.5;
const PANEL_HEIGHT = PANEL_WIDTH * (9 / 16);

/** Horizontal gap between panels. */
const PANEL_SPACING = 2.85;

/** How far the outer panels turn inward, in radians. */
const ARC_TURN = 0.26;

interface ProjectGalleryProps {
  /** Passed in so the motion decision stays in one place. */
  reducedMotion: boolean;
}

useTexture.preload(COVER_PATHS);

export default function ProjectGallery({
  reducedMotion,
}: ProjectGalleryProps) {
  const groupRef = useRef<Group>(null);

  const textures = useTexture(COVER_PATHS);

  // Set during render, not in an effect. An effect would run after the first
  // frame had already sampled the texture in the wrong colour space.
  for (const texture of textures) {
    texture.colorSpace = SRGBColorSpace;
  }

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const { visibility } = getSectionState('projects');

    // Costs nothing while you are reading any other section.
    group.visible = visibility > 0.02;
    if (!group.visible) return;

    group.scale.setScalar(0.8 + visibility * 0.2);

    if (reducedMotion) return;

    // A slow drift, and a gentle bob per panel so the arc is never static.
    const time = state.clock.elapsedTime;
    group.rotation.y = Math.sin(time * 0.18) * 0.12;

    group.children.forEach((panel, index) => {
      panel.position.y = Math.sin(time * 0.6 + index * 1.3) * 0.09;
    });
  });

  return (
    <group ref={groupRef} position={[-0.6, -1, -2]}>
      {GALLERY_PROJECTS.map((project, index) => (
        <mesh
          key={project.id}
          position={[(index - 1) * PANEL_SPACING, 0, index === 1 ? 0.35 : 0]}
          rotation={[0, -(index - 1) * ARC_TURN, 0]}
        >
          <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
          <meshStandardMaterial
            map={textures[index]}
            roughness={0.45}
            metalness={0.15}
            emissiveMap={textures[index]}
            emissiveIntensity={0.25}
            emissive="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
}
