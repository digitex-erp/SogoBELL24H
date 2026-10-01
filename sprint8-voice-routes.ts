// SPDX-License-Identifier: Apache-2.0
// Sprint 8 — AI Voice & Communication Center (Bell24h-OS)
//
// PROTOTYPE / SIMULATION ONLY. Nothing here contacts a carrier, opens a SIP
// socket or dials a number. Every call record is generated deterministically
// and every "action" is recorded as simulated.
//
//   /voice/overview        founder voice command center
//   /voice/live            live call monitor feed
//   /voice/queue           the outbound call queue (9 columns)
//   /voice/calls[/:ref]    history + conversation detail
//   /voice/agents[/:key]   agent builder + call flow + script binding
//   /voice/campaigns       outbound campaign definitions
//   /voice/scripts         call script studio
//   /voice/providers       telephony / SIP / STT / TTS / LLM / voice / recording
//   /voice/voices          voice library
//   /voice/numbers         phone numbers & SIP lines
//   /voice/escalations     human escalation center
//   /voice/automation      TRIGGER → CONDITION → AI DECISION → ACTION
//   /voice/policies        the AI calling policy / safety layer
//   /voice/analytics       call analytics
//   /voice/hub             unified omni-channel timeline
//   /voice/receptionist    inbound AI receptionist config + recent calls
//   /voice/architecture    telephony + voice stack diagram data
//   /voice/engine          the voice calling automation agent
//   /voice/simulate        simulated action gateway
//
// Auth middleware is injected by custom-routes.ts so there is exactly one
// implementation of token verification in the codebase.

import { Hono } from 'hono'
import { prisma } from './src/lib/db'
import {
  AGENT_BLUEPRINTS,
  AUTOMATION_BLUEPRINTS,
  CAMPAIGN_BLUEPRINTS,
  ENGINE,
  NUMBER_BLUEPRINTS,
  POLICY_BLUEPRINTS,
  PROVIDER_BLUEPRINTS,
  PROVIDER_CATEGORIES,
  QUEUE_COLUMNS,
  RECEPTIONIST_FAQS,
  RFQ_CALL_FLOW,
  NODE_TYPE_META,
  SCRIPT_BLUEPRINTS,
  SIMULATION_BANNER,
  TELEPHONY_LAYERS,
  VOICE_BLUEPRINTS,
  VOICE_STACK_COMPONENTS,
  LANGUAGES,
  deriveAnalytics,
  engineStatus,
  generateCall,
  generateCommEvents,
  generateEscalations,
  generateQueueJobs,
  rng,
  simulated,
  svcRef,
} from './src/lib/voice-engine'

type AuthMiddleware = () => (c: any, next: any) => Promise<any>

// ─────────────────────────────────────────────────────────────
// SIMULATED ENGINE — lazily ticked from any read
// ─────────────────────────────────────────────────────────────

const TICK_MS = 4000
const MAX_LIVE_CALLS = 6
const ENGINE_STATE_KEY = 'runtime_engine_state'

// The engine's runtime state is persisted so "the automation agent is running"
// survives a server restart instead of silently reverting to stopped.
let engineLoaded = false

async function loadEngineState() {
  const row = await safe(
    () => prisma.voicePolicy.findFirst({ where: { key: ENGINE_STATE_KEY } }),
    null as any,
  )
  if (row?.value) {
    try {
      const s = JSON.parse(row.value)
      ENGINE.running = Boolean(s.running)
      ENGINE.startedAt = s.startedAt ?? null
      ENGINE.lastTickAt = s.lastTickAt ?? null
      ENGINE.ticks = Number(s.ticks) || 0
      ENGINE.placed = Number(s.placed) || 0
      ENGINE.completed = Number(s.completed) || 0
      ENGINE.escalated = Number(s.escalated) || 0
    } catch { /* corrupt runtime row — fall back to stopped */ }
  }
  return ENGINE.running
}

async function persistEngineState() {
  const value = JSON.stringify({
    running: ENGINE.running, startedAt: ENGINE.startedAt, lastTickAt: ENGINE.lastTickAt,
    ticks: ENGINE.ticks, placed: ENGINE.placed, completed: ENGINE.completed, escalated: ENGINE.escalated,
  })
  await safe(() => prisma.voicePolicy.upsert({
    where: { key: ENGINE_STATE_KEY },
    update: { value, updatedAt: new Date() },
    create: {
      key: ENGINE_STATE_KEY,
      label: 'Automation engine runtime state',
      category: 'runtime',
      value,
      valueType: 'json',
      description: 'Internal runtime state for the simulated voice calling automation agent. Not a configurable policy.',
    },
  }), null)
}

function parse(value: string | null | undefined): any {
  if (!value) return null
  try { return JSON.parse(value) } catch { return null }
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

async function logSimulated(userId: unknown, action: string, resource: string, resourceId?: string, details?: Record<string, unknown>) {
  await safe(() => prisma.auditLog.create({
    data: {
      userId: (userId as string | undefined) ?? null,
      action: `voice.${action}`,
      resource,
      resourceId: resourceId ?? null,
      details: details ? JSON.stringify({ ...details, simulated: true }) : JSON.stringify({ simulated: true }),
    },
  }), null as any)
}

/** Advance the simulated queue state machine by however many ticks have elapsed. */
async function runTick(userId?: unknown) {
  if (!engineLoaded) { await loadEngineState(); engineLoaded = true }
  if (!ENGINE.running) return
  const now = Date.now()
  const last = ENGINE.lastTickAt ? new Date(ENGINE.lastTickAt).getTime() : now
  const steps = Math.min(5, Math.floor((now - last) / TICK_MS))
  if (steps <= 0) return

  for (let s = 0; s < steps; s++) {
    try {
      await tickOnce(userId)
    } catch (e) {
      ENGINE.errors++
    }
  }
  ENGINE.lastTickAt = new Date(now).toISOString()
  ENGINE.ticks += steps
  await persistEngineState()
}

/** Monotonic call-ref allocator, primed from the DB so a server restart cannot reissue a ref. */
let refSeq: number | null = null

async function nextCallRef(): Promise<string> {
  if (refSeq === null) {
    const latest = await safe(
      () => prisma.voiceCall.findFirst({ orderBy: { ref: 'desc' }, select: { ref: true } }),
      null as any,
    )
    const parsed = latest?.ref ? Number(String(latest.ref).replace(/[^0-9]/g, '')) : 0
    refSeq = (Number.isFinite(parsed) ? parsed : 0) + 1
  }
  return svcRef('VC', refSeq++)
}

async function tickOnce(userId?: unknown) {
  const live = await safe(() => prisma.voiceCall.findMany({ where: { status: 'in_progress' }, take: MAX_LIVE_CALLS + 4, orderBy: { startedAt: 'asc' } }), [] as any[])
  const states = ['speaking', 'listening', 'thinking', 'speaking', 'wrap_up']

  // 1. Advance live conversations.
  for (const call of live) {
    const duration = call.durationSec + 14
    const nextState = states[(Math.floor(duration / 14) + call.ref.length) % states.length]
    const shouldEnd = duration > 240 || (duration > 90 && (call.confidence < 0.66 ? Math.random() < 0.06 : Math.random() < 0.09))

    if (!shouldEnd) {
      await safe(() => prisma.voiceCall.update({ where: { id: call.id }, data: { durationSec: duration, state: nextState, updatedAt: new Date() } }), null)
      continue
    }

    const escalate = call.confidence > 0 && call.confidence < 0.58 && Math.random() < 0.35
    await safe(() => prisma.voiceCall.update({
      where: { id: call.id },
      data: {
        status: escalate ? 'escalated' : 'completed',
        state: 'wrap_up',
        durationSec: duration,
        endedAt: new Date(),
        outcome: escalate ? 'Escalated to founder' : 'Completed',
        nextAction: escalate ? 'Founder review required' : 'Send WhatsApp summary',
      },
    }), null)

    if (escalate) {
      ENGINE.escalated++
      await safe(() => prisma.voiceEscalation.create({
        data: {
          ref: svcRef('ESC', 900 + ENGINE.escalated),
          callRef: call.ref,
          contactName: call.contactName,
          company: call.company,
          reason: 'Confidence below threshold',
          severity: 'high',
          transcript: 'AI: I want to make sure this is handled correctly, so I am bringing a human into the conversation.',
          recommendation: 'Review the transcript and call the contact back personally.',
          summary: `Automation engine escalated ${call.ref} after confidence fell below the configured threshold.`,
          rfqNumber: call.rfqNumber,
          status: 'open',
        },
      }), null)
    } else {
      ENGINE.completed++
    }

    await safe(() => prisma.commEvent.create({
      data: {
        ref: svcRef('CE', 9000 + ENGINE.ticks * 10 + ENGINE.completed),
        channel: 'voice',
        direction: call.direction,
        contactName: call.contactName,
        company: call.company,
        subject: `${call.intent} call ${escalate ? 'escalated' : 'completed'}`,
        body: `Simulated call ${call.ref} finished by the automation engine after ${duration}s.`,
        outcome: escalate ? 'escalated' : 'completed',
        callRef: call.ref,
        entityType: call.entityType,
        rfqNumber: call.rfqNumber,
      },
    }), null)

    await safe(() => prisma.voiceQueueJob.updateMany({
      where: { status: 'answered', agentKey: call.agentKey ?? undefined },
      data: { status: escalate ? 'escalated' : 'completed', nextAction: escalate ? 'Await founder review' : 'Summarise and propagate' },
    }), null)
  }

  // 2. Ring → live.
  const ringing = await safe(() => prisma.voiceCall.findMany({ where: { status: 'ringing' }, take: 2 }), [] as any[])
  for (const call of ringing) {
    await safe(() => prisma.voiceCall.update({
      where: { id: call.id },
      data: { status: 'in_progress', state: 'speaking', startedAt: new Date(), durationSec: 2 },
    }), null)
  }

  // 3. Place a new simulated call if there is room.
  const liveCount = await safe(() => prisma.voiceCall.count({ where: { status: 'in_progress' } }), 0)
  if (liveCount < MAX_LIVE_CALLS) {
    const pending = await safe(() => prisma.voiceQueueJob.findFirst({
      where: { status: 'pending' },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    }), null as any)
    if (pending) {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const gen = generateCall(5000 + ENGINE.placed, 0, { todayStart })
      // `nextCallRef()` is async, so it has to be resolved before the (non-async)
      // safe() closure that builds the create payload.
      const ref = await nextCallRef()
      await safe(() => prisma.voiceCall.create({
        data: {
          ref,
          campaignId: null,
          agentKey: pending.agentKey,
          contactName: pending.contactName,
          company: pending.company,
          contactRole: gen.contactRole,
          phoneMasked: pending.phoneMasked,
          entityType: gen.entityType,
          direction: 'outbound',
          status: 'ringing',
          state: 'ringing',
          intent: gen.intent,
          objective: gen.objective,
          sentiment: 'neutral',
          confidence: 0.7,
          durationSec: 0,
          language: gen.language,
          attempt: pending.attempt,
          startedAt: new Date(),
        },
      }), null)
      await safe(() => prisma.voiceQueueJob.update({
        where: { id: pending.id },
        data: { status: 'calling', nextAction: 'Awaiting answer' },
      }), null)
      ENGINE.placed++
    }
  }

  // 4. Retry exhausted / no-answer recycling.
  const noAnswer = await safe(() => prisma.voiceQueueJob.findMany({ where: { status: 'no_answer' }, take: 2 }), [] as any[])
  for (const job of noAnswer) {
    if (job.attempt >= 3) {
      await safe(() => prisma.voiceQueueJob.update({ where: { id: job.id }, data: { status: 'failed', nextAction: 'Close and notify owner', reason: 'Maximum attempts reached' } }), null)
    } else {
      await safe(() => prisma.voiceQueueJob.update({
        where: { id: job.id },
        data: { status: 'pending', attempt: job.attempt + 1, nextAction: 'Retry with backoff', scheduledFor: new Date(Date.now() + 15 * 60000) },
      }), null)
    }
  }
}

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

export function createVoiceRoutes({ authMiddleware }: { authMiddleware: AuthMiddleware }) {
  const app = new Hono()

  // ── engine ────────────────────────────────────────────────
  app.get('/voice/engine', authMiddleware(), async (c: any) => {
    await runTick(c.get('userId'))
    return c.json({ engine: engineStatus(), banner: SIMULATION_BANNER, tickMs: TICK_MS })
  })

  app.post('/voice/engine/start', authMiddleware(), async (c: any) => {
    ENGINE.running = true
    ENGINE.startedAt = ENGINE.startedAt ?? new Date().toISOString()
    ENGINE.lastTickAt = new Date().toISOString()
    ENGINE.note = 'Voice calling automation agent is running. It advances the simulated queue state machine; it does not dial real numbers.'
    await persistEngineState()
    await logSimulated(c.get('userId'), 'engine.start', 'voice_engine')
    return c.json({ engine: engineStatus(), ...simulated('Voice calling automation agent started', 'The simulated queue driver is now advancing calls through the state machine. No carrier was contacted.') })
  })

  app.post('/voice/engine/stop', authMiddleware(), async (c: any) => {
    ENGINE.running = false
    ENGINE.note = 'Voice calling automation agent is stopped. No simulated calls will be advanced until it is restarted.'
    await persistEngineState()
    await logSimulated(c.get('userId'), 'engine.stop', 'voice_engine')
    return c.json({ engine: engineStatus(), ...simulated('Voice calling automation agent stopped', 'The simulated queue driver has been halted.') })
  })

  // ── founder voice command center ──────────────────────────
  app.get('/voice/overview', authMiddleware(), async (c: any) => {
    await runTick(c.get('userId'))
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)

    const [callsToday, allCalls, jobs, escalations, campaigns, agents, commEvents] = await Promise.all([
      safe(() => prisma.voiceCall.findMany({ where: { createdAt: { gte: todayStart } }, orderBy: { createdAt: 'desc' } }), [] as any[]),
      safe(() => prisma.voiceCall.findMany({ orderBy: { createdAt: 'desc' }, take: 600 }), [] as any[]),
      safe(() => prisma.voiceQueueJob.findMany(), [] as any[]),
      safe(() => prisma.voiceEscalation.findMany({ orderBy: { raisedAt: 'desc' } }), [] as any[]),
      safe(() => prisma.voiceCampaign.findMany({ orderBy: { createdAt: 'asc' } }), [] as any[]),
      safe(() => prisma.voiceAgent.findMany({ orderBy: { name: 'asc' } }), [] as any[]),
      safe(() => prisma.commEvent.findMany({ orderBy: { occurredAt: 'desc' }, take: 400 }), [] as any[]),
    ])

    const connected = callsToday.filter((x) => x.status !== 'no_answer' && x.status !== 'failed')
    const answered = connected.filter((x) => x.status !== 'scheduled')
    const completed = callsToday.filter((x) => x.status === 'completed')
    const escalated = callsToday.filter((x) => x.status === 'escalated')
    // A "quote collected" must carry a real extracted price AND have come from a
    // quote-seeking intent. Counting every connected call made the KPI meaningless.
    const QUOTE_INTENTS = ['RFQ Follow-up', 'Quote Collection', 'Supplier Reactivation']
    const quoted = completed.filter((x) => {
      const d = parse(x.extractedData)
      return Boolean(d?.price) && QUOTE_INTENTS.includes(x.intent ?? '')
    })
    const RFQ_INTENTS = ['RFQ enquiry', 'Lead Qualification', 'Buyer Qualification']
    const rfqsCreated = completed.filter((x) => RFQ_INTENTS.includes(x.intent ?? ''))
    const avgDuration = answered.length ? Math.round(answered.reduce((s, x) => s + x.durationSec, 0) / answered.length) : 0

    const trend: Array<{ day: string; calls: number; connected: number; completed: number; escalated: number }> = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i)
      const next = new Date(d.getTime() + 86400000)
      const bucket = allCalls.filter((x) => x.createdAt >= d && x.createdAt < next)
      trend.push({
        day: d.toISOString().slice(5, 10),
        calls: bucket.length,
        connected: bucket.filter((x) => x.status !== 'no_answer' && x.status !== 'failed').length,
        completed: bucket.filter((x) => x.status === 'completed').length,
        escalated: bucket.filter((x) => x.status === 'escalated').length,
      })
    }

    const byChannel = (['voice', 'whatsapp', 'email'] as const).map((channel) => ({
      channel,
      count: commEvents.filter((e) => e.channel === channel).length,
      responded: commEvents.filter((e) => e.channel === channel && (e.outcome === 'responded' || e.outcome === 'read')).length,
    }))

    const queueSummary = QUEUE_COLUMNS.map((col) => ({ status: col.key, label: col.label, count: jobs.filter((j) => j.status === col.key).length }))

    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      engine: engineStatus(),
      kpis: {
        callsToday: callsToday.length,
        outbound: callsToday.filter((x) => x.direction === 'outbound').length,
        inbound: callsToday.filter((x) => x.direction === 'inbound').length,
        aiAnswered: answered.length,
        humanEscalations: escalated.length,
        successfulConversations: completed.length,
        rfqsGenerated: rfqsCreated.length,
        quotesCollected: quoted.length,
        supplierResponses: completed.filter((x) => x.entityType === 'supplier').length,
        buyerResponses: completed.filter((x) => x.entityType === 'buyer').length,
        followUpsCompleted: completed.filter((x) => x.intent === 'RFQ Follow-up' || x.intent === 'Quote Collection').length,
        callsPending: jobs.filter((j) => j.status === 'pending' || j.status === 'scheduled').length,
        callbacksPending: jobs.filter((j) => j.status === 'callback').length,
        avgDurationSec: avgDuration,
        quotesValue: quoted.reduce((s, x) => s + (x.quoteAmount ?? 0), 0),
        conversionRate: callsToday.length ? Math.round((completed.length / callsToday.length) * 1000) / 10 : 0,
      },
      liveCalls: allCalls.filter((x) => x.status === 'in_progress').slice(0, 4).map(shapeCall),
      trend,
      byChannel,
      queueSummary,
      escalations: escalations.filter((e) => e.status === 'open').slice(0, 4).map(shapeEscalation),
      campaigns: campaigns.map(shapeCampaign),
      agents: agents.map(shapeAgentSummary),
      openEscalations: escalations.filter((e) => e.status === 'open').length,
    })
  })

  // ── live calls ────────────────────────────────────────────
  app.get('/voice/live', authMiddleware(), async (c: any) => {
    await runTick(c.get('userId'))
    const calls = await safe(() => prisma.voiceCall.findMany({
      where: { status: { in: ['in_progress', 'ringing'] } },
      orderBy: { startedAt: 'asc' },
    }), [] as any[])
    const queue = await safe(() => prisma.voiceQueueJob.count({ where: { status: 'calling' } }), 0)
    return c.json({ simulation: true, banner: SIMULATION_BANNER, engine: engineStatus(), calls: calls.map(shapeCall), queueCalling: queue })
  })

  // ── queue ─────────────────────────────────────────────────
  app.get('/voice/queue', authMiddleware(), async (c: any) => {
    await runTick(c.get('userId'))
    const jobs = await safe(() => prisma.voiceQueueJob.findMany({ orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }] }), [] as any[])
    const agents = await safe(() => prisma.voiceAgent.findMany({ select: { key: true, name: true } }), [] as any[])
    const agentNames = Object.fromEntries(agents.map((a) => [a.key, a.name]))
    return c.json({
      simulation: true,
      columns: QUEUE_COLUMNS.map((col) => ({ ...col, count: jobs.filter((j) => j.status === col.key).length })),
      jobs: jobs.map((j) => ({
        id: j.id, ref: j.ref, contactName: j.contactName, company: j.company, phoneMasked: j.phoneMasked,
        campaignCode: j.campaignCode, agentKey: j.agentKey, agentName: agentNames[j.agentKey] ?? j.agentKey,
        priority: j.priority, status: j.status, attempt: j.attempt,
        scheduledFor: j.scheduledFor, nextAction: j.nextAction, reason: j.reason,
        ageMinutes: Math.round((Date.now() - new Date(j.createdAt).getTime()) / 60000),
      })),
      engine: engineStatus(),
    })
  })

  // ── call history ──────────────────────────────────────────
  app.get('/voice/calls', authMiddleware(), async (c: any) => {
    const direction = c.req.query('direction')
    const status = c.req.query('status')
    const intent = c.req.query('intent')
    const q = (c.req.query('q') || '').toLowerCase()
    const limit = Math.min(200, Number(c.req.query('limit')) || 60)
    const offset = Number(c.req.query('offset')) || 0

    const where: any = {}
    if (direction) where.direction = direction
    if (status) where.status = status
    if (intent) where.intent = intent

    const all = await safe(() => prisma.voiceCall.findMany({ where, orderBy: { createdAt: 'desc' } }), [] as any[])
    const filtered = q
      ? all.filter((x) =>
        x.contactName.toLowerCase().includes(q) ||
        (x.company ?? '').toLowerCase().includes(q) ||
        (x.ref ?? '').toLowerCase().includes(q) ||
        (x.rfqNumber ?? '').toLowerCase().includes(q))
      : all
    return c.json({
      simulation: true,
      total: filtered.length,
      calls: filtered.slice(offset, offset + limit).map(shapeCall),
      facets: {
        directions: ['outbound', 'inbound'],
        statuses: Array.from(new Set(all.map((x) => x.status))).sort(),
        intents: Array.from(new Set(all.map((x) => x.intent))).filter(Boolean).sort(),
      },
    })
  })

  app.get('/voice/calls/:ref', authMiddleware(), async (c: any) => {
    const { ref } = c.req.param()
    const call = await safe(() => prisma.voiceCall.findFirst({
      where: { OR: [{ ref }, { id: ref }] },
      include: { messages: { orderBy: { seq: 'asc' } } },
    }), null as any)
    if (!call) return c.json({ error: `Call ${ref} not found` }, 404)

    const timeline = await safe(() => prisma.commEvent.findMany({
      where: { OR: [{ callRef: call.ref }, { company: call.company ?? undefined }] },
      orderBy: { occurredAt: 'desc' },
      take: 12,
    }), [] as any[])

    const agent = await safe(() => prisma.voiceAgent.findFirst({ where: { key: call.agentKey ?? '' } }), null as any)
    const script = await safe(() => prisma.voiceScript.findFirst({ where: { agentKey: call.agentKey ?? '' } }), null as any)

    return c.json({
      call: shapeCall(call),
      messages: call.messages.map((m: any) => ({ id: m.id, seq: m.seq, speaker: m.speaker, text: m.text, atSec: m.atSec, sentiment: m.sentiment })),
      extracted: parse(call.extractedData),
      agent: agent ? { key: agent.key, name: agent.name, escalationThreshold: agent.escalationThreshold } : null,
      script: script ? { code: script.code, name: script.name } : null,
      timeline: timeline.map((t) => ({
        id: t.id, ref: t.ref, channel: t.channel, direction: t.direction, subject: t.subject,
        body: t.body, outcome: t.outcome, occurredAt: t.occurredAt, callRef: t.callRef,
      })),
    })
  })

  // ── agents ────────────────────────────────────────────────
  app.get('/voice/agents', authMiddleware(), async (c: any) => {
    const agents = await safe(() => prisma.voiceAgent.findMany({ orderBy: { name: 'asc' } }), [] as any[])
    const voices = await safe(() => prisma.voiceProfile.findMany(), [] as any[])
    const voiceNames = voices.map((v) => v.name)
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      agents: agents.map((a) => ({ ...shapeAgentSummary(a), language: a.language, voiceName: a.voiceName, status: a.status, approvalState: a.approvalState, totalCalls: a.totalCalls, resolutionRate: a.resolutionRate, escalationThreshold: a.escalationThreshold, maxCallsPerDay: a.maxCallsPerDay, workingHours: a.workingHours })),
      voices: voiceNames,
    })
  })

  app.get('/voice/agents/:key', authMiddleware(), async (c: any) => {
    const { key } = c.req.param()
    const agent = await safe(() => prisma.voiceAgent.findFirst({ where: { OR: [{ key }, { id: key }] } }), null as any)
    if (!agent) return c.json({ error: `Agent ${key} not found` }, 404)
    const script = await safe(() => prisma.voiceScript.findFirst({ where: { agentKey: agent.key } }), null as any)
    const campaigns = await safe(() => prisma.voiceCampaign.findMany({ where: { agentKey: agent.key } }), [] as any[])
    const calls = await safe(() => prisma.voiceCall.findMany({ where: { agentKey: agent.key }, orderBy: { createdAt: 'desc' }, take: 8 }), [] as any[])
    return c.json({
      agent: {
        ...agent,
        knowledgeBase: parse(agent.knowledgeBase) ?? [],
        allowedActions: parse(agent.allowedActions) ?? [],
        restrictedActions: parse(agent.restrictedActions) ?? [],
        tools: parse(agent.tools) ?? [],
        decisionRules: parse(agent.decisionRules) ?? [],
        successCriteria: parse(agent.successCriteria) ?? [],
        failureCriteria: parse(agent.failureCriteria) ?? [],
        escalationRules: parse(agent.escalationRules) ?? [],
        callFlow: parse(agent.callFlow) ?? RFQ_CALL_FLOW,
      },
      script: script ? { ...script, variables: parse(script.variables) ?? [] } : null,
      campaigns: campaigns.map(shapeCampaign),
      recentCalls: calls.map(shapeCall),
      nodeTypes: NODE_TYPE_META,
    })
  })

  // ── campaigns ─────────────────────────────────────────────
  app.get('/voice/campaigns', authMiddleware(), async (c: any) => {
    const campaigns = await safe(() => prisma.voiceCampaign.findMany({ orderBy: { createdAt: 'asc' } }), [] as any[])
    const agents = await safe(() => prisma.voiceAgent.findMany({ select: { key: true, name: true } }), [] as any[])
    const agentNames = Object.fromEntries(agents.map((a) => [a.key, a.name]))
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      campaigns: campaigns.map((x) => ({ ...shapeCampaign(x), agentName: agentNames[x.agentKey] ?? x.agentKey, scriptCode: x.scriptCode, language: x.language, voiceName: x.voiceName, callingHours: x.callingHours, retryPolicy: x.retryPolicy, maxAttempts: x.maxAttempts, escalationRule: x.escalationRule, successCondition: x.successCondition, failureCondition: x.failureCondition, targetAudience: x.targetAudience, contactSource: x.contactSource, objective: x.objective, campaignType: x.campaignType })),
    })
  })

  // ── scripts ───────────────────────────────────────────────
  app.get('/voice/scripts', authMiddleware(), async (c: any) => {
    const scripts = await safe(() => prisma.voiceScript.findMany({ orderBy: { name: 'asc' } }), [] as any[])
    return c.json({
      simulation: true,
      scripts: scripts.map((s) => ({ ...s, variables: parse(s.variables) ?? [] })),
      variables: ['buyer_name', 'supplier_name', 'company_name', 'rfq_number', 'product', 'quantity', 'target_date', 'target_price', 'price', 'unit', 'delivery_days', 'gst_last4', 'invoice_number', 'amount', 'due_date'],
    })
  })

  app.get('/voice/scripts/:code', authMiddleware(), async (c: any) => {
    const { code } = c.req.param()
    const s = await safe(() => prisma.voiceScript.findFirst({ where: { OR: [{ code }, { id: code }] } }), null as any)
    if (!s) return c.json({ error: `Script ${code} not found` }, 404)
    return c.json({ script: { ...s, variables: parse(s.variables) ?? [] } })
  })

  // ── providers ─────────────────────────────────────────────
  app.get('/voice/providers', authMiddleware(), async (c: any) => {
    const providers = await safe(() => prisma.voiceProvider.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] }), [] as any[])
    const byCategory = PROVIDER_CATEGORIES.map((category) => ({
      category,
      total: providers.filter((p) => p.category === category).length,
      enabled: providers.filter((p) => p.category === category && p.status === 'enabled').length,
      degraded: providers.filter((p) => p.category === category && p.health < 90).length,
    }))
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      noCredentialsRequired: true,
      providers: providers.map(shapeProvider),
      categories: byCategory,
    })
  })

  // ── voice library ─────────────────────────────────────────
  app.get('/voice/voices', authMiddleware(), async (c: any) => {
    const voices = await safe(() => prisma.voiceProfile.findMany({ orderBy: [{ language: 'asc' }, { name: 'asc' }] }), [] as any[])
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      disclaimer: 'Demo voice catalogue. Availability, latency and audio samples are simulated and do not represent any real provider.',
      voices: voices.map((v) => ({ id: v.id, key: v.key, name: v.name, language: v.language, languageLabel: LANGUAGES.find((l) => l.code === v.language)?.label ?? v.language, gender: v.gender, style: v.style, speed: v.speed, pitch: v.pitch, provider: v.provider, accent: v.accent, status: v.status, isDefault: v.isDefault })),
      languages: LANGUAGES,
    })
  })

  // ── numbers ───────────────────────────────────────────────
  app.get('/voice/numbers', authMiddleware(), async (c: any) => {
    const numbers = await safe(() => prisma.voiceNumber.findMany({ orderBy: { label: 'asc' } }), [] as any[])
    return c.json({ simulation: true, banner: SIMULATION_BANNER, numbers })
  })

  // ── escalation center ─────────────────────────────────────
  app.get('/voice/escalations', authMiddleware(), async (c: any) => {
    await runTick(c.get('userId'))
    const escalations = await safe(() => prisma.voiceEscalation.findMany({ orderBy: [{ status: 'asc' }, { raisedAt: 'desc' }] }), [] as any[])
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      stats: {
        open: escalations.filter((e) => e.status === 'open').length,
        inReview: escalations.filter((e) => e.status === 'in_review').length,
        resolved: escalations.filter((e) => e.status === 'resolved').length,
        critical: escalations.filter((e) => e.severity === 'critical' && e.status !== 'resolved').length,
        avgResponseMinutes: 34,
        routedToHumanRate: 11.4,
      },
      triggers: [
        'Confidence below configured threshold',
        'Customer explicitly requests human',
        'Sensitive business decision',
        'Negotiation exceeds agent authority',
        'Complaint',
        'Payment dispute',
        'Contract issue',
        'Unknown intent',
      ],
      escalations: escalations.map(shapeEscalation),
    })
  })

  // ── automation rules ──────────────────────────────────────
  app.get('/voice/automation', authMiddleware(), async (c: any) => {
    const rules = await safe(() => prisma.voiceAutomationRule.findMany({ orderBy: [{ status: 'asc' }, { name: 'asc' }] }), [] as any[])
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      rules,
      pipeline: ['TRIGGER', 'CONDITION', 'AI DECISION', 'ACTION'],
      engine: engineStatus(),
    })
  })

  // ── policies ──────────────────────────────────────────────
  app.get('/voice/policies', authMiddleware(), async (c: any) => {
    const policies = await safe(() => prisma.voicePolicy.findMany({ where: { category: { not: 'runtime' } }, orderBy: [{ category: 'asc' }, { label: 'asc' }] }), [] as any[])
    const groups = Array.from(new Set(policies.map((p) => p.category))).map((category) => ({
      category,
      items: policies.filter((p) => p.category === category).map((p) => ({ id: p.id, key: p.key, label: p.label, value: p.value, valueType: p.valueType, unit: p.unit, description: p.description, enforced: p.enforced })),
    }))
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      governance: 'Human-supervised by construction: every agent can be disabled by the founder instantly, and the kill switch halts all outbound calling.',
      policies: policies.map((p) => ({ id: p.id, key: p.key, label: p.label, category: p.category, value: p.value, valueType: p.valueType, unit: p.unit, description: p.description, enforced: p.enforced })),
      groups,
    })
  })

  // ── analytics ─────────────────────────────────────────────
  app.get('/voice/analytics', authMiddleware(), async (c: any) => {
    const days = Math.min(60, Number(c.req.query('days')) || 30)
    const since = new Date(Date.now() - days * 86400000)
    const calls = await safe(() => prisma.voiceCall.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'asc' } }), [] as any[])
    const input = calls.map((x) => ({
      direction: x.direction, status: x.status, confidence: x.confidence, durationSec: x.durationSec,
      quoteAmount: x.quoteAmount, costUsd: x.costUsd, createdAt: new Date(x.createdAt), intent: x.intent ?? 'Unknown',
    }))
    const escalations = await safe(() => prisma.voiceEscalation.count(), 0)
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      days,
      ...deriveAnalytics(input, days),
      escalationsTotal: escalations,
    })
  })

  // ── communication hub ─────────────────────────────────────
  app.get('/voice/hub', authMiddleware(), async (c: any) => {
    await runTick(c.get('userId'))
    const events = await safe(() => prisma.commEvent.findMany({ orderBy: { occurredAt: 'desc' }, take: 300 }), [] as any[])
    const calls = await safe(() => prisma.voiceCall.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }), [] as any[])

    const channels = (['voice', 'whatsapp', 'email'] as const).map((channel) => {
      const bucket = events.filter((e) => e.channel === channel)
      return {
        channel,
        total: bucket.length,
        outbound: bucket.filter((e) => e.direction === 'outbound').length,
        inbound: bucket.filter((e) => e.direction === 'inbound').length,
        responded: bucket.filter((e) => e.outcome === 'responded' || e.outcome === 'read').length,
        failed: bucket.filter((e) => e.outcome === 'failed').length,
      }
    })

    const byCompany = events.reduce<Record<string, { company: string; contact: string; events: any[]; lastAt: Date }>>((acc, e) => {
      const key = e.company ?? 'Unknown'
      acc[key] = acc[key] || { company: key, contact: e.contactName, events: [], lastAt: new Date(e.occurredAt) }
      acc[key].events.push({ id: e.id, ref: e.ref, channel: e.channel, direction: e.direction, subject: e.subject, body: e.body, outcome: e.outcome, occurredAt: e.occurredAt, callRef: e.callRef, entityType: e.entityType, rfqNumber: e.rfqNumber })
      return acc
    }, {})

    const contacts = Object.values(byCompany)
      .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime())
      .slice(0, 24)
      .map((x) => ({
        company: x.company,
        contact: x.contact,
        lastAt: x.lastAt,
        channels: Array.from(new Set(x.events.map((e) => e.channel))),
        eventCount: x.events.length,
        voiceCalls: calls.filter((cc) => cc.company === x.company).length,
        lastConversation: x.events[0]?.subject ?? null,
        aiSummary: `${x.events.length} communication events recorded across ${Array.from(new Set(x.events.map((e) => e.channel))).join(', ')}. Most recent: ${x.events[0]?.subject ?? '—'}.`,
        nextRecommendedAction: x.events[0]?.channel === 'voice'
          ? 'Send the written summary and confirm the recorded commitment on WhatsApp.'
          : 'Follow up with a voice call if there is no response within the SLA window.',
        openTasks: x.events.filter((e) => e.outcome === 'no_response').length,
        preferences: { channel: x.events[0]?.channel ?? 'voice', language: 'hi-en', timeWindow: '10:00–13:00 IST' },
        events: x.events.slice(0, 12),
      }))

    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      channels,
      events: events.slice(0, 60).map((e) => ({
        id: e.id, ref: e.ref, channel: e.channel, direction: e.direction, contactName: e.contactName,
        company: e.company, subject: e.subject, body: e.body, outcome: e.outcome, callRef: e.callRef,
        entityType: e.entityType, rfqNumber: e.rfqNumber, occurredAt: e.occurredAt,
      })),
      contacts,
      principle: 'Voice is one communication capability inside Bell24h-OS, not a standalone application. Every communication event — call, WhatsApp or email — becomes a business event in the operating memory.',
    })
  })

  // ── inbound receptionist ──────────────────────────────────
  app.get('/voice/receptionist', authMiddleware(), async (c: any) => {
    await runTick(c.get('userId'))
    const inbound = await safe(() => prisma.voiceCall.findMany({ where: { direction: 'inbound' }, orderBy: { createdAt: 'desc' }, take: 40 }), [] as any[])
    const intents = RECEPTIONIST_FAQS.map((f) => ({
      ...f,
      calls: inbound.filter((x) => x.intent === f.intent).length,
      resolved: inbound.filter((x) => x.intent === f.intent && x.status === 'completed').length,
      escalated: inbound.filter((x) => x.intent === f.intent && x.status === 'escalated').length,
    }))
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      capabilities: [
        'Answer incoming calls', 'Identify the caller', 'Look up CRM', 'Identify intent',
        'Answer approved FAQs', 'Check RFQ status', 'Check order status', 'Collect an enquiry',
        'Schedule a callback', 'Transfer to the founder', 'Create a CRM activity',
      ],
      intents,
      recent: inbound.slice(0, 12).map(shapeCall),
      stats: {
        inboundToday: inbound.filter((x) => new Date(x.createdAt) >= new Date(new Date().setHours(0, 0, 0, 0))).length,
        aiResolved: inbound.filter((x) => x.status === 'completed').length,
        transferred: inbound.filter((x) => x.status === 'escalated').length,
        missed: inbound.filter((x) => x.status === 'no_answer').length,
      },
    })
  })

  // ── telephony architecture ────────────────────────────────
  app.get('/voice/architecture', authMiddleware(), async (c: any) => {
    const numbers = await safe(() => prisma.voiceNumber.findMany(), [] as any[])
    const providers = await safe(() => prisma.voiceProvider.findMany(), [] as any[])
    return c.json({
      simulation: true,
      banner: SIMULATION_BANNER,
      label: 'PROTOTYPE ARCHITECTURE — NOT CONNECTED TO LIVE TELEPHONY',
      layers: TELEPHONY_LAYERS,
      stack: VOICE_STACK_COMPONENTS,
      numbers,
      providerCounts: PROVIDER_CATEGORIES.map((category) => ({ category, count: providers.filter((p) => p.category === category).length })),
      integrationPoints: ['CRM', 'RFQ', 'Supplier', 'Buyer', 'Job Queue', 'Workflow Engine', 'AI Router', 'Founder Cockpit'],
    })
  })

  // ── simulated action gateway ──────────────────────────────
  app.post('/voice/simulate', authMiddleware(), async (c: any) => {
    const userId = c.get('userId')
    let body: any = {}
    try { body = await c.req.json() } catch { body = {} }
    const { action, payload = {} } = body
    if (!action) return c.json({ error: 'action is required' }, 400)

    const label = String(action).replace(/_/g, ' ')

    switch (action) {
      case 'call': {
        ENGINE.placed++
        await logSimulated(userId, 'call', 'voice_call', payload.ref, payload)
        return c.json({ ...simulated(`AI call initiated to ${payload.contact ?? 'the selected contact'}`, 'A simulated call was queued. No carrier was contacted and no number was dialled.'), queued: true })
      }
      case 'start_campaign':
      case 'pause_campaign':
      case 'resume_campaign':
      case 'stop_campaign': {
        const next = action === 'pause_campaign' ? 'paused' : action === 'stop_campaign' ? 'stopped' : action === 'start_campaign' ? 'running' : 'running'
        let updated = null
        if (payload.code) {
          updated = await safe(() => prisma.voiceCampaign.update({ where: { code: payload.code }, data: { status: next } }), null)
        }
        await logSimulated(userId, action, 'voice_campaign', payload.code, payload)
        return c.json({ ...simulated(`Campaign ${label}${payload.name ? ` — ${payload.name}` : ''}`, `Status set to "${next}". Campaign execution is simulated; no calls will leave the platform.`), campaign: updated })
      }
      case 'set_default_provider': {
        const provider = await safe(() => prisma.voiceProvider.findFirst({ where: { key: payload.key } }), null as any)
        if (!provider) return c.json({ error: `Provider ${payload.key} not found` }, 404)
        await safe(() => prisma.voiceProvider.updateMany({ where: { category: provider.category }, data: { isDefault: false } }), null)
        const updated = await safe(() => prisma.voiceProvider.update({ where: { key: provider.key }, data: { isDefault: true } }), null)
        await logSimulated(userId, 'set_default_provider', 'voice_provider', provider.key, payload)
        return c.json({ ...simulated(`${provider.name} set as the default ${provider.category} provider`, 'No credentials were required — provider configuration in the prototype is simulated.'), provider: updated })
      }
      case 'test_provider': {
        const provider = await safe(() => prisma.voiceProvider.findFirst({ where: { key: payload.key } }), null as any)
        if (!provider) return c.json({ error: `Provider ${payload.key} not found` }, 404)
        await logSimulated(userId, 'test_provider', 'voice_provider', provider.key, payload)
        return c.json({
          ...simulated(`Health probe on ${provider.name}`, `Simulated round trip ${provider.latencyMs}ms, reported health ${provider.health}%. No outbound network request was made.`),
          result: { latencyMs: provider.latencyMs, health: provider.health, ok: provider.health >= 90 },
        })
      }
      case 'set_provider_status': {
        const provider = await safe(() => prisma.voiceProvider.findFirst({ where: { key: payload.key } }), null as any)
        if (!provider) return c.json({ error: `Provider ${payload.key} not found` }, 404)
        const updated = await safe(() => prisma.voiceProvider.update({ where: { key: provider.key }, data: { status: payload.status ?? 'enabled' } }), null)
        await logSimulated(userId, 'set_provider_status', 'voice_provider', provider.key, payload)
        return c.json({ ...simulated(`${provider.name} ${payload.status === 'disabled' ? 'disabled' : 'enabled'}`, 'Provider state is simulated.'), provider: updated })
      }
      case 'set_default_voice': {
        const voice = await safe(() => prisma.voiceProfile.findFirst({ where: { key: payload.key } }), null as any)
        if (!voice) return c.json({ error: `Voice ${payload.key} not found` }, 404)
        await safe(() => prisma.voiceProfile.updateMany({ where: { language: voice.language }, data: { isDefault: false } }), null)
        const updated = await safe(() => prisma.voiceProfile.update({ where: { key: voice.key }, data: { isDefault: true } }), null)
        await logSimulated(userId, 'set_default_voice', 'voice_profile', voice.key, payload)
        return c.json({ ...simulated(`${voice.name} set as the default ${voice.language} voice`, 'Demo voice catalogue — no audio synth provider was contacted.'), voice: updated })
      }
      case 'set_agent_status': {
        const agent = await safe(() => prisma.voiceAgent.findFirst({ where: { key: payload.key } }), null as any)
        if (!agent) return c.json({ error: `Agent ${payload.key} not found` }, 404)
        const updated = await safe(() => prisma.voiceAgent.update({ where: { key: agent.key }, data: { status: payload.status ?? 'active' } }), null)
        await logSimulated(userId, 'set_agent_status', 'voice_agent', agent.key, payload)
        return c.json({
          ...simulated(`${agent.name} ${payload.status === 'disabled' ? 'disabled — it can no longer place any call' : 'enabled'}`, 'The founder kill switch and per-agent disable are enforced before any dial.'),
          agent: updated,
        })
      }
      case 'kill_switch': {
        await safe(() => prisma.voiceAgent.updateMany({ where: {}, data: { status: 'disabled' } }), null)
        ENGINE.running = false
        await safe(() => prisma.voiceCampaign.updateMany({ where: { status: 'running' }, data: { status: 'paused' } }), null)
        await logSimulated(userId, 'kill_switch', 'voice_engine', undefined, payload)
        return c.json({ ...simulated('Founder kill switch engaged', 'Every agent has been disabled and all running campaigns paused. The automation engine is stopped. Nothing will dial until you re-enable.'), halted: true })
      }
      case 'update_policy': {
        const policy = await safe(() => prisma.voicePolicy.findFirst({ where: { key: payload.key } }), null as any)
        if (!policy) return c.json({ error: `Policy ${payload.key} not found` }, 404)
        const updated = await safe(() => prisma.voicePolicy.update({ where: { key: policy.key }, data: { value: String(payload.value) } }), null)
        await logSimulated(userId, 'update_policy', 'voice_policy', policy.key, { from: policy.value, to: payload.value })
        return c.json({ ...simulated(`${policy.label} updated`, `Value changed from "${policy.value}" to "${payload.value}". This is a prototype control and does not yet gate real traffic.`), policy: updated })
      }
      case 'set_rule_status': {
        const rule = await safe(() => prisma.voiceAutomationRule.findFirst({ where: { code: payload.code } }), null as any)
        if (!rule) return c.json({ error: `Rule ${payload.code} not found` }, 404)
        const updated = await safe(() => prisma.voiceAutomationRule.update({ where: { code: rule.code }, data: { status: payload.status ?? 'enabled' } }), null)
        await logSimulated(userId, 'set_rule_status', 'voice_automation_rule', rule.code, payload)
        return c.json({ ...simulated(`Automation rule "${rule.name}" ${payload.status === 'enabled' ? 'enabled' : 'disabled'}`, 'Rule evaluation is simulated.'), rule: updated })
      }
      case 'resolve_escalation': {
        const esc = await safe(() => prisma.voiceEscalation.findFirst({ where: { ref: payload.ref } }), null as any)
        if (!esc) return c.json({ error: `Escalation ${payload.ref} not found` }, 404)
        const updated = await safe(() => prisma.voiceEscalation.update({ where: { ref: esc.ref }, data: { status: payload.status ?? 'resolved', resolvedAt: new Date(), assignedTo: 'Founder' } }), null)
        await logSimulated(userId, 'resolve_escalation', 'voice_escalation', esc.ref, payload)
        return c.json({ ...simulated(`Escalation ${esc.ref} marked ${payload.status ?? 'resolved'}`, 'The escalation record was updated in the audit trail.'), escalation: updated })
      }
      case 'accept_call':
      case 'take_over':
      case 'whisper':
      case 'transfer':
      case 'pause_agent': {
        await logSimulated(userId, action, 'voice_call', payload.ref, payload)
        const copy: Record<string, string> = {
          accept_call: 'The founder accepted the escalated call in the prototype console.',
          take_over: 'Human take-over simulated — the AI agent stepped out of the conversation. In production this re-routes the live media stream to the founder.',
          whisper: 'Whisper channel simulated — guidance would be injected into the agent’s live context without the contact hearing it.',
          transfer: 'Transfer simulated — the call would be re-routed to another agent or a human queue.',
          pause_agent: 'Agent paused — it will finish the current turn and hold.',
        }
        return c.json(simulated(`${label} on ${payload.ref ?? 'the active call'}`, copy[action]))
      }
      case 'end_call': {
        if (payload.ref) {
          await safe(() => prisma.voiceCall.updateMany({ where: { ref: payload.ref, status: { in: ['in_progress', 'ringing'] } }, data: { status: 'completed', state: 'wrap_up', endedAt: new Date(), outcome: 'Ended by founder', nextAction: 'Send WhatsApp summary' } }), null)
        }
        await logSimulated(userId, 'end_call', 'voice_call', payload.ref, payload)
        return c.json(simulated(`Call ${payload.ref ?? ''} ended`, 'The simulated call was closed and the wrap-up step was recorded.'))
      }
      case 'record': {
        await logSimulated(userId, 'record', 'voice_call', payload.ref, payload)
        return c.json(simulated('Recording toggled', 'Audio is never captured in the prototype. The recording policy announces disclosure and retains simulated audio for 90 days.'))
      }
      case 'send_summary':
      case 'send_whatsapp': {
        await safe(() => prisma.commEvent.create({
          data: {
            ref: svcRef('CE', 12000 + Math.floor(Math.random() * 8000)),
            channel: 'whatsapp',
            direction: 'outbound',
            contactName: payload.contact ?? 'Contact',
            company: payload.company ?? null,
            subject: payload.subject ?? 'Call summary sent',
            body: payload.body ?? 'Simulated WhatsApp summary generated from the call transcript.',
            outcome: 'delivered',
            callRef: payload.ref ?? null,
            entityType: payload.entityType ?? 'supplier',
            rfqNumber: payload.rfqNumber ?? null,
          },
        }), null)
        await logSimulated(userId, 'send_whatsapp', 'comm_event', payload.ref, payload)
        return c.json(simulated('WhatsApp summary queued', 'Delivery is simulated and recorded as a business event in the operating memory.'))
      }
      case 'create_quote':
      case 'update_rfq': {
        if (payload.ref) {
          await safe(() => prisma.voiceCall.update({
            where: { ref: payload.ref },
            data: { outcome: action === 'create_quote' ? 'Quote created from call' : 'RFQ updated from call', nextAction: 'Await buyer decision' },
          }), null)
        }
        await logSimulated(userId, action, 'voice_call', payload.ref, payload)
        return c.json(simulated(
          action === 'create_quote' ? 'Supplier quote created from the extracted data' : 'RFQ updated from the extracted data',
          'The write is simulated but the extracted fields shown on screen are the real values parsed from the transcript.',
        ))
      }
      case 'schedule_callback': {
        await logSimulated(userId, 'schedule_callback', 'voice_queue_job', payload.ref, payload)
        return c.json(simulated(`Callback scheduled${payload.when ? ` for ${payload.when}` : ''}`, 'A simulated queue job will hold the callback inside calling hours.'))
      }
      case 'retry_job': {
        if (payload.ref) {
          await safe(() => prisma.voiceQueueJob.updateMany({ where: { ref: payload.ref }, data: { status: 'pending', attempt: { increment: 1 }, nextAction: 'Retry queued by founder' } }), null)
        }
        await logSimulated(userId, 'retry_job', 'voice_queue_job', payload.ref, payload)
        return c.json(simulated(`Job ${payload.ref ?? ''} re-queued`))
      }
      case 'engine_start': {
        ENGINE.running = true
        ENGINE.startedAt = ENGINE.startedAt ?? new Date().toISOString()
        ENGINE.lastTickAt = new Date().toISOString()
        ENGINE.note = 'Voice calling automation agent is running. It advances the simulated queue state machine; it does not dial real numbers.'
        await persistEngineState()
        await logSimulated(userId, 'engine.start', 'voice_engine')
        return c.json({ engine: engineStatus(), ...simulated('Voice calling automation agent started', 'The simulated queue driver is now advancing calls. Nothing was dialled — the carrier edge is a stub.') })
      }
      case 'engine_stop': {
        ENGINE.running = false
        ENGINE.note = 'Voice calling automation agent is stopped. No simulated calls will be advanced until it is restarted.'
        await persistEngineState()
        await logSimulated(userId, 'engine.stop', 'voice_engine')
        return c.json({ engine: engineStatus(), ...simulated('Voice calling automation agent stopped', 'The simulated queue driver has been halted.') })
      }
      case 'create_campaign': {
        const code = `CMP-${String(payload.name ?? 'NEW').toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 20)}-${Math.floor(Math.random() * 900 + 100)}`
        const created = await safe(() => prisma.voiceCampaign.create({
          data: {
            code,
            name: payload.name ?? 'New campaign',
            targetAudience: payload.targetAudience ?? 'Not configured',
            contactSource: payload.contactSource ?? 'Manual',
            objective: payload.objective ?? 'Not configured',
            agentKey: payload.agentKey ?? 'rfq_followup',
            scriptCode: payload.scriptCode ?? 'SCR-RFQ-FOLLOWUP',
            language: payload.language ?? 'en-IN',
            maxCallsPerDay: Number(payload.maxCallsPerDay) || 100,
            callingHours: payload.callingHours ?? '09:30–19:00 IST',
            status: 'draft',
            totalTargets: 0,
          },
        }), null as any)
        await logSimulated(userId, 'create_campaign', 'voice_campaign', created?.code, payload)
        return c.json({ ...simulated(`Campaign "${payload.name ?? 'New campaign'}" created as a draft`, 'No calls will be placed until the campaign is started.'), campaign: created })
      }
      case 'seed': {
        const result = await seedVoiceDemo(Boolean(payload.force), userId)
        return c.json({ ...simulated('Demo dataset generated', 'All records are simulated and deterministic.'), result })
      }
      default:
        return c.json({ ...simulated(`${label} recorded`), note: 'Unrecognised action — recorded as a simulation for the audit trail.' })
    }
  })

  // ── demo data seeding ─────────────────────────────────────
  app.post('/voice/seed', authMiddleware(), async (c: any) => {
    let body: any = {}
    try { body = await c.req.json() } catch { body = {} }
    const result = await seedVoiceDemo(Boolean(body.force), c.get('userId'))
    return c.json({ ...simulated('Demo dataset generated', 'All records are simulated and deterministic.'), ...result })
  })

  return app
}

// ─────────────────────────────────────────────────────────────
// SEEDING
// ─────────────────────────────────────────────────────────────

async function seedVoiceDemo(force: boolean, userId?: string) {
  const existing = await safe(() => prisma.voiceAgent.count(), 0)
  if (existing > 0 && !force) {
    return { seeded: false, reason: 'Voice demo data already present. Pass force: true to regenerate.', counts: await counts() }
  }

  if (force) {
    await safe(() => prisma.voiceCallMessage.deleteMany({}), null)
    await safe(() => prisma.voiceCall.deleteMany({}), null)
    await safe(() => prisma.voiceQueueJob.deleteMany({}), null)
    await safe(() => prisma.voiceEscalation.deleteMany({}), null)
    await safe(() => prisma.commEvent.deleteMany({}), null)
    await safe(() => prisma.voiceAgent.deleteMany({}), null)
    await safe(() => prisma.voiceCampaign.deleteMany({}), null)
    await safe(() => prisma.voiceScript.deleteMany({}), null)
    await safe(() => prisma.voiceProvider.deleteMany({}), null)
    await safe(() => prisma.voiceProfile.deleteMany({}), null)
    await safe(() => prisma.voiceNumber.deleteMany({}), null)
    await safe(() => prisma.voiceAutomationRule.deleteMany({}), null)
    await safe(() => prisma.voicePolicy.deleteMany({}), null)
  }

  // Agents
  await safe(() => prisma.voiceAgent.createMany({
    data: AGENT_BLUEPRINTS.map((a, i) => ({
      key: a.key,
      name: a.name,
      purpose: a.purpose,
      role: a.role,
      language: a.language,
      voiceName: a.voiceName,
      personality: a.personality,
      businessContext: a.businessContext,
      systemObjective: a.systemObjective,
      knowledgeBase: JSON.stringify(a.knowledgeBase),
      allowedActions: JSON.stringify(a.allowedActions),
      restrictedActions: JSON.stringify(a.restrictedActions),
      tools: JSON.stringify(a.tools),
      decisionRules: JSON.stringify(a.decisionRules),
      callFlow: JSON.stringify(RFQ_CALL_FLOW),
      successCriteria: JSON.stringify(a.successCriteria),
      failureCriteria: JSON.stringify(a.failureCriteria),
      escalationRules: JSON.stringify(a.escalationRules),
      workingHours: a.workingHours,
      maxCallsPerDay: a.maxCallsPerDay,
      escalationThreshold: a.escalationThreshold,
      status: a.status,
      approvalState: a.approvalState,
      totalCalls: 120 + i * 37,
      resolutionRate: Math.round((0.62 + (i % 5) * 0.06) * 1000) / 1000,
    })),
  }), null)

  await safe(() => prisma.voiceCampaign.createMany({
    data: CAMPAIGN_BLUEPRINTS.map((x, i) => {
      const r = ((i * 9301 + 49297) % 233280) / 233280
      const targets = 40 + Math.floor(r * 160)
      const called = Math.floor(targets * (x.status === 'running' ? 0.62 : x.status === 'paused' ? 0.34 : x.status === 'scheduled' ? 0.08 : 0))
      return {
        code: x.code,
        name: x.name,
        campaignType: 'outbound',
        targetAudience: x.targetAudience,
        contactSource: x.contactSource,
        objective: x.objective,
        agentKey: x.agentKey,
        scriptCode: x.scriptCode,
        language: i % 3 === 0 ? 'hi-en' : 'en-IN',
        voiceName: i % 3 === 0 ? 'Ananya' : 'Arjun',
        maxCallsPerDay: x.maxCallsPerDay,
        callingHours: '09:30–19:00 IST',
        retryPolicy: 'Attempt 1 immediate · attempt 2 after 2h · attempt 3 next working day',
        maxAttempts: 3,
        escalationRule: 'Escalate when confidence < 0.58 or the contact requests a human',
        successCondition: 'Structured outcome extracted and written back to the business entity',
        failureCondition: 'Maximum attempts exhausted or the contact opts out',
        status: x.status,
        totalTargets: targets,
        totalCalled: called,
        totalConnected: Math.floor(called * 0.78),
        totalSuccess: Math.floor(called * 0.52),
      }
    }),
  }), null)

  await safe(() => prisma.voiceScript.createMany({
    data: SCRIPT_BLUEPRINTS.map((s, i) => ({
      code: s.code,
      name: s.name,
      agentKey: s.agentKey,
      language: s.language,
      tone: s.tone,
      opening: s.opening,
      verification: s.verification,
      purpose: s.purpose,
      questions: s.questions,
      objections: s.objections,
      negotiation: s.negotiation,
      closing: s.closing,
      escalation: s.escalation,
      fallback: s.fallback,
      variables: JSON.stringify(s.variables),
      status: 'published',
      version: 1 + (i % 3),
    })),
  }), null)

  await safe(() => prisma.voiceProvider.createMany({
    data: PROVIDER_BLUEPRINTS.map((p) => ({ ...p })),
  }), null)

  await safe(() => prisma.voiceProfile.createMany({
    data: VOICE_BLUEPRINTS.map((v) => ({
      key: v.key, name: v.name, language: v.language, gender: v.gender, style: v.style,
      speed: v.speed, pitch: v.pitch, provider: v.provider, accent: v.accent ?? null,
      status: (v as any).status ?? 'enabled', isDefault: Boolean((v as any).isDefault),
    })),
  }), null)

  await safe(() => prisma.voiceNumber.createMany({
    data: NUMBER_BLUEPRINTS.map((n) => ({ ...n })),
  }), null)

  await safe(() => prisma.voiceAutomationRule.createMany({
    data: AUTOMATION_BLUEPRINTS.map((a, i) => ({
      code: a.code, name: a.name, trigger: a.trigger, conditions: a.conditions,
      aiDecision: a.aiDecision, action: a.action, agentKey: a.agentKey ?? null,
      channel: a.channel, status: i === 9 ? 'disabled' : 'enabled', runCount: a.runCount,
      lastRunAt: new Date(Date.now() - (i + 1) * 37 * 60000),
    })),
  }), null)

  await safe(() => prisma.voicePolicy.createMany({
    data: POLICY_BLUEPRINTS.map((p) => ({
      key: p.key, label: p.label, category: p.category, value: p.value,
      valueType: p.valueType, unit: (p as any).unit ?? null, description: p.description,
      enforced: true,
    })),
  }), null)

  // Calls: 47 today + history across the previous 29 days.
  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
  const calls: any[] = []
  const messages: any[] = []
  let index = 0

  const pushCall = (dayOffset: number, forceLive: boolean) => {
    const gen = generateCall(index, dayOffset, { todayStart })
    const id = `vc_${gen.ref}_${index}`
    if (forceLive) {
      gen.status = 'in_progress'
      gen.state = (['speaking', 'listening', 'thinking', 'speaking', 'wrap_up'] as const)[index % 5] as any
      gen.durationSec = 45 + index * 27
      gen.endedAt = null
      gen.startedAt = new Date(now.getTime() - gen.durationSec * 1000)
      gen.outcome = 'In progress'
      const r = rng(`live:${index}`)
      gen.turns = [
        { speaker: 'AI', text: `Hello, this is the Bell24h supplier assistant calling regarding ${gen.rfqNumber}. Is this a good time?`, atSec: 2 },
        { speaker: 'Contact', text: 'Yes, go ahead.', atSec: 9, sentiment: 'neutral' },
        { speaker: 'AI', text: `Can you supply the requested quantity within the buyer's timeline?`, atSec: 14 },
        { speaker: 'Contact', text: 'We can, but delivery will take a few days longer.', atSec: 28, sentiment: 'cautious' },
        { speaker: 'AI', text: 'Understood — what would be your price per unit?', atSec: 34 },
        { speaker: 'Contact', text: 'Let me confirm and come back to you.', atSec: gen.durationSec - 6, sentiment: 'neutral' },
      ]
    }
    calls.push({
      id,
      ref: gen.ref,
      campaignId: null,
      agentKey: gen.agentKey,
      contactName: gen.contactName,
      company: gen.company,
      contactRole: gen.contactRole,
      phoneMasked: gen.phoneMasked,
      entityType: gen.entityType,
      direction: gen.direction,
      status: gen.status,
      state: gen.state,
      intent: gen.intent,
      objective: gen.objective,
      sentiment: gen.sentiment,
      confidence: gen.confidence,
      durationSec: gen.durationSec,
      outcome: gen.outcome,
      nextAction: gen.nextAction,
      summary: gen.summary,
      extractedData: gen.extractedData ? JSON.stringify(gen.extractedData) : null,
      rfqNumber: gen.rfqNumber,
      quoteAmount: gen.quoteAmount,
      recordingState: 'simulated',
      language: gen.language,
      costUsd: gen.costUsd,
      attempt: gen.attempt,
      startedAt: gen.startedAt,
      endedAt: gen.endedAt,
      createdAt: gen.createdAt,
    })
    gen.turns.forEach((t, i) => {
      messages.push({ id: `${id}_m${i}`, callId: id, seq: i, speaker: t.speaker, text: t.text, atSec: t.atSec, sentiment: t.sentiment ?? null })
    })
    index++
  }

  for (let i = 0; i < 47; i++) pushCall(0, i < 5)
  for (let day = 1; day <= 29; day++) {
    const r = rng(`day:${day}`)
    const count = 7 + Math.floor(r() * 8)
    for (let i = 0; i < count; i++) pushCall(day, false)
  }

  // createMany in chunks — SQLite has a bound-parameter ceiling.
  for (let i = 0; i < calls.length; i += 80) {
    await safe(() => prisma.voiceCall.createMany({ data: calls.slice(i, i + 80) }), null)
  }
  for (let i = 0; i < messages.length; i += 200) {
    await safe(() => prisma.voiceCallMessage.createMany({ data: messages.slice(i, i + 200) }), null)
  }

  await safe(() => prisma.voiceQueueJob.createMany({
    data: generateQueueJobs(now).map((j) => ({
      ref: j.ref, contactName: j.contactName, company: j.company, phoneMasked: j.phoneMasked,
      campaignCode: j.campaignCode, agentKey: j.agentKey, priority: j.priority, status: j.status,
      attempt: j.attempt, scheduledFor: j.scheduledFor, nextAction: j.nextAction, reason: j.reason,
    })),
  }), null)

  await safe(() => prisma.voiceEscalation.createMany({
    data: generateEscalations(now).map((e) => ({
      ref: e.ref, callRef: e.callRef, contactName: e.contactName, company: e.company,
      reason: e.reason, severity: e.severity, transcript: e.transcript, recommendation: e.recommendation,
      summary: e.summary, rfqNumber: e.rfqNumber, status: e.status, assignedTo: e.assignedTo,
      raisedAt: e.raisedAt, resolvedAt: e.resolvedAt,
    })),
  }), null)

  await safe(() => prisma.commEvent.createMany({
    data: generateCommEvents(now, 90).map((e) => ({
      ref: e.ref, channel: e.channel, direction: e.direction, contactName: e.contactName,
      company: e.company, subject: e.subject, body: e.body, outcome: e.outcome,
      callRef: e.callRef, entityType: e.entityType, rfqNumber: e.rfqNumber, occurredAt: e.occurredAt,
    })),
  }), null)

  await logSimulated(userId, 'seed', 'voice_demo_data', undefined, { calls: calls.length, messages: messages.length })

  return { seeded: true, counts: await counts() }
}

async function counts() {
  const [agents, campaigns, calls, messages, jobs, escalations, commEvents, providers, voices, numbers, rules, policies, scripts] = await Promise.all([
    safe(() => prisma.voiceAgent.count(), 0),
    safe(() => prisma.voiceCampaign.count(), 0),
    safe(() => prisma.voiceCall.count(), 0),
    safe(() => prisma.voiceCallMessage.count(), 0),
    safe(() => prisma.voiceQueueJob.count(), 0),
    safe(() => prisma.voiceEscalation.count(), 0),
    safe(() => prisma.commEvent.count(), 0),
    safe(() => prisma.voiceProvider.count(), 0),
    safe(() => prisma.voiceProfile.count(), 0),
    safe(() => prisma.voiceNumber.count(), 0),
    safe(() => prisma.voiceAutomationRule.count(), 0),
    safe(() => prisma.voicePolicy.count(), 0),
    safe(() => prisma.voiceScript.count(), 0),
  ])
  return { agents, campaigns, calls, messages, jobs, escalations, commEvents, providers, voices, numbers, rules, policies, scripts }
}

// ─────────────────────────────────────────────────────────────
// SHAPERS
// ─────────────────────────────────────────────────────────────

function shapeCall(x: any) {
  return {
    id: x.id,
    ref: x.ref,
    contactName: x.contactName,
    company: x.company,
    contactRole: x.contactRole,
    phoneMasked: x.phoneMasked,
    entityType: x.entityType,
    direction: x.direction,
    status: x.status,
    state: x.state,
    intent: x.intent,
    objective: x.objective,
    sentiment: x.sentiment,
    confidence: x.confidence,
    durationSec: x.durationSec,
    outcome: x.outcome,
    nextAction: x.nextAction,
    summary: x.summary,
    rfqNumber: x.rfqNumber,
    quoteAmount: x.quoteAmount,
    language: x.language,
    costUsd: x.costUsd,
    attempt: x.attempt,
    recordingState: x.recordingState,
    agentKey: x.agentKey,
    startedAt: x.startedAt,
    endedAt: x.endedAt,
    createdAt: x.createdAt,
  }
}

function shapeAgentSummary(x: any) {
  return {
    key: x.key,
    name: x.name,
    purpose: x.purpose,
    role: x.role,
    status: x.status,
    approvalState: x.approvalState,
    language: x.language,
    voiceName: x.voiceName,
    personality: x.personality,
    totalCalls: x.totalCalls,
    resolutionRate: x.resolutionRate,
    escalationThreshold: x.escalationThreshold,
    maxCallsPerDay: x.maxCallsPerDay,
    workingHours: x.workingHours,
  }
}

function shapeCampaign(x: any) {
  return {
    id: x.id,
    code: x.code,
    name: x.name,
    campaignType: x.campaignType,
    agentKey: x.agentKey,
    status: x.status,
    totalTargets: x.totalTargets,
    totalCalled: x.totalCalled,
    totalConnected: x.totalConnected,
    totalSuccess: x.totalSuccess,
    maxCallsPerDay: x.maxCallsPerDay,
    progress: x.totalTargets ? Math.round((x.totalCalled / x.totalTargets) * 1000) / 10 : 0,
    connectionRate: x.totalCalled ? Math.round((x.totalConnected / x.totalCalled) * 1000) / 10 : 0,
    successRate: x.totalConnected ? Math.round((x.totalSuccess / x.totalConnected) * 1000) / 10 : 0,
  }
}

function shapeEscalation(x: any) {
  return {
    id: x.id,
    ref: x.ref,
    callRef: x.callRef,
    contactName: x.contactName,
    company: x.company,
    reason: x.reason,
    severity: x.severity,
    transcript: x.transcript,
    recommendation: x.recommendation,
    summary: x.summary,
    rfqNumber: x.rfqNumber,
    status: x.status,
    assignedTo: x.assignedTo,
    raisedAt: x.raisedAt,
    resolvedAt: x.resolvedAt,
  }
}

function shapeProvider(x: any) {
  return {
    id: x.id,
    key: x.key,
    name: x.name,
    category: x.category,
    vendor: x.vendor,
    status: x.status,
    latencyMs: x.latencyMs,
    costPerUnit: x.costPerUnit,
    costUnit: x.costUnit,
    health: x.health,
    isDefault: x.isDefault,
    isFallback: x.isFallback,
    region: x.region,
    notes: x.notes,
  }
}
