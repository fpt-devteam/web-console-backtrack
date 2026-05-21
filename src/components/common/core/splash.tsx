import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SplashProps {
  onComplete?: () => void
  duration?: number
  className?: string
}

export function Splash({ onComplete, duration = 2500, className }: SplashProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, duration - 500)

    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500',
        isFadingOut && 'opacity-0',
        className
      )}
    >
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center">
            <div className="animate-bounce-slow">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#fff0f2] border border-[#dddddd]">
                <svg
                  className="h-16 w-16 text-[#ff385c]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-[#222222]">
            Backtrack Console
          </h1>

          <p className="animate-fade-in-delay text-lg text-[#6a6a6a]">
            Enterprise Management Platform
          </p>
        </div>

        <div className="relative z-10">
          <div className="h-8 w-8 rounded-full border-4 border-[#ebebeb] border-t-[#ff385c] animate-spin" />
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in-delay { animation: fade-in 0.8s ease-out 0.3s forwards; opacity: 0; }
      `}</style>
    </div>
  )
}

export function SplashScreen({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-white',
        className
      )}
    >
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#fff0f2] border border-[#dddddd]">
            <svg
              className="h-16 w-16 text-[#ff385c]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#222222]">
            Backtrack Console
          </h1>
        </div>

        <div className="relative z-10">
          <div className="h-8 w-8 rounded-full border-4 border-[#ebebeb] border-t-[#ff385c] animate-spin" />
        </div>
      </div>
    </div>
  )
}
