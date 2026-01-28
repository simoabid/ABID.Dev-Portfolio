'use client';

import { useState } from 'react';

const contactInfo = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Email',
    value: 'seemooabid@gmail.com',
    href: 'mailto:seemooabid@gmail.com',
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    title: 'Phone',
    value: '+212 6 76 22 61 20',
    href: 'tel:+212676226120',
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: 'Location',
    value: 'Khenifra, Morocco',
    href: '#',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="min-h-screen py-24 pt-32 bg-[var(--color-background)]">
      <div className="container mx-auto px-4">
        <h2 className="section-heading">Get in Touch</h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-semibold text-[var(--color-foreground)] mb-6">
                Let&apos;s work together
              </h3>
              <p className="text-[var(--color-foreground-muted)] mb-8">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>

              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex items-center gap-4 p-4 bg-[var(--color-background-alt)] rounded-xl border border-[var(--color-border-muted)] hover:border-[var(--color-border-accent)] hover:-translate-x-1 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent)] group-hover:bg-gradient-to-r group-hover:from-[var(--color-accent)] group-hover:to-[var(--color-accent-secondary)] group-hover:text-white transition-all duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-foreground)]">
                        {info.title}
                      </h4>
                      <p className="text-[var(--color-foreground-muted)]">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {['GitHub', 'LinkedIn', 'Twitter', 'Instagram'].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground)] hover:bg-gradient-to-r hover:from-[var(--color-accent)] hover:to-[var(--color-accent-secondary)] hover:text-white transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="text-xs font-bold">{social[0]}</span>
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--color-background-alt)] p-8 rounded-xl border border-[var(--color-border-muted)]"
            >
              <div className="mb-6">
                <label className="block text-[var(--color-foreground)] text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] placeholder-[var(--color-foreground-muted)]/50 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[var(--color-foreground)] text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] placeholder-[var(--color-foreground-muted)]/50 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-[var(--color-foreground)] text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] placeholder-[var(--color-foreground-muted)]/50 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" className="w-full btn-primary py-4">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
