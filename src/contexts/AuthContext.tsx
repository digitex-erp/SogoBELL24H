import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  organizationId: string | null
  avatarUrl: string | null
}

interface Organization {
  id: string
  name: string
  slug: string
  plan: string
  timezone: string
  currency: string
}

interface AuthContextType {
  user: User | null
  organization: Organization | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>
  forgotPassword: (email: string) => Promise<{ error?: string; message?: string }>
  logout: () => void
  switchOrganization: (orgId: string) => Promise<void>
  refreshUser: () => Promise<void>
  updateProfile: (data: { name?: string; avatarUrl?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, organization: null, token: null, loading: true,
  login: async () => ({}), register: async () => ({}), forgotPassword: async () => ({}),
  logout: () => {}, switchOrganization: async () => {}, refreshUser: async () => {},
  updateProfile: async () => {},
})

export function useAuth() { return useContext(AuthContext) }

const TRANSIENT_PATTERNS = /not ready|ECONNREFUSED|502|503|upstream|fetch failed|network/i

async function apiWithRetry(path: string, options: RequestInit = {}, retries = 3, delayMs = 1500) {
  const token = localStorage.getItem('bell24h_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let url = `/api${path}`
  if (token && !url.includes('token=')) {
    const sep = url.includes('?') ? '&' : '?'
    url += `${sep}token=${encodeURIComponent(token)}`
  }

  let lastError: any
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers })
      const body = await res.json().catch(() => ({}))
      if (res.ok) return body
      if (res.status >= 500 && attempt < retries) {
        lastError = { status: res.status, ...body }
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1)))
        continue
      }
      throw { status: res.status, ...body }
    } catch (err: any) {
      if (attempt < retries && (err instanceof TypeError || TRANSIENT_PATTERNS.test(String(err?.error || err?.message || '')))) {
        lastError = err
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1)))
        continue
      }
      throw err
    }
  }
  throw lastError
}

async function api(path: string, options: RequestInit = {}) {
  return apiWithRetry(path, options)
}

export async function checkServerReady(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '__probe__', password: '__probe__' }),
      signal: AbortSignal.timeout(5000),
    })
    return res.status === 401 || res.status === 200
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bell24h_token'))
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const data = await api('/auth/me')
      setUser(data.user)
      setOrganization(data.organization)
    } catch {
      setUser(null)
      setOrganization(null)
      setToken(null)
      localStorage.removeItem('bell24h_token')
    }
  }, [])

  useEffect(() => {
    if (token && !user) {
      refreshUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token, user, refreshUser])

  const login = async (email: string, password: string) => {
    try {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      setToken(data.token)
      setUser(data.user)
      setOrganization(data.organization)
      localStorage.setItem('bell24h_token', data.token)
      return {}
    } catch (e: any) {
      return { error: e.error || 'Login failed' }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) })
      setToken(data.token)
      setUser(data.user)
      setOrganization(data.organization)
      localStorage.setItem('bell24h_token', data.token)
      return {}
    } catch (e: any) {
      return { error: e.error || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    setOrganization(null)
    setToken(null)
    localStorage.removeItem('bell24h_token')
  }

  const switchOrganization = async (orgId: string) => {
    await refreshUser()
  }

  const forgotPassword = async (email: string) => {
    try {
      const data = await api('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, newPassword: 'reset-' + Date.now() }) })
      return { message: data.message || 'If an account exists, a reset link has been sent.' }
    } catch (e: any) {
      return { error: e.error || 'Failed to process request' }
    }
  }

  const updateProfile = async (data: { name?: string; avatarUrl?: string }) => {
    const res = await api('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) })
    if (res.user) setUser(res.user)
  }

  return (
    <AuthContext.Provider value={{ user, organization, token, loading, login, register, forgotPassword, logout, switchOrganization, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
