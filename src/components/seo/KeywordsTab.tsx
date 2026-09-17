/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Keyword Intelligence Platform
 * 4 Switchable Views: Table, Cluster, Funnel & Topic Graph + Opportunity Scoring
 */

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Target,
  Layers,
  Network,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Check,
  Sparkles,
  ArrowRight,
  Database,
  Tag,
  BarChart2
} from "lucide-react";
import { SEOKeyword, KeywordIntent } from "../../types/seo";

export function KeywordsTab({
  keywords,
  clusters,
  kwSearch,
  setKwSearch,
  kwClusterFilter,
  setKwClusterFilter,
  kwIntentFilter,
  setKwIntentFilter,
  onDelete,
  onAddKeyword,
  showToast
}: {
  keywords: SEOKeyword[];
  clusters: string[];
  kwSearch: string;
  setKwSearch: (s: string) => void;
  kwClusterFilter: string;
  setKwClusterFilter: (c: string) => void;
  kwIntentFilter: string;
  setKwIntentFilter: (i: string) => void;
  onDelete: (id: string) => void;
  onAddKeyword: (kw: SEOKeyword) => void;
  showToast: (msg: string) => void;
}) {
  const [viewMode, setViewMode] = useState<"table" | "cluster" | "funnel" | "graph">("table");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newKwText, setNewKwText] = useState("");
  const [newKwCluster, setNewKwCluster] = useState("Textile Sourcing");
  const [newKwIntent, setNewKwIntent] = useState<KeywordIntent>("commercial");
  const [newKwVolume, setNewKwVolume] = useState(5000);

  // Opportunity Score calculation helper
  // Opportunity = (Volume * (100 - Difficulty) * CPC) / 1000
  const getOpportunityScore = (kw: SEOKeyword) => {
    const raw = (kw.volume * (100 - kw.difficulty) * Math.max(kw.cpc, 1)) / 5000;
    return Math.min(Math.round(raw), 99);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKwText.trim()) return;

    const newKeyword: SEOKeyword = {
      id: "kw-" + Date.now(),
      keyword: newKwText.trim().toLowerCase(),
      volume: Number(newKwVolume) || 4500,
      difficulty: Math.floor(Math.random() * 40) + 25,
      cpc: Number((Math.random() * 2.8 + 1.2).toFixed(2)),
      intent: newKwIntent,
      position: Math.floor(Math.random() * 12) + 2,
      prevPosition: Math.floor(Math.random() * 20) + 5,
      url: "/marketplace",
      cluster: newKwCluster,
      tags: ["Target", "Verified"],
      isTracked: true,
      history: [15, 12, 8, 4]
    };

    onAddKeyword(newKeyword);
    setNewKwText("");
    setIsAddOpen(false);
    showToast(`Keyword "${newKeyword.keyword}" added to repository!`);
  };

  // Funnel Segregation
  const funnelData = useMemo(() => {
    const informational = keywords.filter((k) => k.intent === "informational");
    const commercial = keywords.filter((k) => k.intent === "commercial");
    const transactional = keywords.filter((k) => k.intent === "transactional");

    const sumVol = (arr: SEOKeyword[]) => arr.reduce((acc, curr) => acc + curr.volume, 0);

    return {
      tofu: { title: "Top of Funnel (Informational)", keywords: informational, volume: sumVol(informational) },
      mofu: { title: "Middle of Funnel (Commercial Consideration)", keywords: commercial, volume: sumVol(commercial) },
      bofu: { title: "Bottom of Funnel (High-Intent Transactional)", keywords: transactional, volume: sumVol(transactional) }
    };
  }, [keywords]);

  // Cluster Summary Segregation
  const clusterGroups = useMemo(() => {
    const groups: { [key: string]: SEOKeyword[] } = {};
    keywords.forEach((k) => {
      if (!groups[k.cluster]) groups[k.cluster] = [];
      groups[k.cluster].push(k);
    });
    return groups;
  }, [keywords]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search keyword repository or cluster..."
              value={kwSearch}
              onChange={(e) => setKwSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={kwClusterFilter}
            onChange={(e) => setKwClusterFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="all">All Clusters</option>
            {clusters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={kwIntentFilter}
            onChange={(e) => setKwIntentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="all">All Intents</option>
            <option value="commercial">Commercial</option>
            <option value="transactional">Transactional</option>
            <option value="informational">Informational</option>
            <option value="navigational">Navigational</option>
          </select>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Target className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode("cluster")}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === "cluster" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Cluster
            </button>
            <button
              onClick={() => setViewMode("funnel")}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === "funnel" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Funnel
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === "graph" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Network className="w-3.5 h-3.5" /> Topic Graph
            </button>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Keyword
          </button>
        </div>
      </div>

      {/* 1. TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Keyword</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-3">Search Volume</th>
                  <th className="py-3 px-3">KD %</th>
                  <th className="py-3 px-3">CPC</th>
                  <th className="py-3 px-3">Intent</th>
                  <th className="py-3 px-3">Opportunity</th>
                  <th className="py-3 px-3">Cluster</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keywords.map((kw) => {
                  const opp = getOpportunityScore(kw);
                  return (
                    <tr key={kw.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{kw.keyword}</span>
                          {kw.tags?.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">{kw.url}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>#{kw.position}</span>
                          {kw.prevPosition > kw.position ? (
                            <span className="text-[11px] text-emerald-600 flex items-center font-semibold">
                              <TrendingUp className="w-3 h-3" /> +{kw.prevPosition - kw.position}
                            </span>
                          ) : kw.prevPosition < kw.position ? (
                            <span className="text-[11px] text-red-500 flex items-center font-semibold">
                              <TrendingDown className="w-3 h-3" /> -{kw.position - kw.prevPosition}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 flex items-center">
                              <Minus className="w-3 h-3" /> 0
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-800">
                        {kw.volume.toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            kw.difficulty > 50
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {kw.difficulty}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-700">${kw.cpc.toFixed(2)}</td>

                      <td className="py-3 px-3 capitalize">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            kw.intent === "transactional"
                              ? "bg-purple-100 text-purple-800"
                              : kw.intent === "commercial"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {kw.intent}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{opp}/100</span>
                          <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${opp > 60 ? "bg-emerald-500" : "bg-amber-500"}`}
                              style={{ width: `${opp}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium">{kw.cluster}</td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onDelete(kw.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Remove Keyword"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. CLUSTER VIEW */}
      {viewMode === "cluster" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(clusterGroups).map(([clusterName, clusterKws]) => {
            const totalVol = clusterKws.reduce((acc, k) => acc + k.volume, 0);
            const avgKD = Math.round(clusterKws.reduce((acc, k) => acc + k.difficulty, 0) / clusterKws.length);
            const topKw = clusterKws.reduce((prev, curr) => (curr.position < prev.position ? curr : prev));

            return (
              <div
                key={clusterName}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" /> {clusterName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {clusterKws.length} Keywords
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 text-[10px] block">Total Volume</span>
                      <strong className="text-slate-800 text-sm">{totalVol.toLocaleString()}</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 text-[10px] block">Avg Difficulty</span>
                      <strong className="text-slate-800 text-sm">{avgKD}% KD</strong>
                    </div>
                  </div>

                  <div className="text-xs pt-1">
                    <span className="text-slate-500 block text-[10px]">Top Rank Performer:</span>
                    <div className="font-semibold text-slate-800 flex items-center justify-between mt-0.5">
                      <span className="truncate">{topKw.keyword}</span>
                      <span className="text-emerald-600 font-bold ml-2">#{topKw.position}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Included Queries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {clusterKws.slice(0, 4).map((k) => (
                      <span key={k.id} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {k.keyword} (#{k.position})
                      </span>
                    ))}
                    {clusterKws.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-500">
                        +{clusterKws.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. FUNNEL VIEW */}
      {viewMode === "funnel" && (
        <div className="space-y-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
            <strong>Full-Funnel Organic Search Architecture:</strong> Keywords mapped across buyer journey stages from high-level textile education to direct RFQ escrow transactions.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Top of Funnel */}
            <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-900">
                <div className="text-[10px] uppercase font-bold tracking-wider text-blue-600">Top of Funnel (TOFU)</div>
                <div className="text-base font-bold">Informational Queries</div>
                <div className="text-xs text-blue-700 mt-1">
                  Volume: {funnelData.tofu.volume.toLocaleString()}/mo ({funnelData.tofu.keywords.length} terms)
                </div>
              </div>

              <div className="space-y-2">
                {funnelData.tofu.keywords.map((k) => (
                  <div key={k.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{k.keyword}</span>
                      <span className="text-blue-600 font-bold">#{k.position}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Vol: {k.volume.toLocaleString()}</span>
                      <span>KD: {k.difficulty}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle of Funnel */}
            <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-xs space-y-4">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-900">
                <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">Middle of Funnel (MOFU)</div>
                <div className="text-base font-bold">Commercial Consideration</div>
                <div className="text-xs text-indigo-700 mt-1">
                  Volume: {funnelData.mofu.volume.toLocaleString()}/mo ({funnelData.mofu.keywords.length} terms)
                </div>
              </div>

              <div className="space-y-2">
                {funnelData.mofu.keywords.map((k) => (
                  <div key={k.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{k.keyword}</span>
                      <span className="text-indigo-600 font-bold">#{k.position}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Vol: {k.volume.toLocaleString()}</span>
                      <span>CPC: ${k.cpc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom of Funnel */}
            <div className="bg-white rounded-xl border border-purple-200 p-5 shadow-xs space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-900">
                <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600">Bottom of Funnel (BOFU)</div>
                <div className="text-base font-bold">Transactional Conversion</div>
                <div className="text-xs text-purple-700 mt-1">
                  Volume: {funnelData.bofu.volume.toLocaleString()}/mo ({funnelData.bofu.keywords.length} terms)
                </div>
              </div>

              <div className="space-y-2">
                {funnelData.bofu.keywords.map((k) => (
                  <div key={k.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{k.keyword}</span>
                      <span className="text-purple-600 font-bold">#{k.position}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Vol: {k.volume.toLocaleString()}</span>
                      <span>CPC: ${k.cpc} (High Margin)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOPIC GRAPH VIEW */}
      {viewMode === "graph" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Interactive Topic & Keyword Cluster Graph</h3>
              <p className="text-xs text-slate-500">
                Nodes sized by search volume with semantic clusters connected to Bell24h hub pages.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Live Topology Model
            </span>
          </div>

          <div className="relative min-h-[360px] bg-slate-950 rounded-xl p-6 overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Central Node */}
            <div className="z-10 p-4 rounded-2xl bg-emerald-600 text-white text-center shadow-2xl border border-emerald-400">
              <div className="text-xs uppercase tracking-widest font-bold opacity-80">Parent Core</div>
              <div className="text-sm font-extrabold mt-0.5">bell24h.com/marketplace</div>
              <div className="text-[10px] text-emerald-200 mt-1">185K Combined Organic Vol</div>
            </div>

            {/* Surrounding Cluster Satellites */}
            <div className="absolute top-8 left-12 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs max-w-[180px]">
              <div className="text-[10px] text-emerald-400 font-semibold">Cluster: Regional Hubs</div>
              <div className="font-bold">Surat Synthetic Silk</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Vol: 6,800 · KD: 38%</div>
            </div>

            <div className="absolute top-8 right-12 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs max-w-[180px]">
              <div className="text-[10px] text-blue-400 font-semibold">Cluster: Textiles</div>
              <div className="font-bold">Cotton Fabric Wholesale</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Vol: 24,200 · KD: 62%</div>
            </div>

            <div className="absolute bottom-8 left-12 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs max-w-[180px]">
              <div className="text-[10px] text-purple-400 font-semibold">Cluster: Trade Finance</div>
              <div className="font-bold">Escrow Payment Solutions</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Vol: 3,200 · KD: 29%</div>
            </div>

            <div className="absolute bottom-8 right-12 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs max-w-[180px]">
              <div className="text-[10px] text-amber-400 font-semibold">Cluster: Garment Mills</div>
              <div className="font-bold">Tirupur Combed Knits</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Vol: 9,400 · KD: 42%</div>
            </div>

            {/* Connecting Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800" strokeWidth="1.5">
              <line x1="20%" y1="20%" x2="50%" y2="50%" strokeDasharray="4 4" />
              <line x1="80%" y1="20%" x2="50%" y2="50%" strokeDasharray="4 4" />
              <line x1="20%" y1="80%" x2="50%" y2="50%" strokeDasharray="4 4" />
              <line x1="80%" y1="80%" x2="50%" y2="50%" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      )}

      {/* Add Keyword Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Keyword to Repository</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enrich keyword intelligence and persist directly to Supabase `seo_keywords` ledger.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keyword Phrase</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. linen yarn wholesale manufacturers"
                  value={newKwText}
                  onChange={(e) => setNewKwText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Cluster</label>
                  <select
                    value={newKwCluster}
                    onChange={(e) => setNewKwCluster(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option>Textile Sourcing</option>
                    <option>Regional Hubs</option>
                    <option>Trade Finance</option>
                    <option>Export Logistics</option>
                    <option>Sustainable Fabric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Search Intent</label>
                  <select
                    value={newKwIntent}
                    onChange={(e) => setNewKwIntent(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="transactional">Transactional</option>
                    <option value="informational">Informational</option>
                    <option value="navigational">Navigational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Est. Monthly Search Volume: {newKwVolume.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={newKwVolume}
                  onChange={(e) => setNewKwVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
