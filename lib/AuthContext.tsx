'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  /** Demo login (when Supabase is not configured) */
  demoLogin: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  demoLogin: () => {},
})

export const useAuth = () => useContext(AuthContext)

// Create a mock user for demo mode
function createDemoUser(): User {
  return {
    id: 'demo-user-001',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'demo@quotverse.ai',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'demo', providers: ['demo'] },
    user_metadata: { full_name: 'Demo User', avatar_url: '' },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // In demo mode, check if user previously "logged in"
      const demoLoggedIn = typeof window !== 'undefined' && localStorage.getItem('demo-auth')
      if (demoLoggedIn) {
        setUser(createDemoUser())
      }
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Demo mode: just set demo user
      localStorage.setItem('demo-auth', 'true')
      setUser(createDemoUser())
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    })
    if (error) throw error
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode
      localStorage.setItem('demo-auth', 'true')
      const demoUser = createDemoUser()
      demoUser.email = email
      demoUser.user_metadata = { full_name: email.split('@')[0], avatar_url: '' }
      setUser(demoUser)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode
      localStorage.setItem('demo-auth', 'true')
      const demoUser = createDemoUser()
      demoUser.email = email
      demoUser.user_metadata = { full_name: fullName, avatar_url: '' }
      setUser(demoUser)
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('demo-auth')
      setUser(null)
      setSession(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  const demoLogin = useCallback(() => {
    localStorage.setItem('demo-auth', 'true')
    setUser(createDemoUser())
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isConfigured: isSupabaseConfigured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      demoLogin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
