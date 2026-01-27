import { Layout } from '../components/layout';
import { useState } from 'react';
import {
  Building2,
  AlertCircle,
  CheckCircle2,
  Activity,
  Bell,
  UserPlus,
  Settings,
  FileText,
  Download,
  TrendingUp,
  X,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

/**
 * Super Admin Dashboard Page
 * 
 * Main dashboard page for super admin with overview statistics,
 * charts, recent activity, and quick actions.
 */
export function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<'12months' | '6months' | '3months' | '1month'>('12months');

  // Mock data for New Organizations chart - 12 months
  const chartData12Months = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 135 },
    { month: 'Mar', value: 145 },
    { month: 'Apr', value: 160 },
    { month: 'May', value: 150 },
    { month: 'Jun', value: 170 },
    { month: 'Jul', value: 165 },
    { month: 'Aug', value: 175 },
    { month: 'Sep', value: 180 },
    { month: 'Oct', value: 185 },
    { month: 'Nov', value: 175 },
    { month: 'Dec', value: 190 },
  ];

  // Mock data for 6 months
  const chartData6Months = chartData12Months.slice(6);

  // Mock data for 3 months
  const chartData3Months = chartData12Months.slice(9);

  // Mock data for 1 month
  const chartData1Month = [chartData12Months[11]];

  const getChartData = () => {
    switch (timeFilter) {
      case '12months':
        return chartData12Months;
      case '6months':
        return chartData6Months;
      case '3months':
        return chartData3Months;
      case '1month':
        return chartData1Month;
      default:
        return chartData12Months;
    }
  };

  const getChartSubtitle = () => {
    switch (timeFilter) {
      case '12months':
        return 'Growth over the last 12 months';
      case '6months':
        return 'Growth over the last 6 months';
      case '3months':
        return 'Growth over the last 3 months';
      case '1month':
        return 'Growth in the last month';
      default:
        return 'Growth over the last 12 months';
    }
  };

  // Mock recent activity data
  const recentActivities = [
    {
      type: 'organization',
      title: 'New Organization Created',
      description: 'Stark Industries joined the platform.',
      time: '2 minutes ago',
    },
    {
      type: 'alert',
      title: 'System Alert',
      description: 'High latency detected in us-east-1 region.',
      time: '45 minutes ago',
    },
    {
      type: 'upgrade',
      title: 'Plan Upgrade',
      description: 'Acme Corp upgraded to Enterprise.',
      time: '3 hours ago',
    },
  ];

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Dashboard Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of system performance, tenants, and alerts.</p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: <span className="font-medium text-gray-700">Just now</span>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Organizations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +12.5%
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Active Organizations</h3>
            <p className="text-3xl font-bold text-gray-900">1,248</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Review All
              </button>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Pending Requests</h3>
            <p className="text-3xl font-bold text-gray-900">15</p>
          </div>

          {/* System Uptime */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Operational
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">System Uptime</h3>
            <p className="text-3xl font-bold text-gray-900">99.98%</p>
          </div>

          {/* API Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-gray-500">Avg Latency</div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">API Performance</h3>
            <p className="text-3xl font-bold text-gray-900">42ms</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* New Organizations Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">New Organizations</h2>
                <p className="text-sm text-gray-500">{getChartSubtitle()}</p>
              </div>
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="12months">12 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="3months">3 Months</option>
                  <option value="1month">1 Month</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    domain={[0, 200]}
                    ticks={[0, 50, 100, 150, 200]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'organization' ? 'bg-blue-100' :
                      activity.type === 'alert' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      {activity.type === 'organization' && (
                        <Building2 className={`w-4 h-4 ${
                          activity.type === 'organization' ? 'text-blue-600' :
                          activity.type === 'alert' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      )}
                      {activity.type === 'alert' && (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      {activity.type === 'upgrade' && (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm mb-1">
                        {activity.title}: {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Required and Quick Actions - Same Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Action Required Alert */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Action Required: 5 Pending Approvals
                </h3>
                <p className="text-gray-600 mb-4">
                  There are 5 new organization requests that have been pending for more than 24 hours. 
                  Please review them as soon as possible.
                </p>
                <div className="flex items-center gap-3">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">
                    Review Requests
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Invite Admin</span>
              </button>
              
              <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">System Config</span>
              </button>
              
              <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Audit Logs</span>
              </button>
              
              <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Download className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
