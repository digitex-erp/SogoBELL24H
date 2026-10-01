import { useState } from 'react'
import {
  Activity, AlertOctagon, AlertTriangle, ArrowRight, BarChart3, Bot, CalendarClock,
  CheckCircle2, Clock, DollarSign, Filter, Gauge, Headphones, Info, Layers, Lock,
  MessageSquare, PhoneCall, PhoneIncoming, Play, Shield, ShieldAlert, ShieldCheck,
  Sparkles, StopCircle, Target, TrendingUp, Users, Zap,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  ChipList, EmptyState, ErrorBlock, Field, KpiGrid, KpiTile, LoadingBlock, Meter,
  PageShell, Panel, RefreshButton, SimBanner, SimTag, StatusBadge, StatBlock, useToast,
  fmtDuration, fmtMoney, fmtNum, fmtPct, fmtWhen, simAction, useSimulation, useVoiceApi, voiceFetch,
} from './shared'

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6']

/* ══════════════════════════════════════════════════════════
   ESCALATION CENTER — spec §12
   ══════════════════════════════════════════════════════════ */

export function EscalationCenter({ onOpenCall }: { onOpenCall: (ref: string) => void }) {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/escalations')
  const { simulate } = useSimulation()
  const { show, node } = useToast()
  const [open, setOpen] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [severity, setSeverity] = useState('all')

  const escalations: any[] = data?.escalations ?? []
  const stats: Record<string, any> = data?.stats ?? {}
  const triggers: any[] = data?.triggers ?? []
  const filtered = escalations.filter((e: any) =>
    (statusFilter === 'all' || e.status === statusFilter) &&
    (severity === 'all' || e.severity === severity))

  const act = async (action: string, payload: any, msg?: string) => {
    try {
      const res = await simAction(action, payload)
      simulate(res?.message ?? msg ?? 'Action simulated', res?.detail)
      refetch()
    } catch (e: any) {
      simulate('Action failed', e?.message)
    }
  }

  return (
    <PageShell
      icon={<ShieldAlert className="w-5 h-5 text-orange-500" />}
      title="Escalation Center"
      subtitle="Calls the AI refused to handle alone, waiting for a human decision"
      actions={<RefreshButton onClick={refetch} loading={loading} />}
    >
      {node}
      <SimBanner banner={data?.banner} />

      <KpiGrid cols={5}>
        <KpiTile label="Open" value={fmtNum(stats.open)} caption={`${stats.inReview ?? 0} in review`} icon={<ShieldAlert className="w-4 h-4" />} tone="amber" />
        <KpiTile label="Critical" value={fmtNum(stats.critical)} icon={<AlertOctagon className="w-4 h-4" />} tone="red" />
        <KpiTile label="Resolved" value={fmtNum(stats.resolved)} icon={<CheckCircle2 className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Avg response" value={`${stats.avgResponseMinutes ?? 0}m`} caption="Founder reply time" icon={<Clock className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Routed to human" value={fmtPct(stats.routedToHumanRate, 1)} caption="Of all calls" icon={<Users className="w-4 h-4" />} tone="violet" />
      </KpiGrid>

      <Panel title="Escalation triggers" subtitle="The AI must hand over to a human whenever any of these fire">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {triggers.map((t: string) => (
            <div key={t} className="flex items-center gap-2 p-2.5 rounded-lg bg-orange-50/60 border border-orange-100">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              <span className="text-[11px] text-orange-900">{t}</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {['all', 'open', 'in_review', 'resolved'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            {['all', 'critical', 'high', 'medium', 'low'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-[11px] text-gray-500 ml-auto">{filtered.length} of {escalations.length} shown</span>
      </div>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((e: any) => (
          <Card key={e.id} className={cn('border-l-4', e.severity === 'critical' ? 'border-l-red-500' : e.severity === 'high' ? 'border-l-orange-400' : 'border-l-amber-300')}>
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-gray-500">{e.ref}</span>
                <StatusBadge status={e.severity} />
                <StatusBadge status={e.status} />
                <span className="text-[11px] text-gray-400 ml-auto">{fmtWhen(e.raisedAt)}</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">{e.contactName} <span className="text-gray-400 font-normal">· {e.company}</span></p>
                <p className="text-xs text-orange-700 font-medium mt-0.5">{e.reason}</p>
              </div>

              <p className="text-[11px] text-gray-600 line-clamp-2">{e.summary}</p>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Linked call" value={e.callRef} mono />
                <Field label="RFQ" value={e.rfqNumber ?? '—'} mono />
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-violet-50 border border-violet-100">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div className="text-[11px] text-violet-900">
                  <p className="font-semibold">AI recommendation</p>
                  <p className="mt-0.5 text-violet-800">{e.recommendation}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                <Button size="sm" className="h-7 text-[11px]" onClick={() => act('accept_call', { ref: e.callRef }, `Accepted ${e.ref}`)}>
                  <Headphones className="w-3 h-3 mr-1" />Accept
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => act('schedule_callback', { ref: e.callRef, when: 'next_business_day' }, `Callback scheduled for ${e.ref}`)}>
                  <CalendarClock className="w-3 h-3 mr-1" />Call back
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => act('send_whatsapp', { ref: e.callRef, to: e.contactName }, `WhatsApp sent to ${e.contactName}`)}>
                  <MessageSquare className="w-3 h-3 mr-1" />WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => simulate('Escalation assigned', `${e.ref} was assigned to the founder queue.`)}>
                  Assign
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => act('resolve_escalation', { ref: e.ref, status: 'resolved' })}>
                  <CheckCircle2 className="w-3 h-3 mr-1" />Resolve
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-[11px] ml-auto" onClick={() => setOpen(e)}>
                  Transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <Panel title="Nothing escalated"><EmptyState icon={<ShieldCheck className="w-5 h-5" />} title="No escalations match those filters"
          hint="Escalations appear when the AI's confidence drops below its threshold, or the contact asks for a human." /></Panel>
      )}

      <Dialog open={Boolean(open)} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              {open?.ref} — {open?.contactName}
            </DialogTitle>
            <DialogDescription className="text-xs">{open?.company} · {open?.reason}</DialogDescription>
          </DialogHeader>
          {open && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <StatBlock value={open.severity} label="Severity" />
                <StatBlock value={open.status} label="Status" />
                <StatBlock value={open.callRef ?? '—'} label="Call" />
                <StatBlock value={open.rfqNumber ?? '—'} label="RFQ" />
              </div>
              <Panel title="Conversation summary">
                <p className="text-xs text-gray-700 leading-relaxed">{open.summary}</p>
              </Panel>
              <Panel title="Transcript">
                <ScrollArea className="max-h-64">
                  <pre className="text-[11px] font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">{open.transcript}</pre>
                </ScrollArea>
              </Panel>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-50 border border-violet-100">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-violet-900">
                  <p className="font-semibold">Recommended next step</p>
                  <p className="mt-0.5 text-violet-800">{open.recommendation}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onOpenCall(open.callRef)}>Open full call</Button>
                <Button size="sm" onClick={() => { act('resolve_escalation', { ref: open.ref, status: 'resolved' }); setOpen(null) }}>Resolve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   AUTOMATION RULES — spec §19
   ══════════════════════════════════════════════════════════ */

export function AutomationRulesPage() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/automation')
  const { simulate } = useSimulation()
  const [createOpen, setCreateOpen] = useState(false)
  const rules: any[] = data?.rules ?? []
  const pipeline: any[] = data?.pipeline ?? ['TRIGGER', 'CONDITION', 'AI DECISION', 'ACTION']

  const toggle = async (r: any) => {
    try {
      const next = r.status === 'enabled' ? 'disabled' : 'enabled'
      const res = await simAction('set_rule_status', { code: r.code, status: next })
      simulate(res?.message ?? 'Rule updated', res?.detail)
      refetch()
    } catch (e: any) {
      simulate('Action failed', e?.message)
    }
  }

  return (
    <PageShell
      icon={<Zap className="w-5 h-5 text-emerald-600" />}
      title="Automation Rules"
      subtitle="Trigger → condition → AI decision → action, applied to communication events"
      actions={
        <>
          <Button size="sm" onClick={() => setCreateOpen(true)}>New rule</Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      <SimBanner banner={data?.banner} engine={data?.engine} />

      <KpiGrid cols={4}>
        <KpiTile label="Rules" value={fmtNum(rules.length)} caption={`${rules.filter((r: any) => r.status === 'enabled').length} enabled`} icon={<Zap className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Total runs" value={fmtNum(rules.reduce((s: number, r: any) => s + (r.runCount ?? 0), 0))} icon={<Activity className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Disabled" value={fmtNum(rules.filter((r: any) => r.status !== 'enabled').length)} icon={<StopCircle className="w-4 h-4" />} tone="gray" />
        <KpiTile label="Channels" value={fmtNum(new Set(rules.map((r: any) => r.channel)).size)} icon={<Layers className="w-4 h-4" />} tone="blue" />
      </KpiGrid>

      <Panel title="Rule pipeline" subtitle="Every rule is evaluated in this order">
        <div className="flex flex-wrap items-center gap-2">
          {pipeline.map((p: string, i: number) => (
            <div key={p} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">{p}</span>
              </div>
              {i < pipeline.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-gray-300" />}
            </div>
          ))}
        </div>
      </Panel>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {rules.map((r: any) => (
          <Card key={r.id} className={cn(r.status !== 'enabled' && 'opacity-75')}>
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-wrap items-start gap-2">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  r.status === 'enabled' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400')}>
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                  <p className="text-[10px] font-mono text-gray-500">{r.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  <Switch checked={r.status === 'enabled'} onCheckedChange={() => toggle(r)} />
                </div>
              </div>

              <div className="space-y-2">
                <FlowRow label="Trigger" value={r.trigger} tone="blue" />
                <FlowRow label="Condition" value={r.conditions} tone="amber" />
                <FlowRow label="AI decision" value={r.aiDecision} tone="violet" />
                <FlowRow label="Action" value={r.action} tone="emerald" />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                {r.agentKey && <Badge variant="secondary" className="text-[10px] h-5 bg-violet-50 text-violet-700 font-mono">{r.agentKey}</Badge>}
                <Badge variant="secondary" className="text-[10px] h-5 bg-gray-100 text-gray-600 capitalize">{r.channel}</Badge>
                <span className="text-[11px] text-gray-500 tabular-nums ml-auto">{fmtNum(r.runCount)} runs · last {fmtWhen(r.lastRunAt)}</span>
                <Button size="sm" variant="outline" className="h-7 text-[11px]"
                  onClick={() => simulate('Rule test fired', `“${r.name}” would evaluate its condition against a sample event and report the decision.`)}>
                  <Play className="w-3 h-3 mr-1" />Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateRuleDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={() => { refetch(); simulate('Rule created', 'The rule would begin evaluating on the next communication event.') }} />
    </PageShell>
  )
}

function FlowRow({ label, value, tone }: { label: string; value?: string | null; tone: 'blue' | 'amber' | 'violet' | 'emerald' }) {
  const tones = {
    blue: 'bg-blue-50 border-blue-100 text-blue-900',
    amber: 'bg-amber-50 border-amber-100 text-amber-900',
    violet: 'bg-violet-50 border-violet-100 text-violet-900',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-900',
  }
  return (
    <div className={cn('p-2.5 rounded-lg border', tones[tone])}>
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-[11px] mt-0.5">{value ?? '—'}</p>
    </div>
  )
}

function CreateRuleDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', trigger: 'New RFQ', conditions: '', aiDecision: '', action: '', channel: 'voice', agentKey: 'rfq_followup' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    if (!form.name.trim()) { setErr('Rule name is required'); return }
    setBusy(true); setErr(null)
    try {
      const res = await voiceFetch('/voice/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('bell24h_token') ? { Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` } : {}) },
        body: JSON.stringify(form),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
      onOpenChange(false)
      onCreated()
    } catch (e: any) {
      setErr(e?.message ?? 'Could not create the rule')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">New automation rule</DialogTitle>
          <DialogDescription className="text-xs">Rule evaluation is simulated in the prototype.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {err && <ErrorBlock error={err} />}
          <div className="space-y-1.5">
            <Label className="text-xs">Rule name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. RFQ silent 2h → AI call" className="h-9 text-sm" />
          </div>
          {([['trigger', 'Trigger'], ['conditions', 'Condition'], ['aiDecision', 'AI decision'], ['action', 'Action']] as const).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs">{label}</Label>
              <Textarea value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="text-sm min-h-[56px]" placeholder={`What is the ${label.toLowerCase()}?`} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Channel</Label>
              <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{['voice', 'whatsapp', 'email'].map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Agent</Label>
              <Select value={form.agentKey} onValueChange={(v) => setForm({ ...form, agentKey: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['rfq_followup', 'supplier_qualification', 'buyer_qualification', 'quote_collection', 'appointment', 'customer_support', 'payment_reminder', 'lead_qualification'].map((a) => (
                    <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={submit} disabled={busy}>{busy ? 'Creating…' : 'Create rule'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ══════════════════════════════════════════════════════════
   CALL ANALYTICS — spec §20
   ══════════════════════════════════════════════════════════ */

export function CallAnalyticsPage() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/analytics')
  const [days, setDays] = useState('30')

  const byDay = (data?.byDay ?? []).slice(-Number(days))
  const funnel = [
    { name: 'Attempted', value: data?.total ?? 0 },
    { name: 'Connected', value: data?.connected ?? 0 },
    { name: 'Answered', value: data?.answered ?? 0 },
    { name: 'Completed', value: data?.completed ?? 0 },
  ]
  const mix = [
    { name: 'AI resolved', value: data?.completed ?? 0 },
    { name: 'Escalated', value: data?.escalated ?? 0 },
    { name: 'Callbacks', value: data?.callbacks ?? 0 },
  ].filter((d) => d.value > 0)

  return (
    <PageShell
      icon={<BarChart3 className="w-5 h-5 text-emerald-600" />}
      title="Call Analytics"
      subtitle="Answer rates, resolution, cost per call and pipeline influence — all demo data"
      actions={
        <>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="h-9 w-[130px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{['7', '14', '30'].map((d) => <SelectItem key={d} value={d}>Last {d} days</SelectItem>)}</SelectContent>
          </Select>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      <SimBanner banner={data?.banner} />

      <KpiGrid cols={6}>
        <KpiTile label="Calls" value={fmtNum(data?.total)} caption={`${data?.days ?? 30}-day window`} icon={<PhoneCall className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Answer rate" value={fmtPct(data?.answerRate, 1)} icon={<PhoneIncoming className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Connection rate" value={fmtPct(data?.connectionRate, 1)} icon={<Activity className="w-4 h-4" />} tone="blue" />
        <KpiTile label="AI resolution" value={fmtPct(data?.aiResolutionRate, 1)} icon={<Bot className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Escalation rate" value={fmtPct(data?.escalationRate, 1)} icon={<ShieldAlert className="w-4 h-4" />} tone="amber" />
        <KpiTile label="Avg duration" value={fmtDuration(data?.avgDurationSec)} caption={`${fmtPct((data?.avgConfidence ?? 0) * 100, 1)} avg confidence`} icon={<Clock className="w-4 h-4" />} tone="gray" />
      </KpiGrid>

      <KpiGrid cols={5}>
        <KpiTile label="Quotes generated" value={fmtNum(data?.quotesGenerated)} icon={<Target className="w-4 h-4" />} tone="teal" />
        <KpiTile label="Quote value" value={fmtMoney(data?.quoteValue)} icon={<TrendingUp className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Deals influenced" value={fmtNum(data?.dealsInfluenced)} icon={<Sparkles className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Cost per call" value={`$${(data?.costPerCall ?? 0).toFixed(4)}`} caption={`$${(data?.totalCostUsd ?? 0).toFixed(2)} total`} icon={<DollarSign className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Cost per success" value={`$${(data?.costPerSuccess ?? 0).toFixed(4)}`} icon={<Gauge className="w-4 h-4" />} tone="amber" />
      </KpiGrid>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Call outcomes over time" subtitle="Daily volume, connection and escalation">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="calls" name="Calls" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="connected" name="Connected" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="escalated" name="Escalated" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Outcome mix" subtitle="Where calls ended">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mix} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>
                  {mix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Conversion funnel" subtitle="How many calls survive each stage">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnel} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="value" name="Calls" radius={[6, 6, 0, 0]}>
                {funnel.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {funnel.map((f) => (
            <StatBlock key={f.name} value={fmtNum(f.value)} label={f.name} />
          ))}
        </div>
      </Panel>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   COMMUNICATION SETTINGS / AI CALLING POLICY — spec §21
   ══════════════════════════════════════════════════════════ */

const CATEGORY_LABEL: Record<string, string> = {
  consent: 'Consent & permission',
  governance: 'Governance & supervision',
  privacy: 'Privacy & recording',
  safety: 'Safety',
  schedule: 'Calling hours',
  volume: 'Volume limits',
}

export function CommunicationSettingsPage() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/policies')
  const { simulate } = useSimulation()
  const [editing, setEditing] = useState<any>(null)
  const [value, setValue] = useState('')

  const groups: any[] = data?.groups ?? []

  const save = async () => {
    if (!editing) return
    try {
      const res = await simAction('update_policy', { key: editing.key, value })
      simulate(res?.message ?? 'Policy updated', res?.detail)
      setEditing(null)
      refetch()
    } catch (e: any) {
      simulate('Update failed', e?.message)
    }
  }

  const killSwitch = async () => {
    try {
      const res = await simAction('kill_switch', {})
      simulate(res?.message ?? 'Kill switch engaged', res?.detail)
      refetch()
    } catch (e: any) {
      simulate('Kill switch failed', e?.message)
    }
  }

  return (
    <PageShell
      icon={<Shield className="w-5 h-5 text-emerald-600" />}
      title="AI Calling Policy"
      subtitle="The human-supervision layer that bounds what the agents may do"
      actions={
        <>
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={killSwitch}>
            <AlertOctagon className="w-3.5 h-3.5 mr-1.5" />Kill switch
          </Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      <SimBanner banner={data?.banner} />

      <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-emerald-900">
          <p className="font-semibold">Human-supervised by construction</p>
          <p className="mt-0.5 text-emerald-800">{data?.governance}</p>
        </div>
      </div>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {groups.map((g: any) => (
            <Panel key={g.category} title={CATEGORY_LABEL[g.category] ?? g.category} subtitle={`${g.items.length} controls`}>
              <div className="space-y-2">
                {g.items.map((p: any) => (
                  <div key={p.key} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50/60">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-medium text-gray-900">{p.label}</p>
                        {p.enforced && <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-50 text-emerald-700"><Lock className="w-2.5 h-2.5 mr-0.5" />enforced</Badge>}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[11px] h-6 font-mono bg-gray-100 text-gray-800">
                        {p.value}{p.unit ? ` ${p.unit}` : ''}
                      </Badge>
                      <Button size="sm" variant="outline" className="h-7 text-[11px]"
                        onClick={() => { setEditing(p); setValue(String(p.value)) }}>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>

        <div className="space-y-4">
          <Panel title="Emergency controls" subtitle="Founder overrides that take effect immediately">
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-900">Global kill switch</p>
                    <p className="text-[11px] text-red-700 mt-0.5">Disables every agent, pauses all running campaigns and stops the automation engine.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="mt-2 w-full text-red-600 border-red-200 hover:bg-red-100" onClick={killSwitch}>
                  Engage kill switch
                </Button>
              </div>
              <Button size="sm" variant="outline" className="w-full"
                onClick={() => simulate('All agents re-enabled', 'Every disabled agent would be set back to active. Campaigns stay paused until you resume them.')}>
                Re-enable all agents
              </Button>
            </div>
          </Panel>

          <Panel title="Do-not-call list" subtitle="Contacts that must never be dialled">
            <div className="space-y-2">
              {['+91 98•••• 1122', '+91 90•••• 3344', 'sales@competitor.example'].map((n) => (
                <div key={n} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-xs font-mono text-gray-700">{n}</span>
                  <Badge variant="secondary" className="text-[10px] h-5 bg-red-50 text-red-700">blocked</Badge>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full"
              onClick={() => simulate('DNC entry added', 'The number would be added to the do-not-call list and excluded from every campaign.')}>
              Add to DNC list
            </Button>
          </Panel>

          <Panel title="Policy source of truth">
            <div className="space-y-2">
              <Field label="Policies defined" value={`${(data?.policies ?? []).length}`} />
              <Field label="Enforced" value={`${(data?.policies ?? []).filter((p: any) => p.enforced).length}`} />
              <Field label="Groups" value={`${groups.length}`} />
              <Field label="Mode" value="Simulated policy evaluation" />
            </div>
          </Panel>
        </div>
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Edit policy</DialogTitle>
            <DialogDescription className="text-xs">{editing?.description}</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">{editing.label}</Label>
                <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-9 text-sm" />
                <p className="text-[11px] text-gray-500">Current: <span className="font-mono">{editing.value}{editing.unit ? ` ${editing.unit}` : ''}</span></p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
                <Button size="sm" onClick={save}>Save policy</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
