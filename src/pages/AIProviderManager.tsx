import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Router, Shield, Activity, Zap, DollarSign, Settings2, AlertTriangle,
  CheckCircle, XCircle, Loader2, RefreshCw, ChevronDown, ChevronRight,
  Globe, Lock, Unlock, ArrowRight, BarChart3, TrendingUp, Clock,
  Server, Wifi, WifiOff, Info, ExternalLink, Save, RotateCcw
} from 'lucide-react'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || `Request failed (${res.status})`) }
  return res.json()
}

const PROVIDER_ICONS: Record<string, string> = {
  openai: '🟢', anthropic: '🟠', google: '🔵', deepseek: '🟣', xai: '⚫',
  mistral: '🔴', pollinations: '🆓', flux: '🟪', stability: '🔷', ideogram: '🟡', recraft: '🔴',
}

const STATUS_COLORS: Record<string, string> = {
  healthy: 'text-green-600 bg-green-50', degraded: 'text-yellow-600 bg-yellow-50',
  down: 'text-red-600 bg-red-50', unknown: 'text-gray-400 bg-gray-50',
}

type TabId = 'overview' | 'health' | 'routing' | 'costs' | 'settings'

export function AIProviderManagerPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<TabId>('overview')
  const [config, setConfig] = useState<any>(null)
  const [health, setHealth] = useState<any>(null)
  const [costs, setCosts] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [testingProvider, setTestingProvider] = useState('')
  const [costPeriod, setCostPeriod] = useState('7d')

  // Settings form state
  const [editMode, setEditMode] = useState(false)
  const [mode, setMode] = useState('direct')
  const [routerUrl, setRouterUrl] = useState('')
  const [routerApiKey, setRouterApiKey] = useState('')
  const [preferFree, setPreferFree] = useState(true)
  const [costOptimization, setCostOptimization] = useState(true)
  const [maxCost, setMaxCost] = useState('0.10')
  const [fallbackChain, setFallbackChain] = useState<string[]>([])

  const loadData = useCallback(async () => {
    if (!token) return
    try {
      const [configRes, healthRes, costsRes] = await Promise.all([
        api('/api/ai-router/config', token),
        api('/api/ai-router/health', token),
        api(`/api/ai-router/cost-comparison?period=${costPeriod}`, token),
      ])
      if (configRes.config) {
        setConfig(configRes.config)
        setMode(configRes.config.mode)
        setRouterUrl(configRes.config.routerUrl === 'configured' ? '' : configRes.config.routerUrl)
        setPreferFree(configRes.config.preferFree)
        setCostOptimization(configRes.config.costOptimization)
        setMaxCost(String(configRes.config.maxCostPerGeneration))
        setFallbackChain(configRes.config.fallbackChain || [])
      }
      if (healthRes) setHealth(healthRes)
      if (costsRes) setCosts(costsRes)
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [token, costPeriod])

  useEffect(() => { loadData() }, [loadData])

  const saveConfig = async () => {
    try {
      await api('/api/ai-router/config', token, {
        method: 'POST',
        body: JSON.stringify({ mode, routerUrl, preferFree, costOptimization, maxCostPerGeneration: parseFloat(maxCost), fallbackChain }),
      })
      setSuccess('Router configuration saved!')
      setEditMode(false)
      loadData()
    } catch (e: any) { setError(e.message) }
  }

  const testProvider = async (provider: string) => {
    setTestingProvider(provider)
    try {
      await api('/api/ai-router/health-check', token, { method: 'POST', body: JSON.stringify({ provider }) })
      setSuccess(`Health check completed for ${provider}`)
      loadData()
    } catch (e: any) { setError(e.message) }
    setTestingProvider('')
  }

  const moveFallback = (from: number, to: number) => {
    if (to < 0 || to >= fallbackChain.length) return
    const newChain = [...fallbackChain]
    const [item] = newChain.splice(from, 1)
    newChain.splice(to, 0, item)
    setFallbackChain(newChain)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  )

  const systemHealth = health?.systemHealth || {}
  const providers = health?.providers || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Router className="w-7 h-7 text-blue-500" /> AI Provider Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Unified routing layer — Bell24h-OS → Router → Multiple AI Providers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${STATUS_COLORS[systemHealth.status] || STATUS_COLORS.unknown}`}>
            {systemHealth.status === 'healthy' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {systemHealth.status === 'healthy' ? 'All Systems Operational' : 'Degraded'}
          </div>
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            Uptime: {Math.floor((systemHealth.uptime || 0) / 3600)}h {Math.floor(((systemHealth.uptime || 0) % 3600) / 60)}m
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">×</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
          <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-600">×</button>
        </div>
      )}

      {/* Architecture Diagram */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Architecture</h3>
        <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
          <div className="bg-white rounded-lg px-4 py-3 border shadow-sm text-center">
            <p className="font-bold text-blue-600">Bell24h-OS</p>
            <p className="text-xs text-gray-400">Your Platform</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className="bg-white rounded-lg px-4 py-3 border-2 border-purple-400 shadow-sm text-center">
            <p className="font-bold text-purple-600">AI Router</p>
            <p className="text-xs text-gray-400">Mode: {config?.mode || 'direct'}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className="flex flex-col gap-1">
            {['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Pollinations'].map(p => (
              <div key={p} className="bg-white rounded px-3 py-1 border text-xs font-medium">{p}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {([
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'health', label: 'Provider Health', icon: Activity },
          { id: 'routing', label: 'Failover Chain', icon: ArrowRight },
          { id: 'costs', label: 'Cost Analytics', icon: DollarSign },
          { id: 'settings', label: 'Router Settings', icon: Settings2 },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-5">
              <p className="text-sm text-gray-500">Routing Mode</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{config?.mode || 'direct'}</p>
              <p className="text-xs text-gray-400 mt-1">{config?.mode === '9router' ? 'Via 9Router gateway' : 'Direct provider connections'}</p>
            </div>
            <div className="bg-white rounded-xl border p-5">
              <p className="text-sm text-gray-500">Configured Providers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{systemHealth.configuredProviders || 0}</p>
              <p className="text-xs text-gray-400 mt-1">of {systemHealth.totalProviders || 0} available</p>
            </div>
            <div className="bg-white rounded-xl border p-5">
              <p className="text-sm text-gray-500">Healthy Providers</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{systemHealth.healthyProviders || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Passing health checks</p>
            </div>
            <div className="bg-white rounded-xl border p-5">
              <p className="text-sm text-gray-500">Total Spend</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${costs?.summary?.totalCost?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-400 mt-1">Potential savings: ${costs?.summary?.potentialSavings?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Provider Status Grid */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Provider Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {providers.map((p: any) => (
                <div key={p.id} className={`rounded-lg border p-4 ${p.health.status === 'healthy' ? 'border-green-200 bg-green-50/50' : p.health.status === 'degraded' ? 'border-yellow-200 bg-yellow-50/50' : p.health.status === 'down' ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{PROVIDER_ICONS[p.id] || '⚪'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.health.status]}`}>
                      {p.health.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{p.name || p.id}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    {p.configured ? <span className="text-green-500">✓ Configured</span> : <span className="text-gray-400">Not configured</span>}
                    {p.free && <span className="text-green-600 font-medium">FREE</span>}
                  </div>
                  {p.health.totalCalls > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span>{p.health.successRate}% success</span> · <span>{p.health.avgLatency}ms avg</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {costs?.recommendations?.length > 0 && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> Cost Optimization Recommendations
              </h3>
              <ul className="space-y-2">
                {costs.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Health Tab */}
      {tab === 'health' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold text-gray-900">Provider Health Monitor</h3>
              <p className="text-xs text-gray-400 mt-1">Click "Test" to run a live health check against each provider</p>
            </div>
            <div className="divide-y">
              {providers.map((p: any) => (
                <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                  <span className="text-xl">{PROVIDER_ICONS[p.id] || '⚪'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{p.name || p.id}</p>
                      {p.free && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">FREE</span>}
                      {p.hasApiKey && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">API KEY</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span>Priority: {p.priority === 99 ? '—' : p.priority}</span>
                      <span>Calls: {p.health.totalCalls}</span>
                      <span>Success: {p.health.successRate}%</span>
                      <span>Avg Latency: {p.health.avgLatency}ms</span>
                      {p.health.lastError && <span className="text-red-500 truncate max-w-[200px]">Error: {p.health.lastError}</span>}
                    </div>
                    {p.health.totalCalls > 0 && (
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden w-48">
                        <div className={`h-full rounded-full ${p.health.successRate > 90 ? 'bg-green-500' : p.health.successRate > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${p.health.successRate}%` }} />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[p.health.status]}`}>
                    {p.health.status}
                  </span>
                  <button onClick={() => testProvider(p.id)} disabled={testingProvider === p.id}
                    className="text-xs bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 font-medium disabled:opacity-50 flex items-center gap-1">
                    {testingProvider === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Routing Tab */}
      {tab === 'routing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Failover Chain</h3>
            <p className="text-sm text-gray-500 mb-4">When a provider fails, the router automatically tries the next provider in this chain. Drag to reorder priority.</p>
            <div className="space-y-2">
              {fallbackChain.map((provider, i) => (
                <div key={provider} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border">
                  <span className="text-lg font-bold text-gray-300 w-6">{i + 1}</span>
                  <span className="text-lg">{PROVIDER_ICONS[provider] || '⚪'}</span>
                  <span className="text-sm font-medium text-gray-900 flex-1 capitalize">{provider}</span>
                  {provider === 'pollinations' && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-600 rounded font-medium">FREE FALLBACK</span>}
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveFallback(i, i - 1)} disabled={i === 0}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 text-gray-400">
                      <ChevronDown className="w-4 h-4 rotate-180" />
                    </button>
                    <button onClick={() => moveFallback(i, i + 1)} disabled={i === fallbackChain.length - 1}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 text-gray-400">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Routing Logic</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Health-Aware</p>
                </div>
                <p className="text-xs text-blue-700">Providers marked as "down" (after 5+ failed calls) are automatically skipped.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-900">Cost-Optimized</p>
                </div>
                <p className="text-xs text-green-700">When enabled, prefers free providers (Pollinations) and cheapest options first.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Priority-Based</p>
                </div>
                <p className="text-xs text-purple-700">Respects your provider priority settings. Lower priority number = tried first.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Costs Tab */}
      {tab === 'costs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">Cost Analytics</h3>
            <select value={costPeriod} onChange={e => setCostPeriod(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
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
                  <p className="text-sm text-gray-500">Potential Savings</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">${costs.summary?.potentialSavings?.toFixed(4) || '0.00'}</p>
                  <p className="text-xs text-gray-400 mt-1">with smart routing</p>
                </div>
                <div className="bg-white rounded-xl border p-5">
                  <p className="text-sm text-gray-500">Active Providers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{costs.byProvider?.length || 0}</p>
                </div>
              </div>

              {costs.byProvider?.length > 0 && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="px-5 py-3 border-b">
                    <h4 className="font-medium text-gray-900">Cost by Provider</h4>
                  </div>
                  <div className="divide-y">
                    {costs.byProvider.map((p: any) => (
                      <div key={p.provider} className="px-5 py-3 flex items-center gap-4">
                        <span className="text-lg">{PROVIDER_ICONS[p.provider] || '⚪'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 capitalize">{p.provider}</p>
                          <p className="text-xs text-gray-400">{p.executions} executions · {p.tokens?.toLocaleString()} tokens · {p.avgLatency}ms avg</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.health]}`}>{p.health}</span>
                        <p className="text-sm font-medium text-gray-900 w-20 text-right">${p.cost?.toFixed(4)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Router Configuration</h3>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="text-sm bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Configure
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveConfig} className="text-sm bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => { setEditMode(false); loadData() }} className="text-sm bg-gray-100 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-200 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Routing Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Routing Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => editMode && setMode('direct')}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${mode === 'direct' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} ${!editMode ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Server className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-gray-900">Direct Mode</p>
                  </div>
                  <p className="text-xs text-gray-500">Connect directly to each AI provider. Full control, your API keys.</p>
                </button>
                <button onClick={() => editMode && setMode('9router')}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${mode === '9router' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'} ${!editMode ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Router className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-medium text-gray-900">9Router Mode</p>
                  </div>
                  <p className="text-xs text-gray-500">Route through 9Router gateway. Auto-fallback, cost optimization, 40+ providers.</p>
                </button>
              </div>
            </div>

            {/* 9Router Settings */}
            {mode === '9router' && (
              <div className="space-y-3 bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h4 className="text-sm font-medium text-purple-900">9Router Configuration</h4>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Router URL</label>
                  <input value={routerUrl} onChange={e => setRouterUrl(e.target.value)} disabled={!editMode}
                    placeholder="https://9router.com" className="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">API Key (optional)</label>
                  <input type="password" value={routerApiKey} onChange={e => setRouterApiKey(e.target.value)} disabled={!editMode}
                    placeholder="Optional — for premium routing" className="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-50" />
                </div>
              </div>
            )}

            {/* Optimization Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Optimization</h4>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Cost Optimization</p>
                  <p className="text-xs text-gray-400">Prefer cheaper providers when quality is comparable</p>
                </div>
                <button onClick={() => editMode && setCostOptimization(!costOptimization)}
                  className={`w-11 h-6 rounded-full transition-all ${costOptimization ? 'bg-blue-600' : 'bg-gray-300'} ${!editMode ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${costOptimization ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Prefer Free Providers</p>
                  <p className="text-xs text-gray-400">Always try free providers (like Pollinations) first</p>
                </div>
                <button onClick={() => editMode && setPreferFree(!preferFree)}
                  className={`w-11 h-6 rounded-full transition-all ${preferFree ? 'bg-green-600' : 'bg-gray-300'} ${!editMode ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${preferFree ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <label className="block text-sm font-medium text-gray-900 mb-1">Max Cost Per Generation ($)</label>
                <input type="number" step="0.01" value={maxCost} onChange={e => setMaxCost(e.target.value)} disabled={!editMode}
                  className="w-32 border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-xl border p-5">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400" /> How9Router Works
            </h4>
            <div className="text-xs text-gray-600 space-y-2">
              <p><strong>9Router</strong> is a free AI routing gateway that sits between your app and 40+ AI providers.</p>
              <p>• <strong>Direct mode:</strong> Your app connects directly to OpenAI, Anthropic, Google, etc. using your own API keys.</p>
              <p>• <strong>9Router mode:</strong> Your app talks to ONE endpoint, and 9Router handles routing, failover, and cost optimization.</p>
              <p>• Both modes use the same <strong>failover chain</strong> — if a provider fails, the next one in line is tried automatically.</p>
              <p>• <strong>Pollinations.ai</strong> is always available as a free fallback for image generation (no API key needed).</p>
              <p className="pt-2 border-t border-gray-200">
                <a href="https://github.com/decolua/9router" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Learn more about 9Router <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
