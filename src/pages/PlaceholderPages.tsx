import { PageId } from '@/components/layout/Layout'
import { cn } from '@/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Construction, ArrowRight } from 'lucide-react'

interface PlaceholderProps {
  page: PageId
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  color: string
  bgColor: string
}

export function PlaceholderPage({ page, title, description, icon, features, color, bgColor }: PlaceholderProps) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bgColor)}>
          <span className={color}>{icon}</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Badge variant="outline" className="ml-2 text-amber-600 border-amber-200 bg-amber-50">
          <Construction className="w-3 h-3 mr-1" /> Building
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Coming Soon — {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const PAGE_CONFIGS: Record<PageId, Omit<PlaceholderProps, 'page'>> = {
  'dashboard': { title: '', description: '', icon: null, features: [], color: '', bgColor: '' },
  'ai-studio': {
    title: 'AI Studio', description: 'Multi-provider AI orchestration', icon: null,
    features: ['GPT-4o / Claude / Gemini / Grok / Mistral / DeepSeek / OpenRouter', 'Prompt execution & comparison', 'Provider routing & failover', 'Token usage & cost tracking', 'Response evaluation & scoring', 'Model benchmarks', 'History & favorites'],
    color: 'text-orange-600', bgColor: 'bg-orange-50'
  },
  'image-studio': {
    title: 'Image Studio', description: 'AI-powered image generation & editing', icon: null,
    features: ['Generate from text prompt', 'Edit & inpainting', 'Background removal', 'Upscale & enhance', 'Style transfer', 'Brand kit templates', 'Batch generation', 'History & gallery'],
    color: 'text-purple-600', bgColor: 'bg-purple-50'
  },
  'video-studio': {
    title: 'Video Studio', description: 'AI video generation & editing', icon: null,
    features: ['Text-to-video generation', 'Upload & edit', 'Auto-subtitles', 'Avatar talking head', 'Voice overlay', 'AI scene generation', 'Render queue', 'Export to multiple formats'],
    color: 'text-pink-600', bgColor: 'bg-pink-50'
  },
  'voice-studio': {
    title: 'Voice Studio', description: 'Text-to-speech & audio', icon: null,
    features: ['Multi-language TTS', 'Voice cloning', 'Audio transcription', 'Podcast generation', 'Background music', 'Audio editing', 'Export MP3/WAV'],
    color: 'text-cyan-600', bgColor: 'bg-cyan-50'
  },
  'avatar-studio': {
    title: 'Avatar Studio', description: 'AI avatar creation & animation', icon: null,
    features: ['Create custom avatar', 'Lip sync animation', 'Background compositing', 'Multiple poses', 'Expression control', 'Video export'],
    color: 'text-indigo-600', bgColor: 'bg-indigo-50'
  },
  'prompt-studio': {
    title: 'Prompt Studio', description: 'Prompt engineering & management', icon: null,
    features: ['Template library', 'Variable injection', 'A/B testing', 'Performance scoring', 'Chain-of-thought builder', 'Version control'],
    color: 'text-emerald-600', bgColor: 'bg-emerald-50'
  },
  'campaigns': {
    title: 'Campaign Center', description: 'Marketing campaign management', icon: null,
    features: ['Create & manage campaigns', 'Multi-platform scheduling', 'Budget allocation', 'Performance tracking', 'Audience targeting', 'A/B testing', 'Auto-optimization'],
    color: 'text-blue-600', bgColor: 'bg-blue-50'
  },
  'publishing': {
    title: 'Publishing Center', description: 'Multi-platform content publishing', icon: null,
    features: ['Google Ads / Facebook / Instagram / LinkedIn / Twitter / YouTube / WhatsApp', 'Schedule & queue', 'Auto-repost', 'Platform analytics', 'Approval workflow'],
    color: 'text-teal-600', bgColor: 'bg-teal-50'
  },
  'seo': {
    title: 'SEO Center', description: 'Search engine optimization', icon: null,
    features: ['Keyword research', 'Content gap analysis', 'Competitor tracking', 'SERP monitoring', 'Backlink analysis', 'Technical audit', 'Optimization suggestions'],
    color: 'text-green-600', bgColor: 'bg-green-50'
  },
  'content': {
    title: 'Content Planner', description: 'AI content planning & creation', icon: null,
    features: ['Content calendar', 'AI blog writing', 'Social media posts', 'Email campaigns', 'Product descriptions', 'SEO optimization', 'Multi-language'],
    color: 'text-violet-600', bgColor: 'bg-violet-50'
  },
  'crm': {
    title: 'CRM Activities', description: 'Activity tracking & management', icon: null,
    features: ['Task management', 'Email tracking', 'Call logging', 'Meeting scheduler', 'Note taking', 'Follow-up reminders'],
    color: 'text-amber-600', bgColor: 'bg-amber-50'
  },
  'leads': {
    title: 'Leads', description: 'Lead management & scoring', icon: null,
    features: ['Lead capture', 'Auto-scoring', 'Pipeline view', 'Lead nurturing', 'Import/export', 'Duplicate detection'],
    color: 'text-orange-600', bgColor: 'bg-orange-50'
  },
  'contacts': {
    title: 'Contacts', description: 'Contact management', icon: null,
    features: ['Contact database', 'Company profiles', 'Communication history', 'Tags & segments', 'Import from CSV', 'Duplicates merge'],
    color: 'text-sky-600', bgColor: 'bg-sky-50'
  },
  'deals': {
    title: 'Deals', description: 'Deal pipeline management', icon: null,
    features: ['Deal stages', 'Pipeline view', 'Revenue forecasting', 'Win/loss analysis', 'Deal scoring', 'Activity timeline'],
    color: 'text-emerald-600', bgColor: 'bg-emerald-50'
  },
  'marketplace': {
    title: 'Marketplace', description: 'B2B marketplace hub', icon: null,
    features: ['Product listings', 'Category browsing', 'RFQ management', 'Supplier matching', 'Buyer verification', 'Trust scoring'],
    color: 'text-rose-600', bgColor: 'bg-rose-50'
  },
  'suppliers': {
    title: 'Suppliers', description: 'Supplier directory & management', icon: null,
    features: ['Supplier profiles', 'Verification status', 'Product catalog', 'Performance ratings', 'Communication hub'],
    color: 'text-teal-600', bgColor: 'bg-teal-50'
  },
  'buyers': {
    title: 'Buyers', description: 'Buyer management', icon: null,
    features: ['Buyer profiles', 'Purchase history', 'Inquiry tracking', 'Credit status', 'Communication history'],
    color: 'text-indigo-600', bgColor: 'bg-indigo-50'
  },
  'rfqs': {
    title: 'RFQs', description: 'Request for Quotation management', icon: null,
    features: ['Create RFQ', 'Supplier matching', 'Quote comparison', 'Award management', 'Deadline tracking'],
    color: 'text-amber-600', bgColor: 'bg-amber-50'
  },
  'automation': {
    title: 'Automation', description: 'Business process automation', icon: null,
    features: ['Rule builder', 'Trigger configuration', 'Action library', 'Error handling', 'Execution logs'],
    color: 'text-violet-600', bgColor: 'bg-violet-50'
  },
  'workflows': {
    title: 'Workflows', description: 'Visual workflow designer', icon: null,
    features: ['Drag-and-drop builder', 'Conditional logic', 'Parallel execution', 'Error recovery', 'Templates library'],
    color: 'text-blue-600', bgColor: 'bg-blue-50'
  },
  'jobs': {
    title: 'Job Queue', description: 'Background job management', icon: null,
    features: ['Real-time queue status', 'Job history', 'Retry management', 'Priority control', 'Worker monitoring'],
    color: 'text-yellow-600', bgColor: 'bg-yellow-50'
  },
  'analytics': {
    title: 'Analytics', description: 'Business intelligence & analytics', icon: null,
    features: ['Real-time dashboards', 'Custom reports', 'Funnel analysis', 'Cohort analysis', 'Attribution modeling', 'Export to Excel/PDF'],
    color: 'text-indigo-600', bgColor: 'bg-indigo-50'
  },
  'reports': {
    title: 'Reports', description: 'Automated reporting', icon: null,
    features: ['Report builder', 'Scheduled reports', 'Email delivery', 'PDF export', 'Custom metrics', 'Comparison views'],
    color: 'text-cyan-600', bgColor: 'bg-cyan-50'
  },
  'knowledge-base': {
    title: 'Knowledge Base', description: 'AI-powered knowledge management', icon: null,
    features: ['Document storage', 'AI search', 'Auto-categorization', 'Version control', 'Access control', 'Embeddings & vectors'],
    color: 'text-emerald-600', bgColor: 'bg-emerald-50'
  },
  'admin-users': {
    title: 'User Management', description: 'System user administration', icon: null,
    features: ['User list', 'Role assignment', 'Activity monitoring', 'Invitation management', 'Account status'],
    color: 'text-gray-600', bgColor: 'bg-gray-100'
  },
  'admin-roles': {
    title: 'Roles & Permissions', description: 'Access control management', icon: null,
    features: ['Role hierarchy', 'Permission matrix', 'Custom roles', 'Audit trail', 'Access reviews'],
    color: 'text-red-600', bgColor: 'bg-red-50'
  },
  'admin-orgs': {
    title: 'Organizations', description: 'Multi-tenant management', icon: null,
    features: ['Organization list', 'Plan management', 'Usage tracking', 'Billing', 'Feature access'],
    color: 'text-purple-600', bgColor: 'bg-purple-50'
  },
  'admin-audit': {
    title: 'Audit Logs', description: 'System audit trail', icon: null,
    features: ['Action log', 'User activity', 'Data changes', 'Security events', 'Export & compliance'],
    color: 'text-amber-600', bgColor: 'bg-amber-50'
  },
  'admin-health': {
    title: 'System Health', description: 'Infrastructure monitoring', icon: null,
    features: ['Service status', 'Resource usage', 'Error rates', 'Response times', 'Alerting rules'],
    color: 'text-green-600', bgColor: 'bg-green-50'
  },
  'admin-features': {
    title: 'Feature Flags', description: 'Feature toggle management', icon: null,
    features: ['Flag creation', 'Percentage rollouts', 'Organization targeting', 'A/B experiments', 'Kill switches'],
    color: 'text-orange-600', bgColor: 'bg-orange-50'
  },
  'api-keys': {
    title: 'API Keys', description: 'API key management', icon: null,
    features: ['Create keys', 'Scope permissions', 'Rate limiting', 'Usage tracking', 'Revocation'],
    color: 'text-slate-600', bgColor: 'bg-slate-100'
  },
  'integrations': {
    title: 'Integrations', description: 'Third-party integrations', icon: null,
    features: ['Google Ads / Facebook / Instagram / LinkedIn / Twitter / YouTube / WhatsApp', 'OAuth connection', 'Webhook config', 'Status monitoring'],
    color: 'text-blue-600', bgColor: 'bg-blue-50'
  },
  'logs': {
    title: 'System Logs', description: 'Application log viewer', icon: null,
    features: ['Real-time log stream', 'Filter by level', 'Search', 'Export', 'Retention settings'],
    color: 'text-gray-600', bgColor: 'bg-gray-100'
  },
  'settings': {
    title: 'Settings', description: 'Application settings', icon: null,
    features: ['Profile settings', 'Notification preferences', 'Theme', 'Language', 'Timezone', 'Data export'],
    color: 'text-gray-600', bgColor: 'bg-gray-100'
  },
}
