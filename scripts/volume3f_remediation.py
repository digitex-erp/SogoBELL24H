#!/usr/bin/env python3
"""Volume 3F VASE Remediation Script — Appends missing DDL, RLS, functions, triggers, views, diagrams, and expanded contracts."""

import os

TARGET_FILE = "docs/03F-vase-autonomous-economic-survival-engine.md"

# Find the insertion point: just before "## Part XXII — 40-Gate Certification Matrix"
with open(TARGET_FILE, "r") as f:
    content = f.read()

# We insert BEFORE the certification matrix
INSERT_MARKER = "## Part XXII — 40-Gate Certification Matrix"
insert_idx = content.index(INSERT_MARKER)

remediation = r"""
---

## Part XXIV — Missing Table DDL (Remediation)

The following tables were listed in Section 62 as VASE new tables but lacked CREATE TABLE DDL. This section provides complete DDL for every missing table.

### 87. Economic Policy & Authority Tables

```sql
-- ============================================================
-- TABLE: economic_policy_versions
-- Purpose: Version history of economic policy changes
-- ============================================================
CREATE TABLE economic_policy_versions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    policy_id             UUID NOT NULL REFERENCES economic_policies(id),
    version_number        INT NOT NULL,
    previous_rules        JSONB,
    new_rules             JSONB NOT NULL,
    change_reason         TEXT NOT NULL,
    changed_by            VARCHAR(100) NOT NULL,
    approved_by           VARCHAR(100),
    effective_from        TIMESTAMPTZ NOT NULL,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_policy_version UNIQUE (policy_id, version_number)
);
CREATE INDEX idx_policy_versions_org ON economic_policy_versions(organization_id);
CREATE INDEX idx_policy_versions_policy ON economic_policy_versions(policy_id);

-- ============================================================
-- TABLE: economic_authorities
-- Purpose: Who has authority to make what economic decisions
-- ============================================================
CREATE TABLE economic_authorities (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    authority_name        VARCHAR(200) NOT NULL,
    authority_type        VARCHAR(50) NOT NULL,
    authority_entity_id   UUID NOT NULL,
    operation_category    VARCHAR(100) NOT NULL,
    max_autonomy_level    VARCHAR(30) NOT NULL,
    max_daily_spend       DECIMAL(20,6),
    max_monthly_spend     DECIMAL(20,6),
    max_single_transaction DECIMAL(20,6),
    allowed_actions       TEXT[],
    blocked_actions       TEXT[],
    capital_classes       TEXT[],
    is_active             BOOLEAN DEFAULT true,
    expires_at            TIMESTAMPTZ,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    version               INT DEFAULT 1
);
CREATE INDEX idx_econ_authorities_org ON economic_authorities(organization_id);

-- ============================================================
-- TABLE: economic_state_history
-- Purpose: Track every economic state transition
-- ============================================================
CREATE TABLE economic_state_history (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    previous_state        VARCHAR(50),
    new_state             VARCHAR(50) NOT NULL,
    trigger_metric        VARCHAR(100),
    trigger_value         DECIMAL(12,4),
    threshold_value       DECIMAL(12,4),
    runway_days_at_change DECIMAL(8,2),
    daily_burn_at_change  DECIMAL(12,2),
    revenue_at_change     DECIMAL(12,2),
    changed_by            VARCHAR(100) NOT NULL,
    change_reason         TEXT,
    changed_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_state_history_org ON economic_state_history(organization_id, changed_at DESC);

-- ============================================================
-- TABLE: autonomy_assignments
-- Purpose: Track autonomy level assignments per agent/operation
-- ============================================================
CREATE TABLE autonomy_assignments (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    agent_id              VARCHAR(100) NOT NULL,
    operation_category    VARCHAR(100) NOT NULL,
    current_level         VARCHAR(30) NOT NULL,
    max_allowed_level     VARCHAR(30) NOT NULL,
    assigned_by           VARCHAR(100) NOT NULL,
    assigned_at           TIMESTAMPTZ DEFAULT NOW(),
    expires_at            TIMESTAMPTZ,
    performance_score     DECIMAL(3,2),
    upgrade_eligible      BOOLEAN DEFAULT false,
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_autonomy_assignments_org ON autonomy_assignments(organization_id);
CREATE INDEX idx_autonomy_assignments_agent ON autonomy_assignments(agent_id);

-- ============================================================
-- TABLE: spending_limits
-- Purpose: Granular spending limits per entity/scope
-- ============================================================
CREATE TABLE spending_limits (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    limit_name            VARCHAR(200) NOT NULL,
    scope_type            VARCHAR(50) NOT NULL,
    scope_entity_id       UUID,
    capital_class         VARCHAR(50),
    limit_type            VARCHAR(30) NOT NULL,
    limit_amount          DECIMAL(20,6) NOT NULL,
    currency              VARCHAR(3) DEFAULT 'INR',
    warning_pct           DECIMAL(5,2) DEFAULT 80,
    hard_stop_pct         DECIMAL(5,2) DEFAULT 100,
    override_requires     VARCHAR(50) DEFAULT 'OWNER_APPROVAL',
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    version               INT DEFAULT 1
);
CREATE INDEX idx_spending_limits_org ON spending_limits(organization_id);
```

### 88. Acquisition Intelligence Tables (Extended)

```sql
-- ============================================================
-- TABLE: acquisition_sources
-- Purpose: Registry of all acquisition sources
-- ============================================================
CREATE TABLE acquisition_sources (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    source_code           VARCHAR(50) NOT NULL,
    source_name           VARCHAR(200) NOT NULL,
    source_type           VARCHAR(50) NOT NULL,
    channel_id            UUID,
    platform_id           UUID,
    is_active             BOOLEAN DEFAULT true,
    metadata              JSONB DEFAULT '{}',
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_acq_source_code_org UNIQUE (source_code, organization_id)
);
CREATE INDEX idx_acq_sources_org ON acquisition_sources(organization_id);

-- ============================================================
-- TABLE: acquisition_channels
-- Purpose: Marketing channels for acquisition
-- ============================================================
CREATE TABLE acquisition_channels (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    channel_code          VARCHAR(50) NOT NULL,
    channel_name          VARCHAR(200) NOT NULL,
    channel_type          VARCHAR(50) NOT NULL,
    is_active             BOOLEAN DEFAULT true,
    metadata              JSONB DEFAULT '{}',
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_acq_channel_code_org UNIQUE (channel_code, organization_id)
);
CREATE INDEX idx_acq_channels_org ON acquisition_channels(organization_id);

-- ============================================================
-- TABLE: acquisition_touchpoints
-- Purpose: Individual touchpoints in the acquisition journey
-- ============================================================
CREATE TABLE acquisition_touchpoints (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    acquisition_event_id  UUID NOT NULL REFERENCES acquisition_events(id),
    touchpoint_type       VARCHAR(50) NOT NULL,
    touchpoint_order      INT NOT NULL,
    channel_id            UUID,
    campaign_id           UUID,
    asset_id              UUID,
    touchpoint_at         TIMESTAMPTZ NOT NULL,
    cost_attribution      DECIMAL(12,4) DEFAULT 0,
    attribution_weight    DECIMAL(5,4),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_touchpoints_event ON acquisition_touchpoints(acquisition_event_id);
CREATE INDEX idx_acq_touchpoints_org ON acquisition_touchpoints(organization_id, touchpoint_at DESC);

-- ============================================================
-- TABLE: acquisition_funnels
-- Purpose: Funnel definitions per entity type
-- ============================================================
CREATE TABLE acquisition_funnels (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    funnel_name           VARCHAR(200) NOT NULL,
    entity_type           VARCHAR(50) NOT NULL,
    is_default            BOOLEAN DEFAULT false,
    is_active             BOOLEAN DEFAULT true,
    stages                JSONB NOT NULL,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_funnels_org ON acquisition_funnels(organization_id);

-- ============================================================
-- TABLE: acquisition_funnel_stages
-- Purpose: Individual stages within acquisition funnels
-- ============================================================
CREATE TABLE acquisition_funnel_stages (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    funnel_id             UUID NOT NULL REFERENCES acquisition_funnels(id),
    stage_order           INT NOT NULL,
    stage_name            VARCHAR(200) NOT NULL,
    stage_type            VARCHAR(50) NOT NULL,
    conversion_rate_target DECIMAL(5,4),
    cost_target           DECIMAL(12,2),
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_funnel_stages_funnel ON acquisition_funnel_stages(funnel_id);

-- ============================================================
-- TABLE: acquisition_conversions
-- Purpose: Recorded conversions at each funnel stage
-- ============================================================
CREATE TABLE acquisition_conversions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    acquisition_event_id  UUID NOT NULL REFERENCES acquisition_events(id),
    from_stage            VARCHAR(50) NOT NULL,
    to_stage              VARCHAR(50) NOT NULL,
    conversion_at         TIMESTAMPTZ NOT NULL,
    conversion_value      DECIMAL(12,2) DEFAULT 0,
    attribution_weight    DECIMAL(5,4),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_conversions_org ON acquisition_conversions(organization_id, conversion_at DESC);

-- ============================================================
-- TABLE: acquisition_cohorts
-- Purpose: Cohort definitions for cohort-based analysis
-- ============================================================
CREATE TABLE acquisition_cohorts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    cohort_name           VARCHAR(200) NOT NULL,
    cohort_type           VARCHAR(50) NOT NULL,
    cohort_period         DATE NOT NULL,
    entity_type           VARCHAR(50) NOT NULL,
    initial_count         INT NOT NULL,
    channel_breakdown     JSONB,
    total_spend           DECIMAL(12,2),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_cohorts_org ON acquisition_cohorts(organization_id, cohort_period DESC);

-- ============================================================
-- TABLE: acquisition_costs
-- Purpose: Aggregated acquisition costs per entity/channel/period
-- ============================================================
CREATE TABLE acquisition_costs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    entity_type           VARCHAR(50) NOT NULL,
    cost_period           DATE NOT NULL,
    channel_id            UUID,
    campaign_id           UUID,
    total_cost            DECIMAL(12,2) NOT NULL,
    paid_cost             DECIMAL(12,2) DEFAULT 0,
    organic_cost          DECIMAL(12,2) DEFAULT 0,
    ai_cost               DECIMAL(12,2) DEFAULT 0,
    content_cost          DECIMAL(12,2) DEFAULT 0,
    ad_cost               DECIMAL(12,2) DEFAULT 0,
    total_acquisitions    INT NOT NULL,
    cac                   DECIMAL(12,2),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_costs_org ON acquisition_costs(organization_id, cost_period DESC);

-- ============================================================
-- TABLE: acquisition_cost_allocations
-- Purpose: How acquisition costs are allocated across attribution dimensions
-- ============================================================
CREATE TABLE acquisition_cost_allocations (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    acquisition_cost_id   UUID NOT NULL REFERENCES acquisition_costs(id),
    allocation_dimension  VARCHAR(50) NOT NULL,
    allocation_entity_id  UUID NOT NULL,
    allocated_amount      DECIMAL(12,2) NOT NULL,
    allocation_percentage DECIMAL(5,2),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_cost_alloc ON acquisition_cost_allocations(acquisition_cost_id);

-- ============================================================
-- TABLE: acquisition_metrics
-- Purpose: Periodic acquisition performance metrics
-- ============================================================
CREATE TABLE acquisition_metrics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    metric_period         DATE NOT NULL,
    entity_type           VARCHAR(50) NOT NULL,
    impressions           INT DEFAULT 0,
    clicks                INT DEFAULT 0,
    registrations         INT DEFAULT 0,
    verified_users        INT DEFAULT 0,
    first_actions         INT DEFAULT 0,
    qualified_actions     INT DEFAULT 0,
    conversions           INT DEFAULT 0,
    paid_customers        INT DEFAULT 0,
    total_spend           DECIMAL(12,2) DEFAULT 0,
    cac                   DECIMAL(12,2),
    conversion_rate       DECIMAL(5,4),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_acq_metrics_org ON acquisition_metrics(organization_id, metric_period DESC);

-- ============================================================
-- TABLE: cac_budget_rules
-- Purpose: Rules governing CAC budget behavior
-- ============================================================
CREATE TABLE cac_budget_rules (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    budget_id             UUID NOT NULL REFERENCES cac_budgets(id),
    rule_name             VARCHAR(200) NOT NULL,
    rule_type             VARCHAR(50) NOT NULL,
    trigger_condition     JSONB NOT NULL,
    action_type           VARCHAR(50) NOT NULL,
    action_config         JSONB NOT NULL,
    priority              INT DEFAULT 0,
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_cac_budget_rules_budget ON cac_budget_rules(budget_id);

-- ============================================================
-- TABLE: cac_decisions
-- Purpose: CAC-specific economic decisions
-- ============================================================
CREATE TABLE cac_decisions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    decision_id           UUID NOT NULL REFERENCES economic_decisions(id),
    entity_type           VARCHAR(50) NOT NULL,
    current_cac           DECIMAL(12,2),
    target_cac            DECIMAL(12,2),
    projected_cac         DECIMAL(12,2),
    cac_deviation_pct     DECIMAL(8,4),
    affected_channel      VARCHAR(50),
    affected_campaign     UUID,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_cac_decisions_org ON cac_decisions(organization_id, created_at DESC);

-- ============================================================
-- TABLE: cac_decision_logs
-- Purpose: Audit trail for CAC decisions
-- ============================================================
CREATE TABLE cac_decision_logs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    cac_decision_id       UUID NOT NULL REFERENCES cac_decisions(id),
    log_type              VARCHAR(50) NOT NULL,
    previous_data         JSONB,
    new_data              JSONB,
    changed_by            VARCHAR(100) NOT NULL,
    change_reason         TEXT,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_cac_decision_logs ON cac_decision_logs(cac_decision_id);

-- ============================================================
-- TABLE: cac_experiments
-- Purpose: A/B tests for CAC optimization
-- ============================================================
CREATE TABLE cac_experiments (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    experiment_name       VARCHAR(200) NOT NULL,
    entity_type           VARCHAR(50) NOT NULL,
    hypothesis            TEXT NOT NULL,
    control_config        JSONB NOT NULL,
    variant_config        JSONB NOT NULL,
    status                VARCHAR(30) DEFAULT 'DRAFT',
    started_at            TIMESTAMPTZ,
    ended_at              TIMESTAMPTZ,
    winner                VARCHAR(20),
    control_cac           DECIMAL(12,2),
    variant_cac           DECIMAL(12,2),
    statistical_significance DECIMAL(5,4),
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_cac_experiments_org ON cac_experiments(organization_id);

-- ============================================================
-- TABLE: ltv_predictions
-- Purpose: ML-based LTV predictions per customer
-- ============================================================
CREATE TABLE ltv_predictions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    user_id               UUID NOT NULL,
    entity_type           VARCHAR(50) NOT NULL,
    predicted_ltv         DECIMAL(12,2) NOT NULL,
    prediction_horizon    INT NOT NULL,
    confidence_score      DECIMAL(3,2),
    model_version         VARCHAR(50),
    features_used         JSONB,
    actual_ltv_at_horizon DECIMAL(12,2),
    prediction_error      DECIMAL(8,4),
    predicted_at          TIMESTAMPTZ DEFAULT NOW(),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ltv_predictions_org ON ltv_predictions(organization_id);
CREATE INDEX idx_ltv_predictions_user ON ltv_predictions(user_id);

-- ============================================================
-- TABLE: advertising_budgets
-- Purpose: Advertising budget definitions per channel/campaign
-- ============================================================
CREATE TABLE advertising_budgets (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    budget_name           VARCHAR(200) NOT NULL,
    channel_code          VARCHAR(50) NOT NULL,
    campaign_id           UUID,
    budget_type           VARCHAR(30) NOT NULL,
    budget_amount         DECIMAL(12,2) NOT NULL,
    spent_amount          DECIMAL(12,2) DEFAULT 0,
    period_start          TIMESTAMPTZ NOT NULL,
    period_end            TIMESTAMPTZ NOT NULL,
    daily_pacing_limit    DECIMAL(12,2),
    is_active             BOOLEAN DEFAULT true,
    auto_renew            BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    version               INT DEFAULT 1
);
CREATE INDEX idx_ad_budgets_org ON advertising_budgets(organization_id);
CREATE INDEX idx_ad_budgets_channel ON advertising_budgets(channel_code);

-- ============================================================
-- TABLE: advertising_budget_rules
-- Purpose: Rules governing advertising budget behavior
-- ============================================================
CREATE TABLE advertising_budget_rules (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    budget_id             UUID NOT NULL REFERENCES advertising_budgets(id),
    rule_name             VARCHAR(200) NOT NULL,
    rule_type             VARCHAR(50) NOT NULL,
    trigger_condition     JSONB NOT NULL,
    action_type           VARCHAR(50) NOT NULL,
    action_config         JSONB NOT NULL,
    priority              INT DEFAULT 0,
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ad_budget_rules_budget ON advertising_budget_rules(budget_id);

-- ============================================================
-- TABLE: advertising_decisions
-- Purpose: Advertising-specific economic decisions
-- ============================================================
CREATE TABLE advertising_decisions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    decision_id           UUID NOT NULL REFERENCES economic_decisions(id),
    channel_code          VARCHAR(50),
    campaign_id           UUID,
    current_roas          DECIMAL(8,4),
    target_roas           DECIMAL(8,4),
    budget_before         DECIMAL(12,2),
    budget_after          DECIMAL(12,2),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ad_decisions_org ON advertising_decisions(organization_id, created_at DESC);

-- ============================================================
-- TABLE: advertising_attribution
-- Purpose: Attribution results for advertising spend
-- ============================================================
CREATE TABLE advertising_attribution (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    campaign_id           UUID NOT NULL,
    channel_code          VARCHAR(50) NOT NULL,
    attribution_date      DATE NOT NULL,
    attributed_revenue    DECIMAL(12,2) DEFAULT 0,
    attributed_rfqs       INT DEFAULT 0,
    attributed_leads      INT DEFAULT 0,
    attributed_registrations INT DEFAULT 0,
    attribution_model     VARCHAR(50) DEFAULT 'position_based',
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ad_attribution_org ON advertising_attribution(organization_id, attribution_date DESC);

-- ============================================================
-- TABLE: industry_economics
-- Purpose: Aggregated economics per industry vertical
-- ============================================================
CREATE TABLE industry_economics (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    industry_id           UUID NOT NULL,
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
    qualified_rfqs        INT,
    revenue               DECIMAL(12,2),
    cost_per_lead         DECIMAL(12,2),
    cost_per_rfq          DECIMAL(12,2),
    cost_per_qualified_rfq DECIMAL(12,2),
    revenue_per_rfq       DECIMAL(12,2),
    industry_roi          DECIMAL(8,4),
    market_penetration    DECIMAL(5,4),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_industry_econ_org_date ON industry_economics(organization_id, period_date DESC);
```

### 89. Double-Entry Ledger Tables

```sql
-- ============================================================
-- TABLE: ledger_accounts
-- Purpose: Chart of accounts for the double-entry ledger
-- ============================================================
CREATE TABLE ledger_accounts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    account_code          VARCHAR(20) NOT NULL,
    account_name          VARCHAR(200) NOT NULL,
    account_type          VARCHAR(30) NOT NULL,
    normal_balance        VARCHAR(6) NOT NULL,
    parent_account_id     UUID REFERENCES ledger_accounts(id),
    capital_class         VARCHAR(50),
    is_active             BOOLEAN DEFAULT true,
    description           TEXT,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    version               INT DEFAULT 1,
    CONSTRAINT uq_ledger_account_code_org UNIQUE (account_code, organization_id)
);
CREATE INDEX idx_ledger_accounts_org ON ledger_accounts(organization_id);
CREATE INDEX idx_ledger_accounts_type ON ledger_accounts(account_type);

-- ============================================================
-- TABLE: ledger_journals
-- Purpose: Journal headers for double-entry postings
-- ============================================================
CREATE TABLE ledger_journals (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    journal_number        VARCHAR(50) NOT NULL,
    journal_type          VARCHAR(50) NOT NULL,
    journal_date          DATE NOT NULL,
    description           TEXT NOT NULL,
    posting_status        VARCHAR(20) DEFAULT 'DRAFT',
    source_system         VARCHAR(50),
    source_entity_type    VARCHAR(50),
    source_entity_id      UUID,
    total_debit           DECIMAL(20,6) NOT NULL DEFAULT 0,
    total_credit          DECIMAL(20,6) NOT NULL DEFAULT 0,
    currency              VARCHAR(3) NOT NULL DEFAULT 'INR',
    posted_at             TIMESTAMPTZ,
    posted_by             VARCHAR(100),
    reversal_of           UUID REFERENCES ledger_journals(id),
    idempotency_key       VARCHAR(200),
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ledger_journal_number_org UNIQUE (journal_number, organization_id),
    CONSTRAINT uq_ledger_journal_idempotent UNIQUE (idempotency_key),
    CONSTRAINT chk_ledger_balance CHECK (total_debit = total_credit)
);
CREATE INDEX idx_ledger_journals_org ON ledger_journals(organization_id, journal_date DESC);
CREATE INDEX idx_ledger_journals_status ON ledger_journals(posting_status);
CREATE INDEX idx_ledger_journals_source ON ledger_journals(source_entity_type, source_entity_id);

-- ============================================================
-- TABLE: ledger_entries
-- Purpose: Individual journal entries (debit or credit)
-- ============================================================
CREATE TABLE ledger_entries (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    journal_id            UUID NOT NULL REFERENCES ledger_journals(id),
    account_id            UUID NOT NULL REFERENCES ledger_accounts(id),
    entry_type            VARCHAR(6) NOT NULL,
    amount                DECIMAL(20,6) NOT NULL,
    currency              VARCHAR(3) NOT NULL DEFAULT 'INR',
    exchange_rate         DECIMAL(12,6) DEFAULT 1.0,
    base_currency_amount  DECIMAL(20,6),
    description           TEXT,
    line_number           INT NOT NULL,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_ledger_entry_amount CHECK (amount > 0),
    CONSTRAINT chk_ledger_entry_type CHECK (entry_type IN ('DEBIT', 'CREDIT'))
);
CREATE INDEX idx_ledger_entries_journal ON ledger_entries(journal_id);
CREATE INDEX idx_ledger_entries_account ON ledger_entries(account_id);

-- ============================================================
-- TABLE: ledger_entry_lines
-- Purpose: Detailed line items within entries
-- ============================================================
CREATE TABLE ledger_entry_lines (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    entry_id              UUID NOT NULL REFERENCES ledger_entries(id),
    line_type             VARCHAR(50) NOT NULL,
    reference_type        VARCHAR(50),
    reference_id          UUID,
    amount                DECIMAL(20,6) NOT NULL,
    currency              VARCHAR(3) NOT NULL DEFAULT 'INR',
    description           TEXT,
    metadata              JSONB DEFAULT '{}',
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ledger_entry_lines_entry ON ledger_entry_lines(entry_id);

-- ============================================================
-- TABLE: ledger_posting_periods
-- Purpose: Accounting periods for ledger organization
-- ============================================================
CREATE TABLE ledger_posting_periods (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    period_name           VARCHAR(100) NOT NULL,
    period_start          DATE NOT NULL,
    period_end            DATE NOT NULL,
    status                VARCHAR(20) DEFAULT 'OPEN',
    closed_at             TIMESTAMPTZ,
    closed_by             VARCHAR(100),
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ledger_period_org UNIQUE (organization_id, period_start)
);
CREATE INDEX idx_ledger_periods_org ON ledger_posting_periods(organization_id);

-- ============================================================
-- TABLE: ledger_reversals
-- Purpose: Reversal entries for posted journals
-- ============================================================
CREATE TABLE ledger_reversals (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    original_journal_id   UUID NOT NULL REFERENCES ledger_journals(id),
    reversal_journal_id   UUID NOT NULL REFERENCES ledger_journals(id),
    reversal_reason       TEXT NOT NULL,
    reversed_by           VARCHAR(100) NOT NULL,
    reversed_at           TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ledger_reversals_org ON ledger_reversals(organization_id);

-- ============================================================
-- TABLE: ledger_adjustments
-- Purpose: Adjusting entries for corrections
-- ============================================================
CREATE TABLE ledger_adjustments (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    adjustment_journal_id UUID NOT NULL REFERENCES ledger_journals(id),
    adjustment_type       VARCHAR(50) NOT NULL,
    reason                TEXT NOT NULL,
    adjusted_by           VARCHAR(100) NOT NULL,
    approved_by           VARCHAR(100),
    requires_approval     BOOLEAN DEFAULT false,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ledger_adjustments_org ON ledger_adjustments(organization_id);

-- ============================================================
-- TABLE: ledger_reconciliations
-- Purpose: Ledger reconciliation runs
-- ============================================================
CREATE TABLE ledger_reconciliations (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    reconciliation_type   VARCHAR(50) NOT NULL,
    period_start          DATE NOT NULL,
    period_end            DATE NOT NULL,
    status                VARCHAR(30) DEFAULT 'PENDING',
    total_entries_checked INT DEFAULT 0,
    matched_entries       INT DEFAULT 0,
    unmatched_entries     INT DEFAULT 0,
    discrepancy_count     INT DEFAULT 0,
    discrepancy_amount    DECIMAL(20,6) DEFAULT 0,
    reconciled_by         VARCHAR(100),
    reconciled_at         TIMESTAMPTZ,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ledger_reconciliations_org ON ledger_reconciliations(organization_id);

-- ============================================================
-- TABLE: ledger_reconciliation_items
-- Purpose: Individual reconciliation items
-- ============================================================
CREATE TABLE ledger_reconciliation_items (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    reconciliation_id     UUID NOT NULL REFERENCES ledger_reconciliations(id),
    journal_id            UUID NOT NULL REFERENCES ledger_journals(id),
    match_status          VARCHAR(30) NOT NULL,
    discrepancy_type      VARCHAR(50),
    discrepancy_amount    DECIMAL(20,6),
    resolution_notes      TEXT,
    resolved_by           VARCHAR(100),
    resolved_at           TIMESTAMPTZ,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ledger_recon_items_recon ON ledger_reconciliation_items(reconciliation_id);

-- ============================================================
-- TABLE: ledger_idempotency_records
-- Purpose: Prevent duplicate financial postings
-- ============================================================
CREATE TABLE ledger_idempotency_records (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    idempotency_key       VARCHAR(200) NOT NULL,
    source_system         VARCHAR(50) NOT NULL,
    source_event_id       VARCHAR(200),
    event_hash            VARCHAR(64),
    journal_id            UUID REFERENCES ledger_journals(id),
    processing_status     VARCHAR(30) DEFAULT 'RECEIVED',
    first_received_at     TIMESTAMPTZ DEFAULT NOW(),
    last_received_at      TIMESTAMPTZ DEFAULT NOW(),
    duplicate_count       INT DEFAULT 0,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ledger_idempotency_key UNIQUE (idempotency_key)
);
CREATE INDEX idx_ledger_idempotency_org ON ledger_idempotency_records(organization_id);
```

### 90. Survival & Kill Switch Tables

```sql
-- ============================================================
-- TABLE: survival_snapshots
-- Purpose: Periodic snapshots of survival state
-- ============================================================
CREATE TABLE survival_snapshots (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    snapshot_date         DATE NOT NULL,
    current_state         VARCHAR(50) NOT NULL,
    survival_mode         VARCHAR(30) NOT NULL,
    available_operating_capital DECIMAL(20,6),
    protected_capital     DECIMAL(20,6),
    restricted_capital    DECIMAL(20,6),
    committed_spend       DECIMAL(20,6),
    daily_burn            DECIMAL(20,6),
    runway_days           DECIMAL(8,2),
    self_funding_ratio    DECIMAL(8,4),
    operating_coverage_ratio DECIMAL(8,4),
    realized_revenue      DECIMAL(20,6),
    net_eligible_revenue  DECIMAL(20,6),
    total_cost            DECIMAL(20,6),
    net_position          DECIMAL(20,6),
    snapshot_data         JSONB,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_survival_snapshot_daily UNIQUE (organization_id, snapshot_date)
);
CREATE INDEX idx_survival_snapshots_org ON survival_snapshots(organization_id, snapshot_date DESC);

-- ============================================================
-- TABLE: survival_policies
-- Purpose: Policies governing survival mode transitions
-- ============================================================
CREATE TABLE survival_policies (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    policy_name           VARCHAR(200) NOT NULL,
    from_mode             VARCHAR(30) NOT NULL,
    to_mode               VARCHAR(30) NOT NULL,
    trigger_condition     JSONB NOT NULL,
    allowed_actions       JSONB NOT NULL,
    blocked_actions       JSONB NOT NULL,
    requires_human_approval BOOLEAN DEFAULT false,
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    version               INT DEFAULT 1
);
CREATE INDEX idx_survival_policies_org ON survival_policies(organization_id);

-- ============================================================
-- TABLE: survival_state_history
-- Purpose: History of survival state transitions
-- ============================================================
CREATE TABLE survival_state_history (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    previous_state        VARCHAR(50),
    new_state             VARCHAR(50) NOT NULL,
    previous_mode         VARCHAR(30),
    new_mode              VARCHAR(30),
    trigger_type          VARCHAR(50) NOT NULL,
    trigger_metric        VARCHAR(100),
    trigger_value         DECIMAL(12,4),
    runway_days_at_change DECIMAL(8,2),
    changed_by            VARCHAR(100) NOT NULL,
    change_reason         TEXT,
    changed_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_survival_state_history_org ON survival_state_history(organization_id, changed_at DESC);

-- ============================================================
-- TABLE: runway_forecasts
-- Purpose: Runway predictions under various scenarios
-- ============================================================
CREATE TABLE runway_forecasts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    forecast_name         VARCHAR(200) NOT NULL,
    scenario_type         VARCHAR(50) NOT NULL,
    forecast_date         DATE NOT NULL,
    current_runway_days   DECIMAL(8,2),
    projected_runway_days DECIMAL(8,2),
    forecast_horizon_days INT,
    daily_burn_scenario   DECIMAL(20,6),
    revenue_scenario      DECIMAL(20,6),
    capital_injection     DECIMAL(20,6),
    assumptions           JSONB,
    confidence_level      DECIMAL(3,2) DEFAULT 0.5,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_runway_forecasts_org ON runway_forecasts(organization_id, forecast_date DESC);

-- ============================================================
-- TABLE: economic_kill_switches
-- Purpose: Active kill switch records
-- ============================================================
CREATE TABLE economic_kill_switches (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    switch_type           VARCHAR(100) NOT NULL,
    scope_type            VARCHAR(50) NOT NULL,
    scope_entity_id       UUID,
    status                VARCHAR(20) DEFAULT 'ACTIVE',
    initiator             VARCHAR(100) NOT NULL,
    reason                TEXT NOT NULL,
    activated_at          TIMESTAMPTZ DEFAULT NOW(),
    expected_duration     INTERVAL,
    review_at             TIMESTAMPTZ,
    restored_by           VARCHAR(100),
    restored_at           TIMESTAMPTZ,
    restoration_reason    TEXT,
    affected_budgets      UUID[],
    affected_agents       TEXT[],
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_kill_switches_org ON economic_kill_switches(organization_id);
CREATE INDEX idx_kill_switches_active ON economic_kill_switches(status) WHERE status = 'ACTIVE';

-- ============================================================
-- TABLE: economic_kill_switch_events
-- Purpose: Audit trail for kill switch activations/deactivations
-- ============================================================
CREATE TABLE economic_kill_switch_events (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    kill_switch_id        UUID NOT NULL REFERENCES economic_kill_switches(id),
    event_type            VARCHAR(30) NOT NULL,
    event_by              VARCHAR(100) NOT NULL,
    event_reason          TEXT NOT NULL,
    event_at              TIMESTAMPTZ DEFAULT NOW(),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_kill_switch_events ON economic_kill_switch_events(kill_switch_id);

-- ============================================================
-- TABLE: economic_incidents
-- Purpose: Economic incidents requiring investigation
-- ============================================================
CREATE TABLE economic_incidents (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    incident_type         VARCHAR(50) NOT NULL,
    severity              VARCHAR(20) NOT NULL,
    status                VARCHAR(30) DEFAULT 'OPEN',
    title                 VARCHAR(200) NOT NULL,
    description           TEXT NOT NULL,
    affected_scope        VARCHAR(50),
    affected_entity_id    UUID,
    estimated_impact      DECIMAL(12,2),
    actual_impact         DECIMAL(12,2),
    root_cause            TEXT,
    resolution            TEXT,
    detected_at           TIMESTAMPTZ DEFAULT NOW(),
    investigated_at       TIMESTAMPTZ,
    resolved_at           TIMESTAMPTZ,
    assigned_to           VARCHAR(100),
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_economic_incidents_org ON economic_incidents(organization_id, detected_at DESC);
CREATE INDEX idx_economic_incidents_open ON economic_incidents(status) WHERE status = 'OPEN';

-- ============================================================
-- TABLE: economic_reconciliation_runs
-- Purpose: Periodic reconciliation runs
-- ============================================================
CREATE TABLE economic_reconciliation_runs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    run_type              VARCHAR(50) NOT NULL,
    period_start          DATE NOT NULL,
    period_end            DATE NOT NULL,
    status                VARCHAR(30) DEFAULT 'RUNNING',
    items_checked         INT DEFAULT 0,
    items_matched         INT DEFAULT 0,
    items_discrepant      INT DEFAULT 0,
    total_discrepancy     DECIMAL(20,6) DEFAULT 0,
    started_at            TIMESTAMPTZ DEFAULT NOW(),
    completed_at          TIMESTAMPTZ,
    run_by                VARCHAR(100),
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_recon_runs_org ON economic_reconciliation_runs(organization_id, started_at DESC);

-- ============================================================
-- TABLE: economic_reconciliation_items
-- Purpose: Individual reconciliation items
-- ============================================================
CREATE TABLE economic_reconciliation_items (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID NOT NULL REFERENCES organizations(id),
    reconciliation_run_id UUID NOT NULL REFERENCES economic_reconciliation_runs(id),
    item_type             VARCHAR(50) NOT NULL,
    source_system         VARCHAR(50) NOT NULL,
    source_entity_id      UUID,
    source_amount         DECIMAL(20,6),
    ledger_amount         DECIMAL(20,6),
    discrepancy           DECIMAL(20,6),
    match_status          VARCHAR(30) NOT NULL,
    resolution_notes      TEXT,
    resolved_by           VARCHAR(100),
    resolved_at           TIMESTAMPTZ,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_recon_items_run ON economic_reconciliation_items(reconciliation_run_id);
```

---

## Part XXV — Row-Level Security Policies

All VASE tables enforce organization-level isolation via PostgreSQL RLS. Every policy follows the same pattern: `organization_id = current_setting('app.current_organization_id')::uuid`.

```sql
-- ============================================================
-- RLS POLICIES — Organization Isolation
-- Applied to ALL VASE tables
-- ============================================================

-- Core Economic Tables
ALTER TABLE cost_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_accounts USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cost_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_providers USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cost_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_events USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cost_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_allocations USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cost_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_budgets USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cost_budget_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_budget_rules USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cost_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_forecasts USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cost_anomalies ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cost_anomalies USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Cost Management Tables
ALTER TABLE provider_cost_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON provider_cost_rates USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE model_cost_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON model_cost_rates USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE infra_cost_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON infra_cost_rates USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Economic Decision Tables
ALTER TABLE economic_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_decisions USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_decision_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_decision_logs USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_policies USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_policy_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_policy_versions USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_authorities ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_authorities USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_approvals USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_alerts USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_snapshots USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_state_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_state_history USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Autonomy Tables
ALTER TABLE autonomy_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON autonomy_levels USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE autonomy_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON autonomy_assignments USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Acquisition Intelligence Tables
ALTER TABLE acquisition_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_events USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_sources USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_channels USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_touchpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_touchpoints USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_funnels ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_funnels USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_funnel_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_funnel_stages USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_conversions USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_cohorts USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_costs USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_cost_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_cost_allocations USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE acquisition_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON acquisition_metrics USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- CAC Tables
ALTER TABLE cac_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_snapshots USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_targets USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_budgets USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_budget_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_budget_rules USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_forecasts USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_anomalies ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_anomalies USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_decisions USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_decision_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_decision_logs USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE cac_experiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON cac_experiments USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- LTV Tables
ALTER TABLE customer_lifetime_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON customer_lifetime_values USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ltv_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ltv_predictions USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ltv_cac_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ltv_cac_snapshots USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE payback_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON payback_snapshots USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Attribution Tables
ALTER TABLE attribution_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON attribution_models USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE attribution_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON attribution_results USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE budget_reallocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON budget_reallocations USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE budget_reallocation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON budget_reallocation_logs USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Advertising Economics Tables
ALTER TABLE campaign_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON campaign_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE channel_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON channel_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE keyword_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON keyword_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE category_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON category_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE geo_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON geo_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE persona_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON persona_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE industry_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON industry_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Advertising Budget Tables
ALTER TABLE advertising_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON advertising_budgets USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE advertising_budget_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON advertising_budget_rules USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE advertising_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON advertising_decisions USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE advertising_attribution ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON advertising_attribution USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Growth Capital Tables
ALTER TABLE asset_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON asset_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE job_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON job_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE workflow_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON workflow_economics USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Treasury Tables
ALTER TABLE treasury_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON treasury_accounts USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE treasury_pools ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON treasury_pools USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE treasury_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON treasury_balances USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE treasury_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON treasury_ledger USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE capital_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON capital_classes USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE funding_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON funding_events USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON revenue_events USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE revenue_eligibility_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON revenue_eligibility_rules USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE realized_revenue_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON realized_revenue_snapshots USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Protected Capital Tables
ALTER TABLE protected_capital_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON protected_capital_rules USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE escrow_isolation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON escrow_isolation_rules USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE spending_authorities ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON spending_authorities USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE spending_velocity_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON spending_velocity_rules USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE spending_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON spending_limits USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE merchant_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON merchant_policies USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE provider_allowlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON provider_allowlists USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Survival Tables
ALTER TABLE survival_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON survival_snapshots USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE survival_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON survival_policies USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE survival_state_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON survival_state_history USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE runway_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON runway_forecasts USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Kill Switch Tables
ALTER TABLE economic_kill_switches ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_kill_switches USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_kill_switch_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_kill_switch_events USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Incident & Reconciliation Tables
ALTER TABLE economic_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_incidents USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_reconciliation_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_reconciliation_runs USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE economic_reconciliation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON economic_reconciliation_items USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Ledger Tables
ALTER TABLE ledger_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_accounts USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_journals USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_entries USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_entry_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_entry_lines USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_posting_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_posting_periods USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_reversals ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_reversals USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_adjustments ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_adjustments USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_reconciliations ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_reconciliations USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_reconciliation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_reconciliation_items USING (organization_id = current_setting('app.current_organization_id')::uuid);
ALTER TABLE ledger_idempotency_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY vase_org_isolation ON ledger_idempotency_records USING (organization_id = current_setting('app.current_organization_id')::uuid);
```

---

## Part XXVI — Financial Integrity Functions

```sql
-- ============================================================
-- FUNCTION: validate_journal_balance
-- Purpose: Ensure SUM(DEBITS) = SUM(CREDITS) before posting
-- ============================================================
CREATE OR REPLACE FUNCTION validate_journal_balance(p_journal_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_total_debit DECIMAL(20,6);
    v_total_credit DECIMAL(20,6);
BEGIN
    SELECT COALESCE(SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE 0 END), 0)
    INTO v_total_debit, v_total_credit
    FROM ledger_entries
    WHERE journal_id = p_journal_id;

    RETURN v_total_debit = v_total_credit AND v_total_debit > 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: post_journal
-- Purpose: Post a DRAFT journal to POSTED status with validation
-- ============================================================
CREATE OR REPLACE FUNCTION post_journal(p_journal_id UUID, p_posted_by VARCHAR(100))
RETURNS BOOLEAN AS $$
DECLARE
    v_status VARCHAR(20);
    v_balanced BOOLEAN;
BEGIN
    SELECT posting_status INTO v_status FROM ledger_journals WHERE id = p_journal_id;

    IF v_status != 'DRAFT' THEN
        RAISE EXCEPTION 'Cannot post journal in status %', v_status;
    END IF;

    v_balanced := validate_journal_balance(p_journal_id);
    IF NOT v_balanced THEN
        RAISE EXCEPTION 'Journal % is not balanced (DEBITS ≠ CREDITS)', p_journal_id;
    END IF;

    UPDATE ledger_journals
    SET posting_status = 'POSTED',
        posted_at = NOW(),
        posted_by = p_posted_by,
        updated_at = NOW()
    WHERE id = p_journal_id;

    INSERT INTO ledger_idempotency_records (
        organization_id, idempotency_key, source_system, journal_id, processing_status
    )
    SELECT organization_id, 'JOURNAL_' || id, 'LEDGER_ENGINE', id, 'POSTED'
    FROM ledger_journals WHERE id = p_journal_id
    ON CONFLICT (idempotency_key) DO UPDATE SET
        last_received_at = NOW(),
        duplicate_count = ledger_idempotency_records.duplicate_count + 1;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: enforce_posted_immutability
-- Purpose: Prevent UPDATE/DELETE on posted journals and entries
-- ============================================================
CREATE OR REPLACE FUNCTION enforce_posted_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.posting_status = 'POSTED' THEN
        RAISE EXCEPTION 'Cannot modify posted journal %. Use REVERSAL or ADJUSTMENT.', OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ledger_journals_immutability
    BEFORE UPDATE OR DELETE ON ledger_journals
    FOR EACH ROW EXECUTE FUNCTION enforce_posted_immutability();

-- ============================================================
-- FUNCTION: enforce_entry_immutability
-- Purpose: Prevent modification of entries linked to posted journals
-- ============================================================
CREATE OR REPLACE FUNCTION enforce_entry_immutability()
RETURNS TRIGGER AS $$
DECLARE
    v_status VARCHAR(20);
BEGIN
    SELECT posting_status INTO v_status
    FROM ledger_journals WHERE id = OLD.journal_id;

    IF v_status = 'POSTED' THEN
        RAISE EXCEPTION 'Cannot modify entries of posted journal %', OLD.journal_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ledger_entries_immutability
    BEFORE UPDATE OR DELETE ON ledger_entries
    FOR EACH ROW EXECUTE FUNCTION enforce_entry_immutability();

-- ============================================================
-- FUNCTION: calculate_treasury_balance
-- Purpose: Recalculate treasury account balance from ledger
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_treasury_balance(p_account_id UUID)
RETURNS DECIMAL(20,6) AS $$
DECLARE
    v_balance DECIMAL(20,6);
BEGIN
    SELECT COALESCE(SUM(
        CASE
            WHEN movement_type IN ('CREDIT', 'ALLOCATION', 'REALLOCATION') THEN amount
            WHEN movement_type IN ('DEBIT', 'TRANSFER') THEN -amount
            ELSE 0
        END
    ), 0)
    INTO v_balance
    FROM treasury_ledger
    WHERE treasury_account_id = p_account_id
      AND posting_status = 'POSTED';

    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: check_economic_preflight
-- Purpose: Validate economic preflight for job execution
-- ============================================================
CREATE OR REPLACE FUNCTION check_economic_preflight(
    p_organization_id UUID,
    p_estimated_cost DECIMAL(12,2),
    p_capital_class VARCHAR(50),
    p_treasury_pool_id UUID
)
RETURNS TABLE(outcome VARCHAR(20), reason TEXT) AS $$
DECLARE
    v_kill_switch_active BOOLEAN;
    v_pool_available DECIMAL(20,6);
    v_capital_protected BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM economic_kill_switches
        WHERE organization_id = p_organization_id
          AND status = 'ACTIVE'
          AND (scope_type = 'GLOBAL' OR scope_entity_id = p_organization_id)
    ) INTO v_kill_switch_active;

    IF v_kill_switch_active THEN
        RETURN QUERY SELECT 'DENY'::VARCHAR, 'Kill switch is active'::TEXT;
        RETURN;
    END IF;

    SELECT is_protected INTO v_capital_protected
    FROM capital_classes
    WHERE organization_id = p_organization_id AND class_code = p_capital_class;

    IF COALESCE(v_capital_protected, true) THEN
        RETURN QUERY SELECT 'DENY'::VARCHAR, 'Capital class is protected or invalid'::TEXT;
        RETURN;
    END IF;

    IF p_treasury_pool_id IS NOT NULL THEN
        SELECT available_amount INTO v_pool_available
        FROM treasury_pools
        WHERE id = p_treasury_pool_id AND organization_id = p_organization_id;

        IF COALESCE(v_pool_available, 0) < p_estimated_cost THEN
            RETURN QUERY SELECT 'DENY'::VARCHAR, 'Insufficient budget in pool'::TEXT;
            RETURN;
        END IF;
    END IF;

    RETURN QUERY SELECT 'ALLOW'::VARCHAR, 'All preflight checks passed'::TEXT;
END;
$$ LANGUAGE plpgsql;
```

---

## Part XXVII — Remaining Mermaid Diagrams (7–16)

### 87. Diagram 7 — CAC Attribution Pipeline

```mermaid
graph TD
    A[Acquisition Event] --> B[Touch Tracking]
    B --> C[Attribution Model Selection]
    C --> D[Credit Allocation]
    D --> E[Cost Allocation]
    E --> F[CAC Calculation]
    F --> G{Entity Type?}
    G -->|Buyer| H[Buyer CAC]
    G -->|Supplier| I[Supplier CAC]
    G -->|RFQ Creator| J[RFQ CAC]
    G -->|Paying| K[Paying Customer CAC]
    H --> L[CAC Snapshot]
    I --> L
    J --> L
    K --> L
    L --> M[Target Comparison]
    M -->|Above Target| N[Trigger Alert]
    M -->|Below Target| O[Scale Budget]
```

### 88. Diagram 8 — LTV Intelligence Pipeline

```mermaid
graph TD
    A[Customer Activity Data] --> B[Revenue Attribution]
    B --> C[Historical LTV Calculation]
    C --> D[ML Prediction Model]
    D --> E[Predicted LTV]
    E --> F[Churn Risk Score]
    F --> G{LTV:CAC Ratio}
    G -->|> 10:1| H[High Value — Protect]
    G -->|5:1 - 10:1| I[Good — Monitor]
    G -->|3:1 - 5:1| J[Acceptable — Optimize]
    G -->|< 3:1| K[Warning — Fix or Stop]
    H --> L[Retention Investment]
    I --> L
    J --> L
    K --> M[Acquisition Pause]
```

### 89. Diagram 9 — Advertising Budget Governor Flow

```mermaid
graph TD
    A[Channel Performance Data] --> B[ROAS Calculation]
    B --> C[Campaign Tier Classification]
    C --> D{Tier}
    D -->|Star > 6x| E[SCALE 15%/week]
    D -->|Winner 3-6x| F[SCALE 10%/week]
    D -->|Steady 1.5-3x| G[MAINTAIN]
    D -->|Underperformer 1-1.5x| H[REDUCE 20%]
    D -->|Loser < 1x| I[PAUSE]
    D -->|Bleeder < 0.5x| J[STOP]
    E --> K[Guardrails Check]
    F --> K
    H --> K
    I --> K
    J --> K
    K -->|Pass| L[Execute via Ad API]
    K -->|Fail| M[Escalate to Human]
    L --> N[Monitor 24h/72h/7d]
    N --> O[Update Campaign Tier]
```

### 90. Diagram 10 — AI Provider Economic Routing Flow

```mermaid
graph TD
    A[Job Request] --> B[Cost Estimation]
    B --> C[Quality Requirement Check]
    C --> D[Budget Available?]
    D -->|Yes| E[Provider Score Ranking]
    D -->|No| F[Deferral or Denial]
    E --> G[Select Top Provider]
    G --> H[Check Provider Health]
    H -->|Healthy| I[Route to Provider]
    H -->|Unhealthy| J[Try Fallback Provider]
    J --> K[Fallback Healthy?]
    K -->|Yes| I
    K -->|No| L[Hold — No Provider Available]
    I --> M[Log Cost Event]
    M --> N[Update Provider Performance Model]
    N --> O[Calculate Economic Score]
```

### 91. Diagram 11 — Autonomy Level Model

```mermaid
graph LR
    subgraph L0["L0 — OBSERVE"]
        L0A[Log Metrics]
        L0B[Generate Reports]
    end
    subgraph L1["L1 — RECOMMEND"]
        L1A[Generate Recommendations]
        L1B[Wait for Human]
    end
    subgraph L2["L2 — CONTROLLED (Default)"]
        L2A[Auto ±10%]
        L2B[Escalate Outside]
    end
    subgraph L3["L3 — BUDGET AUTONOMY"]
        L3A[Within Daily Cap]
        L3B[Weekly Review]
    end
    subgraph L4["L4 — FULL AUTONOMY"]
        L4A[All Decisions]
        L4B[Policy Only Limit]
    end
    L0 -->|2 weeks data| L1
    L1 -->|80% approval| L2
    L2 -->|90% match 90d| L3
    L3 -->|20% ROI 180d| L4
    L4 -.->|Policy violation| L2
```

### 92. Diagram 12 — Economic Agent Communication

```mermaid
graph TD
    subgraph BRAIN1["Brain 1: FinOps"]
        FO1[FO-001 FinOps]
        FO2[FO-002 AI Cost]
        FO3[FO-003 Content Cost]
        FO4[FO-004 Anomaly]
        FO5[FO-005 Forecast]
    end
    subgraph BRAIN2["Brain 2: Acquisition"]
        CA1[CA-001 Intelligence]
        CA2[CA-002 Budget Gov]
        CA3[CA-003 LTV Prediction]
        CA4[CA-004 Attribution]
        CA5[CA-005 Funnel]
        CA6[CA-006 Reallocation]
    end
    subgraph BRAIN3["Brain 3: Advertising"]
        AB1[AB-001 Budget]
        AB2[AB-002 Campaign ROI]
        AB3[AB-003 Routing]
        AB4[AB-004 Creative]
    end
    subgraph BRAIN4["Brain 4: Growth"]
        GC1[GC-001 Allocation]
        GC2[GC-002 Portfolio]
        GC3[GC-003 Efficiency]
        GC4[GC-004 Compliance]
    end
    subgraph CROSS["Cross-Cutting"]
        EG[EG-001 Governor]
        SV[SV-001 Survival]
        RF[RF-001 Runway]
        TP[TP-001 Treasury]
        ER[ER-001 Risk]
    end
    FO1 --> EG
    CA1 --> EG
    AB1 --> EG
    GC1 --> EG
    EG --> SV
    EG --> RF
    EG --> TP
    EG --> ER
    SV -->|Mode Change| FO1
    SV -->|Mode Change| CA1
    SV -->|Mode Change| AB1
    TP -->|Policy Block| EG
    ER -->|Risk Score| EG
```

### 93. Diagram 13 — Performance Learning Feedback Loop

```mermaid
graph TD
    A[Decision Executed] --> B[Monitor Impact 24h/72h/7d]
    B --> C[Collect Actual Metrics]
    C --> D[Compare Predicted vs Actual]
    D --> E{Within 20%?}
    E -->|Yes| F[Record Success]
    E -->|No| G[Investigate Variance]
    F --> H[Update Decision Model]
    G --> H
    H --> I[Update Agent Confidence Scores]
    I --> J[Update Provider Performance Rankings]
    J --> K[Update CAC/LTV Models]
    K --> L[Update Attribution Weights]
    L --> M[Update Anomaly Baselines]
    M --> N[Feed Into Next Decision Cycle]
    N --> A
```

### 94. Diagram 14 — Double Entry Ledger Model

```mermaid
graph TD
    A[Economic Event] --> B[Draft Journal Entry]
    B --> C[Validate: SUM DEBITS = SUM CREDITS]
    C -->|Balanced| D[Post Journal]
    C -->|Unbalanced| E[Reject — Balance Error]
    D --> F[Create Journal Entry Lines]
    F --> G[Update Account Balances]
    G --> H[Record in Ledger]
    H --> I[Daily Reconciliation Check]
    I -->|Match| J[Reconciled]
    I -->|Mismatch| K[Create Discrepancy Record]
    K --> L[Investigate & Resolve]
    L -->|Reversal| M[Create Reversal Journal]
    L -->|Adjustment| N[Create Adjusting Journal]
    M --> D
    N --> D
```

### 95. Diagram 15 — Economic Preflight Sequence

```mermaid
sequenceDiagram
    participant JO as Job Orchestrator
    participant EP as Economic Preflight
    participant KS as Kill Switch
    participant BG as Budget Gate
    participant TV as Survival Gate
    participant AP as Approval Gate

    JO->>EP: Job Request + Cost Estimate
    EP->>KS: Is kill switch active?
    KS-->>EP: NO (clear)
    EP->>EP: Is org active?
    EP->>EP: Is capital class permitted?
    EP->>BG: Is budget available?
    BG-->>EP: YES (₹5,000 available)
    EP->>BG: Is velocity within limits?
    BG-->>EP: YES
    EP->>TV: Is survival mode compatible?
    TV-->>EP: YES (NORMAL mode)
    EP->>TV: Is estimated cost acceptable?
    TV-->>EP: YES (within daily burn)
    EP->>AP: Is approval required?
    AP-->>EP: NO (L2, within ±10%)
    EP-->>JO: ALLOW (proceed with job)
```

### 96. Diagram 16 — Economic Database ER Diagram

```mermaid
erDiagram
    organizations ||--o{ cost_accounts : has
    organizations ||--o{ cost_events : has
    organizations ||--o{ economic_decisions : has
    organizations ||--o{ treasury_accounts : has
    organizations ||--o{ ledger_journals : has
    organizations ||--o{ revenue_events : has
    organizations ||--o{ survival_snapshots : has

    cost_accounts ||--o{ cost_events : tracks
    cost_events ||--o{ cost_allocations : allocates
    cost_events }o--|| cost_providers : via

    economic_decisions ||--o{ economic_decision_logs : logs
    economic_decisions ||--o{ economic_approvals : requires

    treasury_accounts ||--o{ treasury_pools : contains
    treasury_accounts ||--o{ treasury_balances : snapshots
    treasury_accounts ||--o{ treasury_ledger : movements

    ledger_journals ||--o{ ledger_entries : contains
    ledger_entries ||--o{ ledger_entry_lines : details

    revenue_events }o--o{ revenue_eligibility_rules : governed_by
    revenue_events }o--o{ realized_revenue_snapshots : aggregated_in

    cac_targets }o--o{ cac_snapshots : measured_by
    cac_budgets ||--o{ cac_budget_rules : governed_by

    acquisition_events ||--o{ acquisition_touchpoints : has
    acquisition_events }o--o{ acquisition_conversions : converts
    acquisition_funnels ||--o{ acquisition_funnel_stages : contains

    campaign_economics }o--|| economic_decisions : influenced_by
    channel_economics }o--|| advertising_decisions : influenced_by
```

---

## Part XXVIII — Expanded API Contract Schemas

### 97. Full API Request/Response Schemas

#### GET /api/economic/health

```
Request:
  Headers: { Authorization: "Bearer <session_token>" }
  Query: { period?: "daily" | "weekly" | "monthly" }

Response (200):
{
  "status": "ok",
  "data": {
    "organization_id": "uuid",
    "snapshot_date": "2026-07-15",
    "survival_mode": "NORMAL",
    "economic_state": "PARTIALLY_SELF_FUNDED",
    "autonomy_level": "L2",
    "cost_summary": {
      "total_daily_cost": 20300,
      "infra_cost": 3500,
      "ai_cost": 7800,
      "ads_cost": 6000,
      "content_cost": 2000,
      "ops_cost": 1000,
      "currency": "INR"
    },
    "revenue_summary": {
      "total_daily_revenue": 15000,
      "subscription_revenue": 8000,
      "transaction_revenue": 5000,
      "advertising_revenue": 2000,
      "currency": "INR"
    },
    "key_metrics": {
      "blended_cac": 150,
      "avg_roas": 3.2,
      "ltv_cac_ratio": 8.5,
      "self_funding_ratio": 0.74,
      "runway_days": 180,
      "budget_utilization_pct": 65.2
    },
    "alerts": {
      "active_count": 2,
      "critical_count": 0,
      "warning_count": 2
    }
  }
}

Error (401): { "error": "Unauthorized — invalid or expired session" }
Error (403): { "error": "Forbidden — insufficient role permissions" }
```

#### POST /api/economic/preflight

```
Request:
  Headers: { Authorization: "Bearer <system_token>", Content-Type: "application/json" }
  Body: {
    "organization_id": "uuid",
    "estimated_cost": 5000,
    "capital_class": "AI_COMPUTE_BUDGET",
    "treasury_pool_id": "uuid",
    "job_type": "LLM_COMPLETION",
    "provider_code": "OPENAI"
  }

Response (200):
{
  "status": "ok",
  "data": {
    "outcome": "ALLOW",
    "reason": "All preflight checks passed",
    "checks_passed": [
      "economic_spending_enabled",
      "kill_switch_clear",
      "org_active",
      "capital_class_permitted",
      "budget_available",
      "velocity_within_limits",
      "survival_mode_compatible",
      "cost_acceptable"
    ],
    "reserved_amount": 5000,
    "pool_remaining_after": 45000,
    "reservation_id": "uuid"
  }
}

Response (200, denied):
{
  "status": "ok",
  "data": {
    "outcome": "DENY",
    "reason": "Insufficient budget in pool",
    "checks_passed": ["economic_spending_enabled", "kill_switch_clear"],
    "checks_failed": ["budget_available"],
    "pool_remaining": 3200,
    "shortfall": 1800
  }
}

Error (401): { "error": "Unauthorized" }
Error (422): { "error": "Invalid capital class or treasury pool" }
```

#### POST /api/economic/kill-switches/:scope/activate

```
Request:
  Headers: { Authorization: "Bearer <owner_token>", Content-Type: "application/json" }
  Body: {
    "switch_type": "ADVERTISING_STOP",
    "reason": "Budget crisis — revenue dropped 40%",
    "expected_duration": "7 days"
  }

Response (200):
{
  "status": "ok",
  "data": {
    "kill_switch_id": "uuid",
    "switch_type": "ADVERTISING_STOP",
    "scope_type": "ORGANIZATION",
    "status": "ACTIVE",
    "activated_at": "2026-07-15T14:30:00Z",
    "review_at": "2026-07-22T14:30:00Z",
    "affected_budgets": ["uuid1", "uuid2"],
    "affected_agents": ["AB-001", "AB-002", "AB-003", "AB-004"]
  }
}

Error (401): { "error": "Unauthorized — owner role required" }
Error (403): { "error": "Forbidden — only organization owner can activate kill switches" }
```

---

## Part XXIX — Expanded Event Contract Schemas

### 98. Full Event Payload Schemas

#### economic.cost.recorded

```yaml
event:
  name: "economic.cost.recorded"
  version: "1.0"
  event_id: "uuid (generated)"
  organization_id: "uuid (required)"
  occurred_at: "ISO 8601 timestamp"
  producer: "string — system component that generated the cost"
  correlation_id: "uuid (optional — links to originating request)"
  idempotency_key: "string (optional — prevents duplicate processing)"
  payload:
    cost_event_id: "uuid — references cost_events.id"
    cost_account_id: "uuid — references cost_accounts.id"
    cost_provider_id: "uuid (optional) — references cost_providers.id"
    operation_type: "string — LLM_COMPLETION, IMAGE_GEN, AD_CLICK, etc."
    operation_id: "uuid — reference to source operation"
    cost_amount: "decimal — actual cost in source currency"
    cost_currency: "string — INR, USD, etc."
    cost_usd_equivalent: "decimal — normalized to USD"
    attribution:
      campaign_id: "uuid (optional)"
      industry_id: "uuid (optional)"
      category_id: "uuid (optional)"
      ai_provider_id: "uuid (optional)"
      ai_model_id: "uuid (optional)"
      channel_id: "uuid (optional)"
      job_id: "uuid (optional)"
      workflow_id: "uuid (optional)"
      asset_id: "uuid (optional)"
    measurement:
      duration_ms: "int (optional)"
      tokens_consumed: "int (optional)"
      output_quality_score: "decimal (optional)"
  consumer_expectations:
    - "FinOps Agent: Aggregate for cost dashboards"
    - "Anomaly Agent: Check against baselines for spike detection"
    - "Analytics: Store for multi-dimensional reporting"
  retry_behavior:
    max_retries: 3
    backoff: "exponential — 1s, 5s, 25s"
  dead_letter_behavior:
    action: "Alert — cost event lost, economic data may be incomplete"
```

#### economic.decision.executed

```yaml
event:
  name: "economic.decision.executed"
  version: "1.0"
  event_id: "uuid (generated)"
  organization_id: "uuid (required)"
  occurred_at: "ISO 8601 timestamp"
  producer: "DecisionExecutionEngine"
  correlation_id: "uuid — links to decision_id"
  payload:
    decision_id: "uuid — references economic_decisions.id"
    decision_type: "string — SCALE_BUDGET, PAUSE_CAMPAIGN, etc."
    agent_id: "string — which agent made the decision"
    target_entity_type: "string — campaign, channel, provider, etc."
    target_entity_id: "uuid"
    actual_cost: "decimal (optional)"
    actual_impact: "object — observed changes after execution"
    execution_status: "string — SUCCESS, PARTIAL, FAILED"
    execution_duration_ms: "int"
  consumer_expectations:
    - "Learning Engine: Update decision model with outcome"
    - "Reporting: Update dashboards"
    - "Audit: Record for compliance trail"
  retry_behavior:
    max_retries: 1
    backoff: "immediate"
  dead_letter_behavior:
    action: "Alert — decision execution event lost, learning data incomplete"
```

#### economic.ledger.posted

```yaml
event:
  name: "economic.ledger.posted"
  version: "1.0"
  event_id: "uuid (generated)"
  organization_id: "uuid (required)"
  occurred_at: "ISO 8601 timestamp"
  producer: "LedgerPostingEngine"
  correlation_id: "uuid — links to journal_id"
  payload:
    journal_id: "uuid — references ledger_journals.id"
    journal_number: "string"
    journal_type: "string"
    entry_count: "int — number of ledger entries"
    total_debit: "decimal"
    total_credit: "decimal"
    currency: "string"
    posted_by: "string"
    source_system: "string"
  consumer_expectations:
    - "Audit system: Record for financial compliance"
    - "Reconciliation engine: Include in next reconciliation run"
  retry_behavior:
    max_retries: 5
    backoff: "exponential — 2s, 10s, 60s, 300s, 1800s"
  dead_letter_behavior:
    action: "CRITICAL Alert — ledger posting event lost, financial integrity at risk"
```

---

*This remediation section adds: ~30 new CREATE TABLE DDLs, ~80 RLS policies, 4 financial integrity functions, 2 triggers, 10 additional Mermaid diagrams, expanded API contract schemas, and expanded event contract schemas. Total addition: ~2,200 lines.*

"""

# Insert the remediation content before the certification matrix
new_content = content[:insert_idx] + remediation + "\n" + content[insert_idx:]

with open(TARGET_FILE, "w") as f:
    f.write(new_content)

# Count lines
line_count = new_content.count("\n") + 1
print(f"Remediation complete. New line count: {line_count}")
print(f"Target: 8,000-12,000 lines")
print(f"Status: {'✅ PASS' if 8000 <= line_count <= 12000 else '⚠️ NEEDS MORE' if line_count < 8000 else '⚠️ OVER TARGET'}")
