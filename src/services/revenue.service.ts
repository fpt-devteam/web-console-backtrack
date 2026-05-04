import type { ApiResponse } from '@/types/api-response.type'
import type {
  MonthlyRevenueItem,
  RevenueStatus,
  RevenueSummary,
  RevenueTransaction,
  RevenueTransactionsPage,
  SubscriberType,
} from '@/mock/data/mock-revenue'
import { privateClient } from '@/lib/api-client'

export type { RevenueSummary, RevenueTransaction, MonthlyRevenueItem, RevenueStatus, SubscriberType, RevenueTransactionsPage }

export interface GetTransactionsParams {
  page?: number
  pageSize?: number
  subscriberType?: SubscriberType | 'All'
  status?: RevenueStatus | 'All'
  search?: string
}

interface RawTransaction {
  id: string
  revenueType: string
  tenantId?: string
  tenantName?: string
  userId?: string
  userName?: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  transactionDate: string
  description: string
  invoiceNumber?: string
  subscriptionPlan?: string
}

export const revenueService = {
  async getSummary(): Promise<RevenueSummary> {
    const { data } = await privateClient.get<ApiResponse<RevenueSummary>>(
      '/api/core/admin/revenue/summary'
    )
    if (!data.success) throw new Error('Failed to fetch revenue summary')
    return data.data
  },

  async getMonthly(months = 12): Promise<Array<MonthlyRevenueItem>> {
    const { data } = await privateClient.get<ApiResponse<Array<MonthlyRevenueItem>>>(
      '/api/core/admin/revenue/monthly',
      { params: { months } }
    )
    if (!data.success) throw new Error('Failed to fetch monthly revenue')
    return data.data
  },

  async getTransactions(params?: GetTransactionsParams): Promise<RevenueTransactionsPage> {
    const { subscriberType, status, ...rest } = params ?? {}
    const query = {
      ...rest,
      ...(subscriberType && subscriberType !== 'All' ? { subscriberType } : {}),
      ...(status && status !== 'All' ? { paymentStatus: status } : {}),
    }
    const { data } = await privateClient.get<ApiResponse<{ items: Array<RawTransaction>; total: number }>>(
      '/api/core/admin/revenue/transactions',
      { params: query }
    )
    if (!data.success) throw new Error('Failed to fetch revenue transactions')
    return {
      total: data.data.total,
      items: data.data.items.map((item): RevenueTransaction => ({
        id: item.id,
        subscriberType: item.revenueType === 'Subscription' ? 'Organization' : 'User',
        tenantId: item.tenantId,
        tenantName: item.tenantName,
        userId: item.userId,
        userName: item.userName || undefined,
        amount: item.amount,
        currency: item.currency,
        status: (item.status === 'Completed' ? 'Succeeded' : item.status) as RevenueStatus,
        paymentMethod: item.paymentMethod,
        transactionDate: new Date(item.transactionDate),
        description: item.description,
        invoiceNumber: item.invoiceNumber,
        subscriptionPlan: item.subscriptionPlan,
      })),
    }
  },
}
