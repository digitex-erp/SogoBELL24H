import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Image, Sparkles, FolderOpen, Palette, Layout, Clock, DollarSign, Settings2,
  Play, Save, Trash2, Plus, Search, Star, Copy, Download, Upload, X, Send,
  Loader2, CheckCircle, AlertTriangle, RotateCcw, Grid, List, Sliders,
  ChevronDown, ChevronRight, Eye, Edit3, Layers, RefreshCw, Filter, Tag,
  Hash, Zap, Activity, TrendingUp, BarChart3, Bookmark, Archive, Bell,
  Globe, Smartphone, Monitor, Mail, MessageSquare, Youtube, Image as ImageIcon,
  ArrowLeftRight, Maximize2, Minimize2, Crop, FlipHorizontal, FlipVertical,
  SunMedium, Contrast, Droplets, Focus, Type, Square, Circle, Undo, Redo,
  GitBranch, Shield, AlertCircle, Cpu, Clock3, Pause, PlayCircle, SkipForward,
  Trash, MoreVertical, ExternalLink, Copy as CopyIcon, Check
} from 'lucide-react'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || `Request failed (${res.status})`) }
  return res.json()
}

const PROVIDER_COLORS: Record<string, string> = {
  pollinations: '#10b981', openai: '#10a37f', flux: '#8b5cf6', ideogram: '#f59e0b', stability: '#06b6d4',
  recraft: '#ef4444', google: '#4285f4', blackforest: '#10b981',
}

const TABS = [
  { id: 'generate', label: 'Generate', icon: Sparkles },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'collections', label: 'Collections', icon: FolderOpen },
  { id: 'templates', label: 'Templates', icon: Layout },
  { id: 'brand-kit', label: 'Brand Kit', icon: Palette },
  { id: 'queue', label: 'Queue', icon: Clock },
  { id: 'costs', label: 'Costs', icon: DollarSign },
  { id: 'editor', label: 'Editor', icon: Edit3 },
]

type TabId = typeof TABS[number]['id']

export function ImageFactoryPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<TabId>('generate')
  const [providers, setProviders] = useState<any[]>([])
  const [aspectRatios, setAspectRatios] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [brandKits, setBrandKits] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [queueJobs, setQueueJobs] = useState<any[]>([])
  const [queueStats, setQueueStats] = useState<any[]>([])
  const [costs, setCosts] = useState<any>(null)
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [quality, setQuality] = useState('standard')
  const [steps, setSteps] = useState(30)
  const [cfg, setCfg] = useState(7)
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [numOutputs, setNumOutputs] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedBrandKit, setSelectedBrandKit] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')

  const [assetSearch, setAssetSearch] = useState('')
  const [assetSort, setAssetSort] = useState('createdAt')
  const [assetFilter, setAssetFilter] = useState('all')
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [templateCategory, setTemplateCategory] = useState('all')
  const [templatePlatform, setTemplatePlatform] = useState('all')

  const [newCollectionName, setNewCollectionName] = useState('')
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [editingAsset, setEditingAsset] = useState<any>(null)

  const [costPeriod, setCostPeriod] = useState('7d')
  const [queueStatus, setQueueStatus] = useState('')

  const loadData = useCallback(async () => {
    if (!token) return
    try {
      const [provRes, ratioRes, tempRes, collRes, bkRes, assetRes, queueRes, costRes, healthRes] = await Promise.all([
        api('/api/image-factory/providers', token),
        api('/api/image-factory/aspect-ratios', token),
        api('/api/image-factory/templates', token),
        api('/api/image-factory/collections', token),
        api('/api/image-factory/brand-kits', token),
        api('/api/image-factory/assets?limit=50', token),
        api('/api/image-factory/queue', token),
        api(`/api/image-factory/costs?period=${costPeriod}`, token),
        api('/api/image-factory/health', token),
      ])
      if (provRes.providers) setProviders(provRes.providers)
      if (ratioRes.ratios) setAspectRatios(ratioRes.ratios)
      if (tempRes.templates) setTemplates(tempRes.templates)
      if (collRes.collections) setCollections(collRes.collections)
      if (bkRes.brandKits) setBrandKits(bkRes.brandKits)
      if (assetRes.assets) setAssets(assetRes.assets)
      if (queueRes.jobs) { setQueueJobs(queueRes.jobs); setQueueStats(queueRes.stats || []) }
      if (costRes.summary) setCosts(costRes)
      if (healthRes.health) setHealth(healthRes)
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [token, costPeriod])

  useEffect(() => { loadData() }, [loadData])

  const generateImage = async () => {
    if (!prompt || !selectedProvider) { setError('Prompt and provider required'); return }
    setGenerating(true); setError(''); setGeneratedImage(null)
    try {
      const res = await api('/api/image-factory/generate', token, {
        method: 'POST', body: JSON.stringify({
          provider: selectedProvider, model: selectedModel, prompt, negativePrompt,
          aspectRatio, quality, steps, cfg, seed, numOutputs,
          brandKitId: selectedBrandKit || undefined, collectionId: selectedCollection || undefined,
        }),
      })
      setGeneratedImage(res.image)
      setSuccess('Image generated successfully!')
      loadData()
    } catch (e: any) { setError(e.message) }
    setGenerating(false)
  }

  const addToQueue = async () => {
    if (!prompt) { setError('Prompt required'); return }
    try {
      await api('/api/image-factory/queue', token, {
        method: 'POST', body: JSON.stringify({
          type: 'generate', prompt, negativePrompt, provider: selectedProvider,
          model: selectedModel, params: { aspectRatio, quality, steps, cfg, seed, numOutputs },
          priority: 2,
        }),
      })
      setSuccess('Added to queue!')
      loadData()
    } catch (e: any) { setError(e.message) }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const res = await api(`/api/image-factory/assets/${id}/favorite`, token, { method: 'POST' })
      setAssets(prev => prev.map(a => a.id === id ? { ...a, isFavorite: res.isFavorite } : a))
    } catch (e: any) { setError(e.message) }
  }

  const deleteAsset = async (id: string) => {
    try {
      await api(`/api/image-factory/assets/${id}`, token, { method: 'DELETE' })
      setAssets(prev => prev.filter(a => a.id !== id))
      if (selectedAsset?.id === id) setSelectedAsset(null)
      setSuccess('Asset deleted')
    } catch (e: any) { setError(e.message) }
  }

  const createCollection = async () => {
    if (!newCollectionName) return
    try {
      const res = await api('/api/image-factory/collections', token, {
        method: 'POST', body: JSON.stringify({ name: newCollectionName }),
      })
      setCollections(prev => [res.collection, ...prev])
      setNewCollectionName(''); setShowNewCollection(false)
      setSuccess('Collection created!')
    } catch (e: any) { setError(e.message) }
  }

  const processQueue = async () => {
    try {
      const res = await api('/api/image-factory/queue/process', token, { method: 'POST' })
      setSuccess(`Processed ${res.processed} jobs`)
      loadData()
    } catch (e: any) { setError(e.message) }
  }

  const filteredAssets = assets.filter(a => {
    if (assetSearch && !a.title?.toLowerCase().includes(assetSearch.toLowerCase()) && !a.prompt?.toLowerCase().includes(assetSearch.toLowerCase())) return false
    if (assetFilter === 'favorites' && !a.isFavorite) return false
    if (assetFilter === 'archived' && !a.isArchived) return false
    return true
  })

  const filteredTemplates = templates.filter(t => {
    if (templateCategory !== 'all' && t.category !== templateCategory) return false
    if (templatePlatform !== 'all' && t.platform !== templatePlatform) return false
    return true
  })

  const templateCategories = [...new Set(templates.map(t => t.category))]
  const templatePlatforms = [...new Set(templates.map(t => t.platform))]

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-7 h-7 text-purple-500" /> Enterprise Image Factory
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered production asset generation pipeline for VyaparSethu</p>
        </div>
        <div className="flex items-center gap-2">
          {health && (
            <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> {health.assets} assets</span>
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {health.memory}MB</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${health.totalCost?.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as TabId)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Prompt</h3>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate... e.g., 'A professional product photo of handcrafted Indian textile on white background, studio lighting, high resolution'"
                className="w-full h-32 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />

              <div>
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Advanced Parameters
                </button>
                {showAdvanced && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Negative Prompt</label>
                      <input value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)}
                        placeholder="What to avoid..."
                        className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Seed</label>
                      <input type="number" value={seed || ''} onChange={e => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Random" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Steps: {steps}</label>
                      <input type="range" min="10" max="100" value={steps} onChange={e => setSteps(Number(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">CFG Scale: {cfg}</label>
                      <input type="range" min="1" max="20" value={cfg} onChange={e => setCfg(Number(e.target.value))} className="w-full" />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Provider</label>
                  <select value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); setSelectedModel('') }}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">Select provider...</option>
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>{p.name} {p.free ? '✅ FREE' : !p.configured ? '(no API key)' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Model</label>
                  <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">Default model</option>
                    {providers.find(p => p.id === selectedProvider)?.models?.map((m: string) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Aspect Ratio</label>
                  <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {aspectRatios.map(r => (
                      <option key={r.id} value={r.id}>{r.label} ({r.id}) — {r.w}×{r.h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quality</label>
                  <select value={quality} onChange={e => setQuality(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="standard">Standard</option>
                    <option value="hd">HD</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Outputs</label>
                  <select value={numOutputs} onChange={e => setNumOutputs(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Brand Kit</label>
                  <select value={selectedBrandKit} onChange={e => setSelectedBrandKit(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">None</option>
                    {brandKits.map(bk => <option key={bk.id} value={bk.id}>{bk.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Collection</label>
                  <select value={selectedCollection} onChange={e => setSelectedCollection(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">None</option>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={generateImage} disabled={generating || !prompt || !selectedProvider}
                  className="flex-1 bg-purple-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {generating ? 'Generating...' : 'Generate Image'}
                </button>
                <button onClick={addToQueue} disabled={!prompt}
                  className="bg-gray-100 text-gray-700 rounded-lg px-4 py-3 font-medium hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Queue
                </button>
              </div>
            </div>

            {generatedImage && (
              <div className="bg-white rounded-xl border p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Generated Image</h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img src={generatedImage.url} alt={generatedImage.title} className="w-full object-contain max-h-[500px]" />
                  {generatedImage.status === 'error' && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">{generatedImage.errorMsg}</div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{generatedImage.width}×{generatedImage.height}</span>
                  <span>{generatedImage.provider}/{generatedImage.model}</span>
                  <span>${generatedImage.costUsd?.toFixed(4)}</span>
                  <span>{generatedImage.latencyMs}ms</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Active Providers</h4>
              <div className="space-y-2">
                <div key="pollinations" className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                  <span>Pollinations.ai</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600 ml-auto">FREE</span>
                </div>
                {providers.filter(p => p.configured && !p.free).length === 0 ? (
                  <p className="text-xs text-gray-400">Add API keys in Provider Manager for more providers.</p>
                ) : (
                  providers.filter(p => p.configured && !p.free).map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[p.id] || '#9ca3af' }} />
                      {p.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Quick Templates</h4>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {templates.slice(0, 10).map(t => (
                  <button key={t.id} onClick={() => { setPrompt(t.prompt || t.description || t.name); setTab('generate') }}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Layout className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    <span className="truncate">{t.name}</span>
                    <span className="text-gray-400 ml-auto flex-shrink-0">{t.width}×{t.height}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Recent Assets</h4>
              <div className="grid grid-cols-2 gap-2">
                {assets.slice(0, 6).map(a => (
                  <div key={a.id} onClick={() => { setSelectedAsset(a); setTab('gallery') }}
                    className="aspect-square rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500">
                    <img src={a.url} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={assetSearch} onChange={e => setAssetSearch(e.target.value)}
                placeholder="Search assets by title, prompt, or tags..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" />
            </div>
            <select value={assetFilter} onChange={e => setAssetFilter(e.target.value)}
              className="border rounded-lg px-3 py-2.5 text-sm">
              <option value="all">All Assets</option>
              <option value="favorites">Favorites</option>
              <option value="archived">Archived</option>
            </select>
            <select value={assetSort} onChange={e => setAssetSort(e.target.value)}
              className="border rounded-lg px-3 py-2.5 text-sm">
              <option value="createdAt">Newest</option>
              <option value="cost">Most Expensive</option>
              <option value="title">Name</option>
            </select>
            <div className="flex border rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No assets yet</p>
              <p className="text-sm mt-1">Generate your first image to start building your asset library</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAssets.map(a => (
                <div key={a.id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedAsset(a)}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img src={a.url} alt={a.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button onClick={e => { e.stopPropagation(); toggleFavorite(a.id) }}
                          className={`p-2 rounded-full ${a.isFavorite ? 'bg-yellow-400 text-white' : 'bg-white/90 text-gray-600 hover:text-yellow-500'}`}>
                          <Star className="w-4 h-4" fill={a.isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); setSelectedAsset(a) }}
                          className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-purple-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); deleteAsset(a.id) }}
                          className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {a.isFavorite && <Star className="absolute top-2 right-2 w-4 h-4 text-yellow-400" fill="currentColor" />}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 truncate">{a.title || 'Untitled'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{a.provider}</span>
                      <span className="text-[10px] text-gray-400">{a.width}×{a.height}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border divide-y">
              {filteredAssets.map(a => (
                <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedAsset(a)}>
                  <img src={a.url} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{a.prompt}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{a.width}×{a.height}</p>
                    <p className="text-xs text-gray-400">${a.costUsd?.toFixed(4)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); toggleFavorite(a.id) }}
                      className={`p-1.5 rounded ${a.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}>
                      <Star className="w-4 h-4" fill={a.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteAsset(a.id) }}
                      className="p-1.5 rounded text-gray-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'collections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Collections</h3>
            <button onClick={() => setShowNewCollection(true)}
              className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Collection
            </button>
          </div>
          {showNewCollection && (
            <div className="bg-white rounded-xl border p-4 flex gap-3">
              <input value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)}
                placeholder="Collection name..." className="flex-1 border rounded-lg px-3 py-2 text-sm"
                onKeyDown={e => e.key === 'Enter' && createCollection()} />
              <button onClick={createCollection} className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm">Create</button>
              <button onClick={() => setShowNewCollection(false)} className="text-gray-400 hover:text-gray-600 px-2"><X className="w-5 h-5" /></button>
            </div>
          )}
          {collections.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No collections yet</p>
              <p className="text-sm mt-1">Create collections to organize your images</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map(col => (
                <div key={col.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: (col.color || '#6366f1') + '20' }}>
                      <FolderOpen className="w-5 h-5" style={{ color: col.color || '#6366f1' }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{col.name}</h4>
                      <p className="text-xs text-gray-400">{col.imageCount || 0} images</p>
                    </div>
                  </div>
                  {col.description && <p className="text-sm text-gray-500 line-clamp-2">{col.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <select value={templateCategory} onChange={e => setTemplateCategory(e.target.value)}
              className="border rounded-lg px-3 py-2.5 text-sm">
              <option value="all">All Categories</option>
              {templateCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={templatePlatform} onChange={e => setTemplatePlatform(e.target.value)}
              className="border rounded-lg px-3 py-2.5 text-sm">
              <option value="all">All Platforms</option>
              {templatePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <span className="text-sm text-gray-400">{filteredTemplates.length} templates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map(t => (
              <div key={t.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all group">
                <div className="aspect-[16/10] bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center relative">
                  <div className="text-center">
                    <Layout className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">{t.width}×{t.height}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setPrompt(t.prompt || t.description || t.name); setAspectRatio('1:1'); setTab('generate') }}
                      className="bg-purple-600 text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-purple-700 flex items-center gap-1">
                      <Play className="w-3 h-3" /> Use
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 text-sm">{t.name}</h4>
                  {t.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{t.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{t.platform}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'brand-kit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Brand Kits</h3>
            <button className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Brand Kit
            </button>
          </div>
          {brandKits.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Palette className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No brand kits yet</p>
              <p className="text-sm mt-1">Create a brand kit to ensure consistent visual identity across all generated images</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandKits.map(bk => {
                const colors = (() => { try { return JSON.parse(bk.colors || '[]') } catch { return [] } })()
                return (
                  <div key={bk.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {bk.name[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{bk.name}</h4>
                        {bk.isDefault && <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-full">Default</span>}
                      </div>
                    </div>
                    {colors.length > 0 && (
                      <div className="flex gap-1 mb-3">
                        {colors.slice(0, 8).map((c: string, i: number) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    )}
                    {bk.brandVoice && <p className="text-xs text-gray-500 line-clamp-2">{bk.brandVoice}</p>}
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <span>{bk.imageCount || 0} images</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Generation Queue</h3>
            <div className="flex gap-2">
              <select value={queueStatus} onChange={e => setQueueStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                <option value="">All Status</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <button onClick={processQueue}
                className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                <Play className="w-4 h-4" /> Process Queue
              </button>
            </div>
          </div>

          {queueStats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {queueStats.map(s => (
                <div key={s.status} className="bg-white rounded-xl border p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{s.count}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{s.status}</p>
                </div>
              ))}
            </div>
          )}

          {queueJobs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Queue is empty</p>
              <p className="text-sm mt-1">Add images to the queue from the Generate tab</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border divide-y">
              {queueJobs.filter(j => !queueStatus || j.status === queueStatus).map(job => (
                <div key={job.id} className="flex items-center gap-4 p-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    job.status === 'completed' ? 'bg-green-50 text-green-500' :
                    job.status === 'running' ? 'bg-blue-50 text-blue-500' :
                    job.status === 'failed' ? 'bg-red-50 text-red-500' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {job.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                     job.status === 'running' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                     job.status === 'failed' ? <AlertTriangle className="w-5 h-5" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{job.prompt}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{job.provider}</span>
                      <span className="text-xs text-gray-400">P{job.priority}</span>
                      {job.error && <span className="text-xs text-red-500 truncate">{job.error}</span>}
                    </div>
                  </div>
                  {job.status === 'running' && (
                    <div className="w-24">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${job.progress || 0}%` }} />
                      </div>
                    </div>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    job.status === 'completed' ? 'bg-green-50 text-green-600' :
                    job.status === 'running' ? 'bg-blue-50 text-blue-600' :
                    job.status === 'failed' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>{job.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'costs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">Cost Intelligence</h3>
            <select value={costPeriod} onChange={e => setCostPeriod(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {costs && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">${costs.summary?.totalCost?.toFixed(4) || '0.00'}</p>
                </div>
                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">Total Generations</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{costs.summary?.totalGenerations || 0}</p>
                </div>
                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">Avg Cost/Generation</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">${costs.summary?.avgCostPerGeneration?.toFixed(4) || '0.00'}</p>
                </div>
              </div>

              {costs.byProvider?.length > 0 && (
                <div className="bg-white rounded-xl border p-5">
                  <h4 className="font-medium text-gray-900 mb-3">Cost by Provider</h4>
                  <div className="space-y-2">
                    {costs.byProvider.map((p: any) => (
                      <div key={p.provider} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[p.provider] || '#9ca3af' }} />
                        <span className="text-sm flex-1">{p.provider}</span>
                        <span className="text-sm font-medium">${p.cost?.toFixed(4)}</span>
                        <span className="text-xs text-gray-400">{p.count} gen</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {costs.recent?.length > 0 && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="px-5 py-3 border-b">
                    <h4 className="font-medium text-gray-900">Recent Generations</h4>
                  </div>
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {costs.recent.map((r: any) => (
                      <div key={r.id} className="px-5 py-3 flex items-center gap-3 text-sm">
                        <span className="text-xs text-gray-400 w-20 flex-shrink-0">{new Date(r.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{r.provider}</span>
                        <span className="text-gray-500 flex-1 truncate">{r.model}</span>
                        <span className="font-medium">${r.costUsd?.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'editor' && (
        <div className="space-y-4">
          {!editingAsset ? (
            <>
              <h3 className="font-semibold text-gray-900">Image Editor — Select an image to edit</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {assets.slice(0, 12).map(a => (
                  <div key={a.id} onClick={() => setEditingAsset(a)}
                    className="aspect-square rounded-xl bg-gray-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all group relative">
                    <img src={a.url} alt={a.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg font-medium">Edit</span>
                    </div>
                  </div>
                ))}
              </div>
              {assets.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <Edit3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No images to edit</p>
                  <p className="text-sm mt-1">Generate some images first, then come back to edit them</p>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 bg-white rounded-xl border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 truncate">Editing: {editingAsset.title || 'Untitled'}</h3>
                  <button onClick={() => setEditingAsset(null)} className="text-gray-400 hover:text-gray-600 text-sm">← Back to selection</button>
                </div>
                <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                  <img src={editingAsset.url} alt={editingAsset.title} className="max-w-full max-h-[500px] object-contain" />
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>{editingAsset.width}×{editingAsset.height}</span>
                  <span>{editingAsset.provider}/{editingAsset.model}</span>
                  <span>{editingAsset.generationType}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-xl border p-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-3">Transform</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Crop', icon: Crop, op: 'crop' },
                      { label: 'Resize', icon: Maximize2, op: 'resize' },
                      { label: 'Rotate', icon: RotateCcw, op: 'rotate' },
                      { label: 'Flip', icon: FlipHorizontal, op: 'flip' },
                    ].map(op => (
                      <button key={op.op} onClick={async () => {
                        try {
                          const params = op.op === 'rotate' ? { degrees: 90 } : op.op === 'flip' ? { axis: 'horizontal' } : op.op === 'resize' ? { width: editingAsset.width, height: editingAsset.height } : { x: 0, y: 0, width: editingAsset.width, height: editingAsset.height }
                          await api(`/api/image-factory/edit/${editingAsset.id}/${op.op}`, token, { method: 'POST', body: JSON.stringify(params) })
                          setSuccess(`${op.label} applied`)
                        } catch (e: any) { setError(e.message) }
                      }} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                        <op.icon className="w-4 h-4" /> {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border p-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-3">Adjustments</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Blur', icon: Droplets, op: 'blur', params: { radius: 5 } },
                      { label: 'Sharpen', icon: Focus, op: 'sharpen', params: { amount: 1.5 } },
                      { label: 'Text Overlay', icon: Type, op: 'text', params: { text: 'Your Text', x: 50, y: 50, fontSize: 24, color: '#ffffff' } },
                      { label: 'Shape', icon: Square, op: 'shape', params: { shapeType: 'rectangle', x: 10, y: 10, width: 100, height: 100, fill: '#3b82f6' } },
                      { label: 'Frame', icon: Circle, op: 'frame', params: { frameType: 'solid', borderWidth: 4, borderColor: '#000000' } },
                      { label: 'Watermark', icon: Droplets, op: 'watermark', params: { text: '© Bell24h', position: 'bottom-right', opacity: 0.5 } },
                    ].map(adj => (
                      <button key={adj.op} onClick={async () => {
                        try {
                          await api(`/api/image-factory/edit/${editingAsset.id}/${adj.op}`, token, { method: 'POST', body: JSON.stringify(adj.params) })
                          setSuccess(`${adj.label} applied`)
                        } catch (e: any) { setError(e.message) }
                      }} className="w-full flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-left">
                        <adj.icon className="w-4 h-4 flex-shrink-0" /> {adj.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border p-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-3">Actions</h4>
                  <div className="space-y-2">
                    <button onClick={async () => {
                      try { await api(`/api/image-factory/edit/${editingAsset.id}/undo`, token, { method: 'POST' }); setSuccess('Undone last edit') } catch (e: any) { setError(e.message) }
                    }} className="w-full flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left">
                      <Undo className="w-4 h-4" /> Undo
                    </button>
                    <button onClick={async () => {
                      try { await api(`/api/image-factory/assets/${editingAsset.id}/version`, token, { method: 'POST' }); setSuccess('Version saved') } catch (e: any) { setError(e.message) }
                    }} className="w-full flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left">
                      <GitBranch className="w-4 h-4" /> Save Version
                    </button>
                    <a href={editingAsset.url} download className="w-full flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors text-left">
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-xl border p-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-3">Version History</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded text-xs">
                      <span className="text-purple-600 font-medium">v{editingAsset.version || 1}</span>
                      <span className="text-gray-500">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedAsset && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAsset(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-900 truncate">{selectedAsset.title || 'Asset Details'}</h3>
              <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-xl overflow-hidden">
                  <img src={selectedAsset.url} alt={selectedAsset.title} className="w-full object-contain" />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500">Prompt</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAsset.prompt}</p>
                  </div>
                  {selectedAsset.negativePrompt && (
                    <div>
                      <label className="text-xs text-gray-500">Negative Prompt</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedAsset.negativePrompt}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-gray-500">Provider</label><p className="text-sm">{selectedAsset.provider}</p></div>
                    <div><label className="text-xs text-gray-500">Model</label><p className="text-sm">{selectedAsset.model}</p></div>
                    <div><label className="text-xs text-gray-500">Size</label><p className="text-sm">{selectedAsset.width}×{selectedAsset.height}</p></div>
                    <div><label className="text-xs text-gray-500">Cost</label><p className="text-sm">${selectedAsset.costUsd?.toFixed(4)}</p></div>
                    <div><label className="text-xs text-gray-500">Latency</label><p className="text-sm">{selectedAsset.latencyMs}ms</p></div>
                    <div><label className="text-xs text-gray-500">Status</label><p className="text-sm">{selectedAsset.status}</p></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => toggleFavorite(selectedAsset.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${selectedAsset.isFavorite ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      <Star className="w-4 h-4" fill={selectedAsset.isFavorite ? 'currentColor' : 'none'} />
                      {selectedAsset.isFavorite ? 'Favorited' : 'Favorite'}
                    </button>
                    <a href={selectedAsset.url} download className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <Download className="w-4 h-4" /> Download
                    </a>
                    <button onClick={() => { deleteAsset(selectedAsset.id); setSelectedAsset(null) }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
