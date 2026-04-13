import { Layout } from '../components/layout';
import { Eye, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce';
import type { AdminUserStatus, AdminUserSummary } from '@/types/admin-user.types';
import { TableFiltersBar } from '@/components/filters/table-filters-bar';
import { Pagination } from '@/components/ui/pagination';
import { useRouter } from '@tanstack/react-router';
import { useAdminUsers } from '@/hooks/use-admin-users';

function rowDisplayName(u: AdminUserSummary): string {
  return (u.displayName || u.email || 'Unknown').trim();
}

function roleLabel(u: AdminUserSummary): string {
  return u.globalRole === 'PlatformSuperAdmin' ? 'Super Admin' : 'User';
}

/**
 * User Management Page
 *
 * GET /api/core/admin/users — paginated list, search, status filter.
 */
export function UsersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | 'All'>('All');
  const [sortFilter, setSortFilter] = useState<'Newest' | 'Oldest' | 'Name A-Z' | 'Name Z-A'>('Newest');
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminUsers({
    page: currentPage,
    pageSize,
    search: debouncedSearchTerm || undefined,
    status: statusFilter === 'All' ? undefined : statusFilter,
  });

  const sortedItems = useMemo(() => {
    const items = [...(data?.items ?? [])];
    items.sort((a, b) => {
      const nameA = rowDisplayName(a);
      const nameB = rowDisplayName(b);
      switch (sortFilter) {
        case 'Newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'Oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'Name A-Z':
          return nameA.localeCompare(nameB);
        case 'Name Z-A':
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });
    return items;
  }, [data?.items, sortFilter]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = total === 0 ? 0 : Math.min(currentPage * pageSize, total);

  const getStatusStyle = (status: AdminUserStatus) => {
    switch (status) {
      case 'Active':
        return { dot: 'bg-green-500', text: 'text-green-700' };
      case 'Inactive':
        return { dot: 'bg-gray-400', text: 'text-gray-600' };
      default:
        return { dot: 'bg-gray-400', text: 'text-gray-600' };
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleViewUser = (userId: string) => {
    router.navigate({ to: '/super-admin/users/$userId', params: { userId } });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      console.log('Delete user:', userId);
    }
  };

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const sortOptions = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Oldest', label: 'Oldest' },
    { value: 'Name A-Z', label: 'Name A-Z' },
    { value: 'Name Z-A', label: 'Name Z-A' },
  ];

  const errMessage = error instanceof Error ? error.message : 'Failed to load users';

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">User Management</span>
          </nav>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
            <p className="text-gray-600">
              Manage and monitor all user accounts, roles, and permissions.
            </p>
          </div>
        </div>

        {isError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between gap-4">
            <span>{errMessage}</span>
            <button
              type="button"
              className="shrink-0 font-medium text-red-900 underline"
              onClick={() => void refetch()}
            >
              Retry
            </button>
          </div>
        ) : null}

        <TableFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              label: 'Status',
              value: statusFilter,
              onChange: (value) => setStatusFilter(value as typeof statusFilter),
              options: statusOptions,
              allLabel: 'All',
            },
            {
              label: 'Sort',
              value: sortFilter,
              onChange: (value) => setSortFilter(value as typeof sortFilter),
              options: sortOptions,
              showAll: false,
            },
          ]}
          className="mb-6"
        />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
          {isFetching ? (
            <div className="absolute inset-0 z-10 bg-white/50 pointer-events-none" aria-hidden />
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b-1 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Loading users…
                    </td>
                  </tr>
                ) : sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  sortedItems.map((user) => {
                    const statusStyle = getStatusStyle(user.status);
                    const label = rowDisplayName(user);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600">{user.email ?? '—'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600">{roleLabel(user)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                            <span className={`text-sm font-medium ${statusStyle.text}`}>{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600">{formatDate(user.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600">—</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewUser(user.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="View User Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, label)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {total === 0
                ? 'No results'
                : `Showing ${startIndex} to ${endIndex} of ${total} results`}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
