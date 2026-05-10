/**
 * POST /api/contact
 *
 * Serverless contact form handler.
 *
 * Pipeline: Rate-limit → Parse → Validate → Honeypot → Captcha → Send
 *
 * Returns:
 *   200 — message sent
 *   400 — validation errors
 *   403 — captcha failed
 *   429 — rate-limited
 *   500 — unexpected error
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { verifyCaptchaToken } from '@/lib/captcha';
import { sendContactEmail } from '@/lib/email';
import { validateContactForm, hasErrors } from '@/lib/validation';

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
  captchaToken?: string;
  /** Honeypot field — must be empty. Bots auto-fill hidden fields. */
  website?: string;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  try {
    // ── 1. Rate limiting ──
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds ?? 60) },
        }
      );
    }

    // ── 2. Parse body ──
    let body: ContactRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    // ── 3. Honeypot check (bot trap) ──
    if (body.website) {
      // Silently succeed — don't tip off bots
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── 4. Validate inputs ──
    const errors = validateContactForm({
      name: body.name ?? '',
      email: body.email ?? '',
      message: body.message ?? '',
    });
    if (hasErrors(errors)) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // ── 5. Captcha verification ──
    const captchaResult = await verifyCaptchaToken(body.captchaToken);
    if (!captchaResult.isValid) {
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // ── 6. Send email ──
    const sendResult = await sendContactEmail({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
      submittedAt: new Date().toISOString(),
    });

    if (!sendResult.isSuccess) {
      console.error('[Contact API] Email send failed:', sendResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: sendResult.messageId },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Contact API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
