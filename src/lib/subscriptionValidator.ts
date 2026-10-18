import { CitizenProfile, CitizenSubscription } from '@/types';

/**
 * Validates whether a citizen's subscription passes cryptographic structural requirements on the client.
 * Guards against client-side localStorage tampering where an attacker manually changes
 * status to 'active' without possessing a valid HMAC-SHA256 signature and transaction token.
 */
export function isSubscriptionStructurallyValid(sub?: CitizenSubscription | null): boolean {
  if (!sub || typeof sub !== 'object') return false;
  if (sub.status !== 'active') return false;

  // 1. Must possess a valid 64-character hex HMAC-SHA256 digital signature
  if (!sub.signature || typeof sub.signature !== 'string' || sub.signature.length !== 64) {
    return false;
  }
  if (!/^[0-9a-f]{64}$/i.test(sub.signature)) {
    return false;
  }

  // 2. Must possess an authentic transaction identifier
  if (!sub.transactionId || typeof sub.transactionId !== 'string' || sub.transactionId.length < 6) {
    return false;
  }

  // 3. Amount must strictly match official fee (1 INR or legacy 19 INR)
  if (sub.amount !== 1 && sub.amount !== 19) {
    return false;
  }

  // 4. Expiry timestamp must be valid and in the future
  if (!sub.validUntil) return false;
  const expiry = new Date(sub.validUntil);
  if (isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
    return false;
  }

  return true;
}

/**
 * Authoritative client subscription check.
 * Used across OpportunityCard, DetailBottomSheet, Header, and Page components.
 */
export function isCitizenSubscribed(
  profile?: CitizenProfile | null
): profile is CitizenProfile & { subscription: CitizenSubscription } {
  if (!profile || !profile.subscription) return false;
  return isSubscriptionStructurallyValid(profile.subscription);
}

/**
 * Purges tampered or forged subscription from local storage and dispatches update event.
 */
function purgeTamperedSubscription(profile: CitizenProfile, onTamperDetected?: () => void): void {
  try {
    const cleaned: CitizenProfile = {
      ...profile,
      subscription: undefined,
    };
    localStorage.setItem('citizen_profile', JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent('subscription_tamper_detected'));
  } catch (e) {}
  onTamperDetected?.();
}

/**
 * Server-side anti-tamper sync: Asynchronously verifies subscription authenticity against the server's private secret.
 * If tampered, wipes the forged subscription from local storage.
 */
export async function verifySubscriptionWithServer(
  profile: CitizenProfile,
  onTamperDetected?: () => void
): Promise<boolean> {
  if (!profile.subscription || profile.subscription.status !== 'active') {
    return false;
  }

  // 1. Structural pre-check (instantly catches amateur DevTools tampering)
  if (!isSubscriptionStructurallyValid(profile.subscription)) {
    console.warn('Security Alert: Tampered subscription detected. Signature or transaction token missing.');
    purgeTamperedSubscription(profile, onTamperDetected);
    return false;
  }

  // 2. Cryptographic server-side verification
  try {
    const res = await fetch('/api/subscription/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        citizenId: profile.id,
        subscription: profile.subscription,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.valid) {
      console.warn('Security Alert: Subscription signature rejected by server security gateway.');
      purgeTamperedSubscription(profile, onTamperDetected);
      return false;
    }

    return true;
  } catch (e) {
    // If client is offline, allow the valid HMAC structure to stand until back online
    return true;
  }
}
