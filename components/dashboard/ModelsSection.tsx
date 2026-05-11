'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { ModelCard } from '@/components/widgets/ModelCard'
import { getModels, getProviderRegistry, Model, ProviderInfo } from '@/lib/db'
import { Cpu, SlidersHorizontal, ExternalLink, Database } from 'lucide-react'
import { useState, useEffect } from 'react'

type FilterType = 'all' | 'gemini' | 'anthropic' | 'openai' | 'antigravity' | 'meta' | 'mistral'

// Default provider registry
const defaultProviders: Record<string, ProviderInfo> = {
  gemini: { id: 'gemini', name: 'Google Gemini', color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)', icon: '✦', url: 'https://gemini.google.com' },
  anthropic: { id: 'anthropic', name: 'Anthropic', color: '#d97706', glowColor: 'rgba(217, 119, 6, 0.4)', icon: '◈', url: 'https://claude.ai' },
  openai: { id: 'openai', name: 'OpenAI', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)', icon: '◉', url: 'https://chatgpt.com' },
  antigravity: { id: 'antigravity', name: 'Antigravity', color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)', icon: '⚡', url: 'https://antigravity.ai' },
  meta: { id: 'meta', name: 'Meta AI', color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)', icon: '◎', url: 'https://ai.meta.com' },
  mistral: { id: 'mistral', name: 'Mistral AI', color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)', icon: '✧', url: 'https://chat.mistral.ai' },
}

export function ModelsSection() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [models, setModels] = useState<Model[]>([])
  const [providers, setProviders] = useState<Record<string, ProviderInfo>>(defaultProviders)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [modelsData, providersData] = await Promise.all([
        getModels(),
        getProviderRegistry(),
      ])
      setModels(modelsData)
      setProviders(Object.keys(providersData).length > 0 ? providersData : defaultProviders)
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredModels = models.filter((m) => {
    if (filter === 'all') return true
    return m.provider === filter
  })

  const activeProviders = Object.keys(providers)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <GlassCard key={i} className="p-5 h-48 animate-pulse">
              <div className="h-full bg-white/5 rounded-lg" />
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  if (models.length === 0) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-12 text-center">
          <Cpu className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">Configure Your AI Models</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Set up your AI model providers and configurations to start routing prompts intelligently.
          </p>
          <button className="mt-6 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
            + Add Model
          </button>
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
          <h2 className="text-2xl font-bold text-white">AI Models</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {models.length} models across {activeProviders.length} providers — click any model to access it directly
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
            }`}
          >
            All ({models.length})
          </button>
          {activeProviders.map((providerId) => {
            const provider = providers[providerId]
            const count = models.filter(m => m.provider === providerId).length
            return (
              <button
                key={providerId}
                onClick={() => setFilter(providerId as FilterType)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  filter === providerId
                    ? 'text-white shadow-lg'
                    : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
                }`}
                style={
                  filter === providerId
                    ? { backgroundColor: provider.color, boxShadow: `0 4px 20px ${provider.color}40` }
                    : undefined
                }
              >
                <span className="mr-1.5">{provider.icon}</span>
                {provider.name} ({count})
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Provider quick-links bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassCard className="p-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium uppercase tracking-wider mr-1">
              Quick Access:
            </span>
            {activeProviders.map((providerId) => {
              const provider = providerRegistry[providerId]
              return (
                <a
                  key={providerId}
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-muted-foreground hover:text-white hover:border-white/[0.15] transition-all whitespace-nowrap group"
                >
                  <span>{provider.icon}</span>
                  <span>{provider.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Model cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredModels.map((model, index) => (
          <ModelCard key={model.id} model={model} index={index} />
        ))}
      </div>

      {/* Model performance comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-5" gradient>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-white">Performance Comparison</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latency vs Success Rate across all providers</p>
            </div>
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {(filter === 'all' ? models : filteredModels).map((model, index) => {
              const provider = providers[model.provider] || defaultProviders[model.provider] || defaultProviders.gemini
              return (
                <div key={model.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm" title={provider.name}>{provider.icon}</span>
                      <span className="text-white font-medium">{model.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{model.latency}ms latency</span>
                      <span className="text-success">{model.successRate}% success</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: provider.color,
                        boxShadow: `0 0 10px ${provider.color}40`,
                        width: `${(model.successRate / 100) * 100}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${model.successRate}%` }}
                      transition={{ duration: 1, delay: index * 0.08 + 0.3 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
