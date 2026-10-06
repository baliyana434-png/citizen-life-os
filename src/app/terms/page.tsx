'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Landmark, ShieldCheck, AlertCircle } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>User Agreement & Service Terms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            नियम एवं शर्तें (Terms & Conditions)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            अंतिम नवीनीकरण: 27 सितम्बर 2026 • कृपया प्लेटफ़ॉर्म का उपयोग करने से पहले इन शर्तों को ध्यानपूर्वक पढ़ें।
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
              <span>नियमों की स्वीकृति (Acceptance of Terms)</span>
            </h2>
            <p>
              Citizen Life OS का उपयोग करके या इस पर पंजीकरण करके आप इन नियमों व शर्तों से पूर्णतः सहमत होते हैं। यदि आप इनमें से किसी भी शर्त से असहमत हैं, तो कृपया प्लेटफ़ॉर्म का उपयोग न करें।
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>सेवा की प्रकृति (Nature of Service)</span>
            </h2>
            <p>
              हमारा प्लेटफ़ॉर्म एक नागरिक सुविधा मंच (Civic-Tech Facilitator) है, जो भारत के नागरिकों को केंद्र व राज्य सरकारों के विभिन्न मंत्रालयों, आधिकारिक गजटों और मान्यता प्राप्त भर्ती बोर्डों द्वारा जारी सार्वजनिक अधिसूचनाओं को संगठित रूप में दिखाता है।
            </p>
            <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              हम किसी भी सरकारी सेवा, परीक्षा फॉर्म या योजना के लिए नागरिकों से कोई अनधिकृत दलाली या अवैध शुल्क नहीं लेते। सभी आधिकारिक आवेदन सीधे संबंधित सरकारी पोर्टल पर होते हैं।
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>सत्य विवरण एवं आचरण (User Obligations)</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>उपयोगकर्ता पंजीकरण करते समय सत्य एवं प्रामाणिक विवरण (जैसे वास्तविक आयु, वर्ग, राज्य) दर्ज करने के लिए उत्तरदायी है।</li>
              <li>प्लेटफ़ॉर्म पर किसी भी प्रकार के बॉट, स्वचालित डेटा स्क्रैपर, या दुर्भावनापूर्ण कोड चलाने का प्रयास पूर्णतः प्रतिबंधित है।</li>
              <li>किसी अन्य व्यक्ति के पहचान पत्र या Google खाते का दुरुपयोग करना कानूनन दंडनीय है।</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                4
              </span>
              <span>दायित्व की सीमा (Limitation of Liability)</span>
            </h2>
            <p>
              यद्यपि हम सभी अवसरों, अंतिम तिथियों और पात्रता मानदंडों को आधिकारिक राजपत्रों व सरकारी पोर्टलों से सत्यापित करके ही प्रकाशित करते हैं, फिर भी किसी भी सरकारी विभाग द्वारा अंतिम तिथि में किए गए तात्कालिक फेरबदल, परीक्षा रद्द होने, या सरकारी सर्वर डाउन होने की स्थिति में Citizen Life OS उत्तरदायी नहीं होगा। नागरिकों को आधिकारिक पोर्टल पर भी अंतिम पुष्टि करने की सलाह दी जाती है।
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                5
              </span>
              <span>बौद्धिक संपदा एवं ट्रेडमार्क (Intellectual Property)</span>
            </h2>
            <p>
              Citizen Life OS का इंटरफेस, एल्गोरिदम और डिज़ाइन हमारी बौद्धिक संपदा है। सभी संबंधित सरकारी नाम, प्रतीक, राजपत्र संदर्भ और आधिकारिक पोर्टल लोगो उनके संबंधित मंत्रालयों एवं सरकारी विभागों की संपत्ति हैं, जिनका उपयोग केवल नागरिकों के मार्गदर्शन व सूचना संदर्भ हेतु किया गया है।
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
