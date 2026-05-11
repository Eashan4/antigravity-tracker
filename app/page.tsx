'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/hooks/useStore'
import { useAuth } from '@/lib/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { OverviewSection } from '@/components/dashboard/OverviewSection'
import { AccountsSection } from '@/components/dashboard/AccountsSection'
import { ModelsSection } from '@/components/dashboard/ModelsSection'
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection'
import { RoutingSection } from '@/components/dashboard/RoutingSection'
import { HistorySection } from '@/components/dashboard/HistorySection'
import { SessionsSection } from '@/components/dashboard/SessionsSection'
import { NotificationsSection } from '@/components/dashboard/NotificationsSection'
import { SettingsSection } from '@/components/dashboard/SettingsSection'
import { ParticleField } from '@/components/3d/ParticleField'
import { AIGlobe } from '@/components/3d/AIGlobe'
import { AuthPage } from '@/components/auth/AuthPage'
import { useState, useEffect, useCallback } from 'react'
import { Zap, Loader2 } from 'lucide-react'

const sections: Record<string, React.ComponentType> = {
  overview: OverviewSection,
  accounts: AccountsSection,
  models: ModelsSection,
  analytics: AnalyticsSection,
  routing: RoutingSection,
  history: HistorySection,
  sessions: SessionsSection,
  notifications: NotificationsSection,
  settings: SettingsSection,
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.4)]">
          <Zap className="w-12 h-12 text-white" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-white mt-8"
      >
        QuotaVerse
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground mt-2"
      >
        Initializing AI Command Center...
      </motion.p>

      <div className="w-64 h-1 rounded-full bg-white/5 mt-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="text-xs text-muted-foreground mt-2">{Math.round(Math.min(progress, 100))}%</span>
    </motion.div>
  )
}

function HeroSection({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-40 bg-background overflow-hidden"
    >
      <ParticleField />

      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 gap-12">
        {/* Left content */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI Infrastructure OS v2.0
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Control Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              AI Account
            </span>{' '}
            From One Command Center
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto lg:mx-0"
          >
            Monitor quotas, route prompts intelligently, and manage all your Gemini and Antigravity accounts in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-center lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-shadow"
            >
              Enter Dashboard
            </motion.button>
            <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors">
              View Documentation
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-8 mt-12 justify-center lg:justify-start"
          >
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '50K+', label: 'Requests/day' },
              { value: '6', label: 'AI Providers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right - 3D Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex-1 w-full max-w-lg h-[400px] lg:h-[500px]"
        >
          <AIGlobe />
        </motion.div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </motion.div>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [entered, setEntered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { sidebarCollapsed, activeSection, hasEntered, setHasEntered } = useStore()
  const { user, loading: authLoading } = useAuth()

  const ActiveSection = sections[activeSection] || OverviewSection

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || authLoading) return

    // If user is authenticated AND has previously entered → go directly to dashboard
    if (user && hasEntered) {
      setLoading(false)
      setShowHero(false)
      setShowAuth(false)
      setEntered(true)
    }
    // If user is authenticated but hasn't entered yet → show hero
    else if (user && !hasEntered) {
      setLoading(false)
      setShowHero(true)
    }
    // If not authenticated → show loading then hero
    else {
      const timer = setTimeout(() => {
        setLoading(false)
        setShowHero(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isMounted, authLoading, user, hasEntered])

  const handleEnterDashboard = useCallback(() => {
    // If not authenticated, show auth page
    if (!user) {
      setShowHero(false)
      setShowAuth(true)
    } else {
      // User is authenticated, go to dashboard
      setShowHero(false)
      setHasEntered(true)
      setTimeout(() => setEntered(true), 800)
    }
  }, [user, setHasEntered])

  const handleAuthSuccess = useCallback(() => {
    setShowAuth(false)
    setHasEntered(true)
    setTimeout(() => setEntered(true), 500)
  }, [setHasEntered])

  if (!isMounted || authLoading) {
    return <main className="min-h-screen bg-background text-foreground overflow-hidden" />
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => {}} />}
      </AnimatePresence>

      <AnimatePresence>
        {showHero && <HeroSection onEnter={handleEnterDashboard} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && <AuthPage onAuthSuccess={handleAuthSuccess} />}
      </AnimatePresence>

      <AnimatePresence>
        {entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex"
          >
            <Sidebar />
            <TopBar />

            <div
              className={`flex-1 min-h-screen pt-16 transition-all duration-300 ${
                sidebarCollapsed ? 'ml-20' : 'ml-64'
              }`}
            >
              <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActiveSection />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
