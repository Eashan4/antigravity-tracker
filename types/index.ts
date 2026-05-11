export interface Account {
  id: string;
  email: string;
  avatar: string;
  provider: 'gmail' | 'workspace';
  status: 'active' | 'warning' | 'error' | 'cooldown';
  geminiQuota: {
    used: number;
    total: number;
    remaining: number;
  };
  antigravityQuota: {
    used: number;
    total: number;
    remaining: number;
  };
  requestsToday: number;
  requestsTotal: number;
  lastUsed: string;
  health: number;
  latency: number;
  region: string;
}

export type ModelProvider = 'gemini' | 'anthropic' | 'openai' | 'antigravity' | 'meta' | 'mistral';

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  version: string;
  status: 'active' | 'deprecated' | 'beta' | 'preview';
  latency: number;
  usageCount: number;
  quotaAllocation: number;
  routingPriority: number;
  capabilities: string[];
  avgResponseTime: number;
  successRate: number;
  /** Direct URL to access this model on its native platform */
  accessUrl: string;
  /** The platform name where users can use this model */
  platform: string;
  /** Context window size in tokens */
  contextWindow: string;
  /** Pricing tier label */
  pricingTier: 'free' | 'low' | 'medium' | 'high' | 'premium';
  /** Quota refresh interval description */
  refreshInterval: string;
  /** Whether the model supports thinking/reasoning mode */
  supportsThinking: boolean;
  /** Model description */
  description: string;
}

export interface RoutingEvent {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  model: string;
  status: 'routing' | 'completed' | 'failed' | 'fallback';
  latency: number;
  tokensUsed: number;
}

export interface UsageData {
  date: string;
  gemini: number;
  antigravity: number;
  total: number;
}

export interface HealthMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  change: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Session {
  id: string;
  accountId: string;
  startTime: string;
  lastActivity: string;
  requestsCount: number;
  status: 'active' | 'idle' | 'expired';
  ip: string;
  userAgent: string;
}

export type ThemeAccent = 'violet' | 'cyan' | 'amber' | 'rose' | 'emerald';

export interface DashboardState {
  sidebarCollapsed: boolean;
  activeSection: string;
  themeAccent: ThemeAccent;
  animationIntensity: 'low' | 'medium' | 'high';
  showNotifications: boolean;
  commandPaletteOpen: boolean;
  hasEntered: boolean;
}

/** Provider metadata for UI display */
export interface ProviderInfo {
  id: ModelProvider;
  name: string;
  color: string;
  glowColor: string;
  icon: string;
  url: string;
}
