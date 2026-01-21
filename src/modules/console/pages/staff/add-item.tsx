import { StaffLayout } from '../../components/staff/layout'
import { useState } from 'react'
import { Camera, X, ChevronRight } from 'lucide-react'
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
import { Link } from '@tanstack/react-router'
import { categories, locations } from '@/mock/data/mock-inventory'

export function AddFoundItemPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [category, setCategory] = useState<string>('')
  const [itemName, setItemName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [dateTime, setDateTime] = useState<string>('')
  const [whereFound, setWhereFound] = useState<string>('')
  const [location, setLocation] = useState<string>('')

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

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      photos,
      category,
      itemName,
      description,
      dateTime,
      whereFound,
      location,
    })
  }

  const handleSaveAndAddAnother = () => {
    handleSubmit()
    // Reset form except photos
    setCategory('')
    setItemName('')
    setDescription('')
    setDateTime('')
    setWhereFound('')
    setLocation('')
  }

  const filteredCategories = categories.filter((cat) => cat !== 'All')
  const filteredLocations = locations.filter((loc) => loc !== 'All')

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
          <form className="space-y-8">
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

            {/* Item Details Section */}
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-gray-900">Item Details</h2>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full mt-1">
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

              {/* Item Name */}
              <div>
                <Label htmlFor="itemName" className="text-sm font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
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

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item's condition, brand, or distinguishing marks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>

            {/* Date & Time Found */}
            <div>
              <Label htmlFor="dateTime" className="text-sm font-medium text-gray-700">
                Date & Time Found
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Where was it found? */}
            <div>
              <Label htmlFor="whereFound" className="text-sm font-medium text-gray-700">
                Where was it found?
              </Label>
              <Input
                id="whereFound"
                type="text"
                placeholder="Enter location description"
                value={whereFound}
                onChange={(e) => setWhereFound(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Select Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Select Location
              </Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location" className="w-full mt-1">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {filteredLocations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              >
                Save & add another
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save item
              </Button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  )
}

