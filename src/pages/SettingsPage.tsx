import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiCall } from '@/hooks/useFetch'
import {
  Settings, Save, Loader2, Key, Globe, Link2, Shield, Bell, Palette,
  Database, Webhook, CheckCircle, AlertCircle, X, Plus, Trash2, Eye, EyeOff, Copy, RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/cn'

const api = async (url: string, token: string, opts?: RequestInit) => {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetch(`${url}${sep}token=${token}`, { ...opts, headers: { 'Content-Type': 'application/json', ...opts?.headers } })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

const INTEGRATION_ICONS: Record<string, string> = {
  'google-analytics': '📊', 'facebook-business': '📘', 'linkedin-sales': '💼',
  'whatsapp-business': '💬', 'razorpay': '💳', 'mailchimp': '📧',
  'google': '🔵', 'facebook': '📘', 'linkedin': '💼', 'twitter': '🐦',
  'shopify': '🛒', 'slack': '💬', 'github': '🐙',
}

const STATUS_COLORS: Record<string, string> = {
  connected: 'bg-emerald-100 text-emerald-700',
  disconnected: 'bg-gray-100 text-gray-600',
  error: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

export function SettingsPage() {
  const { user, organization, updateProfile, refreshUser } = useAuth()
  const [tab, setTab] = useState<'profile' | 'org' | 'integrations' | 'api-keys' | 'notifications' | 'security'>('profile')
  const [name, setName] = useState(user?.name || '')
  const [orgName, setOrgName] = useState(organization?.name || '')
  const [timezone, setTimezone] = useState(organization?.timezone || 'Asia/Kolkata')
  const [currency, setCurrency] = useState(organization?.currency || 'INR')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const { token } = useAuth()

  // Integrations
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loadingInt, setLoadingInt] = useState(true)

  // API Keys
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loadingKeys, setLoadingKeys] = useState(true)
  const [showNewKey, setShowNewKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyValue, setNewKeyValue] = useState('')
  const [showKeyValue, setShowKeyValue] = useState<string | null>(null)

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([])
  const [notiPrefs, setNotiPrefs] = useState({ email: true, push: true, sms: false, campaignAlerts: true, leadAlerts: true, systemAlerts: true })

  const loadIntegrations = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/integrations', token); setIntegrations(r.items || r.integrations || []) } catch { }
    setLoadingInt(false)
  }, [token])

  const loadKeys = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/providers', token); setApiKeys(r.providers || []) } catch { }
    setLoadingKeys(false)
  }, [token])

  const loadNotifications = useCallback(async () => {
    if (!token) return
    try { const r = await api('/api/ai/notifications', token); setNotifications(r.notifications || []) } catch { }
  }, [token])

  useEffect(() => { loadIntegrations(); loadKeys(); loadNotifications() }, [loadIntegrations, loadKeys, loadNotifications])

  const saveProfile = async () => {
    setSaving(true); setMsg('')
    try {
      await updateProfile({ name })
      if (organization?.id) { await apiCall(`/organizations/${organization.id}`, { method: 'PATCH', body: JSON.stringify({ name: orgName, timezone, currency }) }) }
      await refreshUser()
      setMsg('Settings saved successfully!')
    } catch (e: any) { setMsg(e.message || 'Error saving') }
    setSaving(false)
  }

  const toggleIntegration = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'connected' ? 'disconnected' : 'connected'
    try { await api(`/api/integrations/${id}`, token, { method: 'PATCH', body: JSON.stringify({ status: next }) }); loadIntegrations() } catch (e: any) { setError(e.message) }
  }

  const deleteIntegration = async (id: string) => {
    if (!confirm('Remove this integration?')) return
    try { await api(`/api/integrations/${id}`, token, { method: 'DELETE' }); loadIntegrations() } catch (e: any) { setError(e.message) }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm('Delete this API key?')) return
    try { await api(`/api/providers/${id}`, token, { method: 'DELETE' }); loadKeys() } catch (e: any) { setError(e.message) }
  }

  const unreadCount = notifications.filter((n: any) => !n.read).length

  const TabBtn = ({ id, label, icon: Icon, badge }: { id: string; label: string; icon: any; badge?: number }) => (
    <button onClick={() => setTab(id as any)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative", tab === id ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')}>
      <Icon className="w-3.5 h-3.5" /> {label}
      {badge ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">{badge}</span> : null}
    </button>
  )

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><Settings className="w-5 h-5 text-gray-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Settings & Integrations</h1><p className="text-sm text-gray-500">Profile, organization, integrations, and preferences</p></div>
      </div>

      {msg && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {msg}</div>}
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}<button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}

      <div className="flex gap-1 overflow-x-auto pb-2">
        <TabBtn id="profile" label="Profile" icon={Settings} />
        <TabBtn id="org" label="Organization" icon={Shield} />
        <TabBtn id="integrations" label="Integrations" icon={Link2} badge={integrations.filter((i: any) => i.status === 'connected').length} />
        <TabBtn id="api-keys" label="API Keys" icon={Key} badge={apiKeys.length} />
        <TabBtn id="notifications" label="Notifications" icon={Bell} badge={unreadCount} />
        <TabBtn id="security" label="Security" icon={Shield} />
      </div>

      {/* Profile */}
      {tab === 'profile' && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Profile Settings</h3>
          <div><label className="text-xs font-medium text-gray-700 block mb-1">Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:border-emerald-500 focus:outline-none" /></div>
          <div><label className="text-xs font-medium text-gray-700 block mb-1">Email</label><input value={user?.email || ''} disabled className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 text-gray-500" /></div>
          <div><label className="text-xs font-medium text-gray-700 block mb-1">Role</label><span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{user?.role?.replace(/_/g, ' ')}</span></div>
          <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile</button>
        </div>
      )}

      {/* Organization */}
      {tab === 'org' && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Organization Settings</h3>
          <div><label className="text-xs font-medium text-gray-700 block mb-1">Organization Name</label><input value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Timezone</label><select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">{['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Currency</label><select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">{['INR', 'USD', 'EUR', 'GBP', 'AED', 'JPY'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Organization</button>
        </div>
      )}

      {/* Integrations */}
      {tab === 'integrations' && (
        <div className="space-y-3">
          {loadingInt ? <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></div> : (
            integrations.map((i: any) => (
              <div key={i.id} className="bg-white border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">{INTEGRATION_ICONS[i.slug] || '🔗'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-gray-900">{i.name}</h3><span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium capitalize", STATUS_COLORS[i.status] || STATUS_COLORS.disconnected)}>{i.status}</span></div>
                  <p className="text-xs text-gray-500">{i.description}</p>
                  {i.lastSyncAt && <p className="text-[10px] text-gray-400 mt-0.5">Last synced: {new Date(i.lastSyncAt).toLocaleString()}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleIntegration(i.id, i.status)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", i.status === 'connected' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700')}>{i.status === 'connected' ? 'Disconnect' : 'Connect'}</button>
                  <button onClick={() => deleteIntegration(i.id)} className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                </div>
              </div>
            ))
          )}
          {integrations.length === 0 && !loadingInt && <div className="text-center py-12 bg-white border rounded-xl"><Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No integrations configured</p></div>}
        </div>
      )}

      {/* API Keys */}
      {tab === 'api-keys' && (
        <div className="space-y-3">
          <div className="flex justify-end"><button onClick={() => setShowNewKey(!showNewKey)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white"><Plus className="w-4 h-4" /> Add API Key</button></div>
          {loadingKeys ? <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></div> : (
            apiKeys.map((k: any) => (
              <div key={k.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Key className="w-5 h-5 text-blue-600" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-gray-900 capitalize">{k.provider}</h3>{k.isEnabled ? <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Active</span> : <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">Disabled</span>}</div>
                  <p className="text-xs text-gray-500">Model: {k.model || 'auto'} · Priority: {k.priority || 1} · Added: {new Date(k.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => deleteApiKey(k.id)} className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
              </div>
            ))
          )}
          {apiKeys.length === 0 && !loadingKeys && <div className="text-center py-12 bg-white border rounded-xl"><Key className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No API keys configured</p><p className="text-xs text-gray-400">Add provider keys from the Provider Manager</p></div>}
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Notification Preferences</h3>
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Text message alerts for critical events' },
              { key: 'campaignAlerts', label: 'Campaign Alerts', desc: 'Budget and performance alerts' },
              { key: 'leadAlerts', label: 'Lead Alerts', desc: 'New lead and activity notifications' },
              { key: 'systemAlerts', label: 'System Alerts', desc: 'Service health and system updates' },
            ].map(p => (
              <div key={p.key} className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-gray-900">{p.label}</p><p className="text-xs text-gray-500">{p.desc}</p></div>
                <button onClick={() => setNotiPrefs(n => ({ ...n, [p.key]: !n[p.key as keyof typeof n] }))} className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", notiPrefs[p.key as keyof typeof notiPrefs] ? 'bg-emerald-500' : 'bg-gray-300')}>
                  <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform", notiPrefs[p.key as keyof typeof notiPrefs] ? 'translate-x-4 ml-1' : 'translate-x-0.5')} />
                </button>
              </div>
            ))}
          </div>
          {notifications.length > 0 && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Notifications</h3>
              <div className="space-y-2">
                {notifications.slice(0, 10).map((n: any) => (
                  <div key={n.id} className={cn("flex items-center gap-3 p-2 rounded-lg", n.read ? 'bg-gray-50' : 'bg-blue-50')}>
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", n.read ? 'bg-gray-300' : 'bg-blue-500')} />
                    <div className="flex-1"><p className="text-xs font-medium text-gray-900">{n.title}</p><p className="text-[10px] text-gray-500">{n.message}</p></div>
                    <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security */}
      {tab === 'security' && (
        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Security Settings</h3>
            <div className="flex items-center justify-between py-3 border-b">
              <div><p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add an extra layer of security to your account</p></div>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Not enabled</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div><p className="text-sm font-medium text-gray-900">Session Timeout</p><p className="text-xs text-gray-500">Auto logout after inactivity</p></div>
              <span className="text-xs text-gray-600">30 minutes</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div><p className="text-sm font-medium text-gray-900">Password</p><p className="text-xs text-gray-500">Last changed: Never</p></div>
              <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700">Change Password</button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div><p className="text-sm font-medium text-gray-900">Login History</p><p className="text-xs text-gray-500">View recent login activity</p></div>
              <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700">View Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
