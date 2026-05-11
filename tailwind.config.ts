import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#030305',
        foreground: '#fafafa',
        card: '#0a0a0f',
        'card-foreground': '#fafafa',
        popover: '#0a0a0f',
        'popover-foreground': '#fafafa',
        primary: '#8b5cf6',
        'primary-foreground': '#ffffff',
        'primary-glow': '#a78bfa',
        secondary: '#06b6d4',
        'secondary-foreground': '#ffffff',
        'secondary-glow': '#67e8f9',
        muted: '#1a1a24',
        'muted-foreground': '#a1a1aa',
        accent: '#f59e0b',
        'accent-foreground': '#ffffff',
        'accent-glow': '#fbbf24',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        danger: '#ef4444',
        'danger-glow': '#f87171',
        success: '#10b981',
        'success-glow': '#34d399',
        border: 'rgba(255,255,255,0.06)',
        input: 'rgba(255,255,255,0.06)',
        ring: '#8b5cf6',
        'border-glow': 'rgba(139, 92, 246, 0.3)',
        surface: '#0a0a0f',
        'surface-elevated': '#12121a',
        'surface-glass': 'rgba(10, 10, 15, 0.7)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config