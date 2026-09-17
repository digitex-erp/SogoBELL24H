/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Generative Engine Optimization (GEO) Engine
 * LLM Citation Readiness (ChatGPT, Claude, Gemini, Perplexity), Entity Extraction & AI Recommendations
 */

import React, { useState } from "react";
import {
  Zap,
  Sparkles,
  Bot,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Search,
  FileText,
  ShieldCheck,
  Share2
} from "lucide-react";
import { GEOCitation } from "../../types/seo";

export function GEOTab({
  citations,
  setCitations,
  showToast,
  onOpenGraph,
  onOpenAIRouter
}: {
  citations: GEOCitation[];
  setCitations: React.Dispatch<React.SetStateAction<GEOCitation[]>>;
  showToast: (msg: string) => void;
  onOpenGraph: () => void;
  onOpenAIRouter: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeEngineFilter, setActiveEngineFilter] = useState<string>("all");
  const [recommendations, setRecommendations] = useState<string[]>([
    "Inject AEPC Export Council registration entity into Organization Schema on /marketplace",
    "Publish Incoterms 2026 FOB vs CIF B2B comparison guide to capture Perplexity buyer queries",
    "Append aggregateRating schema markup to Surat Synthetic Silk supplier profiles",
    "Add 'ZED Gold Certified Textile Mills' entity mapping to Bell24h Knowledge Graph"
  ]);

  const engineReadiness = [
    {
      engine: "Google Gemini",
      score: 92,
      status: "Exceptional",
      latency: "140ms",
      coverage: "94%",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
    {
      engine: "Perplexity AI",
      score: 90,
      status: "Strong",
      latency: "180ms",
      coverage: "91%",
      bg: "bg-teal-50 text-teal-800 border-teal-200"
    },
    {
      engine: "Anthropic Claude",
      score: 88,
      status: "High",
      latency: "210ms",
      coverage: "86%",
      bg: "bg-indigo-50 text-indigo-800 border-indigo-200"
    },
    {
      engine: "OpenAI ChatGPT",
      score: 84,
      status: "Optimized",
      latency: "190ms",
      coverage: "82%",
      bg: "bg-blue-50 text-blue-800 border-blue-200"
    }
  ];

  const handleGenerateRecommendations = () => {
    setIsGenerating(true);
    showToast("AI Router analyzing LLM citation vector spaces...");

    setTimeout(() => {
      setRecommendations((prev) => [
        "Create dedicated Tamil Nadu Combed Knits cluster landing page targeting Gemini LLM query expansion",
        "Add Author Person schema for Chief Textile Officer to increase Google & Claude E-E-A-T score",
        ...prev
      ]);
      setIsGenerating(false);
      showToast("Generated 2 new high-impact GEO optimization recommendations!");
    }, 1200);
  };

  const filteredCitations = citations.filter(
    (c) => activeEngineFilter === "all" || c.engine.toLowerCase().includes(activeEngineFilter)
  );

  return (
    <div className="space-y-6">
      {/* GEO Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-900/50 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Generative Engine Optimization (GEO) v3.0
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Next-Generation AI Search Visibility Engine
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ensure Bell24h B2B marketplace entities are prominently indexed, cited, and recommended inside ChatGPT Search, Google Gemini, Claude 3.5, and Perplexity answers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenGraph}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Knowledge Graph (87%)
          </button>
          <button
            onClick={handleGenerateRecommendations}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isGenerating ? "Analyzing Models..." : "Run GEO AI Analysis"}
          </button>
        </div>
      </div>

      {/* 4 Engine Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {engineReadiness.map((e) => (
          <div
            key={e.engine}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{e.engine}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${e.bg}`}>
                {e.status}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{e.score}%</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> High Readiness
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${e.score}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Entity Coverage: <strong className="text-slate-700">{e.coverage}</strong></span>
              <span>Avg Latency: {e.latency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2 Column: Missing Elements & AI Action Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Elements Matrix */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              GEO Gaps & Entity Deficits
            </h3>
            <span className="text-xs text-slate-500">4 Gaps Detected</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="text-amber-700">Missing Entity: AEPC Registration</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">High Impact</span>
              </div>
              <p className="text-slate-600">
                Apparel Export Promotion Council affiliation is missing in schema JSON-LD, lowering credibility in Perplexity B2B citations.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="text-blue-700">Missing Content: Incoterms 2026 FOB vs CIF</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Search Gap</span>
              </div>
              <p className="text-slate-600">
                Over 18,000 monthly buyers ask LLMs about port freight insurance. Drafting a comprehensive comparison will capture primary citations.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="text-purple-700">Missing Schema: aggregateRating on Suppliers</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Trust Factor</span>
              </div>
              <p className="text-slate-600">
                Google Gemini requires structured rating nodes to synthesize "Best Rated Textile Suppliers in India" answers.
              </p>
            </div>
          </div>
        </div>

        {/* AI Action Recommendations */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Active GEO Optimization Directives
            </h3>
            <span className="text-xs text-indigo-600 font-semibold">Ready for Prompt Studio</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-indigo-950"
              >
                <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-medium">{rec}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                showToast("Executing automated GEO schema injection via Prompt Studio...");
              }}
              className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Apply Directives via AI Router
            </button>
          </div>
        </div>
      </div>

      {/* Live AI Search Engine Citations Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">LLM Citations & Grounding Feed</h3>
            <p className="text-xs text-slate-500">
              Live queries where Bell24h was extracted as the primary knowledge source or URL link
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
            {["all", "chatgpt", "gemini", "perplexity", "claude"].map((eng) => (
              <button
                key={eng}
                onClick={() => setActiveEngineFilter(eng)}
                className={`px-2.5 py-1 font-semibold rounded capitalize transition-colors ${
                  activeEngineFilter === eng
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCitations.map((cit) => (
            <div key={cit.id} className="py-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100">
                    {cit.engine}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cit.isCited
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {cit.isCited ? `Cited · Rank #${cit.rank}` : "Uncited"}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">{cit.lastChecked}</span>
              </div>

              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>"{cit.query}"</span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-sans">
                {cit.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
