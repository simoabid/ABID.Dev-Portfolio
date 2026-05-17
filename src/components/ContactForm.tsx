'use client';

/**
 * ContactForm Component
 *
 * Premium contact form with:
 * - Client-side validation (shared rules with API)
 * - GSAP animations (shake on error, fade transition on success)
 * - Loading, success, and error states
 * - Honeypot field for bot protection
 * - Optional reCAPTCHA v3 / hCaptcha integration
 * - Character counter for message field
 * - Accessible labels, ARIA attributes, focus management
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import {
  validateField,
  validateContactForm,
  hasErrors,
  MESSAGE_CHAR_LIMIT,
} from '@/lib/validation';
import type { ContactFormData, ValidationErrors } from '@/lib/validation';
import HoverRollText from './UI/HoverRollText';
import { MagicCard } from './UI/MagicBento';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/** Extend window for reCAPTCHA v3 global. */
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

/** Attempt to get a captcha token (reCAPTCHA v3). Returns null if not configured. */
async function getCaptchaToken(): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
  const provider = process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER;
  if (!siteKey || provider !== 'recaptcha' || !window.grecaptcha) return null;
  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!.execute(siteKey, { action: 'contact' }).then(resolve);
    });
  });
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // ── Load reCAPTCHA script if configured ──
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
    const provider = process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER;
    if (!siteKey || provider !== 'recaptcha') return;
    if (document.querySelector(`script[src*="recaptcha"]`)) return;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        const fieldError = validateField(name as keyof ContactFormData, value);
        setErrors((prev) => {
          const next = { ...prev };
          if (fieldError) next[name as keyof ValidationErrors] = fieldError;
          else delete next[name as keyof ValidationErrors];
          return next;
        });
      }
    },
    [touched]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const fieldError = validateField(name as keyof ContactFormData, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) next[name as keyof ValidationErrors] = fieldError;
        else delete next[name as keyof ValidationErrors];
        return next;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const formErrors = validateContactForm(formData);
      setErrors(formErrors);
      setTouched({ name: true, email: true, message: true });
      if (hasErrors(formErrors)) {
        if (formRef.current) {
          gsap.to(formRef.current, {
            keyframes: [
              { x: -8, duration: 0.07 },
              { x: 8, duration: 0.07 },
              { x: -6, duration: 0.07 },
              { x: 6, duration: 0.07 },
              { x: -3, duration: 0.07 },
              { x: 3, duration: 0.07 },
              { x: 0, duration: 0.07 },
            ],
            ease: 'power2.out',
          });
        }
        return;
      }
      setStatus('submitting');
      setServerError('');
      try {
        const captchaToken = await getCaptchaToken();
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            captchaToken,
            website: honeypotRef.current?.value || '',
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          if (result.errors) {
            setErrors(result.errors);
            setStatus('error');
            setServerError('Please fix the errors below.');
          } else if (response.status === 429) {
            setStatus('error');
            setServerError(
              `Too many requests. Please wait ${result.retryAfter || 60} seconds.`
            );
          } else {
            setStatus('error');
            setServerError(
              result.error || 'Something went wrong. Please try again.'
            );
          }
          return;
        }
        setStatus('success');
        if (formRef.current && successRef.current) {
          const tl = gsap.timeline();
          tl.to(formRef.current, {
            autoAlpha: 0,
            y: -20,
            duration: 0.35,
            ease: 'power2.in',
          }).fromTo(
            successRef.current,
            { autoAlpha: 0, y: 20, scale: 0.95 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.4)',
            }
          );
        }
      } catch {
        setStatus('error');
        setServerError(
          'Network error. Please check your connection and try again.'
        );
      }
    },
    [formData]
  );

  const handleReset = useCallback(() => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setTouched({});
    setStatus('idle');
    setServerError('');
    if (formRef.current && successRef.current) {
      gsap.set(successRef.current, { autoAlpha: 0 });
      gsap.fromTo(
        formRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  const isSubmitting = status === 'submitting';
  const messageLength = formData.message.length;
  const isMessageNearLimit = messageLength > MESSAGE_CHAR_LIMIT * 0.9;

  return (
    <div className="relative">
      {/* ── Form ── */}
      <MagicCard
        as="form"
        ref={formRef as any}
        onSubmit={handleSubmit}
        noValidate
        className="glass-card rounded-2xl p-8 space-y-6"
        style={{ visibility: status === 'success' ? 'hidden' : 'visible' }}
        aria-label="Contact form"
      >
        {/* Server error banner */}
        {serverError && status === 'error' && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            role="alert"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        {/* Honeypot — hidden from humans, bots auto-fill */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            ref={honeypotRef}
            type="text"
            id="contact-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-[var(--color-foreground)] mb-2"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            autoComplete="name"
            className={`w-full px-4 py-3 bg-[var(--color-background)] border rounded-xl text-[var(--color-foreground)] placeholder-[var(--color-foreground-subtle)] focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)] focus:outline-none transition-all duration-200 disabled:opacity-50 ${
              errors.name && touched.name
                ? 'border-red-500/60'
                : 'border-[var(--color-border)]'
            }`}
            placeholder="Your name"
            aria-invalid={errors.name && touched.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && touched.name && (
            <p
              id="name-error"
              className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
              role="alert"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-[var(--color-foreground)] mb-2"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            autoComplete="email"
            className={`w-full px-4 py-3 bg-[var(--color-background)] border rounded-xl text-[var(--color-foreground)] placeholder-[var(--color-foreground-subtle)] focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)] focus:outline-none transition-all duration-200 disabled:opacity-50 ${
              errors.email && touched.email
                ? 'border-red-500/60'
                : 'border-[var(--color-border)]'
            }`}
            placeholder="your@email.com"
            aria-invalid={errors.email && touched.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && touched.email && (
            <p
              id="email-error"
              className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
              role="alert"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-[var(--color-foreground)]"
            >
              Message
            </label>
            <span
              className={`text-xs transition-colors ${
                isMessageNearLimit
                  ? 'text-amber-400'
                  : 'text-[var(--color-foreground-subtle)]'
              }`}
              aria-live="polite"
            >
              {messageLength}/{MESSAGE_CHAR_LIMIT}
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            rows={5}
            maxLength={MESSAGE_CHAR_LIMIT}
            className={`w-full px-4 py-3 bg-[var(--color-background)] border rounded-xl text-[var(--color-foreground)] placeholder-[var(--color-foreground-subtle)] focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)] focus:outline-none transition-all duration-200 resize-none disabled:opacity-50 ${
              errors.message && touched.message
                ? 'border-red-500/60'
                : 'border-[var(--color-border)]'
            }`}
            placeholder="Tell me about your project, idea, or just say hello…"
            aria-invalid={errors.message && touched.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && touched.message && (
            <p
              id="message-error"
              className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
              role="alert"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          ref={submitBtnRef}
          type="submit"
          disabled={isSubmitting}
          className="cursor-target relative w-full btn-primary py-4 text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
          aria-busy={isSubmitting}
        >
          <HoverRollText
            className={`inline-flex items-center gap-2 transition-all duration-300 ${
              isSubmitting ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Send Message
          </HoverRollText>
          {/* Loading spinner */}
          {isSubmitting && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-5 h-5 animate-spin text-[var(--color-foreground-inverted)]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-2 text-[var(--color-foreground-inverted)]">
                Sending…
              </span>
            </span>
          )}
        </button>

        {/* Captcha disclosure */}
        {process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER === 'recaptcha' && (
          <p className="text-xs text-[var(--color-foreground-subtle)] text-center leading-relaxed">
            Protected by reCAPTCHA.{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-accent)]"
            >
              Privacy
            </a>{' '}
            &{' '}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-accent)]"
            >
              Terms
            </a>
          </p>
        )}
      </MagicCard>

      {/* ── Success State ── */}
      <div
        ref={successRef}
        className="absolute inset-0 flex flex-col items-center justify-center glass-card rounded-2xl p-8 text-center"
        style={{ visibility: 'hidden', opacity: 0 }}
        role="status"
        aria-live="polite"
      >
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-6 shadow-lg shadow-[var(--color-accent)]/30">
          <svg
            className="w-10 h-10 text-[var(--color-foreground-inverted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
          Message Sent!
        </h3>
        <p className="text-[var(--color-foreground-muted)] mb-8 max-w-xs">
          Thank you for reaching out. I&apos;ll get back to you as soon as
          possible.
        </p>
        <button
          onClick={handleReset}
          className="cursor-target group btn-outline px-8 py-3 text-sm"
          type="button"
        >
          <HoverRollText text="Send Another Message" />
        </button>
      </div>
    </div>
  );
}
