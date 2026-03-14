import { Loader2, Check, XCircle } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { getInvitationCode, clearInvitationCode, getTempEmail } from '@/lib/auth-storage'
import { invitationService } from '@/services/invitation.service'

type PageState =
  | { status: 'joining' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export function JoinInvitationPage() {
  const router = useRouter()
  const { setCurrentOrgId } = useCurrentOrgId()
  const [state, setState] = useState<PageState>({ status: 'joining' })

  const autoJoin = useCallback(async () => {
    const code = getInvitationCode()
    const email = getTempEmail()

    if (!code || !email) {
      clearInvitationCode()
      setState({ status: 'error', message: 'No invitation found. The link may be invalid or expired.' })
      return
    }

    try {
      const checkResult = await invitationService.check({ token: code, email })

      if (!checkResult.isTokenValid) {
        clearInvitationCode()
        setState({ status: 'error', message: 'This invitation is no longer valid. It may have expired or already been used.' })
        return
      }

      const joinResult = await invitationService.join({ token: code })
      clearInvitationCode()
      setState({ status: 'success' })

      setCurrentOrgId(joinResult.organizationId)
      setTimeout(() => {
        const destination = joinResult.role === 'OrgAdmin'
          ? '/console/admin/dashboard'
          : '/console/staff/inventory'
        window.location.href = destination
      }, 1500)
    } catch (err) {
      clearInvitationCode()
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to join organization.',
      })
    }
  }, [setCurrentOrgId])

  useEffect(() => {
    autoJoin()
  }, [autoJoin])

  const handleGoToWelcome = () => {
    clearInvitationCode()
    router.navigate({ to: '/console/welcome' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-lg p-12">
          {state.status === 'joining' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <h1 className="text-2xl font-bold text-center">Joining Organization...</h1>
              <p className="text-sm text-gray-600 text-center">
                Please wait while we set up your membership.
              </p>
            </div>
          )}

          {state.status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-center">Welcome aboard!</h1>
              <p className="text-sm text-gray-600 text-center">
                You've successfully joined the organization. Redirecting...
              </p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-center">Unable to Join</h1>
              <p className="text-sm text-gray-600 text-center">{state.message}</p>
              <Button
                onClick={handleGoToWelcome}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 text-base font-medium mt-4"
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
