import { useEffect, useMemo, useState } from 'react'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { ItemCategory, PostStatus } from '@/services/inventory.service'

const ALL_STATUS = 'All' as const
export type InventoryAllFilter = typeof ALL_STATUS
export type StatusFilter = InventoryAllFilter | PostStatus
export type CategoryFilter = InventoryAllFilter | ItemCategory

export type InventoryListParams = {
  page: number
  pageSize: number
  query?: string
  status?: PostStatus
  category?: ItemCategory
  fromDate?: string
  toDate?: string
  staffId?: string
}

export type UseInventoryListStateOptions = {
  pageSize: number
  defaultStatus: StatusFilter
  defaultCategory?: CategoryFilter
  defaultFromDate?: string
  defaultToDate?: string
  defaultStaffId?: string
}

export function useInventoryListState({
  pageSize,
  defaultStatus,
  defaultCategory = ALL_STATUS,
  defaultFromDate = '',
  defaultToDate = '',
  defaultStaffId = '',
}: UseInventoryListStateOptions) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(defaultStatus)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(defaultCategory)
  const [fromDate, setFromDate] = useState(defaultFromDate)
  const [toDate, setToDate] = useState(defaultToDate)
  const [staffId, setStaffId] = useState(defaultStaffId)
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchTerm.trim(), 500)
  const debouncedStaffId = useDebouncedValue(staffId.trim(), 500)

  const listParams: InventoryListParams = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      query: debouncedSearch || undefined,
      status: statusFilter !== ALL_STATUS ? (statusFilter as PostStatus) : undefined,
      category: categoryFilter !== ALL_STATUS ? (categoryFilter as ItemCategory) : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      staffId: debouncedStaffId || undefined,
    }),
    [currentPage, pageSize, debouncedSearch, statusFilter, categoryFilter, fromDate, toDate, debouncedStaffId],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, categoryFilter, fromDate, toDate, debouncedStaffId])

  useEffect(() => {
    if (fromDate && toDate && fromDate > toDate) {
      setToDate(fromDate)
    }
  }, [fromDate, toDate])

  const clear = ({ preserveStatus = true }: { preserveStatus?: boolean } = {}) => {
    setSearchTerm('')
    if (!preserveStatus) setStatusFilter(defaultStatus)
    setCategoryFilter(defaultCategory)
    setFromDate(defaultFromDate)
    setToDate(defaultToDate)
    setStaffId(defaultStaffId)
  }

  const hasActiveFilters = !!searchTerm || categoryFilter !== defaultCategory || !!fromDate || !!toDate || !!staffId

  return {
    ALL_STATUS,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    staffId,
    setStaffId,
    currentPage,
    setCurrentPage,
    listParams,
    clear,
    hasActiveFilters,
  }
}

