'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { useStore } from '@/hooks/useStore'
import { useAuth } from '@/lib/AuthContext'
import { ThemeAccent } from '@/types'
import {
  Palette,
  Zap,
  Bell,
  Shield,
  Globe,
  Database,
  Server,
  Moon,
  Sun,
  Monitor,
  Check,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'

const accentColors: { value: ThemeAccent; label: string; color: string }[] = [
  { value: 'violet', label: 'Violet', color: '#8b5cf6' },
  { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
]

export function SettingsSection() {
  const { themeAccent, setThemeAccent, animationIntensity, setAnimationIntensity, setHasEntered } = useStore()
  const { user, signOut } = useAuth()
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
  const [notifications, setNotifications] = useState({
    quotaAlerts: true,
    routingEvents: true,
    healthAlerts: true,
    weeklyReports: false,
  })

  const handleSignOut = async () => {
    setHasEntered(false)
    await signOut()
    window.location.reload()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin User'
  const displayEmail = user?.email || 'admin@quotverse.ai'
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure your dashboard preferences</p>
      </motion.div>

      {/* Account Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <GlassCard className="p-5" gradient>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Account</h3>
              <p className="text-xs text-muted-foreground">Your profile and authentication</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-white">{displayName}</div>
                <div className="text-[11px] text-muted-foreground">{displayEmail}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-success">Authenticated via {user?.app_metadata?.provider === 'google' ? 'Google' : 'Email'}</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium hover:bg-danger/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-5" gradient>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Appearance</h3>
              <p className="text-xs text-muted-foreground">Customize the visual experience</p>
            </div>
          </div>

          {/* Theme */}
          <div className="mb-6">
            <label className="text-sm font-medium text-white mb-3 block">Theme</label>
            <div className="flex gap-2">
              {(['dark', 'light', 'system'] as const).map((t) => {
                const icons = { dark: Moon, light: Sun, system: Monitor }
                const Icon = icons[t]
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                      theme === t
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent Color */}
          <div className="mb-6">
            <label className="text-sm font-medium text-white mb-3 block">Accent Color</label>
            <div className="flex gap-3">
              {accentColors.map((accent) => (
                <button
                  key={accent.value}
                  onClick={() => setThemeAccent(accent.value)}
                  className={`relative w-10 h-10 rounded-xl transition-all ${
                    themeAccent === accent.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: accent.color }}
                  title={accent.label}
                >
                  {themeAccent === accent.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Intensity */}
          <div>
            <label className="text-sm font-medium text-white mb-3 block">Animation Intensity</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setAnimationIntensity(level)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                    animationIntensity === level
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  {level}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-5" gradient>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Bell className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <p className="text-xs text-muted-foreground">Configure alert preferences</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => {
              const labels: Record<string, string> = {
                quotaAlerts: 'Quota Alerts',
                routingEvents: 'Routing Events',
                healthAlerts: 'Health Alerts',
                weeklyReports: 'Weekly Reports',
              }
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-sm text-white">{labels[key]}</span>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [key]: !value }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      value ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                      animate={{ left: value ? '22px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* API & Backend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-5" gradient>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-accent/10">
              <Server className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">API & Backend</h3>
              <p className="text-xs text-muted-foreground">Backend connection settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white">Supabase Connection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-success">Connected</span>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground">wss://db.quotverse.supabase.co</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-white">Railway Backend</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-success">Operational</span>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground">https://api.quotverse.railway.app</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm text-white">Google OAuth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-success">Active</span>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground">6 accounts authorized</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
