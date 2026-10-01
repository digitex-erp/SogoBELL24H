import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function useFetch<T>(path: string, deps: unknown[] = []) {
  const { token } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sep = path.includes('?') ? '&' : '?'
      const tokenParam = token ? `${sep}token=${encodeURIComponent(token)}` : ''
      const res = await fetch(`/api${path}${tokenParam}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [token, path, ...deps])

  useEffect(() => { refetch() }, [refetch])

  return { data, loading, error, refetch }
}

export async function apiCall(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('bell24h_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    const sep = path.includes('?') ? '&' : '?'
    path = `${path}${sep}token=${encodeURIComponent(token)}`
  }
  const res = await fetch(`/api${path}`, { ...options, headers })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
  return body
}
