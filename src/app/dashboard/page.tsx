"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectGrid from "@/components/ProjectGrid";
import { LogOut, User, Settings, Bookmark, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"wishlist" | "settings">("wishlist");
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/wishlist");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.success) {
          setWishlist(data.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111] font-sans">
      <header className="bg-white border-b border-[#EAEAEA] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className="font-playfair font-bold text-2xl tracking-tight text-[#111]">
            Client Portal
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-[#666] hover:text-[#111] transition">
              Back to Site
            </Link>
            <div className="h-4 w-px bg-[#EAEAEA]"></div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-sm text-[#666] hover:text-red-600 transition font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 animate-fade-in-up">
        <div className="flex items-center gap-5 mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-[#EAEAEA] text-[#D8C494] rounded-full flex items-center justify-center shadow-sm">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#111]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-playfair font-medium text-[#111]">Welcome Back</h1>
            <p className="text-[#666] mt-1 text-sm font-light tracking-wide">Manage your saved projects and account settings.</p>
          </div>
        </div>

        <div className="flex gap-3 mb-8 border-b border-[#EAEAEA] pb-4 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "wishlist" 
                ? "bg-[#D8C494] text-black shadow-sm" 
                : "bg-white text-[#666] hover:text-[#111] border border-[#EAEAEA]"
            }`}
          >
            <Bookmark className="w-4 h-4" /> My Wishlist
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "settings" 
                ? "bg-[#D8C494] text-black shadow-sm" 
                : "bg-white text-[#666] hover:text-[#111] border border-[#EAEAEA]"
            }`}
          >
            <Settings className="w-4 h-4" /> Account Settings
          </button>
        </div>

        {activeTab === "wishlist" && (
          <section className="bg-white rounded-2xl border border-[#EAEAEA] p-6 sm:p-8 shadow-sm">
            {loading ? (
              <div className="text-center text-[#666] py-20 font-medium">Loading your collections...</div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EAEAEA]">
                  <Bookmark className="w-6 h-6 text-[#999]" />
                </div>
                <h3 className="text-xl font-playfair font-medium text-[#111] mb-2">Your wishlist is empty</h3>
                <p className="text-[#666] text-sm mb-6">Discover our portfolio and save projects that inspire you.</p>
                <Link 
                  href="/projects" 
                  className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold inline-flex items-center hover:bg-[#D8C494] transition shadow-sm"
                >
                  Explore Projects
                </Link>
              </div>
            ) : (
              <div className="mt-2">
                <ProjectGrid initialProjects={wishlist} />
              </div>
            )}
          </section>
        )}

        {activeTab === "settings" && (
          <section className="bg-white rounded-2xl border border-[#EAEAEA] p-6 sm:p-8 shadow-sm max-w-3xl">
            <h2 className="text-2xl font-playfair font-medium mb-8 text-[#111] border-b border-[#EAEAEA] pb-4">Profile Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Display Name</label>
                <input 
                  type="text" 
                  disabled
                  placeholder="Your Name"
                  className="w-full bg-gray-50 border border-[#EAEAEA] rounded-xl px-4 py-3 text-[#111] focus:outline-none transition cursor-not-allowed text-sm"
                  defaultValue="Registered Client"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  placeholder="your@email.com"
                  className="w-full bg-gray-50 border border-[#EAEAEA] rounded-xl px-4 py-3 text-[#111] focus:outline-none transition cursor-not-allowed text-sm"
                  defaultValue="Account Email"
                />
              </div>

              <div className="pt-6 mt-6 border-t border-[#EAEAEA]">
                <h3 className="text-lg font-playfair font-medium text-[#111] mb-4">Project Status</h3>
                <div className="bg-gray-50 border border-[#EAEAEA] rounded-xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#111] text-lg">Onboarding Complete</h4>
                    <p className="text-[#666] text-sm mt-1 leading-relaxed">
                      Your account is active. If you have been assigned a project by our team, it will appear here or you will receive direct communications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
