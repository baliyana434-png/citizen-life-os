/**
 * Server-Side In-Memory OTP Store & Rate Limiter
 * Provides secure 5-minute TTL, attempt limits, and rate-limiting.
 */

interface OtpRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class OtpStore {
  private otps: Map<string, OtpRecord> = new Map();
  private rateLimits: Map<string, RateLimitRecord> = new Map();

  constructor() {
    // Run cleanup every 2 minutes
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 2 * 60 * 1000);
    }
  }

  /**
   * Save OTP for a phone number with TTL (default 5 minutes)
   */
  setOtp(phone: string, otp: string, ttlMs: number = 5 * 60 * 1000): void {
    this.otps.set(phone, {
      otp,
      expiresAt: Date.now() + ttlMs,
      attempts: 0,
    });
  }

  /**
   * Retrieve OTP record if not expired
   */
  getOtpRecord(phone: string): OtpRecord | null {
    const record = this.otps.get(phone);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      this.otps.delete(phone);
      return null;
    }

    return record;
  }

  /**
   * Increment failed attempt count
   */
  incrementAttempts(phone: string): number {
    const record = this.otps.get(phone);
    if (!record) return 0;
    record.attempts += 1;
    return record.attempts;
  }

  /**
   * Remove OTP upon successful verification
   */
  deleteOtp(phone: string): void {
    this.otps.delete(phone);
  }

  /**
   * Rate limiting: max N requests per window (default: 3 requests per hour)
   */
  checkRateLimit(phone: string, maxRequests: number = 4, windowMs: number = 60 * 60 * 1000): { allowed: boolean; remaining: number; resetInSeconds: number } {
    const now = Date.now();
    const record = this.rateLimits.get(phone);

    if (!record || now > record.resetAt) {
      this.rateLimits.set(phone, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
    }

    if (record.count >= maxRequests) {
      const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
      return { allowed: false, remaining: 0, resetInSeconds };
    }

    record.count += 1;
    return { allowed: true, remaining: maxRequests - record.count, resetInSeconds: Math.ceil((record.resetAt - now) / 1000) };
  }

  /**
   * Clean up expired records
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [phone, record] of this.otps.entries()) {
      if (now > record.expiresAt) {
        this.otps.delete(phone);
      }
    }
    for (const [phone, record] of this.rateLimits.entries()) {
      if (now > record.resetAt) {
        this.rateLimits.delete(phone);
      }
    }
  }
}

// Global singleton instance across Next.js API route calls
const globalForOtp = globalThis as unknown as { otpStore?: OtpStore };
export const otpStore = globalForOtp.otpStore ?? new OtpStore();
globalForOtp.otpStore = otpStore;

