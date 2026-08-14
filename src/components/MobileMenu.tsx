"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Home, Grid, FolderGit2, Info, Send } from "lucide-react";

interface MobileMenuProps {
  isLoggedIn: boolean;
  dashboardLink: string;
}

export default function MobileMenu({ isLoggedIn, dashboardLink }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close menu when navigating between routes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/categories", label: "Categories", icon: Grid },
    { href: "/projects", label: "All Projects", icon: FolderGit2 },
    { href: "/about", label: "About", icon: Info },
    { href: "/connect", label: "Connect", icon: Send },
  ];

  return (
    <div className="md:hidden flex items-center">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        className="p-2 rounded-lg text-[#16276B] hover:bg-[#f4f4f4] transition-colors focus:outline-none"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[90] animate-fade-in" 
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile menu dropdown drawer */}
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-[#EAEAEA] shadow-2xl z-[100] p-5 flex flex-col space-y-2 animate-fade-in-up">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? "bg-[#D8C494]/15 text-[#111] border border-[#D8C494]"
                      : "text-[#0B1B3D] hover:bg-[#f8f9fa] hover:text-[#D8C494]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#D8C494]" : "text-[#666]"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#EAEAEA] flex flex-col gap-3">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    onClick={() => setIsOpen(false)} 
                    href="/login" 
                    className="flex items-center justify-center gap-2 text-[#16276B] bg-[#f4f4f4] hover:bg-gray-200 px-4 py-3 rounded-xl font-semibold text-sm transition"
                  >
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                  <Link 
                    onClick={() => setIsOpen(false)} 
                    href="/signup" 
                    className="flex items-center justify-center bg-[#16276B] hover:bg-[#152960] text-white px-4 py-3 rounded-xl font-semibold text-sm transition shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <Link 
                  onClick={() => setIsOpen(false)} 
                  href={dashboardLink} 
                  className="flex items-center justify-center bg-[#16276B] hover:bg-[#152960] text-white px-4 py-3 rounded-xl font-semibold text-sm transition shadow-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
