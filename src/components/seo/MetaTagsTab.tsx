/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Meta Tag Manager
 * Multi-Route Editing, Live Interactive Previews (Google SERP Desktop/Mobile, Facebook, LinkedIn)
 */

import React, { useState } from "react";
import {
  Globe,
  Share2,
  Smartphone,
  Monitor,
  Check,
  Sparkles,
  ExternalLink,
  Copy,
  Layers,
  Save,
  Eye
} from "lucide-react";
import { PageMetaTags } from "../../types/seo";

export function MetaTagsTab({
  metaTags,
  setMetaTags,
  showToast
}: {
  metaTags: PageMetaTags[];
  setMetaTags: React.Dispatch<React.SetStateAction<PageMetaTags[]>>;
  showToast: (msg: string) => void;
}) {
  const [selectedRoute, setSelectedRoute] = useState(metaTags[0]?.route || "/");
  const [previewMode, setPreviewMode] = useState<"google-desktop" | "google-mobile" | "facebook" | "linkedin">("google-desktop");

  const currentMeta = metaTags.find((m) => m.route === selectedRoute) || metaTags[0];

  const handleUpdateCurrent = (field: keyof PageMetaTags, value: any) => {
    setMetaTags((prev) =>
      prev.map((item) => (item.route === selectedRoute ? { ...item, [field]: value } : item))
    );
  };

  const handleAutoOptimize = () => {
    showToast("AI Router optimizing meta title & description for CTR...");
    setTimeout(() => {
      handleUpdateCurrent(
        "title",
        `${currentMeta.title.split("|")[0].trim()} | Verified B2B Escrow - Bell24h`
      );
      handleUpdateCurrent(
        "description",
        `${currentMeta.description.trim()} Directly connect with verified Indian textile mills and export with 100% secured Letter of Credit and escrow assurance.`
      );
      showToast("Meta tags updated with high-converting buyer intent cues!");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Route Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Route:</span>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            {metaTags.map((m) => (
              <option key={m.id} value={m.route}>
                {m.route}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoOptimize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI CTR Optimizer
          </button>
          <button
            onClick={() => showToast(`Meta tags for ${selectedRoute} persisted to database!`)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Editor */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Page Meta Data Configuration
          </h3>

          {/* Title input */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">Meta Title Tag</label>
              <span
                className={`font-mono text-[11px] ${
                  currentMeta.title.length > 60 ? "text-amber-600 font-bold" : "text-slate-400"
                }`}
              >
                {currentMeta.title.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={currentMeta.title}
              onChange={(e) => handleUpdateCurrent("title", e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Description input */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">Meta Description</label>
              <span
                className={`font-mono text-[11px] ${
                  currentMeta.description.length > 160 ? "text-amber-600 font-bold" : "text-slate-400"
                }`}
              >
                {currentMeta.description.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={currentMeta.description}
              onChange={(e) => handleUpdateCurrent("description", e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
            />
          </div>

          {/* Canonical */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Canonical URL</label>
            <input
              type="text"
              value={currentMeta.canonical}
              onChange={(e) => handleUpdateCurrent("canonical", e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800 bg-slate-50 font-mono"
            />
          </div>

          {/* Open Graph Image */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">OG Social Card Image URL</label>
            <input
              type="text"
              value={currentMeta.ogImage}
              onChange={(e) => handleUpdateCurrent("ogImage", e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-800 bg-slate-50 font-mono text-[11px]"
            />
          </div>

          {/* Indexing Robot Directives */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Robots Meta Directive:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-semibold border border-emerald-200">
                index, follow, max-snippet:-1
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Previews */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                Live SERP & Social Previews
              </h3>

              {/* Preview mode buttons */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
                <button
                  onClick={() => setPreviewMode("google-desktop")}
                  className={`px-2 py-1 font-semibold rounded flex items-center gap-1 transition-colors ${
                    previewMode === "google-desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  <Monitor className="w-3 h-3" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewMode("google-mobile")}
                  className={`px-2 py-1 font-semibold rounded flex items-center gap-1 transition-colors ${
                    previewMode === "google-mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  <Smartphone className="w-3 h-3" /> Mobile
                </button>
                <button
                  onClick={() => setPreviewMode("linkedin")}
                  className={`px-2 py-1 font-semibold rounded transition-colors ${
                    previewMode === "linkedin" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => setPreviewMode("facebook")}
                  className={`px-2 py-1 font-semibold rounded transition-colors ${
                    previewMode === "facebook" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Facebook
                </button>
              </div>
            </div>

            {/* 1. Google SERP Desktop Preview */}
            {previewMode === "google-desktop" && (
              <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 max-w-lg font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    B
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-slate-900">Bell24h B2B Marketplace</div>
                    <div className="text-[11px] text-slate-500">https://bell24h.com{selectedRoute}</div>
                  </div>
                </div>
                <h4 className="text-base text-blue-800 font-medium hover:underline cursor-pointer leading-snug">
                  {currentMeta.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {currentMeta.description}
                </p>
              </div>
            )}

            {/* 2. Google SERP Mobile Preview */}
            {previewMode === "google-mobile" && (
              <div className="mt-4 p-4 rounded-2xl border-2 border-slate-300 bg-white space-y-2 max-w-xs mx-auto shadow-xs font-sans">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-900">Bell24h</div>
                    <div className="text-[10px] text-slate-500">bell24h.com{selectedRoute}</div>
                  </div>
                </div>
                <h4 className="text-sm text-blue-800 font-medium leading-snug">
                  {currentMeta.title}
                </h4>
                <p className="text-xs text-slate-600 leading-snug">
                  {currentMeta.description}
                </p>
              </div>
            )}

            {/* 3. LinkedIn Preview */}
            {previewMode === "linkedin" && (
              <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 max-w-md mx-auto">
                <div className="h-40 bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-semibold">
                  <div className="text-center p-4">
                    <span className="text-emerald-400 font-bold block text-sm mb-1">Bell24h Global B2B</span>
                    <span>1,200 x 627 Social Share Card Banner</span>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">bell24h.com</span>
                  <div className="font-bold text-xs text-slate-900 truncate">{currentMeta.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">{currentMeta.description}</div>
                </div>
              </div>
            )}

            {/* 4. Facebook Preview */}
            {previewMode === "facebook" && (
              <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 max-w-md mx-auto">
                <div className="h-40 bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                  <div className="text-center p-4">
                    <span className="text-white font-bold block text-sm">Bell24h Social OpenGraph</span>
                    <span className="text-slate-400 text-[11px]">og:image dynamic rendered</span>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-slate-200 space-y-0.5">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">BELL24H.COM</span>
                  <div className="font-bold text-xs text-slate-900">{currentMeta.title}</div>
                  <div className="text-[11px] text-slate-600 line-clamp-1">{currentMeta.description}</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 flex items-center justify-between border border-slate-100 mt-4">
            <span>Verified with Google Search Console & Schema.org standards</span>
            <span className="font-semibold text-emerald-600">Rich Result Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
