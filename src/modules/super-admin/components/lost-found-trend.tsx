import { useCallback, useEffect, useState } from 'react';

import { ChartAreaInteractive } from '@/components/dashboard';
import type { SeriesConfig } from '@/components/dashboard';
import { superAdminService } from '@/services/super-admin.service';

const SERIES: SeriesConfig[] = [
  { key: 'lost',  label: 'Lost',  color: '#EF4444' },
  { key: 'found', label: 'Found', color: '#10B981' },
];

type Range = '3m' | '12m';
const RANGE_MONTHS: Record<Range, number> = { '3m': 3, '12m': 12 };

export function LostFoundTrend() {
  const [months, setMonths] = useState(3);
  const [chartData, setChartData] = useState<Array<{ label: string; lost: number; found: number }>>([]);

  useEffect(() => {
    superAdminService.getPostMonthly(months)
      .then(d => setChartData(d.map(p => ({ label: p.month, lost: p.lost, found: p.found }))))
      .catch(console.error);
  }, [months]);

  const handleRangeChange = useCallback((r: Range) => setMonths(RANGE_MONTHS[r]), []);

  return (
    <ChartAreaInteractive
      title="Lost vs Found Trend"
      data={chartData}
      series={SERIES}
      defaultRange="3m"
      onRangeChange={handleRangeChange}
    />
  );
}
