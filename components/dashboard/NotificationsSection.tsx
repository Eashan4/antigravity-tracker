'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { getNotifications, Notification } from '@/lib/db'
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, Trash2, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

const typeConfig = {
  info: { icon: Info, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', label: 'Info' },
  warning: { icon: AlertTriangle, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', label: 'Warning' },
  error: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', label: 'Error' },
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', label: 'Success' },
}

export function NotificationsSection() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotifications() {
      const data = await getNotifications()
      setNotifications(data)
      setLoading(false)
    }
    loadNotifications()
  }, [])

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-4 animate-pulse">
              <div className="h-16 bg-white/5 rounded-lg" />
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">System alerts and updates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground text-xs font-medium hover:text-white hover:bg-white/10 transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground text-xs font-medium hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {['all', 'unread', 'warning', 'error', 'success', 'info'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              filter === f
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
          </GlassCard>
        ) : (
          filtered.map((notif, index) => {
            const config = typeConfig[notif.type]
            const Icon = config.icon

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border ${config.border} ${config.bg} ${!notif.read ? 'bg-opacity-30' : ''} hover:bg-white/5 transition-colors`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                          {!notif.read && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notif.timestamp}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
