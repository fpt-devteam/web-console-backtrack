import { Layout } from '../components/layout';
import { useRouter, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Phone, Mail } from 'lucide-react';
import { useAdminUserDetail } from '@/hooks/use-admin-users';
import type {
  AdminSubscriptionStatus,
} from '@/types/admin-user.types';
import { isAxiosError } from 'axios';

function displayName(basic: { displayName?: string | null; email?: string | null }): string {
  return (basic.displayName || basic.email || 'Unknown').trim();
}

function getSubscriptionStatusPillClass(status: AdminSubscriptionStatus | 'Free') {
  if (status === 'Active' || status === 'Free') {
    return 'bg-[#e8f9f0] text-[#06c167] border-[#06c167]/20';
  }
  if (status === 'PastDue' || status === 'Unpaid') {
    return 'bg-[#fff8e6] text-[#c97a00] border-[#c97a00]/20';
  }
  return 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]';
}

function getPaymentStatusBadgeClass(status: string | null | undefined) {
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
}

export function UserDetailPage() {
  const router = useRouter();
  const { userId } = useParams({ from: '/super-admin/users/$userId' });
  const { data, isLoading, isError, error } = useAdminUserDetail(userId);

  const handleBack = () => {
    router.navigate({ to: '/super-admin/users' });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getUserStatusBadgeClass = (status: string) => {
    if (status === 'Active') return 'bg-[#e8f9f0] text-[#06c167] border-[#06c167]/20';
    return 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]';
  };

  const notFound =
    isAxiosError(error) && error.response?.status === 404;

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8 bg-[#f7f7f7] min-h-screen flex items-center justify-center">
          <p className="text-[#6a6a6a]">Loading user…</p>
        </div>
      </Layout>
    );
  }

  if (isError && notFound) {
    return (
      <Layout>
        <div className="p-8 bg-[#f7f7f7] min-h-screen">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 text-center">
            <h2 className="text-2xl font-bold text-[#222222] mb-2">User Not Found</h2>
            <p className="text-[#6a6a6a] mb-6">The requested user could not be found.</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !data) {
    const msg = error instanceof Error ? error.message : 'Something went wrong';
    return (
      <Layout>
        <div className="p-8 bg-[#f7f7f7] min-h-screen">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-[#222222] mb-2">Could not load user</h2>
            <p className="text-[#6a6a6a] mb-6">{msg}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const user = data.basicInfo;
  const name = displayName(user);
  const sub = data.subscription;
  const plan = sub
    ? {
        tier: sub.planSnapshot.name,
        status: sub.status as AdminSubscriptionStatus | 'Free',
        renewalIso: sub.currentPeriodEnd,
        billingCycle: sub.planSnapshot.billingInterval,
        price: { amount: sub.planSnapshot.price, currency: sub.planSnapshot.currency, period: sub.planSnapshot.billingInterval === 'Yearly' ? 'yr' : 'mo' },
        includedFeatures: sub.planSnapshot.features ?? [],
      }
    : {
        tier: 'Free',
        status: 'Free' as const,
        renewalIso: null as string | null,
        billingCycle: '—',
        price: null as null,
        includedFeatures: [] as string[],
      };

  return (
    <Layout>
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        <div className="mb-6">
          <nav className="text-sm text-[#929292]">
            <button type="button" onClick={handleBack} className="hover:text-[#6a6a6a] cursor-pointer">
              User Management
            </button>
            <span className="mx-2">/</span>
            <span className="text-[#222222] font-medium">{name}</span>
          </nav>
        </div>

        <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 mb-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-[#222222]">{name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getUserStatusBadgeClass(user.status)}`}
              >
                {user.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">Full Name</label>
                <div className="w-full px-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                  {name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">Global role</label>
                <div className="w-full px-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                  {user.globalRole === 'PlatformSuperAdmin' ? 'Super Admin' : 'User'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929292]">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div className="w-full pl-12 pr-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                    {user.email ?? '—'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929292]">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div className="w-full pl-12 pr-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                    {user.phone ?? '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#929292]">
                  Subscription
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#222222] truncate">
                    {plan.tier}
                  </h2>
                  <span
                    className={[
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
                      getSubscriptionStatusPillClass(plan.status),
                    ].join(' ')}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {plan.status === 'Free' ? 'Active' : plan.status}
                  </span>
                </div>
              </div>

              <div className="shrink-0 rounded-[12px] border border-[#ebebeb] bg-[#f7f7f7] px-3 py-2 text-right">
                <div className="text-sm font-semibold text-[#222222] whitespace-nowrap">
                  <span className="text-[#6a6a6a] font-medium">Price:</span>{' '}
                  {plan.price
                    ? `${plan.price.amount.toFixed(2)}/${plan.price.period}`
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
                  {plan.billingCycle || '—'}
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
                  {plan.renewalIso ? formatDate(plan.renewalIso) : '—'}
                </div>
              </div>
            </div>

            {plan.includedFeatures?.length ? (
              <div className="mt-4 pt-4 border-t border-[#ebebeb]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#929292] mb-2">
                  Included features
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.includedFeatures.slice(0, 8).map((f) => (
                    <span
                      key={String(f)}
                      className="inline-flex items-center rounded-full border border-[#dddddd] bg-[#f7f7f7] px-3 py-1 text-xs font-medium text-[#222222]"
                    >
                      {String(f)}
                    </span>
                  ))}
                  {plan.includedFeatures.length > 8 ? (
                    <span className="inline-flex items-center rounded-full border border-[#dddddd] bg-white px-3 py-1 text-xs font-medium text-[#6a6a6a]">
                      +{plan.includedFeatures.length - 8} more
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
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
                  {data.billingHistory && data.billingHistory.length > 0 ? (
                    data.billingHistory.slice(0, 6).map((invoice) => (
                      <tr key={invoice.id} className="border-t border-[#dddddd]">
                        <td className="py-3 pr-4 text-[#6a6a6a]">
                          {invoice.invoiceUrl ? (
                            <a className="text-[#ff385c] hover:text-[#e00b41]" href={invoice.invoiceUrl} target="_blank" rel="noreferrer">
                              {invoice.providerInvoiceId}
                            </a>
                          ) : (
                            invoice.providerInvoiceId
                          )}
                        </td>
                        <td className="py-3 pr-4 text-[#6a6a6a]">{formatDate(invoice.paymentDate)}</td>
                        <td className="py-3 pr-4 text-[#6a6a6a]">
                          {invoice.amount.toFixed(2)} {invoice.currency}
                        </td>
                        <td className="py-3">
                          <span
                            className={[
                              'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
                              getPaymentStatusBadgeClass(invoice.status),
                            ].join(' ')}
                          >
                            {invoice.status ?? '—'}
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
        </div>

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
