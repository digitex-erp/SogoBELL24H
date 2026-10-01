import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'
const db = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:/app/workspace/96d80a5e-ec8f-4213-b941-201dbeb74ba2/prisma/dev.db' }) })
const u = await db.user.findFirst()
const h = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
const b = btoa(JSON.stringify({ sub: u!.id, role: u!.role, orgId: u!.organizationId, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+86400 }))
const T = `${h}.${b}.${btoa(h+'.'+b+'.s')}`
const PUB = 'https://96d80a5e-ec8f-4213-b941-201dbeb74ba2.preview.shogo.ai/api'

// exactly the paths the pages request, via the SAME transport the kit now uses
const paths = ['/voice/overview','/voice/hub','/voice/engine','/voice/agents','/voice/calls?intent=RFQ%20Follow-up&limit=25',
  '/voice/campaigns','/voice/live','/voice/queue','/voice/history','/voice/scripts','/voice/flow','/voice/receptionist',
  '/voice/architecture','/voice/providers','/voice/voices','/voice/numbers','/voice/escalations','/voice/automation',
  '/voice/analytics','/voice/settings','/voice/policies']

let pass = 0, fail = 0
for (const p of paths) {
  const url = `${PUB}${p}${p.includes('?') ? '&' : '?'}token=${encodeURIComponent(T)}`
  const r = await fetch(url)
  const body = await r.json().catch(() => ({}))
  const ok = r.status === 200 && !body.error
  ok ? pass++ : fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(r.status).padEnd(4)} ${p.padEnd(42)} keys=${Object.keys(body).slice(0,6).join(',') || (body.error ?? '')}`)
}
console.log(`\n${pass}/${paths.length} page endpoints OK via public origin + query token`)
await db.$disconnect()
