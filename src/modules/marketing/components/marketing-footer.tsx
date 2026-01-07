import { Link } from '@tanstack/react-router';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

export function MarketingFooter() {
  return (
    <footer className="bg-[#E5F4FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-5">
        {/* Main Footer Content - Logo + 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-5">
          
          {/* Left Section: Logo & Description */}
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="">
                <img src={logo} alt="Backtrack Logo" className="w-20 h-20" />
              </div>
              <span className="text-2xl font-bold ">Backtrack Enterprise</span>
            </div>
            <p className=" leading-relaxed max-w-md">
              The intelligent digital ecosystem for enterprise Lost & Found operations. 
              Reducing overhead and reuniting people with what matters.
            </p>
          </div>

          {/* Right Section: 3 Columns of Links */}
          <div className="grid grid-cols-3 gap-8">
            
            {/* PRODUCT Column */}
            <div>
              <h3 className=" font-semibold text-sm uppercase tracking-wide mb-4">
                PRODUCT
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    AI Matching
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Inventory Mgmt
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Public Portal
                  </a>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY Column */}
            <div>
              <h3 className=" font-semibold text-sm uppercase tracking-wide mb-4">
                COMPANY
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/about" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/use-cases" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <a 
                    href="#" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* LEGAL Column */}
            <div>
              <h3 className=" font-semibold text-sm uppercase tracking-wide mb-4">
                LEGAL
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className=" hover:text-blue-600 transition-colors text-sm"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Full Width Border */}
      <div className="border-t border-blue-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">
            {/* Copyright - Center */}
            <p className=" text-xs text-center">
              © 2023 Backtrack Inc. All rights reserved.
            </p>
            
            {/* Social Media Icons - Right on desktop, below on mobile */}
            <div className="flex items-center gap-3 md:absolute md:right-0">
              <a
                href="#"
                className=" hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-3 h-3" />
              </a>
              <a
                href="#"
                className=" hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3 h-3" />
              </a>
              <a
                href="#"
                className=" hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
              </a>
              <a
                href="#"
                className=" hover:text-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
