import { Layout } from '../../components/admin/layout'
import { ArrowLeft, Phone, Pencil } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useCurrentUser } from '@/hooks/use-auth'
import { useMyOrganizations, useOrganization } from '@/hooks/use-org'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { Spinner } from '@/components/ui/spinner'

const INDUSTRY_OPTIONS: Record<string, string> = {
  technology: 'Technology & Software',
  healthcare: 'Healthcare',
  finance: 'Finance & Banking',
  retail: 'Retail & E-commerce',
  education: 'Education',
  manufacturing: 'Manufacturing',
  hospitality: 'Hospitality & Tourism',
  airport: 'Airport',
  hotel: 'Hotel',
  university: 'University',
  mall: 'Shopping Mall',
  stadium: 'Stadium/Arena',
  transportation: 'Transportation Hub',
  other: 'Other',
}

export function OrganizationInfoViewPage() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const { currentOrgId } = useCurrentOrgId()
  const { data: myOrgs = [] } = useMyOrganizations({ enabled: !!currentUser })
  const orgId = currentOrgId ?? myOrgs[0]?.orgId ?? null
  const { data: org, isLoading: orgLoading, error: orgError } = useOrganization(orgId)

  if (orgLoading) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (orgError || !orgId || !org) {
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

  const industryLabel = INDUSTRY_OPTIONS[org.industryType] ?? org.industryType

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => router.navigate({ to: '/console/admin/setting' })}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Settings
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Information</h1>
            <p className="text-gray-600">Manage your company profile and contact details</p>
            {org?.status && (
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className="font-medium capitalize">{org.status.toLowerCase()}</span>
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {org.name || '—'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry Type</label>
                  <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {industryLabel || '—'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workspace URL (slug)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {org.slug || '—'}
                  </div>
                  <span className="text-sm text-gray-500">.backtrack.com</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {org.phone || '—'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 min-h-[100px] whitespace-pre-wrap">
                  {org.address?.trim() || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Identification Number
                  <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Read-only</span>
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  {org.taxIdentificationNumber ?? '—'}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.navigate({ to: '/console/admin/setting/organization/edit' })}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
