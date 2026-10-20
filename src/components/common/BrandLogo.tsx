'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  textClassName?: string;
  linkToHome?: boolean;
  subtitle?: string;
}

export const BrandIconSvg: React.FC<{ sizePx?: number; className?: string }> = ({
  sizePx = 40,
  className = '',
}) => {
  return (
    <img
      src="/logo-shield-transparent.png"
      alt="Citzos Shield Emblem"
      width={sizePx}
      height={sizePx}
      className={`shrink-0 object-contain transition-transform duration-200 hover:scale-105 ${className}`}
      loading="eager"
    />
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  textClassName = '',
  linkToHome = false,
  subtitle,
}) => {
  const sizeMap = {
    xs: 28,
    sm: 34,
    md: 40,
    lg: 48,
    xl: 60,
  };

  const px = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrandIconSvg sizePx={px} />
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black text-slate-900 tracking-tight font-sans ${
                size === 'sm' || size === 'xs'
                  ? 'text-sm'
                  : size === 'lg' || size === 'xl'
                  ? 'text-xl sm:text-2xl'
                  : 'text-base sm:text-lg'
              } ${textClassName}`}
            >
              CIT<span className="text-emerald-600">ZOS</span>
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex cursor-pointer hover:opacity-95 transition-opacity" aria-label="Citzos Home">
        {content}
      </Link>
    );
  }

  return content;
};
