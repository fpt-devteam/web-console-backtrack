import { StaffLayout } from '@/modules/console/components/staff/layout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Loader2 } from 'lucide-react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useInventoryItem, useUpdateInventoryItem } from '@/hooks/use-inventory'
import { useSubcategories } from '@/hooks/use-subcategories'
import { uploadInventoryImage } from '@/services/storage.service'
import { inventoryService, type ItemCategory, type PostStatus } from '@/services/inventory.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { collectInventoryImageUrls, reorderList, revokeObjectUrls, type InventoryPhotoPreview } from '@/utils/inventory-photos'
import { InventoryPhotosPicker } from '@/modules/console/components/inventory/inventory-photos-picker'

function toIsoFromDateTimeLocal(v: string): string | null {
  const t = v?.trim()
  if (!t) return null
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export function EditItemPage() {
  const navigate = useNavigate()
  const { slug, itemId } = useParams({ strict: false }) as { slug: string; itemId: string }
  const { currentOrgId } = useCurrentOrgId()

  const { data: item, isLoading } = useInventoryItem(currentOrgId, itemId)
  const updateItem = useUpdateInventoryItem(currentOrgId)

  const MAX_PHOTOS = 5
  const [photoPreviews, setPhotoPreviews] = useState<InventoryPhotoPreview[]>([])
  const photoPreviewsRef = useRef<InventoryPhotoPreview[]>([])
  const uploadedUrlByFileKeyRef = useRef<Map<string, string>>(new Map())

  const [status, setStatus] = useState<PostStatus>('Active')
  const [eventTimeLocal, setEventTimeLocal] = useState<string>('') // datetime-local
  const [displayAddress, setDisplayAddress] = useState<string>('')

  const [detailItemName, setDetailItemName] = useState<string>('') // required for non-Others
  const [description, setDescription] = useState<string>('')
  const [distinctiveMarks, setDistinctiveMarks] = useState<string>('')

  const [brand, setBrand] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [condition, setCondition] = useState<string>('')
  const [material, setMaterial] = useState<string>('')
  const [size, setSize] = useState<string>('')

  const [model, setModel] = useState<string>('')
  const [hasCase, setHasCase] = useState(false)
  const [caseDescription, setCaseDescription] = useState<string>('')
  const [lockScreenDescription, setLockScreenDescription] = useState<string>('')

  const [holderName, setHolderName] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('') // masked allowed
  const [issuingAuthority, setIssuingAuthority] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [issueDate, setIssueDate] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')

  const [otherIdentifier, setOtherIdentifier] = useState<string>('') // required for Others
  const [otherPrimaryColor, setOtherPrimaryColor] = useState<string>('')

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisWarnings, setAnalysisWarnings] = useState<string[] | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const initRef = useRef(false)

  useEffect(() => {
    photoPreviewsRef.current = photoPreviews
  }, [photoPreviews])

  useEffect(() => {
    return () => {
      revokeObjectUrls(photoPreviewsRef.current)
    }
  }, [])

  const category: ItemCategory | null = item?.category ?? null
  const { data: allSubcategories } = useSubcategories()

  const subcategory = useMemo(() => {
    if (!item?.subcategoryId) return null
    return (allSubcategories ?? []).find((s) => s.id === item.subcategoryId) ?? null
  }, [allSubcategories, item?.subcategoryId])

  useEffect(() => {
    if (!item || initRef.current) return
    initRef.current = true

    setStatus(item.status)
    setDisplayAddress(item.displayAddress ?? '')
    setPhotoPreviews((item.imageUrls ?? []).map((url) => ({ url, isExisting: true })))
    if (item.eventTime) setEventTimeLocal(item.eventTime.slice(0, 16))

    if (item.personalBelongingDetail) {
      setDetailItemName(item.personalBelongingDetail.itemName ?? item.postTitle ?? '')
      setDescription(item.personalBelongingDetail.additionalDetails ?? '')
      setDistinctiveMarks(item.personalBelongingDetail.distinctiveMarks ?? '')
      setBrand(item.personalBelongingDetail.brand ?? '')
      setColor(item.personalBelongingDetail.color ?? '')
      setCondition(item.personalBelongingDetail.condition ?? '')
      setMaterial(item.personalBelongingDetail.material ?? '')
      setSize(item.personalBelongingDetail.size ?? '')
      return
    }

    if (item.electronicDetail) {
      setDetailItemName(item.electronicDetail.itemName ?? item.postTitle ?? '')
      setDescription(item.electronicDetail.additionalDetails ?? '')
      setDistinctiveMarks(item.electronicDetail.distinguishingFeatures ?? '')
      setBrand(item.electronicDetail.brand ?? '')
      setColor(item.electronicDetail.color ?? '')
      setCondition(item.electronicDetail.screenCondition ?? '')
      setModel(item.electronicDetail.model ?? '')
      setHasCase(Boolean(item.electronicDetail.hasCase))
      setCaseDescription(item.electronicDetail.caseDescription ?? '')
      setLockScreenDescription(item.electronicDetail.lockScreenDescription ?? '')
      return
    }

    if (item.cardDetail) {
      setDetailItemName(item.cardDetail.itemName ?? item.postTitle ?? '')
      setDescription(item.cardDetail.additionalDetails ?? '')
      setHolderName(item.cardDetail.holderName ?? '')
      setCardNumber(item.cardDetail.cardNumberMasked ?? '')
      setIssuingAuthority(item.cardDetail.issuingAuthority ?? '')
      setDateOfBirth(item.cardDetail.dateOfBirth ?? '')
      setIssueDate(item.cardDetail.issueDate ?? '')
      setExpiryDate(item.cardDetail.expiryDate ?? '')
      return
    }

    if (item.otherDetail) {
      setOtherIdentifier(item.otherDetail.itemName ?? '')
      setOtherPrimaryColor(item.otherDetail.primaryColor ?? '')
      setDescription(item.otherDetail.additionalDetails ?? '')
      return
    }

    setDetailItemName(item.postTitle ?? '')
  }, [item])


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = MAX_PHOTOS - photoPreviews.length
    if (remainingSlots <= 0) return

    const next = Array.from(files)
      .slice(0, remainingSlots)
      .map((file) => ({ file, url: URL.createObjectURL(file), isExisting: false }))
    setPhotoPreviews((prev) => [...prev, ...next])
    e.target.value = ''
  }

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    setPhotoPreviews((prev) => reorderList(prev, fromIndex, toIndex))
  }

  const removePhoto = (index: number) => {
    setPhotoPreviews((prev) => {
      const target = prev[index]
      if (target && !target.isExisting) URL.revokeObjectURL(target.url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const analyzeFromPhotos = async () => {
    if (!currentOrgId || !item) return
    if (!photoPreviews.length) return

    const subCode = subcategory?.code
    if (!subCode?.trim()) return

    setIsAnalyzing(true)
    setSubmitError(null)
    try {
      const urls2 = await collectInventoryImageUrls({
        previews: photoPreviews,
        cacheByFileKey: uploadedUrlByFileKeyRef.current,
        upload: (file) => uploadInventoryImage(currentOrgId, file),
      })

      const result = await inventoryService.analyzeImage(urls2, subCode.trim())
      if (result.warnings?.length) setAnalysisWarnings(result.warnings)
      else setAnalysisWarnings(null)

      if (item.category === 'PersonalBelongings' && result.personalBelonging) {
        if (result.personalBelonging.itemName) setDetailItemName(result.personalBelonging.itemName)
        if (result.personalBelonging.color) setColor(result.personalBelonging.color)
        if (result.personalBelonging.brand) setBrand(result.personalBelonging.brand)
        if (result.personalBelonging.condition) setCondition(result.personalBelonging.condition)
        if (result.personalBelonging.material) setMaterial(result.personalBelonging.material)
        if (result.personalBelonging.size) setSize(result.personalBelonging.size)
        if (result.personalBelonging.distinctiveMarks) setDistinctiveMarks(result.personalBelonging.distinctiveMarks)
        if (result.personalBelonging.additionalDetails) setDescription(result.personalBelonging.additionalDetails)
      }

      if (item.category === 'Electronics' && result.electronic) {
        if (result.electronic.itemName) setDetailItemName(result.electronic.itemName)
        if (result.electronic.brand) setBrand(result.electronic.brand)
        if (result.electronic.color) setColor(result.electronic.color)
        if (result.electronic.model) setModel(result.electronic.model)
        if (result.electronic.hasCase != null) setHasCase(Boolean(result.electronic.hasCase))
        if (result.electronic.caseDescription) setCaseDescription(result.electronic.caseDescription)
        if (result.electronic.screenCondition) setCondition(result.electronic.screenCondition)
        if (result.electronic.lockScreenDescription) setLockScreenDescription(result.electronic.lockScreenDescription)
        if (result.electronic.distinguishingFeatures) setDistinctiveMarks(result.electronic.distinguishingFeatures)
        if (result.electronic.additionalDetails) setDescription(result.electronic.additionalDetails)
      }

      if (item.category === 'Cards' && result.card) {
        if (result.card.itemName) setDetailItemName(result.card.itemName)
        if (result.card.holderName) setHolderName(result.card.holderName)
        if (result.card.cardNumber) setCardNumber(result.card.cardNumber)
        if (result.card.issuingAuthority) setIssuingAuthority(result.card.issuingAuthority)
        if (result.card.additionalDetails) setDescription(result.card.additionalDetails)
      }

      if (item.category === 'Others' && result.other) {
        if (result.other.itemName) setOtherIdentifier(result.other.itemName)
        if (result.other.primaryColor) setOtherPrimaryColor(result.other.primaryColor)
        if (result.other.additionalDetails) setDescription(result.other.additionalDetails)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Image analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const validate = (): string | null => {
    if (!item) return 'Item not loaded.'
    if (item.category === 'Others') {
      if (!otherIdentifier.trim()) return 'Item identifier is required.'
    } else {
      if (!detailItemName.trim()) return 'Item name is required.'
    }
    return null
  }

  const handleSave = async () => {
    if (!currentOrgId || !item) return

    const err = validate()
    if (err) {
      setSubmitError(err)
      return
    }

    setSubmitError(null)

    try {
      const imageUrls = await collectInventoryImageUrls({
        previews: photoPreviews,
        cacheByFileKey: uploadedUrlByFileKeyRef.current,
        upload: (file) => uploadInventoryImage(currentOrgId, file),
      })

      const eventTimeIso = toIsoFromDateTimeLocal(eventTimeLocal)
      const payloadBase = {
        status,
        imageUrls,
        ...(eventTimeIso ? { eventTime: eventTimeIso } : {}),
      }

      const payload =
        item.category === 'PersonalBelongings'
          ? {
              ...payloadBase,
              personalBelongingDetail: {
                itemName: detailItemName.trim(),
                brand: brand.trim() || null,
                color: color.trim() || null,
                condition: condition.trim() || null,
                material: material.trim() || null,
                size: size.trim() || null,
                distinctiveMarks: distinctiveMarks.trim() || null,
                additionalDetails: description.trim(),
              },
            }
          : item.category === 'Electronics'
            ? {
                ...payloadBase,
                electronicDetail: {
                  itemName: detailItemName.trim(),
                  brand: brand.trim() || null,
                  model: model.trim() || null,
                  color: color.trim() || null,
                  hasCase,
                  caseDescription: caseDescription.trim() || null,
                  lockScreenDescription: lockScreenDescription.trim() || null,
                  screenCondition: condition.trim() || null,
                  distinguishingFeatures: distinctiveMarks.trim() || null,
                  additionalDetails: description.trim(),
                },
              }
            : item.category === 'Cards'
              ? {
                  ...payloadBase,
                  cardDetail: {
                    itemName: detailItemName.trim(),
                    holderName: holderName.trim() || null,
                    issuingAuthority: issuingAuthority.trim() || null,
                    cardNumber: cardNumber.includes('*') ? null : cardNumber.trim() || null,
                    dateOfBirth: dateOfBirth.trim() || null,
                    issueDate: issueDate.trim() || null,
                    expiryDate: expiryDate.trim() || null,
                    additionalDetails: description.trim(),
                  },
                }
              : {
                  ...payloadBase,
                  otherDetail: {
                    itemName: otherIdentifier.trim(),
                    primaryColor: otherPrimaryColor.trim() || null,
                    additionalDetails: description.trim(),
                  },
                }

      await updateItem.mutateAsync({ id: item.id, payload })
      navigate({ to: `/console/${slug}/staff/item/${item.id}` })
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to save item.')
    }
  }

  if (isLoading) {
    return (
      <StaffLayout>
        <div className="p-8 flex justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
        </div>
      </StaffLayout>
    )
  }

  return (
    <StaffLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link to="/console/$slug/staff/inventory" params={{ slug }} className="hover:text-gray-900 transition-colors">
              Inventory
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/console/$slug/staff/item/$itemId" params={{ slug, itemId }} className="hover:text-gray-900 transition-colors">
              {item?.postTitle || 'Item Detail'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Edit Item</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{item?.postTitle ?? '—'}</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            {submitError ? <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{submitError}</div> : null}

            {analysisWarnings && analysisWarnings.length > 0 ? (
              <div className="p-3 rounded-md bg-amber-50 text-amber-800 text-sm">
                <div className="font-semibold mb-1">AI warnings</div>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisWarnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Photos (top) — match Add Item Step 1 UI */}
            <section className="space-y-4">
              <InventoryPhotosPicker
                photoPreviews={photoPreviews}
                maxPhotos={MAX_PHOTOS}
                onPickPhotos={handlePhotoUpload}
                onRemovePhoto={removePhoto}
                onReorderPhotos={reorderPhotos}
                isAnalyzing={isAnalyzing}
                onAnalyze={() => void analyzeFromPhotos()}
                analyzeDisabled={photoPreviews.length === 0 || !item}
              />
            </section>

            {/* Info form (no section titles) */}
            <section className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
                <div>
                  <Label className="text-sm font-semibold">Category</Label>
                  <Input value={item?.category ?? ''} readOnly className="mt-1 bg-slate-50" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Subcategory</Label>
                  <Input value={subcategory?.name || item?.subcategoryId || ''} readOnly className="mt-1 bg-slate-50" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PostStatus)}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                  >
                    {/* Only allow changing status to Archived */}
                    <option value={status}>
                      {status === 'InStorage'
                        ? 'In Storage'
                          : status}
                    </option>
                    {status !== 'Archived' ? <option value="Archived">Archived</option> : null}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Event time</Label>
                  <Input type="datetime-local" value={eventTimeLocal} onChange={(e) => setEventTimeLocal(e.target.value)} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold">Display address</Label>
                  <Input value={displayAddress} readOnly className="mt-1 bg-slate-50" />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              {category !== 'Others' ? (
                <div>
                  <Label className="text-sm font-semibold">
                    Item name <span className="text-red-500">*</span>
                  </Label>
                  <Input value={detailItemName} onChange={(e) => setDetailItemName(e.target.value)} className="mt-1" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">
                      Item identifier <span className="text-red-500">*</span>
                    </Label>
                    <Input value={otherIdentifier} onChange={(e) => setOtherIdentifier(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Primary color</Label>
                    <Input value={otherPrimaryColor} onChange={(e) => setOtherPrimaryColor(e.target.value)} className="mt-1" />
                  </div>
                </div>
              )}

              {category === 'PersonalBelongings' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Brand</Label>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Color</Label>
                    <Input value={color} onChange={(e) => setColor(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Condition</Label>
                    <Input value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Material</Label>
                    <Input value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Size</Label>
                    <Input value={size} onChange={(e) => setSize(e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Distinctive marks</Label>
                    <Input value={distinctiveMarks} onChange={(e) => setDistinctiveMarks(e.target.value)} className="mt-1" />
                  </div>
                </div>
              ) : null}

              {category === 'Electronics' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Brand</Label>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Color</Label>
                    <Input value={color} onChange={(e) => setColor(e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Model</Label>
                    <Input value={model} onChange={(e) => setModel(e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Screen condition</Label>
                    <Input value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3 pt-1">
                    <input
                      id="hasCaseEdit"
                      type="checkbox"
                      checked={hasCase}
                      onChange={(e) => setHasCase(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <Label htmlFor="hasCaseEdit" className="text-sm font-semibold cursor-pointer">
                      Has case / accessories
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Case description</Label>
                    <Input value={caseDescription} onChange={(e) => setCaseDescription(e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Lock screen description</Label>
                    <Input value={lockScreenDescription} onChange={(e) => setLockScreenDescription(e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Distinctive marks</Label>
                    <Input value={distinctiveMarks} onChange={(e) => setDistinctiveMarks(e.target.value)} className="mt-1" />
                  </div>
                </div>
              ) : null}

              {category === 'Cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Holder name</Label>
                    <Input value={holderName} onChange={(e) => setHolderName(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Card number</Label>
                    <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="mt-1" placeholder="Leave unchanged to keep masked value" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Issuing authority</Label>
                    <Input value={issuingAuthority} onChange={(e) => setIssuingAuthority(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Date of birth</Label>
                    <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Issue date</Label>
                    <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Expiry date</Label>
                    <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="mt-1" />
                  </div>
                </div>
              ) : null}

              <div className="mt-2">
                <Label className="text-sm font-semibold">
                  Additional details
                </Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[120px]" />
              </div>
            </section>

            <div className="pt-2 flex justify-end">
              <Button onClick={handleSave} disabled={updateItem.isPending || !item} className="bg-slate-900 text-white hover:bg-slate-800">
                {updateItem.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

