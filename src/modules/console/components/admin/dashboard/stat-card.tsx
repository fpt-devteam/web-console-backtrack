import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  badge?: { label: string; color: string }
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function StatCard({ label, value, sub, badge, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#6a6a6a]">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <div className="text-[2rem] font-bold text-[#222222] leading-none">{value}</div>
      <div className="flex items-center gap-2">
        {sub && <p className="text-xs text-[#929292]">{sub}</p>}
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
            {badge.label}
          </span>
        )}
      </div>
    </div>
  )
}
