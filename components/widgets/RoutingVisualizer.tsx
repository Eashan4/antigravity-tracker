'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { RoutingEvent } from '@/types'
import { ArrowRight, CheckCircle2, XCircle, RotateCcw, Loader2 } from 'lucide-react'

interface RoutingVisualizerProps {
  events: RoutingEvent[]
}

const statusConfig = {
  routing: { icon: Loader2, color: 'text-secondary', bg: 'bg-secondary/10', animate: 'spin' },
  completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', animate: '' },
  failed: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', animate: '' },
  fallback: { icon: RotateCcw, color: 'text-accent', bg: 'bg-accent/10', animate: '' },
}

export function RoutingVisualizer({ events }: RoutingVisualizerProps) {
  return (
    <GlassCard className="p-5 overflow-hidden" gradient>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">AI Routing Engine</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time prompt routing visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-success"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-success font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => {
            const config = statusConfig[event.status]
            const Icon = config.icon

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-primary/20 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                  <Icon className={`w-4 h-4 ${config.animate === 'spin' ? 'animate-spin' : ''}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white font-medium truncate">{event.source}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-primary font-medium truncate">{event.target}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span>{event.timestamp}</span>
                    <span className="capitalize" style={{ color: config.color.replace('text-', '') === 'secondary' ? '#06b6d4' : config.color.replace('text-', '') === 'success' ? '#10b981' : config.color.replace('text-', '') === 'danger' ? '#ef4444' : '#f59e0b' }}>
                      {event.status}
                    </span>
                    {event.latency > 0 && <span>{event.latency}ms</span>}
                    {event.tokensUsed > 0 && <span>{event.tokensUsed.toLocaleString()} tokens</span>}
                  </div>
                </div>

                {/* Animated path line */}
                <div className="hidden sm:block w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${event.status === 'completed' ? 'bg-success' : event.status === 'failed' ? 'bg-danger' : event.status === 'fallback' ? 'bg-accent' : 'bg-secondary'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: event.status === 'routing' ? ['0%', '100%', '0%'] : '100%' }}
                    transition={event.status === 'routing' ? { duration: 1.5, repeat: Infinity, ease: 'linear' } : { duration: 0.8 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}
