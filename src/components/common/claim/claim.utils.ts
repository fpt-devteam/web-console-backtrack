export function formatClaimId(id: string): string {
  return `#CLM-${id.slice(0, 8).toUpperCase()}`
}
