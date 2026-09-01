/**
 * SiteHeader — Organism
 * Top page header displaying clean page title and subtitle.
 */

'use client'

import React from 'react'

export interface SiteHeaderProps {
  title?: string
  subtitle?: string
  className?: string
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  title = 'Vendor assessment',
  subtitle = 'Overview of active vendor due diligence, risk scores, and evidence submissions.',
  className = '',
}) => {
  return (
    <header
      className={[
        'w-full bg-white border-b border-[#e2e8f0] px-6 lg:px-10 py-5 flex items-center justify-between sticky top-0 z-40 text-[#0d212c] shadow-xs',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col">
        <h1 className="font-extrabold text-xl lg:text-2xl tracking-tight text-[#0d212c]">
          {title}
        </h1>
        <p className="text-xs text-[#64748b] mt-0.5 leading-normal">
          {subtitle}
        </p>
      </div>
    </header>
  )
}
