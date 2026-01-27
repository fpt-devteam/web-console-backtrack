import { Layout } from '../components/layout';
import { useRouter, useParams } from '@tanstack/react-router';
import { mockTenants } from '@/mock/data/mock-tenants';
import { CheckCircle2, Calendar, Share2, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Organization Detail Page
 * 
 * Displays comprehensive information about a specific tenant organization,
 * including subscription plan, usage statistics, and enabled modules.
 * 
 * Features:
 * - Organization header with status and basic info
 * - Public data view banner (for restricted data viewing)
 * - Subscription plan details with renewal date
 * - Usage overview with progress bars
 * - Enabled modules display
 */
export function OrganizationDetailPage() {
  const router = useRouter();
  const { tenantId } = useParams({ from: '/super-admin/organization/$tenantId' });
  
  // Find tenant by ID
  const tenant = mockTenants.find(t => t.id === tenantId);

  /**
   * Handles navigation back to organization list
   */
  const handleBack = () => {
    router.navigate({ to: '/super-admin/organization' });
  };

  /**
   * Handles share public profile action
   */
  const handleShareProfile = () => {
    // TODO: Implement share functionality
    console.log('Share profile:', tenantId);
  };

  /**
   * Handles manage plan action
   */
  const handleManagePlan = () => {
    // TODO: Implement plan management
    console.log('Manage plan:', tenantId);
  };

  /**
   * Gets status badge color based on tenant status
   * 
   * @param status - Tenant status
   * @returns CSS classes for status badge
   */
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  /**
   * Gets subscription status color
   * 
   * @param status - Subscription status
   * @returns CSS classes for status indicator
   */
  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'Good Standing':
        return 'text-green-600';
      case 'Payment Due':
        return 'text-orange-600';
      case 'Suspended':
        return 'text-red-600';
      case 'Cancelled':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  /**
   * Gets system status color and dot
   * 
   * @param status - System status
   * @returns Object with color classes and dot color
   */
  const getSystemStatusStyle = (status: string) => {
    switch (status) {
      case 'Operational':
        return {
          dot: 'bg-green-500',
          text: 'text-green-700',
        };
      case 'Degraded':
        return {
          dot: 'bg-yellow-500',
          text: 'text-yellow-700',
        };
      case 'Down':
        return {
          dot: 'bg-red-500',
          text: 'text-red-700',
        };
      case 'Maintenance':
        return {
          dot: 'bg-blue-500',
          text: 'text-blue-700',
        };
      default:
        return {
          dot: 'bg-gray-400',
          text: 'text-gray-700',
        };
    }
  };

  /**
   * Formats date to readable string
   * 
   * @param date - Date to format
   * @returns Formatted date string (e.g., "Dec 31, 2024")
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Calculates progress percentage
   * 
   * @param current - Current value
   * @param limit - Maximum value
   * @returns Percentage (0-100)
   */
  const calculateProgress = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  /**
   * Formats storage size
   * 
   * @param gb - Size in GB
   * @returns Formatted string (e.g., "45GB" or "1TB")
   */
  const formatStorage = (gb: number) => {
    if (gb >= 1024) {
      return `${(gb / 1024).toFixed(1)}TB`;
    }
    return `${gb}GB`;
  };

  // Handle tenant not found
  if (!tenant) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tenant Not Found</h2>
            <p className="text-gray-600 mb-6">The requested tenant could not be found.</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organizations
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusStyle = getSystemStatusStyle(tenant.usageOverview?.systemStatus || 'Operational');

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <button
              onClick={handleBack}
              className="hover:text-gray-700 cursor-pointer"
            >
              Organization
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{tenant.name}</span>
          </nav>
        </div>

        {/* Public Data View Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Public Data View:</strong> You are viewing restricted public data for this organization. 
            Sensitive tenant details like admin contacts and recent activity logs are hidden for data protection compliance.
          </p>
        </div>

        {/* Organization Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(
                    tenant.status
                  )}`}
                >
                  {tenant.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">{tenant.subdomain}</p>
                {tenant.taxId && (
                  <p className="text-gray-600">Tax Identification Number: {tenant.taxId}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleShareProfile}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Public Profile
              </Button>
              <Button
                onClick={handleManagePlan}
                variant="default"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Plan Card */}
          {tenant.subscriptionPlan && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">CURRENT TIER</p>
                  <p className="text-xl font-bold text-gray-900">
                    {tenant.subscriptionPlan.tier}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-5 h-5 ${getSubscriptionStatusColor(tenant.subscriptionPlan.status)}`}
                  />
                  <span className={`font-medium ${getSubscriptionStatusColor(tenant.subscriptionPlan.status)}`}>
                    {tenant.subscriptionPlan.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Renewal: {formatDate(tenant.subscriptionPlan.renewalDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                  {tenant.subscriptionPlan.description}
                </p>
              </div>
            </div>
          )}

          {/* Usage Overview Card */}
          {tenant.usageOverview && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h2>
              <div className="space-y-6">
                {/* Active Users */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Active Users</span>
                    <span className="text-sm text-gray-600">
                      {tenant.usageOverview.activeUsers.current} / {tenant.usageOverview.activeUsers.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{
                        width: `${calculateProgress(
                          tenant.usageOverview.activeUsers.current,
                          tenant.usageOverview.activeUsers.limit
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Storage Used */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Storage Used</span>
                    <span className="text-sm text-gray-600">
                      {formatStorage(tenant.usageOverview.storageUsed.current)} /{' '}
                      {formatStorage(tenant.usageOverview.storageUsed.limit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all"
                      style={{
                        width: `${calculateProgress(
                          tenant.usageOverview.storageUsed.current,
                          tenant.usageOverview.storageUsed.limit
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* System Status */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">System Status:</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                    <span className={`text-sm font-medium ${statusStyle.text}`}>
                      {tenant.usageOverview.systemStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enabled Modules Card */}
        {tenant.enabledModules && tenant.enabledModules.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Enabled Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tenant.enabledModules.map((module) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{module.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{module.name}</p>
                      <p className="text-xs text-gray-500">
                        {module.enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

