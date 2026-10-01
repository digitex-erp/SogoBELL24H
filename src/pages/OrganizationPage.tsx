import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Building2, Users, Settings, Globe, Clock, DollarSign, Palette, Mail,
  Plus, Trash2, Edit, Loader2, CheckCircle, AlertTriangle, UserPlus, Shield
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function OrganizationPage() {
  const { organization, user, refreshUser } = useAuth()
  const [org, setOrg] = useState(organization)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(organization?.name || '')
  const [timezone, setTimezone] = useState(organization?.timezone || 'Asia/Kolkata')
  const [currency, setCurrency] = useState(organization?.currency || 'INR')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const fetchMembers = useCallback(async () => {
    if (!organization) return
    try {
      const res = await fetch(`/api/organizations/${organization.id}/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` }
      })
      const data = await res.json()
      setMembers(data.members || [])
    } catch {} finally { setLoading(false) }
  }, [organization])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const handleSave = async () => {
    if (!organization) return
    setSaving(true)
    try {
      await fetch(`/api/organizations/${organization.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` },
        body: JSON.stringify({ name, timezone, currency })
      })
      await refreshUser()
      setSuccess('Organization updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch {}
    setSaving(false)
  }

  const handleInvite = async () => {
    if (!organization || !inviteEmail) return
    setInviteLoading(true)
    try {
      await fetch(`/api/organizations/${organization.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      })
      setShowInvite(false)
      setInviteEmail('')
      fetchMembers()
    } catch {}
    setInviteLoading(false)
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!organization || !confirm('Remove this member?')) return
    await fetch(`/api/organizations/${organization.id}/members/${memberId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('bell24h_token')}` }
    })
    fetchMembers()
  }

  if (!organization) return (
    <div className="p-6 text-center">
      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-base font-semibold text-gray-900">No organization</h3>
      <p className="text-sm text-gray-500">Create an organization to get started.</p>
    </div>
  )

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{organization.name}</h1>
          <p className="text-xs text-gray-500">Organization Settings</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-emerald-500" /><p className="text-xs text-emerald-700">{success}</p>
        </div>
      )}

      {/* Settings */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> General Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label className="text-xs">Organization Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs"><Clock className="w-3 h-3 inline mr-1" /> Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Asia/Shanghai">Asia/Shanghai (CST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs"><DollarSign className="w-3 h-3 inline mr-1" /> Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR — Indian Rupee</SelectItem>
                  <SelectItem value="USD">$ USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">€ EUR — Euro</SelectItem>
                  <SelectItem value="AED">د.إ AED — UAE Dirham</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />} Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" /> Team Members ({members.length})</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowInvite(true)}><UserPlus className="w-3.5 h-3.5 mr-1" /> Invite</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
          ) : (
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {(m.user?.name || m.user?.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{m.user?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-gray-400">{m.user?.email}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    <Shield className="w-3 h-3 mr-1" /> {m.role.replace('_', ' ')}
                  </Badge>
                  {m.userId !== user?.id && (
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => handleRemoveMember(m.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Team Member</DialogTitle><DialogDescription>Send an invitation to join this organization.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label className="text-xs">Email Address</Label><Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="mt-1" /></div>
            <div>
              <Label className="text-xs">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['org_admin', 'manager', 'marketing', 'sales', 'support', 'finance', 'viewer'].map(r => (
                    <SelectItem key={r} value={r}>{r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={inviteLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {inviteLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />} Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
