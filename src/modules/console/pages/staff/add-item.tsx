import { StaffLayout } from '../../components/staff/layout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Check } from 'lucide-react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { inventoryService } from '@/services/inventory.service'
import type { ItemCategory } from '@/services/inventory.service'
import { uploadInventoryImage } from '@/services/storage.service'
import { useCreateInventoryItem } from '@/hooks/use-inventory'
import { useUser } from '@/hooks/use-user'
import { useOrganization } from '@/hooks/use-org'
import type { FinderContactField } from '@/types/organization.types'
import { collectInventoryImageUrls, revokeObjectUrls } from '@/utils/inventory-photos'
import { Step1PhotosAndItem, type PhotoPreview } from './add-item/step1-photos-item'
import { Step2Finder, type FinderInfo } from './add-item/step2-finder'
import { Step3Preview, type StaffInfo } from './add-item/step3-preview'
import { useSubcategories } from '@/hooks/use-subcategories'
import { Step0PickSubcategory } from './add-item/step0-pick-subcategory'

type StepId = 0 | 1 | 2 | 3

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type AddInventoryDraft = {
  v: 3
  step: StepId
  item: {
    postTitle: string
    detailItemName: string
    itemName: string
    description: string
    distinctiveMarks: string
    category: ItemCategory
    subcategoryCode: string
    color: string
    brand: string
    condition: string
    material: string
    size: string
    holderName: string
    cardNumber: string
    issuingAuthority: string
    model: string
    hasCase: boolean
    caseDescription: string
    lockScreenDescription: string
    dateOfBirth: string
    issueDate: string
    expiryDate: string
  }
  finder: FinderInfo
}

function Stepper({
  current,
  onGo,
}: {
  current: StepId
  onGo?: (step: StepId) => void
}) {
  const steps: Array<{ id: StepId; title: string }> = [
    { id: 0, title: 'Choose type' },
    { id: 1, title: 'Upload & item details' },
    { id: 2, title: 'Finder information' },
    { id: 3, title: 'Preview' },
  ]

  return (
    <div className="w-full px-2">
      <div className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto">
        {steps.map((s, idx) => {
          const isDone = s.id < current
          const isActive = s.id === current
          // UI-first: allow jumping between steps freely.
          const clickable = Boolean(onGo)
          return (
            <div key={s.id} className="flex items-center gap-4 sm:gap-6 min-w-[180px] sm:min-w-0">
              <button
                type="button"
                onClick={() => onGo?.(s.id)}
                className={cx(
                  'flex items-center gap-3 text-left select-none',
                  clickable ? 'cursor-pointer' : 'cursor-default',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                <span
                  className={cx(
                    'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold',
                    isActive
                      ? 'bg-slate-950 border-slate-950 text-white'
                      : isDone
                        ? 'bg-slate-950 border-slate-950 text-white'
                        : 'bg-white border-slate-300 text-slate-950',
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : s.id}
                </span>
                <span className="leading-tight">
                  <span
                    className={cx(
                      'block text-sm',
                      isDone ? 'font-semibold text-slate-950' : 'font-medium text-slate-700',
                      isActive ? 'text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-950' : '',
                    )}
                  >
                    {s.title}
                  </span>
                </span>
              </button>

              {idx < steps.length - 1 ? (
                <div className="hidden md:block w-10 lg:w-16 2xl:w-20">
                  <div
                    className={cx(
                      'h-[1px] w-full border-t-2 border-dashed',
                      s.id < current ? 'border-slate-950' : 'border-slate-300',
                    )}
                  />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AddFoundItemPage() {
  const navigate = useNavigate()
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const createItem = useCreateInventoryItem(currentOrgId)
  const { data: me } = useUser()
  const { data: org } = useOrganization(currentOrgId)

  const [step, setStep] = useState<StepId>(0)

  const MAX_PHOTOS = 5
  // objectURL previews + File for upload
  const [photoPreviews, setPhotoPreviews] = useState<PhotoPreview[]>([])

  const [postTitle, setPostTitle] = useState<string>('')
  const [detailItemName, setDetailItemName] = useState<string>('')
  const [itemName, setItemName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [distinctiveMarks, setDistinctiveMarks] = useState<string>('')
  const [category, setCategory] = useState<ItemCategory>('PersonalBelongings')
  const { data: allSubcategories } = useSubcategories()
  const { data: subcategories } = useSubcategories(category)
  const [subcategoryCode, setSubcategoryCode] = useState<string>('') // required by BE
  const [color, setColor] = useState<string>('')
  const [brand, setBrand] = useState<string>('')
  const [condition, setCondition] = useState<string>('')
  const [material, setMaterial] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [holderName, setHolderName] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [issuingAuthority, setIssuingAuthority] = useState<string>('')
  const [model, setModel] = useState<string>('')
  const [hasCase, setHasCase] = useState(false)
  const [caseDescription, setCaseDescription] = useState<string>('')
  const [lockScreenDescription, setLockScreenDescription] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [issueDate, setIssueDate] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisWarnings, setAnalysisWarnings] = useState<string[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittingAction, setSubmittingAction] = useState<'save' | 'addAnother' | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const photoPreviewsRef = useRef<PhotoPreview[]>([])
  const uploadedUrlByFileKeyRef = useRef<Map<string, string>>(new Map())
  const draftHydratedRef = useRef(false)
  const draftSaveTimerRef = useRef<number | null>(null)

  const draftKey = useMemo(() => {
    // Keyed per org so staff can switch orgs safely.
    return currentOrgId ? `inventoryAddDraft:v1:${currentOrgId}` : null
  }, [currentOrgId])

  const [finder, setFinder] = useState<FinderInfo>({
    fullName: '',
    email: '',
    nationalId: '',
    orgMemberId: '',
    phone: '',
  })

  const [staff, setStaff] = useState<StaffInfo>({
    fullName: '',
    email: '',
    staffId: '',
  })

  // Hydrate draft on first load (text fields only; photos can't survive reload).
  useEffect(() => {
    if (!draftKey) return
    if (draftHydratedRef.current) return
    try {
      const raw = window.localStorage.getItem(draftKey)
      if (!raw) {
        draftHydratedRef.current = true
        return
      }
      const parsed = JSON.parse(raw) as AddInventoryDraft & { v?: number }
      if (!parsed || (parsed.v !== 3 && parsed.v !== 2)) {
        draftHydratedRef.current = true
        return
      }

      setStep(parsed.step ?? 1)
      setPostTitle(parsed.item?.postTitle ?? '')
      setDetailItemName(parsed.item?.detailItemName ?? '')
      setItemName(parsed.item?.itemName ?? '')
      setDescription(parsed.item?.description ?? '')
      setDistinctiveMarks(parsed.item?.distinctiveMarks ?? '')
      setCategory(parsed.item?.category ?? 'PersonalBelongings')
      setSubcategoryCode(parsed.item?.subcategoryCode ?? '')
      setColor(parsed.item?.color ?? '')
      setBrand(parsed.item?.brand ?? '')
      setCondition(parsed.item?.condition ?? '')
      setMaterial(parsed.item?.material ?? '')
      setSize(parsed.item?.size ?? '')
      setHolderName(parsed.item?.holderName ?? '')
      setCardNumber(parsed.item?.cardNumber ?? '')
      setIssuingAuthority(parsed.item?.issuingAuthority ?? '')
      setModel(parsed.item?.model ?? '')
      setHasCase(Boolean(parsed.item?.hasCase))
      setCaseDescription(parsed.item?.caseDescription ?? '')
      setLockScreenDescription(parsed.item?.lockScreenDescription ?? '')
      setDateOfBirth(parsed.item?.dateOfBirth ?? '')
      setIssueDate(parsed.item?.issueDate ?? '')
      setExpiryDate(parsed.item?.expiryDate ?? '')
      setFinder(parsed.finder ?? { fullName: '', email: '', nationalId: '', orgMemberId: '', phone: '' })
    } catch {
      // ignore draft parse errors
    } finally {
      draftHydratedRef.current = true
    }
  }, [draftKey])

  // Persist draft changes (debounced).
  useEffect(() => {
    if (!draftKey) return
    if (!draftHydratedRef.current) return

    if (draftSaveTimerRef.current) {
      window.clearTimeout(draftSaveTimerRef.current)
      draftSaveTimerRef.current = null
    }

    draftSaveTimerRef.current = window.setTimeout(() => {
      const draft: AddInventoryDraft = {
        v: 3,
        step,
        item: {
          postTitle,
          detailItemName,
          itemName,
          description,
          distinctiveMarks,
          category,
          subcategoryCode,
          color,
          brand,
          condition,
          material,
          size,
          holderName,
          cardNumber,
          issuingAuthority,
          model,
          hasCase,
          caseDescription,
          lockScreenDescription,
          dateOfBirth,
          issueDate,
          expiryDate,
        },
        finder,
      }
      try {
        window.localStorage.setItem(draftKey, JSON.stringify(draft))
      } catch {
        // ignore quota / storage errors
      }
    }, 250)

    return () => {
      if (draftSaveTimerRef.current) {
        window.clearTimeout(draftSaveTimerRef.current)
        draftSaveTimerRef.current = null
      }
    }
  }, [
    draftKey,
    step,
    postTitle,
    detailItemName,
    itemName,
    description,
    distinctiveMarks,
    category,
    subcategoryCode,
    color,
    brand,
    condition,
    material,
    size,
    holderName,
    cardNumber,
    issuingAuthority,
    model,
    hasCase,
    caseDescription,
    lockScreenDescription,
    dateOfBirth,
    issueDate,
    expiryDate,
    finder,
  ])

  // Ensure we always have a valid subcategoryCode for the selected category.
  useEffect(() => {
    if (!subcategories || subcategories.length === 0) return
    if (subcategoryCode && subcategories.some((s) => s.code === subcategoryCode)) return
    setSubcategoryCode(subcategories[0]!.code)
  }, [subcategories, subcategoryCode])

  useEffect(() => {
    if (!me) return
    setStaff((prev) => ({
      ...prev,
      fullName: me.name?.trim() || prev.fullName,
      email: me.email?.trim() || prev.email,
      staffId: me.id || prev.staffId,
    }))
  }, [me])

  const applyAnalysisResult = (result: Awaited<ReturnType<typeof inventoryService.analyzeImage>>) => {
    if (result.warnings?.length) setAnalysisWarnings(result.warnings)
    else setAnalysisWarnings(null)

    // BE analysis result is detail-specific based on selected subcategory.
    if (result.personalBelonging) {
      if (result.personalBelonging.itemName) setDetailItemName(result.personalBelonging.itemName)
      if (result.personalBelonging.color) setColor(result.personalBelonging.color)
      if (result.personalBelonging.brand) setBrand(result.personalBelonging.brand)
      if (result.personalBelonging.condition) setCondition(result.personalBelonging.condition)
      if (result.personalBelonging.material) setMaterial(result.personalBelonging.material)
      if (result.personalBelonging.size) setSize(result.personalBelonging.size)
      if (result.personalBelonging.distinctiveMarks) setDistinctiveMarks(result.personalBelonging.distinctiveMarks)
      if (result.personalBelonging.additionalDetails) setDescription(result.personalBelonging.additionalDetails)
    }
    if (result.electronic) {
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
    if (result.other) {
      if (result.other.itemName) setItemName(result.other.itemName)
      if (result.other.primaryColor) setColor(result.other.primaryColor)
      if (result.other.additionalDetails) setDescription(result.other.additionalDetails)
    }
    if (result.card) {
      if (result.card.itemName) setDetailItemName(result.card.itemName)
      if (result.card.holderName) setHolderName(result.card.holderName)
      if (result.card.cardNumber) setCardNumber(result.card.cardNumber)
      if (result.card.issuingAuthority) setIssuingAuthority(result.card.issuingAuthority)
      if (result.card.additionalDetails) setDescription(result.card.additionalDetails)
    }
  }

  const analyzeSelectedPhotos = async () => {
    if (!currentOrgId) return
    if (!subcategoryCode.trim()) return
    if (photoPreviews.length === 0) return

    setIsAnalyzing(true)
    setSubmitError(null)

    try {
      const urls = await collectInventoryImageUrls({
        previews: photoPreviews.map((p) => ({ file: p.file, url: p.url, isExisting: false })),
        cacheByFileKey: uploadedUrlByFileKeyRef.current,
        upload: (file) => uploadInventoryImage(currentOrgId, file),
      })

      const result = await inventoryService.analyzeImage(urls, subcategoryCode.trim())
      applyAnalysisResult(result)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Image analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = MAX_PHOTOS - photoPreviews.length
    if (remainingSlots <= 0) return

    const filesArray = Array.from(files).slice(0, remainingSlots)
    const next = filesArray.map((file) => ({ file, url: URL.createObjectURL(file) }))
    setPhotoPreviews((prev) => [...prev, ...next])

    e.target.value = ''
  }

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setPhotoPreviews((prev) => {
      if (fromIndex < 0 || toIndex < 0) return prev
      if (fromIndex >= prev.length || toIndex >= prev.length) return prev
      const next = prev.slice()
      const [moved] = next.splice(fromIndex, 1)
      if (!moved) return prev
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const removePhoto = (index: number) => {
    setPhotoPreviews((prev) => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const buildPayload = (imageUrls: string[]) => ({
    postTitle: postTitle.trim(),
    detailItemName: detailItemName.trim() || undefined,
    itemName: itemName.trim(),
    description: description.trim(),
    distinctiveMarks: distinctiveMarks.trim() || undefined,
    category,
    subcategoryCode: subcategoryCode,
    color: color.trim() || undefined,
    brand: brand.trim() || undefined,
    condition: condition.trim() || undefined,
    material: material.trim() || undefined,
    size: size.trim() || undefined,
    holderName: holderName.trim() || undefined,
    cardNumber: cardNumber.trim() || undefined,
    issuingAuthority: issuingAuthority.trim() || undefined,
    dateOfBirth: dateOfBirth.trim() || undefined,
    issueDate: issueDate.trim() || undefined,
    expiryDate: expiryDate.trim() || undefined,
    model: model.trim() || undefined,
    hasCase,
    caseDescription: caseDescription.trim() || undefined,
    lockScreenDescription: lockScreenDescription.trim() || undefined,
    imageUrls,
    finderInfo: {
      finderName: finder.fullName.trim() || undefined,
      email: finder.email.trim() || undefined,
      phone: finder.phone.trim() || undefined,
      nationalId: finder.nationalId.trim() || undefined,
      orgMemberId: finder.orgMemberId.trim() || undefined,
    },
  })

  const validateStep1 = (): string | null => {
    if (!postTitle.trim()) return 'Post title is required.'
    if (category === 'Others' && !itemName.trim()) return 'Item identifier is required.'
    if (photoPreviews.length === 0) return 'At least one photo is required.'
    if (!subcategoryCode.trim()) return 'Subcategory is required.'
    return null
  }

  const validateStep2 = (): string | null => {
    if (!finder.fullName.trim()) return 'Finder full name is required.'

    const required = (org?.requiredFinderContractFields ?? []).filter(Boolean) as FinderContactField[]

    // Fallback to old rule when org policy isn't configured/loaded.
    if (required.length === 0) {
      const hasAny =
        Boolean(finder.email.trim()) ||
        Boolean(finder.nationalId.trim()) ||
        Boolean(finder.orgMemberId.trim()) ||
        Boolean(finder.phone.trim())
      if (!hasAny) return 'Provide at least one finder detail: email, phone, national ID, or student/staff ID.'
      return null
    }

    const missing: string[] = []
    for (const f of required) {
      if (f === 'Email' && !finder.email.trim()) missing.push('email')
      if (f === 'Phone' && !finder.phone.trim()) missing.push('phone')
      if (f === 'NationalId' && !finder.nationalId.trim()) missing.push('national ID')
      if (f === 'OrgMemberId' && !finder.orgMemberId.trim()) missing.push('student/staff ID')
    }
    if (missing.length > 0) return `Missing required finder fields: ${missing.join(', ')}.`
    return null
  }

  const resetItemForm = () => {
    setPostTitle('')
    setDetailItemName('')
    setItemName('')
    setDescription('')
    setDistinctiveMarks('')
    setPhotoPreviews((prev) => {
      revokeObjectUrls(prev.map((p) => ({ file: p.file, url: p.url, isExisting: false })))
      return []
    })
    setCategory('PersonalBelongings')
    setColor('')
    setBrand('')
    setCondition('')
    setMaterial('')
    setSize('')
    setHolderName('')
    setCardNumber('')
    setIssuingAuthority('')
    setModel('')
    setHasCase(false)
    setCaseDescription('')
    setLockScreenDescription('')
    setDateOfBirth('')
    setIssueDate('')
    setExpiryDate('')
    setAnalysisWarnings(null)
    uploadedUrlByFileKeyRef.current.clear()
  }

  const handleSave = async (addAnother: boolean) => {
    if (!currentOrgId) {
      setSubmitError('No active organization. Please reload the page.')
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)
    setSubmittingAction(addAnother ? 'addAnother' : 'save')

    try {
      // Upload photos to Firebase Storage and collect their public URLs.
      // Reuse any URLs already uploaded during auto-analyze to avoid double uploads.
      const imageUrls = await collectInventoryImageUrls({
        previews: photoPreviews.map((p) => ({ file: p.file, url: p.url, isExisting: false })),
        cacheByFileKey: uploadedUrlByFileKeyRef.current,
        upload: (file) => uploadInventoryImage(currentOrgId, file),
      })

      await new Promise<void>((resolve, reject) => {
        createItem.mutate(buildPayload(imageUrls), {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        })
      })

      if (addAnother) {
        resetItemForm()
        setFinder({ fullName: '', email: '', nationalId: '', orgMemberId: '', phone: '' })
        setStaff({ fullName: '', email: '', staffId: '' })
        setStep(1)
      } else {
        if (draftKey) {
          try {
            window.localStorage.removeItem(draftKey)
          } catch {
            // ignore
          }
        }
        uploadedUrlByFileKeyRef.current.clear()
        navigate({ to: `/console/${slug}/staff/inventory` })
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save item. Please try again.')
    } finally {
      setIsSubmitting(false)
      setSubmittingAction(null)
    }
  }

  const nextFromStep1 = () => {
    const err = validateStep1()
    if (err) {
      setSubmitError(err)
      return
    }
    setSubmitError(null)
    setStep(2)
  }

  const nextFromStep2 = () => {
    const err = validateStep2()
    if (err) {
      setSubmitError(err)
      return
    }
    setSubmitError(null)
    setStep(3)
  }

  const goToStep = (target: StepId) => {
    if (target === step) return

    // Backward navigation is always allowed
    if (target < step) {
      setSubmitError(null)
      setStep(target)
      return
    }

    // Forward navigation must satisfy the same validations as the arrow buttons.
    if (step === 0) {
      if (!subcategoryCode.trim()) {
        setSubmitError('Please choose a subcategory to continue.')
        return
      }
      setSubmitError(null)
      setStep(target)
      return
    }

    if (step === 1) {
      const err1 = validateStep1()
      if (err1) {
        setSubmitError(err1)
        return
      }
      if (target === 2) {
        setSubmitError(null)
        setStep(2)
        return
      }
      // jumping 1 -> 3 requires step2 validation too
      const err2 = validateStep2()
      if (err2) {
        setSubmitError(err2)
        setStep(2) // bring user to the step that needs fixing
        return
      }
      setSubmitError(null)
      setStep(3)
      return
    }

    if (step === 2) {
      const err2 = validateStep2()
      if (err2) {
        setSubmitError(err2)
        return
      }
      setSubmitError(null)
      setStep(3)
    }
  }

  // Keep latest previews for unmount cleanup without revoking active URLs on every change.
  useEffect(() => {
    photoPreviewsRef.current = photoPreviews
  }, [photoPreviews])

  // Revoke any remaining objectURLs when leaving the page.
  useEffect(() => {
    return () => {
      revokeObjectUrls(photoPreviewsRef.current.map((p) => ({ file: p.file, url: p.url, isExisting: false })))
    }
  }, [])


  return (
    <StaffLayout>
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link
              to="/console/$slug/staff/inventory"
              params={{ slug }}
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

        {/* Stepper (outside data card) */}
        <div className="max-w-5xl mx-auto mb-6">
          <Stepper current={step} onGo={(s) => goToStep(s)} />
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg px-8 py-4">

          {submitError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {step !== 3 && analysisWarnings && analysisWarnings.length > 0 ? (
            <div className="mb-4 p-3 rounded-md bg-amber-50 text-amber-800 text-sm">
              <div className="font-semibold mb-1">AI warnings</div>
              <ul className="list-disc pl-5 space-y-1">
                {analysisWarnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Step content */}
          {step === 0 ? (
            <Step0PickSubcategory
              subcategories={allSubcategories ?? []}
              onPick={({ category: pickedCategory, subcategory }) => {
                setCategory(pickedCategory)
                setSubcategoryCode(subcategory.code)
                setPostTitle('')
                setDetailItemName('')
                // Keep name empty until staff types it, or AI fills a specific identifier (e.g. Others.itemIdentifier).
                setItemName('')
                setSubmitError(null)
                setStep(1)
              }}
            />
          ) : null}

          {step === 1 ? (
            <Step1PhotosAndItem
              photoPreviews={photoPreviews}
              maxPhotos={MAX_PHOTOS}
              onPickPhotos={handlePhotoUpload}
              onRemovePhoto={removePhoto}
              onReorderPhotos={reorderPhotos}
              isAnalyzing={isAnalyzing}
              onAnalyze={() => void analyzeSelectedPhotos()}
              analyzeDisabled={!subcategoryCode.trim() || photoPreviews.length === 0}
              analyzeHint={
                !subcategoryCode.trim()
                  ? 'Choose a subcategory first'
                  : photoPreviews.length === 0
                    ? 'Add at least one photo to analyze'
                    : 'Analyze all selected photos'
              }
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              detailItemName={detailItemName}
              setDetailItemName={setDetailItemName}
              itemName={itemName}
              setItemName={setItemName}
              category={category}
              setCategory={setCategory}
              subcategories={subcategories ?? []}
              subcategoryCode={subcategoryCode}
              setSubcategoryCode={setSubcategoryCode}
              holderName={holderName}
              setHolderName={setHolderName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              issuingAuthority={issuingAuthority}
              setIssuingAuthority={setIssuingAuthority}
              brand={brand}
              setBrand={setBrand}
              color={color}
              setColor={setColor}
              condition={condition}
              setCondition={setCondition}
              material={material}
              setMaterial={setMaterial}
              size={size}
              setSize={setSize}
              distinctiveMarks={distinctiveMarks}
              setDistinctiveMarks={setDistinctiveMarks}
              description={description}
              setDescription={setDescription}
              model={model}
              setModel={setModel}
              hasCase={hasCase}
              setHasCase={setHasCase}
              caseDescription={caseDescription}
              setCaseDescription={setCaseDescription}
              lockScreenDescription={lockScreenDescription}
              setLockScreenDescription={setLockScreenDescription}
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
              issueDate={issueDate}
              setIssueDate={setIssueDate}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              onNext={nextFromStep1}
            />
          ) : null}

          {step === 2 ? (
            <Step2Finder
              finder={finder}
              setFinder={setFinder}
              requiredFields={org?.requiredFinderContractFields ?? null}
              onBack={() => setStep(1)}
              onNext={nextFromStep2}
            />
          ) : null}

          {step === 3 ? (
            <Step3Preview
              photoPreviews={photoPreviews}
              item={{
                postTitle,
                detailItemName,
                itemName,
                description,
                distinctiveMarks,
                category,
                color,
                brand,
                condition,
                material,
                size,
                holderName,
                cardNumber,
                issuingAuthority,
                model,
                hasCase,
                caseDescription,
                lockScreenDescription,
                dateOfBirth,
                issueDate,
                expiryDate,
              }}
              finder={finder}
              staff={staff}
              isSubmitting={isSubmitting}
              submittingAction={submittingAction}
              onBack={() => setStep(2)}
              onSaveAndAddAnother={() => void handleSave(true)}
              onSubmit={() => void handleSave(false)}
            />
          ) : null}
        </div>
      </div>
    </StaffLayout>
  )
}

