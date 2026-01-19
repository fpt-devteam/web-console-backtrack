import { StaffLayout } from '../../components/staff/layout'
import { Plus, MapPin, Clock, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import {
  mockInventoryItems,
  type ItemStatus,
} from '@/mock/data/mock-inventory'
import { SearchFilter } from '@/components/filters'
import { Pagination } from '@/components/ui/pagination'
import { Link } from '@tanstack/react-router'

export function StaffFeedPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Mock descriptions for items
  const getItemDescription = (title: string, location: string) => {
    const descriptions: Record<string, string> = {
      'Dell XPS 13 Laptop':
        'Found near the lobby reception desk, left on the waiting area sofa.',
      'Red Nike Sneaker (Left)':
        'Single red Nike sneaker found in the gym locker room area.',
      'Set of History Books':
        'Stack of history textbooks found in the library reading area.',
      'Starbucks Tumbler':
        'Stainless steel tumbler with Starbucks logo, found in cafeteria.',
      'iPhone 14 Pro': 'Black iPhone 14 Pro found in conference room B.',
      'Black Leather Wallet':
        'Leather wallet with multiple cards, found near elevator.',
      'Blue Backpack': 'Blue backpack with laptop compartment, found in hallway.',
      'AirPods Pro': 'White AirPods Pro with charging case, found in meeting room.',
    }
    return (
      descriptions[title] || `Found at ${location}, please check with reception.`
    )
  }

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500 text-white'
      case 'Storage':
        return 'bg-yellow-500 text-white'
      case 'Claimed':
        return 'bg-green-500 text-white'
      case 'Disposed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  // Filter items to show only New and Storage
  const feedItems = mockInventoryItems.filter(
    (item) => item.status === 'New' || item.status === 'Storage'
  )

  // Search filter
  const filteredItems = searchTerm
    ? feedItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : feedItems

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <StaffLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Item Feed</h1>
          </div>
          <Link to="/console/staff/inventory-add-item">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
              <Plus className="w-5 h-5" />
              Add found item
            </button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex items-center gap-4">
          <SearchFilter
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search items..."
            className="flex-1"
          />
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Items Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {getItemDescription(item.title, item.location)}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Posted {item.date === 'Today' ? 'today' : item.date}</span>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredItems.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </StaffLayout>
  )
}
