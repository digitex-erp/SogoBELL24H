import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ShoppingCart, Truck, Package, FileSearch, Plus, MapPin, Star, Search, X, Loader2, AlertCircle, CheckCircle, Globe, Phone, Mail, Edit, Trash2, ArrowLeft, Filter } from 'lucide-react'
import { cn } from '@/lib/cn'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

// ─── Marketplace ───
export function MarketplacePage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<'browse' | 'suppliers' | 'buyers' | 'rfqs'>('browse')
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-rose-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Marketplace</h1><p className="text-sm text-gray-500">B2B marketplace for textiles & manufacturing</p></div>
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[['browse', 'Browse', ShoppingCart], ['suppliers', 'Suppliers', Truck], ['buyers', 'Buyers', Package], ['rfqs', 'RFQs', FileSearch]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id as any)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors", tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}><Icon className="w-3.5 h-3.5" /> {label}</button>
        ))}
      </div>
      {tab === 'browse' && <BrowseView />}
      {tab === 'suppliers' && <SuppliersPage />}
      {tab === 'buyers' && <BuyersPage />}
      {tab === 'rfqs' && <RFQsPage />}
    </div>
  )
}

function BrowseView() {
  const [categories] = useState([
    { name: 'Textiles & Fabrics', count: 1240, icon: '🧵' },
    { name: 'Garments & Apparel', count: 890, icon: '👔' },
    { name: 'Raw Materials', count: 567, icon: '🏭' },
    { name: 'Machinery & Tools', count: 324, icon: '⚙️' },
    { name: 'Packaging', count: 213, icon: '📦' },
    { name: 'Dyes & Chemicals', count: 189, icon: '🎨' },
    { name: 'Accessories', count: 456, icon: '💎' },
  ])
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(c => (
          <div key={c.name} className="bg-white border rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <span className="text-3xl">{c.icon}</span>
            <h3 className="font-semibold text-sm mt-2">{c.name}</h3>
            <p className="text-xs text-gray-400">{c.count.toLocaleString()} listings</p>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-xl p-6 text-center"><p className="text-sm text-gray-500">Browse categories above to discover suppliers, buyers, and RFQs. All data is managed in real-time.</p></div>
    </>
  )
}

// ─── Suppliers ───
function SuppliersPage() {
  const { token } = useAuth()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', location: '', city: '', phone: '', email: '', website: '', categories: '', tags: '', minOrder: '', responseTime: '' })

  const load = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/suppliers', token); setSuppliers(r.items || r.suppliers || []) } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!form.name) { setError('Name required'); return }
    try { await api('/api/suppliers', token, { method: 'POST', body: JSON.stringify({ ...form, categories: form.categories ? `[${form.categories.split(',').map(c => `"${c.trim()}"`).join(',')}]` : null }) }); setShowAdd(false); setForm({ name: '', location: '', city: '', phone: '', email: '', website: '', categories: '', tags: '', minOrder: '', responseTime: '' }); load() } catch (e: any) { setError(e.message) }
  }

  const del = async (id: string) => { if (!confirm('Delete?')) return; try { await api(`/api/suppliers/${id}`, token, { method: 'DELETE' }); load() } catch (e: any) { setError(e.message) } }

  const filtered = suppliers.filter((s: any) => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.location?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center"><Truck className="w-5 h-5 text-teal-600" /></div>
        <div className="flex-1"><h1 className="text-xl font-bold text-gray-900">Suppliers</h1><p className="text-sm text-gray-500">{suppliers.length} suppliers</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> Add Supplier</button>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      <div className="relative max-w-sm"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:border-emerald-500 focus:outline-none" /></div>
      {loading ? <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s: any) => (
            <div key={s.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{s.name}</h3>
                <div className="flex items-center gap-1">
                  {s.verified && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">✓ Verified</span>}
                  <button onClick={() => del(s.id)} className="p-1 rounded hover:bg-gray-100"><Trash2 className="w-3 h-3 text-gray-400" /></button>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><MapPin className="w-3 h-3" />{s.location || s.city || '—'}</div>
              {s.phone && <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Phone className="w-3 h-3" />{s.phone}</div>}
              {s.email && <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Mail className="w-3 h-3" />{s.email}</div>}
              <div className="flex items-center gap-2 text-xs mt-2">
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{s.rating || 0}</span>
                <span className="text-gray-400">·</span>
                <span>{s.productCount || 0} products</span>
                {s.responseTime && <><span className="text-gray-400">·</span><span className="text-emerald-600">{s.responseTime}</span></>}
              </div>
              {s.categories && <div className="flex flex-wrap gap-1 mt-2">{(typeof s.categories === 'string' ? JSON.parse(s.categories || '[]') : s.categories || []).map((c: string) => <span key={c} className="text-[9px] px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded-full">{c}</span>)}</div>}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Supplier</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-gray-700">Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Mumbai, Maharashtra" /></div>
                <div><label className="text-xs font-medium text-gray-700">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Website</label><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="text-xs font-medium text-gray-700">Categories (comma-separated)</label><input value={form.categories} onChange={e => setForm({ ...form, categories: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="cotton, silk, polyester" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Min Order</label><input value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="500 pieces" /></div>
                <div><label className="text-xs font-medium text-gray-700">Response Time</label><input value={form.responseTime} onChange={e => setForm({ ...form, responseTime: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="< 1 hour" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={save} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Add Supplier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Buyers ───
function BuyersPage() {
  const { token } = useAuth()
  const [buyers, setBuyers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', location: '', city: '', industry: '', email: '', phone: '' })

  const load = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/buyers', token); setBuyers(r.items || r.buyers || []) } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!form.name) { setError('Name required'); return }
    try { await api('/api/buyers', token, { method: 'POST', body: JSON.stringify(form) }); setShowAdd(false); setForm({ name: '', location: '', city: '', industry: '', email: '', phone: '' }); load() } catch (e: any) { setError(e.message) }
  }

  const del = async (id: string) => { if (!confirm('Delete?')) return; try { await api(`/api/buyers/${id}`, token, { method: 'DELETE' }); load() } catch (e: any) { setError(e.message) } }

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><Package className="w-5 h-5 text-indigo-600" /></div>
        <div className="flex-1"><h1 className="text-xl font-bold text-gray-900">Buyers</h1><p className="text-sm text-gray-500">{buyers.length} active buyers</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> Add Buyer</button>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      {loading ? <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" /></div> : (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Buyer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Industry</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Orders</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Total Spent</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr></thead>
            <tbody>{buyers.map((b: any) => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.name}{b.email && <span className="text-xs text-gray-400 block">{b.email}</span>}</td>
                <td className="px-4 py-3 text-gray-500">{b.location || b.city || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{b.industry || '—'}</td>
                <td className="px-4 py-3">{b.totalOrders || 0}</td>
                <td className="px-4 py-3 font-medium">{fmt(b.totalSpent || 0)}</td>
                <td className="px-4 py-3">{b.verified ? <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Verified</span> : <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">Unverified</span>}</td>
                <td className="px-4 py-3"><button onClick={() => del(b.id)} className="p-1 rounded hover:bg-gray-100"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button></td>
              </tr>
            ))}{buyers.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No buyers yet</td></tr>}</tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Buyer</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-gray-700">Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Industry</label><input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={save} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Add Buyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── RFQs ───
function RFQsPage() {
  const { token } = useAuth()
  const [rfqs, setRfqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: '', quantity: '', unit: 'pieces', budget: '', deadline: '', priority: '2', buyerName: '', tags: '' })

  const load = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/rfqs', token); setRfqs(r.items || r.rfqs || []) } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!form.title || !form.quantity) { setError('Title and quantity required'); return }
    try { await api('/api/rfqs', token, { method: 'POST', body: JSON.stringify({ ...form, budget: parseFloat(form.budget) || null, priority: parseInt(form.priority), deadline: form.deadline || null }) }); setShowAdd(false); setForm({ title: '', description: '', category: '', quantity: '', unit: 'pieces', budget: '', deadline: '', priority: '2', buyerName: '', tags: '' }); load() } catch (e: any) { setError(e.message) }
  }

  const del = async (id: string) => { if (!confirm('Delete?')) return; try { await api(`/api/rfqs/${id}`, token, { method: 'DELETE' }); load() } catch (e: any) { setError(e.message) } }

  const statusColor: Record<string, string> = { open: 'bg-emerald-100 text-emerald-700', quoted: 'bg-blue-100 text-blue-700', awarded: 'bg-purple-100 text-purple-700', closed: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700' }
  const prioColor: Record<number, string> = { 1: 'text-red-600', 2: 'text-orange-600', 3: 'text-yellow-600', 4: 'text-gray-600' }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><FileSearch className="w-5 h-5 text-amber-600" /></div>
        <div className="flex-1"><h1 className="text-xl font-bold text-gray-900">RFQs</h1><p className="text-sm text-gray-500">{rfqs.length} request for quotations</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> New RFQ</button>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      {loading ? <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" /></div> : (
        <div className="space-y-2">
          {rfqs.map((r: any) => (
            <div key={r.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{r.title}</h3>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", statusColor[r.status] || statusColor.open)}>{r.status}</span>
                    <span className={cn("text-[10px] font-bold", prioColor[r.priority] || prioColor[2])}>P{r.priority}</span>
                  </div>
                  {r.description && <p className="text-xs text-gray-500 mb-2">{r.description}</p>}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>📦 {r.quantity} {r.unit}</span>
                    {r.budget && <span>💰 ₹{(r.budget / 1000).toFixed(0)}K</span>}
                    {r.deadline && <span>📅 {new Date(r.deadline).toLocaleDateString()}</span>}
                    {r.buyerName && <span>🏢 {r.buyerName}</span>}
                    {r.quotesCount > 0 && <span>📋 {r.quotesCount} quotes</span>}
                  </div>
                  {r.tags && <div className="flex flex-wrap gap-1 mt-2">{r.tags.split(',').filter(Boolean).map((t: string) => <span key={t} className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full">{t.trim()}</span>)}</div>}
                </div>
                <button onClick={() => del(r.id)} className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
              </div>
            </div>
          ))}
          {rfqs.length === 0 && <div className="text-center py-12 text-gray-400"><FileSearch className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No RFQs yet</p></div>}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">New RFQ</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-gray-700">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-700">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Quantity *</label><input value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="10,000" /></div>
                <div><label className="text-xs font-medium text-gray-700">Unit</label><select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{['pieces', 'meters', 'units', 'kg', 'tons'].map(u => <option key={u}>{u}</option>)}</select></div>
                <div><label className="text-xs font-medium text-gray-700">Budget (₹)</label><input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-medium text-gray-700">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Textiles" /></div>
                <div><label className="text-xs font-medium text-gray-700">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-medium text-gray-700">Priority</label><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option value="1">Urgent</option><option value="2">High</option><option value="3">Medium</option><option value="4">Low</option></select></div>
              </div>
              <div><label className="text-xs font-medium text-gray-700">Buyer Name</label><input value={form.buyerName} onChange={e => setForm({ ...form, buyerName: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={save} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Create RFQ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Re-export for App.tsx
// Automation placeholder
export function AutomationPage() {
  const { token } = useAuth()
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/p1/automation-rules/list', token); setRules(r.items || []) } catch {}
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  const toggle = async (id: string, enabled: boolean) => {
    try { await api(`/api/p1/automation-rules/update/${id}`, token, { method: 'PATCH', body: JSON.stringify({ enabled: !enabled }) }); load() } catch {}
  }

  const del = async (id: string) => {
    if (!confirm('Delete this rule?')) return
    try { await api(`/api/p1/automation-rules/delete/${id}`, token, { method: 'DELETE' }); load() } catch {}
  }

  const triggerIcons: Record<string, string> = { lead_created: '👤', page_visit: '📄', budget_threshold: '💰', cron_schedule: '⏰', rfq_created: '📋', status_change: '🔄', cart_abandoned: '🛒' }
  const actionIcons: Record<string, string> = { send_email: '📧', update_score: '⬆️', send_notification: '🔔', run_seo_audit: '🔍', create_deal: '💼', match_suppliers: '🔗' }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><span className="text-xl">⚡</span></div>
        <div className="flex-1"><h1 className="text-xl font-bold text-gray-900">Automation</h1><p className="text-sm text-gray-500">{rules.length} rules · {rules.filter(r => r.enabled).length} active</p></div>
      </div>

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="space-y-2">
          {rules.map(r => (
            <div key={r.id} className="bg-white border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <span className="text-2xl">{triggerIcons[r.triggerType] || '⚡'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{r.name}</h3>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", r.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')}>{r.enabled ? 'Active' : 'Disabled'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{r.description}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>Trigger: <span className="text-gray-600">{r.triggerType?.replace(/_/g, ' ')}</span></span>
                  <span>→</span>
                  <span>Action: <span className="text-gray-600">{actionIcons[r.actionType] || ''} {r.actionType?.replace(/_/g, ' ')}</span></span>
                  {r.runCount > 0 && <span>Run {r.runCount}×</span>}
                </div>
              </div>
              <button onClick={() => toggle(r.id, r.enabled)} className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0", r.enabled ? 'bg-emerald-500' : 'bg-gray-300')}>
                <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform", r.enabled ? 'translate-x-4 ml-1' : 'translate-x-0.5')} />
              </button>
              <button onClick={() => del(r.id)} className="p-1.5 rounded hover:bg-gray-100 flex-shrink-0"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
            </div>
          ))}
          {rules.length === 0 && <div className="bg-white border rounded-xl p-8 text-center text-gray-400">No automation rules yet</div>}
        </div>
      )}
    </div>
  )
}

// Workflows placeholder
export function WorkflowsPage() {
  const { token } = useAuth()
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/p1/workflows/list', token); setWorkflows(r.items || []) } catch {}
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  const del = async (id: string) => {
    if (!confirm('Delete this workflow?')) return
    try { await api(`/api/p1/workflows/delete/${id}`, token, { method: 'DELETE' }); load() } catch {}
  }

  const statusColor: Record<string, string> = { active: 'bg-emerald-100 text-emerald-700', draft: 'bg-gray-100 text-gray-600', paused: 'bg-amber-100 text-amber-700', archived: 'bg-red-100 text-red-700' }
  const nodeIcons: Record<string, string> = { trigger: '⚡', condition: '❓', action: '▶️' }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><span className="text-xl">🔄</span></div>
        <div className="flex-1"><h1 className="text-xl font-bold text-gray-900">Workflows</h1><p className="text-sm text-gray-500">{workflows.length} workflows · {workflows.filter(w => w.status === 'active').length} active</p></div>
      </div>

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map(w => {
            let nodes: any[] = []
            try { nodes = JSON.parse(w.nodes || '[]') } catch {}
            return (
              <div key={w.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{w.name}</h3>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", statusColor[w.status] || statusColor.draft)}>{w.status}</span>
                  </div>
                  <button onClick={() => del(w.id)} className="p-1 rounded hover:bg-gray-100"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                </div>
                {w.description && <p className="text-xs text-gray-500 mb-3">{w.description}</p>}

                <div className="flex items-center gap-1 flex-wrap">
                  {nodes.map((n: any, i: number) => (
                    <span key={n.id} className="flex items-center gap-1">
                      {i > 0 && <span className="text-gray-300">→</span>}
                      <span className={cn("text-[10px] px-2 py-1 rounded-md border", n.type === 'trigger' ? 'bg-purple-50 border-purple-200 text-purple-700' : n.type === 'condition' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-blue-50 border-blue-200 text-blue-700')}>
                        {nodeIcons[n.type] || ''} {n.label}
                      </span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  {w.runCount > 0 && <span>Run {w.runCount}×</span>}
                  {w.lastRun && <span>Last: {new Date(w.lastRun).toLocaleDateString()}</span>}
                </div>
              </div>
            )
          })}
          {workflows.length === 0 && <div className="col-span-2 bg-white border rounded-xl p-8 text-center text-gray-400">No workflows yet</div>}
        </div>
      )}
    </div>
  )
}

export { SuppliersPage, BuyersPage, RFQsPage }
