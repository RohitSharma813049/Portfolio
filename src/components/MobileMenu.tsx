"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";

interface MobileMenuProps {
  isLoggedIn: boolean;
  dashboardLink: string;
}

export default function MobileMenu({ isLoggedIn, dashboardLink }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-none text-[#16276B] hover:bg-[#f4f4f4] transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-white border-b border-[#EAEAEA] shadow-lg flex flex-col p-4 z-50 animate-fade-in-up">
          <Link onClick={() => setIsOpen(false)} href="/" className="px-4 py-3 text-[#0B1B3D] font-medium border-b border-[#f4f4f4] hover:text-[#D8C494]">Home</Link>
          <Link onClick={() => setIsOpen(false)} href="/categories" className="px-4 py-3 text-[#0B1B3D] font-medium border-b border-[#f4f4f4] hover:text-[#D8C494]">Categories</Link>
          <Link onClick={() => setIsOpen(false)} href="/projects" className="px-4 py-3 text-[#0B1B3D] font-medium border-b border-[#f4f4f4] hover:text-[#D8C494]">All Projects</Link>
          <Link onClick={() => setIsOpen(false)} href="/about" className="px-4 py-3 text-[#0B1B3D] font-medium border-b border-[#f4f4f4] hover:text-[#D8C494]">About</Link>
          <Link onClick={() => setIsOpen(false)} href="/connect" className="px-4 py-3 text-[#0B1B3D] font-medium border-b border-[#f4f4f4] hover:text-[#D8C494]">Connect</Link>          
          <div className="pt-4 flex flex-col gap-3">
            {!isLoggedIn ? (
              <>
                <Link onClick={() => setIsOpen(false)} href="/login" className="flex items-center justify-center gap-2 text-[#16276B] bg-[#f4f4f4] px-4 py-3 rounded-xl font-medium">
                  <User className="w-4 h-4" /> Sign In
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/signup" className="flex items-center justify-center bg-[#16276B] text-white px-4 py-3 rounded-xl font-medium">
                  Sign Up
                </Link>
              </>
            ) : (
              <Link onClick={() => setIsOpen(false)} href={dashboardLink} className="flex items-center justify-center bg-[#16276B] text-white px-4 py-3 rounded-xl font-medium">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
