/**
 * In-memory sliding-window rate limiter.
 *
 * Tracks request counts per identifier (typically client IP)
 * within a configurable time window. Designed for serverless
 * environments where the function instance stays warm.
 */

interface RateLimitEntry {
  readonly count: number;
  readonly resetTime: number;
}

interface RateLimitResult {
  readonly isAllowed: boolean;
  readonly remaining: number;
  readonly retryAfterSeconds?: number;
}

interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 5,
} as const;

const MAX_STORE_SIZE = 10_000;

const store = new Map<string, RateLimitEntry>();

/** Remove expired entries when store grows too large. */
function pruneExpiredEntries(now: number): void {
  if (store.size <= MAX_STORE_SIZE) return;
  store.forEach((entry, key) => {
    if (now > entry.resetTime) store.delete(key);
  });
}

/** Check whether a request from `identifier` is allowed. */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  const now = Date.now();
  pruneExpiredEntries(now);
  const entry = store.get(identifier);
  if (!entry || now > entry.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + config.windowMs });
    return { isAllowed: true, remaining: config.maxRequests - 1 };
  }
  if (entry.count >= config.maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1_000);
    return { isAllowed: false, remaining: 0, retryAfterSeconds };
  }
  store.set(identifier, { count: entry.count + 1, resetTime: entry.resetTime });
  return { isAllowed: true, remaining: config.maxRequests - entry.count - 1 };
}
