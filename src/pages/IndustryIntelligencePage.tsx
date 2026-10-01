import { useMemo, useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { cn } from '@/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from 'recharts'
import {
  Factory, RefreshCw, Loader2, TrendingUp, TrendingDown, AlertTriangle, Target,
  Globe2, Layers, Radar, Search, Sparkles, DollarSign, Activity, ArrowUpRight,
  ArrowDownRight, ShieldAlert, Radio,
} from 'lucide-react'

interface SectorRow {
  sector: string
  count: number
  avgDemand: number
  avgCompetition: number
  marketSizeUsd: number
}

interface ProfileRow {
  id: string
  name: string
  slug: string
  sector: string
  demandIndex: number
  competitionIndex: number
  growthRatePct: number | null
  avgCplUsd: number | null
  topChannels: string[]
  signalCount: number
}

interface SignalRow {
  id: string
  type: string
  title: string
  summary: string | null
  magnitude: number
  confidence: number
  source: string | null
  observedAt: string
  industry: string
  sector: string | null
}

interface Overview {
  kpis: {
    profiles: number
    sectors: number
    addressableMarketUsd: number
    avgDemandIndex: number
    avgCompetitionIndex: number
    atRiskSectors: number
    fastestGrowing: { name: string; growthRatePct: number | null } | null
    activeSignals: number
  }
  sectors: SectorRow[]
  profiles: ProfileRow[]
  signals: SignalRow[]
}

interface ProfileDetail {
  id: string
  name: string
  slug: string
  sector: string
  description: string | null
  marketSizeUsd: number | null
  growthRatePct: number | null
  demandIndex: number
  competitionIndex: number
  avgCplUsd: number | null
  seasonality: string | null
  status: string
  topChannels: string[]
  keywordClusters: string[]
  contentStyles: string[]
  riskFlags: string[]
}

interface ProfileSummary extends ProfileDetail {
  signalCount: number
}

const SECTOR_COLORS = ['#10b981', '#14b8a6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1', '#84cc16']

const SORT_OPTIONS = [
  { value: 'demand', label: 'Sort: demand' },
  { value: 'competition', label: 'Sort: competition' },
  { value: 'growth', label: 'Sort: growth' },
  { value: 'cpl', label: 'Sort: lowest CPL' },
  { value: 'name', label: 'Sort: name' },
]

const SIGNAL_STYLES: Record<string, { chip: string; dot: string }> = {
  demand: { chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  seasonality: { chip: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  competition: { chip: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  cost: { chip: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  regulatory: { chip: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  creative: { chip: 'bg-pink-50 text-pink-700 border-pink-200', dot: 'bg-pink-500' },
}

function signalStyle(type: string) {
  return SIGNAL_STYLES[type] ?? { chip: 'bg-gray-50 text-gray-700 border-gray-200', dot: 'bg-gray-400' }
}

function formatUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'yesterday' : `${days}d ago`
}

function Meter({ label, value, tone }: { label: string; value: number; tone: 'emerald' | 'amber' }) {
  const bar = tone === 'emerald' ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-500'
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-800">{value.toFixed(0)}</span>
      </div>
      <Progress value={Math.min(100, value)} className={cn('h-1.5 bg-gray-100', bar)} />
    </div>
  )
}

function KpiTile({
  icon, label, value, sub, tone = 'gray',
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: React.ReactNode
  tone?: 'gray' | 'emerald' | 'amber' | 'blue' | 'violet'
}) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
  }
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', tones[tone])}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight mt-0.5">{value}</p>
            {sub && <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function IndustryIntelligencePage() {
  const [tab, setTab] = useState('overview')
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('')
  const [sort, setSort] = useState('demand')
  const [openId, setOpenId] = useState<string | null>(null)

  const { data, loading, error, refetch } = useFetch<Overview>('/industry/overview')
  const { data: listData, loading: listLoading } = useFetch<{ items: ProfileSummary[]; sectors: string[]; total: number }>(
    `/industry/profiles?q=${encodeURIComponent(q)}&sector=${encodeURIComponent(sector)}&sort=${sort}`,
    [q, sector, sort]
  )
  const { data: detail, loading: detailLoading } = useFetch<{ profile: ProfileDetail; signals: SignalRow[] }>(
    `/industry/profiles/${openId}`,
    [openId]
  )

  const kpis = data?.kpis
  const sectors = data?.sectors ?? []
  const profiles = data?.profiles ?? []
  const signals = data?.signals ?? []

  const chartData = useMemo(
    () => sectors.map((s) => ({ name: s.sector, market: Math.round(s.marketSizeUsd / 1e9), demand: s.avgDemand, competition: s.avgCompetition })),
    [sectors]
  )

  const watchlist = useMemo(
    () => [...profiles].sort((a, b) => (b.competitionIndex - b.demandIndex) - (a.competitionIndex - a.demandIndex)).slice(0, 4),
    [profiles]
  )

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Factory className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">Industry Intelligence</h1>
          <p className="text-sm text-gray-500">
            Layer 1 shared knowledge base — the demand, cost and competition context every other module reads from.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} /> Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Could not load industry data</p>
              <p className="text-red-700 text-xs mt-0.5">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiTile icon={<Layers className="w-4 h-4" />} label="Profiles" value={kpis ? String(kpis.profiles) : '—'} sub={kpis ? `${kpis.sectors} sectors` : undefined} />
        <KpiTile icon={<DollarSign className="w-4 h-4" />} label="Addressable" value={kpis ? formatUsd(kpis.addressableMarketUsd) : '—'} tone="emerald" />
        <KpiTile icon={<TrendingUp className="w-4 h-4" />} label="Avg demand" value={kpis ? kpis.avgDemandIndex.toFixed(1) : '—'} tone="blue" sub="index, 0–100" />
        <KpiTile icon={<Target className="w-4 h-4" />} label="Avg competition" value={kpis ? kpis.avgCompetitionIndex.toFixed(1) : '—'} tone="amber" sub="index, 0–100" />
        <KpiTile
          icon={<ShieldAlert className="w-4 h-4" />}
          label="At-risk profiles"
          value={kpis ? String(kpis.atRiskSectors) : '—'}
          tone={kpis && kpis.atRiskSectors > 0 ? 'violet' : 'gray'}
          sub="competition ≥ demand + 10"
        />
        <KpiTile
          icon={<Radio className="w-4 h-4" />}
          label="Live signals"
          value={kpis ? String(kpis.activeSignals) : '—'}
          sub={kpis?.fastestGrowing ? `fastest: ${kpis.fastestGrowing.name}` : undefined}
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview" className="text-xs"><Globe2 className="w-3.5 h-3.5 mr-1" /> Sector Overview</TabsTrigger>
          <TabsTrigger value="profiles" className="text-xs"><Factory className="w-3.5 h-3.5 mr-1" /> Profiles</TabsTrigger>
          <TabsTrigger value="signals" className="text-xs"><Activity className="w-3.5 h-3.5 mr-1" /> Signals</TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW ── */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Addressable market by sector</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
                ) : chartData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-sm text-gray-400">No sector data</div>
                ) : (
                  <div className="h-64 -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={52} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} unit="B" width={40} />
                        <RTooltip
                          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                          formatter={(v: number) => [`$${v}B`, 'Market size']}
                        />
                        <Bar dataKey="market" radius={[4, 4, 0, 0]}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Radar className="w-3.5 h-3.5 text-violet-500" /> Competitive watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {watchlist.length === 0 && <p className="text-xs text-gray-400 py-6 text-center">Nothing on the watchlist.</p>}
                {watchlist.map((p) => {
                  const gap = p.competitionIndex - p.demandIndex
                  const tight = gap >= 10
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className={cn('w-1.5 h-9 rounded-full flex-shrink-0', tight ? 'bg-violet-500' : 'bg-gray-200')} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-500">demand {p.demandIndex} · competition {p.competitionIndex}</p>
                      </div>
                      <Badge variant="secondary" className={cn('text-[10px] px-1.5 h-5 shrink-0', tight ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600')}>
                        {gap > 0 ? `+${gap}` : gap}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Sector scorecard</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table className="min-w-[560px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Sector</TableHead>
                      <TableHead className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Profiles</TableHead>
                      <TableHead className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Market</TableHead>
                      <TableHead className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Demand</TableHead>
                      <TableHead className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Competition</TableHead>
                      <TableHead className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Headroom</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectors.map((s) => {
                      const headroom = s.avgDemand - s.avgCompetition
                      return (
                        <TableRow key={s.sector} className="hover:bg-gray-50/60">
                          <TableCell className="font-medium text-gray-800">{s.sector}</TableCell>
                          <TableCell className="text-right text-gray-600 tabular-nums">{s.count}</TableCell>
                          <TableCell className="text-right text-gray-600 tabular-nums">{formatUsd(s.marketSizeUsd)}</TableCell>
                          <TableCell className="text-right tabular-nums font-medium text-emerald-600">{s.avgDemand.toFixed(1)}</TableCell>
                          <TableCell className="text-right tabular-nums font-medium text-amber-600">{s.avgCompetition.toFixed(1)}</TableCell>
                          <TableCell className="text-right">
                            <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums', headroom >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                              {headroom >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {headroom > 0 ? '+' : ''}{headroom.toFixed(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {sectors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-xs text-gray-400">No sectors yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PROFILES ── */}
        <TabsContent value="profiles" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search industries…" className="pl-9 h-9 text-sm" />
            </div>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="h-9 w-full sm:w-[180px] text-sm">
                <span className={cn('truncate', !sector && 'text-muted-foreground')}>{sector || 'All sectors'}</span>
              </SelectTrigger>
              <SelectContent className="max-h-72 overflow-y-auto">
                <SelectItem value="">All sectors</SelectItem>
                {(listData?.sectors ?? []).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-full sm:w-[180px] text-sm">
                <span className="truncate">{SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'}</span>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {listLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-emerald-500" /></div>
          ) : (listData?.items ?? []).length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-gray-400">No industries match this filter.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(listData?.items ?? []).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setOpenId(p.slug)}
                  className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 leading-snug">{p.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{p.sector}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 shrink-0">
                      {p.growthRatePct !== null ? `+${p.growthRatePct}%` : '—'}
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 min-h-[2rem]">{p.description}</p>

                  <div className="mt-3 space-y-2">
                    <Meter label="Demand" value={p.demandIndex} tone="emerald" />
                    <Meter label="Competition" value={p.competitionIndex} tone="amber" />
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>CPL {formatUsd(p.avgCplUsd)}</span>
                    <span>{formatUsd(p.marketSizeUsd)} TAM</span>
                    <span className="flex items-center gap-1"><Radio className="w-3 h-3" />{p.signalCount}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── SIGNALS ── */}
        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardContent className="p-0 divide-y divide-gray-100">
              {loading && <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>}
              {!loading && signals.length === 0 && <p className="p-8 text-center text-sm text-gray-400">No signals detected.</p>}
              {signals.map((s) => {
                const style = signalStyle(s.type)
                const positive = s.magnitude >= 0
                return (
                  <div key={s.id} className="p-4 flex items-start gap-3 hover:bg-gray-50/60">
                    <span className={cn('mt-1.5 w-2 h-2 rounded-full flex-shrink-0', style.dot)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={cn('text-[10px] px-1.5 h-5 capitalize', style.chip)}>{s.type}</Badge>
                        <span className="text-sm font-medium text-gray-800">{s.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{s.summary}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-gray-400">
                        <span className="text-gray-500">{s.industry}</span>
                        {s.source && <span>{s.source}</span>}
                        <span>{relativeTime(s.observedAt)}</span>
                        <span>confidence {(s.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className={cn('flex items-center gap-1 text-xs font-semibold tabular-nums shrink-0', positive ? 'text-emerald-600' : 'text-red-600')}>
                      {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {positive ? '+' : ''}{s.magnitude.toFixed(1)}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── PROFILE DETAIL ── */}
      <Dialog open={openId !== null} onOpenChange={(open) => { if (!open) setOpenId(null) }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {detailLoading || !detail ? (
            <div className="py-16 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-emerald-500" /></div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-emerald-600" />
                  {detail.profile.name}
                </DialogTitle>
                <DialogDescription>{detail.profile.description}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {[
                  { label: 'TAM', value: formatUsd(detail.profile.marketSizeUsd) },
                  { label: 'Growth', value: detail.profile.growthRatePct !== null ? `+${detail.profile.growthRatePct}%` : '—' },
                  { label: 'Demand', value: detail.profile.demandIndex.toFixed(0) },
                  { label: 'Avg CPL', value: formatUsd(detail.profile.avgCplUsd) },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-gray-900 tabular-nums">{m.value}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {detail.profile.seasonality && (
                <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">{detail.profile.seasonality}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[
                  { title: 'Top channels', items: detail.profile.topChannels, chip: 'bg-emerald-50 text-emerald-700' },
                  { title: 'Keyword clusters', items: detail.profile.keywordClusters, chip: 'bg-blue-50 text-blue-700' },
                  { title: 'Content styles', items: detail.profile.contentStyles, chip: 'bg-violet-50 text-violet-700' },
                  { title: 'Risk flags', items: detail.profile.riskFlags, chip: 'bg-amber-50 text-amber-700' },
                ].map((group) => (
                  <div key={group.title}>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{group.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.length === 0 && <span className="text-xs text-gray-400">None recorded</span>}
                      {group.items.map((item) => (
                        <Badge key={item} variant="secondary" className={cn('text-[10px] font-normal', group.chip)}>{item}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Signals ({detail.signals.length})
                </p>
                <div className="space-y-2">
                  {detail.signals.length === 0 && <p className="text-xs text-gray-400">No signals recorded for this industry.</p>}
                  {detail.signals.map((s) => {
                    const style = signalStyle(s.type)
                    return (
                      <div key={s.id} className="flex items-start gap-2.5 text-xs">
                        <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', style.dot)} />
                        <div className="min-w-0">
                          <p className="text-gray-800 font-medium">{s.title}</p>
                          <p className="text-gray-400 mt-0.5">{s.summary} · {relativeTime(s.observedAt)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IndustryIntelligencePage
