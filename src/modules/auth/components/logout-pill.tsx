import { LogOut } from 'lucide-react'
import { useAppSignOut } from '@/modules/auth/hooks/use-app-signout'

export function LogoutPill({ isOpen }: { isOpen: boolean }) {
  const signOut = useAppSignOut()

  return (
    <button
      type="button"
      title="Logout"
      disabled={signOut.isPending}
      onClick={() => void signOut.signOut()}
      className={`group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all ${
        isOpen ? 'px-3 py-1.5 min-w-[150px] justify-center' : 'p-2'
      } ${signOut.isPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <LogOut className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      <span
        className={`text-[13px] font-medium text-gray-400 group-hover:text-gray-600 transition-all whitespace-nowrap overflow-hidden ${
          isOpen ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Logout
      </span>
    </button>
  )
}

