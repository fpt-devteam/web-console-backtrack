import { SignInOrSignUp } from '@/modules/auth/components/signin-or-signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signin-or-signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInOrSignUp />
}
