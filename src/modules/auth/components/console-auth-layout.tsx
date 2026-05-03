import logo from '@/assets/backtrack-logo.svg';
import { useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { ConsoleAuthHero } from '@/modules/auth/components/console-auth-hero';

export function ConsoleAuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen">
      <button
        type="button"
        onClick={() => router.navigate({ to: '/features' })}
        aria-label="Back"
        className="absolute top-5 left-5 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-sm transition-colors duration-150 hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <ArrowLeft className="h-4 w-4 text-[#555]" />
      </button>

      <ConsoleAuthHero />

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}

export function ConsoleAuthMobileLogo() {
  return (
    <div className="-mt-1 mb-8 flex justify-center lg:hidden">
      <img src={logo} alt="Backtrack" className="h-6 w-auto" draggable={false} />
    </div>
  );
}
