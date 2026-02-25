import { Layout } from '../../components/admin/layout'
import { AlertCircle, Phone, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { showToast } from '@/lib/toast'
import { useMyOrganizations, useOrganization, useUpdateOrganization } from '@/hooks/use-org'
import { Spinner } from '@/components/ui/spinner'

const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'airport', label: 'Airport' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'university', label: 'University' },
  { value: 'mall', label: 'Shopping Mall' },
  { value: 'stadium', label: 'Stadium/Arena' },
  { value: 'transportation', label: 'Transportation Hub' },
  { value: 'other', label: 'Other' },
]

interface SettingFormData {
  name: string
  slug: string
  industryType: string
  phone: string
  address: string
  taxIdentificationNumber: string
}

export function SettingPage() {
  const router = useRouter()
  const { data: myOrgs = [] } = useMyOrganizations()
  const orgId = myOrgs[0]?.orgId ?? null
  const { data: org, isLoading: orgLoading, error: orgError } = useOrganization(orgId)
  const updateOrg = useUpdateOrganization()

  const [formData, setFormData] = useState<SettingFormData>({
    name: '',
    slug: '',
    industryType: '',
    phone: '',
    address: '',
    taxIdentificationNumber: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (org) {
      setFormData({
        name: org.name ,
        slug: org.slug  ,
        industryType: org.industryType ,
        phone: org.phone ,
        address: org.address ?? '',
        taxIdentificationNumber: org.taxIdentificationNumber ,
      })
    }
  }, [org])

  const handleInputChange = (field: keyof SettingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    setShowError(false)
  }

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Organization name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Workspace URL is required'
    if (!formData.industryType) newErrors.industryType = 'Industry type is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgId) return
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setShowError(true)
      return
    }
    const slug = formData.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (!slug) {
      setErrors((prev) => ({ ...prev, slug: 'Workspace URL must contain letters or numbers.' }))
      setShowError(true)
      return
    }
    updateOrg.mutate(
      {
        orgId,
        payload: {
          name: formData.name.trim(),
          slug,
          address: formData.address.trim() || undefined,
          phone: formData.phone.trim(),
          industryType: formData.industryType,
          taxIdentificationNumber: formData.taxIdentificationNumber.trim(),
        },
      },
      {
        onSuccess: () => {
          showToast.success('Organization settings updated successfully!')
          router.navigate({ to: '/console/admin/dashboard' })
        },
        onError: (err) => {
          showToast.error(err instanceof Error ? err.message : 'Failed to update organization')
        },
      }
    )
  }

  const handleCancel = () => {
    router.navigate({ to: '/console/admin/dashboard' })
  }

  if (orgLoading && !org) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (orgError || (!orgLoading && !orgId)) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <p className="text-gray-600">
              {!orgId ? 'No organization found. Create one first.' : 'Failed to load organization.'}
            </p>
            <button
              type="button"
              onClick={() => router.navigate({ to: '/console/welcome' })}
              className="mt-4 text-blue-600 hover:underline"
            >
              Back to Welcome
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Settings</h1>
            <p className="text-gray-600">Manage your company profile and contact details</p>
            {org?.status && (
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className="font-medium capitalize">{org.status.toLowerCase()}</span>
              </p>
            )}
          </div>

          {showError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Submission Error</h3>
                <p className="text-sm text-red-700 mt-1">
                  Please correct the highlighted fields below before saving.
                </p>
              </div>
              <button onClick={() => setShowError(false)} className="text-red-400 hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter organization name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry Type</label>
                  <select
                    value={formData.industryType}
                    onChange={(e) => handleInputChange('industryType', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.industryType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {errors.industryType && (
                    <p className="text-sm text-red-600 mt-1">{errors.industryType}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workspace URL (slug)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.slug ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="acme-corp"
                  />
                  <span className="text-sm text-gray-500">.backtrack.com</span>
                </div>
                {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Phone number"
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Street address, city, state"
                />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Identification Number
                  <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Read-only</span>
                </label>
                <input
                  type="text"
                  value={formData.taxIdentificationNumber ?? ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="XX-XXXXXX"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateOrg.isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {updateOrg.isPending ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
