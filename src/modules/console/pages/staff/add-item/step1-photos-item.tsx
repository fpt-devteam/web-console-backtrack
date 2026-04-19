import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { InventorySubcategory, ItemCategory } from '@/services/inventory.service'
import { Camera, ChevronRight, Loader2, Sparkles, X } from 'lucide-react'

export type PhotoPreview = { file: File; url: string }

export type Step1PhotosAndItemProps = {
  photoPreviews: PhotoPreview[]
  maxPhotos: number
  onPickPhotos: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemovePhoto: (index: number) => void
  onReorderPhotos: (fromIndex: number, toIndex: number) => void
  isAnalyzing: boolean
  onAnalyze: () => void
  analyzeDisabled?: boolean
  analyzeHint?: string
  itemName: string
  setItemName: (v: string) => void
  category: ItemCategory
  setCategory: (v: ItemCategory) => void
  subcategories: InventorySubcategory[]
  subcategoryCode: string
  setSubcategoryCode: (v: string) => void
  holderName: string
  setHolderName: (v: string) => void
  cardNumber: string
  setCardNumber: (v: string) => void
  issuingAuthority: string
  setIssuingAuthority: (v: string) => void
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
  model: string
  setModel: (v: string) => void
  hasCase: boolean
  setHasCase: (v: boolean) => void
  caseDescription: string
  setCaseDescription: (v: string) => void
  lockScreenDescription: string
  setLockScreenDescription: (v: string) => void
  dateOfBirth: string
  setDateOfBirth: (v: string) => void
  issueDate: string
  setIssueDate: (v: string) => void
  expiryDate: string
  setExpiryDate: (v: string) => void
  onNext: () => void
}

export function Step1PhotosAndItem({
  photoPreviews,
  maxPhotos,
  onPickPhotos,
  onRemovePhoto,
  onReorderPhotos,
  isAnalyzing,
  onAnalyze,
  analyzeDisabled,
  analyzeHint,
  itemName,
  setItemName,
  category,
  setCategory,
  subcategories,
  subcategoryCode,
  setSubcategoryCode,
  holderName,
  setHolderName,
  cardNumber,
  setCardNumber,
  issuingAuthority,
  setIssuingAuthority,
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
  model,
  setModel,
  hasCase,
  setHasCase,
  caseDescription,
  setCaseDescription,
  lockScreenDescription,
  setLockScreenDescription,
  dateOfBirth,
  setDateOfBirth,
  issueDate,
  setIssueDate,
  expiryDate,
  setExpiryDate,
  onNext,
}: Step1PhotosAndItemProps) {
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
            <div
              key={p.url}
              className="relative w-32 h-32 rounded-lg overflow-hidden group"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', String(index))
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              }}
              onDrop={(e) => {
                e.preventDefault()
                const raw = e.dataTransfer.getData('text/plain')
                const from = Number(raw)
                if (!Number.isFinite(from)) return
                onReorderPhotos(from, index)
              }}
              aria-label={`Photo ${index + 1}`}
              title="Drag to reorder"
            >
              <img src={p.url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemovePhoto(index)}
                className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

        <div className="mt-4">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={Boolean(analyzeDisabled) || isAnalyzing}
            title={analyzeHint}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-black transition-all font-medium text-sm hover:bg-gray-50 hover:scale-[1.03] hover:drop-shadow-sm disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Sparkles className="h-4 w-4 shrink-0" />}
            Analyze
          </button>
        </div>
      </div>

      {/* Item fields */}
      <div className="rounded-xl border border-slate-200 p-5 space-y-6">
        <div className="text-base font-semibold text-slate-950">Item information</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category === 'PersonalBelongings' || category === 'Electronics' ? (
            <div className="md:col-span-2">
              <Label htmlFor="itemName" className="text-sm font-semibold text-slate-950">
                Item name <span className="text-xs font-normal text-slate-500">(optional, not stored by server)</span>
              </Label>
              <Input
                id="itemName"
                type="text"
                placeholder="Local label only"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-1"
              />
            </div>
          ) : null}

          {category === 'Others' ? (
            <div className="md:col-span-2">
              <Label htmlFor="itemIdentifier" className="text-sm font-semibold text-slate-950">
                Item identifier <span className="text-red-600">*</span>
              </Label>
              <Input
                id="itemIdentifier"
                type="text"
                placeholder="Short label to identify this item"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-1"
              />
            </div>
          ) : null}

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
              {(['PersonalBelongings', 'Cards', 'Electronics', 'Others'] as ItemCategory[]).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="subcategory" className="text-sm font-semibold text-slate-950">
              Subcategory <span className="text-red-600">*</span>
            </Label>
            <select
              id="subcategory"
              value={subcategoryCode}
              onChange={(e) => setSubcategoryCode(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-950 font-medium text-sm"
              disabled={!subcategories || subcategories.length === 0}
            >
              {(subcategories ?? []).map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
            {!subcategories || subcategories.length === 0 ? (
              <div className="mt-1 text-xs text-slate-600">No subcategories available for this category.</div>
            ) : null}
          </div>

          {category === 'Cards' ? (
            <>
              <div className="md:col-span-2">
                <Label htmlFor="holderName" className="text-sm font-semibold text-slate-950">
                  Holder name
                </Label>
                <Input
                  id="holderName"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-semibold text-slate-950">
                  Card number
                </Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="issuingAuthority" className="text-sm font-semibold text-slate-950">
                  Issuing authority
                </Label>
                <Input
                  id="issuingAuthority"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dob" className="text-sm font-semibold text-slate-950">
                  Date of birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="issueDate" className="text-sm font-semibold text-slate-950">
                  Issue date
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate" className="text-sm font-semibold text-slate-950">
                  Expiry date
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          ) : null}

          {category === 'Others' ? (
            <div className="md:col-span-2">
              <Label htmlFor="primaryColor" className="text-sm font-semibold text-slate-950">
                Primary color
              </Label>
              <Input
                id="primaryColor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Moss green"
                className="mt-1"
              />
            </div>
          ) : null}

          {category === 'PersonalBelongings' ? (
            <>
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
                <Input id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="material" className="text-sm font-semibold text-slate-950">
                  Material
                </Label>
                <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="size" className="text-sm font-semibold text-slate-950">
                  Size
                </Label>
                <Input id="size" value={size} onChange={(e) => setSize(e.target.value)} className="mt-1" />
              </div>
            </>
          ) : null}

          {category === 'Electronics' ? (
            <>
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
              <div className="md:col-span-2">
                <Label htmlFor="model" className="text-sm font-semibold text-slate-950">
                  Model
                </Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="condition" className="text-sm font-semibold text-slate-950">
                  Screen condition
                </Label>
                <Input id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2 flex items-center gap-3 pt-1">
                <input
                  id="hasCase"
                  type="checkbox"
                  checked={hasCase}
                  onChange={(e) => setHasCase(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <Label htmlFor="hasCase" className="text-sm font-semibold text-slate-950 cursor-pointer">
                  Has case / accessories
                </Label>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="caseDescription" className="text-sm font-semibold text-slate-950">
                  Case description
                </Label>
                <Input
                  id="caseDescription"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Case, strap, charger in photo…"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="lockScreenDescription" className="text-sm font-semibold text-slate-950">
                  Lock screen description
                </Label>
                <Input
                  id="lockScreenDescription"
                  value={lockScreenDescription}
                  onChange={(e) => setLockScreenDescription(e.target.value)}
                  placeholder="If visible on screen"
                  className="mt-1"
                />
              </div>
            </>
          ) : null}

          {category === 'PersonalBelongings' || category === 'Electronics' ? (
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
          ) : null}

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-950">
              Additional details <span className="text-red-600">*</span>
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

