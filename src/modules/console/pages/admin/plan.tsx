import { Layout } from '../../components/admin/layout';
import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building2, 
  Mail, 
  Receipt, 
  Check,
} from 'lucide-react';
import {
  mockCurrentPlan,
  mockAvailablePlans,
  mockPaymentMethod,
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
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Management</h1>
          <p className="text-gray-600">Manage your organization's subscription and billing details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Left Column - Subscription & Plans */}
          <div className="lg:col-span-5 space-y-6">
            {/* Current Subscription */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{mockCurrentPlan.name}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      {mockCurrentPlan.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Renews on {mockCurrentPlan.renewsOn}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    ${mockCurrentPlan.price}
                    <span className="text-lg text-gray-500">/mo</span>
                  </div>
                  <p className="text-sm text-gray-500">Billed monthly</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Receipt className="w-4 h-4" />
                    <span>Total Posts</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockCurrentPlan.usage.posts.current}
                    <span className="text-base text-gray-500">
                      {mockCurrentPlan.usage.posts.limit ? ` / ${mockCurrentPlan.usage.posts.limit}` : ' / ∞'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Building2 className="w-4 h-4" />
                    <span>Branches</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockCurrentPlan.usage.branches.current}
                    <span className="text-base text-gray-500"> / {mockCurrentPlan.usage.branches.limit}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Mail className="w-4 h-4" />
                    <span>Employees</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockCurrentPlan.usage.employees.current}
                    <span className="text-base text-gray-500"> / {mockCurrentPlan.usage.employees.limit}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                >
                  Download Invoice
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="px-6 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors ml-auto"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Available Plans */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Available Plans</h2>
                
                {/* Billing Cycle Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly <span className="text-green-600 text-xs">(Save 20%)</span>
                  </button>
                </div>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-3 gap-4">
                {mockAvailablePlans.map((plan) => {
                  const isCurrentPlan = plan.name === mockCurrentPlan.name;
                  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className={`relative p-5 rounded-xl border-2 transition-all ${
                        isCurrentPlan
                          ? 'border-blue-500 bg-blue-50/30'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          Current Plan
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 h-10">{plan.description}</p>

                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">${price}</span>
                        <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>

                      <ul className="space-y-2 mb-5">
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{plan.features.branches}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{plan.features.employees}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{plan.features.posts}</span>
                        </li>
                        {plan.features.analytics && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Basic Analytics</span>
                          </li>
                        )}
                        {plan.features.support && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{plan.features.support}</span>
                          </li>
                        )}
                      </ul>

                      {isCurrentPlan ? (
                        <button
                          disabled
                          className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      ) : plan.monthlyPrice < mockCurrentPlan.price ? (
                        <button
                          onClick={() => handleDowngrade(plan.id)}
                          className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                        >
                          Downgrade
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan.id)}
                          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
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

          {/* Right Column - Account Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {paymentMethod.type.charAt(0).toUpperCase() + paymentMethod.type.slice(1)} ending in{' '}
                    {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {paymentMethod.expiresMonth}/{paymentMethod.expiresYear}
                  </p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                + Add Payment Method
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need help with plans?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team can help you pick the right plan for your organization.
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

