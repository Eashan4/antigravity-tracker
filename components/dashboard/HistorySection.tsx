'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { getRoutingEvents, RoutingEvent } from '@/lib/db'
import { History, Filter, Download, ArrowUpRight, ArrowDownLeft, Clock, Hash, Database } from 'lucide-react'
import { useState, useEffect } from 'react'

export function HistorySection() {
  const [filter, setFilter] = useState('all')
  const [events, setEvents] = useState<RoutingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const data = await getRoutingEvents(100)
      setEvents(data)
      setLoading(false)
    }
    loadEvents()
  }, [])

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true
    return event.status === filter
  })

  const statusColors: Record<string, string> = {
    completed: 'text-success',
    failed: 'text-danger',
    fallback: 'text-accent',
    routing: 'text-secondary',
  }

  const statusBg: Record<string, string> = {
    completed: 'bg-success/10 border-success/20',
    failed: 'bg-danger/10 border-danger/20',
    fallback: 'bg-accent/10 border-accent/20',
    routing: 'bg-secondary/10 border-secondary/20',
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-8 animate-pulse">
          <div className="h-64 bg-white/5 rounded-lg" />
        </GlassCard>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-12 text-center">
          <History className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No Routing History</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your prompt routing history will appear here once you start using AI models.
          </p>
        </GlassCard>
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
          <h2 className="text-2xl font-bold text-white">Usage History</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete request and routing log</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: 5243, icon: Hash, color: 'primary' },
          { label: 'Successful', value: 4892, icon: ArrowUpRight, color: 'success' },
          { label: 'Failed', value: 89, icon: ArrowDownLeft, color: 'danger' },
          { label: 'Fallbacks', value: 262, icon: History, color: 'accent' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4" hover>
                <div className={`p-2 rounded-lg bg-${stat.color}/10 w-fit mb-3`}>
                  <Icon className={`w-4 h-4 text-${stat.color}`} />
                </div>
                <div className="text-xl font-bold text-white">{stat.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {['all', 'completed', 'failed', 'fallback', 'routing'].map((f) => (
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

      {/* History list */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Event ID</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Target</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Latency</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tokens</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="text-xs text-muted-foreground font-mono">{event.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-white">{event.source}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-white">{event.target}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-muted-foreground">{event.model}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium border ${statusBg[event.status] || statusBg.completed}`}>
                      <span className={statusColors[event.status] || 'text-muted-foreground'}>{event.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-white">{event.latency}ms</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-white">{event.tokensUsed > 0 ? event.tokensUsed.toLocaleString() : '-'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
