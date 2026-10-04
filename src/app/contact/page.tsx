'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
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
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Citizen Helpdesk & Grievance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            संपर्क एवं सहायता केंद्र (Contact Us)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            नागरिक सहायता, तकनीकी समस्या या भुगतान संबंधी प्रश्नों हेतु हमारी समर्पित सहायता टीम से संपर्क करें।
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">ईमेल सहायता (Email Support)</h3>
            <p className="text-xs text-slate-500">
              सामान्य पूछताछ, सदस्यता व तकनीकी सहायता हेतु:
            </p>
            <a
              href="mailto:support@citizenlifeos.in"
              className="inline-block font-mono font-bold text-sm text-emerald-700 hover:text-emerald-800"
            >
              support@citizenlifeos.in
            </a>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">हेल्पलाइन (Helpline Desk)</h3>
            <p className="text-xs text-slate-500">
              कार्य दिवसों में प्रत्यक्ष सहायता उपलब्ध:
            </p>
            <span className="inline-block font-mono font-bold text-sm text-slate-900">
              +91 11 4050 8900
            </span>
          </div>
        </div>

        {/* Operating Hours & Address */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">कार्यकारी समय (Operating Hours)</h4>
              <p className="text-slate-600 mt-0.5">
                सोमवार से शनिवार: प्रातः 9:30 बजे से सायं 6:30 बजे तक (IST)<br />
                रविवार एवं राष्ट्रीय अवकाश के दिन ईमेल सपोर्ट सक्रिय रहता है।
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">पंजीकृत कार्यालय (Registered Office)</h4>
              <p className="text-slate-600 mt-0.5">
                Citizen Life OS Civic-Tech Platform<br />
                New Delhi, India - 110001
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">शिकायत निवारण अधिकारी (Grievance Redressal)</h4>
              <p className="text-slate-600 mt-0.5">
                सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश) नियम के अनुसार शिकायत अधिकारी: grievance@citizenlifeos.in पर 24 घंटे के भीतर पावती दी जाती है।
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
