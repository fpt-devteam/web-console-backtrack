import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryBreakdownItem } from '@/services/admin-dashboard.service'

interface CategoryBreakdownPanelProps {
  data: Array<CategoryBreakdownItem>
}

export function CategoryBreakdownPanel({ data }: CategoryBreakdownPanelProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#222222]">Items by Category</h2>
        <p className="text-xs text-[#929292] mt-0.5">All active items in storage</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={data as any[]}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined, name: string | undefined) => [`${value ?? 0} items`, name ?? '']}
                contentStyle={{ borderRadius: 10, border: '1px solid #dddddd', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2.5 w-full">
          {data.map(item => (
            <div key={item.category} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-[#6a6a6a] truncate">{item.category}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs font-semibold text-[#222222]">{item.count}</span>
                <span className="text-[10px] text-[#929292]">
                  ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-[#f7f7f7] flex items-center justify-between">
            <span className="text-xs text-[#929292]">Total</span>
            <span className="text-sm font-bold text-[#222222]">{total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
