import { useState } from 'react'
import { Activity,CheckCircle, Package, Users } from 'lucide-react'
import { Layout } from '../../components/admin/layout'
import { StatCard } from '../../components/admin/dashboard/stat-card'
import { MonthlyActivityChart } from '../../components/admin/dashboard/monthly-activity-chart'
import { StaffPerformancePanel } from '../../components/admin/dashboard/staff-performance-panel'
import { CategoryBreakdownPanel } from '../../components/admin/dashboard/category-breakdown-panel'
import { OrgReturnRateChart } from '../../components/admin/dashboard/org-return-rate-chart'
import { RecentInventoryPanel } from '../../components/admin/dashboard/recent-inventory-panel'
import {
  useAdminCategoryBreakdown,
  useAdminDashboardStats,
  useAdminMonthlyActivity,
  useAdminOrgReturnRate,
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

  const { data: stats }      = useAdminDashboardStats()
  const { data: monthly }    = useAdminMonthlyActivity()
  const { data: staff }      = useAdminStaffPerformance()
  const { data: categories } = useAdminCategoryBreakdown()
  const { data: returnRate } = useAdminOrgReturnRate()
  const { data: inventory }  = useAdminRecentInventory(itemsPage, PAGE_SIZE)

  return (
    <Layout>
      <div className="h-full overflow-y-auto bg-[#f7f7f7] p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">{greeting()}, Admin 👋</h1>
          <p className="text-sm text-[#929292] mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Top stat cards — row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Staff"
            value={stats?.activeStaff ?? '—'}
            sub={`${stats?.totalStaff ?? 0} total`}
            badge={stats?.newStaffThisMonth ? { label: `+${stats.newStaffThisMonth} this month`, color: 'bg-[#e8f9f0] text-[#06c167]' } : undefined}
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
            label="Found Today"
            value={stats?.foundToday ?? '—'}
            icon={Activity}
            iconBg="bg-[#fff8e6]"
            iconColor="text-[#c97a00]"
          />
        </div>


        {/* Monthly activity chart (full width) */}
        {monthly && <MonthlyActivityChart data={monthly} />}

        {/* Staff performance + Category breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {staff && <StaffPerformancePanel data={staff} />}
          {categories && <CategoryBreakdownPanel data={categories} />}
        </div>

        {/* Return rate + Recent inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {returnRate && <OrgReturnRateChart data={returnRate} />}
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
