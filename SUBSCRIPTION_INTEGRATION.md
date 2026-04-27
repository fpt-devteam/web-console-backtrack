# Subscription Integration Guide

This document describes how to integrate the **Subscribe** and **Cancel Subscription** flows into another website, based on the existing implementation in this codebase. The target API uses organization-scoped endpoints.

---

## Table of Contents

1. [Overview](#1-overview)
2. [API Reference](#2-api-reference)
3. [TypeScript Types](#3-typescript-types)
4. [API Client Setup](#4-api-client-setup)
5. [Service Layer](#5-service-layer)
6. [React Query Hooks](#6-react-query-hooks)
7. [Subscribe Flow — Step by Step](#7-subscribe-flow--step-by-step)
8. [Cancel Flow — Step by Step](#8-cancel-flow--step-by-step)
9. [UI Components](#9-ui-components)
10. [Error Handling Reference](#10-error-handling-reference)
11. [Session Storage Contract](#11-session-storage-contract)
12. [Environment Variables](#12-environment-variables)

---

## 1. Overview

The subscription lifecycle has two main user actions:

| Action | Trigger | Result |
|--------|---------|--------|
| **Subscribe** | User picks a plan on the pricing page | Backend creates a Stripe PaymentIntent and returns a `clientSecret`; frontend redirects to Stripe checkout |
| **Cancel** | User clicks "Cancel subscription" on the account page | Backend schedules or immediately ends the subscription for the given organization |

Both actions require the user to be authenticated (Bearer token). The organization context is passed in every request body via `organizationId`.

---

## 2. API Reference

### 2.1 Create Subscription

```
POST {{baseUrl}}/api/core/subscriptions
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body:**
```json
{
  "planId": "4c3270c4-5c57-4a1b-8615-0c4d526318d6",
  "organizationId": "3cadad13-991f-4d28-a69f-fdbeac1eba75"
}
```

**Success response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "sub_...",
    "subscriberType": "Organization",
    "userId": "user_...",
    "planId": "4c3270c4-5c57-4a1b-8615-0c4d526318d6",
    "planSnapshot": {
      "name": "Monthly Premium",
      "price": 1.99,
      "currency": "usd",
      "billingInterval": "Monthly",
      "features": ["Feature A", "Feature B"]
    },
    "status": "Active",
    "currentPeriodStart": "2026-04-27T00:00:00Z",
    "currentPeriodEnd": "2026-05-27T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "createdAt": "2026-04-27T00:00:00Z",
    "clientSecret": "pi_...._secret_...."
  }
}
```

**Notable error codes:**

| HTTP | Meaning | Recommended UX |
|------|---------|----------------|
| 401 | Session expired | Redirect to sign-in |
| 403 | Not authorized | Show permission error |
| 409 | Already subscribed | Redirect to account page |
| 422 | Validation error | Show field-level message |
| 429 | Rate limited | Show retry message |
| 5xx | Server error | Generic retry message |

---

### 2.2 Cancel Subscription

```
DELETE {{baseUrl}}/api/core/subscriptions/me
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body:**
```json
{
  "organizationId": "3cadad13-991f-4d28-a69f-fdbeac1eba75",
  "cancelAtPeriodEnd": false
}
```

- `cancelAtPeriodEnd: true` — subscription ends at the current billing period boundary (soft cancel, access continues)
- `cancelAtPeriodEnd: false` — subscription ends immediately

**Success response `200`:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 2.3 Get Current Subscription

```
GET {{baseUrl}}/api/core/subscriptions/me
Authorization: Bearer <token>
```

Returns the active subscription for the authenticated user (or `null` if none).

---

### 2.4 Get Available Plans

```
GET {{baseUrl}}/api/core/subscription-plans?subscriberType=Organization
```

No auth required. Returns available plans to display on the pricing page.

---

### 2.5 Get Payment History

```
GET {{baseUrl}}/api/core/subscriptions/payments
Authorization: Bearer <token>
```

Returns paginated payment receipts.

---

## 3. TypeScript Types

```ts
// types/subscription.type.ts

export type CreateSubscriptionRequest = {
  planId: string;
  organizationId: string;         // required for org-scoped API
};

export type CancelSubscriptionRequest = {
  organizationId: string;
  cancelAtPeriodEnd: boolean;
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingInterval: 'Monthly' | 'Yearly';
  subscriberType: string;
  features: string[];
}

export interface CreateSubscriptionResponse {
  id: string;
  subscriberType: string;
  userId: string;
  planId: string;
  planSnapshot: {
    name: string;
    price: number;
    currency: string;
    billingInterval: string;
    features: string[];
  };
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  clientSecret: string;           // Stripe PaymentIntent client secret
}

export const OngoingSubscriptionStatus = {
  Active:  'Active',
  PastDue: 'PastDue',
  Unpaid:  'Unpaid',
} as const;

export type OngoingSubscriptionStatusType =
  typeof OngoingSubscriptionStatus[keyof typeof OngoingSubscriptionStatus];

export type SubscriptionInfo = {
  id: string;
  userId: string;
  planType: 'Monthly' | 'Yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  status: OngoingSubscriptionStatusType;
  cancelAtPeriodEnd: boolean;
};

export interface PaymentItem {
  id: string;
  subscriptionId: string;
  subscriberType: string;
  userId: string;
  providerInvoiceId: string;
  amount: number;
  currency: string;
  status: 'Succeeded' | 'Failed' | 'Pending';
  paymentDate: string;
  createdAt: string;
  invoiceUrl?: string;
}

export interface PaymentHistory {
  total: number;
  items: PaymentItem[];
}
```

---

## 4. API Client Setup

The API client auto-attaches the Firebase ID token and retries once on `401`.

```ts
// lib/api-client.ts
import axios from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;

export const privateClient = axios.create({ baseURL: API_URL });

privateClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const user = auth.currentUser;
      if (!user) throw error;
      const token = await user.getIdToken(true);
      original.headers.Authorization = `Bearer ${token}`;
      return privateClient.request(original);
    }
    throw error;
  }
);

export const publicClient = axios.create({ baseURL: API_URL });
```

**If you are not using Firebase**, replace the interceptor with your own token provider:

```ts
privateClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken(); // your auth method
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 5. Service Layer

Hardcode your `organizationId` at the service level (or pass it from context).

```ts
// services/subscription.service.ts
import { privateClient, publicClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  CreateSubscriptionRequest,
  CancelSubscriptionRequest,
  CreateSubscriptionResponse,
  SubscriptionInfo,
  SubscriptionPlan,
  PaymentHistory,
} from '@/types/subscription.type';

const ORG_ID = '3cadad13-991f-4d28-a69f-fdbeac1eba75'; // or read from config/context

type SubscriptionInfoRaw = Omit<SubscriptionInfo, 'currentPeriodStart' | 'currentPeriodEnd'> & {
  currentPeriodStart: string;
  currentPeriodEnd: string;
};

export const subscriptionService = {
  async createSubscription(planId: string): Promise<CreateSubscriptionResponse> {
    const body: CreateSubscriptionRequest = { planId, organizationId: ORG_ID };
    const { data } = await privateClient.post<ApiResponse<CreateSubscriptionResponse>>(
      '/api/core/subscriptions',
      body,
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create subscription');
    return data.data;
  },

  async cancelSubscription(cancelAtPeriodEnd = false): Promise<void> {
    const body: CancelSubscriptionRequest = { organizationId: ORG_ID, cancelAtPeriodEnd };
    const { data } = await privateClient.delete<ApiResponse<unknown>>(
      '/api/core/subscriptions/me',
      { data: body },                  // axios DELETE with body uses { data: ... }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to cancel subscription');
  },

  async getMySubscription(): Promise<SubscriptionInfo | null> {
    const { data } = await privateClient.get<ApiResponse<SubscriptionInfoRaw | null>>(
      '/api/core/subscriptions/me',
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch subscription');
    if (!data.data) return null;
    return {
      ...data.data,
      currentPeriodStart: new Date(data.data.currentPeriodStart),
      currentPeriodEnd: new Date(data.data.currentPeriodEnd),
    };
  },

  async getPlans(): Promise<SubscriptionPlan[]> {
    const { data } = await publicClient.get<ApiResponse<SubscriptionPlan[]>>(
      '/api/core/subscription-plans',
      { params: { subscriberType: 'Organization' } },
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch plans');
    return data.data;
  },

  async getPaymentHistory(): Promise<PaymentHistory> {
    const { data } = await privateClient.get<ApiResponse<PaymentHistory>>(
      '/api/core/subscriptions/payments',
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch payment history');
    return data.data;
  },
};
```

> **Axios DELETE with a body** — Axios does not send a body on DELETE by default. Pass it as `{ data: body }` in the config object (third argument), as shown above.

---

## 6. React Query Hooks

```ts
// hooks/use-subscription.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';

export function usePlans() {
  return useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => subscriptionService.getPlans(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionService.getMySubscription(),
  });
}

export function useCreateSubscription() {
  return useMutation({
    mutationFn: (planId: string) => subscriptionService.createSubscription(planId),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cancelAtPeriodEnd = false) =>
      subscriptionService.cancelSubscription(cancelAtPeriodEnd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] });
    },
  });
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: ['subscription', 'payments'],
    queryFn: () => subscriptionService.getPaymentHistory(),
    staleTime: 1000 * 60 * 5,
  });
}
```

---

## 7. Subscribe Flow — Step by Step

```
User picks a plan
      │
      ▼
[1] Auth check — is user signed in and non-anonymous?
      │ No  → redirect to /sign-in
      │ Yes ↓
[2] POST /api/core/subscriptions  { planId, organizationId }
      │ 409 → user already subscribed → redirect to /account
      │ 4xx/5xx → show error toast
      │ 200 ↓
[3] Store checkout state in sessionStorage ("checkout" key)
      │
      ▼
[4] Redirect to /premium/checkout
      │
      ▼
[5] Read sessionStorage → render Stripe <Elements> with clientSecret
      │
      ▼
[6] User fills card details → stripe.confirmPayment(...)
      │ error → show inline error message
      │ success → Stripe redirects to return_url (/premium/success)
```

### Step 3 — sessionStorage shape

```ts
sessionStorage.setItem('checkout', JSON.stringify({
  clientSecret: response.clientSecret,   // from API response
  planId:       plan.id,
  planLabel:    plan.name,               // e.g. "Monthly Premium"
  planPrice:    `$${plan.price}`,        // e.g. "$1.99"
  planPeriod:   `/ ${plan.billingInterval.toLowerCase()}`, // e.g. "/ monthly"
  features:     plan.features,
}));
```

### Step 5 — Checkout page reads state

```ts
function readCheckoutState() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem('checkout') ?? '{}');
    return parsed.clientSecret ? parsed : null;
  } catch {
    return null;
  }
}

// If null → redirect back to pricing page
```

### Step 6 — Stripe payment confirmation

```tsx
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentFormInner({ planPrice }: { planPrice: string }) {
  const stripe = useStripe();
  const elements = useElements();
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
        return_url: `${window.location.origin}/premium/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.');
      setIsProcessing(false);
    }
    // On success Stripe navigates to return_url automatically
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Processing…' : `Pay ${planPrice}`}
      </button>
    </form>
  );
}

export function PaymentForm({ clientSecret, planPrice }: { clientSecret: string; planPrice: string }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: 'stripe', variables: { colorPrimary: '#F6475F', borderRadius: '12px' } },
      }}
    >
      <PaymentFormInner planPrice={planPrice} />
    </Elements>
  );
}
```

---

## 8. Cancel Flow — Step by Step

```
User clicks "Cancel subscription" button
      │
      ▼
[1] Show confirmation dialog
    "Your access continues until <currentPeriodEnd>.
     After that you'll lose Premium features."
      │ "Keep Plan" → close dialog
      │ "Cancel Subscription" ↓
[2] DELETE /api/core/subscriptions/me
    body: { organizationId, cancelAtPeriodEnd: false }
      │ error → show error toast
      │ success ↓
[3] Invalidate ['subscription', 'me'] query
[4] UI automatically re-renders with updated subscription state
```

### Minimal cancel button + dialog

```tsx
function CancelSubscriptionButton({ endDate }: { endDate: Date }) {
  const [open, setOpen] = useState(false);
  const cancel = useCancelSubscription();

  const handleConfirm = async () => {
    await cancel.mutateAsync(false);  // false = cancel immediately
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Cancel subscription</button>

      {open && (
        <dialog open>
          <p>
            Your Premium access continues until{' '}
            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
          </p>
          <button onClick={handleConfirm} disabled={cancel.isPending}>
            {cancel.isPending ? 'Cancelling…' : 'Cancel Subscription'}
          </button>
          <button onClick={() => setOpen(false)}>Keep Plan</button>
        </dialog>
      )}
    </>
  );
}
```

### Soft cancel (access until end of period)

Pass `cancelAtPeriodEnd: true` to keep access running until the billing boundary:

```ts
await cancel.mutateAsync(true);
// Service sends: { organizationId: ORG_ID, cancelAtPeriodEnd: true }
```

After a soft cancel, `subscription.cancelAtPeriodEnd` will be `true` — use this flag to show "Cancels on <date>" instead of a cancel button.

---

## 9. UI Components

### 9.1 Subscription status card

Renders the active plan badge, billing period, and cancel trigger.

```
SubscriptionCard
 ├─ if isLoading    → SubscriptionCardSkeleton
 ├─ if subscription → ActiveCard  +  SubscriptionCancelDialog
 └─ if null         → EmptyCard (upgrade CTA)
```

**Status badge colors:**

| Status | Background | Text |
|--------|-----------|------|
| Active | `bg-emerald-50` | `text-emerald-600` |
| PastDue | `bg-amber-50` | `text-amber-600` |
| Unpaid | `bg-red-50` | `text-red-600` |

**Footer note logic:**

```ts
if (status === 'PastDue')       → "Payment past due · Update billing"
if (status === 'Unpaid')        → "Payment required to restore access"
if (cancelAtPeriodEnd === true) → "Cancels on <date>"
else                            → "Renews automatically"
```

The "Cancel subscription" button is hidden when `cancelAtPeriodEnd` is already `true`.

### 9.2 Plan card (pricing page)

Each `SubscriptionPlan` from the API renders as a card with:
- Icon (Monthly → grid icon, Yearly → tree icon)
- Name + tagline
- Price + billing interval
- CTA button (`Get <name> Plan`)
- Feature checklist

The yearly plan card gets an elevated ring style and a "Best Value · 2 months free" badge.

### 9.3 Payment history

`PaymentHistory` component maps `PaymentItem[]` to rows with:
- Amount (formatted as currency)
- Payment date
- Status badge (Succeeded / Failed / Pending)
- External link to Stripe invoice when `invoiceUrl` is present

---

## 10. Error Handling Reference

Use this classification helper to map HTTP errors to UX actions:

```ts
// lib/api-error.ts  (example implementation)
export function classifyApiError(error: unknown): string {
  const status = (error as any)?.response?.status;
  if (!status) return 'network_error';
  if (status === 401) return 'unauthenticated';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 422) return 'validation';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'server_error';
  return 'unknown';
}

export function getApiErrorMessage(error: unknown): string | null {
  return (error as any)?.response?.data?.error?.message ?? null;
}
```

**Subscribe error → action mapping:**

```ts
switch (classifyApiError(error)) {
  case 'unauthenticated': navigate('/sign-in'); break;
  case 'forbidden':       toast.error("No permission"); break;
  case 'conflict':        navigate('/account'); break;       // already subscribed
  case 'validation':      toast.error(msg || 'Invalid request'); break;
  case 'rate_limited':    toast.warning('Too many requests'); break;
  case 'server_error':    toast.error('Server error'); break;
  case 'network_error':   toast.error('Check your connection'); break;
  default:                toast.error(msg || 'Something went wrong'); break;
}
```

---

## 11. Session Storage Contract

The checkout page is stateless — all context is passed through `sessionStorage` under the key `"checkout"`.

```ts
interface CheckoutState {
  clientSecret: string;   // Stripe PaymentIntent secret — REQUIRED
  planId:       string;
  planLabel:    string;   // Display name, e.g. "Monthly Premium"
  planPrice:    string;   // e.g. "$1.99"
  planPeriod:   string;   // e.g. "/ monthly"
  features:     string[];
}
```

The checkout page validates the presence of `clientSecret`. If missing, it redirects back to the pricing page. Clear this key after a successful payment or on navigation away.

---

## 12. Environment Variables

```env
# Backend
VITE_API_URL=https://your-api.example.com

# Firebase (auth)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

> Stripe price IDs are no longer needed in the frontend — the plan selection is driven by the `planId` UUID returned from `GET /api/core/subscription-plans`.
