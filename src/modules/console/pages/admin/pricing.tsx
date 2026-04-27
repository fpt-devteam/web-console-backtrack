import { useEffect, useState } from 'react';
import type { AdminSubscriptionResult } from '@/types/admin-user.types';
import { Layout } from '../../components/admin/layout';
import { Check, Info, Loader2, Network } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { subscriptionService } from '@/services/subscription.service';
import type { SubscriptionPlanResult } from '@/services/subscription.service';
import { useCurrentOrgId } from '@/contexts/current-org.context';
import { useNavigate, useParams } from '@tanstack/react-router';

export function PricingPage() {
  const { currentOrgId } = useCurrentOrgId();
  const { slug } = useParams({ strict: false }) as { slug: string };
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');

  const [plans, setPlans] = useState<Array<SubscriptionPlanResult>>([]);
  const [subscription, setSubscription] = useState<AdminSubscriptionResult | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const isLoading = isLoadingPlans || isLoadingSubscription;

  useEffect(() => {
    setIsLoadingPlans(true);
    subscriptionService
      .getPlans('Organization')
      .then(setPlans)
      .catch(() => showToast.error('Failed to load plans'))
      .finally(() => setIsLoadingPlans(false));
  }, []);

  useEffect(() => {
    if (!currentOrgId) return;
    setIsLoadingSubscription(true);
    subscriptionService
      .getOrgSubscription(currentOrgId)
      .then(setSubscription)
      .catch(() => showToast.error('Failed to load subscription'))
      .finally(() => setIsLoadingSubscription(false));
  }, [currentOrgId]);

  const hasYearlyPlans = plans.some((p) => p.billingInterval === 'Yearly');
  const visiblePlans = plans.filter((p) => p.billingInterval === billingCycle);
  const currentPlanPrice = subscription?.planSnapshot.price ?? 0;

  const handleSelect = async (plan: SubscriptionPlanResult) => {
    if (!currentOrgId) return;
    setProcessingPlanId(plan.id);
    try {
      const result = await subscriptionService.createSubscription(plan.id, currentOrgId);

      // Free plan — no Stripe checkout needed
      if (!result.clientSecret) {
        showToast.success(`Switched to ${plan.name}!`);
        void navigate({ to: '/console/$slug/admin/plan', params: { slug } });
        return;
      }

      // Paid plan — save state and go to Stripe checkout
      sessionStorage.setItem('checkout', JSON.stringify({
        clientSecret: result.clientSecret,
        planId: plan.id,
        planLabel: plan.name,
        planPrice: `$${plan.price}`,
        planPeriod: `/ ${plan.billingInterval.toLowerCase()}`,
        features: plan.features,
      }));
      void navigate({ to: '/console/$slug/admin/checkout', params: { slug } });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        showToast.error('You already have an active subscription.');
        void navigate({ to: '/console/$slug/admin/plan', params: { slug } });
      } else if (status === 403) {
        showToast.error('You do not have permission to manage subscriptions.');
      } else {
        showToast.error(err?.response?.data?.error?.message ?? 'Failed to create subscription.');
      }
    } finally {
      setProcessingPlanId(null);
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-2">Pricing</h1>
          <p className="text-[#6a6a6a]">Choose the plan that fits your organization.</p>
        </div>

        {/* Billing toggle */}
        {hasYearlyPlans && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 bg-[#f7f7f7] rounded-[20px] p-1">
              <button
                onClick={() => setBillingCycle('Monthly')}
                className={`px-5 py-2 rounded-[16px] text-sm font-medium transition-colors ${
                  billingCycle === 'Monthly'
                    ? 'bg-white text-[#222222] shadow-sm'
                    : 'text-[#6a6a6a] hover:text-[#222222]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('Yearly')}
                className={`px-5 py-2 rounded-[16px] text-sm font-medium transition-colors ${
                  billingCycle === 'Yearly'
                    ? 'bg-white text-[#222222] shadow-sm'
                    : 'text-[#6a6a6a] hover:text-[#222222]'
                }`}
              >
                Yearly
                <span className="ml-1.5 text-xs text-[#06c167] font-semibold">Save 20%</span>
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-[#6a6a6a]" />
          </div>
        ) : visiblePlans.length === 0 ? (
          <p className="text-center text-[#6a6a6a] py-16">No plans available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visiblePlans.map((plan) => {
              const isCurrentPlan = subscription?.planId === plan.id;
              const isCurrentInterval =
                subscription?.planSnapshot.billingInterval === plan.billingInterval;
              const isOnDifferentInterval =
                !isCurrentPlan &&
                subscription?.planSnapshot.name === plan.name &&
                !isCurrentInterval;
              const isDowngrade = !isCurrentPlan && plan.price < currentPlanPrice;
              const isProcessing = processingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-[16px] border-2 overflow-hidden transition-all ${
                    isCurrentPlan
                      ? 'border-[#ff385c] bg-white'
                      : 'border-[#dddddd] bg-white hover:border-[#aaaaaa]'
                  }`}
                >
                  {/* ── Fixed top section ── */}
                  <div className="px-5 pt-6 pb-4 space-y-4">
                    <div className="w-10 h-10 rounded-full bg-[#fff0f2] flex items-center justify-center">
                      <Network className="w-5 h-5 text-[#ff385c]" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#222222]">{plan.name}</h3>
                      <p className="text-sm text-[#6a6a6a] mt-0.5">
                        {plan.billingInterval === 'Monthly' ? 'Billed monthly' : 'Billed annually'}
                      </p>
                    </div>

                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-bold text-[#222222]">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <div className="mb-1 leading-tight">
                          <p className="text-xs text-[#6a6a6a]">
                            {plan.currency} / {plan.billingInterval === 'Monthly' ? 'month' : 'year'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Notice slot — fixed min-height keeps buttons aligned ── */}
                  <div className="px-5 flex items-start pb-2">
                    {isOnDifferentInterval && (
                      <div className="flex items-center gap-2 bg-[#fff8e6] border border-[#ffe4a0] rounded-[10px] px-3 py-2.5 w-full">
                        <Info className="w-4 h-4 text-[#c97a00] flex-shrink-0" />
                        <p className="text-xs text-[#c97a00]">
                          You're on the {subscription.planSnapshot.billingInterval.toLowerCase()} version.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── CTA button ── */}
                  <div className="px-5 pb-5">
                    {isCurrentPlan ? (
                      <button
                        disabled
                        className="w-full py-2.5 bg-[#f7f7f7] text-[#929292] rounded-xl text-sm font-medium cursor-not-allowed border border-[#ebebeb]"
                      >
                        Current Plan
                      </button>
                    ) : isDowngrade ? (
                      <button
                        onClick={() => void handleSelect(plan)}
                        disabled={!!processingPlanId}
                        className="w-full py-2.5 border-2 border-[#dddddd] text-[#222222] rounded-[20px] text-sm font-medium hover:border-[#222222] transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                        Downgrade to {plan.name}
                      </button>
                    ) : (
                      <button
                        onClick={() => void handleSelect(plan)}
                        disabled={!!processingPlanId}
                        className="w-full py-2.5 bg-[#ff385c] text-white rounded-[20px] text-sm font-medium hover:bg-[#e00b41] transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                        Get {plan.name} plan
                      </button>
                    )}
                  </div>

                  {/* ── Divider + Features ── */}
                  {plan.features.length > 0 && (
                    <>
                      <div className="mx-5 border-t border-[#f0f0f0]" />
                      <div className="px-5 py-5">
                        <p className="text-xs font-semibold text-[#222222] uppercase tracking-wide mb-3">
                          What's included
                        </p>
                        <ul className="space-y-2">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-[#06c167] mt-0.5 flex-shrink-0" />
                              <span className="text-[#6a6a6a]">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
