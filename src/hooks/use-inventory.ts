import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  inventoryService,
  type CreateInventoryPayload,
  type GetInventoryParams,
  type ItemCategory,
  type UpdateInventoryPayload,
} from '@/services/inventory.service'

export const INVENTORY_KEYS = {
  all: (orgId: string | null) => ['inventory', orgId] as const,
  list: (orgId: string | null, params?: GetInventoryParams) => ['inventory', orgId, 'list', params] as const,
  detail: (orgId: string | null, id: string) => ['inventory', orgId, id] as const,
}

export function useInventoryItems(orgId: string | null, params?: GetInventoryParams) {
  return useQuery({
    queryKey: INVENTORY_KEYS.list(orgId, params),
    queryFn: () => inventoryService.search(orgId!, params),
    enabled: !!orgId,
  })
}

/**
 * Count in-storage inventory items that share a claim's subcategory — i.e. the
 * items a staff could match this claim against. Items already reviewed and marked
 * as not-a-match (`excludeIds`) are left out. Reuses the same query key as the
 * verify picker (per category + InStorage), so React Query dedupes across all
 * claim cards: at most one request per category for the whole board.
 */
export function useMatchingInventoryCount(
  orgId: string | null,
  category?: string | null,
  subCategoryId?: string | null,
  excludeIds?: Array<string> | null,
) {
  const enabled = !!orgId && !!category
  const { data } = useInventoryItems(enabled ? orgId : null, {
    category: (category ?? undefined) as ItemCategory | undefined,
    status: 'InStorage',
    pageSize: 50,
  })
  if (!subCategoryId) return 0
  const excluded = new Set(excludeIds ?? [])
  return (data?.items ?? []).filter(
    (item) => item.subcategoryId === subCategoryId && !excluded.has(item.id),
  ).length
}

export function useInventoryItem(orgId: string | null, id: string | null) {
  return useQuery({
    queryKey: INVENTORY_KEYS.detail(orgId, id!),
    queryFn: () => inventoryService.getById(orgId!, id!),
    enabled: !!orgId && !!id,
  })
}

export function useCreateInventoryItem(orgId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateInventoryPayload) => inventoryService.create(orgId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all(orgId) })
    },
  })
}

export function useArchiveInventoryItem(orgId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => inventoryService.archive(orgId!, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all(orgId) })
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.detail(orgId, id) })
    },
  })
}

export function usePublishInventoryItem(orgId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => inventoryService.publish(orgId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all(orgId) })
    },
  })
}

export function useUpdateInventoryItem(orgId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInventoryPayload }) => inventoryService.update(orgId!, id, payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all(orgId) })
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.detail(orgId, vars.id) })
    },
  })
}
