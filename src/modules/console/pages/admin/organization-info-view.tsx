import { Layout } from '../../components/admin/layout'
import {
  Bell,
  CircleHelp,
  Clock3,
  Copy,
  Eye,
  Info,
  Link2,
  MapPin,
} from 'lucide-react'
import { useRouter, useParams } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { OrgLogo } from '@/components/org-logo'
import {
  isValidOrgMapLocation,
  OrgLocationMap,
} from '@/components/org-location-map'
import { Spinner } from '@/components/ui/spinner'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrganization } from '@/hooks/use-org'
import type { DailySchedule, OrgWeekDay } from '@/types/organization.types'

const DAY_ORDER: OrgWeekDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/** Luôn đủ 7 ngày; ngày không có trong API → coi như đóng cửa */
function buildFullWeekHours(
  api: DailySchedule[] | null | undefined,
): DailySchedule[] {
  const byDay = new Map<OrgWeekDay, DailySchedule>()
  for (const row of api ?? []) {
    if (DAY_ORDER.includes(row.day)) {
      byDay.set(row.day, row)
    }
  }
  return DAY_ORDER.map((day) => {
    const existing = byDay.get(day)
    if (existing) return existing
    return { day, isClosed: true, openTime: null, closeTime: null }
  })
}

function formatScheduleLine(row: DailySchedule): string {
  if (row.isClosed) return 'CLOSED'
  const open = row.openTime?.trim()
  const close = row.closeTime?.trim()
  if (!open || !close) return 'CLOSED'
  return `${open} – ${close}`
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm font-normal text-slate-800">
        {value}
      </p>
    </div>
  )
}

function formatStatusLabel(status: string): string {
  if (!status) return '—'
  const withSpaces = status.replace(/([a-z])([A-Z])/g, '$1 $2')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

export function OrganizationInfoViewPage() {
  const router = useRouter()
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const {
    data: org,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrganization(currentOrgId)

  useEffect(() => {
    if (!currentOrgId) {
      void router.navigate({ to: '/console/welcome' })
    }
  }, [currentOrgId, router])

  const publicOrgUrl = useMemo(() => {
    if (!org?.slug) return ''
    return `https://thebacktrack.vercel.app/organizations/${org.slug}`
  }, [org?.slug])

  if (!currentOrgId) {
    return (
      <Layout>
        <div className="flex min-h-[40vh] items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      </Layout>
    )
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[40vh] items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      </Layout>
    )
  }

  if (isError || !org) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 px-3 py-8 sm:px-6">
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-900">
              Could not load organization
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {error instanceof Error ? error.message : 'Please try again.'}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const hoursRows = buildFullWeekHours(org.businessHours)

  const displayAddress = org.displayAddress?.trim() || '—'
  const contactEmail = org.contactEmail?.trim() || '—'
  const locationNote = org.locationNote?.trim() || '—'
  const mapCoords = org.location
  const showMap = isValidOrgMapLocation(mapCoords)

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="mx-auto">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between xl:mb-6">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl xl:text-[28px]">
              Organization Settings
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:px-4 sm:py-2"
                onClick={() => {
                  if (publicOrgUrl) window.open(publicOrgUrl, '_blank', 'noreferrer')
                }}
                disabled={!publicOrgUrl}
              >
                <Eye className="h-4 w-4" />
                Public Profile Preview
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: '/console/$slug/admin/setting/organization/edit',
                    params: { slug },
                  })
                }
                className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 sm:px-5 sm:py-2"
              >
                Update Information
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100"
              >
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100"
              >
                <CircleHelp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
              className={`h-28 sm:h-40 xl:h-48 ${!org.coverImageUrl?.trim() ? 'bg-[linear-gradient(120deg,#dbeafe,#eff6ff,#dbeafe)]' : ''}`}
              style={
                org.coverImageUrl?.trim()
                  ? {
                      backgroundImage: `url(${org.coverImageUrl.trim()})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            />
            <div className="relative px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4 xl:px-8 xl:pb-6 xl:pt-5">
              <div className="absolute -top-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow sm:-top-10 sm:h-20 sm:w-20">
                <OrgLogo
                  logoUrl={org.logoUrl}
                  alt={org.name}
                  className="h-full w-full"
                  rounded="full"
                />
              </div>
              <div className="ml-10 flex flex-col gap-2 sm:ml-24 sm:flex-row sm:items-center sm:justify-between xl:ml-22">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl xl:text-xl">
                    {org.name}
                  </h2>
                  <p className="text-xs text-slate-500">{org.industryType}</p>
                </div>
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-blue-600 sm:text-[10px]">
                  {formatStatusLabel(org.status)}
                </span>
              </div>
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[5fr_3fr] xl:gap-7">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
              <div className="mb-6 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-slate-900 xl:text-xl">
                  General Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <LabelValue label="Organization Name" value={org.name} />
                <LabelValue label="Industry Type" value={org.industryType} />
                <LabelValue label="Phone Number" value={org.phone || '—'} />
                <LabelValue label="Contact Email" value={contactEmail} />
                <LabelValue
                  label="Tax ID / VAT"
                  value={org.taxIdentificationNumber || '—'}
                />
                <div>
                  <p className="text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
                    Organization Slug
                  </p>
                  <p className="mt-1 text-sm font-normal text-slate-800">
                    {org.slug || '—'}
                  </p>
                  <a
                    href={publicOrgUrl || '#'}
                    className="mt-1 inline-block max-w-full break-all text-xs font-normal text-blue-600 hover:text-blue-700"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {publicOrgUrl || '—'}
                  </a>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Link2 className="h-3 w-3 text-blue-600" />
                  Shareable Link (Workspace)
                </div>
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <a
                    href={publicOrgUrl || '#'}
                    className="min-w-0 flex-1 break-all text-xs text-blue-600 hover:text-blue-700"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {publicOrgUrl || '—'}
                  </a>
                  <button
                    type="button"
                    className="shrink-0 rounded-md text-blue-600 hover:bg-slate-200 disabled:opacity-40"
                    disabled={!publicOrgUrl}
                    onClick={() =>
                      publicOrgUrl && void navigator.clipboard.writeText(publicOrgUrl)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
              <div className="mb-6 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-slate-900 xl:text-xl">
                  Opening Hours
                </h3>
              </div>

              <div className="space-y-3.5">
                {hoursRows.map((row) => {
                  const line = formatScheduleLine(row)
                  return (
                    <div
                      key={row.day}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-slate-600">{row.day}</span>
                      <span
                        className={`text-sm font-semibold ${line === 'CLOSED' ? 'text-slate-400' : 'text-slate-800'}`}
                      >
                        {line}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.35fr_1fr] xl:gap-7">
              <div className="space-y-5">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <h3 className="text-xl font-semibold text-slate-900 xl:text-xl">
                    Location &amp; Desk
                  </h3>
                </div>
                <LabelValue label="Physical Address" value={displayAddress} />
                <div className="max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Desk Location Note
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {locationNote}
                  </p>
                </div>
              </div>

              <div className="relative h-44 overflow-hidden rounded-xl border border-slate-200 sm:h-56 xl:h-64">
                {showMap && mapCoords ? (
                  <OrgLocationMap
                    latitude={mapCoords.latitude}
                    longitude={mapCoords.longitude}
                    className="z-0 h-full w-full rounded-xl"
                  />
                ) : (
                  <>
                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#ef4444_0_8px,transparent_9px),linear-gradient(135deg,#334155,#1e293b)]">
                      <MapPin className="h-10 w-10 text-white opacity-90" />
                    </div>
                    <p className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/80">
                      No map — add a valid address with coordinates when editing
                      the organization
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
