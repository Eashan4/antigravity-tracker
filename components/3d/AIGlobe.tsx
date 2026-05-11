'use client'

export function AIGlobe() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-48 h-48 relative">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full border border-secondary/20 animate-spin" style={{ animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-radial from-primary/10 to-transparent" />
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary via-secondary to-accent opacity-20" />
      </div>
    </div>
  )
}
