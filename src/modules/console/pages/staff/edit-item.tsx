import { StaffLayout } from '../../components/staff/layout'
import { ChevronRight, AlertCircle, User, Package, Info, Building2, Camera } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/console/staff/item-edit/$itemId'
import { mockInventoryItems, categories, type ItemStatus } from '@/mock/data/mock-inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

  const getStatusColor = (status: ItemStatus | 'In Storage') => {
    const actualStatus = status === 'In Storage' ? 'Storage' : status
    switch (actualStatus) {
      case 'New':
        return 'bg-blue-500 text-white'
      case 'Storage':
        return 'bg-blue-500 text-white'
      case 'Claimed':
        return 'bg-green-500 text-white'
      case 'Disposed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <StaffLayout>
      <div className="p-6 h-full overflow-y-auto mx-6">
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

        {/* Main Card - All Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <Select
                  value={status === 'Storage' ? 'In Storage' : status}
                  onValueChange={(val) => setStatus(val === 'In Storage' ? 'Storage' : (val as ItemStatus))}
                >
                  <SelectTrigger className={`w-auto !border-0 !shadow-none !bg-transparent ${getStatusColor(status)} !px-3 !py-1 !rounded-md !text-xs !font-bold uppercase !h-auto !min-h-0 cursor-pointer hover:opacity-90 [&>span]:!text-white [&>svg]:hidden`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s === 'Storage' ? 'In Storage' : s}>
                        {s === 'Storage' ? 'In Storage' : s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-gray-600">
                Item #{item.id} • Added on {item.date}
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/console/staff/item/$itemId" params={{ itemId }}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" form="edit-item-form" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>

          {/* Form */}
          <form id="edit-item-form" onSubmit={handleSubmit}>
            {/* Images and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-7">
              {/* Left Column - Images (3/7) */}
              <div className="lg:col-span-3 p-6 border-r border-gray-200">
                {/* Main Image */}
                <div className="relative h-[350px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[mainImage]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                    Main Photo
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3">
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
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Column - Form Fields (4/7) */}
              <div className="lg:col-span-4 py-6 px-8 space-y-6">
                {/* Error Message */}
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
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

                {/* Info Grid - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">
                      CATEGORY
                    </div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Package className="w-4 h-4 text-blue-600" />
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Created By */}
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">
                      CREATED BY
                    </div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Jane Doe (Security)</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">
                      STATUS
                    </div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Info className="w-4 h-4 text-blue-600" />
                      <Select
                        value={status === 'Storage' ? 'In Storage' : status}
                        onValueChange={(val) => setStatus(val === 'In Storage' ? 'Storage' : (val as ItemStatus))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s === 'Storage' ? 'In Storage' : s}>
                              {s === 'Storage' ? 'In Storage' : s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Stored Location */}
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">
                      STORED LOCATION <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="relative flex-1">
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
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                          )}
                        </div>
                      </div>
                      {errors.storedLocation && (
                        <p className="text-red-500 text-sm mt-1 ml-6">{errors.storedLocation}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-xs font-semibold uppercase mb-2">
                    Description
                  </div>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                    placeholder="Enter item description..."
                  />
                </div>

                {/* Internal Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-xs font-semibold uppercase mb-2">
                    Internal Notes
                  </div>
                  <Textarea
                    id="internalNotes"
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="min-h-[100px] bg-white"
                    placeholder="Add internal notes..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Internal notes are visible to staff only.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  )
}

