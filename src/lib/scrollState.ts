/**
 * Module level scroll, pointer and section store.
 *
 * The 3D scenes read this every frame inside `useFrame`. Keeping it outside of
 * React state is deliberate: scroll and pointer updates fire at input rate and
 * routing them through `setState` would re-render the whole tree 60+ times a
 * second.
 */

export type SectionId =
  | 'home'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'socials'
  | 'contact';

/**
 * Sections in document order. The camera waypoint curve is built from this
 * sequence, so the order here must match the order rendered in `page.tsx`.
 */
export const SECTION_IDS: readonly SectionId[] = [
  'home',
  'about',
  'projects',
  'skills',
  'experience',
  'socials',
  'contact',
];

export interface SectionScrollState {
  /**
   * How far the section has travelled through the viewport. 0 when its top
   * edge is at the bottom of the screen, 1 once its bottom edge has left the
   * top. Useful for driving an animation across the whole approach and exit.
   */
  progress: number;
  /** Fraction of the viewport height the section currently occupies, 0..1. */
  visibility: number;
  /** Whether any part of the section is on screen. */
  inView: boolean;
}

export interface PortfolioScrollState {
  /** Progress through the whole document, normalized to 0..1. */
  progress: number;
  /** Raw vertical scroll offset in pixels. */
  scrollY: number;
  /** Pointer X position, normalized to -1..1. */
  pointerX: number;
  /** Pointer Y position, normalized to -1..1 (up is positive). */
  pointerY: number;
  /** The section currently occupying the most viewport space. */
  activeSection: SectionId;
  /** Per-section scroll state, keyed by section id. */
  sections: Record<SectionId, SectionScrollState>;
}

function createSectionState(): SectionScrollState {
  return { progress: 0, visibility: 0, inView: false };
}

const state: PortfolioScrollState = {
  progress: 0,
  scrollY: 0,
  pointerX: 0,
  pointerY: 0,
  activeSection: 'home',
  sections: {
    home: createSectionState(),
    about: createSectionState(),
    projects: createSectionState(),
    skills: createSectionState(),
    experience: createSectionState(),
    socials: createSectionState(),
    contact: createSectionState(),
  },
};

/**
 * Cache of resolved section elements. Populated lazily rather than through a
 * registration hook: every section already renders with the matching DOM id,
 * so there is nothing for the section components to opt into. Entries are
 * revalidated with `isConnected` because sections are dynamically imported and
 * can mount well after first paint.
 */
const elements = new Map<SectionId, HTMLElement>();

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function resolveElement(id: SectionId): HTMLElement | null {
  const cached = elements.get(id);

  if (cached && cached.isConnected) {
    return cached;
  }

  const found = document.getElementById(id);

  if (found) {
    elements.set(id, found);
    return found;
  }

  elements.delete(id);
  return null;
}

function measureSections(): void {
  const viewport = window.innerHeight;

  if (viewport === 0) {
    return;
  }

  let bestId: SectionId | null = null;
  let bestVisibility = 0;

  for (const id of SECTION_IDS) {
    const section = state.sections[id];
    const element = resolveElement(id);

    if (!element) {
      section.progress = 0;
      section.visibility = 0;
      section.inView = false;
      continue;
    }

    const rect = element.getBoundingClientRect();

    // Spans the full approach: from entering at the bottom to leaving the top.
    section.progress = clamp01((viewport - rect.top) / (viewport + rect.height));

    const visible = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0);
    section.visibility = clamp01(visible / viewport);
    section.inView = visible > 0;

    if (section.visibility > bestVisibility) {
      bestVisibility = section.visibility;
      bestId = id;
    }
  }

  if (bestId) {
    state.activeSection = bestId;
  }
}

export function getScrollState(): PortfolioScrollState {
  return state;
}

export function getSectionState(id: SectionId): SectionScrollState {
  return state.sections[id];
}

export function setScrollMetrics(scrollY: number): void {
  const limit = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1
  );

  state.scrollY = scrollY;
  state.progress = clamp01(scrollY / limit);

  measureSections();
}

export function setPointer(clientX: number, clientY: number): void {
  state.pointerX = (clientX / window.innerWidth) * 2 - 1;
  state.pointerY = -((clientY / window.innerHeight) * 2 - 1);
}
