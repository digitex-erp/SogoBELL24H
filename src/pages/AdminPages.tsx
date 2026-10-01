import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useFetch } from '@/hooks/useFetch'
import { Shield, Flag, BarChart3, PieChart, Library, Terminal, UserPlus, Clock, AlertTriangle, CheckCircle, Loader2, Users, RefreshCw, Activity, Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

// ─── Roles & Permissions ───
const ROLE_DEF = [
  { id: 'super_admin', name: 'Super Admin', level: 100, perms: ['all'], color: 'bg-red-50 text-red-600' },
  { id: 'org_admin', name: 'Org Admin', level: 80, perms: ['manage_users', 'manage_org', 'manage_billing', 'view_all'], color: 'bg-purple-50 text-purple-600' },
  { id: 'manager', name: 'Manager', level: 60, perms: ['manage_team', 'manage_campaigns', 'view_analytics'], color: 'bg-blue-50 text-blue-600' },
  { id: 'marketing', name: 'Marketing', level: 50, perms: ['manage_campaigns', 'manage_content', 'view_analytics'], color: 'bg-pink-50 text-pink-600' },
  { id: 'sales', name: 'Sales', level: 50, perms: ['manage_leads', 'manage_deals', 'view_contacts'], color: 'bg-amber-50 text-amber-600' },
  { id: 'support', name: 'Support', level: 40, perms: ['view_leads', 'view_contacts', 'manage_tickets'], color: 'bg-green-50 text-green-600' },
  { id: 'finance', name: 'Finance', level: 40, perms: ['view_billing', 'view_reports', 'export_data'], color: 'bg-teal-50 text-teal-600' },
  { id: 'viewer', name: 'Viewer', level: 10, perms: ['view_only'], color: 'bg-gray-50 text-gray-600' },
]

export function RolesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><Shield className="w-5 h-5 text-red-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1><p className="text-sm text-gray-500">{ROLE_DEF.length} roles defined</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLE_DEF.map(r => (
          <div key={r.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", r.color)}><Shield className="w-4 h-4" /></div>
                <div><h3 className="font-semibold text-sm">{r.name}</h3><p className="text-[10px] text-gray-400">Level {r.level}</p></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">{r.perms.map(p => <span key={p} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">{p}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Feature Flags ───
export function FeatureFlagsPage() {
  const [flags, setFlags] = useState([
    { id: '1', name: 'ai_studio', enabled: true, rollout: 100, description: 'AI Studio access' },
    { id: '2', name: 'marketplace', enabled: true, rollout: 100, description: 'B2B Marketplace' },
    { id: '3', name: 'video_studio', enabled: true, rollout: 100, description: 'Video generation' },
    { id: '4', name: 'seo_center', enabled: true, rollout: 100, description: 'SEO optimization' },
    { id: '5', name: 'automation_v2', enabled: true, rollout: 50, description: 'V2 automation engine' },
  ])
  const toggle = (id: string) => setFlags(f => f.map(fl => fl.id === id ? { ...fl, enabled: !fl.enabled, rollout: !fl.enabled ? 100 : 0 } : fl))

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Flag className="w-5 h-5 text-orange-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Feature Flags</h1><p className="text-sm text-gray-500">{flags.filter(f => f.enabled).length} active</p></div>
      </div>
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Feature</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Rollout</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Status</th>
          </tr></thead>
          <tbody>{flags.map(f => (
            <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{f.name}</td>
              <td className="px-4 py-3 text-gray-500">{f.description}</td>
              <td className="px-4 py-3"><div className="w-24 h-2 bg-gray-200 rounded-full"><div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${f.rollout}%` }} /></div><span className="text-xs text-gray-400">{f.rollout}%</span></td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => toggle(f.id)} className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", f.enabled ? 'bg-emerald-500' : 'bg-gray-300')}><span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform", f.enabled ? 'translate-x-4 ml-1' : 'translate-x-0.5')} /></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Analytics (Live) ───
export function AnalyticsPage() {
  const { data, loading } = useFetch<any>('/dashboard/stats')
  const s = data?.stats || {}
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-indigo-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Analytics</h1><p className="text-sm text-gray-500">Real-time business intelligence</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: `₹${(s.totalBudget || 0).toLocaleString()}`, color: 'text-blue-600' },
          { label: 'Total Spent', value: `₹${(s.totalSpent || 0).toLocaleString()}`, color: 'text-amber-600' },
          { label: 'Campaigns', value: s.campaignCount || 0, color: 'text-emerald-600' },
          { label: 'Leads', value: s.leadCount || 0, color: 'text-purple-600' },
        ].map(m => <div key={m.label} className="bg-white border rounded-xl p-4 shadow-sm"><p className={`text-2xl font-bold ${m.color}`}>{m.value}</p><p className="text-xs text-gray-500 mt-1">{m.label}</p></div>)}
      </div>
    </div>
  )
}

// ─── Reports ───
export function ReportsPage() {
  const { token } = useAuth()
  const [campaigns, setCampaigns] = useState<any>(null)
  const [pipeline, setPipeline] = useState<any>(null)
  const [forecast, setForecast] = useState<any>(null)

  useEffect(() => {
    if (!token) return
    fetch(`/api/p1/reports/campaign-performance?token=${token}`).then(r => r.json()).then(setCampaigns).catch(() => {})
    fetch(`/api/p1/reports/lead-pipeline?token=${token}`).then(r => r.json()).then(setPipeline).catch(() => {})
    fetch(`/api/p1/reports/revenue-forecast?token=${token}`).then(r => r.json()).then(setForecast).catch(() => {})
  }, [token])

  const cs = campaigns?.summary || {}
  const ps = pipeline?.summary || {}
  const fs = forecast?.summary || {}

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center"><PieChart className="w-5 h-5 text-cyan-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Reports</h1><p className="text-sm text-gray-500">Generated from live data</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Campaigns', value: cs.total || 0, sub: `${cs.active || 0} active`, color: 'text-blue-600' },
          { label: 'Total Budget', value: `₹${((cs.totalBudget || 0) / 1000).toFixed(0)}K`, sub: `₹${((cs.totalSpent || 0) / 1000).toFixed(0)}K spent`, color: 'text-emerald-600' },
          { label: 'Leads', value: ps.totalLeads || 0, sub: `Avg score: ${ps.avgScore || 0}`, color: 'text-amber-600' },
          { label: 'Deal Pipeline', value: `₹${((fs.pipeline || 0) / 100000).toFixed(1)}L`, sub: `₹${((fs.weighted || 0) / 100000).toFixed(1)}L weighted`, color: 'text-purple-600' },
        ].map(m => <div key={m.label} className="bg-white border rounded-xl p-4 shadow-sm"><p className={`text-2xl font-bold ${m.color}`}>{m.value}</p><p className="text-xs text-gray-500 mt-1">{m.label}</p><p className="text-[10px] text-gray-400">{m.sub}</p></div>)}
      </div>

      {pipeline?.stages && (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Lead Pipeline</h3>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(pipeline.stages).map(([stage, data]: [string, any]) => (
              <div key={stage} className="flex-1 min-w-[100px] bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{data.count}</p>
                <p className="text-xs text-gray-500 capitalize">{stage}</p>
                <p className="text-[10px] text-gray-400">₹{(data.value / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {forecast?.deals && (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Revenue Forecast</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-xl font-bold text-blue-600">₹{((fs.pipeline || 0) / 100000).toFixed(1)}L</p><p className="text-xs text-gray-500">Total Pipeline</p></div>
            <div><p className="text-xl font-bold text-emerald-600">₹{((fs.weighted || 0) / 100000).toFixed(1)}L</p><p className="text-xs text-gray-500">Weighted Forecast</p></div>
            <div><p className="text-xl font-bold text-purple-600">₹{((fs.won || 0) / 100000).toFixed(1)}L</p><p className="text-xs text-gray-500">Closed Won</p></div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Knowledge Base ───
export function KnowledgeBasePage() {
  const { token } = useAuth()
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  const load = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/p1/knowledge-articles/list', token); setDocs(r.items || []) } catch {}
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  const statusColor: Record<string, string> = { published: 'bg-emerald-100 text-emerald-700', draft: 'bg-gray-100 text-gray-600' }
  const categoryColor: Record<string, string> = { Guide: 'bg-blue-50 text-blue-600', Marketing: 'bg-pink-50 text-pink-600', Sales: 'bg-amber-50 text-amber-600', SEO: 'bg-green-50 text-green-600', Developer: 'bg-purple-50 text-purple-600', Support: 'bg-red-50 text-red-600', Security: 'bg-gray-100 text-gray-600' }

  if (selected) return (
    <div className="p-4 md:p-6 space-y-4">
      <button onClick={() => setSelected(null)} className="text-sm text-blue-600 hover:underline">← Back to articles</button>
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", statusColor[selected.status])}>{selected.status}</span>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", categoryColor[selected.category] || 'bg-gray-100 text-gray-600')}>{selected.category}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{selected.content}</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
          <span>👁 {selected.views} views</span>
          <span>👍 {selected.helpful} helpful</span>
          <span>Updated: {new Date(selected.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Library className="w-5 h-5 text-emerald-600" /></div>
        <div className="flex-1"><h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1><p className="text-sm text-gray-500">{docs.length} articles</p></div>
      </div>

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="bg-white border rounded-xl shadow-sm">
          {docs.map((d: any) => (
            <div key={d.id} onClick={() => setSelected(d)} className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{d.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{d.content}</p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                  <span>👁 {d.views}</span>
                  <span>👍 {d.helpful}</span>
                  <span>{new Date(d.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", statusColor[d.status])}>{d.status}</span>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", categoryColor[d.category] || 'bg-gray-100 text-gray-600')}>{d.category}</span>
              </div>
            </div>
          ))}
          {docs.length === 0 && <div className="px-4 py-12 text-center text-gray-400">No articles yet</div>}
        </div>
      )}
    </div>
  )
}

// ─── Job Queue ───
export function JobQueuePage() {
  const { data, refetch } = useFetch<any>('/dashboard/stats')
  const jobs = data?.recentJobs || []
  const statusColor: Record<string, string> = { completed: 'bg-emerald-100 text-emerald-700', running: 'bg-blue-100 text-blue-700', queued: 'bg-amber-100 text-amber-700', failed: 'bg-red-100 text-red-700' }
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">Job Queue</h1><p className="text-sm text-gray-500">{jobs.length} jobs · {jobs.filter((j: any) => j.status === 'running').length} running</p></div>
        </div>
        <button onClick={refetch} className="flex items-center gap-1 px-3 py-1.5 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
      </div>
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Completed</th>
          </tr></thead>
          <tbody>{jobs.map((j: any) => (
            <tr key={j.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{j.type?.replace(/_/g, ' ')}</td>
              <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", statusColor[j.status])}>{j.status}</span></td>
              <td className="px-4 py-3 text-xs text-gray-500">{new Date(j.createdAt).toLocaleString()}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{j.completedAt ? new Date(j.completedAt).toLocaleString() : '—'}</td>
            </tr>
          ))}{jobs.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No jobs</td></tr>}</tbody>
        </table>
      </div>
    </div>
  )
}

// ─── System Logs ───
export function LogsPage() {
  const { token } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    api('/api/audit-logs', token).then(r => { setLogs(r.items || r.logs || []); setLoading(false) }).catch(() => setLoading(false))
  }, [token])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><Terminal className="w-5 h-5 text-gray-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">System Logs</h1><p className="text-sm text-gray-500">{logs.length} entries</p></div>
      </div>
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto font-mono text-xs">
        {loading ? <div className="px-4 py-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" /></div> : (
          <>
            {logs.slice(0, 50).map((l: any) => (
              <div key={l.id} className="px-4 py-2 border-b last:border-0 hover:bg-gray-50 flex gap-3">
                <span className="text-gray-400 w-36 flex-shrink-0">{new Date(l.createdAt).toLocaleString()}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded flex-shrink-0">{l.action}</span>
                <span className="text-gray-600 truncate">{l.resource} {l.resourceId ? `(${l.resourceId.slice(0, 8)})` : ''}</span>
              </div>
            ))}
            {logs.length === 0 && <div className="px-4 py-8 text-center text-gray-400">No logs yet</div>}
          </>
        )}
      </div>
    </div>
  )
}
