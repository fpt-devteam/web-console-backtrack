import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { InventorySubcategory, ItemCategory } from '@/services/inventory.service'
import { ChevronRight } from 'lucide-react'
import { InventoryPhotosPicker } from '@/modules/console/components/inventory/inventory-photos-picker'

function toDateTimeLocalFromIso(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const pad = (n: number) => String(n).padStart(2, '0')
    const yyyy = d.getFullYear()
    const mm = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    const hh = pad(d.getHours())
    const min = pad(d.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
  } catch {
    return ''
  }
}

function categoryLabel(c: ItemCategory): string {
  switch (c) {
    case 'PersonalBelongings':
      return 'Personal belongings'
    case 'Cards':
      return 'Cards'
    case 'Electronics':
      return 'Electronics'
    case 'Others':
      return 'Others'
  }
}

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
  maxEventTimeIso?: string
  postTitle: string
  setPostTitle: (v: string) => void
  detailItemName: string
  setDetailItemName: (v: string) => void
  itemName: string
  setItemName: (v: string) => void
  category: ItemCategory
  setCategory: (v: ItemCategory) => void
  subcategories: InventorySubcategory[]
  subcategoryCode: string
  setSubcategoryCode: (v: string) => void
  organizationStorageLocation: string
  setOrganizationStorageLocation: (v: string) => void
  organizationFoundLocation: string
  setOrganizationFoundLocation: (v: string) => void
  eventTime: string
  setEventTime: (v: string) => void
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
  maxEventTimeIso,
  postTitle,
  setPostTitle,
  detailItemName,
  setDetailItemName,
  itemName,
  setItemName,
  category,
  setCategory: _setCategory,
  subcategories,
  subcategoryCode,
  setSubcategoryCode: _setSubcategoryCode,
  organizationStorageLocation,
  setOrganizationStorageLocation,
  organizationFoundLocation,
  setOrganizationFoundLocation,
  eventTime,
  setEventTime,
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
  const subcategoryLabel =
    (subcategories ?? []).find((s) => s.code === subcategoryCode)?.name ?? subcategoryCode
  const maxLocal = maxEventTimeIso ? toDateTimeLocalFromIso(maxEventTimeIso) : undefined

  return (
    <div className="space-y-6 mt-3">
      {/* Item fields */}
      <div className="space-y-6">
        <div className="text-base font-semibold text-[#222222]">Item information</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="postTitle" className="text-sm font-semibold text-[#222222]">
              Post title <span className="text-[#c13515]">*</span>
            </Label>
            <Input
              id="postTitle"
              type="text"
              placeholder="Short title to identify this post"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-semibold text-[#222222]">
              Category <span className="text-[#c13515]">*</span>
            </Label>
            <Input
              id="category"
              value={categoryLabel(category)}
              readOnly
              className="mt-1 bg-[#f7f7f7]"
            />
          </div>

          <div>
            <Label htmlFor="subcategory" className="text-sm font-semibold text-[#222222]">
              Subcategory <span className="text-[#c13515]">*</span>
            </Label>
            <Input
              id="subcategory"
              value={subcategoryLabel}
              readOnly
              className="mt-1 bg-[#f7f7f7]"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="organizationStorageLocation" className="text-sm font-semibold text-[#222222]">
              Storage location <span className="text-[#c13515]">*</span>
            </Label>
            <Input
              id="organizationStorageLocation"
              value={organizationStorageLocation}
              onChange={(e) => setOrganizationStorageLocation(e.target.value)}
              placeholder="Lost & Found counter, Shelf A-12, Locker 3"
              className="mt-1"
            />
            <div className="mt-1 text-xs text-[#929292]">Where the item is stored inside your organization.</div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="organizationFoundLocation" className="text-sm font-semibold text-[#222222]">
              Found location <span className="text-[#c13515]">*</span>
            </Label>
            <Input
              id="organizationFoundLocation"
              value={organizationFoundLocation}
              onChange={(e) => setOrganizationFoundLocation(e.target.value)}
              placeholder="Terminal 2 Gate B, Ground floor restroom, Parking P1"
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="eventTime" className="text-sm font-semibold text-[#222222]">
              Found time <span className="text-[#c13515]">*</span>
            </Label>
            <Input
              id="eventTime"
              type="datetime-local"
              value={eventTime ? toDateTimeLocalFromIso(eventTime) : ''}
              max={maxLocal}
              onChange={(e) => {
                const v = e.target.value
                if (!v) {
                  setEventTime('')
                  return
                }
                // `datetime-local` is local time without timezone; convert to ISO
                const picked = new Date(v).toISOString()
                if (maxEventTimeIso) {
                  const maxT = new Date(maxEventTimeIso).getTime()
                  const pickedT = new Date(picked).getTime()
                  if (!Number.isNaN(maxT) && !Number.isNaN(pickedT) && pickedT > maxT) {
                    setEventTime(maxEventTimeIso)
                    return
                  }
                }
                setEventTime(picked)
              }}
              className="mt-1"
            />
          </div>

          {/* Photos Section (moved below basic info) */}
          <div className="md:col-span-2">
            <InventoryPhotosPicker
              photoPreviews={photoPreviews}
              maxPhotos={maxPhotos}
              onPickPhotos={onPickPhotos}
              onRemovePhoto={onRemovePhoto}
              onReorderPhotos={onReorderPhotos}
              isAnalyzing={isAnalyzing}
              onAnalyze={onAnalyze}
              analyzeDisabled={analyzeDisabled}
              analyzeHint={analyzeHint}
            />
          </div>

          {category !== 'Others' ? (
            <div className="md:col-span-2">
              <Label htmlFor="detailItemName" className="text-sm font-semibold text-[#222222]">
                Item name
              </Label>
              <Input
                id="detailItemName"
                type="text"
                placeholder="Apple Watch, Student ID card, Backpack"
                value={detailItemName}
                onChange={(e) => setDetailItemName(e.target.value)}
                className="mt-1"
              />
            </div>
          ) : null}

          {category === 'Others' ? (
            <div className="md:col-span-2">
              <Label htmlFor="itemIdentifier" className="text-sm font-semibold text-[#222222]">
                Item identifier <span className="text-[#c13515]">*</span>
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

          {category === 'Cards' ? (
            <>
              <div className="md:col-span-2">
                <Label htmlFor="holderName" className="text-sm font-semibold text-[#222222]">
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
                <Label htmlFor="cardNumber" className="text-sm font-semibold text-[#222222]">
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
                <Label htmlFor="issuingAuthority" className="text-sm font-semibold text-[#222222]">
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
                <Label htmlFor="dob" className="text-sm font-semibold text-[#222222]">
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
                <Label htmlFor="issueDate" className="text-sm font-semibold text-[#222222]">
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
                <Label htmlFor="expiryDate" className="text-sm font-semibold text-[#222222]">
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
              <Label htmlFor="primaryColor" className="text-sm font-semibold text-[#222222]">
                Primary color
              </Label>
              <Input
                id="primaryColor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Moss green"
                className="mt-1"
              />
            </div>
          ) : null}

          {category === 'PersonalBelongings' ? (
            <>
              <div>
                <Label htmlFor="brand" className="text-sm font-semibold text-[#222222]">
                  Brand
                </Label>
                <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="color" className="text-sm font-semibold text-[#222222]">
                  Color
                </Label>
                <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="condition" className="text-sm font-semibold text-[#222222]">
                  Condition
                </Label>
                <Input id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="material" className="text-sm font-semibold text-[#222222]">
                  Material
                </Label>
                <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="size" className="text-sm font-semibold text-[#222222]">
                  Size
                </Label>
                <Input id="size" value={size} onChange={(e) => setSize(e.target.value)} className="mt-1" />
              </div>
            </>
          ) : null}

          {category === 'Electronics' ? (
            <>
              <div>
                <Label htmlFor="brand" className="text-sm font-semibold text-[#222222]">
                  Brand
                </Label>
                <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="color" className="text-sm font-semibold text-[#222222]">
                  Color
                </Label>
                <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="model" className="text-sm font-semibold text-[#222222]">
                  Model
                </Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="condition" className="text-sm font-semibold text-[#222222]">
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
                  className="h-4 w-4 rounded border-[#dddddd]"
                />
                <Label htmlFor="hasCase" className="text-sm font-semibold text-[#222222] cursor-pointer">
                  Has case / accessories
                </Label>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="caseDescription" className="text-sm font-semibold text-[#222222]">
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
                <Label htmlFor="lockScreenDescription" className="text-sm font-semibold text-[#222222]">
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
              <Label htmlFor="distinctiveMarks" className="text-sm font-semibold text-[#222222]">
                Distinctive marks
              </Label>
              <Input
                id="distinctiveMarks"
                placeholder="serial number, scratches, stickers"
                value={distinctiveMarks}
                onChange={(e) => setDistinctiveMarks(e.target.value)}
                className="mt-1"
              />
            </div>
          ) : null}

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-semibold text-[#222222]">
              Additional details
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
          className="mb-2 h-8 w-8 rounded-full bg-[#222222] text-white hover:bg-[#444444]"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5 mx-auto" />
        </Button>
      </div>
    </div>
  )
}

