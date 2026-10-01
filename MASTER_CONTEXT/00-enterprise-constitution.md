# Bell24h-OS — Enterprise Constitution v1.0

> **Classification:** Internal — Master Reference  
> **Version:** 1.0  
> **Date:** 2026-07-14  
> **Authority:** This document supersedes all prior design discussions.  
> **Scope:** Every AI assistant, developer, and system interacting with Bell24h-OS MUST read and comply with this constitution before writing any code.

---

## Table of Contents

1. [Project Identity](#1-project-identity)
2. [Vision](#2-vision)
3. [Mission](#3-mission)
4. [Primary Business Objective](#4-primary-business-objective)
5. [Architecture Rules (The 10 Immutable Laws)](#5-architecture-rules-the-10-immutable-laws)
6. [Frozen Modules](#6-frozen-modules)
7. [Technology Stack](#7-technology-stack)
8. [System Architecture Overview](#8-system-architecture-overview)
9. [Intelligence Layers](#9-intelligence-layers)
10. [Creative Pipeline](#10-creative-pipeline)
11. [Data Pipeline](#11-data-pipeline)
12. [AI Agents](#12-ai-agents)
13. [Quality Gates](#13-quality-gates)
14. [Documentation Rules](#14-documentation-rules)
15. [MASTER_CONTEXT Protocol](#15-master_context-protocol)
16. [Development Roadmap](#16-development-roadmap)
17. [Volume Index](#17-volume-index)
18. [Amendment History](#18-amendment-history)

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | Bell24h-OS |
| **Classification** | Enterprise AI Marketing Operating System |
| **Primary Product** | VyaparSethu.com |
| **Domain** | B2B Trade, Manufacturing, Exports, Procurement, Industrial Marketing |
| **Target Market** | Indian MSMEs — 63M+ small businesses |
| **Primary Languages** | English, Hindi, + 12 Indian regional languages |
| **Target Asset Volume** | 2,000+ AI-generated marketing assets per day |

---

## 2. Vision

Bell24h-OS is an enterprise AI operating system built specifically for B2B trade, manufacturing, exports, procurement, and industrial marketing.

**It is NOT:**
- A generic CMS
- Another CRM
- An AI chatbot wrapper
- A template-based marketing tool

**It IS:**
- An autonomous marketing and business intelligence platform
- Capable of planning, creating, optimizing, publishing, and learning from thousands of AI-generated assets every day
- A full-stack operating system for MSME marketing — from industry research to performance analytics
- A multi-tenant, multi-language, multi-country platform designed for scale

---

## 3. Mission

Create India's most intelligent B2B AI Marketing Platform capable of supporting:

| Capability | Scale |
|---|---|
| Industries | 50+ |
| Categories | 450+ |
| Products | Unlimited |
| Organizations | Unlimited |
| Campaigns | Unlimited |
| Languages | 15+ |
| Countries | Multi-country expansion |
| Security | Enterprise-grade |
| Workflows | AI-first |

---

## 4. Primary Business Objective

Generate and publish over **2,000 high-quality AI marketing assets per day** per organization.

### Asset Types

| Category | Assets |
|---|---|
| **Social Media** | LinkedIn posts, X (Twitter) posts, Facebook posts, Instagram posts, YouTube Shorts, Reels |
| **Content** | Blogs, Landing Pages, Product Pages, Case Studies, Buyer Guides |
| **Campaigns** | WhatsApp campaigns, Email campaigns, RFQs |
| **Creative** | Product videos, AI avatars, Voiceovers, Infographics, Brochures |
| **Interactive** | QR codes, Watermarked assets, Thumbnails |

### Quality Standard

Every asset must:
1. Be factually accurate (sourced from Industry Intelligence)
2. Be SEO-optimized (informed by SEO Intelligence)
3. Match brand guidelines (Brand Kit)
4. Be appropriate for the target platform
5. Pass QA Agent review before publishing

---

## 5. Architecture Rules (The 10 Immutable Laws)

These rules are permanent. No AI assistant may violate them. Breaking these rules requires an amendment to this Constitution, approved by the project owner.

### Rule 1 — Architecture Is Frozen

> **Never redesign existing modules.**

Once a module's architecture is approved and documented in this Constitution, it is frozen. New features are added *within* the existing architecture, not by restructuring what exists.

**Exception:** A formal Architecture Review (documented in ARCHITECTURE.md) can unfreeze a module, but only with explicit justification and a migration plan.

### Rule 2 — Completed Modules Are Immutable

> **Completed modules may only be modified for: bug fixes, security patches, and performance improvements.**

A module is "completed" when it has passed all Quality Gates (Section 13) and been marked as ✅ in the Roadmap.

**Allowed changes to completed modules:**
- Bug fixes (with regression test)
- Security patches (with CVE reference)
- Performance improvements (with benchmark before/after)
- Schema additions (new columns, new tables — never deletions)

**Forbidden changes:**
- API signature changes
- Table restructuring
- Function signature changes
- Behavioral changes

### Rule 3 — Never Duplicate Functionality

> **Reuse existing services. Never build a second implementation of something that already exists.**

Before creating any new service, function, or component, check:
1. Does this capability already exist in another module?
2. Can the existing service be extended?
3. Can the existing service be called via its service layer?

**Example:** If Image Studio already handles image generation, Video Studio should call Image Studio's service — not create its own image generation logic.

### Rule 4 — Service Layer Is Mandatory

> **Every module must communicate through service layers. No direct provider calls.**

All external API calls (AI providers, social platforms, email services) must go through a service layer. Components and route handlers never call providers directly.

```
Component → Route Handler → Service Layer → Provider
```

This ensures:
- Consistent error handling
- Rate limiting
- Cost tracking
- Provider swapping without code changes
- Centralized authentication

### Rule 5 — Global Job Orchestrator Only

> **Every asynchronous task must use the Global Job Orchestrator. Never implement local queues.**

There is exactly one job queue system. All async work — image generation, video rendering, content publishing, analytics fetching — routes through the Global Job Orchestrator.

**Forbidden:**
- `setTimeout` / `setInterval` for business logic
- Local `bull` / `bullmq` instances
- Direct `cron` jobs outside the orchestrator
- Fire-and-forget HTTP calls

### Rule 6 — Organization-Scoped Data

> **All business data belongs to an organization. Every table must include `organization_id` where appropriate.**

The multi-tenancy model is organization-centric:
- Every data table includes `organization_id` (except system tables)
- Every query is scoped by `organization_id`
- No data crosses organization boundaries
- Users belong to organizations via team membership

**System tables exempt from this rule:**
- `organizations` (the org itself)
- `users` (the user identity)
- `ai_providers` (global provider registry)
- `industry_intelligence` (shared knowledge base)
- `audit_logs` (system-wide for compliance)

### Rule 7 — Row Level Security Is Mandatory

> **RLS is mandatory on every table containing organization data.**

Every table with `organization_id` must have:
1. An RLS policy that restricts access to the user's organization
2. A service-role bypass for admin operations
3. Test coverage proving the policy works

```sql
-- Example RLS policy
CREATE POLICY org_isolation ON campaigns
  USING (organization_id = auth.get_user_organization_id());
```

### Rule 8 — Multi-Tenancy Is Mandatory

> **Every feature must support multi-tenancy from day one.**

No feature may be built for a single organization. Every component, API, and database query must be aware of the current organization context.

**Organization context flows through:**
1. Authentication → user → organization membership
2. Route middleware → injects `organization_id`
3. Service layer → scopes all queries
4. RLS → enforces at database level

### Rule 9 — Production Ready Only

> **Every module must be production ready. No mock data. No placeholder APIs. No TODO comments.**

When a module is marked as completed:
- All APIs return real data from the database
- All integrations connect to real services (with proper error handling)
- All UI components display actual data
- No `console.log` debugging statements remain
- No placeholder text ("Lorem ipsum", "Coming soon")
- Error messages are meaningful and actionable

### Rule 10 — Triple Verification

> **Every implementation must pass: Build, Type Check, Runtime Verification.**

Before any code is committed:

| Gate | Tool | Pass Criteria |
|---|---|---|
| **Build** | `bun run build` | Zero errors |
| **Type Check** | `tsc --noEmit` | Zero type errors |
| **Runtime** | Manual or automated test | Feature works as documented |

---

## 6. Frozen Modules

The following modules are considered **complete and frozen**. They may only be modified per Rule 2.

| Module | Status | Last Verified | Notes |
|---|---|---|---|
| Authentication | ✅ Frozen | v1.0 | Supabase Auth + JWT |
| Organizations | ✅ Frozen | v1.0 | Multi-tenant core |
| Users | ✅ Frozen | v1.0 | User management |
| RBAC | ✅ Frozen | v1.0 | Role-based access control |
| PostgreSQL | ✅ Frozen | v1.0 | Database foundation |
| Supabase | ✅ Frozen | v1.0 | Backend-as-a-service layer |
| Storage | ✅ Frozen | v1.0 | File storage via Supabase |
| AI Provider Manager | ✅ Frozen | v1.0 | Multi-provider AI routing |
| Prompt Studio | ✅ Frozen | v1.0 | AI prompt management |
| AI Content Planner | ✅ Frozen | v1.0 | Content planning engine |
| Image Studio | ✅ Frozen | v1.0 | AI image generation |
| Video Studio | ✅ Frozen | v1.0 | AI video generation |
| Industry Intelligence | ✅ Frozen | v1.0 | 50+ industry knowledge base |
| SEO Intelligence | ✅ Frozen | v1.0 | Keyword clustering, ranking |
| Campaign Intelligence | ✅ Frozen | v1.0 | Campaign lifecycle management |
| Publishing Center | ✅ Frozen | v1.0 | Multi-platform publishing |
| Automation Platform | ✅ Frozen | v1.0 | Workflow automation |
| Performance Intelligence | ✅ Frozen | v1.0 | Analytics and ROI tracking |
| Global Job Orchestrator | ✅ Frozen | v1.0 | Async task management |

### Modules In Progress

| Module | Status | Phase | Notes |
|---|---|---|---|
| Voice Studio | ⏳ In Progress | Phase 3 | AI voice generation |
| Avatar Studio | ⏳ In Progress | Phase 3 | AI avatar creation |
| Media Composer AI | ⏳ In Progress | Phase 3 | Multi-asset composition |
| Brand Intelligence | ⏳ In Progress | Phase 3 | Brand kit management |

### Modules Planned

| Module | Status | Phase | Notes |
|---|---|---|---|
| Social Connectors | 📋 Planned | Phase 4 | Direct API integrations |
| Scheduler | 📋 Planned | Phase 4 | Publishing scheduling |
| Learning Engine | 📋 Planned | Phase 5 | AI learning from performance |
| AI Marketing Brain | 📋 Planned | Phase 5 | Autonomous marketing intelligence |
| Predictive Campaign Intelligence | 📋 Planned | Phase 5 | ML-based campaign prediction |
| Enterprise Knowledge Graph | 📋 Planned | Phase 5 | Cross-module knowledge |
| B2B Procurement Intelligence | 📋 Planned | Phase 5 | Buyer/supplier matching |
| Autonomous Growth Engine | 📋 Planned | Phase 5 | Self-optimizing marketing |

---

## 7. Technology Stack

### Frontend

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18+ | UI components |
| Language | TypeScript | 5+ | Type safety |
| Build Tool | Vite | 5+ | Fast builds |
| Styling | Tailwind CSS | 3+ | Utility-first CSS |
| UI Library | shadcn/ui | Latest | Pre-built components |
| State | React hooks + context | — | Client state |
| Charts | Recharts | — | Data visualization |
| Icons | Lucide React | — | Icon library |

### Backend

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js | Server runtime |
| Framework | Express / Hono | HTTP server |
| ORM | Prisma | Database access |
| Validation | Zod | Schema validation |
| Auth Middleware | Supabase Auth | JWT verification |

### Database

| Layer | Technology | Purpose |
|---|---|---|
| Primary DB | PostgreSQL | Relational data |
| Backend Service | Supabase | Auth, Storage, Realtime |
| ORM | Prisma | Type-safe queries |
| Migrations | Prisma Migrate | Schema management |
| Vector Store | pgvector (planned) | AI embeddings |

### Storage

| Layer | Technology | Purpose |
|---|---|---|
| File Storage | Supabase Storage | Images, videos, documents |
| CDN | Vercel Edge Network | Static asset delivery |
| Asset Pipeline | Custom service | Image/video processing |

### Authentication

| Layer | Technology | Purpose |
|---|---|---|
| Auth Provider | Supabase Auth | User authentication |
| JWT | Supabase JWT | Session management |
| OAuth | Supabase Auth | Social login (planned) |
| API Keys | Custom | Service-to-service auth |

### Queue & Orchestration

| Layer | Technology | Purpose |
|---|---|---|
| Job Queue | Global Job Orchestrator | Task management |
| Scheduler | Cron + Orchestrator | Scheduled tasks |
| Event Bus | Internal events | Module communication |

### Deployment

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Vercel | SPA hosting |
| Backend | Vercel Serverless / Railway | API hosting |
| Database | Supabase Cloud / Neon | PostgreSQL hosting |
| CI/CD | GitHub Actions | Automated deployment |
| Monitoring | Vercel Analytics | Performance tracking |

### AI Providers

| Provider | Models | Purpose |
|---|---|---|
| OpenAI | GPT-4o, DALL-E 3, Whisper | Content, images, audio |
| Anthropic | Claude 3.5 Sonnet | Long-form content, analysis |
| Google | Gemini Pro, Imagen | Multi-modal, images |
| ElevenLabs | — | Voice generation |
| Stability AI | SDXL, Stable Video | Image/video generation |
| RunwayML | Gen-3 | Video generation |
| Midjourney | — | High-quality images |
| Replicate | Various | Open-source models |

---

## 8. System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  React + TypeScript + Tailwind + shadcn/ui                      │
│  Dashboard | CRM | Studios | Intelligence | Analytics | Settings │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────────┐
│                         API GATEWAY                              │
│  Authentication | Rate Limiting | Organization Scoping           │
└──────┬───────────┬───────────┬───────────┬─────────────────────┘
       │           │           │           │
┌──────▼──┐ ┌──────▼──┐ ┌──────▼──┐ ┌──────▼──┐
│  Auth   │ │  Core   │ │  AI     │ │  Media  │
│ Service │ │ Service │ │ Service │ │ Service │
└──────┬──┘ └──────┬──┘ └──────┬──┘ └──────┬──┘
       │           │           │           │
┌──────▼───────────▼───────────▼───────────▼─────────────────────┐
│                    SERVICE LAYER                                 │
│  Industry | SEO | Campaign | Performance | Publishing | Automation│
└──────┬──────────────────────────────────────────────────────┬──┘
       │                                                      │
┌──────▼──────────────┐  ┌────────────────────────────────────▼──┐
│   DATABASE LAYER    │  │          JOB ORCHESTRATOR              │
│   PostgreSQL        │  │  Global Job Queue | Worker Pool         │
│   Supabase RLS      │  │  Retry | Priority | Dead Letter         │
│   Prisma ORM        │  └──────────────┬─────────────────────────┘
└─────────────────────┘                 │
                              ┌─────────▼─────────┐
                              │   AI PROVIDERS     │
                              │  OpenAI | Anthropic │
                              │  Google | ElevenLabs│
                              │  Stability | Runway │
                              └───────────────────┘
```

### Module Communication Pattern

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Module A   │────▶│ Service Layer│────▶│   Module B   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Job Orchestr.│
                    └─────────────┘
```

**Rules:**
1. Module A never calls Module B directly
2. Module A calls Module B's service layer
3. Async work goes through Job Orchestrator
4. All calls are organization-scoped

---

## 9. Intelligence Layers

Bell24h-OS has five intelligence layers that feed into each other:

### Layer 1 — Industry Intelligence

> The foundation. Knows everything about 50+ industries.

- Industry profiles, categories, subcategories
- Product families and applications
- Buyer and supplier personas
- Pain points, FAQs, buying cycles
- Keyword clusters per industry
- Marketing styles per industry
- City, state, country data
- Language preferences

### Layer 2 — SEO Intelligence

> What people search for and how to rank.

- Keyword clustering and grouping
- Topical authority mapping
- Search intent classification
- Competitor intelligence
- Google Search Console integration
- Ranking analysis and tracking
- Opportunity scoring
- Content gap analysis
- AI-powered recommendations

### Layer 3 — Campaign Intelligence

> How to plan and execute marketing campaigns.

- Campaign lifecycle management
- Objective → Planning → Content → Creative → Publish → Analyze
- Multi-platform campaign coordination
- Budget and ROI tracking
- A/B testing framework
- Audience targeting
- Scheduling and automation

### Layer 4 — Performance Intelligence

> What's working and what to optimize.

- Cross-platform analytics aggregation
- Engagement metrics (impressions, reach, clicks, CTR)
- Conversion tracking
- ROI calculation
- Watch time and retention
- AI-powered optimization recommendations
- Learning loops
- Predictive analytics (planned)

### Layer 5 — Learning Engine

> The system that gets smarter over time.

- Performance feedback loops
- Content effectiveness scoring
- Industry trend detection
- Audience behavior analysis
- Campaign optimization suggestions
- Creative style learning
- Keyword performance learning
- Autonomous improvement (planned)

### Intelligence Flow

```
Industry Intelligence
        ↓
  SEO Intelligence
        ↓
  Campaign Intelligence
        ↓
  Performance Intelligence
        ↓
   Learning Engine
        ↓
  (feeds back to Industry Intelligence)
```

---

## 10. Creative Pipeline

The Creative Pipeline transforms strategy into published content:

```
┌─────────────────────┐
│ Industry Intelligence│  "What does this industry need?"
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│   SEO Intelligence   │  "What are people searching for?"
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│  AI Content Planner  │  "What content should we create?"
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│    Prompt Studio     │  "How do we instruct the AI?"
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│ Global Job Orchestr. │  "Queue and manage the work"
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│    Image Studio      │  Generate images
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│    Video Studio      │  Generate videos
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│    Voice Studio      │  Generate voiceovers
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│    Avatar Studio     │  Generate AI avatars
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│   Media Composer     │  Combine all assets
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│  Publishing Center   │  Distribute to platforms
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│ Performance Intel.   │  Track results
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│   Learning Engine    │  Optimize for next cycle
└─────────────────────┘
```

### Pipeline Rules

1. Each stage is independent and can be called standalone
2. Each stage accepts input from the previous stage's output
3. Each stage is asynchronous and managed by the Job Orchestrator
4. Each stage stores results in the database before passing to the next
5. Each stage can be retried independently on failure
6. The entire pipeline is resumable from any stage

---

## 11. Data Pipeline

The Data Pipeline defines how business data flows through the system:

```
Industry
  ↓
Category
  ↓
Subcategory
  ↓
Product Family
  ↓
Product
  ↓
Buyer Persona
Supplier Persona
  ↓
Keyword Cluster
  ↓
Campaign
  ↓
Creative Assets
  ↓
Publishing
  ↓
Analytics
  ↓
Learning
```

### Data Hierarchy Rules

1. Every Industry has 1+ Categories
2. Every Category has 1+ Subcategories
3. Every Subcategory has 1+ Product Families
4. Every Product Family has 1+ Products
5. Every Product has associated Buyer and Supplier Personas
6. Every Persona has associated Keyword Clusters
7. Every Keyword Cluster feeds into Campaigns
8. Campaigns produce Creative Assets
9. Creative Assets are Published
10. Publishing produces Analytics
11. Analytics feed the Learning Engine

### Organization Scoping

All business data (from Product downward) is scoped to an organization:
- `industry_intelligence` → Global (shared knowledge base)
- `categories` → Global
- `products` → Organization-scoped
- `buyer_personas` → Organization-scoped
- `supplier_personas` → Organization-scoped
- `campaigns` → Organization-scoped
- `creative_assets` → Organization-scoped
- `publishing` → Organization-scoped
- `analytics` → Organization-scoped
- `learning` → Organization-scoped

---

## 12. AI Agents

Bell24h-OS uses 25 specialized AI agents organized into four tiers:

### Tier 1 — Executive Agents

| Agent | Role | Reports To |
|---|---|---|
| CEO Agent | Overall strategy and prioritization | Human operator |
| CTO Agent | Technical architecture and infrastructure | CEO Agent |
| CMO Agent | Marketing strategy and brand direction | CEO Agent |

### Tier 2 — Intelligence Agents

| Agent | Role | Primary Data |
|---|---|---|
| Industry Intelligence Agent | Industry research and trend analysis | Industry database |
| SEO Agent | Search optimization and keyword strategy | SEO database |
| Campaign Planner Agent | Campaign design and scheduling | Campaign database |
| Procurement Intelligence Agent | B2B procurement trends | Market data |
| Supplier Discovery Agent | Find and evaluate suppliers | Supplier database |
| Buyer Discovery Agent | Find and evaluate buyers | Buyer database |
| RFQ Intelligence Agent | RFQ analysis and matching | RFQ database |
| Export Intelligence Agent | Export regulations and markets | Trade data |
| Manufacturing Intelligence Agent | Manufacturing trends and capabilities | Industry data |

### Tier 3 — Creative Agents

| Agent | Role | Output |
|---|---|---|
| Prompt Engineer Agent | Optimize AI prompts | Prompts |
| Content Writer Agent | Generate written content | Text assets |
| Image Director Agent | Generate and direct images | Image assets |
| Video Director Agent | Generate and direct videos | Video assets |
| Voice Director Agent | Generate and direct voiceovers | Audio assets |
| Avatar Director Agent | Generate AI avatars | Avatar assets |

### Tier 4 — Operations Agents

| Agent | Role | Scope |
|---|---|---|
| Publishing Agent | Manage multi-platform distribution | Publishing Center |
| Analytics Agent | Track and analyze performance | Performance Intelligence |
| Learning Agent | Optimize based on feedback | Learning Engine |
| Workflow Agent | Manage automation workflows | Automation Engine |
| QA Agent | Quality assurance and validation | All modules |
| Compliance Agent | Legal and regulatory compliance | All modules |
| Infrastructure Agent | System health and scaling | Infrastructure |

### Agent Communication Protocol

All agents communicate through a standardized protocol:

```typescript
interface AgentMessage {
  id: string;
  from: string;           // Agent ID
  to: string;             // Agent ID or "broadcast"
  type: 'request' | 'response' | 'notification' | 'escalation';
  payload: {
    action: string;       // What to do
    data: unknown;        // Input data
    context: {
      organizationId: string;
      campaignId?: string;
      jobId?: string;
    };
  };
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: Date;
}
```

### Agent Rules

1. Agents never call external APIs directly — they use service layers
2. Agents never modify data directly — they request changes through services
3. Agents log all actions to the audit trail
4. Agents escalate to human operators for decisions outside their authority
5. Agents share context through the database, not direct memory

---

## 13. Quality Gates

Every module must pass ALL of the following before being marked as completed:

| # | Gate | Description | Tool | Pass Criteria |
|---|---|---|---|---|
| 1 | **Build Verification** | Code compiles without errors | `bun run build` | Zero errors |
| 2 | **Lint Verification** | Code follows style guidelines | ESLint / Prettier | Zero warnings |
| 3 | **Type Check** | TypeScript types are correct | `tsc --noEmit` | Zero type errors |
| 4 | **Runtime Verification** | Feature works in browser | Manual / Playwright | Feature functions correctly |
| 5 | **Auth Verification** | Authentication works | Manual test | Login, logout, session refresh |
| 6 | **RLS Verification** | Row Level Security enforced | SQL test | Org A cannot see Org B data |
| 7 | **Storage Verification** | File upload/download works | Manual test | Files upload and retrieve correctly |
| 8 | **API Verification** | All endpoints respond correctly | curl / Postman | 2xx for valid, 4xx for invalid |
| 9 | **E2E Testing** | Full user flow works | Playwright | Critical paths covered |
| 10 | **Load Testing** | Handles concurrent users | k6 / Artillery | Meets performance targets |
| 11 | **Documentation** | Docs updated | Manual check | All 5 doc files updated |

### Documentation Files Updated Per Gate

Every completed module must update:
1. `ROADMAP.md` — Module status and phase
2. `MODULES.md` — Module description and capabilities
3. `DATABASE.md` — Schema changes and new tables
4. `API_CONTRACTS.md` — New or modified endpoints
5. `CHANGELOG.md` — What changed and why
6. `ARCHITECTURE.md` — Architecture decisions

---

## 14. Documentation Rules

### Mandatory Documentation

| Document | Purpose | Updated When |
|---|---|---|
| `ROADMAP.md` | Implementation roadmap and status | Module completed |
| `MODULES.md` | Module catalog and descriptions | Module added/changed |
| `DATABASE.md` | Database schema reference | Schema changed |
| `API_CONTRACTS.md` | API endpoint documentation | API changed |
| `CHANGELOG.md` | Change history | Any change |
| `ARCHITECTURE.md` | Architecture decisions | Architecture change |

### Documentation Standards

1. Every document must have a version number and last-updated date
2. Every API endpoint must include: method, path, auth, request schema, response schema, error codes
3. Every database table must include: columns, types, indexes, foreign keys, RLS policies
4. Every module must include: purpose, dependencies, public API, data model, known limitations

---

## 15. MASTER_CONTEXT Protocol

The `MASTER_CONTEXT/` folder is the **permanent memory** of Bell24h-OS.

### Structure

```
MASTER_CONTEXT/
├── INDEX.md                    # Entry point — every AI reads this first
├── 00-enterprise-constitution.md  # This document
├── 01-executive-vision.md      # Volume 1
├── 02-system-architecture.md   # Volume 2
├── 03-database-design.md       # Volume 3
├── 04-ai-agents.md             # Volume 4
├── 05-industry-intelligence.md  # Volume 5
├── 06-seo-intelligence.md      # Volume 6
├── 07-creative-factory.md      # Volume 7
├── 08-campaign-intelligence.md  # Volume 8
├── 09-publishing-center.md     # Volume 9
├── 10-automation-engine.md     # Volume 10
├── 11-performance-intelligence.md # Volume 11
├── 12-enterprise-security.md   # Volume 12
├── 13-api-contracts.md         # Volume 13
├── 14-frontend-architecture.md  # Volume 14
├── 15-development-roadmap.md   # Volume 15
└── prompts/
    ├── 001-foundation.md       # Prompt 001
    ├── 002-authentication.md   # Prompt 002
    └── ...                     # Through Prompt 018
```

### Protocol

Every AI assistant (Gemini, Shogo, Codex, Claude, Cursor, Windsurf, or any future AI) MUST:

1. **Read `MASTER_CONTEXT/INDEX.md` first** — this is the entry point
2. **Read `00-enterprise-constitution.md`** — understand the rules
3. **Read the relevant volume** — for the module being worked on
4. **Check frozen modules** — never modify completed modules
5. **Follow quality gates** — before marking work as done
6. **Update documentation** — after every change

### Rule

> No AI assistant may implement new functionality without first reading and acknowledging the MASTER_CONTEXT.

---

## 16. Development Roadmap

### Phase 1 — Foundation ✅ COMPLETED

| Module | Status | Notes |
|---|---|---|
| Authentication | ✅ | Supabase Auth + JWT |
| Organizations | ✅ | Multi-tenant core |
| RBAC | ✅ | Role-based access control |
| AI Provider Manager | ✅ | Multi-provider routing |
| Global Job Orchestrator | ✅ | Async task management |

### Phase 2 — Intelligence ✅ COMPLETED

| Module | Status | Notes |
|---|---|---|
| Industry Intelligence | ✅ | 50+ industry knowledge base |
| SEO Intelligence | ✅ | Keyword clustering, ranking |
| Campaign Intelligence | ✅ | Campaign lifecycle |
| Performance Intelligence | ✅ | Analytics and ROI |

### Phase 3 — Creative ⏳ IN PROGRESS

| Module | Status | Notes |
|---|---|---|
| Image Studio | ✅ | AI image generation |
| Video Studio | ✅ | AI video generation |
| Voice Studio | ⏳ | AI voice generation |
| Avatar Studio | ⏳ | AI avatar creation |
| Media Composer AI | ⏳ | Multi-asset composition |
| Brand Intelligence | ⏳ | Brand kit management |

### Phase 4 — Distribution 📋 PLANNED

| Module | Status | Notes |
|---|---|---|
| Publishing Center (Enhanced) | 📋 | Multi-platform publishing |
| Social Connectors | 📋 | Direct API integrations |
| Scheduler | 📋 | Publishing scheduling |
| Analytics Dashboard | 📋 | Cross-platform analytics |

### Phase 5 — Autonomous Enterprise 📋 PLANNED

| Module | Status | Notes |
|---|---|---|
| Learning Engine | 📋 | AI learning from performance |
| AI Marketing Brain | 📋 | Autonomous marketing intelligence |
| Predictive Campaign Intelligence | 📋 | ML-based prediction |
| Enterprise Knowledge Graph | 📋 | Cross-module knowledge |
| B2B Procurement Intelligence | 📋 | Buyer/supplier matching |
| Supplier Discovery Engine | 📋 | AI supplier finding |
| Buyer Discovery Engine | 📋 | AI buyer finding |
| RFQ Intelligence | 📋 | Automated RFQ processing |
| Export Intelligence | 📋 | Export regulations & markets |
| Manufacturing Intelligence | 📋 | Manufacturing capabilities |
| Autonomous Growth Engine | 📋 | Self-optimizing marketing |

---

## 17. Volume Index

This Constitution is Volume 0 of a 25-volume Enterprise Architecture:

| Vol | Title | Status | Description |
|---|---|---|---|
| 0 | **Enterprise Constitution** | ✅ This document | Master rules and governance |
| 1 | Executive Vision & Business Blueprint | 📋 | Business model, revenue, strategy |
| 2 | Enterprise System Architecture | 📋 | System design, diagrams, boundaries |
| 3 | Complete Database Design | 📋 | All PostgreSQL/Supabase schemas |
| 4 | AI Agent Architecture | 📋 | 25 agent definitions |
| 5 | Industry Intelligence | 📋 | 50+ industries, 450+ categories |
| 6 | SEO Intelligence | 📋 | Keywords, ranking, content gaps |
| 7 | Creative Factory | 📋 | Image, Video, Voice, Avatar studios |
| 8 | Campaign Intelligence | 📋 | Campaign lifecycle management |
| 9 | Publishing Center | 📋 | Multi-platform distribution |
| 10 | Automation Engine | 📋 | Workflow automation |
| 11 | Performance Intelligence | 📋 | Analytics, ROI, optimization |
| 12 | Enterprise Security | 📋 | JWT, RBAC, RLS, encryption |
| 13 | Enterprise APIs | 📋 | Complete REST endpoint reference |
| 14 | Frontend Architecture | 📋 | React component hierarchy |
| 15 | Development Roadmap | 📋 | Phased implementation plan |
| 16 | B2B Procurement Intelligence | 📋 | Buyer/supplier matching |
| 17 | Export Intelligence | 📋 | International trade |
| 18 | Manufacturing Intelligence | 📋 | Manufacturing capabilities |
| 19 | Observability & Monitoring | 📋 | Logging, metrics, alerting |
| 20 | DevSecOps | 📋 | CI/CD, security scanning |
| 21 | Testing Strategy | 📋 | Unit, integration, E2E |
| 22 | Infrastructure & Scaling | 📋 | Deployment, scaling, CDN |
| 23 | Data Governance | 📋 | Compliance, retention, audit |
| 24 | Implementation Prompts | 📋 | AI coding prompts per phase |
| 25 | Enterprise Certification | 📋 | Final quality certification |

---

## 18. Amendment History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-14 | Bell24h-OS Team | Initial Constitution |

### Amendment Process

1. Propose change in CHANGELOG.md
2. Document rationale
3. Update this Constitution
4. Bump version number
5. Notify all AI assistants via MASTER_CONTEXT/INDEX.md update

---

## Appendix A — Quick Reference for AI Assistants

Before implementing ANY feature, ask yourself:

```
□ Have I read MASTER_CONTEXT/INDEX.md?
□ Have I read this Constitution?
□ Is the target module frozen? (Section 6)
□ Am I following the 10 Immutable Laws? (Section 5)
□ Am I using service layers? (Rule 4)
□ Am I using the Job Orchestrator? (Rule 5)
□ Is my data organization-scoped? (Rule 6)
□ Is RLS enabled? (Rule 7)
□ Is this production-ready? (Rule 9)
□ Will this pass all Quality Gates? (Section 13)
□ Have I updated all documentation? (Section 14)
```

If any answer is **NO**, stop and fix it before proceeding.

---

## Appendix B — Glossary

| Term | Definition |
|---|---|
| **Bell24h-OS** | The enterprise AI marketing operating system |
| **VyaparSethu** | The primary product built on Bell24h-OS |
| **MSME** | Micro, Small and Medium Enterprise |
| **Organization** | The top-level tenant entity in the multi-tenant model |
| **RBAC** | Role-Based Access Control |
| **RLS** | Row Level Security (PostgreSQL feature) |
| **Job Orchestrator** | The global async task management system |
| **Service Layer** | The abstraction between modules and providers |
| **Intelligence Layer** | A subsystem that provides business intelligence |
| **Creative Pipeline** | The flow from strategy to published content |
| **Data Pipeline** | The flow of business data through the system |
| **Quality Gate** | A verification step that must pass before module completion |
| **MASTER_CONTEXT** | The permanent memory folder for the project |
| **Frozen Module** | A completed module that cannot be restructured |
| **Agent** | An AI assistant with a specific role and responsibilities |

---

*This document is the single source of truth for Bell24h-OS. When in doubt, refer here.*
