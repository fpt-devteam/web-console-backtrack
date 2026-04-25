# Dashboard Shadcn Hybrid Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt the super-admin dashboard to use `SiteHeader` and `ChartAreaInteractive` from the shadcn template while preserving all existing data, KPI cards, and custom sections.

**Architecture:** Two files are changed. `LostFoundTrend` swaps its raw recharts internals for `ChartAreaInteractive`. `DashboardPage` replaces the manual topbar with `SiteHeader` and replaces the manual Revenue Flow card with `ChartAreaInteractive`.

**Tech Stack:** React, TypeScript, Recharts (via ChartAreaInteractive), TanStack Router, Tailwind CSS.

---

## Files Modified

| File | Change |
|---|---|
| `src/modules/super-admin/components/lost-found-trend.tsx` | Replace raw recharts with `ChartAreaInteractive` |
| `src/modules/super-admin/pages/dashboard.tsx` | Add `SiteHeader`, `LastSyncedPill`, replace Revenue Flow card |

---

## Task 1: Refactor LostFoundTrend to use ChartAreaInteractive

**File:** `src/modules/super-admin/components/lost-found-trend.tsx`

- [ ] **Step 1: Replace the file contents**

Replace the entire file with:

```tsx
import { useEffect, useState } from 'react';

import { ChartAreaInteractive } from '@/components/dashboard';
import type { SeriesConfig } from '@/components/dashboard';
import type { PostMonthlyItem } from '@/services/super-admin.service';
import { superAdminService } from '@/services/super-admin.service';

const SERIES: SeriesConfig[] = [
  { key: 'lost',  label: 'Lost',  color: '#EF4444' },
  { key: 'found', label: 'Found', color: '#10B981' },
];

export function LostFoundTrend() {
  const [data, setData] = useState<Array<PostMonthlyItem>>([]);

  useEffect(() => {
    superAdminService.getPostMonthly().then(setData).catch(console.error);
  }, []);

  const chartData = data.map(d => ({ label: d.month, lost: d.lost, found: d.found }));

  return (
    <ChartAreaInteractive
      title="Lost vs Found Trend"
      data={chartData}
      series={SERIES}
      defaultRange="30d"
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`

Expected: No TypeScript errors in `lost-found-trend.tsx`. (Other pre-existing errors, if any, are not in scope.)

- [ ] **Step 3: Commit**

```bash
git add src/modules/super-admin/components/lost-found-trend.tsx
git commit -m "feat: replace LostFoundTrend recharts internals with ChartAreaInteractive"
```

---

## Task 2: Update DashboardPage — SiteHeader + Revenue Flow

**File:** `src/modules/super-admin/pages/dashboard.tsx`

- [ ] **Step 1: Replace the file contents**

Replace the entire file with:

```tsx
import { useEffect, useState } from 'react';

import { Clock } from 'lucide-react';

import { ChartAreaInteractive, SiteHeader } from '@/components/dashboard';
import type { SeriesConfig } from '@/components/dashboard';
import { KpiCards, Layout, LostFoundTrend, RecentActivity } from '../components';
import type { DashboardKpi } from '@/services/super-admin.service';
import { superAdminService } from '@/services/super-admin.service';


// ── mock data (charts without API yet) ───────────────────────────────────────

const revenueData = [
  { month: 'May', org: 12.4, user: 3.2 },
  { month: 'Jun', org: 14.2, user: 3.8 },
  { month: 'Jul', org: 15.8, user: 4.1 },
  { month: 'Aug', org: 17.2, user: 4.6 },
  { month: 'Sep', org: 16.8, user: 4.4 },
  { month: 'Oct', org: 19.1, user: 5.2 },
  { month: 'Nov', org: 21.3, user: 5.8 },
  { month: 'Dec', org: 23.6, user: 6.3 },
  { month: 'Jan', org: 25.2, user: 6.9 },
  { month: 'Feb', org: 24.1, user: 6.6 },
  { month: 'Mar', org: 27.4, user: 7.4 },
  { month: 'Apr', org: 29.8, user: 8.1 },
];

const hotspots = [
  { x: 50, y: 19, r: 26, label: 'Hanoi',     count: 445, color: '#F59E0B' },
  { x: 58, y: 16, r: 14, label: 'Hai Phong', count: 187, color: '#10B981' },
  { x: 67, y: 46, r: 19, label: 'Da Nang',   count: 298, color: '#F59E0B' },
  { x: 67, y: 62, r: 11, label: 'Nha Trang', count: 98,  color: '#10B981' },
  { x: 64, y: 76, r: 30, label: 'HCMC',      count: 612, color: '#EF4444' },
  { x: 61, y: 84, r: 13, label: 'Can Tho',   count: 143, color: '#F59E0B' },
];

const REVENUE_SERIES: SeriesConfig[] = [
  { key: 'org',  label: 'Org Revenue', color: '#3B82F6' },
  { key: 'user', label: 'User Fees',   color: '#8B5CF6' },
];


// ── sub-components ───────────────────────────────────────────────────────────

function LastSyncedPill() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <Clock className="h-3.5 w-3.5" />
      Last synced:{' '}
      <span className="ml-1 font-medium text-gray-700">just now</span>
    </div>
  );
}


// ── main page ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [kpi, setKpi] = useState<DashboardKpi | null>(null);

  useEffect(() => {
    superAdminService.getDashboardKpi().then(setKpi).catch(console.error);
  }, []);

  const revenueChartData = revenueData.map(d => ({
    label: d.month,
    org:   d.org,
    user:  d.user,
  }));

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: 'system-ui, sans-serif' }}>

        {/* ── topbar ── */}
        <SiteHeader
          title="Backtrack Dashboard"
          subtitle="Super Admin · Lost & Found Platform Overview"
          action={<LastSyncedPill />}
        />

        {/* ── KPI cards ── */}
        <div className="mt-6">
          <KpiCards kpi={kpi} />
        </div>

        {/* ── mid section ── */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LostFoundTrend />
          <RecentActivity />
        </div>

        {/* ── bottom section ── */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* City Heatmap */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">City Heatmap</h2>
                <p className="text-xs text-gray-400">Lost item density by district</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-red-400" />High</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-amber-400" />Med</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-green-400" />Low</span>
              </div>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-xl border border-gray-100 bg-[#EFF6FF]">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
                {[20, 30, 40, 50, 60, 70, 80].map((y) => (
                  <line key={`gy${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#BFDBFE" strokeWidth="0.4" />
                ))}
                {[30, 40, 50, 60, 70].map((x) => (
                  <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#BFDBFE" strokeWidth="0.4" />
                ))}
                <path
                  d="M48 5 L53 7 L57 11 L59 15 L58 20 L61 25 L65 30 L68 36 L70 42
                     L70 48 L68 54 L67 60 L68 66 L70 73 L69 79 L66 84 L61 88 L56 90
                     L52 88 L49 83 L51 78 L53 73 L51 68 L49 62 L47 55 L45 48 L43 41
                     L44 34 L45 27 L44 20 L45 13 L47 8 Z"
                  fill="#BFDBFE"
                  stroke="#93C5FD"
                  strokeWidth="0.7"
                />
              </svg>
              {hotspots.map((h, i) => {
                const diameter = h.r * 1.5;
                return (
                  <div key={i}>
                    <div
                      className="absolute flex items-center justify-center rounded-full font-bold"
                      style={{
                        left: `${h.x}%`, top: `${h.y}%`,
                        width: `${diameter}px`, height: `${diameter}px`,
                        transform: 'translate(-50%, -50%)',
                        background: `${h.color}28`,
                        border: `2px solid ${h.color}80`,
                        boxShadow: `0 0 ${h.r * 0.5}px ${h.color}30`,
                        fontSize: '8px', color: h.color,
                      }}
                    >
                      {h.count}
                    </div>
                    <span
                      className="absolute text-[8px] font-semibold text-gray-600"
                      style={{
                        left: `${h.x}%`,
                        top: `calc(${h.y}% + ${diameter / 2 + 3}px)`,
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Flow */}
          <ChartAreaInteractive
            title="Revenue Flow"
            data={revenueChartData}
            series={REVENUE_SERIES}
            defaultRange="90d"
          />

        </div>

      </div>
    </Layout>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`

Expected: No TypeScript errors in `dashboard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/modules/super-admin/pages/dashboard.tsx
git commit -m "feat: migrate dashboard topbar to SiteHeader and revenue chart to ChartAreaInteractive"
```

---

## Final Verification

- [ ] **Step 1: Run dev server and visually verify**

Run: `npm run dev`

Open the super-admin dashboard in the browser. Confirm:
- Header shows "Backtrack Dashboard" with subtitle and the animated green-dot pill on the right
- 4 KPI cards render with sparklines and radial ring (unchanged)
- "Lost vs Found Trend" shows `ChartAreaInteractive` with 7d/30d/90d toggle
- "Recent Activity" renders with filter tabs and pagination (unchanged)
- "City Heatmap" renders the SVG map with hotspot bubbles (unchanged)
- "Revenue Flow" shows `ChartAreaInteractive` with 7d/30d/90d toggle

- [ ] **Step 2: Final commit (if any lint auto-fixes)**

```bash
git status
# only commit if there are auto-fixed files
git add -A && git commit -m "chore: lint fixes post-migration"
```
