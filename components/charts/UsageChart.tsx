'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { UsageData } from '@/types'

interface UsageChartProps {
  data: UsageData[]
  type?: 'area' | 'bar'
  className?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl"
      >
        <p className="text-sm font-medium text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </motion.div>
    )
  }
  return null
}

export function UsageChart({ data, type = 'area', className }: UsageChartProps) {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%" className={className}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="gemini" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="url(#geminiGradient)" />
            ))}
          </Bar>
          <Bar dataKey="antigravity" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="url(#antiGradient)" />
            ))}
          </Bar>
          <defs>
            <linearGradient id="geminiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="antiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="geminiArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="antiArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="gemini" stroke="#8b5cf6" strokeWidth={2} fill="url(#geminiArea)" />
        <Area type="monotone" dataKey="antigravity" stroke="#06b6d4" strokeWidth={2} fill="url(#antiArea)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
