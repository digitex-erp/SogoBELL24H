// SPDX-License-Identifier: Apache-2.0
// Bell24h-OS — AI Voice & Communication Center: simulation engine
//
// PROTOTYPE / SIMULATION ONLY.
// This module never opens a socket, never registers a SIP trunk and never dials
// a number. It produces *deterministic* simulated call records and drives a
// queue state machine so the operating model (who calls whom, with what script,
// what gets extracted, when a human is pulled in) can be validated before the
// self-hosted voice stack is wired behind the same interface.
//
// Determinism is a hard requirement: the same seed always yields the same
// record. An operating history you cannot reproduce is not evidence.

// ─────────────────────────────────────────────────────────────
// SEEDED RANDOMNESS
// ─────────────────────────────────────────────────────────────

export function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function rng(seed: string | number) {
  let a = typeof seed === 'string' ? hashSeed(seed) : seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(r: () => number, list: readonly T[]): T {
  return list[Math.floor(r() * list.length) % list.length]
}

function int(r: () => number, min: number, max: number): number {
  return Math.floor(r() * (max - min + 1)) + min
}

// ─────────────────────────────────────────────────────────────
// SIMULATION MODE
// ─────────────────────────────────────────────────────────────

export const SIMULATION_MODE = true as const

export const SIMULATION_BANNER =
  'PROTOTYPE / SIMULATION MODE — no live telephony. No SIP trunk, carrier credential or phone number is contacted by this module.'

export function simulated(what: string, detail?: string) {
  return {
    simulated: true as const,
    badge: 'SIMULATED',
    message: `SIMULATION: ${what}`,
    detail:
      detail ??
      'Recorded as a simulated action in the Bell24h-OS operating memory. Nothing was sent to a carrier.',
  }
}

// ─────────────────────────────────────────────────────────────
// DOMAIN VOCABULARY
// ─────────────────────────────────────────────────────────────

export const CALL_DIRECTIONS = ['outbound', 'inbound'] as const

export const CALL_STATUSES = [
  'queued', 'scheduled', 'ringing', 'in_progress',
  'completed', 'no_answer', 'callback', 'escalated', 'failed',
] as const
export type CallStatus = (typeof CALL_STATUSES)[number]

export const LIVE_STATES = ['ringing', 'speaking', 'listening', 'thinking', 'wrap_up'] as const
export type LiveState = (typeof LIVE_STATES)[number]

export const QUEUE_COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'calling', label: 'Calling' },
  { key: 'answered', label: 'Answered' },
  { key: 'no_answer', label: 'No Answer' },
  { key: 'callback', label: 'Callback' },
  { key: 'completed', label: 'Completed' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'failed', label: 'Failed' },
] as const

export const OUTBOUND_INTENTS = [
  'RFQ Follow-up', 'Supplier Qualification', 'Buyer Qualification', 'Quote Collection',
  'Appointment Scheduling', 'Payment Reminder', 'Order Confirmation', 'Lead Qualification',
  'Supplier Reactivation', 'Satisfaction Survey',
] as const

export const INBOUND_INTENTS = [
  'RFQ enquiry', 'Supplier enquiry', 'Order status', 'Quotation status',
  'General enquiry', 'Technical support', 'Payment enquiry', 'Human assistance',
] as const

export const ESCALATION_REASONS = [
  'Confidence below threshold',
  'Caller requested human',
  'Sensitive business decision',
  'Negotiation beyond agent authority',
  'Complaint raised',
  'Payment dispute',
  'Contract terms query',
  'Unknown intent',
] as const

export const SENTIMENTS = ['positive', 'neutral', 'cautious', 'negative'] as const

export const PRODUCTS = [
  { name: 'stainless steel components', sku: 'SS-316-CMP', unit: 'unit', basePrice: 240 },
  { name: 'cotton yarn 40s combed', sku: 'CTN-40S', unit: 'kg', basePrice: 315 },
  { name: 'HDPE granules', sku: 'HDPE-FILM', unit: 'kg', basePrice: 112 },
  { name: 'MS angle iron 50x50', sku: 'MS-5050', unit: 'tonne', basePrice: 62500 },
  { name: 'corrugated boxes 5-ply', sku: 'BOX-5PLY', unit: 'piece', basePrice: 42 },
  { name: 'copper wire 2.5 sqmm', sku: 'CU-25', unit: 'coil', basePrice: 3480 },
  { name: 'granite slabs 18mm', sku: 'GRN-18', unit: 'sqft', basePrice: 165 },
  { name: 'industrial fasteners M8', sku: 'FST-M8', unit: 'piece', basePrice: 6 },
] as const

export const LANGUAGES = [
  { code: 'en-IN', label: 'English', short: 'EN' },
  { code: 'hi-IN', label: 'Hindi', short: 'HI' },
  { code: 'hi-en', label: 'Hinglish', short: 'HI-EN' },
  { code: 'mr-IN', label: 'Marathi', short: 'MR' },
  { code: 'gu-IN', label: 'Gujarati', short: 'GU' },
  { code: 'ta-IN', label: 'Tamil', short: 'TA' },
  { code: 'te-IN', label: 'Telugu', short: 'TE' },
  { code: 'bn-IN', label: 'Bengali', short: 'BN' },
] as const

const PEOPLE = [
  { name: 'Rakesh Sharma', role: 'Proprietor' },
  { name: 'Priya Nair', role: 'Procurement Head' },
  { name: 'Imran Sheikh', role: 'Sales Manager' },
  { name: 'Suresh Patel', role: 'Plant Manager' },
  { name: 'Anjali Deshmukh', role: 'Purchase Executive' },
  { name: 'Vikram Rao', role: 'Director' },
  { name: 'Meera Iyer', role: 'Category Buyer' },
  { name: 'Karthik Subramanian', role: 'Operations Lead' },
  { name: 'Deepak Verma', role: 'Partner' },
  { name: 'Nisha Gupta', role: 'Sourcing Analyst' },
  { name: 'Arjun Malhotra', role: 'VP Supply Chain' },
  { name: 'Sneha Kulkarni', role: 'Accounts Manager' },
] as const

const SUPPLIERS = [
  { company: 'ABC Textiles', city: 'Surat', gst: '24AABCA1234K1Z5' },
  { company: 'Shakti Steel Works', city: 'Raipur', gst: '22AACSS9911L1Z2' },
  { company: 'Gujarat Polymers Pvt Ltd', city: 'Ahmedabad', gst: '24AAGCP4567M1Z8' },
  { company: 'Deccan Fasteners', city: 'Pune', gst: '27AADCF2211N1Z4' },
  { company: 'Krishna Packaging', city: 'Indore', gst: '23AAKCK7788P1Z1' },
  { company: 'Precision Tools India', city: 'Coimbatore', gst: '33AAPCT1122Q1Z9' },
  { company: 'Rajasthan Minerals', city: 'Jaipur', gst: '08AARM3322R1Z6' },
  { company: 'Chennai Auto Parts', city: 'Chennai', gst: '33AACAP6677S1Z3' },
  { company: 'Nova Chemicals', city: 'Vadodara', gst: '24AANCC5566T1Z7' },
  { company: 'Sunrise Ceramics', city: 'Morbi', gst: '24AASCU8899U1Z5' },
  { company: 'Bharat Electricals', city: 'Noida', gst: '09AABCE1144V1Z2' },
  { company: 'Vardhman Plastics', city: 'Ludhiana', gst: '03AAVCP3355W1Z8' },
  { company: 'Hi-Tech Fabrication', city: 'Faridabad', gst: '06AAHCF9900X1Z4' },
  { company: 'Delhi Rubber Co', city: 'Delhi', gst: '07AADRC2233Y1Z1' },
  { company: 'Kaveri Agro Mills', city: 'Mysuru', gst: '29AAKAM4455Z1Z6' },
  { company: 'Sri Balaji Metals', city: 'Hyderabad', gst: '36AASBM6677A1Z3' },
] as const

const BUYERS = [
  { company: 'Meridian Industries', city: 'Mumbai', gst: '27AAMCI1234B1Z5' },
  { company: 'Apex Infra Projects', city: 'Gurugram', gst: '06AAIPC5566C1Z2' },
  { company: 'Northline Traders', city: 'Kolkata', gst: '19AANTC7788D1Z8' },
  { company: 'Sterling Motors', city: 'Pune', gst: '27AASMC9911E1Z4' },
  { company: 'Veda Consumer Goods', city: 'Bengaluru', gst: '29AAVCG2244F1Z1' },
  { company: 'Pinnacle Exports', city: 'Kochi', gst: '32AAPCE3377G1Z9' },
  { company: 'BlueRock Manufacturing', city: 'Nashik', gst: '27AABRM4499H1Z6' },
  { company: 'Orbit Electronics', city: 'Bhopal', gst: '23AAOEC6611I1Z3' },
] as const

interface DirectoryEntry { readonly company: string; readonly city: string; readonly gst: string }

// Typed accessor so `supplier ? SUPPLIERS : BUYERS` widens to one shape instead of
// producing a union of two distinct `as const` tuple types.
function directory(kind: 'supplier' | 'buyer'): readonly DirectoryEntry[] {
  return kind === 'supplier' ? SUPPLIERS : BUYERS
}

export function maskedPhone(r: () => number): string {
  return `+91 ${int(r, 70, 99)}••••${int(r, 1000, 9999)}`
}

export function rfqNumber(r: () => number): string {
  return `RFQ-2026-${String(int(r, 1000, 9999))}`
}

export function svcRef(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(4, '0')}`
}

// ─────────────────────────────────────────────────────────────
// AGENT REGISTRY  (8 agents, one per business capability)
// ─────────────────────────────────────────────────────────────

export interface AgentBlueprint {
  key: string
  name: string
  purpose: string
  role: string
  language: string
  voiceName: string
  personality: string
  systemObjective: string
  businessContext: string
  knowledgeBase: string[]
  tools: string[]
  allowedActions: string[]
  restrictedActions: string[]
  decisionRules: string[]
  successCriteria: string[]
  failureCriteria: string[]
  escalationRules: string[]
  workingHours: string
  maxCallsPerDay: number
  escalationThreshold: number
  status: string
  approvalState: string
}

export const AGENT_BLUEPRINTS: AgentBlueprint[] = [
  {
    key: 'rfq_followup',
    name: 'RFQ Follow-up Agent',
    purpose: 'Call suppliers who have not responded to an RFQ and collect a firm quotation.',
    role: 'Outbound supplier follow-up',
    language: 'hi-en',
    voiceName: 'Ananya (Hinglish)',
    personality: 'Courteous, concise, respects the supplier’s time, never pressures on price.',
    systemObjective:
      'Convert a silent RFQ into a structured quotation by confirming product, quantity, price, MOQ, availability, delivery timeline, location, payment terms and GST details.',
    businessContext:
      'Bell24h marketplace RFQs. The supplier has already received the RFQ on WhatsApp and not replied within the SLA window, so a voice call is the next escalation channel.',
    knowledgeBase: ['RFQ line items', 'Supplier master & past quotes', 'Standard payment terms', 'Logistics lanes & transit times', 'GST verification rules'],
    tools: ['crm.upsertActivity', 'rfq.read', 'quote.create', 'whatsapp.sendSummary', 'calendar.schedule', 'escalation.raise'],
    allowedActions: ['Confirm availability', 'Record a quote', 'Agree a delivery date', 'Schedule a callback', 'Send a WhatsApp summary'],
    restrictedActions: ['Commit to a price on behalf of the buyer', 'Accept contractual terms', 'Change quantities beyond ±10%'],
    decisionRules: [
      'If the supplier cannot supply the full quantity, ask for the maximum they can supply and record it as a partial quote.',
      'If price is more than 15% above the RFQ target, record the quote and flag it for negotiation rather than rejecting it.',
      'If delivery exceeds the buyer target date by more than 5 days, ask for the fastest achievable date and log the gap.',
      'If the contact is not the decision maker, ask for the right person and schedule a callback rather than pushing.',
    ],
    successCriteria: ['Quote captured with price, quantity and delivery date', 'CRM activity created', 'RFQ status advanced'],
    failureCriteria: ['Supplier explicitly declines', 'Three contact attempts exhausted', 'Wrong number confirmed'],
    escalationRules: ['Caller disputes existing terms', 'Negotiation beyond ±15% authority', 'Confidence below threshold'],
    workingHours: 'Mon–Sat 09:30–19:00 IST',
    maxCallsPerDay: 120,
    escalationThreshold: 0.55,
    status: 'active',
    approvalState: 'approved',
  },
  {
    key: 'supplier_qualification',
    name: 'Supplier Qualification Agent',
    purpose: 'Qualify newly onboarded suppliers before they enter the matching pool.',
    role: 'Outbound supplier onboarding',
    language: 'en-IN',
    voiceName: 'Arjun (Indian English)',
    personality: 'Structured and verification-minded; confirms every fact against the profile record.',
    systemObjective:
      'Verify company identity, GST, manufacturing capacity, certifications, export readiness and primary contact before the supplier is released to matching.',
    businessContext: 'Marketplace supply-side onboarding. Suppliers are matched to RFQs only after qualification clears.',
    knowledgeBase: ['Supplier onboarding checklist', 'GST registry expectations', 'Certification catalogue', 'Category capacity norms'],
    tools: ['supplier.read', 'supplier.update', 'document.request', 'whatsapp.sendSummary', 'escalation.raise'],
    allowedActions: ['Verify company details', 'Request documents', 'Record capacity', 'Mark qualified / on-hold'],
    restrictedActions: ['Approve a supplier without GST confirmation', 'Promise order volumes'],
    decisionRules: [
      'A supplier without a verifiable GST number is marked on-hold, never qualified.',
      'If capacity is below the category minimum, record it and route to a lower tier rather than rejecting outright.',
      'If the contact cannot confirm certifications, request documents on WhatsApp and re-queue.',
    ],
    successCriteria: ['Qualification decision recorded', 'Documents requested', 'Supplier status updated'],
    failureCriteria: ['Contact refuses verification', 'Company details contradict the profile'],
    escalationRules: ['Suspected fraudulent registration', 'Confidence below threshold'],
    workingHours: 'Mon–Fri 10:00–18:30 IST',
    maxCallsPerDay: 60,
    escalationThreshold: 0.62,
    status: 'active',
    approvalState: 'approved',
  },
  {
    key: 'buyer_qualification',
    name: 'Buyer Qualification Agent',
    purpose: 'Qualify inbound buyer leads and capture a structured requirement.',
    role: 'Outbound buyer qualification',
    language: 'en-IN',
    voiceName: 'Kavya (Indian English)',
    personality: 'Warm and consultative; asks one question at a time and confirms before moving on.',
    systemObjective:
      'Establish requirement, quantity, target price, delivery location, timeline and buying authority so the requirement can be matched to suppliers.',
    businessContext: 'Marketplace demand-side intake. Unqualified leads are the main source of wasted RFQ volume.',
    knowledgeBase: ['Product taxonomy', 'Price band reference', 'Buyer credit signals', 'Delivery lane feasibility'],
    tools: ['lead.read', 'lead.update', 'rfq.create', 'crm.upsertActivity', 'calendar.schedule'],
    allowedActions: ['Capture requirement', 'Create an RFQ draft', 'Schedule a callback', 'Send WhatsApp summary'],
    restrictedActions: ['Quote a firm price', 'Confirm stock availability'],
    decisionRules: [
      'A lead with no confirmed quantity or delivery location is not qualified — create an RFQ draft instead.',
      'If the buyer is comparing three or more suppliers, tag the deal competitive and prioritise follow-up.',
      'If the timeline is under 7 days, flag as urgent and notify the founder.',
    ],
    successCriteria: ['Requirement fully captured', 'RFQ draft created', 'Follow-up scheduled'],
    failureCriteria: ['Lead unreachable across attempts', 'Requirement outside catalogue'],
    escalationRules: ['Large-volume deal above authority', 'Confidence below threshold'],
    workingHours: 'Mon–Sat 09:00–20:00 IST',
    maxCallsPerDay: 90,
    escalationThreshold: 0.58,
    status: 'active',
    approvalState: 'approved',
  },
  {
    key: 'quote_collection',
    name: 'Quote Collection Agent',
    purpose: 'Chase outstanding quotations so every RFQ closes with comparable offers.',
    role: 'Outbound quote chase',
    language: 'hi-IN',
    voiceName: 'Rohan (Hindi)',
    personality: 'Persistent but polite; acknowledges delay and offers a shorter path to respond.',
    systemObjective: 'Collect or refresh an outstanding quotation and record the reason for delay.',
    businessContext: 'Quotes lapse quickly in commodities; a stale quote is treated as no quote.',
    knowledgeBase: ['Open quote register', 'Commodity price movement', 'Supplier response history'],
    tools: ['quote.read', 'quote.update', 'whatsapp.sendSummary', 'crm.upsertActivity'],
    allowedActions: ['Collect a quote', 'Refresh a price', 'Record a decline reason'],
    restrictedActions: ['Negotiate below the buyer target', 'Extend quote validity on the buyer’s behalf'],
    decisionRules: [
      'If the quote is older than 7 days, ask for a re-confirmation rather than reusing the old price.',
      'If the supplier declines, record a structured decline reason — a reason is more valuable than a no.',
    ],
    successCriteria: ['Quote collected or refreshed', 'Reason recorded if declined'],
    failureCriteria: ['Supplier opts out of calls'],
    escalationRules: ['Price movement beyond authority', 'Confidence below threshold'],
    workingHours: 'Mon–Sat 09:30–18:00 IST',
    maxCallsPerDay: 100,
    escalationThreshold: 0.6,
    status: 'active',
    approvalState: 'approved',
  },
  {
    key: 'appointment',
    name: 'Appointment Agent',
    purpose: 'Schedule calls, meetings and site visits between buyers and suppliers.',
    role: 'Outbound scheduling',
    language: 'en-IN',
    voiceName: 'Neha (Indian English)',
    personality: 'Efficient and precise about time; always confirms timezone and channel.',
    systemObjective: 'Agree a slot that both parties can hold and create the calendar entry.',
    businessContext: 'High-value deals stall waiting for a human-to-human conversation.',
    knowledgeBase: ['Founder calendar', 'Contact availability preferences', 'Meeting types'],
    tools: ['calendar.check', 'calendar.schedule', 'crm.upsertActivity', 'whatsapp.sendSummary'],
    allowedActions: ['Offer slots', 'Book a meeting', 'Reschedule', 'Send confirmation'],
    restrictedActions: ['Book outside working hours', 'Commit the founder to a contract review'],
    decisionRules: [
      'Never offer a slot without first checking the founder calendar.',
      'If the contact cannot commit, propose a softer hold and re-queue for confirmation.',
    ],
    successCriteria: ['Slot booked and confirmed on the calendar'],
    failureCriteria: ['No mutually available slot in 14 days'],
    escalationRules: ['Contact requests the founder directly', 'Confidence below threshold'],
    workingHours: 'Mon–Fri 09:00–18:00 IST',
    maxCallsPerDay: 70,
    escalationThreshold: 0.6,
    status: 'active',
    approvalState: 'approved',
  },
  {
    key: 'customer_support',
    name: 'Customer Support Agent',
    purpose: 'Handle post-order queries, complaints and order status requests.',
    role: 'Inbound + outbound support',
    language: 'hi-en',
    voiceName: 'Ishaan (Hinglish)',
    personality: 'Empathetic and calm; never argues, always restates the issue before answering.',
    systemObjective: 'Resolve or correctly route every post-order query with a recorded outcome.',
    businessContext: 'Serving both buyers and suppliers in the marketplace after the deal is struck.',
    knowledgeBase: ['Order register', 'Dispatch & logistics status', 'Return policy', 'Escalation matrix'],
    tools: ['order.read', 'ticket.create', 'crm.upsertActivity', 'escalation.raise', 'whatsapp.sendSummary'],
    allowedActions: ['Answer order status', 'Raise a ticket', 'Escalate to the founder'],
    restrictedActions: ['Approve a refund', 'Accept liability for a dispute'],
    decisionRules: [
      'Any complaint is logged as a ticket before the call ends, regardless of whether it is resolved.',
      'A dispute about money or liability is escalated without any attempt to resolve it on the call.',
    ],
    successCriteria: ['Query answered or ticket raised', 'CRM activity created'],
    failureCriteria: ['Caller abandons before identification'],
    escalationRules: ['Complaint raised', 'Payment dispute', 'Confidence below threshold'],
    workingHours: 'Mon–Sat 09:00–20:00 IST',
    maxCallsPerDay: 140,
    escalationThreshold: 0.5,
    status: 'active',
    approvalState: 'approved',
  },
  {
    key: 'payment_reminder',
    name: 'Payment Reminder Agent',
    purpose: 'Remind buyers about overdue invoices without damaging the relationship.',
    role: 'Outbound collections',
    language: 'en-IN',
    voiceName: 'Vikram (Indian English)',
    personality: 'Firm, factual and non-confrontational; states amounts exactly as recorded.',
    systemObjective: 'Confirm the payment date and the reason for any delay, and record both.',
    businessContext: 'Working-capital protection for a very small company. Tone matters more than pressure.',
    knowledgeBase: ['Invoice register', 'Payment terms', 'Aging buckets', 'Dispute history'],
    tools: ['invoice.read', 'crm.upsertActivity', 'whatsapp.sendSummary', 'escalation.raise'],
    allowedActions: ['Quote the exact outstanding amount', 'Record a promised payment date', 'Send a WhatsApp summary'],
    restrictedActions: ['Threaten legal action', 'Offer a discount or write-off', 'Restructure payment terms'],
    decisionRules: [
      'Never state an amount that has not been read from the invoice register in this call.',
      'Any dispute about the amount is escalated immediately — no negotiation.',
      'If a payment date is promised, create the follow-up task for that date before ending the call.',
    ],
    successCriteria: ['Payment date confirmed and recorded', 'Follow-up task created'],
    failureCriteria: ['Buyer disputes the invoice on the call'],
    escalationRules: ['Payment dispute', 'Confidence below threshold', 'Amount above authority'],
    workingHours: 'Mon–Fri 10:00–17:30 IST',
    maxCallsPerDay: 50,
    escalationThreshold: 0.65,
    status: 'paused',
    approvalState: 'approved',
  },
  {
    key: 'lead_qualification',
    name: 'Lead Qualification Agent',
    purpose: 'First-touch qualification of new marketplace leads.',
    role: 'Outbound lead qualifying',
    language: 'en-IN',
    voiceName: 'Ananya (Indian English)',
    personality: 'Energetic and brief; aims to qualify or disqualify in under three minutes.',
    systemObjective: 'Decide quickly whether a new lead is worth a human’s time, and record why.',
    businessContext: 'Volume lead intake. The founder has no time for unqualified calls.',
    knowledgeBase: ['Ideal customer profile', 'Product taxonomy', 'Scoring rubric'],
    tools: ['lead.read', 'lead.update', 'rfq.create', 'crm.upsertActivity', 'calendar.schedule'],
    allowedActions: ['Score a lead', 'Book a discovery call', 'Mark not-a-fit'],
    restrictedActions: ['Quote pricing', 'Promise delivery dates'],
    decisionRules: [
      'A lead outside the ICP is marked not-a-fit with a reason, never left in the pipeline.',
      'A lead scoring above 70 is booked into the founder’s calendar within the call.',
    ],
    successCriteria: ['Lead scored and routed', 'Next step recorded'],
    failureCriteria: ['Three attempts without contact'],
    escalationRules: ['Contact requests the founder', 'Confidence below threshold'],
    workingHours: 'Mon–Sat 09:00–20:00 IST',
    maxCallsPerDay: 150,
    escalationThreshold: 0.52,
    status: 'active',
    approvalState: 'approved',
  },
]

// ─────────────────────────────────────────────────────────────
// CALL FLOW (node graph) — shared shape for the flow builder
// ─────────────────────────────────────────────────────────────

export interface FlowNode {
  id: string
  type: 'start' | 'action' | 'decision' | 'extract' | 'integration' | 'escalate' | 'end'
  label: string
  detail?: string
  branch?: 'yes' | 'no'
  x: number
  y: number
}

export interface FlowEdge {
  from: string
  to: string
  label?: string
}

export const RFQ_CALL_FLOW: { nodes: FlowNode[]; edges: FlowEdge[] } = {
  nodes: [
    { id: 'start', type: 'start', label: 'START', detail: 'Campaign trigger fires', x: 0, y: 0 },
    { id: 'load', type: 'action', label: 'Load Contact', detail: 'Supplier master + RFQ context', x: 0, y: 1 },
    { id: 'permission', type: 'decision', label: 'Check Calling Permission', detail: 'Consent + DNC + calling hours', x: 0, y: 2 },
    { id: 'dial', type: 'action', label: 'Call Number', detail: 'SIP bridge — simulated in prototype', x: 0, y: 3 },
    { id: 'answered', type: 'decision', label: 'Answered?', x: 0, y: 4 },
    { id: 'retry', type: 'action', label: 'Retry Logic', detail: 'Backoff · max 3 attempts', branch: 'no', x: -1, y: 5 },
    { id: 'callback', type: 'action', label: 'Schedule Callback', branch: 'no', x: -1, y: 6 },
    { id: 'intro', type: 'action', label: 'Introduce Agent', detail: 'Disclose AI + record notice', branch: 'yes', x: 0, y: 5 },
    { id: 'identify_person', type: 'action', label: 'Identify Person', x: 0, y: 6 },
    { id: 'identify_intent', type: 'action', label: 'Identify Intent', x: 0, y: 7 },
    { id: 'ask', type: 'action', label: 'Ask Objective Questions', detail: 'Product · Qty · Price · MOQ', x: 0, y: 8 },
    { id: 'extract', type: 'extract', label: 'Extract Information', detail: 'Structured slot filling', x: 0, y: 9 },
    { id: 'crm', type: 'integration', label: 'Update CRM', x: -1, y: 10 },
    { id: 'rfq', type: 'integration', label: 'Update RFQ', x: 1, y: 10 },
    { id: 'decision', type: 'decision', label: 'Decision', x: 0, y: 11 },
    { id: 'qualified', type: 'integration', label: 'Create Quote / RFQ action', branch: 'yes', x: -1, y: 12 },
    { id: 'cb2', type: 'action', label: 'Schedule Callback', branch: 'no', x: 0, y: 12 },
    { id: 'human', type: 'escalate', label: 'Escalate to Founder', branch: 'no', x: 1, y: 12 },
    { id: 'end', type: 'end', label: 'END', detail: 'Log call · write operating memory', x: 0, y: 13 },
  ],
  edges: [
    { from: 'start', to: 'load' },
    { from: 'load', to: 'permission' },
    { from: 'permission', to: 'dial', label: 'allowed' },
    { from: 'permission', to: 'cb2', label: 'blocked' },
    { from: 'dial', to: 'answered' },
    { from: 'answered', to: 'retry', label: 'no' },
    { from: 'retry', to: 'callback' },
    { from: 'answered', to: 'intro', label: 'yes' },
    { from: 'intro', to: 'identify_person' },
    { from: 'identify_person', to: 'identify_intent' },
    { from: 'identify_intent', to: 'ask' },
    { from: 'ask', to: 'extract' },
    { from: 'extract', to: 'crm' },
    { from: 'extract', to: 'rfq' },
    { from: 'crm', to: 'decision' },
    { from: 'rfq', to: 'decision' },
    { from: 'decision', to: 'qualified', label: 'qualified' },
    { from: 'decision', to: 'cb2', label: 'callback' },
    { from: 'decision', to: 'human', label: 'human' },
    { from: 'qualified', to: 'end' },
    { from: 'cb2', to: 'end' },
    { from: 'human', to: 'end' },
  ],
}

export const NODE_TYPE_META: Record<FlowNode['type'], { label: string; tone: string }> = {
  start: { label: 'Start', tone: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  action: { label: 'Action', tone: 'bg-blue-50 border-blue-200 text-blue-700' },
  decision: { label: 'Decision', tone: 'bg-amber-50 border-amber-200 text-amber-700' },
  extract: { label: 'Extract', tone: 'bg-violet-50 border-violet-200 text-violet-700' },
  integration: { label: 'Integration', tone: 'bg-teal-50 border-teal-200 text-teal-700' },
  escalate: { label: 'Escalate', tone: 'bg-red-50 border-red-200 text-red-700' },
  end: { label: 'End', tone: 'bg-gray-100 border-gray-200 text-gray-600' },
}

// ─────────────────────────────────────────────────────────────
// SCRIPTS
// ─────────────────────────────────────────────────────────────

export const SCRIPT_BLUEPRINTS = [
  {
    code: 'SCR-RFQ-FOLLOWUP',
    name: 'Supplier RFQ Follow-up',
    agentKey: 'rfq_followup',
    language: 'hi-en',
    tone: 'courteous, business-like',
    opening:
      'Hello, this is the {{company_name}} supplier assistant calling regarding an RFQ for {{product}}. Is this a good time to talk for two minutes?',
    verification: 'Am I speaking with {{supplier_name}} from {{company_name}}? May I confirm your GSTIN ending in {{gst_last4}}?',
    purpose: 'We sent RFQ {{rfq_number}} for {{quantity}} of {{product}} on WhatsApp and have not received your response yet.',
    questions: 'Can you supply {{quantity}}? {{What is your price per unit?}} {{What is your MOQ?}} {{What delivery timeline can you commit to?}}',
    objections: 'If "price is too high": note the target is {{target_price}} and ask for the best possible rate. If "no capacity": ask for the maximum quantity available.',
    negotiation: 'You may confirm the supplier’s stated price but never commit the buyer to it. Anything beyond ±15% of the RFQ target is escalated.',
    closing: 'Thank you. I have recorded {{price}} per {{unit}} with delivery in {{delivery_days}} days. I will send a written summary on WhatsApp.',
    escalation: 'Transfer to the founder when the supplier disputes terms, raises a complaint, or the negotiation exceeds agent authority.',
    fallback: 'If the contact is unavailable: offer a callback slot and confirm it before ending the call.',
    variables: ['buyer_name', 'supplier_name', 'company_name', 'rfq_number', 'product', 'quantity', 'target_date', 'target_price', 'price', 'unit', 'delivery_days', 'gst_last4'],
  },
  {
    code: 'SCR-QUOTE-COLLECT',
    name: 'Quotation Collection',
    agentKey: 'quote_collection',
    language: 'hi-IN',
    tone: 'polite, persistent',
    opening: 'Namaste, {{supplier_name}} ji. {{company_name}} se baat kar rahe hain — RFQ {{rfq_number}} ke liye quotation pending hai.',
    verification: 'Kya main {{supplier_name}} ji se baat kar raha hoon?',
    purpose: 'Aapka quotation {{days_pending}} din se pending hai. Kya aaj confirm kar sakte hain?',
    questions: 'Aapka final rate kya rahega? Delivery kitne din mein? Quantity {{quantity}} confirm hai?',
    objections: 'Agar rate change hua hai to naya rate note karein. Decline karne par reason zaroor record karein.',
    negotiation: 'Buyer ke target rate par commit na karein. Sirf supplier ka stated rate record karein.',
    closing: 'Dhanyavaad. Main rate {{price}} aur delivery {{delivery_days}} din record kar raha hoon.',
    escalation: 'Founder ko transfer karein jab rate authority se bahar ho.',
    fallback: 'Contact available na ho to WhatsApp par summary bhejein aur callback schedule karein.',
    variables: ['supplier_name', 'company_name', 'rfq_number', 'quantity', 'days_pending', 'price', 'delivery_days'],
  },
  {
    code: 'SCR-BUYER-QUALIFY',
    name: 'Buyer Lead Qualification',
    agentKey: 'buyer_qualification',
    language: 'en-IN',
    tone: 'consultative',
    opening: 'Hello {{buyer_name}}, this is the {{company_name}} marketplace assistant. You enquired about {{product}} — is now a good time?',
    verification: 'May I confirm I am speaking with {{buyer_name}} from {{company_name}}?',
    purpose: 'I would like to understand your requirement precisely so we can match the right suppliers.',
    questions: 'What quantity do you need? {{What is your target price?}} {{Where should it be delivered?}} {{By when do you need it?}}',
    objections: 'If "just checking prices": capture the range and offer a written comparison instead of a firm quote.',
    negotiation: 'Never quote a firm price. Only reference the published price band.',
    closing: 'Thank you — I have created RFQ {{rfq_number}} and will send suitable supplier options today.',
    escalation: 'Escalate high-value requirements above the founder’s authority threshold.',
    fallback: 'If unreachable, schedule a callback and send a WhatsApp summary.',
    variables: ['buyer_name', 'company_name', 'rfq_number', 'product', 'quantity', 'target_date'],
  },
  {
    code: 'SCR-PAYMENT-REMINDER',
    name: 'Payment Reminder',
    agentKey: 'payment_reminder',
    language: 'en-IN',
    tone: 'firm, factual',
    opening: 'Hello, this is a courtesy reminder from {{company_name}} regarding invoice {{invoice_number}}. Is this a convenient time?',
    verification: 'Am I speaking with {{buyer_name}} from the accounts team at {{company_name}}?',
    purpose: 'Invoice {{invoice_number}} for {{amount}} fell due on {{due_date}} and remains outstanding.',
    questions: 'By what date can we expect the payment? {{Is there an issue with the invoice itself?}}',
    objections: 'Any dispute about the amount is escalated immediately — do not negotiate on the call.',
    negotiation: 'No discount, write-off or restructuring may be offered.',
    closing: 'Thank you. I have recorded {{promised_date}} as the expected payment date and will send a confirmation.',
    escalation: 'Payment disputes and amounts above authority go to the founder immediately.',
    fallback: 'If the accounts contact is unavailable, ask for the correct person and schedule a callback.',
    variables: ['company_name', 'buyer_name', 'invoice_number', 'amount', 'due_date', 'promised_date'],
  },
  {
    code: 'SCR-SUPPORT-INBOUND',
    name: 'Inbound Support & Reception',
    agentKey: 'customer_support',
    language: 'hi-en',
    tone: 'empathetic',
    opening: 'Thank you for calling {{company_name}}. This is the AI assistant — how may I help you today?',
    verification: 'May I have your name and the company you are calling from?',
    purpose: 'I can help with order status, quotations, RFQ enquiries and general questions, and I can connect you to a person if needed.',
    questions: 'Could you share the order or RFQ reference? {{Which product is this regarding?}}',
    objections: 'If the caller is frustrated: acknowledge, restate the issue, and offer a human transfer without argument.',
    negotiation: 'No commitments on refunds, liability or credits — those are escalated.',
    closing: 'I have logged this as ticket {{ticket_id}} and you will receive an update on WhatsApp.',
    escalation: 'Complaints, payment disputes and human requests transfer to the founder immediately.',
    fallback: 'If the intent is unknown after two clarifications, take a message and schedule a callback.',
    variables: ['company_name', 'ticket_id', 'order_number', 'rfq_number'],
  },
  {
    code: 'SCR-APPOINTMENT',
    name: 'Appointment Scheduling',
    agentKey: 'appointment',
    language: 'en-IN',
    tone: 'crisp',
    opening: 'Hello {{contact_name}}, I am calling from {{company_name}} to fix a short call regarding {{topic}}.',
    verification: 'Is this still a good number to reach you on?',
    purpose: 'We would like to book 20 minutes with our founder to take {{topic}} forward.',
    questions: 'Would {{slot_1}} or {{slot_2}} work better? {{Which number should we call you on?}}',
    objections: 'If neither slot works, propose a softer hold and confirm it on WhatsApp.',
    negotiation: 'No commitments on pricing or terms during scheduling.',
    closing: 'Confirmed — I have booked {{slot_1}} and sent a calendar invite with a WhatsApp reminder.',
    escalation: 'If the contact asks for the founder directly, escalate rather than booking.',
    fallback: 'If no slot in 14 days, create a task for manual scheduling.',
    variables: ['contact_name', 'company_name', 'topic', 'slot_1', 'slot_2'],
  },
  {
    code: 'SCR-LEAD-QUALIFY',
    name: 'New Lead Qualification',
    agentKey: 'lead_qualification',
    language: 'en-IN',
    tone: 'brisk',
    opening: 'Hi {{contact_name}}, this is the {{company_name}} assistant. You enquired with us yesterday — do you have two minutes?',
    verification: 'Just to confirm, I am speaking with {{contact_name}} from {{company_name}}?',
    purpose: 'I will ask three quick questions to route you to the right person.',
    questions: 'What are you looking to buy? {{What quantity and by when?}} {{Are you the decision maker for this purchase?}}',
    objections: 'If "send me an email instead": capture the requirement anyway and send the summary on WhatsApp.',
    negotiation: 'No pricing discussion at qualification stage.',
    closing: 'Thank you — I have scored your requirement and a specialist will call you within one working day.',
    escalation: 'Requests for the founder or high-value signals escalate immediately.',
    fallback: 'Mark not-a-fit with a reason rather than leaving the lead open.',
    variables: ['contact_name', 'company_name', 'product', 'quantity'],
  },
  {
    code: 'SCR-SUPPLIER-QUALIFY',
    name: 'Supplier Qualification',
    agentKey: 'supplier_qualification',
    language: 'en-IN',
    tone: 'verification-minded',
    opening: 'Good morning, this is {{company_name}} calling about your marketplace registration. Is this a good time?',
    verification: 'May I confirm your GSTIN and the registered company name?',
    purpose: 'We verify a few details before releasing your profile to buyer matching.',
    questions: 'What is your monthly capacity? {{Which certifications do you hold?}} {{Do you export?}}',
    objections: 'If documents are unavailable, request them on WhatsApp and mark the profile on-hold.',
    negotiation: 'No order-volume promises may be made.',
    closing: 'Thank you — I have recorded your details and will request documents on WhatsApp.',
    escalation: 'Suspected misrepresentation escalates to the founder immediately.',
    fallback: 'If verification cannot complete, keep the profile on-hold and re-queue in 48 hours.',
    variables: ['company_name', 'supplier_name', 'gst_last4'],
  },
] as const

// ─────────────────────────────────────────────────────────────
// CAMPAIGN TEMPLATES
// ─────────────────────────────────────────────────────────────

export const CAMPAIGN_BLUEPRINTS = [
  { code: 'CMP-RFQ-FOLLOWUP', name: 'Supplier RFQ Follow-up', agentKey: 'rfq_followup', scriptCode: 'SCR-RFQ-FOLLOWUP', targetAudience: 'Suppliers matched to an open RFQ with no response in 2h', contactSource: 'RFQ matching engine', objective: 'Collect a structured quotation', status: 'running', maxCallsPerDay: 120 },
  { code: 'CMP-BUYER-QUALIFY', name: 'Buyer Lead Qualification', agentKey: 'buyer_qualification', scriptCode: 'SCR-BUYER-QUALIFY', targetAudience: 'Newly captured buyer leads, unqualified', contactSource: 'Marketplace inbound', objective: 'Qualify and create a structured RFQ', status: 'running', maxCallsPerDay: 90 },
  { code: 'CMP-QUOTE-REMINDER', name: 'Quotation Reminder', agentKey: 'quote_collection', scriptCode: 'SCR-QUOTE-COLLECT', targetAudience: 'Suppliers with a quote pending over 48 hours', contactSource: 'Quote register', objective: 'Refresh or collect the outstanding quote', status: 'running', maxCallsPerDay: 100 },
  { code: 'CMP-ORDER-CONFIRM', name: 'Order Confirmation', agentKey: 'customer_support', scriptCode: 'SCR-SUPPORT-INBOUND', targetAudience: 'Orders confirmed in the last 24 hours', contactSource: 'Order register', objective: 'Confirm order details and delivery slot', status: 'paused', maxCallsPerDay: 60 },
  { code: 'CMP-PAYMENT-REMINDER', name: 'Payment Reminder', agentKey: 'payment_reminder', scriptCode: 'SCR-PAYMENT-REMINDER', targetAudience: 'Invoices overdue by more than 7 days', contactSource: 'Invoice aging report', objective: 'Confirm the expected payment date', status: 'paused', maxCallsPerDay: 50 },
  { code: 'CMP-SUPPLIER-REACTIVATE', name: 'Inactive Supplier Reactivation', agentKey: 'supplier_qualification', scriptCode: 'SCR-SUPPLIER-QUALIFY', targetAudience: 'Suppliers with no activity in 60 days', contactSource: 'Supplier master', objective: 'Re-verify capacity and re-activate the profile', status: 'scheduled', maxCallsPerDay: 80 },
  { code: 'CMP-LEAD-QUALIFY', name: 'New Lead Qualification', agentKey: 'lead_qualification', scriptCode: 'SCR-LEAD-QUALIFY', targetAudience: 'Leads created in the last 12 hours', contactSource: 'Lead inbox', objective: 'Score and route the lead', status: 'running', maxCallsPerDay: 150 },
  { code: 'CMP-APPOINTMENT', name: 'Appointment Scheduling', agentKey: 'appointment', scriptCode: 'SCR-APPOINTMENT', targetAudience: 'Contacts who requested a founder conversation', contactSource: 'Escalation center', objective: 'Book a slot with the founder', status: 'running', maxCallsPerDay: 70 },
  { code: 'CMP-CSAT', name: 'Customer Satisfaction', agentKey: 'customer_support', scriptCode: 'SCR-SUPPORT-INBOUND', targetAudience: 'Buyers with a delivered order in the last 7 days', contactSource: 'Order register', objective: 'Capture a satisfaction score and any complaint', status: 'draft', maxCallsPerDay: 100 },
  { code: 'CMP-RFQ-RESPONSE-REMINDER', name: 'RFQ Response Reminder', agentKey: 'rfq_followup', scriptCode: 'SCR-RFQ-FOLLOWUP', targetAudience: 'Buyers whose RFQ has received fewer than 3 quotes', contactSource: 'RFQ register', objective: 'Remind the buyer and widen the supplier set', status: 'draft', maxCallsPerDay: 90 },
] as const

// ─────────────────────────────────────────────────────────────
// PROVIDERS — telephony, SIP, STT, TTS, LLM, voice, recording
// ─────────────────────────────────────────────────────────────

export const PROVIDER_BLUEPRINTS = [
  { key: 'tel-primary-sip', name: 'Primary SIP Line', category: 'Telephony', vendor: 'Commercial SIP line', status: 'enabled', latencyMs: 38, costPerUnit: 0.9, costUnit: 'per minute', health: 99, isDefault: true, isFallback: false, region: 'Mumbai (IN-W) — simulated' },
  { key: 'tel-virtual-trunk', name: 'Virtual Number Trunk', category: 'Telephony', vendor: 'Virtual number / SIP trunk', status: 'enabled', latencyMs: 52, costPerUnit: 0.75, costUnit: 'per minute', health: 97, isDefault: false, isFallback: true, region: 'Bengaluru (IN-S) — simulated' },
  { key: 'tel-gsm-gateway', name: 'GSM Gateway (SIM Bank)', category: 'Telephony', vendor: '4/8-port GSM gateway', status: 'disabled', latencyMs: 210, costPerUnit: 0.35, costUnit: 'per minute', health: 78, isDefault: false, isFallback: true, region: 'On-premise — simulated' },
  { key: 'sip-bridge-asterisk', name: 'SIP Protocol Bridge', category: 'SIP', vendor: 'Asterisk / FreeSWITCH-compatible', status: 'enabled', latencyMs: 12, costPerUnit: 0, costUnit: 'self-hosted', health: 100, isDefault: true, isFallback: false, region: 'Self-hosted' },
  { key: 'sip-pjsua-stack', name: 'PJSIP Endpoint Stack', category: 'SIP', vendor: 'PJSIP', status: 'enabled', latencyMs: 9, costPerUnit: 0, costUnit: 'self-hosted', health: 99, isDefault: false, isFallback: true, region: 'Self-hosted' },
  { key: 'stt-whisper-local', name: 'Self-hosted Whisper ASR', category: 'STT', vendor: 'faster-whisper (large-v3)', status: 'enabled', latencyMs: 310, costPerUnit: 0.004, costUnit: 'per minute', health: 98, isDefault: true, isFallback: false, region: 'Self-hosted GPU node' },
  { key: 'stt-whisper-small', name: 'Whisper ASR (small)', category: 'STT', vendor: 'faster-whisper (small)', status: 'enabled', latencyMs: 140, costPerUnit: 0.0015, costUnit: 'per minute', health: 97, isDefault: false, isFallback: true, region: 'Self-hosted CPU node' },
  { key: 'stt-cloud-eu', name: 'Managed Streaming ASR', category: 'STT', vendor: 'Managed cloud ASR', status: 'disabled', latencyMs: 220, costPerUnit: 0.024, costUnit: 'per minute', health: 92, isDefault: false, isFallback: false, region: 'EU — not connected' },
  { key: 'tts-piper-local', name: 'Self-hosted TTS (Piper)', category: 'TTS', vendor: 'Piper', status: 'enabled', latencyMs: 180, costPerUnit: 0.001, costUnit: 'per minute', health: 99, isDefault: true, isFallback: false, region: 'Self-hosted' },
  { key: 'tts-coqui-indic', name: 'Indic TTS Multilingual', category: 'TTS', vendor: 'Self-hosted (Indic voices)', status: 'enabled', latencyMs: 240, costPerUnit: 0.0018, costUnit: 'per minute', health: 96, isDefault: false, isFallback: true, region: 'Self-hosted' },
  { key: 'llm-local-70b', name: 'Local Inference 70B', category: 'LLM', vendor: 'Self-hosted open weights', status: 'enabled', latencyMs: 640, costPerUnit: 0.09, costUnit: 'per 1k tokens', health: 97, isDefault: true, isFallback: false, region: 'Self-hosted GPU node' },
  { key: 'llm-router-bell24h', name: 'Bell24h AI Router', category: 'LLM', vendor: 'Bell24h-OS router', status: 'enabled', latencyMs: 380, costPerUnit: 0.35, costUnit: 'per 1k tokens', health: 99, isDefault: false, isFallback: true, region: 'In-platform' },
  { key: 'voice-clone-registry', name: 'Voice Clone Registry', category: 'Voice', vendor: 'Self-hosted voice store', status: 'enabled', latencyMs: 60, costPerUnit: 0, costUnit: 'per use', health: 100, isDefault: true, isFallback: false, region: 'Self-hosted' },
  { key: 'rec-minio-s3', name: 'Object Store (Recordings)', category: 'Recording', vendor: 'S3-compatible object store', status: 'enabled', latencyMs: 25, costPerUnit: 0.0012, costUnit: 'per GB-month', health: 100, isDefault: true, isFallback: false, region: 'On-premise' },
]

export const PROVIDER_CATEGORIES = ['Telephony', 'SIP', 'STT', 'TTS', 'LLM', 'Voice', 'Recording'] as const

// ─────────────────────────────────────────────────────────────
// VOICE LIBRARY
// ─────────────────────────────────────────────────────────────

export const VOICE_BLUEPRINTS = [
  { key: 'vx-ananya-hinglish', name: 'Ananya', language: 'hi-en', gender: 'female', style: 'warm, conversational', speed: 1.0, pitch: 1.02, provider: 'Self-hosted TTS (Piper)', accent: 'Hinglish', isDefault: true },
  { key: 'vx-rohan-hindi', name: 'Rohan', language: 'hi-IN', gender: 'male', style: 'clear, patient', speed: 0.96, pitch: 0.97, provider: 'Indic TTS Multilingual', accent: 'Hindi', isDefault: false },
  { key: 'vx-arjun-english', name: 'Arjun', language: 'en-IN', gender: 'male', style: 'professional', speed: 1.02, pitch: 0.99, provider: 'Self-hosted TTS (Piper)', accent: 'Indian English', isDefault: true },
  { key: 'vx-kavya-english', name: 'Kavya', language: 'en-IN', gender: 'female', style: 'consultative', speed: 0.98, pitch: 1.04, provider: 'Self-hosted TTS (Piper)', accent: 'Indian English' },
  { key: 'vx-neha-english', name: 'Neha', language: 'en-IN', gender: 'female', style: 'crisp, brisk', speed: 1.08, pitch: 1.01, provider: 'Self-hosted TTS (Piper)', accent: 'Indian English' },
  { key: 'vx-ishaan-hinglish', name: 'Ishaan', language: 'hi-en', gender: 'male', style: 'empathetic', speed: 0.94, pitch: 0.96, provider: 'Indic TTS Multilingual', accent: 'Hinglish' },
  { key: 'vx-vikram-english', name: 'Vikram', language: 'en-IN', gender: 'male', style: 'firm, factual', speed: 0.95, pitch: 0.92, provider: 'Self-hosted TTS (Piper)', accent: 'Indian English' },
  { key: 'vx-meera-marathi', name: 'Meera', language: 'mr-IN', gender: 'female', style: 'friendly', speed: 0.97, pitch: 1.03, provider: 'Indic TTS Multilingual', accent: 'Marathi' },
  { key: 'vx-jayesh-gujarati', name: 'Jayesh', language: 'gu-IN', gender: 'male', style: 'business-like', speed: 1.0, pitch: 0.98, provider: 'Indic TTS Multilingual', accent: 'Gujarati' },
  { key: 'vx-lakshmi-tamil', name: 'Lakshmi', language: 'ta-IN', gender: 'female', style: 'warm', speed: 0.96, pitch: 1.05, provider: 'Indic TTS Multilingual', accent: 'Tamil' },
  { key: 'vx-srinivas-telugu', name: 'Srinivas', language: 'te-IN', gender: 'male', style: 'formal', speed: 0.98, pitch: 0.95, provider: 'Indic TTS Multilingual', accent: 'Telugu' },
  { key: 'vx-arindam-bengali', name: 'Arindam', language: 'bn-IN', gender: 'male', style: 'courteous', speed: 0.97, pitch: 0.97, provider: 'Indic TTS Multilingual', accent: 'Bengali' },
  { key: 'vx-ananya-en', name: 'Ananya (EN)', language: 'en-IN', gender: 'female', style: 'neutral', speed: 1.0, pitch: 1.0, provider: 'Self-hosted TTS (Piper)', accent: 'Indian English', status: 'disabled' },
  { key: 'vx-riya-hindi', name: 'Riya', language: 'hi-IN', gender: 'female', style: 'upbeat', speed: 1.04, pitch: 1.06, provider: 'Indic TTS Multilingual', accent: 'Hindi' },
]

// ─────────────────────────────────────────────────────────────
// PHONE NUMBERS / LINES
// ─────────────────────────────────────────────────────────────

export const NUMBER_BLUEPRINTS = [
  { key: 'num-commercial-main', label: 'Commercial Number (Main)', masked: '+91 22 ••• ••42', channel: 'sip', provider: 'Primary SIP Line', region: 'Mumbai', assignedTo: 'AI Business Receptionist', capacity: 10, status: 'enabled' },
  { key: 'num-virtual-sales', label: 'Virtual Number — Sales', masked: '+91 80 ••• ••17', channel: 'sip-trunk', provider: 'Virtual Number Trunk', region: 'Bengaluru', assignedTo: 'Lead Qualification Agent', capacity: 8, status: 'enabled' },
  { key: 'num-virtual-support', label: 'Virtual Number — Support', masked: '+91 44 ••• ••83', channel: 'sip-trunk', provider: 'Virtual Number Trunk', region: 'Chennai', assignedTo: 'Customer Support Agent', capacity: 8, status: 'enabled' },
  { key: 'num-gsm-bank', label: 'GSM Gateway SIM Bank', masked: '+91 98 ••• ••05', channel: 'gsm', provider: 'GSM Gateway (SIM Bank)', region: 'On-premise', assignedTo: 'Outbound campaigns', capacity: 4, status: 'disabled' },
  { key: 'num-whatsapp-biz', label: 'WhatsApp Business Line', masked: '+91 22 ••• ••42', channel: 'whatsapp', provider: 'Primary SIP Line', region: 'Mumbai', assignedTo: 'Communication Hub', capacity: 20, status: 'enabled' },
]

// ─────────────────────────────────────────────────────────────
// AUTOMATION RULES — TRIGGER → CONDITION → AI DECISION → ACTION
// ─────────────────────────────────────────────────────────────

export const AUTOMATION_BLUEPRINTS = [
  { code: 'AUT-RFQ-NO-RESPONSE', name: 'RFQ silence → AI call', trigger: 'New RFQ dispatched', conditions: 'No supplier response after 2 hours', aiDecision: 'Check supplier priority tier and past responsiveness', action: 'Start AI call campaign', agentKey: 'rfq_followup', channel: 'voice', runCount: 184 },
  { code: 'AUT-QUOTE-NO-REPLY', name: 'Quote received → buyer follow-up', trigger: 'Quote received', conditions: 'Buyer has not responded for 24 hours', aiDecision: 'Score quote competitiveness against the target price', action: 'AI follow-up on WhatsApp, then voice', agentKey: 'buyer_qualification', channel: 'whatsapp', runCount: 126 },
  { code: 'AUT-MISSED-INBOUND', name: 'Missed inbound call → callback job', trigger: 'Missed inbound call', conditions: 'No active conversation for the caller', aiDecision: 'Identify caller from CRM and infer intent', action: 'Create callback job and call back', agentKey: 'customer_support', channel: 'voice', runCount: 73 },
  { code: 'AUT-SUPPLIER-UNAVAILABLE', name: 'Supplier unavailable → re-source', trigger: 'Supplier says unavailable', conditions: 'RFQ still open and within the buyer deadline', aiDecision: 'Rank alternative suppliers by match score', action: 'Update supplier status and find alternatives', agentKey: null, channel: 'voice', runCount: 41 },
  { code: 'AUT-LEAD-CREATED', name: 'Lead created → qualification call', trigger: 'Lead created', conditions: 'Lead score above the qualification floor', aiDecision: 'Apply the ICP scoring rubric', action: 'Start AI qualification call', agentKey: 'lead_qualification', channel: 'voice', runCount: 312 },
  { code: 'AUT-CALL-COMPLETED', name: 'Call completed → extract & propagate', trigger: 'Call completed', conditions: 'Transcript has at least one extractable field', aiDecision: 'Extract structured fields and resolve the owning entity', action: 'Update CRM, create the next task', agentKey: null, channel: 'voice', runCount: 428 },
  { code: 'AUT-LOW-CONFIDENCE', name: 'Low confidence → human escalation', trigger: 'Agent confidence below threshold', conditions: 'Confidence below the agent escalation threshold', aiDecision: 'Determine whether a human is genuinely required', action: 'Raise an escalation and summarise the call', agentKey: null, channel: 'voice', runCount: 58 },
  { code: 'AUT-CALLBACK-DUE', name: 'Callback due → place call', trigger: 'Callback scheduled time reached', conditions: 'Contact is inside calling hours and not on the DNC list', aiDecision: 'Confirm consent status and pick the best agent', action: 'Place the scheduled callback call', agentKey: 'appointment', channel: 'voice', runCount: 96 },
  { code: 'AUT-BUDGET-GUARD', name: 'Daily call budget → throttle', trigger: 'Daily call volume threshold reached', conditions: 'Total calls today above the configured cap', aiDecision: 'Rank remaining jobs by expected value', action: 'Pause low-priority campaigns for the day', agentKey: null, channel: 'voice', runCount: 12 },
  { code: 'AUT-RETRY-EXHAUSTED', name: 'Retry exhausted → mark failed', trigger: 'Maximum attempts reached', conditions: 'All retry attempts unanswered', aiDecision: 'Decide between a final WhatsApp nudge and closing the job', action: 'Mark the job failed and notify the owner', agentKey: null, channel: 'whatsapp', runCount: 27 },
]

// ─────────────────────────────────────────────────────────────
// POLICY / SAFETY LAYER
// ─────────────────────────────────────────────────────────────

export const POLICY_BLUEPRINTS = [
  { key: 'max_daily_calls', label: 'Maximum daily calls', category: 'volume', value: '400', valueType: 'number', unit: 'calls/day', description: 'Hard cap across every campaign. The automation engine pauses low-priority work at this ceiling.' },
  { key: 'max_attempts_per_contact', label: 'Maximum attempts per contact', category: 'volume', value: '3', valueType: 'number', unit: 'attempts', description: 'After the final attempt the job is closed and the owner is notified.' },
  { key: 'calling_hours_start', label: 'Calling hours — start', category: 'schedule', value: '09:30', valueType: 'time', unit: 'IST', description: 'No outbound call is placed before this time, regardless of campaign configuration.' },
  { key: 'calling_hours_end', label: 'Calling hours — end', category: 'schedule', value: '19:00', valueType: 'time', unit: 'IST', description: 'No outbound call is placed after this time. Callbacks roll to the next working day.' },
  { key: 'dnc_list_size', label: 'Do-not-call list', category: 'consent', value: '37', valueType: 'number', unit: 'contacts', description: 'Contacts suppressed from every campaign. Checked before every dial.' },
  { key: 'consent_required', label: 'Explicit consent required', category: 'consent', value: 'true', valueType: 'boolean', unit: null, description: 'A contact without recorded consent can never be called by an AI agent.' },
  { key: 'escalation_threshold', label: 'Global escalation threshold', category: 'safety', value: '0.58', valueType: 'number', unit: 'confidence', description: 'Calls below this confidence are transferred to the founder. Agents may set a stricter local threshold.' },
  { key: 'max_negotiation_authority', label: 'Maximum negotiation authority', category: 'safety', value: '15', valueType: 'number', unit: '% from target', description: 'AI agents may never commit to a price beyond this band without human approval.' },
  { key: 'approved_topics', label: 'Approved topics', category: 'safety', value: 'RFQ status, quotation, delivery timeline, availability, order status, callback scheduling', valueType: 'list', unit: null, description: 'The only subjects an agent may discuss in depth.' },
  { key: 'restricted_topics', label: 'Restricted topics', category: 'safety', value: 'Legal action, refunds, credit terms, contract amendments, competitor disparagement', valueType: 'list', unit: null, description: 'Any call touching these topics escalates immediately, without exception.' },
  { key: 'recording_policy', label: 'Recording policy', category: 'privacy', value: 'announce-and-store', valueType: 'string', unit: null, description: 'Every call announces AI disclosure and the recording notice before the conversation begins.' },
  { key: 'data_retention_days', label: 'Recording retention', category: 'privacy', value: '90', valueType: 'number', unit: 'days', description: 'Transcripts are retained for 365 days; audio is purged at 90 days.' },
  { key: 'agent_approval_required', label: 'Agent approval required', category: 'governance', value: 'true', valueType: 'boolean', unit: null, description: 'A new or edited agent cannot place calls until the founder approves it.' },
  { key: 'founder_kill_switch', label: 'Founder kill switch', category: 'governance', value: 'armed', valueType: 'string', unit: null, description: 'Halts every agent and campaign immediately. Individual agents can also be disabled on their own.' },
]

// ─────────────────────────────────────────────────────────────
// RECEPTIONIST FAQS
// ─────────────────────────────────────────────────────────────

export const RECEPTIONIST_FAQS = [
  { intent: 'RFQ enquiry', answer: 'I can raise a new RFQ for you right now. I will need the product, quantity, delivery location and your target date.', route: 'rfq.create' },
  { intent: 'Supplier enquiry', answer: 'I can register you as a supplier. I will need your GSTIN, category, monthly capacity and the best contact number.', route: 'supplier.onboard' },
  { intent: 'Order status', answer: 'I can check your order. Please share the order reference and I will read out the current dispatch status.', route: 'order.read' },
  { intent: 'Quotation status', answer: 'Let me check how many supplier quotes have come in for your RFQ and when the next ones are expected.', route: 'quote.read' },
  { intent: 'General enquiry', answer: 'I can help with the marketplace, pricing bands, delivery timelines and how matching works.', route: 'faq.answer' },
  { intent: 'Technical support', answer: 'Please describe the issue. If it needs an engineer I will raise a ticket and arrange a callback.', route: 'ticket.create' },
  { intent: 'Payment enquiry', answer: 'I can confirm what our records show. Any dispute about an amount is transferred to a person.', route: 'invoice.read' },
  { intent: 'Human assistance', answer: 'Of course — let me transfer you to the founder. If they are unavailable I will arrange a callback within two hours.', route: 'escalation.raise' },
]

// ─────────────────────────────────────────────────────────────
// CALL GENERATION
// ─────────────────────────────────────────────────────────────

export interface GeneratedTurn {
  speaker: 'AI' | 'Contact'
  text: string
  atSec: number
  sentiment?: string
}

export interface GeneratedCall {
  ref: string
  campaignCode: string | null
  agentKey: string
  contactName: string
  company: string
  contactRole: string
  phoneMasked: string
  entityType: 'supplier' | 'buyer'
  direction: 'outbound' | 'inbound'
  status: CallStatus
  state: LiveState | null
  intent: string
  objective: string
  sentiment: string
  confidence: number
  durationSec: number
  outcome: string
  nextAction: string
  summary: string
  extractedData: Record<string, string | number | null> | null
  rfqNumber: string | null
  quoteAmount: number | null
  language: string
  costUsd: number
  attempt: number
  startedAt: Date
  endedAt: Date | null
  createdAt: Date
  turns: GeneratedTurn[]
}

const INTENT_OBJECTIVE: Record<string, string> = {
  'RFQ Follow-up': 'Confirm 500-unit capacity and delivery date',
  'Supplier Qualification': 'Verify GST, capacity and certifications',
  'Buyer Qualification': 'Capture a complete structured requirement',
  'Quote Collection': 'Collect or refresh the outstanding quotation',
  'Appointment Scheduling': 'Book a 20-minute slot with the founder',
  'Payment Reminder': 'Confirm the expected payment date',
  'Order Confirmation': 'Confirm the order and delivery slot',
  'Lead Qualification': 'Score the lead and route it',
  'Supplier Reactivation': 'Re-verify capacity and reactivate the profile',
  'Satisfaction Survey': 'Capture satisfaction score and any complaint',
  'RFQ enquiry': 'Capture a new requirement and raise an RFQ',
  'Supplier enquiry': 'Register a new supplier',
  'Order status': 'Read out the current dispatch status',
  'Quotation status': 'Report quote progress on the RFQ',
  'General enquiry': 'Answer from the approved FAQ set',
  'Technical support': 'Diagnose and raise a support ticket',
  'Payment enquiry': 'Confirm what the records show',
  'Human assistance': 'Transfer to the founder',
}

function buildRfqTurns(r: () => number, product: string, qty: number, price: number, days: number, company: string, rfq: string): GeneratedTurn[] {
  return [
    { speaker: 'AI', text: `Hello, this is the Bell24h supplier assistant calling regarding RFQ ${rfq} for ${product}. Is this a good time to talk for two minutes?`, atSec: 2 },
    { speaker: 'Contact', text: 'Yes, go ahead.', atSec: 9, sentiment: 'neutral' },
    { speaker: 'AI', text: `Am I speaking with the person handling ${company}'s quotations? May I confirm the company GST details on file?`, atSec: 12 },
    { speaker: 'Contact', text: 'Yes, this is the right number.', atSec: 20, sentiment: 'neutral' },
    { speaker: 'AI', text: `Can you supply ${qty} units within ${days - r() * 5 > 0 ? days : 15} days?`, atSec: 24 },
    { speaker: 'Contact', text: `Yes, but we would need ${days} days for that quantity.`, atSec: 34, sentiment: 'cautious' },
    { speaker: 'AI', text: 'Understood, I have noted that. What would be your price per unit?', atSec: 39 },
    { speaker: 'Contact', text: `₹${price} per unit, ex-works.`, atSec: 47, sentiment: 'positive' },
    { speaker: 'AI', text: `Thank you. I have recorded ₹${price} per unit and a ${days}-day delivery timeline. Is the MOQ flexible for a repeat order?`, atSec: 52 },
    { speaker: 'Contact', text: 'For repeat orders we can adjust slightly.', atSec: 62, sentiment: 'positive' },
    { speaker: 'AI', text: 'Noted. I will send a written summary on WhatsApp and update the RFQ. Thank you for your time.', atSec: 66 },
  ]
}

function buildQualifyTurns(r: () => number, buy: boolean, product: string, qty: number, company: string): GeneratedTurn[] {
  const who = buy ? 'requirement' : 'marketplace registration'
  return [
    { speaker: 'AI', text: `Hello, this is the Bell24h marketplace assistant calling about your ${who}. Is now a good time?`, atSec: 2 },
    { speaker: 'Contact', text: 'Yes, speaking.', atSec: 8, sentiment: 'neutral' },
    { speaker: 'AI', text: `Could you confirm the company name and your role there?`, atSec: 11 },
    { speaker: 'Contact', text: `This is ${company}. I handle procurement.`, atSec: 19, sentiment: 'neutral' },
    { speaker: 'AI', text: buy ? `What quantity of ${product} are you looking to buy, and by when?` : `What is your monthly capacity for ${product}?`, atSec: 24 },
    { speaker: 'Contact', text: buy ? `Around ${qty} units, needed within three weeks.` : `We can do roughly ${qty} units a month.`, atSec: 35, sentiment: 'neutral' },
    { speaker: 'AI', text: 'Thank you. Is delivery to your registered plant address acceptable?', atSec: 40 },
    { speaker: 'Contact', text: 'Yes, that works.', atSec: 47, sentiment: 'positive' },
    { speaker: 'AI', text: 'I have recorded everything and will share matched options on WhatsApp shortly.', atSec: 51 },
  ]
}

function buildSupportTurns(r: () => number, company: string, inbound: boolean): GeneratedTurn[] {
  const order = `ORD-${int(r, 41000, 49999)}`
  return [
    { speaker: 'AI', text: inbound ? `Thank you for calling Bell24h. This is the AI assistant — how may I help you today?` : `Hello, this is Bell24h calling about your recent order. Is this a good time?`, atSec: 2 },
    { speaker: 'Contact', text: inbound ? 'I want to check the status of my order.' : 'Yes, what is it about?', atSec: 8, sentiment: inbound ? 'neutral' : 'cautious' },
    { speaker: 'AI', text: `Certainly. Could you share the order reference, or may I look it up against ${company}?`, atSec: 12 },
    { speaker: 'Contact', text: `It is ${order}.`, atSec: 21, sentiment: 'neutral' },
    { speaker: 'AI', text: `Thank you. Order ${order} was dispatched and is in transit; the current expected delivery is within three working days.`, atSec: 26 },
    { speaker: 'Contact', text: 'Okay, that is helpful. Please make sure it arrives on time.', atSec: 36, sentiment: 'positive' },
    { speaker: 'AI', text: 'I have logged this and will send the tracking summary on WhatsApp. Thank you.', atSec: 41 },
  ]
}

export function buildTurns(r: () => number, intent: string, opts: { product: string; qty: number; price: number; days: number; company: string; rfq: string; inbound: boolean }): GeneratedTurn[] {
  if (intent === 'RFQ Follow-up' || intent === 'Quote Collection' || intent === 'Supplier Reactivation') {
    return buildRfqTurns(r, opts.product, opts.qty, opts.price, opts.days, opts.company, opts.rfq)
  }
  if (intent === 'Order status' || intent === 'Order Confirmation' || intent === 'Technical support' || intent === 'General enquiry' || intent === 'Human assistance' || intent === 'Payment enquiry' || intent === 'Quotation status') {
    return buildSupportTurns(r, opts.company, opts.inbound)
  }
  return buildQualifyTurns(r, opts.inbound ? false : true, opts.product, opts.qty, opts.company)
}

const OUTCOMES_COMPLETE = ['Quote captured', 'Requirement qualified', 'Order confirmed', 'Query resolved', 'Callback agreed', 'Payment date confirmed', 'Supplier verified', 'Information collected']
const OUTCOMES_FAIL = ['No answer', 'Line busy', 'Contact unavailable', 'Wrong number', 'Opted out of calls']

export function generateCall(index: number, dayOffset: number, opts: { todayStart: Date }): GeneratedCall {
  const r = rng(`call:${index}:${dayOffset}`)
  const inbound = dayOffset === 0 ? r() < 0.34 : r() < 0.22
  const entity = inbound ? (r() < 0.6 ? 'buyer' : 'supplier') : (r() < 0.68 ? 'supplier' : 'buyer')

  const dirSources = directory(entity === 'supplier' ? 'supplier' : 'buyer')
  const company = pick(r, dirSources).company
  const person = pick(r, PEOPLE)
  const productSpec = pick(r, PRODUCTS)
  const qty = pick(r, [50, 100, 250, 500, 750, 1000, 2000, 5000])
  const price = Math.round(productSpec.basePrice * (0.86 + r() * 0.4))
  const days = int(r, 7, 25)
  const rfq = rfqNumber(r)

  const intent = inbound ? pick(r, INBOUND_INTENTS) : (() => {
    const roll = r()
    if (roll < 0.3) return 'RFQ Follow-up'
    if (roll < 0.45) return 'Quote Collection'
    if (roll < 0.58) return 'Lead Qualification'
    if (roll < 0.68) return 'Buyer Qualification'
    if (roll < 0.76) return 'Supplier Qualification'
    if (roll < 0.84) return 'Appointment Scheduling'
    if (roll < 0.92) return 'Order Confirmation'
    return 'Payment Reminder'
  })()

  // Today's calls closer to "now"; history spread through the day.
  const base = new Date(opts.todayStart)
  const day = new Date(base.getTime() - dayOffset * 86400000)
  const hour = dayOffset === 0 ? int(r, 9, 17) : int(r, 9, 19)
  const minute = int(r, 0, 59)
  const startedAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, int(r, 0, 59))

  const roll = r()
  let status: CallStatus
  if (dayOffset === 0) {
    if (roll < 0.47) status = 'completed'
    else if (roll < 0.60) status = 'no_answer'
    else if (roll < 0.68) status = 'callback'
    else if (roll < 0.78) status = 'scheduled'
    else if (roll < 0.86) status = 'failed'
    else if (roll < 0.92) status = 'escalated'
    else status = 'in_progress'
  } else {
    if (roll < 0.66) status = 'completed'
    else if (roll < 0.86) status = 'no_answer'
    else if (roll < 0.9) status = 'callback'
    else if (roll < 0.95) status = 'escalated'
    else status = 'failed'
  }

  const connected = status !== 'no_answer' && status !== 'failed'
  const turns = connected ? buildTurns(r, intent, { product: productSpec.name, qty, price, days, company, rfq, inbound }) : []
  const durationSec = !connected ? 0 : status === 'in_progress' ? int(r, 45, 190) : int(r, 68, 420)
  const confidence = !connected ? 0 : Math.round((0.62 + r() * 0.36) * 100) / 100
  const sentiment = pick(r, SENTIMENTS)

  const extracted = connected && intent !== 'General enquiry' && intent !== 'Human assistance'
    ? {
      quantity: qty,
      price: intent === 'Payment Reminder' || intent === 'Order status' ? null : price,
      delivery_days: days,
      availability: r() < 0.72 ? 'Confirmed' : 'Partial — max 60% of quantity',
      moq: pick(r, [25, 50, 100, 100]),
      payment_terms: pick(r, ['30 days credit', 'Advance 50%', 'Against delivery', '15 days credit']),
      location: pick(r, ['Surat, GJ', 'Pune, MH', 'Chennai, TN', 'Raipur, CG', 'Ahmedabad, GJ']),
      gst_verified: r() < 0.85 ? 'Yes' : 'Pending',
      confidence: confidence,
    }
    : null

  const outcome = !connected
    ? pick(r, OUTCOMES_FAIL)
    : status === 'escalated' ? 'Escalated to founder'
      : status === 'callback' ? 'Callback agreed'
        : pick(r, OUTCOMES_COMPLETE)

  const summary = !connected
    ? `${intent} attempt on ${company} did not connect. ${outcome}.`
    : `${intent} with ${person.name} (${company}). ${extracted?.price ? `Price recorded at ₹${extracted.price} per ${productSpec.unit}` : 'Requirement captured'}, delivery in ${days} days, availability ${extracted?.availability ?? 'confirmed'}.`

  const liveStates: LiveState[] = ['speaking', 'listening', 'thinking', 'speaking', 'wrap_up']

  return {
    ref: svcRef('VC', 1000 + index),
    campaignCode: inbound ? null : pick(r, CAMPAIGN_BLUEPRINTS).code,
    agentKey: inbound ? 'customer_support' : agentForIntent(intent),
    contactName: person.name,
    company,
    contactRole: person.role,
    phoneMasked: maskedPhone(r),
    entityType: entity,
    direction: inbound ? 'inbound' : 'outbound',
    status,
    state: status === 'in_progress' ? liveStates[index % liveStates.length] : null,
    intent,
    objective: INTENT_OBJECTIVE[intent] ?? 'Complete the configured objective',
    sentiment,
    confidence,
    durationSec,
    outcome,
    nextAction: status === 'callback' ? 'Call back tomorrow 11:00 IST'
      : status === 'no_answer' ? 'Retry attempt 2'
        : status === 'escalated' ? 'Founder review required'
          : status === 'in_progress' ? 'Ask delivery date'
            : 'Send WhatsApp summary',
    summary,
    extractedData: extracted,
    rfqNumber: inbound && intent === 'General enquiry' ? null : rfq,
    quoteAmount: extracted?.price ? (extracted.price as number) * qty : null,
    language: pick(r, ['en-IN', 'hi-en', 'hi-IN', 'mr-IN', 'gu-IN', 'ta-IN']),
    costUsd: Math.round((durationSec / 60) * (0.012 + r() * 0.02) * 1000) / 1000,
    attempt: status === 'no_answer' || status === 'failed' ? int(r, 2, 3) : 1,
    startedAt,
    endedAt: status === 'in_progress' || status === 'scheduled' ? null : new Date(startedAt.getTime() + durationSec * 1000),
    createdAt: startedAt,
    turns,
  }
}

export function agentForIntent(intent: string): string {
  switch (intent) {
    case 'RFQ Follow-up': return 'rfq_followup'
    case 'Quote Collection': return 'quote_collection'
    case 'Buyer Qualification': return 'buyer_qualification'
    case 'Supplier Qualification': return 'supplier_qualification'
    case 'Supplier Reactivation': return 'supplier_qualification'
    case 'Appointment Scheduling': return 'appointment'
    case 'Payment Reminder': return 'payment_reminder'
    case 'Order Confirmation': return 'customer_support'
    case 'Satisfaction Survey': return 'customer_support'
    default: return 'lead_qualification'
  }
}

// ─────────────────────────────────────────────────────────────
// QUEUE JOBS
// ─────────────────────────────────────────────────────────────

export interface GeneratedJob {
  ref: string
  contactName: string
  company: string
  phoneMasked: string
  campaignCode: string | null
  agentKey: string
  priority: string
  status: string
  attempt: number
  scheduledFor: Date | null
  nextAction: string
  reason: string
}

const JOB_STATUS_PLAN: Array<{ status: string; count: number }> = [
  { status: 'pending', count: 7 },
  { status: 'scheduled', count: 5 },
  { status: 'calling', count: 3 },
  { status: 'answered', count: 4 },
  { status: 'no_answer', count: 4 },
  { status: 'callback', count: 5 },
  { status: 'completed', count: 8 },
  { status: 'escalated', count: 3 },
  { status: 'failed', count: 3 },
]

export function generateQueueJobs(now: Date): GeneratedJob[] {
  const jobs: GeneratedJob[] = []
  let n = 1
  for (const plan of JOB_STATUS_PLAN) {
    for (let i = 0; i < plan.count; i++) {
      const r = rng(`job:${plan.status}:${i}`)
      const supplier = r() < 0.62
      const src = directory(supplier ? 'supplier' : 'buyer')
      const company = pick(r, src).company
      const person = pick(r, PEOPLE)
      const camp = plan.status === 'pending' ? pick(r, CAMPAIGN_BLUEPRINTS) : pick(r, CAMPAIGN_BLUEPRINTS)
      const offsetMin = plan.status === 'scheduled' ? int(r, 15, 260) : int(r, -180, 60)
      jobs.push({
        ref: svcRef('QJ', n),
        contactName: person.name,
        company,
        phoneMasked: maskedPhone(r),
        campaignCode: camp.code,
        agentKey: camp.agentKey,
        priority: pick(r, ['high', 'normal', 'normal', 'low']),
        status: plan.status,
        attempt: plan.status === 'no_answer' || plan.status === 'failed' ? int(r, 2, 3) : int(r, 1, 2),
        scheduledFor: plan.status === 'scheduled' || plan.status === 'callback' || plan.status === 'pending'
          ? new Date(now.getTime() + offsetMin * 60000)
          : null,
        nextAction: plan.status === 'pending' ? 'Dial when the engine ticks'
          : plan.status === 'scheduled' ? 'Auto-dial at scheduled time'
            : plan.status === 'calling' ? 'Awaiting answer'
              : plan.status === 'answered' ? 'Agent in conversation'
                : plan.status === 'no_answer' ? 'Schedule retry'
                  : plan.status === 'callback' ? 'Dial at callback time'
                    : plan.status === 'completed' ? 'Summarise and propagate'
                      : plan.status === 'escalated' ? 'Await founder review'
                        : 'Close and notify owner',
        reason: plan.status === 'escalated' ? pick(r, ESCALATION_REASONS)
          : plan.status === 'failed' ? 'Maximum attempts reached'
            : plan.status === 'no_answer' ? 'Unanswered'
              : plan.status === 'callback' ? 'Contact requested a callback'
                : 'Campaign match',
      })
      n++
    }
  }
  return jobs
}

// ─────────────────────────────────────────────────────────────
// ESCALATIONS
// ─────────────────────────────────────────────────────────────

export interface GeneratedEscalation {
  ref: string
  callRef: string | null
  contactName: string
  company: string
  reason: string
  severity: string
  transcript: string
  recommendation: string
  summary: string
  rfqNumber: string | null
  status: string
  assignedTo: string | null
  raisedAt: Date
  resolvedAt: Date | null
}

export function generateEscalations(now: Date): GeneratedEscalation[] {
  const out: GeneratedEscalation[] = []
  const sev = ['high', 'high', 'critical', 'medium', 'medium', 'low', 'high']
  const statuses = ['open', 'open', 'open', 'in_review', 'resolved', 'open', 'resolved']
  for (let i = 0; i < 7; i++) {
    const r = rng(`esc:${i}`)
    const supplier = r() < 0.5
    const company = pick(r, directory(supplier ? 'supplier' : 'buyer')).company
    const person = pick(r, PEOPLE)
    const reason = pick(r, ESCALATION_REASONS)
    const product = pick(r, PRODUCTS)
    const rfq = rfqNumber(r)
    out.push({
      ref: svcRef('ESC', 200 + i),
      callRef: svcRef('VC', 1000 + int(r, 0, 60)),
      contactName: person.name,
      company,
      reason,
      severity: sev[i],
      transcript: [
        `AI: I understand. Let me make sure I have this right before I proceed.`,
        `Contact: This is not something you can decide. ${reason === 'Payment dispute' ? 'The invoice amount itself is wrong.' : reason === 'Complaint raised' ? 'We have been waiting three weeks and nobody informed us.' : 'I need to speak to the owner.'}`,
        `AI: I am not able to commit to that on this call, so I am going to bring a human in rather than guess.`,
        `Contact: Please do.`,
      ].join('\n'),
      recommendation:
        reason === 'Payment dispute' ? 'Verify the invoice against the purchase order before calling back. Do not discuss amounts on an AI call.'
          : reason === 'Complaint raised' ? 'Review the order timeline; the delay appears to be a communication failure rather than a supply failure.'
            : reason === 'Negotiation beyond agent authority' ? 'The supplier is 22% above target. Approve a revised band or release the RFQ to alternates.'
              : reason === 'Caller requested human' ? 'Call back personally within the two-hour commitment made on the call.'
                : reason === 'Sensitive business decision' ? 'Requires founder judgement on commercial terms.'
                  : 'Review the transcript and decide whether to re-route to a specialist agent.',
      summary: `${reason} on a ${product.name} enquiry with ${company}. The agent stopped rather than exceeding its authority and transferred the decision to a human.`,
      rfqNumber: rfq,
      status: statuses[i],
      assignedTo: statuses[i] === 'open' ? null : 'Founder',
      raisedAt: new Date(now.getTime() - int(r, 20, 2600) * 60000),
      resolvedAt: statuses[i] === 'resolved' ? new Date(now.getTime() - int(r, 5, 400) * 60000) : null,
    })
  }
  return out
}

// ─────────────────────────────────────────────────────────────
// COMMUNICATION EVENTS (unified omni-channel timeline)
// ─────────────────────────────────────────────────────────────

export interface GeneratedCommEvent {
  ref: string
  channel: string
  direction: string
  contactName: string
  company: string
  subject: string
  body: string
  outcome: string
  callRef: string | null
  entityType: string
  rfqNumber: string | null
  occurredAt: Date
}

const CHANNELS = ['voice', 'whatsapp', 'email'] as const

export function generateCommEvents(now: Date, count = 90): GeneratedCommEvent[] {
  const out: GeneratedCommEvent[] = []
  for (let i = 0; i < count; i++) {
    const r = rng(`comm:${i}`)
    const supplier = r() < 0.58
    const company = pick(r, directory(supplier ? 'supplier' : 'buyer')).company
    const person = pick(r, PEOPLE)
    const product = pick(r, PRODUCTS)
    const channel = pick(r, CHANNELS)
    const rfq = rfqNumber(r)
    const minsAgo = int(r, 5, 60 * 24 * 12)
    const subject = channel === 'voice'
      ? pick(r, ['RFQ follow-up call', 'Quote collection call', 'Inbound enquiry', 'Callback call'])
      : channel === 'whatsapp'
        ? pick(r, ['RFQ sent to supplier', 'Quote summary sent', 'Delivery reminder', 'Callback confirmation'])
        : pick(r, ['Quotation attached', 'RFQ notification', 'Order confirmation', 'Weekly summary'])
    out.push({
      ref: svcRef('CE', 5000 + i),
      channel,
      direction: r() < 0.55 ? 'outbound' : 'inbound',
      contactName: person.name,
      company,
      subject,
      body: channel === 'voice'
        ? `Simulated call concerning ${product.name}. Outcome recorded and written to the operating memory.`
        : channel === 'whatsapp'
          ? `Automated ${subject.toLowerCase()} for ${rfq}. Delivery status simulated.`
          : `Email regarding ${rfq} — ${subject.toLowerCase()}. Queued through the communication hub.`,
      outcome: pick(r, ['delivered', 'delivered', 'read', 'responded', 'no_response', 'failed']),
      callRef: channel === 'voice' ? svcRef('VC', 1000 + int(r, 0, 60)) : null,
      entityType: supplier ? 'supplier' : 'buyer',
      rfqNumber: rfq,
      occurredAt: new Date(now.getTime() - minsAgo * 60000),
    })
  }
  return out
}

// ─────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────

export interface AnalyticsInput {
  direction: string
  status: string
  confidence: number
  durationSec: number
  quoteAmount: number | null
  costUsd: number
  createdAt: Date
  intent: string
}

export function deriveAnalytics(calls: AnalyticsInput[], days: number) {
  const total = calls.length
  const connected = calls.filter((c) => c.status !== 'no_answer' && c.status !== 'failed').length
  const answered = calls.filter((c) => c.status !== 'no_answer' && c.status !== 'failed' && c.status !== 'scheduled').length
  const completed = calls.filter((c) => c.status === 'completed').length
  const escalated = calls.filter((c) => c.status === 'escalated').length
  const callbacks = calls.filter((c) => c.status === 'callback').length
  const totalDuration = calls.reduce((s, c) => s + c.durationSec, 0)
  const totalCost = calls.reduce((s, c) => s + c.costUsd, 0)
  const quotes = calls.filter((c) => c.quoteAmount && c.quoteAmount > 0)
  const quoteValue = quotes.reduce((s, c) => s + (c.quoteAmount ?? 0), 0)

  const byDay: Array<{ day: string; calls: number; connected: number; escalated: number; completed: number }> = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const next = new Date(d.getTime() + 86400000)
    const bucket = calls.filter((c) => c.createdAt >= d && c.createdAt < next)
    byDay.push({
      day: d.toISOString().slice(5, 10),
      calls: bucket.length,
      connected: bucket.filter((c) => c.status !== 'no_answer' && c.status !== 'failed').length,
      escalated: bucket.filter((c) => c.status === 'escalated').length,
      completed: bucket.filter((c) => c.status === 'completed').length,
    })
  }

  const byIntent = Object.entries(
    calls.reduce<Record<string, { calls: number; connected: number; completed: number; escalated: number }>>((acc, c) => {
      const k = c.intent || 'Unknown'
      acc[k] = acc[k] || { calls: 0, connected: 0, completed: 0, escalated: 0 }
      acc[k].calls++
      if (c.status !== 'no_answer' && c.status !== 'failed') acc[k].connected++
      if (c.status === 'completed') acc[k].completed++
      if (c.status === 'escalated') acc[k].escalated++
      return acc
    }, {}),
  ).map(([intent, v]) => ({ intent, ...v })).sort((a, b) => b.calls - a.calls)

  const byHour = Array.from({ length: 12 }, (_, i) => {
    const hour = 9 + i
    const bucket = calls.filter((c) => c.createdAt.getHours() === hour)
    return { hour: `${hour}:00`, calls: bucket.length, connected: bucket.filter((c) => c.status !== 'no_answer' && c.status !== 'failed').length }
  })

  return {
    total,
    connected,
    answered,
    completed,
    escalated,
    callbacks,
    answerRate: total ? Math.round((answered / total) * 1000) / 10 : 0,
    connectionRate: total ? Math.round((connected / total) * 1000) / 10 : 0,
    aiResolutionRate: connected ? Math.round((completed / connected) * 1000) / 10 : 0,
    escalationRate: total ? Math.round((escalated / total) * 1000) / 10 : 0,
    avgDurationSec: answered ? Math.round(totalDuration / answered) : 0,
    avgConfidence: answered ? Math.round((calls.filter((c) => c.confidence > 0).reduce((s, c) => s + c.confidence, 0) / Math.max(1, calls.filter((c) => c.confidence > 0).length)) * 100) / 100 : 0,
    totalCostUsd: Math.round(totalCost * 1000) / 1000,
    costPerCall: total ? Math.round((totalCost / total) * 10000) / 10000 : 0,
    costPerSuccess: completed ? Math.round((totalCost / completed) * 10000) / 10000 : 0,
    quotesGenerated: quotes.length,
    quoteValue,
    dealsInfluenced: Math.round(quotes.length * 0.42),
    byDay,
    byIntent,
    byHour,
  }
}

// ─────────────────────────────────────────────────────────────
// ARCHITECTURE DIAGRAM (data for the telephony page)
// ─────────────────────────────────────────────────────────────

export const TELEPHONY_LAYERS = [
  { tier: 'Edge', label: 'Commercial Number / SIP Line', detail: 'Inbound PSTN entry point. Simulated — no carrier attached.', tone: 'blue', simulated: true },
  { tier: 'Edge', label: 'Virtual Number / SIP Trunk', detail: 'Secondary ingress and outbound CLI pool.', tone: 'blue', simulated: true },
  { tier: 'Edge', label: 'GSM Gateway (SIM Bank)', detail: 'Fallback egress over local SIMs. Disabled in the prototype.', tone: 'gray', simulated: true },
  { tier: 'Bridge', label: 'SIP Protocol Bridge', detail: 'Normalises signalling between the carrier edge and the self-hosted server.', tone: 'teal', simulated: false },
  { tier: 'Core', label: 'Self-Hosted Voice Server', detail: 'The Dograh-style core: SIP stack, call manager, voice engine, STT, TTS, LLM and agent logic all run here.', tone: 'emerald', simulated: false },
  { tier: 'Core', label: 'Call Manager', detail: 'Owns the call lifecycle and the conversation state machine.', tone: 'emerald', simulated: false },
  { tier: 'Core', label: 'Conversation State', detail: 'Per-call state that survives barge-in, transfer and reconnection.', tone: 'emerald', simulated: false },
  { tier: 'Inference', label: 'STT → LLM → TTS loop', detail: 'Streaming speech-to-text, agent decision, text-to-speech — the realtime loop.', tone: 'violet', simulated: false },
  { tier: 'Decision', label: 'Agent Decision', detail: 'Resolves the next action against the agent’s decision rules and authority.', tone: 'violet', simulated: false },
  { tier: 'Integration', label: 'CRM · RFQ · Supplier · Buyer', detail: 'Business entities the call reads from and writes back to.', tone: 'amber', simulated: false },
  { tier: 'Integration', label: 'Job / Workflow Engine', detail: 'Turns the call outcome into downstream work.', tone: 'amber', simulated: false },
  { tier: 'Surface', label: 'Founder Cockpit', detail: 'Where the founder supervises, overrides and approves.', tone: 'rose', simulated: false },
]

export const VOICE_STACK_COMPONENTS = [
  { name: 'SIP Stack', role: 'Signalling & media negotiation', state: 'ready', note: 'PJSIP endpoint registered against the local bridge' },
  { name: 'Call Manager', role: 'Call lifecycle & state machine', state: 'ready', note: 'Ringing → Answered → Live → Wrap-up' },
  { name: 'Voice Engine', role: 'Audio pipeline, barge-in, VAD', state: 'ready', note: 'Streaming, sub-300ms target turnaround' },
  { name: 'STT', role: 'Speech → text', state: 'ready', note: 'Self-hosted Whisper, streaming partials' },
  { name: 'TTS', role: 'Text → speech', state: 'ready', note: 'Self-hosted Piper + Indic voices' },
  { name: 'LLM', role: 'Agent reasoning', state: 'ready', note: 'Local inference with router fallback' },
  { name: 'AI Agent Logic', role: 'Decision rules, tools, escalation', state: 'ready', note: 'Contracts enforced per agent' },
]

// ─────────────────────────────────────────────────────────────
// THE AUTOMATION AGENT — simulated queue state machine
// ─────────────────────────────────────────────────────────────

export interface EngineState {
  running: boolean
  startedAt: string | null
  lastTickAt: string | null
  ticks: number
  placed: number
  completed: number
  escalated: number
  errors: number
  note: string
}

export const ENGINE: EngineState = {
  running: false,
  startedAt: null,
  lastTickAt: null,
  ticks: 0,
  placed: 0,
  completed: 0,
  escalated: 0,
  errors: 0,
  note: 'Voice calling automation agent — simulated queue driver. It advances simulated calls through the state machine; it never dials a real number.',
}

export function engineStatus() {
  return { ...ENGINE, simulation: true as const, banner: SIMULATION_BANNER }
}
