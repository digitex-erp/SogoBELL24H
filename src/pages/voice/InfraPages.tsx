import { useMemo, useState } from 'react'
import {
  AlertTriangle, Activity, ArrowDown, BadgeCheck, Bot, Boxes, CheckCircle2, CircleSlash,
  Cloud, Cpu, Database, Gauge, Globe, HardDrive, Headphones, Layers, Mic,
  Network, Play, Phone, PhoneCall, Radio, Server, Settings2, ShieldCheck, Signal,
  Sparkles, Star, Volume2, Wifi, Zap,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChipList, Dot, EmptyState, ErrorBlock, Field, KpiGrid, KpiTile, LoadingBlock, Meter,
  PageShell, Panel, RefreshButton, SimBanner, SimTag, StatusBadge, StatBlock, useToast,
  fmtNum, fmtPct, fmtWhen, simAction, useSimulation, useVoiceApi,
} from './shared'

/* ══════════════════════════════════════════════════════════
   VOICE INFRASTRUCTURE / TELEPHONY ARCHITECTURE — spec §14
   ══════════════════════════════════════════════════════════ */

const CATEGORY_META: Record<string, { label: string; icon: any; tone: string }> = {
  telephony: { label: 'Telephony', icon: Phone, tone: 'bg-emerald-50 text-emerald-600' },
  sip: { label: 'SIP', icon: Network, tone: 'bg-blue-50 text-blue-600' },
  stt: { label: 'Speech to text', icon: Mic, tone: 'bg-violet-50 text-violet-600' },
  tts: { label: 'Text to speech', icon: Volume2, tone: 'bg-teal-50 text-teal-600' },
  llm: { label: 'LLM', icon: Bot, tone: 'bg-violet-50 text-violet-600' },
  voice: { label: 'Voice', icon: Headphones, tone: 'bg-teal-50 text-teal-600' },
  recording: { label: 'Recording', icon: HardDrive, tone: 'bg-gray-100 text-gray-600' },
}

export function VoiceInfrastructure() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/architecture')
  const { simulate } = useSimulation()

  const layers: any[] = data?.layers ?? []
  const stack: any[] = data?.stack ?? []
  const numbers: any[] = data?.numbers ?? []
  const providerCounts: any[] = data?.providerCounts ?? []
  const integrationPoints: string[] = data?.integrationPoints ?? []

  return (
    <PageShell
      icon={<Server className="w-5 h-5 text-emerald-600" />}
      title="Voice Infrastructure"
      subtitle="The self-hosted Dograh-style stack this prototype is modelled on"
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      <SimBanner
        banner={
          data?.label
            ? `Self-hosted Dograh-style telephony stack. ${data.label}`
            : 'Self-hosted Dograh-style telephony stack — no SIP trunk, GSM gateway, carrier credential or phone number is contacted by this module.'
        }
      />

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock label="Reading the infrastructure model…" />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <Panel title="Telephony pipeline" subtitle="Commercial number down to the AI agent logic">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex flex-col items-center">
                {layers.map((l: any, i: number) => (
                  <div key={l.tier} className="w-full flex flex-col items-center">
                    <div className={cn('w-full rounded-xl border-2 bg-white p-3',
                      l.tone === 'emerald' ? 'border-emerald-200' :
                      l.tone === 'blue' ? 'border-blue-200' :
                      l.tone === 'violet' ? 'border-violet-200' :
                      l.tone === 'teal' ? 'border-teal-200' :
                      l.tone === 'amber' ? 'border-amber-200' : 'border-gray-200')}>
                      <div className="flex items-start gap-2.5">
                        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                          l.tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                          l.tone === 'blue' ? 'bg-blue-50 text-blue-600' :
                          l.tone === 'violet' ? 'bg-violet-50 text-violet-600' :
                          l.tone === 'teal' ? 'bg-teal-50 text-teal-600' :
                          l.tone === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600')}>
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Tier {l.tier}</span>
                            {l.simulated && <SimTag />}
                          </div>
                          <p className="text-xs font-semibold text-gray-900 mt-0.5">{l.label}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{l.detail}</p>
                        </div>
                      </div>
                    </div>
                    {i < layers.length - 1 && <ArrowDown className="w-4 h-4 text-gray-300 my-1.5" />}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Panel title="Self-hosted voice server" subtitle="Components running inside the box">
            <div className="space-y-2">
              {stack.map((s: any) => (
                <div key={s.name} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100 bg-gray-50/60">
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-900">{s.name}</p>
                      <StatusBadge status={s.state} />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{s.role}</p>
                    {s.note && <p className="text-[10px] text-gray-400 mt-0.5">{s.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Provider coverage" subtitle="How many providers exist per layer">
            <div className="space-y-2.5">
              {providerCounts.map((p: any) => {
                const meta = CATEGORY_META[String(p.category ?? '').toLowerCase()]
                const Icon = meta?.icon ?? Server
                return (
                  <div key={p.category} className="flex items-center gap-2.5">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', meta?.tone ?? 'bg-gray-100 text-gray-600')}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-gray-700 flex-1 capitalize">{meta?.label ?? p.category}</span>
                    <span className="text-xs font-semibold tabular-nums text-gray-900">{p.count}</span>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="Integration points" subtitle="Where voice becomes a business event">
            <ChipList items={integrationPoints} tone="emerald" />
            <Button size="sm" variant="outline" className="mt-3 w-full"
              onClick={() => simulate('Topology exported', 'The architecture diagram would be exported as the implementation specification.')}>
              Export specification
            </Button>
          </Panel>
        </div>
      </div>

      <Panel title="Numbers on file" subtitle={`${numbers.length} trunk / number records — all simulated`}>
        <NumberTable numbers={numbers} />
      </Panel>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   PROVIDERS — spec §15 (+ STT/TTS + AI models split)
   ══════════════════════════════════════════════════════════ */

function ProviderCard({ p, onAct }: { p: any; onAct: (action: string, payload: any) => void }) {
  const meta = CATEGORY_META[String(p.category ?? '').toLowerCase()]
  const Icon = meta?.icon ?? Server
  const healthTone = p.health >= 90 ? 'emerald' : p.health >= 70 ? 'amber' : 'red'

  return (
    <Card className={cn(p.status === 'disabled' && 'opacity-60')}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', meta?.tone ?? 'bg-gray-100 text-gray-600')}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-semibold text-gray-900">{p.name}</p>
              {p.isDefault && <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-50 text-emerald-700"><Star className="w-2.5 h-2.5 mr-0.5" />default</Badge>}
              {p.isFallback && <Badge variant="secondary" className="text-[10px] h-5 bg-blue-50 text-blue-700">fallback</Badge>}
            </div>
            <p className="text-[11px] text-gray-500">{p.vendor} · {meta?.label ?? p.category}</p>
          </div>
          <StatusBadge status={p.status} dot />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatBlock value={`${p.latencyMs}ms`} label="Latency" />
          <StatBlock value={`$${p.costPerUnit}`} label={p.costUnit ?? 'per unit'} />
          <StatBlock value={`${p.health}%`} label="Health" />
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-500">Health score</span>
            <span className="tabular-nums text-gray-700">{p.health}/100</span>
          </div>
          <Meter value={p.health} tone={healthTone as any} />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => onAct('test_provider', { key: p.key })}>
            <Activity className="w-3 h-3 mr-1" />Test
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => onAct('set_default_provider', { key: p.key })} disabled={p.isDefault}>
            <Star className="w-3 h-3 mr-1" />Set default
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-[11px]"
            onClick={() => onAct('set_provider_status', { key: p.key, status: p.status === 'disabled' ? 'enabled' : 'disabled' })}>
            {p.status === 'disabled' ? 'Enable' : 'Disable'}
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-[11px]"
            onClick={() => onAct('set_provider_status', { key: p.key, status: 'degraded', fallback: true })}>
            Fallback
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function VoiceProvidersPage({ mode = 'all' }: { mode?: 'all' | 'speech' | 'llm' }) {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/providers')
  const { simulate } = useSimulation()

  const providers: any[] = data?.providers ?? []
  // The catalogue returns categories in display casing ("STT", "LLM"), so every
  // comparison and meta lookup goes through a lowercased key.
  const filtered = useMemo(() => {
    const cat = (p: any) => String(p?.category ?? '').toLowerCase()
    if (mode === 'speech') return providers.filter((p: any) => ['stt', 'tts', 'voice'].includes(cat(p)))
    if (mode === 'llm') return providers.filter((p: any) => cat(p) === 'llm')
    return providers
  }, [providers, mode])

  const act = async (action: string, payload: any) => {
    try {
      const res = await simAction(action, payload)
      simulate(res?.message ?? 'Action simulated', res?.detail)
      refetch()
    } catch (e: any) {
      simulate('Action failed', e?.message)
    }
  }

  const title = mode === 'speech' ? 'STT / TTS Providers' : mode === 'llm' ? 'AI Models' : 'Voice Providers'
  const subtitle = mode === 'speech'
    ? 'Speech-to-text, text-to-speech and voice synthesis engines available to the agents'
    : mode === 'llm'
      ? 'Language models that drive agent reasoning — routed through the AI Router'
      : 'Every telephony, SIP, speech, voice and recording provider in one place'

  return (
    <PageShell
      icon={<Boxes className="w-5 h-5 text-emerald-600" />}
      title={title}
      subtitle={subtitle}
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      <SimBanner banner={data?.banner} />

      <KpiGrid cols={4}>
        <KpiTile label="Providers" value={fmtNum(filtered.length)} caption={mode === 'all' ? `${(data?.categories ?? []).length} categories` : `filtered from ${providers.length}`} icon={<Boxes className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Enabled" value={fmtNum(filtered.filter((p: any) => p.status !== 'disabled').length)} icon={<BadgeCheck className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Degraded" value={fmtNum(filtered.filter((p: any) => p.status === 'degraded').length)} icon={<AlertTriangle className="w-4 h-4" />} tone="amber" />
        <KpiTile label="Avg latency" value={`${Math.round(filtered.reduce((s: number, p: any) => s + (p.latencyMs ?? 0), 0) / (filtered.length || 1))}ms`} icon={<Gauge className="w-4 h-4" />} tone="blue" />
      </KpiGrid>

      {data?.noCredentialsRequired && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-emerald-800">No credentials are required in the prototype. Provider configuration, health and cost figures are simulated catalogue data.</p>
        </div>
      )}

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      {mode === 'all' && (data?.categories ?? []).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(data?.categories ?? []).map((c: any) => {
            const meta = CATEGORY_META[String(c.category ?? '').toLowerCase()]
            const Icon = meta?.icon ?? Server
            return (
              <Card key={c.category}>
                <CardContent className="p-3">
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-2', meta?.tone ?? 'bg-gray-100 text-gray-600')}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{meta?.label ?? c.category}</p>
                  <p className="text-lg font-bold text-gray-900 tabular-nums">{c.total}</p>
                  <p className="text-[10px] text-gray-500">{c.enabled} enabled · {c.degraded} degraded</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p: any) => <ProviderCard key={p.key} p={p} onAct={act} />)}
      </div>

      {mode === 'llm' && (
        <Panel title="AI Router integration" subtitle="How the agent's LLM call is dispatched">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { label: '1. Circuit breaker', detail: 'Unhealthy providers are skipped' },
              { label: '2. Budget check', detail: 'Daily spend ceiling enforced per org' },
              { label: '3. Provider pick', detail: 'Cheapest healthy model that meets the need' },
              { label: '4. Telemetry', detail: 'Latency, cost and outcome logged' },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[11px] font-semibold text-gray-800">{s.label}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   VOICE LIBRARY — spec §16
   ══════════════════════════════════════════════════════════ */

export function VoiceLibrary() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/voices')
  const { simulate } = useSimulation()
  const [lang, setLang] = useState('all')
  const [gender, setGender] = useState('all')
  const [q, setQ] = useState('')

  const voices: any[] = data?.voices ?? []
  const languages: any[] = data?.languages ?? []
  const filtered = voices.filter((v: any) =>
    (lang === 'all' || v.language === lang) &&
    (gender === 'all' || v.gender === gender) &&
    (!q.trim() || [v.name, v.provider, v.style].some((s: string) => String(s ?? '').toLowerCase().includes(q.toLowerCase()))))

  const act = async (action: string, payload: any) => {
    try {
      const res = await simAction(action, payload)
      simulate(res?.message ?? 'Action simulated', res?.detail)
      refetch()
    } catch (e: any) {
      simulate('Action failed', e?.message)
    }
  }

  return (
    <PageShell
      icon={<Headphones className="w-5 h-5 text-emerald-600" />}
      title="Voice Library"
      subtitle="Demo voice catalogue across Indian languages — no synthesis provider is contacted"
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      <SimBanner banner={data?.disclaimer ?? 'Demo voices only. Availability at any real provider is not claimed.'} />

      <KpiGrid cols={4}>
        <KpiTile label="Voices" value={fmtNum(voices.length)} icon={<Headphones className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Languages" value={fmtNum(languages.length)} caption={languages.slice(0, 3).map((l: any) => l.short ?? l.code).join(' · ')} icon={<Globe className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Female" value={fmtNum(voices.filter((v: any) => v.gender === 'female').length)} icon={<Mic className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Male" value={fmtNum(voices.filter((v: any) => v.gender === 'male').length)} icon={<Mic className="w-4 h-4" />} tone="teal" />
      </KpiGrid>

      <div className="flex flex-wrap items-center gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search voice, provider or style…" className="h-9 text-sm max-w-xs" />
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="h-9 w-[170px] text-xs"><SelectValue placeholder="Language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {languages.map((l: any) => <SelectItem key={l.code} value={l.code}>{l.label} ({l.short ?? l.code})</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="h-9 w-[130px] text-xs"><SelectValue placeholder="Gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All voices</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="male">Male</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((v: any) => (
          <Card key={v.key}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  v.gender === 'female' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600')}>
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">{v.name}</p>
                    {v.isDefault && <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-gray-500">{v.languageLabel ?? v.language} · {v.accent}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px] h-5 bg-gray-100 text-gray-600 capitalize">{v.gender}</Badge>
                <Badge variant="secondary" className="text-[10px] h-5 bg-violet-50 text-violet-700">{v.style}</Badge>
                <Badge variant="secondary" className="text-[10px] h-5 bg-teal-50 text-teal-700">{v.provider}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatBlock value={v.speed?.toFixed?.(2) ?? v.speed} label="Speed" />
                <StatBlock value={v.pitch?.toFixed?.(2) ?? v.pitch} label="Pitch" />
              </div>

              <div className="flex gap-1.5 pt-2 border-t border-gray-100">
                <Button size="sm" variant="outline" className="h-7 text-[11px] flex-1"
                  onClick={() => simulate('Sample played (simulated)', `${v.name} (${v.provider}) would speak a demo line. No audio is synthesised in the prototype.`)}>
                  <Play className="w-3 h-3 mr-1" />Sample
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] flex-1" disabled={v.isDefault}
                  onClick={() => act('set_default_voice', { key: v.key })}>
                  <Star className="w-3 h-3 mr-1" />Default
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <Panel title="No voices match"><EmptyState icon={<Headphones className="w-5 h-5" />} title="Nothing matched those filters" /></Panel>
      )}
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   PHONE NUMBERS
   ══════════════════════════════════════════════════════════ */

function NumberTable({ numbers }: { numbers: any[] }) {
  if (!numbers.length) return <EmptyState icon={<Phone className="w-5 h-5" />} title="No numbers configured" />
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[860px]">
        <TableHeader>
          <TableRow>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Label</TableHead>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Number</TableHead>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Channel</TableHead>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Provider</TableHead>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Region</TableHead>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Assigned to</TableHead>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Capacity</TableHead>
            <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {numbers.map((n) => (
            <TableRow key={n.id} className="hover:bg-gray-50/60">
              <TableCell className="text-xs font-medium text-gray-900">{n.label}</TableCell>
              <TableCell className="text-xs font-mono text-gray-700">{n.masked}</TableCell>
              <TableCell className="text-xs text-gray-600 capitalize">{n.channel}</TableCell>
              <TableCell className="text-xs text-gray-600">{n.provider}</TableCell>
              <TableCell className="text-xs text-gray-600">{n.region}</TableCell>
              <TableCell className="text-xs text-gray-600">{n.assignedTo}</TableCell>
              <TableCell className="text-xs tabular-nums text-gray-700">{n.capacity}</TableCell>
              <TableCell><StatusBadge status={n.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function PhoneNumbersPage() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/numbers')
  const { simulate } = useSimulation()
  const numbers: any[] = data?.numbers ?? []

  return (
    <PageShell
      icon={<Phone className="w-5 h-5 text-emerald-600" />}
      title="Phone Numbers"
      subtitle="SIP lines, virtual numbers and short codes assigned to agents"
      actions={
        <>
          <Button size="sm" onClick={() => simulate('Number requested', 'In production this would provision a virtual number from the configured carrier. The prototype stores nothing.')}>
            <Phone className="w-3.5 h-3.5 mr-1.5" />Request number
          </Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      <SimBanner banner={data?.banner} />
      <KpiGrid cols={4}>
        <KpiTile label="Numbers" value={fmtNum(numbers.length)} icon={<Phone className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Active" value={fmtNum(numbers.filter((n: any) => n.status === 'active').length)} icon={<CheckCircle2 className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Total capacity" value={fmtNum(numbers.reduce((s: number, n: any) => s + (n.capacity ?? 0), 0))} caption="Concurrent channels" icon={<Signal className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Regions" value={fmtNum(new Set(numbers.map((n: any) => n.region)).size)} icon={<Globe className="w-4 h-4" />} tone="teal" />
      </KpiGrid>
      {error && <ErrorBlock error={error} onRetry={refetch} />}
      <Panel title="Number register" subtitle="All identifiers are masked">
        {loading && !data ? <LoadingBlock /> : <NumberTable numbers={numbers} />}
      </Panel>
    </PageShell>
  )
}
