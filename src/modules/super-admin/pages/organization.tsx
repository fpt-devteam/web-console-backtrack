import { Layout } from '../components/layout';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from '@tanstack/react-router';
import { mockTenants, type TenantStatus } from '@/mock/data/mock-tenants';
import { TableFiltersBar } from '@/components/filters/table-filters-bar';
import { Pagination } from '@/components/ui/pagination';

/**
 * Organization (Tenants) Page
 * 
 * Displays a table of all tenant accounts with search, filter,
 * and pagination functionality.
 */
export function OrganizationPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'All'>('All');
  const [sortFilter, setSortFilter] = useState<'Newest' | 'Oldest' | 'Name A-Z' | 'Name Z-A'>('Newest');
  const pageSize = 5;

  // Filter tenants by search term and status
  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort tenants
  const sortedTenants = [...filteredTenants].sort((a, b) => {
    switch (sortFilter) {
      case 'Newest':
        return b.createdDate.getTime() - a.createdDate.getTime();
      case 'Oldest':
        return a.createdDate.getTime() - b.createdDate.getTime();
      case 'Name A-Z':
        return a.name.localeCompare(b.name);
      case 'Name Z-A':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedTenants.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTenants = sortedTenants.slice(startIndex, endIndex);

  /**
   * Gets status color and dot color based on tenant status
   * 
   * @param status - Tenant status
   * @returns Object with background and dot colors
   */
  const getStatusStyle = (status: TenantStatus) => {
    switch (status) {
      case 'Active':
        return {
          dot: 'bg-green-500',
          text: 'text-green-700',
        };
      case 'Pending':
        return {
          dot: 'bg-orange-500',
          text: 'text-orange-700',
        };
      case 'Inactive':
        return {
          dot: 'bg-gray-400',
          text: '',
        };
      default:
        return {
          dot: 'bg-gray-400',
          text: '',
        };
    }
  };

  /**
   * Formats date to readable string
   * 
   * @param date - Date to format
   * @returns Formatted date string
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  /**
   * Formats last activity to relative time
   * 
   * @param date - Date to format
   * @returns Relative time string
   */
  const formatLastActivity = (date: Date) => {
    const distance = formatDistanceToNow(date, { addSuffix: true });
    return distance.replace('about ', '').replace(' ago', ' ago');
  };

  const handleAddTenant = () => {
    router.navigate({ to: '/super-admin/add-tenant' });
  };

  /**
   * Handles navigation to tenant detail page
   * 
   * @param tenantId - ID of the tenant to view
   */
  const handleViewTenant = (tenantId: string) => {
    router.navigate({ to: '/super-admin/organization/$tenantId', params: { tenantId } });
  };

  const handleEditTenant = (tenantId: string) => {
    router.navigate({ to: '/super-admin/edit-tenant/$tenantId', params: { tenantId } });
  };

  const handleDeleteTenant = (tenantId: string, tenantName: string) => {
    // TODO: Implement delete tenant functionality
    if (window.confirm(`Are you sure you want to delete ${tenantName}?`)) {
      console.log('Delete tenant:', tenantId);
    }
  };

  // Filter options
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const sortOptions = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Oldest', label: 'Oldest' },
    { value: 'Name A-Z', label: 'Name A-Z' },
    { value: 'Name Z-A', label: 'Name Z-A' },
  ];

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Organization</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Tenants</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenants</h1>
            <p className="">
              Manage and monitor all active tenant accounts and subscriptions.
            </p>
          </div>
          <button
            onClick={handleAddTenant}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Tenant
          </button>
        </div>

        {/* Search and Filter Bar */}
        <TableFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by name, subdomain, or email..."
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

        {/* Tenants Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    Tenant Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    Subdomain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    Admin Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTenants.map((tenant) => {
                  const statusStyle = getStatusStyle(tenant.status);
                  return (
                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${tenant.avatarColor} flex items-center justify-center text-gray-700 font-semibold text-sm`}>
                            {tenant.avatarText}
                          </div>
                          <button
                            onClick={() => router.navigate({ to: '/super-admin/organization/$tenantId', params: { tenantId: tenant.id } })}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
                          >
                            {tenant.name}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="">{tenant.subdomain}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                          <span className={`text-sm font-medium ${statusStyle.text}`}>
                            {tenant.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="">{formatDate(tenant.createdDate)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="">{tenant.adminEmail}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="">{formatLastActivity(tenant.lastActivity)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewTenant(tenant.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Tenant Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditTenant(tenant.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Tenant"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm ">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedTenants.length)} of {sortedTenants.length} results
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
