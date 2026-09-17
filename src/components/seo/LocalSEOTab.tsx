/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bell24h-OS Enterprise SEO Center - Local SEO & Regional Clusters
 * Google Business Profile Sync, NAP Consistency (96%) & Map Pack Rankings (Surat, Tirupur, Ahmedabad)
 */

import React from "react";
import {
  MapPin,
  CheckCircle,
  Star,
  ExternalLink,
  ShieldCheck,
  Building,
  Phone,
  Globe,
  TrendingUp
} from "lucide-react";
import { LocalHubData } from "../../types/seo";

export function LocalSEOTab({
  hubs,
  showToast
}: {
  hubs: LocalHubData[];
  showToast: (msg: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 4 Local SEO KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">NAP Consistency</span>
          <div className="text-2xl font-extrabold text-slate-900">96.4%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Name, Address, Phone Sync</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Active GBP Profiles</span>
          <div className="text-2xl font-extrabold text-emerald-600">5 Hubs</div>
          <div className="text-[11px] text-slate-500 font-medium">Surat, Tirupur, Ahmedabad, Mumbai</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Google Map Pack #1</span>
          <div className="text-2xl font-extrabold text-amber-600">4 of 5</div>
          <div className="text-[11px] text-amber-600 font-medium">80% Top 3 Local Pack Share</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Average Reviews Rating</span>
          <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-[11px] text-slate-500 font-medium">420+ Verified Mill Reviews</div>
        </div>
      </div>

      {/* Regional Cluster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {hub.city}, {hub.state}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Rank #{hub.localRank || hub.topKeywords?.[0]?.rank || 1}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-slate-800">
                  {hub.primaryKeyword || hub.topKeywords?.[0]?.keyword || `${hub.city} Textile Exporter`}
                </div>
                <div className="text-slate-500 flex justify-between text-[11px]">
                  <span>Monthly Local Vol: {(hub.searchVolume || 6800).toLocaleString()}</span>
                  <span>KD: {hub.difficulty || 32}%</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center justify-between">
                  <span>Google Business Profile:</span>
                  <span className="font-semibold text-slate-800">{hub.gmbStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Directory Citations:</span>
                  <strong className="text-slate-800">{hub.citationsCount} Listed</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Customer Reviews:</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {hub.rating} ({hub.reviewsCount})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Bell24h Regional Node</span>
              <button
                onClick={() => showToast(`Syncing NAP citation data for ${hub.city}...`)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Sync GBP &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
