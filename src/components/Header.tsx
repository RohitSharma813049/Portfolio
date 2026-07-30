import Link from "next/link";
import Image from "next/image";
import { BookOpen, User } from "lucide-react";
import NotificationBell from "./NotificationBell";
import MobileMenu from "./MobileMenu";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_token");
  const isClient = cookieStore.has("client_token");
  const isLoggedIn = isAdmin || isClient;
  const dashboardLink = isAdmin ? "/admin/projects" : "/dashboard";
  return (
    <>
      {/* Top Ticker */}
      <div className="hidden md:flex bg-white border-b border-[#EAEAEA] text-xs py-1.5 px-4 items-center gap-6 overflow-hidden whitespace-nowrap">
        <div className="bg-[#0B1B3D] text-white px-3 py-1 font-bold text-[10px] uppercase tracking-wider">LATEST</div>
        <div className="flex gap-8 text-[#666]">
          <span><strong className="text-[#0B1B3D] font-semibold">Sustainable Finance</strong> — Dr. Priya Nair-Kapoor</span>
          <span className="text-[#EAEAEA]">|</span>
          <span><strong className="text-[#0B1B3D] font-semibold">Featured:</strong> GCC Economic Diversification — Prof. Khalid Al-Mansouri</span>
          <span className="text-[#EAEAEA]">|</span>
          <span><strong className="text-[#0B1B3D] font-semibold">Open Access:</strong> Decolonising Knowledge Systems — Dr. Ngozi Adeyemi</span>
        </div>
      </div>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EAEAEA] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/images/IMG_1301 (2).PNG" 
                alt="Global Scholar Publications Logo" 
                width={280} 
                height={80} 
                className="object-contain max-h-20 w-auto" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-[#16276B] hover:text-[#0B1B3D] px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-[#16276B] hover:text-[#0B1B3D] px-3 py-2 text-sm font-medium transition-colors">
              Categories
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && <NotificationBell />}
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/login" 
                  className="hidden sm:flex items-center gap-2 text-[#16276B] hover:bg-[#f4f4f4] px-4 py-2 rounded-none text-sm font-medium transition-colors border border-transparent hover:border-[#EAEAEA]"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-[#16276B] text-white hover:bg-[#152960] px-4 py-2 rounded-none text-sm font-medium transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link 
                href={dashboardLink}
                className="bg-[#16276B] text-white hover:bg-[#152960] px-4 py-2 rounded-none text-sm font-medium transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            )}
            
            {/* Mobile menu button */}
            <MobileMenu isLoggedIn={isLoggedIn} dashboardLink={dashboardLink} />
          </div>

        </div>
      </div>
    </header>

    {/* Secondary Sub-Navigation Marquee */}
    <div className="w-full bg-white border-b border-[#EAEAEA] overflow-hidden">
      <div className="flex w-max animate-marquee text-[10px] font-bold tracking-widest text-[#0B1B3D] py-3">
        {/* We repeat the items twice to create a seamless loop effect */}
        {[1, 2].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-3">
            <div className="w-2 h-2 rotate-45 bg-[#C59D5F] flex-shrink-0"></div>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">BRAND</span>
            <span className="text-[#C59D5F] font-light">|</span>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">POSITIONING</span>
            <span className="text-[#C59D5F] font-light">|</span>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">QUALITY</span>
            <span className="text-[#C59D5F] font-light">|</span>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">STRATEGY</span>
            <span className="text-[#C59D5F] font-light">|</span>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">VALUE</span>
            <span className="text-[#C59D5F] font-light">|</span>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">FOUNDERS</span>
            <span className="text-[#C59D5F] font-light">|</span>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">STARTUPS</span>
            <span className="text-[#C59D5F] font-light">|</span>
            <span className="hover:text-[#C59D5F] cursor-pointer whitespace-nowrap transition-colors">BUSINESS</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
