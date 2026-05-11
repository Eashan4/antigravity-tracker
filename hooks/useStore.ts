'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DashboardState, ThemeAccent } from '@/types'

interface Store extends DashboardState {
  toggleSidebar: () => void
  setActiveSection: (section: string) => void
  setThemeAccent: (accent: ThemeAccent) => void
  setAnimationIntensity: (intensity: 'low' | 'medium' | 'high') => void
  toggleNotifications: () => void
  toggleCommandPalette: () => void
  setHasEntered: (entered: boolean) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeSection: 'overview',
      themeAccent: 'violet',
      animationIntensity: 'high',
      showNotifications: false,
      commandPaletteOpen: false,
      hasEntered: false,

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setActiveSection: (section) => set({ activeSection: section }),
      setThemeAccent: (accent) => set({ themeAccent: accent }),
      setAnimationIntensity: (intensity) => set({ animationIntensity: intensity }),
      toggleNotifications: () => set((state) => ({ showNotifications: !state.showNotifications })),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setHasEntered: (entered) => set({ hasEntered: entered }),
    }),
    {
      name: 'dashboard-storage',
    }
  )
)
