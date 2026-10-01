#!/usr/bin/env python3
"""Volume 3G Expansion — Additional content to reach 8,000+ lines"""

import datetime
TODAY = datetime.date.today().isoformat()

def expand():
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def sql(code):
        w("```sql"); w(code.strip()); w("```\n")
    def ts(code):
        w("```typescript"); w(code.strip()); w("```\n")
    def mermaid(code):
        w("```mermaid"); w(code.strip()); w("```\n")
    def json_schema(code):
        w("```json"); w(code.strip()); w("```\n")
    def hr(): w("\n---\n")
    def quote(text): w(f"\n> {text}\n")

    # ═══════════════════════════════════════════════════════
    # EXPANDED PART I — Detailed Philosophy
    # ═══════════════════════════════════════════════════════
    heading(1, "Part I — Enterprise Integration Philosophy (Expanded)")
    hr()

    heading(2, "A. Event-Driven Architecture Deep Dive")

    heading(3, "A.1 Why Events Over Direct Calls")
    w("""In a monolithic application, modules communicate through direct function calls. This works well when:
- The system is small (under 5 modules)
- All code lives in a single deployment
- There's a single database
- Team size is small (under 5 developers)

Bell24h-OS violates ALL of these assumptions. With 19+ modules, multiple deployment units, a shared database, and a growing team, direct calls create a web of dependencies that becomes impossible to maintain.

**The Hidden Cost of Direct Calls:**

Every direct call between modules creates:
1. **Compile-time coupling** — Module A must know Module B's interface
2. **Runtime coupling** — Module B must be available for Module A to function
3. **Testing coupling** — Testing Module A requires mocking Module B
4. **Deployment coupling** — Changing Module B may break Module A
5. **Scaling coupling** — Module A and B must scale together

**The Event-Driven Alternative:**

When Module A emits an event:
1. **No compile-time coupling** — Module A only knows the event schema
2. **No runtime coupling** — Events are buffered; Module B can process later
3. **No testing coupling** — Module A can be tested independently
4. **No deployment coupling** — Module B can deploy independently
5. **No scaling coupling** — Each module scales based on its own load

**Real-World Example: Campaign Creation**

```
DIRECT CALL MODEL (forbidden):
  CampaignIntel.createCampaign(data)
    → ContentPlanner.generateContent(campaignId)
      → ImageStudio.generateImages(contentId)
        → PublishingCenter.schedulePublish(pipelineId)
          → VASE.checkBudget(campaignId)
          → Analytics.trackEvent('campaign_created')

  Total: 5 synchronous calls
  Failure modes: 5 points of failure
  Total latency: sum of all call latencies
  Coupling: Campaign depends on Content, Image, Publishing, VASE, Analytics

EVENT-DRIVEN MODEL (required):
  CampaignIntel.emit('campaign.created', data)
  → EventBus routes to subscribers
  → ContentPlanner processes independently
  → ImageStudio processes independently  
  → PublishingCenter processes independently
  → VASE processes independently
  → Analytics processes independently

  Total: 1 event emission
  Failure modes: isolated per subscriber
  Total latency: just the emit time
  Coupling: Campaign knows only the event schema
```

**The Math of Failure Isolation:**

With N modules and direct calls:
- Possible failure paths: N × (N-1) / 2
- For 19 modules: 171 possible failure paths

With event-driven architecture:
- Possible failure paths: N (one per subscriber)
- For 19 modules: 19 possible failure paths

That's a **9x reduction** in failure surface area.
""")

    heading(3, "A.2 Event Types in Bell24h-OS")
    w("""Bell24h-OS uses five distinct event types, each serving a specific purpose:

| Event Type | Purpose | Example | Processing |
|---|---|---|---|
| `domain` | Business state changes | `campaign.created`, `content.published` | Asynchronous, at-least-once |
| `integration` | External system interactions | `webhook.delivered`, `api.called` | Asynchronous, best-effort |
| `system` | Infrastructure events | `service.started`, `health.check` | Synchronous, exactly-once |
| `notification` | User notifications | `alert.triggered`, `message.sent` | Asynchronous, at-most-once |
| `error` | Failure events | `provider.failed`, `job.timeout` | Asynchronous, at-least-once |

**Domain Events** are the most common. They represent something meaningful happening in the business domain. Every domain event must:
1. Be idempotent (processing twice = same result)
2. Be immutable (never modified after creation)
3. Be ordered within an aggregate (per-campaign ordering)
4. Carry full context (no lazy loading from database)

**Integration Events** track interactions with external systems. They help with:
1. Debugging external API issues
2. Rate limit tracking
3. Cost attribution
4. Compliance auditing

**System Events** are infrastructure-level. They help with:
1. Monitoring system health
2. Detecting anomalies
3. Capacity planning
4. Incident response

**Notification Events** trigger user-facing messages. They support:
1. Multi-channel delivery (email, Slack, WhatsApp, in-app)
2. Severity-based routing
3. Deduplication
4. Escalation chains

**Error Events** capture failures. They enable:
1. Automatic retry decisions
2. Circuit breaker state management
3. Cost tracking for failed operations
4. Root cause analysis

**Event Type Processing Rules:**

```
domain events:
  - Always stored in Event Store
  - Always published to EventBus
  - Processed asynchronously
  - Retried with exponential backoff
  - Dead-lettered after max retries

integration events:
  - Stored in Event Store
  - Published to EventBus
  - Processed asynchronously
  - Best-effort delivery
  - Logged but not dead-lettered

system events:
  - Stored in Event Store
  - Published to EventBus
  - Processed synchronously for health checks
  - Never dead-lettered (system events are always valid)

notification events:
  - Stored in Event Store
  - Published to EventBus
  - Processed asynchronously
  - Deduplicated by (notification_type, organization_id, recipient)
  - Expired after TTL

error events:
  - Stored in Event Store
  - Published to EventBus
  - Processed asynchronously
  - Always retried at least once
  - Dead-lettered for manual review
```
""")

    heading(3, "A.3 Event Ordering Guarantees — Detailed")
    w("""**Per-Aggregate Ordering:**

Events for the same aggregate (e.g., the same campaign) are guaranteed to be processed in the order they were created. This is achieved through:

1. **Sequence numbers** — Each event for an aggregate gets a monotonically increasing sequence number
2. **Partition keys** — Events for the same aggregate go to the same partition
3. **Single-threaded consumers** — Each partition is consumed by exactly one thread

```
Campaign cmp_001:
  event_001: campaign.created     (seq: 1)
  event_002: campaign.updated     (seq: 2)
  event_003: campaign.started     (seq: 3)
  event_004: campaign.completed   (seq: 4)

Guaranteed order: 001 → 002 → 003 → 004
```

**Cross-Aggregate Ordering:**

Events across different aggregates have NO ordering guarantee. This is intentional — it enables parallel processing.

```
Campaign cmp_001:                    Campaign cmp_002:
  event_001: campaign.created         event_010: campaign.created
  event_002: campaign.started         event_011: campaign.started

Possible processing orders:
  001 → 002 → 010 → 011
  001 → 010 → 002 → 011
  010 → 001 → 011 → 002
  010 → 011 → 001 → 002
  ... (any interleaving is valid)
```

**Causal Ordering:**

When event B is caused by event A, the `causation_id` field links them. This enables:
1. Understanding the chain of events
2. Debugging complex workflows
3. Replaying event chains correctly

```
campaign.created (evt_001)
  → content.generated (evt_002, causation_id: evt_001)
    → content.published (evt_003, causation_id: evt_002)
      → analytics.tracked (evt_004, causation_id: evt_003)

Causal chain: 001 → 002 → 003 → 004
```

**Temporal Ordering:**

All events carry a timestamp. While timestamps are not guaranteed to be perfectly ordered across distributed systems (clock skew), they provide:
1. Approximate ordering for debugging
2. Time-range queries
3. Retention policy enforcement
4. SLA monitoring

**Ordering Failure Handling:**

When ordering is violated (e.g., due to a bug or system failure):
1. The out-of-order event is logged with a warning
2. The event is still processed (eventual consistency)
3. An alert is raised for investigation
4. The affected read model is flagged for potential rebuild
""")

    heading(2, "B. CQRS Implementation Details")

    heading(3, "B.1 Command Side Implementation")
    ts("""// Command Handler Example
class CreateCampaignHandler {
  async handle(command: CreateCampaignCommand): Promise<void> {
    // 1. Validate command
    this.validate(command)

    // 2. Check idempotency
    const existing = await this.findByIdempotencyKey(command.idempotency_key)
    if (existing) return // Already processed

    // 3. Execute business logic
    const campaign = await this.campaignRepository.create({
      name: command.payload.name,
      objective: command.payload.objective,
      budget: command.payload.budget,
      organization_id: command.organization_id,
    })

    // 4. Emit event
    await this.eventBus.publish({
      event_id: generateId('evt'),
      event_name: 'campaign.created',
      event_type: 'domain',
      event_category: 'campaign',
      event_action: 'created',
      organization_id: command.organization_id,
      correlation_id: command.correlation_id,
      actor: command.actor,
      timestamp: new Date().toISOString(),
      payload: { campaign_id: campaign.id, ...campaign },
      metadata: { source: 'campaign-intelligence', version: '2.1.0' },
    })

    // 5. Record command completion
    await this.commandLog.record(command.command_id, 'completed')
  }
}""")

    heading(3, "B.2 Query Side Implementation")
    ts("""// Query Handler Example
class GetCampaignMetricsHandler {
  async handle(query: GetCampaignMetricsQuery): Promise<CampaignMetrics> {
    // 1. Check cache
    const cached = await this.cache.get(`metrics:${query.campaign_id}`)
    if (cached && this.isCacheFresh(cached)) {
      return cached.data
    }

    // 2. Read from materialized view (pre-computed from events)
    const metrics = await this.db.query(`
      SELECT 
        campaign_id,
        content_count,
        published_count,
        total_impressions,
        total_clicks,
        total_conversions,
        total_spend,
        ctr,
        conversion_rate,
        cost_per_click,
        cost_per_conversion,
        last_updated
      FROM analytics.campaign_metrics
      WHERE campaign_id = $1
    `, [query.campaign_id])

    // 3. Cache result
    await this.cache.set(`metrics:${query.campaign_id}`, {
      data: metrics,
      cached_at: Date.now(),
    }, 300) // 5 minute TTL

    return metrics
  }
}""")

    heading(3, "B.3 Read Model Update Pattern")
    ts("""// Event Consumer → Read Model Updater
class CampaignMetricsUpdater {
  // Subscribe to relevant events
  handles = [
    'campaign.created',
    'content.generated',
    'content.published',
    'analytics.impression',
    'analytics.click',
    'analytics.conversion',
    'economic.cost_recorded',
  ]

  async handle(event: Bell24hEvent): Promise<void> {
    const campaignId = event.payload.campaign_id
    
    // Incremental update based on event type
    switch (event.event_name) {
      case 'content.generated':
        await this.db.query(`
          UPDATE analytics.campaign_metrics 
          SET content_count = content_count + 1, last_updated = NOW()
          WHERE campaign_id = $1
        `, [campaignId])
        break

      case 'content.published':
        await this.db.query(`
          UPDATE analytics.campaign_metrics 
          SET published_count = published_count + 1, last_updated = NOW()
          WHERE campaign_id = $1
        `, [campaignId])
        break

      case 'analytics.impression':
        await this.db.query(`
          UPDATE analytics.campaign_metrics 
          SET total_impressions = total_impressions + $2, last_updated = NOW()
          WHERE campaign_id = $1
        `, [campaignId, event.payload.count || 1])
        break

      case 'economic.cost_recorded':
        await this.db.query(`
          UPDATE analytics.campaign_metrics 
          SET total_spend = total_spend + $2, last_updated = NOW()
          WHERE campaign_id = $1
        `, [campaignId, event.payload.cost_inr || 0])
        break
    }
  }
}""")

    hr()

    # ═══════════════════════════════════════════════════════
    # EXPANDED PART IV — Detailed Event Catalogue
    # ═══════════════════════════════════════════════════════
    heading(1, "Part IV — Event Catalogue (Expanded)")
    hr()

    heading(2, "Event Payload Specifications")

    heading(3, "Campaign Event Payloads")
    ts("""// campaign.created payload
interface CampaignCreatedPayload {
  campaign_id: string
  name: string
  objective: 'lead_generation' | 'brand_awareness' | 'engagement' | 'conversions'
  industry_id: string
  category_id?: string
  budget: number
  currency: 'INR' | 'USD'
  start_date?: string
  end_date?: string
  target_audience?: {
    demographics: string[]
    geographies: string[]
    interests: string[]
  }
  channels: ('google_ads' | 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'whatsapp')[]
  created_by: string
}

// campaign.started payload
interface CampaignStartedPayload {
  campaign_id: string
  started_by: string
  initial_budget_allocation: number
  scheduled_posts: number
  channels_enabled: string[]
}

// campaign.completed payload
interface CampaignCompletedPayload {
  campaign_id: string
  completed_reason: 'end_date_reached' | 'budget_exhausted' | 'manual' | 'goal_achieved'
  final_metrics: {
    total_impressions: number
    total_clicks: number
    total_conversions: number
    total_spend: number
    conversion_rate: number
    cost_per_conversion: number
  }
  duration_days: number
}

// campaign.budget_exceeded payload
interface CampaignBudgetExceededPayload {
  campaign_id: string
  budget_limit: number
  current_spend: number
  overspend_amount: number
  overspend_percentage: number
  action_taken: 'paused' | 'alerted' | 'continued'
  alert_sent_to: string[]
}""")

    heading(3, "Content Event Payloads")
    ts("""// content.requested payload
interface ContentRequestedPayload {
  content_type: 'blog_post' | 'social_post' | 'email' | 'ad_copy' | 'product_description' | 'landing_page'
  campaign_id?: string
  industry_id: string
  category_id?: string
  target_persona?: string
  target_keywords?: string[]
  language: string
  tone: 'professional' | 'casual' | 'technical' | 'persuasive'
  word_count_target?: number
  reference_urls?: string[]
}

// content.generated payload
interface ContentGeneratedPayload {
  content_id: string
  content_type: string
  title: string
  summary?: string
  language: string
  word_count: number
  ai_provider: string
  ai_model: string
  tokens_used: number
  cost_usd: number
  quality_score?: number
  seo_score?: number
  readability_score?: number
}

// content.published payload
interface ContentPublishedPayload {
  content_id: string
  platform: string
  platform_post_id?: string
  url?: string
  published_at: string
  scheduled: boolean
  campaign_id?: string
  reach_estimate?: number
}""")

    heading(3, "Image Event Payloads")
    ts("""// image.generated payload
interface ImageGeneratedPayload {
  image_id: string
  prompt: string
  negative_prompt?: string
  ai_provider: string
  ai_model: string
  width: number
  height: number
  file_size_bytes: number
  file_url: string
  thumbnail_url?: string
  style?: string
  seed?: number
  cost_usd: number
  generation_time_ms: number
}

// image.processed payload
interface ImageProcessedPayload {
  image_id: string
  operations: Array<{
    type: 'resize' | 'crop' | 'watermark' | 'qr_overlay' | 'style_transfer'
    parameters: Record<string, unknown>
    result_url: string
  }>
  final_url: string
  final_size_bytes: number
}""")

    heading(3, "Video Event Payloads")
    ts("""// video.generated payload
interface VideoGeneratedPayload {
  video_id: string
  title: string
  script_id?: string
  storyboard_id?: string
  duration_seconds: number
  resolution: '720p' | '1080p' | '4k'
  format: 'mp4' | 'webm' | 'mov'
  file_size_bytes: number
  file_url: string
  thumbnail_url?: string
  ai_provider: string
  ai_model: string
  cost_usd: number
  generation_time_ms: number
  has_voiceover: boolean
  has_subtitles: boolean
}""")

    heading(3, "Voice Event Payloads")
    ts("""// voice.generated payload
interface VoiceGeneratedPayload {
  voice_id: string
  text: string
  voice_name: string
  language: string
  speed: number
  pitch: number
  format: 'mp3' | 'wav' | 'ogg'
  duration_seconds: number
  file_size_bytes: number
  file_url: string
  ai_provider: string
  ai_model: string
  cost_usd: number
  generation_time_ms: number
}

// audio.transcribed payload
interface AudioTranscribedPayload {
  audio_id: string
  transcription: string
  language: string
  confidence: number
  duration_seconds: number
  word_count: number
  segments: Array<{
    start: number
    end: number
    text: string
    confidence: number
  }>
  ai_provider: string
  cost_usd: number
}""")

    heading(3, "VASE Economic Event Payloads")
    ts("""// economic.decision_submitted payload
interface EconomicDecisionSubmittedPayload {
  decision_id: string
  decision_type: 'spending' | 'budget_allocation' | 'cost_optimization' | 'pricing'
  amount: number
  currency: 'INR' | 'USD'
  justification: string
  requested_by: string
  approval_required: boolean
  approval_chain: string[]
  expires_at?: string
}

// economic.decision_executed payload
interface EconomicDecisionExecutedPayload {
  decision_id: string
  approved_by: string
  executed_at: string
  actual_amount: number
  currency: string
  ledger_entry_id: string
  remaining_budget: number
  budget_utilization_percent: number
}

// economic.cost_anomaly_detected payload
interface CostAnomalyDetectedPayload {
  anomaly_id: string
  service: string
  provider: string
  expected_cost: number
  actual_cost: number
  deviation_percent: number
  deviation_sigma: number
  time_window: string
  alert_level: 'warning' | 'critical'
  recommended_action: string
}

// economic.runway_warning payload
interface RunwayWarningPayload {
  warning_id: string
  current_balance: number
  daily_burn_rate: number
  runway_days: number
  threshold_days: number
  alert_level: 'warning' | 'critical' | 'emergency'
  recommended_actions: string[]
  budget_categories_affected: string[]
}""")

    heading(3, "Provider Event Payloads")
    ts("""// provider.requested payload
interface ProviderRequestedPayload {
  request_id: string
  provider: string
  model: string
  operation: 'text_generation' | 'image_generation' | 'video_generation' | 'voice_generation' | 'embedding'
  input_tokens?: number
  estimated_cost_usd: number
  priority: 'low' | 'normal' | 'high' | 'critical'
}

// provider.responded payload
interface ProviderRespondedPayload {
  request_id: string
  provider: string
  model: string
  status: 'success' | 'partial' | 'error'
  output_tokens?: number
  actual_cost_usd: number
  latency_ms: number
  cache_hit: boolean
}

// provider.failed payload
interface ProviderFailedPayload {
  request_id: string
  provider: string
  model: string
  error_code: string
  error_message: string
  http_status: number
  retry_after_seconds?: number
  fallback_provider?: string
  fallback_model?: string
  attempt_number: number
  max_attempts: number
}

// provider.fallback payload
interface ProviderFallbackPayload {
  request_id: string
  from_provider: string
  from_model: string
  to_provider: string
  to_model: string
  reason: string
  estimated_cost_delta: number
}""")

    hr()

    # ═══════════════════════════════════════════════════════
    # EXPANDED PART IX — More Database Details
    # ═══════════════════════════════════════════════════════
    heading(1, "Part IX — Database Architecture (Expanded)")
    hr()

    heading(2, "Additional Table Definitions")

    heading(3, "99.1 integration.webhook_registrations")
    sql("""CREATE TABLE integration.webhook_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id TEXT UNIQUE NOT NULL,
    organization_id TEXT NOT NULL,
    webhook_name TEXT NOT NULL,
    target_url TEXT NOT NULL,
    secret_key TEXT NOT NULL,
    events TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    failure_count INTEGER NOT NULL DEFAULT 0,
    max_failures INTEGER NOT NULL DEFAULT 10,
    last_triggered_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    last_failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "99.2 integration.webhook_deliveries")
    sql("""CREATE TABLE integration.webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id TEXT NOT NULL REFERENCES integration.webhook_registrations(webhook_id),
    event_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','delivered','failed','retrying')),
    http_status_code INTEGER,
    response_body TEXT,
    error_message TEXT,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "99.3 integration.feature_flags")
    sql("""CREATE TABLE integration.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    allowed_organizations TEXT[],
    percentage_rollout NUMERIC(5,2) DEFAULT 100.00,
    default_value JSONB DEFAULT 'true',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "99.4 integration.rate_limits")
    sql("""CREATE TABLE integration.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    identifier_type TEXT NOT NULL CHECK (identifier_type IN ('organization','user','api_key','ip')),
    endpoint_pattern TEXT NOT NULL,
    max_requests INTEGER NOT NULL,
    window_seconds INTEGER NOT NULL,
    current_count INTEGER NOT NULL DEFAULT 0,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (identifier, identifier_type, endpoint_pattern)
);""")

    heading(3, "99.5 integration.scheduled_tasks")
    sql("""CREATE TABLE integration.scheduled_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name TEXT NOT NULL,
    task_type TEXT NOT NULL CHECK (task_type IN ('cron','interval','one_time')),
    cron_expression TEXT,
    interval_seconds INTEGER,
    scheduled_at TIMESTAMPTZ,
    payload JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    run_count INTEGER NOT NULL DEFAULT 0,
    last_run_status TEXT CHECK (last_run_status IN ('success','failed','running')),
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "99.6 integration.deployment_history")
    sql("""CREATE TABLE integration.deployment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id TEXT UNIQUE NOT NULL,
    service_name TEXT NOT NULL,
    version TEXT NOT NULL,
    environment TEXT NOT NULL CHECK (environment IN ('development','staging','production')),
    deployed_by TEXT NOT NULL,
    deployment_type TEXT NOT NULL CHECK (deployment_type IN ('full','rolling','canary','blue_green')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','failed','rolled_back')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    rollback_at TIMESTAMPTZ,
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);""")

    heading(3, "99.7 integration.incident_reports")
    sql("""CREATE TABLE integration.incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','investigating','identified','monitoring','resolved')),
    affected_services TEXT[] NOT NULL,
    root_cause TEXT,
    resolution TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detected_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    reported_by TEXT NOT NULL,
    assigned_to TEXT,
    impact_summary JSONB DEFAULT '{}'
);""")

    heading(3, "99.8 integration.api_keys")
    sql("""CREATE TABLE integration.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_id TEXT UNIQUE NOT NULL,
    key_hash TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    rate_limit_tier TEXT DEFAULT 'free',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);""")

    heading(3, "99.9 integration.email_templates")
    sql("""CREATE TABLE integration.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    text_body TEXT,
    variables TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL DEFAULT 'notification',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "99.10 integration.push_notifications")
    sql("""CREATE TABLE integration.push_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id TEXT UNIQUE NOT NULL,
    organization_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    platform TEXT NOT NULL CHECK (platform IN ('web','ios','android')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','delivered','failed','read')),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(2, "Additional Indexes")
    sql("""-- Webhook indexes
CREATE INDEX idx_webhook_reg_org ON integration.webhook_registrations(organization_id, is_active);
CREATE INDEX idx_webhook_reg_events ON integration.webhook_registrations USING GIN(events);
CREATE INDEX idx_webhook_del_status ON integration.webhook_deliveries(status, created_at);
CREATE INDEX idx_webhook_del_webhook ON integration.webhook_deliveries(webhook_id, status);

-- Feature flag indexes
CREATE INDEX idx_ff_name ON integration.feature_flags(flag_name, is_enabled);
CREATE INDEX idx_ff_orgs ON integration.feature_flags USING GIN(allowed_organizations);

-- Rate limit indexes
CREATE INDEX idx_rl_identifier ON integration.rate_limits(identifier, endpoint_pattern);
CREATE INDEX idx_rl_window ON integration.rate_limits(window_start);

-- Scheduled task indexes
CREATE INDEX idx_task_next_run ON integration.scheduled_tasks(next_run_at, is_active);
CREATE INDEX idx_task_type ON integration.scheduled_tasks(task_type, is_active);

-- Deployment indexes
CREATE INDEX idx_deploy_service ON integration.deployment_history(service_name, started_at DESC);
CREATE INDEX idx_deploy_env ON integration.deployment_history(environment, started_at DESC);

-- Incident indexes
CREATE INDEX idx_incident_status ON integration.incident_reports(status, severity);
CREATE INDEX idx_incident_services ON integration.incident_reports USING GIN(affected_services);

-- API key indexes
CREATE INDEX idx_apikey_org ON integration.api_keys(organization_id, is_active);
CREATE INDEX idx_apikey_hash ON integration.api_keys(key_hash);

-- Email template indexes
CREATE INDEX idx_email_tmpl_name ON integration.email_templates(template_name, is_active);

-- Push notification indexes
CREATE INDEX idx_push_user ON integration.push_notifications(user_id, status);
CREATE INDEX idx_push_org ON integration.push_notifications(organization_id, created_at DESC);""")

    heading(2, "Additional RLS Policies")
    sql("""-- Webhook RLS
CREATE POLICY webhook_tenant_isolation ON integration.webhook_registrations
    FOR SELECT USING (organization_id = current_setting('app.current_org_id'));
CREATE POLICY webhook_tenant_insert ON integration.webhook_registrations
    FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id'));
CREATE POLICY webhook_tenant_update ON integration.webhook_registrations
    FOR UPDATE USING (organization_id = current_setting('app.current_org_id'));
CREATE POLICY webhook_tenant_delete ON integration.webhook_registrations
    FOR DELETE USING (organization_id = current_setting('app.current_org_id'));

-- Webhook delivery RLS
CREATE POLICY webhook_del_tenant ON integration.webhook_deliveries
    FOR SELECT USING (webhook_id IN (
        SELECT webhook_id FROM integration.webhook_registrations
        WHERE organization_id = current_setting('app.current_org_id')
    ));

-- API key RLS
CREATE POLICY apikey_tenant_isolation ON integration.api_keys
    FOR SELECT USING (organization_id = current_setting('app.current_org_id'));
CREATE POLICY apikey_tenant_insert ON integration.api_keys
    FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id'));

-- Push notification RLS
CREATE POLICY push_tenant_isolation ON integration.push_notifications
    FOR SELECT USING (organization_id = current_setting('app.current_org_id'));
CREATE POLICY push_tenant_insert ON integration.push_notifications
    FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id'));

-- Scheduled task RLS (tasks are global)
CREATE POLICY task_global_select ON integration.scheduled_tasks FOR SELECT USING (TRUE);

-- Feature flag RLS (flags are global)
CREATE POLICY ff_global_select ON integration.feature_flags FOR SELECT USING (TRUE);

-- Rate limit RLS
CREATE POLICY rl_global_select ON integration.rate_limits FOR SELECT USING (TRUE);

-- Incident RLS
CREATE POLICY incident_tenant ON integration.incident_reports
    FOR SELECT USING (affected_services && ARRAY(
        SELECT service_name FROM integration.contracts
        WHERE service_name = ANY(affected_services)
    ));""")

    heading(2, "Advanced Stored Procedures")

    sql("""-- Process outbox events (called by background worker)
CREATE OR REPLACE FUNCTION integration.process_outbox_events(
    p_batch_size INTEGER DEFAULT 100
)
RETURNS TABLE(event_id TEXT, event_name TEXT, topic_name TEXT, payload JSONB) AS $$
BEGIN
    RETURN QUERY
    WITH batch AS (
        SELECT oe.id, oe.event_id, oe.event_name, oe.topic_name, oe.payload
        FROM integration.event_outbox oe
        WHERE oe.published = FALSE
        ORDER BY oe.created_at ASC
        LIMIT p_batch_size
        FOR UPDATE SKIP LOCKED
    )
    UPDATE integration.event_outbox oe
    SET published = TRUE, published_at = NOW(), attempts = attempts + 1
    FROM batch b
    WHERE oe.id = b.id
    RETURNING b.event_id, b.event_name, b.topic_name, b.payload;
END;
$$ LANGUAGE plpgsql;

-- Calculate consumer lag
CREATE OR REPLACE FUNCTION integration.calculate_consumer_lag(
    p_subscriber_id UUID
)
RETURNS TABLE(
    topic_name TEXT,
    lag_events BIGINT,
    lag_bytes BIGINT,
    last_processed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        eo.topic_name,
        COUNT(*) FILTER (WHERE e.created_at > eo.last_processed_at) AS lag_events,
        COALESCE(SUM(pg_column_size(e.payload)) FILTER (WHERE e.created_at > eo.last_processed_at), 0) AS lag_bytes,
        eo.last_processed_at
    FROM integration.event_offsets eo
    JOIN integration.events e ON e.event_category || '.' || e.event_action = eo.topic_name
    WHERE eo.subscriber_id = p_subscriber_id
    GROUP BY eo.topic_name, eo.last_processed_at;
END;
$$ LANGUAGE plpgsql;

-- Archive old events
CREATE OR REPLACE FUNCTION integration.archive_events(
    p_retention_days INTEGER DEFAULT 90,
    p_batch_size INTEGER DEFAULT 10000
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    WITH archived AS (
        DELETE FROM integration.events
        WHERE id IN (
            SELECT id FROM integration.events
            WHERE created_at < NOW() - (p_retention_days || ' days')::INTERVAL
            AND published_to_bus = TRUE
            LIMIT p_batch_size
        )
        RETURNING id
    )
    SELECT COUNT(*) INTO v_count FROM archived;
    
    RAISE NOTICE 'Archived % events', v_count;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Health check function
CREATE OR REPLACE FUNCTION integration.health_check()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'status', 'healthy',
        'timestamp', NOW(),
        'event_store', (SELECT COUNT(*) FROM integration.events WHERE created_at > NOW() - INTERVAL '1 hour'),
        'outbox_depth', (SELECT COUNT(*) FROM integration.event_outbox WHERE published = FALSE),
        'dlq_depth', (SELECT COUNT(*) FROM integration.event_dead_letter WHERE status = 'pending'),
        'active_subscribers', (SELECT COUNT(*) FROM integration.event_subscribers WHERE is_active = TRUE),
        'queue_depth', (SELECT COUNT(*) FROM integration.queue_messages WHERE status IN ('pending', 'processing')),
        'circuit_breakers', (SELECT COUNT(*) FROM integration.circuit_breakers WHERE state = 'open')
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;""")

    heading(2, "Partitioning Strategy")
    w("""For tables that grow unboundedly, partitioning is recommended:

| Table | Partition Key | Strategy | Rationale |
|---|---|---|---|
| events | created_at | Monthly range | Time-series queries dominate |
| queue_messages | enqueued_at | Weekly range | High insert volume |
| traces | start_time | Daily range | Very high volume, short retention |
| metrics | recorded_at | Daily range | High volume, aggregation queries |
| audit_logs | created_at | Monthly range | Compliance retention |
| cost_records | recorded_at | Monthly range | Financial reporting |
| error_logs | created_at | Weekly range | Debugging, medium retention |
| webhook_deliveries | created_at | Weekly range | Delivery tracking |

**Partition Example for events table:**
```sql
CREATE TABLE integration.events (
    ...
) PARTITION BY RANGE (created_at);

CREATE TABLE integration.events_2026_07 PARTITION OF integration.events
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE TABLE integration.events_2026_08 PARTITION OF integration.events
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
```
""")

    hr()

    # ═══════════════════════════════════════════════════════
    # EXPANDED PART X — More API Details
    # ═══════════════════════════════════════════════════════
    heading(1, "Part X — API Contracts (Expanded)")
    hr()

    heading(2, "API Response Envelope")
    ts("""// Standard API Response
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  meta?: {
    request_id: string
    correlation_id: string
    timestamp: string
    duration_ms: number
  }
  pagination?: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
  }
}""")

    heading(2, "API Versioning Strategy")
    w("""| Version | Status | Sunset Date | Description |
|---|---|---|---|
| v1 | Active | — | Initial API release |
| v2 | Active | — | Added event streaming, webhook management |
| v3 | Planned | — | GraphQL support, real-time subscriptions |

**Version Negotiation:**
1. URL path: `/api/v2/events`
2. Header: `X-API-Version: 2.0`
3. Query param: `?api_version=2.0`

Priority: URL path > Header > Query param > Default (latest stable)
""")

    heading(2, "Pagination Patterns")
    ts("""// Offset-based pagination (default)
GET /api/events?page=2&page_size=50

// Cursor-based pagination (for large datasets)
GET /api/events?cursor=evt_abc123&limit=50

// Keyset pagination (for time-series)
GET /api/events?since=2026-07-18T00:00:00Z&limit=100

// Response includes:
{
  "data": [...],
  "pagination": {
    "page": 2,
    "page_size": 50,
    "total": 1523,
    "total_pages": 31,
    "has_next": true,
    "has_previous": true,
    "next_cursor": "evt_def456",
    "prev_cursor": "evt_abc123"
  }
}""")

    heading(2, "Filtering & Query Parameters")
    w("""| Parameter | Type | Example | Description |
|---|---|---|---|
| `filter[event_name]` | string | `filter[event_name]=campaign.created` | Filter by event name |
| `filter[event_type]` | enum | `filter[event_type]=domain` | Filter by event type |
| `filter[organization_id]` | UUID | `filter[organization_id]=org_xxx` | Filter by tenant |
| `filter[actor_type]` | enum | `filter[actor_type]=agent` | Filter by actor type |
| `filter[created_after]` | datetime | `filter[created_after]=2026-07-01T00:00:00Z` | Time range start |
| `filter[created_before]` | datetime | `filter[created_before]=2026-07-31T23:59:59Z` | Time range end |
| `filter[correlation_id]` | UUID | `filter[correlation_id]=corr_xxx` | Filter by correlation |
| `sort[field]` | string | `sort[field]=created_at` | Sort field |
| `sort[order]` | enum | `sort[order]=desc` | Sort order |
""")

    heading(2, "Error Response Examples")
    json_schema("""{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "The provided authentication token is invalid or has expired",
    "details": {
      "token_expired_at": "2026-07-18T10:00:00Z",
      "hint": "Please refresh your token using the /api/auth/refresh endpoint"
    }
  },
  "meta": {
    "request_id": "req_01915a6b7c8d",
    "timestamp": "2026-07-18T10:30:00Z",
    "duration_ms": 5
  }
}""")

    heading(2, "Rate Limit Response Headers")
    w("""| Header | Description | Example |
|---|---|---|
| `X-RateLimit-Limit` | Max requests per window | `1000` |
| `X-RateLimit-Remaining` | Requests remaining | `750` |
| `X-RateLimit-Reset` | Window reset time (Unix) | `1626600000` |
| `Retry-After` | Seconds until retry (on 429) | `30` |
""")

    heading(2, "API Security")
    w("""#### Authentication Flow
```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth Service
    participant API as API Gateway
    participant S as Service

    C->>A: POST /api/auth/login {email, password}
    A-->>C: {access_token, refresh_token, expires_in}
    C->>API: GET /api/events (Authorization: Bearer <access_token>)
    API->>A: Validate token
    A-->>API: Token valid, org_id=xxx
    API->>S: Process request (org_id in context)
    S-->>API: Response
    API-->>C: 200 OK {data}
```

#### HMAC Signature for Event Publishing
```
Signature = HMAC-SHA256(secret_key, event_id + timestamp + payload_hash)
Header: X-Signature: {signature}
Header: X-Timestamp: {timestamp}
```
""")

    hr()

    # ═══════════════════════════════════════════════════════
    # EXPANDED TESTING
    # ═══════════════════════════════════════════════════════
    heading(1, "Part XIII — Testing & Certification (Expanded)")
    hr()

    heading(2, "Test Implementation Examples")

    heading(3, "Contract Test Example")
    ts("""// Contract test: verify event schema compliance
describe('campaign.created event', () => {
  it('should match the registered schema', () => {
    const event = createTestEvent({
      event_name: 'campaign.created',
      payload: {
        campaign_id: 'cmp_test001',
        name: 'Test Campaign',
        objective: 'lead_generation',
        budget: 50000,
        currency: 'INR',
      }
    })

    const result = validateEvent(event, 'campaign.created')
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject event without required fields', () => {
    const event = {
      event_id: 'evt_test001',
      // missing event_name
    }
    const result = validateEvent(event, 'campaign.created')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('event_name is required')
  })
})""")

    heading(3, "Integration Test Example")
    ts("""// Integration test: end-to-end campaign flow
describe('Campaign Lifecycle Integration', () => {
  it('should complete full campaign lifecycle', async () => {
    // 1. Create campaign
    const campaign = await campaignService.create({
      name: 'Integration Test Campaign',
      budget: 10000,
      currency: 'INR',
    })
    expect(campaign.id).toBeDefined()

    // 2. Verify campaign.created event
    const events = await eventStore.getEvents(campaign.id)
    expect(events).toHaveLength(1)
    expect(events[0].event_name).toBe('campaign.started')

    // 3. Generate content
    const content = await contentService.generate({
      campaign_id: campaign.id,
      content_type: 'blog_post',
      language: 'en',
    })
    expect(content.id).toBeDefined()

    // 4. Verify content.generated event
    const contentEvents = await eventStore.getEvents(content.id)
    expect(contentEvents.some(e => e.event_name === 'content.generated')).toBe(true)

    // 5. Verify campaign metrics updated
    const metrics = await analyticsService.getCampaignMetrics(campaign.id)
    expect(metrics.content_count).toBe(1)
  })
})""")

    heading(3, "Load Test Configuration")
    ts("""// k6 load test configuration
export const options = {
  scenarios: {
    event_throughput: {
      executor: 'constant-arrival-rate',
      rate: 167, // 10,000 events/minute
      duration: '10m',
      preAllocatedVUs: 50,
    },
    api_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    event_processing_time: ['p(99)<1000'],
  },
}""")

    heading(3, "Chaos Test Scenarios")
    table(["Scenario", "Tool", "Target", "Expected Result", "RTO"], [
        ["Kill primary DB", "Chaos Monkey", "PostgreSQL primary", "Failover to replica in < 30s", "30s"],
        ["Network partition", "ToxiProxy", "Consumer → EventBus", "Messages buffered, no loss", "0 (buffered)"],
        ["CPU saturation", "Stress-ng", "AI Provider Gateway", "Circuit breaker opens, fallback", "5s"],
        ["Memory leak", "Memory stress", "Job Orchestrator", "Graceful restart, jobs preserved", "60s"],
        ["Disk full", "Filling disk", "Event Store", "Archive oldest events, alert", "120s"],
        ["Provider timeout", "Delay injection", "OpenAI API", "Failover to Stability AI", "10s"],
        ["Clock skew", "NTP manipulation", "All services", "Events still ordered (seq numbers)", "0"],
    ])

    heading(2, "Performance Benchmarks")
    table(["Operation", "Target", "Measurement", "Tool"], [
        ["Event publish latency", "< 50ms p95", "Time from emit to bus entry", "Application metrics"],
        ["Event processing latency", "< 500ms p95", "Time from bus to handler complete", "Application metrics"],
        ["Event Store query (1M rows)", "< 200ms", "Query with filters", "pgbench"],
        ["API response time", "< 200ms p95", "End-to-end API latency", "k6"],
        ["Webhook delivery", "< 30s", "Time from event to delivery", "Webhook logs"],
        ["DLQ processing", "< 5min", "Time from DLQ to resolution", "DLQ monitoring"],
        ["SSE event delivery", "< 1s", "Time from event to SSE push", "SSE monitoring"],
        ["WebSocket message", "< 100ms", "Time from event to WS push", "WS monitoring"],
        ["Schema validation", "< 10ms", "Time to validate event against schema", "Benchmark"],
        ["Consumer lag recovery", "< 30min", "Time to process backlog of 10K events", "Lag monitoring"],
    ])

    hr()
    return "\n".join(lines)


# Need TODAY
import datetime
TODAY = datetime.date.today().isoformat()
