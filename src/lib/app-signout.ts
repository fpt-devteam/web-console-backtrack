import { authService } from '@/services'
import { destroyChatSocket } from '@/lib/chat-socket'
import { setActiveOrgId } from '@/lib/api-client'

const SESSION_ORG_ID_KEY = 'backtrack_current_org_id'

export async function appSignOut(options?: { redirectTo?: string }) {
  try {
    destroyChatSocket()
    try {
      sessionStorage.removeItem(SESSION_ORG_ID_KEY)
    } catch {
      /* ignore */
    }
    setActiveOrgId(null)
    await authService.signOut()
  } finally {
    window.location.href = options?.redirectTo ?? '/auth/signin-or-signup'
  }
}

