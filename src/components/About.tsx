export default function About() {
  return (
    <section className="min-h-screen py-24 pt-32 bg-[var(--color-background-alt)]">
      <div className="container mx-auto px-4">
        <h2 className="section-heading">About Me</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile Image Placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent-secondary)]/30 flex items-center justify-center overflow-hidden border-2 border-[var(--color-border)]">
                <div className="text-center text-[var(--color-foreground-muted)]">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="text-sm">Profile Photo</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[var(--color-border)] rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-secondary)]/20 rounded-2xl -z-10" />
            </div>

            {/* Bio Content */}
            <div className="bg-[var(--color-background)]/60 p-8 rounded-xl border border-[var(--color-border)]">
              <p className="text-lg text-[var(--color-foreground-muted)] mb-6 leading-relaxed">
                I&apos;m a passionate Full-Stack Developer with a knack for
                creating robust, scalable web applications. My expertise spans
                both front-end and back-end technologies, ensuring seamless user
                experiences from concept to deployment.
              </p>
              <p className="text-lg text-[var(--color-foreground-muted)] mb-8 leading-relaxed">
                Beyond coding, I&apos;m a tech enthusiast who thrives on
                learning cutting-edge tools and frameworks. My goal is to build
                solutions that not only solve problems but also inspire and
                delight users.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '2+', label: 'Years Experience' },
                  { value: '10+', label: 'Projects' },
                  { value: '5+', label: 'Happy Clients' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="block text-3xl font-bold gradient-text">
                      {stat.value}
                    </span>
                    <span className="text-sm text-[var(--color-foreground-muted)]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Download CV Button */}
              <a
                href="/resume.pdf"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
