/**
 * Select — Atom
 * Dropdown select control adhering to global form & input design guidelines.
 */

import React from 'react'
import { SelectProps } from './Select.types'
import { Icon } from '@/components/atoms/Icon'

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, disabled, options, children, ...props }, ref) => {
    const baseStyle =
      'w-full h-10 pl-3.5 pr-10 py-2 text-sm bg-white text-[#0d212c] font-normal border rounded-xl transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#94a3b8] appearance-none cursor-pointer'

    const borderStyle = error
      ? 'border-[#d92d20] focus:border-[#d92d20] focus:ring-2 focus:ring-[#d92d20]/20'
      : 'border-[#d9e2ec] hover:border-[#cbd5e1] focus:border-[#36c0c9] focus:ring-2 focus:ring-[#36c0c9]/20'

    const combinedClassName = [baseStyle, borderStyle, className].filter(Boolean).join(' ')

    return (
      <div className="relative w-full">
        <select ref={ref} className={combinedClassName} disabled={disabled} {...props}>
          {options && options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {/* Subtle downward chevron icon */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
          <Icon name="chevron-down" size={16} />
        </div>
      </div>
    )
  }
)
Select.displayName = 'Select'
