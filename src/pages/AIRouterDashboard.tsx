import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Shield, Zap, Activity, GitBranch, DollarSign, BarChart3, Settings2,
  AlertTriangle, CheckCircle, XCircle, RefreshCw, Search, Loader2,
  Workflow, Gauge, Server, ArrowRight, TrendingUp, TrendingDown,
  Clock, Cpu, Eye, Layers, Route, ToggleLeft, ToggleRight, ChevronDown,
  ChevronRight, Plus, Trash2, Edit2, X, Bell, Target, Globe, Lock,
  Wifi, WifiOff, ArrowUpDown, ChevronUp, Play, Pause, RotateCcw, Info
} from 'lucide-react'

type Tab = 'overview' | 'policies' | 'circuit' | 'capabilities' | 'workflows' | 'budgets' | 'telemetry' | 'benchmarks' | 'adapters'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || `Request failed (${res.status})`) }
  return res.json()
}

const STATUS_COLORS: Record<string, string> = {
  healthy: 'text-green-400 bg-green-500/10', degraded: 'text-yellow-400 bg-yellow-500/10',
  down: 'text-red-400 bg-red-500/10', unknown: 'text-gray-400 bg-gray-500/10',
  success: 'text-green-400 bg-green-500/10', error: 'text-red-400 bg-red-500/10',
  fallback: 'text-yellow-400 bg-yellow-500/10', circuit_broken: 'text-red-400 bg-red-500/10',
  routed: 'text-blue-400 bg-blue-500/10', timeout: 'text-orange-400 bg-orange-500/10',
  open: 'text-red-400 bg-red-500/10', closed: 'text-green-400 bg-green-500/10',
  half_open: 'text-yellow-400 bg-yellow-500/10',
}

const STRATEGY_ICONS: Record<string, string> = {
  fastest: '⚡', cheapest: '💰', highest_quality: '🏆', balanced: '⚖️',
  fallback_only: '🔄', cost_capped: '📉', quality_minimum: '✅', region_restricted: '🌍',
}

export function AIRouterDashboardPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Data states
  const [dashboard, setDashboard] = useState<any>(null)
  const [policies, setPolicies] = useState<any[]>([])
  const [breakers, setBreakers] = useState<any[]>([])
  const [capabilities, setCapabilities] = useState<any[]>([])
  const [workflows, setWorkflows] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [telemetry, setTelemetry] = useState<any[]>([])
  const [telemetrySummary, setTelemetrySummary] = useState<any>(null)
  const [benchmarks, setBenchmarks] = useState<any[]>([])
  const [benchmarkRankings, setBenchmarkRankings] = useState<any[]>([])
  const [adapters, setAdapters] = useState<any[]>([])
  const [routeResult, setRouteResult] = useState<any>(null)

  // Modal states
  const [showNewBudget, setShowNewBudget] = useState(false)
  const [budgetName, setBudgetName] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')
  const [budgetPeriod, setBudgetPeriod] = useState('monthly')
  const [testRouteWorkflow, setTestRouteWorkflow] = useState('chat')
  const [testRoutePolicy, setTestRoutePolicy] = useState('balanced')
  const [routingPolicy, setRoutingPolicy] = useState('balanced')
  const [testRouteProvider, setTestRouteProvider] = useState('')
  const [testingRoute, setTestingRoute] = useState(false)

  const showError = (msg: string) => { setError(msg); setTimeout(() => setError(''), 5000) }
  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const loadAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const [dashRes, polRes, cbRes, capRes, wfRes, budRes, telRes, telSumRes, bmRes, rankRes, adRes] = await Promise.all([
        api('/api/ai-router/dashboard', token),
        api('/api/ai-router/policies', token),
        api('/api/ai-router/circuit-breakers', token),
        api('/api/ai-router/capabilities', token),
        api('/api/ai-router/workflows', token),
        api('/api/ai-router/budgets', token),
        api('/api/ai-router/telemetry?limit=50', token),
        api('/api/ai-router/telemetry/summary?period=24h', token),
        api('/api/ai-router/benchmarks', token),
        api('/api/ai-router/benchmarks/rankings', token),
        api('/api/ai-router/adapters', token),
      ])
      if (dashRes.dashboard) setDashboard(dashRes.dashboard)
      if (polRes.policies) setPolicies(polRes.policies)
      if (cbRes.breakers) setBreakers(cbRes.breakers)
      if (capRes.capabilities) setCapabilities(capRes.capabilities)
      if (wfRes.workflows) setWorkflows(wfRes.workflows)
      if (budRes.budgets) setBudgets(budRes.budgets)
      if (telRes.telemetry) setTelemetry(telRes.telemetry)
      if (telSumRes.summary) setTelemetrySummary(telSumRes)
      if (bmRes.benchmarks) setBenchmarks(bmRes.benchmarks)
      if (rankRes.rankings) setBenchmarkRankings(rankRes.rankings)
      if (adRes.adapters) setAdapters(adRes.adapters)
    } catch (e: any) { showError(e.message) } finally { setLoading(false) }
  }, [token])

  useEffect(() => { loadAll() }, [loadAll])

  const testRoute = async () => {
    setTestingRoute(true); setRouteResult(null)
    try {
      const res = await api('/api/ai-router/route', token, {
        method: 'POST',
        body: JSON.stringify({ policy: testRoutePolicy, workflowType: testRouteWorkflow, preferredProvider: testRouteProvider || undefined })
      })
      setRouteResult(res)
      showSuccess(`Routed to ${res.selectedProvider} via ${res.strategy} policy`)
    } catch (e: any) { showError(e.message) } finally { setTestingRoute(false) }
  }

  const resetCircuitBreaker = async (provider: string) => {
    try { await api(`/api/ai-router/circuit-breakers/${provider}/reset`, token, { method: 'POST' }); showSuccess(`${provider} circuit breaker reset`); loadAll() } catch (e: any) { showError(e.message) }
  }

  const createBudget = async () => {
    if (!budgetName || !budgetAmount) { showError('Name and amount required'); return }
    try { await api('/api/ai-router/budgets', token, { method: 'POST', body: JSON.stringify({ name: budgetName, amount: parseFloat(budgetAmount), period: budgetPeriod }) }); showSuccess('Budget created'); setShowNewBudget(false); setBudgetName(''); setBudgetAmount(''); loadAll() } catch (e: any) { showError(e.message) }
  }

  const TabBtn = ({ id, icon: Icon, label, count }: { id: Tab; icon: any; label: string; count?: number }) => (
    <button onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <Icon className="w-4 h-4" /> {label}{count !== undefined && <span className="ml-1 px-1.5 py-0.5 bg-white/10 rounded text-xs">{count}</span>}
    </button>
  )

  if (loading) return <div className="min-h-[calc(100vh-4rem)] bg-gray-950 p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600"><Route className="w-6 h-6 text-white" /></div>
        <div><h1 className="text-2xl font-bold text-white">AI Router</h1><p className="text-sm text-gray-400">Enterprise routing engine — policies, circuit breakers, capabilities, budgets & observability</p></div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400"><AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}
      {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400"><CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}</div>}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <TabBtn id="overview" icon={BarChart3} label="Overview" />
        <TabBtn id="policies" icon={Shield} label="Policies" count={policies.length} />
        <TabBtn id="circuit" icon={Zap} label="Circuit Breakers" count={breakers.length} />
        <TabBtn id="capabilities" icon={Layers} label="Capabilities" count={capabilities.length} />
        <TabBtn id="workflows" icon={Workflow} label="Workflows" count={workflows.length} />
        <TabBtn id="budgets" icon={DollarSign} label="Budgets" count={budgets.length} />
        <TabBtn id="telemetry" icon={Activity} label="Telemetry" />
        <TabBtn id="benchmarks" icon={Gauge} label="Benchmarks" />
        <TabBtn id="adapters" icon={Server} label="Adapters" count={adapters.length} />
      </div>

      {/* ═══════ OVERVIEW ═══════ */}
      {tab === 'overview' && dashboard && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { l: 'Routing Policies', v: dashboard.routingPolicies, i: Shield, c: 'text-emerald-400' },
              { l: 'Healthy Breakers', v: dashboard.circuitBreakers?.closed || 0, i: CheckCircle, c: 'text-green-400' },
              { l: 'Open Breakers', v: dashboard.circuitBreakers?.open || 0, i: AlertTriangle, c: dashboard.circuitBreakers?.open > 0 ? 'text-red-400' : 'text-gray-400' },
              { l: 'Requests (24h)', v: dashboard.telemetry24h?.requests || 0, i: Activity, c: 'text-blue-400' },
              { l: 'Success Rate', v: `${dashboard.telemetry24h?.successRate || 0}%`, i: TrendingUp, c: 'text-green-400' },
              { l: 'Cost (24h)', v: `$${(dashboard.telemetry24h?.cost || 0).toFixed(4)}`, i: DollarSign, c: 'text-yellow-400' },
            ].map(s => (
              <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1"><s.i className="w-4 h-4" /> {s.l}</div>
                <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Route Tester */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Route className="w-5 h-5 text-emerald-400" /> Route Tester</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Policy</label>
                <select value={testRoutePolicy} onChange={e => setTestRoutePolicy(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                  {policies.map(p => <option key={p.id} value={p.slug}>{STRATEGY_ICONS[p.strategy] || '📋'} {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Workflow</label>
                <select value={testRouteWorkflow} onChange={e => setTestRouteWorkflow(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                  {workflows.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Preferred Provider</label>
                <select value={testRouteProvider} onChange={e => setTestRouteProvider(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="">Auto-select</option>
                  {['openai', 'anthropic', 'google', 'deepseek', 'mistral', 'pollinations', 'xai', 'flux', 'stability'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button onClick={testRoute} disabled={testingRoute} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 rounded-lg text-sm font-medium text-white">
              {testingRoute ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} {testingRoute ? 'Routing...' : 'Test Route'}
            </button>
            {routeResult && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: 'Selected Provider', v: routeResult.selectedProvider, c: 'text-emerald-400' },
                    { l: 'Strategy', v: routeResult.strategy, c: 'text-blue-400' },
                    { l: 'Circuit State', v: routeResult.circuitBreakerState, c: STATUS_COLORS[routeResult.circuitBreakerState] || 'text-gray-400' },
                    { l: 'Budget Blocked', v: routeResult.budgetBlocked ? 'Yes' : 'No', c: routeResult.budgetBlocked ? 'text-red-400' : 'text-green-400' },
                  ].map(s => <div key={s.l}><div className="text-xs text-gray-500">{s.l}</div><div className={`text-sm font-bold ${s.c}`}>{s.v}</div></div>)}
                </div>
                {routeResult.fallbackChain?.length > 0 && (
                  <div className="mt-3"><div className="text-xs text-gray-500 mb-1">Fallback Chain</div><div className="flex gap-2">{routeResult.fallbackChain.map((p: string, i: number) => (<span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{p}</span>))}</div></div>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          {dashboard.recentActivity?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Routing Activity</h3>
              <div className="space-y-2">
                {dashboard.recentActivity.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[t.status] || 'text-gray-400 bg-gray-800'}`}>{t.status}</span>
                      <span className="text-sm text-white">{t.actualProvider}</span>
                      <span className="text-xs text-gray-500">{t.workflowType || 'chat'}</span>
                    </div>
                    <div className="text-xs text-gray-500">{t.latencyMs}ms · ${t.costUsd.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ POLICIES ═══════ */}
      {tab === 'policies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {policies.map(p => (
              <div key={p.id} className={`bg-gray-900 border rounded-xl p-4 ${p.isActive ? 'border-gray-800' : 'border-gray-800 opacity-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{STRATEGY_ICONS[p.strategy] || '📋'}</span>
                      <h3 className="text-sm font-bold text-white">{p.name}</h3>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{p.type} · {p.strategy}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${p.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                {p.description && <p className="text-xs text-gray-400 mb-3">{p.description}</p>}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Priority: {p.priority}</span>
                  <span>ID: {p.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ CIRCUIT BREAKERS ═══════ */}
      {tab === 'circuit' && (
        <div className="space-y-4">
          {breakers.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
              <Shield className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No circuit breakers yet — they'll be created automatically when providers fail</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {breakers.map(cb => (
                <div key={cb.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white capitalize">{cb.provider}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[cb.state] || ''}`}>{cb.state}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Failures</span><span className="text-white">{cb.failureCount} / {cb.failureThreshold}</span></div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (cb.failureCount / cb.failureThreshold) * 100)}%`, backgroundColor: cb.state === 'open' ? '#ef4444' : cb.state === 'half_open' ? '#eab308' : '#22c55e' }} /></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total Trips</span><span className="text-white">{cb.totalTrips}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Recovery Timeout</span><span className="text-white">{cb.recoveryTimeoutMs / 1000}s</span></div>
                    {cb.lastFailureAt && <div className="flex justify-between"><span className="text-gray-500">Last Failure</span><span className="text-gray-400">{new Date(cb.lastFailureAt).toLocaleString()}</span></div>}
                  </div>
                  <button onClick={() => resetCircuitBreaker(cb.provider)} className="mt-3 w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300"><RotateCcw className="w-3 h-3" /> Reset</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════ CAPABILITIES ═══════ */}
      {tab === 'capabilities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map(cap => (
              <div key={cap.capability} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">{cap.name}</h3>
                  <span className="text-xs text-gray-500">{cap.configuredProviders}/{cap.totalProviders} providers</span>
                </div>
                <div className="space-y-2">
                  {cap.providers.map((p: any) => (
                    <div key={p.provider} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.configured ? 'bg-green-400' : 'bg-gray-600'}`} />
                        <span className="text-sm text-white capitalize">{p.provider}</span>
                      </div>
                      <span className="text-xs text-gray-500">{p.models.length} models</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ WORKFLOWS ═══════ */}
      {tab === 'workflows' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map(w => (
              <div key={w.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white capitalize mb-2">{w.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{w.description}</p>
                <div className="mb-2"><div className="text-xs text-gray-500 mb-1">Required Capabilities</div><div className="flex flex-wrap gap-1">{w.requiredCapabilities.map((c: string) => <span key={c} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">{c}</span>)}</div></div>
                <div className="mb-2"><div className="text-xs text-gray-500 mb-1">Preferred Providers</div><div className="flex flex-wrap gap-1">{w.preferredProviders.map((p: string) => <span key={p} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">{p}</span>)}</div></div>
                <div><div className="text-xs text-gray-500 mb-1">Fallbacks</div><div className="flex flex-wrap gap-1">{w.fallbacks.map((p: string) => <span key={p} className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">{p}</span>)}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ BUDGETS ═══════ */}
      {tab === 'budgets' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={() => setShowNewBudget(true)} className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> New Budget</button></div>
          {budgets.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800"><DollarSign className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No budgets configured</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map(b => (
                <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-white">{b.name}</h3><span className={`px-2 py-0.5 rounded text-xs ${b.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>{b.isActive ? 'Active' : 'Inactive'}</span></div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="text-white">${b.amount.toFixed(2)} / {b.period}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Spent</span><span className="text-yellow-400">${b.spent.toFixed(4)}</span></div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="h-full bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full" style={{ width: `${Math.min(100, b.amount > 0 ? (b.spent / b.amount) * 100 : 0)}%` }} /></div>
                    <div className="flex justify-between"><span className="text-gray-500">Alert at</span><span className="text-white">{Math.round(b.alertThreshold * 100)}%</span></div>
                    {b.provider && <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="text-white">{b.provider}</span></div>}
                    {b.hardLimit && <div className="text-red-400 text-xs">⛔ Hard limit — will block requests when exceeded</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {showNewBudget && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowNewBudget(false)}>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Create Budget</h3>
                <input value={budgetName} onChange={e => setBudgetName(e.target.value)} placeholder="Budget name" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white mb-3" />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="number" value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} placeholder="Amount ($)" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                  <select value={budgetPeriod} onChange={e => setBudgetPeriod(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                    {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2"><button onClick={() => setShowNewBudget(false)} className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300">Cancel</button><button onClick={createBudget} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white">Create</button></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ TELEMETRY ═══════ */}
      {tab === 'telemetry' && telemetrySummary && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: 'Total Requests', v: telemetrySummary.summary?.totalRequests || 0, c: 'text-white' },
              { l: 'Success Rate', v: `${telemetrySummary.summary?.successRate || 0}%`, c: 'text-green-400' },
              { l: 'Avg Latency', v: `${telemetrySummary.summary?.avgLatency || 0}ms`, c: 'text-blue-400' },
              { l: 'Total Cost', v: `$${(telemetrySummary.summary?.totalCost || 0).toFixed(4)}`, c: 'text-yellow-400' },
            ].map(s => (
              <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4"><div className="text-xs text-gray-500 mb-1">{s.l}</div><div className={`text-2xl font-bold ${s.c}`}>{s.v}</div></div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {telemetrySummary.byProvider?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">By Provider</h3>
                {telemetrySummary.byProvider.map((p: any) => (
                  <div key={p.provider} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg mb-2">
                    <span className="text-sm text-white capitalize">{p.provider}</span>
                    <div className="flex gap-4 text-xs"><span className="text-gray-400">{p.count} reqs</span><span className="text-blue-400">{p.avgLatency}ms</span><span className="text-green-400">${p.cost.toFixed(4)}</span></div>
                  </div>
                ))}
              </div>
            )}
            {telemetrySummary.byStatus?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">By Status</h3>
                {telemetrySummary.byStatus.map((s: any) => (
                  <div key={s.status} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[s.status] || ''}`}>{s.status}</span>
                    <div className="flex gap-4 text-xs"><span className="text-white">{s.count} requests</span><span className="text-yellow-400">${s.cost.toFixed(4)}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {telemetry.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Telemetry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-gray-500 text-left border-b border-gray-800"><th className="pb-2 font-medium">Time</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Provider</th><th className="pb-2 font-medium">Workflow</th><th className="pb-2 font-medium text-right">Latency</th><th className="pb-2 font-medium text-right">Cost</th><th className="pb-2 font-medium">Request ID</th></tr></thead>
                  <tbody>{telemetry.slice(0, 20).map(t => (
                    <tr key={t.id} className="border-b border-gray-800/50">
                      <td className="py-2 text-gray-400">{new Date(t.createdAt).toLocaleTimeString()}</td>
                      <td className="py-2"><span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[t.status] || ''}`}>{t.status}</span></td>
                      <td className="py-2 text-white capitalize">{t.actualProvider}</td>
                      <td className="py-2 text-gray-400">{t.workflowType || '-'}</td>
                      <td className="py-2 text-blue-400 text-right">{t.latencyMs}ms</td>
                      <td className="py-2 text-green-400 text-right">${t.costUsd.toFixed(4)}</td>
                      <td className="py-2 text-gray-600 text-xs font-mono">{t.requestId?.substring(0, 12)}...</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ BENCHMARKS ═══════ */}
      {tab === 'benchmarks' && (
        <div className="space-y-4">
          {benchmarkRankings.length > 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Provider Rankings (Composite Score)</h3>
              <div className="space-y-2">
                {benchmarkRankings.map((r: any) => (
                  <div key={`${r.provider}/${r.modelId}`} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                    <span className="text-lg font-bold text-emerald-400 w-8">#{r.rank}</span>
                    <div className="flex-1"><div className="text-sm font-medium text-white">{r.provider} / {r.modelId}</div></div>
                    <div className="grid grid-cols-4 gap-4 text-xs text-center">
                      <div><div className="text-gray-500">Quality</div><div className="text-white">{r.qualityScore}</div></div>
                      <div><div className="text-gray-500">Latency</div><div className="text-blue-400">{r.latencyMs}ms</div></div>
                      <div><div className="text-gray-500">Cost</div><div className="text-green-400">${r.costPer1k}</div></div>
                      <div><div className="text-gray-500">Composite</div><div className="text-emerald-400 font-bold">{r.compositeScore}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800"><Gauge className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No benchmark data yet — benchmarks are recorded as requests flow through the router</p></div>
          )}
        </div>
      )}

      {/* ═══════ ADAPTERS ═══════ */}
      {tab === 'adapters' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adapters.map((a: any) => {
              const caps = a.capabilities ? JSON.parse(a.capabilities) : []
              return (
                <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div><h3 className="text-sm font-bold text-white">{a.name}</h3><span className="text-xs text-gray-500">{a.slug}</span></div>
                    <span className={`px-2 py-0.5 rounded text-xs ${a.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>{a.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  {a.baseUrl && <div className="text-xs text-gray-500 mb-2 truncate">🌐 {a.baseUrl}</div>}
                  <div className="flex items-center gap-2 mb-3 text-xs"><span className="text-gray-500">Auth:</span><span className="text-white">{a.authType}</span><span className="text-gray-500">·</span><span className="text-gray-500">Type:</span><span className="text-white">{a.adapterType}</span></div>
                  {caps.length > 0 && <div className="flex flex-wrap gap-1">{caps.map((c: string) => <span key={c} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">{c}</span>)}</div>}
                  {a.version && <div className="mt-2 text-xs text-gray-600">v{a.version}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
