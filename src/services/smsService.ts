/**
 * Indian SMS Gateway Client Service
 * Dispatches real carrier SMS and verifies OTP via secure server backend.
 */

export interface SendOtpResponse {
  success: boolean;
  isLive: boolean;
  gateway?: string;
  maskedNumber: string;
  message: string;
  devOtp?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  verified: boolean;
  phoneNumber?: string;
  message: string;
}

export class SmsService {
  /**
   * Request real SMS OTP to Indian mobile number
   */
  static async sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'ओटीपी भेजने में असमर्थ, कृपया पुनः प्रयास करें।');
    }

    return data;
  }

  /**
   * Verify the received SMS OTP
   */
  static async verifyOtp(phoneNumber: string, otp: string): Promise<VerifyOtpResponse> {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'अमान्य ओटीपी कोड।');
    }

    return data;
  }
}
