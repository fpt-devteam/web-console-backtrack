/**
 * OpenStreetMap Nominatim API – tìm địa điểm, trả về lat/lon + display_name cho BE.
 * Usage policy: https://operations.osmfoundation.org/policies/nominatim/
 * Cần User-Agent; không gọi quá 1 request/giây khi dùng miễn phí.
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const USER_AGENT = 'BacktrackWebConsole/1.0 (contact@example.com)'

export interface NominatimPlace {
  lat: number
  lon: number
  display_name: string
  place_id: number
}

export interface NominatimSearchResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
}

export const nominatimService = {
  /**
   * Tìm địa điểm theo chuỗi (địa chỉ, tên POI, ...).
   * Trả về lat (number), lon (number), display_name để gửi BE.
   */
  async search(query: string, limit = 5): Promise<NominatimPlace[]> {
    const trimmed = query?.trim()
    if (!trimmed) return []

    const params = new URLSearchParams({
      q: trimmed,
      format: 'json',
      limit: String(Math.min(limit, 10)),
    })
    const url = `${NOMINATIM_BASE}/search?${params.toString()}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en,vn',
        'User-Agent': USER_AGENT,
      },
    })
    if (!res.ok) throw new Error(`Nominatim search failed: ${res.status}`)
    const data = (await res.json()) as NominatimSearchResult[]
    return (data || []).map((item) => ({
      place_id: item.place_id,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name || '',
    }))
  },
}
