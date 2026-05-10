/**
 * Server-side captcha verification.
 *
 * Supports reCAPTCHA v3 and hCaptcha. The provider is auto-detected
 * from environment variables. When no secret key is configured,
 * verification is skipped (development mode).
 */

type CaptchaProvider = 'recaptcha' | 'hcaptcha' | 'none';

interface CaptchaResult {
  readonly isValid: boolean;
  readonly score?: number;
  readonly provider: CaptchaProvider;
}

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify';
const RECAPTCHA_SCORE_THRESHOLD = 0.5;

function detectProvider(): CaptchaProvider {
  if (process.env.RECAPTCHA_SECRET_KEY) return 'recaptcha';
  if (process.env.HCAPTCHA_SECRET_KEY) return 'hcaptcha';
  return 'none';
}

async function verifyRecaptcha(token: string): Promise<CaptchaResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  });
  const data = await response.json();
  const score = data.score as number | undefined;
  const isValid = Boolean(data.success) && (score ?? 1) >= RECAPTCHA_SCORE_THRESHOLD;
  return { isValid, score, provider: 'recaptcha' };
}

async function verifyHcaptcha(token: string): Promise<CaptchaResult> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY!;
  const response = await fetch(HCAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  });
  const data = await response.json();
  return { isValid: Boolean(data.success), provider: 'hcaptcha' };
}

/** Verify a captcha token. Skips verification when no provider is configured. */
export async function verifyCaptchaToken(token: string | undefined): Promise<CaptchaResult> {
  const provider = detectProvider();
  if (provider === 'none' || !token) {
    return { isValid: true, provider: 'none' };
  }
  if (provider === 'recaptcha') return verifyRecaptcha(token);
  return verifyHcaptcha(token);
}

/** Check whether captcha is required (keys are configured). */
export function isCaptchaRequired(): boolean {
  return detectProvider() !== 'none';
}
