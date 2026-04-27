import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, Check, Loader2, ShieldCheck } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface CheckoutState {
  clientSecret: string;
  planId: string;
  planLabel: string;
  planPrice: string;
  planPeriod: string;
  features: Array<string>;
}

function readCheckoutState(): CheckoutState | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem('checkout') ?? '{}');
    return parsed.clientSecret ? (parsed as CheckoutState) : null;
  } catch {
    return null;
  }
}

function PaymentFormInner({
  slug,
  checkoutState,
}: {
  slug: string;
  checkoutState: CheckoutState;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/console/${slug}/admin/plan`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('checkout');
    void navigate({ to: '/console/$slug/admin/pricing', params: { slug } });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-5xl">

          {/* Back button + Title */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#6a6a6a] hover:text-[#222222] transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to pricing
          </button>

          <h1 className="text-3xl font-bold text-[#222222] mb-10">Configure your plan</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

              {/* Left — Payment form */}
              <div className="space-y-5">
                <p className="text-base font-semibold text-[#222222]">Payment method</p>

                <div className="bg-white rounded-[16px] border border-[#dddddd] p-5">
                  <PaymentElement options={{ layout: 'tabs' }} />
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-2 bg-[#fff0f2] border border-[#ffd6d6] rounded-[12px] px-4 py-3">
                    <p className="text-sm text-[#c13515]">{errorMessage}</p>
                  </div>
                )}
              </div>

              {/* Right — Plan summary card */}
              <div className="space-y-4">
                <div className="bg-white rounded-[20px] border border-[#dddddd] p-6">
                  <h2 className="text-2xl font-bold text-[#222222] mb-1">{checkoutState.planLabel}</h2>

                  {checkoutState.features.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-[#0070f3]" />
                        <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wide">
                          Top features
                        </p>
                      </div>
                      <ul className="space-y-2.5">
                        {checkoutState.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-[#06c167] mt-0.5 flex-shrink-0" />
                            <span className="text-[#6a6a6a]">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pricing breakdown */}
                  <div className="border-t border-[#f0f0f0] mt-5 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6a6a6a]">Subscription</span>
                      <span className="text-[#222222] font-medium">{checkoutState.planPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6a6a6a]">Estimated tax</span>
                      <span className="text-[#222222] font-medium">$0</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0]">
                      <span className="font-semibold text-[#222222]">Due today</span>
                      <span className="font-bold text-[#222222] text-lg">{checkoutState.planPrice}</span>
                    </div>
                  </div>

                  {/* Subscribe button */}
                  <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="mt-5 w-full py-3 bg-[#ff385c] text-white rounded-[20px] font-semibold text-sm hover:bg-[#e00b41] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isProcessing ? 'Processing…' : 'Subscribe'}
                  </button>
                </div>

                {/* Fine print */}
                <p className="text-xs text-[#6a6a6a] leading-relaxed px-1">
                  Renews {checkoutState.planPeriod.replace('/ ', '')} until cancelled.{' '}
                  {checkoutState.planPrice} will be charged each period.
                  You can cancel anytime from your plan settings.
                </p>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const navigate = useNavigate();
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const state = readCheckoutState();
    if (!state) {
      void navigate({ to: '/console/$slug/admin/pricing', params: { slug } });
      return;
    }
    setCheckoutState(state);
    setReady(true);
  }, [navigate, slug]);

  if (!ready || !checkoutState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
        <Loader2 className="w-6 h-6 animate-spin text-[#6a6a6a]" />
      </div>
    );
  }

  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] p-8">
        <div className="bg-[#fff8e6] border border-[#ffe4a0] rounded-[14px] p-6 max-w-md">
          <p className="font-semibold text-[#c97a00] mb-1">Stripe not configured</p>
          <p className="text-sm text-[#6a6a6a]">
            Add{' '}
            <code className="bg-[#f7f7f7] px-1 rounded text-xs">VITE_STRIPE_PUBLISHABLE_KEY</code>{' '}
            to your <code className="bg-[#f7f7f7] px-1 rounded text-xs">.env</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: checkoutState.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: { colorPrimary: '#ff385c', borderRadius: '12px' },
        },
      }}
    >
      <PaymentFormInner slug={slug} checkoutState={checkoutState} />
    </Elements>
  );
}
