import { Layout } from '../../components/admin/layout';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from '@tanstack/react-router';
import { mockEmployees, type EmployeeStatus } from '@/mock/data';
import { showToast } from '@/lib/toast';
import { ArrowLeft } from 'lucide-react';

export function EditEmployeePage() {
  const router = useRouter();
  const { employeeId } = useParams({ from: '/console/admin/edit-employee/$employeeId' });
  
  // Find employee by ID
  const employee = mockEmployees.find(e => e.id === employeeId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active' as EmployeeStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        status: employee.status,
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.role.trim()) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    // In a real app, this would call an API
    showToast.success(`Employee "${formData.name}" updated successfully!`);
    router.navigate({ to: '/console/admin/employee' });
  };

  const handleCancel = () => {
    router.navigate({ to: '/console/admin/employee' });
  };

  if (!employee) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h2>
              <p className="text-gray-600 mb-6">The employee you're looking for doesn't exist.</p>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Employees
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Employees</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Employee</h1>
            <p className="text-gray-600">Update employee information and permissions.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              {/* Employee Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Employee Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a role</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Invited">Invited</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

