import { Layout } from '../../components/admin/layout';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { showToast } from '@/lib/toast';
import { mockEmployees } from '@/mock/data/mock-employees';

export function InviteEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
    internalNotes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showError, setShowError] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setShowError(false);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please use a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    // Check if email already exists
    const emailExists = mockEmployees.some(
      emp => emp.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (emailExists) {
      setShowError(true);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success - add new employee to mock data
    const newEmployee = {
      id: `emp-${Date.now()}`,
      name: formData.fullName,
      email: formData.email,
      role: formData.role as 'Admin' | 'Manager' | 'Editor' | 'Viewer',
      status: 'Invited' as const,
      created: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      lastLogin: null,
      avatar: formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
    };

    // Add to mock employees array
    mockEmployees.unshift(newEmployee);

    showToast.success(`Invitation sent to ${formData.email}!`);
    router.navigate({ 
      to: '/console/admin/employee',
      search: { status: 'Invited' }
    });
  };

  const handleCancel = () => {
    router.navigate({ to: '/console/admin/employee' });
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Employee</h1>
            <p className="text-gray-600">
              Add a new member to your organization. They will receive an email to activate their account.
            </p>
          </div>

          {/* Error Alert */}
          {showError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Unable to invite user</h3>
                <p className="text-sm text-red-700 mt-1">
                  This email is already associated with an active account.
                </p>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.fullName
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-blue-300 focus:ring-blue-500'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email || showError
                      ? 'border-red-300 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
                {!errors.email && (
                  <p className="mt-2 text-sm text-gray-500">
                    An activation email will be sent to this address with instructions to set up their password.
                  </p>
                )}
              </div>

              {/* Phone Number and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                    <span className="ml-2 text-xs font-normal text-gray-500">Optional</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors appearance-none ${
                      errors.role
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Internal Notes
                  <span className="ml-2 text-xs font-normal text-gray-500">Optional</span>
                </label>
                <textarea
                  placeholder="Add any additional details about this user..."
                  rows={4}
                  value={formData.internalNotes}
                  onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                  className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-1.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

