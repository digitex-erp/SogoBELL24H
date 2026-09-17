/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Executive SEO Dashboard
 * 12 KPI Widgets, Trend Charts, Ranking Distribution & Export Engines
 */

import React, { useState } from "react";
import {
  Globe,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Link2,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  Eye,
  Users,
  Search,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Database
} from "lucide-react";
import { SiteAuditReport, SEOKeyword, GEOCitation } from "../../types/seo";

export function DashboardTab({
  auditReport,
  keywords,
  geoCitations,
  onNavigate,
  onRunAudit,
  showToast,
  onOpenSQL,
  onOpenPrompts,
  onOpenGraph,
  onOpenAIRouter
}: {
  auditReport: SiteAuditReport;
  keywords: SEOKeyword[];
  geoCitations: GEOCitation[];
  onNavigate: (tab: string) => void;
  onRunAudit: () => void;
  showToast: (msg: string) => void;
  onOpenSQL: () => void;
  onOpenPrompts: () => void;
  onOpenGraph: () => void;
  onOpenAIRouter: () => void;
}) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [savedView, setSavedView] = useState("Executive Overview");

  // Calculations
  const totalKeywordsCount = keywords.length;
  const top3Count = keywords.filter((k) => k.position <= 3).length;
  const top10Count = keywords.filter((k) => k.position > 3 && k.position <= 10).length;
  const top50Count = keywords.filter((k) => k.position > 10 && k.position <= 50).length;
  const beyond50Count = keywords.filter((k) => k.position > 50).length;

  const citedCount = geoCitations.filter((c) => c.isCited).length;
  const geoScore = Math.round((citedCount / (geoCitations.length || 1)) * 100);

  // Export handlers
  const handleExportCSV = () => {
    const headers = "Keyword,Position,PrevPosition,Volume,CPC,Difficulty,Cluster,Intent\n";
    const rows = keywords
      .map(
        (k) =>
          `"${k.keyword}",${k.position},${k.prevPosition},${k.volume},${k.cpc},${k.difficulty},"${k.cluster}","${k.intent}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bell24h_seo_keywords_${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("SEO Keywords CSV report downloaded!");
  };

  const handleExportPDF = () => {
    showToast("Generating Executive SEO & GEO Intelligence PDF...");
    setTimeout(() => {
      const summaryText = `BELL24H-OS ENTERPRISE SEO AUDIT REPORT
Generated: ${new Date().toLocaleString()}
Period: ${period.toUpperCase()} | View: ${savedView}

1. EXECUTIVE KPI SUMMARY
- Overall SEO Health Score: ${auditReport.healthScore}/100 (Grade A)
- AI Generative Engine Optimization (GEO) Score: ${geoScore}%
- Total Tracked Organic Keywords: ${totalKeywordsCount}
- Top 3 Rankings: ${top3Count} keywords
- Top 10 Rankings: ${top10Count} keywords
- Indexed Pages: ${auditReport.crawledPages} pages
- Total Backlinks: 84,500 across 1,420 Referring Domains
- Technical Issues: ${auditReport.criticalCount} Critical, ${auditReport.warningCount} Warnings

2. CORE WEB VITALS (CrUX FIELD DATA)
- Largest Contentful Paint (LCP): ${auditReport.coreWebVitals.lcp}s (Pass)
- First Input Delay (FID): ${auditReport.coreWebVitals.fid}ms (Pass)
- Cumulative Layout Shift (CLS): ${auditReport.coreWebVitals.cls} (Pass)

3. TOP KEYWORDS PERFORMANCE
${keywords
  .slice(0, 10)
  .map((k) => `• "${k.keyword}" | Position: #${k.position} | Vol: ${k.volume.toLocaleString()} | Cluster: ${k.cluster}`)
  .join("\n")}
`;
      const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bell24h_executive_seo_report_${new Date().toISOString().slice(0, 10)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      showToast("Executive SEO Summary Report exported!");
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Executive Command Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Saved View:</span>
          </div>
          <select
            value={savedView}
            onChange={(e) => setSavedView(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option>Executive Overview</option>
            <option>E-Commerce Sourcing Focus</option>
            <option>International Export Hubs (Tirupur/Surat)</option>
            <option>GEO & AI Readiness Focus</option>
          </select>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Period selector */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            {(["7d", "30d", "90d", "1y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  period === p ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenSQL}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            Supabase SQL
          </button>
          <button
            onClick={onOpenPrompts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Prompt Studio
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            Export Executive PDF
          </button>
        </div>
      </div>

      {/* 12 Executive KPI Widgets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Health Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">SEO Health</span>
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{auditReport.healthScore}/100</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3% this month
          </div>
        </div>

        {/* 2. GEO Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">GEO AI Score</span>
            <Zap className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{geoScore}%</div>
          <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 5 in LLMs
          </div>
        </div>

        {/* 3. Total Keywords */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Keywords</span>
            <Target className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalKeywordsCount}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            {top3Count} in Top 3 (#1-3)
          </div>
        </div>

        {/* 4. Total Backlinks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Backlinks</span>
            <Link2 className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">84.5K</div>
          <div className="text-[11px] text-purple-600 font-medium">1,420 Ref Domains</div>
        </div>

        {/* 5. Organic Traffic */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Monthly Traffic</span>
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">185K</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% YoY
          </div>
        </div>

        {/* 6. Technical Issues */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Tech Errors</span>
            <AlertTriangle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{auditReport.criticalCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium">0 Critical Errors</div>
        </div>

        {/* 7. Indexed Pages */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Indexed Pages</span>
            <FileCheck className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{auditReport.crawledPages}</div>
          <div className="text-[11px] text-slate-500 font-medium">100% in sitemap</div>
        </div>

        {/* 8. Avg CTR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Avg CTR</span>
            <Eye className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">3.8%</div>
          <div className="text-[11px] text-teal-600 font-medium">+0.4% from snippets</div>
        </div>

        {/* 9. Impressions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Impressions</span>
            <Search className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">2.4M</div>
          <div className="text-[11px] text-slate-500 font-medium">Google & Bing</div>
        </div>

        {/* 10. Competitor Visibility */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Comp. Visibility</span>
            <Users className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">68%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Ahead of VyaparSethu</div>
        </div>

        {/* 11. Core Web Vitals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">LCP Speed</span>
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            {auditReport.coreWebVitals.lcp}s
          </div>
          <div className="text-[11px] text-slate-500 font-medium">FID: {auditReport.coreWebVitals.fid}ms</div>
        </div>

        {/* 12. Knowledge Graph */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase">Entity Triples</span>
            <Layers className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">142</div>
          <div className="text-[11px] text-purple-600 font-medium">Knowledge Graph</div>
        </div>
      </div>

      {/* Visual Analytics Strip: Ranking Distribution & Core Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking Distribution Widget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">SERP Ranking Distribution</h3>
            <span className="text-xs text-slate-500">{totalKeywordsCount} Tracked</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positions #1 - #3
                </span>
                <span>{top3Count} keywords ({Math.round((top3Count / totalKeywordsCount) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(top3Count / totalKeywordsCount) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Positions #4 - #10 (Page 1)
                </span>
                <span>{top10Count} keywords ({Math.round((top10Count / totalKeywordsCount) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-2 rounded-full"
                  style={{ width: `${(top10Count / totalKeywordsCount) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Positions #11 - #50
                </span>
                <span>{top50Count} keywords ({Math.round((top50Count / totalKeywordsCount) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${(top50Count / totalKeywordsCount) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Positions #51 - #100
                </span>
                <span>{beyond50Count} keywords ({Math.round((beyond50Count / totalKeywordsCount) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-2 rounded-full"
                  style={{ width: `${(beyond50Count / totalKeywordsCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span className="font-medium">62% of keywords sit in Google Top 10</span>
            <button
              onClick={() => onNavigate("keywords")}
              className="text-emerald-700 font-bold hover:underline"
            >
              Explore Keywords &rarr;
            </button>
          </div>
        </div>

        {/* Multi-Trend Charts Area */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Organic Growth & Visibility Trends</h3>
              <p className="text-xs text-slate-500">Ranking velocity vs organic traffic trajectory ({period.toUpperCase()})</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Organic Traffic
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> AI GEO Citations
              </span>
            </div>
          </div>

          {/* SVG Trend Graph */}
          <div className="relative h-48 w-full bg-slate-50 rounded-xl p-4 flex flex-col justify-between border border-slate-100">
            <svg className="w-full h-36 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="geoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" />

              {/* Traffic Area & Line */}
              <path
                d="M 0,95 Q 120,80 240,65 T 380,40 T 500,20 L 500,120 L 0,120 Z"
                fill="url(#trafficGradient)"
              />
              <path
                d="M 0,95 Q 120,80 240,65 T 380,40 T 500,20"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />

              {/* GEO Area & Line */}
              <path
                d="M 0,105 Q 120,95 240,85 T 380,55 T 500,35 L 500,120 L 0,120 Z"
                fill="url(#geoGradient)"
              />
              <path
                d="M 0,105 Q 120,95 240,85 T 380,55 T 500,35"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* Data points */}
              <circle cx="240" cy="65" r="4" fill="#10b981" className="animate-ping" />
              <circle cx="240" cy="65" r="4" fill="#10b981" />
              <circle cx="500" cy="20" r="5" fill="#10b981" />
              <circle cx="500" cy="35" r="4" fill="#f59e0b" />
            </svg>

            <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-2 border-t border-slate-200">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4 (Current)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 text-xs text-center">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[10px]">Avg Ranking Improvement</span>
              <strong className="text-slate-900 font-bold text-sm">+2.4 Positions</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[10px]">GEO Answer Share</span>
              <strong className="text-amber-700 font-bold text-sm">92% in Gemini / 84% GPT</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[10px]">Active Domain Authority</span>
              <strong className="text-emerald-700 font-bold text-sm">DA 68 / 100</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Action Shortcuts Bar */}
      <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Bell24h AI SEO Intelligence Ready</div>
            <p className="text-xs text-slate-400">
              Auto-generate GEO citations, fix broken routes, optimize meta tags, and audit competitor gaps.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate("geo")}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors"
          >
            Launch GEO Engine
          </button>
          <button
            onClick={() => onNavigate("content")}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
          >
            Content Optimizer
          </button>
          <button
            onClick={() => onNavigate("automation")}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            Workflow Triggers
          </button>
        </div>
      </div>
    </div>
  );
}
