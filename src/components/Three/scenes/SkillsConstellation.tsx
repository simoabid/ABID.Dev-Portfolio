'use client';

/**
 * Skills constellation.
 *
 * Three clusters of nodes, one per skill category, wired back to a hub. Each
 * node carries its technology's brand colour, which is why the palette here
 * comes from the skill data rather than the design tokens.
 *
 * This is designed to run inside a SectionView, not in the world scene. Two
 * reasons. Pointer events only reach it when it owns a box in the layout —
 * behind the cards it was unreachable. And a viewport supplies its own camera,
 * so the constellation can be framed properly instead of being placed to suit
 * a camera that is travelling past it.
 *
 * Because of that it no longer reads section scroll state. Its visibility is
 * the viewport's business, and drei already stops drawing a View whose tracked
 * element is off screen.
 *
 * Tone mapping is left on and emissive intensity kept low. The bloom pass has
 * a 0.35 luminance threshold that unmapped emissive colours sail straight
 * past, which is what turned the first attempt into white blobs.
 *
 * Placement is deterministic — a golden-angle spiral per cluster rather than
 * random scatter — so the layout is identical on every render and cannot
 * differ between server and client.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { BufferGeometry, MathUtils, Vector3 } from 'three';
import type { Group, Mesh } from 'three';

import { SKILL_CATEGORIES } from '@/data/skills';

/** Horizontal gap between the three category clusters. */
const CLUSTER_SPACING = 2.3;

/** Radius of the shell each cluster's nodes sit on. */
const CLUSTER_RADIUS = 0.82;

/** Golden angle, for even distribution without clumping. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Radians per second the constellation turns when nobody is dragging it. */
const IDLE_SPIN = 0.14;

/** Radians of rotation per pixel of horizontal drag. */
const DRAG_SENSITIVITY = 0.006;

/** Per-frame decay applied to throw velocity after release. */
const SPIN_DECAY = 0.93;

interface ConstellationNode {
  name: string;
  color: string;
  position: Vector3;
}

interface ConstellationCluster {
  title: string;
  center: Vector3;
  nodes: ConstellationNode[];
}

interface SkillsConstellationProps {
  /** Supplied by the parent so the motion decision stays in one place. */
  reducedMotion: boolean;
  /** Fires with the hovered technology's name, or null on leave. */
  onHoverChange?: (name: string | null) => void;
  /** Fires with the focused category's title, or null when cleared. */
  onFocusChange?: (title: string | null) => void;
}

/**
 * Distributes each cluster's nodes over a sphere using a Fibonacci lattice.
 * Deterministic, so it is safe across renders.
 */
function buildClusters(): ConstellationCluster[] {
  return SKILL_CATEGORIES.map((category, categoryIndex) => {
    const center = new Vector3(
      (categoryIndex - 1) * CLUSTER_SPACING,
      0,
      categoryIndex === 1 ? -0.5 : 0
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

    return { title: category.title, center, nodes };
  });
}

interface NodeMeshProps {
  node: ConstellationNode;
  dimmed: boolean;
  reducedMotion: boolean;
  onHover: (name: string | null) => void;
}

/**
 * One technology. Kept as its own component so the hover scale can be eased
 * per node without re-rendering the whole constellation every frame.
 */
function NodeMesh({ node, dimmed, reducedMotion, onHover }: NodeMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const target = hovered ? 2.1 : 1;

    if (reducedMotion) {
      mesh.scale.setScalar(target);
      return;
    }

    // Frame-rate independent easing: the fraction of the remaining gap to
    // close scales with how long the frame actually took.
    const t = 1 - Math.pow(0.0015, delta);
    mesh.scale.setScalar(MathUtils.lerp(mesh.scale.x, target, t));
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    onHover(node.name);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
  };

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.07, 20, 20]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={hovered ? 0.95 : 0.35}
        roughness={0.35}
        metalness={0.1}
        transparent
        opacity={dimmed ? 0.15 : 1}
      />
    </mesh>
  );
}

export default function SkillsConstellation({
  reducedMotion,
  onHoverChange,
  onFocusChange,
}: SkillsConstellationProps) {
  const groupRef = useRef<Group>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const spinVelocity = useRef(0);

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

  // three does not garbage collect GPU buffers, so this has to be explicit.
  useEffect(() => {
    return () => {
      linkGeometry.dispose();
    };
  }, [linkGeometry]);

  // The pointer can be released anywhere on the page, including outside the
  // viewport, so the drag has to end on a window listener rather than on a
  // pointer-out from the catcher plane.
  useEffect(() => {
    const handleWindowPointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, []);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!isDragging.current) {
      spinVelocity.current *= SPIN_DECAY;

      if (!reducedMotion) {
        group.rotation.y += (spinVelocity.current + IDLE_SPIN) * delta;
      }
    }

    // Recentre on the focused cluster. This is the plan's camera fly, done by
    // moving the subject instead: drei rebuilds a viewport camera's projection
    // every frame it draws, so the group is the stable thing to animate.
    const focused = focusedIndex === null ? null : clusters[focusedIndex];
    const targetX = focused ? -focused.center.x : 0;
    const targetZ = focused ? 1.1 : 0;

    const t = reducedMotion ? 1 : 1 - Math.pow(0.004, delta);
    group.position.x = MathUtils.lerp(group.position.x, targetX, t);
    group.position.z = MathUtils.lerp(group.position.z, targetZ, t);
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    isDragging.current = true;
    lastPointerX.current = event.clientX;
    spinVelocity.current = 0;
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;

    const group = groupRef.current;
    if (!group) return;

    const deltaX = event.clientX - lastPointerX.current;
    lastPointerX.current = event.clientX;

    group.rotation.y += deltaX * DRAG_SENSITIVITY;

    // Roughly per-second velocity, so the throw carries after release.
    spinVelocity.current = deltaX * DRAG_SENSITIVITY * 60;
  };

  const handleClusterClick = (index: number) => {
    const next = focusedIndex === index ? null : index;
    setFocusedIndex(next);
    onFocusChange?.(next === null ? null : clusters[next].title);
  };

  const handleHover = (name: string | null) => {
    onHoverChange?.(name);
  };

  return (
    <group>
      {/* Catches drags anywhere in the viewport, including empty space. It has
          to be rendered rather than hidden, because three skips raycasting
          against invisible objects. */}
      <mesh
        position={[0, 0, -2]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[24, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={groupRef}>
        <lineSegments geometry={linkGeometry}>
          <lineBasicMaterial
            color="#6c63ff"
            transparent
            opacity={focusedIndex === null ? 0.4 : 0.15}
            depthWrite={false}
          />
        </lineSegments>

        {clusters.map((cluster, clusterIndex) => {
          const dimmed =
            focusedIndex !== null && focusedIndex !== clusterIndex;

          return (
            <group key={cluster.title}>
              {/* Cluster hub. Clicking it focuses the category. */}
              <mesh
                position={cluster.center}
                onClick={() => handleClusterClick(clusterIndex)}
                onPointerOver={(event: ThreeEvent<PointerEvent>) => {
                  event.stopPropagation();
                  handleHover(cluster.title);
                }}
                onPointerOut={() => handleHover(null)}
              >
                <sphereGeometry args={[0.11, 20, 20]} />
                <meshStandardMaterial
                  color="#00d4ff"
                  emissive="#00d4ff"
                  emissiveIntensity={dimmed ? 0.2 : 0.6}
                  transparent
                  opacity={dimmed ? 0.2 : 1}
                />
              </mesh>

              {cluster.nodes.map((node) => (
                <NodeMesh
                  key={node.name}
                  node={node}
                  dimmed={dimmed}
                  reducedMotion={reducedMotion}
                  onHover={handleHover}
                />
              ))}
            </group>
          );
        })}
      </group>
    </group>
  );
}
