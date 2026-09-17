/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Integrated Modals & Drawers
 * Supabase SQL Studio, Prompt Studio, Knowledge Graph & AI Router
 */

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Database,
  Terminal,
  Sparkles,
  Share2,
  Cpu,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Code
} from "lucide-react";
import {
  SUPABASE_SQL_SCHEMA,
  PROMPT_STUDIO_TEMPLATES,
  INITIAL_KNOWLEDGE_GRAPH
} from "../../services/seoData";

/* 1. SUPABASE SQL STUDIO MODAL */
export function SupabaseSQLModal({
  isOpen,
  onClose,
  showToast
}: {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast("Supabase PostgreSQL DDL copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bell24h_seo_v3_supabase_schema.sql";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Supabase SQL migration file downloaded!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Supabase SQL Schema & RLS Policies</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  13 Tables · UUID PK · RLS Enforced
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Production DDL for Supabase PostgreSQL & Cloud SQL with organization multi-tenant isolation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SQL Preview Body */}
        <div className="p-5 overflow-y-auto font-mono text-xs bg-slate-950 text-slate-200 flex-1 leading-relaxed selection:bg-emerald-600 selection:text-white">
          <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Includes Row Level Security (RLS) & Organization Isolation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy SQL"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              Download .sql File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. PROMPT STUDIO DRAWER */
export function PromptStudioDrawer({
  isOpen,
  onClose,
  showToast
}: {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(PROMPT_STUDIO_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Prompt template copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Prompt Studio Integration</h3>
              <p className="text-xs text-slate-500">Enterprise AI prompt engineering for SEO & GEO</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template List */}
        <div className="p-4 border-b border-slate-200 bg-slate-100/60">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
            Available Prompt Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PROMPT_STUDIO_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                  selectedTemplate.id === tmpl.id
                    ? "bg-white border-indigo-600 shadow-xs font-semibold text-indigo-900"
                    : "bg-white/70 border-slate-200 text-slate-700 hover:bg-white"
                }`}
              >
                <div className="text-[10px] text-indigo-600 font-medium">{tmpl.category}</div>
                <div className="truncate mt-0.5">{tmpl.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Template Content Viewer */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">{selectedTemplate.name}</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedTemplate.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ready to execute in Bell24h AI Studio or pass to AI Router endpoints.
            </p>
          </div>

          <div className="relative">
            <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {selectedTemplate.prompt}
            </div>
            <button
              onClick={() => handleCopy(selectedTemplate.prompt)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Connected to Bell24h AI Studio Prompt Registry</span>
          <button
            onClick={() => handleCopy(selectedTemplate.prompt)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Use in AI Router
          </button>
        </div>
      </div>
    </div>
  );
}

/* 3. KNOWLEDGE GRAPH EXPLORER MODAL */
export function KnowledgeGraphModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [graphType, setGraphType] = useState<"entity" | "topic" | "authority">("entity");

  if (!isOpen) return null;

  const filteredEntities = INITIAL_KNOWLEDGE_GRAPH.entities.filter((e) => {
    if (graphType === "entity") return e.type === "entity";
    if (graphType === "topic") return e.type === "topic";
    return e.type === "authority";
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bell24h B2B Knowledge Graph Explorer</h2>
              <p className="text-xs text-slate-500">
                Entity relationships feeding Google Knowledge Graph and Generative AI Search engines.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector Tabs */}
        <div className="p-4 border-b border-slate-200 bg-slate-100/50 flex items-center gap-2">
          {(["entity", "topic", "authority"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setGraphType(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                graphType === t
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {t} Graph
            </button>
          ))}
        </div>

        {/* Graph Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntities.map((node) => (
              <div
                key={node.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-xs transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{node.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                    {node.type}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>LLM Coverage</span>
                    <span className="font-semibold text-slate-800">{node.coveragePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${node.coveragePercent}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>{node.connections} Graph Edges</span>
                  <span>Entity Weight: {node.importance}/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
            <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              Active Knowledge Graph Triples
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {INITIAL_KNOWLEDGE_GRAPH.edges.map((edge, idx) => (
                <div key={idx} className="p-2 bg-white rounded-lg border border-purple-100 text-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-900">{edge.from}</span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {edge.relationship}
                  </span>
                  <span className="font-medium text-slate-900">{edge.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

/* 4. AI ROUTER SELECTOR MODAL */
export function AIRouterModal({
  isOpen,
  onClose,
  activeModel,
  setActiveModel,
  showToast
}: {
  isOpen: boolean;
  onClose: () => void;
  activeModel: string;
  setActiveModel: (m: string) => void;
  showToast: (msg: string) => void;
}) {
  if (!isOpen) return null;

  const models = [
    {
      id: "gemini-1.5-pro",
      name: "Google Gemini 1.5 Pro",
      provider: "Google Cloud Vertex",
      cost: "$0.0012/1k tokens",
      latency: "142ms",
      quality: "99/100",
      bestFor: "Topical knowledge graph extraction & long content analysis"
    },
    {
      id: "gpt-4o",
      name: "OpenAI GPT-4o",
      provider: "OpenAI",
      cost: "$0.0025/1k tokens",
      latency: "185ms",
      quality: "98/100",
      bestFor: "Conversational GEO search simulations & schema drafting"
    },
    {
      id: "claude-3-5-sonnet",
      name: "Anthropic Claude 3.5 Sonnet",
      provider: "Anthropic",
      cost: "$0.0030/1k tokens",
      latency: "198ms",
      quality: "99/100",
      bestFor: "Complex semantic audits & technical code verification"
    },
    {
      id: "deepseek-v3",
      name: "DeepSeek V3 (Groq Hardware)",
      provider: "Groq / DeepSeek",
      cost: "$0.0004/1k tokens",
      latency: "68ms",
      quality: "94/100",
      bestFor: "High-volume automated meta tag bulk generation"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bell24h AI Router Configuration</h2>
              <p className="text-xs text-slate-500">Route SEO & GEO intelligence tasks across LLM models.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {models.map((m) => {
            const isSelected = activeModel === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  setActiveModel(m.id);
                  showToast(`AI Router configured to route SEO tasks to ${m.name}`);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {m.provider}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Active Router
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">{m.bestFor}</p>
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Latency: <strong className="text-slate-700">{m.latency}</strong></span>
                  <span>Cost: <strong className="text-slate-700">{m.cost}</strong></span>
                  <span>Quality Score: <strong className="text-slate-700">{m.quality}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
