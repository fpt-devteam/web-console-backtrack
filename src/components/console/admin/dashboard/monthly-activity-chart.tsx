import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyActivityPoint } from '@/services/admin-dashboard.service'

interface MonthlyActivityChartProps {
  data: Array<MonthlyActivityPoint>
}

const SERIES = [
  { key: 'found',    label: 'Found',    color: '#2471A3', gradientId: 'gFound'    },
  { key: 'returned', label: 'Returned', color: '#06c167', gradientId: 'gReturned' },
] as const

export function MonthlyActivityChart({ data }: MonthlyActivityChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#222222]">Monthly Activity — Last 12 Months</h2>
        <p className="text-xs text-[#929292] mt-0.5">Found posts logged vs items returned</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <defs>
            {SERIES.map(s => (
              <linearGradient key={s.gradientId} id={s.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={s.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#929292' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#929292' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #dddddd', fontSize: 12 }}
            itemStyle={{ color: '#222222' }}
          />
          {SERIES.map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#${s.gradientId})`}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3">
        {SERIES.map(s => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-[#6a6a6a]">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
