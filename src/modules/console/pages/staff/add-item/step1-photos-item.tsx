import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ItemCategory } from '@/services/inventory.service'
import { Camera, ChevronRight, Loader2, Sparkles, X } from 'lucide-react'

export type PhotoPreview = { file: File; url: string }

export function Step1PhotosAndItem({
  photoPreviews,
  maxPhotos,
  onPickPhotos,
  onRemovePhoto,
  isAnalyzing,
  analyzeError,
  onAnalyze,
  itemName,
  setItemName,
  category,
  setCategory,
  brand,
  setBrand,
  color,
  setColor,
  condition,
  setCondition,
  material,
  setMaterial,
  size,
  setSize,
  distinctiveMarks,
  setDistinctiveMarks,
  description,
  setDescription,
  onNext,
}: {
  photoPreviews: PhotoPreview[]
  maxPhotos: number
  onPickPhotos: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemovePhoto: (index: number) => void
  isAnalyzing: boolean
  analyzeError: string | null
  onAnalyze: () => void
  itemName: string
  setItemName: (v: string) => void
  category: ItemCategory
  setCategory: (v: ItemCategory) => void
  brand: string
  setBrand: (v: string) => void
  color: string
  setColor: (v: string) => void
  condition: string
  setCondition: (v: string) => void
  material: string
  setMaterial: (v: string) => void
  size: string
  setSize: (v: string) => void
  distinctiveMarks: string
  setDistinctiveMarks: (v: string) => void
  description: string
  setDescription: (v: string) => void
  onNext: () => void
}) {
  return (
    <div className="space-y-6 mt-3">
      {/* Photos Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-semibold text-gray-900">Photos</div>
          <span className="text-sm text-slate-700">Max {maxPhotos} photos</span>
        </div>

        <div className="flex gap-4 flex-wrap">
          {photoPreviews.map((p, index) => (
            <div key={p.url} className="relative w-32 h-32 rounded-lg overflow-hidden group">
              <img src={p.url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemovePhoto(index)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {photoPreviews.length < maxPhotos && (
            <label className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onPickPhotos}
                className="hidden"
                disabled={photoPreviews.length >= maxPhotos}
              />
              <Camera className="w-6 h-6 text-slate-700 mb-2" />
              <span className="text-xs text-slate-800 text-center px-2">Add photos</span>
            </label>
          )}
        </div>

        {/* Auto-fill from photo */}
        {photoPreviews.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isAnalyzing}
              onClick={onAnalyze}
              className="flex items-center gap-2 border-slate-300 text-slate-950 hover:bg-slate-50"
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isAnalyzing ? 'Analyzing…' : 'Auto-fill from photo'}
            </Button>
            {analyzeError && <span className="text-xs text-red-600">{analyzeError}</span>}
          </div>
        )}
      </div>

      {/* Item fields */}
      <div className="rounded-xl border border-slate-200 p-5 space-y-6">
        <div className="text-base font-semibold text-slate-950">Item information</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="itemName" className="text-sm font-semibold text-slate-950">
              Item name <span className="text-red-600">*</span>
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

          <div>
            <Label htmlFor="category" className="text-sm font-semibold text-slate-950">
              Category <span className="text-red-600">*</span>
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-950 font-medium text-sm"
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
            <Label htmlFor="brand" className="text-sm font-semibold text-slate-950">
              Brand
            </Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="color" className="text-sm font-semibold text-slate-950">
              Color
            </Label>
            <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="condition" className="text-sm font-semibold text-slate-950">
              Condition
            </Label>
            <Input
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="material" className="text-sm font-semibold text-slate-950">
              Material
            </Label>
            <Input
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="size" className="text-sm font-semibold text-slate-950">
              Size
            </Label>
            <Input id="size" value={size} onChange={(e) => setSize(e.target.value)} className="mt-1" />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="distinctiveMarks" className="text-sm font-semibold text-slate-950">
              Distinctive marks
            </Label>
            <Input
              id="distinctiveMarks"
              placeholder="e.g. serial number, scratches, stickers"
              value={distinctiveMarks}
              onChange={(e) => setDistinctiveMarks(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-950">
              Description <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Write the key details that help identify the item…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[140px]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end me-2">
        <Button
          type="button"
          aria-label="Next"
          className="mb-2 h-8 w-8 rounded-full bg-slate-950 text-white hover:bg-slate-800"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5 mx-auto" />
        </Button>
      </div>
    </div>
  )
}

