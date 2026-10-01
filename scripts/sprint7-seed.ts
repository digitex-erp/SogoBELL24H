// Sprint 7 seed — Industry Intelligence profiles/signals + Explainability ledger.
//
// Explanations are seeded THROUGH the live API rather than written directly, so
// seeding also proves the endpoint works end to end and every ledger row is a
// genuine product of the SHAP/LIME engine + contract gate.

import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const DB_URL = 'file:/app/workspace/96d80a5e-ec8f-4213-b941-201dbeb74ba2/prisma/dev.db'
const BASE = 'http://localhost:3101/api'

const adapter = new PrismaLibSql({ url: DB_URL })
const db = new PrismaClient({ adapter })

function generateToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 })
  )
  const sig = btoa(`${header}.${body}.bell24h-secret`)
  return `${header}.${body}.${sig}`
}

interface IndustrySeed {
  name: string
  slug: string
  sector: string
  description: string
  marketSizeUsd: number
  growthRatePct: number
  demandIndex: number
  competitionIndex: number
  avgCplUsd: number
  seasonality: string
  topChannels: string[]
  keywordClusters: string[]
  contentStyles: string[]
  riskFlags: string[]
}

const INDUSTRIES: IndustrySeed[] = [
  {
    name: 'Textiles & Apparel', slug: 'textiles-apparel', sector: 'Manufacturing',
    description: 'Spinning, weaving, garmenting and export houses across Surat, Tirupur and Ludhiana.',
    marketSizeUsd: 168000000000, growthRatePct: 9.4, demandIndex: 82, competitionIndex: 74, avgCplUsd: 3.1,
    seasonality: 'Peaks Sep-Nov (festive) and Feb-Apr (export order books)',
    topChannels: ['Google Search', 'IndiaMART', 'WhatsApp Business', 'Trade Fairs'],
    keywordClusters: ['bulk fabric suppliers', 'garment manufacturer india', 'cotton yarn wholesale', 'export quality textiles'],
    contentStyles: ['Catalogue PDF', 'Fabric close-up video', 'Factory walkthrough', 'Buyer testimonial'],
    riskFlags: ['Cotton price volatility', 'Export duty exposure'],
  },
  {
    name: 'Auto Components', slug: 'auto-components', sector: 'Manufacturing',
    description: 'Tier-1 and Tier-2 suppliers to OEMs across Pune, Chennai and Gurugram.',
    marketSizeUsd: 57000000000, growthRatePct: 7.1, demandIndex: 76, competitionIndex: 68, avgCplUsd: 5.4,
    seasonality: 'Q1 and Q3 order cycles align to OEM production plans',
    topChannels: ['Google Search', 'LinkedIn', 'OEM Portals', 'Trade Fairs'],
    keywordClusters: ['precision machined parts', 'sheet metal supplier', 'automotive castings', 'tier 1 component maker'],
    contentStyles: ['Technical spec sheet', 'CAD animation', 'Plant capability deck'],
    riskFlags: ['OEM concentration risk', 'Steel price pass-through lag'],
  },
  {
    name: 'Pharmaceuticals & Nutraceuticals', slug: 'pharma-nutraceuticals', sector: 'Regulated',
    description: 'Formulation units, contract manufacturing and nutraceutical brands.',
    marketSizeUsd: 50000000000, growthRatePct: 11.2, demandIndex: 88, competitionIndex: 81, avgCplUsd: 8.2,
    seasonality: 'Steady; spikes Jan-Feb for immunity SKUs',
    topChannels: ['Google Search', 'Pharmacy Chains', 'LinkedIn', 'Medical Conferences'],
    keywordClusters: ['contract manufacturing pharma', 'nutraceutical private label', 'ayurvedic supplement manufacturer'],
    contentStyles: ['Compliance-first brochure', 'Lab credential video', 'Regulatory explainer'],
    riskFlags: ['Regulated claims', 'Approval dependency', 'Requires human sign-off'],
  },
  {
    name: 'Food Processing', slug: 'food-processing', sector: 'Consumer',
    description: 'Spices, ready-to-eat and packaged foods serving domestic retail and export.',
    marketSizeUsd: 34000000000, growthRatePct: 10.6, demandIndex: 84, competitionIndex: 69, avgCplUsd: 4.4,
    seasonality: 'Strong Sep-Dec (festive) and Apr-Jun (summer beverages)',
    topChannels: ['Meta Ads', 'Quick Commerce', 'Modern Trade', 'Influencers'],
    keywordClusters: ['bulk spice supplier', 'private label snacks', 'ready to eat meals manufacturer'],
    contentStyles: ['Recipe reel', 'Packaging hero shot', 'Shelf-life proof content'],
    riskFlags: ['FSSAI labelling', 'Perishability in logistics'],
  },
  {
    name: 'Electronics & EMS', slug: 'electronics-ems', sector: 'Manufacturing',
    description: 'PCB assembly, IoT device builders and consumer electronics brands.',
    marketSizeUsd: 28000000000, growthRatePct: 14.8, demandIndex: 79, competitionIndex: 72, avgCplUsd: 6.9,
    seasonality: 'Aug-Nov build-up for festive retail',
    topChannels: ['Google Search', 'LinkedIn', 'GitHub/Developer', 'Distributors'],
    keywordClusters: ['pcb assembly services', 'iot device manufacturer', 'ems provider india'],
    contentStyles: ['Datasheet', 'Demo video', 'Reference-design blog'],
    riskFlags: ['Component lead times', 'BIS certification'],
  },
  {
    name: 'Chemicals & Polymers', slug: 'chemicals-polymers', sector: 'Industrial',
    description: 'Specialty chemicals, masterbatches and polymer compounds.',
    marketSizeUsd: 41000000000, growthRatePct: 6.8, demandIndex: 68, competitionIndex: 83, avgCplUsd: 7.6,
    seasonality: 'Monsoon slowdown Jun-Aug',
    topChannels: ['Google Search', 'IndiaMART', 'Distributors', 'LinkedIn'],
    keywordClusters: ['specialty chemicals supplier', 'masterbatch manufacturer', 'polymer compound trader'],
    contentStyles: ['TDS/MSDS pack', 'Application note', 'Plant HSE credential'],
    riskFlags: ['Highest competition index', 'Environmental compliance'],
  },
  {
    name: 'Engineering Goods & Machinery', slug: 'engineering-goods', sector: 'Industrial',
    description: 'CNC machining, fabrication and industrial machinery builders.',
    marketSizeUsd: 62000000000, growthRatePct: 8.3, demandIndex: 74, competitionIndex: 65, avgCplUsd: 6.1,
    seasonality: 'Capital-spend cycles: Q4 and Q1',
    topChannels: ['Google Search', 'Trade Fairs', 'LinkedIn', 'Dealer Network'],
    keywordClusters: ['cnc machining services', 'industrial machinery manufacturer', 'fabrication job work'],
    contentStyles: ['Machine demo video', 'Tolerance capability sheet', 'Factory tour'],
    riskFlags: ['Long sales cycles', 'Working-capital intensity'],
  },
  {
    name: 'Handicrafts & Home Decor', slug: 'handicrafts-decor', sector: 'Consumer',
    description: 'Artisan clusters, export merchandisers and D2C decor brands.',
    marketSizeUsd: 12000000000, growthRatePct: 12.1, demandIndex: 71, competitionIndex: 52, avgCplUsd: 2.6,
    seasonality: 'Very strong Sep-Dec; export orders Mar-Jun',
    topChannels: ['Instagram', 'Etsy/Amazon', 'Export Agents', 'Pinterest'],
    keywordClusters: ['handicraft exporter india', 'artisan home decor wholesale', 'handmade gifting supplier'],
    contentStyles: ['Artisan story reel', 'Lifestyle flat-lay', 'Craft-process video'],
    riskFlags: ['Lowest barrier to entry', 'Artisan supply fragmentation'],
  },
]

const SIGNAL_TEMPLATES = [
  { type: 'demand', title: 'Search demand up {m}% MoM', summary: 'Category query volume accelerated against a {c}-day baseline.', magnitude: 4.2, confidence: 0.86, source: 'Keyword Index' },
  { type: 'competition', title: 'New entrant pressure in {s}', summary: 'Two funded players began bidding on core cluster terms.', magnitude: -3.1, confidence: 0.72, source: 'Ad Auction Data' },
  { type: 'cost', title: 'CPL moved {m}% away from plan', summary: 'Auction density shifted; blended CPL diverged from the 90-day mean.', magnitude: -2.4, confidence: 0.79, source: 'Platform Insights' },
  { type: 'seasonality', title: 'Seasonal window opening', summary: 'Historical pattern indicates a demand build over the next 4-6 weeks.', magnitude: 5.6, confidence: 0.91, source: 'Seasonality Model' },
  { type: 'regulatory', title: 'Compliance watch flagged', summary: 'Category has content-claim exposure; route creative through the guard workflow.', magnitude: -1.8, confidence: 0.64, source: 'Policy Monitor' },
  { type: 'creative', title: 'Creative format fatigue detected', summary: 'Static CTR decayed across the last three refresh cycles.', magnitude: -2.2, confidence: 0.69, source: 'Creative Benchmarks' },
]

async function seedIndustries() {
  const signals = []
  for (const ind of INDUSTRIES) {
    const profile = await db.industryProfile.upsert({
      where: { slug: ind.slug },
      create: {
        name: ind.name, slug: ind.slug, sector: ind.sector, description: ind.description,
        marketSizeUsd: ind.marketSizeUsd, growthRatePct: ind.growthRatePct,
        demandIndex: ind.demandIndex, competitionIndex: ind.competitionIndex,
        avgCplUsd: ind.avgCplUsd, seasonality: ind.seasonality,
        topChannels: JSON.stringify(ind.topChannels),
        keywordClusters: JSON.stringify(ind.keywordClusters),
        contentStyles: JSON.stringify(ind.contentStyles),
        riskFlags: JSON.stringify(ind.riskFlags),
        status: 'active',
      },
      update: {
        name: ind.name, sector: ind.sector, description: ind.description,
        marketSizeUsd: ind.marketSizeUsd, growthRatePct: ind.growthRatePct,
        demandIndex: ind.demandIndex, competitionIndex: ind.competitionIndex,
        avgCplUsd: ind.avgCplUsd, seasonality: ind.seasonality,
        topChannels: JSON.stringify(ind.topChannels),
        keywordClusters: JSON.stringify(ind.keywordClusters),
        contentStyles: JSON.stringify(ind.contentStyles),
        riskFlags: JSON.stringify(ind.riskFlags),
      },
    })

    await db.industrySignal.deleteMany({ where: { profileId: profile.id } })

    const chosen = SIGNAL_TEMPLATES.slice(0, 4 + (ind.demandIndex % 3))
    for (let i = 0; i < chosen.length; i++) {
      const t = chosen[i]
      signals.push({
        profileId: profile.id,
        type: t.type,
        title: t.title.replace('{m}', String(Math.abs(t.magnitude) * 2.1 + (i * 1.3)).slice(0, 4)).replace('{s}', ind.name),
        summary: t.summary.replace('{c}', '90').replace('{day}', '90'),
        magnitude: t.magnitude + (i % 3) * 0.4,
        confidence: Math.min(0.98, t.confidence + (i % 4) * 0.02),
        source: t.source,
        observedAt: new Date(Date.now() - (i * 37 + 6) * 3600 * 1000),
      })
    }
  }
  await db.industrySignal.createMany({ data: signals })
  return { profiles: INDUSTRIES.length, signals: signals.length }
}

const EXPLAIN_TARGETS: Array<{ subjectType: string; ids: string[]; method?: string }> = [
  { subjectType: 'routing_decision', ids: ['route-run-8841', 'route-run-8842', 'route-run-8843', 'route-run-8844', 'route-run-8845', 'route-run-8846'] },
  { subjectType: 'campaign_scoring', ids: ['camp-2201', 'camp-2202', 'camp-2203', 'camp-2204', 'camp-2205'] },
  { subjectType: 'lead_scoring', ids: ['lead-77120', 'lead-77121', 'lead-77122', 'lead-77123', 'lead-77124', 'lead-77125', 'lead-77126'] },
  { subjectType: 'budget_allocation', ids: ['alloc-3390', 'alloc-3391', 'alloc-3392', 'alloc-3393', 'alloc-3394'] },
  { subjectType: 'content_approval', ids: ['asset-5512', 'asset-5513', 'asset-5514', 'asset-5515'] },
  // Deliberately under-specified: a regulated subject explained with SHAP only.
  // The contract gate must record these as violations, not silently accept them.
  { subjectType: 'budget_allocation', ids: ['alloc-3395', 'alloc-3396'], method: 'shap' },
  { subjectType: 'content_approval', ids: ['asset-5516'], method: 'shap' },
]

async function seedExplanations(token: string) {
  let created = 0
  let violating = 0
  const failures: string[] = []

  for (const target of EXPLAIN_TARGETS) {
    for (const subjectId of target.ids) {
      const res = await fetch(`${BASE}/explainability/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subjectType: target.subjectType, subjectId, method: target.method }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || !body.record) {
        failures.push(`${target.subjectType}/${subjectId}: HTTP ${res.status} ${body.error ?? ''}`)
        continue
      }
      created += 1
      if (!body.record.contractCompliant) violating += 1
    }
  }
  return { created, violating, failures }
}

async function main() {
  const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } })
  if (!user) throw new Error('No user found — cannot mint a seed token')
  const token = generateToken({
    sub: user.id, email: user.email, role: user.role, orgId: user.organizationId,
  })

  console.log('🌱 Seeding Sprint 7: Industry Intelligence + Explainability')

  const industry = await seedIndustries()
  console.log(`  ✅ ${industry.profiles} industry profiles, ${industry.signals} signals`)

  // Clear only rows this seed owns (plus my manual probe subjects).
  const owned = await db.explanationRecord.findMany({ where: {}, select: { id: true, subjectId: true } })
  const mine = owned.filter((r) => /^(route-run-|camp-|lead-77|alloc-|asset-|seed-|fixcheck-|demo-)/.test(r.subjectId))
  if (mine.length) {
    await db.explanationRecord.deleteMany({ where: { id: { in: mine.map((r) => r.id) } } })
    console.log(`  ↺ cleared ${mine.length} prior rows`)
  }
  await db.auditLog.deleteMany({ where: { action: 'decision.explained' } })

  const ex = await seedExplanations(token)
  console.log(`  ✅ ${ex.created} explanations (${ex.violating} recorded as contract violations)`)
  if (ex.failures.length) {
    console.log(`  ⚠️  ${ex.failures.length} failures:`)
    for (const f of ex.failures.slice(0, 10)) console.log(`      - ${f}`)
  }

  const total = await db.explanationRecord.count()
  const compliant = await db.explanationRecord.count({ where: { contractCompliant: true } })
  console.log(`  📊 ledger: ${total} records, ${compliant} compliant (${total ? Math.round((compliant / total) * 100) : 0}%)`)

  await db.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Seed failed:', e)
  await db.$disconnect()
  process.exit(1)
})
