import "server-only";

/**
 * Fixed-window rate limiter held in process memory.
 *
 * Deliberately simple: it protects the login form from credential stuffing on
 * a single-instance deployment, which is what this app ships as. Behind
 * several instances each one keeps its own counter, so move this to Redis (or
 * your platform's rate limiter) before scaling out.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Drop expired buckets so the map can't grow without bound. */
function sweep(now: number) {
  if (buckets.size < 1000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets. Only meaningful when `ok` is false. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= 10000 && !existing) return { ok: false, retryAfter: Math.ceil(windowMs / 1000) };
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { ok: true, retryAfter: 0 };
}

/** Clears a key's counter — call after a successful login. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}
