'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { UsageChart } from '@/components/charts/UsageChart'
import { RadialChart } from '@/components/charts/RadialChart'
import { HeatmapChart } from '@/components/charts/HeatmapChart'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { getUsageData, getAccounts, UsageData, Account } from '@/lib/db'
import { BarChart3, PieChart, Calendar, TrendingUp, Download, Database } from 'lucide-react'
import { useState, useEffect } from 'react'

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
)

const providerData = [
  { name: 'Gemini Pro', value: 45, color: '#8b5cf6' },
  { name: 'Gemini Flash', value: 25, color: '#a78bfa' },
  { name: 'Antigravity V3', value: 20, color: '#06b6d4' },
  { name: 'Antigravity Lite', value: 10, color: '#67e8f9' },
]

export function AnalyticsSection() {
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [usage, accts] = await Promise.all([getUsageData(7), getAccounts()])
      setUsageData(usage)
      setAccounts(accts)
      setLoading(false)
    }
    loadData()
  }, [])

  const totalGemini = accounts.reduce((sum, a) => sum + a.geminiQuota.used, 0)
  const totalAnti = accounts.reduce((sum, a) => sum + a.antigravityQuota.used, 0)
  const totalQuota = accounts.reduce((sum, a) => sum + a.geminiQuota.total + a.antigravityQuota.total, 0)
  const usagePercent = totalQuota > 0 ? Math.round(((totalGemini + totalAnti) / totalQuota) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} className="p-5 animate-pulse">
              <div className="h-20 bg-white/5 rounded-lg" />
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
          <h3 className="text-xl font-semibold text-white mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect accounts and start using AI models to see your usage analytics.
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
          <h2 className="text-2xl font-bold text-white">Quota Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">Deep insights into AI quota consumption</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Gemini Used', value: totalGemini, icon: BarChart3, color: 'primary' },
          { label: 'Total Antigravity', value: totalAnti, icon: PieChart, color: 'secondary' },
          { label: 'Combined Usage', value: totalGemini + totalAnti, icon: TrendingUp, color: 'accent' },
          { label: 'Utilization', value: usagePercent, icon: TrendingUp, color: 'success', suffix: '%' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-5" hover>
                <div className={`p-2 rounded-lg bg-${stat.color}/10 w-fit mb-3`}>
                  <Icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-5" gradient>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Usage Trends</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Daily consumption patterns</p>
              </div>
            </div>
            <div className="h-72">
              {usageData.length > 0 ? (
                <UsageChart data={usageData} type="bar" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No usage data yet
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-5 h-full" gradient>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Provider Split</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Quota distribution</p>
            </div>
            <div className="h-48">
              <RadialChart data={providerData} />
            </div>
            <div className="space-y-2 mt-4">
              {providerData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-5" gradient>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-white">Usage Heatmap</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Account activity intensity by day</p>
            </div>
          </div>
          <HeatmapChart data={heatmapData} className="max-w-lg" />
        </GlassCard>
      </motion.div>
    </div>
  )
}
