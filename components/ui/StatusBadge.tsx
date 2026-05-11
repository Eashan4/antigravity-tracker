'use client'

import { cn, getStatusColor, getStatusBg } from '@/lib/utils'
import { motion } from 'framer-motion'

interface StatusBadgeProps {
  status: string
  className?: string
  pulse?: boolean
}

export function StatusBadge({ status, className, pulse = true }: StatusBadgeProps) {
  const colorClass = getStatusColor(status)
  const bgClass = getStatusBg(status)

  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border', bgClass, className)}>
      {pulse && (
        <motion.span
          className={cn('w-2 h-2 rounded-full', colorClass.replace('text-', 'bg-'))}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <span className={cn('capitalize', colorClass)}>{status}</span>
    </div>
  )
}
