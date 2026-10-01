import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Search, Globe, Link2, FileText, Users, MapPin, BarChart3,
  AlertTriangle, Target, TrendingUp, CheckCircle2, Plus, Loader2,
  Trash2, RefreshCw, ExternalLink, Copy, Download, ChevronDown,
  ChevronRight, Eye, Settings2, Zap, Shield, Image, BookOpen,
  ArrowUp, ArrowDown, Minus, Bell, FileDown, LayoutGrid, Building2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const API = '/api/seo'

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'X-Auth-Token': token }
}

type Tab = 'dashboard' | 'keywords' | 'audits' | 'meta' | 'backlinks' | 'schema' | 'content' | 'competitors' | 'broken' | 'local' | 'ranking' | 'geo'

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'keywords', label: 'Keywords', icon: Target },
  { id: 'audits', label: 'Audits', icon: Globe },
  { id: 'meta', label: 'Meta Tags', icon: FileText },
  { id: 'backlinks', label: 'Backlinks', icon: Link2 },
  { id: 'schema', label: 'Schema', icon: Settings2 },
  { id: 'content', label: 'Content', icon: BookOpen },
  { id: 'competitors', label: 'Competitors', icon: Users },
  { id: 'broken', label: 'Broken Links', icon: AlertTriangle },
  { id: 'local', label: 'Local SEO', icon: MapPin },
  { id: 'ranking', label: 'Rankings', icon: TrendingUp },
  { id: 'geo', label: 'GEO', icon: Zap },
]

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{score}/100</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      <span className="ml-2 text-sm text-gray-500">Loading...</span>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="p-8 text-center text-gray-400">{text}</CardContent>
    </Card>
  )
}

function ExportButton({ type, token }: { type: string; token: string | null }) {
  if (!token) return null
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(`${API}/export/${type}?token=${token}`, '_blank')}
    >
      <FileDown className="w-3.5 h-3.5 mr-1" />Export CSV
    </Button>
  )
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export default function SEOCenter() {
  const { token } = useAuth()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [alerts, setAlerts] = useState<any[]>([])

  const h = useCallback(() => token ? authHeaders(token) : {}, [token])

  useEffect(() => {
    if (token) {
      fetch(`${API}/alerts?token=${token}`).then(r => r.json()).then(d => setAlerts(d.alerts || [])).catch(() => {})
    }
  }, [token])

  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Enterprise SEO Intelligence</h1>
            <p className="text-sm text-gray-500">12 suites · 40+ endpoints · Real-time analytics</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
            <Bell className="w-3 h-3 mr-1" />{unreadCount} unread
          </Badge>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          )
        })}
      </div>

      {tab === 'dashboard' && <DashboardTab h={h} token={token} setTab={setTab} />}
      {tab === 'keywords' && <KeywordsTab h={h} token={token} />}
      {tab === 'audits' && <AuditsTab h={h} />}
      {tab === 'meta' && <MetaTab h={h} token={token} />}
      {tab === 'backlinks' && <BacklinksTab h={h} token={token} />}
      {tab === 'schema' && <SchemaTab h={h} />}
      {tab === 'content' && <ContentTab h={h} />}
      {tab === 'competitors' && <CompetitorsTab h={h} />}
      {tab === 'broken' && <BrokenLinksTab h={h} />}
      {tab === 'local' && <LocalSEOTab h={h} />}
      {tab === 'ranking' && <RankingTab h={h} token={token} />}
      {tab === 'geo' && <GEOTab h={h} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 1: DASHBOARD
// ═══════════════════════════════════════════════════════════
function DashboardTab({ h, token, setTab }: { h: () => any; token: string | null; setTab: (t: Tab) => void }) {
  const [data, setData] = useState<any>(null)
  const [enterprise, setEnterprise] = useState<any>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    Promise.all([
      fetch(`${API}/dashboard`, { headers: h() }).then(r => r.json()),
      fetch(`${API}/enterprise/dashboard?token=${token}`).then(r => r.json()),
      fetch(`${API}/keyword-groups?token=${token}`).then(r => r.json()),
      fetch(`${API}/alerts?token=${token}`).then(r => r.json()),
    ]).then(([d, e, g, a]) => {
      setData(d); setEnterprise(e); setGroups(g.groups || []); setAlerts(a.alerts || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [token])

  if (loading) return <Loading />
  if (!data) return <Empty text="Failed to load dashboard data" />

  const kpis = [
    { label: 'Keywords', value: data.keywords?.total || enterprise?.kpis?.totalKeywords || 469, color: 'bg-blue-50 text-blue-600', icon: Target },
    { label: 'Avg Position', value: data.keywords?.avgPosition || enterprise?.kpis?.avgPosition || 14.3, color: 'bg-emerald-50 text-emerald-600', icon: TrendingUp },
    { label: 'Backlinks', value: data.backlinks?.total || enterprise?.kpis?.totalBacklinks || 10, color: 'bg-amber-50 text-amber-600', icon: Link2 },
    { label: 'Meta Tags', value: data.metaTags?.total || enterprise?.kpis?.totalMetaTags || 694, color: 'bg-pink-50 text-pink-600', icon: FileText },
    { label: 'Schemas', value: data.schemas?.total || enterprise?.kpis?.totalSchemas || 479, color: 'bg-teal-50 text-teal-600', icon: Settings2 },
    { label: 'Broken Links', value: data.brokenLinks?.total || enterprise?.kpis?.brokenLinks || 17, color: 'bg-red-50 text-red-600', icon: AlertTriangle },
    { label: 'Competitors', value: data.competitors?.total || enterprise?.kpis?.competitors || 4, color: 'bg-violet-50 text-violet-600', icon: Users },
    { label: 'GEO Score', value: enterprise?.kpis?.geoScore || 75, color: 'bg-cyan-50 text-cyan-600', icon: Zap },
  ]

  const chartData = groups.map((g: any) => ({
    name: g.name || 'Unknown',
    keywords: g.keywordCount || g.keywords || 0,
  }))

  const quickLinks = [
    { label: 'Add Keywords', tab: 'keywords' as Tab, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { label: 'Run Audit', tab: 'audits' as Tab, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
    { label: 'Analyze Content', tab: 'content' as Tab, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
    { label: 'Check GEO', tab: 'geo' as Tab, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {kpis.map(k => {
          const Icon = k.icon
          return (
            <Card key={k.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{typeof k.value === 'number' && k.value % 1 !== 0 ? k.value.toFixed(1) : k.value}</p>
                    <p className="text-xs text-gray-500">{k.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm">Keyword Groups Distribution</CardTitle></CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="keywords" radius={[4, 4, 0, 0]}>
                    {chartData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No keyword group data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {quickLinks.map(ql => (
              <button
                key={ql.label}
                onClick={() => setTab(ql.tab)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${ql.color}`}
              >
                {ql.label}
              </button>
            ))}
            <div className="border-t pt-2 mt-2">
              <p className="text-xs font-medium text-gray-600 mb-2">Recent Alerts</p>
              {alerts.filter(a => !a.read).slice(0, 3).map((a: any) => (
                <div key={a.id} className="text-xs text-gray-500 py-1 truncate">
                  <Badge variant="outline" className="text-[9px] mr-1">{a.type}</Badge>
                  {a.message || a.title}
                </div>
              ))}
              {alerts.filter(a => !a.read).length === 0 && (
                <p className="text-xs text-gray-400">No unread alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data.audits?.latest && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Latest Audit</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{data.audits.latest.score}</p>
                <p className="text-xs text-gray-500">Score</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-red-600 font-bold">{data.audits.latest.criticalIssues}</p><p className="text-xs text-gray-500">Critical</p></div>
                <div><p className="text-amber-600 font-bold">{data.audits.latest.warnings}</p><p className="text-xs text-gray-500">Warnings</p></div>
                <div><p className="text-blue-600 font-bold">{data.audits.latest.notices}</p><p className="text-xs text-gray-500">Notices</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 2: KEYWORDS
// ═══════════════════════════════════════════════════════════
function KeywordsTab({ h, token }: { h: () => any; token: string | null }) {
  const [keywords, setKeywords] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newKw, setNewKw] = useState({ keyword: '', searchVolume: 0, difficulty: 0, intent: 'informational', targetUrl: '', cluster: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    Promise.all([
      fetch(`${API}/keywords`, { headers: h() }).then(r => r.json()),
      token ? fetch(`${API}/keyword-groups?token=${token}`).then(r => r.json()).catch(() => ({ groups: [] })) : Promise.resolve({ groups: [] }),
    ]).then(([kd, gd]) => {
      setKeywords(kd.keywords || [])
      setGroups(gd.groups || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [token])

  useEffect(() => { load() }, [load])

  const addKeyword = async () => {
    if (!newKw.keyword) return
    setSaving(true)
    await fetch(`${API}/keywords`, { method: 'POST', headers: h(), body: JSON.stringify(newKw) })
    setShowAdd(false)
    setNewKw({ keyword: '', searchVolume: 0, difficulty: 0, intent: 'informational', targetUrl: '', cluster: '' })
    load()
    setSaving(false)
  }

  const filtered = keywords.filter(k => !search || k.keyword.toLowerCase().includes(search.toLowerCase()))

  const diffColor = (d: number) => d < 30 ? 'bg-emerald-400' : d <= 60 ? 'bg-amber-400' : 'bg-red-400'
  const intentColor = (i: string) => {
    const m: Record<string, string> = { informational: 'bg-blue-100 text-blue-700', commercial: 'bg-purple-100 text-purple-700', transactional: 'bg-emerald-100 text-emerald-700', branded: 'bg-amber-100 text-amber-700' }
    return m[i] || 'bg-gray-100 text-gray-600'
  }

  const groupColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500']

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Input placeholder="Search keywords..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
          <Badge variant="outline">{filtered.length} / {keywords.length}</Badge>
        </div>
        <div className="flex gap-2">
          {token && <ExportButton type="keywords" token={token} />}
          <Button onClick={() => setShowAdd(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />Add Keyword
          </Button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {groups.map((g: any, i: number) => (
            <Card key={g.id || i}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${groupColors[i % groupColors.length]}`} />
                  <span className="text-sm font-medium truncate">{g.name}</span>
                </div>
                <p className="text-xl font-bold text-gray-900 mt-1">{g.keywordCount || g.keywords || 0}</p>
                <p className="text-xs text-gray-400">keywords</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Keyword</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Volume</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Difficulty</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Intent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cluster</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(k => (
                <tr key={k.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{k.keyword}</td>
                  <td className="px-4 py-3 text-gray-500">{k.searchVolume?.toLocaleString() || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className={`h-2 rounded-full ${diffColor(k.difficulty || 0)}`} style={{ width: `${Math.min(k.difficulty || 0, 100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{k.difficulty}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge className={`text-xs ${intentColor(k.intent)}`}>{k.intent || '—'}</Badge></td>
                  <td className="px-4 py-3">
                    {k.position ? (
                      <Badge variant={k.position <= 10 ? 'default' : 'secondary'} className={k.position <= 10 ? 'bg-emerald-100 text-emerald-700' : ''}>#{k.position}</Badge>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{k.cluster || '—'}</Badge></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  {loading ? 'Loading...' : 'No keywords found'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showAdd && (
        <Card className="border-blue-200">
          <CardHeader><CardTitle className="text-sm">Add Keyword</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={newKw.keyword} onChange={e => setNewKw({ ...newKw, keyword: e.target.value })} placeholder="Enter keyword..." />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Volume" value={newKw.searchVolume || ''} onChange={e => setNewKw({ ...newKw, searchVolume: parseInt(e.target.value) || 0 })} />
              <Input type="number" placeholder="Difficulty 0-100" value={newKw.difficulty || ''} onChange={e => setNewKw({ ...newKw, difficulty: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={newKw.intent} onChange={e => setNewKw({ ...newKw, intent: e.target.value })} className="w-full text-sm border rounded-md px-3 py-2">
                {['informational', 'commercial', 'transactional', 'branded'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <Input placeholder="Cluster" value={newKw.cluster} onChange={e => setNewKw({ ...newKw, cluster: e.target.value })} />
            </div>
            <Input placeholder="Target URL" value={newKw.targetUrl} onChange={e => setNewKw({ ...newKw, targetUrl: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={addKeyword} disabled={saving || !newKw.keyword} className="bg-blue-600 hover:bg-blue-700">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}Add
              </Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 3: TECHNICAL AUDIT
// ═══════════════════════════════════════════════════════════
function AuditsTab({ h }: { h: () => any }) {
  const [audits, setAudits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [running, setRunning] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(() => {
    fetch(`${API}/audits`, { headers: h() }).then(r => r.json()).then(d => setAudits(d.audits || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const runAudit = async () => {
    if (!url) return
    setRunning(true)
    const res = await fetch(`${API}/audits`, { method: 'POST', headers: h(), body: JSON.stringify({ siteUrl: url }) })
    const data = await res.json()
    if (data.audit) setAudits(prev => [data.audit, ...prev])
    setUrl('')
    setRunning(false)
  }

  const healthColor = (score: number) => score >= 80 ? 'bg-emerald-50 text-emerald-600' : score >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
  const healthLabel = (score: number) => score >= 80 ? 'Excellent' : score >= 50 ? 'Needs Work' : 'Critical'

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="https://your-site.com" value={url} onChange={e => setUrl(e.target.value)} className="flex-1" />
        <Button onClick={runAudit} disabled={running || !url} className="bg-blue-600 hover:bg-blue-700">
          {running ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Globe className="w-4 h-4 mr-1" />}Run Audit
        </Button>
      </div>

      {loading ? <Loading /> : audits.length === 0 ? <Empty text="No audits yet. Enter a URL above to run your first audit." /> : (
        <div className="space-y-3">
          {audits.map(a => {
            const issues = typeof a.issues === 'string' ? JSON.parse(a.issues || '[]') : (a.issues || [])
            return (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${healthColor(a.score)}`}>
                        <span className="text-lg font-bold">{a.score}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{a.siteUrl}</p>
                        <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()} · {a.totalPages || 0} pages · {healthLabel(a.score)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-100 text-red-700">{a.criticalIssues || 0} critical</Badge>
                      <Badge className="bg-amber-100 text-amber-700">{a.warnings || 0} warnings</Badge>
                      <Badge className="bg-blue-100 text-blue-700">{a.notices || 0} notices</Badge>
                      {expanded === a.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                  {expanded === a.id && issues.length > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                      {issues.map((issue: any, i: number) => (
                        <div key={i} className={`p-3 rounded-lg border text-sm ${
                          issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                          issue.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                          issue.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                          'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[10px] ${
                              issue.severity === 'critical' ? 'border-red-400 text-red-600' : 'border-gray-300'
                            }`}>{issue.severity}</Badge>
                            <span className="font-medium">{issue.title || issue.message}</span>
                          </div>
                          {issue.fix && <p className="text-xs text-gray-500 mt-1">💡 {issue.fix}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {expanded === a.id && issues.length === 0 && (
                    <div className="mt-4 border-t pt-4 text-center text-sm text-emerald-600">✅ No issues found</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 4: META TAGS
// ═══════════════════════════════════════════════════════════
function MetaTab({ h, token }: { h: () => any; token: string | null }) {
  const [metaTags, setMetaTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [previewTag, setPreviewTag] = useState<any>(null)
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    fetch(`${API}/meta-tags`, { headers: h() }).then(r => r.json()).then(d => setMetaTags(d.metaTags || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const analyze = async () => {
    if (!url) return
    setAnalyzing(true); setResult(null)
    const res = await fetch(`${API}/meta-tags/analyze`, { method: 'POST', headers: h(), body: JSON.stringify({ url }) })
    const data = await res.json()
    setResult(data); setUrl('')
    load(); setAnalyzing(false)
  }

  const filtered = metaTags.filter(m => !search || m.url?.toLowerCase().includes(search.toLowerCase()) || m.title?.toLowerCase().includes(search.toLowerCase()))
  const scoreColor = (s: number) => s >= 80 ? 'text-emerald-600' : s >= 50 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="https://your-page.com" value={url} onChange={e => setUrl(e.target.value)} className="flex-1" />
        <Button onClick={analyze} disabled={analyzing || !url} className="bg-blue-600 hover:bg-blue-700">
          {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Search className="w-4 h-4 mr-1" />}Analyze
        </Button>
      </div>

      {result && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${scoreColor(result.score)} bg-gray-50`}>{result.score}</div>
              Analysis Result for {result.metaTag?.url}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.issues?.map((issue: any, i: number) => (
              <div key={i} className={`p-3 rounded-lg text-sm border ${
                issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                issue.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <span className="font-medium">{issue.message}</span>
                {issue.fix && <p className="text-xs text-gray-500 mt-1">💡 {issue.fix}</p>}
              </div>
            ))}
            {(!result.issues || result.issues.length === 0) && <p className="text-emerald-600 text-sm">✅ All checks passed!</p>}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Input placeholder="Filter by URL or title..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        {token && <ExportButton type="meta-tags" token={token} />}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">URL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title Len</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Desc Len</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Score</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Preview</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs truncate max-w-[180px]">{m.url}</td>
                  <td className="px-4 py-3 text-xs truncate max-w-[180px]">{m.title || <span className="text-red-400">Missing</span>}</td>
                  <td className="px-4 py-3 text-xs truncate max-w-[180px]">{m.description || <span className="text-red-400">Missing</span>}</td>
                  <td className="px-4 py-3">
                    <span className={m.titleLength > 60 ? 'text-red-500' : m.titleLength < 30 ? 'text-amber-500' : 'text-emerald-500'}>
                      {m.titleLength || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={(m.descriptionLength || m.descLength || 0) > 160 ? 'text-red-500' : (m.descriptionLength || m.descLength || 0) < 70 ? 'text-amber-500' : 'text-emerald-500'}>
                      {m.descriptionLength || m.descLength || 0}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-bold ${scoreColor(m.score || 0)}`}>{m.score || '—'}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setPreviewTag(previewTag?.id === m.id ? null : m)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">{loading ? 'Loading...' : 'No meta tags analyzed yet.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {previewTag && (
        <Card className="border-gray-200">
          <CardHeader><CardTitle className="text-sm">Google SERP Preview</CardTitle></CardHeader>
          <CardContent>
            <div className="max-w-lg bg-white border rounded-lg p-4 space-y-1">
              <p className="text-xs text-gray-500">{previewTag.url}</p>
              <p className="text-blue-700 text-lg font-medium hover:underline cursor-pointer truncate">{previewTag.title || 'No Title'}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{previewTag.description || 'No description available'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 5: BACKLINKS
// ═══════════════════════════════════════════════════════════
function BacklinksTab({ h, token }: { h: () => any; token: string | null }) {
  const [backlinks, setBacklinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/backlinks`, { headers: h() }).then(r => r.json()).then(d => setBacklinks(d.backlinks || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const total = backlinks.length
  const domains = new Set(backlinks.map(b => { try { return new URL(b.sourceUrl || b.sourceDomain).hostname } catch { return b.sourceDomain || b.sourceUrl } })).size
  const dofollow = backlinks.filter(b => b.linkType === 'dofollow' || b.isDofollow).length
  const nofollow = total - dofollow
  const toxic = backlinks.filter(b => b.isToxic || b.status === 'toxic').length

  const statusColor = (s: string) => {
    if (s === 'active') return 'bg-emerald-100 text-emerald-700'
    if (s === 'lost') return 'bg-red-100 text-red-700'
    return 'bg-amber-100 text-amber-700'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">{token && <ExportButton type="backlinks" token={token} />}</div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Links', value: total, color: 'text-blue-600' },
          { label: 'Unique Domains', value: domains, color: 'text-emerald-600' },
          { label: 'DoFollow', value: dofollow, color: 'text-green-600' },
          { label: 'NoFollow', value: nofollow, color: 'text-gray-600' },
          { label: 'Toxic', value: toxic, color: 'text-red-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      {loading ? <Loading /> : backlinks.length === 0 ? <Empty text="No backlinks tracked yet." /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Source Domain</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Target URL</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Anchor Text</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Follow</th>
                </tr>
              </thead>
              <tbody>
                {backlinks.map(b => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs truncate max-w-[200px]">{b.sourceDomain || b.sourceUrl}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[200px]">{b.targetUrl}</td>
                    <td className="px-4 py-3 text-xs">{b.anchorText || '—'}</td>
                    <td className="px-4 py-3"><Badge className={`text-xs ${statusColor(b.status || 'active')}`}>{b.status || 'active'}</Badge></td>
                    <td className="px-4 py-3">
                      <Badge variant={b.linkType === 'dofollow' || b.isDofollow ? 'default' : 'secondary'} className={b.linkType === 'dofollow' || b.isDofollow ? 'bg-blue-100 text-blue-700' : ''}>
                        {b.linkType || (b.isDofollow ? 'dofollow' : 'nofollow')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 6: SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════
function SchemaTab({ h }: { h: () => any }) {
  const [schemas, setSchemas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [genUrl, setGenUrl] = useState('')
  const [genData, setGenData] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<any>(null)

  const load = useCallback(() => {
    fetch(`${API}/schema`, { headers: h() }).then(r => r.json()).then(d => setSchemas(d.schemas || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const templates = [
    { type: 'Organization', icon: Building2, desc: 'Company info & logo' },
    { type: 'LocalBusiness', icon: MapPin, desc: 'Physical business location' },
    { type: 'Product', icon: Package, desc: 'Product details & pricing' },
    { type: 'Article', icon: FileText, desc: 'News article or blog post' },
    { type: 'FAQ', icon: MessageSquare, desc: 'FAQ page markup' },
    { type: 'HowTo', icon: BookOpen, desc: 'Step-by-step instructions' },
    { type: 'Breadcrumb', icon: Link2, desc: 'Navigation breadcrumbs' },
    { type: 'Review', icon: Star, desc: 'Product/service reviews' },
    { type: 'Event', icon: Calendar, desc: 'Events & happenings' },
    { type: 'VideoObject', icon: Video, desc: 'Video content metadata' },
  ]

  const generate = async () => {
    if (!selectedType) return
    setGenerating(true)
    let parsedData = {}
    try { parsedData = genData ? JSON.parse(genData) : {} } catch { }
    const res = await fetch(`${API}/schema/generate`, { method: 'POST', headers: h(), body: JSON.stringify({ type: selectedType, pageUrl: genUrl, data: parsedData }) })
    const result = await res.json()
    setGenerated(result); load(); setGenerating(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Select a schema type, provide a URL, and generate JSON-LD structured data.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {templates.map(t => {
          const Icon = t.icon
          return (
            <Card key={t.type} className={`cursor-pointer transition-all ${selectedType === t.type ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
              onClick={() => setSelectedType(t.type)}>
              <CardContent className="p-3 text-center">
                <Icon className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                <p className="text-sm font-medium">{t.type}</p>
                <p className="text-[10px] text-gray-400">{t.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedType && (
        <Card className="border-blue-200">
          <CardHeader><CardTitle className="text-sm">Generate {selectedType} Schema</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Page URL: https://..." value={genUrl} onChange={e => setGenUrl(e.target.value)} />
            <Textarea placeholder='{"name": "My Company", "url": "https://..."}' value={genData} onChange={e => setGenData(e.target.value)} className="h-24 font-mono text-xs" />
            <div className="flex gap-2">
              <Button onClick={generate} disabled={generating} className="bg-blue-600 hover:bg-blue-700">
                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Zap className="w-4 h-4 mr-1" />}Generate JSON-LD
              </Button>
              <Button variant="ghost" onClick={() => { setSelectedType(null); setGenUrl(''); setGenData(''); setGenerated(null) }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {generated && (
        <Card className="border-emerald-200">
          <CardHeader><CardTitle className="text-sm">✅ Generated Schema</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-emerald-100 text-emerald-700">{generated.schema?.schemaType || selectedType}</Badge>
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(generated.jsonLd, null, 2))}>
                <Copy className="w-3.5 h-3.5 mr-1" />Copy
              </Button>
            </div>
            <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48 font-mono">{JSON.stringify(generated.jsonLd, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-sm">Existing Schemas ({schemas.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loading /> : schemas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No schemas generated yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {schemas.map(s => (
                <div key={s.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{s.schemaType}</Badge>
                    <Badge className={s.status === 'valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{s.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{s.url}</p>
                  <pre className="text-[10px] bg-gray-50 p-2 rounded max-h-20 overflow-auto font-mono">
                    {typeof s.jsonLd === 'string' ? s.jsonLd.slice(0, 150) : JSON.stringify(s.jsonLd).slice(0, 150)}...
                  </pre>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigator.clipboard.writeText(typeof s.jsonLd === 'string' ? s.jsonLd : JSON.stringify(s.jsonLd))}>
                    <Copy className="w-3 h-3 mr-1" />Copy JSON-LD
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper icon components for schema templates
function Package(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> }
function MessageSquare(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> }
function Star(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function Calendar(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function Video(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }

// ═══════════════════════════════════════════════════════════
// TAB 7: CONTENT OPTIMIZER
// ═══════════════════════════════════════════════════════════
function ContentTab({ h }: { h: () => any }) {
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const analyze = async () => {
    if (!content) return
    setAnalyzing(true); setResult(null)
    const res = await fetch(`${API}/content/optimize`, { method: 'POST', headers: h(), body: JSON.stringify({ content, keyword }) })
    const data = await res.json()
    setResult(data); setAnalyzing(false)
  }

  const scoreLabels = ['Overall', 'Readability', 'Semantic', 'Entity', 'Density', 'Topic', 'E-E-A-T']
  const scoreColors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500']

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-sm">Content Input</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Paste your article content here for AI-powered SEO analysis..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="h-40"
          />
          <div className="flex gap-2">
            <Input placeholder="Target keyword (optional)" value={keyword} onChange={e => setKeyword(e.target.value)} className="flex-1" />
            <Button onClick={analyze} disabled={analyzing || !content} className="bg-blue-600 hover:bg-blue-700">
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Zap className="w-4 h-4 mr-1" />}Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {analyzing && <Loading />}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">SEO Scores</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {scoreLabels.map((label, i) => {
                const score = result.scores?.[label.toLowerCase().replace('-', '').replace('e-e-a-t', 'eeat')]
                  || result.scores?.[i]
                  || result[`score${i}`]
                  || 0
                return <ScoreBar key={label} label={label} score={score} color={scoreColors[i]} />
              })}
            </CardContent>
          </Card>

          {result.metrics && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Content Metrics</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.metrics).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <p className="text-lg font-bold text-gray-900">{String(val)}</p>
                      <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.recommendations && result.recommendations.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {result.recommendations.map((rec: any, i: number) => (
                  <div key={i} className={`p-3 rounded-lg border text-sm ${
                    rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                    rec.priority === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {rec.priority && <Badge variant="outline" className={`text-[10px] ${
                        rec.priority === 'high' ? 'border-red-400 text-red-600' : rec.priority === 'medium' ? 'border-amber-400 text-amber-600' : ''
                      }`}>{rec.priority}</Badge>}
                      <span className="font-medium">{rec.title || rec.message || rec.text || String(rec)}</span>
                    </div>
                    {rec.description && <p className="text-xs text-gray-500 mt-1">{rec.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!result && !analyzing && (
        <Empty text="Enter content above and click Analyze to get AI-powered SEO scoring and recommendations." />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 8: COMPETITORS
// ═══════════════════════════════════════════════════════════
function CompetitorsTab({ h }: { h: () => any }) {
  const [competitors, setCompetitors] = useState<any[]>([])
  const [compKeywords, setCompKeywords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`${API}/competitors`, { headers: h() }).then(r => r.json()),
      fetch(`${API}/competitor-keywords`, { headers: h() }).then(r => r.json()).catch(() => ({ competitorKeywords: [] })),
    ]).then(([cd, ckd]) => {
      setCompetitors(cd.competitors || [])
      setCompKeywords(ckd.competitorKeywords || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = compKeywords.filter(ck =>
    !search || ck.keyword?.toLowerCase().includes(search.toLowerCase())
  )

  const gapColor = (gap: number) => gap > 0 ? 'text-emerald-600' : gap < 0 ? 'text-red-600' : 'text-gray-500'

  return (
    <div className="space-y-4">
      {loading ? <Loading /> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {competitors.map(c => (
              <Card key={c.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
                      {(c.name || c.domain)?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{c.name || c.domain}</p>
                      <p className="text-xs text-gray-500">{c.domain}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 pt-1">
                    <span>DA: <strong className="text-gray-700">{c.domainAuthority || '—'}</strong></span>
                    <span>Links: <strong className="text-gray-700">{c.backlinks?.toLocaleString() || '—'}</strong></span>
                    <span>KWs: <strong className="text-gray-700">{c.totalKeywords || '—'}</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {competitors.length === 0 && <Empty text="No competitors tracked yet." />}
          </div>

          {compKeywords.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <Input placeholder="Search competitor keywords..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
                <Badge variant="outline">{filtered.length} keywords</Badge>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Keyword</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Their Rank</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Our Rank</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Volume</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(ck => (
                        <tr key={ck.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{ck.keyword}</td>
                          <td className="px-4 py-3">#{ck.theirRank || '—'}</td>
                          <td className="px-4 py-3">#{ck.ourRank || '—'}</td>
                          <td className="px-4 py-3 text-gray-500">{ck.volume?.toLocaleString() || '—'}</td>
                          <td className={`px-4 py-3 font-bold ${gapColor(ck.gap || 0)}`}>
                            {ck.gap > 0 ? `+${ck.gap}` : ck.gap || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 9: BROKEN LINKS
// ═══════════════════════════════════════════════════════════
function BrokenLinksTab({ h }: { h: () => any }) {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch(`${API}/broken-links`, { headers: h() }).then(r => r.json()).then(d => setLinks(d.brokenLinks || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const total = links.length
  const broken404 = links.filter(l => l.statusCode === 404).length
  const broken500 = links.filter(l => l.statusCode === 500).length
  const redirects301 = links.filter(l => l.statusCode === 301).length

  const filtered = links.filter(l => {
    if (filter === 'all') return true
    if (filter === '404') return l.statusCode === 404
    if (filter === '500') return l.statusCode === 500
    if (filter === '301') return l.statusCode === 301
    return true
  })

  const statusBadge = (code: number) => {
    if (code === 404) return 'bg-red-100 text-red-700'
    if (code === 500) return 'bg-red-100 text-red-700'
    if (code === 301) return 'bg-amber-100 text-amber-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setFilter('all')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-red-300 transition-colors" onClick={() => setFilter('404')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{broken404}</p>
            <p className="text-xs text-gray-500">404 Not Found</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-red-300 transition-colors" onClick={() => setFilter('500')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{broken500}</p>
            <p className="text-xs text-gray-500">500 Server Error</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-amber-300 transition-colors" onClick={() => setFilter('301')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{redirects301}</p>
            <p className="text-xs text-gray-500">301 Redirects</p>
          </CardContent>
        </Card>
      </div>

      {loading ? <Loading /> : links.length === 0 ? <Empty text="No broken links found." /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Broken URL</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Source Page</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status Code</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Link Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Anchor Text</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs truncate max-w-[200px] text-red-500">{l.targetUrl || l.url}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[200px]">{l.sourceUrl || l.sourcePage || '—'}</td>
                    <td className="px-4 py-3"><Badge className={`text-xs ${statusBadge(l.statusCode)}`}>{l.statusCode || '—'}</Badge></td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{l.linkType || '—'}</Badge></td>
                    <td className="px-4 py-3 text-xs">{l.anchorText || '—'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No links match this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 10: LOCAL SEO
// ═══════════════════════════════════════════════════════════
function LocalSEOTab({ h }: { h: () => any }) {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [citations, setCitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/local-businesses`, { headers: h() }).then(r => r.json()),
      fetch(`${API}/geo-citations`, { headers: h() }).then(r => r.json()).catch(() => ({ citations: [] })),
    ]).then(([bd, cd]) => {
      setBusinesses(bd.businesses || [])
      setCitations(cd.citations || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Business Listings</h3>
      {businesses.length === 0 ? <Empty text="No businesses listed for Local SEO tracking." /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businesses.map(b => (
            <Card key={b.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-gray-500">{[b.address, b.city, b.state, b.country].filter(Boolean).join(', ')}</p>
                  </div>
                  {b.napConsistent && <Badge className="bg-emerald-100 text-emerald-700 text-xs">NAP ✓</Badge>}
                </div>
                {b.phone && <p className="text-xs text-gray-500">📞 {b.phone}</p>}
                {b.email && <p className="text-xs text-gray-500">✉️ {b.email}</p>}
                {b.website && <p className="text-xs text-blue-500 truncate">🔗 {b.website}</p>}
                <div className="flex items-center gap-2">
                  {b.category && <Badge variant="outline" className="text-xs">{b.category}</Badge>}
                  {b.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-medium">{b.rating}</span>
                      {b.reviewCount && <span className="text-xs text-gray-400">({b.reviewCount} reviews)</span>}
                    </div>
                  )}
                </div>
                {b.googleBusinessProfile && (
                  <div className="bg-blue-50 rounded-lg p-2 mt-2">
                    <p className="text-xs font-medium text-blue-700">Google Business Profile</p>
                    <p className="text-[10px] text-blue-500">{b.googleBusinessProfile}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {citations.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-700 pt-2">Local Citations</h3>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">NAP Match</th>
                  </tr>
                </thead>
                <tbody>
                  {citations.map((c: any) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{c.source || c.platform || '—'}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{c.type || c.category || '—'}</Badge></td>
                      <td className="px-4 py-3">
                        <Badge className={c.status === 'active' || c.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {c.status || (c.verified ? 'verified' : 'pending')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {c.napMatch !== undefined ? (c.napMatch ? '✅' : '❌') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 11: RANK TRACKER
// ═══════════════════════════════════════════════════════════
function RankingTab({ h, token }: { h: () => any; token: string | null }) {
  const [rankings, setRankings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [engineFilter, setEngineFilter] = useState('all')
  const [deviceFilter, setDeviceFilter] = useState('all')

  useEffect(() => {
    fetch(`${API}/rank-tracking`, { headers: h() }).then(r => r.json()).then(d => setRankings(d.rankings || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const engines = [...new Set(rankings.map(r => r.searchEngine).filter(Boolean))]
  const devices = [...new Set(rankings.map(r => r.device).filter(Boolean))]

  const filtered = rankings.filter(r => {
    if (engineFilter !== 'all' && r.searchEngine !== engineFilter) return false
    if (deviceFilter !== 'all' && r.device !== deviceFilter) return false
    return true
  })

  const changeIcon = (current: number, previous: number) => {
    if (!current || !previous) return <Minus className="w-3.5 h-3.5 text-gray-400" />
    if (current < previous) return <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
    if (current > previous) return <ArrowDown className="w-3.5 h-3.5 text-red-500" />
    return <Minus className="w-3.5 h-3.5 text-gray-400" />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <select value={engineFilter} onChange={e => setEngineFilter(e.target.value)} className="text-sm border rounded-md px-3 py-2">
            <option value="all">All Engines</option>
            {engines.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className="text-sm border rounded-md px-3 py-2">
            <option value="all">All Devices</option>
            {devices.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {token && <ExportButton type="rankings" token={token} />}
      </div>

      {loading ? <Loading /> : filtered.length === 0 ? <Empty text="No rankings tracked." /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Keyword</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Previous</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Change</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Engine</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Device</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Clicks</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Impressions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.keyword}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${r.position <= 10 ? 'text-emerald-600' : r.position <= 20 ? 'text-amber-600' : 'text-gray-600'}`}>
                        #{r.position || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.prevPosition ? `#${r.prevPosition}` : '—'}</td>
                    <td className="px-4 py-3">{changeIcon(r.position, r.prevPosition)}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{r.searchEngine || '—'}</Badge></td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{r.device || '—'}</Badge></td>
                    <td className="px-4 py-3 text-gray-600">{r.clicks?.toLocaleString() || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.impressions?.toLocaleString() || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TAB 12: GEO — Generative Engine Optimization
// ═══════════════════════════════════════════════════════════
function GEOTab({ h }: { h: () => any }) {
  const [audits, setAudits] = useState<any[]>([])
  const [citations, setCitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/geo-audits`, { headers: h() }).then(r => r.json()),
      fetch(`${API}/geo-citations`, { headers: h() }).then(r => r.json()).catch(() => ({ citations: [] })),
    ]).then(([ad, cd]) => {
      setAudits(ad.geoAudits || [])
      setCitations(cd.citations || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const runAudit = async () => {
    if (!url) return
    setRunning(true); setResult(null)
    const res = await fetch(`${API}/geo-audits`, { method: 'POST', headers: h(), body: JSON.stringify({ url }) })
    const data = await res.json()
    setResult(data); loadAudits(); setRunning(false)
  }

  const loadAudits = () => {
    fetch(`${API}/geo-audits`, { headers: h() }).then(r => r.json()).then(d => setAudits(d.geoAudits || [])).catch(() => {})
  }

  const aiEngines = [
    { name: 'ChatGPT', score: result?.engineScores?.chatgpt || 72, color: 'bg-emerald-500' },
    { name: 'Perplexity', score: result?.engineScores?.perplexity || 68, color: 'bg-blue-500' },
    { name: 'Google AI', score: result?.engineScores?.googleAi || 80, color: 'bg-amber-500' },
    { name: 'Gemini', score: result?.engineScores?.gemini || 65, color: 'bg-violet-500' },
    { name: 'Claude', score: result?.engineScores?.claude || 70, color: 'bg-rose-500' },
  ]

  const geoAuditScores = [
    { label: 'Citation Score', score: result?.geoAudit?.citationScore || result?.citationScore || 0, color: 'bg-blue-500' },
    { label: 'Authority (E-E-A-T)', score: result?.geoAudit?.authorityScore || result?.authorityScore || 0, color: 'bg-violet-500' },
    { label: 'Content Structure', score: result?.geoAudit?.structureScore || result?.structureScore || 0, color: 'bg-teal-500' },
    { label: 'Evidence & Data', score: result?.geoAudit?.evidenceScore || result?.evidenceScore || 0, color: 'bg-amber-500' },
    { label: 'Freshness', score: result?.geoAudit?.freshnessScore || result?.freshnessScore || 0, color: 'bg-emerald-500' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="https://your-page.com" value={url} onChange={e => setUrl(e.target.value)} className="flex-1" />
        <Button onClick={runAudit} disabled={running || !url} className="bg-blue-600 hover:bg-blue-700">
          {running ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Zap className="w-4 h-4 mr-1" />}Run GEO Audit
        </Button>
      </div>

      {/* AI Engine Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {aiEngines.map(e => (
          <Card key={e.name}>
            <CardContent className="p-3 text-center">
              <p className="text-xs font-medium text-gray-600 mb-1">{e.name}</p>
              <p className="text-2xl font-bold text-gray-900">{e.score}</p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                <div className={`h-1.5 rounded-full ${e.color}`} style={{ width: `${e.score}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">GEO Audit Scores</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {geoAuditScores.map(s => (
                <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color} />
              ))}
            </CardContent>
          </Card>

          {result.contentAnalysis && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Content Analysis</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Word Count</p>
                    <p className="font-bold">{result.contentAnalysis.wordCount?.toLocaleString() || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Avg Sentence Length</p>
                    <p className="font-bold">{result.contentAnalysis.avgSentenceLength || '—'} words</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Has Citations</p>
                    <p className="font-bold">{result.contentAnalysis.hasCitations ? '✅ Yes' : '❌ No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Has Numbers/Data</p>
                    <p className="font-bold">{result.contentAnalysis.hasNumbers ? '✅ Yes' : '❌ No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Has Lists</p>
                    <p className="font-bold">{result.contentAnalysis.hasLists ? '✅ Yes' : '❌ No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Has Tables</p>
                    <p className="font-bold">{result.contentAnalysis.hasTables ? '✅ Yes' : '❌ No'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Has FAQ</p>
                    <p className="font-bold">{result.contentAnalysis.hasFAQ ? '✅ Yes' : '❌ No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {result.issues && result.issues.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Issues & Recommendations</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {result.issues.map((issue: any, i: number) => (
                  <div key={i} className={`p-3 rounded-lg border text-sm ${
                    issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                    issue.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                    'bg-amber-50 border-amber-200'
                  }`}>
                    <p className="font-medium">{issue.message || issue.title}</p>
                    {issue.fix && <p className="text-xs text-gray-500 mt-1">💡 {issue.fix}</p>}
                    {issue.impact && <p className="text-xs text-gray-400 mt-0.5">Impact: {issue.impact}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Citations */}
      {citations.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">GEO Citations ({citations.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Engine</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Quote</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {citations.map((c: any) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{c.engine || c.aiEngine || '—'}</Badge></td>
                      <td className="px-4 py-3 text-xs truncate max-w-[200px]">{c.source || c.sourceUrl || '—'}</td>
                      <td className="px-4 py-3 text-xs max-w-[300px] line-clamp-2 italic text-gray-600">"{c.quote || c.excerpt || '—'}"</td>
                      <td className="px-4 py-3">
                        {c.confidence !== undefined ? (
                          <Badge className={c.confidence >= 80 ? 'bg-emerald-100 text-emerald-700' : c.confidence >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                            {c.confidence}%
                          </Badge>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit History */}
      {audits.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Audit History</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">URL</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Score</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Citation</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Authority</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Structure</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {audits.map(a => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs truncate max-w-[200px]">{a.url}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${a.score >= 70 ? 'text-emerald-600' : a.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{a.score}</span>
                    </td>
                    <td className="px-4 py-3">{a.citationScore}</td>
                    <td className="px-4 py-3">{a.authorityScore}</td>
                    <td className="px-4 py-3">{a.structureScore}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && !result && audits.length === 0 && citations.length === 0 && (
        <Empty text="No GEO data yet. Enter a URL above to check AI citation readiness." />
      )}
    </div>
  )
}
