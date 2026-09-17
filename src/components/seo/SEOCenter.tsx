/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center v3.0
 * 12 Enterprise SEO & GEO Intelligence Modules + Supabase SQL Studio, Prompt Studio & Knowledge Graph
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Globe,
  Target,
  Zap,
  CheckCircle,
  RefreshCw,
  FileText,
  Code,
  Sparkles,
  Users,
  Link2,
  MapPin,
  TrendingUp,
  Cpu,
  Database,
  Share2,
  Terminal,
  Download,
  AlertTriangle,
  Search,
  ChevronRight
} from "lucide-react";
import {
  SEOKeyword,
  SiteAuditReport,
  PageMetaTags,
  SEOSchemaItem,
  BacklinkItem,
  GEOCitation,
  CompetitorGap,
  LocalHubData,
  RedirectRule
} from "../../types/seo";
import {
  INITIAL_KEYWORDS,
  INITIAL_AUDIT_REPORT,
  INITIAL_PAGE_META_TAGS,
  INITIAL_SEO_SCHEMAS,
  INITIAL_BACKLINKS,
  INITIAL_GEO_CITATIONS,
  INITIAL_COMPETITOR_GAPS,
  INITIAL_LOCAL_HUBS_DATA,
  INITIAL_REDIRECTS
} from "../../services/seoData";

// Modular Sub-Components
import { DashboardTab } from "./DashboardTab";
import { KeywordsTab } from "./KeywordsTab";
import { GEOTab } from "./GEOTab";
import { AuditTab } from "./AuditTab";
import { MetaTagsTab } from "./MetaTagsTab";
import { SchemaTab } from "./SchemaTab";
import { ContentTab } from "./ContentTab";
import { CompetitorsTab } from "./CompetitorsTab";
import { BacklinksTab } from "./BacklinksTab";
import { LocalSEOTab } from "./LocalSEOTab";
import { RankTrackerTab } from "./RankTrackerTab";
import { AutomationTab } from "./AutomationTab";
import { SitemapTab } from "./SitemapTab";

// Modals
import {
  SupabaseSQLModal,
  PromptStudioDrawer,
  KnowledgeGraphModal,
  AIRouterModal
} from "./Modals";

export function SEOCenter({ initialTab }: { initialTab?: string } = {}) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab) return initialTab;
    if (typeof window !== "undefined" && (window as any).__SEO_INITIAL_TAB) {
      const tab = (window as any).__SEO_INITIAL_TAB;
      (window as any).__SEO_INITIAL_TAB = undefined;
      return tab;
    }
    return "dashboard";
  });

  useEffect(() => {
    const handleSwitchTab = (e: any) => {
      if (e?.detail) setActiveTab(e.detail);
    };
    window.addEventListener("seo:switch-tab", handleSwitchTab);
    return () => window.removeEventListener("seo:switch-tab", handleSwitchTab);
  }, []);

  // Core State
  const [keywords, setKeywords] = useState<SEOKeyword[]>(INITIAL_KEYWORDS);
  const [auditReport, setAuditReport] = useState<SiteAuditReport>(INITIAL_AUDIT_REPORT);
  const [metaTags, setMetaTags] = useState<PageMetaTags[]>(INITIAL_PAGE_META_TAGS);
  const [schemas, setSchemas] = useState<SEOSchemaItem[]>(INITIAL_SEO_SCHEMAS);
  const [backlinks, setBacklinks] = useState<BacklinkItem[]>(INITIAL_BACKLINKS);
  const [geoCitations, setGeoCitations] = useState<GEOCitation[]>(INITIAL_GEO_CITATIONS);
  const [competitorGaps, setCompetitorGaps] = useState<CompetitorGap[]>(INITIAL_COMPETITOR_GAPS);
  const [localHubs, setLocalHubs] = useState<LocalHubData[]>(INITIAL_LOCAL_HUBS_DATA);
  const [redirects, setRedirects] = useState<RedirectRule[]>(INITIAL_REDIRECTS);

  // Filter & Search states
  const [kwSearch, setKwSearch] = useState("");
  const [kwClusterFilter, setKwClusterFilter] = useState("all");
  const [kwIntentFilter, setKwIntentFilter] = useState("all");

  // Audit state
  const [isAuditing, setIsAuditing] = useState(false);

  // Modal states
  const [isSQLModalOpen, setIsSQLModalOpen] = useState(false);
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isAIRouterOpen, setIsAIRouterOpen] = useState(false);
  const [activeAIModel, setActiveAIModel] = useState("gemini-1.5-pro");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Re-run Audit
  const handleRunAudit = () => {
    setIsAuditing(true);
    showToast("Bell24h Technical Crawler started (crawling 1,420 HTML pages)...");
    setTimeout(() => {
      setIsAuditing(false);
      setAuditReport((prev) => ({
        ...prev,
        healthScore: 92,
        crawledPages: prev.crawledPages + 16,
        lastRun: new Date().toISOString(),
        warningCount: Math.max(0, prev.warningCount - 2)
      }));
      showToast("Technical crawl completed! SEO Health Score updated to 92/100.");
    }, 1400);
  };

  // Keyword operations
  const handleAddKeyword = (newKw: SEOKeyword) => {
    setKeywords((prev) => [newKw, ...prev]);
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
    showToast("Keyword removed from tracking ledger.");
  };

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

  const clusters = useMemo(() => {
    const set = new Set<string>();
    keywords.forEach((k) => set.add(k.cluster));
    return Array.from(set);
  }, [keywords]);

  // Tab definitions
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Globe },
    { id: "keywords", label: "Keyword Intel", icon: Target },
    { id: "geo", label: "GEO Engine (AI SEO)", icon: Zap },
    { id: "audit", label: "Technical Audit", icon: CheckCircle },
    { id: "meta", label: "Meta Tags", icon: FileText },
    { id: "schema", label: "Schema.org", icon: Code },
    { id: "content", label: "Content Intel", icon: Sparkles },
    { id: "competitors", label: "Competitors", icon: Users },
    { id: "backlinks", label: "Backlinks", icon: Link2 },
    { id: "local", label: "Local SEO", icon: MapPin },
    { id: "rank-tracker", label: "Rank Tracker", icon: TrendingUp },
    { id: "automation", label: "SEO Automation", icon: Cpu },
    { id: "sitemap", label: "Sitemaps & Robots", icon: Terminal }
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Command Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                SEO Center
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Enterprise v3.0
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Zap className="w-3 h-3" /> GEO AI Enabled
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                Active: {activeAIModel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enterprise search intelligence, Generative Engine Optimization (GEO), structured schema markup, and competitor gap auditing.
            </p>
          </div>
        </div>

        {/* Global Architecture Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSQLModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
            title="View 13-Table PostgreSQL / Supabase Schema"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Supabase SQL
          </button>
          <button
            onClick={() => setIsPromptDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
            title="Open Prompt Studio Presets"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Prompt Studio
          </button>
          <button
            onClick={() => setIsGraphModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
            title="Explore Knowledge Graph"
          >
            <Share2 className="w-3.5 h-3.5" />
            Knowledge Graph
          </button>
          <button
            onClick={() => setIsAIRouterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors"
            title="Select Active AI Model"
          >
            <Cpu className="w-3.5 h-3.5" />
            AI Router
          </button>
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
            {isAuditing ? "Auditing..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* 12-Module Tab Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT SWITCHER */}
      <div>
        {/* 1. SEO DASHBOARD */}
        {activeTab === "dashboard" && (
          <DashboardTab
            auditReport={auditReport}
            keywords={keywords}
            geoCitations={geoCitations}
            onNavigate={(t) => setActiveTab(t)}
            onRunAudit={handleRunAudit}
            showToast={showToast}
            onOpenSQL={() => setIsSQLModalOpen(true)}
            onOpenPrompts={() => setIsPromptDrawerOpen(true)}
            onOpenGraph={() => setIsGraphModalOpen(true)}
            onOpenAIRouter={() => setIsAIRouterOpen(true)}
          />
        )}

        {/* 2. KEYWORD INTELLIGENCE */}
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
            onAddKeyword={handleAddKeyword}
            showToast={showToast}
          />
        )}

        {/* 3. GEO ENGINE (AI SEARCH OPTIMIZATION) */}
        {activeTab === "geo" && (
          <GEOTab
            citations={geoCitations}
            setCitations={setGeoCitations}
            showToast={showToast}
            onOpenGraph={() => setIsGraphModalOpen(true)}
            onOpenAIRouter={() => setIsAIRouterOpen(true)}
          />
        )}

        {/* 4. TECHNICAL SEO AUDIT */}
        {activeTab === "audit" && (
          <AuditTab
            report={auditReport}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
            setReport={setAuditReport}
            showToast={showToast}
          />
        )}

        {/* 5. META TAG MANAGER */}
        {activeTab === "meta" && (
          <MetaTagsTab
            metaTags={metaTags}
            setMetaTags={setMetaTags}
            showToast={showToast}
          />
        )}

        {/* 6. SCHEMA.ORG MANAGER */}
        {activeTab === "schema" && (
          <SchemaTab
            schemas={schemas}
            setSchemas={setSchemas}
            showToast={showToast}
          />
        )}

        {/* 7. CONTENT INTELLIGENCE */}
        {activeTab === "content" && <ContentTab showToast={showToast} />}

        {/* 8. COMPETITOR INTELLIGENCE */}
        {activeTab === "competitors" && (
          <CompetitorsTab
            gaps={competitorGaps}
            onAddKeyword={(kw) => {
              const newK: SEOKeyword = {
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
              };
              handleAddKeyword(newK);
              showToast(`Targeted competitor keyword "${kw}" added to Tracker!`);
            }}
            showToast={showToast}
          />
        )}

        {/* 9. BACKLINK INTELLIGENCE */}
        {activeTab === "backlinks" && (
          <BacklinksTab backlinks={backlinks} showToast={showToast} />
        )}

        {/* 10. LOCAL SEO & REGIONAL HUBS */}
        {activeTab === "local" && (
          <LocalSEOTab hubs={localHubs} showToast={showToast} />
        )}

        {/* 11. RANK TRACKER */}
        {activeTab === "rank-tracker" && <RankTrackerTab showToast={showToast} />}

        {/* 12. SEO AUTOMATION & WORKFLOW ENGINE */}
        {activeTab === "automation" && <AutomationTab showToast={showToast} />}

        {/* 13. SITEMAPS & ROBOTS */}
        {activeTab === "sitemap" && (
          <SitemapTab
            redirects={redirects}
            setRedirects={setRedirects}
            showToast={showToast}
          />
        )}
      </div>

      {/* Integrated Modals */}
      <SupabaseSQLModal
        isOpen={isSQLModalOpen}
        onClose={() => setIsSQLModalOpen(false)}
        showToast={showToast}
      />

      <PromptStudioDrawer
        isOpen={isPromptDrawerOpen}
        onClose={() => setIsPromptDrawerOpen(false)}
        showToast={showToast}
      />

      <KnowledgeGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
      />

      <AIRouterModal
        isOpen={isAIRouterOpen}
        onClose={() => setIsAIRouterOpen(false)}
        activeModel={activeAIModel}
        setActiveModel={setActiveAIModel}
        showToast={showToast}
      />
    </div>
  );
}

export default SEOCenter;
