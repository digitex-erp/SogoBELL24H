import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Megaphone, Plus, Search, Calendar, DollarSign, TrendingUp, Users, Target,
  CheckCircle, Clock, Pause, Play, Edit, Trash2, Globe, X, Send, Loader2,
  AlertTriangle, BarChart3, ArrowLeft, Eye
} from 'lucide-react'
import { cn } from '@/lib/cn'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
  active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  paused: { label: 'Paused', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  completed: { label: 'Completed', color: 'text-blue-700', bg: 'bg-blue-100' },
}

export function CampaignCenterPage() {
  const { token } = useAuth()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [tab, setTab] = useState<'campaigns' | 'schedule' | 'calendar'>('campaigns')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formObjective, setFormObjective] = useState('Lead Generation')
  const [formBudget, setFormBudget] = useState('')
  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Scheduled post form
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postType, setPostType] = useState('social')
  const [postPlatform, setPostPlatform] = useState('instagram')
  const [postScheduledAt, setPostScheduledAt] = useState('')
  const [showPostDialog, setShowPostDialog] = useState(false)

  const loadData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const [campRes, postRes] = await Promise.all([
        api('/api/campaigns', token).catch(() => ({ items: [] })),
        api('/api/scheduled-posts', token).catch(() => ({ items: [] })),
      ])
      setCampaigns(campRes.items || campRes.campaigns || [])
      setScheduledPosts(postRes.items || postRes.scheduledPosts || [])
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [token])

  useEffect(() => { loadData() }, [loadData])

  const filtered = campaigns.filter((c: any) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c: any) => c.status === 'active').length,
    totalBudget: campaigns.reduce((s: number, c: any) => s + (c.budget || 0), 0),
    totalSpent: campaigns.reduce((s: number, c: any) => s + (c.spent || 0), 0),
    totalConversions: campaigns.reduce((s: number, c: any) => s + (c.conversions || 0), 0),
  }

  const resetForm = () => { setFormName(''); setFormObjective('Lead Generation'); setFormBudget(''); setFormStartDate(''); setFormEndDate(''); setFormDescription(''); setEditingId(null) }

  const saveCampaign = async () => {
    if (!formName) { setError('Name required'); return }
    try {
      const payload = {
        name: formName, objective: formObjective, budget: parseFloat(formBudget) || 0,
        startDate: formStartDate || null, endDate: formEndDate || null,
      }
      if (editingId) {
        await api(`/api/campaigns/${editingId}`, token, { method: 'PATCH', body: JSON.stringify(payload) })
        setSuccess('Campaign updated!')
      } else {
        await api('/api/campaigns', token, { method: 'POST', body: JSON.stringify(payload) })
        setSuccess('Campaign created!')
      }
      setShowCreateDialog(false); resetForm(); loadData()
    } catch (e: any) { setError(e.message) }
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('Delete this campaign?')) return
    try { await api(`/api/campaigns/${id}`, token, { method: 'DELETE' }); loadData() } catch (e: any) { setError(e.message) }
  }

  const toggleCampaignStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'active' ? 'paused' : 'active'
    try { await api(`/api/campaigns/${id}`, token, { method: 'PATCH', body: JSON.stringify({ status: next }) }); loadData() } catch (e: any) { setError(e.message) }
  }

  const savePost = async () => {
    if (!postTitle) { setError('Title required'); return }
    try {
      await api('/api/scheduled-posts', token, {
        method: 'POST', body: JSON.stringify({ title: postTitle, content: postContent, type: postType, platform: postPlatform, scheduledAt: postScheduledAt || new Date().toISOString() })
      })
      setSuccess('Post scheduled!'); setShowPostDialog(false); setPostTitle(''); setPostContent(''); loadData()
    } catch (e: any) { setError(e.message) }
  }

  const deletePost = async (id: string) => {
    try { await api(`/api/scheduled-posts/${id}`, token, { method: 'DELETE' }); loadData() } catch (e: any) { setError(e.message) }
  }

  if (view === 'detail' && selectedCampaign) {
    const c = selectedCampaign
    const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.draft
    const utilization = c.budget > 0 ? (c.spent / c.budget) * 100 : 0
    const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100) : 0
    const convRate = c.clicks > 0 ? ((c.conversions / c.clicks) * 100) : 0

    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('list'); setSelectedCampaign(null) }} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-4 h-4" /></button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"><Megaphone className="w-5 h-5 text-white" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><h1 className="text-lg font-bold text-gray-900">{c.name}</h1><span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", st.bg, st.color)}>{st.label}</span></div>
            <p className="text-xs text-gray-500">{c.objective} · {c.startDate?.slice(0,10)} → {c.endDate?.slice(0,10)}</p>
          </div>
          <div className="flex gap-2">
            {c.status === 'active' && <button onClick={() => toggleCampaignStatus(c.id, c.status)} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium"><Pause className="w-3 h-3" /> Pause</button>}
            {c.status === 'paused' && <button onClick={() => toggleCampaignStatus(c.id, c.status)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium"><Play className="w-3 h-3" /> Resume</button>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Impressions', value: (c.impressions || 0).toLocaleString(), color: 'text-blue-600' },
            { label: 'Clicks', value: (c.clicks || 0).toLocaleString(), color: 'text-purple-600' },
            { label: 'CTR', value: `${ctr.toFixed(1)}%`, color: 'text-indigo-600' },
            { label: 'Conversions', value: (c.conversions || 0).toString(), color: 'text-emerald-600' },
            { label: 'Conv. Rate', value: `${convRate.toFixed(1)}%`, color: 'text-green-600' },
            { label: 'Budget', value: `₹${((c.budget || 0) / 1000).toFixed(0)}K`, color: 'text-orange-600' },
            { label: 'Spent', value: `₹${((c.spent || 0) / 1000).toFixed(1)}K`, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border rounded-xl p-3 text-center shadow-sm"><p className={cn("text-lg font-bold", s.color)}>{s.value}</p><p className="text-[10px] text-gray-400">{s.label}</p></div>
          ))}
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Budget Utilization</h3>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-yellow-500' : 'bg-emerald-500')} style={{ width: `${Math.min(utilization, 100)}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{utilization.toFixed(1)}% utilized</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center"><Megaphone className="w-5 h-5 text-white" /></div>
          <div><h1 className="text-lg font-bold text-gray-900">Campaign Center</h1><p className="text-xs text-gray-500">{stats.active} active · {stats.total} total</p></div>
        </div>
        <button onClick={() => { resetForm(); setShowCreateDialog(true) }} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> New Campaign</button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700"><AlertTriangle className="w-4 h-4" /> {error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[['campaigns', 'Campaigns', Megaphone], ['schedule', 'Scheduled Posts', Clock], ['calendar', 'Calendar', Calendar]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id as any)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors", tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}><Icon className="w-3.5 h-3.5" /> {label}</button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Campaigns', value: stats.total.toString(), icon: <Megaphone className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active.toString(), icon: <Play className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Budget', value: `₹${(stats.totalBudget / 1000).toFixed(0)}K`, icon: <DollarSign className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
          { label: 'Total Spent', value: `₹${(stats.totalSpent / 1000).toFixed(0)}K`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-orange-600 bg-orange-50' },
          { label: 'Conversions', value: stats.totalConversions.toLocaleString(), icon: <Target className="w-4 h-4" />, color: 'text-cyan-600 bg-cyan-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border rounded-xl p-3 shadow-sm"><div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", s.color)}>{s.icon}</div><p className="text-lg font-bold text-gray-900">{s.value}</p><p className="text-[11px] text-gray-400">{s.label}</p></div>
        ))}
      </div>

      {/* Campaign List */}
      {tab === 'campaigns' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 max-w-sm"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:border-emerald-500 focus:outline-none" /></div>
            <div className="flex gap-1">
              {['all', 'active', 'paused', 'draft', 'completed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize", filterStatus === s ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-500 hover:text-gray-700')}>{s}</button>
              ))}
            </div>
          </div>

          {loading ? <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" /></div> : (
            <div className="space-y-2">
              {filtered.map((c: any) => {
                const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.draft
                const utilization = c.budget > 0 ? (c.spent / c.budget) * 100 : 0
                return (
                  <div key={c.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedCampaign(c); setView('detail') }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0"><Megaphone className="w-5 h-5 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1"><h3 className="text-sm font-semibold text-gray-900 truncate">{c.name}</h3><span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", st.bg, st.color)}>{st.label}</span></div>
                        <div className="flex items-center gap-4 text-[11px] text-gray-500"><span>{c.objective}</span><span>{c.startDate?.slice(0,10)} → {c.endDate?.slice(0,10)}</span></div>
                        <div className="grid grid-cols-4 gap-4 mt-3">
                          <div><p className="text-xs font-bold text-gray-900">{(c.impressions || 0).toLocaleString()}</p><p className="text-[10px] text-gray-400">Impressions</p></div>
                          <div><p className="text-xs font-bold text-gray-900">{(c.clicks || 0).toLocaleString()}</p><p className="text-[10px] text-gray-400">Clicks</p></div>
                          <div><p className="text-xs font-bold text-emerald-600">{c.conversions || 0}</p><p className="text-[10px] text-gray-400">Conversions</p></div>
                          <div><p className="text-xs font-bold text-gray-900">₹{((c.spent || 0) / 1000).toFixed(1)}K / ₹{((c.budget || 0) / 1000).toFixed(0)}K</p>
                            <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className={cn("h-full rounded-full", utilization > 80 ? 'bg-red-500' : 'bg-emerald-500')} style={{ width: `${Math.min(utilization, 100)}%` }} /></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleCampaignStatus(c.id, c.status)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-emerald-600" title={c.status === 'active' ? 'Pause' : 'Activate'}>{c.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}</button>
                        <button onClick={() => { setEditingId(c.id); setFormName(c.name); setFormObjective(c.objective || ''); setFormBudget(c.budget || ''); setFormStartDate(c.startDate?.slice(0,10) || ''); setFormEndDate(c.endDate?.slice(0,10) || ''); setShowCreateDialog(true) }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteCampaign(c.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No campaigns found</p></div>}
            </div>
          )}
        </>
      )}

      {/* Scheduled Posts */}
      {tab === 'schedule' && (
        <>
          <div className="flex justify-end"><button onClick={() => setShowPostDialog(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> Schedule Post</button></div>
          <div className="space-y-2">
            {scheduledPosts.map((p: any) => (
              <div key={p.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", p.type === 'social' ? 'bg-purple-50 text-purple-600' : p.type === 'email' ? 'bg-blue-50 text-blue-600' : p.type === 'blog' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600')}>
                    {p.type === 'social' ? '📱' : p.type === 'email' ? '📧' : p.type === 'blog' ? '📝' : '📢'}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{p.title}</h3>
                    <p className="text-xs text-gray-500">{p.platform} · {p.type} · {new Date(p.scheduledAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", p.status === 'published' ? 'bg-emerald-100 text-emerald-700' : p.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600')}>{p.status}</span>
                  <button onClick={() => deletePost(p.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {scheduledPosts.length === 0 && <div className="text-center py-12 text-gray-400"><Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No scheduled posts</p></div>}
          </div>
        </>
      )}

      {/* Calendar View */}
      {tab === 'calendar' && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Content Calendar</h3>
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="bg-gray-50 p-2 text-center text-[10px] font-medium text-gray-500">{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(2026, 6, i - 1)
              const dayPosts = scheduledPosts.filter((p: any) => new Date(p.scheduledAt).toDateString() === date.toDateString())
              return (
                <div key={i} className="bg-white p-2 min-h-[60px]">
                  <p className="text-xs text-gray-500">{date.getDate()}</p>
                  {dayPosts.map((p: any) => (
                    <div key={p.id} className="mt-1 text-[9px] bg-emerald-100 text-emerald-700 rounded px-1 py-0.5 truncate">{p.title}</div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Create Campaign Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowCreateDialog(false); resetForm() }}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Campaign' : 'New Campaign'}</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-gray-700">Campaign Name</label><input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g., Monsoon Collection 2026" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:border-emerald-500 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Objective</label><select value={formObjective} onChange={e => setFormObjective(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{['Lead Generation', 'Brand Awareness', 'Sales', 'Engagement'].map(o => <option key={o}>{o}</option>)}</select></div>
                <div><label className="text-xs font-medium text-gray-700">Budget (₹)</label><input type="number" value={formBudget} onChange={e => setFormBudget(e.target.value)} placeholder="50000" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Start Date</label><input type="date" value={formStartDate} onChange={e => setFormStartDate(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">End Date</label><input type="date" value={formEndDate} onChange={e => setFormEndDate(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowCreateDialog(false); resetForm() }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={saveCampaign} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">{editingId ? 'Update' : 'Create'} Campaign</button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Post Dialog */}
      {showPostDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPostDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Post</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-gray-700">Title</label><input value={postTitle} onChange={e => setPostTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-700">Content</label><textarea value={postContent} onChange={e => setPostContent(e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Type</label><select value={postType} onChange={e => setPostType(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{['social', 'email', 'blog', 'ad', 'whatsapp'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="text-xs font-medium text-gray-700">Platform</label><select value={postPlatform} onChange={e => setPostPlatform(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{['instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'email', 'website'].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div><label className="text-xs font-medium text-gray-700">Schedule</label><input type="datetime-local" value={postScheduledAt} onChange={e => setPostScheduledAt(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowPostDialog(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={savePost} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
