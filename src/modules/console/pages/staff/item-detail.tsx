import { StaffLayout } from '../../components/staff/layout'
import { ChevronRight, Trash2, User, Package, Info, Building2, Camera } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { mockInventoryItems, type ItemStatus } from '@/mock/data/mock-inventory'
import { Button } from '@/components/ui/button'

export function ItemDetailPage() {
  const { itemId } = useParams({ from: '/console/staff/item/$itemId' })
  const [mainImage, setMainImage] = useState(0)

  // Find item by ID
  const item = mockInventoryItems.find((i) => i.id === itemId)

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

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
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

  // Mock additional images (duplicate for demo)
  const images = [item.image, item.image, item.image]

  // Mock description
  const description = `Standard ${item.title.toLowerCase()}, size M. Shows some signs of wear around the collar. Contains a pair of black sunglasses in the left breast pocket. No other contents found.`

  // Mock internal notes
  const internalNote = `Customer called on Oct 25th inquiring about a similar item. Asked to hold until Friday for pickup. Reference Ticket #9582.`

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
          <span className="text-gray-900 font-medium">Item #{item.id}</span>
        </div>

        {/* Main Card - All Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(item.status)}`}
                >
                  {item.status === 'Storage' ? 'In Storage' : item.status}
                </span>
              </div>
              <p className="text-gray-600">
                Item #{item.id} • Added on {item.date}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Link to="/console/staff/item-edit/$itemId" params={{ itemId: item.id }}>
                <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
              </Link>
            </div>
          </div>

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
                <button className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover: transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column - Details (4/7) */}
            <div className="lg:col-span-4 py-6 px-8 space-y-6">
              {/* Info Grid - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <div className="text-xs font-semibold  uppercase mb-2">
                    CATEGORY
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>{item.category}</span>
                  </div>
                </div>

                {/* Created By */}
                <div>
                  <div className="text-xs font-semibold  uppercase mb-2">
                    CREATED BY
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Jane Doe (Security)</span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div className="text-xs font-semibold  uppercase mb-2">
                    STATUS
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>{item.status === 'Storage' ? 'In Storage' : item.status}</span>
                  </div>
                </div>

                {/* Stored Location */}
                <div>
                  <div className="text-xs font-semibold  uppercase mb-2">
                    STORED LOCATION
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>{item.bin || 'Storage Room A, Shelf 3'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-xs font-semibold  uppercase mb-2">
                  Description
                </div>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>

              {/* Internal Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Note:</span> {internalNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

