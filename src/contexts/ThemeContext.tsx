'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        const saved = window.localStorage.getItem('theme') as Theme | null
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          setThemeState(saved)
        }
      }
    } catch {
      // safe fallback
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const applyTheme = () => {
      let resolved: 'light' | 'dark' = 'light'
      if (theme === 'system') {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
          resolved = 'light'
        }
      } else {
        resolved = theme
      }
      setResolvedTheme(resolved)
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-theme', resolved)
      }
    }

    applyTheme()

    if (theme === 'system' && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => applyTheme()
      if (media.addEventListener) {
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
      }
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem('theme', newTheme)
      }
    } catch {
      // safe fallback
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
