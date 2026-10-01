#!/usr/bin/env python3
"""Volume 3G Expansion Part 2 — Additional content to reach 8,000+ lines"""

import datetime
TODAY = datetime.date.today().isoformat()

def expand2():
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
    # DETAILED EVENT BUS IMPLEMENTATION
    # ═══════════════════════════════════════════════════════
    heading(1, "Part VI — Enterprise Message Bus (Expanded)")
    hr()

    heading(2, "Bus Implementation Details")

    heading(3, "PostgreSQL LISTEN/NOTIFY Implementation")
    ts("""// Event Bus Implementation using PostgreSQL
class PostgresEventBus {
  private pool: Pool
  private subscribers: Map<string, Set<EventHandler>>

  constructor(config: DatabaseConfig) {
    this.pool = new Pool(config)
    this.subscribers = new Map()
  }

  async publish(event: Bell24hEvent): Promise<void> {
    const client = await this.pool.connect()
    try {
      // 1. Write to outbox (transactional)
      await client.query('BEGIN')
      await client.query(`
        INSERT INTO integration.event_outbox 
        (event_id, event_type, event_name, payload, organization_id, topic_name, partition_key)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        event.event_id,
        event.event_type,
        event.event_name,
        JSON.stringify(event),
        event.organization_id,
        event.event_category + '.*',
        event.campaign_id || event.organization_id,
      ])
      await client.query('COMMIT')

      // 2. NOTIFY for immediate processing
      await client.query(`NOTIFY integration.outbox, $1`, [event.event_id])
    } finally {
      client.release()
    }
  }

  subscribe(topic: string, handler: EventHandler): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set())
    }
    this.subscribers.get(topic)!.add(handler)
  }

  async startPolling(intervalMs: number = 1000): Promise<void> {
    setInterval(async () => {
      const client = await this.pool.connect()
      try {
        const result = await client.query(`
          SELECT * FROM integration.process_outbox_events(100)
        `)
        for (const row of result.rows) {
          const handlers = this.subscribers.get(row.topic_name) || new Set()
          for (const handler of handlers) {
            try {
              await handler(JSON.parse(row.payload))
            } catch (error) {
              console.error(`Handler failed for ${row.event_name}:`, error)
            }
          }
        }
      } finally {
        client.release()
      }
    }, intervalMs)
  }
}""")

    heading(3, "BullMQ Job Queue Implementation")
    ts("""// Job Queue Implementation using BullMQ
import { Queue, Worker, Job } from 'bullmq'

class EnterpriseJobQueue {
  private queues: Map<string, Queue>
  private workers: Map<string, Worker>

  constructor() {
    this.queues = new Map()
    this.workers = new Map()
  }

  createQueue(name: string, config: QueueConfig): Queue {
    const queue = new Queue(name, {
      connection: { host: 'redis', port: 6379 },
      defaultJobOptions: {
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
        attempts: config.maxRetries || 3,
        backoff: {
          type: 'exponential',
          delay: config.initialBackoffMs || 1000,
        },
      },
    })
    this.queues.set(name, queue)
    return queue
  }

  createWorker(
    queueName: string,
    handler: (job: Job) => Promise<void>,
    config: WorkerConfig
  ): Worker {
    const worker = new Worker(queueName, handler, {
      connection: { host: 'redis', port: 6379 },
      concurrency: config.concurrency || 1,
      limiter: config.rateLimit ? {
        max: config.rateLimit.max,
        duration: config.rateLimit.duration,
      } : undefined,
    })

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed in ${queueName}`)
    })

    worker.on('failed', (job, error) => {
      console.error(`Job ${job?.id} failed in ${queueName}:`, error)
      // Record to DLQ if max retries exceeded
      if (job && job.attemptsMade >= (job.opts.attempts || 3)) {
        this.moveToDLQ(queueName, job, error)
      }
    })

    this.workers.set(queueName, worker)
    return worker
  }

  async addJob(
    queueName: string,
    data: Record<string, unknown>,
    options: JobOptions = {}
  ): Promise<Job> {
    const queue = this.queues.get(queueName)
    if (!queue) throw new Error(`Queue ${queueName} not found`)

    return queue.add(options.name || 'job', data, {
      priority: options.priority,
      delay: options.delay,
      jobId: options.jobId,
    })
  }

  private async moveToDLQ(queueName: string, job: Job, error: Error): Promise<void> {
    const dlq = this.queues.get('dead-letter') || this.createQueue('dead-letter', {})
    await dlq.add('dlq-job', {
      originalQueue: queueName,
      originalJobId: job.id,
      data: job.data,
      error: {
        message: error.message,
        stack: error.stack,
      },
      attempts: job.attemptsMade,
    }, {
      removeOnComplete: false,
    })
  }
}

// Queue Configuration
const queueConfig = {
  'image-generation': { concurrency: 3, maxRetries: 3, initialBackoffMs: 1000 },
  'video-generation': { concurrency: 2, maxRetries: 3, initialBackoffMs: 2000 },
  'voice-generation': { concurrency: 2, maxRetries: 3, initialBackoffMs: 1000 },
  'publishing': { concurrency: 3, maxRetries: 5, initialBackoffMs: 5000 },
  'analytics': { concurrency: 2, maxRetries: 2, initialBackoffMs: 30000 },
  'email': { concurrency: 2, maxRetries: 3, initialBackoffMs: 10000 },
  'critical': { concurrency: 10, maxRetries: 0, initialBackoffMs: 0 },
  'high': { concurrency: 5, maxRetries: 3, initialBackoffMs: 5000 },
  'normal': { concurrency: 3, maxRetries: 3, initialBackoffMs: 30000 },
  'low': { concurrency: 2, maxRetries: 2, initialBackoffMs: 60000 },
  'dead-letter': { concurrency: 1, maxRetries: 0, initialBackoffMs: 0 },
}""")

    heading(3, "Consumer Group Management")
    ts("""// Consumer Group Manager
class ConsumerGroupManager {
  private db: DatabaseClient

  constructor(db: DatabaseClient) {
    this.db = db
  }

  async createGroup(config: ConsumerGroupConfig): Promise<string> {
    const groupId = generateId('cg')
    await this.db.query(`
      INSERT INTO integration.consumer_groups (id, group_name, description, topic_names, max_members)
      VALUES ($1, $2, $3, $4, $5)
    `, [groupId, config.name, config.description, config.topics, config.maxMembers || 10])
    return groupId
  }

  async addMember(groupId: string, member: ConsumerMember): Promise<void> {
    await this.db.query(`
      INSERT INTO integration.consumer_group_members 
      (id, group_id, member_name, member_service, assigned_partitions)
      VALUES ($1, $2, $3, $4, $5)
    `, [generateId('cgm'), groupId, member.name, member.service, member.partitions || []])
  }

  async rebalance(groupName: string): Promise<RebalanceResult> {
    const group = await this.db.query(`
      SELECT * FROM integration.consumer_groups WHERE group_name = $1
    `, [groupName])

    const members = await this.db.query(`
      SELECT * FROM integration.consumer_group_members WHERE group_id = $1 AND status = 'active'
    `, [group.rows[0].id])

    const topics = group.rows[0].topic_names
    const partitions = topics.flatMap(t => 
      Array.from({ length: 5 }, (_, i) => `${t}.partition.${i}`)
    )

    // Round-robin assignment
    const assignments: Map<string, string[]> = new Map()
    for (const partition of partitions) {
      const memberId = members.rows[partitions.indexOf(partition) % members.rows.length].id
      if (!assignments.has(memberId)) {
        assignments.set(memberId, [])
      }
      assignments.get(memberId)!.push(partition)
    }

    // Update assignments
    for (const [memberId, assigned] of assignments) {
      await this.db.query(`
        UPDATE integration.consumer_group_members
        SET assigned_partitions = $1 WHERE id = $2
      `, [assigned, memberId])
    }

    return { partitions: partitions.length, members: members.rows.length }
  }

  async getGroupStatus(groupName: string): Promise<GroupStatus> {
    const group = await this.db.query(`
      SELECT * FROM integration.consumer_groups WHERE group_name = $1
    `, [groupName])

    const members = await this.db.query(`
      SELECT gm.*, 
        COALESCE(eo.lag_events, 0) as lag,
        COALESCE(eo.processed_count, 0) as processed
      FROM integration.consumer_group_members gm
      LEFT JOIN integration.event_offsets eo ON eo.subscriber_id = gm.id
      WHERE gm.group_id = $1
    `, [group.rows[0].id])

    return {
      group: group.rows[0],
      members: members.rows,
      totalLag: members.rows.reduce((sum, m) => sum + (m.lag || 0), 0),
      totalProcessed: members.rows.reduce((sum, m) => sum + (m.processed || 0), 0),
    }
  }
}""")

    hr()

    # ═══════════════════════════════════════════════════════
    # MORE DETAILED EVENT PAYLOADS
    # ═══════════════════════════════════════════════════════
    heading(1, "Part IV — Additional Event Payloads")
    hr()

    heading(2, "Publishing Event Payloads")
    ts("""// publishing.submitted payload
interface PublishingSubmittedPayload {
  publish_id: string
  content_id: string
  platform: 'google_ads' | 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'whatsapp' | 'email'
  scheduled_time?: string
  campaign_id?: string
  target_audience?: {
    demographics: string[]
    geographies: string[]
    interests: string[]
  }
  budget_allocation?: number
}

// publishing.completed payload
interface PublishingCompletedPayload {
  publish_id: string
  content_id: string
  platform: string
  platform_post_id: string
  url: string
  published_at: string
  reach_estimate: number
  impressions_estimate: number
  engagement_estimate: number
}

// publishing.failed payload
interface PublishingFailedPayload {
  publish_id: string
  content_id: string
  platform: string
  error_code: string
  error_message: string
  http_status: number
  retry_after_seconds?: number
  attempt_number: number
  max_attempts: number
}

// publishing.platform_error payload
interface PublishingPlatformErrorPayload {
  publish_id: string
  platform: string
  error_type: 'auth_expired' | 'rate_limited' | 'content_rejected' | 'api_error' | 'timeout'
  error_code: string
  error_message: string
  http_status: number
  platform_request_id?: string
  suggested_action: string
}""")

    heading(2, "Workflow Event Payloads")
    ts("""// workflow.created payload
interface WorkflowCreatedPayload {
  workflow_id: string
  workflow_name: string
  workflow_type: 'campaign_launch' | 'content_pipeline' | 'asset_generation' | 'publishing_schedule' | 'custom'
  steps: WorkflowStep[]
  triggers: WorkflowTrigger[]
  created_by: string
}

// workflow.started payload
interface WorkflowStartedPayload {
  workflow_id: string
  instance_id: string
  trigger_event: string
  input_data: Record<string, unknown>
  started_by: string
}

// workflow.step_completed payload
interface WorkflowStepCompletedPayload {
  workflow_id: string
  instance_id: string
  step_id: string
  step_name: string
  step_type: string
  output_data: Record<string, unknown>
  duration_ms: number
  completed_at: string
}

// workflow.step_failed payload
interface WorkflowStepFailedPayload {
  workflow_id: string
  instance_id: string
  step_id: string
  step_name: string
  error_code: string
  error_message: string
  retry_count: number
  max_retries: number
  will_retry: boolean
}

// workflow.completed payload
interface WorkflowCompletedPayload {
  workflow_id: string
  instance_id: string
  total_steps: number
  completed_steps: number
  failed_steps: number
  total_duration_ms: number
  output_data: Record<string, unknown>
}""")

    heading(2, "Automation Event Payloads")
    ts("""// automation.triggered payload
interface AutomationTriggeredPayload {
  automation_id: string
  automation_name: string
  trigger_type: 'event' | 'schedule' | 'webhook' | 'manual'
  trigger_event?: string
  trigger_data: Record<string, unknown>
  matched_rules: AutomationRule[]
}

// automation.executed payload
interface AutomationExecutedPayload {
  automation_id: string
  execution_id: string
  action_type: 'send_notification' | 'update_field' | 'create_task' | 'call_api' | 'run_workflow'
  action_config: Record<string, unknown>
  result: Record<string, unknown>
  duration_ms: number
  executed_at: string
}

// automation.failed payload
interface AutomationFailedPayload {
  automation_id: string
  execution_id: string
  action_type: string
  error_code: string
  error_message: string
  retry_count: number
  will_retry: boolean
}""")

    heading(2, "Learning Engine Event Payloads")
    ts("""// learning.experiment_started payload
interface LearningExperimentStartedPayload {
  experiment_id: string
  experiment_name: string
  hypothesis: string
  variants: ExperimentVariant[]
  metrics: string[]
  sample_size_target: number
  confidence_level: number
}

// learning.pattern_detected payload
interface LearningPatternDetectedPayload {
  pattern_id: string
  pattern_type: 'anomaly' | 'trend' | 'correlation' | 'seasonality'
  description: string
  confidence: number
  affected_entities: string[]
  time_range: { start: string; end: string }
  impact_score: number
}

// learning.recommendation_made payload
interface LearningRecommendationMadePayload {
  recommendation_id: string
  recommendation_type: 'content_optimization' | 'budget_reallocation' | 'timing_adjustment' | 'audience_expansion'
  description: string
  expected_impact: {
    metric: string
    current_value: number
    predicted_value: number
    confidence: number
  }
  evidence: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
}""")

    heading(2, "SEO Event Payloads")
    ts("""// seo.keyword_discovered payload
interface SEoKeywordDiscoveredPayload {
  keyword_id: string
  keyword: string
  search_volume: number
  competition_level: 'low' | 'medium' | 'high'
  difficulty_score: number
  cpc: number
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
  cluster_id?: string
  industry_id: string
}

// seo.cluster_created payload
interface SEOClusterCreatedPayload {
  cluster_id: string
  cluster_name: string
  primary_keyword: string
  secondary_keywords: string[]
  total_search_volume: number
  average_difficulty: number
  content_gap_score: number
}

// seo.content_gap_detected payload
interface SEOContentGapDetectedPayload {
  gap_id: string
  gap_type: 'topic' | 'keyword' | 'competitor' | 'format'
  description: string
  opportunity_score: number
  estimated_traffic: number
  suggested_content_type: string
  suggested_keywords: string[]
}""")

    heading(2, "Industry Intelligence Event Payloads")
    ts("""// industry.trend_detected payload
interface IndustryTrendDetectedPayload {
  trend_id: string
  trend_type: 'emerging' | 'growing' | 'mature' | 'declining'
  description: string
  industry_id: string
  confidence: number
  data_sources: string[]
  first_detected: string
  growth_rate?: number
}

// industry.pain_point_identified payload
interface IndustryPainPointPayload {
  pain_point_id: string
  pain_point: string
  category: 'quality' | 'price' | 'delivery' | 'communication' | 'technology' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  frequency: number
  affected_segments: string[]
  opportunity_score: number
}

// industry.buyer_persona_updated payload
interface IndustryBuyerPersonaUpdatedPayload {
  persona_id: string
  persona_name: string
  industry_id: string
  demographics: Record<string, unknown>
  psychographics: Record<string, unknown>
  buying_behavior: Record<string, unknown>
  pain_points: string[]
  preferred_channels: string[]
  decision_making_process: string
}""")

    heading(2, "Marketplace Event Payloads")
    ts("""// rfq.created payload
interface RFQCreatedPayload {
  rfq_id: string
  title: string
  description: string
  buyer_id: string
  category_id: string
  quantity: number
  unit: string
  budget_range: { min: number; max: number; currency: string }
  deadline: string
  delivery_location: string
  quality_requirements?: string
  certifications_required?: string[]
}

// rfq.qualified payload
interface RFQQualifiedPayload {
  rfq_id: string
  qualification_score: number
  matched_suppliers: number
  estimated_responses: number
  recommended_suppliers: string[]
  qualification_criteria: Record<string, unknown>
}

// supplier.matched payload
interface SupplierMatchedPayload {
  match_id: string
  supplier_id: string
  rfq_id: string
  match_score: number
  match_reasons: string[]
  estimated_delivery: string
  estimated_price: number
}

// trust.score_updated payload
interface TrustScoreUpdatedPayload {
  entity_id: string
  entity_type: 'supplier' | 'buyer'
  previous_score: number
  new_score: number
  score_change: number
  factors: Array<{
    factor: string
    weight: number
    value: number
  }>
  verification_level: 'basic' | 'enhanced' | 'premium'
}""")

    hr()

    # ═══════════════════════════════════════════════════════
    # MORE DETAILED MERCHANT ADRs
    # ═══════════════════════════════════════════════════════
    heading(1, "Part XII — Architecture Decision Records (Expanded)")
    hr()

    heading(2, "ADR-001: Event-Driven Architecture — Detailed Analysis")

    heading(3, "Context")
    w("""Bell24h-OS consists of 19+ modules that need to communicate with each other. The system handles:
- 2,000+ daily AI asset generation jobs
- 50+ AI agents working in parallel
- Multiple external platform integrations (Google, Facebook, Instagram, LinkedIn, Twitter, YouTube, WhatsApp)
- Real-time analytics and reporting
- Economic decision-making (VASE)
- Multi-tenant isolation for thousands of organizations

Traditional REST-based synchronous communication creates several problems:
1. **Cascading failures**: If one module is down, all modules that depend on it fail
2. **Tight coupling**: Changes to one module's API require changes in all consuming modules
3. **No audit trail**: REST calls don't leave a permanent record
4. **No replay capability**: Cannot re-process historical operations
5. **Scaling limitations**: All dependent modules must scale together

**Alternatives Considered:**
1. REST point-to-point (status quo in many systems)
2. Message queues (RabbitMQ, Apache Kafka)
3. Event-driven architecture with PostgreSQL
4. GraphQL subscriptions
5. gRPC streaming

**Decision:**
Adopt event-driven architecture using PostgreSQL LISTEN/NOTIFY + outbox pattern as the primary bus, with BullMQ (Redis-backed) for job queues.

**Rationale:**
1. **Zero additional infrastructure**: PostgreSQL is already the primary database
2. **ACID guarantees**: Outbox pattern ensures events are never lost
3. **Strong typing**: JSONB payloads with schema validation
4. **Replay capability**: Events stored permanently in the Event Store
5. **Audit compliance**: Every event is logged with full context
6. **Multi-tenant support**: organization_id on every event for RLS

**Consequences:**
1. All modules must emit events for cross-module communication (training required)
2. Eventual consistency between modules (5-second max lag for critical data)
3. Need schema registry for event versioning
4. Need monitoring for consumer lag and DLQ depth

**Metrics:**
- Event throughput: 10,000+ events/day (current), 100,000+ events/day (projected)
- Consumer lag target: < 1,000 events
- DLQ rate target: < 0.1% of all events""")

    heading(2, "ADR-003: UUIDv7 for All Entity IDs — Detailed Analysis")

    heading(3, "Context")
    w("""Every entity in Bell24h-OS needs a unique identifier. Options considered:

| Option | Pros | Cons |
|---|---|---|
| Auto-increment | Simple, sequential | Not distributed, leaks business info |
| UUIDv4 | Globally unique, no coordination | Random, causes index fragmentation |
| UUIDv1 | Time-based, unique | MAC address exposure, non-standard |
| UUIDv7 | Time-ordered, unique, index-friendly | Newer, less tooling |
| ULID | Time-ordered, sortable | Less standard than UUID |
| NanoID | Short, URL-friendly | Not time-ordered |
| Snowflake | Time-ordered, distributed | Requires coordination service |

**Decision:**
Use UUIDv7 with entity prefixes for all business entities.

**Rationale:**
1. **Time-ordered**: UUIDs sort chronologically, which is natural for most queries
2. **Database-friendly**: No random I/O patterns that fragment B-tree indexes
3. **No coordination**: Each service can generate IDs independently
4. **Contains timestamp**: Can extract creation time from the ID itself
5. **Standard format**: UUID is universally supported
6. **Prefix convention**: `org_`, `cmp_`, `evt_` etc. make IDs self-documenting

**Example:**
```
org_01915a6b-7c8d-7abc-9def-0123456789ab
│     │
│     └─ 32 hex chars (UUIDv7)
└─ Entity prefix
```

**Consequences:**
1. All ID generation must go through the `generateId(prefix)` function
2. Client-generated IDs are never trusted
3. Database uses TEXT type for IDs (not UUID type) to support prefix
4. Indexes on ID columns use B-tree (not GiST) for efficient prefix matching""")

    heading(2, "ADR-011: Multi-Tenant RLS — Detailed Analysis")

    heading(3, "Context")
    w("""Bell24h-OS serves multiple organizations (tenants). Data isolation is critical:
- Organization A must never see Organization B's data
- Even if the application has a bug, data must remain isolated
- Cross-tenant queries must be impossible at the database level

**Alternatives Considered:**
1. Application-level WHERE clauses (manual filtering)
2. Separate database per tenant
3. Separate schema per tenant
4. PostgreSQL Row-Level Security (RLS)
5. Middleware-level filtering

**Decision:**
Use PostgreSQL Row-Level Security (RLS) for database-level tenant isolation.

**Implementation:**
```sql
-- Set current organization for the session
SET app.current_org_id = 'org_abc123';

-- RLS policy automatically filters
SELECT * FROM integration.events;
-- Returns only events WHERE organization_id = 'org_abc123'
```

**Rationale:**
1. **Defense in depth**: Even if application code has a bug, RLS prevents cross-tenant access
2. **Performance**: Database-level filtering is faster than application-level
3. **Audit compliance**: RLS policies are auditable
4. **Simplicity**: No need for complex middleware
5. **PostgreSQL native**: No additional tools or libraries needed

**Consequences:**
1. All queries must set `app.current_org_id` before execution
2. Some queries (system health, global metrics) need special handling
3. RLS policies must be maintained for every table
4. Testing must verify RLS isolation

**Testing:**
```sql
-- Test: Verify tenant isolation
SET app.current_org_id = 'org_abc123';
SELECT COUNT(*) FROM integration.events; -- Should only return org_abc123's events

SET app.current_org_id = 'org_xyz789';
SELECT COUNT(*) FROM integration.events; -- Should only return org_xyz789's events
```""")

    hr()

    # ═══════════════════════════════════════════════════════
    # MORE TESTING DETAILS
    # ═══════════════════════════════════════════════════════
    heading(1, "Part XIII — Testing Framework (Expanded)")
    hr()

    heading(2, "Test Pyramid")
    w("""
```
         ╱╲
        ╱  ╲         E2E Tests (5%)
       ╱    ╲        - Full campaign lifecycle
      ╱──────╲       - Publishing pipeline
     ╱        ╲      Integration Tests (15%)
    ╱          ╲     - Module communication
   ╱────────────╲    - Database operations
  ╱              ╲   Unit Tests (80%)
 ╱                ╲  - Event validation
╱──────────────────╲ - Business logic
                    - Schema compliance
```
""")

    heading(2, "Test Categories & Coverage Targets")
    table(["Category", "Coverage Target", "Tools", "Execution"], [
        ["Unit Tests", "90%+", "Jest/Vitest", "Every commit"],
        ["Integration Tests", "80%+", "Jest + TestContainers", "Every PR"],
        ["Contract Tests", "100%", "Pact/Custom", "Every PR"],
        ["E2E Tests", "Critical paths", "Playwright", "Nightly"],
        ["Load Tests", "Performance targets", "k6", "Weekly"],
        ["Chaos Tests", "Resilience scenarios", "ToxiProxy", "Monthly"],
        ["Security Tests", "OWASP Top 10", "OWASP ZAP", "Monthly"],
    ])

    heading(2, "Test Data Management")
    w("""**Test Data Principles:**

1. **Isolated**: Each test uses unique data (no shared state)
2. **Deterministic**: Same input → same output (no randomness)
3. **Cleaned up**: Tests delete their own data after completion
4. **Realistic**: Test data mirrors production patterns

**Test Data Factory:**
```typescript
class TestDataFactory {
  static createEvent(overrides: Partial<Bell24hEvent> = {}): Bell24hEvent {
    const id = generateId('evt')
    return {
      event_id: id,
      event_version: '1.0',
      event_name: 'test.event',
      event_type: 'domain',
      event_category: 'test',
      event_action: 'event',
      organization_id: generateId('org'),
      correlation_id: generateId('corr'),
      actor: { type: 'system', id: 'test_system' },
      timestamp: new Date().toISOString(),
      schema_version: '1.0',
      payload: {},
      metadata: { source: 'test', version: '1.0.0' },
      ...overrides,
    }
  }

  static async createAndPublishEvent(overrides: Partial<Bell24hEvent> = {}): Promise<Bell24hEvent> {
    const event = this.createEvent(overrides)
    await eventBus.publish(event)
    return event
  }
}
```

**Cleanup Strategy:**
```typescript
afterEach(async () => {
  // Delete test data
  await db.query('DELETE FROM integration.events WHERE organization_id LIKE $1', ['test_%'])
  await db.query('DELETE FROM integration.event_outbox WHERE organization_id LIKE $1', ['test_%'])
  await db.query('DELETE FROM integration.cost_records WHERE organization_id LIKE $1', ['test_%'])
})
```""")

    heading(2, "Performance Test Scenarios")
    table(["Scenario", "Target", "Duration", "VUs", "Threshold"], [
        ["Event Publishing", "10,000 events/min", "10 min", "50", "< 1% failure"],
        ["Event Processing", "10,000 events/min", "10 min", "50", "< 500ms p95"],
        ["API Response", "1,000 req/min", "5 min", "100", "< 200ms p95"],
        ["Database Queries", "100 queries/sec", "5 min", "50", "< 100ms p95"],
        ["Webhook Delivery", "100 webhooks/sec", "5 min", "50", "< 30s delivery"],
        ["Concurrent Consumers", "50 consumers", "10 min", "50", "0 message loss"],
        ["DLQ Recovery", "1,000 DLQ messages", "5 min", "10", "< 5 min recovery"],
        ["SSE Connections", "100 connections", "1 hour", "100", "< 1s event delivery"],
    ])

    heading(2, "Monitoring & Alerting")
    table(["Metric", "Threshold", "Alert Level", "Action"], [
        ["Consumer Lag", "> 1,000 events", "Warning", "Scale consumers"],
        ["Consumer Lag", "> 10,000 events", "Critical", "Emergency scale"],
        ["DLQ Depth", "> 10 messages", "Warning", "Investigate root cause"],
        ["DLQ Depth", "> 100 messages", "Critical", "Stop new events, fix"],
        ["Event Store Query", "> 200ms p95", "Warning", "Optimize queries"],
        ["API Response", "> 500ms p95", "Warning", "Investigate slow queries"],
        ["API Response", "> 2s p95", "Critical", "Scale infrastructure"],
        ["Circuit Breaker Open", "> 5 minutes", "Critical", "Check provider health"],
        ["Cost Anomaly", "> 2x expected", "Warning", "Review spending"],
        ["Cost Anomaly", "> 5x expected", "Critical", "Kill switch review"],
        ["Memory Usage", "> 80%", "Warning", "Check for leaks"],
        ["Memory Usage", "> 95%", "Critical", "Restart service"],
        ["Disk Usage", "> 80%", "Warning", "Archive old data"],
        ["Disk Usage", "> 95%", "Critical", "Emergency cleanup"],
    ])

    hr()

    # ═══════════════════════════════════════════════════════
    # MIDDLEWARE IMPLEMENTATION
    # ═══════════════════════════════════════════════════════
    heading(1, "Integration Middleware Implementation")
    hr()

    heading(2, "Event Validation Middleware")
    ts("""// Event Validation Middleware
class EventValidationMiddleware {
  private schemas: Map<string, JSONSchema>

  constructor(schemaRegistry: SchemaRegistry) {
    this.schemas = new Map()
  }

  async validate(event: Bell24hEvent): Promise<ValidationResult> {
    const errors: string[] = []

    // 1. Validate envelope fields
    if (!event.event_id?.startsWith('evt_')) {
      errors.push('event_id must start with evt_')
    }
    if (!event.event_name?.includes('.')) {
      errors.push('event_name must follow {category}.{action} pattern')
    }
    if (!event.organization_id?.startsWith('org_')) {
      errors.push('organization_id must start with org_')
    }
    if (!event.correlation_id?.startsWith('corr_')) {
      errors.push('correlation_id must start with corr_')
    }

    // 2. Validate actor
    const validActorTypes = ['user', 'system', 'agent', 'scheduler', 'webhook']
    if (!validActorTypes.includes(event.actor?.type)) {
      errors.push(`actor.type must be one of: ${validActorTypes.join(', ')}`)
    }

    // 3. Validate timestamp
    const timestamp = new Date(event.timestamp)
    if (isNaN(timestamp.getTime())) {
      errors.push('timestamp must be valid ISO 8601')
    }
    if (timestamp > new Date(Date.now() + 60000)) {
      errors.push('timestamp cannot be more than 1 minute in the future')
    }

    // 4. Validate against JSON Schema
    const schema = this.schemas.get(event.event_name)
    if (schema) {
      const schemaErrors = this.validateSchema(event.payload, schema)
      errors.push(...schemaErrors)
    }

    return {
      valid: errors.length === 0,
      errors,
      event_id: event.event_id,
      validated_at: new Date().toISOString(),
    }
  }
}""")

    heading(2, "Outbox Pattern Middleware")
    ts("""// Outbox Pattern Implementation
class OutboxMiddleware {
  private db: DatabaseClient
  private poller: NodeJS.Timer | null = null

  constructor(db: DatabaseClient) {
    this.db = db
  }

  async publishWithOutbox(
    transaction: Transaction,
    event: Bell24hEvent
  ): Promise<void> {
    // Write event to outbox within the same transaction
    await transaction.query(`
      INSERT INTO integration.event_outbox 
      (event_id, event_type, event_name, payload, organization_id, topic_name, partition_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      event.event_id,
      event.event_type,
      event.event_name,
      JSON.stringify(event),
      event.organization_id,
      event.event_category + '.*',
      event.campaign_id || event.organization_id,
    ])
    // Transaction will commit both business data and outbox entry atomically
  }

  startPolling(intervalMs: number = 1000): void {
    this.poller = setInterval(async () => {
      const client = await this.db.connect()
      try {
        // Process batch of unpublished events
        const events = await client.query(`
          SELECT * FROM integration.process_outbox_events(100)
        `)

        for (const event of events.rows) {
          try {
            // Publish to event bus
            await this.eventBus.publish(JSON.parse(event.payload))
            
            // Mark as published
            await client.query(`
              UPDATE integration.event_outbox 
              SET published = TRUE, published_at = NOW()
              WHERE event_id = $1
            `, [event.event_id])
          } catch (error) {
            console.error(`Failed to publish event ${event.event_id}:`, error)
            await client.query(`
              UPDATE integration.event_outbox 
              SET attempts = attempts + 1, last_error = $1
              WHERE event_id = $2
            `, [error.message, event.event_id])
          }
        }
      } finally {
        client.release()
      }
    }, intervalMs)
  }

  stopPolling(): void {
    if (this.poller) {
      clearInterval(this.poller)
      this.poller = null
    }
  }
}""")

    heading(2, "Inbox Pattern Middleware")
    ts("""// Inbox Pattern Implementation
class InboxMiddleware {
  private db: DatabaseClient

  constructor(db: DatabaseClient) {
    this.db = db
  }

  async processWithDedup(
    event: Bell24hEvent,
    consumerName: string,
    handler: (event: Bell24hEvent) => Promise<void>
  ): Promise<InboxResult> {
    const client = await this.db.connect()
    try {
      // Try to claim this event for processing
      const result = await client.query(`
        INSERT INTO integration.event_inbox 
        (event_id, consumer_name, topic_name, payload, status)
        VALUES ($1, $2, $3, $4, 'processing')
        ON CONFLICT (event_id, consumer_name) DO NOTHING
        RETURNING id
      `, [event.event_id, consumerName, event.event_category + '.*', JSON.stringify(event)])

      if (result.rows.length === 0) {
        // Event already processed or being processed
        return { status: 'skipped', reason: 'duplicate' }
      }

      try {
        // Process the event
        await handler(event)

        // Mark as completed
        await client.query(`
          UPDATE integration.event_inbox 
          SET status = 'completed', processed_at = NOW()
          WHERE id = $1
        `, [result.rows[0].id])

        return { status: 'completed' }
      } catch (error) {
        // Mark as failed
        await client.query(`
          UPDATE integration.event_inbox 
          SET status = 'failed', error_message = $1
          WHERE id = $2
        `, [error.message, result.rows[0].id])

        return { status: 'failed', error: error.message }
      }
    } finally {
      client.release()
    }
  }
}""")

    hr()
    return "\n".join(lines)

import datetime
TODAY = datetime.date.today().isoformat()
