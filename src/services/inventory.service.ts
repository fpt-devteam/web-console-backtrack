import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { PagedResponse } from '@/types/pagination.type'

export interface InventoryItem {
  id: string
  orgId: string
  loggedById: string
  itemName: string
  description: string
  distinctiveMarks?: string | null
  imageUrls: string[]
  storageLocation?: string | null
  status: string
  loggedAt: string
  createdAt: string
}

export interface InventorySemanticResult extends InventoryItem {
  similarityScore: number
}

export interface CreateInventoryPayload {
  itemName: string
  description: string
  distinctiveMarks?: string | null
  imageUrls?: string[]
  storageLocation?: string | null
}

export interface UpdateInventoryPayload {
  itemName?: string
  description?: string
  distinctiveMarks?: string | null
  imageUrls?: string[]
  storageLocation?: string | null
  status?: string
}

export interface GetInventoryParams {
  page?: number
  pageSize?: number
  searchTerm?: string
  status?: string
}

export interface SearchInventorySemanticParams {
  searchText: string
  page?: number
  pageSize?: number
}

export const inventoryService = {
  async create(orgId: string, payload: CreateInventoryPayload): Promise<InventoryItem> {
    const { data } = await privateClient.post<ApiResponse<InventoryItem>>(
      `/api/core/orgs/${orgId}/inventory`,
      payload,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create inventory item')
    return data.data
  },

  async getAll(orgId: string, params?: GetInventoryParams): Promise<PagedResponse<InventoryItem>> {
    const { data } = await privateClient.get<ApiResponse<PagedResponse<InventoryItem>>>(
      `/api/core/orgs/${orgId}/inventory`,
      { params },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch inventory')
    return data.data
  },

  async getById(orgId: string, id: string): Promise<InventoryItem> {
    const { data } = await privateClient.get<ApiResponse<InventoryItem>>(
      `/api/core/orgs/${orgId}/inventory/${id}`,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch inventory item')
    return data.data
  },

  async update(orgId: string, id: string, payload: UpdateInventoryPayload): Promise<InventoryItem> {
    const { data } = await privateClient.put<ApiResponse<InventoryItem>>(
      `/api/core/orgs/${orgId}/inventory/${id}`,
      payload,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update inventory item')
    return data.data
  },

  async delete(orgId: string, id: string): Promise<void> {
    await privateClient.delete(`/api/core/orgs/${orgId}/inventory/${id}`)
  },

  async searchSemantic(
    orgId: string,
    params: SearchInventorySemanticParams,
  ): Promise<PagedResponse<InventorySemanticResult>> {
    const { data } = await privateClient.get<ApiResponse<PagedResponse<InventorySemanticResult>>>(
      `/api/core/orgs/${orgId}/inventory/search/semantic`,
      { params },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to search inventory')
    return data.data
  },
}
