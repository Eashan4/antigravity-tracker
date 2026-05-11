import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return ms + 'ms'
  return (ms / 1000).toFixed(1) + 's'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'healthy':
    case 'success':
      return 'text-success'
    case 'warning':
    case 'idle':
      return 'text-accent'
    case 'error':
    case 'critical':
    case 'failed':
      return 'text-danger'
    case 'cooldown':
    case 'expired':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'active':
    case 'healthy':
    case 'success':
      return 'bg-success/10 border-success/30'
    case 'warning':
    case 'idle':
      return 'bg-accent/10 border-accent/30'
    case 'error':
    case 'critical':
    case 'failed':
      return 'bg-danger/10 border-danger/30'
    case 'cooldown':
    case 'expired':
      return 'bg-muted border-muted-foreground/30'
    default:
      return 'bg-muted border-muted-foreground/30'
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
