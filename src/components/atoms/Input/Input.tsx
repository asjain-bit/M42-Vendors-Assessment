/**
 * Input — Atom
 * Single line text input control adhering to global form & input design guidelines.
 */

import React from 'react'
import { InputProps } from './Input.types'

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, disabled, ...props }, ref) => {
    const baseStyle =
      'w-full h-10 px-3.5 py-2.5 text-sm bg-white text-[#0d212c] font-normal border rounded-xl transition-all placeholder:text-[#94a3b8] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#94a3b8]'

    const borderStyle = error
      ? 'border-[#d92d20] focus:border-[#d92d20] focus:ring-2 focus:ring-[#d92d20]/20'
      : 'border-[#d9e2ec] hover:border-[#cbd5e1] focus:border-[#36c0c9] focus:ring-2 focus:ring-[#36c0c9]/20'

    const combinedClassName = [baseStyle, borderStyle, className].filter(Boolean).join(' ')

    return <input ref={ref} className={combinedClassName} disabled={disabled} {...props} />
  }
)
Input.displayName = 'Input'
