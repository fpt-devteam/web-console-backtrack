import { Layout } from '../components/layout';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { mockSuperAdminUsers, type UserRole, type UserStatus } from '@/mock/data/mock-super-admin-users';
import { TableFiltersBar } from '@/components/filters/table-filters-bar';
import { Pagination } from '@/components/ui/pagination';

/**
 * User Management Page
 * 
 * Displays a table of all users with search, filter by role and status,
 * and pagination functionality.
 */
export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All');
  const [sortFilter, setSortFilter] = useState<'Newest' | 'Oldest' | 'Name A-Z' | 'Name Z-A'>('Newest');
  const pageSize = 10;

  // Filter users by search term, role, and status
  const filteredUsers = mockSuperAdminUsers.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortFilter) {
      case 'Newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'Oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'Name A-Z':
        return a.displayName.localeCompare(b.displayName);
      case 'Name Z-A':
        return b.displayName.localeCompare(a.displayName);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  /**
   * Gets status color based on user status
   * 
   * @param status - User status
   * @returns Object with dot and text colors
   */
  const getStatusStyle = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return {
          dot: 'bg-green-500',
          text: 'text-green-700',
        };
      case 'Inactive':
        return {
          dot: 'bg-gray-400',
          text: 'text-gray-600',
        };
      default:
        return {
          dot: 'bg-gray-400',
          text: 'text-gray-600',
        };
    }
  };

  /**
   * Gets role color based on user role
   * 
   * @param role - User role
   * @returns Badge color class
   */
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Staff':
        return 'bg-blue-100 text-blue-700';
      case 'User':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
   * Formats last login to relative time or "Never"
   * 
   * @param date - Date to format or null
   * @returns Relative time string or "Never"
   */
  const formatLastLogin = (date: Date | null) => {
    if (!date) return 'Never';
    const distance = formatDistanceToNow(date, { addSuffix: true });
    return distance.replace('about ', '').replace(' ago', ' ago');
  };

  const handleAddUser = () => {
    // TODO: Navigate to add user page
    console.log('Add user clicked');
  };

  const handleEditUser = (userId: string) => {
    // TODO: Navigate to edit user page
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    // TODO: Implement delete user functionality
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      console.log('Delete user:', userId);
    }
  };

  // Filter options
  const roleOptions = [
    { value: 'Staff', label: 'Staff' },
    { value: 'User', label: 'User' },
  ];

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

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">User Management</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
            <p className="text-gray-600">
              Manage and monitor all user accounts, roles, and permissions.
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Search and Filter Bar */}
        <TableFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              label: 'Role',
              value: roleFilter,
              onChange: (value) => setRoleFilter(value as typeof roleFilter),
              options: roleOptions,
              allLabel: 'All',
            },
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

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => {
                  const statusStyle = getStatusStyle(user.status);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-gray-700 font-semibold text-sm`}>
                            {user.avatarText}
                          </div>
                          <span className="font-medium text-gray-900">{user.displayName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{user.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                          <span className={`text-sm font-medium ${statusStyle.text}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{formatDate(user.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{formatLastLogin(user.lastLogin)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.displayName)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
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
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedUsers.length)} of {sortedUsers.length} results
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

