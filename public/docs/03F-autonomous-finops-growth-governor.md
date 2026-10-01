# Volume 03F — Enterprise Economic Intelligence, FinOps & Autonomous Growth Governor

**Bell24h-OS Enterprise Architecture Document**

---

| Field | Value |
|---|---|
| **Volume** | 03F |
| **Title** | Enterprise Economic Intelligence, FinOps & Autonomous Growth Governor |
| **System** | Bell24h-OS |
| **Platform** | VyaparSethu |
| **Version** | 1.0 |
| **Date** | 2026-07-15 |
| **Status** | Architecture Specification |
| **Lines** | 7,500+ (target) |
| **Classification** | Internal — Architecture Team |

---

## Table of Contents

- [Prologue — Why This Module](#prologue--why-this-module)
- [Part I — Economic Intelligence Architecture](#part-i--economic-intelligence-architecture)
  - [1. Constitutional Economic Principles](#1-constitutional-economic-principles)
  - [2. Four Brains Architecture](#2-four-brains-architecture)
  - [3. Economic Intelligence Loop](#3-economic-intelligence-loop)
  - [4. Universal Cost Taxonomy](#4-universal-cost-taxonomy)
  - [5. Economic Attribution Model](#5-economic-attribution-model)
- [Part II — FinOps Governor](#part-ii--finops-governor)
  - [6. Cloud & Infrastructure Cost Intelligence](#6-cloud--infrastructure-cost-intelligence)
  - [7. AI Provider Cost Intelligence](#7-ai-provider-cost-intelligence)
  - [8. Content Generation Cost Intelligence](#8-content-generation-cost-intelligence)
  - [9. Communication Cost Intelligence](#9-communication-cost-intelligence)
  - [10. Cost Anomaly Detection](#10-cost-anomaly-detection)
  - [11. Cost Forecasting](#11-cost-forecasting)
  - [12. Provider Routing Optimization](#12-provider-routing-optimization)
- [Part III — Customer Acquisition Intelligence & Budget Governor](#part-iii--customer-acquisition-intelligence--budget-governor)
  - [13. Acquisition Entity Types](#13-acquisition-entity-types)
  - [14. True Acquisition Cost](#14-true-acquisition-cost)
  - [15. CAC Attribution Model](#15-cac-attribution-model)
  - [16. Acquisition Funnel Economics](#16-acquisition-funnel-economics)
  - [17. LTV & Payback Intelligence](#17-ltv--payback-intelligence)
  - [18. CAC Budget Governor](#18-cac-budget-governor)
  - [19. CAC Targets & Thresholds](#19-cac-targets--thresholds)
  - [20. Autonomous CAC Decisions](#20-autonomous-cac-decisions)
  - [21. Budget Reallocation Intelligence](#21-budget-reallocation-intelligence)
- [Part IV — Advertising Budget Governor](#part-iv--advertising-budget-governor)
  - [22. Multi-Channel Advertising Intelligence](#22-multi-channel-advertising-intelligence)
  - [23. Campaign Profitability Analysis](#23-campaign-profitability-analysis)
  - [24. ROAS Intelligence](#24-roas-intelligence)
  - [25. Ad Spend Autonomy Levels](#25-ad-spend-autonomy-levels)
  - [26. Cross-Channel Budget Arbitrage](#26-cross-channel-budget-arbitrage)
  - [27. Advertising Decision Engine](#27-advertising-decision-engine)
- [Part V — Growth Capital Allocation Governor](#part-v--growth-capital-allocation-governor)
  - [28. Capital Allocation Intelligence](#28-capital-allocation-intelligence)
  - [29. Investment ROI Framework](#29-investment-roi-framework)
  - [30. Marginal Value Analysis](#30-marginal-value-analysis)
  - [31. Portfolio Optimization](#31-portfolio-optimization)
  - [32. Growth Stage Models](#32-growth-stage-models)
- [Part VI — Economic Metrics Encyclopedia](#part-vi--economic-metrics-encyclopedia)
  - [33. Cost Metrics](#33-cost-metrics)
  - [34. Revenue Metrics](#34-revenue-metrics)
  - [35. Acquisition Metrics](#35-acquisition-metrics)
  - [36. Advertising Metrics](#36-advertising-metrics)
  - [37. Content Economics Metrics](#37-content-economics-metrics)
  - [38. AI Economics Metrics](#38-ai-economics-metrics)
- [Part VII — Database Architecture](#part-vii--database-architecture)
  - [39. Schema Overview](#39-schema-overview)
  - [40. Core Economic Tables](#40-core-economic-tables)
  - [41. Cost Management Tables](#41-cost-management-tables)
  - [42. Acquisition Intelligence Tables](#42-acquisition-intelligence-tables)
  - [43. Advertising Economics Tables](#43-advertising-economics-tables)
  - [44. Growth Capital Tables](#44-growth-capital-tables)
  - [45. Decision Engine Tables](#45-decision-engine-tables)
  - [46. Time-Series & Partitioning Strategy](#46-time-series--partitioning-strategy)
- [Part VIII — AI Agent Architecture](#part-viii--ai-agent-architecture)
  - [47. Agent Taxonomy](#47-agent-taxonomy)
  - [48. Economic Governor Agent](#48-economic-governor-agent)
  - [49. FinOps Agent](#49-finops-agent)
  - [50. Customer Acquisition Intelligence Agent](#50-customer-acquisition-intelligence-agent)
  - [51. Advertising Budget Agent](#51-advertising-budget-agent)
  - [52. Growth Capital Allocation Agent](#52-growth-capital-allocation-agent)
  - [53. Supporting Agents](#53-supporting-agents)
- [Part IX — Autonomy & Control Framework](#part-ix--autonomy--control-framework)
  - [54. Autonomy Levels](#54-autonomy-levels)
  - [55. Budget Guardrails](#55-budget-guardrails)
  - [56. Human Approval Gates](#56-human-approval-gates)
  - [57. Audit & Compliance](#57-audit--compliance)
- [Part X — Integration Map](#part-x--integration-map)
  - [58. System Integration Points](#58-system-integration-points)
  - [59. Data Flow Architecture](#59-data-flow-architecture)
  - [60. Event Bus Architecture](#60-event-bus-architecture)
- [Appendices](#appendices)
  - [Appendix A — Economic KPI Dashboard](#appendix-a--economic-kpi-dashboard)
  - [Appendix B — Example Economic Decisions](#appendix-b--example-economic-decisions)
  - [Appendix C — Provider Cost Comparison Matrix](#appendix-c--provider-cost-comparison-matrix)
  - [Appendix D — Industry-Specific CAC Benchmarks](#appendix-d--industry-specific-cac-benchmarks)
  - [Appendix E — Version Control](#appendix-e--version-control)

---

## Prologue — Why This Module

### The Problem

Bell24h-OS wants to produce 2,000+ assets per day and distribute across hundreds of B2B categories across India. Without economic intelligence, the system becomes an excellent money-spending machine:

```
WITHOUT ECONOMIC INTELLIGENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 1: Generate 2,000 assets          ₹15,000
Day 2: Generate 2,000 assets          ₹15,000
Day 3: Generate 2,000 assets          ₹15,000
Day 4: Generate 2,000 assets          ₹15,000
Day 5: Generate 2,000 assets          ₹15,000
                                    ──────────
Monthly burn:                       ₹4,50,000
Revenue from assets:                ₹45,000
Net loss:                          ₹4,05,000
                                   ══════════

WITH ECONOMIC INTELLIGENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 1: Generate 2,000 assets          ₹15,000
       → 81% of traffic from 1.35% of assets
Day 2: Generate 270 optimized assets  ₹2,025
Day 3: Generate 270 + 135 variants    ₹3,038
Day 4: Pause low-performers           ₹1,519
Day 5: Scale winners                  ₹2,278
                                    ──────────
Monthly optimized spend:            ₹65,000
Revenue from optimized assets:     ₹1,80,000
Net value:                        ₹1,15,000
                                   ══════════
```

### The Principle

**Bell24h-OS must not optimize for cheapest cost. It must optimize for:**

```
BUSINESS VALUE / TOTAL ECONOMIC COST
```

A ₹100 lead producing no RFQ is worse than a ₹1,000 buyer producing ₹1,00,000 in transaction value.

### The Solution

An **Enterprise Economic Intelligence, FinOps & Autonomous Growth Governor** — four interconnected intelligence brains that continuously measure, attribute, analyze, and optimize every ₹1 spent on compute, AI, advertising, and customer acquisition.

---

## Part I — Economic Intelligence Architecture

### 1. Constitutional Economic Principles

These principles are **immutable** in the Bell24h-OS Enterprise Constitution:

| # | Principle | Rule |
|---|---|---|
| **EP-01** | Economic Visibility First | Every operation must have a cost attribution before execution |
| **EP-02** | Business Value Over Cost | Optimize for VALUE/COST ratio, not minimum cost |
| **EP-03** | Separated Acquisition Economics | Each acquisition entity type has its own CAC — never mix |
| **EP-04** | Budget-Bounded Autonomy | No agent may exceed its budget without policy authorization |
| **EP-05** | Economic Audit Trail | Every economic decision must be logged with context and reasoning |
| **EP-06** | Marginal Analysis | Always evaluate the marginal value of the next ₹1 spent |
| **EP-07** | Forecasting Before Spending | Estimate economic impact before executing cost-incurring operations |
| **EP-08** | Anomaly Detection | Any cost deviation >2σ from baseline triggers investigation |
| **EP-09** | Human-in-the-Loop for Escalation | Budget increases beyond policy require human approval |
| **EP-10** | Provider Agnosticism | Route to the most efficient provider for the job, not the cheapest |
| **EP-11** | Quality-Adjusted Economics | Lead quality, RFQ quality, supplier quality influence economic decisions |
| **EP-12** | Temporal Awareness | CAC and ROI change over time — recalculate continuously |
| **EP-13** | Geographic Sensitivity | Economics vary by city, state, country — never use global averages |
| **EP-14** | Industry Sensitivity | Economics vary by industry — steel CAC ≠ textile CAC |
| **EP-15** | Platform Attribution | Track which platform/channel drove every economic outcome |

### 2. Four Brains Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  ECONOMIC INTELLIGENCE LAYER                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              🧠 ECONOMIC GOVERNOR AGENT                      │   │
│  │         (Master Orchestrator — All 4 Brains)                 │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│         ┌───────────────────┼───────────────────┐                  │
│         │                   │                   │                   │
│         ▼                   ▼                   ▼                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   🧠 BRAIN 1  │  │   🧠 BRAIN 2  │  │   🧠 BRAIN 3  │             │
│  │   FinOps     │  │  Customer    │  │  Advertising │             │
│  │   Governor   │  │  Acquisition │  │  Budget      │             │
│  │              │  │  Governor    │  │  Governor    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                             │                                       │
│                             ▼                                       │
│                    ┌──────────────┐                                 │
│                    │   🧠 BRAIN 4  │                                 │
│                    │   Growth     │                                 │
│                    │   Capital    │                                 │
│                    │   Allocation │                                 │
│                    └──────────────┘                                 │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              📊 PERFORMANCE + LEARNING FEEDBACK              │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

#### Brain 1 — FinOps Governor

**Purpose:** Measure and optimize all infrastructure, AI, and operational costs.

| Scope | Details |
|---|---|
| Cloud compute | AWS/GCP/Azure instances, serverless functions, containers |
| Database | Supabase/PostgreSQL read/write costs, connection pooling |
| Storage | S3/R2/blob storage for images, videos, documents |
| Bandwidth | CDN, egress, API traffic |
| AI tokens | LLM costs by model, provider, task type |
| Image generation | DALL-E, Midjourney, Stable Diffusion, FLUX costs |
| Video generation | Runway, Pika, Sora, Kling costs |
| Voice generation | ElevenLabs, PlayHT, Azure TTS costs |
| Avatar generation | HeyGen, Synthesia costs |
| Scraping | Proxies, rendering, extraction costs |
| Search APIs | Serper, Google Custom Search, Bing costs |
| Email | SendGrid, AWS SES costs |
| WhatsApp | Business API costs |
| Publishing | Social media API costs |

#### Brain 2 — Customer Acquisition Intelligence & Budget Governor

**Purpose:** Calculate true CAC per entity type, manage acquisition budgets, optimize LTV:CAC.

| Scope | Details |
|---|---|
| Acquisition entity types | 12 types tracked independently |
| True acquisition cost | Fully loaded cost per acquisition entity |
| CAC attribution | 22-dimensional attribution model |
| Funnel economics | 18-stage funnel cost tracking |
| LTV calculation | Predicted, cohort, and actual lifetime values |
| Budget governance | 12 budget types with configurable targets |
| Autonomous decisions | 22 decision types with approval gates |

#### Brain 3 — Advertising Budget Governor

**Purpose:** Optimize ad spend across channels for maximum ROAS and qualified lead generation.

| Scope | Details |
|---|---|
| Channels | Google Ads, Meta Ads, LinkedIn Ads, future channels |
| Campaign types | Search, Display, Social, Video, Retargeting |
| ROAS tracking | Per campaign, per channel, per keyword, per city |
| Budget allocation | Dynamic cross-channel reallocation |
| Creative performance | Cost per winning creative variant |
| Audience optimization | Persona-based bid optimization |

#### Brain 4 — Growth Capital Allocation Governor

**Purpose:** Allocate growth capital across business units for maximum portfolio ROI.

| Scope | Details |
|---|---|
| Investment areas | Content, advertising, infrastructure, talent, tools |
| ROI tracking | Per investment area, per initiative |
| Marginal analysis | Marginal return on next ₹1 invested |
| Portfolio optimization | Risk-adjusted returns across investments |
| Stage models | Pre-revenue, growth, scale, maturity optimization |

### 3. Economic Intelligence Loop

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ① COLLECT                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │ Every operation generates a cost event        │   │
│  │ Cost event → attribution tags → storage       │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ② ATTRIBUTE                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ Tag cost to: org, campaign, industry,         │   │
│  │ category, product, asset, job, workflow,      │   │
│  │ provider, model, channel, geo, keyword        │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ③ ANALYZE                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ Calculate metrics: CPA, CAC, ROAS, ROI,      │   │
│  │ marginal value, trend, anomaly score          │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ④ COMPARE                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ Compare against: targets, baselines,          │   │
│  │ benchmarks, historical, forecast              │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ⑤ DECIDE                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │ Governor agent generates decisions:           │   │
│  │ SCALE / REDUCE / PAUSE / STOP / REROUTE      │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ⑥ APPROVE                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ Check autonomy level:                         │   │
│  │ L0: Log only                                  │   │
│   │ L1: Recommend → human approval               │   │
│  │ L2: Auto within ±10%                          │   │
│  │ L3: Auto within daily budget                  │   │
│  │ L4: Full autonomy                             │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ⑦ EXECUTE                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ Apply decision: update budgets,               │   │
│  │ reroute providers, pause campaigns,           │   │
│  │ scale winners, generate variants              │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ⑧ MONITOR                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ Track impact of decision:                     │   │
│  │ Did SCALE increase revenue?                   │   │
│  │ Did PAUSE reduce loss?                        │   │
│  │ Did REROUTE maintain quality at lower cost?   │   │
│  └──────────────────────────────────────────────┘   │
│           ↓                                          │
│  ⑨ LEARN                                            │
│  ┌──────────────────────────────────────────────┐   │
│  │ Update models:                                │   │
│  │ - Provider efficiency rankings                │   │
│  │ - Industry CAC benchmarks                     │   │
│  │ - Keyword value scores                        │   │
│  │ - Channel attribution weights                 │   │
│  │ - Content format performance                  │   │
│  └──────────────────────────────────────────────┘   │
│           │                                          │
│           └──────────→ ① COLLECT (loop)              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 4. Universal Cost Taxonomy

Every cost in Bell24h-OS falls into one of these categories:

#### 4.1 Infrastructure Costs

| Cost Category | Sub-Category | Unit | Measurement |
|---|---|---|---|
| `INFRA_COMPUTE` | Virtual machines | $/hour | CPU-hours consumed |
| `INFRA_COMPUTE` | Serverless functions | $/invocation | Invocations × duration |
| `INFRA_COMPUTE` | Containers | $/hour | Container-hours |
| `INFRA_COMPUTE` | Kubernetes | $/month | Cluster node costs |
| `INFRA_DATABASE` | PostgreSQL reads | $/GB | Data scanned |
| `INFRA_DATABASE` | PostgreSQL writes | $/row | Rows written |
| `INFRA_DATABASE` | Connection pooling | $/hour | Connection-hours |
| `INFRA_DATABASE` | Supabase | $/month | Plan cost allocation |
| `INFRA_STORAGE` | Object storage | $/GB/month | GB stored |
| `INFRA_STORAGE` | Block storage | $/GB/month | GB provisioned |
| `INFRA_STORAGE` | Backup storage | $/GB/month | GB backed up |
| `INFRA_BANDWIDTH` | CDN egress | $/GB | GB transferred |
| `INFRA_BANDWIDTH` | API traffic | $/GB | GB transferred |
| `INFRA_BANDWIDTH` | WebSocket | $/message | Messages sent |

#### 4.2 AI Provider Costs

| Cost Category | Sub-Category | Unit | Measurement |
|---|---|---|---|
| `AI_LLM` | Prompt tokens | $/1K tokens | Input tokens consumed |
| `AI_LLM` | Completion tokens | $/1K tokens | Output tokens generated |
| `AI_LLM` | System prompt tokens | $/1K tokens | System prompt size |
| `AI_LLM` | Context window | $/1K tokens | Total context consumed |
| `AI_IMAGE` | DALL-E 3 | $/image | Images generated |
| `AI_IMAGE` | Midjourney | $/image | Images generated |
| `AI_IMAGE` | Stable Diffusion | $/image | GPU compute time |
| `AI_IMAGE` | FLUX | $/image | Images generated |
| `AI_VIDEO` | Runway Gen-3 | $/second | Video seconds generated |
| `AI_VIDEO` | Pika | $/second | Video seconds generated |
| `AI_VIDEO` | Kling | $/second | Video seconds generated |
| `AI_VOICE` | ElevenLabs | $/char | Characters synthesized |
| `AI_VOICE` | PlayHT | $/char | Characters synthesized |
| `AI_VOICE` | Azure TTS | $/char | Characters synthesized |
| `AI_AVATAR` | HeyGen | $/minute | Avatar minutes generated |
| `AI_AVATAR` | Synthesia | $/minute | Avatar minutes generated |

#### 4.3 Operational Costs

| Cost Category | Sub-Category | Unit | Measurement |
|---|---|---|---|
| `OP_SEARCH` | Serper API | $/query | Queries executed |
| `OP_SEARCH` | Google Custom Search | $/query | Queries executed |
| `OP_SCRAPE` | Proxy rotation | $/request | Requests via proxy |
| `OP_SCRAPE` | Headless browser | $/page | Pages rendered |
| `OP_EMAIL` | SendGrid | $/email | Emails sent |
| `OP_EMAIL` | AWS SES | $/email | Emails sent |
| `OP_WHATSAPP` | Business API | $/message | Messages sent |
| `OP_SMS` | SMS gateway | $/message | Messages sent |
| `OP_PUBLISH` | LinkedIn API | $/post | Posts published |
| `OP_PUBLISH` | Instagram API | $/post | Posts published |
| `OP_PUBLISH` | Twitter API | $/post | Posts published |
| `OP_PUBLISH` | YouTube API | $/upload | Videos uploaded |

#### 4.4 Advertising Costs

| Cost Category | Sub-Category | Unit | Measurement |
|---|---|---|---|
| `ADS_GOOGLE` | Search campaigns | $/click | Clicks received |
| `ADS_GOOGLE` | Display campaigns | $/impression | Impressions served |
| `ADS_GOOGLE` | Performance Max | $/conversion | Conversions tracked |
| `ADS_META` | Feed ads | $/click | Clicks received |
| `ADS_META` | Reel ads | $/view | Views received |
| `ADS_META` | Story ads | $/impression | Impressions served |
| `ADS_LINKEDIN` | Sponsored content | $/click | Clicks received |
| `ADS_LINKEDIN` | Message ads | $/send | Messages delivered |
| `ADS_LINKEDIN` | Job ads | $/click | Clicks received |
| `ADS_FUTURE` | Platform-specific | varies | varies |

### 5. Economic Attribution Model

Every cost event in Bell24h-OS must carry **attribution tags** that enable multi-dimensional economic analysis.

#### 5.1 Required Attribution Dimensions

```yaml
cost_event:
  # WHO incurred the cost
  organization_id: uuid           # Required — tenant isolation
  user_id: uuid                  # Optional — which user triggered
  
  # WHAT generated the cost
  operation_type: enum            # Required — the operation category
  operation_id: uuid              # Required — specific operation reference
  
  # WHERE the cost applies
  campaign_id: uuid               # Optional — which campaign
  industry_id: uuid               # Optional — which industry vertical
  category_id: uuid               # Optional — which product category
  subcategory_id: uuid            # Optional — which subcategory
  product_id: uuid                # Optional — which product
  
  # WHICH AI generated the cost
  ai_provider_id: uuid            # Optional — which provider (OpenAI, etc.)
  ai_model_id: uuid               # Optional — which model (gpt-4o, etc.)
  ai_task_type: enum              # Optional — content_gen, analysis, etc.
  
  # WHERE the content is published
  channel_id: uuid                # Optional — which publishing channel
  platform_id: uuid               # Optional — which social platform
  country_id: uuid                # Optional — target country
  state_id: uuid                  # Optional — target state
  city_id: uuid                   # Optional — target city
  
  # WHICH audience is targeted
  keyword_id: uuid                # Optional — which keyword
  keyword_cluster_id: uuid        # Optional — which keyword cluster
  buyer_persona_id: uuid          # Optional — which buyer persona
  supplier_persona_id: uuid       # Optional — which supplier persona
  
  # WHICH workflow generated the cost
  job_id: uuid                    # Optional — which job
  workflow_id: uuid               # Optional — which workflow
  workflow_step: int              # Optional — which step in workflow
  
  # WHAT content was produced
  asset_id: uuid                  # Optional — which asset
  asset_type: enum                # Optional — image, video, text, etc.
  
  # ECONOMIC metadata
  cost_amount: decimal            # Required — actual cost
  cost_currency: string           # Required — INR, USD, etc.
  cost_usd_equivalent: decimal    # Required — normalized to USD
  
  # MEASUREMENT
  duration_ms: int                # Optional — operation duration
  tokens_consumed: int            # Optional — AI tokens used
  records_processed: int          # Optional — data records processed
  
  # CONTEXT
  execution_context: enum         # autonomous, scheduled, triggered, manual
  autonomy_level_used: enum       # L0-L4
  
  # TIMESTAMPS
  started_at: timestamp           # Required
  completed_at: timestamp         # Required
  recorded_at: timestamp          # Required — when cost was recorded
```

#### 5.2 Attribution Priority Rules

When multiple attribution dimensions apply, priority determines which dimension receives the cost credit:

| Priority | Dimension | Rationale |
|---|---|---|
| 1 | `organization_id` | Always — tenant isolation |
| 2 | `campaign_id` | Direct campaign costs go to campaign |
| 3 | `job_id` | Job-level costs go to job |
| 4 | `workflow_id` | Workflow-level costs go to workflow |
| 5 | `asset_id` | Asset-specific costs go to asset |
| 6 | `product_id` | Product-level costs |
| 7 | `category_id` | Category-level costs |
| 8 | `industry_id` | Industry-level allocation |

#### 5.3 Cost Allocation Methods

| Method | When to Use | Example |
|---|---|---|
| **Direct** | Cost is directly attributable to one entity | DALL-E image for product X → cost goes to product X |
| **Proportional** | Cost benefits multiple entities proportionally | Batch content generation → split by token count per category |
| **Equal Split** | Cost benefits all entities equally | Platform fee → split across all active campaigns |
| **Time-Based** | Cost accrues over time | Server hosting → allocate by hours used per campaign |
| **Weighted** | Cost allocation based on usage weights | API calls → allocate by call volume per workflow |

---

## Part II — FinOps Governor

### 6. Cloud & Infrastructure Cost Intelligence

#### 6.1 Cost Collection Architecture

```
┌─────────────────────────────────────────────────────────┐
│                INFRASTRUCTURE LAYER                      │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ AWS      │  │ GCP      │  │ Azure    │              │
│  │ Billing  │  │ Billing  │  │ Billing  │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
│  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐              │
│  │ Cost     │  │ Cost     │  │ Cost     │              │
│  │ Explorer │  │ Billing  │  │ Cost     │              │
│  │ API      │  │ API      │  │ Mgmt     │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
│       └──────────────┼──────────────┘                    │
│                      ▼                                   │
│  ┌──────────────────────────────────────────────┐       │
│  │          Cost Aggregation Service             │       │
│  │  - Normalize currencies                       │       │
│  │  - Apply attribution tags                     │       │
│  │  - Calculate allocation shares                │       │
│  │  - Store in cost_events table                 │       │
│  └──────────────────────────────────────────────┘       │
│                      │                                   │
│  ┌───────────────────▼──────────────────────────┐       │
│  │       Supabase Cost Tracking                  │       │
│  │  - Database reads/writes per query            │       │
│  │  - Storage per table                          │       │
│  │  - Auth operations                            │       │
│  │  - Edge function invocations                  │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

#### 6.2 Infrastructure Cost Metrics

| Metric | Formula | Target | Alert Threshold |
|---|---|---|---|
| `INFRA_COST_PER_DAY` | SUM(infra_costs) per day | <$50 | >$80 |
| `INFRA_COST_PER_ASSET` | infra_cost / assets_generated | <₹5 | >₹10 |
| `INFRA_COST_PER_ORG` | infra_cost / organizations | <₹2/org/day | >₹5/org/day |
| `INFRA_COST_TREND_7D` | 7-day moving average | Stable ±5% | >+15% |
| `INFRA_COST_PER_REQUEST` | infra_cost / total_requests | <₹0.01 | >₹0.05 |
| `INFRA_STORAGE_COST_RATIO` | storage_cost / total_infra | <20% | >40% |
| `INFRA_BANDWIDTH_COST_RATIO` | bandwidth_cost / total_infra | <15% | >30% |

#### 6.3 Infrastructure Optimization Rules

```yaml
optimization_rules:
  - name: "Right-size idle instances"
    trigger: "CPU utilization < 10% for 48 hours"
    action: "DOWNGRADE_INSTANCE"
    autonomy_level: "L2"
    max_change: "one tier down"
    
  - name: "Scale down off-peak"
    trigger: "Traffic < 20% of peak for 4+ hours"
    action: "SCALE_DOWN"
    autonomy_level: "L3"
    min_instances: 2
    
  - name: "Kill orphaned resources"
    trigger: "Resource not tagged to any active org/job"
    action: "TERMINATE"
    grace_period: "24 hours"
    autonomy_level: "L2"
    
  - name: "Storage lifecycle"
    trigger: "Objects not accessed for 90 days"
    action: "MOVE_TO_COLD_STORAGE"
    autonomy_level: "L3"
    
  - name: "CDN optimization"
    trigger: "Egress cost > 30% of storage cost"
    action: "REVIEW_CDN_CONFIG"
    autonomy_level: "L1"
```

### 7. AI Provider Cost Intelligence

#### 7.1 Provider Cost Matrix

| Provider | Model | Task Type | Cost Per 1K Tokens | Quality Score | Speed Score | Best For |
|---|---|---|---|---|---|---|
| OpenAI | GPT-4o | Content gen | $0.005 | 9/10 | 8/10 | High-quality content |
| OpenAI | GPT-4o-mini | Content gen | $0.00015 | 7/10 | 9/10 | Bulk content |
| OpenAI | DALL-E 3 | Image gen | $0.040/image | 8/10 | 7/10 | Product images |
| Anthropic | Claude Sonnet | Content gen | $0.003 | 9/10 | 7/10 | Analysis, long-form |
| Anthropic | Claude Haiku | Content gen | $0.00025 | 7/10 | 9/10 | Quick tasks |
| Google | Gemini Pro | Content gen | $0.001 | 8/10 | 8/10 | Multi-modal |
| Stability | SDXL | Image gen | $0.002/image | 7/10 | 8/10 | Bulk images |
| FLUX | FLUX.1 Pro | Image gen | $0.005/image | 9/10 | 6/10 | High-quality images |
| Runway | Gen-3 Alpha | Video gen | $0.05/sec | 8/10 | 5/10 | Product videos |
| ElevenLabs | Turbo v2.5 | Voice gen | $0.015/1K chars | 9/10 | 8/10 | Voiceovers |
| PlayHT | PlayHT 2.0 | Voice gen | $0.010/1K chars | 7/10 | 9/10 | Bulk voiceovers |

#### 7.2 AI Cost Attribution by Task

| Task | Provider Choice | Cost Range | Quality Requirement |
|---|---|---|---|
| LinkedIn post | GPT-4o-mini | ₹0.05–0.15 | Medium — engagement matters |
| Blog article (2000 words) | GPT-4o or Claude Sonnet | ₹2–5 | High — SEO value |
| Product description | GPT-4o-mini | ₹0.02–0.10 | Medium — conversion matters |
| Email sequence | Claude Haiku | ₹0.1–0.3 | Medium — personalization |
| WhatsApp message | GPT-4o-mini | ₹0.01–0.05 | Low — brevity |
| Video script | Claude Sonnet | ₹1–3 | High — narrative quality |
| SEO keyword analysis | GPT-4o | ₹0.5–2 | High — accuracy matters |
| Content calendar | GPT-4o-mini | ₹0.2–0.8 | Medium — structure matters |
| Product image | DALL-E 3 or FLUX | ₹3–12 | High — visual quality |
| LinkedIn banner | FLUX | ₹4–8 | High — brand consistency |
| Product video (15s) | Runway | ₹25–50 | High — production value |
| Voiceover (60s) | ElevenLabs | ₹10–15 | High — natural voice |
| Avatar video (30s) | HeyGen | ₹50–100 | High — presentation |

#### 7.3 AI Provider Routing Intelligence

```
┌─────────────────────────────────────────────────────────┐
│              AI PROVIDER ROUTING ENGINE                   │
│                                                          │
│  Input: task_type + quality_requirement + budget_limit   │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │ 1. CHECK QUALITY REQUIREMENT                  │       │
│  │    - Critical: GPT-4o, Claude Sonnet, FLUX    │       │
│  │    - Standard: GPT-4o-mini, Gemini, SDXL      │       │
│  │    - Draft: Haiku, GPT-4o-mini, SD            │       │
│  └──────────────────────────────────────────────┘       │
│           ↓                                              │
│  ┌──────────────────────────────────────────────┐       │
│  │ 2. CHECK BUDGET REMAINING                     │       │
│  │    - Within budget → use quality-optimal       │       │
│  │    - Approaching budget → use cost-optimal     │       │
│  │    - Over budget → PAUSE or ESCALATE           │       │
│  └──────────────────────────────────────────────┘       │
│           ↓                                              │
│  ┌──────────────────────────────────────────────┐       │
│  │ 3. CHECK PROVIDER HEALTH                      │       │
│  │    - Latency < threshold?                     │       │
│  │    - Error rate < threshold?                  │       │
│  │    - Rate limit available?                    │       │
│  └──────────────────────────────────────────────┘       │
│           ↓                                              │
│  ┌──────────────────────────────────────────────┐       │
│  │ 4. CHECK HISTORICAL PERFORMANCE               │       │
│  │    - Which provider gave best ROI for this     │       │
│  │      task_type + industry combination?         │       │
│  └──────────────────────────────────────────────┘       │
│           ↓                                              │
│  ┌──────────────────────────────────────────────┐       │
│  │ 5. SELECT PROVIDER + ROUTE                    │       │
│  │    - Primary provider selected                 │       │
│  │    - Fallback provider identified              │       │
│  │    - Cost estimate generated                   │       │
│  └──────────────────────────────────────────────┘       │
│           ↓                                              │
│  ┌──────────────────────────────────────────────┐       │
│  │ 6. LOG COST EVENT                             │       │
│  │    - Record cost with full attribution         │       │
│  │    - Update provider performance model         │       │
│  └──────────────────────────────────────────────┘       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 7.4 AI Cost Optimization Strategies

| Strategy | Description | Savings Potential |
|---|---|---|
| **Model tiering** | Route simple tasks to smaller models | 60–80% |
| **Batch processing** | Group similar requests for efficiency | 15–25% |
| **Caching** | Cache repeated prompt-response pairs | 30–50% |
| **Prompt optimization** | Reduce token count without quality loss | 20–40% |
| **Provider switching** | Use cheapest provider for task | 20–40% |
| **Scheduled execution** | Run non-urgent tasks during off-peak | 10–20% |
| **Quality gates** | Skip expensive generation for low-value targets | 40–60% |

### 8. Content Generation Cost Intelligence

#### 8.1 Content Cost Per Asset Type

| Asset Type | AI Cost | Rendering Cost | Total Cost | Quality Variance |
|---|---|---|---|---|
| LinkedIn text post | ₹0.05–0.15 | ₹0 | ₹0.05–0.15 | Low |
| LinkedIn carousel (5 slides) | ₹0.50–2.00 | ₹1.00–3.00 | ₹1.50–5.00 | Medium |
| Blog article (1000 words) | ₹1.00–3.00 | ₹0 | ₹1.00–3.00 | Low |
| Blog article (2000 words) | ₹2.00–5.00 | ₹0 | ₹2.00–5.00 | Low |
| Product image (DALL-E 3) | ₹3.00–8.00 | ₹0 | ₹3.00–8.00 | Medium |
| Product image (FLUX) | ₹4.00–12.00 | ₹0 | ₹4.00–12.00 | Low |
| Infographic | ₹2.00–5.00 | ₹3.00–8.00 | ₹5.00–13.00 | High |
| WhatsApp message | ₹0.01–0.05 | ₹0.50 | ₹0.51–0.55 | Low |
| Email template | ₹0.10–0.30 | ₹0.20 | ₹0.30–0.50 | Low |
| Video script (60s) | ₹1.00–3.00 | ₹0 | ₹1.00–3.00 | Low |
| Video generation (15s) | ₹25–50 | ₹0 | ₹25–50 | High |
| Voiceover (60s) | ₹10–15 | ₹0 | ₹10–15 | Medium |
| Avatar video (30s) | ₹50–100 | ₹0 | ₹50–100 | Medium |
| Full campaign bundle | ₹200–800 | ₹100–300 | ₹300–1,100 | High |

#### 8.2 Content Cost Efficiency Targets

| Target | Metric | Goal | Action If Exceeded |
|---|---|---|---|
| Cost per published post | total_gen_cost / published_posts | <₹20 | Optimize model routing |
| Cost per qualified lead | total_gen_cost / qualified_leads | <₹100 | Improve targeting |
| Cost per RFQ generated | total_gen_cost / rfqs_generated | <₹250 | Revisit content strategy |
| Cost per 1000 impressions | total_gen_cost / impressions_×1000 | <₹50 | Optimize content formats |
| Content cost ratio | content_cost / revenue | <15% | Reduce generation volume |
| AI cost per asset | ai_tokens_cost / assets_generated | <₹5 | Switch to cheaper models |

### 9. Communication Cost Intelligence

#### 9.1 Channel Cost Comparison

| Channel | Cost Per Contact | Conversion Rate | Cost Per Conversion | Best For |
|---|---|---|---|---|
| WhatsApp | ₹0.50–1.50 | 5–15% | ₹3–30 | Supplier onboarding, quick engagement |
| Email | ₹0.02–0.10 | 1–5% | ₹0.40–10 | Nurture sequences, detailed content |
| SMS | ₹0.10–0.20 | 2–8% | ₹1.25–10 | OTPs, urgent notifications |
| LinkedIn DM | ₹0 | 3–10% | ₹0 (organic) | B2B relationship building |
| Phone (IVR) | ₹0.50–2.00 | 10–25% | ₹2–20 | High-value lead qualification |
| Telegram | ₹0 | 1–3% | ₹0 (organic) | Community building |

#### 9.2 Communication Cost Optimization

| Strategy | Description | Impact |
|---|---|---|
| Segment routing | High-value → WhatsApp, Low-value → Email | 40% cost reduction |
| Time optimization | Send during high-engagement windows | 25% better conversion |
| Content personalization | AI-generated personalized messages | 35% higher response |
| Frequency capping | Limit messages per contact per day | Prevent fatigue |
| A/B testing | Test message variants before scale | 2× conversion improvement |

### 10. Cost Anomaly Detection

#### 10.1 Anomaly Detection Framework

```yaml
anomaly_detection:
  methods:
    - name: "Statistical Threshold"
      description: "Flag costs > 2 standard deviations from 7-day mean"
      sensitivity: "medium"
      applies_to: ["all cost categories"]
      
    - name: "Sudden Spike"
      description: "Flag costs > 3× previous day's cost"
      sensitivity: "high"
      applies_to: ["daily totals"]
      
    - name: "Budget Burn Rate"
      description: "Flag if daily burn rate will exhaust monthly budget in < 20 days"
      sensitivity: "high"
      applies_to: ["budget categories"]
      
    - name: "Provider Cost Drift"
      description: "Flag if provider cost per unit changed > 10% from baseline"
      sensitivity: "medium"
      applies_to: ["AI provider costs"]
      
    - name: "Zero-Value Detection"
      description: "Flag operations with cost but zero output value"
      sensitivity: "high"
      applies_to: ["all operations"]
      
    - name: "Duplicate Detection"
      description: "Flag potential duplicate cost entries"
      sensitivity: "medium"
      applies_to: ["all cost events"]

  actions:
    - level: "info"
      description: "Log anomaly, no action"
      
    - level: "warning"
      description: "Log + notify admin"
      
    - level: "critical"
      description: "Log + notify admin + pause affected operation"
      
    - level: "emergency"
      description: "Log + notify admin + pause all related operations + escalate"
```

#### 10.2 Anomaly Response Playbook

| Anomaly Type | Detection | Response | Recovery |
|---|---|---|---|
| AI token spike | Tokens > 3× baseline | Pause non-critical jobs | Investigate → resume |
| Provider cost increase | Rate change > 10% | Switch to backup provider | Negotiate → restore |
| Ad spend overspend | Spend > daily budget 120% | Pause lowest-ROAS campaign | Reallocate budget |
| Storage growth spike | Storage > 2× weekly growth | Identify growing objects | Archive/delete stale data |
| Failed operation costs | Cost incurred but operation failed | Auto-refund if possible | Fix error → retry |
| Duplicate billing | Same cost recorded twice | Deduplicate + credit | Report to provider |

### 11. Cost Forecasting

#### 11.1 Forecasting Models

| Model | Input | Output | Accuracy | Use Case |
|---|---|---|---|---|
| Linear extrapolation | 30-day cost trend | 30-day forecast | ±15% | Quick estimates |
| Seasonal decomposition | 90-day cost + seasonality | 90-day forecast | ±10% | Monthly planning |
| Regression model | Cost drivers + historical | Cost prediction | ±8% | Budget planning |
| ML time-series | Full cost history + features | Cost prediction | ±5% | Precision forecasting |

#### 11.2 Forecast Outputs

| Forecast | Horizon | Refresh Rate | Used By |
|---|---|---|---|
| Daily cost forecast | 1 day | Every hour | Real-time budget decisions |
| Weekly cost forecast | 7 days | Every day | Campaign planning |
| Monthly cost forecast | 30 days | Every week | Budget allocation |
| Quarterly cost forecast | 90 days | Every month | Strategic planning |
| Annual cost projection | 365 days | Every quarter | Growth planning |

### 12. Provider Routing Optimization

#### 12.1 Provider Selection Algorithm

```
FUNCTION select_provider(task_type, quality_req, budget_remaining, org_id):
  
  candidates = get_providers(task_type)
  
  FOR EACH provider IN candidates:
    score = 0
    
    # Quality fit (40% weight)
    IF provider.quality_score >= quality_req:
      score += 40
    
    # Cost efficiency (30% weight)
    cost_per_unit = provider.cost_per_unit(task_type)
    cost_score = (max_cost - cost_per_unit) / max_cost * 30
    score += cost_score
    
    # Historical performance (20% weight)
    hist = get_historical_performance(provider, task_type, org_id)
    score += hist.roi_score * 20
    
    # Availability (10% weight)
    IF provider.rate_limit_available():
      score += 10
    
    provider.score = score
  
  best = sort_by_score(candidates)[0]
  
  IF best.score < MINIMUM_THRESHOLD:
    RETURN no_provider_available → ESCALATE
  
  RETURN best
```

#### 12.2 Routing Decision Log

Every routing decision must be logged:

```yaml
routing_decision:
  id: uuid
  organization_id: uuid
  task_type: string
  quality_requirement: enum
  selected_provider: string
  selected_model: string
  alternative_providers: array
  cost_estimate: decimal
  reasoning: string
  autonomy_level: enum
  timestamp: timestamp
```

---

## Part III — Customer Acquisition Intelligence & Budget Governor

### 13. Acquisition Entity Types

VyaparSethu has multiple distinct acquisition objects. **Each must be tracked independently** — never mix into a single CAC number.

#### 13.1 Acquisition Entity Registry

| Entity Type | Definition | Value Metric | Priority |
|---|---|---|---|
| `BUYER` | Any registered buyer on the platform | Registration + first browse | Medium |
| `SUPPLIER` | Any registered supplier on the platform | Registration + profile complete | High |
| `VERIFIED_SUPPLIER` | Supplier who completed verification | Verified + listing active | Critical |
| `RFQ_CREATOR` | Any user who created an RFQ | RFQ submission | High |
| `QUALIFIED_RFQ_CREATOR` | User who created RFQ with valid requirements | RFQ passing quality check | Critical |
| `ACTIVE_BUYER` | Buyer who made 3+ RFQs in 30 days | Repeat engagement | Critical |
| `ACTIVE_SUPPLIER` | Supplier who responded to 5+ RFQs in 30 days | Repeat engagement | Critical |
| `PAYING_SUPPLIER` | Supplier on a paid subscription | MRR contribution | Critical |
| `SUBSCRIPTION_CUSTOMER` | Any paying subscriber (buyer or supplier) | ARR contribution | Critical |
| `TRANSACTION_CUSTOMER` | Customer who completed a marketplace transaction | Transaction value | Critical |
| `RETURNING_CUSTOMER` | Customer who came back after 30+ day gap | Re-engagement value | High |
| `ENTERPRISE_ACCOUNT` | High-volume enterprise customer | Contract value | Critical |

#### 13.2 Entity-Specific Acquisition Paths

```
BUYER ACQUISITION PATH:
━━━━━━━━━━━━━━━━━━━━━━━
Ad Click / Organic Search / Social / Referral
  → Landing Page
  → Registration
  → Email Verified
  → First Browse
  → First RFQ
  → BUYER (acquired)

SUPPLIER ACQUISITION PATH:
━━━━━━━━━━━━━━━━━━━━━━━━━
Ad Click / Organic Search / Social / Referral / Sales Outreach
  → Landing Page
  → Registration
  → Profile Complete
  → Listing Created
  → SUPPLIER (acquired)

VERIFIED SUPPLIER ACQUISITION PATH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER (existing)
  → Verification Documents Submitted
  → Verification Review
  → VERIFIED SUPPLIER (acquired)

PAYING SUPPLIER ACQUISITION PATH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFIED SUPPLIER (existing)
  → Subscription Page View
  → Plan Selection
  → Payment Complete
  → PAYING SUPPLIER (acquired)

RFQ CREATOR ACQUISITION PATH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ad Click / Organic Search / Social / WhatsApp
  → Landing Page (RFQ-specific)
  → Registration (or Login)
  → RFQ Form
  → RFQ Submitted
  → RFQ CREATOR (acquired)

QUALIFIED RFQ CREATOR ACQUISITION PATH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RFQ CREATOR (existing)
  → RFQ Quality Check Pass
  → Supplier Match Found
  → QUALIFIED RFQ CREATOR (acquired)

TRANSACTION CUSTOMER ACQUISITION PATH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Any entity (existing)
  → RFQ → Quote → Match
  → Transaction Initiated
  → Payment / Confirmation
  → TRANSACTION CUSTOMER (acquired)
```

### 14. True Acquisition Cost

#### 14.1 Fully Loaded Acquisition Cost Formula

```
FULLY LOADED ACQUISITION COST =
    Advertising Spend (Google + Meta + LinkedIn + Future)
  + Organic Content Generation Cost (AI + rendering)
  + AI Token Cost (all LLM calls in acquisition funnel)
  + Image Generation Cost
  + Video Generation Cost
  + Voice Generation Cost
  + Avatar Generation Cost
  + Media Composition Cost
  + SEO Tool Cost (ranking tools, audit tools)
  + Search API Cost (keyword research, competitor analysis)
  + Scraping Cost (lead scraping, competitor monitoring)
  + Lead Enrichment Cost (data enrichment APIs)
  + Email Outreach Cost (sending + platform fees)
  + WhatsApp Outreach Cost (sending + platform fees)
  + SMS Cost
  + Retargeting Cost (all retargeting campaigns)
  + Sales Assistance Cost (human time allocation)
  + Verification Cost (document verification, KYC)
  + Onboarding Cost (support, setup assistance)
  + Promotional Credits (discounts, credits given)
  + Infrastructure Allocation (compute + storage allocated to acquisition)
  + Workflow Execution Cost (automation workflows)
  + Human Approval Cost (where measurable)
```

#### 14.2 CAC Calculation Types

| CAC Type | Formula | When to Use |
|---|---|---|
| `DIRECT_CAC` | Paid ads spend / acquisitions | Quick paid campaign assessment |
| `PAID_CAC` | All paid channels spend / paid acquisitions | Paid channel optimization |
| `ORGANIC_CAC` | Content + SEO cost / organic acquisitions | Organic strategy assessment |
| `BLENDED_CAC` | Total spend / total acquisitions | Overall platform health |
| `FULLY_LOADED_CAC` | All costs / all acquisitions | True economic cost |
| `MARGINAL_CAC` | Δ cost / Δ acquisitions | Should we spend more? |
| `INCREMENTAL_CAC` | Cost of next acquisition batch | Budget expansion decisions |

#### 14.3 CAC Targets by Entity Type (VyaparSethu Initial)

| Entity Type | Target CAC | Maximum CAC | LTV:CAC Target | Payback Target |
|---|---|---|---|---|
| BUYER | ₹50 | ₹150 | 10:1 | 30 days |
| SUPPLIER | ₹200 | ₹500 | 20:1 | 60 days |
| VERIFIED_SUPPLIER | ₹400 | ₹800 | 15:1 | 90 days |
| RFQ_CREATOR | ₹100 | ₹300 | 15:1 | 30 days |
| QUALIFIED_RFQ_CREATOR | ₹200 | ₹500 | 20:1 | 30 days |
| ACTIVE_BUYER | ₹300 | ₹600 | 12:1 | 60 days |
| ACTIVE_SUPPLIER | ₹500 | ₹1,000 | 18:1 | 90 days |
| PAYING_SUPPLIER | ₹1,500 | ₹3,000 | 8:1 | 120 days |
| SUBSCRIPTION_CUSTOMER | ₹2,000 | ₹5,000 | 6:1 | 180 days |
| TRANSACTION_CUSTOMER | ₹500 | ₹1,500 | 10:1 | 60 days |
| RETURNING_CUSTOMER | ₹100 | ₹300 | 15:1 | 30 days |
| ENTERPRISE_ACCOUNT | ₹10,000 | ₹25,000 | 5:1 | 365 days |

### 15. CAC Attribution Model

#### 15.1 22-Dimensional Attribution

CAC must be attributable to these dimensions simultaneously:

| Category | Dimensions | Rationale |
|---|---|---|
| **Organization** | `organization_id` | Tenant-level cost isolation |
| **Campaign** | `campaign_id` | Campaign-level ROI |
| **Industry** | `industry_id` | Industry-specific CAC benchmarks |
| **Category** | `category_id`, `subcategory_id` | Category-level economics |
| **Product** | `product_id` | Product-specific acquisition cost |
| **Geography** | `country_id`, `state_id`, `city_id` | Geo-specific CAC |
| **Keywords** | `keyword_id`, `keyword_cluster_id` | Keyword-level acquisition efficiency |
| **Persona** | `buyer_persona_id`, `supplier_persona_id` | Persona-targeted CAC |
| **Channel** | `channel_id`, `platform_id` | Channel-level CAC |
| **Content** | `content_asset_id`, `creative_asset_id` | Creative-level CAC |
| **Workflow** | `workflow_id` | Workflow execution CAC |
| **Landing** | `landing_page_id` | Landing page conversion CAC |
| **Referral** | `referral_source_id` | Referral source CAC |
| **Cohort** | `acquisition_cohort_id` | Cohort-based CAC tracking |

#### 15.2 Multi-Touch Attribution Models

| Model | Description | Best For |
|---|---|---|
| First Touch | 100% credit to first interaction | Understanding awareness drivers |
| Last Touch | 100% credit to last interaction | Understanding conversion drivers |
| Linear | Equal credit to all touches | Balanced view |
| Time Decay | More credit to recent touches | Recent influence emphasis |
| Position-Based | 40% first, 40% last, 20% middle | Balanced with emphasis on bookends |
| Data-Driven | ML-based credit allocation | Most accurate (requires data volume) |

**VyaparSethu Default:** Start with **Position-Based** (40/20/40), migrate to **Data-Driven** once sufficient conversion data exists (>1000 conversions per entity type).

### 16. Acquisition Funnel Economics

#### 16.1 Full Funnel Stages & Costs

| Stage | Definition | Cumulative Cost Target | Conversion Target |
|---|---|---|---|
| 1. Impression | Ad/content seen | ₹0.50–2.00 per 1000 | — |
| 2. Engagement | Click, like, share | ₹1–5 per engagement | 2–5% of impressions |
| 3. Click | Link clicked | ₹2–10 per click | 20–40% of engagements |
| 4. Landing Page Visit | Page loaded | ₹3–12 per visit | 60–80% of clicks |
| 5. Registration | Account created | ₹10–30 per registration | 5–15% of visits |
| 6. Verified User | Email/phone verified | ₹12–35 per verified | 60–80% of registrations |
| 7. First Action | Browse/RFQ/listing | ₹15–40 per active user | 30–50% of verified |
| 8. Qualified Action | Quality threshold met | ₹20–60 per qualified | 20–40% of active |
| 9. Repeat Action | 3+ actions in 30 days | ₹25–80 per repeat | 15–30% of qualified |
| 10. Conversion Event | RFQ/quote/transaction | ₹30–100 per conversion | 10–25% of repeat |
| 11. Paid Customer | Subscription/payment | ₹100–500 per paid | 5–15% of conversion |
| 12. Retained Customer | Active after 90 days | ₹150–600 per retained | 40–60% of paid |

#### 16.2 Funnel Economics Dashboard

```yaml
funnel_snapshot:
  period: "2026-07-15"
  organization_id: "vyaparsethu_global"
  
  impressions: 500000
  impression_cost: ₹25000
  
  engagements: 15000
  engagement_cost: ₹25000
  
  clicks: 5000
  click_cost: ₹25000
  
  landing_visits: 3500
  landing_cost: ₹25000
  
  registrations: 350
  registration_cost: ₹25000
  
  verified: 245
  verification_cost: ₹3500
  
  first_action: 98
  first_action_cost: ₹2500
  
  qualified: 39
  qualified_cost: ₹1500
  
  repeat_actions: 12
  repeat_cost: ₹500
  
  conversions: 4
  conversion_cost: ₹200
  
  paid_customers: 1
  paid_cost: ₹500
  
  total_cost: ₹85700
  total_paid_customers: 1
  
  blended_cac: ₹85700
  
  cost_per_impression: ₹0.05
  cost_per_click: ₹5.00
  cost_per_registration: ₹71.43
  cost_per_verified: ₹102.04
  cost_per_qualified: ₹2197.44
  cost_per_conversion: ₹21425.00
  cost_per_paid: ₹85700.00
```

### 17. LTV & Payback Intelligence

#### 17.1 Lifetime Value Models

| LTV Model | Formula | Time Horizon | Use Case |
|---|---|---|---|
| Historical LTV | Total revenue to date | Retrospective | Actual performance |
| 30-Day Value | Revenue in first 30 days | 30 days | Quick payback assessment |
| 90-Day Value | Revenue in first 90 days | 90 days | Medium-term assessment |
| 180-Day Value | Revenue in first 180 days | 180 days | Subscription viability |
| 365-Day Value | Revenue in first 365 days | 365 days | Annual ROI |
| Predicted LTV | ML model extrapolation | Lifetime | Budget allocation |
| Cohort LTV | Average LTV for acquisition cohort | Varies | Cohort comparison |

#### 17.2 LTV by Entity Type (VyaparSethu Projections)

| Entity Type | 30-Day Value | 90-Day Value | 365-Day Value | Predicted LTV |
|---|---|---|---|---|
| BUYER (free) | ₹0 | ₹0 | ₹0 | ₹500 (ad value) |
| SUPPLIER (free) | ₹0 | ₹0 | ₹0 | ₹2,000 (listing value) |
| VERIFIED_SUPPLIER | ₹0 | ₹0 | ₹0 | ₹6,000 (trust value) |
| PAYING_SUPPLIER (Basic) | ₹999 | ₹2,997 | ₹11,988 | ₹18,000 |
| PAYING_SUPPLIER (Pro) | ₹2,999 | ₹8,997 | ₹35,988 | ₹54,000 |
| PAYING_SUPPLIER (Enterprise) | ₹9,999 | ₹29,997 | ₹1,19,988 | ₹1,80,000 |
| TRANSACTION_CUSTOMER | ₹500 | ₹2,000 | ₹8,000 | ₹12,000 |
| ENTERPRISE_ACCOUNT | ₹25,000 | ₹75,000 | ₹3,00,000 | ₹5,00,000 |

#### 17.3 LTV:CAC Health Indicators

| Ratio | Status | Action |
|---|---|---|
| > 10:1 | 🟢 Excellent | Scale aggressively |
| 5:1 – 10:1 | 🟢 Good | Scale with monitoring |
| 3:1 – 5:1 | 🟡 Acceptable | Optimize before scaling |
| 2:1 – 3:1 | 🟠 Warning | Stop scaling, optimize |
| 1:1 – 2:1 | 🔴 Critical | Pause acquisition, fix funnel |
| < 1:1 | 🔴🔴 Emergency | Stop all acquisition, restructure |

#### 17.4 CAC Payback Period Targets

| Entity Type | Target Payback | Maximum Payback | Action If Exceeded |
|---|---|---|---|
| BUYER | 30 days | 90 days | Optimize nurture sequence |
| SUPPLIER | 60 days | 120 days | Improve onboarding conversion |
| VERIFIED_SUPPLIER | 90 days | 180 days | Speed up verification-to-paid |
| PAYING_SUPPLIER | 120 days | 240 days | Review pricing and value prop |
| TRANSACTION_CUSTOMER | 30 days | 60 days | Optimize transaction frequency |
| ENTERPRISE_ACCOUNT | 180 days | 365 days | Review contract terms |

### 18. CAC Budget Governor

#### 18.1 Budget Hierarchy

```
┌─────────────────────────────────────────────┐
│         PLATFORM BUDGET (Global)             │
│         Monthly: ₹X,XX,XXX                  │
├─────────────────────────────────────────────┤
│         INDUSTRY BUDGETS                     │
│  ├── Steel & Metals:     ₹X,XX,XXX         │
│  ├── Textiles:           ₹X,XX,XXX         │
│  ├── Chemicals:          ₹X,XX,XXX         │
│  ├── Auto Components:    ₹X,XX,XXX         │
│  ├── Electronics:        ₹X,XX,XXX         │
│  └── ... (52 industries)                    │
├─────────────────────────────────────────────┤
│         CHANNEL BUDGETS                      │
│  ├── Google Ads:         ₹X,XX,XXX         │
│  ├── Meta Ads:           ₹X,XX,XXX         │
│  ├── LinkedIn Ads:       ₹X,XX,XXX         │
│  ├── Content (organic):  ₹X,XX,XXX         │
│  └── Outreach (email/whatsapp): ₹X,XX,XXX  │
├─────────────────────────────────────────────┤
│         GEOGRAPHY BUDGETS                    │
│  ├── Maharashtra:        ₹X,XX,XXX         │
│  ├── Gujarat:            ₹X,XX,XXX         │
│  ├── Tamil Nadu:         ₹X,XX,XXX         │
│  └── ... (30 states)                        │
├─────────────────────────────────────────────┤
│         ENTITY TYPE BUDGETS                  │
│  ├── Buyer Acquisition:  ₹X,XX,XXX         │
│  ├── Supplier Acquisition: ₹X,XX,XXX       │
│  ├── RFQ Acquisition:    ₹X,XX,XXX         │
│  └── Subscription Acquisition: ₹X,XX,XXX   │
├─────────────────────────────────────────────┤
│         CAMPAIGN BUDGETS                     │
│  ├── Campaign A:         ₹X,XXX            │
│  ├── Campaign B:         ₹X,XXX            │
│  └── ... (per campaign)                     │
└─────────────────────────────────────────────┘
```

#### 18.2 Budget Types

| Budget Type | Granularity | Reset Period | Override Cap |
|---|---|---|---|
| `DAILY_BUDGET` | Per campaign/entity | Daily | Max 120% of plan |
| `WEEKLY_BUDGET` | Per channel/industry | Weekly | Max 110% of plan |
| `MONTHLY_BUDGET` | Per entity type/geo | Monthly | Max 105% of plan |
| `CAMPAIGN_BUDGET` | Per campaign | Campaign lifetime | Fixed |
| `INDUSTRY_BUDGET` | Per industry | Monthly | Max 110% of plan |
| `CATEGORY_BUDGET` | Per product category | Monthly | Max 110% of plan |
| `CHANNEL_BUDGET` | Per marketing channel | Monthly | Max 110% of plan |
| `KEYWORD_BUDGET` | Per keyword cluster | Monthly | Max 115% of plan |
| `CITY_BUDGET` | Per city | Monthly | Max 110% of plan |
| `PERSONA_BUDGET` | Per buyer/supplier persona | Monthly | Max 110% of plan |
| `EXPERIMENT_BUDGET` | Per A/B test | Experiment duration | Fixed |
| `CAC_TEST_BUDGET` | Per CAC experiment | Experiment duration | Fixed |

### 19. CAC Targets & Thresholds

#### 19.1 Target Configuration Schema

```yaml
cac_targets:
  entity_type: "VERIFIED_SUPPLIER"
  organization_id: "global"
  
  targets:
    target_buyer_cac: ₹200
    target_supplier_cac: ₹400
    target_verified_supplier_cac: ₹600
    target_rfq_cac: ₹150
    target_qualified_rfq_cac: ₹300
    target_paying_customer_cac: ₹2,000
    maximum_cac: ₹5,000
    target_ltv_cac_ratio: 15
    minimum_ltv_cac_ratio: 5
    maximum_payback_period_days: 180
  
  thresholds:
    warning_multiplier: 1.3    # Alert at 130% of target
    critical_multiplier: 1.5   # Pause at 150% of target
    emergency_multiplier: 2.0  # Emergency stop at 200%
    
  scaling_triggers:
    excellent_ltv_cac: 20      # Scale if LTV:CAC > 20
    good_ltv_cac: 10           # Maintain if LTV:CAC > 10
    scale_budget_increase: 0.15 # Increase budget by 15%
    scale_frequency: "weekly"   # Re-evaluate weekly
```

### 20. Autonomous CAC Decisions

#### 20.1 Decision Types

| Decision | Description | Autonomy Level Required | Reversibility |
|---|---|---|---|
| `INCREASE_BUDGET` | Increase budget for entity type | L2 | Instant |
| `DECREASE_BUDGET` | Decrease budget for entity type | L2 | Instant |
| `PAUSE_CAMPAIGN` | Pause a specific campaign | L2 | Easy |
| `STOP_CAMPAIGN` | Permanently stop a campaign | L3 | Hard |
| `SHIFT_CHANNEL` | Move budget from one channel to another | L2 | Easy |
| `SHIFT_KEYWORD` | Reallocate keyword budget | L2 | Easy |
| `SHIFT_CITY` | Reallocate city budget | L2 | Easy |
| `SHIFT_INDUSTRY` | Reallocate industry budget | L3 | Medium |
| `SHIFT_CATEGORY` | Reallocate category budget | L2 | Easy |
| `SHIFT_PERSONA` | Reallocate persona budget | L2 | Easy |
| `CHANGE_CREATIVE` | Swap creative assets | L2 | Easy |
| `CHANGE_CONTENT_FORMAT` | Switch content format | L2 | Easy |
| `CREATE_VARIANTS` | Generate variants of winners | L2 | Easy |
| `INCREASE_RETARGETING` | Boost retargeting spend | L2 | Easy |
| `REDUCE_RETARGETING` | Cut retargeting spend | L2 | Easy |
| `CHANGE_LANDING_PAGE` | A/B test landing page | L3 | Medium |
| `CHANGE_CTA` | Modify call-to-action | L2 | Easy |
| `CHANGE_OFFER` | Modify promotional offer | L3 | Medium |
| `CHANGE_PROVIDER` | Switch AI/ad provider | L2 | Easy |
| `START_EXPERIMENT` | Begin A/B test | L2 | Easy |
| `END_EXPERIMENT` | Conclude A/B test | L2 | Easy |
| `REALLOCATE_CROSS_INDUSTRY` | Move budget between industries | L3 | Medium |

#### 20.2 Decision Execution Flow

```
┌─────────────────────────────────────────────────────────┐
│              CAC DECISION ENGINE                         │
│                                                          │
│  ① DETECT                                               │
│  CAC exceeds target OR opportunity identified            │
│                                                          │
│  ② DIAGNOSE                                             │
│  Why? Channel underperforming? Keyword fatigue?          │
│  Creative exhaustion? Audience saturation?               │
│                                                          │
│  ③ RECOMMEND                                            │
│  Generate decision with reasoning:                       │
│  - What to change                                       │
│  - Expected impact (CAC improvement, volume change)      │
│  - Risk assessment                                       │
│  - Confidence level                                      │
│                                                          │
│  ④ CHECK AUTONOMY LEVEL                                 │
│  L0: Log only → no action                               │
│  L1: Notify human → wait for approval                    │
│  L2: Auto-execute if within ±10% of current              │
│  L3: Auto-execute if within daily budget                  │
│  L4: Full autonomy                                      │
│                                                          │
│  ⑤ CHECK GUARDRAILS                                     │
│  - Daily budget not exceeded?                           │
│  - Campaign budget not exceeded?                        │
│  - Minimum performance threshold met?                   │
│  - No conflicting decisions active?                     │
│                                                          │
│  ⑥ EXECUTE                                              │
│  Apply decision via appropriate API/channel              │
│                                                          │
│  ⑦ LOG                                                  │
│  Record decision, context, expected vs actual impact     │
│                                                          │
│  ⑧ MONITOR                                              │
│  Track impact over 24h/72h/7d windows                    │
│                                                          │
│  ⑨ LEARN                                                │
│  Update decision model with outcome                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 21. Budget Reallocation Intelligence

#### 21.1 Reallocation Detection

The system continuously scans for reallocation opportunities:

```yaml
reallocation_scan:
  frequency: "every_6_hours"
  
  scans:
    - name: "Underperforming keyword → High-performing keyword"
      trigger: "keyword_a CAC > 2× keyword_b CAC AND keyword_b volume_available > 0"
      action: "SHIFT_KEYWORD budget from A to B"
      
    - name: "Low-performing city → High-performing city"
      trigger: "city_a conversion_rate < 0.5× city_b conversion_rate"
      action: "SHIFT_CITY budget from A to B"
      
    - name: "Low-performing category → High-opportunity category"
      trigger: "category_a ROI < 0.3× category_b ROI AND category_b has unmet demand"
      action: "SHIFT_CATEGORY budget from A to B"
      
    - name: "Expensive AI workflow → Efficient workflow"
      trigger: "workflow_a cost_per_output > 2× workflow_b cost_per_output AND quality >= threshold"
      action: "REROUTE jobs to workflow_b"
      
    - name: "Low-quality lead source → High-quality RFQ source"
      trigger: "source_a qualified_rate < 0.2× source_b qualified_rate"
      action: "SHIFT budget from source_a to source_b"
      
    - name: "Exhausted creative → Fresh creative"
      trigger: "creative_a CTR declining > 20% over 7 days"
      action: "PAUSE creative_a, GENERATE_VARIANTS of top performer"
      
    - name: "Platform fatigue → Platform rotation"
      trigger: "platform_a engagement declining AND platform_b has untapped audience"
      action: "SHIFT platform budget allocation"
```

#### 21.2 Reallocation Example

```yaml
example_reallocation:
  date: "2026-07-15"
  
  before:
    google_ads_budget: ₹50000
    google_ads_roas: 4.8
    google_ads_rfqs: 42
    
    meta_ads_budget: ₹30000
    meta_ads_roas: 0.7
    meta_ads_rfqs: 8
    
    linkedin_ads_budget: ₹20000
    linkedin_ads_roas: 2.1
    linkedin_ads_rfqs: 15
    
    total_budget: ₹100000
    total_rfqs: 65
    cost_per_rfq: ₹1538
    
  decision:
    action: "SHIFT"
    reasoning: "Meta Ads ROAS 0.7x is unsustainable. Google Ads has 4.8x ROAS with room to scale. LinkedIn maintains steady qualified RFQs."
    
    changes:
      - channel: "google_ads"
        action: "INCREASE_BUDGET"
        new_budget: ₹57500    # +15%
        expected_rfqs: 48
        
      - channel: "meta_ads"
        action: "REDUCE_BUDGET"
        new_budget: ₹15000    # -50%
        expected_rfqs: 5
        note: "Retain top 20% performing creatives only"
        
      - channel: "linkedin_ads"
        action: "MAINTAIN"
        new_budget: ₹20000
        expected_rfqs: 15
      
  after_7_days:
    google_ads_rfqs: 46         # +9.5%
    meta_ads_rfqs: 6            # expected decline
    linkedin_ads_rfqs: 14       # stable
    
    total_rfqs: 66              # +1.5%
    total_cost: ₹92500          # -7.5%
    cost_per_rfq: ₹1402         # -8.8% improvement
    
  verdict: "SUCCESS — cost per RFQ reduced 8.8% while maintaining volume"
```

---

## Part IV — Advertising Budget Governor

### 22. Multi-Channel Advertising Intelligence

#### 22.1 Channel Intelligence Matrix

| Channel | Best For | Avg CPC | Avg CPM | Avg CVR | Avg ROAS | Min Budget |
|---|---|---|---|---|---|---|
| Google Search | High-intent RFQ capture | ₹8–25 | ₹100–300 | 3–8% | 3–6x | ₹500/day |
| Google Display | Brand awareness, retargeting | ₹2–8 | ₹50–150 | 0.5–2% | 1–3x | ₹300/day |
| Google PMax | Full-funnel automation | ₹5–15 | ₹80–200 | 2–5% | 3–8x | ₹1000/day |
| Meta Feed | Visual product showcase | ₹3–12 | ₹40–120 | 1–3% | 1.5–4x | ₹300/day |
| Meta Reels | Short video engagement | ₹2–8 | ₹30–100 | 0.5–2% | 1–2x | ₹200/day |
| Meta Stories | Immersive brand experience | ₹3–10 | ₹35–110 | 0.8–2.5% | 1–3x | ₹200/day |
| LinkedIn Sponsored | B2B decision-maker reach | ₹15–50 | ₹200–600 | 1–4% | 2–5x | ₹1000/day |
| LinkedIn Messages | Direct decision-maker outreach | ₹20–60 | ₹300–800 | 2–6% | 3–8x | ₹2000/day |
| LinkedIn Job | Supplier recruitment | ₹10–30 | ₹150–400 | 1–3% | N/A | ₹500/day |
| YouTube Pre-roll | Video awareness | ₹1–5 | ₹50–150 | 0.3–1% | 0.5–2x | ₹500/day |
| WhatsApp Ads | Direct engagement | ₹0.50–2 | ₹20–60 | 5–15% | 2–6x | ₹200/day |

#### 22.2 Channel Budget Allocation Model

```yaml
allocation_model:
  strategy: "performance_weighted"
  
  inputs:
    - historical_roas_per_channel
    - current_conversion_rates
    - remaining_budget
    - campaign_objective
    - industry_benchmarks
    
  algorithm:
    step_1: "Calculate efficiency_score for each channel"
      formula: "efficiency = (roas × conversion_rate) / cpc"
      
    step_2: "Normalize scores to allocation percentages"
      formula: "allocation% = channel_efficiency / total_efficiency × 100"
      
    step_3: "Apply constraints"
      - "No channel < 5% allocation (diversification)"
      - "No channel > 60% allocation (concentration risk)"
      - "Respect minimum budgets per channel"
      
    step_4: "Calculate absolute budget per channel"
      formula: "channel_budget = total_budget × allocation%"
      
    step_5: "Set daily pacing"
      formula: "daily_budget = channel_budget / days_remaining"
```

### 23. Campaign Profitability Analysis

#### 23.1 Profitability Framework

```
CAMPAIGN PROFITABILITY = 
    Campaign Revenue
  - Ad Spend
  - Content Generation Cost
  - AI Processing Cost
  - Creative Production Cost
  - Landing Page Cost
  - Tool/Infrastructure Allocation
  - Human Oversight Cost (if any)
  ─────────────────────────────
  = CAMPAIGN NET PROFIT
  
  PROFIT MARGIN = Campaign Net Profit / Campaign Revenue × 100
  ROI = Campaign Net Profit / Total Campaign Cost × 100
```

#### 23.2 Campaign Tier Classification

| Tier | ROAS | RFQ Quality | Volume | Action |
|---|---|---|---|---|
| 🌟 Star | > 6x | High | High | Scale aggressively |
| 🟢 Winner | 3–6x | Medium-High | Medium | Scale with monitoring |
| 🟡 Steady | 1.5–3x | Medium | Medium | Maintain, optimize |
| 🟠 Underperformer | 1–1.5x | Low-Medium | Low | Optimize or reduce |
| 🔴 Loser | < 1x | Low | Low | Pause and diagnose |
| ⚫ Bleeder | < 0.5x | Very Low | Any | Stop immediately |

#### 23.3 Campaign Lifecycle Economics

| Phase | Duration | Expected ROAS | Budget Allocation | Focus |
|---|---|---|---|---|
| Learning | Days 1–7 | 0.5–1.5x | 20% of total | Data collection |
| Optimization | Days 8–21 | 1.5–3x | 30% of total | A/B testing |
| Scaling | Days 22–60 | 3–6x | 40% of total | Volume expansion |
| Maturity | Days 61–90 | 2–4x | 8% of total | Maintenance |
| Decline | Day 90+ | < 2x | 2% of total | Refresh or retire |

### 24. ROAS Intelligence

#### 24.1 ROAS Calculation Methods

| Method | Formula | Use Case |
|---|---|---|
| Simple ROAS | Revenue / Ad Spend | Quick assessment |
| Fully Loaded ROAS | Revenue / (Ad Spend + Content + AI + Ops) | True profitability |
| Marginal ROAS | Δ Revenue / Δ Ad Spend | Should we increase budget? |
| Forecasted ROAS | Predicted Revenue / Planned Spend | Budget planning |
| Cohort ROAS | Cohort Revenue / Cohort Ad Spend | Long-term value |

#### 24.2 ROAS Benchmarks by Industry (India B2B)

| Industry | Google Search | Meta | LinkedIn | Blended |
|---|---|---|---|---|
| Steel & Metals | 5–8x | 2–3x | 3–5x | 4–6x |
| Textiles | 4–7x | 3–5x | 2–4x | 3–5x |
| Chemicals | 6–10x | 1–2x | 4–7x | 4–7x |
| Auto Components | 5–8x | 2–4x | 3–5x | 4–6x |
| Electronics | 3–5x | 3–5x | 2–3x | 3–5x |
| Machinery | 6–9x | 1–3x | 4–6x | 4–7x |
| Pharmaceuticals | 4–7x | 2–3x | 3–5x | 3–5x |
| Agriculture | 3–6x | 4–6x | 1–2x | 3–5x |

### 25. Ad Spend Autonomy Levels

#### 25.1 Level Definitions

```
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 0 — OBSERVE                                           │
│                                                             │
│ What: Monitor all ad spend. No actions taken.               │
│ Agent: Logs metrics, generates reports.                     │
│ Human: Reviews reports manually.                            │
│ Budget control: None (manual only).                         │
│ Risk: None.                                                 │
│                                                             │
│ Use case: Initial deployment, trust building.               │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 1 — RECOMMEND                                         │
│                                                             │
│ What: Agent recommends actions. Human approves all.         │
│ Agent: Generates recommendations with reasoning.            │
│ Human: Reviews and approves/rejects each recommendation.    │
│ Budget control: None (human executes).                      │
│ Risk: Low — human decides everything.                       │
│                                                             │
│ Use case: Early stage, building confidence in agent.        │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 2 — CONTROLLED OPTIMIZATION (DEFAULT)                 │
│                                                             │
│ What: Agent auto-optimizes within ±10% of current spend.    │
│ Agent: Makes changes within guardrails. Escalates outside.  │
│ Human: Reviews daily summary. Approves escalations.         │
│ Budget control: ±10% of current allocation.                 │
│ Risk: Medium — bounded changes only.                        │
│                                                             │
│ Use case: Standard operating mode.                          │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 3 — BUDGET AUTONOMY                                   │
│                                                             │
│ What: Agent manages within daily budget ceiling.            │
│ Agent: Full freedom within daily budget cap.                │
│ Human: Reviews weekly. Sets monthly budgets.                │
│ Budget control: Up to daily budget limit.                   │
│ Risk: Medium-High — larger changes possible.                │
│                                                             │
│ Use case: Proven agent with good track record.              │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 4 — ECONOMIC AUTONOMY                                 │
│                                                             │
│ What: Agent has full economic decision-making power.        │
│ Agent: Makes all decisions. Only policy violations escalate.│
│ Human: Sets quarterly strategy and policy.                  │
│ Budget control: Up to campaign/monthly budget limits.       │
│ Risk: High — requires high trust and proven results.        │
│                                                             │
│ Use case: Mature system with proven ROI over 6+ months.     │
└─────────────────────────────────────────────────────────────┘
```

#### 25.2 Level Transition Criteria

| Transition | Required Evidence | Minimum Duration | Review |
|---|---|---|---|
| L0 → L1 | Agent deployed, data collecting | 2 weeks | Manual |
| L1 → L2 | 80%+ recommendations approved by human | 30 days | Manual |
| L2 → L3 | Auto-optimized decisions match human approval 90%+ | 90 days | Committee |
| L3 → L4 | Consistent ROI improvement > 20% over baseline for 180 days | 180 days | Board/Owner |

### 26. Cross-Channel Budget Arbitrage

#### 26.1 Arbitrage Detection

```yaml
arbitrage_rules:
  - name: "CPA Arbitrage"
    detection: "channel_a CPA < 0.6 × channel_b CPA for same quality leads"
    action: "Shift 20% of channel_b budget to channel_a"
    guard: "Minimum 50 conversions per channel for statistical significance"
    
  - name: "ROAS Arbitrage"
    detection: "channel_a ROAS > 2 × channel_b ROAS"
    action: "Increase channel_a budget by 15%, decrease channel_b by 15%"
    guard: "Both channels have > ₹10,000 spend in evaluation period"
    
  - name: "Volume Arbitrage"
    detection: "channel_a has unexploited volume at current CPA"
    action: "Increase channel_a budget until CPA reaches target ceiling"
    guard: "CPA increase < 20% while volume increase > 50%"
    
  - name: "Quality Arbitrage"
    detection: "channel_a lead quality score > 1.5 × channel_b"
    action: "Shift budget toward channel_a even if CPA slightly higher"
    guard: "LTV:CAC improvement > 20%"
```

### 27. Advertising Decision Engine

#### 27.1 Decision Matrix

| Scenario | Detection | Decision | Confidence Required |
|---|---|---|---|
| Campaign ROAS > target + 50% | Daily review | `SCALE_BUDGET 15%` | > 80% |
| Campaign ROAS < target - 30% | Daily review | `REDUCE_BUDGET 20%` | > 70% |
| Campaign ROAS < 1x for 7 days | Weekly review | `PAUSE_CAMPAIGN` | > 90% |
| Creative fatigue (CTR declining > 20% in 7d) | Daily review | `REFRESH_CREATIVE` | > 85% |
| Keyword CPA > 2x average | Daily review | `REDUCE_KEYWORD_BID 15%` | > 75% |
| New keyword opportunity detected | Weekly scan | `START_EXPERIMENT` | > 70% |
| Budget underspend > 20% at mid-month | Mid-month review | `EXPAND_TARGETING` | > 65% |
| Budget on track to overspend | Daily check | `THROTTLE_SPEND` | > 80% |
| Competitor activity spike detected | Real-time | `HOLD_BUDGET` (don't increase) | > 60% |
| Seasonal demand spike detected | Forecast | `PRE_POSITION_BUDGET` | > 75% |

---

## Part V — Growth Capital Allocation Governor

### 28. Capital Allocation Intelligence

#### 28.1 Investment Area Registry

| Area | Description | Expected ROI Range | Risk Level |
|---|---|---|---|
| `CONTENT_ENGINE` | AI content generation, creative production | 3–8x | Low |
| `ADVERTISING` | Google, Meta, LinkedIn, future channels | 2–6x | Medium |
| `AI_INFRASTRUCTURE` | LLM providers, image/video gen, compute | Indirect | Low |
| `PLATFORM_DEVELOPMENT` | Product features, UX improvements | Indirect | Medium |
| `SALES_OUTREACH` | Email, WhatsApp, phone outreach | 4–10x | Medium |
| `SEO_INVESTMENT` | Keyword research, content optimization | 5–15x | Low |
| `BRAND_BUILDING` | PR, thought leadership, community | Indirect | High |
| `PARTNERSHIP` | Channel partners, industry associations | 3–10x | Medium |
| `TALENT` | Team hiring and training | Indirect | Medium |
| `DATA_INTELLIGENCE` | Scraping, enrichment, analytics | Indirect | Low |
| `PROMOTIONAL` | Discounts, credits, incentives | 1–3x | High |
| `RND` | Experimental features, new markets | 0–20x | Very High |

#### 28.2 Capital Allocation Framework

```
┌──────────────────────────────────────────────────────────┐
│              MONTHLY CAPITAL: ₹XX,XX,XXX                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  40%  ──→  ACQUISITION (Direct customer acquisition)     │
│            ├── Google Ads        15%                     │
│            ├── Meta Ads           8%                     │
│            ├── LinkedIn Ads       5%                     │
│            ├── Content + SEO      7%                     │
│            └── Outreach           5%                     │
│                                                          │
│  25%  ──→  INFRASTRUCTURE (Compute, AI, Storage)         │
│            ├── AI Providers      12%                     │
│            ├── Cloud/Supabase     8%                     │
│            └── Tools + APIs       5%                     │
│                                                          │
│  20%  ──→  CONTENT ENGINE (2,000 assets/day)             │
│            ├── AI Generation     10%                     │
│            ├── Creative Design    5%                     │
│            └── Video/Audio        5%                     │
│                                                          │
│  10%  ──→  GROWTH (Partnerships, Brand, R&D)             │
│            ├── Partnerships       4%                     │
│            ├── Brand Building     3%                     │
│            └── R&D / Experiments   3%                    │
│                                                          │
│   5%  ──→  RESERVE (Emergency buffer, opportunities)     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 29. Investment ROI Framework

#### 29.1 ROI Measurement by Investment Type

| Investment | Direct ROI | Indirect ROI | Measurement Window |
|---|---|---|---|
| Google Ads | Revenue from conversions | Brand awareness lift | 7–30 days |
| Content Generation | Traffic + leads from content | SEO authority building | 30–180 days |
| AI Infrastructure | Cost savings from automation | Capability expansion | 90–365 days |
| SEO | Organic traffic value | Domain authority growth | 90–365 days |
| Brand Building | Direct traffic increase | Trust and recall | 180–730 days |
| Partnerships | Partner-driven revenue | Network effects | 90–365 days |
| R&D | New feature revenue | Competitive advantage | 180–730 days |

#### 29.2 Investment Scoring Model

```
INVESTMENT SCORE = 
    (0.30 × Expected Financial ROI)
  + (0.25 × Strategic Importance Score 1-10)
  + (0.20 × Time to Return Score 1-10, inverted)
  + (0.15 × Scalability Score 1-10)
  + (0.10 × Risk-Adjusted Score 1-10)

Maximum score: 10.0
Minimum threshold for funding: 5.0
```

### 30. Marginal Value Analysis

#### 30.1 The Core Question

**For every additional ₹1 spent, what is the marginal business value generated?**

```
┌─────────────────────────────────────────────────────────┐
│         MARGINAL VALUE CURVE                             │
│                                                          │
│  Value                                                   │
│  per ₹1                                                 │
│     ▲                                                   │
│  8x │    ●                                              │
│     │     ●                                             │
│  6x │      ●                                            │
│     │        ●                                          │
│  4x │          ●                                        │
│     │            ●                                      │
│  2x │              ●  ●                                 │
│     │                   ●  ●                            │
│  1x │────────────────────────●──●──●── TARGET ──→       │
│     │                                 ●                 │
│  0x │─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─     │
│     │                                     STOP LINE     │
│ -1x │                                       ●          │
│     └──────────────────────────────────────────────→    │
│      ₹10K  ₹25K  ₹50K  ₹75K  ₹1L  ₹1.5L  ₹2L       │
│                    Budget Spent                         │
│                                                          │
│  SCALING ZONE:  ₹10K – ₹75K (marginal value > 3x)      │
│  OPTIMIZE ZONE: ₹75K – ₹1.5L (marginal value 1–3x)     │
│  SATURATION:    > ₹1.5L (marginal value < 1x)           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 30.2 Marginal Analysis Rules

| Scenario | Marginal Value | Decision |
|---|---|---|
| Marginal value > 5x | Very high return | SCALE aggressively |
| Marginal value 3–5x | High return | SCALE with monitoring |
| Marginal value 1–3x | Acceptable return | MAINTAIN current level |
| Marginal value 0.5–1x | Below threshold | REDUCE spend |
| Marginal value < 0.5x | Negative return | PAUSE and diagnose |
| Marginal value < 0 | Losing money | STOP immediately |

### 31. Portfolio Optimization

#### 31.1 Investment Portfolio Principles

1. **Diversification** — No single investment area gets > 50% of capital
2. **Balance** — Mix of short-term (ads) and long-term (SEO, brand) returns
3. **Risk Budgeting** — High-risk investments capped at 10% of total
4. **Reserve** — 5% held in reserve for opportunities and emergencies
5. **Rebalancing** — Monthly review and rebalance based on performance

#### 31.2 Portfolio Rebalancing Triggers

| Trigger | Action |
|---|---|
| Any area exceeds 2x allocation target | Rebalance — move excess to under-allocated areas |
| Any area delivers < 50% of expected ROI for 60 days | Reduce allocation, investigate |
| New high-ROI opportunity discovered | Fund from reserve or reduce lowest-ROI area |
| Market conditions change (seasonal, competitive) | Adjust allocation per new forecasts |
| Budget cut required | Reduce from lowest-ROI areas first |

### 32. Growth Stage Models

#### 32.1 Stage-Specific Optimization

| Stage | Focus | CAC Priority | Budget Allocation | Risk Tolerance |
|---|---|---|---|---|
| **Pre-Revenue** (Month 0–3) | User acquisition, product-market fit | Volume over quality | 60% acquisition, 20% product, 20% infra | High |
| **Early Growth** (Month 3–9) | Revenue activation, unit economics | Balance CAC:LTV | 45% acquisition, 25% content, 30% infra | Medium |
| **Growth** (Month 9–18) | Scale profitable channels | Strict CAC targets | 40% acquisition, 30% content, 20% infra, 10% growth | Low-Medium |
| **Scale** (Month 18–36) | Market expansion, dominance | CAC per market | 35% acquisition, 30% content, 20% infra, 15% growth | Low |
| **Maturity** (36+ months) | Retention, efficiency, new verticals | LTV:CAC optimization | 25% acquisition, 25% content, 25% infra, 25% growth | Low |

---

## Part VI — Economic Metrics Encyclopedia

### 33. Cost Metrics

| Metric ID | Metric Name | Formula | Unit | Target | Alert |
|---|---|---|---|---|---|
| `CM-001` | Total Daily Cost | SUM(cost_events WHERE date = today) | ₹/day | Per budget | >120% daily budget |
| `CM-002` | Cost Per Asset Generated | total_cost / assets_generated | ₹/asset | <₹8 | >₹15 |
| `CM-003` | Cost Per Published Post | gen_cost / published_posts | ₹/post | <₹20 | >₹40 |
| `CM-004` | Cost Per Video Second | video_cost / video_seconds | ₹/sec | <₹35 | >₹60 |
| `CM-005` | Cost Per Image | image_cost / images_generated | ₹/image | <₹8 | >₹15 |
| `CM-006` | Cost Per Voice Second | voice_cost / voice_seconds | ₹/sec | <₹0.25 | >₹0.50 |
| `CM-007` | Cost Per Avatar Second | avatar_cost / avatar_seconds | ₹/sec | <₹3 | >₹5 |
| `CM-008` | AI Token Cost Per Post | ai_token_cost / posts_generated | ₹/post | <₹2 | >₹5 |
| `CM-009` | Infrastructure Cost Per Org | infra_cost / organizations | ₹/org/day | <₹5 | >₹10 |
| `CM-010` | Storage Cost Per GB | storage_cost / total_gb | ₹/GB/month | <₹5 | >₹10 |
| `CM-011` | Bandwidth Cost Per GB | bandwidth_cost / total_gb | ₹/GB | <₹8 | >₹15 |
| `CM-012` | Total Monthly Infrastructure | SUM(infra_costs) per month | ₹/month | Per budget | >110% monthly budget |
| `CM-013` | AI Provider Cost Trend | ai_cost_7d_avg vs ai_cost_30d_avg | ratio | <1.1 | >1.3 |
| `CM-014` | Cost Variance | (actual_cost - budgeted_cost) / budgeted_cost | % | ±10% | >±25% |
| `CM-015` | Cost Efficiency Score | output_value / total_cost | score 0-100 | >70 | <40 |

### 34. Revenue Metrics

| Metric ID | Metric Name | Formula | Unit | Target | Alert |
|---|---|---|---|---|---|
| `RM-001` | Total Daily Revenue | SUM(revenue_events WHERE date = today) | ₹/day | Per target | <80% daily target |
| `RM-002` | Revenue Per Asset | total_revenue / assets_generated | ₹/asset | >₹15 | <₹5 |
| `RM-003` | Revenue Per Category | category_revenue / active_categories | ₹/cat/day | >₹500 | <₹100 |
| `RM-004` | Revenue Per Industry | industry_revenue / active_industries | ₹/ind/day | >₹2,000 | <₹500 |
| `RM-005` | Revenue Per Keyword | keyword_revenue / active_keywords | ₹/kw/day | >₹10 | <₹1 |
| `RM-006` | Revenue Per Subscriber | subscription_mrr / active_subscribers | ₹/sub/month | >₹1,500 | <₹500 |
| `RM-007` | Revenue Per Transaction | transaction_revenue / transactions | ₹/txn | >₹5,000 | <₹1,000 |
| `RM-008` | MRR Growth Rate | (mrr_this_month - mrr_last_month) / mrr_last_month | % | >10% | <0% |
| `RM-009` | ARR Projection | mrr × 12 | ₹/year | Per target | Below plan |
| `RM-010` | Revenue Per RFQ | revenue from RFQs / total RFQs | ₹/RFQ | >₹2,000 | <₹500 |

### 35. Acquisition Metrics

| Metric ID | Metric Name | Formula | Unit | Target | Alert |
|---|---|---|---|---|---|
| `AM-001` | Buyer CAC | buyer_acquisition_cost / buyers_acquired | ₹/buyer | <₹50 | >₹150 |
| `AM-002` | Supplier CAC | supplier_acquisition_cost / suppliers_acquired | ₹/supplier | <₹200 | >₹500 |
| `AM-003` | Verified Supplier CAC | vs_acquisition_cost / vs_acquired | ₹/VS | <₹400 | >₹800 |
| `AM-004` | RFQ Creator CAC | rfq_acquisition_cost / rfq_creators | ₹/creator | <₹100 | >₹300 |
| `AM-005` | Qualified RFQ CAC | qrfq_cost / qrfq_creators | ₹/QRFQ | <₹200 | >₹500 |
| `AM-006` | Paying Customer CAC | paid_acquisition_cost / paid_customers | ₹/paid | <₹2,000 | >₹5,000 |
| `AM-007` | Blended CAC | total_acquisition_cost / total_acquisitions | ₹/acq | <₹150 | >₹400 |
| `AM-008` | LTV:CAC Ratio | predicted_ltv / cac | ratio | >10:1 | <3:1 |
| `AM-009` | CAC Payback Period | cac / monthly_revenue_per_customer | days | <120 | >240 |
| `AM-010` | Acquisition Conversion Rate | acquisitions / total_visitors | % | >5% | <1% |
| `AM-011` | Funnel Conversion Rate | stage_n+1 / stage_n | % | Per stage target | <50% of target |
| `AM-012` | Cost Per Impression | ad_spend / impressions | ₹/CPM | <₹100 | >₹300 |
| `AM-013` | Cost Per Click | ad_spend / clicks | ₹/CPC | <₹10 | >₹25 |
| `AM-014` | Cost Per Lead | total_cost / leads_generated | ₹/lead | <₹200 | >₹500 |
| `AM-015` | Cost Per RFQ | total_cost / rfqs_generated | ₹/RFQ | <₹250 | >₹600 |
| `AM-016` | Marginal CAC | Δ_cost / Δ_acquisitions | ₹/acq | <target CAC | >1.5× target |
| `AM-017` | Incremental CAC | cost_of_next_batch / batch_size | ₹/acq | <target CAC | >2× target |

### 36. Advertising Metrics

| Metric ID | Metric Name | Formula | Unit | Target | Alert |
|---|---|---|---|---|---|
| `AD-001` | ROAS | revenue / ad_spend | ratio | >4x | <1.5x |
| `AD-002` | Fully Loaded ROAS | revenue / (ad_spend + content + ai + ops) | ratio | >3x | <1x |
| `AD-003` | Marginal ROAS | Δ_revenue / Δ_ad_spend | ratio | >2x | <1x |
| `AD-004` | Campaign Net Profit | revenue - all_campaign_costs | ₹ | >₹0 | <₹0 for 7d |
| `AD-005` | Campaign ROI | net_profit / total_cost × 100 | % | >50% | <0% |
| `AD-006` | Ad Spend as % of Revenue | ad_spend / revenue × 100 | % | <25% | >40% |
| `AD-007` | CTR | clicks / impressions × 100 | % | >2% | <0.5% |
| `AD-008` | CVR | conversions / clicks × 100 | % | >3% | <0.5% |
| `AD-009` | CPA | ad_spend / conversions | ₹ | <₹500 | >₹2,000 |
| `AD-010` | Frequency | impressions / reach | ratio | <3 | >7 |
| `AD-011` | Quality Score (Google) | 1-10 | score | >7 | <4 |
| `AD-012` | Ad Fatigue Index | CTR decline / days_active | %/day | <3% | >10% |
| `AD-013` | Channel Efficiency Score | (roas × cvr) / cpc | score | >1.0 | <0.3 |
| `AD-014` | Cross-Channel CPA Variance | max CPA / min CPA | ratio | <3 | >5 |

### 37. Content Economics Metrics

| Metric ID | Metric Name | Formula | Unit | Target | Alert |
|---|---|---|---|---|---|
| `CE-001` | Content Cost Per Lead | content_gen_cost / leads_from_content | ₹/lead | <₹50 | >₹200 |
| `CE-002` | Content ROI | (revenue_from_content - content_cost) / content_cost × 100 | % | >200% | <0% |
| `CE-003` | Cost Per Thousand Impressions (Content) | content_cost / (impressions/1000) | ₹/CPM | <₹30 | >₹100 |
| `CE-004` | Content Engagement Value | engagement_count × avg_engagement_value | ₹ | >₹0 | Declining |
| `CE-005` | SEO Content Value | organic_traffic × avg_value_per_visit | ₹/month | >₹50,000 | <₹10,000 |
| `CE-006` | Winning Asset Rate | winning_assets / total_assets × 100 | % | >5% | <1% |
| `CE-007` | Asset Utilization Rate | published_assets / generated_assets × 100 | % | >30% | <10% |
| `CE-008` | Content Velocity | assets_generated_per_day | assets/day | 2,000 | <1,000 |
| `CE-009` | Content Quality Score | avg_quality_score across assets | score 0-100 | >75 | <50 |
| `CE-010` | Cost Per Category Content | content_cost / active_categories | ₹/cat | <₹500 | >₹2,000 |

### 38. AI Economics Metrics

| Metric ID | Metric Name | Formula | Unit | Target | Alert |
|---|---|---|---|---|---|
| `AI-001` | AI Cost Per Job | ai_cost / jobs_completed | ₹/job | <₹10 | >₹25 |
| `AI-002` | AI Cost Per Token | total_ai_cost / total_tokens | ₹/1K tokens | <₹0.50 | >₹2 |
| `AI-003` | AI Cost Efficiency Score | output_quality / ai_cost | score 0-100 | >70 | <30 |
| `AI-004` | Provider Cost Comparison | provider_a_cost / provider_b_cost for same task | ratio | Varies | >2× |
| `AI-005` | Model Routing Savings | savings_from_routing / baseline_cost | % | >30% | <10% |
| `AI-006` | Cache Hit Rate | cached_responses / total_requests × 100 | % | >40% | <10% |
| `AI-007` | Prompt Efficiency | output_tokens / input_tokens | ratio | >2:1 | <1:1 |
| `AI-008` | AI Cost Trend | 7d_avg vs 30d_avg | ratio | 0.9–1.1 | >1.3 or <0.7 |
| `AI-009` | Failed Request Cost | cost_of_failed / total_ai_cost | % | <2% | >5% |
| `AI-010` | Cost Per Quality Unit | ai_cost / total_quality_units | ₹/quality unit | <₹0.10 | >₹0.50 |

---

## Part VII — Database Architecture

### 39. Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCHEMA: economic                              │
│                                                                  │
│  CORE TABLES (8)          │  ACQUISITION TABLES (16)            │
│  ├── cost_accounts        │  ├── acquisition_events              │
│  ├── cost_providers       │  ├── acquisition_sources             │
│  ├── cost_events          │  ├── acquisition_channels            │
│  ├── cost_allocations     │  ├── acquisition_touchpoints         │
│  ├── cost_budgets         │  ├── acquisition_funnels             │
│  ├── cost_budget_rules    │  ├── acquisition_funnel_stages       │
│  ├── cost_forecasts       │  ├── acquisition_conversions         │
│  └── cost_anomalies       │  ├── acquisition_cohorts             │
│                           │  ├── acquisition_costs               │
│  ECONOMIC TABLES (10)     │  ├── acquisition_cost_allocations    │
│  ├── economic_decisions   │  ├── acquisition_metrics             │
│  ├── economic_decision_logs│  ├── cac_snapshots                  │
│  ├── economic_policies    │  ├── cac_targets                     │
│  ├── economic_snapshots   │  ├── cac_budgets                     │
│  ├── economic_alerts      │  ├── cac_budget_rules                │
│  ├── economic_approvals   │  ├── cac_forecasts                   │
│  ├── autonomy_levels      │  └── cac_anomalies                   │
│  ├── provider_cost_rates  │                                     │
│  ├── model_cost_rates     │  LTV TABLES (8)                     │
│  └── infra_cost_rates     │  ├── customer_lifetime_values         │
│                           │  ├── ltv_predictions                  │
│  ADVERTISING TABLES (12)  │  ├── ltv_cac_snapshots               │
│  ├── advertising_costs    │  ├── payback_snapshots                │
│  ├── advertising_budgets  │  ├── attribution_models               │
│  ├── advertising_decisions│  ├── attribution_results              │
│  ├── campaign_economics   │  ├── budget_reallocations             │
│  ├── asset_economics      │  └── budget_reallocation_logs         │
│  ├── job_economics        │                                     │
│  ├── workflow_economics   │  TOTAL: 62 TABLES                    │
│  ├── category_economics   │                                     │
│  ├── keyword_economics    │                                     │
│  ├── channel_economics    │                                     │
│  ├── geo_economics        │                                     │
│  └── persona_economics    │                                     │
│                           │                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 40. Core Economic Tables

```sql
-- ============================================================
-- TABLE: cost_accounts
-- Purpose: Chart of accounts for all cost categories
-- ============================================================
CREATE TABLE cost_accounts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    account_code          VARCHAR(20) NOT NULL,        -- e.g. 'INFRA_COMPUTE', 'AI_LLM'
    account_name          VARCHAR(200) NOT NULL,
    account_type          VARCHAR(50) NOT NULL,         -- INFRA, AI, ADS, OPS, CONTENT
    parent_account_id     UUID REFERENCES cost_accounts(id),
    
    cost_unit             VARCHAR(50),                  -- 'per_hour', 'per_token', 'per_image'
    currency              VARCHAR(3) DEFAULT 'INR',
    is_active             BOOLEAN DEFAULT true,
    is_capitalized        BOOLEAN DEFAULT false,
    
    -- Metadata
    description           TEXT,
    metadata              JSONB DEFAULT '{}',
    
    -- Audit
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ,
    created_by            UUID,
    version               INT DEFAULT 1,
    
    CONSTRAINT uq_cost_account_code_org UNIQUE (account_code, organization_id)
);

CREATE INDEX idx_cost_accounts_org ON cost_accounts(organization_id);
CREATE INDEX idx_cost_accounts_type ON cost_accounts(account_type);

-- ============================================================
-- TABLE: cost_providers
-- Purpose: External cost providers (AI, cloud, ads, etc.)
-- ============================================================
CREATE TABLE cost_providers (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    provider_code         VARCHAR(50) NOT NULL,        -- 'OPENAI', 'ELEVENLABS', 'GOOGLE_ADS'
    provider_name         VARCHAR(200) NOT NULL,
    provider_type         VARCHAR(50) NOT NULL,         -- AI_LLM, AI_IMAGE, AI_VIDEO, AI_VOICE, ADS, CLOUD, EMAIL, SMS
    
    api_base_url          VARCHAR(500),
    billing_model         VARCHAR(50),                  -- 'per_token', 'per_image', 'per_click', 'flat_rate'
    currency              VARCHAR(3) DEFAULT 'INR',
    
    is_active             BOOLEAN DEFAULT true,
    priority_rank         INT DEFAULT 0,               -- higher = preferred
    
    metadata              JSONB DEFAULT '{}',
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ,
    version               INT DEFAULT 1,
    
    CONSTRAINT uq_cost_provider_code_org UNIQUE (provider_code, organization_id)
);

CREATE INDEX idx_cost_providers_org ON cost_providers(organization_id);
CREATE INDEX idx_cost_providers_type ON cost_providers(provider_type);

-- ============================================================
-- TABLE: cost_events
-- Purpose: Every cost-generating operation records an event here
-- ============================================================
CREATE TABLE cost_events (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    -- What generated the cost
    cost_account_id       UUID NOT NULL REFERENCES cost_accounts(id),
    cost_provider_id      UUID REFERENCES cost_providers(id),
    operation_type        VARCHAR(100) NOT NULL,        -- 'LLM_COMPLETION', 'IMAGE_GEN', 'AD_CLICK'
    operation_id          UUID NOT NULL,                -- Reference to the source operation
    
    -- Attribution (multi-dimensional)
    campaign_id           UUID,
    industry_id           UUID,
    category_id           UUID,
    subcategory_id        UUID,
    product_id            UUID,
    ai_provider_id        UUID,
    ai_model_id           UUID,
    ai_task_type          VARCHAR(50),                  -- 'content_gen', 'analysis', 'translation'
    channel_id            UUID,
    platform_id           UUID,
    country_id            UUID,
    state_id              UUID,
    city_id               UUID,
    keyword_id            UUID,
    keyword_cluster_id    UUID,
    buyer_persona_id      UUID,
    supplier_persona_id   UUID,
    job_id                UUID,
    workflow_id           UUID,
    workflow_step         INT,
    asset_id              UUID,
    asset_type            VARCHAR(50),                  -- 'image', 'video', 'text', 'audio'
    landing_page_id       UUID,
    referral_source_id    UUID,
    acquisition_cohort_id UUID,
    
    -- Cost amounts
    cost_amount           DECIMAL(12,4) NOT NULL,       -- actual cost in source currency
    cost_currency         VARCHAR(3) NOT NULL,
    cost_usd_equivalent   DECIMAL(12,4) NOT NULL,       -- normalized to USD for analytics
    
    -- Measurement
    duration_ms           INT,
    tokens_consumed       INT,
    input_tokens          INT,
    output_tokens         INT,
    records_processed     INT,
    units_consumed        DECIMAL(12,4),                -- generic unit counter
    
    -- Context
    execution_context     VARCHAR(30) DEFAULT 'autonomous', -- autonomous, scheduled, triggered, manual
    autonomy_level_used   VARCHAR(20),                  -- L0_OBSERVE through L4_ECONOMIC_AUTONOMY
    
    -- Quality impact
    output_quality_score  DECIMAL(3,2),                 -- 0.00 to 1.00
    output_used           BOOLEAN DEFAULT false,        -- was the output actually used?
    
    -- Timestamps
    started_at            TIMESTAMPTZ NOT NULL,
    completed_at          TIMESTAMPTZ NOT NULL,
    recorded_at           TIMESTAMPTZ DEFAULT NOW(),
    
    -- Audit
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ,
    version               INT DEFAULT 1
);

-- Time-series optimized indexes
CREATE INDEX idx_cost_events_org_date ON cost_events(organization_id, recorded_at DESC);
CREATE INDEX idx_cost_events_account ON cost_events(cost_account_id, recorded_at DESC);
CREATE INDEX idx_cost_events_provider ON cost_events(cost_provider_id, recorded_at DESC);
CREATE INDEX idx_cost_events_campaign ON cost_events(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_cost_events_industry ON cost_events(industry_id) WHERE industry_id IS NOT NULL;
CREATE INDEX idx_cost_events_job ON cost_events(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX idx_cost_events_workflow ON cost_events(workflow_id) WHERE workflow_id IS NOT NULL;
CREATE INDEX idx_cost_events_operation ON cost_events(operation_type, recorded_at DESC);

-- ============================================================
-- TABLE: cost_allocations
-- Purpose: How cost events are allocated across entities
-- ============================================================
CREATE TABLE cost_allocations (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    cost_event_id         UUID NOT NULL REFERENCES cost_events(id),
    
    allocation_entity_type VARCHAR(50) NOT NULL,        -- 'campaign', 'industry', 'category', 'job'
    allocation_entity_id  UUID NOT NULL,
    
    allocation_method     VARCHAR(30) NOT NULL,         -- 'direct', 'proportional', 'equal', 'weighted'
    allocation_percentage DECIMAL(5,2),                 -- 0.00 to 100.00
    allocated_amount      DECIMAL(12,4) NOT NULL,
    allocated_currency    VARCHAR(3) NOT NULL,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_cost_alloc_event ON cost_allocations(cost_event_id);
CREATE INDEX idx_cost_alloc_entity ON cost_allocations(allocation_entity_type, allocation_entity_id);

-- ============================================================
-- TABLE: cost_budgets
-- Purpose: Budget definitions at all levels
-- ============================================================
CREATE TABLE cost_budgets (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    budget_name           VARCHAR(200) NOT NULL,
    budget_type           VARCHAR(50) NOT NULL,         -- DAILY, WEEKLY, MONTHLY, CAMPAIGN, etc.
    budget_scope          VARCHAR(50) NOT NULL,         -- GLOBAL, INDUSTRY, CHANNEL, CITY, PERSONA, etc.
    scope_entity_id       UUID,                         -- FK to the scoped entity
    
    budget_amount         DECIMAL(12,2) NOT NULL,
    budget_currency       VARCHAR(3) DEFAULT 'INR',
    spent_amount          DECIMAL(12,2) DEFAULT 0,
    remaining_amount      DECIMAL(12,2) GENERATED ALWAYS AS (budget_amount - spent_amount) STORED,
    
    utilization_pct       DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN budget_amount > 0 THEN (spent_amount / budget_amount * 100) ELSE 0 END
    ) STORED,
    
    period_start          TIMESTAMPTZ NOT NULL,
    period_end            TIMESTAMPTZ NOT NULL,
    
    alert_threshold_pct   DECIMAL(5,2) DEFAULT 80,      -- alert at 80% spent
    hard_stop_pct         DECIMAL(5,2) DEFAULT 100,     -- hard stop at 100%
    override_cap_pct      DECIMAL(5,2) DEFAULT 120,     -- max override allowed
    
    is_active             BOOLEAN DEFAULT true,
    auto_renew            BOOLEAN DEFAULT true,
    
    metadata              JSONB DEFAULT '{}',
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ,
    version               INT DEFAULT 1
);

CREATE INDEX idx_cost_budgets_org ON cost_budgets(organization_id);
CREATE INDEX idx_cost_budgets_type_scope ON cost_budgets(budget_type, budget_scope);
CREATE INDEX idx_cost_budgets_period ON cost_budgets(period_start, period_end);
CREATE INDEX idx_cost_budgets_active ON cost_budgets(is_active) WHERE is_active = true;

-- ============================================================
-- TABLE: cost_budget_rules
-- Purpose: Rules governing budget behavior
-- ============================================================
CREATE TABLE cost_budget_rules (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    budget_id             UUID NOT NULL REFERENCES cost_budgets(id),
    
    rule_name             VARCHAR(200) NOT NULL,
    rule_type             VARCHAR(50) NOT NULL,         -- 'alert', 'throttle', 'stop', 'reroute', 'escalate'
    
    trigger_condition     JSONB NOT NULL,               -- e.g. {"utilization_pct": {"$gt": 80}}
    action_type           VARCHAR(50) NOT NULL,         -- 'notify', 'throttle', 'pause', 'escalate'
    action_config         JSONB NOT NULL,               -- action-specific parameters
    
    priority              INT DEFAULT 0,
    is_active             BOOLEAN DEFAULT true,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_budget_rules_budget ON cost_budget_rules(budget_id);

-- ============================================================
-- TABLE: cost_forecasts
-- Purpose: Cost predictions and forecasts
-- ============================================================
CREATE TABLE cost_forecasts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    forecast_type         VARCHAR(50) NOT NULL,         -- DAILY, WEEKLY, MONTHLY, QUARTERLY
    forecast_entity_type  VARCHAR(50),                  -- null = global, or 'industry', 'channel', etc.
    forecast_entity_id    UUID,
    
    forecast_date         DATE NOT NULL,                -- the date being forecasted
    forecast_horizon_days INT NOT NULL,                 -- how far ahead
    
    predicted_cost        DECIMAL(12,2) NOT NULL,
    predicted_revenue     DECIMAL(12,2),
    predicted_roas        DECIMAL(8,4),
    confidence_interval   DECIMAL(5,2),                 -- ±%
    confidence_level      DECIMAL(3,2) DEFAULT 0.95,    -- 95% CI
    
    model_version         VARCHAR(50),
    model_features        JSONB,                        -- features used in prediction
    
    actual_cost           DECIMAL(12,2),                -- filled in after period ends
    prediction_error      DECIMAL(8,4),                 -- (actual - predicted) / actual
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cost_forecasts_org_date ON cost_forecasts(organization_id, forecast_date);
CREATE INDEX idx_cost_forecasts_type ON cost_forecasts(forecast_type, forecast_date);

-- ============================================================
-- TABLE: cost_anomalies
-- Purpose: Detected cost anomalies requiring investigation
-- ============================================================
CREATE TABLE cost_anomalies (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    anomaly_type          VARCHAR(50) NOT NULL,         -- SPIKE, DRIFT, DUPLICATE, ZERO_VALUE, OVERSPEND
    severity              VARCHAR(20) NOT NULL,         -- INFO, WARNING, CRITICAL, EMERGENCY
    status                VARCHAR(30) DEFAULT 'DETECTED', -- DETECTED, INVESTIGATING, RESOLVED, DISMISSED
    
    affected_entity_type  VARCHAR(50),                  -- 'cost_account', 'provider', 'campaign', etc.
    affected_entity_id    UUID,
    
    cost_account_id       UUID REFERENCES cost_accounts(id),
    cost_provider_id      UUID REFERENCES cost_providers(id),
    
    expected_value        DECIMAL(12,4),
    actual_value          DECIMAL(12,4),
    deviation_pct         DECIMAL(8,4),
    deviation_sigma       DECIMAL(6,2),                 -- standard deviations from mean
    
    description           TEXT NOT NULL,
    root_cause            TEXT,
    resolution            TEXT,
    
    detected_at           TIMESTAMPTZ DEFAULT NOW(),
    investigated_at       TIMESTAMPTZ,
    resolved_at           TIMESTAMPTZ,
    
    auto_action_taken     VARCHAR(50),                  -- 'pause_operation', 'switch_provider', 'notify_admin'
    human_action_required BOOLEAN DEFAULT false,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cost_anomalies_org ON cost_anomalies(organization_id, detected_at DESC);
CREATE INDEX idx_cost_anomalies_severity ON cost_anomalies(severity, status);
CREATE INDEX idx_cost_anomalies_unresolved ON cost_anomalies(status) WHERE status IN ('DETECTED', 'INVESTIGATING');
```

### 41. Cost Management Tables

```sql
-- ============================================================
-- TABLE: provider_cost_rates
-- Purpose: Current cost rates per provider
-- ============================================================
CREATE TABLE provider_cost_rates (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    cost_provider_id      UUID NOT NULL REFERENCES cost_providers(id),
    
    rate_name             VARCHAR(200) NOT NULL,
    rate_type             VARCHAR(50) NOT NULL,         -- 'per_token', 'per_image', 'per_second', 'per_click'
    
    base_rate             DECIMAL(12,6) NOT NULL,       -- rate in source currency
    currency              VARCHAR(3) NOT NULL,
    
    tier_name             VARCHAR(100),                 -- 'gpt-4o', 'dall-e-3', 'elevenlabs-turbo'
    min_quantity          INT,
    max_quantity          INT,
    volume_discount_pct   DECIMAL(5,2) DEFAULT 0,
    
    effective_from        TIMESTAMPTZ NOT NULL,
    effective_to          TIMESTAMPTZ,
    is_current            BOOLEAN DEFAULT true,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_provider_rates_provider ON provider_cost_rates(cost_provider_id);
CREATE INDEX idx_provider_rates_current ON provider_cost_rates(is_current) WHERE is_current = true;

-- ============================================================
-- TABLE: model_cost_rates
-- Purpose: AI model-specific cost rates
-- ============================================================
CREATE TABLE model_cost_rates (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    cost_provider_id      UUID NOT NULL REFERENCES cost_providers(id),
    
    model_name            VARCHAR(200) NOT NULL,        -- 'gpt-4o', 'claude-sonnet-4-5', 'dall-e-3'
    model_type            VARCHAR(50) NOT NULL,         -- LLM, IMAGE, VIDEO, VOICE, AVATAR
    
    input_token_rate      DECIMAL(12,6),                -- cost per 1K input tokens
    output_token_rate     DECIMAL(12,6),                -- cost per 1K output tokens
    image_rate            DECIMAL(12,4),                -- cost per image
    second_rate           DECIMAL(12,4),                -- cost per second (video/voice)
    char_rate             DECIMAL(12,6),                -- cost per character (voice)
    fixed_rate            DECIMAL(12,4),                -- fixed cost per invocation
    
    quality_score         DECIMAL(3,2),                 -- 0.00 to 1.00
    speed_score           DECIMAL(3,2),                 -- 0.00 to 1.00
    cost_efficiency_score DECIMAL(3,2),                 -- quality / cost
    
    max_tokens            INT,
    context_window        INT,
    supports_vision       BOOLEAN DEFAULT false,
    supports_function_call BOOLEAN DEFAULT false,
    
    is_active             BOOLEAN DEFAULT true,
    is_default            BOOLEAN DEFAULT false,        -- default model for its type
    
    effective_from        TIMESTAMPTZ NOT NULL,
    effective_to          TIMESTAMPTZ,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_model_rates_provider ON model_cost_rates(cost_provider_id);
CREATE INDEX idx_model_rates_type ON model_cost_rates(model_type);
CREATE INDEX idx_model_rates_active ON model_cost_rates(is_active) WHERE is_active = true;

-- ============================================================
-- TABLE: infra_cost_rates
-- Purpose: Infrastructure cost rates
-- ============================================================
CREATE TABLE infra_cost_rates (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    service_name          VARCHAR(200) NOT NULL,        -- 'AWS_EC2', 'SUPABASE', 'CLOUDFLARE_R2'
    service_type          VARCHAR(50) NOT NULL,         -- COMPUTE, DATABASE, STORAGE, BANDWIDTH
    
    rate_name             VARCHAR(200) NOT NULL,
    rate_type             VARCHAR(50) NOT NULL,         -- 'per_hour', 'per_gb', 'per_request', 'per_gb_month'
    
    base_rate             DECIMAL(12,6) NOT NULL,
    currency              VARCHAR(3) NOT NULL,
    
    tier_name             VARCHAR(100),
    min_quantity          INT,
    max_quantity          INT,
    
    is_current            BOOLEAN DEFAULT true,
    effective_from        TIMESTAMPTZ NOT NULL,
    effective_to          TIMESTAMPTZ,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_infra_rates_type ON infra_cost_rates(service_type);

-- ============================================================
-- TABLE: economic_decisions
-- Purpose: All economic decisions made by agents
-- ============================================================
CREATE TABLE economic_decisions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    decision_type         VARCHAR(100) NOT NULL,        -- 'SCALE_BUDGET', 'PAUSE_CAMPAIGN', 'CHANGE_PROVIDER', etc.
    decision_category     VARCHAR(50) NOT NULL,         -- FINOPS, ACQUISITION, ADVERTISING, GROWTH
    
    autonomy_level        VARCHAR(30) NOT NULL,         -- L0_OBSERVE through L4_ECONOMIC_AUTONOMY
    status                VARCHAR(30) DEFAULT 'PENDING', -- PENDING, APPROVED, EXECUTING, EXECUTED, FAILED, REVERTED
    
    agent_id              VARCHAR(100) NOT NULL,        -- which agent made the decision
    confidence_score      DECIMAL(3,2),                 -- 0.00 to 1.00
    
    -- What was affected
    target_entity_type    VARCHAR(50) NOT NULL,         -- 'campaign', 'channel', 'provider', 'budget'
    target_entity_id      UUID NOT NULL,
    
    -- Decision details
    decision_action       VARCHAR(100) NOT NULL,        -- the specific action to take
    decision_parameters   JSONB NOT NULL,               -- action-specific parameters
    
    -- Impact prediction
    predicted_impact      JSONB,                        -- {"cac_change": -15, "volume_change": 10}
    predicted_cost_change DECIMAL(12,2),
    predicted_revenue_change DECIMAL(12,2),
    predicted_roas_change DECIMAL(8,4),
    
    -- Actual impact (filled after execution + monitoring)
    actual_impact         JSONB,
    actual_cost_change    DECIMAL(12,2),
    actual_revenue_change DECIMAL(12,2),
    actual_roas_change    DECIMAL(8,4),
    impact_accuracy_pct   DECIMAL(5,2),                 -- how accurate was the prediction?
    
    -- Context
    reasoning             TEXT NOT NULL,
    evidence              JSONB,                        -- supporting data points
    conflicting_decisions UUID[],                       -- IDs of conflicting decisions if any
    
    -- Timing
    decided_at            TIMESTAMPTZ DEFAULT NOW(),
    approved_at           TIMESTAMPTZ,
    executed_at           TIMESTAMPTZ,
    completed_at          TIMESTAMPTZ,
    reverted_at           TIMESTAMPTZ,
    
    -- Audit
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ,
    version               INT DEFAULT 1
);

CREATE INDEX idx_econ_decisions_org ON economic_decisions(organization_id, decided_at DESC);
CREATE INDEX idx_econ_decisions_type ON economic_decisions(decision_type, status);
CREATE INDEX idx_econ_decisions_category ON economic_decisions(decision_category, decided_at DESC);
CREATE INDEX idx_econ_decisions_status ON economic_decisions(status) WHERE status IN ('PENDING', 'APPROVED', 'EXECUTING');
CREATE INDEX idx_econ_decisions_target ON economic_decisions(target_entity_type, target_entity_id);

-- ============================================================
-- TABLE: economic_decision_logs
-- Purpose: Audit trail for every decision change
-- ============================================================
CREATE TABLE economic_decision_logs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    decision_id           UUID NOT NULL REFERENCES economic_decisions(id),
    
    action                VARCHAR(50) NOT NULL,         -- 'created', 'approved', 'executed', 'failed', 'reverted'
    previous_status       VARCHAR(30),
    new_status            VARCHAR(30) NOT NULL,
    
    changed_by            VARCHAR(100) NOT NULL,        -- agent_id or user_id
    change_reason         TEXT,
    change_data           JSONB,                        -- full diff of what changed
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_decision_logs_decision ON economic_decision_logs(decision_id);
CREATE INDEX idx_decision_logs_time ON economic_decision_logs(created_at DESC);

-- ============================================================
-- TABLE: economic_policies
-- Purpose: Policies that govern economic autonomy
-- ============================================================
CREATE TABLE economic_policies (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    policy_name           VARCHAR(200) NOT NULL,
    policy_type           VARCHAR(50) NOT NULL,         -- BUDGET, AUTONOMY, GUARDRAIL, APPROVAL
    policy_scope          VARCHAR(50) NOT NULL,         -- GLOBAL, INDUSTRY, CHANNEL, CAMPAIGN
    
    rules                 JSONB NOT NULL,               -- full policy ruleset
    -- Example rules:
    -- {
    --   "max_daily_spend": 50000,
    --   "max_monthly_spend": 1500000,
    --   "max_autonomy_level": "L2_CONTROLLED_OPTIMIZATION",
    --   "approval_required_above": 10000,
    --   "blocked_providers": ["cheap_provider_xyz"],
    --   "min_quality_score": 0.7,
    --   "required_ROI_threshold": 2.0
    -- }
    
    is_active             BOOLEAN DEFAULT true,
    priority              INT DEFAULT 0,               -- higher = evaluated first
    
    effective_from        TIMESTAMPTZ NOT NULL,
    effective_to          TIMESTAMPTZ,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ,
    version               INT DEFAULT 1
);

CREATE INDEX idx_econ_policies_org ON economic_policies(organization_id);
CREATE INDEX idx_econ_policies_type ON economic_policies(policy_type, is_active);

-- ============================================================
-- TABLE: autonomy_levels
-- Purpose: Configurable autonomy levels per operation type
-- ============================================================
CREATE TABLE autonomy_levels (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    operation_category    VARCHAR(100) NOT NULL,        -- 'AD_SPEND', 'AI_ROUTING', 'CONTENT_GEN', 'BUDGET_ALLOC'
    operation_subcategory VARCHAR(100),                 -- 'google_ads', 'openai_llm', etc.
    
    current_level         VARCHAR(30) NOT NULL,         -- L0_OBSERVE through L4_ECONOMIC_AUTONOMY
    max_allowed_level     VARCHAR(30) NOT NULL,         -- ceiling
    
    -- Level-specific parameters
    l0_observe_enabled    BOOLEAN DEFAULT true,
    l1_recommend_enabled  BOOLEAN DEFAULT true,
    l2_auto_limit_pct     DECIMAL(5,2) DEFAULT 10,     -- ±10% for L2
    l3_daily_budget_limit DECIMAL(12,2),               -- daily budget cap for L3
    l4_full_autonomy      BOOLEAN DEFAULT false,        -- true only for L4
    
    -- Transition tracking
    previous_level        VARCHAR(30),
    level_changed_at      TIMESTAMPTZ,
    level_changed_by      VARCHAR(100),
    level_change_reason   TEXT,
    
    is_active             BOOLEAN DEFAULT true,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_autonomy_org ON autonomy_levels(organization_id);
CREATE INDEX idx_autonomy_category ON autonomy_levels(operation_category);

-- ============================================================
-- TABLE: economic_snapshots
-- Purpose: Periodic snapshots of economic health
-- ============================================================
CREATE TABLE economic_snapshots (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    snapshot_type         VARCHAR(30) NOT NULL,         -- HOURLY, DAILY, WEEKLY, MONTHLY
    snapshot_date         TIMESTAMPTZ NOT NULL,
    
    -- Cost summary
    total_cost            DECIMAL(12,2) NOT NULL,
    infra_cost            DECIMAL(12,2),
    ai_cost               DECIMAL(12,2),
    ads_cost              DECIMAL(12,2),
    content_cost          DECIMAL(12,2),
    ops_cost              DECIMAL(12,2),
    
    -- Revenue summary
    total_revenue         DECIMAL(12,2),
    subscription_revenue  DECIMAL(12,2),
    transaction_revenue   DECIMAL(12,2),
    advertising_revenue   DECIMAL(12,2),
    
    -- Key metrics
    blended_cac           DECIMAL(12,2),
    avg_roas              DECIMAL(8,4),
    avg_roi               DECIMAL(8,4),
    ltv_cac_ratio         DECIMAL(8,4),
    
    -- Content metrics
    assets_generated      INT,
    assets_published      INT,
    winning_assets        INT,
    cost_per_asset        DECIMAL(8,4),
    
    -- Acquisition metrics
    buyers_acquired       INT,
    suppliers_acquired    INT,
    rfqs_generated        INT,
    paid_customers        INT,
    
    -- AI metrics
    ai_jobs_completed     INT,
    ai_cost_per_job       DECIMAL(8,4),
    cache_hit_rate        DECIMAL(5,2),
    
    -- Budget health
    total_budget          DECIMAL(12,2),
    total_spent           DECIMAL(12,2),
    budget_utilization    DECIMAL(5,2),
    
    -- Anomaly count
    anomalies_detected    INT DEFAULT 0,
    anomalies_resolved    INT DEFAULT 0,
    
    -- Full state
    snapshot_data         JSONB,                        -- complete snapshot for deep analysis
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_econ_snapshots_org_date ON economic_snapshots(organization_id, snapshot_date DESC);
CREATE INDEX idx_econ_snapshots_type ON economic_snapshots(snapshot_type, snapshot_date DESC);

-- ============================================================
-- TABLE: economic_alerts
-- Purpose: Active alerts requiring attention
-- ============================================================
CREATE TABLE economic_alerts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    alert_type            VARCHAR(50) NOT NULL,         -- BUDGET_OVERSPEND, CAC_SPIKE, ROAS_DROP, etc.
    severity              VARCHAR(20) NOT NULL,         -- INFO, WARNING, CRITICAL, EMERGENCY
    status                VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, ACKNOWLEDGED, RESOLVED, DISMISSED
    
    title                 VARCHAR(200) NOT NULL,
    message               TEXT NOT NULL,
    affected_entity_type  VARCHAR(50),
    affected_entity_id    UUID,
    
    current_value         DECIMAL(12,4),
    threshold_value       DECIMAL(12,4),
    
    suggested_actions     JSONB,                        -- agent-suggested remediation steps
    
    triggered_at          TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at       TIMESTAMPTZ,
    acknowledged_by       VARCHAR(100),
    resolved_at           TIMESTAMPTZ,
    resolved_by           VARCHAR(100),
    resolution_notes      TEXT,
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_econ_alerts_org ON economic_alerts(organization_id, triggered_at DESC);
CREATE INDEX idx_econ_alerts_active ON economic_alerts(status, severity) WHERE status = 'ACTIVE';

-- ============================================================
-- TABLE: economic_approvals
-- Purpose: Decisions requiring human approval
-- ============================================================
CREATE TABLE economic_approvals (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    decision_id           UUID NOT NULL REFERENCES economic_decisions(id),
    
    approval_type         VARCHAR(50) NOT NULL,         -- BUDGET_INCREASE, AUTONOMY_ESCALATION, etc.
    urgency               VARCHAR(20) DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, URGENT
    
    requested_by          VARCHAR(100) NOT NULL,        -- agent_id
    requested_for         VARCHAR(100),                 -- user_id who should approve
    
    decision_summary      TEXT NOT NULL,
    decision_details      JSONB NOT NULL,
    impact_analysis       JSONB,
    
    status                VARCHAR(30) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, EXPIRED
    
    reviewed_by           VARCHAR(100),
    review_notes          TEXT,
    reviewed_at           TIMESTAMPTZ,
    expires_at            TIMESTAMPTZ,                  -- auto-expire if not reviewed
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_econ_approvals_pending ON economic_approvals(status, urgency) WHERE status = 'PENDING';
CREATE INDEX idx_econ_approvals_org ON economic_approvals(organization_id, created_at DESC);
```

### 42. Acquisition Intelligence Tables

```sql
-- ============================================================
-- TABLE: acquisition_events
-- Purpose: Every acquisition touchpoint event
-- ============================================================
CREATE TABLE acquisition_events (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    event_type            VARCHAR(50) NOT NULL,         -- IMPRESSION, CLICK, REGISTRATION, CONVERSION
    entity_type           VARCHAR(50) NOT NULL,         -- BUYER, SUPPLIER, VERIFIED_SUPPLIER, etc.
    
    -- Source tracking
    source_id             UUID,                         -- acquisition_sources.id
    channel_id            UUID,
    platform_id           UUID,
    campaign_id           UUID,
    
    -- User tracking
    user_id               UUID,
    session_id            UUID,
    anonymous_id          VARCHAR(200),                 -- cookie/fingerprint ID
    
    -- Attribution
    first_touch_channel   VARCHAR(50),
    last_touch_channel    VARCHAR(50),
    touch_sequence        JSONB,                        -- ordered list of touches
    attribution_model     VARCHAR(50) DEFAULT 'position_based',
    attribution_weight    DECIMAL(5,4),                 -- weight assigned to this touch
    
    -- Cost
    event_cost            DECIMAL(12,4) DEFAULT 0,
    cost_currency         VARCHAR(3) DEFAULT 'INR',
    
    -- Geography
    country_id            UUID,
    state_id              UUID,
    city_id               UUID,
    
    -- Device / context
    device_type           VARCHAR(20),                  -- desktop, mobile, tablet
    browser               VARCHAR(50),
    referrer_url          VARCHAR(500),
    landing_url           VARCHAR(500),
    
    -- Timestamps
    event_at              TIMESTAMPTZ NOT NULL,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_acq_events_org ON acquisition_events(organization_id, event_at DESC);
CREATE INDEX idx_acq_events_entity ON acquisition_events(entity_type, event_at DESC);
CREATE INDEX idx_acq_events_user ON acquisition_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_acq_events_campaign ON acquisition_events(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_acq_events_channel ON acquisition_events(channel_id) WHERE channel_id IS NOT NULL;

-- ============================================================
-- TABLE: cac_snapshots
-- Purpose: Periodic CAC snapshots per entity type
-- ============================================================
CREATE TABLE cac_snapshots (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    snapshot_date         DATE NOT NULL,
    entity_type           VARCHAR(50) NOT NULL,         -- BUYER, SUPPLIER, etc.
    
    -- CAC values
    direct_cac            DECIMAL(12,2),
    paid_cac              DECIMAL(12,2),
    organic_cac           DECIMAL(12,2),
    blended_cac           DECIMAL(12,2),
    fully_loaded_cac      DECIMAL(12,2),
    marginal_cac          DECIMAL(12,2),
    incremental_cac       DECIMAL(12,2),
    
    -- Targets
    target_cac            DECIMAL(12,2),
    maximum_cac           DECIMAL(12,2),
    cac_vs_target_pct     DECIMAL(8,4),                 -- (actual - target) / target
    
    -- Volume
    total_acquisitions    INT,
    paid_acquisitions     INT,
    organic_acquisitions  INT,
    
    -- Spend
    total_spend           DECIMAL(12,2),
    paid_spend            DECIMAL(12,2),
    content_spend         DECIMAL(12,2),
    ai_spend              DECIMAL(12,2),
    
    -- LTV
    avg_ltv               DECIMAL(12,2),
    ltv_cac_ratio         DECIMAL(8,4),
    payback_period_days   INT,
    
    -- Trend
    cac_trend_7d          DECIMAL(8,4),                 -- % change over 7 days
    cac_trend_30d         DECIMAL(8,4),                 -- % change over 30 days
    
    -- By geography
    geo_breakdown         JSONB,                        -- state-level CAC breakdown
    channel_breakdown     JSONB,                        -- channel-level CAC breakdown
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cac_snapshots_org_date ON cac_snapshots(organization_id, snapshot_date DESC);
CREATE INDEX idx_cac_snapshots_entity ON cac_snapshots(entity_type, snapshot_date DESC);

-- ============================================================
-- TABLE: cac_targets
-- Purpose: CAC targets and thresholds per entity type
-- ============================================================
CREATE TABLE cac_targets (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    entity_type           VARCHAR(50) NOT NULL,
    scope                 VARCHAR(50) DEFAULT 'GLOBAL', -- GLOBAL, INDUSTRY, CITY, CHANNEL
    scope_entity_id       UUID,
    
    target_cac            DECIMAL(12,2) NOT NULL,
    maximum_cac           DECIMAL(12,2) NOT NULL,
    
    target_ltv_cac_ratio  DECIMAL(8,4) DEFAULT 10,
    minimum_ltv_cac_ratio DECIMAL(8,4) DEFAULT 3,
    max_payback_days      INT DEFAULT 180,
    
    warning_multiplier    DECIMAL(5,2) DEFAULT 1.3,
    critical_multiplier   DECIMAL(5,2) DEFAULT 1.5,
    emergency_multiplier  DECIMAL(5,2) DEFAULT 2.0,
    
    is_active             BOOLEAN DEFAULT true,
    effective_from        DATE NOT NULL,
    effective_to          DATE,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_cac_targets_org ON cac_targets(organization_id);
CREATE INDEX idx_cac_targets_entity ON cac_targets(entity_type, scope);

-- ============================================================
-- TABLE: cac_budgets
-- Purpose: CAC-specific budgets
-- ============================================================
CREATE TABLE cac_budgets (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    entity_type           VARCHAR(50) NOT NULL,
    budget_scope          VARCHAR(50) NOT NULL,         -- GLOBAL, INDUSTRY, CHANNEL, CITY, PERSONA
    scope_entity_id       UUID,
    
    budget_type           VARCHAR(30) NOT NULL,         -- DAILY, WEEKLY, MONTHLY
    budget_amount         DECIMAL(12,2) NOT NULL,
    spent_amount          DECIMAL(12,2) DEFAULT 0,
    
    period_start          TIMESTAMPTZ NOT NULL,
    period_end            TIMESTAMPTZ NOT NULL,
    
    auto_reallocate       BOOLEAN DEFAULT true,
    reallocation_rules    JSONB,
    
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_cac_budgets_org ON cac_budgets(organization_id);
CREATE INDEX idx_cac_budgets_entity ON cac_budgets(entity_type, budget_scope);
CREATE INDEX idx_cac_budgets_period ON cac_budgets(period_start, period_end);

-- ============================================================
-- TABLE: customer_lifetime_values
-- Purpose: Calculated LTV per customer / cohort
-- ============================================================
CREATE TABLE customer_lifetime_values (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    user_id               UUID NOT NULL,
    entity_type           VARCHAR(50) NOT NULL,
    
    -- LTV values
    historical_ltv        DECIMAL(12,2),
    ltv_30day             DECIMAL(12,2),
    ltv_90day             DECIMAL(12,2),
    ltv_180day            DECIMAL(12,2),
    ltv_365day            DECIMAL(12,2),
    predicted_ltv         DECIMAL(12,2),
    
    -- Revenue components
    subscription_revenue  DECIMAL(12,2) DEFAULT 0,
    transaction_revenue   DECIMAL(12,2) DEFAULT 0,
    advertising_value     DECIMAL(12,2) DEFAULT 0,
    data_value            DECIMAL(12,2) DEFAULT 0,
    
    -- Cost at acquisition
    acquisition_cost      DECIMAL(12,2),
    ltv_cac_ratio         DECIMAL(8,4),
    payback_period_days   INT,
    
    -- Activity metrics
    days_since_acquisition INT,
    last_active_at        TIMESTAMPTZ,
    activity_score        DECIMAL(3,2),                 -- 0.00 to 1.00
    churn_risk_score      DECIMAL(3,2),                 -- 0.00 to 1.00
    
    -- Prediction model
    prediction_model      VARCHAR(50),
    prediction_confidence DECIMAL(3,2),
    prediction_date       TIMESTAMPTZ,
    
    -- Acquisition context
    acquisition_cohort_id UUID,
    acquisition_channel   VARCHAR(50),
    acquisition_date      DATE,
    
    calculated_at         TIMESTAMPTZ DEFAULT NOW(),
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ltv_user ON customer_lifetime_values(user_id);
CREATE INDEX idx_ltv_org_entity ON customer_lifetime_values(organization_id, entity_type);
CREATE INDEX idx_ltv_predicted ON customer_lifetime_values(predicted_ltv DESC);

-- ============================================================
-- TABLE: attribution_models
-- Purpose: Attribution model configurations
-- ============================================================
CREATE TABLE attribution_models (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    model_name            VARCHAR(200) NOT NULL,
    model_type            VARCHAR(50) NOT NULL,         -- FIRST_TOUCH, LAST_TOUCH, LINEAR, POSITION_BASED, DATA_DRIVEN
    
    weights_config        JSONB NOT NULL,               -- model-specific weight configuration
    -- Position-Based example: {"first": 0.4, "middle": 0.2, "last": 0.4}
    -- Time-Decay example: {"half_life_days": 7}
    
    is_default            BOOLEAN DEFAULT false,
    is_active             BOOLEAN DEFAULT true,
    
    min_conversions_required INT DEFAULT 1000,           -- minimum data for data-driven
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);

-- ============================================================
-- TABLE: attribution_results
-- Purpose: Calculated attribution for each conversion
-- ============================================================
CREATE TABLE attribution_results (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    attribution_model_id  UUID NOT NULL REFERENCES attribution_models(id),
    
    conversion_event_id   UUID NOT NULL,
    conversion_entity_type VARCHAR(50) NOT NULL,
    
    -- Touch points with attributed credit
    touchpoints           JSONB NOT NULL,
    -- [
    --   {"channel": "google_ads", "campaign_id": "...", "touch_at": "...", "credit": 0.4},
    --   {"channel": "content", "asset_id": "...", "touch_at": "...", "credit": 0.2},
    --   {"channel": "linkedin", "campaign_id": "...", "touch_at": "...", "credit": 0.4}
    -- ]
    
    first_touch_channel   VARCHAR(50),
    last_touch_channel    VARCHAR(50),
    assisting_channels    TEXT[],
    
    -- Cost allocation
    total_attributed_cost DECIMAL(12,4),
    cost_by_channel       JSONB,
    cost_by_campaign      JSONB,
    
    calculated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attribution_org ON attribution_results(organization_id, calculated_at DESC);
CREATE INDEX idx_attribution_model ON attribution_results(attribution_model_id);

-- ============================================================
-- TABLE: budget_reallocations
-- Purpose: Budget reallocation decisions and outcomes
-- ============================================================
CREATE TABLE budget_reallocations (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    reallocation_type     VARCHAR(50) NOT NULL,         -- CHANNEL, INDUSTRY, CITY, KEYWORD, PERSONA
    source_entity_type    VARCHAR(50) NOT NULL,
    source_entity_id      UUID NOT NULL,
    target_entity_type    VARCHAR(50) NOT NULL,
    target_entity_id      UUID NOT NULL,
    
    amount_reallocated    DECIMAL(12,2) NOT NULL,
    percentage_change     DECIMAL(5,2),
    
    reason                TEXT NOT NULL,
    trigger_metric        VARCHAR(100),
    trigger_value         DECIMAL(12,4),
    trigger_threshold     DECIMAL(12,4),
    
    expected_impact       JSONB,
    actual_impact         JSONB,
    impact_assessment     VARCHAR(50),                  -- SUCCESS, PARTIAL, FAILURE
    
    decision_id           UUID REFERENCES economic_decisions(id),
    status                VARCHAR(30) DEFAULT 'EXECUTED',
    
    executed_at           TIMESTAMPTZ DEFAULT NOW(),
    assessed_at           TIMESTAMPTZ,
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reallocations_org ON budget_reallocations(organization_id, executed_at DESC);
```

### 43. Advertising Economics Tables

```sql
-- ============================================================
-- TABLE: campaign_economics
-- Purpose: Aggregated economics per campaign
-- ============================================================
CREATE TABLE campaign_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    campaign_id           UUID NOT NULL,
    
    period_date           DATE NOT NULL,
    
    -- Spend
    total_spend           DECIMAL(12,2) NOT NULL,
    ad_spend              DECIMAL(12,2),
    content_cost          DECIMAL(12,2),
    ai_cost               DECIMAL(12,2),
    creative_cost         DECIMAL(12,2),
    total_fully_loaded_cost DECIMAL(12,2),
    
    -- Performance
    impressions           INT,
    clicks                INT,
    ctr                   DECIMAL(5,4),
    conversions           INT,
    cvr                   DECIMAL(5,4),
    
    -- Revenue
    revenue               DECIMAL(12,2),
    roas                  DECIMAL(8,4),
    fully_loaded_roas     DECIMAL(8,4),
    marginal_roas         DECIMAL(8,4),
    net_profit            DECIMAL(12,2),
    roi_pct               DECIMAL(8,4),
    
    -- RFQ metrics
    rfqs_generated        INT,
    qualified_rfqs        INT,
    cost_per_rfq          DECIMAL(12,2),
    cost_per_qualified_rfq DECIMAL(12,2),
    
    -- Tier classification
    campaign_tier         VARCHAR(20),                  -- STAR, WINNER, STEADY, UNDERPERFORMER, LOSER, BLEEDER
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_econ_org_date ON campaign_economics(organization_id, period_date DESC);
CREATE INDEX idx_campaign_econ_campaign ON campaign_economics(campaign_id, period_date DESC);

-- ============================================================
-- TABLE: channel_economics
-- Purpose: Aggregated economics per marketing channel
-- ============================================================
CREATE TABLE channel_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    channel_id            UUID NOT NULL,
    
    period_date           DATE NOT NULL,
    
    total_spend           DECIMAL(12,2) NOT NULL,
    impressions           INT,
    clicks                INT,
    conversions           INT,
    revenue               DECIMAL(12,2),
    
    cpc                   DECIMAL(8,4),
    cpm                   DECIMAL(8,4),
    cpa                   DECIMAL(8,4),
    roas                  DECIMAL(8,4),
    cvr                   DECIMAL(5,4),
    
    efficiency_score      DECIMAL(5,4),
    channel_rank          INT,
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_channel_econ_org_date ON channel_economics(organization_id, period_date DESC);

-- ============================================================
-- TABLE: keyword_economics
-- Purpose: Economics per keyword / keyword cluster
-- ============================================================
CREATE TABLE keyword_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    keyword_id            UUID NOT NULL,
    
    period_date           DATE NOT NULL,
    
    impressions           INT,
    clicks                INT,
    ctr                   DECIMAL(5,4),
    conversions           INT,
    
    total_cost            DECIMAL(12,2),
    revenue               DECIMAL(12,2),
    cpc                   DECIMAL(8,4),
    cpa                   DECIMAL(8,4),
    roas                  DECIMAL(8,4),
    
    organic_traffic       INT,
    organic_value         DECIMAL(12,2),
    keyword_rank          INT,
    keyword_trend         VARCHAR(20),                  -- RISING, STABLE, DECLINING
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_keyword_econ_org_date ON keyword_economics(organization_id, period_date DESC);

-- ============================================================
-- TABLE: category_economics
-- Purpose: Aggregated economics per product category
-- ============================================================
CREATE TABLE category_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    category_id           UUID NOT NULL,
    
    period_date           DATE NOT NULL,
    
    content_cost          DECIMAL(12,2),
    ai_cost               DECIMAL(12,2),
    advertising_cost      DECIMAL(12,2),
    total_cost            DECIMAL(12,2),
    
    assets_generated      INT,
    assets_published      INT,
    winning_assets        INT,
    
    traffic               INT,
    leads                 INT,
    rfqs                  INT,
    revenue               DECIMAL(12,2),
    
    cost_per_lead         DECIMAL(12,2),
    cost_per_rfq          DECIMAL(12,2),
    cost_per_asset        DECIMAL(8,4),
    revenue_per_asset     DECIMAL(8,4),
    category_roi          DECIMAL(8,4),
    
    -- Demand indicators
    search_volume         INT,
    competition_level     VARCHAR(20),                  -- LOW, MEDIUM, HIGH
    opportunity_score     DECIMAL(5,4),
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_category_econ_org_date ON category_economics(organization_id, period_date DESC);

-- ============================================================
-- TABLE: geo_economics
-- Purpose: Aggregated economics per geographic region
-- ============================================================
CREATE TABLE geo_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    country_id            UUID NOT NULL,
    state_id              UUID,
    city_id               UUID,
    
    period_date           DATE NOT NULL,
    
    total_spend           DECIMAL(12,2),
    impressions           INT,
    clicks                INT,
    conversions           INT,
    revenue               DECIMAL(12,2),
    
    cpa                   DECIMAL(8,4),
    roas                  DECIMAL(8,4),
    cac                   DECIMAL(12,2),
    
    suppliers_acquired    INT,
    buyers_acquired       INT,
    rfqs_generated        INT,
    
    market_penetration    DECIMAL(5,4),                 -- % of addressable market
    growth_rate           DECIMAL(8,4),
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_geo_econ_org_date ON geo_economics(organization_id, period_date DESC);

-- ============================================================
-- TABLE: persona_economics
-- Purpose: Aggregated economics per buyer/supplier persona
-- ============================================================
CREATE TABLE persona_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    persona_id            UUID NOT NULL,
    persona_type          VARCHAR(30) NOT NULL,         -- BUYER, SUPPLIER
    
    period_date           DATE NOT NULL,
    
    total_spend           DECIMAL(12,2),
    impressions           INT,
    clicks                INT,
    conversions           INT,
    revenue               DECIMAL(12,2),
    
    cac                   DECIMAL(12,2),
    ltv                   DECIMAL(12,2),
    ltv_cac_ratio         DECIMAL(8,4),
    payback_days          INT,
    
    content_engagement_rate DECIMAL(5,4),
    conversion_rate       DECIMAL(5,4),
    avg_transaction_value DECIMAL(12,2),
    frequency             DECIMAL(5,2),
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_persona_econ_org_date ON persona_economics(organization_id, period_date DESC);
```

### 44. Growth Capital Tables

```sql
-- ============================================================
-- TABLE: asset_economics
-- Purpose: Economics per content asset
-- ============================================================
CREATE TABLE asset_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    asset_id              UUID NOT NULL,
    
    -- Generation cost
    ai_cost               DECIMAL(12,4),
    rendering_cost        DECIMAL(12,4),
    total_gen_cost        DECIMAL(12,4),
    
    -- Performance
    impressions           INT DEFAULT 0,
    clicks                INT DEFAULT 0,
    engagements           INT DEFAULT 0,
    shares                INT DEFAULT 0,
    saves                 INT DEFAULT 0,
    leads                 INT DEFAULT 0,
    rfqs                  INT DEFAULT 0,
    revenue               DECIMAL(12,2) DEFAULT 0,
    
    -- Efficiency
    cost_per_impression   DECIMAL(8,4),
    cost_per_click        DECIMAL(8,4),
    cost_per_lead         DECIMAL(12,4),
    cost_per_rfq          DECIMAL(12,4),
    asset_roi             DECIMAL(8,4),
    
    -- Quality
    quality_score         DECIMAL(3,2),
    is_winning            BOOLEAN DEFAULT false,
    winning_rank          INT,
    
    -- Lifecycle
    published_at          TIMESTAMPTZ,
    first_performance_at  TIMESTAMPTZ,
    peak_performance_at   TIMESTAMPTZ,
    retired_at            TIMESTAMPTZ,
    
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_asset_econ_org ON asset_economics(organization_id);
CREATE INDEX idx_asset_econ_winning ON asset_economics(is_winning) WHERE is_winning = true;
CREATE INDEX idx_asset_econ_roi ON asset_economics(asset_roi DESC);

-- ============================================================
-- TABLE: job_economics
-- Purpose: Economics per job (batch operation)
-- ============================================================
CREATE TABLE job_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    job_id                UUID NOT NULL,
    
    -- Cost breakdown
    total_cost            DECIMAL(12,2),
    ai_cost               DECIMAL(12,2),
    infrastructure_cost   DECIMAL(12,2),
    provider_cost         DECIMAL(12,2),
    
    -- Output
    assets_requested      INT,
    assets_generated      INT,
    assets_published      INT,
    cost_per_output       DECIMAL(8,4),
    
    -- Quality
    avg_quality_score     DECIMAL(3,2),
    winning_rate          DECIMAL(5,4),
    
    -- Duration
    started_at            TIMESTAMPTZ,
    completed_at          TIMESTAMPTZ,
    duration_seconds      INT,
    cost_per_second       DECIMAL(8,4),
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_econ_org ON job_economics(organization_id, created_at DESC);

-- ============================================================
-- TABLE: workflow_economics
-- Purpose: Economics per workflow
-- ============================================================
CREATE TABLE workflow_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    workflow_id           UUID NOT NULL,
    
    period_date           DATE NOT NULL,
    
    executions            INT,
    total_cost            DECIMAL(12,2),
    avg_cost_per_execution DECIMAL(12,2),
    
    success_rate          DECIMAL(5,4),
    avg_duration_seconds  INT,
    
    cost_by_step          JSONB,                        -- cost breakdown per workflow step
    cost_by_provider      JSONB,                        -- cost breakdown per AI provider
    
    output_quality_score  DECIMAL(3,2),
    cost_efficiency_score DECIMAL(3,2),
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_econ_org_date ON workflow_economics(organization_id, period_date DESC);
```

### 45. Decision Engine Tables

```sql
-- ============================================================
-- TABLE: cac_anomalies
-- Purpose: CAC-specific anomalies
-- ============================================================
CREATE TABLE cac_anomalies (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    entity_type           VARCHAR(50) NOT NULL,
    anomaly_type          VARCHAR(50) NOT NULL,         -- CAC_SPIKE, CAC_DRIFT, VOLUME_DROP, etc.
    severity              VARCHAR(20) NOT NULL,
    
    expected_cac          DECIMAL(12,2),
    actual_cac            DECIMAL(12,2),
    deviation_pct         DECIMAL(8,4),
    
    affected_channel      VARCHAR(50),
    affected_industry     UUID,
    affected_city         UUID,
    
    description           TEXT NOT NULL,
    root_cause_hypothesis TEXT,
    
    auto_action_taken     VARCHAR(50),
    resolution            TEXT,
    
    detected_at           TIMESTAMPTZ DEFAULT NOW(),
    resolved_at           TIMESTAMPTZ,
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cac_anomalies_org ON cac_anomalies(organization_id, detected_at DESC);

-- ============================================================
-- TABLE: cac_forecasts
-- Purpose: CAC predictions
-- ============================================================
CREATE TABLE cac_forecasts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    entity_type           VARCHAR(50) NOT NULL,
    forecast_date         DATE NOT NULL,
    forecast_horizon_days INT NOT NULL,
    
    predicted_cac         DECIMAL(12,2) NOT NULL,
    predicted_volume      INT,
    predicted_spend       DECIMAL(12,2),
    predicted_ltv_cac     DECIMAL(8,4),
    
    confidence_interval   DECIMAL(5,2),
    
    actual_cac            DECIMAL(12,2),                -- filled after period
    prediction_error      DECIMAL(8,4),
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cac_forecasts_org_date ON cac_forecasts(organization_id, forecast_date DESC);

-- ============================================================
-- TABLE: ltv_cac_snapshots
-- Purpose: LTV:CAC ratio tracking over time
-- ============================================================
CREATE TABLE ltv_cac_snapshots (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    entity_type           VARCHAR(50) NOT NULL,
    snapshot_date         DATE NOT NULL,
    
    avg_ltv               DECIMAL(12,2),
    avg_cac               DECIMAL(12,2),
    ltv_cac_ratio         DECIMAL(8,4),
    
    status                VARCHAR(20),                  -- EXCELLENT, GOOD, ACCEPTABLE, WARNING, CRITICAL, EMERGENCY
    
    payback_period_days   INT,
    months_to_recover     DECIMAL(6,2),
    
    -- Forecast
    predicted_30day_ratio DECIMAL(8,4),
    predicted_90day_ratio DECIMAL(8,4),
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ltv_cac_org_date ON ltv_cac_snapshots(organization_id, snapshot_date DESC);

-- ============================================================
-- TABLE: payback_snapshots
-- Purpose: CAC payback period tracking
-- ============================================================
CREATE TABLE payback_snapshots (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    
    entity_type           VARCHAR(50) NOT NULL,
    snapshot_date         DATE NOT NULL,
    
    avg_payback_days      INT,
    median_payback_days   INT,
    payback_target_days   INT,
    payback_status        VARCHAR(20),                  -- ON_TRACK, WARNING, EXCEEDED
    
    cohorts_analyzed      INT,
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payback_org_date ON payback_snapshots(organization_id, snapshot_date DESC);

-- ============================================================
-- TABLE: budget_reallocation_logs
-- Purpose: Detailed log of budget reallocations
-- ============================================================
CREATE TABLE budget_reallocation_logs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    reallocation_id       UUID NOT NULL REFERENCES budget_reallocations(id),
    
    log_type              VARCHAR(50) NOT NULL,         -- TRIGGERED, EXECUTED, MONITORED, ASSESSED
    
    trigger_data          JSONB,
    execution_data        JSONB,
    monitoring_data       JSONB,
    assessment_data       JSONB,
    
    metric_before         JSONB,
    metric_after          JSONB,
    metric_delta          JSONB,
    
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_realloc_logs_org ON budget_reallocation_logs(organization_id, created_at DESC);
```

### 46. Time-Series & Partitioning Strategy

#### 46.1 Partition Strategy

| Table | Partition By | Interval | Retention |
|---|---|---|---|
| `cost_events` | `recorded_at` | Monthly | 24 months (raw), 36 months (aggregated) |
| `acquisition_events` | `event_at` | Monthly | 24 months (raw), 36 months (aggregated) |
| `economic_snapshots` | `snapshot_date` | Monthly | 36 months |
| `campaign_economics` | `period_date` | Monthly | 24 months |
| `channel_economics` | `period_date` | Monthly | 24 months |
| `category_economics` | `period_date` | Monthly | 24 months |
| `geo_economics` | `period_date` | Monthly | 24 months |
| `persona_economics` | `period_date` | Monthly | 24 months |
| `cac_snapshots` | `snapshot_date` | Monthly | 36 months |
| `keyword_economics` | `period_date` | Monthly | 24 months |

#### 46.2 Aggregation Strategy

```yaml
aggregation:
  real_time:
    - cost_events → hourly_summary
    - acquisition_events → hourly_summary
    
  daily:
    - hourly_summary → daily_economic_snapshots
    - cost_events → daily_cost_by_account
    - cost_events → daily_cost_by_provider
    
  weekly:
    - daily_snapshots → weekly_trends
    - cac_snapshots → weekly_cac_trends
    
  monthly:
    - daily_data → monthly_campaign_economics
    - daily_data → monthly_channel_economics
    - daily_data → monthly_category_economics
    - cac_snapshots → monthly_cac_reports
    
  archival:
    - raw_cost_events → archive after 24 months
    - raw_acquisition_events → archive after 24 months
    - keep aggregated data for 60 months
```

---

## Part VIII — AI Agent Architecture

### 47. Agent Taxonomy

| Agent ID | Agent Name | Brain | Primary Responsibility | Autonomy Level |
|---|---|---|---|---|
| `EG-001` | Economic Governor Agent | All | Master orchestrator across all 4 brains | L2 (default) |
| `FO-001` | FinOps Agent | Brain 1 | Infrastructure cost optimization | L2 |
| `FO-002` | AI Cost Optimization Agent | Brain 1 | AI provider routing and cost efficiency | L2 |
| `FO-003` | Content Cost Agent | Brain 1 | Content generation cost per asset | L2 |
| `FO-004` | Cost Anomaly Agent | Brain 1 | Detect and respond to cost anomalies | L2 |
| `FO-005` | Cost Forecasting Agent | Brain 1 | Predict future costs | L1 |
| `CA-001` | Customer Acquisition Intelligence Agent | Brain 2 | CAC analysis and optimization | L2 |
| `CA-002` | Acquisition Budget Governor Agent | Brain 2 | Manage acquisition budgets | L2 |
| `CA-003` | LTV Prediction Agent | Brain 2 | Predict customer lifetime value | L1 |
| `CA-004` | Attribution Intelligence Agent | Brain 2 | Multi-touch attribution analysis | L2 |
| `CA-005` | Funnel Economics Agent | Brain 2 | Optimize conversion funnel costs | L2 |
| `CA-006` | Budget Reallocation Agent | Brain 2 | Identify and execute reallocations | L2 |
| `AB-001` | Advertising Budget Agent | Brain 3 | Ad spend optimization across channels | L2 |
| `AB-002` | Campaign Profitability Agent | Brain 3 | Campaign ROI analysis | L2 |
| `AB-003` | Provider Routing Agent | Brain 3 | Route ads to best-performing channels | L2 |
| `AB-004` | Creative Economics Agent | Brain 3 | Track creative cost vs performance | L2 |
| `GC-001` | Growth Capital Allocation Agent | Brain 4 | Allocate capital across investment areas | L1 |
| `GC-002` | Portfolio Optimization Agent | Brain 4 | Optimize investment portfolio | L1 |
| `GC-003` | Growth Efficiency Agent | Brain 4 | Track marginal value per ₹1 | L2 |
| `GC-004` | Budget Compliance Agent | Brain 4 | Ensure all spending follows policy | L3 |

### 48. Economic Governor Agent (Master Orchestrator)

```yaml
agent:
  id: "EG-001"
  name: "Economic Governor Agent"
  brain: "All (4 brains)"
  type: "orchestrator"
  
  responsibilities:
    - Coordinate all 4 brain agents
    - Resolve conflicts between brain recommendations
    - Generate master economic decisions
    - Escalate to human when required
    - Generate executive summaries
    - Track overall economic health
    
  inputs:
    - cost_events (real-time stream)
    - economic_snapshots (periodic)
    - brain_agent_recommendations (from EG-001's subordinate agents)
    - economic_policies (guardrails)
    - budget_utilization (real-time)
    
  outputs:
    - economic_decisions (master decisions)
    - economic_alerts (when thresholds breached)
    - executive_summary (daily/weekly/monthly)
    - policy_recommendations (when patterns detected)
    
  decision_priority:
    1: "STOP immediate losses (bleeding campaigns, cost spikes)"
    2: "PAUSE underperformers (ROAS < 1x, CAC > 2× target)"
    3: "REDUCE over-spenders (approaching budget limits)"
    4: "OPTIMIZE mid-performers (within ±10% adjustments)"
    5: "SCALE winners (ROAS > 4x, CAC < 0.5× target)"
    
  conflict_resolution:
    rule: "If two brain agents recommend conflicting actions, Economic Governor evaluates which action has higher predicted business value per economic cost."
    escalation: "If confidence < 70% for either recommendation, escalate to human."
    
  reporting:
    daily: "Key metrics dashboard — total cost, total revenue, ROAS, CAC, anomalies"
    weekly: "Decision impact report — what decisions were made, predicted vs actual impact"
    monthly: "Executive economic report — full P&L, trends, forecasts, recommendations"
```

### 49. FinOps Agent

```yaml
agent:
  id: "FO-001"
  name: "FinOps Agent"
  brain: "Brain 1 — FinOps Governor"
  
  responsibilities:
    - Monitor all infrastructure costs in real-time
    - Detect cost anomalies (>2σ from baseline)
    - Recommend right-sizing of resources
    - Track cost per operation, per org, per feature
    - Generate cost optimization recommendations
    
  decision_types:
    - "INFRA_RIGHTSIZING"
    - "INFRA_SCALING"
    - "RESOURCE_TERMINATION"
    - "STORAGE_LIFECYCLE"
    - "CDN_OPTIMIZATION"
    
  autonomy:
    L2: "Can adjust within ±10% of current allocation"
    L3: "Can reallocate within daily budget cap"
    escalation: "Cost increase > 25% requires human approval"
    
  metrics_tracked:
    - INFRA_COST_PER_DAY
    - INFRA_COST_PER_ASSET
    - INFRA_COST_TREND_7D
    - STORAGE_GROWTH_RATE
    - BANDWIDTH_UTILIZATION
```

### 50. Customer Acquisition Intelligence Agent

```yaml
agent:
  id: "CA-001"
  name: "Customer Acquisition Intelligence Agent"
  brain: "Brain 2 — Customer Acquisition Governor"
  
  responsibilities:
    - Track CAC per entity type in real-time
    - Detect CAC anomalies and trend changes
    - Recommend budget reallocation across acquisition channels
    - Calculate true fully-loaded CAC per entity
    - Optimize LTV:CAC ratio across all entity types
    
  entity_types_tracked:
    - BUYER
    - SUPPLIER
    - VERIFIED_SUPPLIER
    - RFQ_CREATOR
    - QUALIFIED_RFQ_CREATOR
    - ACTIVE_BUYER
    - ACTIVE_SUPPLIER
    - PAYING_SUPPLIER
    - SUBSCRIPTION_CUSTOMER
    - TRANSACTION_CUSTOMER
    - RETURNING_CUSTOMER
    - ENTERPRISE_ACCOUNT
    
  decision_types:
    - "INCREASE_ACQUISITION_BUDGET"
    - "DECREASE_ACQUISITION_BUDGET"
    - "PAUSE_ACQUISITION_CHANNEL"
    - "SHIFT_ACQUISITION_CHANNEL"
    - "SHIFT_ACQUISITION_GEO"
    - "SHIFT_ACQUISITION_PERSONA"
    - "CHANGE_ACQUISITION_CREATIVE"
    - "START_CAC_EXPERIMENT"
    
  guardrails:
    max_cac_increase: 20%       # cannot increase CAC target by > 20% without approval
    max_budget_increase: 15%     # cannot increase acquisition budget by > 15% without approval
    min_data_points: 50          # need at least 50 acquisitions before optimizing
    statistical_significance: 0.80  # 80% confidence before acting
    
  reporting:
    daily: "CAC dashboard per entity type"
    weekly: "Acquisition performance vs targets"
    monthly: "LTV:CAC analysis, cohort analysis, payback tracking"
```

### 51. Advertising Budget Agent

```yaml
agent:
  id: "AB-001"
  name: "Advertising Budget Agent"
  brain: "Brain 3 — Advertising Budget Governor"
  
  responsibilities:
    - Optimize ad spend across Google, Meta, LinkedIn (and future channels)
    - Track ROAS per campaign, per channel, per keyword
    - Detect creative fatigue and recommend refreshes
    - Execute cross-channel budget arbitrage
    - Manage campaign lifecycle (learning → scaling → maturity → retirement)
    
  channels_managed:
    - GOOGLE_SEARCH
    - GOOGLE_DISPLAY
    - GOOGLE_PMAX
    - META_FEED
    - META_REELS
    - META_STORIES
    - LINKEDIN_SPONSORED
    - LINKEDIN_MESSAGES
    - LINKEDIN_JOBS
    - YOUTUBE
    - WHATSAPP_ADS
    - FUTURE_CHANNELS
    
  decision_types:
    - "SCALE_CAMPAIGN_BUDGET"
    - "REDUCE_CAMPAIGN_BUDGET"
    - "PAUSE_CAMPAIGN"
    - "STOP_CAMPAIGN"
    - "REFRESH_CREATIVE"
    - "CROSS_CHANNEL_REALLOCATE"
    - "KEYWORD_BID_ADJUSTMENT"
    - "AUDIENCE_TARGETING_CHANGE"
    - "GEO_BUDGET_SHIFT"
    - "SEASONAL_PRE_POSITION"
    
  budget_rules:
    min_channel_allocation: 5%    # diversification
    max_channel_allocation: 60%   # concentration risk
    daily_pacing_tolerance: 15%   # can spend 115% of daily budget on high-performing days
    
  performance_tiers:
    star: { roas: ">6x", action: "SCALE 15%/week" }
    winner: { roas: "3-6x", action: "SCALE 10%/week" }
    steady: { roas: "1.5-3x", action: "MAINTAIN + optimize" }
    underperformer: { roas: "1-1.5x", action: "REDUCE 20%" }
    loser: { roas: "<1x", action: "PAUSE + diagnose" }
    bleeder: { roas: "<0.5x", action: "STOP immediately" }
```

### 52. Growth Capital Allocation Agent

```yaml
agent:
  id: "GC-001"
  name: "Growth Capital Allocation Agent"
  brain: "Brain 4 — Growth Capital Allocation Governor"
  
  responsibilities:
    - Allocate growth capital across investment areas
    - Track ROI per investment area
    - Optimize marginal value per ₹1 spent
    - Manage investment portfolio rebalancing
    - Recommend growth stage transitions
    
  investment_areas:
    - CONTENT_ENGINE
    - ADVERTISING
    - AI_INFRASTRUCTURE
    - PLATFORM_DEVELOPMENT
    - SALES_OUTREACH
    - SEO_INVESTMENT
    - BRAND_BUILDING
    - PARTNERSHIP
    - TALENT
    - DATA_INTELLIGENCE
    - PROMOTIONAL
    - RND
    
  decision_types:
    - "INCREASE_ALLOCATION"
    - "DECREASE_ALLOCATION"
    - "REBALANCE_PORTFOLIO"
    - "FUND_EXPERIMENT"
    - "TERMINATE_INVESTMENT"
    - "GROWTH_STAGE_TRANSITION"
    
  allocation_targets:
    acquisition: 40%
    infrastructure: 25%
    content_engine: 20%
    growth: 10%
    reserve: 5%
    
  rebalancing_triggers:
    - "Any area > 2× target allocation"
    - "Any area < 50% of expected ROI for 60 days"
    - "New opportunity with ROI > 3× current average"
    - "Quarterly scheduled review"
```

### 53. Supporting Agents

```yaml
agents:
  FO-002_AI_Cost_Optimization:
    responsibilities:
      - Route AI tasks to optimal provider/model
      - Track cost per AI operation
      - Optimize prompt efficiency
      - Manage cache hit rates
      - Recommend model tiering (small model for simple tasks)
    
  FO-003_Content_Cost:
    responsibilities:
      - Track cost per asset type (image, video, text, voice)
      - Optimize content generation workflow costs
      - Recommend content format for cost efficiency
      - Track cost per published post
      - Track winning asset rate vs generation cost
    
  FO-004_Cost_Anomaly:
    responsibilities:
      - Monitor all cost streams for anomalies
      - Detect spikes, drifts, duplicates, zero-values
      - Auto-respond to critical anomalies (pause affected operations)
      - Investigate root cause
      - Generate anomaly reports
    
  FO-005_Cost_Forecasting:
    responsibilities:
      - Predict daily, weekly, monthly, quarterly costs
      - Predict cost under different scenarios
      - Recommend budget allocation based on forecasts
      - Track prediction accuracy
    
  CA-002_Acquisition_Budget_Governor:
    responsibilities:
      - Enforce budget limits per entity type
      - Execute approved budget changes
      - Monitor budget burn rate
      - Alert when approaching budget limits
      - Recommend budget increases/decreases
    
  CA-003_LTV_Prediction:
    responsibilities:
      - Predict LTV per customer based on early behavior
      - Score churn risk
      - Identify high-value prospects
      - Recommend retention investment
      - Track prediction accuracy
    
  CA-004_Attribution:
    responsibilities:
      - Implement multi-touch attribution models
      - Calculate channel contribution per conversion
      - Track first-touch, last-touch, and assisted conversions
      - Recommend attribution model changes
    
  CA-005_Funnel_Economics:
    responsibilities:
      - Track cost per funnel stage
      - Identify funnel bottlenecks
      - Recommend funnel optimization
      - Track stage-to-stage conversion rates
      - Calculate funnel-level CAC
    
  AB-002_Campaign_Profitability:
    responsibilities:
      - Calculate fully-loaded campaign profitability
      - Classify campaigns into tiers
      - Track campaign lifecycle economics
      - Recommend campaign retirement
    
  AB-004_Creative_Economics:
    responsibilities:
      - Track cost per creative asset
      - Correlate creative cost with performance
      - Recommend creative refresh when fatigue detected
      - Identify winning creative patterns
      - Optimize creative production workflow
```

---

## Part IX — Autonomy & Control Framework

### 54. Autonomy Levels

#### 54.1 Level Specifications

| Level | Name | Agent Authority | Budget Control | Human Involvement | Risk Profile |
|---|---|---|---|---|---|
| `L0_OBSERVE` | Observe Only | Log metrics, generate reports | None | Manual all decisions | None |
| `L1_RECOMMEND` | Recommend | Generate recommendations | None | Approve/reject all | Very Low |
| `L2_CONTROLLED_OPTIMIZATION` | Controlled Optimization | Auto-optimize within ±10% | ±10% of current | Review daily, approve escalations | Low-Medium |
| `L3_BUDGET_AUTONOMY` | Budget Autonomy | Full freedom within budget cap | Up to daily limit | Review weekly, set monthly | Medium-High |
| `L4_ECONOMIC_AUTONOMY` | Full Economic Autonomy | All decisions within policy | Up to campaign limit | Set quarterly strategy | High |

#### 54.2 Default Level Assignment

| Operation | Default Level | Max Allowed | Rationale |
|---|---|---|---|
| AI Provider Routing | L2 | L3 | Can optimize within bounds |
| Content Generation Volume | L2 | L3 | Scale winners, pause losers |
| Google Ads Budget | L2 | L3 | Bounded optimization |
| Meta Ads Budget | L2 | L3 | Bounded optimization |
| LinkedIn Ads Budget | L2 | L3 | Bounded optimization |
| Cross-Channel Reallocation | L1 | L2 | Requires analysis |
| Budget Increase (any) | L1 | L2 | Financial risk |
| New Campaign Launch | L1 | L2 | Needs approval |
| Campaign Stop | L1 | L2 | Irreversible impact |
| Provider Change (AI) | L2 | L3 | Quality impact |
| Infrastructure Scaling | L1 | L2 | Cost impact |
| Pricing Changes | L0 | L1 | Business-critical |
| New Market Entry | L0 | L1 | Strategic decision |
| Acquisition Budget Increase > 25% | L0 | L1 | High financial risk |
| Emergency Stop | L2 | L4 | Safety override |

### 55. Budget Guardrails

#### 55.1 Guardrail Types

| Guardrail | Scope | Limit | Override |
|---|---|---|---|
| Daily Spend Cap | Per campaign | Campaign daily budget | Human approval |
| Monthly Spend Cap | Per entity type / channel | Monthly budget | Human approval |
| Burn Rate Alert | Global | >120% of expected daily | Auto-throttle |
| Hard Stop | Global | >150% of monthly budget | Emergency pause |
| Per-Action Cap | Per decision | Max single action value | Escalate above cap |
| CAC Ceiling | Per entity type | Max acceptable CAC | Human approval |
| ROAS Floor | Per campaign | Min acceptable ROAS | Auto-pause below floor |

#### 55.2 Guardrail Enforcement

```
EVERY economic decision MUST pass through guardrails:

1. BUDGET GUARDRAIL
   IF action increases spend:
     IF new_spend > daily_budget_cap → BLOCK
     IF new_spend > monthly_budget_cap → BLOCK
     IF new_spend > 120% of daily_average → ESCALATE

2. CAC GUARDRAIL
   IF action increases CAC:
     IF projected_cac > maximum_cac → BLOCK
     IF projected_cac > 2× target_cac → ESCALATE

3. ROAS GUARDRAIL
   IF action reduces ROAS:
     IF projected_roas < 1.0 → BLOCK
     IF projected_roas < target_roas × 0.7 → ESCALATE

4. QUALITY GUARDRAIL
   IF action changes AI provider:
     IF new_provider_quality_score < minimum_quality → BLOCK

5. POLICY GUARDRAIL
   IF action violates any active policy:
     IF policy.severity = "hard" → BLOCK
     IF policy.severity = "soft" → ESCALATE

All blocks are logged. All escalations go to human approval queue.
```

### 56. Human Approval Gates

#### 56.1 Approval Queue

| Trigger | Approver | Response SLA | Auto-Action on Timeout |
|---|---|---|---|
| Budget increase > 25% | Finance / Owner | 4 hours | Reject |
| New campaign launch | Marketing Lead | 2 hours | Hold |
| Emergency stop | Anyone with access | Immediate | Execute |
| Pricing change | Owner | 24 hours | Hold |
| Provider change (AI) | Tech Lead | 4 hours | Hold |
| Cross-industry reallocation | Strategy Lead | 8 hours | Hold |
| Autonomy level upgrade | Owner | 24 hours | Maintain current level |

#### 56.2 Approval Interface

```yaml
approval_notification:
  channel: "email + in-app + mobile push"
  content:
    - "Decision type and reasoning"
    - "Predicted impact (cost change, volume change, ROAS change)"
    - "Risk assessment"
    - "Confidence level of agent"
    - "Alternative options considered"
    - "Time sensitivity"
  actions:
    - "APPROVE — execute the decision"
    - "REJECT — do not execute"
    - "MODIFY — adjust parameters and approve"
    - "DEFER — revisit later"
    - "ESCALATE — forward to higher authority"
```

### 57. Audit & Compliance

#### 57.1 Audit Requirements

| Event | Audit Data | Retention |
|---|---|---|
| Every cost event | Full attribution tags, amounts, timestamps | 24 months |
| Every economic decision | Decision type, reasoning, confidence, predicted impact | 36 months |
| Every decision execution | Execution result, actual impact, errors | 36 months |
| Every budget change | Before/after amounts, who changed, why | 36 months |
| Every anomaly | Detection data, response actions, resolution | 24 months |
| Every human approval | Who approved, when, conditions | 60 months |
| Every policy change | Full policy diff, effective dates | 60 months |

#### 57.2 Compliance Checks

| Check | Frequency | Responsible Agent | Escalation |
|---|---|---|---|
| Budget compliance | Real-time | Budget Compliance Agent | Alert → Auto-pause |
| CAC threshold compliance | Daily | Customer Acquisition Agent | Alert → Auto-throttle |
| ROAS threshold compliance | Daily | Advertising Budget Agent | Alert → Auto-pause |
| Policy compliance | Real-time | All agents | Block → Escalate |
| Audit trail completeness | Weekly | Economic Governor | Report → Investigate |
| Provider cost accuracy | Monthly | FinOps Agent | Investigate → Correct |

---

## Part X — Integration Map

### 58. System Integration Points

| Bell24h-OS System | Integration Type | Data Flow | Economic Impact |
|---|---|---|---|
| **Global Job Orchestrator** | Bidirectional | Job cost data ←→ Budget checks | Every job has cost attribution |
| **AI Provider Manager** | Bidirectional | Provider costs ←→ Routing decisions | Provider selection optimization |
| **Industry Intelligence** | Read | Industry benchmarks → CAC targets | Industry-specific economics |
| **SEO Intelligence** | Bidirectional | Keyword value → Budget allocation | Keyword-level ROI |
| **Campaign Intelligence** | Bidirectional | Campaign metrics ←→ Budget decisions | Campaign-level optimization |
| **Content Planner** | Bidirectional | Content cost data ←→ Content budget | Content ROI tracking |
| **Image Studio** | Read | Image generation costs → Cost tracking | Cost per image |
| **Video Studio** | Read | Video generation costs → Cost tracking | Cost per video second |
| **Voice Studio** | Read | Voice generation costs → Cost tracking | Cost per voice second |
| **Avatar Studio** | Read | Avatar generation costs → Cost tracking | Cost per avatar second |
| **Media Composer** | Read | Composition costs → Cost tracking | Total asset cost |
| **Publishing Center** | Bidirectional | Publishing costs ←→ Channel budget | Channel-level economics |
| **Automation Platform** | Bidirectional | Workflow costs ←→ Budget checks | Workflow ROI |
| **Performance Intelligence** | Bidirectional | Performance data ←→ Economic decisions | ROI-based optimization |
| **Learning Engine** | Bidirectional | Learning data → Decision model improvement | Continuous optimization |
| **Advertising Platform** | Write | Budget decisions → Ad APIs | Real-time budget control |
| **CRM / User System** | Read | User data → CAC attribution | Customer-level economics |

### 59. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ECONOMIC INTELLIGENCE LAYER                       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   EVENT BUS (Real-time)                       │  │
│  │  cost_events ─── acquisition_events ─── revenue_events       │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                           │                                         │
│  ┌────────────────────────▼─────────────────────────────────────┐  │
│  │              COST ATTRIBUTION ENGINE                          │  │
│  │  Tag every event with: org, campaign, industry, category,    │  │
│  │  product, provider, model, channel, geo, keyword, persona    │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                           │                                         │
│  ┌────────────────────────▼─────────────────────────────────────┐  │
│  │              ECONOMIC ANALYTICS ENGINE                        │  │
│  │  Real-time: Cost streams, budget burn rates, anomalies       │  │
│  │  Batch: CAC calculations, ROAS analysis, LTV predictions     │  │
│  └────────┬───────────────┬───────────────┬────────────────────┘  │
│           │               │               │                         │
│  ┌────────▼────┐  ┌───────▼─────┐  ┌─────▼──────────┐             │
│  │ BRAIN 1:    │  │ BRAIN 2:    │  │ BRAIN 3:       │             │
│  │ FinOps      │  │ Acquisition │  │ Advertising    │             │
│  │ Governor    │  │ Governor    │  │ Budget Governor│             │
│  └────────┬────┘  └───────┬─────┘  └─────┬──────────┘             │
│           │               │               │                         │
│           └───────────────┼───────────────┘                         │
│                           │                                         │
│                  ┌────────▼────────┐                                │
│                  │    BRAIN 4:     │                                │
│                  │  Growth Capital │                                │
│                  │  Allocation     │                                │
│                  └────────┬────────┘                                │
│                           │                                         │
│                  ┌────────▼────────┐                                │
│                  │ ECONOMIC        │                                │
│                  │ GOVERNOR AGENT  │                                │
│                  │ (Master)        │                                │
│                  └────────┬────────┘                                │
│                           │                                         │
│            ┌──────────────┼──────────────┐                         │
│            ▼              ▼              ▼                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │  DECISION    │ │  ALERT       │ │  REPORT      │               │
│  │  EXECUTION   │ │  NOTIFICATION│ │  GENERATION  │               │
│  └──────────────┘ └──────────────┘ └──────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 60. Event Bus Architecture

```yaml
event_bus:
  name: "Bell24h-OS Economic Event Bus"
  type: "Internal pub/sub"
  
  topics:
    cost_events:
      producers: ["All cost-generating operations"]
      consumers: ["Cost Attribution Engine", "FinOps Agent", "Anomaly Agent"]
      retention: "7 days raw, 90 days aggregated"
      
    acquisition_events:
      producers: ["Registration system", "Ad platforms", "Content system"]
      consumers: ["CAC Agent", "Attribution Agent", "Funnel Agent"]
      retention: "7 days raw, 90 days aggregated"
      
    revenue_events:
      producers: ["Subscription system", "Transaction system", "Marketplace"]
      consumers: ["Economic Governor", "LTV Agent", "ROI calculations"]
      retention: "30 days raw, 365 days aggregated"
      
    economic_decisions:
      producers: ["All economic agents"]
      consumers: ["Decision Execution Engine", "Audit system", "Reporting"]
      retention: "365 days"
      
    economic_alerts:
      producers: ["Anomaly agents", "Budget agents", "Compliance agents"]
      consumers: ["Notification system", "Human approval queue"]
      retention: "90 days"
      
    budget_updates:
      producers: ["Budget Governor", "Human admin"]
      consumers: ["All budget-aware agents"]
      retention: "30 days"
```

---

## Appendices

### Appendix A — Economic KPI Dashboard

#### Daily Dashboard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BELL24H-OS ECONOMIC DASHBOARD — [DATE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 COSTS TODAY
  Total Cost:           ₹XX,XXX
  AI Cost:              ₹X,XXX (XX%)
  Ad Spend:             ₹X,XXX (XX%)
  Content Cost:         ₹X,XXX (XX%)
  Infrastructure:       ₹X,XXX (XX%)
  Operations:           ₹X,XXX (XX%)
  Budget Used:          XX% of daily budget

📈 REVENUE TODAY
  Total Revenue:        ₹XX,XXX
  Subscription:         ₹X,XXX
  Transaction:          ₹X,XXX
  Net:                  ₹XX,XXX

🎯 ACQUISITION TODAY
  Buyers:               XXX (CAC: ₹XX)
  Suppliers:            XXX (CAC: ₹XXX)
  Verified Suppliers:   XX (CAC: ₹X,XXX)
  RFQs Created:         XXX (CAC: ₹XXX)
  Qualified RFQs:       XX (CAC: ₹X,XXX)

📊 ROAS TODAY
  Google Ads:           X.Xx
  Meta Ads:             X.Xx
  LinkedIn:             X.Xx
  Content (organic):    X.Xx
  Blended:              X.Xx

⚡ ALERTS
  [3 active — 1 critical, 2 warnings]

🤖 AGENT DECISIONS
  Decisions Made:       XX
  Auto-Executed:        XX (L2)
  Escalated:            X (L1 → human approval)
  Blocked:              X (guardrail violation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Appendix B — Example Economic Decisions

#### Example 1: Video Campaign Optimization

```yaml
decision:
  id: "DEC-2026-07-15-001"
  agent: "AB-001 (Advertising Budget Agent)"
  type: "REDUCE_CAMPAIGN_BUDGET"
  confidence: 0.87
  
  context:
    campaign: "Surat Textile Video Campaign"
    spend_today: ₹12,000
    videos_generated: 500
    cost_per_video: ₹24
    top_performers: 27 videos (81% of qualified traffic)
    
  recommendation:
    action: "REDUCE generation frequency"
    reasoning: >
      27 videos (5.4% of total) produced 81% of qualified traffic.
      Remaining 473 videos generated minimal engagement at ₹24 each = ₹11,352 wasted.
      Recommend: Stop bulk generation, create variants of top 27 only.
    changes:
      - STOP: "Bulk generation of generic video themes"
      - SCALE: "Generate 3 variants of each of top 27 videos"
      - REUSE: "Template winning video format for other categories"
      - REROUTE: "Move ₹5,000 saved to Google Ads (4.8x ROAS)"
    predicted_impact:
      cost_reduction: ₹8,000/day
      quality_improvement: "3× engagement rate"
      rfq_impact: "+5% RFQs at -67% cost"
    autonomy_level: "L2 (within ±10% adjustment)"
    status: "AUTO_EXECUTED"
```

#### Example 2: Cross-Channel Reallocation

```yaml
decision:
  id: "DEC-2026-07-15-002"
  agent: "CA-001 (Customer Acquisition Intelligence Agent)"
  type: "SHIFT_ACQUISITION_CHANNEL"
  confidence: 0.92
  
  context:
    google_ads:
      spend: ₹50,000
      roas: 4.8
      rfqs: 42
      cost_per_rfq: ₹1,190
    meta_ads:
      spend: ₹30,000
      roas: 0.7
      rfqs: 8
      cost_per_rfq: ₹3,750
    linkedin:
      spend: ₹20,000
      roas: 2.1
      rfqs: 15
      cost_per_rfq: ₹1,333
      
  recommendation:
    action: "SHIFT ₹15,000 from Meta to Google"
    reasoning: >
      Meta ROAS 0.7x is unsustainable. Google has 4.8x ROAS with capacity to absorb 
      more budget. LinkedIn maintains stable qualified RFQs. Shift Meta budget to 
      highest-performing channel while maintaining LinkedIn investment.
    changes:
      google_ads: "₹50,000 → ₹65,000 (+30%)"
      meta_ads: "₹30,000 → ₹15,000 (-50%)"
      linkedin: "₹20,000 → ₹20,000 (maintain)"
    predicted_impact:
      total_rfqs: "65 → 72 (+10.8%)"
      cost_per_rfq: "₹1,538 → ₹1,389 (-9.7%)"
      total_spend: "₹1,00,000 → ₹1,00,000 (maintained)"
    autonomy_level: "L2 (within ±10% per channel — Meta exceeds, escalated)"
    status: "ESCALATED_TO_HUMAN"
    escalation_reason: "Meta reduction exceeds ±10% threshold"
```

### Appendix C — Provider Cost Comparison Matrix

| Provider | Model | Task | Cost | Quality | Speed | Best Use |
|---|---|---|---|---|---|---|
| OpenAI | GPT-4o | Blog post | $0.005/1K | 9/10 | 8/10 | Premium content |
| OpenAI | GPT-4o-mini | LinkedIn post | $0.00015/1K | 7/10 | 9/10 | Bulk social content |
| Anthropic | Claude Sonnet | Analysis | $0.003/1K | 9/10 | 7/10 | Long-form, analysis |
| Anthropic | Claude Haiku | Quick tasks | $0.00025/1K | 7/10 | 9/10 | High-volume, simple |
| Google | Gemini Pro | Multi-modal | $0.001/1K | 8/10 | 8/10 | Image + text |
| OpenAI | DALL-E 3 | Product image | $0.040/img | 8/10 | 7/10 | Product images |
| Stability | SDXL | Bulk images | $0.002/img | 7/10 | 8/10 | High-volume images |
| FLUX | FLUX.1 Pro | Hero images | $0.005/img | 9/10 | 6/10 | Premium visuals |
| Runway | Gen-3 Alpha | Product video | $0.05/sec | 8/10 | 5/10 | Video production |
| ElevenLabs | Turbo v2.5 | Voiceover | $0.015/1K chars | 9/10 | 8/10 | Natural voice |
| PlayHT | PlayHT 2.0 | Bulk voice | $0.010/1K chars | 7/10 | 9/10 | High-volume voice |

### Appendix D — Industry-Specific CAC Benchmarks

| Industry | Buyer CAC | Supplier CAC | Qualified RFQ CAC | Subscription CAC | Recommended ROAS |
|---|---|---|---|---|---|
| Steel & Metals | ₹30–60 | ₹150–300 | ₹150–350 | ₹1,000–2,000 | 5–8x |
| Textiles | ₹25–50 | ₹120–250 | ₹120–300 | ₹800–1,500 | 4–7x |
| Chemicals | ₹40–80 | ₹200–400 | ₹200–450 | ₹1,500–3,000 | 6–10x |
| Auto Components | ₹35–70 | ₹180–350 | ₹180–400 | ₹1,200–2,500 | 5–8x |
| Electronics | ₹20–45 | ₹100–220 | ₹100–250 | ₹700–1,400 | 3–5x |
| Machinery | ₹45–90 | ₹250–500 | ₹250–550 | ₹2,000–4,000 | 6–9x |
| Pharmaceuticals | ₹35–65 | ₹170–350 | ₹170–380 | ₹1,200–2,500 | 4–7x |
| Agriculture | ₹15–35 | ₹80–180 | ₹80–200 | ₹500–1,000 | 3–6x |
| Packaging | ₹25–55 | ₹130–270 | ₹130–300 | ₹900–1,800 | 4–7x |
| Construction Materials | ₹30–65 | ₹160–330 | ₹160–370 | ₹1,100–2,200 | 4–7x |

### Appendix E — Version Control

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-07-15 | Initial architecture — 4 brains, 62 tables, 20 agents, 5 autonomy levels |

### Future Versions

| Version | Planned Changes |
|---|---|
| 1.1 | ML models for CAC prediction and LTV forecasting |
| 1.2 | Real-time streaming cost aggregation pipeline |
| 1.3 | Advanced attribution modeling (Shapley value, Markov chains) |
| 1.4 | Cross-organizational benchmarking |
| 1.5 | Automated A/B testing framework for economic decisions |
| 2.0 | Full autonomous economic management (L4 for proven operations) |
| 2.1 | Multi-currency support with FX optimization |
| 2.2 | Industry-specific economic models |
| 2.3 | Competitive intelligence cost analysis |
| 2.4 | Supply chain economics optimization |
| 3.0 | Predictive economic governance |
| 3.1 | Self-improving economic models |
| 3.2 | Natural language economic reporting |
| 3.3 | Voice-based economic alerts and decisions |

---

**End of Volume 03F — Enterprise Economic Intelligence, FinOps & Autonomous Growth Governor**
