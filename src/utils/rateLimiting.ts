/**
 * Rate limiting utilities for security
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
}

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const attemptRecords: Map<string, AttemptRecord> = new Map();

// Default configurations for different operations
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 30 * 60 * 1000, // 30 minutes lockout
  },
  signup: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    lockoutMs: 60 * 60 * 1000, // 1 hour lockout
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    lockoutMs: 30 * 60 * 1000, // 30 minutes lockout
  },
};

/**
 * Check if an operation is rate limited for a given identifier (usually email)
 */
export const isRateLimited = (operation: string, identifier: string): { limited: boolean; remainingTime?: number } => {
  const config = RATE_LIMITS[operation];
  if (!config) return { limited: false };

  const key = `${operation}:${identifier.toLowerCase()}`;
  const record = attemptRecords.get(key);
  const now = Date.now();

  if (!record) return { limited: false };

  // Check if currently locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      limited: true,
      remainingTime: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  // Check if window has expired, reset if so
  if (now - record.firstAttempt > config.windowMs) {
    attemptRecords.delete(key);
    return { limited: false };
  }

  // Check if within rate limit
  if (record.count >= config.maxAttempts) {
    // Apply lockout
    record.lockedUntil = now + config.lockoutMs;
    return {
      limited: true,
      remainingTime: Math.ceil(config.lockoutMs / 1000),
    };
  }

  return { limited: false };
};

/**
 * Record an attempt for rate limiting
 */
export const recordAttempt = (operation: string, identifier: string, success: boolean = false): void => {
  const config = RATE_LIMITS[operation];
  if (!config) return;

  const key = `${operation}:${identifier.toLowerCase()}`;
  const now = Date.now();
  const record = attemptRecords.get(key);

  if (success) {
    // Clear record on successful operation
    attemptRecords.delete(key);
    return;
  }

  if (!record) {
    attemptRecords.set(key, {
      count: 1,
      firstAttempt: now,
    });
  } else {
    // Check if window has expired
    if (now - record.firstAttempt > config.windowMs) {
      // Reset the window
      attemptRecords.set(key, {
        count: 1,
        firstAttempt: now,
      });
    } else {
      record.count += 1;
    }
  }
};

/**
 * Get remaining attempts before rate limit
 */
export const getRemainingAttempts = (operation: string, identifier: string): number => {
  const config = RATE_LIMITS[operation];
  if (!config) return Infinity;

  const key = `${operation}:${identifier.toLowerCase()}`;
  const record = attemptRecords.get(key);
  
  if (!record) return config.maxAttempts;
  
  const now = Date.now();
  if (now - record.firstAttempt > config.windowMs) {
    return config.maxAttempts;
  }
  
  return Math.max(0, config.maxAttempts - record.count);
};

/**
 * Clean up old records (call periodically)
 */
export const cleanupRateLimitRecords = (): void => {
  const now = Date.now();
  const maxWindowMs = Math.max(...Object.values(RATE_LIMITS).map(config => config.windowMs));
  
  for (const [key, record] of attemptRecords.entries()) {
    if (now - record.firstAttempt > maxWindowMs && (!record.lockedUntil || now > record.lockedUntil)) {
      attemptRecords.delete(key);
    }
  }
};

// Auto-cleanup every 10 minutes
setInterval(cleanupRateLimitRecords, 10 * 60 * 1000);