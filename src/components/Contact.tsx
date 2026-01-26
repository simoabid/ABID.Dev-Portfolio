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
    <section className="min-h-screen py-24 pt-32 bg-dark-primary">
      <div className="container mx-auto px-4">
        <h2 className="section-heading">Get in Touch</h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-semibold text-text-primary mb-6">
                Let&apos;s work together
              </h3>
              <p className="text-text-secondary mb-8">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>

              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex items-center gap-4 p-4 bg-dark-secondary rounded-xl border border-accent-primary/20 hover:border-accent-primary/50 hover:-translate-x-1 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary group-hover:text-white transition-all duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {info.title}
                      </h4>
                      <p className="text-text-secondary">{info.value}</p>
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
                      className="w-10 h-10 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-text-primary hover:bg-gradient-to-r hover:from-accent-primary hover:to-accent-secondary hover:text-white transition-all duration-300 hover:-translate-y-1"
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
              className="bg-dark-secondary p-8 rounded-xl border border-accent-primary/20"
            >
              <div className="mb-6">
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-primary border border-accent-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-primary border border-accent-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-dark-primary border border-accent-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 gradient-bg text-white font-semibold rounded-full shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/50 hover:scale-[1.02] transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
