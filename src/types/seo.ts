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
  message?: string;
  url?: string;
}

export type AuditIssue = SEOCriticalIssue;

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
  lastRun?: string;
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
  route?: string;
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

export type PageMetaTags = MetaTagItem;

export interface SchemaItem {
  id: string;
  type: "Organization" | "Product" | "FAQPage" | "Article" | "LocalBusiness" | "BreadcrumbList";
  name: string;
  pageUrl: string;
  route?: string;
  jsonLd: string;
  rawJson?: string;
  isValid: boolean;
  validationWarnings?: string[];
  updatedAt: string;
}

export type SEOSchemaItem = SchemaItem;
export type SchemaType = SchemaItem["type"];

export interface BacklinkItem {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  source?: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number; // 0-100
  pageAuthority: number;
  isDoFollow: boolean;
  isToxic: boolean;
  firstSeen: string;
  date?: string;
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
  competitor?: string;
  competitorRank?: number;
  ourRank?: number | null;
  searchVolume?: number;
  opportunity?: string;
}

export interface LocalHubSEO {
  id: string;
  city: string;
  state: string;
  gmbStatus: "verified" | "pending" | "action_needed";
  napConsistency: number; // 0-100%
  topKeywords: Array<{ keyword: string; rank: number }>;
  citationsCount: number;
  primaryKeyword?: string;
  searchVolume?: number;
  difficulty?: number;
  localRank?: number;
  rating?: number;
  reviewsCount?: number;
}

export type LocalHubData = LocalHubSEO;

export interface RedirectRule {
  id: string;
  source: string;
  target: string;
  statusCode: 301 | 302;
  isActive: boolean;
  hits: number;
  createdAt: string;
}

export type SupportedSchemaType =
  | "Organization"
  | "LocalBusiness"
  | "Product"
  | "FAQPage"
  | "Article"
  | "HowTo"
  | "Event"
  | "VideoObject"
  | "BreadcrumbList"
  | "Review";

export interface SEORankRecord {
  id: string;
  keywordId: string;
  keyword: string;
  searchEngine: "Google" | "Bing";
  device: "desktop" | "mobile" | "local";
  currentRank: number;
  previousRank: number;
  bestRank: number;
  url: string;
  searchVolume: number;
  serpFeatures: string[];
  history: Array<{ date: string; rank: number }>;
  lastUpdated: string;
  currentPosition?: number;
  previousPosition?: number;
  location?: string;
}

export interface SEOAutomationRule {
  id: string;
  name: string;
  trigger: "ranking_drop" | "new_competitor" | "broken_link" | "missing_meta" | "new_content";
  condition: string;
  action: "notify_slack_whatsapp" | "create_crm_task" | "generate_ai_brief" | "auto_fix_redirect";
  status: "active" | "paused";
  lastTriggered: string | null;
  runsCount: number;
  description: string;
  isActive?: boolean;
  executionCount?: number;
  channel?: string;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: "entity" | "topic" | "citation" | "authority";
  importance: number; // 0-100
  connections: number;
  coveragePercent: number;
}

export interface KnowledgeGraphEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface CompetitorProfile {
  id: string;
  name: string;
  domain: string;
  domainAuthority: number;
  organicKeywords: number;
  organicTraffic: number;
  backlinksCount: number;
  geoScore: number;
  contentOverlapScore: number;
  isMainBrand?: boolean;
  da?: number;
  keywords?: number;
  traffic?: number;
  backlinks?: number;
  overlap?: number;
}

export interface SEOTaskItem {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  category: "technical" | "content" | "geo" | "backlink" | "schema";
  status: "todo" | "in_progress" | "completed";
  impact: string;
  assignedTo: string;
  dueDate: string;
}

export interface AuditHistoryRecord {
  id: string;
  timestamp: string;
  healthScore: number;
  pagesCrawled: number;
  criticalIssues: number;
  warnings: number;
  lcp: number;
  cls: number;
  date?: string;
  score?: number;
  pages?: number;
  critical?: number;
}
