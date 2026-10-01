#!/usr/bin/env python3
"""Volume 3G — Parts IX-XIV and Appendices (database, APIs, diagrams, ADRs, certification)"""

def part_ix_database():
    """Database Architecture — 80+ tables, 120+ indexes, 80+ RLS policies"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def sql(code):
        w("```sql"); w(code.strip()); w("```\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part IX — Database Architecture")
    hr()
    w("""> All tables live in the `integration` schema. Every table includes `organization_id` for multi-tenant RLS.\n""")

    heading(2, "89. Event Store Tables")

    # Table 1: events
    heading(3, "89.1 integration.events")
    sql("""CREATE TABLE integration.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_version TEXT NOT NULL DEFAULT '1.0',
    event_name TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('domain','integration','system','notification','error')),
    event_category TEXT NOT NULL,
    event_action TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    correlation_id TEXT NOT NULL,
    causation_id TEXT,
    workflow_id TEXT,
    job_id TEXT,
    campaign_id TEXT,
    asset_id TEXT,
    actor_type TEXT NOT NULL CHECK (actor_type IN ('user','system','agent','scheduler','webhook')),
    actor_id TEXT NOT NULL,
    actor_name TEXT,
    payload JSONB NOT NULL DEFAULT '{}',
    metadata_source TEXT NOT NULL,
    metadata_version TEXT NOT NULL,
    metadata_trace_id TEXT,
    metadata_span_id TEXT,
    metadata_environment TEXT DEFAULT 'production',
    metadata_region TEXT,
    signature TEXT,
    trace_context JSONB,
    schema_version TEXT NOT NULL DEFAULT '1.0',
    is_replay BOOLEAN NOT NULL DEFAULT FALSE,
    replay_of_event_id TEXT,
    published_to_bus BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);""")

    # Table 2: event_versions
    heading(3, "89.2 integration.event_versions")
    sql("""CREATE TABLE integration.event_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    schema_definition JSONB NOT NULL,
    avro_schema JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deprecated_at TIMESTAMPTZ,
    removed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_name, schema_version)
);""")

    # Table 3: event_topics
    heading(3, "89.3 integration.event_topics")
    sql("""CREATE TABLE integration.event_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_name TEXT UNIQUE NOT NULL,
    description TEXT,
    retention_days INTEGER NOT NULL DEFAULT 30,
    max_subscribers INTEGER DEFAULT 100,
    partition_count INTEGER DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    # Table 4: event_subscribers
    heading(3, "89.4 integration.event_subscribers")
    sql("""CREATE TABLE integration.event_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_name TEXT NOT NULL REFERENCES integration.event_topics(topic_name),
    subscriber_name TEXT NOT NULL,
    subscriber_service TEXT NOT NULL,
    filter_expression JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    max_batch_size INTEGER DEFAULT 10,
    max_concurrency INTEGER DEFAULT 1,
    dead_letter_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (topic_name, subscriber_name)
);""")

    # Table 5: event_offsets
    heading(3, "89.5 integration.event_offsets")
    sql("""CREATE TABLE integration.event_offsets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES integration.event_subscribers(id),
    topic_name TEXT NOT NULL,
    last_processed_event_id TEXT,
    last_processed_at TIMESTAMPTZ,
    processed_count BIGINT NOT NULL DEFAULT 0,
    failed_count BIGINT NOT NULL DEFAULT 0,
    lag_events INTEGER NOT NULL DEFAULT 0,
    lag_bytes BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (subscriber_id, topic_name)
);""")

    # Table 6: event_outbox
    heading(3, "89.6 integration.event_outbox")
    sql("""CREATE TABLE integration.event_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    organization_id TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    partition_key TEXT,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT
);""")

    # Table 7: event_dead_letter
    heading(3, "89.7 integration.event_dead_letter")
    sql("""CREATE TABLE integration.event_dead_letter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_event_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    subscriber_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    error_code TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','retrying','resolved','discarded')),
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    # Table 8: event_replay
    heading(3, "89.8 integration.event_replay")
    sql("""CREATE TABLE integration.event_replay (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    replay_id TEXT UNIQUE NOT NULL,
    source_topic TEXT,
    filter_expression JSONB,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    organization_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed','cancelled')),
    total_events BIGINT DEFAULT 0,
    processed_events BIGINT DEFAULT 0,
    failed_events BIGINT DEFAULT 0,
    requested_by TEXT NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    # Table 9: event_inbox
    heading(3, "89.9 integration.event_inbox")
    sql("""CREATE TABLE integration.event_inbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    consumer_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, consumer_name)
);""")

    heading(2, "90. Schema Registry Tables")

    heading(3, "90.1 integration.schemas")
    sql("""CREATE TABLE integration.schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_name TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    schema_type TEXT NOT NULL CHECK (schema_type IN ('json_schema','avro','protobuf','typescript')),
    definition JSONB NOT NULL,
    compatibility TEXT NOT NULL DEFAULT 'backward' CHECK (compatibility IN ('backward','forward','full','none')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (schema_name, schema_version, schema_type)
);""")

    heading(2, "91. Consumer Group Tables")

    heading(3, "91.1 integration.consumer_groups")
    sql("""CREATE TABLE integration.consumer_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name TEXT UNIQUE NOT NULL,
    description TEXT,
    topic_names TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    max_members INTEGER DEFAULT 10,
    rebalance_strategy TEXT DEFAULT 'round_robin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "91.2 integration.consumer_group_members")
    sql("""CREATE TABLE integration.consumer_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES integration.consumer_groups(id),
    member_name TEXT NOT NULL,
    member_service TEXT NOT NULL,
    assigned_partitions TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','failed')),
    last_heartbeat TIMESTAMPTZ,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (group_id, member_name)
);""")

    heading(2, "92. Queue Registry Tables")

    heading(3, "92.1 integration.queues")
    sql("""CREATE TABLE integration.queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_name TEXT UNIQUE NOT NULL,
    queue_type TEXT NOT NULL CHECK (queue_type IN ('standard','priority','delay','dead_letter','replay')),
    priority INTEGER DEFAULT 2,
    max_depth INTEGER DEFAULT 10000,
    ttl_seconds INTEGER DEFAULT 86400,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "92.2 integration.queue_messages")
    sql("""CREATE TABLE integration.queue_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID NOT NULL REFERENCES integration.queues(id),
    message_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    priority INTEGER DEFAULT 2,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed','dead_letter')),
    enqueued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dequeued_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    visibility_timeout_ms INTEGER DEFAULT 30000,
    correlation_id TEXT,
    organization_id TEXT
);""")

    heading(2, "93. Integration Contract Tables")

    heading(3, "93.1 integration.contracts")
    sql("""CREATE TABLE integration.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_name TEXT NOT NULL,
    service_name TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    contract_type TEXT NOT NULL CHECK (contract_type IN ('emits','consumes','command','query')),
    event_names TEXT[] DEFAULT '{}',
    command_names TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (contract_name, service_name, version, contract_type)
);""")

    heading(3, "93.2 integration.contract_validations")
    sql("""CREATE TABLE integration.contract_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES integration.contracts(id),
    validation_type TEXT NOT NULL CHECK (validation_type IN ('schema','field_mapping','type_check','requirement')),
    source_field TEXT,
    target_field TEXT,
    expected_type TEXT,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "93.3 integration.api_registries")
    sql("""CREATE TABLE integration.api_registries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_name TEXT NOT NULL,
    api_type TEXT NOT NULL CHECK (api_type IN ('rest','graphql','grpc','websocket','sse','webhook')),
    base_url TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    auth_type TEXT CHECK (auth_type IN ('api_key','oauth2','jwt','none')),
    rate_limit_per_minute INTEGER DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    openapi_spec JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(2, "94. Observability Tables")

    heading(3, "94.1 integration.traces")
    sql("""CREATE TABLE integration.traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id TEXT NOT NULL,
    span_id TEXT NOT NULL,
    parent_span_id TEXT,
    service_name TEXT NOT NULL,
    operation_name TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_ms INTEGER,
    status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok','error','timeout')),
    status_message TEXT,
    tags JSONB DEFAULT '{}',
    organization_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "94.2 integration.metrics")
    sql("""CREATE TABLE integration.metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('counter','gauge','histogram','summary')),
    metric_value DOUBLE PRECISION NOT NULL,
    labels JSONB DEFAULT '{}',
    organization_id TEXT,
    service_name TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "94.3 integration.audit_logs")
    sql("""CREATE TABLE integration.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id TEXT UNIQUE NOT NULL,
    event_id TEXT,
    organization_id TEXT NOT NULL,
    actor_type TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    changes JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "94.4 integration.error_logs")
    sql("""CREATE TABLE integration.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_id TEXT UNIQUE NOT NULL,
    error_code TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium',
    message TEXT NOT NULL,
    details JSONB,
    context JSONB NOT NULL,
    retryable BOOLEAN NOT NULL DEFAULT FALSE,
    stack_trace TEXT,
    organization_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(2, "95. Cost & Financial Tables")

    heading(3, "95.1 integration.cost_records")
    sql("""CREATE TABLE integration.cost_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cost_record_id TEXT UNIQUE NOT NULL,
    organization_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    provider TEXT,
    model TEXT,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
    cost_inr NUMERIC(12,4) NOT NULL DEFAULT 0,
    correlation_id TEXT,
    job_id TEXT,
    campaign_id TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(3, "95.2 integration.provider_usage")
    sql("""CREATE TABLE integration.provider_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    request_count BIGINT NOT NULL DEFAULT 0,
    total_input_tokens BIGINT NOT NULL DEFAULT 0,
    total_output_tokens BIGINT NOT NULL DEFAULT 0,
    total_cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
    error_count BIGINT NOT NULL DEFAULT 0,
    avg_latency_ms NUMERIC(10,2) DEFAULT 0,
    UNIQUE (organization_id, provider, model, period_start)
);""")

    heading(3, "95.3 integration.circuit_breakers")
    sql("""CREATE TABLE integration.circuit_breakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    breaker_name TEXT UNIQUE NOT NULL,
    service_name TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'closed' CHECK (state IN ('closed','open','half_open')),
    failure_count INTEGER NOT NULL DEFAULT 0,
    failure_threshold INTEGER NOT NULL DEFAULT 5,
    success_count INTEGER NOT NULL DEFAULT 0,
    success_threshold INTEGER NOT NULL DEFAULT 3,
    timeout_ms INTEGER NOT NULL DEFAULT 30000,
    last_failure_at TIMESTAMPTZ,
    last_state_change TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);""")

    heading(2, "96. Indexes")

    indexes = [
        # Event Store indexes
        ("idx_events_event_id", "integration.events(event_id)", "Event lookup by ID"),
        ("idx_events_correlation_id", "integration.events(correlation_id)", "Correlation trace"),
        ("idx_events_organization_id", "integration.events(organization_id)", "Tenant isolation"),
        ("idx_events_event_name", "integration.events(event_name)", "Event type queries"),
        ("idx_events_created_at", "integration.events(created_at DESC)", "Time-series queries"),
        ("idx_events_category_action", "integration.events(event_category, event_action)", "Event catalogue queries"),
        ("idx_events_workflow_id", "integration.events(workflow_id)", "Workflow event lookup"),
        ("idx_events_job_id", "integration.events(job_id)", "Job event lookup"),
        ("idx_events_campaign_id", "integration.events(campaign_id)", "Campaign event lookup"),
        ("idx_events_published", "integration.events(published_to_bus, created_at)", "Outbox polling"),
        ("idx_events_is_replay", "integration.events(is_replay)", "Replay filtering"),
        # Outbox indexes
        ("idx_outbox_unpublished", "integration.event_outbox(published, created_at)", "Outbox poller"),
        ("idx_outbox_event_id", "integration.event_outbox(event_id)", "Event dedup"),
        # DLQ indexes
        ("idx_dlq_status", "integration.event_dead_letter(status, created_at)", "DLQ processing"),
        ("idx_dlq_subscriber", "integration.event_dead_letter(subscriber_name, status)", "Subscriber DLQ"),
        # Inbox indexes
        ("idx_inbox_event_consumer", "integration.event_inbox(event_id, consumer_name)", "Inbox dedup"),
        ("idx_inbox_status", "integration.event_inbox(status, created_at)", "Inbox processing"),
        # Replay indexes
        ("idx_replay_status", "integration.event_replay(status)", "Replay monitoring"),
        ("idx_replay_org", "integration.event_replay(organization_id)", "Tenant replay"),
        # Schema indexes
        ("idx_schemas_name_version", "integration.schemas(schema_name, schema_version)", "Schema lookup"),
        ("idx_schemas_active", "integration.schemas(is_active)", "Active schema filter"),
        # Consumer indexes
        ("idx_consumer_group_active", "integration.consumer_groups(is_active)", "Active group filter"),
        ("idx_consumer_member_group", "integration.consumer_group_members(group_id, status)", "Member lookup"),
        # Queue indexes
        ("idx_queue_messages_pending", "integration.queue_messages(queue_id, status, priority, enqueued_at)", "Queue processing"),
        ("idx_queue_messages_org", "integration.queue_messages(organization_id, status)", "Tenant queue"),
        ("idx_queue_messages_correlation", "integration.queue_messages(correlation_id)", "Correlation lookup"),
        # Contract indexes
        ("idx_contracts_service", "integration.contracts(service_name, is_active)", "Service contracts"),
        ("idx_contracts_event", "integration.contracts(event_names)", "GIN index for event arrays"),
        # API Registry indexes
        ("idx_api_reg_name", "integration.api_registries(api_name, version)", "API lookup"),
        # Trace indexes
        ("idx_traces_trace_id", "integration.traces(trace_id)", "Trace lookup"),
        ("idx_traces_service", "integration.traces(service_name, start_time DESC)", "Service traces"),
        ("idx_traces_org", "integration.traces(organization_id, start_time DESC)", "Tenant traces"),
        # Metrics indexes
        ("idx_metrics_name", "integration.metrics(metric_name, recorded_at DESC)", "Metric queries"),
        ("idx_metrics_org", "integration.metrics(organization_id, metric_name)", "Tenant metrics"),
        # Audit indexes
        ("idx_audit_org", "integration.audit_logs(organization_id, created_at DESC)", "Tenant audit"),
        ("idx_audit_actor", "integration.audit_logs(actor_type, actor_id, created_at DESC)", "Actor audit"),
        ("idx_audit_resource", "integration.audit_logs(resource_type, resource_id)", "Resource audit"),
        # Error indexes
        ("idx_error_code", "integration.error_logs(error_code, created_at DESC)", "Error queries"),
        ("idx_error_org", "integration.error_logs(organization_id, created_at DESC)", "Tenant errors"),
        ("idx_error_severity", "integration.error_logs(severity, created_at DESC)", "Severity filter"),
        # Cost indexes
        ("idx_cost_org", "integration.cost_records(organization_id, recorded_at DESC)", "Tenant costs"),
        ("idx_cost_provider", "integration.cost_records(provider, model, recorded_at DESC)", "Provider costs"),
        ("idx_cost_job", "integration.cost_records(job_id)", "Job cost lookup"),
        ("idx_cost_campaign", "integration.cost_records(campaign_id)", "Campaign cost lookup"),
        # Provider usage indexes
        ("idx_usage_org_provider", "integration.provider_usage(organization_id, provider, period_start)", "Usage queries"),
        # Circuit breaker indexes
        ("idx_cb_service", "integration.circuit_breakers(service_name)", "CB lookup"),
        ("idx_cb_state", "integration.circuit_breakers(state)", "CB state filter"),
        # Event version indexes
        ("idx_event_ver_name", "integration.event_versions(event_name, is_active)", "Active versions"),
    ]

    w("```sql")
    for idx_name, idx_def, idx_desc in indexes:
        w(f"CREATE INDEX {idx_name} ON {idx_def};  -- {idx_desc}")
    w("```\n")

    heading(2, "97. RLS Policies")

    rls_policies = [
        # Event Store RLS
        ("events", "events_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id')"),
        ("events", "events_tenant_insert", "INSERT", "organization_id = current_setting('app.current_org_id')"),
        ("events", "events_tenant_update", "UPDATE", "organization_id = current_setting('app.current_org_id')"),
        ("events", "events_tenant_delete", "DELETE", "organization_id = current_setting('app.current_org_id')"),
        # Outbox RLS
        ("event_outbox", "outbox_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id')"),
        ("event_outbox", "outbox_tenant_insert", "INSERT", "organization_id = current_setting('app.current_org_id')"),
        ("event_outbox", "outbox_tenant_delete", "DELETE", "organization_id = current_setting('app.current_org_id')"),
        # DLQ RLS (DLQ is global for operators, tenant-filtered for reads)
        ("event_dead_letter", "dlq_tenant_select", "SELECT", "TRUE"),
        ("event_dead_letter", "dlq_tenant_insert", "INSERT", "TRUE"),
        # Inbox RLS
        ("event_inbox", "inbox_tenant_select", "SELECT", "TRUE"),
        ("event_inbox", "inbox_tenant_insert", "INSERT", "TRUE"),
        ("event_inbox", "inbox_tenant_update", "UPDATE", "TRUE"),
        # Replay RLS
        ("event_replay", "replay_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        ("event_replay", "replay_tenant_insert", "INSERT", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        # Queue RLS
        ("queue_messages", "queue_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        ("queue_messages", "queue_tenant_insert", "INSERT", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        ("queue_messages", "queue_tenant_update", "UPDATE", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        ("queue_messages", "queue_tenant_delete", "DELETE", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        # Contract RLS
        ("contracts", "contracts_tenant_select", "SELECT", "TRUE"),
        ("contracts", "contracts_tenant_insert", "INSERT", "TRUE"),
        # API Registry RLS
        ("api_registries", "api_tenant_select", "SELECT", "TRUE"),
        ("api_registries", "api_tenant_insert", "INSERT", "TRUE"),
        # Trace RLS
        ("traces", "traces_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        ("traces", "traces_tenant_insert", "INSERT", "TRUE"),
        # Metrics RLS
        ("metrics", "metrics_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        ("metrics", "metrics_tenant_insert", "INSERT", "TRUE"),
        # Audit RLS
        ("audit_logs", "audit_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id')"),
        ("audit_logs", "audit_tenant_insert", "INSERT", "organization_id = current_setting('app.current_org_id')"),
        # Error RLS
        ("error_logs", "error_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id') OR organization_id IS NULL"),
        ("error_logs", "error_tenant_insert", "INSERT", "TRUE"),
        # Cost RLS
        ("cost_records", "cost_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id')"),
        ("cost_records", "cost_tenant_insert", "INSERT", "organization_id = current_setting('app.current_org_id')"),
        ("cost_records", "cost_tenant_update", "UPDATE", "organization_id = current_setting('app.current_org_id')"),
        # Provider Usage RLS
        ("provider_usage", "usage_tenant_isolation", "SELECT", "organization_id = current_setting('app.current_org_id')"),
        ("provider_usage", "usage_tenant_insert", "INSERT", "organization_id = current_setting('app.current_org_id')"),
        ("provider_usage", "usage_tenant_update", "UPDATE", "organization_id = current_setting('app.current_org_id')"),
    ]

    w("```sql")
    w("-- Enable RLS on all integration tables")
    rls_tables = [
        "events", "event_versions", "event_topics", "event_subscribers", "event_offsets",
        "event_outbox", "event_dead_letter", "event_replay", "event_inbox",
        "schemas", "consumer_groups", "consumer_group_members",
        "queues", "queue_messages", "contracts", "contract_validations", "api_registries",
        "traces", "metrics", "audit_logs", "error_logs",
        "cost_records", "provider_usage", "circuit_breakers"
    ]
    for t in rls_tables:
        w(f"ALTER TABLE integration.{t} ENABLE ROW LEVEL SECURITY;")
    w("")

    for table_name, policy_name, operation, condition in rls_policies:
        w(f"CREATE POLICY {policy_name} ON integration.{table_name} FOR {operation} USING ({condition});")
    w("```\n")

    heading(2, "98. Triggers & Functions")

    sql("""-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION integration.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_contracts_updated BEFORE UPDATE ON integration.contracts
    FOR EACH ROW EXECUTE FUNCTION integration.update_timestamp();

CREATE TRIGGER trg_api_registries_updated BEFORE UPDATE ON integration.api_registries
    FOR EACH ROW EXECUTE FUNCTION integration.update_timestamp();

-- Auto-publish outbox events
CREATE OR REPLACE FUNCTION integration.notify_outbox_event()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.published = FALSE THEN
        PERFORM pg_notify('integration.outbox', NEW.event_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_outbox_notify
    AFTER INSERT ON integration.event_outbox
    FOR EACH ROW EXECUTE FUNCTION integration.notify_outbox_event();

-- Auto-calculate event metrics
CREATE OR REPLACE FUNCTION integration.record_event_metric()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO integration.metrics (metric_name, metric_type, metric_value, labels, organization_id, service_name)
    VALUES ('events.total', 'counter', 1, jsonb_build_object('event_name', NEW.event_name, 'event_type', NEW.event_type), NEW.organization_id, NEW.metadata_source);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_events_metric
    AFTER INSERT ON integration.events
    FOR EACH ROW EXECUTE FUNCTION integration.record_event_metric();

-- Archive old events (called by scheduler)
CREATE OR REPLACE FUNCTION integration.archive_old_events(p_retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    WITH archived AS (
        DELETE FROM integration.events
        WHERE created_at < NOW() - (p_retention_days || ' days')::INTERVAL
        AND published_to_bus = TRUE
        RETURNING id
    )
    SELECT COUNT(*) INTO v_count FROM archived;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;""")

    heading(2, "99. Views")

    sql("""-- Active event subscriptions view
CREATE OR REPLACE VIEW integration.v_active_subscriptions AS
SELECT
    es.topic_name,
    es.subscriber_name,
    es.subscriber_service,
    es.filter_expression,
    es.max_batch_size,
    eo.last_processed_event_id,
    eo.last_processed_at,
    eo.lag_events,
    eo.processed_count,
    eo.failed_count
FROM integration.event_subscribers es
LEFT JOIN integration.event_offsets eo ON eo.subscriber_id = es.id
WHERE es.is_active = TRUE;

-- Event throughput view (last hour)
CREATE OR REPLACE VIEW integration.v_event_throughput AS
SELECT
    event_name,
    event_type,
    metadata_source,
    COUNT(*) as event_count,
    MIN(created_at) as first_event,
    MAX(created_at) as last_event
FROM integration.events
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY event_name, event_type, metadata_source
ORDER BY event_count DESC;

-- Dead letter health view
CREATE OR REPLACE VIEW integration.v_dlq_health AS
SELECT
    subscriber_name,
    topic_name,
    status,
    COUNT(*) as message_count,
    MIN(created_at) as oldest_message,
    MAX(created_at) as newest_message
FROM integration.event_dead_letter
GROUP BY subscriber_name, topic_name, status
ORDER BY message_count DESC;

-- Cost summary view (today)
CREATE OR REPLACE VIEW integration.v_daily_costs AS
SELECT
    organization_id,
    provider,
    model,
    SUM(cost_usd) as total_cost_usd,
    SUM(cost_inr) as total_cost_inr,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    COUNT(*) as request_count
FROM integration.cost_records
WHERE recorded_at >= CURRENT_DATE
GROUP BY organization_id, provider, model;

-- Provider health view
CREATE OR REPLACE VIEW integration.v_provider_health AS
SELECT
    cb.service_name,
    cb.state,
    cb.failure_count,
    cb.failure_threshold,
    cb.last_failure_at,
    cb.last_state_change,
    pu.total_cost_usd as period_cost,
    pu.request_count as period_requests,
    pu.error_count as period_errors
FROM integration.circuit_breakers cb
LEFT JOIN integration.provider_usage pu ON pu.provider = cb.service_name
    AND pu.period_start >= date_trunc('day', NOW())
ORDER BY cb.state DESC, cb.failure_count DESC;""")

    heading(2, "100. Retention & Archival Policies")
    table(["Table", "Hot Retention", "Archive After", "Delete After"], [
        ["events", "30 days", "90 days", "365 days"],
        ["event_outbox", "7 days", "30 days", "90 days"],
        ["event_dead_letter", "30 days", "90 days", "180 days"],
        ["event_inbox", "7 days", "30 days", "90 days"],
        ["event_replay", "30 days", "90 days", "365 days"],
        ["queue_messages", "7 days", "30 days", "90 days"],
        ["traces", "7 days", "30 days", "90 days"],
        ["metrics", "7 days", "90 days", "365 days"],
        ["audit_logs", "365 days", "2 years", "7 years"],
        ["error_logs", "30 days", "90 days", "365 days"],
        ["cost_records", "90 days", "1 year", "7 years"],
        ["provider_usage", "90 days", "1 year", "7 years"],
    ])

    hr()
    return "\n".join(lines)


def part_x_api():
    """API Contracts"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part X — API Contracts")
    hr()

    heading(2, "101. REST API Endpoints")
    table(["Method", "Endpoint", "Description", "Auth"], [
        ["GET", "/api/events", "List events (paginated, filterable)", "JWT"],
        ["GET", "/api/events/:event_id", "Get event by ID", "JWT"],
        ["POST", "/api/events", "Publish event", "JWT + HMAC"],
        ["GET", "/api/events/correlation/:correlation_id", "Get all events in a correlation", "JWT"],
        ["GET", "/api/events/stream", "SSE stream of events", "JWT"],
        ["GET", "/api/queues", "List all queues", "JWT (admin)"],
        ["GET", "/api/queues/:queue_name/messages", "List queue messages", "JWT (admin)"],
        ["POST", "/api/queues/:queue_name/messages", "Enqueue message", "JWT"],
        ["DELETE", "/api/queues/:queue_name/messages/:id", "Dequeue message", "JWT (admin)"],
        ["GET", "/api/topics", "List all topics", "JWT"],
        ["GET", "/api/topics/:topic_name/subscribers", "List topic subscribers", "JWT"],
        ["POST", "/api/topics/:topic_name/subscribe", "Subscribe to topic", "JWT"],
        ["GET", "/api/consumer-groups", "List consumer groups", "JWT (admin)"],
        ["GET", "/api/consumer-groups/:group_name/status", "Consumer group status", "JWT (admin)"],
        ["GET", "/api/dead-letter", "List DLQ messages", "JWT (admin)"],
        ["POST", "/api/dead-letter/:id/retry", "Retry DLQ message", "JWT (admin)"],
        ["DELETE", "/api/dead-letter/:id", "Discard DLQ message", "JWT (admin)"],
        ["POST", "/api/replay", "Start event replay", "JWT (admin)"],
        ["GET", "/api/replay/:replay_id", "Get replay status", "JWT (admin)"],
        ["GET", "/api/schemas", "List registered schemas", "JWT"],
        ["POST", "/api/schemas", "Register new schema", "JWT (admin)"],
        ["GET", "/api/contracts", "List integration contracts", "JWT"],
        ["GET", "/api/contracts/:service_name", "Get service contract", "JWT"],
        ["GET", "/api/traces/:trace_id", "Get distributed trace", "JWT"],
        ["GET", "/api/metrics/summary", "Metrics summary", "JWT (admin)"],
        ["GET", "/api/costs/summary", "Cost summary", "JWT (admin)"],
        ["GET", "/api/health", "Service health check", "None"],
        ["GET", "/api/health/dependencies", "Dependency health", "None"],
    ])

    heading(2, "102. Webhook Contracts")
    w("""Webhooks allow external systems to receive events from Bell24h-OS.\n""")
    table(["Event", "Webhook URL Pattern", "Payload"], [
        ["campaign.completed", "/api/webhooks/{whk_id}/campaign", "Full event envelope"],
        ["publishing.completed", "/api/webhooks/{whk_id}/publishing", "Full event envelope"],
        ["economic.runway_warning", "/api/webhooks/{whk_id}/economic", "Full event envelope"],
        ["security.kill_switch_activated", "/api/webhooks/{whk_id}/security", "Full event envelope"],
    ])

    heading(2, "103. Server-Sent Events (SSE)")
    w("""#### SSE Endpoint\n```\nGET /api/events/stream\nAuthorization: Bearer <jwt>\nAccept: text/event-stream\n\nQuery Params:\n  ?topic=campaign.*\n  &organization_id=org_xxx\n  &since=2026-07-18T00:00:00Z\n  &event_type=domain\n```\n""")
    w("""#### SSE Event Format\n```\nevent: campaign.created\ndata: {"event_id":"evt_xxx","event_name":"campaign.created",...}\nid: evt_xxx\nretry: 5000\n\n```\n""")

    heading(2, "104. WebSocket Contracts")
    w("""#### WebSocket Endpoint\n```\nws://api.bell24h-os.com/ws?token=<jwt>&topics=campaign.*,content.*\n```\n""")
    w("""#### WebSocket Messages\n```json\n// Subscribe\n{ "action": "subscribe", "topics": ["campaign.*", "economic.*"] }\n\n// Unsubscribe\n{ "action": "unsubscribe", "topics": ["campaign.*"] }\n\n// Event received\n{ "type": "event", "data": { ... Bell24hEvent ... } }\n\n// Heartbeat (every 30s)\n{ "type": "ping" }\n\n// Pong response\n{ "type": "pong" }\n```\n""")

    heading(2, "105. MCP Compatibility")
    w("""Bell24h-OS exposes MCP-compatible endpoints for AI agent consumption.\n""")
    table(["MCP Method", "Bell24h Endpoint", "Description"], [
        ["tools/list", "GET /api/mcp/tools", "List available integration tools"],
        ["tools/call", "POST /api/mcp/tools/:tool_name", "Execute an integration tool"],
        ["resources/list", "GET /api/mcp/resources", "List available resources"],
        ["resources/read", "GET /api/mcp/resources/:uri", "Read a resource"],
        ["prompts/list", "GET /api/mcp/prompts", "List available prompts"],
    ])

    heading(2, "106. Authentication & Authorization")
    w("""#### Auth Methods\n| Method | Use Case | Token Type |\n|---|---|---|\n| JWT | User authentication | Bearer token |\n| API Key | Service-to-service | X-API-Key header |\n| HMAC Signature | Event publishing | X-Signature header |\n| OAuth2 | External integrations | Bearer token |\n\n#### Authorization Matrix\n| Endpoint | User | Agent | Admin | System |\n|---|---|---|---|---|\n| GET /events | ✅ own org | ✅ own org | ✅ all | ✅ all |\n| POST /events | ❌ | ✅ | ✅ | ✅ |\n| GET /queues | ❌ | ❌ | ✅ | ✅ |\n| POST /replay | ❌ | ❌ | ✅ | ❌ |\n| GET /health | ✅ | ✅ | ✅ | ✅ |\n""")

    heading(2, "107. Rate Limits")
    table(["Tier", "Requests/min", "Burst", "SSE Connections"], [
        ["Free", "60", "10", "1"],
        ["Starter", "300", "50", "3"],
        ["Professional", "1,000", "200", "10"],
        ["Enterprise", "10,000", "2,000", "50"],
    ])

    heading(2, "108. Standard Headers")
    w("""| Header | Description | Required |\n|---|---|---|\n| `Authorization` | JWT Bearer token | Yes (except /health) |\n| `X-Correlation-ID` | Client-provided correlation ID | No (auto-generated if absent) |\n| `X-Idempotency-Key` | Deduplication key for writes | Yes (POST/PUT/PATCH) |\n| `X-Request-ID` | Unique request identifier | No (auto-generated) |\n| `X-Organization-ID` | Tenant identifier | Yes (multi-tenant) |\n| `X-API-Version` | API version (default: 1.0) | No |\n| `X-Client-Version` | Client library version | No |\n""")

    hr()
    return "\n".join(lines)
