/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Rank Tracker
 * Daily Google & Bing Tracking, Desktop/Mobile/Local Segments & SERP Feature Badges
 */

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Monitor,
  Smartphone,
  Globe,
  Star,
  CheckCircle,
  Sparkles,
  Calendar,
  Layers
} from "lucide-react";
import { SEORankRecord } from "../../types/seo";
import { INITIAL_RANK_TRACKER } from "../../services/seoData";

export function RankTrackerTab({ showToast }: { showToast: (msg: string) => void }) {
  const [records, setRecords] = useState<SEORankRecord[]>(INITIAL_RANK_TRACKER);
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = records.filter((r) => {
    const matchesDevice = deviceFilter === "all" || r.device === deviceFilter;
    const matchesSearch = r.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDevice && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter tracked search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
            {["all", "desktop", "mobile"].map((d) => (
              <button
                key={d}
                onClick={() => setDeviceFilter(d)}
                className={`px-3 py-1 font-semibold rounded capitalize transition-colors ${
                  deviceFilter === d ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Triggered daily Google & Bing SERP rank scan via API Router...")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Check SERP Now
          </button>
        </div>
      </div>

      {/* Rank Tracking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tracked Keyword</th>
                <th className="py-3 px-3">Search Engine</th>
                <th className="py-3 px-3">Device</th>
                <th className="py-3 px-3">Rank Position</th>
                <th className="py-3 px-3">7-Day Trajectory</th>
                <th className="py-3 px-3">SERP Features Captured</th>
                <th className="py-3 px-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => {
                const curr = item.currentRank || item.currentPosition || 1;
                const prev = item.previousRank || item.previousPosition || curr;
                const diff = prev - curr;
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900 font-semibold">
                      <div>{item.keyword}</div>
                      <span className="text-[10px] text-slate-400 font-normal">Updated 2h ago</span>
                    </td>

                    <td className="py-3 px-3 text-slate-800">{item.searchEngine}</td>

                    <td className="py-3 px-3 capitalize">
                      <span className="flex items-center gap-1 text-slate-700">
                        {item.device === "desktop" ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                        {item.device}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                        <span>#{curr}</span>
                        {diff > 0 ? (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center">
                            <TrendingUp className="w-3 h-3 mr-0.5" /> +{diff}
                          </span>
                        ) : diff < 0 ? (
                          <span className="text-xs text-red-500 font-semibold flex items-center">
                            <TrendingDown className="w-3 h-3 mr-0.5" /> {diff}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 flex items-center">
                            <Minus className="w-3 h-3" /> 0
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Historical Mini Sparkline */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {item.history.map((h: any, i) => (
                          <span
                            key={i}
                            className="px-1 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600"
                          >
                            #{typeof h === "object" && h !== null ? h.rank : h}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.serpFeatures.map((feat) => (
                          <span
                            key={feat}
                            className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-500">{item.location || "India (National)"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
