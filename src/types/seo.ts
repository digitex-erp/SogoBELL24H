/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center Types
 */

export type KeywordIntent = "commercial" | "transactional" | "informational" | "navigational";

export interface SEOKeyword {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number; // 0-100
  cpc: number; // in USD or INR
  intent: KeywordIntent;
  position: number;
  prevPosition: number;
  url: string;
  cluster: string;
  tags: string[];
  isTracked: boolean;
  history?: number[];
}

export interface SEOCriticalIssue {
  id: string;
  severity: "critical" | "warning" | "notice";
  category: "indexing" | "performance" | "content" | "links" | "security" | "schema";
  title: string;
  description: string;
  affectedUrl: string;
  recommendation: string;
  status: "open" | "resolved" | "ignored";
}

export interface SiteAuditReport {
  id: string;
  healthScore: number; // 0-100
  crawledPages: number;
  totalPages: number;
  criticalCount: number;
  warningCount: number;
  noticeCount: number;
  coreWebVitals: {
    lcp: number; // seconds
    fid: number; // ms
    cls: number;
  };
  statusCodes: {
    code200: number;
    code301: number;
    code404: number;
    code500: number;
  };
  lastAuditDate: string;
  issues: SEOCriticalIssue[];
}

export interface PageAnalysisResult {
  url: string;
  score: number;
  title: {
    text: string;
    length: number;
    status: "good" | "too_short" | "too_long";
  };
  metaDescription: {
    text: string;
    length: number;
    status: "good" | "too_short" | "too_long";
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Array<{
    term: string;
    count: number;
    density: number; // percentage
  }>;
  images: {
    total: number;
    missingAlt: number;
  };
  canonical: string;
  isIndexable: boolean;
}

export interface MetaTagItem {
  id: string;
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  status: "optimized" | "needs_review" | "missing";
  lastUpdated: string;
}

export interface SchemaItem {
  id: string;
  type: "Organization" | "Product" | "FAQPage" | "Article" | "LocalBusiness" | "BreadcrumbList";
  name: string;
  pageUrl: string;
  jsonLd: string;
  isValid: boolean;
  validationWarnings?: string[];
  updatedAt: string;
}

export interface BacklinkItem {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number; // 0-100
  pageAuthority: number;
  isDoFollow: boolean;
  isToxic: boolean;
  firstSeen: string;
  status: "active" | "lost";
}

export interface GEOCitation {
  id: string;
  query: string;
  engine: "ChatGPT" | "Perplexity" | "Gemini" | "Claude" | "Google AI";
  isCited: boolean;
  rank: number;
  citedUrl: string;
  snippet: string;
  sentiment: "positive" | "neutral" | "negative";
  lastChecked: string;
}

export interface CompetitorGap {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  ourPosition: number | null;
  competitors: {
    [domain: string]: number;
  };
  opportunityScore: number; // 0-100
}

export interface LocalHubSEO {
  id: string;
  city: string;
  state: string;
  gmbStatus: "verified" | "pending" | "action_needed";
  napConsistency: number; // 0-100%
  topKeywords: Array<{ keyword: string; rank: number }>;
  citationsCount: number;
}

export interface RedirectRule {
  id: string;
  source: string;
  target: string;
  statusCode: 301 | 302;
  isActive: boolean;
  hits: number;
  createdAt: string;
}
