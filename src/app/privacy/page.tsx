'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Landmark, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white shadow-xl border border-emerald-500/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Google OAuth 2.0 & Data Privacy Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            गोपनीयता नीति (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            अंतिम नवीनीकरण: 27 सितम्बर 2026 • Citizen Life OS आपकी व्यक्तिगत जानकारी और डेटा सुरक्षा के प्रति 100% प्रतिबद्ध है।
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>परिचय एवं उद्देश्य (Introduction & Purpose)</span>
            </h2>
            <p>
              Citizen Life OS (&quot;हम&quot;, &quot;हमारा&quot;, या &quot;प्लेटफ़ॉर्म&quot;) भारतीय नागरिकों को केंद्र व राज्य सरकारों द्वारा जारी योजनाओं, छात्रवृत्तियों, प्रतियोगी परीक्षाओं और सार्वजनिक अवसरों की सटीक गणना व जानकारी प्रदान करने वाला स्वतंत्र नागरिक-सुलभ मंच है। यह नीति स्पष्ट करती है कि जब आप हमारी वेबसाइट का उपयोग करते हैं, तो हम आपकी जानकारी को कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>हम क्या जानकारी एकत्र करते हैं (Information We Collect)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Google साइन-इन डेटा (Google OAuth):</span>
                </h3>
                <p className="text-xs text-slate-600">
                  जब आप Google द्वारा लॉगिन करते हैं, तो हम केवल आपका नाम (Display Name), सत्यापित ईमेल पता (Email), और प्रोफ़ाइल चित्र (Avatar) प्राप्त करते हैं। हम कभी भी आपके Google खाते का पासवर्ड नहीं मांगते और न ही एकत्र करते हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>नागरिक पात्रता विवरण (Citizen Eligibility Data):</span>
                </h3>
                <p className="text-xs text-slate-600">
                  पंजीकरण के समय आपके द्वारा चुना गया कार्यक्षेत्र (Role/Occupation), आयु (Age), सामाजिक वर्ग (Category), और राज्य (State)—ताकि आपको केवल वही योजनाएं दिखाई जाएं जिसके लिए आप वास्तविक रूप से पात्र हैं।
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
              <strong>हम क्या एकत्र नहीं करते:</strong> हम किसी भी प्रकार का बायोमेट्रिक डेटा (फिंगरप्रिंट/आइरिस), असंशोधित 12-अंकीय आधार कार्ड संख्या, बैंक खाता पासवर्ड, यूपीआई पिन या गोपनीय वित्तीय विवरण कभी एकत्र या संचित नहीं करते।
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>जानकारी का उपयोग (How We Use Information)</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>नागरिक की उम्र, वर्ग और कार्यक्षेत्र के अनुसार प्रामाणिक योजनाओं की पात्रता फ़िल्टर करने हेतु।</li>
              <li>नागरिक का व्यक्तिगत &quot;नागरिक डिजिटल पहचान पत्र&quot; प्रदर्शित करने हेतु।</li>
              <li>उपयोगकर्ता द्वारा पसंदीदा (Starred/Favourites) चिह्नित किए गए फॉर्म्स को सुरक्षित रखने हेतु।</li>
              <li><strong>शून्य स्पैम नीति (Zero Spam / No Data Sale):</strong> हम उपयोगकर्ता का डेटा किसी भी विज्ञापनदाता, लोन प्रदाता, टेलीकॉलर या तीसरे पक्ष को न बेचते हैं और न ही साझा करते हैं।</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                4
              </span>
              <span>डेटा सुरक्षा एवं भंडारण (Data Security & Storage)</span>
            </h2>
            <p>
              हम आधुनिक सुरक्षा तकनीकों (HTTPS, SSL एनक्रिप्शन, और सुरक्षित टोकन प्रमाणीकरण) का उपयोग करते हैं। उपयोगकर्ता का स्थानीय सेशन ब्राउज़र के लोकल स्टोरेज एवं सुरक्षित क्लाउड डेटाबेस में उद्योग मानकों के अनुरूप संग्रहीत रहता है।
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                5
              </span>
              <span>उपयोगकर्ता अधिकार व डेटा निष्कासन (Data Deletion Rights)</span>
            </h2>
            <p>
              प्रत्येक उपयोगकर्ता को अपने खाते को लॉग आउट करने, स्थानीय डेटा साफ़ करने, या अपने प्रोफ़ाइल विवरण को सर्वर से स्थायी रूप से हटाने (Right to be Forgotten) का पूर्ण अधिकार है। यदि आप अपना डेटा हटाना चाहते हैं, तो आप पोर्टल में लॉगआउट बटन दबाकर या हमें संपर्क करके अनुरोध कर सकते हैं।
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                6
              </span>
              <span>संपर्क एवं शिकायत निवारण (Contact Us)</span>
            </h2>
            <p>
              इस गोपनीयता नीति या आपके डेटा के संबंध में किसी भी प्रश्न अथवा शिकायत हेतु आप मुख्य पोर्टल के माध्यम से या हमारे आधिकारिक हेल्पलाइन पृष्ठ (<Link href="/helpline" className="text-emerald-700 font-bold underline">24x7 Helplines</Link>) पर संपर्क कर सकते हैं।
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
