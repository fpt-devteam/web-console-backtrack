import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types/api-response.type'

export function getApiErrorMessage(err: unknown, fallback = 'Request failed. Please try again.'): string {
  if (!err || typeof err !== 'object') return fallback

  // Axios error with structured ApiResponse error payload
  const ax = err as AxiosError<ApiResponse<unknown>>
  const data = ax.response?.data
  if (data && typeof data === 'object') {
    const msg = data.error?.message?.trim()
    const code = data.error?.code?.trim()
    if (msg && code) return `${msg} (${code})`
    if (msg) return msg
  }

  // Default Error.message
  if ('message' in err && typeof (err as any).message === 'string') {
    const m = (err as any).message.trim()
    if (m) return m
  }
  return fallback
}

