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
