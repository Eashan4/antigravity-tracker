'use client'

import { useState, useEffect, useCallback } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme-preference'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const isDark = mode === 'system' ? getSystemTheme() === 'dark' : mode === 'dark'

  if (isDark) {
    root.classList.remove('light')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.add('light')
    root.setAttribute('data-theme', 'light')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>('system')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    const initial = stored || 'system'
    setThemeState(initial)
    applyTheme(initial)
    setMounted(true)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const current = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
      if (current === 'system' || !current) {
        applyTheme('system')
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode)
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme(mode)
  }, [])

  const cycleTheme = useCallback(() => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % modes.length
    setTheme(modes[nextIndex])
  }, [theme, setTheme])

  const isDark = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')

  return {
    theme,
    setTheme,
    cycleTheme,
    isDark,
    mounted,
  }
}

// Script to inject in head for preventing flash - call this in layout.tsx
export function getThemeScript() {
  return `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=s||'system';var d=t==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches:t==='dark';if(!d){document.documentElement.classList.add('light');document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`
}

