import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Session, User } from '@supabase/supabase-js'

interface Profile {
  id: string
  mbti: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (params: any) => Promise<any>
  signIn: (params: any) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: Profile | null; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. 초기 세션 확인
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()

        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
          await fetchProfile(initialSession.user.id)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    // 초기화 타임아웃
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    initializeAuth()

    // 2. Auth 상태 변경 리스너 설정
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, newSession: any) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  // 프로필 데이터 가져오기
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

      if (error) {
        console.warn('Error fetching profile:', error)
      } else {
        setProfile(data as Profile)
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    }
  }

  const signUp = async ({ email, password }: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signIn = async ({ email, password }: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    try {
      console.log('[Auth] Signing out...')
      await supabase.auth.signOut()
    } catch (error) {
      console.error('[Auth] Supabase signOut error:', error)
    } finally {
      // 서버 로그아웃 실패와 관계없이 로컬 상태는 반드시 초기화
      setUser(null)
      setSession(null)
      setProfile(null)
      console.log('[Auth] Local state cleared')
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: 'No user' }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    setProfile(data as Profile)
    return { data: data as Profile, error: null }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-dark-300 text-sm font-medium animate-pulse">
              인증 정보를 확인하고 있습니다...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
