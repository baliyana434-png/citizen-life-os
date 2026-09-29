import crypto from 'crypto';
import { CitizenSubscription } from '@/types';

// Server-side private secret key (Never exposed to browser/client)
const SERVER_PAYMENT_SECRET = process.env.PAYMENT_SECRET_KEY || 'citizen_life_os_secure_key_f839a04b12c849e79d1a3b5c7e';

export class PaymentSecurityService {
  /**
   * Generates a tamper-proof cryptographic HMAC-SHA256 digital signature for a 1-year pass.
   * Hacker cannot forge this without having the server's private secret key.
   */
  static generateSignature(citizenId: string, plan: string, validUntil: string, amount: number, currency: string): string {
    const payload = `${citizenId}:${plan}:${validUntil}:${amount}:${currency}`;
    return crypto.createHmac('sha256', SERVER_PAYMENT_SECRET).update(payload).digest('hex');
  }

  /**
   * Verifies if a subscription's digital signature is authentic and unaltered.
   */
  static verifySignature(sub: CitizenSubscription, citizenId: string): boolean {
    if (!sub || !sub.signature) return false;
    // Price must be exactly 19 INR
    if (sub.amount !== 19 || sub.currency !== 'INR') return false;

    // Check expiry timestamp
    const now = new Date();
    const expiry = new Date(sub.validUntil);
    if (isNaN(expiry.getTime()) || expiry <= now) return false;

    const expectedSignature = this.generateSignature(citizenId, sub.plan, sub.validUntil, sub.amount, sub.currency);
    return crypto.timingSafeEqual(Buffer.from(sub.signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  }

  /**
   * Sanitizes input to prevent NoSQL / SQL injection and XSS
   */
  static sanitizeString(input: unknown): string {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>'"&;]/g, '').trim();
  }
}
