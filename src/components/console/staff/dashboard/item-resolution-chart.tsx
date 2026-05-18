import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReturnRateBreakdown } from '@/services/staff-dashboard.service'

const STATUSES = [
  { key: 'returned' as const,  label: 'Returned',   myColor: '#06c167', orgColor: '#a7e8c8' },
  { key: 'inStorage' as const, label: 'In Storage', myColor: '#ff385c', orgColor: '#ffb3c1' },
  { key: 'expired' as const,   label: 'Expired',    myColor: '#929292', orgColor: '#d0d0d0' },
  { key: 'other' as const,     label: 'Other',      myColor: '#c0a0ff', orgColor: '#e5d8ff' },
]

function pct(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

interface Props {
  myRate: ReturnRateBreakdown
  orgRate: ReturnRateBreakdown
}

export function ItemResolutionChart({ myRate, orgRate }: Props) {
  const chartData = STATUSES.map((s) => ({
    name: s.label,
    me: pct(myRate[s.key], myRate.total),
    org: pct(orgRate[s.key], orgRate.total),
    myRaw: myRate[s.key],
    orgRaw: orgRate[s.key],
    myColor: s.myColor,
    orgColor: s.orgColor,
  }))

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-[#222222]">My Resolution vs. Org Average</h2>
          <p className="text-xs text-[#929292] mt-0.5">How my items compare to the organization's overall</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#6a6a6a] shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#222222]" /> Me
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#c8c8c8]" /> Org avg
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={4} margin={{ top: 12, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#929292' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#929292' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ fill: '#f7f7f7' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #dddddd', fontSize: 12 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white border border-[#dddddd] rounded-xl p-3 text-xs shadow-lg">
                  <p className="font-semibold text-[#222222] mb-1.5">{label}</p>
                  {payload.map((entry) => {
                    const isMe = entry.dataKey === 'me'
                    const raw = isMe
                      ? (entry.payload as { myRaw: number }).myRaw
                      : (entry.payload as { orgRaw: number }).orgRaw
                    return (
                      <p key={entry.dataKey as string} className="text-[#6a6a6a]">
                        <span className="font-medium" style={{ color: entry.color }}>{isMe ? 'Me' : 'Org avg'}</span>
                        {': '}{entry.value}% ({raw} items)
                      </p>
                    )
                  })}
                </div>
              )
            }}
          />
          <Bar dataKey="me" name="me" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.myColor} />
            ))}
          </Bar>
          <Bar dataKey="org" name="org" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.orgColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Totals row */}
      <div className="mt-3 pt-3 border-t border-[#f7f7f7] flex items-center justify-between text-xs text-[#929292]">
        <span>My return rate: <span className="font-semibold text-[#222222]">{myRate.returnRate}%</span></span>
        <span className="text-[#dddddd]">|</span>
        <span>Org return rate: <span className="font-semibold text-[#222222]">{orgRate.returnRate}%</span></span>
        <span className="text-[#dddddd]">|</span>
        <span>My total items: <span className="font-semibold text-[#222222]">{myRate.total}</span></span>
      </div>
    </div>
  )
}
