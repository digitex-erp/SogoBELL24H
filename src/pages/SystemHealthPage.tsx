import { useAuth } from '@/contexts/AuthContext'
import { Gauge, Server, Database, Activity, CheckCircle, AlertTriangle, XCircle, Cpu, Clock, RefreshCw, HardDrive, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

interface ServiceHealth { name: string; status: string; latencyMs: number }
interface HealthData { services: ServiceHealth[]; uptime: number; memory: { heapUsed: number; heapTotal: number; rss: number }; timestamp: string }

export function SystemHealthPage() {
  const { token } = useAuth()
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState(new Date())

  const fetchHealth = async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/p1/health/detailed?token=${token}`)
      const data = await res.json()
      setHealth(data)
      setLastCheck(new Date())
    } catch { setHealth(null) }
    setLoading(false)
  }

  useEffect(() => { fetchHealth() }, [token])
  useEffect(() => { const t = setInterval(fetchHealth, 30000); return () => clearInterval(t) }, [token])

  const services = health?.services || [
    { name: 'API Server', status: 'unknown', latencyMs: 0 },
    { name: 'Database', status: 'unknown', latencyMs: 0 },
    { name: 'Auth Service', status: 'unknown', latencyMs: 0 },
  ]

  const statusIcon = (s: string) => s === 'healthy' ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : s === 'degraded' ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <XCircle className="w-3 h-3 text-red-500" />
  const statusColor = (s: string) => s === 'healthy' ? 'bg-emerald-50 text-emerald-600' : s === 'degraded' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
  const statusLabel = (s: string) => s === 'healthy' ? 'text-emerald-600' : s === 'degraded' ? 'text-amber-600' : 'text-red-600'

  const allHealthy = services.every(s => s.status === 'healthy')
  const memUsed = health ? (health.memory.heapUsed / 1024 / 1024).toFixed(0) : '—'
  const memTotal = health ? (health.memory.heapTotal / 1024 / 1024).toFixed(0) : '—'
  const uptimeH = health ? (health.uptime / 3600).toFixed(1) : '—'

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><Gauge className="w-5 h-5 text-green-600" /></div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">System Health</h1>
          <p className="text-sm text-gray-500">Last checked: {lastCheck.toLocaleTimeString()}</p>
        </div>
        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium", allHealthy ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
          {allHealthy ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {allHealthy ? 'All Systems Operational' : 'Issues Detected'}
        </div>
        <button onClick={() => { setLoading(true); fetchHealth() }} className="flex items-center gap-1 px-3 py-1.5 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => (
          <div key={s.name} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", statusColor(s.status))}>
                {s.name.includes('API') ? <Server className="w-4 h-4" /> : s.name.includes('Data') ? <Database className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {statusIcon(s.status)}
                  <span className={cn("text-xs capitalize", statusLabel(s.status))}>{s.status}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">Response: <span className="font-mono">{s.latencyMs > 0 ? `${s.latencyMs}ms` : '—'}</span></div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">System Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Uptime', value: `${uptimeH}h`, icon: <Clock className="w-4 h-4" />, color: 'text-blue-600' },
            { label: 'Heap Used', value: `${memUsed}MB`, icon: <HardDrive className="w-4 h-4" />, color: 'text-purple-600' },
            { label: 'Heap Total', value: `${memTotal}MB`, icon: <Server className="w-4 h-4" />, color: 'text-emerald-600' },
            { label: 'DB Latency', value: `${services.find(s => s.name === 'Database')?.latencyMs || 0}ms`, icon: <Zap className="w-4 h-4" />, color: 'text-amber-600' },
          ].map(m => (
            <div key={m.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className={cn("flex items-center justify-center gap-1 mb-1", m.color)}>{m.icon}<span className={cn("text-2xl font-bold", m.color)}>{m.value}</span></div>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
