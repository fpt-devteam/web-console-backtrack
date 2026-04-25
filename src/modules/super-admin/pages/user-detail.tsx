import { Layout } from '../components/layout';
import { useRouter, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import type { QrPlanStatus } from '@/mock/data/mock-super-admin-users';
import { ArrowLeft, CheckCircle2, Calendar, Phone, Mail, User2 } from 'lucide-react';
import { useAdminUserDetail } from '@/hooks/use-admin-users';
import type {
  AdminPaymentHistoryItem,
  AdminSubscriptionResult,
  AdminSubscriptionStatus,
} from '@/types/admin-user.types';
import { isAxiosError } from 'axios';

function displayName(basic: { displayName?: string | null; email?: string | null }): string {
  return (basic.displayName || basic.email || 'Unknown').trim();
}

function subscriptionStatusToQrPlanStatus(s: AdminSubscriptionStatus): QrPlanStatus {
  switch (s) {
    case 'Active':
      return 'Active';
    case 'PastDue':
    case 'Unpaid':
      return 'Payment Due';
    case 'Canceled':
    case 'IncompleteExpired':
      return 'Expired';
    default:
      return 'Suspended';
  }
}

function getQrPlanStatusColor(status: QrPlanStatus) {
  switch (status) {
    case 'Active':
      return 'text-[#06c167]';
    case 'Payment Due':
      return 'text-[#c97a00]';
    case 'Suspended':
      return 'text-[#c13515]';
    case 'Expired':
      return 'text-[#929292]';
    default:
      return 'text-[#929292]';
  }
}

function paymentStatusLabel(s: AdminPaymentHistoryItem['status']): string {
  switch (s) {
    case 'Succeeded':
      return 'Paid';
    case 'Pending':
      return 'Pending';
    case 'Failed':
      return 'Failed';
    default:
      return s;
  }
}

function planDescription(sub: AdminSubscriptionResult): string {
  const f = sub.planSnapshot.features ?? [];
  if (f.length === 0) return '—';
  return f.slice(0, 4).join(' · ');
}

function SubscriptionSummaryCard({
  sub,
  qrTotal,
  formatDate,
}: {
  sub: AdminSubscriptionResult;
  qrTotal: number;
  formatDate: (iso: string) => string;
}) {
  const planStatus = subscriptionStatusToQrPlanStatus(sub.status);
  const period: 'month' | 'year' = sub.planSnapshot.billingInterval === 'Yearly' ? 'year' : 'month';
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-[#6a6a6a] mb-1">CURRENT TIER</p>
        <p className="text-xl font-bold text-[#222222]">{sub.planSnapshot.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 className={`w-5 h-5 ${getQrPlanStatusColor(planStatus)}`} />
        <span className={`font-medium ${getQrPlanStatusColor(planStatus)}`}>{planStatus}</span>
      </div>
      <div className="flex items-center gap-2 text-[#6a6a6a]">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">Renewal: {formatDate(sub.currentPeriodEnd)}</span>
      </div>
      <div className="pt-2 border-t border-[#dddddd]">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6a6a6a]">
          <div>
            Billing: <span className="font-medium text-[#222222]">{sub.planSnapshot.billingInterval}</span>
          </div>
          <div>
            Price:{' '}
            <span className="font-medium text-[#222222]">
              {sub.planSnapshot.currency} {Number(sub.planSnapshot.price).toFixed(2)}
            </span>
            /{period}
          </div>
          <div>
            QR codes (user): <span className="font-medium text-[#222222]">{qrTotal}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-[#6a6a6a] pt-2 border-t border-[#dddddd]">{planDescription(sub)}</p>
    </div>
  );
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

        <div className="mb-6 bg-[#fff8e6] border border-[#c97a00]/20 rounded-lg p-4">
          <p className="text-sm text-[#c97a00]">
            <strong>Admin Data View:</strong> You are viewing user-level profile and QR service consumption to support account governance and plan monitoring.
          </p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#222222] mb-2">Department</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929292]">
                    <User2 className="w-4 h-4" />
                  </span>
                  <div className="w-full pl-12 pr-4 py-2 border border-[#dddddd] rounded-lg bg-[#f7f7f7] text-[#222222]">
                    —
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
            <div className="space-y-4">
              {sub ? (
                <SubscriptionSummaryCard sub={sub} qrTotal={data.qrUsage.totalQrCodes} formatDate={formatDate} />
              ) : (
                <>
                  <p className="text-sm text-[#6a6a6a] mb-1">SUBSCRIPTION</p>
                  <p className="text-[#222222] font-medium">No active subscription</p>
                  <p className="text-sm text-[#6a6a6a] pt-2">
                    Total QR codes (user):{' '}
                    <span className="font-medium text-[#222222]">{data.qrUsage.totalQrCodes}</span>
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
            {data.billingHistory && data.billingHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[420px] w-full text-sm">
                  <thead>
                    <tr className="bg-[#f7f7f7] text-left text-[#6a6a6a] uppercase text-xs font-bold tracking-wider border-b border-[#dddddd]">
                      <th className="font-medium py-2 ps-2">Invoice</th>
                      <th className="font-medium py-2 ps-2">Date</th>
                      <th className="font-medium py-2 ps-2">Amount</th>
                      <th className="font-medium py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.billingHistory.slice(0, 6).map((invoice) => (
                      <tr key={invoice.id} className="border-t border-[#dddddd]">
                        <td className="py-3 pr-4 text-[#6a6a6a]">{invoice.providerInvoiceId}</td>
                        <td className="py-3 pr-4 text-[#6a6a6a]">{formatDate(invoice.paymentDate)}</td>
                        <td className="py-3 pr-4 text-[#6a6a6a]">
                          {invoice.amount.toFixed(2)} {invoice.currency}
                        </td>
                        <td className="py-3 text-[#6a6a6a]">{paymentStatusLabel(invoice.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-[#929292]">No billing history available.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
