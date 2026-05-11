'use client'

import { motion } from 'framer-motion'

interface HeatmapChartProps {
  data: number[][]
  className?: string
}

export function HeatmapChart({ data, className }: HeatmapChartProps) {
  const getIntensity = (value: number) => {
    if (value > 80) return 'bg-primary/80 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
    if (value > 60) return 'bg-primary/60'
    if (value > 40) return 'bg-primary/40'
    if (value > 20) return 'bg-primary/20'
    return 'bg-primary/10'
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-7 gap-1">
        {data.flat().map((value, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01, duration: 0.3 }}
            className={`aspect-square rounded-sm ${getIntensity(value)} hover:scale-125 transition-transform cursor-pointer`}
            title={`${value}% usage`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
        <span>Low</span>
        <div className="flex gap-1">
          {[10, 30, 50, 70, 90].map((v) => (
            <div key={v} className={`w-3 h-3 rounded-sm ${getIntensity(v)}`} />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  )
}
