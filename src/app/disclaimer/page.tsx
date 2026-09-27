'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Landmark, ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function DisclaimerPage() {
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">Citizen Life OS</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Page Hero */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 text-white shadow-xl border border-amber-500/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Government Compliance Advisory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            अस्वीकरण (Disclaimer)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            नागरिकों की पारदर्शिता और भारतीय आईटी अधिनियम के अंतर्गत अनिवार्य कानूनी अस्वीकरण।
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
          
          {/* Bold Core Declaration */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300/80 space-y-2">
            <h2 className="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>महत्वपूर्ण घोषणा: गैर-सरकारी स्वतंत्र मंच (Non-Government Entity)</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
              <strong>Citizen Life OS</strong> किसी भी सरकारी संस्था, मंत्रालय, विभाग या सार्वजनिक उपक्रम (PSU) का आधिकारिक अंग या प्रतिनिधि <strong>नहीं</strong> है। यह एक स्वतंत्र नागरिक-तकनीकी (Civic-Tech) सूचना मंच है, जिसका एकमात्र उद्देश्य आम नागरिकों, विद्यार्थियों, किसानों व युवाओं तक सार्वजनिक सरकारी अधिसूचनाओं को सरल और सीधे रूप में पहुंचाना है।
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>सूचना के प्रामाणिक स्रोत (Authentic Sources of Information)</span>
            </h3>
            <p>
              इस प्लेटफ़ॉर्म पर प्रदर्शित सभी योजनाओं, नौकरियों, परीक्षा तिथियों और लाभों का विवरण भारत सरकार एवं राज्य सरकारों के सार्वजनिक रूप से उपलब्ध आधिकारिक स्रोतों से संकलित किया जाता है:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-medium text-xs">
              <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>भारत का राजपत्र (Gazette of India - egazette.gov.in)</span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>पत्र सूचना कार्यालय (Press Information Bureau - pib.gov.in)</span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>राष्ट्रीय पोर्टल (india.gov.in व myScheme पोर्टल)</span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>आधिकारिक राज्य ई-डिस्ट्रिक्ट व मंत्रालय पोर्टल्स (.gov.in / .nic.in)</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>आवेदन प्रक्रिया एवं दलालों से बचाव (Application Advisory)</span>
            </h3>
            <p>
              हम कभी भी किसी योजना के आवेदन पत्र भरने, नौकरी दिलाने या सब्सिडी स्वीकृत कराने के एवज में कोई शुल्क नहीं मांगते। Citizen Life OS आपको केवल सही आधिकारिक वेबसाइट का सीधा लिंक (<ExternalLink className="w-3.5 h-3.5 inline text-emerald-700" />) प्रदान करता है ताकि आप बिना किसी बिचौलिए या साइबर कैफे दलाली के सीधे आवेदन कर सकें।
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>स्वीकृति व लाभ का अंतिम अधिकार (Final Decision of Benefits)</span>
            </h3>
            <p>
              किसी भी सरकारी योजना, छात्रवृत्ति या परीक्षा में चयन, स्वीकृति या वित्तीय लाभ प्रदान करने का संपूर्ण एवं अंतिम अधिकार केवल और केवल संबंधित सरकारी विभाग, चयन बोर्ड या मंत्रालय के पास सुरक्षित रहता है। इस प्लेटफ़ॉर्म द्वारा की गई गणना केवल आपकी दी गई जानकारी पर आधारित प्राथमिक मार्गदर्शन है।
            </p>
          </section>

          {/* Official Helplines Link */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-emerald-950">किसी भी आपातकालीन या सरकारी सहायता के लिए:</p>
              <p className="text-emerald-800 mt-0.5">हमारे 24x7 सत्यापित राष्ट्रीय हेल्पलाइन डायरेक्टरी का उपयोग करें।</p>
            </div>
            <Link
              href="/helpline"
              className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shrink-0 transition-colors shadow-2xs"
            >
              हेल्पलाइन देखें ↗
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
