import Container from './Container';
import { Grid, GridItem } from './Grid';

const skills = [
  { name: 'HTML5', level: 95, icon: 'H' },
  { name: 'CSS3', level: 90, icon: 'C' },
  { name: 'JavaScript', level: 85, icon: 'JS' },
  { name: 'React', level: 85, icon: 'R' },
  { name: 'Node.js', level: 80, icon: 'N' },
  { name: 'MongoDB', level: 75, icon: 'M' },
  { name: 'TypeScript', level: 80, icon: 'TS' },
  { name: 'Python', level: 70, icon: 'Py' },
  { name: 'Git', level: 85, icon: 'G' },
  { name: 'PHP', level: 70, icon: 'P' },
  { name: 'Laravel', level: 65, icon: 'L' },
  { name: 'Linux', level: 75, icon: 'Li' },
];

export default function Skills() {
  return (
    <section className="min-h-screen py-24 pt-32 bg-[var(--color-background)]">
      <Container size="xl">
        <h2 className="section-heading">My Skills</h2>
        <Grid
          cols={2}
          colsMd={3}
          colsLg={4}
          gap={6}
          className="max-w-5xl mx-auto"
        >
          {skills.map((skill, index) => (
            <GridItem key={skill.name}>
              <div
                className="group p-6 bg-[var(--color-background-alt)] rounded-xl border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-shadow-accent)] transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="gradient-text text-xl font-bold">
                    {skill.icon}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-center text-lg font-semibold text-[var(--color-foreground)] mb-3">
                  {skill.name}
                </h3>

                {/* Progress Bar */}
                <div className="relative h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 gradient-bg rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                {/* Percentage */}
                <p className="text-center text-sm text-[var(--color-accent)] mt-2 font-medium">
                  {skill.level}%
                </p>
              </div>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
