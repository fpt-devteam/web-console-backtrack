import type { ReactNode } from 'react'

interface ClaimDetailLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  main: ReactNode
  messaging: ReactNode
}

export function ClaimDetailLayout({ header, sidebar, main, messaging }: ClaimDetailLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
      {header}
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 shrink-0 border-r border-hairline flex flex-col overflow-hidden">
          {sidebar}
        </aside>
        <main className="flex-1 overflow-y-aut flex flex-col">
          {main}
        </main>
        <aside className="w-100 shrink-0 border-l border-hairline flex flex-col overflow-hidden">
          {messaging}
        </aside>
      </div>
    </div>
  )
}
