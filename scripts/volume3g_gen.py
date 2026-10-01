#!/usr/bin/env python3
"""Volume 3G — Enterprise Integration Contracts & Event Mesh Generator"""
import datetime, os, sys

TODAY = datetime.date.today().isoformat()
OUT = "docs/03G-enterprise-integration-contracts-event-mesh.md"
os.makedirs("docs", exist_ok=True)

sections = []

def w(text=""):
    sections.append(text)

def heading(level, text):
    w(f"\n{'#' * level} {text}\n")

def table(headers, rows):
    w("| " + " | ".join(headers) + " |")
    w("|" + "|".join(["---"] * len(headers)) + "|")
    for row in rows:
        w("| " + " | ".join(str(c) for c in row) + " |")
    w("")

def sql(code):
    w("```sql")
    w(code.strip())
    w("```\n")

def mermaid(code):
    w("```mermaid")
    w(code.strip())
    w("```\n")

def ts(code):
    w("```typescript")
    w(code.strip())
    w("```\n")

def json_schema(code):
    w("```json")
    w(code.strip())
    w("```\n")

def quote(text):
    w(f"\n> {text}\n")

def hr():
    w("\n---\n")

# ═══════════════════════════════════════════════════════
# HEADER
# ═══════════════════════════════════════════════════════
w(f"""# Volume 03G — Enterprise Integration Contracts, Event Mesh & Universal Messaging Standards

**Bell24h-OS Enterprise Architecture Document**

---

| Field | Value |
|---|---|
| **Volume** | 03G |
| **Title** | Enterprise Integration Contracts, Event Mesh & Universal Messaging Standards |
| **System** | Bell24h-OS |
| **Platform** | VyaparSethu |
| **Version** | 1.0 |
| **Date** | {TODAY} |
| **Status** | Architecture Specification — Enterprise Event Standard |
| **Lines** | 8,000+ (target) |
| **Classification** | Internal — Architecture Team |
| **Supersedes** | None — Foundational Communication Standard |
| **Authority** | This document defines the ONLY legal communication language for Bell24h-OS |

---

> **THIS BECOMES THE ENTERPRISE EVENT STANDARD.**
>
> Every module. Every service. Every AI Agent. Every Workflow. Every Economic Decision.
> Every Job. Every Campaign. Every Asset. Every Database Change. Every Notification.
> Every Automation. Every Integration — must communicate exclusively using Volume 3G standards.

---
""")

# ═══════════════════════════════════════════════════════
# TOC
# ═══════════════════════════════════════════════════════
w("""## Table of Contents

- [Part I — Enterprise Integration Philosophy](#part-i--enterprise-integration-philosophy)
- [Part II — Universal Global IDs](#part-ii--universal-global-ids)
- [Part III — Universal Event Envelope](#part-iii--universal-event-envelope)
- [Part IV — Enterprise Event Catalogue](#part-iv--enterprise-event-catalogue)
- [Part V — Command Contracts](#part-v--command-contracts)
- [Part VI — Enterprise Message Bus](#part-vi--enterprise-message-bus)
- [Part VII — Message Schemas](#part-vii--message-schemas)
- [Part VIII — Integration Contracts](#part-viii--integration-contracts)
- [Part IX — Database Architecture](#part-ix--database-architecture)
- [Part X — API Contracts](#part-x--api-contracts)
- [Part XI — Mermaid Diagrams](#part-xi--mermaid-diagrams)
- [Part XII — Architecture Decision Records](#part-xii--architecture-decision-records)
- [Part XIII — Testing & Certification](#part-xiii--testing--certification)
- [Part XIV — 50-Gate Enterprise Certification Matrix](#part-xiv--50-gate-enterprise-certification-matrix)
- [Appendix A — Complete Event Taxonomy](#appendix-a--complete-event-taxonomy)
- [Appendix B — Error Code Reference](#appendix-b--error-code-reference)
- [Appendix C — Version History](#appendix-c--version-history)
""")

hr()

# ═══════════════════════════════════════════════════════
# PART I — PHILOSOPHY
# ═══════════════════════════════════════════════════════
heading(1, "Part I — Enterprise Integration Philosophy")
hr()

w("""Every module in Bell24h-OS must communicate through the Enterprise Event Mesh defined in this volume.
Direct module-to-module function calls are forbidden for cross-module communication.
The only exception is synchronous service-layer calls within the same deployment boundary.
""")
hr()

heading(2, "1. Why Event-Driven Architecture")
w("""Bell24h-OS is a distributed AI operating system with 19+ modules, 50+ AI agents, and 2,000+ daily asset generation jobs. Synchronous point-to-point communication creates tight coupling that makes the system fragile, untestable, and impossible to scale.

**Event-driven architecture solves this by:**""")
table(
    ["Problem", "Event-Driven Solution"],
    [
        ["Module A depends on Module B's API", "Module A emits an event; Module B subscribes independently"],
        ["Cascading failures", "Events are buffered; failures are isolated"],
        ["Difficult auditing", "Every event is logged in the Event Store"],
        ["Impossible to replay", "Events can be replayed from any point"],
        ["Tight coupling", "Publishers don't know about subscribers"],
        ["Scaling bottlenecks", "Events can be processed in parallel by multiple consumers"],
    ]
)
w("""**The core principle:** Modules communicate by emitting **events** (things that happened) and subscribing to **events** they care about. They never call each other directly.
""")

heading(3, "1.1 Event-Driven vs Request-Driven")
w("""
```
REQUEST-DRIVEN (forbidden for cross-module):
  Module A → calls Module B → waits for response → continues

EVENT-DRIVEN (required for cross-module):
  Module A → emits event to Event Bus → continues immediately
  Module B ← subscribes to event ← processes independently
  Module C ← subscribes to event ← processes independently
```
""")

heading(3, "1.2 When Synchronous Calls Are Acceptable")
table(
    ["Scenario", "Pattern", "Example"],
    [
        ["Same module, same request", "Direct service call", "Image Studio calls its own repository"],
        ["Read-only data lookup", "Synchronous query", "Publishing Center queries Content Planner for metadata"],
        ["User-facing real-time", "Synchronous API", "Dashboard requests current campaign metrics"],
    ]
)
w("\n**Rule:** If Module A needs to **trigger work** in Module B, it MUST emit an event. If Module A only needs to **read data** from Module B, a synchronous query is acceptable.\n")

heading(3, "1.3 Event Bus Technology")
table(
    ["Component", "Technology", "Rationale"],
    [
        ["Primary Bus", "PostgreSQL LISTEN/NOTIFY + outbox table", "Zero additional infrastructure, transactional guarantees"],
        ["High-Throughput Streams", "BullMQ (Redis-backed)", "Job orchestration, worker queues, priority processing"],
        ["Future Scale", "Apache Kafka (when 100K+ events/day)", "Only when PostgreSQL + BullMQ become bottlenecks"],
    ]
)

hr()
heading(2, "2. CQRS — Command Query Responsibility Segregation")
w("""CQRS separates **write operations** (commands) from **read operations** (queries).""")

heading(3, "2.1 Command Side")
w("```\nUser Action → API Gateway → Command Handler → Business Logic → Event Store → Read Model Update\n```\n")
w("""Commands are:
- **Imperative** — "Create campaign", "Generate image", "Publish content"
- **Validated** — Checked against business rules before execution
- **Event-producing** — Every successful command emits one or more events
- **Idempotent** — Same command executed twice produces the same result
""")

heading(3, "2.2 Query Side")
w("```\nDashboard Request → API Gateway → Query Handler → Read Model (materialized view) → Response\n```\n")
w("""Queries are:
- **Declarative** — "Get campaign metrics", "List published content"
- **Optimized** — Read from pre-computed materialized views
- **Non-mutating** — Never change state
- **Cacheable** — Results can be cached aggressively
""")

heading(3, "2.3 CQRS in Bell24h-OS")
table(
    ["Module", "Command Side", "Query Side"],
    [
        ["Campaign Intelligence", "Create/optimize campaigns", "Dashboard metrics, reports"],
        ["Content Planner", "Generate content plans", "Content calendar view"],
        ["Publishing Center", "Schedule/publish content", "Publishing history, status"],
        ["Performance Intelligence", "Collect analytics", "Performance dashboards"],
        ["VASE", "Execute economic decisions", "Financial reports, runway"],
    ]
)

hr()
heading(2, "3. Event Sourcing")
w("""Event sourcing stores **events** as the source of truth, not current state. State is derived by replaying events.""")

heading(3, "3.1 Event Store in Bell24h-OS")
mermaid("""graph LR
    subgraph EVENT_STORE
        E1[user.created] --> E2[org.created]
        E2 --> E3[campaign.created]
        E3 --> E4[content.generated]
        E4 --> E5[content.published]
        E5 --> E6[analytics.updated]
    end
    E6 --> STATE[Current State = replay of all events]""")

heading(3, "3.2 What Is Event-Sourced vs Traditional CRUD")
table(
    ["Data", "Event-Sourced", "Traditional CRUD"],
    [
        ["Economic decisions (VASE)", "✅ Full audit trail", "—"],
        ["Campaign lifecycle", "✅ Every state change tracked", "—"],
        ["Content generation", "✅ Pipeline events logged", "—"],
        ["User preferences", "—", "✅ Simple key-value"],
        ["System configuration", "—", "✅ Simple key-value"],
        ["Static taxonomy data", "—", "✅ Rarely changes"],
    ]
)

hr()
heading(2, "4. Command Bus, Query Bus, Message Bus")
w("""#### 4.1 Command Bus\nThe Command Bus routes commands from the API layer to command handlers.\n```\nHTTP Request → API Gateway → Command Bus → Command Handler → Event Store\n```\n""")
w("""#### 4.2 Query Bus\nThe Query Bus routes queries from the API layer to query handlers.\n```\nHTTP Request → API Gateway → Query Bus → Query Handler → Read Model → Response\n```\n""")
w("""#### 4.3 Message Bus\nThe Message Bus handles all asynchronous inter-module communication.\n```\nModule A → Message Bus → Topic → Subscribers (Module B, C, VASE)\n```\n""")

hr()
heading(2, "5. Dead Letter Queue")
w("""Dead Letter Queues (DLQ) capture messages that cannot be processed after exhausting retries.\n""")
table(
    ["Condition", "Retry Limit", "DLQ Action"],
    [
        ["Processing error", "3 retries", "Move to DLQ"],
        ["Timeout", "3 timeouts", "Move to DLQ"],
        ["Validation failure", "1 attempt", "Move to DLQ (no retry)"],
        ["Schema mismatch", "1 attempt", "Move to DLQ + alert"],
        ["Consumer not found", "1 attempt", "Move to DLQ + alert"],
    ]
)

hr()
heading(2, "6. Replay & Compensation")
w("""#### 6.1 Replay\nReplay re-processes historical events to rebuild read models, debug issues, feed the Learning Engine, and migrate data.\n\n**Replay Rules:**\n- All replays are idempotent\n- Replays are recorded with `is_replay: true`\n- Replays never trigger downstream side effects\n- Replays require operator authorization\n""")
w("""#### 6.2 Compensation\nCompensation reverses the effects of a previously completed operation when a downstream step fails.\n\n**Compensation Rules:**\n- Compensation events are emitted by the orchestrating workflow\n- Compensation does not delete events — it creates negation events\n- Compensation events are clearly marked\n- Compensation requires human approval for financial operations\n""")

hr()
heading(2, "7. Saga Pattern")
w("""The Saga Pattern manages distributed transactions across multiple modules.\n""")
mermaid("""sequenceDiagram
    participant S as Saga Orchestrator
    participant C as Campaign Module
    participant CT as Content Module
    participant I as Image Module
    participant P as Publishing Module
    
    S->>C: Step 1: Create Campaign
    C-->>S: campaign.created
    S->>CT: Step 2: Generate Content
    CT-->>S: content.generated
    S->>I: Step 3: Generate Images
    I-->>S: image.generated
    S->>P: Step 4: Publish Content
    P-->>S: publishing.completed
    Note over S: All steps succeeded - Saga complete""")

hr()
heading(2, "8. Outbox Pattern")
w("""The Outbox Pattern ensures atomicity between database writes and event publication.
\n```\nWITH OUTBOX (safe):\n  1. Write to database AND outbox in same transaction\n  2. Background process polls outbox and publishes events\n  3. Delete from outbox after successful publish\n  → Event is guaranteed to be published eventually\n```\n""")

hr()
heading(2, "9. Inbox Pattern")
w("""The Inbox Pattern ensures idempotent event consumption.\n\n```\nWITH INBOX (safe):\n  1. Event delivered to Consumer\n  2. Check inbox for event_id → Not found\n  3. Process event\n  4. Store event_id in inbox\n  5. Event delivered AGAIN → Already in inbox, skip\n```\n""")

hr()
heading(2, "10. Idempotency")
table(
    ["Operation", "Idempotency Strategy"],
    [
        ["Create", "Check for existing by natural key before insert"],
        ["Update", "Apply only if state has changed (optimistic locking)"],
        ["Delete", "Idempotent by nature (deleting nothing is a no-op)"],
        ["Publish", "Deduplicate by event_id before processing"],
        ["Economic Decision", "Check decision_id in ledger before posting"],
    ]
)

hr()
heading(2, "11. Ordering Guarantees")
w("""#### 11.1 Per-Aggregate Ordering\nEvents for the same aggregate are **always processed in order**.\n\n#### 11.2 Cross-Aggregate Ordering\nEvents across different aggregates have **no ordering guarantee** — this allows parallel processing.\n""")
table(
    ["Mechanism", "Use Case"],
    [
        ["Sequence number per aggregate", "Ensures per-campaign ordering"],
        ["Partition key = aggregate_id", "Same partition = same consumer = ordered"],
        ["Causal ordering via causation_id", "Event B references event A as its cause"],
    ]
)

hr()
heading(2, "12. Correlation & Distributed Tracing")
w("""#### 12.1 Correlation ID\nA `correlation_id` ties together all events related to a single user-initiated action.\n\n#### 12.2 Causation ID\nA `causation_id` identifies the specific event that caused the current event.\n""")
ts("""interface TraceContext {
  trace_id: string
  span_id: string
  parent_span_id: string | null
  service: string
  operation: string
  start_time: string
  end_time?: string
  status: 'ok' | 'error' | 'timeout'
}""")

hr()
heading(2, "13. Eventually Consistent Systems")
table(
    ["Data Type", "Maximum Lag", "Reason"],
    [
        ["Campaign status", "5 seconds", "User expects near-real-time"],
        ["Analytics metrics", "1 hour", "Aggregated data, acceptable delay"],
        ["Content generation status", "30 seconds", "User monitoring job progress"],
        ["Economic decisions", "1 second", "Financial accuracy critical"],
        ["SEO keyword data", "24 hours", "Data changes slowly"],
        ["Industry intelligence", "7 days", "Reference data, rarely changes"],
    ]
)

hr()
hr()

# ═══════════════════════════════════════════════════════
# PART II — UNIVERSAL GLOBAL IDs
# ═══════════════════════════════════════════════════════
heading(1, "Part II — Universal Global IDs")
hr()
quote("Every entity in Bell24h-OS has a globally unique, deterministic, traceable ID. No entity may be created without a Volume 3G-compliant ID.")

heading(2, "14. UUID Strategy")
w("""Bell24h-OS uses **UUIDv7** (time-ordered) for all entity IDs.

**Why UUIDv7:**
- Time-ordered → database index-friendly (no random I/O)
- Globally unique → no coordination needed between services
- Sortable → natural chronological ordering
- Contains timestamp → can extract creation time from ID alone

**ID Format:** `{entity_prefix}_{uuidv7}` — e.g., `org_01915a6b7c8d7abc9def0123456789ab`
""")

heading(2, "15. Entity ID Registry")
table(
    ["Entity", "Prefix", "Example"],
    [
        ["Organization", "org_", "org_01915a6b7c8d..."],
        ["User", "usr_", "usr_01915a6b7c8d..."],
        ["Campaign", "cmp_", "cmp_01915a6b7c8d..."],
        ["Industry", "ind_", "ind_01915a6b7c8d..."],
        ["Category", "cat_", "cat_01915a6b7c8d..."],
        ["Persona", "prs_", "prs_01915a6b7c8d..."],
        ["Keyword", "kw_", "kw_01915a6b7c8d..."],
        ["Workflow", "wfl_", "wfl_01915a6b7c8d..."],
        ["Job", "job_", "job_01915a6b7c8d..."],
        ["Asset", "ast_", "ast_01915a6b7c8d..."],
        ["Media", "med_", "med_01915a6b7c8d..."],
        ["Video", "vid_", "vid_01915a6b7c8d..."],
        ["Image", "img_", "img_01915a6b7c8d..."],
        ["Voice", "voc_", "voc_01915a6b7c8d..."],
        ["Avatar", "ava_", "ava_01915a6b7c8d..."],
        ["Publishing", "pub_", "pub_01915a6b7c8d..."],
        ["Automation", "aut_", "aut_01915a6b7c8d..."],
        ["Provider", "pvr_", "pvr_01915a6b7c8d..."],
        ["AI Model", "mdl_", "mdl_01915a6b7c8d..."],
        ["Economic Decision", "ecm_", "ecm_01915a6b7c8d..."],
        ["Budget", "bdg_", "bdg_01915a6b7c8d..."],
        ["Ledger Entry", "led_", "led_01915a6b7c8d..."],
        ["Invoice", "inv_", "inv_01915a6b7c8d..."],
        ["Order", "ord_", "ord_01915a6b7c8d..."],
        ["RFQ", "rfq_", "rfq_01915a6b7c8d..."],
        ["Supplier", "sup_", "sup_01915a6b7c8d..."],
        ["Buyer", "buy_", "buy_01915a6b7c8d..."],
        ["Team", "tm_", "tm_01915a6b7c8d..."],
        ["Role", "rol_", "rol_01915a6b7c8d..."],
        ["API Key", "key_", "key_01915a6b7c8d..."],
        ["Webhook", "whk_", "whk_01915a6b7c8d..."],
        ["Integration", "int_", "int_01915a6b7c8d..."],
        ["Report", "rpt_", "rpt_01915a6b7c8d..."],
        ["Notification", "ntf_", "ntf_01915a6b7c8d..."],
        ["Audit Log", "aud_", "aud_01915a6b7c8d..."],
        ["File/Upload", "fil_", "fil_01915a6b7c8d..."],
        ["Content", "cnt_", "cnt_01915a6b7c8d..."],
        ["Blog Post", "blg_", "blg_01915a6b7c8d..."],
        ["Social Post", "spt_", "spt_01915a6b7c8d..."],
        ["Email Campaign", "emc_", "emc_01915a6b7c8d..."],
        ["Landing Page", "lpg_", "lpg_01915a6b7c8d..."],
        ["Tag", "tag_", "tag_01915a6b7c8d..."],
        ["Metric", "met_", "met_01915a6b7c8d..."],
        ["Event", "evt_", "evt_01915a6b7c8d..."],
        ["Command", "cmd_", "cmd_01915a6b7c8d..."],
        ["Correlation", "corr_", "corr_01915a6b7c8d..."],
        ["Trace", "trc_", "trc_01915a6b7c8d..."],
        ["Schedule", "sch_", "sch_01915a6b7c8d..."],
        ["Template", "tpl_", "tpl_01915a6b7c8d..."],
        ["Brand Kit", "brk_", "brk_01915a6b7c8d..."],
        ["Product", "prd_", "prd_01915a6b7c8d..."],
        ["Geography", "geo_", "geo_01915a6b7c8d..."],
        ["Experiment", "exp_", "exp_01915a6b7c8d..."],
        ["Recommendation", "rec_", "rec_01915a6b7c8d..."],
        ["Knowledge Node", "kno_", "kno_01915a6b7c8d..."],
        ["Memory Entry", "mem_", "mem_01915a6b7c8d..."],
        ["Cost Record", "csr_", "csr_01915a6b7c8d..."],
        ["Budget Rule", "bgr_", "bgr_01915a6b7c8d..."],
        ["Treasury Balance", "trb_", "trb_01915a6b7c8d..."],
        ["Kill Switch", "ks_", "ks_01915a6b7c8d..."],
        ["Incident", "inc_", "inc_01915a6b7c8d..."],
        ["Reconciliation", "rcn_", "rcn_01915a6b7c8d..."],
        ["Simulation", "sim_", "sim_01915a6b7c8d..."],
        ["Circuit Breaker", "cb_", "cb_01915a6b7c8d..."],
        ["Feature Flag", "ff_", "ff_01915a6b7c8d..."],
        ["Health Check", "hc_", "hc_01915a6b7c8d..."],
    ]
)

heading(2, "16. ID Generation Rules")
table(
    ["Rule", "Description"],
    [
        ["Server-side only", "IDs are always generated on the server, never in the client"],
        ["Single generator", "Use `integration.generate_id(prefix)` for all ID generation"],
        ["No sequential IDs", "Never use auto-increment for business entities"],
        ["No user-supplied IDs", "Never trust client-provided IDs for entity creation"],
    ]
)

heading(2, "17. Cross-Reference Mapping")
table(
    ["External System", "ID Format", "Mapping"],
    [
        ["VyaparSethu.com", "vs_{uuid}", "Maps to org_, prd_, ord_"],
        ["WhatsApp Business", "Phone number", "Maps to buy_, sup_"],
        ["Google Analytics", "Property ID", "Maps to cmp_, cnt_"],
        ["Social Platforms", "Platform-specific", "Maps to spt_, pub_"],
        ["Payment Gateways", "Transaction ID", "Maps to ord_, inv_"],
    ]
)

hr()
hr()

# ═══════════════════════════════════════════════════════
# PART III — UNIVERSAL EVENT ENVELOPE
# ═══════════════════════════════════════════════════════
heading(1, "Part III — Universal Event Envelope")
hr()
quote("Every event in Bell24h-OS MUST contain this exact envelope structure. No exceptions.")

heading(2, "18. Envelope Schema")
json_schema("""{
  "event_id": "evt_01915a6b7c8d7abc9def0123456789ab",
  "event_version": "1.0",
  "event_name": "campaign.created",
  "event_type": "domain",
  "event_category": "campaign",
  "event_action": "created",
  "organization_id": "org_01915a6b7c8d7abc9def0123456789ab",
  "correlation_id": "corr_01915a6b7c8d7abc9def0123456789ab",
  "causation_id": null,
  "workflow_id": null,
  "job_id": null,
  "campaign_id": "cmp_01915a6b7c8d7abc9def0123456789ab",
  "asset_id": null,
  "actor": {
    "type": "user",
    "id": "usr_01915a6b7c8d7abc9def0123456789ab",
    "name": "Rajesh Kumar"
  },
  "timestamp": "2026-07-18T10:30:00.000Z",
  "schema_version": "1.0",
  "payload": {
    "campaign_id": "cmp_01915a6b7c8d7abc9def0123456789ab",
    "name": "Monsoon Textiles Campaign",
    "objective": "lead_generation",
    "budget": 50000.00,
    "currency": "INR"
  },
  "metadata": {
    "source": "campaign-intelligence",
    "version": "2.1.0",
    "trace_id": "trc_01915a6b7c8d7abc9def0123456789ab",
    "environment": "production",
    "region": "ap-south-1"
  },
  "signature": null,
  "trace_context": {
    "trace_id": "trc_01915a6b7c8d7abc9def0123456789ab",
    "span_id": "span_001",
    "parent_span_id": null,
    "service": "campaign-intelligence",
    "operation": "create-campaign"
  }
}""")

heading(2, "19. Field Definitions")
heading(3, "19.1 Header Fields")
table(
    ["Field", "Type", "Required", "Description"],
    [
        ["event_id", "UUIDv7 string", "✅", "Globally unique event identifier"],
        ["event_version", "SemVer string", "✅", "Event schema version"],
        ["event_name", "string", "✅", "Dot-notated name (e.g., campaign.created)"],
        ["event_type", "enum", "✅", "domain | integration | system | notification | error"],
        ["event_category", "string", "✅", "Module category"],
        ["event_action", "string", "✅", "Action performed"],
    ]
)

heading(3, "19.2 Context Fields")
table(
    ["Field", "Type", "Required", "Description"],
    [
        ["organization_id", "UUID string", "✅", "Owning organization (multi-tenant scope)"],
        ["correlation_id", "UUID string", "✅", "Groups events from a single user action"],
        ["causation_id", "UUID string", "❌", "The event that caused this event"],
        ["workflow_id", "UUID string", "❌", "Workflow this event belongs to"],
        ["job_id", "UUID string", "❌", "Job this event belongs to"],
        ["campaign_id", "UUID string", "❌", "Campaign this event relates to"],
        ["asset_id", "UUID string", "❌", "Asset this event relates to"],
    ]
)

heading(3, "19.3 Actor Field")
table(
    ["Field", "Type", "Required", "Description"],
    [
        ["actor.type", "enum", "✅", "user | system | agent | scheduler | webhook"],
        ["actor.id", "UUID string", "✅", "ID of the actor"],
        ["actor.name", "string", "❌", "Human-readable name"],
    ]
)

heading(2, "20. Envelope Validation")
table(
    ["Rule", "Severity", "Description"],
    [
        ["event_id is valid UUIDv7", "ERROR", "Event rejected"],
        ["event_name matches {category}.{action}", "ERROR", "Event rejected"],
        ["organization_id is valid UUID", "ERROR", "Event rejected"],
        ["timestamp is valid ISO 8601", "ERROR", "Event rejected"],
        ["timestamp is not in the future", "WARN", "Event accepted with warning"],
        ["payload matches registered schema", "ERROR", "Event rejected"],
        ["actor.type is valid enum", "ERROR", "Event rejected"],
    ]
)

heading(2, "21. Envelope Examples")
heading(3, "21.1 Domain Event (Content Generated)")
json_schema("""{
  "event_id": "evt_01915a6b7c8d7abc9def0123456789ab",
  "event_version": "1.0",
  "event_name": "content.generated",
  "event_type": "domain",
  "event_category": "content",
  "event_action": "generated",
  "organization_id": "org_abc123",
  "correlation_id": "corr_xyz789",
  "causation_id": "evt_prev001",
  "workflow_id": "wfl_wf001",
  "job_id": "job_j001",
  "campaign_id": "cmp_c001",
  "actor": { "type": "agent", "id": "agent_content_001", "name": "Content Agent" },
  "timestamp": "2026-07-18T10:30:00.000Z",
  "schema_version": "1.0",
  "payload": {
    "content_id": "cnt_content001",
    "content_type": "blog_post",
    "title": "Monsoon Season Textile Trends 2026",
    "language": "en",
    "word_count": 1500,
    "ai_provider": "anthropic",
    "ai_model": "claude-3.5-sonnet",
    "tokens_used": 2500,
    "cost_usd": 0.0375
  },
  "metadata": { "source": "content-planner", "version": "3.2.0", "environment": "production" }
}""")

heading(3, "21.2 Error Event (Provider Failure)")
json_schema("""{
  "event_id": "evt_error_001",
  "event_version": "1.0",
  "event_name": "provider.failed",
  "event_type": "error",
  "event_category": "provider",
  "event_action": "failed",
  "organization_id": "org_abc123",
  "correlation_id": "corr_img_gen_001",
  "causation_id": "evt_image_request_001",
  "actor": { "type": "system", "id": "ai_provider_gateway", "name": "AI Provider Gateway" },
  "timestamp": "2026-07-18T10:31:00.000Z",
  "schema_version": "1.0",
  "payload": {
    "provider": "openai",
    "model": "dall-e-3",
    "error_code": "AI_PROVIDER_RATE_LIMITED",
    "error_message": "Rate limit exceeded",
    "http_status": 429,
    "retry_after_seconds": 60,
    "fallback_provider": "stability-ai",
    "fallback_model": "sdxl"
  },
  "metadata": { "source": "ai-provider-gateway", "version": "2.0.0", "environment": "production" }
}""")

hr()
hr()