'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, ArrowRight, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface GoogleAccount {
  name: string;
  email: string;
  photoURL?: string;
}

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccount) => void;
  isLoading?: boolean;
}

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading = false,
}) => {
  const { language } = useTranslation();
  const [accounts, setAccounts] = useState<GoogleAccount[]>([]);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  // Load remembered Google accounts on open
  useEffect(() => {
    if (!isOpen) return;

    const list: GoogleAccount[] = [];
    const seenEmails = new Set<string>();

    try {
      // 1. Check persistent google accounts list
      const savedList = localStorage.getItem('citizen_google_accounts');
      if (savedList) {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (item && item.email && item.name && !seenEmails.has(item.email.toLowerCase())) {
              seenEmails.add(item.email.toLowerCase());
              list.push({
                name: item.name,
                email: item.email.toLowerCase(),
                photoURL: item.photoURL,
              });
            }
          });
        }
      }

      // 2. Check active citizen profile
      const savedProfile = localStorage.getItem('citizen_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.email && parsed.fullName && parsed.email.includes('@') && !seenEmails.has(parsed.email.toLowerCase())) {
          seenEmails.add(parsed.email.toLowerCase());
          list.push({
            name: parsed.fullName,
            email: parsed.email.toLowerCase(),
            photoURL: parsed.photoURL,
          });
        }
      }

      // 3. Check remember_email
      const rememberedEmail = localStorage.getItem('citizen_remember_email');
      if (rememberedEmail && rememberedEmail.includes('@') && !seenEmails.has(rememberedEmail.toLowerCase())) {
        seenEmails.add(rememberedEmail.toLowerCase());
        list.push({
          name: rememberedEmail.split('@')[0].replace(/[._-]/g, ' '),
          email: rememberedEmail.toLowerCase(),
        });
      }
    } catch (e) {}

    setAccounts(list);
    // If no previous accounts, show the input form directly
    setShowCustomInput(list.length === 0);
    setInputError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const saveAndSelectAccount = (account: GoogleAccount) => {
    try {
      const existing = accounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
      const updated = [account, ...existing].slice(0, 5);
      localStorage.setItem('citizen_google_accounts', JSON.stringify(updated));
    } catch (e) {}

    onSelectAccount(account);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const emailTrimmed = customEmail.trim().toLowerCase();
    const nameTrimmed = customName.trim();

    if (!emailTrimmed || !emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setInputError(language === 'hi' ? 'कृपया एक वैध गूगल ईमेल आईडी दर्ज करें।' : 'Please enter a valid Google email address.');
      return;
    }
    if (!nameTrimmed || nameTrimmed.length < 2) {
      setInputError(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    saveAndSelectAccount({
      name: nameTrimmed,
      email: emailTrimmed,
      photoURL: undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto">
        {/* Google Header Branding */}
        <div className="p-6 text-center border-b border-slate-100 relative bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Authentic Google 'G' Logo */}
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900">
            {language === 'hi' ? 'गूगल खाते से जारी रखें' : 'Sign in with Google'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi' ? 'नागरिक पोर्टल में प्रवेश हेतु खाता चुनें' : 'Choose an account to continue to Citizen Life OS'}
          </p>
        </div>

        {/* Account Selector List */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* List of Known / Remembered Google Accounts */}
          {!showCustomInput && accounts.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {accounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => saveAndSelectAccount(acc)}
                  disabled={isLoading}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left flex items-center justify-between transition-all group cursor-pointer disabled:opacity-60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 overflow-hidden">
                      {acc.photoURL ? (
                        <img src={acc.photoURL} alt={acc.name} className="w-full h-full object-cover" />
                      ) : (
                        acc.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-950 flex items-center gap-1.5 truncate">
                        <span className="truncate">{acc.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{acc.email}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {/* Option: Use another Google account */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full p-3.5 rounded-2xl border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-slate-50 text-left flex items-center gap-3 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {language === 'hi' ? 'अन्य गूगल खाते का उपयोग करें' : 'Use another Google account'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'अपना आधिकारिक गूगल ईमेल दर्ज करें' : 'Enter your official Google email address'}
                </div>
              </div>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3 pt-1">
              {inputError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inputError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? 'उदा. अभय कुमार' : 'e.g. Abhay Kumar'}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'गूगल ईमेल पता' : 'Google Email Address'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none font-mono font-semibold text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                {accounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'खाता सूची देखें' : 'View Account List'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'जारी रखें' : 'Continue'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'गूगल सुरक्षित प्रमाणीकरण' : 'Google Secure Auth'}</span>
            </span>
            <span>{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy & Terms'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
