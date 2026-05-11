'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Model, ModelProvider } from '@/types'
import { providerRegistry } from '@/data/mockData'
import {
  Zap, Activity, Gauge, Layers, Star, Code, Eye, Brain,
  ExternalLink, Clock, Sparkles, ArrowUpRight
} from 'lucide-react'

interface ModelCardProps {
  model: Model
  index: number
}

const capabilityIcons: Record<string, React.ReactNode> = {
  'Text': <Zap className="w-3 h-3" />,
  'Vision': <Eye className="w-3 h-3" />,
  'Code': <Code className="w-3 h-3" />,
  'Reasoning': <Brain className="w-3 h-3" />,
  'Fast': <Gauge className="w-3 h-3" />,
  'Analysis': <Activity className="w-3 h-3" />,
  'Complex Reasoning': <Brain className="w-3 h-3" />,
  'Agentic': <Layers className="w-3 h-3" />,
  'Thinking': <Sparkles className="w-3 h-3" />,
}

const pricingTierConfig: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: 'Free', color: 'text-success', bg: 'bg-success/10 border-success/20' },
  low: { label: 'Low Cost', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' },
  medium: { label: 'Medium', color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
  high: { label: 'High', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  premium: { label: 'Premium', color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
}

export function ModelCard({ model, index }: ModelCardProps) {
  const provider = providerRegistry[model.provider]
  const pricingConfig = pricingTierConfig[model.pricingTier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <GlassCard className="p-5 group relative overflow-hidden" hover glow={model.status === 'active'}>
        {/* Provider accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, transparent, ${provider.color}, transparent)` }}
        />

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${provider.glowColor?.replace('0.4', '0.06')}, transparent 70%)` }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: `${provider.color}15`, border: `1px solid ${provider.color}30` }}
              >
                {provider.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{model.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: `${provider.color}10`, color: provider.color, borderColor: `${provider.color}30` }}
                  >
                    {provider.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">v{model.version}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                model.status === 'active' ? 'bg-success/10 text-success border border-success/20' :
                model.status === 'beta' ? 'bg-accent/10 text-accent border border-accent/20' :
                model.status === 'preview' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                'bg-muted text-muted-foreground border border-muted-foreground/20'
              }`}>
                {model.status}
              </div>
              {model.supportsThinking && (
                <div className="flex items-center gap-1 text-[9px] text-primary">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Thinking</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {model.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2.5 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] text-muted-foreground mb-1">Latency</div>
              <div className="text-sm font-semibold text-white">{model.latency}ms</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] text-muted-foreground mb-1">Success Rate</div>
              <div className="text-sm font-semibold text-white">{model.successRate}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] text-muted-foreground mb-1">Context Window</div>
              <div className="text-sm font-semibold text-white">{model.contextWindow}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] text-muted-foreground mb-1">Pricing</div>
              <div className={`text-sm font-semibold ${pricingConfig.color}`}>{pricingConfig.label}</div>
            </div>
          </div>

          {/* Quota allocation bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] mb-1.5">
              <span className="text-muted-foreground">Quota Allocation</span>
              <span className="text-white font-medium">{model.quotaAllocation}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: provider.color, boxShadow: `0 0 10px ${provider.color}40` }}
                initial={{ width: 0 }}
                animate={{ width: `${model.quotaAllocation}%` }}
                transition={{ duration: 1, delay: index * 0.08 + 0.3 }}
              />
            </div>
          </div>

          {/* Refresh timer */}
          <div className="flex items-center gap-1.5 mb-3 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{model.refreshInterval}</span>
          </div>

          {/* Capabilities */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {model.capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-[10px] text-muted-foreground border border-white/5"
              >
                {capabilityIcons[cap]}
                {cap}
              </span>
            ))}
          </div>

          {/* Access button */}
          <a
            href={model.accessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium text-white transition-all duration-300 group/btn"
            style={{
              background: `linear-gradient(135deg, ${provider.color}20, ${provider.color}10)`,
              border: `1px solid ${provider.color}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${provider.color}40, ${provider.color}20)`
              e.currentTarget.style.boxShadow = `0 0 20px ${provider.color}20`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${provider.color}20, ${provider.color}10)`
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in {model.platform}</span>
            <ArrowUpRight className="w-3 h-3 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
          </a>
        </div>
      </GlassCard>
    </motion.div>
  )
}
