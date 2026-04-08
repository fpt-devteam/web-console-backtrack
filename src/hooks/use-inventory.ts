import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  inventoryService,
  type CreateInventoryPayload,
  type UpdateInventoryPayload,
  type GetInventoryParams,
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

export function useUpdateInventoryItem(orgId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInventoryPayload }) =>
      inventoryService.update(orgId!, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all(orgId) })
    },
  })
}

export function useDeleteInventoryItem(orgId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => inventoryService.delete(orgId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all(orgId) })
    },
  })
}
