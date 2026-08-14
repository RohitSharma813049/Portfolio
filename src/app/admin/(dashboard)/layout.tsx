"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Settings, Tag, Search, Bell, HelpCircle, User, ChevronLeft, Menu, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const totalProjects = 12;
  const draftProjects = 3;

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  // Handle responsive sidebar initial state & resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notifications-dropdown") && !target.closest(".notifications-toggle")) {
        setNotificationsOpen(false);
      }
      if (!target.closest(".profile-dropdown") && !target.closest(".profile-toggle")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex font-inter text-[var(--color-text-primary)] relative overflow-x-hidden">
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen 
            ? 'translate-x-0 w-64' 
            : '-translate-x-full w-0 pointer-events-none md:pointer-events-auto md:w-20 md:translate-x-0'
        } fixed md:sticky top-0 left-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-screen transition-all duration-300 z-40 shadow-xl md:shadow-none overflow-hidden`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--color-border)] shrink-0">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-[var(--radius-button)] bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">P</div>
              <h2 className="font-bold text-base tracking-tight whitespace-nowrap text-[var(--color-text-primary)]">PortfolioCMS</h2>
            </div>
          )}
          {!isSidebarOpen && (
            <div className="w-8 h-8 rounded-[var(--radius-button)] bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg mx-auto shadow-sm shrink-0 hidden md:flex">P</div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {isSidebarOpen && <div className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3 px-2">Main Menu</div>}
          
          <Link href="/admin" onClick={handleNavClick} className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium transition group ${isActive("/admin", true) ? "bg-[#F1F5F9] text-[var(--color-primary)]" : "hover:bg-[#F8FAFC] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}>
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-5 h-5 shrink-0 transition ${isActive("/admin", true) ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`} /> 
              {isSidebarOpen && "Dashboard"}
            </div>
          </Link>
          
          <Link href="/admin/projects" onClick={handleNavClick} className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium transition group ${isActive("/admin/projects") && !pathname?.includes("status=DRAFT") ? "bg-[#F1F5F9] text-[var(--color-primary)]" : "hover:bg-[#F8FAFC] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}>
            <div className="flex items-center gap-3">
              <FolderKanban className={`w-5 h-5 shrink-0 transition ${isActive("/admin/projects") && !pathname?.includes("status=DRAFT") ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`} /> 
              {isSidebarOpen && "Projects"}
            </div>
            {isSidebarOpen && (
              <span className="bg-[#DBEAFE] text-[var(--color-primary)] text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                {totalProjects}
              </span>
            )}
          </Link>
          
          <Link href="/admin/projects?status=DRAFT" onClick={handleNavClick} className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium transition group ${pathname?.includes("status=DRAFT") ? "bg-[#F1F5F9] text-[var(--color-primary)]" : "hover:bg-[#F8FAFC] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}>
            <div className="flex items-center gap-3">
              <div className="w-5 flex justify-center shrink-0"><span className="w-2 h-2 rounded-full bg-[var(--color-warning)]"></span></div>
              {isSidebarOpen && "Drafts"}
            </div>
            {isSidebarOpen && (
              <span className="bg-[#FEF3C7] text-[var(--color-warning)] text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                {draftProjects}
              </span>
            )}
          </Link>

          <Link href="/admin/categories" onClick={handleNavClick} className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium transition group ${isActive("/admin/categories") ? "bg-[#F1F5F9] text-[var(--color-primary)]" : "hover:bg-[#F8FAFC] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}>
            <div className="flex items-center gap-3">
              <Tag className={`w-5 h-5 shrink-0 transition ${isActive("/admin/categories") ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`} /> 
              {isSidebarOpen && "Categories"}
            </div>
          </Link>

          {isSidebarOpen && <div className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mt-8 mb-3 px-2">Administration</div>}

          <Link href="/admin/settings" onClick={handleNavClick} className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium transition group ${isActive("/admin/settings") ? "bg-[#F1F5F9] text-[var(--color-primary)]" : "hover:bg-[#F8FAFC] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}>
            <div className="flex items-center gap-3">
              <Settings className={`w-5 h-5 shrink-0 transition ${isActive("/admin/settings") ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`} /> 
              {isSidebarOpen && "Settings"}
            </div>
          </Link>
          
        </nav>
        
        <div className="p-4 border-t border-[var(--color-border)] shrink-0">
           {isSidebarOpen ? (
             <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3 px-2 mb-2">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-[var(--color-primary)] flex items-center justify-center font-semibold text-sm shrink-0">
                   AU
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">Admin User</p>
                   <p className="text-xs text-[var(--color-text-secondary)] truncate">Administrator</p>
                 </div>
               </div>
               
               <Link href="/admin/settings" onClick={handleNavClick} className="flex items-center gap-3 px-3 py-2 rounded-none-none text-sm font-medium hover:bg-[#F8FAFC] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
                 <User className="w-4 h-4" /> My Profile
               </Link>

               <LogoutButton isCollapsed={false} />
               <button onClick={() => setSidebarOpen(false)} className="flex items-center justify-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition p-2 hover:bg-[#F8FAFC] rounded-none-none w-full mt-2 border border-[#EAEAEA]">
                 <ChevronLeft className="w-4 h-4" /> Collapse Sidebar
               </button>
             </div>
           ) : (
             <div className="hidden md:flex flex-col gap-4 items-center">
               <LogoutButton isCollapsed={true} />
               <button onClick={() => setSidebarOpen(true)} className="flex justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition p-2 hover:bg-[#F8FAFC] rounded-[var(--radius-button)]">
                 <Menu className="w-5 h-5" />
               </button>
             </div>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Top Navigation */}
        <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 md:px-8 shrink-0 z-20 sticky top-0">
          <div className="flex items-center flex-1 gap-4">
            {/* Mobile Sidebar Toggle */}
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition p-2 hover:bg-[#F8FAFC] rounded-[var(--radius-button)]"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Global Search */}
            <div className="relative w-full max-w-md hidden md:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-12 py-2 border border-[var(--color-border)] rounded-[var(--radius-button)] text-sm bg-[var(--color-background)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all" 
                placeholder="Search projects" 
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[10px] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded px-1.5 py-0.5 font-medium">⌘K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* Notifications Toggle */}
            <button 
              onClick={() => { setNotificationsOpen(!isNotificationsOpen); setProfileOpen(false); }}
              className={`notifications-toggle text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition relative p-2 rounded-full ${isNotificationsOpen ? 'bg-[#F1F5F9]' : 'hover:bg-[#F8FAFC]'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--color-error)] ring-2 ring-[var(--color-surface)]"></span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="notifications-dropdown absolute top-12 right-12 w-80 bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-hover py-2 z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                <div className="px-4 py-2 border-b border-[var(--color-border)] flex justify-between items-center">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  <span className="text-xs text-[var(--color-primary)] font-medium cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition">
                    <p className="text-sm text-[var(--color-text-primary)]"><span className="font-bold">System</span> updated the dashboard UI</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">10 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition">
                    <p className="text-sm text-[var(--color-text-primary)]">New project <span className="font-bold">E-commerce App</span> was created</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                    <p className="text-sm text-[var(--color-text-primary)]">Draft project <span className="font-bold">Landing Page</span> requires review</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">1 day ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-[var(--color-border)] text-center">
                  <Link href="/admin" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">View all notifications</Link>
                </div>
              </div>
            )}

            <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition p-2 hover:bg-[#F8FAFC] rounded-full">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-5 w-px bg-[var(--color-border)] mx-1"></div>
            
            {/* Profile Toggle */}
            <button 
              onClick={() => { setProfileOpen(!isProfileOpen); setNotificationsOpen(false); }}
              className={`profile-toggle flex items-center gap-3 p-1.5 pr-3 rounded-[var(--radius-button)] transition border ${isProfileOpen ? 'bg-[#F1F5F9] border-[var(--color-border)]' : 'hover:bg-[#F8FAFC] border-transparent hover:border-[var(--color-border)]'}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[var(--color-primary)] flex items-center justify-center font-semibold text-sm">
                AU
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">Admin User</p>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-tight mt-0.5">Administrator</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="profile-dropdown absolute top-14 right-0 w-56 bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-hover py-2 z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                <div className="px-4 py-3 border-b border-[var(--color-border)]">
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">Admin User</p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">admin@portfolio.com</p>
                </div>
                <div className="py-1">
                  <Link href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-gray-50 transition">
                    <User className="w-4 h-4 mr-3 text-[var(--color-text-secondary)]" /> My Profile
                  </Link>
                  <Link href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-gray-50 transition">
                    <Settings className="w-4 h-4 mr-3 text-[var(--color-text-secondary)]" /> Account Settings
                  </Link>
                </div>
                <div className="border-t border-[var(--color-border)] pt-1 pb-1">
                  <div className="px-2">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
}
