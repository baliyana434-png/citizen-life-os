/**
 * Production Aadhaar Identity & KYC Client Service
 * Calls server-side Next.js API routes (/api/kyc/aadhaar/*) backed by Cashfree / Surepass.
 * Follows strict DPDPA 2023 & UIDAI AES-256 masking standards.
 */

export interface AadhaarOtpRequestResponse {
  success: boolean;
  referenceId: string;
  maskedMobile: string;
  message: string;
  messageHi?: string;
  provider?: string;
}

export interface AadhaarVerificationResponse {
  success: boolean;
  isVerified: boolean;
  maskedAadhaar: string; // e.g. 'XXXX-XXXX-8921'
  verifiedName: string;
  verifiedDob: string;
  verifiedGender: 'male' | 'female' | 'other';
  verifiedState: string;
  verifiedDistrict: string;
  verifiedPincode?: string;
  message: string;
  messageHi?: string;
  provider?: string;
}

export class KycService {
  /**
   * Request official UIDAI OTP via server-side KYC gateway
   */
  static async requestAadhaarOtp(aadhaarNumber: string): Promise<AadhaarOtpRequestResponse> {
    const cleanNumber = aadhaarNumber.replace(/[\s-]/g, '').trim();
    if (cleanNumber.length !== 12 || !/^\d{12}$/.test(cleanNumber)) {
      throw new Error('आधार नंबर ठीक १२ अंकों का होना चाहिए।');
    }

    const response = await fetch('/api/kyc/aadhaar/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aadhaarNumber: cleanNumber }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'आधार सर्वर से ओटीपी भेजने में विफलता। कृपया पुनः प्रयास करें।');
    }

    return {
      success: true,
      referenceId: data.referenceId,
      maskedMobile: data.maskedMobile,
      message: data.message,
      messageHi: data.message,
      provider: data.provider,
    };
  }

  /**
   * Verify UIDAI OTP and obtain authenticated citizen profile
   */
  static async verifyAadhaarOtp(
    referenceId: string,
    otpCode: string,
    originalAadhaarNumber: string
  ): Promise<AadhaarVerificationResponse> {
    const cleanOtp = otpCode.replace(/\D/g, '').trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      throw new Error('कृपया ६ अंकों का वैध ओटीपी दर्ज करें।');
    }

    const response = await fetch('/api/kyc/aadhaar/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referenceId,
        otp: cleanOtp,
        aadhaarNumber: originalAadhaarNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'अमान्य ओटीपी कोड। कृपया सही कोड दर्ज करें।');
    }

    return {
      success: true,
      isVerified: true,
      maskedAadhaar: data.maskedAadhaar,
      verifiedName: data.verifiedName,
      verifiedDob: data.verifiedDob,
      verifiedGender: data.verifiedGender,
      verifiedState: data.verifiedState,
      verifiedDistrict: data.verifiedDistrict,
      verifiedPincode: data.verifiedPincode,
      message: data.message,
      messageHi: data.message,
      provider: data.provider,
    };
  }
}
