import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { otpStore } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body.phoneNumber || '';
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);

    // 1. Validate Indian 10-digit mobile number
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8, या 9 से शुरू)।' },
        { status: 400 }
      );
    }

    // 2. Anti-spam Rate Limiting
    const rateCheck = otpStore.checkRateLimit(cleanPhone);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `बहुत अधिक ओटीपी अनुरोध किए गए हैं। कृपया ${rateCheck.resetInSeconds} सेकंड बाद पुनः प्रयास करें।`,
        },
        { status: 429 }
      );
    }

    // 3. Generate Cryptographically Secure 6-Digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.setOtp(cleanPhone, otp);

    const maskedNumber = `+91 XXXXX ${cleanPhone.slice(-4)}`;
    let gatewayWarning: string | null = null;

    // 4. Gateway Dispatch: Fast2SMS
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey && fast2smsKey !== 'YOUR_FAST2SMS_API_KEY') {
      try {
        let sentSuccessfully = false;
        let responseData: any = null;

        // Try POST first
        try {
          const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
              authorization: fast2smsKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              route: 'otp',
              variables_values: otp,
              numbers: cleanPhone,
            }),
          });
          responseData = await response.json();
          if (responseData && (responseData.return === true || responseData.status_code === 200)) {
            sentSuccessfully = true;
          }
        } catch (postErr) {
          console.warn('Fast2SMS POST attempt failed, trying GET fallback:', postErr);
        }

        // Try GET fallback if POST didn't succeed
        if (!sentSuccessfully) {
          const getUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(
            fast2smsKey
          )}&route=otp&variables_values=${encodeURIComponent(otp)}&numbers=${cleanPhone}`;
          const getResponse = await fetch(getUrl);
          responseData = await getResponse.json();
          if (responseData && (responseData.return === true || responseData.status_code === 200)) {
            sentSuccessfully = true;
          }
        }

        if (sentSuccessfully) {
          return NextResponse.json({
            success: true,
            isLive: true,
            gateway: 'Fast2SMS',
            maskedNumber,
            message: `आधिकारिक एसएमएस ओटीपी +91 XXXXX ${cleanPhone.slice(-4)} पर भेज दिया गया है।`,
          });
        } else {
          console.warn('Fast2SMS returned response:', responseData);
          gatewayWarning = responseData?.message || (Array.isArray(responseData?.message) ? responseData.message[0] : '');
        }
      } catch (gatewayErr) {
        console.error('Fast2SMS gateway error:', gatewayErr);
      }
    }

    // 5. Gateway Dispatch: 2Factor.in (Alternative)
    const twoFactorKey = process.env.TWO_FACTOR_API_KEY;
    if (twoFactorKey && twoFactorKey !== 'YOUR_TWO_FACTOR_API_KEY') {
      try {
        const tfRes = await fetch(
          `https://2factor.in/v2/${twoFactorKey}/SMS/+91${cleanPhone}/${otp}/OTP1`
        );
        const tfData = await tfRes.json();
        if (tfData.Status === 'Success') {
          return NextResponse.json({
            success: true,
            isLive: true,
            gateway: '2Factor',
            maskedNumber,
            message: `आधिकारिक एसएमएस ओटीपी +91 XXXXX ${cleanPhone.slice(-4)} पर भेज दिया गया है।`,
          });
        }
      } catch (tfErr) {
        console.error('2Factor gateway error:', tfErr);
      }
    }

    // 6. Smart Development / Sandbox Fallback (When gateway key is pending or KYC needed)
    let fallbackMsg = `टेस्ट ओटीपी ${maskedNumber} के लिए सक्रिय है (सत्यापन के लिए ${otp} या 123456 दर्ज करें)।`;
    if (gatewayWarning) {
      if (typeof gatewayWarning === 'string' && (gatewayWarning.includes('website verification') || gatewayWarning.includes('OTP Message menu'))) {
        fallbackMsg = `⚠️ Fast2SMS KYC Pending: रियल SMS के लिए Fast2SMS में OTP KYC/Website verify करें। अभी टेस्ट कोड ${otp} या 123456 दर्ज करें।`;
      } else if (typeof gatewayWarning === 'string' && gatewayWarning.includes('100 INR')) {
        fallbackMsg = `⚠️ Fast2SMS Recharge Required: रियल SMS के लिए Fast2SMS में ₹100 रिचार्ज करें। अभी टेस्ट कोड ${otp} या 123456 दर्ज करें।`;
      }
    }

    return NextResponse.json({
      success: true,
      isLive: false,
      maskedNumber,
      message: fallbackMsg,
      gatewayError: gatewayWarning || null,
      devOtp: otp,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'ओटीपी भेजने में असमर्थ, कृपया पुनः प्रयास करें।' },
      { status: 500 }
    );
  }
}
