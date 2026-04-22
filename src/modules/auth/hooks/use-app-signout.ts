import { useCallback } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useSignOut } from '@/hooks/use-auth'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { destroyChatSocket } from '@/lib/chat-socket'

export function useAppSignOut(options?: { redirectTo?: string }) {
  const router = useRouter()
  const { setCurrentOrgId } = useCurrentOrgId()
  const signOut = useSignOut()

  const appSignOut = useCallback(async () => {
    try {
      destroyChatSocket()
      setCurrentOrgId(null)
      await signOut.mutateAsync()
    } finally {
      router.navigate({ to: options?.redirectTo ?? '/auth/signin-or-signup' })
    }
  }, [options?.redirectTo, router, setCurrentOrgId, signOut])

  return { signOut: appSignOut, isPending: signOut.isPending }
}

