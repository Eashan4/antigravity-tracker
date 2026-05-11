'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Account } from '@/types'
import { Zap, Activity, Globe, Clock } from 'lucide-react'
import Image from 'next/image'

interface QuotaCardProps {
  account: Account
  index: number
}

export function QuotaCard({ account, index }: QuotaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-8, 8]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const geminiPercent = (account.geminiQuota.used / account.geminiQuota.total) * 100
  const antiPercent = (account.antigravityQuota.used / account.antigravityQuota.total) * 100

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <GlassCard className="p-5 group cursor-pointer" hover={false} glow={account.status === 'active'}>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

        {/* Top section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-500">
                <Image src={account.avatar} alt={account.email} width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-background"
                animate={account.status === 'active' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white truncate max-w-[180px]">{account.email}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={account.status} pulse={account.status === 'active'} />
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {account.region}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{account.requestsToday.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">requests today</div>
          </div>
        </div>

        {/* Quota bars */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-primary" /> Gemini Pro
              </span>
              <span className="text-white font-medium">{account.geminiQuota.remaining.toLocaleString()} left</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                initial={{ width: 0 }}
                animate={{ width: `${geminiPercent}%` }}
                transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                style={{ boxShadow: geminiPercent > 90 ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 10px rgba(139, 92, 246, 0.3)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{account.geminiQuota.used.toLocaleString()} used</span>
              <span>{account.geminiQuota.total.toLocaleString()} total</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-secondary" /> Antigravity
              </span>
              <span className="text-white font-medium">{account.antigravityQuota.remaining.toLocaleString()} left</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-glow"
                initial={{ width: 0 }}
                animate={{ width: `${antiPercent}%` }}
                transition={{ duration: 1.2, delay: index * 0.1 + 0.5, ease: 'easeOut' }}
                style={{ boxShadow: antiPercent > 90 ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 10px rgba(6, 182, 212, 0.3)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{account.antigravityQuota.used.toLocaleString()} used</span>
              <span>{account.antigravityQuota.total.toLocaleString()} total</span>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Activity className="w-3 h-3" />
              <span>{account.health}% health</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{account.latency}ms</span>
            </div>
          </div>
          <div className="flex gap-2">
            <CircularProgress value={account.geminiQuota.used} max={account.geminiQuota.total} size={36} strokeWidth={3} />
            <CircularProgress value={account.antigravityQuota.used} max={account.antigravityQuota.total} size={36} strokeWidth={3} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
