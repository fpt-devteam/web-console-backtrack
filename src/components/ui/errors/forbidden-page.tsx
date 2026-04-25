import { Home, ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';

const MESSAGES: Record<string, string> = {
  FORBIDDEN_ORG_ADMIN: 'You need OrgAdmin privileges to access this page.',
  FORBIDDEN_ORG_STAFF: 'You need OrgStaff membership to access this page.',
  FORBIDDEN_ORG_NOT_MEMBER: 'You are not a member of this organization.',
  FORBIDDEN_SUPER_ADMIN: 'Super-admin access is required.',
};

export function Forbidden({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? (MESSAGES[error.message] ?? 'You do not have permission to access this page.')
      : 'You do not have permission to access this page.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
      <div className="w-full max-w-md bg-white rounded-[14px] border border-[#dddddd] p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <ShieldAlert className="h-16 w-16 text-[#c13515]" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#222222]">
              403 - Forbidden
            </h1>
            <p className="mt-2 text-base text-[#6a6a6a]">
              {message}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-[#6a6a6a]">
            Contact an administrator if you believe this is an error.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-[#ff385c] text-white text-sm font-medium hover:bg-[#e8324f] active:scale-[0.92] transition-all"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
