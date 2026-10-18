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
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="Citizen Life OS Brand Emblem"
    >
      <defs>
        {/* Background Squircle Gradient */}
        <linearGradient id="closBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#0B1329" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>

        {/* Outer Squircle Border Glow */}
        <linearGradient id="closBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
        </linearGradient>

        {/* Outer 'C' Ribbon Gradient (Emerald to Cyan) */}
        <linearGradient id="closRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Inner Arrow Left Facet (Emerald Bright) */}
        <linearGradient id="closArrowLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Inner Arrow Right Facet (Golden Saffron) */}
        <linearGradient id="closArrowRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Apex Star Gradient */}
        <linearGradient id="closGoldStar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* 1. Base Squircle Container */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="22"
        fill="url(#closBgGrad)"
        stroke="url(#closBorderGrad)"
        strokeWidth="2"
      />

      {/* 2. Stylized Tech 'C' Ribbon (Sovereign Citizen Crest) */}
      <path
        d="M 68 28 C 45 24, 25 35, 25 50 C 25 65, 45 76, 68 72"
        fill="none"
        stroke="url(#closRibbonGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Upward Growth Arrow Left Wing (Emerald) */}
      <path
        d="M 52 35 L 41 62 L 52 54 Z"
        fill="url(#closArrowLeft)"
      />

      {/* 4. Upward Growth Arrow Right Wing (Saffron Gold) */}
      <path
        d="M 52 35 L 63 62 L 52 54 Z"
        fill="url(#closArrowRight)"
      />

      {/* 5. Center Core Opportunity Light Node */}
      <circle
        cx="52"
        cy="22"
        r="4.5"
        fill="url(#closGoldStar)"
      />
    </svg>
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
              Citizen <span className="text-emerald-700">Life OS</span>
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
      <Link href="/" className="inline-flex cursor-pointer hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
