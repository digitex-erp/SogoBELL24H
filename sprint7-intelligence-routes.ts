// SPDX-License-Identifier: Apache-2.0
// Sprint 7 — Industry Intelligence + Audit Center + Explainability (SHAP/LIME)
//
// Three surfaces:
//   /industry/*        the shared knowledge base: profiles, KPIs, signals
//   /audit/*           the audit trail and the compliance contract matrix
//   /explainability/*  the SHAP/LIME ledger — produce, persist and defend decisions
//
// Auth middleware is injected by custom-routes.ts so there is exactly one
// implementation of token verification in the codebase.

import { Hono } from 'hono'
import { prisma } from './src/lib/db'
import {
  EXPLAINABILITY_CONTRACTS,
  EXPLAINER_VERSION,
  buildShapExplanation,
  buildLimeExplanation,
  describeExplanation,
  getContract,
  validateAgainstContract,
  type ExplanationMethod,
  type ExplanationSubjectType,
  type FeatureRef,
  type LimeSample,
  type ShapExplanation,
  type LimeExplanation,
  type ContractViolation,
} from './src/lib/explainability'

type AuthMiddleware = () => (c: any, next: any) => Promise<any>

// ─────────────────────────────────────────────────────────────
// DETERMINISTIC SUBJECT MODEL
//
// The same subjectId always yields the same features. An audit that cannot be
// reproduced is not an audit, so reproducibility is a hard requirement here —
// no Math.random() anywhere in the subject derivation path.
// ─────────────────────────────────────────────────────────────

interface FeatureSpec {
  key: string
  label: string
  unit?: string
  kind: 'numeric' | 'boolean'
  baseline: number
  weight: number
  spread: number
}

interface SubjectModel {
  modelId: string
  decisionTemplate: (provider: string) => string
  candidates: string[]
  features: FeatureSpec[]
}

const SUBJECT_MODELS: Record<ExplanationSubjectType, SubjectModel> = {
  routing_decision: {
    modelId: 'bell24h-router-v2',
    decisionTemplate: (p) => `Route generation task to ${p}`,
    candidates: ['gpt-4o', 'claude-sonnet-4-5', 'gemini-2.5-pro', 'llama-3.3-70b-local', 'deepseek-v3'],
    features: [
      { key: 'provider.latency_p95_ms', label: 'Provider p95 latency', unit: 'ms', kind: 'numeric', baseline: 640, weight: -0.00042, spread: 240 },
      { key: 'provider.cost_per_1k_usd', label: 'Cost per 1k tokens', unit: 'usd', kind: 'numeric', baseline: 4.1, weight: -0.052, spread: 3.2 },
      { key: 'provider.quality_score', label: 'Benchmark quality', unit: '0..1', kind: 'numeric', baseline: 0.81, weight: 1.95, spread: 0.09 },
      { key: 'provider.availability', label: 'Rolling availability', unit: '0..1', kind: 'numeric', baseline: 0.995, weight: 1.6, spread: 0.012 },
      { key: 'task.complexity', label: 'Task complexity', unit: '0..1', kind: 'numeric', baseline: 0.45, weight: 0.72, spread: 0.21 },
      { key: 'budget.remaining_usd', label: 'Budget remaining', unit: 'usd', kind: 'numeric', baseline: 1200, weight: 0.00011, spread: 640 },
      { key: 'policy.prefer_self_hosted', label: 'Self-hosted preference', kind: 'boolean', baseline: 0, weight: -0.34, spread: 1 },
    ],
  },
  budget_allocation: {
    modelId: 'bell24h-finops-allocator-v3',
    decisionTemplate: (c) => `Allocate +18% budget to ${c}`,
    candidates: ['Search', 'Social', 'Marketplace', 'Retargeting'],
    features: [
      { key: 'channel.roas_30d', label: '30-day ROAS', unit: '0..1', kind: 'numeric', baseline: 2.4, weight: 0.38, spread: 1.1 },
      { key: 'channel.cac_delta_pct', label: 'CAC change', unit: '%', kind: 'numeric', baseline: 0, weight: -0.011, spread: 14 },
      { key: 'channel.pacing_variance', label: 'Pacing variance', unit: '0..1', kind: 'numeric', baseline: 0.06, weight: -1.4, spread: 0.05 },
      { key: 'channel.saturation_index', label: 'Saturation index', unit: '0..1', kind: 'numeric', baseline: 0.52, weight: -1.1, spread: 0.2 },
      { key: 'org.margin_floor_pct', label: 'Margin floor', unit: '%', kind: 'numeric', baseline: 22, weight: 0.028, spread: 5 },
      { key: 'channel.attribution_confidence', label: 'Attribution confidence', unit: '0..1', kind: 'numeric', baseline: 0.71, weight: 0.9, spread: 0.12 },
      { key: 'policy.requires_human_signoff', label: 'Human sign-off required', kind: 'boolean', baseline: 0, weight: -0.22, spread: 1 },
    ],
  },
  campaign_scoring: {
    modelId: 'bell24h-campaign-scorer-v4',
    decisionTemplate: (c) => `Score campaign "${c}" as high-priority`,
    candidates: ['Monsoon Fabric Push', 'Export Lead Gen', 'Diwali Retail', 'B2B Re-engage'],
    features: [
      { key: 'campaign.audience_match', label: 'Audience match', unit: '0..1', kind: 'numeric', baseline: 0.58, weight: 2.1, spread: 0.16 },
      { key: 'campaign.creative_freshness', label: 'Creative freshness', unit: '0..1', kind: 'numeric', baseline: 0.62, weight: 0.85, spread: 0.2 },
      { key: 'campaign.historical_ctr', label: 'Historical CTR', unit: '0..1', kind: 'numeric', baseline: 0.019, weight: 14, spread: 0.009 },
      { key: 'industry.seasonality_fit', label: 'Seasonality fit', unit: '0..1', kind: 'numeric', baseline: 0.5, weight: 1.25, spread: 0.22 },
      { key: 'budget.utilisation_pct', label: 'Budget utilisation', unit: '%', kind: 'numeric', baseline: 74, weight: -0.006, spread: 18 },
      { key: 'campaign.brand_safety_flags', label: 'Brand-safety flags', unit: 'count', kind: 'numeric', baseline: 0, weight: -0.48, spread: 1.2 },
    ],
  },
  lead_scoring: {
    modelId: 'bell24h-lead-scorer-v2',
    decisionTemplate: (l) => `Classify lead ${l} as sales-qualified`,
    candidates: ['TextileExpo India', 'FabricHub', 'Silk Story', 'Craft Looms'],
    features: [
      { key: 'lead.firmographic_fit', label: 'Firmographic fit', unit: '0..1', kind: 'numeric', baseline: 0.54, weight: 1.9, spread: 0.18 },
      { key: 'lead.engagement_score', label: 'Engagement score', unit: '0..1', kind: 'numeric', baseline: 0.41, weight: 1.7, spread: 0.22 },
      { key: 'lead.rfq_value_usd', label: 'RFQ value', unit: 'usd', kind: 'numeric', baseline: 180000, weight: 0.0000042, spread: 140000 },
      { key: 'lead.recency_days', label: 'Days since contact', unit: 'days', kind: 'numeric', baseline: 14, weight: -0.021, spread: 11 },
      { key: 'lead.channel_quality', label: 'Channel quality', unit: '0..1', kind: 'numeric', baseline: 0.6, weight: 0.75, spread: 0.2 },
    ],
  },
  content_approval: {
    modelId: 'bell24h-content-guard-v3',
    decisionTemplate: (a) => `Approve asset ${a} for publishing`,
    candidates: ['IMG-4471', 'VID-2210', 'CPY-0918', 'IMG-5529'],
    features: [
      { key: 'content.brand_alignment', label: 'Brand alignment', unit: '0..1', kind: 'numeric', baseline: 0.72, weight: 2.4, spread: 0.14 },
      { key: 'content.claim_risk', label: 'Unsubstantiated-claim risk', unit: '0..1', kind: 'numeric', baseline: 0.18, weight: -3.1, spread: 0.16 },
      { key: 'content.readability', label: 'Readability index', unit: '0..1', kind: 'numeric', baseline: 0.64, weight: 0.9, spread: 0.17 },
      { key: 'content.asset_rights_cleared', label: 'Asset rights cleared', kind: 'boolean', baseline: 1, weight: 0.65, spread: 1 },
      { key: 'content.accessibility_score', label: 'Accessibility score', unit: '0..1', kind: 'numeric', baseline: 0.7, weight: 1.1, spread: 0.15 },
      { key: 'policy.regulated_category', label: 'Regulated category', kind: 'boolean', baseline: 0, weight: -0.55, spread: 1 },
    ],
  },
}

// xmur3 string hash → seed
function seedFromString(str: string): number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  return (h ^= h >>> 16) >>> 0
}

// mulberry32
function rngFromSeed(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function encode(raw: number | string | boolean | null | undefined, fallback: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'boolean') return raw ? 1 : 0
  if (typeof raw === 'string') {
    const n = Number(raw)
    if (Number.isFinite(n)) return n
  }
  return fallback
}

interface DerivedSubject {
  model: SubjectModel
  features: FeatureRef[]
  point: Record<string, number>
  decision: string
  intercept: number
}

function deriveSubject(subjectType: ExplanationSubjectType, subjectId: string): DerivedSubject {
  const model = SUBJECT_MODELS[subjectType]
  const rng = rngFromSeed(seedFromString(`${subjectType}:${subjectId}`))

  const features: FeatureRef[] = []
  const point: Record<string, number> = {}

  for (const spec of model.features) {
    if (spec.kind === 'boolean') {
      const on = rng() > 0.55
      features.push({ key: spec.key, label: spec.label, value: on, baseline: spec.baseline })
      point[spec.key] = on ? 1 : 0
    } else {
      const jitter = (rng() - 0.5) * 2 * spec.spread
      const raw = Math.max(0, spec.baseline + jitter)
      const rounded = spec.unit === '0..1' ? Number(raw.toFixed(3)) : Number(raw.toFixed(2))
      features.push({ key: spec.key, label: spec.label, value: rounded, unit: spec.unit, baseline: spec.baseline })
      point[spec.key] = rounded
    }
  }

  // Neutral drift keeps intercepts small while still producing varied outcomes.
  const drift = (rng() - 0.5) * 0.35
  const candidate = model.candidates[Math.floor(rng() * model.candidates.length) % model.candidates.length]

  return { model, features, point, decision: model.decisionTemplate(candidate), intercept: drift }
}

function predict(model: SubjectModel, point: Record<string, number>, intercept: number): number {
  let acc = intercept
  for (const spec of model.features) {
    const x = encode(point[spec.key], spec.baseline)
    acc += spec.weight * (x - spec.baseline)
  }
  return acc
}

function logistic(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

function gaussian(rng: () => number): number {
  let u = 0
  let v = 0
  while (u === 0) u = rng()
  while (v === 0) v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/**
 * Produce a full SHAP + LIME explanation for a subject. `weights` is the
 * additive model the explainer is attributing over; SHAP is exact (coalition
 * enumeration) and LIME fits an exponential-kernel ridge surrogate on a
 * sampled neighbourhood of the same model.
 */
function explainSubject(
  subjectType: ExplanationSubjectType,
  subjectId: string,
  overrides: { decision?: string; method?: ExplanationMethod } = {}
): Record<string, unknown> {
  const started = Date.now()
  const derived = deriveSubject(subjectType, subjectId)
  const { model, features, point, intercept } = derived
  const decision = overrides.decision?.trim() || derived.decision

  const weights: Record<string, number> = {}
  for (const spec of model.features) weights[spec.key] = spec.weight

  const outcome = predict(model, point, intercept)
  const confidence = Math.max(0.01, Math.min(0.99, logistic(Math.abs(outcome) * 1.6)))
  const method: ExplanationMethod = overrides.method ?? getContract(subjectType).requiredMethod

  const shap: ShapExplanation | null =
    method === 'lime'
      ? null
      : buildShapExplanation({
          features,
          weights,
          outputValue: Number(outcome.toFixed(6)),
          baseValue: intercept,
          featureKeys: model.features.map((f) => f.key),
        })

  let lime: LimeExplanation | null = null
  if (method !== 'shap') {
    const rng = rngFromSeed(seedFromString(`lime:${subjectType}:${subjectId}`))
    const samples: LimeSample[] = []
    for (let i = 0; i < 600; i++) {
      const samplePoint: Record<string, number> = {}
      for (const spec of model.features) {
        const base = encode(point[spec.key], spec.baseline)
        samplePoint[spec.key] = Math.max(0, base + gaussian(rng) * spec.spread * 0.85)
      }
      samples.push({ point: samplePoint, prediction: predict(model, samplePoint, intercept) })
    }
    lime = buildLimeExplanation({ features, samples, subjectPoint: point, intercept, kernelWidth: 0.8 })
  }

  const auditRecord = {
    subjectType,
    subjectId,
    decision,
    method,
    shap,
    lime,
    humanSummary: '',
    auditLogId: 'pending',
  }
  const contract = getContract(subjectType)

  const shapForSummary = shap ?? null
  const humanSummary = describeExplanation(shapForSummary, decision)
  const { compliant, violations } = validateAgainstContract(contract, {
    ...auditRecord,
    humanSummary,
  })

  return {
    subjectType,
    subjectId,
    decision,
    method,
    modelId: model.modelId,
    explainerVersion: EXPLAINER_VERSION,
    outcome: Number(outcome.toFixed(6)),
    confidence: Number(confidence.toFixed(4)),
    features,
    shap,
    lime,
    humanSummary,
    contract,
    contractCompliant: compliant,
    contractViolations: violations,
    latencyMs: Date.now() - started,
  }
}

// ─────────────────────────────────────────────────────────────
// SERIALISATION
// ─────────────────────────────────────────────────────────────

interface ExplanationRow {
  id: string
  orgId: string | null
  userId: string | null
  subjectType: string
  subjectId: string
  decision: string
  outcome: number
  confidence: number
  method: string
  modelId: string | null
  explainerVersion: string
  humanSummary: string | null
  features: string | null
  shap: string | null
  lime: string | null
  auditLogId: string | null
  contractCompliant: boolean
  contractViolations: string | null
  latencyMs: number
  createdAt: Date
}

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** A malformed `limit` must never silently produce an empty list. */
function readLimit(raw: string | undefined, fallback: number, max: number): number {
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(Math.floor(parsed), max)
}

function toExplanationDto(row: ExplanationRow) {
  const subjectType = row.subjectType as ExplanationSubjectType
  return {
    id: row.id,
    orgId: row.orgId,
    subjectType,
    subjectId: row.subjectId,
    decision: row.decision,
    outcome: row.outcome,
    confidence: row.confidence,
    method: row.method as ExplanationMethod,
    modelId: row.modelId,
    explainerVersion: row.explainerVersion,
    humanSummary: row.humanSummary,
    features: parseJson<FeatureRef[]>(row.features, []),
    shap: parseJson<ShapExplanation | null>(row.shap, null),
    lime: parseJson<LimeExplanation | null>(row.lime, null),
    auditLogId: row.auditLogId,
    contractCompliant: row.contractCompliant,
    contractViolations: parseJson<ContractViolation[]>(row.contractViolations, []),
    latencyMs: row.latencyMs,
    createdAt: row.createdAt,
    contract: getContract(subjectType),
  }
}

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

export function createIntelligenceRoutes(deps: { authMiddleware: AuthMiddleware }) {
  const app = new Hono<{ Variables: { userId: string; userRole: string; orgId: string } }>()
  const auth = deps.authMiddleware()

  const asArray = (raw: string | null | undefined): unknown[] => parseJson<unknown[]>(raw, [])

  // ═══════════ INDUSTRY INTELLIGENCE ═══════════

  app.get('/industry/overview', auth, async (c) => {
    const orgId = (c.get('orgId') as string) || null
    const profiles = await prisma.industryProfile.findMany({
      where: orgId ? { OR: [{ orgId }, { orgId: null }] } : {},
      orderBy: { demandIndex: 'desc' },
    })

    const signals = await prisma.industrySignal.findMany({
      orderBy: { observedAt: 'desc' },
      take: 12,
      include: { profile: { select: { name: true, slug: true, sector: true } } },
    })
    const totalSignals = await prisma.industrySignal.count()

    const bySector = new Map<string, { sector: string; count: number; demand: number; competition: number; marketSize: number }>()
    for (const p of profiles) {
      const entry = bySector.get(p.sector) ?? { sector: p.sector, count: 0, demand: 0, competition: 0, marketSize: 0 }
      entry.count += 1
      entry.demand += p.demandIndex
      entry.competition += p.competitionIndex
      entry.marketSize += p.marketSizeUsd ?? 0
      bySector.set(p.sector, entry)
    }

    const sectors = [...bySector.values()]
      .map((s) => ({
        sector: s.sector,
        count: s.count,
        avgDemand: Number((s.demand / s.count).toFixed(1)),
        avgCompetition: Number((s.competition / s.count).toFixed(1)),
        marketSizeUsd: Math.round(s.marketSize),
      }))
      .sort((a, b) => b.marketSizeUsd - a.marketSizeUsd)

    const signalCounts = await prisma.industrySignal.groupBy({
      by: ['profileId'],
      _count: { _all: true },
    })
    const signalCountByProfile = new Map(signalCounts.map((s) => [s.profileId, s._count._all]))

    const withSignals = profiles.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sector: p.sector,
      demandIndex: p.demandIndex,
      competitionIndex: p.competitionIndex,
      growthRatePct: p.growthRatePct,
      avgCplUsd: p.avgCplUsd,
      topChannels: asArray(p.topChannels),
      signalCount: signalCountByProfile.get(p.id) ?? 0,
    }))

    const totals = profiles.reduce(
      (acc, p) => {
        acc.marketSizeUsd += p.marketSizeUsd ?? 0
        acc.demand += p.demandIndex
        acc.competition += p.competitionIndex
        return acc
      },
      { marketSizeUsd: 0, demand: 0, competition: 0 }
    )

    const count = profiles.length || 1
    const atRisk = profiles.filter((p) => p.competitionIndex - p.demandIndex >= 10).length
    const fastest = [...profiles].sort((a, b) => (b.growthRatePct ?? 0) - (a.growthRatePct ?? 0))[0] ?? null

    return c.json({
      kpis: {
        profiles: profiles.length,
        sectors: sectors.length,
        addressableMarketUsd: Math.round(totals.marketSizeUsd),
        avgDemandIndex: Number((totals.demand / count).toFixed(1)),
        avgCompetitionIndex: Number((totals.competition / count).toFixed(1)),
        atRiskSectors: atRisk,
        fastestGrowing: fastest ? { name: fastest.name, growthRatePct: fastest.growthRatePct } : null,
        activeSignals: totalSignals,
      },
      sectors,
      profiles: withSignals,
      signals: signals.map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        summary: s.summary,
        magnitude: s.magnitude,
        confidence: s.confidence,
        source: s.source,
        observedAt: s.observedAt,
        industry: s.profile?.name ?? 'Unknown',
        sector: s.profile?.sector ?? null,
      })),
    })
  })

  app.get('/industry/profiles', auth, async (c) => {
    const q = (c.req.query('q') || '').trim().toLowerCase()
    const sector = c.req.query('sector') || ''
    const sort = c.req.query('sort') || 'demand'

    const all = await prisma.industryProfile.findMany({ orderBy: { name: 'asc' } })
    const sectors = [...new Set(all.map((p) => p.sector))].sort()

    let items = all.filter((p) => {
      if (sector && p.sector !== sector) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      )
    })

    const sorters: Record<string, (a: any, b: any) => number> = {
      demand: (a, b) => b.demandIndex - a.demandIndex,
      competition: (a, b) => b.competitionIndex - a.competitionIndex,
      growth: (a, b) => (b.growthRatePct ?? 0) - (a.growthRatePct ?? 0),
      cpl: (a, b) => (a.avgCplUsd ?? 0) - (b.avgCplUsd ?? 0),
      name: (a, b) => a.name.localeCompare(b.name),
    }
    items = [...items].sort(sorters[sort] ?? sorters.demand)

    const signalCounts = await prisma.industrySignal.groupBy({
      by: ['profileId'],
      _count: { _all: true },
    })
    const signalCountByProfile = new Map(signalCounts.map((s) => [s.profileId, s._count._all]))

    return c.json({
      total: items.length,
      sectors,
      items: items.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sector: p.sector,
        description: p.description,
        marketSizeUsd: p.marketSizeUsd,
        growthRatePct: p.growthRatePct,
        demandIndex: p.demandIndex,
        competitionIndex: p.competitionIndex,
        avgCplUsd: p.avgCplUsd,
        seasonality: p.seasonality,
        status: p.status,
        signalCount: signalCountByProfile.get(p.id) ?? 0,
        topChannels: asArray(p.topChannels),
        keywordClusters: asArray(p.keywordClusters),
        contentStyles: asArray(p.contentStyles),
        riskFlags: asArray(p.riskFlags),
      })),
    })
  })

  app.get('/industry/profiles/:id', auth, async (c) => {
    const { id } = c.req.param()
    const profile = await prisma.industryProfile.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { signals: { orderBy: { observedAt: 'desc' } } },
    })
    if (!profile) return c.json({ error: `Industry profile "${id}" not found` }, 404)

    return c.json({
      profile: {
        id: profile.id,
        name: profile.name,
        slug: profile.slug,
        sector: profile.sector,
        description: profile.description,
        marketSizeUsd: profile.marketSizeUsd,
        growthRatePct: profile.growthRatePct,
        demandIndex: profile.demandIndex,
        competitionIndex: profile.competitionIndex,
        avgCplUsd: profile.avgCplUsd,
        seasonality: profile.seasonality,
        status: profile.status,
        topChannels: asArray(profile.topChannels),
        keywordClusters: asArray(profile.keywordClusters),
        contentStyles: asArray(profile.contentStyles),
        riskFlags: asArray(profile.riskFlags),
      },
      signals: profile.signals.map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        summary: s.summary,
        magnitude: s.magnitude,
        confidence: s.confidence,
        source: s.source,
        observedAt: s.observedAt,
      })),
    })
  })

  // ═══════════ AUDIT CENTER ═══════════

  app.get('/audit/center', auth, async (c) => {
    const q = (c.req.query('q') || '').trim().toLowerCase()
    const action = c.req.query('action') || ''
    const limit = readLimit(c.req.query('limit'), 100, 500)

    const all = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 2000 })

    const byAction = new Map<string, number>()
    const byDay = new Map<string, number>()
    const byOutcome = { allowed: 0, blocked: 0, reviewed: 0 }

    for (const e of all) {
      byAction.set(e.action, (byAction.get(e.action) ?? 0) + 1)
      const day = e.createdAt.toISOString().slice(0, 10)
      byDay.set(day, (byDay.get(day) ?? 0) + 1)
      const hay = `${e.action} ${e.details ?? ''}`.toLowerCase()
      if (hay.includes('block') || hay.includes('denied') || hay.includes('revoked')) byOutcome.blocked += 1
      else if (hay.includes('review') || hay.includes('signoff')) byOutcome.reviewed += 1
      else byOutcome.allowed += 1
    }

    const actions = [...byAction.keys()].sort()

    const filtered = all.filter((e) => {
      if (action && e.action !== action) return false
      if (!q) return true
      return (
        e.action.toLowerCase().includes(q) ||
        (e.resource ?? '').toLowerCase().includes(q) ||
        (e.details ?? '').toLowerCase().includes(q)
      )
    })

    const explanationCount = await prisma.explanationRecord.count()
    const explanations = await prisma.explanationRecord.findMany({ select: { contractCompliant: true } })
    const compliant = explanations.filter((e) => e.contractCompliant).length

    return c.json({
      stats: {
        total: all.length,
        uniqueActions: byAction.size,
        blocked: byOutcome.blocked,
        reviewed: byOutcome.reviewed,
        explanations: explanationCount,
        explanationComplianceRate: explanationCount ? compliant / explanationCount : 1,
      },
      byAction: [...byAction.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      byDay: [...byDay.entries()].map(([day, count]) => ({ day, count })).sort((a, b) => a.day.localeCompare(b.day)),
      actions,
      total: filtered.length,
      events: filtered.slice(0, limit).map((e) => ({
        id: e.id,
        action: e.action,
        resource: e.resource,
        resourceId: e.resourceId,
        details: e.details,
        userId: e.userId,
        ipAddress: e.ipAddress,
        createdAt: e.createdAt,
      })),
    })
  })

  app.get('/audit/contracts', auth, async (c) => {
    const rows = await prisma.explanationRecord.findMany({
      orderBy: { createdAt: 'desc' },
      select: { subjectType: true, contractCompliant: true, contractViolations: true, method: true, createdAt: true },
    })

    const matrix = EXPLAINABILITY_CONTRACTS.map((contract) => {
      const scoped = rows.filter((r) => r.subjectType === contract.subjectType)
      const compliant = scoped.filter((r) => r.contractCompliant).length
      const violationCounts = new Map<string, number>()
      for (const r of scoped) {
        for (const v of parseJson<ContractViolation[]>(r.contractViolations, [])) {
          violationCounts.set(v.rule, (violationCounts.get(v.rule) ?? 0) + 1)
        }
      }
      return {
        ...contract,
        evaluated: scoped.length,
        compliant,
        violating: scoped.length - compliant,
        complianceRate: scoped.length ? compliant / scoped.length : 1,
        topViolations: [...violationCounts.entries()]
          .map(([rule, count]) => ({ rule, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3),
        lastEvaluatedAt: scoped[0]?.createdAt ?? null,
      }
    })

    const totalEvaluated = rows.length
    const totalCompliant = rows.filter((r) => r.contractCompliant).length

    return c.json({
      summary: {
        contracts: matrix.length,
        evaluated: totalEvaluated,
        compliant: totalCompliant,
        violating: totalEvaluated - totalCompliant,
        complianceRate: totalEvaluated ? totalCompliant / totalEvaluated : 1,
      },
      matrix,
    })
  })

  // ═══════════ EXPLAINABILITY LEDGER ═══════════

  app.get('/explainability/records', auth, async (c) => {
    const subjectType = c.req.query('subjectType') || ''
    const method = c.req.query('method') || ''
    const compliance = c.req.query('compliance') || ''
    const limit = readLimit(c.req.query('limit'), 50, 200)

    const where: Record<string, unknown> = {}
    if (subjectType) where.subjectType = subjectType
    if (method) where.method = method
    if (compliance === 'compliant') where.contractCompliant = true
    if (compliance === 'violating') where.contractCompliant = false

    const rows = await prisma.explanationRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const allForSummary = await prisma.explanationRecord.findMany({
      select: { subjectType: true, contractCompliant: true, method: true, latencyMs: true },
    })

    const bySubject = new Map<string, number>()
    for (const r of allForSummary) bySubject.set(r.subjectType, (bySubject.get(r.subjectType) ?? 0) + 1)

    const latencies = allForSummary.map((r) => r.latencyMs).sort((a, b) => a - b)
    const p95 = latencies.length ? latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95))] : 0

    return c.json({
      summary: {
        total: allForSummary.length,
        compliant: allForSummary.filter((r) => r.contractCompliant).length,
        violating: allForSummary.filter((r) => !r.contractCompliant).length,
        shapOnly: allForSummary.filter((r) => r.method === 'shap').length,
        shapAndLime: allForSummary.filter((r) => r.method === 'shap+lime').length,
        limeOnly: allForSummary.filter((r) => r.method === 'lime').length,
        p95LatencyMs: p95,
        bySubject: [...bySubject.entries()].map(([subjectType, count]) => ({ subjectType, count })),
      },
      total: rows.length,
      items: rows.map((r) => toExplanationDto(r as ExplanationRow)),
    })
  })

  app.get('/explainability/contracts', auth, async (c) => {
    return c.json({ contracts: EXPLAINABILITY_CONTRACTS, explainerVersion: EXPLAINER_VERSION })
  })

  app.get('/explainability/records/:id', auth, async (c) => {
    const { id } = c.req.param()
    const row = await prisma.explanationRecord.findUnique({ where: { id } })
    if (!row) return c.json({ error: `Explanation "${id}" not found` }, 404)
    return c.json({ record: toExplanationDto(row as ExplanationRow) })
  })

  /**
   * POST /explainability/analyze
   *   { subjectType, subjectId, decision?, method?, persist? }
   *
   * Produces an explanation, enforces the subject's contract, and — unless
   * `persist: false` — binds it to the audit ledger and stores it.
   *
   * `persist: false` is the reproducibility check: re-derive and compare
   * without writing. A verification action must never grow the ledger.
   */
  app.post('/explainability/analyze', auth, async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const subjectType = body.subjectType as ExplanationSubjectType
    const subjectId = String(body.subjectId ?? '').trim()

    if (!subjectType || !SUBJECT_MODELS[subjectType]) {
      return c.json({ error: `subjectType must be one of: ${Object.keys(SUBJECT_MODELS).join(', ')}` }, 400)
    }
    if (!subjectId) return c.json({ error: 'subjectId is required' }, 400)

    const method = body.method as ExplanationMethod | undefined
    if (method && !['shap', 'lime', 'shap+lime'].includes(method)) {
      return c.json({ error: 'method must be one of: shap, lime, shap+lime' }, 400)
    }

    const persist = body.persist !== false
    const orgId = (c.get('orgId') as string) || null
    const userId = (c.get('userId') as string) || null
    const subject = explainSubject(subjectType, subjectId, { decision: body.decision, method })

    const dto = {
      id: persist ? '' : 'unpersisted',
      orgId,
      subjectType,
      subjectId,
      decision: subject.decision as string,
      outcome: subject.outcome as number,
      confidence: subject.confidence as number,
      method: subject.method as ExplanationMethod,
      modelId: subject.modelId as string,
      explainerVersion: subject.explainerVersion as string,
      humanSummary: subject.humanSummary as string,
      features: subject.features as FeatureRef[],
      shap: subject.shap as ShapExplanation | null,
      lime: subject.lime as LimeExplanation | null,
      auditLogId: null as string | null,
      contractCompliant: subject.contractCompliant as boolean,
      contractViolations: subject.contractViolations as ContractViolation[],
      latencyMs: subject.latencyMs as number,
      createdAt: new Date(),
      contract: getContract(subjectType),
    }

    if (!persist) {
      return c.json({ record: dto, auditLogId: null, ok: true, persisted: false })
    }

    const audit = await prisma.auditLog.create({
      data: {
        userId: userId ?? 'system',
        action: 'decision.explained',
        resource: subjectType,
        resourceId: subjectId,
        details: JSON.stringify({
          decision: subject.decision,
          method: subject.method,
          compliant: subject.contractCompliant,
          violations: (subject.contractViolations as ContractViolation[]).map((v) => v.rule),
        }),
      },
    })

    const persisted = await prisma.explanationRecord.create({
      data: {
        orgId,
        userId,
        subjectType,
        subjectId,
        decision: subject.decision as string,
        outcome: subject.outcome as number,
        confidence: subject.confidence as number,
        method: subject.method as string,
        modelId: subject.modelId as string,
        explainerVersion: subject.explainerVersion as string,
        humanSummary: subject.humanSummary as string,
        features: JSON.stringify(subject.features),
        shap: subject.shap ? JSON.stringify(subject.shap) : null,
        lime: subject.lime ? JSON.stringify(subject.lime) : null,
        auditLogId: audit.id,
        contractCompliant: subject.contractCompliant as boolean,
        contractViolations: JSON.stringify(subject.contractViolations),
        latencyMs: subject.latencyMs as number,
      },
    })

    return c.json({
      record: toExplanationDto(persisted as ExplanationRow),
      auditLogId: audit.id,
      ok: true,
      persisted: true,
    })
  })

  return app
}

export default createIntelligenceRoutes
