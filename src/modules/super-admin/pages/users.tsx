import { Layout } from '../components/layout';
import { Ghost, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce';
import type { AdminUserStatus, AdminUserSummary } from '@/types/admin-user.types';
import { TableFiltersBar } from '@/components/filters/table-filters-bar';
import { Pagination } from '@/components/ui/pagination';
import { useAdminUsers } from '@/hooks/use-admin-users';
import { useRouter, useSearch } from '@tanstack/react-router';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { UserDetailPanel } from './user-detail';

function rowDisplayName(u: AdminUserSummary): string {
  return (u.displayName || u.email || 'Unknown').trim();
}

function roleLabel(u: AdminUserSummary): string {
  return u.globalRole === 'PlatformSuperAdmin' ? 'Super Admin' : 'User';
}

function getStatusStyle(status: AdminUserStatus) {
  switch (status) {
    case 'Active':   return { dot: 'bg-green-500', text: 'text-[#06c167]' };
    case 'Inactive': return { dot: 'bg-[#929292]', text: 'text-[#929292]' };
    default:         return { dot: 'bg-[#929292]', text: 'text-[#929292]' };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function UsersPage() {
  const router = useRouter();
  const { userId } = useSearch({ from: '/super-admin/users' });

  const closeUserDetail = () => {
    router.navigate({ to: '/super-admin/users', search: {} });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | 'All'>('All');
  const pageSize = 10;

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter]);

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminUsers({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === 'All' ? undefined : statusFilter,
  });

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const realUserCount = data?.realUserCount ?? 0;
  const anonymousCount = data?.anonymousCount ?? 0;
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min(currentPage * pageSize, totalCount);

  const statusOptions = [
    { value: 'Active',   label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const errMessage = error instanceof Error ? error.message : 'Failed to load users';

  return (
    <Layout>
      <Sheet open={Boolean(userId)} onOpenChange={(open) => !open && closeUserDetail()}>
        <SheetContent
          side="right"
          showCloseButton
          className="flex h-full w-full max-h-screen flex-col gap-0 overflow-hidden border-l p-0 sm:max-w-3xl lg:max-w-4xl"
        >
          {userId ? (
            <UserDetailPanel userId={userId} onClose={closeUserDetail} variant="drawer" />
          ) : null}
        </SheetContent>
      </Sheet>

      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#222222] mb-1">Users</h1>
            <p className="text-[#6a6a6a]">Manage and monitor all user accounts, roles, and permissions.</p>
          </div>

          {/* Real / Anonymous stat pills */}
          {!isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-[#dddddd] rounded-[20px] px-4 py-2">
                <Users className="w-4 h-4 text-[#06c167]" />
                <span className="text-sm font-semibold text-[#222222]">{realUserCount.toLocaleString()}</span>
                <span className="text-xs text-[#6a6a6a]">real users</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-[#dddddd] rounded-[20px] px-4 py-2">
                <Ghost className="w-4 h-4 text-[#929292]" />
                <span className="text-sm font-semibold text-[#222222]">{anonymousCount.toLocaleString()}</span>
                <span className="text-xs text-[#6a6a6a]">anonymous</span>
              </div>
            </div>
          )}
        </div>

        {isError && (
          <div className="mb-4 rounded-[10px] border border-[#c13515]/20 bg-[#fff0f2] px-4 py-3 text-sm text-[#c13515] flex items-center justify-between gap-4">
            <span>{errMessage}</span>
            <button type="button" className="shrink-0 font-medium underline" onClick={() => void refetch()}>
              Retry
            </button>
          </div>
        )}

        <TableFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              label: 'Status',
              value: statusFilter,
              onChange: (v) => setStatusFilter(v as typeof statusFilter),
              options: statusOptions,
              allLabel: 'All',
            },
          ]}
          className="mb-6"
        />

        <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden relative">
          {isFetching && <div className="absolute inset-0 z-10 bg-white/50 pointer-events-none" aria-hidden />}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f7f7f7] border-b border-[#ebebeb]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#6a6a6a]">Loading users…</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#6a6a6a]">No users match your filters.</td>
                  </tr>
                ) : (
                  items.map((user) => {
                    const statusStyle = getStatusStyle(user.status);
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                        onClick={() => {
                          router.navigate({
                            to: '/super-admin/users',
                            search: { userId: user.id },
                          });
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0 text-xs font-semibold text-[#6a6a6a]">
                                {rowDisplayName(user).charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium text-[#222222]">{rowDisplayName(user)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-[#6a6a6a]">{user.email ?? '—'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-[#6a6a6a]">{roleLabel(user)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                            <span className={`text-sm font-medium ${statusStyle.text}`}>{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-[#6a6a6a]">{formatDate(user.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-[#dddddd] flex items-center justify-between">
            <div className="text-sm text-[#6a6a6a]">
              {totalCount === 0
                ? 'No results'
                : `Showing ${startIndex} to ${endIndex} of ${totalCount} results`}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
