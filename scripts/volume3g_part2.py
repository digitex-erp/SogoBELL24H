#!/usr/bin/env python3
"""Volume 3G — Parts IV-XIV and Appendices (continuation)"""
# This file is appended to volume3g_gen.py logic

def part_iv_events():
    """Enterprise Event Catalogue — 294 events across 26 categories"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part IV — Enterprise Event Catalogue")
    hr()
    w("""> **Every event in Bell24h-OS is defined here.** No event may be emitted that is not registered in this catalogue.\n""")
    w("""**Naming Convention:** `{category}.{action}`\n""")
    w("""**Valid Actions:** `created`, `updated`, `deleted`, `started`, `completed`, `failed`, `cancelled`, `paused`, `resumed`, `retrying`, `timeout`, `approved`, `rejected`, `expired`, `triggered`, `executed`, `published`, `unpublished`, `archived`, `restored`, `synced`, `detected`, `discovered`, `generated`, `requested`, `submitted`, `qualified`, `verified`, `matched`, `sent`, `received`, `opened`, `clicked`, `converted`, `fallback`, `exceeded`, `allocated`, `released`, `reserved`, `consumed`, `refunded`, `reconciled`\n""")

    # 22. Auth & User Events
    heading(2, "22. Authentication & User Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["1", "user.created", "created", "New user registered"],
        ["2", "user.updated", "updated", "User profile updated"],
        ["3", "user.deleted", "deleted", "User account deleted"],
        ["4", "user.signed_in", "signed_in", "User authenticated"],
        ["5", "user.signed_out", "signed_out", "User session ended"],
        ["6", "user.password_changed", "password_changed", "Password updated"],
        ["7", "user.mfa_enabled", "mfa_enabled", "Multi-factor auth enabled"],
        ["8", "user.mfa_disabled", "mfa_disabled", "Multi-factor auth disabled"],
        ["9", "user.role_assigned", "role_assigned", "Role assigned to user"],
        ["10", "user.role_revoked", "role_revoked", "Role removed from user"],
        ["11", "user.session_expired", "session_expired", "Session timeout"],
        ["12", "user.login_failed", "login_failed", "Failed login attempt"],
    ])

    # 23. Organization
    heading(2, "23. Organization Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["13", "org.created", "created", "New organization created"],
        ["14", "org.updated", "updated", "Organization settings changed"],
        ["15", "org.suspended", "suspended", "Organization suspended"],
        ["16", "org.reactivated", "reactivated", "Organization reactivated"],
        ["17", "org.plan_changed", "plan_changed", "Subscription plan changed"],
        ["18", "org.member_added", "member_added", "User joined organization"],
        ["19", "org.member_removed", "member_removed", "User left organization"],
        ["20", "org.team_created", "team_created", "New team created"],
        ["21", "org.brand_kit_updated", "brand_kit_updated", "Brand guidelines changed"],
        ["22", "org.integrations_updated", "integrations_updated", "Integration settings changed"],
        ["23", "org.billing_updated", "billing_updated", "Billing information changed"],
        ["24", "org.limits_updated", "limits_updated", "Usage limits changed"],
    ])

    # 24. Content
    heading(2, "24. Content Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["25", "content.requested", "requested", "Content generation requested"],
        ["26", "content.created", "created", "Content plan created"],
        ["27", "content.generated", "generated", "AI content generation complete"],
        ["28", "content.updated", "updated", "Content modified"],
        ["29", "content.deleted", "deleted", "Content removed"],
        ["30", "content.approved", "approved", "Content approved for publishing"],
        ["31", "content.rejected", "rejected", "Content rejected"],
        ["32", "content.published", "published", "Content published to platform"],
        ["33", "content.unpublished", "unpublished", "Content removed from platform"],
        ["34", "content.failed", "failed", "Content generation failed"],
        ["35", "content.cancelled", "cancelled", "Content generation cancelled"],
        ["36", "content.retry_started", "retry_started", "Content generation retrying"],
        ["37", "content.quality_checked", "quality_checked", "QA completed on content"],
        ["38", "content.translated", "translated", "Content translated to target language"],
        ["39", "content.optimized", "optimized", "SEO optimization applied"],
        ["40", "content.archived", "archived", "Content archived"],
        ["41", "content.restored", "restored", "Content restored from archive"],
        ["42", "content.duplicated", "duplicated", "Content duplicated"],
    ])

    # 25. Image
    heading(2, "25. Image Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["43", "image.requested", "requested", "Image generation requested"],
        ["44", "image.queued", "queued", "Image job queued"],
        ["45", "image.generated", "generated", "Image generation complete"],
        ["46", "image.processed", "processed", "Post-processing complete"],
        ["47", "image.watermarked", "watermarked", "Watermark applied"],
        ["48", "image.resized", "resized", "Image resized for platform"],
        ["49", "image.stored", "stored", "Image stored in storage"],
        ["50", "image.failed", "failed", "Image generation failed"],
        ["51", "image.cancelled", "cancelled", "Image generation cancelled"],
        ["52", "image.retry_started", "retry_started", "Image generation retrying"],
        ["53", "image.style_applied", "style_applied", "Style transfer applied"],
        ["54", "image.qr_overlay", "qr_overlay", "QR code overlay applied"],
        ["55", "image.thumbnail_generated", "thumbnail_generated", "Thumbnail created"],
    ])

    # 26. Video
    heading(2, "26. Video Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["56", "video.requested", "requested", "Video generation requested"],
        ["57", "video.script_generated", "script_generated", "Video script created"],
        ["58", "video.storyboard_created", "storyboard_created", "Storyboard generated"],
        ["59", "video.queued", "queued", "Video job queued"],
        ["60", "video.generating", "generating", "Video generation in progress"],
        ["61", "video.generated", "generated", "Video generation complete"],
        ["62", "video.edited", "edited", "Video edited"],
        ["63", "video.rendered", "rendered", "Video rendered"],
        ["64", "video.encoded", "encoded", "Video encoded for platform"],
        ["65", "video.stored", "stored", "Video stored in storage"],
        ["66", "video.failed", "failed", "Video generation failed"],
        ["67", "video.cancelled", "cancelled", "Video generation cancelled"],
        ["68", "video.thumbnail_generated", "thumbnail_generated", "Video thumbnail created"],
    ])

    # 27. Voice
    heading(2, "27. Voice & Audio Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["69", "voice.requested", "requested", "Voice generation requested"],
        ["70", "voice.queued", "queued", "Voice job queued"],
        ["71", "voice.generated", "generated", "Voice generation complete"],
        ["72", "voice.processed", "processed", "Audio post-processing complete"],
        ["73", "voice.normalized", "normalized", "Audio normalized"],
        ["74", "voice.stored", "stored", "Voice file stored"],
        ["75", "voice.failed", "failed", "Voice generation failed"],
        ["76", "voice.cancelled", "cancelled", "Voice generation cancelled"],
        ["77", "audio.transcribed", "transcribed", "Audio transcribed to text"],
        ["78", "audio.translated", "translated", "Audio translated"],
        ["79", "podcast.episode_generated", "episode_generated", "Podcast episode complete"],
    ])

    # 28. Avatar
    heading(2, "28. Avatar Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["80", "avatar.requested", "requested", "Avatar generation requested"],
        ["81", "avatar.created", "created", "Avatar model created"],
        ["82", "avatar.animated", "animated", "Avatar animation generated"],
        ["83", "avatar.lip_synced", "lip_synced", "Lip sync generated"],
        ["84", "avatar.rendered", "rendered", "Avatar video rendered"],
        ["85", "avatar.stored", "stored", "Avatar stored"],
        ["86", "avatar.failed", "failed", "Avatar generation failed"],
        ["87", "avatar.cancelled", "cancelled", "Avatar generation cancelled"],
        ["88", "avatar.composited", "composited", "Background composited"],
    ])

    # 29. Campaign
    heading(2, "29. Campaign Events")
    table(["#", "Event Name", "Action", "Description"], [
        ["89", "campaign.created", "created", "Campaign created"],
        ["90", "campaign.updated", "updated", "Campaign updated"],
        ["91", "campaign.deleted", "deleted", "Campaign deleted"],
        ["92", "campaign.started", "started", "Campaign launched"],
        ["93", "campaign.paused", "paused", "Campaign paused"],
        ["94", "campaign.resumed", "resumed", "Campaign resumed"],
        ["95", "campaign.completed", "completed", "Campaign finished"],
        ["96", "campaign.cancelled", "cancelled", "Campaign cancelled"],
        ["97", "campaign.budget_exceeded", "budget_exceeded", "Campaign exceeded budget"],
        ["98", "campaign.threshold_reached", "threshold_reached", "Campaign hit performance threshold"],
        ["99", "campaign.audience_updated", "audience_updated", "Target audience changed"],
        ["100", "campaign.content_scheduled", "content_scheduled", "Content scheduled for campaign"],
        ["101", "campaign.archived", "archived", "Campaign archived"],
        ["102", "campaign.restored", "restored", "Campaign restored"],
    ])

    # 30-47: Remaining event categories (condensed for script size)
    remaining_events = [
        ("30. Publishing Events", 103, [
            ("publishing.submitted", "Content submitted for publishing"),
            ("publishing.scheduled", "Content scheduled"),
            ("publishing.started", "Publishing initiated"),
            ("publishing.completed", "Successfully published"),
            ("publishing.failed", "Publishing failed"),
            ("publishing.retried", "Publishing retrying"),
            ("publishing.cancelled", "Publishing cancelled"),
            ("publishing.unpublished", "Content unpublished"),
            ("publishing.expired", "Scheduled publish expired"),
            ("publishing.platform_error", "Platform API error"),
            ("publishing.auth_expired", "Platform auth token expired"),
            ("publishing.rate_limited", "Platform rate limit hit"),
            ("publishing.content_approved", "Platform approved content"),
            ("publishing.content_rejected", "Platform rejected content"),
        ]),
        ("31. Job Orchestrator Events", 117, [
            ("job.created", "Job created"),
            ("job.queued", "Job added to queue"),
            ("job.started", "Job processing started"),
            ("job.progress", "Job progress update"),
            ("job.completed", "Job finished successfully"),
            ("job.failed", "Job failed"),
            ("job.retry_started", "Job retrying"),
            ("job.timeout", "Job timed out"),
            ("job.cancelled", "Job cancelled"),
            ("job.dead_lettered", "Job moved to DLQ"),
            ("job.priority_changed", "Job priority updated"),
        ]),
        ("32. Workflow Events", 128, [
            ("workflow.created", "Workflow definition created"),
            ("workflow.updated", "Workflow definition updated"),
            ("workflow.deleted", "Workflow definition deleted"),
            ("workflow.started", "Workflow execution started"),
            ("workflow.step_completed", "Workflow step finished"),
            ("workflow.step_failed", "Workflow step failed"),
            ("workflow.completed", "Workflow execution complete"),
            ("workflow.failed", "Workflow execution failed"),
            ("workflow.paused", "Workflow paused"),
            ("workflow.resumed", "Workflow resumed"),
            ("workflow.cancelled", "Workflow cancelled"),
            ("workflow.compensated", "Workflow compensation executed"),
        ]),
        ("33. Automation Events", 140, [
            ("automation.created", "Automation rule created"),
            ("automation.updated", "Automation rule updated"),
            ("automation.deleted", "Automation rule deleted"),
            ("automation.enabled", "Automation activated"),
            ("automation.disabled", "Automation deactivated"),
            ("automation.triggered", "Automation trigger fired"),
            ("automation.executed", "Automation action executed"),
            ("automation.failed", "Automation execution failed"),
            ("automation.condition_met", "Automation condition satisfied"),
            ("automation.condition_not_met", "Automation condition not met"),
        ]),
        ("34. AI Provider Events", 150, [
            ("provider.requested", "AI provider called"),
            ("provider.responded", "AI provider responded"),
            ("provider.failed", "AI provider call failed"),
            ("provider.rate_limited", "Provider rate limit hit"),
            ("provider.fallback", "Provider fallback triggered"),
            ("provider.recovered", "Provider recovered after failure"),
            ("provider.circuit_opened", "Circuit breaker opened"),
            ("provider.circuit_closed", "Circuit breaker closed"),
            ("provider.cost_recorded", "AI usage cost recorded"),
            ("provider.quota_exceeded", "Provider quota exhausted"),
            ("provider.model_switched", "Provider model changed"),
        ]),
        ("35. SEO Intelligence Events", 161, [
            ("seo.keyword_discovered", "New keyword found"),
            ("seo.keyword_updated", "Keyword metrics updated"),
            ("seo.cluster_created", "Keyword cluster created"),
            ("seo.cluster_updated", "Keyword cluster updated"),
            ("seo.content_gap_detected", "Content gap identified"),
            ("seo.ranking_changed", "SERP ranking changed"),
            ("seo.backlink_discovered", "New backlink found"),
            ("seo.competitor_analyzed", "Competitor analysis complete"),
            ("seo.technical_issue_detected", "Technical SEO issue found"),
            ("seo.optimization_applied", "SEO optimization applied"),
        ]),
        ("36. Industry Intelligence Events", 171, [
            ("industry.data_synced", "Industry data refreshed"),
            ("industry.trend_detected", "New trend identified"),
            ("industry.pain_point_identified", "Buyer pain point found"),
            ("industry.buyer_persona_updated", "Persona data refreshed"),
            ("industry.supplier_matched", "Supplier matched to buyer"),
            ("industry.market_shift_detected", "Market conditions changed"),
            ("industry.competitor_alert", "Competitor activity detected"),
            ("industry.category_expanded", "New subcategory added"),
        ]),
        ("37. Performance Intelligence Events", 179, [
            ("performance.metrics_collected", "Platform metrics fetched"),
            ("performance.dashboard_updated", "Dashboard data refreshed"),
            ("performance.anomaly_detected", "Performance anomaly found"),
            ("performance.benchmark_reached", "Benchmark threshold met"),
            ("performance.report_generated", "Performance report created"),
            ("performance.alert_triggered", "Performance alert fired"),
            ("performance.insight_generated", "AI insight created"),
            ("performance.recommendation_made", "Optimization recommended"),
        ]),
        ("38. VASE Economic Events", 187, [
            ("economic.decision_submitted", "Economic decision submitted"),
            ("economic.decision_executed", "Economic decision executed"),
            ("economic.decision_rejected", "Economic decision rejected"),
            ("economic.decision_timed_out", "Decision approval timed out"),
            ("economic.preflight_passed", "Preflight check passed"),
            ("economic.preflight_failed", "Preflight check failed"),
            ("economic.spending_approved", "Spending request approved"),
            ("economic.spending_rejected", "Spending request rejected"),
            ("economic.cost_anomaly_detected", "Cost anomaly found"),
            ("economic.breakeven_warning", "Breakeven approaching"),
            ("economic.runway_warning", "Runway below threshold"),
            ("economic.liquidity_alert", "Cash balance critically low"),
        ]),
        ("39. Budget Events", 199, [
            ("budget.created", "Budget allocated"),
            ("budget.updated", "Budget amount changed"),
            ("budget.approved", "Budget approved"),
            ("budget.rejected", "Budget rejected"),
            ("budget.exceeded", "Budget exceeded"),
            ("budget.threshold_reached", "Budget warning threshold hit"),
            ("budget.reserved", "Funds reserved"),
            ("budget.released", "Reserved funds released"),
            ("budget.reallocation_proposed", "Budget reallocation proposed"),
            ("budget.reallocation_executed", "Budget reallocated"),
            ("budget.rule_triggered", "Budget rule fired"),
            ("budget.experiment_started", "A/B budget experiment started"),
        ]),
        ("40. Ledger & Financial Events", 211, [
            ("ledger.entry_posted", "Ledger entry posted"),
            ("ledger.entry_rejected", "Ledger entry rejected (unbalanced)"),
            ("ledger.balance_updated", "Account balance updated"),
            ("ledger.reconciliation_started", "Reconciliation initiated"),
            ("ledger.reconciliation_completed", "Reconciliation complete"),
            ("ledger.reconciliation_discrepancy", "Discrepancy found"),
            ("treasury.balance_calculated", "Treasury balance computed"),
            ("treasury.alert_triggered", "Treasury alert fired"),
            ("invoice.created", "Invoice generated"),
            ("invoice.paid", "Invoice paid"),
            ("invoice.overdue", "Invoice overdue"),
        ]),
        ("41. Marketplace Events", 222, [
            ("rfq.created", "RFQ published"),
            ("rfq.qualified", "RFQ qualification complete"),
            ("rfq.response_received", "Supplier response received"),
            ("rfq.awarded", "RFQ awarded to supplier"),
            ("rfq.expired", "RFQ expired"),
            ("supplier.verified", "Supplier verification complete"),
            ("supplier.profile_updated", "Supplier profile changed"),
            ("supplier.matched", "Supplier matched to buyer"),
            ("buyer.verified", "Buyer verification complete"),
            ("buyer.inquiry_submitted", "Buyer inquiry posted"),
            ("buyer.matched", "Buyer matched to supplier"),
            ("trust.score_updated", "Trust score recalculated"),
            ("negotiation.started", "Negotiation initiated"),
            ("negotiation.completed", "Negotiation concluded"),
        ]),
        ("42. Storage Events", 236, [
            ("storage.upload_started", "File upload initiated"),
            ("storage.upload_completed", "File upload complete"),
            ("storage.upload_failed", "File upload failed"),
            ("storage.file_deleted", "File deleted"),
            ("storage.file_moved", "File relocated"),
            ("storage.file_renamed", "File renamed"),
            ("storage.cleanup_completed", "Temp file cleanup done"),
            ("storage.quota_warning", "Storage quota approaching limit"),
            ("storage.cdn_purge", "CDN cache purged"),
            ("storage.backup_completed", "Backup finished"),
        ]),
        ("43. Notification Events", 246, [
            ("notification.created", "Notification generated"),
            ("notification.sent", "Notification dispatched"),
            ("notification.delivered", "Notification delivered"),
            ("notification.opened", "Notification opened by user"),
            ("notification.clicked", "Notification action clicked"),
            ("notification.failed", "Notification delivery failed"),
            ("notification.dismissed", "Notification dismissed"),
            ("notification.scheduled", "Notification scheduled"),
            ("notification.expired", "Notification expired"),
        ]),
        ("44. Learning Engine Events", 255, [
            ("learning.experiment_started", "A/B test initiated"),
            ("learning.experiment_completed", "A/B test concluded"),
            ("learning.pattern_detected", "Performance pattern found"),
            ("learning.insight_generated", "AI insight created"),
            ("learning.recommendation_made", "Action recommended"),
            ("learning.recommendation_applied", "Recommendation implemented"),
            ("learning.model_updated", "Learning model retrained"),
            ("learning.feedback_recorded", "User feedback captured"),
            ("learning.benchmark_updated", "Benchmark recalculated"),
        ]),
        ("45. System Events", 264, [
            ("system.started", "System boot complete"),
            ("system.stopping", "System shutting down"),
            ("system.health_check", "Periodic health check"),
            ("system.deployment_completed", "New version deployed"),
            ("system.config_changed", "System config updated"),
            ("system.feature_flag_toggled", "Feature flag changed"),
            ("system.migration_completed", "Database migration done"),
            ("system.cache_cleared", "Cache invalidated"),
            ("system.scaling_event", "Auto-scaling triggered"),
            ("system.backup_started", "Backup initiated"),
            ("system.backup_completed", "Backup finished"),
        ]),
        ("46. Security Events", 275, [
            ("security.unauthorized_access", "Unauthorized access attempt"),
            ("security.rate_limit_exceeded", "Rate limit hit"),
            ("security.suspicious_activity", "Suspicious behavior detected"),
            ("security.api_key_created", "New API key generated"),
            ("security.api_key_revoked", "API key revoked"),
            ("security.webhook_registered", "Webhook endpoint registered"),
            ("security.webhook_failed", "Webhook delivery failed"),
            ("security.certificate_expiring", "TLS cert expiring soon"),
            ("security.audit_log_tampered", "Audit integrity violation"),
            ("security.kill_switch_activated", "Kill switch triggered"),
        ]),
        ("47. Analytics Events", 285, [
            ("analytics.tracked", "Event tracked"),
            ("analytics.page_view", "Page view recorded"),
            ("analytics.click", "Click event recorded"),
            ("analytics.conversion", "Conversion event recorded"),
            ("analytics.revenue", "Revenue event recorded"),
            ("analytics.cohort_updated", "Cohort analysis updated"),
            ("analytics.funnel_updated", "Funnel analysis updated"),
            ("analytics.attribution_updated", "Attribution model updated"),
            ("analytics.report_scheduled", "Report generation scheduled"),
            ("analytics.export_completed", "Data export finished"),
        ]),
    ]

    for title, start_num, events in remaining_events:
        heading(2, title)
        rows = [[str(start_num + i), name, desc] for i, (name, desc) in enumerate(events)]
        table(["#", "Event Name", "Action", "Description"], rows)

    # Summary
    heading(2, "Event Catalogue Summary")
    table(["Category", "Count"], [
        ["Authentication & User", "12"], ["Organization", "12"], ["Content", "18"],
        ["Image", "13"], ["Video", "13"], ["Voice & Audio", "11"], ["Avatar", "9"],
        ["Campaign", "14"], ["Publishing", "14"], ["Job Orchestrator", "11"],
        ["Workflow", "12"], ["Automation", "10"], ["AI Provider", "11"],
        ["SEO Intelligence", "10"], ["Industry Intelligence", "8"],
        ["Performance Intelligence", "8"], ["VASE Economic", "12"],
        ["Budget", "12"], ["Ledger & Financial", "11"], ["Marketplace", "13"],
        ["Storage", "10"], ["Notification", "9"], ["Learning Engine", "9"],
        ["System", "11"], ["Security", "10"], ["Analytics", "10"],
        ["TOTAL", "294"],
    ])

    hr()
    return "\n".join(lines)


def part_v_commands():
    """Command Contracts"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")
    def ts(code):
        w("```typescript"); w(code.strip()); w("```\n")

    heading(1, "Part V — Command Contracts")
    hr()
    w("""> **Every interaction with Bell24h-OS follows one of these contract types.** All contracts are typed, validated, and versioned.\n""")

    heading(2, "48. Command Structure")
    ts("""interface Command {
  command_id: string          // cmd_ prefixed UUIDv7
  command_type: string        // e.g., "CreateCampaign", "GenerateImage"
  organization_id: string     // Owning organization
  correlation_id: string      // Groups related operations
  actor: {
    type: 'user' | 'system' | 'agent' | 'scheduler'
    id: string
    name?: string
  }
  payload: Record<string, unknown>
  idempotency_key: string     // Deduplication key
  timestamp: string           // ISO 8601
  timeout_ms?: number         // Max wait time (default: 30s)
  metadata?: Record<string, unknown>
}""")

    heading(3, "48.1 Command Types by Module")
    table(["Module", "Commands"], [
        ["Campaign Intelligence", "CreateCampaign, UpdateCampaign, LaunchCampaign, PauseCampaign, CancelCampaign"],
        ["Content Planner", "GenerateContent, UpdateContent, ApproveContent, RejectContent"],
        ["Image Studio", "GenerateImage, ProcessImage, ApplyStyle, ResizeImage"],
        ["Video Studio", "GenerateVideo, EditVideo, RenderVideo, EncodeVideo"],
        ["Voice Studio", "GenerateVoice, TranscribeAudio, TranslateAudio"],
        ["Avatar Studio", "CreateAvatar, AnimateAvatar, LipSyncAvatar"],
        ["Publishing Center", "SchedulePublish, PublishContent, UnpublishContent"],
        ["Automation", "CreateAutomation, TriggerAutomation, EnableAutomation"],
        ["VASE", "SubmitEconomicDecision, ApproveSpending, KillSwitch"],
        ["Job Orchestrator", "EnqueueJob, CancelJob, RetryJob, ChangeJobPriority"],
        ["SEO Intelligence", "DiscoverKeywords, AnalyzeCompetitor, OptimizeContent"],
        ["Industry Intelligence", "SyncIndustryData, DetectTrends, UpdateBuyerPersonas"],
    ])

    heading(2, "49. Query Structure")
    ts("""interface Query {
  query_id: string
  query_type: string
  organization_id: string
  filters?: Record<string, unknown>
  pagination?: { page: number; page_size: number; sort_by?: string; sort_order?: 'asc' | 'desc' }
  fields?: string[]
  include?: string[]
  timestamp: string
  cache_ttl_seconds?: number
}

interface QueryResult<T> {
  query_id: string
  data: T
  meta?: { page?: number; page_size?: number; total?: number; total_pages?: number }
  cached: boolean
  cache_age_seconds?: number
  timestamp: string
}""")

    heading(2, "50. Reply Structure")
    ts("""interface Reply {
  reply_id: string
  command_id: string
  status: 'success' | 'error' | 'partial' | 'rejected'
  data?: Record<string, unknown>
  error?: { code: string; message: string; retryable: boolean; suggested_action?: string }
  metadata?: Record<string, unknown>
  timestamp: string
  duration_ms: number
}""")

    heading(2, "51. Notification Structure")
    ts("""interface Notification {
  notification_id: string
  notification_type: string
  organization_id: string
  recipients: Array<{ type: 'user' | 'team' | 'role' | 'webhook'; id: string }>
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  data?: Record<string, unknown>
  channels: Array<'in_app' | 'email' | 'slack' | 'whatsapp' | 'sms'>
  expires_at?: string
  action_url?: string
  timestamp: string
}""")

    heading(2, "52. Error Structure")
    ts("""interface Error {
  error_id: string
  error_code: string          // Standardized: CATEGORY_DESCRIPTOR
  category: 'AUTH' | 'AI' | 'JOB' | 'CONTENT' | 'MEDIA' | 'SEO' | 'VASE' | 'PUBLISH' | 'WORKFLOW' | 'SYSTEM' | 'MARKETPLACE' | 'STORAGE' | 'INTEGRATION'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  details?: Record<string, unknown>
  context: { organization_id?: string; correlation_id?: string; service: string; operation: string }
  retryable: boolean
  retry_after_ms?: number
  timestamp: string
}""")

    heading(2, "53. Compensation Structure")
    ts("""interface Compensation {
  compensation_id: string
  original_event_id: string
  compensation_type: string
  organization_id: string
  reason: string
  payload: Record<string, unknown>
  requires_approval: boolean
  approved_by?: string
  timestamp: string
}""")

    heading(2, "54. Retry & Timeout Policies")
    table(["Job Type", "Max Retries", "Backoff", "Timeout", "On Timeout"], [
        ["Image Generation", "3", "1s, 2s, 4s", "5 min", "Retry"],
        ["Video Generation", "3", "2s, 4s, 8s", "30 min", "Retry"],
        ["Publishing", "5", "5s, 15s, 45s", "10 min", "Retry"],
        ["Economic Decision", "0", "None", "24 hours", "Fail"],
        ["Email Delivery", "3", "10s, 30s, 90s", "2 min", "Retry"],
        ["Report Generation", "2", "30s, 2min", "30 min", "Retry"],
    ])

    heading(2, "55. Heartbeat Structure")
    ts("""interface Heartbeat {
  heartbeat_id: string
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime_seconds: number
  metrics: {
    cpu_usage_percent?: number
    memory_usage_percent?: number
    active_connections?: number
    queue_depth?: number
    error_rate_percent?: number
    avg_response_time_ms?: number
  }
  dependencies?: Array<{ service: string; status: 'healthy' | 'degraded' | 'unhealthy'; latency_ms?: number }>
}""")

    hr()
    return "\n".join(lines)


def part_vi_bus():
    """Enterprise Message Bus"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part VI — Enterprise Message Bus")
    hr()

    heading(2, "56. Bus Topology")
    w("""```
┌─────────────────────────────────────────────────────────────────┐
│                     ENTERPRISE MESSAGE BUS                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  TOPICS   │  │  QUEUES   │  │ STREAMS  │  │ SCHEDULED │      │
│  │ content.*│  │ critical │  │ events   │  │  cron     │      │
│  │ image.*  │  │ high     │  │ audit    │  │  delayed  │      │
│  │ video.*  │  │ normal   │  │ analytics│  │  recurring│      │
│  │ campaign*│  │ low      │  │          │  │           │      │
│  │ economic*│  │ retry/dlq│  │          │  │           │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              CONSUMER GROUPS                          │      │
│  │ campaign-intel │ content-planner │ publishing-center  │      │
│  │ performance    │ learning-engine │ vasa               │      │
│  │ seo-intel      │ industry-intel  │ media-composer     │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```""")

    heading(2, "57. Topics")
    table(["Topic Pattern", "Description", "Retention", "Key Consumers"], [
        ["content.*", "All content lifecycle events", "30 days", "Content Planner, Publishing, QA"],
        ["image.*", "All image events", "30 days", "QA, Publishing, Media Composer"],
        ["video.*", "All video events", "30 days", "QA, Publishing, Media Composer"],
        ["voice.*", "All voice events", "30 days", "Media Composer, Publishing"],
        ["campaign.*", "All campaign events", "90 days", "Analytics, Content Planner, Learning"],
        ["job.*", "All job events", "7 days", "Job Orchestrator"],
        ["workflow.*", "All workflow events", "30 days", "Workflow Engine"],
        ["automation.*", "All automation events", "30 days", "Automation Platform"],
        ["provider.*", "AI provider events", "30 days", "VASE, Analytics"],
        ["seo.*", "SEO events", "90 days", "Content Planner"],
        ["industry.*", "Industry events", "90 days", "Content Planner"],
        ["performance.*", "Performance events", "90 days", "Learning, Dashboard"],
        ["economic.*", "VASE economic events", "365 days", "VASE, Ledger"],
        ["budget.*", "Budget events", "365 days", "VASE, Ledger"],
        ["ledger.*", "Financial ledger events", "365 days", "VASE, Compliance"],
        ["publishing.*", "Publishing events", "90 days", "Analytics, Learning"],
        ["rfq.*", "RFQ events", "90 days", "Marketplace"],
        ["supplier.*", "Supplier events", "90 days", "Marketplace, Trust"],
        ["buyer.*", "Buyer events", "90 days", "Marketplace, Trust"],
        ["storage.*", "Storage events", "7 days", "Monitoring"],
        ["notification.*", "Notification events", "30 days", "Analytics"],
        ["system.*", "System events", "30 days", "Monitoring"],
        ["security.*", "Security events", "365 days", "Compliance"],
        ["analytics.*", "Analytics events", "90 days", "Learning"],
    ])

    heading(2, "58. Queues")
    table(["Queue", "Purpose", "Concurrency", "Max Depth", "TTL"], [
        ["critical", "Auth, security, kill switch", "10", "1,000", "24 hours"],
        ["high", "Publishing, email, notifications", "5", "5,000", "24 hours"],
        ["normal", "Content generation, campaigns", "3", "10,000", "24 hours"],
        ["low", "Analytics, reports, cleanup", "2", "10,000", "12 hours"],
        ["ai-tasks", "AI provider calls", "5", "5,000", "24 hours"],
        ["retry", "Failed message retries", "2", "1,000", "24 hours"],
        ["dead-letter", "Permanently failed messages", "1", "10,000", "30 days"],
        ["replay", "Event replay processing", "1", "1,000", "24 hours"],
        ["scheduled", "Time-delayed messages", "1", "50,000", "7 days"],
    ])

    heading(2, "59. Priority Levels")
    table(["Priority", "Value", "Processing", "Use Case"], [
        ["P0 — Critical", "0", "Immediate", "Kill switch, security alerts, system failures"],
        ["P1 — High", "1", "Within 1s", "Publishing, payment, authentication"],
        ["P2 — Normal", "2", "Within 5s", "Content generation, campaign updates"],
        ["P3 — Low", "3", "Within 30s", "Analytics, reports, background tasks"],
        ["P4 — Background", "4", "Best effort", "Cleanup, archival, telemetry"],
    ])

    heading(2, "60. Worker Queues")
    table(["Worker Queue", "Worker Type", "Instances", "Max Job Time"], [
        ["worker.image", "Image Worker", "3", "5 minutes"],
        ["worker.video", "Video Worker", "2", "30 minutes"],
        ["worker.voice", "Voice Worker", "2", "5 minutes"],
        ["worker.avatar", "Avatar Worker", "2", "15 minutes"],
        ["worker.publishing", "Publishing Worker", "3", "10 minutes"],
        ["worker.analytics", "Analytics Worker", "2", "15 minutes"],
        ["worker.email", "Email Worker", "2", "2 minutes"],
        ["worker.report", "Report Worker", "1", "30 minutes"],
    ])

    heading(2, "61. Retry Queues")
    table(["Retry Queue", "Max Retries", "Backoff", "DLQ After"], [
        ["retry.immediate", "3", "1s, 2s, 4s", "3 failures"],
        ["retry.short", "3", "5s, 15s, 45s", "3 failures"],
        ["retry.medium", "3", "30s, 2min, 10min", "3 failures"],
        ["retry.long", "3", "5min, 30min, 2hr", "3 failures"],
    ])

    heading(2, "62. Dead Letter Queues")
    table(["DLQ", "Alert Threshold", "Retention", "Review"], [
        ["dlq.critical", "1 message", "90 days", "Immediate"],
        ["dlq.high", "5 messages", "60 days", "Daily"],
        ["dlq.normal", "10 messages", "30 days", "Weekly"],
        ["dlq.low", "20 messages", "14 days", "Monthly"],
    ])

    hr()
    return "\n".join(lines)


def part_vii_schemas():
    """Message Schemas"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def hr(): w("\n---\n")
    def json_schema(code):
        w("```json"); w(code.strip()); w("```\n")
    def ts(code):
        w("```typescript"); w(code.strip()); w("```\n")

    heading(1, "Part VII — Message Schemas")
    hr()

    heading(2, "66. JSON Schema — Event Envelope")
    json_schema("""{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://bell24h-os.com/schemas/event-envelope-v1.0.json",
  "type": "object",
  "required": ["event_id", "event_version", "event_name", "event_type", "event_category", "event_action", "organization_id", "correlation_id", "actor", "timestamp", "schema_version", "payload", "metadata"],
  "properties": {
    "event_id": { "type": "string", "pattern": "^evt_[0-9a-f]{32}$" },
    "event_version": { "type": "string", "pattern": "^\\\\d+\\\\.\\\\d+\\\\.\\\\d+$" },
    "event_name": { "type": "string", "pattern": "^[a-z]+\\\\.[a-z_]+$" },
    "event_type": { "type": "string", "enum": ["domain", "integration", "system", "notification", "error"] },
    "event_category": { "type": "string", "minLength": 1 },
    "event_action": { "type": "string", "minLength": 1 },
    "organization_id": { "type": "string", "pattern": "^org_[0-9a-f]{32}$" },
    "correlation_id": { "type": "string", "pattern": "^corr_[0-9a-f]{32}$" },
    "actor": {
      "type": "object",
      "required": ["type", "id"],
      "properties": {
        "type": { "type": "string", "enum": ["user", "system", "agent", "scheduler", "webhook"] },
        "id": { "type": "string" },
        "name": { "type": "string" }
      }
    },
    "timestamp": { "type": "string", "format": "date-time" },
    "schema_version": { "type": "string" },
    "payload": { "type": "object" },
    "metadata": {
      "type": "object",
      "required": ["source", "version"],
      "properties": {
        "source": { "type": "string" },
        "version": { "type": "string" },
        "trace_id": { "type": "string" },
        "environment": { "type": "string", "enum": ["development", "staging", "production"] }
      }
    },
    "signature": { "type": ["string", "null"] },
    "trace_context": { "type": ["object", "null"] }
  },
  "additionalProperties": false
}""")

    heading(2, "67. TypeScript Interfaces")
    ts("""// ── Event Envelope ──
export interface Bell24hEvent {
  event_id: string
  event_version: string
  event_name: string
  event_type: 'domain' | 'integration' | 'system' | 'notification' | 'error'
  event_category: string
  event_action: string
  organization_id: string
  correlation_id: string
  causation_id: string | null
  workflow_id: string | null
  job_id: string | null
  campaign_id: string | null
  asset_id: string | null
  actor: Actor
  timestamp: string
  schema_version: string
  payload: Record<string, unknown>
  metadata: EventMetadata
  signature: string | null
  trace_context: TraceContext | null
}

export interface Actor {
  type: 'user' | 'system' | 'agent' | 'scheduler' | 'webhook'
  id: string
  name?: string
}

export interface EventMetadata {
  source: string
  version: string
  trace_id?: string
  span_id?: string
  environment?: 'development' | 'staging' | 'production'
  region?: string
}

export interface TraceContext {
  trace_id: string
  span_id: string
  parent_span_id: string | null
  service: string
  operation: string
}

// ── Command ──
export interface Bell24hCommand {
  command_id: string
  command_type: string
  organization_id: string
  correlation_id: string
  actor: Actor
  payload: Record<string, unknown>
  idempotency_key: string
  timestamp: string
  timeout_ms?: number
  metadata?: Record<string, unknown>
}

// ── Reply ──
export interface Bell24hReply {
  reply_id: string
  command_id: string
  status: 'success' | 'error' | 'partial' | 'rejected'
  data?: Record<string, unknown>
  error?: ErrorDetail
  timestamp: string
  duration_ms: number
}

export interface ErrorDetail {
  error_code: string
  message: string
  details?: Record<string, unknown>
  retryable: boolean
  suggested_action?: string
}""")

    heading(2, "68. Versioning Strategy")
    w("""| Change Type | Version Impact | Example |
|---|---|---|
| New optional field | Minor (1.0 → 1.1) | Adding metadata.region |
| New required field | Major (1.0 → 2.0) | Adding payload.language |
| Field removal | Major (1.0 → 2.0) | Removing deprecated field |
| Field type change | Major (1.0 → 2.0) | Changing amount from int to decimal |
| Enum value addition | Minor (1.0 → 1.1) | Adding actor.type: 'agent' |
""")

    heading(2, "69. Backward Compatibility Rules")
    w("""1. **Consumers must tolerate unknown fields** — New fields don't break old consumers
2. **New optional fields are always safe** — No consumer changes needed
3. **Required field additions require consumer updates** — Coordinate deployment
4. **Field removal requires deprecation period** — 30 days minimum
5. **Type changes require new event version** — Old version continues alongside new
""")

    hr()
    return "\n".join(lines)


def part_viii_contracts():
    """Integration Contracts"""
    lines = []
    def w(t=""): lines.append(t)
    def heading(l, t): w(f"\n{'#' * l} {t}\n")
    def table(h, r):
        w("| " + " | ".join(h) + " |")
        w("|" + "|".join(["---"]*len(h)) + "|")
        for row in r: w("| " + " | ".join(str(c) for c in row) + " |")
        w("")
    def hr(): w("\n---\n")

    heading(1, "Part VIII — Integration Contracts")
    hr()
    w("""> **Every module exposes a formal Integration Contract** defining what events it emits, consumes, and commands it handles.\n""")

    contracts = [
        ("72. Prompt Studio Contract", [
            ["Emits", "content.requested, content.generated"],
            ["Consumes", "campaign.created, industry.trend_detected, seo.keyword_discovered"],
            ["Commands", "GenerateContent"],
        ]),
        ("73. Content Planner Contract", [
            ["Emits", "content.created, content.updated"],
            ["Consumes", "campaign.created, industry.data_synced, seo.cluster_created, performance.insight_generated"],
            ["Commands", "CreateContentPlan"],
        ]),
        ("74. Image Studio Contract", [
            ["Emits", "image.requested, image.generated, image.processed, image.failed"],
            ["Consumes", "content.generated, provider.fallback"],
            ["Commands", "GenerateImage, ProcessImage"],
        ]),
        ("75. Video Studio Contract", [
            ["Emits", "video.requested, video.script_generated, video.storyboard_created, video.generated, video.failed"],
            ["Consumes", "content.generated, voice.generated"],
            ["Commands", "GenerateVideo"],
        ]),
        ("76. Voice Studio Contract", [
            ["Emits", "voice.requested, voice.generated, voice.failed, audio.transcribed"],
            ["Consumes", "content.generated"],
            ["Commands", "GenerateVoice, TranscribeAudio"],
        ]),
        ("77. Avatar Studio Contract", [
            ["Emits", "avatar.requested, avatar.generated, avatar.failed"],
            ["Consumes", "voice.generated"],
            ["Commands", "CreateAvatar"],
        ]),
        ("78. Media Composer Contract", [
            ["Emits", "content.generated (composed), content.failed"],
            ["Consumes", "image.generated, video.generated, voice.generated, avatar.generated"],
            ["Commands", "ComposeAsset"],
        ]),
        ("79. Publishing Center Contract", [
            ["Emits", "publishing.submitted, publishing.completed, publishing.failed, content.published"],
            ["Consumes", "content.generated, content.approved, automation.triggered"],
            ["Commands", "SchedulePublish, PublishContent"],
        ]),
        ("80. Automation Platform Contract", [
            ["Emits", "automation.triggered, automation.executed, automation.failed"],
            ["Consumes", "campaign.started, performance.anomaly_detected, economic.cost_anomaly_detected"],
            ["Commands", "CreateAutomation, TriggerAutomation"],
        ]),
        ("81. Campaign Intelligence Contract", [
            ["Emits", "campaign.created, campaign.started, campaign.completed, campaign.budget_exceeded"],
            ["Consumes", "performance.metrics_collected, learning.recommendation_applied, content.published"],
            ["Commands", "CreateCampaign, LaunchCampaign"],
        ]),
        ("82. Performance Intelligence Contract", [
            ["Emits", "performance.metrics_collected, performance.anomaly_detected, performance.insight_generated"],
            ["Consumes", "publishing.completed, analytics.tracked"],
            ["Commands", "CollectMetrics"],
        ]),
        ("83. VASE Contract", [
            ["Emits", "economic.decision_executed, budget.approved, budget.exceeded, economic.runway_warning, treasury.balance_calculated"],
            ["Consumes", "job.completed, provider.cost_recorded, campaign.completed, campaign.budget_exceeded"],
            ["Commands", "SubmitEconomicDecision, ApproveSpending"],
        ]),
        ("84. Industry Intelligence Contract", [
            ["Emits", "industry.data_synced, industry.trend_detected, industry.pain_point_identified"],
            ["Consumes", "system.health_check"],
            ["Commands", "SyncIndustryData"],
        ]),
        ("85. SEO Intelligence Contract", [
            ["Emits", "seo.keyword_discovered, seo.cluster_created, seo.content_gap_detected"],
            ["Consumes", "content.published, industry.data_synced"],
            ["Commands", "DiscoverKeywords, AnalyzeCompetitor"],
        ]),
        ("86. Global Job Orchestrator Contract", [
            ["Emits", "job.created, job.started, job.completed, job.failed, job.dead_lettered"],
            ["Consumes", "All *.requested events"],
            ["Commands", "EnqueueJob, CancelJob, RetryJob"],
        ]),
        ("87. AI Provider Manager Contract", [
            ["Emits", "provider.requested, provider.responded, provider.failed, provider.fallback, provider.cost_recorded"],
            ["Consumes", "economic.spending_approved, economic.spending_rejected"],
            ["Commands", "CallProvider"],
        ]),
    ]

    for title, rows in contracts:
        heading(2, title)
        table(["Direction", "Event/Command"], rows)

    hr()
    return "\n".join(lines)
