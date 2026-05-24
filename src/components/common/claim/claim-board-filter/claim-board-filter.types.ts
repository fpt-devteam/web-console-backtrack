export type AssigneeFilter = 'all' | 'mine' | 'unassigned'
export type SortOption = 'newest' | 'oldest'

export interface ClaimBoardFilterState {
  assignee: AssigneeFilter
  sort: SortOption
}

export const DEFAULT_FILTER: ClaimBoardFilterState = {
  assignee: 'all',
  sort: 'newest',
}
