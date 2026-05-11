'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/hooks/useStore'
import { useAuth } from '@/lib/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import { Bell, Search, Command, User, LogOut, ChevronDown, Sun, Moon, Monitor } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { NotificationCenter } from '@/components/widgets/NotificationCenter'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { sidebarCollapsed, toggleCommandPalette, showNotifications, toggleNotifications, setHasEntered } = useStore()
  const { user, signOut } = useAuth()
  const { theme, cycleTheme, setTheme, mounted } = useTheme()
  const [searchFocused, setSearchFocused] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setHasEntered(false)
    await signOut()
    window.location.reload()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin User'
  const displayEmail = user?.email || 'admin@quotverse.ai'
  const avatarUrl = user?.user_metadata?.avatar_url

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }
  const ThemeIcon = mounted ? themeIcons[theme] : Moon
  const themeLabels = { light: 'Light', dark: 'Dark', system: 'System' }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          'fixed top-0 right-0 h-16 z-20 glass-strong border-b border-white/[0.06] flex items-center justify-between px-6 transition-all duration-300',
          sidebarCollapsed ? 'left-20' : 'left-64'
        )}
      >
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border transition-all duration-300 flex-1',
              searchFocused ? 'border-primary/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-white/[0.06]'
            )}
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search accounts, models, sessions..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-muted-foreground flex-1"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-muted-foreground">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <div className="relative" ref={themeMenuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              title={`Theme: ${themeLabels[theme]}`}
            >
              <ThemeIcon className="w-5 h-5 text-muted-foreground" />
            </motion.button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-surface/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden"
                >
                  <div className="p-1.5">
                    <div className="px-3 py-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      Theme
                    </div>
                    {(['light', 'dark', 'system'] as const).map((mode) => {
                      const Icon = themeIcons[mode]
                      return (
                        <button
                          key={mode}
                          onClick={() => {
                            setTheme(mode)
                            setShowThemeMenu(false)
                          }}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors',
                            theme === mode
                              ? 'bg-primary/10 text-primary'
                              : 'text-white hover:bg-white/5'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {themeLabels[mode]}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleNotifications}
            className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
          </motion.button>

          {/* User */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 border-l border-white/[0.06] hover:bg-white/[0.02] rounded-xl py-1 pr-2 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">{displayName}</div>
                <div className="text-[10px] text-muted-foreground">{displayEmail}</div>
              </div>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </button>

            {/* User dropdown menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <div className="text-sm font-medium text-white">{displayName}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{displayEmail}</div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <NotificationCenter
        notifications={[]}
        isOpen={showNotifications}
        onClose={toggleNotifications}
      />
    </>
  )
}
