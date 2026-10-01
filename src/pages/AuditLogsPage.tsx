import { useFetch } from '@/hooks/useFetch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollText, Filter } from 'lucide-react'
import { useState } from 'react'

const ACTION_COLORS: Record<string, string> = {
  'user.registered': 'bg-blue-100 text-blue-700',
  'user.role_changed': 'bg-purple-100 text-purple-700',
  'organization.created': 'bg-emerald-100 text-emerald-700',
  'organization.updated': 'bg-amber-100 text-amber-700',
}

export function AuditLogsPage() {
  const { data, loading } = useFetch<any>('/audit-logs')
  const [filter, setFilter] = useState('')
  const logs = (data?.items || []).filter((l: any) => !filter || l.action.includes(filter) || (l.resource ?? '').includes(filter))

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><ScrollText className="w-5 h-5 text-amber-600" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Audit Logs</h1><p className="text-sm text-gray-500">{logs.length} entries</p></div>
      </div>
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by action or resource..." className="text-sm border rounded-lg px-3 py-1.5 w-64" />
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Resource</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Details</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr> :
                logs.map((l: any) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3"><Badge variant="secondary" className={ACTION_COLORS[l.action] || 'bg-gray-100 text-gray-700'}>{l.action}</Badge></td>
                    <td className="px-4 py-3 text-gray-500">{l.resource}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate">{l.details || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              {logs.length === 0 && !loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No audit logs</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
