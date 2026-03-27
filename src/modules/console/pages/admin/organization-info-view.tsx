import { Layout } from '../../components/admin/layout'
import { Bell, CircleHelp, Clock3, Copy, Eye, Info, Link2, MapPin, Square } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

const OPENING_HOURS = [
  { day: 'Monday', time: '08:00 AM - 06:00 PM' },
  { day: 'Tuesday', time: '08:00 AM - 06:00 PM' },
  { day: 'Wednesday', time: '08:00 AM - 06:00 PM' },
  { day: 'Thursday', time: '08:00 AM - 06:00 PM' },
  { day: 'Friday', time: '08:00 AM - 08:00 PM' },
  { day: 'Saturday', time: 'CLOSED' },
  { day: 'Sunday', time: 'CLOSED' },
]

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.16em] uppercase text-slate-400 font-normal">{label}</p>
      <p className="mt-1 text-sm text-slate-800 font-normal whitespace-pre-line">{value}</p>
    </div>
  )
}

export function OrganizationInfoViewPage() {
  const router = useRouter()

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="mx-auto">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between xl:mb-6">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl xl:text-[28px]">Organization Settings</h1>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:px-4 sm:py-2"
              >
                <Eye className="h-4 w-4" />
                Public Profile Preview
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({ to: '/console/admin/setting/organization/edit' })
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
            <div className="h-28 bg-[linear-gradient(120deg,#dbeafe,#eff6ff,#dbeafe)] sm:h-40 xl:h-48" />
            <div className="relative px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4 xl:px-8 xl:pb-6 xl:pt-5">
              <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow sm:-top-10 sm:h-20 sm:w-20">
                <Square className="h-7 w-7 text-blue-600" />
              </div>
              <div className="ml-20 flex flex-col gap-2 sm:ml-24 sm:flex-row sm:items-center sm:justify-between xl:ml-28">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl xl:text-xl">Acme Corporation Global</h2>
                  <p className="text-xs text-slate-500">Technology &amp; Software Solutions</p>
                </div>
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-blue-600 sm:text-[10px]">
                  Verified enterprise
                </span>
              </div>
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[5fr_3fr] xl:gap-7">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
              <div className="mb-6 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-slate-900 xl:text-xl">General Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <LabelValue label="Organization Name" value="Acme Corporation Global" />
                <LabelValue label="Industry Type" value="Enterprise Technology" />
                <LabelValue label="Phone Number" value="+1 (555) 123-4567" />
                <LabelValue label="Contact Email" value="support@acme-corp.com" />
                <LabelValue label="Tax ID / VAT" value="US-992033481-B" />
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-slate-400 font-normal">Organization Slug</p>
                  <a href="#" className="mt-1 inline-block text-sm font-normal text-blue-600 hover:text-blue-700">
                    backtrack.com/acme-corp
                  </a>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Link2 className="h-3 w-3 text-blue-600" />
                  Shareable Link
                </div>
                <div className="flex items-start justify-between gap-3">
                  <a
                    href="#"
                    className="break-all text-xs text-blue-600 hover:text-blue-700"
                  >
                    https://app.lostfoundpro.com/portal/acme-corp-global-v2
                  </a>
                  <button type="button" className="rounded-md p-1.5 text-blue-600 hover:bg-slate-200">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
              <div className="mb-6 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-slate-900 xl:text-xl">Opening Hours</h3>
              </div>

              <div className="space-y-3.5">
                {OPENING_HOURS.map((row) => (
                  <div key={row.day} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{row.day}</span>
                    <span className={`text-sm font-semibold ${row.time === 'CLOSED' ? 'text-slate-400' : 'text-slate-800'}`}>
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>

              
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:p-7">
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <h3 className="text-xl font-semibold text-slate-900 xl:text-xl">Location &amp; Desk</h3>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.35fr_1fr] xl:gap-7">
              <div className="space-y-5">
                <LabelValue label="Physical Address" value={'One Infinite Loop, Suite 200\nCupertino, CA 95014\nUnited States'} />
                <div className="max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Desk Location Note</p>
                  <p className="mt-1 text-sm text-slate-700 font-medium">
                    Level 1, behind the main reception area near the elevators.
                  </p>
                </div>
              </div>

              <div className="h-44 rounded-xl bg-[radial-gradient(circle_at_center,#ef4444_0_8px,transparent_9px),linear-gradient(135deg,#334155,#1e293b)] sm:h-56 xl:h-64" />
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
