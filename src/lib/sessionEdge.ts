/**
 * Edge & Node Compatible Session Token Security Service
 * Implements HMAC-SHA256 signature verification using Web Crypto API (crypto.subtle)
 * Works seamlessly in Next.js Middleware (Edge runtime) and Node.js Server API routes.
 */

const SESSION_SECRET =
  process.env.SESSION_SECRET_KEY ||
  process.env.PAYMENT_SECRET_KEY ||
  'citizen_session_hmac_secret_998124a87b';

export interface SessionPayload {
  citizenId: string;
  email: string;
  exp: number;
}

export interface SessionVerificationResult {
  valid: boolean;
  citizenId?: string;
  email?: string;
}

function base64UrlToUint8Array(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Verifies session token in Edge runtime (crypto.subtle) or Node.js.
 */
export async function verifySessionTokenEdge(
  token: string | undefined | null
): Promise<SessionVerificationResult> {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) {
    return { valid: false };
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SESSION_SECRET) as any,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBytes = base64UrlToUint8Array(signature);
    const dataBytes = encoder.encode(encodedPayload);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as any,
      dataBytes as any
    );

    if (!isValid) {
      return { valid: false };
    }

    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(encodedPayload));
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (!payload.citizenId || !payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }

    return {
      valid: true,
      citizenId: payload.citizenId,
      email: payload.email,
    };
  } catch (err) {
    return { valid: false };
  }
}

/**
 * Creates a signed session token.
 */
export async function generateSessionTokenEdge(
  citizenId: string,
  email: string
): Promise<string> {
  const encoder = new TextEncoder();
  const payload: SessionPayload = {
    citizenId,
    email: (email || '').toLowerCase().trim(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  const payloadJson = JSON.stringify(payload);
  const encodedPayload = uint8ArrayToBase64Url(encoder.encode(payloadJson));

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SECRET) as any,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(encodedPayload) as any
  );

  const signature = uint8ArrayToBase64Url(new Uint8Array(signatureBuffer));
  return `${encodedPayload}.${signature}`;
}

export const SESSION_COOKIE_NAME = 'citzos_session';
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
