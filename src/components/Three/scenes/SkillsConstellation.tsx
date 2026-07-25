'use client';

/**
 * Skills constellation.
 *
 * Three clusters of nodes, one per skill category, wired back to a hub. Each
 * node carries its technology's brand colour.
 *
 * This is deliberately background depth rather than a focal element. The first
 * attempt spread nine world units across at close range and read as random
 * coloured dust scattered behind the text. It now sits well back and stays
 * compact, so it gives the section parallax without competing with the cards.
 *
 * Two things keep the nodes from blooming into white blobs: tone mapping is
 * left on, and emissive intensity is kept low. The bloom pass has a 0.35
 * luminance threshold, which unmapped emissive colours sail straight past.
 *
 * Placement is deterministic — a golden-angle spiral per cluster rather than
 * random scatter — so the layout is identical on every render and cannot
 * differ between server and client.
 *
 * This lives in the main scene at the skills waypoint rather than inside a
 * <View>. A View would need its own camera, and marking one as default would
 * contend with CameraRig for state.camera.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Vector3 } from 'three';
import type { Group } from 'three';
import { SKILL_CATEGORIES } from '@/data/skills';
import { getSectionState } from '@/lib/scrollState';

/** Horizontal gap between the three category clusters. */
const CLUSTER_SPACING = 1.6;

/** Radius of the shell each cluster's nodes sit on. */
const CLUSTER_RADIUS = 0.55;

/** Golden angle, for even distribution without clumping. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

interface ConstellationNode {
  name: string;
  color: string;
  position: Vector3;
}

interface ConstellationCluster {
  center: Vector3;
  nodes: ConstellationNode[];
}

interface SkillsConstellationProps {
  /** Supplied by the parent so the motion decision stays in one place. */
  reducedMotion: boolean;
}

/**
 * Distributes a cluster's nodes over a sphere using a Fibonacci lattice.
 * Deterministic, so it is safe across renders.
 */
function buildClusters(): ConstellationCluster[] {
  return SKILL_CATEGORIES.map((category, categoryIndex) => {
    const center = new Vector3(
      (categoryIndex - 1) * CLUSTER_SPACING,
      0,
      categoryIndex === 1 ? -0.4 : 0
    );

    const count = category.skills.length;

    const nodes = category.skills.map((skill, index) => {
      // Even spacing in cos(latitude) keeps the poles from bunching up.
      const y = count === 1 ? 0 : 1 - (index / (count - 1)) * 2;
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = GOLDEN_ANGLE * index;

      const position = new Vector3(
        center.x + Math.cos(theta) * ringRadius * CLUSTER_RADIUS,
        center.y + y * CLUSTER_RADIUS,
        center.z + Math.sin(theta) * ringRadius * CLUSTER_RADIUS
      );

      return { name: skill.name, color: skill.color, position };
    });

    return { center, nodes };
  });
}

export default function SkillsConstellation({
  reducedMotion,
}: SkillsConstellationProps) {
  const groupRef = useRef<Group>(null);

  const clusters = useMemo(() => buildClusters(), []);

  // One geometry for every spoke in the constellation. Built once.
  const linkGeometry = useMemo(() => {
    const points: Vector3[] = [];

    for (const cluster of clusters) {
      for (const node of cluster.nodes) {
        points.push(cluster.center, node.position);
      }
    }

    // Tie the cluster hubs together so the three groups read as one system.
    for (let i = 0; i < clusters.length - 1; i += 1) {
      points.push(clusters[i].center, clusters[i + 1].center);
    }

    return new BufferGeometry().setFromPoints(points);
  }, [clusters]);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const { visibility } = getSectionState('skills');

    // Skip all work while the section is off screen.
    group.visible = visibility > 0.02;
    if (!group.visible) return;

    // Settles into full size as the section takes over the viewport.
    group.scale.setScalar(0.85 + visibility * 0.15);

    if (!reducedMotion) {
      group.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, -5]}>
      <lineSegments geometry={linkGeometry}>
        <lineBasicMaterial
          color="#6c63ff"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </lineSegments>

      {clusters.map((cluster) => (
        <group key={cluster.center.x}>
          {/* Cluster hub */}
          <mesh position={cluster.center}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.5}
            />
          </mesh>

          {cluster.nodes.map((node) => (
            <mesh key={node.name} position={node.position}>
              <sphereGeometry args={[0.048, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={0.35}
                roughness={0.35}
                metalness={0.1}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
