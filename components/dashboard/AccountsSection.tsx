'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { mockAccounts } from '@/data/mockData'
import { Account } from '@/types'
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  Edit3,
  Globe,
  Activity,
  Clock,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import Image from 'next/image'

export function AccountsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set())
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null)

  const filteredAccounts = mockAccounts.filter((account) => {
    const matchesSearch = account.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || account.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedAccounts)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedAccounts(newSet)
  }

  const toggleAll = () => {
    if (selectedAccounts.size === filteredAccounts.length) {
      setSelectedAccounts(new Set())
    } else {
      setSelectedAccounts(new Set(filteredAccounts.map((a) => a.id)))
    }
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
          <h2 className="text-2xl font-bold text-white">Account Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor all connected AI accounts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Connect Account
        </motion.button>
      </motion.div>

      {/* Toolbar */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.06] text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/[0.06] text-sm text-white outline-none focus:border-primary/40 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="cooldown">Cooldown</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedAccounts.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs text-muted-foreground">{selectedAccounts.size} selected</span>
                <button className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
            <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Accounts Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.size === filteredAccounts.length && filteredAccounts.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                  />
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Gemini Quota</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Antigravity</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Health</th>
                <th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                <th className="px-5 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAccounts.map((account, index) => (
                  <motion.tr
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAccounts.has(account.id)}
                        onChange={() => toggleSelection(account.id)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/10">
                          <Image src={account.avatar} alt={account.email} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{account.email}</div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {account.provider}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={account.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <CircularProgress
                          value={account.geminiQuota.used}
                          max={account.geminiQuota.total}
                          size={36}
                          strokeWidth={3}
                        />
                        <div className="text-xs">
                          <div className="text-white font-medium">{account.geminiQuota.remaining.toLocaleString()}</div>
                          <div className="text-muted-foreground">remaining</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <CircularProgress
                          value={account.antigravityQuota.used}
                          max={account.antigravityQuota.total}
                          size={36}
                          strokeWidth={3}
                        />
                        <div className="text-xs">
                          <div className="text-white font-medium">{account.antigravityQuota.remaining.toLocaleString()}</div>
                          <div className="text-muted-foreground">remaining</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${account.health > 80 ? 'bg-success' : account.health > 50 ? 'bg-accent' : 'bg-danger'}`} />
                        <span className="text-sm text-white">{account.health}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Globe className="w-3 h-3" />
                        {account.region}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
