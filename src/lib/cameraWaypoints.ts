import type { SectionId } from './scrollState';

export interface CameraWaypoint {
  /** Camera position in world space. */
  position: readonly [number, number, number];
  /** Point the camera is aimed at. */
  lookAt: readonly [number, number, number];
  /** Vertical field of view in degrees. */
  fov: number;
}

/**
 * The camera journey.
 *
 * Each section is a destination. The rig interpolates between these along a
 * Catmull-Rom spline driven by scroll, so the viewer descends through one
 * continuous space rather than watching a static backdrop.
 *
 * The scene drifts downward and weaves left to right as it descends, which
 * gives each section a distinct vantage point without ever cutting. Field of
 * view widens through the dense middle sections and tightens again at the
 * contact form, where focus matters more than spectacle.
 */
export const CAMERA_WAYPOINTS: Record<SectionId, CameraWaypoint> = {
  home: {
    position: [0, 0, 6],
    lookAt: [0, 0, 0],
    fov: 35,
  },
  about: {
    position: [2.2, -0.6, 4.6],
    lookAt: [0.4, -0.4, -1],
    fov: 38,
  },
  projects: {
    position: [-2.6, -1.2, 4.2],
    lookAt: [-0.6, -1, -2],
    fov: 42,
  },
  skills: {
    position: [0, -2, 5.2],
    lookAt: [0, -2, -1.5],
    fov: 40,
  },
  experience: {
    position: [3, -3, 3.6],
    lookAt: [0.5, -3.2, -3],
    fov: 44,
  },
  socials: {
    position: [-2, -4, 4.4],
    lookAt: [-0.4, -4, -1.5],
    fov: 40,
  },
  contact: {
    position: [0, -5, 5.8],
    lookAt: [0, -5, 0],
    fov: 36,
  },
};
