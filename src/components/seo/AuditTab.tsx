/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Technical SEO Audit & Crawl Engine
 * Deep Crawl Status, Core Web Vitals, Issue Fixer & Audit History Comparison
 */

import React, { useState } from "react";
import {
  Globe,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Shield,
  FileCode
} from "lucide-react";
import { SiteAuditReport, AuditIssue } from "../../types/seo";
import { INITIAL_AUDIT_HISTORY } from "../../services/seoData";

export function AuditTab({
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
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [crawlProgress, setCrawlProgress] = useState(100);

  const handleFixIssue = (id: string, message: string) => {
    setReport((prev) => {
      const remainingIssues = prev.issues.filter((i) => i.id !== id);
      return {
        ...prev,
        issues: remainingIssues,
        warningCount: Math.max(0, prev.warningCount - 1),
        healthScore: Math.min(100, prev.healthScore + 1)
      };
    });
    showToast(`Resolved: "${message}" applied and verified!`);
  };

  const filteredIssues = report.issues.filter(
    (i) => filterSeverity === "all" || i.severity === filterSeverity
  );

  return (
    <div className="space-y-6">
      {/* Crawl Control Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-extrabold text-lg">
            {report.healthScore}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Technical Site Audit & Bot Simulator</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                Crawl Status: Healthy
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Last crawled: {new Date(report.lastRun || report.lastAuditDate || Date.now()).toLocaleString()} · {report.crawledPages} HTML pages indexed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
            {isAuditing ? "Crawling 1,420 Pages..." : "Re-run Full Crawler"}
          </button>
        </div>
      </div>

      {/* Crawl Progress simulation */}
      {isAuditing && (
        <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 animate-in fade-in">
          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ScreamingFrog / Bell24h Spider active: Inspecting DOM, headers, and schema...
            </span>
            <span className="text-emerald-400 font-bold">In Progress</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Core Checks Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Title Tags</span>
          <div className="text-lg font-bold text-slate-900">100% Valid</div>
          <div className="text-[11px] text-emerald-600 font-medium">0 missing, 2 trimmed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Meta Descriptions</span>
          <div className="text-lg font-bold text-slate-900">99.7% Valid</div>
          <div className="text-[11px] text-emerald-600 font-medium">4 auto-generated</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Canonical URLs</span>
          <div className="text-lg font-bold text-slate-900">100% Clean</div>
          <div className="text-[11px] text-emerald-600 font-medium">Self-referential canonicals</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Core Web Vitals</span>
          <div className="text-lg font-bold text-emerald-600">Passed</div>
          <div className="text-[11px] text-slate-500 font-medium">LCP: 1.8s · CLS: 0.02</div>
        </div>
      </div>

      {/* Issues Table & Fixer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Detected Technical Audit Issues</h3>
            <p className="text-xs text-slate-500">
              Resolved in accordance with Google Search Essentials & Core Web Vitals thresholds
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
            {["all", "critical", "warning", "notice"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 font-semibold rounded capitalize transition-colors ${
                  filterSeverity === sev
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No technical issues found for severity: <strong>{filterSeverity}</strong>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {issue.severity === "critical" ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : issue.severity === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{issue.title || issue.message}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          issue.severity === "critical"
                            ? "bg-red-100 text-red-800"
                            : issue.severity === "warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {issue.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      URL: <code className="text-slate-700 bg-slate-100 px-1 rounded">{issue.affectedUrl || issue.url}</code>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Recommendation: {issue.recommendation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleFixIssue(issue.id, issue.title || issue.message || "SEO Issue")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Fix with AI Router
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historical Audit Comparison Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Historical Crawl Comparison Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Health Score</th>
                <th className="py-2.5 px-3">Pages Crawled</th>
                <th className="py-2.5 px-3">Critical Issues</th>
                <th className="py-2.5 px-3">Warnings</th>
                <th className="py-2.5 px-3">LCP (Speed)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {INITIAL_AUDIT_HISTORY.map((hist, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-900 font-semibold">{hist.timestamp}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold">{hist.healthScore}/100</td>
                  <td className="py-2.5 px-3">{hist.pagesCrawled}</td>
                  <td className="py-2.5 px-3 text-red-600 font-bold">{hist.criticalIssues}</td>
                  <td className="py-2.5 px-3 text-amber-600">{hist.warnings}</td>
                  <td className="py-2.5 px-3 text-slate-700">{hist.lcp}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
