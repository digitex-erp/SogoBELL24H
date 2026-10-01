import { useState, useEffect, useCallback } from 'react'
import {
  Brain, Plus, Key, CheckCircle, XCircle, Loader2, Trash2, Edit,
  RefreshCw, Zap, Clock, DollarSign, Activity, AlertTriangle, Eye, EyeOff,
  ArrowUpDown, Settings, Globe
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const PROVIDER_INFO: Record<string, { name: string; icon: string; models: string[]; color: string; bgColor: string }> = {
  openai: { name: 'OpenAI', icon: '🤖', models: ['gpt-4o', 'gpt-4o-mini', 'dall-e-3', 'tts-1'], color: 'text-gray-800', bgColor: 'bg-gray-50' },
  anthropic: { name: 'Anthropic', icon: '🧠', models: ['claude-3.5-sonnet', 'claude-3-haiku', 'claude-3-opus'], color: 'text-amber-700', bgColor: 'bg-amber-50' },
  google: { name: 'Google Gemini', icon: '💎', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'], color: 'text-blue-600', bgColor: 'bg-blue-50' },
  xai: { name: 'xAI (Grok)', icon: '⚡', models: ['grok-2', 'grok-2-mini'], color: 'text-red-600', bgColor: 'bg-red-50' },
  openrouter: { name: 'OpenRouter', icon: '🔀', models: ['multi-model'], color: 'text-purple-600', bgColor: 'bg-purple-50' },
  deepseek: { name: 'DeepSeek', icon: '🔍', models: ['deepseek-v3', 'deepseek-coder'], color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  mistral: { name: 'Mistral', icon: '🌬️', models: ['mistral-large', 'mistral-medium', 'mistral-small'], color: 'text-orange-600', bgColor: 'bg-orange-50' },
  minimax: { name: 'MiniMax', icon: '🔮', models: ['abab-6.5', 'abab-5.5'], color: 'text-pink-600', bgColor: 'bg-pink-50' },
}

interface ProviderKey {
  id: string
  provider: string
  apiKeyEncrypted: string
  model: string | null
  isEnabled: boolean
  priority: number
  rateLimit: number | null
  createdAt: string
}

interface ProviderUsageStat {
  provider: string
  model: string
  _sum: { inputTokens: number; outputTokens: number; costUsd: number }
  _count: { id: number }
  _avg: { latencyMs: number | null }
}

export function ProviderManagerPage() {
  const [providers, setProviders] = useState<ProviderKey[]>([])
  const [usage, setUsage] = useState<ProviderUsageStat[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; latency: number }>>({})
  const [activeTab, setActiveTab] = useState('providers')

  // Add form
  const [addProvider, setAddProvider] = useState('')
  const [addApiKey, setAddApiKey] = useState('')
  const [addModel, setAddModel] = useState('')
  const [addPriority, setAddPriority] = useState('1')
  const [addRateLimit, setAddRateLimit] = useState('')
  const [addShowKey, setAddShowKey] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch('/api/providers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` }
      })
      const data = await res.json()
      setProviders(data.providers || [])
      setUsage(data.usage || [])
    } catch { } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProviders() }, [fetchProviders])

  const handleAdd = async () => {
    setAddError('')
    if (!addProvider || !addApiKey) { setAddError('Provider and API key required'); return }
    setAddLoading(true)
    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` },
        body: JSON.stringify({ provider: addProvider, apiKey: addApiKey, model: addModel || undefined, priority: parseInt(addPriority) || 1, rateLimit: addRateLimit ? parseInt(addRateLimit) : undefined })
      })
      if (!res.ok) { const e = await res.json(); setAddError(e.error || 'Failed'); setAddLoading(false); return }
      setShowAddDialog(false)
      setAddProvider(''); setAddApiKey(''); setAddModel(''); setAddPriority('1'); setAddRateLimit('')
      fetchProviders()
    } catch { setAddError('Network error') }
    setAddLoading(false)
  }

  const handleTest = async (id: string) => {
    setTestingId(id)
    try {
      const res = await fetch(`/api/providers/${id}/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` }
      })
      const data = await res.json()
      setTestResults(prev => ({ ...prev, [id]: { success: data.success, latency: data.latency } }))
    } catch {
      setTestResults(prev => ({ ...prev, [id]: { success: false, latency: 0 } }))
    }
    setTestingId(null)
  }

  const handleToggle = async (id: string, isEnabled: boolean) => {
    await fetch(`/api/providers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` },
      body: JSON.stringify({ isEnabled })
    })
    fetchProviders()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this provider key?')) return
    await fetch(`/api/providers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` }
    })
    fetchProviders()
  }

  const totalCost = usage.reduce((s, u) => s + (u._sum.costUsd || 0), 0)
  const totalTokens = usage.reduce((s, u) => s + (u._sum.inputTokens || 0) + (u._sum.outputTokens || 0), 0)
  const totalRequests = usage.reduce((s, u) => s + (u._count.id || 0), 0)

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Provider Manager</h1>
            <p className="text-xs text-gray-500">{providers.length} providers configured · ${totalCost.toFixed(4)} total spend</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Add Provider
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Providers', value: providers.length.toString(), icon: <Brain className="w-4 h-4" />, color: 'text-orange-600 bg-orange-50' },
          { label: 'Active', value: providers.filter(p => p.isEnabled).length.toString(), icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Requests', value: totalRequests.toLocaleString(), icon: <Activity className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Spend', value: `$${totalCost.toFixed(4)}`, icon: <DollarSign className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", s.color)}>{s.icon}</div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="providers" className="text-xs"><Brain className="w-3.5 h-3.5 mr-1" /> Providers</TabsTrigger>
          <TabsTrigger value="usage" className="text-xs"><Activity className="w-3.5 h-3.5 mr-1" /> Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
          ) : providers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-900 mb-1">No providers configured</h3>
                <p className="text-sm text-gray-500 mb-4">Add an AI provider API key to start using AI features.</p>
                <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 mr-1.5" /> Add Provider</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {providers.map(p => {
                const info = PROVIDER_INFO[p.provider] || { name: p.provider, icon: '🔧', models: [], color: 'text-gray-600', bgColor: 'bg-gray-50' }
                const test = testResults[p.id]
                const providerUsage = usage.filter(u => u.provider === p.provider)
                const providerCost = providerUsage.reduce((s, u) => s + (u._sum.costUsd || 0), 0)
                const providerRequests = providerUsage.reduce((s, u) => s + (u._count.id || 0), 0)
                const avgLatency = providerUsage.length > 0 ? providerUsage.reduce((s, u) => s + (u._avg.latencyMs || 0), 0) / providerUsage.length : 0

                return (
                  <Card key={p.id} className={cn("transition-all", !p.isEnabled && "opacity-60")}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">{info.name}</h3>
                            <Badge variant={p.isEnabled ? 'default' : 'secondary'} className={cn("text-[10px] px-1.5 py-0 h-4", p.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')}>
                              {p.isEnabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-3.5">Priority {p.priority}</Badge>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">Model: {p.model || 'Default'} · Added {new Date(p.createdAt).toLocaleDateString()}</p>

                          {test && (
                            <div className={cn("flex items-center gap-2 mt-2 p-2 rounded-lg text-xs", test.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                              {test.success ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              {test.success ? `Connected (${test.latency}ms)` : 'Connection failed'}
                            </div>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                            <span>{providerRequests} requests</span>
                            <span>${providerCost.toFixed(4)} spend</span>
                            {avgLatency > 0 && <span>{avgLatency.toFixed(0)}ms avg</span>}
                          </div>

                          <div className="flex items-center gap-1.5 mt-3">
                            <Button variant="outline" size="sm" className="text-[10px] h-6 px-2" onClick={() => handleTest(p.id)} disabled={testingId === p.id}>
                              {testingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                              <span className="ml-1">Test</span>
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-6 px-2" onClick={() => handleToggle(p.id, !p.isEnabled)}>
                              {p.isEnabled ? 'Disable' : 'Enable'}
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 text-red-600 hover:text-red-700" onClick={() => handleDelete(p.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Provider</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Model</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Requests</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Input Tokens</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Output Tokens</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Cost</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Avg Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400">No usage data yet. Test a provider to generate data.</td></tr>
                  ) : usage.map(u => {
                    const info = PROVIDER_INFO[u.provider] || { name: u.provider, icon: '🔧' }
                    return (
                      <tr key={`${u.provider}-${u.model}`} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3"><span className="mr-1.5">{info.icon}</span><span className="text-xs font-medium">{info.name || u.provider}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-600">{u.model || 'default'}</td>
                        <td className="px-4 py-3 text-xs font-medium">{u._count.id}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{(u._sum.inputTokens || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{(u._sum.outputTokens || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs font-medium text-emerald-600">${(u._sum.costUsd || 0).toFixed(4)}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{u._avg.latencyMs ? `${u._avg.latencyMs.toFixed(0)}ms` : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add AI Provider</DialogTitle>
            <DialogDescription>Configure an AI provider API key. Keys are stored encrypted.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {addError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500" /><p className="text-xs text-red-700">{addError}</p>
              </div>
            )}
            <div>
              <Label className="text-xs">Provider</Label>
              <Select value={addProvider} onValueChange={setAddProvider}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select provider" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PROVIDER_INFO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.icon} {v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">API Key</Label>
              <div className="relative mt-1">
                <Input type={addShowKey ? 'text' : 'password'} value={addApiKey} onChange={e => setAddApiKey(e.target.value)} placeholder="sk-..." className="pr-10" />
                <button type="button" onClick={() => setAddShowKey(!addShowKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {addShowKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {addProvider && PROVIDER_INFO[addProvider] && (
              <div>
                <Label className="text-xs">Model</Label>
                <Select value={addModel} onValueChange={setAddModel}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Default model" /></SelectTrigger>
                  <SelectContent>
                    {PROVIDER_INFO[addProvider].models.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Priority (1 = highest)</Label>
                <Input type="number" value={addPriority} onChange={e => setAddPriority(e.target.value)} min="1" max="10" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Rate Limit (req/min, optional)</Label>
                <Input type="number" value={addRateLimit} onChange={e => setAddRateLimit(e.target.value)} placeholder="60" className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={addLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {addLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />} Save Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
