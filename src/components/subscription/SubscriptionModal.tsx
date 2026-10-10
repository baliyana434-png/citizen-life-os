'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Calendar, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  Smartphone,
  ExternalLink,
  Award
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import { CitizenSubscription } from '@/types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizenName: string;
  citizenId: string;
  onSubscriptionSuccess: (sub: CitizenSubscription) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  citizenName,
  citizenId,
  onSubscriptionSuccess,
}) => {
  const { language } = useTranslation();
  const { country, countryMeta } = useCountry();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<CitizenSubscription | null>(null);
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Auto-launch Razorpay immediately when opened!
  useEffect(() => {
    if (isOpen && !successReceipt) {
      handlePayment();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Plan pricing
  const planAmount = 19;
  const currencyCode = 'INR';
  const currencySymbol = '₹';

  // Calculate validity (365 days from now)
  const now = new Date();
  const validUntilDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  const validUntilStr = validUntilDate.toISOString().split('T')[0];

  // Load Razorpay Standard Checkout Script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (preferredMethod?: 'upi' | 'card' | 'netbanking') => {
    setIsProcessing(true);
    try {
      // 1. Create server-locked order
      const orderRes = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenId }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Order creation failed');
      }

      // 2. If Razorpay Key is configured, launch official Razorpay Checkout popup
      if (orderData.keyId && orderData.keyId.startsWith('rzp_')) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Razorpay SDK load nahi ho saka. Kripya internet connection check karein.');
        }

        const options: any = {
          key: orderData.keyId,
          amount: orderData.order.amountPaisa || orderData.order.amount * 100,
          currency: orderData.order.currency || 'INR',
          name: 'Citizen Life OS',
          description: '1-Year National Citizen Access Pass (365 Days)',
          order_id: orderData.order.orderId,
          prefill: {
            name: citizenName,
          },
          notes: {
            citizenId,
            plan: '1_year',
          },
          theme: {
            color: '#059669', // Emerald 600
            backdrop_color: 'rgba(15, 23, 42, 0.85)',
          },
          handler: async function (response: any) {
            try {
              // 3. Cryptographically verify signature on server
              const verifyRes = await fetch('/api/subscription/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  citizenId,
                  orderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  paymentToken: response.razorpay_payment_id,
                  paymentMethod: preferredMethod ? `RAZORPAY_${preferredMethod.toUpperCase()}` : 'RAZORPAY_ALL_METHODS',
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyData.success || !verifyData.subscription) {
                throw new Error(verifyData.message || 'Payment signature verification failed');
              }

              setSuccessReceipt(verifyData.subscription);
              onSubscriptionSuccess(verifyData.subscription);
            } catch (verErr: any) {
              console.error('Razorpay verification error:', verErr);
              alert(verErr.message || 'Payment verification failed');
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              onClose();
            },
          },
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.on('payment.failed', function (resp: any) {
          console.error('Payment failed:', resp.error);
          setIsProcessing(false);
          onClose();
          alert(
            (language === 'hi' ? 'भुगतान विफल: ' : 'Payment Failed: ') +
              (resp.error?.description || (language === 'hi' ? 'कृपया पुनः प्रयास करें।' : 'Please try again.'))
          );
        });
        razorpayInstance.open();
        return;
      }

      // 3. Fallback Test Mode (when Razorpay keys are not yet pasted in .env.local)
      const simPaymentToken = 'SIM_TOKEN_' + orderData.order.orderId + '_' + Date.now();
      const verifyRes = await fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenId,
          orderId: orderData.order.orderId,
          paymentToken: simPaymentToken,
          paymentMethod: 'TEST_MODE',
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success || !verifyData.subscription) {
        throw new Error(verifyData.message || 'Verification failed');
      }

      setSuccessReceipt(verifyData.subscription);
      onSubscriptionSuccess(verifyData.subscription);
    } catch (err: any) {
      console.error('Payment process error:', err);
      onClose();
      alert(
        (language === 'hi' ? 'भुगतान प्रक्रिया में त्रुटि: ' : 'Payment Error: ') +
          (err.message || (language === 'hi' ? 'कृपया पुनः प्रयास करें।' : 'Please try again.'))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const copyTransactionId = (txn: string) => {
    navigator.clipboard.writeText(txn);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  // If payment succeeded, show the Official Digital Receipt
  if (successReceipt) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="fixed inset-0" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto p-5 sm:p-6 space-y-4">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-base font-extrabold text-emerald-950">
              {language === 'hi' ? 'सदस्यता सफलतापूर्वक सक्रिय हो गई!' : '1-Year Citizen Pass Activated!'}
            </h4>
            <p className="text-xs text-emerald-800">
              {language === 'hi' ? 'आपके आयु, क्षेत्र और देश के अनुसार सभी वास्तविक अवसर अनलॉक हो चुके हैं।' : 'All genuine opportunities matching your age, area, and nation are unlocked.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 text-xs shadow-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-semibold">{language === 'hi' ? 'नागरिक नाम' : 'Citizen Name'}</span>
              <span className="font-bold text-slate-900">{citizenName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-semibold">{language === 'hi' ? 'नागरिक आईडी' : 'Citizen ID'}</span>
              <span className="font-mono font-bold text-slate-800">{citizenId}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-semibold">{language === 'hi' ? 'लेनदेन संदर्भ (Txn ID)' : 'Transaction ID'}</span>
              <button
                onClick={() => copyTransactionId(successReceipt.transactionId)}
                className="font-mono font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{successReceipt.transactionId}</span>
                {copiedTxn ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-semibold">{language === 'hi' ? 'भुगतान राशि' : 'Amount Paid'}</span>
              <span className="font-extrabold text-slate-900 font-mono">₹{successReceipt.amount}.00 INR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">{language === 'hi' ? 'वैधता तिथि' : 'Validity Date'}</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{successReceipt.validUntil} (365 Days)</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{language === 'hi' ? 'अवसर पोर्टल में प्रवेश करें' : 'Explore My Opportunities'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // While Razorpay is opening, show an elegant spinner with clear, prominent Cancel and Close controls
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Click outside to cancel */}
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative bg-slate-900 text-white rounded-3xl p-6 sm:p-7 max-w-xs w-full text-center space-y-4 border border-emerald-500/30 shadow-2xl z-10">
        {/* Top-right close X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label={language === 'hi' ? 'बंद करें' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin mx-auto mt-1" />
        <div className="space-y-1">
          <h3 className="font-extrabold text-sm text-white">
            {language === 'hi' ? 'रेज़रपे सुरक्षित चेकआउट' : 'Razorpay Secure Checkout'}
          </h3>
          <p className="text-[11px] text-slate-300">
            {language === 'hi' ? 'भुगतान विंडो खुल रही है (₹19)...' : 'Opening payment window (₹19)...'}
          </p>
        </div>
        <p className="text-[10px] text-slate-400">Google Pay • PhonePe • Cards • Net Banking</p>
        
        {/* Prominent High-Contrast Cancel Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer border border-slate-700"
        >
          {language === 'hi' ? 'रद्द करें / वापस जाएं' : 'Cancel & Go Back'}
        </button>
      </div>
    </div>
  );
};

