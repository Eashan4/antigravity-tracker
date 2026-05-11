'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Notification } from '@/types'
import { Bell, X, AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface NotificationCenterProps {
  notifications: Notification[]
  isOpen: boolean
  onClose: () => void
}

const typeConfig = {
  info: { icon: Info, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
  warning: { icon: AlertTriangle, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
  error: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
}

export function NotificationCenter({ notifications, isOpen, onClose }: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-4 top-20 w-96 max-h-[80vh] glass rounded-2xl z-50 overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh] p-2 space-y-1">
              <AnimatePresence>
                {notifications.map((notif, index) => {
                  const config = typeConfig[notif.type]
                  const Icon = config.icon

                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-xl border ${config.border} ${config.bg} ${!notif.read ? 'bg-opacity-30' : ''} hover:bg-white/5 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${config.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-medium text-white">{notif.title}</h4>
                            {!notif.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className="text-[10px] text-muted-foreground/60 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
