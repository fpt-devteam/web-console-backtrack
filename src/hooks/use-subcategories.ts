import { useQuery } from '@tanstack/react-query'
import { subcategoryService } from '@/services/subcategory.service'
import type { ItemCategory } from '@/services/inventory.service'

export const SUBCATEGORY_KEYS = {
  all: ['subcategories'] as const,
  list: (category?: ItemCategory) => ['subcategories', category ?? 'all'] as const,
}

export function useSubcategories(category?: ItemCategory) {
  return useQuery({
    queryKey: SUBCATEGORY_KEYS.list(category),
    queryFn: () => subcategoryService.getAll(category),
  })
}
