'use client'

import { motion } from 'framer-motion'

interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
}

export function CircularProgress({ value, max, size = 60, strokeWidth = 4, className, showPercentage = true }: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage > 90) return '#ef4444'
    if (percentage > 70) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${getColor()})` }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold" style={{ color: getColor() }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}
