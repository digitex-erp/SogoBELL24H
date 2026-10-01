import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowDown, Bot, Check, ChevronRight, CircleSlash, Clock, Copy,
  Database, FileText, GitBranch, Globe, Info, Layers, Mic, Pause, Play, Plus,
  RotateCcw, Save, ShieldAlert, Sparkles, Split, Square, Target, Terminal,
  UserCheck, Variable, Wand2, Wrench, X, Zap,
} from 'lucide-react'
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
  fmtNum, fmtPct, fmtWhen, useSimulation, useVoiceApi, voicePost, voicePatch,
} from './shared'

/* ══════════════════════════════════════════════════════════
   VOICE AGENT BUILDER — spec §7
   ══════════════════════════════════════════════════════════ */

const NODE_ICON: Record<string, any> = {
  start: Play, action: Zap, decision: Split, extract: Sparkles, integration: Database, escalate: ShieldAlert, end: Square,
}
const NODE_TONE: Record<string, string> = {
  start: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  action: 'bg-blue-50 border-blue-200 text-blue-700',
  decision: 'bg-amber-50 border-amber-200 text-amber-700',
  extract: 'bg-violet-50 border-violet-200 text-violet-700',
  integration: 'bg-teal-50 border-teal-200 text-teal-700',
  escalate: 'bg-orange-50 border-orange-200 text-orange-700',
  end: 'bg-gray-100 border-gray-200 text-gray-700',
}

export function VoiceAgentBuilder({ onOpenFlow }: { onOpenFlow: (agentKey: string) => void }) {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/agents')
  const [selected, setSelected] = useState<string | null>(null)
  const { show, node } = useToast()
  const { simulate } = useSimulation()
  const [createOpen, setCreateOpen] = useState(false)

  const agents: any[] = data?.agents ?? []
  const detail = useVoiceApi<any>(selected ? `/voice/agents/${selected}` : null, [selected])
  const agent: any = detail.data?.agent
  const [draft, setDraft] = useState<any>(null)

  useEffect(() => {
    if (agent) setDraft({ ...agent })
  }, [agent])

  useEffect(() => {
    if (!selected && agents.length) setSelected(agents[0].key)
  }, [agents, selected])

  const save = async () => {
    if (!draft) return
    try {
      await voicePatch(`/voice/agents/${draft.key}`, {
        name: draft.name, purpose: draft.purpose, personality: draft.personality,
        language: draft.language, voiceName: draft.voiceName, businessContext: draft.businessContext,
        systemObjective: draft.systemObjective, status: draft.status,
        maxCallsPerDay: Number(draft.maxCallsPerDay) || 0,
        escalationThreshold: Number(draft.escalationThreshold) || 0,
      })
      show('Agent saved')
      simulate('Agent configuration saved', `${draft.name} would be redeployed to the voice server with the new prompt.`)
      refetch()
      detail.refetch()
    } catch (e: any) {
      simulate('Save simulated', `Server said: ${e?.message ?? 'unknown'}. In the prototype the change is still shown locally.`)
    }
  }

  const toggleStatus = () => {
    if (!draft) return
    const next = draft.status === 'active' ? 'paused' : 'active'
    setDraft({ ...draft, status: next })
    simulate(next === 'active' ? 'Agent enabled' : 'Agent disabled',
      `${draft.name} is now ${next}. The founder can disable any agent instantly — the engine will stop picking up its queue jobs.`)
    refetch()
  }

  return (
    <PageShell
      icon={<Bot className="w-5 h-5 text-emerald-600" />}
      title="AI Voice Agent Builder"
      subtitle="Define who each agent is, what it may do and when it must hand over to a human"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}><Plus className="w-3.5 h-3.5 mr-1.5" />New agent</Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      {node}
      <SimBanner banner={data?.banner} />

      <KpiGrid cols={4}>
        <KpiTile label="Agents" value={fmtNum(agents.length)} caption={`${agents.filter((a: any) => a.status === 'active').length} active`} icon={<Bot className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Total calls" value={fmtNum(agents.reduce((s: number, a: any) => s + (a.totalCalls ?? 0), 0))} icon={<Mic className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Avg resolution" value={fmtPct(agents.length ? agents.reduce((s: number, a: any) => s + (a.resolutionRate ?? 0), 0) / agents.length * 100 : 0, 1)} icon={<Target className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Paused" value={fmtNum(agents.filter((a: any) => a.status !== 'active').length)} caption="Not answering the queue" icon={<Pause className="w-4 h-4" />} tone="amber" />
      </KpiGrid>

      {error && <ErrorBlock error={error} onRetry={refetch} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Agent list */}
        <div className="lg:col-span-4 xl:col-span-3">
          <Panel title="Agent fleet" subtitle={`${agents.length} configured agents`}>
            <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              {agents.map((a: any) => (
                <button key={a.key} onClick={() => setSelected(a.key)}
                  className={cn('w-full text-left p-2.5 rounded-lg border transition-colors',
                    selected === a.key ? 'border-emerald-300 bg-emerald-50/60' : 'border-gray-100 hover:bg-gray-50')}>
                  <div className="flex items-start gap-2">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                      a.status === 'active' ? 'bg-violet-50 text-violet-600' : 'bg-gray-100 text-gray-400')}>
                      {a.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">{a.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{a.role}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500 tabular-nums">
                    <span>{fmtNum(a.totalCalls)} calls</span>
                    <span>·</span>
                    <span>{fmtPct(a.resolutionRate)} resolved</span>
                    <span>·</span>
                    <span>{a.language}</span>
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* Agent detail / editor */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {detail.loading && !detail.data && <LoadingBlock label="Loading agent definition…" />}
          {detail.error && <ErrorBlock error={detail.error} onRetry={detail.refetch} />}

          {draft && (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                      draft.status === 'active' ? 'bg-violet-50 text-violet-600' : 'bg-gray-100 text-gray-400')}>
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-gray-900">{draft.name}</h2>
                        <StatusBadge status={draft.status} />
                        <SiteApproval state={draft.approvalState} />
                        <SimTag className="ml-auto" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 font-mono">{draft.key}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                    <StatBlock value={fmtNum(draft.totalCalls)} label="Calls handled" />
                    <StatBlock value={fmtPct(draft.resolutionRate)} label="Resolution" />
                    <StatBlock value={`${Math.round((draft.escalationThreshold ?? 0) * 100)}%`} label="Escalation at" />
                    <StatBlock value={fmtNum(draft.maxCallsPerDay)} label="Max calls / day" />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                    <Button size="sm" onClick={save}><Save className="w-3.5 h-3.5 mr-1.5" />Save agent</Button>
                    <Button size="sm" variant="outline" onClick={toggleStatus}>
                      {draft.status === 'active' ? <><Pause className="w-3.5 h-3.5 mr-1.5" />Disable agent</> : <><Play className="w-3.5 h-3.5 mr-1.5" />Enable agent</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onOpenFlow(draft.key)}>
                      <GitBranch className="w-3.5 h-3.5 mr-1.5" />Call flow
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => simulate('Test call queued', `${draft.name} would place one simulated call to a sandbox contact so you can hear the prompt.`)}>
                      <Play className="w-3.5 h-3.5 mr-1.5" />Test call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="identity">
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="identity" className="text-xs"><UserCheck className="w-3.5 h-3.5 mr-1" /> Identity</TabsTrigger>
                  <TabsTrigger value="objective" className="text-xs"><Target className="w-3.5 h-3.5 mr-1" /> Objective</TabsTrigger>
                  <TabsTrigger value="tools" className="text-xs"><Wrench className="w-3.5 h-3.5 mr-1" /> Tools</TabsTrigger>
                  <TabsTrigger value="knowledge" className="text-xs"><Database className="w-3.5 h-3.5 mr-1" /> Knowledge</TabsTrigger>
                  <TabsTrigger value="rules" className="text-xs"><Split className="w-3.5 h-3.5 mr-1" /> Decision rules</TabsTrigger>
                  <TabsTrigger value="guard" className="text-xs"><ShieldAlert className="w-3.5 h-3.5 mr-1" /> Escalation & limits</TabsTrigger>
                  <TabsTrigger value="criteria" className="text-xs"><Check className="w-3.5 h-3.5 mr-1" /> Success criteria</TabsTrigger>
                </TabsList>

                <TabsContent value="identity" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Panel title="Identity & voice">
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Agent name</Label>
                          <Input value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-9 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Role</Label>
                          <Input value={draft.role ?? ''} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className="h-9 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Language</Label>
                            <Select value={draft.language ?? ''} onValueChange={(v) => setDraft({ ...draft, language: v })}>
                              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {(data?.voices ?? ['en-IN', 'hi-IN', 'hi-en']).map((l: string) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Voice</Label>
                            <Select value={draft.voiceName ?? ''} onValueChange={(v) => setDraft({ ...draft, voiceName: v })}>
                              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {[...new Set([draft.voiceName, 'Ananya (Indian English)', 'Neha (Indian English)', 'Ishaan (Hinglish)', 'Rohan (Hindi)'].filter(Boolean))].map((v: any) => (
                                  <SelectItem key={String(v)} value={String(v)}>{String(v)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Working hours</Label>
                          <Input value={draft.workingHours ?? ''} onChange={(e) => setDraft({ ...draft, workingHours: e.target.value })} className="h-9 text-sm" />
                        </div>
                      </div>
                    </Panel>

                    <Panel title="Purpose & personality">
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Purpose</Label>
                          <Textarea value={draft.purpose ?? ''} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })} className="text-sm min-h-[70px]" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Personality</Label>
                          <Textarea value={draft.personality ?? ''} onChange={(e) => setDraft({ ...draft, personality: e.target.value })} className="text-sm min-h-[70px]" />
                        </div>
                      </div>
                    </Panel>
                  </div>
                  <Panel title="Business context" subtitle="What the agent knows about Bell24h-OS / VyaparSethu">
                    <Textarea value={draft.businessContext ?? ''} onChange={(e) => setDraft({ ...draft, businessContext: e.target.value })} className="text-sm min-h-[110px]" />
                  </Panel>
                </TabsContent>

                <TabsContent value="objective" className="space-y-4">
                  <Panel title="System objective" subtitle="The single goal the agent optimises for">
                    <Textarea value={draft.systemObjective ?? ''} onChange={(e) => setDraft({ ...draft, systemObjective: e.target.value })} className="text-sm min-h-[140px]" />
                  </Panel>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Panel title="Success criteria" subtitle="What a win looks like">
                      <Bullets text={draft.successCriteria} />
                    </Panel>
                    <Panel title="Failure criteria" subtitle="What counts as a miss">
                      <Bullets text={draft.failureCriteria} />
                    </Panel>
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Panel title="Allowed actions" subtitle="Tools this agent may call">
                      <div className="space-y-2">
                        <ChipList items={splitList(draft.tools)} tone="emerald" />
                        <ChipList items={splitList(draft.allowedActions)} tone="blue" />
                        {!splitList(draft.tools).length && !splitList(draft.allowedActions).length && (
                          <EmptyState icon={<Wrench className="w-5 h-5" />} title="No tools granted" />
                        )}
                      </div>
                    </Panel>
                    <Panel title="Restricted actions" subtitle="Hard limits the agent must never cross">
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 mb-3">
                        <CircleSlash className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-800">These are enforced server-side. A restricted action always escalates to the founder instead of executing.</p>
                      </div>
                      <ChipList items={splitList(draft.restrictedActions)} tone="red" />
                    </Panel>
                  </div>
                </TabsContent>

                <TabsContent value="knowledge" className="space-y-4">
                  <Panel title="Knowledge base" subtitle="Approved sources the agent may quote">
                    <Bullets text={draft.knowledgeBase} />
                  </Panel>
                </TabsContent>

                <TabsContent value="rules" className="space-y-4">
                  <Panel title="Decision rules" subtitle="If / then logic used during the call">
                    <Bullets text={draft.decisionRules} mono />
                  </Panel>
                </TabsContent>

                <TabsContent value="guard" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Panel title="Escalation rules" subtitle="When the agent hands the call to a human">
                      <Bullets text={draft.escalationRules} />
                    </Panel>
                    <Panel title="Call limits & supervision">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Max calls per day</Label>
                          <Input type="number" value={draft.maxCallsPerDay ?? 0}
                            onChange={(e) => setDraft({ ...draft, maxCallsPerDay: e.target.value })} className="h-9 text-sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-gray-500">Escalate below confidence</span>
                            <span className="font-semibold tabular-nums text-gray-900">{Math.round((draft.escalationThreshold ?? 0) * 100)}%</span>
                          </div>
                          <input type="range" min={0} max={100} step={1} value={Math.round((draft.escalationThreshold ?? 0) * 100)}
                            onChange={(e) => setDraft({ ...draft, escalationThreshold: Number(e.target.value) / 100 })}
                            className="w-full accent-emerald-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                          <div>
                            <p className="text-xs font-medium text-gray-800">Agent enabled</p>
                            <p className="text-[11px] text-gray-500">Founder override — takes effect immediately</p>
                          </div>
                          <Switch checked={draft.status === 'active'} onCheckedChange={toggleStatus} />
                        </div>
                      </div>
                    </Panel>
                  </div>
                </TabsContent>

                <TabsContent value="criteria" className="space-y-4">
                  <Panel title="Recent calls handled by this agent" subtitle={`${(detail.data?.recentCalls ?? []).length} most recent`}>
                    <div className="space-y-2">
                      {(detail.data?.recentCalls ?? []).map((c: any) => (
                        <div key={c.id} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-[11px] font-mono text-gray-500">{c.ref}</span>
                          <span className="text-xs font-medium text-gray-900">{c.contactName}</span>
                          <span className="text-[11px] text-gray-500">{c.company}</span>
                          <StatusBadge status={c.status} />
                          <span className="text-[11px] text-gray-500 ml-auto tabular-nums">{Math.round((c.confidence ?? 0) * 100)}% · {fmtWhen(c.createdAt)}</span>
                        </div>
                      ))}
                      {(detail.data?.recentCalls ?? []).length === 0 && <EmptyState icon={<Mic className="w-5 h-5" />} title="No calls yet" />}
                    </div>
                  </Panel>
                  <Panel title="Campaigns using this agent">
                    <div className="space-y-2">
                      {(detail.data?.campaigns ?? []).map((c: any) => (
                        <div key={c.id} className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{c.code}</p>
                          </div>
                          <div className="w-32"><Meter value={c.progress} /></div>
                          <StatusBadge status={c.status} />
                        </div>
                      ))}
                      {(detail.data?.campaigns ?? []).length === 0 && <EmptyState icon={<Layers className="w-5 h-5" />} title="No campaigns linked" />}
                    </div>
                  </Panel>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      <CreateAgentDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={() => { refetch(); simulate('Agent created', 'The new agent would be added to the voice server and start empty until a flow is attached.') }} />
    </PageShell>
  )
}

function SiteApproval({ state }: { state?: string }) {
  const tone = state === 'approved' ? 'bg-emerald-50 text-emerald-700' : state === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
  return <Badge variant="secondary" className={cn('text-[10px] h-5', tone)}>approval: {state ?? 'unknown'}</Badge>
}

function Bullets({ text, mono }: { text?: string | null; mono?: boolean }) {
  const items = splitList(text)
  if (!items.length) return <EmptyState icon={<Info className="w-5 h-5" />} title="Nothing defined" />
  return (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
          <span className={cn('text-xs text-gray-700 leading-relaxed', mono && 'font-mono text-[11px]')}>{t}</span>
        </li>
      ))}
    </ul>
  )
}

function splitList(value?: string | null): string[] {
  if (!value) return []
  const raw = String(value)
  const parts = raw.includes('\n') ? raw.split('\n') : raw.includes('; ') ? raw.split('; ') : raw.split(/,\s(?=[A-Z])/)
  return parts.map((s) => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean).slice(0, 24)
}

function CreateAgentDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', purpose: '', role: 'Outbound', language: 'en-IN', maxCallsPerDay: '50' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    if (!form.name.trim()) { setErr('Agent name is required'); return }
    setBusy(true); setErr(null)
    try {
      await voicePost('/voice/agents', {
        name: form.name, purpose: form.purpose, role: form.role, language: form.language,
        maxCallsPerDay: Number(form.maxCallsPerDay) || 50,
      })
      onOpenChange(false)
      setForm({ name: '', purpose: '', role: 'Outbound', language: 'en-IN', maxCallsPerDay: '50' })
      onCreated()
    } catch (e: any) {
      setErr(e?.message ?? 'Could not create the agent')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">New voice agent</DialogTitle>
          <DialogDescription className="text-xs">The prototype stores the definition and clearly labels it simulated.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {err && <ErrorBlock error={err} />}
          <div className="space-y-1.5">
            <Label className="text-xs">Agent name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Freight Quote Agent" className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Purpose</Label>
            <Textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="One sentence on what this agent is for" className="text-sm min-h-[70px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Language</Label>
              <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['en-IN', 'hi-IN', 'hi-en', 'mr-IN', 'gu-IN', 'ta-IN', 'te-IN', 'bn-IN'].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max calls per day</Label>
            <Input type="number" value={form.maxCallsPerDay} onChange={(e) => setForm({ ...form, maxCallsPerDay: e.target.value })} className="h-9 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={submit} disabled={busy}>{busy ? 'Creating…' : 'Create agent'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ══════════════════════════════════════════════════════════
   VISUAL CALL FLOW BUILDER — spec §8
   ══════════════════════════════════════════════════════════ */

interface FlowNode { id: string; type: string; label: string; detail?: string; branch?: string }

/**
 * The agent runtime returns `nodeTypes` as a map keyed by node type
 * (`{ start: { label, tone }, ... }`), but older payloads returned a plain
 * string array. Normalise both into one shape before anything calls `.map`.
 */
function normalizeNodeTypes(raw: any): Array<{ key: string; label: string; tone?: string }> {
  const fallback = ['start', 'action', 'decision', 'extract', 'integration', 'escalate', 'end']
    .map((k) => ({ key: k, label: k }))
  if (!raw) return fallback
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === 'string' ? { key: item, label: item } : { key: String(item?.key ?? item?.name ?? ''), label: String(item?.label ?? item?.key ?? '') }))
      .filter((n) => n.key)
  }
  if (typeof raw === 'object') {
    const entries = Object.entries(raw).map(([k, v]: [string, any]) => ({ key: k, label: String(v?.label ?? k), tone: v?.tone }))
    return entries.length ? entries : fallback
  }
  return fallback
}

interface FlowEdge { from: string; to: string; label?: string }

/**
 * `callFlow` from the agent runtime is a designed graph — `{ nodes: [...], edges: [...] }`
 * where each node already carries its own type, label, detail and branch. Older rows
 * stored a newline-delimited prompt instead, so both shapes are supported.
 */
function parseEdges(raw: any): FlowEdge[] {
  const edges = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw.edges : undefined
  if (!Array.isArray(edges)) return []
  return edges
    .map((e: any) => ({ from: String(e?.from ?? ''), to: String(e?.to ?? ''), label: e?.label ? String(e.label) : undefined }))
    .filter((e) => e.from && e.to)
}

function parseFlow(agentKey: string, raw: any, nodeTypes: string[]): FlowNode[] {
  const graphNodes = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw.nodes : Array.isArray(raw) ? raw : null
  if (Array.isArray(graphNodes) && graphNodes.length) {
    return graphNodes.map((n: any, i: number) => ({
      id: String(n?.id ?? `${agentKey}-${i}`),
      type: String(n?.type ?? 'action'),
      label: String(n?.label ?? n?.name ?? n?.id ?? `Step ${i + 1}`),
      detail: n?.detail ? String(n.detail) : undefined,
      branch: n?.branch ? String(n.branch) : undefined,
    }))
  }

  const lines = String(raw ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
  const nodes: FlowNode[] = []
  let inRetry = false

  lines.forEach((line, i) => {
    const isRetry = /^retry|no answer|voicemail|not answered/i.test(line)
    const isBranch = /^(if|when)\b/i.test(line)
    const isEscalate = /escalat|human|transfer/i.test(line)
    const isExtract = /extract|capture|record|verify/i.test(line)
    const isIntegration = /crm|rfq|quote|whatsapp|notify|update/i.test(line)
    const isEnd = /^(end|close|wrap)/i.test(line)
    let type = 'action'
    if (i === 0) type = 'start'
    else if (isEnd) type = 'end'
    else if (isEscalate) type = 'escalate'
    else if (isBranch) type = 'decision'
    else if (isExtract) type = 'extract'
    else if (isIntegration) type = 'integration'
    nodes.push({
      id: `${agentKey}-${i}`,
      type,
      label: line.replace(/^(→|->|•)\s*/, ''),
      branch: isRetry ? 'Retry / no answer' : isEscalate ? 'Human required' : undefined,
    })
  })
  if (!nodes.length) {
    return [
      { id: 'n1', type: 'start', label: 'START — campaign selects this agent' },
      { id: 'n2', type: 'action', label: 'Load contact and check calling permission' },
      { id: 'n3', type: 'decision', label: 'Answered?', detail: 'No → retry policy and schedule a callback' },
      { id: 'n4', type: 'action', label: 'Introduce agent, identify person and intent' },
      { id: 'n5', type: 'extract', label: 'Ask objective questions and extract structured data' },
      { id: 'n6', type: 'integration', label: 'Update CRM, RFQ, supplier and buyer records' },
      { id: 'n7', type: 'decision', label: 'Decision — qualified / callback / human required' },
      { id: 'n8', type: 'escalate', label: 'Escalate to founder when authority is exceeded' },
      { id: 'n9', type: 'end', label: 'END — log outcome and trigger workflow' },
    ]
  }
  return nodes
}

export function CallFlowBuilder({ agentKey, onSelectAgent }: { agentKey: string | null; onSelectAgent: (k: string) => void }) {
  const { data: agentsData } = useVoiceApi<any>('/voice/agents')
  const key = agentKey ?? agentsData?.agents?.[0]?.key ?? null
  const { data, loading, error, refetch } = useVoiceApi<any>(key ? `/voice/agents/${key}` : null, [key])
  const { simulate } = useSimulation()
  const [inspected, setInspected] = useState<FlowNode | null>(null)
  const [showJson, setShowJson] = useState(false)

  const agent: any = data?.agent
  const nodeTypes = useMemo(() => normalizeNodeTypes(data?.nodeTypes), [data])
  const nodes = useMemo(() => parseFlow(key ?? 'agent', agent?.callFlow, nodeTypes.map((n) => n.key)), [key, agent, nodeTypes])
  const edges = useMemo(() => parseEdges(agent?.callFlow), [agent])
  const nodeLabel = useCallback((id: string) => nodes.find((n) => n.id === id)?.label ?? id, [nodes])
  const outgoing = useCallback((id: string) => edges.filter((e) => e.from === id), [edges])

  const retryNodes = nodes.filter((n) => n.branch === 'Retry / no answer' || n.branch === 'no')
  const humanNodes = nodes.filter((n) => n.type === 'escalate')
  const decisionNodes = nodes.filter((n) => n.type === 'decision')

  return (
    <PageShell
      icon={<GitBranch className="w-5 h-5 text-emerald-600" />}
      title="Call Flow Builder"
      subtitle="Node-based editor for the conversation the agent runs from answer to outcome"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setShowJson((v) => !v)}><Terminal className="w-3.5 h-3.5 mr-1.5" />{showJson ? 'Hide' : 'Show'} spec</Button>
          <Button variant="outline" size="sm" onClick={() => simulate('Flow published', `The flow for ${agent?.name ?? key} would be pushed to the voice server as a new graph version.`)}><Save className="w-3.5 h-3.5 mr-1.5" />Publish flow</Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      <SimBanner banner={agentsData?.banner} />

      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-xs text-gray-500">Agent</Label>
        <Select value={key ?? ''} onValueChange={onSelectAgent}>
          <SelectTrigger className="h-9 w-[240px] text-sm"><SelectValue placeholder="Pick an agent" /></SelectTrigger>
          <SelectContent>
            {(agentsData?.agents ?? []).map((a: any) => <SelectItem key={a.key} value={a.key}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap items-center gap-1.5 ml-auto">
          {nodeTypes.map((n) => (
            <span key={n.key} className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize',
              n.tone ?? NODE_TONE[n.key] ?? 'bg-gray-100 border-gray-200 text-gray-700')}>{n.label}</span>
          ))}
        </div>
      </div>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock label="Loading flow graph…" />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 xl:col-span-9">
          <Panel title={`Flow — ${agent?.name ?? 'agent'}`} subtitle={`${nodes.length} nodes · drag-and-drop is visual only in the prototype`}
            actions={<Badge variant="secondary" className="text-[10px] h-5 bg-violet-50 text-violet-700">graph v{agent?.version ?? 1}</Badge>}>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex flex-col items-center">
                {nodes.map((n, i) => {
                  const Icon = NODE_ICON[n.type] ?? Zap
                  const isDecision = n.type === 'decision'
                  return (
                    <div key={n.id} className="w-full flex flex-col items-center">
                      <button onClick={() => setInspected(n)}
                        className={cn('group w-full max-w-xl text-left rounded-xl border-2 bg-white p-3 transition-shadow hover:shadow-md',
                          NODE_TONE[n.type], inspected?.id === n.id && 'ring-2 ring-emerald-400')}>
                        <div className="flex items-start gap-2.5">
                          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/70 border', NODE_TONE[n.type])}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">{n.type}</span>
                              <span className="text-[10px] font-mono opacity-50">#{i + 1}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-900 mt-0.5">{n.label}</p>
                            {n.detail && <p className="text-[11px] text-gray-500 mt-0.5">{n.detail}</p>}
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 flex-shrink-0" />
                        </div>
                      </button>

                      {i < nodes.length - 1 && (
                        <div className="flex items-center gap-2 py-1.5">
                          <ArrowDown className="w-3.5 h-3.5 text-gray-300" />
                          {isDecision && <span className="text-[10px] text-gray-400">branch</span>}
                        </div>
                      )}

                      {isDecision && outgoing(n.id).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl mb-2">
                          {outgoing(n.id).map((e) => {
                            const negative = /^(no|blocked|false|declined)$/i.test(e.label ?? '')
                            return (
                              <div key={`${e.from}-${e.to}`}
                                className={cn('rounded-lg border p-2',
                                  negative ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50')}>
                                <p className={cn('text-[10px] font-semibold uppercase tracking-wide',
                                  negative ? 'text-amber-700' : 'text-emerald-700')}>
                                  {e.label ?? 'next'} → {nodeLabel(e.to)}
                                </p>
                                <p className={cn('text-[11px] mt-0.5', negative ? 'text-amber-800' : 'text-emerald-800')}>
                                  {nodes.find((x) => x.id === e.to)?.detail ?? `Continue to ${nodeLabel(e.to)}`}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      )}
                      {isDecision && outgoing(n.id).length === 0 && n.detail && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2 w-full max-w-xl mb-2">
                          <p className="text-[11px] text-amber-800">{n.detail}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </Panel>

          {showJson && (
            <Panel title="Flow specification" subtitle="The raw text an implementation would compile into a graph">
              <pre className="text-[11px] font-mono text-gray-700 bg-gray-50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
{agent?.callFlow ?? '(no flow defined — using the default template shown above)'}
              </pre>
            </Panel>
          )}
        </div>

        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <Panel title="Node inspector">
            {!inspected ? (
              <EmptyState icon={<Info className="w-5 h-5" />} title="Select a node" hint="Click any node in the graph to inspect its configuration." />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase', NODE_TONE[inspected.type])}>{inspected.type}</span>
                  {inspected.branch && <StatusBadge status="warning" label={inspected.branch} />}
                </div>
                <Field label="Label" value={inspected.label} />
                <Field label="Node id" value={inspected.id} mono />
                {inspected.detail && <Field label="Detail" value={inspected.detail} />}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => simulate('Node edit', `Editing “${inspected.label}” would open the prompt editor for this step.`)}>Edit node</Button>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => simulate('Node duplicated', 'A copy of the node was placed below the original.')}>Duplicate</Button>
                  <Button size="sm" variant="outline" className="w-full text-red-600 hover:bg-red-50" onClick={() => simulate('Node removed', 'The node was removed from the draft graph. Publish to apply.')}>Remove</Button>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Branch summary">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Negative (no / blocked) branches</span>
                <span className="text-xs font-semibold tabular-nums text-gray-900">{retryNodes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Escalation nodes</span>
                <span className="text-xs font-semibold tabular-nums text-gray-900">{humanNodes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Decision nodes</span>
                <span className="text-xs font-semibold tabular-nums text-gray-900">{decisionNodes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Edges</span>
                <span className="text-xs font-semibold tabular-nums text-gray-900">{edges.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total nodes</span>
                <span className="text-xs font-semibold tabular-nums text-gray-900">{nodes.length}</span>
              </div>
            </div>
          </Panel>

          <Panel title="Available node types" subtitle="From the agent runtime schema">
            <div className="space-y-1.5">
              {nodeTypes.map((n) => {
                const Icon = NODE_ICON[n.key] ?? Zap
                return (
                  <div key={n.key} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <Icon className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-700">{n.label}</span>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   CALL SCRIPT STUDIO — spec §17
   ══════════════════════════════════════════════════════════ */

const SCRIPT_SECTIONS = [
  { key: 'opening', label: 'Opening' },
  { key: 'verification', label: 'Identity verification' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'questions', label: 'Questions' },
  { key: 'objections', label: 'Objection handling' },
  { key: 'negotiation', label: 'Negotiation rules' },
  { key: 'closing', label: 'Closing' },
  { key: 'escalation', label: 'Escalation' },
  { key: 'fallback', label: 'Fallback' },
] as const

export function CallScriptStudio() {
  const { data, loading, error, refetch } = useVoiceApi<any>('/voice/scripts')
  const { show, node } = useToast()
  const { simulate } = useSimulation()
  const scripts: any[] = data?.scripts ?? []
  const variables: string[] = data?.variables ?? []
  const [code, setCode] = useState<string | null>(null)
  const current = scripts.find((s: any) => s.code === code) ?? scripts[0] ?? null
  const [draft, setDraft] = useState<any>(null)

  useEffect(() => { if (current) setDraft({ ...current }) }, [current])
  useEffect(() => { if (!code && scripts.length) setCode(scripts[0].code) }, [scripts, code])

  const insertVar = (v: string) => {
    if (!draft) return
    setDraft({ ...draft, opening: `${draft.opening ?? ''}{{${v}}}` })
    simulate('Variable inserted', `{{${v}}} was appended to the opening line.`)
  }

  return (
    <PageShell
      icon={<FileText className="w-5 h-5 text-emerald-600" />}
      title="Call Script Studio"
      subtitle="Author the exact words, questions and objection handling each agent uses"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => simulate('Script duplicated', 'A copy of this script was created as a new draft version.')}><Copy className="w-3.5 h-3.5 mr-1.5" />Duplicate</Button>
          <RefreshButton onClick={refetch} loading={loading} />
        </>
      }
    >
      {node}
      <SimBanner banner={data?.banner} />

      <KpiGrid cols={4}>
        <KpiTile label="Scripts" value={fmtNum(scripts.length)} icon={<FileText className="w-4 h-4" />} tone="emerald" />
        <KpiTile label="Variables available" value={fmtNum(variables.length)} icon={<Variable className="w-4 h-4" />} tone="violet" />
        <KpiTile label="Sections per script" value={SCRIPT_SECTIONS.length} icon={<Layers className="w-4 h-4" />} tone="blue" />
        <KpiTile label="Languages" value={fmtNum(new Set(scripts.map((s: any) => s.language)).size)} icon={<Globe className="w-4 h-4" />} tone="teal" />
      </KpiGrid>

      {error && <ErrorBlock error={error} onRetry={refetch} />}
      {loading && !data && <LoadingBlock />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 xl:col-span-3">
          <Panel title="Script library" subtitle={`${scripts.length} scripts`}>
            <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              {scripts.map((s: any) => (
                <button key={s.id} onClick={() => setCode(s.code)}
                  className={cn('w-full text-left p-2.5 rounded-lg border transition-colors',
                    draft?.code === s.code ? 'border-emerald-300 bg-emerald-50/60' : 'border-gray-100 hover:bg-gray-50')}>
                  <p className="text-xs font-semibold text-gray-900">{s.name}</p>
                  <p className="text-[10px] font-mono text-gray-500 mt-0.5">{s.code}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <Badge variant="secondary" className="text-[10px] h-4 bg-gray-100 text-gray-600">{s.language}</Badge>
                    <Badge variant="secondary" className="text-[10px] h-4 bg-violet-50 text-violet-700">{s.tone}</Badge>
                    <StatusBadge status={s.status ?? 'active'} />
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {draft ? (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Input value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-9 text-sm max-w-xs font-semibold" />
                    <StatusBadge status={draft.status ?? 'active'} />
                    <Badge variant="secondary" className="text-[10px] h-5 bg-gray-100 text-gray-600">v{draft.version ?? 1}</Badge>
                    <SimTag className="ml-auto" />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Agent <span className="font-mono">{draft.agentKey}</span> · language {draft.language} · tone {draft.tone}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Button size="sm" onClick={() => simulate('Script saved', `${draft.name} would be compiled into the agent prompt on the next deploy.`)}>
                      <Save className="w-3.5 h-3.5 mr-1.5" />Save script
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDraft({ ...current })}><RotateCcw className="w-3.5 h-3.5 mr-1.5" />Revert</Button>
                    <Button size="sm" variant="outline" onClick={() => simulate('Preview generated', 'The agent would speak this script end-to-end in a sandbox call.')}>
                      <Play className="w-3.5 h-3.5 mr-1.5" />Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Panel title="Template variables" subtitle="Click to append to the opening line">
                <div className="flex flex-wrap gap-1.5">
                  {variables.map((v) => (
                    <button key={v} onClick={() => insertVar(v)}
                      className="text-[11px] font-mono px-2 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors">
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>
              </Panel>

              <div className="space-y-3">
                {SCRIPT_SECTIONS.map((sec) => (
                  <Panel key={sec.key} title={sec.label}>
                    <Textarea
                      value={draft[sec.key] ?? ''}
                      onChange={(e) => setDraft({ ...draft, [sec.key]: e.target.value })}
                      className="text-sm min-h-[80px] font-mono text-[12px]"
                      placeholder={sec.key === 'questions' ? 'One question per line…' : `Write the ${sec.label.toLowerCase()} here…`}
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {String(draft[sec.key] ?? '').match(/\{\{\w+\}\}/g)?.slice(0, 8).map((v: string, i: number) => (
                        <span key={`${v}-${i}`} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">{v}</span>
                      ))}
                    </div>
                  </Panel>
                ))}
              </div>
            </>
          ) : (
            !loading && <Panel title="No scripts"><EmptyState icon={<FileText className="w-5 h-5" />} title="No scripts found" /></Panel>
          )}
        </div>
      </div>
    </PageShell>
  )
}
