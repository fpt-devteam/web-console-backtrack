export type InventoryPhotoPreview = {
  file?: File
  /** objectURL for new files; remote URL for existing */
  url: string
  isExisting: boolean
}

export function inventoryPhotoFileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}:${file.type}`
}

export function reorderList<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return arr
  if (fromIndex < 0 || toIndex < 0) return arr
  if (fromIndex >= arr.length || toIndex >= arr.length) return arr
  const next = arr.slice()
  const [moved] = next.splice(fromIndex, 1)
  if (moved === undefined) return arr
  next.splice(toIndex, 0, moved)
  return next
}

export function revokeObjectUrls(previews: InventoryPhotoPreview[]) {
  for (const p of previews) {
    if (!p.isExisting) {
      try {
        URL.revokeObjectURL(p.url)
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Collect public image URLs for previews, uploading new files as needed.
 * Reuses a cache by fileKey to avoid double uploads.
 */
export async function collectInventoryImageUrls(params: {
  previews: InventoryPhotoPreview[]
  cacheByFileKey: Map<string, string>
  upload: (file: File) => Promise<string>
}): Promise<string[]> {
  const { previews, cacheByFileKey, upload } = params

  const urls: string[] = []
  for (const p of previews) {
    if (p.isExisting) {
      urls.push(p.url)
      continue
    }

    if (!p.file) continue
    const key = inventoryPhotoFileKey(p.file)
    const cached = cacheByFileKey.get(key)
    if (cached) {
      urls.push(cached)
      continue
    }

    const url = await upload(p.file)
    cacheByFileKey.set(key, url)
    urls.push(url)
  }

  return urls
}

