/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Seed and Mock Data for Bell24h-OS Enterprise SEO Center
 */

import {
  SEOKeyword,
  SiteAuditReport,
  PageAnalysisResult,
  MetaTagItem,
  SchemaItem,
  BacklinkItem,
  GEOCitation,
  CompetitorGap,
  LocalHubSEO,
  RedirectRule
} from "../types/seo";

export const INITIAL_KEYWORDS: SEOKeyword[] = [
  {
    id: "kw-1",
    keyword: "textile manufacturer india",
    volume: 18500,
    difficulty: 54,
    cpc: 2.45,
    intent: "commercial",
    position: 4,
    prevPosition: 6,
    url: "/marketplace/textiles",
    cluster: "Textile Sourcing",
    tags: ["High Value", "Export"],
    isTracked: true,
    history: [8, 7, 6, 6, 4]
  },
  {
    id: "kw-2",
    keyword: "cotton fabric wholesale bulk",
    volume: 24200,
    difficulty: 62,
    cpc: 3.10,
    intent: "transactional",
    position: 3,
    prevPosition: 5,
    url: "/marketplace/cotton",
    cluster: "Textile Sourcing",
    tags: ["High Volume", "Core"],
    isTracked: true,
    history: [9, 8, 6, 5, 3]
  },
  {
    id: "kw-3",
    keyword: "surat synthetic silk exporter",
    volume: 6800,
    difficulty: 38,
    cpc: 1.85,
    intent: "commercial",
    position: 2,
    prevPosition: 2,
    url: "/suppliers/surat-silk",
    cluster: "Regional Hubs",
    tags: ["Regional", "High Margin"],
    isTracked: true,
    history: [4, 3, 3, 2, 2]
  },
  {
    id: "kw-4",
    keyword: "tirupur combed cotton knitwear",
    volume: 9400,
    difficulty: 42,
    cpc: 2.20,
    intent: "transactional",
    position: 1,
    prevPosition: 3,
    url: "/suppliers/tirupur-knits",
    cluster: "Regional Hubs",
    tags: ["Top Rank", "Garments"],
    isTracked: true,
    history: [5, 4, 3, 2, 1]
  },
  {
    id: "kw-5",
    keyword: "cross border textile escrow payment",
    volume: 3200,
    difficulty: 29,
    cpc: 4.50,
    intent: "transactional",
    position: 2,
    prevPosition: 4,
    url: "/trust-escrow",
    cluster: "Trade Finance",
    tags: ["Fintech", "Moat"],
    isTracked: true,
    history: [7, 6, 5, 4, 2]
  },
  {
    id: "kw-6",
    keyword: "b2b textile procurement marketplace",
    volume: 12100,
    difficulty: 58,
    cpc: 2.80,
    intent: "commercial",
    position: 7,
    prevPosition: 9,
    url: "/marketplace",
    cluster: "Marketplace",
    tags: ["Brand", "Platform"],
    isTracked: true,
    history: [14, 12, 11, 9, 7]
  },
  {
    id: "kw-7",
    keyword: "incoterms 2020 textile export guide",
    volume: 8900,
    difficulty: 35,
    cpc: 1.10,
    intent: "informational",
    position: 5,
    prevPosition: 8,
    url: "/knowledge-base/incoterms",
    cluster: "Export Knowledge",
    tags: ["Inbound", "SEO Content"],
    isTracked: true,
    history: [12, 10, 8, 6, 5]
  },
  {
    id: "kw-8",
    keyword: "how to verify indian garment supplier",
    volume: 4500,
    difficulty: 24,
    cpc: 1.60,
    intent: "informational",
    position: 3,
    prevPosition: 4,
    url: "/knowledge-base/supplier-audit",
    cluster: "Export Knowledge",
    tags: ["Trust Engine", "Inbound"],
    isTracked: true,
    history: [6, 6, 5, 4, 3]
  }
];

export const INITIAL_AUDIT_REPORT: SiteAuditReport = {
  id: "audit-2026-09",
  healthScore: 88,
  crawledPages: 148,
  totalPages: 162,
  criticalCount: 2,
  warningCount: 5,
  noticeCount: 7,
  coreWebVitals: {
    lcp: 1.84, // seconds (<2.5s Good)
    fid: 14, // ms (<100ms Good)
    cls: 0.038 // (<0.1 Good)
  },
  statusCodes: {
    code200: 139,
    code301: 6,
    code404: 2,
    code500: 1
  },
  lastAuditDate: new Date().toISOString(),
  issues: [
    {
      id: "iss-1",
      severity: "critical",
      category: "indexing",
      title: "Broken 404 links detected in catalog taxonomy",
      description: "2 catalog category URLs returning HTTP 404 from supplier directory footer navigation.",
      affectedUrl: "/marketplace/categories/defunct-polyester-mesh",
      recommendation: "Update links to active category `/marketplace/synthetic-fabrics` or add 301 redirect.",
      status: "open"
    },
    {
      id: "iss-2",
      severity: "critical",
      category: "indexing",
      title: "Conflicting canonical tag in RFQ submission template",
      description: "Canonical tag points to non-HTTPS staging subdomain on RFQ quick quote view.",
      affectedUrl: "/rfqs/new?category=cotton",
      recommendation: "Enforce absolute canonical pointing to `https://bell24h.com/rfqs/new`.",
      status: "open"
    },
    {
      id: "iss-3",
      severity: "warning",
      category: "content",
      title: "Missing meta description on high-traffic supplier pages",
      description: "3 supplier factory profile pages are missing meta descriptions, causing search engines to pull arbitrary fallback text.",
      affectedUrl: "/suppliers/surat-silk",
      recommendation: "Add 150-160 character description emphasizing factory capacity, certifications (OEKO-TEX, GOTS), and MOQ.",
      status: "open"
    },
    {
      id: "iss-4",
      severity: "warning",
      category: "performance",
      title: "Uncompressed WebP hero banner causing LCP delay",
      description: "Hero banner image size is 1.8MB, increasing Largest Contentful Paint to 2.1s on 4G connections.",
      affectedUrl: "/marketplace",
      recommendation: "Compress image asset to <180KB with responsive `<picture>` `srcset` for mobile and desktop.",
      status: "open"
    },
    {
      id: "iss-5",
      severity: "warning",
      category: "schema",
      title: "Product schema missing mandatory priceCurrency attribute",
      description: "Google Rich Results validator flagged missing `priceCurrency` on wholesale catalog items.",
      affectedUrl: "/marketplace/fabrics/combed-cotton-40s",
      recommendation: "Inject `priceCurrency: 'INR'` or `'USD'` inside Organization and Product schema JSON-LD.",
      status: "open"
    },
    {
      id: "iss-6",
      severity: "notice",
      category: "links",
      title: "Internal redirect chain (2 hops) on legacy blog routes",
      description: "Request to `/blog/textiles` redirects to `/insights/textiles` which redirects to `/knowledge-base/textiles`.",
      affectedUrl: "/blog/textiles",
      recommendation: "Point direct links to terminal URL `/knowledge-base/textiles` to preserve crawl budget.",
      status: "open"
    }
  ]
};

export const INITIAL_META_TAGS: MetaTagItem[] = [
  {
    id: "meta-1",
    path: "/",
    title: "Bell24h-OS · Global B2B Textile & Cross-Border Trade Platform",
    description: "Connect verified Indian textile manufacturers with global buyers. Source combed cotton, Surat silks, handlooms with verified escrow & fast RFQ matching.",
    canonical: "https://bell24h.com/",
    ogTitle: "Bell24h-OS · Enterprise B2B Textile Platform",
    ogDescription: "Source high-grade yarn, fabrics, and apparel directly from certified mills.",
    status: "optimized",
    lastUpdated: "2026-09-14"
  },
  {
    id: "meta-2",
    path: "/marketplace",
    title: "B2B Textile Marketplace · Verified Mills & Wholesale Fabric Catalog",
    description: "Browse 50,000+ verified textile listings. Organic cotton, synthetic filaments, knitwear, and denim with mill-direct pricing and LC escrow protection.",
    canonical: "https://bell24h.com/marketplace",
    status: "optimized",
    lastUpdated: "2026-09-15"
  },
  {
    id: "meta-3",
    path: "/rfqs",
    title: "Request for Quotation (RFQ) · Instant B2B Supplier Matching",
    description: "Submit your export inquiry. Get competitive FOB/CIF quotations within 24 hours from ISO & GOTS certified textile manufacturers across India.",
    canonical: "https://bell24h.com/rfqs",
    status: "needs_review",
    lastUpdated: "2026-09-10"
  },
  {
    id: "meta-4",
    path: "/trust-escrow",
    title: "VyaparSethu Trade Escrow & Risk Engine · Safe Cross-Border Payments",
    description: "Protect international trade with milestone-based smart escrow. Zero payment fraud, verified inspection handoffs, and instant dispute resolution.",
    canonical: "https://bell24h.com/trust-escrow",
    status: "optimized",
    lastUpdated: "2026-09-16"
  }
];

export const INITIAL_SCHEMAS: SchemaItem[] = [
  {
    id: "sch-1",
    type: "Organization",
    name: "Bell24h Global Trade Enterprise",
    pageUrl: "/",
    jsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Bell24h-OS / VyaparSethu",
        url: "https://bell24h.com",
        logo: "https://bell24h.com/logo.png",
        sameAs: [
          "https://linkedin.com/company/bell24h",
          "https://twitter.com/bell24h_os"
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-22-6800-2424",
          contactType: "customer service",
          areaServed: "Worldwide",
          availableLanguage: ["English", "Hindi", "Gujarati", "Tamil"]
        }
      },
      null,
      2
    ),
    isValid: true,
    updatedAt: "2026-09-12"
  },
  {
    id: "sch-2",
    type: "Product",
    name: "Tirupur 40s Combed Cotton Yarn (15,000kg MOQ)",
    pageUrl: "/marketplace/cotton/40s-combed",
    jsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Tirupur 40s Combed Cotton Yarn",
        description: "100% Ring Spun combed cotton yarn for high-speed circular knitting machines. Ne 40/1 count, CSP > 3100.",
        sku: "VS-YARN-40S-CMB",
        brand: {
          "@type": "Brand",
          name: "VyaparSethu Verified Mills"
        },
        offers: {
          "@type": "Offer",
          price: "295.00",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Tirupur Prime Spinners Consortium"
          }
        }
      },
      null,
      2
    ),
    isValid: true,
    updatedAt: "2026-09-14"
  },
  {
    id: "sch-3",
    type: "FAQPage",
    name: "Cross-Border Textile Trade FAQ",
    pageUrl: "/knowledge-base/faq",
    jsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does the VyaparSethu Escrow protect international textile buyers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Funds are deposited into an RBI-regulated escrow account upon order confirmation and only disbursed to the manufacturer once SGS or Intertek completes pre-shipment quality verification."
            }
          },
          {
            "@type": "Question",
            name: "What are the standard MOQs for Surat synthetic fabrics?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Standard export minimum order quantity starts from 3,000 meters per design/colorway with customized lab-dips delivered within 5 business days."
            }
          }
        ]
      },
      null,
      2
    ),
    isValid: true,
    updatedAt: "2026-09-15"
  }
];

export const INITIAL_BACKLINKS: BacklinkItem[] = [
  {
    id: "bl-1",
    sourceUrl: "https://www.fibre2fashion.com/industry-article/indian-textile-export-boom-2026",
    sourceDomain: "fibre2fashion.com",
    targetUrl: "https://bell24h.com/marketplace",
    anchorText: "Bell24h cross-border digital textile platform",
    domainAuthority: 74,
    pageAuthority: 58,
    isDoFollow: true,
    isToxic: false,
    firstSeen: "2026-07-12",
    status: "active"
  },
  {
    id: "bl-2",
    sourceUrl: "https://www.indiantradeportal.in/resources/verified-yarn-consortiums",
    sourceDomain: "indiantradeportal.in",
    targetUrl: "https://bell24h.com/suppliers/tirupur-knits",
    anchorText: "VyaparSethu verified suppliers",
    domainAuthority: 82,
    pageAuthority: 64,
    isDoFollow: true,
    isToxic: false,
    firstSeen: "2026-06-20",
    status: "active"
  },
  {
    id: "bl-3",
    sourceUrl: "https://apparelresources.com/technology-features/ai-supply-chain-textiles/",
    sourceDomain: "apparelresources.com",
    targetUrl: "https://bell24h.com/ai-router",
    anchorText: "Bell24h-OS AI Router infrastructure",
    domainAuthority: 68,
    pageAuthority: 51,
    isDoFollow: true,
    isToxic: false,
    firstSeen: "2026-08-04",
    status: "active"
  },
  {
    id: "bl-4",
    sourceUrl: "https://textileworld.com/news/2026/08/sustainable-organic-cotton-exports/",
    sourceDomain: "textileworld.com",
    targetUrl: "https://bell24h.com/marketplace/cotton",
    anchorText: "certified organic cotton exporters",
    domainAuthority: 71,
    pageAuthority: 55,
    isDoFollow: true,
    isToxic: false,
    firstSeen: "2026-08-19",
    status: "active"
  },
  {
    id: "bl-5",
    sourceUrl: "https://www.exportersindia.com/guides/b2b-trade-escrow-security",
    sourceDomain: "exportersindia.com",
    targetUrl: "https://bell24h.com/trust-escrow",
    anchorText: "escrow ledger architecture",
    domainAuthority: 69,
    pageAuthority: 48,
    isDoFollow: false,
    isToxic: false,
    firstSeen: "2026-08-30",
    status: "active"
  }
];

export const INITIAL_GEO_CITATIONS: GEOCitation[] = [
  {
    id: "geo-1",
    query: "Who are the best B2B platforms for sourcing Indian combed cotton yarn?",
    engine: "ChatGPT",
    isCited: true,
    rank: 2,
    citedUrl: "https://bell24h.com/marketplace/cotton",
    snippet: "Bell24h (VyaparSethu) is recognized as a modern B2B platform connecting global apparel buyers with verified mills in Tirupur and Coimbatore.",
    sentiment: "positive",
    lastChecked: "2026-09-16"
  },
  {
    id: "geo-2",
    query: "How to safely import Surat synthetic fabrics with escrow protection?",
    engine: "Perplexity",
    isCited: true,
    rank: 1,
    citedUrl: "https://bell24h.com/trust-escrow",
    snippet: "According to Bell24h-OS Trade Escrow documentation, cross-border payments are held in regulated nodal accounts with pre-shipment inspection verification.",
    sentiment: "positive",
    lastChecked: "2026-09-17"
  },
  {
    id: "geo-3",
    query: "List top Indian textile export marketplaces with instant RFQ matching",
    engine: "Google AI",
    isCited: true,
    rank: 3,
    citedUrl: "https://bell24h.com/rfqs",
    snippet: "Key platforms include IndiaMART, TradeIndia, and Bell24h, with the latter featuring automated RFQ dispatch and Incoterms 2020 calculation.",
    sentiment: "positive",
    lastChecked: "2026-09-15"
  },
  {
    id: "geo-4",
    query: "What platforms verify GOTS certified textile manufacturers in India?",
    engine: "Gemini",
    isCited: true,
    rank: 2,
    citedUrl: "https://bell24h.com/suppliers",
    snippet: "VyaparSethu maintains on-ground factory compliance audits verifying GOTS, OEKO-TEX Standard 100, and ZDHC certifications for textile mills.",
    sentiment: "positive",
    lastChecked: "2026-09-16"
  },
  {
    id: "geo-5",
    query: "Best wholesale textile manufacturers in Ludhiana for wool and blended knitwear",
    engine: "Claude",
    isCited: false,
    rank: 0,
    citedUrl: "",
    snippet: "Mentioned traditional Ludhiana hosiery associations, but Bell24h regional page was not cited in the primary synthesis.",
    sentiment: "neutral",
    lastChecked: "2026-09-14"
  }
];

export const INITIAL_COMPETITOR_GAPS: CompetitorGap[] = [
  {
    id: "gap-1",
    keyword: "denim fabric wholesale direct from mill",
    volume: 14200,
    difficulty: 49,
    ourPosition: 24,
    competitors: {
      "indiamart.com": 2,
      "alibaba.com": 1,
      "fibre2fashion.com": 6
    },
    opportunityScore: 92
  },
  {
    id: "gap-2",
    keyword: "recycled polyester staple fiber exporter",
    volume: 8600,
    difficulty: 34,
    ourPosition: 38,
    competitors: {
      "indiamart.com": 4,
      "alibaba.com": 2,
      "fibre2fashion.com": 8
    },
    opportunityScore: 88
  },
  {
    id: "gap-3",
    keyword: "banarasi silk saree manufacturer wholesale",
    volume: 28000,
    difficulty: 58,
    ourPosition: 19,
    competitors: {
      "indiamart.com": 1,
      "alibaba.com": 7,
      "fibre2fashion.com": 12
    },
    opportunityScore: 84
  },
  {
    id: "gap-4",
    keyword: "linen yarn supplier ahmedabad",
    volume: 5400,
    difficulty: 27,
    ourPosition: null,
    competitors: {
      "indiamart.com": 3,
      "fibre2fashion.com": 5
    },
    opportunityScore: 79
  }
];

export const INITIAL_LOCAL_HUBS: LocalHubSEO[] = [
  {
    id: "hub-1",
    city: "Surat",
    state: "Gujarat",
    gmbStatus: "verified",
    napConsistency: 98,
    citationsCount: 42,
    topKeywords: [
      { keyword: "surat synthetic silk exporter", rank: 2 },
      { keyword: "textile wholesale ring road surat", rank: 4 }
    ]
  },
  {
    id: "hub-2",
    city: "Tirupur",
    state: "Tamil Nadu",
    gmbStatus: "verified",
    napConsistency: 96,
    citationsCount: 38,
    topKeywords: [
      { keyword: "tirupur knitwear manufacturers export", rank: 1 },
      { keyword: "combed cotton 40s tirupur mill direct", rank: 3 }
    ]
  },
  {
    id: "hub-3",
    city: "Ahmedabad",
    state: "Gujarat",
    gmbStatus: "verified",
    napConsistency: 92,
    citationsCount: 29,
    topKeywords: [
      { keyword: "ahmedabad cotton denim mills", rank: 5 },
      { keyword: "grey fabric wholesale ahmedabad", rank: 4 }
    ]
  },
  {
    id: "hub-4",
    city: "Mumbai",
    state: "Maharashtra",
    gmbStatus: "verified",
    napConsistency: 94,
    citationsCount: 56,
    topKeywords: [
      { keyword: "textile export headquarters mumbai", rank: 3 },
      { keyword: "b2b trade escrow solutions mumbai", rank: 2 }
    ]
  }
];

export const INITIAL_REDIRECTS: RedirectRule[] = [
  {
    id: "red-1",
    source: "/blog/indian-cotton-export-guide",
    target: "/knowledge-base/incoterms",
    statusCode: 301,
    isActive: true,
    hits: 1840,
    createdAt: "2026-07-01"
  },
  {
    id: "red-2",
    source: "/suppliers/old-directory",
    target: "/suppliers",
    statusCode: 301,
    isActive: true,
    hits: 3420,
    createdAt: "2026-06-15"
  },
  {
    id: "red-3",
    source: "/deals/spring-promo",
    target: "/marketplace",
    statusCode: 302,
    isActive: true,
    hits: 520,
    createdAt: "2026-08-20"
  }
];

export const INITIAL_RANK_RECORDS = [
  {
    id: "rank-1",
    keywordId: "kw-1",
    keyword: "textile manufacturer india",
    searchEngine: "Google" as const,
    device: "desktop" as const,
    currentRank: 4,
    previousRank: 6,
    bestRank: 3,
    url: "https://bell24h.com/marketplace/textiles",
    searchVolume: 18500,
    serpFeatures: ["Featured Snippet", "People Also Ask", "Site Links"],
    history: [
      { date: "2026-09-10", rank: 6 },
      { date: "2026-09-12", rank: 5 },
      { date: "2026-09-14", rank: 5 },
      { date: "2026-09-16", rank: 4 },
      { date: "2026-09-17", rank: 4 }
    ],
    lastUpdated: "Today, 06:00 AM"
  },
  {
    id: "rank-2",
    keywordId: "kw-2",
    keyword: "cotton fabric wholesale bulk",
    searchEngine: "Google" as const,
    device: "mobile" as const,
    currentRank: 3,
    previousRank: 5,
    bestRank: 2,
    url: "https://bell24h.com/marketplace/cotton",
    searchVolume: 24200,
    serpFeatures: ["Product Grid", "Image Carousel"],
    history: [
      { date: "2026-09-10", rank: 5 },
      { date: "2026-09-12", rank: 4 },
      { date: "2026-09-14", rank: 4 },
      { date: "2026-09-16", rank: 3 },
      { date: "2026-09-17", rank: 3 }
    ],
    lastUpdated: "Today, 06:15 AM"
  },
  {
    id: "rank-3",
    keywordId: "kw-3",
    keyword: "surat synthetic silk exporter",
    searchEngine: "Bing" as const,
    device: "desktop" as const,
    currentRank: 2,
    previousRank: 2,
    bestRank: 1,
    url: "https://bell24h.com/suppliers/surat-silk",
    searchVolume: 6800,
    serpFeatures: ["Local Map Pack", "Rich Reviews"],
    history: [
      { date: "2026-09-10", rank: 3 },
      { date: "2026-09-12", rank: 2 },
      { date: "2026-09-14", rank: 2 },
      { date: "2026-09-16", rank: 2 },
      { date: "2026-09-17", rank: 2 }
    ],
    lastUpdated: "Today, 06:30 AM"
  },
  {
    id: "rank-4",
    keywordId: "kw-4",
    keyword: "tirupur combed cotton knitwear",
    searchEngine: "Google" as const,
    device: "local" as const,
    currentRank: 1,
    previousRank: 3,
    bestRank: 1,
    url: "https://bell24h.com/suppliers/tirupur-knits",
    searchVolume: 9400,
    serpFeatures: ["Knowledge Panel", "FAQ Accordion"],
    history: [
      { date: "2026-09-10", rank: 3 },
      { date: "2026-09-12", rank: 2 },
      { date: "2026-09-14", rank: 1 },
      { date: "2026-09-16", rank: 1 },
      { date: "2026-09-17", rank: 1 }
    ],
    lastUpdated: "Today, 07:00 AM"
  },
  {
    id: "rank-5",
    keywordId: "kw-5",
    keyword: "cross border textile escrow payment",
    searchEngine: "Google" as const,
    device: "desktop" as const,
    currentRank: 2,
    previousRank: 4,
    bestRank: 2,
    url: "https://bell24h.com/trust-escrow",
    searchVolume: 3200,
    serpFeatures: ["Featured Snippet", "Site Links"],
    history: [
      { date: "2026-09-10", rank: 5 },
      { date: "2026-09-12", rank: 4 },
      { date: "2026-09-14", rank: 3 },
      { date: "2026-09-16", rank: 2 },
      { date: "2026-09-17", rank: 2 }
    ],
    lastUpdated: "Today, 07:15 AM"
  }
];

export const INITIAL_AUTOMATION_RULES = [
  {
    id: "auto-1",
    name: "High-Value Keyword Drop Alert",
    trigger: "ranking_drop" as const,
    condition: "Position drops > 3 spots for volume >= 5,000",
    action: "notify_slack_whatsapp" as const,
    status: "active" as const,
    lastTriggered: "Yesterday at 14:20",
    runsCount: 12,
    description: "Alerts executive trade team via WhatsApp and Slack when primary export keywords fluctuate."
  },
  {
    id: "auto-2",
    name: "Competitor Incursion Response",
    trigger: "new_competitor" as const,
    condition: "Competitor enters Top 3 for 'textile sourcing'",
    action: "create_crm_task" as const,
    status: "active" as const,
    lastTriggered: "2 days ago",
    runsCount: 5,
    description: "Automatically schedules a content gap audit and backlink outreach task in Bell24h CRM."
  },
  {
    id: "auto-3",
    name: "Broken Link 404 Auto-Heal",
    trigger: "broken_link" as const,
    condition: "Crawl detects 404 error on indexed route",
    action: "auto_fix_redirect" as const,
    status: "active" as const,
    lastTriggered: "3 days ago",
    runsCount: 28,
    description: "Creates an instant 301 permanent redirect rule to the nearest category parent page."
  },
  {
    id: "auto-4",
    name: "Missing Meta Descriptions Auto-Draft",
    trigger: "missing_meta" as const,
    condition: "New supplier profile created without meta description",
    action: "generate_ai_brief" as const,
    status: "active" as const,
    lastTriggered: "Today at 09:12",
    runsCount: 44,
    description: "Invokes Bell24h AI Router (Gemini 1.5 Pro) to generate localized, CTR-optimized snippet."
  },
  {
    id: "auto-5",
    name: "New Cluster Tender SEO Broadcast",
    trigger: "new_content" as const,
    condition: "New RFQ or cluster tender published (> 100k value)",
    action: "generate_ai_brief" as const,
    status: "paused" as const,
    lastTriggered: null,
    runsCount: 0,
    description: "Constructs Schema.org Product tender schema and triggers Google Search indexing API ping."
  }
];

export const INITIAL_COMPETITOR_PROFILES = [
  {
    id: "comp-1",
    name: "Bell24h-OS (Our Platform)",
    domain: "bell24h.com",
    domainAuthority: 68,
    organicKeywords: 14200,
    organicTraffic: 185000,
    backlinksCount: 84500,
    geoScore: 89,
    contentOverlapScore: 100,
    isMainBrand: true
  },
  {
    id: "comp-2",
    name: "VyaparSethu Trade Hub",
    domain: "vyaparsethu.in",
    domainAuthority: 54,
    organicKeywords: 8900,
    organicTraffic: 94000,
    backlinksCount: 32000,
    geoScore: 78,
    contentOverlapScore: 82
  },
  {
    id: "comp-3",
    name: "SamplingHub Global",
    domain: "samplinghub.com",
    domainAuthority: 49,
    organicKeywords: 6400,
    organicTraffic: 61000,
    backlinksCount: 19500,
    geoScore: 74,
    contentOverlapScore: 68
  },
  {
    id: "comp-4",
    name: "IndiaMART B2B Textiles",
    domain: "indiamart.com",
    domainAuthority: 86,
    organicKeywords: 210000,
    organicTraffic: 1450000,
    backlinksCount: 4200000,
    geoScore: 71,
    contentOverlapScore: 64
  },
  {
    id: "comp-5",
    name: "Alibaba Apparel & Fabric",
    domain: "alibaba.com",
    domainAuthority: 93,
    organicKeywords: 540000,
    organicTraffic: 3900000,
    backlinksCount: 12500000,
    geoScore: 69,
    contentOverlapScore: 58
  }
];

export const INITIAL_KNOWLEDGE_GRAPH = {
  entities: [
    { id: "ent-1", label: "Indian Combed Cotton", type: "entity" as const, importance: 95, connections: 14, coveragePercent: 92 },
    { id: "ent-2", label: "Tirupur Knitwear Cluster", type: "entity" as const, importance: 90, connections: 12, coveragePercent: 88 },
    { id: "ent-3", label: "Surat Synthetic Silk", type: "entity" as const, importance: 86, connections: 10, coveragePercent: 85 },
    { id: "ent-4", label: "Cross-Border Escrow Finance", type: "authority" as const, importance: 94, connections: 16, coveragePercent: 90 },
    { id: "ent-5", label: "GOTS & OEKO-TEX Standard 100", type: "authority" as const, importance: 82, connections: 8, coveragePercent: 78 },
    { id: "ent-6", label: "B2B Fabric Sourcing Tender", type: "topic" as const, importance: 88, connections: 11, coveragePercent: 84 },
    { id: "ent-7", label: "Ahmedabad Denim Mills", type: "entity" as const, importance: 79, connections: 7, coveragePercent: 76 },
    { id: "ent-8", label: "Global Trade Logistics (CIF/FOB)", type: "topic" as const, importance: 84, connections: 9, coveragePercent: 80 }
  ],
  edges: [
    { from: "ent-1", to: "ent-2", relationship: "Manufactured in" },
    { from: "ent-2", to: "ent-5", relationship: "Certified by" },
    { from: "ent-2", to: "ent-6", relationship: "Listed on" },
    { from: "ent-3", to: "ent-6", relationship: "Sourced through" },
    { from: "ent-6", to: "ent-4", relationship: "Protected by" },
    { from: "ent-6", to: "ent-8", relationship: "Shipped via" },
    { from: "ent-7", to: "ent-1", relationship: "Weaves using" }
  ]
};

export const INITIAL_TASKS = [
  {
    id: "task-1",
    title: "Inject GOTS certification entity tags into Tirupur supplier schema",
    priority: "high" as const,
    category: "schema" as const,
    status: "in_progress" as const,
    impact: "+14% GEO citations in Perplexity & ChatGPT answers",
    assignedTo: "AI Automation Agent",
    dueDate: "2026-09-20"
  },
  {
    id: "task-2",
    title: "Resolve 4 redirect chains on legacy /catalog/old-textiles routes",
    priority: "high" as const,
    category: "technical" as const,
    status: "todo" as const,
    impact: "Saves 2.4s crawl budget per Googlebot visit",
    assignedTo: "DevOps Engineer",
    dueDate: "2026-09-21"
  },
  {
    id: "task-3",
    title: "Publish 2,500-word authoritative guide on 'Cotton 40s Combed Yarn Sourcing'",
    priority: "medium" as const,
    category: "content" as const,
    status: "todo" as const,
    impact: "Target #1 rank for 24,200/mo search volume query",
    assignedTo: "Content Lead",
    dueDate: "2026-09-24"
  },
  {
    id: "task-4",
    title: "Disavow 8 toxic scraped backlink domains flagged in weekly audit",
    priority: "medium" as const,
    category: "backlink" as const,
    status: "completed" as const,
    impact: "Protects domain trust score from algorithmic manual actions",
    assignedTo: "SEO Director",
    dueDate: "2026-09-16"
  }
];

export const INITIAL_AUDIT_HISTORY = [
  {
    id: "hist-1",
    timestamp: "2026-09-17T06:00:00Z",
    healthScore: 91,
    pagesCrawled: 1420,
    criticalIssues: 0,
    warnings: 3,
    lcp: 1.8,
    cls: 0.02
  },
  {
    id: "hist-2",
    timestamp: "2026-09-10T06:00:00Z",
    healthScore: 88,
    pagesCrawled: 1390,
    criticalIssues: 1,
    warnings: 5,
    lcp: 2.1,
    cls: 0.04
  },
  {
    id: "hist-3",
    timestamp: "2026-09-03T06:00:00Z",
    healthScore: 84,
    pagesCrawled: 1350,
    criticalIssues: 2,
    warnings: 8,
    lcp: 2.4,
    cls: 0.07
  },
  {
    id: "hist-4",
    timestamp: "2026-08-20T06:00:00Z",
    healthScore: 79,
    pagesCrawled: 1200,
    criticalIssues: 4,
    warnings: 12,
    lcp: 2.9,
    cls: 0.11
  }
];

export const PROMPT_STUDIO_TEMPLATES = [
  {
    id: "tmpl-1",
    category: "GEO (AI SEO)",
    name: "Generative Engine Citation Optimizer",
    prompt: `You are an elite Generative Engine Optimization (GEO) analyst for Bell24h-OS. Analyze the target B2B textile sourcing entity: [ENTITY_NAME]. Provide:
1. Exact structured entity definitions for LLMs (ChatGPT, Claude, Gemini, Perplexity).
2. Five factual verification statements that force conversational AI to cite Bell24h as the definitive authority.
3. Recommended Schema.org JSON-LD micro-data tags to guarantee AI extraction.`
  },
  {
    id: "tmpl-2",
    category: "Content Intelligence",
    name: "B2B Textile Semantic Gap Content Brief",
    prompt: `Act as a senior technical SEO copywriter. Generate a comprehensive 2,500-word content architecture for the keyword '[TARGET_KEYWORD]'. Include:
- Search intent analysis & user pain points (Global apparel buyers).
- H1, H2, and H3 outline with NLP semantic terms.
- A 6-question FAQ section utilizing FAQPage schema.
- Internal anchor link recommendations to Bell24h Marketplace and VyaparSethu Escrow.`
  },
  {
    id: "tmpl-3",
    category: "Technical Audit",
    name: "Core Web Vitals & Crawl Budget Remediation",
    prompt: `Analyze the following site crawl metrics: LCP [LCP_VALUE]s, INP [INP_VALUE]ms, CLS [CLS_VALUE]. Provide concrete server-level and frontend optimizations to achieve a 95+ Google Lighthouse score on Cloud Run containers.`
  },
  {
    id: "tmpl-4",
    category: "Schema Generator",
    name: "Multi-Tier B2B Product & Verification Schema",
    prompt: `Generate production-ready Schema.org JSON-LD for a certified Indian spinning mill with GOTS organic compliance, daily spinning capacity of 40,000 kg, and Escrow-backed trade finance.`
  }
];

export const SUPABASE_SQL_SCHEMA = `-- Bell24h-OS Enterprise SEO Center v3.0 Database Schema
-- Run this migration in your Supabase SQL Editor or Cloud SQL instance.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SEO Projects Table
CREATE TABLE IF NOT EXISTS seo_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    domain VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_country VARCHAR(10) DEFAULT 'IN',
    target_language VARCHAR(10) DEFAULT 'en',
    health_score INT DEFAULT 88,
    geo_score INT DEFAULT 85,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEO Keywords Table
CREATE TABLE IF NOT EXISTS seo_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    volume INT DEFAULT 0,
    difficulty INT DEFAULT 0,
    cpc NUMERIC(10,2) DEFAULT 0.00,
    intent VARCHAR(50) DEFAULT 'commercial',
    current_position INT,
    previous_position INT,
    cluster VARCHAR(100),
    tags TEXT[],
    is_tracked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SEO Rankings History Table
CREATE TABLE IF NOT EXISTS seo_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword_id UUID REFERENCES seo_keywords(id) ON DELETE CASCADE,
    search_engine VARCHAR(50) DEFAULT 'Google',
    device VARCHAR(50) DEFAULT 'desktop',
    rank INT NOT NULL,
    serp_features TEXT[],
    snapshot_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEO Audits Table
CREATE TABLE IF NOT EXISTS seo_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    health_score INT NOT NULL,
    crawled_pages INT DEFAULT 0,
    critical_issues INT DEFAULT 0,
    warnings INT DEFAULT 0,
    lcp NUMERIC(4,2),
    fid INT,
    cls NUMERIC(4,3),
    raw_results JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEO Meta Tags Table
CREATE TABLE IF NOT EXISTS seo_meta_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    path VARCHAR(500) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    canonical_url TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image TEXT,
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    status VARCHAR(50) DEFAULT 'optimized',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SEO Schemas Table
CREATE TABLE IF NOT EXISTS seo_schemas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    page_url TEXT NOT NULL,
    json_ld JSONB NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SEO Content Analysis Table
CREATE TABLE IF NOT EXISTS seo_content_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    content_score INT DEFAULT 75,
    topical_coverage INT DEFAULT 80,
    word_count INT DEFAULT 0,
    missing_topics TEXT[],
    nlp_entities JSONB,
    ai_recommendations JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SEO Competitors Table
CREATE TABLE IF NOT EXISTS seo_competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    domain_authority INT DEFAULT 50,
    organic_traffic INT DEFAULT 0,
    organic_keywords INT DEFAULT 0,
    backlinks_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SEO Backlinks Table
CREATE TABLE IF NOT EXISTS seo_backlinks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    source_domain VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    anchor_text TEXT,
    domain_authority INT DEFAULT 0,
    is_dofollow BOOLEAN DEFAULT TRUE,
    is_toxic BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SEO Local Rankings Table
CREATE TABLE IF NOT EXISTS seo_local_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    gmb_status VARCHAR(50) DEFAULT 'verified',
    nap_consistency INT DEFAULT 95,
    citations_count INT DEFAULT 0,
    local_rankings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SEO GEO (AI Search) Audits Table
CREATE TABLE IF NOT EXISTS seo_geo_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    engine VARCHAR(50) NOT NULL,
    is_cited BOOLEAN DEFAULT FALSE,
    rank INT,
    snippet TEXT,
    sentiment VARCHAR(20) DEFAULT 'positive',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SEO Tasks & Automation Rules Table
CREATE TABLE IF NOT EXISTS seo_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'technical',
    status VARCHAR(50) DEFAULT 'todo',
    impact TEXT,
    assigned_to VARCHAR(100),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Enable Row Level Security (RLS) on all tables
ALTER TABLE seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_meta_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_content_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_local_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_geo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_tasks ENABLE ROW LEVEL SECURITY;

-- 15. Standard Organization Isolation RLS Policy
CREATE POLICY "Users can only access their organization SEO data"
ON seo_projects FOR ALL
USING (auth.jwt() ->> 'organization_id' = organization_id::text);
`;

export const INITIAL_COMPETITORS = INITIAL_COMPETITOR_PROFILES;
export const INITIAL_PAGE_META_TAGS = INITIAL_META_TAGS;
export const INITIAL_SEO_SCHEMAS = INITIAL_SCHEMAS;
export const INITIAL_LOCAL_HUBS_DATA = INITIAL_LOCAL_HUBS;
export const INITIAL_RANK_TRACKER = INITIAL_RANK_RECORDS;

