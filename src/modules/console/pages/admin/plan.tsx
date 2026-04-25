import { Layout } from '../../components/admin/layout';
import { useState, useEffect } from 'react';
// import { useRouter } from '@tanstack/react-router';
import { 
  CreditCard, 
  Mail, 
  Receipt, 
  Check,
} from 'lucide-react';
import {
  mockCurrentPlan,
  mockAvailablePlans,
  mockPaymentMethod,
  mockOrgBillingHistory,
  type PaymentMethod,
} from '@/mock/data';
import { showToast } from '@/lib/toast';
import {
  getPaymentMethod,
} from '@/mock/storage/account-storage';

export function PlanPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // State for payment data
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(mockPaymentMethod);
  
  // Load data from localStorage on mount
  useEffect(() => {
    setPaymentMethod(getPaymentMethod(mockPaymentMethod));
  }, []);

  const handleUpgrade = (planId: string) => {
    showToast.success(`Upgrade to ${planId} plan initiated!`);
  };

  const handleDowngrade = (planId: string) => {
    showToast.success(`Downgrade to ${planId} plan initiated!`);
  };

  const handleCancelSubscription = () => {
    showToast.error('Subscription cancellation requested.');
  };

  const handleDownloadInvoice = () => {
    showToast.success('Invoice downloaded!');
  };

  return (
    <Layout>
      <div className="p-4 sm:p-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-2">Plan Management</h1>
          <p className="text-[#6a6a6a]">Manage your organization's subscription and billing details.</p>
        </div>

        <div className="space-y-8">
          {/* Current plan + Payment method (same row height on large screens) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Current Subscription */}
            <div className="lg:col-span-2 h-full min-h-0">
              <div className="bg-white rounded-[14px] border border-[#dddddd] p-6 h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#222222]">{mockCurrentPlan.name}</h2>
                    <span className="px-3 py-1 bg-[#e8f9f0] text-[#06c167] text-sm font-semibold rounded-full">
                      {mockCurrentPlan.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-[#6a6a6a]">Renews on {mockCurrentPlan.renewsOn}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#222222]">
                    ${mockCurrentPlan.price}
                    <span className="text-lg text-[#6a6a6a]">/mo</span>
                  </div>
                  <p className="text-sm text-[#6a6a6a]">Billed monthly</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[#f7f7f7] rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-[#6a6a6a] mb-1">
                    <Receipt className="w-4 h-4" />
                    <span>Total Posts</span>
                  </div>
                  <div className="text-2xl font-bold text-[#222222]">
                    {mockCurrentPlan.usage.posts.current}
                    <span className="text-base text-[#6a6a6a]">
                      {mockCurrentPlan.usage.posts.limit ? ` / ${mockCurrentPlan.usage.posts.limit}` : ' / ∞'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#f7f7f7] rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-[#6a6a6a] mb-1">
                    <Mail className="w-4 h-4" />
                    <span>Employees</span>
                  </div>
                  <div className="text-2xl font-bold text-[#222222]">
                    {mockCurrentPlan.usage.employees.current}
                    <span className="text-base text-[#6a6a6a]"> / {mockCurrentPlan.usage.employees.limit}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="px-6 py-2 bg-[#ff385c] text-white rounded-[20px] hover:bg-[#e00b41] text-sm transition-colors active:scale-[0.92]"
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="px-6 py-2 border border-[#dddddd] text-[#222222] rounded-[20px] hover:border-[#222222] text-sm transition-colors active:scale-[0.92]"
                >
                  Download Invoice
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="px-6 py-2 text-[#c13515] hover:bg-[#fff0f2] rounded-[20px] text-sm transition-colors ml-auto active:scale-[0.92]"
                >
                  Cancel Subscription
                </button>
              </div>
              </div>
            </div>

            {/* Payment Method — khung cùng chiều cao cột; nội dung xếp bình thường */}
            <div className="lg:col-span-1 h-full min-h-0">
              <div className="bg-white rounded-[14px] border border-[#dddddd] p-6 h-full">
                <h3 className="text-lg font-bold text-[#222222] mb-4">Payment Method</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-8 bg-[#f7f7f7] rounded-lg flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-[#6a6a6a]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#222222] font-medium">
                      {paymentMethod.type.charAt(0).toUpperCase() + paymentMethod.type.slice(1)} ending in{' '}
                      {paymentMethod.last4}
                    </p>
                    <p className="text-sm text-[#6a6a6a]">
                      Expires {paymentMethod.expiresMonth}/{paymentMethod.expiresYear}
                    </p>
                  </div>
                </div>
                <button type="button" className="text-[#ff385c] hover:text-[#e00b41] text-sm font-medium">
                  + Add Payment Method
                </button>
              </div>
            </div>
          </div>

          {/* Available Plans — full width */}
          <div className="w-full">
            <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#222222]">Available Plans</h2>

                {/* Billing Cycle Toggle */}
                <div className="flex items-center gap-2 bg-[#f7f7f7] rounded-[20px] p-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-[16px] text-sm transition-colors ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-[#222222] shadow-sm'
                        : 'text-[#6a6a6a] hover:text-[#222222]'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-[16px] text-sm transition-colors ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-[#222222] shadow-sm'
                        : 'text-[#6a6a6a] hover:text-[#222222]'
                    }`}
                  >
                    Yearly <span className="text-[#06c167] text-xs">(Save 20%)</span>
                  </button>
                </div>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockAvailablePlans.map((plan) => {
                  const isCurrentPlan = plan.name === mockCurrentPlan.name;
                  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className={`relative p-5 rounded-[14px] border-2 transition-all ${
                        isCurrentPlan
                          ? 'border-[#222222] bg-[#f7f7f7]'
                          : 'border-[#dddddd] bg-white hover:border-[#222222]'
                      }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#222222] text-white text-xs font-semibold rounded-full">
                          Current Plan
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-[#222222] mb-1">{plan.name}</h3>
                      <p className="text-sm text-[#6a6a6a] mb-4 h-10">{plan.description}</p>

                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#222222]">${price}</span>
                        <span className="text-[#6a6a6a]">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>

                      <ul className="space-y-2 mb-5">
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[#06c167] mt-0.5 flex-shrink-0" />
                          <span className="text-[#6a6a6a]">{plan.features.employees}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[#06c167] mt-0.5 flex-shrink-0" />
                          <span className="text-[#6a6a6a]">{plan.features.posts}</span>
                        </li>
                        {plan.features.analytics && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-[#06c167] mt-0.5 flex-shrink-0" />
                            <span className="text-[#6a6a6a]">Basic Analytics</span>
                          </li>
                        )}
                        {plan.features.support && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-[#06c167] mt-0.5 flex-shrink-0" />
                            <span className="text-[#6a6a6a]">{plan.features.support}</span>
                          </li>
                        )}
                      </ul>

                      {isCurrentPlan ? (
                        <button
                          disabled
                          className="w-full py-2 bg-[#f7f7f7] text-[#929292] rounded-[20px] text-sm cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      ) : plan.monthlyPrice < mockCurrentPlan.price ? (
                        <button
                          onClick={() => handleDowngrade(plan.id)}
                          className="w-full py-2 border border-[#dddddd] text-[#222222] rounded-[20px] hover:border-[#222222] text-sm transition-colors active:scale-[0.92]"
                        >
                          Downgrade
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan.id)}
                          className="w-full py-2 bg-[#ff385c] text-white rounded-[20px] hover:bg-[#e00b41] text-sm transition-colors active:scale-[0.92]"
                        >
                          Upgrade
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Billing History — full width */}
          <div className="w-full bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-lg font-semibold text-[#222222]">Billing History</h2>
              </div>
              <div className="overflow-x-auto px-6 pb-6">
                <table className="min-w-[640px] w-full text-sm">
                    <thead>
                      <tr className="bg-[#f7f7f7] text-left text-[#6a6a6a] uppercase text-xs font-bold tracking-wider border-b border-[#dddddd]">
                        <th className="px-4 py-3 font-medium">Invoice</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrgBillingHistory.map((row) => (
                        <tr key={row.id} className="border-t border-[#dddddd] hover:bg-[#f7f7f7]">
                          <td className="px-4 py-3 text-[#222222] font-medium">{row.id}</td>
                          <td className="px-4 py-3 text-[#6a6a6a]">{row.invoiceDate}</td>
                          <td className="px-4 py-3 text-[#6a6a6a]">{row.description}</td>
                          <td className="px-4 py-3 text-[#222222]">
                            ${row.amount.toFixed(2)} {row.currency}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                row.status === 'Paid'
                                  ? 'bg-[#e8f9f0] text-[#06c167]'
                                  : row.status === 'Pending'
                                    ? 'bg-[#fff8e6] text-[#c97a00]'
                                    : 'bg-[#fff0f2] text-[#c13515]'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

