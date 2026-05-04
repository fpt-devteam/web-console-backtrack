import type { ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

export interface SiteHeaderConfig {
  title: string;
  subtitle?: string;
  /** Optional React node rendered on the right (e.g. a button) */
  action?: ReactNode;
}

export interface CardConfig {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
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
  defaultRange?: '3m' | '12m';
  /** Override per-range slice counts (useful when data is monthly instead of daily) */
  rangeSlice?: Record<'3m' | '12m', number | null>;
  /** Called when user switches range — use this to re-fetch data from API */
  onRangeChange?: (range: '3m' | '12m') => void;
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
