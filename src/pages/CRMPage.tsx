import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Users, Search, Plus, Star, Mail, Phone, Building2, DollarSign, TrendingUp,
  MoreHorizontal, Edit, Trash2, Clock, Calendar, Tag, X, CheckCircle, AlertCircle,
  Briefcase, MessageSquare, FileText, PhoneCall, Send, Loader2, ArrowLeft, Target
} from 'lucide-react'
import { cn } from '@/lib/cn'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

const STATUS_PIPELINE = [
  { key: 'new', label: 'New', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  { key: 'contacted', label: 'Contacted', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
  { key: 'qualified', label: 'Qualified', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
  { key: 'proposal', label: 'Proposal', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-cyan-500', textColor: 'text-cyan-700', bgColor: 'bg-cyan-50' },
  { key: 'won', label: 'Won', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50' },
]

const DEAL_STAGES = [
  { key: 'prospect', label: 'Prospect', color: 'bg-gray-100 text-gray-700' },
  { key: 'proposal', label: 'Proposal', color: 'bg-blue-100 text-blue-700' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-amber-100 text-amber-700' },
  { key: 'closed_won', label: 'Won', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'closed_lost', label: 'Lost', color: 'bg-red-100 text-red-700' },
]

export function CRMPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<'leads' | 'pipeline' | 'deals' | 'activities'>('leads')
  const [leads, setLeads] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDealDialog, setShowDealDialog] = useState(false)
  const [showActivityDialog, setShowActivityDialog] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  // Lead form
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', source: 'Website', value: '', notes: '' })
  const [dealForm, setDealForm] = useState({ title: '', value: '', company: '', contactName: '', contactEmail: '', status: 'prospect', probability: '25', notes: '' })
  const [actForm, setActForm] = useState({ type: 'call', title: '', description: '', leadId: '' })

  const loadData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const [leadRes, dealRes, actRes] = await Promise.all([
        api('/api/leads', token).catch(() => ({ items: [] })),
        api('/api/deals', token).catch(() => ({ items: [] })),
        api('/api/activities', token).catch(() => ({ items: [] })),
      ])
      setLeads(leadRes.items || leadRes.leads || [])
      setDeals(dealRes.items || dealRes.deals || [])
      setActivities(actRes.items || actRes.activities || [])
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [token])

  useEffect(() => { loadData() }, [loadData])

  const filteredLeads = leads.filter((l: any) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) || l.company?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: leads.length,
    totalValue: leads.reduce((s: number, l: any) => s + (l.value || 0), 0),
    wonValue: leads.filter((l: any) => l.status === 'won').reduce((s: number, l: any) => s + (l.value || 0), 0),
    avgScore: leads.length ? Math.round(leads.reduce((s: number, l: any) => s + (l.score || 0), 0) / leads.length) : 0,
    dealValue: deals.reduce((s: number, d: any) => s + (d.value || 0), 0),
    wonDeals: deals.filter((d: any) => d.status === 'closed_won').length,
  }

  const saveLead = async () => {
    if (!form.name) { setError('Name required'); return }
    try {
      await api('/api/leads', token, { method: 'POST', body: JSON.stringify({ ...form, value: parseFloat(form.value) || 0 }) })
      setSuccess('Lead added!'); setShowAddDialog(false); setForm({ name: '', email: '', phone: '', company: '', source: 'Website', value: '', notes: '' }); loadData()
    } catch (e: any) { setError(e.message) }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Delete?')) return
    try { await api(`/api/leads/${id}`, token, { method: 'DELETE' }); loadData() } catch (e: any) { setError(e.message) }
  }

  const updateLeadStatus = async (id: string, status: string) => {
    try { await api(`/api/leads/${id}`, token, { method: 'PATCH', body: JSON.stringify({ status }) }); loadData() } catch (e: any) { setError(e.message) }
  }

  const saveDeal = async () => {
    if (!dealForm.title) { setError('Title required'); return }
    try {
      await api('/api/deals', token, { method: 'POST', body: JSON.stringify({ ...dealForm, value: parseFloat(dealForm.value) || 0, probability: parseInt(dealForm.probability) || 0 }) })
      setSuccess('Deal created!'); setShowDealDialog(false); setDealForm({ title: '', value: '', company: '', contactName: '', contactEmail: '', status: 'prospect', probability: '25', notes: '' }); loadData()
    } catch (e: any) { setError(e.message) }
  }

  const deleteDeal = async (id: string) => {
    if (!confirm('Delete?')) return
    try { await api(`/api/deals/${id}`, token, { method: 'DELETE' }); loadData() } catch (e: any) { setError(e.message) }
  }

  const saveActivity = async () => {
    if (!actForm.title) { setError('Title required'); return }
    try {
      await api('/api/activities', token, { method: 'POST', body: JSON.stringify(actForm) })
      setSuccess('Activity logged!'); setShowActivityDialog(false); setActForm({ type: 'call', title: '', description: '', leadId: '' }); loadData()
    } catch (e: any) { setError(e.message) }
  }

  const deleteActivity = async (id: string) => {
    try { await api(`/api/activities/${id}`, token, { method: 'DELETE' }); loadData() } catch (e: any) { setError(e.message) }
  }

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`

  // ── Detail View ──
  if (showDetail && selectedLead) {
    const l = selectedLead
    const col = STATUS_PIPELINE.find(s => s.key === l.status)
    const leadActivities = activities.filter((a: any) => a.leadId === l.id)
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setShowDetail(false); setSelectedLead(null) }} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-4 h-4" /></button>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">{l.name?.charAt(0)}</div>
          <div className="flex-1"><h1 className="text-lg font-bold text-gray-900">{l.name}</h1><p className="text-xs text-gray-500">{l.company} · {l.email}</p></div>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", col?.bgColor, col?.textColor)}>{col?.label}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ l: 'Value', v: fmt(l.value || 0), c: 'text-emerald-600' }, { l: 'Score', v: `${l.score || 0}/100`, c: 'text-amber-600' }, { l: 'Source', v: l.source || '—', c: 'text-blue-600' }, { l: 'Phone', v: l.phone || '—', c: 'text-gray-600' }].map(s => (
            <div key={s.l} className="bg-white border rounded-xl p-3 shadow-sm"><p className="text-[10px] text-gray-400">{s.l}</p><p className={cn("text-sm font-bold", s.c)}>{s.v}</p></div>
          ))}
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-medium text-gray-700">Activities ({leadActivities.length})</h3><button onClick={() => { setActForm({ ...actForm, leadId: l.id }); setShowActivityDialog(true) }} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">+ Add Activity</button></div>
          <div className="space-y-2">
            {leadActivities.map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">{a.type === 'call' ? <PhoneCall className="w-3.5 h-3.5 text-blue-600" /> : a.type === 'email' ? <Mail className="w-3.5 h-3.5 text-purple-600" /> : <MessageSquare className="w-3.5 h-3.5 text-green-600" />}</div>
                <div className="flex-1"><p className="text-xs font-medium text-gray-900">{a.title}</p><p className="text-[10px] text-gray-500">{a.description} · {new Date(a.createdAt).toLocaleDateString()}</p></div>
                <button onClick={() => deleteActivity(a.id)} className="p-1 rounded hover:bg-gray-200"><Trash2 className="w-3 h-3 text-gray-400" /></button>
              </div>
            ))}
            {leadActivities.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No activities yet</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center"><Users className="w-5 h-5 text-white" /></div>
          <div><h1 className="text-lg font-bold text-gray-900">CRM & Sales</h1><p className="text-xs text-gray-500">{stats.total} leads · {fmt(stats.dealValue)} pipeline</p></div>
        </div>
        <div className="flex gap-2">
          {tab === 'leads' && <button onClick={() => setShowAddDialog(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> Add Lead</button>}
          {tab === 'deals' && <button onClick={() => setShowDealDialog(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> Add Deal</button>}
          {tab === 'activities' && <button onClick={() => setShowActivityDialog(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> Log Activity</button>}
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700"><AlertCircle className="w-4 h-4" /> {error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[['leads', 'Leads', Users], ['pipeline', 'Pipeline', Target], ['deals', 'Deals', DollarSign], ['activities', 'Activities', Clock]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id as any)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors", tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}><Icon className="w-3.5 h-3.5" /> {label}</button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: stats.total.toString(), color: 'text-blue-600 bg-blue-50', icon: <Users className="w-4 h-4" /> },
          { label: 'Pipeline Value', value: fmt(stats.totalValue), color: 'text-emerald-600 bg-emerald-50', icon: <DollarSign className="w-4 h-4" /> },
          { label: 'Won Value', value: fmt(stats.wonValue), color: 'text-green-600 bg-green-50', icon: <TrendingUp className="w-4 h-4" /> },
          { label: 'Avg Score', value: stats.avgScore.toString(), color: 'text-amber-600 bg-amber-50', icon: <Star className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-white border rounded-xl p-3 shadow-sm"><div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", s.color)}>{s.icon}</div><p className="text-lg font-bold text-gray-900">{s.value}</p><p className="text-[11px] text-gray-400">{s.label}</p></div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:border-emerald-500 focus:outline-none" /></div>

      {loading ? <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" /></div> : (
        <>
          {/* Leads Table */}
          {tab === 'leads' && (
            <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Lead</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Company</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Score</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Value</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Source</th>
                  <th className="px-4 py-3"></th>
                </tr></thead>
                <tbody>
                  {filteredLeads.map((l: any) => {
                    const col = STATUS_PIPELINE.find(s => s.key === l.status)
                    return (
                      <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedLead(l); setShowDetail(true) }}>
                        <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">{l.name?.charAt(0)}</div><div><p className="text-xs font-semibold text-gray-900">{l.name}</p><p className="text-[10px] text-gray-400">{l.email}</p></div></div></td>
                        <td className="px-4 py-3 text-xs text-gray-600">{l.company}</td>
                        <td className="px-4 py-3"><span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", col?.bgColor, col?.textColor)}>{col?.label}</span></td>
                        <td className="px-4 py-3"><div className="flex items-center gap-1"><Star className={cn("w-3 h-3", (l.score || 0) >= 80 ? 'text-amber-500 fill-amber-500' : 'text-gray-300')} /><span className="text-xs font-medium">{l.score || 0}</span></div></td>
                        <td className="px-4 py-3 text-xs font-bold text-emerald-600">{fmt(l.value || 0)}</td>
                        <td className="px-4 py-3"><span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600">{l.source}</span></td>
                        <td className="px-4 py-3"><button onClick={e => { e.stopPropagation(); deleteLead(l.id) }} className="p-1 rounded hover:bg-gray-200"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button></td>
                      </tr>
                    )
                  })}
                  {filteredLeads.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No leads found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Pipeline View */}
          {tab === 'pipeline' && (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {STATUS_PIPELINE.map(col => {
                const colLeads = leads.filter((l: any) => l.status === col.key)
                return (
                  <div key={col.key} className="w-64 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2"><div className={cn("w-2 h-2 rounded-full", col.color)} /><span className="text-xs font-semibold text-gray-700">{col.label}</span><span className="text-xs text-gray-400 ml-auto">{colLeads.length}</span></div>
                    <div className="space-y-2">
                      {colLeads.map((l: any) => (
                        <div key={l.id} className="bg-white border rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedLead(l); setShowDetail(true) }}>
                          <p className="text-xs font-semibold text-gray-900">{l.name}</p>
                          <p className="text-[10px] text-gray-500">{l.company}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] font-bold text-emerald-600">{fmt(l.value || 0)}</span>
                            <div className="flex items-center gap-0.5"><Star className={cn("w-3 h-3", (l.score || 0) >= 80 ? 'text-amber-500 fill-amber-500' : 'text-gray-300')} /><span className="text-[10px] text-gray-400">{l.score || 0}</span></div>
                          </div>
                          <div className="flex gap-1 mt-2">{(l.tags || '').split(',').filter(Boolean).map((t: string) => <span key={t} className="text-[9px] px-1 py-0.5 bg-gray-100 text-gray-500 rounded">{t.trim()}</span>)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Deals */}
          {tab === 'deals' && (
            <div className="space-y-2">
              {deals.map((d: any) => {
                const stage = DEAL_STAGES.find(s => s.key === d.status)
                return (
                  <div key={d.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center"><DollarSign className="w-5 h-5 text-white" /></div>
                        <div><h3 className="text-sm font-semibold text-gray-900">{d.title}</h3><p className="text-[10px] text-gray-500">{d.company || d.contactName} · {d.probability || 0}% probability</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-600">{fmt(d.value || 0)}</span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", stage?.color)}>{stage?.label}</span>
                        <button onClick={() => deleteDeal(d.id)} className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {deals.length === 0 && <div className="text-center py-12 text-gray-400"><DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No deals yet</p></div>}
            </div>
          )}

          {/* Activities */}
          {tab === 'activities' && (
            <div className="space-y-2">
              {activities.map((a: any) => (
                <div key={a.id} className="bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">{a.type === 'call' ? <PhoneCall className="w-5 h-5 text-blue-600" /> : a.type === 'email' ? <Mail className="w-5 h-5 text-purple-600" /> : a.type === 'meeting' ? <Calendar className="w-5 h-5 text-amber-600" /> : <MessageSquare className="w-5 h-5 text-green-600" />}</div>
                  <div className="flex-1"><h3 className="text-sm font-semibold text-gray-900">{a.title}</h3><p className="text-xs text-gray-500">{a.description}</p></div>
                  <div className="text-right"><span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 capitalize">{a.type}</span><p className="text-[10px] text-gray-400 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p></div>
                  <button onClick={() => deleteActivity(a.id)} className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                </div>
              ))}
              {activities.length === 0 && <div className="text-center py-12 text-gray-400"><Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No activities yet</p></div>}
            </div>
          )}
        </>
      )}

      {/* Add Lead Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Lead</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Full Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Company</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Source</label><select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{['Website', 'LinkedIn', 'Referral', 'Google Ads', 'Trade Show', 'WhatsApp'].map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="text-xs font-medium text-gray-700">Value (₹)</label><input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="text-xs font-medium text-gray-700">Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddDialog(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={saveLead} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Add Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Deal Dialog */}
      {showDealDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDealDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Deal</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-gray-700">Deal Title *</label><input value={dealForm.title} onChange={e => setDealForm({ ...dealForm, title: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Value (₹)</label><input type="number" value={dealForm.value} onChange={e => setDealForm({ ...dealForm, value: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Probability %</label><input type="number" value={dealForm.probability} onChange={e => setDealForm({ ...dealForm, probability: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Company</label><input value={dealForm.company} onChange={e => setDealForm({ ...dealForm, company: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Contact Name</label><input value={dealForm.contactName} onChange={e => setDealForm({ ...dealForm, contactName: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="text-xs font-medium text-gray-700">Status</label><select value={dealForm.status} onChange={e => setDealForm({ ...dealForm, status: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{DEAL_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowDealDialog(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={saveDeal} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Create Deal</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Dialog */}
      {showActivityDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowActivityDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Log Activity</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Type</label><select value={actForm.type} onChange={e => setActForm({ ...actForm, type: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{['call', 'email', 'meeting', 'task', 'note'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}</select></div>
                <div><label className="text-xs font-medium text-gray-700">Related Lead</label><select value={actForm.leadId} onChange={e => setActForm({ ...actForm, leadId: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option value="">None</option>{leads.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
              </div>
              <div><label className="text-xs font-medium text-gray-700">Title *</label><input value={actForm.title} onChange={e => setActForm({ ...actForm, title: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-700">Description</label><textarea value={actForm.description} onChange={e => setActForm({ ...actForm, description: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowActivityDialog(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={saveActivity} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Log Activity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
