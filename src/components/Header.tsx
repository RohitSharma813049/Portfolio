import Link from "next/link";
import { BookOpen, User, Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_token");
  const isClient = cookieStore.has("client_token");
  const isLoggedIn = isAdmin || isClient;
  const dashboardLink = isAdmin ? "/admin/projects" : "/dashboard";
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EAEAEA] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#1E3A8A] text-white p-2 rounded-none transition-transform group-hover:scale-105">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-[#1E3A8A] tracking-tight hidden sm:block">
                Global Scholar Publications
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-[#4169E1] hover:text-[#1E3A8A] px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-[#4169E1] hover:text-[#1E3A8A] px-3 py-2 text-sm font-medium transition-colors">
              Categories
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/login" 
                  className="hidden sm:flex items-center gap-2 text-[#1E3A8A] hover:bg-[#f4f4f4] px-4 py-2 rounded-none text-sm font-medium transition-colors border border-transparent hover:border-[#EAEAEA]"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-[#1E3A8A] text-white hover:bg-[#152960] px-4 py-2 rounded-none text-sm font-medium transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link 
                href={dashboardLink}
                className="bg-[#1E3A8A] text-white hover:bg-[#152960] px-4 py-2 rounded-none text-sm font-medium transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-none text-[#1E3A8A] hover:bg-[#f4f4f4] transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
