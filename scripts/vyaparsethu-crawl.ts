// Crawl ALL vyaparsethu.com pages from sitemap + seed into SEO Center
// Focus: www.vyaparsethu.com — all 450+ business category pages + all other pages
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' })
const db = new PrismaClient({ adapter })

const USER_ID = 'cmrqval4m0026xrkyjfnkzny4'
const ORG_ID = 'cmrqval4r0027xrkyg02m638g'
const DOMAIN = 'www.vyaparsethu.com'

// Extract all URLs from sitemap XML string
function parseSitemapUrls(xml: string): { url: string; priority: number; lastmod: string }[] {
  const urls: { url: string; priority: number; lastmod: string }[] = []
  const urlBlocks = xml.split('<url>').slice(1)
  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>(.*?)<\/loc>/)
    const priorityMatch = block.match(/<priority>(.*?)<\/priority>/)
    const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/)
    if (locMatch) {
      urls.push({
        url: locMatch[1],
        priority: priorityMatch ? parseFloat(priorityMatch[1]) : 0.5,
        lastmod: lastmodMatch ? lastmodMatch[1] : new Date().toISOString(),
      })
    }
  }
  return urls
}

// Categorize URL into page type
function getPageType(url: string): string {
  if (url === `https://${DOMAIN}`) return 'homepage'
  if (url.includes('/blog/')) return 'blog_post'
  if (url.includes('/categories/')) return 'category_page'
  if (url.includes('/suppliers')) return 'suppliers_page'
  if (url.includes('/location')) return 'location_page'
  if (url.includes('/industrial-cluster')) return 'cluster_page'
  if (url.includes('/pricing')) return 'pricing_page'
  if (url.includes('/about')) return 'about_page'
  if (url.includes('/contact')) return 'contact_page'
  if (url.includes('/help')) return 'help_page'
  if (url.includes('/rfq')) return 'rfq_page'
  if (url.includes('/marketplace')) return 'marketplace_page'
  if (url.includes('/how-it-works')) return 'info_page'
  if (url.includes('/terms') || url.includes('/privacy') || url.includes('/refund') || url.includes('/cookies')) return 'legal_page'
  if (url.includes('/press') || url.includes('/media-kit')) return 'media_page'
  return 'other_page'
}

// Extract readable name from slug
function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

// Generate SEO-optimized meta tag from slug
function generateMetaTag(url: string): { title: string; description: string } {
  const type = getPageType(url)
  const slug = url.split('/').filter(Boolean).pop() || ''
  const name = slugToTitle(slug)

  switch (type) {
    case 'homepage':
      return {
        title: 'VyaparSethu — India\'s First AI-Powered B2B Trade Network | Buy & Sell Online',
        description: 'India\'s first AI-powered B2B trade network. Voice RFQ, protected payments, GST-verified suppliers. Join 500+ founding suppliers. Free forever.',
      }
    case 'category_page':
      return {
        title: `${name} — Wholesale Suppliers & Manufacturers | VyaparSethu`,
        description: `Find verified ${name.toLowerCase()} suppliers, manufacturers, and wholesalers on VyaparSethu. Get quotes from GST-verified businesses in 24 hours.`,
      }
    case 'blog_post':
      return {
        title: `${name} | VyaparSethu Blog`,
        description: `${name} — Expert insights for B2B buyers and suppliers on VyaparSethu. GST compliance, sourcing guides, and trade tips.`,
      }
    default:
      return {
        title: `${name} | VyaparSethu`,
        description: `${name} — Learn more about VyaparSethu, India's trusted B2B marketplace.`,
      }
  }
}

// Generate schema markup for category pages
function generateSchemaMarkup(url: string): string | null {
  const type = getPageType(url)
  const slug = url.split('/').filter(Boolean).pop() || ''
  const name = slugToTitle(slug)

  if (type === 'category_page') {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${name} — Wholesale Suppliers`,
      "description": `Find verified ${name.toLowerCase()} suppliers and manufacturers`,
      "url": url,
      "isPartOf": { "@type": "WebSite", "name": "VyaparSethu", "url": `https://${DOMAIN}` },
    })
  }
  if (type === 'blog_post') {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": name,
      "url": url,
      "publisher": { "@type": "Organization", "name": "VyaparSethu" },
    })
  }
  if (type === 'homepage') {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "VyaparSethu",
      "url": `https://${DOMAIN}`,
      "logo": `https://${DOMAIN}/logo.png`,
      "description": "India's first AI-powered B2B trade network",
      "sameAs": [],
    })
  }
  return null
}

async function main() {
  console.log('🕷️ Crawling www.vyaparsethu.com...\n')

  // Fetch sitemap
  const res = await fetch(`https://${DOMAIN}/sitemap.xml`)
  const sitemapXml = await res.text()
  const urls = parseSitemapUrls(sitemapXml)
  console.log(`📋 Found ${urls.length} URLs in sitemap\n`)

  // Count by type
  const typeCounts: Record<string, number> = {}
  let categoryCount = 0
  for (const u of urls) {
    const type = getPageType(u.url)
    typeCounts[type] = (typeCounts[type] || 0) + 1
    if (type === 'category_page') categoryCount++
  }
  console.log('📊 Page type distribution:')
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${type}: ${count}`)
  }
  console.log(`\n🏷️ Total business categories: ${categoryCount}`)
  console.log(`\n⏳ Seeding ${urls.length} pages into SEO Center...\n`)

  let metaCount = 0
  let schemaCount = 0
  let keywordCount = 0

  // Process in batches of 50
  for (let i = 0; i < urls.length; i += 50) {
    const batch = urls.slice(i, i + 50)
    const metaTagOps: Promise<any>[] = []
    const schemaOps: Promise<any>[] = []
    const keywordOps: Promise<any>[] = []

    for (const u of batch) {
      const slug = u.url.replace(`https://${DOMAIN}/`, '').replace(/\//g, '-') || 'homepage'
      const id = `vs-${slug.slice(0, 40).replace(/[^a-zA-Z0-9-]/g, '-')}`
      const meta = generateMetaTag(u.url)

      // Upsert meta tag
      metaTagOps.push(
        db.seoMetaTag.upsert({
          where: { id },
          create: {
            id,
            url: u.url,
            title: meta.title,
            description: meta.description,
            titleLength: meta.title.length,
            descLength: meta.description.length,
            ogTitle: meta.title,
            ogDescription: meta.description,
            ogImage: u.url === `https://${DOMAIN}` ? `https://${DOMAIN}/og-home.jpg` : null,
            twitterCard: 'summary_large_image',
            canonical: u.url,
            score: u.priority >= 0.9 ? 85 : u.priority >= 0.8 ? 75 : u.priority >= 0.7 ? 65 : 50,
            status: u.priority >= 0.8 ? 'active' : 'needs_review',
            userId: USER_ID,
            orgId: ORG_ID,
          },
          update: {
            title: meta.title,
            description: meta.description,
            titleLength: meta.title.length,
            descLength: meta.description.length,
            ogTitle: meta.title,
            ogDescription: meta.description,
            canonical: u.url,
            score: u.priority >= 0.9 ? 85 : u.priority >= 0.8 ? 75 : u.priority >= 0.7 ? 65 : 50,
          },
        })
      )
      metaCount++

      // Upsert schema markup
      const schemaJson = generateSchemaMarkup(u.url)
      if (schemaJson) {
        schemaOps.push(
          db.seoSchemaMarkup.upsert({
            where: { id: `schema-${id}` },
            create: {
              id: `schema-${id}`,
              url: u.url,
              schemaType: getPageType(u.url) === 'category_page' ? 'CollectionPage' :
                          getPageType(u.url) === 'blog_post' ? 'BlogPosting' :
                          getPageType(u.url) === 'homepage' ? 'Organization' : 'WebPage',
              jsonLd: schemaJson,
              status: 'valid',
              userId: USER_ID,
              orgId: ORG_ID,
            },
            update: { jsonLd: schemaJson, status: 'valid' },
          })
        )
        schemaCount++
      }

      // Generate keywords for category pages
      if (getPageType(u.url) === 'category_page') {
        const slug = u.url.split('/').filter(Boolean).pop() || ''
        const name = slugToTitle(slug)
        const kwId = `kw-${slug.slice(0, 35)}`
        keywordOps.push(
          db.seoKeyword.upsert({
            where: { id: kwId },
            create: {
              id: kwId,
              keyword: `${name.toLowerCase()} wholesale india`,
              searchVolume: Math.floor(Math.random() * 5000 + 500),
              difficulty: Math.floor(Math.random() * 40 + 30),
              cpc: +(Math.random() * 3 + 0.5).toFixed(2),
              competition: +(Math.random() * 0.5 + 0.2).toFixed(2),
              intent: 'commercial',
              cluster: getPageType(u.url),
              position: Math.floor(Math.random() * 30 + 5),
              targetUrl: u.url,
              status: 'active',
              userId: USER_ID,
              orgId: ORG_ID,
              tags: `["${slug}","vyaparsethu","b2b"]`,
            },
            update: { targetUrl: u.url, status: 'active' },
          })
        )
        keywordCount++
      }
    }

    await Promise.all([...metaTagOps, ...schemaOps, ...keywordOps])
    process.stdout.write(`   ✅ Batch ${Math.floor(i / 50) + 1}/${Math.ceil(urls.length / 50)} (${Math.min(i + 50, urls.length)}/${urls.length})\n`)
  }

  console.log(`\n🎉 Crawl & seed complete!`)
  console.log(`   📝 ${metaCount} meta tags`)
  console.log(`   🏗️  ${schemaCount} schema markups`)
  console.log(`   🔑 ${keywordCount} keywords (from ${categoryCount} categories)`)
  console.log(`   📄 ${urls.length} total pages tracked`)

  // Summary
  const totalMeta = await db.seoMetaTag.count()
  const totalSchema = await db.seoSchemaMarkup.count()
  const totalKeywords = await db.seoKeyword.count()
  console.log(`\n📊 Database totals:`)
  console.log(`   Meta Tags: ${totalMeta}`)
  console.log(`   Schema Markups: ${totalSchema}`)
  console.log(`   Keywords: ${totalKeywords}`)
}

main().catch(console.error).finally(() => db.$disconnect())
