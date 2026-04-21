import { Camera, Loader2, Sparkles, X } from 'lucide-react'

function cx(...classes: Array<string | null | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export type InventoryPhotosPickerPreview = { url: string }

export function InventoryPhotosPicker({
  photoPreviews,
  maxPhotos,
  onPickPhotos,
  onRemovePhoto,
  onReorderPhotos,
  isAnalyzing,
  onAnalyze,
  analyzeDisabled,
  analyzeHint,
}: {
  photoPreviews: InventoryPhotosPickerPreview[]
  maxPhotos: number
  onPickPhotos: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemovePhoto: (index: number) => void
  onReorderPhotos: (fromIndex: number, toIndex: number) => void
  isAnalyzing: boolean
  onAnalyze: () => void
  analyzeDisabled?: boolean
  analyzeHint?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold text-gray-900">Photos</div>
        <span className="text-sm text-slate-700">Max {maxPhotos} photos</span>
      </div>

      <div className="flex gap-4 flex-wrap">
        {photoPreviews.map((p, index) => (
          <div
            key={`${p.url}:${index}`}
            className="relative w-32 h-32 rounded-lg overflow-hidden group border border-slate-200"
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
            <img
              src={p.url}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-contain bg-slate-50"
            />
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

        {photoPreviews.length < maxPhotos ? (
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
        ) : null}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={Boolean(analyzeDisabled) || isAnalyzing}
          title={analyzeHint}
          className={cx(
            'flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-black transition-all font-medium text-sm hover:bg-gray-50 hover:scale-[1.03] hover:drop-shadow-sm',
            'disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 disabled:hover:shadow-none',
          )}
        >
          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Sparkles className="h-4 w-4 shrink-0" />}
          Analyze
        </button>
      </div>
    </div>
  )
}

