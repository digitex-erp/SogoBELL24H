// SPDX-License-Identifier: Apache-2.0
// Bell24h-OS — Explainability Framework Contract (SHAP / LIME)
//
// Every automated decision the platform makes (provider routing, budget moves,
// campaign scoring, lead scoring, content approval) is a "model output" that an
// auditor must be able to interrogate. This module is the single contract that
// defines HOW an explanation is produced, SHAPED and AUDITED.
//
// It is pure TypeScript with no runtime dependencies, so the exact same code
// runs in the API route (producing + persisting explanations) and in the
// browser (rendering + verifying them).

// ─────────────────────────────────────────────────────────────
// 1. SUBJECT TAXONOMY — what can be explained
// ─────────────────────────────────────────────────────────────

export type ExplanationSubjectType =
  | 'routing_decision'
  | 'budget_allocation'
  | 'campaign_scoring'
  | 'lead_scoring'
  | 'content_approval'

export type ExplanationMethod = 'shap' | 'lime' | 'shap+lime'

export type RiskTier = 'standard' | 'elevated' | 'regulated'

// ─────────────────────────────────────────────────────────────
// 2. FEATURES + CONTRIBUTIONS
// ─────────────────────────────────────────────────────────────

export interface FeatureRef {
  /** Canonical, stable, dotted key. Never a display string. */
  key: string
  /** Human label. Safe to render. */
  label: string
  /** Observed value for THIS subject. */
  value: number | string | boolean | null
  /** Machine unit for numeric features ("ms", "usd", "0..1"). */
  unit?: string
  /** Training-set mean, used as the SHAP baseline E[X]. */
  baseline?: number
}

export interface ShapContribution {
  feature: FeatureRef
  /** Signed contribution phi_i in the model's output units. */
  shapValue: number
  /** |phi_i| / sum|phi| — drives bar width, always 0..1. */
  absShare: number
  /** Whether the feature pushed the decision up, down, or not at all. */
  direction: 'push_up' | 'push_down' | 'neutral'
}

export interface ShapExplanation {
  /** E[f(X)] — the model's expected output before any feature is observed. */
  baseValue: number
  /** f(x) — the actual output for this subject. */
  outputValue: number
  contributions: ShapContribution[]
  /** baseValue + Σ phi_i. Must equal outputValue within tolerance. */
  sumCheck: number
  /** Whether the additivity check passed (local accuracy axiom). */
  complete: boolean
  /** 'exact' = brute-force coalition enumeration; 'sampled' = permutation Monte Carlo. */
  estimator: 'exact' | 'sampled'
  /** Features evaluated, and coalitions used when sampling. */
  featuresEvaluated: number
  coalitionsEvaluated: number
}

export interface LimeRule {
  feature: FeatureRef
  /** Surrogate coefficient on the locally-standardised feature. */
  weight: number
  /** Human-readable predicate the rule describes. */
  condition: string
  effect: 'supports' | 'opposes' | 'neutral'
  /** Fraction of the neighbourhood satisfying the predicate, 0..1. */
  support: number
}

export interface LimeExplanation {
  /** Weighted R² of the surrogate inside the local neighbourhood. */
  localFidelity: number
  /** Kernel width (bandwidth) used to weight the neighbourhood. */
  kernelWidth: number
  samples: number
  interiorValue: number
  intercept: number
  rules: LimeRule[]
}

// ─────────────────────────────────────────────────────────────
// 3. THE PERSISTED RECORD
// ─────────────────────────────────────────────────────────────

export interface ExplanationRecord {
  id: string
  orgId: string | null
  subjectType: ExplanationSubjectType
  subjectId: string
  /** The decision that was taken, in human terms. */
  decision: string
  /** Machine-readable outcome, usually the model's numeric output. */
  outcome: number
  /** Normalised 0..1 model confidence. */
  confidence: number
  method: ExplanationMethod
  modelId: string
  explainerVersion: string
  /** Plain-language narrative for non-technical auditors. */
  humanSummary: string
  shap: ShapExplanation | null
  lime: LimeExplanation | null
  /** AuditLog row this explanation is bound to, for chain-of-custody. */
  auditLogId: string | null
  /** Result of validateAgainstContract at write time. */
  contractCompliant: boolean
  /** Violations recorded at write time; empty when compliant. */
  contractViolations: ContractViolation[]
  /** Wall-clock time taken to generate the explanation. */
  latencyMs: number
  createdAt: string
}

// ─────────────────────────────────────────────────────────────
// 4. THE FRAMEWORK CONTRACT
//
// A "contract" per subject type: what an explanation MUST contain before the
// platform is allowed to act on the decision, and how long it must survive.
// Routes enforce this; the UI renders it as the compliance matrix.
// ─────────────────────────────────────────────────────────────

export interface ExplainabilityContract {
  subjectType: ExplanationSubjectType
  label: string
  /** Minimum method an explanation must reach. */
  requiredMethod: ExplanationMethod
  /** Minimum number of features that must be attributed. */
  minFeatures: number
  /** Hard ceiling on explanation generation time. */
  maxLatencyMs: number
  /** Audit retention, in days. */
  retentionDays: number
  /** Whether a plain-language summary is mandatory. */
  requiresHumanSummary: boolean
  /** Whether every instance must be written to the audit ledger. */
  requiresAuditBinding: boolean
  /** Whether a human must counter-sign before the decision executes. */
  requiresHumanReview: boolean
  riskTier: RiskTier
}

export const EXPLAINABILITY_CONTRACTS: ExplainabilityContract[] = [
  {
    subjectType: 'routing_decision',
    label: 'AI Provider Routing',
    requiredMethod: 'shap',
    minFeatures: 5,
    maxLatencyMs: 250,
    retentionDays: 90,
    requiresHumanSummary: false,
    requiresAuditBinding: true,
    requiresHumanReview: false,
    riskTier: 'standard',
  },
  {
    subjectType: 'budget_allocation',
    label: 'Budget Allocation',
    requiredMethod: 'shap+lime',
    minFeatures: 6,
    maxLatencyMs: 400,
    retentionDays: 365,
    requiresHumanSummary: true,
    requiresAuditBinding: true,
    requiresHumanReview: true,
    riskTier: 'regulated',
  },
  {
    subjectType: 'campaign_scoring',
    label: 'Campaign Scoring',
    requiredMethod: 'shap',
    minFeatures: 5,
    maxLatencyMs: 300,
    retentionDays: 180,
    requiresHumanSummary: true,
    requiresAuditBinding: true,
    requiresHumanReview: false,
    riskTier: 'elevated',
  },
  {
    subjectType: 'lead_scoring',
    label: 'Lead Scoring',
    requiredMethod: 'shap',
    minFeatures: 4,
    maxLatencyMs: 200,
    retentionDays: 180,
    requiresHumanSummary: false,
    requiresAuditBinding: true,
    requiresHumanReview: false,
    riskTier: 'standard',
  },
  {
    subjectType: 'content_approval',
    label: 'Content Approval',
    requiredMethod: 'shap+lime',
    minFeatures: 5,
    maxLatencyMs: 500,
    retentionDays: 365,
    requiresHumanSummary: true,
    requiresAuditBinding: true,
    requiresHumanReview: true,
    riskTier: 'regulated',
  },
]

export function getContract(subjectType: ExplanationSubjectType): ExplainabilityContract {
  return EXPLAINABILITY_CONTRACTS.find((c) => c.subjectType === subjectType) ?? EXPLAINABILITY_CONTRACTS[0]
}

export interface ContractViolation {
  rule: string
  detail: string
}

/**
 * Evaluate an explanation against its contract. This is the gate the API route
 * runs before persisting — an explanation that fails here is recorded as
 * non-compliant rather than silently accepted.
 */
export function validateAgainstContract(
  contract: ExplainabilityContract,
  explanation: Pick<ExplanationRecord, 'method' | 'humanSummary' | 'shap' | 'lime' | 'auditLogId'>
): { compliant: boolean; violations: ContractViolation[] } {
  const violations: ContractViolation[] = []

  const rank: Record<ExplanationMethod, number> = { shap: 1, lime: 1, 'shap+lime': 2 }
  if (rank[explanation.method] < rank[contract.requiredMethod]) {
    violations.push({
      rule: 'requiredMethod',
      detail: `Contract requires ${contract.requiredMethod}, explanation used ${explanation.method}.`,
    })
  }

  const attributed = explanation.shap?.contributions.length ?? 0
  if (attributed < contract.minFeatures) {
    violations.push({
      rule: 'minFeatures',
      detail: `Contract requires ${contract.minFeatures} attributed features, explanation has ${attributed}.`,
    })
  }

  if (explanation.shap && !explanation.shap.complete) {
    violations.push({
      rule: 'localAccuracy',
      detail: `SHAP additivity failed: base + Σphi = ${explanation.shap.sumCheck}, output = ${explanation.shap.outputValue}.`,
    })
  }

  if (contract.requiresHumanSummary && !explanation.humanSummary?.trim()) {
    violations.push({ rule: 'requiresHumanSummary', detail: 'Contract requires a plain-language summary.' })
  }

  if (contract.requiresAuditBinding && !explanation.auditLogId) {
    violations.push({ rule: 'requiresAuditBinding', detail: 'Explanation is not bound to an audit ledger entry.' })
  }

  return { compliant: violations.length === 0, violations }
}

// ─────────────────────────────────────────────────────────────
// 5. SHAP — exact Shapley values
// ─────────────────────────────────────────────────────────────

export type ValueFunction = (coalition: Set<string>) => number

/**
 * Exact Shapley values by coalition enumeration. Cost is 2^n model
 * evaluations, so it is exact for n <= EXACT_FEATURE_LIMIT and falls back to
 * permutation Monte Carlo above that.
 */
export const EXACT_FEATURE_LIMIT = 14

function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

export function computeShapValues(
  value: ValueFunction,
  featureKeys: string[],
  options: { permutations?: number } = {}
): { values: Record<string, number>; estimator: 'exact' | 'sampled'; coalitions: number } {
  const n = featureKeys.length
  if (n === 0) return { values: {}, estimator: 'exact', coalitions: 0 }

  if (n <= EXACT_FEATURE_LIMIT) {
    const cache = new Map<string, number>()
    const evaluate = (subset: string[]): number => {
      const k = subset.join('\u0001')
      const hit = cache.get(k)
      if (hit !== undefined) return hit
      const v = value(new Set(subset))
      cache.set(k, v)
      return v
    }

    const values: Record<string, number> = {}
    const total = factorial(n)
    for (const key of featureKeys) {
      let phi = 0
      const others = featureKeys.filter((k) => k !== key)
      const m = others.length
      for (let mask = 0; mask < 1 << m; mask++) {
        const subset: string[] = []
        for (let i = 0; i < m; i++) if (mask & (1 << i)) subset.push(others[i])
        const s = subset.length
        const weight = (factorial(s) * factorial(n - s - 1)) / total
        phi += weight * (evaluate([...subset, key]) - evaluate(subset))
      }
      values[key] = phi
    }
    return { values, estimator: 'exact', coalitions: cache.size }
  }

  const permutations = options.permutations ?? 200
  const totals: Record<string, number> = {}
  for (const key of featureKeys) totals[key] = 0

  for (let p = 0; p < permutations; p++) {
    const order = [...featureKeys]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const running = new Set<string>()
    let prev = value(running)
    for (const key of order) {
      running.add(key)
      const next = value(running)
      totals[key] += next - prev
      prev = next
    }
  }

  const values: Record<string, number> = {}
  for (const key of featureKeys) values[key] = totals[key] / permutations
  return { values, estimator: 'sampled', coalitions: permutations * n }
}

export function buildShapExplanation(args: {
  features: FeatureRef[]
  weights: Record<string, number>
  outputValue: number
  /** E[f(X)] — the model's expected output before any feature is observed. */
  baseValue?: number
  featureKeys?: string[]
}): ShapExplanation {
  const { features, weights, outputValue } = args
  const byKey = new Map(features.map((f) => [f.key, f]))
  const keys = (args.featureKeys ?? features.map((f) => f.key)).filter((k) => byKey.has(k))

  const numeric = (f: FeatureRef): number =>
    typeof f.value === 'number' ? f.value : typeof f.value === 'boolean' ? (f.value ? 1 : 0) : 0

  // Additive value function: only observed features contribute their
  // weighted deviation from the training baseline.
  const value: ValueFunction = (coalition) => {
    let acc = 0
    for (const key of coalition) {
      const f = byKey.get(key)
      if (!f) continue
      const w = weights[key] ?? 0
      acc += w * (numeric(f) - (f.baseline ?? 0))
    }
    return acc
  }

  const baseValue = args.baseValue ?? 0
  const { values, estimator, coalitions } = computeShapValues(value, keys)
  const absTotal = Object.values(values).reduce((a, b) => a + Math.abs(b), 0)

  const contributions: ShapContribution[] = keys
    .map((key) => {
      const phi = values[key]
      const abs = Math.abs(phi)
      return {
        feature: byKey.get(key)!,
        shapValue: phi,
        absShare: absTotal > 0 ? abs / absTotal : 0,
        direction: phi > 1e-9 ? 'push_up' : phi < -1e-9 ? 'push_down' : 'neutral',
      } as ShapContribution
    })
    .sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue))

  const sumCheck = baseValue + Object.values(values).reduce((a, b) => a + b, 0)
  const tolerance = Math.max(1e-6, Math.abs(outputValue) * 1e-6)

  return {
    baseValue,
    outputValue,
    contributions,
    sumCheck,
    complete: Math.abs(sumCheck - outputValue) <= tolerance,
    estimator,
    featuresEvaluated: keys.length,
    coalitionsEvaluated: coalitions,
  }
}

// ─────────────────────────────────────────────────────────────
// 6. LIME — local surrogate
// ─────────────────────────────────────────────────────────────

export interface LimeSample {
  point: Record<string, number>
  prediction: number
}

/**
 * Fit a weighted ridge regression surrogate around the subject. The kernel is
 * exponential on normalised L2 distance, per the LIME paper.
 */
export function buildLimeExplanation(args: {
  features: FeatureRef[]
  samples: LimeSample[]
  subjectPoint: Record<string, number>
  kernelWidth?: number
  intercept: number
}): LimeExplanation {
  const { features, samples, subjectPoint, intercept } = args
  const keys = features.map((f) => f.key)
  const d = keys.length
  const kernelWidth = args.kernelWidth ?? 0.75

  const numeric = (f: FeatureRef): number =>
    typeof f.value === 'number' ? f.value : typeof f.value === 'boolean' ? (f.value ? 1 : 0) : 0

  // Standardise on the sample population so coefficients are comparable.
  const means: Record<string, number> = {}
  const stds: Record<string, number> = {}
  for (const k of keys) {
    const col = samples.map((s) => s.point[k] ?? 0)
    const mean = col.reduce((a, b) => a + b, 0) / (col.length || 1)
    const variance = col.reduce((a, b) => a + (b - mean) ** 2, 0) / (col.length || 1)
    means[k] = mean
    stds[k] = Math.sqrt(variance) || 1
  }

  const norm = (k: string, v: number) => (v - means[k]) / stds[k]

  const rows = samples.map((s) => {
    const z = keys.map((k) => norm(k, s.point[k] ?? 0))
    const zs = keys.map((k) => norm(k, subjectPoint[k] ?? 0))
    const dist2 = z.reduce((acc, v, i) => acc + (v - zs[i]) ** 2, 0)
    const weight = Math.exp(-(dist2 / (kernelWidth ** 2)))
    const centred = s.prediction - intercept
    return { z, weight, y: centred, support: dist2 < kernelWidth ** 2 }
  })

  const p = d + 1
  const xtx: number[][] = Array.from({ length: p }, () => new Array(p).fill(0))
  const xty: number[] = new Array(p).fill(0)
  const lambda = 1e-3

  for (const r of rows) {
    const design = [1, ...r.z]
    for (let i = 0; i < p; i++) {
      xty[i] += r.weight * design[i] * r.y
      for (let j = 0; j < p; j++) xtx[i][j] += r.weight * design[i] * design[j]
    }
  }
  for (let i = 0; i < p; i++) xtx[i][i] += lambda

  const beta = solveLinearSystem(xtx, xty)

  const predict = (design: number[]) => design.reduce((acc, v, i) => acc + v * beta[i], 0)
  const yMean = rows.reduce((a, r) => a + r.weight * r.y, 0) / (rows.reduce((a, r) => a + r.weight, 0) || 1)
  let ssRes = 0
  let ssTot = 0
  for (const r of rows) {
    const design = [1, ...r.z]
    ssRes += r.weight * (r.y - predict(design)) ** 2
    ssTot += r.weight * (r.y - yMean) ** 2
  }
  const localFidelity = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1

  const supportFor = (index: number): number => {
    const total = rows.length || 1
    const hit = rows.filter((r) => {
      const zs = norm(keys[index], subjectPoint[keys[index]] ?? 0)
      return Math.abs(r.z[index] - zs) < 1
    }).length
    return hit / total
  }

  const rules: LimeRule[] = keys
    .map((k, i) => {
      const f = features[i]
      const w = beta[i + 1]
      const observed = numeric(f)
      const condition =
        typeof f.value === 'string'
          ? `${f.label} = "${f.value}"`
          : typeof f.value === 'boolean'
          ? `${f.label} is ${f.value ? 'true' : 'false'}`
          : `${f.label} ≈ ${formatFeatureValue(f)}`
      return {
        feature: f,
        weight: w,
        condition,
        effect: w > 1e-9 ? 'supports' : w < -1e-9 ? 'opposes' : 'neutral',
        support: supportFor(i),
      } as LimeRule
    })
    .filter((r) => Math.abs(r.weight) > 1e-9)
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))

  return {
    localFidelity,
    kernelWidth,
    samples: samples.length,
    interiorValue: predict([1, ...keys.map((k) => norm(k, subjectPoint[k] ?? 0))]) + intercept,
    intercept,
    rules,
  }
}

/** Gaussian-elimination solver with partial pivoting. */
function solveLinearSystem(a: number[][], b: number[]): number[] {
  const n = b.length
  const m = a.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col++) {
    let pivot = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) pivot = row
    }
    ;[m[col], m[pivot]] = [m[pivot], m[col]]
    const pv = m[col][col]
    if (Math.abs(pv) < 1e-12) continue
    for (let j = col; j <= n; j++) m[col][j] /= pv
    for (let row = 0; row < n; row++) {
      if (row === col) continue
      const factor = m[row][col]
      if (factor === 0) continue
      for (let j = col; j <= n; j++) m[row][j] -= factor * m[col][j]
    }
  }
  return m.map((row) => row[n])
}

// ─────────────────────────────────────────────────────────────
// 7. NARRATIVE + FORMATTING
// ─────────────────────────────────────────────────────────────

export function formatFeatureValue(f: FeatureRef): string {
  if (f.value === null || f.value === undefined) return '—'
  if (typeof f.value === 'boolean') return f.value ? 'yes' : 'no'
  if (typeof f.value === 'string') return f.value
  const unit = f.unit ?? ''
  if (f.unit === 'usd') return `$${f.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  if (f.unit === '0..1') return f.value.toFixed(3)
  return `${f.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}${unit ? ` ${unit}` : ''}`
}

export function describeExplanation(shap: ShapExplanation | null, decision: string): string {
  if (!shap || shap.contributions.length === 0) return `No feature attribution available for: ${decision}.`
  const render = (c: ShapContribution) => `${c.feature.label} (${formatFeatureValue(c.feature)})`
  const up = shap.contributions.filter((c) => c.direction === 'push_up').slice(0, 3).map(render)
  const down = shap.contributions.filter((c) => c.direction === 'push_down').slice(0, 3).map(render)

  const side = shap.outputValue >= 0 ? 'above' : 'below'
  const clauses: string[] = []
  if (up.length) clauses.push(`supporting factors were ${up.join(', ')}`)
  if (down.length) clauses.push(`counteracting factors were ${down.join(', ')}`)

  const body = clauses.length ? clauses.join('; ') : 'no feature moved materially'
  return `${decision}. The model scored this ${Math.abs(shap.outputValue).toFixed(3)} points ${side} the neutral baseline; ${body}.`
}

export const EXPLAINER_VERSION = 'bell24h-xai/1.0.0'

export function contractComplianceSummary(
  records: Array<Pick<ExplanationRecord, 'contractCompliant'>>
): { compliant: number; total: number; rate: number } {
  const total = records.length
  const compliant = records.filter((r) => r.contractCompliant).length
  return { compliant, total, rate: total ? compliant / total : 1 }
}
