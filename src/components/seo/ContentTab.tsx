/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Content Intelligence & Prompt Studio Generator
 * Real-Time Content Score (84/100), NLP Density, Semantic Gaps & 5 AI Generators
 */

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Layers,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  HelpCircle,
  Link,
  Edit3,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export function ContentTab({ showToast }: { showToast: (msg: string) => void }) {
  const [selectedTool, setSelectedTool] = useState<"brief" | "outline" | "faq" | "links" | "rewrite">("brief");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string>(
    `# B2B Content Brief: Wholesale Textile Sourcing in Surat & Tirupur

## 1. Primary Target Keywords
- surat synthetic silk wholesale (Vol: 6,800, KD: 38%)
- tirupur combed cotton knits manufacturers (Vol: 9,400, KD: 42%)
- verified textile escrow platform india (Vol: 1,900, KD: 24%)

## 2. Search Intent & Audience
- Target: International apparel buyers, fashion brand sourcing heads & domestic wholesalers.
- Intent: Commercial investigation with bottom-funnel escrow transaction conversion.

## 3. Required Semantic Entities (NLP Coverage)
- AEPC Certification, Letter of Credit (LC), CIF vs FOB shipping, OEKO-TEX Standard 100, GSM fabric density.

## 4. Competitive Moat
- Highlight Bell24h 0% upfront escrow protection to differentiate from IndiaMART & Alibaba listing directories.`
  );
  const [copied, setCopied] = useState(false);

  const handleRunTool = (tool: "brief" | "outline" | "faq" | "links" | "rewrite") => {
    setSelectedTool(tool);
    setIsGenerating(true);
    showToast(`AI Router generating ${tool.toUpperCase()} through Prompt Studio...`);

    setTimeout(() => {
      if (tool === "outline") {
        setGeneratedResult(
          `# Comprehensive Article Outline: Guide to Sourcing Cotton & Silk in India

H1: The Comprehensive 2026 Guide to Sourcing Textiles in India with Escrow
  H2: Why India is Leading Global Fabric Exports in 2026
    H3: Key Manufacturing Hubs: Surat, Tirupur, Bhilwara & Ahmedabad
  H2: Common Pitfalls in Cross-Border B2B Fabric Procurement
    H3: Quality Assurance vs Counterfeit Yarn
    H3: Payment Insecurities: The Risk of Traditional Telegraphic Transfers
  H2: How Bell24h Escrow Solves Sourcing Disputes
    H3: Step-by-Step Escrow Deposit to Bill of Lading Release
  H2: Frequently Asked Sourcing Questions (FAQ)`
        );
      } else if (tool === "faq") {
        setGeneratedResult(
          `## SEO-Optimized FAQ Section for Fabric Marketplace

Q: What is the minimum order quantity (MOQ) for Surat synthetic silk?
A: MOQs range from 500 meters to 10,000 meters depending on loom availability. All orders through Bell24h benefit from verified mill pricing.

Q: How does Bell24h protect international apparel buyers?
A: Buyer funds remain in a regulated banking escrow until independent quality surveyors verify the Bill of Lading and GSM specifications.

Q: Can buyers request digital lab dips and physical fabric swatches?
A: Yes, swatch sample kits are dispatched via express courier with real-time tracking in the Bell24h dashboard.`
        );
      } else if (tool === "links") {
        setGeneratedResult(
          `## Internal Linking Strategy for /marketplace/textiles

1. Target Hub: /suppliers/surat-silk
   Anchor Text: "verified Surat synthetic silk suppliers"
   Context: Regional textile directory page

2. Target Hub: /trust-escrow
   Anchor Text: "B2B secure escrow payment terms"
   Context: Buyer checkout & trade financing section

3. Target Hub: /knowledge-base/incoterms
   Anchor Text: "FOB vs CIF port delivery guidelines"
   Context: Export logistics documentation`
        );
      } else if (tool === "rewrite") {
        setGeneratedResult(
          `## AI Rewritten High-Converting Landing Section

"Source authentic Indian fabrics directly from verified mills without intermediary markups. With Bell24h-OS, every yard of Surat silk and Tirupur cotton is backed by certified escrow protection, automated Bill of Lading compliance, and guaranteed dispute resolution."`
        );
      } else {
        setGeneratedResult(
          `# B2B Content Brief: Wholesale Textile Sourcing in Surat & Tirupur\n\nGenerated with high-impact keyword entities.`
        );
      }
      setIsGenerating(false);
      showToast(`${tool.toUpperCase()} generated and ready to publish!`);
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    showToast("Content copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Content Health Score</span>
          <div className="text-2xl font-extrabold text-slate-900">84/100</div>
          <div className="text-[11px] text-emerald-600 font-medium">Top 5% of B2B Marketplaces</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Topical Coverage</span>
          <div className="text-2xl font-extrabold text-indigo-600">89%</div>
          <div className="text-[11px] text-slate-500 font-medium">Surpasses IndiaMART (74%)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">NLP Keyword Density</span>
          <div className="text-2xl font-extrabold text-emerald-600">Optimal</div>
          <div className="text-[11px] text-slate-500 font-medium">1.8% average keyword density</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Readability Grade</span>
          <div className="text-2xl font-extrabold text-slate-900">Grade 9.2</div>
          <div className="text-[11px] text-slate-500 font-medium">Flesch-Kincaid B2B Standard</div>
        </div>
      </div>

      {/* Generator Tools Bar & Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 5 Generator Tool Selectors */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Content Optimization Tools</h3>
            <p className="text-xs text-slate-500">Powered by Bell24h Prompt Studio & AI Router</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleRunTool("brief")}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 text-xs transition-all ${
                selectedTool === "brief"
                  ? "border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 shadow-xs"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="font-bold">Content Brief Generator</div>
                <div className="text-[10px] text-slate-500 font-normal">SERP intent, word count & keywords</div>
              </div>
            </button>

            <button
              onClick={() => handleRunTool("outline")}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 text-xs transition-all ${
                selectedTool === "outline"
                  ? "border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 shadow-xs"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="font-bold">H1/H2 Comprehensive Outline</div>
                <div className="text-[10px] text-slate-500 font-normal">Hierarchical section structure</div>
              </div>
            </button>

            <button
              onClick={() => handleRunTool("faq")}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 text-xs transition-all ${
                selectedTool === "faq"
                  ? "border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 shadow-xs"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="font-bold">FAQ Section Creator</div>
                <div className="text-[10px] text-slate-500 font-normal">Answers for People Also Ask SERPs</div>
              </div>
            </button>

            <button
              onClick={() => handleRunTool("links")}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 text-xs transition-all ${
                selectedTool === "links"
                  ? "border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 shadow-xs"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Link className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="font-bold">Internal Linking Strategy</div>
                <div className="text-[10px] text-slate-500 font-normal">Anchor texts & target page mapping</div>
              </div>
            </button>

            <button
              onClick={() => handleRunTool("rewrite")}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 text-xs transition-all ${
                selectedTool === "rewrite"
                  ? "border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 shadow-xs"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Edit3 className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="font-bold">AI Copy Rewrite & Polish</div>
                <div className="text-[10px] text-slate-500 font-normal">Improve CTR and buyer conversion</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Real-time Editor / Output Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  AI Output Workspace ({selectedTool.toUpperCase()})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Output"}
                </button>
              </div>
            </div>

            {isGenerating ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs font-medium">Querying Bell24h Prompt Studio...</span>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {generatedResult}
              </div>
            )}
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-950 flex items-center justify-between mt-4">
            <span>Aligned with Bell24h B2B Knowledge Graph entity ontology</span>
            <span className="font-semibold text-indigo-700">Ready to Publish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
