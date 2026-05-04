import { useCallback, useEffect, useState } from 'react';

import { Clock } from 'lucide-react';

import { KpiCards, Layout, LostFoundTrend, RecentActivity } from '../components';
import type { SeriesConfig } from '@/components/dashboard';
import type { DashboardKpi, RevenueMonthlyItem } from '@/services/super-admin.service';
import { ChartAreaInteractive, SiteHeader } from '@/components/dashboard';
import { superAdminService } from '@/services/super-admin.service';



const hotspots = [
  { x: 50, y: 19, r: 26, label: 'Hanoi',     count: 445, color: '#F59E0B' },
  { x: 58, y: 16, r: 14, label: 'Hai Phong', count: 187, color: '#10B981' },
  { x: 67, y: 46, r: 19, label: 'Da Nang',   count: 298, color: '#F59E0B' },
  { x: 67, y: 62, r: 11, label: 'Nha Trang', count: 98,  color: '#10B981' },
  { x: 64, y: 76, r: 30, label: 'HCMC',      count: 612, color: '#EF4444' },
  { x: 61, y: 84, r: 13, label: 'Can Tho',   count: 143, color: '#F59E0B' },
];

const REVENUE_SERIES: Array<SeriesConfig> = [
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

const RANGE_MONTHS: Record<'3m' | '12m', number> = {
  '3m':  3,
  '12m': 12,
};

export function DashboardPage() {
  const [kpi, setKpi] = useState<DashboardKpi | null>(null);
  const [revenueData, setRevenueData] = useState<Array<RevenueMonthlyItem>>([]);
  const [revenueMonths, setRevenueMonths] = useState(12);

  useEffect(() => {
    superAdminService.getDashboardKpi().then(setKpi).catch(console.error);
  }, []);

  useEffect(() => {
    superAdminService.getRevenueMonthly(revenueMonths).then(setRevenueData).catch(console.error);
  }, [revenueMonths]);

  const handleRevenueRangeChange = useCallback((range: '3m' | '12m') => {
    setRevenueMonths(RANGE_MONTHS[range]);
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

        {/* ── trend — full width ── */}
        <div className="mt-5">
          <ChartAreaInteractive
              title="Revenue Flow"
              data={revenueChartData}
              series={REVENUE_SERIES}
              defaultRange="12m"
              onRangeChange={handleRevenueRangeChange}
            />
        </div>

        {/* ── revenue (7) + heatmap (5) ── */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
           {/* ── trend — full width ── */}
          <div className="lg:col-span-6">
            <LostFoundTrend />
          </div>
          {/* Revenue Flow
          <div className="lg:col-span-6">
            <ChartAreaInteractive
              title="Revenue Flow"
              data={revenueChartData}
              series={REVENUE_SERIES}
              defaultRange="12m"
              onRangeChange={handleRevenueRangeChange}
            />
          </div> */}
          {/* ── recent activity — full width ── */}
        <div className="lg:col-span-6">
          <RecentActivity />
        </div>
        </div>{/* end revenue + heatmap row */}

        

      </div>
    </Layout>
  );
}
