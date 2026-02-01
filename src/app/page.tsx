import Hero from '@/components/Hero';
import ProjectsGrid from '@/components/ProjectsGrid';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsGrid />
      <About />
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
