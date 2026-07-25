/**
 * Maps skill icon keys to their react-icons components.
 *
 * Kept apart from `skills.ts` so the WebGL constellation can import skill
 * data without also importing the icon set.
 */

import type { IconType } from 'react-icons';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiLaravel,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiLinux,
  SiDocker,
  SiFigma,
} from 'react-icons/si';
import type { SkillIconKey } from './skills';

export const SKILL_ICONS: Record<SkillIconKey, IconType> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  tailwind: SiTailwindcss,
  html5: SiHtml5,
  css3: SiCss,
  nodejs: SiNodedotjs,
  python: SiPython,
  php: SiPhp,
  laravel: SiLaravel,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  git: SiGit,
  linux: SiLinux,
  docker: SiDocker,
  figma: SiFigma,
};
