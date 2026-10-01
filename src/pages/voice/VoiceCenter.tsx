import { useEffect, useState } from 'react'
import { SimulationProvider } from './shared'
import { CommunicationHub, FounderCockpitComms, VoiceCommandCenter } from './CommandCenter'
import { CallHistory, CallQueue, ConversationDetail, LiveCalls } from './CallsPages'
import { CallFlowBuilder, CallScriptStudio, VoiceAgentBuilder } from './BuilderPages'
import { AiReceptionist, CallCampaignsPage, RfqFollowUpPage } from './CampaignPages'
import { PhoneNumbersPage, VoiceInfrastructure, VoiceLibrary, VoiceProvidersPage } from './InfraPages'
import { AutomationRulesPage, CallAnalyticsPage, CommunicationSettingsPage, EscalationCenter } from './OpsPages'

export { FounderCockpitComms } from './CommandCenter'

/** Every page id that belongs to the COMMUNICATION navigation section. */
export const VOICE_PAGES = [
  'comm-hub',
  'voice-center',
  'voice-live',
  'voice-queue',
  'voice-history',
  'voice-conversation',
  'voice-agents',
  'voice-flow',
  'voice-scripts',
  'voice-receptionist',
  'voice-campaigns',
  'voice-rfq-followup',
  'voice-infra',
  'voice-sip',
  'voice-providers',
  'voice-speech',
  'voice-models',
  'voice-library',
  'voice-numbers',
  'voice-escalations',
  'voice-automation',
  'voice-analytics',
  'voice-settings',
] as const

export type VoicePage = typeof VOICE_PAGES[number]

export function isVoicePage(page: string): page is VoicePage {
  return (VOICE_PAGES as readonly string[]).includes(page)
}

export function VoiceCenter({ page, onNavigate }: { page: VoicePage; onNavigate: (page: string) => void }) {
  const [callRef, setCallRef] = useState<string | null>(null)
  const [flowAgent, setFlowAgent] = useState<string | null>(null)

  // Leaving the conversation page clears the selected call so re-entering starts clean.
  useEffect(() => {
    if (page !== 'voice-conversation') setCallRef(null)
  }, [page])

  const openCall = (ref: string) => {
    setCallRef(ref)
    onNavigate('voice-conversation')
  }

  const body = () => {
    switch (page) {
      case 'comm-hub': return <CommunicationHub onNavigate={onNavigate} />
      case 'voice-center': return <VoiceCommandCenter onNavigate={onNavigate} />
      case 'voice-live': return <LiveCalls onOpenCall={openCall} />
      case 'voice-queue': return <CallQueue />
      case 'voice-history': return <CallHistory onOpenCall={openCall} />
      case 'voice-conversation': return <ConversationDetail callRef={callRef} onBack={() => onNavigate('voice-history')} onNavigate={onNavigate} />
      case 'voice-agents': return <VoiceAgentBuilder onOpenFlow={(k) => { setFlowAgent(k); onNavigate('voice-flow') }} />
      case 'voice-flow': return <CallFlowBuilder agentKey={flowAgent} onSelectAgent={setFlowAgent} />
      case 'voice-scripts': return <CallScriptStudio />
      case 'voice-receptionist': return <AiReceptionist onOpenCall={openCall} />
      case 'voice-campaigns': return <CallCampaignsPage />
      case 'voice-rfq-followup': return <RfqFollowUpPage />
      case 'voice-infra': case 'voice-sip': return <VoiceInfrastructure />
      case 'voice-providers': return <VoiceProvidersPage mode="all" />
      case 'voice-speech': return <VoiceProvidersPage mode="speech" />
      case 'voice-models': return <VoiceProvidersPage mode="llm" />
      case 'voice-library': return <VoiceLibrary />
      case 'voice-numbers': return <PhoneNumbersPage />
      case 'voice-escalations': return <EscalationCenter onOpenCall={openCall} />
      case 'voice-automation': return <AutomationRulesPage />
      case 'voice-analytics': return <CallAnalyticsPage />
      case 'voice-settings': return <CommunicationSettingsPage />
      default: return <VoiceCommandCenter onNavigate={onNavigate} />
    }
  }

  // The prototype banner is rendered inside every page, but the whole module is
  // wrapped in one simulation provider so any button can announce a simulated result.
  return <SimulationProvider key={page}>{body()}</SimulationProvider>
}
