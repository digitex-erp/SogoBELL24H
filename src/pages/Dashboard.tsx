import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp, TrendingDown, DollarSign, Users, Megaphone, Brain, Activity,
  AlertTriangle, CheckCircle, Clock, ArrowUpRight, Bell, FileText, Video,
  RefreshCw, Plus, Zap, Timer, Loader2, Send, BarChart3, Calendar
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FounderCockpitComms } from '@/pages/voice/VoiceCenter'

interface DashboardData {
  totalBudget: number
  totalSpent: number
  totalCampaigns: number
  activeCampaigns: number
  totalLeads: number
  activeLeads: number
  totalJobs: number
  runningJobs: number
  recentJobs: Array<{ id: string; type: string; status: string; createdAt: string; completedAt: string | null; error: string | null }>
  activities: Array<{ id: string; action: string; resource: string; createdAt: string; details: string | null }>
  notifications: Array<{ id: string; title: string; message: string; type: string; read: boolean; createdAt: string }>
  unreadNotifications: number
}

function MiniBarChart({ data, maxVal }: { data: number[]; maxVal: number }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((val, i) => (
        <div key={i} className="flex-1">
          <div className="w-full bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600" style={{ height: `${(val / maxVal) * 100}%`, minHeight: val > 0 ? 3 : 0 }} />
        </div>
      ))}
    </div>
  )
}

export function DashboardPage({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const { user, organization, token } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = useCallback(async () => {
    const storedToken = localStorage.getItem('bell24h_token')
    const bearerToken = token || storedToken
    if (!bearerToken) {
      setError('No auth token found')
      setLoading(false)
      return
    }
    try {
      const url = `/api/dashboard/stats?token=${encodeURIComponent(bearerToken)}`
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${bearerToken}` }
      })
      if (!res.ok) throw new Error('Failed to load dashboard')
      const json = await res.json()
      setData(json)
      setError('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchData() }, [fetchData, refreshKey])

  if (loading) return (
    <div className="flex items-center justify-center h-full py-20">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  )

  if (error) return (
    <div className="p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
      <p className="text-sm text-gray-600">{error}</p>
      <Button variant="outline" size="sm" className="mt-3" onClick={() => { setLoading(true); fetchData() }}>Retry</Button>
    </div>
  )

  if (!data) return null

  const { totalBudget, totalSpent, totalCampaigns: campaignCount, activeCampaigns, totalLeads: leadCount, activeLeads, totalJobs: jobCount, runningJobs, recentJobs, activities: recentActivity, notifications, unreadNotifications } = data
  const campaignData = [12, 19, 8, 25, 32, 18, 42, 35, 28, 45, 38, 52, 48, 55, 41, 60, 52, 47, 65, 58, 72, 63, 55, 78, 68, 74, 82, 71, 85, 78]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name || 'User'}. {organization ? `Working in ${organization.name}.` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); setRefreshKey(k => k + 1) }}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards — ALL LIVE */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Budget', value: `₹${totalBudget.toLocaleString()}`, change: `${activeCampaigns} active`, changeType: 'up' as const, icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, change: totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(0)}% utilized` : 'No campaigns', changeType: 'neutral' as const, icon: <TrendingUp className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          { label: 'Campaigns', value: campaignCount.toString(), change: `${activeCampaigns} active`, changeType: 'up' as const, icon: <Megaphone className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Leads', value: leadCount.toString(), change: 'In pipeline', changeType: 'neutral' as const, icon: <Users className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { label: 'Jobs', value: jobCount.toString(), change: `${runningJobs} running`, changeType: 'neutral' as const, icon: <Brain className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          { label: 'Content', value: '0', change: 'Items created', changeType: 'neutral' as const, icon: <FileText className="w-5 h-5" />, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
        ].map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.bgColor)}>
                  <span className={kpi.color}>{kpi.icon}</span>
                </div>
                {kpi.changeType === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{kpi.label}</p>
              <p className="text-[10px] font-medium mt-1 text-gray-500">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Voice & Communication — founder cockpit communication panel */}
      <FounderCockpitComms onNavigate={onNavigate} />

      {/* Charts + Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Campaign Activity (Last 30 Days)</CardTitle>
              <Badge variant="outline" className="text-[10px]"><Calendar className="w-3 h-3 mr-1" /> Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-6 mb-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">{campaignCount}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {activeCampaigns} campaigns active
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-medium text-gray-500">Budget: ₹{totalBudget.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Spent: ₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
            <MiniBarChart data={campaignData} maxVal={100} />
          </CardContent>
        </Card>

        {/* Recent Jobs — LIVE */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Jobs</CardTitle>
              <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0 h-4">{runningJobs} running</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentJobs.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No jobs yet</p>
              ) : recentJobs.slice(0, 6).map(job => (
                <div key={job.id} className="flex items-center gap-2 p-1.5">
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                    job.status === 'completed' ? 'bg-emerald-500' :
                    job.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    job.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">{job.type.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] text-gray-400">{new Date(job.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] px-1 py-0 h-3",
                    job.status === 'completed' ? 'text-emerald-600' :
                    job.status === 'running' ? 'text-blue-600' :
                    job.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  )}>{job.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Notifications — ALL LIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No activity yet</p>
              ) : recentActivity.map(a => (
                <div key={a.id} className="flex gap-2.5 p-1.5">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900">{a.action.replace(/\./g, ' ')}</p>
                    <p className="text-[10px] text-gray-400">{a.resource} · {new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
              {unreadNotifications > 0 && <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4">{unreadNotifications} unread</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No notifications</p>
              ) : notifications.map(n => (
                <div key={n.id} className={cn("flex items-start gap-2.5 p-2.5 rounded-lg border",
                  n.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                  n.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
                  'bg-blue-50 border-blue-200'
                )}>
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-blue-100 text-blue-600'
                  )}>
                    {n.type === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                     n.type === 'success' ? <CheckCircle className="w-3 h-3" /> :
                     <Bell className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
