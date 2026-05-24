import { InventorySearchPage, type SearchResultsSearch } from '@/pages/console/staff/inventory-search.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/inventory/search')({
  component: InventorySearchPage,
  validateSearch: (search: Record<string, unknown>): SearchResultsSearch => {
    return {
      q: (search.q as string) || undefined,
      page: search.page ? Number(search.page) : undefined,
    }
  },
})
