/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Competitor Intelligence
 * Head-to-Head Benchmarking (VyaparSethu, SamplingHub, IndiaMART, Alibaba) & Keyword Gap Matrix
 */

import React from "react";
import {
  Users,
  Plus,
  TrendingUp,
  Download,
  Target,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from "lucide-react";
import { CompetitorGap } from "../../types/seo";
import { INITIAL_COMPETITORS } from "../../services/seoData";

export function CompetitorsTab({
  gaps,
  onAddKeyword,
  showToast
}: {
  gaps: CompetitorGap[];
  onAddKeyword: (kw: string) => void;
  showToast: (msg: string) => void;
}) {
  const handleExportGapReport = () => {
    const headers = "Keyword,Competitor,TheirPosition,OurPosition,SearchVolume,Opportunity\n";
    const rows = gaps
      .map(
        (g) =>
          `"${g.keyword}","${g.competitor}",${g.competitorRank},${g.ourRank || "Unranked"},${g.searchVolume},"${g.opportunity}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bell24h_competitor_keyword_gaps.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Competitor Keyword Gap CSV Report downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Competitor Benchmarking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Marketplace SEO & GEO Benchmarking Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Cross-domain authority, organic keywords volume, and Generative AI visibility comparison.
            </p>
          </div>

          <button
            onClick={handleExportGapReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Gap Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Marketplace Entity</th>
                <th className="py-3 px-3">Domain Authority</th>
                <th className="py-3 px-3">Organic Keywords</th>
                <th className="py-3 px-3">Monthly Traffic</th>
                <th className="py-3 px-3">Backlinks</th>
                <th className="py-3 px-3">GEO AI Score</th>
                <th className="py-3 px-3">Content Overlap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {INITIAL_COMPETITORS.map((comp) => {
                const isBell24h = comp.domain.includes("bell24h");
                return (
                  <tr
                    key={comp.id}
                    className={`transition-colors ${isBell24h ? "bg-emerald-50/50 font-bold" : "hover:bg-slate-50"}`}
                  >
                    <td className="py-3 px-4 text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{comp.name}</span>
                        {isBell24h && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                            Current App
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">{comp.domain}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                        DA {comp.domainAuthority}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-800">
                      {comp.organicKeywords.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-slate-800">
                      {comp.organicTraffic.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-slate-800">
                      {comp.backlinksCount.toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{comp.geoScore}%</span>
                        <div className="w-10 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-1.5 rounded-full"
                            style={{ width: `${comp.geoScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      {comp.contentOverlapScore}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keyword Content Gap Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">High-Value Keyword Content Gaps</h3>
            <p className="text-xs text-slate-500">
              Keywords where competitors rank in Top 5 but Bell24h is in Top 15-30 or unranked
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
            {gaps.length} Actionable Gaps
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {gaps.map((gap) => {
            const compName = gap.competitor || Object.keys(gap.competitors || {})[0] || "Competitor";
            const compRank = gap.competitorRank || Object.values(gap.competitors || {})[0] || 1;
            const currentOurRank = gap.ourRank ?? gap.ourPosition;
            const vol = gap.searchVolume || gap.volume || 0;
            const opp = gap.opportunity || (gap.opportunityScore ? `Opportunity Score: ${gap.opportunityScore}%` : "High Opportunity");

            return (
              <div key={gap.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{gap.keyword}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                      Vol: {vol.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span>
                      Competitor: <strong className="text-slate-800">{compName}</strong> (#{compRank})
                    </span>
                    <span>•</span>
                    <span>
                      Bell24h Current: <strong className="text-slate-800">{currentOurRank ? `#${currentOurRank}` : "Unranked"}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">{opp}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => onAddKeyword(gap.keyword)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Target This Gap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
