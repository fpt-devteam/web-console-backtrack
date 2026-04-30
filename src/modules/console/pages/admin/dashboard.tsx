import { useState } from 'react'
import { CheckCircle, MapPin, Package, Users } from 'lucide-react'
import { Layout } from '../../components/admin/layout'
import { StatCard } from '../../components/admin/dashboard/stat-card'
import { MonthlyActivityChart } from '../../components/admin/dashboard/monthly-activity-chart'
import { StaffPerformancePanel } from '../../components/admin/dashboard/staff-performance-panel'
// import { OrgItemStatsPanel } from '../../components/admin/dashboard/org-item-stats-panel'
import { RecentInventoryPanel } from '../../components/admin/dashboard/recent-inventory-panel'
import { useCurrentUser } from '@/hooks/use-auth'
import {
  useAdminDashboardStats,
  useAdminMonthlyActivity,
  useAdminRecentInventory,
  useAdminStaffPerformance,
} from '@/hooks/use-admin-dashboard'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const PAGE_SIZE = 3

export function AdminDashboardPage() {
  const [itemsPage, setItemsPage] = useState(1)
  const { data: user }     = useCurrentUser()
  const { data: stats }    = useAdminDashboardStats()
  const { data: monthly }  = useAdminMonthlyActivity()
  const { data: staff }    = useAdminStaffPerformance()
  const { data: inventory} = useAdminRecentInventory(itemsPage, PAGE_SIZE)

  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin'

  return (
    <Layout>
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-[#929292] mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Staff"
            value={stats?.activeStaff ?? '—'}
            sub={`${stats?.totalStaff ?? 0} total · +${stats?.newStaffThisMonth ?? 0} this month`}
            icon={Users}
            iconBg="bg-[#fff0f2]"
            iconColor="text-[#ff385c]"
          />
          <StatCard
            label="Items in Storage"
            value={stats?.inStorage ?? '—'}
            sub={`${stats?.totalItems ?? 0} total logged`}
            icon={Package}
            iconBg="bg-[#f0f4ff]"
            iconColor="text-[#2471A3]"
          />
          <StatCard
            label="Return Rate"
            value={stats ? `${stats.returnRate}%` : '—'}
            sub={`${stats?.returnedThisMonth ?? 0} returned this month`}
            icon={CheckCircle}
            iconBg="bg-[#e8f9f0]"
            iconColor="text-[#06c167]"
          />
          <StatCard
            label="Found Posts"
            value={stats?.foundPosts ?? '—'}
            sub={`${stats?.lostPosts ?? 0} lost posts`}
            icon={MapPin}
            iconBg="bg-[#fff8e6]"
            iconColor="text-[#c97a00]"
          />
        </div>

        {/* Monthly trend (2/3) + Org item stats (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-3">
            {monthly
              ? <MonthlyActivityChart data={monthly} />
              : <div className="h-full min-h-[296px] bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
            }
          </div>
          {/* <div>
            {stats
              ? <OrgItemStatsPanel data={stats} />
              : <div className="h-full min-h-[296px] bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
            }
          </div> */}
        </div>

        {/* Staff performance (1/2) + Recent inventory (1/2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {staff
            ? <StaffPerformancePanel data={staff} />
            : <div className="h-64 bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
          }
          <RecentInventoryPanel
            items={inventory?.items ?? []}
            totalCount={inventory?.totalCount ?? 0}
            page={itemsPage}
            pageSize={PAGE_SIZE}
            onPageChange={setItemsPage}
          />
        </div>

      </div>
    </Layout>
  )
}
