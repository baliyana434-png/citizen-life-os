'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { pushNotificationService } from '@/services/pushNotification';
import { useTranslation } from '@/i18n/useTranslation';

interface PushNotificationBannerProps {
  onNotificationEnabled?: () => void;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  onNotificationEnabled,
}) => {
  const { language } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Only check in browser
    if (typeof window === 'undefined') return;

    // Check if browser supports notifications
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return;
    }

    // If already granted, don't show prompt banner
    if (Notification.permission === 'granted') {
      return;
    }

    // If dismissed recently, don't nag user
    const dismissedAt = localStorage.getItem('push_banner_dismissed_at');
    if (dismissedAt) {
      const hoursPassed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (hoursPassed < 48) {
        return;
      }
    }

    // Show banner after 3 seconds of browsing
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnablePush = async () => {
    setIsLoading(true);
    try {
      const result = await pushNotificationService.requestPermission();
      if (result.success) {
        setIsSuccess(true);
        // Fire immediate real test notification on user's device
        await pushNotificationService.sendLocalTestNotification(language === 'hi' ? 'hi' : 'en');
        if (onNotificationEnabled) {
          onNotificationEnabled();
        }
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setIsVisible(false);
      }
    } catch (e) {
      console.warn('Push registration error:', e);
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_banner_dismissed_at', Date.now().toString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Push Notification Alert"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-emerald-500/40 relative overflow-hidden">
        {/* Glow ambient light */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-lg shadow-emerald-500/20">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
            ) : (
              <BellRing className="w-5 h-5 text-slate-950 animate-bounce" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            {isSuccess ? (
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-emerald-400">
                  {language === 'hi' ? 'सूचनाएं सक्रिय हो गईं!' : 'Notifications Enabled!'}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {language === 'hi' 
                    ? 'आपके फोन पर एक टेस्ट अलर्ट भेजा गया है। अब सभी नए अपडेट आपको सीधे मिलेंगे।' 
                    : 'A test alert was sent. You will now receive verified alerts directly on your device.'}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white tracking-tight">
                    {language === 'hi' 
                      ? 'Lock Screen पर सीधे सरकारी अलर्ट पाएं' 
                      : 'Get Live Alerts on Lock Screen'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {language === 'hi' 
                    ? 'नई सरकारी योजनाएं, एडमिट कार्ड व भर्ती निकलते ही आपके फोन पर तुरंत नोटिफिकेशन आएगा।' 
                    : 'Get instant notifications for new government schemes, job updates, and deadlines.'}
                </p>

                <div className="flex items-center gap-2 mt-3 pt-1">
                  <button
                    type="button"
                    onClick={handleEnablePush}
                    disabled={isLoading}
                    className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>
                      {isLoading 
                        ? (language === 'hi' ? 'सक्रिय हो रहा है...' : 'Enabling...')
                        : (language === 'hi' ? 'सूचनाएं चालू करें' : 'Enable Alerts')}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="py-2 px-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer"
                  >
                    {language === 'hi' ? 'बाद में' : 'Later'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
