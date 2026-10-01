import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Sparkles, Play, Save, Copy, Trash2, Plus, Search, Clock, DollarSign, Zap,
  CheckCircle, AlertTriangle, RotateCcw, Variable, FileText, BarChart3,
  Settings2, Eye, BookOpen, X, Send, Loader2, Star, Hash, Cpu, Activity,
  TrendingUp, RefreshCw, Folder, FolderOpen, Download, Upload, Archive,
  GitCompare, ChevronDown, ChevronRight, Tag, Heart, Copy as CopyIcon,
  ArrowLeftRight, MessageSquare, Sliders, Shield, AlertCircle, Bell
} from 'lucide-react'

type Tab = 'playground' | 'library' | 'costs' | 'models' | 'compare'
type LibraryView = 'list' | 'folders' | 'favorites' | 'archived'

const PROVIDERS: Record<string, { name: string; color: string }> = {
  pollinations: { name: 'Pollinations (Free)', color: '#10b981' },
  openai: { name: 'OpenAI', color: '#10a37f' },
  anthropic: { name: 'Anthropic', color: '#d97706' },
  google: { name: 'Google AI', color: '#4285f4' },
  xai: { name: 'xAI', color: '#ef4444' },
  deepseek: { name: 'DeepSeek', color: '#6366f1' },
  mistral: { name: 'Mistral', color: '#f59e0b' },
  openrouter: { name: 'OpenRouter', color: '#8b5cf6' },
}

const CATEGORIES = ['all', 'general', 'marketing', 'ecommerce', 'content', 'advertising', 'support', 'business', 'development', 'localization', 'sales', 'seo', 'rfq', 'supplier', 'buyer', 'whatsapp', 'email', 'linkedin', 'youtube', 'video', 'blog']

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || `Request failed (${res.status})`) }
  return res.json()
}

export function AIStudioPage() {
  const { user, token } = useAuth()
  const [tab, setTab] = useState<Tab>('playground')
  const [providers, setProviders] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [prompts, setPrompts] = useState<any[]>([])
  const [folders, setFolders] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [executing, setExecuting] = useState(false)
  const [costs, setCosts] = useState<any>(null)
  const [recentExecs, setRecentExecs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [costPeriod, setCostPeriod] = useState('7d')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [varValues, setVarValues] = useState<Record<string, string>>({})
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [topP, setTopP] = useState<number | undefined>(undefined)
  const [frequencyPenalty, setFrequencyPenalty] = useState<number | undefined>(undefined)
  const [presencePenalty, setPresencePenalty] = useState<number | undefined>(undefined)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [execResult, setExecResult] = useState<any>(null)

  // Prompt editor
  const [showNewPrompt, setShowNewPrompt] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<any>(null)
  const [promptName, setPromptName] = useState('')
  const [promptDesc, setPromptDesc] = useState('')
  const [promptCat, setPromptCat] = useState('general')
  const [promptContent, setPromptContent] = useState('')
  const [promptSysPrompt, setPromptSysPrompt] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [libraryView, setLibraryView] = useState<LibraryView>('list')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [viewingPrompt, setViewingPrompt] = useState<any>(null)
  const [showVersions, setShowVersions] = useState(false)
  const [budgetAlerts, setBudgetAlerts] = useState<any[]>([])
  const [showBudgetAlert, setShowBudgetAlert] = useState(false)
  const [alertName, setAlertName] = useState('')
  const [alertThreshold, setAlertThreshold] = useState('')
  const [alertPeriod, setAlertPeriod] = useState('monthly')

  // Compare
  const [compareProviders, setCompareProviders] = useState<{provider: string; model: string}[]>([])
  const [compareResult, setCompareResult] = useState<any>(null)
  const [comparing, setComparing] = useState(false)

  const loadData = useCallback(async () => {
    if (!token) return
    try {
      const [provRes, modelRes, promptRes, templateRes, folderRes] = await Promise.all([
        api('/api/providers', token), api('/api/ai/models', token), api('/api/prompt-library', token),
        api('/api/prompt-templates', token), api('/api/ai/folders', token),
      ])
      if (provRes.providers) setProviders(provRes.providers)
      if (modelRes.models) setModels(modelRes.models)
      if (promptRes.prompts) setPrompts(promptRes.prompts)
      if (templateRes.templates) setTemplates(templateRes.templates)
      if (folderRes.folders) setFolders(folderRes.folders)

      const activeProviders = provRes.providers?.filter((p: any) => p.isEnabled) || []
      if (activeProviders.length > 0 && !selectedProvider) {
        setSelectedProvider(activeProviders[0].provider)
        setSelectedModel(activeProviders[0].model || PROVIDERS[activeProviders[0].provider]?.models?.[0] || '')
      }
    } catch (e: any) { setError(e.message) }
  }, [token])

  const loadCosts = useCallback(async () => {
    if (!token) return
    try {
      const [summaryRes, recentRes, alertRes] = await Promise.all([
        api(`/api/costs/summary?period=${costPeriod}`, token),
        api('/api/costs/recent', token),
        api('/api/ai/budget-alerts', token),
      ])
      if (summaryRes.summary) setCosts(summaryRes)
      if (recentRes.executions) setRecentExecs(recentRes.executions)
      if (alertRes.alerts) setBudgetAlerts(alertRes.alerts)
    } catch (e: any) { setError(e.message) }
  }, [token, costPeriod])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => { if (tab === 'costs') loadCosts() }, [tab, loadCosts])

  const showError = (msg: string) => { setError(msg); setTimeout(() => setError(''), 5000) }
  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const executePrompt = async (content: string, vars?: Record<string, string>) => {
    setExecuting(true); setError(''); setOutput(''); setExecResult(null)
    let finalContent = content
    if (vars) { for (const [k, v] of Object.entries(vars)) finalContent = finalContent.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v) }
    try {
      const res = await api('/api/ai/execute', token, {
        method: 'POST',
        body: JSON.stringify({ provider: selectedProvider, model: selectedModel, content: finalContent, systemPrompt: systemPrompt || undefined, maxTokens, temperature, topP, frequencyPenalty, presencePenalty })
      })
      if (!res.success) showError(res.error || 'Execution failed')
      else { setOutput(res.output || ''); setExecResult(res); showSuccess(`Done — ${res.tokens?.total || 0} tokens, $${(res.cost || 0).toFixed(4)}, ${res.latencyMs || 0}ms`) }
    } catch (e: any) { showError(e.message) } finally { setExecuting(false) }
  }

  const compareExecute = async () => {
    if (!compareProviders.length || !input.trim()) return
    setComparing(true); setCompareResult(null); setError('')
    try {
      const res = await api('/api/ai/compare', token, {
        method: 'POST', body: JSON.stringify({ content: input, systemPrompt: systemPrompt || undefined, providers: compareProviders, maxTokens, temperature })
      })
      setCompareResult(res.comparison)
    } catch (e: any) { showError(e.message) } finally { setComparing(false) }
  }

  const savePrompt = async () => {
    if (!promptName || !promptContent) { showError('Name and content required'); return }
    try {
      const res = await api('/api/prompt-library', token, {
        method: 'POST', body: JSON.stringify({ name: promptName, description: promptDesc, category: promptCat, content: promptContent, systemPrompt: promptSysPrompt || undefined, folderId: selectedFolder })
      })
      if (res.error) showError(res.error); else { showSuccess('Prompt saved!'); setShowNewPrompt(false); resetPromptForm(); loadData() }
    } catch (e: any) { showError(e.message) }
  }

  const updatePrompt = async () => {
    if (!editingPrompt) return
    try {
      const res = await api(`/api/prompt-library/${editingPrompt.id}`, token, {
        method: 'PATCH', body: JSON.stringify({ name: promptName, description: promptDesc, category: promptCat, content: promptContent, systemPrompt: promptSysPrompt })
      })
      if (res.error) showError(res.error); else { showSuccess('Prompt updated!'); setEditingPrompt(null); resetPromptForm(); loadData() }
    } catch (e: any) { showError(e.message) }
  }

  const resetPromptForm = () => { setPromptName(''); setPromptDesc(''); setPromptCat('general'); setPromptContent(''); setPromptSysPrompt('') }

  const deletePrompt = async (id: string) => {
    if (!confirm('Delete this prompt?')) return
    try { await api(`/api/prompt-library/${id}`, token, { method: 'DELETE' }); loadData() } catch (e: any) { showError(e.message) }
  }

  const toggleFavorite = async (id: string) => {
    try { await api(`/ai/prompts/${id}/favorite`, token, { method: 'POST' }); loadData() } catch (e: any) { showError(e.message) }
  }

  const duplicatePrompt = async (id: string) => {
    try { await api(`/ai/prompts/${id}/duplicate`, token, { method: 'POST' }); showSuccess('Duplicated!'); loadData() } catch (e: any) { showError(e.message) }
  }

  const exportPrompt = async (id: string) => {
    try {
      const res = await api(`/api/prompt-library/${id}/export?token=${token}`, token)
      const blob = new Blob([JSON.stringify(res.export, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `prompt-${id}.json`; a.click(); URL.revokeObjectURL(url)
    } catch (e: any) { showError(e.message) }
  }

  const importPrompt = async () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'
    input.onchange = async (e: any) => {
      const file = e.target.files[0]; if (!file) return
      try {
        const text = await file.text(); const data = JSON.parse(text)
        await api('/ai/prompts/import', token, { method: 'POST', body: JSON.stringify({ exportData: data }) })
        showSuccess('Prompt imported!'); loadData()
      } catch (e: any) { showError('Import failed: ' + e.message) }
    }
    input.click()
  }

  const rollbackVersion = async (promptId: string, version: number) => {
    if (!confirm(`Rollback to version ${version}?`)) return
    try {
      await api(`/ai/prompts/${promptId}/rollback/${version}`, token, { method: 'POST' })
      showSuccess(`Rolled back to v${version}`); loadData()
    } catch (e: any) { showError(e.message) }
  }

  const createFolder = async () => {
    if (!newFolderName) return
    try { await api('/api/ai/folders', token, { method: 'POST', body: JSON.stringify({ name: newFolderName }) }); setNewFolderName(''); setShowNewFolder(false); loadData() } catch (e: any) { showError(e.message) }
  }

  const createBudgetAlert = async () => {
    if (!alertName || !alertThreshold) return
    try {
      await api('/api/ai/budget-alerts', token, { method: 'POST', body: JSON.stringify({ name: alertName, threshold: parseFloat(alertThreshold), period: alertPeriod }) })
      showSuccess('Alert created!'); setShowBudgetAlert(false); setAlertName(''); setAlertThreshold(''); loadCosts()
    } catch (e: any) { showError(e.message) }
  }

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g)
    return matches ? [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))] : []
  }

  const providerModels = models.filter(m => m.provider === selectedProvider)
  const activeProviders = providers.filter(p => p.isEnabled)

  const TabBtn = ({ id, icon: Icon, label }: { id: Tab; icon: any; label: string }) => (
    <button onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600"><Sparkles className="w-6 h-6 text-white" /></div>
        <div><h1 className="text-2xl font-bold text-white">AI Studio</h1><p className="text-sm text-gray-400">Enterprise AI execution, prompt management, cost intelligence & provider comparison</p></div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400"><AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400"><CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}</div>}

      {activeProviders.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <div><p className="text-sm text-yellow-300 font-medium">No AI providers configured</p><p className="text-xs text-yellow-400/70 mt-0.5">Go to <strong>Provider Manager</strong> to add your API keys (OpenAI, Anthropic, Google, etc.) before using AI Studio.</p></div>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <TabBtn id="playground" icon={Play} label="Playground" />
        <TabBtn id="library" icon={FileText} label="Library" />
        <TabBtn id="compare" icon={GitCompare} label="Compare" />
        <TabBtn id="costs" icon={DollarSign} label="Costs" />
        <TabBtn id="models" icon={Cpu} label="Models" />
      </div>

      {/* ═══════ PLAYGROUND ═══════ */}
      {tab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300"><Cpu className="w-4 h-4" /> Provider & Model</div>
                <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Settings2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Provider</label>
                  <select value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); const fm = models.find(m => m.provider === e.target.value); if (fm) setSelectedModel(fm.modelId) }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
                    {activeProviders.length > 0 ? activeProviders.map((p: any) => <option key={p.provider} value={p.provider}>{PROVIDERS[p.provider]?.name || p.provider}{p.health?.status === 'healthy' ? ' ✅' : p.health?.status === 'degraded' ? ' ⚠️' : ' ❌'}</option>) : Object.entries(PROVIDERS).map(([k, p]) => <option key={k} value={k}>{p.name} (no key)</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Model</label>
                  <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
                    {providerModels.map(m => <option key={m.modelId} value={m.modelId}>{m.name} — ${m.inputPricePer1k}/1K in</option>)}
                    {providerModels.length === 0 && <option>No models</option>}
                  </select>
                </div>
              </div>
              {showSettings && (
                <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-gray-500 mb-1 block">Temperature: {temperature}</label><input type="range" min="0" max="2" step="0.1" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} className="w-full accent-purple-500" /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">Max Tokens</label><input type="number" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value) || 1000)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500 focus:outline-none" /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">Top P</label><input type="number" value={topP ?? ''} onChange={e => setTopP(e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Default" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500 focus:outline-none" /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">Freq Penalty</label><input type="number" value={frequencyPenalty ?? ''} onChange={e => setFrequencyPenalty(e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Default" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500 focus:outline-none" /></div>
                  </div>
                  <div><label className="text-xs text-gray-500 mb-1 block">System Prompt</label><textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} placeholder="Optional system prompt to guide the model's behavior..." className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 resize-none focus:border-purple-500 focus:outline-none font-mono" /></div>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300"><FileText className="w-4 h-4" /> Prompt</div>
                <div className="flex gap-2">
                  <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300"><BookOpen className="w-3 h-3" /> Templates ({templates.length})</button>
                </div>
              </div>
              {showTemplates && (
                <div className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 max-h-48 overflow-y-auto">
                  {Object.entries(templates.reduce((acc: any, t: any) => { (acc[t.category] = acc[t.category] || []).push(t); return acc }, {})).map(([cat, items]: [string, any]) => (
                    <div key={cat} className="mb-2">
                      <div className="text-xs text-purple-400 font-medium mb-1 capitalize">{cat}</div>
                      {items.map((t: any) => (<button key={t.id} onClick={() => { setInput(t.content); setShowTemplates(false) }} className="w-full text-left p-2 hover:bg-gray-700/50 rounded-lg mb-0.5"><div className="text-sm text-white">{t.name}</div><div className="text-xs text-gray-400 truncate">{t.content.substring(0, 80)}...</div></button>))}
                    </div>
                  ))}
                </div>
              )}
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter your prompt... Use {{variable}} for template variables."
                className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:border-purple-500 focus:outline-none font-mono" />
              {extractVariables(input).length > 0 && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2"><Variable className="w-3 h-3" /> Variables</div>
                  <div className="grid grid-cols-2 gap-2">
                    {extractVariables(input).map(v => (<div key={v}><label className="text-xs text-purple-400">{`{{${v}}}`}</label><input value={varValues[v] || ''} onChange={e => setVarValues({ ...varValues, [v]: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-purple-500 focus:outline-none mt-0.5" /></div>))}
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">{input.length} chars · {extractVariables(input).length} vars</div>
                <button onClick={() => executePrompt(input, varValues)} disabled={executing || !input.trim() || activeProviders.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white shadow-lg shadow-purple-500/25">
                  {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} {executing ? 'Running...' : 'Run Prompt'}
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300"><Sparkles className="w-4 h-4" /> Output</div>
                {output && (<div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(output)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300"><Copy className="w-3 h-3" /> Copy</button>
                  <button onClick={() => { setInput(output); setOutput('') }} className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300"><RotateCcw className="w-3 h-3" /> Reuse</button>
                  <button onClick={() => { navigator.clipboard.writeText(JSON.stringify({ provider: selectedProvider, model: selectedModel, input, output, tokens: execResult?.tokens, cost: execResult?.cost, latency: execResult?.latencyMs }, null, 2)) }} className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300"><Download className="w-3 h-3" /> Export</button>
                </div>)}
              </div>
              <div className="min-h-[200px] bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 font-mono whitespace-pre-wrap">{output || <span className="text-gray-500">Output will appear here...</span>}</div>
              {execResult && (
                <div className="mt-3 grid grid-cols-5 gap-3">
                  {[{ l: 'Tokens', v: execResult.tokens?.total || 0, c: 'text-white' }, { l: 'In/Out', v: `${execResult.tokens?.input || 0}/${execResult.tokens?.output || 0}`, c: 'text-gray-300' }, { l: 'Cost', v: `$${(execResult.cost || 0).toFixed(4)}`, c: 'text-green-400' }, { l: 'Latency', v: `${execResult.latencyMs || 0}ms`, c: 'text-blue-400' }, { l: 'Status', v: execResult.success ? 'OK' : 'Failed', c: execResult.success ? 'text-green-400' : 'text-red-400' }].map(s => (
                    <div key={s.l} className="bg-gray-800 rounded-lg p-2 text-center"><div className="text-xs text-gray-500">{s.l}</div><div className={`text-sm font-bold ${s.c}`}>{s.v}</div></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[{ l: 'Summarize', p: 'Summarize the following in 3 bullet points:\n\n' }, { l: 'Blog Post', p: 'Write a 500-word blog post about: ' }, { l: 'Translate Hindi', p: 'Translate to Hindi:\n\n' }, { l: 'Ad Copy', p: 'Write 3 ad variations for: ' }, { l: 'Code Review', p: 'Review this code:\n\n' }].map(q => (
                  <button key={q.l} onClick={() => setInput(q.p)} className="w-full text-left p-2.5 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-lg text-sm text-gray-300"><Zap className="w-3 h-3 inline mr-2 text-yellow-400" />{q.l}</button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Providers</h3>
              {providers.length === 0 ? <p className="text-xs text-gray-500 text-center py-2">No keys configured</p> : (
                <div className="space-y-2">
                  {providers.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.health?.status === 'healthy' ? 'bg-green-400' : p.health?.status === 'degraded' ? 'bg-yellow-400' : p.isEnabled ? 'bg-red-400' : 'bg-gray-600'}`} />
                        <span className="text-xs text-white capitalize">{p.provider}</span>
                      </div>
                      <div className="text-right"><div className="text-xs text-gray-500">{p.health?.avgLatency || 0}ms</div><div className="text-xs text-gray-600">${(p.health?.totalCost || 0).toFixed(4)}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {costs?.summary && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Usage</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Total Cost</span><span className="text-green-400 font-medium">${costs.summary.totalCost.toFixed(4)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Executions</span><span className="text-white">{costs.summary.executions}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Tokens</span><span className="text-white">{costs.summary.totalTokens.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Avg Latency</span><span className="text-blue-400">{costs.summary.avgLatency}ms</span></div>
                  {costs.forecast && (<><div className="border-t border-gray-800 pt-2 mt-2"><div className="text-xs text-gray-500 mb-1">Forecast</div></div><div className="flex justify-between"><span className="text-gray-400">Next 7d</span><span className="text-yellow-400">${costs.forecast.next7days.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-400">Next 30d</span><span className="text-yellow-400">${costs.forecast.next30days.toFixed(2)}</span></div></>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ PROMPT LIBRARY ═══════ */}
      {tab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..." className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none" /></div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
              {([['list', FileText], ['folders', Folder], ['favorites', Heart], ['archived', Archive]] as [LibraryView, any][]).map(([v, Icon]) => (<button key={v} onClick={() => setLibraryView(v)} className={`p-1.5 rounded ${libraryView === v ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}><Icon className="w-4 h-4" /></button>))}
            </div>
            <button onClick={importPrompt} className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300"><Upload className="w-4 h-4" /> Import</button>
            <button onClick={() => setShowNewPrompt(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> New</button>
          </div>

          {/* Folders Sidebar */}
          {libraryView === 'folders' && (
            <div className="flex gap-4">
              <div className="w-48 space-y-2">
                <button onClick={() => setSelectedFolder(null)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!selectedFolder ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-gray-800'}`}>All Prompts ({prompts.length})</button>
                {folders.map(f => (<button key={f.id} onClick={() => setSelectedFolder(f.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${selectedFolder === f.id ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-gray-800'}`}><span className="flex items-center gap-2"><Folder className="w-3 h-3" /> {f.name}</span><span className="text-xs">{f._count?.prompts || 0}</span></button>))}
                {showNewFolder ? (
                  <div className="flex gap-1"><input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createFolder()} placeholder="Folder name" className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-purple-500 focus:outline-none" /><button onClick={createFolder} className="px-2 py-1 bg-purple-600 rounded text-xs text-white">OK</button></div>
                ) : (
                  <button onClick={() => setShowNewFolder(true)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800"><Plus className="w-3 h-3 inline mr-1" /> New Folder</button>
                )}
              </div>
              <div className="flex-1">
                <PromptGrid prompts={prompts.filter(p => !selectedFolder || p.folderId === selectedFolder)} onEdit={(p) => { setEditingPrompt(p); setPromptName(p.name); setPromptDesc(p.description || ''); setPromptCat(p.category); setPromptContent(p.content); setPromptSysPrompt(p.systemPrompt || ''); setShowNewPrompt(true) }} onDelete={deletePrompt} onFavorite={toggleFavorite} onDuplicate={duplicatePrompt} onExport={exportPrompt} onUse={(p) => { setInput(p.content); setTab('playground') }} onView={setViewingPrompt} />
              </div>
            </div>
          )}

          {libraryView !== 'folders' && (
            <PromptGrid
              prompts={libraryView === 'favorites' ? prompts.filter(p => p.isFavorited) : libraryView === 'archived' ? prompts.filter(p => p.isArchived) : prompts}
              search={search} catFilter={catFilter}
              onEdit={(p) => { setEditingPrompt(p); setPromptName(p.name); setPromptDesc(p.description || ''); setPromptCat(p.category); setPromptContent(p.content); setPromptSysPrompt(p.systemPrompt || ''); setShowNewPrompt(true) }}
              onDelete={deletePrompt} onFavorite={toggleFavorite} onDuplicate={duplicatePrompt} onExport={exportPrompt}
              onUse={(p) => { setInput(p.content); setTab('playground') }} onView={setViewingPrompt}
            />
          )}

          {/* Version History Modal */}
          {viewingPrompt && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setViewingPrompt(null)}>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-white">{viewingPrompt.name}</h3><button onClick={() => setViewingPrompt(null)}><X className="w-5 h-5 text-gray-400" /></button></div>
                <div className="text-xs text-gray-500 mb-3">{viewingPrompt.category} · {viewingPrompt._count?.executions || 0} executions · {viewingPrompt._count?.favorites || 0} favorites</div>
                {viewingPrompt.description && <p className="text-sm text-gray-300 mb-3">{viewingPrompt.description}</p>}
                <div className="bg-gray-800 rounded-lg p-4 mb-4"><pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap">{viewingPrompt.content}</pre></div>
                {viewingPrompt.systemPrompt && <div className="mb-4"><div className="text-xs text-gray-500 mb-1">System Prompt</div><div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300 font-mono">{viewingPrompt.systemPrompt}</div></div>}
                <div className="flex gap-2">
                  <button onClick={() => { setInput(viewingPrompt.content); setTab('playground'); setViewingPrompt(null) }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm text-white"><Play className="w-4 h-4" /> Run</button>
                  <button onClick={() => { setEditingPrompt(viewingPrompt); setPromptName(viewingPrompt.name); setPromptDesc(viewingPrompt.description || ''); setPromptCat(viewingPrompt.category); setPromptContent(viewingPrompt.content); setPromptSysPrompt(viewingPrompt.systemPrompt || ''); setShowNewPrompt(true); setViewingPrompt(null) }} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300"><Settings2 className="w-4 h-4" /> Edit</button>
                  <button onClick={() => { exportPrompt(viewingPrompt.id) }} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300"><Download className="w-4 h-4" /> Export</button>
                </div>
                {/* Version History */}
                {viewingPrompt.versions && viewingPrompt.versions.length > 0 && (
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Version History ({viewingPrompt.versions.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {viewingPrompt.versions.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                          <div><span className="text-sm text-white font-medium">v{v.version}</span><span className="text-xs text-gray-500 ml-2">{v.changelog}</span><span className="text-xs text-gray-600 ml-2">{new Date(v.createdAt).toLocaleDateString()}</span></div>
                          {v.version !== viewingPrompt.versions[0]?.version && (
                            <button onClick={() => { rollbackVersion(viewingPrompt.id, v.version); setViewingPrompt(null) }} className="text-xs text-yellow-400 hover:text-yellow-300">Rollback</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* New/Edit Prompt Modal */}
          {showNewPrompt && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setShowNewPrompt(false); setEditingPrompt(null); resetPromptForm() }}>
              <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">{editingPrompt ? 'Edit Prompt' : 'New Prompt'}</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input value={promptName} onChange={e => setPromptName(e.target.value)} placeholder="Name" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" />
                  <select value={promptCat} onChange={e => setPromptCat(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
                    {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <input value={promptDesc} onChange={e => setPromptDesc(e.target.value)} placeholder="Description" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none mb-3" />
                <textarea value={promptContent} onChange={e => setPromptContent(e.target.value)} placeholder="Prompt content — use {{variable}} for template variables"
                  className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white font-mono resize-none focus:border-purple-500 focus:outline-none mb-3" />
                <textarea value={promptSysPrompt} onChange={e => setPromptSysPrompt(e.target.value)} placeholder="System prompt (optional — sets model behavior)"
                  className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white font-mono resize-none focus:border-purple-500 focus:outline-none mb-3" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setShowNewPrompt(false); setEditingPrompt(null); resetPromptForm() }} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>
                  <button onClick={editingPrompt ? updatePrompt : savePrompt} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white"><Save className="w-4 h-4" /> {editingPrompt ? 'Update' : 'Save'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ COMPARE ═══════ */}
      {tab === 'compare' && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3"><GitCompare className="w-4 h-4 inline mr-2" /> Compare Providers / Models</h3>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a prompt to compare across providers..."
              className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:border-purple-500 focus:outline-none font-mono mb-3" />
            <div className="mb-3"><label className="text-xs text-gray-500 mb-2 block">Select providers to compare:</label>
              <div className="flex flex-wrap gap-2">
                {providers.filter(p => p.isEnabled).map(p => {
                  const selected = compareProviders.some(cp => cp.provider === p.provider && cp.model === (p.model || ''))
                  return (
                    <button key={p.id} onClick={() => {
                      if (selected) setCompareProviders(compareProviders.filter(cp => !(cp.provider === p.provider && cp.model === (p.model || ''))))
                      else setCompareProviders([...compareProviders, { provider: p.provider, model: p.model || '' }])
                    }} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${selected ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PROVIDERS[p.provider]?.color || '#666' }} />{PROVIDERS[p.provider]?.name || p.provider}{p.model ? ` (${p.model})` : ''}
                    </button>
                  )
                })}
              </div>
            </div>
            <button onClick={compareExecute} disabled={comparing || !compareProviders.length || !input.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white">
              {comparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />} {comparing ? 'Comparing...' : 'Compare'}
            </button>
          </div>
          {compareResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compareResult.map((r: any, i: number) => (
                <div key={i} className={`bg-gray-900 border rounded-xl p-4 ${r.success ? 'border-gray-800' : 'border-red-500/30'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PROVIDERS[r.provider]?.color || '#666' }} />
                    <span className="text-sm font-medium text-white">{PROVIDERS[r.provider]?.name || r.provider}</span>
                    <span className="text-xs text-gray-500">{r.model}</span>
                  </div>
                  {r.success ? (
                    <>
                      <div className="bg-gray-800 rounded-lg p-3 mb-3 text-sm text-gray-200 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">{r.output}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center"><div className="text-gray-500">Tokens</div><div className="text-white font-medium">{r.tokens?.input + r.tokens?.output || 0}</div></div>
                        <div className="text-center"><div className="text-gray-500">Cost</div><div className="text-green-400 font-medium">${(r.cost || 0).toFixed(4)}</div></div>
                        <div className="text-center"><div className="text-gray-500">Latency</div><div className="text-blue-400 font-medium">{r.latencyMs}ms</div></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4"><AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" /><p className="text-sm text-red-400">{r.error}</p></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════ COST TRACKER ═══════ */}
      {tab === 'costs' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Period:</span>
            {['24h', '7d', '30d', '90d', '1y'].map(p => (<button key={p} onClick={() => setCostPeriod(p)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${costPeriod === p ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{p}</button>))}
            <button onClick={() => setShowBudgetAlert(true)} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300"><Bell className="w-4 h-4" /> Budget Alert</button>
            <button onClick={loadCosts} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
          </div>

          {costs ? (<>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ l: 'Total Cost', v: `$${costs.summary.totalCost.toFixed(4)}`, i: DollarSign, c: 'text-green-400' }, { l: 'Executions', v: costs.summary.executions, i: Hash, c: 'text-white' }, { l: 'Tokens', v: costs.summary.totalTokens.toLocaleString(), i: Activity, c: 'text-white' }, { l: 'Avg Latency', v: `${costs.summary.avgLatency}ms`, i: TrendingUp, c: 'text-blue-400' }].map(s => (
                <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4"><div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><s.i className="w-4 h-4" /> {s.l}</div><div className={`text-2xl font-bold ${s.c}`}>{s.v}</div></div>
              ))}
            </div>

            {costs.forecast && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4"><h3 className="text-sm font-medium text-gray-300 mb-3">Cost Forecast</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center"><div className="text-xs text-gray-500">Avg Daily</div><div className="text-lg font-bold text-white">${costs.forecast.avgDaily.toFixed(4)}</div></div>
                  <div className="text-center"><div className="text-xs text-gray-500">Next 7 Days</div><div className="text-lg font-bold text-yellow-400">${costs.forecast.next7days.toFixed(2)}</div></div>
                  <div className="text-center"><div className="text-xs text-gray-500">Next 30 Days</div><div className="text-lg font-bold text-orange-400">${costs.forecast.next30days.toFixed(2)}</div></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4"><h3 className="text-sm font-medium text-gray-300 mb-4">By Provider</h3>
                {costs.byProvider.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">No data</p> : costs.byProvider.map((p: any) => {
                  const pct = costs.summary.totalCost > 0 ? (p.cost / costs.summary.totalCost * 100) : 0
                  return (<div key={p.provider} className="mb-3"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300 capitalize">{p.provider}</span><span className="text-white">${p.cost.toFixed(4)} ({p.executions} runs, {p.avgLatency}ms avg)</span></div><div className="h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${Math.max(pct, 2)}%` }} /></div></div>)
                })}
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4"><h3 className="text-sm font-medium text-gray-300 mb-4">By Model</h3>
                {costs.byModel.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">No data</p> : costs.byModel.map((m: any) => (
                  <div key={m.model} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg mb-2"><span className="text-sm text-white">{m.model}</span><div><span className="text-sm text-green-400">${m.cost.toFixed(4)}</span><span className="text-xs text-gray-500 ml-2">{m.executions} runs</span></div></div>
                ))}
              </div>
            </div>

            {/* Budget Alerts */}
            {budgetAlerts.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4"><h3 className="text-sm font-medium text-gray-300 mb-3">Budget Alerts</h3>
                {budgetAlerts.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg mb-2">
                    <div><span className="text-sm text-white">{a.name}</span><span className="text-xs text-gray-500 ml-2">${a.threshold}/{a.period}</span></div>
                    <div className="flex items-center gap-2">
                      {a.lastTriggered && <span className="text-xs text-yellow-400">Triggered</span>}
                      <button onClick={async () => { await api(`/api/budget-alerts/${a.id}`, token, { method: 'DELETE' }); loadCosts() }} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4"><h3 className="text-sm font-medium text-gray-300 mb-4">Recent Executions</h3>
              {recentExecs.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">No executions</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-gray-500 text-left border-b border-gray-800"><th className="pb-2 font-medium">Time</th><th className="pb-2 font-medium">Provider</th><th className="pb-2 font-medium">Model</th><th className="pb-2 font-medium text-right">Tokens</th><th className="pb-2 font-medium text-right">Cost</th><th className="pb-2 font-medium text-right">Latency</th><th className="pb-2 font-medium">Status</th></tr></thead>
                    <tbody>{recentExecs.map(e => (
                      <tr key={e.id} className="border-b border-gray-800/50">
                        <td className="py-2 text-gray-400">{new Date(e.createdAt).toLocaleString()}</td>
                        <td className="py-2 text-white capitalize">{e.provider}</td>
                        <td className="py-2 text-gray-300">{e.model}</td>
                        <td className="py-2 text-white text-right">{e.totalTokens.toLocaleString()}</td>
                        <td className="py-2 text-green-400 text-right">${e.costUsd.toFixed(4)}</td>
                        <td className="py-2 text-blue-400 text-right">{e.latencyMs}ms</td>
                        <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${e.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{e.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </>) : <div className="text-center py-12"><Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" /></div>}

          {/* Budget Alert Modal */}
          {showBudgetAlert && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowBudgetAlert(false)}>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Create Budget Alert</h3>
                <input value={alertName} onChange={e => setAlertName(e.target.value)} placeholder="Alert name" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none mb-3" />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="number" value={alertThreshold} onChange={e => setAlertThreshold(e.target.value)} placeholder="Threshold ($)" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" />
                  <select value={alertPeriod} onChange={e => setAlertPeriod(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
                    {['daily', 'weekly', 'monthly', 'yearly'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowBudgetAlert(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>
                  <button onClick={createBudgetAlert} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm text-white">Create</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ MODEL CATALOG ═══════ */}
      {tab === 'models' && (
        <div className="space-y-4">
          <div className="relative max-w-md"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..." className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.modelId.includes(search.toLowerCase())).map(model => {
              const caps = model.capabilities ? JSON.parse(model.capabilities) : []
              const prov = PROVIDERS[model.provider]
              return (
                <div key={model.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: prov?.color || '#666' }} /><span className="text-xs text-gray-400 uppercase">{model.provider}</span></div><h3 className="text-sm font-medium text-white mt-1">{model.name}</h3></div>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{model.modelId}</span>
                  </div>
                  {model.description && <p className="text-xs text-gray-400 mb-3">{model.description}</p>}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    {[{ l: 'Input', v: `$${model.inputPricePer1k}/1K` }, { l: 'Output', v: `$${model.outputPricePer1k}/1K` }, { l: 'Context', v: `${(model.contextWindow / 1000).toFixed(0)}K` }, { l: 'Max Out', v: `${(model.maxTokens / 1000).toFixed(0)}K` }].map(s => (
                      <div key={s.l} className="bg-gray-800 rounded-lg p-2"><span className="text-gray-500">{s.l}</span><span className="block text-white font-medium">{s.v}</span></div>
                    ))}
                  </div>
                  {caps.length > 0 && <div className="flex flex-wrap gap-1">{caps.map((c: string) => <span key={c} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs">{c}</span>)}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Shared Prompt Grid Component ───

function PromptGrid({ prompts, search, catFilter, onEdit, onDelete, onFavorite, onDuplicate, onExport, onUse, onView }: {
  prompts: any[]; search?: string; catFilter?: string
  onEdit: (p: any) => void; onDelete: (id: string) => void; onFavorite: (id: string) => void
  onDuplicate: (id: string) => void; onExport: (id: string) => void; onUse: (p: any) => void; onView: (p: any) => void
}) {
  const filtered = prompts.filter(p => (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())) && (!catFilter || catFilter === 'all' || p.category === catFilter))

  if (filtered.length === 0) return (
    <div className="text-center py-12"><FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No prompts found</p></div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map(prompt => (
        <div key={prompt.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all cursor-pointer" onClick={() => onView(prompt)}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1"><h3 className="text-sm font-medium text-white">{prompt.name}</h3>{prompt.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{prompt.description}</p>}</div>
            <button onClick={(e) => { e.stopPropagation(); onFavorite(prompt.id) }} className={`p-1 ${prompt.isFavorited ? 'text-red-400' : 'text-gray-600 hover:text-red-400'}`}><Heart className="w-3 h-3" fill={prompt.isFavorited ? 'currentColor' : 'none'} /></button>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 mb-3"><p className="text-xs text-gray-300 font-mono line-clamp-3">{prompt.content}</p></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{prompt.category}</span>
              <span className="text-xs text-gray-500">{prompt._count?.executions || 0} runs</span>
              {prompt.folder && <span className="text-xs text-purple-400">{prompt.folder.name}</span>}
            </div>
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              <button onClick={() => onUse(prompt)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-green-400" title="Run"><Play className="w-3 h-3" /></button>
              <button onClick={() => { navigator.clipboard.writeText(prompt.content) }} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400" title="Copy"><Copy className="w-3 h-3" /></button>
              <button onClick={() => onDuplicate(prompt.id)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-yellow-400" title="Duplicate"><CopyIcon className="w-3 h-3" /></button>
              <button onClick={() => onExport(prompt.id)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-purple-400" title="Export"><Download className="w-3 h-3" /></button>
              <button onClick={() => onEdit(prompt)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white" title="Edit"><Settings2 className="w-3 h-3" /></button>
              <button onClick={() => onDelete(prompt.id)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400" title="Delete"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
          {prompt.versions?.length > 0 && <div className="mt-2 text-xs text-gray-500">v{prompt.versions[0].version} · {new Date(prompt.updatedAt).toLocaleDateString()}</div>}
        </div>
      ))}
    </div>
  )
}
