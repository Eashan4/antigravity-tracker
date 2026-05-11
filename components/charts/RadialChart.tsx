'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface RadialChartProps {
  data: { name: string; value: number; color: string }[]
  className?: string
}

export function RadialChart({ data, className }: RadialChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-surface/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 text-xs">
                  <span className="text-white font-medium">{payload[0].name}: </span>
                  <span style={{ color: payload[0].payload.color }}>{payload[0].value}%</span>
                </div>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
