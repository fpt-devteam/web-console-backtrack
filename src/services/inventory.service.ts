import type { ApiResponse } from '@/types/api-response.type'
import type { PagedResponse } from '@/types/pagination.type'
import { privateClient } from '@/lib/api-client'

export type PostStatus =
  | 'Active'
  | 'InStorage'
  | 'ReturnScheduled'
  | 'Returned'
  | 'Archived'
  | 'Expired'

export type PostType = 'Lost' | 'Found'

// Mirrors BE `Backtrack.Core.Domain.Constants.ItemCategory`
export type ItemCategory = 'PersonalBelongings' | 'Cards' | 'Electronics' | 'Others'

export interface PostAuthorResult {
  id: string
  displayName?: string | null
  avatarUrl?: string | null
}

export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface FinderInfo {
  finderName?: string | null
  email?: string | null
  phone?: string | null
  nationalId?: string | null
  orgMemberId?: string | null
}

export interface OwnerInfo {
  ownerName?: string | null
  email?: string | null
  phone?: string | null
  nationalId?: string | null
  orgMemberId?: string | null
}

export interface PersonalBelongingDetail {
  itemName?: string | null
  color?: string | null
  brand?: string | null
  material?: string | null
  size?: string | null
  condition?: string | null
  distinctiveMarks?: string | null
  aiDescription?: string | null
  additionalDetails?: string | null
}

export interface CardDetail {
  itemName?: string | null
  cardNumberMasked?: string | null
  holderName?: string | null
  dateOfBirth?: string | null
  issueDate?: string | null
  expiryDate?: string | null
  issuingAuthority?: string | null
  ocrText?: string | null
  additionalDetails?: string | null
  aiDescription?: string | null
}

export interface ElectronicDetail {
  itemName?: string | null
  brand?: string | null
  model?: string | null
  color?: string | null
  hasCase?: boolean | null
  caseDescription?: string | null
  screenCondition?: string | null
  lockScreenDescription?: string | null
  distinguishingFeatures?: string | null
  aiDescription?: string | null
  additionalDetails?: string | null
}

export interface OtherDetail {
  itemName: string
  primaryColor?: string | null
  additionalDetails?: string | null
  aiDescription?: string | null
}

export interface InventoryItem {
  id: string
  postType: PostType
  postTitle: string
  status: PostStatus
  category: ItemCategory
  subcategoryId: string
  personalBelongingDetail?: PersonalBelongingDetail | null
  cardDetail?: CardDetail | null
  electronicDetail?: ElectronicDetail | null
  otherDetail?: OtherDetail | null
  imageUrls: Array<string>
  location: GeoPoint
  displayAddress?: string | null
  externalPlaceId?: string | null
  organizationStorageLocation?: string | null
  organizationFoundLocation?: string | null
  eventTime: string
  createdAt: string
  author?: PostAuthorResult | null
  organization?: { id: string; name: string; slug: string } | null
  finderInfo?: FinderInfo | null
}

export interface InventoryListItem extends InventoryItem {
  ownerInfo?: OwnerInfo | null
  returnReportExpiresAt?: string | null
}

export interface InventorySubcategory {
  id: string
  category: ItemCategory
  code: string
  name: string
  displayOrder: number
}

export interface CreateInventoryPayload {
  postTitle: string
  postType?: PostType
  detailItemName?: string
  itemName: string
  description: string
  distinctiveMarks?: string | null
  imageUrls?: Array<string>
  category: ItemCategory
  subcategoryCode: string
  organizationStorageLocation: string
  organizationFoundLocation: string
  /** ISO-8601 timestamp (DateTimeOffset) */
  eventTime: string
  color?: string | null
  brand?: string | null
  condition?: string | null
  material?: string | null
  size?: string | null
  holderName?: string | null
  cardNumber?: string | null
  issuingAuthority?: string | null
  /** `YYYY-MM-DD` for BE `DateOnly` */
  dateOfBirth?: string | null
  issueDate?: string | null
  expiryDate?: string | null
  model?: string | null
  hasCase?: boolean | null
  caseDescription?: string | null
  lockScreenDescription?: string | null
  finderInfo?: FinderInfo | null
}

export interface UpdateInventoryPayload {
  /** UpdatePostCommand.PostType */
  postType?: PostType
  /** UpdatePostCommand.Status */
  status?: PostStatus
  /** UpdatePostCommand.EventTime (ISO DateTimeOffset) */
  eventTime?: string
  /** UpdatePostCommand.ImageUrls */
  imageUrls?: Array<string>
  /** UpdatePostCommand.DisplayAddress */
  displayAddress?: string | null
  /** UpdatePostCommand.ExternalPlaceId */
  externalPlaceId?: string | null
  /** UpdatePostCommand.Location */
  location?: GeoPoint | null
  organizationStorageLocation?: string | null
  organizationFoundLocation?: string | null

  personalBelongingDetail?: {
    itemName: string
    color?: string | null
    brand?: string | null
    material?: string | null
    size?: string | null
    condition?: string | null
    distinctiveMarks?: string | null
    additionalDetails?: string | null
  } | null

  electronicDetail?: {
    itemName: string
    brand?: string | null
    model?: string | null
    color?: string | null
    hasCase?: boolean | null
    caseDescription?: string | null
    screenCondition?: string | null
    lockScreenDescription?: string | null
    distinguishingFeatures?: string | null
    additionalDetails?: string | null
  } | null

  cardDetail?: {
    itemName: string
    cardNumber?: string | null
    holderName?: string | null
    issuingAuthority?: string | null
    dateOfBirth?: string | null
    issueDate?: string | null
    expiryDate?: string | null
    additionalDetails?: string | null
  } | null

  otherDetail?: {
    itemName: string
    primaryColor?: string | null
    additionalDetails?: string | null
  } | null
}

export interface GetInventoryParams {
  page?: number
  pageSize?: number
  query?: string
  status?: PostStatus
  postType?: PostType
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
export type AnalyzeImageResult = {
  category: ItemCategory
  personalBelonging?: PersonalBelongingDetail | null
  electronic?: ElectronicDetail | null
  other?: { itemName: string; primaryColor?: string | null; additionalDetails?: string | null } | null
  card?: {
    itemName?: string | null
    cardNumber?: string | null
    holderName?: string | null
    issuingAuthority?: string | null
    additionalDetails?: string | null
  } | null
  warnings?: Array<string> | null
}

type SearchInventoriesBody = {
  query?: string
  filters?: {
    status?: PostStatus
    postType?: PostType
    category?: ItemCategory
    staffId?: string
    time?: { from?: string; to?: string }
  }
  page?: number
  pageSize?: number
}

export const inventoryService = {
  async create(orgId: string, payload: CreateInventoryPayload): Promise<InventoryItem> {
    const postTitle = payload.postTitle.trim()
    const detailItemName = payload.detailItemName?.trim() || postTitle
    const postType = payload.postType ?? 'Found'
    const body =
      payload.category === 'PersonalBelongings'
        ? {
            postType,
            postTitle,
            category: payload.category,
            subcategoryCode: payload.subcategoryCode,
            organizationStorageLocation: payload.organizationStorageLocation,
            organizationFoundLocation: payload.organizationFoundLocation,
            eventTime: payload.eventTime,
            personalBelongingDetail: {
              itemName: detailItemName,
              color: payload.color ?? undefined,
              brand: payload.brand ?? undefined,
              material: payload.material ?? undefined,
              size: payload.size ?? undefined,
              condition: payload.condition ?? undefined,
              distinctiveMarks: payload.distinctiveMarks ?? undefined,
              additionalDetails: payload.description,
            },
            imageUrls: payload.imageUrls ?? [],
            finderInfo: payload.finderInfo ?? undefined,
          }
        : payload.category === 'Electronics'
          ? {
              postType,
              postTitle,
              category: payload.category,
              subcategoryCode: payload.subcategoryCode,
              organizationStorageLocation: payload.organizationStorageLocation,
              organizationFoundLocation: payload.organizationFoundLocation,
              eventTime: payload.eventTime,
              electronicDetail: {
                itemName: detailItemName,
                brand: payload.brand ?? undefined,
                model: payload.model ?? undefined,
                color: payload.color ?? undefined,
                hasCase: payload.hasCase ?? undefined,
                caseDescription: payload.caseDescription ?? undefined,
                screenCondition: payload.condition ?? undefined,
                lockScreenDescription: payload.lockScreenDescription ?? undefined,
                distinguishingFeatures: payload.distinctiveMarks ?? undefined,
                additionalDetails: payload.description,
              },
              imageUrls: payload.imageUrls ?? [],
              finderInfo: payload.finderInfo ?? undefined,
            }
        : payload.category === 'Cards'
          ? {
              postType,
              postTitle,
              category: payload.category,
              subcategoryCode: payload.subcategoryCode,
              organizationStorageLocation: payload.organizationStorageLocation,
              organizationFoundLocation: payload.organizationFoundLocation,
              eventTime: payload.eventTime,
              cardDetail: {
                itemName: detailItemName,
                cardNumber: payload.cardNumber ?? undefined,
                holderName: payload.holderName ?? undefined,
                issuingAuthority: payload.issuingAuthority ?? undefined,
                dateOfBirth: payload.dateOfBirth ?? undefined,
                issueDate: payload.issueDate ?? undefined,
                expiryDate: payload.expiryDate ?? undefined,
                additionalDetails: payload.description,
              },
              imageUrls: payload.imageUrls ?? [],
              finderInfo: payload.finderInfo ?? undefined,
            }
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          : payload.category === 'Others'
            ? {
                postType,
                postTitle,
                category: payload.category,
                subcategoryCode: payload.subcategoryCode,
                organizationStorageLocation: payload.organizationStorageLocation,
                organizationFoundLocation: payload.organizationFoundLocation,
                eventTime: payload.eventTime,
                otherDetail: {
                  itemName: payload.itemName.trim(),
                  primaryColor: payload.color ?? undefined,
                  additionalDetails: payload.description,
                },
                imageUrls: payload.imageUrls ?? [],
                finderInfo: payload.finderInfo ?? undefined,
              }
            : {
                postType,
                postTitle,
                category: payload.category,
                subcategoryCode: payload.subcategoryCode,
                organizationStorageLocation: payload.organizationStorageLocation,
                organizationFoundLocation: payload.organizationFoundLocation,
                eventTime: payload.eventTime,
                otherDetail: {
                  itemName: payload.itemName.trim(),
                  additionalDetails: payload.description,
                },
                imageUrls: payload.imageUrls ?? [],
                finderInfo: payload.finderInfo ?? undefined,
              }

    const { data } = await privateClient.post<ApiResponse<InventoryItem>>(`/api/core/orgs/${orgId}/inventory`, body)
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create inventory item')
    return data.data
  },

  async search(orgId: string, params?: GetInventoryParams): Promise<PagedResponse<InventoryListItem>> {
    const time = buildInventoryTimeFilter(params?.fromDate, params?.toDate)
    const body: SearchInventoriesBody = {
      query: params?.query?.trim() || undefined,
      filters: {
        status: params?.status ?? undefined,
        postType: params?.postType ?? undefined,
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
      !body.filters?.postType &&
      !body.filters?.category &&
      !body.filters?.staffId &&
      !body.filters?.time
    ) {
      delete body.filters
    }

    const { data } = await privateClient.post<ApiResponse<PagedResponse<InventoryListItem>>>(
      `/api/core/orgs/${orgId}/inventory/search`,
      body,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch inventory')

    const payload = data.data as unknown as {
      items?: InventoryListItem[]
      page?: number
      pageSize?: number
      totalCount?: number
      total?: number
      totalItems?: number
    }

    return {
      items: payload.items ?? [],
      page: payload.page ?? body.page ?? 1,
      pageSize: payload.pageSize ?? body.pageSize ?? 10,
      totalCount: payload.totalCount ?? payload.total ?? payload.totalItems ?? 0,
    }
  },

  async getById(orgId: string, id: string): Promise<InventoryItem> {
    const { data } = await privateClient.get<ApiResponse<InventoryItem>>(`/api/core/orgs/${orgId}/inventory/${id}`)
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch inventory item')
    return data.data
  },

  async delete(orgId: string, id: string): Promise<void> {
    await privateClient.delete(`/api/core/orgs/${orgId}/inventory/${id}`)
  },

  async publish(orgId: string, id: string): Promise<InventoryItem> {
    const { data } = await privateClient.post<ApiResponse<InventoryItem>>(`/api/core/orgs/${orgId}/inventory/${id}/publish`)
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to publish inventory item')
    return data.data
  },

  async update(orgId: string, id: string, payload: UpdateInventoryPayload): Promise<InventoryItem> {
    const { data } = await privateClient.put<ApiResponse<InventoryItem>>(`/api/core/orgs/${orgId}/inventory/${id}`, payload)
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update inventory item')
    return data.data
  },

  /**
   * Ask BE to analyse image URLs for a specific subcategory.
   * Endpoint: POST /api/core/post-image/analyze
   * Body:     { imageUrls: string[], subcategoryCode: string }
   */
  async analyzeImage(imageUrls: Array<string>, subcategoryCode: string): Promise<AnalyzeImageResult> {
    const { data } = await privateClient.post<ApiResponse<AnalyzeImageResult>>(
      '/api/core/post-image/analyze',
      { imageUrls, subcategoryCode },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to analyze image')
    return data.data
  },
}
