// Sprint 3A: Enterprise AI Router Hardening — Route Definitions
import { Hono } from 'hono'
import { prisma } from './src/lib/db'

const r = new Hono()

// ─── Helpers ───
function genId() { return Math.random().toString(36).substring(2, 15) + Date.now().toString(36) }
function now() { return new Date() }

// ═══════════════════════════════════════════════════════════
// 1. ROUTING POLICIES
// ═══════════════════════════════════════════════════════════

const SYSTEM_POLICIES = [
  { name: 'Fastest Response', slug: 'fastest', strategy: 'fastest', description: 'Routes to provider with lowest latency', priority: 10 },
  { name: 'Lowest Cost', slug: 'cheapest', strategy: 'cheapest', description: 'Routes to provider with lowest cost per token', priority: 20 },
  { name: 'Highest Quality', slug: 'highest_quality', strategy: 'highest_quality', description: 'Routes to highest-quality model regardless of cost', priority: 30 },
  { name: 'Balanced', slug: 'balanced', strategy: 'balanced', description: 'Balances cost, quality, and latency', priority: 40 },
  { name: 'Fallback Only', slug: 'fallback_only', strategy: 'fallback_only', description: 'Only used when primary provider fails', priority: 50 },
  { name: 'Cost Capped', slug: 'cost_capped', strategy: 'cost_capped', description: 'Routes within a configurable cost ceiling', priority: 60 },
  { name: 'Quality Minimum', slug: 'quality_minimum', strategy: 'quality_minimum', description: 'Ensures minimum quality score threshold', priority: 70 },
  { name: 'Region Restricted', slug: 'region_restricted', strategy: 'region_restricted', description: 'Routes only to providers in specified regions', priority: 80 },
]

r.get('/ai-router/policies', async (c) => {
  const userId = c.get('userId') as string
  let policies = await prisma.routingPolicy.findMany({ orderBy: { priority: 'asc' } })
  if (policies.length === 0) {
    for (const p of SYSTEM_POLICIES) {
      await prisma.routingPolicy.create({ data: { ...p, type: 'system', isActive: true } })
    }
    policies = await prisma.routingPolicy.findMany({ orderBy: { priority: 'asc' } })
  }
  const custom = await prisma.routingPolicy.findMany({ where: { userId, type: 'custom' }, orderBy: { priority: 'asc' } })
  return c.json({ policies, custom })
})

r.post('/ai-router/policies', async (c) => {
  const userId = c.get('userId') as string
  const orgId = c.get('orgId') as string
  const { name, strategy, description, config, priority } = await c.req.json()
  if (!name || !strategy) return c.json({ error: 'name and strategy required' }, 400)
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  const policy = await prisma.routingPolicy.create({
    data: { name, slug, strategy, description, config: config ? JSON.stringify(config) : null, type: 'custom', priority: priority || 50, userId, orgId }
  })
  return c.json({ policy })
})

r.patch('/ai-router/policies/:id', async (c) => {
  const { id } = c.req.param()
  const { name, strategy, description, config, priority, isActive } = await c.req.json()
  const data: any = {}
  if (name !== undefined) data.name = name
  if (strategy !== undefined) data.strategy = strategy
  if (description !== undefined) data.description = description
  if (config !== undefined) data.config = JSON.stringify(config)
  if (priority !== undefined) data.priority = priority
  if (isActive !== undefined) data.isActive = isActive
  const policy = await prisma.routingPolicy.update({ where: { id }, data })
  return c.json({ policy })
})

r.delete('/ai-router/policies/:id', async (c) => {
  const { id } = c.req.param()
  const policy = await prisma.routingPolicy.findUnique({ where: { id } })
  if (policy?.type === 'system') return c.json({ error: 'Cannot delete system policies' }, 400)
  await prisma.routingPolicy.delete({ where: { id } })
  return c.json({ success: true })
})

// ═══════════════════════════════════════════════════════════
// 2. CAPABILITY MATRIX
// ═══════════════════════════════════════════════════════════

const CAPABILITY_REGISTRY: Record<string, { name: string; providers: Record<string, string[]> }> = {
  chat: { name: 'Text Chat', providers: { openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini'], anthropic: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-3-5-haiku-20241022'], google: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'], deepseek: ['deepseek-chat'], xai: ['grok-3', 'grok-3-mini'], mistral: ['mistral-large-latest', 'mistral-small-latest'], pollinations: ['flux'] } },
  vision: { name: 'Vision / Image Understanding', providers: { openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'o4-mini'], anthropic: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'], google: ['gemini-2.5-flash', 'gemini-2.5-pro'] } },
  images: { name: 'Image Generation', providers: { openai: ['dall-e-3', 'dall-e-2'], pollinations: ['flux', 'flux-realism', 'flux-anime'], flux: ['flux-1.1-pro', 'flux-dev'], stability: ['stable-diffusion-xl-1024-v1-0'], google: ['imagen-3.0-generate-001'] } },
  reasoning: { name: 'Reasoning / Chain-of-Thought', providers: { openai: ['o3', 'o3-mini', 'o4-mini'], anthropic: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514'], deepseek: ['deepseek-reasoner'] } },
  embeddings: { name: 'Embeddings', providers: { openai: ['text-embedding-3-small', 'text-embedding-3-large'], google: ['text-embedding-004'], mistral: ['mistral-embed'] } },
  json_mode: { name: 'Structured JSON Output', providers: { openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1'], anthropic: ['claude-sonnet-4-20250514'], google: ['gemini-2.5-flash', 'gemini-2.5-pro'], deepseek: ['deepseek-chat'], mistral: ['mistral-large-latest'] } },
  function_calling: { name: 'Function / Tool Calling', providers: { openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1'], anthropic: ['claude-sonnet-4-20250514'], google: ['gemini-2.5-flash', 'gemini-2.5-pro'], deepseek: ['deepseek-chat'] } },
  streaming: { name: 'Streaming Responses', providers: { openai: ['gpt-4o', 'gpt-4o-mini'], anthropic: ['claude-sonnet-4-20250514'], google: ['gemini-2.5-flash'] } },
  audio_in: { name: 'Audio Transcription', providers: { openai: ['whisper-1', 'gpt-4o-audio-preview'] } },
  audio_out: { name: 'Text-to-Speech', providers: { openai: ['tts-1', 'tts-1-hd'] } },
}

r.get('/ai-router/capabilities', async (c) => {
  const userId = c.get('userId') as string
  const configured = await prisma.apiProviderKey.findMany({ where: { userId, isEnabled: true }, select: { provider: true } })
  const configuredSet = new Set(configured.map(k => k.provider))
  configuredSet.add('pollinations')

  const matrix = Object.entries(CAPABILITY_REGISTRY).map(([cap, info]) => ({
    capability: cap,
    name: info.name,
    providers: Object.entries(info.providers).map(([prov, models]) => ({
      provider: prov,
      models,
      configured: configuredSet.has(prov),
      available: configuredSet.has(prov),
    })),
    totalProviders: Object.keys(info.providers).length,
    configuredProviders: Object.keys(info.providers).filter(p => configuredSet.has(p)).length,
  }))
  return c.json({ capabilities: matrix, totalCapabilities: matrix.length })
})

r.post('/ai-router/capabilities/register', async (c) => {
  const { provider, capability, modelId, region, isAvailable, metadata } = await c.req.json()
  if (!provider || !capability) return c.json({ error: 'provider and capability required' }, 400)
  const cap = await prisma.providerCapability.upsert({
    where: { provider_capability_modelId: { provider, capability, modelId: modelId || null } },
    update: { region, isAvailable: isAvailable !== false, metadata: metadata ? JSON.stringify(metadata) : null },
    create: { provider, capability, modelId, region, isAvailable: isAvailable !== false, metadata: metadata ? JSON.stringify(metadata) : null },
  })
  return c.json({ capability: cap })
})

r.get('/ai-router/capabilities/for-workflow', async (c) => {
  const url = new URL(c.req.url)
  const workflow = url.searchParams.get('workflow') || 'chat'
  const workflowCapMap: Record<string, string[]> = {
    chat: ['chat', 'streaming', 'json_mode', 'function_calling'],
    image: ['images'],
    video: ['images', 'chat'],
    voice: ['audio_in', 'audio_out'],
    embeddings: ['embeddings'],
    reasoning: ['reasoning', 'chat'],
    coding: ['chat', 'json_mode', 'function_calling', 'streaming'],
    vision: ['vision', 'chat'],
  }
  const requiredCaps = workflowCapMap[workflow] || ['chat']
  const userId = c.get('userId') as string
  const configured = await prisma.apiProviderKey.findMany({ where: { userId, isEnabled: true }, select: { provider: true } })
  const configuredSet = new Set(configured.map(k => k.provider))
  configuredSet.add('pollinations')

  const eligible: Record<string, { models: string[]; capabilities: string[] }> = {}
  for (const cap of requiredCaps) {
    const reg = CAPABILITY_REGISTRY[cap]
    if (!reg) continue
    for (const [prov, models] of Object.entries(reg.providers)) {
      if (configuredSet.has(prov)) {
        if (!eligible[prov]) eligible[prov] = { models: [], capabilities: [] }
        eligible[prov].models.push(...models)
        eligible[prov].capabilities.push(cap)
      }
    }
  }
  return c.json({ workflow, requiredCapabilities: requiredCaps, eligibleProviders: eligible })
})

// ═══════════════════════════════════════════════════════════
// 3. CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════

async function getCircuitBreaker(userId: string, provider: string) {
  let cb = await prisma.circuitBreaker.findUnique({ where: { provider_userId: { provider, userId } } })
  if (!cb) {
    cb = await prisma.circuitBreaker.create({ data: { provider, userId, state: 'closed', failureCount: 0, failureThreshold: 5, recoveryTimeoutMs: 300000 } })
  }
  // Auto-recovery: if open and enough time has passed, move to half_open
  if (cb.state === 'open' && cb.lastFailureAt) {
    const elapsed = Date.now() - cb.lastFailureAt.getTime()
    if (elapsed > cb.recoveryTimeoutMs) {
      cb = await prisma.circuitBreaker.update({ where: { id: cb.id }, data: { state: 'half_open', halfOpenAttempts: 0 } })
    }
  }
  return cb
}

r.get('/ai-router/circuit-breakers', async (c) => {
  const userId = c.get('userId') as string
  const breakers = await prisma.circuitBreaker.findMany({ where: { userId }, orderBy: { provider: 'asc' } })
  // Enrich with in-memory state
  const enriched = breakers.map(cb => ({
    ...cb,
    providerHealth: (globalThis as any).__providerHealthStore?.[cb.provider] || null,
  }))
  return c.json({ breakers: enriched })
})

r.post('/ai-router/circuit-breakers/:provider/trip', async (c) => {
  const userId = (c.get('userId') as string) || 'system'
  const { provider } = c.req.param()
  const cb = await getCircuitBreaker(userId, provider)
  const updated = await prisma.circuitBreaker.update({
    where: { id: cb.id },
    data: { state: 'open', failureCount: { increment: 1 }, lastFailureAt: now(), totalTrips: { increment: 1 } }
  })
  return c.json({ breaker: updated })
})

r.post('/ai-router/circuit-breakers/:provider/reset', async (c) => {
  const userId = (c.get('userId') as string) || 'system'
  const { provider } = c.req.param()
  const cb = await getCircuitBreaker(userId, provider)
  const updated = await prisma.circuitBreaker.update({
    where: { id: cb.id },
    data: { state: 'closed', failureCount: 0, successCount: 0, halfOpenAttempts: 0 }
  })
  return c.json({ breaker: updated })
})

r.post('/ai-router/circuit-breakers/:provider/config', async (c) => {
  const userId = (c.get('userId') as string) || 'system'
  const { provider } = c.req.param()
  const { failureThreshold, recoveryTimeoutMs, halfOpenMaxCalls } = await c.req.json()
  const cb = await getCircuitBreaker(userId, provider)
  const data: any = {}
  if (failureThreshold !== undefined) data.failureThreshold = failureThreshold
  if (recoveryTimeoutMs !== undefined) data.recoveryTimeoutMs = recoveryTimeoutMs
  if (halfOpenMaxCalls !== undefined) data.halfOpenMaxCalls = halfOpenMaxCalls
  const updated = await prisma.circuitBreaker.update({ where: { id: cb.id }, data })
  return c.json({ breaker: updated })
})

// ═══════════════════════════════════════════════════════════
// 4. PROVIDER BENCHMARKS
// ═══════════════════════════════════════════════════════════

r.get('/ai-router/benchmarks', async (c) => {
  const userId = c.get('userId') as string
  const url = new URL(c.req.url)
  const provider = url.searchParams.get('provider')
  const limit = parseInt(url.searchParams.get('limit') || '50')
  const where: any = { userId }
  if (provider) where.provider = provider
  const benchmarks = await prisma.providerBenchmark.findMany({ where, orderBy: { recordedAt: 'desc' }, take: limit })
  // Aggregate per provider/model
  const aggregated: Record<string, any> = {}
  for (const b of benchmarks) {
    const key = `${b.provider}/${b.modelId}`
    if (!aggregated[key]) aggregated[key] = { provider: b.provider, modelId: b.modelId, samples: 0, avgLatency: 0, avgCost: 0, avgReliability: 0, avgQuality: 0, avgComposite: 0 }
    const a = aggregated[key]
    a.samples++
    a.avgLatency += b.latencyMs
    a.avgCost += b.costPer1k
    a.avgReliability += b.reliability
    a.avgQuality += b.qualityScore
    a.avgComposite += b.compositeScore
  }
  for (const a of Object.values(aggregated) as any[]) {
    a.avgLatency = Math.round(a.avgLatency / a.samples)
    a.avgCost = Math.round(a.avgCost / a.samples * 10000) / 10000
    a.avgReliability = Math.round(a.avgReliability / a.samples * 10) / 10
    a.avgQuality = Math.round(a.avgQuality / a.samples * 10) / 10
    a.avgComposite = Math.round(a.avgComposite / a.samples * 10) / 10
  }
  return c.json({ benchmarks, aggregated: Object.values(aggregated), total: benchmarks.length })
})

r.post('/ai-router/benchmarks/record', async (c) => {
  const userId = c.get('userId') as string
  const { provider, modelId, qualityScore, latencyMs, costPer1k, reliability, availability, successRate, sampleSize, benchmarkType, metadata } = await c.req.json()
  if (!provider || !modelId) return c.json({ error: 'provider and modelId required' }, 400)
  // Compute composite score: quality(30%) + reliability(25%) + latency inverse(25%) + cost inverse(20%)
  const costScore = costPer1k ? Math.max(0, 100 - costPer1k * 1000) : 50
  const latencyScore = latencyMs ? Math.max(0, 100 - latencyMs / 50) : 50
  const composite = Math.round(((qualityScore || 50) * 0.3 + (reliability || 100) * 0.25 + latencyScore * 0.25 + costScore * 0.2) * 10) / 10
  const bench = await prisma.providerBenchmark.create({
    data: {
      provider, modelId, userId, qualityScore: qualityScore || 50, latencyMs: latencyMs || 0, costPer1k: costPer1k || 0,
      reliability: reliability || 100, availability: availability || 100, successRate: successRate || 100,
      sampleSize: sampleSize || 1, compositeScore: composite, benchmarkType: benchmarkType || 'live',
      metadata: metadata ? JSON.stringify(metadata) : null,
    }
  })
  return c.json({ benchmark: bench })
})

r.get('/ai-router/benchmarks/rankings', async (c) => {
  const url = new URL(c.req.url)
  const capability = url.searchParams.get('capability') || 'chat'
  const userId = c.get('userId') as string

  // Get latest benchmark per provider/model
  const latest = await prisma.providerBenchmark.findMany({
    where: { userId },
    orderBy: { recordedAt: 'desc' },
    take: 200,
  })

  const best: Record<string, any> = {}
  for (const b of latest) {
    const key = `${b.provider}/${b.modelId}`
    if (!best[key] || b.recordedAt > best[key].recordedAt) best[key] = b
  }

  const rankings = Object.values(best)
    .sort((a: any, b: any) => b.compositeScore - a.compositeScore)
    .map((b: any, i: number) => ({
      rank: i + 1, provider: b.provider, modelId: b.modelId,
      compositeScore: b.compositeScore, qualityScore: b.qualityScore,
      latencyMs: b.latencyMs, costPer1k: b.costPer1k, reliability: b.reliability,
    }))

  return c.json({ rankings, capability, total: rankings.length })
})

// ═══════════════════════════════════════════════════════════
// 5. ROUTER TELEMETRY (Observability)
// ═══════════════════════════════════════════════════════════

r.post('/ai-router/telemetry', async (c) => {
  const userId = c.get('userId') as string
  const orgId = c.get('orgId') as string
  const body = await c.req.json()
  const requestId = body.requestId || genId()
  const correlationId = body.correlationId || null
  const telemetry = await prisma.routerTelemetry.create({
    data: {
      requestId, correlationId, userId, orgId, policyId: body.policyId || null,
      workflowType: body.workflowType || 'chat', requestedProvider: body.requestedProvider,
      actualProvider: body.actualProvider, model: body.model, status: body.status || 'success',
      latencyMs: body.latencyMs || 0, queueTimeMs: body.queueTimeMs || 0,
      inputTokens: body.inputTokens || 0, outputTokens: body.outputTokens || 0,
      costUsd: body.costUsd || 0, errorMsg: body.errorMsg || null,
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
    }
  })
  return c.json({ telemetry, requestId })
})

r.get('/ai-router/telemetry', async (c) => {
  const userId = c.get('userId') as string
  const url = new URL(c.req.url)
  const workflow = url.searchParams.get('workflow')
  const provider = url.searchParams.get('provider')
  const status = url.searchParams.get('status')
  const correlationId = url.searchParams.get('correlationId')
  const limit = parseInt(url.searchParams.get('limit') || '100')
  const page = parseInt(url.searchParams.get('page') || '1')
  const since = url.searchParams.get('since')
  const where: any = { userId }
  if (workflow) where.workflowType = workflow
  if (provider) where.actualProvider = provider
  if (status) where.status = status
  if (correlationId) where.correlationId = correlationId
  if (since) where.createdAt = { gte: new Date(since) }

  const [telemetry, total] = await Promise.all([
    prisma.routerTelemetry.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: (page - 1) * limit }),
    prisma.routerTelemetry.count({ where }),
  ])
  return c.json({ telemetry, total, page, limit, totalPages: Math.ceil(total / limit) })
})

r.get('/ai-router/telemetry/summary', async (c) => {
  const userId = c.get('userId') as string
  const url = new URL(c.req.url)
  const period = url.searchParams.get('period') || '24h'
  let since = new Date()
  if (period === '1h') since.setHours(since.getHours() - 1)
  else if (period === '24h') since.setDate(since.getDate() - 1)
  else if (period === '7d') since.setDate(since.getDate() - 7)
  else if (period === '30d') since.setDate(since.getDate() - 30)

  const where = { userId, createdAt: { gte: since } }
  const [total, byStatus, byProvider, byWorkflow, byDay] = await Promise.all([
    prisma.routerTelemetry.aggregate({ where, _sum: { latencyMs: true, costUsd: true, inputTokens: true, outputTokens: true }, _count: { id: true } }),
    prisma.routerTelemetry.groupBy({ by: ['status'], where, _count: { id: true }, _sum: { costUsd: true } }),
    prisma.routerTelemetry.groupBy({ by: ['actualProvider'], where, _count: { id: true }, _sum: { costUsd: true, latencyMs: true } }),
    prisma.routerTelemetry.groupBy({ by: ['workflowType'], where, _count: { id: true }, _sum: { costUsd: true } }),
    prisma.routerTelemetry.findMany({ where, select: { createdAt: true, costUsd: true }, orderBy: { createdAt: 'asc' } }),
  ])

  const byDayAgg = byDay.reduce((acc: any[], row: any) => {
    const day = new Date(row.createdAt).toISOString().split('T')[0]
    const existing = acc.find(a => a.day === day)
    if (existing) { existing.cost += row.costUsd; existing.count++ } else acc.push({ day, cost: row.costUsd, count: 1 })
    return acc
  }, [])

  const count = total._count.id || 1
  return c.json({
    summary: {
      totalRequests: total._count.id, avgLatency: Math.round((total._sum.latencyMs || 0) / count),
      totalCost: total._sum.costUsd || 0, totalTokens: (total._sum.inputTokens || 0) + (total._sum.outputTokens || 0),
      successRate: Math.round(((byStatus.find(s => s.status === 'success')?._count.id || 0) / count) * 100),
    },
    byStatus: byStatus.map(s => ({ status: s.status, count: s._count.id, cost: s._sum.costUsd || 0 })),
    byProvider: byProvider.map(p => ({ provider: p.actualProvider, count: p._count.id, cost: p._sum.costUsd || 0, avgLatency: Math.round((p._sum.latencyMs || 0) / p._count.id) })),
    byWorkflow: byWorkflow.map(w => ({ workflow: w.workflowType, count: w._count.id, cost: w._sum.costUsd || 0 })),
    byDay: byDayAgg,
  })
})

// ═══════════════════════════════════════════════════════════
// 6. ENTERPRISE BUDGETS
// ═══════════════════════════════════════════════════════════

r.get('/ai-router/budgets', async (c) => {
  const userId = c.get('userId') as string
  const orgId = c.get('orgId') as string
  const budgets = await prisma.aIBudget.findMany({
    where: { OR: [{ userId }, { orgId }, { userId_owner: userId }] },
    orderBy: { createdAt: 'desc' }
  })
  return c.json({ budgets })
})

r.post('/ai-router/budgets', async (c) => {
  const userId = c.get('userId') as string
  const orgId = c.get('orgId') as string
  const { name, description, departmentId, projectId, campaignId, amount, period, provider, workflowType, alertThreshold, hardLimit } = await c.req.json()
  if (!name || !amount) return c.json({ error: 'name and amount required' }, 400)
  const budget = await prisma.aIBudget.create({
    data: {
      name, description, orgId, departmentId, projectId, campaignId, userId, userId_owner: userId,
      amount, period: period || 'monthly', provider, workflowType,
      alertThreshold: alertThreshold || 0.8, hardLimit: hardLimit || false,
    }
  })
  return c.json({ budget })
})

r.patch('/ai-router/budgets/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const data: any = {}
  for (const k of ['name', 'description', 'amount', 'period', 'provider', 'workflowType', 'alertThreshold', 'hardLimit', 'isActive']) {
    if (body[k] !== undefined) data[k] = body[k]
  }
  const budget = await prisma.aIBudget.update({ where: { id }, data })
  return c.json({ budget })
})

r.delete('/ai-router/budgets/:id', async (c) => {
  const { id } = c.req.param()
  await prisma.aIBudget.delete({ where: { id } })
  return c.json({ success: true })
})

r.get('/ai-router/budgets/:id/spending', async (c) => {
  const userId = c.get('userId') as string
  const { id } = c.req.param()
  const budget = await prisma.aIBudget.findUnique({ where: { id } })
  if (!budget) return c.json({ error: 'Budget not found' }, 404)

  let since = new Date()
  if (budget.period === 'daily') since.setDate(since.getDate() - 1)
  else if (budget.period === 'weekly') since.setDate(since.getDate() - 7)
  else if (budget.period === 'monthly') since.setMonth(since.getMonth() - 1)
  else if (budget.period === 'quarterly') since.setMonth(since.getMonth() - 3)
  else if (budget.period === 'yearly') since.setFullYear(since.getFullYear() - 1)

  const where: any = { userId, createdAt: { gte: since } }
  if (budget.provider) where.provider = budget.provider
  if (budget.workflowType) where.workflowType = budget.workflowType

  const [telemetrySum, executions] = await Promise.all([
    prisma.routerTelemetry.aggregate({ where, _sum: { costUsd: true }, _count: { id: true } }).catch(() => ({ _sum: { costUsd: 0 }, _count: { id: 0 } })),
    prisma.promptExecution.aggregate({ where, _sum: { costUsd: true }, _count: { id: true } }),
  ])

  const spent = (telemetrySum._sum.costUsd || 0) + (executions._sum.costUsd || 0)
  const percentUsed = budget.amount > 0 ? spent / budget.amount : 0

  return c.json({
    budget,
    spending: {
      spent: Math.round(spent * 10000) / 10000,
      budget: budget.amount,
      remaining: Math.round((budget.amount - spent) * 10000) / 10000,
      percentUsed: Math.round(percentUsed * 1000) / 1000,
      alertTriggered: percentUsed >= budget.alertThreshold,
      blocked: budget.hardLimit && percentUsed >= 1.0,
      totalRequests: (telemetrySum._count.id || 0) + (executions._count.id || 0),
    },
  })
})

// ═══════════════════════════════════════════════════════════
// 7. PROVIDER ADAPTERS
// ═══════════════════════════════════════════════════════════

const SYSTEM_ADAPTERS = [
  { name: 'OpenAI Adapter', slug: 'openai', baseUrl: 'https://api.openai.com/v1', authType: 'api_key', adapterType: 'rest', capabilities: '["chat","vision","images","reasoning","embeddings","function_calling","streaming","json_mode","audio_in","audio_out"]', isSystem: true, version: '2024.1' },
  { name: 'Anthropic Adapter', slug: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', authType: 'api_key', adapterType: 'rest', capabilities: '["chat","vision","reasoning","function_calling","streaming"]', isSystem: true, version: '2024.1' },
  { name: 'Google AI Adapter', slug: 'google', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', authType: 'api_key', adapterType: 'rest', capabilities: '["chat","vision","images","reasoning","embeddings","function_calling","json_mode"]', isSystem: true, version: '2024.1' },
  { name: 'DeepSeek Adapter', slug: 'deepseek', baseUrl: 'https://api.deepseek.com', authType: 'api_key', adapterType: 'rest', capabilities: '["chat","reasoning","function_calling","json_mode"]', isSystem: true, version: '2024.1' },
  { name: 'Pollinations Adapter', slug: 'pollinations', baseUrl: 'https://image.pollinations.ai', authType: 'none', adapterType: 'rest', capabilities: '["images","chat"]', isSystem: true, version: '2024.1' },
  { name: 'FLUX Adapter', slug: 'flux', baseUrl: 'https://api.bfl.ml', authType: 'api_key', adapterType: 'rest', capabilities: '["images"]', isSystem: true, version: '2024.1' },
  { name: 'Stability AI Adapter', slug: 'stability', baseUrl: 'https://api.stability.ai/v2beta', authType: 'api_key', adapterType: 'rest', capabilities: '["images"]', isSystem: true, version: '2024.1' },
  { name: 'Mistral Adapter', slug: 'mistral', baseUrl: 'https://api.mistral.ai/v1', authType: 'api_key', adapterType: 'rest', capabilities: '["chat","function_calling","json_mode","embeddings"]', isSystem: true, version: '2024.1' },
]

r.get('/ai-router/adapters', async (c) => {
  let adapters = await prisma.providerAdapter.findMany({ orderBy: { name: 'asc' } })
  if (adapters.length === 0) {
    for (const a of SYSTEM_ADAPTERS) {
      await prisma.providerAdapter.create({ data: a as any })
    }
    adapters = await prisma.providerAdapter.findMany({ orderBy: { name: 'asc' } })
  }
  return c.json({ adapters })
})

r.post('/ai-router/adapters', async (c) => {
  const { name, baseUrl, authType, adapterType, capabilities, config, healthUrl, version } = await c.req.json()
  if (!name) return c.json({ error: 'name required' }, 400)
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  const adapter = await prisma.providerAdapter.create({
    data: { name, slug, baseUrl, authType: authType || 'api_key', adapterType: adapterType || 'rest',
      capabilities: capabilities ? JSON.stringify(capabilities) : null,
      config: config ? JSON.stringify(config) : null, healthUrl, version, isSystem: false }
  })
  return c.json({ adapter })
})

r.post('/ai-router/adapters/:slug/discover', async (c) => {
  const { slug } = c.req.param()
  const adapter = await prisma.providerAdapter.findUnique({ where: { slug } })
  if (!adapter) return c.json({ error: 'Adapter not found' }, 404)
  // Simulate discovery: ping health endpoint and gather metadata
  const start = Date.now()
  let healthy = true
  let latency = 0
  if (adapter.healthUrl) {
    try {
      const r = await fetch(adapter.healthUrl, { signal: AbortSignal.timeout(5000) })
      healthy = r.ok
      latency = Date.now() - start
    } catch { healthy = false; latency = Date.now() - start }
  }
  return c.json({ adapter: adapter.slug, discovered: true, healthy, latencyMs: latency, capabilities: adapter.capabilities, timestamp: now() })
})

// ═══════════════════════════════════════════════════════════
// 8. WORKFLOW-AWARE ROUTING
// ═══════════════════════════════════════════════════════════

const WORKFLOW_ROUTING: Record<string, { requiredCapabilities: string[]; preferredProviders: string[]; fallbacks: string[] }> = {
  chat: { requiredCapabilities: ['chat'], preferredProviders: ['openai', 'anthropic', 'google'], fallbacks: ['deepseek', 'mistral', 'pollinations'] },
  image: { requiredCapabilities: ['images'], preferredProviders: ['openai', 'pollinations', 'flux'], fallbacks: ['stability', 'google'] },
  video: { requiredCapabilities: ['images', 'chat'], preferredProviders: ['openai', 'google'], fallbacks: ['anthropic'] },
  voice: { requiredCapabilities: ['audio_in', 'audio_out'], preferredProviders: ['openai'], fallbacks: ['google'] },
  embeddings: { requiredCapabilities: ['embeddings'], preferredProviders: ['openai', 'google'], fallbacks: ['mistral'] },
  reasoning: { requiredCapabilities: ['reasoning'], preferredProviders: ['openai', 'anthropic'], fallbacks: ['deepseek'] },
  coding: { requiredCapabilities: ['chat', 'function_calling', 'json_mode'], preferredProviders: ['openai', 'anthropic'], fallbacks: ['deepseek', 'google'] },
  vision: { requiredCapabilities: ['vision'], preferredProviders: ['openai', 'anthropic', 'google'], fallbacks: ['openai'] },
}

r.get('/ai-router/workflows', async (c) => {
  const workflows = Object.entries(WORKFLOW_ROUTING).map(([name, config]) => ({
    name, ...config,
    description: `${name.charAt(0).toUpperCase() + name.slice(1)} workflow — requires [${config.requiredCapabilities.join(', ')}]`,
  }))
  return c.json({ workflows })
})

r.get('/ai-router/workflows/:workflow/recommend', async (c) => {
  const userId = c.get('userId') as string
  const { workflow } = c.req.param()
  const config = WORKFLOW_ROUTING[workflow]
  if (!config) return c.json({ error: 'Unknown workflow' }, 404)

  const configured = await prisma.apiProviderKey.findMany({ where: { userId, isEnabled: true }, select: { provider: true, model: true } })
  const configuredSet = new Set(configured.map(k => k.provider))
  configuredSet.add('pollinations')

  // Filter providers that support required capabilities
  const eligible = config.preferredProviders.filter(p => configuredSet.has(p))
  const fallbackEligible = config.fallbacks.filter(p => configuredSet.has(p))
  const allEligible = [...eligible, ...fallbackEligible]

  // Get latest benchmarks
  const rankings = await prisma.providerBenchmark.findMany({
    where: { userId, provider: { in: allEligible } },
    orderBy: { recordedAt: 'desc' },
    take: 100,
  })

  const scored: Record<string, any> = {}
  for (const b of rankings) {
    if (!scored[b.provider] || b.compositeScore > scored[b.provider].compositeScore) {
      scored[b.provider] = b
    }
  }

  const recommended = allEligible
    .map(p => ({ provider: p, compositeScore: scored[p]?.compositeScore || 50, preferred: config.preferredProviders.includes(p) }))
    .sort((a, b) => b.preferred - a.preferred || b.compositeScore - a.compositeScore)

  return c.json({ workflow, config, recommended })
})

// ═══════════════════════════════════════════════════════════
// 9. POLICY-BASED ROUTING ENGINE
// ═══════════════════════════════════════════════════════════

r.post('/ai-router/route', async (c) => {
  const userId = c.get('userId') as string
  const orgId = c.get('orgId') as string
  const body = await c.req.json()
  const { policy: policySlug, workflowType, requiredCapabilities, maxCost, region } = body
  const requestId = genId()

  // 1. Get policy
  const policy = policySlug
    ? await prisma.routingPolicy.findFirst({ where: { slug: policySlug } })
    : await prisma.routingPolicy.findFirst({ where: { slug: 'balanced', type: 'system' } })

  if (!policy) return c.json({ error: 'Policy not found' }, 404)

  // 2. Get circuit breaker states
  const breakers = await prisma.circuitBreaker.findMany({ where: { userId } })
  const breakerMap: Record<string, string> = {}
  for (const cb of breakers) breakerMap[cb.provider] = cb.state

  // 3. Get configured providers
  const configured = await prisma.apiProviderKey.findMany({ where: { userId, isEnabled: true }, orderBy: { priority: 'asc' } })
  const configuredSet = new Set(configured.map(k => k.provider))
  configuredSet.add('pollinations')

  // 4. Filter by capabilities if required
  let candidates = [...configuredSet]
  if (requiredCapabilities?.length) {
    for (const cap of requiredCapabilities) {
      const reg = CAPABILITY_REGISTRY[cap]
      if (reg) {
        const capProviders = new Set(Object.keys(reg.providers))
        candidates = candidates.filter(p => capProviders.has(p))
      }
    }
  }

  // 5. Filter out circuit-broken providers
  candidates = candidates.filter(p => breakerMap[p] !== 'open')

  // 6. Apply policy strategy
  let selected = candidates[0] || 'pollinations'
  const config = policy.config ? JSON.parse(policy.config) : {}
  const strategy = policy.strategy

  if (strategy === 'cheapest') {
    let minCost = Infinity
    for (const p of candidates) {
      const avgCost = await prisma.promptExecution.aggregate({ where: { userId, provider: p }, _avg: { costUsd: true } }).then(a => a._avg.costUsd || 0).catch(() => 0)
      if (avgCost < minCost || (avgCost === 0 && p === 'pollinations')) { minCost = avgCost; selected = p }
    }
  } else if (strategy === 'fastest') {
    let minLatency = Infinity
    for (const p of candidates) {
      const avgLat = await prisma.promptExecution.aggregate({ where: { userId, provider: p }, _avg: { latencyMs: true } }).then(a => a._avg.latencyMs || 99999).catch(() => 99999)
      if (avgLat < minLatency) { minLatency = avgLat; selected = p }
    }
  } else if (strategy === 'highest_quality') {
    let maxScore = -1
    for (const p of candidates) {
      const bench = await prisma.providerBenchmark.findFirst({ where: { userId, provider: p }, orderBy: { recordedAt: 'desc' } })
      const score = bench?.compositeScore || 50
      if (score > maxScore) { maxScore = score; selected = p }
    }
  } else if (strategy === 'cost_capped') {
    const maxCostPerToken = config.maxCostPerToken || 0.01
    for (const p of candidates) {
      const avgCost = await prisma.promptExecution.aggregate({ where: { userId, provider: p }, _avg: { costUsd: true } }).then(a => a._avg.costUsd || 0).catch(() => 0)
      if (avgCost <= maxCostPerToken) { selected = p; break }
    }
  } else if (strategy === 'region_restricted') {
    const allowedRegions = config.allowedRegions || ['global']
    const regionCap = await prisma.providerCapability.findFirst({ where: { provider: { in: candidates }, region: { in: allowedRegions } } })
    if (regionCap) selected = regionCap.provider
  } else {
    // balanced — pick first available
    selected = candidates[0] || 'pollinations'
  }

  // 7. Fallback chain
  const fallbackChain = candidates.filter(p => p !== selected)

  // 8. Check budget
  const budgets = await prisma.aIBudget.findMany({ where: { userId, isActive: true, OR: [{ provider: null }, { provider: selected }] } })
  let budgetBlocked = false
  for (const budget of budgets) {
    if (budget.hardLimit && budget.spent >= budget.amount) {
      budgetBlocked = true
      break
    }
  }
  if (budgetBlocked) {
    // Try cheapest alternative
    selected = candidates.find(p => p === 'pollinations') || candidates[0] || selected
  }

  // 9. Log telemetry
  const selectedKey = configured.find(k => k.provider === selected)
  await prisma.routerTelemetry.create({
    data: {
      requestId, correlationId: body.correlationId || null, userId, orgId, policyId: policy.id,
      workflowType: workflowType || 'chat', requestedProvider: body.preferredProvider, actualProvider: selected,
      model: body.model || selectedKey?.model || 'default', status: 'routed',
      metadata: JSON.stringify({ strategy, fallbackChain, breakerState: breakerMap[selected], budgetBlocked }),
    }
  })

  return c.json({
    requestId, selectedProvider: selected, policy: policy.name, strategy,
    model: selectedKey?.model || body.model || 'default',
    hasApiKey: !!selectedKey, isFree: selected === 'pollinations',
    fallbackChain, circuitBreakerState: breakerMap[selected] || 'unknown',
    budgetBlocked,
  })
})

// ═══════════════════════════════════════════════════════════
// 10. AGGREGATE DASHBOARD
// ═══════════════════════════════════════════════════════════

r.get('/ai-router/dashboard', async (c) => {
  const userId = c.get('userId') as string
  const orgId = c.get('orgId') as string
  const since24h = new Date(Date.now() - 86400000)
  const since7d = new Date(Date.now() - 604800000)

  const [policies, breakers, recentTelemetry, budgetCount, adapterCount, benchmarkCount, telemetry24h] = await Promise.all([
    prisma.routingPolicy.count(),
    prisma.circuitBreaker.findMany({ where: { userId } }),
    prisma.routerTelemetry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.aIBudget.count({ where: { userId } }),
    prisma.providerAdapter.count(),
    prisma.providerBenchmark.count({ where: { userId } }),
    prisma.routerTelemetry.findMany({ where: { userId, createdAt: { gte: since24h } } }),
  ])

  const openBreakers = breakers.filter(b => b.state === 'open').length
  const halfOpenBreakers = breakers.filter(b => b.state === 'half_open').length
  const success24h = telemetry24h.filter(t => t.status === 'success').length
  const total24h = telemetry24h.length || 1
  const cost24h = telemetry24h.reduce((s, t) => s + t.costUsd, 0)

  return c.json({
    dashboard: {
      routingPolicies: policies,
      circuitBreakers: { total: breakers.length, open: openBreakers, halfOpen: halfOpenBreakers, closed: breakers.length - openBreakers - halfOpenBreakers },
      telemetry24h: { requests: total24h, successRate: Math.round((success24h / total24h) * 100), cost: Math.round(cost24h * 10000) / 10000 },
      budgets: budgetCount,
      adapters: adapterCount,
      benchmarks: benchmarkCount,
      recentActivity: recentTelemetry,
    }
  })
})

export default r
