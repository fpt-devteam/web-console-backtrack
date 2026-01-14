import { Layout } from '../../components/admin/layout';
import { Users, Package, TrendingUp, Plus, UserPlus, Download, CheckCircle } from 'lucide-react';
import { 
  mockDashboardStats, 
  mockItemStatusData, 
  mockRecentActivity, 
  mockStoragePlan 
} from '@/mock/data/mock-admin-dashboard';

export function AdminDashboardPage() {
  const stats = mockDashboardStats;
  const itemStatus = mockItemStatusData;
  const activities = mockRecentActivity;
  const storage = mockStoragePlan;

  // Calculate percentages for bar chart
  const total = itemStatus.found + itemStatus.returned;
  const foundPercent = (itemStatus.found / total) * 100;
  const returnedPercent = (itemStatus.returned / total) * 100;
  const storagePercent = (storage.used / storage.total) * 100;

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, here's an overview of your organization.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Staff */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Active Staff</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">{stats.activeStaff.count}</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">{stats.activeStaff.change}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Active Items</span>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">{stats.activeItems.count}</div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">{stats.activeItems.description}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Return Rate */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Return Rate</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">{stats.returnRate.percentage}%</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">{stats.returnRate.change}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Item Status & Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Item Status Distribution</h2>
                <span className="text-sm text-gray-500">Last 30 Days</span>
              </div>

              {/* Bar Chart */}
              <div className="space-y-4">
                {/* Found Bar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Found</span>
                    <span className="text-sm font-semibold text-gray-900">{itemStatus.found}</span>
                  </div>
                  <div className="h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg transition-all duration-500"
                      style={{ width: `${foundPercent}%` }}
                    />
                  </div>
                </div>

                {/* Returned Bar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Returned</span>
                    <span className="text-sm font-semibold text-gray-900">{itemStatus.returned}</span>
                  </div>
                  <div className="h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-lg transition-all duration-500"
                      style={{ width: `${returnedPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'found' ? 'bg-blue-100' :
                      activity.type === 'staff' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Storage */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Add Found Item</p>
                    <p className="text-xs text-gray-500">Log a new item in the system</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <UserPlus className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Invite Staff</p>
                    <p className="text-xs text-gray-500">Add members to your team</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Generate Report</p>
                    <p className="text-xs text-gray-500">Download weekly summary</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Storage Plan */}
            <div className="bg-black rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between ">
                <h3 className="text-lg font-bold">Storage Plan</h3>
                <span className="px-3 py-1 bg-green-400 text-white text-xs font-semibold rounded-lg">
                  {storage.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-4">{storage.name}</p>
              
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-300">Storage Used</span>
                  <span className="font-semibold">{storage.used} / {storage.total} items</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </div>

              <button className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

