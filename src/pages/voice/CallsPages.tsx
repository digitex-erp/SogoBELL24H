import { useMemo, useState } from 'react'
import {
  ArrowDownLeft, ArrowUpRight, Bot, CalendarClock, ChevronRight, Clock, Copy, Download,
  FileText, Filter, Headphones, Layers, MessageSquare, Mic, MicOff, Pause, PhoneCall,
  PhoneForwarded, PhoneIncoming, PhoneOff, PhoneOutgoing, Play, Radio, Search,
  ShieldAlert, Sparkles, Target, Volume2, Zap,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  EmptyState, ErrorBlock, Field, KpiGrid, KpiTile, LoadingBlock, Meter, PageShell,
  Panel, RefreshButton, SimBanner, SimTag, StatusBadge, StatBlock, useToast,
  fmtDuration, fmtMoney, fmtNum, fmtPct, fmtTime, fmtWhen, useSimulation, useVoiceApi,
} from './shared'

const SPEAKER_STYLE: Record<string, { bubble: string; label: string; align: string }> = {
  ai: { bubble: 'bg-violet-50 border-violet-100 text-violet-900', label: 'AI agent', align: 'items-start' },
  agent: { bubble: 'bg-violet-50 border-violet-100 text-violet-900', label: 'AI agent', align: 'items-start' },
  contact: { bubble: 'bg-gray-50 border-gray-200 text-gray-800', label: 'Contact', align: 'items-start' },
  human: { bubble: 'bg-white border-gray-200 text-gray-800', label: 'Contact', align: 'items-start' },
  founder: { bubble: 'bg-emerald-50 border-emerald-100 text-emerald-900', label: 'Founder', align: 'items-start' },
  system: { bubble: 'bg-amber-50 border-amber-100 text-amber-900', label: 'System', align: 'items-start' },
}

/* ══════════════════════════════════════════════════════════
   LIVE CALLS — spec §5
   ══════════════════════════════════════════════════════════ */

export function LiveCalls({ onOpenCall }: { onOpenCall: (ref: string) => void }) {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/live')
  const { simulate } = useSimulation()
  const calls: any[] = data?.calls ?? []

  return (
    <PageShell
      icon={<Radio className="w-5 h-5 text-red-500" />}
      title="Live Calls"
      subtitle="Monitor, whisper, pause, take over or transfer any in-progress AI conversation"
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      <SimBanner banner={data?.banner} engine={data?.engine} />

      <KpiGrid cols={4}>
        <KpiTile label="Live calls" value={fmtNum(calls.length)} icon={<Radio className="w-4 h-4" />} tone="red" />
        <KpiTile label="Queue calling" value={fmtNum(data?.queueCalling)} icon={<Layers className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Engine ticks" value={fmtNum(data?.engine?.ticks)} icon={<Zap className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Calls placed" value={fmtNum(data?.engine?.placed)} caption="In this simulated session" icon={<PhoneCall className="w-4 h-4" />} tone="emerald" />
      </KpiGrid>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock label="Reading the live call bridge…" />}

      {!loading && calls.length === 0 && (
        <Panel title="No live calls" subtitle="The simulated engine places a call every few seconds while a campaign runs">
          <EmptyState icon={<Headphones className="w-5 h-5" />} title="Bridge is quiet"
            hint="Start or resume a campaign in Campaigns to watch the state machine place simulated calls." />
        </Panel>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {calls.map((c: any) => {
          const conf = Math.round((c.confidence ?? 0) * 100)
          return (
            <Card key={c.id} className="border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50/60 border-b border-red-100">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-bold text-red-700 tracking-wide">LIVE</span>
                <span className="text-[11px] font-mono text-gray-500">{c.ref}</span>
                <StatusBadge status={c.state ?? 'speaking'} label={c.state ?? 'speaking'} />
                <span className="ml-auto text-xs font-bold text-gray-900 tabular-nums">{fmtDuration(c.durationSec)}</span>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {c.direction === 'inbound' ? <PhoneIncoming className="w-4 h-4 text-blue-600" /> : <PhoneOutgoing className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{c.contactName}</p>
                    <p className="text-[11px] text-gray-500">{c.contactRole} · {c.company}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] h-5 bg-gray-100 text-gray-600 capitalize">{c.entityType}</Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <Field label="Phone" value={c.phoneMasked} mono />
                  <Field label="Direction" value={<span className="capitalize">{c.direction}</span>} />
                  <Field label="Agent" value={c.agentKey?.replace(/_/g, ' ')} />
                  <Field label="Intent" value={c.intent} />
                  <Field label="Sentiment" value={<span className="capitalize">{c.sentiment}</span>} />
                  <Field label="Attempt" value={`#${c.attempt}`} />
                </div>

                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Current objective</p>
                  <p className="text-xs text-gray-800 mt-0.5">{c.objective}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-gray-500">Agent confidence</span>
                    <span className="font-semibold tabular-nums text-gray-900">{conf}%</span>
                  </div>
                  <Meter value={conf} tone={conf < 60 ? 'red' : conf < 75 ? 'amber' : 'emerald'} />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => simulate('Monitor joined', `You are now silently monitoring ${c.ref} with ${c.contactName}.`)}>
                    <Volume2 className="w-3 h-3 mr-1" /> Monitor
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => simulate('Whisper sent', `A private whisper was queued to the AI agent on ${c.ref}. The contact cannot hear it.`)}>
                    <Mic className="w-3 h-3 mr-1" /> Whisper
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => simulate('Agent paused', `The AI agent on ${c.ref} is paused. The contact is hearing a hold tone.`)}>
                    <Pause className="w-3 h-3 mr-1" /> Pause
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => simulate('Founder took over', `You are now speaking live on ${c.ref}. The AI agent has stepped back.`)}>
                    <Headphones className="w-3 h-3 mr-1" /> Take over
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => simulate('Transfer requested', `${c.ref} was handed to a human queue member.`)}>
                    <PhoneForwarded className="w-3 h-3 mr-1" /> Transfer
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px] text-red-600 hover:bg-red-50" onClick={() => simulate('Call ended', `${c.ref} was ended by the founder. Outcome recorded to CRM as a simulated activity.`)}>
                    <PhoneOff className="w-3 h-3 mr-1" /> End
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-[11px] ml-auto" onClick={() => onOpenCall(c.ref)}>
                    Transcript <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   CALL QUEUE — spec §13
   ══════════════════════════════════════════════════════════ */

export function CallQueue() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/queue')
  const [view, setView] = useState('board')
  const [q, setQ] = useState('')
  const { simulate } = useSimulation()

  const columns: any[] = data?.columns ?? []
  const jobs = useMemo(() => {
    const all: any[] = data?.jobs ?? []
    if (!q.trim()) return all
    const needle = q.toLowerCase()
    return all.filter((j: any) =>
      [j.contactName, j.company, j.ref, j.campaignCode, j.agentName, j.status].some((v) => String(v ?? '').toLowerCase().includes(needle)))
  }, [data, q])

  const byStatus = (status: string) => jobs.filter((j: any) => j.status === status)

  return (
    <PageShell
      icon={<Layers className="w-5 h-5 text-emerald-600" />}
      title="Call Queue"
      subtitle="Every simulated calling job and the state it currently sits in"
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      <SimBanner banner={data?.banner} engine={data?.engine} />

      <KpiGrid cols={4}>
        <KpiTile label="Total jobs" value={fmtNum(data?.jobs?.length)} icon={<Layers className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Calling now" value={fmtNum(columns.find((c: any) => c.key === 'calling')?.count)} icon={<PhoneCall className="w-4 h-4" />} tone="red" />
        <KpiTile label="Callbacks" value={fmtNum(columns.find((c: any) => c.key === 'callback')?.count)} icon={<CalendarClock className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Failed" value={fmtNum(columns.find((c: any) => c.key === 'failed')?.count)} icon={<ShieldAlert className="w-4 h-4" />} tone="red" />
      </KpiGrid>

      {error && <ErrorBlock error={error} onRetry={refetch} />}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search contact, company, campaign or ref…" className="pl-9 h-9 text-sm" />
        </div>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="board" className="text-xs">Board</TabsTrigger>
            <TabsTrigger value="table" className="text-xs">Table</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button size="sm" variant="outline" onClick={() => simulate('Queue drained', 'The simulated worker processed the next pending jobs in the queue.')}>
          <Zap className="w-3.5 h-3.5 mr-1.5" /> Process next
        </Button>
      </div>

      {loading && !data && <LoadingBlock />}

      {view === 'board' ? (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {columns.map((col: any) => {
              const items = byStatus(col.key)
              return (
                <div key={col.key} className="w-[240px] flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">{col.label}</p>
                    <Badge variant="secondary" className="text-[10px] h-4 bg-gray-100 text-gray-600">{items.length}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[120px] p-2 rounded-lg bg-gray-50/80 border border-gray-100">
                    {items.length === 0 && <p className="text-[11px] text-gray-400 text-center py-4">Empty</p>}
                    {items.map((j: any) => (
                      <Card key={j.id} className="p-2.5 shadow-none border-gray-200">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 truncate">{j.contactName}</p>
                            <p className="text-[10px] text-gray-500 truncate">{j.company}</p>
                          </div>
                          <StatusBadge status={j.priority} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] font-mono text-gray-400">{j.ref}</span>
                          <span className="text-[10px] text-gray-400">· att {j.attempt}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{j.agentName}</p>
                        {j.nextAction && <p className="text-[10px] text-emerald-600 mt-0.5 line-clamp-1">{j.nextAction}</p>}
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <Panel title="Queue jobs" subtitle={`${jobs.length} of ${data?.jobs?.length ?? 0} jobs`}>
          <div className="overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Ref</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Contact</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Campaign</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Agent</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Priority</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Attempt</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Scheduled</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Next action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.slice(0, 120).map((j: any) => (
                  <TableRow key={j.id} className="hover:bg-gray-50/60">
                    <TableCell className="text-[11px] font-mono text-gray-500">{j.ref}</TableCell>
                    <TableCell>
                      <p className="text-xs font-medium text-gray-900">{j.contactName}</p>
                      <p className="text-[11px] text-gray-500">{j.company}</p>
                    </TableCell>
                    <TableCell className="text-[11px] font-mono text-gray-500">{j.campaignCode ?? '—'}</TableCell>
                    <TableCell className="text-xs text-gray-700">{j.agentName}</TableCell>
                    <TableCell><StatusBadge status={j.priority} /></TableCell>
                    <TableCell className="text-xs tabular-nums text-gray-700">#{j.attempt}</TableCell>
                    <TableCell><StatusBadge status={j.status} /></TableCell>
                    <TableCell className="text-[11px] text-gray-500">{fmtWhen(j.scheduledFor)}</TableCell>
                    <TableCell className="text-[11px] text-gray-600">{j.nextAction ?? j.reason ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>
      )}
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   CALL HISTORY — spec §26 item 5
   ══════════════════════════════════════════════════════════ */

export function CallHistory({ onOpenCall }: { onOpenCall: (ref: string) => void }) {
  const [direction, setDirection] = useState('all')
  const [status, setStatus] = useState('all')
  const [intent, setIntent] = useState('all')
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState('60')

  // The API treats a present filter as an exact match, so "all" must be omitted
  // rather than sent literally (sending intent=all matched zero rows).
  const path = useMemo(() => {
    const qs = new URLSearchParams()
    if (direction !== 'all') qs.set('direction', direction)
    if (status !== 'all') qs.set('status', status)
    if (intent !== 'all') qs.set('intent', intent)
    qs.set('limit', limit)
    if (q.trim()) qs.set('q', q.trim())
    return `/voice/calls?${qs.toString()}`
  }, [direction, status, intent, limit, q])
  const { data, loading, error, refetch } = useVoiceApi<any>(path)
  const { simulate, node } = useToastSafe()
  const calls: any[] = data?.calls ?? []
  const facets: any = data?.facets ?? { directions: [], statuses: [], intents: [] }

  const exportCsv = () => {
    simulate('CSV export simulated', `A CSV of ${calls.length} call records would be downloaded in production.`)
  }

  return (
    <PageShell
      icon={<Clock className="w-5 h-5 text-emerald-600" />}
      title="Call History"
      subtitle="Every completed, failed and escalated simulated conversation"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-3.5 h-3.5 mr-1.5" />Export</Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      {node}
      <SimBanner banner={data?.banner} engine={data?.engine} />
      <KpiGrid cols={4}>
        <KpiTile label="Matching calls" value={fmtNum(data?.total)} icon={<PhoneCall className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Shown" value={fmtNum(calls.length)} caption={`limit ${limit}`} icon={<FileText className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Completed" value={fmtNum(calls.filter((c: any) => c.status === 'completed').length)} icon={<Target className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Escalated" value={fmtNum(calls.filter((c: any) => c.status === 'escalated').length)} icon={<ShieldAlert className="w-4 h-4" />} tone="amber" />
      </KpiGrid>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, company, RFQ or ref…" className="pl-9 h-9 text-sm" />
        </div>
        <Select value={direction} onValueChange={setDirection}>
          <SelectTrigger className="h-9 w-[130px] text-xs"><SelectValue placeholder="Direction" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All directions</SelectItem>
            {facets.directions.map((d: string) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {facets.statuses.map((s: string) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={intent} onValueChange={setIntent}>
          <SelectTrigger className="h-9 w-[170px] text-xs"><SelectValue placeholder="Intent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All intents</SelectItem>
            {facets.intents.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={limit} onValueChange={setLimit}>
          <SelectTrigger className="h-9 w-[110px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {['30', '60', '120', '250'].map((l) => <SelectItem key={l} value={l}>Show {l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      <Panel title="Call records" subtitle={`${calls.length} records — click any row to open the full transcript`}>
        {calls.length === 0 && !loading ? (
          <EmptyState icon={<PhoneCall className="w-5 h-5" />} title="No calls match those filters" />
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Ref</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Contact</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Dir</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Intent</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Sentiment</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Duration</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Conf.</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Quote</TableHead>
                  <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((c: any) => (
                  <TableRow key={c.id} className="hover:bg-gray-50/60 cursor-pointer" onClick={() => onOpenCall(c.ref)}>
                    <TableCell className="text-[11px] font-mono text-gray-500">{c.ref}</TableCell>
                    <TableCell>
                      <p className="text-xs font-medium text-gray-900">{c.contactName}</p>
                      <p className="text-[11px] text-gray-500">{c.company}</p>
                    </TableCell>
                    <TableCell>
                      {c.direction === 'inbound'
                        ? <ArrowDownLeft className="w-3.5 h-3.5 text-blue-500" />
                        : <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700">{c.intent ?? '—'}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-xs text-gray-600 capitalize">{c.sentiment ?? '—'}</TableCell>
                    <TableCell className="text-xs tabular-nums text-gray-700">{fmtDuration(c.durationSec)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-gray-700">{Math.round((c.confidence ?? 0) * 100)}%</TableCell>
                    <TableCell className="text-xs tabular-nums text-gray-700">{c.quoteAmount ? fmtMoney(c.quoteAmount) : '—'}</TableCell>
                    <TableCell className="text-[11px] text-gray-500">{fmtWhen(c.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>
    </PageShell>
  )
}

function useToastSafe() {
  const { simulate } = useSimulation()
  return { simulate, node: null as any }
}

/* ══════════════════════════════════════════════════════════
   CONVERSATION DETAIL / TRANSCRIPT — spec §10
   ══════════════════════════════════════════════════════════ */

export function ConversationDetail({ callRef, onBack, onNavigate }: { callRef: string | null; onBack: () => void; onNavigate: (p: string) => void }) {
  const { data, loading, error, refetch } = useVoiceApi<any>(callRef ? `/voice/calls/${callRef}` : null, [callRef])
  const { simulate } = useSimulation()
  const [tab, setTab] = useState('transcript')

  if (!callRef) {
    return (
      <PageShell icon={<Mic className="w-5 h-5 text-emerald-600" />} title="Conversation Detail" subtitle="Open a call from history, live calls or the queue">
        <Panel title="No conversation selected">
          <EmptyState icon={<Mic className="w-5 h-5" />} title="Pick a call to open its transcript"
            hint="Transcript, AI-extracted data, the agent that ran it, the script used and the unified timeline all appear here." />
          <div className="flex justify-center gap-2 mt-2">
            <Button size="sm" onClick={() => onNavigate('voice-history')}>Call history</Button>
            <Button size="sm" variant="outline" onClick={() => onNavigate('voice-live')}>Live calls</Button>
          </div>
        </Panel>
      </PageShell>
    )
  }

  if (loading && !data) return <PageShell icon={<Mic className="w-5 h-5 text-emerald-600" />} title={`Conversation ${callRef}`} subtitle="Loading transcript…"><LoadingBlock /></PageShell>
  if (error) return <PageShell icon={<Mic className="w-5 h-5 text-emerald-600" />} title={`Conversation ${callRef}`} subtitle="Transcript"><ErrorBlock error={error} onRetry={refetch} /></PageShell>

  const call: Record<string, any> = data?.call ?? {}
  const messages: any[] = data?.messages ?? []
  const extracted: any = data?.extracted ?? null
  const agent: any = data?.agent
  const script: any = data?.script
  const timeline: any[] = data?.timeline ?? []
  const conf = Math.round((call.confidence ?? 0) * 100)

  const extractedRows = extracted ? [
    ['Quantity', extracted.quantity],
    ['Price', extracted.price],
    ['Delivery', extracted.delivery_days ? `${extracted.delivery_days} days` : null],
    ['Availability', extracted.availability],
    ['MOQ', extracted.moq],
    ['Payment terms', extracted.payment_terms],
    ['Location', extracted.location],
    ['GST verified', extracted.gst_verified === true ? 'Yes' : extracted.gst_verified === false ? 'No' : extracted.gst_verified],
    ['Confidence', extracted.confidence ? `${Math.round(extracted.confidence * 100)}%` : null],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '') : []

  return (
    <PageShell
      icon={<Mic className="w-5 h-5 text-emerald-600" />}
      title={`Conversation ${call.ref ?? callRef}`}
      subtitle={`${call.contactName ?? ''} · ${call.company ?? ''} · ${call.contactRole ?? ''}`}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      <SimBanner banner={call.banner} engine={call.engine} />
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={call.status} />
        <StatusBadge status={call.direction} label={call.direction} />
        <Badge variant="secondary" className="text-[10px] h-5 bg-gray-100 text-gray-600 capitalize">{call.entityType}</Badge>
        <SimTag text="RECORDING SIMULATED" />
        <span className="text-[11px] text-gray-500 ml-auto">{fmtDuration(call.durationSec)} · {Math.round((call.confidence ?? 0) * 100)}% confidence · {fmtWhen(call.createdAt)}</span>
      </div>

      <KpiGrid cols={4}>
        <KpiTile label="Intent" value={<span className="text-sm">{call.intent ?? '—'}</span>} icon={<Target className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Outcome" value={<span className="text-sm">{call.outcome ?? '—'}</span>} icon={<Sparkles className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Quote recorded" value={call.quoteAmount ? fmtMoney(call.quoteAmount) : '—'} caption={call.rfqNumber ?? 'No RFQ linked'} icon={<FileText className="w-4 h-4" />} tone="teal" />
        <KpiTile label="Next action" value={<span className="text-xs leading-tight">{call.nextAction ?? '—'}</span>} icon={<CalendarClock className="w-4 h-4" />} tone="blue" />
      </KpiGrid>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="transcript" className="text-xs"><MessageSquare className="w-3.5 h-3.5 mr-1" /> Transcript</TabsTrigger>
          <TabsTrigger value="extracted" className="text-xs"><Sparkles className="w-3.5 h-3.5 mr-1" /> AI extracted data</TabsTrigger>
          <TabsTrigger value="context" className="text-xs"><Bot className="w-3.5 h-3.5 mr-1" /> Agent & timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-4">
          <Panel title="Call transcript" subtitle={`${messages.length} turns · language ${call.language ?? 'en-IN'}`}
            actions={<Button size="sm" variant="outline" onClick={() => simulate('Recording requested', 'In production this would stream the recorded audio. No audio exists in the prototype.')}><Play className="w-3 h-3 mr-1" /> Play simulated audio</Button>}>
            <ScrollArea className="max-h-[540px] pr-3">
              <div className="space-y-4">
                {messages.map((m: any) => {
                  const s = SPEAKER_STYLE[m.speaker] ?? SPEAKER_STYLE.contact
                  const isAi = m.speaker === 'ai' || m.speaker === 'agent'
                  return (
                    <div key={m.id} className="flex items-start gap-2.5">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                        isAi ? 'bg-violet-100 text-violet-700' : m.speaker === 'founder' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>
                        {isAi ? <Bot className="w-3.5 h-3.5" /> : m.speaker === 'founder' ? 'FP' : 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{s.label}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{fmtDuration(m.atSec)}</span>
                          {m.sentiment && m.sentiment !== 'neutral' && (
                            <Badge variant="secondary" className={cn('text-[10px] h-4',
                              m.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{m.sentiment}</Badge>
                          )}
                        </div>
                        <div className={cn('p-3 rounded-lg border text-xs leading-relaxed', s.bubble)}>{m.text}</div>
                      </div>
                    </div>
                  )
                })}
                {messages.length === 0 && <EmptyState icon={<MessageSquare className="w-5 h-5" />} title="No transcript recorded" />}
              </div>
            </ScrollArea>
          </Panel>

          <Panel title="Conversation actions" subtitle="All actions are simulated in the prototype">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => simulate('Quote created', `A supplier quote of ${call.quoteAmount ? fmtMoney(call.quoteAmount) : 'the recorded amount'} was drafted against ${call.rfqNumber ?? 'the linked RFQ'}.`)}>
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Create quote
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulate('RFQ updated', `${call.rfqNumber ?? 'The RFQ'} status moved to “supplier responded”.`)}>
                <Target className="w-3.5 h-3.5 mr-1.5" /> Update RFQ
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulate('WhatsApp summary sent', `A structured WhatsApp summary was queued to ${call.contactName}.`)}>
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Send WhatsApp summary
              </Button>
              <Button size="sm" variant="outline" onClick={() => onNavigate('voice-escalations')}>
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Escalate
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulate('Saved', 'The transcript and extracted data were saved to the operating memory.')}>
                Save
              </Button>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="extracted" className="space-y-4">
          <Panel title="AI extracted data" subtitle="Structured fields pulled out of the conversation"
            actions={extracted ? <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-50 text-emerald-700">confidence {Math.round((extracted.confidence ?? 0) * 100)}%</Badge> : null}>
            {extractedRows.length === 0 ? (
              <EmptyState icon={<Sparkles className="w-5 h-5" />} title="No structured data extracted" hint="Calls that end early or escalate usually carry no extractable fields." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {extractedRows.map(([label, value]) => (
                  <div key={String(label)} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 break-words">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {call.summary && (
            <Panel title="Call summary">
              <p className="text-xs text-gray-700 leading-relaxed">{call.summary}</p>
            </Panel>
          )}
        </TabsContent>

        <TabsContent value="context" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Panel title="Agent that ran this call">
              {!agent ? <EmptyState icon={<Bot className="w-5 h-5" />} title="Agent record unavailable" /> : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center"><Bot className="w-4 h-4 text-violet-600" /></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                      <p className="text-[11px] font-mono text-gray-500">{agent.key}</p>
                    </div>
                  </div>
                  <Field label="Escalation threshold" value={`${Math.round((agent.escalationThreshold ?? 0) * 100)}% confidence`} />
                  {script && <Field label="Script used" value={`${script.name} (${script.code})`} />}
                  <Button size="sm" variant="outline" onClick={() => onNavigate('voice-agents')}>Open agent builder</Button>
                </div>
              )}
            </Panel>

            <Panel title="Unified timeline" subtitle="Every touch on this contact across channels">
              {timeline.length === 0 ? <EmptyState icon={<Clock className="w-5 h-5" />} title="No other events" /> : (
                <div className="space-y-3">
                  {timeline.map((t: any) => (
                    <div key={t.id} className="flex items-start gap-3">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                        t.channel === 'voice' ? 'bg-emerald-50 text-emerald-600' : t.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600')}>
                        {t.channel === 'email' ? <FileText className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-900">{t.subject}</p>
                          <span className="text-[10px] text-gray-400 ml-auto">{fmtWhen(t.occurredAt)}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">{t.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
