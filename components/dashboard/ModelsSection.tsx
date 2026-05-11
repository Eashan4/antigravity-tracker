'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { ModelCard } from '@/components/widgets/ModelCard'
import { mockModels, providerRegistry } from '@/data/mockData'
import { ModelProvider } from '@/types'
import { Cpu, SlidersHorizontal, ExternalLink } from 'lucide-react'
import { useState } from 'react'

type FilterType = 'all' | ModelProvider

export function ModelsSection() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredModels = mockModels.filter((m) => {
    if (filter === 'all') return true
    return m.provider === filter
  })

  // Get unique providers from the models list
  const activeProviders = Array.from(new Set(mockModels.map(m => m.provider)))

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
            {mockModels.length} models across {activeProviders.length} providers — click any model to access it directly
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
            All ({mockModels.length})
          </button>
          {activeProviders.map((providerId) => {
            const provider = providerRegistry[providerId]
            const count = mockModels.filter(m => m.provider === providerId).length
            return (
              <button
                key={providerId}
                onClick={() => setFilter(providerId)}
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
            {(filter === 'all' ? mockModels : filteredModels).map((model, index) => {
              const provider = providerRegistry[model.provider]
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
