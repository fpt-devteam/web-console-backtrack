import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';

export function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Backtrack Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold ">
              Backtrack Enterprise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/features"
              className=" hover: font-medium transition-colors"
            >
              Platform
            </Link>
            <Link
              to="/features"
              className=" hover: font-medium transition-colors"
            >
              AI Engine
            </Link>
            <Link
              to="/use-cases"
              className=" hover: font-medium transition-colors"
            >
              Venues
            </Link>
            <Link
              to="/pricing"
              className=" hover: font-medium transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/auth/signin-or-signup"
              className=" font-semibold hover: transition-colors"
            >
              Log In
            </Link>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/apply">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 " />
            ) : (
              <Menu className="w-6 h-6 " />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/features"
              className="block px-4 py-2  hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Platform
            </Link>
            <Link
              to="/features"
              className="block px-4 py-2  hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Engine
            </Link>
            <Link
              to="/use-cases"
              className="block px-4 py-2  hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Venues
            </Link>
            <Link
              to="/pricing"
              className="block px-4 py-2  hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <Link
                to="/auth/signin-or-signup"
                className="block px-4 py-2  hover:bg-gray-50 rounded-lg font-semibold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

