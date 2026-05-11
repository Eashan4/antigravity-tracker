'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  gradient?: boolean
  delay?: number
}

export function GlassCard({ children, className, hover = true, glow = false, gradient = false, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
      className={cn(
        'relative rounded-2xl border border-white/[0.06] bg-surface-glass backdrop-blur-xl overflow-hidden',
        hover && 'hover:border-primary/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-500',
        glow && 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
        gradient && 'animated-gradient-border',
        className
      )}
    >
      {gradient && <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
