import { Layout } from '../../components/admin/layout';
import { Search, Filter, Plus, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { mockEmployees, type Employee, type EmployeeStatus } from '@/mock/data/mock-employees';
import { showToast } from '@/lib/toast';

export function EmployeePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'All'>('Active');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const pageSize = 4;

  // Check if coming from invite page and set filter to Invited
  useEffect(() => {
    // Get status from URL search params (TanStack Router format)
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get('status');
    if (status === 'Invited' || status === 'Active' || status === 'Disabled') {
      setStatusFilter(status as EmployeeStatus);
    }
  }, []);

  // Filter employees by search term and status
  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Invited':
        return 'bg-yellow-100 text-yellow-700';
      case 'Disabled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-teal-600',
      'bg-blue-600',
      'bg-gray-600',
      'bg-emerald-600',
      'bg-purple-600',
      'bg-pink-600',
    ];
    return colors[index % colors.length];
  };

  const handleEditEmployee = (employeeId: string) => {
    router.navigate({ to: '/console/admin/edit-employee/$employeeId', params: { employeeId } });
  };

  const handleDeleteEmployee = (employeeName: string) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      showToast.error(`${employeeName} deleted successfully`);
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
        <p className="text-gray-600">Manage your team members and their account permissions.</p>
          </div>
          <button 
            onClick={() => router.navigate({ to: '/console/admin/invite-employee' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Invite Employee
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Filter Dropdown */}
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {(['All', 'Active', 'Invited', 'Disabled'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterDropdown(false);
                          setCurrentPage(1); // Reset to first page
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                          statusFilter === status ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentEmployees.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-semibold text-sm`}>
                          {employee.avatar}
                        </div>
                        <span className="font-medium text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600">{employee.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700">{employee.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600">{employee.created}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600">{employee.lastLogin || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleEditEmployee(employee.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(employee.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Demo Loading Skeleton */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            DEMO: LOADING SKELETON
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

