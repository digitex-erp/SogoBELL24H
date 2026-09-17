/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Backlink Intelligence
 * Link Velocity, DA Distribution, Anchor Text Breakdown, Toxic Link Alerts & Disavow Generator
 */

import React from "react";
import {
  Link2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  FileCode
} from "lucide-react";
import { BacklinkItem } from "../../types/seo";

export function BacklinksTab({
  backlinks,
  showToast
}: {
  backlinks: BacklinkItem[];
  showToast: (msg: string) => void;
}) {
  const handleDownloadDisavow = () => {
    const disavowContent = `# Bell24h-OS Google Disavow File
# Generated: ${new Date().toISOString()}
# Toxic and spam scraping networks flagged by AI Risk Monitor

domain:lowquality-directory-farm.cc
domain:spam-textile-indexer.xyz
domain:scraped-auto-content-hub.top
`;
    const blob = new Blob([disavowContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bell24h_google_disavow.txt";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Google Search Console Disavow file generated & downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Backlinks</span>
          <div className="text-2xl font-extrabold text-slate-900">84,500</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +1,420 this month
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Referring Domains</span>
          <div className="text-2xl font-extrabold text-purple-600">1,420</div>
          <div className="text-[11px] text-purple-600 font-medium">92% DoFollow ratio</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Average Domain Rating</span>
          <div className="text-2xl font-extrabold text-slate-900">DR 68</div>
          <div className="text-[11px] text-emerald-600 font-medium">High Authority Tier</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Toxic Links Risk</span>
          <div className="text-2xl font-extrabold text-emerald-600">0.4%</div>
          <div className="text-[11px] text-slate-500 font-medium">Safely below penalty risk</div>
        </div>
      </div>

      {/* Anchor Text & Toxic Alerts Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anchor Text Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900">Anchor Text Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Branded: "Bell24h", "Bell24h Marketplace"</span>
                <span className="font-bold">48%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "48%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Exact Match: "textile escrow", "surat silk manufacturers"</span>
                <span className="font-bold">28%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "28%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Naked URLs: "bell24h.com", "https://bell24h.com"</span>
                <span className="font-bold">16%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "16%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Generic / Compound: "visit platform", "read more"</span>
                <span className="font-bold">8%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: "8%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Toxic Link Protection & Disavow */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>Spam & Disavow Guard</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bell24h automatically flags malicious PBNs, scraper mirrors, and negative SEO attacks for immediate Google disavowal.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <strong>Clean Profile:</strong> Only 3 low-authority scraper domains detected in current cycle.
          </div>

          <button
            onClick={handleDownloadDisavow}
            className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Google Disavow (.txt)
          </button>
        </div>
      </div>

      {/* Referring Domains Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">High-Authority Referring Backlinks Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Referring Source</th>
                <th className="py-3 px-3">Domain Rating</th>
                <th className="py-3 px-3">Anchor Text</th>
                <th className="py-3 px-3">Target URL</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">First Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {backlinks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900 font-semibold">
                    <div>{b.source}</div>
                    <span className="text-[10px] text-slate-400 font-normal">Indexed in Google Ahrefs db</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      DR {b.domainAuthority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 italic font-normal">"{b.anchorText}"</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{b.targetUrl}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.isDoFollow ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {b.isDoFollow ? "DoFollow" : "NoFollow"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
