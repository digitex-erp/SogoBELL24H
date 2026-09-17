/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - SEO Automation & Workflow Engine
 * 5 Production Rules, Instant Test Triggers & CRM/Communication Hub Synchronization
 */

import React, { useState } from "react";
import {
  Zap,
  Play,
  CheckCircle,
  Bell,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { SEOAutomationRule } from "../../types/seo";
import { INITIAL_AUTOMATION_RULES } from "../../services/seoData";

export function AutomationTab({ showToast }: { showToast: (msg: string) => void }) {
  const [rules, setRules] = useState<SEOAutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);

  const toggleRuleActive = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    showToast("Automation rule status updated!");
  };

  const handleTestTrigger = (rule: SEOAutomationRule) => {
    setTestingRuleId(rule.id);
    showToast(`Testing trigger "${rule.name}" via Workflow Orchestrator...`);

    setTimeout(() => {
      setRules((prev) =>
        prev.map((r) =>
          r.id === rule.id
            ? { ...r, executionCount: (r.executionCount || r.runsCount || 0) + 1, lastTriggered: "Just now" }
            : r
        )
      );
      setTestingRuleId(null);
      showToast(`Rule "${rule.name}" triggered successfully! Action: ${rule.action}`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Zap className="w-3.5 h-3.5" /> Bell24h Workflow Orchestrator Integration
          </div>
          <h2 className="text-lg font-bold text-white">Event-Driven SEO Automations</h2>
          <p className="text-xs text-slate-400">
            Automatically trigger alerts across Slack, WhatsApp, and Bell24h Communication Hub whenever SERP positions shift or site health changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Custom automation builder opened.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Custom Automation Rule
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3.5">
        {rules.map((rule) => {
          const isTesting = testingRuleId === rule.id;
          return (
            <div
              key={rule.id}
              className={`p-5 rounded-xl border transition-all bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                rule.isActive ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    rule.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-slate-900">{rule.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rule.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {rule.isActive ? "Active" : "Paused"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-800">Trigger:</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{rule.trigger}</span>
                    <span>&rarr;</span>
                    <span className="font-semibold text-slate-800">Action:</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                      {rule.action}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-4 pt-1">
                    <span>Target Channel: <strong className="text-slate-600">{rule.channel}</strong></span>
                    <span>Executed: <strong className="text-slate-600">{rule.executionCount} times</strong></span>
                    <span>Last Run: <strong className="text-slate-600">{rule.lastTriggered}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleTestTrigger(rule)}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
                >
                  <Play className={`w-3 h-3 ${isTesting ? "animate-spin" : ""}`} />
                  {isTesting ? "Firing..." : "Test Trigger Now"}
                </button>

                <button
                  onClick={() => toggleRuleActive(rule.id)}
                  className="text-slate-400 hover:text-slate-700"
                  title={rule.isActive ? "Pause Rule" : "Activate Rule"}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
