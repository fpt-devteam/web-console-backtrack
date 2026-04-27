/** BE: AdminUserSummaryResult — GET /api/core/admin/users */

export type AdminUserStatus = 'Active' | 'Inactive';

export type AdminUserGlobalRole = 'Customer' | 'PlatformSuperAdmin';

export interface AdminUserSummary {
  id: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  status: AdminUserStatus;
  globalRole: AdminUserGlobalRole;
  createdAt: string;
}

/** BE: PagedResult<T> — total + items */
export interface AdminPagedResult<T> {
  total: number;
  items: Array<T>;
}

/** BE: UserResult — nested in AdminUserDetailResult */
export interface AdminUserBasicInfo {
  id: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  showEmail: boolean;
  showPhone: boolean;
  globalRole: AdminUserGlobalRole;
  status: AdminUserStatus;
}

export type SubscriptionBillingInterval = 'Monthly' | 'Yearly';

export interface AdminSubscriptionPlanSnapshot {
  name: string;
  price: number;
  currency: string;
  billingInterval: SubscriptionBillingInterval;
  features: Array<string>;
}

export type AdminSubscriptionStatus =
  | 'Active'
  | 'PastDue'
  | 'Unpaid'
  | 'Incomplete'
  | 'IncompleteExpired'
  | 'Canceled';

export interface AdminSubscriptionResult {
  id: string;
  subscriberType: 'User' | 'Organization';
  userId?: string | null;
  organizationId?: string | null;
  planId: string;
  planSnapshot: AdminSubscriptionPlanSnapshot;
  status: AdminSubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export type AdminPaymentStatus = 'Succeeded' | 'Failed' | 'Pending';

export interface AdminPaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: AdminPaymentStatus;
  paymentDate: string;
  providerInvoiceId: string;
  planName?: string | null;
  invoiceUrl?: string | null;
}

export interface AdminPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingInterval: 'Monthly' | 'Yearly';
  subscriberType: 'User' | 'Organization';
  features: Array<string>;
  providerPriceId: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminPlansGrouped {
  user: Array<AdminPlan>;
  organization: Array<AdminPlan>;
}

export interface CreatePlanRequest {
  name: string;
  price: number;
  currency: string;
  billingInterval: 'Monthly' | 'Yearly';
  subscriberType: 'User' | 'Organization';
  features: Array<string>;
  providerPriceId: string;
}

export interface AdminQrUsageOverview {
  totalQrCodes: number;
}

/** BE: AdminUserDetailResult — GET /api/core/admin/users/{userId} */
export interface AdminUserDetail {
  basicInfo: AdminUserBasicInfo;
  subscription: AdminSubscriptionResult | null;
  qrUsage: AdminQrUsageOverview;
  billingHistory: Array<AdminPaymentHistoryItem>;
}
