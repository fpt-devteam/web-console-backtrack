import { Layout } from '../components/layout';
import { Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import type { OrgStatus } from '@/services/super-admin.service';
import { SEARCH_DEBOUNCE_MS, useDebouncedValue } from '@/hooks/use-debounce';
import { useSuperAdminOrganizations } from '@/hooks/use-super-admin';
import { TableFiltersBar } from '@/components/filters/table-filters-bar';
import { OrgLogo } from '@/components/org-logo';
import { Pagination } from '@/components/ui/pagination';

type SortFilter = 'Newest' | 'Oldest' | 'Name A-Z' | 'Name Z-A';

function getSortParams(sort: SortFilter): { sortBy: string; sortOrder: 'asc' | 'desc' } {
  switch (sort) {
    case 'Newest':   return { sortBy: 'createdAt', sortOrder: 'desc' };
    case 'Oldest':   return { sortBy: 'createdAt', sortOrder: 'asc' };
    case 'Name A-Z': return { sortBy: 'name', sortOrder: 'asc' };
    case 'Name Z-A': return { sortBy: 'name', sortOrder: 'desc' };
  }
}

function getStatusStyle(status: OrgStatus) {
  switch (status) {
    case 'Active':   return { dot: 'bg-green-500', text: 'text-[#06c167]' };
    case 'Pending':  return { dot: 'bg-amber-500',  text: 'text-[#c97a00]' };
    case 'Inactive': return { dot: 'bg-[#929292]', text: 'text-[#929292]' };
    default:         return { dot: 'bg-[#929292]', text: 'text-[#929292]' };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function OrganizationPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const [statusFilter, setStatusFilter] = useState<OrgStatus | 'All'>('All');
  const [sortFilter, setSortFilter] = useState<SortFilter>('Newest');
  const pageSize = 10;

  const { sortBy, sortOrder } = getSortParams(sortFilter);

  const { data, isLoading, isError } = useSuperAdminOrganizations({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === 'All' ? undefined : statusFilter,
    sortBy,
    sortOrder,
  });

  const organizations = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const startIndex = (currentPage - 1) * pageSize;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as OrgStatus | 'All');
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortFilter(value as SortFilter);
    setCurrentPage(1);
  };

  const handleViewOrg = (orgId: string) => {
    router.navigate({ to: '/super-admin/organization/$tenantId', params: { tenantId: orgId } });
  };

  const handleDeleteOrg = (orgId: string, orgName: string) => {
    if (window.confirm(`Are you sure you want to delete ${orgName}?`)) {
      console.log('Delete org:', orgId);
    }
  };

  const statusOptions = [
    { value: 'Active',   label: 'Active' },
    { value: 'Pending',  label: 'Pending' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const sortOptions = [
    { value: 'Newest',   label: 'Newest' },
    { value: 'Oldest',   label: 'Oldest' },
    { value: 'Name A-Z', label: 'Name A-Z' },
    { value: 'Name Z-A', label: 'Name Z-A' },
  ];

  return (
    <Layout>
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        <div className="mb-5">
          <nav className="text-sm text-[#6a6a6a]">
            <span className="hover:text-[#222222] cursor-pointer">Organization</span>
            <span className="mx-2">/</span>
            <span className="text-[#222222] font-medium">Tenants</span>
          </nav>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#222222] mb-2">Tenants</h1>
            <p className="text-[#6a6a6a]">Manage and monitor all active tenant accounts and subscriptions.</p>
          </div>
        </div>

        <TableFiltersBar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              label: 'Status',
              value: statusFilter,
              onChange: handleStatusChange,
              options: statusOptions,
              allLabel: 'All',
            },
            {
              label: 'Sort',
              value: sortFilter,
              onChange: handleSortChange,
              options: sortOptions,
              showAll: false,
            },
          ]}
          className="mb-6"
        />

        <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f7f7f7] border-b border-[#ebebeb]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Tenant Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Admin Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#6a6a6a] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#6a6a6a]">
                      Loading...
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#c13515]">
                      Failed to load organizations.
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && organizations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#6a6a6a]">
                      No organizations found.
                    </td>
                  </tr>
                )}
                {organizations.map((org) => {
                  const statusStyle = getStatusStyle(org.status);
                  return (
                    <tr key={org.id} className="hover:bg-[#f7f7f7] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <OrgLogo logoUrl={org.logoUrl} alt={org.name} className="h-10 w-10" />
                          <button
                            onClick={() => handleViewOrg(org.id)}
                            className="font-medium text-[#222222] hover:text-[#ff385c] transition-colors text-left"
                          >
                            {org.name}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6a6a6a]">{org.adminEmail}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                          <span className={`text-sm font-medium ${statusStyle.text}`}>{org.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6a6a6a]">{formatDate(org.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6a6a6a]">
                          {org.capacity.current} / {org.capacity.limit || '∞'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewOrg(org.id)}
                            className="p-2 text-[#929292] hover:text-[#06c167] hover:bg-[#e8f9f0] rounded-lg transition-colors"
                            title="View Tenant Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrg(org.id, org.name)}
                            className="p-2 text-[#929292] hover:text-[#c13515] hover:bg-[#fff0f2] rounded-lg transition-colors"
                            title="Delete Tenant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-[#dddddd] flex items-center justify-between">
            <div className="text-sm text-[#6a6a6a]">
              {totalCount > 0
                ? `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, totalCount)} of ${totalCount} results`
                : 'No results'}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
