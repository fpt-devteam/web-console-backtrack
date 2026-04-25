# Design: Super-Admin Dashboard — Shadcn Hybrid Migration

**Date:** 2026-04-24  
**Approach:** B — Hybrid  
**Status:** Approved

---

## Goal

Adapt `src/modules/super-admin/pages/dashboard.tsx` to use the existing shadcn dashboard template components (`src/components/dashboard/`) while preserving all current data, charts, and rich KPI visualisations.

---

## Layout Structure

```
Layout (sidebar — unchanged)
└── DashboardPage
    ├── SiteHeader                 ← replaces manual topbar div
    ├── KpiCards                   ← unchanged (sparklines + radial ring kept)
    ├── Row 2  [2 col grid]
    │   ├── ChartAreaInteractive   ← replaces LostFoundTrend component internals
    │   └── RecentActivity         ← unchanged
    └── Row 3  [2 col grid]
        ├── City Heatmap           ← unchanged
        └── ChartAreaInteractive   ← replaces manual Revenue Flow AreaChart card
```

---

## Component Changes

### 1. SiteHeader (new usage in DashboardPage)

Replace the manual topbar `div` with:

```tsx
<SiteHeader
  title="Backtrack Dashboard"
  subtitle="Super Admin · Lost & Found Platform Overview"
  action={<LastSyncedPill />}
/>
```

`LastSyncedPill` is a small inline component (extracted from the existing topbar JSX) that renders the animated green dot + "Last synced: just now" text. It lives as a private function at the top of `dashboard.tsx` — no new file needed.

### 2. LostFoundTrend — internal refactor

File: `src/modules/super-admin/components/lost-found-trend.tsx`

- Keep all existing API fetching logic (`superAdminService.getPostMonthly()`).
- Replace the raw `AreaChart` / `ResponsiveContainer` / `defs` / `CartesianGrid` / `XAxis` / `YAxis` block with `<ChartAreaInteractive>`.
- Map `PostMonthlyItem[]` to `ChartPoint[]` before passing:

```ts
const chartData = data.map(d => ({ label: d.month, lost: d.lost, found: d.found }))
```

- Series config (static constant in the file):

```ts
const SERIES = [
  { key: 'lost',  label: 'Lost',  color: '#EF4444' },
  { key: 'found', label: 'Found', color: '#10B981' },
]
```

- The date range label (`dateLabel`) is no longer needed as the component gets a 7d/30d/90d toggle.
- Pass `title="Lost vs Found Trend"` and `defaultRange="30d"`.

### 3. Revenue Flow card — replaced in DashboardPage

File: `src/modules/super-admin/pages/dashboard.tsx`

- Delete the entire manual `<div className={card}>` Revenue Flow section.
- Map existing `revenueData` mock array to `ChartPoint[]`:

```ts
const revenueChartData = revenueData.map(d => ({ label: d.month, org: d.org, user: d.user }))
```

- Replace with:

```tsx
<ChartAreaInteractive
  title="Revenue Flow"
  data={revenueChartData}
  series={[
    { key: 'org',  label: 'Org Revenue', color: '#3B82F6' },
    { key: 'user', label: 'User Fees',   color: '#8B5CF6' },
  ]}
  defaultRange="90d"
/>
```

---

## What Is Unchanged

| Component | Reason |
|---|---|
| `Layout` + `Sidebar` | No change needed |
| `KpiCards` | Rich visuals (sparklines, radial ring) worth preserving |
| `RecentActivity` | Well-structured, fits its grid slot as-is |
| City Heatmap JSX | Custom SVG map with no template equivalent |
| All services & mock data | Data sources remain identical |
| `Sparkline`, `RadialRing`, `LightTooltip` | Utilities unchanged |

---

## Data Flow

### LostFoundTrend

```
superAdminService.getPostMonthly()
  → PostMonthlyItem[] { month, year, lost, found }
  → map to ChartPoint[] { label: month, lost, found }
  → ChartAreaInteractive (renders area chart with range toggle)
```

### Revenue Flow

```
revenueData (static mock in dashboard.tsx)
  → { month, org, user }[]
  → map to ChartPoint[] { label: month, org, user }
  → ChartAreaInteractive
```

---

## Files Touched

| File | Change |
|---|---|
| `src/modules/super-admin/pages/dashboard.tsx` | Replace topbar with `SiteHeader`, replace Revenue Flow card with `ChartAreaInteractive`, add `revenueChartData` mapping |
| `src/modules/super-admin/components/lost-found-trend.tsx` | Replace recharts internals with `ChartAreaInteractive`, add data mapping |
| No other files changed | — |

---

## Out of Scope

- Converting `RecentActivity` to a `DataTable` (would lose filter tabs and custom item layout)
- Simplifying `KpiCards` to `SectionCards` (would lose sparklines and radial ring)
- Any changes to routing, services, or backend
