import { Layout } from '../components/layout';
import { useRouter, useParams } from '@tanstack/react-router';
import { mockTenants } from '@/mock/data/mock-tenants';
import { CheckCircle2, Calendar, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrgLogo } from '@/components/org-logo';

const INDUSTRY_OPTIONS: Record<string, string> = {
  technology: 'Technology & Software',
  healthcare: 'Healthcare',
  finance: 'Finance & Banking',
  retail: 'Retail & E-commerce',
  education: 'Education',
  manufacturing: 'Manufacturing',
  hospitality: 'Hospitality & Tourism',
  airport: 'Airport',
  hotel: 'Hotel',
  university: 'University',
  mall: 'Shopping Mall',
  stadium: 'Stadium/Arena',
  transportation: 'Transportation Hub',
  other: 'Other',
};

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
  const industryLabel = tenant?.industryType ? (INDUSTRY_OPTIONS[tenant.industryType] ?? tenant.industryType) : null;
  const taxId = tenant?.taxIdentificationNumber ?? tenant?.taxId;

  /**
   * Handles navigation back to organization list
   */
  const handleBack = () => {
    router.navigate({ to: '/super-admin/organization' });
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
        return 'bg-[#e8f9f0] text-[#06c167] border-[#06c167]/20';
      case 'Pending':
        return 'bg-[#fff8e6] text-[#c97a00] border-[#c97a00]/20';
      case 'Inactive':
        return 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]';
      default:
        return 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]';
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
        return 'text-[#06c167]';
      case 'Payment Due':
        return 'text-[#c97a00]';
      case 'Suspended':
        return 'text-[#c13515]';
      case 'Cancelled':
        return 'text-[#6a6a6a]';
      default:
        return 'text-[#6a6a6a]';
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
          dot: 'bg-[#06c167]',
          text: 'text-[#06c167]',
        };
      case 'Degraded':
        return {
          dot: 'bg-[#c97a00]',
          text: 'text-[#c97a00]',
        };
      case 'Down':
        return {
          dot: 'bg-[#c13515]',
          text: 'text-[#c13515]',
        };
      case 'Maintenance':
        return {
          dot: 'bg-[#ff385c]',
          text: 'text-[#ff385c]',
        };
      default:
        return {
          dot: 'bg-[#929292]',
          text: 'text-[#6a6a6a]',
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
        <div className="p-8 bg-[#f7f7f7] min-h-screen">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 text-center">
            <h2 className="text-2xl font-bold text-[#222222] mb-2">Tenant Not Found</h2>
            <p className="text-[#6a6a6a] mb-6">The requested tenant could not be found.</p>
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
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-[#929292]">
            <button
              onClick={handleBack}
              className="hover:text-[#6a6a6a] cursor-pointer"
            >
              Organization
            </button>
            <span className="mx-2">/</span>
            <span className="text-[#222222] font-medium">{tenant.name}</span>
          </nav>
        </div>

        {/* Public Data View Banner */}
        <div className="mb-6 bg-[#fff8e6] border border-[#c97a00]/20 rounded-lg p-4">
          <p className="text-sm text-[#c97a00]">
            <strong>Public Data View:</strong> You are viewing restricted public data for this organization.
            Sensitive tenant details like admin contacts and recent activity logs are hidden for data protection compliance.
          </p>
        </div>

        {/* Organization Information (Org Admin card style) */}
        <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 mb-6">
          <div className="space-y-6">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              {tenant.logoUrl ? (
                <OrgLogo logoUrl={tenant.logoUrl} alt={tenant.name} className="h-16 w-16" iconClassName="h-8 w-8" rounded="lg" />
              ) : (
                <div
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg text-lg font-semibold text-[#6a6a6a] ${tenant.avatarColor}`}
                >
                  {tenant.avatarText}
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-[#222222]">{tenant.name}</h1>
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusBadgeClass(
                    tenant.status
                  )}`}
                >
                  {tenant.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">Organization Name</label>
                <div className="w-full px-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                  {tenant.name || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">Industry Type</label>
                <div className="w-full px-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                  {industryLabel || '—'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">Workspace URL (slug)</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                  {tenant.slug || '—'}
                </div>
                <span className="text-sm text-[#929292]">.backtrack.com</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929292]">
                  <Phone className="w-4 h-4" />
                </span>
                <div className="w-full pl-12 pr-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                  {tenant.phone || '—'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Address <span className="text-[#929292] font-normal">(Optional)</span>
              </label>
              <div className="w-full px-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222] min-h-[100px] whitespace-pre-wrap">
                {tenant.displayAddress?.trim() || '—'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Tax Identification Number
              </label>
              <div className="w-full px-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#929292]">
                {taxId ?? '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Plan Card */}
          {tenant.subscriptionPlan && (
            <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
              <h2 className="text-lg font-semibold text-[#222222] mb-4">Subscription Plan</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#6a6a6a] mb-1">CURRENT TIER</p>
                  <p className="text-xl font-bold text-[#222222]">
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
                <div className="flex items-center gap-2 text-[#6a6a6a]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Renewal: {formatDate(tenant.subscriptionPlan.renewalDate)}
                  </span>
                </div>

                {(tenant.subscriptionPlan.billingCycle || tenant.subscriptionPlan.price || tenant.subscriptionPlan.quotasSummary) && (
                  <div className="pt-2 border-t border-[#dddddd]">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6a6a6a]">
                      {tenant.subscriptionPlan.billingCycle && (
                        <div>Billing: <span className="font-medium text-[#222222]">{tenant.subscriptionPlan.billingCycle}</span></div>
                      )}
                      {tenant.subscriptionPlan.price && (
                        <div>
                          Price: <span className="font-medium text-[#222222]">${tenant.subscriptionPlan.price.amount.toFixed(2)}</span>/{tenant.subscriptionPlan.price.period}
                        </div>
                      )}
                      {tenant.subscriptionPlan.quotasSummary && (
                        <div>
                          Limits: <span className="font-medium text-[#222222]">{tenant.subscriptionPlan.quotasSummary.activeUsersLimit} users</span> / <span className="font-medium text-[#222222]">{tenant.subscriptionPlan.quotasSummary.storageLimitGB}GB</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-sm text-[#6a6a6a] pt-2 border-t border-[#dddddd]">
                  {tenant.subscriptionPlan.description}
                </p>
              </div>
            </div>
          )}

          {/* Usage Overview Card */}
          {tenant.usageOverview && (
            <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
              {tenant.subscriptionPlan?.includedFeatures?.length ? (
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[#222222]">Plan Features</h2>
                    <p className="text-sm text-[#929292] mt-1">This subscription includes: {tenant.subscriptionPlan.includedFeatures.join(', ')}.</p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* System Status */}
                <div className="md:col-span-2 rounded-lg border border-[#dddddd] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                      <span className="text-sm font-medium text-[#222222]">System Status</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#f7f7f7] border border-[#dddddd] ${statusStyle.text}`}
                    >
                      {tenant.usageOverview.systemStatus}
                    </span>
                  </div>

                  {/* Organization limits details */}
                  <div className="mt-5 pt-5 border-t border-[#dddddd]">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-[#222222]">Org Usage Limits</p>
                      <p className="text-xs text-[#929292]">Staff + storage capacity</p>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-sm font-medium text-[#222222]">Active Users</span>
                          <span className="text-sm font-semibold text-[#222222]">
                            {tenant.usageOverview.activeUsers.current} / {tenant.usageOverview.activeUsers.limit}
                          </span>
                        </div>
                        <div className="h-2 bg-[#f7f7f7] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#ff385c] rounded-full transition-all"
                            style={{
                              width: `${calculateProgress(
                                tenant.usageOverview.activeUsers.current,
                                tenant.usageOverview.activeUsers.limit
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-sm font-medium text-[#222222]">Storage Used</span>
                          <span className="text-sm font-semibold text-[#222222]">
                            {formatStorage(tenant.usageOverview.storageUsed.current)} / {formatStorage(tenant.usageOverview.storageUsed.limit)}
                          </span>
                        </div>
                        <div className="h-2 bg-[#f7f7f7] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6a6a6a] rounded-full transition-all"
                            style={{
                              width: `${calculateProgress(
                                tenant.usageOverview.storageUsed.current,
                                tenant.usageOverview.storageUsed.limit
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {tenant.billingHistory && tenant.billingHistory.length > 0 && (
          <div className="mt-6 bg-white rounded-[14px] border border-[#dddddd] p-6">
            <h2 className="text-lg font-semibold text-[#222222] mb-4">Billing History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm">
                <thead>
                  <tr className="bg-[#f7f7f7] text-left text-[#6a6a6a] uppercase text-xs font-bold tracking-wider border-b border-[#dddddd]">
                    <th className="font-medium py-2 ps-2">Invoice</th>
                    <th className="font-medium py-2 ps-2">Date</th>
                    <th className="font-medium py-2 ps-2">Amount</th>
                    <th className="font-medium py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tenant.billingHistory.slice(0, 6).map((inv) => (
                    <tr key={inv.id} className="border-t border-[#dddddd]">
                      <td className="py-3 pr-4 text-[#6a6a6a]">{inv.id}</td>
                      <td className="py-3 pr-4 text-[#6a6a6a]">{formatDate(inv.invoiceDate)}</td>
                      <td className="py-3 pr-4 text-[#6a6a6a]">${inv.amount.toFixed(2)} {inv.currency}</td>
                      <td className="py-3 text-[#6a6a6a]">{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tenant.members && tenant.members.length > 0 && (
          <div className="mt-6 bg-white rounded-[14px] border border-[#dddddd] p-6">
            <h2 className="text-lg font-semibold text-[#222222] mb-4">Members</h2>
            <div className="overflow-x-auto">
              <table className="min-w-[750px] w-full text-sm">
                <thead>
                  <tr className="bg-[#f7f7f7] text-left text-[#6a6a6a] uppercase text-xs font-bold tracking-wider border-b border-[#dddddd]">
                    <th className="font-medium py-2 ps-2">Name</th>
                    <th className="font-medium py-2 ps-2">Email</th>
                    <th className="font-medium py-2 ps-2">Role</th>
                    <th className="font-medium py-2 ps-2">Status</th>
                    <th className="font-medium py-2">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {tenant.members.slice(0, 6).map((m) => (
                    <tr key={m.id} className="border-t border-[#dddddd]">
                      <td className="py-3 pr-4 text-[#6a6a6a]">{m.name}</td>
                      <td className="py-3 pr-4 text-[#6a6a6a]">{m.email}</td>
                      <td className="py-3 pr-4 text-[#6a6a6a]">{m.role}</td>
                      <td className="py-3 pr-4 text-[#6a6a6a]">{m.status}</td>
                      <td className="py-3 text-[#6a6a6a]">
                        {formatDate(m.lastActiveAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
