// Sprint 5D: Seed Enterprise SEO Center with rich demo data
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' })
const db = new PrismaClient({ adapter })

const USER_ID = 'cmrqval4m0026xrkyjfnkzny4'
const ORG_ID = 'cmrqval4r0027xrkyg02m638g'

async function main() {
  console.log('🎯 Seeding SEO Center data...')

  // ─── Keywords ───
  const keywords = [
    { keyword: 'textile manufacturer india', searchVolume: 18100, difficulty: 67, intent: 'commercial', position: 8, status: 'active', cluster: 'textiles', targetUrl: 'https://vyaparsethu.com/textiles', cpc: 2.4, competition: 0.82 },
    { keyword: 'cotton fabric wholesale', searchVolume: 12400, difficulty: 54, intent: 'transactional', position: 5, status: 'active', cluster: 'textiles', targetUrl: 'https://vyaparsethu.com/cotton', cpc: 3.1, competition: 0.75 },
    { keyword: 'silk saree online', searchVolume: 22200, difficulty: 72, intent: 'transactional', position: 14, status: 'active', cluster: 'silk', targetUrl: 'https://vyaparsethu.com/silk-sarees', cpc: 1.8, competition: 0.88 },
    { keyword: 'b2b textile marketplace', searchVolume: 4400, difficulty: 45, intent: 'navigational', position: 3, status: 'active', cluster: 'marketplace', targetUrl: 'https://vyaparsethu.com', cpc: 5.2, competition: 0.65 },
    { keyword: 'bulk fabric supplier', searchVolume: 6600, difficulty: 58, intent: 'commercial', position: 12, status: 'active', cluster: 'textiles', targetUrl: 'https://vyaparsethu.com/suppliers', cpc: 3.8, competition: 0.71 },
    { keyword: 'handloom products wholesale', searchVolume: 3200, difficulty: 38, intent: 'commercial', position: 7, status: 'active', cluster: 'handloom', targetUrl: 'https://vyaparsethu.com/handloom', cpc: 1.5, competition: 0.42 },
    { keyword: 'indian textile export', searchVolume: 8100, difficulty: 62, intent: 'informational', position: 21, status: 'active', cluster: 'export', targetUrl: 'https://vyaparsethu.com/export', cpc: 2.9, competition: 0.68 },
    { keyword: 'denim fabric supplier india', searchVolume: 5400, difficulty: 49, intent: 'commercial', position: 9, status: 'active', cluster: 'denim', targetUrl: 'https://vyaparsethu.com/denim', cpc: 2.7, competition: 0.59 },
    { keyword: 'fashion fabric wholesale mumbai', searchVolume: 2900, difficulty: 32, intent: 'commercial', position: 4, status: 'active', cluster: 'local', targetUrl: 'https://vyaparsethu.com/mumbai', cpc: 1.9, competition: 0.38 },
    { keyword: 'polyester fabric manufacturer', searchVolume: 9900, difficulty: 56, intent: 'commercial', position: 16, status: 'active', cluster: 'polyester', targetUrl: 'https://vyaparsethu.com/polyester', cpc: 2.1, competition: 0.64 },
    { keyword: 'textile industry trends 2026', searchVolume: 3600, difficulty: 41, intent: 'informational', position: 6, status: 'active', cluster: 'trends', cpc: 0.8, competition: 0.35 },
    { keyword: 'organic cotton fabric', searchVolume: 7200, difficulty: 52, intent: 'informational', position: 11, status: 'active', cluster: 'organic', cpc: 1.6, competition: 0.48 },
    { keyword: 'georgette fabric wholesale', searchVolume: 4800, difficulty: 44, intent: 'commercial', position: 8, status: 'active', cluster: 'fabric', cpc: 2.0, competition: 0.52 },
    { keyword: 'textile trade show india 2026', searchVolume: 1800, difficulty: 28, intent: 'informational', position: 2, status: 'active', cluster: 'events', cpc: 0.5, competition: 0.22 },
    { keyword: 'surat silk wholesale', searchVolume: 6200, difficulty: 47, intent: 'transactional', position: 10, status: 'active', cluster: 'silk', cpc: 2.3, competition: 0.56 },
  ]

  for (const k of keywords) {
    await db.seoKeyword.upsert({
      where: { id: `seed-kw-${k.keyword.slice(0, 20).replace(/\s/g, '-')}` },
      create: { id: `seed-kw-${k.keyword.slice(0, 20).replace(/\s/g, '-')}`, ...k, userId: USER_ID, orgId: ORG_ID, status: 'active', tags: `["${k.cluster}"]` },
      update: k,
    })
  }
  console.log(`  ✅ ${keywords.length} keywords`)

  // ─── Site Audits ───
  const audits = [
    {
      siteUrl: 'https://vyaparsethu.com', status: 'completed', score: 82, totalPages: 45, criticalIssues: 3, warnings: 12, notices: 8,
      issues: JSON.stringify([
        { severity: 'critical', title: 'Missing H1 tag on 3 pages', fix: 'Add unique H1 tags to each page', url: 'https://vyaparsethu.com/about' },
        { severity: 'critical', title: 'Slow page load on product pages (>3s)', fix: 'Optimize images and enable lazy loading', url: 'https://vyaparsethu.com/products' },
        { severity: 'critical', title: 'Missing alt text on 8 images', fix: 'Add descriptive alt text for accessibility and SEO', url: 'https://vyaparsethu.com/gallery' },
        { severity: 'high', title: 'Thin content on category pages (<300 words)', fix: 'Add unique descriptions to category pages', url: 'https://vyaparsethu.com/cotton' },
        { severity: 'medium', title: 'Missing canonical tags on paginated pages', fix: 'Add rel=canonical to paginated URLs', url: 'https://vyaparsethu.com/products?page=2' },
        { severity: 'low', title: 'Consider adding breadcrumb navigation', fix: 'Implement BreadcrumbList schema and visible breadcrumbs', url: 'https://vyaparsethu.com' },
      ]),
    },
    {
      siteUrl: 'https://samplinghub.com', status: 'completed', score: 68, totalPages: 22, criticalIssues: 5, warnings: 18, notices: 11,
      issues: JSON.stringify([
        { severity: 'critical', title: 'No XML sitemap found', fix: 'Create and submit XML sitemap to Google Search Console' },
        { severity: 'critical', title: 'Duplicate meta descriptions on 6 pages', fix: 'Write unique meta descriptions for each page' },
        { severity: 'critical', title: 'Mixed content (HTTP/HTTPS)', fix: 'Update all internal links to HTTPS' },
        { severity: 'high', title: 'Missing structured data', fix: 'Add Organization and Product schema' },
        { severity: 'medium', title: 'High DOM size (>1500 nodes)', fix: 'Simplify page structure and remove unnecessary elements' },
      ]),
    },
  ]

  for (const a of audits) {
    await db.seoSiteAudit.upsert({
      where: { id: `seed-audit-${a.siteUrl.replace(/https?:\/\//, '').replace(/\./g, '-')}` },
      create: { id: `seed-audit-${a.siteUrl.replace(/https?:\/\//, '').replace(/\./g, '-')}`, ...a, userId: USER_ID, orgId: ORG_ID },
      update: a,
    })
  }
  console.log(`  ✅ ${audits.length} site audits`)

  // ─── Meta Tags ───
  const metaTags = [
    { url: 'https://vyaparsethu.com', title: 'VyaparSethu — B2B Textile Marketplace | Buy & Sell Fabrics Online', description: 'India\'s largest B2B textile marketplace. Connect with verified suppliers for cotton, silk, polyester & handloom fabrics. Bulk orders welcome.', titleLength: 64, descLength: 156, score: 88, status: 'active' },
    { url: 'https://vyaparsethu.com/textiles', title: 'Textile Fabrics — Cotton, Silk, Polyester | VyaparSethu', description: 'Browse 5000+ textile fabrics from verified Indian manufacturers. Best wholesale prices on cotton, silk, polyester & blended fabrics.', titleLength: 53, descLength: 142, score: 82, status: 'active' },
    { url: 'https://vyaparsethu.com/suppliers', title: 'Verified Textile Suppliers & Manufacturers', description: 'Find trusted textile suppliers across India. Verified manufacturers with ratings, certifications, and minimum order details.', titleLength: 43, descLength: 128, score: 76, status: 'review' },
    { url: 'https://vyaparsethu.com/handloom', title: 'Handloom Products — Traditional Indian Textiles', description: 'Authentic handloom textiles from India. Support local artisans with premium handwoven fabrics, sarees, and home textiles.', titleLength: 47, descLength: 136, score: 79, status: 'active' },
    { url: 'https://samplinghub.com', title: 'SamplingHub — Product Sampling Platform', description: 'Request product samples from verified manufacturers worldwide. Fast delivery, quality assured.', titleLength: 44, descLength: 98, score: 65, status: 'needs_review' },
    { url: 'https://vyaparsethu.com/about', title: 'About', description: 'About us', titleLength: 5, descLength: 8, score: 22, status: 'needs_review' },
  ]

  for (const m of metaTags) {
    await db.seoMetaTag.upsert({
      where: { id: `seed-meta-${m.url.replace(/https?:\/\//, '').replace(/[\/\.]/g, '-').slice(0, 30)}` },
      create: { id: `seed-meta-${m.url.replace(/https?:\/\//, '').replace(/[\/\.]/g, '-').slice(0, 30)}`, ...m, ogTitle: m.title, ogDescription: m.description, ogImage: m.url + '/og-image.jpg', twitterCard: 'summary_large_image', canonical: m.url, userId: USER_ID, orgId: ORG_ID },
      update: m,
    })
  }
  console.log(`  ✅ ${metaTags.length} meta tags`)

  // ─── Backlinks ───
  const backlinks = [
    { sourceUrl: 'https://textileindustry.in/top-marketplaces', targetUrl: 'https://vyaparsethu.com', linkType: 'dofollow', authority: 72, anchorText: 'VyaparSethu marketplace', status: 'active', isToxic: false },
    { sourceUrl: 'https://exportimport.gov.in/directory/vyaparsethu', targetUrl: 'https://vyaparsethu.com', linkType: 'dofollow', authority: 85, anchorText: 'VyaparSethu', status: 'active', isToxic: false },
    { sourceUrl: 'https://indianexporters.com/textile', targetUrl: 'https://vyaparsethu.com/textiles', linkType: 'dofollow', authority: 58, anchorText: 'textile fabrics', status: 'active', isToxic: false },
    { sourceUrl: 'https://startupindia.gov.in/vyaparsethu', targetUrl: 'https://vyaparsethu.com', linkType: 'dofollow', authority: 91, anchorText: 'VyaparSethu B2B', status: 'active', isToxic: false },
    { sourceUrl: 'https://tradeindia.com/links', targetUrl: 'https://vyaparsethu.com', linkType: 'nofollow', authority: 45, anchorText: 'trade platform', status: 'active', isToxic: false },
    { sourceUrl: 'https://spammytextiles.ru/links', targetUrl: 'https://vyaparsethu.com', linkType: 'dofollow', authority: 12, anchorText: 'cheap fabric', status: 'active', isToxic: true },
    { sourceUrl: 'https://fashionuniverse.com/sustainable-textiles', targetUrl: 'https://vyaparsethu.com/handloom', linkType: 'dofollow', authority: 63, anchorText: 'handloom textiles', status: 'active', isToxic: false },
    { sourceUrl: 'https://mumbaitextileassociation.org/members', targetUrl: 'https://vyaparsethu.com', linkType: 'dofollow', authority: 68, anchorText: 'member page', status: 'active', isToxic: false },
    { sourceUrl: 'https://suratsilkboard.com/directory', targetUrl: 'https://vyaparsethu.com/silk-sarees', linkType: 'dofollow', authority: 51, anchorText: 'silk sarees', status: 'active', isToxic: false },
    { sourceUrl: 'https://deadlink.com/expired', targetUrl: 'https://vyaparsethu.com/old-page', linkType: 'dofollow', authority: 0, anchorText: 'old page', status: 'lost', isToxic: false },
  ]

  for (const b of backlinks) {
    await db.seoBacklink.upsert({
      where: { id: `seed-bl-${b.sourceUrl.replace(/https?:\/\//, '').slice(0, 25).replace(/\./g, '-')}` },
      create: { id: `seed-bl-${b.sourceUrl.replace(/https?:\/\//, '').slice(0, 25).replace(/\./g, '-')}`, ...b, sourceDomain: new URL(b.sourceUrl).hostname, userId: USER_ID, orgId: ORG_ID, firstSeenAt: new Date(), lastSeenAt: new Date() },
      update: b,
    })
  }
  console.log(`  ✅ ${backlinks.length} backlinks`)

  // ─── Schema Markup ───
  const schemas = [
    {
      url: 'https://vyaparsethu.com', schemaType: 'Organization', status: 'valid',
      jsonLd: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", "name": "VyaparSethu", "url": "https://vyaparsethu.com", "logo": "https://vyaparsethu.com/logo.png", "description": "India's largest B2B textile marketplace" }),
    },
    {
      url: 'https://vyaparsethu.com/suppliers', schemaType: 'LocalBusiness', status: 'valid',
      jsonLd: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", "name": "VyaparSethu", "address": { "@type": "PostalAddress", "addressLocality": "Mumbai", "addressRegion": "Maharashtra", "addressCountry": "IN" } }),
    },
    {
      url: 'https://vyaparsethu.com/faq', schemaType: 'FAQPage', status: 'valid',
      jsonLd: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "What is VyaparSethu?", "acceptedAnswer": { "@type": "Answer", "text": "VyaparSethu is India's largest B2B textile marketplace." } }] }),
    },
  ]

  for (const s of schemas) {
    await db.seoSchemaMarkup.upsert({
      where: { id: `seed-schema-${s.schemaType}-${s.url.replace(/https?:\/\//, '').slice(0, 15)}` },
      create: { id: `seed-schema-${s.schemaType}-${s.url.replace(/https?:\/\//, '').slice(0, 15)}`, ...s, userId: USER_ID, orgId: ORG_ID },
      update: s,
    })
  }
  console.log(`  ✅ ${schemas.length} schema markups`)

  // ─── Content Plans ───
  const plans = [
    { title: 'Top 10 Textile Markets in India 2026', type: 'blog_post', targetKeyword: 'textile markets india', cluster: 'textiles', searchVolume: 5400, status: 'published', priority: 1 },
    { title: 'Cotton vs Polyester: Complete Buyer Guide', type: 'blog_post', targetKeyword: 'cotton vs polyester', cluster: 'textiles', searchVolume: 8100, status: 'review', priority: 2 },
    { title: 'How to Source Fabrics from India (Guide)', type: 'how_to', targetKeyword: 'source fabrics india', cluster: 'sourcing', searchVolume: 3600, status: 'writing', priority: 2 },
    { title: 'Handloom Textiles: Preserving Tradition', type: 'blog_post', targetKeyword: 'handloom textiles india', cluster: 'handloom', searchVolume: 2900, status: 'outlined', priority: 3 },
    { title: 'Textile Export Compliance Guide', type: 'landing_page', targetKeyword: 'textile export compliance', cluster: 'export', searchVolume: 1800, status: 'draft', priority: 3 },
    { title: 'B2B Textile Marketplace FAQ', type: 'faq', targetKeyword: 'b2b textile marketplace', cluster: 'marketplace', searchVolume: 4400, status: 'published', priority: 1 },
  ]

  for (const p of plans) {
    await db.seoContentPlan.upsert({
      where: { id: `seed-plan-${p.title.slice(0, 20).replace(/\s/g, '-')}` },
      create: { id: `seed-plan-${p.title.slice(0, 20).replace(/\s/g, '-')}`, ...p, userId: USER_ID, orgId: ORG_ID },
      update: p,
    })
  }
  console.log(`  ✅ ${plans.length} content plans`)

  // ─── Competitors ───
  const competitors = [
    { domain: 'indiamart.com', name: 'IndiaMART', description: 'India\'s largest online B2B marketplace across industries', domainAuthority: 82, backlinks: 4200000, organicTraffic: 85000000, overlapScore: 72 },
    { domain: 'tradeindia.com', name: 'TradeIndia', description: 'B2B portal connecting Indian exporters with global buyers', domainAuthority: 68, backlinks: 1800000, organicTraffic: 12000000, overlapScore: 65 },
    { domain: 'textileinfomedia.com', name: 'Textile Infomedia', description: 'Indian textile industry directory and marketplace', domainAuthority: 45, backlinks: 340000, organicTraffic: 2100000, overlapScore: 48 },
    { domain: 'exportersindia.com', name: 'ExportersIndia', description: 'B2B marketplace for Indian exporters and global importers', domainAuthority: 71, backlinks: 2100000, organicTraffic: 9500000, overlapScore: 58 },
  ]

  for (const c of competitors) {
    await db.seoCompetitor.upsert({
      where: { id: `seed-comp-${c.domain.replace(/\./g, '-')}` },
      create: { id: `seed-comp-${c.domain.replace(/\./g, '-')}`, ...c, userId: USER_ID, orgId: ORG_ID },
      update: c,
    })
  }
  console.log(`  ✅ ${competitors.length} competitors`)

  // ─── Local Businesses ───
  const businesses = [
    { name: 'VyaparSethu HQ', address: '402 Textile Tower, MIDC', city: 'Mumbai', state: 'Maharashtra', country: 'India', postalCode: '400093', phone: '+91 22 4567 8900', email: 'info@vyaparsethu.com', website: 'https://vyaparsethu.com', category: 'B2B Textile Marketplace', napConsistent: true, rating: 4.5, reviews: 128 },
    { name: 'SamplingHub Office', address: '15/F Innovation Hub, HSR Layout', city: 'Bangalore', state: 'Karnataka', country: 'India', postalCode: '560102', phone: '+91 80 2345 6789', email: 'hello@samplinghub.com', website: 'https://samplinghub.com', category: 'Product Sampling Platform', napConsistent: true, rating: 4.2, reviews: 56 },
  ]

  for (const b of businesses) {
    await db.seoLocalBusiness.upsert({
      where: { id: `seed-local-${b.name.replace(/\s/g, '-').toLowerCase()}` },
      create: { id: `seed-local-${b.name.replace(/\s/g, '-').toLowerCase()}`, ...b, userId: USER_ID, orgId: ORG_ID, schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", "name": b.name, "address": { "@type": "PostalAddress", "streetAddress": b.address, "addressLocality": b.city, "addressRegion": b.state, "addressCountry": b.country } }) },
      update: b,
    })
  }
  console.log(`  ✅ ${businesses.length} local businesses`)

  // ─── Rank Tracking ───
  const rankings = [
    { keyword: 'textile manufacturer india', url: 'https://vyaparsethu.com', position: 8, prevPosition: 11, searchEngine: 'google', device: 'desktop' },
    { keyword: 'cotton fabric wholesale', url: 'https://vyaparsethu.com/cotton', position: 5, prevPosition: 7, searchEngine: 'google', device: 'desktop' },
    { keyword: 'silk saree online', url: 'https://vyaparsethu.com/silk-sarees', position: 14, prevPosition: 12, searchEngine: 'google', device: 'mobile' },
    { keyword: 'b2b textile marketplace', url: 'https://vyaparsethu.com', position: 3, prevPosition: 4, searchEngine: 'google', device: 'desktop' },
    { keyword: 'bulk fabric supplier', url: 'https://vyaparsethu.com/suppliers', position: 12, prevPosition: 15, searchEngine: 'google', device: 'desktop' },
    { keyword: 'handloom products wholesale', url: 'https://vyaparsethu.com/handloom', position: 7, prevPosition: 8, searchEngine: 'google', device: 'mobile' },
    { keyword: 'indian textile export', url: 'https://vyaparsethu.com/export', position: 21, prevPosition: 24, searchEngine: 'google', device: 'desktop' },
    { keyword: 'denim fabric supplier india', url: 'https://vyaparsethu.com/denim', position: 9, prevPosition: 13, searchEngine: 'google', device: 'desktop' },
    { keyword: 'fashion fabric wholesale mumbai', url: 'https://vyaparsethu.com/mumbai', position: 4, prevPosition: 5, searchEngine: 'google', device: 'mobile' },
    { keyword: 'polyester fabric manufacturer', url: 'https://vyaparsethu.com/polyester', position: 16, prevPosition: 18, searchEngine: 'bing', device: 'desktop' },
  ]

  for (const r of rankings) {
    await db.seoRankTracking.upsert({
      where: { id: `seed-rank-${r.keyword.slice(0, 15).replace(/\s/g, '-')}-${r.device}` },
      create: { id: `seed-rank-${r.keyword.slice(0, 15).replace(/\s/g, '-')}-${r.device}`, ...r, userId: USER_ID, orgId: ORG_ID, snapshotDate: new Date() },
      update: r,
    })
  }
  console.log(`  ✅ ${rankings.length} rank tracking records`)

  // ─── GEO Audits ───
  const geoAudits = [
    {
      url: 'https://vyaparsethu.com', score: 72, citationScore: 78, authorityScore: 65, structureScore: 82, evidenceScore: 70, freshnessScore: 68,
      contentAnalysis: JSON.stringify({ wordCount: 2450, avgSentenceLength: 18, hasCitations: true, hasNumbers: true, hasLists: true, hasTables: false, hasFAQ: true }),
      issues: JSON.stringify([
        { message: 'Add structured data for AI citation', fix: 'Implement FAQ and Organization schema', impact: 'high' },
        { message: 'Include more statistical data points', fix: 'Add industry statistics and market data', impact: 'medium' },
        { message: 'Add a comparison table', fix: 'Include comparison with competitor marketplaces', impact: 'medium' },
      ]),
    },
    {
      url: 'https://vyaparsethu.com/textiles', score: 65, citationScore: 68, authorityScore: 58, structureScore: 72, evidenceScore: 62, freshnessScore: 60,
      contentAnalysis: JSON.stringify({ wordCount: 1800, avgSentenceLength: 22, hasCitations: false, hasNumbers: true, hasLists: true, hasTables: false, hasFAQ: false }),
      issues: JSON.stringify([
        { message: 'No FAQ section for AI citation extraction', fix: 'Add FAQ section with common textile questions', impact: 'high' },
        { message: 'Missing citations and references', fix: 'Cite industry reports and standards', impact: 'high' },
        { message: 'No structured comparison data', fix: 'Add fabric comparison tables', impact: 'medium' },
      ]),
    },
  ]

  for (const g of geoAudits) {
    await db.seoGEOAudit.upsert({
      where: { id: `seed-geo-${g.url.replace(/https?:\/\//, '').replace(/[\/\.]/g, '-').slice(0, 25)}` },
      create: { id: `seed-geo-${g.url.replace(/https?:\/\//, '').replace(/[\/\.]/g, '-').slice(0, 25)}`, ...g, userId: USER_ID, orgId: ORG_ID },
      update: g,
    })
  }
  console.log(`  ✅ ${geoAudits.length} GEO audits`)

  // ─── Broken Links ───
  const brokenLinks = [
    { sourceUrl: 'https://vyaparsethu.com', targetUrl: 'https://vyaparsethu.com/old-blog', statusCode: 404, linkType: 'internal', anchorText: 'Old Blog', status: 'broken' },
    { sourceUrl: 'https://vyaparsethu.com/products', targetUrl: 'https://vyaparsethu.com/discontinued-item', statusCode: 404, linkType: 'internal', anchorText: 'Product', status: 'broken' },
    { sourceUrl: 'https://vyaparsethu.com/partners', targetUrl: 'https://old-partner-site.com', statusCode: 410, linkType: 'external', anchorText: 'Partner Site', status: 'broken' },
  ]

  for (const bl of brokenLinks) {
    await db.seoBrokenLink.upsert({
      where: { id: `seed-broken-${bl.sourceUrl.slice(0, 15).replace(/\//g, '-')}-${bl.statusCode}` },
      create: { id: `seed-broken-${bl.sourceUrl.slice(0, 15).replace(/\//g, '-')}-${bl.statusCode}`, ...bl, userId: USER_ID },
      update: bl,
    })
  }
  console.log(`  ✅ ${brokenLinks.length} broken links`)

  console.log('\n🎯 SEO Center seed complete!')
}

main().catch(console.error).finally(() => db.$disconnect())
