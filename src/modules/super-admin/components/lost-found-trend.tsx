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
