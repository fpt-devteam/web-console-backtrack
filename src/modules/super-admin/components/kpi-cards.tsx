import { ArrowDownRight, ArrowUpRight, DollarSign, Package, PackageSearch, RotateCcw } from 'lucide-react';


import { RadialRing } from './radial-ring';
import { Sparkline } from './sparkline';
import type { DashboardKpi } from '@/services/super-admin.service';

interface KpiCardsProps {
  kpi: DashboardKpi | null;
}

const card = 'bg-white rounded-xl border border-gray-100 p-5 shadow-sm';

function formatChange(pct: number, colorUp: string, colorDown: string) {
  const up = pct >= 0;
  return {
    label: `${up ? '+' : ''}${pct.toFixed(1)}%`,
    colorClass: up ? colorUp : colorDown,
    Icon: up ? ArrowUpRight : ArrowDownRight,
  };
}

export function KpiCards({ kpi }: KpiCardsProps) {
  const lost    = kpi?.totalLostItems;
  const found   = kpi?.totalFound;
  const rate    = kpi?.successReturnRate;
  const revenue = kpi?.revenueThisMonth;

  const lostChange    = formatChange(lost?.changePercent    ?? 0, 'bg-red-50 text-red-600',    'bg-green-50 text-green-600');
  const foundChange   = formatChange(found?.changePercent   ?? 0, 'bg-green-50 text-green-600', 'bg-red-50 text-red-600');
  const rateChange    = formatChange(rate?.changePercent    ?? 0, 'bg-blue-50 text-blue-600',   'bg-red-50 text-red-600');
  const revenueChange = formatChange(revenue?.changePercent ?? 0, 'bg-purple-50 text-purple-600', 'bg-red-50 text-red-600');

  const returnRate = rate?.value ?? 0;
  const vsSign     = (revenue?.vsLastMonth ?? 0) >= 0 ? '↑' : '↓';

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* KPI 1 – Total Lost Items */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-red-50 p-2.5">
            <Package className="h-5 w-5 text-red-500" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${lostChange.colorClass}`}>
            <lostChange.Icon className="h-3 w-3" />{lostChange.label}
          </span>
        </div>
        <p className="text-sm text-gray-500">Total Lost Items</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {lost ? lost.value.toLocaleString() : '—'}
        </p>
        <div className="mt-3">
          <Sparkline data={lost?.sparkline ?? []} color="#EF4444" uid="kpi-lost" />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {lost ? `${lost.thisMonth.toLocaleString()} reported this month` : ''}
        </p>
      </div>

      {/* KPI 2 – Total Found */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-green-50 p-2.5">
            <PackageSearch className="h-5 w-5 text-green-500" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${foundChange.colorClass}`}>
            <foundChange.Icon className="h-3 w-3" />{foundChange.label}
          </span>
        </div>
        <p className="text-sm text-gray-500">Total Found</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {found ? found.value.toLocaleString() : '—'}
        </p>
        <div className="mt-3">
          <Sparkline data={found?.sparkline ?? []} color="#10B981" uid="kpi-found" />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {found ? `${found.thisMonth.toLocaleString()} confirmed this month` : ''}
        </p>
      </div>

      {/* KPI 3 – Success Return Rate */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-blue-50 p-2.5">
            <RotateCcw className="h-5 w-5 text-blue-500" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${rateChange.colorClass}`}>
            <rateChange.Icon className="h-3 w-3" />{rateChange.label}
          </span>
        </div>
        <p className="text-sm text-gray-500">Success Return Rate</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="relative shrink-0">
            <RadialRing value={returnRate} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-600">
              {returnRate}%
            </span>
          </div>
          <div className="flex-1">
            <p className="mb-2 text-xs text-gray-400">of items returned</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-blue-50">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${returnRate}%` }} />
            </div>
            <p className="mt-1 text-right text-[11px] font-semibold text-blue-600">
              {rate ? `${rate.returned} / ${rate.total}` : '— / —'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI 4 – Revenue This Month */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-purple-50 p-2.5">
            <DollarSign className="h-5 w-5 text-purple-500" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${revenueChange.colorClass}`}>
            <revenueChange.Icon className="h-3 w-3" />{revenueChange.label}
          </span>
        </div>
        <p className="text-sm text-gray-500">Revenue This Month</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {revenue ? `$${revenue.value.toLocaleString()}` : '—'}
        </p>
        <div className="mt-3">
          <Sparkline data={revenue?.sparkline ?? []} color="#8B5CF6" uid="kpi-revenue" />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {revenue ? `${vsSign} $${Math.abs(revenue.vsLastMonth).toLocaleString()} vs last month` : ''}
        </p>
      </div>

    </div>
  );
}
