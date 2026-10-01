import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react'
import { AlertTriangle, FlaskConical, Loader2, RefreshCw, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

/* ────────────────────────────────────────────────────────────
   API hook — token-aware, retries transient cold-start errors
   ──────────────────────────────────────────────────────────── */

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('bell24h_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * The platform edge proxy does not forward the `Authorization` header to
 * `/api/voice/*` (the same path the Shogo voice SDK is served from at the edge),
 * so a Bearer-only request 401s there even though it works on other routes and
 * on the internal origin. Sending the token as a query param as well — the
 * convention the rest of this app already uses — makes the module work on both.
 */
function withToken(path: string): string {
  const url = `/api${path}`
  const token = localStorage.getItem('bell24h_token')
  if (!token || url.includes('token=')) return url
  return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
}

export function voiceFetch(path: string, options: RequestInit = {}) {
  return fetch(withToken(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...((options.headers as Record<string, string>) ?? {}),
    },
  })
}

export function useVoiceApi<T = any>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(Boolean(path))
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  useEffect(() => () => { mounted.current = false }, [])

  const load = useCallback(async () => {
    if (!path) return
    setLoading(true)
    setError(null)
    try {
      const res = await voiceFetch(path)
      const body = await res.json().catch(() => ({}))
      if (!mounted.current) return
      if (!res.ok) {
        setError(body?.error ?? `Request failed (${res.status})`)
        return
      }
      setData(body as T)
    } catch (err: any) {
      if (!mounted.current) return
      if (String(err?.message ?? '').includes('API server not ready')) {
        setError('Voice service is warming up — retry in a moment.')
      } else {
        setError(err?.message ?? 'Network error')
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  useEffect(() => { load() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [path, ...deps])

  return { data, loading, error, refetch: load, setData }
}

export async function voicePost<T = any>(path: string, payload?: unknown): Promise<T> {
  const res = await voiceFetch(path, {
    method: 'POST',
    body: payload === undefined ? undefined : JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
  return body as T
}

/**
 * The voice router exposes one action bus at POST /voice/simulate that both
 * persists state (campaign status, agent status, policies, rules, escalations)
 * and returns the canonical "SIMULATION: …" message. Every mutating button in
 * the voice module routes through here so behaviour stays consistent.
 */
export async function simAction<T = any>(action: string, payload: Record<string, unknown> = {}): Promise<T & { message?: string; detail?: string }> {
  const res = await voiceFetch('/voice/simulate', {
    method: 'POST',
    body: JSON.stringify({ action, payload }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error ?? `Action “${action}” failed (${res.status})`)
  return body
}

export async function voicePatch<T = any>(path: string, payload?: unknown): Promise<T> {
  const res = await voiceFetch(path, {
    method: 'PATCH',
    body: payload === undefined ? undefined : JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
  return body as T
}

/* ────────────────────────────────────────────────────────────
   Simulation mode — every telephony action routes through this
   ──────────────────────────────────────────────────────────── */

interface SimEvent { id: string; action: string; detail: string; at: string }

interface SimContextValue {
  simulate: (action: string, detail?: string) => void
  log: SimEvent[]
}

const SimContext = createContext<SimContextValue>({ simulate: () => {}, log: [] })

export function useSimulation() { return useContext(SimContext) }

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<SimEvent[]>([])
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<SimEvent | null>(null)

  const simulate = useCallback((action: string, detail = 'No live telephony infrastructure is contacted.') => {
    const ev: SimEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      action,
      detail,
      at: new Date().toISOString(),
    }
    setCurrent(ev)
    setEvents((prev) => [ev, ...prev].slice(0, 60))
    setOpen(true)
  }, [])

  return (
    <SimContext.Provider value={{ simulate, log: events }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <span className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-4 h-4 text-amber-600" />
              </span>
              Simulation result
            </DialogTitle>
            <DialogDescription className="sr-only">Simulated telephony action result</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-semibold">SIMULATION: {current?.action}</p>
                <p className="mt-0.5 text-amber-700">{current?.detail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-400 font-mono">
                {current ? new Date(current.at).toLocaleTimeString('en-IN') : ''}
              </span>
              <Button size="sm" onClick={() => setOpen(false)}>Acknowledge</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SimContext.Provider>
  )
}

/* ────────────────────────────────────────────────────────────
   Banners & chrome
   ──────────────────────────────────────────────────────────── */

export function SimBanner({ banner, engine }: { banner?: string; engine?: { running?: boolean; ticks?: number; placed?: number } }) {
  // `banner` carries page-specific detail, but the standard simulation headline
  // must appear on every page in the module — a page passing its own copy used to
  // replace the headline entirely. Strip the redundant leading phrase so callers
  // can pass either the canonical banner string or just their own detail.
  const detail = (banner ?? '')
    .replace(/^PROTOTYPE\s*\/\s*SIMULATION MODE\s*[—\-:.]*\s*/i, '')
    .replace(/^no live telephony\.\s*/i, '')
    .trim()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <FlaskConical className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-amber-800 font-semibold">PROTOTYPE / SIMULATION MODE</p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            {detail || 'No live telephony. No SIP trunk, carrier credential or phone number is contacted by this module.'}
          </p>
        </div>
      </div>
      {engine && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('w-1.5 h-1.5 rounded-full', engine.running ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
          <span className="text-[11px] text-amber-800 font-medium tabular-nums">
            Sim engine {engine.running ? 'running' : 'stopped'} · {engine.ticks ?? 0} ticks · {engine.placed ?? 0} placed
          </span>
        </div>
      )}
    </div>
  )
}

export function PageShell({
  icon, title, subtitle, actions, children,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}

export function RefreshButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} />
      Refresh
    </Button>
  )
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
      <Loader2 className="w-4 h-4 animate-spin" />
      {label}
    </div>
  )
}

export function ErrorBlock({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
      <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="text-xs text-red-800 flex-1 min-w-0">
        <p className="font-semibold">Could not load this view</p>
        <p className="mt-0.5">{error}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" className="flex-shrink-0 h-7 text-xs" onClick={onRetry}>Retry</Button>
      )}
    </div>
  )
}

export function EmptyState({ icon, title, hint }: { icon?: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 text-gray-400">{icon}</div>}
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {hint && <p className="text-xs text-gray-500 mt-1 max-w-sm">{hint}</p>}
    </div>
  )
}

export function Panel({ title, subtitle, actions, children, className }: {
  title: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string
}) {
  return (
    <Card className={className}>
      <div className="flex items-start gap-3 p-4 pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

/* ────────────────────────────────────────────────────────────
   KPI tiles
   ──────────────────────────────────────────────────────────── */

const TONE_BG: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-600',
  teal: 'bg-teal-50 text-teal-600',
  gray: 'bg-gray-100 text-gray-600',
}

export function KpiTile({ label, value, caption, icon, tone = 'gray' }: {
  label: string; value: ReactNode; caption?: string; icon?: ReactNode; tone?: keyof typeof TONE_BG
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', TONE_BG[tone])}>
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight mt-0.5">{value}</p>
            {caption && <p className="text-[11px] text-gray-500 mt-0.5">{caption}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiGrid({ children, cols = 6 }: { children: ReactNode; cols?: number }) {
  const map: Record<number, string> = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  }
  return <div className={cn('grid gap-4', map[cols] ?? map[6])}>{children}</div>
}

export function StatBlock({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-lg font-bold text-gray-900 tabular-nums">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Status semantics — LIVE / SIMULATED / CONNECTED / DISABLED /
   ERROR / PENDING / ESCALATED / COMPLETED
   ──────────────────────────────────────────────────────────── */

const STATUS_TONES: Record<string, string> = {
  // live / active
  live: 'bg-red-50 text-red-700 border-red-200',
  in_progress: 'bg-red-50 text-red-700 border-red-200',
  calling: 'bg-red-50 text-red-700 border-red-200',
  speaking: 'bg-red-50 text-red-700 border-red-200',
  answered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ringing: 'bg-blue-50 text-blue-700 border-blue-200',
  // positive
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  running: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  enabled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  // waiting
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  queued: 'bg-blue-50 text-blue-700 border-blue-200',
  callback: 'bg-violet-50 text-violet-700 border-violet-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  no_answer: 'bg-gray-100 text-gray-600 border-gray-200',
  // bad
  escalated: 'bg-orange-50 text-orange-700 border-orange-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  degraded: 'bg-amber-50 text-amber-700 border-amber-200',
  open: 'bg-orange-50 text-orange-700 border-orange-200',
  in_review: 'bg-blue-50 text-blue-700 border-blue-200',
  blocked: 'bg-red-50 text-red-700 border-red-200',
  disabled: 'bg-gray-100 text-gray-500 border-gray-200',
  stopped: 'bg-gray-100 text-gray-600 border-gray-200',
  // meta
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
  medium_: 'bg-blue-50 text-blue-700 border-blue-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  simulated: 'bg-violet-50 text-violet-700 border-violet-200',
}

export function StatusBadge({ status, label, dot, className }: {
  status?: string | null; label?: string; dot?: boolean; className?: string
}) {
  const key = String(status ?? 'unknown').toLowerCase()
  const tone = STATUS_TONES[key] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  const text = label ?? String(status ?? 'unknown').replace(/_/g, ' ')
  const isLive = ['in_progress', 'calling', 'speaking', 'live'].includes(key)
  return (
    <Badge variant="secondary" className={cn('text-[10px] px-1.5 h-5 border capitalize', tone, className)}>
      {(dot || isLive) && (
        <span className={cn('w-1.5 h-1.5 rounded-full mr-1', isLive ? 'bg-red-500 animate-pulse' : 'bg-current opacity-60')} />
      )}
      {text}
    </Badge>
  )
}

export function SimTag({ text = 'SIMULATED', className }: { text?: string; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('text-[10px] px-1.5 h-5 border bg-violet-50 text-violet-700 border-violet-200', className)}>
      {text}
    </Badge>
  )
}

export function Dot({ tone = 'gray' }: { tone?: 'emerald' | 'amber' | 'red' | 'gray' | 'blue' | 'violet' }) {
  const map = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500', gray: 'bg-gray-300', blue: 'bg-blue-500', violet: 'bg-violet-500' }
  return <span className={cn('w-1.5 h-1.5 rounded-full inline-block flex-shrink-0', map[tone])} />
}

export function Meter({ value, tone = 'emerald', className }: { value: number; tone?: 'emerald' | 'amber' | 'red' | 'blue' | 'violet'; className?: string }) {
  const bar = { emerald: '[&>div]:bg-emerald-500', amber: '[&>div]:bg-amber-500', red: '[&>div]:bg-red-500', blue: '[&>div]:bg-blue-500', violet: '[&>div]:bg-violet-500' }
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-gray-100 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all', bar[tone].replace('[&>div]:bg-', 'bg-'))} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Formatting
   ──────────────────────────────────────────────────────────── */

export function fmtDuration(sec?: number | null) {
  const s = Math.max(0, Math.round(sec ?? 0))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function fmtMoney(n?: number | null, currency = 'INR') {
  const v = n ?? 0
  if (currency === 'INR') {
    if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(2)}Cr`
    if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(2)}L`
    if (Math.abs(v) >= 1e3) return `₹${(v / 1e3).toFixed(1)}K`
    return `₹${Math.round(v)}`
  }
  return `$${v.toFixed(v < 10 ? 4 : 2)}`
}

export function fmtWhen(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export function fmtTime(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export function fmtPct(v?: number | null, digits = 0) {
  if (v === null || v === undefined) return '—'
  const n = Math.abs(v) <= 1 ? v * 100 : v
  return `${n.toFixed(digits)}%`
}

export function fmtNum(v?: number | null) {
  return (v ?? 0).toLocaleString('en-IN')
}

/* ────────────────────────────────────────────────────────────
   Small building blocks
   ──────────────────────────────────────────────────────────── */

export function Field({ label, value, mono, className }: { label: string; value: ReactNode; mono?: boolean; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={cn('text-xs text-gray-800 mt-0.5 break-words', mono && 'font-mono')}>{value ?? '—'}</p>
    </div>
  )
}

export function SectionTitle({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{children}</h3>
      {count !== undefined && <Badge variant="secondary" className="text-[10px] px-1.5 h-4 bg-gray-100 text-gray-600">{count}</Badge>}
    </div>
  )
}

export function ChipList({ items, tone = 'gray' }: { items: string[]; tone?: 'gray' | 'emerald' | 'blue' | 'amber' | 'violet' | 'teal' | 'red' }) {
  const tones = {
    gray: 'bg-gray-100 text-gray-700', emerald: 'bg-emerald-50 text-emerald-700', blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700', violet: 'bg-violet-50 text-violet-700', teal: 'bg-teal-50 text-teal-700', red: 'bg-red-50 text-red-700',
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t, i) => (
        <span key={`${t}-${i}`} className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', tones[tone])}>{t}</span>
      ))}
    </div>
  )
}

export function Toast({ message, tone = 'emerald', onDismiss }: { message: string; tone?: 'emerald' | 'red'; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50 flex items-start gap-2 p-3 rounded-lg border shadow-lg max-w-sm',
      tone === 'emerald' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200',
    )}>
      <p className={cn('text-xs flex-1', tone === 'emerald' ? 'text-emerald-800' : 'text-red-800')}>{message}</p>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; tone: 'emerald' | 'red' } | null>(null)
  const show = useCallback((message: string, tone: 'emerald' | 'red' = 'emerald') => setToast({ message, tone }), [])
  const node = useMemo(() => (
    toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null
  ), [toast])
  return { show, node }
}
