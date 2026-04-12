import { Layout } from '../../components/admin/layout'
import { Clock3, Copy, Info, Link2, Mail, MapPin, Phone } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrgLogo } from '@/components/org-logo'
import { PlaceSearchInput } from '@/components/place-search-input'
import {
  isValidOrgMapLocation,
  OrgLocationMap,
} from '@/components/org-location-map'
import { Spinner } from '@/components/ui/spinner'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrganization, useUpdateOrganization } from '@/hooks/use-org'
import type { DailySchedule, OrgWeekDay } from '@/types/organization.types'

const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'airport', label: 'Airport' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'university', label: 'University' },
  { value: 'mall', label: 'Shopping Mall' },
  { value: 'stadium', label: 'Stadium/Arena' },
  { value: 'transportation', label: 'Transportation Hub' },
  { value: 'enterprise', label: 'Enterprise Technology' },
  { value: 'technology', label: 'Technology & Software' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
]

const DAY_ORDER: OrgWeekDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/** Mốc giờ 30 phút (12h, en-US) — dùng cho dropdown */
function buildTimeOptions(): string[] {
  const out: string[] = []
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const d = new Date(2000, 0, 1, h, m, 0, 0)
      out.push(
        d.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      )
    }
  }
  return out
}

const TIME_OPTIONS = buildTimeOptions()
const T08 = TIME_OPTIONS[16]
const T18 = TIME_OPTIONS[36]

const DISPLAY_TO_HHMM = new Map<string, string>()
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30] as const) {
    const d = new Date(2000, 0, 1, h, m, 0, 0)
    const label = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    DISPLAY_TO_HHMM.set(
      label,
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    )
  }
}

function hhmmToSelectLabel(hhmm: string): string {
  const m = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return T08
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (!Number.isFinite(h) || !Number.isFinite(min)) return T08
  const d = new Date(2000, 0, 1, h, min, 0, 0)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

type DaySchedule = {
  day: OrgWeekDay
  closed: boolean
  openTime: string
  closeTime: string
}

function apiHoursToForm(
  api: DailySchedule[] | null | undefined,
): DaySchedule[] {
  const byDay = new Map<OrgWeekDay, DailySchedule>()
  for (const row of api ?? []) {
    byDay.set(row.day, row)
  }
  return DAY_ORDER.map((day) => {
    const d = byDay.get(day)
    if (!d) {
      return { day, closed: true, openTime: T08, closeTime: T18 }
    }
    return {
      day,
      closed: d.isClosed,
      openTime: d.openTime ? hhmmToSelectLabel(d.openTime) : T08,
      closeTime: d.closeTime ? hhmmToSelectLabel(d.closeTime) : T18,
    }
  })
}

function hoursFormToApi(rows: DaySchedule[]): DailySchedule[] {
  return rows.map((row) => ({
    day: row.day,
    isClosed: row.closed,
    openTime: row.closed ? null : (DISPLAY_TO_HHMM.get(row.openTime) ?? null),
    closeTime: row.closed ? null : (DISPLAY_TO_HHMM.get(row.closeTime) ?? null),
  }))
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400"
    >
      {children}
    </Label>
  )
}

/**
 * Chỉnh sửa org — UI đồng bộ với trang view (`organization-info-view`).
 * Route: /console/admin/setting/organization/edit — GET/PUT `/api/core/orgs/{id}`.
 */
export function SettingPage() {
  const router = useRouter()
  const { slug: orgSlug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const {
    data: org,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrganization(currentOrgId)
  const updateOrg = useUpdateOrganization()

  const syncedOrgIdRef = useRef<string | null>(null)
  const [formReady, setFormReady] = useState(false)
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [taxId, setTaxId] = useState('')
  const [slug, setSlug] = useState('')
  const [address, setAddress] = useState('')
  const [deskNote, setDeskNote] = useState('')
  const [hours, setHours] = useState<DaySchedule[]>(() =>
    DAY_ORDER.map((day) => ({
      day,
      closed: true,
      openTime: T08,
      closeTime: T18,
    })),
  )
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [externalPlaceId, setExternalPlaceId] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentOrgId) {
      void router.navigate({ to: '/console/welcome' })
    }
  }, [currentOrgId, router])

  useEffect(() => {
    if (!org) return
    if (syncedOrgIdRef.current === org.id) return
    syncedOrgIdRef.current = org.id
    setName(org.name)
    setIndustry(org.industryType)
    setPhone(org.phone)
    setEmail(org.contactEmail?.trim() ?? '')
    setTaxId(org.taxIdentificationNumber)
    setSlug(org.slug)
    setAddress(org.displayAddress?.trim() ?? '')
    setDeskNote(org.locationNote?.trim() ?? '')
    setHours(apiHoursToForm(org.businessHours))
    setLocation(
      org.location && Number.isFinite(org.location.latitude)
        ? { latitude: org.location.latitude, longitude: org.location.longitude }
        : null,
    )
    setExternalPlaceId(org.externalPlaceId ?? null)
    setFormReady(true)
    setSaveError(null)
  }, [org])

  const industryOptions = useMemo(() => {
    const opts = [...INDUSTRY_OPTIONS]
    if (industry && !opts.some((o) => o.value === industry)) {
      opts.unshift({ value: industry, label: industry })
    }
    return opts
  }, [industry])

  const industryLabel =
    industryOptions.find((o) => o.value === industry)?.label ?? industry

  const shareUrl = useMemo(() => {
    if (!slug.trim() || typeof window === 'undefined') return ''
    return `${window.location.origin}/portal/${slug.trim().toLowerCase().replace(/\s+/g, '-')}`
  }, [slug])

  const mapCoords = location
  const showMap = isValidOrgMapLocation(mapCoords)

  const handleSave = () => {
    if (!currentOrgId || !org) return
    setSaveError(null)
    const displayAddress = address.trim() || name.trim()
    if (!displayAddress) {
      setSaveError('Physical address or organization name is required.')
      return
    }
    const slugNorm = slug.trim().toLowerCase().replace(/\s+/g, '-')
    if (slugNorm.length < 2) {
      setSaveError('Slug is too short.')
      return
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSaveError('Please enter a valid contact email.')
      return
    }
    const coords =
      location ??
      (org.location
        ? { latitude: org.location.latitude, longitude: org.location.longitude }
        : { latitude: 0, longitude: 0 })

    const apiHours = hoursFormToApi(hours)
    for (const row of apiHours) {
      if (!row.isClosed && (!row.openTime || !row.closeTime)) {
        setSaveError(
          `Opening hours for ${row.day}: select both open and close times, or mark closed.`,
        )
        return
      }
    }

    updateOrg.mutate(
      {
        orgId: currentOrgId,
        payload: {
          name: name.trim(),
          slug: slugNorm,
          displayAddress,
          location: coords,
          externalPlaceId: externalPlaceId ?? undefined,
          phone: phone.trim(),
          contactEmail: email.trim() || undefined,
          industryType: industry,
          taxIdentificationNumber: taxId.trim(),
          locationNote: deskNote.trim(),
          businessHours: apiHours,
        },
      },
      {
        onSuccess: (updatedOrg) => {
          // If slug changed, jump to the new workspace URL
          const nextSlug = updatedOrg?.slug || orgSlug
          void router.navigate({ to: `/console/${nextSlug}/admin/setting/organization` })
        },
        onError: (err) => {
          setSaveError(
            err instanceof Error ? err.message : 'Failed to save organization.',
          )
        },
      },
    )
  }

  if (!currentOrgId) {
    return (
      <Layout>
        <div className="flex min-h-[40vh] items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      </Layout>
    )
  }

  if (isLoading || !formReady) {
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
            <Button
              type="button"
              className="mt-4 rounded-full bg-blue-600"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="mx-auto ">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between xl:mb-6">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl xl:text-[28px]">
              Organization Settings
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={updateOrg.isPending}
                onClick={() =>
                  router.navigate({ to: `/console/${orgSlug}/admin/setting/organization` })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-full bg-blue-600 px-5 hover:bg-blue-700"
                disabled={updateOrg.isPending}
                onClick={handleSave}
              >
                {updateOrg.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>

          {saveError ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {saveError}
            </p>
          ) : null}

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
                  alt={name}
                  className="h-full w-full"
                  rounded="full"
                />
              </div>
              <div className="ml-20 flex flex-col gap-3 sm:ml-24 sm:flex-row sm:items-start sm:justify-between xl:ml-28">
                <div className="min-w-0 flex-1 space-y-3"></div>
                <span className="w-fit shrink-0 rounded-full bg-amber-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-800 sm:text-[10px]">
                  Editing
                </span>
              </div>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-6 xl:gap-7">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
              <div className="mb-6 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-900 xl:text-xl">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-1.5 min-w-0">
                  <FieldLabel>Organization name</FieldLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <FieldLabel>Industry</FieldLabel>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Preview: {industryLabel}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Phone number</FieldLabel>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-slate-200 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Contact email</FieldLabel>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-slate-200 pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Tax ID / VAT</FieldLabel>
                  <Input
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="mt-1 border-slate-200"
                  />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <FieldLabel>Organization slug</FieldLabel>
                  <div className="mt-1 flex min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm">
                    <span className="hidden shrink-0 items-center whitespace-nowrap rounded-l-lg border-r border-slate-200 bg-slate-100 px-2 text-xs text-slate-600 sm:flex sm:px-3 sm:text-sm">
                      backtrack.com/
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="min-w-0 rounded-lg border-0 font-medium text-blue-600 focus-visible:ring-0 sm:rounded-l-none sm:rounded-r-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Link2 className="h-3 w-3 text-blue-600" />
                  Shareable Link
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="break-all text-xs text-blue-600">
                    {shareUrl || '—'}
                  </span>
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-blue-600 hover:bg-slate-200 disabled:opacity-40"
                    disabled={!shareUrl}
                    onClick={() =>
                      shareUrl && void navigator.clipboard.writeText(shareUrl)
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
                <h2 className="text-xl font-semibold text-slate-900 xl:text-xl">
                  Opening Hours
                </h2>
              </div>

              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full min-w-[580px] border-separate border-spacing-y-0 border-spacing-x-6 text-sm sm:border-spacing-x-8 sm:min-w-[620px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="pb-3 pr-2 text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
                        Day
                      </th>
                      <th className="pb-3 pr-2 text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
                        Status
                      </th>
                      <th className="pb-3 pr-2 text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
                        Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hours.map((row, i) => (
                      <tr
                        key={row.day}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-3 pr-2 align-middle font-medium text-slate-700">
                          {row.day}
                        </td>
                        <td className="py-3 pr-2 align-middle">
                          <Select
                            value={row.closed ? 'closed' : 'open'}
                            onValueChange={(v) => {
                              const next = [...hours]
                              next[i] = { ...next[i], closed: v === 'closed' }
                              setHours(next)
                            }}
                          >
                            <SelectTrigger className="h-9 w-[120px] border-slate-200 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 pr-2 align-middle">
                          {row.closed ? (
                            <span className="text-sm font-semibold text-red-600">
                              —
                            </span>
                          ) : (
                            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                              <span className="shrink-0 text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
                                Open
                              </span>
                              <Select
                                value={row.openTime}
                                onValueChange={(v) => {
                                  const next = [...hours]
                                  next[i] = { ...next[i], openTime: v }
                                  setHours(next)
                                }}
                              >
                                <SelectTrigger className="h-9 w-[142px] border-slate-200 text-sm sm:w-[150px]">
                                  <SelectValue placeholder="Open" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {TIME_OPTIONS.map((t) => (
                                    <SelectItem
                                      key={`o-${row.day}-${t}`}
                                      value={t}
                                    >
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="shrink-0 px-1 text-slate-400 sm:px-2">
                                —
                              </span>
                              <span className="shrink-0 text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
                                Close
                              </span>
                              <Select
                                value={row.closeTime}
                                onValueChange={(v) => {
                                  const next = [...hours]
                                  next[i] = { ...next[i], closeTime: v }
                                  setHours(next)
                                }}
                              >
                                <SelectTrigger className="h-9 w-[168px] border-slate-200 text-sm sm:w-[188px]">
                                  <SelectValue placeholder="Close" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {TIME_OPTIONS.map((t) => (
                                    <SelectItem
                                      key={`c-${row.day}-${t}`}
                                      value={t}
                                    >
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-center xl:grid-cols-[1.35fr_1fr] xl:gap-7">
              <div className="space-y-4">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900 xl:text-xl">
                    Location &amp; Desk
                  </h2>
                </div>
                <div className="space-y-2">
                  <FieldLabel htmlFor="edit-address">
                    Physical address
                  </FieldLabel>
                  <PlaceSearchInput
                    id="edit-address"
                    value={address}
                    onChange={(value) => setAddress(value)}
                    onSelect={(place) => {
                      setAddress(place.displayAddress)
                      setLocation({
                        latitude: place.latitude,
                        longitude: place.longitude,
                      })
                      setExternalPlaceId(place.placeId ?? null)
                    }}
                    placeholder="Type address or place name, then select a result for coordinates (OpenStreetMap)"
                    className="[&_input]:border-slate-200 [&_input]:text-sm"
                  />
                  {location && (
                    <p className="text-xs text-green-600">
                      Coordinates: {location.latitude.toFixed(5)},{' '}
                      {location.longitude.toFixed(5)}
                    </p>
                  )}
                </div>
                <div className="max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-normal uppercase tracking-[0.16em] text-slate-400">
                    Desk location note
                  </p>
                  <Textarea
                    value={deskNote}
                    onChange={(e) => setDeskNote(e.target.value)}
                    className="mt-2 min-h-[80px] resize-y border-0 bg-transparent p-0 text-sm text-slate-700 focus-visible:ring-0"
                  />
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
                      Select an address from search results to set map
                      coordinates
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
