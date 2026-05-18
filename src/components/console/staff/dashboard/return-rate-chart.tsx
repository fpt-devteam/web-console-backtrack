import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { ReturnRateBreakdown } from '@/services/staff-dashboard.service'

const SEGMENTS = [
  { key: 'returned' as const, label: 'Returned',   color: '#06c167' },
  { key: 'inStorage' as const, label: 'In Storage', color: '#ff385c' },
  { key: 'expired' as const,  label: 'Expired',    color: '#dddddd' },
  { key: 'other' as const,    label: 'Other',       color: '#f0f0f0' },
]

interface ReturnRateChartProps {
  title: string
  subtitle: string
  data: ReturnRateBreakdown
}

export function ReturnRateChart({ title, subtitle, data }: ReturnRateChartProps) {
  const pieData = SEGMENTS.map(s => ({ name: s.label, value: data[s.key], color: s.color }))

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col">
      <div className="mb-1">
        <h2 className="text-sm font-semibold text-[#222222]">{title}</h2>
        <p className="text-xs text-[#929292] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                strokeWidth={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined, name: string | undefined) => [`${value ?? 0} items`, name ?? '']}
                contentStyle={{ borderRadius: 10, border: '1px solid #dddddd', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-[#222222] leading-none">{data.returnRate}%</span>
            <span className="text-[10px] text-[#929292] mt-0.5">returned</span>
          </div>
        </div>

        {/* Legend + totals */}
        <div className="flex-1 space-y-2.5 w-full">
          {SEGMENTS.map(s => (
            <div key={s.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-[#6a6a6a]">{s.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#222222]">{data[s.key]}</span>
                <span className="text-[10px] text-[#929292]">
                  ({data.total > 0 ? Math.round((data[s.key] / data.total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-[#f7f7f7] flex items-center justify-between">
            <span className="text-xs text-[#929292]">Total items</span>
            <span className="text-sm font-bold text-[#222222]">{data.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
