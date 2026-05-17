/**
 * GSAP + ScrollTrigger only — keep Lenis out of this module so statically
 * imported sections (Hero) do not pull smooth-scroll into the critical path.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
