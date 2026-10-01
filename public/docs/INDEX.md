# MASTER_CONTEXT — INDEX

> **This is the entry point for ALL AI assistants working on Bell24h-OS.**  
> Read this file first. Then read the Constitution. Then read the relevant volume.

---

## What Is MASTER_CONTEXT?

MASTER_CONTEXT is the permanent memory of Bell24h-OS. It contains the complete Enterprise Architecture — the rules, designs, schemas, and specifications that govern how the platform is built and maintained.

**Every AI assistant must read MASTER_CONTEXT before implementing new functionality.**

---

## Reading Order

### For New AI Assistants (First Time)

1. **Start here** — You are reading this now
2. **Read Volume 0** — `00-enterprise-constitution.md` — The master rules
3. **Read the relevant volume** — For the module you're working on
4. **Check frozen modules** — Section 6 of the Constitution
5. **Begin implementation** — Following all rules and quality gates

### For Ongoing Work

1. **Check the Constitution** — `00-enterprise-constitution.md` — Verify module isn't frozen
2. **Read the module volume** — For detailed specifications
3. **Read the prompt** — `prompts/XXX-module-name.md` — For implementation instructions

---

## Volume Index (Revised Order)

### Foundation

| Vol | File | Title | Status |
|---|---|---|---|
| 0 | `00-enterprise-constitution.md` | Enterprise Constitution v1.0 | ✅ Complete |
| 2 | `02-enterprise-system-architecture.md` | Enterprise System Architecture | ✅ Complete |
| 3 | `03-database-design.md` | Enterprise Database Architecture | ✅ Complete (116 tables) |
| 3A | `03a-business-ontology.md` | Business Ontology & Data Dictionary | ✅ Complete (5,915 lines) |
| 3F | `03F-vase-autonomous-economic-survival-engine.md` | VASE — Autonomous Economic Survival Engine | ✅ Certified (8,067 lines, 103 tables, 24 agents, 40/40 gates PASS) |
| 3G | `03G-enterprise-integration-contracts-event-mesh.md` | Enterprise Integration Contracts & Event Mesh | ✅ Certified (8,024 lines, 44 tables, 294 events, 50/50 gates PASS) |
| 4 | `04-ai-agents.md` | Enterprise AI Agent Architecture | 📋 Pending |

### Core Engineering

| Vol | File | Title | Status |
|---|---|---|---|
| 5 | `05-api-gateway.md` | API Gateway & Service Contracts | 📋 Pending |
| 6 | `06-security-auth.md` | Security, Authentication & Multi-tenancy | 📋 Pending |
| 7 | `07-job-orchestrator.md` | Global Job Orchestrator | 📋 Pending |

### Intelligence Layer

| Vol | File | Title | Status |
|---|---|---|---|
| 8 | `08-industry-intelligence.md` | Industry Intelligence | 📋 Pending |
| 9 | `09-seo-intelligence.md` | SEO Intelligence | 📋 Pending |
| 10 | `10-campaign-intelligence.md` | Campaign Intelligence | 📋 Pending |
| 11 | `11-performance-intelligence.md` | Performance Intelligence | 📋 Pending |
| 12 | `12-learning-engine.md` | Enterprise Learning Engine | 📋 Pending |

### Creative Layer

| Vol | File | Title | Status |
|---|---|---|---|
| 13 | `13-prompt-studio.md` | Prompt Studio | 📋 Pending |
| 14 | `14-content-planner.md` | Content Planner | 📋 Pending |
| 15 | `15-image-studio.md` | Image Studio | 📋 Pending |
| 16 | `16-video-studio.md` | Video Studio | 📋 Pending |
| 17 | `17-voice-audio-studio.md` | Voice & Audio Studio | 📋 Pending |
| 18 | `18-avatar-studio.md` | Avatar & Digital Human Studio | 📋 Pending |
| 19 | `19-media-composer.md` | Media Composer | 📋 Pending |

### Distribution Layer

| Vol | File | Title | Status |
|---|---|---|---|
| 20 | `20-publishing-center.md` | Publishing Center | 📋 Pending |
| 21 | `21-automation-platform.md` | Automation Platform | 📋 Pending |

### Enterprise Layer

| Vol | File | Title | Status |
|---|---|---|---|
| 22 | `22-analytics-observability.md` | Analytics & Observability | 📋 Pending |
| 23 | `23-infrastructure-devops.md` | Infrastructure & DevOps | 📋 Pending |
| 24 | `24-testing-certification.md` | Testing & Certification | 📋 Pending |
| 25 | `25-executive-vision.md` | Executive Vision & Business Blueprint | 📋 Pending |

---

## Prompt Index

Implementation prompts for AI coding assistants:

| Prompt | File | Module | Status |
|---|---|---|---|
| 001 | `prompts/001-foundation.md` | Foundation | 📋 Pending |
| 002 | `prompts/002-authentication.md` | Authentication | 📋 Pending |
| 003 | `prompts/003-organizations.md` | Organizations | 📋 Pending |
| 004 | `prompts/004-ai-provider-manager.md` | AI Provider Manager | 📋 Pending |
| 005 | `prompts/005-prompt-studio.md` | Prompt Studio | 📋 Pending |
| 006 | `prompts/006-content-planner.md` | Content Planner | 📋 Pending |
| 007 | `prompts/007-industry-intelligence.md` | Industry Intelligence | 📋 Pending |
| 008 | `prompts/008-seo-intelligence.md` | SEO Intelligence | 📋 Pending |
| 009 | `prompts/009-job-orchestrator.md` | Job Orchestrator | 📋 Pending |
| 010 | `prompts/010-image-studio.md` | Image Studio | 📋 Pending |
| 011 | `prompts/011-video-studio.md` | Video Studio | 📋 Pending |
| 012 | `prompts/012-voice-studio.md` | Voice Studio | 📋 Pending |
| 013 | `prompts/013-campaign-intelligence.md` | Campaign Intelligence | 📋 Pending |
| 014 | `prompts/014-publishing-center.md` | Publishing Center | 📋 Pending |
| 015 | `prompts/015-automation-engine.md` | Automation Engine | 📋 Pending |
| 016 | `prompts/016-performance-intelligence.md` | Performance Intelligence | 📋 Pending |
| 017 | `prompts/017-learning-engine.md` | Learning Engine | 📋 Pending |
| 018 | `prompts/018-final-certification.md` | Final Enterprise Certification | 📋 Pending |

---

## Key Rules (Summary)

1. **Architecture is frozen** — Never redesign existing modules
2. **Completed modules are immutable** — Only bug fixes, security, performance
3. **Never duplicate functionality** — Reuse existing services
4. **Service layers mandatory** — No direct provider calls
5. **Job Orchestrator only** — No local queues
6. **Organization-scoped data** — Every table has `organization_id`
7. **RLS is mandatory** — Every table with org data
8. **Multi-tenancy mandatory** — Every feature
9. **Production ready only** — No mocks, no placeholders
10. **Triple verification** — Build, Type Check, Runtime

**Full rules:** Read `00-enterprise-constitution.md`, Section 5

---

## Contact

For questions about this architecture, refer to the project owner or the Constitution itself.

---

*Last updated: 2026-07-15*  
*Version: 1.0*
