import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown, fallback = 'An unknown error occurred'): string {
  return (
    (error as any)?.response?.data?.error?.message ||
    (error as any)?.error?.message ||
    (error as any)?.message ||
    fallback
  )
}
