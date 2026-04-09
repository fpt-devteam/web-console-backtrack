import { StaffLayout } from '../../components/staff/layout'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/console/$slug/staff/item-handover/$itemId'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { Spinner } from '@/components/ui/spinner'
import { useCreateOrgReturnReport } from '@/hooks/use-return-report'
import { showToast } from '@/lib/toast'

const statusOptions = ['Active', 'InStorage', 'ReturnScheduled', 'Returned', 'Archived', 'Expired'] as const

export function HandoverItemPage() {
  const { slug, itemId } = Route.useParams()
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()

  const { data: item, isLoading } = useInventoryItem(currentOrgId, itemId)
  const createReturnReport = useCreateOrgReturnReport()

  // UI-only fields (not sent to API yet)
  const [recipientFullName, setRecipientFullName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientNationalId, setRecipientNationalId] = useState('')
  const [recipientInternalId, setRecipientInternalId] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [returningStaff, setReturningStaff] = useState('')
  const [status, setStatus] = useState<string>('Returned')

  if (isLoading) {
    return (
      <StaffLayout>
        <div className="p-8 min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </StaffLayout>
    )
  }

  if (!item) {
    return (
      <StaffLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're looking for doesn't exist.</p>
            <Link to="/console/$slug/staff/inventory" params={{ slug }}>
              <Button>Back to Inventory</Button>
            </Link>
          </div>
        </div>
      </StaffLayout>
    )
  }

  return (
    <StaffLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link
              to="/console/$slug/staff/inventory"
              params={{ slug }}
              className="hover:text-gray-900 transition-colors"
            >
              Inventory
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to="/console/$slug/staff/item/$itemId"
              params={{ slug, itemId }}
              className="hover:text-gray-900 transition-colors"
            >
              {item.item.itemName}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Handover</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Handover / Return</h1>
            <p className="text-gray-600 mt-1">
              Recipient information, returning staff, and item status.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault()
                if (!currentOrgId) {
                  showToast.error('No active organization')
                  return
                }
                if (!status) {
                  showToast.error('Please select status')
                  return
                }

                createReturnReport.mutate(
                  {
                    orgId: currentOrgId,
                    postId: itemId,
                    ownerInfo: {
                      ownerName: recipientFullName.trim() || null,
                      email: recipientEmail.trim() || null,
                      phone: recipientPhone.trim() || null,
                      nationalId: recipientNationalId.trim() || null,
                      orgMemberId: recipientInternalId.trim() || null,
                    },
                  },
                  {
                    onSuccess: () => {
                      showToast.success('Handover saved')
                      navigate({ to: `/console/${slug}/staff/item/${itemId}` })
                    },
                    onError: (err) => {
                      showToast.error(err instanceof Error ? err.message : 'Failed to save handover')
                    },
                  },
                )
              }}
            >
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-gray-900">Recipient information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipientFullName" className="text-sm font-medium text-gray-700">
                      Full name
                    </Label>
                    <Input
                      id="recipientFullName"
                      type="text"
                      placeholder="e.g. Morgan Lee"
                      value={recipientFullName}
                      onChange={(e) => setRecipientFullName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientEmail" className="text-sm font-medium text-gray-700">
                      Email (optional)
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientNationalId" className="text-sm font-medium text-gray-700">
                      National ID / citizen ID (number)
                    </Label>
                    <Input
                      id="recipientNationalId"
                      type="text"
                      placeholder="e.g. 079092******441"
                      value={recipientNationalId}
                      onChange={(e) => setRecipientNationalId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientInternalId" className="text-sm font-medium text-gray-700">
                      Student / staff ID (internal)
                    </Label>
                    <Input
                      id="recipientInternalId"
                      type="text"
                      placeholder="e.g. STF-88012"
                      value={recipientInternalId}
                      onChange={(e) => setRecipientInternalId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="recipientPhone" className="text-sm font-medium text-gray-700">
                    Phone number
                  </Label>
                  <Input
                    id="recipientPhone"
                    type="tel"
                    placeholder="e.g. +1 415 000 9021"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <h2 className="text-base font-semibold text-gray-900">Return handling</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="returningStaff" className="text-sm font-medium text-gray-700">
                      Returning staff
                    </Label>
                    <Input
                      id="returningStaff"
                      type="text"
                      placeholder="e.g. Taylor Kim"
                      value={returningStaff}
                      onChange={(e) => setReturningStaff(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Item status
                    </Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status" className="mt-1 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s === 'InStorage'
                              ? 'In Storage'
                              : s === 'ReturnScheduled'
                                ? 'Return Scheduled'
                                : s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Link to="/console/$slug/staff/item/$itemId" params={{ slug, itemId }}>
                  <Button type="button" variant="outline" disabled={createReturnReport.isPending}>Cancel</Button>
                </Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createReturnReport.isPending}>
                  {createReturnReport.isPending ? 'Saving…' : 'Save handover'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

