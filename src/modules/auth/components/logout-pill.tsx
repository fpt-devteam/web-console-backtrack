import { LogOut } from 'lucide-react'
import { appSignOut } from '@/modules/auth/lib/app-signout'

export function LogoutPill({ isOpen = true }: { isOpen?: boolean }) {
  return (
    <button
      type="button"
      title="Logout"
      onClick={() => void appSignOut()}
      className={`group inline-flex items-center gap-2 rounded-full border border-[#dddddd] bg-white hover:border-[#b0b0b0] transition-all ${
        isOpen ? 'px-3 py-1.5 min-w-[150px] justify-center' : 'p-2'
      } cursor-pointer active:scale-[0.92]`}
    >
      <LogOut className="w-3.5 h-3.5 text-[#929292] group-hover:text-[#222222] transition-colors" />
      <span
        className={`text-[13px] font-medium text-[#929292] group-hover:text-[#222222] transition-all whitespace-nowrap overflow-hidden ${
          isOpen ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Logout
      </span>
    </button>
  )
}
