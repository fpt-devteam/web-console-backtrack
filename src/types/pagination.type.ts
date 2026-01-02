export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CursorPagedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
