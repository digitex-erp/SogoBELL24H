import { useState, ReactNode } from 'react'
import {
  LayoutDashboard, Brain, Image as ImageIcon, Video, Mic, UserCircle,
  Megaphone, Send, Search as SearchIcon, BarChart3, Users, Building2,
  ShoppingCart, FileText, Settings, Shield, Activity, Bell, ChevronDown,
  ChevronRight, Zap, Globe, Workflow, Database, Menu, X, LogOut,
  HelpCircle, Moon, Sun, MessageSquare, Briefcase, Package, Truck,
  Star, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign,
  Eye, ArrowUpRight, Calendar, Filter, MoreHorizontal, RefreshCw,
  Plus, Download, Upload, Trash2, Edit, Copy, ExternalLink,
  Bot, Sparkles, Palette, Wand2, Layers, MonitorPlay, Clapperboard,
  Headphones, CircleUser, MegaphoneIcon, Target, PieChart, LineChart,
  BarChart2, AreaChart, CreditCard, Receipt, Wallet, Scale, FileSearch,
  UserPlus, Mail, Phone, MapPin, Tag, Flag, BookOpen, Library,
  Server, HardDrive, Cpu, Wifi, GitBranch, Terminal, Webhook,
  Key, Lock, ShieldCheck, FileWarning, ScrollText, Gauge, Timer, Factory,
  Network, Radio, Volume2, Boxes, PhoneOutgoing, PhoneIncoming, ShieldAlert, Inbox,
  FileTerminal, Waves
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export type PageId =
  | 'dashboard'
  | 'ai-studio' | 'image-studio' | 'video-studio' | 'voice-studio' | 'avatar-studio' | 'prompt-studio'
  | 'campaigns' | 'publishing' | 'seo' | 'content'
  | 'crm' | 'leads' | 'contacts' | 'deals'
  | 'marketplace' | 'suppliers' | 'buyers' | 'rfqs'
  | 'automation' | 'workflows' | 'jobs'
  | 'analytics' | 'reports'
  | 'admin-users' | 'admin-roles' | 'admin-orgs' | 'admin-audit' | 'admin-health' | 'admin-features'
  | 'settings' | 'integrations' | 'api-keys' | 'logs'
  | 'knowledge-base' | 'ai-router' | 'industry'
  // COMMUNICATION — AI Voice & Communication Center
  | 'comm-hub'
  | 'voice-center'
  | 'voice-live' | 'voice-queue' | 'voice-history' | 'voice-conversation'
  | 'voice-agents' | 'voice-flow' | 'voice-scripts'
  | 'voice-receptionist' | 'voice-campaigns' | 'voice-rfq-followup'
  | 'voice-infra' | 'voice-sip' | 'voice-providers' | 'voice-speech' | 'voice-models'
  | 'voice-library' | 'voice-numbers'
  | 'voice-escalations' | 'voice-automation' | 'voice-analytics' | 'voice-settings'

interface NavItem {
  id: PageId
  label: string
  icon: ReactNode
  badge?: string
  badgeColor?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ]
  },
  {
    title: 'AI STUDIO',
    items: [
      { id: 'ai-studio', label: 'AI Studio', icon: <Brain className="w-4 h-4" />, badge: '7 providers' },
      { id: 'prompt-studio', label: 'Prompt Studio', icon: <Wand2 className="w-4 h-4" /> },
      { id: 'image-studio', label: 'Image Studio', icon: <ImageIcon className="w-4 h-4" /> },
      { id: 'ai-router', label: 'AI Router', icon: <Server className="w-4 h-4" />, badge: 'NEW', badgeColor: 'bg-blue-500' },
      { id: 'video-studio', label: 'Video Studio', icon: <Video className="w-4 h-4" /> },
      { id: 'voice-studio', label: 'Voice Studio', icon: <Mic className="w-4 h-4" /> },
      { id: 'avatar-studio', label: 'Avatar Studio', icon: <CircleUser className="w-4 h-4" /> },
    ]
  },
  {
    title: 'MARKETING',
    items: [
      { id: 'campaigns', label: 'Campaign Center', icon: <Megaphone className="w-4 h-4" /> },
      { id: 'publishing', label: 'Publishing Center', icon: <Send className="w-4 h-4" /> },
      { id: 'seo', label: 'SEO Center', icon: <SearchIcon className="w-4 h-4" /> },
      { id: 'content', label: 'Content Planner', icon: <FileText className="w-4 h-4" /> },
    ]
  },
  {
    title: 'CRM',
    items: [
      { id: 'leads', label: 'Leads', icon: <UserPlus className="w-4 h-4" />, badge: '12', badgeColor: 'bg-blue-500' },
      { id: 'contacts', label: 'Contacts', icon: <Users className="w-4 h-4" /> },
      { id: 'deals', label: 'Deals', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'crm', label: 'Activities', icon: <Activity className="w-4 h-4" /> },
    ]
  },
  {
    title: 'MARKETPLACE',
    items: [
      { id: 'marketplace', label: 'Marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
      { id: 'suppliers', label: 'Suppliers', icon: <Truck className="w-4 h-4" /> },
      { id: 'buyers', label: 'Buyers', icon: <Package className="w-4 h-4" /> },
      { id: 'rfqs', label: 'RFQs', icon: <FileSearch className="w-4 h-4" />, badge: '3', badgeColor: 'bg-orange-500' },
    ]
  },
  {
    title: 'COMMUNICATION',
    items: [
      { id: 'comm-hub', label: 'Communication Hub', icon: <Inbox className="w-4 h-4" />, badge: 'SIM', badgeColor: 'bg-violet-500' },
      { id: 'voice-center', label: 'AI Voice Center', icon: <Gauge className="w-4 h-4" /> },
      { id: 'voice-live', label: 'Live Calls', icon: <Radio className="w-4 h-4" /> },
      { id: 'voice-queue', label: 'Call Queue', icon: <Layers className="w-4 h-4" /> },
      { id: 'voice-history', label: 'Call History', icon: <Clock className="w-4 h-4" /> },
      { id: 'voice-conversation', label: 'Conversations', icon: <MessageSquare className="w-4 h-4" /> },
      { id: 'voice-agents', label: 'Voice Agents', icon: <Bot className="w-4 h-4" /> },
      { id: 'voice-flow', label: 'Call Flow Builder', icon: <GitBranch className="w-4 h-4" /> },
      { id: 'voice-scripts', label: 'Call Scripts', icon: <FileText className="w-4 h-4" /> },
      { id: 'voice-receptionist', label: 'AI Receptionist', icon: <PhoneIncoming className="w-4 h-4" /> },
      { id: 'voice-campaigns', label: 'Call Campaigns', icon: <Zap className="w-4 h-4" /> },
      { id: 'voice-rfq-followup', label: 'RFQ Follow-up Agent', icon: <Target className="w-4 h-4" /> },
      { id: 'voice-escalations', label: 'Escalations', icon: <ShieldAlert className="w-4 h-4" /> },
      { id: 'voice-analytics', label: 'Call Analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'voice-automation', label: 'Automation Rules', icon: <Workflow className="w-4 h-4" /> },
      { id: 'voice-numbers', label: 'Phone Numbers', icon: <Phone className="w-4 h-4" /> },
      { id: 'voice-infra', label: 'SIP / Telephony', icon: <Network className="w-4 h-4" /> },
      { id: 'voice-providers', label: 'Voice Providers', icon: <Boxes className="w-4 h-4" /> },
      { id: 'voice-speech', label: 'STT / TTS Providers', icon: <Volume2 className="w-4 h-4" /> },
      { id: 'voice-models', label: 'AI Models', icon: <Server className="w-4 h-4" /> },
      { id: 'voice-library', label: 'Voice Library', icon: <Headphones className="w-4 h-4" /> },
      { id: 'voice-settings', label: 'Communication Settings', icon: <Shield className="w-4 h-4" /> },
    ]
  },
  {
    title: 'AUTOMATION',
    items: [
      { id: 'automation', label: 'Automation', icon: <Workflow className="w-4 h-4" /> },
      { id: 'workflows', label: 'Workflows', icon: <GitBranch className="w-4 h-4" /> },
      { id: 'jobs', label: 'Job Queue', icon: <Timer className="w-4 h-4" />, badge: '5', badgeColor: 'bg-yellow-500' },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'industry', label: 'Industry Intelligence', icon: <Factory className="w-4 h-4" />, badge: 'Layer 1', badgeColor: 'bg-emerald-500' },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'reports', label: 'Reports', icon: <PieChart className="w-4 h-4" /> },
      { id: 'knowledge-base', label: 'Knowledge Base', icon: <Library className="w-4 h-4" /> },
    ]
  },
  {
    title: 'ADMIN',
    items: [
      { id: 'admin-users', label: 'Users', icon: <Users className="w-4 h-4" /> },
      { id: 'admin-roles', label: 'Roles & Permissions', icon: <Shield className="w-4 h-4" /> },
      { id: 'admin-orgs', label: 'Organizations', icon: <Building2 className="w-4 h-4" /> },
      { id: 'admin-audit', label: 'Audit & Explainability', icon: <ShieldCheck className="w-4 h-4" />, badge: 'SHAP/LIME', badgeColor: 'bg-teal-600' },
      { id: 'admin-health', label: 'System Health', icon: <Gauge className="w-4 h-4" /> },
      { id: 'admin-features', label: 'Feature Flags', icon: <Flag className="w-4 h-4" /> },
    ]
  },
  {
    title: 'DEVELOPER',
    items: [
      { id: 'api-keys', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
      { id: 'integrations', label: 'Integrations', icon: <Webhook className="w-4 h-4" /> },
      { id: 'logs', label: 'Logs', icon: <Terminal className="w-4 h-4" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ]
  },
]

interface LayoutProps {
  children: ReactNode
  activePage: PageId
  onNavigate: (page: PageId) => void
}

export function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout, user } = useAuth()

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col border-r border-gray-200 bg-white transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-60",
        "hidden lg:flex"
      )}>
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">Bell24h-OS</h1>
              <p className="text-[10px] text-gray-400 truncate">Enterprise AI Platform</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1 rounded hover:bg-gray-100 flex-shrink-0">
            <ChevronRight className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <TooltipProvider delayDuration={0}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="mb-3">
                {!collapsed && (
                  <p className="px-4 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 mx-1 rounded-md text-sm transition-colors",
                          collapsed ? "justify-center py-2" : "py-1.5",
                          activePage === item.id
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <>
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className={cn("ml-auto text-[10px] px-1.5 py-0 h-4", item.badgeColor, "text-white")}>
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" sideOffset={8}>
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            ))}
          </TooltipProvider>
        </ScrollArea>

        {/* User */}
        <div className="border-t border-gray-100 p-3">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">{user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.role || 'Member'}</p>
              </div>
            )}
            <button onClick={logout} title="Sign out" className={cn("p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0", collapsed && "mt-1")}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white shadow-xl">
            <div className="h-14 flex items-center gap-2 px-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-sm font-bold text-gray-900">Bell24h-OS</h1>
              <button onClick={() => setMobileOpen(false)} className="ml-auto p-1">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <ScrollArea className="flex-1 py-2 h-[calc(100vh-56px)]">
              {NAV_SECTIONS.map((section) => (
                <div key={section.title} className="mb-3">
                  <p className="px-4 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{section.title}</p>
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-1.5 text-sm",
                        activePage === item.id
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className={cn("ml-auto text-[10px] px-1.5 py-0 h-4", item.badgeColor, "text-white")}>
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </ScrollArea>
            <div className="border-t border-gray-100 p-3">
              <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center gap-3 px-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden">
            <Menu className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search anything..." className="pl-9 h-8 text-sm bg-gray-50 border-gray-200" />
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <HelpCircle className="w-4 h-4 text-gray-500" />
            </Button>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <button onClick={logout} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
