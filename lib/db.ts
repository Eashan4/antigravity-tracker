'use client'

import { createClient } from '@supabase/supabase-js'

// Types for our data
export interface Account {
  id: string
  email: string
  avatar: string
  provider: string
  status: 'active' | 'warning' | 'error' | 'cooldown'
  geminiQuota: { used: number; total: number; remaining: number }
  antigravityQuota: { used: number; total: number; remaining: number }
  requestsToday: number
  requestsTotal: number
  lastUsed: string
  health: number
  latency: number
  region: string
}

export interface Model {
  id: string
  name: string
  provider: string
  version: string
  status: 'active' | 'preview' | 'beta' | 'deprecated'
  latency: number
  usageCount: number
  quotaAllocation: number
  routingPriority: number
  capabilities: string[]
  avgResponseTime: number
  successRate: number
  accessUrl: string
  platform: string
  contextWindow: string
  pricingTier: string
  refreshInterval: string
  supportsThinking: boolean
  description: string
}

export interface ProviderInfo {
  id: string
  name: string
  color: string
  glowColor: string
  icon: string
  url: string
}

export interface RoutingEvent {
  id: string
  timestamp: string
  source: string
  target: string
  model: string
  status: 'completed' | 'routing' | 'fallback'
  latency: number
  tokensUsed: number
}

export interface UsageData {
  date: string
  gemini: number
  antigravity: number
  total: number
}

export interface HealthMetric {
  name: string
  value: number
  status: 'healthy' | 'warning' | 'error'
  change: number
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export interface Session {
  id: string
  accountId: string
  startTime: string
  lastActivity: string
  requestsCount: number
  status: 'active' | 'idle' | 'expired'
  ip: string
  userAgent: string
}

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Check if Supabase is configured with real credentials
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// ─── Database Query Functions ───────────────────────────────────────────────

/**
 * Fetch accounts from Supabase, or return empty array if not configured
 */
export async function getAccounts(): Promise<Account[]> {
  if (!supabase) {
    return []
  }
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Failed to fetch accounts:', error.message)
      return []
    }
    return (data || []) as Account[]
  } catch (err) {
    console.warn('Supabase not available, returning empty accounts')
    return []
  }
}

/**
 * Fetch models from Supabase
 */
export async function getModels(): Promise<Model[]> {
  if (!supabase) {
    return []
  }
  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('usage_count', { ascending: false })

    if (error) {
      console.warn('Failed to fetch models:', error.message)
      return []
    }
    return (data || []) as Model[]
  } catch {
    return []
  }
}

/**
 * Fetch routing events from Supabase
 */
export async function getRoutingEvents(limit: number = 50): Promise<RoutingEvent[]> {
  if (!supabase) {
    return []
  }
  try {
    const { data, error } = await supabase
      .from('routing_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.warn('Failed to fetch routing events:', error.message)
      return []
    }
    return (data || []) as RoutingEvent[]
  } catch {
    return []
  }
}

/**
 * Fetch usage data from Supabase
 */
export async function getUsageData(days: number = 7): Promise<UsageData[]> {
  if (!supabase) {
    return []
  }
  try {
    const { data, error } = await supabase
      .from('usage_data')
      .select('*')
      .order('date', { ascending: true })
      .limit(days)

    if (error) {
      console.warn('Failed to fetch usage data:', error.message)
      return []
    }
    return (data || []) as UsageData[]
  } catch {
    return []
  }
}

/**
 * Fetch health metrics from Supabase
 */
export async function getHealthMetrics(): Promise<HealthMetric[]> {
  if (!supabase) {
    return []
  }
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')

    if (error) {
      console.warn('Failed to fetch health metrics:', error.message)
      return []
    }
    return (data || []) as HealthMetric[]
  } catch {
    return []
  }
}

/**
 * Fetch notifications from Supabase
 */
export async function getNotifications(userId?: string): Promise<Notification[]> {
  if (!supabase) {
    return []
  }
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('timestamp', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.limit(50)

    if (error) {
      console.warn('Failed to fetch notifications:', error.message)
      return []
    }
    return (data || []) as Notification[]
  } catch {
    return []
  }
}

/**
 * Fetch sessions from Supabase
 */
export async function getSessions(accountId?: string): Promise<Session[]> {
  if (!supabase) {
    return []
  }
  try {
    let query = supabase
      .from('sessions')
      .select('*')
      .order('start_time', { ascending: false })

    if (accountId) {
      query = query.eq('account_id', accountId)
    }

    const { data, error } = await query.limit(100)

    if (error) {
      console.warn('Failed to fetch sessions:', error.message)
      return []
    }
    return (data || []) as Session[]
  } catch {
    return []
  }
}

/**
 * Get provider registry from Supabase or use defaults
 */
export async function getProviderRegistry(): Promise<Record<string, ProviderInfo>> {
  if (!supabase) {
    // Return default provider registry
    return {
      gemini: {
        id: 'gemini',
        name: 'Google Gemini',
        color: '#8b5cf6',
        glowColor: 'rgba(139, 92, 246, 0.4)',
        icon: '✦',
        url: 'https://gemini.google.com',
      },
      antigravity: {
        id: 'antigravity',
        name: 'Antigravity',
        color: '#06b6d4',
        glowColor: 'rgba(6, 182, 212, 0.4)',
        icon: '⚡',
        url: 'https://antigravity.ai',
      },
    }
  }

  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')

    if (error) {
      return {
        gemini: { id: 'gemini', name: 'Google Gemini', color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)', icon: '✦', url: 'https://gemini.google.com' },
        antigravity: { id: 'antigravity', name: 'Antigravity', color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)', icon: '⚡', url: 'https://antigravity.ai' },
      }
    }

    // Convert array to record
    const registry: Record<string, ProviderInfo> = {}
    for (const provider of data || []) {
      registry[provider.id] = provider
    }
    return registry
  } catch {
    return {
      gemini: { id: 'gemini', name: 'Google Gemini', color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)', icon: '✦', url: 'https://gemini.google.com' },
      antigravity: { id: 'antigravity', name: 'Antigravity', color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)', icon: '⚡', url: 'https://antigravity.ai' },
    }
  }
}
