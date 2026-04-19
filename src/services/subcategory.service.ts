import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { InventorySubcategory, ItemCategory } from './inventory.service'

export const subcategoryService = {
  async getAll(category?: ItemCategory): Promise<InventorySubcategory[]> {
    const { data } = await privateClient.get<ApiResponse<InventorySubcategory[]>>('/api/core/subcategories', {
      params: category ? { category } : undefined,
    })

    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch subcategories')
    return [...data.data].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
  },
}
