import { Layout } from '../../components/admin/layout'
import { Clock3, Copy, Info, Link2, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
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

const MOCK_SHAREABLE = 'https://app.lostfoundpro.com/portal/acme-corp-global-v2'

const INDUSTRY_OPTIONS = [
  { value: 'enterprise', label: 'Enterprise Technology' },
  { value: 'technology', label: 'Technology & Software' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
]

/** Mốc giờ 30 phút (12h, en-US) — dùng cho dropdown */
function buildTimeOptions(): string[] {
  const out: string[] = []
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const d = new Date(2000, 0, 1, h, m, 0, 0)
      out.push(
        d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      )
    }
  }
  return out
}

const TIME_OPTIONS = buildTimeOptions()
/** 8:00 AM, 6:00 PM, 8:00 PM — index trong TIME_OPTIONS (cách 30 phút) */
const T08 = TIME_OPTIONS[16]
const T18 = TIME_OPTIONS[36]
const T20 = TIME_OPTIONS[40]

type DaySchedule = {
  day: string
  closed: boolean
  openTime: string
  closeTime: string
}

const DEFAULT_HOURS: DaySchedule[] = [
  { day: 'Monday', closed: false, openTime: T08, closeTime: T18 },
  { day: 'Tuesday', closed: false, openTime: T08, closeTime: T18 },
  { day: 'Wednesday', closed: false, openTime: T08, closeTime: T18 },
  { day: 'Thursday', closed: false, openTime: T08, closeTime: T18 },
  { day: 'Friday', closed: false, openTime: T08, closeTime: T20 },
  { day: 'Saturday', closed: true, openTime: T08, closeTime: T18 },
  { day: 'Sunday', closed: true, openTime: T08, closeTime: T18 },
]

/** Label kiểu trang view — uppercase nhỏ */
function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
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
 * Route: /console/admin/setting/organization/edit — mock form, chưa nối API.
 */
export function SettingPage() {
  const router = useRouter()
  const [name, setName] = useState('Acme Corporation Global')
  const [industry, setIndustry] = useState('enterprise')
  const [phone, setPhone] = useState('+1 (555) 123-4567')
  const [email, setEmail] = useState('support@acme-corp.com')
  const [taxId, setTaxId] = useState('US-992033481-B')
  const [slug, setSlug] = useState('acme-corp')
  const [address, setAddress] = useState(
    'One Infinite Loop, Suite 200\nCupertino, CA 95014\nUnited States',
  )
  const [deskNote, setDeskNote] = useState(
    'Level 1, behind the main reception area near the elevators.',
  )
  const [hours, setHours] = useState(DEFAULT_HOURS)

  const industryLabel = INDUSTRY_OPTIONS.find((o) => o.value === industry)?.label ?? industry

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
                onClick={() => router.navigate({ to: '/console/admin/setting/organization' })}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-full bg-blue-600 px-5 hover:bg-blue-700"
                onClick={() => {
                  /* mock: chưa gọi API */
                }}
              >
                Save changes
              </Button>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-[linear-gradient(120deg,#dbeafe,#eff6ff,#dbeafe)] sm:h-40 xl:h-48" />
            <div className="relative px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4 xl:px-8 xl:pb-6 xl:pt-5">
              <div className="absolute -top-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow sm:-top-10 sm:h-20 sm:w-20">
                <OrgLogo alt={name} className="h-full w-full" rounded="full" />
              </div>
              <div className="ml-20 flex flex-col gap-3 sm:ml-24 sm:flex-row sm:items-start sm:justify-between xl:ml-28">
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <FieldLabel htmlFor="edit-org-name">Organization name</FieldLabel>
                    <Input
                      id="edit-org-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 max-w-xl border-slate-200 font-bold text-slate-900"
                    />
                  </div>
                  <div className="max-w-xs">
                    <FieldLabel>Industry</FieldLabel>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="mt-1 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-slate-500">Preview: {industryLabel}</p>
                </div>
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
                <h2 className="text-xl font-semibold text-slate-900 xl:text-xl">General Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-1.5 sm:col-span-2">
                  <FieldLabel>Organization name</FieldLabel>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="border-slate-200" />
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
                <div className="space-y-1.5 sm:col-span-2">
                  <FieldLabel>Tax ID / VAT</FieldLabel>
                  <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} className="mt-1 border-slate-200" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <FieldLabel>Organization slug</FieldLabel>
                  <div className="mt-1 flex rounded-lg border border-slate-200 bg-white shadow-sm">
                    <span className="flex items-center whitespace-nowrap rounded-l-lg border-r border-slate-200 bg-slate-100 px-3 text-sm text-slate-600">
                      backtrack.com/
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="rounded-r-lg border-0 font-medium text-blue-600 focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Link2 className="h-3 w-3 text-blue-600" />
                  Shareable Link
                  <span className="font-normal text-slate-400">(mock)</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="break-all text-xs text-blue-600">{MOCK_SHAREABLE}</span>
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-blue-600 hover:bg-slate-200"
                    onClick={() => void navigator.clipboard.writeText(MOCK_SHAREABLE)}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
              <div className="mb-6 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-900 xl:text-xl">Opening Hours</h2>
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
                      <tr key={row.day} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-2 align-middle font-medium text-slate-700">{row.day}</td>
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
                            <span className="text-sm font-semibold text-red-600">—</span>
                          ) : (
                            <div className="flex flex-wrap items-center gap-2">
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
                                <SelectTrigger className="h-9 w-[130px] border-slate-200 text-sm">
                                  <SelectValue placeholder="Open" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {TIME_OPTIONS.map((t) => (
                                    <SelectItem key={`o-${row.day}-${t}`} value={t}>
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-slate-400">—</span>
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
                                <SelectTrigger className="h-9 w-[130px] border-slate-200 text-sm">
                                  <SelectValue placeholder="Close" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {TIME_OPTIONS.map((t) => (
                                    <SelectItem key={`c-${row.day}-${t}`} value={t}>
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
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900 xl:text-xl">Location &amp; Desk</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.35fr_1fr] xl:gap-7">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="edit-address">Physical address</FieldLabel>
                  <Textarea
                    id="edit-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="min-h-[100px] resize-y border-slate-200 text-sm"
                  />
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
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#ef4444_0_8px,transparent_9px),linear-gradient(135deg,#334155,#1e293b)]">
                  <MapPin className="h-10 w-10 text-white opacity-90" />
                </div>
                <p className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/80">
                  Map preview — connect API to show real map
                </p>
              </div>
            </div>
          </section>

          <p className="mt-6 text-center text-xs text-slate-400">
            Changes are not saved to the server yet (mock form).
          </p>
        </div>
      </div>
    </Layout>
  )
}
