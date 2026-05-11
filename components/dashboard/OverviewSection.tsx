'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { QuotaCard } from '@/components/widgets/QuotaCard'
import { HealthMonitor } from '@/components/widgets/HealthMonitor'
import { RoutingVisualizer } from '@/components/widgets/RoutingVisualizer'
import { UsageChart } from '@/components/charts/UsageChart'
import { mockAccounts, mockHealthMetrics, mockRoutingEvents, mockUsageData } from '@/data/mockData'
import { Activity, TrendingUp, Users, Zap, Globe, Clock } from 'lucide-react'

export function OverviewSection() {
  const totalRequests = mockAccounts.reduce((sum, a) => sum + a.requestsToday, 0)
  const totalAccounts = mockAccounts.length
  const activeAccounts = mockAccounts.filter(a => a.status === 'active').length
  const avgLatency = Math.round(mockAccounts.reduce((sum, a) => sum + a.latency, 0) / mockAccounts.length)

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests Today', value: totalRequests, icon: Activity, color: 'primary', suffix: '' },
          { label: 'Active Accounts', value: activeAccounts, icon: Users, color: 'success', suffix: `/${totalAccounts}` },
          { label: 'Avg Latency', value: avgLatency, icon: Clock, color: 'secondary', suffix: 'ms' },
          { label: 'Uptime', value: 99.9, icon: Globe, color: 'accent', suffix: '%' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="p-5" hover>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <Icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Charts + Routing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassCard className="p-5" gradient>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Usage Analytics</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Weekly quota consumption</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Gemini
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-secondary" /> Antigravity
                </span>
              </div>
            </div>
            <div className="h-64">
              <UsageChart data={mockUsageData} type="area" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <RoutingVisualizer events={mockRoutingEvents} />
        </motion.div>
      </div>

      {/* Health metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">System Health</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time infrastructure monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-success"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-success">All systems operational</span>
          </div>
        </div>
        <HealthMonitor metrics={mockHealthMetrics} />
      </motion.div>

      {/* Account quota cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Account Quotas</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Monitor and manage AI account limits</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors">
            + Add Account
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockAccounts.map((account, index) => (
            <QuotaCard key={account.id} account={account} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
