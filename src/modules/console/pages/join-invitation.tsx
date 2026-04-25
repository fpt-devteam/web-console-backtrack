import { Loader2, Check, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { getInvitationCode, clearInvitationCode } from '@/lib/auth-storage'
import { persistActiveOrgIdForSession } from '@/lib/route-guards'
import { invitationService } from '@/services/invitation.service'
import { orgService } from '@/services/org.service'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

type PageState =
  | { status: 'joining' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export function JoinInvitationPage() {
  const router = useRouter()
  const [state, setState] = useState<PageState>({ status: 'joining' })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      const code = getInvitationCode()

      if (!code) {
        clearInvitationCode()
        setState({ status: 'error', message: 'No invitation found. The link may be invalid or expired.' })
        return
      }

      try {
        const joinResult = await invitationService.join({ token: code })
        clearInvitationCode()
        setState({ status: 'success' })

        // Joining an org often updates auth claims/permissions.
        // Force-refresh the Firebase token before navigating so route guards/API calls see new membership.
        await user.getIdToken(true)

        // Persist org selection early so nested route guards + Axios can scope correctly on first load.
        persistActiveOrgIdForSession(joinResult.organizationId)

        const org = await orgService.getById(joinResult.organizationId)
        setTimeout(() => {
          const destination = joinResult.role === 'OrgAdmin'
            ? `/console/${org.slug}/admin/dashboard`
            : `/console/${org.slug}/staff/inventory`
          window.location.href = destination
        }, 1500)
      } catch (err) {
        clearInvitationCode()
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to join organization.',
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const handleGoToWelcome = () => {
    clearInvitationCode()
    router.navigate({ to: '/console/welcome' })
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-lg p-12">
          {state.status === 'joining' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-[#ff385c] animate-spin" />
              <h1 className="text-2xl font-bold text-center">Joining Organization...</h1>
              <p className="text-sm text-gray-600 text-center">
                Please wait while we set up your membership.
              </p>
            </div>
          )}

          {state.status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#e8f9f0] rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-[#06c167]" />
              </div>
              <h1 className="text-2xl font-bold text-center">Welcome aboard!</h1>
              <p className="text-sm text-gray-600 text-center">
                You've successfully joined the organization. Redirecting...
              </p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#fff0f2] rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-[#c13515]" />
              </div>
              <h1 className="text-2xl font-bold text-center">Unable to Join</h1>
              <p className="text-sm text-gray-600 text-center">{state.message}</p>
              <Button
                onClick={handleGoToWelcome}
                className="w-full bg-[#ff385c] hover:bg-[#e00b41] text-white py-5 text-base font-medium mt-4"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
