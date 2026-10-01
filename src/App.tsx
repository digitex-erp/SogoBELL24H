import { useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Layout, PageId } from '@/components/layout/Layout'
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/pages/AuthPages'
import { DashboardPage } from '@/pages/Dashboard'
import { AIStudioPage } from '@/pages/AIStudio'
import { CampaignCenterPage } from '@/pages/CampaignCenter'
import { CRMPage } from '@/pages/CRMPage'
import { ProviderManagerPage } from '@/pages/ProviderManager'
import { OrganizationPage } from '@/pages/OrganizationPage'
import { UsersPage } from '@/pages/UsersPage'
import { AuditCenterPage } from '@/pages/AuditCenterPage'
import { IndustryIntelligencePage } from '@/pages/IndustryIntelligencePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SystemHealthPage } from '@/pages/SystemHealthPage'
import { RolesPage, FeatureFlagsPage, AnalyticsPage, ReportsPage, KnowledgeBasePage, JobQueuePage, LogsPage } from '@/pages/AdminPages'
import { PublishingCenterPage, ContentPlannerPage } from '@/pages/MarketingPages'
import SEOCenter from '@/pages/SEOCenter'
import { MarketplacePage, SuppliersPage, BuyersPage, RFQsPage, AutomationPage, WorkflowsPage } from '@/pages/MarketplacePages'
import { ImageFactoryPage } from '@/pages/ImageFactory'
import { AIProviderManagerPage } from '@/pages/AIProviderManager'
import { AIRouterDashboardPage } from '@/pages/AIRouterDashboard'
import { VideoFactoryPage } from '@/pages/VideoFactory'
import { VoiceCenter, isVoicePage } from '@/pages/voice/VoiceCenter'
import { Loader2 } from 'lucide-react'

function AppRouter() {
  const { user, loading } = useAuth()
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login')

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading Bell24h-OS...</p>
      </div>
    </div>
  )

  if (!user) {
    if (authView === 'register') return <RegisterPage onSwitch={() => setAuthView('login')} />
    if (authView === 'forgot') return <ForgotPasswordPage onBack={() => setAuthView('login')} />
    return <LoginPage onSwitch={() => setAuthView('register')} onForgotPassword={() => setAuthView('forgot')} />
  }

  const renderPage = () => {
    if (isVoicePage(activePage)) return <VoiceCenter page={activePage} onNavigate={(p) => setActivePage(p as PageId)} />
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={(p) => setActivePage(p as PageId)} />
      case 'ai-studio': return <AIStudioPage />
      case 'campaigns': return <CampaignCenterPage />
      case 'leads': case 'crm': case 'contacts': case 'deals': return <CRMPage />
      case 'admin-orgs': return <OrganizationPage />
      case 'api-keys': case 'integrations': return <ProviderManagerPage />
      case 'admin-users': return <UsersPage />
      case 'admin-roles': return <RolesPage />
      case 'admin-audit': return <AuditCenterPage />
      case 'admin-health': return <SystemHealthPage />
      case 'admin-features': return <FeatureFlagsPage />
      case 'settings': return <SettingsPage />
      case 'analytics': return <AnalyticsPage />
      case 'reports': return <ReportsPage />
      case 'knowledge-base': return <KnowledgeBasePage />
      case 'jobs': return <JobQueuePage />
      case 'logs': return <LogsPage />
      case 'publishing': return <PublishingCenterPage />
      case 'seo': return <SEOCenter />
      case 'industry': return <IndustryIntelligencePage />
      case 'content': return <ContentPlannerPage />
      case 'marketplace': return <MarketplacePage />
      case 'suppliers': return <SuppliersPage />
      case 'buyers': return <BuyersPage />
      case 'rfqs': return <RFQsPage />
      case 'automation': return <AutomationPage />
      case 'workflows': return <WorkflowsPage />
      case 'image-studio': return <ImageFactoryPage />
      case 'ai-router': return <AIRouterDashboardPage />
      case 'video-studio': return <VideoFactoryPage />
      case 'voice-studio': case 'avatar-studio': case 'prompt-studio':
        return <AIStudioPage />
      default: return <DashboardPage />
    }
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
