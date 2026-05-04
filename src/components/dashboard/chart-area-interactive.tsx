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

const RANGES = ['3m', '12m'] as const;
type Range = (typeof RANGES)[number];

const RANGE_LABEL: Record<Range, string> = { '3m': '3 months', '12m': '12 months' };

/** Number of data points to show per range; null = show all */
const RANGE_SLICE: Record<Range, number | null> = { '3m': 90, '12m': null };

export function ChartAreaInteractive({
  title,
  data,
  series,
  defaultRange = '3m',
  rangeSlice,
  onRangeChange,
}: ChartConfig) {
  const [range, setRange] = useState<Range>(defaultRange);
  const limit = (rangeSlice ?? RANGE_SLICE)[range];
  const sliced = limit != null ? data.slice(-limit) : data;

  function handleRangeChange(r: Range) {
    setRange(r)
    onRangeChange?.(r)
  }

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#222222]">{title}</h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRangeChange(r)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                range === r
                  ? 'border-[#222222] bg-[#222222] text-white'
                  : 'border-[#dddddd] text-[#6a6a6a] hover:border-[#222222]'
              }`}
            >
              {RANGE_LABEL[r]}
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
          <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" vertical={false} />
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
