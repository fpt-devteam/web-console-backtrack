import { Layout } from '../../components/admin/layout'
import { AlertCircle, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { showToast } from '@/lib/toast'

interface SettingFormData {
  organizationName: string
  industryType: string
  phoneNumber: string
  address: string
  taxId: string
}

export function SettingPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<SettingFormData>({
    organizationName: 'Acme Corp',
    industryType: 'technology',
    phoneNumber: '+1 (555) 000-0000',
    address: '',
    taxId: 'XX-XXXXXX',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showError, setShowError] = useState(false)

  const handleInputChange = (
    field: keyof SettingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    setShowError(false)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required'
    }

    if (!formData.industryType) {
      newErrors.industryType = 'Industry type is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setShowError(true)
      return
    }

    // Save settings
    showToast.success('Organization settings updated successfully!')
    router.navigate({ to: '/console/admin/dashboard' })
  }

  const handleCancel = () => {
    router.navigate({ to: '/console/admin/dashboard' })
  }

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Organization Settings
            </h1>
            <p className="text-gray-600">
              Manage your company profile and contact details
            </p>
          </div>

          {/* Error Alert */}
          {showError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">
                  Submission Error
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Please correct the highlighted fields below before saving.
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

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Organization Name & Industry Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) =>
                      handleInputChange('organizationName', e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.organizationName
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter organization name"
                  />
                  {errors.organizationName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.organizationName}
                    </p>
                  )}
                </div>

                {/* Industry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Type
                  </label>
                  <select
                    value={formData.industryType}
                    onChange={(e) =>
                      handleInputChange('industryType', e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.industryType
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology & Software</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="hospitality">Hospitality & Tourism</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.industryType && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.industryType}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange('phoneNumber', e.target.value)
                    }
                    className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.phoneNumber
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Include country code for international support.
                </p>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    handleInputChange('address', e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                    errors.address
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Street address, city, state, postal code"
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                )}
              </div>

              {/* Tax Identification Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Identification Number
                  <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Read-only
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="XX-XXXXXX"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

