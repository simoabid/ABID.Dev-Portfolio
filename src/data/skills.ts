/**
 * Skill data shared by the DOM cards and the WebGL constellation.
 *
 * Icons are referenced by key rather than by component so this module stays
 * free of react-icons. The 3D scene imports names and colours from here and
 * would otherwise drag the whole icon set into the scene graph.
 */

export type SkillIconKey =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'javascript'
  | 'tailwind'
  | 'html5'
  | 'css3'
  | 'nodejs'
  | 'python'
  | 'php'
  | 'laravel'
  | 'mongodb'
  | 'postgresql'
  | 'git'
  | 'linux'
  | 'docker'
  | 'figma';

export interface Skill {
  name: string;
  color: string;
  icon: SkillIconKey;
}

export interface SkillCategory {
  title: string;
  description: string;
  spanLg: 1 | 2 | 3;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend Architecture',
    description: 'Building responsive, accessible, and performant interfaces.',
    spanLg: 2,
    skills: [
      { name: 'React', color: '#61DAFB', icon: 'react' },
      { name: 'Next.js', color: '#ffffff', icon: 'nextjs' },
      { name: 'TypeScript', color: '#3178C6', icon: 'typescript' },
      { name: 'JavaScript', color: '#F7DF1E', icon: 'javascript' },
      { name: 'Tailwind CSS', color: '#06B6D4', icon: 'tailwind' },
      { name: 'HTML5', color: '#E34F26', icon: 'html5' },
      { name: 'CSS3', color: '#1572B6', icon: 'css3' },
    ],
  },
  {
    title: 'Backend Systems',
    description: 'Developing scalable APIs and robust server logic.',
    spanLg: 1,
    skills: [
      { name: 'Node.js', color: '#339933', icon: 'nodejs' },
      { name: 'Python', color: '#3776AB', icon: 'python' },
      { name: 'PHP', color: '#777BB4', icon: 'php' },
      { name: 'Laravel', color: '#FF2D20', icon: 'laravel' },
    ],
  },
  {
    title: 'Database & Infrastructure',
    description: 'Managing data persistence and deployment pipelines.',
    spanLg: 3,
    skills: [
      { name: 'MongoDB', color: '#47A248', icon: 'mongodb' },
      { name: 'PostgreSQL', color: '#4169E1', icon: 'postgresql' },
      { name: 'Git', color: '#F05032', icon: 'git' },
      { name: 'Linux', color: '#FCC624', icon: 'linux' },
      { name: 'Docker', color: '#2496ED', icon: 'docker' },
      { name: 'Figma', color: '#F24E1E', icon: 'figma' },
    ],
  },
];
