import { useState } from 'react'
import { useFetch, apiCall } from '@/hooks/useFetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Send, Search, FileText, Plus, Loader2, ExternalLink } from 'lucide-react'

// ─── Publishing Center ───
export function PublishingCenterPage() {
  const { data, loading, refetch } = useFetch<any>('/dashboard/stats')
  const jobs = (data?.recentJobs || []).filter((j: any) => j.type === 'publishing')
  const statusColor: Record<string, string> = { completed: 'bg-emerald-100 text-emerald-700', running: 'bg-blue-100 text-blue-700', queued: 'bg-amber-100 text-amber-700' }
  const platforms = ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'YouTube', 'WhatsApp']
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center"><Send className="w-5 h-5 text-teal-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">Publishing Center</h1><p className="text-sm text-gray-500">Multi-platform content publishing</p></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {platforms.map(p => (
          <Card key={p}><CardContent className="p-3 text-center hover:bg-gray-50 cursor-pointer transition-colors">
            <p className="text-xs font-medium">{p}</p>
            <Badge variant="outline" className="text-[10px] mt-1">Ready</Badge>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm">Recent Publish Jobs</CardTitle></CardHeader><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50"><th className="text-left px-4 py-3 font-medium text-gray-600">Type</th><th className="text-left px-4 py-3 font-medium text-gray-600">Status</th><th className="text-left px-4 py-3 font-medium text-gray-600">Created</th></tr></thead>
          <tbody>{jobs.map((j: any) => <tr key={j.id} className="border-b last:border-0"><td className="px-4 py-3">{j.type.replace(/_/g, ' ')}</td><td className="px-4 py-3"><Badge variant="secondary" className={statusColor[j.status] || ''}>{j.status}</Badge></td><td className="px-4 py-3 text-xs text-gray-500">{new Date(j.createdAt).toLocaleString()}</td></tr>)}
            {jobs.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No publish jobs yet</td></tr>}</tbody>
        </table>
      </CardContent></Card>
    </div>
  )
}

// ─── SEO Center ───
export function SEOCenterPage() {
  const [keywords] = useState([
    { keyword: 'textile manufacturer india', position: 12, volume: 2400, difficulty: 45 },
    { keyword: 'wholesale fabric supplier', position: 8, volume: 1800, difficulty: 52 },
    { keyword: 'bulk saree supplier', position: 23, volume: 3200, difficulty: 38 },
    { keyword: 'cotton fabric wholesale', position: 5, volume: 5600, difficulty: 61 },
  ])
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><Search className="w-5 h-5 text-green-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">SEO Center</h1><p className="text-sm text-gray-500">Search engine optimization</p></div>
      </div>
      <Card><CardHeader><CardTitle className="text-sm">Keyword Rankings</CardTitle></CardHeader><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Keyword</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Volume</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Difficulty</th>
          </tr></thead>
          <tbody>{keywords.map(k => <tr key={k.keyword} className="border-b last:border-0 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{k.keyword}</td>
            <td className="px-4 py-3"><Badge variant="secondary" className={k.position <= 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>#{k.position}</Badge></td>
            <td className="px-4 py-3 text-gray-500">{k.volume.toLocaleString()}</td>
            <td className="px-4 py-3"><div className="w-16 h-2 bg-gray-200 rounded-full"><div className={`h-2 rounded-full ${k.difficulty > 60 ? 'bg-red-400' : k.difficulty > 40 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${k.difficulty}%` }} /></div></td>
          </tr>)}</tbody>
        </table>
      </CardContent></Card>
    </div>
  )
}

// ─── Content Planner ───
export function ContentPlannerPage() {
  const { data, loading, refetch } = useFetch<any>('/dashboard/stats')
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('blog_post')
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!title) return
    setSaving(true)
    try {
      await apiCall('/contents', { method: 'POST', body: JSON.stringify({ title, type }) })
      setShowCreate(false); setTitle(''); refetch()
    } catch { }
    setSaving(false)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><FileText className="w-5 h-5 text-violet-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">Content Planner</h1><p className="text-sm text-gray-500">AI content planning & creation</p></div>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus className="w-4 h-4 mr-2" />New Content</Button>
      </div>
      <Card><CardContent className="p-4">
        <p className="text-sm text-gray-500">Content items will appear here once created. Use the "New Content" button to create your first piece.</p>
      </CardContent></Card>
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Content</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Title</label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Blog post title..." /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full text-sm border rounded-lg px-3 py-2">
                {['blog_post','social_media','email','product_description','landing_page'].map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <Button onClick={handleCreate} disabled={saving || !title} className="w-full">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
