'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { HealthMetric } from '@/types'
import { TrendingUp, TrendingDown, Activity, Shield, Zap, Clock, Users, BarChart3 } from 'lucide-react'

interface HealthMonitorProps {
  metrics: HealthMetric[]
}

const iconMap: Record<string, React.ReactNode> = {
  'API Uptime': <Activity className="w-5 h-5" />,
  'Avg Latency': <Clock className="w-5 h-5" />,
  'Error Rate': <Shield className="w-5 h-5" />,
  'Quota Utilization': <BarChart3 className="w-5 h-5" />,
  'Active Sessions': <Users className="w-5 h-5" />,
  'Token Efficiency': <Zap className="w-5 h-5" />,
}

const colorMap: Record<string, string> = {
  'API Uptime': 'text-success',
  'Avg Latency': 'text-secondary',
  'Error Rate': 'text-danger',
  'Quota Utilization': 'text-accent',
  'Active Sessions': 'text-primary',
  'Token Efficiency': 'text-success',
}

export function HealthMonitor({ metrics }: HealthMonitorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <GlassCard className="p-4" hover>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white/5 ${colorMap[metric.name] || 'text-primary'}`}>
                {iconMap[metric.name]}
              </div>
              <div className={`flex items-center gap-1 text-xs ${metric.change >= 0 ? 'text-success' : 'text-danger'}`}>
                {metric.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {metric.name === 'Avg Latency' ? `${metric.value}ms` : `${metric.value}%`}
              </div>
              <div className="text-xs text-muted-foreground">{metric.name}</div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${metric.status === 'healthy' ? 'bg-success' : metric.status === 'warning' ? 'bg-accent' : 'bg-danger'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(metric.value, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}
