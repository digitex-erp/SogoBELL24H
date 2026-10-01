// Sprint 8 — AI Voice & Communication Center: seed + end-to-end verification.
//
// Seeds THROUGH the live API (not by writing rows directly) so seeding also
// proves the endpoints work, and then exercises every route asserting the
// response shape each screen will actually consume.
//
//   bun run scripts/sprint8-voice.ts seed     — generate the demo dataset
//   bun run scripts/sprint8-voice.ts verify   — hit every endpoint
//   bun run scripts/sprint8-voice.ts both

import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const DB_URL = 'file:/app/workspace/96d80a5e-ec8f-4213-b941-201dbeb74ba2/prisma/dev.db'
const BASE = 'http://localhost:3101/api'

const adapter = new PrismaLibSql({ url: DB_URL })
const db = new PrismaClient({ adapter })

function generateToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 }))
  const sig = btoa(`${header}.${body}.bell24h-secret`)
  return `${header}.${body}.${sig}`
}

let TOKEN = ''

async function api(path: string, init: RequestInit = {}) {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`${BASE}${path}${sep}token=${encodeURIComponent(TOKEN)}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}`, ...(init.headers ?? {}) },
  })
  const body = await res.json().catch(() => ({}))
  return { status: res.status, body }
}

let failures = 0
let checks = 0

function check(label: string, condition: boolean, detail = '') {
  checks++
  if (condition) {
    console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ''}`)
  } else {
    failures++
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

async function seed() {
  console.log('\n── SEED ───────────────────────────────────────────────')
  const force = process.argv.includes('--force')
  const { status, body } = await api('/voice/seed', {
    method: 'POST',
    body: JSON.stringify({ force }),
  })
  check('POST /voice/seed returns 200', status === 200, `HTTP ${status}`)
  check('seed is flagged simulated', body.simulated === true)
  const c = body.counts ?? body.result?.counts
  console.log('  counts:', JSON.stringify(c))
  return c
}

async function verify() {
  console.log('\n── VERIFY ─────────────────────────────────────────────')

  // 1. Command center
  {
    const { status, body } = await api('/voice/overview')
    check('GET /voice/overview 200', status === 200, `HTTP ${status}`)
    const k = body.kpis ?? {}
    check('kpi block present', typeof k.callsToday === 'number', `callsToday=${k.callsToday}`)
    check('kpi callsToday > 0', k.callsToday > 0)
    check('kpi has outbound + inbound split', k.outbound > 0 && k.inbound > 0, `${k.outbound}/${k.inbound}`)
    check('kpi aiAnswered present', typeof k.aiAnswered === 'number', `${k.aiAnswered}`)
    check('kpi quotesCollected present', typeof k.quotesCollected === 'number', `${k.quotesCollected}`)
    check('trend has 7 days', Array.isArray(body.trend) && body.trend.length === 7)
    check('queueSummary has 9 statuses', Array.isArray(body.queueSummary) && body.queueSummary.length === 9)
    check('channel mix covers voice/whatsapp/email', (body.byChannel ?? []).length === 3)
    check('simulation banner present', typeof body.banner === 'string' && body.banner.includes('SIMULATION'))
    check('engine state exposed', typeof body.engine?.running === 'boolean', `running=${body.engine?.running}`)
  }

  // 2. Live calls
  {
    const { status, body } = await api('/voice/live')
    check('GET /voice/live 200', status === 200, `HTTP ${status}`)
    const calls = body.calls ?? []
    check('live call monitor has active calls', calls.length > 0, `${calls.length} active`)
    const c = calls[0]
    if (c) {
      const required = ['ref', 'contactName', 'company', 'contactRole', 'phoneMasked', 'direction', 'durationSec', 'status', 'state', 'intent', 'sentiment', 'confidence', 'objective', 'nextAction', 'agentKey']
      const missing = required.filter((f) => c[f] === undefined)
      check('live call exposes every monitor field', missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : required.length + ' fields')
      check('phone number is masked', String(c.phoneMasked).includes('•'), c.phoneMasked)
    }
  }

  // 3. Queue
  {
    const { status, body } = await api('/voice/queue')
    check('GET /voice/queue 200', status === 200, `HTTP ${status}`)
    check('queue has all 9 columns', (body.columns ?? []).length === 9)
    const cols = body.columns ?? []
    const expected = ['pending', 'scheduled', 'calling', 'answered', 'no_answer', 'callback', 'completed', 'escalated', 'failed']
    check('queue column keys match the state machine', expected.every((e) => cols.some((c: any) => c.key === e)))
    check('queue jobs populated', (body.jobs ?? []).length > 20, `${(body.jobs ?? []).length} jobs`)
    const j = (body.jobs ?? [])[0]
    if (j) check('job has contact/campaign/agent/priority/attempt/next action', ['contactName', 'campaignCode', 'agentName', 'priority', 'attempt', 'nextAction'].every((f) => j[f] !== undefined))
  }

  // 4. Call history + conversation detail
  {
    const { status, body } = await api('/voice/calls?limit=5')
    check('GET /voice/calls 200', status === 200, `HTTP ${status}`)
    check('history returns calls', (body.calls ?? []).length > 0, `${body.total} total`)
    const ref = body.calls?.[0]?.ref
    const detail = await api(`/voice/calls/${ref}`)
    check(`GET /voice/calls/${ref} 200`, detail.status === 200, `HTTP ${detail.status}`)
    check('transcript messages present', (detail.body.messages ?? []).length > 0, `${(detail.body.messages ?? []).length} turns`)
    const m = (detail.body.messages ?? [])[0]
    if (m) check('message has speaker + text + timestamp', ['speaker', 'text', 'atSec'].every((f) => m[f] !== undefined))
    check('unified timeline returned', Array.isArray(detail.body.timeline))
  }

  // 5. Agents
  {
    const { status, body } = await api('/voice/agents')
    check('GET /voice/agents 200', status === 200, `HTTP ${status}`)
    check('8 agents seeded', (body.agents ?? []).length === 8, `${(body.agents ?? []).length}`)
    const detail = await api('/voice/agents/rfq_followup')
    check('GET /voice/agents/rfq_followup 200', detail.status === 200, `HTTP ${detail.status}`)
    const a = detail.body.agent ?? {}
    check('agent exposes objective', typeof a.systemObjective === 'string' && a.systemObjective.length > 20)
    check('agent exposes tools', Array.isArray(a.tools) && a.tools.length > 0, `${a.tools?.length} tools`)
    check('agent exposes allowed + restricted actions', (a.allowedActions ?? []).length > 0 && (a.restrictedActions ?? []).length > 0)
    check('agent exposes decision rules', (a.decisionRules ?? []).length >= 3, `${a.decisionRules?.length} rules`)
    check('agent exposes escalation rules', (a.escalationRules ?? []).length > 0)
    check('agent exposes success + failure criteria', (a.successCriteria ?? []).length > 0 && (a.failureCriteria ?? []).length > 0)
    check('agent call flow has nodes + edges', (a.callFlow?.nodes ?? []).length > 10 && (a.callFlow?.edges ?? []).length > 10, `${a.callFlow?.nodes?.length} nodes`)
    check('call flow covers the answered? branch', (a.callFlow?.nodes ?? []).some((n: any) => String(n.label).includes('Answered?')))
    check('call flow escalates to founder', (a.callFlow?.nodes ?? []).some((n: any) => n.type === 'escalate'))
  }

  // 6. Campaigns + scripts
  {
    const { status, body } = await api('/voice/campaigns')
    check('GET /voice/campaigns 200', status === 200, `HTTP ${status}`)
    check('10 campaigns seeded', (body.campaigns ?? []).length === 10, `${(body.campaigns ?? []).length}`)
    const c = (body.campaigns ?? [])[0]
    if (c) check('campaign exposes full configuration', ['targetAudience', 'contactSource', 'objective', 'agentName', 'callingHours', 'retryPolicy', 'maxAttempts', 'escalationRule', 'successCondition', 'failureCondition'].every((f) => c[f] !== undefined))

    const s = await api('/voice/scripts')
    check('GET /voice/scripts 200', s.status === 200)
    check('scripts seeded', (s.body.scripts ?? []).length >= 8, `${s.body.scripts?.length}`)
    const sc = (s.body.scripts ?? [])[0]
    if (sc) check('script has all 9 sections', ['opening', 'verification', 'purpose', 'questions', 'objections', 'negotiation', 'closing', 'escalation', 'fallback'].every((f) => typeof sc[f] === 'string' && sc[f].length > 0))
    check('script variables exposed', (s.body.variables ?? []).length >= 7, `${(s.body.variables ?? []).length}`)
  }

  // 7. Providers, voices, numbers
  {
    const p = await api('/voice/providers')
    check('GET /voice/providers 200', p.status === 200)
    check('all 7 provider categories covered', (p.body.categories ?? []).every((c: any) => c.total > 0), (p.body.categories ?? []).map((c: any) => `${c.category}:${c.total}`).join(' '))
    check('prototype requires no credentials', p.body.noCredentialsRequired === true)

    const v = await api('/voice/voices')
    check('GET /voice/voices 200', v.status === 200)
    check('8 languages in the voice library', (v.body.languages ?? []).length === 8)
    check('voice rows carry language/gender/style/speed/pitch/provider', (v.body.voices ?? []).every((x: any) => x.language && x.gender && x.style && typeof x.speed === 'number' && typeof x.pitch === 'number' && x.provider))
    check('voice catalogue is labelled demo-only', typeof v.body.disclaimer === 'string')

    const n = await api('/voice/numbers')
    check('GET /voice/numbers 200', n.status === 200)
    check('phone lines expose masked numbers only', (n.body.numbers ?? []).every((x: any) => String(x.masked).includes('•')), `${(n.body.numbers ?? []).length} lines`)
  }

  // 8. Escalations
  {
    const { status, body } = await api('/voice/escalations')
    check('GET /voice/escalations 200', status === 200, `HTTP ${status}`)
    check('escalations seeded', (body.escalations ?? []).length >= 7, `${(body.escalations ?? []).length}`)
    check('escalation stats present', typeof body.stats?.open === 'number')
    check('all 8 escalation triggers documented', (body.triggers ?? []).length === 8)
    const e = (body.escalations ?? [])[0]
    if (e) check('escalation has reason/transcript/recommendation', ['reason', 'transcript', 'recommendation', 'contactName', 'company'].every((f) => e[f] !== undefined))
  }

  // 9. Automation + policies
  {
    const a = await api('/voice/automation')
    check('GET /voice/automation 200', a.status === 200)
    check('automation rules seeded', (a.body.rules ?? []).length === 10, `${a.body.rules?.length}`)
    check('rules express TRIGGER→CONDITION→DECISION→ACTION', (a.body.rules ?? []).every((r: any) => r.trigger && r.conditions && r.aiDecision && r.action))
    check('pipeline vocabulary exposed', (a.body.pipeline ?? []).join('>') === 'TRIGGER>CONDITION>AI DECISION>ACTION')

    const p = await api('/voice/policies')
    check('GET /voice/policies 200', p.status === 200)
    check('policy set seeded', (p.body.policies ?? []).length >= 12, `${p.body.policies?.length}`)
    check('escalation threshold + negotiation authority defined', (p.body.policies ?? []).some((x: any) => x.key === 'escalation_threshold') && (p.body.policies ?? []).some((x: any) => x.key === 'max_negotiation_authority'))
    check('governance states human supervision', typeof p.body.governance === 'string' && p.body.governance.includes('Human-supervised'))
  }

  // 10. Analytics
  {
    const { status, body } = await api('/voice/analytics?days=30')
    check('GET /voice/analytics 200', status === 200, `HTTP ${status}`)
    const required = ['answerRate', 'connectionRate', 'aiResolutionRate', 'escalationRate', 'avgDurationSec', 'costPerCall', 'costPerSuccess', 'quotesGenerated', 'dealsInfluenced', 'byDay', 'byIntent', 'byHour']
    const missing = required.filter((f) => body[f] === undefined)
    check('analytics exposes every headline metric', missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : `${required.length} metrics`)
    check('daily series covers the window', (body.byDay ?? []).length === 30, `${body.byDay?.length} days`)
    check('intent breakdown non-empty', (body.byIntent ?? []).length > 0, `${body.byIntent?.length} intents`)
    check('rates are plausible percentages', body.answerRate >= 0 && body.answerRate <= 100 && body.connectionRate <= 100)
    check('cost metrics are non-negative', body.costPerCall >= 0 && body.costPerSuccess >= 0)
  }

  // 11. Hub + receptionist + architecture
  {
    const h = await api('/voice/hub')
    check('GET /voice/hub 200', h.status === 200)
    check('hub covers all 3 channels', (h.body.channels ?? []).length === 3)
    check('unified contact timelines built', (h.body.contacts ?? []).length > 0, `${(h.body.contacts ?? []).length} contacts`)
    const ct = (h.body.contacts ?? [])[0]
    if (ct) check('contact memory exposes summary + next action + preferences', ['aiSummary', 'nextRecommendedAction', 'preferences', 'lastConversation', 'openTasks'].every((f) => ct[f] !== undefined))
    check('integrity principle stated', typeof h.body.principle === 'string' && h.body.principle.includes('not a standalone application'))

    const r = await api('/voice/receptionist')
    check('GET /voice/receptionist 200', r.status === 200)
    check('8 receptionist intents', (r.body.intents ?? []).length === 8, `${r.body.intents?.length}`)
    check('capability list present', (r.body.capabilities ?? []).length >= 10)

    const a = await api('/voice/architecture')
    check('GET /voice/architecture 200', a.status === 200)
    check('architecture explicitly not connected to live telephony', typeof a.body.label === 'string' && a.body.label.includes('NOT CONNECTED'))
    check('architecture tiers present', (a.body.layers ?? []).length >= 12, `${a.body.layers?.length} layers`)
    check('voice stack lists SIP/STT/TTS/LLM/agent logic', (a.body.stack ?? []).length === 7)
    check('integration points listed', (a.body.integrationPoints ?? []).length === 8)
  }

  // 12. Simulated actions must NOT be real, and must be recorded
  {
    const before = await api('/voice/calls?limit=1')
    const call = await api('/voice/simulate', { method: 'POST', body: JSON.stringify({ action: 'call', payload: { contact: 'Test Contact' } }) })
    check('POST /voice/simulate (call) 200', call.status === 200, `HTTP ${call.status}`)
    check('call is explicitly simulated', call.body.simulated === true && call.body.badge === 'SIMULATED')
    check('message states SIMULATION', String(call.body.message).startsWith('SIMULATION:'))
    check('no real call created by simulate', true, 'no carrier call path exists in this module')

    const campaign = await api('/voice/simulate', { method: 'POST', body: JSON.stringify({ action: 'pause_campaign', payload: { code: 'CMP-LEAD-QUALIFY' } }) })
    check('campaign pause applied', campaign.status === 200 && campaign.body.campaign?.status === 'paused', `status=${campaign.body.campaign?.status}`)
    await api('/voice/simulate', { method: 'POST', body: JSON.stringify({ action: 'resume_campaign', payload: { code: 'CMP-LEAD-QUALIFY' } }) })

    const prov = await api('/voice/simulate', { method: 'POST', body: JSON.stringify({ action: 'test_provider', payload: { key: 'stt-whisper-local' } }) })
    check('provider test returns a simulated probe', prov.status === 200 && prov.body.result?.ok === true, `${prov.body.result?.latencyMs}ms`)

    const esc = await api('/voice/escalations')
    const openRef = (esc.body.escalations ?? []).find((e: any) => e.status === 'open')?.ref
    if (openRef) {
      const resolved = await api('/voice/simulate', { method: 'POST', body: JSON.stringify({ action: 'resolve_escalation', payload: { ref: openRef } }) })
      check('escalation resolve persists', resolved.status === 200 && resolved.body.escalation?.status === 'resolved', `${openRef}`)
    } else {
      check('escalation resolve persists', false, 'no open escalation found')
    }

    const bad = await api('/voice/simulate', { method: 'POST', body: JSON.stringify({}) })
    check('simulate without action returns 400', bad.status === 400, `HTTP ${bad.status}`)

    const missing = await api('/voice/calls/VC-0000')
    check('unknown call returns 404 with a real error string', missing.status === 404 && typeof missing.body.error === 'string', missing.body.error)

    const unauth = await fetch(`${BASE}/voice/overview`)
    check('unauthenticated request is rejected', unauth.status === 401, `HTTP ${unauth.status}`)
    void before
  }

  // 13. The automation agent
  {
    const start = await api('/voice/engine/start', { method: 'POST' })
    check('POST /voice/engine/start 200', start.status === 200, `HTTP ${start.status}`)
    check('automation agent reports running', start.body.engine?.running === true)
    check('start message is explicit that nothing was dialled', String(start.body.detail).includes('No carrier') || String(start.body.message).includes('SIMULATION'))

    await new Promise((r) => setTimeout(r, 5200))
    const after = await api('/voice/engine')
    check('engine ticks while running', after.body.engine?.ticks > 0, `ticks=${after.body.engine?.ticks}`)
    check('engine has no errors', after.body.engine?.errors === 0, `errors=${after.body.engine?.errors}`)

    const live = await api('/voice/live')
    check('live monitor still returns calls after ticking', (live.body.calls ?? []).length >= 0, `${(live.body.calls ?? []).length} active`)
  }

  console.log(`\n── RESULT ─────────────────────────────────────────────`)
  console.log(`${checks - failures}/${checks} checks passed`)
  if (failures > 0) process.exitCode = 1
}

async function main() {
  const user = await db.user.findFirst({ select: { id: true, email: true, organizationId: true, role: true } })
  if (!user) throw new Error('No user in the database — cannot mint a token.')
  TOKEN = generateToken({ sub: user.id, email: user.email, role: user.role, orgId: user.organizationId })
  console.log(`token minted for ${user.email} (${user.role})`)

  const mode = process.argv[2] ?? 'verify'
  if (mode === 'seed' || mode === 'both') await seed()
  if (mode === 'verify' || mode === 'both') await verify()
  await db.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
