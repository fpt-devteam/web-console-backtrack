import { Camera, ImageOff } from 'lucide-react'

export function InventoryImageGallery({
  images,
  imgAlt,
  mainImageIndex,
  onMainImageIndexChange,
  showAddThumbnailButton = false,
}: {
  images: string[]
  imgAlt: string
  mainImageIndex: number
  onMainImageIndexChange: (idx: number) => void
  showAddThumbnailButton?: boolean
}) {
  const mainImg = images[mainImageIndex] ?? images[0]

  return (
    <div className="flex gap-3">
      <div className="relative flex h-[min(280px,52vw)] max-h-[380px] min-h-[200px] flex-1 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-[min(320px,45vh)] lg:h-[360px] lg:max-h-none">
        {mainImg ? (
          <img src={mainImg} alt={imgAlt} className="w-full h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <ImageOff className="w-12 h-12" strokeWidth={1} />
            <span className="text-xs font-medium">No image</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-col gap-2 overflow-y-auto pl-1 sm:gap-2.5 lg:max-h-[360px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onMainImageIndexChange(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 ${
                mainImageIndex === idx
                  ? 'border-rose-500 ring-2 ring-rose-100'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain bg-white" loading="lazy" decoding="async" />
            </button>
          ))}
          {showAddThumbnailButton && (
            <button
              type="button"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors sm:h-20 sm:w-20"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
