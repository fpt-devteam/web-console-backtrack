import { SearchResultsPage, type SearchResultsSearch } from '@/modules/console/pages/staff/search-results'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/inventory-search')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchResultsSearch => {
    return {
      q: (search.q as string) || undefined,
      category: (search.category as string) || undefined,
      location: (search.location as string) || undefined,
      date: (search.date as string) || undefined,
      page: search.page ? Number(search.page) : undefined,
    }
  },
})

function RouteComponent() {
  return <SearchResultsPage />
}
