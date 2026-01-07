import { MarketingHeader } from './marketing-header';
import { MarketingFooter } from './marketing-footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      
      {/* Main content with padding for fixed header */}
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      <MarketingFooter />
    </div>
  );
}

