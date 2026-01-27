import { Sidebar } from './sidebar';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebarOpen?: boolean;
}

/**
 * Super Admin Layout Component
 * 
 * Provides layout structure for super admin pages with sidebar navigation.
 * 
 * @param children - Page content to render
 * @param sidebarOpen - Whether sidebar is expanded (optional, defaults to true)
 */
export function Layout({ children, sidebarOpen: initialSidebarOpen = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main 
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

