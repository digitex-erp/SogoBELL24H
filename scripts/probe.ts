import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'
const db = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:/app/workspace/96d80a5e-ec8f-4213-b941-201dbeb74ba2/prisma/dev.db' }) })
const u = await db.user.findFirst()
const h = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
const b = btoa(JSON.stringify({ sub: u!.id, role: u!.role, orgId: u!.organizationId, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+86400 }))
const T = `${h}.${b}.${btoa(h+'.'+b+'.s')}`
const PUB = 'https://96d80a5e-ec8f-4213-b941-201dbeb74ba2.preview.shogo.ai/api'
const LOC = 'http://localhost:3101/api'
const probe = async (label: string, base: string, mode: 'header' | 'query') => {
  const url = mode === 'query' ? `${base}/voice/overview?token=${encodeURIComponent(T)}` : `${base}/voice/overview`
  const r = await fetch(url, { headers: mode === 'header' ? { Authorization: `Bearer ${T}` } : {} })
  const body = await r.json().catch(() => ({}))
  console.log(`${label.padEnd(34)} → HTTP ${r.status} ${r.status === 200 ? `(callsToday=${body.kpis?.callsToday})` : `(${body.error ?? ''})`}`)
}
console.log('--- PUBLIC preview origin (what the browser uses) ---')
await probe('public + Authorization header', PUB, 'header')
await probe('public + ?token= query', PUB, 'query')
console.log('--- internal localhost (what curl used) ---')
await probe('localhost + Authorization header', LOC, 'header')
await probe('localhost + ?token= query', LOC, 'query')
await db.$disconnect()
