'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/hooks/useStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Cpu,
  BarChart3,
  GitBranch,
  History,
  Shield,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'accounts', label: 'Accounts', icon: Users },
  { id: 'models', label: 'Models', icon: Cpu },
  { id: 'analytics', label: 'Quota Analytics', icon: BarChart3 },
  { id: 'routing', label: 'AI Routing', icon: GitBranch },
  { id: 'history', label: 'Usage History', icon: History },
  { id: 'sessions', label: 'Sessions', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarCollapsed, activeSection, toggleSidebar, setActiveSection } = useStore()

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'fixed left-0 top-0 h-screen z-30 glass-strong border-r border-white/[0.06] flex flex-col',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold text-white whitespace-nowrap">QuotaVerse</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Glow effect */}
              {isActive && !sidebarCollapsed && (
                <div className="absolute inset-0 rounded-xl bg-primary/5 blur-xl -z-10" />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-white"
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  )
}
