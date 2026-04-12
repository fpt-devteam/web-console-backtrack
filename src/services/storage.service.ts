import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

/**
 * Upload a single image File to Firebase Storage.
 *
 * Files are stored at:  inventories/<orgId>/<timestamp>-<filename>
 *
 * Returns the public download URL (https://firebasestorage.googleapis.com/…).
 */
export async function uploadOrgLogo(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `organizations/logos/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const storageRef = ref(storage, path)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    })

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
        }
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        } catch (err) {
          reject(err)
        }
      },
    )
  })
}

/**
 * Upload a single image File to Firebase Storage.
 *
 * Files are stored at:  inventories/<orgId>/<timestamp>-<filename>
 *
 * Returns the public download URL (https://firebasestorage.googleapis.com/…).
 */
export async function uploadInventoryImage(
  orgId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `inventories/${orgId}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const storageRef = ref(storage, path)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    })

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
        }
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        } catch (err) {
          reject(err)
        }
      },
    )
  })
}

/**
 * Upload multiple images in parallel and return all URLs.
 */
export async function uploadInventoryImages(
  orgId: string,
  files: File[],
  onProgress?: (index: number, pct: number) => void,
): Promise<string[]> {
  return Promise.all(
    files.map((file, i) =>
      uploadInventoryImage(orgId, file, (pct) => onProgress?.(i, pct)),
    ),
  )
}
