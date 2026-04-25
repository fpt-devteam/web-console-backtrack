import { ArrowDownRight, ArrowUpRight, DollarSign, Package, PackageSearch, RotateCcw } from 'lucide-react';

import { RadialRing } from './radial-ring';
import { Sparkline } from './sparkline';
import type { DashboardKpi } from '@/services/super-admin.service';

interface KpiCardsProps {
  kpi: DashboardKpi | null;
}

const card = 'bg-white rounded-[14px] border border-[#dddddd] p-5';

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

  const lostChange    = formatChange(lost?.changePercent    ?? 0, 'bg-[#fff0f2] text-[#c13515]',    'bg-[#e8f9f0] text-[#06c167]');
  const foundChange   = formatChange(found?.changePercent   ?? 0, 'bg-[#e8f9f0] text-[#06c167]',    'bg-[#fff0f2] text-[#c13515]');
  const rateChange    = formatChange(rate?.changePercent    ?? 0, 'bg-[#f7f7f7] text-[#222222]',    'bg-[#fff0f2] text-[#c13515]');
  const revenueChange = formatChange(revenue?.changePercent ?? 0, 'bg-[#f7f7f7] text-[#6a6a6a]',   'bg-[#fff0f2] text-[#c13515]');

  const returnRate = rate?.value ?? 0;
  const vsSign     = (revenue?.vsLastMonth ?? 0) >= 0 ? '↑' : '↓';

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* KPI 1 – Total Lost Items */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-[#fff0f2] p-2.5">
            <Package className="h-5 w-5 text-[#c13515]" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${lostChange.colorClass}`}>
            <lostChange.Icon className="h-3 w-3" />{lostChange.label}
          </span>
        </div>
        <p className="text-sm text-[#6a6a6a]">Total Lost Items</p>
        <p className="mt-1 text-3xl font-bold text-[#222222]">
          {lost ? lost.value.toLocaleString() : '—'}
        </p>
        <div className="mt-3">
          <Sparkline data={lost?.sparkline ?? []} color="#EF4444" uid="kpi-lost" />
        </div>
        <p className="mt-1 text-xs text-[#929292]">
          {lost ? `${lost.thisMonth.toLocaleString()} reported this month` : ''}
        </p>
      </div>

      {/* KPI 2 – Total Found */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-[#e8f9f0] p-2.5">
            <PackageSearch className="h-5 w-5 text-[#06c167]" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${foundChange.colorClass}`}>
            <foundChange.Icon className="h-3 w-3" />{foundChange.label}
          </span>
        </div>
        <p className="text-sm text-[#6a6a6a]">Total Found</p>
        <p className="mt-1 text-3xl font-bold text-[#222222]">
          {found ? found.value.toLocaleString() : '—'}
        </p>
        <div className="mt-3">
          <Sparkline data={found?.sparkline ?? []} color="#10B981" uid="kpi-found" />
        </div>
        <p className="mt-1 text-xs text-[#929292]">
          {found ? `${found.thisMonth.toLocaleString()} confirmed this month` : ''}
        </p>
      </div>

      {/* KPI 3 – Success Return Rate */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-[#f7f7f7] p-2.5">
            <RotateCcw className="h-5 w-5 text-[#222222]" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${rateChange.colorClass}`}>
            <rateChange.Icon className="h-3 w-3" />{rateChange.label}
          </span>
        </div>
        <p className="text-sm text-[#6a6a6a]">Success Return Rate</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="relative shrink-0">
            <RadialRing value={returnRate} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#ff385c]">
              {returnRate}%
            </span>
          </div>
          <div className="flex-1">
            <p className="mb-2 text-xs text-[#929292]">of items returned</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#f7f7f7]">
              <div className="h-full rounded-full bg-[#ff385c]" style={{ width: `${returnRate}%` }} />
            </div>
            <p className="mt-1 text-right text-[11px] font-semibold text-[#ff385c]">
              {rate ? `${rate.returned} / ${rate.total}` : '— / —'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI 4 – Revenue This Month */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-lg bg-[#f7f7f7] p-2.5">
            <DollarSign className="h-5 w-5 text-[#6a6a6a]" />
          </span>
          <span className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${revenueChange.colorClass}`}>
            <revenueChange.Icon className="h-3 w-3" />{revenueChange.label}
          </span>
        </div>
        <p className="text-sm text-[#6a6a6a]">Revenue This Month</p>
        <p className="mt-1 text-3xl font-bold text-[#222222]">
          {revenue ? `$${revenue.value.toLocaleString()}` : '—'}
        </p>
        <div className="mt-3">
          <Sparkline data={revenue?.sparkline ?? []} color="#8B5CF6" uid="kpi-revenue" />
        </div>
        <p className="mt-1 text-xs text-[#929292]">
          {revenue ? `${vsSign} $${Math.abs(revenue.vsLastMonth).toLocaleString()} vs last month` : ''}
        </p>
      </div>

    </div>
  );
}
