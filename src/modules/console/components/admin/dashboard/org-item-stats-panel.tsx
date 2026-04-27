import { Archive, Package, RotateCcw, Timer } from 'lucide-react'
import type { AdminDashboardStats } from '@/services/admin-dashboard.service'

interface OrgItemStatsPanelProps {
  data: AdminDashboardStats
}

function StatTile({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: typeof Package
  iconBg: string
  iconColor: string
  label: string
  value: number
  sub: string
}) {
  return (
    <div className="rounded-xl bg-[#fafafa] border border-[#f0f0f0] p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <span className={`text-[11px] font-medium ${iconColor}`}>{label}</span>
      </div>
      <span className="text-2xl font-bold text-[#222222] leading-none">{value}</span>
      <span className="text-[10px] text-[#929292]">{sub}</span>
    </div>
  )
}

export function OrgItemStatsPanel({ data }: OrgItemStatsPanelProps) {
  const { totalItems, inStorage, returnedThisMonth, expiredItems } = data
  const other = Math.max(0, totalItems - inStorage - expiredItems)

  const inStoragePct  = totalItems > 0 ? Math.round((inStorage / totalItems) * 100) : 0
  const returnedPct   = totalItems > 0 ? Math.round(((totalItems - inStorage - expiredItems) / totalItems) * 100) : 0
  const expiredPct    = totalItems > 0 ? Math.round((expiredItems / totalItems) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[#222222]">Org Item Overview</h2>
        <p className="text-xs text-[#929292] mt-0.5">All items logged across the organisation</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatTile
          icon={Package}
          iconBg="bg-[#f0f4ff]"
          iconColor="text-[#2471A3]"
          label="In Storage"
          value={inStorage}
          sub={`${inStoragePct}% of total`}
        />
        <StatTile
          icon={RotateCcw}
          iconBg="bg-[#e8f9f0]"
          iconColor="text-[#06c167]"
          label="Returned"
          value={returnedThisMonth}
          sub="This month"
        />
        <StatTile
          icon={Timer}
          iconBg="bg-[#fff8e6]"
          iconColor="text-[#c97a00]"
          label="Expired"
          value={expiredItems}
          sub={`${expiredPct}% of total`}
        />
        <StatTile
          icon={Archive}
          iconBg="bg-[#f7f7f7]"
          iconColor="text-[#929292]"
          label="Other"
          value={other}
          sub={`${returnedPct}% returned`}
        />
      </div>

      {/* Proportion bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-[#929292] mb-1.5">
          <span>In Storage {inStoragePct}%</span>
          <span className="font-semibold text-[#222222]">{totalItems} total</span>
          <span>Expired {expiredPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#f7f7f7] overflow-hidden flex gap-px">
          <div className="h-full bg-[#2471A3] rounded-l-full transition-all" style={{ width: `${inStoragePct}%` }} />
          <div className="h-full bg-[#06c167] flex-1 transition-all" />
          <div className="h-full bg-[#c97a00] rounded-r-full transition-all" style={{ width: `${expiredPct}%` }} />
        </div>
      </div>
    </div>
  )
}
