/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center
 * Comprehensive SEO, Generative Engine Optimization (GEO), Technical Audit & Content Architecture
 */

import React, { useState, useMemo } from "react";
import {
  Search,
  Globe,
  Link2,
  FileText,
  MapPin,
  BarChart3,
  Eye,
  Zap,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Database,
  Code,
  Users,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Filter,
  Download,
  Terminal,
  Cpu,
  Smartphone,
  Monitor
} from "lucide-react";
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
} from "../../types/seo";
import {
  INITIAL_KEYWORDS,
  INITIAL_AUDIT_REPORT,
  INITIAL_META_TAGS,
  INITIAL_SCHEMAS,
  INITIAL_BACKLINKS,
  INITIAL_GEO_CITATIONS,
  INITIAL_COMPETITOR_GAPS,
  INITIAL_LOCAL_HUBS,
  INITIAL_REDIRECTS
} from "../../services/seoData";

export function SEOCenter() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // State
  const [keywords, setKeywords] = useState<SEOKeyword[]>(INITIAL_KEYWORDS);
  const [auditReport, setAuditReport] = useState<SiteAuditReport>(INITIAL_AUDIT_REPORT);
  const [metaTags, setMetaTags] = useState<MetaTagItem[]>(INITIAL_META_TAGS);
  const [schemas, setSchemas] = useState<SchemaItem[]>(INITIAL_SCHEMAS);
  const [backlinks] = useState<BacklinkItem[]>(INITIAL_BACKLINKS);
  const [geoCitations, setGeoCitations] = useState<GEOCitation[]>(INITIAL_GEO_CITATIONS);
  const [competitorGaps, setCompetitorGaps] = useState<CompetitorGap[]>(INITIAL_COMPETITOR_GAPS);
  const [localHubs] = useState<LocalHubSEO[]>(INITIAL_LOCAL_HUBS);
  const [redirects, setRedirects] = useState<RedirectRule[]>(INITIAL_REDIRECTS);

  // Filter & Search states
  const [kwSearch, setKwSearch] = useState("");
  const [kwClusterFilter, setKwClusterFilter] = useState("all");
  const [kwIntentFilter, setKwIntentFilter] = useState("all");

  // Modal / Form states
  const [isAddKwOpen, setIsAddKwOpen] = useState(false);
  const [newKwText, setNewKwText] = useState("");
  const [newKwCluster, setNewKwCluster] = useState("Textile Sourcing");
  const [newKwIntent, setNewKwIntent] = useState<any>("commercial");

  // Audit scanning state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Audit Trigger
  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditProgress(15);
    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAuditing(false);
            setAuditReport((r) => ({
              ...r,
              healthScore: 91,
              crawledPages: r.crawledPages + 12,
              lastAuditDate: new Date().toISOString()
            }));
            showToast("Technical crawl completed! Health score improved to 91/100.");
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // 2. Keyword handlers
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKwText.trim()) return;

    const newKw: SEOKeyword = {
      id: "kw-" + Date.now(),
      keyword: newKwText.trim().toLowerCase(),
      volume: Math.floor(Math.random() * 8000) + 1200,
      difficulty: Math.floor(Math.random() * 45) + 20,
      cpc: Number((Math.random() * 2.5 + 1.1).toFixed(2)),
      intent: newKwIntent,
      position: Math.floor(Math.random() * 15) + 1,
      prevPosition: Math.floor(Math.random() * 20) + 5,
      url: "/marketplace",
      cluster: newKwCluster,
      tags: ["Target", "New"],
      isTracked: true,
      history: [15, 12, 8, 5]
    };

    setKeywords([newKw, ...keywords]);
    setNewKwText("");
    setIsAddKwOpen(false);
    showToast(`Keyword "${newKw.keyword}" added to tracking ledger!`);
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords(keywords.filter((k) => k.id !== id));
    showToast("Keyword removed from tracker.");
  };

  // Filtered keywords
  const filteredKeywords = useMemo(() => {
    return keywords.filter((k) => {
      const matchSearch =
        k.keyword.toLowerCase().includes(kwSearch.toLowerCase()) ||
        k.cluster.toLowerCase().includes(kwSearch.toLowerCase());
      const matchCluster = kwClusterFilter === "all" || k.cluster === kwClusterFilter;
      const matchIntent = kwIntentFilter === "all" || k.intent === kwIntentFilter;
      return matchSearch && matchCluster && matchIntent;
    });
  }, [keywords, kwSearch, kwClusterFilter, kwIntentFilter]);

  // Available clusters
  const clusters = useMemo(() => {
    const set = new Set<string>();
    keywords.forEach((k) => set.add(k.cluster));
    return Array.from(set);
  }, [keywords]);

  // Export report
  const handleExportReport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            platform: "Bell24h-OS Enterprise SEO Center",
            exportDate: new Date().toISOString(),
            healthScore: auditReport.healthScore,
            keywordsCount: keywords.length,
            keywords: keywords,
            backlinksCount: backlinks.length,
            geoCitations: geoCitations
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bell24h-seo-audit-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Complete Enterprise SEO Report exported!");
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <Search className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                SEO Center
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Enterprise v2.0
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                GEO & AI Enabled
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Enterprise search dominance, Generative Engine Optimization (GEO), technical site auditing & content intelligence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
            {isAuditing ? `Auditing (${auditProgress}%)` : "Run Technical Audit"}
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Audit
          </button>
        </div>
      </div>

      {/* Auditing Progress Bar if active */}
      {isAuditing && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1.5 animate-pulse">
          <div className="flex justify-between text-xs font-medium text-emerald-800">
            <span>Crawling bell24h.com pages & verifying Core Web Vitals...</span>
            <span>{auditProgress}%</span>
          </div>
          <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${auditProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-thin">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "keywords", label: "Keywords", icon: Target },
          { id: "audit", label: "Site Audit", icon: Globe },
          { id: "pages", label: "Page Analyzer", icon: Eye },
          { id: "meta", label: "Meta Tags", icon: FileText },
          { id: "schema", label: "Schema", icon: Code },
          { id: "backlinks", label: "Backlinks", icon: Link2 },
          { id: "geo", label: "GEO (AI Search)", icon: Zap },
          { id: "content", label: "Content Optimizer", icon: Sparkles },
          { id: "competitors", label: "Competitors", icon: Users },
          { id: "local", label: "Local SEO", icon: MapPin },
          { id: "sitemap", label: "Sitemaps & Robots", icon: Database }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="space-y-6">
        {/* 1. DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <DashboardTab
            auditReport={auditReport}
            keywords={keywords}
            geoCitations={geoCitations}
            onNavigate={setActiveTab}
            onRunAudit={handleRunAudit}
          />
        )}

        {/* 2. KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <KeywordsTab
            keywords={filteredKeywords}
            clusters={clusters}
            kwSearch={kwSearch}
            setKwSearch={setKwSearch}
            kwClusterFilter={kwClusterFilter}
            setKwClusterFilter={setKwClusterFilter}
            kwIntentFilter={kwIntentFilter}
            setKwIntentFilter={setKwIntentFilter}
            onDelete={handleDeleteKeyword}
            isAddOpen={isAddKwOpen}
            setIsAddOpen={setIsAddKwOpen}
            newKwText={newKwText}
            setNewKwText={setNewKwText}
            newKwCluster={newKwCluster}
            setNewKwCluster={setNewKwCluster}
            newKwIntent={newKwIntent}
            setNewKwIntent={setNewKwIntent}
            onAddSubmit={handleAddKeyword}
          />
        )}

        {/* 3. SITE AUDIT TAB */}
        {activeTab === "audit" && (
          <AuditTab
            report={auditReport}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
            setReport={setAuditReport}
            showToast={showToast}
          />
        )}

        {/* 4. PAGE ANALYZER TAB */}
        {activeTab === "pages" && <PageAnalyzerTab showToast={showToast} />}

        {/* 5. META TAGS TAB */}
        {activeTab === "meta" && (
          <MetaTagsTab
            metaTags={metaTags}
            setMetaTags={setMetaTags}
            showToast={showToast}
          />
        )}

        {/* 6. SCHEMA GENERATOR TAB */}
        {activeTab === "schema" && (
          <SchemaTab
            schemas={schemas}
            setSchemas={setSchemas}
            showToast={showToast}
          />
        )}

        {/* 7. BACKLINKS TAB */}
        {activeTab === "backlinks" && (
          <BacklinksTab backlinks={backlinks} showToast={showToast} />
        )}

        {/* 8. GEO (AI SEARCH) TAB */}
        {activeTab === "geo" && (
          <GEOTab
            citations={geoCitations}
            setCitations={setGeoCitations}
            showToast={showToast}
          />
        )}

        {/* 9. CONTENT OPTIMIZER TAB */}
        {activeTab === "content" && <ContentOptimizerTab showToast={showToast} />}

        {/* 10. COMPETITORS TAB */}
        {activeTab === "competitors" && (
          <CompetitorsTab
            gaps={competitorGaps}
            onAddKeyword={(kw) => {
              setKeywords((prev) => [
                {
                  id: "kw-" + Date.now(),
                  keyword: kw,
                  volume: 9800,
                  difficulty: 42,
                  cpc: 2.15,
                  intent: "commercial",
                  position: 28,
                  prevPosition: 35,
                  url: "/marketplace",
                  cluster: "Competitor Target",
                  tags: ["Gap Target"],
                  isTracked: true,
                  history: [35, 31, 28]
                },
                ...prev
              ]);
              showToast(`Targeted competitor keyword "${kw}" added to Tracker!`);
            }}
          />
        )}

        {/* 11. LOCAL SEO TAB */}
        {activeTab === "local" && <LocalSEOTab hubs={localHubs} showToast={showToast} />}

        {/* 12. SITEMAPS & ROBOTS TAB */}
        {activeTab === "sitemap" && (
          <SitemapTab
            redirects={redirects}
            setRedirects={setRedirects}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS FOR THE 12 TABS
// ═══════════════════════════════════════════════════════════════════════════

/* 1. DASHBOARD COMPONENT */
function DashboardTab({
  auditReport,
  keywords,
  geoCitations,
  onNavigate,
  onRunAudit
}: {
  auditReport: SiteAuditReport;
  keywords: SEOKeyword[];
  geoCitations: GEOCitation[];
  onNavigate: (tab: string) => void;
  onRunAudit: () => void;
}) {
  const topKeywords = keywords.slice(0, 5);
  const citedCount = geoCitations.filter((c) => c.isCited).length;
  const geoShare = Math.round((citedCount / geoCitations.length) * 100);

  return (
    <div className="space-y-6">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">SEO Health Score</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{auditReport.healthScore}/100</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Grade A
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${auditReport.healthScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>{auditReport.crawledPages} pages indexed</span>
            <button
              onClick={() => onNavigate("audit")}
              className="text-emerald-600 hover:underline font-medium"
            >
              View Audit &rarr;
            </button>
          </div>
        </div>

        {/* Tracked Keywords */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tracked Keywords</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{keywords.length}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +4 this week
            </span>
          </div>
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">6 in Top 3</span> &bull; 8 in Top 10 positions
          </p>
          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>Avg Rank: #3.8</span>
            <button
              onClick={() => onNavigate("keywords")}
              className="text-blue-600 hover:underline font-medium"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        {/* Organic Traffic Estimate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Est. Organic Traffic</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">42.8K</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.4% MoM
            </span>
          </div>
          <p className="text-xs text-slate-500">Commercial intent share: 64%</p>
          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>Est. Value: $14.2K/mo</span>
            <span className="text-purple-600 font-medium">B2B Trade</span>
          </div>
        </div>

        {/* AI Visibility (GEO) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Search (GEO)</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{geoShare}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12% share
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cited in <span className="font-semibold text-slate-700">{citedCount} of {geoCitations.length}</span> top trade queries
          </p>
          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>ChatGPT, Perplexity, Gemini</span>
            <button
              onClick={() => onNavigate("geo")}
              className="text-amber-600 hover:underline font-medium"
            >
              Inspect &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Core Web Vitals Status Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Google Core Web Vitals Assessment: Passed</div>
            <div className="text-xs text-slate-400">All mobile & desktop field data complies with Google Page Experience standards</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400">LCP: </span>
            <span className="text-emerald-400 font-bold">{auditReport.coreWebVitals.lcp}s</span>
            <span className="text-slate-500 text-[10px] ml-1">(&lt;2.5s)</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400">FID: </span>
            <span className="text-emerald-400 font-bold">{auditReport.coreWebVitals.fid}ms</span>
            <span className="text-slate-500 text-[10px] ml-1">(&lt;100ms)</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400">CLS: </span>
            <span className="text-emerald-400 font-bold">{auditReport.coreWebVitals.cls}</span>
            <span className="text-slate-500 text-[10px] ml-1">(&lt;0.1)</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Keywords & GEO Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Keyword Rankings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Priority Keyword Positions</h3>
              <p className="text-xs text-slate-500">Live rankings on Google India (Desktop & Mobile)</p>
            </div>
            <button
              onClick={() => onNavigate("keywords")}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View All ({keywords.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topKeywords.map((kw) => (
              <div key={kw.id} className="py-2.5 flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    {kw.keyword}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                      {kw.cluster}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                    <span>Vol: {kw.volume.toLocaleString()}</span>
                    <span>CPC: ${kw.cpc}</span>
                    <span>KD: {kw.difficulty}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 font-bold text-slate-900">
                    <span>#{kw.position}</span>
                    {kw.prevPosition > kw.position ? (
                      <span className="text-xs text-emerald-600 flex items-center">
                        <TrendingUp className="w-3.5 h-3.5" /> +{kw.prevPosition - kw.position}
                      </span>
                    ) : kw.prevPosition < kw.position ? (
                      <span className="text-xs text-red-500 flex items-center">
                        <TrendingDown className="w-3.5 h-3.5" /> -{kw.position - kw.prevPosition}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center">
                        <Minus className="w-3.5 h-3.5" /> 0
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{kw.url}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Generative Engine Optimization Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Search Engine Citations</h3>
              <p className="text-xs text-slate-500">Tracking Bell24h entity citations in LLM responses</p>
            </div>
            <button
              onClick={() => onNavigate("geo")}
              className="text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              GEO Optimizer
            </button>
          </div>

          <div className="space-y-3">
            {geoCitations.map((cit) => (
              <div
                key={cit.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{cit.engine}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        cit.isCited
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {cit.isCited ? `Cited · Rank #${cit.rank}` : "Not Cited"}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{cit.lastChecked}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-1 italic">
                  "{cit.query}"
                </p>
                <p className="text-xs text-slate-500 line-clamp-2">{cit.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Issues Quick View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Audit Findings ({auditReport.issues.length} Issues Identified)
            </h3>
          </div>
          <button
            onClick={() => onNavigate("audit")}
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Review & Fix All Issues &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {auditReport.issues.slice(0, 4).map((iss) => (
            <div
              key={iss.id}
              className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                iss.severity === "critical"
                  ? "bg-red-50/50 border-red-200 text-red-900"
                  : iss.severity === "warning"
                  ? "bg-amber-50/50 border-amber-200 text-amber-900"
                  : "bg-blue-50/50 border-blue-200 text-blue-900"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded font-bold bg-white/80 border">
                  {iss.severity}
                </span>
                <span className="text-slate-500 text-[11px] truncate max-w-[180px]">{iss.affectedUrl}</span>
              </div>
              <div className="font-bold text-slate-900">{iss.title}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{iss.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 2. KEYWORDS TAB COMPONENT */
function KeywordsTab({
  keywords,
  clusters,
  kwSearch,
  setKwSearch,
  kwClusterFilter,
  setKwClusterFilter,
  kwIntentFilter,
  setKwIntentFilter,
  onDelete,
  isAddOpen,
  setIsAddOpen,
  newKwText,
  setNewKwText,
  newKwCluster,
  setNewKwCluster,
  newKwIntent,
  setNewKwIntent,
  onAddSubmit
}: any) {
  return (
    <div className="space-y-4">
      {/* Control Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keyword or cluster..."
              value={kwSearch}
              onChange={(e) => setKwSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Cluster filter */}
          <select
            value={kwClusterFilter}
            onChange={(e) => setKwClusterFilter(e.target.value)}
            className="text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Clusters ({clusters.length})</option>
            {clusters.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Intent filter */}
          <select
            value={kwIntentFilter}
            onChange={(e) => setKwIntentFilter(e.target.value)}
            className="text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Intents</option>
            <option value="commercial">Commercial</option>
            <option value="transactional">Transactional</option>
            <option value="informational">Informational</option>
            <option value="navigational">Navigational</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Keyword
        </button>
      </div>

      {/* Add Keyword Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Target Keyword</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={onAddSubmit} className="space-y-3.5 text-xs md:text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Keyword Phrase</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. combed cotton yarn wholesale surat"
                  value={newKwText}
                  onChange={(e) => setNewKwText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Search Intent</label>
                  <select
                    value={newKwIntent}
                    onChange={(e) => setNewKwIntent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="transactional">Transactional</option>
                    <option value="informational">Informational</option>
                    <option value="navigational">Navigational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Topic Cluster</label>
                  <input
                    type="text"
                    value={newKwCluster}
                    onChange={(e) => setNewKwCluster(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Track Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Keywords Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Keyword Phrase</th>
                <th className="py-3 px-4">Cluster</th>
                <th className="py-3 px-3">Volume</th>
                <th className="py-3 px-3">KD%</th>
                <th className="py-3 px-3">CPC</th>
                <th className="py-3 px-3">Intent</th>
                <th className="py-3 px-3 text-right">Position</th>
                <th className="py-3 px-4">Target URL</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keywords.map((kw: SEOKeyword) => (
                <tr key={kw.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{kw.keyword}</span>
                      {kw.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{kw.cluster}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {kw.volume.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            kw.difficulty < 35
                              ? "bg-emerald-500"
                              : kw.difficulty < 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${kw.difficulty}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700">{kw.difficulty}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">${kw.cpc}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${
                        kw.intent === "commercial"
                          ? "bg-purple-100 text-purple-800"
                          : kw.intent === "transactional"
                          ? "bg-emerald-100 text-emerald-800"
                          : kw.intent === "informational"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {kw.intent}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">#{kw.position}</span>
                      {kw.prevPosition > kw.position ? (
                        <span className="text-xs text-emerald-600 font-semibold">
                          +{kw.prevPosition - kw.position}
                        </span>
                      ) : kw.prevPosition < kw.position ? (
                        <span className="text-xs text-red-500 font-semibold">
                          -{kw.position - kw.prevPosition}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">&mdash;</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs truncate max-w-[150px]">
                    {kw.url}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onDelete(kw.id)}
                      title="Remove keyword"
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 3. AUDIT TAB COMPONENT */
function AuditTab({
  report,
  onRunAudit,
  isAuditing,
  setReport,
  showToast
}: {
  report: SiteAuditReport;
  onRunAudit: () => void;
  isAuditing: boolean;
  setReport: React.Dispatch<React.SetStateAction<SiteAuditReport>>;
  showToast: (msg: string) => void;
}) {
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredIssues = report.issues.filter((iss) => {
    if (severityFilter === "all") return true;
    return iss.severity === severityFilter;
  });

  const handleResolveIssue = (id: string) => {
    setReport((r) => ({
      ...r,
      healthScore: Math.min(100, r.healthScore + 2),
      issues: r.issues.map((i) => (i.id === id ? { ...i, status: "resolved" } : i))
    }));
    showToast("Issue marked as resolved! Health score +2");
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Crawl Coverage</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {report.crawledPages} / {report.totalPages} Pages
          </div>
          <p className="text-xs text-slate-500">100% of internal HTML routes indexed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">HTTP Status Codes</span>
          <div className="flex items-center gap-3 text-xs font-semibold pt-1">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded">200 OK: {report.statusCodes.code200}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">301 Redir: {report.statusCodes.code301}</span>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded">404 Error: {report.statusCodes.code404}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Issue Breakdown</span>
          <div className="flex items-center gap-2 text-xs font-semibold pt-1">
            <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded">
              {report.criticalCount} Critical
            </span>
            <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded">
              {report.warningCount} Warnings
            </span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded">
              {report.noticeCount} Notices
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs for Issues */}
      <div className="flex items-center gap-2 border-b pb-2 text-xs md:text-sm">
        <button
          onClick={() => setSeverityFilter("all")}
          className={`px-3 py-1.5 rounded-md font-medium ${
            severityFilter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Issues ({report.issues.length})
        </button>
        <button
          onClick={() => setSeverityFilter("critical")}
          className={`px-3 py-1.5 rounded-md font-medium ${
            severityFilter === "critical"
              ? "bg-red-600 text-white"
              : "text-red-700 hover:bg-red-50"
          }`}
        >
          Critical ({report.issues.filter((i) => i.severity === "critical").length})
        </button>
        <button
          onClick={() => setSeverityFilter("warning")}
          className={`px-3 py-1.5 rounded-md font-medium ${
            severityFilter === "warning"
              ? "bg-amber-600 text-white"
              : "text-amber-700 hover:bg-amber-50"
          }`}
        >
          Warnings ({report.issues.filter((i) => i.severity === "warning").length})
        </button>
        <button
          onClick={() => setSeverityFilter("notice")}
          className={`px-3 py-1.5 rounded-md font-medium ${
            severityFilter === "notice"
              ? "bg-blue-600 text-white"
              : "text-blue-700 hover:bg-blue-50"
          }`}
        >
          Notices ({report.issues.filter((i) => i.severity === "notice").length})
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.map((iss) => (
          <div
            key={iss.id}
            className={`p-4 rounded-xl border bg-white shadow-xs space-y-2 ${
              iss.status === "resolved" ? "opacity-60 bg-slate-50" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    iss.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : iss.severity === "warning"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {iss.severity}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-medium">
                  {iss.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{iss.title}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">{iss.affectedUrl}</span>
                {iss.status === "resolved" ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolveIssue(iss.id)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  >
                    Fix & Resolve
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600">{iss.description}</p>
            <div className="text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 font-medium">
              <strong>Recommendation:</strong> {iss.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 4. PAGE ANALYZER TAB COMPONENT */
function PageAnalyzerTab({ showToast }: { showToast: (msg: string) => void }) {
  const [urlInput, setUrlInput] = useState("/marketplace/textiles");
  const [analyzed, setAnalyzed] = useState(true);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">On-Page SEO URL Inspector</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter URL path, e.g. /marketplace/cotton"
            className="flex-1 px-3.5 py-2 text-xs md:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => {
              setAnalyzed(true);
              showToast(`Inspected page parameters for ${urlInput}`);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-xs"
          >
            Analyze Page
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Preset sample pages:</span>
          {["/marketplace/textiles", "/rfqs", "/trust-escrow", "/suppliers/surat-silk"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setUrlInput(p);
                setAnalyzed(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Inspection Card */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">On-Page Score</span>
                <div className="text-2xl font-extrabold text-emerald-600">92 / 100</div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200">
                Indexable &bull; Canonical Valid
              </span>
            </div>

            {/* Title Tag */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Title Tag (54 / 60 Chars)</span>
                <span className="text-emerald-600 font-semibold">Optimal Length</span>
              </div>
              <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border font-mono">
                Bell24h-OS · Global B2B Textile &amp; Cross-Border Trade Platform
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Meta Description (152 / 160 Chars)</span>
                <span className="text-emerald-600 font-semibold">Optimal Length</span>
              </div>
              <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border">
                Connect verified Indian textile manufacturers with global buyers. Source combed cotton, Surat silks, handlooms with verified escrow &amp; fast RFQ matching.
              </p>
            </div>

            {/* Headings Hierarchy */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 text-xs">Heading Hierarchy</span>
              <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border font-mono">
                <div className="font-bold text-emerald-700">H1: Global B2B Textile &amp; Trade Marketplace</div>
                <div className="pl-4 text-slate-600">H2: Verified Indian Textile Sourcing Mills</div>
                <div className="pl-8 text-slate-500">H3: Tirupur Combed Cotton Knitting Yarn</div>
                <div className="pl-8 text-slate-500">H3: Surat Synthetic Silk Fabric Wholesale</div>
                <div className="pl-4 text-slate-600">H2: VyaparSethu Escrow &amp; Trade Financing</div>
              </div>
            </div>
          </div>

          {/* Side stats: Keyword density & media */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Keyword Density (NLP)</h4>
              <div className="space-y-2 text-xs">
                {[
                  { term: "textile manufacturer", count: 8, density: "2.4%" },
                  { term: "combed cotton", count: 6, density: "1.8%" },
                  { term: "trade escrow", count: 5, density: "1.5%" },
                  { term: "rfq matching", count: 4, density: "1.2%" }
                ].map((k) => (
                  <div key={k.term} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">{k.term}</span>
                    <span className="text-slate-500">
                      {k.count}x ({k.density})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-sm text-slate-900">Image SEO &amp; Media</h4>
              <div className="flex justify-between py-1 border-b">
                <span>Total Image Elements</span>
                <span className="font-bold">14</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Images Missing Alt Tag</span>
                <span className="font-bold text-emerald-600">0 (100% compliant)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Lazy Loading Enabled</span>
                <span className="font-bold text-emerald-600">Yes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 5. META TAGS TAB COMPONENT */
function MetaTagsTab({
  metaTags,
  setMetaTags,
  showToast
}: {
  metaTags: MetaTagItem[];
  setMetaTags: React.Dispatch<React.SetStateAction<MetaTagItem[]>>;
  showToast: (msg: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(metaTags[0].id);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const current = metaTags.find((m) => m.id === selectedId) || metaTags[0];

  const handleUpdate = (field: "title" | "description", val: string) => {
    setMetaTags((prev) =>
      prev.map((m) => (m.id === current.id ? { ...m, [field]: val, status: "optimized" } : m))
    );
  };

  const handleAIOptimize = () => {
    const aiTitle = `Verified ${current.path.replace("/", "") || "Textile"} Exporters & Wholesale Fabric Sourcing | Bell24h`;
    const aiDesc = `Source certified textiles directly from Indian mills with milestone-based trade escrow and instant RFQ pricing on Bell24h.`;
    handleUpdate("title", aiTitle);
    handleUpdate("description", aiDesc);
    showToast("AI Generated high-CTR title and meta description!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pages list on left */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Catalog Pages ({metaTags.length})</h3>
        <div className="space-y-1.5">
          {metaTags.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                m.id === current.id
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="font-mono">{m.path}</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{m.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Live SERP Preview on right */}
      <div className="lg:col-span-2 space-y-5">
        {/* SERP PREVIEW BOX */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Google SERP Live Preview</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium ${
                  previewMode === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium ${
                  previewMode === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>
          </div>

          {/* Actual Google SERP Mock */}
          <div
            className={`p-4 bg-white border border-slate-200 rounded-lg space-y-1 ${
              previewMode === "mobile" ? "max-w-sm mx-auto shadow-md" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                B
              </div>
              <div className="truncate">
                https://bell24h.com{current.path === "/" ? "" : current.path}
              </div>
            </div>
            <div className="text-base text-blue-800 hover:underline font-normal cursor-pointer leading-tight line-clamp-1">
              {current.title}
            </div>
            <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {current.description}
            </div>
          </div>
        </div>

        {/* Edit Inputs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs md:text-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Edit Meta Snippet for {current.path}</h4>
            <button
              onClick={handleAIOptimize}
              className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-semibold hover:bg-purple-100"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI One-Click Optimize
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-semibold text-slate-700">Meta Title</label>
              <span
                className={`font-mono text-xs ${
                  current.title.length > 60 ? "text-red-500 font-bold" : "text-emerald-600"
                }`}
              >
                {current.title.length} / 60 chars
              </span>
            </div>
            <input
              type="text"
              value={current.title}
              onChange={(e) => handleUpdate("title", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-semibold text-slate-700">Meta Description</label>
              <span
                className={`font-mono text-xs ${
                  current.description.length > 160 ? "text-red-500 font-bold" : "text-emerald-600"
                }`}
              >
                {current.description.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={current.description}
              onChange={(e) => handleUpdate("description", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 6. SCHEMA GENERATOR TAB COMPONENT */
function SchemaTab({
  schemas,
  setSchemas,
  showToast
}: {
  schemas: SchemaItem[];
  setSchemas: React.Dispatch<React.SetStateAction<SchemaItem[]>>;
  showToast: (msg: string) => void;
}) {
  const [selectedType, setSelectedType] = useState<any>("Organization");
  const [copied, setCopied] = useState(false);

  const activeSchema = schemas.find((s) => s.type === selectedType) || schemas[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSchema.jsonLd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Schema JSON-LD copied to clipboard!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Schema Generator</h3>
        <p className="text-xs text-slate-500">
          Select schema type to generate rich results structured data compliant with Google specifications.
        </p>

        <div className="space-y-1.5">
          {["Organization", "Product", "FAQPage"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left p-3 rounded-lg text-xs font-semibold border transition-colors ${
                selectedType === type
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{type} Schema</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  JSON-LD
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900">JSON-LD Output: {selectedType}</h4>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-[420px]">
          {activeSchema.jsonLd}
        </pre>
      </div>
    </div>
  );
}

/* 7. BACKLINKS TAB COMPONENT */
function BacklinksTab({
  backlinks,
  showToast
}: {
  backlinks: BacklinkItem[];
  showToast: (msg: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Domain Authority (DA)</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">46 / 100</div>
          <span className="text-xs text-emerald-600 font-medium">+4 points in 90 days</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Referring Domains</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">184</div>
          <span className="text-xs text-slate-500">78% Dofollow ratio</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Backlinks</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">3,420</div>
          <span className="text-xs text-emerald-600 font-medium">0 Toxic links detected</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Disavow Protection</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">Active</div>
          <span className="text-xs text-slate-500">Automated spam filter</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">High-Authority Referring Backlinks</h3>
          <button
            onClick={() => showToast("Disavow file generated and ready for Google Search Console!")}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 border px-3 py-1 rounded-lg"
          >
            Export Disavow Rules (.txt)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Referring Domain</th>
                <th className="py-3 px-4">Target Landing Page</th>
                <th className="py-3 px-3">Anchor Text</th>
                <th className="py-3 px-3 text-center">DA</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">First Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {backlinks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{b.sourceDomain}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                      {b.sourceUrl}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">{b.targetUrl}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">"{b.anchorText}"</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700">{b.domainAuthority}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        b.isDoFollow ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {b.isDoFollow ? "Dofollow" : "Nofollow"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-xs">{b.firstSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 8. GEO (GENERATIVE ENGINE OPTIMIZATION) TAB COMPONENT */
function GEOTab({
  citations,
  setCitations,
  showToast
}: {
  citations: GEOCitation[];
  setCitations: React.Dispatch<React.SetStateAction<GEOCitation[]>>;
  showToast: (msg: string) => void;
}) {
  const [testQuery, setTestQuery] = useState("Best Indian textile manufacturer for bulk cotton yarn");
  const [testing, setTesting] = useState(false);

  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      const newCit: GEOCitation = {
        id: "geo-" + Date.now(),
        query: testQuery,
        engine: "Perplexity",
        isCited: true,
        rank: 1,
        citedUrl: "https://bell24h.com/marketplace/cotton",
        snippet: `Perplexity cited Bell24h as a verified trade partner for "${testQuery}".`,
        sentiment: "positive",
        lastChecked: "Just now"
      };
      setCitations([newCit, ...citations]);
      showToast("GEO Query simulated across LLM citation indexes!");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Generative Engine Optimization (GEO) &amp; AI Visibility
          </h3>
        </div>
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-4xl">
          Modern enterprise B2B buyers now query ChatGPT, Perplexity, Gemini, Claude, and Google AI Overviews directly instead of clicking standard links. GEO monitors and optimizes Bell24h entity citations, factual verification, and brand authority across all leading AI engines.
        </p>
      </div>

      {/* Query Tester */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h4 className="font-bold text-sm text-slate-900">Simulate AI Search Citation Check</h4>
        <form onSubmit={handleRunTest} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter search prompt to audit in LLM citation indices..."
            className="flex-1 px-3.5 py-2 text-xs md:text-sm border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={testing}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs md:text-sm rounded-lg shadow-xs disabled:opacity-50 flex items-center gap-1.5"
          >
            {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {testing ? "Analyzing..." : "Audit Citations"}
          </button>
        </form>
      </div>

      {/* Citations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {citations.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{c.engine} Search</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.isCited ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                }`}
              >
                {c.isCited ? `Cited · Position #${c.rank}` : "No Direct Citation"}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-semibold italic">"{c.query}"</div>
            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border leading-relaxed">
              {c.snippet}
            </p>
            {c.citedUrl && (
              <div className="text-[11px] text-emerald-600 font-mono flex items-center gap-1 truncate">
                <ExternalLink className="w-3 h-3" /> {c.citedUrl}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* 9. CONTENT OPTIMIZER TAB COMPONENT */
function ContentOptimizerTab({ showToast }: { showToast: (msg: string) => void }) {
  const [content, setContent] = useState(
    `# Sourcing High-Grade Combed Cotton Yarn from India

India is the global powerhouse for ring spun combed cotton yarn. With dedicated manufacturing hubs in Tirupur, Coimbatore, and Gujarat, international buyers can procure Ne 30/1, 40/1, and 60/1 counts with high CSP (Count Strength Product) and minimal imperfections.

All consignments through Bell24h / VyaparSethu are covered under milestone-based trade escrow with pre-shipment SGS laboratory verification.`
  );

  const [score, setScore] = useState(86);

  const handleGenerateArticle = () => {
    setContent(
      `# Complete B2B Guide: Sourcing Surat Synthetic Fabrics & Silk Wholesale

Surat produces over 40 million meters of synthetic fabric daily, specializing in polyester georgette, chiffon, crepe, and blended jacquards. 

### Why Choose Surat for Fabric Exports?
1. Competitive Pricing: Mill-direct pricing bypassing middlemen.
2. Rapid Turnaround: Standard lab-dips delivered within 5 business days.
3. Strict Quality Control: OEKO-TEX Standard 100 compliance on all dyed lots.

### Trade Security with Bell24h Escrow
To eliminate counterparty risk, VyaparSethu holds buyer deposits in an RBI-regulated escrow until third-party container inspection is verified.`
    );
    setScore(94);
    showToast("AI SEO Writer generated a structured B2B article!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">SEO Content Grader &amp; AI Writer</h3>
          <button
            onClick={handleGenerateArticle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI SEO Writer
          </button>
        </div>

        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3.5 text-xs md:text-sm border rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
        />
      </div>

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <span className="text-xs font-semibold text-slate-500 uppercase">Content SEO Score</span>
          <div className="text-3xl font-extrabold text-emerald-600">{score} / 100</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-slate-500">Readability: Grade 9 &bull; Word Count: 184 words</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
          <h4 className="font-bold text-sm text-slate-900">Semantic Topic Checklist</h4>
          {[
            { term: "combed cotton yarn", ok: true },
            { term: "Tirupur manufacturing", ok: true },
            { term: "trade escrow protection", ok: true },
            { term: "OEKO-TEX certification", ok: true },
            { term: "Incoterms 2020 FOB/CIF", ok: false }
          ].map((t) => (
            <div key={t.term} className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-700 font-medium">{t.term}</span>
              {t.ok ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Included
                </span>
              ) : (
                <span className="text-amber-500 font-semibold">Missing</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 10. COMPETITORS TAB COMPONENT */
function CompetitorsTab({
  gaps,
  onAddKeyword
}: {
  gaps: CompetitorGap[];
  onAddKeyword: (kw: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-base text-slate-900">Competitor Content Gap Matrix</h3>
        <p className="text-xs text-slate-500">
          High-value keywords where competitors (IndiaMART, Alibaba, Fibre2Fashion) hold Page 1 rankings but Bell24h is unranked or low-ranked.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Opportunity Keyword</th>
                <th className="py-3 px-3">Volume</th>
                <th className="py-3 px-3">KD%</th>
                <th className="py-3 px-3 text-center">Our Rank</th>
                <th className="py-3 px-3">IndiaMART</th>
                <th className="py-3 px-3">Alibaba</th>
                <th className="py-3 px-3">Fibre2Fashion</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{g.keyword}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{g.volume.toLocaleString()}</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{g.difficulty}%</td>
                  <td className="py-3 px-3 text-center">
                    {g.ourPosition ? (
                      <span className="font-bold text-slate-900">#{g.ourPosition}</span>
                    ) : (
                      <span className="text-red-500 font-semibold text-xs">Unranked</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">
                    #{g.competitors["indiamart.com"] || "-"}
                  </td>
                  <td className="py-3 px-3 font-semibold text-blue-700">
                    #{g.competitors["alibaba.com"] || "-"}
                  </td>
                  <td className="py-3 px-3 font-semibold text-purple-700">
                    #{g.competitors["fibre2fashion.com"] || "-"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onAddKeyword(g.keyword)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    >
                      Target Keyword
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 11. LOCAL SEO TAB COMPONENT */
function LocalSEOTab({
  hubs,
  showToast
}: {
  hubs: LocalHubSEO[];
  showToast: (msg: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <h3 className="font-bold text-base text-slate-900">Regional Textile Hubs &amp; NAP Consistency</h3>
        <p className="text-xs text-slate-500">
          Tracking local pack rankings, verified trade association profiles, and Name/Address/Phone (NAP) consistency across major manufacturing clusters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((hub) => (
          <div key={hub.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{hub.city}</h4>
                <span className="text-xs text-slate-500">{hub.state}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">NAP Consistency:</span>
                <span className="font-bold text-emerald-600">{hub.napConsistency}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Local Citations:</span>
                <span className="font-bold text-slate-800">{hub.citationsCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[11px] font-semibold text-slate-600">Top Local Pack Rank:</span>
              {hub.topKeywords.map((k) => (
                <div key={k.keyword} className="flex justify-between text-xs text-slate-700">
                  <span className="truncate max-w-[130px]">{k.keyword}</span>
                  <span className="font-bold text-emerald-600">#{k.rank}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 12. SITEMAPS & ROBOTS TAB COMPONENT */
function SitemapTab({
  redirects,
  setRedirects,
  showToast
}: {
  redirects: RedirectRule[];
  setRedirects: React.Dispatch<React.SetStateAction<RedirectRule[]>>;
  showToast: (msg: string) => void;
}) {
  const [robotsTxt, setRobotsTxt] = useState(
    `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/

Sitemap: https://bell24h.com/sitemap.xml
Sitemap: https://bell24h.com/sitemap-products.xml
Sitemap: https://bell24h.com/sitemap-suppliers.xml`
  );

  const handleGenerateSitemap = () => {
    showToast("Generated fresh XML sitemap with 148 verified canonical URLs!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sitemaps card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">XML Sitemaps Index</h3>
          <button
            onClick={handleGenerateSitemap}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
          >
            Generate Fresh Sitemaps
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { url: "https://bell24h.com/sitemap.xml", pages: 148, status: "200 OK - Indexed" },
            { url: "https://bell24h.com/sitemap-products.xml", pages: 52, status: "200 OK - Indexed" },
            { url: "https://bell24h.com/sitemap-suppliers.xml", pages: 38, status: "200 OK - Indexed" }
          ].map((s) => (
            <div key={s.url} className="p-3 bg-slate-50 rounded-lg border flex justify-between items-center">
              <div>
                <div className="font-mono font-semibold text-slate-800">{s.url}</div>
                <div className="text-slate-500 mt-0.5">{s.pages} valid entries</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                {s.status}
              </span>
            </div>
          ))}
        </div>

        {/* 301 Redirect Rules */}
        <div className="pt-3 border-t space-y-2">
          <h4 className="font-bold text-xs text-slate-900">Active 301/302 Redirect Rules ({redirects.length})</h4>
          {redirects.map((r) => (
            <div key={r.id} className="p-2 bg-slate-50 rounded border text-xs flex justify-between font-mono">
              <span className="text-slate-600 truncate max-w-[200px]">{r.source} &rarr; {r.target}</span>
              <span className="text-emerald-700 font-bold">{r.statusCode} ({r.hits} hits)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Robots.txt editor */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Robots.txt Directive Editor</h3>
        <textarea
          rows={12}
          value={robotsTxt}
          onChange={(e) => setRobotsTxt(e.target.value)}
          className="w-full p-3 font-mono text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        <button
          onClick={() => showToast("Robots.txt directives saved & published to root server!")}
          className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
        >
          Save Robots.txt
        </button>
      </div>
    </div>
  );
}

export default SEOCenter;
