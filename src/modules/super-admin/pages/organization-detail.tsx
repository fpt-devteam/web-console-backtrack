import { Layout } from '../components/layout';
import { useRouter, useParams } from '@tanstack/react-router';
import { Calendar, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrgLogo } from '@/components/org-logo';
import { useSuperAdminOrgDetail } from '@/hooks/use-super-admin';

const WORKSPACE_BASE_URL =
  (import.meta.env.VITE_WORKSPACE_BASE_URL as string | undefined) ??
  'https://thebacktrack.vercel.app/organizations/';

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

  const { data, isLoading, isError, error } = useSuperAdminOrgDetail(tenantId, { billingPage: 1, billingPageSize: 20 })

  const org = data?.basicInfo
  const sub = data?.subscription

  const tenant: any = org
    ? {
        id: org.id,
        name: org.name,
        slug: org.slug,
        logoUrl: org.logoUrl ?? null,
        status: org.status,
        industryType: org.industryType,
        taxIdentificationNumber: org.taxIdentificationNumber,
        displayAddress: org.displayAddress,
        phone: org.phone,
        contactEmail: org.contactEmail ?? null,
        subscriptionPlan: sub
          ? {
              tier: sub.planSnapshot.name,
              status: sub.status,
              renewalDate: new Date(sub.currentPeriodEnd),
              billingCycle: sub.planSnapshot.billingInterval,
              price: { amount: sub.planSnapshot.price, period: sub.planSnapshot.billingInterval === 'Yearly' ? 'yr' : 'mo' },
              quotasSummary: undefined,
              description: (sub.planSnapshot.features ?? []).join(', '),
              includedFeatures: sub.planSnapshot.features ?? [],
            }
          : {
              tier: 'Free',
              status: 'Active',
              renewalDate: null,
              billingCycle: '—',
              price: null,
              quotasSummary: undefined,
              description: 'Default free plan (no billing)',
              includedFeatures: [],
            },
        usageOverview: undefined,
        billingHistory: (data?.billingHistory ?? []).map((p) => ({
          id: p.providerInvoiceId || p.id,
          invoiceDate: new Date(p.paymentDate),
          amount: Number(p.amount),
          currency: p.currency,
          status: p.status,
          invoiceUrl: p.invoiceUrl ?? null,
          planName: p.planName ?? null,
        })),
        members: [],
      }
    : null

  const industryLabel = tenant?.industryType ? (INDUSTRY_OPTIONS[tenant.industryType] ?? tenant.industryType) : null;
  const taxId = tenant?.taxIdentificationNumber ?? null;

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

  const getPaymentStatusBadgeClass = (status: string | null | undefined) => {
    const s = (status ?? '').toLowerCase();
    if (s.includes('succeed') || s === 'paid' || s === 'success' || s === 'successful') {
      return 'bg-[#e8f9f0] text-[#06c167] border-[#06c167]/20';
    }
    if (s.includes('fail') || s.includes('error') || s.includes('cancel') || s.includes('void')) {
      return 'bg-[#ffefef] text-[#c13515] border-[#c13515]/20';
    }
    if (s.includes('due') || s.includes('unpaid') || s.includes('pastdue') || s.includes('pending')) {
      return 'bg-[#fff8e6] text-[#c97a00] border-[#c97a00]/20';
    }
    return 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]';
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

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8 bg-[#f7f7f7] min-h-screen">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 text-center text-[#6a6a6a]">
            Loading...
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="p-8 bg-[#f7f7f7] min-h-screen">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 text-center">
            <h2 className="text-2xl font-bold text-[#222222] mb-2">Failed to load organization</h2>
            <p className="text-[#6a6a6a] mb-6">{error instanceof Error ? error.message : 'Please try again.'}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organizations
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle tenant not found
  if (!tenant) {
    return (
      <Layout>
        <div className="p-8 bg-[#f7f7f7] min-h-screen">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 text-center">
            <h2 className="text-2xl font-bold text-[#222222] mb-2">Organization Not Found</h2>
            <p className="text-[#6a6a6a] mb-6">The requested organization could not be found.</p>
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
        {/* Breadcrumbs + Back */}
        <div className="mb-6 flex items-center justify-between gap-4">
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

        {/* Organization Information (Org Admin card style) */}
        <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 mb-6">
          <div className="space-y-6">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              {tenant.logoUrl ? (
                <OrgLogo logoUrl={tenant.logoUrl} alt={tenant.name} className="h-16 w-16" iconClassName="h-8 w-8" rounded="lg" />
              ) : (
                <div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-[#f7f7f7] text-lg font-semibold text-[#6a6a6a]"
                >
                  {tenant.name?.slice(0, 1)?.toUpperCase() ?? 'O'}
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
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Workspace URL <span className="text-[#c13515]">*</span>
              </label>
              <div className="flex w-full overflow-hidden rounded-lg border border-[#dddddd] bg-[#f7f7f7]">
                <div className="px-4 py-2 text-[#6a6a6a] whitespace-nowrap">
                  {WORKSPACE_BASE_URL}
                </div>
                <div className="h-auto w-px bg-[#dddddd]" />
                <input
                  value={tenant.slug || ''}
                  readOnly
                  className="min-w-0 flex-1 bg-transparent px-4 py-2 text-[#222222] outline-none"
                  placeholder="org-slug"
                />
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
              <label className="block text-sm font-medium text-[#222222] mb-2">Contact Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929292]">
                  <Mail className="w-4 h-4" />
                </span>
                <div className="w-full pl-12 pr-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                  {tenant.contactEmail || '—'}
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
        <div className={`grid grid-cols-1 ${tenant.usageOverview ? 'lg:grid-cols-2' : ''} gap-6`}>
          {/* Subscription Plan Card */}
          {tenant.subscriptionPlan && (
            <div className={`bg-white rounded-[14px] border border-[#dddddd] p-6 ${tenant.usageOverview ? '' : 'lg:col-span-2'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#929292]">
                    Subscription
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#222222] truncate">
                      {tenant.subscriptionPlan.tier}
                    </h2>
                    <span
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
                        tenant.subscriptionPlan.status === 'Active'
                          ? 'bg-[#e8f9f0] text-[#06c167] border-[#06c167]/20'
                          : tenant.subscriptionPlan.status === 'PastDue' || tenant.subscriptionPlan.status === 'Unpaid'
                            ? 'bg-[#fff8e6] text-[#c97a00] border-[#c97a00]/20'
                            : 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]',
                      ].join(' ')}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {tenant.subscriptionPlan.status}
                    </span>
                  </div>
                </div>

                <div
                  className={[
                    'shrink-0 rounded-[12px] border px-3 py-2 text-right',
                    'bg-[#f7f7f7] border-[#ebebeb]',
                  ].join(' ')}
                >
                  <div className="text-sm font-semibold text-[#222222] whitespace-nowrap">
                    <span className="text-[#6a6a6a] font-medium">Price:</span>{' '}
                    {tenant.subscriptionPlan.price
                      ? `${tenant.subscriptionPlan.price.amount.toFixed(2)}${tenant.subscriptionPlan.price?.period ? `/${tenant.subscriptionPlan.price.period}` : ''}`
                      : 'Free'}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-[12px] border border-[#ebebeb] bg-white px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#929292]">
                    Billing cycle
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#222222]">
                    {tenant.subscriptionPlan.billingCycle || '—'}
                  </div>
                </div>
                <div className="rounded-[12px] border border-[#ebebeb] bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#929292]">
                      Renewal
                    </div>
                    <Calendar className="w-4 h-4 text-[#929292]" />
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#222222]">
                    {tenant.subscriptionPlan.renewalDate ? formatDate(tenant.subscriptionPlan.renewalDate) : '—'}
                  </div>
                </div>
              </div>

              {tenant.subscriptionPlan.includedFeatures?.length ? (
                <div className="mt-4 pt-4 border-t border-[#ebebeb]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#929292] mb-2">
                    Included features
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tenant.subscriptionPlan.includedFeatures.slice(0, 8).map((f: any) => (
                      <span
                        key={String(f)}
                        className="inline-flex items-center rounded-full border border-[#dddddd] bg-[#f7f7f7] px-3 py-1 text-xs font-medium text-[#222222]"
                      >
                        {String(f)}
                      </span>
                    ))}
                    {tenant.subscriptionPlan.includedFeatures.length > 8 ? (
                      <span className="inline-flex items-center rounded-full border border-[#dddddd] bg-white px-3 py-1 text-xs font-medium text-[#6a6a6a]">
                        +{tenant.subscriptionPlan.includedFeatures.length - 8} more
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : tenant.subscriptionPlan.description ? (
                <p className="mt-4 pt-4 border-t border-[#ebebeb] text-sm text-[#6a6a6a]">
                  {tenant.subscriptionPlan.description}
                </p>
              ) : null}
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
                {tenant.billingHistory && tenant.billingHistory.length > 0 ? (
                  tenant.billingHistory.slice(0, 6).map((inv: any) => (
                    <tr key={inv.id} className="border-t border-[#dddddd]">
                      <td className="py-3 pr-4 text-[#6a6a6a]">
                        {inv.invoiceUrl ? (
                          <a className="text-[#ff385c] hover:text-[#e00b41]" href={inv.invoiceUrl} target="_blank" rel="noreferrer">
                            {inv.id}
                          </a>
                        ) : (
                          inv.id
                        )}
                      </td>
                      <td className="py-3 pr-4 text-[#6a6a6a]">{formatDate(inv.invoiceDate)}</td>
                      <td className="py-3 pr-4 text-[#6a6a6a]">{inv.amount.toFixed(2)} {inv.currency}</td>
                      <td className="py-3">
                        <span
                          className={[
                            'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
                            getPaymentStatusBadgeClass(inv.status),
                          ].join(' ')}
                        >
                          {inv.status ?? '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-[#dddddd]">
                    <td className="py-8 text-center text-[#929292]" colSpan={4}>
                      No billing records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
                  {tenant.members.slice(0, 6).map((m: any) => (
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

        <div className="mt-4 me-4 flex justify-end">
          <Button
            onClick={handleBack}
            className="bg-[#ff385c] text-white border border-transparent hover:bg-white hover:text-[#ff385c] hover:border-[#ff385c] transition-colors"
          >
            
            Back
          </Button>
        </div>
      </div>
    </Layout>
  );
}
