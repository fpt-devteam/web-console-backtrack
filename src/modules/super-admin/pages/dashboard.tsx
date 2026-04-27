import { useEffect, useState } from 'react';

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

export function DashboardPage() {
  const [kpi, setKpi] = useState<DashboardKpi | null>(null);
  const [revenueData, setRevenueData] = useState<Array<RevenueMonthlyItem>>([]);

  useEffect(() => {
    superAdminService.getDashboardKpi().then(setKpi).catch(console.error);
    superAdminService.getRevenueMonthly().then(setRevenueData).catch(console.error);
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
          <LostFoundTrend />
        </div>

        {/* ── revenue (7) + heatmap (5) ── */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">

          {/* Revenue Flow */}
          <div className="lg:col-span-7">
            <ChartAreaInteractive
              title="Revenue Flow"
              data={revenueChartData}
              series={REVENUE_SERIES}
              defaultRange="90d"
            />
          </div>

          {/* City Heatmap */}
          <div className="lg:col-span-5">
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
          </div>

        </div>{/* end revenue + heatmap row */}

        {/* ── recent activity — full width ── */}
        <div className="mt-4">
          <RecentActivity />
        </div>

      </div>
    </Layout>
  );
}
