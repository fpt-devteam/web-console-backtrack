/**
 * Mock JSON API responses for the Super Admin Dashboard.
 *
 * Represents the shape of data that would be returned by:
 *   GET /api/core/super-admin/dashboard/post-monthly
 *   GET /api/core/super-admin/dashboard/revenue-monthly
 */

// ── Response envelope ──────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

// ── Post monthly trend ─────────────────────────────────────────────────────

export interface PostMonthlyItem {
  month: string
  year: number
  lost: number
  found: number
}

// ── Revenue monthly ────────────────────────────────────────────────────────

export interface RevenueMonthlyItem {
  month: string
  year: number
  /** Org subscription revenue (USD thousands) */
  org: number
  /** Per-user fee revenue (USD thousands) */
  user: number
}

/**
 * GET /api/core/super-admin/dashboard/revenue-monthly
 *
 * Returns one entry per calendar month, ordered oldest → newest.
 */
export const mockRevenueMonthly: ApiSuccess<Array<RevenueMonthlyItem>> = {
  success: true,
  data: [
    { month: 'May',  year: 2025, org: 12.4, user: 3.2 },
    { month: 'Jun',  year: 2025, org: 14.2, user: 3.8 },
    { month: 'Jul',  year: 2025, org: 15.8, user: 4.1 },
    { month: 'Aug',  year: 2025, org: 17.2, user: 4.6 },
    { month: 'Sep',  year: 2025, org: 16.8, user: 4.4 },
    { month: 'Oct',  year: 2025, org: 19.1, user: 5.2 },
    { month: 'Nov',  year: 2025, org: 21.3, user: 5.8 },
    { month: 'Dec',  year: 2025, org: 23.6, user: 6.3 },
    { month: 'Jan',  year: 2026, org: 25.2, user: 6.9 },
    { month: 'Feb',  year: 2026, org: 24.1, user: 6.6 },
    { month: 'Mar',  year: 2026, org: 27.4, user: 7.4 },
    { month: 'Apr',  year: 2026, org: 29.8, user: 8.1 },
  ],
}

// ── Post monthly trend ─────────────────────────────────────────────────────

/**
 * GET /api/core/super-admin/dashboard/post-monthly
 *
 * Returns one entry per calendar month, ordered oldest → newest.
 * The chart component slices from the tail: 7d = last 7 months, 30d = last 30, 90d = all.
 */
export const mockPostMonthly: ApiSuccess<Array<PostMonthlyItem>> = {
  success: true,
  data: [
    { month: 'May',  year: 2025, lost: 34, found: 52 },
    { month: 'Jun',  year: 2025, lost: 38, found: 57 },
    { month: 'Jul',  year: 2025, lost: 41, found: 63 },
    { month: 'Aug',  year: 2025, lost: 45, found: 68 },
    { month: 'Sep',  year: 2025, lost: 39, found: 60 },
    { month: 'Oct',  year: 2025, lost: 47, found: 72 },
    { month: 'Nov',  year: 2025, lost: 52, found: 79 },
    { month: 'Dec',  year: 2025, lost: 49, found: 74 },
    { month: 'Jan',  year: 2026, lost: 55, found: 83 },
    { month: 'Feb',  year: 2026, lost: 51, found: 78 },
    { month: 'Mar',  year: 2026, lost: 58, found: 89 },
    { month: 'Apr',  year: 2026, lost: 62, found: 94 },
  ],
}
