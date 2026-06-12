/**
 * storage/exerciseMedia.ts
 *
 * Firebase Storage adapter for exercise media uploads.
 * Paths: exercises/images/{id}, exercises/videos/{id}
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export type UploadProgressCallback = (progress: number) => void

function imageRef(exerciseId: string) {
  return ref(storage, `exercises/images/${exerciseId}`)
}

function videoRef(exerciseId: string) {
  return ref(storage, `exercises/videos/${exerciseId}`)
}

async function uploadFile(
  storageRef: ReturnType<typeof ref>,
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(progress)
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      },
    )
  })
}

export async function uploadExerciseImage(
  exerciseId: string,
  file: File,
): Promise<string> {
  return uploadFile(imageRef(exerciseId), file)
}

export async function uploadExerciseVideo(
  exerciseId: string,
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<string> {
  return uploadFile(videoRef(exerciseId), file, onProgress)
}
