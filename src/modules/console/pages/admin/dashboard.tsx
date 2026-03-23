import { Layout } from '../../components/admin/layout'
import {
  Users,
  Package,
  TrendingUp,
  Plus,
  UserPlus,
  Download,
  CheckCircle,
} from 'lucide-react'
import {
  mockDashboardStats,
  mockItemStatusData,
} from '@/mock/data/mock-admin-dashboard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

export function AdminDashboardPage() {
  const stats = mockDashboardStats
  const itemStatus = mockItemStatusData

  // Prepare data for bar chart
  const chartData = [
    { name: 'Found', value: itemStatus.found, fill: '#007CF7' }, // blue-500
    { name: 'Returned', value: itemStatus.returned, fill: '#46D24F' }, // green-500
  ]

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, here's an overview of your organization.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Staff */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Active Staff
              </span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {stats.activeStaff.count}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {stats.activeStaff.change}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Active Items
              </span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {stats.activeItems.count}
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    {stats.activeItems.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Return Rate */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Return Rate
              </span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {stats.returnRate.percentage}%
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {stats.returnRate.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Item Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Item Status Distribution
                </h2>
                <span className="text-sm text-gray-500">Last 30 Days</span>
              </div>

              {/* Bar Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#6b7280', fontSize: 14 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 14 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      Add Found Item
                    </p>
                    <p className="text-xs text-gray-500">
                      Log a new item in the system
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      Invite Staff
                    </p>
                    <p className="text-xs text-gray-500">
                      Add members to your team
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      Generate Report
                    </p>
                    <p className="text-xs text-gray-500">
                      Download weekly summary
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
