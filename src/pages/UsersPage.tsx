import { useState } from 'react'
import { useFetch, apiCall } from '@/hooks/useFetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Users, UserPlus, Shield, Trash2, Loader2 } from 'lucide-react'

const ROLES = ['super_admin','org_admin','manager','marketing','sales','support','finance','buyer','supplier','viewer']

export function UsersPage() {
  const { data, loading, error, refetch } = useFetch<any>('/admin/users')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('viewer')
  const [saving, setSaving] = useState(false)

  const handleInvite = async () => {
    if (!email) return
    setSaving(true)
    try {
      const org = data?.users?.[0]?.organizationId
      if (org) await apiCall(`/organizations/${org}/invite`, { method: 'POST', body: JSON.stringify({ email, role }) })
      setEmail('')
      setRole('viewer')
      setInviteOpen(false)
      refetch()
    } catch { }
    setSaving(false)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiCall(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) })
      refetch()
    } catch { }
  }

  const handleRemove = async (userId: string) => {
    if (!confirm('Remove this user?')) return
    try {
      const org = data?.users?.[0]?.organizationId
      if (org) {
        const members = await apiCall(`/organizations/${org}/members`)
        const member = members.members?.find((m: any) => m.userId === userId)
        if (member) await apiCall(`/organizations/${org}/members/${member.id}`, { method: 'DELETE' })
      }
      refetch()
    } catch { }
  }

  const users = data?.users || []

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><Users className="w-5 h-5 text-gray-600" /></div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500">{users.length} users in organization</p>
          </div>
        </div>
        <Button onClick={() => setInviteOpen(true)} size="sm"><UserPlus className="w-4 h-4 mr-2" />Invite User</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
      ) : error ? (
        <Card><CardContent className="p-6 text-center text-red-500 text-sm">{error}</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr></thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">{(u.name || u.email)?.[0]?.toUpperCase()}</div>
                        <span className="font-medium">{u.name || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.orgRole || u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="text-xs border rounded px-2 py-1">
                        {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleRemove(u.id)} className="h-7 text-red-500 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Invite User</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@company.com" type="email" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full text-sm border rounded-lg px-3 py-2">
                {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
              </select>
            </div>
            <Button onClick={handleInvite} disabled={saving || !email} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
