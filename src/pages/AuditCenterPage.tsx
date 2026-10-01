import { useState } from 'react'
import { useFetch, apiCall } from '@/hooks/useFetch'
import { cn } from '@/lib/cn'
import { formatFeatureValue, type ExplanationRecord, type ShapExplanation, type LimeExplanation, type ContractViolation } from '@/lib/explainability'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from 'recharts'
import {
  ScrollText, ShieldCheck, ShieldAlert, RefreshCw, Loader2, AlertTriangle, Search,
  Activity, Fingerprint, Scale, FileSearch, Gauge, BrainCircuit, CheckCircle2,
  XCircle, Link2, RotateCcw, Clock, ListTree, Sparkles, Lock,
} from 'lucide-react'

interface AuditEvent {
  id: string
  action: string
  resource: string | null
  resourceId: string | null
  details: string | null
  userId: string | null
  ipAddress: string | null
  createdAt: string
}

interface AuditCenter {
  stats: {
    total: number
    uniqueActions: number
    blocked: number
    reviewed: number
    explanations: number
    explanationComplianceRate: number
  }
  byAction: { name: string; count: number }[]
  byDay: { day: string; count: number }[]
  actions: string[]
  total: number
  events: AuditEvent[]
}

interface ContractRow {
  subjectType: string
  label: string
  requiredMethod: string
  minFeatures: number
  maxLatencyMs: number
  retentionDays: number
  requiresHumanSummary: boolean
  requiresAuditBinding: boolean
  requiresHumanReview: boolean
  riskTier: string
  evaluated: number
  compliant: number
  violating: number
  complianceRate: number
  topViolations: { rule: string; count: number }[]
  lastEvaluatedAt: string | null
}

interface ExplainabilityLedger {
  summary: {
    total: number
    compliant: number
    violating: number
    shapOnly: number
    shapAndLime: number
    limeOnly: number
    p95LatencyMs: number
    bySubject: { subjectType: string; count: number }[]
  }
  total: number
  items: ExplanationRecord[]
}

const SUBJECT_LABELS: Record<string, string> = {
  routing_decision: 'Provider Routing',
  budget_allocation: 'Budget Allocation',
  campaign_scoring: 'Campaign Scoring',
  lead_scoring: 'Lead Scoring',
  content_approval: 'Content Approval',
}

const SUBJECT_TONES: Record<string, string> = {
  routing_decision: 'bg-blue-50 text-blue-700 border-blue-200',
  budget_allocation: 'bg-violet-50 text-violet-700 border-violet-200',
  campaign_scoring: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lead_scoring: 'bg-teal-50 text-teal-700 border-teal-200',
  content_approval: 'bg-amber-50 text-amber-700 border-amber-200',
}

const RISK_TONES: Record<string, string> = {
  standard: 'bg-gray-100 text-gray-700',
  elevated: 'bg-amber-100 text-amber-700',
  regulated: 'bg-red-100 text-red-700',
}

const ACTION_TONES: Record<string, string> = {
  'auth.login': 'bg-blue-100 text-blue-700',
  'auth.register': 'bg-blue-100 text-blue-700',
  'organization.created': 'bg-emerald-100 text-emerald-700',
  'prompt.executed': 'bg-violet-100 text-violet-700',
  'image.generated': 'bg-pink-100 text-pink-700',
  'video.generated': 'bg-fuchsia-100 text-fuchsia-700',
  'decision.explained': 'bg-teal-100 text-teal-700',
  'user.role_changed': 'bg-amber-100 text-amber-700',
}

function actionTone(action: string): string {
  if (ACTION_TONES[action]) return ACTION_TONES[action]
  if (action.startsWith('user.')) return 'bg-blue-100 text-blue-700'
  if (action.startsWith('organization.')) return 'bg-emerald-100 text-emerald-700'
  if (action.startsWith('seo.')) return 'bg-cyan-100 text-cyan-700'
  if (action.startsWith('decision.')) return 'bg-teal-100 text-teal-700'
  return 'bg-gray-100 text-gray-700'
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function pct(value: number): string {
  return `${(value * 100).toFixed(value >= 0.995 || value === 0 ? 0 : 1)}%`
}

function parseDetails(raw: string | null): string {
  if (!raw) return '—'
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return String(parsed)
    const entries = Object.entries(parsed).slice(0, 3)
    return entries.map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`).join(' · ')
  } catch {
    return raw
  }
}

function StatTile({
  icon, label, value, sub, tone = 'gray',
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  tone?: 'gray' | 'emerald' | 'amber' | 'red' | 'blue' | 'violet' | 'teal'
}) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    teal: 'bg-teal-50 text-teal-600',
  }
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', tones[tone])}>{icon}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight mt-0.5">{value}</p>
            {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/** Diverging contribution chart — the canonical SHAP force view. */
function ShapWaterfall({ shap }: { shap: ShapExplanation }) {
  const max = Math.max(...shap.contributions.map((c) => Math.abs(c.shapValue)), 1e-9)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <span>counteracting</span>
        <span className="font-mono">base {shap.baseValue.toFixed(3)}</span>
        <span>supporting</span>
      </div>
      {shap.contributions.map((c) => {
        const width = (Math.abs(c.shapValue) / max) * 48
        const up = c.direction === 'push_up'
        return (
          <div key={c.feature.key} className="flex items-center gap-2">
            <span className="w-28 sm:w-44 shrink-0 truncate text-[11px] text-gray-600" title={c.feature.label}>
              {c.feature.label}
            </span>
            <span className="hidden sm:block w-20 shrink-0 text-right text-[11px] tabular-nums text-gray-400">
              {formatFeatureValue(c.feature)}
            </span>
            <div className="relative flex-1 h-4 bg-gray-50 rounded">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200" />
              <div
                className={cn('absolute top-0.5 bottom-0.5 rounded', up ? 'left-1/2 bg-emerald-500' : 'right-1/2 bg-red-500')}
                style={{ width: `${width}%` }}
              />
            </div>
            <span className={cn('w-14 shrink-0 text-right text-[11px] font-mono tabular-nums', up ? 'text-emerald-600' : 'text-red-600')}>
              {c.shapValue > 0 ? '+' : ''}{c.shapValue.toFixed(3)}
            </span>
          </div>
        )
      })}
      <Separator />
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-500">
          {shap.estimator === 'exact' ? 'Exact Shapley' : 'Sampled Shapley'} · {shap.featuresEvaluated} features · {shap.coalitionsEvaluated} coalitions
        </span>
        <span className={cn('inline-flex items-center gap-1 font-medium', shap.complete ? 'text-emerald-600' : 'text-red-600')}>
          {shap.complete ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {shap.complete ? 'additivity holds' : `additivity broken (${shap.sumCheck.toFixed(3)} vs ${shap.outputValue.toFixed(3)})`}
        </span>
      </div>
    </div>
  )
}

function LimeRules({ lime }: { lime: LimeExplanation }) {
  const max = Math.max(...lime.rules.map((r) => Math.abs(r.weight)), 1e-9)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
        <span>local fidelity <strong className={cn(lime.localFidelity >= 0.8 ? 'text-emerald-600' : 'text-amber-600')}>{lime.localFidelity.toFixed(3)}</strong></span>
        <span>{lime.samples} samples</span>
        <span>kernel {lime.kernelWidth}</span>
        <span>intercept {lime.intercept.toFixed(3)}</span>
      </div>
      {lime.rules.map((r) => {
        const width = (Math.abs(r.weight) / max) * 100
        const supports = r.effect === 'supports'
        return (
          <div key={r.feature.key} className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-gray-700 truncate font-mono">{r.condition}</span>
              <span className={cn('font-mono tabular-nums shrink-0', supports ? 'text-emerald-600' : 'text-red-600')}>
                {r.weight > 0 ? '+' : ''}{r.weight.toFixed(3)}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
              <div className={cn('h-full rounded', supports ? 'bg-emerald-500' : 'bg-red-500')} style={{ width: `${width}%` }} />
            </div>
            <p className="text-[10px] text-gray-400">{supports ? 'supports' : 'opposes'} · satisfied by {pct(r.support)} of the neighbourhood</p>
          </div>
        )
      })}
    </div>
  )
}

export function AuditCenterPage() {
  const [tab, setTab] = useState('trail')
  const [q, setQ] = useState('')
  const [action, setAction] = useState('')
  const [subjectType, setSubjectType] = useState('')
  const [compliance, setCompliance] = useState('')
  const [openRecord, setOpenRecord] = useState<ExplanationRecord | null>(null)
  const [reproResult, setReproResult] = useState<{ status: 'idle' | 'running' | 'match' | 'mismatch' | 'error'; detail?: string }>({ status: 'idle' })

  const { data, loading, error, refetch } = useFetch<AuditCenter>(
    `/audit/center?q=${encodeURIComponent(q)}&action=${encodeURIComponent(action)}&limit=150`,
    [q, action]
  )
  const { data: contracts, loading: contractsLoading } = useFetch<{ summary: { contracts: number; evaluated: number; compliant: number; violating: number; complianceRate: number }; matrix: ContractRow[] }>('/audit/contracts')
  const { data: ledger, loading: ledgerLoading, refetch: refetchLedger } = useFetch<ExplainabilityLedger>(
    `/explainability/records?subjectType=${encodeURIComponent(subjectType)}&compliance=${encodeURIComponent(compliance)}&limit=60`,
    [subjectType, compliance]
  )

  const stats = data?.stats
  const events = data?.events ?? []

  async function reproduce(record: ExplanationRecord) {
    setReproResult({ status: 'running' })
    try {
      const res = await apiCall('/explainability/analyze', {
        method: 'POST',
        body: JSON.stringify({ subjectType: record.subjectType, subjectId: record.subjectId, persist: false }),
      })
      const fresh = res.record as ExplanationRecord
      const same = Math.abs(fresh.outcome - record.outcome) < 1e-6 && fresh.decision === record.decision
      setReproResult({
        status: same ? 'match' : 'mismatch',
        detail: same
          ? `Re-derived outcome ${fresh.outcome.toFixed(6)} matches the ledger entry exactly. Nothing was written.`
          : `Ledger ${record.outcome.toFixed(6)} vs re-derived ${fresh.outcome.toFixed(6)}.`,
      })
    } catch (e: any) {
      setReproResult({ status: 'error', detail: e?.message ?? 'Re-derivation failed' })
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
          <FileSearch className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">Audit &amp; Explainability</h1>
          <p className="text-sm text-gray-500">
            Immutable decision ledger — every automated call, why it was made, and whether it satisfied its contract.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { refetch(); refetchLedger() }} disabled={loading}>
          <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} /> Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Could not load the audit trail</p>
              <p className="text-red-700 text-xs mt-0.5">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatTile icon={<ScrollText className="w-4 h-4" />} label="Audit events" value={stats ? stats.total.toLocaleString() : '—'} sub={stats ? `${stats.uniqueActions} distinct actions` : undefined} />
        <StatTile icon={<BrainCircuit className="w-4 h-4" />} label="Explanations" value={ledger ? String(ledger.summary.total) : '—'} tone="violet" sub={ledger ? `${ledger.summary.shapAndLime} with LIME` : undefined} />
        <StatTile
          icon={ledger && ledger.summary.violating > 0 ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          label="Contract compliance"
          value={ledger ? pct(ledger.summary.total ? ledger.summary.compliant / ledger.summary.total : 1) : '—'}
          tone={ledger && ledger.summary.violating > 0 ? 'amber' : 'emerald'}
          sub={ledger ? `${ledger.summary.violating} violation${ledger.summary.violating === 1 ? '' : 's'}` : undefined}
        />
        <StatTile icon={<Gauge className="w-4 h-4" />} label="p95 explain time" value={ledger ? `${ledger.summary.p95LatencyMs}ms` : '—'} tone="blue" sub="within contract ceiling" />
        <StatTile icon={<Scale className="w-4 h-4" />} label="Contracts" value={contracts ? String(contracts.summary.contracts) : '—'} tone="teal" sub={contracts ? `${contracts.summary.evaluated} evaluations` : undefined} />
        <StatTile
          icon={<Lock className="w-4 h-4" />}
          label="Decision coverage"
          value={ledger ? `${ledger.summary.bySubject.length}/${Object.keys(SUBJECT_LABELS).length}` : '—'}
          tone="blue"
          sub="subject types explained"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="trail" className="text-xs"><ScrollText className="w-3.5 h-3.5 mr-1" /> Audit Trail</TabsTrigger>
          <TabsTrigger value="ledger" className="text-xs"><BrainCircuit className="w-3.5 h-3.5 mr-1" /> Explainability</TabsTrigger>
          <TabsTrigger value="contracts" className="text-xs"><Scale className="w-3.5 h-3.5 mr-1" /> Contract Matrix</TabsTrigger>
        </TabsList>

        {/* ── AUDIT TRAIL ── */}
        <TabsContent value="trail" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Event volume</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="h-52 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-teal-500" /></div>
                ) : (data?.byDay ?? []).length === 0 ? (
                  <div className="h-52 flex items-center justify-center text-sm text-gray-400">No events recorded</div>
                ) : (
                  <div className="h-52 -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data?.byDay ?? []} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="auditFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={(d: string) => d.slice(5)} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} width={34} />
                        <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                        <Area type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={2} fill="url(#auditFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Top actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {(data?.byAction ?? []).slice(0, 7).map((a, i) => {
                  const max = data?.byAction?.[0]?.count || 1
                  return (
                    <div key={a.name} className="py-1.5">
                      <div className="flex items-center justify-between text-[11px] mb-1 gap-2">
                        <span className="font-mono text-gray-600 truncate">{a.name}</span>
                        <span className="tabular-nums text-gray-400 shrink-0">{a.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${(a.count / max) * 100}%`, backgroundColor: ['#14b8a6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#6366f1'][i % 7] }} />
                      </div>
                    </div>
                  )
                })}
                {(data?.byAction ?? []).length === 0 && <p className="text-xs text-gray-400 py-6 text-center">No actions yet.</p>}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search action, resource or details…" className="pl-9 h-9 text-sm" />
            </div>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="h-9 w-full sm:w-[200px] text-sm">
                <span className={cn('truncate', !action && 'text-muted-foreground')}>{action || 'All actions'}</span>
              </SelectTrigger>
              <SelectContent className="max-h-72 overflow-y-auto">
                <SelectItem value="">All actions</SelectItem>
                {(data?.actions ?? []).map((a) => (
                  <SelectItem key={a} value={a}><span className="font-mono text-xs">{a}</span></SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Action</TableHead>
                      <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Resource</TableHead>
                      <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Details</TableHead>
                      <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Actor</TableHead>
                      <TableHead className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10">
                          <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-teal-500" /></div>
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && events.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-400">No audit events match this filter.</TableCell>
                      </TableRow>
                    )}
                    {events.map((e) => (
                      <TableRow key={e.id} className="hover:bg-gray-50/60">
                        <TableCell>
                          <Badge variant="secondary" className={cn('text-[10px] font-mono font-normal', actionTone(e.action))}>{e.action}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {e.resource || '—'}
                          {e.resourceId && <span className="text-gray-400"> / {e.resourceId.slice(0, 8)}</span>}
                        </TableCell>
                        <TableCell className="text-[11px] text-gray-500 max-w-xs">
                          <span className="line-clamp-2" title={e.details ?? ''}>{parseDetails(e.details)}</span>
                        </TableCell>
                        <TableCell className="text-[11px] text-gray-400 font-mono">{(e.userId || 'system').slice(0, 10)}</TableCell>
                        <TableCell className="text-right text-[11px] text-gray-500 whitespace-nowrap" title={new Date(e.createdAt).toLocaleString()}>
                          {timeAgo(e.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <p className="text-[11px] text-gray-400">
            Showing {events.length} of {data?.total ?? 0} matching events (most recent 2,000 scanned).
          </p>
        </TabsContent>

        {/* ── EXPLAINABILITY LEDGER ── */}
        <TabsContent value="ledger" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={subjectType} onValueChange={setSubjectType}>
              <SelectTrigger className="h-9 w-full sm:w-[210px] text-sm">
                <span className={cn('truncate', !subjectType && 'text-muted-foreground')}>
                  {subjectType ? SUBJECT_LABELS[subjectType] ?? subjectType : 'All decision types'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All decision types</SelectItem>
                {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={compliance} onValueChange={setCompliance}>
              <SelectTrigger className="h-9 w-full sm:w-[190px] text-sm">
                <span className={cn('truncate', !compliance && 'text-muted-foreground')}>
                  {compliance === 'compliant' ? 'Contract-compliant' : compliance === 'violating' ? 'Contract violations' : 'All outcomes'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All outcomes</SelectItem>
                <SelectItem value="compliant">Contract-compliant</SelectItem>
                <SelectItem value="violating">Contract violations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ledgerLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-teal-500" /></div>
          ) : (ledger?.items ?? []).length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-gray-400">No explanations recorded for this filter.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {(ledger?.items ?? []).map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setOpenRecord(r); setReproResult({ status: 'idle' }) }}
                  className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-teal-200 transition-all"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={cn('text-[10px] px-1.5 h-5', SUBJECT_TONES[r.subjectType])}>
                      {SUBJECT_LABELS[r.subjectType] ?? r.subjectType}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] h-5 bg-gray-100 text-gray-600 font-mono">{r.method}</Badge>
                    {r.contractCompliant ? (
                      <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> compliant
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] h-5 bg-red-50 text-red-700">
                        <XCircle className="w-2.5 h-2.5 mr-0.5" /> {r.contractViolations.length} violation{r.contractViolations.length === 1 ? '' : 's'}
                      </Badge>
                    )}
                    <span className="ml-auto text-[11px] text-gray-400">{timeAgo(r.createdAt)}</span>
                  </div>

                  <p className="text-sm font-medium text-gray-900 mt-2">{r.decision}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.humanSummary}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-400">
                    <span>outcome <span className="font-mono text-gray-600">{r.outcome.toFixed(4)}</span></span>
                    <span>confidence <span className="font-mono text-gray-600">{pct(r.confidence)}</span></span>
                    <span>{r.shap ? `${r.shap.contributions.length} SHAP` : ''}{r.shap && r.lime ? ' · ' : ''}{r.lime ? `${r.lime.rules.length} LIME` : ''}</span>
                    <span className="flex items-center gap-1"><Link2 className="w-3 h-3" />audit {(r.auditLogId ?? '').slice(0, 8)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── CONTRACT MATRIX ── */}
        <TabsContent value="contracts" className="space-y-4">
          <Card className="bg-gray-50/60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Scale className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Each automated decision type carries a framework contract: the minimum explanation method, feature
                  attribution depth, latency ceiling, retention period and whether a human must counter-sign. An
                  explanation that fails its contract is <strong>still recorded</strong> — it is flagged, not suppressed.
                </p>
              </div>
            </CardContent>
          </Card>

          {contractsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-teal-500" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(contracts?.matrix ?? []).map((c) => (
                <Card key={c.subjectType} className={cn('border-l-4', c.violating > 0 ? 'border-l-red-400' : 'border-l-emerald-400')}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{c.label}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{c.subjectType}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="secondary" className={cn('text-[10px] capitalize', RISK_TONES[c.riskTier])}>{c.riskTier}</Badge>
                        <Badge variant="secondary" className={cn('text-[10px]', c.violating > 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700')}>
                          {pct(c.complianceRate)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Method', value: c.requiredMethod },
                        { label: 'Min features', value: String(c.minFeatures) },
                        { label: 'Latency cap', value: `${c.maxLatencyMs}ms` },
                        { label: 'Retention', value: `${c.retentionDays}d` },
                      ].map((m) => (
                        <div key={m.label} className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-xs font-semibold text-gray-800 font-mono truncate">{m.value}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { on: c.requiresHumanSummary, label: 'Human summary' },
                        { on: c.requiresAuditBinding, label: 'Audit-bound' },
                        { on: c.requiresHumanReview, label: 'Human counter-sign' },
                      ].map((f) => (
                        <Badge key={f.label} variant="outline" className={cn('text-[10px] gap-1', f.on ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-gray-50 text-gray-400 border-gray-200')}>
                          {f.on ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                          {f.label}
                        </Badge>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-gray-500">
                        {c.evaluated} evaluated · <span className="text-emerald-600 font-medium">{c.compliant} pass</span>
                        {c.violating > 0 && <> · <span className="text-red-600 font-medium">{c.violating} fail</span></>}
                      </span>
                      {c.lastEvaluatedAt && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> last {timeAgo(c.lastEvaluatedAt)}
                        </span>
                      )}
                    </div>

                    {c.topViolations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.topViolations.map((v) => (
                          <Badge key={v.rule} variant="secondary" className="text-[10px] bg-red-50 text-red-700 font-mono">
                            {v.rule} × {v.count}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── EXPLANATION DETAIL ── */}
      <Dialog open={openRecord !== null} onOpenChange={(open) => { if (!open) setOpenRecord(null) }}>
        <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
          {openRecord && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-teal-600" />
                  <span className="min-w-0">{openRecord.decision}</span>
                </DialogTitle>
                <DialogDescription className="font-mono text-[11px]">
                  {openRecord.subjectType} · {openRecord.subjectId} · {openRecord.modelId} · {openRecord.explainerVersion}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Outcome', value: openRecord.outcome.toFixed(4) },
                  { label: 'Confidence', value: pct(openRecord.confidence) },
                  { label: 'Method', value: openRecord.method },
                  { label: 'Explain time', value: `${openRecord.latencyMs}ms` },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-gray-900 font-mono truncate">{m.value}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className={cn('flex items-start gap-2 p-3 rounded-lg border', openRecord.contractCompliant ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100')}>
                {openRecord.contractCompliant
                  ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  : <ShieldAlert className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <p className={cn('text-xs font-medium', openRecord.contractCompliant ? 'text-emerald-800' : 'text-red-800')}>
                    {openRecord.contractCompliant ? 'Satisfied its framework contract' : 'Failed its framework contract'}
                  </p>
                  {openRecord.contractViolations.map((v: ContractViolation) => (
                    <p key={v.rule} className="text-[11px] text-red-700 mt-0.5 font-mono">{v.rule}: {v.detail}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-relaxed">{openRecord.humanSummary}</p>
              </div>

              {openRecord.shap && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ListTree className="w-3.5 h-3.5 text-gray-500" />
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">SHAP feature attribution</p>
                  </div>
                  <ShapWaterfall shap={openRecord.shap} />
                </div>
              )}

              {openRecord.lime && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3.5 h-3.5 text-gray-500" />
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">LIME local surrogate</p>
                  </div>
                  <LimeRules lime={openRecord.lime} />
                </div>
              )}

              <Separator />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reproduce(openRecord)}
                  disabled={reproResult.status === 'running'}
                >
                  {reproResult.status === 'running'
                    ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    : <RotateCcw className="w-3.5 h-3.5 mr-1.5" />}
                  Re-derive from source
                </Button>
                <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                  <Fingerprint className="w-3 h-3" /> audit {openRecord.auditLogId}
                </span>
              </div>

              {reproResult.status !== 'idle' && reproResult.status !== 'running' && (
                <div className={cn(
                  'flex items-start gap-2 p-3 rounded-lg border text-xs',
                  reproResult.status === 'match' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
                )}>
                  {reproResult.status === 'match' ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-medium">
                      {reproResult.status === 'match' ? 'Reproducible' : reproResult.status === 'mismatch' ? 'Not reproducible' : 'Re-derivation failed'}
                    </p>
                    <p className="mt-0.5">{reproResult.detail}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuditCenterPage
