import { SignInOrSignUp } from '@/pages/auth/signin-or-signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signin-or-signup')({
  component: RouteComponent,
  
})

function RouteComponent() {
  return <SignInOrSignUp />
}
