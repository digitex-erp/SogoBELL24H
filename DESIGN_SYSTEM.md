# Bell24h-OS — UI/UX & CSS Design System

> The visual contract for the platform. Two new pages — **Industry Intelligence** and
> **Audit & Explainability** — ship against this spec. Anything added later should
> compose the same primitives rather than invent new ones.

---

## 1. Stack & tokens

| Layer | What | Where |
|---|---|---|
| Utility CSS | Tailwind CSS v4 (`@import "tailwindcss"`) | `src/index.css` |
| Primitives | shadcn/ui components | `src/components/ui/*` |
| Theme tokens | OKLCH CSS variables (`--background`, `--primary`, …) | `src/index.css` `:root` / `.dark` |
| Radius scale | `--radius: 0.625rem` → `sm/md/lg/xl` derived | `@theme inline` |
| Icons | `lucide-react`, stroke icons, `w-4 h-4` (or `w-3.5 h-3.5` inline) | everywhere |
| Class merging | `cn()` from `@/lib/cn` | everywhere |

**Never** hardcode a hex colour for text/background. Use the Tailwind palette
(`gray-900`, `emerald-600`, …) or a semantic token. Hex is only acceptable inside
chart config (recharts needs literal values).

---

## 2. Colour semantics

Colour carries meaning on this platform. Reusing a colour for a different meaning is a bug.

| Meaning | Palette | Used for |
|---|---|---|
| **Brand / primary** | `emerald-500 → teal-600` gradient | logo mark, active nav, primary CTAs |
| **Healthy / positive / supporting** | `emerald-50` bg, `emerald-600/700` fg | uptime, demand up, SHAP positive contribution |
| **Warning / pressure / opposing** | `amber-50` bg, `amber-600/700` fg | degraded service, competition index, contract violation |
| **Critical / negative** | `red-50` bg, `red-600/700` fg | failure, blocked audit, SHAP negative contribution |
| **Informational / neutral-accent** | `blue-50` bg, `blue-600/700` fg | info callouts, seasonality signals |
| **AI / model-driven** | `violet-50` bg, `violet-600/700` fg | AI router, budget allocation, at-risk watchlist |
| **Audit / governance** | `teal-50` bg, `teal-600/700` fg | audit trail, explainability, LIME |
| **Inactive / meta** | `bg-gray-100 text-gray-600` | unknown status, zero counts |

Text: `gray-900` headings · `gray-800` body · `gray-500` secondary · `gray-400` meta.
Surfaces: page `bg-gray-50` · card `bg-white` · inset panel `bg-gray-50` · border `border-gray-200` (rows `border-gray-100`).

---

## 3. Page shell (copy this skeleton)

```tsx
<div className="p-4 sm:p-6 space-y-6">
  {/* Header */}
  <div className="flex flex-wrap items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
      <Factory className="w-5 h-5 text-emerald-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h1 className="text-xl font-bold text-gray-900">Page title</h1>
      <p className="text-sm text-gray-500">One sentence on what this page answers.</p>
    </div>
    <Button variant="outline" size="sm" onClick={refetch}>
      <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} /> Refresh
    </Button>
  </div>

  {/* KPI row */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">…</div>

  {/* Tabs + panels */}
  <Tabs value={tab} onValueChange={setTab}>
    <TabsList>…</TabsList>
    <TabsContent value="…" className="space-y-4">…</TabsContent>
  </Tabs>
</div>
```

Rules: page padding is always `p-4 sm:p-6`; vertical rhythm is always `space-y-6`
between top-level blocks and `space-y-4` inside a tab.

---

## 4. Component recipes

### KPI tile — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4`

```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardContent className="p-4">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
        {icon /* w-4 h-4 */}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Label</p>
        <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight mt-0.5">Value</p>
        <p className="text-[11px] text-gray-500 mt-0.5">Sub-caption</p>
      </div>
    </div>
  </CardContent>
</Card>
```

All numeric values get `tabular-nums` so columns align and digits don't jitter on refresh.

### Panel / chart container

`<Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-gray-700">…</CardTitle></CardHeader><CardContent className="pt-0">…</CardContent></Card>`

Chart height is fixed (`h-52` / `h-64`) inside `<ResponsiveContainer width="100%" height="100%">`,
with `<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />`
and axis ticks at `fontSize: 11, fill: '#64748b'`.

### Inset stat block

`<div className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-lg font-bold text-gray-900 tabular-nums">…</p><p className="text-[11px] text-gray-500 mt-0.5">Label</p></div>`

### Badge

`<Badge variant="secondary" className="text-[10px] px-1.5 h-5 {tone}">{text}</Badge>` — tones are the semantic
palette above (`bg-emerald-50 text-emerald-700`). Monospace (`font-mono`) for machine identifiers:
action names, feature keys, violation rule names, hashes, contract method values.

### Table

Always the shadcn `Table` primitives, never a raw `<table>`. Wrap in
`<div className="overflow-x-auto">` with a `min-w-[…]` on the table so phones scroll
the table instead of crushing it. Header cells: `text-[11px] font-semibold text-gray-500 uppercase tracking-wide`.
Rows: `hover:bg-gray-50/60`. Primary labels are never `truncate`d; long free-text uses
`line-clamp-2` with a `title` attribute.

### Meter (index 0–100)

```tsx
<Progress value={v} className="h-1.5 bg-gray-100 [&>div]:bg-emerald-500" />
```
Label above in `text-[11px] uppercase tracking-wide`, value right-aligned `tabular-nums`.

### Tabs

`<TabsTrigger value="x" className="text-xs"><Icon className="w-3.5 h-3.5 mr-1" /> Label</TabsTrigger>`
— icon + label, `text-xs`. Tab panels get `className="space-y-4"`.

### Dialog (drawer on mobile)

`<DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">`. `DialogContent` renders
`role="dialog"` + `aria-modal="true"`, and the close button carries `aria-label="Close"`.
Detail dialogs lead with a 2–4 column grid of inset stat blocks, then grouped badge lists,
then long-form content.

### Feedback blocks

Full-bleed inline callouts, not toasts:
`<div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">`
with a `w-3.5 h-3.5` icon and `text-xs` copy. Error banners use `border-red-200 bg-red-50`
and always print the **actual** server `error` string, never a generic "Failed to load".

---

## 5. Explainability-specific conventions (new)

These are the visual grammar for SHAP/LIME so a reader can interpret any explanation without legend-hunting.

### SHAP waterfall — diverging horizontal bars

- A **centre line** (`absolute left-1/2 w-px bg-gray-200`) is the model baseline `E[f(X)]`.
- **Supporting** contributions are **emerald**, drawn **right of centre** (`left-1/2`), wider = larger `|φ|`.
- **Counteracting** contributions are **red**, drawn **left of centre** (`right-1/2`).
- Bar width is proportional to `|φᵢ| / max|φ|`, capped at 48% of the track so it stays inside its half.
- Row order is **descending |φ|** — the single most important factor is always the top row.
- Left column: feature label (truncated with `title`). Right column: signed value, `font-mono tabular-nums`,
  coloured by direction. The observed feature value is shown on `sm+` only.
- Header of the block reads `counteracting · base {value} · supporting`.
- Footer must state estimator, feature count, coalition count, and the additivity verdict
  (`additivity holds` emerald / `additivity broken (sum vs output)` red).

### LIME local surrogate

- Header line: `local fidelity` (emerald if ≥ 0.8, else amber), sample count, kernel width, intercept.
- One row per rule: the **predicate in monospace** (e.g. `provider.latency_p95_ms ≈ 412 ms`) on the left,
  signed coefficient right, `font-mono`. A thin 1.5px bar underneath shows relative |weight|,
  emerald for `supports`, red for `opposes`. Sub-caption states satisfaction rate across the neighbourhood.

### Contract compliance

- Compliant: `bg-emerald-50 border-emerald-100` + `ShieldCheck`.
- Violating: `bg-red-50 border-red-100` + `ShieldAlert`, with each violation printed
  `font-mono` as `ruleName: detail`.
- Contract cards use a 4px left border — emerald when clean, **red when the contract has any violation** —
  plus a `riskTier` badge (`standard` gray, `elevated` amber, `regulated` red).
- The governing principle, stated in the UI: *an explanation that fails its contract is still recorded —
  it is flagged, not suppressed.*

### Determinism badge

The audit-hash row uses `font-mono text-[11px] text-gray-400` with a `Fingerprint` icon.
"Re-derive from source" is a **read-only** verification (it sends `persist: false`) and its
result states explicitly that nothing was written.

---

## 6. Mobile-first rules (non-negotiable)

Canvas previews open at ~390px. Every page must work there.

1. **Never** a fixed `grid-cols-3` / `grid-cols-4`. Start at `grid-cols-1`, widen at `sm:` / `lg:` / `xl:`.
2. **Never** pin a left sidebar at phone width — `Layout.tsx` hides the rail below `lg` and presents
   the same `NAV_SECTIONS` in a `Sheet` via the `Menu` button.
3. Wide tables scroll horizontally: `overflow-x-auto` wrapper + `min-w-[…]` on the table.
   Don't let the primary label column truncate.
4. **Never** `truncate` primary labels or headings. Free text gets `line-clamp-2` + `title`.
5. Filter rows go `flex flex-col sm:flex-row gap-2`; each control is `w-full sm:w-[…px]`.
6. Primary actions stay in the header (top) — reachable by thumb, not only in a side rail.
7. Detail views that would overflow use the `Dialog` (already `max-h-[85vh] overflow-y-auto`).

---

## 7. Copy & tone

- Headings are **noun phrases**: "Industry Intelligence", "Audit & Explainability" — not "Welcome to…".
- Each page's subtitle completes: *what question does this page answer?*
- Empty states say what to do, in sentence case, `text-sm text-gray-400`, centred, `py-12`.
- Numbers are formatted **once, at the edge**: `formatUsd` → `$452.0B`, `pct` → `90.0%`,
  `tabular-nums` + `toFixed(n)` for model values.
- Compliance surfaces quote field names verbatim (`requiredMethod`, `localAccuracy`) — auditors match on these.

---

## 8. AI Voice & Communication Center (Sprint 8)

A 22-screen module under `src/pages/voice/`. It is a **prototype**: nothing in it contacts
telephony infrastructure. The visual language below exists so that the simulation is
*unmistakable* rather than merely labelled in small print.

### 8.1 File layout

| File | Exports |
|---|---|
| `shared.tsx` | the module kit — API hooks, simulation provider, chrome, formatters |
| `VoiceCenter.tsx` | `VoiceCenter` container + `VOICE_PAGES` / `isVoicePage` |
| `CommandCenter.tsx` | `VoiceCommandCenter`, `CommunicationHub`, `FounderCockpitComms` |
| `CallsPages.tsx` | `LiveCalls`, `CallQueue`, `CallHistory`, `ConversationDetail` |
| `BuilderPages.tsx` | `VoiceAgentBuilder`, `CallFlowBuilder`, `CallScriptStudio` |
| `CampaignPages.tsx` | `CallCampaignsPage`, `RfqFollowUpPage`, `AiReceptionist` |
| `InfraPages.tsx` | `VoiceInfrastructure`, `VoiceProvidersPage`, `VoiceLibrary`, `PhoneNumbersPage` |
| `OpsPages.tsx` | `EscalationCenter`, `AutomationRulesPage`, `CallAnalyticsPage`, `CommunicationSettingsPage` |

`App.tsx` routes the whole section in one line — `if (isVoicePage(activePage)) return <VoiceCenter …/>` —
so adding a screen means adding a `VOICE_PAGES` entry plus one `switch` case, not a new
`PageId` branch in `App.tsx`.

### 8.2 The simulation contract

Three rules, enforced by the kit rather than by discipline:

1. **Every mutation goes through one bus.** `simAction(action, payload)` POSTs to
   `/api/voice/simulate`. Buttons either call it directly or use the `<Button>` +
   `useSimulation().simulate(...)` pattern. No screen invents its own write path.
2. **Every simulated result is announced.** The `SimulationProvider` renders one
   acknowledgement dialog; the message always reads `SIMULATION: <what happened>` plus a
   sentence naming what would have happened for real. Simulated actions are also written to
   the audit log with `simulated: true` in the payload.
3. **The banner is not optional.** Every screen renders `SimBanner` beneath its header,
   carrying the engine's live state (`running · N ticks · N placed`).

### 8.3 Status vocabulary

One chip vocabulary, defined once in `shared.tsx`:

| Chip | Meaning |
|---|---|
| `SIMULATED` (violet) | the record or action is simulated |
| `LIVE` (red, pulsing dot) | a call is genuinely in progress *within the simulation* |
| `RUNNING` / `CONNECTED` / `COMPLETED` / `ENABLED` (emerald) | healthy terminal or active state |
| `CALLING` / `ANSWERED` / `IN PROGRESS` (teal) | transient in-flight state |
| `RINGING` / `SCHEDULED` / `CALLBACK` / `IN REVIEW` (blue) | queued or awaiting an event |
| `NO ANSWER` / `PAUSED` / `DRAFT` (amber) | needs attention, not broken |
| `ESCALATED` / `FAILED` / `CRITICAL` / `DISABLED` (red) | requires a human or is off |
| `PENDING` / `QUEUED` (gray) | inert |

Mixing a hue across two meanings is a bug — amber is never "good" here, and emerald is
never used for anything awaiting a human.

### 8.4 Screen skeleton

```tsx
<PageShell icon={<Radio/>} title="…" subtitle="what question this answers" actions={…}>
  <SimBanner banner={data?.banner} engine={data?.engine} />
  <KpiGrid>{/* 4–6 KpiTile: label / value / caption / icon */}</KpiGrid>
  <Panel title="…" subtitle="…" actions={…}>{/* body */}</Panel>
</PageShell>
```

`KpiGrid` is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6` — never a fixed column
count. Values are `tabular-nums`; identifiers (`VC-1024`, `RFQ-2026-4821`, `provider.latency`) are
`font-mono`. Durations render as `mm:ss` via `fmtDuration`.

### 8.5 Two conventions specific to this module

- **Masked numbers always.** Phone numbers render as `+91 76••••1239` everywhere, including in
  dialogs and transcripts. There is no screen in the module that shows a full number.
- **The engine has durable state.** The "automation agent" is a simulated queue driver whose
  `running` flag is persisted (as a `runtime`-category row, filtered out of the policy UI), so
  "the agent is running" survives a server restart instead of silently reverting to stopped.
  Call refs are allocated from a DB-primed monotonic counter so a restart cannot reissue a ref.
