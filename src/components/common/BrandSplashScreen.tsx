'use client';

import React from 'react';

interface BrandSplashScreenProps {
  message?: string;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white antialiased">
      <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative flex items-center justify-center">
          {/* Soft ambient emerald glow */}
          <div className="absolute w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl animate-pulse pointer-events-none" />
          
          <img
            src="/brand-logo-full.png"
            alt="Citizen Life OS"
            width={170}
            height={231}
            className="relative z-10 w-32 sm:w-40 h-auto object-contain drop-shadow-md transition-transform duration-700 animate-pulse"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Minimal high-tech progress pulse bar */}
        <div className="w-28 h-1 bg-slate-200/90 rounded-full overflow-hidden mt-1 shadow-2xs">
          <div className="w-full h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 rounded-full animate-pulse" />
        </div>

        {message && (
          <p className="text-[11px] font-medium text-slate-500 tracking-wide">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
