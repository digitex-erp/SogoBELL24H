// Sprint 6: Seed all modules with realistic demo data
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' })
const db = new PrismaClient({ adapter })

const USER_ID = 'cmrqval4m0026xrkyjfnkzny4' // digitex.studio@gmail.com
const ORG_ID = 'cmrqval4r0027xrkyg02m638g'

async function main() {
  console.log('🌱 Seeding Sprint 6 data...')

  // ─── Leads ───
  const leadData = [
    { name: 'Priya Sharma', email: 'priya@textileexpo.in', phone: '+91 98765 43210', company: 'TextileExpo India', status: 'qualified', source: 'Website', score: 85, value: 250000, tags: 'bulk,premium' },
    { name: 'Rajesh Patel', email: 'rajesh@fabrichub.com', phone: '+91 98765 43211', company: 'FabricHub', status: 'proposal', source: 'LinkedIn', score: 72, value: 150000, tags: 'export' },
    { name: 'Anita Desai', email: 'anita@silkstory.in', phone: '+91 98765 43212', company: 'Silk Story', status: 'negotiation', source: 'Referral', score: 90, value: 500000, tags: 'premium,recurring' },
    { name: 'Mohammed Khan', email: 'mohammed@globaltextile.com', phone: '+91 98765 43213', company: 'Global Textile Corp', status: 'new', source: 'Google Ads', score: 45, value: 100000, tags: 'new' },
    { name: 'Sunita Reddy', email: 'sunita@weaveworld.in', phone: '+91 98765 43214', company: 'Weave World', status: 'contacted', source: 'Trade Show', score: 60, value: 200000, tags: 'bulk' },
    { name: 'Amit Singhania', email: 'amit@craftlooms.com', phone: '+91 98765 43215', company: 'Craft Looms', status: 'won', source: 'Referral', score: 95, value: 750000, tags: 'premium,enterprise' },
    { name: 'Deepa Nair', email: 'deepa@keralatextiles.in', phone: '+91 98765 43216', company: 'Kerala Textiles', status: 'new', source: 'WhatsApp', score: 35, value: 80000, tags: 'new,local' },
    { name: 'Vikram Joshi', email: 'vikram@indianfabrics.co', phone: '+91 98765 43217', company: 'Indian Fabrics Co', status: 'qualified', source: 'Website', score: 78, value: 320000, tags: 'wholesale' },
    { name: 'Meera Iyer', email: 'meera@silkandsatin.com', phone: '+91 98765 43218', company: 'Silk & Satin', status: 'proposal', source: 'Trade Show', score: 68, value: 180000, tags: 'fashion' },
    { name: 'Arjun Mehta', email: 'arjun@textileking.in', phone: '+91 98765 43219', company: 'TextileKing', status: 'contacted', source: 'LinkedIn', score: 55, value: 120000, tags: 'startup' },
  ]

  for (const l of leadData) {
    await db.lead.upsert({ where: { id: `seed-lead-${l.email}` }, create: { id: `seed-lead-${l.email}`, ...l, userId: USER_ID, notes: `Demo lead from ${l.source}` }, update: l })
  }
  console.log(`  ✅ ${leadData.length} leads`)

  // ─── Deals ───
  const dealData = [
    { title: 'Bulk Cotton Fabric Order - TextileExpo', value: 250000, status: 'proposal', stage: 'proposal', probability: 60, company: 'TextileExpo India', contactName: 'Priya Sharma', contactEmail: 'priya@textileexpo.in', leadId: 'seed-lead-priya@textileexpo.in' },
    { title: 'Silk Collection Export - Silk Story', value: 500000, status: 'negotiation', stage: 'negotiation', probability: 80, company: 'Silk Story', contactName: 'Anita Desai', contactEmail: 'anita@silkstory.in', leadId: 'seed-lead-anita@silkstory.in' },
    { title: 'Annual Supply Contract - Craft Looms', value: 750000, status: 'closed_won', stage: 'closed', probability: 100, company: 'Craft Looms', contactName: 'Amit Singhania', contactEmail: 'amit@craftlooms.com', leadId: 'seed-lead-amit@craftlooms.com' },
    { title: 'Retail Partnership - FabricHub', value: 150000, status: 'prospect', stage: 'discovery', probability: 25, company: 'FabricHub', contactName: 'Rajesh Patel', contactEmail: 'rajesh@fabrichub.com', leadId: 'seed-lead-rajesh@fabrichub.com' },
    { title: 'Export Order - Indian Fabrics', value: 320000, status: 'proposal', stage: 'qualification', probability: 50, company: 'Indian Fabrics Co', contactName: 'Vikram Joshi', contactEmail: 'vikram@indianfabrics.co', leadId: 'seed-lead-vikram@indianfabrics.co' },
  ]

  for (const d of dealData) {
    await db.deal.upsert({ where: { id: `seed-deal-${d.title.slice(0, 20)}` }, create: { id: `seed-deal-${d.title.slice(0, 20)}`, ...d, userId: USER_ID, currency: 'INR', notes: 'Demo deal' }, update: d })
  }
  console.log(`  ✅ ${dealData.length} deals`)

  // ─── Campaigns ───
  const campData = [
    { name: 'Monsoon Textiles Campaign', status: 'active', objective: 'Lead Generation', budget: 50000, spent: 23400, impressions: 45200, clicks: 2340, conversions: 156, startDate: new Date('2026-07-01'), endDate: new Date('2026-07-31') },
    { name: 'Diwali Collection 2026', status: 'active', objective: 'Brand Awareness', budget: 40000, spent: 18700, impressions: 32100, clicks: 1890, conversions: 98, startDate: new Date('2026-07-10'), endDate: new Date('2026-08-15') },
    { name: 'Bulk B2B Outreach', status: 'active', objective: 'Sales', budget: 25000, spent: 8900, impressions: 12800, clicks: 567, conversions: 34, startDate: new Date('2026-07-05'), endDate: new Date('2026-08-05') },
    { name: 'Festive Saree Line', status: 'paused', objective: 'Sales', budget: 30000, spent: 15600, impressions: 28900, clicks: 1450, conversions: 72, startDate: new Date('2026-06-15'), endDate: new Date('2026-07-15') },
    { name: 'Summer Kurti Collection', status: 'completed', objective: 'Brand Awareness', budget: 35000, spent: 34200, impressions: 52300, clicks: 3120, conversions: 210, startDate: new Date('2026-05-01'), endDate: new Date('2026-06-30') },
    { name: 'Export Market Expansion', status: 'draft', objective: 'Lead Generation', budget: 60000, spent: 0, impressions: 0, clicks: 0, conversions: 0, startDate: new Date('2026-08-01'), endDate: new Date('2026-10-31') },
  ]

  for (const c of campData) {
    await db.campaign.upsert({ where: { id: `seed-camp-${c.name.slice(0, 15)}` }, create: { id: `seed-camp-${c.name.slice(0, 15)}`, ...c, userId: USER_ID }, update: c })
  }
  console.log(`  ✅ ${campData.length} campaigns`)

  // ─── Activities ───
  const actData = [
    { type: 'call', title: 'Discovery call with Priya', description: 'Discussed bulk fabric requirements', leadId: 'seed-lead-priya@textileexpo.in', completedAt: new Date('2026-07-15') },
    { type: 'email', title: 'Follow-up email to Anita', description: 'Sent silk collection catalog', leadId: 'seed-lead-anita@silkstory.in', completedAt: new Date('2026-07-16') },
    { type: 'meeting', title: 'Demo meeting with Amit', description: 'Product demo for Craft Looms', leadId: 'seed-lead-amit@craftlooms.com', completedAt: new Date('2026-07-17') },
    { type: 'task', title: 'Send proposal to Vikram', description: 'Prepare and send annual supply proposal', leadId: 'seed-lead-vikram@indianfabrics.co', scheduledAt: new Date('2026-07-20') },
    { type: 'note', title: 'Trade show follow-up', description: 'Met at Mumbai Textile Expo 2026', leadId: 'seed-lead-sunita@weaveworld.in', completedAt: new Date('2026-07-14') },
  ]

  for (const a of actData) {
    await db.activity.create({ data: { ...a, userId: USER_ID } })
  }
  console.log(`  ✅ ${actData.length} activities`)

  // ─── Suppliers ───
  const supplierData = [
    { name: 'Mumbai Textiles Pvt Ltd', location: 'Mumbai, Maharashtra', city: 'Mumbai', state: 'Maharashtra', rating: 4.5, productCount: 156, verified: true, responseTime: '< 1 hour', minOrder: '500 pieces', categories: '["cotton","silk","polyester"]', tags: 'premium,bulk' },
    { name: 'Surat Silk House', location: 'Surat, Gujarat', city: 'Surat', state: 'Gujarat', rating: 4.2, productCount: 89, verified: true, responseTime: 'Within 24 hours', minOrder: '100 meters', categories: '["silk","chiffon","georgette"]', tags: 'silk,specialist' },
    { name: 'Ludhiana Knitwear Co', location: 'Ludhiana, Punjab', city: 'Ludhiana', state: 'Punjab', rating: 3.8, productCount: 234, verified: false, responseTime: 'Within 24 hours', minOrder: '1000 pieces', categories: '["knitwear","jersey","fleece"]', tags: 'knitwear,wholesale' },
    { name: 'Bhiwandi Denim Works', location: 'Bhiwandi, Maharashtra', city: 'Bhiwandi', state: 'Maharashtra', rating: 4.0, productCount: 67, verified: true, responseTime: '< 1 hour', minOrder: '200 meters', categories: '["denim","cotton"]', tags: 'denim,specialist' },
    { name: 'Kanpur Leather & Textiles', location: 'Kanpur, UP', city: 'Kanpur', state: 'Uttar Pradesh', rating: 3.9, productCount: 112, verified: true, responseTime: 'Within 48 hours', minOrder: '50 pieces', categories: '["leather","canvas","nylon"]', tags: 'leather,premium' },
  ]

  for (const s of supplierData) {
    await db.supplier.upsert({ where: { id: `seed-sup-${s.name.slice(0, 15)}` }, create: { id: `seed-sup-${s.name.slice(0, 15)}`, ...s, userId: USER_ID, orgId: ORG_ID }, update: s })
  }
  console.log(`  ✅ ${supplierData.length} suppliers`)

  // ─── Buyers ───
  const buyerData = [
    { name: 'TextileHub International', location: 'Delhi', city: 'Delhi', totalOrders: 23, totalSpent: 450000, verified: true, industry: 'Retail', tags: 'bulk,regular' },
    { name: 'FashionFirst Retail', location: 'Bangalore', city: 'Bangalore', totalOrders: 12, totalSpent: 210000, verified: true, industry: 'Fashion Retail', tags: 'fashion,premium' },
    { name: 'Export Masters Ltd', location: 'Chennai', city: 'Chennai', totalOrders: 8, totalSpent: 180000, verified: true, industry: 'Export', tags: 'export,international' },
    { name: 'Silk Route Fashions', location: 'Hyderabad', city: 'Hyderabad', totalOrders: 15, totalSpent: 320000, verified: false, industry: 'Fashion', tags: 'silk,ethnic' },
    { name: 'Global Threads LLC', location: 'Mumbai', city: 'Mumbai', totalOrders: 5, totalSpent: 95000, verified: true, industry: 'Wholesale', tags: 'international,b2b' },
  ]

  for (const b of buyerData) {
    await db.buyer.upsert({ where: { id: `seed-buyer-${b.name.slice(0, 15)}` }, create: { id: `seed-buyer-${b.name.slice(0, 15)}`, ...b, userId: USER_ID, orgId: ORG_ID }, update: b })
  }
  console.log(`  ✅ ${buyerData.length} buyers`)

  // ─── RFQs ───
  const rfqData = [
    { title: 'Bulk Cotton Fabric Order', description: 'Premium quality cotton fabric for summer collection', category: 'Textiles', quantity: '10,000 meters', unit: 'meters', budget: 500000, status: 'open', priority: 1, deadline: new Date('2026-08-15'), buyerName: 'TextileHub International', tags: 'cotton,bulk' },
    { title: 'Silk Saree Collection', description: 'Handwoven silk sarees for festive season', category: 'Garments', quantity: '500 pieces', unit: 'pieces', budget: 750000, status: 'open', priority: 2, deadline: new Date('2026-08-20'), buyerName: 'FashionFirst Retail', tags: 'silk,handwoven,premium' },
    { title: 'Packaging Material Supply', description: 'Eco-friendly packaging for textile products', category: 'Packaging', quantity: '50,000 units', unit: 'units', budget: 200000, status: 'awarded', priority: 3, deadline: new Date('2026-07-30'), buyerName: 'Export Masters Ltd', tags: 'packaging,eco-friendly' },
    { title: 'Denim Fabric Bulk Order', description: 'Raw denim fabric for jeans manufacturing', category: 'Textiles', quantity: '5,000 meters', unit: 'meters', budget: 350000, status: 'open', priority: 2, deadline: new Date('2026-09-01'), buyerName: 'Global Threads LLC', tags: 'denim,bulk' },
    { title: 'Linen Summer Collection', description: 'Lightweight linen for summer apparel line', category: 'Textiles', quantity: '3,000 meters', unit: 'meters', budget: 280000, status: 'quoted', priority: 3, deadline: new Date('2026-08-30'), buyerName: 'Silk Route Fashions', tags: 'linen,summer' },
  ]

  for (const r of rfqData) {
    await db.rFQ.upsert({ where: { id: `seed-rfq-${r.title.slice(0, 15)}` }, create: { id: `seed-rfq-${r.title.slice(0, 15)}`, ...r, userId: USER_ID, orgId: ORG_ID }, update: r })
  }
  console.log(`  ✅ ${rfqData.length} RFQs`)

  // ─── Scheduled Posts ───
  const postData = [
    { title: 'Monsoon Collection Preview', content: 'Introducing our new monsoon textile range! 🌧️', type: 'social', platform: 'instagram', scheduledAt: new Date('2026-07-20T10:00:00'), status: 'scheduled' },
    { title: 'Diwali Sale Announcement', content: 'Up to 40% off on silk sarees this Diwali!', type: 'social', platform: 'facebook', scheduledAt: new Date('2026-07-22T14:00:00'), status: 'draft' },
    { title: 'Weekly Industry Newsletter', content: 'Textile market trends and updates', type: 'email', platform: 'email', scheduledAt: new Date('2026-07-21T09:00:00'), status: 'scheduled' },
    { title: 'Supplier Spotlight - Mumbai Textiles', content: 'Meet our trusted supplier partner', type: 'blog', platform: 'website', scheduledAt: new Date('2026-07-25T08:00:00'), status: 'draft' },
  ]

  for (const p of postData) {
    await db.scheduledPost.upsert({ where: { id: `seed-post-${p.title.slice(0, 15)}` }, create: { id: `seed-post-${p.title.slice(0, 15)}`, ...p, userId: USER_ID, orgId: ORG_ID }, update: p })
  }
  console.log(`  ✅ ${postData.length} scheduled posts`)

  // ─── Integrations ───
  const intData = [
    { name: 'Google Analytics', slug: 'google-analytics', type: 'oauth', provider: 'google', category: 'analytics', description: 'Website analytics and traffic insights', icon: '📊', status: 'connected' },
    { name: 'Facebook Business', slug: 'facebook-business', type: 'oauth', provider: 'facebook', category: 'social', description: 'Facebook & Instagram ad management', icon: '📘', status: 'disconnected' },
    { name: 'LinkedIn Sales Navigator', slug: 'linkedin-sales', type: 'oauth', provider: 'linkedin', category: 'crm', description: 'B2B lead generation and sales', icon: '💼', status: 'disconnected' },
    { name: 'WhatsApp Business', slug: 'whatsapp-business', type: 'api_key', provider: 'whatsapp', category: 'messaging', description: 'WhatsApp Business API for customer messaging', icon: '💬', status: 'connected' },
    { name: 'Razorpay', slug: 'razorpay', type: 'api_key', provider: 'razorpay', category: 'payments', description: 'Payment processing for Indian market', icon: '💳', status: 'disconnected' },
    { name: 'Mailchimp', slug: 'mailchimp', type: 'api_key', provider: 'mailchimp', category: 'email', description: 'Email marketing automation', icon: '📧', status: 'disconnected' },
  ]

  for (const i of intData) {
    await db.integration.upsert({ where: { slug: i.slug }, create: { ...i, userId: USER_ID, orgId: ORG_ID }, update: i })
  }
  console.log(`  ✅ ${intData.length} integrations`)

  console.log('\n🎉 Sprint 6 seed complete!')
}

main().catch(console.error).finally(() => db.$disconnect())
