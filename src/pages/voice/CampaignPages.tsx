import { useEffect, useState } from 'react'
import {
  ArrowRight, Bot, CalendarClock, ChevronRight, Clock, FileText, Layers, MessageSquare,
  Pause, PhoneCall, PhoneIncoming, Play, Plus, Radio, RefreshCw, Route, Send,
  ShieldAlert, Sparkles, Square, Target, Users, Zap,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChipList, EmptyState, ErrorBlock, Field, KpiGrid, KpiTile, LoadingBlock, Meter,
  PageShell, Panel, RefreshButton, SimBanner, SimTag, StatusBadge, StatBlock, useToast,
  fmtDuration, fmtNum, fmtPct, fmtWhen, simAction, useSimulation, useVoiceApi, voiceFetch,
} from './shared'

/* ══════════════════════════════════════════════════════════
   OUTBOUND CALL CAMPAIGNS — spec §6
   ══════════════════════════════════════════════════════════ */

const CAMPAIGN_TYPES = [
  'Supplier RFQ Follow-up', 'Buyer Lead Qualification', 'Quotation Reminder',
  'Order Confirmation', 'Payment Reminder', 'Inactive Supplier Reactivation',
  'New Lead Qualification', 'Appointment Scheduling', 'Customer Satisfaction',
  'RFQ Response Reminder',
]

export function CallCampaignsPage() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/campaigns')
  const engine = useVoiceApi<any>('/voice/engine')
  const { simulate } = useSimulation()
  const { show, node } = useToast()
  const [busy, setBusy] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const campaigns = (data?.campaigns ?? []).filter((c: any) => statusFilter === 'all' || c.status === statusFilter)
  const all: any[] = data?.campaigns ?? []

  const act = async (action: string, c: any) => {
    setBusy(c.code)
    try {
      const res = await simAction(action, { code: c.code, name: c.name })
      simulate(res?.message ?? 'Action simulated', res?.detail)
      refetch()
    } catch (e: any) {
      simulate('Action failed', e?.message)
    } finally {
      setBusy(null)
    }
  }

  const toggleEngine = async () => {
    const running: any = engine.data?.engine?.running
    try {
      const res = await voiceFetch(`/voice/engine/${running ? 'stop' : 'start'}`, { method: 'POST', headers: authHeader() })
      const body = await res.json()
      simulate(body?.message ?? (running ? 'Engine stopped' : 'Engine started'), body?.detail)
      engine.refetch()
      refetch()
    } catch (e: any) {
      simulate('Engine action failed', e?.message)
    }
  }

  return (
    <PageShell
      icon={<Zap className="w-5 h-5 text-emerald-600" />}
      title="AI Call Campaigns"
      subtitle="Group contacts, pick an agent and let the simulated engine work the list"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={toggleEngine}>
            {engine.data?.engine?.running ? <><Square className="w-3.5 h-3.5 mr-1.5" />Stop engine</> : <><Play className="w-3.5 h-3.5 mr-1.5" />Start engine</>}
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="w-3.5 h-3.5 mr-1.5" />Create campaign</Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      {node}
      <SimBanner banner={data?.banner} engine={engine.data?.engine ?? data?.engine} />

      <KpiGrid cols={5}>
        <KpiTile label="Campaigns" value={fmtNum(all.length)} caption={`${all.filter((c: any) => c.status === 'running').length} running`} icon={<Layers className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Targets" value={fmtNum(all.reduce((s: number, c: any) => s + (c.totalTargets ?? 0), 0))} icon={<Users className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Called" value={fmtNum(all.reduce((s: number, c: any) => s + (c.totalCalled ?? 0), 0))} icon={<PhoneCall className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Connected" value={fmtNum(all.reduce((s: number, c: any) => s + (c.totalConnected ?? 0), 0))} icon={<Radio className="w-4 h-4" />} tone="teal" />
        <KpiTile label="Successes" value={fmtNum(all.reduce((s: number, c: any) => s + (c.totalSuccess ?? 0), 0))} icon={<Target className="w-4 h-4" />} tone="emerald" />
      </KpiGrid>

      {error && <ErrorBlock error={error} onRetry={refetch} />}

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto">
          {['all', 'running', 'paused', 'scheduled', 'draft', 'stopped'].map((s) => (
            <TabsTrigger key={s} value={s} className="text-xs capitalize">
              {s} <span className="ml-1 text-[10px] text-gray-400">{s === 'all' ? all.length : all.filter((c: any) => c.status === s).length}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          {loading && !data && <LoadingBlock />}
          {campaigns.length === 0 && !loading && (
            <Panel title="No campaigns in this state"><EmptyState icon={<Zap className="w-5 h-5" />} title="Nothing here yet" /></Panel>
          )}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {campaigns.map((c: any) => (
              <Card key={c.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-wrap items-start gap-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-[10px] font-mono text-gray-500">{c.code} · {c.campaignType}</p>
                    </div>
                    <StatusBadge status={c.status} dot />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <StatBlock value={fmtNum(c.totalTargets)} label="Targets" />
                    <StatBlock value={fmtNum(c.totalCalled)} label="Called" />
                    <StatBlock value={fmtNum(c.totalConnected)} label="Connected" />
                    <StatBlock value={fmtNum(c.totalSuccess)} label="Success" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-semibold tabular-nums text-gray-900">{fmtPct(c.progress, 1)}</span>
                    </div>
                    <Meter value={c.progress} tone={c.status === 'running' ? 'emerald' : 'blue'} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Agent" value={c.agentKey?.replace(/_/g, ' ')} />
                    <Field label="Connect rate" value={fmtPct(c.connectionRate, 1)} />
                    <Field label="Success rate" value={fmtPct(c.successRate, 1)} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                    {c.status !== 'running' && (
                      <Button size="sm" className="h-7 text-[11px]" disabled={busy === c.code}
                        onClick={() => act(c.status === 'paused' ? 'resume_campaign' : 'start_campaign', c)}>
                        <Play className="w-3 h-3 mr-1" />{c.status === 'paused' ? 'Resume' : 'Start'}
                      </Button>
                    )}
                    {c.status === 'running' && (
                      <Button size="sm" variant="outline" className="h-7 text-[11px]" disabled={busy === c.code} onClick={() => act('pause_campaign', c)}>
                        <Pause className="w-3 h-3 mr-1" />Pause
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-[11px] text-red-600 hover:bg-red-50" disabled={busy === c.code} onClick={() => act('stop_campaign', c)}>
                      <Square className="w-3 h-3 mr-1" />Stop
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-[11px] ml-auto"
                      onClick={() => simulate('Campaign opened', `${c.name} — in production this opens the contact list, retry policy and script assignment.`)}>
                      Configure <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateCampaignDialog open={createOpen} onOpenChange={setCreateOpen} agents={[]} onCreated={() => { refetch(); show('Campaign created') }} />
    </PageShell>
  )
}

function authHeader(): Record<string, string> {
  const t = localStorage.getItem('bell24h_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

function CreateCampaignDialog({ open, onOpenChange, agents, onCreated }: {
  open: boolean; onOpenChange: (o: boolean) => void; agents: any[]; onCreated: () => void
}) {
  const [form, setForm] = useState({
    name: '', campaignType: CAMPAIGN_TYPES[0], agentKey: 'rfq_followup', language: 'en-IN',
    voice: 'Ananya (Indian English)', maxCallsPerDay: '100', callingHours: 'Mon–Sat 09:30–19:00 IST',
    retryPolicy: 'retry_next_day', maxAttempts: '3', escalationRule: 'Confidence below threshold',
    successCondition: 'Quote captured and RFQ updated', failureCondition: 'Three attempts, no contact',
    script: 'SCR-RFQ-FOLLOWUP', objective: 'Collect a firm quotation',
  })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    if (!form.name.trim()) { setErr('Campaign name is required'); return }
    setBusy(true); setErr(null)
    try {
      const res = await voiceFetch('/voice/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(form),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
      onOpenChange(false)
      onCreated()
    } catch (e: any) {
      setErr(e?.message ?? 'Could not create the campaign')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Create AI call campaign</DialogTitle>
          <DialogDescription className="text-xs">Campaign execution is fully simulated — no calls leave the platform.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {err && <ErrorBlock error={err} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Campaign name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Q4 Steel Supplier Follow-up" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Campaign type</Label>
              <Select value={form.campaignType} onValueChange={(v) => setForm({ ...form, campaignType: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{CAMPAIGN_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
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
            <div className="space-y-1.5">
              <Label className="text-xs">Language</Label>
              <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{['en-IN', 'hi-IN', 'hi-en', 'mr-IN', 'gu-IN', 'ta-IN'].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Voice</Label>
              <Input value={form.voice} onChange={(e) => setForm({ ...form, voice: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Objective</Label>
              <Input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Call script</Label>
              <Input value={form.script} onChange={(e) => setForm({ ...form, script: e.target.value })} className="h-9 text-sm font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max calls / day</Label>
              <Input type="number" value={form.maxCallsPerDay} onChange={(e) => setForm({ ...form, maxCallsPerDay: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max attempts / contact</Label>
              <Input type="number" value={form.maxAttempts} onChange={(e) => setForm({ ...form, maxAttempts: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Calling hours</Label>
              <Input value={form.callingHours} onChange={(e) => setForm({ ...form, callingHours: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Retry policy</Label>
              <Select value={form.retryPolicy} onValueChange={(v) => setForm({ ...form, retryPolicy: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['retry_next_day', 'retry_same_day', 'retry_after_2h', 'no_retry'].map((r) => <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Escalation rule</Label>
              <Input value={form.escalationRule} onChange={(e) => setForm({ ...form, escalationRule: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Success condition</Label>
              <Input value={form.successCondition} onChange={(e) => setForm({ ...form, successCondition: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Failure condition</Label>
              <Input value={form.failureCondition} onChange={(e) => setForm({ ...form, failureCondition: e.target.value })} className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={submit} disabled={busy}>{busy ? 'Creating…' : 'Create campaign'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ══════════════════════════════════════════════════════════
   RFQ SUPPLIER CALL AGENT — spec §9
   ══════════════════════════════════════════════════════════ */

const RFQ_STAGES = [
  { key: 'RFQ created', detail: 'Buyer requirement captured as an RFQ', tone: 'emerald', icon: FileText },
  { key: 'AI matching', detail: 'Supplier pool ranked by capability and past response rate', tone: 'violet', icon: Sparkles },
  { key: 'Supplier selected', detail: 'Target supplier chosen for the requirement', tone: 'blue', icon: Users },
  { key: 'WhatsApp sent', detail: 'Structured RFQ summary pushed on WhatsApp', tone: 'emerald', icon: MessageSquare },
  { key: 'No response', detail: 'Waiting window elapsed without a reply', tone: 'amber', icon: Clock },
  { key: 'AI call placed', detail: 'The RFQ Follow-up Agent calls the supplier', tone: 'violet', icon: PhoneCall },
  { key: 'Supplier answers', detail: 'Agent verifies product, quantity and availability', tone: 'emerald', icon: Radio },
  { key: 'Structured extraction', detail: 'Price, MOQ, delivery, payment terms, GST captured', tone: 'violet', icon: Sparkles },
  { key: 'Quote created', detail: 'Supplier quote written back to the RFQ', tone: 'teal', icon: Target },
  { key: 'Buyer notified', detail: 'Buyer receives the comparable quote', tone: 'blue', icon: Send },
  { key: 'CRM activity + RFQ updated', detail: 'Operating memory updated and workflow triggered', tone: 'emerald', icon: Layers },
]

const VERIFY_FIELDS = [
  'Product', 'Quantity', 'Price', 'MOQ', 'Availability', 'Delivery timeline',
  'Location', 'Payment terms', 'GST / company information',
]

export function RfqFollowUpPage() {
  const { data } = useVoiceApi<any>('/voice/campaigns')
  const calls = useVoiceApi<any>('/voice/calls?intent=RFQ%20Follow-up&limit=25')
  const { simulate } = useSimulation()
  const [active, setActive] = useState(0)

  const rfqCampaign = (data?.campaigns ?? []).find((c: any) => c.code === 'CMP-RFQ-FOLLOWUP') ?? (data?.campaigns ?? [])[0]

  return (
    <PageShell
      icon={<FileText className="w-5 h-5 text-emerald-600" />}
      title="RFQ Supplier Call Agent"
      subtitle="What happens when an RFQ goes out and the supplier does not answer"
      actions={
        <Button size="sm" onClick={() => {
          simulate('RFQ follow-up campaign triggered', 'Every supplier with an unanswered RFQ older than the waiting window would be queued for an AI call.')
        }}>
          <Zap className="w-3.5 h-3.5 mr-1.5" />Run follow-up sweep
        </Button>
      }
    >
      <SimBanner banner={data?.banner} />

      {rfqCampaign && (
        <KpiGrid cols={5}>
          <KpiTile label="Campaign" value={<span className="text-sm">{rfqCampaign.name}</span>} caption={rfqCampaign.code} icon={<Zap className="w-4 h-4" />} tone="emerald" />
          <KpiTile label="Targets" value={fmtNum(rfqCampaign.totalTargets)} icon={<Users className="w-4 h-4" />} tone="blue" />
          <KpiTile label="Called" value={fmtNum(rfqCampaign.totalCalled)} caption={fmtPct(rfqCampaign.progress, 1) + ' complete'} icon={<PhoneCall className="w-4 h-4" />} tone="violet" />
          <KpiTile label="Connected" value={fmtNum(rfqCampaign.totalConnected)} caption={fmtPct(rfqCampaign.connectionRate, 1) + ' connect rate'} icon={<Radio className="w-4 h-4" />} tone="teal" />
          <KpiTile label="Quotes won" value={fmtNum(rfqCampaign.totalSuccess)} caption={fmtPct(rfqCampaign.successRate, 1) + ' success rate'} icon={<Target className="w-4 h-4" />} tone="emerald" />
        </KpiGrid>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <Panel title="RFQ → call workflow" subtitle="Click any stage to see what it does">
            <div className="space-y-1">
              {RFQ_STAGES.map((s, i) => {
                const Icon = s.icon
                const isActive = active === i
                return (
                  <div key={s.key} className="flex flex-col">
                    <button onClick={() => setActive(i)}
                      className={cn('flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-colors',
                        isActive ? 'border-emerald-300 bg-emerald-50/60' : 'border-gray-100 hover:bg-gray-50')}>
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                        s.tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        s.tone === 'violet' ? 'bg-violet-50 text-violet-600' :
                        s.tone === 'amber' ? 'bg-amber-50 text-amber-600' :
                        s.tone === 'blue' ? 'bg-blue-50 text-blue-600' :
                        s.tone === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-600')}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900">{s.key}</p>
                        <p className="text-[11px] text-gray-500">{s.detail}</p>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">#{i + 1}</span>
                    </button>
                    {i < RFQ_STAGES.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-gray-300 self-center my-0.5 rotate-90" />}
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Panel title="What the agent verifies on the call">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-50 border border-violet-100 mb-3">
              <Bot className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-violet-900">
                The agent never pressures on price. It confirms each fact once, restates it, then writes it to the RFQ.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VERIFY_FIELDS.map((f) => (
                <div key={f} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Sample RFQ follow-up transcript" subtitle="The shape of a real supplier call">
            <div className="space-y-3">
              <Bubble speaker="AI agent" text="Hello, this is the VyaparSethu supplier assistant calling regarding an RFQ for stainless steel components. Is this a good time?" />
              <Bubble speaker="Supplier" text="Yes." />
              <Bubble speaker="AI agent" text="Can you supply 500 units within 15 days?" />
              <Bubble speaker="Supplier" text="Yes, but we need 18 days." />
              <Bubble speaker="AI agent" text="Understood. What would be your price per unit?" />
              <Bubble speaker="Supplier" text="₹240 per unit." />
              <Bubble speaker="AI agent" text="Thank you. I have recorded ₹240 per unit and an 18-day delivery timeline." />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-gray-100">
              <StatBlock value="500" label="Quantity" />
              <StatBlock value="₹240" label="Price / unit" />
              <StatBlock value="18 days" label="Delivery" />
              <StatBlock value="Confirmed" label="Availability" />
              <StatBlock value="96%" label="Confidence" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button size="sm" onClick={() => simulate('Quote created', 'A supplier quote for 500 units at ₹240 was drafted against the RFQ.')}>
                <Target className="w-3.5 h-3.5 mr-1.5" />Create quote
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulate('RFQ updated', 'RFQ status moved to “supplier responded”.')}>Update RFQ</Button>
              <Button size="sm" variant="outline" onClick={() => simulate('WhatsApp summary sent', 'The buyer was sent a structured summary on WhatsApp.')}>Notify buyer</Button>
            </div>
          </Panel>

          <Panel title="Recent RFQ follow-up calls" subtitle={`${(calls.data?.calls ?? []).length} most recent`}>
            {calls.loading && !calls.data ? <LoadingBlock /> : (
              <div className="space-y-2">
                {(calls.data?.calls ?? []).map((c: any) => (
                  <div key={c.id} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[11px] font-mono text-gray-500">{c.ref}</span>
                    <span className="text-xs font-medium text-gray-900">{c.contactName}</span>
                    <span className="text-[11px] text-gray-500">{c.company}</span>
                    <StatusBadge status={c.status} />
                    {c.quoteAmount ? <Badge variant="secondary" className="text-[10px] h-5 bg-teal-50 text-teal-700">₹{Math.round(c.quoteAmount)}</Badge> : null}
                    <span className="text-[11px] text-gray-500 ml-auto tabular-nums">{fmtDuration(c.durationSec)} · {fmtWhen(c.createdAt)}</span>
                  </div>
                ))}
                {(calls.data?.calls ?? []).length === 0 && <EmptyState icon={<PhoneCall className="w-5 h-5" />} title="No RFQ follow-up calls yet" />}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </PageShell>
  )
}

function Bubble({ speaker, text }: { speaker: string; text: string }) {
  const isAi = speaker === 'AI agent'
  return (
    <div className="flex items-start gap-2.5">
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
        isAi ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600')}>
        {isAi ? <Bot className="w-3.5 h-3.5" /> : 'C'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">{speaker}</p>
        <div className={cn('p-3 rounded-lg border text-xs leading-relaxed',
          isAi ? 'bg-violet-50 border-violet-100 text-violet-900' : 'bg-gray-50 border-gray-200 text-gray-800')}>
          {text}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   INBOUND AI RECEPTIONIST — spec §11
   ══════════════════════════════════════════════════════════ */

export function AiReceptionist({ onOpenCall }: { onOpenCall: (ref: string) => void }) {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/receptionist')
  const { simulate } = useSimulation()
  const [simulating, setSimulating] = useState(false)

  const intents: any[] = data?.intents ?? []
  const recent: any[] = data?.recent ?? []
  const stats: Record<string, any> = data?.stats ?? {}
  const capabilities: any[] = data?.capabilities ?? []

  const simulateInbound = async () => {
    setSimulating(true)
    try {
      const res = await voiceFetch('/voice/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ action: 'inbound_call', payload: { demo: true } }),
      })
      const body = await res.json().catch(() => ({}))
      simulate(body?.message ?? 'Inbound call simulated', body?.detail ?? 'A caller would be answered by the AI receptionist.')
      refetch()
    } catch {
      simulate('Inbound call simulated', 'A caller would be answered by the AI receptionist, identified, then routed by intent.')
    } finally {
      setSimulating(false)
    }
  }

  return (
    <PageShell
      icon={<PhoneIncoming className="w-5 h-5 text-blue-600" />}
      title="AI Business Receptionist"
      subtitle="Answers inbound calls, identifies the caller, resolves the intent or routes it"
      actions={
        <>
          <Button size="sm" onClick={simulateInbound} disabled={simulating}>
            <PhoneIncoming className="w-3.5 h-3.5 mr-1.5" />{simulating ? 'Simulating…' : 'Simulate inbound call'}
          </Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      <SimBanner banner={data?.banner} />

      <KpiGrid cols={4}>
        <KpiTile label="Inbound today" value={fmtNum(stats.inboundToday)} icon={<PhoneIncoming className="w-4 h-4" />} tone="blue" />
        <KpiTile label="AI resolved" value={fmtNum(stats.aiResolved)} caption={fmtPct(stats.inboundToday ? (stats.aiResolved / stats.inboundToday) * 100 : 0, 1) + ' containment'} icon={<Bot className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Transferred" value={fmtNum(stats.transferred)} icon={<ShieldAlert className="w-4 h-4" />} tone="amber" />
        <KpiTile label="Missed" value={fmtNum(stats.missed)} icon={<Clock className="w-4 h-4" />} tone="red" />
      </KpiGrid>

      {error && <ErrorBlock error={error} onRetry={refetch} />}

      <Panel title="Receptionist capabilities" subtitle="What the inbound agent is allowed to do">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {capabilities.map((c: string) => (
            <div key={c} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="text-[11px] text-gray-700">{c}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Intent routing table" subtitle="Approved answers and where each intent goes">
        <div className="overflow-x-auto">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Intent</TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Approved answer / action</TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Route</TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Calls</TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Resolved</TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Escalated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intents.map((it: any) => (
                <TableRow key={it.intent} className="hover:bg-gray-50/60">
                  <TableCell className="text-xs font-medium text-gray-900">{it.intent}</TableCell>
                  <TableCell className="text-xs text-gray-600 max-w-md">{it.answer}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn('text-[10px] h-5',
                      /human|founder/i.test(it.route) ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700')}>
                      {it.route}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-gray-700">{fmtNum(it.calls)}</TableCell>
                  <TableCell className="text-xs tabular-nums text-emerald-700">{fmtNum(it.resolved)}</TableCell>
                  <TableCell className="text-xs tabular-nums text-amber-700">{fmtNum(it.escalated)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <Panel title="Recent inbound calls" subtitle={`${recent.length} most recent`}>
        {loading && !data ? <LoadingBlock /> : (
          <div className="space-y-2">
            {recent.map((c: any) => (
              <div key={c.id} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50/60 cursor-pointer" onClick={() => onOpenCall(c.ref)}>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <PhoneIncoming className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900">{c.contactName}</p>
                  <p className="text-[11px] text-gray-500">{c.company}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] h-5 bg-gray-100 text-gray-600">{c.intent}</Badge>
                <StatusBadge status={c.status} />
                <span className="text-[10px] font-mono text-gray-400">{c.phoneMasked}</span>
                <span className="text-[11px] text-gray-500 ml-auto tabular-nums">{fmtWhen(c.createdAt)}</span>
              </div>
            ))}
            {recent.length === 0 && <EmptyState icon={<PhoneIncoming className="w-5 h-5" />} title="No inbound calls yet" />}
          </div>
        )}
      </Panel>
    </PageShell>
  )
}
