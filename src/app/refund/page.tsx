'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShieldCheck, Mail, Clock } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मुख्य पृष्ठ (Back to Home)</span>
          </Link>
          <span className="font-extrabold text-sm text-slate-900">Citizen Life OS</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Page Hero */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white shadow-xl border border-emerald-500/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Official Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            रिफंड एवं रद्दीकरण नीति (Refund & Cancellation Policy)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            अंतिम नवीनीकरण: 2026 • Citizen Life OS 1-Year National Citizen Access Pass
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
              <span>डिजिटल सेवा एवं सदस्यता (Digital Service Delivery)</span>
            </h2>
            <p>
              Citizen Life OS पर 1-वर्षीय नागरिक सदस्यता (1-Year National Citizen Access Pass ₹19) एक डिजिटल सेवा है। सफल भुगतान के तुरंत बाद सदस्यता स्वतः आपके खाते में सक्रिय हो जाती है। इसके लिए किसी भौतिक वस्तु (physical goods) की शिपिंग या डिलीवरी की आवश्यकता नहीं होती है।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
              <span>रिफंड नीति (Refund Policy)</span>
            </h2>
            <p>
              यदि किसी तकनीकी त्रुटि (technical failure) के कारण आपके बैंक खाते से राशि कट गई हो किंतु सदस्यता सक्रिय न हुई हो, अथवा दोहरे भुगतान (duplicate payment) की स्थिति में, पूरा भुगतान (100% Amount) बिना किसी कटौती के आपके मूल बैंक खाते में 5 से 7 कार्य दिवसों के भीतर स्वतः वापस कर दिया जाएगा।
            </p>
            <p>
              यदि नागरिक किसी भी कारणवश सदस्यता से असंतुष्ट हैं, तो वे खरीद के 7 दिनों के भीतर हमारे सहायता केंद्र (support@citizenlifeos.in) पर अपने लेनदेन विवरण (Transaction ID / Order ID) के साथ संपर्क करके रिफंड का अनुरोध कर सकते हैं।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
              <span>रद्दीकरण प्रक्रिया (Cancellation Process)</span>
            </h2>
            <p>
              हमारी सदस्यता में कोई स्वतः-नवीनीकरण (auto-debit / recurring charge) नहीं होता है। 365 दिनों की अवधि पूर्ण होने के पश्चात सदस्यता स्वतः समाप्त हो जाती है। किसी भी समय अपनी सदस्यता रद्द करवाने हेतु आप सपोर्ट टीम को ईमेल भेज सकते हैं।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
              <span>रिफंड सहायता केंद्र (Contact Support)</span>
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>ईमेल: support@citizenlifeos.in</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>कार्य समय: सोमवार से शनिवार, 9:00 AM - 6:00 PM IST</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
