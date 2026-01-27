import { Layout } from '../components/layout';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { showToast } from '@/lib/toast';
import type { TenantStatus } from '@/mock/data/mock-tenants';

/**
 * Add Tenant Page
 * 
 * Form page for creating a new tenant account.
 */
export function AddTenantPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    adminEmail: '',
    status: 'Pending' as TenantStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validates the form data
   * 
   * @returns True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (!/^[a-z0-9-]+\.app\.com$/.test(formData.subdomain.toLowerCase())) {
      newErrors.subdomain = 'Subdomain must be in format: example.app.com';
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * 
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    // In a real app, this would call an API
    showToast.success(`Tenant "${formData.name}" created successfully!`);
    router.navigate({ to: '/super-admin/organization' });
  };

  /**
   * Handles cancel action
   */
  const handleCancel = () => {
    router.navigate({ to: '/super-admin/organization' });
  };

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
              <span className="font-medium">Back to Tenants</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Tenant</h1>
            <p className="text-gray-600">Create a new tenant account and configure settings.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              {/* Tenant Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tenant Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Acme Corp"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subdomain <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                      className={`w-full px-4 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.subdomain ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., acme.app.com"
                    />
                    {errors.subdomain && <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>}
                    <p className="text-gray-500 text-xs mt-1">Format: name.app.com</p>
                  </div>
                </div>
              </div>

              {/* Admin Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className={`w-full px-4 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.adminEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="admin@company.com"
                    />
                    {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenant Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TenantStatus })}
                      className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <p className="text-gray-500 text-xs mt-1">New tenants are typically set to Pending status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Tenant
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

