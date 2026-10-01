import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownLeft, ArrowUpRight, BarChart3, Bot, CalendarClock, CheckCircle2,
  ChevronRight, Clock, Gauge, Headphones, Inbox, Layers, Mail, MessageSquare, Mic,
  PhoneCall, PhoneIncoming, PhoneOutgoing, Radio, ShieldAlert, Sparkles, Target,
  TrendingUp, Users, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  EmptyState, ErrorBlock, Field, KpiGrid, KpiTile, LoadingBlock, Meter, PageShell,
  Panel, RefreshButton, SimBanner, SimTag, StatusBadge, StatBlock,
  fmtDuration, fmtMoney, fmtNum, fmtPct, fmtTime, fmtWhen, useVoiceApi, useSimulation,
} from './shared'

const CHANNEL_TONE: Record<string, { tone: any; icon: any }> = {
  voice: { tone: 'emerald', icon: PhoneCall },
  whatsapp: { tone: 'emerald', icon: MessageSquare },
  email: { tone: 'blue', icon: Mail },
}

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6']

/* ══════════════════════════════════════════════════════════
   AI VOICE COMMAND CENTER
   ══════════════════════════════════════════════════════════ */

export function VoiceCommandCenter({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/overview')
  const { simulate } = useSimulation()

  if (loading && !data) return <PageShell icon={<Gauge className="w-5 h-5 text-emerald-600" />} title="AI Voice Command Center" subtitle="Loading…"><LoadingBlock /></PageShell>
  if (error) return <PageShell icon={<Gauge className="w-5 h-5 text-emerald-600" />} title="AI Voice Command Center" subtitle="Founder command centre for AI calling"><ErrorBlock error={error} onRetry={refetch} /></PageShell>

  const k: Record<string, any> = data?.kpis ?? {}
  const live: any[] = data?.liveCalls ?? []
  const trend: any[] = data?.trend ?? []
  const byChannel: any[] = data?.byChannel ?? []
  const queue: any[] = data?.queueSummary ?? []
  const escalations: any[] = data?.escalations ?? []
  const campaigns: any[] = data?.campaigns ?? []
  const agents: any[] = data?.agents ?? []

  const callOutcomeMix = [
    { name: 'Completed', value: k.successfulConversations ?? 0 },
    { name: 'Escalated', value: k.humanEscalations ?? 0 },
    { name: 'In progress', value: live.length },
    { name: 'Waiting', value: k.callsPending ?? 0 },
  ].filter((d) => d.value > 0)

  return (
    <PageShell
      icon={<Gauge className="w-5 h-5 text-emerald-600" />}
      title="AI Voice Command Center"
      subtitle="Every AI call, campaign, escalation and quotation in one command centre"
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      <SimBanner banner={data?.banner} engine={data?.engine} />

      {/* KPI row — spec §4 */}
      <KpiGrid cols={6}>
        <KpiTile label="Calls today" value={fmtNum(k.callsToday)} caption={`${fmtNum(k.outbound)} out · ${fmtNum(k.inbound)} in`} icon={<PhoneCall className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="AI answered" value={fmtNum(k.aiAnswered)} caption="Handled without a human" icon={<Bot className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Human escalations" value={fmtNum(k.humanEscalations)} caption={`${data?.openEscalations ?? 0} open now`} icon={<ShieldAlert className="w-4 h-4" />} tone="amber" />
        <KpiTile label="Successful" value={fmtNum(k.successfulConversations)} caption={`${fmtPct(k.conversionRate, 1)} conversion`} icon={<CheckCircle2 className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Quotes collected" value={fmtNum(k.quotesCollected)} caption={fmtMoney(k.quotesValue)} icon={<Target className="w-4 h-4" />} tone="teal" />
        <KpiTile label="Calls pending" value={fmtNum(k.callsPending)} caption={`${fmtNum(k.callbacksPending)} callbacks queued`} icon={<Clock className="w-4 h-4" />} tone="blue" />
      </KpiGrid>

      <KpiGrid cols={6}>
        <KpiTile label="Outbound" value={fmtNum(k.outbound)} icon={<PhoneOutgoing className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Inbound" value={fmtNum(k.inbound)} icon={<PhoneIncoming className="w-4 h-4" />} tone="teal" />
        <KpiTile label="RFQs generated" value={fmtNum(k.rfqsGenerated)} icon={<Layers className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Supplier replies" value={fmtNum(k.supplierResponses)} icon={<Users className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Buyer replies" value={fmtNum(k.buyerResponses)} icon={<Users className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Avg duration" value={fmtDuration(k.avgDurationSec)} caption={`${fmtNum(k.followUpsCompleted)} follow-ups done`} icon={<Clock className="w-4 h-4" />} tone="gray" />
      </KpiGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          className="lg:col-span-2"
          title="Call volume — last 7 days"
          subtitle="Simulated call state machine outcomes"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="vcCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="vcEsc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="calls" name="Calls" stroke="#10b981" strokeWidth={2} fill="url(#vcCalls)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#3b82f6" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="escalated" name="Escalated" stroke="#f59e0b" strokeWidth={2} fill="url(#vcEsc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Outcome mix" subtitle="Today's call dispositions">
          {callOutcomeMix.length === 0 ? (
            <EmptyState icon={<BarChart3 className="w-5 h-5" />} title="No calls yet" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={callOutcomeMix} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>
                    {callOutcomeMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
      </div>

      {/* Live now + queue funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          className="lg:col-span-2"
          title="Live conversations"
          subtitle={`${live.length} AI calls in progress right now`}
          actions={<Button variant="outline" size="sm" onClick={() => onNavigate('voice-live')}>Open monitor <ChevronRight className="w-3.5 h-3.5 ml-0.5" /></Button>}
        >
          {live.length === 0 ? (
            <EmptyState icon={<Headphones className="w-5 h-5" />} title="No live calls" hint="The simulated engine starts a call every few seconds when a campaign is running." />
          ) : (
            <div className="space-y-2">
              {live.map((c: any) => (
                <div key={c.id} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-gray-100 bg-gray-50/60">
                  <StatusBadge status={c.state === 'wrap_up' ? 'speaking' : c.state} dot />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900">{c.contactName} <span className="text-gray-400 font-normal">· {c.company}</span></p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{c.intent} — {c.objective}</p>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500">{c.ref}</span>
                  <span className="text-[11px] tabular-nums font-medium text-gray-700">{fmtDuration(c.durationSec)}</span>
                  <Badge variant="secondary" className="text-[10px] h-5 bg-violet-50 text-violet-700">{Math.round((c.confidence ?? 0) * 100)}%</Badge>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Queue funnel" subtitle="Every job in the state machine">
          <div className="space-y-2.5">
            {queue.map((q: any) => (
              <div key={q.status}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-gray-600">{q.label}</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{q.count}</span>
                </div>
                <Meter value={queue.length ? (q.count / Math.max(...queue.map((x: any) => x.count), 1)) * 100 : 0}
                  tone={q.status === 'failed' ? 'red' : q.status === 'escalated' ? 'amber' : q.status === 'completed' ? 'emerald' : 'blue'} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Channels + escalations + agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Channel breakdown" subtitle="Voice, WhatsApp and email events">
          <div className="space-y-3">
            {byChannel.map((ch: any) => {
              const meta = CHANNEL_TONE[ch.channel] ?? CHANNEL_TONE.voice
              const Icon = meta.icon
              const rate = ch.count ? (ch.responded / ch.count) * 100 : 0
              return (
                <div key={ch.channel} className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    ch.channel === 'voice' ? 'bg-emerald-50 text-emerald-600' : ch.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600')}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-800 capitalize">{ch.channel}</span>
                      <span className="tabular-nums text-gray-500">{ch.responded}/{ch.count}</span>
                    </div>
                    <Meter value={rate} tone="emerald" />
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel
          title="Escalations needing a human"
          subtitle={`${data?.openEscalations ?? 0} open`}
          actions={<Button variant="outline" size="sm" onClick={() => onNavigate('voice-escalations')}>Review</Button>}
        >
          {escalations.length === 0 ? (
            <EmptyState icon={<ShieldAlert className="w-5 h-5" />} title="Nothing escalated" />
          ) : (
            <div className="space-y-2">
              {escalations.map((e: any) => (
                <div key={e.id} className="p-2.5 rounded-lg border border-orange-100 bg-orange-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={e.severity} />
                    <span className="text-[11px] text-gray-500 font-mono">{e.ref}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-900">{e.contactName} · {e.company}</p>
                  <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">{e.reason}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Agent fleet"
          subtitle={`${agents.filter((a: any) => a.status === 'active').length}/${agents.length} active`}
          actions={<Button variant="outline" size="sm" onClick={() => onNavigate('voice-agents')}>Manage</Button>}
        >
          <div className="space-y-2">
            {agents.slice(0, 5).map((a: any) => (
              <div key={a.key} className="flex items-center gap-2.5">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                  a.status === 'active' ? 'bg-violet-50 text-violet-600' : 'bg-gray-100 text-gray-400')}>
                  {a.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-800 truncate">{a.name}</p>
                  <p className="text-[10px] text-gray-500 tabular-nums">{fmtNum(a.totalCalls)} calls · {fmtPct(a.resolutionRate)} resolved</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Quick actions — spec §22 */}
      <Panel title="Quick actions" subtitle="Simulated operations — nothing is dialled">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: 'Start call campaign', icon: Zap, action: () => onNavigate('voice-campaigns') },
            { label: 'View live calls', icon: Headphones, action: () => onNavigate('voice-live') },
            { label: 'Review escalations', icon: ShieldAlert, action: () => onNavigate('voice-escalations') },
            { label: 'Create agent', icon: Bot, action: () => onNavigate('voice-agents') },
            { label: 'Review call queue', icon: Layers, action: () => onNavigate('voice-queue') },
            { label: 'Communication analytics', icon: BarChart3, action: () => onNavigate('voice-analytics') },
          ].map((a) => (
            <button key={a.label} onClick={a.action}
              className="flex flex-col items-start gap-2 p-3 rounded-lg border border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors text-left">
              <a.icon className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-medium text-gray-700 leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </Panel>

      {/* Campaign progress */}
      <Panel title="Campaign progress" subtitle="Targets called against the plan">
        <div className="space-y-3">
          {campaigns.map((c: any) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">{c.code}</p>
              </div>
              <div className="w-full sm:w-48">
                <Meter value={c.progress} tone={c.status === 'running' ? 'emerald' : 'blue'} />
                <p className="text-[10px] text-gray-500 mt-1 tabular-nums">{c.totalCalled}/{c.totalTargets} called · {fmtPct(c.connectionRate)} connected</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   COMMUNICATION HUB  (+ unified contact memory — spec §18)
   ══════════════════════════════════════════════════════════ */

export function CommunicationHub({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/hub')
  const [tab, setTab] = useState('feed')
  const [selected, setSelected] = useState<any>(null)
  const { simulate } = useSimulation()

  if (loading && !data) return <PageShell icon={<Inbox className="w-5 h-5 text-emerald-600" />} title="Communication Hub" subtitle="Loading…"><LoadingBlock /></PageShell>
  if (error) return <PageShell icon={<Inbox className="w-5 h-5 text-emerald-600" />} title="Communication Hub" subtitle="All inbound and outbound business communication"><ErrorBlock error={error} onRetry={refetch} /></PageShell>

  const channels: any[] = data?.channels ?? []
  const events: any[] = data?.events ?? []
  const contacts: any[] = data?.contacts ?? []
  const total = channels.reduce((s: number, c: any) => s + c.total, 0)
  const responded = channels.reduce((s: number, c: any) => s + c.responded, 0)
  const failed = channels.reduce((s: number, c: any) => s + c.failed, 0)

  return (
    <PageShell
      icon={<Inbox className="w-5 h-5 text-emerald-600" />}
      title="Communication Hub"
      subtitle="Voice, WhatsApp and email unified into one operating memory"
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      <SimBanner banner={data?.banner} />

      <KpiGrid cols={4}>
        <KpiTile label="Total events" value={fmtNum(total)} caption="Across all channels" icon={<Radio className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Responded" value={fmtNum(responded)} caption={fmtPct(total ? (responded / total) * 100 : 0, 1) + ' response rate'} icon={<CheckCircle2 className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Contacts tracked" value={fmtNum(contacts.length)} caption="With business memory" icon={<Users className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Failed" value={fmtNum(failed)} caption="Need retry or re-route" icon={<ShieldAlert className="w-4 h-4" />} tone="red" />
      </KpiGrid>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((ch: any) => {
          const meta = CHANNEL_TONE[ch.channel] ?? CHANNEL_TONE.voice
          const Icon = meta.icon
          return (
            <Card key={ch.channel}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{ch.channel}</p>
                    <p className="text-[11px] text-gray-500">{fmtNum(ch.total)} events</p>
                  </div>
                  <StatusBadge status="connected" className="ml-auto" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatBlock value={fmtNum(ch.outbound)} label="Outbound" />
                  <StatBlock value={fmtNum(ch.inbound)} label="Inbound" />
                  <StatBlock value={fmtNum(ch.responded)} label="Responded" />
                  <StatBlock value={fmtNum(ch.failed)} label="Failed" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="feed" className="text-xs"><Activity className="w-3.5 h-3.5 mr-1" /> Event feed</TabsTrigger>
          <TabsTrigger value="memory" className="text-xs"><Users className="w-3.5 h-3.5 mr-1" /> Contact memory</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <Panel title="Unified event feed" subtitle={`${events.length} most recent communication events`}>
            <div className="space-y-2">
              {events.slice(0, 40).map((e: any) => {
                const meta = CHANNEL_TONE[e.channel] ?? CHANNEL_TONE.voice
                const Icon = meta.icon
                return (
                  <div key={e.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50/60">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      e.direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold text-gray-900">{e.contactName}</p>
                        <span className="text-[11px] text-gray-400">{e.company}</span>
                        <StatusBadge status={e.outcome} />
                        {e.direction === 'inbound'
                          ? <ArrowDownLeft className="w-3 h-3 text-blue-500" />
                          : <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                        <span className="text-[10px] text-gray-400 ml-auto">{fmtWhen(e.occurredAt)}</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-0.5">{e.subject}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{e.body}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-gray-400">{e.ref}</span>
                        {e.rfqNumber && <Badge variant="secondary" className="text-[10px] h-4 bg-teal-50 text-teal-700">{e.rfqNumber}</Badge>}
                        {e.callRef && <Badge variant="secondary" className="text-[10px] h-4 bg-violet-50 text-violet-700">{e.callRef}</Badge>}
                        {e.entityType && <Badge variant="secondary" className="text-[10px] h-4 bg-gray-100 text-gray-600 capitalize">{e.entityType}</Badge>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel className="lg:col-span-1" title="Contacts" subtitle={`${contacts.length} with conversation history`}>
              <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
                {contacts.map((c: any, i: number) => (
                  <button key={`${c.company}-${i}`} onClick={() => setSelected(c)}
                    className={cn('w-full text-left p-2.5 rounded-lg border transition-colors',
                      selected?.company === c.company ? 'border-emerald-300 bg-emerald-50/60' : 'border-gray-100 hover:bg-gray-50')}>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-900 truncate">{c.contact}</p>
                      {c.openTasks > 0 && <Badge variant="secondary" className="text-[10px] h-4 bg-amber-50 text-amber-700 ml-auto">{c.openTasks} open</Badge>}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{c.company}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {c.channels?.map((ch: string) => (
                        <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">{ch}</span>
                      ))}
                      <span className="text-[10px] text-gray-400 ml-auto">{fmtWhen(c.lastAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Panel>

            <div className="lg:col-span-2">
              {!selected ? (
                <Panel title="Contact memory" subtitle="Select a contact to open the unified timeline">
                  <EmptyState icon={<Users className="w-5 h-5" />} title="No contact selected" hint="Every contact carries calls, WhatsApp, email, RFQs, quotes, preferences, AI summary and the next recommended action." />
                </Panel>
              ) : (
                <div className="space-y-4">
                  <Panel title={selected.contact} subtitle={`${selected.company} · last touch ${fmtWhen(selected.lastAt)}`}
                    actions={<Button size="sm" variant="outline" onClick={() => simulate('Contact opened', `Opened the unified timeline for ${selected.contact} at ${selected.company}.`)}>Open 360</Button>}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <StatBlock value={fmtNum(selected.voiceCalls)} label="Voice calls" />
                      <StatBlock value={fmtNum(selected.eventCount)} label="Total events" />
                      <StatBlock value={fmtNum(selected.openTasks)} label="Open tasks" />
                      <StatBlock value={selected.channels?.length ?? 0} label="Channels used" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Field label="Preferred channel" value={selected.preferences?.channel} />
                      <Field label="Preferred language" value={selected.preferences?.language} />
                      <Field label="Best time window" value={selected.preferences?.timeWindow} />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-50 border border-violet-100">
                        <Sparkles className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-violet-900">
                          <p className="font-semibold">AI summary</p>
                          <p className="mt-0.5 text-violet-800">{selected.aiSummary}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <Target className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-emerald-900">
                          <p className="font-semibold">Next recommended action</p>
                          <p className="mt-0.5 text-emerald-800">{selected.nextRecommendedAction}</p>
                        </div>
                      </div>
                    </div>
                  </Panel>

                  <Panel title="Unified conversation timeline" subtitle="Newest first">
                    <div className="space-y-2">
                      {(selected.events ?? []).map((e: any) => {
                        const Icon = (CHANNEL_TONE[e.channel] ?? CHANNEL_TONE.voice).icon
                        return (
                          <div key={e.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                              e.direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-medium text-gray-900">{e.subject}</p>
                                <StatusBadge status={e.outcome} />
                                <span className="text-[10px] text-gray-400 ml-auto">{fmtWhen(e.occurredAt)}</span>
                              </div>
                              <p className="text-[11px] text-gray-600 mt-0.5">{e.body}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-[10px] font-mono text-gray-400">{e.ref}</span>
                                {e.rfqNumber && <span className="text-[10px] text-teal-600">{e.rfqNumber}</span>}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Panel>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   FOUNDER COCKPIT — communication panel (embeds in Dashboard)
   ══════════════════════════════════════════════════════════ */

export function FounderCockpitComms({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { data } = useVoiceApi<any>('/voice/overview')
  const k: Record<string, any> = data?.kpis ?? {}
  const queue: any[] = data?.queueSummary ?? []
  const failing = queue.find((q: any) => q.status === 'failed')?.count ?? 0

  const rows = [
    { label: 'Calls waiting', value: k.callsPending ?? 0, icon: Clock, tone: 'amber' as const },
    { label: 'AI calls running', value: (data?.liveCalls ?? []).length, icon: Headphones, tone: 'emerald' as const },
    { label: 'Callbacks', value: k.callbacksPending ?? 0, icon: CalendarClock, tone: 'blue' as const },
    { label: 'Escalations', value: k.humanEscalations ?? 0, icon: ShieldAlert, tone: 'red' as const },
    { label: 'Supplier responses', value: k.supplierResponses ?? 0, icon: Users, tone: 'emerald' as const },
    { label: 'Buyer responses', value: k.buyerResponses ?? 0, icon: Users, tone: 'blue' as const },
    { label: 'RFQs requiring action', value: k.rfqsGenerated ?? 0, icon: Layers, tone: 'violet' as const },
    { label: 'Communication failures', value: failing, icon: ShieldAlert, tone: 'red' as const },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">AI Voice & Communication</p>
            <p className="text-[11px] text-gray-500">Simulated calling activity at a glance</p>
          </div>
          <SimTag />
          <Button variant="outline" size="sm" onClick={() => onNavigate?.('voice-center')}>Open</Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {rows.map((r) => (
            <div key={r.label} className="bg-gray-50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5">
                <r.icon className={cn('w-3 h-3', r.tone === 'red' ? 'text-red-500' : r.tone === 'amber' ? 'text-amber-500' : r.tone === 'violet' ? 'text-violet-500' : r.tone === 'blue' ? 'text-blue-500' : 'text-emerald-500')} />
                <span className="text-[10px] text-gray-500">{r.label}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 tabular-nums mt-0.5">{fmtNum(r.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
