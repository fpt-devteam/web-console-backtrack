# shadcn Dashboard Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a generic `DashboardShell` component in `src/components/dashboard/` composed of four sections (SiteHeader, SectionCards, ChartAreaInteractive, DataTable) and wire it into the three existing role dashboards.

**Architecture:** Props-driven composition — `DashboardShell` accepts typed config objects for header, cards, chart, and table. Each role dashboard constructs its own config and wraps `DashboardShell` inside its own `<Layout>`. No context, no slot API.

**Tech Stack:** React 19, TailwindCSS v4, Recharts (already installed), `@tanstack/react-table` v8 (already installed), Lucide icons (already installed). No new packages required.

---

## File Map

| Action | File |
|--------|------|
| Create | `src/components/dashboard/types.ts` |
| Create | `src/components/dashboard/site-header.tsx` |
| Create | `src/components/dashboard/section-cards.tsx` |
| Create | `src/components/dashboard/chart-area-interactive.tsx` |
| Create | `src/components/dashboard/data-table.tsx` |
| Create | `src/components/dashboard/dashboard-shell.tsx` |
| Create | `src/components/dashboard/index.ts` |
| Replace | `src/routes/dashboard.tsx` |
| Replace | `src/modules/console/pages/admin/dashboard.tsx` |
| Replace | `src/modules/super-admin/pages/dashboard.tsx` |

---

## Task 1: Create types

**Files:**
- Create: `src/components/dashboard/types.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/components/dashboard/types.ts
import type { ColumnDef } from '@tanstack/react-table';

export interface SiteHeaderConfig {
  title: string;
  subtitle?: string;
  /** Optional React node rendered on the right (e.g. a button) */
  action?: React.ReactNode;
}

export interface CardConfig {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  /** Tailwind bg class, e.g. 'bg-[#fff0f2]' */
  iconBg: string;
  /** Tailwind text class, e.g. 'text-[#ff385c]' */
  iconColor: string;
}

export interface SeriesConfig {
  key: string;
  label: string;
  /** Hex color string, e.g. '#ff385c' */
  color: string;
}

export interface ChartPoint {
  /** X-axis label shown on chart */
  label: string;
  [key: string]: string | number;
}

export interface ChartConfig {
  title: string;
  /** Full dataset; ChartAreaInteractive slices based on selected time range */
  data: ChartPoint[];
  series: SeriesConfig[];
  defaultRange?: '7d' | '30d' | '90d';
}

export type TableRow = Record<string, unknown>;

export interface TableConfig {
  title: string;
  columns: ColumnDef<TableRow>[];
  data: TableRow[];
  pageSize?: number;
}

export interface DashboardShellProps {
  header: SiteHeaderConfig;
  cards: CardConfig[];
  chart: ChartConfig;
  table: TableConfig;
}
```

- [ ] **Step 2: Verify TypeScript — run build**

```bash
npm run build 2>&1 | grep -E "error TS|✓|error"
```
Expected: no TypeScript errors from this file (it has no imports that could fail yet, just type definitions).

---

## Task 2: Create SiteHeader

**Files:**
- Create: `src/components/dashboard/site-header.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/components/dashboard/site-header.tsx
import type { SiteHeaderConfig } from './types';

export function SiteHeader({ title, subtitle, action }: SiteHeaderConfig) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[#222222] tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[#6a6a6a] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 3: Create SectionCards

**Files:**
- Create: `src/components/dashboard/section-cards.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/components/dashboard/section-cards.tsx
import type { CardConfig } from './types';

interface SectionCardsProps {
  cards: CardConfig[];
}

export function SectionCards({ cards }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-[14px] border border-[#dddddd] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6a6a6a]">{card.label}</span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}
            >
              <span className={card.iconColor}>{card.icon}</span>
            </div>
          </div>

          <div className="text-[2rem] font-semibold text-[#222222] leading-none">
            {card.value}
          </div>

          {card.trend && (
            <div className="flex items-center gap-1 mt-3">
              <span
                className={`text-xs font-medium ${
                  card.trendDirection === 'down'
                    ? 'text-[#c13515]'
                    : card.trendDirection === 'neutral'
                      ? 'text-[#6a6a6a]'
                      : 'text-[#06c167]'
                }`}
              >
                {card.trendDirection === 'down'
                  ? '↓'
                  : card.trendDirection === 'neutral'
                    ? '→'
                    : '↑'}{' '}
                {card.trend}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 4: Create ChartAreaInteractive

**Files:**
- Create: `src/components/dashboard/chart-area-interactive.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/components/dashboard/chart-area-interactive.tsx
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartConfig } from './types';

const RANGES = ['7d', '30d', '90d'] as const;
type Range = (typeof RANGES)[number];

const RANGE_SLICE: Record<Range, number> = { '7d': 7, '30d': 12, '90d': 999 };

export function ChartAreaInteractive({
  title,
  data,
  series,
  defaultRange = '30d',
}: ChartConfig) {
  const [range, setRange] = useState<Range>(defaultRange);
  const sliced = data.slice(-RANGE_SLICE[range]);

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#222222]">{title}</h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                range === r
                  ? 'border-[#222222] bg-[#222222] text-white'
                  : 'border-[#dddddd] text-[#6a6a6a] hover:border-[#222222]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={sliced} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s.key}
                id={`grad-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={s.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#929292', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#929292', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              border: '1px solid #dddddd',
              borderRadius: 8,
              fontSize: 12,
              color: '#222222',
            }}
            cursor={{ stroke: '#dddddd', strokeWidth: 1 }}
          />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              fill={`url(#grad-${s.key})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {series.length > 1 && (
        <div className="flex gap-4 mt-3 justify-end">
          {series.map((s) => (
            <span
              key={s.key}
              className="flex items-center gap-1.5 text-xs text-[#6a6a6a]"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 5: Create DataTable

**Files:**
- Create: `src/components/dashboard/data-table.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/components/dashboard/data-table.tsx
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TableConfig } from './types';

export function DataTable({ title, columns, data, pageSize = 5 }: TableConfig) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-[#dddddd]">
          <h2 className="text-base font-semibold text-[#222222]">{title}</h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f7f7f7] border-b border-[#dddddd]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-5 py-3 text-left text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider cursor-pointer select-none hover:text-[#222222]"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() &&
                        (h.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : h.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronsUpDown className="w-3 h-3 text-[#dddddd]" />
                        ))}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[#f7f7f7]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#f7f7f7] transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3.5 text-sm text-[#222222]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#dddddd]">
        <span className="text-xs text-[#929292]">
          {table.getFilteredRowModel().rows.length} total rows
        </span>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg border border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-[#6a6a6a] px-2">
            {table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
          </span>
          <button
            className="p-1.5 rounded-lg border border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 6: Create DashboardShell

**Files:**
- Create: `src/components/dashboard/dashboard-shell.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/components/dashboard/dashboard-shell.tsx
import type { DashboardShellProps } from './types';
import { SiteHeader } from './site-header';
import { SectionCards } from './section-cards';
import { ChartAreaInteractive } from './chart-area-interactive';
import { DataTable } from './data-table';

export function DashboardShell({ header, cards, chart, table }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <SiteHeader {...header} />
        <SectionCards cards={cards} />
        <ChartAreaInteractive {...chart} />
        <DataTable {...table} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 7: Create barrel index

**Files:**
- Create: `src/components/dashboard/index.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/components/dashboard/index.ts
export { DashboardShell } from './dashboard-shell';
export { SiteHeader } from './site-header';
export { SectionCards } from './section-cards';
export { ChartAreaInteractive } from './chart-area-interactive';
export { DataTable } from './data-table';
export type {
  DashboardShellProps,
  SiteHeaderConfig,
  CardConfig,
  ChartConfig,
  ChartPoint,
  SeriesConfig,
  TableConfig,
  TableRow,
} from './types';
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 8: Wire generic `/dashboard` route

**Files:**
- Replace: `src/routes/dashboard.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useActivityLogs } from '@/hooks/use-activity-logs';
import { DashboardShell } from '@/components/dashboard';
import type { CardConfig, ChartPoint, TableRow } from '@/components/dashboard';
import { Spinner } from '@/components/ui/spinner';
import { formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

// 12-month mock sparkline for the chart; chart will slice based on range
const CHART_DATA: ChartPoint[] = [
  { label: 'May', logins: 420, actions: 198 },
  { label: 'Jun', logins: 480, actions: 210 },
  { label: 'Jul', logins: 510, actions: 240 },
  { label: 'Aug', logins: 490, actions: 225 },
  { label: 'Sep', logins: 540, actions: 280 },
  { label: 'Oct', logins: 620, actions: 310 },
  { label: 'Nov', logins: 680, actions: 340 },
  { label: 'Dec', logins: 720, actions: 380 },
  { label: 'Jan', logins: 760, actions: 400 },
  { label: 'Feb', logins: 700, actions: 360 },
  { label: 'Mar', logins: 810, actions: 440 },
  { label: 'Apr', logins: 850, actions: 470 },
];

const ACTION_COLUMNS: ColumnDef<TableRow>[] = [
  { accessorKey: 'user', header: 'User' },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ getValue }) => {
      const v = getValue() as string;
      const a = v.toLowerCase();
      const cls = a.includes('login')
        ? 'bg-[#e8f9f0] text-[#06c167]'
        : a.includes('delete')
          ? 'bg-[#fff0f2] text-[#c13515]'
          : a.includes('update') || a.includes('edit')
            ? 'bg-[#fff8e6] text-[#c97a00]'
            : a.includes('create')
              ? 'bg-[#fff0f2] text-[#ff385c]'
              : 'bg-[#f7f7f7] text-[#6a6a6a]';
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{v}</span>
      );
    },
  },
  { accessorKey: 'details', header: 'Details' },
  { accessorKey: 'time', header: 'Time' },
];

function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: logs, isLoading: logsLoading } = useActivityLogs(1, 10);

  if (statsLoading || logsLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards: CardConfig[] = [
    {
      label: 'Total Users',
      value: stats?.totalUsers.toLocaleString() ?? '0',
      trend: '+47 this month',
      trendDirection: 'up',
      icon: <Users className="w-4 h-4" />,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers.toLocaleString() ?? '0',
      trend: '+12 this week',
      trendDirection: 'up',
      icon: <Activity className="w-4 h-4" />,
      iconBg: 'bg-[#e8f9f0]',
      iconColor: 'text-[#06c167]',
    },
    {
      label: 'Total Revenue',
      value: `$${
        stats?.totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? '0.00'
      }`,
      trend: '+8.7%',
      trendDirection: 'up',
      icon: <DollarSign className="w-4 h-4" />,
      iconBg: 'bg-[#fff8e6]',
      iconColor: 'text-[#c97a00]',
    },
    {
      label: 'Growth Rate',
      value: `${stats?.growthRate ?? '0'}%`,
      trend: '+2.1%',
      trendDirection: 'up',
      icon: <TrendingUp className="w-4 h-4" />,
      iconBg: 'bg-[#f7f7f7]',
      iconColor: 'text-[#6a6a6a]',
    },
  ];

  const tableData: TableRow[] = (logs?.items ?? []).map((log) => ({
    user: log.userName,
    action: log.action,
    details: log.details,
    time: formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }),
  }));

  return (
    <DashboardShell
      header={{
        title: 'Dashboard',
        subtitle: 'Welcome to the Backtrack Console',
      }}
      cards={cards}
      chart={{
        title: 'User Activity',
        data: CHART_DATA,
        series: [
          { key: 'logins', label: 'Logins', color: '#ff385c' },
          { key: 'actions', label: 'Actions', color: '#06c167' },
        ],
      }}
      table={{
        title: 'Recent Activity',
        columns: ACTION_COLUMNS,
        data: tableData,
        pageSize: 5,
      }}
    />
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 9: Wire console admin dashboard

**Files:**
- Replace: `src/modules/console/pages/admin/dashboard.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/modules/console/pages/admin/dashboard.tsx
import { Layout } from '../../components/admin/layout';
import { Users, Package, CheckCircle, Activity } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DashboardShell } from '@/components/dashboard';
import type { CardConfig, ChartPoint, TableRow } from '@/components/dashboard';
import { mockDashboardStats } from '@/mock/data/mock-admin-dashboard';

// 12-month item activity data
const CHART_DATA: ChartPoint[] = [
  { label: 'May', found: 28, returned: 22 },
  { label: 'Jun', found: 34, returned: 28 },
  { label: 'Jul', found: 38, returned: 32 },
  { label: 'Aug', found: 42, returned: 36 },
  { label: 'Sep', found: 36, returned: 30 },
  { label: 'Oct', found: 45, returned: 40 },
  { label: 'Nov', found: 52, returned: 46 },
  { label: 'Dec', found: 48, returned: 43 },
  { label: 'Jan', found: 55, returned: 50 },
  { label: 'Feb', found: 50, returned: 44 },
  { label: 'Mar', found: 60, returned: 55 },
  { label: 'Apr', found: 65, returned: 58 },
];

// Mock inventory items for the table
const TABLE_DATA: TableRow[] = [
  { item: 'Blue Backpack', category: 'Bags', status: 'In Storage', staff: 'Nguyen V.A' },
  { item: 'iPhone 14 Pro', category: 'Electronics', status: 'Returned', staff: 'Tran T.B' },
  { item: 'Leather Wallet', category: 'Personal', status: 'Active', staff: 'Le V.C' },
  { item: 'Laptop Bag', category: 'Bags', status: 'In Storage', staff: 'Nguyen V.A' },
  { item: 'AirPods Pro', category: 'Electronics', status: 'Returned', staff: 'Tran T.B' },
  { item: 'Sunglasses', category: 'Accessories', status: 'Active', staff: 'Le V.C' },
  { item: 'Black Umbrella', category: 'Accessories', status: 'In Storage', staff: 'Nguyen V.A' },
];

const STATUS_CLASSES: Record<string, string> = {
  Active: 'bg-[#fff0f2] text-[#ff385c]',
  'In Storage': 'bg-[#f7f7f7] text-[#6a6a6a]',
  Returned: 'bg-[#e8f9f0] text-[#06c167]',
  'Return Scheduled': 'bg-[#fff8e6] text-[#c97a00]',
};

const ITEM_COLUMNS: ColumnDef<TableRow>[] = [
  { accessorKey: 'item', header: 'Item' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const v = getValue() as string;
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            STATUS_CLASSES[v] ?? 'bg-[#f7f7f7] text-[#6a6a6a]'
          }`}
        >
          {v}
        </span>
      );
    },
  },
  { accessorKey: 'staff', header: 'Staff' },
];

const stats = mockDashboardStats;

export function AdminDashboardPage() {
  const cards: CardConfig[] = [
    {
      label: 'Active Staff',
      value: String(stats.activeStaff.count),
      trend: stats.activeStaff.change,
      trendDirection: stats.activeStaff.trend === 'up' ? 'up' : 'down',
      icon: <Users className="w-4 h-4" />,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
    },
    {
      label: 'Active Items',
      value: String(stats.activeItems.count),
      trend: stats.activeItems.description,
      trendDirection: 'neutral',
      icon: <Package className="w-4 h-4" />,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
    },
    {
      label: 'Return Rate',
      value: `${stats.returnRate.percentage}%`,
      trend: stats.returnRate.change,
      trendDirection: stats.returnRate.trend === 'up' ? 'up' : 'down',
      icon: <CheckCircle className="w-4 h-4" />,
      iconBg: 'bg-[#e8f9f0]',
      iconColor: 'text-[#06c167]',
    },
    {
      label: 'Found Today',
      value: '6',
      trend: '−2 vs yesterday',
      trendDirection: 'down',
      icon: <Activity className="w-4 h-4" />,
      iconBg: 'bg-[#fff8e6]',
      iconColor: 'text-[#c97a00]',
    },
  ];

  return (
    <Layout>
      <DashboardShell
        header={{
          title: 'Dashboard',
          subtitle: "Welcome back — here's an overview of your organization.",
        }}
        cards={cards}
        chart={{
          title: 'Item Activity',
          data: CHART_DATA,
          series: [
            { key: 'found', label: 'Found', color: '#ff385c' },
            { key: 'returned', label: 'Returned', color: '#06c167' },
          ],
        }}
        table={{
          title: 'Recent Items',
          columns: ITEM_COLUMNS,
          data: TABLE_DATA,
          pageSize: 5,
        }}
      />
    </Layout>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 10: Wire super-admin dashboard

**Files:**
- Replace: `src/modules/super-admin/pages/dashboard.tsx`

> Note: `DashboardKpi` from `super-admin.service` has fields:
> `totalLostItems: KpiMetric`, `totalFound: KpiMetric`,
> `successReturnRate: SuccessReturnRateMetric`, `revenueThisMonth: RevenueMetric`
> — map these to the 4 cards. Revenue chart keeps the existing 12-month static data.

- [ ] **Step 1: Replace the file contents**

```tsx
// src/modules/super-admin/pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { PackageSearch, PackageCheck, BarChart3, DollarSign } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DashboardShell } from '@/components/dashboard';
import type { CardConfig, ChartPoint, TableRow } from '@/components/dashboard';
import { Layout } from '../components/layout';
import type { DashboardKpi } from '@/services/super-admin.service';
import { superAdminService } from '@/services/super-admin.service';

// Revenue trend — same 12-month series as the original dashboard
const CHART_DATA: ChartPoint[] = [
  { label: 'May', org: 12.4, user: 3.2 },
  { label: 'Jun', org: 14.2, user: 3.8 },
  { label: 'Jul', org: 15.8, user: 4.1 },
  { label: 'Aug', org: 17.2, user: 4.6 },
  { label: 'Sep', org: 16.8, user: 4.4 },
  { label: 'Oct', org: 19.1, user: 5.2 },
  { label: 'Nov', org: 21.3, user: 5.8 },
  { label: 'Dec', org: 23.6, user: 6.3 },
  { label: 'Jan', org: 25.2, user: 6.9 },
  { label: 'Feb', org: 24.1, user: 6.6 },
  { label: 'Mar', org: 27.4, user: 7.4 },
  { label: 'Apr', org: 29.8, user: 8.1 },
];

// Static org snapshot for the dashboard table
const TABLE_DATA: TableRow[] = [
  { org: 'Hanoi Airport', plan: 'Enterprise', users: 124, status: 'Active' },
  { org: 'HCMC Transit', plan: 'Pro', users: 87, status: 'Active' },
  { org: 'Da Nang Hotel', plan: 'Starter', users: 12, status: 'Trial' },
  { org: 'Nha Trang Resort', plan: 'Pro', users: 45, status: 'Active' },
  { org: 'Hue Museum', plan: 'Starter', users: 8, status: 'Trial' },
  { org: 'Can Tho Port', plan: 'Enterprise', users: 63, status: 'Active' },
];

const ORG_STATUS_CLASSES: Record<string, string> = {
  Active: 'bg-[#e8f9f0] text-[#06c167]',
  Trial: 'bg-[#fff8e6] text-[#c97a00]',
  Suspended: 'bg-[#fff0f2] text-[#c13515]',
};

const ORG_COLUMNS: ColumnDef<TableRow>[] = [
  { accessorKey: 'org', header: 'Organization' },
  { accessorKey: 'plan', header: 'Plan' },
  { accessorKey: 'users', header: 'Users' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const v = getValue() as string;
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            ORG_STATUS_CLASSES[v] ?? 'bg-[#f7f7f7] text-[#6a6a6a]'
          }`}
        >
          {v}
        </span>
      );
    },
  },
];

export function DashboardPage() {
  const [kpi, setKpi] = useState<DashboardKpi | null>(null);

  useEffect(() => {
    superAdminService.getDashboardKpi().then(setKpi).catch(console.error);
  }, []);

  const fmt = (n: number | undefined) =>
    n !== undefined ? n.toLocaleString() : '—';

  const cards: CardConfig[] = [
    {
      label: 'Total Lost Items',
      value: fmt(kpi?.totalLostItems.value),
      trend:
        kpi?.totalLostItems.changePercent !== undefined
          ? `${kpi.totalLostItems.changePercent > 0 ? '+' : ''}${kpi.totalLostItems.changePercent}% vs last month`
          : undefined,
      trendDirection:
        (kpi?.totalLostItems.changePercent ?? 0) >= 0 ? 'up' : 'down',
      icon: <PackageSearch className="w-4 h-4" />,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
    },
    {
      label: 'Total Found',
      value: fmt(kpi?.totalFound.value),
      trend:
        kpi?.totalFound.changePercent !== undefined
          ? `${kpi.totalFound.changePercent > 0 ? '+' : ''}${kpi.totalFound.changePercent}% vs last month`
          : undefined,
      trendDirection: (kpi?.totalFound.changePercent ?? 0) >= 0 ? 'up' : 'down',
      icon: <PackageCheck className="w-4 h-4" />,
      iconBg: 'bg-[#e8f9f0]',
      iconColor: 'text-[#06c167]',
    },
    {
      label: 'Return Rate',
      value: kpi?.successReturnRate.value !== undefined
        ? `${kpi.successReturnRate.value}%`
        : '—',
      trend:
        kpi?.successReturnRate.changePercent !== undefined
          ? `${kpi.successReturnRate.changePercent > 0 ? '+' : ''}${kpi.successReturnRate.changePercent}%`
          : undefined,
      trendDirection:
        (kpi?.successReturnRate.changePercent ?? 0) >= 0 ? 'up' : 'down',
      icon: <BarChart3 className="w-4 h-4" />,
      iconBg: 'bg-[#f7f7f7]',
      iconColor: 'text-[#6a6a6a]',
    },
    {
      label: 'Revenue This Month',
      value: kpi?.revenueThisMonth.value !== undefined
        ? `$${(kpi.revenueThisMonth.value / 1000).toFixed(1)}K`
        : '—',
      trend:
        kpi?.revenueThisMonth.changePercent !== undefined
          ? `${kpi.revenueThisMonth.changePercent > 0 ? '+' : ''}${kpi.revenueThisMonth.changePercent}%`
          : undefined,
      trendDirection:
        (kpi?.revenueThisMonth.changePercent ?? 0) >= 0 ? 'up' : 'down',
      icon: <DollarSign className="w-4 h-4" />,
      iconBg: 'bg-[#fff8e6]',
      iconColor: 'text-[#c97a00]',
    },
  ];

  return (
    <Layout>
      <DashboardShell
        header={{
          title: 'Platform Overview',
          subtitle: 'Super Admin · Backtrack Lost & Found Platform',
        }}
        cards={cards}
        chart={{
          title: 'Revenue Flow',
          data: CHART_DATA,
          series: [
            { key: 'org', label: 'Org Revenue (K USD)', color: '#ff385c' },
            { key: 'user', label: 'User Fees (K USD)', color: '#6a6a6a' },
          ],
        }}
        table={{
          title: 'Organizations',
          columns: ORG_COLUMNS,
          data: TABLE_DATA,
          pageSize: 5,
        }}
      />
    </Layout>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | grep -E "error TS"
```
Expected: no errors.

---

## Task 11: Full build verification

- [ ] **Step 1: Run the full build**

```bash
cd /Users/linvg/Documents/Workspace/web-console-backtrack && npm run build
```

Expected output:
- Zero `error TS` lines
- `✓ built in X.Xs` at the end
- Pre-existing warnings about recharts circular re-exports and large chunk sizes are acceptable

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/ src/routes/dashboard.tsx src/modules/console/pages/admin/dashboard.tsx src/modules/super-admin/pages/dashboard.tsx docs/superpowers/plans/
git commit -m "feat: add generic DashboardShell component with SiteHeader, SectionCards, ChartAreaInteractive, DataTable"
```

---

## Self-Review

### Spec coverage
| Requirement | Task |
|-------------|------|
| SiteHeader section | Task 2 |
| SectionCards (4 KPI cards) | Task 3 |
| ChartAreaInteractive with time range toggle | Task 4 |
| DataTable with sort + pagination | Task 5 |
| DashboardShell composing all 4 | Task 6 |
| Barrel export | Task 7 |
| Generic `/dashboard` route wired | Task 8 |
| Console admin dashboard wired | Task 9 |
| Super-admin dashboard wired | Task 10 |
| Airbnb tokens throughout (no dark mode, no slate-*) | All tasks |
| No new npm packages | All tasks — using existing recharts + @tanstack/react-table |

### Placeholder scan
No TBDs, no "implement later", no "handle edge cases" without code. All cell renderers have exact inline code. All mock data arrays are fully specified.

### Type consistency
- `TableRow = Record<string, unknown>` — used consistently in types.ts, data-table.tsx, and all 3 role wires.
- `ChartPoint` — has `label: string` + index signature; matches `dataKey="label"` in XAxis.
- `CardConfig.trendDirection` is `'up' | 'down' | 'neutral' | undefined` — ternary in SectionCards handles all cases.
- `ColumnDef<TableRow>` — used in types.ts and all 3 role wires; no mismatch.
