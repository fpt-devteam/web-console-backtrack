import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CreditCard,
  FileText,
  Loader2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { Layout } from '../../components/admin/layout';
import type { AdminPaymentHistoryItem, AdminSubscriptionResult } from '@/types/admin-user.types';
import { type PaymentMethod, mockPaymentMethod,  } from '@/mock/data';
import { showToast } from '@/lib/toast';
import { getPaymentMethod } from '@/mock/storage/account-storage';
import { subscriptionService } from '@/services/subscription.service';
import { useCurrentOrgId } from '@/contexts/current-org.context';

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function statusLabel(status: string) {
  if (status === 'Succeeded') return { label: 'Paid', cls: 'text-[#06c167] bg-[#e8f9f0]' };
  if (status === 'Pending') return { label: 'Pending', cls: 'text-[#c97a00] bg-[#fff8e6]' };
  return { label: status, cls: 'text-[#c13515] bg-[#fff0f2]' };
}

function subscriptionStatusBadge(status: string) {
  if (status === 'Active') return 'bg-[#e8f9f0] text-[#06c167]';
  if (status === 'PastDue' || status === 'Unpaid') return 'bg-[#fff8e6] text-[#c97a00]';
  return 'bg-[#fff0f2] text-[#c13515]';
}

export function PlanPage() {
  const { currentOrgId } = useCurrentOrgId();

  const [subscription, setSubscription] = useState<AdminSubscriptionResult | null>(null);
  const [payments, setPayments] = useState<Array<AdminPaymentHistoryItem>>([]);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(mockPaymentMethod);

  useEffect(() => {
    setPaymentMethod(getPaymentMethod(mockPaymentMethod));
  }, []);

  useEffect(() => {
    if (!currentOrgId) return;

    setIsLoadingSubscription(true);
    subscriptionService
      .getOrgSubscription(currentOrgId)
      .then(setSubscription)
      .catch(() => showToast.error('Failed to load subscription'))
      .finally(() => setIsLoadingSubscription(false));

    setIsLoadingPayments(true);
    subscriptionService
      .getOrgPaymentHistory(currentOrgId)
      .then(setPayments)
      .catch(() => showToast.error('Failed to load payment history'))
      .finally(() => setIsLoadingPayments(false));
  }, [currentOrgId]);

  const isFree = (subscription?.planSnapshot.price ?? 0) === 0;

  const handleDownloadInvoice = () => showToast.success('Invoice downloaded!');
  const handleCancelSubscription = () => showToast.error('Subscription cancellation requested.');

  return (
    <Layout>
      <div className="p-4 sm:p-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-1">Plan Management</h1>
          <p className="text-[#6a6a6a]">Manage your organization's subscription and billing details.</p>
        </div>

        <div className="space-y-6">
          {/* ── Top row: Plan card + Payment card ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Current Plan card */}
            <div className="lg:col-span-2 rounded-[16px] overflow-hidden border border-[#dddddd] bg-white">
              {/* Header */}
              <div className="px-6 py-6 border-b border-[#f0f0f0]">
                {isLoadingSubscription ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#6a6a6a]" />
                ) : !subscription ? (
                  <p className="font-semibold text-[#6a6a6a]">No active subscription</p>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${subscriptionStatusBadge(subscription.status)}`}>
                        {subscription.status.toUpperCase()}
                      </span>
                      <h2 className="text-2xl font-bold text-[#222222] leading-tight">{subscription.planSnapshot.name}</h2>
                      {!isFree && <p className="text-[#6a6a6a] text-sm mt-0.5">
                        Billed {subscription.planSnapshot.billingInterval.toLowerCase()}
                      </p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-4xl font-bold text-[#222222]">
                        ${subscription.planSnapshot.price}
                      </div>
                      <div className="text-[#6a6a6a] text-sm">
                        /{subscription.planSnapshot.billingInterval === 'Monthly' ? 'month' : 'year'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Details below header */}
              {subscription && (
                <div className="px-6 py-5 space-y-4">
                  {/* Renewal date — paid plans only */}
                  {!isFree && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#fff0f2] flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="w-4 h-4 text-[#ff385c]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6a6a6a]">Auto-renews on</p>
                        <p className="text-sm font-medium text-[#222222]">{formatDate(subscription.currentPeriodEnd)}</p>
                      </div>
                    </div>
                  )}

                  {/* Included features */}
                  {subscription.planSnapshot.features.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#f0f7ff] flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-[#0070f3]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6a6a6a] mb-2">Included features</p>
                        <div className="flex flex-wrap gap-2">
                          {subscription.planSnapshot.features.map((f) => (
                            <span key={f} className="px-2.5 py-0.5 bg-[#f7f7f7] text-[#222222] text-xs rounded-full border border-[#ebebeb]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment + quick stats */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Payment Method */}
              <div className="bg-white rounded-[16px] border border-[#dddddd] px-5 py-5 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-[#ff385c]" />
                  </div>
                  <p className="font-semibold text-[#222222]">Payment</p>
                </div>

                <div className="bg-[#ff385c] rounded-[12px] px-4 py-4 text-white mb-4">
                  <CreditCard className="w-5 h-5 text-white/60 mb-3" />
                  <p className="text-sm font-medium tracking-wider mb-1">
                    •••• •••• •••• {paymentMethod.last4}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60 capitalize">{paymentMethod.type}</span>
                    <span className="text-xs text-white/60">
                      {paymentMethod.expiresMonth}/{paymentMethod.expiresYear}
                    </span>
                  </div>
                </div>

                <button className="w-full py-2 border border-[#dddddd] text-[#222222] rounded-[20px] hover:border-[#222222] text-sm transition-colors active:scale-[0.92]">
                  Update payment method
                </button>
              </div>
            </div>
          </div>

          {/* ── Invoices ── */}
          <div className="bg-white rounded-[16px] border border-[#dddddd] overflow-hidden">
            <div className="px-6 py-5 flex items-center gap-3 border-b border-[#f0f0f0]">
              <div className="w-8 h-8 rounded-full bg-[#fff8e6] flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#c97a00]" />
              </div>
              <h2 className="font-semibold text-[#222222]">Invoices</h2>
            </div>

            {isLoadingPayments ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="w-5 h-5 animate-spin text-[#6a6a6a]" />
              </div>
            ) : payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-12 h-12 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-1">
                  <FileText className="w-6 h-6 text-[#6a6a6a]" />
                </div>
                <p className="text-[#6a6a6a] text-sm">No invoices yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#fafafa] text-[#6a6a6a] text-xs uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-medium">Date</th>
                      <th className="px-6 py-3 text-left font-medium">Description</th>
                      <th className="px-6 py-3 text-left font-medium">Total</th>
                      <th className="px-6 py-3 text-left font-medium">Status</th>
                      <th className="px-6 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f5f5]">
                    {payments.map((row) => {
                      const { label, cls } = statusLabel(row.status);
                      return (
                        <tr key={row.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-6 py-4 text-[#222222] font-medium whitespace-nowrap">
                            {formatDate(row.paymentDate)}
                          </td>
                          <td className="px-6 py-4 text-[#6a6a6a]">
                            {row.planName ?? '—'}
                          </td>
                          <td className="px-6 py-4 text-[#222222] font-semibold">
                            ${row.amount.toFixed(2)}
                            <span className="text-xs text-[#6a6a6a] font-normal ml-1">{row.currency}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                              {label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={handleDownloadInvoice}
                              className="flex items-center gap-1.5 text-[#0070f3] hover:text-[#0060d3] text-sm font-medium transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Cancellation ── */}
          <div className="bg-white rounded-[16px] border border-[#ffd6d6] overflow-hidden">
            <div className="px-6 py-5 flex items-center gap-3 border-b border-[#ffd6d6]">
              <div className="w-8 h-8 rounded-full bg-[#fff0f2] flex items-center justify-center">
                <TriangleAlert className="w-4 h-4 text-[#c13515]" />
              </div>
              <h2 className="font-semibold text-[#c13515]">Cancellation</h2>
            </div>
            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#222222]">Cancel your plan</p>
                <p className="text-xs text-[#6a6a6a] mt-0.5">
                  Your subscription will remain active until the end of the billing period.
                </p>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={isFree}
                title={isFree ? 'Not available on a free plan' : undefined}
                className="px-5 py-2 bg-[#c13515] text-white rounded-[20px] text-sm font-medium transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[#a02a10] enabled:active:scale-[0.92]"
              >
                Cancel plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
