'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { mockSessions, mockAccounts } from '@/data/mockData'
import { Shield, Clock, Activity, Globe, Monitor, X } from 'lucide-react'

export function SessionsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Active Sessions</h2>
          <p className="text-sm text-muted-foreground mt-1">Monitor and manage account sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <span className="text-xs text-success font-medium">{mockSessions.filter(s => s.status === 'active').length} Active</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
            <span className="text-xs text-accent font-medium">{mockSessions.filter(s => s.status === 'idle').length} Idle</span>
          </div>
        </div>
      </motion.div>

      {/* Sessions grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockSessions.map((session, index) => {
          const account = mockAccounts.find(a => a.id === session.accountId)
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard className="p-5 group" hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${session.status === 'active' ? 'bg-success/10' : session.status === 'idle' ? 'bg-accent/10' : 'bg-muted'}`}>
                      <Monitor className={`w-5 h-5 ${session.status === 'active' ? 'text-success' : session.status === 'idle' ? 'text-accent' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{account?.email || 'Unknown'}</div>
                      <div className="text-[10px] text-muted-foreground">{session.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={session.status} pulse={session.status === 'active'} />
                    <button className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors opacity-0 group-hover:opacity-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" /> Last Activity
                    </div>
                    <div className="text-xs font-medium text-white">{session.lastActivity}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                      <Activity className="w-3 h-3" /> Requests
                    </div>
                    <div className="text-xs font-medium text-white">{session.requestsCount.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                      <Globe className="w-3 h-3" /> IP Address
                    </div>
                    <div className="text-xs font-medium text-white">{session.ip}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                      <Shield className="w-3 h-3" /> User Agent
                    </div>
                    <div className="text-xs font-medium text-white truncate">{session.userAgent}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[10px] text-muted-foreground">Started {session.startTime}</span>
                  <button className="text-[10px] text-danger hover:text-danger-glow transition-colors font-medium">
                    Terminate Session
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
