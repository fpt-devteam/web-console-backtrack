import { Flame, Package, TrendingUp } from 'lucide-react'
import type { EngagementMetrics } from '@/services/staff-dashboard.service'

const RANK_STYLE = {
  'Needs Improvement': 'bg-[#fde8e8] text-[#c13515]',
  'Active':            'bg-[#fff8e6] text-[#c97a00]',
  'Top Performer':     'bg-[#e8f9f0] text-[#06c167]',
}

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const

interface MetricTileProps {
  icon: typeof Package
  iconBg: string
  iconColor: string
  label: string
  value: string
}

function MetricTile({ icon: Icon, iconBg, iconColor, label, value }: MetricTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] px-4 py-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[#929292] leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-[#222222] leading-none">{value}</p>
      </div>
    </div>
  )
}

interface EngagementMetricsProps {
  data: EngagementMetrics
}

export function EngagementMetricsPanel({ data }: EngagementMetricsProps) {
  const circumference = 2 * Math.PI * 28
  const filled = circumference * (data.score / 100)
  const gap = circumference - filled

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#222222]">Engagement</h2>
          <p className="text-xs text-[#929292] mt-0.5">Your activity level this period</p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${RANK_STYLE[data.rank]}`}>
          {data.rank}
        </span>
      </div>

      {/* Score ring + week dots */}
      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r="28" fill="none" stroke="#f0f0f0" strokeWidth="7" />
            <circle
              cx="40" cy="40" r="28" fill="none"
              stroke="#ff385c" strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${gap}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-[#222222] leading-none">{data.score}</span>
            <span className="text-[9px] text-[#929292]">/ 100</span>
          </div>
        </div>

        {/* Week activity + streak */}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-[10px] text-[#929292] mb-1.5">This week</p>
            <div className="flex gap-1.5">
              {WEEK_DAYS.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold transition-colors ${
                    data.weekActivity[i]
                      ? 'bg-[#ff385c] text-white'
                      : 'bg-[#f7f7f7] text-[#c0c0c0]'
                  }`}>
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#c97a00]" />
            <span className="text-xs font-semibold text-[#222222]">{data.streak}-day streak</span>
          </div>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <MetricTile
          icon={Package}
          iconBg="bg-[#fff0f2]"
          iconColor="text-[#ff385c]"
          label="Items this month"
          value={String(data.itemsThisMonth)}
        />
        <MetricTile
          icon={TrendingUp}
          iconBg="bg-[#f0f4ff]"
          iconColor="text-[#2471A3]"
          label="Avg per day"
          value={data.avgItemsPerDay.toFixed(1)}
        />
        
      </div>
    </div>
  )
}
