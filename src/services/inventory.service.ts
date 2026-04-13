import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { PagedResponse } from '@/types/pagination.type'

export type PostStatus =
  | 'Active'
  | 'InStorage'
  | 'ReturnScheduled'
  | 'Returned'
  | 'Archived'
  | 'Expired'

export type PostType = 'Lost' | 'Found'

export type ItemCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Accessories'
  | 'Documents'
  | 'Wallet'
  | 'Suitcase'
  | 'Bags'
  | 'Keys'
  | 'Other'

export interface PostItem {
  itemName: string
  category: ItemCategory
  color?: string | null
  brand?: string | null
  condition?: string | null
  material?: string | null
  size?: string | null
  distinctiveMarks?: string | null
  additionalDetails?: string | null
}

export interface PostAuthorResult {
  id: string
  displayName?: string | null
  avatarUrl?: string | null
}

export interface InventoryPost {
  id: string
  postType: PostType
  status: PostStatus
  item: PostItem
  imageUrls: string[]
  location?: { latitude: number; longitude: number } | null
  displayAddress?: string | null
  externalPlaceId?: string | null
  eventTime?: string | null
  createdAt: string
  author?: PostAuthorResult | null
  organization?: { id: string; name: string; slug: string } | null
  finderInfo?: {
    finderName?: string | null
    email?: string | null
    phone?: string | null
    nationalId?: string | null
    orgMemberId?: string | null
  } | null
}

export interface CreateInventoryPayload {
  itemName: string
  description: string
  distinctiveMarks?: string | null
  imageUrls?: string[]
  category?: ItemCategory
  color?: string | null
  brand?: string | null
  condition?: string | null
  material?: string | null
  size?: string | null
  finderInfo?: {
    finderName?: string | null
    email?: string | null
    phone?: string | null
    nationalId?: string | null
    orgMemberId?: string | null
  } | null
}

export interface UpdateInventoryPayload {
  itemName?: string
  description?: string
  distinctiveMarks?: string | null
  imageUrls?: string[]
  category?: ItemCategory
  color?: string | null
  brand?: string | null
  condition?: string | null
  material?: string | null
  size?: string | null
  status?: PostStatus
}

export interface GetInventoryParams {
  page?: number
  pageSize?: number
  query?: string
  status?: PostStatus
  category?: ItemCategory
  /** Maps to BE `InventoryFilter.staffId` → post author (Firebase UID). */
  staffId?: string
  /** HTML `input type="date"` value `YYYY-MM-DD`; sent as `filters.time.from` / `.to` (UTC day bounds). */
  fromDate?: string
  toDate?: string
}

/** BE expects `filters.time: { from?, to? }` as ISO-8601 DateTimeOffset strings. */
function buildInventoryTimeFilter(
  fromDate?: string,
  toDate?: string,
): { from?: string; to?: string } | undefined {
  const from = fromDate?.trim()
  const to = toDate?.trim()
  if (!from && !to) return undefined
  return {
    ...(from ? { from: `${from}T00:00:00.000Z` } : {}),
    ...(to ? { to: `${to}T23:59:59.999Z` } : {}),
  }
}

/** Shape returned by BE POST /post-image/analyze */
export interface AnalyzeImageResult {
  itemName?: string | null
  category?: ItemCategory | null
  color?: string | null
  brand?: string | null
  condition?: string | null
  material?: string | null
  size?: string | null
  distinctiveMarks?: string | null
  additionalDetails?: string | null
}

type SearchInventoriesBody = {
  query?: string
  filters?: {
    status?: PostStatus
    category?: ItemCategory
    staffId?: string
    time?: { from?: string; to?: string }
  }
  page?: number
  pageSize?: number
}

export const inventoryService = {
  async create(orgId: string, payload: CreateInventoryPayload): Promise<InventoryPost> {
    const body = {
      item: {
        itemName: payload.itemName,
        category: payload.category ?? 'Other',
        distinctiveMarks: payload.distinctiveMarks ?? undefined,
        color: payload.color ?? undefined,
        brand: payload.brand ?? undefined,
        condition: payload.condition ?? undefined,
        material: payload.material ?? undefined,
        size: payload.size ?? undefined,
        additionalDetails: payload.description,
      },
      imageUrls: payload.imageUrls ?? [],
      finderInfo: payload.finderInfo ?? undefined,
    }

    const { data } = await privateClient.post<ApiResponse<InventoryPost>>(
      `/api/core/orgs/${orgId}/inventory`,
      body,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create inventory item')
    return data.data
  },

  async search(orgId: string, params?: GetInventoryParams): Promise<PagedResponse<InventoryPost>> {
    const time = buildInventoryTimeFilter(params?.fromDate, params?.toDate)
    const body: SearchInventoriesBody = {
      query: params?.query?.trim() || undefined,
      filters: {
        status: params?.status ?? undefined,
        category: params?.category ?? undefined,
        staffId: params?.staffId?.trim() || undefined,
        time,
      },
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    }

    // Keep payload minimal (avoid sending empty filters)
    if (
      !body.filters?.status &&
      !body.filters?.category &&
      !body.filters?.staffId &&
      !body.filters?.time
    ) {
      delete body.filters
    }

    const { data } = await privateClient.post<ApiResponse<PagedResponse<InventoryPost>>>(
      `/api/core/orgs/${orgId}/inventory/search`,
      body,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch inventory')
    return data.data
  },

  async getById(orgId: string, id: string): Promise<InventoryPost> {
    const { data } = await privateClient.get<ApiResponse<InventoryPost>>(
      `/api/core/orgs/${orgId}/inventory/${id}`,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch inventory item')
    return data.data
  },

  async update(orgId: string, id: string, payload: UpdateInventoryPayload): Promise<InventoryPost> {
    const body = {
      status: payload.status ?? undefined,
      item:
        payload.itemName ||
        payload.description ||
        payload.distinctiveMarks ||
        payload.category ||
        payload.color ||
        payload.brand ||
        payload.condition ||
        payload.material ||
        payload.size
          ? {
              itemName: payload.itemName,
              category: payload.category,
              distinctiveMarks: payload.distinctiveMarks ?? undefined,
              color: payload.color ?? undefined,
              brand: payload.brand ?? undefined,
              condition: payload.condition ?? undefined,
              material: payload.material ?? undefined,
              size: payload.size ?? undefined,
              additionalDetails: payload.description,
            }
          : undefined,
      imageUrls: payload.imageUrls ?? undefined,
    }

    const { data } = await privateClient.put<ApiResponse<InventoryPost>>(
      `/api/core/orgs/${orgId}/inventory/${id}`,
      body,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update inventory item')
    return data.data
  },

  async delete(orgId: string, id: string): Promise<void> {
    await privateClient.delete(`/api/core/orgs/${orgId}/inventory/${id}`)
  },

  async publish(orgId: string, id: string): Promise<InventoryPost> {
    const { data } = await privateClient.post<ApiResponse<InventoryPost>>(
      `/api/core/orgs/${orgId}/inventory/${id}/publish`,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to publish inventory item')
    return data.data
  },

  /**
   * Ask BE to analyse an image URL and return suggested PostItem fields.
   * Endpoint: POST /api/core/post-image/analyze
   * Body:     { imageUrl: string }
   */
  async analyzeImage(imageUrl: string): Promise<AnalyzeImageResult> {
    const { data } = await privateClient.post<ApiResponse<AnalyzeImageResult>>(
      '/api/core/post-image/analyze',
      { imageUrl },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to analyze image')
    return data.data
  },
}
