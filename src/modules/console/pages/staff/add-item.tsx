import { StaffLayout } from '../../components/staff/layout'
import { useState } from 'react'
import { Camera, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Link, useNavigate } from '@tanstack/react-router'
import { useCreateInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrganization } from '@/hooks/use-org'
import type { FinderContactField } from '@/types/organization.types'

function optionalTrim(value: string): string | undefined {
  const t = value.trim()
  return t ? t : undefined
}

/** Ngoài name, BE/UX yêu cầu ít nhất một trong các trường liên hệ/định danh */
function hasAtLeastOneFinderDetail(finder: {
  email: string
  phone: string
  nationalId: string
  orgMemberId: string
}): boolean {
  return Boolean(
    finder.email.trim() ||
      finder.phone.trim() ||
      finder.nationalId.trim() ||
      finder.orgMemberId.trim(),
  )
}

function validateOrgRequiredFinderFields(
  required: FinderContactField[] | undefined,
  finder: {
    email: string
    phone: string
    nationalId: string
    orgMemberId: string
  },
): string | null {
  for (const field of required ?? []) {
    switch (field) {
      case 'Email':
        if (!finder.email.trim()) return 'Finder email is required for this organization.'
        break
      case 'Phone':
        if (!finder.phone.trim()) return 'Finder phone is required for this organization.'
        break
      case 'NationalId':
        if (!finder.nationalId.trim()) return 'Finder national ID is required for this organization.'
        break
      case 'OrgMemberId':
        if (!finder.orgMemberId.trim()) return 'Finder student/staff ID is required for this organization.'
        break
    }
  }
  return null
}

export function AddFoundItemPage() {
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()
  const { data: org } = useOrganization(currentOrgId)
  const createItem = useCreateInventoryItem(currentOrgId)
  const [photos, setPhotos] = useState<string[]>([])
  const [itemName, setItemName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [distinctiveMarks, setDistinctiveMarks] = useState<string>('')
  const [storageLocation, setStorageLocation] = useState<string>('')
  const [finderFullName, setFinderFullName] = useState<string>('')
  const [finderEmail, setFinderEmail] = useState<string>('')
  const [finderNationalId, setFinderNationalId] = useState<string>('')
  const [finderInternalId, setFinderInternalId] = useState<string>('')
  const [finderPhone, setFinderPhone] = useState<string>('')

  const [recipientFullName, setRecipientFullName] = useState<string>('')
  const [recipientEmail, setRecipientEmail] = useState<string>('')
  
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const maxPhotos = 5
    const remainingSlots = maxPhotos - photos.length
    if (remainingSlots <= 0) return

    const filesArray = Array.from(files).slice(0, remainingSlots)
    const newPhotos: Promise<string>[] = []

    filesArray.forEach((file) => {
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string)
          } else {
            resolve('')
          }
        }
        reader.readAsDataURL(file)
      })
      newPhotos.push(promise)
    })

    Promise.all(newPhotos).then((results) => {
      setPhotos((prev) => [...prev, ...results.filter((r) => r)])
    })

    // Reset input
    e.target.value = ''
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const requiredFinderFields = org?.requiredFinderContactFields ?? []
  const finderFieldRequired = (field: FinderContactField) => requiredFinderFields.includes(field)

  const buildPayload = () => ({
    itemName: itemName.trim(),
    description: description.trim(),
    distinctiveMarks: distinctiveMarks.trim() || undefined,
    imageUrls: photos.length > 0 ? photos : undefined,
    storageLocation: storageLocation.trim() || undefined,
    finderContact: {
      name: finderFullName.trim(),
      email: optionalTrim(finderEmail),
      phone: optionalTrim(finderPhone),
      nationalId: optionalTrim(finderNationalId),
      orgMemberId: optionalTrim(finderInternalId),
    },
  })

  const handleSubmit = (addAnother: boolean) => {
    setSubmitError(null)
    if (!itemName.trim()) {
      setSubmitError('Item name is required.')
      return
    }
    if (!description.trim()) {
      setSubmitError('Description is required.')
      return
    }
    if (!finderFullName.trim()) {
      setSubmitError('Finder full name is required.')
      return
    }
    if (
      !hasAtLeastOneFinderDetail({
        email: finderEmail,
        phone: finderPhone,
        nationalId: finderNationalId,
        orgMemberId: finderInternalId,
      })
    ) {
      setSubmitError(
        'Add at least one finder detail: email, phone, national ID, or student/staff ID.',
      )
      return
    }
    const orgFinderError = validateOrgRequiredFinderFields(org?.requiredFinderContactFields, {
      email: finderEmail,
      phone: finderPhone,
      nationalId: finderNationalId,
      orgMemberId: finderInternalId,
    })
    if (orgFinderError) {
      setSubmitError(orgFinderError)
      return
    }
    createItem.mutate(buildPayload(), {
      onSuccess: () => {
        if (addAnother) {
          setItemName('')
          setDescription('')
          setDistinctiveMarks('')
          setStorageLocation('')
          setPhotos([])
          setFinderFullName('')
          setFinderEmail('')
          setFinderNationalId('')
          setFinderInternalId('')
          setFinderPhone('')
          setRecipientFullName('')
          setRecipientEmail('')
        
        } else {
          navigate({ to: '/console/staff/inventory' })
        }
      },
      onError: (err) => {
        setSubmitError(err instanceof Error ? err.message : 'Failed to create item.')
      },
    })
  }

  const handleSaveAndAddAnother = () => {
    handleSubmit(true)
  }


  return (
    <StaffLayout>
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link
              to="/console/staff/inventory"
              className="hover:text-gray-900 transition-colors"
            >
              Inventory
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Add Found Item</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Add Found Item</h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {submitError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {submitError}
            </div>
          )}
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(false)
            }}
          >
            {/* Photos Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold text-gray-900">
                  Photos
                </Label>
                <span className="text-sm text-gray-500">Max 5 photos</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden group">
                    <img
                      src={photo}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={photos.length >= 5}
                    />
                    <Camera className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center px-2">
                      Add photos
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Product information block */}
            <div className="space-y-6 rounded-lg border border-gray-200 p-4">
              <h2 className="text-base font-semibold text-gray-900">Product information</h2>

              {/* Item Name (BE required) */}
              <div>
                <Label htmlFor="itemName" className="text-sm font-medium text-gray-700">
                  Item name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemName"
                  type="text"
                  placeholder="e.g. Blue Umbrella"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Description (BE required) */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item's condition, brand, or distinguishing marks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-[120px]"
                />
              </div>

              {/* Distinctive marks (BE optional) */}
              <div>
                <Label htmlFor="distinctiveMarks" className="text-sm font-medium text-gray-700">
                  Distinctive marks
                </Label>
                <Input
                  id="distinctiveMarks"
                  type="text"
                  placeholder="e.g. color, brand, serial number"
                  value={distinctiveMarks}
                  onChange={(e) => setDistinctiveMarks(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Storage Location (optional) */}
              <div>
                <Label htmlFor="storageLocation" className="text-sm font-medium text-gray-700">
                  Storage location
                </Label>
                <Input
                  id="storageLocation"
                  type="text"
                  placeholder="e.g. Shelf A, Room 101, Front desk drawer"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* People information block */}
            <div className="space-y-8 rounded-lg border border-gray-200 p-4">
              {/* Finder information — POST finderContact */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Finder information</h3>
                  <p className="text-sm text-gray-600">
                    Contact and ID details of the person who found or handed in the item.
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Full name is required. Provide at least one of: email, phone, national ID, or
                    student/staff ID.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="finderFullName" className="text-sm font-medium text-gray-700">
                      Full name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="finderFullName"
                      type="text"
                      placeholder="e.g. Alex Tran"
                      value={finderFullName}
                      onChange={(e) => setFinderFullName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="finderEmail" className="text-sm font-medium text-gray-700">
                      Email
                      {finderFieldRequired('Email') && <span className="text-red-500"> *</span>}
                    </Label>
                    <Input
                      id="finderEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={finderEmail}
                      onChange={(e) => setFinderEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="finderNationalId" className="text-sm font-medium text-gray-700">
                      National ID / citizen ID (number)
                      {finderFieldRequired('NationalId') && <span className="text-red-500"> *</span>}
                    </Label>
                    <Input
                      id="finderNationalId"
                      type="text"
                      placeholder="e.g. 079185******123"
                      value={finderNationalId}
                      onChange={(e) => setFinderNationalId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="finderInternalId" className="text-sm font-medium text-gray-700">
                      Student / staff ID (internal)
                      {finderFieldRequired('OrgMemberId') && <span className="text-red-500"> *</span>}
                    </Label>
                    <Input
                      id="finderInternalId"
                      type="text"
                      placeholder="e.g. STU-22123456"
                      value={finderInternalId}
                      onChange={(e) => setFinderInternalId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="finderPhone" className="text-sm font-medium text-gray-700">
                    Phone number
                    {finderFieldRequired('Phone') && <span className="text-red-500"> *</span>}
                  </Label>
                  <Input
                    id="finderPhone"
                    type="tel"
                    placeholder="e.g. +1 903 000 6782"
                    value={finderPhone}
                    onChange={(e) => setFinderPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Receiving staff information (UI only) */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Receiving staff information</h3>
                  <p className="text-sm text-gray-600">
                    Contact and ID details of the staff member who receives the item.
                  </p>
                </div>
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
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-sm font-medium text-gray-700">Organization</p>
              <p className="text-sm text-gray-600 mt-0.5">
                {org
                  ? [org.name, org.displayAddress].filter(Boolean).join(' – ') || '—'
                  : '—'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Link to="/console/staff/inventory">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveAndAddAnother}
                disabled={createItem.isPending}
              >
                Save & add another
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createItem.isPending}
              >
                {createItem.isPending ? 'Saving...' : 'Save item'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  )
}

