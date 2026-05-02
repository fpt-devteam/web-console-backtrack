import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PostStatusBreakdown, PostTypeStats } from '@/services/staff-dashboard.service'
import type { PostStatus } from '@/services/inventory.service'

const STATUSES: Array<{ key: PostStatus; label: string }> = [
  { key: 'InStorage',       label: 'In Storage'       },
  // { key: 'ReturnScheduled', label: 'Return Scheduled' },
  { key: 'Returned',        label: 'Returned'         },
  { key: 'Archived',        label: 'Archived'         },
  { key: 'Expired',         label: 'Expired'          },
]

// Dark = org-wide  /  Light = personal
const SERIES = [
  { key: 'orgFound',  name: 'Org · Found',  color: '#1976D2' },
  { key: 'mineFound', name: 'Mine · Found', color: '#64B5F6' },
] as const

function pct(stats: PostTypeStats, status: PostStatus) {
  return stats.statuses.find((s) => s.status === status)?.pct ?? 0
}

function count(stats: PostTypeStats, status: PostStatus) {
  return stats.statuses.find((s) => s.status === status)?.count ?? 0
}

interface Props {
  data: PostStatusBreakdown
}

export function PostStatusBreakdownChart({ data }: Props) {
  const chartData = STATUSES.map(({ key, label }) => ({
    status: label,
    orgFound:  pct(data.org.found,  key),
    mineFound: pct(data.mine.found, key),
    // raw counts for tooltip
    orgFoundCount:  count(data.org.found,  key),
    mineFoundCount: count(data.mine.found, key),
  }))

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#222222]">Post Status Breakdown</h2>
        <p className="text-xs text-[#929292] mt-0.5">
          % of Found posts per status — org-wide vs. mine
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barCategoryGap="25%" barGap={2} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 10, fill: '#929292' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#929292' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ fill: '#f7f7f7' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #dddddd', fontSize: 12 }}
            content={({ active, payload, label }) => {
              if (!active || !payload.length) return null
              return (
                <div className="bg-white border border-[#dddddd] rounded-xl px-3 py-2.5 shadow-lg text-xs space-y-1">
                  <p className="font-semibold text-[#222222] mb-1.5">{label as string}</p>
                  {payload.map((entry) => {
                    const series = SERIES.find((s) => s.key === entry.dataKey)
                    if (!series) return null
                    const rawKey = `${String(series.key)}Count`
                    const raw = (entry.payload as Record<string, number>)[rawKey] ?? 0
                    return (
                      <div key={series.key} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: series.color }} />
                        <span className="text-[#6a6a6a]">{series.name}:</span>
                        <span className="font-medium text-[#222222]">{entry.value as number}%</span>
                        <span className="text-[#929292]">({raw} posts)</span>
                      </div>
                    )
                  })}
                </div>
              )
            }}
          />
          <Legend
            iconType="square"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 16 }}
            formatter={(value: string) => <span style={{ color: '#6a6a6a' }}>{value}</span>}
          />
          {SERIES.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
