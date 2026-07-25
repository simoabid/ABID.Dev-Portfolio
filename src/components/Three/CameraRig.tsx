'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from 'three';

import { CAMERA_WAYPOINTS } from '@/lib/cameraWaypoints';
import { SECTION_IDS, getScrollState } from '@/lib/scrollState';

interface CameraRigProps {
  reducedMotion: boolean;
}

const POINTER_PARALLAX_X = 0.45;
const POINTER_PARALLAX_Y = 0.3;
const DAMPING = 3;

/**
 * Flies the camera along a spline through every section waypoint, driven by
 * scroll, with a small pointer parallax on top. Damped so that flicking the
 * mouse or scrolling hard never snaps the frame.
 *
 * Reduced motion is handled by snapping directly to the nearest waypoint
 * instead of interpolating. The viewer still reaches every scene — otherwise
 * whole sections would be off camera — but there is no continuous drift, no
 * easing and no pointer parallax.
 */
export default function CameraRig({ reducedMotion }: CameraRigProps) {
  const rig = useMemo(() => {
    const positions = SECTION_IDS.map((id) => {
      const [x, y, z] = CAMERA_WAYPOINTS[id].position;
      return new Vector3(x, y, z);
    });

    const targets = SECTION_IDS.map((id) => {
      const [x, y, z] = CAMERA_WAYPOINTS[id].lookAt;
      return new Vector3(x, y, z);
    });

    return {
      positionCurve: new CatmullRomCurve3(positions, false, 'catmullrom', 0.5),
      targetCurve: new CatmullRomCurve3(targets, false, 'catmullrom', 0.5),
      fovs: SECTION_IDS.map((id) => CAMERA_WAYPOINTS[id].fov),
      position: new Vector3(),
      target: new Vector3(),
    };
  }, []);

  useFrame((frameState, delta) => {
    const scroll = getScrollState();
    const { camera } = frameState;

    if (reducedMotion) {
      const nearest = CAMERA_WAYPOINTS[scroll.activeSection];
      const [x, y, z] = nearest.position;
      const [lx, ly, lz] = nearest.lookAt;

      camera.position.set(x, y, z);
      camera.lookAt(lx, ly, lz);

      if (camera instanceof PerspectiveCamera && camera.fov !== nearest.fov) {
        camera.fov = nearest.fov;
        camera.updateProjectionMatrix();
      }

      return;
    }

    const t = scroll.progress;

    rig.positionCurve.getPoint(t, rig.position);
    rig.targetCurve.getPoint(t, rig.target);

    const targetX = rig.position.x + scroll.pointerX * POINTER_PARALLAX_X;
    const targetY = rig.position.y + scroll.pointerY * POINTER_PARALLAX_Y;

    camera.position.x = MathUtils.damp(camera.position.x, targetX, DAMPING, delta);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, DAMPING, delta);
    camera.position.z = MathUtils.damp(
      camera.position.z,
      rig.position.z,
      DAMPING,
      delta
    );

    camera.lookAt(rig.target);

    if (camera instanceof PerspectiveCamera) {
      const scaled = t * (rig.fovs.length - 1);
      const lower = Math.floor(scaled);
      const upper = Math.min(lower + 1, rig.fovs.length - 1);
      const fov = MathUtils.lerp(
        rig.fovs[lower] ?? camera.fov,
        rig.fovs[upper] ?? camera.fov,
        scaled - lower
      );

      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
