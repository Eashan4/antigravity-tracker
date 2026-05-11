'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { RoutingVisualizer } from '@/components/widgets/RoutingVisualizer'
import { getRoutingEvents, getAccounts, RoutingEvent, Account } from '@/lib/db'
import { GitBranch, Settings, ToggleLeft, ToggleRight, Zap, Shield, Route, Database } from 'lucide-react'
import { useState, useEffect } from 'react'

export function RoutingSection() {
  const [routingEvents, setRoutingEvents] = useState<RoutingEvent[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRoute, setAutoRoute] = useState(true)
  const [fallbackEnabled, setFallbackEnabled] = useState(true)
  const [loadBalance, setLoadBalance] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [events, accts] = await Promise.all([getRoutingEvents(20), getAccounts()])
      setRoutingEvents(events)
      setAccounts(accts)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-5 animate-pulse">
              <div className="h-24 bg-white/5 rounded-lg" />
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-12 text-center">
          <Database className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">AI Routing Engine</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect accounts to enable intelligent prompt routing across your AI providers.
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
          <h2 className="text-2xl font-bold text-white">AI Routing Engine</h2>
          <p className="text-sm text-muted-foreground mt-1">Intelligent prompt distribution across accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success font-medium">Engine Active</span>
          </div>
        </div>
      </motion.div>

      {/* Routing controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: 'autoRoute',
            label: 'Auto Routing',
            description: 'Automatically route prompts to optimal accounts',
            icon: Route,
            state: autoRoute,
            setState: setAutoRoute,
          },
          {
            id: 'fallback',
            label: 'Fallback Switching',
            description: 'Switch to backup on quota exhaustion',
            icon: Shield,
            state: fallbackEnabled,
            setState: setFallbackEnabled,
          },
          {
            id: 'loadBalance',
            label: 'Load Balancing',
            description: 'Distribute load evenly across accounts',
            icon: Zap,
            state: loadBalance,
            setState: setLoadBalance,
          },
        ].map((control, index) => {
          const Icon = control.icon
          return (
            <motion.div
              key={control.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-5" hover>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${control.state ? 'bg-primary/10' : 'bg-white/5'}`}>
                    <Icon className={`w-5 h-5 ${control.state ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <button
                    onClick={() => control.setState(!control.state)}
                    className="transition-transform hover:scale-110"
                  >
                    {control.state ? (
                      <ToggleRight className="w-6 h-6 text-primary" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-white">{control.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{control.description}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Live routing visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RoutingVisualizer events={routingEvents} />
      </motion.div>

      {/* Routing rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-5" gradient>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-white">Routing Rules</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Priority-based account selection</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors">
              <Settings className="w-4 h-4" />
              Configure
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-primary/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{account.email}</div>
                  <div className="text-[10px] text-muted-foreground">{account.region} • {account.provider}</div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-white font-medium">{account.geminiQuota.remaining.toLocaleString()}</div>
                    <div className="text-muted-foreground">Gemini left</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{account.antigravityQuota.remaining.toLocaleString()}</div>
                    <div className="text-muted-foreground">Anti left</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{account.health}%</div>
                    <div className="text-muted-foreground">Health</div>
                  </div>
                </div>
                <div className="w-24">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${account.health}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
