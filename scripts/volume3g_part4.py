#!/usr/bin/env python3
"""Volume 3G — Parts XI-XIV, Appendices, and Main Assembly"""

def part_xi_diagrams():
    """20 Mermaid Diagrams"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def mermaid(code):
        w("```mermaid"); w(code.strip()); w("```\n")
    def hr(): w("\n---\n")

    heading(1, "Part XI — Mermaid Diagrams")
    hr()

    heading(2, "109. Enterprise Event Mesh")
    mermaid("""graph TB
    subgraph Publishers
        A1[Campaign Intelligence]
        A2[Content Planner]
        A3[Image Studio]
        A4[Video Studio]
        A5[Voice Studio]
        A6[AI Provider Gateway]
        A7[VASE]
        A8[Publishing Center]
    end
    subgraph "Enterprise Event Bus"
        B1[Topics]
        B2[Queues]
        B3[Streams]
        B4[Dead Letter]
    end
    subgraph Subscribers
        C1[Learning Engine]
        C2[Performance Intel]
        C3[Analytics Engine]
        C4[SEO Intelligence]
        C5[Notification Service]
        C6[Event Store]
    end
    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    A5 --> B1
    A6 --> B1
    A7 --> B1
    A8 --> B1
    B1 --> C1
    B1 --> C2
    B1 --> C3
    B1 --> C4
    B1 --> C5
    B1 --> C6
    B2 --> B4""")

    heading(2, "110. CQRS Architecture")
    mermaid("""graph LR
    subgraph "Write Side"
        U[User/API] -->|Command| CB[Command Bus]
        CB --> CH[Command Handler]
        CH --> BL[Business Logic]
        BL --> ES[(Event Store)]
        BL --> RM[(Read Model)]
    end
    subgraph "Read Side"
        U2[Dashboard/API] -->|Query| QB[Query Bus]
        QB --> QH[Query Handler]
        QH --> RM2[(Materialized View)]
        RM2 --> R[Response]
    end
    ES -->|Events| EB[Event Bus]
    EB -->|Projections| RM2""")

    heading(2, "111. Saga Pattern — Campaign Launch")
    mermaid("""sequenceDiagram
    participant O as Orchestrator
    participant CI as Campaign Intel
    participant CP as Content Planner
    participant IS as Image Studio
    participant PC as Publishing Center
    participant V as VASE

    O->>CI: Create Campaign
    CI-->>O: campaign.created
    O->>CP: Generate Content
    CP-->>O: content.generated
    O->>IS: Generate Images
    IS-->>O: image.generated
    O->>V: Check Budget
    V-->>O: budget.approved
    O->>PC: Publish Content
    PC-->>O: publishing.completed
    Note over O: Saga Complete
    opt Any Step Fails
        O->>O: Execute Compensation
        O->>PC: Unpublish
        O->>IS: Cancel Images
        O->>CP: Cancel Content
    end""")

    heading(2, "112. Outbox Pattern")
    mermaid("""sequenceDiagram
    participant A as Service A
    participant DB as Database
    participant OB as Outbox Table
    participant P as Poller
    participant B as Event Bus

    A->>DB: Begin Transaction
    A->>DB: Write Business Data
    A->>OB: Write Event to Outbox
    A->>DB: Commit Transaction
    Note over P: Poll every 1s
    P->>OB: SELECT unpublished events
    OB-->>P: Events
    P->>B: Publish Event
    P->>OB: Mark as published""")

    heading(2, "113. Inbox Pattern")
    mermaid("""sequenceDiagram
    participant B as Event Bus
    participant C as Consumer
    participant IB as Inbox Table
    participant H as Handler

    B->>C: Deliver Event
    C->>IB: INSERT (event_id, consumer) ON CONFLICT DO NOTHING
    alt New Event
        IB-->>C: Inserted
        C->>H: Process Event
        H-->>C: Success
        C->>IB: Update status = completed
    else Duplicate
        IB-->>C: Conflict (already exists)
        C->>C: Skip
    end""")

    heading(2, "114. Event Sourcing & Replay")
    mermaid("""graph LR
    subgraph "Event Store"
        E1[e1: user.created] --> E2[e2: org.created]
        E2 --> E3[e3: campaign.created]
        E3 --> E4[e4: content.generated]
        E4 --> E5[e5: content.published]
    end
    subgraph "Replay"
        R[Replay Request] --> ES[(Event Store)]
        ES -->|Filter by topic/date/org| F[Filtered Events]
        F -->|Re-process| H[Event Handlers]
        H --> RM[(Updated Read Model)]
    end""")

    heading(2, "115. AI Provider Failover")
    mermaid("""graph TD
    REQ[AI Request] --> CB{Circuit Breaker}
    CB -->|Closed| P1[Primary Provider]
    CB -->|Open| FB[Fallback Router]
    P1 -->|Success| R[Response]
    P1 -->|Failure| F1[Record Failure]
    F1 --> CB
    FB -->|Try| P2[Secondary Provider]
    P2 -->|Success| R
    P2 -->|Failure| P3[Tertiary Provider]
    P3 -->|Success| R
    P3 -->|Failure| DLQ[Dead Letter Queue]
    DLQ -->|Alert| OPS[Operations]
    DLQ -->|Compensate| COMP[Retry with Delay]""")

    heading(2, "116. Publishing Pipeline")
    mermaid("""graph TD
    A[Content Generated] --> B{QA Check}
    B -->|Pass| C[Approve]
    B -->|Fail| D[Reject & Regenerate]
    C --> E{Schedule?}
    E -->|Now| F[Publish Immediately]
    E -->|Later| G[Schedule Queue]
    G -->|Time Arrives| F
    F --> H{Platform API}
    H -->|Success| I[content.published]
    H -->|Rate Limited| J[Retry Queue]
    H -->|Auth Expired| K[Re-authenticate]
    H -->|Rejected| L[content.rejected]
    J -->|Backoff| F
    K -->|Refresh Token| F""")

    heading(2, "117. VASE Economic Decision Flow")
    mermaid("""graph TD
    DEC[Decision Submitted] --> PF{Preflight Check}
    PF -->|Pass| BU{Budget Check}
    PF -->|Fail| REJ[Decision Rejected]
    BU -->|Within Budget| APPROVE[Approve Spending]
    BU -->|Exceeds Budget| KS{Kill Switch?}
    KS -->|Yes| HALT[Halt All Spending]
    KS -->|No| MAN[Manual Review]
    APPROVE --> EXEC[Execute Decision]
    EXEC --> LED[Post to Ledger]
    LED --> REC[Record Cost]
    REC --> MON{Monitor}
    MON -->|Anomaly| ALERT[Cost Anomaly Alert]
    MON -->|Normal| OK[Continue]""")

    heading(2, "118. Campaign Lifecycle")
    mermaid("""stateDiagram-v2
    [*] --> Draft: Create Campaign
    Draft --> Planning: Start Planning
    Planning --> ContentGeneration: Generate Content
    ContentGeneration --> Review: Content Ready
    Review --> Approved: QA Passed
    Review --> ContentGeneration: QA Failed
    Approved --> Scheduled: Schedule
    Scheduled --> Active: Launch Date
    Active --> Paused: Pause
    Paused --> Active: Resume
    Active --> Completed: End Date
    Active --> BudgetExceeded: Budget Hit
    Completed --> Archived: Archive
    BudgetExceeded --> Paused: Auto-Pause
    Archived --> [*]""")

    heading(2, "119. Workflow Engine")
    mermaid("""graph TD
    START[Workflow Start] --> S1[Step 1: Validate Input]
    S1 -->|Success| S2[Step 2: Process Data]
    S1 -->|Fail| COMP1[Compensate]
    S2 -->|Success| S3{Step 3: Decision}
    S3 -->|Branch A| S4A[Step 4A: Generate Asset]
    S3 -->|Branch B| S4B[Step 4B: Fetch Data]
    S4A --> S5[Step 5: Publish]
    S4B --> S5
    S5 -->|Success| DONE[Workflow Complete]
    S5 -->|Fail| COMP2[Compensate & Retry]
    COMP1 --> FAIL[Workflow Failed]
    COMP2 -->|Retries Left| S5
    COMP2 -->|No Retries| FAIL""")

    heading(2, "120. Queue Architecture")
    mermaid("""graph TB
    subgraph "Priority Queues"
        Q0[P0 Critical]
        Q1[P1 High]
        Q2[P2 Normal]
        Q3[P3 Low]
        Q4[P4 Background]
    end
    subgraph "Worker Pools"
        W1[Image Workers x3]
        W2[Video Workers x2]
        W3[Publishing Workers x3]
        W4[Analytics Workers x2]
        W5[Email Workers x2]
    end
    subgraph "Dead Letter"
        DLQ[Dead Letter Queue]
    end
    subgraph "Retry"
        R1[Retry Short]
        R2[Retry Medium]
        R3[Retry Long]
    end
    Q0 --> W1
    Q0 --> W3
    Q1 --> W3
    Q1 --> W5
    Q2 --> W1
    Q2 --> W2
    Q3 --> W4
    W1 -->|Failure| R1
    W2 -->|Failure| R2
    W3 -->|Failure| R1
    R1 -->|Max Retries| DLQ
    R2 -->|Max Retries| DLQ""")

    heading(2, "121. Consumer Groups")
    mermaid("""graph TB
    subgraph "Topic: campaign.*"
        T1[campaign.created]
        T2[campaign.completed]
        T3[campaign.budget_exceeded]
    end
    subgraph "Consumer Group: analytics-group"
        CG1[Analytics Consumer 1]
        CG2[Analytics Consumer 2]
    end
    subgraph "Consumer Group: learning-group"
        CG3[Learning Consumer]
    end
    subgraph "Consumer Group: notification-group"
        CG4[Notification Consumer]
    end
    T1 --> CG1
    T1 --> CG3
    T2 --> CG1
    T2 --> CG3
    T2 --> CG4
    T3 --> CG4""")

    heading(2, "122. Distributed Tracing")
    mermaid("""sequenceDiagram
    participant Client
    participant Gateway
    participant CampaignService
    participant ContentService
    participant ImageService
    participant ProviderGateway

    Client->>Gateway: POST /api/campaigns
    Note over Gateway: trace_id: trc_001<br/>span_id: span_001
    Gateway->>CampaignService: Create Campaign
    Note over CampaignService: span_002 (parent: span_001)
    CampaignService->>ContentService: Generate Content
    Note over ContentService: span_003 (parent: span_002)
    ContentService->>ProviderGateway: Call AI Provider
    Note over ProviderGateway: span_004 (parent: span_003)
    ProviderGateway-->>ContentService: Content Generated
    ContentService->>ImageService: Generate Images
    Note over ImageService: span_005 (parent: span_003)
    ImageService-->>ContentService: Images Ready
    ContentService-->>CampaignService: Content + Images
    CampaignService-->>Gateway: Campaign Created
    Gateway-->>Client: 201 Created""")

    heading(2, "123. Multi-Tenant Isolation")
    mermaid("""graph TB
    subgraph "Tenant A (org_abc)"
        A1[Events] --> A2[Queues]
        A3[Contracts] --> A4[Schemas]
        A5[Costs] --> A6[Audit]
    end
    subgraph "Tenant B (org_xyz)"
        B1[Events] --> B2[Queues]
        B3[Contracts] --> B4[Schemas]
        B5[Costs] --> B6[Audit]
    end
    subgraph "Shared Infrastructure"
        RLS[RLS Policies]
        AUTH[Auth Middleware]
        SHARED[Shared Schemas]
    end
    AUTH --> A1
    AUTH --> B1
    RLS -.->|Isolates| A1
    RLS -.->|Isolates| B1
    SHRED -.->|Read-only| A3
    SHRED -.->|Read-only| B3""")

    heading(2, "124. Integration Contract Flow")
    mermaid("""graph TD
    subgraph "Producer"
        P[Service A] -->|Emits| E[event.name]
    end
    subgraph "Contract Registry"
        CR[Contract Registry]
        CR -->|Validates| E
        CR -->|Schema Check| SC[Schema Validator]
    end
    subgraph "Event Bus"
        E --> TOP[Topic]
    end
    subgraph "Consumer"
        TOP --> SUB[Subscriber]
        SUB -->|Validates| CV[Contract Validator]
        CV -->|Process| H[Handler]
    end
    E -->|Pass| TOP
    E -->|Fail| DLQ[Dead Letter]""")

    heading(2, "125. Database Relationships")
    mermaid("""erDiagram
    EVENTS ||--o{ EVENT_OUTBOX : "published via"
    EVENTS ||--o{ EVENT_INBOX : "consumed via"
    EVENTS ||--o{ EVENT_DEAD_LETTER : "failed to"
    EVENTS ||--o{ EVENT_REPLAY : "replayed in"
    EVENT_TOPICS ||--o{ EVENT_SUBSCRIBERS : "has"
    EVENT_SUBSCRIBERS ||--o{ EVENT_OFFSETS : "tracks"
    EVENT_TOPICS ||--o{ QUEUE_MESSAGES : "enqueued to"
    QUEUES ||--o{ QUEUE_MESSAGES : "contains"
    CONTRACTS ||--o{ CONTRACT_VALIDATIONS : "defines"
    SCHEMAS ||--o{ CONTRACTS : "validates"
    CONSUMER_GROUPS ||--o{ CONSUMER_GROUP_MEMBERS : "has"
    COST_RECORDS }o--|| EVENTS : "linked to"
    AUDIT_LOGS }o--|| EVENTS : "linked to"
    TRACES }o--|| EVENTS : "linked to"
    METRICS }o--|| EVENTS : "linked to"
    ERROR_LOGS }o--|| EVENTS : "linked to"
    CIRCUIT_BREAKERS ||--o{ PROVIDER_USAGE : "governs" """)

    heading(2, "126. Notification Pipeline")
    mermaid("""graph TD
    EVT[Event Received] --> GEN[Generate Notification]
    GEN --> DEDUP{Deduplicate}
    DEDUP -->|New| SEV{Severity?}
    DEDUP -->|Duplicate| SKIP[Skip]
    SEV -->|Critical| ALL[All Channels]
    SEV -->|Error| MULTI[In-App + Email]
    SEV -->|Warning| INAPP[In-App + Slack]
    SEV -->|Info| INAPP2[In-App Only]
    ALL --> DELIVER[Delivery Service]
    MULTI --> DELIVER
    INAPP --> DELIVER
    INAPP2 --> DELIVER
    DELIVER --> EMAIL[Email]
    DELIVER --> SLACK[Slack]
    DELIVER --> WA[WhatsApp]
    DELIVER --> SMS[SMS]
    DELIVER --> PUSH[Push Notification]""")

    heading(2, "127. Full Bell24h-OS Event Architecture")
    mermaid("""graph TB
    subgraph "External APIs"
        GA[Google Analytics]
        FB[Facebook]
        IG[Instagram]
        LI[LinkedIn]
        TW[Twitter/X]
        WA[WhatsApp]
        YT[YouTube]
    end
    subgraph "Bell24h-OS"
        subgraph "Content Layer"
            PS[Prompt Studio]
            CP[Content Planner]
            IS[Image Studio]
            VS[Video Studio]
            VOS[Voice Studio]
            AS[Avatar Studio]
            MC[Media Composer]
        end
        subgraph "Distribution Layer"
            PC[Publishing Center]
            AP[Automation Platform]
            CI[Campaign Intelligence]
        end
        subgraph "Intelligence Layer"
            PI[Performance Intel]
            SEI[SEO Intelligence]
            II[Industry Intelligence]
            LE[Learning Engine]
        end
        subgraph "Economic Layer"
            VASE[VASE]
            LED[Ledger]
            BUD[Budget]
        end
        subgraph "Infrastructure"
            JO[Job Orchestrator]
            APM[AI Provider Gateway]
            EM[Enterprise Event Bus]
            ES[(Event Store)]
        end
    end
    PS --> CP
    CP --> IS
    CP --> VS
    CP --> VOS
    IS --> MC
    VS --> MC
    VOS --> MC
    AS --> MC
    MC --> PC
    PC --> GA
    PC --> FB
    PC --> IG
    PC --> LI
    PC --> TW
    PC --> WA
    PC --> YT
    CI --> CP
    PI --> LE
    SEI --> LE
    II --> CP
    LE --> CI
    VASE --> LED
    VASE --> BUD
    APM --> EM
    EM --> ES
    EM --> PI
    EM --> LE""")

    hr()
    return "\n".join(lines)


def part_xii_adrs():
    """12 Architecture Decision Records"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part XII — Architecture Decision Records")
    hr()

    adrs = [
        ("ADR-001", "Event-Driven Architecture over REST", "2026-07-15", "Accepted",
         "Modules must communicate asynchronously via events for loose coupling, auditability, and replay capability.",
         "REST point-to-point calls", "Event Mesh with PostgreSQL outbox"),
        ("ADR-002", "CQRS for Read/Write Separation", "2026-07-15", "Accepted",
         "Separating command and query sides allows independent scaling of read-heavy dashboards from write-heavy generation pipelines.",
         "Single-model CRUD", "CQRS with materialized views"),
        ("ADR-003", "UUIDv7 for All Entity IDs", "2026-07-15", "Accepted",
         "UUIDv7 provides time-ordered, globally unique IDs that are database-index-friendly without coordination.",
         "UUIDv4 (random) or auto-increment", "UUIDv7 with entity prefixes"),
        ("ADR-004", "PostgreSQL Event Store over Dedicated Event DB", "2026-07-15", "Accepted",
         "Using PostgreSQL for the event store avoids additional infrastructure while providing ACID guarantees and JSONB for flexible payloads.",
         "Apache Kafka, EventStoreDB", "PostgreSQL with JSONB"),
        ("ADR-005", "Outbox Pattern for Reliable Publication", "2026-07-15", "Accepted",
         "The outbox pattern ensures atomicity between state changes and event publication, preventing lost events.",
         "Direct event publishing", "Transactional outbox with polling"),
        ("ADR-006", "Inbox Pattern for Idempotent Consumption", "2026-07-15", "Accepted",
         "The inbox pattern prevents duplicate event processing, critical for idempotent operations like cost recording and campaign creation.",
         "No deduplication", "Inbox-based deduplication"),
        ("ADR-007", "BullMQ for Job Queues", "2026-07-15", "Accepted",
         "BullMQ provides Redis-backed job queues with priority, delayed jobs, retry, and rate limiting — essential for AI job orchestration.",
         "Simple Redis lists, RabbitMQ", "BullMQ with Redis"),
        ("ADR-008", "Event Sourcing for Economic Decisions", "2026-07-15", "Accepted",
         "VASE economic decisions must be fully auditable with replay capability for compliance and debugging.",
         "CRUD-only for financials", "Event-sourced ledger with full history"),
        ("ADR-009", "Universal Event Envelope Standard", "2026-07-15", "Accepted",
         "Every event in Bell24h-OS uses the same envelope structure for consistent validation, tracing, and cross-module correlation.",
         "Ad-hoc event formats", "Standardized envelope with 20+ fields"),
        ("ADR-010", "50-Gate Certification for All Modules", "2026-07-15", "Accepted",
         "Every integration contract must pass a 50-gate certification matrix before production deployment.",
         "Manual code review", "Automated certification with gates"),
        ("ADR-011", "Multi-Tenant RLS over Application-Level Isolation", "2026-07-15", "Accepted",
         "PostgreSQL Row-Level Security provides database-level tenant isolation that cannot be bypassed by application bugs.",
         "Application-level WHERE clauses", "PostgreSQL RLS policies"),
        ("ADR-012", "Schema Registry for Event Versioning", "2026-07-15", "Accepted",
         "A centralized schema registry ensures backward compatibility and prevents breaking changes from reaching consumers.",
         "Ad-hoc schema evolution", "Versioned schemas with compatibility checks"),
    ]

    for adr_id, title, date, status, context, decision, consequences in adrs:
        heading(2, f"{adr_id}: {title}")
        table(["Field", "Value"], [
            ["Status", status],
            ["Date", date],
            ["Context", context],
            ["Decision", decision],
            ["Consequences", consequences],
        ])

    hr()
    return "\n".join(lines)


def part_xiii_testing():
    """Testing & Certification"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part XIII — Testing & Certification")
    hr()

    heading(2, "128. Contract Testing")
    w("""Contract tests verify that event producers and consumers agree on the event schema.\n""")
    table(["Test", "Description", "Pass Criteria"], [
        ["Schema Compliance", "Validate event against JSON Schema", "100% fields valid"],
        ["Envelope Completeness", "All required envelope fields present", "0 missing fields"],
        ["Type Safety", "All field types match schema definition", "0 type errors"],
        ["Actor Validation", "Actor type is valid enum value", "0 invalid actors"],
        ["ID Format", "All IDs follow prefix_uuid pattern", "0 malformed IDs"],
        ["Timestamp", "All timestamps are valid ISO 8601", "0 invalid timestamps"],
    ])

    heading(2, "129. Integration Testing")
    table(["Test", "Description", "Pass Criteria"], [
        ["End-to-End Flow", "Campaign creation → content → publishing", "All events emitted in order"],
        ["DLQ Recovery", "Simulate failure → DLQ → retry → success", "Message recovered"],
        ["Concurrent Consumers", "Multiple consumers on same topic", "No duplicate processing"],
        ["Cross-Module Event", "Event from Module A triggers Module B", "Correct processing"],
        ["Schema Evolution", "New optional field added", "Old consumers unaffected"],
    ])

    heading(2, "130. Replay Testing")
    table(["Test", "Description", "Pass Criteria"], [
        ["Full Replay", "Replay 10K events from Event Store", "Read model matches original"],
        ["Filtered Replay", "Replay only campaign events", "Correct subset processed"],
        ["Idempotent Replay", "Replay same events twice", "No duplicate side effects"],
        ["Time-Bounded Replay", "Replay events from specific time range", "Only events in range processed"],
    ])

    heading(2, "131. Load Testing")
    table(["Test", "Description", "Target"], [
        ["Event Throughput", "10,000 events/minute sustained", "< 1% failure rate"],
        ["Queue Depth", "100,000 messages in queue", "Processing within 1 hour"],
        ["Concurrent Consumers", "50 consumers on same topic", "No message loss"],
        ["API Rate Limit", "1,000 requests/minute", "< 0.1% 429 errors"],
        ["Event Store Query", "1M events, complex query", "< 200ms response"],
    ])

    heading(2, "132. Chaos Testing")
    table(["Test", "Description", "Expected Behavior"], [
        ["Provider Failure", "Kill primary AI provider", "Fallback to secondary within 5s"],
        ["Database Failover", "Simulate primary DB failure", "Read replicas serve reads"],
        ["Network Partition", "Isolate one consumer", "Other consumers continue"],
        ["Memory Pressure", "Consume 90% memory", "Graceful degradation"],
        ["Disk Full", "Fill event store disk", "Alert + oldest events archived"],
    ])

    heading(2, "133. Security Testing")
    table(["Test", "Description", "Pass Criteria"], [
        ["Unauthorized Access", "API call without auth", "401 returned"],
        ["Tenant Isolation", "Query events from wrong org", "Empty results (RLS)"],
        ["SQL Injection", "Malicious event payload", "Rejected by validation"],
        ["HMAC Verification", "Tampered event signature", "Signature verification fails"],
        ["Rate Limiting", "Exceed rate limit", "429 with Retry-After header"],
    ])

    heading(2, "134. Disaster Recovery Testing")
    table(["Test", "Description", "RTO/RPO"], [
        ["Event Store Recovery", "Restore from backup", "RTO: 1h, RPO: 5min"],
        ["Full System Restore", "Rebuild from Event Store", "RTO: 4h, RPO: 0"],
        ["Cross-Region Failover", "Failover to secondary region", "RTO: 15min, RPO: 1min"],
    ])

    hr()
    return "\n".join(lines)


def part_xiv_certification():
    """50-Gate Enterprise Certification Matrix"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part XIV — 50-Gate Enterprise Certification Matrix")
    hr()
    w("""> **Every module must pass ALL 50 gates before production deployment.**\n> Each gate has a Requirement, Validation Method, PASS/FAIL Criteria, and Evidence Required.\n""")

    gates = [
        ("GATE-01", "Event Envelope Completeness", "Schema validation tool", "All 20+ envelope fields present", "Validation report"),
        ("GATE-02", "Event ID Format", "Regex validation", "All IDs match {prefix}_uuidv7 pattern", "ID audit log"),
        ("GATE-03", "Correlation ID Propagation", "Trace analysis", "Every event chain has consistent correlation_id", "Trace report"),
        ("GATE-04", "Causation ID Chain", "Trace analysis", "Every event (except root) has valid causation_id", "Causation chain report"),
        ("GATE-05", "Actor Field Validation", "Schema validation", "actor.type is valid enum, actor.id is non-empty", "Validation report"),
        ("GATE-06", "Timestamp Accuracy", "Clock sync check", "All timestamps within 1s of NTP time", "Time sync report"),
        ("GATE-07", "Organization ID Isolation", "RLS test", "Cross-tenant queries return empty", "RLS test report"),
        ("GATE-08", "Outbox Atomicity", "Transaction test", "Event in outbox matches business state", "Atomicity test report"),
        ("GATE-09", "Inbox Deduplication", "Duplicate test", "Duplicate events are skipped", "Dedup test report"),
        ("GATE-10", "DLQ Capture", "Failure test", "Failed events land in DLQ after max retries", "DLQ test report"),
        ("GATE-11", "DLQ Retry Success", "Recovery test", "Retried DLQ messages process successfully", "Recovery report"),
        ("GATE-12", "Schema Compatibility", "Schema registry check", "New schemas are backward compatible", "Compatibility report"),
        ("GATE-13", "Event Ordering (Per-Aggregate)", "Sequence test", "Events for same aggregate are ordered", "Sequence report"),
        ("GATE-14", "Event Ordering (Cross-Aggregate)", "Parallel test", "Cross-aggregate events don't block", "Parallelism report"),
        ("GATE-15", "Idempotent Processing", "Duplicate execution test", "Processing same event twice = same result", "Idempotency report"),
        ("GATE-16", "Consumer Liveness", "Heartbeat check", "All consumers send heartbeats within 30s", "Health report"),
        ("GATE-17", "Consumer Lag Monitoring", "Lag measurement", "Consumer lag < 1000 events", "Lag report"),
        ("GATE-18", "Queue Depth Limits", "Depth monitoring", "No queue exceeds 80% of max depth", "Queue health report"),
        ("GATE-19", "Priority Queue Enforcement", "Priority test", "P0 messages processed before P3", "Priority test report"),
        ("GATE-20", "Retry Backoff Timing", "Timing test", "Retry delays match configured backoff", "Timing report"),
        ("GATE-21", "Circuit Breaker State", "Failure injection", "Circuit opens after threshold failures", "CB state report"),
        ("GATE-22", "Circuit Breaker Recovery", "Recovery test", "Circuit closes after success threshold", "CB recovery report"),
        ("GATE-23", "Provider Failover", "Provider kill test", "Failover completes within 10s", "Failover report"),
        ("GATE-24", "Cost Recording Accuracy", "Financial reconciliation", "Recorded costs match actual API charges", "Reconciliation report"),
        ("GATE-25", "Budget Enforcement", "Budget test", "Spending blocked when budget exceeded", "Budget test report"),
        ("GATE-26", "Kill Switch Functionality", "Kill switch test", "Kill switch halts all spending within 1s", "Kill switch report"),
        ("GATE-27", "Event Store Durability", "Crash test", "Events survive process restart", "Durability report"),
        ("GATE-28", "Event Store Query Performance", "Performance test", "Query 1M events in < 200ms", "Performance report"),
        ("GATE-29", "Audit Trail Completeness", "Audit test", "Every state change has audit event", "Audit coverage report"),
        ("GATE-30", "API Authentication", "Auth test", "All protected endpoints require auth", "Auth test report"),
        ("GATE-31", "API Rate Limiting", "Rate limit test", "Rate limits enforced per tier", "Rate limit report"),
        ("GATE-32", "Webhook Delivery", "Delivery test", "Webhooks delivered within 30s", "Delivery report"),
        ("GATE-33", "SSE Connection Stability", "Connection test", "SSE connections stable for 1 hour", "Stability report"),
        ("GATE-34", "WebSocket Reconnection", "Disconnect test", "Clients reconnect within 5s", "Reconnection report"),
        ("GATE-35", "MCP Tool Compatibility", "MCP protocol test", "All tools respond to MCP calls", "MCP test report"),
        ("GATE-36", "Schema Registry Registration", "Registry test", "All events registered in schema registry", "Registry audit"),
        ("GATE-37", "Contract Emission Compliance", "Contract test", "All emitted events match registered contracts", "Contract audit"),
        ("GATE-38", "Contract Consumption Compliance", "Contract test", "All consumed events match registered contracts", "Contract audit"),
        ("GATE-39", "Tracing Completeness", "Trace test", "Every request has trace_id, span_id", "Trace coverage report"),
        ("GATE-40", "Metrics Collection", "Metrics test", "All required metrics are emitted", "Metrics audit"),
        ("GATE-41", "Error Code Standardization", "Error test", "All errors use standard error codes", "Error code audit"),
        ("GATE-42", "Notification Delivery", "Delivery test", "Notifications delivered within SLA", "Delivery report"),
        ("GATE-43", "Event Retention Compliance", "Retention test", "Events archived/deleted per retention policy", "Retention report"),
        ("GATE-44", "Data Encryption", "Security test", "Sensitive data encrypted at rest and in transit", "Encryption report"),
        ("GATE-45", "Multi-Tenant Data Isolation", "Penetration test", "No cross-tenant data leakage", "Security audit"),
        ("GATE-46", "Graceful Degradation", "Chaos test", "System degrades gracefully under load", "Degradation report"),
        ("GATE-47", "Disaster Recovery", "DR test", "System recovers within RTO after failure", "DR test report"),
        ("GATE-48", "Performance Baseline", "Load test", "Meets all performance targets", "Performance report"),
        ("GATE-49", "Documentation Completeness", "Doc audit", "All APIs, events, contracts documented", "Documentation audit"),
        ("GATE-50", "Certification Sign-Off", "Review board", "Architecture team approves", "Signed certification"),
    ]

    table(["Gate", "Requirement", "Validation Method", "PASS Criteria", "Evidence Required"], gates)

    hr()
    return "\n".join(lines)


def appendices():
    """Appendices A, B, C"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Appendix A — Complete Event Taxonomy")
    hr()
    w("""### Event Count by Category\n""")
    table(["Category", "Prefix", "Events", "First ID", "Last ID"], [
        ["Authentication & User", "user.*", "12", "1", "12"],
        ["Organization", "org.*", "12", "13", "24"],
        ["Content", "content.*", "18", "25", "42"],
        ["Image", "image.*", "13", "43", "55"],
        ["Video", "video.*", "13", "56", "68"],
        ["Voice & Audio", "voice.*, audio.*, podcast.*", "11", "69", "79"],
        ["Avatar", "avatar.*", "9", "80", "88"],
        ["Campaign", "campaign.*", "14", "89", "102"],
        ["Publishing", "publishing.*", "14", "103", "116"],
        ["Job Orchestrator", "job.*", "11", "117", "127"],
        ["Workflow", "workflow.*", "12", "128", "139"],
        ["Automation", "automation.*", "10", "140", "149"],
        ["AI Provider", "provider.*", "11", "150", "160"],
        ["SEO Intelligence", "seo.*", "10", "161", "170"],
        ["Industry Intelligence", "industry.*", "8", "171", "178"],
        ["Performance Intelligence", "performance.*", "8", "179", "186"],
        ["VASE Economic", "economic.*", "12", "187", "198"],
        ["Budget", "budget.*", "12", "199", "210"],
        ["Ledger & Financial", "ledger.*, treasury.*, invoice.*", "11", "211", "221"],
        ["Marketplace", "rfq.*, supplier.*, buyer.*, trust.*, negotiation.*", "14", "222", "235"],
        ["Storage", "storage.*", "10", "236", "245"],
        ["Notification", "notification.*", "9", "246", "254"],
        ["Learning Engine", "learning.*", "9", "255", "263"],
        ["System", "system.*", "11", "264", "274"],
        ["Security", "security.*", "10", "275", "284"],
        ["Analytics", "analytics.*", "10", "285", "294"],
        ["TOTAL", "", "294", "", ""],
    ])

    heading(1, "Appendix B — Error Code Reference")
    hr()
    table(["Error Code", "Category", "Severity", "Retryable", "Description"], [
        ["AUTH_INVALID_TOKEN", "AUTH", "high", "No", "Authentication token invalid or expired"],
        ["AUTH_INSUFFICIENT_PERMISSIONS", "AUTH", "medium", "No", "User lacks required permissions"],
        ["AUTH_RATE_LIMITED", "AUTH", "medium", "Yes", "Too many authentication attempts"],
        ["AI_PROVIDER_TIMEOUT", "AI", "high", "Yes", "AI provider did not respond in time"],
        ["AI_PROVIDER_RATE_LIMITED", "AI", "high", "Yes", "AI provider rate limit exceeded"],
        ["AI_PROVIDER_INVALID_REQUEST", "AI", "medium", "No", "Invalid request to AI provider"],
        ["AI_PROVIDER_QUOTA_EXCEEDED", "AI", "critical", "No", "AI provider quota exhausted"],
        ["AI_PROVIDER_FALLBACK_EXHAUSTED", "AI", "critical", "No", "All AI providers failed"],
        ["JOB_TIMEOUT", "JOB", "high", "Yes", "Job execution timed out"],
        ["JOB_FAILED", "JOB", "high", "Varies", "Job execution failed"],
        ["JOB_CANCELLED", "JOB", "medium", "No", "Job was cancelled by user or system"],
        ["JOB_DLQ", "JOB", "critical", "No", "Job moved to dead letter queue"],
        ["CONTENT_GENERATION_FAILED", "CONTENT", "high", "Yes", "AI content generation failed"],
        ["CONTENT_QA_FAILED", "CONTENT", "medium", "No", "Content failed quality assurance"],
        ["CONTENT_APPROVAL_TIMEOUT", "CONTENT", "medium", "No", "Content approval timed out"],
        ["MEDIA_STORAGE_FULL", "MEDIA", "critical", "No", "Storage quota exceeded"],
        ["MEDIA_UPLOAD_FAILED", "MEDIA", "medium", "Yes", "File upload failed"],
        ["SEO_DATA_STALE", "SEO", "low", "Yes", "SEO data is older than expected"],
        ["VASE_BUDGET_EXCEEDED", "VASE", "critical", "No", "Budget limit exceeded"],
        ["VASE_KILL_SWITCH", "VASE", "critical", "No", "Kill switch activated"],
        ["VASE_INSUFFICIENT_FUNDS", "VASE", "critical", "No", "Insufficient treasury balance"],
        ["VASE_COST_ANOMALY", "VASE", "high", "No", "Cost anomaly detected"],
        ["PUBLISH_PLATFORM_ERROR", "PUBLISH", "high", "Yes", "Publishing platform returned error"],
        ["PUBLISH_AUTH_EXPIRED", "PUBLISH", "high", "Yes", "Platform auth token expired"],
        ["PUBLISH_RATE_LIMITED", "PUBLISH", "medium", "Yes", "Platform rate limit hit"],
        ["WORKFLOW_STEP_FAILED", "WORKFLOW", "high", "Varies", "Workflow step execution failed"],
        ["SYSTEM_SERVICE_UNAVAILABLE", "SYSTEM", "critical", "Yes", "Required service is unavailable"],
        ["SYSTEM_DATABASE_ERROR", "SYSTEM", "critical", "Yes", "Database operation failed"],
        ["SYSTEM_CONFIG_ERROR", "SYSTEM", "high", "No", "Invalid system configuration"],
        ["SECURITY_UNAUTHORIZED", "SECURITY", "critical", "No", "Unauthorized access attempt"],
        ["SECURITY_SUSPICIOUS", "SECURITY", "high", "No", "Suspicious activity detected"],
        ["MARKETPLACE_RFQ_EXPIRED", "MARKETPLACE", "medium", "No", "RFQ has expired"],
        ["MARKETPLACE_VERIFICATION_FAILED", "MARKETPLACE", "high", "No", "Supplier/buyer verification failed"],
        ["STORAGE_UPLOAD_FAILED", "STORAGE", "medium", "Yes", "File upload to storage failed"],
        ["STORAGE_CDN_ERROR", "STORAGE", "low", "Yes", "CDN cache operation failed"],
        ["INTEGRATION_WEBHOOK_FAILED", "INTEGRATION", "medium", "Yes", "Webhook delivery failed"],
        ["INTEGRATION_SCHEMA_MISMATCH", "INTEGRATION", "high", "No", "Event schema does not match registered schema"],
    ])

    heading(1, "Appendix C — Version History")
    hr()
    table(["Version", "Date", "Author", "Changes"], [
        ["1.0", TODAY, "Bell24h-OS Architecture Team", "Initial release — Enterprise Integration Contracts & Event Mesh"],
    ])

    # Metrics summary
    hr()
    heading(1, "Document Metrics Summary")
    hr()
    w("""| Metric | Count |
|---|---|
| CREATE TABLE statements | 20 |
| CREATE INDEX statements | 47 |
| CREATE POLICY statements | 34 |
| Mermaid Diagrams | 20 |
| Architecture Decision Records | 12 |
| JSON Schema definitions | 2 |
| TypeScript Interface definitions | 8 |
| Event Catalogue entries | 294 |
| Error Codes | 37 |
| API Endpoints | 28 |
| Integration Contracts | 16 |
| Certification Gates | 50 |
| REST API endpoints | 28 |
| Webhook contracts | 4 |
| Views | 5 |
| Trigger functions | 3 |
| Stored functions | 2 |
""")

    hr()
    w("\n**END OF VOLUME 03G — Enterprise Integration Contracts, Event Mesh & Universal Messaging Standards**\n")
    w(f"\n*Document generated on {TODAY} by Bell24h-OS Architecture Team.*\n")

    hr()
    return "\n".join(lines)


# Need TODAY for appendices
import datetime
TODAY = datetime.date.today().isoformat()
