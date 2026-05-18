import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WeeklyActivityPoint } from '@/mock/data/mock-staff-dashboard'

interface ActivityChartProps {
  data: Array<WeeklyActivityPoint>
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
      <h2 className="text-sm font-semibold text-[#222222] mb-4">My Activity This Week</h2>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gIntake" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff385c" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ff385c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gReturned" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06c167" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#06c167" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#929292' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#929292' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #dddddd', fontSize: 12 }}
            itemStyle={{ color: '#222222' }}
          />
          <Area type="monotone" dataKey="intake" name="Intake" stroke="#ff385c" strokeWidth={2} fill="url(#gIntake)" dot={false} />
          <Area type="monotone" dataKey="returned" name="Returned" stroke="#06c167" strokeWidth={2} fill="url(#gReturned)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-[#6a6a6a]">
          <span className="w-3 h-0.5 rounded-full bg-[#ff385c] inline-block" /> Intake
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#6a6a6a]">
          <span className="w-3 h-0.5 rounded-full bg-[#06c167] inline-block" /> Returned
        </span>
      </div>
    </div>
  )
}
