import { useEffect, useState } from 'react';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { LightTooltip } from './light-tooltip';
import type { PostMonthlyItem } from '@/services/super-admin.service';
import { superAdminService } from '@/services/super-admin.service';

export function LostFoundTrend() {
  const [data, setData] = useState<Array<PostMonthlyItem>>([]);

  useEffect(() => {
    superAdminService.getPostMonthly().then(setData).catch(console.error);
  }, []);

  const dateLabel =
    data.length >= 2
      ? `${data[0].month} ${data[0].year} – ${data[data.length - 1].month} ${data[data.length - 1].year}`
      : 'Loading…';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Lost vs Found Trend</h2>
          <p className="text-xs text-gray-400">{dateLabel}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EF4444]" />Lost
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#10B981]" />Found
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="trendLost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="trendFound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10B981" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<LightTooltip />} />
          <Area type="monotone" dataKey="lost"  name="Lost"  stroke="#EF4444" fill="url(#trendLost)"  strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="found" name="Found" stroke="#10B981" fill="url(#trendFound)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
