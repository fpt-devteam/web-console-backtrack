import { StaffLayout } from '../../components/staff/layout'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/console/$slug/staff/item-edit/$itemId'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useInventoryItem, useUpdateInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { Spinner } from '@/components/ui/spinner'
import type { ItemCategory, PostStatus } from '@/services/inventory.service'

function statusLabel(status: PostStatus) {
  switch (status) {
    case 'InStorage':
      return 'In Storage'
    case 'ReturnScheduled':
      return 'Return Scheduled'
    default:
      return status
  }
}

function statusBadgeClass(status: PostStatus) {
  switch (status) {
    case 'Active':
      return 'bg-blue-100 text-blue-800'
    case 'InStorage':
      return 'bg-indigo-100 text-indigo-800'
    case 'ReturnScheduled':
      return 'bg-amber-100 text-amber-800'
    case 'Returned':
      return 'bg-green-100 text-green-800'
    case 'Archived':
      return 'bg-gray-200 text-gray-800'
    case 'Expired':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function EditItemPage() {
  const { slug, itemId } = Route.useParams()
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()
  const [mainImage, setMainImage] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: item, isLoading } = useInventoryItem(currentOrgId, itemId)
  const updateItem = useUpdateInventoryItem(currentOrgId)

  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [distinctiveMarks, setDistinctiveMarks] = useState('')
  const [category, setCategory] = useState<ItemCategory>('Other')
  const [color, setColor] = useState('')
  const [brand, setBrand] = useState('')
  const [condition, setCondition] = useState('')
  const [material, setMaterial] = useState('')
  const [size, setSize] = useState('')
  const [status, setStatus] = useState<PostStatus>('Active')

  useEffect(() => {
    if (item) {
      setItemName(item.item?.itemName ?? '')
      setDescription(item.item?.additionalDetails ?? '')
      setDistinctiveMarks(item.item?.distinctiveMarks ?? '')
      setCategory(item.item?.category ?? 'Other')
      setColor(item.item?.color ?? '')
      setBrand(item.item?.brand ?? '')
      setCondition(item.item?.condition ?? '')
      setMaterial(item.item?.material ?? '')
      setSize(item.item?.size ?? '')
      setStatus((item.status as PostStatus) ?? 'Active')
    }
  }, [item])

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

  const images = item.imageUrls?.length ? item.imageUrls : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!itemName.trim()) {
      newErrors.itemName = 'Item name is required'
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    updateItem.mutate(
      {
        id: itemId,
        payload: {
          status,
          itemName: itemName.trim(),
          description: description.trim(),
          distinctiveMarks: distinctiveMarks.trim() || undefined,
          category,
          color: color.trim() || undefined,
          brand: brand.trim() || undefined,
          condition: condition.trim() || undefined,
          material: material.trim() || undefined,
          size: size.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          navigate({ to: `/console/${slug}/staff/item/${itemId}` })
        },
        onError: (err) => {
          setErrors({ submit: err instanceof Error ? err.message : 'Failed to update item.' })
        },
      },
    )
  }

  return (
    <StaffLayout>
      <div className="p-6 h-full overflow-y-auto mx-6">
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
          <span className="text-gray-900 font-medium">Edit</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.item.itemName}</h1>
              </div>
              <p className="text-gray-600">
                Added {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(status)}`}
              >
                {statusLabel(status)}
              </span>
            </div>
          </div>

          <form id="edit-item-form" onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Images (moved to top) */}
              <div className="mb-6">
                {images.length > 0 ? (
                  <div className="flex gap-3 flex-wrap">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMainImage(idx)}
                        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border-2 transition-all ${
                          mainImage === idx
                            ? 'border-blue-600 ring-2 ring-blue-200'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-6">
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium mb-1">
                        There were errors with your submission.
                      </p>
                      <ul className="text-red-700 text-sm space-y-1">
                        {Object.entries(errors).map(([field, message]) => (
                          <li key={field}>&bull; {message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Row 1: Status (full width) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <div className="text-xs font-semibold uppercase mb-2">STATUS</div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PostStatus)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm"
                    >
                      {(['Active', 'InStorage', 'ReturnScheduled', 'Archived', 'Expired'] as const).map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 2: Category + Item name */}
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">
                      CATEGORY <span className="text-red-500">*</span>
                    </div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ItemCategory)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm"
                    >
                      {(
                        [
                          'Electronics',
                          'Clothing',
                          'Accessories',
                          'Documents',
                          'Wallet',
                          'Suitcase',
                          'Bags',
                          'Keys',
                          'Other',
                        ] as ItemCategory[]
                      ).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">
                      ITEM NAME <span className="text-red-500">*</span>
                    </div>
                    <Input
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value)
                        if (errors.itemName) {
                          setErrors((prev) => { const n = { ...prev }; delete n.itemName; return n })
                        }
                      }}
                      placeholder="e.g. Blue Umbrella"
                      className={errors.itemName ? 'border-red-500' : ''}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-xs font-semibold uppercase mb-2">DISPLAY ADDRESS</div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={item.displayAddress ?? ''}
                        readOnly
                        placeholder="—"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">BRAND</div>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Apple" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">COLOR</div>
                    <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Black" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">CONDITION</div>
                    <Input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g. Used" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">MATERIAL</div>
                    <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Leather" />
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs font-semibold uppercase mb-2">SIZE</div>
                    <Input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 15-inch" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase mb-2">DISTINCTIVE MARKS</div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={distinctiveMarks}
                      onChange={(e) => setDistinctiveMarks(e.target.value)}
                      placeholder="e.g. color, brand, serial number"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase mb-2">
                    DESCRIPTION <span className="text-red-500">*</span>
                  </div>
                  <Textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      if (errors.description) {
                        setErrors((prev) => { const n = { ...prev }; delete n.description; return n })
                      }
                    }}
                    className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Enter item description..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <Link to="/console/$slug/staff/item/$itemId" params={{ slug, itemId }}>
                    <Button type="button" variant="outline" disabled={updateItem.isPending}>
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={updateItem.isPending}
                  >
                    {updateItem.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  )
}
