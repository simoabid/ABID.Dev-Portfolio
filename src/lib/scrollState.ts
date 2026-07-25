/**
 * Module level scroll and pointer store.
 *
 * The 3D scenes read this every frame inside `useFrame`. Keeping it outside of
 * React state is deliberate: scroll and pointer updates fire at input rate and
 * routing them through `setState` would re-render the whole tree 60+ times a
 * second.
 */

export interface PortfolioScrollState {
  /** Progress through the whole document, normalized to 0..1. */
  progress: number;
  /** Raw vertical scroll offset in pixels. */
  scrollY: number;
  /** Pointer X position, normalized to -1..1. */
  pointerX: number;
  /** Pointer Y position, normalized to -1..1 (up is positive). */
  pointerY: number;
}

const state: PortfolioScrollState = {
  progress: 0,
  scrollY: 0,
  pointerX: 0,
  pointerY: 0,
};

export function getScrollState(): PortfolioScrollState {
  return state;
}

export function setScrollMetrics(scrollY: number): void {
  const limit = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1
  );

  state.scrollY = scrollY;
  state.progress = Math.min(Math.max(scrollY / limit, 0), 1);
}

export function setPointer(clientX: number, clientY: number): void {
  state.pointerX = (clientX / window.innerWidth) * 2 - 1;
  state.pointerY = -((clientY / window.innerHeight) * 2 - 1);
}
