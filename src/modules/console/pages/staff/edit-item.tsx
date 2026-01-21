import { StaffLayout } from '../../components/staff/layout'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/console/staff/item-edit/$itemId'
import { mockInventoryItems, categories, type ItemStatus } from '@/mock/data/mock-inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Filter } from '@/components/filters'

export function EditItemPage() {
  const { itemId } = Route.useParams()
  const navigate = useNavigate()
  const [mainImage, setMainImage] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Find item by ID
  const item = mockInventoryItems.find((i) => i.id === itemId)

  // Form state
  const [category, setCategory] = useState(item?.category || '')
  const [status, setStatus] = useState<ItemStatus | 'In Storage'>(item?.status === 'Storage' ? 'In Storage' : (item?.status || 'New'))
  const [storedLocation, setStoredLocation] = useState(item?.bin || '')
  const [description, setDescription] = useState(
    'Standard blue denim jacket, size M. Shows some signs of wear around the collar. Contains a pair of black sunglasses in the left breast pocket. No other contents found.'
  )
  const [internalNotes, setInternalNotes] = useState(
    'Customer called on Oct 25th inquiring about a similar item. Asked to hold until Friday for pickup. Reference Ticket #9982.'
  )

  if (!item) {
    return (
      <StaffLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're looking for doesn't exist.</p>
            <Link to="/console/staff/inventory">
              <Button>Back to Inventory</Button>
            </Link>
          </div>
        </div>
      </StaffLayout>
    )
  }

  // Mock images
  const images = [item.image, item.image, item.image]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validation
    if (!storedLocation.trim()) {
      newErrors.storedLocation = 'This field is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Save changes (mock)
    console.log('Saving changes:', {
      category,
      status,
      storedLocation,
      description,
      internalNotes,
    })

    // Navigate back to item detail
    navigate({
      to: '/console/staff/item/$itemId',
      params: { itemId },
    })
  }

  const statusOptions: ItemStatus[] = ['New', 'Storage', 'Claimed', 'Disposed']
  const filteredCategories = categories.filter((c) => c !== 'All')

  return (
    <StaffLayout>
      <div className="p-8 min-h-screen">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link
            to="/console/staff/inventory"
            className="hover:text-gray-900 transition-colors"
          >
            Inventory
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to="/console/staff/item/$itemId"
            params={{ itemId }}
            className="hover:text-gray-900 transition-colors"
          >
            Item #{item.id}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Edit</span>
        </div>

        {/* Error Message */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium mb-1">
                There were errors with your submission.
              </p>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Item: {item.title}</h1>
          <p className="text-gray-600 mt-1">
            Update item details, manage photos, and change status.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Photos</h3>
            
            {/* Main Photo */}
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={images[mainImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                Main Photo
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMainImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === idx
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <button
                type="button"
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
              >
                <span className="text-2xl">+</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Drag thumbnails to reorder</p>
            <Button type="button" variant="outline" className="mt-3">
              ADD
            </Button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Category
                </Label>
                <Filter
                  type="select"
                  value={category}
                  onChange={setCategory}
                  options={filteredCategories.map((c) => ({ value: c, label: c }))}
                  showAll={false}
                  className="w-full"
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Status
                </Label>
                <Filter
                  type="select"
                  value={status === 'Storage' ? 'In Storage' : status}
                  onChange={(val) => setStatus(val === 'In Storage' ? 'Storage' : (val as ItemStatus))}
                  options={statusOptions.map((s) => ({
                    value: s === 'Storage' ? 'In Storage' : s,
                    label: s === 'Storage' ? 'In Storage' : s,
                  }))}
                  showAll={false}
                  className="w-full"
                />
              </div>

              {/* Created By */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Created By
                </Label>
                <Input
                  value="Jane Doe (Security)"
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Stored Location */}
              <div>
                <Label htmlFor="storedLocation" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Stored Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="storedLocation"
                    value={storedLocation}
                    onChange={(e) => {
                      setStoredLocation(e.target.value)
                      if (errors.storedLocation) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors.storedLocation
                          return newErrors
                        })
                      }
                    }}
                    placeholder="e.g. Storage Room A, Shelf 3"
                    className={errors.storedLocation ? 'border-red-500 pr-10' : ''}
                  />
                  {errors.storedLocation && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                {errors.storedLocation && (
                  <p className="text-red-500 text-sm mt-1">{errors.storedLocation}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              {/* Internal Notes */}
              <div>
                <Label htmlFor="internalNotes" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Internal Notes
                </Label>
                <Textarea
                  id="internalNotes"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Internal notes are visible to staff only.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <Link to="/console/staff/item/$itemId" params={{ itemId }}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </StaffLayout>
  )
}

