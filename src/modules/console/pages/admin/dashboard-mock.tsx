import { useMemo, useState } from 'react'
import { CheckCircle, MapPin, Package, Users, Info } from 'lucide-react'
import { Layout } from '../../components/admin/layout'
import { StatCard } from '../../components/admin/dashboard/stat-card'
import { MonthlyActivityChart } from '../../components/admin/dashboard/monthly-activity-chart'
import { StaffPerformancePanel } from '../../components/admin/dashboard/staff-performance-panel'
import { RecentInventoryPanel } from '../../components/admin/dashboard/recent-inventory-panel'
import { useCurrentUser } from '@/hooks/use-auth'
import type { AdminDashboardStats, MonthlyActivityPoint, StaffPerformanceItem, AdminInventoryItem } from '@/services/admin-dashboard.service'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function AdminDashboardNoticeBanner() {
  return (
    <div className="rounded-2xl border border-[#fca5a5] bg-[#fef2f2] px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex items-start gap-3">
        <Info className="mt-1 w-4 h-4 flex-shrink-0 text-[#dc2626]" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#222222] leading-none uppercase">Notice</div>
          <div className="mt-1 text-sm text-[#6a6a6a] leading-relaxed">
            Your organization is currently on the Free plan. This dashboard is shown with example data for preview purposes.
          </div>
        </div>
      </div>
    </div>
  )
}

const PAGE_SIZE = 3

export function AdminDashboardMockPage() {
  const [itemsPage, setItemsPage] = useState(1)
  const { data: user } = useCurrentUser()
  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin'

  const stats: AdminDashboardStats = useMemo(
    () => ({
      activeStaff: 12,
      totalStaff: 18,
      newStaffThisMonth: 2,
      inStorage: 320,
      totalItems: 615,
      returnRate: 62,
      returnedThisMonth: 44,
      expiredItems: 9,
      foundToday: 7,
      foundPosts: 520,
      lostPosts: 95,
    }),
    [],
  )

  const monthly: Array<MonthlyActivityPoint> = useMemo(
    () => [
      { month: 'Jan', lost: 12, found: 68, returned: 38 },
      { month: 'Feb', lost: 14, found: 74, returned: 41 },
      { month: 'Mar', lost: 16, found: 92, returned: 54 },
      { month: 'Apr', lost: 13, found: 88, returned: 57 },
      { month: 'May', lost: 11, found: 63, returned: 39 },
      { month: 'Jun', lost: 15, found: 71, returned: 43 },
    ],
    [],
  )

  const staff: Array<StaffPerformanceItem> = useMemo(
    () => [
      { id: 's-1', name: 'Nguyen Van A', role: 'Staff', itemsLogged: 84, returnRate: 39, activeChats: 3, streak: 12 },
      { id: 's-2', name: 'Tran Thi B', role: 'Staff', itemsLogged: 76, returnRate: 38, activeChats: 2, streak: 8 },
      { id: 's-3', name: 'Le Van C', role: 'Staff', itemsLogged: 61, returnRate: 41, activeChats: 1, streak: 6 },
      { id: 's-4', name: 'Pham Thi D', role: 'Staff', itemsLogged: 58, returnRate: 33, activeChats: 4, streak: 3 },
    ],
    [],
  )

  const allInventory: Array<AdminInventoryItem> = useMemo(
    () => [
      {
        id: 'mock-a1',
        postTitle: 'Blue Backpack',
        category: 'PersonalBelongings',
        subcategoryName: 'Bags',
        status: 'InStorage',
        organizationStorageLocation: 'Shelf A-01',
        imageUrl: null,
        staffName: 'Nguyen Van A',
        createdAt: '2026-05-01T09:14:00Z',
      },
      {
        id: 'mock-a2',
        postTitle: 'Student ID Card',
        category: 'Cards',
        subcategoryName: 'Student ID',
        status: 'Returned',
        organizationStorageLocation: 'Shelf B-02',
        imageUrl: null,
        staffName: 'Tran Thi B',
        createdAt: '2026-04-29T14:32:00Z',
      },
      {
        id: 'mock-a3',
        postTitle: 'iPhone 14',
        category: 'Electronics',
        subcategoryName: 'Phone',
        status: 'Active',
        organizationStorageLocation: 'Counter 1',
        imageUrl: null,
        staffName: 'Le Van C',
        createdAt: '2026-04-27T11:05:00Z',
      },
      {
        id: 'mock-a4',
        postTitle: 'Leather Wallet',
        category: 'PersonalBelongings',
        subcategoryName: 'Wallet',
        status: 'InStorage',
        organizationStorageLocation: 'Shelf A-03',
        imageUrl: null,
        staffName: 'Pham Thi D',
        createdAt: '2026-04-26T16:20:00Z',
      },
      {
        id: 'mock-a5',
        postTitle: 'AirPods',
        category: 'Electronics',
        subcategoryName: 'Earphones',
        status: 'ReturnScheduled',
        organizationStorageLocation: 'Drawer C-01',
        imageUrl: null,
        staffName: 'Nguyen Van A',
        createdAt: '2026-04-25T10:45:00Z',
      },
    ],
    [],
  )

  const totalCount = allInventory.length
  const inventory = useMemo(() => {
    const start = (itemsPage - 1) * PAGE_SIZE
    return allInventory.slice(start, start + PAGE_SIZE)
  }, [allInventory, itemsPage])

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

        <AdminDashboardNoticeBanner />

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Staff"
            value={stats.activeStaff}
            sub={`${stats.totalStaff} total · +${stats.newStaffThisMonth} this month`}
            icon={Users}
            iconBg="bg-[#fff0f2]"
            iconColor="text-[#ff385c]"
          />
          <StatCard
            label="Items in Storage"
            value={stats.inStorage}
            sub={`${stats.totalItems} total logged`}
            icon={Package}
            iconBg="bg-[#f0f4ff]"
            iconColor="text-[#2471A3]"
          />
          <StatCard
            label="Return Rate"
            value={`${stats.returnRate}%`}
            sub={`${stats.returnedThisMonth} returned this month`}
            icon={CheckCircle}
            iconBg="bg-[#e8f9f0]"
            iconColor="text-[#06c167]"
          />
          <StatCard
            label="Found Posts"
            value={stats.foundPosts}
            sub={`${stats.lostPosts} lost posts`}
            icon={MapPin}
            iconBg="bg-[#fff8e6]"
            iconColor="text-[#c97a00]"
          />
        </div>

        {/* Monthly trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-3">
            <MonthlyActivityChart data={monthly} />
          </div>
        </div>

        {/* Staff performance + Recent inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StaffPerformancePanel data={staff} />
          <RecentInventoryPanel
            items={inventory}
            totalCount={totalCount}
            page={itemsPage}
            pageSize={PAGE_SIZE}
            onPageChange={setItemsPage}
          />
        </div>
      </div>
    </Layout>
  )
}

